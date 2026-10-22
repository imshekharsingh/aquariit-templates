#!/usr/bin/env python3
"""Frame-by-frame review of a rendered film (owner, 14 Oct 2026: "why not capture frame by frame to check this?").

usage: python3 -I scripts/film/frame-review.py VIDEO.mp4 OUTDIR [--every 2] [--cuts 1.8,4.72,...]

1. Measures every frame: how much the picture changes from the previous frame (motion), and brightness.
2. Flags: frozen stretches (nothing moves for >= 0.4 s), unplanned jumps (a big change that is not a listed cut),
   judder (motion that stutters high/low/high instead of flowing), flashes (brightness jumps).
3. Writes motion.png (a graph of the whole film with the cuts marked) and contact sheets of every Nth frame
   (sheet-01.png ...), each tile labelled with its time, so every moment can be looked at, not only a few stills.
Needs ffmpeg, numpy and Pillow.
"""
import os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw

args = sys.argv[1:]
if len(args) < 2:
    sys.exit(__doc__)
video, out = args[0], args[1]
every = int(args[args.index('--every') + 1]) if '--every' in args else 2
cuts = [float(x) for x in args[args.index('--cuts') + 1].split(',')] if '--cuts' in args else []
os.makedirs(out, exist_ok=True)
FPS = 30

# small grey frames for the measurements, larger colour frames for the sheets
W, H = 90, 160
raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', video, '-vf', f'scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], capture_output=True, check=True).stdout
g = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)
n = len(g)
motion = np.zeros(n)
motion[1:] = np.abs(g[1:] - g[:-1]).mean(axis=(1, 2))
bright = g.mean(axis=(1, 2))

t = np.arange(n) / FPS
near_cut = lambda tt: any(abs(tt - c) <= 0.1 for c in cuts)
report = []
# frozen: >= 12 frames in a row with almost no change
run = 0
for i in range(1, n):
    run = run + 1 if motion[i] < 0.35 else 0
    if run == 12:
        report.append(f'FROZEN   {t[i - 11]:5.2f}s: nothing moves for 0.4 s+')
# unplanned jumps: much bigger than the local flow and not at a listed cut
for i in range(2, n):
    local = np.median(motion[max(1, i - 8):i + 8])
    if motion[i] > 18 and motion[i] > 3.5 * max(local, 1) and not near_cut(t[i]):
        report.append(f'JUMP     {t[i]:5.2f}s: change {motion[i]:.0f} vs flow {local:.1f} (not a listed cut)')
# judder: motion alternating strongly over 4 frames while things are moving
for i in range(3, n - 1):
    a, b, c, d = motion[i - 2:i + 2]
    if min(a, b, c, d) > 1.5 and ((b < .45 * a and c > 2.2 * b and d < .45 * c) or (b > 2.2 * a and c < .45 * b and d > 2.2 * c)) and not near_cut(t[i]):
        report.append(f'JUDDER   {t[i]:5.2f}s: motion {a:.1f} {b:.1f} {c:.1f} {d:.1f}')
# flashes
for i in range(1, n):
    if abs(bright[i] - bright[i - 1]) > 40 and not near_cut(t[i]):
        report.append(f'FLASH    {t[i]:5.2f}s: brightness {bright[i - 1]:.0f} -> {bright[i]:.0f}')
loop = np.abs(g[0] - g[-1]).mean()
report.append(f'LOOP     last frame vs first: {loop:.1f} ({"seamless" if loop < 8 else "visible jump"})')

# motion graph
GW, GH = 1080, 300
img = Image.new('RGB', (GW, GH + 30), (12, 14, 18))
d = ImageDraw.Draw(img)
mx = max(20, motion.max())
for c in cuts:
    x = int(c / (n / FPS) * GW)
    d.line([(x, 0), (x, GH)], fill=(70, 70, 120))
pts = [(int(i / n * GW), GH - int(motion[i] / mx * (GH - 10))) for i in range(n)]
d.line(pts, fill=(80, 220, 255), width=2)
bpts = [(int(i / n * GW), GH - int(bright[i] / 255 * (GH - 10))) for i in range(n)]
d.line(bpts, fill=(255, 210, 90), width=1)
for s in range(0, int(n / FPS) + 1):
    x = int(s / (n / FPS) * GW)
    d.line([(x, GH), (x, GH + 6)], fill=(200, 200, 200))
    d.text((x + 2, GH + 8), f'{s}s', fill=(200, 200, 200))
d.text((8, 6), 'motion per frame (cyan), brightness (yellow), planned cuts (blue)', fill=(220, 220, 220))
img.save(os.path.join(out, 'motion.png'))

# contact sheets of every Nth frame
TW, TH, COLS, ROWS = 180, 320, 6, 5
frames = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', video, '-vf', f'scale={TW}:{TH}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True, check=True).stdout
f = np.frombuffer(frames, np.uint8).reshape(-1, TH, TW, 3)
idx = list(range(0, len(f), every))
per = COLS * ROWS
for s in range(0, len(idx), per):
    sheet = Image.new('RGB', (COLS * TW, ROWS * (TH + 14)), (0, 0, 0))
    sd = ImageDraw.Draw(sheet)
    for k, i in enumerate(idx[s:s + per]):
        x, y = (k % COLS) * TW, (k // COLS) * (TH + 14)
        sheet.paste(Image.fromarray(f[i]), (x, y + 14))
        sd.text((x + 4, y + 1), f'{i / FPS:5.2f}s  f{i}', fill=(255, 255, 255))
    sheet.save(os.path.join(out, f'sheet-{s // per + 1:02d}.png'))

print('\n'.join(report) if report else 'no flags')
print(f'{n} frames measured; sheets of every {every} frame(s) and motion.png in {out}')
