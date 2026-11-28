#!/usr/bin/env python3
"""Action count (owner, 28 Nov 2026: "more actions and elements"): how many separate things start moving each second in a video.

Used on references and on our own reels the same way, so "more actions" becomes a number to hit
(.claude/skills/reverse-any-video/SKILL.md "Action count").

  python3 scripts/qa/action-count.py <video> [label]

Method (10 fps, 135x240 grey, a 9x16 grid of 15 px cells):
- a cell is active when over 15 % of its pixels changed by more than 12 levels since the last frame;
- a hard cut (mean change over 40 and over 4x the running median) is counted and skipped;
- a camera move = over 45 % of the cells active: counted as camera time, not as actions;
- otherwise active cells are grouped into regions (4-neighbour); a region is an ACTION ONSET when none of its cells
  was active in the 3 frames before (0.3 s). Moving regions per frame = how many things move at once.
"Picture" excludes the top 12 % and the bottom 25 % (headline and caption bands), so captions alone do not inflate it.
Prints one ACTIONS line, one TIMELINE line (onsets per second) and one GAPS line (stretches over 1.0 s with no onset).

SOUND HITS (owner yes 28 Nov 2026): the same run also counts audible sound hits a second in the audio track: ffmpeg decodes 16 kHz mono,
a 1024-sample FFT every 16 ms, spectral flux (positive change of the log spectrum), peaks over a floor (median + 4 x MAD of the flux and
at least 0.5) where the level also rises (3 dB), at least 80 ms apart, and only where the frame is audible (above -50 dBFS). Prints one SOUND line (hits a second, per-second
list, longest silent stretch = longest run with no hit AND no audible level) and one QUIET line. Voice syllables count as hits too: read it
beside the TIMELINE; the number is a guide, as with actions.
"""
import subprocess, sys, json
import numpy as np

W, H, FPS, C = 135, 240, 10, 15
GX, GY = W // C, H // C   # 9 x 16


def frames(path, crop=None, w=W, h=H, fps=FPS, dtype=np.int16):
    """Grey frames at fps, scaled to w x h; crop = (x, y, w, h) in source pixels (the reel area found by scripts/qa/ref-lab.py)."""
    vf = (f'crop={crop[2]}:{crop[3]}:{crop[0]}:{crop[1]},' if crop else '') + f'fps={fps},scale={w}:{h},format=gray'
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', path, '-vf', vf, '-f', 'rawvideo', '-'], stdout=subprocess.PIPE)
    n = w * h
    while True:
        b = p.stdout.read(n)
        if len(b) < n:
            break
        yield np.frombuffer(b, np.uint8).reshape(h, w).astype(dtype)


def sound_hits(path):
    """Audio onsets: dict(hits=[seconds], mag=FFT magnitudes, db=level per frame, audible, step, dur), or None without audio."""
    p = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-vn', '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], capture_output=True)
    x = np.frombuffer(p.stdout, np.float32)
    if len(x) < 4096:
        return None
    N, hop = 1024, 256
    win = np.hanning(N).astype(np.float32)
    nf = 1 + (len(x) - N) // hop
    idx = np.arange(N)[None, :] + hop * np.arange(nf)[:, None]
    fr = x[idx] * win
    mag = np.abs(np.fft.rfft(fr, axis=1))
    logm = np.log1p(mag * 30)
    flux = np.maximum(logm[1:] - logm[:-1], 0).sum(axis=1)
    flux = np.concatenate([[0], flux])
    rms = np.sqrt((x[idx] ** 2).mean(axis=1) + 1e-12)
    db = 20 * np.log10(rms)
    audible = db > -50
    med = float(np.median(flux)); mad = float(np.median(np.abs(flux - med)))
    thr = max(med + 4 * mad, 0.5)
    step = hop / 16000.0
    hits, last, hit_idx = [], -1.0, []
    for i in range(1, len(flux) - 1):
        if flux[i] > thr and flux[i] >= flux[i - 1] and flux[i] > flux[i + 1] and audible[i] and db[min(i + 2, len(db) - 1)] - db[max(i - 4, 0)] > 3 and i * step - last >= 0.08:
            hits.append(i * step); hit_idx.append(i); last = i * step
    return {'hits': hits, 'hit_idx': hit_idx, 'mag': mag, 'db': db, 'audible': audible, 'step': step, 'dur': len(x) / 16000.0}


def quiet_stretch(sd):
    """Longest run with no hit and no audible level: (seconds, from, to)."""
    audible, step, dur = sd['audible'], sd['step'], sd['dur']
    marks = sorted(sd['hits'] + [i * step for i in range(len(audible)) if audible[i] and i % 4 == 0])   # a hit or any audible level breaks silence
    quiet, prev = [], 0.0
    for m in marks + [dur]:
        quiet.append((m - prev, prev, m)); prev = m
    return max(quiet)


def sound(path, label):
    sd = sound_hits(path)
    if sd is None:
        print(f'SOUND {label}: no audio track'); return
    hits, dur = sd['hits'], sd['dur']
    per = [sum(1 for h in hits if s0 <= h < s0 + 1) for s0 in range(int(np.ceil(dur)))]
    q = quiet_stretch(sd)
    print(f'SOUND {label} HITS a second {len(hits) / max(dur, .1):.2f} ({len(hits)} hits in {dur:.1f} s, audible {sd["audible"].mean() * 100:.0f} % of the time): ' + ' '.join(map(str, per)))
    print(f'QUIET {label} longest silent stretch {q[0]:.1f} s ({q[1]:.1f}-{q[2]:.1f} s)')


def regions(mask):
    seen = np.zeros_like(mask, bool); out = []
    for y in range(GY):
        for x in range(GX):
            if mask[y, x] and not seen[y, x]:
                st, cells = [(y, x)], []; seen[y, x] = True
                while st:
                    cy, cx = st.pop(); cells.append((cy, cx))
                    for ny, nx in ((cy - 1, cx), (cy + 1, cx), (cy, cx - 1), (cy, cx + 1)):
                        if 0 <= ny < GY and 0 <= nx < GX and mask[ny, nx] and not seen[ny, nx]:
                            seen[ny, nx] = True; st.append((ny, nx))
                out.append(cells)
    return out


def count(path, label, crop=None):
    """The picture measure; returns (result dict, onsets_pic per frame at 10 fps, timeline lines)."""
    top, bot = int(GY * 0.12), GY - int(GY * 0.25)
    prev, hist, med = None, [], []
    onsets, onsets_pic, moving, moving_pic = [], [], [], []
    cuts = cam = still = n = 0
    for f in frames(path, crop):
        n += 1
        if prev is None:
            prev = f; hist.append(np.zeros((GY, GX), bool)); onsets.append(0); onsets_pic.append(0); moving.append(0); moving_pic.append(0); continue
        d = np.abs(f - prev); prev = f; m = float(d.mean())
        base = float(np.median(med[-30:])) if med else m
        med.append(m)
        cell = (d[:GY * C, :GX * C] > 12).reshape(GY, C, GX, C).mean(axis=(1, 3)) > 0.15
        o = op = 0; mv = mp = 0
        if m > 40 and m > 4 * max(base, 1):
            cuts += 1; cell = np.zeros_like(cell)
        elif cell.mean() > 0.45:
            cam += 1
        else:
            if cell.mean() < 0.01:
                still += 1
            recent = np.any(np.stack(hist[-3:]), axis=0) if hist else np.zeros_like(cell)
            for r in regions(cell):
                pic = any(top <= y < bot for y, _ in r)
                mv += 1; mp += pic
                if not any(recent[y, x] for y, x in r):
                    o += 1; op += pic
        hist.append(cell); onsets.append(o); onsets_pic.append(op); moving.append(mv); moving_pic.append(mp)
    dur = n / FPS
    sec = [sum(onsets[i:i + FPS]) for i in range(0, n, FPS)]
    secp = [sum(onsets_pic[i:i + FPS]) for i in range(0, n, FPS)]
    gaps, last, longest = [], 0.0, 0.0
    for i, v in enumerate(onsets_pic):
        if v:
            t = i / FPS
            longest = max(longest, t - last)
            if t - last > 1.0:
                gaps.append(f'{last:.1f}-{t:.1f}')
            last = t
    longest = max(longest, dur - last)
    if dur - last > 1.0:
        gaps.append(f'{last:.1f}-{dur:.1f}')
    res = {'label': label, 'seconds': round(dur, 1), 'onsets_per_s': round(sum(onsets) / max(dur, 0.1), 2),
           'picture_onsets_per_s': round(sum(onsets_pic) / max(dur, 0.1), 2),
           'moving_at_once': round(float(np.mean(moving)), 2), 'picture_moving_at_once': round(float(np.mean(moving_pic)), 2),
           'peak_moving': int(max(moving) if moving else 0), 'cuts_per_min': round(cuts / max(dur, 0.1) * 60, 1),
           'camera_share': round(cam / max(n, 1), 2), 'still_share': round(still / max(n, 1), 2), 'gaps_over_1s': len(gaps),
           'longest_gap_s': round(longest, 1)}
    lines = [f'TIMELINE {label} picture onsets per second: ' + ' '.join(str(v) for v in secp) + '   (all: ' + ' '.join(str(v) for v in sec) + ')',
             f'GAPS {label} (no new action in the picture for over 1 s): ' + (', '.join(gaps) or 'none')]
    return res, onsets_pic, lines


def main():
    path, label = sys.argv[1], (sys.argv[2] if len(sys.argv) > 2 else sys.argv[1].split('/')[-1])
    res, _, lines = count(path, label)
    print('ACTIONS ' + json.dumps(res))
    for l in lines:
        print(l)
    sound(path, label)


if __name__ == '__main__':
    main()
