// ---- @webin20sec motion kit (scripts/explainer/kitmotion.js; owner, 7 Nov 2026: "Can we further improve the overall animation and flow?") ----
// Premium motion by default for every web reel, like kit25d.js for Turns Out. Inlined into a scene's main script between the kitmotion
// begin and end markers by node scripts/channel3/kit-inline.mjs <scene.html> (npm run check fails on a stale copy); start a reel with
// node scripts/explainer/newweb.mjs <slug> "Hook?" "Sentence." ... Every frame is a pure function of t: moves, transitions and taps are
// registered once (in the scene's anchors(), after the voice timings are known), then drawn from t alone in seek(t).
// Registering a move, transition or tap also writes its sound cue (move / swell / snap / blip / touch, with x) and declares a transition in
// window.TRANSITIONS, so the FLOW gate (scripts/showreel/flow.mjs: no undeclared cuts, no dead runs, continuity 85%+) knows it was meant.
//   KM.reset(dur)                         before registering (anchors()); KM.publish(extra) after: window.CUES and window.TRANSITIONS
//   eases: KM.ease.out3 / inOut3 / expoInOut / back(k, s) / spring(k) (critically damped) / settle(k, f) (overshoot and settle)
//   KM.rig({ x, y, z, drift })            the camera: a continuous eased drift (never still) + named moves, rig.at(t) -> { x, y, z, vx, vy, vz }
//     rig.pushIn(t0, d, x, y, z) · rig.pan(t0, d, x, y) · rig.pushThrough(t0, d, x, y, z) (a fast zoom through, declared) ·
//     rig.matchMove(t0, d, x, y, z) (follows a shared element, declared) · rig.creep(t0, d, dz) (a slow steady push through a held beat) · rig.apply(worldEl, t, tiltEl) · rig.toScreen(c, x, y)
//   KM.transition(kind, t0, d, cue)       declares [t0, t0 + d, kind], writes its cue, returns k(t) (0 -> 1, eased) for the setters:
//     KM.shared(el, a, b, k) (sharedElement: a box glides and scales between layouts, a/b = { x, y, w, h, r }) · KM.pushThrough(el, k, dir) ·
//     KM.morph(el, a, b, k, colA, colB) · KM.wipe(newLayer, k) (wipeRestyle: the new theme comes down top to bottom)
//   text: KM.rise(spans, t, starts, gone) (blur to sharp, word by word) · KM.type(el, html, t, t0, t1) (typing with a caret) ·
//     KM.sweep(el, t, t0, d, col) (a highlight sweep) · KM.leader(line, label, from, to, k) (a leader-line label, SVG line + text)
//   secondary: KM.parallax(el, c, depth) · KM.stagger(els, t, t0, gap, d) · KM.squeeze(el, t, tTap) (press and pop) ·
//     KM.ripple(el, t, tTap, x, y) · KM.tap(t, x) (the touch cue for a tap at screen x)
//   details format (8 Nov 2026): KM.curve(spec) · KM.linearCss(f, n) · KM.timeScale(t0, t1, factor) (slow motion; the camera keeps reel time) ·
//     KM.curveGraph(svg, spec, c0, d, { clock, real }) (the live easing curve with a riding dot) · KM.slowmoBadge(el, ts, label) ·
//     KM.specChip(el, items, t0, d) (numbers roll in) · KM.partProgress(el, parts) (the segmented top bar); start a reel with newweb.mjs --details N
//   voice and subtitles: KM.voice(text, lead) -> { words, at(word, nth), phrases(max) } · KM.subs(capEl, t, V, PH, from, until, colour)
var KM = (function(){
  var cl = function(v, a, b){ a = a == null ? 0 : a; b = b == null ? 1 : b; return v < a ? a : v > b ? b : v; };
  var P = function(t, a, b){ return b <= a ? (t >= a ? 1 : 0) : cl((t - a) / (b - a)); }, mix = function(a, b, k){ return a + (b - a) * k; };
  var win = function(t, a, b, f){ return Math.min(P(t, a - f, a), 1 - P(t, b - f, b)); };
  var ease = {
    linear: function(k){ return k; },
    out3: function(k){ return 1 - Math.pow(1 - k, 3); },
    inOut3: function(k){ return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; },
    expoInOut: function(k){ return k <= 0 ? 0 : k >= 1 ? 1 : k < .5 ? Math.pow(2, 20 * k - 10) / 2 : (2 - Math.pow(2, -20 * k + 10)) / 2; },
    back: function(k, s){ s = s == null ? 1.3 : s; return k <= 0 ? 0 : k >= 1 ? 1 : 1 + (s + 1) * Math.pow(k - 1, 3) + s * Math.pow(k - 1, 2); },
    // a critically damped spring over the move's length (no overshoot, a fast start and a long soft landing), exactly 1 at the end
    spring: function(k){ if (k <= 0) return 0; if (k >= 1) return 1; var w = 9; return (1 - (1 + w * k) * Math.exp(-w * k)) / (1 - (1 + w) * Math.exp(-w)); },
    // overshoot and settle (an underdamped spring): about f wobbles, dying out, exactly 1 at the end
    settle: function(k, f){ if (k <= 0) return 0; if (k >= 1) return 1; f = f || 1.4; return 1 - Math.exp(-5 * k) * Math.cos(k * Math.PI * f) * (1 - k); }
  };
  var Q = [], TR = [], DUR = 20;
  function reset(dur){ Q = []; TR = []; DUR = dur || DUR; }
  function cue(c){ Q.push(c); return c; }
  function declare(t0, t1, kind){ TR.push([+t0.toFixed(2), +t1.toFixed(2), kind]); }
  // ---- the camera: base framing, a drift that never stops, and named moves folded in order ----
  function rig(o){
    var base = [o.x, o.y, o.z], D = o.drift == null ? 1 : o.drift, moves = [], last = base.slice();
    function add(t0, d, x, y, z, kind, e){ var to = [x, y, z == null ? last[2] : z], m = { t0: t0, d: d, to: to, kind: kind, e: e };
      moves.push(m); var dz = to[2] - last[2];
      cue({ t: t0, k: 'move', d: Math.max(.4, d * .8), g: kind === 'pan' ? .26 : .34, dir: dz >= 0 ? 1 : -1, x: 255, x2: cl(255 + (x - last[0]) * 2, 40, 500), r: .25 });
      if (kind === 'pushThrough') { cue({ t: t0, k: 'swell', d: Math.max(.5, d), g: .4, x: 255 }); cue({ t: t0 + d * .55, k: 'snap', g: .3, p: 5, x: 255, r: .2 }); declare(t0, t0 + d, 'pushThrough'); }
      if (kind === 'matchMove') declare(t0, t0 + d, 'matchMove');
      last = to; return R; }
    var R = {
      moves: moves,
      pushIn: function(t0, d, x, y, z){ return add(t0, d, x, y, z, 'pushIn', 'settle'); },
      pan: function(t0, d, x, y){ return add(t0, d, x, y, null, 'pan', 'inOut3'); },
      pushThrough: function(t0, d, x, y, z){ return add(t0, d, x, y, z, 'pushThrough', 'expoInOut'); },
      matchMove: function(t0, d, x, y, z){ return add(t0, d, x, y, z, 'matchMove', 'inOut3'); },
      pull: function(t0, d, x, y, z){ return add(t0, d, x, y, z, 'pull', 'settle'); },
      // creep: a slow, steady push to the end of a beat (a held shot that still breathes: FLOW dead runs), no cue
      creep: function(t0, d, dz){ moves.push({ t0: t0, d: d, to: [last[0], last[1], last[2] * (1 + (dz || .08))], kind: 'creep', e: 'linear' }); last = moves[moves.length - 1].to; return R; },
      at: function(t){ var c = base.slice();
        moves.forEach(function(m){ var k = P(t, m.t0, m.t0 + m.d), e = m.e === 'settle' ? ease.settle(k, 1.2) : ease[m.e](k); if (k > 0) c = [mix(c[0], m.to[0], e), mix(c[1], m.to[1], e), mix(c[2], m.to[2], e)]; });
        // the drift: a slow sway and breathing zoom, so no stretch of the reel is ever still (FLOW: dead runs)
        c[0] += D * (Math.sin(t * .55) * 9 + Math.sin(t * 1.3 + 2) * 2.5); c[1] += D * (Math.sin(t * .41 + 1) * 11 + Math.sin(t * 1.1) * 3); c[2] *= 1 + D * (Math.sin(t * .33) * .012 + Math.sin(t * .9 + 1) * .004);
        return { x: c[0], y: c[1], z: c[2] }; },
      vel: function(t){ var a = R.at(t - .05), b = R.at(t + .05); return { vx: (b.x - a.x) * 10, vy: (b.y - a.y) * 10, vz: (b.z - a.z) * 10 }; },
      // world point -> screen point (the world is laid out at 540x960 and the camera centres (x, y) at (255, 480): the safe zone's middle)
      toScreen: function(c, x, y){ return [(x - c.x) * c.z + 255, (y - c.y) * c.z + 480]; },
      apply: function(world, t, tiltEl){ var c = R.at(t); world.style.transform = 'translate(' + (255 - c.x * c.z).toFixed(2) + 'px,' + (480 - c.y * c.z).toFixed(2) + 'px) scale(' + c.z.toFixed(4) + ')';
        if (tiltEl) { var v = R.vel(t); tiltEl.style.transform = 'perspective(1600px) rotateX(' + cl(v.vy * .02 + v.vz * 3, -5, 5).toFixed(2) + 'deg) rotateY(' + cl(-v.vx * .03, -5, 5).toFixed(2) + 'deg)'; }
        return c; }
    };
    return R;
  }
  // ---- transitions: declared once, drawn from k ----
  var CUE = { sharedElement: 'move', pushThrough: 'swell', morph: 'snap', wipeRestyle: 'swell' };
  function transition(kind, t0, d, sound){ declare(t0, t0 + d, kind);
    var s = sound === false ? null : sound || CUE[kind] || 'move';
    if (s === 'move') cue({ t: t0, k: 'move', d: Math.max(.4, d), g: .3, dir: 1, x: 255, x2: 255, r: .25 });
    else if (s === 'swell') cue({ t: t0, k: 'swell', d: Math.max(.5, d), g: .42, x: 255 });
    else if (s) cue({ t: t0, k: s, g: .35, p: 5, x: 255, r: .2 });
    if (kind !== 'sharedElement') cue({ t: t0 + d, k: 'snap', g: .3, p: 7, x: 255, r: .2 });
    var e = kind === 'pushThrough' ? ease.expoInOut : kind === 'sharedElement' ? function(k){ return ease.settle(k, 1.1); } : ease.inOut3;
    return function(t){ return e(P(t, t0, t0 + d)); }; }
  function box(el, b){ el.style.left = b.x.toFixed(2) + 'px'; el.style.top = b.y.toFixed(2) + 'px'; el.style.width = b.w.toFixed(2) + 'px'; el.style.height = b.h.toFixed(2) + 'px'; if (b.r != null) el.style.borderRadius = b.r.toFixed(2) + 'px'; }
  function lerpBox(a, b, k){ return { x: mix(a.x, b.x, k), y: mix(a.y, b.y, k), w: mix(a.w, b.w, k), h: mix(a.h, b.h, k), r: mix(a.r || 0, b.r || 0, cl(k)) }; }
  // sharedElement: the element glides and scales from layout a to layout b; it lifts (a shadow) in the middle of the glide
  function shared(el, a, b, k){ box(el, lerpBox(a, b, k)); var lift = Math.sin(cl(k) * Math.PI); el.style.boxShadow = '0 ' + (8 + lift * 22).toFixed(1) + 'px ' + (20 + lift * 40).toFixed(1) + 'px rgba(0,0,0,' + (.25 + lift * .2).toFixed(2) + ')'; }
  // pushThrough: the layer scales up past the camera and blurs out (dir -1: comes in from behind the camera instead)
  function pushThrough(el, k, dir){ var q = dir === -1 ? 1 - k : k; el.style.transform = 'scale(' + (1 + q * q * 2.4).toFixed(3) + ')'; el.style.opacity = (1 - P(q, .35, .9)).toFixed(3); el.style.filter = 'blur(' + (q * 10).toFixed(2) + 'px)'; }
  function rgb(h){ var n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function mixCol(a, b, k){ var x = rgb(a), y = rgb(b); return 'rgb(' + x.map(function(v, i){ return Math.round(mix(v, y[i], k)); }).join(',') + ')'; }
  // morph: a box becomes another box (position, size, corner radius and colour)
  function morph(el, a, b, k, colA, colB){ box(el, lerpBox(a, b, k)); if (colA) el.style.background = mixCol(colA, colB, k); }
  // wipeRestyle: the new-theme copy of a layer is revealed top to bottom (it sits over the old one); clip-path inset in px for the BAND check
  function wipe(el, k){ var h = el.offsetHeight || 1000; el.style.clipPath = k >= 1 ? 'none' : 'inset(0px 0px ' + ((1 - k) * h).toFixed(1) + 'px 0px)'; el.style.visibility = k > 0 ? 'visible' : 'hidden'; }
  // ---- text ----
  // rise: each word comes up from blur to sharp with a little overshoot at its own start time; gone (0 -> 1) blurs the line away, lifting it
  // only a little (it fades before it can leave the safe zone)
  function rise(spans, t, starts, gone){ gone = gone || 0;
    [].forEach.call(spans, function(sp, i){ var s = starts[i], k = ease.back(P(t, s, s + .34), 1.6);
      sp.style.filter = 'blur(' + ((1 - P(t, s, s + .24)) * 8 + gone * 6).toFixed(2) + 'px)'; sp.style.opacity = (cl((t - s) * 9) * (1 - gone) * (1 - gone)).toFixed(3); sp.style.transform = 'translateY(' + ((1 - k) * 44 - gone * 24).toFixed(2) + 'px)'; }); }
  // type: html (tags and entities allowed) typed from t0 to t1 with a caret that blinks when idle
  function typed(src, n){ var o = '', k = 0, open = [];
    for (var i = 0; i < src.length; i++) { if (src[i] === '<') { var e = src.indexOf('>', i), tag = src.slice(i, e + 1); o += tag; if (tag[1] === '/') open.pop(); else open.push(tag.match(/<(\w+)/)[1]); i = e; continue; }
      if (k >= n) break; if (src[i] === '&') { var e2 = src.indexOf(';', i); o += src.slice(i, e2 + 1); i = e2; } else o += src[i]; k++; }
    while (open.length) o += '</' + open.pop() + '>'; return o; }
  function type(el, html, t, t0, t1){ var N = html.replace(/<[^>]+>/g, '').replace(/&\w+;/g, '_').length, n = Math.floor(N * P(t, t0, t1)), busy = t >= t0 && t < t1 + .15;
    el.innerHTML = typed(html, n) + (t >= t0 - .3 ? '<span class="km-caret" style="opacity:' + (busy || Math.floor((t - t1) * 2.4) % 2 === 0 ? 1 : 0) + '"></span>' : ''); }
  function sweep(el, t, t0, d, col){ var k = ease.inOut3(P(t, t0, t0 + d)); el.style.backgroundImage = 'linear-gradient(' + col + ',' + col + ')'; el.style.backgroundRepeat = 'no-repeat'; el.style.backgroundSize = (k * 100).toFixed(1) + '% 100%'; }
  // leader: an SVG line drawn from the thing to its label, then the label fades up at the end of the line
  function leader(line, label, from, to, k){ var e = ease.out3(cl(k / .7)); line.setAttribute('x1', from[0]); line.setAttribute('y1', from[1]); line.setAttribute('x2', mix(from[0], to[0], e).toFixed(1)); line.setAttribute('y2', mix(from[1], to[1], e).toFixed(1));
    line.style.opacity = k > 0 ? 1 : 0; label.style.opacity = ease.out3(P(k, .55, 1)).toFixed(3); label.style.transform = 'translateY(' + ((1 - ease.back(P(k, .55, 1), 1.4)) * 10).toFixed(2) + 'px)'; }
  // ---- secondary motion ----
  function parallax(el, c, depth){ el.style.transform = 'translate(' + (-(c.x - 270) * depth).toFixed(2) + 'px,' + (-(c.y - 480) * depth).toFixed(2) + 'px) scale(' + (1 + (c.z - 1) * depth).toFixed(4) + ')'; }
  function stagger(els, t, t0, gap, d){ [].forEach.call(els, function(el, i){ var k = ease.settle(P(t, t0 + i * gap, t0 + i * gap + (d || .6)), 1.2);
    el.style.opacity = cl(k * 2.5).toFixed(3); el.style.transform = 'translateY(' + ((1 - k) * 44).toFixed(2) + 'px) scale(' + mix(.94, 1, k).toFixed(4) + ')'; }); }
  // squeeze: pressed in 0.12 s before the tap, popped past full size after it, settled by 0.5 s
  function squeeze(el, t, tap){ var press = win(t, tap - .12, tap + .06, .1), pop = t > tap ? Math.sin(P(t, tap, tap + .5) * Math.PI) * (1 - P(t, tap, tap + .5)) : 0;
    el.style.transform = 'scale(' + (1 - press * .07 + pop * .09).toFixed(4) + ')'; }
  function ripple(el, t, tap, x, y){ var k = P(t, tap, tap + .55); el.style.left = (x - 32) + 'px'; el.style.top = (y - 32) + 'px'; el.style.opacity = (k > 0 && k < 1 ? 1 - k : 0).toFixed(3); el.style.transform = 'scale(' + mix(.5, 2.6, ease.out3(k)).toFixed(3) + ')'; }
  function tap(t, x){ cue({ t: t, k: 'touch', g: .38, x: cl(x, 30, 510) }); cue({ t: t + .05, k: 'blip', g: .24, x: cl(x, 30, 510) }); }
  // ---- voice timings and subtitles ----
  var norm = function(w){ return w.toLowerCase().replace(/[^a-z0-9]/g, ''); };
  function voice(text, lead, words){ lead = lead == null ? .15 : lead; var T = text.split(/\s+/).filter(Boolean), W = [];
    if (words && words.length) { var j = 0; words.forEach(function(w){ var o = { w: w.w, s: w.s, e: w.e, d: w.w }; for (var k = j; k < Math.min(T.length, j + 4); k++) if (norm(T[k]) === norm(w.w)) { o.d = T[k]; j = k + 1; break; } W.push(o); }); }
    else { var t = .2; T.forEach(function(w){ var d = .14 + w.length * .03; W.push({ w: w, d: w, s: t, e: t + d }); t += d + (/[.?:,;!]$/.test(w) ? .32 : .06); }); }
    return { words: W, lead: lead, end: W.length ? W[W.length - 1].e : 0,
      at: function(word, nth){ var n = nth || 1; for (var i = 0; i < W.length; i++) if (norm(W[i].w) === norm(word) && --n === 0) return W[i].s - lead; return 99; },
      // sentence starts (minus the lead), and whole phrases of at most max words, split at a comma where it can
      starts: function(){ var o = []; W.forEach(function(w, i){ if (i === 0 || /[.?!]$/.test(W[i - 1].d)) o.push(w.s - lead); }); return o; },
      phrases: function(max){ max = max || 6; var PH = [], cur = [];
        W.forEach(function(w, i){ cur.push(i); if (/[.?!]$/.test(w.d) || i === W.length - 1) { while (cur.length > max) { var best = -1;
              cur.forEach(function(q, k){ if (/[,:;]$/.test(W[q].d) && k >= 1 && k < max && (best < 0 || k > best)) best = k; });
              if (best < 0) best = Math.min(max, Math.ceil(cur.length / 2)) - 1; PH.push(cur.slice(0, best + 1)); cur = cur.slice(best + 1); }
            if (cur.length) PH.push(cur); cur = []; } });
        return PH; } };
  }
  // subtitles: the phrase being spoken, each word sharpening as it is said; colour(word, i) -> a CSS colour (or null)
  function subs(capEl, t, V, PH, from, until, colour){ var W = V.words, L = V.lead, ph = null, html = '';
    for (var i = 0; i < PH.length; i++) if (t >= W[PH[i][0]].s - L - .05 && (i === PH.length - 1 || t < W[PH[i + 1][0]].s - L - .05)) ph = PH[i];
    if (ph && ph[0] >= from && t < until) ph.forEach(function(j){ var w = W[j], on = t >= w.s - L, k = ease.out3(P(t, w.s - L, w.s - L + .2)), c = colour ? colour(w.d, j) : null;
      html += '<span style="opacity:' + (on ? 1 : .32) + ';filter:blur(' + (on ? (1 - k) * 4 : 1.2).toFixed(2) + 'px);transform:translateY(' + ((1 - k) * 5).toFixed(2) + 'px)' + (c ? ';color:' + c : '') + '">' + w.d.replace(/</g, '') + '</span>'; });
    capEl.innerHTML = html; capEl.style.opacity = html ? 1 : 0; }
  // ---- the details format (owner, 8 Nov 2026: small UI motions in slow motion, each with its live easing curve and its CSS) ----
  // KM.curve(spec) -> { f(k), css, min, max }: spec = a kit ease name ('settle', 'spring', 'back', 'out3' ...), { bezier: [x1, y1, x2, y2] }
  //   (CSS cubic-bezier: y may leave 0-1 for an overshoot), { linear: [0, [.62, 18], 1.1, 1] } (CSS linear(): a value, or [value, percent];
  //   stops without a percent are spread evenly, as the spec does) or { keyframes: [[0, 1], [40, 1.3], [100, 1]] } (percent, value).
  //   KM.linearCss(f, n) writes any ease (a kit spring included) as a CSS linear() string, so the curve on screen is the curve in the code.
  function bezier(x1, y1, x2, y2){ var B = function(a, b, s){ return 3 * a * s * (1 - s) * (1 - s) + 3 * b * s * s * (1 - s) + s * s * s; };
    return function(k){ if (k <= 0) return 0; if (k >= 1) return 1; var lo = 0, hi = 1, s = k; for (var i = 0; i < 40; i++) { s = (lo + hi) / 2; if (B(x1, x2, s) < k) lo = s; else hi = s; } return B(y1, y2, s); }; }
  function stops(list){ var S = list.map(function(s){ return Array.isArray(s) ? { v: s[0], p: s[1] / 100 } : { v: s, p: null }; });
    if (S[0].p == null) S[0].p = 0; if (S[S.length - 1].p == null) S[S.length - 1].p = 1;
    for (var i = 1; i < S.length; i++) if (S[i].p == null) { var j = i; while (S[j].p == null) j++; for (var q = i; q < j; q++) S[q].p = S[i - 1].p + (S[j].p - S[i - 1].p) * (q - i + 1) / (j - i + 1); }
    for (var m = 1; m < S.length; m++) S[m].p = Math.max(S[m].p, S[m - 1].p);
    return function(k){ if (k <= S[0].p) return S[0].v; for (var i = 1; i < S.length; i++) if (k <= S[i].p) return S[i].p === S[i - 1].p ? S[i].v : mix(S[i - 1].v, S[i].v, (k - S[i - 1].p) / (S[i].p - S[i - 1].p)); return S[S.length - 1].v; }; }
  var num = function(v){ return (+v.toFixed(3)).toString().replace(/^0\./, '.').replace(/^-0\./, '-.'); };
  function linearCss(f, n){ n = n || 10; var o = []; for (var i = 0; i <= n; i++) o.push(i === 0 || i === n ? num(f(i / n)) : num(f(i / n)) + ' ' + Math.round(i / n * 100) + '%'); return 'linear(' + o.join(', ') + ')'; }
  function curve(spec){ var f, css;
    if (typeof spec === 'string') { f = ease[spec]; css = linearCss(f, 10); }
    else if (spec.bezier) { f = bezier.apply(null, spec.bezier); css = 'cubic-bezier(' + spec.bezier.map(num).join(', ') + ')'; }
    else if (spec.linear) { f = stops(spec.linear); css = 'linear(' + spec.linear.map(function(s){ return Array.isArray(s) ? num(s[0]) + ' ' + s[1] + '%' : num(s); }).join(', ') + ')'; }
    else { f = stops(spec.keyframes.map(function(s){ return [s[1], s[0]]; })); css = '@keyframes'; }
    var lo = 0, hi = 1; for (var i = 0; i <= 80; i++) { var v = f(i / 80); lo = Math.min(lo, v); hi = Math.max(hi, v); }
    return { f: f, css: css, min: lo, max: hi }; }
  // KM.timeScale(t0, t1, factor, ramp): a slow-motion stretch of the reel. The component's own clock, at(t) (seconds, 0 at t0), runs at
  //   1x before t0, eases down to factor over ramp, runs at factor, eases back to 1x by t1; the camera keeps reel time, so it never slows.
  //   on(t) 0 -> 1 (how slow it is, for the badge), real(c) = the reel time the component clock reaches c. Cues: a falling swell into the
  //   slow motion, a whoosh as it speeds back up.
  function timeScale(t0, t1, f, ramp){ ramp = ramp == null ? .25 : Math.min(ramp, (t1 - t0) / 2);
    var a1 = t0 + ramp, b0 = t1 - ramp, A1 = ramp * (1 + f) / 2, B0 = A1 + (b0 - a1) * f, B1 = B0 + ramp * (1 + f) / 2;
    cue({ t: a1, k: 'swell', d: .55, g: .3, x: 255 }); cue({ t: t1 - .05, k: 'whoosh', d: .4, g: .22 });
    var at = function(t){ if (t <= t0) return t - t0; if (t <= a1) { var u = t - t0; return u - (1 - f) * u * u / (2 * ramp); }
      if (t <= b0) return A1 + (t - a1) * f; if (t <= t1) { var w = t - b0; return B0 + f * w + (1 - f) * w * w / (2 * ramp); } return B1 + t - t1; };
    return { t0: t0, t1: t1, f: f, at: at,
      speed: function(t){ return t <= t0 || t >= t1 ? 1 : t < a1 ? mix(1, f, (t - t0) / ramp) : t > b0 ? mix(f, 1, (t - b0) / ramp) : f; },
      on: function(t){ return f >= 1 ? 0 : (1 - this.speed(t)) / (1 - f); },
      real: function(c){ var lo = t0 - 50, hi = t1 + 50; for (var i = 0; i < 50; i++) { var m = (lo + hi) / 2; if (at(m) < c) lo = m; else hi = m; } return hi; } }; }
  // KM.curveGraph(svg, spec, c0, d, o): the easing curve drawn live, synced to the element it describes: the curve draws itself behind a dot
  //   that rides it, on a time axis (0 to d, in the component's own seconds), with dashed guides at 0 and 1 and the dot's value on the left edge.
  //   o.clock(t) = the component's clock (a timeScale's at, or reel time when left out); o.real(c) = the reel time of clock c (for the cues).
  //   Returns { k(t), v(t), draw(t, alpha) }. Cues: a soft move while it draws, a snap when the dot lands.
  function curveGraph(svg, spec, c0, d, o){ o = o || {}; var C = curve(spec), clock = o.clock || function(t){ return t; }, real = o.real || function(c){ return c; };
    var W = +svg.getAttribute('width'), H = +svg.getAttribute('height'), pl = 6, pr = 10, pt = 10, pb = 22, lo = Math.min(0, C.min) - .06, hi = Math.max(1, C.max) + .06;
    var X = function(k){ return pl + k * (W - pl - pr); }, Y = function(v){ return pt + (hi - v) / (hi - lo) * (H - pt - pb); }, NS = 'http://www.w3.org/2000/svg';
    var mk = function(tag, at){ var e = document.createElementNS(NS, tag); for (var a in at) e.setAttribute(a, at[a]); svg.appendChild(e); return e; };
    svg.innerHTML = '';
    var g0 = mk('line', { x1: X(0), x2: X(1), y1: Y(0), y2: Y(0), class: 'cg-axis' }), g1 = mk('line', { x1: X(0), x2: X(1), y1: Y(1), y2: Y(1), class: 'cg-guide' });
    var full = '', N = 72; for (var i = 0; i <= N; i++) full += (i ? 'L' : 'M') + X(i / N).toFixed(1) + ' ' + Y(C.f(i / N)).toFixed(1);
    var ghost = mk('path', { d: full, class: 'cg-ghost' }), line = mk('path', { d: '', class: 'cg-line' }), hz = mk('line', { class: 'cg-h' }), dot = mk('circle', { r: 5.5, class: 'cg-dot' });
    var l0 = mk('text', { x: X(0), y: H - 5, class: 'cg-t' }), l1 = mk('text', { x: X(1), y: H - 5, class: 'cg-t', 'text-anchor': 'end' });
    l0.textContent = '0'; l1.textContent = Math.round(d * 1000) + ' ms';
    cue({ t: real(c0), k: 'move', d: Math.max(.4, real(c0 + d) - real(c0)), g: .16, dir: 1, x: 120, x2: 230, r: .2 }); cue({ t: real(c0 + d), k: 'snap', g: .22, p: 9, x: 230, r: .2 });
    var R = { css: C.css, f: C.f, k: function(t){ return cl((clock(t) - c0) / d); }, v: function(t){ return C.f(R.k(t)); },
      draw: function(t, alpha){ var k = R.k(t), p = '', n = Math.max(1, Math.round(N * k)); for (var i = 0; i <= n; i++) { var q = k * i / n; p += (i ? 'L' : 'M') + X(q).toFixed(1) + ' ' + Y(C.f(q)).toFixed(1); }
        line.setAttribute('d', p); var x = X(k), y = Y(C.f(k)); dot.setAttribute('cx', x.toFixed(1)); dot.setAttribute('cy', y.toFixed(1));
        hz.setAttribute('x1', X(0)); hz.setAttribute('x2', x.toFixed(1)); hz.setAttribute('y1', y.toFixed(1)); hz.setAttribute('y2', y.toFixed(1));
        dot.style.opacity = hz.style.opacity = clock(t) >= c0 - .05 ? 1 : 0; svg.style.opacity = alpha == null ? 1 : alpha; } };
    return R; }
  // KM.slowmoBadge(el, ts, label): a pill that pops in as the slow motion starts (a blip) and lets go as it ends; its dot pulses with the speed.
  function slowmoBadge(el, ts, label){ el.innerHTML = '<i></i><span>' + label + '</span>'; cue({ t: ts.t0 + .05, k: 'blip', g: .2, x: 430 });
    return function(t){ var on = ts.on(t), k = ease.back(P(t, ts.t0, ts.t0 + .35), 1.8) * (1 - ease.inOut3(P(t, ts.t1 - .2, ts.t1 + .1)));
      el.style.opacity = cl(k * 1.4).toFixed(3); el.style.transform = 'scale(' + mix(.7, 1, cl(k)).toFixed(3) + ')';
      el.firstChild.style.transform = 'scale(' + (1 + .35 * on * Math.max(0, Math.sin(t * 7))).toFixed(3) + ')'; }; }
  // KM.specChip(el, items, t0, d, kf): the numbers roll up from 0 (ticks as they count) and land; items = [{ label, v, unit, dp }];
  //   kf(t) -> 0-1 (optional) drives the roll instead of t0 + d, e.g. a curveGraph's k: the "ms" counter then is the component's own clock
  function specChip(el, items, t0, d, kf){ d = d || .55; for (var i = 0; i < 6; i++) cue({ t: t0 + i * d / 6, k: 'tick', g: .07, p: i * 2 }); cue({ t: t0 + d, k: 'pop', g: .22, p: 6 });
    el.innerHTML = items.map(function(it, i){ return '<div class="sc-r' + i + '">' + (it.label ? '<small>' + it.label + '</small>' : '') + '<b></b>' + (it.unit && it.unit[0] !== '%' ? ' ' : '') + '<span>' + (it.unit || '') + '</span></div>'; }).join('');
    var B = el.querySelectorAll('b');
    return function(t){ var k = kf ? kf(t) : P(t, t0, t0 + d);
      items.forEach(function(it, i){ var q = kf ? (i ? ease.out3(P(t, t0 + d, t0 + d + .4)) : k) : ease.out3(P(k, i * .2, Math.min(1, .7 + i * .2))); B[i].textContent = (it.v * q).toFixed(it.dp || 0); if (kf && i) B[i].parentNode.style.opacity = P(t, t0 + d - .05, t0 + d + .15).toFixed(3); });
      el.style.opacity = ease.out3(P(t, t0 - .15, t0 + .1)).toFixed(3); el.style.transform = 'translateY(' + ((1 - ease.back(P(t, t0 - .15, t0 + .3), 1.5)) * 10).toFixed(2) + 'px)'; }; }
  // KM.partProgress(el, parts): a segmented bar, one segment per part ([[t0, t1], ...]); the current one fills as its part plays (a click at each)
  function partProgress(el, parts){ el.innerHTML = parts.map(function(){ return '<i><b></b></i>'; }).join(''); var S = el.querySelectorAll('b');
    parts.forEach(function(p){ cue({ t: p[0], k: 'click', g: .08, p: 3 }); });
    return function(t){ parts.forEach(function(p, i){ var k = P(t, p[0], p[1]); S[i].style.transform = 'scaleX(' + k.toFixed(4) + ')'; S[i].parentNode.style.opacity = t >= p[0] && t < p[1] ? 1 : .6; }); }; }
  function publish(extra){ extra = extra || {}; window.TRANSITIONS = TR.slice().sort(function(a, b){ return a[0] - b[0]; });
    window.CUES = { dur: DUR, cues: Q.slice().sort(function(a, b){ return a.t - b.t; }), mix: extra.mix || { duck: 8 }, bed: extra.bed || { bpm: 240 / (DUR / 8), origin: 0, gain: .3, chords: [[45, 57, 64, 67, 71], [41, 57, 60, 64, 69], [43, 55, 62, 67, 71], [40, 55, 59, 64, 67]] } }; }
  return { cl: cl, P: P, mix: mix, win: win, ease: ease, reset: reset, cue: cue, declare: declare, rig: rig, transition: transition, shared: shared, pushThrough: pushThrough, morph: morph, wipe: wipe, mixCol: mixCol,
    rise: rise, type: type, typed: typed, sweep: sweep, leader: leader, parallax: parallax, stagger: stagger, squeeze: squeeze, ripple: ripple, tap: tap, voice: voice, subs: subs, publish: publish,
    curve: curve, linearCss: linearCss, timeScale: timeScale, curveGraph: curveGraph, slowmoBadge: slowmoBadge, specChip: specChip, partProgress: partProgress };
})();
