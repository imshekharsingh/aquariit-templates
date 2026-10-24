"""Tech explainer reel generator: python3 techreel/make.py <slug> [--fake-vo] [--stills t1,t2,...]
Reads techreel/topics/<slug>.json and writes out/techreel/<slug>/: vo.wav + vo.json (voice and word timings), <slug>.mp4 (1080x1920,
30 fps, 20 s, 8 Mbps H.264 + AAC 192k), contact.png (a frame at every word onset), qa.txt (layout warnings, blank stretches, loudness).
--fake-vo estimates word timings at 3.2 words a second without a voice model; --stills renders only those times as PNGs (for checks)."""
import json
import os
import re
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from scenes import base as B          # noqa: E402
from scenes.kinds import KINDS        # noqa: E402
from vo import tts                    # noqa: E402
from audio import synth               # noqa: E402

FPS, DUR = 30, 20.0
N = int(FPS * DUR)


def norm(w):
    return re.sub(r'[^a-z0-9]', '', w.lower())


class Scene:
    def __init__(self, i, spec, line, start, end):
        self.i, self.label, self.tint, self.kind = i, spec['label'], spec.get('tint', 'blue'), spec['kind']
        self.params, self.line, self.start, self.end = spec.get('params', {}), line, start, end

    def cue(self, word, nth=1):
        """When `word` is spoken in this scene's line (or shortly after the scene starts)."""
        if word:
            n = nth
            for w in self.line['words']:
                if norm(w['d']) == norm(word):
                    n -= 1
                    if n == 0:
                        return w['s']
        return self.start + .3


def timeline(topic, vo):
    L = vo['lines']
    hook_out = max(2.0, L[1]['start'] - .1)
    scenes = []
    for i in range(1, len(L)):
        st = hook_out if i == 1 else L[i]['start'] - .12
        en = (L[i + 1]['start'] - .12) if i + 1 < len(L) else DUR
        scenes.append(Scene(i, topic['lines'][i]['scene'], L[i], st, en))
    return hook_out, scenes


def sound_events(topic, vo, hook_out, scenes):
    ev = {'scenes': [(0, hook_out)] + [(s.start, s.end) for s in scenes], 'plucks': [], 'bells': [.12], 'clicks': [], 'whooshes': [], 'kicks': [.04], 'thuds': []}
    for s in scenes:
        ev['whooshes'].append(s.start)
        ev['clicks'].append(s.start + .08)
        p = s.params
        for key in ('open', 'hub_cue', 'inner_cue'):
            if p.get(key):
                ev['plucks'].append(s.cue(p[key]))
        for key in ('a', 'b'):
            if isinstance(p.get(key), dict) and p[key].get('cue'):
                ev['plucks'].append(s.cue(p[key]['cue']))
        if s.kind == 'guard':
            ev['thuds'].append(s.cue(p.get('stop_cue')))
        if s.kind == 'checklist':
            ev['bells'] += [s.cue(it.get('cue')) for it in p.get('items', [])]
        ev['plucks'].append(s.start + .3)
    ev['final'] = max(vo['dur'] - .2, DUR - 1.7)
    return ev


def draw(t, topic, vo, hook_out, scenes):
    # background tint follows the scene, crossfading over the cut
    cur = next((s for s in scenes if s.start <= t < s.end), scenes[-1] if t >= scenes[-1].start else None)
    if cur is None:
        bg = B.background(scenes[0].tint)
    else:
        prev = scenes[cur.i - 2] if cur.i >= 2 else None
        k = B.prog(t, cur.start - .15, cur.start + .25)
        bg = B.blend_bg(prev.tint if prev else scenes[0].tint, cur.tint, k)
    fr = B.Frame(bg)
    # the hook card (line 1 is the title)
    B.hook_card(fr, topic['hook'], t, hook_out, accent=topic.get('accent', 'green'))
    # header and progress once the hook has gone
    ha = B.ease_out(B.prog(t, hook_out - .2, hook_out + .3))
    if ha > 0:
        B.header(fr, topic['topic'], B.prog(t, hook_out, DUR - .4), ha)
    # scenes: the current one, and the previous one sliding up and fading for 0.25 s after the cut
    for s in scenes:
        if s.start - .02 <= t < s.end + .1:
            out = B.prog(t, s.end - .14, s.end + .1) if s is not scenes[-1] else 0   # a quick handover: the old scene is gone 0.1 s into the next
            fr.alpha, fr.dy = 1 - out, -60 * B.ease_io(out)
            B.chip(fr, s.label, s.tint, B.prog(t, s.start, s.start + .4))
            KINDS[s.kind](fr, s, t)
            fr.alpha, fr.dy = 1.0, 0.0
    # captions for the spoken line (line 1 is the hook card instead)
    for li, line in enumerate(vo['lines'][1:], start=1):
        nxt = vo['lines'][li + 1]['start'] if li + 1 < len(vo['lines']) else DUR - .3
        if line['start'] - .1 <= t < nxt - .1:
            ch = chunks(line, topic['lines'][li].get('chunks'))
            cur = 0
            for ci, c in enumerate(ch):
                if t >= line['words'][c[0]]['s'] - .08:
                    cur = ci
            B.captions(fr, line['words'], t, ch[cur])
    fade = 1 - B.prog(t, DUR - .4, DUR)
    return fr, fr.finish(fade=fade)


def chunks(line, counts=None):
    """Caption chunks for a line: from the topic file (word counts), or as many words as fit two caption rows, breaking after a comma when it can."""
    words = [w['d'] for w in line['words']]
    if counts:
        out, i = [], 0
        for c in counts:
            out.append(list(range(i, min(len(words), i + c))))
            i += c
        return [c for c in out if c]
    out, cur = [], []
    for i, w in enumerate(words):
        if cur and len(B.wrap([words[j] for j in cur + [i]], 72, 860, 800)) > 2:
            # break after the last comma in the chunk if there is one late enough, else here
            k = max((n for n, j in enumerate(cur) if words[j].endswith(',') and n >= 2), default=None)
            if k is not None and k < len(cur) - 1:
                out.append(cur[:k + 1]); cur = cur[k + 1:]
            else:
                out.append(cur); cur = []
        cur.append(i)
    if cur:
        out.append(cur)
    return out


_bgb = {}


def bg_band(tint):
    if tint not in _bgb:
        a = np.asarray(B.background(tint).resize((B.W, B.H), Image.LANCZOS), dtype=np.float32)
        _bgb[tint] = a[B.CONTENT_TOP:B.CONTENT_BOTTOM:8, ::8]
    return _bgb[tint]


def contact_sheet(thumbs, path, cols=6):
    tw, th = 216, 384
    rows = (len(thumbs) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * tw, rows * (th + 34)), (4, 6, 12))
    d = ImageDraw.Draw(sheet)
    f = B.font(11, 700)
    for i, (t, word, im) in enumerate(thumbs):
        x, y = (i % cols) * tw, (i // cols) * (th + 34)
        sheet.paste(im.resize((tw, th), Image.LANCZOS), (x, y))
        d.text((x + 6, y + th + 6), f'{t:5.2f}s  {word}', font=f, fill=(200, 210, 230))
    sheet.save(path)


def main():
    slug = sys.argv[1]
    fake = '--fake-vo' in sys.argv
    topic = json.load(open(os.path.join(HERE, 'topics', slug + '.json')))
    out = os.path.join('out', 'techreel', slug)
    os.makedirs(out, exist_ok=True)
    vo_wav, vo_json = os.path.join(out, 'vo.wav'), os.path.join(out, 'vo.json')
    vo = tts.generate(topic, vo_wav, fake=fake)
    json.dump(vo, open(vo_json, 'w'), indent=1)
    hook_out, scenes = timeline(topic, vo)
    if '--stills' in sys.argv:
        ts = [float(x) for x in sys.argv[sys.argv.index('--stills') + 1].split(',')]
        for t in ts:
            fr, img = draw(t, topic, vo, hook_out, scenes)
            Image.fromarray(img).save(os.path.join(out, f'still-{t:05.2f}.png'))
            for w in fr.warnings:
                print(f'{t:5.2f}s  {w}')
        return
    onsets = {}
    for li, line in enumerate(vo['lines']):
        for w in line['words']:
            onsets.setdefault(int(round((w['s'] + .12) * FPS)), w['d'])
    mp4_silent = os.path.join(out, 'video.mp4')
    ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{B.W}x{B.H}', '-r', str(FPS), '-i', '-',
                           '-c:v', 'libx264', '-preset', 'medium', '-b:v', '8M', '-maxrate', '10M', '-bufsize', '16M', '-pix_fmt', 'yuv420p', mp4_silent], stdin=subprocess.PIPE)
    warns, thumbs, ink = {}, [], []
    for f in range(N):
        t = f / FPS
        fr, img = draw(t, topic, vo, hook_out, scenes)
        ff.stdin.write(img.tobytes())
        for w in fr.warnings:
            warns.setdefault(w, t)
        cur = next((s for s in scenes if s.start <= t < s.end), scenes[0])
        ink.append(float(np.abs(img[B.CONTENT_TOP:B.CONTENT_BOTTOM:8, ::8].astype(np.float32) - bg_band(cur.tint)).mean()))
        if f in onsets:
            thumbs.append((t, onsets[f], Image.fromarray(img)))
        if f % 60 == 0:
            print(f'frame {f}/{N}', flush=True)
    ff.stdin.close()
    ff.wait()
    # sound, then the mux with a two-pass loudness match to about -14.5 LUFS, true peak at or below -1 dBFS
    mix_wav = os.path.join(out, 'mix.wav')
    lv = synth.render(sound_events(topic, vo, hook_out, scenes), vo_wav, DUR, mix_wav, topic.get('chords'))
    meas = subprocess.run(['ffmpeg', '-hide_banner', '-i', mix_wav, '-af', 'loudnorm=I=-14.5:TP=-1.5:LRA=7:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
    m = json.loads(meas[meas.rindex('{'):meas.rindex('}') + 1])
    ln = (f"loudnorm=I=-14.5:TP=-1.5:LRA=7:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
          f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    final = os.path.join(out, slug + '.mp4')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', mp4_silent, '-i', mix_wav, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-af', ln, '-ar', '48000',
                    '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', final], check=True)
    eb = subprocess.run(['ffmpeg', '-hide_banner', '-i', final, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    summ = eb[eb.rfind('Summary:'):]
    lufs = re.search(r'I:\s+(-?[\d.]+) LUFS', summ)
    tp = re.search(r'Peak:\s+(-?[\d.]+) dBFS', summ)
    # QA: blank stretches in the content band (after the hook), layout warnings, loudness
    qa = [f'voice ends at {vo["dur"]:.2f} s (limit {tts.MAX_END}); speed {vo.get("speed")}', f'levels in the mix: {lv}',
          f'loudness: {lufs.group(1) if lufs else "?"} LUFS integrated, true peak {tp.group(1) if tp else "?"} dBFS (target -14 to -15, <= -1)']
    run = 0
    for f in range(int(hook_out * FPS), N - int(.4 * FPS)):
        run = run + 1 if ink[f] < 2.0 else 0   # under 2 levels of difference from the bare background: nothing on screen
        if run == int(.3 * FPS) + 1:
            qa.append(f'blank stretch over 0.3 s near {f / FPS:.2f} s')
    qa += [f'{t:5.2f}s  {w}' for w, t in sorted(warns.items(), key=lambda x: x[1])]
    qa += ['override readings (in "Can an ___ shop?"):'] + [f'  {k}: ' + ' | '.join(f'{f} -> {p}' for f, p in v.items()) for k, v in vo.get('say_checks', {}).items()]
    qa += ['pronunciation (phonemes as spoken):'] + [f'  {l["text"]}  ->  {l.get("phonemes", "?")}' for l in vo['lines']]
    open(os.path.join(out, 'qa.txt'), 'w').write('\n'.join(qa) + '\n')
    contact_sheet(thumbs, os.path.join(out, 'contact.png'))
    print('\n'.join(qa))
    print('wrote', final)


if __name__ == '__main__':
    main()
