// ---- @webin20sec before/after split kit (scripts/explainer/kitsplit.js; task 16, 28 Nov 2026; todo 12 Nov, E23) ----
// Why: a fix reads fastest when the broken and the fixed version of the SAME component run side by side, in sync, so the eye sees the
// difference at the same moment. One call lays two panes in the hero zone (KM.ZONES.hero), labelled BEFORE / AFTER; the scene draws its
// component twice (once broken, once fixed) from the same t, so both run in step; at each fault time the BEFORE pane flinches (a red edge
// pulse and a small shake, with a low hit) so the misbehaving one is the one the eye lands on.
//   var sp = KM.split(host, { t0, d, out, build, faults, labels, y, h, gap, side })
//     host      a screen layer (not the camera's world): the panes sit at fixed screen places inside the safe zone
//     t0, d     the panes slide in from the sides at t0 over d s (default .5); declared as a transition 'split', with a swell
//     out       optional: they slide back out from out (over d); declared too
//     build     function(pane, broken) -> function(t, k): builds one copy of the component in the pane and returns its draw;
//               broken = true for BEFORE; k = the pane's entry (0..1), so the component can wait until it is in
//     faults    [times] when the BEFORE copy visibly misbehaves (the pane flinches; the component itself shows the bug)
//     labels    ['BEFORE', 'AFTER'] by default; y / h the panes' top and height in screen px (default: the hero zone)
//   sp.draw(t)  draws both panes and their components from t (call it in seek(t)); sp.panes = [beforeEl, afterEl]
// Inlined after the kitmotion block between the kitsplit markers (scripts/channel3/kit-inline.mjs); scenes without the markers are untouched.
(function(KM){
  var P = KM.P, E = KM.ease, cl = KM.cl, mix = KM.mix;
  KM.split = function(host, o){ o = o || {};
    var Z = KM.ZONES.hero, y = o.y == null ? Z[0] + 18 : o.y, h = o.h || (Z[1] - Z[0] - 36), gap = o.gap == null ? 14 : o.gap, side = o.side == null ? 22 : o.side,
        w = (540 - 2 * side - gap) / 2, t0 = o.t0 || 0, d = o.d || .5, out = o.out, faults = (o.faults || []).slice().sort(function(a, b){ return a - b; }),
        labels = o.labels || ['BEFORE', 'AFTER'], panes = [], draws = [], chips = [];
    KM.declare(t0, t0 + d, 'split'); KM.cue({ t: t0, k: 'swell', d: Math.max(.5, d), g: .36, x: 270 });
    if (out != null) { KM.declare(out, out + d, 'split'); KM.cue({ t: out, k: 'move', d: Math.max(.4, d), g: .26, dir: -1, x: 270, x2: 270, r: .25 }); }
    faults.forEach(function(ft, i){ KM.cue({ t: ft + .04, k: 'hit', g: .3 * Math.pow(.88, i), p: -.6, x: side + w / 2 }); });
    [0, 1].forEach(function(i){
      var pane = document.createElement('div'), body = document.createElement('div'), chip = document.createElement('div'), bad = i === 0;
      pane.className = 'km-split ' + (bad ? 'km-before' : 'km-after'); pane.setAttribute('data-key', bad ? 'before' : 'after');
      pane.style.cssText = 'position:absolute;top:' + y + 'px;left:' + (side + i * (w + gap)).toFixed(1) + 'px;width:' + w.toFixed(1) + 'px;height:' + h + 'px;' +
        'border-radius:22px;background:var(--glass,#17171b);box-shadow:0 18px 40px -18px rgba(0,0,0,.6),inset 0 0 0 1.5px ' + (bad ? 'rgba(255,95,109,.35)' : 'rgba(95,216,200,.35)') + ';opacity:0;will-change:transform,opacity';
      body.style.cssText = 'position:absolute;left:0;right:0;top:50px;bottom:0;overflow:hidden;border-radius:0 0 22px 22px';
      chip.textContent = labels[i];
      chip.style.cssText = 'position:absolute;left:14px;top:12px;padding:5px 11px;border-radius:999px;font:800 15px/1 var(--f,system-ui),sans-serif;letter-spacing:.08em;' +
        'color:' + (bad ? '#ffd9dc' : '#d3fff8') + ';background:' + (bad ? 'rgba(255,95,109,.24)' : 'rgba(95,216,200,.22)');
      pane.appendChild(chip); pane.appendChild(body); host.appendChild(pane);
      panes.push(pane); chips.push(chip); draws.push(o.build ? o.build(body, bad) : null);
    });
    // the flinch after a fault: 0 -> 1 -> 0 over 0.45 s (a quick rise, a slower settle)
    function flinch(t){ var f = 0; for (var i = 0; i < faults.length; i++) { var u = t - faults[i]; if (u >= 0 && u < .45) f = Math.max(f, u < .08 ? u / .08 : 1 - E.out3((u - .08) / .37)); } return f; }
    function draw(t){
      var kin = E.out3(P(t, t0, t0 + d)), kout = out == null ? 0 : E.inOut3(P(t, out, out + d)), k = kin * (1 - kout), f = flinch(t);
      panes.forEach(function(pane, i){ var dir = i === 0 ? -1 : 1, shake = i === 0 ? Math.sin(f * Math.PI * 3) * 5 * f : 0;
        pane.style.opacity = k.toFixed(3);
        pane.style.transform = 'translate(' + (dir * (1 - k) * 60 + shake).toFixed(2) + 'px,' + ((1 - k) * 14).toFixed(2) + 'px) scale(' + (.96 + .04 * k).toFixed(4) + ')';
        if (i === 0) pane.style.boxShadow = '0 18px 40px -18px rgba(0,0,0,.6),inset 0 0 0 ' + (1.5 + 2 * f).toFixed(2) + 'px rgba(255,95,109,' + (.35 + .55 * f).toFixed(3) + '),0 0 ' + (26 * f).toFixed(1) + 'px rgba(255,95,109,' + (.35 * f).toFixed(3) + ')';
        if (draws[i]) draws[i](t, k); });
    }
    return { draw: draw, panes: panes, chips: chips, width: w, height: h - 50 };
  };
})(KM);
