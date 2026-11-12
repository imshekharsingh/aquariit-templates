# Output QA (owner, 12 Nov 2026: "Every issue that I report, build a check for that which avoids using our session but does it using GitHub").
# Runs on GitHub on the FINAL MP4 (its frames and its mixed audio), never on the scene code or the cue list, after every Showreel and Tech reel
# render (and by hand: Actions -> Output QA). One line per check: "OQA <CHECK>: PASS|FAIL|WARN|SKIP <numbers> [guards: <owner-feedback line>]",
# then "OUTPUT QA: PASS" or "OUTPUT QA: FAIL (n): ...". Exit 1 on any FAIL: the reel is NOT READY (scripts/qa/notify.sh tells its issue).
# Every check names the design/owner-feedback.md line it guards. A new owner complaint becomes a new check here the same day.
#
# Usage: python3 scripts/qa/output-qa.py <reel.mp4> <config.json> [--log render.log ...] [--summary $GITHUB_STEP_SUMMARY] [--fails out.txt]
#   config: a Showreel config (scripts/explainer, scripts/channel3) or a tech topic (techreel/topics). Optional "qa" block:
#     "qa": {"guess": {"answer": "#b3392b", "reveal": 8.44 | {"say": "red every"}, "box": [l, t, r, b], "css_width": 540},
#            "edges_ok": [{"from": t | {"say": ...}, "to": ..., "sides": ["left", "right"], "why": "the workshop walls run past the frame"}],
#            "mute":  {"before": [t0, t1] | {"say": "nothing moves"}, "after": [t0, t1] | {"say": "it sinks"}, "span": 1.5}}
#   ("say" = the first words of the line, found in the final audio's own recogniser timings; the window runs "span" s from there.)
# Needs ffmpeg, numpy, Pillow; faster-whisper for the voice checks and tesseract for the numbers check (SKIP, said aloud, without them).
import json, os, re, subprocess, sys, tempfile
import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'showreel'))
from voicecheck import words as vwords, plain   # the same word split as the voice check (digits spelled as Kokoro says them)

FB = {   # the owner-feedback.md lines each check guards
    'pace': '12 Nov "audio is super slowed"; 8 Nov "rushed"',
    'stray': '11 Nov voice check: words heard that the script never says',
    'sound': '12 Nov "sound elements feel cheap, as if from kids\' toys"; 8 Nov "tick sounds missing"',
    'loud': '8 Nov "LISTEN to the finished audio" (-14 LUFS, Mandatory Gate 8)',
    'colour': '12 Nov "colour grading is horrible"',
    'edges': '12 Nov "cards and photos cut at the frame edges ... a lamp cut at the edge"',
    'guess': '12 Nov "the tower was already painted red while the viewer was asked"',
    'numbers': '12 Nov "a counter rolled through 8 before \'seven\'"',
    'dead': '7 Nov "a reel barely moved"; 12 Nov "2.4 s with nothing at the payoff"',
    'mute': '12 Nov "the payoff was a 4% scale change ... the fix is invisible"',
}
# thresholds (calibrated 12 Nov 2026 on showreel-34-press, showreel-c3-eiffel-red and showreel-tech-stop-tracking; see design/owner-feedback.md)
T = dict(full_wps=4.0, short_words=6, min_overall=2.0, min_speed=.95, stray_p=.5,
         sat_s=.6, sat_v=.4, sat_frac=.25, hue_jump=45, ring_sat=.12,
         edge_frac=.06, edge_dist=48, edge_secs=1.0,
         ocr_conf=70, num_win=1.0,
         dead_secs=1.5, vis_px=20, vis_frac=.003, onset_db=9, onset_floor=-45,
         mute_frac=.02)

out, fails = [], []


def line(check, status, msg):
    s = f'OQA {check}: {status} {msg} [guards: {FB.get(check.lower(), "")}]'
    out.append(s); print(s, flush=True)
    if status == 'FAIL': fails.append(f'{check}: {msg}')


def pcm16k(mp4):
    try: return np.frombuffer(ff(['-i', mp4, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-']), np.float32)
    except subprocess.CalledProcessError: return np.zeros(0, np.float32)   # no audio track (LOUD fails it)


def ff(args, **kw):
    return subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error'] + args, capture_output=True, check=True, **kw).stdout


def probe(mp4):
    t = subprocess.run(['ffmpeg', '-hide_banner', '-i', mp4], capture_output=True, text=True).stderr
    h, m, s = re.search(r'Duration: (\d+):(\d+):([\d.]+)', t).groups()
    return int(h) * 3600 + int(m) * 60 + float(s)


def frames(mp4, fps, w, h, gray=False):
    raw = ff(['-i', mp4, '-vf', f'fps={fps},scale={w}:{h}:flags=area', '-f', 'rawvideo', '-pix_fmt', 'gray' if gray else 'rgb24', '-'])
    c = 1 if gray else 3
    return np.frombuffer(raw, np.uint8).reshape(-1, h, w, c) if not gray else np.frombuffer(raw, np.uint8).reshape(-1, h, w)


def hsv(a):
    a = a.astype(np.float32) / 255; mx, mn = a.max(-1), a.min(-1); d = mx - mn
    r, g, b = a[..., 0], a[..., 1], a[..., 2]; dd = np.where(d == 0, 1, d)
    h = np.where(mx == r, ((g - b) / dd) % 6, np.where(mx == g, (b - r) / dd + 2, (r - g) / dd + 4)) * 60
    return np.where(d == 0, 0, h), np.where(mx == 0, 0, d / np.where(mx == 0, 1, mx)), mx


def config(path):
    c = json.load(open(path))
    if 'lines' in c and 'slug' in c:   # a tech topic
        text = ' '.join(l['text'] for l in c['lines'])
        speeds = [c.get('speed')] + [l.get('speed') for l in c['lines']]
        return c, text, [s for s in speeds if s is not None], 2.0, 'tech', f"showreel-tech-{c['slug']}"
    v = c.get('voice') or {}
    speeds = [v.get('speed')] + list(v.get('speeds') or [])
    ch = 'c3' if '/channel3/' in path or c.get('name', '').startswith('showreel-c3-') else 'web'
    return c, v.get('text', ''), [s for s in speeds if s is not None], float(c.get('cover', 1.6)), ch, c.get('name', '')


def transcribe(mp4):
    from faster_whisper import WhisperModel
    pcm = pcm16k(mp4)
    if not len(pcm): return []
    segs, _ = WhisperModel('small.en', device='cpu', compute_type='int8').transcribe(pcm, word_timestamps=True, beam_size=5)
    heard = []   # (split word, start, end, probability, raw token)
    for s in segs:
        for w in s.words:
            for x in vwords(w.word):
                heard.append((x, w.start, w.end, w.probability, w.word.strip()))
    return heard


def align(want, heard):
    import difflib
    got = [h[0] for h in heard]
    sm = difflib.SequenceMatcher(a=want, b=got, autojunk=False)
    m = {}
    for blk in sm.get_matching_blocks():
        for k in range(blk.size): m[blk.a + k] = blk.b + k
    return m


def find_say(say, heard):
    """The start time of the first place the final audio says these words (the recogniser's own timings)."""
    ws = vwords(say); got = [h[0] for h in heard]
    for i in range(len(got) - len(ws) + 1):
        if got[i:i + len(ws)] == ws: return heard[i][1]
    return None


def window(spec, heard, span):
    if isinstance(spec, (list, tuple)): return float(spec[0]), float(spec[1])
    if isinstance(spec, (int, float)): return float(spec), float(spec) + span
    t = find_say(spec.get('say', ''), heard) if heard else None
    return (t, t + float(spec.get('span', span))) if t is not None else None


def voice_checks(text, speeds, heard):
    slow = [s for s in speeds if s < T['min_speed']]
    if slow: line('PACE', 'FAIL', f'voice speed {min(slow)} in the config (natural speed is 1.0; at least {T["min_speed"]})')
    if heard is None:
        line('PACE', 'SKIP', 'no recogniser on this runner (faster-whisper): per-sentence pace not measured'); return
    script = plain(text); want = vwords(script)
    if not want: line('PACE', 'SKIP', 'no narration'); return
    m = align(want, heard)
    sents, i = [], 0
    for s in re.findall(r'(?:[^.?!]|\.(?=\d))+[.?!]?', script):
        n = len(vwords(s))
        if n: sents.append((s.strip(), i, i + n)); i += n
    rows, bad = [], []
    for s, a0, a1 in sents:
        hs = [m[j] for j in range(a0, a1) if j in m]
        if len(hs) < 2: rows.append(f'"{s[:28]}" not heard'); bad.append(f'"{s[:40]}" not heard'); continue
        st, en = heard[hs[0]][1], heard[hs[-1]][2]; n = a1 - a0; wps = n / max(.01, en - st)
        tag = 'ok'
        if wps > T['full_wps']: tag = 'quick (short line, warning)' if n <= T['short_words'] else 'FAST'
        if tag == 'FAST': bad.append(f'"{s[:40]}" {wps:.2f} words/s at {st:.1f} s')
        rows.append(f'{st:.1f}s {n}w {wps:.2f}/s {tag}')
    ms = sorted(m.values())
    span = heard[ms[-1]][2] - heard[ms[0]][1] if ms else 0
    overall = len(want) / max(span, .01)
    detail = f'{len(want)} words in {span:.1f} s = {overall:.2f} words/s overall; sentences: ' + '; '.join(rows)
    if bad: line('PACE', 'FAIL', f'{len(bad)} sentence(s) over {T["full_wps"]} words/s or lost: ' + '; '.join(bad) + ' | ' + detail)
    elif overall < T['min_overall']: line('PACE', 'FAIL', f'speech sounds slowed: {overall:.2f} words/s overall (at least {T["min_overall"]}) | ' + detail)
    elif not slow: line('PACE', 'PASS', detail)
    # stray words: anything the recogniser hears after the script's last word, in the final mix
    tail = [h for h in heard[(ms[-1] + 1 if ms else 0):]]
    loud = [h for h in tail if h[3] >= T['stray_p']]
    if loud: line('STRAY', 'FAIL', 'words after the script ends: ' + ', '.join(f'"{h[4]}" {h[1]:.1f} s ({h[3]:.2f})' for h in loud))
    else: line('STRAY', 'PASS', 'nothing heard after the last scripted word' + (f' (recogniser noise under {T["stray_p"]}: ' + ', '.join(f'"{h[4]}" {h[3]:.2f}' for h in tail) + ')' if tail else ''))


def sound_checks(mp4, logs):
    t = subprocess.run(['ffmpeg', '-hide_banner', '-i', mp4, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    try:
        i = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', t)[-1]); p = float(re.findall(r'Peak:\s+(-?[\d.inf]+)', t)[-1])
        ok = -15 <= i <= -13 and p <= -1
        line('LOUD', 'PASS' if ok else 'FAIL', f'{i} LUFS, true peak {p} dBTP on the final MP4 (need -15 to -13, at most -1)')
    except (IndexError, ValueError):
        line('LOUD', 'FAIL', 'no audio track in the final MP4')
    txt = ''.join(open(f, errors='replace').read() for f in logs if os.path.exists(f))
    src = re.findall(r'^.*SOUND SOURCE: .*$', txt, re.M); det = re.findall(r'^.*SOUND DETAIL: .*$', txt, re.M)
    if not txt: line('SOUND', 'SKIP', 'no render log given (the render workflows pass it): SOUND SOURCE not read'); return
    if not src: line('SOUND', 'FAIL', 'the render log has no SOUND SOURCE line'); return
    s = src[-1].strip()
    if 'synthesized' in s: line('SOUND', 'FAIL', s[:220])
    else:
        d = det[-1].strip() if det else 'SOUND DETAIL: not printed'
        m = re.search(r'(\d+) of (\d+)', d); pct = 100 * int(m.group(1)) / max(1, int(m.group(2))) if m else None
        line('SOUND', 'FAIL' if (pct is not None and pct < 80) else 'PASS', f'{s[:120]} | {d[:120]}')


def colour_checks(F, fps, cover):
    """Saturated fill every 0.5 s (and the cover); background hue = the outer 8% ring's mean colour every 0.1 s. A jump is a hard colour cut:
    the ring steady before and after, its hue moved over 45 deg within one 0.1 s step (a world that flows into the next over 0.3 s+ is fine)."""
    step = max(1, int(round(fps * .5))); worst, wt, runs = 0, 0, []
    h, w = F.shape[1:3]; bh, bw = int(h * .08), int(w * .08)
    ring = np.zeros((h, w), bool); ring[:bh] = ring[-bh:] = True; ring[:, :bw] = ring[:, -bw:] = True
    sat = []
    for k in range(0, len(F), step):
        H, S, V = hsv(F[k]); f = float(((S > T['sat_s']) & (V > T['sat_v'])).mean()); sat.append(f)
        if f > worst: worst, wt = f, k / fps
    over = [i for i, f in enumerate(sat) if f > T['sat_frac']]
    for i in over:
        if runs and runs[-1][1] == i - 1: runs[-1][1] = i
        else: runs.append([i, i])
    long = [f'{a * step / fps:.1f}-{(b + 1) * step / fps:.1f} s' for a, b in runs if b > a]   # over 25% in 2+ samples in a row (0.5 s+)
    rh = []
    for k in range(len(F)):
        m = F[k][ring].mean(0); hh, ss, vv = hsv(m[None, None, :].astype(np.uint8)); rh.append((float(hh[0, 0]), float(ss[0, 0]), float(vv[0, 0])))
    def dh(a, b): d = abs(a[0] - b[0]); return min(d, 360 - d) if min(a[1], b[1]) > T['ring_sat'] and min(a[2], b[2]) > .08 else 0
    jumps = [f'{j / fps:.1f} s ({rh[j - 1][0]:.0f} to {rh[j][0]:.0f} deg)' for j in range(2, len(rh) - 1)
             if dh(rh[j - 1], rh[j]) > T['hue_jump'] and dh(rh[j - 2], rh[j - 1]) < 10 and dh(rh[j], rh[j + 1]) < 10]
    kc = min(len(F) - 1, int(round(cover * fps))); H, S, V = hsv(F[kc]); fc = float(((S > T['sat_s']) & (V > T['sat_v'])).mean())
    msg = (f'saturated fill (S>{T["sat_s"]}, V>{T["sat_v"]}) at most {worst:.0%} of the frame at {wt:.1f} s, over {T["sat_frac"]:.0%} for 0.5 s+: {", ".join(long) or "never"}; '
           f'cover {cover:.1f} s {fc:.0%}; hard background colour cuts: {", ".join(jumps) or "none"}')
    line('COLOUR', 'FAIL' if (long or fc > T['sat_frac'] or jumps) else 'PASS', msg)


def edge_checks(F, fps, ok=(), heard=None):
    h, w = F.shape[1:3]; th, tw = max(2, round(h * .02)), max(2, round(w * .02))
    def side(strip):   # strip: (frames, L, thickness, 3) -> share of the side that is content (far from its own running background)
        prof = strip.astype(np.float32).mean(2); L = prof.shape[1]; win = max(5, L // 3)
        pad = np.pad(prof, ((0, 0), (win // 2, win // 2), (0, 0)), mode='edge')
        bg = np.stack([np.median(pad[:, i:i + win], 1) for i in range(L)], 1)
        return (np.linalg.norm(prof - bg, axis=-1) > T['edge_dist']).mean(1)
    sides = {'top': side(F[:, :th].transpose(0, 2, 1, 3)), 'bottom': side(F[:, -th:].transpose(0, 2, 1, 3)),
             'left': side(F[:, :, :tw]), 'right': side(F[:, :, -tw:])}
    need = int(round(T['edge_secs'] * fps)); bad = []; said = []
    for o in ok:   # declared full-bleed worlds: {"from": t | {"say"}, "to": t | {"say"}, "sides": [...], "why": "..."}
        a = window(o.get('from'), heard or [], 0); b = window(o.get('to'), heard or [], 0)
        if not a or not b: bad.append(f'edges_ok "{o.get("why", "")}" not found in the audio'); continue
        for sd in o.get('sides', []):
            if sd in sides: sides[sd] = sides[sd].copy(); sides[sd][int(a[0] * fps):int(b[0] * fps) + 1] = 0
        said.append(f'{"/".join(o.get("sides", []))} {a[0]:.1f}-{b[0]:.1f} s declared ({o.get("why", "")})')
    for name, fr in sides.items():
        on = fr > T['edge_frac']; run, start = 0, 0
        for k, v in enumerate(list(on) + [False]):
            if v: run += 1; start = k - run + 1
            else:
                if run > need: bad.append(f'{name} {start / fps:.1f}-{(start + run) / fps:.1f} s (up to {fr[start:start + run].max():.0%} of the side)')
                run = 0
    line('EDGES', 'FAIL' if bad else 'PASS', f'content on the outer 2% border over {T["edge_frac"]:.0%} of a side for more than {T["edge_secs"]} s: {", ".join(bad) or "none"} '
         f'(worst side share {max(float(v.max()) for v in sides.values()):.0%}' + (f'; {"; ".join(said)}' if said else '') + ')')


def guess_check(F, fps, g, heard):
    rv = g.get('reveal')
    if isinstance(rv, dict): w0 = window(rv, heard or [], 0); rv = w0[0] if w0 else None
    elif isinstance(rv, (int, float)): rv = float(rv)
    else: rv = None
    if rv is None: line('GUESS', 'FAIL', 'reveal time not found (declare "reveal" in seconds or {"say": "..."} the audio says)'); return
    w = F.shape[2]; k = w / float(g.get('css_width', 540)); l, t, r, b = [int(round(v * k)) for v in g['box']]
    A = hsv(np.array([[[int(g['answer'][i:i + 2], 16) for i in (1, 3, 5)]]], np.uint8)); ah = float(A[0][0, 0])
    def share(f):
        H, S, V = hsv(f[t:b, l:r]); dh = np.abs(H - ah); dh = np.minimum(dh, 360 - dh)
        return float(((dh <= 12) & (S >= .35) & (V >= .18)).mean())
    after = max([share(F[i]) for i in range(int((rv + 1) * fps), min(len(F), int((rv + 1.5) * fps) + 1))] or [0])
    before = [(share(F[i]), i / fps) for i in range(0, min(len(F), int((rv - .02) * fps)))]
    worst, wt = max(before or [(0, 0)]); lim = max(.02, after * .1)
    if after < .05: line('GUESS', 'FAIL', f'the answer colour fills only {after:.1%} of the subject after the reveal ({rv:.2f} s): box or colour wrong?')
    elif worst > lim: line('GUESS', 'FAIL', f'the answer shows before the reveal: {worst:.1%} of the subject is the answer colour at {wt:.1f} s (after {after:.1%}; limit {lim:.1%})')
    else: line('GUESS', 'PASS', f'answer hidden until {rv:.2f} s (at most {worst:.1%} of the subject before, {after:.1%} after)')


NUMW = {w: i for i, w in enumerate('zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split())}
NUMW.update({w: 20 + 10 * i for i, w in enumerate('twenty thirty forty fifty sixty seventy eighty ninety'.split())})


def spoken_numbers(heard):
    """(value, time) for each number the final audio says: digits the recogniser wrote, or number words (twenty five = 25)."""
    res, k = [], 0
    while k < len(heard):
        raw = heard[k][4]; d = re.sub(r'[^\d]', '', raw)
        if d and re.fullmatch(r'[\d,.%]+[.,?!]?', raw.strip('"\'')):
            res.append((int(d) if '.' not in raw.strip('.') else None, heard[k][1])); k += 1
            while k < len(heard) and heard[k][4] == raw: k += 1   # "1889" split into spelled words shares one raw token
            continue
        w = heard[k][0]
        if w in NUMW:
            v = NUMW[w]
            if v >= 20 and k + 1 < len(heard) and heard[k + 1][0] in NUMW and NUMW[heard[k + 1][0]] < 10: v += NUMW[heard[k + 1][0]]; k += 1
            res.append((v, heard[k][1]))
        k += 1
    return [(v, t) for v, t in res if v is not None]


def numbers_check(mp4, text, heard):
    if heard is None: line('NUMBERS', 'SKIP', 'no recogniser on this runner'); return
    if subprocess.run(['which', 'tesseract'], capture_output=True).returncode: line('NUMBERS', 'SKIP', 'tesseract not installed on this runner'); return
    said = spoken_numbers(heard)
    if not said: line('NUMBERS', 'PASS', 'no number in the voice'); return
    allv = {v for v, _ in said} | {int(x) for x in re.findall(r'\d+', text)}
    times = sorted({round(t + d, 2) for _, t in said for d in np.arange(-T['num_win'], T['num_win'] + .01, .25) if t + d >= 0})
    bad, seen = [], 0
    with tempfile.TemporaryDirectory() as td:
        for tt in times:
            p = os.path.join(td, 'f.png')
            ff(['-y', '-ss', f'{tt:.2f}', '-i', mp4, '-frames:v', '1', p])
            tsv = subprocess.run(['tesseract', p, '-', '--psm', '11', 'tsv'], capture_output=True, text=True).stdout
            for row in tsv.splitlines()[1:]:
                c = row.split('\t')
                if len(c) < 12 or not c[11].strip(): continue
                try: conf = float(c[10])
                except ValueError: continue
                for n in re.findall(r'\d+', c[11]):
                    if conf < T['ocr_conf'] or len(n) > 4: continue
                    n = int(n); seen += 1
                    if n in allv: continue
                    near = [v for v, ts in said if abs(ts - tt) <= T['num_win'] and n > v and n - v <= max(2, .2 * v)]
                    if near: bad.append(f'"{n}" on screen at {tt:.1f} s while the voice says {near[0]}')
    bad = sorted(set(bad))
    line('NUMBERS', 'FAIL' if bad else 'PASS', f'{len(said)} spoken numbers ({", ".join(str(v) for v, _ in said)}), {seen} numbers read on screen within {T["num_win"]} s of them; '
         f'contradictions: {"; ".join(bad[:6]) or "none"}')


def dead_check(G, fps, mp4, dur):
    lag = max(1, int(round(.2 * fps)))
    vis = np.zeros(len(G), bool)
    for k in range(lag, len(G)):
        vis[k] = (np.abs(G[k].astype(np.int16) - G[k - lag].astype(np.int16)) > T['vis_px']).mean() > T['vis_frac']
    pcm = pcm16k(mp4)
    hop = 160; n = len(pcm) // hop
    db = 10 * np.log10((pcm[:n * hop].reshape(n, hop) ** 2).mean(1) + 1e-10)
    onset = np.zeros(n, bool)
    for i in range(8, n): onset[i] = db[i] > T['onset_floor'] and db[i] - db[i - 8:i].min() >= T['onset_db']
    act = np.zeros(int(dur * 100) + 1, bool)
    for k in np.nonzero(vis)[0]: act[min(len(act) - 1, int(k / fps * 100))] = True
    act[np.nonzero(onset)[0][np.nonzero(onset)[0] < len(act)]] = True
    runs, last = [], 0.0
    for i in list(np.nonzero(act)[0]) + [len(act) - 1]:
        gap = i / 100 - last
        if gap > T['dead_secs']: runs.append(f'{last:.1f}-{i / 100:.1f} s')
        last = i / 100
    line('DEAD', 'FAIL' if runs else 'PASS', f'stretches over {T["dead_secs"]} s with no visible change and no sound onset: {", ".join(runs) or "none"} '
         f'(visual change in {vis.mean():.0%} of 0.1 s steps, {int(onset.sum())} sound onsets)')


def mute_check(G, fps, m, heard):
    span = float(m.get('span', 1.5)); a = window(m.get('after'), heard or [], span); b = window(m.get('before'), heard or [], span) if m.get('before') else None
    if not a: line('MUTE', 'FAIL', 'the "after" moment was not found in the audio (declare [t0, t1] or {"say": "..."})'); return
    lag = max(1, int(round(.2 * fps)))
    def energy(w):
        ks = range(max(lag, int(w[0] * fps)), min(len(G), int(w[1] * fps) + 1))
        v = [float((np.abs(G[k].astype(np.int16) - G[k - lag].astype(np.int16)) > T['vis_px']).mean()) for k in ks]
        return max(v or [0])
    ea = energy(a); eb = energy(b) if b else None
    line('MUTE', 'FAIL' if ea < T['mute_frac'] else 'PASS', f'the fix moves {ea:.1%} of the frame in 0.2 s at its most ({a[0]:.1f}-{a[1]:.1f} s; at least {T["mute_frac"]:.0%})'
         + (f'; the broken "before" {eb:.1%} ({b[0]:.1f}-{b[1]:.1f} s)' if b else ''))


def main():
    a = sys.argv[1:]; mp4, cfgp = a[0], a[1]
    logs = [a[i + 1] for i, x in enumerate(a) if x == '--log']
    summary = a[a.index('--summary') + 1] if '--summary' in a else None
    failf = a[a.index('--fails') + 1] if '--fails' in a else None
    c, text, speeds, cover, ch, name = config(cfgp); qa = c.get('qa') or {}
    dur = probe(mp4); fps = 10
    print(f'Output QA: {name} ({ch}), {dur:.2f} s, {mp4}', flush=True)
    try: heard = transcribe(mp4) if text else []
    except ImportError as e: heard = None; print(f'::warning::no recogniser: {e}')
    voice_checks(text, speeds, heard) if text else line('PACE', 'SKIP', 'no narration in the config')
    sound_checks(mp4, logs)
    F = frames(mp4, fps, 270, 480)
    colour_checks(F, fps, cover)
    edge_checks(F, fps, qa.get('edges_ok', []), heard)
    if qa.get('guess'): guess_check(F, fps, qa['guess'], heard)
    elif ch == 'c3' and (c.get('experiment') or {}).get('id', '').startswith('c3-guess'): line('GUESS', 'FAIL', 'a guess reel without "qa": {"guess": {answer, reveal, box}} in its config')
    else: line('GUESS', 'SKIP', 'not a guess reel')
    G = frames(mp4, fps, 135, 240, gray=True); del F
    numbers_check(mp4, text, heard)
    dead_check(G, fps, mp4, dur)
    if qa.get('mute'): mute_check(G, fps, qa['mute'], heard)
    else: line('MUTE', 'SKIP' if ch != 'web' else 'WARN', 'no "qa": {"mute": {before, after}} in the config' + (' (web: declare the before/after moments)' if ch == 'web' else ''))
    verdict = 'OUTPUT QA: PASS' if not fails else f'OUTPUT QA: FAIL ({len(fails)}): ' + ' | '.join(f[:160] for f in fails)
    print(verdict)
    if summary:
        open(summary, 'a').write('### Output QA (final MP4)\n\n' + '\n'.join(f'- {s}' for s in out) + f'\n\n**{verdict}**\n')
    if failf:
        open(failf, 'w').write('\n'.join(f'- {f[:300]}' for f in fails) + '\n' if fails else '')
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()
