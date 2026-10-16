#!/usr/bin/env python3
"""Reel quality gate (15 Oct 2026, design/aligned-plan.md "Reel recipe"). Runs on GitHub after the render, before the owner sees a reel.
usage: python3 -I scripts/film/reel-gate.py VIDEO.mp4 [--theme collage|soft3d|footage] [--json OUT.json]   exit 0 = PASS, 1 = FAIL (the reasons are printed)
Checks are per theme (design/themes.md, owner 16 Oct 2026): a check made for one theme never judges another. Default theme: collage.
Measures the motion, not stills: cuts (hard picture changes), the longest stretch where the composition barely changes, a dead ending, and contrast.
Needs ffmpeg and numpy."""
import json, subprocess, sys
import numpy as np

args = sys.argv[1:]
video = args[0]
THEME = args[args.index('--theme') + 1] if '--theme' in args else 'collage'
FPS, W, H = 10, 90, 160
raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', video, '-vf', f'fps={FPS},scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], capture_output=True, check=True).stdout
g = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)
n, dur = len(g), len(g) / FPS
step = np.r_[0, np.abs(g[1:] - g[:-1]).mean(axis=(1, 2))]
# cuts: a hard change between two frames 0.1 s apart, at least 0.4 s after the previous cut
cuts, last = [], -9
# relative to the local flow, so a cut between two dark shots counts too: a jump well above the motion around it, or any big jump
for i in range(1, n):
    local = np.median(step[max(1, i - 6):min(n, i + 7)])
    if (step[i] > 20 or (step[i] > 6 and step[i] > 4 * max(local, .5))) and i / FPS - last >= .4: cuts.append(round(i / FPS, 1)); last = i / FPS
# thresholds scale with the film's contrast (premium dark films, 15 Oct 2026): on a sparse navy frame a full reframe moves fewer pixels than on a bright one
contrast = float(np.median(g.reshape(n, -1).std(axis=1)))
kc = min(1.0, max(.5, contrast / 30))
# static: the longest window where the frame stays close to where it started (small motion inside one framing still counts as static)
L = int(2.5 * FPS)
longest, at, i = 0.0, 0.0, 0
while i < n:
    j = i
    ki = min(1.0, max(.4, float(g[i].std()) / 30))   # relative to what is in the window's first frame (a near-empty dark frame changes few pixels)
    while j + 1 < n and np.abs(g[j + 1] - g[i]).mean() < 9 * ki: j += 1
    if (j - i) / FPS > longest: longest, at = (j - i) / FPS, i / FPS
    i = j + 1
# dead ending: how much the last 3 s change compared with the film's average
tail = step[n - 4 * FPS:n - int(1.5 * FPS)].mean() if n > 4 * FPS else 0   # the 2.5 s before the brand ending
avg = step.mean() + 1e-6
# a one-camera film changes the picture by moving, not cutting: count 1.5 s windows (without a cut) where the frame ends far from where it began
moves, i, W15 = [], 0, int(1.5 * FPS)
while i + W15 < n:
    if not any(i / FPS <= c <= (i + W15) / FPS for c in cuts) and np.abs(g[i + W15] - g[i]).mean() > 14 * kc: moves.append(round(i / FPS, 1)); i += W15
    else: i += int(.5 * FPS)
shots = len(cuts) + len(moves)
# fullness (owner, 15 Oct 2026: "the component count is really minimum"): once a second, the share of the frame that holds visible detail
# (16 px tiles at 180x320 with edges in them). A premium frame has a subject, supporting detail and a depth layer; under 25% reads as an empty screen.
rawf = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', video, '-vf', 'fps=1,scale=180:320', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], capture_output=True, check=True).stdout
ff = np.frombuffer(rawf, np.uint8).reshape(-1, 320, 180).astype(np.float32)
def cover(f):
    m = np.hypot(np.abs(np.diff(f, axis=1))[:-1, :], np.abs(np.diff(f, axis=0))[:, :-1]) > 10
    H, Wd = m.shape; return float((m[:H // 16 * 16, :Wd // 16 * 16].reshape(H // 16, 16, Wd // 16, 16).mean(axis=(1, 3)) > .02).mean())
covers = [cover(f) for f in ff]
sparse = [i for i, c in enumerate(covers) if c < .25]
subjectless = [i for i, c in enumerate(covers) if c < .04]
ALL_RULES = [
    ('shots', shots >= 6, f'{shots} new pictures ({len(cuts)} cuts + {len(moves)} camera moves; need 6+, one every 1.5-2.5 s)'),
    ('static', longest < (3.5 if dur > 22 else 3.0), f'longest unchanged framing {longest:.1f} s at {at:.1f} s (max {3.5 if dur > 22 else 3.0} s)'),
    ('fullness', len(sparse) <= .3 * len(covers), f'{len(sparse)} of {len(covers)} seconds look empty (under 25% of the frame holds detail; max 30%){": " + ", ".join(f"{i}s" for i in sparse) if sparse else ""}'),
    ('ending', tail > .5 * avg, f'motion before the ending {tail:.2f} vs film average {avg:.2f} (dead ending if under 50%)'),
    # soft3d (one rich subject on a calm ground): the frame may be mostly empty, but the hero must be on screen every second
    ('subject', len(subjectless) <= .1 * len(covers), f'{len(subjectless)} of {len(covers)} seconds without a visible subject (under 4% of the frame holds detail; max 10%)'),
    # footage (our site filmed on a real screen): the rhythm is the point, a new picture at least every 1.2 s
    ('rhythm', shots >= .8 * dur / 1.2, f'{shots} new pictures in {dur:.0f} s (need {int(.8 * dur / 1.2 + .999)}+, one every 1.2 s or faster)'),
]
# per-theme check profiles (design/themes.md). collage is the 15-16 Oct gate unchanged; add a theme here, never edit another theme's list
PROFILES = {'collage': ['shots', 'static', 'fullness', 'ending'], 'soft3d': ['shots', 'static', 'ending', 'subject'], 'footage': ['rhythm', 'ending']}
if THEME not in PROFILES: print(f'unknown theme {THEME!r}; known: {", ".join(PROFILES)}'); sys.exit(2)
rules = [r for r in ALL_RULES if r[0] in PROFILES[THEME]]
warn = [('contrast', contrast >= 30, f'contrast {contrast:.0f} (30+ advised; pale reels wash out on phones)')]
ok = all(r[1] for r in rules)
for k, good, msg in rules: print(('PASS ' if good else 'FAIL ') + f'{k:9s} {msg}')
for k, good, msg in warn: print(('PASS ' if good else 'WARN ') + f'{k:9s} {msg}')
print('GATE:', 'PASS' if ok else 'FAIL', f'(theme {THEME}, {dur:.1f} s, cuts at {cuts})')
if '--json' in args:
    json.dump({'pass': ok, 'theme': THEME, 'cuts': cuts, 'moves': moves, 'longestStatic': longest, 'staticAt': at, 'tailMotion': float(tail), 'avgMotion': float(avg), 'contrast': contrast, 'fullness': covers, 'warnings': [m for k, good, m in warn if not good],
               'rules': {k: {'pass': bool(good), 'note': msg} for k, good, msg in rules}}, open(args[args.index('--json') + 1], 'w'), indent=1)
sys.exit(0 if ok else 1)
