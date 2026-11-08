"""Scene kinds: each is a visual metaphor built from shapes, animated against the scene's local time and the spoken words.
A topic file picks a kind per scene and fills its params. Every kind is draw(fr, sc, t) where sc is a Scene (start, end, tint, params,
cue(word) -> time the word is spoken, or the scene start if missing). Content stays inside CONTENT_TOP..CONTENT_BOTTOM.
Add a kind by writing one function and listing it in KINDS.
Secondary motion (owner, 8 Nov 2026: FLOW continuity 85%+): every kind keeps something moving while its line is spoken (a pulse along a link,
a highlight cycling through a list, a ring sweeping, numbers rolling), and every pane is glass with its own highlight sweep (base.glass)."""
import math

from .base import W, NEON, TEXT, DIM, ACCENT, CONTENT_TOP, CONTENT_BOTTOM, prog, ease_out, ease_io, spring, mix, mixc, text_w, glass, roll
from .icons import icon, fr_arc

EDGE = .55   # outline strength: borders are quiet, the content carries the colour


def _a(c, a):
    return c + (int(255 * max(0, min(1, a))),)


def pill(fr, cx, cy, label, col, a, size=30, solid=False, max_w=420):
    """A glass pill (solid: a filled badge in the colour, its numbers rolling in as it appears)."""
    if a <= 0:
        return 0
    label = roll(label, a) if solid else label
    while size > 22 and text_w(label, size, 800) + size * 1.4 > max_w:   # a long label steps its type down to fit, never past the pill
        size -= 1
    w = min(max_w, text_w(label, size, 800) + size * 1.4)
    h = size * 1.9
    if solid:
        fr.rect(cx - w / 2, cy - h / 2 + 10, w, h, r=h / 2, fill=(4, 3, 20, int(40 * a)))
        fr.rect(cx - w / 2, cy - h / 2, w, h, r=h / 2, fill=_a(col, a * .92), glow=col, glow_a=a * .3)
        fr.rect(cx - w / 2 + h / 2, cy - h / 2 + 1, w - h, 2, r=1, fill=(255, 255, 255, int(150 * a)))
    else:
        glass(fr, cx - w / 2, cy - h / 2, w, h, r=h / 2, a=a, tint=col, lift=False, sheen=False)
    fr.text(cx, cy, label, size, color=_a((14, 12, 32) if solid else TEXT, a), weight=800, anchor='mm', max_w=max_w - size)
    return w


def box(fr, x, y, w, h, col, a, r=28):
    glass(fr, x, y, w, h, r=r, a=a, tint=col)


def pulse(fr, p0, p1, t, col, a, period=1.1, n=2):
    """Light pulses travelling along a link from p0 to p1 (secondary motion while a line is spoken)."""
    for i in range(n):
        u = ((t / period) + i / n) % 1
        fr.circle(mix(p0[0], p1[0], u), mix(p0[1], p1[1], u), 6, fill=_a(TEXT, a * math.sin(u * math.pi)), glow=col, glow_a=a * .6)


def appear(t, t0, d=.35):
    return ease_out(prog(t, t0, t0 + d))


# ---------- kinds ----------
def portal(fr, sc, t):
    """A place opens its doors and agents walk in. params: icon, pills[], guest, n, open (cue word)."""
    p = sc.params
    col = NEON[sc.tint]
    k = spring(t - sc.start + .05)
    s = 330 * (.6 + .4 * k)
    cy = 740
    doors = ease_io(prog(t, sc.cue(p.get('open')) , sc.cue(p.get('open')) + .5))
    fr.el('icon', sc.start, 'l', W / 2, enter=False)   # it grows on its own spring
    fr.hit('doors', sc.cue(p.get('open')), 'm', W / 2)
    icon(fr, p.get('icon', 'store'), W / 2, cy, s, col, min(1, k * 2), doors=doors) if p.get('icon', 'store') == 'store' else icon(fr, p['icon'], W / 2, cy, s, col, min(1, k * 2))
    for i, label in enumerate(p.get('pills', [])):
        n = len(p['pills'])
        x = W / 2 + (i - (n - 1) / 2) * 330
        fr.el('pill%d' % i, sc.start + .1 + i * .1, 's', x)
        pill(fr, x, 1010, label, col, appear(t, sc.start + .1 + i * .1), size=32, max_w=310)
    # guests walk in from the left, one after another, and shrink into the doorway
    g0 = sc.cue(p.get('open')) + .1
    for i in range(p.get('n', 3)):
        fr.el('guest%d' % i, g0 + i * .28, 's', 200, enter=False, g=.8)
        fr.hit('in%d' % i, g0 + i * .28 + .95, 'm', W / 2, g=.8)   # it reaches the door
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
        fr.text(230, 760 - (len(srcs) - 1) / 2 * 150 - 90, p['source_note'], 20, color=_a(DIM, appear(t, sc.start)), weight=700, anchor='mm', tracking=3)
    for i, s in enumerate(srcs):
        y = 760 + (i - (len(srcs) - 1) / 2) * 150
        a = appear(t, sc.start + i * .08)
        fr.el('src%d' % i, sc.start + i * .08, 's', 230)
        pill(fr, 230, y, s, NEON[p.get('source_tint', 'purple')], a, size=34, max_w=260)   # x 230: clear of the safe zone's left edge with the camera's sway
        lk = ease_io(prog(t, hub_t, hub_t + .45))
        if lk > 0:
            x2 = mix(360, hx - 120, lk)
            fr.line([(360, y), (x2, mix(y, hy, lk))], _a(col, .55 * lk), 3, glow=col, glow_a=.4 * lk)
            for d in range(3):   # dots travelling into the hub
                u = ((t - hub_t) * .9 + d / 3 + i * .17) % 1
                if lk >= 1:
                    fr.circle(mix(360, hx - 120, u), mix(y, hy, u), 7, fill=_a(col, 1), glow=col)
    # before the hub is named, its place and the target wait as faint outlines, so the frame is never empty
    fr.el('ghost', sc.start + .2, 's', hx)
    ghost = appear(t, sc.start) * (1 - prog(t, hub_t - .05, hub_t + .1))
    if ghost > 0:
        fr.rect(hx - 120, hy - 150, 240, 300, r=28, outline=_a(col, .35 * ghost), width=2)
        fr.text(hx, hy, '?', 90, color=_a(col, .5 * ghost), weight=800, anchor='mm')
        icon(fr, p['target'].get('icon', 'store'), tx, ty - 10, 150, NEON[p.get('target_tint', 'blue')], .45 * ghost)
    hk = spring(t - hub_t)
    fr.el('hub', hub_t, 'l', hx, enter=False)   # the hub springs open from its centre
    if t >= hub_t - .02:
        s = 220 * (.6 + .4 * hk)
        box(fr, hx - 120 * hk, hy - 150 * hk, 240 * hk, 300 * hk, col, min(1, hk * 2))
        icon(fr, p['hub'].get('icon', 'gate'), hx, hy - 30, s * .7, col, min(1, hk * 2), k=(t - hub_t) * .6)
        for i in range(2):   # the hub watches: rings open out of it
            u = ((t - hub_t) * .7 + i * .5) % 1
            fr.rect(hx - 120 - 30 * u, hy - 150 - 30 * u, 240 + 60 * u, 300 + 60 * u, r=28 + 10 * u, outline=_a(col, .35 * (1 - u) * min(1, hk * 2)), width=2)
        fr.text(hx, hy + 92, p['hub']['label'], 21, color=_a(TEXT, min(1, hk * 2)), weight=800, anchor='mm', tracking=2, max_w=220)
        if p['hub'].get('tag'):
            tk = appear(t, hub_t + .4)
            fr.el('tag', hub_t + .4, 's', hx)
            pill(fr, hx, hy - 190, p['hub']['tag'], NEON['amber'], tk, size=24, solid=True)
    ta = appear(t, hub_t + .35)
    fr.el('target', hub_t + .35, 'm', tx)
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
    oa = spring(t - sc.start + .05)
    x, y, w, h = 120, 470, 840, 330
    fr.el('outer', sc.start, 'l', W / 2, enter=False)
    if oa > 0:
        box(fr, x, y + (1 - oa) * 60, w, h, NEON['blue'], min(1, oa * 2))
        icon(fr, p['outer'].get('icon', 'user'), x + 110, y + 120 + (1 - oa) * 60, 120, NEON['blue'], min(1, oa * 2))
        fr.text(x + 200, y + 105, p['outer']['title'], 46, color=_a(TEXT, min(1, oa * 2)), weight=800, anchor='lm', max_w=600)
        fr.text(x + 200, y + 160, p['outer'].get('sub', ''), 28, color=_a(DIM, min(1, oa * 2)), weight=600, anchor='lm', max_w=600)
        for i in range(2):
            bw = [520, 380][i]
            fr.rect(x + 60, y + 228 + i * 40, bw, 18, r=9, fill=_a(TEXT, .1 * min(1, oa * 2)))
            u = ((t - sc.start) * .6 + i * .35) % 1   # a loading shimmer runs along the bars
            fr.rect(x + 60 + (bw - 90) * u, y + 228 + i * 40, 90, 18, r=9, fill=_a(TEXT, .16 * math.sin(u * math.pi) * min(1, oa * 2)))
    ic = sc.cue(p.get('inner_cue'))
    ik = spring(t - ic)
    fr.el('inner', ic, 'm', W / 2, enter=False)
    if t >= ic:
        yy = mix(y + 120, 860, ik)
        box(fr, 200, yy, 680, 270, col, min(1, ik * 2.5))
        fr.line([(W / 2, y + h), (W / 2, yy)], _a(col, .6 * min(1, ik * 2)), 3, glow=col)
        if ik > .9:
            pulse(fr, (W / 2, y + h), (W / 2, yy), t, col, min(1, ik * 2))
        icon(fr, p['inner'].get('icon', 'bot'), 310, yy + 135, 130, col, min(1, ik * 2.5))
        fr.text(400, yy + 110, p['inner']['title'], 44, color=_a(TEXT, min(1, ik * 2.5)), weight=800, anchor='lm', max_w=460)
        fr.text(400, yy + 165, p['inner'].get('sub', ''), 28, color=_a(col, min(1, ik * 2.5)), weight=700, anchor='lm', max_w=460)


def choice(fr, sc, t):
    """Two ways to stay in control, A or B. params: a{title,icon,cue}, b{title,icon?,ticks[],cue,note,meter?}, join (the word between, default OR).
    b.meter false shows the ticks as a plain list (e.g. version numbers) instead of a cap meter that fills to the first one."""
    p = sc.params
    col = NEON[sc.tint]
    a_t, b_t = sc.cue(p['a'].get('cue')), sc.cue(p['b'].get('cue'))
    a_t = min(a_t, sc.start + .05)   # the first option arrives with the label, so the scene never opens on its chip alone
    ak = spring(t - a_t + .1)
    fr.el('a', a_t - .1, 'l', W / 2, enter=False)
    fr.hit('a_tick', a_t + .1, 's', 220)
    if t >= a_t - .1:
        x, y = 120, 470 + (1 - ak) * 50
        box(fr, x, y, 840, 200, NEON['green'], min(1, ak * 2))
        icon(fr, 'check', x + 100, y + 100, 110, NEON['green'], min(1, ak * 2), k=prog(t, a_t + .1, a_t + .5))
        fr.text(x + 190, y + 100, p['a']['title'], 44, color=_a(TEXT, min(1, ak * 2)), weight=800, anchor='lm', max_w=620)
    ok = appear(t, (a_t + b_t) / 2)
    fr.el('or', (a_t + b_t) / 2, 's', W / 2)
    if ok > 0:
        pill(fr, W / 2, 735, p.get('join', 'OR'), DIM, ok, size=26)   # join: the word between the panels ("FOR", "THEN")
    bk = spring(t - b_t + .1)
    fr.el('b', b_t - .1, 'l', W / 2, enter=False)
    if t >= b_t - .1:
        x, y = 120, 800 + (1 - bk) * 50
        box(fr, x, y, 840, 330, col, min(1, bk * 2))
        icon(fr, p['b'].get('icon', 'coin'), x + 100, y + 90, 110, col, min(1, bk * 2))
        fr.text(x + 190, y + 90, p['b']['title'], 44, color=_a(TEXT, min(1, bk * 2)), weight=800, anchor='lm', max_w=620)
        # the cap meter: a bar that fills to the first example limit and stops there
        mx, my, mw = x + 70, y + 210, 700
        ticks = p['b'].get('ticks', [])
        if p['b'].get('meter', True) is False:   # a plain list: each item springs in, all in the same colour
            cur = int((t - b_t) / .55) % max(1, len(ticks)) if t > b_t + .6 else -1   # a highlight steps through the list: one each
            for i, tk in enumerate(ticks):
                ik = spring(t - b_t - .2 - i * .12)
                fr.el('bt%d' % i, b_t - .2 + .2 + i * .12, 's', mx + mw * (i + .5) / len(ticks))
                pill(fr, mx + mw * (i + .5) / len(ticks), my + 20, tk, ACCENT if i == cur else TEXT, min(1, ik * 2), size=30)
            return
        fr.hit('fill', b_t + .3, 'm', mx + mw / 2)
        fr.hit('stop', b_t + 1.1, 's', mx + mw / max(1, len(ticks)))
        fr.rect(mx, my, mw, 16, r=8, fill=_a(TEXT, .14 * min(1, bk * 2)))
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
    k = spring(t - sc.start + .05)
    cx, cy = W / 2 + 120, 780
    stop = sc.cue(p.get('stop_cue'))
    sh = ease_out(prog(t, stop - .1, stop + .3))
    fr.el('shield', sc.start, 'l', cx, enter=False)
    fr.hit('stop', stop, 'l', cx - 200, g=1.2)
    icon(fr, 'shield', cx, cy, 420 * (.7 + .3 * k), NEON['green'] if sh > .5 else col, min(1, k * 2), fill=sh)
    icon(fr, p['object'].get('icon', 'card'), cx, cy - 10, 200, TEXT, min(1, k * 2))
    fr.text(cx, cy + 250, p['object'].get('label', ''), 30, color=_a(TEXT, min(1, k * 2)), weight=800, anchor='mm', max_w=300)
    # the agent advances along a dashed line, hits the shield on the cue word and bounces back
    fr.el('agent', sc.start + .2, 'm', 200, enter=False)
    adv = ease_io(prog(t, sc.start + .2, stop))
    back = spring(t - stop) if t > stop else 0
    ax = mix(150, cx - 260, adv) - 90 * back
    fr.line([(150, cy), (ax, cy)], _a(NEON['red'], .5), 3)
    icon(fr, p.get('attacker', 'bot'), ax, cy, 140, NEON['red'] if t > stop else NEON['amber'], min(1, k * 2))
    mid = (sc.start + .2 + stop) / 2   # halfway in, the agent pulses (a ring and a tick): a long approach is seen and heard
    fr.hit('approach', mid, 's', mix(150, cx - 260, .5))
    u = prog(t, mid, mid + .45)
    if 0 < u < 1:
        fr.circle(ax, cy, 80 + 60 * ease_out(u), outline=_a(NEON['amber'], .6 * (1 - u)), width=3)
    if t > stop:
        u = (t - stop) * 1.1   # a renewal ring sweeps round the shield
        rr = 250
        fr_arc(fr, (cx - rr, cy - rr, cx + rr, cy + rr), (u * 360) % 360, (u * 360) % 360 + 100 * min(1, (t - stop) * 3), _a(NEON['green'], .7), 6)
        fr.hit('cross', stop + .05, 's', cx - 250)
        icon(fr, 'cross', cx - 250, cy - 120, 90, NEON['red'], 1, k=prog(t, stop, stop + .3))
        if p.get('badge'):
            fr.el('badge', stop + .15, 's', W / 2)
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
        fr.el('item%d' % i, sc.start + i * .08, 's', W / 2)
        fr.hit('tick%d' % i, ct - .15, 'm', W / 2)
        fr.hit('check%d' % i, ct + .1, 's', 210)
        if t < ct - .15:   # each step waits, dimmed, until it is said; it arrives with the label so the frame is never empty
            g = appear(t, sc.start + i * .08)
            fr.rect(120, y0 + i * 200 + (1 - g) * 30, 840, 160, r=28, fill=_a(col, .06 * g), outline=_a(col, .45 * g), width=2)
            fr.circle(210, y0 + i * 200 + 80 + (1 - g) * 30, 46, outline=_a(col, .45 * g), width=3)
            fr.text(290, y0 + i * 200 + 80 + (1 - g) * 30, it['text'], 46, color=_a(DIM, .7 * g), weight=800, anchor='lm', max_w=620)
            continue
        y = y0 + i * 200 + (1 - k) * 50
        box(fr, 120, y, 840, 160, col, min(1, k * 2))
        fr.circle(210, y + 80, 46, outline=_a(col, min(1, k * 2)), width=3, glow=col)
        icon(fr, 'check', 210, y + 80, 70, col, min(1, k * 2), k=prog(t, ct + .1, ct + .45))
        u = ((t - ct) * .8) % 1   # a ring breathes out of each ticked step
        fr.circle(210, y + 80, 46 + 26 * u, outline=_a(col, .45 * (1 - u) * min(1, k * 2)), width=2)
        fr.text(290, y + 80, it['text'], 46, color=_a(TEXT, min(1, k * 2)), weight=800, anchor='lm', max_w=620)
    # the resolve: a ring of light opens around the list as the last chord lands
    fin = prog(t, sc.end - 1.2, sc.end - .2)
    fr.end_el()
    if fin > 0:
        r = mix(100, 520, ease_out(fin))
        fr.circle(W / 2, (CONTENT_TOP + CONTENT_BOTTOM) / 2, r, outline=_a(col, .5 * (1 - fin)), width=3, glow=col, glow_a=.6 * (1 - fin))


def _depth(u, v):
    """Toy face depth for the dot scenes (0 far .. 1 near): a dome, a nose ridge, two eye hollows. u, v in -1..1 across the head."""
    d = max(0.0, 1 - u * u - v * v)
    z = math.sqrt(d) * .7
    z += .45 * math.exp(-(u * u) / .012 - ((v - .05) ** 2) / .09)            # nose
    z -= .3 * math.exp(-((abs(u) - .38) ** 2) / .02 - ((v + .18) ** 2) / .012)  # eye hollows
    return clamp01(z)


def clamp01(v):
    return max(0.0, min(1.0, v))


def dots(fr, sc, t):
    """Structured light: a projector sprays a grid of infrared dots onto a face; each dot shifts sideways by the depth under it,
    so the bent grid reads as the face's shape. params: mode ('spray' | 'map'), cue (word), pill (text under the face).
    spray: dots fly out on the cue and bend as they land. map: the bent dots are there from the start; on the cue a mesh joins them
    and they light up near-bright, far-dim (the depth map)."""
    p = sc.params
    col = NEON[sc.tint]
    cue = sc.cue(p.get('cue'))
    mode = p.get('mode', 'spray')
    cx, cy, rx, ry = W / 2, 800, 235, 300
    k = spring(t - sc.start + .05)
    ka = min(1, k * 2)
    # the projector: a small emitter at the top of the band
    px, py = W / 2, CONTENT_TOP + 30
    fr.el('projector', sc.start, 's', px)
    fr.hit('spray', cue, 'l', W / 2)
    fr.rect(px - 70, py - 18, 140, 36, r=18, fill=_a(TEXT, .1 * ka), outline=_a(col, .7 * ka), width=2)
    fr.circle(px, py, 9, fill=_a(col, ka), glow=col, glow_a=.8 * ka)
    # the face outline, quiet until the dots reveal it
    reveal = ease_out(prog(t, cue, cue + 1.0)) if mode == 'spray' else 1.0
    oa = ka * (.3 + .3 * reveal)
    pts = [(cx + rx * math.cos(a / 40 * 2 * math.pi), cy + ry * math.sin(a / 40 * 2 * math.pi)) for a in range(41)]
    fr.line(pts, _a(DIM, oa), 2)
    n, m = 15, 19   # columns, rows
    grid = []
    for j in range(m):
        row = []
        for i in range(n):
            u, v = (i / (n - 1)) * 2 - 1, (j / (m - 1)) * 2 - 1
            inside = u * u + v * v < .96
            z = _depth(u, v) if inside else 0.0
            x0, y0 = cx + u * (rx + 40), cy + v * (ry + 30)
            row.append((x0, y0, z, inside, i, j))
        grid.append(row)
    mesh = ease_io(prog(t, cue, cue + 1.1)) if mode == 'map' else 0.0
    pos = {}
    for row in grid:
        for x0, y0, z, inside, i, j in row:
            if mode == 'spray':
                d0 = cue + .02 * (i + j) * .6 + ((i * 7 + j * 13) % 5) * .03
                fly = ease_out(prog(t, d0, d0 + .45))
                if fly <= 0:
                    continue
                bend = ease_io(prog(t, d0 + .35, d0 + .8))
            else:
                fly, bend = ka, 1.0
            x = mix(px, x0 + 45 * z * bend, fly) if mode == 'spray' else x0 + 45 * z
            y = mix(py, y0, fly) if mode == 'spray' else y0
            pos[(i, j)] = (x, y, z, inside)
            if inside:
                c = mixc(col, TEXT, z * mesh) if mesh > 0 else col
                a = (.55 + .45 * z * mesh) * (fly if mode == 'spray' else ka)
                fr.circle(x, y, 5 + 4 * z * mesh, fill=_a(c, a), glow=col, glow_a=.5 * a)
            else:
                fr.circle(x, y, 3, fill=_a(col, .22 * (fly if mode == 'spray' else ka)))
    if mesh > 0:
        rows_on = mesh * m
        for (i, j), (x, y, z, inside) in pos.items():
            if not inside or j > rows_on:
                continue
            for di, dj in ((1, 0), (0, 1)):
                q = pos.get((i + di, j + dj))
                if q and q[3]:
                    fr.line([(x, y), (q[0], q[1])], _a(mixc(col, TEXT, z), .35 + .4 * z), 2)
    if p.get('pill'):
        fr.el('pill', (cue + .6) if mode == 'spray' else (cue + .5), 's', W / 2)
        pa = appear(t, (cue + .6) if mode == "spray" else (cue + .5))
        pill(fr, W / 2, 1150, p['pill'], col, pa, size=28, solid=True)


KINDS = {f.__name__: f for f in (portal, flow, nest, choice, guard, checklist, dots)}
