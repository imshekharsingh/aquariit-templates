// Film parts: the reusable building blocks of the product-film grammar (design/film-playbook.md), extracted from film/2026-10-13-1902 ("After 8", v3).
// Loaded by render-film.mjs after engine.js and before the story, as window.FilmParts (P). Every part is a pure function of film time: create it in setup(),
// then P.update(t) (called by the story's update) drives everything that was registered. Stories still own their concept: the parts are the vocabulary, not the film.
//
//   const P = window.FilmParts;
//   P.scene({ accent: '#c8ff3d' })                     -> { L, world }      near-black stage, ambient dust + bokeh, breathing push, breath dim, impact punch
//   P.captions([[in, out, 'Two words', size, {1: colour}], ...])           1-3 words per card at ONE anchor (y 492), narrow, words rise from a mask
//   P.sentence(parent, ['Every', 'great', 'idea'], { at, per, y, accents }) a line that BUILDS word by word (reference study 2), cleared at `out`
//   P.card(parent, css, html, { active })               -> element         material card (gradient, light rim, inner highlight); active = accent rim + glow
//   P.brackets(parent)                                  -> b; b.place(box, k, opacity)    corner brackets + glowing dot (focus marks)
//   P.phone(parent, { x, y, w, h })                     -> { el, screen }  dark device whose screen is the only light
//   P.scan(phone, layer, t0, dur)                                          bar of light runs down the phone and reveals `layer` above it
//   P.hub(parent, { cx, cy, from, nodes: [{ x, y, icon, label, at }], at, out })   hub with counter-rotating rings, lines that draw, travelling data dots
//   P.payoff({ at, out, colors })                                          the warm flood (sunrise) that only arrives at the peak, with rays
//   P.clock(keys, { from, to })                                            mono HUD clock, top-left, time-lapse between [t, minutes] keys
//   P.shape(parent, { path, size, colour })             -> s; s.at(t, {x, y, rot, scale, o})  one brand shape as a recurring character (it can become a wipe)
//   P.wave(parent, { at, dur, colour, from: 'bottom' })                    organic liquid wipe
//   P.icons                                                                hand-drawn 24px icon paths (calendar, rupee, bell, cart, chat, star, clock, pin, check, spark)
(function () {
  const E = window.FilmEngine, { clamp, lerp, ease } = E, TAU = Math.PI * 2;
  const sm = (a, b, t) => ease.io3(clamp((t - a) / (b - a)));
  const css = (el, o) => { for (const k in o) el.style[k] = o[k]; };
  const MONO = '"Geist Mono","JetBrains Mono",ui-monospace,monospace';
  const P = (window.FilmParts = { sm, css, MONO, TAU, ups: [], accent: '#c8ff3d', ink: '#050607', len: 18 });
  // the parts' own type (captions, HUD) must not depend on the page's fonts: load Archivo (width axis) + Geist Mono; stories `await P.ready` in setup()
  P.ready = (async () => {
    try {
      const l = document.createElement('link'); l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Geist+Mono:wght@400..600&display=block';
      document.head.appendChild(l); await new Promise((ok) => { l.onload = ok; l.onerror = ok; setTimeout(ok, 6000); });
      await Promise.all(['800 28px Archivo', '900 30px Archivo', '500 11px "Geist Mono"'].map((f) => document.fonts.load(f)));
    } catch (e) { /* fall back to system fonts */ }
  })();
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
    spark: '<path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M19 5l-4 4M9 15l-4 4"/>',
  };
  P.icon = (name, size = 24) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P.icons[name] || name}</svg>`;

  // ---- scene: stage the film on near-black with one accent; the page's own DOM is hidden (stories clone what they need) ----
  P.scene = function ({ accent = P.accent, ink = P.ink, glow = 'rgba(110,140,120,.13)', len = 18 } = {}) {
    P.accent = accent; P.ink = ink; P.len = len;
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
      for (const d of dust) { g.globalAlpha = d.a * (.6 + .4 * Math.sin(d.p + tf * 1.3)); g.beginPath(); g.arc(d.x + 10 * Math.sin(ph + d.p), d.y + 16 * Math.sin(ph * 2 + d.p * 1.7), d.r, 0, TAU); g.fill(); }
      bokeh.forEach((b, i) => { b.style.transform = `translate(${(14 * Math.sin(ph + i * 2)).toFixed(1)}px,${(10 * Math.cos(ph + i)).toFixed(1)}px)`; });
      if (P.warmBokeh) bokeh[2].style.opacity = String(.25 + .75 * P.warmBokeh(t));
      const punch = P.punchAt != null && t >= P.punchAt ? Math.exp(-(t - P.punchAt) * 5) * .04 : 0, drift = .012 * Math.sin(ph);
      const dim = P.breath && t >= P.breath[0] && t < P.breath[1] + .15 ? sm(P.breath[0], P.breath[0] + .25, t) * (1 - sm(P.breath[1], P.breath[1] + .15, t)) : 0;
      css(world, { transform: `scale(${(1 + drift + punch).toFixed(4)})`, filter: dim > .01 ? `brightness(${(1 - .7 * dim).toFixed(3)})` : 'none' });
      E.vig.style.opacity = (.45 + .4 * dim).toFixed(3);
      E.field.style.opacity = 0;
    });
    return { L, world };
  };

  // ---- material card ----
  P.card = function (parent, cssText, html, { active = false } = {}) {
    const c = E.el('div', `position:absolute;box-sizing:border-box;border-radius:18px;${P.MAT};color:#f2f4f2;${cssText}`, parent, html);
    c.setActive = (on) => { c.style.boxShadow = on ? `inset 0 1px 0 rgba(255,255,255,.09),0 0 0 1px ${hexA(P.accent, .6)},0 0 22px ${hexA(P.accent, .3)}` : ''; c.style.color = on ? P.accent : '#f2f4f2'; };
    if (active) c.setActive(true);
    return c;
  };

  // ---- corner brackets (focus) ----
  P.brackets = function (parent) {
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
  P.phone = function (parent, { x = 111, y = 104, w = 180, h = 352 } = {}) {
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
    const hud = E.el('div', `position:absolute;left:30px;top:104px;display:flex;align-items:center;gap:7px;font:500 11px/1 ${MONO};letter-spacing:.14em;color:rgba(255,255,255,.8)`, P.front, `<i style="width:6px;height:6px;border-radius:50%;background:${P.accent};box-shadow:0 0 8px ${P.accent}"></i><span></span>`);
    const sp = hud.querySelector('span'), dot = hud.querySelector('i');
    const at = (t) => { let i = 0; while (i < keys.length - 2 && t >= keys[i + 1][0]) i++; const [t0, m0] = keys[i], [t1, m1] = keys[i + 1]; const m = Math.floor(lerp(m0, m1, clamp((t - t0) / (t1 - t0)))) % 1440; const h = Math.floor(m / 60); return `${((h + 11) % 12) + 1}:${String(m % 60).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`; };
    P.on((t, tf) => { sp.textContent = at(t); let o = sm(from, from + .3, t) * (1 - sm(to, to + .3, t)); hide.forEach(([a, b]) => { o *= 1 - sm(a, a + .2, t) * (1 - sm(b, b + .2, t)); }); hud.style.opacity = o.toFixed(3); dot.style.opacity = (.55 + .45 * Math.sin(tf * 4)).toFixed(3); });
    return { hud, text: sp, at };
  };

  // ---- captions: the spine. [in, out, text, size, {wordIndex: colour}] ----
  P.captions = function (list, { y = 492, maxW = 280 } = {}) {
    const wrap = E.el('div', `position:absolute;left:0;right:0;top:${y}px;height:0`, P.front);
    const caps = list.map(([a, b, text, size = 28, acc = {}]) => {
      const card = E.el('div', `position:absolute;left:201px;top:0;transform:translate(-50%,-50%);white-space:nowrap;padding:6px 13px 8px;border-radius:12px;background:rgba(10,12,14,.82);box-shadow:0 0 0 1px rgba(255,255,255,.07),0 8px 24px rgba(0,0,0,.35);color:#fff;font:800 ${size}px/1.05 Archivo,sans-serif;font-variation-settings:"wdth" 84;letter-spacing:-.035em`, wrap);
      const words = text.split(' ').map((w, i) => { const m = E.el('span', 'display:inline-block;overflow:hidden;vertical-align:bottom;padding:0 .02em .1em;margin:0 0 -.1em', card); const inner = E.el('span', `display:inline-block;${acc[i] ? `color:${acc[i]}` : ''}`, m, w); if (i) card.insertBefore(document.createTextNode(' '), m); return inner; });
      if (card.offsetWidth > maxW) card.style.fontSize = (size * maxW / card.offsetWidth).toFixed(1) + 'px';
      return { a, b, card, words };
    });
    P.on((t) => caps.forEach(({ a, b, card, words }) => {
      if (t < a - .05 || t > b + .02) { card.style.opacity = '0'; return; }
      const out = clamp((t - (b - .12)) / .12);
      card.style.opacity = (clamp((t - a) / .08 + (a < 0 ? 1 : 0)) * (1 - out)).toFixed(3);
      card.style.transform = `translate(-50%,calc(-50% - ${(out * 6).toFixed(1)}px))`;
      words.forEach((w, i) => { const k = ease.spring(clamp((t - a - i * .07) / .42)); w.style.transform = `translateY(${((1 - k) * 105).toFixed(1)}%)`; });
    }));
    return { wrap, caps, hideAll: () => caps.forEach(({ card }) => { card.style.opacity = '0'; }) };
  };

  // ---- sentence that builds (reference study 2): small light type, one line, word by word; accents coloured; clears at `out` ----
  P.sentence = function (parent, words, { at = 1, per = .55, out = null, y = 300, size = 22, weight = 500, accents = {}, colour = '#f2f4f2', highlight = false } = {}) {
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
  P.fade = (el, a, b, { fi = .3, fo = .3, dy = 0 } = {}) => P.on((t) => { const o = sm(a, a + fi, t) * (1 - sm(b, b + fo, t)); css(el, { opacity: o.toFixed(3), transform: dy ? `translateY(${((1 - sm(a, a + fi, t)) * dy).toFixed(1)}px)` : el.style.transform }); });
  P.pop = (el, at, { from = .7, dy = 16, out = null } = {}) => P.on((t) => { const k = ease.spring(clamp((t - at) / .5)), o = clamp((t - at) / .1) * (out == null ? 1 : 1 - sm(out, out + .25, t)); css(el, { opacity: o.toFixed(3), transform: `translateY(${((1 - k) * dy).toFixed(1)}px) scale(${lerp(from, 1, k).toFixed(3)})` }); });
})();
