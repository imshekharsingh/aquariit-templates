// Turns Out 3D toolkit (owner, 1 Nov 2026: "build the fixes as reusable parts"): clay-diorama figures, matte title plates, trees with
// trunks, limbs and clustered canopies, and a Haussmann city with courtyards, zinc mansards, chimneys, avenues, the river and bridges.
// The scenes stay single self-contained files: this file is copied into each scene between the kit markers by
// `node scripts/channel3/kit-inline.mjs <scene.html>` (npm run check fails when a scene's copy is stale). Documented in
// design/channel3.md, "3D toolkit". Every result is a pure function of the seed and of t (K.tick(t)); no Math.random.
// Usage: var K = TOKIT(THREE, scene, { seed }); K.figure({...}); K.title([...], widthM, {...}); K.forest(); K.city({...}); K.tick(t)
window.TOKIT = function(T, scene, opt){
  opt = opt || {};
  function rnd(s){ return function(){ s |= 0; s = s + 0x6D2B79F5 | 0; var t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  var R = rnd(opt.seed || 1066), RR = function(a, b){ return a + (b - a) * R(); };
  var cl = function(v, a, b){ return v < a ? a : v > b ? b : v; };
  var V = function(a, b, c){ return new T.Vector3(a, b, c); }, Cc = function(h){ return new T.Color(h); };
  var TIME = { value: 0 };   // shared clock: wind in the trees (K.tick(t) sets it)
  var M4 = new T.Matrix4(), Q = new T.Quaternion(), YUP = V(0, 1, 0);
  function tex(size, draw, rx, ry){ var cv = document.createElement('canvas'); cv.width = cv.height = size; draw(cv.getContext('2d'), size); var t0 = new T.CanvasTexture(cv);
    t0.colorSpace = T.SRGBColorSpace; t0.wrapS = t0.wrapT = T.RepeatWrapping; t0.repeat.set(rx || 1, ry || rx || 1); t0.anisotropy = 8; return t0; }
  // GLSL value noise (3D), shared by the leaves and the water
  var NOISE = 'float kh(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }\n' +
    'float kn(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(mix(kh(i), kh(i + vec3(1, 0, 0)), f.x), mix(kh(i + vec3(0, 1, 0)), kh(i + vec3(1, 1, 0)), f.x), f.y),' +
    ' mix(mix(kh(i + vec3(0, 0, 1)), kh(i + vec3(1, 0, 1)), f.x), mix(kh(i + vec3(0, 1, 1)), kh(i + vec3(1, 1, 1)), f.x), f.y), f.z); }\n';
  // instances grouped by area, so the camera skips what it cannot see (frustum culling works per InstancedMesh)
  function batch(geo, mat, cell, o){ o = o || {}; var cells = {}, B = {
    add: function(m, col, x, z, extra){ var k = Math.floor(x / cell) + ',' + Math.floor(z / cell); (cells[k] = cells[k] || []).push([m.clone(), col ? col.clone() : null, extra]); },
    build: function(){ var out = []; Object.keys(cells).forEach(function(k){ var L = cells[k], g = o.attr ? geo.clone() : geo, im = new T.InstancedMesh(g, mat, L.length);
      if (o.attr) { var a = new Float32Array(L.length * o.attr[1]); L.forEach(function(e, i){ for (var j = 0; j < o.attr[1]; j++) a[i * o.attr[1] + j] = e[2][j]; }); g.setAttribute(o.attr[0], new T.InstancedBufferAttribute(a, o.attr[1])); }
      L.forEach(function(e, i){ im.setMatrixAt(i, e[0]); if (e[1]) im.setColorAt(i, e[1]); });
      im.castShadow = !!o.cast; im.receiveShadow = o.receive !== false; im.computeBoundingSphere(); scene.add(im); out.push(im); }); return out; } };
    return B; }
  // weld a non-indexed geometry (an icosahedron) so its normals come out smooth after it is displaced
  function weld(g){ var p = g.attributes.position, map = {}, pos = [], idx = [];
    for (var i = 0; i < p.count; i++) { var k = Math.round(p.getX(i) * 1e4) + ',' + Math.round(p.getY(i) * 1e4) + ',' + Math.round(p.getZ(i) * 1e4);
      if (!(k in map)) { map[k] = pos.length / 3; pos.push(p.getX(i), p.getY(i), p.getZ(i)); } idx.push(map[k]); }
    var o = new T.BufferGeometry(); o.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); o.setIndex(idx); return o; }
  function vnoise(x, y, z, s){ return (Math.sin(x * 2.1 + s) * Math.sin(y * 2.7 + s * 1.3) * Math.sin(z * 2.3 + s * .7) + .5 * Math.sin(x * 5.3 + y * 4.1 + s * 2) * Math.sin(z * 4.7 - y * 3.3 + s)) * .66; }   // smooth lumps for the leaf clusters

  // ======================= materials: matte clay with a little warmth in the shade (a cheap subsurface look) =======================
  var foldT = tex(256, function(g, s){ g.fillStyle = '#808080'; g.fillRect(0, 0, s, s);   // soft cloth folds, uneven, a few creases across
    for (var xx = 0; xx < s; xx++) { var u = xx / s * 6.283, v = 128 + 40 * Math.sin(u * 3 + 1.3 * Math.sin(u * 2)) + 16 * Math.sin(u * 7 + .5) + 8 * Math.sin(u * 13); g.fillStyle = 'rgb(' + [v, v, v].map(Math.round).join(',') + ')'; g.fillRect(xx, 0, 1, s); }
    for (var i = 0; i < 14; i++) { var y = RR(0, s); g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(0, y, s, RR(2, 5)); }
    for (var j = 0; j < 2600; j++) { g.fillStyle = 'rgba(' + (R() < .5 ? '0,0,0' : '255,255,255') + ',.05)'; g.fillRect(RR(0, s), RR(0, s), 2, 2); } }, 1);
  var hairT = tex(128, function(g, s){ g.fillStyle = '#808080'; g.fillRect(0, 0, s, s);   // combed strands
    for (var i = 0; i < 900; i++) { var xx = RR(0, s), v = R() < .5 ? 'rgba(0,0,0,.22)' : 'rgba(255,255,255,.22)'; g.fillStyle = v; g.fillRect(xx, RR(0, s), 1, RR(10, 40)); } }, 1);
  var thumbT = tex(64, function(g, s){ g.fillStyle = '#808080'; g.fillRect(0, 0, s, s);   // a faint thumbprint texture on the clay: hand-made
    for (var i = 0; i < 260; i++) { g.fillStyle = 'rgba(' + (R() < .5 ? '0,0,0' : '255,255,255') + ',.07)'; g.beginPath(); g.arc(RR(0, s), RR(0, s), RR(2, 6), 0, 6.283); g.fill(); } }, 1);
  [foldT, hairT, thumbT].forEach(function(t0){ t0.colorSpace = T.NoColorSpace; });
  var mats = {};
  function clay(h, o){ o = o || {}; var key = h + '|' + [o.r, o.m, o.bump, o.bs, o.sss, o.vc, o.side].join('|'); if (mats[key]) return mats[key];
    var m = new T.MeshStandardMaterial({ color: Cc(h), roughness: o.r == null ? .8 : o.r, metalness: o.m || 0, vertexColors: !!o.vc, side: o.side || T.FrontSide });
    var b = o.bump === 'folds' ? foldT : o.bump === 'hair' ? hairT : o.bump === 'none' ? null : thumbT; if (b) { m.bumpMap = b; m.bumpScale = o.bs || (b === thumbT ? .6 : 2); }
    var k = (o.sss == null ? .12 : o.sss).toFixed(3);
    m.onBeforeCompile = function(sh){ sh.fragmentShader = sh.fragmentShader.replace('#include <lights_fragment_end>', '#include <lights_fragment_end>\n' +
      '{ float rim = 1. - max(dot(normal, geometryViewDir), 0.); reflectedLight.indirectDiffuse += diffuseColor.rgb * vec3(1., .52, .36) * ' + k + ' * (.55 + 1.1 * rim * rim); }'); };
    m.customProgramCacheKey = function(){ return 'clay' + k; };
    return mats[key] = m; }

  // ======================= figures: hand-made clay diorama miniatures (owner, 1 Nov 2026) =======================
  // About 1.75 m tall with a head of about 1/6 of the height (a miniature's proportions), rounded soft forms, turned coats with real
  // folds in the cloth, lapels, buttons, collars and cuffs, hands with a thumb, skin-tone faces with simple eyes, brows, a nose, ears and
  // cheeks with a little colour, hair, beards and moustaches, hats. Recognised by props and setting, never a likeness (CLAUDE.md
  // exception for Turns Out). o.lod = 1 drops the small parts for crowds. fig.userData.idle(t) breathes and turns the head.
  var FG = null;
  function figGeo(){ if (FG) return FG;
    var L = function(pts, n){ return new T.LatheGeometry(pts.map(function(p){ return new T.Vector2(p[0], p[1]); }), n || 30); };
    // cloth folds in the geometry: the skirt of a coat ripples more toward the hem (y0) than at the waist (y1)
    function folds(g, amp, n, y0, y1){ var p = g.attributes.position; for (var i = 0; i < p.count; i++) { var x0 = p.getX(i), z0 = p.getZ(i), y = p.getY(i), r = Math.hypot(x0, z0); if (r < 1e-4) continue;
      var a = Math.atan2(x0, z0), w = Math.pow(cl((y1 - y) / (y1 - y0), 0, 1), 1.3), f = 1 + amp * w * (.62 * Math.sin(a * n + 1.7) + .38 * Math.sin(a * (2 * n + 1) + .4)); p.setX(i, x0 * f); p.setZ(i, z0 * f); }
      g.computeVertexNormals(); return g; }
    function shape(pts){ var s = new T.Shape(); pts.forEach(function(p, i){ if (i) s.lineTo(p[0], p[1]); else s.moveTo(p[0], p[1]); }); return s; }
    function slab(pts, d){ var g = new T.ExtrudeGeometry(shape(pts), { depth: d, bevelEnabled: true, bevelThickness: d * .4, bevelSize: d * .4, bevelSegments: 2, curveSegments: 4 }); return onChest(g, .001); }
    // lay a flat piece (lapel, shirt front) onto the curved chest of the coat: z follows the turned body (flattened to 0.74 in depth)
    function onChest(g, lift){ var p = g.attributes.position; for (var i = 0; i < p.count; i++) p.setZ(i, p.getZ(i) + chestZ(p.getX(i), p.getY(i)) + lift); g.computeVertexNormals(); return g; }
    // the head: an egg with a narrower jaw and a little chin, cheeks with colour (vertex colours multiply the skin)
    function head(seg){ var g = new T.SphereGeometry(1, seg * 4 / 3 | 0, seg), p = g.attributes.position, col = [];
      for (var i = 0; i < p.count; i++) { var x0 = p.getX(i), y = p.getY(i), z = p.getZ(i);
        if (y < 0) { x0 *= 1 - .2 * Math.pow(-y, 1.4); z += .06 * Math.max(0, -y - .45) * (z > 0 ? 1 : 0); }
        if (z < 0) z *= .94; p.setXYZ(i, x0 * .115, y * .14, z * .1225);
        var bl = Math.max(Math.exp(-(Math.pow(x0 - .52, 2) + Math.pow(y + .2, 2) + Math.pow(z - .78, 2)) / .05), Math.exp(-(Math.pow(x0 + .52, 2) + Math.pow(y + .2, 2) + Math.pow(z - .78, 2)) / .05));
        var nose = Math.exp(-(x0 * x0 + Math.pow(y + .05, 2)) / .03) * (z > .8 ? 1 : 0);
        col.push(1, 1 - .14 * bl - .05 * nose, 1 - .16 * bl - .06 * nose); }
      g.setAttribute('color', new T.Float32BufferAttribute(col, 3)); g.computeVertexNormals(); return g; }
    FG = {
      frock: folds(L([[.001, .47], [.235, .47], [.245, .5], [.225, .62], [.2, .78], [.186, .9], [.196, 1.02], [.21, 1.16], [.213, 1.25], [.2, 1.32], [.165, 1.37], [.09, 1.4], [.05, 1.41], [.001, 1.41]], 36), .07, 5, .47, .9),
      tunic: folds(L([[.001, .74], [.205, .74], [.212, .78], [.196, .88], [.19, .92], [.198, 1.02], [.21, 1.16], [.213, 1.25], [.2, 1.32], [.165, 1.37], [.09, 1.4], [.05, 1.41], [.001, 1.41]], 32), .04, 6, .74, .92),
      jacket: folds(L([[.001, .66], [.215, .66], [.22, .7], [.2, .82], [.19, .9], [.198, 1.02], [.21, 1.16], [.213, 1.25], [.2, 1.32], [.165, 1.37], [.09, 1.4], [.05, 1.41], [.001, 1.41]], 32), .04, 6, .66, .9),
      dress: folds(L([[.001, .03], [.42, .03], [.43, .06], [.4, .16], [.34, .38], [.27, .62], [.19, .84], [.165, .92], [.18, 1.08], [.195, 1.22], [.19, 1.3], [.16, 1.36], [.09, 1.4], [.05, 1.41], [.001, 1.41]], 36), .06, 7, .03, .84),
      leg: new T.CapsuleGeometry(.07, .5, 6, 14), shoe: new T.SphereGeometry(.066, 16, 10),
      upper: new T.CapsuleGeometry(.058, .2, 6, 14), fore: new T.CapsuleGeometry(.05, .18, 6, 14), cuff: new T.CylinderGeometry(.054, .054, .03, 16),
      palm: new T.SphereGeometry(.042, 14, 10), thumb: new T.CapsuleGeometry(.015, .034, 4, 8),
      neck: new T.CylinderGeometry(.046, .05, .09, 14), collar: new T.CylinderGeometry(.056, .06, .045, 18), head: head(24), headLo: head(12),
      ear: new T.SphereGeometry(.03, 10, 8), nose: new T.SphereGeometry(.021, 12, 10), eye: new T.SphereGeometry(.0135, 10, 8), brow: new T.CapsuleGeometry(.0075, .028, 3, 8),
      mouth: new T.TorusGeometry(.017, .0036, 6, 12, Math.PI),
      hair: new T.SphereGeometry(.133, 28, 16, 0, 6.283, 0, 1.3), bun: new T.SphereGeometry(.065, 14, 10),
      beard: new T.SphereGeometry(.131, 28, 14, .25, Math.PI - .5, 1.82, Math.PI - 1.82), stache: new T.CapsuleGeometry(.0115, .036, 4, 8), burn: new T.CapsuleGeometry(.02, .06, 4, 8),
      lapel: [-1, 1].map(function(s){ return slab([[.03, 1.385], [.1, 1.355], [.088, 1.322], [.118, 1.275], [.032, 1.075]].map(function(p){ return [s * p[0], p[1]]; }), .008); }),
      shirt: onChest(new T.ShapeGeometry(shape([[-.042, 1.37], [-.02, 1.385], [.02, 1.385], [.042, 1.37], [0, 1.1]])), -.003), bow: new T.SphereGeometry(.018, 10, 8),
      button: new T.SphereGeometry(.012, 10, 8), seam: new T.TorusGeometry(.188, .006, 6, 32),
      top: L([[.001, 0], [.118, 0], [.113, .06], [.12, .19], [.127, .225], [.001, .225]], 24), brim: L([[.001, 0], [.2, 0], [.218, .016], [.212, .03], [.18, .013], [.001, .013]], 28), band: new T.CylinderGeometry(.1185, .117, .04, 24),
      bowl: new T.SphereGeometry(.132, 22, 12, 0, 6.283, 0, 1.57), kepi: new T.CylinderGeometry(.108, .124, .14, 22), visor: new T.CylinderGeometry(.095, .095, .009, 18, 1, false, -Math.PI / 2, Math.PI),
      hband: new T.TorusGeometry(.135, .011, 6, 20, Math.PI), disc: new T.CylinderGeometry(.044, .044, .032, 16), flower: new T.SphereGeometry(.032, 8, 6), feather: new T.CapsuleGeometry(.02, .17, 3, 6),
      bustle: new T.SphereGeometry(.2, 16, 12), parasol: L([[.001, .2], [.12, .17], [.3, .09], [.46, 0], [.45, -.01], [.001, .19]], 24), stick: new T.CylinderGeometry(.01, .01, .95, 6),
      shadow: new T.PlaneGeometry(1, 1) };
    FG.shadow.rotateX(-Math.PI / 2);
    FG.cshadow = new T.MeshBasicMaterial({ map: tex(128, function(g, s){ var gr = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2); gr.addColorStop(0, 'rgba(18,12,8,.7)'); gr.addColorStop(.4, 'rgba(18,12,8,.38)'); gr.addColorStop(1, 'rgba(18,12,8,0)'); g.fillStyle = gr; g.fillRect(0, 0, s, s); }, 1), transparent: true, depthWrite: false, fog: false });
    return FG; }
  function chestR(y){ var P = [[.9, .186], [1.02, .196], [1.16, .21], [1.25, .213], [1.32, .2], [1.37, .165], [1.4, .09]]; if (y <= P[0][0]) return P[0][1];
    for (var i = 1; i < P.length; i++) if (y <= P[i][0]) return P[i - 1][1] + (P[i][1] - P[i - 1][1]) * (y - P[i - 1][0]) / (P[i][0] - P[i - 1][0]); return .09; }
  function chestZ(x, y){ var r = chestR(y); return .74 * Math.sqrt(Math.max(r * r - x * x, 0)); }
  var SKIN = ['#e3b08b', '#d9a17a', '#c98d64', '#b97a52', '#e9bf9d', '#a86c47'];
  function part(g0, geo, mat, x, y, z, cast){ var o = new T.Mesh(geo, mat); o.position.set(x, y, z); o.castShadow = cast !== false; g0.add(o); return o; }
  function figure(o){
    var G = figGeo(), lo = o.lod === 1, g = new T.Group(), body = new T.Group(); g.add(body);
    var skin = clay(o.skin || SKIN[R() * SKIN.length | 0], { r: .62, sss: .3, vc: true }), skinP = clay(o.skin || '#dcaa84', { r: .62, sss: .3 });
    var coat = clay(o.coat, { r: .82, bump: 'folds', bs: 2.4 }), white = clay('#efe8db', { r: .72, sss: .18 }), dark = clay('#1a1512', { r: .45 });
    var hairM = clay(o.hair || '#4a3626', { r: .9, bump: 'hair', bs: 3 }), trousers = clay(o.trousers || '#3a3633', { r: .85, bump: 'folds', bs: 1.6 });
    var facing = clay(o.facing || o.coat, { r: .55, bump: 'none' });
    if (o.dress) {
      part(body, G.dress, coat, 0, 0, 0).scale.set(1, 1, .84); part(body, G.bustle, coat, 0, .86, -.15).scale.set(1, .8, .9);
      part(body, G.collar, clay(o.trim || '#efe4cf', { r: .7 }), 0, 1.41, 0);
      if (!lo) [1.3, 1.22, 1.14, 1.06].forEach(function(y){ part(body, G.button, clay(o.trim || '#efe4cf', { r: .5 }), 0, y, .16, false); });
    } else {
      [-1, 1].forEach(function(s){ part(body, G.leg, trousers, s * .088, .37, 0).scale.set(1, 1, .95); part(body, G.shoe, clay('#1d1714', { r: .38 }), s * .088, .04, .035).scale.set(.95, .55, 1.8); });
      var torso = part(body, o.tunic ? G.tunic : o.jacket ? G.jacket : G.frock, coat, 0, 0, 0); torso.scale.set(1, 1, .74);
      part(body, G.collar, white, 0, 1.4, 0);
      if (!lo) {
        if (!o.tunic) { part(body, G.shirt, white, 0, 0, 0, false); part(body, G.bow, dark, 0, 1.36, chestZ(0, 1.36) + .004, false).scale.set(1.5, .7, .6);
          [-1, 1].forEach(function(s){ part(body, G.lapel[s > 0 ? 1 : 0], facing, 0, 0, 0, false); }); }
        var bt = o.buttons || dark;
        if (o.tunic) [1.26, 1.15, 1.04, .93, .83].forEach(function(y){ part(body, G.button, bt, 0, y, chestZ(0, y) + .004, false); });
        else [1.03, .95].forEach(function(y){ [-1, 1].forEach(function(s){ part(body, G.button, bt, s * .05, y, chestZ(s * .05, y) + .003, false); }); });
        var sm = part(body, G.seam, coat, 0, .9, 0, false); sm.rotation.x = Math.PI / 2; sm.scale.set(1, .76, 1);
      }
      if (o.belt) part(body, G.cuff, clay('#1e1a17', { r: .5 }), 0, .9, 0).scale.set(3.65, 1.2, 2.75);
    }
    // arms: shoulder > upper arm > elbow > forearm, cuff > hand (palm and fingers in one rounded mitt, and a thumb)
    var arms = [-1, 1].map(function(s){
      var sh = new T.Group(); sh.position.set(s * .2, 1.33, 0); sh.rotation.z = s * .09; body.add(sh); part(sh, G.upper, coat, 0, -.13, 0);
      var el = new T.Group(); el.position.y = -.27; el.rotation.x = -.22; sh.add(el); part(el, G.fore, coat, 0, -.115, 0);
      if (!o.dress) part(el, G.cuff, white, 0, -.235, 0);
      var hand = new T.Group(); hand.position.y = -.27; el.add(hand); part(hand, G.palm, skinP, 0, -.035, 0).scale.set(.85, 1.45, .58);
      if (!lo) { var th = part(hand, G.thumb, skinP, -s * .03, -.022, .022); th.rotation.set(.35, 0, -s * .55); }
      sh.userData.elbow = el; sh.userData.hand = hand; return sh; });
    // the head (pivot at the neck, so it can turn): face, ears, hair, beard
    part(body, G.neck, skinP, 0, 1.43, 0);
    var hd = new T.Group(); hd.position.set(0, 1.465, 0); body.add(hd); var hc = V(0, .14, 0);
    part(hd, lo ? G.headLo : G.head, skin, hc.x, hc.y, hc.z);
    [-1, 1].forEach(function(s){
      part(hd, G.eye, clay('#21170f', { r: .22, bump: 'none', sss: 0 }), s * .04, .153, .109, false).scale.set(1, 1.2, .7);
      if (!lo) { part(hd, G.ear, skinP, s * .112, .14, -.004).scale.set(.42, 1, .72); var bw = part(hd, G.brow, clay(o.brows || o.hair || '#4a3626', { r: .9 }), s * .042, .184, .108, false); bw.rotation.z = Math.PI / 2 - s * .1; bw.rotation.y = s * .25; }
    });
    part(hd, G.nose, skinP, 0, .128, .121, false).scale.set(.85, 1, 1.05);
    if (!lo && !o.beard) { var mo = part(hd, G.mouth, clay('#8a4a3e', { r: .6 }), 0, .09, .111, false); mo.rotation.z = Math.PI; mo.rotation.x = -.2; }
    var hr = part(hd, G.hair, hairM, 0, hc.y + .004, -.008); hr.rotation.x = -.5; hr.scale.set(.93, 1.08, 1);
    if (o.bun) part(hd, G.bun, hairM, 0, hc.y + .07, -.12);
    if (o.beard || o.stache) { var bm = clay(o.beard || o.stache, { r: .92, bump: 'hair', bs: 3 });
      if (o.beard) { var bd = part(hd, G.beard, bm, 0, hc.y - .006, .004); bd.scale.set(.96, 1.28, 1.06); bd.material = clay(o.beard, { r: .92, bump: 'hair', bs: 3, side: T.DoubleSide });
        [-1, 1].forEach(function(s){ part(hd, G.burn, bm, s * .104, .12, .028).rotation.x = .15; }); }
      [-1, 1].forEach(function(s){ var st = part(hd, G.stache, bm, s * .021, .098, .119, false); st.rotation.z = s * (Math.PI / 2 - .4); st.rotation.y = s * .3; }); }
    var hatC = clay(o.hatCol || '#1d1b1a', { r: .5 });
    if (o.hat === 'top') { var tp = new T.Group(); tp.position.set(0, .222, -.006); tp.rotation.x = -.06; hd.add(tp); part(tp, G.top, hatC, 0, 0, 0); part(tp, G.brim, hatC, 0, -.004, 0).scale.set(1, 1, .88); part(tp, G.band, clay('#3a3634', { r: .6 }), 0, .03, 0); }
    else if (o.hat === 'bowler') { var bw2 = new T.Group(); bw2.position.set(0, .2, -.004); hd.add(bw2); part(bw2, G.bowl, hatC, 0, 0, 0).scale.set(.95, .95, 1.02); part(bw2, G.brim, hatC, 0, 0, 0).scale.set(.85, 1, .82); }
    else if (o.hat === 'kepi') { var kp = new T.Group(); kp.position.set(0, .275, -.004); kp.rotation.x = .1; hd.add(kp); part(kp, G.kepi, clay('#b2332c', { r: .62 }), 0, .02, 0);
      part(kp, G.band, clay('#26314f', { r: .6 }), 0, -.035, 0).scale.set(1.08, 1.3, 1.08); var vs = part(kp, G.visor, clay('#15120f', { r: .3 }), 0, -.05, .085); vs.rotation.x = -.12; vs.scale.set(1, 1, .75); }
    else if (o.hat === 'lady') { var lh = new T.Group(); lh.position.set(0, .225, -.012); lh.rotation.x = -.14; hd.add(lh); part(lh, G.brim, hatC, 0, 0, 0).scale.set(1.2, 1, 1.2); part(lh, G.bowl, hatC, 0, 0, 0).scale.set(.8, .55, .8);
      [[-.07, .08], [.02, .11], [.09, .05]].forEach(function(f, i){ part(lh, G.flower, clay(['#e7c45a', '#f2efe6', '#c9566a'][i], { r: .7 }), f[0], .05, f[1], false); });
      if (!lo) { var fe = part(lh, G.feather, clay('#f3eee4', { r: .8 }), -.1, .1, -.05, false); fe.rotation.z = .9; } }
    if (o.phones) { part(hd, G.hband, clay('#2a2a2a', { r: .4, m: .5 }), 0, hc.y + .03, 0); [-1, 1].forEach(function(s){ part(hd, G.disc, clay('#2a2a2a', { r: .4, m: .5 }), s * .124, hc.y - .005, 0).rotation.z = Math.PI / 2; }); }
    if (o.parasol) { var pp = new T.Group(); pp.position.set(0, -.03, 0); arms[1].userData.hand.add(pp); arms[1].rotation.x = -.5; arms[1].userData.elbow.rotation.x = -1.2; pp.rotation.x = 1.45;
      part(pp, G.stick, clay('#3b2f25'), 0, .42, 0); part(pp, G.parasol, clay(o.parasol, { r: .85, bump: 'folds', bs: 1 }), 0, .84, 0); }
    var cs = new T.Mesh(G.shadow, G.cshadow); cs.scale.set(o.dress ? 1.1 : .95, 1, .85); cs.position.y = .025; g.add(cs);
    var ph = R() * 6.283;
    g.userData = { arms: arms, head: hd, body: body, ph: ph, idle: function(t, k){ k = k == null ? 1 : k;   // breathing, a slow look round, a small weight shift
      body.scale.y = 1 + .007 * k * Math.sin(t * 2.2 + ph); body.rotation.z = .012 * k * Math.sin(t * .7 + ph);
      hd.rotation.y = k * (.22 * Math.sin(t * .45 + ph) + .06 * Math.sin(t * 1.1 + ph * 2)); hd.rotation.x = .04 * k * Math.sin(t * .8 + ph); } };
    return g; }

  // ======================= titles: type set in 3D on a thin matte plate (owner, 1 Nov 2026: no glow behind titles) =======================
  // Cream letters (solid: 9 stacked alpha-tested layers, the back ones dark bronze) on a thin dark plate with slight transparency and a
  // fine amber rule inside its edge. Contrast holds on sky, iron and city at phone size. o.plate = false sets the type alone (dark type
  // for open sky: o.col '#2a1c12'). lines: [[text, px, weight, family, letterSpacing, colour]].
  var FD = "'Playfair Display',Georgia,serif";
  function title(lines, wM, o){
    o = o || {}; var cw = 2048, ch = 0, mw = 0; lines.forEach(function(L){ ch += L[1] * 1.2; }); ch = Math.ceil(ch + 40);
    var cv = document.createElement('canvas'); cv.width = cw; cv.height = ch; var g = cv.getContext('2d'), y = 20;
    var cvC = document.createElement('canvas'); cvC.width = cw; cvC.height = ch; var gC = cvC.getContext('2d');
    g.textAlign = gC.textAlign = 'center'; g.textBaseline = gC.textBaseline = 'top';
    lines.forEach(function(L){ [g, gC].forEach(function(q){ q.font = L[2] + ' ' + L[1] + 'px ' + (L[3] || FD); q.letterSpacing = (L[4] || 0) + 'px'; });
      mw = Math.max(mw, g.measureText(L[0]).width); g.fillStyle = '#fff'; g.fillText(L[0], cw / 2, y); gC.fillStyle = L[5] || o.col || '#fbf1e1'; gC.fillText(L[0], cw / 2, y); y += L[1] * 1.2; });
    var mt = new T.CanvasTexture(cv), mc = new T.CanvasTexture(cvC); [mt, mc].forEach(function(t0){ t0.colorSpace = T.SRGBColorSpace; t0.anisotropy = 8; });
    var grp = new T.Group(), hM = wM * ch / cw, geo = new T.PlaneGeometry(wM, hM), layers = o.layers || 9, depth = o.depth || wM * .03;
    for (var i = layers - 1; i >= 0; i--) {
      var front = i === 0, m = new T.MeshStandardMaterial({ map: front ? mc : mt, alphaMap: front ? mt : null, alphaTest: .5, color: Cc(front ? '#ffffff' : (o.side || '#5a3c22')), roughness: front ? .55 : .6, metalness: front ? 0 : .3,
        emissive: Cc(front ? '#ffffff' : '#000000'), emissiveMap: front ? mc : null, emissiveIntensity: front ? (o.lit == null ? .35 : o.lit) : 0, side: T.DoubleSide, fog: false });
      var pl = new T.Mesh(geo, m); pl.position.z = -i * depth / layers; grp.add(pl); }
    if (o.plate !== false) {
      var pad = Math.min(hM * .22, wM * .08), pw = mw / cw * wM + pad * 2.6, phh = hM * 1.12 + pad, pm = new T.ShaderMaterial({ transparent: true, depthWrite: true, fog: false, side: T.DoubleSide,   // writes depth: the depth of field keeps it sharp with its letters
        uniforms: { opacity: { value: 1 }, c: { value: Cc(o.plateCol || '#15100c') }, rule: { value: Cc(o.rule || '#d9a25e') }, size: { value: new T.Vector2(pw, phh) }, a0: { value: o.alpha || .93 } },
        vertexShader: 'varying vec2 vu; void main(){ vu = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }',
        fragmentShader: 'varying vec2 vu; uniform float opacity, a0; uniform vec3 c, rule; uniform vec2 size;\n' +
          'void main(){ vec2 h = size * .5, p = (vu - .5) * size; float r = min(h.x, h.y) * .14; vec2 q = abs(p) - (h - r); float d = length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r;\n' +
          '  float aa = fwidth(d) * .8, inside = 1. - smoothstep(-aa, aa, d), ins = min(h.x, h.y) * .06, lw = min(h.x, h.y) * .009;\n' +
          '  float ln = 1. - smoothstep(lw - aa, lw + aa, abs(d + ins));\n' +
          '  gl_FragColor = vec4(mix(c, rule, ln), inside * opacity * mix(a0, .95, ln)); }' });
      var pl2 = new T.Mesh(new T.PlaneGeometry(pw, phh), pm); pl2.position.z = -depth - wM * .012; pl2.renderOrder = -1; pl2.userData.plate = 1; grp.add(pl2); }
    grp.userData.h = hM; scene.add(grp); grp.visible = false; return grp; }
  // title in/out: rises a little and settles (k from 0 to 1); the plate arrives with the letters
  function titleFade(g0, k){ g0.children.forEach(function(m){ if (m.userData.plate) { m.material.uniforms.opacity.value = cl(k * 1.4, 0, 1); return; } m.material.transparent = k < .99; m.material.opacity = cl(k * 1.6, 0, 1); }); }

  // ======================= trees: trunk, limbs and clustered canopies (owner, 1 Nov 2026: no more ball trees) =======================
  // K.tree(x, z, s, kind): 'plane' (the pruned London planes of Paris avenues: mottled bark, a tall crown), 'round' (park trees, wider),
  // 'far' (a cheap one for the distance); hero = true gives the canopy finer lumps (trees close to a camera). Canopies are lumpy leaf clusters (three shapes) in three greens, shaded as one volume (lit
  // side and shadow side, darker inside and underneath), with leaf texture up close and a slight sway in the wind. K.forest() builds them.
  var TREES = [], LIMBS = [], TRUNKS = [];
  function tree(x, z, s, kind, hero){ kind = kind || 'plane'; var far = kind === 'far', round = kind === 'round';
    var h0 = (round ? 2.2 : 2.8) * s * RR(.9, 1.1), cy = h0 + (round ? 3.4 : 4) * s, rx = (round ? 4.6 : 3.6) * s * RR(.9, 1.08), ry = (round ? 3.6 : 4.3) * s, lean = RR(-.04, .04);
    TRUNKS.push([x, z, s, h0, kind]);
    var n = far ? 4 : round ? 13 : 11, a0 = R() * 6.283; hero = !far && !!hero;
    if (!far) for (var b = 0; b < 3; b++) { var a = a0 + b * 2.094 + RR(-.3, .3), e = V(x + Math.cos(a) * rx * .55, cy + RR(-.2, .9) * s, z + Math.sin(a) * rx * .55);
      LIMBS.push([V(x, h0 - .3 * s, z), e, .2 * s]); LIMBS.push([e, V(e.x + Math.cos(a + .6) * rx * .3, e.y + ry * .45, e.z + Math.sin(a + .6) * rx * .3), .08 * s]); }
    for (var i = 0; i < n; i++) { var u = R() * 6.283, w = far ? RR(-.3, .6) : RR(-.8, .95), rr = Math.sqrt(1 - w * w) * RR(.45, .8);
      var px = x + Math.cos(u) * rr * rx + lean * (w + 1) * ry, py = cy + w * ry * .62, pz = z + Math.sin(u) * rr * rx, sz = (far ? RR(2.4, 3) : RR(2, 2.7)) * s * (1.1 - .25 * Math.abs(w));
      TREES.push({ p: V(px, py, pz), s: sz, c: [x, cy, z, Math.max(rx, ry)], far: far, hero: hero, k: R() }); } }
  var barkT = tex(256, function(g, s){ g.fillStyle = '#8b8170'; g.fillRect(0, 0, s, s);   // plane-tree bark: patches of cream, olive and grey
    for (var i = 0; i < 160; i++) { g.fillStyle = ['#b9ae8c', '#6f6a55', '#a59a7c', '#5d574a', '#c7bd9e'][R() * 5 | 0]; g.beginPath(); var cx = RR(0, s), cy = RR(0, s);
      for (var k = 0; k < 7; k++) { var a = k / 7 * 6.283, r = RR(6, 22); g.lineTo(cx + Math.cos(a) * r * 1.6, cy + Math.sin(a) * r); } g.fill(); } }, 1, 3);
  function forest(){
    var greens = ['#4f6d2c', '#5f7e32', '#3f5a26', '#6f8a3a', '#56722f'].map(Cc), col = new T.Color();
    var protos = [0, 1, 2].map(function(sd){ return [2, 1].map(function(det){ var g = weld(new T.IcosahedronGeometry(1, det)), p = g.attributes.position;
      for (var i = 0; i < p.count; i++) { var x0 = p.getX(i), y = p.getY(i), z = p.getZ(i), r = 1 + .2 * vnoise(x0 * 1.3, y * 1.3, z * 1.3, sd * 3.1 + 1) + .09 * vnoise(x0 * 3.3, y * 3.3, z * 3.3, sd + 7);
        if (y < 0) r *= 1 - .18 * (-y); p.setXYZ(i, x0 * r, y * r * .86, z * r); }
      g.computeVertexNormals(); return g; }); });
    var leafMat = new T.MeshStandardMaterial({ roughness: .92 });
    leafMat.onBeforeCompile = function(sh){ sh.uniforms.uT = TIME;
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute vec4 aC; uniform float uT; varying vec3 vWP; varying float vAO;')
        .replace('#include <beginnormal_vertex>', 'vec4 wq = modelMatrix * instanceMatrix * vec4(position, 1.); vec3 cd = normalize(wq.xyz - aC.xyz); mat3 kim = mat3(instanceMatrix);\n' +
          'vec3 objectNormal = normalize(mix(normal, normalize(transpose(kim) * cd), .6));')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nfloat sw = sin(uT * 1.5 + aC.x * .11 + aC.z * .07) * .6 + sin(uT * 2.6 + aC.z * .13 + position.x) * .4;\n' +
          'transformed.x += sw * .028 * (position.y + 1.2); transformed.z += cos(uT * 1.2 + aC.x * .09) * .02 * (position.y + 1.2);\n' +
          'vWP = wq.xyz; vAO = smoothstep(-1.15, .85, (wq.y - aC.y) / aC.w) * .75 + .25 * smoothstep(-1., .5, position.y);');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vWP; varying float vAO;\n' + NOISE)
        .replace('#include <color_fragment>', '#include <color_fragment>\nfloat fd = 1. - smoothstep(120., 420., length(vWP - cameraPosition));\n' +
          'float ln = kn(vWP * 2.4) * .55 + kn(vWP * 6.1) * .45; diffuseColor.rgb *= (.5 + .55 * vAO) * mix(1., .72 + .5 * ln, fd);'); };
    leafMat.customProgramCacheKey = function(){ return 'kit-leaves'; };
    var B = [0, 1, 2].map(function(sd){ return [0, 1].map(function(det){ return batch(protos[sd][det], leafMat, 260, { cast: true, attr: ['aC', 4] }); }); });
    TREES.forEach(function(L){ var det = L.hero ? 0 : 1, sd = L.k * 3 | 0; Q.setFromAxisAngle(YUP, L.k * 37);
      col.copy(greens[(L.k * 97 | 0) % greens.length]).multiplyScalar(.86 + .2 * ((L.k * 13) % 1) + .1 * cl((L.p.y - L.c[1]) / L.c[3], -1, 1));
      B[sd][det].add(M4.compose(L.p, Q, V(L.s, L.s * RR(.8, .95), L.s)), col, L.p.x, L.p.z, L.c); });
    B.forEach(function(r){ r.forEach(function(b){ b.build(); }); });
    var wood = new T.MeshStandardMaterial({ map: barkT, roughness: .95 }), cyl = new T.CylinderGeometry(.62, 1, 1, 8, 1); cyl.translate(0, .5, 0);
    var BT = batch(cyl, wood, 260, { cast: true });
    TRUNKS.forEach(function(q){ BT.add(M4.compose(V(q[0], 0, q[1]), Q.identity(), V(.4 * q[2], q[3] + .2, .4 * q[2])), null, q[0], q[1]); });
    LIMBS.forEach(function(L){ var d = L[1].clone().sub(L[0]), len = d.length(); Q.setFromUnitVectors(YUP, d.normalize()); BT.add(M4.compose(L[0], Q, V(L[2], len, L[2])), null, L[0].x, L[0].z); });
    BT.build(); TREES.length = LIMBS.length = TRUNKS.length = 0; }

  // ======================= the city: Haussmann blocks with courtyards, zinc mansards, chimneys, avenues, the river and bridges =======================
  // o: { near: radius of full detail (courtyard blocks split into buildings with chimneys), mid: radius of plain courtyard blocks,
  // far: radius of single far blocks (88 m cells), skip(x, z, f): true where no block may stand (parks, the river, the camera),
  // avenues: [[x0, z0, x1, z1, width]] (cut through the blocks, trees down both sides), river: { z, w, bridges: [x...] } }
  // Facades are drawn in the shader at real scale (a shop floor, five floors of tall windows, iron balconies on the 2nd and 5th), so
  // windows never stretch; patterns fade to their average with distance (no shimmer).
  function facadeMat(){
    var m = new T.MeshStandardMaterial({ color: Cc('#e4d6bb'), roughness: .9 });
    m.onBeforeCompile = function(sh){
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec4 vF;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvec3 sc = vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz)); vec3 lp = position * sc;\n' +
          'float sd = fract(sin(float(gl_InstanceID) * 12.9898) * 43758.5453); vF = vec4(abs(normal.x) > .5 ? lp.z : lp.x, lp.y + sc.y * .5, abs(normal.y) > .5 ? 0. : 1., sd);');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec4 vF;')
        .replace('#include <color_fragment>', '#include <color_fragment>\nif (vF.z > .5) {\n' +
          '  float u = vF.x + vF.w * 7., v = vF.y, top = v; vec3 st = diffuseColor.rgb, win = vec3(.2, .23, .27), shop = vec3(.26, .22, .19);\n' +
          '  float fu = fract(u / 3.1), aw = clamp(1. - fwidth(u) * 1.6, 0., 1.);\n' +
          '  float g = step(v, 4.4), fv = fract((v - 4.4) / 3.15), fl = floor((v - 4.4) / 3.15);\n' +
          '  float w = step(.3, fu) * step(fu, .7) * step(.2, fv) * step(fv, .84) * (1. - g);\n' +
          '  float sp = g * step(.12, fu) * step(fu, .88) * step(.4, v) * step(v, 3.7);\n' +
          '  float bal = (1. - g) * step(fv, .2) * step(.1, fv) * (step(abs(fl - 1.), .1) + step(abs(fl - 4.), .1));\n' +
          '  float sill = (1. - g) * step(.3, fu) * step(fu, .7) * step(.84, fv) * step(fv, .9);\n' +
          '  vec3 pc = st; pc = mix(pc, st * .82, g); pc = mix(pc, shop, sp); pc = mix(pc, win, w); pc = mix(pc, vec3(.17, .16, .15), bal * .9); pc = mix(pc, st * 1.08, sill);\n' +
          '  vec3 av = mix(st * .9, win, .2); diffuseColor.rgb = mix(av, pc, aw);\n}'); };
    m.customProgramCacheKey = function(){ return 'kit-facade'; }; return m; }
  function roofMat(){
    var m = new T.MeshStandardMaterial({ color: Cc('#7a8796'), roughness: .5, metalness: .3 });
    m.onBeforeCompile = function(sh){
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vR;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvR = vec3(position.x * length(instanceMatrix[0].xyz), position.y, abs(normal.z) > .6 && position.y < .75 ? 1. : 0.);');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vR;')
        .replace('#include <color_fragment>', '#include <color_fragment>\n{ float aw = clamp(1. - fwidth(vR.x) * 1.4, 0., 1.), fu = fract(vR.x / 3.1);\n' +
          '  float seam = 1. - .12 * step(.9, fract(vR.x / .62)) * aw;\n' +
          '  float dm = vR.z * step(.36, fu) * step(fu, .64) * step(.14, vR.y) * step(vR.y, .6);\n' +
          '  float dwin = vR.z * step(.4, fu) * step(fu, .6) * step(.18, vR.y) * step(vR.y, .52);\n' +
          '  vec3 c = diffuseColor.rgb * seam; c = mix(c, vec3(.9, .88, .84), dm * aw * .8); c = mix(c, vec3(.16, .18, .22), dwin * aw);\n' +
          '  diffuseColor.rgb = mix(diffuseColor.rgb * mix(1., .93, vR.z), c, aw); }'); };
    m.customProgramCacheKey = function(){ return 'kit-roof'; }; return m; }
  function mansard(){   // a mansard along x: steep lower slopes, a shallow top; 1 x 1 x 1, base at y = 0
    var s = new T.Shape(); [[-.5, 0], [-.37, .74], [-.14, 1], [.14, 1], [.37, .74], [.5, 0]].forEach(function(p, i){ if (i) s.lineTo(p[0], p[1]); else s.moveTo(p[0], p[1]); });
    var g = new T.ExtrudeGeometry(s, { depth: 1, bevelEnabled: false }); g.translate(0, 0, -.5); g.rotateY(Math.PI / 2); g.computeVertexNormals(); return g; }
  function city(o){
    var FM = facadeMat(), RM = roofMat(), box = new T.BoxGeometry(1, 1, 1), MS = mansard(), col = new T.Color();
    var bodies = batch(box, FM, 420, { cast: true }), roofs = batch(MS, RM, 420, { cast: true });
    var stacks = batch(box, new T.MeshStandardMaterial({ color: Cc('#cdbb9f'), roughness: .9 }), 420), pots = batch(box, new T.MeshStandardMaterial({ color: Cc('#b0634a'), roughness: .85 }), 420);
    var stone = [Cc('#efe2c6'), Cc('#e6d6b8'), Cc('#ddd0b6'), Cc('#f2e8d2'), Cc('#d9c9a9')];
    var av = o.avenues || [], segD = function(x, z, a){ var dx = a[2] - a[0], dz = a[3] - a[1], l2 = dx * dx + dz * dz, u = cl(((x - a[0]) * dx + (z - a[1]) * dz) / l2, 0, 1); return Math.hypot(x - a[0] - u * dx, z - a[1] - u * dz); };
    function building(cx, cz, len, dep, h, ang, near, district){   // one building: stone body, a zinc mansard, chimney stacks on its party walls
      Q.setFromAxisAngle(YUP, ang); var c = Math.cos(ang), s = Math.sin(ang);
      col.copy(stone[(district * 7 + (R() * 5 | 0)) % 5]).multiplyScalar(RR(.94, 1.04));
      bodies.add(M4.compose(V(cx, h / 2, cz), Q, V(len, h, dep)), col, cx, cz);
      var rh = RR(5.2, 6.6); col.setScalar(RR(.88, 1.1)); roofs.add(M4.compose(V(cx, h, cz), Q, V(len * 1.005, rh, dep * 1.04)), col, cx, cz);
      if (near) [-.5, .5].forEach(function(e){ if (R() < .3) return; var px = cx + c * e * len, pz = cz - s * e * len, sh = RR(1.8, 2.8);
        stacks.add(M4.compose(V(px, h + rh + sh / 2 - .6, pz), Q, V(1.1, sh, dep * RR(.35, .55))), null, px, pz);
        pots.add(M4.compose(V(px, h + rh + sh - .45, pz), Q, V(.7, .5, dep * RR(.3, .45))), null, px, pz); }); }
    function block(bx, bz, W, D, ang, level, district){   // a perimeter block round a light courtyard
      var c = Math.cos(ang), s = Math.sin(ang), dw = Math.min(W, D) * RR(.3, .36), base = RR(17.5, 21.5) + (district % 3) * .8;
      var wings = [[0, -(D - dw) / 2, W, dw, 0], [0, (D - dw) / 2, W, dw, 0], [-(W - dw) / 2, 0, D - 2 * dw, dw, 1], [(W - dw) / 2, 0, D - 2 * dw, dw, 1]];
      if (level === 2 || D < 22 || W < 22) wings = [[0, 0, W, D, 0]];
      wings.forEach(function(wg){ var len = wg[2], n = level === 0 ? Math.max(1, Math.round(len / RR(13, 19))) : 1, a2 = ang + (wg[4] ? Math.PI / 2 : 0), c2 = Math.cos(a2), s2 = Math.sin(a2);
        for (var i = 0; i < n; i++) { var off = (i + .5) / n * len - len / 2, lx = wg[0] + c2 * 0 + (wg[4] ? 0 : off), lz = wg[1] + (wg[4] ? off : 0);
          var wx = bx + lx * c + lz * s, wz = bz - lx * s + lz * c, h = base + (R() < .12 ? RR(2.5, 4) : RR(-1.4, 1.4));
          building(wx, wz, len / n - (n > 1 ? .2 : 0), wg[3], h, a2, level === 0, district); } }); }
    var near = o.near || 900, mid = o.mid || 1400, far = o.far || 4300, skip = o.skip || function(){ return false; };
    [[44, -mid, mid, 0], [88, -far, far, 1]].forEach(function(gr){ var st = gr[0];
      for (var gz = gr[1]; gz < gr[2]; gz += st) for (var gx = gr[1]; gx < gr[2]; gx += st) {
        var f = st / 44, x0 = gx + RR(-4, 4) * f, z0 = gz + RR(-4, 4) * f, r = Math.hypot(x0, z0);
        if (gr[3] ? (r < mid || r > far) : r >= mid) continue;
        if (skip(x0, z0, f) || R() < .05) continue;
        var cut = false; av.forEach(function(a){ if (segD(x0, z0, a) < a[4] / 2 + 15 * f) cut = true; }); if (cut) continue;
        var dist = Math.floor((x0 + 9000) / 620) * 31 + Math.floor((z0 + 9000) / 620) * 17, ang = ((dist * .37) % 1 - .5) * .9;
        var W = RR(30, 38) * f, D = RR(27, 37) * f;
        block(x0, z0, W, D, ang, gr[3] ? 2 : r < near ? 0 : 1, dist); } });
    if (o.extra) o.extra.forEach(function(b){ block(b[0], b[1], b[2], b[3], b[4] || 0, 0, 3); });
    // avenues: two rows of trees down each side
    av.forEach(function(a){ var dx = a[2] - a[0], dz = a[3] - a[1], L = Math.hypot(dx, dz), nx = -dz / L, nz = dx / L, n = Math.floor(L / 11);
      for (var i = 0; i <= n; i++) { var u = i / n; [-1, 1].forEach(function(sd){ var px = a[0] + dx * u + nx * sd * (a[4] / 2 - 4), pz = a[1] + dz * u + nz * sd * (a[4] / 2 - 4);
        if (Math.hypot(px, pz) < far * .7 && !skip(px, pz, 1, true)) tree(px, pz, RR(.85, 1.05), Math.hypot(px, pz) < near * .6 ? 'plane' : 'far'); }); } });
    // the river: quays, a row of trees on each bank, bridges with piers and parapets
    if (o.river) { var rv = o.river, st2 = new T.MeshStandardMaterial({ color: Cc('#cdbb9c'), roughness: .9 });
      var water = new T.Mesh(new T.PlaneGeometry(12000, rv.w), new T.MeshStandardMaterial({ color: Cc('#5d7f8d'), metalness: .15, roughness: .2 }));
      water.material.onBeforeCompile = function(sh){ sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\n' + NOISE).replace('#include <color_fragment>', '#include <color_fragment>\n' +
        '{ vec3 wp = (inverse(viewMatrix) * vec4(-vViewPosition, 1.)).xyz; float n = kn(vec3(wp.x * .05, 0., wp.z * .4)) * .6 + kn(vec3(wp.x * .2, 1., wp.z * 1.3)) * .4; diffuseColor.rgb *= .9 + .2 * n; }'); };
      water.material.customProgramCacheKey = function(){ return 'kit-water'; };
      water.rotation.x = -Math.PI / 2; water.position.set(0, -1.5, rv.z); scene.add(water);
      [-1, 1].forEach(function(sd){ var q = new T.Mesh(new T.BoxGeometry(12000, 4, 3), st2); q.position.set(0, .5, rv.z + sd * (rv.w / 2 - 1.5)); q.receiveShadow = true; scene.add(q);
        for (var x = -2600; x < 2600; x += 10) if (!(rv.bridges || []).some(function(b){ return Math.abs(b - x) < 22; })) tree(x + RR(-1, 1), rv.z + sd * (rv.w / 2 + 6), RR(.85, 1), Math.abs(x) < 700 ? 'plane' : 'far'); });
      (rv.bridges || []).forEach(function(bx){ var dk = new T.Mesh(new T.BoxGeometry(26, 2.2, rv.w + 8), st2); dk.position.set(bx, 1.4, rv.z); dk.castShadow = dk.receiveShadow = true; scene.add(dk);
        [-1, 1].forEach(function(sd){ var pr = new T.Mesh(new T.BoxGeometry(.8, 1.1, rv.w + 8), st2); pr.position.set(bx + sd * 12.6, 3, rv.z); scene.add(pr); });
        for (var pa = -1; pa <= 1; pa++) { var pier = new T.Mesh(new T.BoxGeometry(28, 4, 6), st2); pier.position.set(bx, -1, rv.z + pa * 30); scene.add(pier); } }); }
    [bodies, roofs, stacks, pots].forEach(function(b){ b.build(); });
  }

  return { R: R, RR: RR, tex: tex, clay: clay, figure: figure, title: title, titleFade: titleFade, tree: tree, forest: forest, city: city,
    tick: function(t){ TIME.value = t; } };
};
