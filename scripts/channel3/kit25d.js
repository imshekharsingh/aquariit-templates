// ---- Turns Out 2.5D toolkit (scripts/channel3/kit25d.js; design/channel3.md, "2.5D toolkit"), inlined after the shared core of the
// scene (it uses the core's x, cl, P, mix, eo, es, rnd, font, txt, probe) by node scripts/channel3/kit-inline.mjs <scene.html> ----
// Flat engraved layers at real depths in front of ONE pinhole camera: a layer at depth Z draws in metres (y up) at F / (Z - cz) px per
// metre, so every move has true parallax. The camera never stops: keys are eased with a little speed left at each key.
var K25 = (function(){
  var F = 810, CUR = { s: 1, cam: { x: 0, y: 0, z: -810 } }, OX = 0, OY = 0;
  // track(keys)(t): keys [t, x, y, cz, f]; between two keys the distance to plane f (the next key's, default 0) moves in log space and
  // x, y follow it (so a long zoom keeps its target in frame: the centre moves with 1/zoom); short moves ease. Speed never drops to 0.
  function track(keys){ return function(t){
    if (t <= keys[0][0]) return { x: keys[0][1], y: keys[0][2], z: keys[0][3] };
    for (var i = 0; i + 1 < keys.length; i++) { var a = keys[i], b = keys[i + 1]; if (t <= b[0] || i + 2 === keys.length) {
      var k = cl((t - a[0]) / (b[0] - a[0]), 0, 1), e = .3 * k + .7 * k * k * (3 - 2 * k), f = b[4] || 0, d0 = f - a[3], d1 = f - b[3];
      var d = Math.exp(mix(Math.log(d0), Math.log(d1), e)), w = Math.abs(Math.log(d1 / d0)) > 1.5 ? (d - d0) / (d1 - d0) : e;
      return { x: mix(a[1], b[1], w), y: mix(a[2], b[2], w), z: f - d }; } }
  }; }
  // off(ox, oy): shift the whole picture on screen (a world seen through a hole); use(cam, Z): metres at depth Z, y up; returns px per metre (0 = behind)
  function off(ox, oy){ OX = ox; OY = oy; }
  function use(cam, Z){ var dz = Z - cam.z; if (dz < .05) return 0; var s = F / dz; CUR.s = s; CUR.cam = cam;
    x.setTransform(2 * s, 0, 0, -2 * s, 2 * (270 + OX - cam.x * s), 2 * (480 + OY + cam.y * s)); return s; }
  function screen(){ x.setTransform(2, 0, 0, 2, 0, 0); }
  function proj(cam, X, Y, Z){ var dz = Z - cam.z; if (dz < .05) return null; var s = F / dz; return { x: 270 + OX + (X - cam.x) * s, y: 480 + OY - (Y - cam.y) * s, s: s }; }
  // the part of the current layer on screen, in metres (plus a margin in px)
  // the current drawing scale (px per unit, any extra translate or scale included) and what is on screen in the current units
  function cs(){ var m = x.getTransform(); return Math.hypot(m.a, m.b) / 2; }
  function vis(m){ var I = x.getTransform().inverse(), s = cs(), r = { x0: 1e18, x1: -1e18, y0: 1e18, y1: -1e18 }; m = (m || 0) / s;
    [[0, 0], [1080, 0], [0, 1920], [1080, 1920]].forEach(function(q){ var p = I.transformPoint(new DOMPoint(q[0], q[1])); r.x0 = Math.min(r.x0, p.x - m); r.x1 = Math.max(r.x1, p.x + m); r.y0 = Math.min(r.y0, p.y - m); r.y1 = Math.max(r.y1, p.y + m); }); return r; }
  function px(v){ return v / cs(); }   // a size on screen (CSS px) in the current layer's metres
  // hatch: engraved lines at angle a across a box (metres), spaced about sp px on screen at any zoom: lines are fixed to the layer at a
  // power-of-two spacing and every other one fades out as the zoom halves them (no swimming, no popping)
  function hatch(x0, y0, x1, y1, a, sp, col, lw){ var V = vis(4); x0 = Math.max(x0, V.x0); x1 = Math.min(x1, V.x1); y0 = Math.max(y0, V.y0); y1 = Math.min(y1, V.y1); if (x1 <= x0 || y1 <= y0) return;
    var s = cs(), l2 = Math.log2(sp / s), n = Math.floor(l2), base = Math.pow(2, n), fr = l2 - n, dx = Math.cos(a), dy = Math.sin(a), nx = -dy, ny = dx;
    var nmin = 1e18, nmax = -1e18, umin = 1e18, umax = -1e18;
    [[x0, y0], [x1, y0], [x0, y1], [x1, y1]].forEach(function(p){ var q = p[0] * nx + p[1] * ny, u = p[0] * dx + p[1] * dy; nmin = Math.min(nmin, q); nmax = Math.max(nmax, q); umin = Math.min(umin, u); umax = Math.max(umax, u); });
    var i0 = Math.floor(nmin / base), i1 = Math.ceil(nmax / base); if (i1 - i0 > 900) return;
    x.lineWidth = (lw || .8) / s; x.strokeStyle = col; var ga = x.globalAlpha;
    for (var pass = 0; pass < 2; pass++) { x.beginPath(); for (var i = i0; i <= i1; i++) { if ((i & 1) !== pass) continue; var o = i * base; x.moveTo(nx * o + dx * umin, ny * o + dy * umin); x.lineTo(nx * o + dx * umax, ny * o + dy * umax); }
      if (pass) x.globalAlpha = ga * (1 - fr); x.stroke(); x.globalAlpha = ga; }
  }
  function path(pts, close){ x.beginPath(); pts.forEach(function(p, i){ if (i) x.lineTo(p[0], p[1]); else x.moveTo(p[0], p[1]); }); if (close) x.closePath(); }
  function ink(w, col){ x.lineWidth = w / cs(); x.strokeStyle = col || '#2a1f17'; x.lineJoin = 'round'; x.lineCap = 'round'; x.stroke(); }
  function fill(col){ x.fillStyle = col; x.fill(); }
  function seg(a, b, c0, d){ x.moveTo(a, b); x.lineTo(c0, d); }
  // a world text (not a caption): drawn upright in the layer, size in metres; not reported to qa (it may sit half off screen while the camera passes)
  function wtxt(s, X, Y, size, f, col, al, sp){ x.save(); x.translate(X, Y); x.scale(1, -1); x.font = font(size, f); x.textAlign = al || 'center'; x.letterSpacing = (sp || 0) + 'px'; x.fillStyle = col; x.fillText(s, 0, 0); x.restore(); }
  // paper: fibres, mottling, specks and a warm vignette on white, laid over the frame with 'multiply' (static: it is the paper, not film grain)
  function paperTex(seed){ var cv = document.createElement('canvas'); cv.width = 1080; cv.height = 1920; var g = cv.getContext('2d'), r = rnd(seed), i;
    g.fillStyle = '#fff'; g.fillRect(0, 0, 1080, 1920);
    for (i = 0; i < 70; i++) { var X = r() * 1080, Y = r() * 1920, R = 80 + r() * 280, gr = g.createRadialGradient(X, Y, 0, X, Y, R); gr.addColorStop(0, 'rgba(150,118,78,' + (.02 + r() * .035).toFixed(3) + ')'); gr.addColorStop(1, 'rgba(150,118,78,0)'); g.fillStyle = gr; g.fillRect(X - R, Y - R, 2 * R, 2 * R); }
    g.lineCap = 'round';
    for (i = 0; i < 6000; i++) { var X2 = r() * 1080, Y2 = r() * 1920, a = r() * Math.PI, L = 3 + r() * 13; g.strokeStyle = 'rgba(125,98,62,' + (.04 + r() * .07).toFixed(3) + ')'; g.lineWidth = .6 + r() * .7;
      g.beginPath(); g.moveTo(X2, Y2); g.quadraticCurveTo(X2 + Math.cos(a) * L * .5 + (r() - .5) * 3, Y2 + Math.sin(a) * L * .5 + (r() - .5) * 3, X2 + Math.cos(a) * L, Y2 + Math.sin(a) * L); g.stroke(); }
    for (i = 0; i < 2200; i++) { g.fillStyle = 'rgba(92,70,45,' + (.05 + r() * .1).toFixed(3) + ')'; g.fillRect(r() * 1080, r() * 1920, 1 + r() * 1.3, 1 + r() * 1.3); }
    var v = g.createRadialGradient(540, 880, 520, 540, 880, 1280); v.addColorStop(0, 'rgba(110,80,50,0)'); v.addColorStop(1, 'rgba(110,80,50,.3)'); g.fillStyle = v; g.fillRect(0, 0, 1080, 1920);
    return cv; }
  // ---- kinetic type (screen space, reported to qa) ----
  // roll: the digits roll up into place one column after another (an odometer); letters fade up; k 0 -> 1. knock: a paper outline behind dark type
  function roll(s, X, Y, size, f, col, k, knock){ if (k <= 0) return; x.save(); x.font = font(size, f); x.textAlign = 'left'; x.letterSpacing = '0px';
    var w = x.measureText(s).width, xx = X - w / 2, n = s.length; x.globalAlpha *= cl(k * 3, 0, 1); probe(s, X, Y, 'center', size);
    for (var i = 0; i < n; i++) { var ch = s[i], cw = x.measureText(ch).width, kc = eo(cl((k - i * .08) / .7, 0, 1));
      if (/[0-9]/.test(ch)) { var o = (1 - kc) * 4, v = +ch; x.save(); x.beginPath(); x.rect(xx - 4, Y - size * .82, cw + 8, size * 1.12); x.clip();
        for (var j = Math.floor(o); j <= Math.ceil(o); j++) { var yy = Y - (j - o) * size * 1.45; if (knock) { x.strokeStyle = knock; x.lineWidth = size * .09; x.lineJoin = 'round'; x.strokeText(String((v + j * 7) % 10), xx, yy); } x.fillStyle = col; x.fillText(String((v + j * 7) % 10), xx, yy); }
        x.restore(); }
      else if (ch !== ' ') { x.save(); x.globalAlpha *= kc; if (knock) { x.strokeStyle = knock; x.lineWidth = size * .09; x.lineJoin = 'round'; x.strokeText(ch, xx, Y + (1 - kc) * 10); } x.fillStyle = col; x.fillText(ch, xx, Y + (1 - kc) * 10); x.restore(); }
      xx += cw; }
    x.restore(); }
  // label: small spaced capitals that slide in from the left edge of their own box as k goes 0 -> 1
  function label(s, X, Y, size, f, col, k, sp, knock){ if (k <= 0) return; x.save(); x.globalAlpha *= cl(k * 2, 0, 1); var w = tw(s, size, f, sp);
    x.beginPath(); x.rect(X - w / 2 - 6, Y - size * 1.1, (w + 12) * eo(k), size * 1.6); x.clip();
    if (knock) { x.font = font(size, f); x.letterSpacing = sp + 'px'; x.textAlign = 'center'; x.strokeStyle = knock; x.lineWidth = size * .35; x.lineJoin = 'round'; x.strokeText(s, X, Y); x.letterSpacing = '0px'; }
    txt(s, X, Y, size, f, col, 'center', sp); x.restore(); }
  // stamp: a rubber stamp that lands (scale 1.5 -> 1 with a settle), ink-coloured frame and letters on a pale wash, rotated a little
  function stamp(lines, X, Y, rot, col, k, wash){ if (k <= 0) return; var sc = mix(1.5, 1, es(k)); x.save(); x.translate(X, Y); x.rotate(rot); x.scale(sc, sc); x.globalAlpha *= cl(k * 3, 0, 1);
    var W0 = 0, H0 = 0; lines.forEach(function(L){ W0 = Math.max(W0, tw(L[0], L[1], L[2], L[3] || 0)); H0 += L[1] * 1.08; }); W0 += 46; H0 += 26;
    x.fillStyle = wash || 'rgba(244,234,212,.86)'; x.beginPath(); x.roundRect(-W0 / 2, -H0 / 2, W0, H0, 8); x.fill();
    x.strokeStyle = col; x.lineWidth = 4; x.stroke(); x.lineWidth = 1.5; x.beginPath(); x.roundRect(-W0 / 2 + 7, -H0 / 2 + 7, W0 - 14, H0 - 14, 4); x.stroke();
    var yy = -H0 / 2 + 13; lines.forEach(function(L){ yy += L[1] * .95; if (L[4] == null || L[4] > 0) { x.save(); x.globalAlpha *= L[4] == null ? 1 : cl(L[4] * 2.5, 0, 1); txt(L[0], 0, yy, L[1], L[2], col, 'center', L[3] || 0); x.restore(); } yy += L[1] * .13; });
    x.restore(); }
  // rings(cam, X, Y, Z, t, t0, t1, every, col, r0): radio rings from a point, each growing exp(3 * age) metres from r0 (default 12 m): on
  // screen they keep spreading at any zoom (Paris to Tunisia, about 1,400 km, in about 3.9 s); a small r0 (0.04 m) scatters light off a molecule
  function rings(cam, X, Y, Z, t, t0, t1, every, col, r0){ var c0 = proj(cam, X, Y, Z); if (!c0) return; screen();
    for (var e = t0; e <= Math.min(t, t1); e += every) { var age = t - e, r = (r0 || 12) * Math.exp(3 * age) * c0.s; if (r < 2 || r > 1400) continue;
      var a = P(r, 2, 14) * (1 - P(r, 700, 1400)) * (1 - P(age, 4.6, 5.6)); if (a <= 0) continue;
      x.save(); x.globalAlpha *= a; x.strokeStyle = col; x.lineWidth = 2.2; x.beginPath(); x.arc(c0.x, c0.y, r, 0, 7); x.stroke();
      x.globalAlpha *= .45; x.lineWidth = 1; x.beginPath(); x.arc(c0.x, c0.y, r * .93, 0, 7); x.stroke(); x.restore(); } }
  // ---- the scenery ----
  // ridge(seed, H, tone, ink, hatchCol): an endless engraved ridge of hills on the current layer (metres), H high on average; filled in
  // tone, shaded with hatching that keeps its size on screen, inked along the crest. Far ridges in paler, bluer tones read as distance.
  // o.deep: fill down to -deep metres (a near meadow that must reach the bottom of the frame); o.grass: inked grass blades along the crest
  function ridge(seed, H, tone, ink, hc, o){ o = o || {}; var V = vis(20), r = rnd(seed), p1 = r() * 7, p2 = r() * 7, p3 = r() * 7, L = H * 3.2, st = Math.max((V.x1 - V.x0) / 120, H / 40);
    var top = function(X){ return H * (.62 + .22 * Math.sin(X / L + p1) + .12 * Math.sin(X / (L * .37) + p2) + .04 * Math.sin(X / (L * .11) + p3)); }, pts = [], X;
    for (X = V.x0 - st; X <= V.x1 + st; X += st) pts.push([X, top(X)]);
    var B = -(o.deep || H); x.beginPath(); x.moveTo(pts[0][0], B); pts.forEach(function(q){ x.lineTo(q[0], q[1]); }); x.lineTo(pts[pts.length - 1][0], B); x.closePath(); x.fillStyle = tone; x.fill();
    if (hc) { x.save(); x.clip(); hatch(V.x0, Math.max(B, V.y0), V.x1, H * 1.1, .55, 4, hc, .7); x.restore(); }
    if (o.grass && cs() * H > 6) { var g = rnd(seed * 31), gs = Math.max(px(5), H / 30); x.beginPath(); for (X = Math.floor(V.x0 / gs) * gs; X <= V.x1; X += gs) { var y0 = top(X), l = H * (.08 + g() * .14); x.moveTo(X, y0 - l * .3); x.lineTo(X + (g() - .5) * l * .6, y0 + l); }
      x.lineWidth = 1 / cs(); x.strokeStyle = o.grass; x.stroke(); }
    if (ink) { x.beginPath(); pts.forEach(function(q, i){ if (i) x.lineTo(q[0], q[1]); else x.moveTo(q[0], q[1]); }); x.lineWidth = 1.1 / cs(); x.strokeStyle = ink; x.stroke(); }
    return top; }
  // wave(x0, y0, x1, y1, lam, amp, ph, col, lw): a light wave drawn as an engraved sine line along a segment of the current layer
  // (wavelength lam and amplitude amp in metres, phase ph in waves); it straightens smoothly once a wavelength is under ~8 px on screen
  function wave(x0, y0, x1, y1, lam, amp, ph, col, lw){ var s = cs(), L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L, a = amp * P(lam * s, 4, 12), n = Math.min(1200, Math.ceil(L * s / 3));
    x.beginPath(); for (var i = 0; i <= n; i++) { var d = L * i / n, o = a * Math.sin((d / lam + ph) * 2 * Math.PI); if (i) x.lineTo(x0 + ux * d - uy * o, y0 + uy * d + ux * o); else x.moveTo(x0 + ux * d - uy * o, y0 + uy * d + ux * o); }
    x.lineWidth = (lw || 2) / s; x.strokeStyle = col; x.lineCap = 'round'; x.lineJoin = 'round'; x.stroke(); }
  // ground(cam, col, line): the y = 0 plane in perspective (rows every 20 m fixed to the ground, paths given as x positions)
  function ground(cam, col, line, paths, zFrom, zTo){ var hz = 480 + OY; if (cam.y <= .05) return; screen();
    x.fillStyle = col; x.fillRect(0, hz, 540, 960 - hz + 1);
    x.strokeStyle = line; x.lineWidth = .8; var z0 = Math.ceil((cam.z + 1) / 20) * 20;
    for (var Z = z0; Z < cam.z + 30000; Z += Z - cam.z > 2000 ? 160 : Z - cam.z > 500 ? 40 : 20) { var p = proj(cam, 0, 0, Z), q = proj(cam, 0, 0, Z + 20); if (!p || p.y > 980) continue; var gap = p.y - q.y;
      if (gap < 1.2) break; x.globalAlpha = cl((gap - 1.2) / 3, 0, 1) * .5; x.beginPath(); x.moveTo(0, p.y); x.lineTo(540, p.y); x.stroke(); }
    x.globalAlpha = 1; (paths || []).forEach(function(px0){ var a = proj(cam, px0, 0, Math.max(zFrom, cam.z + 1)), b = proj(cam, px0, 0, zTo); if (!a || !b) return; x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.globalAlpha = .55; x.stroke(); });
    x.globalAlpha = 1; }
  // city(Z, seed, tone, o): an endless row of Paris blocks at depth Z (six storeys, zinc mansards, chimneys, a dome now and then)
  function city(Z, seed, tone, o){ var s = cs(), V = vis(20), cw = 30, dark = o.dark || 'rgba(42,31,23,.55)';
    for (var i = Math.floor(V.x0 / cw) - 1; i <= Math.ceil(V.x1 / cw); i++) { var r = rnd(seed * 7919 + i * 104729), b0 = i * cw, w = cw * (.7 + r() * .3), h = (o.h || 20) * (.8 + r() * .45), m = 4 + r() * 3;
      x.beginPath(); x.moveTo(b0, -3); x.lineTo(b0, h); x.lineTo(b0 + 2, h + m); x.lineTo(b0 + w - 2, h + m); x.lineTo(b0 + w, h); x.lineTo(b0 + w, -3); x.closePath(); x.fillStyle = tone; x.fill();
      if (s * h > 14) { x.lineWidth = .7 / s; x.strokeStyle = dark; x.stroke(); }
      for (var c0 = 0; c0 < 2; c0++) { var cx0 = b0 + w * (.2 + c0 * .55) + r() * 2; x.fillStyle = tone; x.fillRect(cx0, h + m - 1, 2, 3.5); if (s * 3 > 4) { x.lineWidth = .6 / s; x.strokeRect(cx0, h + m - 1, 2, 3.5); } }
      if (s * 1.4 > 2.2) { x.fillStyle = dark; var fl = Math.floor(h / 3.3); x.globalAlpha *= .8; for (var f0 = 1; f0 < fl; f0++) for (var wx = b0 + 2.2; wx < b0 + w - 2.5; wx += 3.6) x.fillRect(wx, f0 * 3.3, 1.2, 1.9); x.globalAlpha /= .8;
        x.save(); x.beginPath(); x.moveTo(b0, h); x.lineTo(b0 + 2, h + m); x.lineTo(b0 + w - 2, h + m); x.lineTo(b0 + w, h); x.closePath(); x.clip(); hatch(b0, h, b0 + w, h + m, Math.PI / 2, 3.2, dark, .6); x.restore(); }
      if (o.domes && r() < .05) { var dx = b0 + w / 2, dh = h + m + 8; x.beginPath(); x.moveTo(dx - 9, dh - 6); x.lineTo(dx - 9, dh); x.arc(dx, dh, 9, Math.PI, 0, true); x.lineTo(dx + 9, dh - 6); x.closePath(); x.fillStyle = tone; x.fill(); x.lineWidth = .7 / s; x.strokeStyle = dark; x.stroke(); x.fillRect(dx - .6, dh + 9, 1.2, 6); }
    } }
  // tree(X, Z-scale, seed, tone): an engraved tree on its layer: a trunk and a crown of overlapping lobes, shaded on the right with hatching
  function tree(X, h, seed, tone, ink){ var r = rnd(seed), s = cs(); x.fillStyle = ink; x.fillRect(X - h * .03, 0, h * .06, h * .45);
    var lobes = []; for (var i = 0; i < 9; i++) lobes.push([X + (r() - .5) * h * .55, h * (.55 + r() * .35), h * (.16 + r() * .1)]);
    x.beginPath(); lobes.forEach(function(L){ x.moveTo(L[0] + L[2], L[1]); x.arc(L[0], L[1], L[2], 0, 7); }); x.fillStyle = tone; x.fill();
    if (s * h > 30) { x.save(); x.clip(); hatch(X - h * .5, h * .3, X + h * .5, h * 1.2, -.9, 3.4, ink, .7); x.restore();
      x.save(); x.beginPath(); lobes.forEach(function(L){ x.moveTo(L[0] + L[2], L[1]); x.arc(L[0], L[1], L[2], 0, 7); }); x.clip(); x.beginPath(); x.rect(X - h * .05, 0, h, h * 2); x.clip(); hatch(X - h * .05, h * .3, X + h * .5, h * 1.2, .9, 2.6, ink, .7); x.restore(); }
    x.beginPath(); lobes.forEach(function(L){ x.moveTo(L[0] + L[2], L[1]); x.arc(L[0], L[1], L[2], 0, 7); }); x.lineWidth = .8 / s; x.strokeStyle = ink; x.globalAlpha *= .6; x.stroke(); x.globalAlpha /= .6; }
  // ---- people: clean illustrated figures in metres (feet at 0, facing +x), recognised by props, no facial detail beyond an eye dot ----
  // person(o): o.h height, o.coat/o.trousers/o.skin/o.hair colours, o.hat 'top'|'bowler'|'kepi'|'lady'|'', o.beard colour, o.stache,
  // o.dress (long skirt), o.sit (seated on a chair), o.arms [[hx, hy], [hx, hy]] hand targets (back arm, front arm; two-bone reach),
  // o.phones (headphones), o.buttons colour, o.chain (watch chain colour), o.detail (0 = silhouette for far crowds)
  function reach(sx, sy, tx, ty, l1, l2, bend){ var dx = tx - sx, dy = ty - sy, d = Math.min(Math.hypot(dx, dy), l1 + l2 - 1e-4), a = Math.atan2(dy, dx), c0 = cl((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1), e = a + (bend || 1) * Math.acos(c0);
    return [sx + Math.cos(e) * l1, sy + Math.sin(e) * l1, sx + Math.cos(a) * d, sy + Math.sin(a) * d]; }
  function limb(pts, w, col, outline){ x.beginPath(); x.moveTo(pts[0], pts[1]); for (var i = 2; i < pts.length; i += 2) x.lineTo(pts[i], pts[i + 1]); x.lineCap = 'round'; x.lineJoin = 'round';
    if (outline) { x.lineWidth = w + 1.6 / cs(); x.strokeStyle = outline; x.stroke(); } x.lineWidth = w; x.strokeStyle = col; x.stroke(); }
  function person(o){ var h = o.h || 1.78, k = h / 1.78, OL = o.detail === 0 ? null : (o.ink || 'rgba(30,22,16,.85)'), sit = !!o.sit;
    x.save(); x.scale(k, k);
    var hipY = sit ? .5 : .93, sh = sit ? 1.2 : 1.44, hy = sh + .17, arms = o.arms || [[-.05, sit ? .75 : .85], [.08, sit ? .75 : .85]];
    if (sit) { x.fillStyle = o.chair || '#5a4330'; x.fillRect(-.24, .44, .36, .04); x.fillRect(-.24, 0, .03, .46); x.fillRect(.08, 0, .03, .46); x.fillRect(-.26, .44, .03, .55); }
    var ah = function(i){ var tgt = arms[i], s0 = [i ? .06 : -.06, sh - .04], j = reach(s0[0], s0[1], tgt[0] / k, tgt[1] / k, .3, .29, i ? -1 : -1); return [s0[0], s0[1], j[0], j[1], j[2], j[3]]; };
    var A0 = ah(0); limb(A0, .085, o.coat2 || o.coat, OL); x.beginPath(); x.arc(A0[4], A0[5], .04, 0, 7); fill(o.skin);
    // legs
    if (sit) { limb([-.04, hipY, .36, hipY + .02, .38, .02], .13, o.trousers, OL); limb([.02, hipY, .42, hipY + .02, .44, .02], .13, o.trousers, OL);
      x.beginPath(); x.ellipse(.47, .03, .1, .04, 0, 0, 7); fill(o.shoes || '#1d1713'); }
    else if (o.dress) { path([[-.16, sh - .02], [.12, sh - .02], [.16, .9], [.3, .02], [-.28, .02], [-.18, .9]], true); fill(o.dress); if (OL) ink(.9, OL); }
    else { limb([-.03, hipY, -.06, .05], .12, o.trousers, OL); limb([.05, hipY, .1, .05], .12, o.trousers, OL);
      x.beginPath(); x.ellipse(-.02, .03, .1, .035, 0, 0, 7); x.ellipse(.15, .03, .1, .035, 0, 0, 7); fill(o.shoes || '#1d1713'); }
    // body: a frock coat to the knee, a tunic to the hip
    if (!o.dress) { var hem = sit ? hipY - .02 : (o.long ? .52 : .82);
      path([[-.14, sh], [-.02, sh + .05], [.1, sh], [.15, sh - .2], [.12, hipY + .08], [o.long ? .17 : .14, hem], [o.long ? -.19 : -.15, hem], [-.15, hipY + .1]], true); fill(o.coat); if (OL) ink(.9, OL);
      if (o.detail !== 0) { x.save(); path([[-.14, sh], [-.02, sh + .05], [.1, sh], [.15, sh - .2], [.12, hipY + .08], [.17, hem], [-.19, hem], [-.15, hipY + .1]], true); x.clip();
          hatch(-.2, hem, -.02, sh + .1, 1.1, 3, 'rgba(0,0,0,.35)', .6); x.restore();
        if (o.shirt) { path([[-.02, sh + .05], [.08, sh + .01], [.05, sh - .18]], true); fill(o.shirt); path([[-.02, sh + .05], [.1, sh], [.13, sh - .14], [.06, sh - .3]]); ink(.9, 'rgba(0,0,0,.45)'); x.beginPath(); x.ellipse(.03, sh + .01, .03, .015, 0, 0, 7); fill('#1b1511'); }
        if (o.buttons) { for (var b = 0; b < 4; b++) { x.beginPath(); x.arc(.1 - b * .005, sh - .1 - b * .1, .012, 0, 7); fill(o.buttons); } }
        if (o.chain) { x.beginPath(); x.moveTo(.11, hipY + .2); x.quadraticCurveTo(.03, hipY + .12, -.04, hipY + .2); ink(1.2, o.chain); }
        if (o.belt) { x.fillStyle = o.belt; x.fillRect(-.15, hipY + .1, .29, .045); } } }
    // head
    x.fillStyle = o.skin; x.fillRect(-.03, sh, .07, .08);
    x.beginPath(); x.ellipse(.02, hy, .095, .115, 0, 0, 7); fill(o.skin); if (OL) ink(.9, OL);
    if (o.detail !== 0) {
      if (o.hair) { x.beginPath(); x.ellipse(-.035, hy + .02, .06, .085, -.2, 0, 7); fill(o.hair); }
      x.beginPath(); x.ellipse(-.005, hy, .022, .032, 0, 0, 7); fill(o.ear || 'rgba(150,95,70,.55)');
      if (o.beard) { path([[-.02, hy - .01], [.0, hy - .1], [.06, hy - .16], [.115, hy - .09], [.117, hy - .04], [.08, hy - .055], [.03, hy - .04]], true); fill(o.beard); if (OL) ink(.7, 'rgba(40,30,22,.6)'); }
      if (o.stache || o.beard) { x.beginPath(); x.ellipse(.095, hy - .04, .035, .014, -.15, 0, 7); fill(o.stache || o.beard); }
      x.beginPath(); x.arc(.075, hy + .025, .011, 0, 7); fill('#1b1511');
      x.beginPath(); x.moveTo(.105, hy + .02); x.lineTo(.125, hy - .015); x.lineTo(.1, hy - .02); fill(o.skin); }
    // hats
    if (o.hat === 'top') { x.beginPath(); x.ellipse(.02, hy + .095, .15, .024, 0, 0, 7); fill(o.hatc || '#1b1613'); path([[-.075, hy + .095], [-.085, hy + .33], [.125, hy + .33], [.115, hy + .095]], true); fill(o.hatc || '#1b1613'); if (o.band) { x.fillStyle = o.band; x.fillRect(-.078, hy + .1, .196, .035); } }
    else if (o.hat === 'bowler') { x.beginPath(); x.ellipse(.02, hy + .085, .14, .022, 0, 0, 7); x.ellipse(.02, hy + .1, .1, .1, 0, Math.PI, 0, true); fill(o.hatc || '#2a221c'); }
    else if (o.hat === 'kepi') { path([[-.07, hy + .07], [-.06, hy + .2], [.1, hy + .21], [.105, hy + .07]], true); fill(o.hatc || '#2f3546'); x.fillStyle = o.kepiTop || '#7b3a2b'; x.fillRect(-.062, hy + .14, .165, .07);
      path([[.08, hy + .075], [.17, hy + .055], [.1, hy + .09]], true); fill('#14100d'); if (OL) { path([[-.07, hy + .07], [-.06, hy + .2], [.1, hy + .21], [.105, hy + .07]], true); ink(.8, OL); } }
    else if (o.hat === 'lady') { x.beginPath(); x.ellipse(.02, hy + .08, .17, .03, -.08, 0, 7); fill(o.hatc || '#6b4a35'); x.beginPath(); x.ellipse(.01, hy + .12, .08, .06, 0, 0, 7); fill(o.hatc || '#6b4a35'); x.beginPath(); x.arc(.09, hy + .13, .025, 0, 7); fill(o.flower || '#c97a26'); }
    if (o.phones) { x.beginPath(); x.ellipse(-.005, hy, .035, .045, 0, 0, 7); fill('#1d1916'); x.beginPath(); x.moveTo(-.005, hy + .04); x.quadraticCurveTo(-.02, hy + .26, .02, hy + .26); ink(1.4, '#1d1916'); }
    if (o.parasol) { var pt = [.32, 1.05]; x.beginPath(); x.moveTo(pt[0], pt[1]); x.lineTo(pt[0] - .05, 1.95); ink(1, '#2a1f17'); x.beginPath(); x.ellipse(pt[0] - .05, 1.92, .42, .14, 0, Math.PI, 0, true); fill(o.parasol); if (OL) ink(.8, OL); }
    // front arm last
    var A1 = ah(1); limb(A1, .085, o.coat, OL); x.beginPath(); x.arc(A1[4], A1[5], .042, 0, 7); fill(o.skin);
    if (o.cuff) { x.beginPath(); x.arc(A1[2] + (A1[4] - A1[2]) * .85, A1[3] + (A1[5] - A1[3]) * .85, .045, 0, 7); fill(o.cuff); x.beginPath(); x.arc(A1[4], A1[5], .04, 0, 7); fill(o.skin); }
    x.restore(); }
  // ---- maps and globes (3 Nov 2026): one set of cut-paper coastlines (lon, lat in degrees), coarse on purpose and roughened by a seeded
  // midpoint jitter so a coast reads as cut by hand, shared by the globe station and the flat map (so a push into the globe lands on the map) ----
  var D = Math.PI / 180, LANDS = {
    eurasia: [[-9,43],[-9,37],[-2,36],[3,43],[8,44],[12,44],[16,38],[19,40],[23,37],[27,40],[36,36],[35,32],[44,12],[52,15],[57,24],[60,25],[67,25],[73,20],[77,8],[80,15],[88,22],[92,22],[98,16],[100,6],[104,1],[104,10],[109,12],[107,21],[115,22],[121,30],[122,40],[129,35],[130,43],[141,46],[140,53],[135,55],[143,59],[156,51],[163,60],[178,64],[178,70],[140,72],[110,77],[90,76],[70,73],[60,70],[45,68],[33,69],[25,71],[15,68],[5,61],[8,57],[10,54],[5,53],[2,51],[-2,48],[-1,46]],
    africa: [[-17,15],[-16,22],[-9,32],[-5,36],[10,37],[20,32],[32,31],[35,28],[43,12],[51,12],[42,-2],[40,-15],[35,-25],[20,-35],[18,-30],[12,-17],[13,-6],[9,4],[-8,5]],
    northAmerica: [[-168,66],[-162,60],[-153,57],[-135,58],[-124,48],[-124,40],[-117,32],[-110,23],[-105,20],[-95,16],[-88,15],[-83,9],[-79,9],[-82,14],[-87,21],[-91,19],[-97,22],[-97,28],[-90,29],[-83,29],[-81,25],[-80,32],[-76,35],[-74,40],[-70,42],[-66,44],[-60,46],[-56,52],[-61,56],[-64,60],[-78,62],[-79,55],[-86,55],[-94,59],[-90,64],[-82,67],[-95,69],[-110,68],[-125,70],[-141,70],[-156,71],[-166,68]],
    southAmerica: [[-79,9],[-77,4],[-81,-5],[-76,-14],[-70,-18],[-71,-30],[-73,-40],[-75,-50],[-69,-55],[-66,-55],[-68,-50],[-65,-42],[-62,-39],[-57,-37],[-53,-34],[-48,-26],[-41,-22],[-39,-14],[-35,-8],[-35,-5],[-44,-2],[-50,0],[-52,5],[-60,8],[-64,10],[-72,12]],
    australia: [[114,-22],[114,-34],[117,-35],[124,-34],[131,-31],[138,-35],[141,-38],[146,-39],[150,-37],[153,-31],[153,-25],[146,-19],[142,-11],[136,-12],[136,-15],[130,-12],[126,-14],[122,-18]],
    greenland: [[-73,78],[-60,82],[-30,83],[-20,80],[-20,72],[-30,68],[-40,65],[-44,60],[-50,64],[-54,70],[-60,76]],
    britain: [[-5,50],[1,51],[2,53],[-1,55],[-2,57],[-5,58],[-6,56],[-5,54],[-3,53],[-5,52]],
    japan: [[130,31],[132,34],[135,34],[140,35],[141,38],[142,41],[141,45],[144,43],[140,40],[139,36],[136,36],[133,35]],
    madagascar: [[44,-25],[47,-25],[50,-15],[49,-12],[44,-16]],
    newZealand: [[172,-34],[175,-37],[178,-38],[175,-41],[171,-46],[167,-46],[171,-42],[174,-39]] }, ROUGH = {};
  function rough(name){ if (ROUGH[name]) return ROUGH[name]; var pts = LANDS[name], r = rnd(name.length * 977 + name.charCodeAt(0) * 31);
    for (var l = 0; l < 3; l++) { var n = []; for (var i = 0; i < pts.length; i++) { var a = pts[i], b = pts[(i + 1) % pts.length], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, j = (r() - .5) * d * (l ? .22 : .3);
      n.push(a, [(a[0] + b[0]) / 2 - dy / d * j, (a[1] + b[1]) / 2 + dx / d * j]); } pts = n; }
    return (ROUGH[name] = pts); }
  // globe on the current layer (metres), centred on 0,0, radius R: g = { lon, lat } is the point turned to the front (ease it to bring a
  // region round), o.sea / o.land / o.ink / o.hi { name: colour } / o.shade (night-side hatching) / o.grid (degrees, 0 = none).
  // gxy(g, lon, lat) -> [X, Y, z] in units of R (z > 0: on the front) for pins and labels. Matte: flat paper fills, hatched shade, no rim light
  function gxy(g, lon, lat){ var l = (lon - g.lon) * D, p = lat * D, c = Math.cos(p), X = c * Math.sin(l), Y0 = c * Math.cos(l), Z0 = Math.sin(p), cb = Math.cos(g.lat * D), sb = Math.sin(g.lat * D);
    return [X, Z0 * cb - Y0 * sb, Y0 * cb + Z0 * sb]; }
  function gpoly(g, pts, R){ var q = pts.map(function(p){ return gxy(g, p[0], p[1]); }), out = [], n = q.length, i;
    for (i = 0; i < n; i++) { var a = q[i], b = q[(i + 1) % n]; if (a[2] >= 0) out.push({ x: a[0], y: a[1] });
      if ((a[2] >= 0) !== (b[2] >= 0)) { var k = a[2] / (a[2] - b[2]), X = mix(a[0], b[0], k), Y = mix(a[1], b[1], k), L = Math.hypot(X, Y) || 1; out.push({ x: X / L, y: Y / L, exit: a[2] >= 0 }); } }
    if (!out.length) return null; x.beginPath();
    out.forEach(function(p, j){ if (j) x.lineTo(p.x * R, p.y * R); else x.moveTo(p.x * R, p.y * R);
      if (p.exit) { var nx = out[(j + 1) % out.length], a0 = Math.atan2(p.y, p.x), a1 = Math.atan2(nx.y, nx.x), da = a1 - a0; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
        for (var s = 1, m = Math.ceil(Math.abs(da) / .07); s < m; s++) x.lineTo(Math.cos(a0 + da * s / m) * R, Math.sin(a0 + da * s / m) * R); } });
    x.closePath(); return true; }
  function globe(R, g, o){ o = o || {}; var s = cs(), inkc = o.ink || 'rgba(30,18,10,.85)', hi = o.hi || {};
    x.save(); x.shadowColor = 'rgba(20,12,8,.35)'; x.shadowBlur = 18; x.shadowOffsetX = 5; x.shadowOffsetY = 12; x.beginPath(); x.arc(0, 0, R, 0, 7); x.fillStyle = o.sea || '#2f5c78'; x.fill(); x.restore();
    x.save(); x.beginPath(); x.arc(0, 0, R, 0, 7); x.clip();
    hatch(-R, -R, R, R, 0, 7, 'rgba(255,255,255,.07)', .7);
    if (o.grid !== 0) { var st = o.grid || 30, la, lo, j, p, on; x.beginPath();
      for (la = -90 + st; la < 90; la += st) { on = false; for (j = 0; j <= 72; j++) { p = gxy(g, j * 5 - 180, la); if (p[2] < 0) { on = false; continue; } if (on) x.lineTo(p[0] * R, p[1] * R); else x.moveTo(p[0] * R, p[1] * R); on = true; } }
      for (lo = -180; lo < 180; lo += st) { on = false; for (j = 0; j <= 36; j++) { p = gxy(g, lo, j * 5 - 90); if (p[2] < 0) { on = false; continue; } if (on) x.lineTo(p[0] * R, p[1] * R); else x.moveTo(p[0] * R, p[1] * R); on = true; } }
      x.lineWidth = .8 / s; x.strokeStyle = o.gridCol || 'rgba(240,226,200,.22)'; x.stroke(); }
    Object.keys(LANDS).forEach(function(nm){ if (!gpoly(g, rough(nm), R)) return; x.fillStyle = hi[nm] || o.land || '#d9c49a'; x.fill();
      x.save(); x.clip(); hatch(-R, -R, R, R, .8, 5, 'rgba(60,40,20,.16)', .6); x.restore(); gpoly(g, rough(nm), R); x.lineWidth = 1 / s; x.strokeStyle = inkc; x.stroke(); });
    if (o.shade !== 0) { x.beginPath(); x.arc(0, 0, R, 0, 7); x.arc(-R * .32, R * .3, R * 1.08, 0, 7, true); x.fillStyle = 'rgba(16,10,8,' + (o.shade || .28) + ')'; x.fill('evenodd');
      x.save(); x.beginPath(); x.arc(0, 0, R, 0, 7); x.arc(-R * .32, R * .3, R * 1.08, 0, 7, true); x.clip('evenodd'); hatch(-R, -R, R, R, -.7, 4, 'rgba(16,10,8,.35)', .7); x.restore(); }
    x.restore(); x.beginPath(); x.arc(0, 0, R, 0, 7); x.lineWidth = 1.6 / s; x.strokeStyle = inkc; x.stroke(); }
  // map on the current layer: the same coastlines flat, origin at m.lon, m.lat, m.k metres a degree north (east: k x cos(lat)), so the map
  // at the globe's plane with k = R x pi / 180 matches the globe's front where the camera pushes in. mxy(m, lon, lat) -> [X, Y]
  function mxy(m, lon, lat){ return [(lon - m.lon) * m.k * Math.cos(m.lat * D), (lat - m.lat) * m.k]; }
  function map(m, o){ o = o || {}; var s = cs(), V = vis(20), hi = o.hi || {}, step = o.grid || 10, i;
    x.fillStyle = o.sea || '#2f5c78'; x.fillRect(V.x0, V.y0, V.x1 - V.x0, V.y1 - V.y0); hatch(V.x0, V.y0, V.x1, V.y1, 0, 7, 'rgba(255,255,255,.07)', .7);
    var c = Math.cos(m.lat * D) * m.k; x.beginPath();
    for (i = Math.ceil((V.x0 / c + m.lon) / step) * step; (i - m.lon) * c <= V.x1; i += step) seg((i - m.lon) * c, V.y0, (i - m.lon) * c, V.y1);
    for (i = Math.ceil((V.y0 / m.k + m.lat) / step) * step; (i - m.lat) * m.k <= V.y1; i += step) seg(V.x0, (i - m.lat) * m.k, V.x1, (i - m.lat) * m.k);
    x.lineWidth = .8 / s; x.strokeStyle = o.gridCol || 'rgba(240,226,200,.22)'; x.stroke();
    var shown = Object.keys(LANDS).map(function(nm){ var P0 = rough(nm).map(function(p){ return mxy(m, p[0], p[1]); }), b = [1e18, -1e18, 1e18, -1e18], g = px(40);
      P0.forEach(function(p){ b[0] = Math.min(b[0], p[0]); b[1] = Math.max(b[1], p[0]); b[2] = Math.min(b[2], p[1]); b[3] = Math.max(b[3], p[1]); });
      return b[1] < V.x0 - g || b[0] > V.x1 + g || b[3] < V.y0 - g || b[2] > V.y1 + g ? null : [nm, P0]; }).filter(Boolean);
    // engraved water lines: two thin lines following every coast out at sea, 10 and 20 px off (a wide light stroke cut by a sea-coloured one)
    x.lineJoin = 'round'; [[22, 18], [42, 38]].forEach(function(w){ shown.forEach(function(L){ path(L[1], true); x.lineWidth = px(w[0]); x.strokeStyle = o.lineCol || 'rgba(232,218,190,.3)'; x.stroke(); });
      shown.forEach(function(L){ path(L[1], true); x.lineWidth = px(w[1]); x.strokeStyle = o.sea || '#2f5c78'; x.stroke(); }); });
    shown.forEach(function(L){ var nm = L[0], P0 = L[1];
      x.save(); x.shadowColor = 'rgba(20,12,8,.32)'; x.shadowBlur = 8; x.shadowOffsetX = 2; x.shadowOffsetY = 5; path(P0, true); x.fillStyle = hi[nm] || o.land || '#d9c49a'; x.fill(); x.restore();
      x.save(); path(P0, true); x.clip(); hatch(V.x0, V.y0, V.x1, V.y1, .8, 5, 'rgba(60,40,20,.16)', .6); x.restore(); path(P0, true); ink(1.1, o.ink || 'rgba(30,18,10,.85)'); }); }
  // route(pts, k, col, w): a dashed travel line along pts (layer units) drawn up to k (0 -> 1) with a ringed head; bow(a, b, h): a curved
  // course from a to b bowing by h x its length to the left (a flight or a sea route), as points for route()
  function bow(a, b, h, n){ n = n || 48; var dx = b[0] - a[0], dy = b[1] - a[1], o = []; for (var i = 0; i <= n; i++) { var k = i / n, e = 4 * k * (1 - k) * h; o.push([a[0] + dx * k - dy * e, a[1] + dy * k + dx * e]); } return o; }
  function route(pts, k, col, w){ if (k <= 0) return; var L = [0], i; for (i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    var end = L[L.length - 1] * cl(k, 0, 1), hd = pts[0]; x.save(); x.beginPath(); x.moveTo(pts[0][0], pts[0][1]);
    for (i = 1; i < pts.length; i++) { if (L[i] >= end) { var f = (end - L[i - 1]) / ((L[i] - L[i - 1]) || 1); hd = [mix(pts[i - 1][0], pts[i][0], f), mix(pts[i - 1][1], pts[i][1], f)]; x.lineTo(hd[0], hd[1]); break; } x.lineTo(pts[i][0], pts[i][1]); hd = pts[i]; }
    x.setLineDash([px(11), px(7)]); x.lineWidth = px(w || 3.4); x.strokeStyle = col; x.lineCap = 'round'; x.stroke(); x.setLineDash([]);
    x.beginPath(); x.arc(hd[0], hd[1], px(6), 0, 7); x.fillStyle = col; x.fill(); x.beginPath(); x.arc(hd[0], hd[1], px(11), 0, 7); x.lineWidth = px(1.6); x.stroke(); x.restore(); return hd; }
  // place(cam, X, Y, Z, name, k, o): a pin at a point of a layer and its name on a paper tag (screen space, reported to qa) that keeps its
  // whole box inside the frame (x 16-524, y 80-640) as the camera moves and fades once the pin leaves the frame; o.col (pin), o.ink, o.bg, o.size, o.up (tag above the pin, px)
  function place(cam, X, Y, Z, name, k, o){ if (k <= 0) return; o = o || {}; var p = proj(cam, X, Y, Z); if (!p) return; screen(); x.save(); x.globalAlpha *= cl(k * 2.5, 0, 1);
    var sz = o.size || 15, w = tw(name, sz, '800 ' + FI_, 2.5) + sz * 1.2, h = sz * 1.8, up = o.up == null ? 34 : o.up, k2 = eo(cl(k, 0, 1));
    x.beginPath(); x.arc(p.x, p.y, 5.5 * k2, 0, 7); x.fillStyle = o.col || '#f2b46a'; x.fill(); x.lineWidth = 1.6; x.strokeStyle = o.ink || '#1a120c'; x.stroke();
    var cx = cl(p.x, 16 + w / 2, 524 - w / 2), cy = cl(p.y - up - (1 - k2) * 8, 80 + h / 2, 640 - h / 2), out = Math.max(-p.x, p.x - 540, 60 - p.y, p.y - 700, 0);
    x.globalAlpha *= 1 - P(out, 0, 50); if (x.globalAlpha < .01) { x.restore(); return; }   // the pin has left the frame: its tag goes with it
    x.beginPath(); x.moveTo(p.x, p.y - 6); x.lineTo(cx, cy + h / 2); x.lineWidth = 1.2; x.strokeStyle = o.ink || '#1a120c'; x.globalAlpha *= .8; x.stroke(); x.globalAlpha /= .8;
    x.fillStyle = o.bg || 'rgba(16,12,10,.88)'; x.beginPath(); x.roundRect(cx - w / 2, cy - h / 2, w, h, h * .22); x.fill();
    txt(name, cx, cy + sz * .36, sz, '800 ' + FI_, o.txt || '#fbf3e0', 'center', 2.5); x.restore(); }

  // ---- journey (owner, 8 Nov 2026: "a JOURNEY, not a scene"; design/rules-c3.md rule 9): several worlds, each drawn whole by its own
  // function with its own camera, joined by varied, motivated transitions. paint(i, fn) draws a world into off-screen buffer i (the core's
  // context is swapped while fn runs, so every kit and core helper draws there); the transitions composite two buffers on the main canvas.
  // Draw no text inside a world (text boxes are probed on the main canvas): kinetic type goes over the composite.
  var BUFS = [];
  function paint(i, fn){ if (!BUFS[i]) { BUFS[i] = document.createElement('canvas'); BUFS[i].width = 1080; BUFS[i].height = 1920; }
    var b = BUFS[i], g = b.getContext('2d'), keep = x, ox = OX, oy = OY; g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.filter = 'none';
    g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, 1080, 1920); x = g; OX = 0; OY = 0; try { fn(); } finally { x = keep; OX = ox; OY = oy; } return b; }
  function blit(b, a, f){ x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha *= a == null ? 1 : a; if (f) x.filter = f; x.drawImage(b, 0, 0); x.restore(); }
  function half(px0, py0, ang, side){ var dx = Math.sin(ang), dy = Math.cos(ang), nx = dy * side, ny = -dx * side; x.beginPath();
    x.moveTo(px0 - dx * 3000, py0 - dy * 3000); x.lineTo(px0 + dx * 3000, py0 + dy * 3000); x.lineTo(px0 + dx * 3000 + nx * 3000, py0 + dy * 3000 + ny * 3000); x.lineTo(px0 - dx * 3000 + nx * 3000, py0 - dy * 3000 + ny * 3000); x.closePath(); }
  // through(A, B, k, hole, c, s0): the camera flies through a hole in world A (hole() = its path in screen px, grown by A's own camera)
  // into world B, which waits inside it scaled s0 about the hole's centre c = [x, y] and settles to full size and centre as k -> 1
  function through(bA, bB, k, hole, c, s0){ blit(bA); var e = eio(cl(k, 0, 1)), s = mix(s0, 1, e), cx = mix(c[0], 270, e), cy = mix(c[1], 480, e);
    x.save(); screen(); hole(); x.clip(); x.setTransform(2 * s, 0, 0, 2 * s, 2 * (cx - 270 * s), 2 * (cy - 480 * s)); x.drawImage(bB, 0, 0, 540, 960);
    x.restore(); }
  // match(A, B, k, a, b): a match cut on a shape: circle a = [x, y, r] in A and circle b in B; B is laid so its circle sits on A's, shows
  // inside it first, then eases to its own place while the circle opens past the frame
  function match(bA, bB, k, a, b){ blit(bA); var k1 = eo(P(k, 0, .4)), e = eio(P(k, .3, 1)), s = mix(a[2] / b[2], 1, e), tx = mix(a[0], b[0], e), ty = mix(a[1], b[1], e), r = mix(a[2], 1300, Math.pow(e, 1.6));
    x.save(); screen(); x.beginPath(); x.arc(tx, ty, r, 0, 7); x.clip(); x.globalAlpha = k1;
    x.setTransform(2 * s, 0, 0, 2 * s, 2 * (tx - b[0] * s), 2 * (ty - b[1] * s)); x.drawImage(bB, 0, 0, 540, 960); x.restore(); }
  // page(A, B, k): A turns over like a page from the right edge (a slightly tilted fold), its back is plain paper, B lies under it
  function page(bA, bB, k, back){ var e = eio(cl(k, 0, 1)), f = mix(600, -260, e), ang = -.16, dx = Math.sin(ang), dy = Math.cos(ang), R = [2 * dx * dx - 1, 2 * dx * dy, 2 * dx * dy, 2 * dy * dy - 1];
    blit(bB); x.save(); screen(); x.fillStyle = lg(f, 0, f + 60, 0, [[0, 'rgba(20,12,6,.45)'], [1, 'rgba(20,12,6,0)']]); half(f, 480, ang, 1); x.fill(); x.restore();
    x.save(); screen(); half(f, 480, ang, -1); x.clip(); blit(bA); x.restore();
    x.save(); screen(); x.transform(R[0], R[1], R[2], R[3], f - R[0] * f - R[2] * 480, 480 - R[1] * f - R[3] * 480); half(f, 480, ang, 1); x.clip(); x.beginPath(); x.rect(0, 0, 540, 960); x.clip();
    x.fillStyle = back || '#efe2c4'; x.fillRect(-100, -100, 740, 1160); x.globalAlpha = .13; x.drawImage(bA, 0, 0, 540, 960); x.globalAlpha = 1;
    x.fillStyle = lg(f, 0, f + 140, 0, [[0, 'rgba(60,40,20,.35)'], [.3, 'rgba(255,248,230,.25)'], [1, 'rgba(60,40,20,0)']]); x.fillRect(-100, -100, 740, 1160); x.restore(); }
  // fold(A, B, k, n): A folds up like a paper screen toward the left edge (n panels, alternate ones in shade) and B slides in behind it
  function fold(bA, bB, k, n){ n = n || 6; var e = eio(cl(k, 0, 1)), W = 540 * (1 - e), w = W / n;
    x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(bB, (1 - e) * 80, 0); x.restore();
    if (W < .5) return; x.save(); screen(); x.fillStyle = 'rgba(20,12,6,.35)'; x.fillRect(W, 0, 14 * (1 - e) + 4, 960);
    for (var i = 0; i < n; i++) { var sy = i % 2 ? 1 - .05 * e : 1, h = 960 * sy; x.drawImage(bA, 1080 / n * i, 0, 1080 / n, 1920, i * w, (960 - h) / 2, w + .5, h);
      x.fillStyle = 'rgba(20,12,6,' + (i % 2 ? .38 * e : .06 * e) + ')'; x.fillRect(i * w, (960 - h) / 2, w + .5, h); }
    x.restore(); }
  // seam(A, B, k): a parallax pan from world A into world B: both cameras keep moving sideways (the scene's tracks give the parallax), and
  // a cut-paper edge with a soft shadow travels from the right edge to the left; A left of it, B right of it
  function seam(bA, bB, k){ var e = eio(cl(k, 0, 1)), sx = mix(560, -20, e), r = rnd(41); blit(bA); x.save(); screen(); x.beginPath(); x.moveTo(sx, -5);
    for (var y = 0; y <= 965; y += 12) x.lineTo(sx + Math.sin(y / 53) * 6 + (r() - .5) * 4, y); x.lineTo(560, 965); x.lineTo(560, -5); x.closePath();
    x.shadowColor = 'rgba(20,12,6,.45)'; x.shadowBlur = 18; x.shadowOffsetX = -6; x.fillStyle = '#efe2c4'; x.fill(); x.shadowColor = 'transparent'; x.clip();
    x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(bB, 0, 0); x.restore(); }
  // print(A, k, at): world A becomes an old photograph: it tones to sepia, gains a white border and settles, small and turned, at
  // at = [x, y, scale, angle] (the scene draws the desk it lands on first)
  function print(bA, k, at){ var e = eio(cl(k, 0, 1)), s = mix(1, at[2], e), r = mix(0, at[3], e), cx = mix(270, at[0], e), cy = mix(480, at[1], e), bd = 16 * e;
    x.save(); screen(); x.translate(cx, cy); x.rotate(r); x.scale(s, s); x.shadowColor = 'rgba(20,12,6,' + (.45 * e) + ')'; x.shadowBlur = 30 * e; x.shadowOffsetY = 12 * e;
    x.fillStyle = '#f3ead6'; x.fillRect(-270 - bd, -480 - bd, 540 + 2 * bd, 960 + 2 * bd + bd * 2.2); x.shadowColor = 'transparent';
    x.drawImage(bA, -270, -480, 540, 960); x.globalAlpha = P(k, 0, .5); x.filter = 'sepia(1) contrast(.9) brightness(1.04)'; x.drawImage(bA, -270, -480, 540, 960); x.filter = 'none'; x.restore(); }
  // ---- depth, figure motion and ambient life (11 Nov 2026; owner, 8 Nov: Turns Out "feels flat"; 9 Nov: a figure "looks like someone has
  // abruptly fallen"; design/rules-c3.md rule 11, design/mandatory.md item 20). scripts/channel3/qa.mjs reads window.__depth() every 0.1 s and
  // prints "DEPTH <world>: n planes, parallax nn px, foreground yes" (fails under 4 planes, under 12 px or without a foreground plane). ----
  // ONE light for the whole journey: the key light comes from the upper left (the core's paper() drops its shadow down and right to match)
  var LIGHT = [-.5, .86], DEPTH = [], WCUR = null, MOOD = null;
  // begin(): first call of the scene's seek(); world(name, o): starts a world: o.air = the colour of its air (far planes go toward it:
  // lighter, lower contrast), o.haze = how thick (0-1, default .5), o.floor = the ground's height in metres (the air is laid only above the
  // new plane's ground line, so the near ground stays clear)
  function begin(){ DEPTH.length = 0; WCUR = null; }
  // with a colour mood set (Kt.mood, 13 Nov 2026) the air is the mood's (no pale fog) and the haze is capped at the mood's hazeMax
  function world(name, o){ o = o || {}; var hz = o.haze == null ? .5 : o.haze; if (MOOD) hz = Math.min(hz, MOOD.hazeMax);
    WCUR = { name: name, air: MOOD && !o.ownAir ? MOOD.air : o.air || '#d9cbb0', haze: hz, floor: o.floor, planes: [], cam: null, fg: 0, last: null }; DEPTH.push(WCUR); }
  // plane(cam, Z, o): use(cam, Z) for a depth plane of the current world, drawn far to near: before it the air between the last plane and
  // this one is laid over everything farther (atmospheric perspective). o.fg: the foreground plane that passes close to the lens; o.clear: no air
  function plane(cam, Z, o){ o = o || {}; var W = WCUR, dz = Z - cam.z; if (dz < .05) return 0;
    if (W) { if (W.last != null && W.haze > 0 && !o.clear && W.last > dz) { var a = cl(W.haze * (1 - Math.exp(-.55 * Math.log(W.last / dz))), 0, .6);
        if (a > .004) { screen(); x.save(); x.globalAlpha *= a; var yb = 960; if (W.floor != null && cam.y > W.floor) yb = cl(480 + OY + (cam.y - W.floor) * F / dz, 0, 960);
          if (yb >= 960) { x.fillStyle = W.air; x.fillRect(0, 0, 540, 960); }
          else { var g = x.createLinearGradient(0, yb - 26, 0, yb), c0 = W.air; g.addColorStop(0, c0); g.addColorStop(1, c0.length === 7 ? c0 + '00' : 'rgba(0,0,0,0)'); x.fillStyle = c0; x.fillRect(0, 0, 540, Math.max(0, yb - 26)); x.fillStyle = g; x.fillRect(0, yb - 26, 540, 26); }
          x.restore(); } }
      W.last = dz; W.cam = cam; W.planes.push(Z); if (o.fg) W.fg = 1; }
    return use(cam, Z); }
  window.__depth = function(){ return DEPTH.map(function(W){ return { name: W.name, F: F, fg: W.fg, cam: W.cam ? [W.cam.x, W.cam.y, W.cam.z] : null, planes: W.planes.slice() }; }); };
  // contact(X, Y, w, a, h): a soft contact shadow on the ground under a layer or a figure (current units): w wide, pulled away from the light
  function contact(X, Y, w, a, h){ a = a == null ? .42 : a; x.save(); x.translate(X - LIGHT[0] * w * .22, Y); x.scale(1, (h || w * .16) / w);
    var g = x.createRadialGradient(0, 0, 0, 0, 0, w * .5); g.addColorStop(0, 'rgba(24,14,8,' + a + ')'); g.addColorStop(.6, 'rgba(24,14,8,' + (a * .45) + ')'); g.addColorStop(1, 'rgba(24,14,8,0)');
    x.fillStyle = g; x.beginPath(); x.arc(0, 0, w * .5, 0, 7); x.fill(); x.restore(); }
  // lit(x0, y0, x1, y1, a, hi): a fill for a clipped shape (box in current units, y up): a little light on its upper left, shade on its lower right
  function lit(x0, y0, x1, y1, a, hi){ var g = x.createLinearGradient(x0, y1, x1, y0); g.addColorStop(0, 'rgba(255,240,210,' + (hi == null ? .16 : hi) + ')'); g.addColorStop(.42, 'rgba(255,240,210,0)');
    g.addColorStop(.58, 'rgba(30,18,10,0)'); g.addColorStop(1, 'rgba(30,18,10,' + (a == null ? .34 : a) + ')'); return g; }
  // ---- figure motion from keyframed joints. act(keys)(t) -> pose: keys [[t, pose, o]]; every move between two keys starts with a small
  // anticipation (it first goes the other way: o.ant, default .07 of the move), eases in and out (no linear move, no snap) and settles with a
  // small overshoot (o.over, default .04). o.hit: an impact (a tool landing): eases in and stops on the key. A pose is { hip: [x, y],
  // lean, head, hands: [[x, y], [x, y]], feet: [[x, y], [x, y]] } in the figure's metres (feet at 0, facing +x); any number or list blends. ----
  function sin2(k){ var s = Math.sin(Math.PI * cl(k, 0, 1)); return s * s; }
  function aes(k, o){ o = o || {}; k = cl(k, 0, 1); if (o.hit) return k * k * (1.6 * k - .6);
    return k * k * k * (k * (6 * k - 15) + 10) - (o.ant == null ? .07 : o.ant) * sin2(k / .3) + (o.over == null ? .04 : o.over) * sin2((k - .7) / .3); }
  function blend(a, b, w){ if (typeof a === 'number') return a + (b - a) * w; if (Array.isArray(a)) return a.map(function(v, i){ return blend(v, b[i], w); });
    var o = {}; Object.keys(a).forEach(function(q){ o[q] = b[q] == null ? a[q] : blend(a[q], b[q], w); }); return o; }
  function act(keys){ return function(t){ var n = keys.length; if (t <= keys[0][0]) return keys[0][1]; if (t >= keys[n - 1][0]) return keys[n - 1][1];
    for (var i = 0; i + 1 < n; i++) if (t <= keys[i + 1][0]) return blend(keys[i][1], keys[i + 1][1], aes((t - keys[i][0]) / (keys[i + 1][0] - keys[i][0]), keys[i + 1][2])); }; }
  // figure(o, pose, t): a jointed person in metres (feet at 0, facing +x; two-bone legs and arms, so it can bend, crouch, kneel and reach),
  // with its contact shadow; t adds the settle: a breath and a blink. o.h height, o.coat / o.trousers / o.skin / o.hair colours, o.long (a robe
  // to the shin), o.belt, o.bun (a topknot), o.hat 'straw', o.seed. Returns { hands: [[x, y], [x, y]], head: [x, y], sh: [x, y] } for props
  function figure(o, p, t){ var h = o.h || 1.7, k = h / 1.7, OL = o.ink || 'rgba(30,22,16,.85)', sd = o.seed || 0, br = t == null ? 0 : Math.sin(t * 1.9 + sd) * .008;
    var hip = p.hip || [0, .9], ln = p.lean || 0, ux = Math.sin(ln), uy = Math.cos(ln), fx = uy, fy = -ux, sh = [hip[0] + ux * .5, hip[1] + uy * .5 + br], ha = ln + (p.head || 0);
    var hd = [sh[0] + Math.sin(ha) * .2, sh[1] + Math.cos(ha) * .2], feet = p.feet || [[-.1, 0], [.12, 0]], hands = p.hands || [[sh[0] - .02, hip[1] - .1], [sh[0] + .12, hip[1] - .1]];
    x.save(); x.scale(k, k); contact((feet[0][0] + feet[1][0] + hip[0]) / 3, 0, .95 + Math.abs(feet[1][0] - feet[0][0]) * .6, .4, .1);
    function arm(i){ var s0 = [sh[0] + fx * (i ? .05 : -.05) - ux * .05, sh[1] + fy * (i ? .05 : -.05) - uy * .05], j = reach(s0[0], s0[1], hands[i][0], hands[i][1], .31, .3, -1);
      limb([s0[0], s0[1], j[0], j[1], j[2], j[3]], .09, i ? o.coat : (o.coat2 || o.coat), OL); x.beginPath(); x.arc(j[2], j[3], .043, 0, 7); fill(o.skin); return [j[2], j[3]]; }
    function leg(i){ var h0 = [hip[0] + (i ? .05 : -.04), hip[1]], f = feet[i], j = reach(h0[0], h0[1], f[0], f[1] + .05, .47, .47, 1);
      limb([h0[0], h0[1], j[0], j[1], j[2], j[3]], .13, i ? o.trousers : (o.trousers2 || o.trousers), OL); x.beginPath(); x.ellipse(f[0] + .06, f[1] + .035, .105, .04, 0, 0, 7); fill(o.shoes || '#1d1713'); }
    var H0 = arm(0); leg(0); leg(1);
    var hem = Math.min(o.long ? .5 : .16, hip[1] - .06), T = [[sh[0] - fx * .13, sh[1] - fy * .13], [sh[0] + ux * .05, sh[1] + uy * .05], [sh[0] + fx * .11, sh[1] + fy * .11], [hip[0] + ux * .25 + fx * .15, hip[1] + uy * .25 + fy * .15],
      [hip[0] + fx * .14, hip[1] + fy * .14], [hip[0] + .16, hip[1] - hem], [hip[0] - .18, hip[1] - hem], [hip[0] - fx * .15, hip[1] - fy * .15]];
    path(T, true); fill(o.coat); x.save(); path(T, true); x.clip(); x.fillStyle = lit(hip[0] - .3, hip[1] - hem, hip[0] + .45, sh[1] + .1, .36, .14); x.fillRect(hip[0] - 1, hip[1] - 1, 2.4, 2); x.restore(); path(T, true); ink(.9, OL);
    if (o.belt) { x.beginPath(); x.moveTo(hip[0] - fx * .15, hip[1] - fy * .15 + .04); x.lineTo(hip[0] + fx * .14, hip[1] + fy * .14 + .04); x.lineWidth = .05; x.strokeStyle = o.belt; x.lineCap = 'butt'; x.stroke(); }
    x.save(); x.translate(hd[0], hd[1]); x.rotate(-ha); x.fillStyle = o.skin; x.fillRect(-.035, -.2, .075, .1);
    x.beginPath(); x.ellipse(.02, 0, .095, .115, 0, 0, 7); fill(o.skin); ink(.9, OL);
    if (o.hair) { x.beginPath(); x.ellipse(-.03, .03, .07, .09, -.2, 0, 7); fill(o.hair); if (o.bun) { x.beginPath(); x.arc(-.02, .14, .05, 0, 7); fill(o.hair); } }
    x.beginPath(); x.ellipse(-.005, 0, .022, .032, 0, 0, 7); fill('rgba(150,95,70,.55)');
    var bl = t != null && ((t * .31 + sd * .17) % 1) < .045; if (bl) { x.beginPath(); x.moveTo(.06, .025); x.lineTo(.09, .025); ink(1, '#1b1511'); } else { x.beginPath(); x.arc(.075, .025, .011, 0, 7); fill('#1b1511'); }
    x.beginPath(); x.moveTo(.105, .02); x.lineTo(.127, -.015); x.lineTo(.1, -.02); fill(o.skin);
    if (o.hat === 'straw') { path([[-.21, .06], [.02, .2], [.25, .06]], true); fill(o.hatc || '#d9b56a'); ink(.8, OL); }
    x.restore(); var H1 = arm(1); x.restore();
    return { hands: [[H0[0] * k, H0[1] * k], [H1[0] * k, H1[1] * k]], head: [hd[0] * k, hd[1] * k], sh: [sh[0] * k, sh[1] * k] }; }
  // ---- ambient life (seeded, a pure function of t) ----
  // flick(t, seed): torch or lamp light, about .75-1; motes(t, n, seed, [x0, y0, x1, y1], col, size px): dust drifting through a box of the
  // current layer; cloth(X, Y, w, h, t, col, seed, edge): a cloth hanging from its top edge (X, Y) to (X + w, Y), swaying more toward its hem
  function flick(t, seed){ var s = seed || 1; return .86 + .07 * Math.sin(t * 11.3 + s) + .04 * Math.sin(t * 23.7 + s * 2.1) + .03 * Math.sin(t * 5.1 + s * .7); }
  function motes(t, n, seed, b, col, sz){ if (MOOD) n = Math.round(n * MOOD.particles); var r = rnd(seed), w = b[2] - b[0], h = b[3] - b[1], ga = x.globalAlpha; x.fillStyle = col;
    for (var i = 0; i < n; i++) { var X = b[0] + (((r() * w + t * (.015 + r() * .03) * w + Math.sin(t * (.4 + r()) + i) * w * .015) % w) + w) % w, Y = b[1] + (((r() * h - t * (.008 + r() * .02) * h) % h) + h) % h;
      x.globalAlpha = ga * (.3 + .7 * Math.abs(Math.sin(t * (.6 + r() * .8) + i * 1.3))); x.beginPath(); x.arc(X, Y, px(sz || 1.6) * (.5 + r()), 0, 7); x.fill(); }
    x.globalAlpha = ga; }
  function cloth(X, Y, w, h, t, col, seed, edge){ var n = 10, pts = [], i, s = seed || 0, sw = function(u, q){ return (Math.sin(t * 1.7 + s + u * 2.4 + q) * .07 + Math.sin(t * .9 + s * 2 + u * 1.3 + q) * .05) * w * u; };
    for (i = 0; i <= n; i++) pts.push([X + sw(i / n, 0), Y - h * i / n]); for (i = n; i >= 0; i--) pts.push([X + w + sw(i / n, .6), Y - h * i / n]);
    x.save(); x.shadowColor = 'rgba(24,14,8,.25)'; x.shadowBlur = 6 * cs(); x.shadowOffsetX = 3; x.shadowOffsetY = 5; path(pts, true); fill(col); x.restore();
    x.save(); path(pts, true); x.clip(); x.fillStyle = lit(X, Y - h, X + w, Y, .3, .12); x.fillRect(X - w, Y - h * 1.1, w * 3, h * 1.2);
    x.beginPath(); for (i = 1; i < 4; i++) { x.moveTo(X + w * i / 4, Y); x.lineTo(X + w * i / 4 + sw(1, i * .2), Y - h); } ink(.8, 'rgba(30,18,10,.22)'); x.restore(); path(pts, true); ink(.9, edge || 'rgba(30,22,16,.6)'); }
  // ambient(Q, kind, t0, t1, X): the quiet sound of a world's ambient life, pushed into the scene's cue list Q (scripts/showreel/sound.py):
  // 'torch' / 'lamp' = small crackles, 'cloth' = soft paper-cloth rustles, 'dust' = thin air with a few high ticks, 'wind' = one long soft move
  function ambient(Q, kind, t0, t1, X){ var r = rnd(Math.round(t0 * 100) + kind.length * 7), t; X = X == null ? 270 : X;
    if (kind === 'torch' || kind === 'lamp') for (t = t0 + .3; t < t1 - .3; t += 1.1 + r() * .7) Q.push({ t: t, k: 'rustle', d: .45, g: .09, p: 4, x: X });
    else if (kind === 'cloth') for (t = t0 + .4; t < t1 - .4; t += 1.7 + r()) Q.push({ t: t, k: 'rustle', d: .7, g: .11, p: -3, x: X });
    else { Q.push({ t: t0 + .1, k: 'move', d: Math.max(.6, Math.min(t1 - t0 - .3, 4)), g: kind === 'wind' ? .1 : .06, p: kind === 'wind' ? -.5 : 1, x: kind === 'wind' ? 60 : X, x2: kind === 'wind' ? 480 : X, r: .25 });
      if (kind === 'dust') for (t = t0 + .5; t < t1 - .3; t += 1.3 + r()) Q.push({ t: t, k: 'tick', g: .03, p: 12, x: cl(X + (r() - .5) * 200, 30, 510) }); } }
  // ---- the guess format (11 Nov 2026; design/rules-c3.md rule 1, "Guess first"): the viewer picks before the answer. Turns Out reels that
  // reached the ~1,100 pool stopped there with 0-8 shares (Instagram collect, 11 Nov); a question the viewer answers (in the head, then in the
  // comments) and a short loop are the levers for the next pool. Screen space, every text reported to qa. ----
  // choices(opts, t, o): the options row. opts = [{ key: 'A', word: 'GOLD', col: '#d9a93a', at: when it is spoken }]; o = { y (centre, px),
  // x (centre, default 255), pick (index of the answer), reveal (time of the answer), live(t) -> the index lit now (or -1), bg, ink, hi (ring) }.
  // Each chip springs in on its word; at the reveal the answer pops and gets a ring and a tick, the others dim and get a strike.
  function choices(opts, t, o){ var n = opts.length, gap = 10, W = Math.min(142, (450 - gap * (n - 1)) / n), X0 = (o.x || 255) - (n * W + (n - 1) * gap) / 2, Y = o.y || 214, h = 50,
      rv = o.reveal == null ? 1e9 : o.reveal, kr = P(t, rv, rv + .35), live = o.live ? o.live(t) : -1, out = o.out == null ? 0 : P(t, o.out, o.out + .35);
    if (out >= 1) return;
    opts.forEach(function(op, i){ var k = es(P(t, op.at - .12, op.at + .3)); if (k <= 0) return; var cx = X0 + i * (W + gap) + W / 2, win = i === o.pick,
        pop = win ? Math.sin(Math.PI * P(t, rv, rv + .45)) * .14 : 0, lit = live === i && kr <= 0 ? .06 : 0;
      x.save(); x.translate(cx, Y - eo(out) * 14); arrive(k); x.scale(1 + pop + lit, 1 + pop + lit); x.globalAlpha *= (1 - out) * (win ? 1 : 1 - .6 * kr);
      paper(rr(-W / 2, -h / 2, W, h, 13), o.bg || 'rgba(16,12,10,.9)', 3);
      if (lit || (win && kr > 0)) { x.save(); x.globalAlpha *= win && kr > 0 ? kr : 1; x.beginPath(); x.roundRect(-W / 2 - 3, -h / 2 - 3, W + 6, h + 6, 15); x.lineWidth = win && kr > 0 ? 3.5 : 2; x.strokeStyle = win && kr > 0 ? (o.hi || '#8fe39b') : 'rgba(255,240,215,.7)'; x.stroke(); x.restore(); }
      x.beginPath(); x.arc(-W / 2 + 23, 0, 13, 0, 7); x.fillStyle = op.col; x.fill(); x.lineWidth = 2; x.strokeStyle = 'rgba(255,246,228,.75)'; x.stroke();
      txt(op.word, -W / 2 + 44, 7, 19, '800 ' + FI, o.ink || '#fbf3e0', 'left', 1.2);
      if (!win && kr > 0) { x.beginPath(); x.moveTo(-W / 2 + 40, 0); x.lineTo(-W / 2 + 40 + (W - 52) * eo(kr), 0); x.lineWidth = 2.5; x.strokeStyle = 'rgba(255,240,215,.8)'; x.stroke(); }
      if (win && kr > 0) { var e = eo(kr); x.save(); x.translate(W / 2 - 4, -h / 2 + 4); x.scale(e, e); x.beginPath(); x.arc(0, 0, 12, 0, 7); x.fillStyle = o.hi || '#8fe39b'; x.fill();
        x.beginPath(); x.moveTo(-5, .5); x.lineTo(-1.5, 4); x.lineTo(5.5, -4); x.lineWidth = 2.6; x.lineCap = 'round'; x.lineJoin = 'round'; x.strokeStyle = '#12301a'; x.stroke(); x.restore(); }
      x.restore(); }); }
  // countdown(t, t0, t1, X, Y, o): n numerals (o.n, default 3) over [t0, t1], each landing with a spring inside a ring that drains; o.col,
  // o.bg, o.size. Returns the times each numeral lands (for the ticks).
  function countdown(t, t0, t1, X, Y, o){ o = o || {}; var n = o.n || 3, d = (t1 - t0) / n, at = [], i; for (i = 0; i < n; i++) at.push(t0 + i * d);
    if (t < t0 - .2 || t > t1 + .25) return at; var a = P(t, t0 - .2, t0) * (1 - P(t, t1, t1 + .25)), R = o.r || 46, i0 = cl(Math.floor((t - t0) / d), 0, n - 1), u = P(t, at[i0], at[i0] + d);
    x.save(); x.globalAlpha *= a; x.translate(X, Y); x.beginPath(); x.arc(0, 0, R, 0, 7); x.fillStyle = o.bg || 'rgba(16,12,10,.82)'; x.fill();
    x.beginPath(); x.arc(0, 0, R - 5, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * (1 - P(t, t0, t1))); x.lineWidth = 5; x.lineCap = 'round'; x.strokeStyle = o.col || '#f2b46a'; x.stroke();
    var k = es(P(u, 0, .35)); x.save(); x.scale(mix(1.5, 1, k), mix(1.5, 1, k)); x.globalAlpha *= cl(k * 2.5, 0, 1) * (1 - P(u, .85, 1) * .6); txt(String(n - i0), 0, (o.size || 50) * .36, o.size || 50, '800 ' + FI, o.ink || '#fbf3e0', 'center'); x.restore();
    x.restore(); return at; }
  // repaint(draw, from, to, k, box, o): a coat of paint climbing (or o.dir 'x': crossing) a subject: draw(col) draws the subject in a colour (current
  // units, y up); the new coat covers box = [x0, y0, x1, y1] up to k (0 -> 1, eased by the caller) with a wet, lighter edge. Use it for every
  // colour change of a "colour nobody pictured" reel: the change happens on the subject, in front of the viewer.
  function repaint(draw, from, to, k, box, o){ o = o || {}; k = cl(k, 0, 1); if (k < 1) draw(from); if (k <= 0) return; var ax = o.dir === 'x', L = ax ? mix(box[0], box[2], k) : mix(box[1], box[3], k);
    x.save(); x.beginPath(); if (ax) x.rect(box[0] - 1e3, box[1] - 1e3, L - box[0] + 1e3, box[3] - box[1] + 2e3); else x.rect(box[0] - 1e3, box[1] - 1e3, box[2] - box[0] + 2e3, L - box[1] + 1e3); x.clip(); draw(to); x.restore();
    if (k < 1 && o.edge !== false) { x.save(); x.beginPath(); if (ax) x.rect(L - px(3), box[1], px(3), box[3] - box[1]); else x.rect(box[0], L - px(3), box[2] - box[0], px(3)); x.clip(); draw(o.wet || 'rgba(255,244,222,.95)'); x.restore(); } }
  // guessCues(Q, opts, cd, reveal, X): the format's sounds: a pop as each option lands (panned by its place), a tick per numeral, a riser into the
  // answer, a hit and a shimmer on it
  function guessCues(Q, opts, cd, reveal, X){ X = X == null ? 255 : X; var n = opts.length;
    opts.forEach(function(op, i){ Q.push({ t: op.at, k: 'pop', g: .16, p: 3 + i * 2, x: X + (i - (n - 1) / 2) * 152 }); });
    cd.forEach(function(c, i){ Q.push({ t: c, k: 'tick', g: .22, p: 6 + i * 2, x: X }); });
    Q.push({ t: reveal, k: 'riser', d: Math.min(1.6, reveal - cd[0]), g: .12 }, { t: reveal, k: 'hit', g: .24, x: X }, { t: reveal + .05, k: 'shimmer', g: .14, x: X }); }
  // ---- detail and stacking (12 Nov 2026; owner: "improvements in animation with more detailing and stacking ... with sound element
  // enhancements, to avoid boring instances in the reel and make it tick, snap, click better"; design/rules-c3.md rule 9). Every world
  // carries small details that build up (rivets popping in, paint strokes sweeping, labels and stamps snapping on, paper pieces stacking,
  // tallies ticking, dust and sparks), staggered so something small changes every 0.5-1 s, and each one is heard: beat() declares it once
  // (when, what kind, where on screen, how big) and beatCues() turns every beat into its matched sound on the element-detail bus. qa.mjs
  // reads window.__beats(): "BUSY: longest quiet run n.n s" (no beat seen on the frames and no sound onset) fails over 1.5 s. ----
  var BEATS = [];
  // beat(t, kind, X, Y, size): one small event the scene draws at t. X, Y = where on screen (CSS px: the pan, and where qa looks for it);
  // size 0-1 (0 = a rivet, 1 = a large piece; small sounds high, large low). Kinds and their sounds:
  //   'pop' (a rivet, a dot, a small piece popping in) and 'count' (a tally or counter step) = tick; 'stamp' and 'label' = snap;
  //   'pin' and 'toggle' = click; 'stack' and 'slide' (a paper piece landing on the pile) = a short paper slide and a tap on the landing;
  //   'big' (a large piece settling) = a soft thud with a tap on top; 'stroke' (a paint stroke) = a short rustle; 'spark' = a high tick
  function beat(t, kind, X, Y, size){ BEATS.push({ t: +(+t).toFixed(2), kind: kind, x: Math.round(cl(X, 0, 540)), y: Math.round(cl(Y == null ? 480 : Y, 0, 960)), s: size == null ? .3 : size }); return t; }
  function beats(){ return BEATS; }
  window.__beats = function(){ return BEATS.slice(); };
  function beatCues(Q){ BEATS.forEach(function(b, i){ var X = cl(b.x, 20, 520), hi = 1 - cl(b.s, 0, 1), v = (i * 7) % 3;
    if (b.kind === 'pop' || b.kind === 'count') Q.push({ t: b.t, k: 'tick', g: .09 + b.s * .04, p: Math.round(8 + hi * 8 + v), x: X });
    else if (b.kind === 'spark') Q.push({ t: b.t, k: 'tick', g: .07, p: 16 + v, x: X });
    else if (b.kind === 'stamp' || b.kind === 'label') Q.push({ t: b.t, k: 'snap', g: .11 + b.s * .04, p: Math.round(1 + hi * 5 + v), x: X });
    else if (b.kind === 'pin' || b.kind === 'toggle') Q.push({ t: b.t, k: 'click', g: .11, p: Math.round(hi * 4 + v), x: X });
    else if (b.kind === 'stack' || b.kind === 'slide') Q.push({ t: b.t - .16, k: 'rustle', d: .2, g: .1, p: 2 + v, x: X }, { t: b.t, k: 'tap', g: .1 + b.s * .04, p: Math.round(hi * 4), x: X });
    else if (b.kind === 'big') Q.push({ t: b.t, k: 'thud', g: .16 + b.s * .08, p: -2, x: X }, { t: b.t + .01, k: 'tap', g: .12, p: 0, x: X });
    else if (b.kind === 'stroke') Q.push({ t: b.t, k: 'rustle', d: .26, g: .1, p: 5 + v, x: X });
    else Q.push({ t: b.t, k: 'tick', g: .09, p: 10, x: X }); }); }
  // lands(t, t0, d): 0 before a piece starts arriving, a spring to 1 as it lands at t0 (d = the flight, default .32 s), settling after
  function lands(t, t0, d){ d = d || .32; return t < t0 - d ? 0 : es(P(t, t0 - d, t0 + .22)); }
  // stackOn(t, t0, X, Y, rot, draw, o): a cut-paper piece arriving on the pile in front of the viewer: it drops in from o.from (current units,
  // default 40 px "above" in this layer's own up), turned o.turn (default .12 rad) more than its resting rot, 8 % large and lifted (a long,
  // soft offset shadow), then lands at t0 on (X, Y), settles with a small overshoot and its shadow tightens to a short offset (the key light
  // is upper left, so it falls down and right). draw() draws the piece around 0, 0 in the current units. o.d = the flight (s), o.sh = shadow
  // strength (0-1). Use it for every piece that builds a picture: cards, photos, stamps, labels, plates, tiles.
  function stackOn(t, t0, X, Y, rot, draw, o){ o = o || {}; var k = lands(t, t0, o.d); if (k <= 0) return 0; var up = x.getTransform().d < 0 ? 1 : -1, from = o.from || [px(-14), up * px(40)],
      lift = 1 - cl(k, 0, 1), sh = o.sh == null ? 1 : o.sh;
    x.save(); x.translate(X + from[0] * lift, Y + from[1] * lift); x.rotate((rot || 0) + (o.turn == null ? .12 : o.turn) * (1 - k)); x.scale(1 + .08 * lift, 1 + .08 * lift);
    x.globalAlpha *= cl(k * 4, 0, 1);
    if (sh > 0) { x.shadowColor = 'rgba(28,18,12,' + (.3 * sh).toFixed(3) + ')'; x.shadowBlur = mix(4, 22, lift) * sh; x.shadowOffsetX = mix(3, 12, lift) * sh; x.shadowOffsetY = mix(5, 20, lift) * sh; }
    draw(k); x.restore(); return k; }
  // rivet(t, t0, X, Y, r, col): a rivet head popping in (current units, r = radius): grows past full size and settles, a lit dot on its upper
  // left, and a thin ring that opens and fades around it (matte: a line, no glow)
  function rivet(t, t0, X, Y, r, col){ if (t < t0 - .04) return; var k = es(P(t, t0 - .04, t0 + .2)), g = P(t, t0, t0 + .4);
    x.save(); x.beginPath(); x.arc(X, Y, r * k, 0, 7); x.fillStyle = col || '#3b302a'; x.fill();
    x.beginPath(); x.arc(X - r * .3, Y + (x.getTransform().d < 0 ? r * .3 : -r * .3), r * .32 * k, 0, 7); x.fillStyle = 'rgba(255,240,215,.55)'; x.fill();
    if (g > 0 && g < 1) { x.globalAlpha *= (1 - g) * .8; x.beginPath(); x.arc(X, Y, r * (1.2 + 2.2 * eo(g)), 0, 7); x.lineWidth = px(1.2); x.strokeStyle = 'rgba(255,236,200,.9)'; x.stroke(); }
    x.restore(); }
  // sweep(t, t0, t1, pts, w, col, seed): one paint stroke along a polyline (current units) from t0 to t1: the paint lays down behind a wet,
  // lighter head, with bristle streaks along it and a dry, broken tail
  function sweep(t, t0, t1, pts, w, col, seed){ if (t < t0) return; var k = eio(P(t, t0, t1)), L = [0], i, tot; for (i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); tot = L[L.length - 1] * k;
    var r = rnd(seed || 5), at = function(d){ for (var j = 1; j < pts.length; j++) if (L[j] >= d || j === pts.length - 1) { var u = (d - L[j - 1]) / Math.max(1e-9, L[j] - L[j - 1]); return [mix(pts[j - 1][0], pts[j][0], cl(u, 0, 1)), mix(pts[j - 1][1], pts[j][1], cl(u, 0, 1)), Math.atan2(pts[j][1] - pts[j - 1][1], pts[j][0] - pts[j - 1][0])]; } return [pts[0][0], pts[0][1], 0]; };
    x.save(); x.lineCap = 'round'; x.lineJoin = 'round';
    for (var b = 0; b < 7; b++) { var off = (b / 6 - .5) * w * .9, dry = .55 + r() * .45; x.beginPath();
      for (var s0 = 0; s0 <= 24; s0++) { var d = tot * s0 / 24, q = at(d), nx = -Math.sin(q[2]), ny = Math.cos(q[2]); if (s0) x.lineTo(q[0] + nx * off, q[1] + ny * off); else x.moveTo(q[0] + nx * off, q[1] + ny * off); if (s0 / 24 > dry && k >= 1) break; }
      x.lineWidth = w * (b % 3 ? .2 : .32); x.strokeStyle = col; x.globalAlpha = b % 2 ? .85 : 1; x.stroke(); }
    if (k < 1) { var h = at(tot); x.globalAlpha = .7; x.beginPath(); x.arc(h[0], h[1], w * .45, 0, 7); x.fillStyle = 'rgba(255,240,222,.55)'; x.fill(); }
    x.restore(); }
  // sparks(t, t0, X, Y, n, seed, col, R): a little burst on a landing (dust off paper, sparks off iron): n bits fly out up to R px and fade
  // over .45 s (current units; sizes on screen stay about 1.5-2.5 px)
  function sparks(t, t0, X, Y, n, seed, col, R){ var u = P(t, t0, t0 + .45); if (u <= 0 || u >= 1) return; var r = rnd(seed || 3), e = eo(u), up = x.getTransform().d < 0 ? 1 : -1; x.save(); x.fillStyle = col || 'rgba(255,226,180,.9)';
    for (var i = 0; i < (n || 8); i++) { var a = (i / (n || 8)) * 6.28 + r() * .6, d = px(R || 26) * (.5 + r() * .6) * e; x.globalAlpha = (1 - u) * (.6 + r() * .4);
      x.beginPath(); x.arc(X + Math.cos(a) * d, Y + up * (Math.sin(a) * d * .7 + px(6) * e) - up * px(14) * u * u * (r() - .2), px(1.1 + r() * 1.2), 0, 7); x.fill(); }
    x.restore(); }
  // tally(t, times, X, Y, o): a counter without digits: one tick mark lands at each time (a short drop and a snap), o.gap / o.h (px on screen),
  // o.col; every fifth crosses the four before it. Use it when a count is shown but no number is said (a number said lands with its word).
  function tally(t, times, X, Y, o){ o = o || {}; var g = px(o.gap || 7), h = px(o.h || 18), up = x.getTransform().d < 0 ? 1 : -1; x.save(); x.lineCap = 'round'; x.strokeStyle = o.col || 'rgba(40,30,22,.85)'; x.lineWidth = px(o.w || 2.2);
    times.forEach(function(t0, i){ var k = es(P(t, t0 - .06, t0 + .18)); if (k <= 0) return; var five = i % 5 === 4, gi = Math.floor(i / 5) * 5, X0 = X + (gi + (i - gi)) * g + Math.floor(i / 5) * g * .8;
      x.beginPath(); if (five) { x.moveTo(X + gi * g + Math.floor(i / 5) * g * .8 - g * .4, Y + up * h * .2); x.lineTo(X + gi * g + Math.floor(i / 5) * g * .8 + g * 3.4 * k, Y + up * h * (.2 + .6 * k)); }
      else { x.moveTo(X0, Y + up * h * (1 - k) * .4); x.lineTo(X0, Y + up * h * mix(.4, 1, k)); } x.stroke(); });
    x.restore(); }
  // ---- colour mood (13 Nov 2026; owner: "On Turns Out, I don't find the colour selection better in the overall reel combination"; the Taj
  // stills: a grey-green fog over every scene, a white subject on a pale grey sky, thin cream titles, beige-on-beige close-ups, a sudden navy
  // sky, pink flakes everywhere). ONE mood per reel, set once before the first seek: Kt.mood('dusk'). It gives every world the same sky,
  // air and ground family, a dark ground for depth, a warm key light on the subject with a gold rim, ONE accent for type, solid dark plates
  // for every title and subtitle, a cap on haze and on particles, and a final grade that pulls each frame into the family. Matte: no glow.
  // Output QA GRADE (scripts/qa/output-qa.py) measures it on the final MP4: subject vs background contrast on the cover, no washed-out
  // frames, no hue jumps between worlds. ----
  var MOODS = {
    // golden hour: a deep blue dusk sky over a dark ground; the subject lit warm from the low sun with a soft gold rim
    dusk: { sky: [[0, '#0b1430'], [.42, '#1d2c55'], [.6, '#3a3f66'], [.68, '#8a5a4a'], [.72, '#2a2a3a'], [1, '#101318']], night: [[0, '#070b1c'], [.5, '#121b3a'], [1, '#0c0f18']],
      air: '#22305a', hazeMax: .2, ground: '#1b2219', groundDeep: '#0d110d', lit: '#f6d9a8', rim: '#f2b65e', shade: '#2b3354', wall: '#e8c99a', water: '#1c2a4a',
      accent: '#f2b46a', ink: '#fbf3e0', plate: 'rgba(9,11,22,.94)', tint: '#3a4a7a', unify: .07, vignette: .45, particles: .3, paper: .2 } };
  // mood(name | object): set the reel's mood (returns it); mood() returns the current one (null = the old per-scene colours)
  function mood(m){ if (m !== undefined) MOOD = typeof m === 'string' ? MOODS[m] : m; return MOOD; }
  // sky(stops): the mood's sky over the whole frame (screen space); stops default to the mood's dusk sky, or pass MOOD.night
  function sky(stops, k){ var M = MOOD || MOODS.dusk; screen(); var g = x.createLinearGradient(0, 0, 0, 960); (stops || M.sky).forEach(function(s){ g.addColorStop(s[0], s[1]); });
    x.save(); if (k != null) x.globalAlpha *= k; x.fillStyle = g; x.fillRect(0, 0, 540, 960); x.restore(); }
  // warm(hex, k): a colour lit by the mood's key light (k 0-1, default .45): a white subject becomes warm cream, never grey
  function warm(hex, k){ var M = MOOD || MOODS.dusk, a = hex.match(/\w\w/g).map(function(v){ return parseInt(v, 16); }), b = M.lit.match(/\w\w/g).map(function(v){ return parseInt(v, 16); }), q = k == null ? .45 : k;
    return '#' + a.map(function(v, i){ return Math.round(v + (b[i] - v) * q).toString(16).padStart(2, '0'); }).join(''); }
  // rim(draw, d): the subject with a gold rim on the edges that face the light (upper left): draw(col) draws it in a colour (current units);
  // a copy in the rim colour sits d px (default 2.2) toward the light, then the subject over it. Hard edge, no blur (matte).
  function rim(draw, d, col){ var M = MOOD || MOODS.dusk, o = px(d || 3), up = x.getTransform().d < 0 ? 1 : -1; x.save(); x.translate(LIGHT[0] * o * 1.2, up * LIGHT[1] * o); draw(col || M.rim); x.restore(); }
  // plate(X, Y, w, h, r): a solid dark plate (screen px) behind a title, a subtitle or a label: type never sits on the picture
  function plate(X, Y, w, h, r, col){ var M = MOOD || MOODS.dusk; x.save(); x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowBlur = 10; x.shadowOffsetY = 3; x.fillStyle = col || M.plate;
    x.beginPath(); x.roundRect(X, Y, w, h, r == null ? 12 : r); x.fill(); x.restore(); }
  // grade(): the last pass over the picture, before the type (screen space): a soft-light wash of the mood's tint pulls every world into one
  // family, the corners and the bottom go darker (depth, and the subtitles sit on dark). Call it once per frame after the worlds.
  function grade(){ var M = MOOD; if (!M) return; x.save(); x.setTransform(2, 0, 0, 2, 0, 0); x.globalAlpha = 1;
    x.globalCompositeOperation = 'soft-light'; x.globalAlpha = M.unify * 2; x.fillStyle = M.tint; x.fillRect(0, 0, 540, 960);
    x.globalCompositeOperation = 'multiply'; x.globalAlpha = 1; var v = x.createRadialGradient(255, 420, 260, 255, 470, 720); v.addColorStop(0, 'rgba(255,255,255,1)'); v.addColorStop(1, 'rgba(' + [40, 44, 70].join(',') + ',1)');
    x.globalAlpha = M.vignette; x.fillStyle = v; x.fillRect(0, 0, 540, 960);
    var b = x.createLinearGradient(0, 640, 0, 960); b.addColorStop(0, 'rgba(255,255,255,1)'); b.addColorStop(1, 'rgba(30,32,48,1)'); x.globalAlpha = .55; x.fillStyle = b; x.fillRect(0, 640, 540, 320);
    x.restore(); }
  var FI_ = "'Inter',system-ui,sans-serif";
  return { F: F, track: track, off: off, use: use, screen: screen, proj: proj, vis: vis, px: px, hatch: hatch, path: path, ink: ink, fill: fill, seg: seg, wtxt: wtxt,
    paperTex: paperTex, roll: roll, label: label, stamp: stamp, rings: rings, ground: ground, ridge: ridge, wave: wave, city: city, tree: tree, person: person, reach: reach, limb: limb,
    LANDS: LANDS, globe: globe, gxy: gxy, map: map, mxy: mxy, route: route, bow: bow, place: place,
    paint: paint, blit: blit, through: through, match: match, page: page, fold: fold, print: print, seam: seam,
    LIGHT: LIGHT, begin: begin, world: world, plane: plane, contact: contact, lit: lit, act: act, aes: aes, figure: figure, flick: flick, motes: motes, cloth: cloth, ambient: ambient,
    choices: choices, countdown: countdown, repaint: repaint, guessCues: guessCues,
    MOODS: MOODS, mood: mood, sky: sky, warm: warm, rim: rim, plate: plate, grade: grade,
    beat: beat, beats: beats, beatCues: beatCues, lands: lands, stackOn: stackOn, rivet: rivet, sweep: sweep, sparks: sparks, tally: tally };
})();
