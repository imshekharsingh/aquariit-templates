/*css:begin*/
#inv{left:90px;top:440px;width:360px;height:340px;border-radius:16px;background:#d6f0ff}
.iv{position:absolute;left:0;top:0;white-space:nowrap;transform-origin:0 0}
#big7{position:absolute;left:0;top:0;font:900 150px/1 'Unbounded';color:#1d1a16;transform-origin:0 0}
.cf{position:absolute;width:16px;height:16px;border-radius:50%}
#cmt{left:40px;top:470px;width:460px;padding:16px 20px;border-radius:20px;background:#1c2133;border:1.5px solid #2a3150;display:flex;gap:14px;align-items:center;z-index:28;opacity:0}
#cmt i{flex:none;width:46px;height:46px;border-radius:50%;background:linear-gradient(135deg,#ffb35a,#7a3d9a)}
#cmt small{display:block;font:500 15px/1.2 var(--f);color:#9aa1b8}
#cmt b{display:block;font:700 22px/1.25 var(--f);color:#fff;white-space:nowrap}
.rk{position:absolute;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;background:#7aa2ff;color:#fff;font:900 16px/34px var(--d);text-align:center;z-index:26;opacity:0;box-shadow:0 6px 16px rgba(0,0,0,.4)}
#ask{left:60px;top:396px;width:420px;height:50px;border-radius:25px;background:#141827;border:1.5px solid #ffb35a;padding:0 20px;font:600 19px/50px var(--f);color:#fff;white-space:nowrap;overflow:hidden;opacity:0;z-index:28}
/*css:end*/
/*board:begin*/
<div id="inv" class="board">
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
<div id="cmt" class="a"><i></i><div><small>a viewer asked</small><b id="cmtT"></b></div></div>
<div id="ask" class="a"></div>
/*board:end*/
/*script:begin*/
(function(){
  var $ = DT.$, P = KM.P, mix = KM.mix, E = KM.ease, cl = KM.cl; KM.theme('dark', 'turnsout'); DT.tint('#ff8a5a', '#ff5f7a');
  var TEXT = "You asked us to fix a birthday invite. Move one: pick one hero, the age. Move two: one font, two sizes. Move three: one colour, used once. Turns out, a kids' party can look this good. Comment what we fix next.";
  var DUR = 18, V, PH, A = {}, CAM, CUR = [], IX = 90, IY = 440, W = {};
  var ST = {   // A: everything shouts (four fonts, all centred, one size); B: one hero, one font in two sizes, one colour
    v0: { A: { f: "400 30px/1.2 'Pacifico'", c: '#e91e63', y: 26 }, B: { f: "700 26px/1 'Space Grotesk'", c: '#1d1a16', y: 176 } },
    v1: { A: { f: "400 26px/1 'Anton'", c: '#ff9800', y: 84 }, B: { f: "700 13px/1 'Space Grotesk'", c: '#8a7f70', y: 212, ls: '.2em' } },
    v2: { A: { f: "400 18px/1 'Courier Prime'", c: '#333', y: 136 }, B: { f: "500 18px/1 'Space Grotesk'", c: '#1d1a16', y: 244 } },
    v3: { A: { f: "400 18px/1 'Courier Prime'", c: '#333', y: 162 }, B: { f: "500 18px/1 'Space Grotesk'", c: '#1d1a16', y: 270 } },
    v4: { A: { f: "400 18px/1 'Courier Prime'", c: '#333', y: 188 }, B: { f: "700 13px/1 'Space Grotesk'", c: '#ff7a45', y: 306, ls: '.2em' } } };
  var IDS = ['v0', 'v1', 'v2', 'v3', 'v4'], CF = [[40, 250], [300, 236], [70, 300], [250, 296], [160, 240], [320, 120], [26, 110], [200, 300]];
  function font(el, s){ el.style.font = s.f; el.style.color = s.c; el.style.letterSpacing = s.ls || 'normal'; }
  function at(w, n){ return V.at(w, n); }
  function anchors(words){
    V = KM.voice(TEXT, .12, words); PH = V.phrases(4); KM.reset(DUR);
    A.m1 = at('Move'); A.hero = at('hero'); A.m2 = at('Move', 2); A.sizes = at('sizes'); A.m3 = at('Move', 3); A.once = at('once'); A.turns = at('Turns'); A.cmt = at('Comment'); A.end = Math.min(DUR - .2, V.end + 1.2);
    window.COVER = .6;
    CAM = KM.rig({ x: 255, y: 480, z: 1, drift: .5 }).pushIn(A.m1, 1, 255, 500, 1.03).pull(A.turns - .2, .8, 255, 480, 1);
    var S = DT.S; S.whoosh(0, 270, .4); S.land(.1, 270, 0); S.roll(.25, 1.25, 300, 14); S.done(1.5, 300, 4);
    S.whoosh(A.m1 - .9, 270, .3); IDS.forEach(function(id, i){ S.land(A.m1 - .7 + i * .06, 270, i); });
    // move 1: the hero grows (a swell and a shimmer), the read order lands 1-2-3 as rising notes
    S.rise(A.hero - .4, .45); S.tint(A.hero + .35, 150); [0, 1, 2].forEach(function(n){ S.land(A.hero + .6 + n * .12, 200 + n * 60, n * 2); }); A.d1 = A.hero + .95; S.done(A.d1, 150, 0);
    // move 2: the scan flips every line, letter by letter, into one font
    S.rise(A.m2 - .1, .4); IDS.forEach(function(id, i){ S.swap(A.m2 + .4 + i * .14, .4, 270, 6); }); S.roll(A.m2 + .35, .75, 400, 4); S.land(A.sizes, 180, 6); A.d2 = A.m2 + 1.25; S.done(A.d2, 270, 2);
    // move 3: the confetti flies into the 7 (a run of plucks), the 7 takes the colour (shimmer)
    S.rise(A.m3 - .1, .4); for (var i = 0; i < 8; i++) S.land(A.m3 + .35 + i * .05, 120 + i * 40, i); S.tint(A.m3 + .7, 150); A.d3 = A.once + .1; S.done(A.d3, 150, 4);
    S.resolve(A.turns + .2); S.roll(A.cmt + .4, 1.2, 270, 15); S.click(A.cmt + .2, 270);
    window.ALIGN = [{ at: A.end - .05, sel: '.iv > span:first-child', edge: 'left', why: 'every line starts on one edge' }, { at: A.end - .05, sel: 'span', each: '.iv', edge: 'bottom', why: 'every letter on its line' }];
    window.HOLDS = [[A.end, DUR]]; KM.publish(DT.bed(A.turns));
  }
  function seek(t){
    t = Math.max(0, Math.min(DUR, t)); var c = CAM.apply($('world'), t, null); KM.lights(t, c);
    // the request: a comment types in, holds, then lifts away as the invite arrives
    var cm = $('cmt'), ci = E.out3(P(t, .1, .4)), co = E.inOut3(P(t, A.m1 - .9, A.m1 - .4)), txt = 'Fix a birthday invite, please!';
    cm.style.opacity = (ci * (1 - co)).toFixed(3); cm.style.transform = 'translateY(' + ((1 - ci) * 20 - 60 * co).toFixed(1) + 'px)';
    $('cmtT').textContent = txt.slice(0, Math.round(txt.length * P(t, .25, 1.5))) + (t < 1.6 ? '|' : '');
    var inv = $('inv'), ia = E.out3(P(t, A.m1 - .8, A.m1 - .2)); inv.style.opacity = (t < .1 ? 1 : mix(.35, 1, ia)).toFixed(3); inv.style.transform = 'translateY(' + ((1 - ia) * 30).toFixed(1) + 'px)';
    // move 1: the 7 grows into the hero; everything else steps down; read-order badges
    var k1 = DT.spring(t, A.hero, .8), k2 = P(t, A.m2 + .35, A.m2 + 1.1), k3 = DT.spring(t, A.m3 + .3, .7);
    IDS.forEach(function(id, i){ var el = $(id), a = ST[id].A, b = ST[id].B, t0f = A.m2 + .4 + i * .14, kf = P(t, t0f, t0f + .45);
      font(el, kf >= .5 ? b : a); DT.flipChars(el, t, t0f, .45, a, b);
      var w = el.offsetWidth, xA = (360 - w) / 2, x = mix(xA, 30, k1), y = mix(a.y, b.y, k1);
      var sh = kf >= 1 ? 1 : mix(1, id === 'v0' ? .72 : .66, k1); el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) scale(' + sh.toFixed(3) + ')'; });
    var b7 = $('big7'), s = mix(.2, 1, k1); b7.style.transform = 'translate(' + mix(250, 26, k1).toFixed(1) + 'px,' + mix(24, 10, k1).toFixed(1) + 'px) scale(' + s.toFixed(3) + ')'; b7.style.opacity = P(t, A.hero - .1, A.hero + .1).toFixed(3);
    b7.style.color = 'rgb(' + [Math.round(mix(29, 255, k3)), Math.round(mix(26, 122, k3)), Math.round(mix(22, 69, k3))].join(',') + ')';
    // the read order: 1 the hero, 2 whose party, 3 when and where
    [[1, IX + 178, IY + 40], [2, IX + 300, IY + 186], [3, IX + 250, IY + 256]].forEach(function(r, i){ var e = $('k' + r[0]), k = E.back(P(t, A.hero + .55 + i * .12, A.hero + .9 + i * .12), 2), o = k * (1 - P(t, A.m3 - .2, A.m3 + .1));
      e.style.left = r[1] + 'px'; e.style.top = r[2] + 'px'; e.style.opacity = cl(o).toFixed(3); e.style.transform = 'scale(' + (.5 + .5 * k).toFixed(3) + ')'; });
    DT.chip('h', 'ONE <b>HERO</b>', 300, 412, P(t, A.hero, A.hero + .3) - P(t, A.m2 - .1, A.m2 + .2));
    // move 2: the scan, the font count, the two sizes
    var sk = P(t, A.m2 + .35, A.m2 + 1.1); DT.line('scan', IX + 4, IY + 10 + sk * 320, IX + 356, IY + 10 + sk * 320, sk > 0 && sk < 1 ? 1 : 0, '#ffb35a', 3);
    DT.chip('f', 'FONTS <b>' + DT.roll(3, 1, sk) + '</b>', 300, 412, P(t, A.m2 + .2, A.m2 + .5) - P(t, A.m3 - .1, A.m3 + .2));
    DT.chip('s', 'SIZES <b>2</b>', 180, 412, P(t, A.sizes, A.sizes + .3) - P(t, A.m3 - .1, A.m3 + .2));
    // move 3: the confetti flies into the 7, which takes the one colour; the background calms
    for (var i = 0; i < 8; i++) { var e = $('c' + i), fk = E.inOut3(P(t, A.m3 + .3 + i * .05, A.m3 + .75 + i * .05)), x0 = CF[i][0], y0 = CF[i][1];
      e.style.left = mix(x0, 80, fk).toFixed(1) + 'px'; e.style.top = mix(y0, 80, fk).toFixed(1) + 'px'; e.style.opacity = (1 - P(fk, .8, 1)).toFixed(3); e.style.transform = 'scale(' + mix(1, .4, fk).toFixed(3) + ')'; }
    inv.style.background = 'rgb(' + [Math.round(mix(214, 255, k3)), Math.round(mix(240, 246, k3)), Math.round(mix(255, 232, k3))].join(',') + ')';
    DT.chip('c', 'COLOURS <b>' + DT.roll(6, 1, P(t, A.m3 + .3, A.m3 + 1)) + '</b>', 300, 412, P(t, A.m3 + .2, A.m3 + .5) - P(t, A.turns - .1, A.turns + .2));
    [[A.d1, IX + 90, IY + 90], [A.d2, IX + 180, IY + 230], [A.d3, IX + 90, IY + 90]].forEach(function(d, i){ DT.burst('b' + i, d[1], d[2], t, d[0], i === 2 ? '#ff7a45' : '#ffb35a'); });
    var br = Math.max(Math.sin(Math.PI * P(t, A.d1, A.d1 + .35)), Math.sin(Math.PI * P(t, A.d2, A.d2 + .35)), Math.sin(Math.PI * P(t, A.d3, A.d3 + .35))); inv.style.boxShadow = '0 30px 70px rgba(0,0,0,.55),0 0 0 ' + (3 * br).toFixed(1) + 'px rgba(255,179,90,.55)';
    DT.chip('done', 'DONE · <b>3 MOVES</b>', 300, 412, P(t, A.turns, A.turns + .3) - P(t, A.cmt - .2, A.cmt), 'g');
    // the ask: a comment box types the next request
    var ak = E.out3(P(t, A.cmt, A.cmt + .3)), ask = $('ask'), q = 'Fix my CV next!'; ask.style.opacity = ak.toFixed(3); ask.style.transform = 'translateY(' + ((1 - ak) * 16).toFixed(1) + 'px)';
    ask.textContent = 'Add a comment… ' + q.slice(0, Math.round(q.length * P(t, A.cmt + .4, A.cmt + 1.6))) + (Math.floor(t * 3) % 2 ? '|' : '');
    DT.cursor(t, CUR);
    DT.dial(t, [{ t: 0, sym: '?', label: 'YOU ASKED' }, { t: A.m1, n: 1, word: 'MOVE' }, { t: A.m2, n: 2, word: 'MOVE' }, { t: A.m3, n: 3, word: 'MOVE' }, { t: A.turns, end: 1, sym: '✓', label: 'FIXED' }]);
    DT.title(t, [{ t: 0, html: 'You asked: <em>fix it</em>' }, { t: A.m1, html: 'Move 1 · <em>one hero</em>' }, { t: A.m2, html: 'Move 2 · <em>one font</em>' }, { t: A.m3, html: 'Move 3 · <em>one colour</em>' }, { t: A.cmt, html: 'What do we fix <em>next</em>?' }]);
    KM.subs($('cap'), t, V, PH, 0, A.end, function(w){ return /^(invite|hero|age|font|sizes|colour|once|good|comment|next)/i.test(w) ? 'var(--amb)' : null; });
  }
  window.setVoice = function(v){ if (v && v.words && v.words.length) anchors(v.words); };
  window.seek = seek; window.DURATION = DUR;
  Promise.all(["400 30px 'Pacifico'", "400 26px 'Anton'", "400 18px 'Courier Prime'", "700 26px 'Space Grotesk'", "500 18px 'Space Grotesk'", "900 150px 'Unbounded'"].map(function(f){ return document.fonts.load(f); }))
    .then(function(){ IDS.forEach(function(id){ font($(id), ST[id].A); }); anchors(); seek(+(new URLSearchParams(location.search).get('t') || 0)); document.documentElement.dataset.ready = 1; });
})();
/*script:end*/
