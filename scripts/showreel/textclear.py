"""TEXT CLEAR (owner, 26 Nov 2026: numbers over the phone and crossed by the pointer line in tech; chips on borders and touching the subtitle
pill in Turns Out). Every 0.25 s, every piece of text against everything else on the frame, not only the marked elements.

Two pictures per moment, written by the engine's dumper (scripts/showreel/textclear.mjs: web showreels, Turns Out and kit tech; techreel/make.py
--textclear: the older tech engine): A = the frame as drawn, B = the same moment with every overlay text left out (a scene's own UI text inside
[data-subject] / [data-ui] stays: it is part of the subject). B is the picture the text sits on.
  1. the text = where A and B differ, grown by GAP px (8 px at 1080 wide) on every side: the room the text must have;
  2. the picture under it = the edges of B (the change in brightness between neighbours, softened) inside that room:
     a flat card, a plain background and a soft glow have none; a card's border, the subtitle pill's edge, a phone, a line, a ring or a
     tag touching or behind the text do. So text sitting well inside its own card passes, text on a border or over a thing fails;
  3. text against text: the boxes the scene reports, different blocks must not overlap (words of one line do not count);
  4. a problem must last 0.5 s (two samples in a row, nearly in the same place): a word sliding past something is motion, not layout.
A moment can be waived in the reel's config: "qa": {"textclear_ok": [[t0, t1, "why"]]} (a demo that overlaps on purpose).
Usage: python3 scripts/showreel/textclear.py <dump dir> [--config reel.json]   (dump dir: meta.json + A_<i>.png / B_<i>.png)
Prints TEXT CLEAR: ok | FAIL lines and exits 1 on a FAIL. Numbers are in 1080x1920 pixels."""
import json, os, sys
import numpy as np
from PIL import Image, ImageFilter

GAP = 6          # px at 1080 wide: the room text must have around it (edges are smeared by about 3 px, so a 10 px margin passes)
OVER_TXT = 6     # px at 1080 wide: two text boxes of different blocks that intersect by more than this each way (as the 0.5 s OVERLAP check; font boxes are loose)
INK = 60         # summed RGB difference that counts as text ink
EDGE = 8.0       # brightness change per pixel (0-255, after softening) that counts as an edge in the picture under the text
MIN_EDGE = 10    # edge pixels (at 540 wide; scaled with the picture) in one place that count


def load(p): return np.asarray(Image.open(p).convert('RGB'), np.int16)


def grow(mask, r):
    if r <= 0: return mask
    im = Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(2 * r + 1))
    return np.asarray(im) > 0


def cells(mask, cell, hug=None):
    """Connected groups of cells (4-neighbour) that hold edge pixels: [(x0, y0, x1, y1, count)] in picture pixels."""
    h, w = mask.shape; ch, cw = -(-h // cell), -(-w // cell)
    cnt = np.zeros((ch, cw), np.int32)
    ys, xs = np.nonzero(mask)
    np.add.at(cnt, (ys // cell, xs // cell), 1)
    on = cnt >= 3; seen = np.zeros_like(on); out = []
    for cy in range(ch):
        for cx in range(cw):
            if not on[cy, cx] or seen[cy, cx]: continue
            st, grp = [(cy, cx)], []; seen[cy, cx] = True
            while st:
                y, x = st.pop(); grp.append((y, x))
                for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (-1, -1), (1, -1), (-1, 1)):
                    yy, xx = y + dy, x + dx
                    if 0 <= yy < ch and 0 <= xx < cw and on[yy, xx] and not seen[yy, xx]: seen[yy, xx] = True; st.append((yy, xx))
            n = int(sum(cnt[y, x] for y, x in grp))
            x0, y0, x1, y1 = min(x for _, x in grp) * cell, min(y for y, _ in grp) * cell, (max(x for _, x in grp) + 1) * cell, (max(y for y, _ in grp) + 1) * cell
            sel = mask[y0:y1, x0:x1]; yy, xx = np.nonzero(sel)
            ex0, ex1, ey0, ey1 = x0 + xx.min(), x0 + xx.max() + 1, y0 + yy.min(), y0 + yy.max() + 1
            touch = bool(hug[y0:y1, x0:x1][sel].any()) if hug is not None else False
            out.append((int(ex0), int(ey0), int(ex1), int(ey1), n, touch))
    return out


def blobs(mask, cell):
    """Groups of 8-connected cells that hold ink: [(x0, y0, x1, y1)] in picture pixels (a word or a line of text)."""
    h, w = mask.shape; ch, cw = -(-h // cell), -(-w // cell)
    pad = np.zeros((ch * cell, cw * cell), bool); pad[:h, :w] = mask
    on = pad.reshape(ch, cell, cw, cell).any(axis=(1, 3)); seen = np.zeros_like(on); out = []
    for cy in range(ch):
        for cx in range(cw):
            if not on[cy, cx] or seen[cy, cx]: continue
            st, grp = [(cy, cx)], []; seen[cy, cx] = True
            while st:
                y, x = st.pop(); grp.append((y, x))
                for dy in (-1, 0, 1):
                    for dx in (-1, 0, 1):
                        yy, xx = y + dy, x + dx
                        if 0 <= yy < ch and 0 <= xx < cw and on[yy, xx] and not seen[yy, xx]: seen[yy, xx] = True; st.append((yy, xx))
            out.append((min(x for _, x in grp) * cell, min(y for y, _ in grp) * cell, (max(x for _, x in grp) + 1) * cell, (max(y for y, _ in grp) + 1) * cell))
    return out


def frame_ring(B, d, bb, k, sharp):
    """A chip, label or tag is its text plus the flat fill it sits on. When that fill is a small bounded shape (not the page or a big card) the shape's
    outline is what must stay clear: the picture just outside it must be one even colour all the way round. A part of the ring that differs
    (a board's edge, the subtitle pill, another tag touching it) is another element touching the chip. Returns clusters like cells()."""
    x0, y0, x1, y1 = bb; h, w = d.shape; L = max(6, int(round(36 * k)))
    X0, Y0, X1, Y1 = max(0, x0 - L), max(0, y0 - L), min(w, x1 + L), min(h, y1 + L)
    win = B[Y0:Y1, X0:X1]; ink = d[Y0:Y1, X0:X1] & (np.arange(X0, X1)[None, :] >= x0) & (np.arange(X0, X1)[None, :] < x1) & (np.arange(Y0, Y1)[:, None] >= y0) & (np.arange(Y0, Y1)[:, None] < y1)
    if ink.sum() < 8: return []
    c0 = np.median(win[ink], axis=0)
    same = np.abs(win - c0).sum(-1) <= 24
    R = grow(ink, 1) & same | ink
    for _ in range(int(60 * k) + 8):
        R2 = grow(R, 1) & same | R
        if R2.sum() == R.sum(): break
        R = R2
    ys, xs = np.nonzero(R)
    if not len(xs) or xs.min() <= 0 or ys.min() <= 0 or xs.max() >= R.shape[1] - 1 or ys.max() >= R.shape[0] - 1: return []   # the fill runs on: the page or a big card
    ib = (np.nonzero(ink)[1].min(), np.nonzero(ink)[0].min(), np.nonzero(ink)[1].max(), np.nonzero(ink)[0].max())
    if xs.min() > ib[0] - 3 or ys.min() > ib[1] - 3 or xs.max() < ib[2] + 3 or ys.max() < ib[3] + 3: return []   # no fill around the text: the edge check covers it
    if (xs.max() - xs.min() + 1) < 1.6 * (ys.max() - ys.min() + 1): return []   # chips, labels and tags are wide pills; a round badge or a progress ring is not judged here
    r1 = max(2, int(round(4 * k))); r2 = r1 + max(2, int(round(6 * k)))
    ring = grow(R, r2) & ~grow(R, r1)
    if ring.sum() < 20: return []
    med = np.median(win[ring], axis=0)
    dev = ring & (np.abs(win - med).sum(-1) > 40) & sharp[Y0:Y1, X0:X1]   # a different colour AND a sharp edge there: a soft shadow or glow is neither
    if dev.sum() < max(10, 0.05 * ring.sum()): return []
    yy, xx = np.nonzero(dev)
    return [(int(xx.min() + X0), int(yy.min() + Y0), int(xx.max() + 1 + X0), int(yy.max() + 1 + Y0), int(dev.sum()), True)]


def under(A, B, k, own=()):
    """(ink mask, edge clusters under the text and its room) for one moment; k = picture width / 1080. own: [l, t, r, b] (1080 px) of boxes
    that are one text's own tight backdrop (a highlight, a label pill): their border is not an obstacle for the text inside."""
    d = np.abs(A - B).sum(-1) > INK
    if d.sum() < 12: return None, []
    r = max(1, int(round(GAP * k)))
    room = grow(d, r)
    g = Image.fromarray(np.clip(B.mean(-1), 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(max(.6, .8 * k * 2)))
    L = np.asarray(g, np.float32)
    gx = np.zeros_like(L); gy = np.zeros_like(L)
    gx[:, 1:-1] = (L[:, 2:] - L[:, :-2]) / 2; gy[1:-1, :] = (L[2:, :] - L[:-2, :]) / 2
    mag = np.hypot(gx, gy)
    edge = (mag > EDGE * (k * 2) ** .5) & room       # a coarser picture smears an edge over more pixels: its steps are smaller
    out = []; hug = grow(d, max(1, int(round(2 * k)))); H_, W_ = edge.shape; m = r + 1; sharp = mag > EDGE * (k * 2) ** .5
    for (x0, y0, x1, y1) in blobs(d, max(4, int(round(12 * k)))):
        X0, Y0, X1, Y1 = max(0, x0 - m), max(0, y0 - m), min(W_, x1 + m), min(H_, y1 + m)
        e = edge[Y0:Y1, X0:X1].copy(); framed = False
        # this text's own backdrop: a box from the page that wraps it tightly; its border is not an obstacle for the text inside
        for (l, t, rr, b, tl, tt, tr, tb) in own:
            l, t, rr, b, tl, tt, tr, tb = (v * k for v in (l, t, rr, b, tl, tt, tr, tb))
            if tl - 2 <= x1 and tr + 2 >= x0 and tt - 2 <= y1 and tb + 2 >= y0:   # this blob holds the text that box wraps
                framed = True; w = max(3, int(round(7 * k)))
                yy, xx = np.mgrid[Y0:Y1, X0:X1]
                outer = (yy >= t - w) & (yy < b + w) & (xx >= l - w) & (xx < rr + w); inner = (yy >= t + w) & (yy < b - w) & (xx >= l + w) & (xx < rr - w)
                e &= ~(outer & ~inner)
        if not framed: out += frame_ring(B, d, (x0, y0, x1, y1), k, sharp)   # the page told us this text's frame (a selection box, a pill): nothing to look for
        if e.sum() >= 3:
            full = np.zeros(edge.shape, bool); full[Y0:Y1, X0:X1] = e
            out += cells(full, max(8, int(round(24 * k))), hug)
    return d, out


def box_gap(a, b):
    dx = max(a['l'] - b['r'], b['l'] - a['r'], 0); dy = max(a['t'] - b['b'], b['t'] - a['b'], 0)
    return (dx * dx + dy * dy) ** .5


def same_line(a, b):
    ov = min(a['b'], b['b']) - max(a['t'], b['t']); hh = min(a['b'] - a['t'], b['b'] - b['t'])
    return hh > 0 and ov > .5 * hh


def text_pairs(boxes):
    out = []
    on = [b for b in boxes if b.get('a', 1) >= .3 and b['r'] - b['l'] > 2]
    for i in range(len(on)):
        for j in range(i + 1, len(on)):
            a, b = on[i], on[j]
            if (a.get('g', -1) == b.get('g', -1) and a.get('g', -1) != -1) or a.get('sub') or b.get('sub'): continue
            if a['s'] == b['s'] and abs(a['l'] - b['l']) < 12 and abs(a['t'] - b['t']) < 12: continue     # one word drawn twice (a glow copy)
            if same_line(a, b) and box_gap(a, b) >= 0 and abs(min(a['r'], b['r']) - max(a['l'], b['l'])) < 40 and box_gap(a, b) < 40 and a['l'] != b['l']: continue   # next words of one line
            if min(a['r'], b['r']) - max(a['l'], b['l']) > OVER_TXT and min(a['b'], b['b']) - max(a['t'], b['t']) > OVER_TXT: out.append((a, b))
    return out


def main():
    dump = sys.argv[1]; cfgp = sys.argv[sys.argv.index('--config') + 1] if '--config' in sys.argv else None
    meta = json.load(open(os.path.join(dump, 'meta.json')))
    waive = []
    if cfgp and os.path.exists(cfgp):
        try: waive = ((json.load(open(cfgp)).get('qa') or {}).get('textclear_ok')) or []
        except Exception: waive = []
    waive += meta.get('waive', [])
    ok_at = lambda t: any(a - .01 <= t <= b + .01 for a, b, *_ in waive)
    found = []   # (t, kind, bbox, n, label)
    n = 0
    for i, s in enumerate(meta['samples']):
        t = s['t']
        if ok_at(t): continue
        A, B = load(os.path.join(dump, f'A_{i}.png')), load(os.path.join(dump, f'B_{i}.png')); k = A.shape[1] / 1080
        n += 1
        d, cl = under(A, B, k, s.get('own', []))
        boxes = s.get('boxes', [])
        for x0, y0, x1, y1, cnt, touch in cl:
            if cnt < MIN_EDGE * (k * 2) or ((x1 - x0) / k <= 12 and (y1 - y0) / k <= 44): continue   # a typing caret or a dot beside its text is not an obstacle
            bb = [round(v / k) for v in (x0, y0, x1, y1)]
            near = [b for b in boxes if b.get('a', 1) >= .3 and not b.get('sub') and b['r'] > bb[0] - GAP and b['l'] < bb[2] + GAP and b['b'] > bb[1] - GAP and b['t'] < bb[3] + GAP]
            lab = (near[0]['s'] if near else 'text')
            found.append((t, 'edge' if touch else 'near', bb, cnt, lab))
        for a, b in text_pairs(boxes):
            found.append((t, 'text', [round(min(a['l'], b['l'])), round(min(a['t'], b['t'])), round(max(a['r'], b['r'])), round(max(a['b'], b['b']))], 0, f'"{a["s"]}" x "{b["s"]}"'))
    # a problem must last: the same kind in nearly the same place for PERSIST samples in a row
    step = meta.get('step', .25); runs = []
    for f in sorted(found, key=lambda f: f[0]):
        cx, cy = (f[2][0] + f[2][2]) / 2, (f[2][1] + f[2][3]) / 2
        for r in runs:
            if r['kind'] == f[1] and abs(f[0] - r['t1'] - step) < step * .6 and abs(cx - r['cx']) < 90 and abs(cy - r['cy']) < 90:
                r['t1'] = f[0]; r['n'] += 1; r['cx'], r['cy'] = cx, cy; r['bb'] = [min(r['bb'][0], f[2][0]), min(r['bb'][1], f[2][1]), max(r['bb'][2], f[2][2]), max(r['bb'][3], f[2][3])]; r['cnt'] = max(r['cnt'], f[3]); break
        else: runs.append(dict(kind=f[1], t0=f[0], t1=f[0], n=1, cx=cx, cy=cy, bb=list(f[2]), cnt=f[3], lab=f[4]))
    need = max(1, round(.5 / step))   # a problem must last 0.5 s: 2 samples at a 0.25 s step, 1 at 0.5 s (3D scenes)
    bad = [r for r in runs if r['n'] >= need]
    brief = [r for r in runs if r['n'] < need]
    what = lambda r: (f'{r["t0"]:.2f}-{r["t1"] + step:.2f} s: ' + (f'{r["lab"]} touches or sits over something at x {r["bb"][0]}-{r["bb"][2]}, y {r["bb"][1]}-{r["bb"][3]}' if r['kind'] == 'edge'
                      else f'{r["lab"]} is within {GAP} px of another element (border, pill, shape) at x {r["bb"][0]}-{r["bb"][2]}, y {r["bb"][1]}-{r["bb"][3]}' if r['kind'] == 'near'
                      else f'{r["lab"]} overlap at x {r["bb"][0]}-{r["bb"][2]}, y {r["bb"][1]}-{r["bb"][3]}'))
    if bad:
        print('TEXT CLEAR: FAIL ' + ' | '.join(what(r) for r in bad[:6]) + (f' (+{len(bad) - 6} more)' if len(bad) > 6 else ''))
    else:
        print(f'TEXT CLEAR: ok ({n} moments, every {step:g} s: no text within {GAP} px of another element, the subtitle pill or another text for 0.5 s)'
              + (f'; brief (under 0.5 s, not counted): {" | ".join(what(r) for r in brief[:3])}' if brief else ''))
    json.dump(dict(bad=[what(r) for r in bad], brief=[what(r) for r in brief], moments=n), open(os.path.join(dump, 'result.json'), 'w'))
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
