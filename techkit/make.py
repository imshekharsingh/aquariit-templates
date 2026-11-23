"""@techin20sec kit engine (owner, 15 Nov 2026: "port the owner's kit as it is"; design/kits/motion_kit.zip + motion_content_prompt.md).
python3 techkit/make.py <slug> [--fake-vo] [--stills t1,t2,...]   (topic: techreel/topics/<slug>.json with "engine": "kit")

1. Voice: Kokoro af_heart line by line (techreel/vo/tts.py: real word times from the model, the shared lexicon, PREFLIGHT in --fake-vo).
2. Timeline (the kit's timeline.py): lines placed with a 0.6 s lead and the topic's gap, a 2.2 s tail; named cues W(scene, "word", n) from the
   topic's "cues"; writes out/techreel/<slug>/timeline.js (window.TL) next to a copy of the scene.
3. --stills: techkit/preflight.mjs (SAFE ZONE, OVERLAP, SUBTITLES, CAPTIONS, FLOW, a stills sheet) and stops.
4. Render: headless Chromium calls window.render(i/60) and screenshots (4 workers), ffmpeg blends frame pairs (tmix, then 30 fps),
   techkit/sound.py mixes the kit's synthesized bed with recorded CC0 effects, two-pass loudness to -14.5 LUFS, true peak under -1.2 dBTP.
Split render (owner, 23 Nov 2026: real motion blur inside the 75 min limit; .github/workflows/techreel.yml): the same run in three steps,
   --voice-only (1, 2 and the sound mix, kept in lv.json), --part i/n (only that share of the frames, from the saved timeline; needs no
   Python packages), --join (the frames are already in out/.../frames: encode, mux, QA lines). Without these flags it runs start to end.
Outputs (as techreel/make.py, so the Tech reel workflow, R2 upload, voice check and Output QA work unchanged): <slug>.mp4, vo.wav, vo.json,
qa.txt (SOUND GATE, SOUND SOURCE, SOUND DETAIL) and contact.png."""
import json, math, os, re, shutil, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..')
sys.path.insert(0, os.path.join(ROOT, 'techreel', 'vo'))

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
    part = sys.argv[sys.argv.index('--part') + 1] if '--part' in sys.argv else None; join = '--join' in sys.argv
    if part or join:   # a later step of a split render: the voice and the timeline are already made
        TL = json.load(open(os.path.join(out, 'timeline.json'))); vo = json.load(open(vo_json)) if join else None
    else:
        import tts   # noqa: E402  (numpy, the voice model: not needed by --part / --join)
        vo = tts.generate(topic, vo_wav, fake=fake)
        json.dump(vo, open(vo_json, 'w'), indent=1)
        TL, order = timeline(topic, vo)
        open(os.path.join(out, 'timeline.js'), 'w').write('window.TL=' + json.dumps(TL) + ';')
        json.dump(TL, open(os.path.join(out, 'timeline.json'), 'w'), indent=1)
        if topic['scene'].endswith('.js'):   # a topic file on the shared kit frame (techkit/base.html)
            base = open(os.path.join(HERE, 'base.html')).read()
            js = open(os.path.join(ROOT, topic['scene'])).read()
            open(os.path.join(out, 'scene.html'), 'w').write(base.replace('/*TITLE*/', topic.get('topic', slug)).replace('/*TOPIC_JS*/', js))
        else:   # a standalone scene; <!--THREE--> becomes three.js r149 (MIT, techkit/vendor), inlined so the page stays one file with no origins
            html = open(os.path.join(ROOT, topic['scene'])).read()
            if '<!--THREE-->' in html:
                lib = open(os.path.join(HERE, 'vendor', 'three-0.149.0.min.js')).read()
                html = html.replace('<!--THREE-->', '<script>' + lib + '</script>', 1)
            if '<!--KIT3D-->' in html:   # the shared 3D craft (shot changes, motion blur, words, materials): techkit/kit3d.js
                html = html.replace('<!--KIT3D-->', '<script>' + open(os.path.join(HERE, 'kit3d.js')).read() + '</script>', 1)
            open(os.path.join(out, 'scene.html'), 'w').write(html)
        words = sum(len(l['text'].split()) for l in topic['lines'])
        print(f'TIMELINE: {len(TL["scenes"])} chapters, {words} words, voice {TL["scenes"][0]["start"]:.2f}-{TL["scenes"][-1]["end"]:.2f} s, total {TL["total"]:.2f} s')
        print('CUES: ' + ', '.join(f'{k} {v:.2f}' for k, v in order))
        if '--stills' in sys.argv:
            ts = sys.argv[sys.argv.index('--stills') + 1]
            r = subprocess.run(['node', os.path.join(HERE, 'preflight.mjs'), out, ts])
            sys.exit(r.returncode)
    # ---- frames: 4 workers, 60 fps (a topic with its own motion blur may ask for "fps": 30: half the frames, no frame blend) ----
    FPS = int(topic.get('fps', FPS_CAP))
    fr = os.path.join(out, 'frames'); os.makedirs(fr, exist_ok=True)
    n = int(math.ceil(TL['total'] * FPS))
    lo, hi = 0, n
    if part: i, parts = (int(x) for x in part.split('/')); lo, hi = n * i // parts, n * (i + 1) // parts
    per = (hi - lo + WORKERS - 1) // WORKERS
    procs = [] if join or '--voice-only' in sys.argv else [subprocess.Popen(['node', os.path.join(HERE, 'capture.cjs'), os.path.join(out, 'scene.html'), fr, str(FPS), str(lo + i * per), str(min(hi, lo + (i + 1) * per))])
                             for i in range(WORKERS) if lo + i * per < hi]
    mix_wav = os.path.join(out, 'mix.wav'); lv_json = os.path.join(out, 'lv.json')
    if part:
        bad = [p.wait() for p in procs]
        if any(bad): sys.exit(f'frame capture failed: exit codes {bad}')
        print(f'frames {lo}-{hi - 1} of {n} at {FPS} fps', flush=True); return
    if join: lv = json.load(open(lv_json))
    else:   # the sound while the frames render
        sys.path.insert(0, HERE); import sound   # noqa: E402
        lv = sound.render(TL, topic, vo_wav, mix_wav); json.dump(lv, open(lv_json, 'w'), default=float)
        if '--voice-only' in sys.argv: print(lv['source']); print(lv['detail']); return
    bad = [p.wait() for p in procs]
    if any(bad): sys.exit(f'frame capture failed: exit codes {bad}')
    have = len([f for f in os.listdir(fr) if f.endswith('.jpg')])
    if have != n: sys.exit(f'frames: {have} of {n} captured (a part is missing)')
    print(f'frames: {n} at {FPS} fps', flush=True)
    subj = sorted(sum((json.load(open(os.path.join(fr, f))) for f in os.listdir(fr) if f.startswith('subject_') and f.endswith('.json')), []))
    if subj: json.dump(subj, open(os.path.join(out, slug + '.subject0.json'), 'w'))   # the hero's box every 0.5 s (Output QA HERO)
    silent = os.path.join(out, 'video.mp4')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', os.path.join(fr, 'f%05d.jpg'),
                    '-vf', "tmix=frames=2:weights='1 1',fps=30,format=yuv420p" if FPS > 30 else 'format=yuv420p', '-c:v', 'libx264', '-profile:v', 'high', '-level', '4.2',
                    '-preset', 'slow', '-crf', '16', '-g', '60', silent], check=True)
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
    qa = [f'ENGINE: techkit (the owner\'s motion kit), {len(TL["scenes"])} chapters, {n} frames at {FPS} fps' + (' blended to 30' if FPS > 30 else ' (own motion blur)'),
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
