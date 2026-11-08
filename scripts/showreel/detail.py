# The element-detail bus (owner, 8 Nov 2026: "Where are the tick sounds? Have you only got whoosh and swish?").
# The small UI and texture sounds (tick, blip, snap, touch, tap, click, pop, rustle; techreel: plucks and clicks) were written into the
# cue lists at g 0.05-0.26, so after the -14 LUFS leveling they sat 25-35 dB under the voice and vanished, while whooshes stayed loud.
# This bus gives them their own level, set from the voice: each cue's peak sits 10-16 dB under the voice's speech peak (-13 dB, +-3 dB
# from the cue's own g against the reel's typical g, so a stagger that falls away still falls away), a gentle high-pass at 250 Hz and a
# short transient lift so they cut through, and NO voice duck (the bed still ducks). Pitch and stereo stay the cue's own.
# Cues closer than 60 ms merge into one (the louder g wins), so a dense stagger does not turn into noise.
# Gate (design/mandatory.md item 8): each cue's peak against the local voice level (the voice's speech peak within 1.5 s):
#   "SOUND DETAIL: n of m element cues audible (>= -18 dB vs voice); quietest -x dB": under 80% fails the render.
# Used by scripts/showreel/sound.py (every scene on every channel) and techreel/audio/synth.py.
import numpy as np

SR = 48000
KINDS = {'tick', 'blip', 'snap', 'touch', 'tap', 'click', 'pop', 'rustle'}
TARGET_DB, SPREAD_DB, MERGE_S, HPF_HZ = -13.0, 3.0, .06, 250.0
AUDIBLE_DB, PASS_PCT = -18.0, 80


def merge(cues, kinds=KINDS, key='k'):
    """Drops a detail cue that lands within 60 ms of the last kept one (any detail kind); the kept cue takes the larger g."""
    out, last = [], None
    for c in sorted(cues, key=lambda c: float(c['t'])):
        if c.get(key) in kinds:
            if last is not None and float(c['t']) - float(last['t']) < MERGE_S:
                last['g'] = max(last.get('g', 1), c.get('g', 1)); continue
            c = dict(c); last = c
        out.append(c)
    return out


def shape(s):
    """High-pass at 250 Hz (2nd order, magnitude) and a short transient lift (+6 dB at the onset, back to unity over ~6 ms)."""
    s = np.atleast_2d(np.asarray(s, float)); n = s.shape[1]; L = 1 << int(np.ceil(np.log2(n + 2048)))
    fr = np.fft.rfftfreq(L, 1 / SR); h = 1 / np.sqrt(1 + (HPF_HZ / np.maximum(fr, 1e-3)) ** 4)
    y = np.fft.irfft(np.fft.rfft(s, L) * h, L)[:, :n]
    m = np.abs(y).max(0); on = int(np.argmax(m > .1 * (m.max() + 1e-12)))
    tt = np.maximum(np.arange(n) - on, 0) / SR
    return y * (1 + np.exp(-tt / .006))


def speech_peaks(vox):
    """10 ms block peaks of the voice (mono), the blocks where it speaks, and its overall speech peak (95th percentile)."""
    v = np.abs(np.atleast_2d(vox)).max(0); blk = int(.01 * SR); nb = len(v) // blk
    pk = v[:nb * blk].reshape(nb, blk).max(1) if nb else np.zeros(0)
    act = pk > .08 * (pk.max() if len(pk) else 0) if len(pk) else np.zeros(0, bool)
    ref = float(np.percentile(pk[act], 95)) if act.any() else 0.0
    return pk, act, ref


def level(cues, ref, kinds=KINDS):
    """The peak each detail cue gets on the bus: TARGET_DB under the speech peak, +-SPREAD_DB from its g against the reel's median g."""
    gs = [float(c.get('g', 1)) for c in cues if c.get('k') in kinds]
    med = float(np.median(gs)) if gs else 1.0
    ref = ref or .9   # no voice in this mix: level against a full-scale voice
    def peak(g):
        rel = np.clip(20 * np.log10(max(float(g), 1e-6) / (med or 1)), -SPREAD_DB, SPREAD_DB)
        return ref * 10 ** ((TARGET_DB + rel) / 20)
    return peak


def gate(hits, vox):
    """hits: [(t, peak in the mix)]. Returns (line, ok). Local voice level = speech peak within 1.5 s of the cue (else the reel's)."""
    if not hits: return 'SOUND DETAIL: n/a (no element cues)', True
    pk, act, ref = speech_peaks(vox)
    if not act.any(): return f'SOUND DETAIL: {len(hits)} element cues, no voice in the mix (nothing to mask them)', True
    rel = []
    for t, p in hits:
        a, b = max(0, int((t - 1.5) * 100)), int((t + 1.5) * 100)
        w = pk[a:b][act[a:b]]; loc = float(np.percentile(w, 95)) if len(w) else ref
        rel.append(20 * np.log10(max(p, 1e-9) / loc))
    n, m = sum(r >= AUDIBLE_DB for r in rel), len(rel); pct = round(100 * n / m)
    ok = pct >= PASS_PCT
    line = (f'SOUND DETAIL: {n} of {m} element cues audible (>= {AUDIBLE_DB:.0f} dB vs voice); quietest {min(rel):.1f} dB, '
            f'median {float(np.median(rel)):.1f} dB ({pct}%): ' + ('ok' if ok else f'FAIL (under {PASS_PCT}%)'))
    return line, ok
