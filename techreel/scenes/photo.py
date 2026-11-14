"""The photo stage for @techin20sec (14 Nov 2026; owner: "yes to free real images ... take those and work or animate your design around it").
Real free-licence photos (the topic's "media" list, fetched and licence-checked by the Media workflow, pulled to techreel/media/<slug>/ at render
time) become the hero of a scene: drawn through the idea look's camera (Cam: zoom about a focus + drift), so they push in and parallax with
the rest of the world; a cut-out (the entry's "fg", a PNG with alpha) is a real product we place, scale and float like a drawn one. Every photo
is graded once to the channel's dark premium look (a little less saturation, deeper shadows, a warm key) so it sits with the gold accent.
Missing files (a stills run before the Media workflow) fall back to the drawn version: has() is False."""
import os

from PIL import Image, ImageDraw, ImageEnhance

from . import base as B

W, H, SS = B.W, B.H, B.SS
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOPIC = [None]
_IM, _FG, _MASK = {}, {}, {}


def setup(topic):
    TOPIC[0] = topic


def _entry(mid):
    t = TOPIC[0] or {}
    return next((e for e in t.get('media', []) if e.get('id') == mid and e.get('file')), None)


def view(mid):
    """The entry's framing point (u, v), "view": [u, v] in the topic (e.g. keep an airline's seat emblem out of frame)."""
    e = _entry(mid) or {}
    v = e.get('view') or [.5, .5]
    return v[0], v[1]


def _path(f):
    return os.path.join(HERE, 'media', (TOPIC[0] or {}).get('slug', ''), f)


def has(mid, fg=False):
    e = _entry(mid)
    f = e and (e.get('fg') if fg else e.get('file'))
    return bool(f) and os.path.exists(_path(f))


def grade(im, sat=.82, bright=.82, contrast=1.08, warm=(1.04, 1.0, .93)):
    im = ImageEnhance.Color(im).enhance(sat)
    im = ImageEnhance.Contrast(im).enhance(contrast)
    im = ImageEnhance.Brightness(im).enhance(bright)
    r, g, b = im.split()[:3]
    r, g, b = (ch.point(lambda v, k=k: min(255, int(v * k))) for ch, k in zip((r, g, b), warm))
    return Image.merge('RGB', (r, g, b))


def load(mid):
    if mid not in _IM:
        e = _entry(mid)
        im = Image.open(_path(e['file'])).convert('RGB')
        g = e.get('grade') or {}
        _IM[mid] = grade(im, g.get('sat', .82), g.get('bright', .82), g.get('contrast', 1.08))
    return _IM[mid]


def load_fg(mid):
    if mid not in _FG:
        e = _entry(mid)
        im = Image.open(_path(e['fg'])).convert('RGBA')
        im = cover(im, e.get('cover') or [])
        bb = im.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()   # trimmed to the product
        if bb:
            im = im.crop(bb)
        rgb = grade(im.convert('RGB'), .9, .95, 1.1, (1.02, 1.0, .97))
        rgb.putalpha(im.getchannel('A'))
        _FG[mid] = rgb
    return _FG[mid]


def cover(im, spots):
    """Paint out small marks (a maker's emblem on a product): each spot [u, v, r] (fractions of the width) is filled with the median colour
    of the ring just outside it, feathered, so the product reads generic (CLAUDE.md: no logos or trade dress)."""
    if not spots:
        return im
    import numpy as np
    from PIL import ImageFilter
    a = np.array(im).astype(np.float32)
    H_, W_ = a.shape[:2]
    yy, xx = np.mgrid[0:H_, 0:W_]
    for u, v, r in spots:
        cx, cy, R = u * W_, v * H_, r * W_
        d = np.hypot(xx - cx, yy - cy)
        ring = (d > R * 1.15) & (d < R * 1.6) & (a[..., 3] > 200)
        if not ring.any():
            continue
        col = np.median(a[ring][:, :3], axis=0)
        m = np.clip((R * 1.08 - d) / (R * .25), 0, 1)[..., None]
        a[..., :3] = a[..., :3] * (1 - m) + col * m
    return Image.fromarray(a.astype(np.uint8), 'RGBA')


def _round_mask(w, h, r, a):
    key = (w, h, r, a)
    if key not in _MASK:
        m = Image.new('L', (w, h), 0)
        ImageDraw.Draw(m).rounded_rectangle([0, 0, w - 1, h - 1], radius=r, fill=a)
        if len(_MASK) > 64:
            _MASK.clear()
        _MASK[key] = m
    return _MASK[key]


def rect(cm, mid, x, y, w, h, view=(.5, .5, 1.0), a=1.0, r=0):
    """The photo cover-fitted into the world box (x, y, w, h) through the camera; view (u, v, z): the photo's point (0..1) at the box's
    centre and a zoom (1 = cover). Opacity a times the camera's; corner radius r (world px)."""
    al = a * cm.a
    if al <= .004:
        return
    X0, Y0 = cm.P(x, y)
    X1, Y1 = cm.P(x + w, y + h)
    bw, bh = X1 - X0, Y1 - Y0
    if bw < 4 or bh < 4:
        return
    im = load(mid)
    iw, ih = im.size
    u, v, z = view
    s = max(bw / iw, bh / ih) * max(1.0, z)
    sw, sh = bw / s, bh / s
    cx = min(max(u * iw, sw / 2), iw - sw / 2)
    cy = min(max(v * ih, sh / 2), ih - sh / 2)
    sx0, sy0 = cx - sw / 2, cy - sh / 2
    FX0, FY0, FX1, FY1 = max(0, int(X0)), max(0, int(Y0)), min(W * SS, int(X1)), min(H * SS, int(Y1))
    if FX1 - FX0 < 2 or FY1 - FY0 < 2:
        return
    src = (sx0 + (FX0 - X0) / s, sy0 + (FY0 - Y0) / s, sx0 + (FX1 - X0) / s, sy0 + (FY1 - Y0) / s)
    part = im.transform((FX1 - FX0, FY1 - FY0), Image.EXTENT, src, Image.BILINEAR)
    A = int(255 * min(1.0, al))
    if r > 0:
        full = _round_mask(int(bw), int(bh), int(r * cm.z * SS), A)
        mask = full.crop((FX0 - int(X0), FY0 - int(Y0), FX0 - int(X0) + part.size[0], FY0 - int(Y0) + part.size[1]))
    else:
        mask = Image.new('L', part.size, A)
    cm.fr.img.paste(part, (FX0, FY0), mask)


def shade(cm, x, y, w, h, top=.55, bottom=.0, col=(8, 8, 11)):
    """A dark ramp over a photo box (top -> bottom opacity), so type and signs on it stay readable."""
    n = 12
    for i in range(n):
        k = i / (n - 1)
        al = top + (bottom - top) * k
        if al > .01:
            cm.rect(x, y + h * i / n, w, h / n + 1, fill=col + (int(255 * al),))


def sprite(cm, mid, cx, cy, h, a=1.0, shadow=True):
    """The cut-out product (the entry's fg) centred on (cx, cy), h world px tall, through the camera; a soft contact shadow under it."""
    al = a * cm.a
    if al <= .004:
        return
    fg = load_fg(mid)
    hh = h * cm.z * SS
    if hh < 4:
        return
    ww = hh * fg.size[0] / fg.size[1]
    X, Y = cm.P(cx, cy)
    if shadow:
        from . import depth as D
        D.soft_shadow(cm, cx + h * .04, cy + h * .52, h * .5 * fg.size[0] / fg.size[1], h * .07, int(170 * min(1.0, a)))
    im = fg.resize((max(1, int(ww)), max(1, int(hh))), Image.BILINEAR)
    m = im.getchannel('A')
    if al < .999:
        m = m.point(lambda v: int(v * al))
    cm.fr.img.paste(im.convert('RGB'), (int(X - ww / 2), int(Y - hh / 2)), m)
