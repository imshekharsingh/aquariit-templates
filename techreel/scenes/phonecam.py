"""The "phone walkthrough" look for @techin20sec (12 Nov 2026; topic "look": "phone"; design/rules-tech.md, design/references.md R-trend tech-walkthrough).
Owner, 12 Nov: "Tech reel doesn't feel like a change at all, same things, same design pattern". The glass panels are replaced by what
settings-tip reels with big reach use: ONE big phone filling the frame (our own generic drawing: no platform UI, icons or fonts), a touch
indicator that walks the real path tap by tap ON the word that names it, the camera zooming into every tap, a flat bold colour per setting,
a big 1/3 counter, huge word-by-word captions (white, black outline, the current word yellow), the result shown in frame 0.
Every frame is a pure function of t. World = 1080x1920 output pixels, drawn at 2x, then one affine zoom; the HUD (counter, paths, captions,
hook) is drawn over the zoomed world and never zooms."""
import math
from functools import lru_cache

import numpy as np
from PIL import Image, ImageDraw

from . import base as B

W, H, SS = B.W, B.H, B.SS
INK = (14, 14, 18)
YEL = (255, 222, 0)
GREEN = (22, 196, 108)
RED = (240, 62, 62)
GREY = (120, 124, 136)
LINE = (226, 228, 234)
SCREEN_BG = (246, 247, 250)
COLORS = {'blue': (34, 86, 255), 'purple': (120, 64, 236), 'red': (240, 74, 74), 'green': (16, 168, 104), 'amber': (245, 150, 20), 'cyan': (0, 160, 210)}
# the phone (world px): body x 150-870, top PY; the screen inside a 14 px bezel, drawn to its own image and clipped by a rounded mask
PX, PW, BEZ, PR = 150, 720, 14, 74
SX, SW = PX + BEZ, PW - 2 * BEZ
SH = 1560                     # the screen's drawn height (it runs off the foot of the frame, a phone held up to the camera)
ROW0, ROWH = 250, 122         # first row and row height, screen-local
PY_HOOK, PY = 760, 420        # the phone's top during the hook, then for the rest of the reel
CARD = (70, 1078, 880, 176)   # the path card (HUD): x, y, w, h
CAP_Y = 1400                  # captions centre line
GAP = 30                      # the gap between caption words (the outline eats the normal space)


def ease(k):
    return B.ease_io(B.clamp(k))


@lru_cache(maxsize=None)
def _mask():
    m = Image.new('L', (SW * SS, SH * SS), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, SW * SS - 1, (SH + 400) * SS], radius=(PR - BEZ) * SS, fill=255)
    return m


_LY, _LX = (np.mgrid[0:240, 0:135].astype(np.float32) + .5) * 8


def background(t, col):
    """A flat bold colour (the scene's), lighter at the top left, with three soft lighter blobs drifting slowly: painted at 1/8 and scaled up."""
    c = np.array(col, np.float32)
    img = np.zeros((240, 135, 3), np.float32) + c
    g = np.clip(1 - (_LX / 1080 * .5 + _LY / 1920), 0, 1)[..., None]
    img = img + (255 - img) * .12 * g - img * .18 * np.clip(_LY / 1920 - .45, 0, 1)[..., None]
    for i, (x, y, r, fx, fy) in enumerate(((200, 400, 520, .23, .31), (900, 1200, 600, .29, .19), (500, 1750, 480, .17, .27))):
        xx = x + math.sin(t * fx * 2 + i) * 160
        yy = y + math.sin(t * fy * 2 + i * 1.7) * 200
        f = np.clip(1 - np.sqrt((_LX - xx) ** 2 + (_LY - yy) ** 2) / r, 0, 1) ** 2 * .16
        img = img + (255 - img) * f[..., None]
    small = np.clip(img, 0, 255).astype(np.uint8)
    return Image.fromarray(small).resize((W * SS, H * SS), Image.BICUBIC), small


# ---------- the screen (screen-local px, drawn at 2x) ----------
class Screen:
    def __init__(self):
        self.img = Image.new('RGB', (SW * SS, SH * SS), SCREEN_BG)
        self.d = ImageDraw.Draw(self.img, 'RGBA')
        self.texts = []   # (text, l, t, r, b) screen-local, for the layout check

    def rect(self, x, y, w, h, r=0, fill=None, outline=None, width=2):
        if w > 0 and h > 0:
            self.d.rounded_rectangle([x * SS, y * SS, (x + w) * SS, (y + h) * SS], radius=r * SS, fill=fill, outline=outline, width=int(width * SS))

    def circle(self, cx, cy, r, fill=None, outline=None, width=2):
        self.d.ellipse([(cx - r) * SS, (cy - r) * SS, (cx + r) * SS, (cy + r) * SS], fill=fill, outline=outline, width=int(width * SS))

    def line(self, pts, fill, width=4):
        self.d.line([v * SS for p in pts for v in p], fill=fill, width=int(width * SS), joint='curve')

    def text(self, x, y, s, size, color=INK, weight=700, anchor='lm'):
        w = B.text_w(s, size, weight)
        x0 = x - (w / 2 if anchor[0] == 'm' else w if anchor[0] == 'r' else 0)
        self.d.text((x * SS, y * SS), s, font=B.font(size, weight), fill=color, anchor=anchor)
        if len(color) < 4 or color[3] > 80:
            self.texts.append((s, x0, y - size * .5, x0 + w, y + size * .45))
        return w


def tick(sc, cx, cy, s, col=(255, 255, 255), width=6):
    sc.line([(cx - 13 * s, cy), (cx - 4 * s, cy + 10 * s), (cx + 14 * s, cy - 11 * s)], col, width)


def switch(sc, x, y, k, on_col=GREEN):
    """A generic switch at (x, y) centre; k = 0 off .. 1 on (springy)."""
    col = B.mixc((205, 208, 216), on_col, B.clamp(k))
    sc.rect(x - 52, y - 30, 104, 60, r=30, fill=col)
    kx = x - 22 + 44 * B.clamp(k, -.1, 1.1)
    sc.circle(kx, y + 2, 25, fill=(0, 0, 0, 30))
    sc.circle(kx, y, 25, fill=(255, 255, 255))


ICON_COLS = [(52, 120, 246), (255, 149, 0), (88, 86, 214), (52, 199, 89), (255, 59, 48), (90, 200, 250), (175, 82, 222)]


def page(sc, pg, ox, t, act=None, act_k=0.0, hook_flip=None):
    """One settings page at x offset ox: a back link, the title, rows. Row: {text, value?, icon?, switch?: bool, chevron?, check?}.
    act: the row index changed on this page (switch flips / tick moves); act_k 0 -> 1."""
    title = pg.get('title', 'Settings')
    sc.rect(ox, 0, SW, SH, fill=SCREEN_BG)
    sc.texts = [b for b in sc.texts if not (b[3] > ox and b[1] < ox + SW)]   # what this page covers is hidden (layout check)
    if pg.get('back'):
        sc.text(ox + 34, 92, '‹ ' + pg['back'], 34, (40, 100, 240), 600)
    sc.text(ox + 34, 168, title, 62, INK, 800)
    if pg.get('sub'):
        sc.text(ox + 36, 226, pg['sub'], 30, GREY, 500)
    y0 = ROW0 + (30 if pg.get('sub') else 0)
    sc.rect(ox + 22, y0 - 6, SW - 44, ROWH * len(pg['rows']) + 12, r=26, fill=(255, 255, 255))
    choice = pg.get('choice')   # {"from": i, "pick": j}: a tick moving from row i to row j
    for i, row in enumerate(pg['rows']):
        y = y0 + i * ROWH + ROWH / 2
        if i:
            sc.rect(ox + (118 if row.get('icon', pg.get('icons')) else 44), y - ROWH / 2, SW - 160, 2, fill=LINE)
        x = ox + 50
        if row.get('icon', pg.get('icons')):
            sc.rect(x - 6, y - 30, 60, 60, r=16, fill=ICON_COLS[(i + len(title)) % len(ICON_COLS)])
            sc.circle(x + 24, y, 11, fill=(255, 255, 255, 230))
            x += 78
        sc.text(x, y, row['text'], 42, INK, 600)
        rx = ox + SW - 56
        hk = None if hook_flip is None else hook_flip[i]
        if row.get('switch') is not None:
            on = 1.0 if row['switch'] else 0.0
            if act == i:
                tgt = 0.0 if row['switch'] else 1.0
                on = on + (tgt - on) * act_k
            switch(sc, rx - 40, y, on)
        elif hk is not None:   # the hook: a red pill (the risky value) flips to a green one (the safe value)
            a, b = row['from'], row['to']
            k = B.clamp(hk)
            s = b if k > .5 else a
            col = GREEN if k > .5 else RED
            sc_k = 1 + .18 * math.sin(math.pi * B.clamp(hk * 2)) if hk < .5 else 1 + .12 * max(0, math.sin(math.pi * B.clamp((hk - .5) * 2)))
            tw = B.text_w(s, 34, 800) + 64
            sc.rect(rx - tw * sc_k + 8, y - 30 * sc_k, tw * sc_k, 60 * sc_k, r=30 * sc_k, fill=col)
            sc.text(rx - tw * sc_k / 2 + 8 + (14 if k > .5 else 0), y, s, int(34 * sc_k), (255, 255, 255), 800, 'mm')
            if k > .5:
                tick(sc, rx - tw * sc_k + 40, y, .9 * sc_k, width=5)
        elif choice is not None:
            frm, pick = choice['from'], choice['pick']
            k = act_k if act is not None else 0.0
            if i == frm and k < .5:
                tick(sc, rx - 10, y, 1.2 * (1 - k * 2), (40, 100, 240), 6)
            if i == pick and k >= .5:
                tick(sc, rx - 10, y, 1.2 * min(1, (k - .5) * 3), (40, 100, 240), 6)
        else:
            if row.get('value'):
                sc.text(rx - 34, y, row['value'], 36, GREY, 500, 'rm')
            if row.get('chevron', True):
                sc.text(rx, y, '›', 48, (190, 192, 200), 500, 'rm')
    return y0


def row_y(pg, i):
    return ROW0 + (30 if pg.get('sub') else 0) + i * ROWH + ROWH / 2


# ---------- timing ----------
def plan(sc):
    """The scene's taps: every step gets a time (its cue word, or spaced between its neighbours), pages slide in after each tap."""
    steps = sc.params['steps']
    ts = [sc.cue(s['cue']) if s.get('cue') else None for s in steps]
    first = sc.start + .55
    for i in range(len(ts)):
        if ts[i] is None:
            prev = ts[i - 1] if i else first - .55
            nxt = next((ts[j] for j in range(i + 1, len(ts)) if ts[j] is not None), None)
            ts[i] = (prev + nxt) / 2 if nxt is not None and i else max(first, prev + .6) if nxt is None else max(first, nxt - .65)
        if i:
            ts[i] = max(ts[i], ts[i - 1] + .5)
    return ts


SLIDE = .3


def scene_state(sc, t):
    """Which page shows (and the slide between two), the tap times and where each tap lands (world px, phone at PY)."""
    steps = sc.params['steps']
    ts = plan(sc)
    pages = [s['page'] for s in steps]
    k_pg, slide = 0, 1.0
    for i in range(1, len(pages)):
        a = ts[i - 1] + .14
        if t >= a:
            k_pg, slide = i, ease((t - a) / SLIDE)
    taps = []
    for i, s in enumerate(steps):
        pg = s['page']
        r = s['tap']
        x = SX + (SW - 96 if pg['rows'][r].get('switch') is not None else SW * .42)
        taps.append((ts[i], x, PY + BEZ + row_y(pg, r)))
    return pages, k_pg, slide, ts, taps


def zoom_at(t, scenes, hook_out):
    """The camera: zoom z around focus F (world px). It leans into every tap (1.0 -> 1.16, the last tap of a setting 1.24 and held), and
    always drifts a little, so no stretch is still."""
    env, fx, fy, best = 0.0, 510.0, 900.0, 0.0
    for s in scenes:
        if s.kind != 'tap' or not (s.start - .5 <= t <= s.end + .5):
            continue
        _, _, _, ts, taps = scene_state(s, t)
        for i, (tt, x, y) in enumerate(taps):
            last = i == len(taps) - 1
            hold = 1.6 if last else .25
            e = B.clamp((t - (tt - .45)) / .35) * (1 - ease((t - (tt + hold)) / .5))
            e = ease(e)
            amp = .13 if last else .09
            if e * amp > best:
                best, env, fx, fy = e * amp, e, x, y
    z = (1 + best) * (1 + .02 * math.sin(t * .7))
    for s in scenes:
        if s.kind == 'recap' and t >= s.start:
            z *= 1 + .1 * ease((t - s.start) / max(1.0, s.end - s.start))
    k = env
    fx, fy = 510 + (fx - 510) * k * .5, 900 + (fy - 900) * k
    # keep the phone's top (PY) at y 384+ and the screen's sides inside the frame: the counter above it never touches it
    fy = min(fy, (PY * z - 384 - 30) / (z - 1)) if z > 1.001 else fy
    dx = 2.2 * (math.sin(t * .55) * 9 + math.sin(t * 1.3 + 2) * 2.5)
    dy = 2.2 * (math.sin(t * .41 + 1) * 11 + math.sin(t * 1.1) * 3)
    return z, fx, fy, dx, dy


def finger(fr2, taps, t, z, F, D):
    """The touch indicator (as a screen recording shows touches): a soft grey disc that glides to each tap, presses, rings out, leaves."""
    if not taps:
        return
    t0, tl = taps[0][0], taps[-1][0]
    if t < t0 - .7 or t > tl + .8:
        return
    pts = [(taps[0][0] - .7, taps[0][1] + 260, taps[0][2] + 420)] + [(tt - .22, x, y) for tt, x, y in taps] + [(tl + .8, taps[-1][1] + 240, taps[-1][2] + 520)]
    x, y = pts[0][1], pts[0][2]
    for (ta, xa, ya), (tb, xb, yb) in zip(pts, pts[1:]):
        if t >= ta:
            k = ease((t - ta) / max(.05, min(.45, tb - ta)))
            x, y = xa + (xb - xa) * k, ya + (yb - ya) * k
    a = B.clamp((t - (t0 - .7)) / .25) * (1 - B.clamp((t - (tl + .45)) / .35))
    press = max((math.exp(-((t - tt) / .09) ** 2) for tt, _, _ in taps), default=0)
    ox, oy = F[0] + (x - F[0]) * z + D[0], F[1] + (y - F[1]) * z + D[1]
    for tt, tx, ty in taps:   # the ripple: a ring that grows and fades from each tap
        if 0 <= t - tt < .5:
            k = (t - tt) / .5
            rx, ry = F[0] + (tx - F[0]) * z + D[0], F[1] + (ty - F[1]) * z + D[1]
            fr2.circle(rx, ry, 46 + 70 * k, outline=(255, 255, 255, int(220 * (1 - k) * a)), width=6)
    r = 46 * (1 - .18 * press)
    fr2.circle(ox, oy + 4, r + 2, fill=(0, 0, 0, int(50 * a)))
    fr2.circle(ox, oy, r, fill=(120, 124, 136, int(150 * a)), outline=(255, 255, 255, int(235 * a)), width=5)


# ---------- HUD ----------
def stroke_text(fr, x, y, s, size, fill, anchor='mm', stroke=None, weight=900, a=1.0):
    """Big caption-style text: a heavy face with a thick black outline (sound-off reels' house style)."""
    w = B.text_w(s, size, weight)
    sw = stroke if stroke is not None else max(4, int(size * .075))
    f = B.font(size, weight)
    x0 = x - (w / 2 if anchor[0] == 'm' else w if anchor[0] == 'r' else 0)
    if a >= .3:
        fr.boxes.append((s, x0, y - size * .5, x0 + w, y + size * .45, a))
    if a <= .02:
        return w
    if a >= .99:
        fr.d.text((x * SS, y * SS), s, font=f, fill=tuple(fill[:3]), anchor=anchor, stroke_width=sw * SS, stroke_fill=(10, 10, 12))
        return w
    # Pillow ignores alpha on outlined text: draw it opaque on a small layer, scale that layer's alpha, composite it
    pad = (sw + 4) * SS
    bx0, by0 = int((x0 - sw - 4) * SS), int((y - size) * SS)
    lw, lh = int(w * SS + 2 * pad), int(size * 2 * SS)
    lay = Image.new('RGBA', (lw, lh), (0, 0, 0, 0))
    ImageDraw.Draw(lay).text((x * SS - bx0, y * SS - by0), s, font=f, fill=tuple(fill[:3]) + (255,), anchor=anchor, stroke_width=sw * SS, stroke_fill=(10, 10, 12, 255))
    al = lay.getchannel('A').point(lambda v: int(v * a))
    lay.putalpha(al)
    fr.img.paste(lay, (bx0, by0), lay)
    return w


def captions(fr, words, t, idx, size=88, max_w=860):
    """Word-by-word captions, 2-4 words at a time: white with a black outline, the word being said yellow and lifted."""
    disp = [words[i]['d'] for i in idx]
    rows = B.wrap(disp, size, max_w, 900)
    if len(rows) > 2:
        fr.warnings.append(f'caption needs {len(rows)} lines: "{" ".join(disp)}"')
    cur = max((j for j in range(len(idx)) if words[idx[j]]['s'] - .03 <= t), default=-1)
    k0 = B.clamp((t - (words[idx[0]]['s'] - .08)) / .12)
    lh = size * 1.12
    y0 = CAP_Y - lh * (len(rows) - 1) / 2
    for r, row in enumerate(rows):
        x = 510 - (sum(B.text_w(disp[j], size, 900) for j in row) + GAP * (len(row) - 1)) / 2
        for j in row:
            w = disp[j]
            iscur = j == cur
            lift = 8 * math.exp(-((t - words[idx[j]]['s']) / .12) ** 2) if iscur else 0
            stroke_text(fr, x, y0 + r * lh - lift + (1 - k0) * 30, w, size, YEL if iscur else (255, 255, 255), 'lm', a=k0)
            x += B.text_w(w, size, 900) + GAP


def counter(fr, n, total, label, t, t0, done=False):
    """The progress counter, top left: a black pill "1/3" (pops in on each new setting) and the setting's name; three dots under it."""
    k = B.spring(t - t0, .5, 14) if t >= t0 else 0
    if k <= 0:
        return
    s = .6 + .4 * k
    txt = '✓' if done else f'{n}/{total}'
    w = 150 * s
    fr.rect(72, 262, w, 92 * s, r=24 * s, fill=INK)
    if done:
        fr.line([(72 + w * .3, 262 + 46 * s), (72 + w * .45, 262 + 64 * s), (72 + w * .72, 262 + 28 * s)], YEL, 9)
    else:
        fr.text(72 + w / 2, 262 + 46 * s, txt, int(58 * s), YEL, 900, 'mm')
    a = B.clamp((t - t0 - .05) / .25)
    stroke_text(fr, 72 + 150 + 26 - (1 - a) * 30, 308, label, 54, (255, 255, 255), 'lm', stroke=6, a=a)


def path_card(fr, paths, t, t_in, t_out):
    """Where to find it on both platforms (HUD, over the phone's lower screen): big enough to read (36 px), on for the whole setting."""
    a = ease((t - t_in) / .35) * (1 - ease((t - t_out) / .3))
    if a <= .02:
        return
    x, y, w, h = CARD
    y += (1 - a) * 60
    fr.alpha = a
    fr.rect(x + 4, y + 8, w, h, r=30, fill=(0, 0, 0, 60))
    fr.rect(x, y, w, h, r=30, fill=INK)
    for i, (plat, p) in enumerate(paths[:2]):
        yy = y + 50 + i * 76
        fr.rect(x + 24, yy - 25, 172, 50, r=14, fill=(255, 255, 255, 30))
        fr.text(x + 110, yy, plat, 32, YEL, 800, 'mm')
        fr.text(x + 216, yy, p, 35, (255, 255, 255), 700, 'lm', max_w=w - 236)
    fr.alpha = 1.0


# ---------- the frame ----------
def scene_bg(s):
    return COLORS.get(s.tint, COLORS['blue'])


def transitions(topic, scenes):
    """Declared transitions (Mandatory Gate item 14): the push between settings pages and the colour change between settings."""
    out = []
    for s in scenes:
        out.append([round(s.start - .05, 3), round(s.start + .45, 3), 'slide'])
        if s.kind == 'tap':
            ts = plan(s)
            out += [[round(tt + .1, 3), round(tt + .14 + SLIDE + .05, 3), 'slide'] for tt in ts[:-1]]
    out.append([round(B_DUR[0] - .45, 3), round(B_DUR[0], 3), 'fade'])
    return out + list(topic.get('transitions', []))


def draw(t, topic, vo, hook_out, scenes, chunks):
    # which scene is current, and the colour (crossfades over 0.4 s at each scene start)
    cur = None
    for s in scenes:
        if t >= s.start:
            cur = s
    col = scene_bg(scenes[0])
    for s in scenes:
        if t >= s.start:
            col = B.mixc(col, scene_bg(s), ease((t - s.start) / .4))
    bg2, small = background(t, col)
    world = bg2
    wd = ImageDraw.Draw(world, 'RGBA')
    # the phone rises from its hook place as the first setting starts
    py = PY_HOOK + (PY - PY_HOOK) * ease((t - (hook_out - .4)) / .5)
    # the screen: the hook page, or the current scene's pages (with the slide between pages / scenes)
    scr = Screen()
    hook_pg = topic['hook_page']

    def scene_pages(s, tt):
        if s.kind == 'tap':
            pages, k_pg, slide, ts, taps = scene_state(s, tt)
            last = len(s.params['steps']) - 1
            act_k = B.spring(tt - ts[last], .45, 16) if tt >= ts[last] else 0.0
            return pages, k_pg, slide, ts, act_k
        return [s.params['page']], 0, 1.0, [], 0.0

    def draw_scene_page(s, tt, ox):
        pages, k_pg, slide, ts, act_k = scene_pages(s, tt)
        if s.kind == 'tap':
            last = len(s.params['steps']) - 1
            vis = [(k_pg - 1, -slide * SW * .3), (k_pg, (1 - slide) * SW)] if slide < 1 and k_pg > 0 else [(k_pg, 0.0)]
            for kk, off in vis:
                st = s.params['steps'][kk]
                page(scr, pages[kk], ox + off, tt, act=st['tap'] if kk == last and st.get('action') else None, act_k=act_k if kk == last else 0.0)
        else:
            recap(scr, s, ox, tt)

    if cur is None or t < cur.start + .02:
        page(scr, hook_pg, 0, t, hook_flip=[B.clamp((t - f) / .35) for f in B.HOOK_FLIPS])
    else:
        k = ease((t - cur.start) / .4)
        prev = scenes[scenes.index(cur) - 1] if scenes.index(cur) else None
        if k < 1:   # back to the start page: the old page slides right, the new one comes in from the left
            if prev is None:
                page(scr, hook_pg, k * SW, t, hook_flip=[1, 1, 1])
            else:
                draw_scene_page(prev, t, k * SW)
            draw_scene_page(cur, t, -(1 - k) * SW)
        else:
            draw_scene_page(cur, t, 0)
    # status bar (generic) and the camera island
    scr.text(56, 40, '13:00', 30, INK, 700)
    scr.rect(SW / 2 - 90, 22, 180, 42, r=21, fill=INK)
    for i in range(3):
        scr.rect(SW - 150 + i * 14, 46 - (i + 1) * 7, 10, (i + 1) * 7, r=2, fill=INK)
    scr.rect(SW - 96, 30, 50, 24, r=7, outline=INK, width=2.5)
    scr.rect(SW - 92, 34, 34, 16, r=4, fill=INK)
    if cur is not None and cur.kind == 'tap' and t >= cur.start + .4:
        ts_ = plan(cur)
        result(scr, cur, None, 0, t, ts_[-1])
    # assemble the phone in the world at 2x
    wd.rounded_rectangle([(PX + 10) * SS, (py + 24) * SS, (PX + PW + 10) * SS, (py + 2400) * SS], radius=PR * SS, fill=(0, 0, 0, 70))
    wd.rounded_rectangle([PX * SS, py * SS, (PX + PW) * SS, (py + 2400) * SS], radius=PR * SS, fill=INK)
    wd.rounded_rectangle([(PX + 3) * SS, (py + 3) * SS, (PX + PW - 3) * SS, (py + 2400) * SS], radius=(PR - 3) * SS, outline=(70, 72, 82), width=3 * SS)
    world.paste(scr.img, (int(SX * SS), int((py + BEZ) * SS)), _mask())
    # the camera: one affine zoom of the whole world
    z, fx, fy, dx, dy = zoom_at(t, scenes, hook_out)
    a = 1 / z
    c = SS * (fx - (fx + dx) / z)
    f = SS * (fy - (fy + dy) / z)
    zoomed = world.transform((W * SS, H * SS), Image.AFFINE, (a, 0, c, 0, a, f), resample=Image.BILINEAR, fillcolor=tuple(int(v) for v in col))
    fr = B.Frame(zoomed)
    fr.t, fr.bare = t, small
    T = lambda x, y: (fx + (x - fx) * z + dx, fy + (y - fy) * z + dy)
    # the screen's texts, where the viewer sees them (layout check); hidden under the path card or off screen = not counted
    card_on = cur is not None and cur.kind == 'tap' and cur.start + .5 <= t <= cur.end - .1
    for s_, l, tp, r, b in scr.texts:
        x0, y0 = T(SX + l, py + BEZ + tp)
        x1, y1 = T(SX + r, py + BEZ + b)
        if x1 < SX - 40 or x0 > SX + SW + 40 or y0 > H:
            continue
        if card_on and y1 > CARD[1] - 4:
            continue
        if x0 < T(SX, 0)[0] - 2 or x1 > T(SX + SW, 0)[0] + 2:   # sliding off the screen edge (clipped by the mask)
            continue
        fr.boxes.append((s_, x0, y0, x1, y1, 1.0))
    # the touch indicator
    if cur is not None and cur.kind == 'tap':
        _, _, _, _, taps = scene_state(cur, t)
        finger(fr, [(tt, x, y - PY + py) for tt, x, y in taps], t, z, (fx, fy), (dx, dy))
    # sound events for every element of every scene (make.py collects them while it draws every 0.1 s)
    if B.EVENTS is not None:
        for s in scenes:
            if s.start - .02 <= t <= s.end:
                fr.scene = s
                fr.hit('bg', s.start + .02, 'l' if s.kind != 'tap' else 'm', W / 2, .9)
                fr.hit('counter', s.start + .1, 's', 140)
                if s.kind == 'tap':
                    _, _, _, ts, taps = scene_state(s, t)
                    for i, (tt, x, y) in enumerate(taps):
                        fr.hit(f'tap{i}', tt, 'm', x, 1.1)
                        if i < len(taps) - 1:
                            fr.hit(f'slide{i}', tt + .16, 's', W / 2 + 150, .8)
                    fr.hit('flip', ts[-1] + .06, 'm', taps[-1][1], 1.0)
                    fr.hit('result', ts[-1] + .35, 'l', W / 2, 1.0)
                    fr.hit('card', s.start + .5, 's', W / 2, .8)
                else:
                    for i, it in enumerate(s.params['items']):
                        fr.hit(f'item{i}', s.cue(it.get('cue')), 'm', W / 2, 1.0)
                    fr.hit('stamp', s.cue(s.params.get('stamp_cue')), 'l', W / 2, 1.1)
                fr.scene = None
    # HUD: the hook title, the counter, the path card, the captions
    if t < hook_out + .35:
        ha = 1 - ease((t - (hook_out - .45)) / .3)
        n = 0
        for li, ln in enumerate(topic['hook']):
            y = 330 + li * 124 - (1 - ha) * 60
            ws = ln.split()
            tot = B.text_w(ln, 112, 900)
            x = 510 - tot / 2
            for w in ws:
                tw0 = .05 + n * .07
                pop = 1 + .14 * math.exp(-((t - tw0) / .1) ** 2) if t >= tw0 - .2 else 1.0
                hl = w.isupper() and len(w) > 2
                stroke_text(fr, x + B.text_w(w, 112, 900) / 2, y, w, int(112 * pop), YEL if hl else (255, 255, 255), 'mm', stroke=10, a=ha)
                x += B.text_w(w + ' ', 112, 900)
                n += 1
    taps_sc = [s for s in scenes if s.kind == 'tap']
    if cur is not None:
        if cur.kind == 'tap':
            n = taps_sc.index(cur) + 1
            counter(fr, n, len(taps_sc), cur.params.get('name', cur.label), t, max(cur.start, hook_out + .05))
            path_card(fr, cur.params['paths'], t, cur.start + .5, cur.end - .1)
        else:
            counter(fr, 0, 0, cur.params.get('name', 'SAVE THIS'), t, cur.start, done=True)
    for li, line in enumerate(vo['lines'][1:], start=1):
        nxt = vo['lines'][li + 1]['start'] if li + 1 < len(vo['lines']) else B_DUR[0] - .3
        if line['start'] - .1 <= t < nxt - .1:
            ch = chunks(line, topic['lines'][li].get('chunks'))
            c = 0
            for ci, cc in enumerate(ch):
                if t >= line['words'][cc[0]]['s'] - .08:
                    c = ci
            captions(fr, line['words'], t, ch[c])
    fade = 1 - B.prog(t, B_DUR[0] - .3, B_DUR[0])
    return fr, fr.finish(glow_strength=0.0, fade=fade)


B_DUR = [20.0]   # make.py sets the reel's length


def result(scr, s, pg, ox, t, t_act):
    """The result as a notification banner dropping in at the top of the screen (a phone idiom, visible at any zoom, never under the
    path card): first the old state in red, struck through, then it turns green with a tick and the new state, with a pop."""
    p = s.params
    k1 = B.spring(t - (t_act + .2), .55, 13) if t >= t_act + .2 else 0
    if k1 <= 0:
        return
    k2 = t >= t_act + .85
    pop = 1 + .06 * math.exp(-((t - (t_act + .9)) / .12) ** 2) if k2 else 1.0
    bw, bh = (SW - 40) * pop, 118 * pop
    x0, y0 = ox + SW / 2 - bw / 2, 16 - (1 - k1) * 150
    scr.texts = [b for b in scr.texts if not (b[2] < y0 + bh and b[4] > y0 and b[3] > x0 and b[1] < x0 + bw)]
    scr.rect(x0 + 2, y0 + 8, bw, bh, r=34, fill=(0, 0, 0, 40))
    scr.rect(x0, y0, bw, bh, r=34, fill=GREEN if k2 else (255, 236, 236))
    cx, cy = x0 + 62 * pop, y0 + bh / 2
    if k2:
        scr.circle(cx, cy, 30 * pop, fill=(255, 255, 255))
        tick(scr, cx, cy + 1, .95 * pop, GREEN, 6)
        scr.text(cx + 52 * pop, cy, p['after'], int(46 * pop), (255, 255, 255), 900, 'lm')
    else:
        scr.circle(cx, cy, 30, fill=RED)
        scr.line([(cx - 11, cy - 11), (cx + 11, cy + 11)], (255, 255, 255), 6)
        scr.line([(cx - 11, cy + 11), (cx + 11, cy - 11)], (255, 255, 255), 6)
        w = scr.text(cx + 52, cy, p['before'], 42, RED, 800, 'lm')
        k = B.clamp((t - (t_act + .4)) / .3)
        scr.rect(cx + 50, cy - 2, (w + 4) * k, 6, r=3, fill=RED)


def recap(scr, s, ox, t):
    """The save screen: the three changes as a checklist, each ticking on its word, then a SAVE stamp."""
    p = s.params
    pg = p['page']
    page(scr, dict(pg, rows=[dict(r, chevron=False) for r in pg['rows']]), ox, t)
    for i, it in enumerate(p['items']):
        tc = s.cue(it.get('cue'))
        k = B.spring(t - tc, .5, 15) if t >= tc else 0
        y = row_y(pg, i)
        cx = ox + SW - 78
        if k > 0:
            scr.circle(cx, y, 30 * k, fill=GREEN)
            tick(scr, cx, y + 1, .9 * k, (255, 255, 255), 6)
        else:
            scr.circle(cx, y, 28, outline=(200, 202, 210), width=3)
    ts = s.cue(p.get('stamp_cue'))
    if t >= ts:
        k = B.spring(t - ts, .45, 13)
        y = row_y(pg, len(pg['rows']) - 1) + 150
        w, h = 470 * (1.3 - .3 * k), 104 * (1.3 - .3 * k)
        scr.rect(ox + SW / 2 - w / 2, y - h / 2, w, h, r=24, fill=YEL + (int(255 * min(1, k)),), outline=INK, width=5)
        scr.text(ox + SW / 2, y, p.get('stamp', 'SAVE THIS'), int(54 * (1.3 - .3 * k)), INK, 900, 'mm')
