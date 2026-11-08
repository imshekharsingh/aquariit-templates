// ---- @webin20sec element sound + entrance variants (scripts/explainer/kitsfx.js; owner, 8 Nov 2026: "Each element should have a flow,
// whether it's a small, medium or large element on the screen. Every element's flow should have a compatible sound, low, medium or high
// pitch based on the need.") Part of the motion kit: inlined after kitmotion.js between the kitsfx begin and end markers (the starters
// carry both markers; node scripts/channel3/kit-inline.mjs <scene> fills them; npm run check fails on a stale copy). It extends KM:
//   KM.sfx(el, t, verb, o)     the element's sound, picked by its rendered size (layout box, transform-free): small (chips, icons, dots,
//                              under 4,000 px²) = a high blip; medium (buttons, cards, rows, under 45,000 px²) = a mid snap (enter, land) or
//                              touch (change, tap); large (panels, screens) = a low move with reverb. Panned by the element's x in its frame
//                              (the nearest [data-sfx-frame], else the page), pitched to the bed's chord at t (at publish). verb: enter |
//                              land | change | exit. o: { g (gain x), x, size: 'small'|'medium'|'large', sizeEl, mode: 'tree'|'self' }.
//   KM.sfxRun(els, t0, gap, verb, o)  a stagger as ONE pitched run (rising chord tones, gain falling, at most 6 notes), not a click storm
//   KM.mark(el, mode, why)     an animated element whose sound another kit piece already writes (the camera, the voice, a curve graph)
//   KM.enter(variant, k) / KM.leave(variant, k) -> { o, tf } (k 0..1 raw; eased inside): 'pop' (scale-pop) · 'slide' (slide-settle) ·
//     'unfold' · 'flip' · 'morph' (stretch out of a pill) · 'drop' (fall and settle); KM.VARIANTS; KM.variant(i) rotates them so neighbours
//     never move alike; KM.cascade(els, t, t0, gap, d, variant) (stagger-cascade: each element its own entrance, offset by gap)
//   KM.el(el, { t0, d, variant, t1, d1, out, verb, g }) -> h(t) = { o, tf }, h.apply(t, base): an entrance (and an exit at t1) with its sound
// Every registration marks the element (data-sfx = tree: it and its children; self: it alone), so the stills run can print
// "ELEMENT SOUND: n of m animated elements have a cue" (scripts/showreel/elsound.mjs; pass at 90%). Cues stay sparse: two sound cues of one
// kind closer than 70 ms merge into one (the element still counts), gains stay under the voice (the mix ducks them by 8 dB).
(function(KM){
  if (!KM || KM.sfx) return;
  var cl = KM.cl, P = KM.P, mix = KM.mix, E = KM.ease, REG = [], LAST = {}, PEND = [];
  var oReset = KM.reset, oPublish = KM.publish, oRig = KM.rig, oDepth = KM.depth, oSubs = KM.subs, oCut = KM.cutBelow, oBar = KM.partProgress, oCG = KM.curveGraph, oBadge = KM.slowmoBadge;
  KM.reset = function(d){ REG = []; LAST = {}; PEND = []; return oReset(d); };
  function mark(el, mode, why){ if (!el || !el.setAttribute) return el; if (el.getAttribute('data-sfx') !== 'tree') el.setAttribute('data-sfx', mode || 'tree'); if (REG.indexOf(el) < 0) REG.push(el); return el; }
  // the layout box (offset chain, transform-free) up to the element's frame (a panel the width of the screen) or the page
  function box(el){ var w, h, x = 0, y = 0, e = el;
    if (el instanceof SVGElement && !(el instanceof SVGSVGElement) && el.getBBox) { var bb; try { bb = el.getBBox(); } catch (er) { bb = { x: 0, y: 0, width: 20, height: 20 }; } w = bb.width; h = bb.height; x = bb.x; y = bb.y; e = el.ownerSVGElement; }
    else { w = el.offsetWidth || (el.getBoundingClientRect ? el.getBoundingClientRect().width : 0); h = el.offsetHeight || (el.getBoundingClientRect ? el.getBoundingClientRect().height : 0); }
    for (; e && e !== document.body && !(e.hasAttribute && e.hasAttribute('data-sfx-frame')); e = e.offsetParent) { x += e.offsetLeft || 0; y += e.offsetTop || 0; }
    return { x: x, y: y, w: w, h: h }; }
  function sizeOf(el){ var b = box(el), a = b.w * b.h; return a < 4000 ? 'small' : a < 45000 ? 'medium' : 'large'; }
  // a cue whose pitch is set at publish from the bed's chord at its time: reg = 'hi' (small, blip around A5-A6), 'blo' (a small exit, a blip an octave down), 'mid' (snap around A4-A5),
  // 'low' (touch around A3-A4); deg = which chord tone (a run climbs it)
  function tuned(c, reg, deg){ var k = c.k + (reg || ''); if (LAST[k] != null && Math.abs(LAST[k] - c.t) < .07) return null; LAST[k] = c.t;
    c._reg = reg; c._deg = deg || 0; KM.cue(c); if (reg) PEND.push(c); return c; }
  function sfx(el, t, verb, o){ o = o || {}; verb = verb || 'enter'; if (!el) return null; mark(el, o.mode || 'tree');
    var b = box(o.sizeEl || el), size = o.size || sizeOf(o.sizeEl || el), g = o.g == null ? 1 : o.g, x = o.x != null ? o.x : cl(b.x + b.w / 2, 30, 510), deg = o.deg || 0;
    if (size === 'small') return verb === 'exit' ? tuned({ t: t, k: 'blip', g: .07 * g, x: x, r: .15 }, 'blo', deg) : tuned({ t: t, k: 'blip', g: .13 * g, x: x, r: .12 }, 'hi', deg);
    if (size === 'medium') { if (verb === 'exit') return tuned({ t: t, k: 'move', d: .32, g: .1 * g, dir: -1, p: -.3, x: x, r: .2 });
      return verb === 'change' ? tuned({ t: t, k: 'touch', g: .26 * g, x: x, r: .15 }, 'low', deg) : tuned({ t: t, k: 'snap', g: .17 * g, x: x, r: .2 }, 'mid', deg); }
    return tuned({ t: t, k: 'move', d: verb === 'exit' ? .45 : .6, g: (verb === 'exit' ? .12 : .18) * g, dir: verb === 'exit' ? -1 : 1, p: -1, x: x, r: .38 }); }
  function sfxRun(els, t0, gap, verb, o){ o = o || {}; els = [].slice.call(els || []); if (!els.length) return;
    var size = o.size || sizeOf(els[0]), step = Math.max(1, Math.ceil(els.length / 6)), n = 0;
    els.forEach(function(el, i){ mark(el, o.mode || 'tree'); if (i % step) return;
      var t = t0 + i * gap, g = (o.g == null ? 1 : o.g) * Math.pow(.84, n), x = o.x != null ? o.x : null;
      sfx(el, t, verb, { g: g, x: x, size: size === 'large' ? 'medium' : size, deg: n, mode: o.mode }); n++; }); }
  // ---- entrance and exit variants (k raw 0..1, the ease is inside; tf = a transform to append) ----
  var V = {
    pop: function(k){ var e = E.back(k, 1.9); return { o: cl(k * 3.5), tf: ' scale(' + mix(.55, 1, e).toFixed(4) + ')' }; },
    slide: function(k){ var e = E.settle(k, 1.3); return { o: cl(k * 3), tf: ' translateY(' + ((1 - e) * 30).toFixed(2) + 'px)' }; },
    unfold: function(k){ var e = E.out3(k); return { o: cl(k * 2.5), tf: ' perspective(700px) rotateX(' + ((1 - e) * -78).toFixed(2) + 'deg) scaleY(' + mix(.6, 1, e).toFixed(4) + ')' }; },
    flip: function(k){ var e = E.settle(k, 1.1); return { o: cl(k * 4), tf: ' perspective(700px) rotateY(' + ((1 - e) * 84).toFixed(2) + 'deg)' }; },
    morph: function(k){ var e = E.spring(k), sx = mix(.18, 1, E.out3(cl(k * 1.4))), sy = mix(.08, 1, e); return { o: cl(k * 4), tf: ' scale(' + sx.toFixed(4) + ',' + sy.toFixed(4) + ')' }; },
    drop: function(k){ var e = E.settle(k, 1.6); return { o: cl(k * 3), tf: ' translateY(' + ((1 - e) * -34).toFixed(2) + 'px) rotate(' + ((1 - e) * -3).toFixed(2) + 'deg)' }; }
  };
  var VARIANTS = ['pop', 'slide', 'unfold', 'flip', 'morph', 'drop'];
  function enter(v, k){ k = cl(k); if (k >= 1) return { o: 1, tf: '' }; return (V[v] || V.slide)(k); }
  function leave(v, k){ k = cl(k); if (k <= 0) return { o: 1, tf: '' }; var r = (V[v] || V.slide)(1 - E.inOut3(k)); return { o: Math.min(r.o, 1 - k), tf: r.tf }; }
  function variant(i){ return VARIANTS[((i % VARIANTS.length) + VARIANTS.length) % VARIANTS.length]; }
  function cascade(els, t, t0, gap, d, v){ [].forEach.call(els, function(el, i){ var r = enter(v || 'pop', P(t, t0 + i * gap, t0 + i * gap + d)); el.style.opacity = r.o.toFixed(3); el.style.transform = r.tf; }); }
  function el(node, o){ var d = o.d || .5, d1 = o.d1 || .35, v = o.variant || 'slide', out = o.out || v;
    if (o.sound !== false) { sfx(node, o.t0, o.verb || 'enter', { g: o.g, mode: o.mode }); if (o.t1 != null) sfx(node, o.t1, 'exit', { g: o.g, mode: o.mode }); } else mark(node, o.mode);
    var h = function(t){ var a = enter(v, P(t, o.t0, o.t0 + d)); if (o.t1 == null) return a; var b = leave(out, P(t, o.t1, o.t1 + d1)); return t < o.t1 ? a : { o: Math.min(a.o, b.o), tf: b.tf }; };
    h.apply = function(t, base){ var r = h(t); node.style.opacity = r.o.toFixed(3); node.style.transform = (base || '') + r.tf; return r; };
    return h; }
  // ---- the kit pieces that already write a cue mark their element ----
  KM.rig = function(o){ var R = oRig(o), ap = R.apply; R.apply = function(w, t, tilt){ mark(w, 'self', 'camera'); if (tilt) mark(tilt, 'self', 'camera'); return ap.apply(R, arguments); }; return R; };
  KM.depth = function(node){ mark(node, 'self', 'camera'); return oDepth.apply(KM, arguments); };
  KM.subs = function(cap){ mark(cap, 'tree', 'voice'); return oSubs.apply(KM, arguments); };
  KM.cutBelow = function(vp, fe){ mark(vp, 'self', 'band'); if (fe) mark(fe, 'self', 'band'); return oCut.apply(KM, arguments); };
  if (oBar) KM.partProgress = function(node){ mark(node, 'tree', 'clicks'); return oBar.apply(KM, arguments); };
  if (oCG) KM.curveGraph = function(svg){ mark(svg, 'tree', 'move + snap'); return oCG.apply(KM, arguments); };
  if (oBadge) KM.slowmoBadge = function(node){ mark(node, 'tree', 'blip'); return oBadge.apply(KM, arguments); };
  // at publish: every tuned cue takes a chord tone of the bed at its time, in its register
  KM.publish = function(extra){ var r = oPublish(extra), C = window.CUES, bd = C && C.bed;
    if (bd && bd.chords) { var bar = 240 / bd.bpm, org = bd.origin || 0, RG = { hi: [79, 81, 92], blo: [67, 81, 79], mid: [69, 76, 81], low: [57, 62, 69] };
      PEND.forEach(function(c){ var ch = bd.chords[((Math.floor((c.t - org) / bar) % bd.chords.length) + bd.chords.length) % bd.chords.length], rg = RG[c._reg], ns = [];
        ch.forEach(function(m){ for (var q = m - 48; q <= rg[2]; q += 12) if (q >= rg[0] && ns.indexOf(q) < 0) ns.push(q); }); ns.sort(function(a, b){ return a - b; });
        var note = ns.length ? ns[c._deg % ns.length] : rg[1]; c.p = note - rg[1]; delete c._reg; delete c._deg; }); }
    window.ELEMENT_SOUND = { marked: REG.length }; return r; };
  KM.sfx = sfx; KM.sfxRun = sfxRun; KM.mark = mark; KM.enter = enter; KM.leave = leave; KM.VARIANTS = VARIANTS; KM.variant = variant; KM.cascade = cascade; KM.el = el; KM.sizeOf = sizeOf;
})(KM);
