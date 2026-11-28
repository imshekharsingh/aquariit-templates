#!/usr/bin/env python3
"""Reference lab (owner yes 28 Nov 2026): tools that do the SEEING, so a study reads 5 measured moments instead of 100 tiny frames.

  python3 scripts/qa/ref-lab.py [--no-strips] <label>=<video> [<label>=<video> ...]

Python with ffmpeg + numpy only. Run by the "Owner answers" workflow, action refs-study, ASKS {"lab": true} (scripts/asks.mjs).
Per video it prints text lines; the key-moment strips go to stderr as "B64 <file> <base64>" log lines (scripts/media/from-log.mjs turns them back into files).
Labels that start with "ref-" are references; anything else is one of OUR reels (the scorecard compares them).

1. CROP        the reel area inside a phone screen recording: pixels that change over time are the reel, the rest (black bars, the status
               and top bar, a static bottom area) is stripped. Prints "CROP x,y,w,h" in source pixels. Every later measure uses it.
2. MOVES       main moving elements at 30 fps: changed regions tracked frame to frame; per move start, duration, travel (% of the frame),
               ease (linear / ease-out / ease-in / ease-in-out / overshoot + settle, from the speed profile) and overshoot %.
3. HITS        scripts/qa/action-count.py's sound onsets, each with its band (low < 250 Hz thud, mid 250-2k click, high > 2k tick),
               length (ms until 15 dB below its peak) and loudness against the median level (the voice or bed).
4. KEY         the 5 busiest 1-second windows (picture actions + sound hits): one strip of 6 frames over that second (cropped, 360 px each,
               time stamped) and TEXT LIFE: the largest text block in it, how it arrives (fade / scale / slide / word by word / pop) and its
               line height in px at 1080 wide.
5. SCORECARD   one table row per video with all numbers side by side, and GAP lines: the 3 largest gaps of our reels against the references.
All of it is measured from pixels and audio, with simple rules (listed in the code); the strips are there to confirm by eye.
"""
import base64, importlib.util, itertools, json, math, os, subprocess, sys, tempfile
import numpy as np

_spec = importlib.util.spec_from_file_location('ac', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'action-count.py'))
ac = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(ac)

TW, TH, TC = 180, 320, 6          # motion frames: 180 x 320 grey, 6 px cells (30 x 53 grid)
KEYS = 5


# ---------------------------------------------------------------- helpers
def probe(path):
    out = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height:stream_side_data=rotation:format=duration',
                          '-of', 'json', path], capture_output=True, text=True).stdout
    j = json.loads(out); st = j['streams'][0]; w, h = int(st['width']), int(st['height'])
    rot = 0
    for sd in st.get('side_data_list', []) or []:
        rot = abs(int(float(sd.get('rotation', 0)))) % 180 or rot
    if rot == 90:
        w, h = h, w
    return w, h, float(j['format']['duration'])


def dil(m, ry, rx):
    o = m.copy()
    for dy in range(-ry, ry + 1):
        for dx in range(-rx, rx + 1):
            if dy or dx:
                s = np.zeros_like(m)
                ys, yd = (slice(dy, None), slice(0, -dy)) if dy > 0 else ((slice(0, dy), slice(-dy, None)) if dy < 0 else (slice(None), slice(None)))
                xs, xd = (slice(dx, None), slice(0, -dx)) if dx > 0 else ((slice(0, dx), slice(-dx, None)) if dx < 0 else (slice(None), slice(None)))
                s[ys, xs] = m[yd, xd]; o |= s
    return o


def comps(mask):
    """4-neighbour connected components of a boolean grid, as lists of (y, x); only active cells are visited."""
    H, W = mask.shape; seen = np.zeros_like(mask, bool); out = []
    for y, x in np.argwhere(mask):
        if seen[y, x]:
            continue
        st, cells = [(y, x)], []; seen[y, x] = True
        while st:
            cy, cx = st.pop(); cells.append((cy, cx))
            for ny, nx in ((cy - 1, cx), (cy + 1, cx), (cy, cx - 1), (cy, cx + 1)):
                if 0 <= ny < H and 0 <= nx < W and mask[ny, nx] and not seen[ny, nx]:
                    seen[ny, nx] = True; st.append((ny, nx))
        out.append(cells)
    return out


def med(v, default=0.0):
    return float(np.median(v)) if len(v) else default


# ---------------------------------------------------------------- 1. crop
def phone_trim(crop, pw, ph):
    """A screen recording of a phone (taller than 2:1) carries the app's own overlay on top of the reel: status bar and header on top (13 %),
    caption and account row at the bottom (14 %) and the button column on the right (14 %). Those overlays sit over changing pictures, so the
    'what changes' rule cannot see them (28 Nov run: refs 15, 16, 19 kept them); this cuts them from whatever the change rule found."""
    if ph / pw <= 2.0:
        return crop
    x, y, w, h = crop
    y0, y1, x1 = max(y, int(round(ph * 0.13 / 2) * 2)), min(y + h, int(round(ph * 0.86 / 2) * 2)), min(x + w, int(round(pw * 0.86 / 2) * 2))
    return (x, y0, x1 - x, y1 - y0)


def find_crop(path, pw, ph):
    """The reel area (x, y, w, h in source pixels) and a note. A pixel is 'reel' when it changes over time (temporal std over 4 fps)."""
    full = (0, 0, pw, ph)
    sw = 180; sh = max(2, int(round(ph * sw / pw / 2)) * 2)
    fs = list(itertools.islice(ac.frames(path, None, sw, sh, 4, np.uint8), 240))
    if len(fs) < 8:
        return full, 'too short to find a crop: full frame'
    F = np.stack(fs).astype(np.float32); sd = F.std(axis=0)
    hi = float(np.percentile(sd, 90))
    if hi < 1.5:
        return full, 'nothing moves: full frame'
    act = sd > 0.2 * hi

    def span(prof):
        ok = np.where(prof >= 0.5 * np.percentile(prof, 75))[0]
        return (int(ok[0]), int(ok[-1]) + 1) if len(ok) else (0, len(prof))
    y0, y1 = span(act.mean(axis=1)); x0, x1 = span(act[y0:y1].mean(axis=0)); y0, y1 = span(act[:, x0:x1].mean(axis=1))
    if (x1 - x0) * (y1 - y0) < 0.35 * sw * sh:
        return full, 'changing area under 35 % of the frame: full frame'
    kx, ky = pw / sw, ph / sh
    x, y, w, h = int(round(x0 * kx / 2) * 2), int(round(y0 * ky / 2) * 2), int(round((x1 - x0) * kx / 2) * 2), int(round((y1 - y0) * ky / 2) * 2)
    w, h = min(w, pw - x), min(h, ph - y)
    if w >= 0.98 * pw and h >= 0.98 * ph:
        return full, 'no static border found: full frame'
    return (x, y, w, h), f'stripped {x} px left, {pw - x - w} right, {y} top, {ph - y - h} bottom of {pw}x{ph}'


# ---------------------------------------------------------------- 2. motion tracks
def motion(path, crop):
    gh, gw = TH // TC, TW // TC
    prev, tracks, closed, fno = None, [], [], -1
    for f in ac.frames(path, crop, TW, TH, 30, np.uint8):
        fno += 1; cur = f.astype(np.int16)
        if prev is None:
            prev = cur; continue
        d = np.abs(cur - prev) > 12; prev = cur
        cnt = d[:gh * TC, :gw * TC].reshape(gh, TC, gw, TC).sum(axis=(1, 3))
        cm = cnt >= 0.1 * TC * TC
        if cm.mean() > 0.45:           # a cut or a camera move: no element tracks across it
            closed += tracks; tracks = []; continue
        regs = []
        for cells in comps(dil(cm, 1, 1)):
            ys = np.array([c[0] for c in cells]); xs = np.array([c[1] for c in cells])
            if cm[ys, xs].sum() < 2:
                continue
            w = cnt[ys, xs].astype(float) + 1e-6
            regs.append((len(cells), float(((xs + 0.5) @ w) / w.sum() * TC / TW), float(((ys + 0.5) @ w) / w.sum() * TC / TH)))
        used = set()
        for n, cx, cy in sorted(regs, reverse=True):
            best, bd = None, 0.22
            for i, t in enumerate(tracks):
                if i in used or t[-1][0] < fno - 3:
                    continue
                dd = math.hypot(cx - t[-1][1], cy - t[-1][2])
                if dd < bd:
                    best, bd = i, dd
            if best is None:
                tracks.append([(fno, cx, cy)]); used.add(len(tracks) - 1)
            else:
                tracks[best].append((fno, cx, cy)); used.add(best)
        alive = []
        for t in tracks:
            (alive if t[-1][0] >= fno - 3 else closed).append(t)
        tracks = alive
    closed += tracks
    return dedupe([m for m in (analyse_move(t) for t in closed) if m]), (fno + 1) / 30.0


def analyse_move(tr):
    f = np.array([p[0] for p in tr]); P = np.array([[p[1], p[2]] for p in tr])
    fr = np.arange(f[0], f[-1] + 1)
    if len(fr) < 6 or len(fr) > 75:
        return None
    pos = np.stack([np.interp(fr, f, P[:, 0]), np.interp(fr, f, P[:, 1])], 1)
    if len(pos) >= 5:                                      # 3-tap smoothing
        pos = np.stack([np.convolve(np.pad(pos[:, i], 1, mode='edge'), np.ones(3) / 3, mode='valid') for i in (0, 1)], 1)
    dist = np.hypot(*(pos - pos[0]).T); k = int(dist.argmax()); travel = float(dist[k])
    if travel < 0.04 or k < 4:                             # under 4 % of the frame, or too few frames to see an ease
        return None
    u = (pos[k] - pos[0]) / travel; s = (pos - pos[0]) @ u
    final, peak = float(s[-1]), float(s.max())
    over = max(0.0, peak - final) / max(peak, 1e-6) * 100 if len(s) - k > 3 else 0.0
    v = np.diff(s[:k + 1]); v = np.convolve(np.pad(v, 1, mode='edge'), np.ones(3) / 3, mode='valid')
    tp = int(np.abs(v).argmax()) / max(len(v) - 1, 1); cv = float(np.std(v) / max(abs(np.mean(v)), 1e-6))
    if over >= 5:
        ease = 'overshoot + settle'
    elif cv < 0.3:
        ease = 'linear'
    elif tp < 0.3:
        ease = 'ease-out'
    elif tp > 0.7:
        ease = 'ease-in'
    else:
        ease = 'ease-in-out'
    return {'start': float(fr[0]) / 30.0, 'dur': len(fr) / 30.0, 'travel': travel * 100, 'ease': ease, 'over': over, 'dir': u, 'end': pos[k]}


def dedupe(moves):
    """A fast element leaves two changed regions (its old and new edge) that track as two moves: keep the longer when two start together, go the same way and end near each other."""
    keep = []
    for m in sorted(moves, key=lambda x: -x['dur']):
        if not any(abs(m['start'] - k['start']) < 0.1 and float(m['dir'] @ k['dir']) > 0.9 and float(np.hypot(*(m['end'] - k['end']))) < 0.3 for k in keep):
            keep.append(m)
    return sorted(keep, key=lambda x: x['start'])


# ---------------------------------------------------------------- 3. sound hits by kind
def hit_kinds(sd):
    """Per hit: time, band, length (ms), dB against the median audible level."""
    mag, db, step = sd['mag'], sd['db'], sd['step']
    fq = np.fft.rfftfreq(1024, 1 / 16000)
    bands = [fq < 250, (fq >= 250) & (fq < 2000), fq >= 2000]
    level = med(db[sd['audible']], -30.0)
    out = []
    for i in sd['hit_idx']:
        a, b = mag[i + 1:i + 4].mean(axis=0), mag[max(i - 6, 0):max(i - 1, 1)].mean(axis=0)
        pos = np.maximum(a - b, 0) ** 2
        e = [float(pos[m].sum()) for m in bands]
        peak = float(db[i:i + 6].max()); j = i
        while j < len(db) - 1 and db[j] > peak - 15 and (j - i) * step < 1.0:
            j += 1
        out.append({'t': i * step, 'band': ('low', 'mid', 'high')[int(np.argmax(e))], 'ms': (j - i) * step * 1000, 'db': peak - level})
    return out


# ---------------------------------------------------------------- 4. key moments and text life
def grab(path, crop, t0, t1, w, h, fps=30):
    vf = f'crop={crop[2]}:{crop[3]}:{crop[0]}:{crop[1]},fps={fps},scale={w}:{h},format=gray'
    p = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{max(t0, 0):.3f}', '-t', f'{t1 - max(t0, 0):.3f}', '-i', path, '-vf', vf, '-f', 'rawvideo', '-'], capture_output=True)
    n = w * h; b = p.stdout
    return np.frombuffer(b[:len(b) // n * n], np.uint8).reshape(-1, h, w).astype(np.float32)


def text_life(G):
    """The largest text-like block in the frames G (T, H, W) and how it arrives. Text-like = dense strong edges in a wide, low box."""
    T, H, W = G.shape
    gx = np.zeros_like(G); gx[:, :, 1:] = np.abs(G[:, :, 1:] - G[:, :, :-1])
    gy = np.zeros_like(G); gy[:, 1:, :] = np.abs(G[:, 1:, :] - G[:, :-1, :])
    E = (gx + gy) > 60
    cs = 4; gh, gw = H // cs, W // cs
    cellE = E[:, :gh * cs, :gw * cs].reshape(T, gh, cs, gw, cs).mean(axis=(2, 4)) > 0.12
    best = None
    for t in range(0, T, 3):
        for cells in comps(dil(cellE[t], 1, 2)):
            ys = [c[0] for c in cells]; xs = [c[1] for c in cells]
            bw, bh = max(xs) - min(xs) + 1, max(ys) - min(ys) + 1
            ink = sum(1 for y, x in cells if cellE[t, y, x]); fill = ink / (bw * bh)
            if bw < 6 or bh < 2 or bw / bh < 1.5 or (bw > 0.92 * gw and bh > 0.3 * gh) or not 0.12 <= fill <= 0.85:
                continue
            if best is None or ink > best[0]:
                best = (ink, min(xs), min(ys), max(xs) + 1, max(ys) + 1)
    if best is None:
        return None
    _, cx0, cy0, cx1, cy1 = best
    x0, y0, x1, y1 = max(cx0 * cs - 8, 0), max(cy0 * cs - 8, 0), min(cx1 * cs + 8, W), min(cy1 * cs + 8, H)
    cnt = np.zeros(T); xl = np.zeros(T); xr = np.zeros(T); yt = np.zeros(T); yb = np.zeros(T); con = np.zeros(T)
    for t in range(T):
        e = E[t, y0:y1, x0:x1]; cnt[t] = e.sum()
        cols = np.where(e.sum(axis=0) >= 2)[0]; rows = np.where(e.sum(axis=1) >= 2)[0]
        if len(cols) and len(rows):
            xl[t], xr[t], yt[t], yb[t] = cols[0], cols[-1] + 1, rows[0], rows[-1] + 1
        g = G[t, y0:y1, x0:x1]; con[t] = np.percentile(g, 95) - np.percentile(g, 5)
    mx = cnt.max()
    full = int(np.argmax(cnt >= 0.9 * mx)); first = int(np.argmax(cnt >= 0.2 * mx))
    # size: the tallest text line of the settled frame (ink rows), at 1080 wide
    e = E[full, y0:y1, x0:x1]; rows = e.sum(axis=1) >= 2; runs, run = [], 0
    for r in list(rows) + [False]:
        if r:
            run += 1
        elif run:
            runs.append(run); run = 0
    scale = 1080.0 / W
    out = {'box': (int((x1 - x0) * scale), int((y1 - y0) * scale)), 'line_px': int(max(runs or [0]) * scale), 'arrive_s': 0.0, 'how': 'unclear'}
    if cnt[0] >= 0.9 * mx:
        out['how'] = 'already on screen (arrived before this window)'; return out
    n = full - first + 1; out['arrive_s'] = n / 30.0
    w = xr - xl; h = np.maximum(yb - yt, 1)
    seg = slice(first, full + 1)
    hr = float(h[full] / h[first]); cxs = float((xl[full] + xr[full]) / 2 - (xl[first] + xr[first]) / 2) / W; cys = float((yt[full] + yb[full]) / 2 - (yt[first] + yb[first]) / 2) / H
    jumps = int(np.sum(np.diff(xr[seg]) > 0.06 * max(w[full], 1))) if n > 2 else 0
    left_ok = abs(xl[full] - xl[first]) < 0.04 * W and 0.85 < hr < 1.18
    cr = float(con[first] / max(con[full], 1e-6))
    if n <= 2:
        out['how'] = 'pop (in 1-2 frames)'
    elif jumps >= 3 and left_ok:
        out['how'] = 'word by word / typed'
    elif hr >= 1.25 or hr <= 0.8:
        out['how'] = f'scale ({"grows" if hr > 1 else "shrinks"} {abs(hr - 1) * 100:.0f} %)'
    elif abs(cxs) >= 0.04 or abs(cys) >= 0.04:
        out['how'] = 'slide ' + ('right' if cxs >= 0.04 else 'left' if cxs <= -0.04 else 'down' if cys > 0 else 'up')
    elif cr < 0.6:
        out['how'] = 'fade'
    return out


def key_moments(path, crop, dur, onsets_pic, hits, strips, tmp, label):
    """The KEYS busiest 1-second windows: picture action onsets + sound hits; each a strip of 6 frames and a text-life line."""
    cw, ch = crop[2], crop[3]; th = max(2, int(round(360 * ch / cw / 2)) * 2)
    cand = []
    for k in range(0, max(int((dur - 1) * 2), 0) + 1):
        t0 = k / 2.0
        a = sum(onsets_pic[int(t0 * 10):int(t0 * 10) + 10]); s = sum(1 for h in hits if t0 <= h['t'] < t0 + 1)
        cand.append((a + s, a, s, t0))
    picked = []
    for sc, a, s, t0 in sorted(cand, key=lambda c: (-c[0], c[3])):
        if sc and all(abs(t0 - p[3]) >= 1.0 for p in picked):
            picked.append((sc, a, s, t0))
        if len(picked) == KEYS:
            break
    picked.sort(key=lambda p: p[3]); lines, sizes, hows = [], [], []
    for n, (sc, a, s, t0) in enumerate(picked, 1):
        kinds = {b: sum(1 for h in hits if t0 <= h['t'] < t0 + 1 and h['band'] == b) for b in ('low', 'mid', 'high')}
        txt = ''
        try:
            G = grab(path, crop, t0 - 0.6, t0 + 1.2, 360, th)
            tl = text_life(G) if len(G) >= 6 else None
        except Exception as e:                       # a failed text read must not stop the study
            tl = None; txt = f' (text read failed: {e})'
        if tl:
            sizes.append(tl['line_px']); hows.append(tl['how'].split(' (')[0])
            txt = f"TEXT: arrives {tl['how']}" + (f" in {tl['arrive_s']:.2f} s" if tl['arrive_s'] else '') + f", block {tl['box'][0]}x{tl['box'][1]} px, line height {tl['line_px']} px at 1080 wide"
        elif not txt:
            txt = 'TEXT: no text block found'
        name = f'lab-{label}-km{n}-t{t0:.1f}.jpg'; out = os.path.join(tmp, name)
        vf = f'crop={cw}:{ch}:{crop[0]}:{crop[1]},fps=6,scale=360:-2,setpts=PTS+{t0:.3f}/TB,'
        stamp = "drawtext=text='%{pts\\:hms}':x=4:y=4:fontsize=22:fontcolor=yellow:box=1:boxcolor=black@0.6,"
        for extra in (stamp, ''):
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t0:.3f}', '-t', '1', '-i', path, '-vf', vf + extra + 'tile=6x1', '-frames:v', '1', '-q:v', '6', out],
                           capture_output=True)
            if os.path.exists(out):
                break
        if strips and os.path.exists(out):
            with open(out, 'rb') as fh:
                print(f'B64 {name} {base64.b64encode(fh.read()).decode()}', file=sys.stderr)
        lines.append(f'KEY {label} {n} at {t0:.1f}-{t0 + 1:.1f} s: {a} picture actions, {s} sound hits (low {kinds["low"]} / mid {kinds["mid"]} / high {kinds["high"]}); strip {name} (6 frames, 0.17 s apart); {txt}')
    return lines, sizes, hows


# ---------------------------------------------------------------- per video
def study(label, path, strips, tmp):
    pw, ph, dur = probe(path)
    crop, note = find_crop(path, pw, ph)
    t = phone_trim(crop, pw, ph)
    if t != crop:
        crop, note = t, note + '; phone recording: app header, caption and button column cut'
    print(f'CROP {label} {crop[0]},{crop[1]},{crop[2]},{crop[3]} ({note})')
    res, onsets_pic, lines = ac.count(path, label, crop)
    print('ACTIONS ' + json.dumps(res))
    for l in lines:
        print(l)
    m = {'label': label, 'crop': f'{crop[2]}x{crop[3]}', 'seconds': res['seconds'], 'actions_s': res['picture_onsets_per_s'], 'moving': res['picture_moving_at_once'],
         'gap_s': res['longest_gap_s'], 'cuts_min': res['cuts_per_min'], 'camera': res['camera_share'], 'still': res['still_share']}
    # sound
    sd = ac.sound_hits(path); hits = []
    if sd is None:
        print(f'SOUND {label}: no audio track'); m.update(hits_s=0, low_s=0, mid_s=0, high_s=0, silence_s=res['seconds'], loud_db=0)
    else:
        hits = hit_kinds(sd); d = max(sd['dur'], 0.1); q = ac.quiet_stretch(sd)
        by = {b: sum(1 for h in hits if h['band'] == b) for b in ('low', 'mid', 'high')}
        print(f'HITS {label} {len(hits) / d:.2f} a second ({len(hits)} in {d:.1f} s): low {by["low"] / d:.2f} / mid {by["mid"] / d:.2f} / high {by["high"] / d:.2f} a second; median length {med([h["ms"] for h in hits]):.0f} ms, '
              f'median loudness {med([h["db"] for h in hits]):+.1f} dB against the median level; longest silence {q[0]:.1f} s ({q[1]:.1f}-{q[2]:.1f} s)')
        print(f'HITLIST {label} (time s:band:ms:dB) ' + ' '.join(f'{h["t"]:.2f}:{h["band"][0]}:{h["ms"]:.0f}:{h["db"]:+.0f}' for h in hits[:60]) + (' ...' if len(hits) > 60 else ''))
        m.update(hits_s=len(hits) / d, low_s=by['low'] / d, mid_s=by['mid'] / d, high_s=by['high'] / d, silence_s=q[0], loud_db=med([h['db'] for h in hits]))
    # moves
    moves, mdur = motion(path, crop)
    kinds = {}
    for mv in moves:
        kinds[mv['ease']] = kinds.get(mv['ease'], 0) + 1
    typical = max(kinds, key=kinds.get) if kinds else '-'
    m.update(moves_10s=len(moves) / max(mdur, 0.1) * 10, move_s=med([x['dur'] for x in moves]), travel=med([x['travel'] for x in moves]),
             overshoot=(sum(1 for x in moves if x['ease'].startswith('overshoot')) / len(moves) * 100) if moves else 0, ease=typical)
    print(f'MOVES {label} {len(moves)} moves ({m["moves_10s"]:.1f} per 10 s): median {m["move_s"]:.2f} s, median travel {m["travel"]:.0f} % of the frame, overshoot share {m["overshoot"]:.0f} %, typical ease {typical} '
          + '(' + ', '.join(f'{k} {v}' for k, v in sorted(kinds.items(), key=lambda kv: -kv[1])) + ')')
    for mv in sorted(moves, key=lambda x: -x['travel'])[:10]:
        print(f'  MOVE {label} at {mv["start"]:.2f} s, {mv["dur"]:.2f} s, travel {mv["travel"]:.0f} %, {mv["ease"]}, overshoot {mv["over"]:.0f} %')
    # key moments
    klines, sizes, hows = key_moments(path, crop, dur, onsets_pic, hits, strips, tmp, label)
    for l in klines:
        print(l)
    m.update(text_px=med(sizes), arrival=(max(set(hows), key=hows.count) if hows else '-'))
    return m


# ---------------------------------------------------------------- 5. scorecard
COLS = [('crop', 'crop', '{}'), ('seconds', 's', '{:.0f}'), ('actions_s', 'actions/s', '{:.2f}'), ('moving', 'moving at once', '{:.2f}'), ('gap_s', 'longest gap s', '{:.1f}'),
        ('cuts_min', 'cuts/min', '{:.0f}'), ('camera', 'camera share', '{:.2f}'), ('still', 'still share', '{:.2f}'), ('moves_10s', 'moves/10 s', '{:.1f}'),
        ('move_s', 'move s', '{:.2f}'), ('overshoot', 'overshoot %', '{:.0f}'), ('ease', 'typical ease', '{}'), ('hits_s', 'hits/s', '{:.2f}'), ('low_s', 'low/s', '{:.2f}'),
        ('mid_s', 'mid/s', '{:.2f}'), ('high_s', 'high/s', '{:.2f}'), ('silence_s', 'silence s', '{:.1f}'), ('loud_db', 'hit dB', '{:+.1f}'), ('text_px', 'text px@1080', '{:.0f}'),
        ('arrival', 'text arrival', '{}')]
# (key, name, higher is better): the gap is the share by which ours falls short of the reference median
GAPS = [('actions_s', 'actions a second', True), ('moving', 'things moving at once', True), ('moves_10s', 'moves per 10 s', True), ('hits_s', 'sound hits a second', True),
        ('high_s', 'high ticks a second', True), ('gap_s', 'longest still gap (s)', False), ('still', 'still share', False), ('silence_s', 'longest silence (s)', False)]


def scorecard(rows):
    print('\nSCORECARD (one line per video; ref-* are references, the rest ours)')
    print('| video | ' + ' | '.join(c[1] for c in COLS) + ' |'); print('|' + '---|' * (len(COLS) + 1))
    for r in rows:
        print(f'| {r["label"]} | ' + ' | '.join(f.format(r[k]) if k in r else '-' for k, _, f in COLS) + ' |')
    refs = [r for r in rows if r['label'].startswith('ref-')]; ours = [r for r in rows if not r['label'].startswith('ref-')]
    if not refs or not ours:
        print('GAP: needs at least one reference (ref-<id>) and one of our reels in the same run'); return

    def gaps(subset):
        out = []
        for k, name, up in GAPS:
            rv = med([r[k] for r in refs if k in r]); ov = float(np.mean([r[k] for r in subset if k in r]))
            g = (rv - ov) / max(rv, 0.05) if up else (ov - rv) / max(ov, 0.05)
            if g > 0.05:
                out.append((g, f'{name}: {ov:.2f} against {rv:.2f}' + (f' ({g * 100:.0f} % short)' if up else f' ({g * 100:.0f} % worse)')))
        return [t for _, t in sorted(out, reverse=True)[:3]]
    for r in ours:
        print(f'GAP {r["label"]} against the reference median of {len(refs)}: ' + ('; '.join(f'{i}) {t}' for i, t in enumerate(gaps([r]), 1)) or 'none over 5 %'))
    if len(ours) > 1:
        print(f'GAP all {len(ours)} of ours: ' + ('; '.join(f'{i}) {t}' for i, t in enumerate(gaps(ours), 1)) or 'none over 5 %'))


def main():
    args = sys.argv[1:]; strips = '--no-strips' not in args
    vids = [a.split('=', 1) for a in args if '=' in a and not a.startswith('--')]
    if not vids:
        print(__doc__); sys.exit(2)
    rows = []
    with tempfile.TemporaryDirectory() as tmp:
        for label, path in vids:
            try:
                rows.append(study(label, path, strips, tmp))
            except Exception as e:
                print(f'LAB {label}: failed ({type(e).__name__}: {e})')
            sys.stdout.flush()
    scorecard(rows)


if __name__ == '__main__':
    main()
