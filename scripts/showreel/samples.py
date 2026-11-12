# Recorded sound effects (owner, 12 Nov 2026: "sound elements feel cheap, as if from kids' toys"). Every element and transition sound used
# to be synthesized from sine waves and noise. Now each cue kind plays a REAL RECORDED sample from Kenney's CC0 (public domain) packs
# (kenney.nl: Interface Sounds, Impact Sounds, RPG Audio, UI Audio; fetched on the runner by scripts/sound/fetch-samples.sh into
# $SFX_SAMPLES, licence and source in design/references.md). 2-4 samples per kind, picked by a seed from the cue's time, with a small
# seeded pitch (+-1 semitone) and level (+-1.5 dB) change so repeats never sound identical. The synthesized sound is still computed: its
# peak level, stereo balance and timing (where its peak sits) are kept, so the tuned mix, the detail bus and SOUND DETAIL are unchanged;
# only the sound itself is replaced. Without samples (download failed) the synthesized sound plays and the run prints it.
# Musical parts stay synthesized on purpose (bed, pad, riser, swell, shimmer, resolve chord, techreel plucks): they are the music, not effects.
import os, fnmatch, wave
import numpy as np

SR = 48000
DIR = os.environ.get('SFX_SAMPLES', '')
# kind -> file patterns (<pack>/<name>.wav), most fitting first; the first 4 matches are the kind's set
MAP = {
    'tick':   ['interface-sounds/tick_*', 'ui-audio/click*', 'interface-sounds/click_*'],
    'click':  ['interface-sounds/click_*', 'ui-audio/click*', 'ui-audio/mouseclick*'],
    'tap':    ['ui-audio/mouseclick*', 'ui-audio/mouserelease*', 'impact-sounds/impactwood_light_*'],
    'touch':  ['ui-audio/mouserelease*', 'ui-audio/mouseclick*', 'impact-sounds/impactwood_light_*'],
    'snap':   ['ui-audio/switch*', 'interface-sounds/switch_*', 'impact-sounds/impactmetal_light_*'],
    'blip':   ['impact-sounds/impactwood_light_*', 'impact-sounds/impactplate_light_*', 'interface-sounds/tick_*'],
    'pop':    ['impact-sounds/impactwood_light_*', 'impact-sounds/impactgeneric_light_*', 'impact-sounds/impactplank_medium_*'],
    'thud':   ['impact-sounds/impactsoft_medium_*', 'impact-sounds/impactsoft_heavy_*', 'impact-sounds/impactplank_medium_*'],
    'low':    ['impact-sounds/impactsoft_heavy_*', 'impact-sounds/impactsoft_medium_*', 'impact-sounds/impactplank_medium_*'],
    'hit':    ['impact-sounds/impactsoft_heavy_*', 'impact-sounds/impactwood_heavy_*', 'impact-sounds/impactplank_medium_*'],
    'boom':   ['impact-sounds/impactsoft_heavy_*', 'impact-sounds/impactwood_heavy_*'],
    'kick':   ['impact-sounds/impactsoft_heavy_*', 'impact-sounds/impactsoft_medium_*'],
    'bell':   ['impact-sounds/impactglass_light_*', 'impact-sounds/impactbell_heavy_*'],
    'rustle': ['rpg-audio/bookflip*', 'rpg-audio/bookopen*', 'rpg-audio/bookplace*', 'rpg-audio/cloth*'],
    'whoosh': ['rpg-audio/cloth*', 'rpg-audio/clothbelt*'],
    'swish':  ['rpg-audio/cloth*', 'rpg-audio/clothbelt*'],
    'move':   ['rpg-audio/cloth*', 'rpg-audio/clothbelt*'],
}
SHIFT = {'boom': -5, 'low': -2, 'kick': -3}   # semitones, so the deep kinds stay deep
_files, _cache, USED, WHY = None, {}, {}, ''


def _index():
    global _files, WHY
    if _files is not None: return _files
    _files = {}
    if not DIR or not os.path.isdir(DIR): WHY = 'SFX_SAMPLES not set' if not DIR else f'{DIR} missing'; return _files
    allw = sorted(f'{p}/{n}' for p in os.listdir(DIR) if os.path.isdir(os.path.join(DIR, p)) for n in os.listdir(os.path.join(DIR, p)) if n.endswith('.wav'))
    for k, pats in MAP.items():
        got = []
        for pat in pats:
            got += [f for f in allw if fnmatch.fnmatch(f, pat + '.wav') and f not in got]
        if got: _files[k] = got[:4]
    if not _files: WHY = f'no matching samples in {DIR}'
    return _files


def _load(f):
    if f not in _cache:
        with wave.open(os.path.join(DIR, f)) as w:
            a = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(float) / 32767
            if w.getnchannels() > 1: a = a.reshape(-1, w.getnchannels()).mean(1)
        e = np.abs(a); thr = .02 * (e.max() + 1e-9)
        on = int(np.argmax(e > thr)); off = len(a) - int(np.argmax(e[::-1] > thr * .1))
        a = a[max(0, on - 48):max(off, on + 480)]
        f8 = min(len(a), int(.008 * SR)); a[-f8:] *= np.linspace(1, 0, f8)
        _cache[f] = a / (np.abs(a).max() + 1e-9)
    return _cache[f]


def has(kind):
    return kind in _index()


def swap(kind, s, t=0.0, p=0):
    """The recorded version of a synthesized sound s (mono or (2, n)): same peak level per channel, its peak at the same place."""
    fl = _index().get(kind)
    if not fl: return s
    r = np.random.default_rng(abs(int(round(t * 1000))) * 7919 + sum(map(ord, kind)))
    a = _load(fl[int(r.integers(len(fl)))])
    semis = SHIFT.get(kind, 0) + r.uniform(-1, 1) + float(np.clip(p, -12, 12)) * .1
    rate = 2 ** (semis / 12)
    a = np.interp(np.arange(0, len(a) - 1, rate), np.arange(len(a)), a) * 10 ** (r.uniform(-1.5, 1.5) / 20)
    s = np.asarray(s, float); two = s.ndim == 2; ch = s if two else s[None]
    env = np.abs(ch).max(0); sp = int(np.argmax(env)); ap = int(np.argmax(np.abs(a)))
    off = max(0, sp - ap); n = max(ch.shape[1], off + len(a)) if kind not in ('whoosh', 'swish', 'move') else ch.shape[1]
    m = np.zeros(n); seg = a[:n - off]; m[off:off + len(seg)] = seg
    if kind in ('whoosh', 'swish', 'move'):   # air: the recorded cloth swish shaped to the move's own length and envelope
        e = np.convolve(env, np.ones(960) / 960, 'same'); e = e / (e.max() + 1e-9)
        if len(seg) < n * .6:   # a short swish is stretched (slowed) to cover the move, then shaped
            st = np.interp(np.linspace(0, len(a) - 1, n), np.arange(len(a)), a); m = st
        m = m * (.35 + .65 * e)
    pk = np.abs(ch).max(1)
    out = np.stack([m / (np.abs(m).max() + 1e-9) * pk[i] for i in range(ch.shape[0])])
    USED[kind] = USED.get(kind, 0) + 1
    return out if two else out[0]


def report():
    """One line for the run log: which source played."""
    fl = _index()
    if not USED:
        line = f'SOUND SOURCE: synthesized (fallback: {WHY or "no cue used a recorded kind"})'
    else:
        packs = sorted({f.split('/')[0] for k in USED for f in fl[k]})
        miss = sorted(k for k in MAP if k not in fl)
        line = (f'SOUND SOURCE: recorded CC0 samples (Kenney: {", ".join(packs)}): ' + ', '.join(f'{k} {USED[k]}x' for k in sorted(USED))
                + (f'; no sample for {", ".join(miss)} (synthesized)' if miss else ''))
    print(line)
    return line
