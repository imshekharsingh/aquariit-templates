#!/usr/bin/env python3
"""Reel quality gate (15 Oct 2026, design/aligned-plan.md "Reel recipe"). Runs on GitHub after the render, before the owner sees a reel.
usage: python3 -I scripts/film/reel-gate.py VIDEO.mp4 [--json OUT.json]   exit 0 = PASS, 1 = FAIL (the reasons are printed)
Measures the motion, not stills: cuts (hard picture changes), the longest stretch where the composition barely changes, a dead ending, and contrast.
Needs ffmpeg and numpy."""
import json, subprocess, sys
import numpy as np

args = sys.argv[1:]
video = args[0]
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
# static: the longest window where the frame stays close to where it started (small motion inside one framing still counts as static)
L = int(2.5 * FPS)
longest, at, i = 0.0, 0.0, 0
while i < n:
    j = i
    while j + 1 < n and np.abs(g[j + 1] - g[i]).mean() < 9: j += 1
    if (j - i) / FPS > longest: longest, at = (j - i) / FPS, i / FPS
    i = j + 1
# dead ending: how much the last 3 s change compared with the film's average
tail = step[n - 4 * FPS:n - int(1.5 * FPS)].mean() if n > 4 * FPS else 0   # the 2.5 s before the brand ending
avg = step.mean() + 1e-6
contrast = float(np.median(g.reshape(n, -1).std(axis=1)))
# a one-camera film changes the picture by moving, not cutting: count 1.5 s windows (without a cut) where the frame ends far from where it began
moves, i, W15 = [], 0, int(1.5 * FPS)
while i + W15 < n:
    if not any(i / FPS <= c <= (i + W15) / FPS for c in cuts) and np.abs(g[i + W15] - g[i]).mean() > 14: moves.append(round(i / FPS, 1)); i += W15
    else: i += int(.5 * FPS)
shots = len(cuts) + len(moves)
rules = [
    ('shots', shots >= 6, f'{shots} new pictures ({len(cuts)} cuts + {len(moves)} camera moves; need 6+, one every 1.5-2.5 s)'),
    ('static', longest < 3.0, f'longest unchanged framing {longest:.1f} s at {at:.1f} s (max 3.0 s)'),
    ('ending', tail > .5 * avg, f'motion before the ending {tail:.2f} vs film average {avg:.2f} (dead ending if under 50%)'),
]
warn = [('contrast', contrast >= 30, f'contrast {contrast:.0f} (30+ advised; pale reels wash out on phones)')]
ok = all(r[1] for r in rules)
for k, good, msg in rules: print(('PASS ' if good else 'FAIL ') + f'{k:9s} {msg}')
for k, good, msg in warn: print(('PASS ' if good else 'WARN ') + f'{k:9s} {msg}')
print('GATE:', 'PASS' if ok else 'FAIL', f'({dur:.1f} s, cuts at {cuts})')
if '--json' in args:
    json.dump({'pass': ok, 'cuts': cuts, 'moves': moves, 'longestStatic': longest, 'staticAt': at, 'tailMotion': float(tail), 'avgMotion': float(avg), 'contrast': contrast, 'warnings': [m for k, good, m in warn if not good],
               'rules': {k: {'pass': bool(good), 'note': msg} for k, good, msg in rules}}, open(args[args.index('--json') + 1], 'w'), indent=1)
sys.exit(0 if ok else 1)
