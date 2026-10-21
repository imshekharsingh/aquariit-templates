"""Showreel compositor (owner, 21 Oct 2026). Joins the captured segments with a different cut each time (whip, zoom, glitch, flash, iris),
adds a beat punch on every cut, the 01/06 label and a segmented progress bar, writes a beat-synced score made in code (owner chose this for
showreels, option b), then encodes 1080x1920 H.264 + AAC at about -14 LUFS.
Usage: python3 scripts/showreel/compose.py <reel.json> <frames dir> <out.mp4>"""
import json, math, os, subprocess, sys, wave
import numpy as np
from PIL import Image, ImageFilter

cfg_p, FR, OUT = sys.argv[1:4]
R = json.load(open(cfg_p)); FPS = R.get('fps', 30); PAD = R.get('pad', 6); W, H = 1080, 1920
SEG = R['segments']; NS = len(SEG)
starts = [0]
for s in SEG[:-1]: starts.append(starts[-1] + round(s['dur'] * FPS))
TOTAL = starts[-1] + round(SEG[-1]['dur'] * FPS)
TL = 10                                                     # transition length in frames, centred on the cut

def frame(k, i):
    d = os.path.join(FR, f'{k + 1:02d}'); n = len(os.listdir(d)); i = max(0, min(n - 1, i))
    im = Image.open(os.path.join(d, f'{i:04d}.jpg')).convert('RGB')
    if im.size != (W, H): im = im.resize((W, im.height * W // im.width)).crop((0, 0, W, H))
    return np.asarray(im, dtype=np.float32)

def scale(a, s):
    if abs(s - 1) < 1e-3: return a
    im = Image.fromarray(a.clip(0, 255).astype(np.uint8)); w2, h2 = int(W * s), int(H * s)
    im = im.resize((w2, h2), Image.BILINEAR)
    if s > 1: x, y = (w2 - W) // 2, (h2 - H) // 2; return np.asarray(im.crop((x, y, x + W, y + H)), dtype=np.float32)
    bg = Image.new('RGB', (W, H), (0, 0, 0)); bg.paste(im, ((W - w2) // 2, (H - h2) // 2)); return np.asarray(bg, dtype=np.float32)

def hblur(a, k):
    k = int(k)
    if k < 2: return a
    c = np.cumsum(np.pad(a, ((0, 0), (k, k), (0, 0)), mode='edge'), axis=1)
    return (c[:, 2 * k:2 * k + W] - c[:, :W]) / (2 * k)

ease = lambda p: p * p * (3 - 2 * p)
rng = np.random.default_rng(7)
yy, xx = np.mgrid[0:H, 0:W]; DIAG = math.hypot(W, H) / 2

def transition(kind, A, B, p):
    if kind == 'whip':
        s = ease(p); strip = np.concatenate([A, B], axis=1); off = int(s * W)
        return hblur(strip[:, off:off + W], 90 * math.sin(math.pi * p))
    if kind == 'zoom':
        if p < .5: return scale(A, 1 + .7 * ease(p * 2)) * (1 - p) + 255 * 0 * p
        return scale(B, 1.35 - .35 * ease((p - .5) * 2))
    if kind == 'glitch':
        X = A if p < .5 else B; amt = math.sin(math.pi * p); o = X.copy()
        sh = int(36 * amt); o[:, :, 0] = np.roll(X[:, :, 0], sh, axis=1); o[:, :, 2] = np.roll(X[:, :, 2], -sh, axis=1)
        for _ in range(int(10 * amt)):
            y0 = int(rng.integers(0, H - 80)); h = int(rng.integers(12, 90)); o[y0:y0 + h] = np.roll(o[y0:y0 + h], int(rng.integers(-120, 120)), axis=1)
        return o
    if kind == 'flash':
        X = A if p < .5 else B; f = math.sin(math.pi * p) ** 1.5; return X * (1 - f) + 255 * f
    if kind == 'iris':
        r = ease(p) * DIAG * 1.08; d = np.hypot(xx - W / 2, yy - H * .55)
        m = np.clip((r - d) / 6 + .5, 0, 1)[..., None]; ring = np.clip(1 - abs(d - r) / 5, 0, 1)[..., None] * (1 - p)
        return A * (1 - m) + B * m + 255 * ring
    return B if p >= .5 else A

overlays = [np.asarray(Image.open(os.path.join(FR, f'overlay-{k + 1:02d}.png')).convert('RGBA'), dtype=np.float32) for k in range(NS)]
LY = R.get('labelY', 1310); BAR_Y, BAR_X0, BAR_X1, GAP = LY - 44, 72, W - 72, 12
segw = (BAR_X1 - BAR_X0 - GAP * (NS - 1)) / NS

def overlay(a, k, f):
    o = overlays[k]; al = o[:, :, 3:4] / 255 * min(1, (f - starts[k]) / 6 + .0001) if f >= starts[k] else o[:, :, 3:4] * 0
    a = a * (1 - al) + o[:, :, :3] * al
    for j in range(NS):                                     # segmented progress bar
        x0 = int(BAR_X0 + j * (segw + GAP)); x1 = int(x0 + segw)
        a[BAR_Y:BAR_Y + 6, x0:x1] = a[BAR_Y:BAR_Y + 6, x0:x1] * .55 + 255 * .45 * .35
        fill = 1 if j < k else 0 if j > k else (f - starts[k]) / max(1, round(SEG[k]['dur'] * FPS))
        xf = int(x0 + (x1 - x0) * max(0, min(1, fill)))
        if xf > x0: a[BAR_Y:BAR_Y + 6, x0:xf] = 255
    return a

# ---------------- the score (120 BPM; a hit on every cut; each segment its own root) ----------------
SR = 44100; N = int(TOTAL / FPS * SR); t = np.arange(N) / SR; bpm = R.get('bpm', 120); beat = 60 / bpm
mix = np.zeros(N); duck = np.ones(N)
def at(sec, sig, gain=1.0):
    i = int(sec * SR); j = min(N, i + len(sig))
    if i < N: mix[i:j] += sig[:j - i] * gain
def env(n, a=.002, d=.2):
    x = np.arange(n) / SR; return np.minimum(1, x / max(a, 1e-4)) * np.exp(-x / d)
def kick():
    n = int(.4 * SR); x = np.arange(n) / SR; f = 45 + 95 * np.exp(-x * 30); return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .001, .18)
def hat():
    n = int(.05 * SR); w = rng.standard_normal(n); w = np.diff(np.concatenate([[0], w])); return w * env(n, .0005, .012)
def noise_sweep(n, up=True):
    w = rng.standard_normal(n); y = np.zeros(n); a = 0.0
    for i in range(n):
        c = .02 + .5 * (i / n if up else 1 - i / n); a += c * (w[i] - a); y[i] = a
    return y
cuts = starts[1:]
roots = [55.0, 43.65, 65.41, 49.0, 73.42, 55.0]
for b in np.arange(0, TOTAL / FPS, beat):
    k = max(j for j in range(NS) if starts[j] / FPS <= b + 1e-6)
    last = k == NS - 1
    at(b, kick(), .9 if not last else .75)
    at(b + beat / 2, hat(), .25)
    if int(round(b / beat)) % 2 == 1: at(b + beat / 4, hat(), .12)
for k in range(NS):                                         # bass: 8th-note pulse on each segment's root
    t0, t1 = starts[k] / FPS, (starts[k + 1] if k + 1 < NS else TOTAL) / FPS; r = roots[k]
    for b in np.arange(t0, t1 - 1e-6, beat / 2):
        n = int(beat / 2 * SR); x = np.arange(n) / SR; tone = np.sin(2 * np.pi * r * x) + .35 * np.sin(2 * np.pi * r * 2 * x) + .15 * np.sin(2 * np.pi * r * 3 * x)
        at(b, tone * env(n, .004, .12), .32)
SFX = {'whip': lambda: noise_sweep(int(.35 * SR), True) * env(int(.35 * SR), .2, .12) * 2.2,
       'zoom': lambda: np.sin(2 * np.pi * np.cumsum(200 + 1400 * np.linspace(0, 1, int(.3 * SR)) ** 2) / SR) * np.linspace(0, 1, int(.3 * SR)) * .5,
       'glitch': lambda: np.concatenate([rng.standard_normal(int(.025 * SR)) * (i % 2) for i in range(10)]) * .5,
       'flash': lambda: (np.sin(2 * np.pi * 1760 * np.arange(int(.8 * SR)) / SR) + .5 * np.sin(2 * np.pi * 2637 * np.arange(int(.8 * SR)) / SR)) * env(int(.8 * SR), .002, .25) * .35,
       'iris': lambda: noise_sweep(int(.6 * SR), True) * np.linspace(0, 1, int(.6 * SR)) ** 2 * 1.6}
for k, c in enumerate(cuts):
    sec = c / FPS; kind = SEG[k + 1].get('in', 'cut')
    rs = noise_sweep(int(.5 * SR), True) * np.linspace(0, 1, int(.5 * SR)) ** 3 * 1.2; at(sec - .5, rs, .5)   # riser into the cut
    n = int(.9 * SR); x = np.arange(n) / SR; boom = np.sin(2 * np.pi * (38 + 60 * np.exp(-x * 12)) * x) * env(n, .001, .3) + rng.standard_normal(n) * env(n, .001, .03) * .6
    at(sec, boom, .9); i = int(sec * SR); duck[i:i + int(.25 * SR)] = np.minimum(duck[i:i + int(.25 * SR)], np.linspace(.65, 1, int(.25 * SR)))
    if kind in SFX: s = SFX[kind](); at(sec - (.25 if kind in ('whip', 'iris') else 0), s, .6)
    if c / FPS < 0: pass
# the payoff: a chord that swells through the last segment (A minor add9) and resolves into the loop
t0 = starts[-1] / FPS; n = N - int(t0 * SR); x = np.arange(n) / SR; sw = np.minimum(1, x / 2.5) * np.minimum(1, (n / SR - x) / .6)
chord = sum(np.sin(2 * np.pi * f * x + .3 * np.sin(2 * np.pi * .25 * x)) for f in (220, 261.63, 329.63, 493.88)) / 4
at(t0, chord * sw, .35)
mix *= duck; mix /= max(1e-9, np.abs(mix).max()) / .8
wav = OUT.replace('.mp4', '.wav')
with wave.open(wav, 'w') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())

# ---------------- picture ----------------
enc = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-', '-i', wav,
    '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000',
    '-shortest', '-movflags', '+faststart', OUT], stdin=subprocess.PIPE)
for f in range(TOTAL):
    k = max(j for j in range(NS) if starts[j] <= f); i = PAD + (f - starts[k])
    img = frame(k, i)
    if k > 0 and f - starts[k] < 6: img = scale(img, 1 + .045 * (1 - (f - starts[k]) / 6) ** 2)                 # beat punch after each cut
    for c_i, c in enumerate(cuts):                          # transitions straddle each cut
        j = f - c
        if -TL // 2 <= j < TL // 2:
            A = frame(c_i, PAD + round(SEG[c_i]['dur'] * FPS) + j); B = frame(c_i + 1, PAD + j)
            img = transition(SEG[c_i + 1].get('in', 'cut'), A, B, (j + TL // 2 + .5) / TL); k = c_i if j < 0 else c_i + 1
    img = overlay(img, k, f)
    enc.stdin.write(img.clip(0, 255).astype(np.uint8).tobytes())
    if f % 60 == 0: print(f'frame {f}/{TOTAL}', flush=True)
enc.stdin.close(); enc.wait()
print('wrote', OUT, TOTAL, 'frames')
