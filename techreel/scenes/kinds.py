"""Scene kinds: each is a visual metaphor built from shapes, animated against the scene's local time and the spoken words.
A topic file picks a kind per scene and fills its params. Every kind is draw(fr, sc, t) where sc is a Scene (start, end, tint, params,
cue(word) -> time the word is spoken, or the scene start if missing). Content stays inside CONTENT_TOP..CONTENT_BOTTOM.
Add a kind by writing one function and listing it in KINDS."""
import math

from .base import W, NEON, TEXT, DIM, CONTENT_TOP, CONTENT_BOTTOM, prog, ease_out, ease_io, spring, mix, text_w
from .icons import icon

SURFACE = (18, 26, 48)
EDGE = .55   # outline strength: borders are quiet, the content carries the colour


def _a(c, a):
    return c + (int(255 * max(0, min(1, a))),)


def pill(fr, cx, cy, label, col, a, size=30, solid=False, max_w=420):
    w = min(max_w, text_w(label, size, 800) + size * 1.4)
    h = size * 1.9
    fr.rect(cx - w / 2, cy - h / 2, w, h, r=h / 2, fill=_a(col, a * (.9 if solid else .12)), outline=_a(col, a * EDGE), width=2, glow=col, glow_a=a * .2)
    fr.text(cx, cy, label, size, color=_a((8, 13, 28) if solid else TEXT, a), weight=800, anchor='mm', max_w=max_w - size)
    return w


def box(fr, x, y, w, h, col, a, r=28):
    fr.rect(x, y, w, h, r=r, fill=_a(SURFACE, a * .95), outline=_a(col, a * EDGE), width=2, glow=col, glow_a=a * .15)


def appear(t, t0, d=.35):
    return ease_out(prog(t, t0, t0 + d))


# ---------- kinds ----------
def portal(fr, sc, t):
    """A place opens its doors and agents walk in. params: icon, pills[], guest, n, open (cue word)."""
    p = sc.params
    col = NEON[sc.tint]
    k = spring(t - sc.start - .05)
    s = 330 * (.6 + .4 * k)
    cy = 740
    doors = ease_io(prog(t, sc.cue(p.get('open')) , sc.cue(p.get('open')) + .5))
    icon(fr, p.get('icon', 'store'), W / 2, cy, s, col, min(1, k * 2), doors=doors) if p.get('icon', 'store') == 'store' else icon(fr, p['icon'], W / 2, cy, s, col, min(1, k * 2))
    for i, label in enumerate(p.get('pills', [])):
        n = len(p['pills'])
        x = W / 2 + (i - (n - 1) / 2) * 330
        pill(fr, x, 1010, label, col, appear(t, sc.start + .25 + i * .12), size=32, max_w=310)
    # guests walk in from the left, one after another, and shrink into the doorway
    g0 = sc.cue(p.get('open')) + .1
    for i in range(p.get('n', 3)):
        e = ease_io(prog(t, g0 + i * .28, g0 + i * .28 + 1.0))
        if e <= 0 or e >= 1:
            continue
        x = mix(80, W / 2, e)
        y = mix(cy + 150, cy + 80, e) - abs(math.sin(e * math.pi * 3)) * 18
        icon(fr, p.get('guest', 'bot'), x, y, 110 * (1 - .55 * e), NEON[p.get('guest_tint', 'green')], 1 - max(0, (e - .85) / .15))


def flow(fr, sc, t):
    """Sources connect through a hub to a target, with data dots travelling. params: sources[], hub{label,tag,icon}, target{icon,label}, hub_cue."""
    p = sc.params
    col = NEON[sc.tint]
    srcs = p.get('sources', [])
    hub_t = sc.cue(p.get('hub_cue'))
    hx, hy, tx, ty = W / 2, 760, 880, 760
    if p.get('source_note'):
        fr.text(190, 760 - (len(srcs) - 1) / 2 * 150 - 90, p['source_note'], 20, color=_a(DIM, appear(t, sc.start + .1)), weight=700, anchor='mm', tracking=3)
    for i, s in enumerate(srcs):
        y = 760 + (i - (len(srcs) - 1) / 2) * 150
        a = appear(t, sc.start + .1 + i * .12)
        pill(fr, 190, y, s, NEON[p.get('source_tint', 'purple')], a, size=34, max_w=300)
        lk = ease_io(prog(t, hub_t, hub_t + .45))
        if lk > 0:
            x2 = mix(330, hx - 120, lk)
            fr.line([(330, y), (x2, mix(y, hy, lk))], _a(col, .55 * lk), 3, glow=col, glow_a=.4 * lk)
            for d in range(3):   # dots travelling into the hub
                u = ((t - hub_t) * .9 + d / 3 + i * .17) % 1
                if lk >= 1:
                    fr.circle(mix(330, hx - 120, u), mix(y, hy, u), 7, fill=_a(col, 1), glow=col)
    # before the hub is named, its place and the target wait as faint outlines, so the frame is never empty
    ghost = appear(t, sc.start + .2) * (1 - prog(t, hub_t - .05, hub_t + .1))
    if ghost > 0:
        fr.rect(hx - 120, hy - 150, 240, 300, r=28, outline=_a(col, .35 * ghost), width=2)
        fr.text(hx, hy, '?', 90, color=_a(col, .5 * ghost), weight=800, anchor='mm')
        icon(fr, p['target'].get('icon', 'store'), tx, ty - 10, 150, NEON[p.get('target_tint', 'blue')], .45 * ghost)
    hk = spring(t - hub_t)
    if t >= hub_t - .02:
        s = 220 * (.6 + .4 * hk)
        box(fr, hx - 120 * hk, hy - 150 * hk, 240 * hk, 300 * hk, col, min(1, hk * 2))
        icon(fr, p['hub'].get('icon', 'gate'), hx, hy - 30, s * .7, col, min(1, hk * 2), k=(t - hub_t) * .6)
        fr.text(hx, hy + 92, p['hub']['label'], 21, color=_a(TEXT, min(1, hk * 2)), weight=800, anchor='mm', tracking=2, max_w=220)
        if p['hub'].get('tag'):
            tk = appear(t, hub_t + .4)
            pill(fr, hx, hy - 190, p['hub']['tag'], NEON['amber'], tk, size=24, solid=True)
    ta = appear(t, hub_t + .35)
    if ta > 0:
        fr.line([(hx + 120, hy), (tx - 80, ty)], _a(col, .55 * ta), 3, glow=col, glow_a=.4 * ta)
        for d in range(3):
            u = ((t - hub_t) * .9 + d / 3) % 1
            fr.circle(mix(hx + 120, tx - 80, u), hy, 7, fill=_a(NEON['green'], ta), glow=NEON['green'])
        icon(fr, p['target'].get('icon', 'store'), tx, ty - 10, 150, NEON[p.get('target_tint', 'blue')], ta)
        fr.text(tx, ty + 100, p['target'].get('label', ''), 26, color=_a(TEXT, ta), weight=800, anchor='mm', max_w=200)


def nest(fr, sc, t):
    """A container gets a separate compartment for a guest. params: outer{title,sub,icon}, inner{title,sub,icon}, inner_cue."""
    p = sc.params
    col = NEON[sc.tint]
    oa = spring(t - sc.start - .05)
    x, y, w, h = 120, 470, 840, 330
    if oa > 0:
        box(fr, x, y + (1 - oa) * 60, w, h, NEON['blue'], min(1, oa * 2))
        icon(fr, p['outer'].get('icon', 'user'), x + 110, y + 120 + (1 - oa) * 60, 120, NEON['blue'], min(1, oa * 2))
        fr.text(x + 200, y + 105, p['outer']['title'], 46, color=_a(TEXT, min(1, oa * 2)), weight=800, anchor='lm', max_w=600)
        fr.text(x + 200, y + 160, p['outer'].get('sub', ''), 28, color=_a(DIM, min(1, oa * 2)), weight=600, anchor='lm', max_w=600)
        for i in range(2):
            fr.rect(x + 60, y + 228 + i * 40, [520, 380][i], 18, r=9, fill=_a((40, 52, 86), min(1, oa * 2)))
    ic = sc.cue(p.get('inner_cue'))
    ik = spring(t - ic)
    if t >= ic:
        yy = mix(y + 120, 860, ik)
        box(fr, 200, yy, 680, 270, col, min(1, ik * 2.5))
        fr.line([(W / 2, y + h), (W / 2, yy)], _a(col, .6 * min(1, ik * 2)), 3, glow=col)
        icon(fr, p['inner'].get('icon', 'bot'), 310, yy + 135, 130, col, min(1, ik * 2.5))
        fr.text(400, yy + 110, p['inner']['title'], 44, color=_a(TEXT, min(1, ik * 2.5)), weight=800, anchor='lm', max_w=460)
        fr.text(400, yy + 165, p['inner'].get('sub', ''), 28, color=_a(col, min(1, ik * 2.5)), weight=700, anchor='lm', max_w=460)


def choice(fr, sc, t):
    """Two ways to stay in control, A or B. params: a{title,icon,cue}, b{title,icon?,ticks[],cue,note,meter?}.
    b.meter false shows the ticks as a plain list (e.g. version numbers) instead of a cap meter that fills to the first one."""
    p = sc.params
    col = NEON[sc.tint]
    a_t, b_t = sc.cue(p['a'].get('cue')), sc.cue(p['b'].get('cue'))
    ak = spring(t - a_t + .1)
    if t >= a_t - .1:
        x, y = 120, 470 + (1 - ak) * 50
        box(fr, x, y, 840, 200, NEON['green'], min(1, ak * 2))
        icon(fr, 'check', x + 100, y + 100, 110, NEON['green'], min(1, ak * 2), k=prog(t, a_t + .1, a_t + .5))
        fr.text(x + 190, y + 100, p['a']['title'], 44, color=_a(TEXT, min(1, ak * 2)), weight=800, anchor='lm', max_w=620)
    ok = appear(t, (a_t + b_t) / 2)
    if ok > 0:
        pill(fr, W / 2, 735, 'OR', DIM, ok, size=26)
    bk = spring(t - b_t + .1)
    if t >= b_t - .1:
        x, y = 120, 800 + (1 - bk) * 50
        box(fr, x, y, 840, 330, col, min(1, bk * 2))
        icon(fr, p['b'].get('icon', 'coin'), x + 100, y + 90, 110, col, min(1, bk * 2))
        fr.text(x + 190, y + 90, p['b']['title'], 44, color=_a(TEXT, min(1, bk * 2)), weight=800, anchor='lm', max_w=620)
        # the cap meter: a bar that fills to the first example limit and stops there
        mx, my, mw = x + 70, y + 210, 700
        ticks = p['b'].get('ticks', [])
        if p['b'].get('meter', True) is False:   # a plain list: each item springs in, all in the same colour
            for i, tk in enumerate(ticks):
                ik = spring(t - b_t - .2 - i * .12)
                pill(fr, mx + mw * (i + .5) / len(ticks), my + 20, tk, TEXT, min(1, ik * 2), size=30)
            return
        fr.rect(mx, my, mw, 16, r=8, fill=_a((40, 52, 86), min(1, bk * 2)))
        fill = ease_io(prog(t, b_t + .3, b_t + 1.1)) * (1 / max(1, len(ticks)))
        fr.rect(mx, my, max(16, mw * fill), 16, r=8, fill=_a(col, min(1, bk * 2)), glow=col)
        for i, tk in enumerate(ticks):
            tx = mx + mw * (i + 1) / len(ticks)
            first = i == 0
            fr.rect(tx - 2, my - 10, 4, 36, fill=_a(col if first else DIM, min(1, bk * 2)))
            fr.text(tx, my + 60, tk, 30, color=_a(col if first else DIM, min(1, bk * 2)), weight=800, anchor='mm')
        if p['b'].get('note'):
            fr.text(mx, my + 60, p['b']['note'], 24, color=_a(DIM, min(1, bk * 2)), weight=600, anchor='lm')


def guard(fr, sc, t):
    """Something precious sits behind a shield; an agent reaches for it and is stopped. params: object{icon,label}, attacker, stop_cue, badge."""
    p = sc.params
    col = NEON[sc.tint]
    k = spring(t - sc.start - .05)
    cx, cy = W / 2 + 120, 780
    stop = sc.cue(p.get('stop_cue'))
    sh = ease_out(prog(t, stop - .1, stop + .3))
    icon(fr, 'shield', cx, cy, 420 * (.7 + .3 * k), NEON['green'] if sh > .5 else col, min(1, k * 2), fill=sh)
    icon(fr, p['object'].get('icon', 'card'), cx, cy - 10, 200, TEXT, min(1, k * 2))
    fr.text(cx, cy + 250, p['object'].get('label', ''), 30, color=_a(TEXT, min(1, k * 2)), weight=800, anchor='mm', max_w=300)
    # the agent advances along a dashed line, hits the shield on the cue word and bounces back
    adv = ease_io(prog(t, sc.start + .2, stop))
    back = spring(t - stop) if t > stop else 0
    ax = mix(150, cx - 260, adv) - 90 * back
    fr.line([(150, cy), (ax, cy)], _a(NEON['red'], .5), 3)
    icon(fr, p.get('attacker', 'bot'), ax, cy, 140, NEON['red'] if t > stop else NEON['amber'], min(1, k * 2))
    if t > stop:
        icon(fr, 'cross', cx - 250, cy - 120, 90, NEON['red'], 1, k=prog(t, stop, stop + .3))
        if p.get('badge'):
            pill(fr, W / 2, 1130, p['badge'], NEON['red'], appear(t, stop + .15), size=28, solid=True)


def checklist(fr, sc, t):
    """Takeaway steps that tick off as they are said. params: items[{text,cue,icon?}]."""
    p = sc.params
    col = NEON[sc.tint]
    items = p.get('items', [])
    total = 160 * len(items) + 40 * (len(items) - 1)
    y0 = (CONTENT_TOP + CONTENT_BOTTOM) / 2 - total / 2
    for i, it in enumerate(items):
        ct = sc.cue(it.get('cue'))
        k = spring(t - ct + .15)
        if t < ct - .15:   # each step waits as a faint outline until it is said, so the frame is never empty
            g = appear(t, sc.start + .1 + i * .1) * .35
            fr.rect(120, y0 + i * 200, 840, 160, r=28, outline=_a(col, g), width=2)
            fr.circle(210, y0 + i * 200 + 80, 46, outline=_a(col, g), width=3)
            continue
        y = y0 + i * 200 + (1 - k) * 50
        box(fr, 120, y, 840, 160, col, min(1, k * 2))
        fr.circle(210, y + 80, 46, outline=_a(col, min(1, k * 2)), width=3, glow=col)
        icon(fr, 'check', 210, y + 80, 70, col, min(1, k * 2), k=prog(t, ct + .1, ct + .45))
        fr.text(290, y + 80, it['text'], 46, color=_a(TEXT, min(1, k * 2)), weight=800, anchor='lm', max_w=620)
    # the resolve: a ring of light opens around the list as the last chord lands
    fin = prog(t, sc.end - 1.2, sc.end - .2)
    if fin > 0:
        r = mix(100, 520, ease_out(fin))
        fr.circle(W / 2, (CONTENT_TOP + CONTENT_BOTTOM) / 2, r, outline=_a(col, .5 * (1 - fin)), width=3, glow=col, glow_a=.6 * (1 - fin))


KINDS = {f.__name__: f for f in (portal, flow, nest, choice, guard, checklist)}
