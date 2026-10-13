// Film parts: the reusable vocabulary for the daily films. Loaded by render-film.mjs after engine.js and before the story, as window.FilmParts (P).
// Every part is a pure function of film time: create it in setup(), then call P.update(t) at the end of the story's update(). Each part records the SLOT it fills
// (P.use), and the renderer writes film/ID/manifest.json from that; scripts/check.mjs refuses a film that repeats the previous one (CLAUDE.md "Directed film").
// THE MENU (pick a different combination every film; add one new option every film):
//   ground     P.scene({ accent, ink })            black | deep colour (ink like #1a0712) | light (ink like #f4f1ea): cards, captions and dust adapt
//   opener     P.rackWord  P.drawOn  P.assemble    (or a bespoke opening image, declared in S.dna.opening)
//   transition P.scan  P.wave  P.iris  P.blinds  P.zoomThrough  P.whip  P.shapeWipe
//   mechanism  P.hub  P.route  P.gridFill  P.steps  P.deck  P.meter  P.compare  (+ P.chat inside P.phone)
//   focus      P.brackets  P.spotlight  P.lens
//   payoff     P.payoff (warm flood)  P.stamp  P.burst  P.sweep  P.bloom
//   type       P.sentence (builds word by word)  P.giant (one huge word)  P.typewriter
//   captions   P.captions(list, { style: 'pill' | 'bare' | 'underline' | 'mono' })   the spine: 1-3 words per card at y 492
//   cta        P.card (+ P.brackets)  P.tap (cursor taps a button)  P.ring (rotating text badge)
//   other      P.phone  P.clock  P.shape (a recurring brand shape)  P.signoff (the one constant: "Made by Aquarii")
// helpers: P.fade, P.pop, P.rel (measure an element), P.icon/P.icons, P.hexA, P.sm, P.css. Gallery of every option: render the test films in design/film-playbook.md.
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
      const punch = P.punchAt != null && t >= P.punchAt ? Math.exp(-(t - P.punchAt) * 5) * .04 : 0, drift = .012 * Math.sin(ph);
      const dim = P.breath && t >= P.breath[0] && t < P.breath[1] + .15 ? sm(P.breath[0], P.breath[0] + .25, t) * (1 - sm(P.breath[1], P.breath[1] + .15, t)) : 0;
      css(world, { transform: `scale(${(1 + drift + punch).toFixed(4)})`, filter: dim > .01 ? `brightness(${(1 - .7 * dim).toFixed(3)})` : 'none' });
      E.vig.style.opacity = ((P.light ? .12 : .45) + .4 * dim).toFixed(3);
      E.field.style.opacity = 0;
    });
    return { L, world };
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
  P.phone = function (parent, { x = 111, y = 104, w = 180, h = 352 } = {}) {
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
        pill: `padding:6px 13px 8px;border-radius:12px;background:${P.light ? 'rgba(255,255,255,.9)' : 'rgba(10,12,14,.82)'};box-shadow:0 0 0 1px ${P.light ? 'rgba(0,0,0,.08)' : 'rgba(255,255,255,.07)'},0 8px 24px rgba(0,0,0,.2);color:${P.fg};font:800 ${size}px/1.05 Archivo,sans-serif;font-variation-settings:"wdth" 84;letter-spacing:-.035em`,
        bare: `padding:0 4px;color:${P.fg};font:900 ${size * 1.25}px/1 Archivo,sans-serif;font-variation-settings:"wdth" 72;letter-spacing:-.02em;text-transform:uppercase;text-shadow:0 2px 18px ${P.light ? 'rgba(255,255,255,.9)' : 'rgba(0,0,0,.85)'}`,
        underline: `padding:2px 2px 10px;color:${P.fg};font:700 ${size}px/1.05 Archivo,sans-serif;letter-spacing:-.02em;background:linear-gradient(${P.accent},${P.accent}) 0 100%/100% 4px no-repeat`,
        mono: `padding:7px 12px;border-radius:4px;border:1px solid ${hexA(P.accent, .7)};background:${P.light ? 'rgba(255,255,255,.85)' : 'rgba(0,0,0,.7)'};color:${P.fg};font:600 ${size * .62}px/1.1 ${MONO};letter-spacing:.06em;text-transform:uppercase`,
      }[style] || '';
      const card = E.el('div', `position:absolute;left:201px;top:0;transform:translate(-50%,-50%);white-space:nowrap;${look}`, wrap);
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
  P.fade = (el, a, b, { fi = .3, fo = .3, dy = 0 } = {}) => P.on((t) => { const o = sm(a, a + fi, t) * (1 - sm(b, b + fo, t)); css(el, { opacity: o.toFixed(3), transform: dy ? `translateY(${((1 - sm(a, a + fi, t)) * dy).toFixed(1)}px)` : el.style.transform }); });
  P.pop = (el, at, { from = .7, dy = 16, out = null } = {}) => P.on((t) => { const k = ease.spring(clamp((t - at) / .5)), o = clamp((t - at) / .1) * (out == null ? 1 : 1 - sm(out, out + .25, t)); css(el, { opacity: o.toFixed(3), transform: `translateY(${((1 - k) * dy).toFixed(1)}px) scale(${lerp(from, 1, k).toFixed(3)})` }); });

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
  P.assemble = function (parent, text, { at = 0, dur = 1.4, y = 300, size = 64, out = 2.3, colour, back = null, backDur = .8 } = {}) {   // back: the dots scatter out again (use it to loop)
    P.use('opener', 'assemble');
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
  P.steps = function (parent, items, { x = 70, y = 170, gap = 74, at = 6, per = .6 } = {}) {
    P.use('mechanism', 'steps-rail');
    const rail = E.el('div', `position:absolute;left:${x}px;top:${y + 14}px;width:2px;height:${gap * (items.length - 1)}px;background:${hexA(P.light ? '#000000' : '#ffffff', .12)}`, parent);
    const fill = E.el('div', `position:absolute;left:0;top:0;width:2px;height:100%;background:${P.accent};box-shadow:0 0 10px ${P.accent};transform-origin:0 0;transform:scaleY(0)`, rail);
    const rows = items.map((txt, i) => { const r = E.el('div', `position:absolute;left:${x - 13}px;top:${y + i * gap}px;display:flex;align-items:center;gap:14px;color:${P.fg};font:700 19px/1.1 Archivo,sans-serif`, parent, `<span style="width:28px;height:28px;border-radius:50%;display:grid;place-items:center;flex:none;${P.MAT};font:700 11px/1 ${MONO}">${i + 1}</span><span>${txt}</span>`); r.dot = r.firstChild; return r; });
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
  P.meter = function (parent, { cx = 201, cy = 330, r = 110, at = 6, dur = 1.8, from = 0, to = 24, unit = 'MIN', label = '' } = {}) {
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
  P.giant = function (parent, word, { at = 12.6, out = 15.4, y = 250, colour, maxW = 342 } = {}) {
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
  P.tap = function (parent, label, { x = 201, y = 330, at = 16.0, done = '✓ Sent', w = 260 } = {}) {
    P.use('cta', 'tap');
    const btn = E.el('div', `position:absolute;left:${x - w / 2}px;top:${y - 30}px;width:${w}px;height:60px;border-radius:99px;display:grid;place-items:center;background:${P.accent};color:#111;font:800 16px/1 Archivo,sans-serif;letter-spacing:.04em;text-transform:uppercase;box-shadow:0 0 30px ${hexA(P.accent, .45)};overflow:hidden`, parent, label);
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
  // the studio sign-off: the only constant across all reels (small, last ~1.2 s)
  P.signoff = function ({ at = 16.9, out = 17.75, y = 492 } = {}) {
    const el = E.el('div', `position:absolute;left:0;right:0;top:${y}px;text-align:center;font:600 10px/1 ${MONO};letter-spacing:.32em;color:${hexA(P.light ? '#000000' : '#ffffff', .6)};text-transform:uppercase`, P.front, 'Made by Aquarii');
    P.on((t) => { el.style.opacity = (sm(at, at + .3, t) * (1 - sm(out, out + .25, t))).toFixed(3); });
    return el;
  };
})();
