// FILM v5 (premium, rich): "Is your site slow abroad?" (service: edge). 15 Oct 2026, owner feedback on v4: "audio slowed, noticeable pauses; the component count is
// really minimum". Same calm cinematic-tech look (design/brand/premium.md), now with three layers in every frame (subject, supporting detail, depth) and a
// near-continuous voice. Beats follow the voice lines (film/ID/voice.md):
// 0.0 hook type over a phone stuck loading (skeleton shimmer, spinner, a load timer) | 3.2 a dotted globe, five cities, every pulse crawls to one server in
// Mumbai, live load counters | 7.6 "Every second, people leave.": a big timer and a grid of visitors leaving | 10.7 breath | 11.2 3D HERO: the edge node lands,
// its core lights, six edge nodes come online around it | 15.8 the globe again: an edge next to every city, counters snap to fast | 19.6 push in on one edge,
// a shield ring stops a stream of bad bots, event toasts stack | 23.5 brand ending.
(function () {
  const E = window.FilmEngine, P = window.FilmParts, { clamp, lerp } = E, S = (E.story = {});
  S.selfStage = true;
  S.dna = {
    service: 'edge',
    format: 'problem-fix',
    opening: 'premium type over a phone stuck loading: "Is your website / slow abroad?" with a skeleton page, a spinner and a load timer counting up',
    bigMoment: 'a real 3D edge node lands on a mirror floor, its lime core lights and six more edge nodes come online around it, then every city gets an edge and the counters snap to fast',
    ground: 'cinematic navy with a slowly turning dotted globe, soft blue light, glass and one lime accent',
    music: 'warm ambient pads with a soft pulse, rising gently into the edge reveal, about 90 BPM',
  };
  const B = P.BRAND, MONO = "'Geist Mono',ui-monospace,monospace", INK = '#070B16';
  const sp = (t, t0, n = 'default') => P.springAt(t, t0, n), tw = (t, t0, d, n = 'glide') => P.tween(t, t0, d, n), G_ = P.EASE.glide;
  const IN = (t, a, b, d = .5) => clamp((t - a) / d) * (1 - clamp((t - b) / d));     // visible from a to b with soft fades
  // world (≈ screen at scale 1): five cities around a globe, one server at the bottom; every city also gets a nearby edge later
  const SRV = [201, 588];
  const CITIES = [
    { n: 'London', p: [92, 250], slow: 2.4, fast: .3, e: [138, 286] },
    { n: 'New York', p: [300, 200], slow: 2.9, fast: .4, e: [252, 232] },
    { n: 'Toronto', p: [76, 410], slow: 2.7, fast: .3, e: [124, 384] },
    { n: 'Singapore', p: [292, 420], slow: 1.9, fast: .2, e: [246, 388] },
    { n: 'Berlin', p: [196, 330], slow: 2.2, fast: .4, e: [204, 290] },
  ];
  const path = (a, b, bend = .25) => { const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1];
    return [a, [lerp(a[0], mx, .5) - dy * bend, lerp(a[1], my, .5) + dx * bend], [lerp(mx, b[0], .5) - dy * bend, lerp(my, b[1], .5) + dx * bend], b]; };
  const LONG = CITIES.map((c, i) => path(c.p, SRV, i % 2 ? .18 : -.18)), SHORT = CITIES.map((c) => path(c.p, c.e, .3));
  const LON = CITIES[0];
  // camera keys [t, x, y, s]: the distance beat opens close on London and pulls back to the whole globe; the protection beat pushes in on London's edge
  const CAM = [[0, 104, 280, 1.8], [3.2, 104, 280, 1.8], [4.1, 112, 290, 1.65], [5.6, 201, 400, 1.0], [7.4, 201, 404, 1.05],
    [15.8, 201, 380, 1.0], [19.2, 201, 386, 1.08], [20.4, 128, 322, 2.2], [23.5, 130, 320, 2.32], [28, 130, 320, 2.32]];
  const camAt = (t) => { let i = 0; while (i < CAM.length - 2 && t > CAM[i + 1][0]) i++; const a = CAM[i], b = CAM[i + 1], k = G_(clamp((t - a[0]) / Math.max(.01, b[0] - a[0])));
    return [lerp(a[1], b[1], k), lerp(a[2], b[2], k), lerp(a[3], b[3], k)]; };

  S.setup = async function () {
    document.documentElement.classList.add('reel');
    await P.ready; await document.fonts.ready;
    const { world } = P.scene({ accent: B.lime, ink: INK, glow: 'rgba(60,100,230,.10)', len: 28 });
    P.use('opener', 'loading-phone-type'); P.use('transition', 'calm-glide'); P.use('payoff', 'edges-light-every-city'); P.use('type', 'premium-minimal'); P.use('focus', 'soft-spotlight');
    P.use('ground', 'dot-globe');

    // ---- the 2D world: globe, cities, server, edges, bots ----
    const W = P.sys(world, { bg: INK });
    const label = (c, x, y, txt, { size = 12, color = '#F3F5F8', weight = 700, font = 'Archivo, sans-serif', a = 1 } = {}) => {
      c.save(); c.globalAlpha = a * W.fade; c.font = `${weight} ${Math.round(size * Math.max(.85, W.cam.s))}px ${font}`; c.textAlign = 'center'; c.fillStyle = color; c.fillText(txt, x, y); c.restore(); };
    W.draw((c, t) => {
      const [x, y, s] = camAt(t); W.cam.x = x; W.cam.y = y; W.cam.s = s;
      const hook = IN(t, -1, 3.1, .4), before = IN(t, 3.2, 7.5, .5), after = IN(t, 15.8, 23.4, .5);
      if (hook > 0) { W.fade = hook * .55; W.globe(t, { x: 201, y: 470, r: 260, spin: .04, alpha: .7 }); }
      if (before <= 0 && after <= 0) return;
      W.fade = Math.max(before, after);
      W.globe(t, { x: 201, y: 390, r: 250, spin: .035, alpha: .85 });
      W.spot(201, 400, 320, { color: 'rgba(60,100,230,.14)' });
      if (before > 0) { W.fade = before;
        const arrive = G_(clamp((t - 6.4) / .8));
        W.spot(...LON.p, 110, { color: 'rgba(90,130,255,.26)' });
        W.spot(...SRV, 150, { color: `rgba(255,110,90,${(.12 + .3 * arrive).toFixed(3)})` });   // the far server heats up as every request piles onto it
        CITIES.forEach((cty, i) => {
          const t0 = 3.5 + i * .16, ln = LONG[i];
          W.beam(ln, G_(clamp((t - t0) / 1.4)), { color: 'rgba(170,195,255,.42)' });
          for (let k = 0; k < 2; k++) W.pulse(ln, P.EASE.swing(clamp((t - t0 - .9 - k * 1.4) / 2.2)), { color: '#FFB4A8', trail: .22 });
          const kk = sp(t, 3.25 + i * .12); W.glassNode(...cty.p, { k: kk, r: 17, label: cty.n, sub: '' });
          if (kk > .05) { const [cx, cy] = W.toS(...cty.p), v = cty.slow * G_(clamp((t - t0 - .4) / 2.6));
            label(c, cx, cy + 17 * s + 38 * Math.max(.85, s), `${v.toFixed(1)} s`, { size: 11, weight: 600, font: '"Geist Mono", monospace', color: v > 1.5 ? '#FFB4A8' : '#AAB4CC', a: Math.min(1, kk) }); }
        });
        W.glassNode(...SRV, { k: sp(t, 3.6), r: 30, label: 'Your server', sub: 'Mumbai · one location' });
      }
      if (after > 0) { W.fade = after;
        W.glassNode(...SRV, { k: .4, r: 30 });
        CITIES.forEach((cty, i) => {
          const t0 = 16.0 + i * .3, sh = SHORT[i], on = G_(clamp((t - t0) / .6));
          W.spot(...cty.e, 60, { color: `rgba(198,244,50,${(.16 * on).toFixed(3)})` });
          W.beam(sh, on, { color: 'rgba(198,244,50,.75)', width: 1.8 });
          for (let k = 0; k < 4; k++) W.pulse(sh, P.EASE.swing(clamp((t - t0 - .5 - k * .55) / .4)), { color: B.lime, trail: .5, r: 2.6 });
          const focus = 1 - .65 * G_(clamp((t - 19.2) / .8)) * (i ? 1 : 0);   // the protection push-in keeps London sharp and dims the rest
          W.fade = after * focus; W.glassNode(...cty.p, { k: 1, r: 17, label: t < 19.2 ? cty.n : '' });
          W.glassNode(...cty.e, { k: sp(t, t0 - .1), r: 11, coreOn: on }); W.fade = after;
          const [cx, cy] = W.toS(...cty.p), v = lerp(cty.slow, cty.fast, G_(clamp((t - t0 - .3) / .7)));
          if (t < 19.6) label(c, cx, cy + 17 * s + 38 * Math.max(.85, s), `${v.toFixed(1)} s`, { size: 11, weight: 600, font: '"Geist Mono", monospace', color: v < 1 ? B.lime : '#FFB4A8' });
        });
        // protection: a shield ring forms round London's edge and a stream of bad bots breaks against it
        if (t > 19.8) { const [ex, ey] = W.toS(...LON.e), rr = 46 * s, kr = G_(clamp((t - 19.9) / .9));
          c.save(); c.globalAlpha = after * kr; c.strokeStyle = 'rgba(198,244,50,.85)'; c.lineWidth = 1.6 * s; c.shadowColor = B.lime; c.shadowBlur = 10;
          c.beginPath(); c.arc(ex, ey, rr, -1.57, -1.57 + 6.283 * kr); c.stroke(); c.globalAlpha = after * kr * .35; c.lineWidth = 1; c.beginPath(); c.arc(ex, ey, rr * 1.18, 0, 6.283); c.stroke(); c.restore();
          for (let i = 0; i < 14; i++) { const t0 = 20.3 + i * .2, a = -2.9 + ((i * 2.399) % 4.2), k = clamp((t - t0) / .7);
            if (k <= 0) continue; const hitR = 46, d = lerp(170, hitR, G_(Math.min(1, k)));
            if (k < 1) { const [bx, by] = W.toS(LON.e[0] + Math.cos(a) * d, LON.e[1] + Math.sin(a) * d); c.save(); c.globalAlpha = after; c.fillStyle = B.coral; c.shadowColor = B.coral; c.shadowBlur = 8;
              c.beginPath(); c.arc(bx, by, 2.6 * s, 0, 6.283); c.fill(); c.restore(); }
            const f = clamp((t - t0 - .7) / .6); if (f > 0 && f < 1) { c.save(); c.globalAlpha = after * (1 - f); c.strokeStyle = '#F4FFD0'; c.shadowColor = B.lime; c.shadowBlur = 14; c.lineWidth = (2.6 - 1.4 * f) * s; c.lineCap = 'round';
              c.beginPath(); c.arc(ex, ey, rr + 2 * f * s, a - .22 - .1 * f, a + .22 + .1 * f); c.stroke(); c.restore(); } } }   // the ring flares where a bot hits it (no debris: premium.md)
      }
    });

    // ---- the 3D hero (beat 5): the edge node lands, its core lights, six edge nodes come online around it ----
    const G = P.three(world, { bg: INK, fov: 30, exposure: 1.25, active: [[11.2, 15.9]], studio: [['#ffffff', 7, [0, 6, 3], [7, 2.5]], ['#7f9cff', 5, [-6, 2.5, 1], [2.5, 6]], ['#ffffff', 4, [6, 3, -2], [2.5, 6]], ['#9fb6ff', 2, [0, 1.5, -7], [9, 3]]] });
    const T3 = G.T, grp = new T3.Group(); G.scene.add(grp);
    const glass = new T3.MeshPhysicalMaterial({ color: 0xb9c8f0, metalness: .35, roughness: .2, transmission: .3, thickness: .9, ior: 1.5, clearcoat: 1, clearcoatRoughness: .03, sheen: .5, sheenColor: new T3.Color('#c8d6ff'), emissive: new T3.Color('#1a2550'), emissiveIntensity: .2, envMapIntensity: 3.2 });
    const node = new T3.Mesh(new T3.CylinderGeometry(.62, .62, .34, 6), glass); grp.add(node);
    const rimM = new T3.MeshStandardMaterial({ color: 0xdfe8ff, metalness: 1, roughness: .2 });
    const rim = new T3.Mesh(new T3.TorusGeometry(.66, .025, 12, 72), rimM); rim.rotation.x = Math.PI / 2; grp.add(rim);
    const coreM = new T3.MeshStandardMaterial({ color: 0x0d1408, emissive: new T3.Color(B.lime), emissiveIntensity: 0 });
    const core = new T3.Mesh(new T3.SphereGeometry(.12, 32, 16), coreM); core.position.y = .2; grp.add(core);
    const floor = new T3.Mesh(new T3.CircleGeometry(60, 96), new T3.MeshStandardMaterial({ color: 0x070b16, metalness: .85, roughness: .32 })); G.scene.fog = new T3.Fog(INK, 8, 22); floor.rotation.x = -Math.PI / 2; floor.position.y = -.17; G.scene.add(floor);
    const glowRing = new T3.Mesh(new T3.RingGeometry(.7, .712, 128), new T3.MeshBasicMaterial({ color: new T3.Color(B.lime), transparent: true, opacity: 0 })); glowRing.rotation.x = -Math.PI / 2; glowRing.position.y = -.165; G.scene.add(glowRing);
    const sats = Array.from({ length: 6 }, (_, i) => { const a = i / 6 * Math.PI * 2 + .3, d = 2.1 + (i % 2) * .6, m = new T3.MeshStandardMaterial({ color: 0x0d1408, emissive: new T3.Color(B.lime), emissiveIntensity: 0 });
      const g = new T3.Group(), body = new T3.Mesh(new T3.CylinderGeometry(.26, .26, .14, 6), glass), c = new T3.Mesh(new T3.SphereGeometry(.06, 16, 10), m); c.position.y = .1; g.add(body, c);
      g.position.set(Math.cos(a) * d, -.1, Math.sin(a) * d); G.scene.add(g);
      const lm = new T3.LineBasicMaterial({ color: new T3.Color(B.lime), transparent: true, opacity: 0 }), line = new T3.Line(new T3.BufferGeometry().setFromPoints([new T3.Vector3(0, -.12, 0), new T3.Vector3(Math.cos(a) * d, -.12, Math.sin(a) * d)]), lm); G.scene.add(line);
      return { m, lm, t0: 13.9 + i * .18 }; });
    G.frame((t) => {
      const land = G_(clamp((t - 11.4) / 1.9)); grp.position.y = lerp(2.4, 0, land); grp.rotation.y = .4 + t * .12;
      const lit = G_(clamp((t - 13.5) / .7)); coreM.emissiveIntensity = 2.2 * lit; glowRing.material.opacity = .55 * lit * (1 - clamp((t - 14.4) / 1.4) * .7); glowRing.scale.setScalar(1 + 3.2 * G_(clamp((t - 13.6) / 1.6)));
      sats.forEach((q) => { const k = G_(clamp((t - q.t0) / .45)); q.m.emissiveIntensity = 1.8 * k; q.lm.opacity = .7 * k; });
      const a = .9 + (t - 11.2) * .07, r = lerp(10, 8.3, G_(clamp((t - 11.2) / 4.7))), h = lerp(3.6, 2.6, G_(clamp((t - 11.2) / 4.7)));
      G.camera.position.set(Math.sin(a) * r, h, Math.cos(a) * r); G.camera.lookAt(0, .2, 0);
    });

    // ---- DOM layers: hook phone, the waiting-visitors beat, type, event toasts ----
    const T = (html, css) => E.el('div', `position:absolute;left:30px;right:30px;text-align:center;color:${B.paper};font:800 40px/1.05 Archivo,sans-serif;font-variation-settings:"wdth" 96;letter-spacing:-.015em;word-spacing:.05em;opacity:0;${css}`, P.front, html);
    const sweep = E.el('div', 'position:absolute;left:-200px;top:-200px;width:420px;height:1200px;background:linear-gradient(90deg,rgba(0,0,0,0),rgba(110,150,255,.18),rgba(0,0,0,0));transform:rotate(18deg);opacity:0', world);
    const warm = E.el('div', 'position:absolute;inset:-80px;background:radial-gradient(70% 55% at 50% 52%,rgba(255,110,90,.26),rgba(255,110,90,.06) 60%,rgba(0,0,0,0));opacity:0', world);
    // hook: a phone stuck loading (glass frame, URL bar, skeleton blocks shimmering, a spinner, a crawling progress bar and a load timer)
    const phone = E.el('div', 'position:absolute;left:86px;top:236px;width:230px;height:400px;border-radius:38px;padding:12px;box-sizing:border-box;background:linear-gradient(160deg,rgba(200,215,255,.20),rgba(40,60,120,.18) 45%,rgba(10,16,36,.6));border:1px solid rgba(210,225,255,.35);box-shadow:0 30px 80px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.25);opacity:0', P.front,
      `<div style="height:100%;border-radius:28px;background:#0B1124;overflow:hidden;position:relative">
        <div style="margin:12px 12px 0;height:26px;border-radius:13px;background:rgba(255,255,255,.07);display:flex;align-items:center;gap:6px;padding:0 10px;font:500 11px/1 ${MONO};color:#AAB4CC">
          <svg width="9" height="11" viewBox="0 0 9 11"><rect x=".5" y="4.5" width="8" height="6" rx="1.5" fill="none" stroke="#AAB4CC"/><path d="M2.3 4.5V3a2.2 2.2 0 0 1 4.4 0v1.5" fill="none" stroke="#AAB4CC"/></svg>yourstore.com</div>
        <div class="bar" style="margin:8px 12px 0;height:3px;border-radius:2px;background:rgba(255,255,255,.08)"><i style="display:block;height:100%;width:0;border-radius:2px;background:${B.coral}"></i></div>
        <div class="sk" style="margin:16px 14px 0;height:92px;border-radius:14px"></div>
        <div class="sk" style="margin:12px 14px 0;height:13px;width:70%;border-radius:7px"></div>
        <div class="sk" style="margin:8px 14px 0;height:13px;width:52%;border-radius:7px"></div>
        <div style="display:flex;gap:10px;margin:14px 14px 0"><div class="sk" style="flex:1;height:64px;border-radius:12px"></div><div class="sk" style="flex:1;height:64px;border-radius:12px"></div></div>
        <svg class="spin" width="36" height="36" viewBox="0 0 36 36" style="position:absolute;left:calc(50% - 18px);top:150px"><circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="3"/><path d="M18 4a14 14 0 0 1 14 14" fill="none" stroke="#FFB4A8" stroke-width="3" stroke-linecap="round"/></svg>
        <div class="tm" style="position:absolute;left:0;right:0;bottom:22px;text-align:center;font:600 14px/1 ${MONO};color:#FFB4A8">Loading… 0.0 s</div>
      </div>`);
    phone.querySelectorAll('.sk').forEach((el) => { el.style.background = 'linear-gradient(90deg,rgba(255,255,255,.06),rgba(255,255,255,.16),rgba(255,255,255,.06))'; el.style.backgroundSize = '220% 100%'; });
    const pBar = phone.querySelector('.bar i'), pSpin = phone.querySelector('.spin'), pTm = phone.querySelector('.tm'), sks = [...phone.querySelectorAll('.sk')];
    const h1 = T('Is your website', 'top:112px;font-size:34px'), h2 = T(`slow <span style="color:${B.coral}">abroad?</span>`, 'top:152px;font-size:48px;white-space:nowrap');
    // "people leave": a big timer and twenty visitors, twelve of them leave as the seconds pass
    const c1 = T('Every second,', 'top:132px;font-size:38px'), c2 = T(`people <span style="color:${B.coral}">leave.</span>`, 'top:176px;font-size:50px');
    const big = E.el('div', `position:absolute;left:0;right:0;top:262px;text-align:center;font:500 76px/1 ${MONO};letter-spacing:-.03em;color:${B.paper};opacity:0`, P.front, '0.0 s');
    const bigS = E.el('div', `position:absolute;left:0;right:0;top:346px;text-align:center;font:500 12px/1 ${MONO};letter-spacing:.2em;color:rgba(160,172,196,.9);opacity:0`, P.front, 'TIME TO LOAD');
    const crowd = E.el('div', 'position:absolute;left:58px;right:58px;top:392px;display:grid;grid-template-columns:repeat(5,1fr);gap:16px 0;justify-items:center;opacity:0', P.front);
    const LEAVE = [3, 11, 7, 16, 0, 19, 9, 13, 5, 17, 2, 14];
    const people = Array.from({ length: 20 }, (_, i) => { const el = E.el('div', '', crowd, `<svg width="30" height="38" viewBox="0 0 30 38"><circle cx="15" cy="9" r="7" fill="currentColor"/><path d="M2 36c0-8 6-14 13-14s13 6 13 14z" fill="currentColor"/></svg>`);
      el.style.color = '#AFC0EA'; return { el, out: 7.9 + Math.max(0, LEAVE.indexOf(i)) * .2, leaves: LEAVE.includes(i) }; });
    const left = E.el('div', `position:absolute;left:0;right:0;top:628px;text-align:center;font:500 12px/1 ${MONO};letter-spacing:.14em;color:rgba(160,172,196,.9);opacity:0`, P.front, '');
    const edgeT = T(`The <span style="color:${B.lime}">edge.</span>`, 'top:120px;font-size:48px');
    const fastT = T(`Fast, <span style="color:${B.lime}">everywhere.</span>`, 'top:96px;font-size:40px');
    const protT = T(`<span style="color:${B.lime}">Protected.</span>`, 'top:96px;font-size:44px');
    const toasts = ['Bad bot blocked', 'Attack absorbed', 'Firewall rule matched', 'Scraper challenged'].map((txt, i) => E.el('div',
      `position:absolute;left:30px;top:${430 + i * 40}px;display:flex;align-items:center;gap:9px;padding:9px 14px;border-radius:12px;background:rgba(14,22,46,.82);border:1px solid rgba(198,244,50,.28);font:600 13px/1 Archivo,sans-serif;color:${B.paper};opacity:0`,
      P.front, `<span style="width:8px;height:8px;border-radius:50%;background:${B.lime};box-shadow:0 0 8px ${B.lime}"></span>${txt}`));
    P.on((t) => {
      // hook
      const ph = IN(t, -1, 3.0, .4);
      sweep.style.opacity = ph.toFixed(3); sweep.style.transform = `translateX(${(-260 + 860 * G_(clamp(t / 3.0))).toFixed(1)}px) rotate(18deg)`;
      [[h1, 0], [h2, .3]].forEach(([el, a]) => { const k = a ? tw(t, a, .9) : Math.max(.6, tw(t, a, .9)); el.style.opacity = (k * IN(t, -1, 2.95, .4)).toFixed(3); el.style.transform = `translateY(${((1 - k) * 12).toFixed(1)}px) scale(${(1 + .05 * G_(clamp(t / 3))).toFixed(4)})`; });
      const kp = Math.max(.7, tw(t, 0, .8)); phone.style.opacity = (kp * ph).toFixed(3); phone.style.transform = `translateY(${((1 - kp) * 30 + 6 * Math.sin(t * 1.3)).toFixed(1)}px) scale(${(1 + .04 * G_(clamp(t / 3))).toFixed(4)})`;
      sks.forEach((el, i) => { el.style.backgroundPosition = `${(120 - ((t * 70 + i * 14) % 240)).toFixed(1)}% 0`; });
      pSpin.style.transform = `rotate(${(t * 300).toFixed(1)}deg)`; pBar.style.width = (36 * (1 - Math.exp(-t * .9))).toFixed(1) + '%'; pTm.textContent = `Loading… ${(t * 1.05).toFixed(1)} s`;
      // people leave
      const pl = IN(t, 7.5, 10.6, .4);
      warm.style.opacity = (G_(clamp((t - 7.5) / 1.4)) * IN(t, -1, 10.6, .4)).toFixed(3);
      [[c1, 7.6], [c2, 7.9]].forEach(([el, a]) => { const k = tw(t, a, .9); el.style.opacity = (k * IN(t, -1, 10.6, .4)).toFixed(3); el.style.transform = `translateY(${((1 - k) * 12).toFixed(1)}px)`; });
      const kb = tw(t, 7.8, .7), secs = 3.2 * G_(clamp((t - 7.8) / 2.6), 0); big.style.opacity = (kb * pl).toFixed(3); bigS.style.opacity = (kb * pl).toFixed(3); big.textContent = secs.toFixed(1) + ' s';
      big.style.color = secs > 1.5 ? B.coral : B.paper;
      crowd.style.opacity = (tw(t, 7.9, .6) * pl).toFixed(3); crowd.style.transform = `scale(${(1 + .04 * G_(clamp((t - 7.6) / 3))).toFixed(4)})`;
      let stay = 0; people.forEach((p) => { const k = p.leaves ? G_(clamp((t - 8.3 - (p.out - 7.9)) / .5)) : 0; if (k < .5) stay++;
        p.el.style.opacity = (1 - .85 * k).toFixed(3); p.el.style.transform = `translateY(${(k * 26).toFixed(1)}px)`; p.el.style.color = k > 0 ? B.coral : '#AFC0EA'; });
      left.style.opacity = (tw(t, 8.2, .6) * pl).toFixed(3); left.textContent = `STILL WAITING: ${stay} OF 20`;
      // 3D, edge, protection type
      const ke = tw(t, 13.7, .8); edgeT.style.opacity = (ke * IN(t, -1, 15.8, .4)).toFixed(3); edgeT.style.transform = `translateY(${((1 - ke) * 12).toFixed(1)}px)`;
      const kf = tw(t, 16.4, .8); fastT.style.opacity = (kf * IN(t, -1, 19.5, .4)).toFixed(3); fastT.style.transform = `translateY(${((1 - kf) * 12).toFixed(1)}px)`;
      const kq = tw(t, 20.0, .8); protT.style.opacity = (kq * IN(t, -1, 23.3, .4)).toFixed(3); protT.style.transform = `translateY(${((1 - kq) * 12).toFixed(1)}px)`;
      toasts.forEach((el, i) => { const k = tw(t, 20.6 + i * .55, .5); el.style.opacity = (k * IN(t, -1, 23.3, .4)).toFixed(3); el.style.transform = `translateX(${((1 - k) * -24).toFixed(1)}px)`; });
    });
    const endCard = P.brandEnd({ at: 23.5, keyword: 'FAST', why: 'What’s slowing your site down?', out: 27.8 });
    // the end card is held long enough to read, so it keeps breathing: a slow push-in and a soft blue light rising behind the mark
    const halo = E.el('div', 'position:absolute;left:-40px;right:-40px;top:60px;height:520px;background:radial-gradient(45% 40% at 50% 45%,rgba(47,107,255,.32),rgba(47,107,255,0) 70%);opacity:0;pointer-events:none', endCard);
    endCard.prepend(halo);
    P.on((t) => { const k = G_(clamp((t - 24.1) / 3.4)); endCard.style.scale = (1 + .07 * k).toFixed(4); halo.style.opacity = (.25 + .75 * k).toFixed(3); halo.style.transform = `translateY(${(40 - 70 * k).toFixed(1)}px) scale(${(.8 + .5 * k).toFixed(3)})`; });
    S.name = 'Edge premium v5 (rich)';
    return { ok: true };
  };
  S.update = function (E, t) { P.update(t); };
  S.cues = () => [];
})();
