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
  function decor(t){ var r = $('ringarc'); if (r) r.setAttribute('transform', 'rotate(' + (t * 9).toFixed(2) + ')'); var sp = $('spot'); if (sp) sp.style.opacity = (.85 + .15 * Math.sin(t * 1.3)).toFixed(3); }
  function tint(a, b){ var R = document.documentElement.style; R.setProperty('--tint', a); R.setProperty('--tint2', b || a); }
  function dial(t, steps){ decor(t); var f1 = steps.filter(function(s){ return s.n; })[0]; $('dial').style.opacity = f1 ? P(t, f1.t - .4, f1.t).toFixed(3) : 1; /* the dial waits for the first step (frame 0 says one thing) */ var cur = steps[0], N = steps.filter(function(s){ return s.n; }).length; steps.forEach(function(s){ if (t >= s.t) cur = s; });
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
  // measurement labels sit in small dark pills (premium pass, 21 Nov 2026)
  function label(id, x, y, txt, k, col, anchor){ var bg = svg(id + '-bg', 'rect'), e = svg(id, 'text'); if (bg.nextSibling !== e) OV.insertBefore(bg, e); e.setAttribute('x', x); e.setAttribute('y', y); e.setAttribute('fill', col || '#ffb35a'); e.setAttribute('font-family', 'Space Grotesk'); e.setAttribute('font-weight', 700); e.setAttribute('font-size', 19);
    e.setAttribute('text-anchor', anchor || 'start'); e.textContent = txt; e.style.opacity = cl(k).toFixed(3);
    var w = txt.length * 11 + 18, x0 = (anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w + 7 : x - 7); bg.setAttribute('x', x0); bg.setAttribute('y', y - 19); bg.setAttribute('width', w); bg.setAttribute('height', 28); bg.setAttribute('rx', 14);
    bg.setAttribute('fill', 'rgba(14,17,28,.88)'); bg.setAttribute('stroke', 'rgba(255,179,90,.45)'); bg.setAttribute('stroke-width', 1); bg.style.opacity = cl(k).toFixed(3); return e; }
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
    if (y >= 380 && y <= 420) y = 374;   // round 6: chips sit just above the design, never on its first line
    x = Math.max(36, Math.min(x, 464 - e.offsetWidth));   // and inside the safe zone whatever their width
    e.style.left = x + 'px'; e.style.top = y + 'px'; e.style.opacity = k.toFixed(3); e.style.transform = 'translateY(' + ((1 - k) * 10).toFixed(2) + 'px) scale(' + (.7 + .3 * s).toFixed(3) + ')'; return e; }
  // a sound for a chip / a guide / a snap / a measure, all from the kit's cue list (so every element that lands is heard)
  function snd(t, kind, x, g, p){ KM.cue({ t: t, k: kind, g: g || .16, p: p || 0, x: x || 270 }); }
  return { tint: tint, decor: decor, $: $, svg: svg, spring: spring, go: go, roll: roll, dial: dial, title: title, cursor: cursor, line: line, box: box, sel: sel, label: label, measure: measure, hmeasure: hmeasure, chip: chip, snd: snd };
})();
// the Turns Out colour world on the kit's dark theme: ink, amber light, a cool fill (so every reel shares the brand look)
KM.WORLDS.turnsout = { c: { ink: '#0b0d16', dim: '#9aa1b8', acc: '#ffb35a', red: '#ff6b6b', ctl: '#1f2538', raise: '#1a1f30', skel: '#151a28', pg: '#0b0d16', card: '#141827', on: '#0b0d16' },
  v: { glass: 'linear-gradient(160deg,#1a2036,#0e1120 60%,#1a1630)', frost: '#10131f', glow: 'rgba(255,179,90,.5)', soft: 'rgba(255,179,90,.16)', ring: 'rgba(255,179,90,.5)' },
  blooms: [['255,140,70', .30, 520, 160, 200, .18, .15, 0], ['90,110,255', .20, 480, 520, 640, .21, .17, 2], ['255,120,90', .16, 420, 460, 900, .15, .2, 4]] };
// ---- final-cut layer (owner, 21 Nov 2026: "amazingly defined animation, motion, flow, switch other elements ... with range of sound elements") ----
//   DT.KEY: the bed's chords (A minor family); DT.note(i) a pitch step from the scale so element sounds play in key
//   DT.S.*: one sound per design action, the same in every reel (the channel's sound vocabulary):
//     click(t, x) cursor press · drag(t, d, x, x2) a stereo move · snap(t, x, i) lands on a guide (pitched, rising with i) · land(t, x, i) an element arrives
//     swap(t, d, x, n) letters flip into a new font (paper flicks) · roll(t, d, x, n) numbers count (accelerating ticks) · tint(t, x) a colour change (shimmer)
//     stamp(t, x) a slam · rise(t, d) a swell into a fix · done(t, x) a fix lands (snap + blip chord + shimmer) · whoosh(t, x, r) · resolve(t) the payoff chord
//   DT.burst(id, x, y, t, t0, col) a spark burst where a fix lands · DT.flipChars(el, t, t0, d, A, B) letter-by-letter font switch (A/B = {f, c, ls})
//   DT.intro(board, t, d) the cold open: the design drops in, tilted, and settles; its children cascade in (opacity)
//   DT.bed(extra) -> the publish block: a soft pad in the channel's key, lifting into the payoff, ducking under the voice
(function(){
  var P = KM.P, mix = KM.mix, E = KM.ease, cl = KM.cl;
  var SC = [0, 2, 3, 5, 7, 9, 10, 12, 14, 15];   // A natural minor steps from the bed's root
  DT.note = function(i){ return SC[((i % SC.length) + SC.length) % SC.length]; };
  var c = function(o){ KM.cue(o); };
  // no drums (owner, 21 Nov 2026: "few sound elements are too much like drum sound ... chose better sound variations"): on the runner's sample pack
  // blip / pop are soft toms, hit / boom a bass drum, tap / touch / tick a hi-hat pedal, so the tuned and ticking parts stay synthesized (synth: true)
  // and the only recorded effects are the finger snap (snap, click), paper (rustle) and air (move, swish)
  var pl = function(t, x, i, g){ c({ t: t, k: 'blip', g: g || .13, p: DT.note(i || 0), x: x, synth: true }); };
  DT.S = {
    click: function(t, x){ c({ t: t, k: 'click', g: .12, x: x }); },
    drag: function(t, d, x, x2){ c({ t: t, k: 'move', d: d, g: .15, x: x, x2: x2 == null ? x : x2 }); },
    snap: function(t, x, i){ c({ t: t, k: 'snap', g: .16, x: x }); pl(t + .02, x, (i || 0) + 2, .12); },
    land: function(t, x, i){ pl(t, x, i || 0, .13); c({ t: t + .01, k: 'click', g: .05, x: x }); },
    swap: function(t, d, x, n){ n = n || 8; for (var i = 0; i < n; i++) c({ t: t + d * i / n, k: 'rustle', d: .06, g: .05, p: i % 5, x: x }); pl(t + d, x, 4, .11); },
    roll: function(t, d, x, n){ n = n || 10; for (var i = 0; i < n; i++) { var u = 1 - Math.pow(1 - i / n, 1.8); c({ t: t + d * u, k: 'tick', g: .06, p: i % 7, x: x, synth: true }); } },
    tint: function(t, x){ c({ t: t, k: 'shimmer', g: .14, x: x, r: .4 }); },
    stamp: function(t, x){ c({ t: t, k: 'snap', g: .24, x: x }); c({ t: t + .01, k: 'rustle', d: .12, g: .1, x: x }); pl(t + .03, x, 0, .1); pl(t + .03, x, 4, .08); },
    rise: function(t, d){ c({ t: t, k: 'swell', d: d || .6, g: .12 }); },
    done: function(t, x, i){ c({ t: t, k: 'snap', g: .14, x: x }); [0, 2, 4].forEach(function(s, j){ pl(t + .03 + j * .05, x, (i || 0) + s, .1); }); c({ t: t + .05, k: 'shimmer', g: .1, x: x, r: .5 }); },
    whoosh: function(t, x, r){ c({ t: t, k: 'swish', d: .35, g: .15, x: x || 270, r: r == null ? .3 : r }); },
    resolve: function(t){ c({ t: t - .5, k: 'swell', d: .5, g: .1 }); [0, 4, 7, 9, 11].forEach(function(s, j){ pl(t + j * .07, 200 + j * 40, s, .12); }); c({ t: t + .1, k: 'shimmer', g: .16, x: 270, r: .7 }); }
  };
  var BU = {};
  DT.burst = function(id, x, y, t, t0, col){ var host = DT.$('world'), b = BU[id]; if (!b) { b = []; for (var i = 0; i < 12; i++) { var e = document.createElement('i'); e.style.cssText = 'position:absolute;left:0;top:0;width:7px;height:7px;margin:-3.5px;border-radius:50%;pointer-events:none;z-index:29;opacity:0'; host.appendChild(e); b.push(e); } BU[id] = b; }
    var p = P(t, t0, t0 + .7); b.forEach(function(e, i){ var a = i / 12 * Math.PI * 2 + (i % 2) * .2, r = (i % 3 ? 54 : 78) * E.out3(p); e.style.background = col || '#ffb35a';
      e.style.transform = 'translate(' + (x + Math.cos(a) * r).toFixed(1) + 'px,' + (y + Math.sin(a) * r).toFixed(1) + 'px) scale(' + (1 - p * .6).toFixed(3) + ')'; e.style.opacity = (p > 0 && p < 1 ? 1 - p : 0).toFixed(3); }); };
  DT.flipChars = function(el, t, t0, d, A, B){ if (!el._ch) { var tx = el._txt || el.textContent; el._txt = tx; el.textContent = ''; el._ch = [];
      for (var i = 0; i < tx.length; i++) { var s = document.createElement('span'); s.textContent = tx[i]; s.style.display = 'inline-block'; s.style.whiteSpace = 'pre'; s.style.transformOrigin = '50% 60%'; el.appendChild(s); el._ch.push(s); } }
    var n = el._ch.length; el._ch.forEach(function(s, i){ var a = t0 + d * .65 * i / Math.max(1, n - 1), k = P(t, a, a + d * .35), on = k >= .5, st = on ? B : A;   // every letter finishes by t0 + d (owner, 21 Nov: the last letters froze mid-flip, raised off the line)
      s.style.font = st.f; s.style.color = st.c; s.style.letterSpacing = st.ls || 'normal';
      s.style.transform = k > 0 && k < 1 ? 'rotateX(' + (on ? (1 - k) * 2 * 90 : k * 2 * 90).toFixed(1) + 'deg) translateY(' + (Math.sin(Math.PI * k) * -4).toFixed(2) + 'px)' : 'none'; });
    return P(t, t0, t0 + d); };
  DT.intro = function(board, t, d){ d = d || .55; var k = E.settle(P(t, 0, d), 1.1), o = E.out3(P(t, 0, d * .6));
    board.style.transform = (board._tf || '') + ' perspective(1200px) rotateX(' + ((1 - k) * 18).toFixed(2) + 'deg) translateY(' + ((1 - k) * 60).toFixed(1) + 'px) scale(' + (.92 + .08 * k).toFixed(4) + ')';
    board.style.opacity = o.toFixed(3); var ch = board.children; for (var i = 0; i < ch.length; i++) { var q = P(t, .12 + i * .05, .4 + i * .05); if (q < 1) { ch[i].style.opacity = q.toFixed(3); ch[i]._io = 1; } else if (ch[i]._io) { ch[i].style.opacity = ''; ch[i]._io = 0; } } };
  DT.bed = function(lift){ return { bed: { bpm: 96, origin: 0, gain: .3, soft: true, lift: lift, chords: [[45, 57, 64, 69, 72], [41, 57, 60, 65, 69], [43, 55, 62, 67, 71], [40, 55, 59, 64, 67]] }, mix: { duck: 8, room: .5 } }; };
})();

// ---- round 6: the context stage, the hook, the dramatic score ----
//   DT.ctx()                 marks the scene as staged (hides the dark stage; the dark band holds the brand)
//   DT.mood(t, k)            the place: k 0 = problem (dim, grey, a little cold), 1 = lit (warm, full colour); #ctx .lit layers fade in with k
//   DT.sweep(t, t0)          a light sweep across the design as a fix lands
//   DT.hook(t, html, out)    frame 0: the claim slams in word by word over the problem (scale, blur, a small shake), leaves at out
//   DT.score(lift, fix)      the bed: tense minor chords until fix (s), then bright major ones, lifting into the payoff
//   DT.S.sting(t), DT.S.reveal(t) the opening sting (air + a tense plucked cluster) and the reveal (a riser ending on t, then a bright chord)
(function(){
  var P = KM.P, mix = KM.mix, E = KM.ease, cl = KM.cl;
  DT.ctx = function(){ document.body.classList.add('ctx'); };
  DT.mood = function(t, k, subj){ var e = DT.$('ctx'); if (!e) return; k = cl(k);
    (subj || []).forEach(function(b){ if (b) b.style.filter = 'grayscale(' + (.55 * (1 - k)).toFixed(3) + ') brightness(' + (.82 + .18 * k).toFixed(3) + ')'; });   // the design itself shares the mood
    e.style.filter = 'grayscale(' + (.75 * (1 - k)).toFixed(3) + ') brightness(' + (.55 + .45 * k).toFixed(3) + ') contrast(' + (.9 + .1 * k).toFixed(3) + ') hue-rotate(' + (-12 * (1 - k)).toFixed(1) + 'deg)';
    var L = e.querySelectorAll('.lit'); for (var i = 0; i < L.length; i++) L[i].style.opacity = k.toFixed(3); };
  DT.sweep = function(t, list){ var e = DT.$('sweep'), on = null; list.forEach(function(t0){ if (t >= t0 && t < t0 + .7) on = t0; });
    if (on == null) { e.style.opacity = 0; return; } var u = E.inOut3(P(t, on, on + .7)); e.style.opacity = Math.sin(Math.PI * u).toFixed(3); e.style.transform = 'translateX(' + (u * 900).toFixed(1) + 'px) skewX(-12deg)'; };
  DT.hook = function(t, html, out){ var e = DT.$('hook'); if (!e._w) { e.innerHTML = html; e._w = [].slice.call(e.querySelectorAll('i')); }
    var o = 1 - P(t, out - .25, out); e.style.opacity = o.toFixed(3); var sh = (1 - P(t, 0, .45)) * 3;
    e.style.transform = 'translate(' + (Math.sin(t * 61) * sh).toFixed(2) + 'px,' + (Math.cos(t * 47) * sh - 30 * P(t, out - .25, out)).toFixed(2) + 'px)';
    e._w.forEach(function(w, i){ var a = -.22 + i * .07, k = P(t, a, a + .22),   // the first word is fully there at frame 0 (owner, 21 Nov: frame 0 must already say it)
      s = E.back(k, 2.4); w.style.opacity = cl(k * 2).toFixed(3); w.style.visibility = k > 0 ? 'visible' : 'hidden'; w.style.transformOrigin = '0 70%'; w.style.transform = 'scale(' + (1.5 - .5 * s).toFixed(3) + ')'; w.style.filter = 'blur(' + ((1 - k) * 8).toFixed(2) + 'px)'; }); };
  DT.score = function(lift, fix){ var n = Math.ceil(fix / 2.5); var tense = [[45, 57, 60, 64], [41, 53, 60, 65], [44, 56, 59, 64], [45, 57, 60, 64]], bright = [[48, 60, 64, 67, 72], [43, 55, 62, 67, 71], [45, 57, 64, 69, 72], [41, 57, 60, 65, 69], [48, 60, 64, 67, 76]];
    var ch = []; for (var i = 0; i < n; i++) ch.push(tense[i % tense.length]); for (i = 0; i < 6; i++) ch.push(bright[i % bright.length]);
    return { bed: { bpm: 96, origin: 0, soft: true, lift: lift, chords: ch }, mix: { duck: 7, room: .6 } }; };
  var c = function(o){ KM.cue(o); }, pl = function(t, x, n, g){ c({ t: t, k: 'blip', g: g || .12, p: n, x: x, synth: true }); };
  DT.S.sting = function(t){ c({ t: t, k: 'swish', d: .4, g: .2, x: 270, r: .6 }); c({ t: t + .05, k: 'snap', g: .22, x: 270 }); [0, 1, 6, 7].forEach(function(n, j){ pl(t + .05 + j * .015, 200 + j * 50, n - 5, .13); }); c({ t: t + .1, k: 'shimmer', g: .08, x: 270, r: .7 }); };
  DT.S.reveal = function(t){ c({ t: t, k: 'riser', d: .9, g: .14 }); c({ t: t, k: 'snap', g: .2, x: 270 }); [0, 4, 7, 12].forEach(function(n, j){ pl(t + .02 + j * .03, 180 + j * 60, n, .13); }); c({ t: t + .05, k: 'shimmer', g: .16, x: 270, r: .6 }); };
})();

// ---- premium program, 24 Nov 2026: the before/after proof and the fix seen close ----
// Why: on resume and card-margins the fixed design is the only thing on the last frame; a viewer who joins late or sends the frame on
// cannot see what changed, and each fix is a small change on a small page. So:
//   DT.keep(board)             call once when the design is in its "before" state (after fonts, e.g. after a first seek): keeps a still copy
//   DT.proof(t, t0, o)         the payoff: at t0 the kept "before" flashes back over the design for o.flash (0.5 s) under a red BEFORE tag,
//                              then shrinks to a tilted thumbnail at the design's lower corner (o.x, o.y, o.s; its tag beside it, inside the safe zone) and stays, while
//                              the design itself is tagged AFTER: the last frame shows both. Returns 0..1 (the thumbnail's way down).
//   DT.S.flip(t)               its sound: paper back, paper forward, a bright snap
//   DT.close(CAM, t0, z, top)  a fix seen close: the camera goes in (z, default 1.1) before the fix lands and comes back after
(function(){
  var P = KM.P, mix = KM.mix, E = KM.ease, cl = KM.cl, WAS = null, TAG = null, TAG2 = null;
  DT.keep = function(board){ if (WAS) WAS.remove(); var cs = getComputedStyle(board), c = board.cloneNode(true); c.removeAttribute('id'); c.id = 'dt-was';
    // the copy carries its look inline and drops ids and classes, so no rule, selector or check (ALIGN, OVERLAP) takes it for the live design
    var src = board.querySelectorAll('*'), dst = c.querySelectorAll('*'), KEEP = ['position', 'left', 'top', 'right', 'bottom', 'width', 'height', 'display', 'whiteSpace', 'font', 'color', 'letterSpacing', 'lineHeight', 'textAlign',
      'background', 'border', 'borderRadius', 'padding', 'margin', 'boxSizing', 'transform', 'transformOrigin', 'boxShadow', 'opacity'];
    for (var i = 0; i < src.length; i++) { var q = getComputedStyle(src[i]), d = dst[i]; KEEP.forEach(function(k){ d.style[k] = q[k]; }); d.removeAttribute('class'); if (src[i].parentNode === board) d.style.opacity = src[i].id === 'stamp' ? '0' : '1'; d.removeAttribute('id'); }
    c.style.cssText = 'position:absolute;left:' + board.offsetLeft + 'px;top:' + board.offsetTop + 'px;width:' + board.offsetWidth + 'px;height:' + board.offsetHeight + 'px;background:' + cs.backgroundColor + ';background-image:' + cs.backgroundImage +
      ';border-radius:' + cs.borderRadius + ';overflow:hidden;transform-origin:0 0;opacity:0;z-index:27;pointer-events:none;box-shadow:0 18px 40px rgba(0,0,0,.5)';
    c.setAttribute('aria-hidden', 'true'); board.parentNode.appendChild(c); WAS = c; WAS._b = { x: board.offsetLeft, y: board.offsetTop, w: board.offsetWidth, h: board.offsetHeight };
    var mk = function(txt, col){ var e = document.createElement('div'); e.textContent = txt; e.style.cssText = 'position:absolute;left:0;top:0;padding:7px 12px;border-radius:9px;font:900 15px/1 var(--d);letter-spacing:.1em;color:#0b0d16;background:' + col + ';opacity:0;z-index:28;white-space:nowrap;box-shadow:0 8px 18px rgba(0,0,0,.4)'; board.parentNode.appendChild(e); return e; };
    if (!TAG) { TAG = mk('BEFORE', '#ff6b6b'); TAG2 = mk('AFTER', '#5ee0a0'); } };
  DT.proof = function(t, t0, o){ if (!WAS) return 0; o = o || {}; var b = WAS._b, fl = o.flash || .5, sx = o.x == null ? 44 : o.x, sy = o.y == null ? b.y + b.h + 26 : o.y, sc = o.s || .36;
    var on = P(t, t0, t0 + .07), k = E.inOut3(P(t, t0 + fl, t0 + fl + .55)), sh = (1 - P(t, t0, t0 + .25)) * 4 * (t >= t0 ? 1 : 0);
    WAS.style.opacity = on.toFixed(3); WAS.style.filter = 'grayscale(' + (.5 * k).toFixed(3) + ') brightness(' + (1 - .14 * k).toFixed(3) + ')';
    WAS.style.transform = 'translate(' + (mix(0, sx - b.x, k) + Math.sin(t * 70) * sh).toFixed(2) + 'px,' + mix(0, sy - b.y, k).toFixed(2) + 'px) rotate(' + (-5 * k).toFixed(2) + 'deg) scale(' + mix(1, sc, k).toFixed(4) + ')';
    var bx = mix(b.x + 14, o.tx == null ? sx + b.w * sc + 10 : o.tx, k), by = mix(b.y + b.h - 18, o.ty == null ? sy + 10 : o.ty, k);   // the tags sit on the design's lower edge: the chips own its top edge
    TAG.style.opacity = on.toFixed(3); TAG.style.transform = 'translate(' + bx.toFixed(1) + 'px,' + by.toFixed(1) + 'px) scale(' + (1 + .5 * (1 - E.out3(P(t, t0, t0 + .3)))).toFixed(3) + ')';
    var a = E.back(P(t, t0 + fl + .1, t0 + fl + .5), 2.2); TAG2.style.opacity = cl(a * 3).toFixed(3); TAG2.style.transform = 'translate(' + (b.x + b.w - 96).toFixed(1) + 'px,' + (b.y + b.h - 18).toFixed(1) + 'px) scale(' + (.6 + .4 * a).toFixed(3) + ')';
    return k; };
  DT.S.flip = function(t, fl){ fl = fl || .5; KM.cue({ t: t, k: 'rustle', d: .12, g: .14, x: 270 }); KM.cue({ t: t + .02, k: 'snap', g: .16, x: 200 }); KM.cue({ t: t + fl, k: 'rustle', d: .14, g: .12, x: 270 }); KM.cue({ t: t + fl + .05, k: 'swish', d: .4, g: .14, x: 160, r: .3 }); KM.cue({ t: t + fl + .5, k: 'click', g: .1, x: 120 }); };
  // (the zoom is anchored on the design's top edge, so the design grows down into the stage and never up into the words; slow enough to be a move, not a jump)
  DT.close = function(CAM, t0, z, top){ z = z || 1.1; top = top == null ? 396 : top; return CAM.pushIn(t0 - .9, .8, 270, top + (480 - top) / z, z).pull(t0 + .7, .7, 270, 490, 1); };
})();
