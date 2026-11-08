# Sound for seekable reels (owner, 23 Oct 2026: "audio and transition sounds are really important to support the hook").
# The reel study (scripts/study-reels.mjs) showed what holds people: sound from frame 0, a voice reading the hook, a quiet bed,
# and a hit or whoosh on every cut, all dense and loud (-14 LUFS). Here every sound is made in code from the scene's own cue list
# (window.CUES, written next to the MP4 by seek.mjs), so sound and picture share one timeline.
# Usage: python3 scripts/showreel/sound.py <cues.json> <out.wav> [narration.wav]
#   cues.json: { dur, bed: { bpm, origin, chords, soft?, lift? }, cues: [ { t, k, g?, p?, d?, text?, voice?, speed? } ] }
#   k: whoosh (d = length), swish (d; soft, for narrated reels), hit, boom, pop (p = pitch step), tap, thud, tick, click, shimmer, riser (d), voice (text; Kokoro, Apache-2.0, runs on the runner)
# Seeded noise only, so the same cues always give the same sound. The workflow levels the mix to -14 LUFS when it muxes.
# Sound follows the motion (sample 2, 6 Nov 2026). New cue kinds, each with its own seeded noise so the kinds above sound exactly as before:
#   move    (d, dir = 1 up / -1 down): air shaped to a transform's own length; starts ON the cue and swells with the move's speed (ease-in-out)
#   touch   a soft fingertip tap for micro-interactions (a tap ripple, a cursor press): rounded, low, with a tiny glint
#   snap    (p): a settle click with a short pitched body that overshoots and settles, like a spring landing
#   blip    (p): a soft tuned pluck for an element landing; give p from the bed's chord so pops sit in key
#   swell   (d): a soft riser that ENDS on the cue (into the fix): darker than riser, no hiss on top
#   resolve (notes = midi list): a low soft hit plus a bell chord that blooms on the fix
#   rustle  (d, p): paper: small crackles under soft air over d (page turns, folds, cut paper; 8 Nov 2026)
# New optional fields on any cue: x (screen x 0-540 px; with x2 it travels from x to x2 over the sound) places it in stereo,
#   r (0-1) sends it to a short room reverb (a tail on transitions). A cue without them sounds as before.
# Optional "mix" block: { duck: dB the bed drops under the voice (sidechain-style, attack/release in s), room: room length in s }.
#   Without "mix" the bed ducks the old way, so earlier reels render the same.
# The element-detail bus (8 Nov 2026, scripts/showreel/detail.py): tick, blip, snap, touch, tap, click, pop and rustle cues get their own
#   level against the voice (peaks 10-16 dB under its speech peak), a 250 Hz high-pass and a transient lift, no voice duck; cues closer
#   than 60 ms merge. Prints "SOUND DETAIL: n of m element cues audible ..." and fails under 80% (design/mandatory.md item 8).
import json, os, sys, wave
import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'voice'))
import say   # noqa: E402  the shared lexicon (scripts/voice/say.json): the hook voice says words the way the narration does
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import detail   # noqa: E402  the element-detail bus (8 Nov 2026): ticks, blips, snaps, touches heard, not buried under the voice
# SOUND_DETAIL=off renders the old routing (details on the effects bus at their cue gain) and still prints the gate line: a before/after check
LEGACY = os.environ.get('SOUND_DETAIL') == 'off'
# SAY_CONFIG=<reel config.json> (set by the Showreel workflow) adds the config's own "say" on top of the lexicon
SAY = json.load(open(os.environ['SAY_CONFIG'])).get('say') if os.environ.get('SAY_CONFIG') else None
SAY_USED = []

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


def tap(g=1, p=0):   # a quiet UI tap (owner, 24 Oct: the pops were "big funky"): a soft, low-passed click with a short body
    n = int(.06 * SR); tt = np.arange(n) / SR
    nz = np.convolve(rng.standard_normal(n), np.ones(9) / 9, 'same') * env_exp(n, .004)
    m = .6 * nz + .5 * np.sin(2 * np.pi * 820 * 2 ** (p / 12) * tt) * env_exp(n, .012)
    return pan(m * g * .35, 0)


def thud(g=1, p=0):   # a soft stop: a low, short body, no click
    n = int(.25 * SR); tt = np.arange(n) / SR
    m = np.sin(2 * np.pi * (70 * 2 ** (p / 12) + 40 * np.exp(-tt / .03)) * tt) * env_exp(n, .07) * np.clip(tt / .004, 0, 1)
    return pan(m * g * .6, 0)


def swish(d=.4, g=1, p=0):   # a gentle air move for a cut under a voice: low, wide, no whistle
    n = int(d * SR); k = np.linspace(0, 1, n); e = np.sin(np.pi * k) ** 2
    m = bandpass_sweep(rng.standard_normal(n), 250 * 2 ** p, 1400 * 2 ** p, .7) * e
    return pan(m / (np.abs(m).max() + 1e-9) * .35 * g, np.linspace(-.4, .4, n))


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


# ---- sample 2 (6 Nov 2026): sound that follows the motion. Own seeded noise per cue, so the global rng (older kinds) is untouched ----
def _rng(t, k):
    return np.random.default_rng(abs(int(round(t * 1000))) * 31 + sum(map(ord, k)))   # abs: a cue may sit a little before 0 s


def lowpass(x, fc):
    fr = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(np.fft.rfft(x) / np.sqrt(1 + (fr / fc) ** 4), len(x))


def move(d=.5, g=1, p=0, dir=1, r=None):
    # air whose loudness follows the speed of an ease-in-out move (sin^2), its filter sweeping the way the element travels
    r = r or np.random.default_rng(1); n = max(int(d * SR), 64); k = np.linspace(0, 1, n)
    e = np.sin(np.pi * k) ** 2 * np.clip(k / .05, 0, 1)
    lo, hi = 260 * 2 ** p, 2000 * 2 ** p
    m = bandpass_sweep(r.standard_normal(n), lo if dir >= 0 else hi, hi if dir >= 0 else lo, .9) * e
    m = m / (np.abs(m).max() + 1e-9)
    f = 90 * 2 ** p * 2 ** (dir * .5 * k); body = np.sin(2 * np.pi * np.cumsum(f) / SR) * e * .18   # a little weight under the air
    return (m * .42 + body) * g


def touch(g=1, p=0, r=None):
    r = r or np.random.default_rng(2); n = int(.09 * SR); tt = np.arange(n) / SR
    pad = lowpass(r.standard_normal(n) * env_exp(n, .006), 1400) * 3
    knock = np.sin(2 * np.pi * (300 * 2 ** (p / 12)) * tt) * env_exp(n, .02) * np.clip(tt / .002, 0, 1)
    glint = np.sin(2 * np.pi * 2600 * 2 ** (p / 12) * tt) * env_exp(n, .01) * .12
    return (pad * .5 + knock * .45 + glint) * g * .5


def snap(g=1, p=0, r=None):
    r = r or np.random.default_rng(3); n = int(.22 * SR); tt = np.arange(n) / SR
    f = 660 * 2 ** (p / 12) * (1 - .06 * np.exp(-tt / .03) * np.cos(2 * np.pi * 18 * tt))   # pitch overshoots, then settles
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(n, .05) * np.clip(tt / .0015, 0, 1)
    cl = lowpass(r.standard_normal(n) * env_exp(n, .0025), 5000)
    return (body * .55 + cl * .5) * g * .5


def blip(g=1, p=0, r=None):
    n = int(.14 * SR); tt = np.arange(n) / SR; f = 440 * 2 ** ((p + 12) / 12)
    m = (np.sin(2 * np.pi * f * tt) + .25 * np.sin(4 * np.pi * f * tt)) * env_exp(n, .05) * np.clip(tt / .003, 0, 1)
    return m * g * .4


def swell(d=1, g=1, p=0, r=None):
    r = r or np.random.default_rng(4); n = int(d * SR); k = np.linspace(0, 1, n); e = k ** 2.2 * np.clip((1 - k) / .03, 0, 1)
    m = bandpass_sweep(r.standard_normal(n), 300 * 2 ** p, 3500 * 2 ** p, 1.6); m = m / (np.abs(m).max() + 1e-9)
    f = 220 * 2 ** (p / 12) * 2 ** k; ph = 2 * np.pi * np.cumsum(f) / SR
    return (.55 * m + .3 * np.sin(ph) + .1 * np.sin(1.5 * ph)) * e * g


def resolve(g=1, p=0, notes=None, r=None):
    n = int(1.8 * SR); tt = np.arange(n) / SR; hz = lambda m: 440 * 2 ** ((m - 69 + p) / 12)
    low = np.sin(2 * np.pi * (55 * 2 ** (p / 12) + 60 * np.exp(-tt / .04)) * tt) * env_exp(n, .22) * np.clip(tt / .003, 0, 1)
    bell = np.zeros(n)
    for j, m in enumerate(notes or [57, 64, 69, 73]):
        a = np.clip((tt - .012 * j) / .015, 0, 1)
        bell += (np.sin(2 * np.pi * hz(m) * tt + j) + .2 * np.sin(2 * np.pi * hz(m) * 2.01 * tt)) * env_exp(n, .55 - .06 * j) * a
    return (low * .6 + bell / 4 * .55) * g


def rustle(d=.5, g=1, p=0, r=None):
    # paper (8 Nov 2026, Turns Out journeys: page turns and folds): dense small crackles under a soft band of air, swelling and fading over d
    r = r or np.random.default_rng(5); n = max(int(d * SR), 64); k = np.linspace(0, 1, n)
    cr = r.standard_normal(n) * (r.random(n) < .012) * 3; cr = lowpass(cr, 6000 * 2 ** p) - lowpass(cr, 900 * 2 ** p)
    air = lowpass(r.standard_normal(n), 2600 * 2 ** p) - lowpass(r.standard_normal(n), 500)
    m = (cr * .8 + air * .25) * np.sin(np.pi * k) ** 1.5
    return m / (np.abs(m).max() + 1e-9) * .5 * g


# Elegant air (owner, 8 Nov 2026: "the whooshes and swells are too much; tone them down for a more elegant tone"): every air kind
# (whoosh, swish, riser, move, swell) sits AIR_DB lower, loses its top end above AIR_LP and has a shorter tail, so the element details
# (ticks, blips, snaps on the detail bus, unchanged) lead and the air sits behind them. Every channel that renders through this file.
AIR = {'whoosh', 'swish', 'riser', 'move', 'swell'}; AIR_DB = -5.5; AIR_LP = 7000


def air(s, tail=True):
    s = np.atleast_2d(np.asarray(s, dtype=float)); n = s.shape[1]
    out = np.stack([lowpass(ch, AIR_LP) for ch in s]) * 10 ** (AIR_DB / 20)
    if tail:   # the last 40% falls away faster (about a third shorter audible tail); a riser or swell ends on its cue and keeps its end
        k = np.linspace(0, 1, n); out *= np.where(k < .6, 1, np.clip((1 - k) / .4, 0, 1) ** .9)
    return out


NEW_KINDS = {'rustle': rustle, 'move': move, 'touch': touch, 'snap': snap, 'blip': blip, 'swell': swell, 'resolve': resolve}


def place(s, x, x2=None):   # stereo from the element's place on screen (540 px wide); gentle, never hard left or right
    m = s.mean(0) * np.sqrt(2) if s.ndim == 2 else s
    a = (float(x) / 540 * 2 - 1) * .6
    b = a if x2 is None else (float(x2) / 540 * 2 - 1) * .6
    return pan(m, np.linspace(a, b, len(m)) if b != a else a)


def room(x, sec=.55):   # a short, bright room: early reflections and a quick tail
    r = np.random.default_rng(55); n = int(sec * SR)
    ir = r.standard_normal((2, n)) * env_exp(n, sec / 6); ir[:, :int(.006 * SR)] = 0
    ir = np.stack([lowpass(ir[0], 6000), lowpass(ir[1], 6000)])
    L = 1 << int(np.ceil(np.log2(x.shape[1] + n)))
    y = np.fft.irfft(np.fft.rfft(x, L) * np.fft.rfft(ir, L), L)[:, :x.shape[1]]
    return y / (np.abs(y).max() + 1e-9) * np.abs(x).max()


def sidechain(vox, n, depth_db=9, attack=.02, release=.3):
    # an envelope follower on the voice (10 ms blocks), fast attack, slow release; the bed drops depth_db while the voice talks
    blk = int(.01 * SR); nb = n // blk + 1; v = np.abs(vox).max(0)[:n]
    lev = np.array([v[i * blk:(i + 1) * blk].max() if i * blk < len(v) else 0 for i in range(nb)])
    lev = np.clip(lev / (np.percentile(lev[lev > 0], 90) + 1e-9 if (lev > 0).any() else 1), 0, 1)
    env = np.zeros(nb); a, rl = np.exp(-.01 / attack), np.exp(-.01 / release); y = 0
    for i in range(nb):
        y = a * y + (1 - a) * lev[i] if lev[i] > y else rl * y + (1 - rl) * lev[i]; env[i] = y
    g = 10 ** (-depth_db * np.clip(env * 1.6, 0, 1) / 20)
    return np.interp(np.arange(n), np.arange(nb) * blk, g)


def voice(text, speed=1.1, name='af_heart'):
    try:
        from kokoro import KPipeline
        pipe = KPipeline(lang_code='a', repo_id='hexgrad/Kokoro-82M')
        spoken, used = say.apply(text, SAY); SAY_USED.extend(x for x in used if x not in SAY_USED)
        a = np.concatenate([np.asarray(c[2], dtype=float).reshape(-1) for c in pipe(spoken, voice=name, speed=speed)])
    except Exception as e:   # no voice model on this machine: the reel keeps its sound effects and bed
        print('voice skipped:', e); return None
    a = np.interp(np.arange(0, len(a) * 2) / 2, np.arange(len(a)), a)   # 24 kHz -> 48 kHz
    on = np.argmax(np.abs(a) > .02 * np.abs(a).max()); a = a[max(0, on - 240):]   # start on the first syllable
    a = a / (np.abs(a).max() + 1e-9)
    a = np.tanh(1.8 * a) / np.tanh(1.8)   # a little density, like a broadcast voice
    print(f'voice: "{text}" {len(a) / SR:.2f} s')
    return pan(a * .95, 0)


def bed(dur, bpm, origin, chords, soft=False):
    # a quiet bed in time with the cuts: pad chord per bar, a soft sub on 1 and 3, closed hats on the offbeats.
    # soft (Turns Out, owner 31 Oct 2026: "smoother bed"): pad only, chords crossfade over a second, a held low note, no kick or hats
    n = int(dur * SR); out = np.zeros((2, n)); beat = 60 / bpm; bar = 4 * beat
    if soft: return soft_bed(n, bar, origin, chords)
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


def soft_bed(n, bar, origin, chords):
    tt = np.arange(n) / SR; hz = lambda m: 440 * 2 ** ((m - 69) / 12); pad = np.zeros(n)
    nb = int(np.ceil((tt[-1] - origin) / bar)) + 2
    for b in range(-1, nb):
        t0 = origin + b * bar; sel = (tt > t0 - 1.2) & (tt < t0 + bar + 1.2)
        if not sel.any(): continue
        k = tt[sel] - t0; e = np.clip((k + 1.0) / 2.0, 0, 1) * np.clip((bar + 1.0 - k) / 2.0, 0, 1); e = e * e * (3 - 2 * e)   # smooth 2 s crossfades
        notes = chords[b % len(chords)]
        for j, m in enumerate(notes[1:]):
            for det in (-.002, .002):
                for h in (1, 2):
                    pad[sel] += np.sin(2 * np.pi * hz(m) * (1 + det) * h * tt[sel] + j * 1.3 + h) / h ** 2.2 * e * .07
        pad[sel] += np.sin(2 * np.pi * hz(notes[0]) * tt[sel]) * e * .13
    trem = 1 + .06 * np.sin(2 * np.pi * .18 * tt)   # a slow breath in the pad
    y = pad * trem; fr = np.fft.rfftfreq(n, 1 / SR)   # a gentle low-pass in the frequency domain: warm, no fizz on phone speakers
    z = np.fft.irfft(np.fft.rfft(y) / np.sqrt(1 + (fr / 2200) ** 4), n)
    return pan(z, 0) * .95


def reverb(x, sec=1.4, mix=.18):
    n = int(sec * SR); ir = rng.standard_normal((2, n)) * env_exp(n, sec / 5); ir[:, :int(.012 * SR)] = 0
    L = 1 << int(np.ceil(np.log2(x.shape[1] + n)))
    y = np.fft.irfft(np.fft.rfft(x, L) * np.fft.rfft(ir, L), L)[:, :x.shape[1]]
    return x + mix * y / (np.abs(y).max() + 1e-9) * np.abs(x).max()


def main(cues_path, out_path, narration=None):
    C = json.load(open(cues_path)); dur = float(C['dur']); n = int(dur * SR)
    if SAY:   # a config "say" entry that matches no word of the narration or the hook voice stops the run, as in voice.py and techreel
        v = json.load(open(os.environ['SAY_CONFIG'])).get('voice')
        texts = [c['text'] for c in C['cues'] if c['k'] == 'voice'] + ([v['text']] if isinstance(v, dict) and v.get('text') else [])
        used = [u for t in texts for u in say.apply(t, SAY)[1]]
        bad = say.unused(SAY, used)
        if bad: sys.exit(f'"say" entries match no spoken word: {", ".join(bad)}')
    sfx = np.zeros((2, n + SR * 2)); vox = np.zeros((2, n + SR * 4)); wet = np.zeros((2, n + SR * 2)); det = np.zeros((2, n + SR * 2))
    def put(buf, s, t):
        i = int(round(t * SR)); a = max(0, i); s = s[:, a - i:]; buf[:, a:a + s.shape[1]] += s[:, :buf.shape[1] - a]
    # the voice first (hook voice cues + the narration), so the detail bus can be levelled against it
    for c in C['cues']:
        if c['k'] != 'voice' or float(c['t']) >= dur: continue
        v = voice(c['text'], c.get('speed', 1.1), c.get('voice', 'af_heart'))
        if v is not None: put(vox, v * c.get('g', 1), float(c['t']))
    if narration:   # the whole-reel voice from voice.py, from frame 0; the bed ducks under it
        with wave.open(narration) as w: v = np.frombuffer(w.readframes(w.getnframes()), '<i2').reshape(-1, w.getnchannels()).T / 32767
        put(vox, v[:2] if v.shape[0] > 1 else np.vstack([v, v]), 0)
    cues = C['cues'] if LEGACY else detail.merge(C['cues'])
    dpeak = detail.level(cues, detail.speech_peaks(vox[:, :n])[2]); hits = []
    def _detail(s, k, g, t):   # a detail cue: shaped and set to its level on its own bus (the old routing: as is, on the effects bus at .75)
        if k not in detail.KINDS: return s
        if LEGACY: hits.append((t, .75 * float(np.abs(s).max()))); return s
        s = detail.shape(s); s = s / (np.abs(s).max() + 1e-9) * dpeak(g); hits.append((t, dpeak(g))); return s
    for c in cues:
        k, t, g, p = c['k'], float(c['t']), c.get('g', 1), c.get('p', 0)
        if t >= dur or k == 'voice': continue
        bus = sfx if LEGACY or k not in detail.KINDS else det
        if k in NEW_KINDS:   # sample 2 kinds: own seeded noise, stereo from x, room send r
            kw = {'r': _rng(t, k)}
            if k in ('move', 'swell', 'rustle'): kw['d'] = c.get('d', 1 if k == 'swell' else .5)
            if k == 'move': kw['dir'] = c.get('dir', 1)
            if k == 'resolve' and c.get('notes'): kw['notes'] = c['notes']
            s = NEW_KINDS[k](g=g, p=p, **kw)
            if k == 'swell': t -= kw['d']   # ends on the cue
            s = place(s, c.get('x', 270), c.get('x2'))
            if k in AIR: s = air(s, k != 'swell')
            s = _detail(s, k, g, t)
            put(bus, s, t)
            if c.get('r'): put(wet, s * float(c['r']), t)
            continue
        if k == 'whoosh': s = whoosh(c.get('d', .6), g, p); t -= .68 * c.get('d', .6)   # peak lands on the cue
        elif k == 'swish': s = swish(c.get('d', .4), g, p); t -= .5 * c.get('d', .4)
        elif k == 'riser': s = riser(c.get('d', 1), g, p); t -= c.get('d', 1)   # ends on the cue
        elif k == 'boom': s = hit(g, p, True)
        else: s = {'hit': hit, 'pop': pop, 'tick': tick, 'click': click, 'shimmer': shimmer, 'tap': tap, 'thud': thud}[k](g, p)
        if c.get('x') is not None: s = place(s, c['x'], c.get('x2'))
        if k in AIR: s = air(s, k != 'riser')
        s = _detail(s, k, g, t)
        put(bus, s, t)
        if c.get('r'): put(wet, s * float(c['r']), t)
    sfx, vox, det = sfx[:, :n], vox[:, :n], det[:, :n]
    line, ok = detail.gate(hits, vox)
    print(line)
    B = C.get('bed')
    b = bed(dur, B['bpm'], B['origin'], B['chords'], B.get('soft', False)) if B else np.zeros((2, n))
    if B and B.get('lift') is not None:   # the bed lifts into the payoff (Turns Out quality bar, point 7): +5 dB over 1.5 s from 'lift'
        k = np.clip((np.arange(n) / SR - float(B['lift'])) / 1.5, 0, 1); b = b * (1 + .78 * k * k * (3 - 2 * k))
    M = C.get('mix')
    if M:   # sample 2: sidechain-style ducking (attack / release) instead of the smoothed level below
        duck = sidechain(vox, n, M.get('duck', 9), M.get('attack', .02), M.get('release', .3))
    else:
        duck = np.convolve(np.abs(vox[0]), np.ones(2400) / 2400, 'same'); duck = 1 - .55 * np.clip(duck / (duck.max() + 1e-9) * 3, 0, 1)
    mix = B.get('gain', .5) * b * duck + .75 * reverb(sfx) + 1.0 * vox if B else .75 * reverb(sfx) + 1.0 * vox
    mix = mix + det   # the detail bus: its own level against the voice, no voice duck
    wet = wet[:, :n]
    if np.abs(wet).max() > 0: mix = mix + .45 * room(wet, (M or {}).get('room', .55))   # the room tail on transitions (cues with r)
    mix = np.tanh(1.3 * mix) * .8
    fade = int(.004 * SR); mix[:, :fade] *= np.linspace(0, 1, fade); mix[:, -fade:] *= np.linspace(1, 0, fade)
    pcm = (np.clip(mix, -1, 1) * 32767).astype('<i2').T.copy()
    with wave.open(out_path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    print(f'wrote {out_path}: {dur:.2f} s, {len(cues)} cues' + (', bed' if B else ''))
    if not ok and not LEGACY: sys.exit('::error::' + line)


if __name__ == '__main__':
    main(*sys.argv[1:4])
