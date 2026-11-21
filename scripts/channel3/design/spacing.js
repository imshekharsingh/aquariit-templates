/*css:begin*/
#board{left:50px;top:408px;width:440px;height:372px;border-radius:18px;background:#f2ebdd}
.it{position:absolute;left:0;top:0;white-space:nowrap;transform-origin:0 50%}
.row{display:flex;justify-content:space-between;align-items:baseline}
.row .dots{overflow:hidden;color:#999;flex:none}
#foot{padding:6px 12px;border-radius:4px}
.sw{position:absolute;width:34px;height:34px;border-radius:10px;opacity:0;z-index:24;box-shadow:0 6px 16px rgba(0,0,0,.4)}
#scrub{left:150px;top:752px;width:240px;height:22px;opacity:0;z-index:26}
#scrub .tr{position:absolute;left:0;right:0;top:9px;height:4px;border-radius:2px;background:rgba(255,255,255,.25)}
#scrub .hd{position:absolute;top:0;width:22px;height:22px;margin-left:-11px;border-radius:50%;background:#ffb35a;box-shadow:0 0 0 4px rgba(255,179,90,.25)}
#scrub b{position:absolute;top:3px;font:700 12px var(--f);letter-spacing:.16em;color:#fff}
/*css:end*/
/*board:begin*/
<div id="board" class="board">
  <div class="it" id="i0">Kettle &amp; Crumb</div>
  <div class="it" id="i1">fresh every morning</div>
  <div class="it row" id="r0"><span class="nm">Flat white</span><span class="dots">&nbsp;......&nbsp;</span><span class="pr">180</span></div>
  <div class="it row" id="r1"><span class="nm">Masala chai</span><span class="dots">&nbsp;....&nbsp;</span><span class="pr">120</span></div>
  <div class="it row" id="r2"><span class="nm">Banana bread</span><span class="dots">&nbsp;.......&nbsp;</span><span class="pr">150</span></div>
  <div class="it row" id="r3"><span class="nm">Cold brew</span><span class="dots">&nbsp;...&nbsp;</span><span class="pr">200</span></div>
  <div class="it" id="foot">OPEN 8 TILL 8</div>
</div>
<div class="sw" id="s0" style="background:#a1342b"></div><div class="sw" id="s1" style="background:#2d5a8c"></div><div class="sw" id="s2" style="background:#7a3d9a"></div><div class="sw" id="s3" style="background:#e9c443"></div><div class="sw" id="s4" style="background:#333"></div>
<div id="scrub" class="a"><b style="right:252px">BEFORE</b><b style="left:252px">AFTER</b><div class="tr"></div><div class="hd"></div></div>
/*board:end*/
/*script:begin*/
(function(){
  var $ = DT.$, P = KM.P, mix = KM.mix, E = KM.ease, cl = KM.cl; KM.theme('dark', 'turnsout');
  var TEXT = "This menu looks cheap. Turns out, it's not the colours. Fix one: line every item up to one edge. Fix two: one font, in two weights. Fix three: double the space between groups. Same words. Now it looks twice the price.";
  var DUR = 18, BX = 50, BY = 408, BW = 440, V, PH, A = {}, CAM, W = {}, CUR = [];
  // the two looks of every line: A (cheap: centred, four fonts, cramped) and B (one edge, one font in two weights, room to breathe)
  var IT = {
    i0: { A: { f: "italic 700 34px 'Playfair Display'", c: '#a1342b', y: 20, j: 0 }, B: { f: "700 34px 'Space Grotesk'", c: '#1d1a16', y: 30 } },
    i1: { A: { f: "400 19px 'Pacifico'", c: '#7a3d9a', y: 64, j: 16 }, B: { f: "500 14px 'Space Grotesk'", c: '#8a7f70', y: 80, ls: '.2em', up: 1 } },
    r0: { A: { f: "400 20px 'Courier Prime'", c: '#333', y: 108, j: 12 }, B: { f: "500 23px 'Space Grotesk'", c: '#1d1a16', y: 138 } },
    r1: { A: { f: "400 20px 'Courier Prime'", c: '#333', y: 137, j: -10 }, B: { f: "500 23px 'Space Grotesk'", c: '#1d1a16', y: 182 } },
    r2: { A: { f: "400 20px 'Courier Prime'", c: '#333', y: 166, j: 16 }, B: { f: "500 23px 'Space Grotesk'", c: '#1d1a16', y: 226 } },
    r3: { A: { f: "400 20px 'Courier Prime'", c: '#333', y: 195, j: -6 }, B: { f: "500 23px 'Space Grotesk'", c: '#1d1a16', y: 270 } },
    foot: { A: { f: "400 23px 'Anton'", c: '#2d5a8c', y: 232, j: 4, bg: '#e9c443' }, B: { f: "700 16px 'Space Grotesk'", c: '#c4572a', y: 318, ls: '.16em', bg: 'rgba(233,196,67,0)' } } };
  var IDS = ['i0', 'i1', 'r0', 'r1', 'r2', 'r3', 'foot'], L = 38, R = 402;
  function font(el, s){ el.style.font = s.f; el.style.color = s.c; el.style.letterSpacing = s.ls || 'normal'; el.style.textTransform = s.up ? 'uppercase' : 'none'; }
  function build(){ IDS.forEach(function(id){ var el = $(id); font(el, IT[id].A); W[id] = el.offsetWidth; if (id === 'foot') el.style.background = IT[id].A.bg; }); }
  function at(w, n){ return V.at(w, n); }
  function anchors(words){
    V = KM.voice(TEXT, .12, words); PH = V.phrases(4); KM.reset(DUR);
    A.col = at('colours'); A.f1 = at('Fix'); A.edge = at('edge'); A.f2 = at('Fix', 2); A.weights = at('weights'); A.f3 = at('Fix', 3); A.dbl = at('double'); A.same = at('Same'); A.price = at('price'); A.end = Math.min(DUR - .2, V.end + .8);
    A.sw = A.col - .5;
    window.COVER = .6;
    CAM = KM.rig({ x: 255, y: 480, z: 1, drift: .5 }).pushIn(A.f1 + .1, 1.1, 250, 500, 1.04).pull(A.f2 + .2, 1, 255, 490, 1.02).pushIn(A.f3, .9, 255, 500, 1.03).pull(A.same - .1, .9, 255, 480, 1);
    var S = DT.S; S.whoosh(0, 270, .4); IDS.forEach(function(id, i){ S.land(.12 + i * .05, 270, i); });
    // the colours beat: five swatches pop out of the menu (a rising run), then a strike: it's not them
    for (var i = 0; i < 5; i++) S.land(A.sw + i * .09, 330 + i * 30, i + 2); S.stamp(A.col + .35, 400);
    // fix one: the cursor drags a marquee over every line, a guide drops on the edge, each line snaps to it (a rising arpeggio)
    S.rise(A.f1 - .5, .5); S.click(A.f1 + .15, 96); S.drag(A.f1 + .15, .55, 96, 440); S.whoosh(A.edge - .05, 106, .2);
    A.snap = IDS.map(function(id, i){ return A.edge + .15 + i * .1; }); A.snap.forEach(function(t0, i){ S.snap(t0 + .18, 106, i); });
    A.d1 = A.snap[6] + .45; S.done(A.d1, 270, 0);
    // fix two: a scan line sweeps the menu; each line flips letter by letter into the one font
    A.scan = A.f2 + .35; S.rise(A.f2 - .1, .45); IDS.forEach(function(id, i){ S.swap(A.scan + .1 + i * .13, .4, 270, 6); }); S.land(A.f2 + .3, 400, 4); S.roll(A.scan, 1.1, 400, 4); S.land(A.weights, 400, 6);
    A.d2 = A.scan + 1.25; S.done(A.d2, 270, 2);
    // fix three: the brackets measure the gaps and roll from 8 to 22 px while the groups spring apart
    S.rise(A.f3 - .1, .4); S.roll(A.dbl, .6, 440, 9); S.drag(A.dbl + .1, .6, 255, 255); A.d3 = A.dbl + .85; S.done(A.d3, 270, 4);
    // the scrub: before and after, back and forth once, then the verdict chord
    S.whoosh(A.same, 200, .5); S.whoosh(A.same + .7, 340, .5); S.tint(A.same + 1.2, 270); S.resolve(A.price - .1);
    // ALIGN (owner, 21 Nov 2026: "Doesn't look aligned"): on the final frame every line starts on one edge, the prices end on one edge, every letter sits on its line
    window.ALIGN = [{ at: A.end - .05, sel: '#i0 > span:first-child, #i1 > span:first-child, .row .nm > span:first-child, #foot > span:first-child', edge: 'left', why: 'every line starts on one edge' },
      { at: A.end - .05, sel: '.row .pr', edge: 'right', why: 'the prices end on one edge' },
      { at: A.end - .05, sel: 'span', each: '#i0, #i1, .row .nm, .row .pr, #foot', edge: 'bottom', why: 'every letter on its line' }];
    window.HOLDS = [[A.end, DUR]];
    KM.publish(DT.bed(A.same));
  }
  // progress of each fix (springs), and the scrub that replays before -> after once on "Same words"
  function state(t){ var k1 = DT.spring(t, A.edge + .1, .8), k2 = P(t, A.scan, A.scan + 1.1), k3 = DT.spring(t, A.dbl + .05, .8);
    var sc = 1; if (t >= A.same && t < A.same + 1.5) { var u = (t - A.same) / 1.5; sc = u < .45 ? 1 - E.inOut3(u / .45) : E.inOut3((u - .45) / .55); }
    return { k1: k1 * sc, k2: k2 * (sc > .5 || t < A.same ? 1 : sc * 2), k3: k3 * sc, sc: sc }; }
  function paint(t, S){
    IDS.forEach(function(id, i){ var el = $(id), a = IT[id].A, b = IT[id].B, row = id[0] === 'r';
      var ka = cl((S.k1 - i * .03) / (1 - 6 * .03)), kf = cl((S.k2 * 1.3 - i * .13) / .25), ks = S.k3;
      // fix two: each line flips into the one font letter by letter as the scan passes (vt: the switch's own clock, so the scrub can run it backwards)
      var t0f = A.scan + .1 + i * .13, vt = t0f + kf * .45; font(el, kf >= .5 ? b : a); var fl = 0;
      if (row) { DT.flipChars(el.querySelector('.nm'), vt, t0f, .45, a, b); DT.flipChars(el.querySelector('.pr'), vt, t0f, .45, a, { f: b.f.replace('500', '700'), c: b.c }); }
      else DT.flipChars(el, vt, t0f, .45, a, b);
      var wA = W[id], xA = (BW - wA) / 2 + (a.j || 0), x = mix(xA, L, ka);
      if (row) { var ww = mix(wA, R - L, ka); el.style.width = ww.toFixed(1) + 'px'; el.querySelector('.dots').style.opacity = (1 - ka).toFixed(3); el.querySelector('.dots').style.maxWidth = (60 * (1 - ka)).toFixed(1) + 'px';
      }
      if (id === 'foot') x -= 12 * ka;   // the badge's own padding: its text lines up with the edge once the badge is gone
      var y = mix(a.y, b.y, ks); el.style.transform = 'translate(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px) scale(' + (1 + .05 * fl) + ')';
      if (id === 'foot') el.style.background = kf >= 1 ? b.bg : a.bg; }); }
  function seek(t){
    t = Math.max(0, Math.min(DUR, t)); var c = CAM.apply($('world'), t, null); KM.lights(t, c);
    DT.intro($('board'), t, .55); var S = state(t); paint(t, S);
    // each fix lands with a spark burst and a breath of the whole menu
    [[A.d1, BX + L, BY + 150], [A.d2, BX + BW / 2, BY + 170], [A.d3, BX + BW - 20, BY + 200]].forEach(function(d, i){ DT.burst('b' + i, d[1], d[2], t, d[0], '#ffb35a'); });
    var br = Math.max(Math.sin(Math.PI * P(t, A.d1, A.d1 + .35)), Math.sin(Math.PI * P(t, A.d2, A.d2 + .35)), Math.sin(Math.PI * P(t, A.d3, A.d3 + .35)));
    if (t > .6) $('board').style.transform = 'scale(' + (1 + .015 * br).toFixed(4) + ')'; $('board').style.boxShadow = '0 30px 70px rgba(0,0,0,.55),0 0 0 ' + (3 * br).toFixed(1) + 'px rgba(255,179,90,.55)';
    // the colour swatches: out of the menu, a strike through them (it's not the colours), back in
    for (var i = 0; i < 5; i++) { var s = $('s' + i), k = E.back(P(t, A.sw + i * .09, A.sw + i * .09 + .4), 2), o = P(t, A.sw + i * .09, A.sw + i * .09 + .2) * (1 - P(t, A.f1 - .4, A.f1 - .1));
      s.style.opacity = o.toFixed(3); s.style.left = (150 + i * 50).toFixed(1) + 'px'; s.style.top = mix(560, 470, k).toFixed(1) + 'px'; s.style.transform = 'rotate(' + ((i - 2) * 6 * k).toFixed(1) + 'deg) scale(' + (.6 + .4 * k).toFixed(3) + ')'; }
    DT.line('strike', 140, 506, 400, 470, P(t, A.col + .3, A.col + .6) * (1 - P(t, A.f1 - .4, A.f1 - .1)), '#ff6b6b', 5);
    DT.chip('col', 'NOT THE <b>COLOURS</b>', 300, 530, P(t, A.col + .45, A.col + .75) - P(t, A.f1 - .4, A.f1 - .1), 'r');
    // fix one: marquee, then the guide, then the ragged left edges (red ticks) straighten into one amber line
    var m = P(t, A.f1 + .15, A.f1 + .7), mo = 1 - P(t, A.f1 + 1.1, A.f1 + 1.4);
    DT.sel('marq', { x: 76, y: 418, w: 394 * E.out3(m), h: 272 * E.out3(m) }, m > 0 ? mo : 0);
    var g = P(t, A.edge - .1, A.edge + .3) * (1 - P(t, A.f2 + .2, A.f2 + .6));
    DT.line('guide', BX + L, 400, BX + L, 780, g, '#ffb35a', 2, '6 5');
    IDS.forEach(function(id, i){ var a = IT[id].A, xA = (BW - W[id]) / 2 + (a.j || 0), x = BX + mix(xA, L, cl((S.k1 - i * .03) / (1 - 6 * .03))), y = BY + mix(a.y, IT[id].B.y, S.k3) + 4;
      var on = P(t, A.f1 + .5, A.f1 + .8) * (1 - P(t, A.f2 + .2, A.f2 + .5)), ok = cl((S.k1 - i * .03) / (1 - 6 * .03));
      DT.line('tick' + i, x - 6, y, x - 6, y + 22, on, ok > .98 ? '#ffb35a' : '#ff6b6b', 3); });
    DT.chip('c1', 'ALIGN <b>LEFT</b> · 1 EDGE', 236, 394, P(t, A.edge, A.edge + .3) - P(t, A.f2 - .1, A.f2 + .2));
    // fix two: the scan line, then the font count rolls 4 -> 1 and the weights chip
    var sk = P(t, A.scan, A.scan + 1.1); DT.line('scan', BX + 4, BY + 10 + sk * 340, BX + BW - 4, BY + 10 + sk * 340, sk > 0 && sk < 1 ? 1 : 0, '#ffb35a', 3);
    DT.chip('c2', 'FONTS <b>' + DT.roll(4, 1, P(t, A.scan, A.scan + 1.1)) + '</b>', 330, 396, P(t, A.f2 + .2, A.f2 + .5) - P(t, A.f3 - .1, A.f3 + .2));
    DT.chip('c2b', 'WEIGHTS <b>2</b>', 330, 440, P(t, A.weights, A.weights + .3) - P(t, A.f3 - .1, A.f3 + .2));
    // fix three: two brackets measure the gaps between groups and roll 8 -> 24 px as the groups move apart
    var mk = P(t, A.f3 + .2, A.f3 + .6) * (1 - P(t, A.same - .3, A.same)), gp = DT.roll(8, 24, P(t, A.dbl, A.dbl + .6));
    var y1 = BY + mix(IT.i1.A.y + 20, IT.i1.B.y + 16, S.k3), y2 = BY + mix(IT.r0.A.y, IT.r0.B.y, S.k3), y3 = BY + mix(IT.r3.A.y + 22, IT.r3.B.y + 24, S.k3), y4 = BY + mix(IT.foot.A.y, IT.foot.B.y, S.k3);
    DT.measure('g1', BX + BW - 14, y1, y2, mk, gp + ' px', -1); DT.measure('g2', BX + BW - 14, y3, y4, mk, gp + ' px', -1);
    DT.chip('c3', 'SPACE <b>×2</b>', 360, 396, P(t, A.dbl + .5, A.dbl + .8) - P(t, A.same - .3, A.same));
    // the scrub bar: before <-> after once, then the verdict
    var so = P(t, A.same - .2, A.same + .1) * (1 - P(t, A.price - .3, A.price)); $('scrub').style.opacity = so.toFixed(3); $('scrub').querySelector('.hd').style.left = (S.sc * 100).toFixed(1) + '%';
    DT.chip('win', 'LOOKS <b>2× THE PRICE</b>', 150, 396, P(t, A.price - .1, A.price + .25), 'g');
    DT.cursor(t, CUR);
    DT.dial(t, [{ t: 0, sym: '3', label: '3 FIXES' }, { t: A.f1, n: 1 }, { t: A.f2, n: 2 }, { t: A.f3, n: 3 }, { t: A.same, end: 1, sym: '✓', label: 'SAME WORDS' }]);
    DT.title(t, [{ t: 0, html: 'Why does this menu look <em>cheap</em>?' }, { t: A.f1, html: 'Fix 1 · <em>one edge</em>' }, { t: A.f2, html: 'Fix 2 · <em>one font</em>' }, { t: A.f3, html: 'Fix 3 · <em>double the space</em>' }, { t: A.same, html: 'Same words. <em>Twice the price.</em>' }]);
    KM.subs($('cap'), t, V, PH, 0, A.end, function(w){ return /^(cheap|colours|edge|font|weights|double|space|price)/i.test(w) ? 'var(--amb)' : null; });
  }
  window.setVoice = function(v){ if (v && v.words && v.words.length) anchors(v.words); };
  window.seek = seek; window.DURATION = DUR;
  Promise.all(["italic 700 34px 'Playfair Display'", "400 19px 'Pacifico'", "400 20px 'Courier Prime'", "400 23px 'Anton'", "700 34px 'Space Grotesk'", "500 23px 'Space Grotesk'", "900 31px 'Unbounded'"].map(function(f){ return document.fonts.load(f); }))
    .then(function(){ build(); anchors(); seek(+(new URLSearchParams(location.search).get('t') || 0)); document.documentElement.dataset.ready = 1; });
})();
/*script:end*/
