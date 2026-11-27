/*css:begin*/
.rul{position:absolute;width:24px;border-radius:6px;background:repeating-linear-gradient(180deg,rgba(24,26,36,.9) 0 2px,transparent 2px 12px) left/9px 100% no-repeat,repeating-linear-gradient(180deg,rgba(24,26,36,.75) 0 2px,transparent 2px 60px) left/16px 100% no-repeat,linear-gradient(90deg,#ece7dd,#dcd5c7);box-shadow:0 10px 26px rgba(0,0,0,.35);z-index:1}
.rul.r{transform:scaleX(-1)}
#board{left:66px;top:424px;width:408px;height:344px;border-radius:6px;background:linear-gradient(170deg,#f7ece6,#efdcd3)}
#pt{position:absolute;left:0;top:22px;width:408px;text-align:center;font:700 26px 'Space Grotesk';color:#3b2a2a;letter-spacing:.02em}
#ps{position:absolute;left:0;top:58px;width:408px;text-align:center;font:500 13px 'Space Grotesk';color:#a07a6e;letter-spacing:.24em}
.nm,.pr{position:absolute;left:0;top:0;white-space:nowrap;font:500 22px 'Space Grotesk';color:#3b2a2a}
.pr{font-weight:700}
.ld{position:absolute;left:0;top:0;height:2px;background:radial-gradient(circle,#b89a8f 1.2px,transparent 1.6px) 0 0/8px 2px repeat-x;transform-origin:0 50%}
#fern{position:absolute;left:24px;top:18px;width:40px;height:44px;background:radial-gradient(40% 60% at 30% 50%,#6f9a6a,transparent 70%),radial-gradient(40% 60% at 70% 40%,#86b07e,transparent 70%);transform-origin:50% 100%}
/*css:end*/
/*board:begin*/
<div class="rul" style="left:8px;top:428px;height:246px"></div><div class="rul r" style="left:508px;top:428px;height:246px"></div>
<div id="board" class="board">
  <div id="fern"></div>
  <div id="pt">Studio Fern</div>
  <div id="ps">PRICE LIST</div>
  <div class="ld" id="l0"></div><div class="ld" id="l1"></div><div class="ld" id="l2"></div><div class="ld" id="l3"></div><div class="ld" id="l4"></div><div class="ld" id="l5"></div>
  <div class="nm" id="n0">Haircut</div><div class="pr" id="p0">450</div>
  <div class="nm" id="n1">Trim</div><div class="pr" id="p1">110</div>
  <div class="nm" id="n2">Colour</div><div class="pr" id="p2">1,800</div>
  <div class="nm" id="n3">Blow-dry</div><div class="pr" id="p3">300</div>
  <div class="nm" id="n4">Beard</div><div class="pr" id="p4">100</div>
  <div class="nm" id="n5">Kids' cut</div><div class="pr" id="p5">250</div>
</div>
/*board:end*/
/*script:begin*/
(function(){
  var $ = DT.$, P = KM.P, mix = KM.mix, E = KM.ease, cl = KM.cl; KM.theme('dark', 'turnsout'); DT.ctx(); DT.tint('#ff9ab0', '#ffb35a');
  var TEXT = "These prices are hard to compare. They jump around. Turns out, numbers need one edge. First, align them to the right. Next, use digits of one width. Then add dots to each name. Now the cheapest stands out.";
  var DUR = 19.2, BX = 66, BY = 424, W = 408, L = 32, R = 376, Y0 = 90, DY = 36, V, PH, A = {}, CAM, N = 6;   // rows are plain centred (no extra scatter: B1, a believable before)
  function at(w, n){ return V.at(w, n); }
  function anchors(words){
    V = KM.voice(TEXT, .12, words); PH = V.phrases(4); KM.reset(DUR);
    A.hook = at('They') - .1; A.jump = at('jump'); A.turns = at('Turns'); A.up = at('edge'); A.f1 = at('First'); A.edge = at('align'); A.f2 = at('Next'); A.digits = at('digits'); A.f3 = at('Then'); A.dots = at('dots');
    A.spot = at('Now'); A.cheap = at('cheapest'); A.proof = A.cheap + 1.12; A.e1 = A.proof + 1.2; A.e2 = A.e1 + .9; A.e3 = A.e2 + 1.2; A.e4 = A.e3 + 1.2; A.end = Math.min(DUR - .2, A.e4 + .8);
    window.COVER = .6;
    var S = DT.S; S.sting(0); [.35, .65].forEach(function(t0, i){ S.land(t0 + .05, 270, i + 1); KM.cue({ t: t0, k: 'tick', g: .08, p: i, x: 270, synth: true }); }); S.whoosh(0, 270, .4);
    for (var i = 0; i < 6; i++) KM.cue({ t: A.jump - .2 + i * .1, k: 'tick', g: .07, p: (i * 3) % 7, x: 200 + (i % 2) * 140, synth: true }); S.tint(A.up, 270);
    S.rise(A.f1 - .4, .45); S.drag(A.edge - .2, .5, 270, 440); for (i = 0; i < N; i++) S.snap(A.edge + .15 + i * .07, 440, i); A.d1 = A.edge + .7; S.done(A.d1, 400, 0);
    S.rise(A.f2 - .1, .4); S.swap(A.digits, .5, 420, 8); A.d2 = A.digits + .6; S.done(A.d2, 400, 2);
    S.rise(A.f3 - .1, .4); for (i = 0; i < N; i++) S.drag(A.dots + i * .08, .25, 200, 380); A.d3 = A.dots + .8; S.done(A.d3, 270, 4);
    S.reveal(A.cheap); S.flip(A.proof, .5); S.land(A.e1, 300, 5); S.done(A.e2, 270, 6); S.land(A.e3, 330, 7); S.done(A.e4, 400, 8);
    CAM = KM.rig({ x: 270, y: 490, z: 1.06, drift: 1 }).pull(0, .55, 270, 490, 1);
    DT.close(CAM, A.d1, 1.09, BY); DT.close(CAM, A.d2, 1.07, BY); DT.close(CAM, A.d3, 1.08, BY);
    window.ALIGN = [{ at: A.end - .05, sel: '.nm', edge: 'left', why: 'names start on one edge' }, { at: A.end - .05, sel: '.pr', edge: 'right', why: 'prices end on one edge' }];
    window.HOLDS = [[A.end, DUR]];
    KM.publish(DT.score(A.spot, A.f1));
  }
  function seek(t){
    t = Math.max(0, Math.min(DUR, t)); var c = CAM.apply($('world'), t, null); KM.lights(t, c);
    DT.intro($('board'), t + 1.3, .55);
    var tab = t >= A.digits + .2, k3 = 0;
    for (var i = 0; i < N; i++) { var n = $('n' + i), p = $('p' + i), ld = $('l' + i), y = Y0 + i * DY, k1 = DT.spring(t, A.edge + .15 + i * .07, .6);
      p.style.fontVariantNumeric = tab ? 'tabular-nums' : 'normal'; var wn = n.offsetWidth, wp = p.offsetWidth, xa = (W - (wn + 14 + wp)) / 2;
      var nx = mix(xa, L, k1), px = mix(xa + wn + 14, R - wp, k1); n.style.transform = 'translate(' + nx.toFixed(1) + 'px,' + y + 'px)'; p.style.transform = 'translate(' + px.toFixed(1) + 'px,' + y + 'px)';
      var cheap = i === 4 && t >= A.cheap - .1; p.style.color = cheap ? '#1f8a5b' : ''; n.style.color = cheap ? '#1f8a5b' : '';
      var kd = E.out3(P(t, A.dots + i * .08, A.dots + .35 + i * .08)), x0 = L + wn + 8, x1 = R - wp - 8; ld.style.width = Math.max(0, x1 - x0).toFixed(1) + 'px'; ld.style.transform = 'translate(' + x0.toFixed(1) + 'px,' + (y + 20) + 'px) scaleX(' + kd.toFixed(3) + ')'; ld.style.opacity = kd > 0 ? 1 : 0; }
    $('fern').style.transform = 'rotate(' + (Math.sin(t * 1.5) * 5).toFixed(2) + 'deg)';
    DT.mood(t, .34 * E.out3(P(t, A.d1 - .2, A.d1 + .5)) + .33 * E.out3(P(t, A.d2 - .2, A.d2 + .5)) + .33 * E.out3(P(t, A.d3 - .2, A.d3 + .5)));
    DT.sweep(t, [A.d1, A.d2, A.d3, A.cheap]);
    DT.hook(t, '<i>These</i> <i>prices</i> <i>are</i> <i>hard</i> <i>to</i> <em><i>compare.</i></em>', A.hook);
    var ro = 1 - P(t, A.turns - .3, A.turns);
    DT.box('ring0', { x: BX + 24, y: BY + 80, w: 360, h: 232, r: 14 }, P(t, 0, .3) * ro, '#ff5f5f'); DT.chip('rl0', 'CENTRED ROWS', BX + 24, BY + 318, P(t, .05, .3) * ro, 'r sm');
    // "they jump around": a red zigzag joins the prices' right ends
    var zz = P(t, A.jump - .3, A.jump + .4) * (1 - P(t, A.f1 - .3, A.f1)); for (i = 0; i < N - 1; i++) { var a = $('p' + i), b = $('p' + (i + 1)); DT.line('zz' + i, BX + 14 + a.offsetWidth + parseFloat(a.style.transform.split('(')[1]), BY + Y0 + i * DY + 14, BX + 14 + b.offsetWidth + parseFloat(b.style.transform.split('(')[1]), BY + Y0 + (i + 1) * DY + 14, cl(zz * 5 - i), '#ff5f5f', 3); }
    DT.chip('jp', 'THEY <b>JUMP AROUND</b>', 260, 356, P(t, A.jump - .1, A.jump + .2) - P(t, A.turns - .2, A.turns + .1), 'r');
    DT.chip('up', 'NUMBERS <b>LINE UP</b>', 150, 356, P(t, A.up - .1, A.up + .2) - P(t, A.f1 - .2, A.f1 + .1));
    DT.line('edge', BX + R + 10, BY + 80, BX + R + 10, BY + 330, P(t, A.edge - .2, A.edge + .2) * (1 - P(t, A.f2 + .3, A.f2 + .6)), '#ffb35a', 2, '6 5');
    DT.chip('c1', 'ONE <b>RIGHT EDGE</b>', 150, 356, P(t, A.edge, A.edge + .3) - P(t, A.f2 - .1, A.f2 + .2));
    // fix two: digit columns as guides, the digits switch to one width
    var dw = 13.8, go = P(t, A.digits - .1, A.digits + .2) * (1 - P(t, A.f3 - .2, A.f3 + .1)); for (i = 1; i <= 3; i++) { DT.line('col' + i, BX + R - dw * i + 6, BY + 78, BX + R - dw * i + 6, BY + Y0 - 4, go, '#7aa2ff', 2); DT.line('colb' + i, BX + R - dw * i + 6, BY + Y0 + 5 * DY + 34, BX + R - dw * i + 6, BY + Y0 + 5 * DY + 52, go, '#7aa2ff', 2); }
    DT.chip('c2', 'SAME-WIDTH <b>DIGITS</b>', 120, 356, P(t, A.digits, A.digits + .3) - P(t, A.f3 - .35, A.f3 - .05));
    DT.chip('c3', 'DOTS TO <b>EACH NAME</b>', 150, 356, P(t, A.dots, A.dots + .3) - P(t, A.spot - .2, A.spot + .1));
    [[A.d1, BX + R, BY + 200], [A.d2, BX + R - 20, BY + 160], [A.d3, BX + 200, BY + 220]].forEach(function(d, j){ DT.burst('b' + j, d[1], d[2], t, d[0], '#ffb35a'); });
    var br = Math.max(Math.sin(Math.PI * P(t, A.d1, A.d1 + .35)), Math.sin(Math.PI * P(t, A.d2, A.d2 + .35)), Math.sin(Math.PI * P(t, A.d3, A.d3 + .35)));
    $('board').style.boxShadow = '0 30px 70px rgba(0,0,0,.55),0 0 0 ' + (3 * br).toFixed(1) + 'px rgba(255,179,90,.55)';
    // the payoff: the eye runs straight down the price column and stops at the cheapest
    var ey = P(t, A.spot - .1, A.cheap - .1); DT.line('eye', BX + R + 14, BY + Y0, BX + R + 14, BY + Y0 + 4 * DY * ey + 14, ey > 0 && t < A.proof ? 1 : 0, '#5ee0a0', 4);
    DT.proof(t, A.proof, { flash: .5, x: 30, y: 778, s: .26, tx: 52, ty: 764 });
    DT.chip('win', 'CHEAPEST · <b>AT ONCE</b>', 150, 356, P(t, A.cheap - .2, A.cheap + .1) - P(t, A.e1 - .2, A.e1 + .1), 'g');
    DT.chip('win2', 'SAME LIST · <b>ONE GLANCE</b>', 120, 356, P(t, A.e1, A.e1 + .3) - P(t, A.e3 - .2, A.e3 + .1), 'g'); DT.chip('win3', 'EDGE ✓ · WIDTH ✓ · <b>DOTS ✓</b>', 90, 356, P(t, A.e3, A.e3 + .3), 'g'); DT.burst('b4', BX + 402, BY + Y0 + 2 * DY + 12, t, A.e4, '#5ee0a0'); DT.burst('b5', BX + 402, BY + Y0 + 5 * DY + 12, t, A.e4 + .5, '#5ee0a0');
    DT.box('ok', { x: BX + 10, y: BY + 10, w: 388, h: 324, r: 14 }, P(t, A.e2, A.e2 + .5), '#5ee0a0');
    DT.burst('b3', BX + 402, BY + Y0 + 4 * DY + 12, t, A.e1, '#5ee0a0');
    DT.dial(t, [{ t: 0, sym: '3', label: '3 FIXES' }, { t: A.f1, n: 1 }, { t: A.f2, n: 2 }, { t: A.f3, n: 3 }, { t: A.spot, end: 1, sym: '✓', label: 'LINED UP' }]);
    DT.title(t, [{ t: A.hook, html: 'Prices <em>jump around</em>' }, { t: A.f1, html: 'Fix 1 · <em>right edge</em>' }, { t: A.f2, html: 'Fix 2 · <em>even digits</em>' }, { t: A.f3 - .2, html: 'Fix 3 · <em>dot leaders</em>' }, { t: A.spot, html: 'One glance. <em>Done.</em>' }]);
    KM.subs($('cap'), t, V, PH, Math.max(0, V.words.findIndex(function(w){ return w.s - V.lead >= A.hook - .25; })), Math.min(A.end, V.end + .6), function(w){ return /^(compare|jump|line|align|edge|digits|dots|cheapest)/i.test(w) ? 'var(--amb)' : null; });
  }
  window.setVoice = function(v){ if (v && v.words && v.words.length) anchors(v.words); };
  window.seek = seek; window.DURATION = DUR; window.__A = A;
  Promise.all(["500 22px 'Space Grotesk'", "700 22px 'Space Grotesk'", "700 26px 'Space Grotesk'", "900 31px 'Unbounded'"].map(function(f){ return document.fonts.load(f); }))
    .then(function(){ anchors(); seek(1.2); DT.keep($('board')); seek(+(new URLSearchParams(location.search).get('t') || 0)); document.documentElement.dataset.ready = 1; });
})();
/*script:end*/

/*stage:begin*/
<div style="position:absolute;inset:0;background:linear-gradient(170deg,#243d3a 0%,#1b302e 55%,#14241f 100%)"></div>
<div style="position:absolute;inset:0;background:repeating-linear-gradient(90deg,rgba(255,255,255,.04) 0 2px,transparent 2px 60px)"></div>
<div style="position:absolute;left:-40px;top:300px;width:120px;height:420px;border-radius:60px;background:radial-gradient(60% 50% at 50% 30%,#8fb98a,#5a8a5e 60%,transparent 72%)"></div>
<div style="position:absolute;left:470px;top:250px;width:110px;height:180px;border-radius:55px 55px 20px 20px;border:6px solid #d8b98a;background:radial-gradient(60% 60% at 50% 40%,rgba(255,255,255,.35),rgba(255,255,255,.08))"></div>
<div style="position:absolute;left:0;right:0;top:830px;height:210px;background:linear-gradient(180deg,#6b4a32,#4a3222);box-shadow:0 -3px 0 rgba(255,255,255,.3)"></div>
<div class="lit" style="background:radial-gradient(55% 40% at 50% 55%,rgba(255,226,210,.5),transparent 75%)"></div>
<div class="lit" style="background:linear-gradient(180deg,rgba(255,210,190,.14),rgba(255,180,150,.05))"></div>
/*stage:end*/
