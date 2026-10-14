// LAB: the leaky-site idea in REAL 3D (owner, 14 Oct 2026: "why are we not doing 3D?"). An 8 s test shot to judge the look and the render cost before a full film:
// a glass browser window (refractive water inside, reflective glass, lit by a procedural studio) leaks from a crack; the camera starts in a close-up on the jet,
// pulls back, whips in as a lime patch slams onto the crack, tilts up to the address bar as water pours back in, and rides the level up.
// Render: node scripts/film/render-film.mjs 2026-10-14-0850 --film-dir film/_lab/leaky-3d --variant A [--stills ...]   (three.js injected automatically)
(function () {
  const E = window.FilmEngine, TM = window.FILM_T, P = window.FilmParts, { clamp, lerp } = E, S = (E.story = {});
  S.selfStage = true;
  S.dna = { service: 'studio', opening: 'lab: 3D close-up of a refractive jet from a cracked glass browser window', bigMoment: 'lab: 3D patch slam and refill', ground: 'studio navy', music: 'n/a (lab)' };
  const INK = '#061722', AQUA = '#1ec8ff', LIME = '#d6ff3d', RED = '#ff5a4f';

  S.setup = async function () {
    document.documentElement.classList.add('reel');
    await P.ready; await document.fonts.ready;
    const { world } = P.scene({ accent: LIME, ink: INK });
    const G = P.three(world, { bg: INK, exposure: 1.15, fov: 28, studio: [['#ffffff', 6, [0, 7, 3], [8, 3]], ['#1ec8ff', 7, [-8, 1, 3], [2.5, 10]], ['#ff7a45', 4, [8, 2, -1], [2.5, 10]], ['#ffffff', 1.4, [0, 1, 9], [8, 6]]] }), T = G.T, scene = G.scene;
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
    const water = new T.Mesh(wg, new T.MeshPhysicalMaterial({ color: '#f4fdff', transmission: 1, ior: 1.33, thickness: 1.1, roughness: .02, attenuationColor: '#0796ff', attenuationDistance: .85, specularIntensity: 1, envMapIntensity: 1.6 }));
    scene.add(water);
    const levels = [[0, .86], [4.4, .5], [5.4, .5], [7.4, .95], [8, .95]];
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
    const PATCH = 4.4, N = 520, drops = new T.InstancedMesh(new T.SphereGeometry(1, 12, 8), new T.MeshPhysicalMaterial({ color: '#bdeeff', transparent: true, opacity: .9, roughness: 0, metalness: 0, envMapIntensity: 3.2, clearcoat: 1 }), N);   // drops: reflective, not refractive (cheap)
    drops.instanceMatrix.setUsage(T.DynamicDrawUsage); scene.add(drops);
    const jet = new T.Mesh(new T.BufferGeometry(), drops.material); scene.add(jet);
    const patch = new T.Mesh(new T.ExtrudeGeometry(P.three.roundRect(T, .34, .52, .08), { depth: .06, bevelEnabled: true, bevelThickness: .02, bevelSize: .02, bevelSegments: 3 }),
      new T.MeshPhysicalMaterial({ color: '#b8ff00', roughness: .2, clearcoat: 1, clearcoatRoughness: .05, emissive: new T.Color('#7fd000'), emissiveIntensity: .9 }));
    scene.add(patch);
    const pour = new T.Mesh(new T.BufferGeometry(), water.material); scene.add(pour);
    const ring = new T.Mesh(new T.TorusGeometry(1, .012, 6, 48), new T.MeshBasicMaterial({ color: '#dff8ff', transparent: true })); ring.rotation.x = Math.PI / 2; scene.add(ring);
    const m4 = new T.Matrix4(), q = new T.Quaternion(), sc = new T.Vector3(), X = new T.Vector3(1, 0, 0), v3 = new T.Vector3(), G9 = 9.0;

    G.frame((t, tf) => {
      // water surface
      const y0 = yTop(t), slosh = .035 + .05 * Math.abs(lev(t + .05) - lev(t - .05)) * 10 + (t > 5.4 && t < 7.4 ? .03 : 0);
      for (let i = 0; i < wpos.count; i++) { const bx = base[i * 3], by = base[i * 3 + 1], bz = base[i * 3 + 2];
        wpos.array[i * 3 + 1] = by > 0 ? y0 + slosh * (Math.sin(bx * 3.1 + tf * 2.6) * .6 + Math.sin(bz * 5 - tf * 3.3) * .3 + Math.sin((bx + bz) * 7 + tf * 5) * .15) : BOT + .05; }
      wpos.needsUpdate = true; wg.computeVertexNormals();
      // jet: drops leave the crack while the water stands above it, until the patch
      const head = Math.max(0, y0 - HOLE.y), open = t < PATCH;
      let n = 0;
      if (head > .02) for (let k = 0; k < N; k++) {
        const s0 = Math.floor(tf / .007) * .007 - k * .007, tau = tf - s0; if (s0 > PATCH || tau > 1.1) continue;
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
      crack.visible = t < PATCH + .1;
      // the patch flies in from the lens side and slams on (bold spring: ~5% overshoot, settled in 12 frames)
      const pk = P.springAt(t, PATCH - .18, 'bold'), po = P.springAt(t, PATCH - .18, 'fade');
      patch.visible = t > PATCH - .18; patch.position.set(lerp(-1.6, HOLE.x, pk), lerp(1.2, HOLE.y - .02, pk), lerp(3.4, HOLE.z, pk)); patch.scale.setScalar(lerp(1.7, 1, pk)); patch.rotation.z = (1 - pk) * .9; void po;
      // the pour from the address bar, with rings on the surface
      const pouring = t > 5.4 && t < 7.4, pk2 = pouring ? P.springAt(t, 5.4, 'fade') * (1 - P.tween(t, 7.0, .4, 'snap')) : 0;
      if (pk2 > .01) { const pts = []; for (let k = 0; k <= 16; k++) { const yy = lerp(TOP - BAR - .02, y0, k / 16); pts.push(new T.Vector3(.03 * Math.sin(yy * 9 + tf * 12), yy, .03 * Math.cos(yy * 7 + tf * 10))); }
        pour.geometry.dispose(); pour.geometry = new T.TubeGeometry(new T.CatmullRomCurve3(pts), 32, .045 * pk2, 8); pour.visible = true;
        const u = (tf * 1.6) % 1; ring.visible = true; ring.position.set(0, y0 + .01, 0); ring.scale.setScalar(.06 + P.EASE.swing(u) * .55); ring.material.opacity = (1 - P.EASE.snap(u)) * pk2; } else { pour.visible = false; ring.visible = false; }
    });

    // ---- the camera: close on the jet, pull back, whip in for the patch, tilt up to the bar, ride the water up ----
    P.three.look(G, [
      [0, { p: [-1.45, .62, 3.1], at: [-.55, .1, .5], fov: 30 }],
      [1.8, { p: [-.95, .4, 1.85], at: [-.55, .12, .55], fov: 30 }, 'swing'],
      [2.9, { p: [2.3, .9, 8.4], at: [0, -.05, 0], fov: 30 }, 'default'],
      [4.0, { p: [2.1, .8, 8.1], at: [0, -.05, 0], fov: 30 }, 'swing'],
      [4.35, { p: [-.75, .5, 2.6], at: [-.55, .28, .5], fov: 30 }, 'bold'],
      [5.25, { p: [.5, 2.9, 5.8], at: [0, 1.35, 0], fov: 30 }, 'default'],
      [6.7, { p: [1.3, .5, 7.4], at: [0, -.2, 0], fov: 30 }, 'default'],
      [8, { p: [1.6, .7, 7.8], at: [0, 0, 0], fov: 30 }, 'swing'],
    ], { handheld: .02 });

    E.el('div', 'position:absolute;left:0;right:0;top:0;height:300px;background:linear-gradient(180deg,rgba(4,16,24,.78),rgba(4,16,24,0));pointer-events:none', world);   // a soft scrim so the hook reads over the bright page
    P.dripWord(world, `Your site<br>is <span style="color:${RED}">leaking.</span>`, { x: 30, y: 104, size: 66, drop: AQUA, at: -1, out: 1.9, n: 6 });
    S.name = 'lab 3D';
    return { ok: true };
  };
  S.update = function (E, t) { P.update(t); };
  S.cues = () => [];
})();
