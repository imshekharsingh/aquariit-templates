"""Depth, light and weight for the idea look (14 Nov 2026; owner on showreel-tech-anc-budget: "looks a bit flat, can we do something more
with animation"). The parent review: every scene was a flat shape on a black void, no depth, light or texture. These pieces give every tech
reel in the idea look what the web kit's glass theme has:
- atmosphere(): the background as a lit room, not a void: a warm key light from the top left with two slow light beams, a cool low fill,
  a floor plane under the stage (a lighter ground with a horizon glow), a vignette; painted at 1/8 size (the upscale is the blur);
- motes(): dust in the light at three depths that move with the camera at different rates (parallax), the near ones big and soft;
- shading: sphere() (a lit ball: a radial ramp offset towards the light, a rim, a specular dot), capsule(), soft_shadow() (a contact
  shadow in layers), shade_text() (giant type with a vertical light ramp, a lit top edge and a soft drop shadow), panel() (a lit card);
- post(): bloom from the brightest pixels, a glossy-floor reflection of the stage, motion blur on fast camera moves (zoom-throughs and
  pans; the captions band stays sharp) and a fine film grain.
Cheap by design (no live blur on big layers: the blooms and shadows are painted small and scaled up). Every frame is a pure function of t
(seeded randomness only)."""
import functools
import math
import random

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import gaussian_filter

from . import base as B

W, H, SS = B.W, B.H, B.SS
_LY, _LX = (np.mgrid[0:240, 0:135].astype(np.float32) + .5) * 8
FLOOR_Y = 1420            # where the floor plane starts (world, at zoom 1)


def atmosphere(t, cam=(0.0, 0.0), warm=1.0):
    """The lit room behind every scene, as (full-size SS image, 1/8 array). cam shifts the light a little (it sits far behind the subject)."""
    cx, cy = cam
    img = np.zeros((240, 135, 3), np.float32) + np.array((9, 9, 12), np.float32)
    # the key light: a warm pool, top left, breathing slowly
    kx, ky = 250 + 60 * math.sin(t * .31) - cx * .15, 520 + 40 * math.sin(t * .23 + 1) - cy * .15
    g = np.clip(1 - np.sqrt(((_LX - kx) / 1.0) ** 2 + ((_LY - ky) / 1.25) ** 2) / 820, 0, 1) ** 2.2
    img += np.array((70, 52, 26), np.float32) * g[..., None] * warm
    # two soft beams from the top left corner, slowly sweeping
    for j, (ang, wd, a) in enumerate(((.98, 120, 26), (1.22, 80, 18))):
        th = ang + .05 * math.sin(t * .4 + j * 2)
        dx, dy = math.cos(th), math.sin(th)
        px, py = _LX - (-120 - cx * .1), _LY - (-200)
        along = px * dx + py * dy
        perp = np.abs(-px * dy + py * dx)
        k = np.clip(1 - perp / (wd + along * .12), 0, 1) ** 1.6 * np.clip(along / 600, 0, 1) * np.clip(1 - along / 2600, 0, 1)
        img += np.array((a * 1.1, a * .9, a * .6), np.float32) * k[..., None] * warm
    # a cool, low fill from the lower right (low saturation, behind the subject)
    g2 = np.clip(1 - np.sqrt(((_LX - 980) / 1.0) ** 2 + ((_LY - 1250) / 1.4) ** 2) / 700, 0, 1) ** 2
    img += np.array((10, 16, 26), np.float32) * g2[..., None]
    # the floor: a slightly lighter ground below FLOOR_Y with a horizon glow (the stage stands on something)
    fy = FLOOR_Y - cy * .4
    fl = np.clip((_LY - fy) / 60, 0, 1)
    hz = np.exp(-((_LY - fy) / 40) ** 2)
    img += np.array((16, 13, 9), np.float32) * fl[..., None] * np.clip(1 - (_LY - fy) / 700, .2, 1)[..., None]
    img += np.array((40, 32, 18), np.float32) * hz[..., None] * np.clip(1 - np.abs(_LX - 540) / 700, 0, 1)[..., None]
    v = np.clip(np.sqrt(((_LX - 540) / 540) ** 2 + ((_LY - 960) / 960) ** 2) - .5, 0, 1)
    img = img * (1 - .6 * v[..., None])
    small = np.clip(img, 0, 255).astype(np.uint8)
    return Image.fromarray(small).resize((W * SS, H * SS), Image.BICUBIC), small


def motes(fr, t, cam=(0.0, 0.0), n=34, a=1.0):
    """Dust in the light at three depths: far (small, dim, slow parallax), mid, near (big, soft, fast parallax, passing close to the lens)."""
    d = fr.d
    for i in range(n):
        rr = random.Random(9000 + i)
        depth = (.25, .6, 1.6)[i % 3]
        x0, y0 = rr.uniform(-100, 1180), rr.uniform(300, 1700)
        vx, vy = rr.uniform(-14, 14), rr.uniform(-22, -6)
        x = (x0 + vx * t + 26 * math.sin(t * .5 + i) - cam[0] * depth) % 1280 - 100
        y = (y0 + vy * t * depth - cam[1] * depth) % 1500 + 300
        r = (2.0, 3.4, 9.0)[i % 3] * rr.uniform(.8, 1.2)
        tw = .55 + .45 * math.sin(t * rr.uniform(1, 2.4) + i)
        al = (60, 90, 34)[i % 3] * tw * a
        # brighter inside the key light's beam (top left)
        al *= .55 + .9 * max(0.0, 1 - math.hypot(x - 300, y - 650) / 900)
        if i % 3 == 2:   # near: a soft disc in three layers (a cheap blur)
            for k, f in ((1.0, .35), (.7, .6), (.4, 1.0)):
                rad = r * k * SS
                d.ellipse([x * SS - rad, y * SS - rad, x * SS + rad, y * SS + rad], fill=(255, 236, 200, int(al * f)))
        else:
            rad = r * SS
            d.ellipse([x * SS - rad, y * SS - rad, x * SS + rad, y * SS + rad], fill=(255, 240, 210, int(al)))


# ---------- shading (drawn through an idea.Cam: world px) ----------
def soft_shadow(cm, cx, cy, rx, ry, a=150):
    """A contact shadow: stacked ellipses, dark in the middle, soft at the edge."""
    for k in range(6):
        f = 1 - k / 6
        cm_ellipse(cm, cx, cy, rx * (1.0 - .12 * k), ry * (1.0 - .12 * k), (0, 0, 0, int(a * .22 * (1 - f * .5))))


def cm_ellipse(cm, cx, cy, rx, ry, fill=None, outline=None, width=2):
    if cm.a <= .004 or rx * cm.z < .3:
        return
    x0, y0 = cm.P(cx - rx, cy - ry)
    x1, y1 = cm.P(cx + rx, cy + ry)
    cm.d_.ellipse([x0, y0, x1, y1], fill=cm.c(fill), outline=cm.c(outline), width=max(1, int(width * cm.z * SS)))


def sphere(cm, cx, cy, r, dark, light, rim=None, spec=True, light_dir=(-.45, -.55), n=12, ry=None):
    """A lit ball (or an ellipsoid, ry): a radial ramp from dark at the edge to light near the light's side, a rim light on the far side,
    a specular dot."""
    ry = r if ry is None else ry
    lx, ly = light_dir
    for k in range(n):
        f = k / (n - 1)
        rr, rry = r * (1 - .78 * f), ry * (1 - .78 * f)
        ox, oy = lx * r * .42 * f, ly * ry * .42 * f
        cm_ellipse(cm, cx + ox, cy + oy, rr, rry, fill=B.mixc(dark, light, f ** 1.3))
    if rim:
        x0, y0 = cm.P(cx - r * .97, cy - ry * .97)
        x1, y1 = cm.P(cx + r * .97, cy + ry * .97)
        if cm.a > .004:
            cm.d_.arc([x0, y0, x1, y1], -40, 75, fill=cm.c(rim), width=max(1, int(r * .07 * cm.z * SS)))
    if spec:
        cm_ellipse(cm, cx + lx * r * .5, cy + ly * ry * .55, r * .16, ry * .1, fill=(255, 255, 255, 150))
        cm_ellipse(cm, cx + lx * r * .5, cy + ly * ry * .55, r * .08, ry * .05, fill=(255, 255, 255, 230))


def capsule(cm, x, y, w, h, dark, light, rim=None, n=8):
    """A vertical rounded bar lit from the left: strips from dark (right) to light (left), a highlight line, a rim on the right."""
    for k in range(n):
        f = k / (n - 1)
        ww = w * (1 - .7 * f)
        cm.rect(x + (w - ww) * .25, y + w * .1 * f, ww, h - w * .2 * f, r=ww / 2, fill=B.mixc(dark, light, f ** 1.2))
    cm.rect(x + w * .2, y + w * .5, w * .1, h - w, r=w * .05, fill=(255, 255, 255, 90))
    if rim:
        cm.rect(x + w * .86, y + w * .45, w * .07, h - w * .9, r=w * .035, fill=rim)


def panel(cm, x, y, w, h, r=40, edge=(70, 70, 80), lit=1.0, gold=False):
    """A lit card: a soft drop shadow, a body darker at the bottom, a lighter top half, a lit top rim and a thin edge."""
    for k in range(5):
        cm.rect(x - 6 + k * 3, y + 22 + k * 4, w + 12 - k * 6, h, r=r + 6, fill=(0, 0, 0, 34))
    cm.rect(x, y, w, h, r=r, fill=(20, 20, 25))
    for k in range(6):
        f = k / 5
        cm.rect(x + 2, y + 2, w - 4, (h - 4) * (1 - .55 * f), r=r - 2, fill=(255, 255, 255, int(5 * lit)))
    cm.rect(x + r * .6, y + 3, w - r * 1.2, 4, r=2, fill=(255, 255, 255, int(70 * lit)))
    cm.rect(x, y, w, h, r=r, outline=(236, 192, 98) if gold else edge, width=4 if gold else 2)


@functools.lru_cache(maxsize=64)
def _font(size, weight):
    return B.font(size, weight)


def shade_text(fr, X, Y, s, size, top, bot, alpha=1.0, weight=900, anchor='mm', shadow=.6, edge=None):
    """Giant type with light: a vertical ramp from top to bot through a mask, a lit top edge (edge colour), and a soft drop shadow painted
    small and scaled up. (X, Y) and size in frame px."""
    if alpha <= .02 or size < 6:
        return
    f = _font(round(size * 4) / 4, weight)
    l, t_, r, b = f.getbbox(s, anchor=anchor)
    pad = int(size * .25 * SS)
    x0, y0 = int(X * SS + l) - pad, int(Y * SS + t_) - pad
    w, h = int(r - l) + 2 * pad, int(b - t_) + 2 * pad
    m = Image.new('L', (w, h), 0)
    ImageDraw.Draw(m).text((X * SS - x0, Y * SS - y0), s, font=f, fill=255, anchor=anchor)
    if shadow > 0:
        q = 6
        sm = m.resize((max(1, w // q), max(1, h // q)), Image.BILINEAR).filter(ImageFilter.GaussianBlur(2.2)).resize((w, h), Image.BILINEAR)
        sm = sm.point(lambda v: int(v * shadow * alpha))
        off = int(size * .07 * SS)
        fr.img.paste((0, 0, 0), (x0, y0 + off, x0 + w, y0 + off + h), sm)
    # the ramp, top to bottom of the glyphs
    gt, gb = pad, h - pad
    ramp = np.zeros((h, 1, 3), np.float32)
    ys = np.clip((np.arange(h) - gt) / max(1, gb - gt), 0, 1)[:, None]
    ramp[:, 0, :] = np.array(top, np.float32)[None] * (1 - ys) + np.array(bot, np.float32)[None] * ys
    fill = Image.fromarray(np.repeat(ramp, w, 1).astype(np.uint8))
    ma = m if alpha >= .99 else m.point(lambda v: int(v * alpha))
    fr.img.paste(fill, (x0, y0, x0 + w, y0 + h), ma)
    if edge is not None:   # a lit top edge: the mask minus itself shifted down
        sh = int(max(2, size * .025) * SS)
        e = np.asarray(m, np.int16)
        e2 = np.zeros_like(e)
        e2[sh:] = e[:-sh]
        em = Image.fromarray(np.clip(e - e2, 0, 255).astype(np.uint8)).point(lambda v: int(v * .8 * alpha))
        fr.img.paste(tuple(edge), (x0, y0, x0 + w, y0 + h), em)


# ---------- post: bloom, the floor reflection, motion blur, grain ----------
_GRAIN = []


def _grain(i):
    if not _GRAIN:
        for k in range(6):
            rng = np.random.default_rng(4100 + k)
            g = rng.normal(0, 3.2, (H // 2, W // 2)).astype(np.float32)
            g = np.repeat(np.repeat(g, 2, 0), 2, 1) * .55 + rng.normal(0, 1.6, (H, W)).astype(np.float32)
            _GRAIN.append(g[..., None])
    return _GRAIN[i % len(_GRAIN)]


_RMASK = {}


def reflect(fr, y_src=1140, y_dst=1520, h=300, a=.13):
    """A glossy floor: the stage's lower band, flipped and faded, painted under the caption band (the lower third is never a void)."""
    key = (h, a)
    if key not in _RMASK:
        k = np.clip(1 - np.arange(h * SS) / (h * SS), 0, 1) ** 1.6 * 255 * a
        _RMASK[key] = Image.fromarray(np.repeat(k[:, None], W * SS, 1).astype(np.uint8))
    src = fr.img.crop((0, y_src * SS, W * SS, (y_src + h) * SS)).transpose(Image.FLIP_TOP_BOTTOM)
    fr.img.paste(src, (0, y_dst * SS), _RMASK[key])


def post(img, t, zoom=0.0, pan=0.0, focus=(540, 975), sharp=(1340, 1560)):
    """img: the finished RGB uint8 frame. zoom: the camera's zoom change per frame (log ratio), pan: px per frame; both blur the frame
    outside the caption band (sharp rows) along the move. Then the bloom and the grain."""
    out = img.astype(np.float32)
    zb = min(.09, abs(zoom) * 2.2)
    pb = min(60.0, abs(pan) * .8)
    if zb > .004 or pb > 2:
        pim = Image.fromarray(img)
        acc = out.copy()
        n = 4
        for k in range(1, n):
            if zb > .004:
                s = 1 + zb * k / n * (1 if zoom > 0 else -1)
                fx, fy = focus
                a, c, f = 1 / s, fx - fx / s, fy - fy / s
                im2 = pim.transform((W, H), Image.AFFINE, (a, 0, c, 0, a, f), resample=Image.BILINEAR)
            else:
                sx = pb * k / n * (1 if pan > 0 else -1)
                im2 = pim.transform((W, H), Image.AFFINE, (1, 0, sx, 0, 1, 0), resample=Image.BILINEAR)
            acc += np.asarray(im2, np.float32)
        bl = acc / n
        r0, r1 = sharp
        bl[:560] = out[:560]   # the HUD (progress, pill, tag row) stays sharp, as do the captions
        bl[r0:r1] = out[r0:r1]
        out = bl
    # bloom from the brightest pixels (gold accents, highlights), painted at 1/8 and scaled up
    sm = out[4::8, 4::8]
    lum = sm @ np.array((.2126, .7152, .0722), np.float32)
    k = np.clip((lum - 165) / 90, 0, 1) ** 2
    bl = gaussian_filter(sm * k[..., None], sigma=(2.4, 2.4, 0))
    big = np.asarray(Image.fromarray(np.clip(bl, 0, 255).astype(np.uint8)).resize((W, H), Image.BILINEAR), np.float32)
    out += big * .55
    out += _grain(int(round(t * 30)))
    return np.clip(out, 0, 255).astype(np.uint8)
