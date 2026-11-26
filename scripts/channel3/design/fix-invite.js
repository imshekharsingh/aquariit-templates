/* Rebuilt on the improved kit from the GOLD Turns Out reel showreel-c3-grey-text (starter c3): the dark stage, one board that changes in place, the title
   line with the accent word, FIX n OF 3, one change per spoken sentence, the before as a thumbnail + after on the last seconds. Content: a kids' party
   invite on a fridge door; the before is a first draft (four fonts, all centred, confetti, no hero); three fixes: one hero (the age), one font in two
   sizes, one colour used once. */
/*css:begin*/
.rul{position:absolute;width:24px;border-radius:6px;background:repeating-linear-gradient(180deg,rgba(24,26,36,.9) 0 2px,transparent 2px 12px) left/9px 100% no-repeat,repeating-linear-gradient(180deg,rgba(24,26,36,.75) 0 2px,transparent 2px 60px) left/16px 100% no-repeat,linear-gradient(90deg,#ece7dd,#dcd5c7);box-shadow:0 10px 26px rgba(0,0,0,.35);z-index:1}
.rul.r{transform:scaleX(-1)}
#board{left:66px;top:396px;width:408px;height:368px;border-radius:14px;border:10px solid #8f9aa3;background:#d6f0ff}
.iv{position:absolute;left:0;top:0;white-space:nowrap;transform-origin:0 0}
#big7{position:absolute;left:0;top:0;font:900 112px/1 'Unbounded';color:#1d1a16;transform-origin:0 0;opacity:0;display:none}
.cf{position:absolute;width:16px;height:16px;border-radius:50%}
.rk{position:absolute;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;background:#7aa2ff;color:#fff;font:900 16px/34px var(--d);text-align:center;z-index:26;opacity:0;box-shadow:0 6px 16px rgba(0,0,0,.4)}
/*css:end*/
/*board:begin*/
<div class="rul" style="left:8px;top:400px;height:246px"></div><div class="rul r" style="left:508px;top:400px;height:246px"></div>
<div id="board" class="board">
  <div class="iv" id="v0">Aarav is 7!!</div>
  <div class="iv" id="v1">PARTY TIME</div>
  <div class="iv" id="v2">Sunday · 4 PM</div>
  <div class="iv" id="v3">12 Lake View Road</div>
  <div class="iv" id="v4">RSVP to Mum</div>
  <div id="big7">7</div>
  <div class="cf" id="c0" style="background:#ffeb3b"></div><div class="cf" id="c1" style="background:#8bc34a"></div><div class="cf" id="c2" style="background:#e91e63"></div><div class="cf" id="c3" style="background:#03a9f4"></div>
  <div class="cf" id="c4" style="background:#ff9800"></div><div class="cf" id="c5" style="background:#9c27b0"></div><div class="cf" id="c6" style="background:#ffeb3b"></div><div class="cf" id="c7" style="background:#e91e63"></div>
</div>
<div class="rk" id="k1">1</div><div class="rk" id="k2">2</div><div class="rk" id="k3">3</div>
/*board:end*/
/* the three fixes: each lands on its spoken sentence (rules-c3.md V1-V3; critic D2). */
/*script:begin*/
(function(){
  var $ = DT.$, P = KM.P, mix = KM.mix, E = KM.ease, cl = KM.cl; KM.theme('dark', 'turnsout'); DT.ctx(); DT.tint('#ff8a5a', '#ffb35a');
  // spoken sentences with breaths (rules-c3.md V1-V3); the before is a believable first draft: four fonts, everything centred, confetti, nothing is the hero (B1)
  var TEXT = "Everything here is shouting. Nothing stands out, so nothing gets read. Turns out, it needs one hero. First, make the age the biggest thing. Next, keep one font in two sizes. Then, use one colour, just once. Same party, and now you can read it.";
  var DUR = 21, BX = 66, BY = 396, OX = BX + 10, OY = BY + 10, IW = 388, V, PH, A = {}, CAM;
  var ST = {   // A: everything shouts (four fonts, all centred); B: one hero, one font in two sizes, one colour
    v0: { A: { f: "400 30px/1.2 'Pacifico'", c: '#e91e63', y: 26 }, B: { f: "700 26px/1 'Space Grotesk'", c: '#1d1a16', y: 172 } },
    v1: { A: { f: "400 26px/1 'Anton'", c: '#ff9800', y: 84 }, B: { f: "700 13px/1 'Space Grotesk'", c: '#8a7f70', y: 208, ls: '.2em' } },
    v2: { A: { f: "400 18px/1 'Courier Prime'", c: '#333', y: 136 }, B: { f: "500 18px/1 'Space Grotesk'", c: '#1d1a16', y: 238 } },
    v3: { A: { f: "400 18px/1 'Courier Prime'", c: '#333', y: 162 }, B: { f: "500 18px/1 'Space Grotesk'", c: '#1d1a16', y: 264 } },
    v4: { A: { f: "400 18px/1 'Courier Prime'", c: '#333', y: 188 }, B: { f: "700 13px/1 'Space Grotesk'", c: '#ff7a45', y: 296, ls: '.2em' } } };
  var IDS = ['v0', 'v1', 'v2', 'v3', 'v4'], CF = [[40, 250], [320, 236], [70, 300], [270, 296], [160, 240], [340, 120], [26, 110], [210, 300]];
  function font(el, s){ el.style.font = s.f; el.style.color = s.c; el.style.letterSpacing = s.ls || 'normal'; }
  function at(w, n){ return V.at(w, n); }
  function anchors(words){
    V = KM.voice(TEXT, .12, words); PH = V.phrases(4); KM.reset(DUR);
    A.hook = at('Everything') - .1; A.nothing = at('Nothing'); A.turns = at('Turns'); A.con = at('hero'); A.f1 = at('First'); A.age = at('age'); A.big = at('biggest');
    A.f2 = at('Next'); A.font = at('font'); A.sizes = at('sizes'); A.f3 = at('Then'); A.col = at('colour'); A.once = at('once');
    A.same = at('Same'); A.readable = at('read', 2); A.proof = A.readable + .8; A.e1 = A.proof + 1.2; A.e2 = A.e1 + .9; A.end = Math.min(DUR - .2, A.e2 + 1.5);
    window.COVER = .6;
    var S = DT.S; S.sting(0); [.35, .65, .95].forEach(function(t0, i){ S.land(t0 + .05, 270, i + 1); KM.cue({ t: t0, k: 'tick', g: .08, p: i, x: 270, synth: true }); }); S.whoosh(0, 270, .4);
    S.stamp(A.nothing + .1, 270); S.tint(A.turns, 270);
    S.rise(A.f1 - .4, .45); IDS.forEach(function(id, i){ S.land(A.age + .05 + i * .07, 200 + i * 40, i); }); S.tint(A.big + .1, 150); [0, 1, 2].forEach(function(n){ S.land(A.big + .35 + n * .12, 200 + n * 60, n * 2); }); A.d1 = A.big + .8; S.done(A.d1, 150, 0);
    S.rise(A.f2 - .1, .4); IDS.forEach(function(id, i){ S.swap(A.font + .05 + i * .14, .4, 270, 6); }); S.roll(A.font, .75, 400, 4); S.land(A.sizes, 180, 6); A.d2 = Math.max(A.sizes + .3, A.font + 1.1); S.done(A.d2, 270, 2);
    S.rise(A.f3 - .1, .4); for (var i = 0; i < 8; i++) S.land(A.col + .05 + i * .05, 120 + i * 40, i); S.tint(A.col + .5, 150); A.d3 = Math.max(A.once + .1, A.col + .9); S.done(A.d3, 150, 4);
    S.reveal(A.readable); S.flip(A.proof, .5); S.land(A.e1, 200, 5); S.done(A.e2, 270, 6);
    CAM = KM.rig({ x: 270, y: 490, z: 1.06, drift: 1 }).pull(0, .55, 270, 490, 1);
    DT.close(CAM, A.d1, 1.08); DT.close(CAM, A.d2, 1.08); DT.close(CAM, A.d3, 1.07);
    window.ALIGN = [{ at: A.end - .05, sel: '.iv > span:first-child', edge: 'left', why: 'every line starts on one edge' }, { at: A.end - .05, sel: 'span', each: '.iv', edge: 'bottom', why: 'every letter on its line' }];
    window.HOLDS = [[A.end, DUR]];
    KM.publish(DT.score(A.same, A.f1));
  }
  function seek(t){
    t = Math.max(0, Math.min(DUR, t)); var c = CAM.apply($('world'), t, null); KM.lights(t, c);
    var inv = $('board'); DT.intro(inv, t + .6, .55);
    DT.mood(t, .34 * E.out3(P(t, A.d1 - .2, A.d1 + .5)) + .33 * E.out3(P(t, A.d2 - .2, A.d2 + .5)) + .33 * E.out3(P(t, A.d3 - .2, A.d3 + .5)));
    DT.sweep(t, [A.d1, A.d2, A.d3, A.readable]);
    DT.hook(t, '<i>Everything</i> <em><i>shouts.</i></em>', A.hook);
    // fix 1: the age becomes the hero; the old lines step down; read-order badges 1-2-3
    var k1 = DT.spring(t, A.age, .8), k2 = P(t, A.font, A.font + .75), k3 = DT.spring(t, A.col + .3, .7);
    IDS.forEach(function(id, i){ var el = $(id), a = ST[id].A, b = ST[id].B, t0f = A.font + .05 + i * .14, kf = P(t, t0f, t0f + .45);
      font(el, kf >= .5 ? b : a); DT.flipChars(el, t, t0f, .45, a, b);
      var w = el.offsetWidth, xA = (IW - w) / 2, x = mix(xA, 30, k1), y = mix(a.y, b.y, k1);
      var sh = kf >= 1 ? 1 : mix(1, id === 'v0' ? .72 : .66, k1); el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) scale(' + sh.toFixed(3) + ')'; });
    { var ro = 1 - P(t, A.turns - .3, A.turns); [[.35, { x: OX + 20, y: OY + 14, w: 348, h: 56, r: 14 }, 'NO HERO', BX + 22], [.65, { x: OX + 54, y: OY + 74, w: 280, h: 140, r: 16 }, '4 FONTS', BX + 150], [.95, { x: OX + 8, y: OY + 226, w: 372, h: 92, r: 16 }, '6 COLOURS', BX + 266]].forEach(function(r, i){
      DT.box('fr' + i, r[1], P(t, r[0], r[0] + .3) * ro, '#ff5f5f'); DT.chip('frl' + i, r[2], r[3], BY + 350, P(t, r[0] + .1, r[0] + .35) * ro, 'r sm'); }); }
    var k7 = DT.spring(t, A.big, .7), b7 = $('big7'), s = mix(.2, 1, k7); b7.style.display = t >= A.big - .05 ? 'block' : 'none';   // display none while the before is kept, so the BEFORE picture has no 7
    b7.style.transform = 'translate(26px,28px) scale(' + s.toFixed(3) + ')'; b7.style.opacity = P(t, A.big - .05, A.big + .15).toFixed(3);
    b7.style.color = 'rgb(' + [Math.round(mix(29, 255, k3)), Math.round(mix(26, 122, k3)), Math.round(mix(22, 69, k3))].join(',') + ')';
    [[1, OX + 190, OY + 70], [2, OX + 330, OY + 178], [3, OX + 290, OY + 248]].forEach(function(r, i){ var e = $('k' + r[0]), k = E.back(P(t, A.big + .35 + i * .12, A.big + .7 + i * .12), 2), o = k * (1 - P(t, A.f2 - .2, A.f2 + .1));
      e.style.left = r[1] + 'px'; e.style.top = r[2] + 'px'; e.style.opacity = cl(o).toFixed(3); e.style.transform = 'scale(' + (.5 + .5 * k).toFixed(3) + ')'; });
    DT.chip('rd', 'NOTHING <b>STANDS OUT</b>', 130, 396, P(t, A.nothing - .1, A.nothing + .2) - P(t, A.turns - .2, A.turns + .1), 'r');
    DT.chip('con', 'IT NEEDS ONE <b>HERO</b>', 120, 396, P(t, A.con - .1, A.con + .2) - P(t, A.f1 - .2, A.f1 + .1));
    DT.chip('h', 'THE AGE IS <b>THE HERO</b>', 110, 396, P(t, A.big, A.big + .3) - P(t, A.f2 - .1, A.f2 + .2));
    // fix 2: the scan flips every line, letter by letter, into one font; then two sizes
    var sk = P(t, A.font, A.font + .8); DT.line('scan', BX + 6, BY + 16 + sk * 340, BX + 402, BY + 16 + sk * 340, sk > 0 && sk < 1 ? 1 : 0, '#ffb35a', 3);
    DT.chip('f', 'ONE <b>FONT</b>', 150, 396, P(t, A.font, A.font + .3) - P(t, A.sizes - .1, A.sizes + .15));
    DT.chip('s', 'TWO <b>SIZES</b>', 150, 396, P(t, A.sizes, A.sizes + .3) - P(t, A.f3 - .1, A.f3 + .2));
    // fix 3: the confetti flies into the 7, which takes the one colour; the board calms
    for (var i = 0; i < 8; i++) { var e = $('c' + i), fk = E.inOut3(P(t, A.col + .05 + i * .05, A.col + .5 + i * .05)), x0 = CF[i][0], y0 = CF[i][1];
      e.style.left = mix(x0, 80, fk).toFixed(1) + 'px'; e.style.top = mix(y0, 80, fk).toFixed(1) + 'px'; e.style.opacity = (1 - P(fk, .8, 1)).toFixed(3); e.style.transform = 'scale(' + mix(1, .4, fk).toFixed(3) + ')'; }
    inv.style.background = 'rgb(' + [Math.round(mix(214, 255, k3)), Math.round(mix(240, 246, k3)), Math.round(mix(255, 232, k3))].join(',') + ')';
    DT.chip('c', 'ONE <b>COLOUR</b>', 150, 396, P(t, A.col, A.col + .3) - P(t, A.same - .2, A.same + .1));
    [[A.d1, OX + 100, OY + 90], [A.d2, OX + 190, OY + 230], [A.d3, OX + 100, OY + 90]].forEach(function(d, i){ DT.burst('b' + i, d[1], d[2], t, d[0], i === 2 ? '#ff7a45' : '#ffb35a'); });
    var br = Math.max(Math.sin(Math.PI * P(t, A.d1, A.d1 + .35)), Math.sin(Math.PI * P(t, A.d2, A.d2 + .35)), Math.sin(Math.PI * P(t, A.d3, A.d3 + .35))); inv.style.boxShadow = '0 30px 70px rgba(0,0,0,.55),0 0 0 ' + (3 * br).toFixed(1) + 'px rgba(255,179,90,.55)';
    DT.proof(t, A.proof, { flash: .5, x: 30, y: 772, s: .34, tx: 180, ty: 752, fs: .78, fx: 45, fy: 52 });
    DT.chip('win', 'SAME PARTY · <b>READABLE</b>', 100, 396, P(t, A.readable - .2, A.readable + .1) - P(t, A.e2 - .2, A.e2 + .1), 'g'); DT.chip('win2', 'FONTS 1 · COLOUR 1', 120, 396, P(t, A.e2, A.e2 + .3), 'g');
    [[A.e1, OX + 200, OY + 56], [A.e1 + .12, OX + 345, OY + 176], [A.e1 + .24, OX + 345, OY + 242]].forEach(function(d, j){ DT.line('tk' + j + 'a', d[1], d[2], d[1] + 8, d[2] + 8, P(t, d[0], d[0] + .15), '#2fb37a', 4); DT.line('tk' + j + 'b', d[1] + 8, d[2] + 8, d[1] + 24, d[2] - 10, P(t, d[0] + .1, d[0] + .25), '#2fb37a', 4); });
    DT.box('ok', { x: BX + 14, y: BY + 14, w: 380, h: 340, r: 14 }, P(t, A.e2, A.e2 + .5), '#5ee0a0');
    DT.dial(t, [{ t: 0, sym: '3', label: '3 FIXES' }, { t: A.f1, n: 1 }, { t: A.f2, n: 2 }, { t: A.f3, n: 3 }, { t: A.same, end: 1, sym: '✓', label: 'READABLE' }]);
    DT.title(t, [{ t: A.hook, html: 'No hero, so <em>no read</em>' }, { t: A.f1, html: 'Fix 1 · <em>one hero</em>' }, { t: A.f2, html: 'Fix 2 · <em>one font</em>' }, { t: A.f3, html: 'Fix 3 · <em>one colour</em>' }, { t: A.same, html: 'Now <em>readable</em>' }]);
    KM.subs($('cap'), t, V, PH, Math.max(0, V.words.findIndex(function(w){ return w.s - V.lead >= A.hook - .25; })), A.end, function(w){ return /^(shouting|stands|hero|age|biggest|font|sizes|colour|once|read)/i.test(w) ? 'var(--amb)' : null; });
  }
  window.setVoice = function(v){ if (v && v.words && v.words.length) anchors(v.words); };
  window.seek = seek; window.DURATION = DUR; window.__A = A;
  Promise.all(["400 30px 'Pacifico'", "400 26px 'Anton'", "400 18px 'Courier Prime'", "700 26px 'Space Grotesk'", "500 18px 'Space Grotesk'", "900 150px 'Unbounded'"].map(function(f){ return document.fonts.load(f); }))
    .then(function(){ IDS.forEach(function(id){ font($(id), ST[id].A); }); anchors(); seek(1.2); DT.keep($('board')); seek(+(new URLSearchParams(location.search).get('t') || 0)); document.documentElement.dataset.ready = 1; });
})();
/*script:end*/

/*stage:begin*/
<div style="position:absolute;inset:0;background:linear-gradient(175deg,#2b343b 0%,#222a30 55%,#1a2024 100%)"></div>
<div style="position:absolute;left:36px;top:352px;width:468px;height:470px;border-radius:26px;background:linear-gradient(160deg,#46525b,#2d363d 60%,#262e34);box-shadow:inset 0 2px 0 rgba(255,255,255,.14),0 18px 40px rgba(0,0,0,.4);opacity:.75"></div>
<div style="position:absolute;left:14px;top:430px;width:12px;height:300px;border-radius:6px;background:linear-gradient(90deg,#8a959d,#d4dbe0,#7c868e);opacity:.55"></div>
<div style="position:absolute;left:0;right:0;top:850px;height:190px;background:linear-gradient(180deg,#4a3c30,#342a21);box-shadow:0 -3px 0 rgba(255,235,200,.2)"></div>
<div class="lit" style="background:radial-gradient(55% 40% at 50% 55%,rgba(255,225,185,.4),transparent 75%)"></div>
<div class="lit" style="background:linear-gradient(180deg,rgba(255,210,150,.12),rgba(255,180,110,.05))"></div>
/*stage:end*/
