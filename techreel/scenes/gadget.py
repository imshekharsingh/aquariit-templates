"""The "gadget" look for @techin20sec (13 Nov 2026; topic "look": "gadget"; design/rules-tech.md G1-G8).
Owner, 13 Nov 2026, on the phone walkthrough: make the animation "a similar grade as web" and "more organised, with flow on the screen". The
phone look moved left / centre / right, ran off the foot of the frame, showed content only in the top 40% of its screen, put captions on the
empty phone and a path card over it. This look is one FIXED layout for every scene of every reel:
- a header row at the top (the format pill + a short title, a progress bar under it), never moving;
- the stage (y 392-1262): the drawn product centred and fully inside the frame, its screen filled top to bottom with real content
  (auto-spaced widgets), side callouts in two fixed columns joined to the product by a leader line; a glass test tank for water topics;
- the caption band (y 1300-1500) below the stage, word by word, nothing else in it.
Motion (the web kit's grade, scripts/explainer/kitmotion.js): numbers count up (eased, never past the value said), meters fill segment by
segment on springs, items stagger in, a ripple on the detail being named, the camera leans 7% towards it and back (rules-web.md rule 14:
the camera leads the eye), a slow drift so no frame is still, declared transitions (the screen content slides up between scenes).
Palette = rules-tech.md L7 (near-black, one gold accent, red / green only as small dots). Every frame is a pure function of t."""
import math
import random
from functools import lru_cache

import numpy as np
from PIL import Image, ImageDraw

from . import base as B
from .phonecam import background, stroke_text, YEL, GREEN, RED, TXT, GREY, LINE, CARDBG, EDGE, BG, INK

W, H, SS = B.W, B.H, B.SS
CX = 510                                 # the safe zone's middle
STAGE = (384, 1326)                      # the stage band (y): the world is shown only here (feathered), so nothing reaches the header or captions
PW, PH, PR, BEZ = 400, 816, 62, 12       # the product (a phone): size, corner radius, bezel
PX, PY = CX - PW // 2, 452
SXo, SYo = PX + BEZ, PY + BEZ            # the screen's top left (world px)
SW, SH = PW - 2 * BEZ, PH - 2 * BEZ
TANK = (254, 400, 766, 1312)             # the glass test tank (x0, y0, x1, y1), drawn when the topic has "tank": true
COL_L, COL_R, COL_W = 64, 786, 170       # the callout columns (HUD): left x, right x, width
HEAD_Y = 300                             # the header row's centre line
CAP_Y = 1440                             # the caption band's centre line
ZMAX = 1.06                              # the camera's lean-in (and the stage keeps the whole product inside the frame)
WATER = (104, 134, 164)                  # water: a calm steel blue, low saturation (L7: no saturated fills)
B_DUR = [20.0]


def ease(k):
    return B.ease_io(B.clamp(k))


def eout(k):
    return B.ease_out(B.clamp(k))


# ---------- a drawing surface in world px at 2x that records its text boxes ----------
class Surf:
    def __init__(self, img, ox=0.0, oy=0.0):
        self.img, self.ox, self.oy = img, ox, oy
        self.d = ImageDraw.Draw(img, 'RGBA')
        self.texts = []

    def P(self, x, y):
        return ((x + self.ox) * SS, (y + self.oy) * SS)

    def rect(self, x, y, w, h, r=0, fill=None, outline=None, width=2):
        if w > .5 and h > .5:
            self.d.rounded_rectangle([*self.P(x, y), *self.P(x + w, y + h)], radius=max(0, min(r, w / 2, h / 2)) * SS, fill=fill, outline=outline,
                                     width=max(1, int(width * SS)))

    def circle(self, cx, cy, r, fill=None, outline=None, width=2):
        if r > .3:
            self.d.ellipse([*self.P(cx - r, cy - r), *self.P(cx + r, cy + r)], fill=fill, outline=outline, width=max(1, int(width * SS)))

    def arc(self, cx, cy, r, a0, a1, fill, width):
        if a1 > a0 + .5:
            self.d.arc([*self.P(cx - r, cy - r), *self.P(cx + r, cy + r)], a0, a1, fill=fill, width=max(1, int(width * SS)))

    def line(self, pts, fill, width=4):
        self.d.line([v for p in pts for v in self.P(*p)], fill=fill, width=max(1, int(width * SS)), joint='curve')

    def poly(self, pts, fill=None, outline=None):
        self.d.polygon([v for p in pts for v in self.P(*p)], fill=fill, outline=outline)

    def text(self, x, y, s, size, color=TXT, weight=700, anchor='lm', record=True):
        w = B.text_w(s, size, weight)
        x0 = x - (w / 2 if anchor[0] == 'm' else w if anchor[0] == 'r' else 0)
        self.d.text(self.P(x, y), s, font=B.font(size, weight), fill=color, anchor=anchor)
        if record and (len(color) < 4 or color[3] > 80):
            self.texts.append((s, x0 + self.ox, y - size * .5 + self.oy, x0 + w + self.ox, y + size * .45 + self.oy))
        return w


# ---------- icons (screen px, centred on cx, cy, size s ~ 1 = 64 px box) ----------
def icon(sf, kind, cx, cy, s=1.0, col=TXT, a=255):
    c = tuple(col[:3]) + (a,)
    w = max(3, 5 * s)
    if kind == 'drop':
        pts = [(cx + 22 * s * math.sin(u) * (1 - math.cos(u)) / 2 * 1.6, cy + 6 * s - 24 * s * math.cos(u)) for u in [i * math.pi / 16 for i in range(33)]]
        sf.poly(pts, fill=c)
    elif kind == 'dust':
        for i, (dx, dy, r) in enumerate([(-14, -10, 6), (10, -14, 4), (14, 8, 7), (-8, 14, 5), (0, 0, 4), (-20, 4, 3)]):
            sf.circle(cx + dx * s, cy + dy * s, r * s, fill=c)
    elif kind == 'swim':
        sf.circle(cx + 14 * s, cy - 16 * s, 7 * s, fill=c)
        sf.line([(cx - 22 * s, cy - 2 * s), (cx + 2 * s, cy - 12 * s), (cx + 16 * s, cy - 4 * s)], c, w)
        for k in (8, 20):
            sf.line([(cx - 26 * s + j * 13 * s, cy + k * s + (4 * s if j % 2 else 0)) for j in range(5)], c, w * .8)
    elif kind == 'shower':
        sf.line([(cx - 20 * s, cy - 24 * s), (cx + 6 * s, cy - 24 * s), (cx + 6 * s, cy - 14 * s)], c, w)
        sf.rect(cx - 10 * s, cy - 14 * s, 32 * s, 8 * s, r=4 * s, fill=c)
        for j in range(4):
            sf.line([(cx - 6 * s + j * 9 * s, cy), (cx - 9 * s + j * 9 * s, cy + 20 * s)], c, w * .7)
    elif kind == 'steam':
        for j in range(3):
            x = cx - 14 * s + j * 14 * s
            sf.line([(x, cy + 22 * s), (x - 5 * s, cy + 10 * s), (x + 5 * s, cy - 2 * s), (x - 5 * s, cy - 14 * s), (x, cy - 24 * s)], c, w * .8)
    elif kind == 'cup':
        sf.poly([(cx - 20 * s, cy - 16 * s), (cx + 16 * s, cy - 16 * s), (cx + 11 * s, cy + 20 * s), (cx - 15 * s, cy + 20 * s)], fill=c)
        sf.arc(cx + 16 * s, cy, 10 * s, 270, 450, c, w * .8)
    elif kind == 'seal':
        sf.rect(cx - 16 * s, cy - 26 * s, 32 * s, 52 * s, r=9 * s, outline=c, width=w)
        sf.rect(cx - 22 * s, cy - 32 * s, 44 * s, 64 * s, r=13 * s, outline=tuple(c[:3]) + (int(a * .45),), width=w * .6)
    elif kind == 'timer':
        sf.circle(cx, cy + 3 * s, 21 * s, outline=c, width=w)
        sf.line([(cx, cy + 3 * s), (cx, cy - 9 * s)], c, w)
        sf.rect(cx - 6 * s, cy - 27 * s, 12 * s, 6 * s, r=2 * s, fill=c)
    elif kind == 'depth':
        sf.line([(cx, cy - 24 * s), (cx, cy + 18 * s)], c, w)
        sf.poly([(cx - 10 * s, cy + 12 * s), (cx + 10 * s, cy + 12 * s), (cx, cy + 26 * s)], fill=c)
        for j in range(3):
            sf.line([(cx - 18 * s, cy - 16 * s + j * 12 * s), (cx - 8 * s, cy - 16 * s + j * 12 * s)], c, w * .6)


def tick(sf, cx, cy, s, col, width=5):
    sf.line([(cx - 13 * s, cy), (cx - 4 * s, cy + 10 * s), (cx + 14 * s, cy - 11 * s)], col, width)


# ---------- screen widgets (screen-local px; each one: height, draw(sf, w, y0, k, t, sc)) ----------
HEIGHTS = {'title': 64, 'spec': 196, 'meter': 132, 'row': 112, 'count': 196, 'ring': 236, 'drain': 132, 'note': 70}


def widget_times(sc, widgets, t_in):
    """Each widget's entrance (staggered from the scene's start, 0.09 s apart, so the screen is full at once: owner, 13 Nov 2026, "no
    half-empty screens") and its activation (its cue word: it lights up, fills, ticks or counts), as [(te, ta)]."""
    out = []
    for i, wd in enumerate(widgets):
        if sc is None:
            out.append((-5.0, -5.0))
        else:
            te = t_in + .07 * i
            out.append((te, sc.cue(wd['cue'], wd.get('nth', 1)) if wd.get('cue') else te + .15))
    return out


def layout(widgets):
    """Fills the screen top to bottom (owner, 13 Nov 2026: "no half-empty screens"): the free height is shared as gaps between widgets."""
    hs = [wd.get('h', HEIGHTS[wd['type']]) for wd in widgets]
    top, bot = 70, SH - 22
    grow = [i for i, wd in enumerate(widgets) if wd['type'] in ('row', 'spec', 'count', 'note')]
    extra = (bot - top - sum(hs)) - 34 * (len(hs) + 1)
    if extra > 0 and grow:   # fill the screen: rows, specs and counts take the spare height (no empty foot)
        for i in grow:
            hs[i] += extra / len(grow)
    gap = max(8, (bot - top - sum(hs)) / (len(hs) + 1))
    ys, y = [], top + gap
    if sum(hs) + gap * (len(hs) + 1) > bot - top:
        gap = max(8, (bot - top - sum(hs)) / max(1, len(hs) - 1)); y = top
    for h in hs:
        ys.append(y)
        y += h + gap
    return ys, hs


def draw_widget(sf, wd, y0, h, t, tt, sc, xoff=0.0):
    """One widget at screen y0. tt = (te, ta): its entrance (k, a spring: it rises 34 px and fades in) and its activation (until its
    cue word a widget with a cue waits dimmed; on the word it lights up)."""
    te, ta = tt
    k = 1.0 if te < -1 else (B.spring(t - te, .62, 15) if t >= te else 0.0)
    if k <= .01:
        return
    act = t >= ta
    dimmed = wd.get('cue') and not act and sc is not None
    a = B.clamp(k * 1.4) * (.62 if dimmed else 1.0)
    if wd.get('cue') and act and sc is not None:
        a = B.clamp(k * 1.4) * (.62 + .38 * B.clamp((t - ta) / .18))
    oy = (1 - min(1.0, k)) * 34
    y0 = y0 + oy
    A = lambda col, m=1.0: tuple(col[:3]) + (int(255 * a * m),)
    x0, w = 24 + xoff, SW - 48
    te = ta   # fills, dots and counts start on the activation
    typ = wd['type']
    hl = wd.get('hi_cue')   # the detail being named: a gold edge and one ripple at its word
    th = sc.cue(hl) if (hl and sc is not None) else None
    if typ == 'title':
        sub = wd.get('sub')
        fits = not sub or B.text_w(wd['text'], 34, 800) + B.text_w(sub, 26, 600) + 24 <= w
        sf.text(x0 + 4, y0 + (h / 2 if fits else h / 2 - 16), wd['text'], 34, A(YEL if wd.get('gold') else GREY), 800)
        if sub:
            sf.text(x0 + w if fits else x0 + 4, y0 + (h / 2 if fits else h / 2 + 22), sub, 26, A(GREY), 600, 'rm' if fits else 'lm')
    elif typ == 'spec':
        # the spec, big: each character its own glyph, the named one gold with a pulse
        s, size = wd['text'], wd.get('size', 132)
        cw = [B.text_w(ch, size, 900) for ch in s]
        x = x0 + w / 2 - sum(cw) / 2
        his = wd.get('hi', [])
        for i, ch in enumerate(s):
            on = i in his and (th is None or t >= th - .05)
            dim = bool(his) and i not in his and wd.get('dim_others', True)
            pk = math.exp(-((t - th) / .14) ** 2) if (on and th is not None) else 0
            sz = int(size * (1 + .16 * pk))
            col = YEL if on else (GREY if dim else TXT)
            sf.text(x + cw[i] / 2, y0 + h * .48 - pk * 8, ch, sz, A(col), 900, 'mm')
            if on and th is not None and 0 <= t - th < .7:
                r = cw[i] * .55 + 120 * (t - th) / .7
                sf.circle(x + cw[i] / 2, y0 + h * .48, r, outline=YEL + (int(200 * (1 - (t - th) / .7) * a),), width=4)
            x += cw[i]
        if wd.get('label'):
            sf.text(x0 + w / 2, y0 + h - 14, wd['label'], 28, A(GREY), 700, 'mm')
    elif typ == 'meter':
        # a segment meter that fills one segment at a time on springs, its number counting with it
        n, of = wd['n'], wd.get('of', wd['n'])
        tf = te + .15
        sf.rect(x0, y0, w, h, r=22, fill=A((26, 26, 30)), outline=A(EDGE) if th is None or t < th else A(YEL), width=2 if th is None or t < th else 3)
        if wd.get('icon'):
            icon(sf, wd['icon'], x0 + 44, y0 + 40, .62, TXT, int(255 * a))
        sf.text(x0 + (78 if wd.get('icon') else 22), y0 + 40, wd['label'], 32, A(TXT), 800)
        lit = sum(1 for i in range(n) if t >= tf + .09 * i)
        sf.text(x0 + w - 22, y0 + 40, str(lit), 44, A(YEL), 900, 'rm')
        gw = (w - 44 - 8 * (of - 1)) / of
        for i in range(of):
            sx, sy = x0 + 22 + i * (gw + 8), y0 + 80
            sf.rect(sx, sy, gw, 30, r=8, fill=A((52, 52, 58)))
            if i < n and t >= tf + .09 * i:
                kk = B.spring(t - (tf + .09 * i), .5, 18)
                hh = 30 * min(1.15, kk)
                sf.rect(sx, sy + 30 - hh, gw, hh, r=8, fill=A(YEL))
            pt = wd.get('pulse')   # a light wave running along the lit segments (the hook's meters, each with its tick)
            if pt is not None and 0 <= t - pt - .06 * i < .35:
                q = (t - pt - .06 * i) / .35
                sf.rect(sx - 3, sy - 3, gw + 6, 36, r=9, fill=(255, 246, 220, int(200 * (1 - q) * a)))
    elif typ == 'row':
        sf.rect(x0, y0, w, h, r=24, fill=A((30, 30, 34)), outline=A(YEL) if th is not None and t >= th else None, width=3)
        sf.rect(x0 + 16, y0 + h / 2 - 34, 68, 68, r=18, fill=A((52, 52, 60)))
        icon(sf, wd.get('icon', 'drop'), x0 + 50, y0 + h / 2, .8, TXT, int(255 * a))
        tsz = 38
        while tsz > 26 and B.text_w(wd['text'], tsz, 800) > w - 102 - (56 if wd.get('dot') else 16):
            tsz -= 1
        sf.text(x0 + 102, y0 + h / 2 - (16 if wd.get('sub') else 0), wd['text'], tsz, A(TXT), 800)
        if wd.get('sub'):
            sf.text(x0 + 102, y0 + h / 2 + 24, wd['sub'], 26, A(GREY), 600)
        dot = wd.get('dot')
        if dot:
            dk = B.spring(t - (te + .2), .5, 16) if t >= te + .2 else 0
            col = GREEN if dot == 'green' else RED
            sf.circle(x0 + w - 34, y0 + h / 2, 13 * dk, fill=A(col))
            if dot == 'green' and dk > .5:
                tick(sf, x0 + w - 34, y0 + h / 2 + 1, .45, A((255, 255, 255)), 4)
        if th is not None and 0 <= t - th < .6:
            q = (t - th) / .6
            sf.rect(x0 - 10 * q, y0 - 10 * q, w + 20 * q, h + 20 * q, r=24 + 10 * q, outline=YEL + (int(180 * (1 - q) * a),), width=3)
    elif typ == 'count':
        # a big number counting up to the value said (eased, never past it), its unit and label
        v, dec = wd['value'], wd.get('dec', 0)
        tc = sc.cue(wd['count_cue']) if (sc is not None and wd.get('count_cue')) else te
        kv = eout((t - tc) / wd.get('secs', .9)) if t >= tc else 0.0
        val = v * kv
        s = (f'{val:.{dec}f}' if dec else str(int(math.floor(val + 1e-6)))) if t >= tc else '–'
        unit = wd.get('unit', '')
        sz = wd.get('size', 120)
        pk = math.exp(-((t - (tc + wd.get('secs', .9))) / .12) ** 2) if t >= tc else 0
        tw = B.text_w(s, sz, 900) + (B.text_w(' ' + unit, 48, 800) if unit else 0)
        xs = x0 + w / 2 - tw / 2
        sf.text(xs, y0 + h * .44, s, int(sz * (1 + .06 * pk)), A(YEL if kv >= 1 else TXT), 900)
        if unit:
            sf.text(xs + B.text_w(s, sz, 900) + B.text_w(' ', 48, 800), y0 + h * .44 + sz * .16, unit, 48, A(TXT), 800)
        if wd.get('label'):
            sf.text(x0 + w / 2, y0 + h - 18, wd['label'], 28, A(GREY), 700, 'mm')
    elif typ == 'ring':
        v = wd['value']
        tc = sc.cue(wd['count_cue']) if (sc is not None and wd.get('count_cue')) else te
        kv = eout((t - tc) / wd.get('secs', 1.0)) if t >= tc else 0.0
        cx, cy, r = x0 + w / 2, y0 + h / 2 - 8, 96
        sf.circle(cx, cy, r, outline=A((52, 52, 58)), width=16)
        sf.arc(cx, cy, r, -90, -90 + 360 * kv, A(YEL), 16)
        if kv > 0:
            ang = math.radians(-90 + 360 * kv)
            sf.circle(cx + r * math.cos(ang), cy + r * math.sin(ang), 11, fill=A((255, 240, 200)))
        sf.text(cx, cy - 8, str(int(math.floor(v * kv + 1e-6))) if t >= tc else '–', 82, A(YEL if kv >= 1 else TXT), 900, 'mm')
        sf.text(cx, cy + 50, wd.get('unit', ''), 32, A(GREY), 800, 'mm')
        if wd.get('label'):
            sf.text(cx, y0 + h - 4, wd['label'], 28, A(GREY), 700, 'mm')
    elif typ == 'drain':
        # a bar that starts full and drains on its word (a spring with no overshoot past the end value)
        td = sc.cue(wd['drain_cue']) if (sc is not None and wd.get('drain_cue')) else te + .6
        kd = ease((t - td) / 1.4) if t >= td else 0.0
        lvl = 1 - (1 - wd.get('to', .45)) * kd
        sf.rect(x0, y0, w, h, r=22, fill=A((26, 26, 30)), outline=A(EDGE), width=2)
        if wd.get('icon'):
            icon(sf, wd['icon'], x0 + 44, y0 + 40, .55, TXT, int(255 * a))
        sf.text(x0 + (78 if wd.get('icon') else 22), y0 + 40, wd['label'], 32, A(TXT), 800)
        sf.rect(x0 + 22, y0 + 82, w - 44, 26, r=13, fill=A((52, 52, 58)))
        sf.rect(x0 + 22, y0 + 82, (w - 44) * lvl * min(1.0, k), 26, r=13, fill=A(B.mixc(YEL, (150, 150, 158), kd)))
        if kd > 0 and kd < 1:   # flakes falling off the bar's end as it drains
            ex = x0 + 22 + (w - 44) * lvl
            for j in range(3):
                q = ((t - td) * 2.2 + j / 3) % 1
                sf.circle(ex - 6 + j * 4, y0 + 95 + q * 34, 4 * (1 - q), fill=A(YEL, 1 - q))
    elif typ == 'note':
        sf.text(x0 + w / 2, y0 + h / 2, wd['text'], wd.get('size', 34), A(YEL if wd.get('gold') else TXT), 800, 'mm')


def screen_content(sf, widgets, sc, t, t_in, xoff=0.0, yoff=0.0, alpha=1.0):
    ys, hs = layout(widgets)
    tes = widget_times(sc, widgets, t_in)
    for wd, y, h, tt in zip(widgets, ys, hs, tes):
        draw_widget(sf, wd, y + yoff, h, t, tt, sc, xoff)


# ---------- timing helpers ----------
def cue_t(sc, c, default=None):
    if c is None:
        return default if default is not None else sc.start + .3
    if isinstance(c, (int, float)):
        return sc.start + c
    return sc.cue(c)


def water_level(t, topic, scenes):
    """The tank's water level (0 = empty, 1 = the product's top) as a function of t: keyframes from the topic ("water0" at frame 0) and
    each scene's "water" [{cue, level}], eased over 0.8 s."""
    keys = [(-1.0, topic.get('water0', 0.0))]
    for s in scenes:
        for wk in s.params.get('water', []):
            keys.append((cue_t(s, wk.get('cue'), s.start + .05), wk['level']))
    keys.sort()
    lv = keys[0][1]
    for tk, l in keys[1:]:
        if t >= tk:
            lv = lv + (l - lv) * ease((t - tk) / .8)
    return lv


def water_events(topic, scenes):
    out = []
    for s in scenes:
        for wk in s.params.get('water', []):
            out.append((s, cue_t(s, wk.get('cue'), s.start + .05)))
    return out


# ---------- the camera ----------
def camera(t, scenes):
    """Zoom z around F, plus a slow drift: the camera leans 7% towards the detail being named (a scene's "focus": {cue, y} in screen px,
    or x/y in world px) for about 1.6 s and back, and the product never leaves the stage."""
    best, fx, fy = 0.0, CX, (PY + PY + PH) / 2
    for s in scenes:
        f = s.params.get('focus')
        if not f or not (s.start - .5 <= t <= s.end + .8):
            continue
        tf = cue_t(s, f.get('cue'))
        hold = f.get('hold', 1.6)
        e = ease((t - (tf - .35)) / .45) * (1 - ease((t - (tf + hold)) / .6))
        if e > best:
            best = e
            fx = f.get('x', CX)
            if 'w' in f:   # a screen widget by index: its centre
                ys, hs = layout(s.params['screen'])
                fy = SYo + ys[f['w']] + hs[f['w']] / 2
            else:
                fy = f['wy'] if 'wy' in f else SYo + f.get('y', SH / 2)
    z = 1 + (ZMAX - 1) * best + .012 * math.sin(t * .9)
    fx = CX + (fx - CX) * best
    fy = (PY + PH / 2) + (fy - (PY + PH / 2)) * best
    dx = 14 * math.cos(t * .62) + 4 * math.sin(t * 1.3 + 2)   # an orbit: the camera's speed never drops to zero
    dy = 14 * math.sin(t * .62) + 4 * math.sin(t * 1.1)
    # keep the whole product inside the stage after the zoom (the tank's glass may meet the stage's feathered edge)
    y0, y1 = PY - 8, PY + PH + 26
    top, bot = fy + (y0 - fy) * z + dy, fy + (y1 - fy) * z + dy
    if top < STAGE[0] + 4:
        dy += STAGE[0] + 4 - top
    elif bot > STAGE[1] - 4:
        dy -= bot - STAGE[1] + 4
    return z, fx, fy, dx, dy


# ---------- the world: tank, product, screen, water, particles ----------
@lru_cache(maxsize=None)
def _mask():
    m = Image.new('L', (SW * SS, SH * SS), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, SW * SS - 1, SH * SS - 1], radius=(PR - BEZ) * SS, fill=255)
    return m


@lru_cache(maxsize=None)
def _stage_mask():
    """The world shows only in the stage band, feathered over 24 px: a zoom never pushes anything under the header or the captions."""
    yy = np.arange(H * SS) / SS
    col = np.clip(np.minimum((yy - (STAGE[0] - 12)) / 24, ((STAGE[1] + 12) - yy) / 24), 0, 1)
    return Image.fromarray((np.repeat(col[:, None], W * SS, 1) * 255).astype(np.uint8), 'L')


MOTES = [(80 + (i * 379) % 860, (i * 613) % 900, 3 + i % 4, .9 + (i % 4) * .4, i * 1.7) for i in range(34)]
BUBBLES = [(random.Random(i).uniform(TANK[0] + 24, TANK[2] - 24), random.Random(i * 7 + 1).uniform(0, 1), random.Random(i * 13 + 2).uniform(.35, .8),
            random.Random(i * 5 + 3).uniform(4, 11)) for i in range(26)]
DUST = [(random.Random(100 + i).choice([-1, 1]), random.Random(200 + i).uniform(0, 1), random.Random(300 + i).uniform(.5, .95), random.Random(400 + i).uniform(3, 6))
        for i in range(18)]


def status_bar(sf):
    sf.text(40, 34, '13:00', 24, TXT, 700, record=False)
    sf.rect(SW / 2 - 56, 16, 112, 32, r=16, fill=(0, 0, 0))
    for i in range(3):
        sf.rect(SW - 116 + i * 11, 40 - (i + 1) * 6, 8, (i + 1) * 6, r=2, fill=TXT)
    sf.rect(SW - 74, 24, 40, 19, r=6, outline=TXT, width=2)
    sf.rect(SW - 71, 27, 28, 13, r=3, fill=TXT)


def rrect_path(x, y, w, h, r, n=160):
    """Points round a rounded rectangle, clockwise from the top centre, evenly spaced (the seal's trace)."""
    segs = []
    for cx, cy, a0 in ((x + w - r, y + r, -90), (x + w - r, y + h - r, 0), (x + r, y + h - r, 90), (x + r, y + r, 180)):
        segs.append([(cx + r * math.cos(math.radians(a0 + 90 * j / 12)), cy + r * math.sin(math.radians(a0 + 90 * j / 12))) for j in range(13)])
    pts = [(x + w / 2, y)] + [p for sg in segs for p in sg] + [(x + w / 2, y)]
    d = [0.0]
    for a, b in zip(pts, pts[1:]):
        d.append(d[-1] + math.dist(a, b))
    out, j = [], 0
    for i in range(n + 1):
        L = d[-1] * i / n
        while j < len(d) - 2 and d[j + 1] < L:
            j += 1
        k = (L - d[j]) / max(1e-6, d[j + 1] - d[j])
        out.append((pts[j][0] + (pts[j + 1][0] - pts[j][0]) * k, pts[j][1] + (pts[j + 1][1] - pts[j][1]) * k))
    return out


def draw_world(t, topic, scenes, hook_out, cur):
    bg2, small = background(t, BG)
    world = bg2
    wf = Surf(world)
    for mx, my, r, sp, ph in MOTES:   # warm motes drifting up behind the product: the air is never still
        x = mx + 18 * math.sin(t * .7 + ph)
        y = STAGE[1] - ((t * 40 * sp + my) % (STAGE[1] - STAGE[0]))
        wf.circle(x, y, r, fill=(255, 226, 170, int(90 + 50 * math.sin(t * 1.6 + ph))))
    lv = water_level(t, topic, scenes)
    x0, y0, x1, y1 = TANK
    tank = topic.get('tank', False)
    if tank:   # the back wall of the glass tank: a faint pane and a floor shadow
        wf.rect(x0, y0, x1 - x0, y1 - y0, r=34, fill=(255, 255, 255, 8), outline=(255, 255, 255, 34), width=2)
    # the product's shadow and body
    wf.rect(PX + 14, PY + 26, PW, PH, r=PR, fill=(0, 0, 0, 120))
    wf.rect(PX, PY, PW, PH, r=PR, fill=(28, 28, 32))
    wf.rect(PX + 3, PY + 3, PW - 6, PH - 6, r=PR - 3, outline=(96, 96, 106), width=3)
    for yy in (PY + 170, PY + 260):   # the side buttons
        wf.rect(PX + PW - 1, yy, 6, 70, r=3, fill=(70, 70, 78))
    wf.rect(PX + PW / 2 - 34, PY + PH - 10, 68, 6, r=3, fill=(14, 14, 16))   # the port
    # the screen: the hook's widgets, then each scene's, sliding up between scenes (a declared transition)
    scr = Image.new('RGB', (SW * SS, SH * SS), (8, 8, 10))
    sf = Surf(scr)
    ci = scenes.index(cur) if cur is not None else -1
    if cur is None:
        screen_content(sf, topic['hook_screen'], None, t, 0)
    else:
        k = ease((t - cur.start) / .45)
        if k < 1:
            prev_w = topic['hook_screen'] if ci == 0 else scenes[ci - 1].params['screen']
            prev_sc = None if ci == 0 else scenes[ci - 1]
            sub = Surf(Image.new('RGBA', (SW * SS, SH * SS), (0, 0, 0, 0)))
            screen_content(sub, prev_w, prev_sc, t, 0 if prev_sc is None else prev_sc.start + .3, yoff=-90 * k)
            al = sub.img.getchannel('A').point(lambda v: int(v * (1 - k) ** 1.5))
            sub.img.putalpha(al)
            scr.paste(sub.img, (0, 0), sub.img)
        screen_content(sf, cur.params['screen'], cur, t, cur.start + .1)
    sf.texts = [b for b in sf.texts]
    status_bar(sf)
    # a faint glass reflection sweeping the screen once per scene (life in every hold)
    for j in range(2):   # two soft light bands crossing the glass, 1.6 s apart: the screen is never a still picture
        sweep = (t / 3.2 + j * .5) % 1
        hx = -260 + (SW + 520) * sweep
        for w_, al in ((150, 6), (90, 8), (40, 10)):
            sf.poly([(hx - w_ / 2, 0), (hx + w_ / 2, 0), (hx + w_ / 2 - 200, SH), (hx - w_ / 2 - 200, SH)], fill=(255, 255, 255, al))
    world.paste(scr, (int(SXo * SS), int(SYo * SS)), _mask())
    texts = [(s, l + SXo, tp + SYo, r + SXo, b + SYo) for s, l, tp, r, b in sf.texts]
    # the seal: a gold line traced round the product, then wearing away (scene param "seal": {draw, wear})
    for s in scenes:
        se = s.params.get('seal')
        if se and t >= s.start - .1 and (s is cur):
            td, tw = cue_t(s, se.get('draw')), cue_t(s, se.get('wear'))
            kd = eout((t - td) / .8) if t >= td else 0
            kw = ease((t - tw) / 1.4) if t >= tw else 0
            per = rrect_path(PX - 9, PY - 9, PW + 18, PH + 18, PR + 9)
            n = len(per) - 1
            m = int(n * kd)
            for i in range(m):
                gap = kw > 0 and (i * 7919 % 13) / 13 < kw * .65
                if not gap:
                    wf.line([per[i], per[i + 1]], B.mixc(YEL, (110, 110, 118), kw) + (int(255 * (1 - .35 * kw)),), 6)
            if 0 < kd < 1:
                hx_, hy_ = per[m]
                wf.circle(hx_, hy_, 12, fill=YEL + (200,))
    # dust (scene param "dust": cue): specks fly at the product and bounce off its sides, a small flash where each hits
    for s in scenes:
        dc = s.params.get('dust')
        if dc is None or not (s.start - .1 <= t <= s.end + .5):
            continue
        td = cue_t(s, dc)
        for i, (side, ph, sp, r) in enumerate(DUST):
            t0 = td + ph * 1.6
            if t < t0:
                continue
            q = (t - t0) * sp
            ey = PY + 120 + (i * 97 % (PH - 240))
            wall = PX - 8 if side < 0 else PX + PW + 8
            start = TANK[0] + 20 if side < 0 else TANK[2] - 20
            if q < .5:
                x = start + (wall - start) * (q / .5)
                y = ey - 40 + 40 * q / .5
            else:
                qq = (q - .5) / .7
                x = wall + (start - wall) * qq * .8
                y = ey + 60 * qq * qq
                if qq < .35:
                    wf.circle(wall, ey, 10 + 30 * qq / .35, outline=(255, 240, 210, int(160 * (1 - qq / .35))), width=2)
            al = int(220 * B.clamp(1.6 - q))
            if al > 4:
                wf.circle(x, y, r, fill=(196, 186, 168, al))
    # water in the tank, in front of the product (a translucent steel blue), with a moving surface and bubbles
    if tank and lv > .005:
        top_y = PY + PH - lv * PH
        top_y = max(y0 + 18, top_y)
        pts = [(x0 + 3, y1 - 3)]
        for i in range(41):
            x = x0 + 3 + (x1 - x0 - 6) * i / 40
            pts.append((x, top_y + 7 * math.sin(x * .025 + t * 3.1) + 4 * math.sin(x * .061 - t * 2.3)))
        pts.append((x1 - 3, y1 - 3))
        wf.poly(pts, fill=WATER + (58,))
        wf.line(pts[1:-1], (200, 218, 236, 150), 3)
        for bx, ph, sp, br in BUBBLES:
            q = (t * sp * .45 + ph) % 1
            by = y1 - 20 - q * (y1 - 20 - top_y)
            if by > top_y + 12:
                wf.circle(bx + 8 * math.sin(t * 2 + ph * 9), by, br, outline=(220, 232, 244, int(150 * (1 - q * .6))), width=2)
    if tank:   # the front glass: a lit rim and a soft vertical highlight
        wf.rect(x0, y0, x1 - x0, y1 - y0, r=34, outline=(255, 255, 255, 60), width=3)
        wf.rect(x0 + 18, y0 + 30, 10, y1 - y0 - 60, r=5, fill=(255, 255, 255, 22))
        ruler = None
        for s in scenes:
            if s is cur and s.params.get('ruler'):
                ruler = s
        if ruler is not None:   # depth ticks on the right wall, drawn top to bottom on the word
            tr = cue_t(ruler, ruler.params['ruler'])
            kr = eout((t - tr) / .8) if t >= tr else 0
            for j in range(13):
                yy = y0 + 40 + j * (y1 - y0 - 80) / 12
                if j / 12 <= kr:
                    wf.line([(x1 - 4, yy), (x1 - (30 if j % 2 == 0 else 18), yy)], (230, 230, 236, 170), 3)
    # splash (scene param "splash": cue): drops arc in from the upper left and bead on the glass
    for s in scenes:
        sp_ = s.params.get('splash')
        if sp_ is None or not (s.start <= t <= s.end + .3):
            continue
        ts_ = cue_t(s, sp_)
        for i in range(9):
            rr = random.Random(500 + i)
            t0 = ts_ + rr.uniform(0, .22)
            if t < t0:
                continue
            q = min(1.0, (t - t0) / .42)
            tx, ty = PX + 30 + i * (PW - 60) / 8, PY + rr.uniform(30, 170)
            sx, sy = tx - 300 + i * 20, ty - 260
            x = sx + (tx - sx) * q
            y = sy + (ty - sy) * q - 110 * math.sin(math.pi * q)
            r = rr.uniform(11, 17)
            al = 1 - B.clamp((t - t0 - 1.6) / .6)
            if al <= 0:
                continue
            if q >= 1:   # beads that run down the glass, leaving a thin trail
                run = (t - t0 - .42) * rr.uniform(70, 150)
                wf.line([(x, y), (x, y + run)], (200, 222, 244, int(70 * al)), 5)
                y += run
            wf.poly([(x - r, y), (x, y - r * 1.9), (x + r, y)], fill=WATER + (int(200 * al),))
            wf.circle(x, y, r, fill=WATER + (int(200 * al),))
            wf.circle(x - r * .35, y - r * .3, r * .32, fill=(255, 255, 255, int(200 * al)))
    return world, small, texts, lv


# ---------- HUD: header, callouts, captions ----------
def header(fr, topic, scenes, hook_out, t):
    """The header row, the same in every frame: the format pill (gold), the short title, and a progress bar (one segment per scene)."""
    fmt = topic.get('format', 'SPECS DECODED')
    pw = B.text_w(fmt, 30, 900) + 44
    fr.rect(64, HEAD_Y - 34, pw, 68, r=34, fill=CARDBG, outline=YEL, width=3)
    fr.text(64 + pw / 2, HEAD_Y, fmt, 30, YEL, 900, 'mm')
    fr.text(64 + pw + 24, HEAD_Y, topic.get('header', ''), 46, (255, 255, 255), 900, 'lm', max_w=960 - (64 + pw + 24))
    n = len(scenes) + 1
    gw = (896 - 8 * (n - 1)) / n
    spans = [(0, hook_out)] + [(s.start, s.end) for s in scenes]
    for i, (a, b) in enumerate(spans):
        x = 64 + i * (gw + 8)
        fr.rect(x, 356, gw, 8, r=4, fill=(52, 52, 58))
        k = B.clamp((t - a) / max(.1, b - a))
        if k > 0:
            fr.rect(x, 356, gw * k, 8, r=4, fill=YEL)


def callouts(fr, cur, t, T):
    """Side callouts (HUD, two fixed columns): a card with a big value (it may count up) and a small label, a leader line to the detail
    on the product with a dot and one ripple. Param "callouts": [{side, y, big, small, cue, anchor: [x, y] world, count?: {to, dec, unit}}]."""
    if cur is None:
        return
    for i, c in enumerate(cur.params.get('callouts', [])):
        tc = cue_t(cur, c.get('cue'), cur.start + .4 + .15 * i)
        k = B.spring(t - tc, .6, 14) if t >= tc else 0
        if k <= .01:
            continue
        a = B.clamp(k * 1.5) * (1 - ease((t - (cur.end - .3)) / .3))
        if a <= .02:
            continue
        left = c['side'] == 'left'
        x = COL_L if left else COL_R
        y = c['y'] + (1 - min(1.0, k)) * 30
        h = 150 if c.get('small') else 110
        fr.rect(x, y, COL_W, h, r=26, fill=CARDBG + (int(240 * a),), outline=YEL + (int(255 * a),) if c.get('gold') else EDGE + (int(255 * a),), width=3 if c.get('gold') else 2)
        big = c.get('big', '')
        if c.get('count'):
            cc = c['count']
            kv = eout((t - tc) / cc.get('secs', .9))
            v = cc['to'] * kv
            big = (f"{v:.{cc['dec']}f}" if cc.get('dec') else str(int(math.floor(v + 1e-6)))) + cc.get('unit', '')
        fr.text(x + COL_W / 2, y + 56, big, c.get('size', 60), YEL + (int(255 * a),) if c.get('gold') else (255, 255, 255, int(255 * a)), 900, 'mm', max_w=COL_W - 16)
        if c.get('small'):
            ssz = 26
            while ssz > 18 and B.text_w(c['small'], ssz, 700) > COL_W - 20:
                ssz -= 1
            fr.text(x + COL_W / 2, y + 112, c['small'], ssz, (170, 170, 178, int(255 * a)), 700, 'mm', max_w=COL_W - 16)
        # the leader line, drawn out from the card to the detail
        ax, ay = T(*c['anchor'])
        sx, sy = (x + COL_W, y + h / 2) if left else (x, y + h / 2)
        kl = eout((t - tc - .1) / .35)
        ex, ey = sx + (ax - sx) * kl, sy + (ay - sy) * kl
        fr.line([(sx, sy), (ex, ey)], YEL + (int(200 * a),), 3)
        if kl >= 1:
            fr.circle(ax, ay, 9, fill=YEL + (int(255 * a),))
            q = (t - tc - .45) / .6
            if 0 <= q < 1:
                fr.circle(ax, ay, 12 + 40 * q, outline=YEL + (int(200 * (1 - q) * a),), width=3)


def captions(fr, words, t, idx, size=80, max_w=880, key=None, instant=False):
    """Word-by-word captions in their own band: white with a black outline, the spoken word gold and lifted (rules-tech.md L5)."""
    disp = [words[i]['d'] for i in idx]
    rows = B.wrap(disp, size, max_w, 900)
    if len(rows) > 2:
        fr.warnings.append(f'caption needs {len(rows)} lines: "{" ".join(disp)}"')
    cur = max((j for j in range(len(idx)) if words[idx[j]]['s'] - .03 <= t), default=-1)
    k0 = 1.0 if instant else B.clamp((t - (words[idx[0]]['s'] - .1)) / .14)
    lh = size * 1.14
    y0 = CAP_Y - lh * (len(rows) - 1) / 2
    gap = 24
    for r, row in enumerate(rows):
        x = CX - (sum(B.text_w(disp[j], size, 900) for j in row) + gap * (len(row) - 1)) / 2
        for j in row:
            w = disp[j]
            iscur = j == cur
            gold = iscur or (key and w.strip('?,.!') == key)
            lift = 7 * math.exp(-((t - words[idx[j]]['s']) / .12) ** 2) if iscur else 0
            stroke_text(fr, x, y0 + r * lh - lift + (1 - k0) * 24, w, size, YEL if gold else (255, 255, 255), 'lm', a=k0)
            x += B.text_w(w, size, 900) + gap


# ---------- the frame ----------
def transitions(topic, scenes):
    """Declared transitions (Mandatory Gate item 14): the screen content sliding up into each scene, and the end fade."""
    out = [[round(s.start - .05, 3), round(s.start + .5, 3), 'slide'] for s in scenes]
    out.append([round(B_DUR[0] - .45, 3), round(B_DUR[0], 3), 'fade'])
    return out + list(topic.get('transitions', []))


def draw(t, topic, vo, hook_out, scenes, chunks):
    cur = None
    for s in scenes:
        if t >= s.start:
            cur = s
    world, small, texts, lv = draw_world(t, topic, scenes, hook_out, cur)
    z, fx, fy, dx, dy = camera(t, scenes)
    a = 1 / z
    c = SS * (fx - (fx + dx) / z)
    f = SS * (fy - (fy + dy) / z)
    zoomed = world.transform((W * SS, H * SS), Image.AFFINE, (a, 0, c, 0, a, f), resample=Image.BILINEAR, fillcolor=BG)
    bg_only, _ = background(t, BG)
    bg_only.paste(zoomed, (0, 0), _stage_mask())
    zoomed = bg_only
    fr = B.Frame(zoomed)
    fr.t, fr.bare = t, small
    T = lambda x, y: (fx + (x - fx) * z + dx, fy + (y - fy) * z + dy)
    for s_, l, tp, r, b in texts:
        x0, y0 = T(l, tp)
        x1, y1 = T(r, b)
        fr.boxes.append((s_, x0, y0, x1, y1, 1.0))
    # element sounds (make.py collects them every 0.1 s): every widget's entrance, the named detail, counts landing, meters, callouts, water
    if B.EVENTS is not None:
        for s in scenes:
            if not (s.start - .02 <= t <= s.end):
                continue
            fr.scene = s
            fr.hit('slide', s.start + .05, 'm', W / 2, .9)
            tes = widget_times(s, s.params['screen'], s.start + .1)
            ys, hs = layout(s.params['screen'])
            for i, (wd, (te0, te), y) in enumerate(zip(s.params['screen'], tes, ys)):
                fr.hit(f'w{i}', te0, 's', CX + (i % 2) * 60 - 30, .75)
                if wd.get('cue'):
                    fr.hit(f'a{i}', te, 'm', CX + (i % 2) * 80 - 40, 1.0)
                if wd.get('hi_cue'):
                    fr.hit(f'hi{i}', s.cue(wd['hi_cue']), 'm', CX, 1.1)
                if wd['type'] == 'meter':
                    for j in range(0, wd['n'], 2):
                        fr.hit(f'seg{i}_{j}', te + .15 + .09 * j, 's', 360 + 30 * j, .8)
                if wd['type'] in ('count', 'ring') and wd.get('count_cue'):
                    fr.hit(f'land{i}', s.cue(wd['count_cue']) + wd.get('secs', .9), 'l' if wd['type'] == 'count' else 'm', CX, 1.0)
                if wd['type'] == 'row' and wd.get('dot'):
                    fr.hit(f'dot{i}', te + .2, 's', CX + 140, .8)
                if wd['type'] == 'drain':
                    fr.hit(f'drain{i}', s.cue(wd['drain_cue']) if wd.get('drain_cue') else te + .6, 'l', CX, 1.0)
            for i, cc in enumerate(s.params.get('callouts', [])):
                tc = cue_t(s, cc.get('cue'), s.start + .4 + .15 * i)
                fr.hit(f'co{i}', tc, 'm', COL_L + 90 if cc['side'] == 'left' else COL_R + 90, 1.0)
                fr.hit(f'cod{i}', tc + .45, 's', W / 2, .8)
            for j, wk in enumerate(s.params.get('water', [])):
                fr.hit(f'water{j}', cue_t(s, wk.get('cue'), s.start + .05), 'l', W / 2, 1.1)
            if s.params.get('dust') is not None:
                td = cue_t(s, s.params['dust'])
                for j in range(5):
                    fr.hit(f'dust{j}', td + .55 + j * .3, 's', 300 if j % 2 else 760, .8)
            if s.params.get('seal'):
                fr.hit('seal', cue_t(s, s.params['seal'].get('draw')), 'm', CX, 1.0)
                fr.hit('wear', cue_t(s, s.params['seal'].get('wear')), 'l', CX, 1.0)
            if s.params.get('splash') is not None:
                fr.hit('splash', cue_t(s, s.params['splash']) + .4, 'l', CX - 100, 1.1)
            if s.params.get('ruler') is not None:
                fr.hit('ruler', cue_t(s, s.params['ruler']), 's', 740, .9)
            f_ = s.params.get('focus')
            if f_:
                fr.hit('focus', cue_t(s, f_.get('cue')) - .3, 's', CX, .7)
            fr.scene = None
    if B.EVENTS is not None:   # the hook's own moves (before the first scene): each meter's pulse
        for i, wd in enumerate(topic['hook_screen']):
            if wd.get('pulse') is not None:
                B.EVENTS.setdefault(('hook', i), {'t': wd['pulse'], 'size': 's', 'x': CX, 'g': .9})
    # HUD
    header(fr, topic, scenes, hook_out, t)
    callouts(fr, cur, t, T)
    for li, line in enumerate(vo['lines']):
        nxt = vo['lines'][li + 1]['start'] if li + 1 < len(vo['lines']) else B_DUR[0] - .3
        st = 0.0 if li == 0 else line['start'] - .1
        if st <= t < nxt - .1:
            if li == 0:   # the hook: the whole question at once from frame 0, its key word gold
                idx = list(range(len(line['words'])))
                captions(fr, line['words'], t, idx, size=92, key=topic.get('hook_key'), instant=True)
            else:
                ch = chunks(line, topic['lines'][li].get('chunks'))
                c = 0
                for ci, cc in enumerate(ch):
                    if t >= line['words'][cc[0]]['s'] - .08:
                        c = ci
                captions(fr, line['words'], t, ch[c])
    fade = 1 - B.prog(t, B_DUR[0] - .3, B_DUR[0])
    return fr, fr.finish(glow_strength=0.0, fade=fade)
