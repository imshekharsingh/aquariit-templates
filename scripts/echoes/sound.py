"""Turns Out / Echoes engine sound: the owner's kit score and sound design (design/kits/echoes_kit.zip, sound_h.py), ported 15 Nov 2026.
Reads the scene's cues (window.CUES = {engine: 'echoes', ep: {total, scenes, shots}}, written by scripts/showreel/seek.mjs) and the narration,
writes the mixed stereo 48 kHz WAV; the Showreel workflow then levels it to -14 LUFS and checks it (SOUND GATE, Output QA).
The score stays the kit's (detuned string pads in 4.8 s chord cycles, a sparse piano motif, timpani on the turns, a cymbal swell before them,
faint wind room tone); every EFFECT plays a recorded CC0 sample where the runner has them (scripts/showreel/samples.py swap: whoosh before
every shot, typewriter clicks under every typed stamp plus a bell, a shutter snap on full-bleed photos, a thud on framed portraits and 2.5D depth shots, ticks
under counters, a rustle on documents), the kit's synthesized one otherwise. The kit's mix: voice chain, 55% ducking, reverbs, gains.
Usage: python3 scripts/echoes/sound.py <cues.json> <out.wav> [narration.wav]"""
import sys, os, json, wave
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve, resample_poly
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'showreel'))
import samples  # noqa: E402

C = json.load(open(sys.argv[1])); EP = C['ep']; OUT = sys.argv[2]; NAR = sys.argv[3] if len(sys.argv) > 3 else None
SR = 48000; TOTAL = float(C.get('dur') or EP['total']); N = int(TOTAL * SR) + SR; SC = EP['scenes']; SH = EP['shots']
rng = np.random.default_rng(11)
T = lambda d: np.arange(int(d * SR)) / SR
lp = lambda x, f, o=2: sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
hp = lambda x, f, o=2: sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
bp = lambda x, a, b, o=2: sosfilt(butter(o, [a, b], 'band', fs=SR, output='sos'), x)
def env(n, a, d):
    t = np.arange(n) / SR; return np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) / d)
def put(bus, t0, sig, g=1.0, pan=0.0):
    s = int(t0 * SR)
    if s >= N: return
    if s < 0: sig, s = sig[-s:], 0
    sig = sig[: N - s]; l, r = np.cos((pan + 1) * np.pi / 4) * 1.414, np.sin((pan + 1) * np.pi / 4) * 1.414
    bus[s:s + len(sig), 0] += sig * g * l; bus[s:s + len(sig), 1] += sig * g * r
def fx(kind, sig, t):   # the recorded CC0 version of an effect (same peak, same timing), the kit's synthesized one without samples
    return samples.swap(kind, sig, t)
def reverb(x, secs, mix):
    n = int(secs * SR); t = np.arange(n) / SR; ir = rng.standard_normal((n, 2)) * np.exp(-t / (secs / 5))[:, None]
    ir = np.stack([lp(ir[:, c], 5000) for c in range(2)], 1)
    wet = np.stack([fftconvolve(x[:, c], ir[:, c])[: len(x)] for c in range(2)], 1); wet *= np.max(np.abs(x)) / (np.max(np.abs(wet)) + 1e-9)
    return x * (1 - mix) + wet * mix
def nf(n):
    m = {'C': -9, 'C#': -8, 'D': -7, 'Eb': -6, 'E': -5, 'F': -4, 'F#': -3, 'G': -2, 'G#': -1, 'A': 0, 'Bb': 1, 'B': 2}
    return 440 * 2 ** ((m[n[:-1]] + 12 * (int(n[-1]) - 4)) / 12)
music = np.zeros((N, 2)); sfx = np.zeros((N, 2)); amb = np.zeros((N, 2))
end_t = TOTAL - 1.5
put_src = TOTAL - 1.25   # the sources line lands in the tail with a soft bell (Output QA DEAD)

# ---------- music (the kit's European score: A minor) ----------
def strings(f, d, g):
    t = T(d); vib = 1 + 0.004 * np.sin(2 * np.pi * 5.2 * t); y = np.zeros_like(t)
    for det in (-0.003, 0, 0.0035):
        ph = 2 * np.pi * np.cumsum(f * (1 + det) * vib) / SR
        for h in range(1, 8): y += np.sin(h * ph + h) / h
    y = lp(y, 900 + 300 * (f > 300)); sw = np.minimum(1, t / (d * 0.35)) * np.minimum(1, (d - t) / (d * 0.3))
    return y * sw * g
def piano(f, d=3.0, g=1.0):
    t = T(d); y = np.zeros_like(t)
    for h, a in ((1, 1), (2, .45), (3, .22), (4, .12), (5, .06)):
        fh = f * h * np.sqrt(1 + 0.0004 * h * h); y += a * np.sin(2 * np.pi * fh * t) * np.exp(-t * (0.9 + h * 0.6))
    return y * env(len(t), 0.004, 10) * g
PADS = [['A1', 'E2', 'A2', 'C3'], ['F1', 'C2', 'A2', 'C3'], ['D2', 'A2', 'D3', 'F3'], ['E1', 'B1', 'G#2', 'B2']]
MOTIF = ['E5', 'C5', 'A4', 'B4', 'C5', 'B4', 'G#4', 'A4']
cl = 4.8
for i, t0 in enumerate(np.arange(0.0, end_t + 1, cl)):
    for n in PADS[i % 4]: put(music, t0, strings(nf(n), cl + 1.2, 0.022), 1, rng.uniform(-.5, .5))
mt = SC[1]['start'] if len(SC) > 1 else 2.0; k = 0
while mt < end_t - 0.5:
    put(music, mt, piano(nf(MOTIF[k % len(MOTIF)]), 3.2), 0.11, 0.25 * np.sin(k)); mt += 1.2 if k % 4 != 3 else 2.4; k += 1
def timp(f=55, g=1.0):
    x = T(2.5); ff = f * (1 + 0.15 * np.exp(-x / 0.05)); s = np.sin(2 * np.pi * np.cumsum(ff) / SR) * env(len(x), 0.003, 0.9)
    return (s + 0.4 * lp(rng.standard_normal(len(x)), 300) * env(len(x), 0.002, 0.06)) * g
def swell(d=1.6):
    x = T(d); return hp(rng.standard_normal(len(x)), 3000) * (x / d) ** 3 * np.minimum(1, (d - x) / 0.05)
for li in (3, 5):
    if li < len(SC): put(music, SC[li]['start'] - 0.05, timp(), 0.5); put(sfx, SC[li]['start'] - 1.6, swell(), 0.05)
last = SH[-1]['t0']
x = T(5); put(music, last, sum(strings(nf(n), 5, 0.03) for n in PADS[0]), 1)

# ---------- effects (the kit's, each swapped for its recorded sample) ----------
def air_whoosh(d=0.9):
    n = int(d * SR); x = rng.standard_normal(n); fc = 200 + 1600 * np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    y = lp(x, 1200)
    return y * np.sin(np.pi * np.linspace(0, 1, n)) ** 2
def key_click():
    x = T(0.06); return bp(rng.standard_normal(len(x)), 1500, 6000) * env(len(x), 0.0005, 0.008) + 0.5 * np.sin(2 * np.pi * 180 * x) * env(len(x), 0.001, 0.01)
def ding():
    x = T(1.2); return (np.sin(2 * np.pi * 2093 * x) + .4 * np.sin(2 * np.pi * 5230 * x)) * env(len(x), 0.002, 0.25)
def thud():
    x = T(0.5); return np.sin(2 * np.pi * np.cumsum(60 + 80 * np.exp(-x / 0.02)) / SR) * env(len(x), 0.002, 0.08) + 0.5 * lp(rng.standard_normal(len(x)), 1200) * env(len(x), 0.001, 0.03)
def rustle(d=0.8):
    x = T(d); n = bp(rng.standard_normal(len(x)), 1500, 7000); return n * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 9 * x + rng.uniform(0, 3)))) * np.sin(np.pi * x / d)
def shutter():
    return np.concatenate([key_click() * 2, np.zeros(int(0.09 * SR)), key_click() * 1.5])
def tick():
    x = T(0.03); return bp(rng.standard_normal(len(x)), 2500, 8000) * env(len(x), 0.0003, 0.004)
def typing(t0, s, d=1.0):   # one key per character over d seconds (the engine types stamps over 1 s), then the bell
    n = max(1, len([c for c in s if c.strip()])); dt = d / max(1, len(s))
    for i, c in enumerate(s):
        if c.strip(): t = t0 + i * dt + rng.uniform(-.006, .006); put(sfx, t, fx('click', key_click(), t), 0.16 * rng.uniform(.7, 1), rng.uniform(-.3, .3))
    put(sfx, t0 + d + .05, fx('bell', ding(), t0 + d), 0.05)
for i, sh in enumerate(SH):
    t0, dur = sh['t0'], sh['t1'] - sh['t0']
    if i > 0: put(sfx, t0 - 0.45, fx('whoosh', air_whoosh(0.9), t0), 0.10, rng.uniform(-.5, .5))
    if sh.get('stamp'): typing(t0 + .35, sh['stamp'])
    if sh['type'] == 'arch' and sh.get('mode') == 'full': put(sfx, t0 + 0.05, fx('snap', shutter(), t0), 0.25); put(sfx, t0 - 0.2, swell(0.6), 0.04)
    if sh['type'] == 'arch' and sh.get('mode') == 'framed' and i > 0: put(sfx, t0 + 0.1, fx('thud', thud(), t0), 0.18)
    if sh['type'] == 'arch' and sh.get('mode') == 'depth' and i > 0:   # 2.5D shot (15 Nov 2026): the cut-out comes forward on a soft thud over a swell
        put(sfx, t0 + 0.12, fx('thud', thud(), t0), 0.15); put(sfx, t0 - 0.2, swell(0.6), 0.04)
    k = sh.get('kind')
    if k == 'wall':
        for j in range(4): t = t0 + .5 + j * .28; put(sfx, t, fx('tap', thud(), t), 0.14)
        typing(t0 + 1.7, sh.get('label', ''), .9)
    if k == 'dossier':
        put(sfx, t0 + 0.1, fx('rustle', rustle(1.0), t0), 0.18)
        for j, r in enumerate(sh.get('rows', [])): typing(t0 + .5 + j * 1.0, r, .8)
        sa = t0 + sh.get('stampAt', 2.8); put(sfx, sa, fx('hit', thud(), sa), 0.4)
    if k == 'counter':
        e = min(dur - .9, 2.6)
        for j in range(20): t = t0 + .3 + (e - .3) * (1 - (1 - j / 20) ** 1.5); put(sfx, t, fx('tick', tick(), t), 0.12)
        sa = t0 + e + .15; put(sfx, sa, fx('hit', thud(), sa), 0.4); put(music, sa, timp(48), 0.25)
    if k == 'map':
        e = min(dur - .8, 2.6)
        for j in range(int((e - .4) / .18)): t = t0 + .4 + j * .18; put(sfx, t, fx('tick', tick(), t), 0.05)
        put(sfx, t0 + e, fx('thud', thud(), t0 + e), 0.3)
        if sh.get('label'): typing(t0 + 1.0, sh['label'], .9)
    if k == 'journey':   # the route drawing leg by leg (16 Nov 2026), a tick along each, a soft thud on arrival
        for j in range(len(sh.get('legs', [])) - sh.get('draw', 0)):
            a = t0 + sh.get('legT', .35) + j * 1.25
            for q in range(5): t = a + q * .2; put(sfx, t, fx('tick', tick(), t), 0.06)
            put(sfx, a + 1.1, fx('thud', thud(), a + 1.1), 0.22)
    if k == 'paper':
        put(sfx, t0 + 0.1, fx('rustle', rustle(1.0), t0), 0.2)
        for j, r in enumerate(sh.get('rows', [])): typing(t0 + .5 + j * .8, r, .7)
        sa = t0 + sh.get('stampAt', 2.4); put(sfx, sa, fx('hit', thud(), sa), 0.4)
    if k == 'ui':   # flat UI cards (21 Nov 2026): a soft tap and a click as each piece pops in, a hit on a red cross
        for d in sh.get('pops', []): t = t0 + d; put(sfx, t, fx('tap', thud(), t), 0.09 * rng.uniform(.8, 1), rng.uniform(-.3, .3)); put(sfx, t + .02, fx('click', key_click(), t), 0.1)
        if sh.get('xt') is not None: put(sfx, sh['xt'], fx('hit', thud(), sh['xt']), 0.34); put(music, sh['xt'], timp(48), 0.16)
    if k == 'sketch':   # code-drawn engraved panel (20 Nov 2026): pen strokes while the lines draw on, a soft thud as it fills, a hit on the cross
        for j in range(7): t = t0 + .08 + j * .16; put(sfx, t, fx('rustle', rustle(.14), t), 0.06 * rng.uniform(.7, 1), rng.uniform(-.4, .4))
        put(sfx, t0 + .5, fx('thud', thud(), t0 + .5), 0.1)
        if sh.get('xt') is not None:
            put(sfx, sh['xt'], fx('hit', thud(), sh['xt']), 0.38); put(sfx, sh['xt'] + .12, fx('snap', shutter(), sh['xt']), 0.14); put(music, sh['xt'], timp(48), 0.18)
    for a in sh.get('adds', []):   # layered elements (16 Nov 2026): every element that lands is heard
        t, ak = a['t'], a['kind']
        if ak == 'tag': put(sfx, t, fx('tap', thud(), t), 0.1); put(sfx, t + .15, fx('click', key_click(), t), 0.14)
        if ak == 'figure': put(sfx, t + .05, fx('thud', thud(), t), 0.16)
        if ak == 'clip': put(sfx, t, fx('rustle', rustle(.6), t), 0.18); put(sfx, t + .35, fx('tap', thud(), t), 0.12)
        if ak == 'count':
            r0 = t - a.get('roll', 1.3)
            for j in range(16): tt = r0 + (t - r0) * (1 - (1 - j / 16) ** 1.5); put(sfx, tt, fx('tick', tick(), tt), 0.1)
            put(sfx, t, fx('hit', thud(), t), 0.35); put(music, t, timp(48), 0.2)
HUD = EP.get('hud') or {}
for y in HUD.get('years', []): put(sfx, y['t'], fx('tick', tick(), y['t']), 0.2); put(sfx, y['t'] + .03, fx('tap', thud(), y['t']), 0.1)
for g in HUD.get('legs', []):
    for q in range(6): t = g['t'] + q * .2; put(sfx, t, fx('tick', tick(), t), 0.05)
    put(sfx, g['t'] + 1.2, fx('tap', thud(), g['t'] + 1.2), 0.12)
for g in HUD.get('pulse', []): put(sfx, g['t'], fx('bell', ding(), g['t']), 0.04)
put(sfx, put_src, fx('bell', ding(), put_src), 0.06)
xw = T(TOTAL); put(amb, 0, lp(rng.standard_normal(len(xw)), 350) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.07 * xw)), 0.03)

# ---------- mix (the kit's) ----------
vo = np.zeros(N)
if NAR and os.path.exists(NAR):
    with wave.open(NAR) as w:
        a = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(float) / 32767; vsr = w.getframerate()
        if w.getnchannels() > 1: a = a.reshape(-1, w.getnchannels()).mean(1)
    if vsr != SR: a = resample_poly(a, SR, vsr)
    vo[:min(N, len(a))] = a[:N]
    vo = hp(vo, 75); vo = vo + 0.15 * bp(vo, 2500, 6000); vo = np.tanh(vo * 1.5) / np.tanh(1.5)
e = np.convolve(np.abs(vo), np.ones(2400) / 2400, 'same'); nz = e[e > 1e-4]
e = np.minimum(1, e / ((np.percentile(nz, 70) if len(nz) else 1) + 1e-9))
dk = np.zeros_like(e); a = 0.0
for i in range(0, len(e), 48): a += ((1 - np.exp(-1 / (0.03 * SR))) if e[i] > a else (1 - np.exp(-1 / (0.4 * SR)))) * 48 * (e[i] - a); dk[i:i + 48] = min(1, max(0, a))
duck = 1 - 0.55 * dk
music = reverb(music, 3.0, 0.35); sfx = reverb(sfx, 1.6, 0.2)
bg = (music * 0.55 + amb * 0.6) * duck[:, None] + sfx * 0.5
mix = bg + np.stack([vo, vo], 1)
ft = np.arange(N) / SR; mix *= np.clip((TOTAL - ft) / 0.6, 0, 1)[:, None]
L = int(TOTAL * SR); mix = mix[:L]; pk = np.max(np.abs(mix)) + 1e-9; mix = mix / pk * 0.89
with wave.open(OUT, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(mix, -1, 1) * 32767).astype('<i2').tobytes())
sp = np.zeros(L, bool)
for s in SC: sp[int(s['start'] * SR):int(s['end'] * SR)] = True
db = lambda z: 20 * np.log10(np.sqrt(np.mean(z ** 2)) + 1e-12)
v, b = db(vo[:L][sp] / pk * .89), db(bg.mean(1)[:L][sp] / pk * .89)
print(f'ECHOES SOUND: voice {v:.1f} dB, background under speech {b:.1f} dB: voice {v - b:.1f} dB above (the kit asks 12+)')
samples.report()
