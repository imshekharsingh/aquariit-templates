"""Sound design, all synthesized in numpy (no samples): a pad per scene (the chord changes with the scene), plucks on element entrances,
bells on the hook and the takeaways, clicks on label chips, whooshes on scene changes, a kick on the hook, a thud on the hard stop,
and a resolving chord at the end. Light convolution reverb. The music ducks under the voice: voice about -15.6 dB RMS, music about
-25 dB RMS while the voice plays. render(events, vo_wav, dur, out_wav); the final loudness pass happens in make.py with ffmpeg."""
import wave

import numpy as np
from scipy.signal import fftconvolve

SR = 48000
rng = np.random.default_rng(7)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
CHORDS = {   # MIDI notes, low to high; a calm minor-to-major arc
    'Am9': [45, 57, 60, 64, 71], 'Fmaj7': [41, 57, 60, 64, 69], 'Cadd9': [48, 55, 60, 62, 67], 'G6': [43, 55, 59, 62, 64],
    'Dm9': [50, 57, 60, 65, 69], 'Em7': [40, 55, 59, 62, 67], 'Fmaj9': [41, 57, 60, 64, 67], 'Csus2': [48, 55, 60, 62, 67], 'C': [36, 55, 60, 64, 67],
}
PROGRESSION = ['Am9', 'Fmaj7', 'Cadd9', 'G6', 'Dm9', 'Em7', 'Fmaj9']


def env(n, a, r):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e


def dec(n, tau):
    return np.exp(-np.arange(n) / (tau * SR))


def pad(notes, dur):
    n = int(dur * SR); tt = np.arange(n) / SR; out = np.zeros(n)
    for j, m in enumerate(notes):
        for det in (-.004, .004):
            for h in (1, 2, 3):
                out += np.sin(2 * np.pi * hz(m) * (1 + det) * h * tt + j * 1.3 + h) / h ** 1.8 * (.55 if j == 0 else .3)
    lfo = 1 + .08 * np.sin(2 * np.pi * .4 * tt)
    return out * lfo * env(n, .35, .45) / len(notes)


def pluck(m, g=1.0):
    n = int(.9 * SR); tt = np.arange(n) / SR; f = hz(m)
    out = sum(np.sin(2 * np.pi * f * h * tt) * dec(n, .5 / h) / h for h in (1, 2, 3, 4))
    return out * np.clip(tt / .003, 0, 1) * g * .5


def bell(m, g=1.0):
    n = int(2.2 * SR); tt = np.arange(n) / SR; f = hz(m)
    idx = 3.0 * dec(n, .25)
    out = np.sin(2 * np.pi * f * tt + idx * np.sin(2 * np.pi * f * 3.5 * tt)) * dec(n, .8)
    return out * np.clip(tt / .002, 0, 1) * g * .35


def click(g=1.0):
    n = int(.03 * SR)
    nz = np.diff(rng.standard_normal(n + 1)) * dec(n, .002)
    return (nz * .5 + np.sin(2 * np.pi * 2200 * np.arange(n) / SR) * dec(n, .004) * .4) * g * .5


def whoosh(d=.5, g=1.0):
    """Noise through a band-pass whose centre sweeps up, swelling into the cut."""
    n = int(d * SR); k = np.linspace(0, 1, n)
    x = rng.standard_normal(n); out = np.empty(n); lo = bp = 0.0
    fc = np.exp(np.linspace(np.log(350), np.log(3200), n)); fk = 2 * np.sin(np.pi * fc / SR)
    for i in range(n):
        hi = x[i] - lo - .8 * bp; bp += fk[i] * hi; lo += fk[i] * bp; out[i] = bp
    e = np.where(k < .7, (k / .7) ** 2, ((1 - k) / .3) ** 1.5)
    return out / (np.abs(out).max() + 1e-9) * e * g * .5


def kick(g=1.0):
    n = int(.45 * SR); tt = np.arange(n) / SR
    f = 46 + 120 * np.exp(-tt / .035)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * dec(n, .14) * g * .9


def thud(g=1.0):
    n = int(.35 * SR); tt = np.arange(n) / SR
    body = np.sin(2 * np.pi * (60 + 50 * np.exp(-tt / .02)) * tt) * dec(n, .09)
    nz = np.convolve(rng.standard_normal(n), np.ones(24) / 24, 'same') * dec(n, .015)
    return np.tanh(1.4 * (body + .6 * nz)) * g * .8


def place(buf, x, t):
    i = int(t * SR)
    if i >= len(buf): return
    if i < 0: x, i = x[-i:], 0
    buf[i:i + len(x)] += x[:len(buf) - i]


def rms_db(x):
    return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12)


def render(ev, vo_wav, dur, out_wav, chords=None):
    """ev: {'scenes': [(start, end)], 'plucks': [t], 'bells': [t], 'clicks': [t], 'whooshes': [t], 'kicks': [t], 'thuds': [t], 'final': t}"""
    n = int(dur * SR)
    music = np.zeros(n + SR * 3); sfx = np.zeros(n + SR * 3)
    prog = chords or PROGRESSION
    for i, (s, e) in enumerate(ev['scenes']):
        notes = CHORDS[prog[i % len(prog)]]
        place(music, pad(notes, e - s + .5), s - .2)
        for j, t in enumerate(sorted(p for p in ev['plucks'] if s <= p < e)):
            place(sfx, pluck(notes[1 + (j % 4)] + 12, .55), t)
    for t in ev['bells']: place(sfx, bell(84, .7), t)
    for t in ev['clicks']: place(sfx, click(.8), t)
    for t in ev['whooshes']: place(sfx, whoosh(.5, .7), t - .35)
    for t in ev['kicks']: place(sfx, kick(1.0), t)
    for t in ev['thuds']: place(sfx, thud(.9), t)
    if ev.get('final') is not None:   # the resolve: a full C major chord with a bell on top, ringing into the fade
        place(music, pad(CHORDS['C'], dur - ev['final'] + 1.5) * 1.6, ev['final'])
        for j, m in enumerate([60, 64, 67, 72]): place(sfx, pluck(m + 12, .45), ev['final'] + j * .06)
        place(sfx, bell(96, .6), ev['final'] + .1)
        place(sfx, kick(.7), ev['final'])
    ir = rng.standard_normal(int(1.5 * SR)) * dec(int(1.5 * SR), .32); ir[:int(.015 * SR)] = 0; ir /= np.abs(ir).sum() ** .5 * 6
    bed = music + sfx
    bed = bed + fftconvolve(bed, ir)[:len(bed)] * .9   # light room
    bed = bed[:n]
    # the voice: mono 48 kHz from tts.py, set to about -15.6 dB RMS where it speaks
    with wave.open(vo_wav) as w:
        v = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(np.float64) / 32767
    vo = np.zeros(n); vo[:min(n, len(v))] = v[:n]
    win = int(.05 * SR)
    venv = np.sqrt(np.convolve(vo ** 2, np.ones(win) / win, 'same'))
    active = venv > .02 * venv.max()
    vo *= 10 ** ((-15.6 - rms_db(vo[active])) / 20)
    # duck: music sits at about -25 dB RMS while the voice plays, and rises about 5 dB in the gaps
    # slow duck: the music only rises in pauses longer than about half a second, so it does not pump between lines
    act = np.convolve(active.astype(float), np.ones(int(.6 * SR)) / int(.6 * SR), 'same')
    bed *= 10 ** ((-25 - rms_db(bed[active])) / 20) if active.any() else 1
    bed *= 1 + (10 ** (5 / 20) - 1) * (1 - np.clip(act, 0, 1))
    mix = vo + bed
    fade = int(.35 * SR); mix[-fade:] *= np.linspace(1, 0, fade)
    # a look-ahead peak limiter at -1.5 dBFS instead of saturation (tanh bent the voice's loudest syllables)
    thr = 10 ** (-1.5 / 20)
    need = np.minimum(1, thr / (np.abs(mix) + 1e-9))
    la = int(.004 * SR)
    from scipy.ndimage import minimum_filter1d
    g = minimum_filter1d(need, size=2 * la + 1)
    rel = np.exp(-1 / (.08 * SR)); out_g = np.empty_like(g); cur = 1.0
    for i in range(len(g)):
        cur = g[i] if g[i] < cur else cur * rel + g[i] * (1 - rel)
        out_g[i] = cur
    mix = mix * out_g
    st = (np.clip(np.stack([mix, mix]).T, -1, 1) * 32767).astype('<i2')
    with wave.open(out_wav, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes())
    return {'voice_rms_db': float(round(rms_db(vo[active]), 1)), 'music_rms_under_voice_db': float(round(rms_db(bed[active]), 1))}
