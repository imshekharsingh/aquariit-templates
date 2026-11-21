/*css:begin*/
.rul{position:absolute;width:24px;border-radius:6px;background:repeating-linear-gradient(180deg,rgba(24,26,36,.9) 0 2px,transparent 2px 12px) left/9px 100% no-repeat,repeating-linear-gradient(180deg,rgba(24,26,36,.75) 0 2px,transparent 2px 60px) left/16px 100% no-repeat,linear-gradient(90deg,#ece7dd,#dcd5c7);box-shadow:0 10px 26px rgba(0,0,0,.35);z-index:1}
.rul.r{transform:scaleX(-1)}
#board{left:40px;top:396px;width:460px;height:360px;border-radius:14px 14px 0 0;background:#fdfcf9;border:10px solid #1b1c22;border-bottom:none}
#bar{position:absolute;left:0;top:0;width:440px;height:30px;background:#ecebe7;border-bottom:1px solid #dddad3}
#bar i{position:absolute;top:10px;width:10px;height:10px;border-radius:50%}
#bar b{position:absolute;left:70px;top:6px;width:250px;height:18px;border-radius:9px;background:#fff;font:500 11px/18px 'Space Grotesk';color:#8a8276;padding-left:12px}
#bt{position:absolute;left:0;top:44px;font:700 22px 'Space Grotesk';color:#1d1a16;white-space:nowrap}
#pg{position:absolute;left:0;top:82px;font-family:'Space Grotesk';font-weight:400;color:#2d2924;hyphens:none}
#hdl{position:absolute;left:0;top:0;width:14px;height:56px;margin:-28px 0 0 -7px;border-radius:7px;background:#7aa2ff;box-shadow:0 0 0 4px rgba(122,162,255,.3),0 6px 14px rgba(0,0,0,.35);opacity:0;z-index:27}
#lost{position:absolute;left:0;top:0;width:540px;height:960px;pointer-events:none;z-index:26;overflow:visible}
/*css:end*/
/*board:begin*/
<div class="rul" style="left:8px;top:400px;height:246px"></div><div class="rul r" style="left:508px;top:400px;height:246px"></div>
<div id="board" class="board">
  <div id="bar"><i style="left:12px;background:#ff6b5f"></i><i style="left:28px;background:#ffc23d"></i><i style="left:44px;background:#3fc860"></i><b>slowbread.notes/why-it-rose</b></div>
  <div id="bt">Why my sourdough finally rose</div>
  <div id="pg" data-fit="free">For months my loaves came out flat and dense, and I blamed the flour, the oven and even the weather. Then a baker at the market asked how long I let the dough rest before shaping it, and I realised I had never once timed it. I started writing the times down on a card stuck to the fridge. The first week was a mess of crossed-out numbers. By the third week the dough was rising slowly overnight in a cool corner of the kitchen, and the crust cracked open in the oven the way the photos in old baking books always promised it would.<br><br>So here is the whole method, written the way I wish someone had written it for me: feed the starter in the morning, mix the dough after lunch, fold it four times through the afternoon, shape it before dinner and leave it alone until breakfast. Bake it hot, in a heavy pot with the lid on for the first twenty minutes, then take the lid off and wait until the crust is darker than feels safe. That last part is where most of the flavour comes from.</div>
</div>
<div id="hdl"></div>
<svg id="lost" viewBox="0 0 540 960"><path id="lp" fill="none" stroke="#ff5f5f" stroke-width="4" stroke-linecap="round" stroke-dasharray="3 9"/><circle id="lc" r="9" fill="#ff5f5f" opacity="0"/></svg>
/*board:end*/
/*script:begin*/
(function(){
  var $ = DT.$, P = KM.P, mix = KM.mix, E = KM.ease, cl = KM.cl; KM.theme('dark', 'turnsout'); DT.ctx(); DT.tint('#5ee0a0', '#ffb35a');
  var TEXT = "Your eyes get lost here. Every line is too long. Turns out, short lines are easier. Fix one: narrow the column. Fix two: ten words a line. Fix three: more space between lines. Now it reads like a book.";
  var DUR = 16, BX = 50, BY = 396, PW = 440, V, PH, A = {}, CAM;
  // the column: A full width, tiny and tight; B about ten words a line, a little bigger, room between lines, centred like a book page
  var CA = { w: 416, fs: 9, lh: 1.15 }, C1 = { w: 380, fs: 9, lh: 1.15 }, C2 = { w: 360, fs: 13, lh: 1.15 }, CB = { w: 360, fs: 13, lh: 1.5 };
  function at(w, n){ return V.at(w, n); }
  function anchors(words){
    V = KM.voice(TEXT, .12, words); PH = V.phrases(4); KM.reset(DUR);
    A.hook = at('Every') - .1; A.long = at('long'); A.turns = at('Turns'); A.easy = at('easier'); A.f1 = at('Fix'); A.narrow = at('narrow'); A.f2 = at('Fix', 2); A.words = at('words'); A.f3 = at('Fix', 3); A.space = at('space');
    A.now = at('Now'); A.book = at('book'); A.end = Math.min(DUR - .2, V.end + .8); A.e1 = Math.min(DUR - 1.8, A.book + 1); A.e2 = Math.min(DUR - .8, A.book + 2.1);
    window.COVER = .6;
    var S = DT.S; S.sting(0); S.whoosh(0, 270, .4); S.drag(.3, 1, 80, 460); S.stamp(1.35, 120);
    S.drag(A.long - .2, .6, 60, 480); S.tint(A.easy, 270);
    S.rise(A.f1 - .4, .45); S.click(A.narrow - .1, 460); S.drag(A.narrow, .6, 460, 380); A.d1 = A.narrow + .7; S.done(A.d1, 380, 0);
    S.rise(A.f2 - .1, .4); S.roll(A.words - .2, .5, 300, 6); S.snap(A.words + .2, 350, 2); A.d2 = A.words + .6; S.done(A.d2, 270, 2);
    S.rise(A.f3 - .1, .4); S.drag(A.space, .6, 270, 270); A.d3 = A.space + .7; S.done(A.d3, 270, 4);
    S.reveal(A.book); S.land(A.e1, 270, 5); S.done(A.e2, 270, 6);
    CAM = KM.rig({ x: 270, y: 490, z: 1.06, drift: 1 }).pull(0, .55, 270, 490, 1);
    [A.d1, A.d2, A.d3].forEach(function(d){ CAM.pushIn(d - .12, .28, 270, 490, 1.06).pull(d + .55, .6, 270, 490, 1); });
    window.ALIGN = [{ at: A.end - .05, sel: '#bt, #pg', edge: 'left', why: 'title and text start on one edge' }];
    window.HOLDS = [[A.end, DUR]];
    KM.publish(DT.score(A.now, A.f1));
  }
  function col(t){ var k1 = DT.spring(t, A.narrow, .7), k2 = DT.spring(t, A.words + .1, .6), k3 = DT.spring(t, A.space, .8);
    var w = mix(mix(mix(CA.w, C1.w, k1), C2.w, k2), CB.w, k3), fs = mix(CA.fs, C2.fs, k2), lh = mix(CA.lh, CB.lh, k3); return { w: w, fs: fs, lh: lh, x: mix(12, (PW - 360) / 2, k2) }; }
  function seek(t){
    t = Math.max(0, Math.min(DUR, t)); var c = CAM.apply($('world'), t, null); KM.lights(t, c);
    DT.intro($('board'), t + .6, .55);
    var C = col(t), pg = $('pg'), bt = $('bt'); pg.style.width = C.w.toFixed(1) + 'px'; pg.style.fontSize = C.fs.toFixed(2) + 'px'; pg.style.lineHeight = C.lh.toFixed(3); pg.style.transform = 'translateX(' + C.x.toFixed(1) + 'px)';
    bt.style.transform = 'translateX(' + C.x.toFixed(1) + 'px)'; bt.style.fontSize = mix(18, 22, P(t, A.words, A.words + .6)).toFixed(2) + 'px';
    DT.mood(t, .34 * E.out3(P(t, A.d1 - .2, A.d1 + .5)) + .33 * E.out3(P(t, A.d2 - .2, A.d2 + .5)) + .33 * E.out3(P(t, A.d3 - .2, A.d3 + .5)));
    DT.sweep(t, [A.d1, A.d2, A.d3, A.book]);
    DT.hook(t, '<i>Your</i> <i>eyes</i> <i>get</i> <em><i>lost</i></em> <i>here.</i>', A.hook);
    // the lost eye: along line 1, a long return sweep, lands on line 3 (skips one), and again; red, dashed
    var X0 = BX + 14, X1 = BX + 14 + CA.w, y1 = BY + 92, lhA = CA.fs * CA.lh, lo = 1 - P(t, A.turns - .3, A.turns), u = P(t, .1, 1.5), v = P(t, A.long - .3, A.long + .9);
    var d = 'M' + X0 + ' ' + y1 + ' L' + mix(X0, X1, cl(u * 2)).toFixed(1) + ' ' + y1; if (u > .5) d += ' L' + mix(X1, X0, cl(u * 2 - 1)).toFixed(1) + ' ' + mix(y1, y1 + 2 * lhA, cl(u * 2 - 1)).toFixed(1);
    if (v > 0) d += ' M' + X0 + ' ' + (y1 + 2 * lhA) + ' L' + mix(X0, X1, cl(v * 2)).toFixed(1) + ' ' + (y1 + 2 * lhA) + (v > .5 ? ' L' + mix(X1, X0, cl(v * 2 - 1)).toFixed(1) + ' ' + mix(y1 + 2 * lhA, y1 + 5 * lhA, cl(v * 2 - 1)).toFixed(1) : '');
    $('lp').setAttribute('d', d); $('lp').style.opacity = (P(t, .1, .2) * lo).toFixed(3);
    var lc = $('lc'); lc.setAttribute('cx', (u < .5 ? mix(X0, X1, cl(u * 2)) : mix(X1, X0, cl(u * 2 - 1))).toFixed(1)); lc.setAttribute('cy', (u < .5 ? y1 : mix(y1, y1 + 2 * lhA, cl(u * 2 - 1))).toFixed(1)); lc.setAttribute('opacity', (P(t, .1, .2) * (1 - P(t, 1.5, 1.7))).toFixed(3));
    DT.chip('skip', 'SKIPPED <b>A LINE</b>', 300, 398, P(t, 1.4, 1.65) * lo, 'r sm');
    // frame 0: the problems ringed
    [[.35, { x: BX + 8, y: BY + 80, w: 424, h: 120, r: 14 }, 'TOO LONG', BX + 14, BY + 330], [.65, { x: BX + 8, y: BY + 200, w: 424, h: 46, r: 12 }, 'TIGHT LINES', BX + 150, BY + 330]].forEach(function(r, i){
      DT.box('ring' + i, r[1], P(t, r[0], r[0] + .3) * lo, '#ff5f5f'); DT.chip('rl' + i, r[2], r[3], r[4], P(t, r[0] + .1, r[0] + .35) * lo, 'r sm'); });
    DT.hmeasure('wide', BX + 14, BX + 14 + CA.w, BY + 40, P(t, A.long - .2, A.long + .3) * (1 - P(t, A.f1 - .2, A.f1 + .1)), 'TOO LONG');
    DT.chip('ez', 'SHORT LINES · <b>EASIER</b>', 120, 396, P(t, A.easy - .1, A.easy + .2) - P(t, A.f1 - .2, A.f1 + .1));
    // fix one: a handle on the column's right edge drags it narrower
    var hx = BX + C.x + C.w + 8, h = $('hdl'); h.style.left = hx.toFixed(1) + 'px'; h.style.top = (BY + 160) + 'px'; h.style.opacity = (P(t, A.f1 + .1, A.f1 + .4) * (1 - P(t, A.f2 + .3, A.f2 + .6))).toFixed(3);
    DT.line('edge', hx, BY + 40, hx, BY + 370, P(t, A.f1 + .1, A.f1 + .4) * (1 - P(t, A.f2 + .3, A.f2 + .6)), '#7aa2ff', 2, '6 5');
    DT.chip('c1', 'NARROW <b>COLUMN</b>', 120, 396, P(t, A.narrow, A.narrow + .3) - P(t, A.f2 - .1, A.f2 + .2));
    // fix two: the width settles at about ten words, measured
    DT.hmeasure('ten', BX + C.x, BX + C.x + C.w, BY + 40, P(t, A.words - .1, A.words + .3) * (1 - P(t, A.f3 - .2, A.f3 + .1)), 'TEN WORDS');
    DT.chip('c2', 'TEN WORDS · <b>A LINE</b>', 120, 396, P(t, A.words, A.words + .3) - P(t, A.f3 - .1, A.f3 + .2));
    // fix three: the lines open up, the gap measured
    var g0 = BY + 82 + C.fs * C.lh; DT.measure('lh', BX + C.x + C.w + 14, g0, g0 + C.fs * C.lh, P(t, A.space, A.space + .3) * (1 - P(t, A.now - .2, A.now + .1)), 'AIR', 1);
    DT.chip('c3', 'SPACE · <b>BETWEEN LINES</b>', 120, 396, P(t, A.space, A.space + .3) - P(t, A.now - .2, A.now + .1));
    [[A.d1, BX + 300, BY + 160], [A.d2, BX + 220, BY + 74], [A.d3, BX + 360, BY + 140]].forEach(function(dd, i){ DT.burst('b' + i, dd[1], dd[2], t, dd[0], '#ffb35a'); });
    var br = Math.max(Math.sin(Math.PI * P(t, A.d1, A.d1 + .35)), Math.sin(Math.PI * P(t, A.d2, A.d2 + .35)), Math.sin(Math.PI * P(t, A.d3, A.d3 + .35)));
    $('board').style.boxShadow = '0 30px 70px rgba(0,0,0,.55),0 0 0 ' + (3 * br).toFixed(1) + 'px rgba(255,179,90,.55)';
    // the payoff: a calm green eye path down the short lines, then a book-page frame
    var gp = P(t, A.e1, A.e1 + .8); DT.line('eyeg', BX + C.x - 8, BY + 86, BX + C.x - 8, BY + 86 + 280 * gp, gp > 0 ? 1 : 0, '#5ee0a0', 4);
    DT.chip('win', 'READS LIKE <b>A BOOK</b>', 150, 396, P(t, A.book - .2, A.book + .1), 'g');
    DT.box('pgf', { x: BX + C.x - 14, y: BY + 34, w: C.w + 28, h: 342, r: 10 }, P(t, A.e2, A.e2 + .5), '#5ee0a0');
    DT.dial(t, [{ t: 0, sym: '3', label: '3 FIXES' }, { t: A.f1, n: 1 }, { t: A.f2, n: 2 }, { t: A.f3, n: 3 }, { t: A.now, end: 1, sym: '✓', label: 'EASY READ' }]);
    DT.title(t, [{ t: A.hook, html: 'Lost the <em>line</em>?' }, { t: A.f1, html: 'Fix 1 · <em>narrow it</em>' }, { t: A.f2, html: 'Fix 2 · <em>ten words</em>' }, { t: A.f3, html: 'Fix 3 · <em>more air</em>' }, { t: A.now, html: 'Short lines. <em>Easy.</em>' }]);
    KM.subs($('cap'), t, V, PH, Math.max(0, V.words.findIndex(function(w){ return w.s - V.lead >= A.hook - .25; })), A.end, function(w){ return /^(long|short|easier|narrow|column|ten|words|space|book)/i.test(w) ? 'var(--amb)' : null; });
  }
  window.setVoice = function(v){ if (v && v.words && v.words.length) anchors(v.words); };
  window.seek = seek; window.DURATION = DUR; window.__A = A;
  window.__cpl = function(){ var n = $('pg').firstChild, r = document.createRange(), rows = {}; for (var i = 0; i < n.length; i++) { r.setStart(n, i); r.setEnd(n, i + 1); var q = r.getBoundingClientRect(); if (!q.height) continue; var k = Math.round(q.top); rows[k] = (rows[k] || 0) + 1; } return Object.values(rows); };
  Promise.all(["400 9px 'Space Grotesk'", "700 22px 'Space Grotesk'", "900 31px 'Unbounded'"].map(function(f){ return document.fonts.load(f); }))
    .then(function(){ anchors(); seek(+(new URLSearchParams(location.search).get('t') || 0)); document.documentElement.dataset.ready = 1; });
})();
/*script:end*/

/*stage:begin*/
<div style="position:absolute;inset:0;background:linear-gradient(170deg,#3e4a5c 0%,#323c4c 55%,#272f3c 100%)"></div>
<div style="position:absolute;left:0;right:0;top:820px;height:220px;background:linear-gradient(180deg,#b9a38a,#9c876f);box-shadow:0 -3px 0 rgba(255,240,220,.3)"></div>
<div style="position:absolute;left:30px;top:812px;width:540px;height:26px;border-radius:0 0 18px 18px;background:linear-gradient(180deg,#c9ccd3,#8e929c);box-shadow:0 8px 14px rgba(0,0,0,.35)"></div>
<div style="position:absolute;left:440px;top:150px;width:160px;height:300px;background:radial-gradient(40% 30% at 50% 30%,#4e8a5a,transparent 70%),radial-gradient(35% 28% at 30% 55%,#3f7a4c,transparent 70%),radial-gradient(35% 28% at 70% 60%,#5a9a63,transparent 70%)"></div>
<div class="lit" style="background:radial-gradient(55% 40% at 50% 55%,rgba(255,236,200,.45),transparent 75%)"></div>
<div class="lit" style="background:linear-gradient(180deg,rgba(255,210,150,.12),rgba(255,180,110,.05))"></div>
/*stage:end*/
