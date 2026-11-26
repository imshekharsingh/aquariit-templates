// techkit/lib3d.js: phase 2 of the colour-world 3D kit (26 Nov 2026). Adds to window.W3D (load after world3d.js; make.py and scripts/3dkit-assemble.py inline both at <!--WORLD3D-->).
//   W3D.lib.phone / laptop / chip / rack / appTile / productBlock / codeCard / dialog (THREE, opts) -> THREE.Group, size in group.userData.size, floor-standing (y = 0 is its base)
//   W3D.lib.figure(THREE, '3x8=24', { height, color, radius })     big glossy 3D number figures built from tubes (digits 0-9 and + x = -), centred, facing +z
//   W3D.camPath(S, keys, { glide })(t)                             one continuous camera move through the world: keys [{ t, pos:[x,y,z], look:[x,y,z], fov }]
//   W3D.lib.appGlyphs                                              hand-drawn glyph painters for generic app tiles (pay, photos, notes, maps, files, chat, mail, calendar)
//   W3D.enter(obj, kind, u, { side, amp })                            v6 (26 Nov 2026, rules-tech.md D10): a motion-design entrance at progress u 0..1 (u <= 0 hidden, 1 home):
//                                                                  'slideTurn' | 'drop' | 'rise' | 'swing' | 'flip' | 'pop' | 'slam' (v7, for the 2-3 big moments); run u from 1 to 0 for an exit or a rewind
//   W3D.numbers({ y, w }).set(t, { show, from, to, k, top, typed, label, labelIn, bar, color, anchor, at, tick })   v7: flat odometer numbers with a bar and a leader line (one style)
//   W3D.headline({ y, words: [{ t, text, color }] })(t)   v7 render 3: one big headline word per beat, the one before it grey
//   W3D.wire(S, pts, { color, radius, plugs, shadow, curve })             v6 (D12): a matte cable through pts (let it lie on the floor to sag), plugs at both ends, a floor shadow;
//                                                                  .reveal(u) unrolls it (the end plug clicks in at the end), .pulse(k) the only glow (a bead along it), .curve / .tube
// Real product logos: appTile takes { logo: THREE.Texture } (a licensed file fetched by the Media workflow, design/safety.md item 7) in its logo slot; without one it draws the generic glyph.
(() => {
  const W3 = window.W3D, { clamp, lerp, tex, roundBox, roundedShape, gloss } = W3;
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
  const MONO = '"JetBrains Mono","DejaVu Sans Mono",ui-monospace,monospace', SANS = '"Inter Display",Inter,"DejaVu Sans",system-ui,sans-serif';
  const finish = (THREE, g) => { const b = new THREE.Box3().setFromObject(g), s = b.getSize(new THREE.Vector3()); g.userData.size = s; g.traverse((m) => { if (m.isMesh && m.userData.noShadow !== true) m.castShadow = true; }); return g; };
  const metal = (THREE) => new THREE.MeshStandardMaterial({ color: 0xd8dde6, roughness: .24, metalness: 1, envMapIntensity: 1.1 });
  const face = (THREE, w, h, map, o = {}) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map, transparent: true, toneMapped: o.toneMapped ?? false, opacity: o.opacity ?? 1 })); m.userData.noShadow = true; return m; };

  // ---------- generic app glyphs (drawn around (0,0) in a 256 box, colour c) ----------
  const appGlyphs = {
    pay: (c) => { c.fillStyle = '#fff'; rr(c, -64, -44, 128, 88, 14); c.fill(); c.fillStyle = 'rgba(0,0,0,.28)'; c.fillRect(-64, -22, 128, 20); c.fillRect(-48, 18, 40, 10); },
    photos: (c) => { ['#ffd24a', '#ff6a4a', '#7ad0ff', '#7aff9a'].forEach((k, i) => { c.save(); c.rotate(i * Math.PI / 2); c.fillStyle = k; c.globalAlpha = .95; c.beginPath(); c.ellipse(0, -34, 24, 40, 0, 0, 7); c.fill(); c.restore(); }); },
    notes: (c) => { c.fillStyle = '#fff'; rr(c, -50, -62, 100, 124, 12); c.fill(); c.fillStyle = 'rgba(0,0,0,.3)'; for (let i = 0; i < 4; i++) c.fillRect(-32, -36 + i * 24, 64 - (i === 3 ? 26 : 0), 8); },
    maps: (c) => { c.fillStyle = '#fff'; c.beginPath(); c.arc(0, -10, 44, Math.PI, 0); c.lineTo(0, 62); c.closePath(); c.fill(); c.fillStyle = 'rgba(0,0,0,.35)'; c.beginPath(); c.arc(0, -10, 16, 0, 7); c.fill(); },
    files: (c) => { c.fillStyle = '#fff'; rr(c, -62, -34, 124, 82, 12); c.fill(); c.beginPath(); c.moveTo(-62, -34); c.lineTo(-62, -52); c.lineTo(-14, -52); c.lineTo(4, -34); c.closePath(); c.fill(); },
    chat: (c) => { c.fillStyle = '#fff'; rr(c, -62, -48, 124, 82, 24); c.fill(); c.beginPath(); c.moveTo(-30, 30); c.lineTo(-40, 62); c.lineTo(0, 32); c.closePath(); c.fill(); c.fillStyle = 'rgba(0,0,0,.3)'; for (let i = -1; i <= 1; i++) { c.beginPath(); c.arc(i * 30, -8, 8, 0, 7); c.fill(); } },
    mail: (c) => { c.fillStyle = '#fff'; rr(c, -64, -42, 128, 84, 12); c.fill(); c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 8; c.lineJoin = 'round'; c.beginPath(); c.moveTo(-56, -34); c.lineTo(0, 12); c.lineTo(56, -34); c.stroke(); },
    tasks: (c) => { c.fillStyle = '#fff'; rr(c, -56, -56, 112, 112, 22); c.fill(); c.strokeStyle = 'rgba(0,0,0,.4)'; c.lineWidth = 14; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(-28, 2); c.lineTo(-6, 26); c.lineTo(32, -26); c.stroke(); },
    music: (c) => { c.fillStyle = '#fff'; c.beginPath(); c.ellipse(-22, 38, 22, 17, -.3, 0, 7); c.fill(); c.fillRect(-4, -50, 12, 90); c.beginPath(); c.moveTo(8, -50); c.quadraticCurveTo(52, -40, 46, -4); c.lineTo(36, -8); c.quadraticCurveTo(38, -30, 8, -34); c.closePath(); c.fill(); },
    spark: (c) => { c.fillStyle = '#fff'; c.beginPath(); for (let i = 0; i < 8; i++) { const r = i % 2 ? 18 : 58, a = i * Math.PI / 4 - Math.PI / 2; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); c.fill(); },
    calendar: (c) => { c.fillStyle = '#fff'; rr(c, -58, -54, 116, 112, 14); c.fill(); c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(-58, -54, 116, 28); for (let i = 0; i < 6; i++) c.fillRect(-42 + (i % 3) * 32, -10 + Math.floor(i / 3) * 30, 20, 16); },
  };

  // ---------- objects ----------
  // app tile: a glossy rounded slab in the colour, a face with the glyph (or a licensed logo in the slot), the name under it. size = edge length.
  function appTile(THREE, o = {}) {
    const s = o.size ?? 1.7, g = new THREE.Group(), col = o.color ?? 0x6b3cff, hex = '#' + new THREE.Color(col).getHexString();
    g.add(new THREE.Mesh(standingSlab(THREE, s, .34, s * .24), gloss(THREE, col, { roughness: .24 })));
    const inside = o.label === 'inside' && o.name;   // the name sits inside the tile at its top, so nothing in front of the tile can cover it
    const map = o.logo ? null : tex(THREE, 256, 256, (c, w, h) => { const gr = c.createLinearGradient(0, 0, w, h); gr.addColorStop(0, 'rgba(255,255,255,.22)'); gr.addColorStop(1, 'rgba(0,0,0,.18)'); c.fillStyle = gr; rr(c, 0, 0, w, h, 60); c.fill();
      c.save(); c.translate(w / 2, h / 2 + (inside ? 18 : 0)); if (inside) c.scale(.8, .8); (o.glyph || appGlyphs.notes)(c, hex); c.restore();
      if (inside) { c.fillStyle = 'rgba(255,255,255,.95)'; c.font = `800 40px ${SANS}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(o.name, w / 2, 38); } });
    const f = face(THREE, s * .9, s * .9, o.logo || map); f.position.set(0, s / 2, .175); g.add(f); g.userData.logoSlot = f;   // the logo slot: swap f.material.map for a licensed logo texture
    if (o.name && !inside) { const lab = face(THREE, s * 1.4, s * .34, tex(THREE, 512, 128, (c, w, h) => { c.fillStyle = '#e9ecf4'; c.font = `700 56px ${SANS}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(o.name, w / 2, h / 2); })); lab.position.set(0, -s * .2, .02); lab.userData.label = true; g.add(lab); }
    return finish(THREE, g);
  }
  // a thin standing rounded slab: footprint s x s in x/y, thickness d in z, base at y = 0 (extruded rounded rectangle)
  function standingSlab(THREE, s, d, r) {
    const gm = new THREE.ExtrudeGeometry(roundedShape(THREE, s - .12, s - .12, Math.max(.02, r - .06)), { depth: d - .12, bevelEnabled: true, bevelThickness: .06, bevelSize: .06, bevelSegments: 5, curveSegments: 12 });
    gm.translate(0, s / 2, -(d - .12) / 2); gm.computeVertexNormals(); return gm;
  }
  function phone(THREE, o = {}) {
    const g = new THREE.Group(), w = o.w ?? 1.5, h = o.h ?? 3.1, d = .24, col = o.color ?? 0x1c1d26;
    g.add(new THREE.Mesh(standingSlab2(THREE, w, h, d, .24), gloss(THREE, col, { roughness: .2, metalness: .3 })));
    const scr = face(THREE, w * .9, h * .93, tex(THREE, 256, Math.round(256 * h / w), (c, ww, hh) => { const gr = c.createLinearGradient(0, 0, 0, hh); gr.addColorStop(0, o.screenA ?? '#2b1d6e'); gr.addColorStop(1, o.screenB ?? '#0e0a22'); c.fillStyle = gr; rr(c, 0, 0, ww, hh, 28); c.fill(); if (o.screen) o.screen(c, ww, hh); })); scr.position.set(0, h / 2, d / 2 + .004); g.add(scr); g.userData.screen = scr;
    const cm = new THREE.Mesh(new THREE.CylinderGeometry(.13, .13, .05, 20), metal(THREE)); cm.rotation.x = Math.PI / 2; cm.position.set(-w * .28, h * .9, -d / 2 - .03); g.add(cm);
    return finish(THREE, g);
  }
  function standingSlab2(THREE, w, h, d, r) {   // footprint w x h in x/y, thickness d in z, base at y = 0
    const gm = new THREE.ExtrudeGeometry(roundedShape(THREE, w - .1, h - .1, r - .05), { depth: d - .1, bevelEnabled: true, bevelThickness: .05, bevelSize: .05, bevelSegments: 4, curveSegments: 10 });
    gm.translate(0, h / 2, -(d - .1) / 2); gm.computeVertexNormals(); return gm; }
  function laptop(THREE, o = {}) {
    const g = new THREE.Group(), w = o.w ?? 3.4, dpt = o.d ?? 2.3, col = o.color ?? 0x2a2c38, tilt = o.tilt ?? .22, lh = o.lidH ?? 2.0;
    g.add(new THREE.Mesh(roundBox(THREE, w, dpt, .14, .12, .04, 3), gloss(THREE, col, { roughness: .28, metalness: .5 })));
    const keys = new THREE.Mesh(new THREE.PlaneGeometry(w * .82, dpt * .45), new THREE.MeshBasicMaterial({ map: tex(THREE, 256, 64, (c, ww, hh) => { c.fillStyle = '#0d0e14'; c.fillRect(0, 0, ww, hh); c.fillStyle = '#2f3240'; for (let y = 4; y < hh - 4; y += 14) for (let x = 4; x < ww - 8; x += 15) c.fillRect(x, y, 12, 10); }), toneMapped: false }));
    keys.rotation.x = -Math.PI / 2; keys.position.set(0, .152, dpt * .12); keys.userData.noShadow = true; g.add(keys);
    const lid = new THREE.Group(); lid.position.set(0, .12, -dpt / 2 + .1); lid.rotation.x = -tilt; g.add(lid);
    lid.add(new THREE.Mesh(standingSlab2(THREE, w, lh, .1, .1), gloss(THREE, col, { roughness: .28, metalness: .5 })));
    const scr = face(THREE, w * .93, lh * .9, tex(THREE, 512, Math.round(512 * lh / w), (c, ww, hh) => { const gr = c.createLinearGradient(0, 0, ww, hh); gr.addColorStop(0, o.screenA ?? '#1d2f7a'); gr.addColorStop(1, o.screenB ?? '#0d0a24'); c.fillStyle = gr; c.fillRect(0, 0, ww, hh); if (o.screen) o.screen(c, ww, hh); })); scr.position.set(0, lh / 2, .056); lid.add(scr); g.userData.screen = scr;
    return finish(THREE, g);
  }
  function chip(THREE, o = {}) {
    const g = new THREE.Group(), s = o.size ?? 1.5, col = o.color ?? 0x0aa84f, pin = metal(THREE);
    const body = new THREE.Mesh(roundBox(THREE, s, s, .36, .16, .05, 5), gloss(THREE, col, { roughness: .28 })); g.add(body);
    for (let i = 0; i < 6; i++) for (const k of [-1, 1]) { const p = new THREE.Mesh(new THREE.BoxGeometry(.07, .05, .16), pin); p.position.set(-s * .37 + i * s * .147, .13, k * (s / 2 + .02)); g.add(p); const q = new THREE.Mesh(new THREE.BoxGeometry(.16, .05, .07), pin); q.position.set(k * (s / 2 + .02), .13, -s * .37 + i * s * .147); g.add(q); }
    const die = new THREE.Mesh(roundBox(THREE, s * .46, s * .46, .06, .06, .02, 3), new THREE.MeshStandardMaterial({ color: 0x0b2a1c, roughness: .35, metalness: .3 })); die.position.y = .36 - .004; g.add(die);
    return finish(THREE, g);
  }
  function rack(THREE, o = {}) {
    const g = new THREE.Group(), w = o.w ?? 1.6, h = o.h ?? 4.2, d = o.d ?? 1.4, hex = '#' + new THREE.Color(o.color ?? 0x2fd6ff).getHexString();
    const body = new THREE.Mesh(roundBox(THREE, w, d, h, .1, .05, 3), gloss(THREE, 0x16151f, { roughness: .4, clearcoat: .5 })); g.add(body);
    const units = tex(THREE, 128, 512, (c, ww, hh) => { c.fillStyle = '#0b0c12'; c.fillRect(0, 0, ww, hh); let seed = 9; const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      for (let y = 8; y < hh - 20; y += 40) { c.fillStyle = '#171923'; c.fillRect(8, y, ww - 16, 34); c.fillStyle = '#05060a'; for (let k = 0; k < 4; k++) c.fillRect(16 + k * 20, y + 8, 14, 18); c.fillStyle = R() < .8 ? hex : '#ffb23d'; c.fillRect(ww - 30, y + 8, 8, 8); c.fillRect(ww - 30, y + 20, 8, 5); } });
    const f = face(THREE, w * .9, h * .94, units); f.position.set(0, h / 2, d / 2 + .006); g.add(f);
    return finish(THREE, g);
  }
  function productBlock(THREE, o = {}) {
    const g = new THREE.Group(), w = o.w ?? 2.6, d = o.d ?? 2, h = o.h ?? 1.4, col = o.color ?? 0x4a14c8;
    const b = new THREE.Mesh(roundBox(THREE, w, d, h, .3, .08, 5), gloss(THREE, col, { roughness: .22 })); g.add(b);
    if (o.name) { const lab = face(THREE, w * .84, h * .5, tex(THREE, 512, 192, (c, ww, hh) => { c.fillStyle = '#fff'; c.font = `800 72px ${SANS}`; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(o.name, 20, hh * .38); c.fillStyle = 'rgba(255,255,255,.62)'; c.font = `600 38px ${SANS}`; c.fillText(o.sub || '', 22, hh * .78); })); lab.position.set(0, h * .5, d / 2 + .006); g.add(lab); }
    if (o.led) { const led = new THREE.Mesh(new THREE.BoxGeometry(w * .46, .05, .05), new THREE.MeshBasicMaterial({ color: new THREE.Color(.2, 2.6, 1.3), toneMapped: false })); led.position.set(-w * .2, h * .16, d / 2 + .02); led.userData.noShadow = true; g.add(led); }
    return finish(THREE, g);
  }
  // code / JSON card: a dark rounded panel, three window dots, coloured lines [{ t:[[text, colour]...] }] or plain strings
  function codeCard(THREE, o = {}) {
    const g = new THREE.Group(), w = o.w ?? 3.4, h = o.h ?? 2.3, px = 1024, py = Math.round(px * h / w), lines = o.lines || [];
    const map = tex(THREE, px, py, (c, ww, hh) => { c.fillStyle = '#0f0c1e'; rr(c, 0, 0, ww, hh, 44); c.fill(); c.strokeStyle = o.edge ?? 'rgba(138,92,255,.7)'; c.lineWidth = 5; rr(c, 3, 3, ww - 6, hh - 6, 42); c.stroke();
      ['#ff5f57', '#febc2e', '#28c840'].forEach((k, i) => { c.fillStyle = k; c.beginPath(); c.arc(54 + i * 40, 54, 12, 0, 7); c.fill(); });
      if (o.title) { c.fillStyle = '#8a8f98'; c.font = `600 30px ${MONO}`; c.fillText(o.title, 54, 124); }
      c.font = `600 ${o.fs ?? 44}px ${MONO}`; lines.forEach((ln, i) => { let x = 54; (typeof ln === 'string' ? [[ln, '#c7c9d1']] : ln).forEach(([s, k]) => { c.fillStyle = k; c.fillText(s, x, (o.title ? 196 : 150) + i * ((o.fs ?? 44) * 1.4)); x += c.measureText(s).width; }); });
      if (o.footer) { c.fillStyle = '#42ff8c'; c.font = `700 34px ${MONO}`; c.fillText(o.footer, 54, hh - 44); } });
    const f = face(THREE, w, h, map); f.position.y = h / 2; g.add(f); g.userData.size = new THREE.Vector3(w, h, .02); return g;
  }
  // dialog: a panel with a title, a line of text and two buttons
  function dialog(THREE, o = {}) {
    const g = new THREE.Group(), w = o.w ?? 3, h = o.h ?? 1.9;
    const map = tex(THREE, 768, Math.round(768 * h / w), (c, ww, hh) => { c.fillStyle = '#f3f4f8'; rr(c, 0, 0, ww, hh, 40); c.fill(); c.fillStyle = '#14131c'; c.font = `800 52px ${SANS}`; c.fillText(o.title ?? 'Allow access?', 44, 92);
      c.fillStyle = '#5c6070'; c.font = `500 36px ${SANS}`; c.fillText(o.body ?? 'One shared standard for every app.', 44, 160);
      const bw = (ww - 44 * 2 - 24) / 2; c.fillStyle = '#e1e3ea'; rr(c, 44, hh - 124, bw, 84, 22); c.fill(); c.fillStyle = o.accent ?? '#6b3cff'; rr(c, 44 + bw + 24, hh - 124, bw, 84, 22); c.fill();
      c.textAlign = 'center'; c.fillStyle = '#14131c'; c.font = `700 36px ${SANS}`; c.fillText(o.no ?? 'Not now', 44 + bw / 2, hh - 70); c.fillStyle = '#fff'; c.fillText(o.yes ?? 'Allow', 44 + bw * 1.5 + 24, hh - 70); });
    const f = face(THREE, w, h, map, { toneMapped: false }); f.position.y = h / 2; g.add(f); g.userData.size = new THREE.Vector3(w, h, .02); return g;
  }

  // ---------- 3D number figures: digits 0-9 and + x = - as chunky glossy tubes ----------
  const P = (pts, closed) => ({ pts, closed });
  const ell = (cx, cy, rx, ry) => P(Array.from({ length: 14 }, (_, i) => [cx + Math.cos(i / 14 * 6.2832) * rx, cy + Math.sin(i / 14 * 6.2832) * ry]), true);
  const GL = {
    '0': [ell(.3, .5, .27, .5)], '1': [P([[.08, .78], [.32, 1], [.32, 0]])],
    '2': [P([[.02, .8], [.12, .96], [.3, 1], [.5, .94], [.58, .78], [.5, .58], [.02, 0], [.6, 0]])],
    '3': [P([[.02, .95], [.58, .95], [.3, .56], [.48, .52], [.6, .32], [.5, .08], [.3, 0], [.1, .06], [.02, .2]])],
    '4': [P([[.5, 1], [.02, .3], [.64, .3]]), P([[.5, 0], [.5, 1]])],
    '5': [P([[.56, 1], [.08, 1], [.04, .56], [.3, .62], [.54, .5], [.6, .26], [.46, .05], [.22, 0], [.02, .1]])],
    '6': [P([[.5, .96], [.26, .86], [.08, .56], [.02, .3], [.12, .08], [.3, 0], [.5, .08], [.6, .3], [.5, .5], [.3, .56], [.1, .42]])],
    '7': [P([[.02, 1], [.6, 1], [.22, 0]])],
    '8': [ell(.3, .76, .24, .22), ell(.3, .26, .29, .26)],
    '9': [P([[.5, .96], [.26, .86], [.08, .56], [.02, .3], [.12, .08], [.3, 0], [.5, .08], [.6, .3], [.5, .5], [.3, .56], [.1, .42]].map(([x, y]) => [.6 - x, 1 - y]))],
    '+': [P([[.3, .2], [.3, .8]]), P([[.02, .5], [.58, .5]])], 'x': [P([[.06, .22], [.54, .78]]), P([[.06, .78], [.54, .22]])], '×': null, '=': [P([[.04, .64], [.56, .64]]), P([[.04, .36], [.56, .36]])], '-': [P([[.04, .5], [.56, .5]])],
  };
  GL['×'] = GL.x;
  function figure(THREE, text, o = {}) {
    const hgt = o.height ?? 2, r = (o.radius ?? .085) * hgt, g = new THREE.Group(), col = o.color ?? 0xffa23a;
    const mat = new THREE.MeshPhysicalMaterial({ color: col, roughness: .22, metalness: 0, clearcoat: 1, clearcoatRoughness: .06, envMapIntensity: 1.1, emissive: col, emissiveIntensity: o.emissive ?? .35 });
    // TEXT CLEAR (scripts/showreel/textclear.py): the figures are text; with window.__noText set they are not drawn, so the check can see what they sit on
    let shown = true; Object.defineProperty(g, 'visible', { get: () => shown && !window.__noText, set: (v) => { shown = v; } }); g.userData.isText = true; g.userData.on = () => shown; (window.__figs = window.__figs || []).push(g);
    g.userData.mat = mat; let x = 0; const adv = .86 * hgt, sp = .7 * hgt;
    [...text].forEach((ch) => { if (ch === ' ') { x += .5 * hgt; return; } const gl = GL[ch]; if (!gl) return; const wide = ('+x×=-'.includes(ch)) ? sp : adv;
      for (const s of gl) { const v = s.pts.map(([px, py]) => new THREE.Vector3(x + px * hgt * .95, py * hgt, 0)); const cu = new THREE.CatmullRomCurve3(v, s.closed, 'centripetal');
        const t = new THREE.Mesh(new THREE.TubeGeometry(cu, 36, r, 12, s.closed), mat); g.add(t);
        if (!s.closed) for (const p of [v[0], v[v.length - 1]]) { const b = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), mat); b.position.copy(p); g.add(b); } }
      x += wide; });
    const total = x - (adv - .66 * hgt); g.children.forEach((m) => { m.position.x -= total / 2; }); g.userData.size = new THREE.Vector3(total, hgt + 2 * r, 2 * r);
    g.traverse((m) => { if (m.isMesh) m.castShadow = true; }); return g;
  }

  // ---------- camera path: one continuous move through the world ----------
  // keys: [{ t, pos:[x,y,z], look:[x,y,z], fov? }] in time order. Position and look-at run on smooth curves through the keys (no stop at a key: the speed carries
  // through; `glide` 0..1 eases the very first and last segment only). Returns at(t) which sets the stage camera and returns { pos, look, fov }.
  function camPath(S, keys, o = {}) {
    const THREE = S.THREE, V = (a) => new THREE.Vector3(...a), n = keys.length, glide = o.glide ?? .5;
    const pc = new THREE.CatmullRomCurve3(keys.map((k) => V(k.pos)), false, 'centripetal'), lc = new THREE.CatmullRomCurve3(keys.map((k) => V(k.look)), false, 'centripetal');
    return function at(t) {
      let i = 0; while (i < n - 2 && t >= keys[i + 1].t) i++;
      const a = keys[i], b = keys[i + 1]; let u = clamp((t - a.t) / (b.t - a.t));
      if (n === 2) u = lerp(u, u * u * (3 - 2 * u), glide); else if (i === 0) u = lerp(u, 1 - (1 - u) * (1 - u), glide); else if (i === n - 2) u = lerp(u, u * u, glide);
      const s = (i + u) / (n - 1), pos = pc.getPoint(s), look = lc.getPoint(s), fov = lerp(a.fov ?? S.cam.fov, b.fov ?? a.fov ?? S.cam.fov, u);
      S.cam.position.copy(pos); if (S.cam.fov !== fov) { S.cam.fov = fov; S.cam.updateProjectionMatrix(); } S.cam.lookAt(look); S.cam.updateMatrixWorld(); return { pos, look, fov };
    };
  }

  // ---------- v6: entrances (D10) ----------
  const ease3 = (u) => (u = clamp(u), u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
  const back = (u, c = 1.5) => { u = clamp(u); return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };
  const bounce = (u) => { u = clamp(u); const n = 7.5625, d = 2.75; if (u < 1 / d) return n * u * u; if (u < 2 / d) return n * (u -= 1.5 / d) * u + .75; if (u < 2.5 / d) return n * (u -= 2.25 / d) * u + .9375; return n * (u -= 2.625 / d) * u + .984375; };
  function enter(obj, kind, u, o = {}) {
    const h = obj.userData.home || (obj.userData.home = { p: obj.position.clone(), r: obj.rotation.clone(), s: obj.scale.x || 1 });
    u = clamp(u); obj.visible = u > .002; obj.position.copy(h.p); obj.rotation.copy(h.r); let sc = h.s;
    const side = o.side ?? 1, e = back(u), w = 1 - u, A = o.amp ?? 1;   // amp: how far the entrance travels (smaller objects: smaller moves, so they do not fly across the frame edge)
    if (kind === 'slideTurn') { obj.position.x += side * 3.2 * A * (1 - ease3(u)); obj.rotation.y += side * 1.15 * (1 - e); sc *= .7 + .3 * ease3(u); }
    else if (kind === 'drop') { obj.position.y += 3.6 * A * (1 - bounce(u)); obj.rotation.z += side * .25 * w * w; }
    else if (kind === 'rise') { obj.position.y -= 1.8 * A * (1 - e); obj.rotation.x -= 1.25 * (1 - ease3(u)); sc *= .55 + .45 * ease3(u); }
    else if (kind === 'swing') { const th = side * 1.35 * (1 - e); obj.position.x += Math.sin(th) * 3 * A; obj.position.z += (Math.cos(th) - 1) * 3 * A; obj.rotation.y += th; }
    else if (kind === 'flip') { obj.rotation.y += side * Math.PI * 2 * (1 - ease3(u)); sc *= .3 + .7 * e; }
    else if (kind === 'slam') {   // v7 big moment: falls from above and close, lands with an overshoot and a short squash
      const f = clamp(u / .7), land = clamp((u - .7) / .3), dn = ease3(f);
      obj.position.y += 2.4 * A * (1 - dn); obj.position.z += 1.6 * A * (1 - dn); obj.rotation.x -= .55 * (1 - dn); sc *= 1.45 - .45 * dn;
      if (u > .7) { const sq = Math.sin(Math.PI * land) * .09 * (1 - land); obj.scale.set(h.s * (1 + sq), h.s * (1 - sq), h.s * (1 + sq)); return; } }
    else { sc *= Math.max(.001, e); }
    obj.scale.setScalar(Math.max(.001, sc));
  }
  // ---------- v6: believable wires (D12) ----------
  function wire(S, points, o = {}) {
    const THREE = S.THREE, pts = points.map((p) => (p.isVector3 ? p : new THREE.Vector3(...p))), curve0 = new THREE.CatmullRomCurve3(pts, false, o.curve ?? 'catmullrom', o.tension ?? .5);
    const SEG = o.segments ?? 120, RAD = 8, r = o.radius ?? .045;
    // v7 (floorY): the cable never goes through the floor: the curve is resampled densely with every point kept at least its radius above floorY
    const curve = o.floorY == null ? curve0 : new THREE.CatmullRomCurve3(curve0.getSpacedPoints(Math.max(80, SEG)).map((q) => { q.y = Math.max(q.y, o.floorY + r + .003); return q; }), false, 'catmullrom', 0), col = new THREE.Color(o.color ?? 0x8a5cff);
    const mat = new THREE.MeshPhysicalMaterial({ color: col.clone().multiplyScalar(o.tone ?? .72), roughness: .62, metalness: 0, clearcoat: .2, clearcoatRoughness: .5, emissive: col, emissiveIntensity: 0 });   // matte rubber, a soft sheen
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, SEG, r, RAD, false), mat); tube.castShadow = false; S.scene.add(tube);
    // the floor shadow: a dark strip under the parts that lie low (wider and darker the nearer the floor)
    let strip = null;
    if (o.shadow !== false) { const pos = [], col4 = [], idx = []; for (let i = 0; i <= SEG; i++) { const u = i / SEG, p = curve.getPointAt(u), tg = curve.getTangentAt(u), k = clamp(1 - p.y / .28), hw = .03 + .09 * k, nx = -tg.z, nz = tg.x, l = Math.hypot(nx, nz) || 1;
        pos.push(p.x + nx / l * hw, .006, p.z + nz / l * hw, p.x - nx / l * hw, .006, p.z - nz / l * hw); col4.push(0, 0, 0, .55 * k, 0, 0, 0, .55 * k); if (i < SEG) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col4, 4)); g.setIndex(idx);
      strip = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, fog: false })); strip.renderOrder = 2; S.scene.add(strip); }
    // plugs: a metal sleeve and a coloured boot, along the cable's own direction at each end
    const metal = new THREE.MeshStandardMaterial({ color: 0xcfd5de, roughness: .3, metalness: 1 }), boot = new THREE.MeshPhysicalMaterial({ color: col.clone().multiplyScalar(.75), roughness: .45, clearcoat: .4 });
    const plug = (u, dir) => { const g = new THREE.Group(), b = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.9, r * 1.6, .17, 14), boot), m = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.15, r * 1.15, .11, 12), metal);
      b.position.y = -.02; m.position.y = .11; g.add(b, m); const p = curve.getPointAt(u), t = curve.getTangentAt(u).multiplyScalar(dir); g.position.copy(p); g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), t.normalize()); g.userData.at = p.clone(); g.userData.dir = t.clone(); S.scene.add(g); return g; };
    const pA = o.plugs === false ? null : plug(0, -1), pB = o.plugs === false ? null : plug(1, 1);
    const bead = new THREE.Mesh(new THREE.SphereGeometry(r * 1.35, 12, 8), new THREE.MeshBasicMaterial({ color: col.clone().multiplyScalar(2.2), toneMapped: false })); bead.visible = false; S.scene.add(bead);
    const api = { curve, tube, strip, plugs: [pA, pB], bead, radius: r,
      lowest() { let m = 1e9; for (let i = 0; i <= 200; i++) m = Math.min(m, curve.getPointAt(i / 200).y); return m - r; },   // v7 check: the cable's lowest surface point (>= 0 = never through the floor)
      reveal(u) { u = clamp(u); const n = Math.floor(u * SEG); tube.geometry.setDrawRange(0, n * RAD * 6); if (strip) strip.geometry.setDrawRange(0, n * 6); const on = u > .001; tube.visible = on; if (strip) strip.visible = on;
        if (pA) pA.visible = on; if (pB) { const k = clamp((u - .94) / .06); pB.visible = k > 0; pB.position.copy(pB.userData.at).addScaledVector(pB.userData.dir, .14 * (1 - k)); } },   // the end plug slides the last 0.14 in: the click
      pulse(k, t = 0, str = 1) { k = clamp(k); mat.emissiveIntensity = .35 * str * Math.sin(Math.PI * k); bead.visible = str > .5 && k > 0 && k < 1 && tube.visible; if (bead.visible) bead.position.copy(curve.getPointAt(k)); } };   // str < 1: a softer pulse without the bead (many cables at once)
    api.reveal(0); return api;
  }

  // ---------- v7: flat counting numbers tied to their object by a thin leader line (owner, 26 Nov 2026; references 10 and 11) ----------
  // numbers({ y, w }) -> set(t, { show 0..1, from, to, k (count 0..1), top, typed 0..1 (how much of the top line is typed), label, labelIn 0..1,
  //   bar 0..1 (a thin bar under the number, its length = the value's share), color, anchor: [x,y] px | null, at: [x,y] block centre px, tick 0..1 })
  //   -> { box, leader, value }. One style for every number: flat, crisp white, an odometer count (the digits roll, never pop), a hairline to its object.
  function numbers(o = {}) {
    const box = document.createElement('div'), y = o.y ?? 1530, BW = o.w ?? 300, BH = 270;
    box.style.cssText = `position:absolute;left:0;top:${y}px;width:${BW}px;text-align:center;pointer-events:none;z-index:6;font-family:"Inter Display",Inter,system-ui,sans-serif;color:#fff;text-shadow:0 2px 14px rgba(5,4,12,.7);padding:14px 0 12px;border-radius:28px;background:${o.back === false ? 'none' : 'rgba(9,10,14,.8)'}`;   // a dark backing: the number never sits on a busy picture
    box.innerHTML = '<div data-top style="font-weight:600;font-size:40px;line-height:1;height:42px;color:#c9cfdb;letter-spacing:.01em;white-space:pre"></div>'
      + '<div data-n style="font-weight:800;font-size:148px;line-height:1.04;height:154px;letter-spacing:-.03em;display:flex;justify-content:center;overflow:hidden"></div>'
      + '<div data-bar style="height:8px;margin:6px auto 10px;width:260px;border-radius:4px;background:rgba(255,255,255,.16);overflow:hidden"><i style="display:block;height:100%;width:0;background:#fff;border-radius:4px"></i></div>'
      + '<div data-lab style="font-weight:600;font-size:38px;line-height:1;color:#c9cfdb"></div>';
    const ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg'); svg.setAttribute('width', '1080'); svg.setAttribute('height', '1920');
    svg.style.cssText = 'position:absolute;left:0;top:0;pointer-events:none;z-index:6';
    const ln = document.createElementNS(ns, 'line'), dot = document.createElementNS(ns, 'circle');
    ln.setAttribute('stroke', 'rgba(255,255,255,.78)'); ln.setAttribute('stroke-width', '3'); ln.setAttribute('stroke-linecap', 'round');
    dot.setAttribute('r', '11'); dot.setAttribute('fill', 'none'); dot.setAttribute('stroke', '#fff'); dot.setAttribute('stroke-width', '3'); svg.appendChild(ln); svg.appendChild(dot);
    document.body.appendChild(svg); document.body.appendChild(box);
    const top = box.querySelector('[data-top]'), n = box.querySelector('[data-n]'), lab = box.querySelector('[data-lab]'), barI = box.querySelector('[data-bar] i');
    // the odometer: two digit columns (tens, ones), each a strip of 0-9 that slides; the tens roll only when the ones pass 9 -> 0
    const col = () => { const c = document.createElement('div'); c.style.cssText = 'height:154px;overflow:hidden'; const st = document.createElement('div'); st.style.cssText = 'display:flex;flex-direction:column';
      for (let d = 0; d < 11; d++) { const e = document.createElement('div'); e.style.cssText = 'height:154px;line-height:154px'; e.textContent = String(d % 10); st.appendChild(e); } c.appendChild(st); n.appendChild(c); return { c, st }; };
    const tens = col(), ones = col();
    return { el: box, set(t, q) {
      const sh = clamp(q.show ?? 0), kk = 1 - Math.pow(1 - clamp(q.k ?? 1), 3), vf = lerp(q.from ?? q.value, q.to ?? q.value, kk), v = Math.round(vf);
      const at = q.at || [540, y + BH / 2], bx = [at[0] - BW / 2, at[1] - BH / 2, at[0] + BW / 2, at[1] + BH / 2];   // at: the number block's centre (placed beside its object, in empty space)
      box.style.left = bx[0] + 'px'; box.style.top = bx[1] + 'px';
      box.style.opacity = sh.toFixed(3); box.style.transform = `translateY(${(1 - sh) * 46}px) scale(${(1 + .1 * Math.sin(Math.PI * clamp(q.tick ?? 0))).toFixed(3)})`;
      const tl = q.top || ''; top.textContent = tl.slice(0, Math.round(tl.length * clamp(q.typed ?? 1)));
      const op = ((vf % 10) + 10) % 10, tp = Math.floor(Math.max(0, vf) / 10) + Math.max(0, op - 9);   // continuous: the ones slide every unit, the tens on the 9 -> 0 roll
      ones.st.style.transform = `translateY(${(-op * 154).toFixed(1)}px)`; tens.st.style.transform = `translateY(${(-(tp % 10) * 154).toFixed(1)}px)`; tens.c.style.display = vf >= 9.5 ? '' : 'none';
      n.style.color = q.color || '#fff'; barI.style.width = (clamp(q.bar ?? (v / 24)) * 100).toFixed(1) + '%'; barI.style.background = q.color || '#fff';
      lab.textContent = q.label || ''; const li = clamp(q.labelIn ?? 1); lab.style.opacity = li.toFixed(3); lab.style.transform = `translateY(${((1 - li) * 22).toFixed(1)}px)`;
      const ax = q.anchor, ok = ax && sh > .02 && ax[0] > 30 && ax[0] < 1050 && ax[1] > 430 && ax[1] < 1890 && !(ax[0] > bx[0] && ax[0] < bx[2] && ax[1] > bx[1] && ax[1] < bx[3]);
      svg.style.opacity = ok ? sh.toFixed(3) : '0';
      let seg = null;
      if (ok) { // the leader leaves the block's edge on the side that faces the anchor
        const dx = ax[0] - at[0], dy = ax[1] - at[1], tx = dx ? (BW / 2 + 8) / Math.abs(dx) : 1e9, ty = dy ? (BH / 2 + 8) / Math.abs(dy) : 1e9, f = Math.min(tx, ty, 1);
        const x0 = at[0] + dx * f, y0 = at[1] + dy * f, k = clamp((sh - .2) / .8); seg = [x0, y0, lerp(x0, ax[0], k), lerp(y0, ax[1], k)];
        ln.setAttribute('x1', x0); ln.setAttribute('y1', y0); ln.setAttribute('x2', seg[2]); ln.setAttribute('y2', seg[3]); dot.setAttribute('cx', ax[0]); dot.setAttribute('cy', ax[1]); dot.style.opacity = k > .95 ? '1' : '0'; }
      return { box: bx, leader: seg, value: v }; } };
  }

  // ---------- v7 render 3: a kinetic headline (references' shared grammar): one big word per beat in the upper third, the newest in the accent, the one before it grey ----------
  // headline({ y, words: [{ t, text, color }] }) -> fn(t) -> { box }
  function headline(o = {}) {
    const el = document.createElement('div'), y = o.y ?? 360, words = o.words || [];
    el.style.cssText = `position:absolute;left:40px;top:${y}px;width:1000px;text-align:center;pointer-events:none;z-index:5;font-family:"Inter Display",Inter,system-ui,sans-serif;text-shadow:0 3px 22px rgba(5,4,12,.85)`;
    el.innerHTML = '<div style="height:58px"><span data-prev style="font-weight:800;font-size:54px;line-height:1.05;color:#7f8694;letter-spacing:.02em"></span></div><div style="height:132px"><span data-now style="display:inline-block;font-weight:900;font-size:128px;line-height:1;letter-spacing:-.02em"></span></div>';
    document.body.appendChild(el); const pv = el.querySelector('[data-prev]'), nw = el.querySelector('[data-now]');
    return (t) => { let i = -1; for (let k = 0; k < words.length; k++) if (t >= words[k].t) i = k;
      if (i < 0) { el.style.opacity = '0'; return { box: null }; }
      const w = words[i], u = clamp((t - w.t) / .28), e = 1 - Math.pow(1 - u, 3);
      el.style.opacity = '1'; nw.textContent = w.text; nw.style.color = w.color || '#ffffff'; nw.style.transform = `translateY(${((1 - e) * 40).toFixed(1)}px)`; nw.style.opacity = e.toFixed(3);
      pv.textContent = i > 0 ? words[i - 1].text : ''; pv.style.opacity = (i > 0 ? .9 : 0).toFixed(2);
      const r1 = nw.getBoundingClientRect(), r0 = pv.getBoundingClientRect(); return { box: [Math.min(r1.left, i > 0 ? r0.left : 1e9), y, Math.max(r1.right, i > 0 ? r0.right : 0), y + 190] }; };
  }

  W3.lib = { appTile, phone, laptop, chip, rack, productBlock, codeCard, dialog, figure, appGlyphs, rr, standingSlab };
  W3.camPath = camPath; W3.enter = enter; W3.wire = wire; W3.numbers = numbers; W3.headline = headline;
})();
