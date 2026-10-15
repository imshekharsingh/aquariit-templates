// FILM v3: "Why is your site slow abroad?" (service: edge). 15 Oct 2026, owner feedback on v2: show HOW it works with connected components, more moving
// elements, fluid transitions, the visual appearance of a game. One neon world, one camera (design/references/2026-10-15-hyperframes-explainer.md):
// 0.0 hook: SLOW fills the width over a spinning loader | 2.3 zoom-through the loader into the world: the shopper's phone, DNS and a far-away server appear as the
// voice names them, a request crawls the long cable (camera follows it), the HUD latency bar climbs | 5.6 the cable jams, bots ride along, "Each second, people
// leave." | 7.3 breath, "Now add the edge." | 8.6 POWER-UP: edge nodes drop in with a flash and shake, the cable re-wires to the nearest edge, packets zip |
// 12.0 the shield ring takes hits, bots burst, the BOTS BLOCKED counter climbs | 13.8 pull back over the healthy map, the HUD number flies to centre: 0.4s |
// 16.1 brand ending, DM us "FAST".
(function () {
  const E = window.FilmEngine, P = window.FilmParts, { clamp, lerp } = E, S = (E.story = {});
  S.selfStage = true;
  S.dna = {
    service: 'edge',
    format: 'problem-fix',
    opening: 'full-width SLOW over a spinning loader that the camera dives through into a neon system map',
    bigMoment: 'edge nodes drop in like a power-up, the cable re-wires to the nearest edge and the shield bursts the bots while the HUD latency falls to 0.4s',
    ground: 'neon game world: ink, electric blue grid, lime and coral',
    music: 'driving synth pulse that lifts into a bright arcade groove at the power-up, 100 BPM',
  };
  const B = P.BRAND, MONO = "'Geist Mono',ui-monospace,monospace";
  const sp = (t, t0, n = 'default') => P.springAt(t, t0, n), tw = (t, t0, d, n = 'glide') => P.tween(t, t0, d, n);
  // the world: shopper in London (left), DNS, one far-away server in Mumbai (top right), the edge node next to the shopper
  const PH = [86, 470], DNS = [176, 560], SRV = [318, 250], EDGE = [128, 372];
  const LONG = [PH, [150, 640], [390, 520], SRV], SHORT = [PH, [96, 430], [112, 396], EDGE], DNSL = [PH, [110, 520], [140, 560], DNS];
  // camera keys [t, x, y, s] with smooth glide between them; fast moves get the renderer's motion blur
  const CAM = [[0, 201, 357, 1], [2.3, 201, 357, 1], [2.9, 160, 480, 1.7], [3.6, 170, 520, 1.55], [5.2, 290, 330, 1.35], [5.9, 205, 420, .92], [7.3, 205, 420, .92],
    [8.5, 205, 420, .92], [9.3, 120, 470, 1.55], [11.8, 130, 455, 1.6], [12.2, 128, 400, 2.0], [13.7, 128, 400, 2.0], [14.5, 205, 410, .95], [18, 205, 410, .95]];
  const camAt = (t) => { let i = 0; while (i < CAM.length - 2 && t > CAM[i + 1][0]) i++; const a = CAM[i], b = CAM[i + 1], k = P.EASE.swing(clamp((t - a[0]) / Math.max(.01, b[0] - a[0])));
    return [lerp(a[1], b[1], k), lerp(a[2], b[2], k), lerp(a[3], b[3], k)]; };

  S.setup = async function () {
    document.documentElement.classList.add('reel');
    await P.ready; await document.fonts.ready;
    const { world } = P.scene({ accent: B.blue, ink: '#060A14', glow: 'rgba(47,107,255,.10)' });
    P.use('opener', 'loader-zoom-through'); P.use('transition', 'one-camera-world'); P.use('payoff', 'hud-number-handoff'); P.use('type', 'game-hud');
    const W = P.sys(world, {}), ctx = W.ctx;

    W.draw((c, t) => {
      const [x, y, s] = camAt(t); W.cam.x = x; W.cam.y = y; W.cam.s = s;
      const sh = Math.max(0, 1 - (t - 8.6) / .5) * (t > 8.6 ? 1 : 0); W.cam.sx = Math.sin(t * 71) * 7 * sh; W.cam.sy = Math.cos(t * 53) * 6 * sh;   // power-up shake
      const mapA = clamp((t - 2.25) / .2) * (1 - .75 * tw(t, 7.25, .25, 'snap') * (1 - tw(t, 8.45, .2))) ;                                       // breath dims the world
      W.grid(t, { alpha: .45 + .55 * mapA });
      c.save(); c.globalAlpha = mapA;
      // map dots (a world of places)
      for (let gx = 20; gx < 400; gx += 18) for (let gy = 200; gy < 660; gy += 18) { const n = Math.sin(gx * .05) * Math.cos(gy * .043) + Math.sin((gx + gy) * .021); if (n < .35) continue;
        const [sx, sy] = W.toS(gx, gy); c.fillStyle = 'rgba(120,150,230,.22)'; c.fillRect(sx, sy, 2 * s, 2 * s); }
      const before = t < 8.6, edgeK = sp(t, 8.6, 'bold');
      const focus = 1 - .5 * (tw(t, 5.7, .3) * (1 - tw(t, 7.1, .2))) - .85 * (tw(t, 11.9, .3) * (1 - tw(t, 13.75, .2))) - .8 * tw(t, 13.8, .3);   // selective focus
      const dim = mapA * focus, sub = mapA * (t > 13.8 ? focus : 1);   // dim: everything but the subject; sub: the subject (edge + shield)
      c.globalAlpha = dim; W.fade = dim;
      // cables: the long trip (red when jammed), the DNS hop, and after the power-up the short path to the edge
      W.cable(DNSL, t, { color: B.blue, alpha: sp(t, 2.95) * .8, flow: 40 });
      W.cable(LONG, t, { color: t > 5.5 && before ? B.coral : B.blue, alpha: sp(t, 3.2) * (before ? 1 : .35), flow: before ? 18 : 6 });
      if (!before) W.cable(SHORT, t, { color: B.lime, alpha: edgeK, flow: 120, width: 4 });
      // packets
      if (t > 3.3 && t < 8.6) { const u = ((t - 3.3) / 3.4); W.comet(LONG, Math.min(1, u), { color: u < .5 ? B.lime : B.coral, r: 7 }); }
      if (t > 4.6 && before) for (let i = 0; i < 3; i++) { const u = ((t - 4.6 - i * .7) / 3.6); if (u > 0 && u < 1) W.comet(LONG, u, { color: B.coral, r: 5, trail: .04 }); }
      if (!before) for (let i = 0; i < 7; i++) { const u = ((t - 9.0 + i * .23) % .55) / .55; if (t > 9.0 - i * .23) W.comet(SHORT, i % 2 ? u : 1 - u, { color: B.lime, r: 5, trail: .12 }); }
      // the shield ring around the edge node (after 11.9), bots fly in and burst on it
      c.globalAlpha = sub; W.fade = sub;
      if (t > 11.9) { const [ex, ey] = W.toS(...EDGE), rr = 46 * s * sp(t, 11.9, 'bold'), hit = BOTS.reduce((m, b) => Math.max(m, 1 - Math.abs(t - b.hit) / .12), 0);
        c.save(); c.shadowColor = B.blue; c.shadowBlur = 20 + 30 * hit; c.strokeStyle = hit > .1 ? '#9EC0FF' : B.blue; c.lineWidth = (3 + 4 * hit) * s; c.beginPath(); c.arc(ex, ey, rr, 0, 6.283); c.stroke(); c.restore();
        BOTS.forEach((b) => { const k = (t - b.t0) / (b.hit - b.t0); if (k > 0 && k < 1) { const d = lerp(170, 46, P.EASE.glide(k)), [bx, by] = W.toS(EDGE[0] + Math.cos(b.a) * d, EDGE[1] + Math.sin(b.a) * d);
            c.save(); c.shadowColor = B.coral; c.shadowBlur = 12; c.fillStyle = B.coral; c.translate(bx, by); c.rotate(b.a + Math.PI); c.beginPath(); c.moveTo(7 * s, 0); c.lineTo(-5 * s, -5 * s); c.lineTo(-5 * s, 5 * s); c.closePath(); c.fill(); c.restore(); }
          W.burst(EDGE[0] + Math.cos(b.a) * 46, EDGE[1] + Math.sin(b.a) * 46, (t - b.hit) / .5, { seed: b.i }); }); }
      // the components, revealed as the voice names them
      c.globalAlpha = dim; W.fade = dim;
      W.chip(...PH, { icon: 'phone', label: 'Shopper', sub: 'London', k: sp(t, 2.4), color: B.paper });
      W.chip(...DNS, { icon: 'dns', label: 'DNS', sub: 'finds the server', k: sp(t, 3.0), w: 52, h: 52 });
      W.chip(...SRV, { icon: 'server', label: 'Your server', sub: 'Mumbai · 7,200 km', k: sp(t, 3.45), color: before && t > 5.5 ? B.coral : B.blue, hot: t > 5.5 && before ? .6 : 0 });
      if (!before) { [[EDGE, 0], [[250, 470], .08], [[300, 600], .14], [[60, 250], .2]].forEach(([p, d], i) => {
          const k = sp(t, 8.6 + d, 'bold') * (i ? clamp((1.35 - s) / .25) : 1), drop = (1 - k) * 220; W.fade = i ? dim : sub; W.chip(p[0], p[1] - drop / Math.max(.5, s), { icon: i ? 'edge' : 'edge', label: i ? '' : 'Edge', sub: i ? '' : '20 km away', k, color: B.lime, w: i ? 40 : 60, h: i ? 40 : 60, hot: 1 - k }); });
        const fl = Math.max(0, 1 - (t - 8.6) / .35); if (fl > 0) { c.fillStyle = `rgba(198,244,50,${(.35 * fl).toFixed(3)})`; c.fillRect(0, 0, 402, 715); } }
      c.globalAlpha = sub; W.fade = sub;
      if (t > 12.0) W.chip(...EDGE, { icon: 'shield', k: sp(t, 12.0), color: B.blue, w: 44, h: 44 });
      c.restore();
    });
    const BOTS = Array.from({ length: 9 }, (_, i) => ({ i, a: -2.6 + i * .62, t0: 12.0 + i * .17, hit: 12.55 + i * .17 }));

    // HUD (game style): latency bar + value, bots blocked; top band below Instagram's bar, left-aligned
    const hud = E.el('div', `position:absolute;left:30px;right:30px;top:104px;opacity:0;display:flex;flex-direction:column;gap:8px;font:700 12px ${MONO};letter-spacing:.14em;color:${B.slate}`, world);
    hud.innerHTML = `<div style="display:flex;align-items:center;gap:10px">LATENCY<div style="flex:1;height:10px;border-radius:5px;background:#16203a;overflow:hidden;box-shadow:0 0 0 1px #24345e"><div class="lb" style="height:100%;width:0;border-radius:5px"></div></div><span class="lv" style="width:62px;text-align:right;font-size:18px;letter-spacing:0"></span></div>
      <div class="bb" style="display:flex;gap:10px;opacity:0">BOTS BLOCKED <span class="bv" style="color:${B.lime};letter-spacing:0;font-size:14px">0</span></div>`;
    const lb = hud.querySelector('.lb'), lv = hud.querySelector('.lv'), bb = hud.querySelector('.bb'), bv = hud.querySelector('.bv');
    P.on((t) => { hud.style.opacity = (clamp((t - 2.6) / .3) * (1 - tw(t, 13.95, .2, 'snap')) * (1 - .6 * tw(t, 7.25, .25) * (1 - tw(t, 8.45, .2)))).toFixed(3);
      const lat = t < 8.6 ? 0.1 + 2.7 * P.EASE.glide(clamp((t - 3.3) / 3.4)) : lerp(2.8, .4, P.EASE.glide(clamp((t - 9.0) / .6)));
      const bad = lat > 1.2; lb.style.width = (Math.min(1, lat / 3) * 100).toFixed(1) + '%'; lb.style.background = bad ? B.coral : B.lime; lb.style.boxShadow = `0 0 12px ${bad ? B.coral : B.lime}`;
      lv.textContent = lat.toFixed(1) + 's'; lv.style.color = bad ? B.coral : B.lime;
      bb.style.opacity = clamp((t - 12.0) / .3).toFixed(3); bv.textContent = String(Math.round(128 * P.EASE.glide(clamp((t - 12.4) / 1.4)))); });

    // type layers: the hook (0-2.3) dives into the loader; "Each second, people leave."; the breath; the payoff number handed off from the HUD
    const T = (html, css) => E.el('div', `position:absolute;left:30px;right:30px;text-align:center;color:${B.paper};font:900 40px/1 Archivo,sans-serif;font-variation-settings:"wdth" 92;letter-spacing:-.01em;word-spacing:.06em;opacity:0;${css}`, world, html);
    const spin = E.el('div', `position:absolute;left:166px;top:150px;width:70px;height:70px;border-radius:50%;border:8px solid rgba(243,245,248,.12);border-top-color:${B.coral};box-shadow:0 0 30px rgba(255,90,79,.35);opacity:0`, world);
    const h1 = T('Why is your site', 'top:250px'), h2 = T('SLOW', `top:300px;font-size:112px;line-height:.9;color:${B.coral};font-variation-settings:"wdth" 96;white-space:nowrap;text-shadow:0 0 26px rgba(255,90,79,.55)`), h3 = T('abroad?', 'top:410px;font-size:46px');
    P.on((t) => { const out = tw(t, 2.15, .3, 'snap');
      spin.style.opacity = (clamp((t + .2) / .2) * (1 - out)).toFixed(3); spin.style.transform = `rotate(${(t * 540).toFixed(0)}deg) scale(${(1 + out * 9).toFixed(3)})`;
      [[h1, -.2], [h2, -.05], [h3, .12]].forEach(([el, a]) => { const k = sp(t, a, 'fade'); el.style.opacity = (clamp(k * 1.3) * (1 - out)).toFixed(3); el.style.transform = `translateY(${((1 - k) * 22).toFixed(1)}px) scale(${(1 + out * 2.2).toFixed(3)})`; }); });
    const p1 = T('Each second,<br><span style="color:' + B.coral + ';text-shadow:0 0 22px rgba(255,90,79,.5)">people leave.</span>', 'top:206px;font-size:44px;line-height:1.05');
    const br = T('Now add <span style="color:' + B.lime + ';text-shadow:0 0 22px rgba(198,244,50,.5)">the edge.</span>', 'top:300px;font-size:46px');
    const big = E.el('div', `position:absolute;left:0;right:0;top:236px;text-align:center;font:900 150px/1 Archivo,sans-serif;font-variation-settings:"wdth" 92;letter-spacing:-.03em;color:${B.lime};text-shadow:0 0 40px rgba(198,244,50,.55);opacity:0`, world, '0.4s');
    const tag = T('Fast everywhere.<br><span style="color:' + B.blue + ';text-shadow:0 0 18px rgba(47,107,255,.6)">Protected everywhere.</span>', 'top:420px;font-size:32px;line-height:1.15');
    P.on((t) => { const k1 = sp(t, 5.75, 'fade'); p1.style.opacity = (k1 * (1 - tw(t, 7.1, .2, 'snap'))).toFixed(3); p1.style.transform = `translateX(${((1 - k1) * -30).toFixed(1)}px)`;
      br.style.opacity = (P.springAt(t, 7.55, 'fade') * (1 - tw(t, 8.4, .15, 'snap'))).toFixed(3);
      const kb = sp(t, 13.95, 'bold'); big.style.opacity = (clamp(kb * 1.4) * (1 - tw(t, 16.0, .15, 'snap'))).toFixed(3);   // flies from the HUD's corner to centre
      big.style.transform = `translate(${lerp(120, 0, kb).toFixed(1)}px,${lerp(-150, 0, kb).toFixed(1)}px) scale(${lerp(.14, 1, kb).toFixed(3)})`;
      const kt = sp(t, 14.6); tag.style.opacity = (clamp(kt * 1.3) * (1 - tw(t, 16.0, .15, 'snap'))).toFixed(3); tag.style.transform = `translateY(${((1 - kt) * 18).toFixed(1)}px)`; });

    P.captions([[2.7, 5.4, 'One far-away server.', 26, { 2: B.coral }], [8.8, 11.8, 'Close to every shopper.', 26, { 3: B.lime }], [12.2, 13.7, 'Bad bots get blocked.', 26, { 1: B.coral }]], { style: 'pill' });
    P.brandEnd({ at: 16.1, keyword: 'FAST' });
    S.name = 'Kitebox edge v3';
    return { ok: true };
  };
  S.update = function (E, t) { P.update(t); };
  S.cues = () => [];
})();
