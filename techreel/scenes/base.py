"""Drawing kit for the tech explainer reels: canvas with 2x supersampling, a glow layer, palette, easing, text and the fixed frame furniture
(the light, header, part progress bar, label chip, hook card, karaoke captions). Coordinates are always in output pixels (1080x1920).
Look (owner, 8 Nov 2026): the sister of web's style C, "Glass and light" (scripts/explainer/kitmotion.js, theme 'glass'): frosted panes faked
with translucent fills and a lit top edge over slow drifting coloured light, crisp white type; tech's own accent is warm gold (web's is cyan).
The camera (Frame.dx, Frame.dy) is a pure function of t: a drift that never stops plus a glide from scene to scene (make.py)."""
import math
import os
import subprocess
from functools import lru_cache

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy.ndimage import gaussian_filter

W, H = 1080, 1920
SS = 2      # supersampling factor for the sharp layer
GQ = 4      # the glow layer is drawn at 1/GQ resolution and blurred
BG = (7, 9, 21)        # the ink under the light
GRID = (40, 46, 84)    # quiet tracks (bars, rails)
TEXT = (247, 248, 255)
DIM = (158, 164, 201)
ACCENT = (255, 204, 112)   # tech's own accent (warm gold); web style C uses cyan
NEON = {   # scene tints, softened for glass (pastel light, not neon)
    'blue': (120, 168, 255), 'green': (112, 236, 178), 'amber': (255, 200, 110),
    'purple': (176, 146, 255), 'red': (255, 122, 150), 'cyan': (122, 222, 255),
}
# the light: [rgb, strength, radius (px), x, y, fx, fy, phase] in the 1080x1920 frame; they drift on slow Lissajous paths (as kitmotion.js lights)
BLOOMS = [((86, 98, 255), .55, 760, 300, 520, .31, .23, 0.0), ((40, 200, 200), .34, 680, 860, 1180, .27, .35, 1.7),
          ((255, 160, 70), .26, 600, 820, 380, .37, .21, 3.1), ((150, 92, 255), .36, 640, 240, 1500, .22, .29, 4.4)]
# small orbs of light, nearer and quicker than the blooms (depth: they follow the camera more): the light is never still
ORBS = [((150, 200, 255), .2, 180, 200, 700, .55, .43, 0.4), ((255, 200, 130), .17, 160, 880, 980, .47, .61, 2.2),
        ((130, 240, 220), .17, 200, 520, 1450, .63, .38, 3.9), ((200, 150, 255), .19, 170, 760, 560, .41, .57, 5.3),
        ((255, 150, 200), .15, 150, 330, 1150, .69, .49, 1.1), ((170, 220, 255), .15, 160, 620, 300, .52, .66, 4.7)]
CONTENT_TOP, CONTENT_BOTTOM = 430, 1196   # scenes stay inside this band; captions live below it

# ---------- easing ----------
def clamp(v, a=0.0, b=1.0):
    return a if v < a else b if v > b else v

def prog(t, a, b):
    return clamp((t - a) / (b - a)) if b != a else float(t >= a)

def ease_out(k):
    return 1 - (1 - k) ** 3

def ease_io(k):
    return 4 * k ** 3 if k < .5 else 1 - (-2 * k + 2) ** 3 / 2

def spring(s, z=.55, w=13.0):
    """Damped spring from 0 to 1 (about 12% overshoot); s is seconds since the start."""
    if s <= 0:
        return 0.0
    wd = w * math.sqrt(1 - z * z)
    return 1 - math.exp(-z * w * s) * (math.cos(wd * s) + z * w / wd * math.sin(wd * s))

def mix(a, b, k):
    return a + (b - a) * k

def mixc(c1, c2, k):
    return tuple(int(round(mix(x, y, k))) for x, y in zip(c1, c2))

# ---------- fonts ----------
def _font_file(weight):
    """Inter at the given weight (the fonts-inter package); falls back to fontconfig, then DejaVu."""
    name = {500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold', 900: 'Black'}.get(weight, 'Bold')
    for d in ('/usr/share/fonts/opentype/inter', '/usr/share/fonts/truetype/inter'):
        for ext in ('otf', 'ttf'):
            f = f'{d}/Inter-{name}.{ext}'
            if os.path.exists(f):
                return f
    try:
        return subprocess.run(['fc-match', '-f', '%{file}', f'Inter:style={name}'], capture_output=True, text=True, check=True).stdout.strip()
    except Exception:
        return 'DejaVuSans-Bold.ttf'


@lru_cache(maxsize=None)
def font(size, weight=700):
    return ImageFont.truetype(_font_file(weight), int(round(size * SS)))

def text_w(s, size, weight=700, tracking=0):
    f = font(size, weight)
    return (f.getlength(s) + tracking * SS * max(0, len(s) - 1)) / SS

def wrap(words, size, max_w, weight=700):
    """Greedy wrap of a list of words into lines no wider than max_w; returns lists of word indices."""
    lines, cur = [], []
    for i, w in enumerate(words):
        trial = ' '.join(words[j] for j in cur + [i])
        if cur and text_w(trial, size, weight) > max_w:
            lines.append(cur)
            cur = [i]
        else:
            cur.append(i)
    if cur:
        lines.append(cur)
    return lines


EVENTS = None   # make.py sets a dict to collect the element events ((scene, key) -> {t, size, x, g}) while frames are drawn


class Frame:
    """One output frame: a sharp RGB layer at SS x and a glow layer at 1/GQ. Colors may carry alpha (blended)."""

    def __init__(self, bg_img):
        self.img = bg_img.copy()
        self.d = ImageDraw.Draw(self.img, 'RGBA')
        self.glow = Image.new('RGB', (W // GQ, H // GQ), (0, 0, 0))
        self.g = ImageDraw.Draw(self.glow, 'RGBA')
        self.warnings = []
        self.boxes = []      # every text drawn: (text, left, top, right, bottom, opacity) in output pixels (Mandatory Gate layout check, make.py)
        self.alpha = 1.0   # opacity multiplier for everything drawn (scene fades)
        self.dx = 0.0      # the camera: horizontal offset for everything drawn (drift and the glide between scenes; 0 for the HUD)
        self.dy = 0.0      # vertical offset
        self.t = 0.0       # reel time (secondary motion: sheens, pulses)
        self.scene = None  # the scene being drawn (element flow, el())
        self.xk = 0.0      # that scene's exit (0 = in place, 1 = gone)
        self.nel = 0       # elements placed so far in that scene
        self.base = (0.0, 0.0, 1.0)

    def begin(self, scene, xk):
        """Starts a scene's elements: el() offsets each one from this camera and opacity."""
        self.scene, self.xk, self.nel, self.base = scene, xk, 0, (self.dx, self.dy, self.alpha)

    def el(self, key, t0, size, x, enter=True, g=1.0):
        """One element's own flow (owner, 8 Nov 2026: "Each element should have a flow, whether it's a small, medium or large element. Every
        element's flow should have a compatible sound"). Everything drawn after this call, until the next el(), is that element:
        - entrance at t0, varied so neighbours never move alike: from below, from the centre outwards, from above, or a short push from depth;
        - exit as the scene leaves (xk), staggered, each in its own direction;
        - its sound: an event (t0, size s/m/l, x for the pan) collected in EVENTS; make.py turns it into a high tick (s), a mid pluck or
          snap (m) or a low thud with a swish (l) on the element-detail bus. enter=False: the element has its own entrance (it walks or
          flies in); it still gets its exit and its sound."""
        bx, by, ba = self.base
        i = self.nel
        self.nel += 1
        self.hit(key, t0, size, x, g)
        v = (i + self.scene.i if self.scene is not None else i) % 4
        k = ease_out(prog(self.t, t0, t0 + .5)) if enter else 1.0
        side = 1 if x < W / 2 - 40 else -1 if x > W / 2 + 40 else 0
        ox, oy = [(0, 44), (side * 52, 0 if side else 36), (0, -38), (0, 22)][v]
        ox, oy = ox * (1 - k), oy * (1 - k)
        e = ease_io(prog(self.xk, .1 * min(i, 4), .1 * min(i, 4) + .6))
        ex, ey = [(0, -46), (-side * 40 or -40, 0), (0, 44), (40, -20)][(v + 1) % 4]
        self.dx, self.dy = bx + ox + ex * e, by + oy + ey * e
        self.alpha = ba * (1 - e) ** 1.5

    def hit(self, key, t0, size, x, g=1.0):
        """A sound-only event: a move inside an element (a hit, a fill, a tick landing), same sizes as el()."""
        if self.scene is not None and EVENTS is not None and self.scene.start - .15 <= t0 <= self.scene.end + .05:
            EVENTS.setdefault((self.scene.i, key), {'t': round(t0, 3), 'size': size, 'x': x, 'g': g})

    def end_el(self):
        if self.scene is not None:
            self.dx, self.dy, self.alpha = self.base

    def _c(self, c):
        if c is None:
            return None
        if len(c) == 3:
            return tuple(c) + (int(255 * self.alpha),)
        return tuple(c[:3]) + (int(c[3] * self.alpha),)

    # sharp layer helpers (coordinates in output pixels)
    def _s(self, *v):
        return [(x + (self.dy if i % 2 else self.dx)) * SS for i, x in enumerate(v)]

    def rect(self, x, y, w, h, r=0, fill=None, outline=None, width=2, glow=None, glow_a=1.0):
        if w <= 0 or h <= 0:
            return
        box = self._s(x, y, x + w, y + h)
        self.d.rounded_rectangle(box, radius=r * SS, fill=self._c(fill), outline=self._c(outline), width=int(width * SS))
        if glow:
            gb = [v / GQ for v in (x + self.dx, y + self.dy, x + w + self.dx, y + h + self.dy)]
            self.g.rounded_rectangle(gb, radius=r / GQ, outline=glow + (int(255 * glow_a * self.alpha),), width=max(1, int(round(width * 2 / GQ))))

    def circle(self, cx, cy, r, fill=None, outline=None, width=2, glow=None, glow_a=1.0):
        if r <= 0:
            return
        self.d.ellipse(self._s(cx - r, cy - r, cx + r, cy + r), fill=self._c(fill), outline=self._c(outline), width=int(width * SS))
        if glow:
            cy += self.dy
            cx += self.dx
            self.g.ellipse([(cx - r) / GQ, (cy - r) / GQ, (cx + r) / GQ, (cy + r) / GQ], fill=glow + (int(200 * glow_a * self.alpha),) if fill else None,
                           outline=glow + (int(255 * glow_a * self.alpha),), width=max(1, int(round(width * 2 / GQ))))

    def line(self, pts, color, width=3, glow=None, glow_a=1.0):
        pts = [(x + self.dx, y + self.dy) for x, y in pts]
        self.d.line([v * SS for p in pts for v in p], fill=self._c(color), width=int(width * SS), joint='curve')
        if glow:
            self.g.line([v / GQ for p in pts for v in p], fill=glow + (int(255 * glow_a * self.alpha),), width=max(1, int(round(width * 2 / GQ))))

    def poly(self, pts, fill=None, outline=None, width=2, glow=None, glow_a=1.0):
        pts = [(x + self.dx, y + self.dy) for x, y in pts]
        self.d.polygon([v * SS for p in pts for v in p], fill=self._c(fill), outline=self._c(outline), width=int(width * SS))
        if glow:
            self.g.polygon([v / GQ for p in pts for v in p], outline=glow + (int(255 * glow_a * self.alpha),), width=max(1, int(round(width * 2 / GQ))))

    def text(self, x, y, s, size, color=TEXT, weight=700, anchor='la', tracking=0, glow=None, glow_a=.6, max_w=None):
        """Draws text; x,y is the anchor point (Pillow anchors, e.g. 'mm' centre). Records a warning if it is wider than max_w."""
        w = text_w(s, size, weight, tracking)
        x += self.dx
        if max_w and w > max_w + 1:
            self.warnings.append(f'text wider than its box ({w:.0f} > {max_w}): "{s}"')
        x0 = x - (w / 2 if anchor[0] == 'm' else w if anchor[0] == 'r' else 0)
        y0 = y + self.dy - (0 if anchor[1] in 'at' else size * .5 if anchor[1] == 'm' else size * .75)
        ca = (color[3] / 255 if color is not None and len(color) == 4 else 1) * self.alpha
        if ca >= .05:
            self.boxes.append((s, x0, y0, x0 + w, y0 + size * .95, ca))
        f = font(size, weight)
        y = y + self.dy
        color = self._c(color)
        glow_a = glow_a * self.alpha
        if tracking:
            # letter by letter so tracking works with any anchor: convert the anchor to a left x
            x0 = x - (w / 2 if anchor[0] == 'm' else w if anchor[0] == 'r' else 0)
            cx = x0
            for ch in s:
                self.d.text((cx * SS, y * SS), ch, font=f, fill=color, anchor='l' + anchor[1])
                cx += f.getlength(ch) / SS + tracking
        else:
            self.d.text((x * SS, y * SS), s, font=f, fill=color, anchor=anchor)
        if glow:
            gf = ImageFont.truetype(f.path, max(6, int(size / GQ)))
            x0 = x - (w / 2 if anchor[0] == 'm' else w if anchor[0] == 'r' else 0)
            self.g.text((x0 / GQ, y / GQ), s, font=gf, fill=glow + (int(255 * glow_a),), anchor='l' + anchor[1])
        return w

    def finish(self, glow_strength=1.0, fade=1.0):
        """Downsamples the sharp layer, adds the blurred glow, applies a fade to black; returns an RGB uint8 array."""
        base = np.asarray(self.img.resize((W, H), Image.LANCZOS), dtype=np.float32)
        g = np.asarray(self.glow, dtype=np.float32)
        g = gaussian_filter(g, sigma=(2.2, 2.2, 0)) * 1.3   # one tight halo; the wide bloom read as "shiny" (owner, 24 Oct)
        g = np.asarray(Image.fromarray(np.clip(g, 0, 255).astype(np.uint8)).resize((W, H), Image.BILINEAR), dtype=np.float32)
        out = base + g * .12 * glow_strength   # glass, not neon: the glow is a faint halo
        out = np.clip(out * fade, 0, 255).astype(np.uint8)
        return out


_LY, _LX = (np.mgrid[0:240, 0:135].astype(np.float32) + .5) * 8   # the light is painted at 1/8 size: the upscale is the blur, for free


def lights(t, tint=None, tint_b=None, k=0.0, cam=(0.0, 0.0)):
    """The background at time t (style C's light, kitmotion.js lights()): ink, four soft blooms drifting on slow Lissajous paths and breathing,
    a fifth in the scene's tint (crossfading to tint_b by k), following the camera at a shallow depth, then a soft vertical grade.
    Returns (the SS-size RGB image, the bare light at 1/8 for the blank-stretch check)."""
    img = np.zeros((240, 135, 3), np.float32) + np.array(BG, np.float32)
    bl = list(BLOOMS) + [(c, a, r, x, y, fx * 1.4, fy * 1.4, ph) for c, a, r, x, y, fx, fy, ph in ORBS]
    for tn, w in ((tint, 1 - k), (tint_b, k)):
        if tn and w > 0:
            bl.append((NEON.get(tn, NEON['blue']), .22 * w, 640, 540, 820, .19, .26, 2.3))
    for i, (c, a, r, x, y, fx, fy, ph) in enumerate(bl):
        r = r * (1 + .08 * math.sin(t * .5 + i))
        a = a * (.82 + .18 * math.sin(t * .7 + i * 2.1))
        x = x + math.sin(t * fx * 1.6 + ph) * 200 - cam[0] * .08
        y = y + math.sin(t * fy * 1.6 + ph * 1.3) * 240 - cam[1] * .2
        d = np.sqrt((_LX - x) ** 2 + (_LY - y) ** 2) / r
        f = np.clip(1 - d, 0, 1) ** 2 * a
        img += f[..., None] * np.array(c, np.float32)
    g = (_LY / H)[..., None]   # the grade: violet at the top, clear in the middle, teal at the foot
    img = img * (1 - .18 * np.clip(1 - g / .4, 0, 1)) + np.array((90, 60, 200), np.float32) * .18 * np.clip(1 - g / .4, 0, 1)
    img = img + np.array((0, 150, 170), np.float32) * .12 * np.clip((g - .4) / .6, 0, 1)
    small = np.clip(img, 0, 255).astype(np.uint8)
    return Image.fromarray(small).resize((W * SS, H * SS), Image.BICUBIC), small


# ---------- glass ----------
def glass(fr, x, y, w, h, r=28, a=1.0, tint=None, lift=True, sheen=True):
    """A frosted pane, faked cheaply (no blur: over soft light, a translucent fill with a lit top edge reads as frosted glass, as style C):
    a soft shadow under it, a white-tinted fill with a lighter upper half, a 1.5 px edge, a bright top rim, and a slow highlight sweep."""
    if w <= 0 or h <= 0 or a <= 0:
        return
    if lift:
        for k, (oy, al) in enumerate(((22, 34), (12, 40))):
            fr.rect(x + 6 - k * 3, y + oy, w - 12 + k * 6, h, r=r, fill=(4, 3, 20, int(al * a)))
    fr.rect(x, y, w, h, r=r, fill=(255, 255, 255, int(24 * a)), outline=(255, 255, 255, int(60 * a)), width=1.5)
    if tint:
        fr.rect(x, y, w, h, r=r, fill=tint + (int(20 * a),))
    fr.rect(x + 2, y + 2, w - 4, h * .46, r=max(0, r - 2), fill=(255, 255, 255, int(14 * a)))
    if w > 2.4 * r:
        fr.rect(x + r * .8, y + .5, w - r * 1.6, 2.2, r=1, fill=(255, 255, 255, int(130 * a)))
    if sheen and w > 2.4 * r + 60:
        # the highlight sweep: a soft band crosses the pane every 3.2 s (phase from its position, so panes do not sweep together)
        u = ((fr.t + x * .0021 + y * .0013) % 3.2) / 1.6
        if u < 1:
            bx = x + r + (w - 2 * r - 70) * ease_io(u)
            env = math.sin(u * math.pi)
            for bw, al in ((70, 10), (30, 16)):
                fr.rect(bx + (70 - bw) / 2, y + 6, bw, h - 12, r=min(bw / 2, r), fill=(255, 255, 255, int(al * a * env)))


def roll(label, k):
    """Rolling numbers: every number in the label counts up from 0 as k goes 0 -> 1 (kitmotion.js specChip)."""
    import re
    if k >= 1:
        return label
    return re.sub(r'\d+', lambda m: str(int(round(int(m.group(0)) * ease_out(k)))), label)


# ---------- fixed furniture ----------
def header(fr, topic, t, parts, alpha=1.0):
    """The part progress bar (one segment per scene, the current one filling with time; kitmotion.js partProgress) and the topic line."""
    a = int(255 * alpha)
    x0, x1, gap = 140, 900, 10
    n = len(parts)
    sw = (x1 - x0 - gap * (n - 1)) / n
    for i, (s0, s1) in enumerate(parts):
        x = x0 + i * (sw + gap)
        fr.rect(x, 260, sw, 6, r=3, fill=(255, 255, 255, int(a * .16)))
        k = prog(t, s0, s1)
        if k > 0:
            fr.rect(x, 260, max(6, sw * k), 6, r=3, fill=ACCENT + (a,), glow=ACCENT if k < 1 else None, glow_a=.5)
    fr.text(520, 300, f'{topic.upper()} · EXPLAINED', 26, color=DIM + (a,), weight=700, anchor='mm', tracking=5)


def chip(fr, label, tint, k):
    """The scene label chip at y≈392 on a small glass pill; k is its entrance (0..1)."""
    if k <= 0:
        return
    c = NEON[tint]
    w = text_w(label, 26, 800, 6) + 80
    s = .7 + .3 * spring(k * .8)
    ww, hh = w * s, 58 * s
    x, y = W / 2 - ww / 2, 392 - hh / 2
    aa = min(1, k * 3)
    glass(fr, x, y, ww, hh, r=hh / 2, a=aa, tint=c, lift=False, sheen=False)
    fr.circle(x + 30 * s, 392, 7 * s, fill=c + (int(255 * aa),), glow=c, glow_a=.5 * aa)
    if s > .9:
        fr.text(W / 2 + 14, 392, label, 26, color=TEXT + (int(255 * aa),), weight=800, anchor='mm', tracking=6)


VERDICT_COL = (255, 92, 110)


def verdict_stamp(fr, word, cx, cy, t, a_out):
    """The myth-bust verdict (topic "verdict", e.g. MYTH): already on screen at frame 0, it slams down from 1.5x by 0.28 s, then breathes.
    The answer before the question (owner's rulebook, tech rule 2: the answer inside 2 s)."""
    k = ease_out(prog(t, 0, .28))
    sc = 1.5 - .5 * k + .03 * math.sin(max(0, t - .28) * 4.2) * k
    size = 88 * sc
    tw = text_w(word, 88, 900, tracking=14) * sc
    w, h = tw + 110 * sc, 140 * sc
    a = int(255 * (.55 + .45 * k) * (1 - a_out))
    fr.rect(cx - w / 2, cy - h / 2, w, h, r=26 * sc, fill=VERDICT_COL + (int(a * .16),), outline=VERDICT_COL + (a,), width=6,
            glow=VERDICT_COL, glow_a=.5 * k)
    fr.text(cx, cy + 2, word, int(size), color=VERDICT_COL + (a,), weight=900, anchor='mm', tracking=14 * sc, glow=VERDICT_COL, glow_a=.3)


def hook_card(fr, title_lines, t, t_out, accent=None, verdict=None):
    """0–2 s: the question as a big title, three or four lines, then IN 20 SECONDS. Words rise in one by one; the camera glides past it at t_out.
    verdict: a myth-bust stamp (MYTH / TRUE) above the title, on screen from frame 0."""
    out = ease_io(prog(t, t_out - .2, t_out + .45))
    if out >= 1:
        return
    acc = ACCENT
    size = 104 if max(text_w(l, 104, 800) for l in title_lines) <= 860 else 92
    lh = size * 1.08
    y0 = 860 - lh * (len(title_lines) - 1) / 2 - 40 * prog(t, 0, t_out)   # a slow rise while it is read: never still
    if verdict:
        verdict_stamp(fr, verdict, W / 2, y0 - 210, t, out * .6)
    n = 0
    for li, ln in enumerate(title_lines):
        words = ln.split()
        x = W / 2 - text_w(ln, size, 800) / 2
        for w in words:
            k = ease_out(prog(t, .05 + n * .07, .35 + n * .07))
            col = (acc if w.endswith('?') or w.strip('?.,!').isupper() and len(w) > 1 else TEXT)
            a = int(255 * k * (1 - out * .6))
            fr.text(x, y0 + li * lh + (1 - k) * 40, w, size, color=col + (a,), weight=800, anchor='lm',
                    glow=col if col != TEXT else None, glow_a=.15 * k)
            x += text_w(w + ' ', size, 800)
            n += 1
    k = ease_out(prog(t, .6, 1.0))
    a = int(255 * k * (1 - out * .6))
    yb = y0 + len(title_lines) * lh + 40
    fr.text(W / 2, yb, 'IN 20 SECONDS', 34, color=acc + (a,), weight=800, anchor='mm', tracking=10)
    fr.rect(W / 2 - 60 * k, yb + 42, 120 * k, 4, r=2, fill=acc + (a,), glow=acc, glow_a=.6 * k)
    # a light runs along the underline while the hook is read
    if k >= 1:
        u = (t * .9) % 1
        fr.circle(W / 2 - 60 + 120 * u, yb + 44, 5, fill=TEXT + (int(a * math.sin(u * math.pi)),))


def captions(fr, words, t, line_words, size=72, y=1290, max_w=820):
    """Karaoke captions on a faint glass plate: spoken words white, the current word gold, upcoming words dimmed. line_words: indices into words.
    Centred on x 510 (the middle of Instagram's safe zone, x 60-960) so a full row stays inside it."""
    disp = [words[i]['d'] for i in line_words]
    rows = wrap(disp, size, max_w, 800)
    if len(rows) > 2:
        fr.warnings.append(f'caption needs {len(rows)} lines: "{" ".join(disp)}"')
    lh = size * 1.18
    rw = max(text_w(' '.join(disp[j] for j in row), size, 800) for row in rows)
    fr.rect(510 - rw / 2 - 34, y - size * .5 - 24, rw + 68, lh * (len(rows) - 1) + size + 48, r=34, fill=(255, 255, 255, 14), outline=(255, 255, 255, 30), width=1.5)
    # exactly one current word: the last one whose onset has passed (held through short pauses)
    cur_j = max((j for j in range(len(line_words)) if words[line_words[j]]['s'] - .03 <= t), default=-1)
    if cur_j >= 0 and t > words[line_words[cur_j]]['e'] + .3:
        cur_j = len(line_words)   # the line is finished: everything white
    for r, row in enumerate(rows):
        s = ' '.join(disp[j] for j in row)
        x = 510 - text_w(s, size, 800) / 2
        for j in row:
            w = words[line_words[j]]
            cur = j == cur_j
            done = j < cur_j
            col = ACCENT if cur else TEXT if done else (150, 156, 196)
            a = 255 if (cur or done) else 140
            yy = y + r * lh - (6 if cur else 0)
            fr.text(x, yy, w['d'], size, color=col + (a,), weight=800, anchor='lm', glow=ACCENT if cur else None, glow_a=.25)
            x += text_w(w['d'] + ' ', size, 800)
