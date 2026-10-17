// Film parts: the reusable vocabulary for the daily films. Loaded by render-film.mjs after engine.js and before the story, as window.FilmParts (P).
// Every part is a pure function of film time: create it in setup(), then call P.update(t) at the end of the story's update(). Each part records the SLOT it fills
// (P.use), and the renderer writes film/ID/manifest.json from that; scripts/check.mjs refuses a film that repeats the previous one (CLAUDE.md "Directed film").
// THE MENU (pick a different combination every film; add one new option every film). ORIGINALITY: parts learned from a specific reel the owner shared are
// tagged in scripts/film/sources.json; a film may use at most one per reference and never as its payoff (check.mjs): learn from references, never rebuild one.
//   easing     P.cubicBezier  P.EASE.glide|snap|settle|swing  P.spring(t, {stiffness,damping,mass})  P.SPRING.default|bouncy|bold|fade  P.tween  P.springAt  P.life
//              (no linear motion: arrivals ease out from rest, departures ease in 35% faster; check with render-film.mjs ID --motion-check)
//   ground     P.scene({ accent, ink })            black | deep colour (ink like #1a0712) | light (ink like #f4f1ea): cards, captions and dust adapt
//   opener     P.rackWord  P.drawOn  P.assemble    (or a bespoke opening image, declared in S.dna.opening)
//   transition P.scan  P.wave  P.iris  P.blinds  P.zoomThrough  P.whip  P.shapeWipe  P.pendulum (a swinging tag is the wipe)  P.interstitial (cut to a pivot line)
//   mechanism  P.serpClimb (a search result climbs from #7 to #1 and restyles; web/SEO)  P.vessel (OUR metaphor: the site is a vessel, customers the water, pains leak it, services patch it; also an opener)  P.hub  P.route  P.gridFill  P.steps  P.deck  P.meter  P.compare  P.radial (diagram tour + pull-back title)  P.orbit (collage)  (+ P.chat inside P.phone)
//   focus      P.brackets  P.spotlight  P.lens
//   payoff     P.underwater (dive: caustics, rays, cards rising at three depths)  P.riseChips (messages float up: customers who now stay)  P.payoff (warm flood)  P.stamp  P.burst  P.sweep  P.bloom  P.shield (attacks burst on a shield; also a security/edge mechanism: slot 'mechanism')
//   type       P.sentence (builds word by word)  P.giant (one huge word)  P.typewriter  P.flipWords (word per beat, ground flips)  P.construct (letters snap together)  P.inlineIcon
//   captions   P.captions(list, { style: 'pill' | 'bare' | 'underline' | 'mono' | 'blur' })   the spine: 1-3 words per card at y 492
//   cta        P.card (+ P.brackets)  P.tap (cursor taps a button)  P.ring (rotating text badge)
//   camera     P.camera (keyed camera with shake; films DOM layers + canvases)   texture  P.grain   (and P.dripWord: wet display type)
//   system map P.sys (game look: neon grid, glowing cables with flowing packets, comets, glossy component chips, bursts; one camera)
//   machine    P.iso (isometric machines: the object IS the explanation; box, cyl, coil, ticks, dot, path; four-tone shading, depth-sorted)
//   soft3d     P.clay (a clay character: moods with colour, squash and stretch, blinks, depth particles via .fx)  P.dome (a glass hex shield drawn on round a subject; hits ripple)
//   3D         P.tank3d (the leaky vessel in real 3D, for hero shots)  P.three (WebGL scene, procedural studio light)  P.three.look (keyed 3D camera on springs)  P.three.roundRect
//   brand      P.BRAND (kit colours)  P.brandMark()  P.brandEnd({ keyword }) (the ending of every new film; design/brand/kit.md)
//   other      P.phone  P.clock  P.shape (a recurring brand shape)  P.signoff (the studio name + DM us, at the end; the always-on watermark was retired 14 Oct 2026, P.watermark() is opt-in only)
// helpers: P.fade, P.pop, P.rel (measure an element), P.icon/P.icons, P.hexA, P.sm, P.css. Gallery of every option: render the test films in design/film-playbook.md.
(function () {
  const E = window.FilmEngine, { clamp, lerp, ease } = E, TAU = Math.PI * 2;
  let sm = (a, b, t) => ease.io3(clamp((t - a) / (b - a)));          // replaced by the toolkit's swing below (once P exists)
  const css = (el, o) => { for (const k in o) el.style[k] = o[k]; };
  const MONO = "'Geist Mono','JetBrains Mono',ui-monospace,monospace";   // single quotes: it is used inside style="..." attributes
  const P = (window.FilmParts = { sm, css, MONO, TAU, ups: [], accent: '#c8ff3d', ink: '#050607', len: 18 });
  // the parts' own type (captions, HUD) must not depend on the page's fonts: load Archivo (width axis) + Geist Mono; stories `await P.ready` in setup()
  P.ready = (async () => {
    try {
      const l = document.createElement('link'); l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Geist+Mono:wght@400..700&family=Montserrat:wght@500;800&display=block';
      document.head.appendChild(l); await new Promise((ok) => { l.onload = ok; l.onerror = ok; setTimeout(ok, 6000); });
      await Promise.all(['700 28px Archivo', '800 28px Archivo', '900 30px Archivo', '400 11px "Geist Mono"', '500 11px "Geist Mono"', '600 11px "Geist Mono"', '700 11px "Geist Mono"', '800 54px Montserrat', '500 12px Montserrat'].map((f) => document.fonts.load(f)));
    } catch (e) { /* fall back to system fonts */ }
  })();
  // =====================================================================================================================================
  // EASING TOOLKIT (14 Oct 2026, motion focus: easing + spring physics). Linear or default ease-in-out motion is the clearest sign of an amateur reel.
  // Every position, scale, opacity and camera move in a film goes through these. Pure functions of film time; each use is tagged P.use('easing', id).
  //   P.cubicBezier(x1, y1, x2, y2) -> k => eased (Newton-Raphson, max 8 iterations, bisection fallback)
  //   P.EASE.glide (0.16,1,0.3,1: long soft arrival)  .snap (0.7,0,0.84,0: accelerating departure)  .settle (0.34,1.56,0.64,1: overshoot)  .swing (0.65,0,0.35,1: in-out,
  //          zero speed at both ends, for drifts and holds)
  //   P.spring(t, { stiffness, damping, mass }) -> 0..1 step response of a real damped spring started at rest (t in seconds); defaults 170/26/1;
  //   P.SPRING.fade (1100/66/1: opacity arrivals, full by frame 6, starts at rest)  P.SPRING.default (170/26/1, no overshoot)  .bouncy (220/14/1, ~19% overshoot: cartoon only)  .bold (300/24/1, ~5% overshoot, settles in ~12 frames)
  //   P.tween(t, t0, dur, name) / P.springAt(t, t0, name)  and  P.life(t, a, b, opts): arrival (ease out) + departure (ease in, 30-40% faster) for one element
  //   P.easeInfo(name) -> { overshoot (fraction of travel), settleFrames (within 1%) } for the self-check
  // =====================================================================================================================================
  P.cubicBezier = (x1, y1, x2, y2) => {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const X = (u) => ((ax * u + bx) * u + cx) * u, Y = (u) => ((ay * u + by) * u + cy) * u, dX = (u) => (3 * ax * u + 2 * bx) * u + cx;
    return (k) => {
      if (k <= 0) return 0; if (k >= 1) return 1;
      let u = k;
      for (let i = 0; i < 8; i++) { const e = X(u) - k; if (Math.abs(e) < 1e-7) break; const d = dX(u); if (Math.abs(d) < 1e-6) break; u -= e / d; }
      if (!(u >= 0 && u <= 1) || Math.abs(X(u) - k) > 1e-5) { let lo = 0, hi = 1; u = k; for (let i = 0; i < 30; i++) { if (X(u) < k) lo = u; else hi = u; u = (lo + hi) / 2; } }
      return Y(u);
    };
  };
  P.EASE = { glide: P.cubicBezier(.16, 1, .3, 1), snap: P.cubicBezier(.7, 0, .84, 0), settle: P.cubicBezier(.34, 1.56, .64, 1), swing: P.cubicBezier(.65, 0, .35, 1) };
  P.SPRING = { default: { stiffness: 170, damping: 26, mass: 1 }, bouncy: { stiffness: 220, damping: 14, mass: 1 }, bold: { stiffness: 300, damping: 24, mass: 1 }, fade: { stiffness: 1100, damping: 66, mass: 1 } };   // fade: critically damped, 99% by frame 6, starts at rest (opacity arrivals)
  P.spring = (t, { stiffness = 170, damping = 26, mass = 1 } = {}) => {
    if (t <= 0) return 0;
    const w0 = Math.sqrt(stiffness / mass), z = damping / (2 * Math.sqrt(stiffness * mass));
    if (z < .999) { const wd = w0 * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * w0 * t) * (Math.cos(wd * t) + (z * w0 / wd) * Math.sin(wd * t)); }
    if (z <= 1.001) return 1 - Math.exp(-w0 * t) * (1 + w0 * t);
    const q = Math.sqrt(z * z - 1), r1 = -w0 * (z - q), r2 = -w0 * (z + q);
    return 1 + (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r1 - r2);
  };
  sm = (a, b, t) => P.EASE.swing(clamp((t - a) / (b - a))); P.sm = sm;
  const EASE_USED = (id) => P.use && P.used && P.use('easing', id);
  P.ease = (name) => { if (typeof name === 'function') return name; EASE_USED(name); if (P.EASE[name]) return P.EASE[name]; throw new Error('unknown ease ' + name); };
  P.tween = (t, t0, dur, name = 'swing') => P.ease(name)(clamp((t - t0) / dur));
  P.springAt = (t, t0, name = 'default') => { const cfg = typeof name === 'string' ? P.SPRING[name] : name; if (typeof name === 'string') EASE_USED('spring-' + name); return P.spring(t - t0, cfg); };
  // one element's life: it arrives at a (shape by `enter`: a spring name or an ease name, over inDur), its opacity is full by frame 6, it leaves before b with an
  // ease-in that is 35% faster than the arrival. Returns { k (arrival shape, may overshoot), o (opacity), x (departure 0..1) }
  P.life = (t, a, b, { enter = 'bold', inDur = .45, fade = .2, exitRatio = .65 } = {}) => {
    const k = P.SPRING[enter] ? P.springAt(t, a, enter) : P.tween(t, a, inDur, enter);
    const outDur = Math.max(.1, inDur * exitRatio), x = b == null ? 0 : P.tween(t, b - outDur, outDur, 'snap');
    const o = t < a ? 0 : P.springAt(t, a, 'fade') * (1 - x);
    return { k, o, x };
  };
  P.easeInfo = (name) => {
    const f = P.SPRING[name] ? (tt) => P.spring(tt, P.SPRING[name]) : (tt) => P.EASE[name](clamp(tt / .5));   // beziers measured over a 0.5 s move
    let peak = 0, last = 0; for (let i = 0; i <= 900; i++) { const tt = i / 300, v = f(tt); peak = Math.max(peak, v); if (Math.abs(v - 1) > .01) last = tt; }
    return { overshoot: Math.max(0, peak - 1), settleFrames: Math.ceil(last * 30) };
  };
  P.used = {};                                                          // auto-manifest: every part records the slot it fills (render-film.mjs writes film/ID/manifest.json)
  P.use = (slot, id) => { (P.used[slot] = P.used[slot] || []).includes(id) || P.used[slot].push(id); };
  P.on = (fn) => { P.ups.push(fn); return fn; };
  P.update = (t) => { const tf = E.frame / 30; P.ups.forEach((f) => f(t, tf)); };
  const hexA = (hex, a) => { const h = hex.replace('#', ''); const n = parseInt(h.length === 3 ? h.replace(/./g, '$&$&') : h, 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; };
  P.hexA = hexA;
  P.MAT = 'background:linear-gradient(160deg,#1e2225,#0b0d0f);box-shadow:inset 0 1px 0 rgba(255,255,255,.09),0 0 0 1px rgba(255,255,255,.09),0 14px 30px rgba(0,0,0,.5)';
  P.icons = {
    calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M8 15l2.5 2.5L16 13"/>',
    rupee: '<circle cx="12" cy="12" r="9"/><path d="M8.5 8h7M8.5 11h7M8.5 8c4 0 4 6 0 6l5 4"/>',
    bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
    cart: '<path d="M3 4h2l2.4 11h10.2L20 7H6.2"/><circle cx="9.5" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    pin: '<path d="M12 21s7-6 7-11.5a7 7 0 1 0-14 0C5 15 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.8 2.8L16.5 9.5"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/><path d="M12 15v2.5"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/>',
    spark: '<path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M19 5l-4 4M9 15l-4 4"/>',
  };
  P.icon = (name, size = 24) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P.icons[name] || name}</svg>`;

  // ---- scene: stage the film on near-black with one accent; the page's own DOM is hidden (stories clone what they need) ----
  P.scene = function ({ accent = P.accent, ink = P.ink, glow = 'rgba(110,140,120,.13)', len = 18 } = {}) {
    P.accent = accent; P.ink = ink; P.len = len;
    const lumOf = (c) => { const h = c.replace('#', ''); if (h.length < 6) return 0; const n = parseInt(h.slice(0, 6), 16); return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255; };
    P.light = lumOf(ink) > .5; P.fg = P.light ? '#121417' : '#f2f4f2';
    if (P.light) P.MAT = 'background:linear-gradient(160deg,#ffffff,#eef0ec);box-shadow:inset 0 1px 0 #fff,0 0 0 1px rgba(0,0,0,.07),0 14px 30px rgba(20,24,20,.12)';
    P.use('ground', P.light ? 'light' : (lumOf(ink) < .04 ? 'black' : 'deep-colour'));
    E.stage(); E.cam.style.display = 'none';
    [E.stageEl, document.body, document.documentElement].forEach((e) => { e.style.background = ink; });
    const L = (P.L = E.el('div', `position:absolute;inset:0;overflow:hidden;background:${ink}`, E.stageEl)); E.stageEl.insertBefore(L, E.fx); E.scene = L;
    E.el('div', `position:absolute;inset:0;background:radial-gradient(70% 45% at 50% 40%,${glow},rgba(0,0,0,0) 70%)`, L);
    P.back = E.el('div', 'position:absolute;inset:0', L);                    // behind everything (payoff flood lives here)
    const cv = E.el('canvas', 'position:absolute;inset:0;width:402px;height:715px', L); cv.width = 804; cv.height = 1430; const g = cv.getContext('2d');
    let s = 4242; const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    const dust = Array.from({ length: 70 }, () => ({ x: rnd() * 804, y: rnd() * 1430, r: .6 + rnd() * 1.6, a: .12 + rnd() * .38, p: rnd() * TAU }));
    const bokeh = [[-70, 520, 190, hexA(accent, .11)], [300, 110, 150, 'rgba(255,255,255,.07)'], [250, 610, 170, 'rgba(255,190,120,.10)']].map(([x, y, d, c]) => E.el('div', `position:absolute;left:${x}px;top:${y}px;width:${d}px;height:${d}px;border-radius:50%;background:radial-gradient(circle,${c},rgba(0,0,0,0) 70%);filter:blur(10px)`, L));
    const world = (P.world = E.el('div', 'position:absolute;inset:0;transform-origin:50% 45%', L));
    P.front = E.el('div', 'position:absolute;inset:0;pointer-events:none', L);   // HUD + captions (they do not shake with the world)
    P.punchAt = null; P.breath = null; P.warmBokeh = null;
    P.on((t, tf) => {
      const ph = TAU * t / len;
      g.clearRect(0, 0, 804, 1430); g.fillStyle = '#fff';
      g.fillStyle = P.light ? '#3a3f44' : '#fff';
    for (const d of dust) { g.globalAlpha = d.a * (.6 + .4 * Math.sin(d.p + tf * 1.3)); g.beginPath(); g.arc(d.x + 10 * Math.sin(ph + d.p), d.y + 16 * Math.sin(ph * 2 + d.p * 1.7), d.r, 0, TAU); g.fill(); }
      bokeh.forEach((b, i) => { b.style.transform = `translate(${(14 * Math.sin(ph + i * 2)).toFixed(1)}px,${(10 * Math.cos(ph + i)).toFixed(1)}px)`; });
      if (P.warmBokeh) bokeh[2].style.opacity = String(.25 + .75 * P.warmBokeh(t));
      const pu = P.punchAt != null && t >= P.punchAt ? (t - P.punchAt) / .09 : 0, punch = pu > 0 ? .04 * pu * Math.exp(1 - pu) : 0,   // smooth impulse: rises from 0, peaks at 90 ms, decays (no jump)
        drift = .012 * Math.sin(ph);
      const dim = P.dimNow = P.breath && t >= P.breath[0] && t < P.breath[1] + .15 ? P.springAt(t, P.breath[0], 'fade') * (1 - P.tween(t, P.breath[1], .16, 'snap')) : 0;
      css(world, { transform: `scale(${(1 + drift + punch).toFixed(4)})`, filter: dim > .01 ? `brightness(${(1 - .7 * dim).toFixed(3)})` : 'none' });
      E.vig.style.opacity = ((P.light ? .12 : .45) + .4 * dim).toFixed(3);
      E.field.style.opacity = 0;
    });
    return { L, world };
  };

  // ---- watermark: on every reel, all the time (owner, 13 Oct 2026). Top right, below Instagram's top bar and above its button column ----
  // ---- watermark: on every reel, all the time (owner, 14 Oct 2026: lower centre, not the top corner). It sits in the band between the captions (anchor y 492)
  // and Instagram's caption area (bottom 22%), centred. The mark is the Aquarius sign (two waves) + the studio name; a soft shadow keeps it legible on any ground.
  P.watermark = function ({ text = 'Aquarii Tech Studio', y = 540 } = {}) {
    if (P.wm) return P.wm;
    const ink = P.light ? '#0d1014' : '#ffffff', halo = P.light ? 'rgba(255,255,255,.85)' : 'rgba(0,0,0,.6)';
    P.wm = E.el('div', `position:absolute;left:0;right:0;top:${y}px;display:flex;justify-content:center;pointer-events:none`, P.front);
    E.el('div', `display:flex;align-items:center;gap:7px;padding:5px 11px 5px 9px;border-radius:99px;background:${P.light ? 'rgba(255,255,255,.55)' : 'rgba(0,0,0,.38)'};backdrop-filter:blur(8px) saturate(1.2);-webkit-backdrop-filter:blur(8px);box-shadow:0 0 0 1px ${hexA(ink, .08)};font:600 9.5px/1 ${MONO};letter-spacing:.24em;text-transform:uppercase;color:${hexA(ink, .78)};text-shadow:0 0 6px ${halo}`, P.wm,
      `<svg viewBox="0 0 16 12" width="15" height="11" aria-hidden="true" style="filter:drop-shadow(0 0 3px ${halo})"><path d="M1 5 3.5 2.5 6 5 8.5 2.5 11 5 13.5 2.5 15 4M1 10 3.5 7.5 6 10 8.5 7.5 11 10 13.5 7.5 15 9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span>${text}</span>`);
    P.wm.style.top = (y - 5) + 'px';
    P.wmHide = [];                                                         // [[t0, t1]] windows where the sign-off replaces it
    P.on((t) => { let o = 1; P.wmHide.forEach(([a, b]) => { o *= 1 - sm(a - .2, a, t) * (1 - sm(b, b + .2, t)); }); P.wm.style.opacity = o.toFixed(3); });
    return P.wm;
  };

  // ---- material card ----
  P.card = function (parent, cssText, html, { active = false } = {}) {
    const c = E.el('div', `position:absolute;box-sizing:border-box;border-radius:18px;${P.MAT};color:${P.fg};${cssText}`, parent, html);
    c.setActive = (on) => { c.style.boxShadow = on ? `inset 0 1px 0 rgba(255,255,255,.09),0 0 0 1px ${hexA(P.accent, .6)},0 0 22px ${hexA(P.accent, .3)}` : ''; c.style.color = on ? P.accent : P.fg; };
    if (active) c.setActive(true);
    return c;
  };

  // ---- corner brackets (focus) ----
  P.brackets = function (parent) {
    P.use('focus', 'brackets');
    const b = E.el('div', 'position:absolute;left:0;top:0;width:0;height:0;opacity:0;z-index:5', parent);
    const A = P.accent, w = '2.5px';
    b.c = [0, 1, 2, 3].map((i) => E.el('i', `position:absolute;width:12px;height:12px;border-color:${A};border-style:solid;border-width:${i < 2 ? w : '0'} ${i % 2 ? w : '0'} ${i >= 2 ? w : '0'} ${i % 2 ? '0' : w};filter:drop-shadow(0 0 3px ${hexA(A, .8)})`, b));
    b.dot = E.el('i', `position:absolute;width:7px;height:7px;border-radius:50%;background:#fff;box-shadow:0 0 0 3px ${hexA(A, .45)},0 0 14px 4px ${hexA(A, .6)}`, b);
    b.place = (box, k, o) => {
      const d = (1 - k) * 14 + 5, { x, y, w: bw, h } = box;
      [[x - d, y - d], [x + bw + d - 12, y - d], [x - d, y + h + d - 12], [x + bw + d - 12, y + h + d - 12]].forEach(([px, py], i) => css(b.c[i], { transform: `translate(${px.toFixed(1)}px,${py.toFixed(1)}px)` }));
      css(b.dot, { transform: `translate(${(x + bw + d - 3.5).toFixed(1)}px,${(y - d - 3.5).toFixed(1)}px)` });
      b.style.opacity = o.toFixed(3);
    };
    // snap onto `box` at `at` (spring), hold, leave at `out`
    b.snap = (box, at, out) => P.on((t) => { if (t < at - .05 || t > out + .2) { if (b.owner === box) b.style.opacity = '0'; return; } b.owner = box; b.place(box, ease.spring(clamp((t - at) / .45)), clamp((t - at + .05) / .08) * (1 - sm(out, out + .15, t))); });
    return b;
  };
  // box of `el` relative to `par` (measure in setup, before transforms)
  P.rel = (el, par) => { const a = el.getBoundingClientRect(), b = par.getBoundingClientRect(); return { x: a.left - b.left, y: a.top - b.top, w: a.width, h: a.height }; };

  // ---- phone ----
  P.phone = function (parent, { x = 66, y = 140, w = 270, h = 600 } = {}) {   // big by default: fills the width and runs off the bottom edge
    P.use('device', 'phone');
    const halo = E.el('div', `position:absolute;left:${x - 50}px;top:${y - 14}px;width:${w + 100}px;height:${h + 28}px;border-radius:50%;background:radial-gradient(closest-side,${hexA(P.accent, .16)},rgba(0,0,0,0));filter:blur(14px)`, parent);
    const el = E.el('div', `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:30px;padding:7px;box-sizing:border-box;background:linear-gradient(160deg,#272b2f,#0a0b0c 55%,#16191b);box-shadow:0 0 0 1px rgba(255,255,255,.14),inset 0 1px 0 rgba(255,255,255,.18),0 30px 60px rgba(0,0,0,.6);transform-origin:50% 50%`, parent);
    const screen = E.el('div', 'position:relative;width:100%;height:100%;border-radius:23px;overflow:hidden;background:#0c0e10', el);
    return { el, screen, halo, cx: x + w / 2, cy: y + h / 2, x, y, w, h };
  };
  // a chat header + skeleton bubbles in a phone screen; returns helpers to add real bubbles
  P.chat = function (screen, { name = 'Business', status = 'replies 24×7', avatar = '' } = {}) {
    const hd = E.el('div', 'position:absolute;left:0;right:0;top:0;height:46px;background:#14171a;border-bottom:1px solid rgba(255,255,255,.06)', screen);
    E.el('div', `position:absolute;left:12px;top:12px;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;color:#14200a;font:800 11px/1 Archivo,sans-serif;background:linear-gradient(135deg,${P.accent},#7dffb0)`, hd, avatar || name[0]);
    E.el('div', 'position:absolute;left:44px;top:13px;color:#f2f4f2;font:700 10.5px/1 Archivo,sans-serif', hd, name);
    E.el('div', `position:absolute;left:44px;top:28px;color:${P.accent};font:500 8px/1 ${MONO};letter-spacing:.06em`, hd, status);
    E.el('div', 'position:absolute;left:10px;top:60px;width:96px;height:22px;border-radius:11px;background:#1c2024', screen);
    E.el('div', 'position:absolute;right:10px;top:90px;width:78px;height:22px;border-radius:11px;background:#1c2024', screen);
    // bubble(text, {side, top, at, width}) pops on a spring at `at`
    return {
      bubble(html, { side = 'left', top = 126, at = 3, width = 128 } = {}) {
        const me = side === 'right';
        const b = E.el('div', `position:absolute;${me ? 'right' : 'left'}:10px;top:${top}px;width:${width}px;box-sizing:border-box;padding:8px 10px;border-radius:${me ? '14px 14px 4px 14px' : '14px 14px 14px 4px'};background:${me ? P.accent : '#eef1ee'};color:${me ? '#11180a' : '#101214'};font:${me ? 700 : 600} 11px/1.3 Archivo,sans-serif;transform-origin:${me ? '100%' : '0'} 100%`, screen, html);
        P.on((t) => { const k = ease.spring(clamp((t - at) / .45)); css(b, { opacity: clamp((t - at) / .12).toFixed(3), transform: `translateY(${((1 - k) * 14).toFixed(1)}px) scale(${lerp(.6, 1, k).toFixed(3)})` }); });
        return b;
      },
      typing({ side = 'right', top = 212, from = 3.5, to = 4.2 } = {}) {
        const ty = E.el('div', `position:absolute;${side}:10px;top:${top}px;width:44px;height:22px;border-radius:11px;background:#1c2024;display:flex;align-items:center;justify-content:center;gap:4px`, screen);
        const dots = [0, 1, 2].map(() => E.el('i', 'width:5px;height:5px;border-radius:50%;background:#9aa19c', ty));
        P.on((t, tf) => { ty.style.opacity = t >= from && t < to ? '1' : '0'; dots.forEach((d, i) => { d.style.transform = `translateY(${(-2.5 * Math.max(0, Math.sin(tf * 9 - i * .9))).toFixed(1)}px)`; }); });
      },
    };
  };

  // ---- scan bar: reveals `layer` (inside the phone screen) top-down between t0 and t0+dur ----
  P.scan = function (phone, layer, t0, dur = .6) {
    P.use('transition', 'scan');
    const bar = E.el('div', `position:absolute;left:${phone.x - 17}px;width:${phone.w + 34}px;top:0;height:2px;border-radius:2px;background:#fff;box-shadow:0 0 10px 3px rgba(255,255,255,.75),0 0 30px 10px ${hexA(P.accent, .45)};opacity:0`, phone.el.parentNode);
    const wash = E.el('div', `position:absolute;left:0;right:0;height:40px;background:linear-gradient(180deg,${hexA(P.accent, 0)},${hexA(P.accent, .28)});pointer-events:none`, phone.screen);
    const H = phone.h - 14;
    P.on((t) => {
      const u = ease.io3(clamp((t - t0) / dur));
      layer.style.clipPath = t < t0 ? 'inset(0 0 100% 0)' : `inset(0 0 ${((1 - u) * 100).toFixed(2)}% 0)`;
      css(bar, { opacity: (t >= t0 - .05 && t < t0 + dur + .15 ? clamp((t - t0 + .05) / .08) * (1 - clamp((t - t0 - dur) / .15)) : 0).toFixed(3), transform: `translateY(${(phone.y + 7 + u * H).toFixed(1)}px)` });
      css(wash, { top: `${(u * H - 40).toFixed(1)}px`, opacity: (t >= t0 && t < t0 + dur + .1 ? 1 - clamp((t - t0 - dur + .05) / .15) : 0).toFixed(3) });
    });
    return bar;
  };

  // ---- hub: from (x,y) a line draws into a hub with rings, then lines branch to nodes that pop on their beats; dots carry data along the lines ----
  P.hub = function (parent, { cx = 201, cy = 290, from = null, label = '', nodes = [], at = 6.0, out = 8.4 }) {
    P.use('mechanism', 'hub');
    const A = P.accent, svgNS = 'http://www.w3.org/2000/svg';
    const box = E.el('div', 'position:absolute;inset:0', parent);
    const svg = document.createElementNS(svgNS, 'svg'); svg.setAttribute('viewBox', '0 0 402 715'); svg.setAttribute('width', '402'); svg.setAttribute('height', '715');
    svg.style.cssText = `position:absolute;inset:0;overflow:visible;filter:drop-shadow(0 0 4px ${hexA(A, .55)})`; box.appendChild(svg);
    const mk = (d) => { const p = document.createElementNS(svgNS, 'path'); p.setAttribute('d', d); p.setAttribute('pathLength', '1'); p.setAttribute('fill', 'none'); css(p, { stroke: hexA(A, .75), strokeWidth: '1.4', strokeDasharray: '1', strokeDashoffset: '1' }); svg.appendChild(p); const c = document.createElementNS(svgNS, 'circle'); c.setAttribute('r', '2.6'); c.setAttribute('fill', '#fff'); svg.appendChild(c); return { p, c }; };
    const lines = [];
    if (from) lines.push({ ...mk(`M${from.x} ${from.y} L${cx} ${cy - 46}`), t0: at - .3, t1: at });
    nodes.forEach((n) => { const sx = cx + Math.sign(n.x - cx) * 13, sy = cy + 44; lines.push({ ...mk(`M${sx} ${sy} C${sx + (n.x - cx) * .2} ${sy + 28} ${n.x} ${n.y - 50} ${n.x} ${n.y - 26}`), t0: n.at - .3, t1: n.at }); });
    const hub = E.el('div', `position:absolute;left:${cx - 48}px;top:${cy - 48}px;width:96px;height:96px`, box,
      `<svg viewBox="0 0 96 96" width="96" height="96" fill="none" aria-hidden="true"><circle class="r1" cx="48" cy="48" r="45" stroke="rgba(255,255,255,.22)" stroke-width="1.2" stroke-dasharray="70 30 40 143" style="transform-origin:48px 48px"/><circle class="r2" cx="48" cy="48" r="37" stroke="${A}" stroke-opacity=".7" stroke-width="1.6" stroke-dasharray="44 20 90 78" style="transform-origin:48px 48px"/></svg>`);
    const r1 = hub.querySelector('.r1'), r2 = hub.querySelector('.r2');
    E.el('div', `position:absolute;left:22px;top:22px;width:52px;height:52px;border-radius:50%;${P.MAT}`, hub);
    const core = E.el('div', `position:absolute;left:34px;top:34px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle,#fff 0 28%,${A} 46%,${hexA(A, 0)} 72%);box-shadow:0 0 22px 6px ${hexA(A, .45)}`, hub);
    const lab = label ? E.el('div', `position:absolute;left:${cx + 57}px;width:80px;top:${cy - 10}px;font:500 9px/1.5 ${MONO};letter-spacing:.14em;color:rgba(255,255,255,.55)`, box, label) : null;
    const nodeEls = nodes.map((n) => {
      const el = P.card(box, `left:${n.x - 26}px;top:${n.y - 26}px;width:52px;height:52px;border-radius:15px;display:grid;place-items:center`, P.icon(n.icon || 'check'));
      el.lab = E.el('div', `position:absolute;left:${n.x - 50}px;width:100px;top:${n.y + 34}px;text-align:center;font:500 9.5px/1 ${MONO};letter-spacing:.06em;color:rgba(255,255,255,.75)`, box, n.label || '');
      return el;
    });
    P.on((t, tf) => {
      const o = sm(at - .4, at, t) * (1 - sm(out, out + .4, t));
      lines.forEach((l) => { l.p.style.strokeDashoffset = (1 - sm(l.t0, l.t1, t)).toFixed(4); l.p.style.opacity = o.toFixed(3);
        if (t < l.t1 || o < .02) { l.c.setAttribute('opacity', '0'); return; }
        const u = ((t - l.t1) / .8) % 1, pt = l.p.getPointAtLength(l.p.getTotalLength() * u); l.c.setAttribute('cx', pt.x.toFixed(1)); l.c.setAttribute('cy', pt.y.toFixed(1)); l.c.setAttribute('opacity', (o * Math.sin(Math.PI * u)).toFixed(3)); });
      const hk = ease.spring(clamp((t - at) / .55));
      css(hub, { opacity: (o * clamp((t - at + .05) / .1)).toFixed(3), transform: `scale(${lerp(.5, 1, hk).toFixed(3)})` });
      r1.style.transform = `rotate(${(t * 40).toFixed(1)}deg)`; r2.style.transform = `rotate(${(-t * 65).toFixed(1)}deg)`;
      core.style.transform = `scale(${(1 + .12 * Math.sin(tf * 4)).toFixed(3)})`;
      if (lab) lab.style.opacity = (o * clamp((t - at - .2) / .2)).toFixed(3);
      nodes.forEach((n, i) => { const el = nodeEls[i], k = ease.spring(clamp((t - n.at) / .5)), no = o * clamp((t - n.at) / .1);
        css(el, { opacity: no.toFixed(3), transform: `translateY(${((1 - k) * 16).toFixed(1)}px) scale(${lerp(.7, 1, k).toFixed(3)})` }); el.setActive(t >= n.at); el.lab.style.opacity = (no * clamp((t - n.at - .1) / .2)).toFixed(3); });
    });
    return { box, hub, nodes: nodeEls };
  };

  // ---- payoff: the warm flood that only arrives at the peak (+ the impact punch and the breath before it) ----
  P.payoff = function ({ at = 12.6, out = 17.6, breath = [12.0, 12.45], colors = ['rgba(255,206,130,1)', 'rgba(255,140,112,.78)', 'rgba(160,70,150,.42)'] } = {}) {
    P.use('payoff', 'flood');
    const flood = E.el('div', `position:absolute;left:-40%;right:-40%;top:0;height:100%;opacity:0;background:radial-gradient(60% 62% at 50% 86%,${colors[0]},${colors[1]} 34%,${colors[2]} 60%,rgba(40,20,60,.2) 78%,rgba(0,0,0,0) 92%)`, P.back);
    const rays = E.el('div', 'position:absolute;inset:-30%;opacity:0;mix-blend-mode:screen;background:repeating-conic-gradient(from 0deg at 50% 80%,rgba(255,214,150,.2) 0deg 3deg,rgba(255,214,150,0) 3deg 10deg);-webkit-mask-image:radial-gradient(65% 60% at 50% 80%,#000,transparent 75%);mask-image:radial-gradient(65% 60% at 50% 80%,#000,transparent 75%)', P.back);
    P.punchAt = at; P.breath = breath;
    const amt = (t) => sm(at - .1, at + .8, t) * (1 - sm(out - 1, out, t));
    P.warmBokeh = amt;
    P.on((t) => { const s = amt(t); css(flood, { opacity: s.toFixed(3), transform: `translateY(${((1 - sm(at - .1, at + 1, t)) * 260).toFixed(1)}px)` }); css(rays, { opacity: (s * .9).toFixed(3), transform: `rotate(${(t * 1.5).toFixed(2)}deg)` }); });
    P.warmth = amt;                      // stories can use it to turn accent elements gold at the peak
    return { flood, rays, amount: amt };
  };

  // ---- HUD clock (time-lapse) ----
  P.clock = function (keys, { from = 2.4, to = 17.4, hide = [] } = {}) {
    P.use('hud', 'clock');
    const hud = E.el('div', `position:absolute;left:30px;top:104px;display:flex;align-items:center;gap:7px;font:500 11px/1 ${MONO};letter-spacing:.14em;color:rgba(255,255,255,.8)`, P.front, `<i style="width:6px;height:6px;border-radius:50%;background:${P.accent};box-shadow:0 0 8px ${P.accent}"></i><span></span>`);
    const sp = hud.querySelector('span'), dot = hud.querySelector('i');
    const at = (t) => { let i = 0; while (i < keys.length - 2 && t >= keys[i + 1][0]) i++; const [t0, m0] = keys[i], [t1, m1] = keys[i + 1]; const m = Math.floor(lerp(m0, m1, clamp((t - t0) / (t1 - t0)))) % 1440; const h = Math.floor(m / 60); return `${((h + 11) % 12) + 1}:${String(m % 60).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`; };
    P.on((t, tf) => { sp.textContent = at(t); let o = sm(from, from + .3, t) * (1 - sm(to, to + .3, t)); hide.forEach(([a, b]) => { o *= 1 - sm(a, a + .2, t) * (1 - sm(b, b + .2, t)); }); hud.style.opacity = o.toFixed(3); dot.style.opacity = (.55 + .45 * Math.sin(tf * 4)).toFixed(3); });
    return { hud, text: sp, at };
  };

  // ---- captions: the spine. [in, out, text, size, {wordIndex: colour}] ----
  P.captions = function (list, { y = 492, maxW = 280, style = 'pill' } = {}) {
    P.use('captions', style);
    const wrap = E.el('div', `position:absolute;left:0;right:0;top:${y}px;height:0`, P.front);
    const caps = list.map(([a, b, text, size = 28, acc = {}]) => {
      const look = {
        pill: `padding:6px 13px 8px;border-radius:12px;background:${P.light ? 'rgba(255,255,255,.9)' : 'rgba(10,12,14,.82)'};box-shadow:0 0 0 1px ${P.light ? 'rgba(0,0,0,.08)' : 'rgba(255,255,255,.07)'},0 8px 24px rgba(0,0,0,.2);color:${P.fg};font:800 ${size}px/1.05 Archivo,sans-serif;font-variation-settings:"wdth" 92;letter-spacing:-.012em;word-spacing:.08em`,
        bare: `padding:0 4px;color:${P.fg};font:900 ${size * 1.25}px/1 Archivo,sans-serif;font-variation-settings:"wdth" 72;letter-spacing:-.02em;text-transform:uppercase;text-shadow:0 2px 18px ${P.light ? 'rgba(255,255,255,.9)' : 'rgba(0,0,0,.85)'}`,
        underline: `padding:2px 2px 10px;color:${P.fg};font:700 ${size}px/1.05 Archivo,sans-serif;letter-spacing:-.02em;background:linear-gradient(${P.accent},${P.accent}) 0 100%/100% 4px no-repeat`,
        blur: `padding:7px 14px 9px;border-radius:14px;background:${P.light ? '#0b2a3a' : 'rgba(255,255,255,.94)'};box-shadow:0 10px 26px rgba(0,0,0,.22);color:${P.light ? '#ffffff' : '#0b0d0f'};font:800 ${size}px/1.05 Archivo,sans-serif;font-variation-settings:"wdth" 94;letter-spacing:-.012em;word-spacing:.08em`,
        mono: `padding:7px 12px;border-radius:4px;border:1px solid ${hexA(P.accent, .7)};background:${P.light ? 'rgba(255,255,255,.85)' : 'rgba(0,0,0,.7)'};color:${P.fg};font:600 ${size * .62}px/1.1 ${MONO};letter-spacing:.06em;text-transform:uppercase`,
      }[style] || '';
      const card = E.el('div', `position:absolute;left:201px;top:0;transform:translate(-50%,-50%);white-space:nowrap;${look}`, wrap);
      const words = text.split(' ').map((w, i) => { const m = E.el('span', 'display:inline-block;overflow:hidden;vertical-align:bottom;padding:0 .02em .1em;margin:0 0 -.1em', card); const inner = E.el('span', `display:inline-block;${acc[i] ? `color:${acc[i]}` : ''}`, m, w); if (i) card.insertBefore(document.createTextNode(' '), m); return inner; });
      if (card.offsetWidth > maxW) card.style.fontSize = (size * maxW / card.offsetWidth).toFixed(1) + 'px';
      return { a, b, card, words };
    });
    P.on((t) => caps.forEach(({ a, b, card, words }) => {
      if (t < a - .05 || t > b + .02) { card.style.opacity = '0'; return; }
      const out = P.tween(t, b - .2, .2, 'snap');                          // departure: snap, 35% faster than the ~0.4 s word spring
      card.style.opacity = ((a < 0 ? 1 : P.springAt(t, a, 'fade')) * (1 - out)).toFixed(3);
      card.style.transform = `translate(-50%,calc(-50% - ${(out * 6).toFixed(1)}px))`;
      words.forEach((w, i) => { const k = a < 0 ? 1 : P.springAt(t, a + i * .07, 'bold');
        if (style === 'blur') { const u = P.springAt(t, a + i * .07, 'default'); css(w, { opacity: clamp(u * 1.6).toFixed(3), filter: u < .98 ? `blur(${((1 - u) * 9).toFixed(2)}px)` : 'none', transform: `translateY(${((1 - k) * 34).toFixed(1)}%) scale(${lerp(1.18, 1, u).toFixed(3)})` }); return; }   // blur reveal: words sharpen out of a blur (new 14 Oct 2026)
        w.style.transform = `translateY(${((1 - k) * 105).toFixed(1)}%)`; });
    }));
    return { wrap, caps, hideAll: () => caps.forEach(({ card }) => { card.style.opacity = '0'; }) };
  };

  // ---- sentence that builds (reference study 2): small light type, one line, word by word; accents coloured; clears at `out` ----
  P.sentence = function (parent, words, { at = 1, per = .55, out = null, y = 300, size = 22, weight = 500, accents = {}, colour = '#f2f4f2', highlight = false } = {}) {
    P.use('type', 'sentence');
    const line = E.el('div', `position:absolute;left:30px;right:30px;top:${y}px;text-align:center;color:${colour};font:${weight} ${size}px/1.25 Archivo,sans-serif;letter-spacing:-.01em`, parent);
    const els = words.map((w, i) => {
      const s = E.el('span', `display:inline-block;margin:0 .14em;position:relative;${accents[i] ? `color:${accents[i]}` : ''}`, line, w);
      if (highlight && accents[i]) s.hl = E.el('i', `position:absolute;left:-.1em;right:-.1em;bottom:.08em;height:.38em;z-index:-1;border-radius:3px;background:${hexA(accents[i].startsWith('#') ? accents[i] : P.accent, .28)};transform-origin:0 50%`, s);
      return s;
    });
    P.on((t) => els.forEach((s, i) => {
      const t0 = at + i * per, k = ease.out3(clamp((t - t0) / .35)), o = clamp((t - t0) / .25) * (out == null ? 1 : 1 - sm(out, out + .25, t));
      css(s, { opacity: o.toFixed(3), filter: k < .98 ? `blur(${((1 - k) * 6).toFixed(2)}px)` : 'none', transform: `translateY(${((1 - k) * 8).toFixed(1)}px)` });
      if (s.hl) s.hl.style.transform = `scaleX(${ease.out3(clamp((t - t0 - .15) / .3)).toFixed(3)})`;
    }));
    return line;
  };

  // ---- a brand shape as a recurring character: s.key([[t, {x, y, rot, scale, o}], ...]) animates between keys ----
  P.shape = function (parent, { path = P.icons.spark, size = 90, colour = P.accent, stroke = 0 } = {}) {
    P.use('character', 'shape');
    const el = E.el('div', `position:absolute;left:0;top:0;width:${size}px;height:${size}px;margin:${-size / 2}px 0 0 ${-size / 2}px;color:${colour};opacity:0;filter:drop-shadow(0 0 12px ${hexA(colour.startsWith('#') ? colour : P.accent, .5)})`, parent,
      `<svg viewBox="0 0 24 24" width="${size}" height="${size}" ${stroke ? `fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round"` : 'fill="currentColor"'} aria-hidden="true">${path}</svg>`);
    const s = { el };
    s.key = (keys) => P.on((t) => {
      let i = 0; while (i < keys.length - 1 && t >= keys[i + 1][0]) i++;
      const [t0, a] = keys[i], [t1, b] = keys[Math.min(i + 1, keys.length - 1)], k = t1 > t0 ? ease.io3(clamp((t - t0) / (t1 - t0))) : 1;
      const v = (n, d) => lerp(a[n] ?? d, b[n] ?? a[n] ?? d, k);
      css(el, { opacity: v('o', 1).toFixed(3), transform: `translate(${v('x', 201).toFixed(1)}px,${v('y', 300).toFixed(1)}px) rotate(${v('rot', 0).toFixed(1)}deg) scale(${v('scale', 1).toFixed(3)})` });
    });
    return s;
  };

  // ---- organic liquid wipe ----
  P.wave = function (parent, { at = 9, dur = .8, colour = P.accent, hold = .4 } = {}) {
    P.use('transition', 'wave');
    const svgNS = 'http://www.w3.org/2000/svg', box = E.el('div', 'position:absolute;inset:0;pointer-events:none', parent);
    const svg = document.createElementNS(svgNS, 'svg'); svg.setAttribute('viewBox', '0 0 402 715'); svg.setAttribute('width', '402'); svg.setAttribute('height', '715'); svg.setAttribute('preserveAspectRatio', 'none'); box.appendChild(svg);
    const p = document.createElementNS(svgNS, 'path'); p.setAttribute('fill', colour); svg.appendChild(p);
    P.on((t) => {
      const u = ease.io3(clamp((t - at) / dur)), v = ease.io3(clamp((t - at - dur - hold) / dur)), top = lerp(760, -60, u), bot = lerp(760, -60, v), ph = t * 5;
      if (u <= 0 || v >= 1) { p.setAttribute('d', ''); return; }
      const wv = (y, s) => `C100 ${(y - 30 * Math.sin(ph + s)).toFixed(1)} 300 ${(y + 30 * Math.sin(ph + s + 1)).toFixed(1)} 402 ${y.toFixed(1)}`;
      p.setAttribute('d', `M0 ${top.toFixed(1)} ${wv(top, 0)} L402 ${bot.toFixed(1)} C300 ${(bot + 24 * Math.sin(ph + 2)).toFixed(1)} 100 ${(bot - 24 * Math.sin(ph + 3)).toFixed(1)} 0 ${bot.toFixed(1)} Z`);
    });
    return box;
  };

  // ---- small helpers stories use a lot ----
  P.fade = (el, a, b, { fi = .3, dy = 0 } = {}) => P.on((t) => {   // arrival: glide (opacity) + default spring (position); departure 35% faster, snap
    const fo = fi * .65, o = P.springAt(t, a, 'fade') * (1 - P.tween(t, b, fo, 'snap')); css(el, { opacity: o.toFixed(3), transform: dy ? `translateY(${((1 - P.springAt(t, a, 'default')) * dy).toFixed(1)}px)` : el.style.transform }); });
  P.pop = (el, at, { from = .7, dy = 16, out = null } = {}) => P.on((t) => { const k = P.springAt(t, at, 'bold'), o = P.springAt(t, at, 'fade') * (out == null ? 1 : 1 - P.tween(t, out, .26, 'snap')); css(el, { opacity: o.toFixed(3), transform: `translateY(${((1 - k) * dy).toFixed(1)}px) scale(${lerp(from, 1, k).toFixed(3)})` }); });

  // =====================================================================================================================================
  // MORE OPTIONS PER JOB (13 Oct 2026, owner: "the animation combination should vary across reels"). Every reel picks per slot; the manifest records it.
  // =====================================================================================================================================
  const svgEl = (parent, inner, css2 = '') => { const d = E.el('div', `position:absolute;inset:0;pointer-events:none;${css2}`, parent); d.innerHTML = `<svg viewBox="0 0 402 715" width="402" height="715" fill="none" style="position:absolute;inset:0;overflow:visible" aria-hidden="true">${inner}</svg>`; return d; };

  // ---- OPENERS ----
  // rack focus: a huge blurred word fills the frame and pulls back sharp into a line (reference study 2)
  P.rackWord = function (parent, word, { at = 0, dur = 1.1, y = 300, size = 40, out = 2.3, colour } = {}) {
    P.use('opener', 'rack-focus');
    const el = E.el('div', `position:absolute;left:0;right:0;top:${y}px;text-align:center;white-space:nowrap;color:${colour || P.fg};font:800 ${size}px/1 Archivo,sans-serif;letter-spacing:-.02em;transform-origin:50% 50%`, parent, word);
    P.on((t) => { const k = ease.outX(clamp((t - at) / dur)), o = clamp((t - at + .1) / .2) * (1 - sm(out, out + .25, t)); css(el, { opacity: o.toFixed(3), transform: `translateY(-50%) scale(${lerp(4.2, 1, k).toFixed(3)})`, filter: k < .99 ? `blur(${((1 - k) * 14).toFixed(2)}px)` : 'none' }); });
    return el;
  };
  // draw-on: any SVG line drawing (paths with pathLength) draws itself between at and at+dur; returns the box
  P.drawOn = function (parent, svgInner, { x = 0, y = 0, w = 402, h = 715, at = 0, dur = 1.2, stagger = .08, out = null, stroke = null, width = 1.6 } = {}) {
    P.use('opener', 'draw-on');
    const box = E.el('div', `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px`, parent);
    box.innerHTML = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" fill="none" stroke="${stroke || hexA(P.fg.startsWith('#') ? P.fg : '#ffffff', .8)}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${svgInner}</svg>`;
    const ps = [...box.querySelectorAll('path,rect,circle,ellipse,line,polyline')]; ps.forEach((p) => { p.setAttribute('pathLength', '1'); p.style.strokeDasharray = '1'; });
    P.on((t) => { ps.forEach((p, i) => { p.style.strokeDashoffset = (1 - ease.io3(clamp((t - at - i * stagger) / dur))).toFixed(4); }); if (out != null) box.style.opacity = (1 - sm(out, out + .3, t)).toFixed(3); });
    return box;
  };
  // assemble: dots fly in from scattered positions and settle into a grid of points sampled from text (the brand word builds itself)
  P.assemble = function (parent, text, { at = 0, dur = 1.4, y = 300, size = 64, fill = 0, out = 2.3, colour, back = null, backDur = .8 } = {}) {   // back: the dots scatter out again (use it to loop)
    P.use('opener', 'assemble');
    if (fill) { const m = document.createElement('canvas').getContext('2d'); m.font = `900 100px Archivo, sans-serif`; size = Math.floor(100 * fill / m.measureText(text).width); }   // fill: width in px the word should span
    const c = document.createElement('canvas'), W2 = 402, H2 = Math.round(size * 1.4); c.width = W2; c.height = H2; const g = c.getContext('2d');
    g.fillStyle = '#000'; g.font = `900 ${size}px Archivo, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, W2 / 2, H2 / 2);
    const d = g.getImageData(0, 0, W2, H2).data, pts = []; for (let yy = 0; yy < H2; yy += 4) for (let xx = 0; xx < W2; xx += 4) if (d[(yy * W2 + xx) * 4 + 3] > 128) pts.push([xx, yy]);
    let s = 77; const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    const pick = pts.filter((_, i) => i % Math.max(1, Math.ceil(pts.length / 260)) === 0).map(([x, yy]) => ({ x, y: yy + y - H2 / 2, sx: rnd() * 402, sy: rnd() * 715, dl: rnd() * .35 }));
    const cv = E.el('canvas', 'position:absolute;inset:0;width:402px;height:715px', parent); cv.width = 804; cv.height = 1430; const cg = cv.getContext('2d'); cg.scale(2, 2);
    const word = E.el('div', `position:absolute;left:0;right:0;top:${y}px;transform:translateY(-50%);text-align:center;color:${colour || P.accent};font:900 ${size}px/1 Archivo,sans-serif;opacity:0`, parent, text);
    P.on((t) => {
      cg.clearRect(0, 0, 402, 715); const fo = out == null ? 1 : 1 - sm(out, out + .25, t), bk = back == null ? 0 : sm(back, back + backDur, t);
      const solid = sm(at + dur, at + dur + .3, t) * (back == null ? 1 : 1 - sm(back - .2, back, t));
      cg.fillStyle = colour || P.accent;
      if (solid < 1) for (const p of pick) { const kin = ease.io3(clamp((t - at - p.dl) / (dur - .35))), kout = back == null ? 0 : ease.io3(clamp((t - back - p.dl * .5) / (backDur - .2))), k = kin * (1 - kout); void bk; cg.globalAlpha = clamp((t - at) / .2) * fo * (1 - solid); cg.beginPath(); cg.arc(lerp(p.sx, p.x, k), lerp(p.sy, p.y, k), 1.6, 0, TAU); cg.fill(); }
      word.style.opacity = (solid * fo).toFixed(3);
    });
    return word;
  };

  // ---- TRANSITIONS (scene changes) ----
  // iris: the next layer opens as a circle from a point
  P.iris = function (layer, { at = 5, dur = .6, x = 201, y = 300, close = false } = {}) {
    P.use('transition', 'iris');
    P.on((t) => { const k = ease.io3(clamp((t - at) / dur)), r = (close ? 1 - k : k) * 900; layer.style.clipPath = t < at && !close ? 'circle(0px at 50% 50%)' : `circle(${r.toFixed(1)}px at ${x}px ${y}px)`; });
  };
  // blinds: the next layer slides in as N horizontal slats, staggered
  P.blinds = function (parent, layer, { at = 5, dur = .5, n = 7, colour = P.accent } = {}) {
    P.use('transition', 'blinds');
    const slats = Array.from({ length: n }, (_, i) => E.el('div', `position:absolute;left:0;right:0;top:${(i * 715 / n).toFixed(1)}px;height:${(715 / n + 1).toFixed(1)}px;background:${colour};transform-origin:0 50%;transform:scaleX(0)`, parent));
    P.on((t) => {
      slats.forEach((sl, i) => { const a = at + i * .04, k1 = ease.io3(clamp((t - a) / (dur / 2))), k2 = ease.io3(clamp((t - a - dur / 2) / (dur / 2))); sl.style.transformOrigin = t < a + dur / 2 ? '0 50%' : '100% 50%'; sl.style.transform = `scaleX(${(t < a + dur / 2 ? k1 : 1 - k2).toFixed(4)})`; });
      if (layer) layer.style.opacity = t >= at + dur / 2 ? '1' : '0';
    });
  };
  // zoom-through: the camera pushes INTO an element until it fills the frame, then the next layer is revealed from that element's colour
  P.zoomThrough = function (el, { at = 5, dur = .7, x = 201, y = 300, then = null } = {}) {
    P.use('transition', 'zoom-through');
    P.on((t) => { const k = ease.inX(clamp((t - at) / dur)); if (t < at - .01) return; css(el, { transformOrigin: `${x}px ${y}px`, transform: `scale(${lerp(1, 14, k).toFixed(3)})`, opacity: (1 - sm(at + dur * .85, at + dur, t)).toFixed(3) }); if (then) then.style.opacity = sm(at + dur * .7, at + dur, t).toFixed(3); });
  };
  // whip: the world slides out sideways with motion blur and the next layer slides in
  P.whip = function (outEl, inEl, { at = 5, dur = .35, dir = -1 } = {}) {
    P.use('transition', 'whip');
    P.on((t) => { const k = ease.io3(clamp((t - at) / dur)), v = Math.sin(Math.PI * k);
      if (t >= at - .01 && t <= at + dur + .02) { css(outEl, { transform: `translateX(${(dir * 420 * k).toFixed(1)}px)`, filter: v > .05 ? `blur(${(v * 10).toFixed(1)}px)` : 'none' }); }
      if (inEl) css(inEl, { opacity: t >= at ? '1' : '0', transform: `translateX(${(-dir * 420 * (1 - k)).toFixed(1)}px)`, filter: v > .05 ? `blur(${(v * 10).toFixed(1)}px)` : 'none' }); });
  };
  // shape wipe: the brand shape spins in and grows until it fills the frame (it becomes the next scene's ground)
  P.shapeWipe = function (parent, { at = 5, dur = .8, path = P.icons.spark, colour = P.accent, x = 201, y = 300, hold = .25 } = {}) {
    P.use('transition', 'shape-wipe');
    const el = E.el('div', `position:absolute;left:${x - 50}px;top:${y - 50}px;width:100px;height:100px;color:${colour};opacity:0`, parent, `<svg viewBox="0 0 24 24" width="100" height="100" fill="currentColor" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true">${path}</svg>`);
    P.on((t) => { const k = ease.inX(clamp((t - at) / dur)), o = clamp((t - at) / .1) * (1 - sm(at + dur + hold, at + dur + hold + .3, t)); css(el, { opacity: o.toFixed(3), transform: `rotate(${(k * 240).toFixed(1)}deg) scale(${lerp(.2, 22, k).toFixed(3)})` }); });
    return el;
  };

  // ---- MECHANISMS (how it works) ----
  // route: a line draws along a path while a traveller rides it; returns the path element
  P.route = function (parent, d, { at = 8.9, dur = 3, colour = P.accent, icon = 'pin', from = '', to = '' } = {}) {
    P.use('mechanism', 'route');
    const box = svgEl(parent, `<path class="rt" d="${d}" pathLength="1" stroke="${colour}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 0 6px ${hexA(colour, .8)});stroke-dasharray:1;stroke-dashoffset:1"/>`);
    const p = box.querySelector('.rt'), L = () => p.getTotalLength();
    const rider = E.el('div', `position:absolute;left:-14px;top:-14px;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:${colour};color:#fff;box-shadow:0 0 0 5px ${hexA(colour, .25)},0 0 22px ${hexA(colour, .9)}`, parent, P.icon(icon, 15));
    const lab = (txt, pt) => txt && E.el('div', `position:absolute;left:${pt.x - 60}px;width:120px;top:${pt.y + 14}px;text-align:center;font:500 8.5px/1 ${MONO};letter-spacing:.14em;color:${hexA(P.light ? '#000000' : '#ffffff', .7)}`, parent, txt);
    lab(from, p.getPointAtLength(0)); lab(to, p.getPointAtLength(L()));
    P.on((t) => { const k = ease.io3(clamp((t - at) / dur)); p.style.strokeDashoffset = (1 - k).toFixed(4); const pt = p.getPointAtLength(L() * k); rider.style.transform = `translate(${pt.x.toFixed(1)}px,${pt.y.toFixed(1)}px)`; });
    return { path: p, rider };
  };
  // grid fill: a grid of skeleton cells; listed cells light up on their beats (diary, seats, orders, stock)
  P.gridFill = function (parent, { x = 49, y = 170, cols = 5, rows = 4, w = 56, h = 38, gap = 6, fills = [], labels = {}, colour = P.accent } = {}) {
    P.use('mechanism', 'grid-fill');
    const cells = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const el = P.card(parent, `left:${x + c * (w + gap)}px;top:${y + r * (h + gap)}px;width:${w}px;height:${h}px;border-radius:9px;display:grid;place-items:center;font:700 9.5px/1.1 Archivo,sans-serif;text-align:center`, ''); cells.push(el); }
    fills.forEach(([i, at]) => { const el = cells[i]; el.innerHTML = labels[i] || ''; P.on((t) => { const on = sm(at, at + .12, t), k = ease.spring(clamp((t - at) / .4)); el.style.background = on > .02 ? colour : ''; el.style.color = on > .5 ? '#111' : 'transparent'; el.style.boxShadow = on > .02 ? `0 0 ${(20 * on).toFixed(1)}px ${hexA(colour, .5)}` : ''; el.style.transform = on > .02 ? `scale(${lerp(.8, 1, k).toFixed(3)})` : 'none'; }); });
    return cells;
  };
  // steps rail: a vertical rail with N steps; a light travels down and each step checks off on its beat
  P.steps = function (parent, items, { x = 50, y = 160, gap = 100, at = 6, per = .6, size = 30 } = {}) {
    P.use('mechanism', 'steps-rail');
    const rail = E.el('div', `position:absolute;left:${x + 6}px;top:${y + 20}px;width:2px;height:${gap * (items.length - 1)}px;background:${hexA(P.light ? '#000000' : '#ffffff', .12)}`, parent);
    const fill = E.el('div', `position:absolute;left:0;top:0;width:2px;height:100%;background:${P.accent};box-shadow:0 0 10px ${P.accent};transform-origin:0 0;transform:scaleY(0)`, rail);
    const rows = items.map((txt, i) => { const r = E.el('div', `position:absolute;left:${x - 13}px;top:${y + i * gap}px;display:flex;align-items:center;gap:16px;width:${380 - x}px;color:${P.fg};font:800 ${size}px/1.02 Archivo,sans-serif;font-variation-settings:"wdth" 80;letter-spacing:-.02em`, parent, `<span style="width:40px;height:40px;border-radius:50%;display:grid;place-items:center;flex:none;${P.MAT};font:700 14px/1 ${MONO}">${i + 1}</span><span>${txt}</span>`); r.dot = r.firstChild; return r; });
    P.on((t) => { fill.style.transform = `scaleY(${ease.io3(clamp((t - at) / (per * (items.length - 1)))).toFixed(4)})`; rows.forEach((r, i) => { const a = at + i * per, k = ease.spring(clamp((t - a + .2) / .45)), on = t >= a; css(r, { opacity: clamp((t - a + .2) / .15).toFixed(3), transform: `translateX(${((1 - k) * -18).toFixed(1)}px)` }); css(r.dot, { background: on ? P.accent : '', color: on ? '#111' : '', boxShadow: on ? `0 0 14px ${hexA(P.accent, .6)}` : '' }); r.dot.textContent = on ? '✓' : String(i + 1); }); });
    return rows;
  };
  // deck: a stack of cards; each beat the top card flies off and the next one rises (offers, dishes, testimonials-as-placeholders)
  P.deck = function (parent, htmls, { x = 61, y = 190, w = 280, h = 200, at = 6, per = .6 } = {}) {
    P.use('mechanism', 'deck');
    const cards = htmls.map((html, i) => P.card(parent, `left:${x}px;top:${y}px;width:${w}px;height:${h}px;padding:20px;border-radius:22px;z-index:${100 - i}`, html));
    P.on((t) => cards.forEach((c, i) => { const go = ease.inX(clamp((t - at - i * per) / .35)), pos = i - clamp((t - at) / per); const depth = Math.max(0, pos); css(c, { opacity: (clamp(1.6 - depth * .5) * (1 - go)).toFixed(3), transform: `translate(${(go * 420).toFixed(1)}px,${(depth * 14 - go * 40).toFixed(1)}px) rotate(${(go * 18 + depth * -2).toFixed(2)}deg) scale(${(1 - depth * .05).toFixed(3)})` }); }));
    return cards;
  };
  // meter: a half-dial gauge that sweeps to a value with a counting number (speed, minutes, savings shown as example)
  P.meter = function (parent, { cx = 201, cy = 360, r = 165, at = 6, dur = 1.8, from = 0, to = 24, unit = 'MIN', label = '' } = {}) {
    P.use('mechanism', 'meter');
    const box = svgEl(parent, `<path d="M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}" stroke="${hexA(P.light ? '#000000' : '#ffffff', .12)}" stroke-width="12" stroke-linecap="round"/><path class="arc" d="M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}" pathLength="1" stroke="${P.accent}" stroke-width="12" stroke-linecap="round" style="stroke-dasharray:1;stroke-dashoffset:1;filter:drop-shadow(0 0 8px ${hexA(P.accent, .7)})"/>`);
    const arc = box.querySelector('.arc');
    const num = E.el('div', `position:absolute;left:${cx - 120}px;width:240px;top:${cy - 64}px;text-align:center;color:${P.fg};font:900 64px/1 Archivo,sans-serif;font-variation-settings:"wdth" 80`, parent, '0');
    E.el('div', `position:absolute;left:${cx - 120}px;width:240px;top:${cy + 8}px;text-align:center;color:${hexA(P.light ? '#000000' : '#ffffff', .6)};font:500 10px/1 ${MONO};letter-spacing:.2em`, parent, `${unit}${label ? ' · ' + label : ''}`);
    P.on((t, tf) => { const k = ease.io3(clamp((t - at) / dur)); arc.style.strokeDashoffset = (1 - k).toFixed(4); num.textContent = String(Math.round(lerp(from, to, ease.io3(clamp((tf - at) / dur))))); });
    return { box, num };
  };
  // compare: a before/after split with a handle that slides across (old site vs new, phone-call vs booking)
  P.compare = function (parent, beforeHtml, afterHtml, { x = 41, y = 160, w = 320, h = 260, at = 6, dur = 1.6 } = {}) {
    P.use('mechanism', 'compare');
    const box = E.el('div', `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:20px;overflow:hidden;${P.MAT}`, parent);
    const b = E.el('div', 'position:absolute;inset:0;padding:18px', box, beforeHtml), a = E.el('div', `position:absolute;inset:0;padding:18px;background:${hexA(P.accent, .12)}`, box, afterHtml);
    const handle = E.el('div', `position:absolute;top:0;bottom:0;width:3px;margin-left:-1.5px;background:${P.accent};box-shadow:0 0 14px ${P.accent}`, box);
    E.el('div', `position:absolute;left:-13px;top:50%;width:28px;height:28px;margin-top:-14px;border-radius:50%;background:${P.accent};box-shadow:0 0 14px ${P.accent}`, handle);
    P.on((t) => { const k = ease.io3(clamp((t - at) / dur)), px = lerp(w - 8, 8, k); a.style.clipPath = `inset(0 0 0 ${px.toFixed(1)}px)`; handle.style.left = px.toFixed(1) + 'px'; b.style.opacity = (1 - .5 * k).toFixed(3); });
    return box;
  };

  // ---- FOCUS ----
  // spotlight: everything darkens except a soft circle that glides onto the target
  P.spotlight = function (parent, keys) {        // keys: [{ at, out, x, y, r }], one lit circle at a time
    P.use('focus', 'spotlight');
    const el = E.el('div', 'position:absolute;inset:0;pointer-events:none;opacity:0', parent);
    P.on((t) => { const cur = keys.find((q) => t >= q.at - .3 && t < q.out + .3); if (!cur) { el.style.opacity = '0'; return; }
      el.style.opacity = (sm(cur.at - .3, cur.at, t) * (1 - sm(cur.out, cur.out + .3, t)) * .75).toFixed(3);
      el.style.background = `radial-gradient(circle ${cur.r || 70}px at ${cur.x}px ${cur.y}px, rgba(0,0,0,0) 62%, rgba(0,0,0,.8) 100%)`; });
    return el;
  };
  // lens: a magnifier circle over the target shows it at 2x (pass a clone of the content to magnify)
  P.lens = function (parent, contentHtml, { x = 201, y = 300, r = 70, at = 9, out = 10.4, zoom = 2 } = {}) {
    P.use('focus', 'lens');
    const ring = E.el('div', `position:absolute;left:${x - r}px;top:${y - r}px;width:${r * 2}px;height:${r * 2}px;border-radius:50%;overflow:hidden;box-shadow:0 0 0 3px ${P.accent},0 0 30px ${hexA(P.accent, .5)},0 20px 40px rgba(0,0,0,.5);background:${P.light ? '#fff' : '#111'}`, parent);
    E.el('div', `position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(${zoom});white-space:nowrap`, ring, contentHtml);
    P.on((t) => { const k = ease.spring(clamp((t - at) / .5)); css(ring, { opacity: (clamp((t - at) / .1) * (1 - sm(out, out + .2, t))).toFixed(3), transform: `scale(${lerp(.3, 1, k).toFixed(3)})` }); });
    return ring;
  };

  // ---- PAYOFFS (the big moment) ----
  // stamp: a word slams down at an angle
  P.stamp = function (parent, html, { x = 201, y = 280, at = 12.6, colour = P.accent, rot = -7, size = 24 } = {}) {
    P.use('payoff', 'stamp');
    const el = E.el('div', `position:absolute;left:${x}px;top:${y}px;white-space:nowrap;text-align:center;padding:10px 16px;border:2.5px solid ${colour};border-radius:10px;color:${colour};font:900 ${size}px/1 Archivo,sans-serif;letter-spacing:.12em;text-transform:uppercase;background:${P.light ? 'rgba(255,255,255,.85)' : 'rgba(8,10,6,.72)'};text-shadow:0 0 14px ${hexA(colour, .6)};box-shadow:0 0 18px ${hexA(colour, .35)};opacity:0`, parent, html);
    P.punchAt = P.punchAt == null ? at : P.punchAt;
    P.on((t) => { const k = ease.spring(clamp((t - at) / .45)); css(el, { opacity: clamp((t - at) / .06).toFixed(3), transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${lerp(1.8, 1, k).toFixed(3)})` }); });
    return el;
  };
  // burst: particles explode from a point (confetti-like, in the accent + a second hue)
  P.burst = function (parent, { x = 201, y = 300, at = 12.6, n = 90, colours = null, spread = 260 } = {}) {
    P.use('payoff', 'burst');
    const cv = E.el('canvas', 'position:absolute;inset:0;width:402px;height:715px;pointer-events:none', parent); cv.width = 804; cv.height = 1430; const g = cv.getContext('2d'); g.scale(2, 2);
    let s = 911; const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    const cols = colours || [P.accent, '#ffffff', '#ffd36b'];
    const ps = Array.from({ length: n }, () => { const a = rnd() * TAU, v = .35 + rnd() * .65; return { vx: Math.cos(a) * v, vy: Math.sin(a) * v - .25, r: 1.5 + rnd() * 3, c: cols[Math.floor(rnd() * cols.length)], sq: rnd() > .5, rot: rnd() * TAU }; });
    P.punchAt = P.punchAt == null ? at : P.punchAt;
    P.on((t) => { g.clearRect(0, 0, 402, 715); const u = (t - at); if (u < 0 || u > 2.2) return; const k = 1 - Math.exp(-u * 3.2);
      for (const p of ps) { g.globalAlpha = clamp(1 - u / 2.2); g.fillStyle = p.c; const px = x + p.vx * spread * k, py = y + p.vy * spread * k + 120 * u * u; g.save(); g.translate(px, py); g.rotate(p.rot + u * 6); if (p.sq) g.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); else { g.beginPath(); g.arc(0, 0, p.r, 0, TAU); g.fill(); } g.restore(); } });
    return cv;
  };
  // sweep: a band of light sweeps across a target element (the "shine" on a finished thing)
  P.sweep = function (el, { at = 12.6, dur = .8 } = {}) {
    P.use('payoff', 'sweep');
    el.style.overflow = 'hidden'; if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    const band = E.el('div', 'position:absolute;top:-20%;bottom:-20%;width:45%;left:0;pointer-events:none;mix-blend-mode:screen;background:linear-gradient(100deg,rgba(255,255,255,0),rgba(255,255,255,.75),rgba(255,255,255,0))', el);
    P.on((t) => { const k = ease.io3(clamp((t - at) / dur)); band.style.transform = `translateX(${lerp(-120, 330, k).toFixed(1)}%) skewX(-12deg)`; band.style.opacity = t > at - .05 && t < at + dur + .05 ? '1' : '0'; });
    return band;
  };
  // bloom: the accent blooms from the centre as soft rings (a pulse of colour across the whole frame)
  P.bloom = function ({ at = 12.6, x = 201, y = 330, colour = P.accent, out = 15.5 } = {}) {
    P.use('payoff', 'bloom');
    const rings = [0, 1, 2].map((i) => E.el('div', `position:absolute;left:${x - 50}px;top:${y - 50}px;width:100px;height:100px;border-radius:50%;border:2px solid ${colour};box-shadow:0 0 30px ${hexA(colour, .6)},inset 0 0 30px ${hexA(colour, .4)};opacity:0`, P.back));
    const wash = E.el('div', `position:absolute;inset:0;opacity:0;background:radial-gradient(60% 45% at ${x}px ${y}px,${hexA(colour, .45)},rgba(0,0,0,0) 70%)`, P.back);
    P.punchAt = P.punchAt == null ? at : P.punchAt;
    P.on((t) => { rings.forEach((r, i) => { const u = clamp((t - at - i * .18) / 1.3); css(r, { opacity: (u > 0 ? (1 - u) * .9 : 0).toFixed(3), transform: `scale(${(1 + u * 7).toFixed(3)})` }); }); wash.style.opacity = (sm(at, at + .4, t) * (1 - sm(out - .6, out, t))).toFixed(3); });
  };

  // ---- TYPE (headline styles; captions stay the spine) ----
  // giant: one huge word fills the frame width and is masked in from below (a number, a verb)
  P.giant = function (parent, word, { at = 12.6, out = 15.4, y = 250, colour, maxW = 390 } = {}) {   // fills the width (may touch the edges: it is display type, not reading text)
    P.use('type', 'giant');
    const el = E.el('div', `position:absolute;left:0;right:0;top:${y}px;text-align:center;overflow:hidden;color:${colour || P.fg};font:900 200px/.85 Archivo,sans-serif;font-variation-settings:"wdth" 70;letter-spacing:-.04em;white-space:nowrap`, parent);
    const inner = E.el('span', 'display:inline-block', el, word);
    const fit = () => { const w = inner.offsetWidth; if (w > maxW) el.style.fontSize = (200 * maxW / w).toFixed(1) + 'px'; }; fit();
    P.on((t) => { const k = ease.spring(clamp((t - at) / .5)); inner.style.transform = `translateY(${((1 - k) * 100).toFixed(1)}%)`; el.style.opacity = (clamp((t - at) / .05) * (1 - sm(out, out + .25, t))).toFixed(3); });
    return el;
  };
  // typewriter: letters appear one by one with a blinking caret (mono, for a product/AI/dev feel)
  P.typewriter = function (parent, text, { at = 2.6, cps = 22, out = null, x = 30, y = 300, size = 20, w = 342 } = {}) {
    P.use('type', 'typewriter');
    const el = E.el('div', `position:absolute;left:${x}px;width:${w}px;top:${y}px;color:${P.fg};font:500 ${size}px/1.35 ${MONO};letter-spacing:-.01em;white-space:pre-wrap`, parent);
    P.on((t, tf) => { const n = Math.floor(clamp((tf - at) * cps, 0, text.length)); el.innerHTML = text.slice(0, n).replace(/</g, '&lt;') + `<span style="display:inline-block;width:.55em;height:1.05em;vertical-align:-.15em;background:${P.accent};opacity:${Math.floor(tf * 2.5) % 2 ? 0 : 1}"></span>`; el.style.opacity = (tf < at - .2 ? 0 : out == null ? 1 : 1 - sm(out, out + .25, t)).toFixed(3); });
    return el;
  };

  // ---- ENDINGS (CTA) ----
  // tap: a cursor glides onto a button and taps it (ripple), the button confirms
  P.tap = function (parent, label, { x = 201, y = 380, at = 16.0, done = '✓ Sent', w = 342 } = {}) {
    P.use('cta', 'tap');
    const btn = E.el('div', `position:absolute;left:${x - w / 2}px;top:${y - 36}px;width:${w}px;height:72px;border-radius:99px;display:grid;place-items:center;background:${P.accent};color:#111;font:800 20px/1 Archivo,sans-serif;letter-spacing:.04em;text-transform:uppercase;box-shadow:0 0 30px ${hexA(P.accent, .45)};overflow:hidden`, parent, label);
    const rip = E.el('div', `position:absolute;left:50%;top:50%;width:40px;height:40px;margin:-20px;border-radius:50%;background:rgba(255,255,255,.6);opacity:0`, btn);
    const cur = E.el('div', 'position:absolute;left:0;top:0;width:26px;height:30px;color:#fff;filter:drop-shadow(0 2px 6px rgba(0,0,0,.6))', parent, '<svg viewBox="0 0 24 28" width="26" height="30" aria-hidden="true"><path d="M4 2v20l5-5 3.5 8 3-1.3-3.5-7.7H19z" fill="currentColor" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>');
    P.on((t) => { const k = ease.io3(clamp((t - at + .9) / .8)), press = t >= at && t < at + .15; css(cur, { opacity: (clamp((t - at + 1) / .2) * (1 - sm(at + .8, at + 1, t))).toFixed(3), transform: `translate(${lerp(x + 120, x + 6, k).toFixed(1)}px,${lerp(y + 160, y + 2, k).toFixed(1)}px) scale(${press ? .85 : 1})` });
      btn.style.transform = press ? 'scale(.96)' : 'none'; const u = clamp((t - at) / .6); css(rip, { opacity: (u > 0 && u < 1 ? 1 - u : 0).toFixed(3), transform: `scale(${(1 + u * 8).toFixed(2)})` }); btn.firstChild.textContent = t >= at + .3 ? done : label; });
    return btn;
  };
  // ring: rotating text around a round button (badge feel)
  P.ring = function (parent, text, { x = 201, y = 330, r = 70, at = 15.8, label = '→' } = {}) {
    P.use('cta', 'ring');
    const box = E.el('div', `position:absolute;left:${x - r - 20}px;top:${y - r - 20}px;width:${(r + 20) * 2}px;height:${(r + 20) * 2}px`, parent);
    const id = 'rp' + Math.floor(at * 100);
    box.innerHTML = `<svg viewBox="0 0 ${(r + 20) * 2} ${(r + 20) * 2}" width="${(r + 20) * 2}" height="${(r + 20) * 2}" aria-hidden="true"><defs><path id="${id}" d="M${r + 20} ${r + 20} m-${r} 0 a${r} ${r} 0 1 1 ${r * 2} 0 a${r} ${r} 0 1 1 -${r * 2} 0"/></defs><text fill="${P.fg}" style="font:600 13px ${MONO};letter-spacing:4px;text-transform:uppercase"><textPath href="#${id}">${text}</textPath></text></svg>`;
    const core = E.el('div', `position:absolute;left:${r + 20 - 38}px;top:${r + 20 - 38}px;width:76px;height:76px;border-radius:50%;display:grid;place-items:center;background:${P.accent};color:#111;font:800 26px/1 Archivo,sans-serif;box-shadow:0 0 30px ${hexA(P.accent, .5)}`, box, label);
    const svg = box.querySelector('svg');
    P.on((t) => { const k = ease.spring(clamp((t - at) / .55)); css(box, { opacity: clamp((t - at) / .12).toFixed(3), transform: `scale(${lerp(.6, 1, k).toFixed(3)})` }); svg.style.transform = `rotate(${(t * 30).toFixed(1)}deg)`; core.style.transform = `scale(${(1 + .05 * Math.sin(t * 5)).toFixed(3)})`; });
    return box;
  };
  // the studio sign-off: the only constant across all reels. Owner, 14 Oct 2026: no watermark during the film; the name appears once, at the end, with the CTA.
  // It sits at y 540 (the old watermark band: under the captions, above Instagram's caption area), "DM us" in the film's accent colour.
  P.signoff = function ({ at = 15.4, out = 17.35, y = 540, text = 'Aquarii Tech Studio', cta = 'DM us' } = {}) {
    if (P.wmHide) P.wmHide.push([at, out + .25]);                         // an opted-in watermark steps aside while the sign-off says the same thing
    const el = E.el('div', `position:absolute;left:30px;right:30px;top:${y}px;text-align:center;font:700 12px/1 ${MONO};letter-spacing:.24em;color:${hexA(P.light ? '#000000' : '#ffffff', .8)};text-transform:uppercase;white-space:nowrap`, P.front,
      text + (cta ? ` <span style="opacity:.5">·</span> <span style="color:${P.accent}">${cta}</span>` : ''));
    P.on((t) => { const k = P.springAt(t, at, 'fade'); el.style.opacity = (k * (1 - P.tween(t, out, .19, 'snap'))).toFixed(3); el.style.transform = `translateY(${((1 - k) * 8).toFixed(1)}px)`; });
    return el;
  };

  // ---- brand kit v1 (owner, 15 Oct 2026: one recognisable Aquarii look on every reel; design/brand/kit.md) ----
  P.BRAND = { ink: '#0A0E17', paper: '#F3F5F8', blue: '#2F6BFF', lime: '#C6F432', coral: '#FF5A4F', slate: '#8A93A6' };
  P.LOGO = `<defs> <linearGradient id="aqL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8DB8FF"/><stop offset=".45" stop-color="#3F7BFF"/><stop offset="1" stop-color="#1B3FBF"/></linearGradient> <linearGradient id="aqR" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F2F7FF"/><stop offset=".3" stop-color="#9FC2FF"/><stop offset=".7" stop-color="#4F86FF"/><stop offset="1" stop-color="#2450D8"/></linearGradient> <linearGradient id="aqB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4D84FF"/><stop offset="1" stop-color="#1A3BAE"/></linearGradient> <linearGradient id="aqS" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1B3FBF"/><stop offset=".55" stop-color="#4F86FF"/><stop offset="1" stop-color="#A9CBFF"/></linearGradient> <linearGradient id="aqT" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3F7BFF"/><stop offset="1" stop-color="#7FB0FF"/></linearGradient> <radialGradient id="aqG" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#3F7BFF" stop-opacity=".5"/><stop offset=".6" stop-color="#3F7BFF" stop-opacity=".18"/><stop offset="1" stop-color="#3F7BFF" stop-opacity="0"/></radialGradient> <filter id="aqF" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter> </defs> <ellipse cx="270" cy="160" rx="250" ry="140" fill="url(#aqG)"/> <g filter="url(#aqF)"> <path d="M60 232 L165 92 L198 140 L150 232 Z" fill="url(#aqB)"/> <path d="M165 92 L130 160 L150 150 L176 112 Z" fill="#0A1A4A" opacity=".55"/> <path d="M120 232 L262 20 L300 76 L210 232 Z" fill="url(#aqL)"/> <path d="M262 20 L360 165 L300 210 L250 120 Z" fill="url(#aqR)"/> <path d="M262 20 L274 66 L250 120 L238 70 Z" fill="#FFFFFF"/> <path d="M262 20 L232 96 L250 86 L262 58 Z" fill="#0A1A4A" opacity=".45"/> <path d="M262 20 L300 76" stroke="#FFFFFF" stroke-width="3" opacity=".9"/> <path d="M250 232 L318 150 L372 232 Z" fill="url(#aqB)"/> <path d="M318 150 L334 172" stroke="#CFE0FF" stroke-width="3" opacity=".8"/> <path d="M318 150 L300 190 L322 174 Z" fill="#0A1A4A" opacity=".5"/> <g fill="none" stroke="url(#aqT)" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"> <path d="M318 200 L360 168 L408 126 L432 126"/><path d="M340 214 L392 172 L452 172"/><path d="M362 226 L410 212 L432 212"/> </g> <g fill="#071233" stroke="#7FB0FF" stroke-width="9"><circle cx="452" cy="126" r="16"/><circle cx="472" cy="172" r="16"/><circle cx="452" cy="212" r="16"/></g> <path d="M40 262 C150 222 330 214 470 236 C500 242 488 262 452 262 C470 256 474 248 450 245 C330 230 170 240 40 262 Z" fill="url(#aqS)"/> <path d="M110 247 C220 228 330 225 420 233" fill="none" stroke="#DCE9FF" stroke-width="2.5" opacity=".7"/> </g>`;   // design/brand/aquarii-logo.svg (owner, 15 Oct 2026: the peak emblem in the style of the owner's other brand)
  P.brandMark = (size = 64) => `<svg viewBox="0 0 520 300" width="${size * 1.73}" height="${size}" aria-hidden="true">${P.LOGO}</svg>`;
  // the brand ending: an Ink card with the mark, the studio name and "DM us “KEYWORD” · Follow for more" (keyword in Lime). Replaces P.signoff in new films.
  // P.siteScroll (theme D sitescroll, 16 Oct 2026; reference R3 in design/brand/references.md): one of our own templates scrolled at full frame, the way a
  // screen recording would show it, but deterministic. src = film/ID/assets/scroll.jpg (capture-site.mjs --tall). stops = [[t, pageY], ...] in page CSS px
  // (402-wide page); between stops the scroll eases (swing: zero speed at each stop, so every section is readable when it is paused on).
  // shrink = { at, dur, scale, y }: the full-bleed view pulls back into a phone (rounded corners, bezel, shadow) while it keeps scrolling: the big moment.
  P.siteScroll = async function (parent, { src, x = 0, y = 0, w = 402, h = 715, stops = [[0, 0]], shrink = null, radius = 44 } = {}) {
    P.use('mechanism', 'site-scroll');
    const box = E.el('div', `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;overflow:hidden;transform-origin:50% 0;background:#000`, parent);
    const img = E.el('img', `position:absolute;left:0;top:0;width:${w}px;display:block`, box); img.alt = ''; img.src = src;
    try { await img.decode(); } catch (e) { /* the still shows a blank box; the storyboard review catches it */ }
    const k = (img.naturalHeight / img.naturalWidth) || 1, pageH = w * k, maxY = Math.max(0, pageH - h);
    const S2 = stops.slice().sort((a, b) => a[0] - b[0]);
    const at = (t) => { if (t <= S2[0][0]) return S2[0][1]; for (let i = 0; i < S2.length - 1; i++) { const [t0, y0] = S2[i], [t1, y1] = S2[i + 1]; if (t <= t1) return y0 + (y1 - y0) * P.EASE.swing((t - t0) / Math.max(.01, t1 - t0)); } return S2[S2.length - 1][1]; };
    const SH = '0 0 0 9px #0b0c10,0 0 0 10px rgba(255,255,255,.14),0 40px 80px -20px rgba(0,0,0,.9)';   // the bezel appears with the pull-back
    P.on((t) => {
      img.style.transform = `translateY(${(-Math.min(maxY, Math.max(0, at(t)))).toFixed(1)}px)`;
      if (shrink) { const q = P.EASE.glide(Math.min(1, Math.max(0, (t - shrink.at) / (shrink.dur || 1.2)))), sc = 1 + ((shrink.scale || .66) - 1) * q;
        box.style.transform = `translateY(${(((shrink.y || 0) - y) * q).toFixed(1)}px) scale(${sc.toFixed(4)})`; box.style.borderRadius = `${(radius * q / sc).toFixed(1)}px`;
        box.style.boxShadow = q > 0 ? SH : 'none'; }
    });
    return { box, img, pageH };
  };
  // grade (owner, 17 Oct 2026: "colour grade our logo to the video's theme"): the end card can wear the film's palette. Default 'blue' = the brand kit as before.
  P.GRADES = {
    blue: { mark: '', word: 'linear-gradient(180deg,#B5D0FF 0%,#5C8FFF 45%,#2450D8 100%)', wglow: 'rgba(79,134,255,.55)', btn: null, bglow: 'rgba(47,107,255,.45)', halo: '47,107,255' },
    clay: { mark: 'grayscale(1) sepia(1) saturate(4) hue-rotate(-28deg) brightness(1.12)', word: 'linear-gradient(180deg,#FFE2D2 0%,#FF9466 50%,#E0603D 100%)', wglow: 'rgba(255,148,102,.6)', btn: 'linear-gradient(135deg,#7DF5CB,#3FD9A3)', bglow: 'rgba(77,240,184,.5)', halo: '255,148,102', ink: '#06281d' },
    amber: { mark: 'grayscale(1) sepia(1) saturate(5) hue-rotate(-14deg) brightness(1.08)', word: 'linear-gradient(180deg,#FFE7C2 0%,#FFB35C 45%,#FF6A2C 100%)', wglow: 'rgba(255,150,70,.6)', btn: 'linear-gradient(135deg,#FFB35C,#FF6A2C)', bglow: 'rgba(255,120,50,.55)', halo: '255,140,60', ink: '#1a0900' },
  };
  P.brandEnd = function ({ at = 16.1, keyword = 'SITE', why = 'What’s holding your site back?', fit = null, line = 'Follow for more', out = null, breathe = true, grade = 'blue' } = {}) {
    const G = P.GRADES[grade] || P.GRADES.blue; if (grade !== 'blue') P.use('cta', 'brand-end-' + grade);
    if (fit == null) fit = `Send “${keyword}”. We’ll find the package that fits you.`;   // owner, 15 Oct 2026: end on "DM us to know more"; the keyword tells us which reel brought the DM
    P.use('cta', 'brand-end');
    const B = P.BRAND, end = out == null ? P.len - .2 : out;
    const card = E.el('div', `position:absolute;inset:0;background:${B.ink};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;opacity:0`, P.front);
    const mark = E.el('div', 'transform:scale(.6);display:flex;flex-direction:column;align-items:center', card, `<div style="filter:${G.mark || 'none'}">${P.brandMark(120)}</div>` +
      `<div style="margin-top:2px;font:800 54px/1 Montserrat,Archivo,sans-serif;letter-spacing:-.01em;background:${G.word};-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 10px ${G.wglow})">Aquarii</div>` +
      `<div style="margin-top:8px;font:500 12px/1 Montserrat,sans-serif;letter-spacing:.42em;color:${B.slate}">TECH STUDIO</div>`);
    // the why (owner, 15 Oct 2026: "DM us FAST" alone felt abrupt): what to DM about, the keyword, and what happens next. Never a price, never a free promise.
    const w1 = E.el('div', `margin-top:6px;max-width:330px;text-align:center;font:800 21px/1.15 Archivo,sans-serif;color:${B.paper}`, card, why);
    const cta = E.el('div', `padding:12px 22px;border-radius:99px;background:${G.btn || B.blue};color:${G.ink || '#fff'};font:900 24px/1 Archivo,sans-serif;font-variation-settings:"wdth" 92;box-shadow:0 0 24px ${G.bglow}`, card, 'DM us to know more');
    const w2 = E.el('div', `max-width:350px;text-align:center;font:600 14.5px/1.25 Archivo,sans-serif;color:${B.slate}`, card, fit);
    E.el('div', `margin-top:4px;font:600 12px/1 ${MONO};letter-spacing:.12em;color:${B.slate};opacity:.7`, card, line);
    P.on((t) => { const k = P.springAt(t, at, 'fade'), m = P.springAt(t, at + .1, 'bold'), c = P.springAt(t, at + .35, 'bold');
      card.style.opacity = (k * (1 - P.tween(t, end, .2, 'snap'))).toFixed(3);
      mark.style.transform = `scale(${(.6 + .4 * m).toFixed(3)})`; cta.style.transform = `translateY(${((1 - c) * 18).toFixed(1)}px)`; cta.style.opacity = c.toFixed(3);
      const a = P.springAt(t, at + .2, 'fade'), b = P.springAt(t, at + .55, 'fade'); w1.style.opacity = a.toFixed(3); w2.style.opacity = b.toFixed(3); w2.style.transform = `translateY(${((1 - b) * 10).toFixed(1)}px)`; });
    // the card is held long enough to read, so it keeps breathing (owner, 15-16 Oct 2026; also keeps the gate's "live ending"): a slow push-in,
    // a soft blue light rising behind the mark and a light sweep across the DM button
    if (breathe) {
      const halo = E.el('div', 'position:absolute;left:-40px;right:-40px;top:60px;height:520px;background:radial-gradient(45% 40% at 50% 45%,rgba(${G.halo},.32),rgba(${G.halo},0) 70%);opacity:0;pointer-events:none', card); card.prepend(halo);
      cta.style.position = 'relative'; cta.style.overflow = 'hidden';
      const shine = E.el('i', 'position:absolute;top:-10px;bottom:-10px;width:44px;left:0;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.55),rgba(255,255,255,0));transform:skewX(-20deg);opacity:0', cta);
      P.on((t) => { const k = P.EASE.swing(Math.min(1, Math.max(0, (t - at - .3) / Math.max(1.5, end - at - .3))));   // even push through the whole hold (glide finished in a second and the gate saw a dead ending) card.style.scale = (1 + .11 * k).toFixed(4); halo.style.opacity = (.25 + .75 * k).toFixed(3);
        halo.style.transform = `translateY(${(40 - 70 * k).toFixed(1)}px) scale(${(.8 + .5 * k).toFixed(3)})`;
        const u = ((t - at - .9) % 1.6) / 1.6; shine.style.opacity = t > at + .9 && t < end - .2 ? '1' : '0'; shine.style.left = (-60 + 340 * u).toFixed(1) + 'px'; });
    }
    return card;
  };


  // ---- serpClimb (16 Oct 2026, new trick): a search-results card; our result starts far down in a dated look, then climbs to #1 on a spring, the rows it passes shift down,
  //      the rank badge counts 7 → 1 and the row restyles to the modern look. `windows` are the times the card is on screen; before `climbAt` the old state shows.
  P.serpClimb = function (parent, { x = 30, y = 150, w = 342, query = 'bakery near me', windows = [[7.4, 10.7]], climbAt = null, others = ['Corner Loaf Co.', 'Daily Crumb', 'Flour & Fork', 'Crust House', 'Rye & Co.', 'Bun Lane'],
    oldRow = ['Oventide Bakery', 'Home Page - Welcome to our website'], newRow = ['Oventide Bakery ★ 4.9', 'Open now · 300 m · order for pickup'], from = 7, rowH = 50, hue = '#C6F432', ink = '#08241A' } = {}) {
    P.use('mechanism', 'serp-climb');
    const n = others.length, B = P.BRAND;
    const card = E.el('div', `position:absolute;left:${x}px;top:${y}px;width:${w}px;padding:14px 14px 12px;border-radius:26px;background:linear-gradient(160deg,rgba(235,242,255,.96),rgba(205,218,246,.92));box-shadow:0 30px 70px rgba(0,0,0,.5),inset 0 1px 0 #fff;opacity:0;color:#0A0E17`, parent);
    E.el('div', `display:flex;align-items:center;gap:9px;height:38px;border-radius:19px;background:#fff;padding:0 14px;font:600 15px/1 Archivo,sans-serif;box-shadow:inset 0 0 0 1.5px rgba(10,14,23,.14)`, card,
      `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#0A0E17" stroke-width="2"><circle cx="7" cy="7" r="5"/><path d="M11 11l4 4"/></svg><span class="qt"></span>`);
    const qt = card.querySelector('.qt');
    const list = E.el('div', `position:relative;margin-top:12px;height:${(n + 1) * rowH}px`, card);
    const rows = others.map((nm, i) => E.el('div', `position:absolute;left:0;right:0;top:0;height:${rowH - 8}px;border-radius:13px;background:rgba(255,255,255,.7);padding:0 12px;display:flex;flex-direction:column;justify-content:center;font:600 11.5px/1.25 Archivo,sans-serif;color:#5b6678`, list, `<b style="font:800 14px/1.2 Archivo,sans-serif;color:#0A0E17">${nm}</b>${(i + .8).toFixed(1)} km · ${i % 2 ? 'opens 9:00' : 'opens 8:00'}`));
    const me = E.el('div', `position:absolute;left:0;right:0;top:0;height:${rowH - 8}px;border-radius:13px;padding:0 12px;display:flex;flex-direction:column;justify-content:center;font:600 11.5px/1.25 Archivo,sans-serif;z-index:3`, list);
    const rank = E.el('div', `position:absolute;left:-8px;top:-14px;z-index:5;min-width:50px;height:50px;border-radius:25px;padding:0 10px;display:grid;place-items:center;background:#FF5A4F;color:#fff;font:900 24px/1 Archivo,sans-serif;font-variation-settings:'wdth' 90;box-shadow:0 8px 20px rgba(0,0,0,.35)`, card, '#7');
    const ca = climbAt == null ? 1e9 : climbAt;
    P.on((t) => {
      const win = windows.find(([a, b]) => t >= a - .6 && t <= b + .6);
      const on = win ? clamp((t - win[0]) / .5) * (1 - clamp((t - win[1]) / .5)) : 0;
      const [a0] = win || [0], k = P.springAt(t, ca, 'default'), kk = t >= ca ? k : 0, pop = P.springAt(t, a0, 'bold');
      card.style.opacity = on.toFixed(3); card.style.transform = `translateY(${((1 - pop) * 36).toFixed(1)}px) scale(${(.96 + .04 * pop).toFixed(4)})`;
      const typed = Math.min(query.length, Math.max(0, Math.floor((t - a0 - .1) * 24))); qt.textContent = query.slice(0, win ? typed : query.length);
      rows.forEach((r, i) => { r.style.transform = `translateY(${((i + kk) * rowH).toFixed(1)}px)`; r.style.opacity = P.tween(t, a0 + .15 + i * .05, .4, 'glide').toFixed(3); });
      me.style.transform = `translateY(${(from * rowH * (1 - kk)).toFixed(1)}px)`;
      const fresh = t >= ca + .25; me.style.opacity = P.tween(t, a0 + .3, .4, 'glide').toFixed(3);
      me.style.background = fresh ? hue : 'rgba(255,255,255,.55)'; me.style.color = fresh ? ink : '#7a8497'; me.style.boxShadow = fresh ? `0 0 0 2px ${ink}, 0 10px 24px rgba(198,244,50,.4)` : 'none';
      const r = fresh ? newRow : oldRow; me.innerHTML = `<b style="font:${fresh ? 900 : 500} ${fresh ? 15 : 13}px/1.2 ${fresh ? 'Archivo,sans-serif' : "'Times New Roman',serif"};color:${fresh ? ink : '#2233cc'};${fresh ? '' : 'text-decoration:underline'}">${r[0]}</b>${r[1]}`;
      const pos = Math.max(1, Math.round(from * (1 - kk)) + 1); rank.textContent = '#' + (t >= ca ? Math.max(1, Math.round((from + 1) * (1 - kk))) : from + 1);
      rank.style.background = t >= ca + .6 ? hue : '#FF5A4F'; rank.style.color = t >= ca + .6 ? ink : '#fff'; rank.style.transform = `scale(${(1 + .25 * Math.max(0, 1 - Math.abs(t - ca - .7) * 4)).toFixed(3)})`;
    });
    return card;
  };
  // =====================================================================================================================================
  // REFERENCE STUDY 3 (owner's screen recordings, 14 Oct 2026): flip words, pendulum wipe, black interstitials, radial diagram tour, word construction,
  // inline icons, orbiting collage. Techniques only; nothing copied.
  // =====================================================================================================================================
  // flip words: one huge word per beat, filling the width; the ground flips between two colours on every word (type IS the picture)
  P.flipWords = function (parent, words, { at = 0, per = .6, colours = [P.accent, P.ink], y = 330, maxW = 380, out = null } = {}) {
    P.use('type', 'flip-words');
    const ground = E.el('div', 'position:absolute;inset:0;opacity:0', parent);
    const el = E.el('div', `position:absolute;left:0;right:0;top:${y}px;transform:translateY(-50%);text-align:center;white-space:nowrap;font:900 160px/.9 Archivo,sans-serif;font-variation-settings:"wdth" 75;letter-spacing:-.05em`, parent);
    const sizes = words.map((w) => { const m = document.createElement('canvas').getContext('2d'); m.font = '900 100px Archivo, sans-serif'; return Math.min(200, Math.floor(100 * maxW / Math.max(1, m.measureText(w).width))); });
    P.on((t) => { const i = Math.floor((t - at) / per); const on = t >= at && i < words.length && (out == null || t < out);
      ground.style.opacity = on ? '1' : '0'; el.style.opacity = on ? '1' : '0'; if (!on) return;
      const a = colours[i % 2], b = colours[(i + 1) % 2], k = ease.outX(clamp((t - at - i * per) / .18));
      ground.style.background = a; el.style.color = b; el.textContent = words[i]; el.style.fontSize = sizes[i] + 'px'; el.style.transform = `translateY(-50%) scale(${lerp(1.18, 1, k).toFixed(3)})`; });
    return el;
  };
  // pendulum: a tag hangs on a string from above the frame and swings; as it passes, the text behind it switches (the swinging object is the wipe)
  P.pendulum = function (parent, pairs, { at = 0, period = 1.2, pivot = [201, -60], len = 330, amp = 38, tagHtml = '', y = 300, size = 40, colour, alt } = {}) {
    P.use('transition', 'pendulum');
    const A = [0, 1].map((i) => E.el('div', `position:absolute;left:30px;right:30px;top:${y}px;transform:translateY(-50%);text-align:center;color:${i ? (alt || P.fg) : (colour || P.fg)};font:900 ${size}px/.95 Archivo,sans-serif;font-variation-settings:"wdth" 80;text-transform:uppercase`, parent));
    const svgNS = 'http://www.w3.org/2000/svg', box = svgEl(parent, '<line class="str" stroke-width="2" stroke-linecap="round"/>'), str = box.querySelector('.str'); str.setAttribute('stroke', hexA(P.light ? '#000000' : '#ffffff', .7)); void svgNS;
    const tag = E.el('div', `position:absolute;left:-30px;top:-30px;width:60px;height:60px;border-radius:14px;display:grid;place-items:center;background:${P.ink};color:${P.accent};box-shadow:0 10px 24px rgba(0,0,0,.4),0 0 0 2px ${hexA(P.accent, .5)};font:900 26px/1 Archivo,sans-serif`, parent, tagHtml || '✦');
    // each half-swing (one segment of `period`) sweeps the tag from one extreme to the other; the part of the frame it has crossed already shows the next line
    const seq = pairs.flat();
    P.on((t) => { const u = Math.max(0, (t - at) / period), n = Math.floor(u), f = u - n, ang = amp * Math.cos(Math.PI * u) * (Math.PI / 180);
      const x = pivot[0] + len * Math.sin(ang), yy = pivot[1] + len * Math.cos(ang);
      str.setAttribute('x1', pivot[0]); str.setAttribute('y1', pivot[1]); str.setAttribute('x2', x.toFixed(1)); str.setAttribute('y2', (yy - 30).toFixed(1));
      tag.style.transform = `translate(${x.toFixed(1)}px,${yy.toFixed(1)}px) rotate(${(-ang * 57.3 * .6).toFixed(1)}deg)`;
      const cur = seq[Math.min(n, seq.length - 1)], nxt = seq[Math.min(n + 1, seq.length - 1)], fromRight = n % 2 === 0, swapping = t >= at && n + 1 < seq.length && f > .03 && f < .97;
      A[0].textContent = cur; A[1].textContent = nxt;
      const cut = Math.max(0, Math.min(342, x - 30));
      A[0].style.clipPath = !swapping ? 'none' : fromRight ? `inset(0 ${(342 - cut).toFixed(1)}px 0 0)` : `inset(0 0 0 ${cut.toFixed(1)}px)`;
      A[1].style.clipPath = fromRight ? `inset(0 0 0 ${cut.toFixed(1)}px)` : `inset(0 ${(342 - cut).toFixed(1)}px 0 0)`;
      A[1].style.opacity = swapping ? '1' : '0'; });
    return { tag, lines: A };
  };
  // interstitial: a full-frame cut to solid black (or any colour) with one pivot sentence ("But there's one more thing")
  P.interstitial = function (parent, text, { at = 6, out = 6.9, colour = '#050505', ink = '#ffffff', size = 34 } = {}) {
    P.use('transition', 'interstitial');
    const el = E.el('div', `position:absolute;inset:0;background:${colour};display:grid;place-items:center;padding:0 30px;text-align:center;color:${ink};font:800 ${size}px/1.05 Archivo,sans-serif;letter-spacing:-.02em;opacity:0`, parent, text);
    P.on((t) => { el.style.opacity = t >= at && t < out ? '1' : '0'; });
    return el;
  };
  // radial diagram: a hub with N labelled spokes; the camera tours the spokes one by one (labels type in), then pulls back to show the whole thing ("Screenshot this")
  P.radial = function (parent, { hub = 'Formula', labels = [], cx = 201, cy = 330, r = 140, at = 2, per = .9, pullback = null, title = '', zoom = 1.55 } = {}) {
    P.use('mechanism', 'radial-tour');
    const box = E.el('div', 'position:absolute;inset:0;transform-origin:0 0', parent);
    const n = labels.length, pts = labels.map((_, i) => { const a = -Math.PI / 2 + i * TAU / n; return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), a }; });
    const lines = svgEl(box, pts.map((p) => `<line x1="${cx}" y1="${cy}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" stroke="${hexA(P.light ? '#000000' : '#ffffff', .35)}" stroke-width="1.4"/><circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4" fill="${P.fg}"/>`).join(''));
    void lines;
    const poly = (k) => Array.from({ length: 7 }, (_, i) => { const a = -Math.PI / 2 + i * TAU / 7; return `${(50 + k * Math.cos(a)).toFixed(1)}% ${(50 + k * Math.sin(a)).toFixed(1)}%`; }).join(',');
    E.el('div', `position:absolute;left:${cx - 62}px;top:${cy - 62}px;width:124px;height:124px;clip-path:polygon(${poly(50)});background:${P.light ? '#111' : P.accent};display:grid;place-items:center;text-align:center;color:${P.light ? '#fff' : '#111'};font:800 15px/1.05 Archivo,sans-serif;padding:16px;box-sizing:border-box`, box, hub);
    const labs = labels.map((txt, i) => { const p = pts[i], right = Math.cos(p.a) > .3, left = Math.cos(p.a) < -.3; const el = E.el('div', `position:absolute;top:${(p.y + (Math.sin(p.a) < -.5 ? -30 : Math.sin(p.a) > .5 ? 10 : -9)).toFixed(1)}px;${right ? `left:${(p.x + 10).toFixed(1)}px` : left ? `right:${(402 - p.x + 10).toFixed(1)}px` : `left:${(p.x - 80).toFixed(1)}px;width:160px;text-align:center`};white-space:nowrap;color:${P.fg};font:700 16px/1 Archivo,sans-serif`, box, ''); el.full = txt; return el; });
    const head = E.el('div', `position:absolute;left:0;right:0;top:130px;text-align:center;color:${P.fg};font:800 22px/1 Archivo,sans-serif;opacity:0`, box, title);
    const end = pullback == null ? at + per * n : pullback;
    P.on((t, tf) => {
      labs.forEach((el, i) => { const a0 = at + i * per, nchar = Math.floor(clamp((tf - a0) / .35) * el.full.length); el.textContent = el.full.slice(0, nchar) + (tf >= a0 && nchar < el.full.length ? '▌' : ''); });
      const i = Math.min(n - 1, Math.max(0, Math.floor((t - at) / per))), p = pts[i], tour = t >= at - .3 && t < end ? 1 : 0, k = ease.io3(clamp((t - end) / .6));
      const Z = zoom, z = tour ? Z : lerp(Z, 1, k), lx = (p.x + cx) / 2 + (p.x - cx) * .35, ly = (p.y + cy) / 2 + (p.y - cy) * .35, fx = tour ? lx : lerp(lx, cx, k), fy = tour ? ly : lerp(ly, cy, k);   // aim between the hub and the label so both stay in frame
      const zz = t < at - .3 ? 1 : z, X = t < at - .3 ? cx : fx, Y = t < at - .3 ? cy : fy; void Z;
      box.style.transform = `translate(${(201 - X * zz).toFixed(1)}px,${(330 - Y * zz).toFixed(1)}px) scale(${zz.toFixed(3)})`;
      head.style.opacity = sm(end + .3, end + .6, t).toFixed(3);
    });
    return box;
  };
  // construct word: letters start spread across the frame on guide lines and snap together into the word (typographic construction)
  P.construct = function (parent, word, { at = 7, dur = .8, y = 330, size = 72, colour } = {}) {
    P.use('type', 'construct');
    const guides = svgEl(parent, `<line x1="0" y1="${y - size * .38}" x2="402" y2="${y - size * .38}" stroke="${hexA(P.accent, .5)}" stroke-dasharray="3 5"/><line x1="0" y1="${y + size * .38}" x2="402" y2="${y + size * .38}" stroke="${hexA(P.accent, .5)}" stroke-dasharray="3 5"/>`);
    const row = E.el('div', `position:absolute;left:0;right:0;top:${y}px;transform:translateY(-50%);text-align:center;white-space:nowrap;color:${colour || P.fg};font:800 ${size}px/1 Archivo,sans-serif;letter-spacing:-.02em`, parent);
    const ls = [...word].map((ch) => E.el('span', 'display:inline-block', row, ch === ' ' ? '&nbsp;' : ch));
    const n = ls.length;
    P.on((t) => { const k = ease.back(clamp((t - at) / dur)), o = clamp((t - at + .2) / .2); row.style.opacity = o.toFixed(3); guides.style.opacity = (o * (1 - sm(at + dur, at + dur + .4, t))).toFixed(3);
      ls.forEach((l, i) => { const spread = (i - (n - 1) / 2) * 34; l.style.transform = `translateX(${((1 - k) * spread).toFixed(1)}px)`; }); });
    return row;
  };
  // inline icon: a sentence where one slot holds an icon that pops and morphs between icons ("New [icon] product")
  P.inlineIcon = function (parent, before, icons, after, { at = 4, per = .45, y = 300, size = 30 } = {}) {
    P.use('type', 'inline-icon');
    const row = E.el('div', `position:absolute;left:20px;right:20px;top:${y}px;transform:translateY(-50%);display:flex;align-items:center;justify-content:center;gap:12px;color:${P.fg};font:700 ${size}px/1 Archivo,sans-serif;white-space:nowrap`, parent);
    E.el('span', '', row, before); const slot = E.el('span', `display:inline-grid;place-items:center;width:${size * 1.8}px;height:${size * 1.8}px;border-radius:${size * .45}px;background:${P.accent};color:${P.light ? '#fff' : '#111'};box-shadow:0 0 24px ${hexA(P.accent, .45)}`, row); E.el('span', '', row, after);
    P.on((t) => { const i = Math.max(0, Math.min(icons.length - 1, Math.floor((t - at) / per))), k = ease.spring(clamp((t - at - i * per) / .35)); slot.innerHTML = P.icon(icons[i], size * 1.15); slot.firstChild.style.transform = `scale(${lerp(.3, 1, k).toFixed(3)}) rotate(${((1 - k) * -40).toFixed(1)}deg)`; row.style.opacity = clamp((t - at + .2) / .2).toFixed(3); });
    return row;
  };
  // orbit collage: cards (HTML snippets) orbit an ellipse around a line of text; they fly in from outside, circle, and leave
  P.orbit = function (parent, cards, { at = 6, out = 8, cx = 201, cy = 330, rx = 165, ry = 225, speed = .3, w = 104, h = 128 } = {}) {
    P.use('mechanism', 'orbit-collage');
    const els = cards.map((html) => P.card(parent, `left:${-w / 2}px;top:${-h / 2}px;width:${w}px;height:${h}px;border-radius:14px;display:grid;place-items:center;padding:10px;text-align:center;font:800 15px/1.15 Archivo,sans-serif;overflow:hidden`, html));
    P.on((t) => { const inK = ease.out3(clamp((t - at) / .7)), outK = ease.in2(clamp((t - out) / .5)), sc = lerp(2.2, 1, inK) + outK * 1.5;
      els.forEach((el, i) => { const a = i * TAU / els.length + (t - at) * speed * TAU; const x = cx + rx * sc * Math.cos(a), y = cy + ry * sc * Math.sin(a), depth = (Math.sin(a) + 1) / 2;
        css(el, { opacity: (clamp((t - at) / .2) * (1 - outK)).toFixed(3), transform: `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) scale(${lerp(.75, 1.05, depth).toFixed(3)}) rotate(${(Math.cos(a) * 8).toFixed(1)}deg)`, zIndex: String(Math.round(depth * 10)) }); }); });
    return els;
  };

  // =====================================================================================================================================
  // SERVICES (14 Oct 2026, owner: every reel sells Aquarii's services; design/services.md)
  // =====================================================================================================================================
  // shield: a shield draws on, threats (red dots) fly in from the frame edges and burst on its rim; a demo counter ticks the blocked ones (security / edge reels)
  P.shield = function (parent, { cx = 201, cy = 300, w = 300, at = 13, out = 16, threats = 16, label = 'Your site', counter = 'BLOCKED', slot = 'payoff', threat = '#ff4d5e' } = {}) {
    P.use(slot, 'shield-deflect');
    const h = w * 1.18, x0 = cx - w / 2, y0 = cy - h / 2;
    const d = `M${cx} ${y0} C${cx + w * .28} ${y0 + h * .08} ${cx + w * .4} ${y0 + h * .1} ${x0 + w} ${y0 + h * .12} L${x0 + w} ${y0 + h * .45} C${x0 + w} ${y0 + h * .74} ${cx + w * .22} ${y0 + h * .9} ${cx} ${y0 + h} C${cx - w * .22} ${y0 + h * .9} ${x0} ${y0 + h * .74} ${x0} ${y0 + h * .45} L${x0} ${y0 + h * .12} C${cx - w * .4} ${y0 + h * .1} ${cx - w * .28} ${y0 + h * .08} ${cx} ${y0} Z`;
    const box = svgEl(parent, `<path class="sf" d="${d}" fill="${hexA(P.accent, .14)}" style="opacity:0"/><path class="ss" d="${d}" pathLength="1" stroke="${P.accent}" stroke-width="4" stroke-linejoin="round" style="stroke-dasharray:1;stroke-dashoffset:1;filter:drop-shadow(0 0 10px ${hexA(P.accent, .8)})"/><g class="th"></g>`);
    const sf = box.querySelector('.sf'), ss = box.querySelector('.ss'), g = box.querySelector('.th');
    const inner = E.el('div', `position:absolute;left:${x0}px;width:${w}px;top:${cy - 38}px;text-align:center;color:${P.fg};opacity:0`, parent,
      `<div style="display:inline-grid;place-items:center;width:56px;height:56px;border-radius:50%;background:${P.accent};color:${P.light ? '#fff' : '#0b0d0f'}">${P.icon('check', 34)}</div><div style="margin-top:10px;font:800 26px/1 Archivo,sans-serif;letter-spacing:-.02em">${label}</div>`);
    const cnt = counter ? E.el('div', `position:absolute;left:${x0}px;width:${w}px;top:${y0 + h * .2}px;text-align:center;font:600 11px/1 ${MONO};letter-spacing:.22em;color:${hexA(P.light ? '#000000' : '#ffffff', .75)};opacity:0`, parent, '') : null;
    // threats: deterministic starts on the frame edge, aimed at the centre; each stops on the shield's rim (ellipse approximation) and bursts there
    let sd = 911; const rnd = () => { sd = (sd * 1664525 + 1013904223) >>> 0; return sd / 4294967296; };
    const rx = w * .5, ry = h * .47, NS = 'http://www.w3.org/2000/svg';
    const list = Array.from({ length: threats }, (_, i) => {
      const a = rnd() * TAU, R = 520, sx = cx + R * Math.cos(a), sy = cy + R * Math.sin(a) * 1.2;
      const ux = Math.cos(a), uy = Math.sin(a) * 1.2, ul = Math.hypot(ux, uy), k = 1 / Math.sqrt((ux / ul / rx) ** 2 + (uy / ul / ry) ** 2);
      const ex = cx + ux / ul * k, ey = cy + uy / ul * k, t0 = at + .45 + i * ((out - at - 1.4) / threats) + rnd() * .1;
      const trail = document.createElementNS(NS, 'line'); trail.setAttribute('stroke', threat); trail.setAttribute('stroke-width', '2.5'); trail.setAttribute('stroke-linecap', 'round'); g.appendChild(trail);
      const dot = document.createElementNS(NS, 'circle'); dot.setAttribute('r', '5'); dot.setAttribute('fill', threat); g.appendChild(dot);
      const ring = document.createElementNS(NS, 'circle'); ring.setAttribute('fill', 'none'); ring.setAttribute('stroke', P.accent); ring.setAttribute('stroke-width', '2.5'); g.appendChild(ring);
      return { sx, sy, ex, ey, t0, dur: .42, trail, dot, ring };
    });
    P.on((t, tf) => {
      const live = clamp((t - at) / .1) * (1 - sm(out, out + .3, t));
      box.style.opacity = live.toFixed(3);
      ss.style.strokeDashoffset = (1 - ease.io3(clamp((t - at) / .6))).toFixed(4); sf.style.opacity = sm(at + .3, at + .7, t).toFixed(3);
      const k = ease.spring(clamp((t - at - .35) / .5)); css(inner, { opacity: (clamp((t - at - .35) / .1) * (1 - sm(out, out + .3, t))).toFixed(3), transform: `scale(${lerp(.6, 1, k).toFixed(3)})` });
      let hits = 0;
      list.forEach((q) => { const u = (tf - q.t0) / q.dur, v = (tf - q.t0 - q.dur) / .45;
        if (u < 0 || v > 1) { q.dot.setAttribute('opacity', '0'); q.trail.setAttribute('opacity', '0'); q.ring.setAttribute('opacity', '0'); if (v > 1) hits++; return; }
        if (u < 1) { const e = ease.in2(u), x = lerp(q.sx, q.ex, e), y = lerp(q.sy, q.ey, e), e2 = Math.max(0, e - .12), tx = lerp(q.sx, q.ex, e2), ty = lerp(q.sy, q.ey, e2);
          q.dot.setAttribute('cx', x.toFixed(1)); q.dot.setAttribute('cy', y.toFixed(1)); q.dot.setAttribute('opacity', '1');
          q.trail.setAttribute('x1', tx.toFixed(1)); q.trail.setAttribute('y1', ty.toFixed(1)); q.trail.setAttribute('x2', x.toFixed(1)); q.trail.setAttribute('y2', y.toFixed(1)); q.trail.setAttribute('opacity', '.55'); q.ring.setAttribute('opacity', '0'); return; }
        hits++; q.dot.setAttribute('opacity', '0'); q.trail.setAttribute('opacity', '0');
        q.ring.setAttribute('cx', q.ex.toFixed(1)); q.ring.setAttribute('cy', q.ey.toFixed(1)); q.ring.setAttribute('r', (5 + 22 * ease.out3(v)).toFixed(1)); q.ring.setAttribute('opacity', (1 - v).toFixed(3)); });
      if (cnt) { cnt.textContent = `${counter} ${String(hits).padStart(2, '0')}`; cnt.style.opacity = (sm(at + .4, at + .7, t) * (1 - sm(out, out + .3, t))).toFixed(3); }
    });
    return { box, inner };
  };

  // =====================================================================================================================================
  // OUR OWN (14 Oct 2026, after the owner flagged a reel that copied a reference): the brand's own metaphor. Aquarii = the water bearer, so a business's site is a
  // vessel and its customers are the water. Leaks are the buyer's pains; our services are the patches.
  // =====================================================================================================================================
  // vessel: a browser window holding water. levels: [[t, 0..1]] (eased between keys); holes: [{ side: 'l'|'r', y, open: [[t0, t1], ...], icon, fix: t, fixIcon }]
  // a hole sprays while open and the water stands above it (jet speed grows with the depth); `fix` pops a patch on it; pour: [t0, t1] fills it through the address bar
  P.vessel = function (parent, { x = 22, y = 200, w = 358, h = 600, bar = 40, url = 'yourbusiness.com', levels = [[0, .6]], holes = [], pour = null, water = ['#1ec8ff', '#0a4fd6'], leak = '#ff5a4f', patch = P.accent, opener = true, loopAt = null, cam = null, shards = true } = {}) {   // loopAt: replays its frame-0 state from then on (loop); cam: a P.camera that films it
    P.use('mechanism', 'leaky-vessel'); if (opener) P.use('opener', 'leak-cold-open');
    const top = y + bar, bot = y + h, R = 24, IN = 3;
    const L1 = E.el('div', 'position:absolute;left:0;top:0;width:402px;height:715px;transform-origin:0 0', parent);
    const frame = E.el('div', `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;box-sizing:border-box;border-radius:${R}px;border:2px solid rgba(255,255,255,.34);background:rgba(255,255,255,.035);overflow:hidden`, L1);
    const glint = E.el('div', 'position:absolute;left:-60%;top:-10%;width:40%;height:120%;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.10),rgba(255,255,255,0));transform:skewX(-18deg)', frame);
    const barEl = E.el('div', `position:absolute;left:0;right:0;top:0;height:${bar}px;border-bottom:1px solid rgba(255,255,255,.14);display:flex;align-items:center;gap:6px;padding:0 14px`, frame,
      `<i style="width:8px;height:8px;border-radius:50%;background:#ff6b5e"></i><i style="width:8px;height:8px;border-radius:50%;background:#ffc23d"></i><i style="width:8px;height:8px;border-radius:50%;background:#3ddc84"></i>`);
    E.el('div', `position:absolute;left:70px;right:70px;top:9px;height:22px;border-radius:11px;background:rgba(255,255,255,.08);display:grid;place-items:center;color:rgba(255,255,255,.7);font:500 10.5px/1 ${MONO};letter-spacing:.06em`, barEl, url);
    const cv = E.el('canvas', 'position:absolute;inset:0;width:402px;height:715px', parent); cv.width = 804; cv.height = 1430; const g = cv.getContext('2d');
    const L2 = E.el('div', 'position:absolute;left:0;top:0;width:402px;height:715px;transform-origin:0 0', parent);
    const lev = (t) => { let i = 0; while (i < levels.length - 1 && t >= levels[i + 1][0]) i++; const [a, la] = levels[i], [b, lb] = levels[Math.min(i + 1, levels.length - 1)]; return b > a ? lerp(la, lb, P.EASE.swing(clamp((t - a) / (b - a)))) : la; };   // swing: the level starts and stops smoothly
    const surf = (t) => bot - IN - lev(t) * (bot - top - IN);
    const hx = (hl) => (hl.side === 'l' ? x + 1 : x + w - 1), dir = (hl) => (hl.side === 'l' ? -1 : 1);
    const isOpen = (hl, t) => (hl.open || []).some(([a, b]) => t >= a && t < b);
    // patches + hole badges (DOM, crisp)
    holes.forEach((hl) => {
      hl.badge = E.el('div', `position:absolute;left:${hx(hl) - 15 - dir(hl) * 22}px;top:${hl.y - 15}px;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:${leak};color:#fff;box-shadow:0 0 16px ${hexA(leak, .7)};opacity:0`, L2, P.icon(hl.icon || 'spark', 17));
      hl.patchEl = E.el('div', `position:absolute;left:${hx(hl) - 21}px;top:${hl.y - 21}px;width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:${patch};color:#0b0d0f;box-shadow:0 0 0 3px ${hexA(patch, .3)},0 0 24px ${hexA(patch, .6)};opacity:0`, L2, P.icon(hl.fixIcon || 'check', 22));
      hl.ring = E.el('div', `position:absolute;left:${hx(hl) - 30}px;top:${hl.y - 30}px;width:60px;height:60px;border-radius:50%;border:2.5px solid ${patch};opacity:0`, L2);
    });
    const SP = .016, LIFE = 1.1, G = 950;
    P.on((t0, tf0) => {
      const t = loopAt != null && t0 >= loopAt ? t0 - P.len : t0, tf = loopAt != null && t0 >= loopAt ? tf0 - P.len : tf0;
      g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, 804, 1430); g.setTransform(2, 0, 0, 2, 0, 0);
      if (cam) { const c = cam.get(t0); g.translate(201, 357.5); g.rotate(c.r); g.scale(c.s, c.s); g.translate(-c.x, -c.y); const m = cam.css(c); L1.style.transform = m; L2.style.transform = m; }
      { const cyc = (tf0 % 4.6) / 4.6; glint.style.transform = `translateX(${(P.EASE.swing(clamp(cyc / .7)) * 420).toFixed(1)}%) skewX(-18deg)`; }   // a smooth sweep, then rest
      // water, clipped to the window's inside
      const sY = surf(t), slope = Math.abs(lev(t + .05) - lev(t - .05)) * 10, pouring = pour && t >= pour[0] && t < pour[1];
      const amp = Math.min(11, 3 + slope * 40 + (pouring ? 3 : 0));
      g.save(); g.beginPath(); g.roundRect(x + IN, top, w - IN * 2, h - bar - IN, [0, 0, R - 3, R - 3]); g.clip();
      const gr = g.createLinearGradient(0, sY - 10, 0, Math.max(bot, sY + 300)); gr.addColorStop(0, '#8ff0ff'); gr.addColorStop(.06, water[0]); gr.addColorStop(.55, water[1]); gr.addColorStop(1, '#04205e');
      const wy = (px) => sY + amp * .6 * Math.sin(px * .028 + tf * 3.1) + amp * .4 * Math.sin(px * .061 - tf * 2.2) + amp * .15 * Math.sin(px * .19 + tf * 6.3);
      g.beginPath(); g.moveTo(x, bot + 10); for (let px = x; px <= x + w; px += 4) g.lineTo(px, wy(px)); g.lineTo(x + w, bot + 10); g.closePath(); g.fillStyle = gr; g.fill();
      g.save(); g.clip();                                                   // light inside the water: slow diagonal bands + soft caustic flecks
      g.globalCompositeOperation = 'lighter';
      for (let k = 0; k < 4; k++) { const bx = x + k * 95 - 40 + 70 * Math.sin(tf * .35 + k * 1.7); const lg = g.createLinearGradient(bx, 0, bx + 70, 0); lg.addColorStop(0, 'rgba(255,255,255,0)'); lg.addColorStop(.5, 'rgba(200,250,255,.10)'); lg.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = lg; g.beginPath(); g.moveTo(bx, sY - 20); g.lineTo(bx + 70, sY - 20); g.lineTo(bx - 60, bot + 40); g.lineTo(bx - 130, bot + 40); g.closePath(); g.fill(); }
      for (let k = 0; k < 26; k++) { const fx = x + ((k * 73.3) % w) + 14 * Math.sin(tf * (.6 + (k % 5) * .1) + k), fy = sY + 14 + ((k * 41.7) % 120), a2 = .08 + .1 * Math.max(0, Math.sin(tf * 3 + k)); g.strokeStyle = `rgba(220,255,255,${a2.toFixed(3)})`; g.lineWidth = 1.2;
        g.beginPath(); g.moveTo(fx - 9, fy); g.quadraticCurveTo(fx, fy - 4 * Math.sin(tf * 2 + k), fx + 9, fy + 1); g.stroke(); }
      g.restore();
      g.beginPath(); for (let px = x; px <= x + w; px += 4) px === x ? g.moveTo(px, wy(px)) : g.lineTo(px, wy(px)); g.strokeStyle = 'rgba(255,255,255,.95)'; g.lineWidth = 2.2; g.stroke();
      g.beginPath(); for (let px = x; px <= x + w; px += 4) px === x ? g.moveTo(px, wy(px) + 5) : g.lineTo(px, wy(px) + 5); g.strokeStyle = 'rgba(255,255,255,.25)'; g.lineWidth = 6; g.stroke();
      // bubbles inside the water
      g.fillStyle = 'rgba(255,255,255,.22)'; for (let i = 0; i < 14; i++) { const span = bot - sY + 1, cyc = ((tf * (26 + i * 3) + i * 61) % span) / span, bx = x + 20 + ((i * 97) % (w - 40)), by = bot - span * Math.pow(cyc, 1.5); if (by > sY + 6) { g.beginPath(); g.arc(bx + 4 * Math.sin(tf * 2 + i), by, 1.5 + (i % 3), 0, TAU); g.fill(); } }
      g.restore();
      // pour: a stream from the address bar into the surface
      if (pouring || (pour && t >= pour[1] && t < pour[1] + .4)) {
        const cx = x + w / 2, k = pouring ? 1 : 1 - P.EASE.swing(clamp((t - pour[1]) / .4)), y0 = pouring ? top : lerp(top, sY, 1 - k);
        g.fillStyle = water[0]; g.beginPath(); for (let yy = y0; yy <= sY; yy += 6) g.lineTo(cx - 6 * k + 1.5 * Math.sin(yy * .09 + tf * 14), yy); for (let yy = sY; yy >= y0; yy -= 6) g.lineTo(cx + 6 * k + 1.5 * Math.sin(yy * .09 + tf * 14 + 1), yy); g.fill();
        g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 1.6; for (let r = 0; r < 3; r++) { const u = ((tf * 1.8 + r / 3) % 1), ge = P.EASE.swing(u); g.globalAlpha = P.EASE.swing(clamp(u / .15)) * (1 - P.EASE.snap(u)) * k; g.beginPath(); g.ellipse(cx, sY, 10 + ge * 46, 3 + ge * 9, 0, 0, TAU); g.stroke(); } g.globalAlpha = 1;
      }
      // holes: crack + jet of drops (each drop is a pure function of its spawn time)
      holes.forEach((hl) => {
        const open = isOpen(hl, t), fixed = hl.fix != null && t >= hl.fix && !(hl.open || []).some(([a]) => a > hl.fix && t >= a);
        { const oa = (hl.open || []).filter(([a0]) => t >= a0).map(([a0]) => a0).pop(); hl.badge.style.opacity = open && !fixed ? (oa < 0 ? 1 : P.springAt(t, oa, 'fade')).toFixed(3) : '0'; }
        if (shards) (hl.open || []).forEach(([a0]) => { const u = (t - a0) / .9; if (a0 < 0 || u < 0 || u > 1) return;   // glass shards burst out of a fresh crack
          for (let q = 0; q < 12; q++) { const j = ((q * 2654435761 + a0 * 1000) >>> 0) / 4294967296, ang = (dir(hl) > 0 ? 0 : Math.PI) + (j - .5) * 2.2, sp = 90 + 160 * j, tt = u * .9;
            const px = hx(hl) + Math.cos(ang) * sp * tt, py = hl.y + Math.sin(ang) * sp * tt + .5 * 700 * tt * tt, sz = 3 + 6 * ((q * 7919) % 10) / 10;
            g.save(); g.translate(px, py); g.rotate(j * 9 + tt * (6 + 8 * j)); g.globalAlpha = 1 - P.EASE.snap(u); g.fillStyle = 'rgba(220,240,255,.9)'; g.beginPath(); g.moveTo(-sz, -sz * .4); g.lineTo(sz, -sz * .7); g.lineTo(sz * .2, sz); g.closePath(); g.fill(); g.restore(); } });
        if (open && !fixed) { g.strokeStyle = leak; g.lineWidth = 2.4; g.beginPath(); const X = hx(hl), d = -dir(hl); g.moveTo(X, hl.y - 16); g.lineTo(X + d * 6, hl.y - 7); g.lineTo(X - d * 2, hl.y); g.lineTo(X + d * 7, hl.y + 8); g.lineTo(X, hl.y + 16); g.stroke(); }
        const pk = hl.fix == null ? 0 : P.springAt(t, hl.fix, 'bold');     // the patch slams on: bold spring (~5% overshoot, settled in 12 frames)
        css(hl.patchEl, { opacity: (fixed ? P.springAt(t, hl.fix, 'fade') : 0).toFixed(3), transform: `scale(${lerp(1.8, 1, pk).toFixed(3)}) rotate(${((1 - pk) * -30).toFixed(1)}deg)` });
        const ru = hl.fix == null ? 1 : clamp((t - hl.fix) / .5); css(hl.ring, { opacity: (fixed && ru < 1 ? P.springAt(t, hl.fix, 'fade') * (1 - P.EASE.snap(ru)) : 0).toFixed(3), transform: `scale(${(.5 + P.spring(Math.max(0, t - (hl.fix || 0)), P.SPRING.default) * 1.6).toFixed(3)})` });
        // the jet: a thick arc along the path of a drop leaving now, then the drops
        const headNow = hl.y - surf(t);
        if (open && !fixed && headNow > 2) {                               // the unbroken part of the jet: a tapered, wobbling ribbon with a highlight
          const v = (38 + 11 * Math.sqrt(headNow)) * (1 + .06 * Math.sin(tf * 23)), w0 = Math.min(11, 3 + headNow / 14), TB = .16, N = 16, L = [], R2 = [];
          for (let k = 0; k <= N; k++) { const tau = TB * k / N, px = hx(hl) + dir(hl) * v * tau, py = hl.y + .5 * G * tau * tau, vx = dir(hl) * v, vy = G * tau, vl = Math.hypot(vx, vy), nx = -vy / vl, ny = vx / vl;
            const ww = w0 * (1 - .6 * k / N) * (1 + .18 * Math.sin(tf * 31 - k * 1.3)) / 2; L.push([px + nx * ww, py + ny * ww]); R2.push([px - nx * ww, py - ny * ww]); }
          const jg = g.createLinearGradient(hx(hl), hl.y, hx(hl) + dir(hl) * v * TB, hl.y + 20); jg.addColorStop(0, '#bff6ff'); jg.addColorStop(1, water[0]);
          g.fillStyle = jg; g.beginPath(); L.forEach(([a1, b1], k) => (k ? g.lineTo(a1, b1) : g.moveTo(a1, b1))); R2.reverse().forEach(([a1, b1]) => g.lineTo(a1, b1)); g.closePath(); g.fill();
          g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 1.2; g.beginPath(); L.forEach(([a1, b1], k) => (k ? g.lineTo(a1, b1 + 1.5) : g.moveTo(a1, b1 + 1.5))); g.stroke(); }
        g.fillStyle = water[0];
        const n0 = Math.ceil((tf - LIFE) / SP), n1 = Math.floor(tf / SP);
        for (let n = n0; n <= n1; n++) {
          const s0 = n * SP; if (!isOpen(hl, s0) || (hl.fix != null && s0 >= hl.fix && !(hl.open || []).some(([a]) => a > hl.fix && s0 >= a))) continue;
          const head = hl.y - surf(s0); if (head <= 2) continue;
          const tau = tf - s0; if (tau < .15) continue;                      // the ribbon covers the first moments
          const jit = ((n * 2654435761) >>> 0) / 4294967296, j2 = ((n * 40503) % 1000) / 1000, v = (38 + 11 * Math.sqrt(head)) * (.85 + .3 * jit);
          const px = hx(hl) + dir(hl) * v * tau + (j2 - .5) * 10 * tau, py = hl.y + (jit - .5) * 6 + .5 * G * tau * tau;
          if (py > 1000) continue;
          const vx = dir(hl) * v, vy = G * tau, ang = Math.atan2(vy, vx), r = j2 < .25 ? .9 + jit : 1.8 + 3.2 * jit, st = 1 + Math.hypot(vx, vy) * .006;   // stretched along its velocity
          g.save(); g.translate(px, py); g.rotate(ang); g.globalAlpha = j2 < .25 ? .55 : .95; g.fillStyle = water[0]; g.beginPath(); g.ellipse(0, 0, r * st, r, 0, 0, TAU); g.fill();
          if (r > 2) { g.fillStyle = 'rgba(255,255,255,.85)'; g.beginPath(); g.ellipse(r * .3, -r * .35, r * .35 * st, r * .25, 0, 0, TAU); g.fill(); }
          g.restore();
        }
        g.globalAlpha = 1;
      });
    });
    return { frame, surf, lev, layers: [L1, L2], cv };
  };
  // rise chips: message chips pop out of a surface and float up through the frame (customers that now stay: enquiries, bookings)
  P.riseChips = function (parent, texts, { at = 13, per = .32, x0 = 60, x1 = 342, from = () => 400, to = 110, dur = 2.4, out = 15.4, icon = 'chat', right = 372 } = {}) {
    P.use('payoff', 'rise-chips');
    const chips = texts.map((txt, i) => {
      const el = E.el('div', `position:absolute;left:0;top:0;display:flex;align-items:center;gap:7px;padding:8px 13px 8px 9px;border-radius:99px;white-space:nowrap;background:#fff;color:#0b0d0f;font:700 14px/1 Archivo,sans-serif;box-shadow:0 10px 26px rgba(0,0,0,.35);opacity:0`, parent,
        `<span style="display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:${P.accent};color:#0b0d0f">${P.icon(icon, 13)}</span>${txt}`);
      return { el, a: at + i * per, cx: lerp(x0, x1, ((i * 0.618) % 1)) };
    });
    P.on((t) => chips.forEach(({ el, a, cx }, i) => {
      const u = clamp((t - a) / dur), k = ease.spring(clamp((t - a) / .45)), w = el.offsetWidth || 120;
      const left = Math.max(30, Math.min(right - w, cx - w / 2)), yy = lerp(from(a), to + (i % 3) * 38, ease.out3(u));
      css(el, { opacity: (clamp((t - a) / .1) * (1 - sm(out, out + .3, t)) * (1 - sm(.85, 1, u))).toFixed(3), transform: `translate(${left.toFixed(1)}px,${yy.toFixed(1)}px) scale(${lerp(.4, 1, k).toFixed(3)})` });
    }));
    return chips;
  };

  // ---- CINEMATOGRAPHY (14 Oct 2026, owner: "this looks boring"): a real camera, depth, texture ----
  // camera: keys [[t, { x, y, s, r(deg) }, ease?]]: the world point (x, y) sits at the frame centre, zoomed s, rolled r. ease per segment ('io3' default, 'cut' jumps,
  // 'whip' = fast io with overshoot). shake: [[t0, t1, px]]. Use cam.css(c) on DOM layers (transform-origin 0 0) and the same numbers on canvases (crisp at any zoom).
  P.camera = function (keys, { shake = [], handheld = 0 } = {}) {   // handheld: px of slow organic drift (a held camera, never perfectly still)
    P.use('camera', 'keyed-camera');
    // each key is a MOVE from the previous key: springs (by name) start at rest and settle on their own clock; eases (by name) span the gap; 'cut' is a hard cut.
    // Moves are ADDED, not chained, so position and speed stay continuous even when a new move starts before the last one has settled.
    const moves = keys.slice(1).map(([t1, B, ez], i) => { const [t0, A] = keys[i]; const d = { x: B.x - A.x, y: B.y - A.y, s: B.s - A.s, r: (B.r || 0) - (A.r || 0) };
      const name = ez || 'swing', f = name === 'cut' ? ((t) => (t >= t1 ? 1 : 0)) : P.SPRING[name] ? ((t) => P.springAt(t, t0, name)) : ((t) => P.tween(t, t0, t1 - t0, name));
      if (name === 'lin') throw new Error('linear camera move at ' + t1 + ': use a spring or an ease'); return { d, f }; });
    const get = (t) => {
      const A = keys[0][1], c = { x: A.x, y: A.y, s: A.s, r: A.r || 0 };
      moves.forEach(({ d, f }) => { const k = f(t); if (k) { c.x += d.x * k; c.y += d.y * k; c.s += d.s * k; c.r += d.r * k; } });
      c.r *= Math.PI / 180;
      if (handheld) { const w = TAU / P.len;   // whole cycles per film, so the drift loops seamlessly
        c.x += handheld / c.s * (Math.sin(t * 4 * w) + .5 * Math.sin(t * 8 * w + 1)); c.y += handheld / c.s * (Math.cos(t * 3 * w) + .5 * Math.sin(t * 7 * w + 2)); c.r += handheld * .0012 * Math.sin(t * 3 * w); }
      // shake: ~6-7 Hz (a 30 fps film shows at most 15 Hz; faster shakes alias into jitter); envelope and sines start at 0, so no jump
      shake.forEach(([t0, t1, px]) => { if (t >= t0 && t < t1 + .6) { const u = (t - t0) / .07, env = u * Math.exp(1 - u) * px / c.s; c.x += env * Math.sin((t - t0) * 44); c.y += env * Math.sin((t - t0) * 37) * .8; } });   // envelope x sine both start at 0: no jump in position or speed
      return c;
    };
    const css = (c) => `translate(201px,357.5px) rotate(${c.r.toFixed(4)}rad) scale(${c.s.toFixed(4)}) translate(${(-c.x).toFixed(2)}px,${(-c.y).toFixed(2)}px)`;
    const cam = { get, css, layers: [] };
    cam.film = (el) => { el.style.transformOrigin = '0 0'; cam.layers.push(el); return el; };
    P.on((t) => { const c = get(t), m = css(c); cam.layers.forEach((el) => { el.style.transform = m; }); });
    return cam;
  };
  // grain: a light film-grain pass over everything (texture against flat vector look); deterministic per frame
  P.grain = function ({ amount = .07 } = {}) {
    P.use('texture', 'grain');
    const cv = E.el('canvas', `position:absolute;inset:0;width:402px;height:715px;pointer-events:none;mix-blend-mode:overlay;opacity:${amount * 6}`, P.front); cv.width = 201; cv.height = 358; const g = cv.getContext('2d');
    const img = g.createImageData(201, 358);
    P.on((t, tf) => { let sd = (Math.round(tf * 30) * 2654435761) >>> 0; for (let i = 0; i < img.data.length; i += 4) { sd = (sd * 1664525 + 1013904223) >>> 0; const v = sd >>> 24; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; } g.putImageData(img, 0, 0); });
    return cv;
  };
  // drip word: giant display type with drops gathering under the letters and falling (wet type: the brand's water)
  P.dripWord = function (parent, html, { x = 30, y = 120, size = 96, colour = '#fff', drop = null, at = 0, out = 99, n = 7, w = 342, align = 'left', pop = false } = {}) {   // pop: hero reveal (scale 0.92 -> 1 on the default spring, opacity full by frame 6)
    P.use('type', 'drip-word');
    const box = E.el('div', `position:absolute;left:${x}px;top:${y}px;width:${w}px;text-align:${align};color:${colour};font:900 ${size}px/.86 Archivo,sans-serif;font-variation-settings:"wdth" 72;letter-spacing:-.035em;white-space:nowrap`, parent, html);
    const cv = E.el('canvas', 'position:absolute;inset:0;width:402px;height:715px;pointer-events:none', parent); cv.width = 804; cv.height = 1430; const g = cv.getContext('2d'); g.scale(2, 2);
    const B = () => box.getBoundingClientRect(), pb = parent.getBoundingClientRect(); const bb = B(), left = bb.left - pb.left, right = bb.right - pb.left, base = bb.bottom - pb.top - size * .1;
    const drops = Array.from({ length: n }, (_, i) => ({ x: lerp(left + 8, right - 8, ((i * .618) % 1)), p: .9 + (i % 3) * .35, ph: (i * .37) % 1 }));
    P.on((t, tf) => {
      const vis = t >= at && t < out ? (at < 0 ? 1 : P.springAt(t, at, 'fade')) * (1 - P.tween(t, out - .13, .13, 'snap')) : 0; box.style.opacity = vis.toFixed(3);
      if (pop) box.style.transform = `scale(${lerp(.92, 1, at < 0 ? 1 : P.springAt(t, at, 'default')).toFixed(4)})`;
      g.clearRect(0, 0, 402, 715); if (!vis) return;
      g.fillStyle = drop || colour; g.globalAlpha = vis;
      drops.forEach((d) => { const u = ((tf / d.p) + d.ph) % 1, grow = P.EASE.swing(clamp(u / .55)), fall = clamp((u - .55) / .45);
        const r = 2 + 4.5 * grow, yy = base + r * .6 + 260 * fall * fall; g.beginPath(); g.ellipse(d.x, yy, r * (1 - fall * .3), r * (1 + fall * .9), 0, 0, TAU); g.fill();
        if (grow < 1 || fall < .05) { g.beginPath(); g.moveTo(d.x - r * .7, base); g.quadraticCurveTo(d.x, yy - r * 1.6, d.x + r * .7, base); g.fill(); } });
      g.globalAlpha = 1;
    });
    return box;
  };
  // underwater: the camera dives under the surface: deep gradient, moving caustic light, god rays, bubbles at three depths, and cards (messages) rising past the
  // lens at different depths (near ones big and soft, far ones small and dim). The payoff of the vessel story; usable for any "what comes in" moment.
  P.underwater = function (parent, cards, { at = 13, out = 15.3, top = '#0c86e6', deep = '#03173a', icon = 'chat', accent = P.accent } = {}) {
    P.use('payoff', 'underwater-dive');
    const box = E.el('div', `position:absolute;inset:0;overflow:hidden;opacity:0;background:linear-gradient(180deg,${top},${deep} 85%)`, parent);
    const cv = E.el('canvas', 'position:absolute;inset:0;width:402px;height:715px', box); cv.width = 804; cv.height = 1430; const g = cv.getContext('2d'); g.scale(2, 2);
    const D = [{ s: .75, v: 230, blur: 1.4, o: .6 }, { s: 1.15, v: 330, blur: 0, o: 1 }, { s: 1.7, v: 480, blur: 1.2, o: .95 }];
    const cs = cards.map((txt, i) => { const d = D[[1, 0, 2, 1, 0, 2, 1][i % 7]];
      const el = E.el('div', `position:absolute;left:0;top:0;display:flex;align-items:center;gap:8px;padding:9px 15px 9px 10px;border-radius:99px;white-space:nowrap;background:rgba(255,255,255,.96);color:#0b0d0f;font:700 15px/1 Archivo,sans-serif;box-shadow:0 14px 30px rgba(0,20,60,.45);transform-origin:50% 50%;${d.blur ? `filter:blur(${d.blur}px)` : ''}`, box,
        `<span style="display:grid;place-items:center;width:24px;height:24px;border-radius:50%;background:${accent};color:#0b0d0f">${P.icon(icon, 14)}</span>${txt}`);
      return { el, d, t0: at - 1.1 + i * .38, x: [40, 210, 90, 230, 30, 180, 60][i % 7] }; });
    cs.sort((a, b) => a.d.s - b.d.s).forEach((c) => box.appendChild(c.el));     // far ones behind
    let sd = 17; const rnd = () => { sd = (sd * 1664525 + 1013904223) >>> 0; return sd / 4294967296; };
    const bub = Array.from({ length: 70 }, () => ({ x: rnd() * 402, d: rnd(), r: 1 + rnd() * 3.5, p: rnd() }));
    P.on((t, tf) => {
      const on = t >= at && t < out + .3; box.style.opacity = on ? (P.springAt(t, at, 'fade') * (1 - P.tween(t, out, .2, 'snap'))).toFixed(3) : '0'; if (!on) return;
      g.clearRect(0, 0, 402, 715);
      // god rays
      g.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 6; i++) { const cx = 40 + i * 70 + 30 * Math.sin(tf * .6 + i), w2 = 26 + 18 * Math.sin(tf * .9 + i * 2); const gr = g.createLinearGradient(0, 0, 0, 640); gr.addColorStop(0, 'rgba(180,235,255,.20)'); gr.addColorStop(1, 'rgba(180,235,255,0)');
        g.fillStyle = gr; g.beginPath(); g.moveTo(cx - w2 * .4, -10); g.lineTo(cx + w2 * .4, -10); g.lineTo(cx + w2 * 2 + 60, 640); g.lineTo(cx - w2 * 2 + 60, 640); g.closePath(); g.fill(); }
      // caustics: two moving sine nets near the top
      g.strokeStyle = 'rgba(200,245,255,.16)'; g.lineWidth = 2;
      for (let k = 0; k < 2; k++) for (let j = 0; j < 9; j++) { g.beginPath(); for (let px = -10; px <= 412; px += 8) { const py = j * 34 + 12 * Math.sin(px * .035 + tf * (1.4 + k) + j * 1.7) + 7 * Math.sin(px * .08 - tf * 2 + j); px < 0 ? g.moveTo(px, py) : g.lineTo(px, py); } g.stroke(); }
      g.globalCompositeOperation = 'source-over';
      // bubbles (three depths)
      bub.forEach((b) => { const sp = 60 + b.d * 220, cyc = (((tf - at) * sp + b.p * 800) % 820) / 820, yy = 760 - 820 * Math.pow(cyc, 1.4), xx = b.x + 8 * Math.sin(tf * 2 + b.p * 9);
        g.strokeStyle = `rgba(220,245,255,${(.25 + .5 * b.d).toFixed(2)})`; g.lineWidth = 1 + b.d; g.beginPath(); g.arc(xx, yy, b.r * (.6 + b.d), 0, TAU); g.stroke(); });
      // cards rise with depth parallax
      cs.forEach((c) => { const u = (t - c.t0), w2 = c.el.offsetWidth || 150, uu = Math.max(0, u), yy = 740 - (c.d.v * .55 * uu + .5 * c.d.v * .5 * uu * uu), k = P.springAt(t, c.t0, 'default');
        const ww = w2 * c.d.s, xx = Math.max(26 + (ww - w2) / 2, Math.min(376 - w2 - (ww - w2) / 2, c.x)) + 8 * Math.sin(t * 1.7 + c.x);   // whole card inside the 26 px side margins
        css(c.el, { opacity: (u < 0 ? 0 : P.springAt(t, c.t0, 'fade') * c.d.o).toFixed(3), transform: `translate(${xx.toFixed(1)}px,${yy.toFixed(1)}px) scale(${(c.d.s * lerp(.7, 1, k)).toFixed(3)}) rotate(${(4 * Math.sin(t * 1.3 + c.x)).toFixed(2)}deg)` }); });
    });
    return box;
  };

  // =====================================================================================================================================
  // REAL 3D (14 Oct 2026, owner: "why are we not doing 3D?"). A WebGL scene (three.js, MIT; the renderer injects it when a story uses THREE) drawn every film frame.
  // Lit by a procedural studio (emissive softboxes baked into a PMREM environment): no external images, no stock assets. Pure function of film time like the rest.
  //   const G = P.three(parent, { bg, exposure, fov, studio })  ->  { T, R, scene, camera, frame(fn) }   fn(t, tf) runs before each render
  //   P.three.roundRect(T, w, h, r) -> a Shape;  P.three.look(G, t, keys)  keyed 3D camera on the toolkit's springs/eases (summed moves, like P.camera)
  // =====================================================================================================================================
  P.three = function (parent, { bg = '#061722', exposure = 1.05, fov = 30, antialias = false, transmissionScale = .5, tone = 'Neutral', active = null, loopAt = null, studio = [['#ffffff', 7, [0, 7, 2], [10, 4]], ['#38d6ff', 3, [-8, 1, 3], [3, 10]], ['#ffb37a', 2.2, [8, 2, -2], [3, 10]]] } = {}) {
    P.use('render', 'webgl-3d');
    const T = window.THREE; if (!T) throw new Error('three.js is not loaded (the renderer injects it when the story uses THREE)');
    const cv = E.el('canvas', 'position:absolute;left:0;top:0;width:402px;height:715px', parent);
    const R = new T.WebGLRenderer({ canvas: cv, antialias, preserveDrawingBuffer: true, powerPreference: 'high-performance' });   // software GL: MSAA is costly; the film's sub-frame blur already smooths edges
    if ('transmissionResolutionScale' in R) R.transmissionResolutionScale = transmissionScale;
    R.setPixelRatio(1080 / 402); R.setSize(402, 715, false); R.toneMapping = T[tone + 'ToneMapping'] || T.ACESFilmicToneMapping;   // Neutral keeps brand colours saturated (ACES washes lime into pale yellow) R.toneMappingExposure = exposure; R.outputColorSpace = T.SRGBColorSpace;
    const scene = new T.Scene(); scene.background = new T.Color(bg);
    const env = new T.Scene(); env.add(new T.Mesh(new T.BoxGeometry(30, 30, 30), new T.MeshBasicMaterial({ color: new T.Color(bg).multiplyScalar(1.6), side: T.BackSide })));
    studio.forEach(([c, k, pos, size]) => { const m = new T.Mesh(new T.PlaneGeometry(size[0], size[1]), new T.MeshBasicMaterial({ color: new T.Color(c).multiplyScalar(k), side: T.DoubleSide })); m.position.set(...pos); m.lookAt(0, 0, 0); env.add(m); });
    const pm = new T.PMREMGenerator(R); scene.environment = pm.fromScene(env, .03).texture; pm.dispose();
    const camera = new T.PerspectiveCamera(fov, 402 / 715, .02, 200);
    // active: [[t0, t1], ...] windows where the 3D shot is on screen (hybrid films: 3D hero shots, 2D elsewhere); outside them nothing is drawn (fast).
    // loopAt: from then on the scene replays its frame-0 state (time - film length), so the last frame matches the first.
    const on = (t) => !active || active.some(([a, b]) => t >= a && t < b);
    const fns = [], G = { T, R, scene, camera, cv, on, remap: (t) => (loopAt != null && t >= loopAt ? t - P.len : t), frame: (fn) => { fns.push(fn); return fn; } };
    P.on((t0, tf0) => { const vis = on(t0); cv.style.display = vis ? '' : 'none'; if (!vis) return; const t = G.remap(t0), tf = G.remap(tf0);
      fns.forEach((f) => f(t, tf)); R.toneMappingExposure = exposure * (1 - .45 * (P.dimNow || 0)); R.render(scene, camera); });
    // fast capture (the renderer uses it when present): screenshots of a page with a software-GL canvas are slow (~3-4 s), so the renderer takes the 3D frame straight
    // from the canvas (~30 ms) and screenshots only the layers above it with everything below hidden (~1 s), then ffmpeg lays one over the other.
    const below = []; { let n = cv; while (n && n !== document.body) { let sib = n.previousElementSibling; while (sib) { below.push(sib); sib = sib.previousElementSibling; } n = n.parentElement; } }
    const grounds = [document.documentElement, document.body, E.stageEl, P.L].filter(Boolean);
    window.__film3d = {
      active: (t) => on(t),
      grab: () => cv.toDataURL('image/jpeg', .94),
      hide: (on) => { cv.style.visibility = on ? 'hidden' : ''; document.querySelectorAll('canvas').forEach((c) => { if (getComputedStyle(c).mixBlendMode !== 'normal') c.style.visibility = on ? 'hidden' : ''; });   // blend layers (grain) cannot blend over a transparent capture
        below.forEach((e) => { if (e !== P.front && !e.contains(P.front) && e.id !== 'fx') e.style.visibility = on ? 'hidden' : ''; }); grounds.forEach((e) => { if (on) { e.dataset.bg = e.style.background; e.style.background = 'transparent'; } else e.style.background = e.dataset.bg || ''; }); },
    };
    return G;
  };
  P.three.roundRect = (T, w, h, r) => { const s = new T.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; };
  // keyed 3D camera: keys [[t, { p: [x,y,z], at: [x,y,z], fov? }, ease]]: summed moves (springs by name on their own clock, eases over the gap), velocity-continuous
  P.three.look = function (G, keys, { handheld = 0 } = {}) {
    P.use('camera', 'keyed-camera-3d');
    const V = (k) => [...k.p, ...k.at, k.fov || G.camera.fov];
    const moves = keys.slice(1).map(([t1, B, ez], i) => { const [t0, A] = keys[i], a = V(A), b = V(B), name = ez || 'swing';
      const f = name === 'cut' ? ((t) => (t >= t1 ? 1 : 0)) : P.SPRING[name] ? ((t) => P.springAt(t, t0, name)) : ((t) => P.tween(t, t0, t1 - t0, name)); return { d: b.map((x, j) => x - a[j]), f }; });
    const base = V(keys[0][1]);
    G.frame((t) => { const v = base.slice(); moves.forEach(({ d, f }) => { const k = f(t); if (k) d.forEach((x, j) => { v[j] += x * k; }); });
      if (handheld) { const w = TAU / P.len; v[0] += handheld * Math.sin(t * 4 * w); v[1] += handheld * .7 * Math.sin(t * 3 * w + 1); }
      G.camera.position.set(v[0], v[1], v[2]); G.camera.lookAt(v[3], v[4], v[5]); if (G.camera.fov !== v[6]) { G.camera.fov = v[6]; G.camera.updateProjectionMatrix(); } });
  };

  // ---- the leaky vessel in REAL 3D (hybrid films: hero shots in 3D, the rest in 2D). Built from the 3D lab (film/_lab/leaky-3d) after the water realism pass:
  // refractive water with a live surface, scrolled ripple normals, caustics on the page, tank floor and studio floor, a meniscus, rising bubbles, a front-pane crack
  // spraying drops at the lens, landing splashes and a puddle, lime patches, a pour from the address bar. Everything keyed to film time.
  //   P.tank3d(parent, { levels, leak(t), sealed(t), patchAt, pour: [t0, t1], camera: keys for P.three.look, active, loopAt, puddleSize(t) })
  P.tank3d = function (parent, { levels = [[0, .8]], leak = () => false, sealed = () => false, patchAt = null, pour = null, camera, active = null, loopAt = null, puddleSize = () => .5,
    exposure = 1.15, bg = '#061722', RED = '#ff5a4f', SEALS = [[-.55, .3], [.5, -.25], [-.45, -.9], [.5, -1.4]] } = {}) {
    P.use('mechanism', 'tank-3d');
    const G = P.three(parent, { bg, exposure, fov: 28, active, loopAt, studio: [['#ffffff', 6, [0, 7, 3], [8, 3]], ['#1ec8ff', 7, [-8, 1, 3], [2.5, 10]], ['#ff7a45', 4, [8, 2, -1], [2.5, 10]], ['#ffffff', 1.4, [0, 1, 9], [8, 6]]] }), T = G.T, scene = G.scene;
    const W = 2.4, H = 4.0, D = 1.0, BOT = -H / 2, TOP = H / 2, BAR = .36;

    // ---- studio floor + soft contact shadow ----
    const floor = new T.Mesh(new T.PlaneGeometry(40, 40), new T.MeshPhysicalMaterial({ color: '#03101a', roughness: .32, metalness: .1, clearcoat: .6, clearcoatRoughness: .25 }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = BOT - .02; scene.add(floor);
    const sh = document.createElement('canvas'); sh.width = sh.height = 256; { const g = sh.getContext('2d'), gr = g.createRadialGradient(128, 128, 10, 128, 128, 128); gr.addColorStop(0, 'rgba(0,0,0,.85)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); }
    const shadow = new T.Mesh(new T.PlaneGeometry(W * 1.9, D * 3.2), new T.MeshBasicMaterial({ map: new T.CanvasTexture(sh), transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = BOT - .01; scene.add(shadow);

    // ---- the website inside (what the water refracts) ----
    const ui = document.createElement('canvas'); ui.width = 512; ui.height = 820; { const g = ui.getContext('2d');
      g.fillStyle = '#e4f1f9'; g.fillRect(0, 0, 512, 820); g.fillStyle = '#071a26'; g.font = '900 64px Archivo, sans-serif'; g.fillText('Your', 40, 150); g.fillText('business,', 40, 215);
      g.fillStyle = '#0a7fd6'; g.fillText('online.', 40, 280); g.fillStyle = 'rgba(7,26,38,.6)'; g.font = '500 22px Archivo, sans-serif'; g.fillText('Fast pages. Seen posts. Safe site.', 40, 330);
      g.fillStyle = '#b8ff00'; g.beginPath(); g.roundRect(40, 370, 200, 58, 29); g.fill(); g.fillStyle = '#0b0d0f'; g.font = '800 22px Archivo, sans-serif'; g.fillText('Get started', 70, 407);
      [[40, 480], [272, 480], [40, 650], [272, 650]].forEach(([x, y], i) => { g.fillStyle = ['#dcebf5', '#e6f1f8', '#e6f1f8', '#dcebf5'][i]; g.beginPath(); g.roundRect(x, y, 200, 150, 18); g.fill(); g.fillStyle = 'rgba(7,26,38,.7)'; g.fillRect(x + 20, y + 24, 90, 12); g.fillStyle = 'rgba(7,26,38,.3)'; g.fillRect(x + 20, y + 48, 140, 8); g.fillRect(x + 20, y + 64, 120, 8); }); }
    const uiTex = new T.CanvasTexture(ui); uiTex.colorSpace = T.SRGBColorSpace;
    const back = new T.Mesh(new T.PlaneGeometry(W - .2, H - BAR - .2), new T.MeshBasicMaterial({ map: uiTex })); back.position.set(0, -BAR / 2, -D / 2 + .03); scene.add(back);

    // ---- the browser bar ----
    const bar = document.createElement('canvas'); bar.width = 1024; bar.height = 150; { const g = bar.getContext('2d'); g.fillStyle = '#0d1b26'; g.fillRect(0, 0, 1024, 150);
      ['#ff6b5e', '#ffc23d', '#3ddc84'].forEach((c, i) => { g.fillStyle = c; g.beginPath(); g.arc(70 + i * 46, 75, 15, 0, 7); g.fill(); });
      g.fillStyle = 'rgba(255,255,255,.08)'; g.beginPath(); g.roundRect(260, 40, 620, 70, 35); g.fill(); g.fillStyle = 'rgba(255,255,255,.75)'; g.font = '500 34px "Geist Mono", monospace'; g.textAlign = 'center'; g.fillText('yourbusiness.com', 570, 88); }
    const barTex = new T.CanvasTexture(bar); barTex.colorSpace = T.SRGBColorSpace;
    const barBox = new T.Mesh(new T.BoxGeometry(W - .06, BAR, D - .06), [0, 0, 0, 0, 1, 0].map((f) => (f ? new T.MeshPhysicalMaterial({ map: barTex, roughness: .35, clearcoat: .8 }) : new T.MeshPhysicalMaterial({ color: '#0d1b26', roughness: .35 }))));
    barBox.position.y = TOP - BAR / 2 - .03; scene.add(barBox);

    // ---- water: a box whose top is a live surface (refractive, tinted by depth) ----
    const WX = 80, WZ = 22, wg = new T.BoxGeometry(W - .1, 1, D - .1, WX, 1, WZ), wpos = wg.attributes.position, base = Float32Array.from(wpos.array);
    const water = new T.Mesh(wg, new T.MeshPhysicalMaterial({ color: '#f4fdff', transmission: 1, ior: 1.33, thickness: 1.1, roughness: .02, attenuationColor: '#0796ff', attenuationDistance: 1.5, specularIntensity: 1, envMapIntensity: 1.6 }));
    scene.add(water);
    // ---- WATER REALISM (pass 1): fine ripples, caustics, meniscus, bubbles, landing splashes, a growing puddle ----
    // ripples: a procedural height field turned into a normal map, scrolled two ways (no image assets)
    const NM = 256, nmC = document.createElement('canvas'); nmC.width = nmC.height = NM; { const g = nmC.getContext('2d'), img = g.createImageData(NM, NM), h = new Float32Array(NM * NM);
      for (let y = 0; y < NM; y++) for (let x = 0; x < NM; x++) { const u = x / NM * Math.PI * 2, v = y / NM * Math.PI * 2; h[y * NM + x] = Math.sin(u * 3 + Math.sin(v * 2) * 1.3) + .6 * Math.sin(v * 5 + Math.cos(u * 3) * 1.1) + .35 * Math.sin((u + v) * 9) + .2 * Math.sin((u * 2 - v) * 13); }
      for (let y = 0; y < NM; y++) for (let x = 0; x < NM; x++) { const dx = h[y * NM + (x + 1) % NM] - h[y * NM + (x + NM - 1) % NM], dy = h[((y + 1) % NM) * NM + x] - h[((y + NM - 1) % NM) * NM + x], i = (y * NM + x) * 4;
        img.data[i] = 128 + dx * 40; img.data[i + 1] = 128 + dy * 40; img.data[i + 2] = 255; img.data[i + 3] = 255; } g.putImageData(img, 0, 0); }
    const nmTex = new T.CanvasTexture(nmC); nmTex.wrapS = nmTex.wrapT = T.RepeatWrapping; nmTex.repeat.set(2.5, 1.2);
    water.material.normalMap = nmTex; water.material.normalScale = new T.Vector2(.13, .13);
    // caustics: a bright web (where many waves focus light), drawn once, two copies drifting against each other, added as light on the page, the tank floor and the
    // studio floor in front of the glass
    const CS = 512, cC = document.createElement('canvas'); cC.width = cC.height = CS; { const g = cC.getContext('2d'), img = g.createImageData(CS, CS);
      for (let y = 0; y < CS; y++) for (let x = 0; x < CS; x++) { const u = x / CS * Math.PI * 2, v = y / CS * Math.PI * 2;
        const w = Math.abs(Math.sin(u * 4 + Math.sin(v * 3) * 1.6) + Math.sin(v * 4 + Math.sin(u * 5) * 1.4) + Math.sin((u - v) * 3 + Math.sin(u * 2)) ) / 3, c = Math.pow(Math.max(0, 1 - w), 6), i = (y * CS + x) * 4;
        img.data[i] = 150 * c; img.data[i + 1] = 235 * c; img.data[i + 2] = 255 * c; img.data[i + 3] = 255; } g.putImageData(img, 0, 0); }
    const cTex = () => { const t2 = new T.CanvasTexture(cC); t2.wrapS = t2.wrapT = T.RepeatWrapping; return t2; };
    const cMat = (o, rep) => { const tx = cTex(); tx.repeat.set(...rep); return new T.MeshBasicMaterial({ map: tx, transparent: true, opacity: o, blending: T.AdditiveBlending, depthWrite: false }); };
    const caust = [];
    const addC = (geo, pos, rot, o, rep) => [0, 1].forEach((k) => { const m = new T.Mesh(geo, cMat(o, rep)); m.position.set(...pos); m.rotation.set(...rot); m.renderOrder = 1; scene.add(m); caust.push({ m, k }); });
    addC(new T.PlaneGeometry(W - .2, 1), [0, 0, -D / 2 + .035], [0, 0, 0], .75, [1.3, .8]);                    // on the page behind the water (height follows the level)
    addC(new T.PlaneGeometry(W - .12, D - .12), [0, BOT + .052, 0], [-Math.PI / 2, 0, 0], .6, [1.6, .7]);  // on the tank floor
    addC(new T.PlaneGeometry(W * 1.4, 2.2), [0, BOT - .005, D / 2 + 1.1], [-Math.PI / 2, 0, 0], .2, [1.8, 1.5]);   // thrown onto the studio floor in front
    // meniscus: the bright line where the surface meets the glass
    const men = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3([[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => new T.Vector3(a * (W - .1) / 2, 0, b * (D - .1) / 2)), true, 'catmullrom', 0), 120, .0045, 6, true),
      new T.MeshBasicMaterial({ color: '#e9fdff', transparent: true, opacity: .45 })); scene.add(men);
    // bubbles rising inside the water
    const NB = 70, bub = new T.InstancedMesh(new T.SphereGeometry(1, 10, 8), new T.MeshPhysicalMaterial({ color: '#ffffff', transparent: true, opacity: .55, roughness: 0, envMapIntensity: 3, clearcoat: 1 }), NB);
    bub.instanceMatrix.setUsage(T.DynamicDrawUsage); scene.add(bub);
    // where the drops land: splash rings and a puddle that grows while it leaks
    const NS = 40, spl = new T.InstancedMesh(new T.TorusGeometry(1, .04, 4, 24), new T.MeshBasicMaterial({ color: '#d9f7ff', transparent: true, opacity: .35 }), NS); spl.instanceMatrix.setUsage(T.DynamicDrawUsage); scene.add(spl);
    const puddle = new T.Mesh(new T.CircleGeometry(1, 48), new T.MeshPhysicalMaterial({ color: '#0d4f8f', roughness: .02, clearcoat: 1, clearcoatRoughness: 0, envMapIntensity: 2.2, transparent: true, opacity: .8 }));
    puddle.rotation.x = -Math.PI / 2; puddle.position.set(-.62, BOT - .008, 1.25); scene.add(puddle);
    const lev = (t) => { let i = 0; while (i < levels.length - 1 && t >= levels[i + 1][0]) i++; const [a, la] = levels[i], [b, lb] = levels[Math.min(i + 1, levels.length - 1)]; return b > a ? lerp(la, lb, P.EASE.swing(clamp((t - a) / (b - a)))) : la; };
    const yTop = (t) => BOT + .05 + lev(t) * (H - BAR - .12);

    // ---- glass: a clear rounded shell (reflective, edge highlights), drawn after the water ----
    const shell = new T.Mesh(new T.ExtrudeGeometry(P.three.roundRect(T, W - .1, H - .1, .2), { depth: D - .1, bevelEnabled: true, bevelThickness: .05, bevelSize: .05, bevelSegments: 4, curveSegments: 10 }),
      new T.MeshPhysicalMaterial({ color: '#ffffff', transparent: true, opacity: .05, roughness: .01, metalness: 0, clearcoat: 1, clearcoatRoughness: .02, envMapIntensity: 2.2, depthWrite: false, side: T.DoubleSide }));
    shell.position.z = -(D - .1) / 2; shell.renderOrder = 2; scene.add(shell);

    // ---- the crack, the jet and the patch ----
    const HOLE = new T.Vector3(-.55, .3, D / 2 + .03), crack = new T.Group(); scene.add(crack);   // a star of cracks on the front pane
    const crackMat = new T.MeshBasicMaterial({ color: new T.Color(RED).multiplyScalar(2) });
    [[.0, .2], [.9, .16], [1.9, .22], [2.7, .14], [3.6, .19], [4.5, .15], [5.4, .2]].forEach(([a, l], i) => { const pts = []; for (let k = 0; k <= 4; k++) { const rr = l * k / 4, aa = a + (k % 2 ? .18 : -.12) * (i % 2 ? 1 : -1); pts.push(new T.Vector3(HOLE.x + rr * Math.cos(aa), HOLE.y + rr * Math.sin(aa), HOLE.z)); }
      crack.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 16, .004, 5), crackMat)); });
    const N = 520, drops = new T.InstancedMesh(new T.SphereGeometry(1, 12, 8), new T.MeshPhysicalMaterial({ color: '#bdeeff', transparent: true, opacity: .9, roughness: 0, metalness: 0, envMapIntensity: 3.2, clearcoat: 1 }), N);   // drops: reflective, not refractive (cheap)
    drops.instanceMatrix.setUsage(T.DynamicDrawUsage); scene.add(drops);
    const jet = new T.Mesh(new T.BufferGeometry(), drops.material); scene.add(jet);
    const patch = new T.Mesh(new T.ExtrudeGeometry(P.three.roundRect(T, .34, .52, .08), { depth: .06, bevelEnabled: true, bevelThickness: .02, bevelSize: .02, bevelSegments: 3 }),
      new T.MeshPhysicalMaterial({ color: '#b8ff00', roughness: .2, clearcoat: 1, clearcoatRoughness: .05, emissive: new T.Color('#7fd000'), emissiveIntensity: .9 }));
    scene.add(patch);
    // the four sealed cracks (shown when `sealed(t)`): lime tiles on the front pane where each pain was
    const fixed = SEALS.map(([x, y]) => { const m = new T.Mesh(patch.geometry, patch.material); m.position.set(x, y, D / 2 + .02); scene.add(m); return m; });
    const pourM = new T.Mesh(new T.BufferGeometry(), water.material); scene.add(pourM);
    const ring = new T.Mesh(new T.TorusGeometry(1, .012, 6, 48), new T.MeshBasicMaterial({ color: '#dff8ff', transparent: true })); ring.rotation.x = Math.PI / 2; scene.add(ring);
    const m4 = new T.Matrix4(), q = new T.Quaternion(), sc = new T.Vector3(), X = new T.Vector3(1, 0, 0), v3 = new T.Vector3(), G9 = 9.0;

    G.frame((t, tf) => {
      // water surface
      const y0 = yTop(t), slosh = .035 + .05 * Math.abs(lev(t + .05) - lev(t - .05)) * 10 + (pour && t > pour[0] && t < pour[1] ? .03 : 0);
      for (let i = 0; i < wpos.count; i++) { const bx = base[i * 3], by = base[i * 3 + 1], bz = base[i * 3 + 2];
        wpos.array[i * 3 + 1] = by > 0 ? y0 + slosh * (Math.sin(bx * 3.1 + tf * 2.6) * .6 + Math.sin(bz * 5 - tf * 3.3) * .3 + Math.sin((bx + bz) * 7 + tf * 5) * .15) : BOT + .05; }
      wpos.needsUpdate = true; wg.computeVertexNormals();
      nmTex.offset.set(tf * .05, tf * .021);
      caust.forEach(({ m, k }, i) => { const tx = m.material.map; tx.offset.set((k ? -1 : 1) * tf * .045 + i * .13, (k ? .7 : -.5) * tf * .03); });
      { const hgt = Math.max(.01, y0 - (BOT + .05)); caust[0].m.scale.y = caust[1].m.scale.y = hgt; caust[0].m.position.y = caust[1].m.position.y = BOT + .05 + hgt / 2; }
      men.position.y = y0;
      for (let i = 0; i < NB; i++) { const j = ((i * 2654435761) >>> 0) / 4294967296, span = y0 - (BOT + .1), cyc = ((tf * (.18 + .25 * j) + j * 7) % 1), yy = BOT + .1 + span * Math.pow(cyc, 1.4);
        v3.set((j - .5) * (W - .35) + .03 * Math.sin(tf * 3 + i), yy, ((i * 7919 % 100) / 100 - .5) * (D - .3)); const rr = .006 + .014 * ((i * 31 % 10) / 10); sc.set(rr, rr, rr); m4.compose(v3, q.identity(), sc); bub.setMatrixAt(i, m4); }
      bub.instanceMatrix.needsUpdate = true;
      { let ns = 0; for (let k = 0; k < NS; k++) { const s1 = Math.floor(tf / .045) * .045 - k * .045, u = (tf - s1) / .5; if (u < 0 || u > 1 || !leak(s1 - .35)) continue;
          const j = ((Math.round(s1 * 1000) * 2654435761) >>> 0) / 4294967296; v3.set(HOLE.x - .1 + (j - .5) * .5, BOT + .002, 1.15 + (((Math.round(s1 * 1000) * 40503) % 1000) / 1000 - .5) * .5);
          const rr = .02 + .09 * P.EASE.swing(u); sc.set(rr, rr, rr * .6); q.setFromAxisAngle(X, Math.PI / 2); m4.compose(v3, q, sc); spl.setMatrixAt(ns++, m4); }
        spl.count = ns; spl.instanceMatrix.needsUpdate = true; spl.material.opacity = .32; }
      { const grow = puddleSize(t); puddle.visible = grow > .01; puddle.scale.set(grow * 1.6, Math.max(.001, grow), 1); }
      // jet: drops leave the crack while the water stands above it, until the patch
      const head = Math.max(0, y0 - HOLE.y), open = leak(t);
      let n = 0;
      if (head > .02) for (let k = 0; k < N; k++) {
        const s0 = Math.floor(tf / .007) * .007 - k * .007, tau = tf - s0; if (!leak(s0) || tau > 1.1) continue;
        const j = ((Math.round(s0 * 1000) * 2654435761) >>> 0) / 4294967296, j2 = ((Math.round(s0 * 1000) * 40503) % 1000) / 1000, v = (1.1 + 1.9 * Math.sqrt(head)) * (.9 + .2 * j);
        const vx = -.25 + .3 * (j2 - .5), vz = v, vy = -G9 * tau;
        v3.set(HOLE.x + vx * tau + (j2 - .5) * .03, HOLE.y + .5 * -G9 * tau * tau + (j - .5) * .02, HOLE.z + vz * tau); if (v3.y < BOT) continue;
        const r = (.0025 + .008 * j * j) * (tau < .12 ? 1.3 : 1), st = 1 + Math.hypot(vx, vy) * .18;
        q.setFromUnitVectors(X, new T.Vector3(vx, vy, vz).normalize()); sc.set(r * st, r, r); m4.compose(v3, q, sc); drops.setMatrixAt(n++, m4);
      }
      drops.count = n; drops.instanceMatrix.needsUpdate = true;
      // the unbroken part of the jet: a tube along the first 0.14 s of the arc
      if (open && head > .02) { const v = 1.1 + 1.9 * Math.sqrt(head), pts = []; for (let k = 0; k <= 10; k++) { const tau = .14 * k / 10; pts.push(new T.Vector3(HOLE.x - .25 * tau, HOLE.y - .5 * G9 * tau * tau, HOLE.z + v * tau)); }
        jet.geometry.dispose(); jet.geometry = new T.TubeGeometry(new T.CatmullRomCurve3(pts), 24, Math.min(.026, .008 + head * .016), 8); jet.visible = true; } else jet.visible = false;
      crack.visible = leak(t) || (patchAt != null && t < patchAt + .1);
      fixed.forEach((m) => { m.visible = sealed(t); });
      // the patch flies in from the lens side and slams on (bold spring: ~5% overshoot, settled in 12 frames)
      const pk = patchAt == null ? 0 : P.springAt(t, patchAt - .18, 'bold');
      patch.visible = patchAt != null && t > patchAt - .18; patch.position.set(lerp(-1.6, HOLE.x, pk), lerp(1.2, HOLE.y - .02, pk), lerp(3.4, HOLE.z, pk)); patch.scale.setScalar(lerp(1.7, 1, pk)); patch.rotation.z = (1 - pk) * .9;
      // the pour from the address bar, with rings on the surface
      const pouring = pour && t > pour[0] && t < pour[1], pk2 = pouring ? P.springAt(t, pour[0], 'fade') * (1 - P.tween(t, pour[1] - .4, .4, 'snap')) : 0;
      if (pk2 > .01) { const pts = []; for (let k = 0; k <= 16; k++) { const yy = lerp(TOP - BAR - .02, y0, k / 16); pts.push(new T.Vector3(.03 * Math.sin(yy * 9 + tf * 12), yy, .03 * Math.cos(yy * 7 + tf * 10))); }
        pourM.geometry.dispose(); pourM.geometry = new T.TubeGeometry(new T.CatmullRomCurve3(pts), 32, .045 * pk2, 8); pourM.visible = true;
        const u = (tf * 1.6) % 1; ring.visible = true; ring.position.set(0, y0 + .01, 0); ring.scale.setScalar(.06 + P.EASE.swing(u) * .55); ring.material.opacity = (1 - P.EASE.snap(u)) * pk2; } else { pourM.visible = false; ring.visible = false; }
    });

    if (camera) P.three.look(G, camera, { handheld: .02 });
    return { G, yTop };
  };
  // =====================================================================================================================================
  // ISOMETRIC MACHINES (owner, 14 Oct 2026). Method learned from studying isometric explainer skills (technique only; this code is our own):
  // THE OBJECT IS THE EXPLANATION. Show a service as one precise machine whose working IS the service (edge: a sorting machine that sends each parcel
  // down the nearest chute and drops the bad ones in a reject bin; security: a pin-tumbler lock; uptime: a dial gauge; social: a small press). Build it from
  // 40-60 small purposeful parts (base plate on feet, corner screws, rails with tick rulers, bushings, springs, a label plate), four-tone shading, no labels in
  // the drawing (captions carry the words). Every part is a pure function of film time.
  //   const I = P.iso(parent, { ox: 201, oy: 400, s: 1, az: 45, el: 30, line: '#0b0d10', light: true })
  //   I.box(spec)  I.cyl(spec)  I.coil(spec)  I.ticks(spec)  I.dot(spec)  I.path(spec)   spec = object or (t) => object; return null to hide a part
  //     box  { x, y, z, w, d, h, r = 0, c: '#hex', lw }          (x, y on the floor, z up; r rounds the plan corners)
  //     cyl  { x, y, z, r, h, c }                               (round sides shade as a gradient, never a staircase)
  //     coil { x, y, z, r, h, turns, c, lw }                    (a spring: back half behind, front half in front of what it wraps)
  //     ticks{ x, y, z, len, n, axis: 'x'|'y', major = 5, c }   (a ruler on a top face)
  //     dot  { x, y, z, r, c }                                  (screw heads, rivets, LEDs)
  //     path { pts: [[x,y,z]...], c, lw, close, fill }          (cables, belts, arrows built as geometry)
  //     every spec may carry `k` (depth bias) and `o` (opacity). Order: floor depth + 1.6 x the part's base height, so parts paint after what they rest on;
//     set z to where a part really sits (on a 12-high plate: z 12), and nudge with k only where two parts genuinely interlock
  //   I.P(x, y, z) -> [sx, sy] screen point (for placing captions or DOM next to a part)
  // =====================================================================================================================================
  const shade = (hex, f) => { const h = hex.replace('#', ''); const n = parseInt(h.length === 3 ? h.replace(/./g, '$&$&') : h, 16);
    const ch = (v) => Math.round(f >= 0 ? v + (255 - v) * f : v * (1 + f)); return `rgb(${ch((n >> 16) & 255)},${ch((n >> 8) & 255)},${ch(n & 255)})`; };
  P.iso = function (parent, { ox = 201, oy = 400, s = 1, az = 45, el = 30, line = '#0b0d10', light = true, lw = 1.1 } = {}) {
    P.use('mechanism', 'iso-machine');
    const NS = 'http://www.w3.org/2000/svg', A = az * Math.PI / 180, ca = Math.cos(A), sa = Math.sin(A), se = Math.sin(el * Math.PI / 180), ce = Math.cos(el * Math.PI / 180);
    const wrap = E.el('div', 'position:absolute;inset:0;pointer-events:none', parent);
    const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 402 715'); svg.setAttribute('width', '402'); svg.setAttribute('height', '715');
    svg.setAttribute('aria-hidden', 'true'); svg.style.cssText = 'position:absolute;inset:0;overflow:visible'; wrap.appendChild(svg);
    const defs = document.createElementNS(NS, 'defs'); svg.appendChild(defs); const g = document.createElementNS(NS, 'g'); svg.appendChild(g);
    const Pt = (x, y, z) => { const u = x * ca - y * sa, v = x * sa + y * ca; return [ox + u * s, oy + (v * se - z * ce) * s]; };
    const depthOf = (x, y, z) => x * sa + y * ca + z * .02;
    const f2 = (n) => n.toFixed(1), poly = (pts) => 'M' + pts.map((q) => f2(q[0]) + ' ' + f2(q[1])).join('L') + 'Z';
    // tones: top lightest, left-facing mid, right-facing dark, edges in `line`
    const tones = (c) => light ? { top: shade(c, .18), left: c, right: shade(c, -.24) } : { top: shade(c, .1), left: shade(c, -.12), right: shade(c, -.38) };
    // plan outline of a rounded rectangle, counter-clockwise, with outward normals
    const plan = (x, y, w, d, r, n = 6) => { r = Math.min(r, w / 2, d / 2); const out = [];
      const cs = [[x + w - r, y + r, -Math.PI / 2], [x + w - r, y + d - r, 0], [x + r, y + d - r, Math.PI / 2], [x + r, y + r, Math.PI]];
      cs.forEach(([cx, cy, a0]) => { for (let i = 0; i <= (r ? n : 0); i++) { const a = a0 + (Math.PI / 2) * (r ? i / n : .5); out.push([cx + r * Math.cos(a), cy + r * Math.sin(a), Math.cos(a), Math.sin(a)]); } });
      return out; };
    const circ = (x, y, r, n = 28) => Array.from({ length: n }, (_, i) => { const a = i / n * TAU; return [x + r * Math.cos(a), y + r * Math.sin(a), Math.cos(a), Math.sin(a)]; });
    let gid = 0; const items = [];
    const add = (kind, spec) => { const it = { kind, spec, id: 'iso' + (gid++) }; items.push(it); return it; };
    // an extruded outline: silhouette in the dark tone, camera-facing left run in the mid tone, the top face, crisp edges
    const extrude = (out, z, h, c, round, lwi, id) => {
      const T = tones(c), bot = out.map((q) => Pt(q[0], q[1], z)), top = out.map((q) => Pt(q[0], q[1], z + h)), n = out.length; let html = '';
      const all = bot.concat(top); const hull = (() => { const p = all.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
        const lo = [], up = []; p.forEach((q) => { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); });
        p.slice().reverse().forEach((q) => { while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }); return lo.slice(0, -1).concat(up.slice(0, -1)); })();
      if (round) {
        const xs = hull.map((q) => q[0]), x0 = Math.min(...xs), x1 = Math.max(...xs);
        html += `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${f2(x0)}" x2="${f2(x1)}" y1="0" y2="0"><stop offset="0" stop-color="${T.left}"/><stop offset=".35" stop-color="${T.top}"/><stop offset="1" stop-color="${T.right}"/></linearGradient>`;
        html += `<path d="${poly(hull)}" fill="url(#${id})" stroke="${line}" stroke-width="${lwi}" stroke-linejoin="round"/>`;
      } else {
        html += `<path d="${poly(hull)}" fill="${T.right}" stroke="${line}" stroke-width="${lwi}" stroke-linejoin="round"/>`;
        for (let i = 0; i < n; i++) { const a = out[i], b = out[(i + 1) % n], nx = (a[2] + b[2]) / 2, ny = (a[3] + b[3]) / 2;
          if (nx * sa + ny * ca > 0.02 && nx * ca - ny * sa < 0) html += `<path d="${poly([bot[i], bot[(i + 1) % n], top[(i + 1) % n], top[i]])}" fill="${T.left}" stroke="${T.left}" stroke-width=".6"/>`; }
        // the vertical crease where the left run meets the right run
        for (let i = 0; i < n; i++) { const a = out[i], fa = a[2] * sa + a[3] * ca > 0, sideA = a[2] * ca - a[3] * sa;
          const b = out[(i + 1) % n], sideB = b[2] * ca - b[3] * sa; if (fa && sideA < 0 && sideB >= 0) html += `<path d="M${f2(bot[(i + 1) % n][0])} ${f2(bot[(i + 1) % n][1])}L${f2(top[(i + 1) % n][0])} ${f2(top[(i + 1) % n][1])}" stroke="${line}" stroke-width="${lwi * .8}" stroke-opacity=".55"/>`; }
      }
      html += `<path d="${poly(top)}" fill="${T.top}" stroke="${line}" stroke-width="${lwi}" stroke-linejoin="round"/>`;
      return html; };
    const draw = {
      box: (q, it) => extrude(plan(q.x, q.y, q.w, q.d, q.r || 0), q.z || 0, q.h, q.c || '#9aa3ad', false, q.lw || lw, it.id),
      cyl: (q, it) => extrude(circ(q.x, q.y, q.r), q.z || 0, q.h, q.c || '#9aa3ad', true, q.lw || lw, it.id),
      dot: (q) => { const [a, b] = Pt(q.x, q.y, q.z || 0); return `<circle cx="${f2(a)}" cy="${f2(b)}" r="${q.r || 1.6}" fill="${q.c || line}"/>`; },
      path: (q) => `<path d="${'M' + q.pts.map((p3) => Pt(...p3).map(f2).join(' ')).join('L') + (q.close ? 'Z' : '')}" fill="${q.fill || 'none'}" stroke="${q.c || line}" stroke-width="${q.lw || lw}" stroke-linecap="round" stroke-linejoin="round"/>`,
      ticks: (q) => { let d = ''; for (let i = 0; i <= q.n; i++) { const f = i / q.n * q.len, L = i % (q.major || 5) === 0 ? 5 : 2.5;
        const a = q.axis === 'y' ? [q.x, q.y + f, q.z] : [q.x + f, q.y, q.z], b = q.axis === 'y' ? [q.x + L, q.y + f, q.z] : [q.x + f, q.y + L, q.z];
        d += `M${Pt(...a).map(f2).join(' ')}L${Pt(...b).map(f2).join(' ')}`; } return `<path d="${d}" stroke="${q.c || line}" stroke-width=".8" stroke-opacity=".75"/>`; },
    };
    // springs are split: the back half paints before the part it wraps, the front half after
    const coilHalf = (q, front) => { const N = Math.round((q.turns || 6) * 24); let d = '', on = false;
      for (let i = 0; i <= N; i++) { const a = i / 24 * TAU, x = q.x + q.r * Math.cos(a), y = q.y + q.r * Math.sin(a), z = (q.z || 0) + q.h * i / N;
        const isFront = Math.cos(a) * sa + Math.sin(a) * ca > 0, [sx, sy] = Pt(x, y, z);
        if (isFront === front) { d += (on ? 'L' : 'M') + f2(sx) + ' ' + f2(sy); on = true; } else on = false; }
      return `<path d="${d}" fill="none" stroke="${q.c || line}" stroke-width="${q.lw || 1.4}" stroke-linecap="round" stroke-opacity="${front ? 1 : .55}"/>`; };
    const I = { svg, P: Pt, items, depthOf,
      box: (s2) => add('box', s2), cyl: (s2) => add('cyl', s2), dot: (s2) => add('dot', s2), path: (s2) => add('path', s2), ticks: (s2) => add('ticks', s2),
      coil: (s2) => { add('coilB', s2); return add('coilF', s2); } };
    P.on((t) => {
      const list = [];
      items.forEach((it) => { const q = typeof it.spec === 'function' ? it.spec(t) : it.spec; if (!q) return;
        const cx = q.x + (q.w || 0) / 2, cy = q.y + (q.d || 0) / 2, pts = q.pts ? q.pts[0] : null;
        const dz = it.kind === 'coilB' ? -40 : it.kind === 'coilF' ? 40 : 0;
        const key = (pts ? depthOf(...pts) : depthOf(cx, cy, 0)) + (pts ? pts[2] : (q.z || 0)) * 1.6 + dz + (q.k || 0);   // a part resting higher paints after what it rests on
        list.push([key, it, q]); });
      list.sort((a, b) => a[0] - b[0]);
      let defsH = '', html = '';
      list.forEach(([, it, q]) => { let h = it.kind === 'coilB' ? coilHalf(q, false) : it.kind === 'coilF' ? coilHalf(q, true) : draw[it.kind](q, it);
        if (h.startsWith('<linearGradient')) { const e = h.indexOf('</linearGradient>') + 17; defsH += h.slice(0, e); h = h.slice(e); }
        html += q.o != null && q.o < 1 ? `<g opacity="${q.o.toFixed(3)}">${h}</g>` : h; });
      defs.innerHTML = defsH; g.innerHTML = html;
    });
    return I;
  };
  // =====================================================================================================================================
  // SYSTEM MAP / GAME LOOK (owner, 15 Oct 2026: "show how it works", "the visual appearance of a game"). One canvas, one camera, world coordinates.
  // Principles: design/references/2026-10-15-hyperframes-explainer.md (one continuous camera, reveal on the voice, smooth long-tail easing, deterministic).
  //   const W = P.sys(parent, { bg })                 -> { ctx, cam, draw(fn) }; cam = { x, y, s } (world point at the frame centre, scale); fn(ctx, t, S) draws in world units
  //   W.grid(t, { color, alpha })                     neon perspective floor + dotted map field (screen space, parallax with the camera)
  //   W.cable(pts, t, { color, alpha, flow, width })  a glowing cable along a cubic path pts=[p0,p1,p2,p3]; flow = dash speed (packets moving)
  //   W.comet(pts, u, { color, r, trail })            a packet at u (0..1) with a glowing trail
  //   W.chip(x, y, { w, h, color, icon, label, k })   a glossy component (icon: phone | server | dns | edge | shield); k = appear 0..1
  //   W.burst(x, y, k, { color, n, seed })            a particle burst at progress k (bots hitting a shield)
  //   W.at(pts, u) -> [x, y]                          a point on the path
//   premium (design/brand/premium.md): W.globe(t,{x,y,r,spin,alpha}) dotted turning globe (depth layer) · W.spot(x,y,r) soft light · W.glassNode(x,y,{r,k,coreOn,label,sub}) · W.beam(pts,k) thin light line · W.pulse(pts,u) light pulse with a tail
  // =====================================================================================================================================
  P.sys = function (parent, { bg = '#060A14', dpr = 2 } = {}) {
    P.use('mechanism', 'system-map');
    const cv = E.el('canvas', 'position:absolute;inset:0;width:402px;height:715px', parent); cv.width = 402 * dpr; cv.height = 715 * dpr;
    const ctx = cv.getContext('2d'), cam = { x: 201, y: 357, s: 1, sx: 0, sy: 0 }, fns = [];
    const toS = (x, y) => [(x - cam.x) * cam.s + 201 + cam.sx, (y - cam.y) * cam.s + 357 + cam.sy];
    const at = (p, u) => { const v = 1 - u; return [0, 1].map((i) => v * v * v * p[0][i] + 3 * v * v * u * p[1][i] + 3 * v * u * u * p[2][i] + u * u * u * p[3][i]); };
    const glow = (c, b) => { ctx.shadowColor = c; ctx.shadowBlur = b; };
    let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    const stars = Array.from({ length: 90 }, () => [rnd() * 900 - 250, rnd() * 1300 - 300, .3 + rnd() * 1.2, rnd()]);
    const W = { ctx, cam, at, toS, fade: 1,                                  // fade: multiplies every element's opacity (selective focus)
      draw(fn) { fns.push(fn); },
      grid(t, { color = '#2F6BFF', alpha = 1 } = {}) {
        ctx.save(); ctx.globalAlpha = alpha;
        stars.forEach(([x, y, r, a]) => { const [sx, sy] = [(x - cam.x * .35) + 201, (y - cam.y * .35) + 120]; ctx.fillStyle = `rgba(160,190,255,${(.15 + .35 * a).toFixed(2)})`; ctx.fillRect(sx, sy, r, r); });
        const hz = 430 + cam.sy * .2, vx = 201 + (201 - cam.x) * .15;            // horizon and vanishing point drift a little with the camera (parallax)
        const g = ctx.createLinearGradient(0, hz, 0, 715); g.addColorStop(0, 'rgba(47,107,255,0)'); g.addColorStop(1, 'rgba(47,107,255,.10)'); ctx.fillStyle = g; ctx.fillRect(0, hz, 402, 715 - hz);
        ctx.strokeStyle = color; ctx.lineWidth = 1;
        for (let i = 0; i < 14; i++) { const f = ((i + (t * .6) % 1) / 14), y = hz + (715 - hz) * f * f; ctx.globalAlpha = alpha * (.08 + .5 * f * f); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(402, y); ctx.stroke(); }
        for (let i = -10; i <= 10; i++) { ctx.globalAlpha = alpha * .22; ctx.beginPath(); ctx.moveTo(vx + i * 6, hz); ctx.lineTo(vx + i * 70, 715); ctx.stroke(); }
        ctx.restore();
      },
      cable(pts, t, { color = '#2F6BFF', alpha = 1, flow = 60, width = 3, dash = [3, 11] } = {}) {
        ctx.save(); ctx.globalAlpha = alpha * W.fade; const q = pts.map(([x, y]) => toS(x, y)), lw = width * Math.max(.6, cam.s);
        ctx.beginPath(); ctx.moveTo(...q[0]); ctx.bezierCurveTo(...q[1], ...q[2], ...q[3]);
        ctx.strokeStyle = 'rgba(20,30,60,.9)'; ctx.lineWidth = lw + 4; ctx.lineCap = 'round'; ctx.stroke();
        glow(color, 10); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.setLineDash(dash.map((d) => d * cam.s)); ctx.lineDashOffset = -t * flow * cam.s; ctx.stroke();
        ctx.restore();
      },
      comet([p0, p1, p2, p3], u, { color = '#C6F432', r = 6, trail = .06 } = {}) {
        ctx.save(); glow(color, 16);
        for (let i = 8; i >= 0; i--) { const uu = u - trail * i / 8; if (uu < 0 || uu > 1) continue; const [x, y] = toS(...at([p0, p1, p2, p3], uu)); ctx.globalAlpha = (1 - i / 9) * (i ? .5 : 1) * W.fade; ctx.fillStyle = i ? color : '#ffffff';
          ctx.beginPath(); ctx.arc(x, y, (i ? r * (1 - i / 10) : r * .55) * cam.s, 0, 6.283); ctx.fill(); if (!i) { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r * cam.s * .9, 0, 6.283); ctx.globalAlpha = .55 * W.fade; ctx.fill(); } }
        ctx.restore();
      },
      chip(x, y, { w = 64, h = 64, color = '#2F6BFF', icon = 'server', label = '', sub = '', k = 1, hot = 0 } = {}) {
        if (k <= 0) return; const [sx, sy] = toS(x, y), s = cam.s * (.6 + .4 * k), W2 = w * s / 2, H2 = h * s / 2;
        ctx.save(); ctx.globalAlpha = Math.min(1, k * 1.4) * W.fade;
        glow(color, 18 + 14 * hot); const g = ctx.createLinearGradient(sx, sy - H2, sx, sy + H2); g.addColorStop(0, '#24345E'); g.addColorStop(1, '#0C1430');
        ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(sx - W2, sy - H2, W2 * 2, H2 * 2, 14 * s); ctx.fill();
        ctx.shadowBlur = 0; ctx.strokeStyle = color; ctx.lineWidth = 2 * s; ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.beginPath(); ctx.roundRect(sx - W2 + 3 * s, sy - H2 + 3 * s, W2 * 2 - 6 * s, H2 * .7, 11 * s); ctx.fill();   // glossy top
        ctx.strokeStyle = '#EAF1FF'; ctx.fillStyle = '#EAF1FF'; ctx.lineWidth = 2.4 * s; ctx.lineJoin = 'round'; glow(color, 8);
        const u = s * Math.min(w, h) / 64;
        if (icon === 'phone') { ctx.beginPath(); ctx.roundRect(sx - 11 * u, sy - 19 * u, 22 * u, 38 * u, 5 * u); ctx.stroke(); ctx.fillRect(sx - 4 * u, sy + 13 * u, 8 * u, 2 * u); }
        if (icon === 'server') for (let i = -1; i <= 1; i++) { ctx.strokeRect(sx - 17 * u, sy + i * 11 * u - 4.5 * u, 34 * u, 9 * u); ctx.fillStyle = i ? '#C6F432' : '#FF5A4F'; ctx.fillRect(sx + 10 * u, sy + i * 11 * u - 1.5 * u, 3 * u, 3 * u); ctx.fillStyle = '#EAF1FF'; }
        if (icon === 'dns') { ctx.beginPath(); ctx.arc(sx, sy, 15 * u, 0, 6.283); ctx.moveTo(sx - 15 * u, sy); ctx.lineTo(sx + 15 * u, sy); ctx.ellipse(sx, sy, 6 * u, 15 * u, 0, 0, 6.283); ctx.stroke(); }
        if (icon === 'edge') { ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283 + .52; ctx[i ? 'lineTo' : 'moveTo'](sx + 16 * u * Math.cos(a), sy + 16 * u * Math.sin(a)); } ctx.closePath(); ctx.stroke(); ctx.beginPath(); ctx.arc(sx, sy, 5 * u, 0, 6.283); ctx.fill(); }
        if (icon === 'shield') { ctx.beginPath(); ctx.moveTo(sx, sy - 17 * u); ctx.lineTo(sx + 14 * u, sy - 11 * u); ctx.lineTo(sx + 13 * u, sy + 4 * u); ctx.quadraticCurveTo(sx + 8 * u, sy + 14 * u, sx, sy + 18 * u); ctx.quadraticCurveTo(sx - 8 * u, sy + 14 * u, sx - 13 * u, sy + 4 * u); ctx.lineTo(sx - 14 * u, sy - 11 * u); ctx.closePath(); ctx.stroke(); }
        ctx.shadowBlur = 0;
        if (label) { ctx.font = `800 ${Math.round(12 * Math.max(.8, s))}px Archivo, sans-serif`; ctx.textAlign = 'center'; ctx.fillStyle = '#F3F5F8'; ctx.fillText(label, sx, sy + H2 + 16 * Math.max(.8, s)); }
        if (sub) { ctx.font = `600 ${Math.round(10 * Math.max(.8, s))}px "Geist Mono", monospace`; ctx.fillStyle = '#8A93A6'; ctx.fillText(sub, sx, sy + H2 + 29 * Math.max(.8, s)); }
        ctx.restore();
      },
      // ---- premium helpers (design/brand/premium.md): glass, light, restraint ----
      spot(x, y, r, { color = 'rgba(80,120,255,.22)' } = {}) { const [sx, sy] = toS(x, y), R2 = r * cam.s, g = ctx.createRadialGradient(sx, sy, 0, sx, sy, R2);
        g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.save(); ctx.globalAlpha = W.fade; ctx.fillStyle = g; ctx.fillRect(sx - R2, sy - R2, R2 * 2, R2 * 2); ctx.restore(); },
      glassNode(x, y, { r = 26, k = 1, core = '#C6F432', coreOn = 0, label = '', sub = '' } = {}) {
        if (k <= 0) return; const [sx, sy] = toS(x, y), R2 = r * cam.s * (.85 + .15 * k);
        ctx.save(); ctx.globalAlpha = Math.min(1, k) * W.fade;
        const halo = ctx.createRadialGradient(sx, sy, R2 * .6, sx, sy, R2 * 2.4); halo.addColorStop(0, 'rgba(110,150,255,.20)'); halo.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = halo; ctx.fillRect(sx - R2 * 2.4, sy - R2 * 2.4, R2 * 4.8, R2 * 4.8);
        const body = ctx.createLinearGradient(sx - R2, sy - R2, sx + R2, sy + R2); body.addColorStop(0, 'rgba(200,220,255,.30)'); body.addColorStop(.5, 'rgba(60,90,170,.18)'); body.addColorStop(1, 'rgba(20,30,70,.45)');
        ctx.fillStyle = body; ctx.beginPath(); ctx.arc(sx, sy, R2, 0, 6.283); ctx.fill();
        ctx.strokeStyle = 'rgba(210,225,255,.55)'; ctx.lineWidth = 1.2 * cam.s; ctx.stroke();
        ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 2 * cam.s; ctx.beginPath(); ctx.arc(sx, sy, R2 * .82, 3.6, 4.6); ctx.stroke();   // specular edge
        if (coreOn > 0) { ctx.shadowColor = core; ctx.shadowBlur = 18 * coreOn; ctx.fillStyle = core; ctx.globalAlpha = Math.min(1, k) * W.fade * coreOn; ctx.beginPath(); ctx.arc(sx, sy, R2 * .28, 0, 6.283); ctx.fill(); ctx.shadowBlur = 0; }
        ctx.globalAlpha = Math.min(1, k) * W.fade; ctx.textAlign = 'center';
        if (label) { ctx.font = `700 ${Math.round(13 * Math.max(.85, cam.s))}px Archivo, sans-serif`; ctx.fillStyle = '#F3F5F8'; ctx.fillText(label, sx, sy + R2 + 22 * Math.max(.85, cam.s)); }
        if (sub) { ctx.font = `500 ${Math.round(10.5 * Math.max(.85, cam.s))}px "Geist Mono", monospace`; ctx.fillStyle = 'rgba(160,172,196,.9)'; ctx.fillText(sub, sx, sy + R2 + 37 * Math.max(.85, cam.s)); }
        ctx.restore(); },
      beam(pts, k, { color = 'rgba(170,195,255,.55)', width = 1.4, u0 = 0 } = {}) {      // a thin light line drawn from u0 to k along the path
        if (k <= 0) return; ctx.save(); ctx.globalAlpha = W.fade; ctx.strokeStyle = color; ctx.lineWidth = width * Math.max(.8, cam.s); ctx.lineCap = 'round';
        ctx.beginPath(); for (let i = 0; i <= 60; i++) { const u = u0 + (k - u0) * i / 60, [x, y] = toS(...at(pts, u)); ctx[i ? 'lineTo' : 'moveTo'](x, y); } ctx.stroke(); ctx.restore(); },
      pulse(pts, u, { color = '#FFFFFF', r = 3.2, trail = .18 } = {}) {                  // a soft light pulse with a long, fading tail
        if (u < 0 || u > 1) return; ctx.save(); ctx.lineCap = 'round';
        for (let i = 0; i < 24; i++) { const a = u - trail * i / 24, b = u - trail * (i + 1) / 24; if (b < 0) break; const [x1, y1] = toS(...at(pts, a)), [x2, y2] = toS(...at(pts, b));
          ctx.globalAlpha = (1 - i / 24) * .8 * W.fade; ctx.strokeStyle = color; ctx.lineWidth = r * cam.s * (1 - i / 30); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
        const [x, y] = toS(...at(pts, u)); ctx.globalAlpha = W.fade; ctx.shadowColor = color; ctx.shadowBlur = 14; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, r * cam.s * .8, 0, 6.283); ctx.fill(); ctx.restore(); },
      // a dotted globe (generative: Fibonacci points, a smooth noise mask for land), slowly turning; world space, so the camera moves over it.
      // The depth layer of a premium frame: rich detail at low contrast behind the subject (premium.md "three layers").
      globe(t, { x = 201, y = 380, r = 230, spin = .05, alpha = 1, color = '150,175,255', hot = null } = {}) {
        if (!W._gp) { const N = 900, g = 2.399963; W._gp = [];
          for (let i = 0; i < N; i++) { const yy = 1 - 2 * (i + .5) / N, rr = Math.sqrt(1 - yy * yy), th = g * i, px = Math.cos(th) * rr, pz = Math.sin(th) * rr;
            const lat = Math.asin(yy), lon = Math.atan2(pz, px), land = Math.sin(lon * 2.1 + .6) * Math.cos(lat * 3.1) + .6 * Math.sin(lon * 4.7 - lat * 2.3) + .35 * Math.cos(lon * 7.9 + lat * 5.2);
            W._gp.push([lat, lon, land > .35 ? 1 : land > -.1 ? .42 : .16]); } }
        const [sx, sy] = toS(x, y), R = r * cam.s, rot = t * spin; ctx.save();
        const halo = ctx.createRadialGradient(sx, sy, R * .7, sx, sy, R * 1.25); halo.addColorStop(0, 'rgba(60,100,230,0)'); halo.addColorStop(.8, `rgba(${color},${(.10 * alpha).toFixed(3)})`); halo.addColorStop(1, 'rgba(60,100,230,0)');
        ctx.globalAlpha = W.fade; ctx.fillStyle = halo; ctx.fillRect(sx - R * 1.3, sy - R * 1.3, R * 2.6, R * 2.6);
        for (const [lat, lon, w] of W._gp) { const l = lon + rot, cx = Math.cos(lat) * Math.cos(l), cz = Math.cos(lat) * Math.sin(l), cy = Math.sin(lat); if (cz < -.15) continue;
          const d = (cz + .15) / 1.15; ctx.globalAlpha = W.fade * alpha * w * (.15 + .85 * d); ctx.fillStyle = `rgb(${color})`;
          const q = (1 + 1.1 * w) * Math.max(.7, cam.s) * (.6 + .4 * d); ctx.fillRect(sx + cx * R - q / 2, sy - cy * R - q / 2, q, q); }
        ctx.restore(); },
      burst(x, y, k, { color = '#FF5A4F', n = 14, seed: sd = 1 } = {}) {
        if (k <= 0 || k >= 1) return; const [sx, sy] = toS(x, y); ctx.save(); glow(color, 12);
        for (let i = 0; i < n; i++) { const a = (i / n) * 6.283 + sd * 1.7, d = (8 + 34 * P.EASE.glide(k)) * (0.6 + ((i * 37 + sd * 11) % 10) / 20) * cam.s;
          ctx.globalAlpha = (1 - k) * W.fade; ctx.fillStyle = i % 3 ? color : '#FFE0A3'; ctx.fillRect(sx + Math.cos(a) * d - 2, sy + Math.sin(a) * d - 2, 4 * cam.s, 4 * cam.s); }
        ctx.restore();
      },
    };
    P.on((t) => { W.fade = 1; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalAlpha = 1; ctx.fillStyle = bg; ctx.fillRect(0, 0, 402, 715); fns.forEach((f) => f(ctx, t, W)); });
    return W;
  };
  // =====================================================================================================================================
  // THEME B soft3d (17 Oct 2026, new trick; reference R1 in design/brand/references.md): P.clay, a soft-3D clay character drawn from shading alone
  // (base gradient, per-mood tint layers, top-left gloss, inner shade, rim light, contact shadow, coloured halo), with expressions, colour that
  // follows the mood, squash-and-stretch physics and depth particles. Pure function of film time.
  //   const c = P.clay(parent, { x, y, size, moods: [[t, 'happy'], [2.6, 'scared'], ...], hops: [{ t, h, dur }], drop: { t, h } })
  //   c.place(keys)  keys = [[t, { x, y, s }], ...] moves/scales the character (swing-eased between keys)
  //   c.fx(kind, at, out, { n, spread })  depth particles round it: hearts | sparkles | zzz | sweat | notes
  //   c.mood(t) -> current mood name; c.colour(t) -> current halo colour (for the story's own light)
  // moods: happy, scared, worried, determined, wink, love, proud, sleepy. A mood change is itself a beat: tint and halo cross-fade, the face swaps
  // and the body pops (a bold-spring squash), so every change reads as a cut.
  P.CLAY_MOODS = {
    happy:      { tint: ['#ffe2d2', '#ffb08a', '#ff9466', '#e0603d', '#a8391f'], halo: '#ff9466' },
    scared:     { tint: ['#e8f0ff', '#a9bde6', '#7387b8', '#45537e', '#262d4a'], halo: '#ff4d6a' },
    worried:    { tint: ['#eef0e2', '#c3c9ab', '#949b7d', '#646a52', '#3b3f30'], halo: '#8d86a8' },
    determined: { tint: ['#e8fff6', '#9af7d6', '#3fd9a3', '#1f9c74', '#0d5c44'], halo: '#4df0b8' },
    wink:       { tint: ['#f1ecff', '#c9b8ff', '#9b7dff', '#6a4ad6', '#3c2690'], halo: '#a68bff' },
    love:       { tint: ['#fff0f4', '#ffc0d2', '#ff7fa6', '#e04a7c', '#9c2452'], halo: '#ff6fa8' },
    proud:      { tint: ['#fff6dc', '#ffe08f', '#ffc04d', '#e08a1a', '#9c5508'], halo: '#ffc56b' },
    sleepy:     { tint: ['#eef2ff', '#bcc8f2', '#8a9ad8', '#5a68a8', '#323a6a'], halo: '#7f8fe0' },
  };
  const FACES = {   // viewBox 0 0 100 60; eyes near (30,24) and (70,24), mouth near (50,42). The .ey group blinks.
    happy: '<g class="ey"><path d="M22 24q8-10 16 0M62 24q8-10 16 0" stroke="#2a0f14" stroke-width="5" stroke-linecap="round" fill="none"/></g><path d="M38 37q12 14 24 0z" fill="#2a0f14"/><path d="M44 43q6 4 12 0" fill="#ff7a8e"/>',
    scared: '<path d="M20 15l14-6M80 15l-14-6" stroke="#1a1230" stroke-width="4" stroke-linecap="round"/><g class="ey"><circle cx="30" cy="25" r="9" fill="#fff"/><circle cx="70" cy="25" r="9" fill="#fff"/><circle cx="31" cy="26" r="3.6" fill="#1a1230"/><circle cx="69" cy="26" r="3.6" fill="#1a1230"/></g><path d="M38 46q4-5 8 0t8 0t8 0" stroke="#1a1230" stroke-width="4" stroke-linecap="round" fill="none"/>',
    worried: '<path d="M21 16l13-4M79 16l-13-4" stroke="#262a1c" stroke-width="4" stroke-linecap="round"/><g class="ey"><ellipse cx="30" cy="26" rx="5" ry="6" fill="#262a1c"/><ellipse cx="70" cy="26" rx="5" ry="6" fill="#262a1c"/><circle cx="31.5" cy="23.5" r="1.8" fill="#fff"/><circle cx="71.5" cy="23.5" r="1.8" fill="#fff"/></g><path d="M40 47q10-8 20 0" stroke="#262a1c" stroke-width="4.5" stroke-linecap="round" fill="none"/>',
    determined: '<path d="M19 13l15 6M81 13l-15 6" stroke="#06281d" stroke-width="5" stroke-linecap="round"/><g class="ey"><ellipse cx="30" cy="27" rx="5.5" ry="6.5" fill="#06281d"/><ellipse cx="70" cy="27" rx="5.5" ry="6.5" fill="#06281d"/><circle cx="32" cy="24.5" r="2" fill="#fff"/><circle cx="72" cy="24.5" r="2" fill="#fff"/></g><path d="M38 42q12 6 24 0" stroke="#06281d" stroke-width="5" stroke-linecap="round" fill="none"/>',
    wink: '<g class="ey"><ellipse cx="30" cy="24" rx="6" ry="8" fill="#20123f"/><circle cx="32" cy="21" r="2.4" fill="#fff"/></g><path d="M62 25q8-7 16 0" stroke="#20123f" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M38 38q12 10 24 0" stroke="#20123f" stroke-width="5" stroke-linecap="round" fill="none"/>',
    love: '<g class="ey"><path d="M30 18c-6-6-14 0-8 7l8 7 8-7c6-7-2-13-8-7zM70 18c-6-6-14 0-8 7l8 7 8-7c6-7-2-13-8-7z" fill="#ff2d62"/><path d="M25 21q2-2 4-1M65 21q2-2 4-1" stroke="#fff" stroke-width="1.6" stroke-linecap="round" fill="none"/></g><path d="M42 42q8 7 16 0" stroke="#4a0c22" stroke-width="4.5" stroke-linecap="round" fill="none"/>',
    proud: '<g class="ey"><path d="M22 24q8-10 16 0M62 24q8-10 16 0" stroke="#3a2306" stroke-width="5" stroke-linecap="round" fill="none"/></g><path d="M34 36q16 18 32 0z" fill="#3a2306"/><path d="M42 44q8 5 16 0" fill="#ff7a5e"/>',
    sleepy: '<g class="ey"><path d="M20 27q10 6 20 0M60 27q10 6 20 0" stroke="#1d2348" stroke-width="5" stroke-linecap="round" fill="none"/></g><ellipse cx="50" cy="44" rx="5" ry="4" fill="#1d2348"/>',
  };
  const FX = {
    hearts: (c) => `<svg viewBox="0 0 24 22" width="100%" height="100%"><path d="M12 21C5 15 1 11 1 6.5A5.5 5.5 0 0 1 12 4a5.5 5.5 0 0 1 11 2.5C23 11 19 15 12 21z" fill="${c || '#ff4d84'}"/><path d="M6 6q2-2 4-1" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/></svg>`,
    sparkles: (c) => `<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12z" fill="${c || '#ffe08f'}"/></svg>`,
    zzz: (c) => `<svg viewBox="0 0 24 24" width="100%" height="100%"><text x="2" y="20" font-size="22" font-weight="800" font-family="Archivo,sans-serif" fill="${c || '#cfd8ff'}">z</text></svg>`,
    sweat: (c) => `<svg viewBox="0 0 16 22" width="100%" height="100%"><path d="M8 0C11 7 15 11 15 15a7 7 0 0 1-14 0C1 11 5 7 8 0z" fill="${c || '#9fd8ff'}"/><path d="M5 14q0 3 3 4" stroke="#fff" stroke-width="1.5" fill="none" opacity=".8"/></svg>`,
    notes: (c) => `<svg viewBox="0 0 20 24" width="100%" height="100%"><path d="M7 3l12-3v15a3.5 3.5 0 1 1-2-3.2V5L9 7v11a3.5 3.5 0 1 1-2-3.2z" fill="${c || '#c9b8ff'}"/></svg>`,
  };
  P.clay = function (parent, { x = 201, y = 380, size = 250, moods = [[0, 'happy']], hops = [], drop = null, blinks = null, palette = P.CLAY_MOODS } = {}) {
    P.use('character', 'clay-mascot');
    const W = size, H = size * .92, root = E.el('div', `position:absolute;left:0;top:0;width:${W}px;height:${H}px;margin:${-H}px 0 0 ${-W / 2}px;transform-origin:50% 100%`, parent);
    // behind: halo (one layer per mood, cross-faded) and the floor light + contact shadow
    const haloBox = E.el('div', `position:absolute;left:${-W * .6}px;top:${-H * .7}px;width:${W * 2.2}px;height:${W * 2.2}px;pointer-events:none`, root);
    const names = Object.keys(palette);
    const halos = Object.fromEntries(names.map((n) => [n, E.el('div', `position:absolute;inset:0;border-radius:50%;opacity:0;background:radial-gradient(closest-side,${hexA(palette[n].halo, .5)},${hexA(palette[n].halo, .14)} 50%,${hexA(palette[n].halo, 0)})`, haloBox)]));
    const pool = E.el('div', `position:absolute;left:${-W * .25}px;right:${-W * .25}px;bottom:${-H * .2}px;height:${H * .4}px;border-radius:50%;opacity:0;pointer-events:none`, root);
    const shadow = E.el('div', `position:absolute;left:12%;right:12%;bottom:${-H * .06}px;height:${H * .13}px;border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.8),rgba(0,0,0,0));transform-origin:50% 50%`, root);
    const fxBack = E.el('div', 'position:absolute;inset:0;pointer-events:none', root);
    const body = E.el('div', 'position:absolute;inset:0;transform-origin:50% 100%', root);
    const ear = (side) => {
      const e = E.el('div', `position:absolute;top:-4%;${side}:7%;width:30%;height:40%;border-radius:50% 50% 45% 45%;overflow:hidden;transform-origin:50% 90%;box-shadow:inset -${W * .025}px -${W * .035}px ${W * .06}px rgba(40,10,10,.4)`, body);
      return { e, layers: Object.fromEntries(names.map((n) => { const c = palette[n].tint; return [n, E.el('div', `position:absolute;inset:0;opacity:0;background:radial-gradient(circle at 40% 30%,${c[1]},${c[2]} 55%,${c[3]})`, e)]; })) };
    };
    const ears = [ear('left'), ear('right')];
    const blob = E.el('div', `position:absolute;inset:8% 0 0;border-radius:50% 50% 44% 44%/58% 58% 42% 42%;overflow:hidden;box-shadow:0 ${W * .1}px ${W * .22}px -${W * .1}px rgba(0,0,0,.6)`, body);
    const tints = Object.fromEntries(names.map((n) => { const c = palette[n].tint; return [n, E.el('div', `position:absolute;inset:0;opacity:0;background:radial-gradient(circle at 32% 26%,${c[0]} 0,${c[1]} 22%,${c[2]} 48%,${c[3]} 78%,${c[4]} 100%)`, blob)]; }));
    // shading over the tint: inner shade bottom-right, subsurface warmth, rim light, gloss
    E.el('div', `position:absolute;inset:0;border-radius:inherit;box-shadow:inset -${W * .07}px -${W * .1}px ${W * .16}px rgba(30,8,20,.42),inset ${W * .05}px ${W * .06}px ${W * .12}px rgba(255,255,255,.26)`, blob);
    const rim = E.el('div', `position:absolute;inset:0;border-radius:inherit;background:radial-gradient(120% 90% at 85% 95%,rgba(255,255,255,0) 60%,rgba(255,255,255,.35) 72%,rgba(255,255,255,0) 80%);mix-blend-mode:screen`, blob);
    E.el('div', 'position:absolute;left:19%;top:12%;width:27%;height:17%;border-radius:50%;transform:rotate(-24deg);background:radial-gradient(closest-side,rgba(255,255,255,.9),rgba(255,255,255,0))', blob);
    E.el('div', 'position:absolute;left:58%;top:16%;width:7%;height:5%;border-radius:50%;background:rgba(255,255,255,.55);filter:blur(1px)', blob);
    const cheeks = E.el('div', 'position:absolute;inset:0', body, `<i style="position:absolute;left:12%;top:58%;width:15%;height:9%;border-radius:50%;background:radial-gradient(closest-side,rgba(255,80,120,.65),rgba(255,80,120,0))"></i><i style="position:absolute;right:12%;top:58%;width:15%;height:9%;border-radius:50%;background:radial-gradient(closest-side,rgba(255,80,120,.65),rgba(255,80,120,0))"></i>`);
    const faceBox = E.el('div', 'position:absolute;left:18%;top:36%;width:64%;height:42%', body);
    const faces = Object.fromEntries(Object.keys(FACES).map((n) => { const d = E.el('div', 'position:absolute;inset:0;opacity:0;transform-origin:50% 60%', faceBox, `<svg viewBox="0 0 100 60" width="100%" height="100%" style="overflow:visible">${FACES[n]}</svg>`); return [n, { d, ey: d.querySelector('.ey') }]; }));
    const fxFront = E.el('div', 'position:absolute;inset:0;pointer-events:none', root);
    const M = moods.slice().sort((a, b) => a[0] - b[0]);
    const moodAt = (t) => { let i = 0; while (i < M.length - 1 && t >= M[i + 1][0]) i++; return i; };
    let place = [[0, { x, y, s: 1 }]];
    const posAt = (t) => { const K = place; if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) { const [t0, a] = K[i], [t1, b] = K[i + 1]; if (t <= t1) { const k = P.EASE.swing(clamp((t - t0) / Math.max(.01, t1 - t0))); return { x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), s: lerp(a.s, b.s, k) }; } } return K[K.length - 1][1]; };
    const parts = [];
    // a jump: anticipation squash, stretch in the air (parabola), landing squash on the bold spring
    const hopAt = (t) => {
      let lift = 0, sx = 1, sy = 1;
      for (const h of hops) { const d = h.dur || .7, u = (t - h.t) / d;
        if (t > h.t - .14 && t < h.t) { const a = Math.sin(Math.PI * (t - h.t + .14) / .14) * .5 + .5 * clamp((t - h.t + .14) / .07); sx *= 1 + .12 * a; sy *= 1 - .12 * a; }
        if (u >= 0 && u <= 1) { lift += h.h * 4 * u * (1 - u); const st = .14 * (1 - Math.abs(2 * u - 1)); sx *= 1 - st * .6; sy *= 1 + st; }
        if (u > 1 && u < 2.2) { const k = P.spring(t - h.t - d, P.SPRING.bouncy); const sq = (1 - k) * .3; sx *= 1 + sq; sy *= 1 - sq; } }
      if (drop) { const d = drop.dur || .55, u = (t - drop.t) / d;
        if (u < 1) { lift += drop.h * (1 - u * u); sx *= .88; sy *= 1.16; }
        else if (u < 4) { const k = P.spring(t - drop.t - d, P.SPRING.bouncy), sq = (1 - k) * .42; sx *= 1 + sq; sy *= 1 - sq; } }
      return { lift, sx, sy };
    };
    const bl = blinks || Array.from({ length: 30 }, (_, i) => 1.1 + i * 1.9 + (i % 3) * .4);
    P.on((t) => {
      const i = moodAt(t), cur = M[i][1], prev = i > 0 ? M[i - 1][1] : cur, kx = i > 0 ? P.springAt(t, M[i][0], 'fade') : 1;
      names.forEach((n) => { const w = (n === cur ? kx : 0) + (n === prev && n !== cur ? 1 - kx : 0); tints[n].style.opacity = w.toFixed(3); halos[n].style.opacity = w.toFixed(3); ears.forEach((e) => { e.layers[n].style.opacity = w.toFixed(3); }); });
      const fk = i > 0 ? clamp((t - M[i][0]) / .1) : 1;
      Object.keys(faces).forEach((n) => { faces[n].d.style.opacity = (n === cur ? fk : n === prev && n !== cur ? 1 - fk : 0).toFixed(3); });
      const blink = bl.some((b) => t > b && t < b + .14) ? .12 : 1; const ey = faces[cur].ey; if (ey) ey.setAttribute('transform', `translate(0 ${(24 * (1 - blink)).toFixed(1)}) scale(1 ${blink})`);
      cheeks.style.opacity = ['happy', 'love', 'wink', 'proud'].includes(cur) ? kx.toFixed(3) : (1 - kx).toFixed(3) * (['happy', 'love', 'wink', 'proud'].includes(prev) ? 1 : 0);
      // the pop on every mood change + breathing + the hops
      const pk = i > 0 ? P.spring(t - M[i][0], P.SPRING.bouncy) : 1, pop = (1 - pk) * .22;
      const br = .022 * Math.sin(t * 2.6), { lift, sx, sy } = hopAt(t), shake = cur === 'scared' ? Math.sin(t * 46) * 2.2 : cur === 'worried' ? Math.sin(t * 3) * 3 : 0;
      body.style.transform = `translate(${shake.toFixed(2)}px,${(-lift).toFixed(1)}px) scale(${(sx * (1 + pop * .8) * (1 + br)).toFixed(4)},${(sy * (1 - pop) * (1 - br)).toFixed(4)})`;
      ears.forEach((e, j) => { const s = j ? 1 : -1, droop = ['worried', 'sleepy', 'scared'].includes(cur) ? 26 : 0; e.e.style.transform = `rotate(${(s * (18 + droop * kx + 6 * Math.sin(t * 3 + j)) + s * pop * 40).toFixed(2)}deg)`; });
      const sh = 1 / (1 + lift / 90); shadow.style.transform = `scale(${(sh * sx).toFixed(3)},${sh.toFixed(3)})`; shadow.style.opacity = (.35 + .65 * sh).toFixed(3);
      const hc = palette[cur].halo; pool.style.background = `radial-gradient(closest-side,${hexA(hc, .45)},${hexA(hc, 0)})`; pool.style.opacity = '1';
      rim.style.opacity = (.6 + .4 * Math.sin(t * .8)).toFixed(3);
      haloBox.style.transform = `scale(${(1 + .06 * Math.sin(t * 1.3) + pop * .6).toFixed(3)})`;
      const p = posAt(t); root.style.transform = `translate(${p.x.toFixed(1)}px,${p.y.toFixed(1)}px) scale(${p.s.toFixed(4)})`;
      parts.forEach((f) => f(t));
    });
    const api = {
      el: root, body,
      place(keys) { place = keys.slice().sort((a, b) => a[0] - b[0]); return api; },
      mood: (t) => M[moodAt(t)][1], colour: (t) => palette[M[moodAt(t)][1]].halo,
      // depth particles: three depths (behind: small, soft, slow; front: big, soft, fast), each rising from round the body on its own curve
      fx(kind, at, out, { n = 9, spread = 1, colour = null } = {}) {
        P.use('particles', 'clay-depth-' + kind);
        const ps = Array.from({ length: n }, (_, j) => { const depth = j % 3, front = depth === 2, sz = [14, 22, 34][depth] * (kind === 'zzz' ? 1.2 : 1);
          const el = E.el('div', `position:absolute;width:${sz}px;height:${sz}px;opacity:0;${depth !== 1 ? `filter:blur(${front ? 2.2 : 1.2}px)` : ''}`, front ? fxFront : fxBack, FX[kind](colour));
          return { el, depth, a: (j / n) * TAU + j * 1.37, d: 0.75 + ((j * 53) % 10) / 22, t0: at + (j / n) * Math.min(1.2, (out - at) * .5), life: 1.3 + (j % 4) * .25 }; });
        parts.push((t) => ps.forEach((q) => { const u = (t - q.t0) / q.life; if (u < 0 || t > out + q.life) { q.el.style.opacity = '0'; return; }
          const uu = u % 1, cyc = Math.floor(u); if (q.t0 + cyc * q.life > out) { q.el.style.opacity = '0'; return; }
          const rx = Math.cos(q.a + cyc) * W * .58 * q.d * spread, ry = -H * .3 - uu * H * (.55 + .2 * q.depth) * spread, wob = Math.sin(uu * 7 + q.a) * 8;
          const sc = P.EASE.glide(clamp(uu * 4)) * (1 - .3 * uu);
          q.el.style.transform = `translate(${(W / 2 + rx + wob - 12).toFixed(1)}px,${(H + ry).toFixed(1)}px) rotate(${(Math.sin(uu * 5 + q.a) * 18).toFixed(1)}deg) scale(${sc.toFixed(3)})`;
          q.el.style.opacity = (clamp(uu * 6) * (1 - clamp((uu - .7) / .3)) * (q.depth === 0 ? .6 : 1)).toFixed(3); }));
        return api;
      },
    };
    return api;
  };
  // the dome: a glass shield drawn on round a subject (stroke draw-on, hex cells, inner glare); hits = [[t, angle]] flash a ripple where a threat strikes it
  P.dome = function (parent, { x = 201, y = 330, r = 170, at = 8, colour = '#4df0b8', hits = [], out = null } = {}) {
    P.use('mechanism', 'shield-dome');
    const box = E.el('div', `position:absolute;left:${x - r - 20}px;top:${y - r - 20}px;width:${2 * r + 40}px;height:${2 * r + 40}px;pointer-events:none;opacity:0`, parent);
    const c = r + 20, hex = [];
    for (let q = -4; q <= 4; q++) for (let s = -4; s <= 4; s++) { const hx = c + q * r * .26 + (s % 2) * r * .13, hy = c + s * r * .225; if (Math.hypot(hx - c, hy - c) < r * .92) hex.push([hx, hy]); }
    const hp = (cx, cy, k) => { const a = r * .12 * k; return Array.from({ length: 6 }, (_, i) => `${(cx + a * Math.cos(i * Math.PI / 3 + Math.PI / 6)).toFixed(1)},${(cy + a * Math.sin(i * Math.PI / 3 + Math.PI / 6)).toFixed(1)}`).join(' '); };
    box.innerHTML = `<svg width="${2 * c}" height="${2 * c}" viewBox="0 0 ${2 * c} ${2 * c}" style="overflow:visible"><defs><radialGradient id="dmF" cx=".38" cy=".3" r=".75"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".55" stop-color="${colour}" stop-opacity=".06"/><stop offset=".92" stop-color="${colour}" stop-opacity=".22"/><stop offset="1" stop-color="${colour}" stop-opacity=".5"/></radialGradient></defs>
      <circle class="fill" cx="${c}" cy="${c}" r="${r}" fill="url(#dmF)" opacity="0"/>
      <g class="hx" stroke="${colour}" stroke-width="1.2" fill="none">${hex.map(([a, b]) => `<polygon points="${hp(a, b, 1)}" opacity="0"/>`).join('')}</g>
      <circle class="ring" cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${colour}" stroke-width="3.5" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" style="filter:drop-shadow(0 0 8px ${colour}) drop-shadow(0 0 22px ${colour})" transform="rotate(-90 ${c} ${c})"/>
      <path d="M${c - r * .62} ${c - r * .5} A${r * .85} ${r * .85} 0 0 1 ${c + r * .1} ${c - r * .8}" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".35"/>
      ${hits.map(() => `<circle class="hit" r="10" fill="none" stroke="#fff" stroke-width="3" opacity="0"/>`).join('')}</svg>`;
    const ring = box.querySelector('.ring'), fill = box.querySelector('.fill'), polys = [...box.querySelectorAll('.hx polygon')], hitEls = [...box.querySelectorAll('.hit')];
    P.on((t) => {
      const on = t >= at - .05 && (out == null || t < out + .4); box.style.opacity = on ? (out == null ? 1 : 1 - clamp((t - out) / .35)).toFixed(3) : '0'; if (!on) return;
      ring.setAttribute('stroke-dashoffset', (1 - P.EASE.glide(clamp((t - at) / .7))).toFixed(4));
      fill.setAttribute('opacity', P.EASE.glide(clamp((t - at - .4) / .6)).toFixed(3));
      polys.forEach((p, i) => { const [hx, hy] = hex[i], d = Math.hypot(hx - c, hy - c) / r, k = clamp((t - at - .3 - d * .5) / .3), shim = .08 + .1 * Math.max(0, Math.sin(t * 2.4 - d * 5)); p.setAttribute('opacity', (k * (1 - k * .55) * 1.4 + shim * k).toFixed(3)); });
      box.style.transform = `scale(${(.9 + .1 * P.spring(t - at, P.SPRING.bold) + .012 * Math.sin(t * 3)).toFixed(4)})`;
      hits.forEach(([ht, ang], i) => { const u = (t - ht) / .5, el = hitEls[i]; if (u < 0 || u > 1) { el.setAttribute('opacity', '0'); return; }
        el.setAttribute('cx', (c + r * Math.cos(ang)).toFixed(1)); el.setAttribute('cy', (c + r * Math.sin(ang)).toFixed(1)); el.setAttribute('r', (6 + 40 * P.EASE.glide(u)).toFixed(1)); el.setAttribute('opacity', (1 - u).toFixed(3)); });
    });
    return box;
  };
})();
