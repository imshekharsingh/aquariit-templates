"""@techin20sec kit engine (owner, 15 Nov 2026: "port the owner's kit as it is"; design/kits/motion_kit.zip + motion_content_prompt.md).
python3 techkit/make.py <slug> [--fake-vo] [--stills t1,t2,...]   (topic: techreel/topics/<slug>.json with "engine": "kit")

1. Voice: Kokoro af_heart line by line (techreel/vo/tts.py: real word times from the model, the shared lexicon, PREFLIGHT in --fake-vo).
2. Timeline (the kit's timeline.py): lines placed with a 0.6 s lead and the topic's gap, a 2.2 s tail; named cues W(scene, "word", n) from the
   topic's "cues"; writes out/techreel/<slug>/timeline.js (window.TL) next to a copy of the scene.
3. --stills: techkit/preflight.mjs (SAFE ZONE, OVERLAP, SUBTITLES, CAPTIONS, FLOW, a stills sheet) and stops.
4. Render: headless Chromium calls window.render(i/60) and screenshots (4 workers), ffmpeg blends frame pairs (tmix, then 30 fps),
   techkit/sound.py mixes the kit's synthesized bed with recorded CC0 effects, two-pass loudness to -14.5 LUFS, true peak under -1.2 dBTP.
Outputs (as techreel/make.py, so the Tech reel workflow, R2 upload, voice check and Output QA work unchanged): <slug>.mp4, vo.wav, vo.json,
qa.txt (SOUND GATE, SOUND SOURCE, SOUND DETAIL) and contact.png."""
import json, math, os, re, shutil, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..')
sys.path.insert(0, os.path.join(ROOT, 'techreel', 'vo'))
import tts   # noqa: E402

LEAD, TAIL, FPS_CAP, WORKERS = 0.6, 2.2, 60, int(os.environ.get('KIT_WORKERS', '4'))


def core(w): return re.sub(r"[^\w']", '', w).lower()


def timeline(topic, vo):
    shift = LEAD - vo['lines'][0]['start']
    scenes = [{'start': round(l['start'] + shift, 3), 'end': round(l['end'] + shift, 3),
               'words': [{'w': w['d'], 't0': round(w['s'] + shift, 3), 't1': round(w['e'] + shift, 3)} for w in l['words']]} for l in vo['lines']]
    total = round(scenes[-1]['end'] + TAIL, 3)
    cues = {}
    for name, spec in topic['cues'].items():
        si, key = spec[0], spec[1]; n = spec[2] if len(spec) > 2 else 0
        hits = [w for w in scenes[si]['words'] if core(w['w']).startswith(key.lower())]
        if len(hits) <= n: raise SystemExit(f'cue {name}: no word "{key}" #{n} in line {si}: {topic["lines"][si]["text"]}')
        cues[name] = hits[n]['t0']
    order = sorted(cues.items(), key=lambda x: x[1])
    return {'total': total, 'scenes': scenes, 'cues': cues, 'shift': round(shift, 3)}, order


def main():
    slug = sys.argv[1]; fake = '--fake-vo' in sys.argv
    topic = json.load(open(os.path.join(ROOT, 'techreel', 'topics', slug + '.json')))
    out = os.path.join('out', 'techreel', slug); os.makedirs(out, exist_ok=True)
    vo_wav, vo_json = os.path.join(out, 'vo.wav'), os.path.join(out, 'vo.json')
    vo = tts.generate(topic, vo_wav, fake=fake)
    json.dump(vo, open(vo_json, 'w'), indent=1)
    TL, order = timeline(topic, vo)
    open(os.path.join(out, 'timeline.js'), 'w').write('window.TL=' + json.dumps(TL) + ';')
    json.dump(TL, open(os.path.join(out, 'timeline.json'), 'w'), indent=1)
    if topic['scene'].endswith('.js'):   # a topic file on the shared kit frame (techkit/base.html)
        base = open(os.path.join(HERE, 'base.html')).read()
        js = open(os.path.join(ROOT, topic['scene'])).read()
        open(os.path.join(out, 'scene.html'), 'w').write(base.replace('/*TITLE*/', topic.get('topic', slug)).replace('/*TOPIC_JS*/', js))
    else:
        shutil.copy(os.path.join(ROOT, topic['scene']), os.path.join(out, 'scene.html'))
    words = sum(len(l['text'].split()) for l in topic['lines'])
    print(f'TIMELINE: {len(TL["scenes"])} chapters, {words} words, voice {TL["scenes"][0]["start"]:.2f}-{TL["scenes"][-1]["end"]:.2f} s, total {TL["total"]:.2f} s')
    print('CUES: ' + ', '.join(f'{k} {v:.2f}' for k, v in order))
    if '--stills' in sys.argv:
        ts = sys.argv[sys.argv.index('--stills') + 1]
        r = subprocess.run(['node', os.path.join(HERE, 'preflight.mjs'), out, ts])
        sys.exit(r.returncode)
    # ---- frames: 4 workers, 60 fps ----
    fr = os.path.join(out, 'frames'); os.makedirs(fr, exist_ok=True)
    n = int(math.ceil(TL['total'] * FPS_CAP)); per = (n + WORKERS - 1) // WORKERS
    procs = [subprocess.Popen(['node', os.path.join(HERE, 'capture.cjs'), os.path.join(out, 'scene.html'), fr, str(FPS_CAP), str(i * per), str(min(n, (i + 1) * per))])
             for i in range(WORKERS) if i * per < n]
    # the sound while the frames render
    sys.path.insert(0, HERE); import sound   # noqa: E402
    mix_wav = os.path.join(out, 'mix.wav')
    lv = sound.render(TL, topic, vo_wav, mix_wav)
    bad = [p.wait() for p in procs]
    if any(bad): sys.exit(f'frame capture failed: exit codes {bad}')
    print(f'frames: {n} at {FPS_CAP} fps', flush=True)
    subj = sorted(sum((json.load(open(os.path.join(fr, f))) for f in os.listdir(fr) if f.startswith('subject_') and f.endswith('.json')), []))
    if subj: json.dump(subj, open(os.path.join(out, slug + '.subject0.json'), 'w'))   # the hero's box every 0.5 s (Output QA HERO)
    silent = os.path.join(out, 'video.mp4')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS_CAP), '-i', os.path.join(fr, 'f%05d.jpg'),
                    '-vf', "tmix=frames=2:weights='1 1',fps=30,format=yuv420p", '-c:v', 'libx264', '-profile:v', 'high', '-level', '4.2',
                    '-preset', 'slow', '-crf', '17', '-g', '60', silent], check=True)
    meas = subprocess.run(['ffmpeg', '-hide_banner', '-i', mix_wav, '-af', 'loudnorm=I=-14.5:TP=-1.5:LRA=7:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
    m = json.loads(meas[meas.rindex('{'):meas.rindex('}') + 1])
    ln = (f"loudnorm=I=-14.5:TP=-1.5:LRA=7:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
          f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    final = os.path.join(out, slug + '.mp4'); dur = TL['total']; lim = .75
    for k in range(4):
        af = ln + f',afade=t=out:st={dur - .4:.2f}:d=0.4,alimiter=limit={lim:.4f}:attack=1:release=60:level=disabled'
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', silent, '-i', mix_wav, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-af', af, '-ar', '48000',
                        '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', final], check=True)
        eb = subprocess.run(['ffmpeg', '-hide_banner', '-i', final, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
        summ = eb[eb.rfind('Summary:'):]
        tp = re.search(r'Peak:\s+(-?[\d.]+) dBFS', summ); tpv = float(tp.group(1)) if tp else 0.0
        print(f'mux try {k + 1}: limiter {20 * math.log10(lim):.1f} dBFS, true peak {tpv} dBTP', flush=True)
        if tpv <= -1.2: break
        lim *= 10 ** ((-1.6 - tpv) / 20)
    lu = re.search(r'I:\s+(-?[\d.]+) LUFS', summ); li = float(lu.group(1)) if lu else 0.0
    loud_ok = -15 <= li <= -13 and tpv <= -1
    # contact sheet: one frame every ~4 s
    sheet = os.path.join(out, 'contact.png')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', final, '-vf', 'fps=1/4,scale=270:-1,tile=6x2', '-frames:v', '1', sheet], check=True)
    qa = [f'ENGINE: techkit (the owner\'s motion kit), {len(TL["scenes"])} chapters, {n} frames at {FPS_CAP} fps blended to 30',
          f'voice ends at {vo["dur"]:.2f} s (limit {topic.get("max_end")}); speed {vo.get("speed")}; reel {dur:.2f} s',
          f'voice over background during speech: {lv["voice_over_bg_db"]} dB (kit target 10+)',
          f'SOUND GATE: {"ok" if loud_ok else "OUT OF RANGE"} ({li} LUFS, true peak {tpv} dBTP; need -15 to -13, at most -1)',
          lv['source'], lv['detail']]
    qa += ['pronunciation (phonemes as spoken):'] + [f'  {l["text"]}  ->  {l.get("phonemes", "?")}' for l in vo['lines']]
    open(os.path.join(out, 'qa.txt'), 'w').write('\n'.join(qa) + '\n')
    print('\n'.join(qa)); print('wrote', final)
    if not loud_ok: sys.exit('SOUND GATE: out of range')
    if not lv['detail_ok']: sys.exit('SOUND DETAIL: under 80% of the element cues audible')


if __name__ == '__main__':
    main()
