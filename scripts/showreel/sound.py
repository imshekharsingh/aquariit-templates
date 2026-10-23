# Sound for seekable reels (owner, 23 Oct 2026: "audio and transition sounds are really important to support the hook").
# The reel study (scripts/study-reels.mjs) showed what holds people: sound from frame 0, a voice reading the hook, a quiet bed,
# and a hit or whoosh on every cut, all dense and loud (-14 LUFS). Here every sound is made in code from the scene's own cue list
# (window.CUES, written next to the MP4 by seek.mjs), so sound and picture share one timeline.
# Usage: python3 scripts/showreel/sound.py <cues.json> <out.wav> [narration.wav]
#   cues.json: { dur, bed: { bpm, origin, chords }, cues: [ { t, k, g?, p?, d?, text?, voice?, speed? } ] }
#   k: whoosh (d = length), hit, boom, pop (p = pitch step), tick, click, shimmer, riser (d), voice (text; Kokoro, Apache-2.0, runs on the runner)
# Seeded noise only, so the same cues always give the same sound. The workflow levels the mix to -14 LUFS when it muxes.
import json, sys, wave
import numpy as np

SR = 48000
rng = np.random.default_rng(20)


def env_exp(n, tau):
    return np.exp(-np.arange(n) / (tau * SR))


def bandpass_sweep(x, f0, f1, q=1.2):
    # state-variable filter whose centre glides from f0 to f1 (log), the shape of a whoosh
    n = len(x); out = np.empty(n); lo = bp = 0.0
    fc = np.exp(np.linspace(np.log(f0), np.log(f1), n))
    fk = 2 * np.sin(np.pi * np.minimum(fc, SR / 6) / SR); dq = 1 / q
    for i in range(n):
        f = fk[i]; hi = x[i] - lo - dq * bp; bp += f * hi; lo += f * bp; out[i] = bp
    return out


def pan(m, p):   # p -1..1, constant power; p may be an array
    a = (np.asarray(p) + 1) * np.pi / 4
    return np.stack([m * np.cos(a), m * np.sin(a)])


def whoosh(d, g=1, p=0):
    n = int(d * SR); k = np.linspace(0, 1, n)
    e = np.where(k < .68, (k / .68) ** 2.2, ((1 - k) / .32) ** 1.4)   # swells to the moment of the cut, then falls away fast
    f0, f1 = 300 * 2 ** p, 3200 * 2 ** p
    m = bandpass_sweep(rng.standard_normal(n), f0, f1, 1.4) * e
    return pan(m / (np.abs(m).max() + 1e-9) * .9 * g, np.linspace(-.6, .6, n))


def riser(d, g=1, p=0):
    n = int(d * SR); k = np.linspace(0, 1, n); e = k ** 2.6
    m = bandpass_sweep(rng.standard_normal(n), 400 * 2 ** p, 7000 * 2 ** p, 2.5)
    m = m / (np.abs(m).max() + 1e-9)
    f = 110 * 2 ** p * 2 ** (3 * k); ph = 2 * np.pi * np.cumsum(f) / SR
    m = (.7 * m + .25 * np.sin(ph) + .12 * np.sin(2 * ph)) * e
    return pan(m * g, np.sin(k * 9) * .4)


def hit(g=1, p=0, deep=False):
    n = int((1.1 if deep else .6) * SR); tt = np.arange(n) / SR
    f = (45 if deep else 70) * 2 ** p + (170 if deep else 140) * np.exp(-tt / .045)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(n, .38 if deep else .17)
    nz = rng.standard_normal(n); nz = np.convolve(nz, np.ones(6) / 6, 'same') * env_exp(n, .012)
    m = np.tanh(1.6 * (body + .55 * nz)) * g
    return pan(m, 0)


def pop(g=1, p=0):   # a word landing: woody pitched blip
    n = int(.16 * SR); tt = np.arange(n) / SR
    f0 = 520 * 2 ** (p / 12)
    f = f0 * (1 + .6 * np.exp(-tt / .012))
    m = (np.sin(2 * np.pi * np.cumsum(f) / SR) + .3 * np.sin(4 * np.pi * np.cumsum(f) / SR)) * env_exp(n, .045)
    m += .3 * rng.standard_normal(n) * env_exp(n, .003)
    return pan(m * g * .8, (p % 5 - 2) * .12)


def tick(g=1, p=0):
    n = int(.05 * SR); tt = np.arange(n) / SR
    m = np.sin(2 * np.pi * 2400 * 2 ** (p / 12) * tt) * env_exp(n, .008) + .5 * rng.standard_normal(n) * env_exp(n, .0015)
    return pan(m * g * .45, ((p * 7) % 9 - 4) * .1)


def click(g=1, p=0):
    n = int(.04 * SR); tt = np.arange(n) / SR
    m = np.diff(rng.standard_normal(n + 1)) * env_exp(n, .002) + np.sin(2 * np.pi * 1700 * tt) * env_exp(n, .006)
    return pan(m * g * .5, 0)


def shimmer(g=1, p=0):
    n = int(1.2 * SR); tt = np.arange(n) / SR; m = np.zeros(n)
    for j, f in enumerate([1760, 2637, 3520, 4186]):
        m += np.sin(2 * np.pi * f * 2 ** (p / 12) * tt + j) * env_exp(n, .25 + .1 * j) * np.clip(tt / (.03 + .04 * j), 0, 1)
    return pan(m * g * .14, np.sin(tt * 6) * .5)


def voice(text, speed=1.1, name='af_heart'):
    try:
        from kokoro import KPipeline
        pipe = KPipeline(lang_code='a', repo_id='hexgrad/Kokoro-82M')
        a = np.concatenate([np.asarray(c[2], dtype=float).reshape(-1) for c in pipe(text, voice=name, speed=speed)])
    except Exception as e:   # no voice model on this machine: the reel keeps its sound effects and bed
        print('voice skipped:', e); return None
    a = np.interp(np.arange(0, len(a) * 2) / 2, np.arange(len(a)), a)   # 24 kHz -> 48 kHz
    on = np.argmax(np.abs(a) > .02 * np.abs(a).max()); a = a[max(0, on - 240):]   # start on the first syllable
    a = a / (np.abs(a).max() + 1e-9)
    a = np.tanh(1.8 * a) / np.tanh(1.8)   # a little density, like a broadcast voice
    print(f'voice: "{text}" {len(a) / SR:.2f} s')
    return pan(a * .95, 0)


def bed(dur, bpm, origin, chords):
    # a quiet bed in time with the cuts: pad chord per bar, a soft sub on 1 and 3, closed hats on the offbeats
    n = int(dur * SR); out = np.zeros((2, n)); beat = 60 / bpm; bar = 4 * beat
    tt = np.arange(n) / SR; ph = (tt - origin) / bar; bi = np.floor(ph).astype(int); kb = ph - bi
    hz = lambda m: 440 * 2 ** ((m - 69) / 12)
    pad = np.zeros(n)
    for b in np.unique(bi):
        notes = chords[b % len(chords)]; sel = bi == b
        # each bar's chord fades in over 0.35 s and hands over to the next
        e = np.clip(kb[sel] * bar / .35, 0, 1) * np.clip((1 - kb[sel]) * bar / .25 + .15, 0, 1)
        for j, m in enumerate(notes[1:]):
            for det in (-.003, .003):
                for h in range(1, 5):
                    pad[sel] += np.sin(2 * np.pi * hz(m) * (1 + det) * h * tt[sel] + j + h) / h ** 1.6 * e * .08
        f = hz(notes[0]); kk = kb[sel] * 4 % 2 * beat   # seconds since beat 1 or 3
        sub = np.sin(2 * np.pi * f * tt[sel]) * np.exp(-kk / .55)
        kick = np.sin(2 * np.pi * (48 + 110 * np.exp(-kk / .03)) * kk) * np.exp(-kk / .16)
        pad[sel] += .28 * sub + .42 * kick   # light low end: phone speakers turn a heavy sub into mud under the voice
    out += pan(pad, 0) * .9
    hk = ((tt - origin) / (beat / 2)); hi = np.floor(hk).astype(int); hs = (hk - hi) * beat / 2
    nz = np.diff(rng.standard_normal(n + 1)) * .5
    hat = nz * np.exp(-hs / .025) * np.where(hi % 2 == 1, .16, .06)
    out += pan(hat, .25)
    return out


def reverb(x, sec=1.4, mix=.18):
    n = int(sec * SR); ir = rng.standard_normal((2, n)) * env_exp(n, sec / 5); ir[:, :int(.012 * SR)] = 0
    L = 1 << int(np.ceil(np.log2(x.shape[1] + n)))
    y = np.fft.irfft(np.fft.rfft(x, L) * np.fft.rfft(ir, L), L)[:, :x.shape[1]]
    return x + mix * y / (np.abs(y).max() + 1e-9) * np.abs(x).max()


def main(cues_path, out_path, narration=None):
    C = json.load(open(cues_path)); dur = float(C['dur']); n = int(dur * SR)
    sfx = np.zeros((2, n + SR * 2)); vox = np.zeros((2, n + SR * 4))
    def put(buf, s, t):
        i = int(round(t * SR)); a = max(0, i); s = s[:, a - i:]; buf[:, a:a + s.shape[1]] += s[:, :buf.shape[1] - a]
    for c in C['cues']:
        k, t, g, p = c['k'], float(c['t']), c.get('g', 1), c.get('p', 0)
        if t >= dur: continue
        if k == 'voice':
            v = voice(c['text'], c.get('speed', 1.1), c.get('voice', 'af_heart'))
            if v is not None: put(vox, v * g, t)
            continue
        if k == 'whoosh': s = whoosh(c.get('d', .6), g, p); t -= .68 * c.get('d', .6)   # peak lands on the cue
        elif k == 'riser': s = riser(c.get('d', 1), g, p); t -= c.get('d', 1)   # ends on the cue
        elif k == 'boom': s = hit(g, p, True)
        else: s = {'hit': hit, 'pop': pop, 'tick': tick, 'click': click, 'shimmer': shimmer}[k](g, p)
        put(sfx, s, t)
    if narration:   # the whole-reel voice from voice.py, from frame 0; the bed ducks under it
        with wave.open(narration) as w: v = np.frombuffer(w.readframes(w.getnframes()), '<i2').reshape(-1, w.getnchannels()).T / 32767
        put(vox, v[:2] if v.shape[0] > 1 else np.vstack([v, v]), 0)
    sfx, vox = sfx[:, :n], vox[:, :n]
    B = C.get('bed')
    b = bed(dur, B['bpm'], B['origin'], B['chords']) if B else np.zeros((2, n))
    duck = np.convolve(np.abs(vox[0]), np.ones(2400) / 2400, 'same'); duck = 1 - .55 * np.clip(duck / (duck.max() + 1e-9) * 3, 0, 1)
    mix = .5 * b * duck + .75 * reverb(sfx) + 1.0 * vox
    mix = np.tanh(1.3 * mix) * .8
    fade = int(.004 * SR); mix[:, :fade] *= np.linspace(0, 1, fade); mix[:, -fade:] *= np.linspace(1, 0, fade)
    pcm = (np.clip(mix, -1, 1) * 32767).astype('<i2').T.copy()
    with wave.open(out_path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    print(f'wrote {out_path}: {dur:.2f} s, {len(C["cues"])} cues' + (', bed' if B else ''))


if __name__ == '__main__':
    main(*sys.argv[1:4])
