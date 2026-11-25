// techkit/lib3d.js: phase 2 of the colour-world 3D kit (26 Nov 2026). Adds to window.W3D (load after world3d.js; make.py and scripts/3dkit-assemble.py inline both at <!--WORLD3D-->).
//   W3D.lib.phone / laptop / chip / rack / appTile / productBlock / codeCard / dialog (THREE, opts) -> THREE.Group, size in group.userData.size, floor-standing (y = 0 is its base)
//   W3D.lib.figure(THREE, '3x8=24', { height, color, radius })     big glossy 3D number figures built from tubes (digits 0-9 and + x = -), centred, facing +z
//   W3D.camPath(S, keys, { glide })(t)                             one continuous camera move through the world: keys [{ t, pos:[x,y,z], look:[x,y,z], fov }]
//   W3D.lib.appGlyphs                                              hand-drawn glyph painters for generic app tiles (pay, photos, notes, maps, files, chat, mail, calendar)
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

  W3.lib = { appTile, phone, laptop, chip, rack, productBlock, codeCard, dialog, figure, appGlyphs, rr, standingSlab };
  W3.camPath = camPath;
})();
