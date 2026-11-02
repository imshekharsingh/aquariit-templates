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
  return { F: F, track: track, off: off, use: use, screen: screen, proj: proj, vis: vis, px: px, hatch: hatch, path: path, ink: ink, fill: fill, seg: seg, wtxt: wtxt,
    paperTex: paperTex, roll: roll, label: label, stamp: stamp, rings: rings, ground: ground, ridge: ridge, wave: wave, city: city, tree: tree, person: person, reach: reach, limb: limb };
})();
