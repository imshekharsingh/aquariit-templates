// ---- Turns Out design-tutorial layer (scripts/channel3/design/core.js, 21 Nov 2026), on the web motion kit (KM) ----
//   DT.dial(t, steps)              the brand dial: steps [{t, n (0 = intro), label}] -> the ring fills fix by fix, "FIX n OF N"
//   DT.title(t, list)              the step title in the top zone: list [{t, html}] (each rises in, the old one leaves)
//   DT.cursor(t, keys)             a design-tool cursor: keys [[t, x, y, press 0/1], ...] (smooth between keys); returns {x, y, p}
//   DT.line(id, x1, y1, x2, y2, k, col, w, dash)   a line that draws from its start (k 0..1); DT.box(id, b, k, col, dash) a drawn rectangle
//   DT.sel(id, b, k)               a selection box with corner handles (the design app's own mark)
//   DT.measure(id, x, y1, y2, k, label, side)      a vertical bracket with a live label; DT.hmeasure(id, x1, x2, y, k, label)
//   DT.chip(id, html, x, y, k, cls) a property chip that pops in (k 0..1, 1..0 to leave)
//   DT.spring(t, t0, d) -> 0..1 with a small overshoot (KM.ease.settle); DT.go(t, t0, d) -> 0..1 eased in-out; DT.roll(a, b, k) -> rounded number
var DT = (function(){
  var $ = function(id){ return document.getElementById(id); }, P = KM.P, mix = KM.mix, E = KM.ease, cl = KM.cl, NS = 'http://www.w3.org/2000/svg', OV = null, MADE = {};
  function svg(id, tag){ OV = OV || $('ov'); if (MADE[id]) return MADE[id]; var e = document.createElementNS(NS, tag); e.setAttribute('id', 'dt-' + id); OV.appendChild(e); MADE[id] = e; return e; }
  function spring(t, t0, d){ return E.settle(P(t, t0, t0 + (d || .7)), 1.3); }
  function go(t, t0, d){ return E.inOut3(P(t, t0, t0 + (d || .5))); }
  function roll(a, b, k){ return Math.round(mix(a, b, cl(k))); }
  function dial(t, steps){ var cur = steps[0], N = steps.filter(function(s){ return s.n; }).length; steps.forEach(function(s){ if (t >= s.t) cur = s; });
    var i = steps.indexOf(cur), nx = steps[i + 1], f = nx ? cl((t - cur.t) / Math.max(.1, nx.t - cur.t)) : 1, done = steps.slice(0, i).filter(function(s){ return s.n; }).length;
    var frac = cur.n ? (done + E.out3(P(t, cur.t, cur.t + .6))) / N : (cur.end ? 1 : done / N);
    var a = -Math.PI / 2 + Math.max(.0001, frac) * Math.PI * 2 * .999, R = 28, arc = document.querySelector('#dial .arc');
    arc.setAttribute('d', 'M0 ' + -R + ' A' + R + ' ' + R + ' 0 ' + (frac > .5 ? 1 : 0) + ' 1 ' + (R * Math.cos(a)).toFixed(2) + ' ' + (R * Math.sin(a)).toFixed(2)); arc.style.opacity = frac > .001 ? 1 : 0;
    document.querySelector('#dial .n').textContent = cur.n ? cur.n : (cur.sym || '');
    var lb = document.querySelector('#dial .lb'), tx = cur.n ? (cur.word || 'FIX') + ' ' + cur.n + ' OF ' + N : (cur.label || ''); if (lb.textContent !== tx) lb.textContent = tx;
    var pop = E.back(P(t, cur.t, cur.t + .45), 2); document.querySelector('#dial svg').style.transform = 'scale(' + (i === 0 ? 1 : .8 + .2 * pop).toFixed(3) + ') rotate(' + ((1 - (i === 0 ? 1 : E.out3(P(t, cur.t, cur.t + .5)))) * -60).toFixed(1) + 'deg)'; }
  function title(t, list){ var el = $('ttl'), cur = null, nx = null; list.forEach(function(s, i){ if (t >= s.t) { cur = s; nx = list[i + 1] || null; } });
    if (!cur) { el.style.opacity = 0; return; } if (el.dataset.h !== cur.html) { el.innerHTML = cur.html; el.dataset.h = cur.html; }
    var k = E.out3(P(t, cur.t, cur.t + .4)), o = nx ? 1 - P(t, nx.t - .18, nx.t) : (cur.until ? 1 - P(t, cur.until - .2, cur.until) : 1);
    el.style.opacity = (k * o).toFixed(3); el.style.transform = 'translateY(' + ((1 - k) * 18).toFixed(2) + 'px)'; el.style.filter = 'blur(' + ((1 - k) * 4).toFixed(2) + 'px)'; }
  function cursor(t, keys){ var c = $('cur'); if (!keys.length || t < keys[0][0] - .3) { c.style.opacity = 0; return null; }
    var a = keys[0], b = keys[0]; for (var i = 0; i < keys.length; i++) { if (keys[i][0] <= t) { a = keys[i]; b = keys[i + 1] || keys[i]; } }
    var k = b === a ? 1 : E.inOut3(P(t, a[0], b[0])), x = mix(a[1], b[1], k), y = mix(a[2], b[2], k), p = b === a ? a[3] : (k < .5 ? a[3] : b[3]);
    var last = keys[keys.length - 1], o = P(t, keys[0][0] - .3, keys[0][0]) * (1 - P(t, last[0] + .4, last[0] + .7));
    c.style.opacity = o.toFixed(3); c.style.transform = 'translate(' + (x - 4).toFixed(2) + 'px,' + (y - 2).toFixed(2) + 'px) scale(' + (p ? .86 : 1) + ')'; return { x: x, y: y, p: p }; }
  function line(id, x1, y1, x2, y2, k, col, w, dash){ var e = svg(id, 'line'); k = cl(k); e.setAttribute('x1', x1); e.setAttribute('y1', y1); e.setAttribute('x2', mix(x1, x2, E.out3(k))); e.setAttribute('y2', mix(y1, y2, E.out3(k)));
    e.setAttribute('stroke', col || '#ffb35a'); e.setAttribute('stroke-width', w || 2); e.setAttribute('stroke-linecap', 'round'); if (dash) e.setAttribute('stroke-dasharray', dash); e.style.opacity = k > .001 ? 1 : 0; return e; }
  function box(id, b, k, col, dash, fill){ var e = svg(id, 'rect'); e.setAttribute('x', b.x); e.setAttribute('y', b.y); e.setAttribute('width', Math.max(0, b.w)); e.setAttribute('height', Math.max(0, b.h)); e.setAttribute('rx', b.r || 0);
    e.setAttribute('fill', fill || 'none'); e.setAttribute('stroke', col || '#ffb35a'); e.setAttribute('stroke-width', 2); if (dash) e.setAttribute('stroke-dasharray', dash); e.setAttribute('pathLength', 1);
    if (!dash) { e.style.strokeDasharray = '1 1'; e.style.strokeDashoffset = (1 - E.out3(cl(k))).toFixed(4); } e.style.opacity = k > .001 ? (dash ? cl(k) : 1) : 0; return e; }
  function sel(id, b, k){ box(id + '-r', b, k, '#7aa2ff'); var hs = [[b.x, b.y], [b.x + b.w, b.y], [b.x, b.y + b.h], [b.x + b.w, b.y + b.h]];
    hs.forEach(function(h, i){ var e = svg(id + '-h' + i, 'rect'), s = 9 * E.back(cl((k - .4) / .6), 2); e.setAttribute('x', h[0] - s / 2); e.setAttribute('y', h[1] - s / 2); e.setAttribute('width', Math.max(0, s)); e.setAttribute('height', Math.max(0, s)); e.setAttribute('fill', '#fff'); e.setAttribute('stroke', '#7aa2ff'); e.setAttribute('stroke-width', 2); e.style.opacity = k > .4 ? 1 : 0; }); }
  function label(id, x, y, txt, k, col, anchor){ var e = svg(id, 'text'); e.setAttribute('x', x); e.setAttribute('y', y); e.setAttribute('fill', col || '#ffb35a'); e.setAttribute('font-family', 'Space Grotesk'); e.setAttribute('font-weight', 700); e.setAttribute('font-size', 15);
    e.setAttribute('text-anchor', anchor || 'start'); e.textContent = txt; e.style.opacity = cl(k).toFixed(3); return e; }
  function measure(id, x, y1, y2, k, txt, side){ var s = side || 1, kk = E.out3(cl(k)), ym = (y1 + y2) / 2, h = (y2 - y1) / 2 * kk;
    line(id + 'm', x, ym, x, ym - h, k > .01 ? 1 : 0, '#ffb35a', 2); line(id + 'n', x, ym, x, ym + h, k > .01 ? 1 : 0, '#ffb35a', 2);
    line(id + 't', x - 6, ym - h, x + 6, ym - h, k > .01 ? 1 : 0, '#ffb35a', 2); line(id + 'b', x - 6, ym + h, x + 6, ym + h, k > .01 ? 1 : 0, '#ffb35a', 2);
    label(id + 'l', x + 12 * s, ym + 5, txt, P(k, .5, 1), '#ffb35a', s > 0 ? 'start' : 'end'); }
  function hmeasure(id, x1, x2, y, k, txt){ var kk = E.out3(cl(k)), xm = (x1 + x2) / 2, w = (x2 - x1) / 2 * kk;
    line(id + 'm', xm, y, xm - w, y, k > .01 ? 1 : 0, '#ffb35a', 2); line(id + 'n', xm, y, xm + w, y, k > .01 ? 1 : 0, '#ffb35a', 2);
    line(id + 'l', xm - w, y - 6, xm - w, y + 6, k > .01 ? 1 : 0, '#ffb35a', 2); line(id + 'r', xm + w, y - 6, xm + w, y + 6, k > .01 ? 1 : 0, '#ffb35a', 2);
    label(id + 't', xm, y - 10, txt, P(k, .5, 1), '#ffb35a', 'middle'); }
  var CH = {};
  function chip(id, html, x, y, k, cls){ var e = CH[id]; if (!e) { e = document.createElement('div'); e.className = 'chip' + (cls ? ' ' + cls : ''); $('world').appendChild(e); CH[id] = e; }
    if (e.dataset.h !== html) { e.innerHTML = html; e.dataset.h = html; } k = cl(k); var s = E.back(k, 2.2);
    e.style.left = x + 'px'; e.style.top = y + 'px'; e.style.opacity = k.toFixed(3); e.style.transform = 'translateY(' + ((1 - k) * 10).toFixed(2) + 'px) scale(' + (.7 + .3 * s).toFixed(3) + ')'; return e; }
  // a sound for a chip / a guide / a snap / a measure, all from the kit's cue list (so every element that lands is heard)
  function snd(t, kind, x, g, p){ KM.cue({ t: t, k: kind, g: g || .16, p: p || 0, x: x || 270 }); }
  return { $: $, svg: svg, spring: spring, go: go, roll: roll, dial: dial, title: title, cursor: cursor, line: line, box: box, sel: sel, label: label, measure: measure, hmeasure: hmeasure, chip: chip, snd: snd };
})();
// the Turns Out colour world on the kit's dark theme: ink, amber light, a cool fill (so every reel shares the brand look)
KM.WORLDS.turnsout = { c: { ink: '#0b0d16', dim: '#9aa1b8', acc: '#ffb35a', red: '#ff6b6b', ctl: '#1f2538', raise: '#1a1f30', skel: '#151a28', pg: '#0b0d16', card: '#141827', on: '#0b0d16' },
  v: { glass: 'linear-gradient(160deg,#1a2036,#0e1120 60%,#1a1630)', frost: '#10131f', glow: 'rgba(255,179,90,.5)', soft: 'rgba(255,179,90,.16)', ring: 'rgba(255,179,90,.5)' },
  blooms: [['255,140,70', .30, 520, 160, 200, .18, .15, 0], ['90,110,255', .20, 480, 520, 640, .21, .17, 2], ['255,120,90', .16, 420, 460, 900, .15, .2, 4]] };
