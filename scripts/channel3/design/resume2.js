/*css:begin*/
.rul{position:absolute;width:24px;border-radius:6px;background:repeating-linear-gradient(180deg,rgba(24,26,36,.9) 0 2px,transparent 2px 12px) left/9px 100% no-repeat,repeating-linear-gradient(180deg,rgba(24,26,36,.75) 0 2px,transparent 2px 60px) left/16px 100% no-repeat,linear-gradient(90deg,#ece7dd,#dcd5c7);box-shadow:0 10px 26px rgba(0,0,0,.35);z-index:1}
.rul.r{transform:scaleX(-1)}
#board{left:66px;top:396px;width:408px;height:384px;border-radius:4px;background:#fbfaf6}
.cv{position:absolute;left:0;top:0;white-space:nowrap;transform-origin:0 50%}
.rk{position:absolute;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;background:#7aa2ff;color:#fff;font:900 16px/34px var(--d);text-align:center;z-index:26;opacity:0;box-shadow:0 6px 16px rgba(0,0,0,.4)}
#eye{position:absolute;left:0;top:0;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;background:#ff5f5f;box-shadow:0 0 0 6px rgba(255,95,95,.25);opacity:0;z-index:26}
#stamp{position:absolute;left:300px;top:20px;padding:8px 14px;border:3px solid #1f8a5b;border-radius:10px;color:#1f8a5b;font:900 18px var(--d);letter-spacing:.06em;transform:rotate(-8deg);opacity:0;z-index:4}
/*css:end*/
/*board:begin*/
<div class="rul" style="left:8px;top:400px;height:246px"></div><div class="rul r" style="left:508px;top:400px;height:246px"></div>
<div id="board" class="board">
  <div class="cv" id="n0">Meera Iyer</div>
  <div class="cv" id="n1">Product designer · Pune</div>
  <div class="cv" id="h0">EXPERIENCE</div>
  <div class="cv" id="e0">Senior designer, Tallow Studio</div>
  <div class="cv" id="e1">Led the redesign of a booking app</div>
  <div class="cv" id="h1">EDUCATION</div>
  <div class="cv" id="d0">Design degree, Northfield Institute</div>
  <div class="cv" id="h2">SKILLS</div>
  <div class="cv" id="s0">Layout · Type · Prototyping</div>
  <div id="stamp">CLEAR ✓</div>
</div>
<div class="rk" id="k1">1</div><div class="rk" id="k2">2</div><div class="rk" id="k3">3</div>
<div id="eye"></div>
/*board:end*/
/*script:begin*/
(function(){
  var $ = DT.$, P = KM.P, mix = KM.mix, E = KM.ease, cl = KM.cl; KM.theme('dark', 'turnsout'); DT.ctx(); DT.tint('#7aa2ff', '#ff7a45');
  // spoken sentences, not labels (rules-c3.md V1): a believable first draft (one size for every line, the way a blank document starts; B1)
  var TEXT = "Every line here looks the same. So nothing stands out. Turns out, your eyes need an order. First, make the name the biggest. Next, headings get their own colour. Then let the details go lighter. Now it reads top to bottom.";
  var DUR = 17.8, BX = 66, BY = 396, L = 30, V, PH, A = {}, CAM;
  var IDS = ['n0', 'n1', 'h0', 'e0', 'e1', 'h1', 'd0', 'h2', 's0'], KIND = { n0: 'name', h0: 'head', h1: 'head', h2: 'head' };
  // A: every line one size and one colour, evenly spaced, headings only bold (a document's defaults); B: the name biggest, headings one step down (accent, tracked), details plain and grouped
  var YA = [24, 58, 92, 126, 160, 194, 228, 262, 296], YB = [26, 74, 116, 144, 172, 218, 246, 292, 320];
  var SAME = { f: "400 18px 'Space Grotesk'", c: '#1d1a16' }, HSAME = { f: "700 18px 'Space Grotesk'", c: '#1d1a16' }, PLAIN = { f: "400 17px 'Space Grotesk'", c: '#6a645b' }, HEAD = { f: "700 17px 'Space Grotesk'", c: '#c4572a', ls: '.1em' };
  function font(el, s){ el.style.font = s.f; el.style.color = s.c; el.style.letterSpacing = s.ls || 'normal'; }
  function at(w, n){ return V.at(w, n); }
  function anchors(words){
    V = KM.voice(TEXT, .12, words); PH = V.phrases(4); KM.reset(DUR);
    A.hook = at('So') - .1; A.out = at('out'); A.turns = at('Turns'); A.order = at('order'); A.f1 = at('First'); A.name = at('name'); A.big = at('biggest'); A.f2 = at('Next'); A.head = at('headings'); A.down = at('colour');
    A.f3 = at('Then'); A.plain = at('lighter'); A.now = at('Now'); A.bottom = at('bottom'); A.proof = A.bottom + .7; A.e2 = A.proof + 1.05; A.end = Math.min(DUR - .2, A.e2 + 1.4);   // the before/after proof, then the stamp, then a hold on the frame that shows both
    window.COVER = .6;
    var S = DT.S; S.sting(0); [.35, .65, .95].forEach(function(t0, i){ S.land(t0 + .05, 270, i + 1); KM.cue({ t: t0, k: 'tick', g: .08, p: i, x: 270, synth: true }); }); S.whoosh(0, 270, .4);
    for (var i = 0; i < 5; i++) KM.cue({ t: A.hook + .1 + i * .22, k: 'tick', g: .07, p: i * 2 % 7, x: 150 + (i % 2) * 240, synth: true });
    S.stamp(A.out + .1, 270); S.tint(A.order, 270);
    S.rise(A.f1 - .4, .45); S.click(A.name - .1, 150); S.drag(A.name, .5, 150, 300); A.d1 = A.big + .4; S.done(A.d1, 200, 0);
    S.rise(A.f2 - .1, .4); [0, 1, 2].forEach(function(j){ S.snap(A.head + .2 + j * .15, 120, j); }); A.d2 = A.down + .4; S.done(A.d2, 270, 2);
    A.scan = at('details') - .05;   // the details change on the word that names them (critic, 24 Nov: it started 1 s early)
    S.rise(A.f3 - .1, .4); [3, 4, 6, 8, 1].forEach(function(j, i){ S.swap(A.scan + i * .14, .35, 270, 5); }); A.d3 = A.scan + 1.1; S.done(A.d3, 270, 4);
    [0, 1, 2].forEach(function(j){ S.land(A.now + .2 + j * .3, 180 + j * 60, j * 2); }); S.reveal(A.bottom); S.flip(A.proof, .5); S.stamp(A.e2, 420);
    CAM = KM.rig({ x: 270, y: 490, z: 1.06, drift: 1 }).pull(0, .55, 270, 490, 1);
    // each fix seen close (DT.close): the camera goes in before it lands and back out after
    DT.close(CAM, A.d1, 1.1); DT.close(CAM, A.d2, 1.07); DT.close(CAM, A.d3, 1.07);
    window.ALIGN = [{ at: A.end - .05, sel: '.cv > span:first-child', edge: 'left', why: 'every line starts on one edge' }, { at: A.end - .05, sel: 'span', each: '.cv', edge: 'bottom', why: 'every letter on its line' }];
    window.HOLDS = [[A.end, DUR]];
    KM.publish(DT.score(A.now, A.f1));
  }
  function seek(t){
    t = Math.max(0, Math.min(DUR, t)); var c = CAM.apply($('world'), t, null); KM.lights(t, c);
    DT.intro($('board'), t + .6, .55);
    var k1 = DT.spring(t, A.name, .8), k2 = DT.spring(t, A.head + .1, .7), kg = DT.spring(t, A.plain + .4, .8);
    IDS.forEach(function(id, i){ var el = $(id), kind = KIND[id], y = id === 'n0' ? mix(YA[i], YB[i], k1) : mix(YA[i] + 22 * k1, YB[i], kg);
      if (kind === 'name') { var NF = { f: (k1 > .25 ? '700 ' : '400 ') + mix(18, 38, k1).toFixed(2) + "px 'Space Grotesk'", c: '#1d1a16', ls: mix(0, -.01, k1).toFixed(3) + 'em' }; font(el, NF); DT.flipChars(el, t, -9, .1, NF, NF); }
      else if (kind === 'head') { var t0 = A.head + .2 + ['h0', 'h1', 'h2'].indexOf(id) * .15; DT.flipChars(el, t, t0, .4, HSAME, HEAD); }
      else { var j = ['n1', 'e0', 'e1', 'd0', 's0'].indexOf(id), t1 = A.scan + j * .14; DT.flipChars(el, t, t1, .35, SAME, PLAIN); }
      el.style.transform = 'translate(' + L + 'px,' + y.toFixed(2) + 'px)'; });
    DT.mood(t, .34 * E.out3(P(t, A.d1 - .2, A.d1 + .5)) + .33 * E.out3(P(t, A.d2 - .2, A.d2 + .5)) + .33 * E.out3(P(t, A.d3 - .2, A.d3 + .5)));
    DT.sweep(t, [A.d1, A.d2, A.d3, A.bottom, A.e2 + .55]);
    DT.hook(t, '<i>Every</i> <i>line</i> <i>looks</i> <em><i>the</i> <i>same.</i></em>', A.hook);
    // frame 0: the problems ringed
    var ro = 1 - P(t, A.turns - .3, A.turns);
    [[.35, { x: BX + 20, y: BY + 14, w: 360, h: 312, r: 16 }, 'ONE SIZE', 40, BY + 336], [.65, { x: BX + 22, y: BY + 16, w: 140, h: 30, r: 10 }, 'NAME = TEXT', 166, BY + 336], [.95, { x: BX + 22, y: BY + 84, w: 140, h: 30, r: 10 }, 'NO ORDER', 320, BY + 336]].forEach(function(r, i){
      DT.box('ring' + i, r[1], P(t, r[0], r[0] + .3) * ro, '#ff5f5f'); DT.chip('rl' + i, r[2], r[3], r[4], P(t, r[0] + .1, r[0] + .35) * ro, 'r sm'); });
    // "nothing stands out": a red eye dot zigzags from line to line, lost
    var ez = P(t, .25, A.turns), ee = $('eye'), seg = ez * 6, sI = Math.floor(seg), sf = E.inOut3(seg - sI), pts = [[60, 40], [330, 140], [90, 270], [300, 60], [120, 200], [320, 300], [200, 160]];
    var p0 = pts[Math.min(6, sI)], p1 = pts[Math.min(6, sI + 1)]; ee.style.left = (BX + mix(p0[0], p1[0], sf)).toFixed(1) + 'px'; ee.style.top = (BY + mix(p0[1], p1[1], sf)).toFixed(1) + 'px'; ee.style.opacity = (P(t, .25, .45) * (1 - P(t, A.turns, A.turns + .3))).toFixed(3);
    DT.chip('out', 'NOTHING <b>STANDS OUT</b>', 150, 396, P(t, A.out - .1, A.out + .2) - P(t, A.turns - .2, A.turns + .1), 'r');
    DT.chip('ord', 'EYES NEED <b>AN ORDER</b>', 150, 396, P(t, A.order - .1, A.order + .2) - P(t, A.f1 - .2, A.f1 + .1));
    // fix one: the name selected and dragged bigger
    var nw = $('n0').offsetWidth, nh = mix(26, 50, k1);
    DT.sel('sn', { x: BX + L - 6, y: BY + 22, w: nw + 12, h: nh }, P(t, A.name - .2, A.name + .1) * (1 - P(t, A.d1, A.d1 + .3)));
    DT.chip('c1', 'NAME · <b>BIGGEST</b>', 260, 396, P(t, A.big - .1, A.big + .2) - P(t, A.f2 - .1, A.f2 + .2));
    // fix two: the headings flip, tick marks on each
    ['h0', 'h1', 'h2'].forEach(function(id, j){ var y = BY + mix(YA[IDS.indexOf(id)], YB[IDS.indexOf(id)], kg) + 2, o = P(t, A.head + .2 + j * .15, A.head + .4 + j * .15) * (1 - P(t, A.f3, A.f3 + .3)); DT.line('hk' + j, BX + 14, y, BX + 14, y + 18, o, '#ffb35a', 4); });
    DT.chip('c2', 'HEADINGS · <b>OWN COLOUR</b>', 120, 396, P(t, A.down - .2, A.down + .1) - P(t, A.f3 - .1, A.f3 + .2));
    // fix three: the scan, details turn plain, the groups open up
    var sk = P(t, A.scan, A.scan + 1); DT.line('scan', BX + 4, BY + 60 + sk * 280, BX + 404, BY + 60 + sk * 280, sk > 0 && sk < 1 ? 1 : 0, '#ffb35a', 3);
    DT.chip('c3', 'DETAILS · <b>LIGHTER</b>', 260, 396, P(t, A.plain, A.plain + .3) - P(t, A.now - .2, A.now + .1));
    [[A.d1, BX + 120, BY + 50], [A.d2, BX + 60, BY + 120], [A.d3, BX + 200, BY + 200]].forEach(function(d, i){ DT.burst('b' + i, d[1], d[2], t, d[0], '#ffb35a'); });
    var br = Math.max(Math.sin(Math.PI * P(t, A.d1, A.d1 + .35)), Math.sin(Math.PI * P(t, A.d2, A.d2 + .35)), Math.sin(Math.PI * P(t, A.d3, A.d3 + .35)));
    $('board').style.boxShadow = '0 30px 70px rgba(0,0,0,.55),0 0 0 ' + (3 * br).toFixed(1) + 'px rgba(255,179,90,.55)';
    // the read order 1-2-3 and the eye path straight down
    [[1, BX + 250, BY + 46], [2, BX + 210, BY + 126], [3, BX + 330, BY + 156]].forEach(function(r, i){ var e = $('k' + r[0]), k = E.back(P(t, A.now + .2 + i * .3, A.now + .55 + i * .3), 2);
      e.style.left = r[1] + 'px'; e.style.top = r[2] + 'px'; e.style.opacity = cl(k).toFixed(3); e.style.transform = 'scale(' + (.5 + .5 * k).toFixed(3) + ')'; });
    DT.line('path', BX + 16, BY + 28, BX + 16, BY + 340, P(t, A.bottom - .3, A.bottom + .5), '#5ee0a0', 4);
    DT.chip('win', 'READS <b>TOP TO BOTTOM</b>', 150, 396, P(t, A.bottom - .2, A.bottom + .1), 'g');
    DT.proof(t, A.proof, { flash: .5, x: 12, y: 762, s: .46, tx: 212, ty: 754 });
    var sp = E.back(P(t, A.e2, A.e2 + .35), 2.5), st = $('stamp'); st.style.opacity = cl(sp * 3).toFixed(3); st.style.transform = 'rotate(-8deg) scale(' + (1.8 - .8 * sp).toFixed(3) + ')';
    DT.dial(t, [{ t: 0, sym: '3', label: '3 FIXES' }, { t: A.f1, n: 1 }, { t: A.f2, n: 2 }, { t: A.f3, n: 3 }, { t: A.now, end: 1, sym: '✓', label: 'IN ORDER' }]);
    DT.title(t, [{ t: A.hook, html: 'What <em>stands out</em>?' }, { t: A.f1, html: 'Fix 1 · <em>name biggest</em>' }, { t: A.f2, html: 'Fix 2 · <em>headings</em>' }, { t: A.f3, html: 'Fix 3 · <em>details lighter</em>' }, { t: A.now, html: 'One, two, <em>three.</em>' }]);
    KM.subs($('cap'), t, V, PH, Math.max(0, V.words.findIndex(function(w){ return w.s - V.lead >= A.hook - .25; })), A.end, function(w){ return /^(same|nothing|order|name|biggest|headings|colour|lighter|bottom)/i.test(w) ? 'var(--amb)' : null; });
  }
  window.setVoice = function(v){ if (v && v.words && v.words.length) anchors(v.words); };
  window.seek = seek; window.DURATION = DUR; window.__A = A;
  Promise.all(["700 18px 'Space Grotesk'", "400 18px 'Space Grotesk'", "400 17px 'Space Grotesk'", "900 31px 'Unbounded'"].map(function(f){ return document.fonts.load(f); }))
    .then(function(){ IDS.forEach(function(id){ font($(id), KIND[id] === 'head' ? HSAME : SAME); }); anchors(); seek(1.2); DT.keep($('board')); seek(+(new URLSearchParams(location.search).get('t') || 0)); document.documentElement.dataset.ready = 1; });
})();
/*script:end*/

/*stage:begin*/
<div style="position:absolute;inset:0;background:linear-gradient(160deg,#5b3d2b 0%,#4a3123 55%,#3a261b 100%)"></div>
<div style="position:absolute;inset:0;background:repeating-linear-gradient(88deg,rgba(20,10,4,.18) 0 2px,transparent 2px 23px),repeating-linear-gradient(91deg,rgba(255,220,180,.06) 0 1px,transparent 1px 41px)"></div>
<div style="position:absolute;left:452px;top:300px;width:150px;height:150px;border-radius:50%;background:radial-gradient(circle,#2a160c 0 42px,#6a3c22 43px 46px,#f2ece2 47px 60px,#ddd2c2 61px 72px,rgba(0,0,0,.25) 73px,transparent 78px)"></div>
<div style="position:absolute;left:40px;top:860px;width:300px;height:12px;border-radius:6px;background:linear-gradient(90deg,#1d3d6e,#3a6aa8 70%,#d9d9d9 70% 74%,#c9a24a 74%);transform:rotate(-8deg);box-shadow:0 6px 10px rgba(0,0,0,.35)"></div>
<div class="lit" style="background:radial-gradient(52% 38% at 48% 55%,rgba(255,226,180,.5),transparent 75%)"></div>
<div class="lit" style="background:linear-gradient(180deg,rgba(255,200,140,.14),rgba(255,170,100,.05))"></div>
/*stage:end*/
