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
#            "mute":  {"before": [t0, t1] | {"say": "nothing moves"}, "after": [t0, t1] | {"say": "it sinks"}, "span": 1.5},
#            "sync":  ["swimming", "showers", "sauna"]}   (words the voice says that name an on-screen card or label: each must be readable
#                      on screen within 1.0 s of being said; a tech topic without it uses its scenes' card / verdict texts)
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
    'look': '24 Nov tech USB-C reel "horrible": flat washed-out grey light; match the channel\'s gold reel (design/gold.md)',
    'variety': '24 Nov one screen across the whole reel (tech miniled-zones): change the subject or the view every few seconds',
    'loud': '8 Nov "LISTEN to the finished audio" (-14 LUFS, Mandatory Gate 8)',
    'colour': '12 Nov "colour grading is horrible"',
    'edges': '12 Nov "cards and photos cut at the frame edges ... a lamp cut at the edge"; 13 Nov IP68 "the giant title touched the left frame edge"',
    'guess': '12 Nov "the tower was already painted red while the viewer was asked"',
    'numbers': '12 Nov "a counter rolled through 8 before \'seven\'"',
    'dead': '7 Nov "a reel barely moved"; 12 Nov "2.4 s with nothing at the payoff"',
    'mute': '12 Nov "the payoff was a 4% scale change ... the fix is invisible"',
    'bulk': '13 Nov "the finger looks a bit bulky on screen"',
    'vibrancy': '13 Nov "the menu grid ... feels slightly dull"',
    'spread': '14 Nov "it seems we are squeezing most of it in one place of the screen"',
    'demo': '14 Nov "the actual frame where everything is flowing with animation to show the difference looks faded grey"',
    'split': '15 Nov "doesn\'t show the effect better; one cannot tell if something is really happening" (BEFORE and AFTER looked identical)',
    'sync': '13 Nov tech IP68 "the voice names an item (\'or the sauna\') while its card is still empty"',
    'grade': '13 Nov Turns Out "I don\'t find the colour selection better" (fog wash, white Taj on a pale sky)',
    'fill': '15 Nov Turns Out Mona Lisa "use 2.5D with such images to make it more available on the screen (as it seems to be centered mostly)"',
    'calm': '15 Nov web "too wiggly" (Mon / Tue reels: constant drift, wobble, bobbing panes, a busy camera)',
    'focus': '20 Nov web "the colour combination doesn\'t give a feeling that any thought was put into it" (about eight unrelated hues, filler tiles more vivid than the subject)',
    'blackbg': '23 Nov web owner grid: the three plain black reels (165K, 10K, 6.2K) beat every coloured, framed reel (1.7K-2.9K); web reels use the black look, never a coloured frame or glow (rules-web.md rule 19)',
    'hue': '15 Nov web "main frame where we see the changes seem to show similar colour grading so doesn\'t look different from other videos"',
    'sheen': '15 Nov tech "covering the wave like coming in from left top corner to the right of the frame, it\'s happening in all videos" (a glass sheen swept the hero every 2.7 s)',
    'hero': '15 Nov tech "I don\'t see much happening animation wise around watch in 5 ATM video" (a small static watch, only the water moved)',
    'elements': '16 Nov Turns Out Liberty arm "elements are few and are spread ... through the whole video. We should design it such that there are more elements to show on screen as the storyline moves forward"',
    'reuse': '16 Nov Turns Out Liberty arm (one photo used 3 times; "elements are few")',
    'cover': '16 Nov Turns Out "I used to have reel cover element in video itself ... we should have that back so that people understand what is it about from profile grid, no add-on cover"',
    'licence': '14 Nov "yes to free real images" (design/safety.md: PD / CC0 / CC BY only, licence and source per file, CC BY credited)',
}
# thresholds (calibrated 12 Nov 2026 on showreel-34-press, showreel-c3-eiffel-red and showreel-tech-stop-tracking): sentence pace is timed first word to
# last on the final mix, which reads fast: full sentences at natural speed 1.0 measured 4.10-4.17, so a full sentence fails over 4.5 (as the voice
# check and design/critic.md 5) and a short line (6 words or fewer) over 4.0 is a warning. Colour: the old blue tech look the owner called
# horrible measured 54% saturated fill all through; the dark web reel 2%.
T = dict(full_wps=4.5, short_wps=4.0, short_words=6, min_overall=2.0, min_speed=.95, stray_p=.5,
         sat_s=.6, sat_v=.4, sat_frac=.25, hue_jump=45, ring_sat=.12,
         edge_frac=.06, edge_dist=48, edge_secs=1.0,
         ocr_conf=70, num_win=1.0, num_pre=2.0, num_step=.25, num_conf=80, num_h=.03, num_said=.5, sync_win=1.0, sync_pre=.5, sync_conf=50, sync_ratio=.8,
         big_h=.08, big_edge=.03, big_ocr_h=.05, big_secs=.3, subs={'tech': [.66, .84], 'c3': [.66, .80], 'web': [.70, .90]},
         dead_secs=1.5, vis_px=20, vis_frac=.003, onset_db=9, onset_floor=-45,
         mute_frac=.02, grade_dl=.2, wash_p5=.3, wash_frac=.2,
         bulk_v=.82, bulk_s=.2, bulk_k=7, bulk_px=150, vib_s=.35, vib_v=.35, vib_med=.014,
         spr_y=(.589, .818), spr_k=8, spr_dl=14, spr_frac=.02, spr_max=.10,
         demo_lit=.12, demo_grey=.25, demo_s=.35, demo_m=32, demo_c=64, demo_box=(24, 125, 516, 672),
         split_ratio=1.8, split_min=.05, split_op=.9,
         fill_y=(.20, .66), fill_g=6, fill_line=.25, fill_min=.80, fill_frac=.25,
         calm_px=20, calm_band=(288, 392), calm_med=.035, calm_mean=.05, calm_step=.10,
         hue_s=.25, hue_v=.2, hue_min=40, hue_last=3, black_v=32,
         focus_s=.3, focus_v=.3, focus_share=.05, focus_gap=30, focus_hues=3, focus_pad=1.0,
         sheen_y=(.24, .64), sheen_d=10, sheen_score=.7, sheen_steps=3, sheen_events=4,
         hero_lag=.5, hero_shift=3, hero_px=30, hero_on=.02, hero_active=.55, hero_w=.33, hero_inset=.2,
         var_ssim=.65, var_max=.60,
         el_lag=.3, el_shift=3, el_cell=9, el_top=.21, el_px=18, el_k=4, el_cells=1, el_cut=.35, el_gap=3.0, el_win=10, el_pics=4)
# ELEMENTS (16 Nov 2026, Turns Out; owner on the Liberty arm reel: "elements are few and are spread ... through the whole video"): a NEW visual
# element is a place on the frame that changes on its own. At 135x240, 10 fps, the frame below the badge and chapter title (el_top) with the
# subtitle band left out, softened by a 5x5 box, cut in 9 px cells: the mean change of each cell over el_lag s after its best shift of up to el_shift px (block
# matching: a camera push, a pan or a cut-out drifting forward is motion, not a new element). A step brings something new when el_cells+ cell(s) change
# by el_px+ AND by el_k x the frame's median cell change (a label, a stamp, a year, a route, a figure: local; a slow camera push moves every cell
# a little and is not new), or when el_cut+ of the cells change by el_px+ (a new picture: a crossfade or a card). FAIL when the longest stretch
# with nothing new is over el_gap s, or when any el_win s window shows under el_pics pictures (1 + the picture changes in it).
# REUSE (16 Nov 2026, Echoes configs): no photo is the picture of two shots.
# SHEEN (15 Nov 2026, tech; owner: "covering the wave like coming in from left top corner to the right of the frame, it's happening in all videos"):
# a straight bright band sweeping across the hero. In the hero zone (sheen_y of the height) at 135x240, the pixels that brighten by sheen_d+ over
# 0.2 s, projected across lines at every oblique angle (15-75 and 100-165 deg, 5-deg steps; 3 px wide lines at least 60% of the zone long): the
# best line's lit share minus the median line's. A sweep = sheen_steps+ steps in a row over sheen_score at the same angle (within 10 deg) whose line
# moves one way. Calibrated 15 Nov on showreel-tech-watch-5atm's frames (scene seeks every 0.1 s): with the glass sheen 15 sweeps (scores to 0.97,
# 2.7 s apart), the same scene without it 0 (best 0.62: falling drops). FAIL at sheen_events+ sweeps (1 to sheen_events-1 a WARN to look at).
# Loosened 22 Nov 2026 (the tech reset, owner: "no detail"; rules-tech.md D4): FAIL from 4 sweeps, not 2, so a light trail or a beam that
# belongs to the object may cross the hero once or twice; the glass sheen the owner saw (15 sweeps) still fails.
# HERO (15 Nov 2026, tech; owner: "I don't see much happening animation wise around watch"): the hero's box as the kit scene reports it
# (window.__subject, recorded every 0.5 s by techkit/capture.cjs into <reel>.subject0.json). Its own change: inside the box (inset 10%) at 270x480,
# blurred 3x3, the share of pixels that change by hero_px+ over hero_lag s after the best shift of up to hero_shift px (a bob or a slide is not
# the subject doing anything); a sample is "active" at hero_on+. FAIL when under hero_active of the samples are active, or when the box spans
# under hero_w of the frame width at the median (a small subject in a big frame). Calibrated 15 Nov on the 5 ATM scene: the old watch (a static
# drawing with a 9 px bob, 25% of the width) active in 22% of the samples, 0.6% change at the median, only at the chapter cuts.
# Stricter 16 Nov 2026 (owner on render 5, which passed: "still doesn't do much in terms of animation around the main elements"): only change in
# the subject's own shape or inside it counts. The earlier frame is first warped onto the subject's box (its move, zoom and squeeze are taken
# out, so a rigid bob, slide, camera push or slight squeeze is not change), then a residual shift of up to hero_shift px; the box is inset
# hero_inset per side (a glow outline round the rim is not change); hero_active of the samples. Calibrated 16 Nov on the scenes' own frames
# (scripts/qa/look.py, every 0.1 s): render 5's watch (bob, glow, squeeze, screen words) 44% active, screen-120hz 67%.
# CALM (15 Nov 2026, web only; owner: "too wiggly"): only the broken element may move; the rest of the frame holds still. The share of the frame
# (the subtitle band calm_band left out: its words change on purpose) whose pixels change by calm_px+ over 0.2 s at 135x240, 10 fps; FAIL when the
# median over the reel is over calm_med or the mean over calm_mean. Calibrated 15 Nov on the scenes' own frames (a scene is a pure function of t;
# python3 scripts/qa/look.py) every 0.1 s: the "too wiggly" cuts (camera drift, drifting light, a page that shook and tilted on every jump) form
# median 7.0% / mean 8.3%, follow 5.1 / 7.3, fontswap 4.9 / 7.1; calmer reels tabs 1.9 / 3.4, list 2.9 / 4.5, press 3.4 / 3.9; the calm rebuilds
# (camera and light still, one clean move per error) form 0.9 / 3.2, follow 0.5 / 3.0.
# HUE (15 Nov 2026, web only; owner: "similar colour grading"): the demo's main hue = the peak of a 10-degree hue histogram of its lit, coloured
# pixels (S > hue_s, V > hue_v, weighted by S x V, circularly smoothed) inside the recorded subject box every 0.5 s; compared with the last
# hue_last web reels before this one (captions.json "postOn") in scripts/qa/demo-hues.json (measured on their final frames: python3
# scripts/qa/look.py). FAIL when it sits within hue_min degrees of any of them. A new web reel adds its line to demo-hues.json in the push that makes it.
# FILL (15 Nov 2026, Turns Out), calibrated on stills of showreel-c3-mona-stolen at 270x480 every 0.5 s, read at 135x240: the picture zone (y 20-66%
# of the height: under the chapter title, over the captions) has a pixel "busy" where the mean gradient of its 3x3 neighbourhood is 6+ of 255;
# a column (row) holds the picture when 25%+ of its pixels in the zone are busy, and FILL = the picture's extent across (first to last column holding
# it, as a share of the width) x its extent down (rows): a flat but full-frame card still spans the frame, a centred picture leaves empty margins. The centred framed
# museum shots the owner called "centered mostly" measured 0.52-0.66 each (the old cut: median 0.59, 80% of the samples under 0.80; its flat centred
# cards 0.05-0.52); the 2.5D depth rebuild 0.90-1.00 on every photo (median 0.98, 13% under 0.80: the map and the wall card mid-push).
# A sample under 0.80 is a small centred picture; FAIL when over 25% of the samples are.
# SPLIT (15 Nov 2026, any reel whose scene marks [data-pane="before"] and [data-pane="after"]; the render records their boxes every 0.1 s), calibrated
# on showreel-37-fontswap's split window at 135x240, 10 fps: the share of pixels inside each pane (inset 1/16) that change by 20+ over 0.2 s, while
# both panes are fully shown, averaged. The first cut the owner could not tell apart: BEFORE 0.167, AFTER 0.125 (1.34x; p90 1.72x); the jolt
# rebuild 0.267 / 0.132 (2.02x). FAIL under 1.8x or when BEFORE moves under 5%: the broken pane must move visibly more than the fixed one.
# DEMO (15 Nov 2026, web only), calibrated on stills at 270x480 every 0.5 s inside the subject's box ([data-subject], recorded by the render):
# median saturation of its lit pixels (V > .12; the faded-grey showreel-36-tabs 0.21, after the vivid kit 0.48; the newweb glass template 0.68 / 0.72),
# Hasler-Suesstrunk colourfulness (glass template 24 before, 42 after; tabs 41 / 48) and the luminance spread p95-p5 in 0-255 (glass template 54 / 87,
# tabs 74 / 80); each a median over the samples. Without a recorded box: the config's "qa": {"subject": [l, t, r, b]}, else the whole-frame hero zone.
# SPREAD (14 Nov 2026, web only), calibrated on stills at 270x480 every 0.5 s (and again with noise of sigma 3 and 5 added: the same numbers):
# the lower third of the safe zone (y 565-785 of 960) cut in 8 strips, a strip empty when under 2% of its pixels (at 135x240) differ by 14+
# from the strip's median; showreel-35-list ("squeezing", lower third empty) 34% of the strips empty on average, showreel-36-tabs first cut 18%,
# its whole-frame rebuild 0%.
# BULK and VIBRANCY (13 Nov 2026, web only), calibrated on the showreel-35-list stills at 270x480: the big white finger left 564-874 px of solid
# near-white after a 7x7 erosion (text strokes vanish; 70 px bold numbers leave 0), the slim ring 0; coloured pixels (S>.35, V>.35) were a median
# 1.2% of the frame on the dull grid and 2.3% after the vibrancy pass.
# LOOK (24 Nov 2026, every channel; owner on the tech USB-C reel: "horrible", flat washed-out grey light): brightness, background level, dark
# share, washed-out grey, contrast and washed-out frames against the channel's GOLD reel (design/gold.md; numbers scripts/qa/gold.json; the
# measures and the calibration in scripts/qa/gold_look.py). FAIL when 2+ are clearly off, one = WARN. USB-C 5 off; every gold and 7 posted reels 0.
# GRADE (13 Nov 2026, Turns Out), calibrated on showreel-c3-taj-mud at 270x480 every 0.5 s: the fogged first cut had the subject 0.03 brighter
# than the ring around it on the cover (white Taj, pale grey sky) and its picture's black point (5th luminance percentile of the middle band)
# over 0.3 in 43 of 46 samples; the golden-hour mood gave 0.40 and 0 of 46.

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
    ch = 'c3' if '/channel3/' in path or c.get('name', '').startswith(('showreel-c3-', 'showreel-pv-c3-')) or c.get('engine') == 'design' else 'web'   # a Turns Out preview (scripts/previews/c3-*.json) is judged as Turns Out, not as a web reel (24 Nov 2026: it failed the web DEMO and CALM checks)
    return c, v.get('text', ''), [s for s in speeds if s is not None], float(c.get('cover', 1.6)), ch, c.get('name', '')


LIC_OK = ('cc0', 'pd', 'pdm', 'cc-by')


def licence_check(c, ch):
    """LICENCE (owner, 14 Nov 2026; design/safety.md "Free real images and footage"): every media file has an allowed licence (PD, CC0, CC BY; never
    NC, ND, SA, editorial), its source page, file and author recorded in the config; a CC BY file is credited by author in the post text
    (the caption's sources line or the config's sources list)."""
    m = c.get('media') or []
    if not m:
        line('LICENCE', 'WARN' if ch in ('tech', 'c3') else 'SKIP', 'no real media in the config' + (' (tech and Turns Out are built on real media from 14 Nov 2026)' if ch in ('tech', 'c3') else ''))
        return
    post = c.get('post') or {}
    credit = ' '.join([c.get('caption', ''), post.get('caption', ''), c.get('credits', ''), post.get('credits', '')]
                      + [s.get('title', '') for s in (c.get('sources') or post.get('sources') or []) if isinstance(s, dict)]).lower()
    bad, by = [], 0
    for e in m:
        lic, miss = str(e.get('licence') or '').lower(), [k for k in ('file', 'source_url', 'author', 'licence') if not e.get(k)]
        tok = set(re.split(r'[-/ ]', lic))
        if miss: bad.append(f'{e.get("id")}: no {"/".join(miss)}')
        elif not lic.startswith(LIC_OK) or tok & {'nc', 'nd', 'sa', 'editorial'}: bad.append(f'{e["id"]}: licence "{lic}" not allowed')
        elif not str(e['source_url']).startswith('https://'): bad.append(f'{e["id"]}: source_url is not an https page')
        elif lic.startswith('cc-by'):
            by += 1
            a = re.sub(r'\s+', ' ', str(e['author'])).strip().lower()[:40]
            if a not in credit: bad.append(f'{e["id"]}: CC BY by "{e["author"][:40]}" not credited in the post text')
    line('LICENCE', 'FAIL' if bad else 'PASS', f'{len(m)} media files, {by} CC BY credited' + (': ' + '; '.join(bad) if bad else ''))


def sync_words(c, qa, ch):
    if qa.get('sync') is not None: return list(qa['sync']), 'config'
    if ch != 'tech': return [], ''
    got = []   # a tech topic: the items its scenes name on cards (cards, the verdict's good / bad) with a voice cue
    for l in c.get('lines', []):
        p = (l.get('scene') or {}).get('params') or {}
        for it in list(p.get('cards') or []) + [p.get(k) for k in ('good', 'bad') if isinstance(p.get(k), dict)]:
            if it.get('cue') and it.get('text'): got.append(it['text'])
    return got, 'the scenes\' cards'


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
        if not hs: rows.append(f'"{s[:28]}" not heard'); bad.append(f'"{s[:40]}" not heard'); continue
        st, en = heard[hs[0]][1], heard[hs[-1]][2]; n = a1 - a0
        if n < 2: rows.append(f'{st:.1f}s 1w heard'); continue   # a one-word line has no pace to time
        wps = n / max(.01, en - st); tag = 'ok'
        if n <= T['short_words'] and wps > T['short_wps']: tag = 'quick (short line, warning)'
        elif n > T['short_words'] and wps > T['full_wps']: tag = 'FAST'
        if tag == 'FAST': bad.append(f'"{s[:40]}" {wps:.2f} words/s at {st:.1f} s')
        rows.append(f'{st:.1f}s {n}w {wps:.2f}/s {tag}')
    ms = sorted(m.values())
    span = heard[ms[-1]][2] - heard[ms[0]][1] if ms else 0
    overall = len(want) / max(span, .01)
    detail = f'{len(want)} words in {span:.1f} s = {overall:.2f} words/s overall; sentences: ' + '; '.join(rows)
    if bad: line('PACE', 'FAIL', f'{len(bad)} sentence(s) over {T["full_wps"]} words/s (full) or not heard: ' + '; '.join(bad) + ' | ' + detail)
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


def grade_check(F, fps, cover, box, css_w=540):
    """Turns Out colour mood: the subject stands out from what is around it on the cover (luminance gap between the middle of its box and a
    15 px ring around it), and no fog wash (the picture band's black point lifted over 0.3 in more than 20% of the 0.5 s samples)."""
    def lum(a): a = a.astype(np.float32) / 255; return .2126 * a[..., 0] + .7152 * a[..., 1] + .0722 * a[..., 2]
    h, w = F.shape[1:3]; step = max(1, int(round(fps * .5))); p5 = []
    for k in range(0, len(F), step):
        y = lum(F[k]); p5.append(float(np.percentile(y[int(h * .29):int(h * .67), int(w * .04):int(w * .93)], 5)))
    washed = [i * step / fps for i, v in enumerate(p5) if v > T['wash_p5']]; wf = len(washed) / max(1, len(p5))
    msg = f'washed-out frames (black point over {T["wash_p5"]}) {len(washed)} of {len(p5)} ({wf:.0%}, at most {T["wash_frac"]:.0%})'
    bad = wf > T['wash_frac']
    if box:
        k = min(len(F) - 1, int(round(cover * fps))); y = lum(F[k]); sc = w / css_w; l, t, r, b = [int(round(v * sc)) for v in box]; bw, bh = r - l, b - t
        inner = y[t + bh // 5:b - bh // 5, l + bw // 5:r - bw // 5]; m = np.zeros((h, w), bool); g = int(15 * sc * 2)
        m[max(0, t - g):b + g, max(0, l - g):r + g] = True; m[t:b, l:r] = False
        dl = abs(float(np.median(inner)) - float(np.median(y[m]))); bad = bad or dl < T['grade_dl']
        msg = f'cover {cover:.1f} s: subject vs its surroundings {dl:.2f} (at least {T["grade_dl"]}; the fogged Taj 0.03); ' + msg
    else: msg = 'cover contrast SKIP (no "qa": {"guess": {"box"}} or {"subject": [l, t, r, b]}); ' + msg
    line('GRADE', 'FAIL' if bad else 'PASS', msg)


def bulk_check(F, fps):
    from numpy.lib.stride_tricks import sliding_window_view as sw
    k = T['bulk_k']; step = max(1, int(round(fps * .5))); runs, worst, wt, prev = [], 0, 0, None
    for i in range(0, len(F), step):
        _, S, V = hsv(F[i]); m = (V > T['bulk_v']) & (S < T['bulk_s']); n = int(sw(m, (k, k)).all(axis=(2, 3)).sum())
        if n > worst: worst, wt = n, i / fps
        if n > T['bulk_px']:
            if prev is not None and runs and runs[-1][1] == prev: runs[-1][1] = i
            else: runs.append([i, i])
            prev = i
        else: prev = None
    long = [f'{a / fps:.1f}-{(b + step) / fps:.1f} s' for a, b in runs if b > a]
    line('BULK', 'FAIL' if long else 'PASS', f'solid near-white shapes (a {k}x{k} core at 270x480: a finger, a white blob; text strokes do not count) over {T["bulk_px"]} px for 0.5 s+: '
         f'{", ".join(long) or "none"} (largest {worst} px at {wt:.1f} s)')


def vibrancy_check(F, fps):
    step = max(1, int(round(fps * .5))); v = []
    for i in range(0, len(F), step):
        _, S, V = hsv(F[i]); v.append(float(((S > T['vib_s']) & (V > T['vib_v'])).mean()))
    med = float(np.median(v)) if v else 0
    line('VIBRANCY', 'FAIL' if med < T['vib_med'] else 'PASS', f'coloured pixels (S>{T["vib_s"]}, V>{T["vib_v"]}) a median {med:.1%} of the frame (at least {T["vib_med"]:.1%}; '
         f'the dull 13 Nov grid 1.2%), least {min(v):.1%}, most {max(v):.1%}')


def spread_check(F, fps):
    step = max(1, int(round(fps * .5))); v = []
    for i in range(0, len(F), step):
        a = F[i].astype(np.float32); g = .2126 * a[..., 0] + .7152 * a[..., 1] + .0722 * a[..., 2]
        H, W = g.shape; g = g[:H // 2 * 2, :W // 2 * 2].reshape(H // 2, 2, W // 2, 2).mean((1, 3)); H = g.shape[0]
        z = g[int(H * T['spr_y'][0]):int(H * T['spr_y'][1])]
        v.append(float(np.mean([(np.abs(s - np.median(s)) > T['spr_dl']).mean() < T['spr_frac'] for s in np.array_split(z, T['spr_k'], axis=0)])))
    m = float(np.mean(v)) if v else 0; worst = int(np.argmax(v)) if v else 0
    line('SPREAD', 'FAIL' if m > T['spr_max'] else 'PASS', f'the lower third of the safe zone (y {T["spr_y"][0]:.0%}-{T["spr_y"][1]:.0%} of the height) is {m:.0%} empty on average '
         f'(at most {T["spr_max"]:.0%}; the squeezed 13 Nov list reel 34%), worst {max(v or [0]):.0%} at {worst * step / fps:.1f} s')


def edge_checks(F, fps, ok=(), heard=None, mp4=None):
    h, w = F.shape[1:3]; th, tw = max(2, round(h * .02)), max(2, round(w * .02))
    def side(strip):   # strip: (frames, L, thickness, 3) -> share of the side that is content (far from its own running background)
        prof = strip.astype(np.float32).mean(2); L = prof.shape[1]; win = max(5, L // 3)
        pad = np.pad(prof, ((0, 0), (win // 2, win // 2), (0, 0)), mode='edge')
        bg = np.stack([np.median(pad[:, i:i + win], 1) for i in range(L)], 1)
        return (np.linalg.norm(prof - bg, axis=-1) > T['edge_dist']).mean(1)
    sides = {'top': side(F[:, :th].transpose(0, 2, 1, 3)), 'bottom': side(F[:, -th:].transpose(0, 2, 1, 3)),
             'left': side(F[:, :, :tw]), 'right': side(F[:, :, -tw:])}
    need = int(round(T['edge_secs'] * fps)); bad = []; said = []; skip = []
    for o in ok:   # declared full-bleed worlds: {"from": t | {"say"}, "to": t | {"say"}, "sides": [...], "why": "..."}
        a = window(o.get('from'), heard or [], 0); b = window(o.get('to'), heard or [], 0)
        if not a or not b: bad.append(f'edges_ok "{o.get("why", "")}" not found in the audio'); continue
        for sd in o.get('sides', []):
            if sd in sides: sides[sd] = sides[sd].copy(); sides[sd][int(a[0] * fps):int(b[0] * fps) + 1] = 0
        skip.append((a[0], b[0], set(o.get('sides', []))))
        said.append(f'{"/".join(o.get("sides", []))} {a[0]:.1f}-{b[0]:.1f} s declared ({o.get("why", "")})')
    for name, fr in sides.items():
        on = fr > T['edge_frac']; run, start = 0, 0
        for k, v in enumerate(list(on) + [False]):
            if v: run += 1; start = k - run + 1
            else:
                if run > need: bad.append(f'{name} {start / fps:.1f}-{(start + run) / fps:.1f} s (up to {fr[start:start + run].max():.0%} of the side)')
                run = 0
    big, bigbad = bigtype_check(F, fps, skip, mp4) if mp4 else ('big type SKIP', [])
    line('EDGES', 'FAIL' if bad or bigbad else 'PASS', f'{big}; content on the outer 2% border over {T["edge_frac"]:.0%} of a side for more than {T["edge_secs"]} s: {", ".join(bad) or "none"} '
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


STOP = set('a an the and or but nor of to in on at for with by as from into is are was were be been it its this that these those your you '
           'my our their his her not no so if then than do does did can will just very'.split())


def alnum(x): return re.sub(r'[^a-z0-9]', '', x.lower())


def ocr(png):
    """Tesseract words on a frame, inverted (light type on dark glass) at full size and at half size (it misses 70 px card words at 1080 wide
    and reads them at 540), plus the frame as it is: (text, conf, l, t, r, b) in the PNG's pixels."""
    from PIL import Image, ImageOps
    res = []
    g = Image.open(png).convert('L'); inv = ImageOps.invert(g)
    for k, (im, sc) in enumerate(((g, 1), (inv, 1), (inv.resize((g.width // 2, g.height // 2)), 2))):
        q = png + f'.{k}.png'; im.save(q)
        tsv = subprocess.run(['tesseract', q, '-', '--psm', '11', 'tsv'], capture_output=True, text=True).stdout
        for row in tsv.splitlines()[1:]:
            c = row.split('\t')
            if len(c) < 12 or not c[11].strip(): continue
            try: conf = float(c[10]); l, t, w, h = (int(c[i]) * sc for i in (6, 7, 8, 9))
            except ValueError: continue
            res.append((c[11].strip(), conf, l, t, l + w, t + h))
    return res


def grab(mp4, t, p):
    ff(['-y', '-ss', f'{max(0, t):.2f}', '-i', mp4, '-frames:v', '1', '-vf', 'scale=1080:1920:flags=area', p])


def look_check(mp4, ch, name):
    # LOOK (24 Nov 2026, owner chat): brightness, background level, dark background, washed-out grey and contrast against the channel's
    # gold reel (scripts/qa/gold_look.py has the measures and the calibration; scripts/qa/gold.json the gold numbers; design/gold.md why).
    import importlib.util
    spec = importlib.util.spec_from_file_location('gold_look', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'gold_look.py'))
    gl = importlib.util.module_from_spec(spec); spec.loader.exec_module(gl)
    g = gl.gold(ch)
    if not g: line('LOOK', 'SKIP', f'no gold reel for {ch}'); return
    m = gl.measure(mp4); offs, bad = gl.judge(m, g); n = len(m['_per']['bg'])
    fails = len(offs) >= 2
    line('LOOK', 'FAIL' if fails else 'WARN' if offs else 'PASS',
         f"vs gold {g['name']}: bright {m['bright']:.3f} (gold {g['look']['bright']:.3f}), background {m['bg']:.3f} ({g['look']['bg']:.3f}), dark {m['dark']:.0%} "
         f"({g['look']['dark']:.0%}), grey {m['grey']:.0%} ({g['look']['grey']:.0%}), contrast {m['contrast']:.3f} ({g['look']['contrast']:.3f}); washed-out frames "
         f"{len(bad)} of {n} ({gl.spans(bad, 1 / m['_fps']) or 'none'} s)" + (': ' + '; '.join(offs) + ('. Re-light it like the gold reel: dark background, one lit hero, one accent' if fails else '') if offs else ''))


def variety_check(mp4, subs):
    # SHOT VARIETY (24 Nov 2026; owner on the tech miniled-zones reel: "one screen across the reel, what's that and how did it pass?"):
    # one frame a second at 135x240, the subtitle band left out; two frames are the SAME SHOT when their structural similarity (SSIM, 7x7 windows,
    # taken over the windows where either frame has detail) is var_ssim+. FAIL when more than var_max of the reel is one shot (the most frames
    # that all match one frame). Tuned 24 Nov on the posted web reel showreel-46-tabwiggle (largest group 53% at 0.65, so it passes under 60%) and a static
    # one-object frame with moving captions (100%).
    raw = ff(['-i', mp4, '-vf', 'fps=1,scale=135:240:flags=area', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'])
    G = np.frombuffer(raw, np.uint8).reshape(-1, 240, 135).astype(np.float32); n = len(G)
    if n < 6: line('VARIETY', 'SKIP', f'{n} frames'); return
    def box(a, k=7):
        c = np.cumsum(np.cumsum(np.pad(a, ((1, 0), (1, 0))), 0), 1)
        return (c[k:, k:] - c[:-k, k:] - c[k:, :-k] + c[:-k, :-k]) / (k * k)
    keep = np.ones((240 - 6, 135 - 6), bool); keep[int(subs[0] * 240):int(subs[1] * 240)] = False
    M = [box(g) for g in G]; V = [box(g * g) - m * m for g, m in zip(G, M)]
    def ssim(i, j):
        cv = box(G[i] * G[j]) - M[i] * M[j]
        m = ((2 * M[i] * M[j] + 6.5025) * (2 * cv + 58.5225)) / ((M[i] ** 2 + M[j] ** 2 + 6.5025) * (V[i] + V[j] + 58.5225))
        act = ((V[i] > 25) | (V[j] > 25)) & keep
        return float(m[act].mean()) if act.sum() > 20 else 1.0
    S = np.array([[1.0 if i == j else ssim(i, j) for j in range(n)] for i in range(n)])
    cnt = (S >= T['var_ssim']).sum(1); k = int(cnt.argmax()); share = cnt[k] / n
    line('VARIETY', 'FAIL' if share > T['var_max'] else 'PASS', f'{cnt[k]} of {n} one-second frames look like frame {k} ({share:.0%}; at most {T["var_max"]:.0%}, same shot = SSIM {T["var_ssim"]}+): '
         + ('one subject fills the reel; change the subject or the view every few seconds' if share > T['var_max'] else 'the shot changes'))


def sync_check(mp4, items, src, heard, dur, band):
    """Every on-screen item the voice names is readable while it is said: OCR the final frames from 0.5 s before the word to 1.0 s after it.
    Words inside the subtitle band (qa.subs, [top, bottom] as shares of the height; a channel default) do not count: the subtitles always
    show the word being said, the card must show it too. Calibrated on IP68 stills: the cards read "Swimming", "Showers", the subtitles "sauna."."""
    if not items: line('SYNC', 'SKIP', 'no "qa": {"sync": [...]} in the config (the words the voice says that name a card or label)'); return
    if heard is None: line('SYNC', 'SKIP', 'no recogniser on this runner'); return
    if subprocess.run(['which', 'tesseract'], capture_output=True).returncode: line('SYNC', 'SKIP', 'tesseract not installed on this runner'); return
    import difflib
    got = [h[0] for h in heard]; bad, ok, unheard, cache = [], [], [], {}
    with tempfile.TemporaryDirectory() as td:
        def read(t):
            t = round(min(max(0, t), dur - .05) * 4) / 4
            if t not in cache:
                p = os.path.join(td, f'{t:06.2f}.png'); grab(mp4, t, p)
                cache[t] = {alnum(x[0]) for x in ocr(p) if x[1] >= T['sync_conf'] and len(alnum(x[0])) >= 2
                            and not band[0] <= (x[3] + x[5]) / 2 / 1920 <= band[1]}
            return cache[t]
        for item in items:
            ws = [w for w in vwords(item) if w not in STOP]; keys = [alnum(w) for w in item.split() if alnum(w) and alnum(w) not in STOP]
            if not ws or not keys: continue
            hits = [heard[i][1] for i in range(len(got) - len(ws) + 1) if got[i:i + len(ws)] == ws]
            if not hits: unheard.append(item); continue
            for ts in hits[:1]:   # the first time the voice names it (a later "mud facials" is not the chip)
                seen = None
                for d in np.arange(-T['sync_pre'], T['sync_win'] + .01, .25):
                    words = read(ts + d)
                    if all(any(k == x or (len(k) >= 4 and difflib.SequenceMatcher(None, k, x).ratio() >= T['sync_ratio']) for x in words) for k in keys):
                        seen = d; break
                if seen is None: bad.append(f'"{item}" said at {ts:.1f} s, not readable on screen {-T["sync_pre"]:.1f} to +{T["sync_win"]:.1f} s around it')
                else: ok.append(f'"{item}" {ts:.1f} s (read {seen:+.2f} s)')
    msg = (f'{len(items)} named items ({src}; subtitle band y {band[0]:.0%}-{band[1]:.0%} ignored): ' + ('; '.join(bad) + ' | ' if bad else '') + 'on screen: ' + (', '.join(ok) or 'none')
           + (f'; not heard in the voice (recogniser): {", ".join(unheard)}' if unheard else ''))
    line('SYNC', 'FAIL' if bad else 'PASS', msg)


def lumf(a): a = a.astype(np.float32) / 255; return .2126 * a[..., 0] + .7152 * a[..., 1] + .0722 * a[..., 2]


def edge_glyphs(f):
    """Glyph-like ink blobs (bright on a dark frame, dark on a light one) over 8% of the frame tall that touch the outer 3% and sit in a row with
    another glyph of the same height and top line (type, not a minaret or a pole)."""
    from scipy import ndimage as nd
    y = lumf(f); H, W = y.shape; dark = np.median(y) < .5
    ink = y > .68 if dark else y < .32
    k = max(3, round(W * .015)); core = nd.binary_erosion(ink, np.ones((k, k)))
    lab, _ = nd.label(ink); res, gl = [], []
    for i, sl in enumerate(nd.find_objects(lab), 1):
        t, b, l, r = sl[0].start, sl[0].stop, sl[1].start, sl[1].stop; h, w = b - t, r - l
        if not (T['big_h'] * H <= h <= .4 * H and w <= .6 * W): continue
        m = lab[sl] == i; fill = float(m.mean())
        if not (.2 <= fill <= .8 or w <= .4 * h) or not core[sl][m].any(): continue   # a letter (or a stem: I, 1, l), not a filled card
        gl.append((l, t, r, b)); e = T['big_edge']
        sides = {s for s, v in (('left', l <= e * W), ('right', r >= (1 - e) * W), ('top', t <= e * H), ('bottom', b >= (1 - e) * H)) if v}
        if sides: res.append(((l, t, r, b), sides))
    def row(a):
        h = a[3] - a[1]
        return any(g != a and abs(g[1] - a[1]) <= .15 * h and .75 <= (g[3] - g[1]) / h <= 1.33 and max(g[0] - a[2], a[0] - g[2]) <= h for g in gl)
    return [x for x in res if row(x[0])], dark


def big_words(mp4, t, H, td):
    """Tesseract's words at least 5% of the frame tall in the final frame at t (540 wide; any confidence: a clipped giant title reads as
    "IP6S"), 3+ letters or digits, boxes in the 270x480 frame's pixels."""
    p = os.path.join(td, 'g.png'); ff(['-y', '-ss', f'{t:.2f}', '-i', mp4, '-frames:v', '1', '-vf', 'scale=540:960:flags=area', p])
    return [(x[0], x[2] / 2, x[3] / 2, x[4] / 2, x[5] / 2) for x in ocr(p) if len(alnum(x[0])) >= 3 and (x[5] - x[3]) / 2 >= T['big_ocr_h'] * H]


def bigtype_check(F, fps, skip, mp4):
    """13 Nov 2026 (IP68: the giant title touched the left edge and EDGES passed, its 2% / 6% / 1 s limits are for cards): very large type
    (glyphs over 8% of the frame tall, read as words by tesseract) touching the outer 3% for 0.3 s+ fails. Calibrated on the IP68 title
    (stills shifted 100-250 px to the edges: caught; in place: clear) and the Turns Out minarets and poles (clear)."""
    if subprocess.run(['which', 'tesseract'], capture_output=True).returncode: return 'big type SKIP (no tesseract)', []
    hit = {}
    with tempfile.TemporaryDirectory() as td:
        for k in range(len(F)):
            g, _ = edge_glyphs(F[k]); t = k / fps
            g = [(bb, sd - {s for a0, b0, ss in skip if a0 <= t <= b0 for s in ss}) for bb, sd in g]; g = [x for x in g if x[1]]
            if not g: continue
            ws = big_words(mp4, t, F.shape[1], td)
            for (l, tp, r, b), sides in g:
                h = b - tp
                w = next((x for x in ws if min(b, x[4]) - max(tp, x[2]) >= .5 * min(h, x[4] - x[2]) and x[1] <= r + h and x[3] >= l - h), None)
                if w: hit[k] = f'"{w[0]}" {h / F.shape[1]:.0%} tall touches the {"/".join(sorted(sides))} edge'; break
    need = max(1, int(round(T['big_secs'] * fps))); runs, ks = [], sorted(hit)
    for k in ks:
        if runs and runs[-1][1] == k - 1: runs[-1][1] = k
        else: runs.append([k, k])
    bad = [f'{a / fps:.1f}-{(b + 1) / fps:.1f} s: {hit[a]}' for a, b in runs if b - a + 1 >= need]
    return (f'big type (glyphs over {T["big_h"]:.0%} of the frame tall) in the outer {T["big_edge"]:.0%} for {T["big_secs"]} s+: {"; ".join(bad[:6]) or "none"}'
            + (f' ({len(ks)} single frames touched)' if ks and not bad else '')), bad


NUMW = {w: i for i, w in enumerate('zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split())}
NUMW.update({w: 20 + 10 * i for i, w in enumerate('twenty thirty forty fifty sixty seventy eighty ninety'.split())})


# "one" heard as a word is a count only next to these (owner, 15 Nov 2026: web showreel-38-form failed on a "3" while the voice said "one" as
# an article, "one field"); digits the recogniser wrote ("1") always count.
ONE_PRE = set('to from only just number exactly than at about'.split())
ONE_POST = set('hundred thousand million billion percent per out second seconds minute minutes hour hours day days year years'.split())


def spoken_numbers(heard):
    """(value, time) for each number the final audio says: digits the recogniser wrote, or number words (twenty five = 25); "one" as a word only
    when it is a count (ONE_PRE / ONE_POST next to it), not an article or pronoun."""
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
            elif w == 'one':
                pre = heard[k - 1][0] if k else ''; post = heard[k + 1][0] if k + 1 < len(heard) else ''
                if pre not in ONE_PRE and post not in ONE_POST and post not in NUMW: k += 1; continue
            res.append((v, heard[k][1]))
        k += 1
    return [(v, t) for v, t in res if v is not None]


def ocr_block(png, sc=4):
    """Tesseract as one block (--psm 6) at a quarter size, as it is and inverted: --psm 11 drops a lone character, so a big single-digit counter
    ("8", 300 px tall) never reads there; at 270x480 --psm 6 reads it at 95+ (15 Nov 2026). (text, conf, l, t, r, b) at full size."""
    from PIL import Image, ImageOps
    g = Image.open(png).convert('L'); g = g.resize((g.width // sc, g.height // sc), Image.LANCZOS); res = []
    for k, im in enumerate((g, ImageOps.invert(g))):
        q = png + f'.b{k}.png'; im.save(q)
        tsv = subprocess.run(['tesseract', q, '-', '--psm', '6', 'tsv'], capture_output=True, text=True).stdout
        for row in tsv.splitlines()[1:]:
            c = row.split('\t')
            if len(c) < 12 or not c[11].strip(): continue
            try: conf = float(c[10]); l, t, w, h = (int(c[i]) * sc for i in (6, 7, 8, 9))
            except ValueError: continue
            res.append((c[11].strip(), conf, l, t, l + w, t + h))
    return res


def num_reads(mp4, tt, td, band):
    """Large numbers on the frame at tt: (value, cx, cy, h) at 1080x1920, whole-token digits only, conf num_conf+, glyphs num_h+ of the height,
    outside the subtitle band (the subtitles show the spoken words, and the next line's words, on purpose). Variants merged per place."""
    p = os.path.join(td, f'n{tt:.2f}.png'); grab(mp4, tt, p)
    got = []
    for txt, conf, l, t, r, b in ocr(p) + ocr_block(p):
        m = re.fullmatch(r'[$#(]?(\d{1,4})[%)+,.:!]?', txt)
        if not m or conf < T['num_conf'] or b - t < T['num_h'] * 1920: continue
        cy = (t + b) / 2
        if band[0] * 1920 <= cy <= band[1] * 1920: continue
        v, cx, h = int(m.group(1)), (l + r) / 2, b - t
        if not any(v == g[0] and abs(cx - g[1]) < h and abs(cy - g[2]) < h / 2 for g in got): got.append((v, cx, cy, h))
    return got


def numbers_check(mp4, text, heard, band=(.66, .84)):
    """12 Nov 2026: a counter rolled through 8 before the voice said "seven". FAIL only when a counter (a large number that changes in the same
    place across frames) shows a value past the one the voice says near it, before the voice says that higher value. Rebuilt 15 Nov 2026: the old
    check read every number on any frame (small labels, dates on cards, shapes read as digits) and flagged three reels the owner watched and
    passed (Turns Out mona-stolen "22" / "4", web form "3" for "one", tech watch-5atm "7" / "6"). Frames every num_step s from num_pre s before each
    spoken number to num_win s after it."""
    if heard is None: line('NUMBERS', 'SKIP', 'no recogniser on this runner'); return
    if subprocess.run(['which', 'tesseract'], capture_output=True).returncode: line('NUMBERS', 'SKIP', 'tesseract not installed on this runner'); return
    said = spoken_numbers(heard)
    if not said: line('NUMBERS', 'PASS', 'no number in the voice'); return
    times = sorted({round(t + d, 2) for _, t in said for d in np.arange(-T['num_pre'], T['num_win'] + .01, T['num_step']) if t + d >= 0})
    reads = {}
    with tempfile.TemporaryDirectory() as td:
        for tt in times: reads[tt] = num_reads(mp4, tt, td, band)
    tracks = []   # one per screen place: [cx, cy, h, [(t, value), ...]]
    for tt in times:
        for v, cx, cy, h in reads[tt]:
            tr = next((x for x in tracks if abs(cx - x[0]) < max(1.5 * x[2], 65) and abs(cy - x[1]) < x[2] / 2 and .6 < h / x[2] < 1.6), None)
            if tr: tr[3].append((tt, v))
            else: tracks.append([cx, cy, h, [(tt, v)]])
    counters = [x for x in tracks if len({v for _, v in x[3]}) >= 2]
    bad = []
    for v, ts in said:
        for x in counters:
            near = [(tt, n) for tt, n in x[3] if ts - T['num_pre'] <= tt <= ts + T['num_win']]
            if not any(n <= v for _, n in near) and not any(n <= v for tt, n in x[3] if tt <= ts): continue   # not counting towards this number
            for tt, n in near:
                if n <= v or n - v > max(2, .25 * v): continue
                if any(w == n and t2 <= tt + T['num_said'] for w, t2 in said): continue   # the voice says the higher value by then
                bad.append((x[0], x[1], n, v, ts, tt))
    first = {}
    for cx, cy, n, v, ts, tt in bad: first.setdefault((cx, cy, n, v, ts), tt)
    bad = [f'counter at ({cx:.0f}, {cy:.0f}) shows "{n}" from {tt:.1f} s while the voice says {v} at {ts:.1f} s' for (cx, cy, n, v, ts), tt in sorted(first.items(), key=lambda a: a[1])]
    nread = sum(len(r) for r in reads.values())
    line('NUMBERS', 'FAIL' if bad else 'PASS', f'{len(said)} spoken numbers ({", ".join(str(v) for v, _ in said)}); {nread} large numbers read in {len(times)} frames, '
         f'{len(tracks)} places, {len(counters)} changing (counters); rolled past the voice: {"; ".join(bad[:6]) or "none"}')


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


def element_events(G, fps, band):
    """(new, cut, res): per frame, does something new land (local change or a new picture), is it a new picture, and the cells' residuals.
    Motion-compensated: each cell is matched against the frame el_lag s earlier at every shift up to el_shift px (block matching), so a camera
    push, a pan or a cut-out drifting forward is not new; only what was not there before is (16 Nov 2026: without it, the 2.5D depth push of
    every photo read as local change for seconds)."""
    H, W = G.shape[1:]; c, R = T['el_cell'], T['el_shift']; lag = max(1, int(round(T['el_lag'] * fps)))
    nr, nc = H // c, W // c
    keep = np.array([[(r * c >= H * T['el_top']) and not (band[0] * H - c < r * c < band[1] * H) for _ in range(nc)] for r in range(nr)]).ravel()
    new, cut = np.zeros(len(G), bool), np.zeros(len(G), bool)
    def soft(g):   # a 5x5 box (two 3x3 passes): sub-pixel motion of fine detail (a slow zoom moves edges under a pixel) is not a change
        g = g.astype(np.float32)
        for _ in range(2): p = np.pad(g, 1, mode='edge'); g = sum(p[i:i + H, j:j + W] for i in range(3) for j in range(3)) / 9
        return g
    S = [soft(g) for g in G]
    for k in range(lag, len(G)):
        a = S[k]; b = np.pad(S[k - lag], R, mode='edge'); best = None
        for dy in range(-R, R + 1):
            for dx in range(-R, R + 1):
                d = np.abs(a - b[R + dy:R + dy + H, R + dx:R + dx + W])[:nr * c, :nc * c].reshape(nr, c, nc, c).mean((1, 3)).ravel()
                best = d if best is None else np.minimum(best, d)
        cells = best[keep]; med = float(np.median(cells)); big = cells >= T['el_px']
        cut[k] = big.mean() >= T['el_cut']
        new[k] = cut[k] or int((big & (cells >= T['el_k'] * max(med, .5))).sum()) >= T['el_cells']
    return new, cut


def elements_check(G, fps, band, dur=None, one_stage=False):
    """one_stage (21 Nov 2026, owner go): a design-series reel keeps ONE design on its stage and changes it in place, so the photo-reel
    'pictures per window' minimum does not apply; new elements and the longest gap still do."""
    n = len(G) if dur is None else min(len(G), int(round(dur * fps)))
    new, cut = element_events(G[:n], fps, band)
    ts = list(np.flatnonzero(new) / fps); edges = [0.0] + ts + [n / fps]
    gaps = sorted(((b - a, a, b) for a, b in zip(edges, edges[1:])), reverse=True)
    onsets = [k / fps for k in np.flatnonzero(cut) if not cut[max(0, k - int(fps * .5)):k].any()]
    pics, wins = [], np.arange(0, max(0.0, n / fps - T['el_win']) + .01, .5)
    for a in wins: pics.append(1 + sum(1 for t in onsets if a < t <= a + T['el_win']))
    lo = min(pics) if pics else 1 + len(onsets); lo_at = float(wins[int(np.argmin(pics))]) if pics else 0.0
    long_ = [g for g in gaps if g[0] > T['el_gap']]
    bad = bool(long_) or (lo < T['el_pics'] and not one_stage)
    starts = [k for k in np.flatnonzero(new) if k == 0 or not new[k - 1]]
    line('ELEMENTS', 'FAIL' if bad else 'PASS', f'{len(starts)} new elements land ({len(starts) / max(1e-9, n / fps) * 10:.1f} per 10 s), {len(onsets)} picture changes; '
         f'longest stretch with nothing new {gaps[0][0]:.1f} s at {gaps[0][1]:.1f}-{gaps[0][2]:.1f} s (at most {T["el_gap"]} s)'
         + (f'; over it: {", ".join(f"{a:.1f}-{b:.1f} s" for _, a, b in long_[:6])}' if long_ else '')
         + f'; pictures per {T["el_win"]} s: at least {lo} (from {lo_at:.1f} s; ' + ('not required: one design changed in place, engine design)' if one_stage else f'{T["el_pics"]}+)'))


def cover_png(png, title):
    """COVER (16 Nov 2026, Echoes reels): the title is readable at frame 0 inside the centre 3:4 the profile grid keeps (y 240-1680 of 1920):
    at least 60% of its words of 3+ letters read by tesseract (conf 60+) with their boxes inside that crop."""
    want = [alnum(w) for w in title.split() if len(alnum(w)) >= 3]
    got = [(alnum(t), b) for t, cf, l, tp, r, b in ocr(png) if cf >= 60 and tp >= 240 and b <= 1680]
    hit = [w for w in want if any(w == g or (len(w) > 4 and w in g) for g, _ in got)]
    return hit, want


def cover_check(mp4, c):
    X = c.get('echoes') or {}
    if not X or X.get('cover') is False: line('COVER', 'SKIP', 'not an Echoes reel with a cover moment'); return
    if subprocess.run(['which', 'tesseract'], capture_output=True).returncode: line('COVER', 'SKIP', 'tesseract not installed on this runner'); return
    title = X.get('coverTitle') or X.get('title') or ''
    with tempfile.TemporaryDirectory() as td:
        p = os.path.join(td, 'c0.png'); grab(mp4, .05, p); hit, want = cover_png(p, title)
    ok = want and len(hit) >= .6 * len(want)
    line('COVER', 'PASS' if ok else 'FAIL', f'frame 0 shows the title "{title}" inside the centre 3:4 (y 240-1680): {len(hit)} of {len(want)} words read ({", ".join(hit) or "none"})')


def reuse_check(c):
    X = c.get('echoes')
    if not X: line('REUSE', 'SKIP', 'not an Echoes config'); return
    have = {m['id'] for m in c.get('media', []) if m.get('file')}; seen = {}
    for i, sh in enumerate(X.get('shots', [])):
        if sh.get('type') != 'arch': continue
        k = next((x for x in sh.get('img', '').split('|') if x in have), None)
        if k: seen.setdefault(k, []).append(i)
    dup = {k: v for k, v in seen.items() if len(v) > 1}
    line('REUSE', 'FAIL' if dup else 'PASS', f'{len(seen)} photos over {sum(len(v) for v in seen.values())} archival shots; used twice: '
         + ('; '.join(f'{k} in shots {", ".join(str(i + 1) for i in v)}' for k, v in dup.items()) or 'none'))


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


def split_check(G, fps, mp4, css_w=540):
    import glob
    rows = []
    for f in sorted(glob.glob(os.path.splitext(mp4)[0] + '.panes*.json')): rows += json.load(open(f))
    if not rows: line('SPLIT', 'SKIP', 'no [data-pane] before / after panes recorded'); return
    h, w = G.shape[1:3]; sc = w / css_w; lag = max(1, int(round(.2 * fps))); at = {int(round(r[0] * fps)): {p[0]: p[1:] for p in r[1]} for r in rows}; M = {'before': [], 'after': []}
    for k in range(lag, len(G)):
        bx = at.get(k)
        if not bx or 'before' not in bx or 'after' not in bx or min(bx['before'][4], bx['after'][4]) < T['split_op']: continue
        for n in M:
            l, t, r, b = [int(round(v * sc)) for v in bx[n][:4]]; dw, dh = (r - l) // 16, (b - t) // 16; l, t, r, b = max(0, l + dw), max(0, t + dh), min(w, r - dw), min(h, b - dh)
            if r - l > 4 and b - t > 4: M[n].append(float((np.abs(G[k, t:b, l:r].astype(np.int16) - G[k - lag, t:b, l:r].astype(np.int16)) > T['vis_px']).mean()))
    if len(M['before']) < 5: line('SPLIT', 'SKIP', f'BEFORE and AFTER fully shown together in under 5 samples ({len(M["before"])})'); return
    mb, ma = float(np.mean(M['before'])), float(np.mean(M['after'])); q = mb / max(ma, 1e-3)
    bad = q < T['split_ratio'] or mb < T['split_min']
    line('SPLIT', 'FAIL' if bad else 'PASS', f'over {len(M["before"])} samples side by side: BEFORE moves {mb:.1%} of its pane in 0.2 s, AFTER {ma:.1%}: {q:.2f}x '
         f'(at least {T["split_ratio"]}x and {T["split_min"]:.0%}; the 15 Nov fontswap first cut the owner could not tell apart 1.34x)')


def fill_share(g):
    """g: one grey frame (H, W) uint8 -> (fill, column share, row share) of the picture zone"""
    H = g.shape[0]; z = g[int(H * T['fill_y'][0]):int(H * T['fill_y'][1])].astype(np.float32)
    gx = np.zeros_like(z); gy = np.zeros_like(z); gx[:, 1:] = np.abs(np.diff(z, axis=1)); gy[1:] = np.abs(np.diff(z, axis=0)); m = gx + gy
    p = np.pad(m, 1, mode='edge'); m = sum(p[i:i + m.shape[0], j:j + m.shape[1]] for i in range(3) for j in range(3)) / 9
    busy = m >= T['fill_g']
    def ext(a):   # first to last line that holds the picture, as a share of the zone's width (height)
        k = np.flatnonzero(a >= T['fill_line']); return float((k[-1] - k[0] + 1) / len(a)) if len(k) else 0.
    cs, rs = ext(busy.mean(0)), ext(busy.mean(1))
    return cs * rs, cs, rs


def fill_check(G, fps, holds=()):
    step = max(1, int(round(fps * .5))); v = []
    for i in range(0, len(G), step): v.append((i / fps, *fill_share(G[i])))
    if not v: line('FILL', 'SKIP', 'no frames'); return
    low = [x for x in v if x[1] < T['fill_min']]; share = len(low) / len(v); med = float(np.median([x[1] for x in v]))
    runs = []
    for t, f, *_ in low:
        if runs and t - runs[-1][1] <= .51: runs[-1][1] = t
        else: runs.append([t, t])
    line('FILL', 'FAIL' if share > T['fill_frac'] else 'PASS', f'the picture fills a median {med:.0%} of the zone over the captions (extent across x extent down); samples under '
         f'{T["fill_min"]:.0%}: {share:.0%} (at most {T["fill_frac"]:.0%}; the centred framed 15 Nov Mona Lisa cut 80%): ' + (', '.join(f'{a:.1f}-{b + .5:.1f} s' for a, b in runs[:8]) or 'none'))


def demo_boxes(mp4, qa):
    import glob
    rows = []
    for f in sorted(glob.glob(os.path.splitext(mp4)[0] + '.subject*.json')): rows += json.load(open(f))
    if rows: return rows, 'the subject box the render recorded'
    if qa.get('subject'): return [[None] + list(qa['subject'])], 'the config\'s qa.subject'
    return [[None] + list(T['demo_box'])], 'the hero zone (no recorded box)'


def demo_check(F, fps, mp4, qa, css_w=540):
    rows, src = demo_boxes(mp4, qa); h, w = F.shape[1:3]; sc = w / css_w; step = max(1, int(round(fps * .5))); S_, M_, C_ = [], [], []
    ks = [(min(len(F) - 1, int(round(r[0] * fps))), r[1:]) for r in rows] if rows[0][0] is not None else [(k, rows[0][1:]) for k in range(0, len(F), step)]
    for k, b in ks:
        l, t, r, bt = [int(round(v * sc)) for v in b]; l, t, r, bt = max(0, l), max(0, t), min(w, r), min(h, bt)
        if (r - l) * (bt - t) < .05 * w * h: continue
        a = F[k, t:bt, l:r].astype(np.float32); mx = a.max(-1); mn = a.min(-1); lit = mx > T['demo_lit'] * 255
        if lit.sum() < 50: continue
        S_.append(float(np.median(((mx - mn) / np.maximum(mx, 1))[lit])))
        rg = a[..., 0] - a[..., 1]; yb = .5 * (a[..., 0] + a[..., 1]) - a[..., 2]
        M_.append(float(np.hypot(rg.std(), yb.std()) + .3 * np.hypot(rg.mean(), yb.mean())))
        y = .2126 * a[..., 0] + .7152 * a[..., 1] + .0722 * a[..., 2]; C_.append(float(np.percentile(y, 95) - np.percentile(y, 5)))
    if not S_: line('DEMO', 'WARN', f'no subject box of 5%+ of the frame to measure ({src})'); return
    s, m, c = (float(np.median(v)) for v in (S_, M_, C_))
    bad = [x for x, ok in (('grey', s >= T['demo_s']), ('dull', m >= T['demo_m']), ('flat', c >= T['demo_c'])) if not ok]
    line('DEMO', 'FAIL' if bad else 'PASS', f'inside {src} over {len(S_)} samples: saturation {s:.2f} (at least {T["demo_s"]}; the faded-grey 14 Nov tabs 0.21), '
         f'colourfulness {m:.0f} (at least {T["demo_m"]}), contrast p95-p5 {c:.0f} (at least {T["demo_c"]})' + (f': {", ".join(bad)}' if bad else ''))


def focus_check(F, fps, qa, css_w=540):
    """FOCUS (20 Nov 2026, web only; rules-web.md rule 18): the demo area uses at most focus_hues distinct hues, and nothing outside the subject is
    more colourful than the subject. qa.focus = {"demo": [l, t, r, b], "subject": [l, t, r, b], "from": t0, "to": t1} in CSS px (540 wide); the window
    is when the subject is on screen at that place. Hues: pixels with S > focus_s and V > focus_v, weighted by S x V in 10-degree bins, a hue counts
    when its cluster (bins of 1.5%+ of the weight, closer than focus_gap degrees, merge) holds focus_share of the weight, medians over the samples every 0.5 s. Colourfulness =
    the mean chroma (max - min channel, 0-255) of the lit pixels inside vs outside the subject box (the saturation S would call a dark navy tile
    more vivid than a bright pale panel); the subject must be the higher one. The 20 Nov snapback tiles / dots / tags (eight hues) are the failing case."""
    f = qa.get('focus')
    if not f: line('FOCUS', 'WARN', 'no "qa": {"focus": {demo, subject, from, to}} in the config: declare the demo area and the subject box'); return
    sb, db = f.get('subject'), f.get('demo') or list(T['demo_box'])
    if not (isinstance(sb, list) and len(sb) == 4): line('FOCUS', 'WARN', 'qa.focus.subject is not a [l, t, r, b] box yet: declare what the reel is about'); return
    h, w = F.shape[1:3]; sc = w / css_w; t0, t1 = f.get('from', 0), f.get('to', len(F) / fps)
    px = lambda b: [int(round(v * sc)) for v in b]
    dl, dt, dr, dbm = px(db); sl, st, sr, sbm = px(sb); N, S_, R_ = [], [], []
    for k in range(int(t0 * fps), min(len(F), int(t1 * fps) + 1), max(1, int(round(fps * .5)))):
        A = F[k, dt:dbm, dl:dr]; H, Sa, Va = hsv(A); m = (Sa > T['focus_s']) & (Va > T['focus_v'])
        if m.sum() < 50: continue
        hist = np.bincount((H[m] // 10).astype(int) % 36, weights=(Sa * Va)[m], minlength=36); tot = hist.sum()
        on = [i for i in range(36) if hist[i] >= .015 * tot]; cl = []   # clusters of neighbouring bins (gaps under focus_gap degrees merge)
        for i in on:
            if cl and (i * 10 - cl[-1][-1] * 10) < T['focus_gap']: cl[-1].append(i)
            else: cl.append([i])
        if len(cl) > 1 and (cl[0][0] * 10 + 360 - cl[-1][-1] * 10) < T['focus_gap']: cl[0] = cl.pop() + cl[0]
        N.append(sum(1 for c in cl if sum(hist[i] for i in c) >= T['focus_share'] * tot))
        a = A.astype(np.float32); mx = a.max(-1); ch = mx - a.min(-1); lit = mx > T['demo_lit'] * 255
        ins = np.zeros(lit.shape, bool); ins[max(0, st - dt):max(0, sbm - dt), max(0, sl - dl):max(0, sr - dl)] = True
        if (lit & ins).sum() < 50 or (lit & ~ins).sum() < 50: continue
        S_.append(float(ch[lit & ins].mean())); R_.append(float(ch[lit & ~ins].mean()))
    if not N or not S_: line('FOCUS', 'WARN', f'no samples with a coloured demo and a subject box in {t0:.1f}-{t1:.1f} s'); return
    n, sv, rv = float(np.median(N)), float(np.median(S_)), float(np.median(R_)); bad = []
    if n > T['focus_hues']: bad.append(f'{n:.0f} hues in the demo (at most {T["focus_hues"]})')
    if rv >= sv: bad.append(f'the rest of the demo (chroma {rv:.0f}) is as colourful as the subject ({sv:.0f})')
    line('FOCUS', 'FAIL' if bad else 'PASS', f'{t0:.1f}-{t1:.1f} s, {len(N)} samples: {n:.0f} hues in the demo (at most {T["focus_hues"]}), colourfulness subject {sv:.0f} vs the rest {rv:.0f} '
         f'(the subject must be higher)' + (': ' + '; '.join(bad) if bad else ''))


def black_check(F, fps, c, qa, mp4):
    """BLACKBG (23 Nov 2026, web only; rules-web.md rule 19; owner: the three plain black reels beat every framed, coloured one): the background
    outside the subject is near black. Median brightness (max channel, 0-255) of every pixel outside the recorded subject box, every 0.5 s (text is
    too few pixels to move a median); the median over the samples must stay at or under black_v. FAIL on a reel whose config palette is "black"
    (or qa.black true); a WARN on any other web reel, so the old coloured looks are still measured but not blocked."""
    rows, src = demo_boxes(mp4, qa); h, w = F.shape[1:3]; sc = w / 540; V = []
    ks = [(min(len(F) - 1, int(round(r[0] * fps))), r[1:]) for r in rows] if rows[0][0] is not None else [(k, rows[0][1:]) for k in range(0, len(F), max(1, int(round(fps * .5))))]
    for k, b in ks:
        l, t, r, bt = [int(round(v * sc)) for v in b]; m = np.ones((h, w), bool); m[max(0, t):bt, max(0, l):r] = False
        V.append(float(np.median(F[k].max(-1)[m])))
    if not V: line('BLACKBG', 'SKIP', 'no samples'); return
    med = float(np.median(V)); must = c.get('palette') == 'black' or qa.get('black'); bad = med > T['black_v']
    line('BLACKBG', 'FAIL' if bad and must else 'WARN' if bad else 'PASS', f'background outside the subject: median brightness {med:.0f} of 255 over {len(V)} samples (at most {T["black_v"]}'
         + ('' if must else '; not a black-look reel, so only a warning') + ')')


def subj_at(rows, t):
    """the recorded subject box nearest to t (rows: [t, l, t, r, b] every 0.5 s)"""
    best = min(rows, key=lambda r: abs((r[0] or 0) - t)); return best[1:]


def calm_series(G, fps, band, css_w=540):
    """the share of the frame (the subtitle band left out) that changes by calm_px+ over 0.2 s, one value per 0.1 s step"""
    h, w = G.shape[1:3]; sc = w / css_w; lag = max(1, int(round(.2 * fps)))
    m = np.ones((h, w), bool); m[int(band[0] * sc):int(band[1] * sc)] = False
    return np.array([float((np.abs(G[k].astype(np.int16) - G[k - lag].astype(np.int16))[m] > T['calm_px']).mean()) for k in range(lag, len(G))])


def calm_check(G, fps, mp4, qa):
    e = calm_series(G, fps, qa.get('band') or T['calm_band'])
    if not len(e): line('CALM', 'SKIP', 'no frames'); return
    med, mean = float(np.median(e)), float(e.mean())
    bad = med > T['calm_med'] or mean > T['calm_mean']
    runs = []
    for i in np.flatnonzero(e > T['calm_step']):
        t0 = (i + 2) / fps
        if runs and t0 - runs[-1][1] <= .21: runs[-1][1] = t0
        else: runs.append([t0, t0])
    line('CALM', 'FAIL' if bad else 'PASS', f'the frame outside the subtitle band changes {med:.1%} in 0.2 s at the median (at most {T["calm_med"]:.1%}), {mean:.1%} on average '
         f'(at most {T["calm_mean"]:.0%}; the 15 Nov "too wiggly" form cut 7.0% / 8.3%); busy moments (over {T["calm_step"]:.0%}): '
         + (', '.join(f'{a:.1f}-{b + .1:.1f} s' for a, b in runs[:10]) or 'none'))


def demo_hue(F, fps, rows, css_w=540):
    """-> (main hue in degrees, its share of the coloured weight, samples) inside the subject box every 0.5 s"""
    h, w = F.shape[1:3]; sc = w / css_w; step = max(1, int(round(fps * .5))); hist = np.zeros(36); n = 0
    ks = [(min(len(F) - 1, int(round(r[0] * fps))), r[1:]) for r in rows] if rows[0][0] is not None else [(k, rows[0][1:]) for k in range(0, len(F), step)]
    for k, b in ks:
        l, t, r, bt = [int(round(v * sc)) for v in b]; l, t, r, bt = max(0, l), max(0, t), min(w, r), min(h, bt)
        if (r - l) * (bt - t) < .05 * w * h: continue
        H, S, V = hsv(F[k, t:bt, l:r]); m = (S > T['hue_s']) & (V > T['hue_v'])
        if m.sum() < 50: continue
        hist += np.bincount((H[m] // 10).astype(int) % 36, weights=(S * V)[m], minlength=36); n += 1
    if not n or hist.sum() == 0: return None, 0, n
    sm = sum(np.roll(hist, d) * wt for d, wt in ((-2, .25), (-1, .6), (0, 1), (1, .6), (2, .25)))
    i = int(np.argmax(sm)); return i * 10 + 5, float(sm[i] / sm.sum()), n


def hdist(a, b): d = abs(a - b) % 360; return min(d, 360 - d)


def hue_refs(name):
    """the last hue_last web reels before this one (captions.json postOn) that have a line in demo-hues.json"""
    root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
    try: caps = json.load(open(os.path.join(root, 'templates', 'showreels', 'captions.json')))
    except (OSError, ValueError): caps = {}
    try: hues = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'demo-hues.json')))['reels']
    except (OSError, ValueError, KeyError): hues = {}
    me = (caps.get(name) or {}).get('postOn') or '9999'
    past = sorted(((v.get('postOn') or '', k) for k, v in caps.items() if isinstance(v, dict) and v.get('channel') == 'web' and k != name
                   and k in hues and (v.get('postOn') or '') < me), reverse=True)
    return [(k, hues[k]['hue']) for _, k in past[:T['hue_last']]]


def hue_check(F, fps, mp4, qa, name):
    rows, src = demo_boxes(mp4, qa); hue, share, n = demo_hue(F, fps, rows)
    if hue is None: line('HUE', 'WARN', f'no coloured pixels in the demo to measure ({src})'); return
    refs = hue_refs(name)
    if not refs: line('HUE', 'WARN', f'demo main hue {hue} deg ({share:.0%} of its colour); no earlier web reels in scripts/qa/demo-hues.json'); return
    near = [(k, h, hdist(hue, h)) for k, h in refs if hdist(hue, h) < T['hue_min']]
    line('HUE', 'FAIL' if near else 'PASS', f'demo main hue {hue} deg ({share:.0%} of its colour, {n} samples in {src}) vs the last {len(refs)} web reels '
         + ', '.join(f'{k.replace("showreel-", "")} {h}' for k, h in refs) + f' (at least {T["hue_min"]} deg from each)'
         + (': too close to ' + ', '.join(f'{k} ({d} deg)' for k, h, d in near) if near else ''))


def sheen_check(G, fps):
    H, W = G.shape[1:]; y0, y1 = int(H * T['sheen_y'][0]), int(H * T['sheen_y'][1]); lag = max(1, int(round(.2 * fps)))
    yy, xx = np.mgrid[0:y1 - y0, 0:W]; proj = []
    for a in list(range(15, 80, 5)) + list(range(100, 170, 5)):
        r = np.deg2rad(a); s_ = -xx * np.sin(r) + yy * np.cos(r); s_ = np.round(s_ - s_.min()).astype(int).ravel()
        tot = np.convolve(np.bincount(s_), np.ones(3), 'same'); proj.append((a, s_, tot, tot >= (y1 - y0) * .6 * 3))
    v = []
    for k in range(lag, len(G)):
        pos = ((G[k, y0:y1].astype(np.int16) - G[k - lag, y0:y1].astype(np.int16)) > T['sheen_d']).ravel(); best = (0, 0, 0)
        for a, s_, tot, ok in proj:
            if not ok.any(): continue
            f = np.where(ok, np.convolve(np.bincount(s_, weights=pos, minlength=len(tot)), np.ones(3), 'same') / np.maximum(tot, 1), 0)
            i = int(np.argmax(f)); sc = float(f[i] - np.median(f[ok]))
            if sc > best[0]: best = (sc, a, i)
        v.append(best)
    ev, cur = [], None
    for i, (sc, a, o) in enumerate(v):
        if sc > T['sheen_score'] and cur and abs(a - cur[-1][1]) <= 10: cur.append((i, a, o))
        elif sc > T['sheen_score']: cur = [(i, a, o)]; ev.append(cur)
        else: cur = None
    ev = [e for e in ev if len(e) >= T['sheen_steps'] and len({np.sign(e[j + 1][2] - e[j][2]) for j in range(len(e) - 1)} - {0}) == 1]
    top = max((x[0] for x in v), default=0)
    line('SHEEN', 'FAIL' if len(ev) >= T['sheen_events'] else 'WARN' if ev else 'PASS', f'straight bright bands sweeping the hero zone: {len(ev)} '
         f'(at {", ".join(f"{(e[0][0] + lag) / fps:.1f} s" for e in ev[:8]) or "none"}; best line score {top:.2f}, a sweep over {T["sheen_score"]} for {T["sheen_steps"]}+ steps; '
         f'the 15 Nov glass sheen: 15 sweeps)')


def hero_check(F, fps, mp4):
    import glob
    rows = []
    for f in sorted(glob.glob(os.path.splitext(mp4)[0] + '.subject*.json')): rows += json.load(open(f))
    if not rows: line('HERO', 'WARN', 'no subject box recorded (a kit scene reports it with subj(); techkit/capture.cjs records it)'); return
    h, w = F.shape[1:3]; sc = w / 1080; lag = max(1, int(round(T['hero_lag'] * fps))); S = T['hero_shift']
    def grey(k):
        y = lumf(F[k]) * 255; p = np.pad(y, 1, mode='edge'); return sum(p[i:i + h, j:j + w] for i in range(3) for j in range(3)) / 9
    act, ats, widths = [], [], []; rows = sorted(rows); ins = T['hero_inset']
    for r in rows:
        k = int(round(r[0] * fps)); box = [v * sc for v in r[1:]]
        if k < lag or k >= len(F): continue
        prev = [v * sc for v in min(rows, key=lambda q: abs(q[0] - (k - lag) / fps))[1:]]   # the subject's box lag s earlier
        widths.append((r[3] - r[1]) / 1080); l0, t0, r0, b0 = box; ix, iy = (r0 - l0) * ins, (b0 - t0) * ins
        l, t, rr, b = int(round(l0 + ix)), int(round(t0 + iy)), int(round(r0 - ix)), int(round(b0 - iy)); l, t = max(0, l), max(0, t); rr, b = min(w, rr), min(h, b)
        if rr - l < 4 or b - t < 4: continue
        A, B = grey(k)[t:b, l:rr], grey(k - lag); best = 1.
        ys, xs = np.mgrid[t:b, l:rr].astype(np.float32)
        fx, fy = (prev[2] - prev[0]) / max(1., r0 - l0), (prev[3] - prev[1]) / max(1., b0 - t0)   # this box onto the earlier one
        for dy in range(-S, S + 1):
            for dx in range(-S, S + 1):
                xi = np.clip(np.round(prev[0] + (xs + dx - l0) * fx).astype(int), 0, w - 1); yi = np.clip(np.round(prev[1] + (ys + dy - t0) * fy).astype(int), 0, h - 1)
                best = min(best, float((np.abs(A - B[yi, xi]) > T['hero_px']).mean()))
        act.append(best); ats.append(r[0])
    if not act: line('HERO', 'WARN', 'no usable subject boxes'); return
    still = [f'{x:.1f}' for x, v in zip(ats, act) if v < T['hero_on']]
    a = np.array(act); share = float((a >= T['hero_on']).mean()); wm = float(np.median(widths))
    bad = [x for x, ok in ((f'the subject itself changes in only {share:.0%} of the samples', share >= T['hero_active']), (f'it spans {wm:.0%} of the width', wm >= T['hero_w'])) if not ok]
    line('HERO', 'FAIL' if bad else 'PASS', f'the hero subject changes by itself (the box move, zoom and squeeze and a rim glow taken out) in {share:.0%} of {len(a)} samples (at least {T["hero_active"]:.0%}; '
         f'median change {np.median(a):.1%}), spans {wm:.0%} of the frame width (at least {T["hero_w"]:.0%}); still at {", ".join(still[:14]) or "none"}{" ..." if len(still) > 14 else ""} s; render 5 (bobbing, glowing 5 ATM watch) 44%, screen-120hz 67%' + (': ' + '; '.join(bad) if bad else ''))


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
    licence_check(c, ch)
    voice_checks(text, speeds, heard) if text else line('PACE', 'SKIP', 'no narration in the config')
    sound_checks(mp4, logs)
    F = frames(mp4, fps, 270, 480)
    look3d = c.get('look') == '3d'   # the colour-world 3D look (26 Nov 2026, design/3d-kit-phase2.md): its LOOK gold is gold.json "tech3d", and saturated fill may cover more of the frame
    if look3d: T['sat_frac'] = .5
    colour_checks(F, fps, cover)
    edge_checks(F, fps, qa.get('edges_ok', []), heard, mp4)
    if ch == 'c3': grade_check(F, fps, cover, qa.get('subject') or (qa.get('guess') or {}).get('box'), (qa.get('guess') or {}).get('css_width', 540))
    else: line('GRADE', 'SKIP', 'Turns Out only')
    if ch == 'web': bulk_check(F, fps); vibrancy_check(F, fps); spread_check(F, fps); demo_check(F, fps, mp4, qa); hue_check(F, fps, mp4, qa, name); focus_check(F, fps, qa); black_check(F, fps, c, qa, mp4)
    else: line('BULK', 'SKIP', 'web only'); line('VIBRANCY', 'SKIP', 'web only'); line('SPREAD', 'SKIP', 'web only'); line('DEMO', 'SKIP', 'web only'); line('HUE', 'SKIP', 'web only'); line('FOCUS', 'SKIP', 'web only'); line('BLACKBG', 'SKIP', 'web only')
    if qa.get('guess'): guess_check(F, fps, qa['guess'], heard)
    elif ch == 'c3' and (c.get('experiment') or {}).get('id', '').startswith('c3-guess'): line('GUESS', 'FAIL', 'a guess reel without "qa": {"guess": {answer, reveal, box}} in its config')
    else: line('GUESS', 'SKIP', 'not a guess reel')
    if ch == 'tech': hero_check(F, fps, mp4)
    else: line('HERO', 'SKIP', 'tech only')
    G = frames(mp4, fps, 135, 240, gray=True); del F
    variety_check(mp4, qa.get('subs') or T['subs'][ch])
    look_check(mp4, 'tech3d' if look3d else ch, name)
    numbers_check(mp4, text, heard, qa.get('subs') or T['subs'][ch])
    sync_check(mp4, *sync_words(c, qa, ch), heard, dur, qa.get('subs') or T['subs'][ch])
    dead_check(G, fps, mp4, dur)
    if ch == 'tech': sheen_check(G, fps)
    else: line('SHEEN', 'SKIP', 'tech only')
    if ch == 'c3': fill_check(G, fps); elements_check(G, fps, qa.get('subs') or T['subs'][ch], one_stage=c.get('engine') == 'design'); reuse_check(c); cover_check(mp4, c)
    else: line('FILL', 'SKIP', 'Turns Out only'); line('ELEMENTS', 'SKIP', 'Turns Out only'); line('REUSE', 'SKIP', 'Turns Out only'); line('COVER', 'SKIP', 'Turns Out only')
    if ch == 'web': calm_check(G, fps, mp4, qa)
    else: line('CALM', 'SKIP', 'web only')
    if qa.get('mute'): mute_check(G, fps, qa['mute'], heard)
    else: line('MUTE', 'SKIP' if ch != 'web' else 'WARN', 'no "qa": {"mute": {before, after}} in the config' + (' (web: declare the before/after moments)' if ch == 'web' else ''))
    split_check(G, fps, mp4)
    verdict = 'OUTPUT QA: PASS' if not fails else f'OUTPUT QA: FAIL ({len(fails)}): ' + ' | '.join(f[:160] for f in fails)
    print(verdict)
    if summary:
        open(summary, 'a').write('### Output QA (final MP4)\n\n' + '\n'.join(f'- {s}' for s in out) + f'\n\n**{verdict}**\n')
    if failf:
        open(failf, 'w').write('\n'.join(f'- {f[:300]}' for f in fails) + '\n' if fails else '')
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()
