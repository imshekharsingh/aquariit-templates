"""The story look for @techin20sec (14 Nov 2026; topic "look": "story"; design/rules-tech.md S1-S8). The default for every tech reel.
Built from the owner's reference kit (design/kits/motion_kit.zip + motion_content_prompt.md: techniques taken, nothing copied): a 7-beat
story told in full-frame shots, a camera that moves between them, colour that changes with the story, word-synced captions low in the frame.
- Beats (topic lines, each with "beat"): payoff (frame 0 is the striking ANSWER image, the hook said over it) -> question (one) -> 2-3 steps
  (one concrete sourced fact each, revealed on its word) -> surprise (the thing worth saving) -> an optional takeaway.
- Every beat has its own colour MOOD (ember, dusk, ocean, cobalt, jade, rose, gold): the room's key and fill light, the glow behind the
  subject, the accent of its big words and the grade of its photo. Moods flow into each other during the camera move (no hard colour cut).
- Camera moves between shots, never a plain fade: "push" (the camera dives into a point of the old shot and the new one opens from it),
  "pan" (the two shots side by side, the camera slides), "match" (the old subject slides and scales onto the new subject's place while the
  new shot opens around it), "zoom" (zoom-through: the old shot flies past the lens, the new one settles from depth). All declared for FLOW.
- The whole frame is used: photos full-bleed (the topic's "media", fetched by the Media workflow; a dark ramp under the words and captions),
  products drawn or cut out big in the stage (y 600-1330), big words (90 px+) in the top band (y 330-560). No small furniture: no series pill,
  no title strip, no progress bar or dots, no credit plates (credits go in the caption). Captions low (centre y 1462), 2 rows at most.
- Shots (kinds): hero (photo / product / drawn phone with a live screen), duo (two products side by side), strip (frames racing through a
  gate at a rate), clock (one second as a ring of slices with a giant readout), rate (one object sampled at two rates), plus every set of
  the idea look (scenes/idea.py: barrier, slam, split, bars, ride, drain) through the same camera.
Every frame is a pure function of t (seeded randomness only)."""
import math
import random

import numpy as np
from PIL import Image, ImageDraw

from . import base as B
from . import depth as D
from . import photo as PH
from . import idea as I
from .gadget import stroke_text
from .phonecam import YEL, TXT, GREY

W, H, SS = B.W, B.H, B.SS
CX = 510                     # the safe zone's middle (x 60-960)
WORDS_Y = 446                # the big words' band centre (y ~330-560)
STAGE = (600, 1330)          # the stage band (y): products and drawn worlds
FOC = (CX, 965)              # the camera's default focus
CAP_Y = 1462                 # the captions' centre line (14 Nov 2026: a little lower than the idea look's 1440 band, still inside y 1570)
TR = .7                      # a camera move between shots (s)
B_DUR = [20.0]
DIAG = math.hypot(W, H)

# colour moods: base (the room's ink), key (warm or cool key light), fill (the low second light), accent (big words, glows), tint (photo grade)
MOODS = {
    'ember':  dict(base=(15, 9, 6), key=(150, 78, 28), fill=(64, 26, 12), accent=(255, 192, 104), tint=(1.07, .96, .84)),
    'dusk':   dict(base=(10, 8, 20), key=(88, 62, 168), fill=(34, 24, 74), accent=(198, 176, 255), tint=(.93, .9, 1.08)),
    'ocean':  dict(base=(5, 13, 18), key=(26, 118, 138), fill=(10, 46, 62), accent=(120, 228, 238), tint=(.88, 1.0, 1.06)),
    'cobalt': dict(base=(6, 9, 22), key=(44, 82, 190), fill=(16, 30, 82), accent=(146, 184, 255), tint=(.9, .96, 1.1)),
    'jade':   dict(base=(5, 14, 10), key=(36, 128, 88), fill=(14, 52, 36), accent=(128, 234, 170), tint=(.9, 1.04, .94)),
    'rose':   dict(base=(17, 7, 13), key=(166, 56, 108), fill=(72, 20, 52), accent=(255, 168, 204), tint=(1.06, .92, 1.0)),
    'gold':   dict(base=(14, 11, 5), key=(168, 128, 38), fill=(62, 44, 14), accent=(255, 212, 116), tint=(1.08, 1.0, .84)),
}
BEAT_MOODS = {'payoff': ['ember'], 'question': ['dusk'], 'step': ['ocean', 'cobalt', 'jade'], 'surprise': ['rose'], 'takeaway': ['gold']}
MOVE_CYCLE = ('match', 'zoom', 'pan', 'push')


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


def mixc(a, b, k):
    return tuple(int(round(mix(x, y, k))) for x, y in zip(a, b))


def cue(s, word, nth=1, d=None):
    if word:
        return s.cue(word, nth)
    return s.start + .3 if d is None else d


# ---------- the timeline: one shot per line, line 0 (the payoff) included ----------
def timeline(topic, vo, Scene):
    """Every line is a shot; shot 0 (the payoff) starts at 0, so frame 0 is the answer image. A shot starts 0.3 s before its line (the
    camera move lands as the line begins) and ends where the next starts. hook_out is when line 1 begins (the hook's caption leaves)."""
    L = vo['lines']
    scenes, n_step = [], 0
    for i, ln in enumerate(topic['lines']):
        spec = dict(ln.get('scene') or {'kind': 'hero'})
        spec.setdefault('label', ln.get('beat', 'step').upper())
        st = 0.0 if i == 0 else L[i]['start'] - .3
        en = (L[i + 1]['start'] - .3) if i + 1 < len(L) else B_DUR[0]
        s = Scene(i, spec, L[i], st, en)
        s.beat = ln.get('beat', 'payoff' if i == 0 else 'step')
        nm = BEAT_MOODS.get(s.beat, ['cobalt'])
        s.mood = spec.get('mood') or nm[n_step % len(nm)]
        if s.beat == 'step':
            n_step += 1
        s.move = spec.get('move') or MOVE_CYCLE[(i - 1) % len(MOVE_CYCLE)]
        scenes.append(s)
    hook_out = L[1]['start'] - .1 if len(L) > 1 else B_DUR[0]
    return hook_out, scenes


def transitions(topic, scenes):
    """Declared transitions (Mandatory Gate item 14): the camera move into every shot after the first, and the end fade."""
    out = [[round(s.start - .05, 3), round(s.start + TR, 3), s.move] for s in scenes[1:]]
    out.append([round(B_DUR[0] - .3, 3), round(B_DUR[0], 3), 'fade'])
    return out + list(topic.get('transitions', []))


# ---------- the room: lit in the beat's mood ----------
_LY, _LX = D._LY, D._LX


def _paint(m, t, cam):
    cx, cy = cam
    img = np.zeros((240, 135, 3), np.float32) + np.array(m['base'], np.float32)
    key, fill, acc = (np.array(m[k], np.float32) for k in ('key', 'fill', 'accent'))
    kx, ky = 250 + 70 * math.sin(t * .31) - cx * .15, 560 + 50 * math.sin(t * .23 + 1) - cy * .15
    g = np.clip(1 - np.sqrt((_LX - kx) ** 2 + ((_LY - ky) / 1.25) ** 2) / 900, 0, 1) ** 2.1
    img += key * .55 * g[..., None]
    for j, (ang, wd, a) in enumerate(((.98, 120, .2), (1.22, 80, .14))):   # two slow beams from the top left
        th = ang + .05 * math.sin(t * .4 + j * 2)
        dx, dy = math.cos(th), math.sin(th)
        px, py = _LX - (-120 - cx * .1), _LY + 200
        along = px * dx + py * dy
        perp = np.abs(-px * dy + py * dx)
        k = np.clip(1 - perp / (wd + along * .12), 0, 1) ** 1.6 * np.clip(along / 600, 0, 1) * np.clip(1 - along / 2600, 0, 1)
        img += (key * .6 + 30) * a * k[..., None]
    g2 = np.clip(1 - np.sqrt(((_LX - 960) / 1.0) ** 2 + ((_LY - 1240) / 1.4) ** 2) / 760, 0, 1) ** 2
    img += fill * .9 * g2[..., None]
    # a glow behind the subject in the beat's accent (low, so the colour reads as light, not as a fill)
    gs = np.clip(1 - np.sqrt(((_LX - 510 + cx * .3) / 1.0) ** 2 + ((_LY - 960 + cy * .3) / 1.15) ** 2) / 560, 0, 1) ** 2.4
    img += acc * .16 * gs[..., None]
    fy = D.FLOOR_Y - cy * .4   # the floor and its horizon glow
    fl = np.clip((_LY - fy) / 60, 0, 1)
    hz = np.exp(-((_LY - fy) / 40) ** 2)
    img += (np.array(m['base'], np.float32) * .8 + 6) * fl[..., None] * np.clip(1 - (_LY - fy) / 700, .2, 1)[..., None]
    img += acc * .2 * hz[..., None] * np.clip(1 - np.abs(_LX - 540) / 700, 0, 1)[..., None]
    v = np.clip(np.sqrt(((_LX - 540) / 540) ** 2 + ((_LY - 960) / 960) ** 2) - .5, 0, 1)
    return img * (1 - .6 * v[..., None])


def room(ma, mb, k, t, cam):
    """The background in mood ma flowing into mb by k: (full-size SS image, 1/8 array)."""
    a = _paint(MOODS[ma], t, cam)
    if k > 0 and mb != ma:
        a = a * (1 - k) + _paint(MOODS[mb], t, cam) * k
    small = np.clip(a, 0, 255).astype(np.uint8)
    return Image.fromarray(small).resize((W * SS, H * SS), Image.BICUBIC), small


def moodc(s, key):
    return MOODS[s.mood][key]


# ---------- pieces ----------
def text_fit(s, size, max_w, weight=900):
    while size > 40 and B.text_w(s, size, weight) > max_w:
        size -= 2
    return size


def big_words(cm, fr, s, t, ws=None, y=WORDS_Y, max_w=760):
    """The beat's big words (90 px+) in the top band: each springs up on its cue word (shot 0: on screen at frame 0); the accent one
    takes the mood's accent; "dim": a quieter grey (the "before" value). max_w leaves room for the camera's push (up to x1.12) inside
    the safe zone (x 60-960)."""
    ws = s.params.get('words', []) if ws is None else ws
    n = len(ws)
    sizes = [w.get('size', 128 if n == 1 else 104) for w in ws]
    sizes = [text_fit(w['text'], z, max_w) for w, z in zip(ws, sizes)]
    tot = sum(z * 1.08 for z in sizes)
    yy = y - tot / 2
    for j, (wd, size) in enumerate(zip(ws, sizes)):
        yc = yy + size * .54
        yy += size * 1.08
        tc = -1.0 if s.i == 0 and not wd.get('cue') else cue(s, wd.get('cue'), d=s.start + .25 + .15 * j)
        if s.i == 0 and tc < .4:
            tc = -1.0
        k = sp(t, tc - .05, .55, 14)
        if k <= .01:
            continue
        col = moodc(s, 'accent') if wd.get('accent') else GREY if wd.get('dim') else TXT
        cm.text(CX, yc + (1 - min(1.0, k)) * 40, wd['text'], size * (.85 + .15 * min(1.1, k)), col, 900, 'mm', a=clamp(k * 1.6))
        I.hit(fr, s, f'w{j}', max(0.0, tc), 'm', CX, 1.0)


def phone(cm, fr, s, cx, cy, w, h, t, screen='feed', hz=None, glow=0.0):
    """A generic phone (our own drawing) with a live screen: "feed" (cards scrolling; hz quantises the motion so 60 reads choppier than
    120, slowed 8x so the steps show at 30 fps), "lock" (a dim always-on clock, one soft pulse a second), "blank"."""
    I.phone(cm, cx, cy, w, h, t, glow)
    b = w * .045
    sx, sy, sw, sh = cx - w / 2 + b, cy - h / 2 + b, w - 2 * b, h - 2 * b
    acc = moodc(s, 'accent')
    if screen == 'feed':
        q = None if not hz else hz / 8.0
        tq = t if not q else math.floor(t * q) / q
        ch, gap = sh * .2, sh * .03
        off = (tq * sh * .22) % (ch + gap)
        pad = sw * .07
        top = sy + sh * .07
        for n in range(-1, 7):
            y = top + n * (ch + gap) - off
            y0, y1 = max(y, sy + sh * .06), min(y + ch, sy + sh - 4)
            if y1 - y0 < 4:
                continue
            rr = random.Random(int(math.floor((tq * sh * .22) / (ch + gap))) + n + 40)
            hue = rr.random()
            col = mixc(acc, (70, 74, 96), .35 + .4 * hue)
            cm.rect(sx + pad, y0, sw - 2 * pad, y1 - y0, r=min(18, (y1 - y0) / 2), fill=(30, 31, 40))
            iy0, iy1 = max(y0, y + 10), min(y1, y + ch * .62)
            if iy1 - iy0 > 3:
                cm.rect(sx + pad + 10, iy0, sw - 2 * pad - 20, iy1 - iy0, r=min(12, (iy1 - iy0) / 2), fill=col)
            for k_, ww in ((.72, .7), (.84, .45)):
                by = y + ch * k_
                if y0 <= by <= y1 - 8:
                    cm.rect(sx + pad + 16, by, (sw - 2 * pad - 32) * ww, 9, r=4, fill=(120, 122, 136))
        cm.rect(sx, sy, sw, sh * .06, fill=(12, 13, 18))   # the status strip covers the cards' clip line
    elif screen == 'lock':
        u = t % 1.0
        cm.text(cx, sy + sh * .26, '7:30', w * .3, (210, 212, 222), 800, 'mm', record=False, a=.8)
        cm.circle(cx, sy + sh * .62, sw * (.12 + .25 * eo(u)), outline=acc + (int(200 * (1 - u)),), width=4)
        cm.circle(cx, sy + sh * .62, sw * .08, fill=acc + (150,))
        for j in range(3):
            cm.rect(sx + sw * .14, sy + sh * (.78 + .06 * j), sw * (.72 - .16 * j), 12, r=6, fill=(70, 72, 84))


def product(cm, fr, s, t, cx, cy, h, kin=1.0):
    """The shot's subject: the topic's cut-out photo ("product": a media id with a cut-out) when the file is there, else the drawn object
    ("draw": phone | earbud), floating gently, with a contact shadow."""
    p = s.params
    bob = 8 * math.sin(t * 1.4 + s.i)
    if p.get('product') and PH.has(p['product'], fg=True):
        PH.sprite(cm, p['product'], cx, cy + bob, h * kin)
        return
    dr = p.get('draw', 'phone')
    if dr == 'earbud':
        D.soft_shadow(cm, cx, cy + h * .5, h * .4, h * .06, 150)
        I.earbud(cm, cx, cy + bob, h / 520 * kin, t)
    elif dr == 'phone':
        w = h * .5
        D.soft_shadow(cm, cx, cy + h * .52, w * .62, h * .045, 170)
        phone(cm, fr, s, cx, cy + bob, w * kin, h * kin, t, p.get('screen', 'feed'), p.get('hz'), glow=p.get('glow', 0.0))


def photo_bg(cm, s, t):
    """A full-bleed photo through the camera (a slow push from view[2] to view[3]), graded to the mood and shaded where type sits."""
    p = s.params
    mid = p.get('photo')
    if not (mid and PH.has(mid)):
        return False
    vw = list(p.get('view') or [.5, .5])   # [u, v] the photo's point at the centre, [z0, z1] the push over the shot
    u, v, z0, z1 = (vw + [1.0, 1.12])[:4] if len(vw) == 2 else vw[:4]
    k = eio((t - s.start) / max(1.0, s.end - s.start))
    PH.rect(cm, mid, -80, -80, W + 160, H + 160, view=(u, v, mix(z0, z1, k)))
    tint = moodc(s, 'key')
    cm.rect(-80, -80, W + 160, H + 160, fill=tint + (46,))
    PH.shade(cm, -80, -80, W + 160, 700, top=.72, bottom=0)
    PH.shade(cm, -80, 1240, W + 160, 800, top=0, bottom=.8)
    return True


# ---------- shots ----------
def k_hero(cm, fr, s, t, topic):
    """The payoff / surprise / takeaway shot: a full-bleed photo and / or the product big in the stage, the big words over the top band."""
    p = s.params
    photo_bg(cm, s, t)
    kin = 1.0 if s.i == 0 else .9 + .1 * min(1.05, sp(t, s.start, .6, 10))
    if p.get('draw', 'phone') or p.get('product'):
        product(cm, fr, s, t, p.get('x', CX), p.get('y', 975), p.get('h', 720), kin)
    big_words(cm, fr, s, t)
    if s.i:
        I.hit(fr, s, 'in', s.start + .15, 'l', CX, 1.1)
    if B.EVENTS is not None:   # the screen's own life: a tick per lock-screen pulse, a soft tick as feed cards pass (G7: no quiet run)
        step = 1.0 if p.get('screen') == 'lock' else .7
        for j in range(int((s.end - s.start) / step) + 1):
            I.hit(fr, s, f'tk{j}', math.ceil(s.start / step) * step + j * step, 's', CX + 160, .7)


def k_duo(cm, fr, s, t, topic):
    """Two products side by side (the question: the same thing, two results): left / right {label, hz?, cue?, accent?}."""
    p = s.params
    photo_bg(cm, s, t)
    big_words(cm, fr, s, t, y=WORDS_Y - 30)
    for j, side in enumerate(('left', 'right')):
        d = p.get(side, {})
        cx = (300, 720)[j]
        tc = cue(s, d.get('cue'), d=s.start + .15 + .2 * j)
        k = sp(t, tc - .1, .6, 12)
        if k <= .01:
            continue
        h = 640 * (.88 + .12 * min(1.05, k))
        D.soft_shadow(cm, cx, 1010 + h * .52, h * .3, h * .045, 160)
        phone(cm, fr, s, cx, 1010 + (1 - min(1.0, k)) * 60, h * .5, h, t, d.get('screen', 'feed'), d.get('hz'), glow=.8 if d.get('accent') else 0.0)
        col = moodc(s, 'accent') if d.get('accent') else TXT
        cm.text(cx, 620, d.get('label', ''), text_fit(d.get('label', ''), 76, 380), col, 900, 'mm', a=clamp(k * 1.6))
        I.hit(fr, s, f'duo{j}', tc, 'm', cx, 1.0)
    for j in range(int((s.end - s.start) / .7)):
        I.hit(fr, s, f'tk{j}', s.start + .5 + j * .7, 's', 720, .7)


def k_strip(cm, fr, s, t, topic):
    """Frames racing through a gate: a film strip of pictures (each one step of a moving ball) runs past at rates[i].rate pictures a second
    (shown 10x slowed), the giant count above it switching on its cue word; label under the strip."""
    p = s.params
    acc = moodc(s, 'accent')
    rates = p.get('rates', [{'value': '60', 'rate': 60}])
    cur, tcs = 0, []
    for j, r in enumerate(rates):
        tc = cue(s, r.get('cue'), d=s.start + .2 + j)
        tcs.append(tc)
        if t >= tc - .05:
            cur = j
    k_in = sp(t, s.start + .05, .6, 11)
    if p.get('intro'):   # the words before the first count lands ("HERTZ ="), leaving as the count arrives
        ko = eio((t - tcs[0] + .1) / .3)
        if ko < 1:
            big_words(I.Cam(cm.fr, (cm.fx, cm.fy), cm.z, (cm.dx, cm.dy - 60 * ko), cm.a, cm.ta * (1 - ko)), fr, s, t, p['intro'], y=600)
    # the strip: speed blends from rate to rate over 0.4 s
    def speed(tt):
        v = rates[0]['rate']
        for j in range(1, len(rates)):
            v = mix(v, rates[j]['rate'], eio((tt - tcs[j]) / .4))
        return v * 4.0
    # distance travelled = integral of speed (piecewise: sample coarse, exact enough and a pure function of t)
    x, tt, dt = 0.0, s.start - .5, .05
    while tt < t:
        x += speed(tt) * min(dt, t - tt)
        tt += dt
    fw, gap, y0, fh = 280, 26, 840, 280
    cm.rect(-80, y0 - 52, W + 160, fh + 104, fill=(14, 14, 18, 235))
    for j in range(-1, 26):   # sprocket holes along both edges
        hx = -60 + ((j * 64 - x * 1.0) % (64 * 26))
        for yy in (y0 - 38, y0 + fh + 18):
            cm.rect(hx, yy, 30, 20, r=5, fill=(46, 46, 54))
    base = int(x // (fw + gap))
    for j in range(-1, 7):
        n = base + j
        fx = 40 + j * (fw + gap) - (x % (fw + gap))
        rr = n % 8
        cm.rect(fx, y0, fw, fh, r=16, fill=(28, 30, 40), outline=(84, 86, 100), width=2)
        bx = fx + 34 + (fw - 68) * rr / 7
        cm.circle(bx, y0 + fh * .55 - 40 * math.sin(math.pi * rr / 7), 26, fill=acc)
        cm.rect(fx + 16, y0 + fh - 30, fw - 32, 6, r=3, fill=(64, 66, 78))
    # the gate: a lit frame in the centre the pictures pass through
    gx = CX - fw / 2 - 12
    cm.rect(gx, y0 - 16, fw + 24, fh + 32, r=22, outline=acc, width=6)
    # the giant count, switching on its word (the number equals the voice: G13)
    for j, r in enumerate(rates):
        k = sp(t, tcs[j] - .05, .5, 14)
        ko = eio((t - tcs[j + 1] + .05) / .25) if j + 1 < len(rates) else 0.0
        a = clamp(k * 1.6) * (1 - ko) * clamp(k_in * 1.5)
        if a > .01:
            cm.text(CX, 600 - 50 * ko, r['value'], 230 * (.9 + .1 * min(1.1, k)), acc if r.get('accent') else TXT, 900, 'mm', a=a)
        I.hit(fr, s, f'rate{j}', tcs[j], 'l' if j else 'm', CX, 1.1)
    if p.get('label'):
        tc = cue(s, p.get('label_cue'), d=s.start + .4)
        k = sp(t, tc, .6, 13)
        if k > .01:
            cm.text(CX, 1240, p['label'], text_fit(p['label'], 60, 760, 800), TXT, 800, 'mm', a=clamp(k * 1.6))
            I.hit(fr, s, 'label', tc, 's', CX, .9)
    for j in range(int((t - s.start) * 2.5)):   # a tick as pictures pass the gate (every 0.4 s: detail, not noise)
        I.hit(fr, s, f'tk{j}', s.start + .3 + j * .4, 's', CX + 120, .7)


def k_clock(cm, fr, s, t, topic):
    """One second as a ring of slices (slices: how many pictures a second): a hand sweeps it (slowed 4x), the current slice lights; the
    giant readout inside lands on its word (value, label), "vs" words in the top band."""
    p = s.params
    acc = moodc(s, 'accent')
    n = int(p.get('slices', 120))
    R, cx, cy = 330, CX, 990
    k_in = sp(t, s.start + .05, .6, 11)
    R *= .8 + .2 * min(1.05, k_in)
    # the dial: a dark disc, a lit rim
    D.sphere(cm, cx, cy, R + 34, (16, 16, 22), (40, 40, 52), rim=acc + (120,), spec=False, n=8)
    u = ((t - s.start) / 4.0) % 1.0
    lit = int(u * n)
    for j in range(n):
        a0 = -90 + 360 * j / n
        a1 = a0 + 360 / n * .62
        col = acc if j == lit else mixc(acc, (40, 42, 54), .55) if j < lit else (54, 56, 68)
        cm.arc(cx, cy, R, a0, a1, col, 30 if j == lit else 22)
    ang = math.radians(-90 + 360 * u)
    cm.line([(cx, cy), (cx + (R - 40) * math.cos(ang), cy + (R - 40) * math.sin(ang))], acc + (180,), 5)
    tc = cue(s, p.get('cue'), d=s.start + .4)
    k = sp(t, tc - .05, .5, 14)
    if k > .01:
        cm.circle(cx, cy, 220, fill=(10, 10, 14, int(220 * clamp(k * 1.6))))
        cm.text(cx, cy - 18, p.get('value', ''), text_fit(p.get('value', ''), 170, 400) * (.9 + .1 * min(1.1, k)), acc, 900, 'mm', a=clamp(k * 1.6))
        if p.get('label'):
            cm.text(cx, cy + 100, p['label'], text_fit(p['label'], 46, 380, 800), TXT, 800, 'mm', a=clamp(k * 1.6))
        I.hit(fr, s, 'value', tc, 'l', cx, 1.15)
    big_words(cm, fr, s, t, y=WORDS_Y - 20)
    I.hit(fr, s, 'dial', s.start + .1, 'm', cx, 1.0)
    for j in range(int((t - s.start) / .5)):
        I.hit(fr, s, f'tk{j}', s.start + .5 + j * .5, 's', cx + 150, .7)


def k_rate(cm, fr, s, t, topic):
    """The same motion sampled at two rates: in each lane a lit card crosses at the same speed, but it can only be drawn at its lane's
    rate (slowed 8x), so the slow lane jumps in big steps and leaves sparse ghosts, the fast lane glides. lanes [{label, hz, cue, accent}]."""
    p = s.params
    acc = moodc(s, 'accent')
    lanes = p.get('lanes', [])
    period, x0, x1 = 2.2, 150, 870
    for j, ln in enumerate(lanes):
        y = 690 + j * 360
        tc = cue(s, ln.get('cue'), d=s.start + .15 + .3 * j)
        k = sp(t, tc - .1, .6, 12)
        if k <= .01:
            continue
        a = clamp(k * 1.6)
        D.panel(cm, 70, y - 80, 880, 330, r=36, lit=a, gold=bool(ln.get('accent')))
        col = acc if ln.get('accent') else TXT
        cm.text(110, y - 14, ln.get('label', ''), 80, col, 900, 'lm', a=a)
        q = ln.get('hz', 60) / 8.0   # positions drawn per second on screen, slowed 8x (60 Hz -> 7.5, 120 Hz -> 15)
        for g in range(5, -1, -1):   # ghosts: the last places it was drawn
            tq = math.floor((t - g / q) * q) / q
            u = ((tq - s.start) / period) % 1.0
            bx = x0 + (x1 - x0) * u
            al = a * (1.0 if g == 0 else .32 * (1 - g / 6))
            cm.rect(bx - 62, y + 50, 124, 124, r=26, fill=(col if g == 0 else mixc(col, (40, 40, 50), .4)) + (int(255 * al),))
        I.hit(fr, s, f'lane{j}', tc, 'm', 500, 1.0)
    big_words(cm, fr, s, t, y=WORDS_Y - 40)
    for j in range(int((t - s.start) / .45)):
        I.hit(fr, s, f'tk{j}', s.start + .45 + j * .45, 's', 700, .7)


def brick(cm, cx, cy, w, h, label, acc, t, lit=0.0):
    """A generic wall charger (our own drawing, no maker's design): a shaded body, a lit top rim, one USB-C port slot, its wattage big."""
    D.soft_shadow(cm, cx, cy + h * .54, w * .55, h * .05, 160)
    D.panel(cm, cx - w / 2, cy - h / 2, w, h, r=w * .2, lit=1.0, gold=lit > .5)
    cm.rect(cx - w * .2, cy + h * .3, w * .4, h * .07, r=h * .035, fill=(8, 8, 12), outline=(110, 110, 124), width=2)
    cm.text(cx, cy - h * .06, label, text_fit(label, 96, w * .84), acc if lit > .5 else TXT, 900, 'mm')


def k_charge(cm, fr, s, t, topic):
    """The power handshake (15 Nov 2026, the charger reel): a charger brick (left) and a phone (right) joined by a cable that sags under
    them. The charger's offers pop up one by one in the middle column on offer_cue ("5 V", "9 V", ...); on pick_cue the phone's pick
    lights in the mood's accent, the others dim, and power pulses run along the cable; the phone's battery bar fills over the shot (no
    digits: G13). Params: watts (the brick's label), offers [text], offer_cue, pick, pick_cue, label (under the phone), label_cue,
    fill [from, to] (battery level 0-1), photo / view (a full-bleed photo under it), words."""
    p = s.params
    acc = moodc(s, 'accent')
    photo_bg(cm, s, t)
    k_in = sp(t, s.start + .02, .6, 11) if s.i else 1.0
    kin = .9 + .1 * min(1.05, k_in)
    bx, by, bw, bh = 215, 1000, 260 * kin, 340 * kin
    px, py, ph = 770, 990, 600 * kin
    pw = ph * .5
    tp = cue(s, p.get('pick_cue'), d=s.start + 1.6) if p.get('offers') else s.start + .2
    if s.i == 0:
        tp = -1.0
    flow = clamp((t - tp) / .5)
    # the cable: from the brick's port down under the stage and up into the phone's foot
    pts = []
    for j in range(25):
        u = j / 24
        x0, y0, x1, y1 = bx, by + bh * .34, px, py + ph / 2 - 6
        x = (1 - u) ** 3 * x0 + 3 * (1 - u) ** 2 * u * x0 + 3 * (1 - u) * u * u * x1 + u ** 3 * x1
        y = (1 - u) ** 3 * y0 + 3 * (1 - u) ** 2 * u * (y0 + 230) + 3 * (1 - u) * u * u * (y1 + 200) + u ** 3 * y1
        pts.append((x, y))
    cm.line(pts, (40, 40, 48), 16)
    cm.line(pts, mixc((70, 72, 84), acc, .55 * flow), 9)
    if flow > 0:   # power pulses along the cable, brick to phone
        for q in range(3):
            u = ((t - tp) * .55 + q / 3) % 1.0
            x, y = pts[min(24, int(u * 24))]
            cm.circle(x, y, 13, fill=acc + (int(230 * flow),))
    brick(cm, bx, by, bw, bh, p.get('watts', '65 W'), acc, t, lit=1.0 if p.get('lit') else 0.0)
    # the phone, its battery bar filling (a bolt while power flows)
    D.soft_shadow(cm, px, py + ph * .52, pw * .62, ph * .045, 170)
    I.phone(cm, px, py, pw, ph, t, glow=.6 * flow)
    f0, f1 = (p.get('fill') or [.3, .6])[:2]
    lvl = mix(f0, f1, eio((t - s.start) / max(1.0, s.end - s.start)))
    bw2, bh2 = pw * .52, ph * .5
    x0, y0 = px - bw2 / 2, py - bh2 / 2 + ph * .04
    cm.rect(px - bw2 * .2, y0 - 22, bw2 * .4, 24, r=8, fill=(90, 92, 104))
    cm.rect(x0, y0, bw2, bh2, r=26, fill=(20, 21, 28), outline=(110, 112, 126), width=5)
    fh = (bh2 - 20) * lvl
    cm.rect(x0 + 10, y0 + bh2 - 10 - fh, bw2 - 20, fh, r=18, fill=mixc((120, 200, 140), acc, .35) + (235,))
    if flow > 0:
        cx_, cy_ = px, y0 + bh2 * .45
        cm.poly([(cx_ + 14, cy_ - 60), (cx_ - 30, cy_ + 8), (cx_ - 2, cy_ + 8), (cx_ - 14, cy_ + 60), (cx_ + 30, cy_ - 8), (cx_ + 2, cy_ - 8)],
                fill=(255, 255, 255, int(235 * flow)))
    # the offers, one by one in the middle column; the pick lights, the rest dim
    offers = p.get('offers') or []
    to = cue(s, p.get('offer_cue'), d=s.start + .4)
    for j, o in enumerate(offers):
        tc = to + .22 * j
        k = sp(t, tc, .5, 14)
        if k <= .01:
            continue
        y = 720 + j * 128
        picked = j == p.get('pick') and t >= tp
        a = clamp(k * 1.6) * (.4 if t >= tp and not picked else 1.0)
        cm.rect(492 - 80, y - 46, 160, 92, r=46, fill=(acc if picked else (30, 31, 40)) + (int(240 * a),),
                outline=(acc if not picked else (255, 255, 255)) + (int(200 * a),), width=3)
        cm.text(492, y, o, 48 * (.9 + .1 * min(1.1, k)), (16, 14, 12) if picked else TXT, 900, 'mm', a=a)
        I.hit(fr, s, f'of{j}', tc, 's', 492, .9)
    if offers:
        I.hit(fr, s, 'pick', tp, 'm', 520, 1.1)
    if p.get('label'):
        tc = cue(s, p.get('label_cue'), d=s.start + .5)
        k = sp(t, tc, .55, 13)
        if k > .01:
            cm.text(px, py + ph / 2 + 70, p['label'], text_fit(p['label'], 58, 330, 900), acc, 900, 'mm', a=clamp(k * 1.6))
            I.hit(fr, s, 'label', tc, 'm', px, 1.0)
    big_words(cm, fr, s, t)
    if s.i:
        I.hit(fr, s, 'in', s.start + .15, 'l', CX, 1.1)
    for j in range(int((s.end - s.start) / .5) + 1):   # a soft tick per power pulse (G7: no quiet run)
        I.hit(fr, s, f'tk{j}', s.start + .45 + j * .5, 's', 640, .6)


KINDS = {'hero': k_hero, 'duo': k_duo, 'strip': k_strip, 'clock': k_clock, 'rate': k_rate, 'charge': k_charge}


def shot(cm, fr, s, t, topic):
    if s.kind in KINDS:
        KINDS[s.kind](cm, fr, s, t, topic)
    elif s.kind in I.SETS:   # an idea-look world through the same camera
        I.SETS[s.kind](cm, fr, s, t, s)
        big_words(cm, fr, s, t)
        for j in range(int((s.end - s.start) / .7) + 1):   # (15 Nov 2026) a soft tick every 0.7 s, as the story kinds have (G7: no quiet run)
            I.hit(fr, s, f'stk{j}', s.start + .35 + j * .7, 's', 700, .6)
    else:
        raise SystemExit(f'unknown shot kind "{s.kind}" (story: {", ".join(KINDS)}; idea sets: {", ".join(I.SETS)})')


def has_photo(s):
    return bool(s.params.get('photo') and PH.has(s.params['photo']))


# ---------- the camera ----------
def drift(t):
    return 9 * math.cos(t * .58) + 3 * math.sin(t * 1.3 + 2), 9 * math.sin(t * .58) + 3 * math.sin(t * 1.1)


def base_cam(s, t):
    """Inside a shot: a slow push towards its focus ("push": [zoom, x, y]) over the whole shot, and the drift."""
    pz, px, py = s.params.get('push', [1.07, FOC[0], FOC[1]])
    k = eio((t - s.start) / max(1.0, s.end - s.start))
    return 1 + (pz - 1) * k, (px, py)


def cam_for(fr, s, t, z=1.0, off=(0.0, 0.0), a=1.0, focus=None, ta=None):
    bz, bf = base_cam(s, t)
    dx, dy = drift(t)
    return I.Cam(fr, focus or bf, bz * z, (dx + off[0], dy + off[1]), a, a if ta is None else ta)


def move_state(s, t):
    """k (0..1) of the move into shot s at t, or None outside it."""
    if s.i == 0:
        return None
    k = (t - (s.start - .05)) / TR
    return None if k >= 1 or k < 0 else k


def pan_dir(s):
    d = s.params.get('dir')
    return {'left': 1, 'right': -1}.get(d, 1 if s.i % 2 else -1)


def _zoom_a(k):
    return 1 + 2.4 * eio(k) ** 1.6


def motion(scenes, t):
    """The camera's speed now, for the motion blur: (zoom log-ratio per frame, pan px per frame)."""
    for s in scenes[1:]:
        k = move_state(s, t)
        if k is None:
            continue
        k2 = k + 1 / 30 / TR
        if s.move == 'pan':
            return 0.0, -pan_dir(s) * W * 1.04 * (eio(k2) - eio(k))
        if s.move in ('zoom', 'push'):
            f = (lambda q: 1 + 2.4 * eio(q) ** 1.6) if s.move == 'zoom' else (lambda q: 1 + 3.2 * eio(q) ** 2)
            return math.log(f(min(1.0, k2)) / f(k)) * (1 - eio(k)), 0.0
    return 0.0, 0.0


def _layer(t, s, topic, cmkw, mask_c, mask_r):
    """Shot s drawn on its own layer (its own room in its own mood), returned with an L mask (a circle) for the reveal."""
    bg, _ = room(s.mood, s.mood, 0, t, drift(t))
    lf = B.Frame(bg)
    lf.t, lf.bare = t, None
    cm = cam_for(lf, s, t, **cmkw)
    shot(cm, lf, s, t, topic)
    D.motes(lf, t, drift(t), a=.6)
    m = Image.new('L', (W * SS, H * SS), 0)
    cx, cy = mask_c
    r = mask_r
    ImageDraw.Draw(m).ellipse([(cx - r) * SS, (cy - r) * SS, (cx + r) * SS, (cy + r) * SS], fill=255)
    return lf, m


def _merge(fr, lf, m, c, r):
    fr.img.paste(lf.img, (0, 0), m)
    for b in lf.boxes:   # the layer's texts count for the layout check only where the reveal shows them
        bx, by = (b[1] + b[3]) / 2, (b[2] + b[4]) / 2
        if math.hypot(bx - c[0], by - c[1]) < r:
            fr.boxes.append(b)
    fr.warnings += lf.warnings


# ---------- captions ----------
def captions(fr, words, t, idx, size=78, max_w=860, key=None, instant=False, acc=YEL):
    """Word-synced captions low in the frame (centre CAP_Y): white with a dark outline, the spoken word in the gold accent and lifted,
    words not yet spoken dimmed (the kit's kinetic captions)."""
    disp = [words[i]['d'] for i in idx]
    rows = B.wrap(disp, size, max_w, 900)
    while len(rows) > 2 and size > 64:   # a long chunk shrinks a little before it ever takes a third row
        size -= 2
        rows = B.wrap(disp, size, max_w, 900)
    if len(rows) > 2:
        fr.warnings.append(f'caption needs {len(rows)} lines: "{" ".join(disp)}"')
    cur = max((j for j in range(len(idx)) if words[idx[j]]['s'] - .03 <= t), default=-1)
    k0 = 1.0 if instant else B.clamp((t - (words[idx[0]]['s'] - .1)) / .14)
    lh = size * 1.14
    y0 = CAP_Y - lh * (len(rows) - 1) / 2
    gap = 22
    for r, row in enumerate(rows):
        x = CX - (sum(B.text_w(disp[j], size, 900) for j in row) + gap * (len(row) - 1)) / 2
        for j in row:
            w = disp[j]
            said = instant or words[idx[j]]['s'] - .03 <= t
            gold = j == cur or (key and w.strip('?,.!:') == key)
            lift = 6 * math.exp(-((t - words[idx[j]]['s']) / .12) ** 2) if j == cur else 0
            a = k0 * (1.0 if said else .5)
            stroke_text(fr, x, y0 + r * lh - lift + (1 - k0) * 20, w, size, acc if gold else (255, 255, 255), 'lm', a=a)
            x += B.text_w(w, size, 900) + gap


def caption_bed(fr):
    for j in range(16):
        y = 1336 + j * 18
        k = math.sin(math.pi * (j + .5) / 16)
        fr.rect(0, y, W, 19, fill=(4, 4, 6, int(150 * k)))


_EDGE = []


def edge_feather(img):
    """A slim dark feather at the frame's border (48 px at the sides, 64 at top and bottom): full-bleed photos and worlds use the whole frame,
    and nothing busy sits on the outer edge (Output QA EDGES)."""
    if not _EDGE:
        x = np.minimum(np.arange(W), np.arange(W)[::-1]).astype(np.float32)
        y = np.minimum(np.arange(H), np.arange(H)[::-1]).astype(np.float32)
        fx = .1 + .9 * np.clip(x / 48, 0, 1) ** 1.5
        fy = .1 + .9 * np.clip(y / 64, 0, 1) ** 1.5
        _EDGE.append((fy[:, None] * fx[None, :])[..., None])
    return np.clip(img.astype(np.float32) * _EDGE[0], 0, 255).astype(np.uint8)


# ---------- the frame ----------
def draw(t, topic, vo, hook_out, scenes, chunks):
    PH.setup(topic)
    cur = max((s for s in scenes if t >= s.start - .05), key=lambda s: s.start, default=scenes[0])
    prev = scenes[cur.i - 1] if cur.i > 0 else None
    k = move_state(cur, t)
    mv = cur.move if k is not None else None
    ke = eio(k) if k is not None else 1.0
    dr = drift(t)
    if mv in ('zoom', 'pan'):
        bg, small = room(prev.mood, cur.mood, ke, t, dr)
    elif mv in ('push', 'match'):
        bg, small = room(prev.mood, prev.mood, 0, t, dr)
    else:
        bg, small = room(cur.mood, cur.mood, 0, t, dr)
    fr = B.Frame(bg)
    fr.t, fr.bare = t, small
    D.motes(fr, t, (dr[0] * 3, dr[1] * 3), a=.8)
    focus = FOC
    if mv is None:
        shot(cam_for(fr, cur, t), fr, cur, t, topic)
        focus = base_cam(cur, t)[1]
    elif mv == 'pan':
        d = pan_dir(cur)
        shot(cam_for(fr, prev, t, off=(-d * W * 1.04 * ke, 0.0)), fr, prev, t, topic)
        shot(cam_for(fr, cur, t, off=(d * W * 1.04 * (1 - ke), 0.0)), fr, cur, t, topic)
    elif mv == 'zoom':
        shot(cam_for(fr, cur, t, z=.6 + .4 * ke, a=eio(k / .55)), fr, cur, t, topic)
        shot(cam_for(fr, prev, t, z=_zoom_a(k), a=1 - eio((k - .25) / .75), ta=clamp(1 - 2.5 * k)), fr, prev, t, topic)   # its type leaves first: no giant word past the frame
    else:   # push / match: the new shot opens from a point of the old one, in its own mood
        pa = tuple(prev.params.get('match', FOC))
        pb = tuple(cur.params.get('match', FOC)) if mv == 'match' else pa
        pc = (mix(pa[0], pb[0], ke), mix(pa[1], pb[1], ke))
        if mv == 'push':
            shot(cam_for(fr, prev, t, z=1 + 3.2 * ke ** 2, focus=pa, ta=clamp(1 - 2.5 * k)), fr, prev, t, topic)
            r = 30 + DIAG * 1.05 * eio(k)
            lf, m = _layer(t, cur, topic, dict(z=1.35 - .35 * ke, focus=pa), pc, r)
        else:
            shot(cam_for(fr, prev, t, z=1 + .25 * ke, off=(pc[0] - pa[0], pc[1] - pa[1])), fr, prev, t, topic)
            r = 40 + DIAG * 1.05 * eio(k)
            lf, m = _layer(t, cur, topic, dict(off=((pa[0] - pb[0]) * (1 - ke), (pa[1] - pb[1]) * (1 - ke))), pc, r)
        if r > 1:
            _merge(fr, lf, m, pc, r)
            if 80 < r < DIAG:   # a lit rim on the opening, in the new mood's accent
                fr.circle(pc[0], pc[1], r, outline=MOODS[cur.mood]['accent'] + (int(200 * (1 - ke)),), width=5)
        focus = pc
    if not has_photo(cur) and mv is None:
        D.reflect(fr, y_src=1150, y_dst=1530, h=280, a=.11)
    caption_bed(fr)
    if B.EVENTS is not None:
        for s in scenes[1:]:
            I.hit(fr, s, 'move', s.start - .02, 'l', CX, 1.0)
    acc = YEL
    for li, line in enumerate(vo['lines']):
        nx = vo['lines'][li + 1]['start'] if li + 1 < len(vo['lines']) else B_DUR[0] - .3
        st = 0.0 if li == 0 else line['start'] - .1
        if st <= t < nx - .1:
            ch = chunks(line, topic['lines'][li].get('chunks'))
            c = 0
            for ci, cc in enumerate(ch):
                if t >= line['words'][cc[0]]['s'] - .08:
                    c = ci
            captions(fr, line['words'], t, ch[c], key=topic.get('hook_key') if li == 0 else None, instant=li == 0 and c == 0, acc=acc)
    fade = 1 - B.prog(t, B_DUR[0] - .3, B_DUR[0])
    zr, pan = motion(scenes, t)
    out = D.post(fr.finish(glow_strength=0.0, fade=fade), t, zoom=zr, pan=pan, focus=focus, sharp=(1360, 1600), hud=0)
    return fr, edge_feather(out)


# ---------- the storytelling preflight (make.py --stills prints these) ----------
LENGTHS = {'short': (19.0, 23.5, 50, 70, 2, 2), 'long': (39.0, 46.0, 100, 140, 2, 3)}


def story_lines(topic, vo):
    """STORY: the beats in order (payoff -> question -> 2-3 steps, each with a source -> surprise -> optional takeaway).
    LENGTH: the reel's length class (20 s or 40-45 s) and its spoken words, against that class's word range."""
    beats = [l.get('beat', '?') for l in topic['lines']]
    bad = []
    if not beats or beats[0] != 'payoff':
        bad.append('line 1 must be the payoff (the answer image in frame 0)')
    if len(beats) < 2 or beats[1] != 'question':
        bad.append('line 2 must be the one question')
    steps = [i for i, b in enumerate(beats) if b == 'step']
    if beats.count('question') != 1:
        bad.append('exactly one question')
    if not 2 <= len(steps) <= 3:
        bad.append(f'{len(steps)} steps (need 2-3)')
    if steps and steps != list(range(2, 2 + len(steps))):
        bad.append('the steps follow the question, one after another')
    if 'surprise' not in beats:
        bad.append('no surprise beat')
    else:
        tail = beats[beats.index('surprise') + 1:]
        if any(b != 'takeaway' for b in tail) or len(tail) > 1:
            bad.append('only an optional takeaway may follow the surprise')
    srcs = (topic.get('post') or {}).get('sources') or []
    for i in steps + [i for i, b in enumerate(beats) if b == 'surprise']:
        si = topic['lines'][i].get('source')
        idxs = si if isinstance(si, list) else [si]
        if si is None or any(not isinstance(x, int) or not 0 <= x < len(srcs) for x in idxs):
            bad.append(f'line {i + 1} ({beats[i]}): "source" must index post.sources (a sourced fact)')
    hook_w = len(topic['lines'][0]['text'].split())
    if hook_w > 7:
        bad.append(f'the payoff line has {hook_w} words (7 at most: it is said over the answer image)')
    dur = float(topic.get('dur', 20))
    cls = 'long' if dur >= 30 else 'short'
    d0, d1, w0, w1, s0, s1 = LENGTHS[cls]
    words = sum(len(w['d'].split()) for l in vo['lines'] for w in l['words'])
    lb = []
    if not d0 <= dur <= d1:
        lb.append(f'dur {dur} outside {d0}-{d1}')
    if not w0 <= words <= w1:
        lb.append(f'{words} words (need {w0}-{w1})')
    if len(steps) < s0:
        lb.append(f'{len(steps)} steps (a {cls} reel needs {s0}-{s1})')
    if vo['dur'] > dur - .5:
        lb.append(f'the voice ends at {vo["dur"]:.1f} s, too close to the end ({dur} s)')
    out = ['STORY: ' + (' -> '.join(beats) + ': ok' if not bad else 'FIX: ' + '; '.join(bad)),
           f'LENGTH: {cls} ({dur:.0f} s), {words} words, voice ends {vo["dur"]:.1f} s' + (': ok' if not lb else ': FIX: ' + '; '.join(lb))]
    return out, len(bad) + len(lb)


_unused = (Image, random)
