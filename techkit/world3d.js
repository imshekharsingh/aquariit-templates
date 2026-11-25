// techkit/world3d.js: the "colour world" 3D kit for tech reels (phase 1, 25 Nov 2026; owner chat's five gaps, design/3d-kit-test.md).
// Inlined by techkit/make.py (and scripts/3dkit-assemble.py) at the <!--WORLD3D--> marker, after three.js r149. Needs no other kit file.
// Everything is a pure function of the time you pass in (no rAF, no randomness at draw time).
//   const S = W3D.stage(THREE, { W, H })       renderer + scene + camera + environment + lights + the post chain (HDR, bloom, depth of field, ACES)
//   const world = W3D.world(S, opt)            gap 2: a lit floor with falloff, haze/fog, a soft gradient sky and blurred background props
//   const sh = W3D.contactShadow(S, obj, o)    gap 1: soft contact shadow + ambient occlusion under an object (follows it down, softer when it is high)
//   const cb = W3D.cable(S, points, o)         gap 3: thick glowing tube, emissive core, light on the floor, a pulse that travels along it
//   S.focus = obj | Vector3 | null             gap 4: depth of field is ON by default and follows the hero (S.dof = {aperture, maxR, on})
//   W3D.place / W3D.screenBox / W3D.clearOf    gap 5: row/stack/ring placement from real sizes; keep objects off logos and labels (screen rectangles)
//   W3D.captions(opt)                          the spoken line near the top, word by word: grey words, current word white, key word in a blue selection box
//   S.draw(t, o)                               draws a frame (call world.update(t), cable.update(t), shadow.update() first)
// Helpers: W3D.roundBox, W3D.roundedShape, W3D.tex, W3D.gloss(color, o) (clearcoat material).
window.W3D = (() => {
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, u) => a + (b - a) * u;
  const rng = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  // ---------- small helpers ----------
  function tex(THREE, w, h, draw, srgb = true) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); if (srgb) t.encoding = THREE.sRGBEncoding; t.anisotropy = 8; return t; }
  function roundedShape(THREE, w, h, r) { const s = new THREE.Shape(), x = -w / 2, y = -h / 2; s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0); s.lineTo(x + w, y + h - r); s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2); s.lineTo(x + r, y + h); s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI); s.lineTo(x, y + r); s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5); return s; }
  // footprint w x d (x, z), height h (y), rounded corners r, bevelled edges bev; centred in x/z, y from 0 to h
  function roundBox(THREE, w, d, h, r, bev = .08, seg = 5) {
    const g = new THREE.ExtrudeGeometry(roundedShape(THREE, w - 2 * bev, d - 2 * bev, Math.max(.01, r - bev)), { depth: h - 2 * bev, bevelEnabled: true, bevelThickness: bev, bevelSize: bev, bevelSegments: seg, curveSegments: 10 });
    g.rotateX(-Math.PI / 2); g.translate(0, bev, 0); g.computeVertexNormals(); return g; }
  // glossy coloured plastic/lacquer that reads under the stage's environment
  const gloss = (THREE, color, o = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: o.roughness ?? .26, metalness: o.metalness ?? 0, clearcoat: o.clearcoat ?? 1, clearcoatRoughness: o.clearcoatRoughness ?? .06, envMapIntensity: o.env ?? 1, emissive: o.emissive ?? 0x000000, emissiveIntensity: o.emissiveIntensity ?? 0, map: o.map || null });
  const srgbToLin = (THREE, hex) => new THREE.Color(hex).convertSRGBToLinear();

  // ---------- the stage: renderer, scene, camera, environment, lights, post ----------
  function stage(THREE, o = {}) {
    const W = o.W || 1080, H = o.H || 1920, ink = o.ink ?? 0x090a0e, haze = o.haze ?? 0x171a22;
    const gl = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
    gl.setPixelRatio(1); gl.setSize(W, H, false); gl.outputEncoding = THREE.sRGBEncoding; gl.shadowMap.type = THREE.PCFSoftShadowMap; gl.shadowMap.enabled = true; gl.domElement.style.cssText = `position:absolute;left:0;top:0;width:${W}px;height:${H}px`;
    document.body.appendChild(gl.domElement);
    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(o.fov || 30, W / H, .1, 120);
    const S = { THREE, W, H, gl, scene, cam, ink, haze, focus: null, dof: { on: true, aperture: o.aperture ?? 3.4, maxR: o.maxR ?? 22, focusRange: o.focusRange ?? 2.2 }, bloom: o.bloom ?? .45, exposure: o.exposure ?? .8, vign: o.vign ?? .42, post: true };
    // environment: a dark studio with coloured soft boxes (deterministic PMREM), the source of every gloss highlight
    { const env = new THREE.Scene(); env.background = new THREE.Color(0x0a0814);
      const box = (w, h, x, y, z, c, k) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); env.add(m); };
      box(9, 3.5, 0, 7, 4, 0xfff4e8, 1.6); box(2.4, 9, -8, 1, 3, 0x9fb4ff, 1.1); box(2.4, 9, 8, 0, 2, 0xffc29a, .8); box(8, 2, 0, 3, -7, 0xc9a8ff, .7); box(10, 2.5, 0, -8, -4, 0x2a2438, 1);
      const pm = new THREE.PMREMGenerator(gl); S.env = pm.fromScene(env, .02).texture; pm.dispose(); scene.environment = S.env; }
    // lights: a soft key with a shadow map, a cool rim, a warm kicker, a faint hemisphere fill
    S.lights = (() => {
      const hemi = new THREE.HemisphereLight(0xc4ccdc, 0x14161c, .14); scene.add(hemi);
      const key = new THREE.DirectionalLight(0xfff0e0, 1.1); key.position.set(-4.5, 8, 4.5); key.castShadow = true;
      key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: 1, far: 26 }); key.shadow.radius = 6; key.shadow.bias = -.0004; key.shadow.normalBias = .02; scene.add(key);
      const rim = new THREE.DirectionalLight(0xa9b8ff, 1.5); rim.position.set(5, 3.5, -6); scene.add(rim);
      const rim2 = new THREE.DirectionalLight(0xff9a5a, .8); rim2.position.set(-6, 2.5, -4); scene.add(rim2);
      return { hemi, key, rim, rim2 }; })();

    // ---- post chain: HDR scene target -> depth of field -> bloom mips -> ACES + sRGB + vignette ----
    const rtOpt = { type: THREE.HalfFloatType, format: THREE.RGBAFormat, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: true };
    const rtScene = new THREE.WebGLRenderTarget(W, H, Object.assign({ samples: 4 }, rtOpt));
    rtScene.depthTexture = new THREE.DepthTexture(W, H); rtScene.depthTexture.type = THREE.UnsignedIntType;
    const BL = [[W / 2, H / 2], [W / 4, H / 4], [W / 8, H / 8], [W / 16, H / 16]], rtB = [], rtB2 = [];
    for (const [w, h] of BL) { const q = { type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false }; rtB.push(new THREE.WebGLRenderTarget(w, h, q)); rtB2.push(new THREE.WebGLRenderTarget(w, h, q)); }
    const rtDof = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2)), qs = new THREE.Scene(); qs.add(quad); const qc = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const VS = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }';
    const sm = (fs, u) => new THREE.ShaderMaterial({ vertexShader: VS, fragmentShader: fs, uniforms: u, depthTest: false, depthWrite: false });
    const mBright = sm('varying vec2 vUv; uniform sampler2D tex; uniform float th; void main(){ vec3 c = texture2D(tex, vUv).rgb; float l = max(c.r, max(c.g, c.b)); gl_FragColor = vec4(c * smoothstep(th, th + .8, l), 1.); }', { tex: { value: null }, th: { value: 1.15 } });
    const mBlur = sm('varying vec2 vUv; uniform sampler2D tex; uniform vec2 dir; void main(){ vec3 s = texture2D(tex, vUv).rgb * .227027; vec2 o1 = dir * 1.3846; vec2 o2 = dir * 3.2308; s += (texture2D(tex, vUv + o1).rgb + texture2D(tex, vUv - o1).rgb) * .3162162; s += (texture2D(tex, vUv + o2).rgb + texture2D(tex, vUv - o2).rgb) * .0702703; gl_FragColor = vec4(s, 1.); }', { tex: { value: null }, dir: { value: new THREE.Vector2() } });
    // depth of field: circle of confusion from the distance to the focus plane; objects within focusRange of it stay sharp (the hero), the rest softens
    const mDof = sm(`varying vec2 vUv; uniform sampler2D tex; uniform sampler2D depth; uniform float focus, range, aperture, near, far, maxR; uniform vec2 px;
      float lin(float d){ float z = d * 2. - 1.; return 2. * near * far / (far + near - z * (far - near)); }
      float coc(vec2 uv){ float d = lin(texture2D(depth, uv).r); float e = max(abs(d - focus) - range, 0.); return clamp(sign(d - focus) * e / d * aperture, -1., 1.); }
      void main(){ float c0 = coc(vUv); float r0 = abs(c0) * maxR; vec3 acc = min(texture2D(tex, vUv).rgb, vec3(2.5)); float wsum = 1.;
        for (int i = 0; i < 24; i++) { float fi = float(i) + .5; float a = fi * 2.399963; float rr = sqrt(fi / 24.); vec2 o = vec2(cos(a), sin(a)) * rr;
          vec2 uv = vUv + o * maxR * abs(c0) * px; float ci = coc(uv); float ri = abs(ci) * maxR;
          float w = (ri + .5 >= rr * r0) ? 1. : .0; w *= (c0 < 0. && ci > 0.) ? .25 : 1.;
          vec3 sc = min(texture2D(tex, uv).rgb, vec3(2.5));   // a tiny hot highlight must not turn into a ring of sparkles (owner chat, 25 Nov)
          acc += sc * w; wsum += w; }
        gl_FragColor = vec4(acc / wsum, 1.); }`, { tex: { value: null }, depth: { value: null }, focus: { value: 12 }, range: { value: 3 }, aperture: { value: 1.5 }, near: { value: .1 }, far: { value: 120 }, maxR: { value: 16 }, px: { value: new THREE.Vector2(1 / W, 1 / H) } });
    const mFinal = sm(`varying vec2 vUv; uniform sampler2D tex, b0, b1, b2, b3; uniform float bloom, exposure, vign;
      vec3 RRTAndODTFit(vec3 v){ vec3 a = v * (v + .0245786) - .000090537; vec3 b = v * (.983729 * v + .4329510) + .238081; return a / b; }
      vec3 aces_(vec3 c){ const mat3 I = mat3(.59719, .07600, .02840, .35458, .90834, .13383, .04823, .01566, .83777); const mat3 O = mat3(1.60475, -.10208, -.00327, -.53108, 1.10813, -.07276, -.07367, -.00605, 1.07602);
        c *= exposure / .6; c = I * c; c = RRTAndODTFit(c); c = O * c; return clamp(c, 0., 1.); }
      vec3 toSRGB(vec3 c){ return mix(c * 12.92, 1.055 * pow(c, vec3(1. / 2.4)) - .055, step(.0031308, c)); }
      void main(){ vec3 c = texture2D(tex, vUv).rgb; c += bloom * (texture2D(b0, vUv).rgb * .5 + texture2D(b1, vUv).rgb * .7 + texture2D(b2, vUv).rgb * .85 + texture2D(b3, vUv).rgb * 1.);
        c = aces_(c); vec2 q = vUv - .5; c *= 1. - vign * dot(q, q) * 1.6; gl_FragColor = vec4(toSRGB(c), 1.); }`, { tex: { value: null }, b0: { value: null }, b1: { value: null }, b2: { value: null }, b3: { value: null }, bloom: { value: .6 }, exposure: { value: 1.1 }, vign: { value: .4 } });
    const pass = (mat, target) => { quad.material = mat; gl.setRenderTarget(target); gl.render(qs, qc); };
    const v3 = new THREE.Vector3(), dir = new THREE.Vector3();
    // focus distance along the camera's view direction to the hero (an Object3D, a Vector3, a number, or null = the scene origin)
    S.focusDistance = () => { cam.getWorldDirection(dir); const f = S.focus;
      if (typeof f === 'number') return f; if (f && f.isObject3D) f.getWorldPosition(v3); else if (f && f.isVector3) v3.copy(f); else v3.set(0, 1, 0); return Math.max(1, v3.sub(cam.position).dot(dir)); };
    S.draw = (t, opt = {}) => {
      const lin = srgbToLin(THREE, ink); scene.background = scene.background && scene.background.isTexture ? scene.background : lin; if (scene.fog) scene.fog.color.copy(srgbToLin(THREE, haze));
      cam.updateMatrixWorld();
      gl.setRenderTarget(rtScene); gl.render(scene, cam); let src = rtScene.texture;
      if (S.dof.on && opt.dof !== false) { const u = mDof.uniforms; u.tex.value = src; u.depth.value = rtScene.depthTexture; u.focus.value = S.focusDistance(); u.range.value = S.dof.focusRange; u.aperture.value = S.dof.aperture; u.maxR.value = S.dof.maxR; u.near.value = cam.near; u.far.value = cam.far; pass(mDof, rtDof); src = rtDof.texture; }
      mBright.uniforms.tex.value = rtScene.texture; pass(mBright, rtB[0]);
      const bl = [];
      for (let i = 0; i < 4; i++) { if (i > 0) { mBlur.uniforms.tex.value = rtB[i - 1].texture; mBlur.uniforms.dir.value.set(0, 0); pass(mBlur, rtB[i]); }
        mBlur.uniforms.tex.value = rtB[i].texture; mBlur.uniforms.dir.value.set(1 / BL[i][0], 0); pass(mBlur, rtB2[i]);
        mBlur.uniforms.tex.value = rtB2[i].texture; mBlur.uniforms.dir.value.set(0, 1 / BL[i][1]); pass(mBlur, rtB[i]); bl[i] = rtB[i].texture; }
      const f = mFinal.uniforms; f.tex.value = src; f.bloom.value = S.bloom * (opt.bloom ?? 1); f.exposure.value = S.exposure; f.vign.value = S.vign; for (let i = 0; i < 4; i++) f['b' + i].value = bl[i];
      pass(mFinal, null);
    };
    return S;
  }

  // ---------- gap 2: the world (lit floor with falloff, haze, sky, blurred background props) ----------
  // opt: { palette: [hex...], seed, floor: hex, pool: hex (colour of the light pool), props: n, radius: [min, max] }
  function world(S, opt = {}) {
    const THREE = S.THREE, scene = S.scene, R = rng(opt.seed || 7), pal = opt.palette || [0x6b3cff, 0x00b6a4, 0xff5a7a, 0xffb23d, 0x2f7bff];
    scene.fog = new THREE.Fog(S.haze, opt.fogNear ?? 14, opt.fogFar ?? 46);
    // sky: a vertical gradient, darker up, hazy at the horizon (the fog colour), so far floor melts into it instead of a black wall
    scene.background = tex(THREE, 8, 256, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#0d0f15'); g.addColorStop(.55, '#13161d'); g.addColorStop(1, '#' + new THREE.Color(S.haze).getHexString()); c.fillStyle = g; c.fillRect(0, 0, w, h); });
    // floor: large dark tiles with a faint seam (reads as a surface, not a grid on a void), glossy enough to take reflections from the environment
    const seam = tex(THREE, 512, 512, (c, w, h) => { c.fillStyle = '#14161c'; c.fillRect(0, 0, w, h); const g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, 'rgba(255,255,255,.03)'); g.addColorStop(1, 'rgba(0,0,0,.12)'); c.fillStyle = g; c.fillRect(0, 0, w, h);
      c.strokeStyle = 'rgba(150,170,210,.22)'; c.lineWidth = 4; c.strokeRect(2, 2, w - 4, h - 4); c.strokeStyle = 'rgba(150,170,210,.07)'; c.lineWidth = 2; c.beginPath(); c.moveTo(w / 2, 0); c.lineTo(w / 2, h); c.moveTo(0, h / 2); c.lineTo(w, h / 2); c.stroke(); });
    seam.wrapS = seam.wrapT = THREE.RepeatWrapping; seam.repeat.set(24, 24); seam.anisotropy = 16;
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), new THREE.MeshStandardMaterial({ map: seam, color: opt.floor ?? 0xb4b8c4, roughness: .6, metalness: .15, envMapIntensity: .25 }));
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
    // the pool of light on the floor: a wide spot from above-front with a soft edge and falloff
    const pool = new THREE.SpotLight(opt.pool ?? 0xdfe6f5, opt.poolPower ?? .32, 0, .62, 1, 0); pool.position.set(1, 15, 7); pool.target.position.set(0, 0, 0); scene.add(pool, pool.target);
    // an additive radial glow on the floor under the hero (the "stage"), colour from the palette
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: tex(THREE, 256, 256, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(255,255,255,.4)'); g.addColorStop(.5, 'rgba(255,255,255,.1)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); }), color: new THREE.Color(opt.stage ?? 0x232a3a), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: true }));
    glow.rotation.x = -Math.PI / 2; glow.position.y = .01; glow.scale.setScalar(opt.stageSize ?? 15); scene.add(glow);
    // background props: racks, app tiles, phones, slabs; scattered on a ring behind and beside the hero, never inside the hero zone, so depth of field blurs them
    const props = new THREE.Group(); scene.add(props); const items = [];
    const [r0, r1] = opt.radius || [9, 30], n = opt.props ?? 26, clearR = opt.heroZone ?? 7.5;
    const rack = (c) => { const g = new THREE.Group(); const h = 4 + R() * 3.5, w = 1.5, d = 1.5;
      const body = new THREE.Mesh(roundBox(THREE, w, d, h, .12, .06, 3), gloss(THREE, 0x15131f, { roughness: .4, clearcoat: .6 })); g.add(body);
      const lights = tex(THREE, 64, 256, (cx, ww, hh) => { cx.fillStyle = '#000'; cx.fillRect(0, 0, ww, hh); for (let y = 8; y < hh; y += 10) { const col = R() < .7 ? c : '#ffffff'; cx.fillStyle = col; cx.globalAlpha = .3 + .7 * R(); cx.fillRect(8, y, 8 + R() * 40, 3); } });
      const face = new THREE.Mesh(new THREE.PlaneGeometry(w * .86, h * .9), new THREE.MeshBasicMaterial({ map: lights, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, color: new THREE.Color(.5, .5, .5) })); face.position.set(0, h * .5, d / 2 + .012); g.add(face); return g; };
    const tile = (c) => { const s = 1.8 + R() * 1.4, g = new THREE.Group(); const m = new THREE.Mesh(roundBox(THREE, s, s, .5, .4, .1, 4), gloss(THREE, c, { roughness: .4, clearcoat: .35 })); m.rotation.y = R() * .8 - .4; g.add(m); g.position.y = R() < .5 ? 0 : 1.4 + R() * 2; if (g.position.y > 0) { g.rotation.x = .35; } return g; };
    const phone = (c) => { const g = new THREE.Group(); const m = new THREE.Mesh(roundBox(THREE, 1.5, .26, 3.1, .24, .06, 4), gloss(THREE, c, { roughness: .4, clearcoat: .35 })); m.rotation.x = Math.PI / 2; m.position.y = .13; m.rotation.z = R() * 1.2 - .6; g.add(m); return g; };
    const slab = (c) => { const g = new THREE.Group(); const m = new THREE.Mesh(roundBox(THREE, 2.4 + R() * 1.6, 2.4 + R() * 1.6, .8 + R() * 2.2, .3, .08, 4), gloss(THREE, c, { roughness: .4, clearcoat: .35 })); m.rotation.y = R() * 1.5; g.add(m); return g; };
    const kinds = [rack, tile, phone, slab, tile];
    let guard = 0;
    while (items.length < n && guard++ < 400) {
      const a = R() * Math.PI * 2, rad = lerp(r0, r1, Math.sqrt(R())), x = Math.cos(a) * rad * 1.3, z = Math.sin(a) * rad - 3;
      if (Math.hypot(x, z) < clearR || z > (opt.maxZ ?? -3.5)) continue; if (items.some((p) => Math.hypot(p.x - x, p.z - z) < 4.6)) continue;
      const c = pal[Math.floor(R() * pal.length)], hex = '#' + new THREE.Color(c).getHexString(), k = kinds[Math.floor(R() * kinds.length)];
      const g = k(k === rack ? hex : c); g.position.x += x; g.position.z += z; g.rotation.y += Math.atan2(-x, -z + 12) * .6; g.traverse((m) => { if (m.isMesh) { m.castShadow = false; m.receiveShadow = false; } });
      props.add(g); items.push({ x, z, g, ph: R() * 6.28 });
    }
    return { floor, pool, glow, props, items, update(t) { for (const p of items) p.g.position.y += 0; /* props are still; the camera move gives the parallax */ } };
  }

  // ---------- gap 1: contact shadow + ambient occlusion ----------
  // obj: the object that casts; surfaceY: the height of what it stands on (0 = floor, block top for a chip on a block). Two stacked blobs:
  // a wide soft one (occlusion, grows and fades as the object rises) and a tight dark one (contact, only when it nearly touches).
  function contactShadow(S, obj, o = {}) {
    const THREE = S.THREE, box = new THREE.Box3().setFromObject(obj), size = box.getSize(new THREE.Vector3()), base = obj.position.y;
    const w = o.w ?? size.x, d = o.d ?? size.z, surf = o.surfaceY ?? 0, strength = o.strength ?? 1;
    const blob = (blur, alpha) => tex(THREE, 256, 256, (c, W, H) => { c.fillStyle = '#000'; c.filter = `blur(${blur}px)`; c.globalAlpha = alpha; const m = 70; const r = 40; c.beginPath(); c.moveTo(m + r, m); c.arcTo(W - m, m, W - m, H - m, r); c.arcTo(W - m, H - m, m, H - m, r); c.arcTo(m, H - m, m, m, r); c.arcTo(m, m, W - m, m, r); c.closePath(); c.fill(); }, false);
    const mk = (map) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map, transparent: true, depthWrite: false, fog: false, polygonOffset: true, polygonOffsetFactor: -2 })); m.rotation.x = -Math.PI / 2; m.renderOrder = 2; S.scene.add(m); return m; };
    const soft = mk(blob(26, .9)), tight = mk(blob(9, 1));
    const api = { soft, tight, update() {
      const p = new THREE.Vector3(); obj.getWorldPosition(p); const h = Math.max(0, p.y - (o.rest ?? base) + (o.lift ?? 0)); const k = 1 / (1 + h * 1.15);
      for (const [m, grow, op] of [[soft, 1.5 + h * .55, .7 * k], [tight, 1.0 + h * .12, .85 * k * k]]) {
        m.position.set(p.x + (o.dx ?? 0), surf + .012 + (m === tight ? .002 : 0), p.z + (o.dz ?? 0)); m.scale.set((w + .6) * grow * (o.scale ?? 1), (d + .6) * grow * (o.scale ?? 1), 1); m.rotation.z = -obj.rotation.y; m.material.opacity = clamp(op * strength); m.visible = obj.visible !== false && op > .01; } } };
    api.update(); return api;
  }

  // ---------- gap 3: glowing cable ----------
  // points: [[x,y,z]...] (or Vector3s). o: { color, radius, glow (HDR strength of the core), pulse: { speed, width, count } | false, floorGlow (width of the light on the floor, 0 = none), light }
  function cable(S, points, o = {}) {
    const SEG = o.segments ?? 260;
    const THREE = S.THREE, pts = points.map((p) => (p.isVector3 ? p : new THREE.Vector3(...p))), curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', o.tension ?? .4);
    const col = new THREE.Color(o.color ?? 0xff7a1a), rad = o.radius ?? .13, glow = o.glow ?? 2.2, pw = o.pulse === false ? 0 : (o.pulse?.width ?? .07), speed = o.pulse?.speed ?? .45;
    const strip = (w, h, draw) => tex(THREE, w, h, draw, false);
    // tube texture: a dim cable body along its length and one bright travelling pulse (a gaussian), brightest at the centre of the tube's uv.v
    const tubeMap = strip(1024, 8, (c, w, h) => { const im = c.createImageData(w, h); for (let x = 0; x < w; x++) { const u = x / w, g = Math.exp(-Math.pow((u - .5) / pw, 2)); const v = 255 * clamp(.7 + .3 * (pw ? g : 0)); for (let y = 0; y < h; y++) { const i = (y * w + x) * 4; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; } } c.putImageData(im, 0, 0); });
    tubeMap.wrapS = THREE.RepeatWrapping;
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, SEG, rad, 18, false), new THREE.MeshBasicMaterial({ color: 0xffffff, map: tubeMap, toneMapped: false, fog: false })); S.scene.add(tube);
    // a lighter inner core sits inside slightly over the surface so bloom has a white-hot centre line
    const core = new THREE.Mesh(new THREE.TubeGeometry(curve, SEG, rad * .38, 10, false), new THREE.MeshBasicMaterial({ color: 0xffffff, map: tubeMap, toneMapped: false, fog: false, transparent: true, opacity: .9 })); S.scene.add(core);
    // a soft halo sheath along the WHOLE tube (owner chat, 25 Nov: the glow was a hot spot at the port, not a halo): additive, fades to nothing at its silhouette
    const hal = new THREE.Mesh(new THREE.TubeGeometry(curve, SEG, rad * (o.haloSize ?? 3.4), 18, false), new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false,
      uniforms: { col: { value: new THREE.Color(1, 1, 1) } }, vertexShader: 'varying vec3 vN; varying vec3 vP; void main(){ vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position, 1.); vP = mv.xyz; gl_Position = projectionMatrix * mv; }',
      fragmentShader: 'uniform vec3 col; varying vec3 vN; varying vec3 vP; void main(){ float f = abs(dot(normalize(vN), normalize(-vP))); gl_FragColor = vec4(col * pow(f, 3.0), 1.); }' })); hal.renderOrder = 4; S.scene.add(hal);
    // the light the cable throws on the floor: a ribbon under the path, soft across, with the same pulse
    let ribbon = null, ribMap = null;
    if (o.floorGlow !== 0) {
      const fw = o.floorGlow ?? 2.4, N = SEG, pos = [], uv = [], idx = [];
      for (let i = 0; i <= N; i++) { const u = i / N, p = curve.getPointAt(u), tg = curve.getTangentAt(u); const nx = -tg.z, nz = tg.x, l = Math.hypot(nx, nz) || 1; const y = .02;
        pos.push(p.x + nx / l * fw / 2, y, p.z + nz / l * fw / 2, p.x - nx / l * fw / 2, y, p.z - nz / l * fw / 2); uv.push(u, 0, u, 1); if (i < N) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx);
      ribMap = strip(512, 64, (c, w, h) => { const im = c.createImageData(w, h); for (let x = 0; x < w; x++) for (let y = 0; y < h; y++) { const u = x / w, v = (y + .5) / h - .5, across = Math.exp(-Math.pow(v / .2, 2)), g1 = pw ? Math.exp(-Math.pow((u - .5) / (pw * 2.4), 2)) : 0; const a = across * (.32 + .68 * g1); const i = (y * w + x) * 4; im.data[i] = im.data[i + 1] = im.data[i + 2] = 255; im.data[i + 3] = 255 * a; } c.putImageData(im, 0, 0); });
      ribMap.wrapS = THREE.RepeatWrapping;
      ribbon = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ map: ribMap, color: col.clone().multiplyScalar(o.floorStrength ?? 1.1), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, fog: false, side: THREE.DoubleSide })); ribbon.renderOrder = 3; S.scene.add(ribbon);
    }
    // a point light that rides the pulse: it lights the floor and the nearby objects as it passes
    const lamp = new THREE.PointLight(col, 0, 7, 1.5); if (o.light !== 0) S.scene.add(lamp);
    const api = { curve, tube, core, ribbon, lamp, halo: hal, speed, update(t, on = 1) {
      const c = pw ? (((t * speed) % 1) + 1) % 1 : .5, off = .5 - c; tubeMap.offset.x = off; if (ribMap) ribMap.offset.x = off;
      const k = glow * on; tube.material.color.setRGB(col.r * k, col.g * k, col.b * k); core.material.color.setRGB(Math.min(4, col.r * k * 1.25 + .06), Math.min(4, col.g * k * 1.25 + .06), Math.min(4, col.b * k * 1.25 + .06));
      hal.material.uniforms.col.value.copy(col).multiplyScalar((o.halo ?? .55) * on);
      if (ribbon) ribbon.material.color.copy(col).multiplyScalar((o.floorStrength ?? 1.1) * on);
      if (o.light !== 0) { lamp.position.copy(curve.getPointAt(c)).y += .55; lamp.intensity = (o.light ?? 2.2) * on; } api.pulseAt = c; },
      // draw the first `u` (0..1) of the cable: it grows along its path (or retracts)
      reveal(u) { u = clamp(u); for (const [m, per] of [[tube, 108], [core, 60], [hal, 108]]) m.geometry.setDrawRange(0, Math.floor(u * SEG) * per); if (ribbon) ribbon.geometry.setDrawRange(0, Math.floor(u * SEG) * 6); const on = u > .001; tube.visible = core.visible = hal.visible = on; if (ribbon) ribbon.visible = on; } };
    api.update(0); return api;
  }

  // ---------- gap 5: layout ----------
  // size of an object (world units) and its screen rectangle in the 1080x1920 frame
  function sizeOf(THREE, obj) { return new THREE.Box3().setFromObject(obj).getSize(new THREE.Vector3()); }
  function screenBox(S, obj, pad = 0) {
    const THREE = S.THREE, b = new THREE.Box3().setFromObject(obj); let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; S.cam.updateMatrixWorld();
    for (const x of [b.min.x, b.max.x]) for (const y of [b.min.y, b.max.y]) for (const z of [b.min.z, b.max.z]) { const p = new THREE.Vector3(x, y, z).project(S.cam); const sx = (p.x * .5 + .5) * S.W, sy = (-p.y * .5 + .5) * S.H; x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy); }
    return [x0 - pad, y0 - pad, x1 + pad, y1 + pad]; }
  const overlaps = (a, b) => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];
  // place(objs, { mode: 'row' | 'column' | 'stack' | 'ring', gap, at: [x,y,z], radius, align }) from the real bounding boxes, so nothing intersects.
  //   row: along x, column: along z, stack: on top of each other (each rests on the one below), ring: round the centre. Returns the positions.
  function place(THREE, objs, o = {}) {
    const gap = o.gap ?? .6, at = o.at || [0, 0, 0], mode = o.mode || 'row', sz = objs.map((ob) => { const s = sizeOf(THREE, ob), c = new THREE.Box3().setFromObject(ob); return { s, minY: c.min.y - ob.position.y }; });
    const out = [];
    if (mode === 'stack') { let y = at[1]; objs.forEach((ob, i) => { ob.position.set(at[0], y - sz[i].minY, at[2]); out.push(ob.position.clone()); y += sz[i].s.y; }); return out; }
    if (mode === 'ring') { const r = o.radius ?? Math.max(...sz.map((q) => Math.max(q.s.x, q.s.z))) * .5 / Math.sin(Math.PI / Math.max(2, objs.length)) + gap; objs.forEach((ob, i) => { const a = (o.start ?? 0) + i / objs.length * Math.PI * 2; ob.position.set(at[0] + Math.cos(a) * r, at[1] - sz[i].minY, at[2] + Math.sin(a) * r); out.push(ob.position.clone()); }); return out; }
    const ax = mode === 'column' ? 'z' : 'x', total = sz.reduce((s, q) => s + q.s[ax], 0) + gap * (objs.length - 1); let cur = -total / 2;
    objs.forEach((ob, i) => { const w = sz[i].s[ax], c = cur + w / 2; ob.position.set(at[0] + (ax === 'x' ? c : 0), at[1] - sz[i].minY, at[2] + (ax === 'z' ? c : 0)); out.push(ob.position.clone()); cur += w + gap; });
    return out; }
  // clearOf(obj, rects): slide obj along `dir` (world vector on the floor, default straight away from the camera's right) until its screen box no longer overlaps any rect
  // rects are [x0,y0,x1,y1] in px (a logo, a label, the caption band). Returns { moved, overlaps } so a scene (and the stills check) can assert it.
  function clearOf(S, obj, rects, o = {}) {
    const THREE = S.THREE, dir = (o.dir || new THREE.Vector3(1, 0, 0)).clone().normalize(), step = o.step ?? .25, pad = o.pad ?? 18; let moved = 0;
    for (let i = 0; i < (o.max ?? 60); i++) { const b = screenBox(S, obj, pad); if (!rects.some((r) => overlaps(b, r))) return { moved, overlaps: false, box: b }; obj.position.addScaledVector(dir, step); moved += step; }
    return { moved, overlaps: rects.some((r) => overlaps(screenBox(S, obj, pad), r)) }; }
  const check = (S, objs, rects, pad = 0) => objs.filter((ob) => ob.visible !== false && rects.some((r) => overlaps(screenBox(S, ob, pad), r)));   // which objects touch a rect

  // ---------- captions: the spoken line near the top, word by word ----------
  // lines: [{ t0, t1, text, key?: 'word', times?: [t of each word] }]. Words get their time by letter count between t0 and t1 unless `times` is given.
  // Grey words (#8a8f98), the current word white, the key word boxed in blue (#4a8cff outline with small square handles) once it is reached.
  function captions(o = {}) {
    const el = document.createElement('div'); el.style.cssText = `position:absolute;left:${o.x ?? 90}px;top:${o.y ?? 190}px;width:${o.w ?? 900}px;text-align:center;font:${o.weight ?? 700} ${o.size ?? 60}px/${o.lh ?? 1.38} "Inter Display",Inter,system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:-.01em;pointer-events:none;z-index:5;text-shadow:0 2px 18px rgba(5,4,12,.85)`;
    document.body.appendChild(el);
    // lines: { t0, t1, text | words:[w...], times?: [t...], key?: 'word' | keyIdx: [first, last] }
    const lines = (o.lines || []).map((L) => { const ws = L.words || L.text.split(/\s+/), tot = ws.reduce((s, w) => s + w.length + 1, 0); let a = L.t0; const times = L.times || ws.map((w) => { const t = a; a += (L.t1 - L.t0) * (w.length + 1) / tot; return t; });
      let ki = L.keyIdx || null; if (!ki && L.key) { const j = ws.findIndex((w) => w.replace(/[^\w%]/g, '').toLowerCase() === L.key.toLowerCase()); if (j >= 0) ki = [j, j]; } return { ...L, ws, times, ki }; });
    // the boxed key word sits in its own inline block with 14 px padding and 10 px margin each side, so the box never touches its neighbours
    const box = (txt, k) => `<span style="position:relative;display:inline-block;padding:0 14px;margin:0 10px;color:#fff"><span style="position:absolute;inset:-3px 0 -5px;border:3px solid #4a8cff;border-radius:3px;opacity:${k};transform:scale(${(1.3 - .3 * k).toFixed(3)})"></span>` + ['left:-7px;top:-9px', 'right:-7px;top:-9px', 'left:-7px;bottom:-11px', 'right:-7px;bottom:-11px'].map((p) => `<i style="position:absolute;${p};width:12px;height:12px;background:#fff;border:2px solid #4a8cff;box-sizing:border-box;opacity:${k}"></i>`).join('') + txt + '</span>';
    let last = '';
    return (t) => { const i = lines.findIndex((L) => t >= L.t0 - .05 && t < L.t1 + .3); if (i < 0) { if (last) el.innerHTML = ''; last = ''; return; }
      const L = lines[i], cur = L.times.reduce((c, tt, j) => (t >= tt ? j : c), -1), fade = clamp((t - (L.t0 - .05)) / .12) * clamp((L.t1 + .3 - t) / .15);
      el.style.opacity = fade.toFixed(3); let html = ''; const [k0, k1] = L.ki || [-1, -1];
      for (let j = 0; j < L.ws.length; j++) {
        if (j === k0 && cur >= k0) { const grp = L.ws.slice(k0, Math.min(k1, cur) + 1).join(' '), k = clamp((t - L.times[k0]) / .2); html += box(grp, k); j = Math.min(k1, L.ws.length - 1); if (cur < k1) break; continue; }
        html += `<span style="color:${j === cur ? '#ffffff' : '#8a8f98'}">${L.ws[j]}</span> `; }
      const key = html.replace(/opacity:[0-9.]+|scale\([0-9.]+\)/g, ''); if (key !== last || L.ki) { el.innerHTML = html; last = key; } };
  }

  return { stage, world, contactShadow, cable, place, screenBox, overlaps, clearOf, check, sizeOf, captions, roundBox: (THREE, ...a) => roundBox(THREE, ...a), roundedShape, tex, gloss, srgbToLin, clamp, lerp };
})();
