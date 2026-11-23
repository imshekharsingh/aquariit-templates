"""The kit's sound design (design/kits/motion_kit.zip sound.py), driven by the topic: an original synthesized music bed in A minor at 100 BPM
(Am-F-C-G with 7ths: detuned saw pads, a sub from chapter 2, a pluck arp and four-on-the-floor from THE FIX, extra hats from chapter 4,
a heartbeat kick under THE PROBLEM, the bed stops on the final title and an A-major pad rings out), whooshes before every chapter, and the
topic's "sfx" list, each effect on a named cue: [cue, fx, gain, pan, {opts}].
Effects are recorded CC0 samples where the repo has them (scripts/showreel/samples.py swaps each synthesized effect for a recorded one with the
same peak and timing); the small UI sounds ride the detail bus (scripts/showreel/detail.py: 10-16 dB under the voice, no duck) and are
gated by SOUND DETAIL. render(tl, topic, vo_wav, out_wav) -> dict of levels, the SOUND SOURCE and SOUND DETAIL lines."""
import os, sys
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, fftconvolve, resample_poly

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'scripts', 'showreel'))
import samples, detail   # noqa: E402

SR = 48000


def render(TL, topic, vo_wav, out_wav):
    C, SC, TOTAL = dict(TL['cues']), TL['scenes'], TL['total']
    st = lambda i: SC[i]['start']
    NS = len(SC)
    N = int(TOTAL * SR) + SR
    rng = np.random.default_rng(7)

    def T(d): return np.arange(int(d * SR)) / SR
    def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
    def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
    def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)

    def env(n, a, d):
        t = np.arange(n) / SR
        return np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) / d)

    def put(bus, t0, sig, gain=1.0, pan=0.0):
        s = int(t0 * SR)
        if s >= N or s + len(sig) <= 0: return
        if s < 0: sig, s = sig[-s:], 0
        sig = sig[: N - s]
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        bus[s:s + len(sig), 0] += sig * gain * l * 1.414
        bus[s:s + len(sig), 1] += sig * gain * r * 1.414

    def reverb(x, secs=1.6, mix=0.25):
        n = int(secs * SR); t = np.arange(n) / SR
        ir = rng.standard_normal((n, 2)) * np.exp(-t / (secs / 5))[:, None]
        ir[:, 0] = lp(ir[:, 0], 6000); ir[:, 1] = lp(ir[:, 1], 6000)
        wet = np.stack([fftconvolve(x[:, c], ir[:, c])[: len(x)] for c in range(2)], 1)
        wet *= np.max(np.abs(x)) / (np.max(np.abs(wet)) + 1e-9)
        return x * (1 - mix) + wet * mix

    def nf(name):
        names = {'C': -9, 'C#': -8, 'D': -7, 'D#': -6, 'E': -5, 'F': -4, 'F#': -3, 'G': -2, 'G#': -1, 'A': 0, 'A#': 1, 'B': 2}
        return 440 * 2 ** ((names[name[:-1]] + 12 * (int(name[-1]) - 4)) / 12)

    music = np.zeros((N, 2)); drums = np.zeros((N, 2)); sfx = np.zeros((N, 2)); det = np.zeros((N, 2))
    t_end = C['final']
    BPM = 100; beat = 60 / BPM; bar = beat * 4
    CHORDS = [['A2', 'A3', 'C4', 'E4', 'G4'], ['F2', 'F3', 'A3', 'C4', 'E4'], ['C3', 'G3', 'C4', 'E4', 'G4'], ['G2', 'G3', 'B3', 'D4', 'F#4']]

    def saw(f, d, dt=0.0):
        t = T(d); y = np.zeros_like(t)
        for h in range(1, 10):
            if f * h > 9000: break
            y += np.sin(2 * np.pi * f * (1 + dt) * h * t + h) / h
        return y
    cl = 2 * bar
    for ci, t0 in enumerate(np.arange(0.0, t_end, cl)):
        ch = CHORDS[ci % 4]; d = cl + 0.8
        for n in ch[1:]:
            f = nf(n)
            for dt, pan in ((-0.004, -0.6), (0.004, 0.6)):
                v = lp(saw(f, d, dt), 1500) * env(int(d * SR), 0.6, 2.6) * np.minimum(1, (d - T(d)) / 0.8)
                put(music, t0, v, 0.035, pan)
        fr = nf(ch[0])
        if t0 >= st(1) - cl:
            for b in np.arange(0, cl, beat / 2):
                if t0 + b > t_end or t0 + b < st(1) - .1: continue
                tt = T(beat / 2 * 0.95); s = np.sin(2 * np.pi * fr * tt) + 0.3 * np.sin(4 * np.pi * fr * tt)
                put(music, t0 + b, s * env(len(tt), 0.005, 0.12), 0.12 if t0 + b >= st(2) - .2 else 0.06)
        if t0 >= st(2) - cl:
            tones = [nf(x) * 2 for x in ch[1:]]
            for j, b in enumerate(np.arange(0, cl, beat / 4)):
                tt = t0 + b
                if tt < st(2) or tt > t_end: continue
                f = tones[[0, 2, 1, 3, 2, 1, 3, 2][j % 8]]; x = T(0.35)
                s = (np.sin(2 * np.pi * f * x) + 0.4 * np.sin(4 * np.pi * f * x)) * env(len(x), 0.002, 0.09)
                put(music, tt, s, 0.05, 0.4 * np.sin(j))

    def kick(g=1):
        x = T(0.45); f = 45 + 95 * np.exp(-x / 0.04)
        return (np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(x), 0.002, 0.16) + 0.3 * lp(rng.standard_normal(len(x)), 900) * env(len(x), 0.001, 0.01)) * g
    def hat():
        x = T(0.08); return hp(rng.standard_normal(len(x)), 7500) * env(len(x), 0.001, 0.018)
    def clap():
        x = T(0.25); return bp(rng.standard_normal(len(x)), 900, 4000) * (env(len(x), 0.001, 0.05) + 0.6 * np.roll(env(len(x), 0.001, 0.03), 480))
    for b in np.arange(0.0, t_end - 0.05, beat):
        i = round(b / beat)
        if st(1) - .1 <= b < st(2) - .3 and i % 2 == 0: put(drums, b, kick(), 0.32)
        if b >= st(2):
            put(drums, b, kick(), 0.42); put(drums, b + beat / 2, hat(), 0.10, 0.3)
            if i % 2 == 1: put(drums, b, clap(), 0.07, -0.1)
        if NS > 3 and b >= st(3): put(drums, b + beat / 4 * 3, hat(), 0.05, -0.3)

    # ---- effects (the kit's synthesizers) ----
    def whoosh(d=0.7, up=True):
        n = int(d * SR); x = rng.standard_normal(n); y = np.zeros(n); a = 0.0
        fc = np.linspace(300, 6000, n) if up else np.linspace(6000, 300, n)
        al = 1 - np.exp(-2 * np.pi * fc / SR)
        for i in range(n): a += al[i] * (x[i] - a); y[i] = a
        return y * np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    def blip(f, d=0.25, f2=None, harm=0.3):
        x = T(d); ff = np.full_like(x, f) if f2 is None else f + (f2 - f) * (1 - np.exp(-x / 0.05))
        ph = 2 * np.pi * np.cumsum(ff) / SR
        return (np.sin(ph) + harm * np.sin(2 * ph)) * env(len(x), 0.003, d / 4)
    def chime(fs, d=1.4):
        x = T(d); y = np.zeros_like(x)
        for k, f in enumerate(fs):
            y += np.roll((np.sin(2 * np.pi * f * x) + 0.25 * np.sin(2 * np.pi * f * 2.76 * x) * np.exp(-x / 0.1)) * env(len(x), 0.002, d / 3.5), int(k * 0.06 * SR))
        return y / len(fs)
    def impact():
        x = T(2.2); f = 32 + 70 * np.exp(-x / 0.08)
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(x), 0.003, 0.5) + lp(rng.standard_normal(len(x)), 2500) * env(len(x), 0.002, 0.25) * 0.5
    def riser(d=1.2):
        n = int(d * SR); x = T(d); f = 200 * 2 ** (x / d * 3)
        return (hp(rng.standard_normal(n), 1500) * 0.6 + np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.3) * (x / d) ** 2.5
    def zap():
        x = T(0.12); return (hp(rng.standard_normal(len(x)), 2000) * 0.6 + np.sin(2 * np.pi * (1800 - 9000 * x) * x)) * env(len(x), 0.001, 0.025)
    def thud():
        k = kick(1.4); return k + 0.5 * lp(rng.standard_normal(len(k)), 400) * env(len(k), 0.001, 0.08)
    def shutter():
        x = T(0.09); return hp(rng.standard_normal(len(x)), 1800) * env(len(x), 0.0005, 0.012) + 0.6 * np.sin(2 * np.pi * 180 * x) * env(len(x), 0.001, 0.02)

    hits = []   # (time, peak on the detail bus) for SOUND DETAIL
    dcues = []

    def fx(kind, t0, sig, gain, pan, sample_kind=None):
        """an effect: recorded when a sample exists; detail kinds go to the detail bus (levelled from the voice later)"""
        k = sample_kind or kind
        s = samples.swap(k, sig, t0, pan * 4) if samples.has(k) else sig
        if k in detail.KINDS: dcues.append({'t': t0, 'k': k, 'g': gain, 'sig': s, 'pan': pan})
        else: put(sfx, t0, s, gain, pan)

    put(sfx, 0.05, whoosh(1.0, False), 0.2)
    CUT = topic.get('cutsound')   # sound designed on the cuts (rules-tech.md M9; 24 Nov 2026): the picture changes at st(i) - 0.2
    def subhit():   # a short low hit that lands on the cut and rings over it
        x = T(0.9); f = 38 + 44 * np.exp(-x / 0.05)
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(x), 0.004, 0.22) + 0.25 * lp(rng.standard_normal(len(x)), 700) * env(len(x), 0.001, 0.03)
    def swell(d=0.5):   # air that rises into the cut and stops on it
        n = int(d * SR); x = T(d); return hp(lp(rng.standard_normal(n), 5000), 500) * (x / d) ** 3
    for i in range(1, NS):   # a whoosh into every chapter (the camera move)
        if CUT:
            b = st(i) - 0.2; pan = (-1) ** i * 0.35
            put(sfx, b - 0.5, swell(0.5), 0.16, pan); put(sfx, b - 0.02, subhit(), 0.34, 0); fx('whoosh', b - 0.3, whoosh(0.6, True), 0.14, -pan)
        else: fx('whoosh', st(i) - 0.45, whoosh(0.75, True), 0.2, (-1) ** i * 0.3)
    if CUT and isinstance(CUT, dict) and CUT.get('payoff') in C:   # a long riser that crests exactly on the payoff word, the bed held back under it
        tp = C[CUT['payoff']]; d = float(CUT.get('rise', 1.8)); put(sfx, tp - d, riser(d), 0.2); put(sfx, tp - 0.01, subhit(), 0.4)
        ft_ = np.arange(N) / SR; dip = 1 - 0.75 * np.clip(1 - np.abs(ft_ - (tp - 0.18)) / 0.2, 0, 1); music *= dip[:, None]; drums *= dip[:, None]
    if 'fix' in C: put(sfx, st(2) - 1.3, riser(1.2), 0.2)
    pent = [nf(n) for n in ['A5', 'C6', 'D6', 'E6', 'G6', 'A6', 'C7', 'D7', 'E7', 'G7', 'A7', 'C8', 'D8', 'E8', 'G8']]
    C['start'] = 0.0
    for e in topic.get('sfx', []):
        cue, kind, gain, pan = e[:4]; o = e[4] if len(e) > 4 else {}
        t0 = float(o.get('at', C[cue])) + float(o.get('off', 0))
        if kind == 'impact': fx('boom', t0, impact(), gain, pan)
        elif kind == 'pop': fx('pop', t0, blip(o.get('f', 990), 0.3, o.get('f2', 1480), 0.2), gain, pan)
        elif kind == 'blip': fx('blip', t0, blip(o.get('f', 880), 0.3, o.get('f2')), gain, pan)
        elif kind == 'tick': fx('tick', t0, blip(o.get('f', 2400), 0.04, harm=0), gain, pan)
        elif kind == 'snap': fx('snap', t0, blip(o.get('f', 520), 0.12, o.get('f2', 300), 0.8), gain, pan)
        elif kind == 'thud': fx('thud', t0, thud(), gain, pan)
        elif kind == 'whoosh': fx('whoosh', t0, whoosh(o.get('d', 0.7), o.get('up', True)), gain, pan)
        elif kind == 'chime': fx('bell', t0, chime([nf(n) for n in o.get('notes', ['A5', 'E6'])], o.get('d', 1.4)), gain, pan)
        elif kind == 'riser_end': put(sfx, t0 - 1.25, riser(1.2), gain, pan)
        elif kind in ('ticks', 'shutters', 'zaps', 'fill'):
            for i in range(int(o.get('n', 4))):
                tt = t0 + i * float(o.get('step', 0.1)); pp = pan + (i % 2 - .5) * .5
                if kind == 'ticks': fx('tick', tt, blip(o.get('f', 2400), 0.04, harm=0), gain, pp)
                elif kind == 'shutters': fx('click', tt, shutter(), gain, -.7 + 1.4 * i / max(1, o.get('n', 4) - 1))
                elif kind == 'zaps': fx('tick', tt, zap(), gain, pp)
                else: fx('blip', tt, blip(pent[i % len(pent)] / 2, 0.4, harm=0.15), gain, -.8 + 1.6 * i / max(1, o.get('n', 4) - 1))
        else: raise SystemExit(f'unknown sfx kind "{kind}"')
    x = T(3.0); pad = sum(np.sin(2 * np.pi * nf(n) * x) for n in ['A3', 'E4', 'C#5', 'B4']) * env(len(x), 0.05, 1.0)
    put(music, C['final'], lp(pad, 3000), 0.06)

    # ---- the mix: voice chain, ducking, detail bus ----
    vo, vsr = sf.read(vo_wav, dtype='float64')
    if vo.ndim > 1: vo = vo.mean(1)
    if vsr != SR: vo = resample_poly(vo, SR, vsr)
    lead = int(TL['shift'] * SR); vo = np.concatenate([np.zeros(lead), vo])
    vo = np.pad(vo, (0, max(0, N - len(vo))))[:N]
    vo = hp(vo, 80); vo = vo + 0.18 * bp(vo, 2500, 6000); vo = np.tanh(vo * 1.6) / np.tanh(1.6)
    e = np.abs(vo); w = int(0.05 * SR); e = np.convolve(e, np.ones(w) / w, 'same')
    e = np.minimum(1, e / (np.percentile(e[e > 1e-4], 70) + 1e-9))
    dk = np.zeros_like(e); a = 0.0
    att, rel = 1 - np.exp(-1 / (0.03 * SR)), 1 - np.exp(-1 / (0.35 * SR))
    for i in range(0, len(e), 48):
        a += (att if e[i] > a else rel) * 48 * (e[i] - a); dk[i:i + 48] = min(1, max(0, a))
    duck = 1 - 0.6 * dk
    music = reverb(music, 2.2, 0.3); sfx = reverb(sfx, 1.4, 0.18)
    bed = (music + drums * 0.9) * duck[:, None]
    _, _, ref = detail.speech_peaks(vo)
    peak = detail.level(detail.merge(dcues), ref)
    for c in detail.merge(dcues):
        s = detail.shape(c['sig'])[0]; s = s / (np.abs(s).max() + 1e-9) * peak(c['g'])
        put(det, c['t'], s, 1.0, c['pan']); hits.append((c['t'], float(np.abs(s).max())))
    mix = bed * 0.34 + sfx * 0.42 + det + np.stack([vo, vo], 1)
    ft = np.arange(N) / SR; mix *= np.clip((TOTAL - ft) / 0.6, 0, 1)[:, None]
    mix = mix[: int(TOTAL * SR)]
    k = 0.89 / np.max(np.abs(mix)); mix *= k
    sf.write(out_wav, mix.astype(np.float32), SR)
    bg = ((bed * 0.34 + sfx * 0.42 + det)[: int(TOTAL * SR)] * k).mean(1); vv = vo[: int(TOTAL * SR)] * k
    sp = np.abs(vv) > 0.02
    ratio = 20 * np.log10(np.sqrt((vv[sp] ** 2).mean()) / (np.sqrt((bg[sp] ** 2).mean()) + 1e-9)) if sp.any() else 0
    dline, dok = detail.gate([(t, p * k) for t, p in hits], vv)
    return {'voice_over_bg_db': round(float(ratio), 1), 'source': samples.report(), 'detail': dline, 'detail_ok': dok}
