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
"""
import subprocess, sys, json
import numpy as np

W, H, FPS, C = 135, 240, 10, 15
GX, GY = W // C, H // C   # 9 x 16


def frames(path):
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', path, '-vf', f'fps={FPS},scale={W}:{H},format=gray', '-f', 'rawvideo', '-'],
                         stdout=subprocess.PIPE)
    n = W * H
    while True:
        b = p.stdout.read(n)
        if len(b) < n:
            break
        yield np.frombuffer(b, np.uint8).reshape(H, W).astype(np.int16)


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


def main():
    path, label = sys.argv[1], (sys.argv[2] if len(sys.argv) > 2 else sys.argv[1].split('/')[-1])
    top, bot = int(GY * 0.12), GY - int(GY * 0.25)
    prev, hist, med = None, [], []
    onsets, onsets_pic, moving, moving_pic = [], [], [], []
    cuts = cam = still = n = 0
    for f in frames(path):
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
    gaps, last = [], 0.0
    for i, v in enumerate(onsets_pic):
        if v:
            t = i / FPS
            if t - last > 1.0:
                gaps.append(f'{last:.1f}-{t:.1f}')
            last = t
    if dur - last > 1.0:
        gaps.append(f'{last:.1f}-{dur:.1f}')
    res = {'label': label, 'seconds': round(dur, 1), 'onsets_per_s': round(sum(onsets) / max(dur, 0.1), 2),
           'picture_onsets_per_s': round(sum(onsets_pic) / max(dur, 0.1), 2),
           'moving_at_once': round(float(np.mean(moving)), 2), 'picture_moving_at_once': round(float(np.mean(moving_pic)), 2),
           'peak_moving': int(max(moving) if moving else 0), 'cuts_per_min': round(cuts / max(dur, 0.1) * 60, 1),
           'camera_share': round(cam / max(n, 1), 2), 'still_share': round(still / max(n, 1), 2), 'gaps_over_1s': len(gaps)}
    print('ACTIONS ' + json.dumps(res))
    print(f'TIMELINE {label} picture onsets per second: ' + ' '.join(str(v) for v in secp) + '   (all: ' + ' '.join(str(v) for v in sec) + ')')
    print(f'GAPS {label} (no new action in the picture for over 1 s): ' + (', '.join(gaps) or 'none'))


if __name__ == '__main__':
    main()
