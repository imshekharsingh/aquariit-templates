// techkit/kit3d.js: shared craft for the 3D tech reels (design/tech-direction.md; owner, 23 Nov 2026: "put the fixes in kit first").
// Inlined by techkit/make.py at the <!--KIT3D--> marker of a standalone scene, after three.js. Everything is a pure function of its inputs.
//   KIT3D.cut(kind, u, opt)        five kinds of shot change, each carried through into the next shot, never through black:
//                                  'match' (cut on a shape), 'push' (through a part into the next shot), 'rack' (focus dissolve),
//                                  'wipe' (a band of light crosses the frame), 'whip' (one fast pan, smeared)
//   KIT3D.compose(o, A, B, st)     draws the outgoing frame A and the incoming frame B for that cut state
//   KIT3D.plan / KIT3D.smear       real motion blur: a few time samples, each smeared along the camera's own screen motion (no stepped copies)
//   KIT3D.glide / KIT3D.push       never fully still: a move that keeps speed at both ends, and a slow push under every hold
//   KIT3D.word(o, text, kind, ..)  six ways a bold word arrives: slam, rise, track, stamp, wipe, drop
//   KIT3D.materials(THREE, ctex)   dark epoxy chips (cyan only as an edge glow), metal and gold that stay metal, battery, screen glass, rack sides
//   KIT3D.light(THREE, scene)      key + two rim lights + fill, about 15% brighter than the first 3D reel
window.KIT3D = (() => {
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, u) => a + (b - a) * u;
  const prog = (t, a, b) => clamp((t - a) / (b - a));
  const ease = (u) => (u = clamp(u), u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
  const eout = (u) => 1 - Math.pow(1 - clamp(u), 3);
  const eout5 = (u) => 1 - Math.pow(1 - clamp(u), 5);
  const ein = (u) => Math.pow(clamp(u), 3);
  const eback = (u) => { u = clamp(u); const c = 1.6; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };
  const smooth = (u) => (u = clamp(u), u * u * (3 - 2 * u));

  // ---------- 1. shot changes ----------
  // u runs 0..1 over the cut's window (centred on the boundary). Returns what each side's camera does and how the two frames mix:
  //   out / in: { dolly (share of the way to the push target; negative = start further back), yaw (rad), truck (-1..1), blur (px), match (0..1) }
  //   mix (0 = outgoing only, 1 = incoming only), wipe (0..1 position of the light band, or null), flash (0..1 additive glow)
  const DUR = { match: .5, push: .62, rack: .7, wipe: .56, whip: .44 };
  function cut(kind, u, opt = {}) {
    const dir = opt.dir || 1, z = { dolly: 0, yaw: 0, truck: 0, blur: 0, match: 0 };
    if (kind === 'whip') { const Y = opt.yaw || .6;
      return { out: { ...z, yaw: -dir * Y * ein(u / .6) }, in: { ...z, yaw: dir * Y * (1 - eout5((u - .38) / .62)) }, mix: smooth(prog(u, .3, .7)), wipe: null, flash: 0 }; }
    if (kind === 'push') return { out: { ...z, dolly: (opt.depth || .8) * ein(u / .6) }, in: { ...z, dolly: -(opt.back || .45) * (1 - eout5((u - .4) / .6)) },
      mix: smooth(prog(u, .44, .62)), wipe: null, flash: (opt.flash == null ? .5 : opt.flash) * Math.sin(Math.PI * prog(u, .28, .8)) };
    if (kind === 'rack') { const R = opt.blur || 30;
      return { out: { ...z, blur: R * ease(u / .6) }, in: { ...z, blur: R * (1 - ease((u - .3) / .7)) }, mix: smooth(prog(u, .3, .7)), wipe: null, flash: 0 }; }
    if (kind === 'wipe') return { out: { ...z, truck: dir * .5 * ein(u) }, in: { ...z, truck: -dir * .5 * (1 - eout(u)) }, mix: .5, wipe: dir > 0 ? smooth(u) : 1 - smooth(u), flash: 0, dir };
    // match: the outgoing camera settles on the shared shape, a three-frame dissolve, the incoming one starts on the same shape and pulls away
    return { out: { ...z, match: ease(u / .5) }, in: { ...z, match: 1 - eout((u - .5) / .5) }, mix: smooth(prog(u, .44, .56)), wipe: null, flash: 0 };
  }
  function compose(o, A, B, st, W, H, opt = {}) {
    const col = opt.color || '255,174,61';
    o.save(); o.globalAlpha = 1;
    if (st.wipe == null) {
      if (st.mix < 1) { o.filter = st.out.blur > .5 ? `blur(${st.out.blur.toFixed(1)}px)` : 'none'; o.drawImage(A, 0, 0, W, H); }
      if (st.mix > 0) { o.globalAlpha = st.mix; o.filter = st.in.blur > .5 ? `blur(${st.in.blur.toFixed(1)}px)` : 'none'; o.drawImage(B, 0, 0, W, H); }
      o.filter = 'none';
      if (st.flash > .01) { o.globalAlpha = 1; o.globalCompositeOperation = 'lighter'; const g = o.createRadialGradient(W / 2, H * (opt.fy || .5), 0, W / 2, H * (opt.fy || .5), H * .75);
        g.addColorStop(0, `rgba(${col},${(.75 * st.flash).toFixed(3)})`); g.addColorStop(.45, `rgba(${col},${(.28 * st.flash).toFixed(3)})`); g.addColorStop(1, `rgba(${col},0)`); o.fillStyle = g; o.fillRect(0, 0, W, H); }
    } else {   // a slanted band of light crosses the frame; the next shot is behind it
      const sl = H * .2, x = lerp(-sl - 160, W + sl + 160, st.wipe), back = st.dir < 0;
      o.drawImage(back ? B : A, 0, 0, W, H);
      o.save(); o.beginPath(); o.moveTo(x + sl, 0); o.lineTo(x - sl, H); o.lineTo(-10, H); o.lineTo(-10, 0); o.closePath(); o.clip(); o.drawImage(back ? A : B, 0, 0, W, H); o.restore();
      o.globalCompositeOperation = 'lighter'; o.translate(x, H / 2); o.rotate(Math.atan2(2 * sl, H));
      const a = Math.sin(Math.PI * clamp(st.wipe)), g = o.createLinearGradient(-230, 0, 230, 0);
      g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(.42, `rgba(${col},${(.34 * a).toFixed(3)})`); g.addColorStop(.5, `rgba(255,240,214,${(.95 * a).toFixed(3)})`); g.addColorStop(.58, `rgba(${col},${(.34 * a).toFixed(3)})`); g.addColorStop(1, `rgba(${col},0)`);
      o.fillStyle = g; o.fillRect(-230, -H, 460, 2 * H);
    }
    o.restore();
  }

  // ---------- 2. motion blur ----------
  // plan: how many time samples a frame needs, from how far the picture moves during the shutter (px at 1080 wide)
  const plan = (px, dof, busy) => Math.max(px < 2 ? 4 : px < 14 ? 5 : px < 80 ? 6 : 8, dof ? 10 : 0, busy ? 6 : 0);
  // smear: draws one time sample n times along the similarity (shift + zoom about p) that takes it to the next sample, so the gaps
  // between samples are filled. a = this sample's two reference points on screen, b = the same points one sample step later.
  function smear(ctx, src, a, b, W, H) {
    const la = Math.hypot(a[2] - a[0], a[3] - a[1]) || 1, s = clamp(Math.hypot(b[2] - b[0], b[3] - b[1]) / la, .5, 2), dx = b[0] - a[0], dy = b[1] - a[1];
    const far = Math.hypot(dx, dy) + Math.abs(s - 1) * 1100, n = clamp(Math.round(far / 2.5), 1, 14);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    for (let j = 0; j < n; j++) { const f = n === 1 ? 0 : j / (n - 1) - .5, sf = Math.pow(s, f);
      ctx.globalAlpha = 1 / (j + 1); ctx.setTransform(sf, 0, 0, sf, a[0] + dx * f - sf * a[0], a[1] + dy * f - sf * a[1]); ctx.drawImage(src, 0, 0, W, H); }
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; return n;
  }
  // sub-pixel offsets for the time samples (Halton 2, 3): the samples also antialias the still parts
  const jitter = (i) => { const h = (b) => { let f = 1, r = 0, k = i + 1; while (k > 0) { f /= b; r += f * (k % b); k = Math.floor(k / b); } return r - .5; }; return [h(2), h(3)]; };

  // ---------- 3. never fully still ----------
  const glide = (u, k = .3) => lerp(clamp(u), ease(u), k);            // a move that still has speed at both ends of its shot
  const push = (secs, rate = .022) => 1 - Math.exp(-rate * secs);     // share of the way to the subject after `secs` of hold (about 2% a second)

  // ---------- 4. bold words: six ways to arrive (a word never moves after it has landed; exits are shorter than arrivals) ----------
  const IN = { slam: .27, rise: .36, track: .42, stamp: .1, wipe: .3, drop: .32 };
  function word(o, text, kind, t, t0, t1, opt = {}) {
    const u = prog(t, t0 - .05, t0 - .05 + (IN[kind] || .3)), out = prog(t, t1 - .16, t1); if (t < t0 - .05 || out >= 1) return null;
    const size = opt.size || 250, y = opt.y || 520, x = opt.x || 540, font = `900 ${size}px "Inter Display", Inter, sans-serif`;
    o.save(); o.font = font; o.textAlign = 'center'; o.textBaseline = 'alphabetic'; o.fillStyle = opt.color || '#f4f6f8';
    const w = o.measureText(text).width; let a = 1 - out;
    o.translate(x, y - 14 * ein(out));
    if (opt.glow) { o.shadowColor = opt.glow; o.shadowBlur = 70; }
    if (kind === 'slam') { const s = lerp(1.9, 1, eback(u)); a *= clamp(u * 3); o.scale(s, s); }
    else if (kind === 'drop') { a *= clamp(u * 3); o.translate(0, -size * .5 * (1 - eback(u))); }
    else if (kind === 'stamp') { const s = lerp(1.07, 1, eout(u)); o.scale(s, s); }
    else if (kind === 'track') { const ls = (1 - eout5(u)) * .32 * size; a *= clamp(u * 2.4); o.letterSpacing = ls.toFixed(1) + 'px'; o.translate(ls / 2, 0); }
    else if (kind === 'rise') { o.beginPath(); o.rect(-w / 2 - 60, -size * .9, w + 120, size * .98); o.clip(); o.translate(0, size * .95 * (1 - eout5(u))); }
    else if (kind === 'wipe') { o.beginPath(); o.rect(-w / 2 - 20, -size, (w + 40) * eout(u), size * 1.3); o.clip(); }
    o.globalAlpha = clamp(a);
    if (opt.split > 0) {   // the word is sliced along a line through its middle: the halves slip apart a little
      const d = 15 * clamp(opt.split), cy = -size * .36;
      o.save(); o.beginPath(); o.rect(-w, -size * 1.1, 2 * w, size * 1.1 + cy); o.clip(); o.fillText(text, -d, 0); o.restore();
      o.save(); o.beginPath(); o.rect(-w, cy + 5, 2 * w, size); o.clip(); o.fillText(text, d, 0); o.restore();
    } else o.fillText(text, 0, 0);
    o.restore();
    return a > .3 ? [text, x - w / 2, x + w / 2, y - size * .74, y + size * .02] : null;
  }

  // ---------- 5. materials and light ----------
  function materials(THREE, ctex, opt = {}) {
    const mono = '"Inter Display", Inter, sans-serif';
    // packaged silicon: a matte black epoxy top with a soft sheen and a faint laser marking; colour comes only from the edge glow
    const epoxy = (wpx, hpx, l1, l2, vertical) => ctex(wpx, hpx, (c, w, h) => {
      c.fillStyle = '#0d0f12'; c.fillRect(0, 0, w, h);
      const g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, 'rgba(255,255,255,.07)'); g.addColorStop(.5, 'rgba(255,255,255,.015)'); g.addColorStop(1, 'rgba(0,0,0,.25)'); c.fillStyle = g; c.fillRect(0, 0, w, h);
      for (let i = 0; i < 900; i++) { c.fillStyle = `rgba(255,255,255,${(.012 + .02 * ((i * 7919) % 13) / 13).toFixed(3)})`; c.fillRect((i * 2654435761) % w, (i * 40503) % h, 2, 2); }   // mould texture
      c.strokeStyle = 'rgba(255,255,255,.06)'; c.lineWidth = 3; c.strokeRect(7, 7, w - 14, h - 14);
      c.fillStyle = 'rgba(170,178,190,.34)'; c.beginPath(); c.arc(vertical ? 30 : 38, vertical ? 30 : 38, vertical ? 9 : 11, 0, 7); c.fill();
      c.save(); if (vertical) { c.translate(w * .62, h - 44); c.rotate(-Math.PI / 2); } else c.translate(84, h * .5);
      c.fillStyle = 'rgba(176,184,196,.42)'; c.font = `600 ${vertical ? 38 : 50}px ${mono}`; c.fillText(l1, 0, 0);
      c.fillStyle = 'rgba(150,158,170,.3)'; c.font = `500 ${vertical ? 26 : 31}px ${mono}`; c.fillText(l2, 2, vertical ? 40 : 50); c.restore();
    });
    const battery = ctex(512, 512, (c, w, h) => {
      const g = c.createLinearGradient(0, 0, w, 0); g.addColorStop(0, '#191c21'); g.addColorStop(.5, '#23272e'); g.addColorStop(1, '#16181c'); c.fillStyle = g; c.fillRect(0, 0, w, h);
      c.strokeStyle = 'rgba(255,255,255,.035)'; c.lineWidth = 1; for (let x = 0; x < w; x += 6) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); }   // brushed wrap
      c.fillStyle = 'rgba(210,216,226,.5)'; c.font = `700 30px ${mono}`; c.fillText('Li-ion', 46, 96);
      c.fillStyle = 'rgba(190,196,206,.34)'; c.font = `500 20px ${mono}`; c.fillText('5000 mAh   19.4 Wh   3.87 V', 46, 132);
      c.fillStyle = 'rgba(190,196,206,.2)'; for (let i = 0; i < 5; i++) c.fillRect(46, 160 + i * 14, 200 + ((i * 53) % 140), 5);
      c.strokeStyle = 'rgba(210,216,226,.3)'; c.lineWidth = 3; c.strokeRect(380, 70, 84, 60); c.beginPath(); c.moveTo(400, 100); c.lineTo(444, 100); c.moveTo(422, 82); c.lineTo(422, 118); c.stroke();
      c.fillStyle = 'rgba(255,174,61,.5)'; c.fillRect(0, h - 70, w, 10);          // the pull tab's stripe
      c.fillStyle = 'rgba(0,0,0,.3)'; c.fillRect(0, h - 60, w, 60);
    });
    const rackSide = ctex(256, 1024, (c, w, h) => {
      const g = c.createLinearGradient(0, 0, w, 0); g.addColorStop(0, '#22262d'); g.addColorStop(.5, '#2d323a'); g.addColorStop(1, '#1b1e24'); c.fillStyle = g; c.fillRect(0, 0, w, h);
      c.fillStyle = 'rgba(0,0,0,.55)'; for (let y = 60; y < h - 60; y += 16) for (let x = 40; x < w - 40; x += 16) { c.beginPath(); c.arc(x + ((y / 16) % 2) * 8, y, 3.2, 0, 7); c.fill(); }   // perforated panel
      c.strokeStyle = 'rgba(255,255,255,.1)'; c.lineWidth = 4; c.strokeRect(10, 10, w - 20, h - 20);
      c.fillStyle = 'rgba(255,255,255,.14)'; c.fillRect(0, 0, 5, h); c.fillRect(w - 5, 0, 5, h);
    });
    const P = THREE.MeshPhysicalMaterial, S = THREE.MeshStandardMaterial;
    return {
      epoxy, tex: { battery, rackSide },
      chipTop: (map, sig) => new P({ color: 0xffffff, map, roughness: .42, metalness: .05, clearcoat: .45, clearcoatRoughness: .38, envMapIntensity: .8, emissive: sig, emissiveIntensity: 0 }),
      chipSide: new S({ color: 0x0a0b0d, roughness: .55, metalness: .1 }),
      metal: new P({ color: 0xb9c0c9, metalness: 1, roughness: .24, clearcoat: .5, clearcoatRoughness: .25, envMapIntensity: 1.35 }),
      darkMetal: new P({ color: 0x5c636d, metalness: 1, roughness: .32 }),
      gold: new P({ color: 0xb8842f, metalness: 1, roughness: .4, envMapIntensity: .42 }),          // stays gold under a moving light
      battery: new P({ color: 0xffffff, map: battery, metalness: .55, roughness: .42, clearcoat: .35, clearcoatRoughness: .4, envMapIntensity: .55 }),
      glass: (map) => new P({ color: 0x06080b, metalness: .2, roughness: .08, clearcoat: 1, clearcoatRoughness: .04, emissive: 0xffffff, emissiveMap: map, emissiveIntensity: 0 }),
      rackSide: new S({ color: 0xffffff, map: rackSide, metalness: .75, roughness: .4, envMapIntensity: .6 }),
      floor: new S({ color: 0x101216, metalness: .9, roughness: .28 }),
    };
  }
  function light(THREE, scene) {
    const key = new THREE.DirectionalLight(0xffffff, 2.5); key.position.set(4, 7, 9); scene.add(key);
    const rim = new THREE.DirectionalLight(0xbfe9ff, 2.9); rim.position.set(-6, 2.5, -5); scene.add(rim);       // the cool rim from behind left
    const rim2 = new THREE.DirectionalLight(0xffd9a8, 1.5); rim2.position.set(7, -1, -5); scene.add(rim2);     // a warm kicker from behind right
    const fill = new THREE.HemisphereLight(0x9ab0c8, 0x08090b, .5); scene.add(fill);
    return { key, rim, rim2, fill, exposure: 1.2 };
  }

  return { clamp, lerp, prog, ease, eout, eout5, ein, eback, smooth, DUR, cut, compose, plan, smear, jitter, glide, push, word, materials, light };
})();
