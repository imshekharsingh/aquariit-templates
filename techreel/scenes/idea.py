"""The "idea" look for @techin20sec (13 Nov 2026; topic "look": "idea"; design/rules-tech.md G1-G9). The default for every tech reel.
Owner, 13 Nov 2026: "Tech reel animation doesn't live up to expectation"; "Let's build it with new animation." The gadget look put everything
inside a small phone screen (under half the frame width), every scene was the same phone with only its screen text changing (a slideshow), and
the motion was small. This look shows the IDEA itself at full-frame scale, one subject at a time filling 70-80% of the frame:
- a thin HUD: the progress bar and the format pill at the top, a TAG row under it (a giant glyph that travels between scenes, e.g. the 6 and the
  8 of IP68, and one or two big words that land on their cue words), a chip at the foot of the stage, captions in their own band;
- the stage (y 620-1330, shapes may run full-bleed): one SET per scene (a world: giant type, a macro barrier with particles, water rising
  against a depth ruler and a timer ring, cards slamming in, a before/after split, a two-up verdict), drawn crisp through a camera (zoom about
  a focus point + a drift that never stops), so the camera pushes in and leads the eye to what the voice says (rules-web.md rule 14);
- between worlds a declared zoom-through (the old world flies past the lens, the new one settles from depth); scenes that share a "world"
  key continue in one world (water rising, then the camera following the phone down) with no cut;
- springs and staggers (kitmotion.js grade), every element with its recorded sound (Frame.hit), the dark palette with one gold accent.
Every frame is a pure function of t (seeded randomness only)."""
import math
import random

from PIL import Image, ImageDraw

from . import base as B
from .phonecam import background, YEL, GREEN, RED, TXT, GREY, CARDBG, EDGE, BG
from .gadget import captions, icon, tick, rrect_path

W, H, SS = B.W, B.H, B.SS
CX = 510                      # the safe zone's middle
STAGE = (620, 1330)           # the stage band (y)
FOC = (CX, 975)               # the camera's default focus (the stage's centre)
TAG_Y = 470                   # the tag row's centre line (the travelling glyph and the big words)
GLYPH = 250                   # the tag glyph's size
CHIP_Y = 1262                 # the chip's centre line (foot of the stage)
TR = .6                       # a zoom-through's length (s)
WATER = (104, 134, 164)       # water: calm steel blue, low saturation (G5)
DEEP = (22, 34, 50)
DUSTC = (196, 176, 146)
B_DUR = [20.0]


def clamp(v):
    return B.clamp(v)


def eio(k):
    return B.ease_io(B.clamp(k))


def eo(k):
    return B.ease_out(B.clamp(k))


def sp(t, t0, z=.55, w=13.0):
    return B.spring(t - t0, z, w) if t >= t0 else 0.0


def mix(a, b, k):
    return a + (b - a) * k


def cue(s, word, nth=1, d=None):
    if word:
        return s.cue(word, nth)
    return s.start + .3 if d is None else d


# ---------- a camera surface: world px -> frame px (zoom about a focus point + drift), drawn crisp at SS, alpha-aware ----------
class Cam:
    def __init__(self, fr, f=FOC, z=1.0, d=(0.0, 0.0), a=1.0, ta=None):
        self.fr, self.d_ = fr, fr.d
        self.fx, self.fy = f
        self.z, (self.dx, self.dy), self.a = z, d, a
        self.ta = a if ta is None else ta

    def T(self, x, y):
        return self.fx + (x - self.fx) * self.z + self.dx, self.fy + (y - self.fy) * self.z + self.dy

    def P(self, x, y):
        X, Y = self.T(x, y)
        return X * SS, Y * SS

    def c(self, col, a=None):
        if col is None:
            return None
        al = (col[3] if len(col) > 3 else 255) * (self.a if a is None else a)
        return tuple(int(v) for v in col[:3]) + (int(max(0, min(255, al))),)

    def rect(self, x, y, w, h, r=0, fill=None, outline=None, width=2):
        if w * self.z < .5 or h * self.z < .5 or self.a <= .004:
            return
        x0, y0 = self.P(x, y)
        x1, y1 = self.P(x + w, y + h)
        self.d_.rounded_rectangle([x0, y0, x1, y1], radius=max(0, min(r, w / 2, h / 2)) * self.z * SS, fill=self.c(fill), outline=self.c(outline),
                                  width=max(1, int(width * self.z * SS)))

    def circle(self, cx, cy, r, fill=None, outline=None, width=2):
        if r * self.z < .3 or self.a <= .004:
            return
        x0, y0 = self.P(cx - r, cy - r)
        x1, y1 = self.P(cx + r, cy + r)
        self.d_.ellipse([x0, y0, x1, y1], fill=self.c(fill), outline=self.c(outline), width=max(1, int(width * self.z * SS)))

    def arc(self, cx, cy, r, a0, a1, fill, width):
        if a1 > a0 + .5 and self.a > .004:
            x0, y0 = self.P(cx - r, cy - r)
            x1, y1 = self.P(cx + r, cy + r)
            self.d_.arc([x0, y0, x1, y1], a0, a1, fill=self.c(fill), width=max(1, int(width * self.z * SS)))

    def line(self, pts, fill, width=4):
        if self.a > .004:
            self.d_.line([v for p in pts for v in self.P(*p)], fill=self.c(fill), width=max(1, int(width * self.z * SS)), joint='curve')

    def poly(self, pts, fill=None, outline=None):
        if self.a > .004:
            self.d_.polygon([v for p in pts for v in self.P(*p)], fill=self.c(fill), outline=self.c(outline))

    def text(self, x, y, s, size, col=TXT, weight=900, anchor='mm', record=True, a=None):
        """Text through the camera (its size scales with the zoom); its box goes to the layout check (SAFE ZONE / OVERLAP)."""
        al = self.ta * (1.0 if a is None else a)
        X, Y = self.T(x, y)
        sz = round(size * self.z * 4) / 4
        if al <= .02 or sz < 4:
            return 0
        w = B.text_w(s, sz, weight)
        x0 = X - (w / 2 if anchor[0] == 'm' else w if anchor[0] == 'r' else 0)
        ca = al * ((col[3] / 255) if len(col) > 3 else 1)
        ftext(self.fr, X, Y, s, sz, col, ca, weight, anchor)
        if record and ca >= .3:
            self.fr.boxes.append((s, x0, Y - sz * .5, x0 + w, Y + sz * .45, ca))
        return w


def ftext(fr, X, Y, s, size, rgb, alpha, weight=900, anchor='mm'):
    """Text at frame px (X, Y) with real opacity: Pillow draws text ink opaque whatever its alpha, so a faded word is drawn through a mask."""
    if alpha <= .02:
        return
    f = B.font(size, weight)
    rgb = tuple(int(v) for v in rgb[:3])
    if alpha >= .99:
        fr.d.text((X * SS, Y * SS), s, font=f, fill=rgb, anchor=anchor)
        return
    l, t_, r, b = f.getbbox(s, anchor=anchor)
    x0, y0 = int(X * SS + l) - 2, int(Y * SS + t_) - 2
    w, h = int(r - l) + 5, int(b - t_) + 5
    m = Image.new('L', (w, h), 0)
    ImageDraw.Draw(m).text((X * SS - x0, Y * SS - y0), s, font=f, fill=int(255 * alpha), anchor=anchor)
    fr.img.paste(rgb, (x0, y0, x0 + w, y0 + h), m)


def htext(fr, x, y, s, size, col, weight=900, anchor='mm', max_w=None):
    """HUD text (no camera) with real opacity; its box goes to the layout check."""
    a = (col[3] / 255) if len(col) > 3 else 1.0
    w = B.text_w(s, size, weight)
    if max_w and w > max_w + 1:
        fr.warnings.append(f'text wider than its box ({w:.0f} > {max_w}): "{s}"')
    x0 = x - (w / 2 if anchor[0] == 'm' else w if anchor[0] == 'r' else 0)
    if a >= .05:
        fr.boxes.append((s, x0, y - size * .5, x0 + w, y + size * .45, a))
    ftext(fr, x, y, s, size, col, a, weight, anchor)
    return w


def drift(t):
    """The camera's drift (an orbit: its speed never drops to zero, so no stretch of the reel is still)."""
    return 10 * math.cos(t * .62) + 3 * math.sin(t * 1.3 + 2), 10 * math.sin(t * .62) + 3 * math.sin(t * 1.1)


def hit(fr, s, key, t0, size, x, g=1.0):
    """An element's sound (small high, medium mid, large low), collected by make.py while frames are drawn."""
    if B.EVENTS is not None:
        fr.scene = s
        fr.hit(key, t0, size, x, g)
        fr.scene = None


def sub_cam(fr, cm, cx, cy, scale, al):
    """A camera for one element: the parent camera's view of (cx, cy), scaled about it (a slam, a pop) and faded by al."""
    c = Cam(fr, (0.0, 0.0), cm.z * scale, (0.0, 0.0), cm.a * al, cm.ta * al)
    S = cm.T(cx, cy)
    c.T = lambda x, y: (S[0] + (x - cx) * c.z, S[1] + (y - cy) * c.z)
    return c


# ---------- drawn objects ----------
def phone(cm, cx, cy, w, h, t, glow=0.0):
    """A generic phone, front view (our own drawing, no maker's design): a dark body, a lit edge, a black screen with a slow reflection."""
    r = w * .16
    cm.rect(cx - w / 2 + 8, cy - h / 2 + 18, w, h, r=r, fill=(0, 0, 0, 120))
    cm.rect(cx - w / 2, cy - h / 2, w, h, r=r, fill=(46, 46, 52), outline=(96, 96, 106), width=3)
    b = w * .045
    cm.rect(cx - w / 2 + b, cy - h / 2 + b, w - 2 * b, h - 2 * b, r=r - b, fill=(12, 13, 18))
    u = (t * .23) % 1.6 - .3   # the reflection band crossing the glass
    x0 = cx - w / 2 + b + (w - 2 * b) * u
    pts = [(x0, cy - h / 2 + b), (x0 + w * .22, cy - h / 2 + b), (x0 + w * .02, cy + h / 2 - b), (x0 - w * .2, cy + h / 2 - b)]
    xl, xr = cx - w / 2 + b, cx + w / 2 - b
    pts = [(min(xr, max(xl, x)), y) for x, y in pts]
    cm.poly(pts, fill=(255, 255, 255, 16))
    cm.rect(cx - w * .12, cy - h / 2 + b + h * .02, w * .24, h * .035, r=h * .02, fill=(0, 0, 0))
    if glow > 0:
        cm.rect(cx - w / 2 - 6, cy - h / 2 - 6, w + 12, h + 12, r=r + 6, outline=YEL + (int(220 * glow),), width=4)


def cross(cm, cx, cy, s, col, width=6):
    cm.line([(cx - 12 * s, cy - 12 * s), (cx + 12 * s, cy + 12 * s)], col, width)
    cm.line([(cx + 12 * s, cy - 12 * s), (cx - 12 * s, cy + 12 * s)], col, width)


def badge(cm, cx, cy, ok, k=1.0):
    """A small status dot (G5: red / green only as small dots) with a tick or a cross."""
    if k <= .01:
        return
    r = 34 * min(1.15, k)
    cm.circle(cx, cy, r, fill=(GREEN if ok else RED) + (235,))
    (tick if ok else cross)(cm, cx, cy, r / 34, (255, 255, 255), 6)


def glyph_row(s, size, track=8):
    """Character centres of a giant word (x offsets from its centre) and their widths."""
    ws = [B.text_w(ch, size, 900) for ch in s]
    tot = sum(ws) + track * (len(s) - 1)
    xs, x = [], -tot / 2
    for w in ws:
        xs.append(x + w / 2)
        x += w + track
    return xs, ws


def water_body(cm, ys, t, x0=-40, x1=1120, y1=2000, a=1.0, amp=10):
    """Water from a wavy surface at ys down to y1: bands that darken with depth, a lit surface line and two caustic lines."""
    if ys >= y1:
        return
    n = 28
    surf = [(x0 + (x1 - x0) * i / n, ys + amp * math.sin(t * 2.1 + i * .7) + amp * .5 * math.sin(t * 3.3 - i * 1.3)) for i in range(n + 1)]
    band = 70
    y = ys + amp * 1.6
    cm.poly(surf + [(x1, y), (x0, y)], fill=WATER + (int(150 * a),))
    while y < y1:
        k = clamp((y - ys) / 900)
        col = B.mixc(WATER, DEEP, k)
        cm.rect(x0, y - 1, x1 - x0, band + 2, fill=col + (int(150 * a),))
        y += band
    cm.line(surf, (214, 230, 246, int(200 * a)), 4)
    for j in range(2):   # caustics: soft bright wavy lines under the surface
        yy = ys + 60 + 70 * j
        if yy < y1:
            cm.line([(x0 + (x1 - x0) * i / n, yy + 8 * math.sin(t * 1.6 + i * .9 + j * 2)) for i in range(n + 1)], (200, 220, 240, int(36 * a)), 3)


def bubbles(cm, seed, n, t, x0, x1, ys, ybot, a=1.0, rate=1.0):
    """Rising bubbles below the surface ys (seeded, so every frame is a pure function of t)."""
    for i in range(n):
        rr = random.Random(seed * 97 + i)
        x, ph, v, r = rr.uniform(x0, x1), rr.random(), rr.uniform(90, 200) * rate, rr.uniform(4, 11)
        span = ybot - ys
        if span <= 40:
            return
        y = ybot - ((t * v + ph * span) % span)
        cm.circle(x + 6 * math.sin(t * 3 + i), y, r, outline=(214, 230, 246, int(150 * a)), width=2)


# ---------- the hook: giant type (topic "hook_glyphs") ----------
def hook_glyphs(topic):
    return topic.get('hook_glyphs') or {'text': topic.get('topic', ''), 'size': 300}


def hook_zoom(t):
    return 1.0 + .02 * math.sin(t * 1.1) + .03 * eo(t / 1.8)


def hook_glyph_pos(topic, i, t):
    """Where the hook camera draws letter i at time t (the travelling glyph starts exactly there)."""
    hg = hook_glyphs(topic)
    size, y = hg.get('size', 360), hg.get('y', 830)
    xs, _ = glyph_row(hg['text'], size)
    z, (dx, dy) = hook_zoom(t), drift(t)
    return CX + xs[i] * z + dx, y + dy, size * z


def draw_hook(fr, topic, t, kout, scenes):
    """Frame 0: the giant term doing the thing (half under water, dust above), readable in under 1 s. As the first scene arrives the
    letters part: the travelling glyph (the first scene's tag) flies to the tag row, the others leave."""
    hg = hook_glyphs(topic)
    size, y = hg.get('size', 360), hg.get('y', 830)
    cm = Cam(fr, (CX, y), hook_zoom(t), drift(t), 1.0)
    xs, _ = glyph_row(hg['text'], size)
    taken = {sc.params.get('tag', {}).get('from_hook') for sc in scenes[:1]}
    ws = hg.get('water')
    lvl = y + (ws if isinstance(ws, (int, float)) else 40) + 900 * eio(kout) if ws is not None else None
    # dust motes above the letters, bouncing off their tops
    if hg.get('dust'):
        for i in range(16):
            rr = random.Random(500 + i)
            x = CX + rr.uniform(-430, 430)
            per = rr.uniform(1.1, 1.8)
            q = ((t + rr.random() * per) % per) / per
            top = y - size * .36
            yy = top - 240 * (1 - q) ** 2 if q < .7 else top - 60 * math.sin((q - .7) / .3 * math.pi)
            cm.circle(x + 20 * q, yy, rr.uniform(4, 7), fill=DUSTC + (int(200 * (1 - eio(kout * 2))),))
    if hg.get('wave'):   # (14 Nov 2026, ANC) frame 0: a noise wave rolls across behind the letters and goes flat past the middle (cancelled)
        wy, af = y + hg['wave'].get('dy', 0), 1 - eio(kout * 2)
        xc = CX + hg['wave'].get('flat_from', 0)
        pts, flat = [], []
        wx0, wx1 = hg['wave'].get('x0', -60), hg['wave'].get('x1', 1140)
        for i in range(0, int(wx1 - wx0) + 1, 8):
            x = wx0 + i
            k = clamp((x - xc) / 160)
            v = noise(x, t, hg['wave'].get('amp', 130)) * (1 - eio(k)) * min(1.0, (x - wx0) / 90)
            (pts if k < 1 else flat).append((x, wy + v))
        cm.line(pts, (200, 200, 206, int(210 * af)), 12)
        if flat:
            cm.line([pts[-1]] + flat, YEL + (int(235 * af),), 10)
    for i, ch in enumerate(hg['text']):
        if i in taken and kout > 0:
            continue
        k = eio(kout * 1.4 - .1 * i)
        ox = (900 if i >= len(hg['text']) / 2 else -900) * k * (1 if i not in (0, 1) else 0)
        oy = 700 * k if i in (0, 1) else 0   # the letters that are not the idea sink into the water
        al = 1 - k
        if al <= .01:
            continue
        on = any(lb['i'] == i and t >= lb.get('t', .5) for lb in hg.get('labels', []))
        col = YEL if (on and lb_gold(hg, i)) else TXT
        cm.text(CX + xs[i] + ox, y + oy, ch, size, col, 900, 'mm', a=al)
    if lvl is not None:
        water_body(cm, lvl, t, a=.92)
        bubbles(cm, 3, 12, t, 140, 900, lvl + 30, 1330)
        for tr_ in hg.get('ripples', []):
            q = (t - tr_['t']) / .8
            if 0 <= q < 1:
                rx = CX + xs[tr_['i']]
                cm.circle(rx, lvl, 30 + 170 * q, outline=(214, 230, 246, int(220 * (1 - q))), width=4)
    for lb in hg.get('labels', []):   # the parts named in the hook ("DUST" under the 6, "WATER" under the 8), springing in on time
        k = sp(t, lb.get('t', .5), .5, 14)
        if k > .01:
            al = clamp(k * 1.6) * (1 - eio(kout * 2))
            x = CX + xs[lb['i']]
            yy = y + size * .5 + 70 + (1 - min(1, k)) * 30
            cm.text(x, yy, lb['text'], 46, YEL if lb.get('gold') else TXT, 900, 'mm', a=al)
            cm.line([(x, yy - 34), (x, yy - 70)], (255, 255, 255, int(160 * al)), 3)


def lb_gold(hg, i):
    return any(lb['i'] == i and lb.get('gold') for lb in hg.get('labels', []))


# ---------- the sets (one per scene kind) ----------
def set_barrier(cm, fr, s, t, sc):
    """A macro view of the product's edge (a phone lying face up, seen close): particles rain on it and bounce off the sealed seam, which
    lights gold on its cue. Params: seam_cue, particles."""
    p = s.params
    ts = cue(s, p.get('seam_cue'))
    # the face (dark glass), seen at an angle, and the metal side under it; the seam between them is the seal
    face = [(240, 860), (780, 860), (860, 1110), (160, 1110)]   # kept whole inside the frame at the push (Output QA EDGES)
    cm.poly([(x + 10, y + 26) for x, y in face], fill=(0, 0, 0, 110))
    cm.poly(face, fill=(26, 28, 34))
    u = (t * .2) % 1.6 - .3
    xl_, xr_ = 240 + 540 * u, 160 + 700 * u
    cm.poly([(max(240, min(780, xl_)), 860), (max(240, min(780, xl_ + 70)), 860), (max(160, min(860, xr_ + 30)), 1110), (max(160, min(860, xr_ - 70)), 1110)], fill=(255, 255, 255, 12))
    cm.rect(160, 1110, 700, 92, r=40, fill=(70, 70, 80))
    cm.rect(180, 1122, 660, 14, r=7, fill=(110, 110, 122))
    cm.rect(420, 1150, 180, 26, r=13, fill=(30, 30, 36))   # a port opening (sealed too)
    cm.rect(780, 1124, 50, 12, r=6, fill=(54, 54, 62))
    g = eo((t - ts) / .5)
    cm.line([(160, 1110), (860, 1110)], (90, 90, 100), 6)
    if g > 0:
        x1 = 160 + 700 * g
        cm.line([(160, 1110), (x1, 1110)], YEL, 8)
        q = (t - ts) / .8
        if 0 <= q < 1:
            cm.line([(160, 1110), (x1, 1110)], YEL + (int(120 * (1 - q)),), 8 + 26 * q)
    # particles: seeded paths, each falls, hits the face or the seam, and bounces away; none ever goes in
    n = p.get('particles', 40)
    for i in range(n):
        rr = random.Random(900 + i)
        t0 = s.start + .1 + (s.end - s.start - .6) * i / n + rr.uniform(-.1, .1)
        if t < t0:
            continue
        xh = rr.uniform(200, 820)
        yh = 1110 if i % 3 else rr.uniform(900, 1100)
        x0, y0 = xh - rr.uniform(60, 220), rr.uniform(560, 680)
        tf = rr.uniform(.45, .7)
        q = (t - t0) / tf
        r = rr.uniform(4, 8)
        if q < 1:
            x, y = mix(x0, xh, q), mix(y0, yh, q * q)
            al = 1.0
        else:
            u = t - t0 - tf
            vx, vy = rr.uniform(80, 200) * (1 if xh > CX else -1), -rr.uniform(260, 420)
            x, y = xh + vx * u, yh + vy * u + 600 * u * u
            al = 1 - clamp(u / .9)
            if u < .3 and i % 2 == 0:
                cm.circle(xh, yh, 8 + 50 * u / .3, outline=YEL + (int(170 * (1 - u / .3)),), width=3)
        if al > .02:
            cm.circle(x, y, r, fill=DUSTC + (int(230 * al),))
    for i in range(0, n, 4):
        rr = random.Random(900 + i)
        t0 = s.start + .1 + (s.end - s.start - .6) * i / n + rr.uniform(-.1, .1)
        hit(fr, s, f'p{i}', t0 + rr.uniform(.45, .7), 's', rr.uniform(150, 900), .7)
    hit(fr, s, 'seam', ts, 'm', CX, 1.1)


def water_world(cm, fr, ss, t, sc, kin_first):
    """One world over the scenes that share it: water rises across the whole frame on the first scene's rise_cue and a phone sinks into it;
    on the next scene a depth ruler draws in, the phone sinks to the tested depth (a readout pops on its word) and a timer ring sweeps on
    its word. Params: first: rise_cue, sink_cue; second: depth {value, unit, cue, labels}, ring {value, unit, cue}."""
    a, b = ss[0], (ss[1] if len(ss) > 1 else None)
    pa = a.params
    tr = cue(a, pa.get('rise_cue'))
    lvl = mix(1960, 720, eio((t - tr + .35) / 1.0))
    # the phone: drops in from above, then (second scene) sinks to the tested depth, shrinking with distance
    tsk = cue(a, pa.get('sink_cue'), d=tr + .4)
    pd = b.params.get('depth', {}) if b else {}
    tdep = cue(b, pd.get('cue')) if b else 1e9
    dk = eio((t - (b.start + .1)) / max(.6, tdep - b.start + .3)) if b else 0.0
    py = mix(880, 960, eo((t - tsk + .5) / .9)) + 10 * math.sin(t * 1.7)
    py = mix(py, 1100, dk)
    psc = mix(1.0, .62, dk)
    phone(cm, 470 if b else CX, py, 300 * psc, 600 * psc, t, glow=.0)
    water_body(cm, lvl, t)
    bubbles(cm, 11, 18, t, 120, 940, lvl + 30, 1500)
    if t >= tr - .35:
        hit(fr, a, 'rise', tr - .2, 'l', CX, 1.2)
    hit(fr, a, 'sink', tsk, 'm', CX, 1.0)
    if b is None:
        return
    # the depth ruler (left) draws in from the surface down; its marker follows the phone
    kr = eo((t - b.start - .05) / .6)
    y0, y1, val = 720, 1280, pd.get('value', 6)
    if kr > 0:
        ybot = mix(y0, y1, kr)
        cm.line([(150, y0), (150, ybot)], (230, 236, 244, 230), 5)
        for m in range(int(val) + 1):
            yy = y0 + (y1 - y0) * m / val
            if yy <= ybot + 1:
                cm.line([(150, yy), (190 if m % 2 == 0 else 175, yy)], (230, 236, 244, 230), 4)
        for m in pd.get('labels', []):
            yy = y0 + (y1 - y0) * m / val
            if yy <= ybot + 1:
                cm.text(205, yy, f'{m}', 46, (230, 236, 244), 800, 'lm')
        my = mix(y0, y1, dk)
        cm.poly([(132, my - 16), (132, my + 16), (158, my)], fill=YEL)
        cm.line([(160, my), (470 - 300 * psc / 2 - 10, my)], YEL + (150,), 3)
        hit(fr, b, 'ruler', b.start + .1, 's', 150, .9)
    # the readout: the depth, big and gold, on its word (no counting: the number shown is the number said)
    kd = sp(t, tdep, .5, 13)
    if kd > .01:
        cm.text(770, 760 + (1 - min(1, kd)) * 40, f"{pd.get('value', 6)} {pd.get('unit', 'm')}", 150, YEL, 900, 'mm', a=clamp(kd * 1.6))
        cm.text(770, 860, pd.get('label', 'DEPTH'), 38, GREY, 800, 'mm', a=clamp(kd * 1.6))
        hit(fr, b, 'depth', tdep, 'l', 770, 1.2)
    rg = b.params.get('ring')
    if rg:
        trg = cue(b, rg.get('cue'))
        cx, cy, r = 770, 1110, 150
        kin = eo((t - b.start - .2) / .5)
        cm.circle(cx, cy, r, outline=(255, 255, 255, int(60 * kin)), width=18)
        k = eio((t - trg) / 1.1)
        if k > 0:
            cm.arc(cx, cy, r, -90, -90 + 360 * k, YEL, 18)
            hx, hy = cx + r * math.cos(math.radians(-90 + 360 * k)), cy + r * math.sin(math.radians(-90 + 360 * k))
            cm.circle(hx, hy, 14, fill=(255, 255, 255))
        kv = sp(t, trg, .5, 13)
        if kv > .01:
            cm.text(cx, cy - 14, f"{rg['value']}", 120, TXT, 900, 'mm', a=clamp(kv * 1.6))
            cm.text(cx, cy + 66, rg.get('unit', 'MIN'), 36, GREY, 800, 'mm', a=clamp(kv * 1.6))
            hit(fr, b, 'ring', trg, 'm', cx, 1.0)
            hit(fr, b, 'ring_done', trg + 1.1, 'l', cx, 1.1)


def set_slam(cm, fr, s, t, sc):
    """Big cards slamming in one by one on their words (scale from 1.35 to 1 on a stiff spring, a low thud, the camera jolts), each with
    its icon moving. Empty slots are drawn faintly first, so the frame is never half empty. Params: cards [{icon, text, cue, dot}]."""
    cards = s.params['cards']
    n = len(cards)
    h, gap = 200, 30
    top = 640 + (690 - (n * h + (n - 1) * gap)) / 2
    for i, cd in enumerate(cards):
        tc = cue(s, cd.get('cue'), d=s.start + .3 + .5 * i)
        y = top + i * (h + gap)
        k = sp(t, tc - .06, .42, 17)
        cm.rect(80, y, 860, h, r=36, outline=(255, 255, 255, 40), width=3)
        if k <= .01:   # (14 Nov 2026) the slot already holds a faint, bobbing ghost of its card: never a dead empty frame
            gb = 8 * math.sin(t * 2.4 + i * 1.7)
            icon(cm, cd['icon'], 210, y + h / 2 + gb, 1.75, TXT, 46)
            cm.text(320, y + h / 2, cd['text'], 84, (255, 255, 255, 40), 900, 'lm')
            continue
        sc_ = 1 + .35 * (1 - min(1.0, k)) if k < 1 else 1 - .02 * (k - 1)
        al = clamp((t - tc + .1) / .12)
        cx, cy = 510, y + h / 2
        sub = sub_cam(fr, cm, cx, cy, sc_, al)
        last = all(t < cue(s, c2.get('cue'), d=0) for c2 in cards[i + 1:])
        sub.rect(cx - 430, cy - h / 2 + 14, 860, h, r=36, fill=(0, 0, 0, 120))
        sub.rect(cx - 430, cy - h / 2, 860, h, r=36, fill=CARDBG, outline=YEL if last else EDGE, width=4 if last else 2)
        bob = 6 * math.sin(t * 3 + i)
        sub.circle(cx - 300, cy, 74, fill=(44, 44, 52))
        icon(sub, cd['icon'], cx - 300, cy + bob * .5, 1.75, TXT, 255)
        if cd['icon'] == 'shower':   # the drops fall
            for j in range(5):
                q = ((t * 1.6 + j / 5) % 1)
                sub.circle(cx - 330 + j * 14, cy + 10 + 50 * q, 4, fill=WATER + (int(255 * (1 - q)),))
        sub.text(cx - 190, cy, cd['text'], 84, TXT, 900, 'lm')
        badge(sub, cx + 350, cy, cd.get('dot') == 'green', min(1.0, sp(t, tc + .12, .5, 14) * 1.0))
        hit(fr, s, f'card{i}', tc, 'l', 510, 1.2)
        hit(fr, s, f'dot{i}', tc + .14, 's', 860, .8)


def set_split(cm, fr, s, t, sc):
    """A before / after split of one big object (here a seal ring): new on the left of a divider, worn on the right; the divider sweeps
    across on its word and drops show what each half does (bounced off the new seal, seeping through the worn one).
    Params: before, after (labels), wipe_cue, show_cue."""
    p = s.params
    tw = cue(s, p.get('wipe_cue'))
    tshow = cue(s, p.get('show_cue'), d=s.start + .2)
    xd = mix(905, 510, eio((t - tw + .1) / .7))
    x, y, w, h, r = 190, 740, 640, 550, 130
    pts = rrect_path(x, y, w, h, r, 200)
    kd = eo((t - s.start - .05) / .8)   # the ring draws itself round as the scene arrives
    m = int(len(pts) * kd)
    for j in range(1, m):
        a_, b_ = pts[j - 1], pts[j]
        worn = (a_[0] + b_[0]) / 2 > xd
        if worn:
            if j % 9 in (0, 1):
                continue   # gaps in the worn seal
            cm.line([a_, b_], (120, 104, 82), 20)
        else:
            cm.line([a_, b_], YEL, 40)
            cm.line([a_, b_], (255, 236, 190, 150), 8)
    # cracks on the worn side
    for j in range(5, m, 17):
        px_, py_ = pts[j]
        if px_ > xd:
            cm.line([(px_ - 10, py_ - 14), (px_ + 6, py_ + 2), (px_ - 4, py_ + 16)], (40, 32, 24), 4)
    cm.text(x + w / 2, y + h * .3, p.get('inside', 'INSIDE'), 44, GREY, 800, 'mm', a=kd)
    # drops: from the left they hit the new seal and bounce; from the right they pass through the worn one
    for i in range(6):
        rr = random.Random(70 + i)
        per = rr.uniform(1.0, 1.5)
        q = ((t - s.start + rr.random() * per) % per) / per
        yy = rr.uniform(y + 120, y + h - 120)
        right = i % 2 == 1
        if right and xd > 860:
            continue
        if not right:
            xx = 70 + 140 * (q / .6) if q < .6 else 210 - 120 * (q - .6) / .4
        else:
            xx = 990 - 330 * q
        al = math.sin(math.pi * q)
        cm.circle(xx, yy, 13, fill=WATER + (int(255 * al),))
        cm.circle(xx - 4, yy - 4, 4, fill=(255, 255, 255, int(200 * al)))
    # the divider
    if t >= tw - .4:
        cm.line([(xd, y - 40), (xd, y + h + 40)], (255, 255, 255, 230), 5)
        cm.circle(xd, y + h * .72, 30, fill=(255, 255, 255), outline=(0, 0, 0, 120), width=2)
        cm.poly([(xd - 18, y + h * .72), (xd - 6, y + h * .72 - 10), (xd - 6, y + h * .72 + 10)], fill=(20, 20, 24))
        cm.poly([(xd + 18, y + h * .72), (xd + 6, y + h * .72 - 10), (xd + 6, y + h * .72 + 10)], fill=(20, 20, 24))
    ka = sp(t, tw + .3, .5, 14)
    kb = sp(t, tshow, .5, 14)
    cm.text(345, 690, p.get('before', 'NEW'), 46, YEL, 900, 'mm', a=clamp(kb * 1.5))
    cm.text(675, 690, p.get('after', 'WORN'), 46, TXT, 900, 'mm', a=clamp(ka * 1.5))
    hit(fr, s, 'ring', tshow, 'm', CX, 1.0)
    hit(fr, s, 'wipe', tw, 'l', 700, 1.2)
    hit(fr, s, 'after', tw + .3, 's', 675, .8)
    for i in range(3):
        hit(fr, s, f'drop{i}', s.start + .6 + .55 * i, 's', 200 + 300 * (i % 2), .7)


def set_verdict(cm, fr, s, t, sc, topic):
    """The verdict: the giant term reassembles (its letters fly back in from where the reel sent them) over two big panels, the good case
    and the bad one, each springing in on its word with its icon moving. Params: glyphs, good {icon, text, cue}, bad {icon, text, cue}."""
    p = s.params
    gl = p.get('glyphs', hook_glyphs(topic)['text'])
    size, gy = 250, 760
    xs, _ = glyph_row(gl, size)
    for i, ch in enumerate(gl):
        k = eio((t - s.start - .05 - .07 * i) / .6)
        fromx = CX + xs[i]
        fromy = gy - 500 if i in (0, 1) else gy + 560
        cm.text(mix(fromx, CX + xs[i], k), mix(fromy, gy, k), ch, size, TXT, 900, 'mm', a=clamp(k * 1.5))
        hit(fr, s, f'g{i}', s.start + .05 + .07 * i + .45, 's', CX + xs[i], .8)
    for j, (key, ok, x0) in enumerate((('good', True, 80), ('bad', False, 530))):
        pd = p[key]
        tc = cue(s, pd.get('cue'))
        k = sp(t, tc - .08, .5, 14)
        cm.rect(x0, 920, 410, 400, r=40, outline=(255, 255, 255, 40), width=3)
        hit(fr, s, f'slot{j}', s.start + .8 + .45 * j, 's', x0 + 205, .7)   # the empty panel's ghost lands (no quiet gap before the word)
        if k <= .01:   # (14 Nov 2026) a faint bobbing ghost of the panel's icon until its word
            icon(cm, pd['icon'], x0 + 205, 1070 + 10 * math.sin(t * 2.2 + j * 2), 3.0, TXT, 46)
            continue
        al = clamp(k * 1.6)
        cx, cy = x0 + 205, 1120
        sub = sub_cam(fr, cm, cx, cy, 1 + .2 * (1 - min(1.0, k)), al)
        sub.rect(cx - 205, cy - 200 + 14, 410, 400, r=40, fill=(0, 0, 0, 120))
        sub.rect(cx - 205, cy - 200, 410, 400, r=40, fill=CARDBG, outline=YEL if ok else EDGE, width=4 if ok else 2)
        bob = 8 * math.sin(t * 2.6 + j)
        icon(sub, pd['icon'], cx, cy - 50 + bob, 3.0, TXT, 255)
        if pd['icon'] == 'cup':   # the spill: drops arc out of the cup and fall
            for i in range(4):
                q = ((t * 1.1 + i / 4) % 1)
                sub.circle(cx + 40 + 90 * q, cy - 90 + 220 * q * q - 60 * q, 9, fill=WATER + (int(255 * (1 - q)),))
        fs = 80
        while fs > 44 and B.text_w(pd['text'], fs, 900) > 360:
            fs -= 2
        sub.text(cx, cy + 120, pd['text'], fs, YEL if ok else TXT, 900, 'mm')
        badge(sub, cx + 150, cy - 150, ok, sp(t, tc + .15, .5, 14))
        hit(fr, s, f'{key}', tc, 'l', cx, 1.2)
        hit(fr, s, f'{key}_dot', tc + .17, 's', cx + 150, .8)


# ---------- ANC (14 Nov 2026): sound waves that cancel, and battery bars ----------
def earbud(cm, cx, cy, sc=1.0, t=0.0, mic=0.0):
    """A generic in-ear bud with a stem (our own drawing, no maker's design), facing right; mic (0..1) lights the mic on the stem's foot."""
    cm.circle(cx + 6, cy + 14, 78 * sc, fill=(0, 0, 0, 110))
    cm.rect(cx - 26 * sc, cy, 52 * sc, 200 * sc, r=26 * sc, fill=(58, 58, 66), outline=(110, 110, 122), width=3)
    cm.circle(cx, cy, 78 * sc, fill=(66, 66, 76), outline=(120, 120, 132), width=3)
    cm.circle(cx + 52 * sc, cy - 6 * sc, 30 * sc, fill=(36, 36, 42))   # the ear tip
    u = (t * .3) % 1.4 - .2
    cm.circle(cx - 30 * sc + 40 * sc * u, cy - 34 * sc, 10 * sc, fill=(255, 255, 255, 30))
    my = cy + 186 * sc
    cm.circle(cx, my, 13 * sc, fill=YEL if mic > .5 else (30, 30, 36), outline=YEL + (int(255 * mic),), width=3)
    if mic > 0:
        q = (t * 1.3) % 1
        for j in range(2):
            qq = (q + j * .5) % 1
            cm.arc(cx, my, (24 + 60 * qq) * sc, 120, 240, YEL + (int(200 * mic * (1 - qq)),), 4)


def noise(x, t, amp, ph=0.0):
    """A noise-like wave (two sines), travelling left towards the bud; the same x and t always give the same value."""
    a = 2 * math.pi * x / 230 + t * 5.2 + ph
    return amp * (math.sin(a) + .38 * math.sin(2.3 * a + 1.3)) / 1.38


def wave_line(cm, y, amp_f, t, col, width, x0=330, x1=1000, sign=1.0, fade=1.0):
    pts = []
    for i in range(0, int(x1 - x0) + 1, 8):
        x = x0 + i
        e = min(1.0, (x - x0) / 60, (x1 - x) / 60)   # the ends taper, so the line never stops on a cliff
        pts.append((x, y + sign * noise(x, t, amp_f) * e))
    cm.line(pts, col + (int(255 * fade),) if len(col) == 3 else col, width)


def wave_world(cm, fr, ss, t, sc):
    """One world over two scenes: the noise wave rolls in towards a bud and its mic lights (first scene); then the wave moves up, the bud
    plays the opposite wave under it (gold, the mirror image) and the sum, what you hear, flattens to a line on the cancel word (second).
    Params: first: mic_cue, noise_cue; second: opp_cue, cancel_cue."""
    a, b = ss[0], (ss[1] if len(ss) > 1 else None)
    tm = cue(a, a.params.get('mic_cue'))
    tn = cue(a, a.params.get('noise_cue'), d=a.start + .2)
    kb = eio((t - b.start + .1) / .8) if b else 0.0   # the layout opens into three tracks
    to = cue(b, b.params.get('opp_cue')) if b else 1e9
    tc = cue(b, b.params.get('cancel_cue')) if b else 1e9
    ko = eio((t - to + .1) / .6)
    kc = eio((t - tc + .15) / .7)
    km = eo((t - tm + .05) / .3)
    earbud(cm, 190, mix(880, 905, kb), 1.0, t, km)
    # track 1: the noise (grey, big in the middle at first; up top once the tracks open)
    y1, amp1 = mix(975, 770, kb), mix(150, 80, kb)
    kin = eo((t - a.start + .1) / .6)
    wave_line(cm, y1, amp1 * kin, t, (200, 200, 206), 10, fade=.95)
    cm.text(330, y1 - amp1 - 50, 'NOISE', 44, TXT, 900, 'lm', a=clamp(sp(t, tn - .05, .5, 14) * 1.6))
    for j in range(3):   # the noise arriving at the mic: small arcs crossing from the wave to the bud
        q = ((t * .9 + j / 3) % 1)
        cm.arc(330 - 100 * q, y1, 40 + 30 * q, 140, 220, (200, 200, 206, int(150 * (1 - q) * kin)), 4)
    hit(fr, a, 'noise', tn, 'l', 650, 1.1)
    hit(fr, a, 'mic', tm, 's', 190, 1.0)
    if not b or kb <= .01:
        return
    al = clamp(kb * 1.5)
    # track 2: the opposite wave (gold, the mirror image), drawn in from the bud on its word
    y2 = 990
    A2 = 62   # tracks 2-3: the label sits clear of the wave's peaks (critic 14 Nov: the 80 px peaks ran through both labels)
    cm.text(330, y2 - 108, 'OPPOSITE WAVE', 44, YEL, 900, 'lm', a=clamp(sp(t, to - .05, .5, 14) * 1.6) * al)
    cm.line([(330, y2), (1000, y2)], (255, 255, 255, int(40 * al)), 3)
    if ko > 0:
        wave_line(cm, y2, A2, t, YEL, 10, 330, 330 + 670 * ko, sign=-1.0)
    # track 3: what you hear = noise + opposite: it shrinks to a flat line on "cancel"
    y3 = 1205
    k3 = clamp(ko * (1 - kc))
    hear = A2 * (1 - .5 * ko) * (1 - kc) if ko > 0 else A2
    cm.text(330, y3 - 108, 'WHAT YOU HEAR', 44, TXT, 900, 'lm', a=al)
    wave_line(cm, y3, hear, t, (255, 255, 255), 10 if kc < 1 else 8, fade=al)
    if kc > 0:   # quiet: the flat line glows once
        q = clamp((t - tc) / 1.0)
        cm.line([(330, y3), (1000, y3)], YEL + (int(160 * kc * (1 - q)),), 8 + 30 * q)
    _ = k3
    hit(fr, b, 'tracks', b.start, 'm', 650, 1.0)
    hit(fr, b, 'hear', b.start + .55, 's', 330, .8)   # the WHAT YOU HEAR label lands
    hit(fr, b, 'opp', to, 'l', 650, 1.2)
    hit(fr, b, 'oppend', to + .65, 's', 1000, .8)   # the gold wave reaches the far end
    hit(fr, b, 'flat', tc + .7, 's', 1000, .8)   # the flat line settles
    hit(fr, b, 'cancel', tc, 'm', 650, 1.1)


def set_bars(cm, fr, s, t, sc):
    """Battery bars: one big battery per row, filling to its hours on its word (the number said, no rolling digits: G13), the shorter one
    in gold with the hours it gives up drawn as an empty, dashed stretch. Params: rows [{label, value, unit, cue, gold?}], max."""
    p = s.params
    rows, mx = p['rows'], float(p.get('max', 12))
    x0, x1, h = 140, 880, 130
    for i, rw in enumerate(rows):
        y = 760 + i * 300
        tc = cue(s, rw.get('cue'), d=s.start + .3 + .5 * i)
        kin = eo((t - s.start - .05 - .12 * i) / .5)
        if kin <= .01:
            continue
        gold = rw.get('gold')
        cm.text(x0, y - 50, rw['label'], 48, YEL if gold else TXT, 900, 'lm', a=kin)
        cm.rect(x0 + 8, y + 16, x1 - x0, h, r=30, fill=(0, 0, 0, int(110 * kin)))
        cm.rect(x0, y, x1 - x0, h, r=30, fill=(30, 30, 36), outline=(150, 150, 160, int(255 * kin)), width=4)
        cm.rect(x1 + 6, y + h / 2 - 26, 22, 52, r=8, fill=(150, 150, 160, int(255 * kin)))
        k = sp(t, tc - .25, .62, 12)
        w = (x1 - x0 - 24) * rw['value'] / mx * min(1.03, k)
        if w <= 4:   # empty, waiting for its word: the outline breathes
            cm.rect(x0 - 6, y - 6, x1 - x0 + 12, h + 12, r=34, outline=(255, 255, 255, int(70 + 60 * math.sin(t * 4 + i))), width=3)
        if w > 4:
            cm.rect(x0 + 12, y + 12, w, h - 24, r=20, fill=(YEL if gold else (214, 214, 220)))
            sx = x0 + 12 + ((t * 420 + i * 300) % (w + 240)) - 120   # the charge sheen runs along the fill
            for dx_, aa in ((0, 70), (30, 110), (60, 70)):
                xa, xb = max(x0 + 14, sx + dx_), min(x0 + 10 + w, sx + dx_ + 30)
                if xb > xa:
                    cm.rect(xa, y + 14, xb - xa, h - 28, r=6, fill=(255, 255, 255, aa))
            for j in range(1, int(rw['value'])):   # hour marks
                xx = x0 + 12 + (x1 - x0 - 24) * j / mx
                if xx < x0 + 12 + w - 6:
                    cm.line([(xx, y + 22), (xx, y + h - 22)], (0, 0, 0, 70), 3)
        if rw['value'] < mx and k > .9:   # the hours it gives up: an empty dashed stretch
            xs_ = x0 + 12 + (x1 - x0 - 24) * rw['value'] / mx
            off = int((t * 60) % 26)   # the dashes march towards the end
            for xx in range(int(xs_ + 10) + off - 26, int(x1 - 16), 26):
                if xx < xs_ + 8:
                    continue
                cm.line([(xx, y + h / 2), (min(xx + 14, x1 - 16), y + h / 2)], (150, 150, 160, 180), 5)
        kv = sp(t, tc, .5, 13)
        if kv > .01:
            cm.text(x1 - 20, y - 50 + (1 - min(1, kv)) * 24, f"{rw['value']} {rw.get('unit', 'H')}", 96, YEL if gold else TXT, 900, 'rm', a=clamp(kv * 1.6))
        hit(fr, s, f'bat{i}', s.start + .05 + .12 * i, 'm', 500, .9)
        hit(fr, s, f'fill{i}', tc - .1, 'l', 500, 1.1)
        hit(fr, s, f'val{i}', tc, 's', 800, .9)


SETS = {'barrier': set_barrier, 'slam': set_slam, 'split': set_split, 'bars': set_bars}


# ---------- the HUD: progress, format pill, the tag row, the chip ----------
def hud_top(fr, topic, scenes, hook_out, t):
    n = len(scenes) + 1
    gw = (896 - 8 * (n - 1)) / n
    spans = [(0, hook_out)] + [(s.start, s.end) for s in scenes]
    for i, (a, b) in enumerate(spans):
        x = 64 + i * (gw + 8)
        fr.rect(x, 258, gw, 6, r=3, fill=(52, 52, 58))
        k = clamp((t - a) / max(.1, b - a))
        if k > 0:
            fr.rect(x, 258, gw * k, 6, r=3, fill=YEL)
    fmt = topic.get('format', 'SPECS DECODED')
    pw = B.text_w(fmt, 28, 900) + 40
    fr.rect(64, 280, pw, 56, r=28, fill=CARDBG, outline=YEL, width=3)
    htext(fr, 64 + pw / 2, 308, fmt, 28, YEL, 900, 'mm')


def tag_glyph_xy(topic, scenes, idx, t):
    """Where scene idx's travelling glyph is: it arrives from the hook's letter (from_hook) or from the right edge, holds in the tag row,
    and leaves to the left when the next scene has another glyph (or none)."""
    s = scenes[idx]
    tg = s.params.get('tag', {})
    gx, gy, gs = 70 + B.text_w(tg['glyph'], GLYPH, 900) / 2, TAG_Y, GLYPH
    prev = scenes[idx - 1].params.get('tag', {}).get('glyph') if idx > 0 else None
    kin = eio((t - (s.start - .05)) / .7)
    if prev == tg['glyph']:
        kin = 1.0
    if tg.get('from_hook') is not None and idx == 0:
        hx, hy, hs = hook_glyph_pos(topic, tg['from_hook'], t)
    else:
        hx, hy, hs = 1300, TAG_Y, GLYPH
    kx = kin
    if tg.get('from_hook') is not None and idx == 0 and prev != tg['glyph']:
        kx = eio((t - (s.start + .2)) / .55)   # it rises out of the word first, then travels left (it never crosses its neighbours)
    x, y, size = mix(hx, gx, kx), mix(hy, gy, kin), mix(hs, gs, kin)
    a = 1.0
    if idx + 1 < len(scenes) and scenes[idx + 1].params.get('tag', {}).get('glyph') != tg['glyph']:
        ko = eio((t - (scenes[idx + 1].start - .05)) / .6)
        x -= 700 * ko
        a = 1 - ko
    return x, y, size, a


def tag_words(fr, s, t, x0, kout):
    """The tag's words: one or two big words, each springing up on its cue word (the gold one is the idea), and a small sub line."""
    tg = s.params.get('tag', {})
    ws = tg.get('words', [])
    n = len(ws)
    ys = [TAG_Y] if n == 1 else [TAG_Y - 48, TAG_Y + 48]
    out = clamp(1 - 2 * kout)
    for j, wd in enumerate(ws):
        tc = cue(s, wd.get('cue'), d=s.start + .2 + .15 * j)
        k = sp(t, tc - .05, .55, 14)
        if k <= .01:
            continue
        a = clamp(k * 1.6) * out
        size = wd.get('size', 88 if n > 1 else 104)
        mw = 960 - x0
        while size > 50 and B.text_w(wd['text'], size, 900) > mw:
            size -= 2
        htext(fr, x0, ys[j] + (1 - min(1.0, k)) * 30, wd['text'], size, (YEL if wd.get('gold') else TXT) + (int(255 * a),), 900, 'lm', max_w=mw)
        hit(fr, s, f'tw{j}', tc, 'm', 300 + x0, 1.0)
    if tg.get('sub'):
        tc = cue(s, tg.get('sub_cue'), d=s.start + .3)
        k = sp(t, tc, .6, 14)
        if k > .01:
            htext(fr, x0, ys[-1] + 82, tg['sub'], 34, GREY + (int(255 * clamp(k * 1.6) * out),), 700, 'lm', max_w=960 - x0)


def chip(fr, s, t, kout):
    """One chip at the foot of the stage (the line's takeaway), on its word; the next chip of the scene replaces it."""
    cs = s.params.get('chips', [])
    cur = None
    for i, c in enumerate(cs):
        tc = cue(s, c.get('cue'))
        if t >= tc - .05:
            cur = (i, c, tc)
    if cur is None:
        return
    i, c, tc = cur
    k = sp(t, tc - .05, .5, 15)
    a = clamp(k * 1.6) * clamp(1 - 2 * kout)
    if a <= .01:
        return
    size = 42
    tw = B.text_w(c['text'], size, 900)
    w = tw + 120
    x = CX - w / 2
    sc_ = .8 + .2 * min(1.2, k)
    h = 84 * sc_
    fr.rect(x, CHIP_Y - h / 2, w, h, r=h / 2, fill=CARDBG + (int(245 * a),), outline=YEL + (int(255 * a),), width=3)
    fr.circle(x + 50, CHIP_Y, 22, fill=(GREEN if c.get('ok', True) else RED) + (int(255 * a),))
    if c.get('ok', True):
        fr.line([(x + 40, CHIP_Y), (x + 47, CHIP_Y + 8), (x + 61, CHIP_Y - 8)], (255, 255, 255, int(255 * a)), 5)
    else:
        fr.line([(x + 42, CHIP_Y - 8), (x + 58, CHIP_Y + 8)], (255, 255, 255, int(255 * a)), 5)
        fr.line([(x + 58, CHIP_Y - 8), (x + 42, CHIP_Y + 8)], (255, 255, 255, int(255 * a)), 5)
    htext(fr, x + 86, CHIP_Y, c['text'], size, (255, 255, 255, int(255 * a)), 900, 'lm', max_w=960 - x - 86)
    hit(fr, s, f'chip{i}', tc, 'm', CX, 1.0)


def caption_bed(fr):
    """A soft dark bed under the caption band, so the words read over full-bleed worlds (water)."""
    for j in range(12):
        y = 1330 + j * 22
        fr.rect(0, y, W, 24, fill=(6, 6, 8, int(min(200, 18 * (j + 1)))))
    fr.rect(0, 1594, W, 326, fill=(6, 6, 8, 200))


# ---------- groups (worlds), the camera, the frame ----------
def groups(scenes):
    """Consecutive scenes that share a "world" key are one world (no zoom-through between them)."""
    out = []
    for s in scenes:
        wk = s.params.get('world')
        if out and wk and out[-1][0].params.get('world') == wk:
            out[-1].append(s)
        else:
            out.append([s])
    return out


def transitions(topic, scenes):
    """Declared transitions (Mandatory Gate item 14): a zoom-through into each new world, a glide where scenes share a world, the end fade."""
    out = []
    gs = groups(scenes)
    for g in gs:
        out.append([round(g[0].start - .05, 3), round(g[0].start + TR, 3), 'zoom'])
        for s in g[1:]:
            out.append([round(s.start - .05, 3), round(s.start + .5, 3), 'glide'])
    out.append([round(B_DUR[0] - .3, 3), round(B_DUR[0], 3), 'fade'])
    return out + list(topic.get('transitions', []))


def push(g, t):
    """The camera inside a world: it pushes in towards the scene's focus ("push": [zoom, x, y]) over the scene, then hands over to the next
    scene's push (rules-web.md rule 14: the camera leads the eye to what the voice says)."""
    z, fx, fy = 1.0, FOC[0], FOC[1]
    for s in g:
        pz, px, py = s.params.get('push', [1.06, FOC[0], FOC[1]])
        k = eio((t - s.start) / max(.5, s.end - s.start))
        if t >= s.start - .05:
            kk = eio((t - s.start + .05) / .6)
            fx, fy = mix(fx, px, kk), mix(fy, py, kk)
            z = mix(z, 1.0, kk) + (pz - 1) * k
    return z, fx, fy


def draw(t, topic, vo, hook_out, scenes, chunks):
    bg, small = background(t, BG)
    fr = B.Frame(bg)
    fr.t, fr.bare = t, small
    gs = groups(scenes)
    first = scenes[0].start if scenes else 1e9
    k_hook_out = eio((t - (first - .05)) / TR)
    if k_hook_out < 1:
        draw_hook(fr, topic, t, k_hook_out, scenes)
    dx, dy = drift(t)
    for gi, g in enumerate(gs):
        g0 = g[0].start
        kin = eio((t - (g0 - .05)) / TR)
        nxt = gs[gi + 1][0].start if gi + 1 < len(gs) else 1e9
        kout = eio((t - (nxt - .05)) / TR)
        if kin <= 0 or kout >= 1:
            continue
        z, fx, fy = push(g, t)
        z *= (.78 + .22 * kin) * (1 + .6 * kout)
        jolt = 0.0
        for s in g:   # a slam jolts the camera
            if s.kind == 'slam':
                for c in s.params['cards']:
                    u = t - cue(s, c.get('cue'))
                    if 0 <= u < .5:
                        jolt += 16 * math.exp(-u * 9) * math.sin(u * 55)
        a = min(kin, 1 - kout)
        ta = clamp(2 * kin - 1) * clamp(1 - 2 * kout)
        cm = Cam(fr, (fx, fy), z, (dx, dy + jolt), a, ta)
        cur = max((s for s in g if t >= s.start - .05), key=lambda s: s.start, default=g[0])
        if g[0].kind in ('fill', 'depth'):
            water_world(cm, fr, g, t, cur, kin)
        elif g[0].kind == 'wave':
            wave_world(cm, fr, g, t, cur)
        elif g[0].kind == 'verdict':
            set_verdict(cm, fr, g[0], t, cur, topic)
        else:
            SETS[g[0].kind](cm, fr, g[0], t, cur)
    caption_bed(fr)
    hud_top(fr, topic, scenes, hook_out, t)
    # the tag row: the travelling glyph and the words of the scene on screen
    for i, s in enumerate(scenes):
        nxt = scenes[i + 1].start if i + 1 < len(scenes) else 1e9
        if not (s.start - .05 <= t < nxt + TR):
            continue
        kout = eio((t - (nxt - .05)) / TR)
        tg = s.params.get('tag', {})
        x0 = 70
        if tg.get('glyph'):
            gx, gy, gsz, ga = tag_glyph_xy(topic, scenes, i, t)
            nxt_same = i + 1 < len(scenes) and scenes[i + 1].params.get('tag', {}).get('glyph') == tg['glyph']
            if not (nxt_same and t >= nxt - .05) and ga > .01:
                htext(fr, gx, gy, tg['glyph'], gsz, YEL + (int(255 * ga),), 900, 'mm')
            x0 = 70 + B.text_w(tg['glyph'], GLYPH, 900) + 36
        tag_words(fr, s, t, x0, kout)
        chip(fr, s, t, kout)
    if B.EVENTS is not None:
        hg = hook_glyphs(topic)
        for i, lb in enumerate(hg.get('labels', [])):
            B.EVENTS.setdefault(('hook', i), {'t': lb.get('t', .5), 'size': 'm', 'x': CX, 'g': 1.0})
        for i, rp in enumerate(hg.get('ripples', [])):
            B.EVENTS.setdefault(('ripple', i), {'t': rp['t'], 'size': 's', 'x': CX, 'g': .9})
        for i, s in enumerate(scenes):
            if s.params.get('tag', {}).get('glyph') and (i == 0 or scenes[i - 1].params.get('tag', {}).get('glyph') != s.params['tag']['glyph']):
                hit(fr, s, 'glyph', s.start + .35, 'l', 200, 1.1)
    # captions: line 1 (the hook) whole from frame 0 with its key term gold, then word by word
    for li, line in enumerate(vo['lines']):
        nx = vo['lines'][li + 1]['start'] if li + 1 < len(vo['lines']) else B_DUR[0] - .3
        st = 0.0 if li == 0 else line['start'] - .1
        if st <= t < nx - .1:
            if li == 0:
                captions(fr, line['words'], t, list(range(len(line['words']))), size=92, key=topic.get('hook_key'), instant=True)
            else:
                ch = chunks(line, topic['lines'][li].get('chunks'))
                c = 0
                for ci, cc in enumerate(ch):
                    if t >= line['words'][cc[0]]['s'] - .08:
                        c = ci
                captions(fr, line['words'], t, ch[c])
    fade = 1 - B.prog(t, B_DUR[0] - .3, B_DUR[0])
    return fr, fr.finish(glow_strength=0.0, fade=fade)


_unused = Image   # (PIL kept for parity with the other looks)
