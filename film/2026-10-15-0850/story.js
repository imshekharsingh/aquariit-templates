// FILM v4 (premium test): "Is your site slow abroad?" (service: edge). 15 Oct 2026, the first film in the premium "cinematic tech" style (design/brand/premium.md):
// 28 s, seven calm beats, one idea per frame, glass and light, long-tail easing, holds after every reveal, a real 3D hero shot, a slower natural voice.
// 0.0 hook type in a soft spotlight | 3.2 the distance: London shopper and a server in Mumbai, a thin light beam draws, one slow pulse crosses 7,200 km |
// 7.6 "Every second, people leave." | 10.6 breath (dark) | 11.4 3D HERO: a glass edge node descends onto a dark mirror floor, its core lights up | 16.1 the edge
// next to the shopper, short beam, calm quick pulses, 0.4 s | 20.6 a thin glass ring forms, three bots fade out against it, "Protected." | 23.6 brand ending.
(function () {
  const E = window.FilmEngine, P = window.FilmParts, { clamp, lerp } = E, S = (E.story = {});
  S.selfStage = true;
  S.dna = {
    service: 'edge',
    format: 'problem-fix',
    opening: 'premium type in a soft spotlight: "Is your site / slow abroad?" settling word by word on navy',
    bigMoment: 'a real 3D glass edge node descends onto a mirror floor and its lime core lights, then the light path shrinks from 7,200 km to next door',
    ground: 'cinematic navy with soft blue light, glass and one lime accent',
    music: 'warm ambient pads with a soft pulse, rising gently into the edge reveal, about 90 BPM',
  };
  const B = P.BRAND, MONO = "'Geist Mono',ui-monospace,monospace", INK = '#070B16';
  const sp = (t, t0, n = 'default') => P.springAt(t, t0, n), tw = (t, t0, d, n = 'glide') => P.tween(t, t0, d, n);
  const PH = [92, 430], SRV = [312, 300], EDGE = [150, 372];
  const LONG = [PH, [140, 230], [250, 170], SRV], SHORT = [PH, [100, 400], [128, 380], EDGE];
  // slow camera keys [t, x, y, s]: each move takes 1 s or more, then holds
  const CAM = [[0, 201, 357, 1], [3.2, 201, 357, 1], [4.6, 202, 352, 1.08], [7.4, 205, 350, 1.12], [16.1, 150, 400, 1.35], [19.8, 150, 395, 1.42], [20.6, 150, 380, 1.6], [23.5, 150, 378, 1.66], [28, 150, 378, 1.66]];
  const camAt = (t) => { let i = 0; while (i < CAM.length - 2 && t > CAM[i + 1][0]) i++; const a = CAM[i], b = CAM[i + 1], k = P.EASE.glide(clamp((t - a[0]) / Math.max(.01, b[0] - a[0])));
    return [lerp(a[1], b[1], k), lerp(a[2], b[2], k), lerp(a[3], b[3], k)]; };
  const IN = (t, a, b, d = .5) => clamp((t - a) / d) * (1 - clamp((t - b) / d));     // visible from a to b with soft fades

  S.setup = async function () {
    document.documentElement.classList.add('reel');
    await P.ready; await document.fonts.ready;
    const { world } = P.scene({ accent: B.lime, ink: INK, glow: 'rgba(60,100,230,.10)', len: 28 });
    P.use('opener', 'spotlight-type'); P.use('transition', 'calm-glide'); P.use('payoff', 'light-path-shrinks'); P.use('type', 'premium-minimal'); P.use('focus', 'soft-spotlight');

    // ---- the 2D world (beats 2, 5, 6) ----
    const W = P.sys(world, { bg: INK });
    W.draw((c, t) => {
      const [x, y, s] = camAt(t); W.cam.x = x; W.cam.y = y; W.cam.s = s;
      const before = IN(t, 3.2, 7.4, .6), after = IN(t, 16.1, 23.4, .6);
      if (before <= 0 && after <= 0) return;
      W.fade = Math.max(before, after);
      W.spot(201, 380, 320, { color: 'rgba(60,100,230,.16)' });
      // the distance (before)
      if (before > 0) { W.fade = before;
        W.beam(LONG, P.EASE.glide(clamp((t - 4.0) / 1.6)), {});
        W.pulse(LONG, P.EASE.swing(clamp((t - 5.2) / 2.0)), { color: '#FFB4A8' });
        W.glassNode(...PH, { k: sp(t, 3.4), label: 'Your shopper', sub: 'London' });
        W.glassNode(...SRV, { k: sp(t, 3.9), label: 'Your server', sub: 'Mumbai · 7,200 km' }); }
      // the edge (after): short beam, calm quick pulses, then a glass ring with bots fading out against it
      if (after > 0) { W.fade = after;
        W.glassNode(...SRV, { k: .5, label: '', sub: '' });
        W.beam(SHORT, P.EASE.glide(clamp((t - 16.6) / .8)), { color: 'rgba(198,244,50,.7)', width: 1.8 });
        for (let i = 0; i < 3; i++) { const u = (t - 17.6 - i * 1.0) / .45; W.pulse(SHORT, P.EASE.swing(clamp(u)), { color: B.lime, trail: .4 }); }
        W.glassNode(...PH, { k: 1, label: 'Your shopper', sub: 'London' });
        W.glassNode(...EDGE, { k: 1, r: 24, coreOn: 1, label: 'Edge', sub: '20 km away' });
        if (t > 20.6) { const [ex, ey] = W.toS(...EDGE), rr = 58 * s, kr = P.EASE.glide(clamp((t - 20.7) / 1.0));
          c.save(); c.globalAlpha = after * kr * .9; c.strokeStyle = 'rgba(190,210,255,.8)'; c.lineWidth = 1.5 * s; c.beginPath(); c.arc(ex, ey, rr, -1.57, -1.57 + 6.283 * kr); c.stroke(); c.restore();
          [[-2.4, 21.4], [-.6, 21.9], [.9, 22.4]].forEach(([a, t0]) => { const k = clamp((t - t0) / 1.1), d = lerp(150, 62, P.EASE.glide(k)), [bx, by] = W.toS(EDGE[0] + Math.cos(a) * d, EDGE[1] + Math.sin(a) * d);
            if (k <= 0) return; c.save(); c.globalAlpha = after * (k < .8 ? 1 : 1 - (k - .8) / .2); c.fillStyle = B.coral; c.beginPath(); c.arc(bx, by, 3.2 * s, 0, 6.283); c.fill(); c.restore(); }); } }
    });

    // ---- the 3D hero (beat 4): a glass edge node descends onto a dark mirror floor ----
    const G = P.three(world, { bg: INK, fov: 30, exposure: 1.25, active: [[11.3, 16.2]], studio: [['#ffffff', 7, [0, 6, 3], [7, 2.5]], ['#7f9cff', 5, [-6, 2.5, 1], [2.5, 6]], ['#ffffff', 4, [6, 3, -2], [2.5, 6]], ['#9fb6ff', 2, [0, 1.5, -7], [9, 3]]] });
    const T3 = G.T, grp = new T3.Group(); G.scene.add(grp);
    const glass = new T3.MeshPhysicalMaterial({ color: 0xb9c8f0, metalness: .35, roughness: .2, transmission: .3, thickness: .9, ior: 1.5, clearcoat: 1, clearcoatRoughness: .03, sheen: .5, sheenColor: new T3.Color('#c8d6ff'), emissive: new T3.Color('#1a2550'), emissiveIntensity: .2, envMapIntensity: 3.2 });
    const node = new T3.Mesh(new T3.CylinderGeometry(.62, .62, .34, 6), glass); grp.add(node);
    const rim = new T3.Mesh(new T3.TorusGeometry(.66, .025, 12, 72), new T3.MeshStandardMaterial({ color: 0xdfe8ff, metalness: 1, roughness: .2 })); rim.rotation.x = Math.PI / 2; grp.add(rim);
    const coreM = new T3.MeshStandardMaterial({ color: 0x0d1408, emissive: new T3.Color(B.lime), emissiveIntensity: 0 });
    const core = new T3.Mesh(new T3.SphereGeometry(.09, 32, 16), coreM); grp.add(core);
    const floor = new T3.Mesh(new T3.CircleGeometry(60, 96), new T3.MeshStandardMaterial({ color: 0x070b16, metalness: .85, roughness: .32 })); G.scene.fog = new T3.Fog(INK, 8, 22); floor.rotation.x = -Math.PI / 2; floor.position.y = -.17; G.scene.add(floor);
    const glowRing = new T3.Mesh(new T3.RingGeometry(.7, .712, 128), new T3.MeshBasicMaterial({ color: new T3.Color(B.lime), transparent: true, opacity: 0 })); glowRing.rotation.x = -Math.PI / 2; glowRing.position.y = -.165; G.scene.add(glowRing);
    G.frame((t) => {
      const land = P.EASE.glide(clamp((t - 11.6) / 2.0)); grp.position.y = lerp(2.4, 0, land); grp.rotation.y = .4 + t * .12;
      const lit = P.EASE.glide(clamp((t - 13.5) / .9)); coreM.emissiveIntensity = 1.8 * lit; glowRing.material.opacity = .55 * lit * (1 - clamp((t - 14.4) / 1.4) * .7); glowRing.scale.setScalar(1 + .9 * P.EASE.glide(clamp((t - 13.6) / 1.6)));
      const a = .9 + (t - 11.3) * .07, r = lerp(9.5, 6.0, P.EASE.glide(clamp((t - 11.3) / 4.8))), h = lerp(3.6, 2.2, P.EASE.glide(clamp((t - 11.3) / 4.8)));
      G.camera.position.set(Math.sin(a) * r, h, Math.cos(a) * r); G.camera.lookAt(0, .35, 0);
    });

    // ---- type (premium: few words, big, calm) ----
    const T = (html, css) => E.el('div', `position:absolute;left:30px;right:30px;text-align:center;color:${B.paper};font:800 40px/1.05 Archivo,sans-serif;font-variation-settings:"wdth" 96;letter-spacing:-.015em;word-spacing:.05em;opacity:0;${css}`, P.front, html);
    const w1 = T('Is your site', 'top:262px;font-size:38px'), w2 = T(`slow <span style="color:${B.coral}">abroad?</span>`, 'top:310px;font-size:54px');
    const glowSpot = E.el('div', 'position:absolute;left:-60px;right:-60px;top:120px;height:460px;background:radial-gradient(50% 50% at 50% 50%,rgba(90,130,255,.18),rgba(0,0,0,0) 70%);opacity:0', world);
    const c1 = T('Every second,', 'top:268px;font-size:40px'), c2 = T(`people <span style="color:${B.coral}">leave.</span>`, 'top:316px;font-size:52px');
    const meter = E.el('div', `position:absolute;left:0;right:0;top:396px;text-align:center;font:500 22px/1 ${MONO};color:rgba(160,172,196,.9);opacity:0`, P.front);
    const edgeT = T(`The <span style="color:${B.lime}">edge.</span>`, 'top:150px;font-size:48px');
    const fastT = E.el('div', `position:absolute;left:0;right:0;top:150px;text-align:center;font:800 64px/1 Archivo,sans-serif;color:${B.lime};letter-spacing:-.02em;opacity:0`, P.front, '0.4s');
    const fastS = E.el('div', `position:absolute;left:0;right:0;top:222px;text-align:center;font:500 13px/1 ${MONO};letter-spacing:.2em;color:rgba(160,172,196,.9);opacity:0`, P.front, 'FROM 2.8s, ANYWHERE');
    const protT = T('Protected.', 'top:150px;font-size:48px');
    P.on((t) => {
      glowSpot.style.opacity = IN(t, -1, 3.0, .6).toFixed(3);
      [[w1, .1], [w2, .7]].forEach(([el, a]) => { const k = tw(t, a, 1.0); el.style.opacity = (k * IN(t, -1, 2.9, .5)).toFixed(3); el.style.transform = `translateY(${((1 - k) * 14).toFixed(1)}px)`; });
      [[c1, 7.7], [c2, 8.3]].forEach(([el, a]) => { const k = tw(t, a, 1.0); el.style.opacity = (k * IN(t, -1, 10.3, .5)).toFixed(3); el.style.transform = `translateY(${((1 - k) * 14).toFixed(1)}px)`; });
      meter.style.opacity = (tw(t, 8.9, .8) * IN(t, -1, 10.3, .5)).toFixed(3); meter.textContent = (2.8 * P.EASE.glide(clamp((t - 8.9) / 1.2))).toFixed(1) + ' s to load';
      const ke = tw(t, 14.0, 1.0); edgeT.style.opacity = (ke * IN(t, -1, 16.0, .4)).toFixed(3); edgeT.style.transform = `translateY(${((1 - ke) * 12).toFixed(1)}px)`;
      const kf = tw(t, 18.4, .9); fastT.style.opacity = (kf * IN(t, -1, 20.4, .5)).toFixed(3); fastS.style.opacity = (tw(t, 18.9, .8) * IN(t, -1, 20.4, .5)).toFixed(3);
      const kp = tw(t, 21.0, 1.0); protT.style.opacity = (kp * IN(t, -1, 23.3, .5)).toFixed(3);
    });
    P.brandEnd({ at: 23.6, keyword: 'FAST', why: 'What’s slowing your site down?', out: 27.8 });
    S.name = 'Edge premium v4';
    return { ok: true };
  };
  S.update = function (E, t) { P.update(t); };
  S.cues = () => [];
})();
