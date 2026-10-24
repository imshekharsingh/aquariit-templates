"""Drawing kit for the tech explainer reels: canvas with 2x supersampling, a glow layer, palette, easing, text and the fixed frame furniture
(background grid, header, progress bar, label chip, hook card, karaoke captions). Coordinates are always in output pixels (1080x1920)."""
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
BG = (8, 13, 28)
GRID = (22, 32, 58)
TEXT = (238, 242, 250)
DIM = (120, 132, 160)
NEON = {
    'blue': (64, 156, 255), 'green': (52, 230, 140), 'amber': (255, 184, 48),
    'purple': (168, 112, 255), 'red': (255, 82, 82), 'cyan': (60, 220, 240),
}
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


class Frame:
    """One output frame: a sharp RGB layer at SS x and a glow layer at 1/GQ. Colors may carry alpha (blended)."""

    def __init__(self, bg_img):
        self.img = bg_img.copy()
        self.d = ImageDraw.Draw(self.img, 'RGBA')
        self.glow = Image.new('RGB', (W // GQ, H // GQ), (0, 0, 0))
        self.g = ImageDraw.Draw(self.glow, 'RGBA')
        self.warnings = []
        self.alpha = 1.0   # opacity multiplier for everything drawn (scene fades)
        self.dy = 0.0      # vertical offset for everything drawn (scene slides)

    def _c(self, c):
        if c is None:
            return None
        if len(c) == 3:
            return tuple(c) + (int(255 * self.alpha),)
        return tuple(c[:3]) + (int(c[3] * self.alpha),)

    # sharp layer helpers (coordinates in output pixels)
    def _s(self, *v):
        return [(x + (self.dy if i % 2 else 0)) * SS for i, x in enumerate(v)]

    def rect(self, x, y, w, h, r=0, fill=None, outline=None, width=2, glow=None, glow_a=1.0):
        if w <= 0 or h <= 0:
            return
        box = self._s(x, y, x + w, y + h)
        self.d.rounded_rectangle(box, radius=r * SS, fill=self._c(fill), outline=self._c(outline), width=int(width * SS))
        if glow:
            gb = [v / GQ for v in (x, y + self.dy, x + w, y + h + self.dy)]
            self.g.rounded_rectangle(gb, radius=r / GQ, outline=glow + (int(255 * glow_a * self.alpha),), width=max(1, int(round(width * 2 / GQ))))

    def circle(self, cx, cy, r, fill=None, outline=None, width=2, glow=None, glow_a=1.0):
        if r <= 0:
            return
        self.d.ellipse(self._s(cx - r, cy - r, cx + r, cy + r), fill=self._c(fill), outline=self._c(outline), width=int(width * SS))
        if glow:
            cy += self.dy
            self.g.ellipse([(cx - r) / GQ, (cy - r) / GQ, (cx + r) / GQ, (cy + r) / GQ], fill=glow + (int(200 * glow_a * self.alpha),) if fill else None,
                           outline=glow + (int(255 * glow_a * self.alpha),), width=max(1, int(round(width * 2 / GQ))))

    def line(self, pts, color, width=3, glow=None, glow_a=1.0):
        pts = [(x, y + self.dy) for x, y in pts]
        self.d.line([v * SS for p in pts for v in p], fill=self._c(color), width=int(width * SS), joint='curve')
        if glow:
            self.g.line([v / GQ for p in pts for v in p], fill=glow + (int(255 * glow_a * self.alpha),), width=max(1, int(round(width * 2 / GQ))))

    def poly(self, pts, fill=None, outline=None, width=2, glow=None, glow_a=1.0):
        pts = [(x, y + self.dy) for x, y in pts]
        self.d.polygon([v * SS for p in pts for v in p], fill=self._c(fill), outline=self._c(outline), width=int(width * SS))
        if glow:
            self.g.polygon([v / GQ for p in pts for v in p], outline=glow + (int(255 * glow_a * self.alpha),), width=max(1, int(round(width * 2 / GQ))))

    def text(self, x, y, s, size, color=TEXT, weight=700, anchor='la', tracking=0, glow=None, glow_a=.6, max_w=None):
        """Draws text; x,y is the anchor point (Pillow anchors, e.g. 'mm' centre). Records a warning if it is wider than max_w."""
        w = text_w(s, size, weight, tracking)
        if max_w and w > max_w + 1:
            self.warnings.append(f'text wider than its box ({w:.0f} > {max_w}): "{s}"')
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
        out = base + g * .2 * glow_strength
        out = np.clip(out * fade, 0, 255).astype(np.uint8)
        return out


@lru_cache(maxsize=16)
def background(tint):
    """Dark navy with a subtle grid and a soft radial wash in the scene's tint (cached per tint)."""
    yy, xx = np.mgrid[0:H * SS, 0:W * SS].astype(np.float32) / SS
    c = np.array(NEON.get(tint, NEON['blue']), dtype=np.float32)
    d = np.sqrt(((xx - W / 2) / W) ** 2 + ((yy - 820) / H) ** 2)
    wash = np.clip(1 - d * 1.9, 0, 1) ** 2 * .09
    img = np.array(BG, dtype=np.float32)[None, None, :] * (1 - wash[..., None]) + c[None, None, :] * wash[..., None]
    vign = np.clip(1 - (np.sqrt(((xx - W / 2) / W) ** 2 + ((yy - H / 2) / H) ** 2) - .35) * .9, .55, 1)
    img *= vign[..., None]
    grid = ((xx % 60) < 1.2) | ((yy % 60) < 1.2)
    img[grid] = img[grid] * .55 + np.array(GRID, dtype=np.float32) * .45
    return Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))


def blend_bg(t1, t2, k):
    if k <= 0 or t1 == t2:
        return background(t1)
    if k >= 1:
        return background(t2)
    return Image.blend(background(t1), background(t2), k)


# ---------- fixed furniture ----------
def header(fr, topic, p, alpha=1.0):
    a = int(255 * alpha)
    fr.rect(140, 260, 800, 6, r=3, fill=GRID + (a,))
    if p > 0:
        fr.rect(140, 260, 800 * p, 6, r=3, fill=NEON['green'] + (a,))
    fr.text(W / 2, 300, f'{topic.upper()} · EXPLAINED', 28, color=DIM + (a,), weight=700, anchor='mm', tracking=5)


def chip(fr, label, tint, k):
    """The scene label chip at y≈392; k is its entrance (0..1)."""
    if k <= 0:
        return
    c = NEON[tint]
    w = text_w(label, 26, 800, 6) + 56
    s = .7 + .3 * spring(k * .8)
    ww, hh = w * s, 58 * s
    x, y = W / 2 - ww / 2, 392 - hh / 2
    a = int(255 * min(1, k * 3))
    fr.rect(x, y, ww, hh, r=hh / 2, fill=c + (int(30 * min(1, k * 3)),), outline=c + (int(a * .7),), width=2, glow=c, glow_a=.25 * min(1, k * 3))
    if s > .9:
        fr.text(W / 2, 392, label, 26, color=c + (a,), weight=800, anchor='mm', tracking=6)


def hook_card(fr, title_lines, t, t_out, accent='green'):
    """0–2 s: the question as a big title, three or four lines, then IN 20 SECONDS. Words rise in one by one; the card lifts away at t_out."""
    out = ease_io(prog(t, t_out - .35, t_out))
    if out >= 1:
        return
    size = 104 if max(text_w(l, 104, 800) for l in title_lines) <= 900 else 92
    lh = size * 1.08
    y0 = 860 - lh * (len(title_lines) - 1) / 2 - out * 120
    n = 0
    for li, ln in enumerate(title_lines):
        words = ln.split()
        x = W / 2 - text_w(ln, size, 800) / 2
        for w in words:
            k = ease_out(prog(t, .05 + n * .07, .35 + n * .07))
            col = (NEON[accent] if w.endswith('?') or w.strip('?.,!').isupper() and len(w) > 1 else TEXT)
            a = int(255 * k * (1 - out))
            fr.text(x, y0 + li * lh + (1 - k) * 40, w, size, color=col + (a,), weight=800, anchor='lm',
                    glow=col if col != TEXT else None, glow_a=.15 * k * (1 - out))
            x += text_w(w + ' ', size, 800)
            n += 1
    k = ease_out(prog(t, .6, 1.0))
    a = int(255 * k * (1 - out))
    fr.text(W / 2, y0 + len(title_lines) * lh + 40, 'IN 20 SECONDS', 34, color=NEON[accent] + (a,), weight=800, anchor='mm', tracking=10)
    fr.rect(W / 2 - 60 * k, y0 + len(title_lines) * lh + 82, 120 * k, 4, r=2, fill=NEON[accent] + (a,), glow=NEON[accent], glow_a=.6 * k)


def captions(fr, words, t, line_words, size=72, y=1290, max_w=860):
    """Karaoke captions: spoken words white, the current word green, upcoming words dimmed. line_words: indices into words for this chunk."""
    disp = [words[i]['d'] for i in line_words]
    rows = wrap(disp, size, max_w, 800)
    if len(rows) > 2:
        fr.warnings.append(f'caption needs {len(rows)} lines: "{" ".join(disp)}"')
    lh = size * 1.18
    # exactly one current word: the last one whose onset has passed (held through short pauses)
    cur_j = max((j for j in range(len(line_words)) if words[line_words[j]]['s'] - .03 <= t), default=-1)
    if cur_j >= 0 and t > words[line_words[cur_j]]['e'] + .3:
        cur_j = len(line_words)   # the line is finished: everything white
    for r, row in enumerate(rows):
        s = ' '.join(disp[j] for j in row)
        x = W / 2 - text_w(s, size, 800) / 2
        for j in row:
            w = words[line_words[j]]
            cur = j == cur_j
            done = j < cur_j
            col = NEON['green'] if cur else TEXT if done else (110, 122, 150)
            a = 255 if (cur or done) else 150
            yy = y + r * lh - (6 if cur else 0)
            fr.text(x, yy, w['d'], size, color=col + (a,), weight=800, anchor='lm', glow=NEON['green'] if cur else None, glow_a=.25)
            x += text_w(w['d'] + ' ', size, 800)
