"""Icon library: simple neon line icons built from shapes (no images, no brand marks). Every icon is icon(fr, name, cx, cy, size, color, a)
where size is the icon's box in output pixels and a is opacity 0..1. Add an icon by writing one function and listing it in ICONS."""
import inspect
import math

from .base import SS, TEXT


def _c(color, a):
    return color + (int(255 * max(0, min(1, a))),)


def fr_arc(fr, box, a0, a1, col, width):
    x0, y0, x1, y1 = box
    fr.d.arc([x0 * SS, (y0 + fr.dy) * SS, x1 * SS, (y1 + fr.dy) * SS], a0, a1, fill=fr._c(col), width=width)


def fr_chord(fr, box, a0, a1, col, width):
    x0, y0, x1, y1 = box
    fr.d.chord([x0 * SS, (y0 + fr.dy) * SS, x1 * SS, (y1 + fr.dy) * SS], a0, a1, outline=fr._c(col), width=width)


def _sw(size):
    return max(2.5, size * .055)


def bot(fr, cx, cy, s, col, a):
    w = _sw(s)
    fr.rect(cx - s * .36, cy - s * .22, s * .72, s * .52, r=s * .14, outline=_c(col, a), width=w, glow=col, glow_a=a * .5)
    fr.circle(cx - s * .14, cy + s * .02, s * .06, fill=_c(col, a))
    fr.circle(cx + s * .14, cy + s * .02, s * .06, fill=_c(col, a))
    fr.line([(cx, cy - s * .22), (cx, cy - s * .38)], _c(col, a), w)
    fr.circle(cx, cy - s * .42, s * .05, fill=_c(col, a))
    fr.line([(cx - s * .12, cy + s * .17), (cx + s * .12, cy + s * .17)], _c(col, a), w)


def store(fr, cx, cy, s, col, a, doors=0.0):
    """A storefront; doors 0 (closed) .. 1 (open)."""
    w = _sw(s)
    fr.rect(cx - s * .44, cy - s * .18, s * .88, s * .6, r=s * .04, outline=_c(col, a), width=w, glow=col, glow_a=a * .5)
    # awning: a row of scallops
    for i in range(5):
        x0 = cx - s * .46 + i * s * .184
        fr.poly([(x0, cy - s * .18), (x0 + s * .184, cy - s * .18), (x0 + s * .17, cy - s * .36), (x0 + s * .014, cy - s * .36)], outline=_c(col, a), width=w * .8,
                fill=_c(col, a * (.5 if i % 2 == 0 else .12)))
    dw = s * .15 * (1 - doors)
    fr.rect(cx - s * .15, cy + s * .08, dw, s * .34, outline=_c(col, a), width=w * .8)
    fr.rect(cx + s * .15 - dw, cy + s * .08, dw, s * .34, outline=_c(col, a), width=w * .8)
    fr.rect(cx - s * .15, cy + s * .08, s * .3, s * .34, outline=_c(col, a * .5), width=w * .5)


def cart(fr, cx, cy, s, col, a):
    w = _sw(s)
    fr.line([(cx - s * .42, cy - s * .3), (cx - s * .3, cy - s * .3), (cx - s * .2, cy + s * .14), (cx + s * .32, cy + s * .14), (cx + s * .4, cy - s * .18), (cx - s * .26, cy - s * .18)], _c(col, a), w, glow=col, glow_a=a * .5)
    fr.circle(cx - s * .14, cy + s * .3, s * .07, outline=_c(col, a), width=w)
    fr.circle(cx + s * .24, cy + s * .3, s * .07, outline=_c(col, a), width=w)


def card(fr, cx, cy, s, col, a):
    w = _sw(s)
    fr.rect(cx - s * .44, cy - s * .28, s * .88, s * .56, r=s * .08, outline=_c(col, a), width=w, glow=col, glow_a=a * .5)
    fr.rect(cx - s * .44, cy - s * .14, s * .88, s * .11, fill=_c(col, a * .7))
    fr.rect(cx - s * .32, cy + s * .08, s * .24, s * .1, r=s * .03, fill=_c(col, a * .8))


def lock(fr, cx, cy, s, col, a):
    w = _sw(s)
    fr.rect(cx - s * .3, cy - s * .04, s * .6, s * .44, r=s * .08, outline=_c(col, a), width=w, glow=col, glow_a=a * .5)
    fr_arc(fr, (cx - s * .2, cy - s * .38, cx + s * .2, cy + s * .02), 180, 360, _c(col, a), int(w * SS))
    fr.line([(cx - s * .2, cy - s * .18), (cx - s * .2, cy - s * .04)], _c(col, a), w)
    fr.line([(cx + s * .2, cy - s * .18), (cx + s * .2, cy - s * .04)], _c(col, a), w)
    fr.circle(cx, cy + s * .16, s * .05, fill=_c(col, a))


def shield(fr, cx, cy, s, col, a, fill=0.0):
    w = _sw(s)
    pts = [(cx, cy - s * .44), (cx + s * .36, cy - s * .3), (cx + s * .32, cy + s * .1), (cx, cy + s * .44), (cx - s * .32, cy + s * .1), (cx - s * .36, cy - s * .3)]
    fr.poly(pts, fill=_c(col, a * fill * .25) if fill else None, outline=_c(col, a), width=w, glow=col, glow_a=a * .5)


def check(fr, cx, cy, s, col, a, k=1.0):
    """A tick drawn progressively (k 0..1)."""
    w = _sw(s) * 1.4
    p1, p2, p3 = (cx - s * .3, cy), (cx - s * .08, cy + s * .22), (cx + s * .34, cy - s * .24)
    if k <= .4:
        e = k / .4
        fr.line([p1, (p1[0] + (p2[0] - p1[0]) * e, p1[1] + (p2[1] - p1[1]) * e)], _c(col, a), w, glow=col, glow_a=a * .5)
    else:
        e = (k - .4) / .6
        fr.line([p1, p2, (p2[0] + (p3[0] - p2[0]) * e, p2[1] + (p3[1] - p2[1]) * e)], _c(col, a), w, glow=col, glow_a=a * .5)


def cross(fr, cx, cy, s, col, a, k=1.0):
    w = _sw(s) * 1.4
    e = min(1, k * 2)
    fr.line([(cx - s * .3, cy - s * .3), (cx - s * .3 + s * .6 * e, cy - s * .3 + s * .6 * e)], _c(col, a), w, glow=col, glow_a=a * .5)
    if k > .5:
        e = (k - .5) * 2
        fr.line([(cx + s * .3, cy - s * .3), (cx + s * .3 - s * .6 * e, cy - s * .3 + s * .6 * e)], _c(col, a), w, glow=col, glow_a=a * .5)


def user(fr, cx, cy, s, col, a):
    w = _sw(s)
    fr.circle(cx, cy - s * .16, s * .16, outline=_c(col, a), width=w, glow=col, glow_a=a * .5)
    fr_arc(fr, (cx - s * .32, cy + s * .06, cx + s * .32, cy + s * .62), 180, 360, _c(col, a), int(w * SS))


def chat(fr, cx, cy, s, col, a):
    w = _sw(s)
    fr.rect(cx - s * .4, cy - s * .3, s * .8, s * .48, r=s * .14, outline=_c(col, a), width=w, glow=col, glow_a=a * .5)
    fr.poly([(cx - s * .2, cy + s * .18), (cx - s * .3, cy + s * .36), (cx - s * .02, cy + s * .18)], fill=_c(col, a))
    for i in range(3):
        fr.circle(cx - s * .16 + i * s * .16, cy - s * .06, s * .045, fill=_c(col, a))


def gate(fr, cx, cy, s, col, a, k=1.0):
    """An arch with a scanning bar: the gateway."""
    w = _sw(s)
    fr.line([(cx - s * .38, cy + s * .42), (cx - s * .38, cy - s * .1)], _c(col, a), w * 1.3, glow=col, glow_a=a * .5)
    fr.line([(cx + s * .38, cy + s * .42), (cx + s * .38, cy - s * .1)], _c(col, a), w * 1.3, glow=col, glow_a=a * .5)
    fr_arc(fr, (cx - s * .38, cy - s * .48, cx + s * .38, cy + s * .28), 180, 360, _c(col, a), int(w * 1.3 * SS))
    yb = cy - s * .05 + s * .42 * (.5 + .5 * math.sin(k * math.tau))
    fr.line([(cx - s * .3, yb), (cx + s * .3, yb)], _c(col, a * .8), w * .8, glow=col, glow_a=a * .5)


def coin(fr, cx, cy, s, col, a):
    w = _sw(s)
    fr.circle(cx, cy, s * .36, outline=_c(col, a), width=w, glow=col, glow_a=a * .5)
    fr.text(cx, cy, '$', s * .44, color=_c(col, a), weight=800, anchor='mm')


def doc(fr, cx, cy, s, col, a):
    w = _sw(s)
    fr.rect(cx - s * .3, cy - s * .4, s * .6, s * .8, r=s * .06, outline=_c(col, a), width=w, glow=col, glow_a=a * .5)
    for i in range(4):
        fr.line([(cx - s * .18, cy - s * .2 + i * s * .14), (cx + s * (.18 if i < 3 else .02), cy - s * .2 + i * s * .14)], _c(col, a * .8), w * .8)


def bolt(fr, cx, cy, s, col, a):
    fr.poly([(cx + s * .06, cy - s * .44), (cx - s * .24, cy + s * .06), (cx - s * .02, cy + s * .06), (cx - s * .08, cy + s * .44), (cx + s * .24, cy - s * .08), (cx + s * .02, cy - s * .08)],
            fill=_c(col, a * .3), outline=_c(col, a), width=_sw(s), glow=col, glow_a=a * .5)


def warning(fr, cx, cy, s, col, a):
    w = _sw(s)
    fr.poly([(cx, cy - s * .4), (cx + s * .42, cy + s * .34), (cx - s * .42, cy + s * .34)], outline=_c(col, a), width=w, glow=col, glow_a=a * .5)
    fr.line([(cx, cy - s * .12), (cx, cy + s * .12)], _c(col, a), w * 1.2)
    fr.circle(cx, cy + s * .22, s * .035, fill=_c(col, a))


def key(fr, cx, cy, s, col, a):
    w = _sw(s)
    fr.circle(cx - s * .2, cy, s * .16, outline=_c(col, a), width=w, glow=col, glow_a=a * .5)
    fr.line([(cx - s * .04, cy), (cx + s * .4, cy)], _c(col, a), w, glow=col, glow_a=a * .5)
    fr.line([(cx + s * .28, cy), (cx + s * .28, cy + s * .14)], _c(col, a), w)
    fr.line([(cx + s * .38, cy), (cx + s * .38, cy + s * .1)], _c(col, a), w)


def chip(fr, cx, cy, s, col, a):
    w = _sw(s)
    fr.rect(cx - s * .28, cy - s * .28, s * .56, s * .56, r=s * .06, outline=_c(col, a), width=w, glow=col, glow_a=a * .5)
    fr.rect(cx - s * .12, cy - s * .12, s * .24, s * .24, fill=_c(col, a * .6))
    for i in range(3):
        o = -s * .16 + i * s * .16
        for (x1, y1, x2, y2) in [(cx + o, cy - s * .28, cx + o, cy - s * .4), (cx + o, cy + s * .28, cx + o, cy + s * .4),
                                 (cx - s * .28, cy + o, cx - s * .4, cy + o), (cx + s * .28, cy + o, cx + s * .4, cy + o)]:
            fr.line([(x1, y1), (x2, y2)], _c(col, a), w * .8)


def cloud(fr, cx, cy, s, col, a):
    w = _sw(s)
    for (dx, dy, r) in [(-.18, .04, .2), (.06, -.08, .26), (.26, .06, .18)]:
        fr.circle(cx + s * dx, cy + s * dy, s * r, outline=_c(col, a), width=w, glow=col, glow_a=a * .5)
    fr.rect(cx - s * .38, cy + s * .04, s * .82, s * .2, fill=_c((8, 13, 28), a))
    fr.line([(cx - s * .38, cy + s * .24), (cx + s * .44, cy + s * .24)], _c(col, a), w)


def eye(fr, cx, cy, s, col, a):
    w = _sw(s)
    fr_chord(fr, (cx - s * .44, cy - s * .32, cx + s * .44, cy + s * .32), 200, 340, _c(col, a), int(w * SS))
    fr_chord(fr, (cx - s * .44, cy - s * .32, cx + s * .44, cy + s * .32), 20, 160, _c(col, a), int(w * SS))
    fr.circle(cx, cy, s * .12, fill=_c(col, a), glow=col, glow_a=a * .5)


ICONS = {f.__name__: f for f in (bot, store, cart, card, lock, shield, check, cross, user, chat, gate, coin, doc, bolt, warning, key, chip, cloud, eye)}


def icon(fr, name, cx, cy, size, color, a=1.0, **kw):
    if a <= 0.01:
        return
    f = ICONS[name]
    ok = inspect.signature(f).parameters   # a scene may animate any icon (k=...); icons without that motion just draw still
    f(fr, cx, cy, size, color, a, **{x: v for x, v in kw.items() if x in ok})
