"""Tech explainer reel generator: python3 techreel/make.py <slug> [--fake-vo] [--stills t1,t2,...]
Reads techreel/topics/<slug>.json and writes out/techreel/<slug>/: vo.wav + vo.json (voice and word timings), <slug>.mp4 (1080x1920,
30 fps, 20 s, 8 Mbps H.264 + AAC 192k), contact.png (a frame at every word onset), qa.txt (layout warnings, blank stretches, loudness).
--fake-vo estimates word timings at 3.2 words a second without a voice model; --stills renders only those times as PNGs (for checks)."""
import json
import math
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


GLIDE, SPAN = .6, 1200   # the camera's glide from one scene to the next (s) and the world distance between scenes (px)


def timeline(topic, vo):
    """The hook card, then one scene per line. A scene starts 0.35 s before its line (its content arrives during the camera's glide, so it
    never opens on its label alone) and ends where the next one starts."""
    L = vo['lines']
    hook_out = max(2.0, L[1]['start'] - .1)
    scenes = []
    for i in range(1, len(L)):
        st = hook_out - .3 if i == 1 else L[i]['start'] - .35
        en = (L[i + 1]['start'] - .35) if i + 1 < len(L) else DUR
        scenes.append(Scene(i, topic['lines'][i]['scene'], L[i], st, en))
    return hook_out, scenes


def transitions(topic, scenes):
    """Declared transitions (Mandatory Gate item 14): the engine's own glides, plus any in the topic file."""
    return [[round(s.start, 3), round(s.start + GLIDE, 3), 'glide'] for s in scenes] + list(topic.get('transitions', []))


def camera(t, scenes):
    """The camera, a pure function of t (kitmotion.js rig): cpos = which scene is framed (0 = the hook, eased glides between), and a drift
    that never stops (a slow sway, scaled x2 from the web kit's 540 px world), so no stretch of the reel is still. Returns (cpos, dx, dy)."""
    cpos = 0.0
    for s in scenes:
        cpos += B.ease_io(B.prog(t, s.start, s.start + GLIDE))
    dx = 2.4 * (math.sin(t * .55) * 9 + math.sin(t * 1.3 + 2) * 2.5)
    dy = 2.4 * (math.sin(t * .41 + 1) * 11 + math.sin(t * 1.1) * 3)
    return cpos, dx, dy


def elements(topic, vo, hook_out, scenes):
    """Every element's sound event (owner, 8 Nov 2026: every element's flow gets a compatible sound, small high, medium mid, large low):
    the hook's words (small) and its IN 20 SECONDS line (medium) and verdict stamp (large), each scene's label chip (small), and every
    element the kinds place with Frame.el / Frame.hit (collected while frames are drawn: every 0.1 s here). [{t, size, x, g}] by time."""
    B.EVENTS = {}
    t = 0.0
    while t <= DUR - .05:
        draw(t, topic, vo, hook_out, scenes)
        t = round(t + .1, 2)
    ev = list(B.EVENTS.values())
    B.EVENTS = None
    n = 0
    for ln in topic['hook']:
        for j, w in enumerate(ln.split()):
            ev.append({'t': .05 + n * .07, 'size': 's', 'x': 300 + 480 * j / max(1, len(ln.split()) - 1), 'g': .85})
            n += 1
    ev.append({'t': .6, 'size': 'm', 'x': B.W / 2, 'g': .9})
    if topic.get('verdict'):
        ev.append({'t': .22, 'size': 'l', 'x': B.W / 2, 'g': 1.2})
    ev += [{'t': s.start + .08, 'size': 's', 'x': B.W / 2, 'g': .9} for s in scenes]
    return sorted(ev, key=lambda e: e['t'])


def sound_events(topic, vo, hook_out, scenes, els=None):
    ev = {'scenes': [(0, hook_out)] + [(s.start, s.end) for s in scenes], 'plucks': [], 'bells': [.12], 'clicks': [], 'whooshes': [], 'kicks': [.04], 'thuds': [],
          'elements': els if els is not None else elements(topic, vo, hook_out, scenes)}
    for s in scenes:
        ev['whooshes'].append(s.start)
        if s.kind == 'checklist':
            ev['bells'] += [s.cue(it.get('cue')) for it in s.params.get('items', [])]
    ev['final'] = max(vo['dur'] - .2, DUR - 1.7)
    return ev


def element_line(els):
    """ELEMENTS: how many element sounds by size, and the longest gap between two (the reel should never go quiet for long)."""
    c = {k: sum(e['size'] == k for e in els) for k in 'sml'}
    ts = sorted(e['t'] for e in els)
    gap = max((b - a, a) for a, b in zip(ts, ts[1:])) if len(ts) > 1 else (0, 0)
    return f"ELEMENTS: {len(els)} element sounds (small high {c['s']}, medium mid {c['m']}, large low {c['l']}); longest gap {gap[0]:.1f} s at {gap[1]:.1f} s"



MOTES = [((i * 379) % 1080, (i * 613) % 1920, 2 + i % 3, .35 + (i % 4) * .12, i * 1.7) for i in range(18)]


def draw(t, topic, vo, hook_out, scenes):
    cpos, ddx, ddy = camera(t, scenes)
    # the light: the framed scene's tint crossfades during the glide; the blooms follow the camera at a shallow depth
    ci = min(len(scenes) - 1, max(0, int(cpos) - 1))
    tint_a = scenes[ci].tint
    tint_b = scenes[min(len(scenes) - 1, int(cpos))].tint
    bg, bare = B.lights(t, tint_a, tint_b, cpos - int(cpos) if cpos >= 1 else 0, cam=(cpos * 600 + ddx, ddy))
    fr = B.Frame(bg)
    fr.t, fr.bare = t, bare
    # light motes drifting at half depth (always moving, never in the way: small and faint)
    for x, y, r, sp, ph in MOTES:
        mx = (x - cpos * SPAN * .5 + ddx * .5) % 1240 - 80 + math.sin(t * .6 + ph) * 14
        my = (y - t * 22 * sp) % 1980 - 30
        fr.circle(mx, my, r, fill=(255, 255, 255, int(70 * (.6 + .4 * math.sin(t * 1.3 + ph)))))
    # the world: hook card at 0, scene i at i * SPAN; the camera offsets it (and centres it on the safe zone, x 510)
    base_x = -30   # the world is laid out on x 540; the safe zone's middle is x 510
    fr.dx, fr.dy = -cpos * SPAN + ddx + base_x, ddy
    B.hook_card(fr, topic['hook'], t, hook_out, verdict=topic.get('verdict'))
    for s in scenes:
        off = s.i - cpos
        if t >= s.start - .02 and abs(off) < 1:
            fr.dx, fr.dy = off * SPAN + ddx + base_x, ddy
            fr.alpha = 1 - .5 * min(1, abs(off))
            # each element leaves on its own as the line ends (staggered, its own direction), from 0.25 s before the glide
            fr.begin(s, 0.0 if s is scenes[-1] else B.prog(t, s.end - .25, s.end + .45))
            B.chip(fr, s.label, s.tint, B.prog(t, s.start, s.start + .4))
            KINDS[s.kind](fr, s, t)
            fr.end_el()
            fr.scene = None
    fr.alpha, fr.dx, fr.dy = 1.0, 0.0, 0.0
    # the HUD: part progress and captions stay still while the world moves
    ha = B.ease_out(B.prog(t, hook_out - .2, hook_out + .3))
    if ha > 0:
        B.header(fr, topic['topic'], t, [(s.start if k else hook_out, s.end) for k, s in enumerate(scenes)], ha)
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


SAFE = (60, 250, 960, 1570)   # Instagram's safe zone in 1080x1920 (Mandatory Gate item 3, design/mandatory.md; owner, 7 Nov 2026)


def layout_lines(topic, vo, hook_out, scenes):
    """Mandatory Gate items 3-4 (the same rules as scripts/showreel/layout.mjs): every text box drawn at every 0.5 s inside the safe zone,
    and no two texts overlapping by more than 6 px each way (a crossfade under 30 % opacity does not count)."""
    safe, over = {}, {}
    gl = transitions(topic, scenes)
    t = 0.0
    while t <= DUR - .05:
        fr, _ = draw(t, topic, vo, hook_out, scenes)
        moving = any(a - .05 <= t <= b + .05 for a, b, *_ in gl)   # text crossing the frame edge in a declared glide is motion, not layout
        on = [b for b in fr.boxes if b[5] >= .3 and b[3] > 0 and b[1] < B.W and b[4] > 0 and b[2] < B.H]
        for s, l, tp, r, bt, a in on:
            if not moving and (l < SAFE[0] - 1 or r > SAFE[2] + 1 or tp < SAFE[1] - 1 or bt > SAFE[3] + 1):
                safe.setdefault(s, f'{t:.1f} s: "{s}" at {l:.0f}-{r:.0f} x, {tp:.0f}-{bt:.0f} y')
        for i in range(len(on)):
            for j in range(i + 1, len(on)):
                a, b = on[i], on[j]
                if a[0] == b[0] and abs(a[1] - b[1]) < 12 and abs(a[2] - b[2]) < 12:
                    continue
                if min(a[3], b[3]) - max(a[1], b[1]) > 6 and min(a[4], b[4]) - max(a[2], b[2]) > 6:
                    over.setdefault(a[0] + '|' + b[0], f'{t:.1f} s: "{a[0]}" x "{b[0]}"')
        t = round(t + .5, 2)
    return ['SAFE ZONE: ' + ('OUTSIDE x 60-960, y 250-1570: ' + ' | '.join(safe.values()) if safe else 'ok'),
            'OVERLAP: ' + (' | '.join(over.values()) if over else 'none'),
            'BAND: by layout (scenes in y 430-1196, captions below): REVIEW the stills', 'HOOK: the hook card leaves before the scenes: REVIEW the stills'], len(safe) + len(over)


FLOW = dict(CUT=25, DEAD=.5, DEAD_RUN=1, CONT=.85, STROBE=60)   # the same thresholds as scripts/showreel/flow.mjs (web and tech), design/mandatory.md


def flow_lines(topic, vo, hook_out, scenes):
    """Mandatory Gate items 14-17 (FLOW, scripts/showreel/flow.mjs is the reference): the frame every 0.1 s on a 54x96 copy, the mean absolute RGB
    change between neighbours (0-255); cuts (a jump over CUT from slow motion, outside topic "transitions": [[t0, t1, kind]]), dead runs (1 s+
    under DEAD outside topic "holds"), continuity (share of 0.3 s windows between DEAD and CUT), strobes (over STROBE and back within 1 s)."""
    F, E, ST = FLOW, .051, .1
    holds, trans = topic.get('holds', []), transitions(topic, scenes)
    fr, t = [], 0.0
    while t <= DUR - .05:
        _, img = draw(t, topic, vo, hook_out, scenes)
        fr.append(np.asarray(Image.fromarray(img).resize((54, 96), Image.BILINEAR), dtype=np.float32))
        t = round(t + ST, 2)
    md = lambda a, b: float(np.abs(a - b).mean())
    d = [md(fr[i - 1], fr[i]) for i in range(1, len(fr))]
    ts = [round(i * ST, 2) for i in range(len(d))]
    held = lambda i: any(ts[i] >= x - E and ts[i] + ST <= z + E for x, z, *_ in holds)
    decl = lambda i: any(ts[i] + ST > x - E and ts[i] < z + E for x, z, *_ in trans)
    strobe, strobes = set(), []
    for i in range(len(d)):
        if d[i] > F['STROBE'] and i not in strobe:
            j = next((k for k in range(i + 1, min(i + 11, len(d))) if d[k] > F['STROBE']), None)
            if j is not None and md(fr[i], fr[j + 1]) < min(d[i], d[j]) * .5:
                strobe |= {i, j}
                strobes.append((ts[i], max(d[i], d[j]), any(len(w) > 2 and w[2] == 'flash' and ts[i] + ST > w[0] - E and ts[i] < w[1] + E for w in trans)))
    cuts = []
    for i in range(len(d)):
        if d[i] > F['CUT'] and (d[i] > F['STROBE'] or i == 0 or d[i - 1] < F['CUT'] / 2) and not decl(i) and i not in strobe:
            if cuts and cuts[-1][0] == i - 1:
                cuts[-1] = (i, cuts[-1][1], max(cuts[-1][2], d[i]))
            else:
                cuts.append((i, ts[i], d[i]))
    dead, a = [], -1
    for i in range(len(d) + 1):
        q = i < len(d) and d[i] < F['DEAD'] and not held(i)
        if q and a < 0:
            a = i
        if not q and a >= 0:
            if (i - a) * ST >= F['DEAD_RUN'] - 1e-6:
                dead.append((ts[a], ts[a] + (i - a) * ST))
            a = -1
    n = ok = 0
    for i in range(len(d)):
        if decl(i) or i in strobe:   # a hold excuses a dead run, not the continuity score
            continue
        n += 1
        m = (d[max(0, i - 1)] + d[i] + d[min(len(d) - 1, i + 1)]) / 3
        ok += F['DEAD'] <= m <= F['CUT']
    cont = ok / n if n else 1
    med = sorted(d)[len(d) // 2] if d else 0
    und = sum(1 for s in strobes if not s[2])
    lines = ['FLOW: cuts %d' % len(cuts) + (' (undeclared jumps over %d: ' % F['CUT'] + ', '.join('%.1f s (%d)' % (c[1], c[2]) for c in cuts) + '; make it a continuous move, or declare it in the topic\'s "transitions")' if cuts else ''),
             'FLOW: dead runs ' + (', '.join('%.1f-%.1f s' % r for r in dead) + ' (under %s for 1 s or more: keep something moving, or add it to the topic\'s "holds")' % F['DEAD'] if dead else 'none'),
             'FLOW: continuity %d%%' % round(cont * 100) + (' (UNDER 85%: too much time still or jumping)' if cont < F['CONT'] else '') + ' (median step %.1f, %d declared transitions)' % (med, len(trans)),
             'FLOW: strobes %d' % len(strobes) + (' (' + ', '.join('%.1f s (%d, %s)' % (s[0], s[1], 'declared' if s[2] else 'NOT DECLARED') for s in strobes) + ')' if strobes else '') + (' (at most 1)' if len(strobes) > 1 else '')]
    return lines, len(cuts) + len(dead) + (cont < F['CONT']) + und + (len(strobes) > 1)


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
        if cur and len(B.wrap([words[j] for j in cur + [i]], 72, 820, 800)) > 2:
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
    # a topic may run a little past 20 s when its lines need room to breathe (owner, 26 Oct: up to about 21 s)
    global DUR, N
    DUR = float(topic.get('dur', DUR)); N = int(FPS * DUR)
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
        lines, bad = layout_lines(topic, vo, hook_out, scenes)
        fl, fbad = flow_lines(topic, vo, hook_out, scenes)
        els = elements(topic, vo, hook_out, scenes)
        print('\n'.join(lines + fl + [element_line(els)]))
        if '--events' in sys.argv:
            for e in els:
                print(f"  {e['t']:6.2f}s  {e['size']}  x {e['x']:.0f}  g {e['g']}")
        sys.exit(1 if bad + fbad else 0)
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
        ink.append(float(np.abs(img[B.CONTENT_TOP:B.CONTENT_BOTTOM:8, 4::8].astype(np.float32) - fr.bare[B.CONTENT_TOP // 8:B.CONTENT_BOTTOM // 8].astype(np.float32)).mean()))
        if f in onsets:
            thumbs.append((t, onsets[f], Image.fromarray(img)))
        if f % 60 == 0:
            print(f'frame {f}/{N}', flush=True)
    ff.stdin.close()
    ff.wait()
    # sound, then the mux with a two-pass loudness match to about -14.5 LUFS, true peak at or below -1 dBFS
    mix_wav = os.path.join(out, 'mix.wav')
    els = elements(topic, vo, hook_out, scenes)
    lv = synth.render(sound_events(topic, vo, hook_out, scenes, els), vo_wav, DUR, mix_wav, topic.get('chords'))
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
    lvl = {k: v for k, v in lv.items() if not k.startswith('detail')}
    qa = [f'voice ends at {vo["dur"]:.2f} s (limit {topic.get("max_end", tts.MAX_END)}); speed {vo.get("speed")}', f'levels in the mix: {lvl}',
          f'loudness: {lufs.group(1) if lufs else "?"} LUFS integrated, true peak {tp.group(1) if tp else "?"} dBFS (target -14 to -15, <= -1)']
    run = 0
    for f in range(int(hook_out * FPS), N - int(.4 * FPS)):
        run = run + 1 if ink[f] < 2.0 else 0   # under 2 levels of difference from the bare background: nothing on screen
        if run == int(.3 * FPS) + 1:
            qa.append(f'blank stretch over 0.3 s near {f / FPS:.2f} s')
    qa += [f'{t:5.2f}s  {w}' for w, t in sorted(warns.items(), key=lambda x: x[1])]
    qa += layout_lines(topic, vo, hook_out, scenes)[0]
    qa += ['override readings (in "Can an ___ shop?"):'] + [f'  {k}: ' + ' | '.join(f'{f} -> {p}' for f, p in v.items()) for k, v in vo.get('say_checks', {}).items()]
    qa += ['pronunciation (phonemes as spoken):'] + [f'  {l["text"]}  ->  {l.get("phonemes", "?")}' for l in vo['lines']]
    # Mandatory Gate item 8 (design/mandatory.md; owner, 7 Nov 2026): -14 LUFS +-1, true peak at most -1 dBTP, or the render fails
    li, tpv = float(lufs.group(1)) if lufs else 0.0, float(tp.group(1)) if tp else 0.0
    loud_ok = -15 <= li <= -13 and tpv <= -1
    qa.append(f'SOUND GATE: {"ok" if loud_ok else "OUT OF RANGE"} ({li} LUFS, true peak {tpv} dBTP; need -15 to -13, at most -1)')
    qa.append(element_line(els))
    qa.append(lv.pop('detail'))   # SOUND DETAIL (the element-detail bus, scripts/showreel/detail.py): 80%+ audible or the render fails
    detail_ok = lv.pop('detail_ok')
    open(os.path.join(out, 'qa.txt'), 'w').write('\n'.join(qa) + '\n')
    contact_sheet(thumbs, os.path.join(out, 'contact.png'))
    print('\n'.join(qa))
    print('wrote', final)
    if not loud_ok:
        sys.exit('SOUND GATE: out of range; fix the mix before the reel is kept')
    if not detail_ok:
        sys.exit('SOUND DETAIL: under 80% of the element cues audible; fix the mix before the reel is kept')


if __name__ == '__main__':
    main()
