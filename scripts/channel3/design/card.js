/*css:begin*/
.rul{position:absolute;width:24px;border-radius:6px;background:repeating-linear-gradient(180deg,rgba(24,26,36,.9) 0 2px,transparent 2px 12px) left/9px 100% no-repeat,repeating-linear-gradient(180deg,rgba(24,26,36,.75) 0 2px,transparent 2px 60px) left/16px 100% no-repeat,linear-gradient(90deg,#ece7dd,#dcd5c7);box-shadow:0 10px 26px rgba(0,0,0,.35);z-index:1}
.rul.r{transform:scaleX(-1)}
#board{left:50px;top:420px;width:440px;height:252px;border-radius:10px;background:linear-gradient(160deg,#f6f2ea,#ebe4d6)}
.bc{position:absolute;left:0;top:0;white-space:nowrap;transform-origin:0 0;font-family:'Space Grotesk';color:#22201c}
#logo{width:46px;height:46px;border-radius:10px;background:#22201c;color:#f6f2ea;font:900 26px/46px var(--d);text-align:center}
#c0{font:700 28px 'Space Grotesk';letter-spacing:-.01em}
#c1{font:500 19px 'Space Grotesk';color:#4a443c}
#c2{font:500 19px 'Space Grotesk';color:#4a443c}
#c3,#c4,#c5{font:500 18px 'Space Grotesk';color:#6a6258}
#mg{position:absolute;left:0;top:0;width:440px;height:252px;pointer-events:none;z-index:6}
/*css:end*/
/*board:begin*/
<div class="rul" style="left:8px;top:400px;height:246px"></div><div class="rul r" style="left:508px;top:400px;height:246px"></div>
<div id="board" class="board">
  <div class="bc" id="logo">Q</div>
  <div class="bc" id="c0">ARJUN MEHTA</div>
  <div class="bc" id="c1">Architect &amp; Interior Designer</div>
  <div class="bc" id="c2">hello@quillmere.studio</div>
  <div class="bc" id="c3">Homes · Offices · Gardens · Lighting</div>
  <div class="bc" id="c4">Mumbai · Pune · Goa · Online</div>
  <div class="bc" id="c5">Call · Write · Visit the studio</div>
</div>
/*board:end*/
/*script:begin*/
(function(){
  var $ = DT.$, P = KM.P, mix = KM.mix, E = KM.ease, cl = KM.cl; KM.theme('dark', 'turnsout'); DT.ctx(); DT.tint('#e9c46a', '#ff7a45');
  var TEXT = "This business card feels cheap. Why? Everything touches the edges. Turns out, margins make it calm. Fix one: pull everything in. Fix two: fewer lines. Fix three: one strong corner. Same card, now it feels premium.";
  var DUR = 16, BX = 50, BY = 420, CW = 440, CH = 252, M = 32, V, PH, A = {}, CAM;
  // A: every line pushed to the card's edges; 1: the same, pulled inside a 32 px margin; 3: logo top left, the name, role and email grouped in the bottom left
  var IT = { logo: { A: [366, 6, 1], B: [M, M, .8] }, c0: { A: [12, 4, 1], B: [M, 138, .9] }, c1: { A: [12, 46, 1], B: [M, 174, .82] }, c2: { A: [12, 82, 1], B: [M, 198, .82] },
    c3: { A: [12, 116, 1], drop: 1 }, c4: { A: [12, 150, 1], drop: 1 }, c5: { A: [12, 218, 1], drop: 1 } };
  var IDS = ['logo', 'c0', 'c1', 'c2', 'c3', 'c4', 'c5'];
  function inset(a){ var s = (CW - 2 * M) / (CW - 24); return [M + (a[0] - 12) * s, M + (a[1] - 4) * ((CH - 2 * M) / (CH - 12)), a[2] * s]; }
  function at(w, n){ return V.at(w, n); }
  function anchors(words){
    V = KM.voice(TEXT, .12, words); PH = V.phrases(4); KM.reset(DUR);
    A.hook = at('Why') - .1; A.edges = at('edges'); A.turns = at('Turns'); A.calm = at('calm'); A.f1 = at('Fix'); A.pull = at('pull'); A.f2 = at('Fix', 2); A.fewer = at('fewer'); A.f3 = at('Fix', 3); A.corner = at('corner');
    A.same = at('Same'); A.prem = at('premium'); A.end = Math.min(DUR - .2, V.end + .8); A.e1 = Math.min(DUR - 1.8, A.prem + .9); A.e2 = Math.min(DUR - .8, A.prem + 2);
    window.COVER = .6;
    var S = DT.S; S.sting(0); [.35, .65, .95].forEach(function(t0, i){ S.land(t0 + .05, 270, i + 1); KM.cue({ t: t0, k: 'tick', g: .08, p: i, x: 270, synth: true }); }); S.whoosh(0, 270, .4);
    S.stamp(A.edges + .1, 270); S.tint(A.calm, 270);
    S.rise(A.f1 - .4, .45); S.drag(A.pull, .6, 470, 270); A.d1 = A.pull + .7; S.done(A.d1, 270, 0);
    S.rise(A.f2 - .1, .4); [0, 1, 2].forEach(function(j){ S.whoosh(A.fewer + j * .12, 400, .2); }); A.d2 = A.fewer + .6; S.done(A.d2, 270, 2);
    S.rise(A.f3 - .1, .4); S.drag(A.corner - .2, .5, 300, 120); S.snap(A.corner + .25, 120, 3); A.d3 = A.corner + .6; S.done(A.d3, 150, 4);
    S.reveal(A.prem); S.tint(A.e1, 120); S.done(A.e2, 270, 6);
    CAM = KM.rig({ x: 270, y: 490, z: 1.03, drift: 1 }).pull(0, .55, 270, 490, 1);
    [A.d1, A.d2, A.d3].forEach(function(d){ CAM.pushIn(d - .12, .28, 270, 490, 1.03).pull(d + .55, .6, 270, 490, 1); });
    window.ALIGN = [{ at: A.end - .05, sel: '#logo, #c0, #c1, #c2', edge: 'left', why: 'logo, name, role and email on one edge' }];
    window.HOLDS = [[A.end, DUR]];
    KM.publish(DT.score(A.same, A.f1));
  }
  function seek(t){
    t = Math.max(0, Math.min(DUR, t)); var c = CAM.apply($('world'), t, null); KM.lights(t, c);
    DT.intro($('board'), t + .6, .55);
    var k1 = DT.spring(t, A.pull, .8), k3 = DT.spring(t, A.corner - .1, .8);
    IDS.forEach(function(id, i){ var it = IT[id], a = it.A, b1 = inset(a), b = it.B || b1, el = $(id);
      var p = [mix(a[0], b1[0], k1), mix(a[1], b1[1], k1), mix(a[2], b1[2], k1)]; p = [mix(p[0], b[0], k3), mix(p[1], b[1], k3), mix(p[2], b[2], k3)];
      var o = 1; if (it.drop) { var kd = P(t, A.fewer + (i - 4) * .12, A.fewer + .35 + (i - 4) * .12); o = 1 - kd; p[0] += 40 * kd * kd; }
      el.style.transform = 'translate(' + p[0].toFixed(1) + 'px,' + p[1].toFixed(1) + 'px) scale(' + p[2].toFixed(3) + ')'; el.style.opacity = o.toFixed(3); });
    var gl = E.out3(P(t, A.e1, A.e1 + .6)); $('logo').style.background = 'linear-gradient(135deg,' + (gl > 0 ? '#c9a14a,#f3dc8a ' + (30 + 40 * gl).toFixed(0) + '%,#b08a3a' : '#22201c,#22201c') + ')'; $('logo').style.color = gl > 0 ? '#22201c' : '#f6f2ea';
    DT.mood(t, .34 * E.out3(P(t, A.d1 - .2, A.d1 + .5)) + .33 * E.out3(P(t, A.d2 - .2, A.d2 + .5)) + .33 * E.out3(P(t, A.d3 - .2, A.d3 + .5)));
    DT.sweep(t, [A.d1, A.d2, A.d3, A.prem]);
    DT.hook(t, '<i>This</i> <i>business</i> <i>card</i> <i>feels</i> <em><i>cheap.</i></em>', A.hook);
    var ro = 1 - P(t, A.turns - .3, A.turns);
    [[.35, { x: BX + 2, y: BY + 2, w: 200, h: 40, r: 8 }, 'ON THE EDGE', BX + 268, BY + 266], [.65, { x: BX + 368, y: BY + 2, w: 54, h: 54, r: 8 }, 'CORNER', BX + 150, BY + 266], [.95, { x: BX + 2, y: BY + 110, w: 400, h: 140, r: 10 }, 'TOO MUCH', BX + 6, BY + 266]].forEach(function(q, j){
      DT.box('ring' + j, q[1], P(t, q[0], q[0] + .3) * ro, '#ff5f5f'); DT.chip('rl' + j, q[2], q[3], q[4], P(t, q[0] + .1, q[0] + .35) * ro, 'r sm'); });
    DT.chip('ed', 'TOUCHES <b>THE EDGES</b>', 200, 396, P(t, A.edges - .1, A.edges + .2) - P(t, A.turns - .2, A.turns + .1), 'r');
    DT.chip('cm', 'MARGINS = <b>CALM</b>', 150, 396, P(t, A.calm - .1, A.calm + .2) - P(t, A.f1 - .2, A.f1 + .1));
    // fix one: the margin guides draw in from the edges, measured, and everything moves inside them
    var mk = P(t, A.pull - .3, A.pull + .1) * (1 - P(t, A.f3 - .2, A.f3 + .1)); DT.box('mg', { x: BX + M, y: BY + M, w: CW - 2 * M, h: CH - 2 * M, r: 4 }, mk, '#ff7aa8', '6 5');
    DT.hmeasure('ml', BX, BX + M, BY + CH - 8, mk, 'MARGIN');
    DT.chip('c1x', 'PULL <b>EVERYTHING IN</b>', 150, 396, P(t, A.pull, A.pull + .3) - P(t, A.f2 - .1, A.f2 + .2));
    // fix two: three lines strike through and slide away
    [3, 4, 5].forEach(function(n, j){ var it = IT['c' + n], b1 = inset(it.A), y = BY + b1[1] + 11, kk = P(t, A.fewer - .2 + j * .12, A.fewer + .05 + j * .12); DT.line('st' + n, BX + b1[0], y, BX + b1[0] + 300, y, kk * (1 - P(t, A.fewer + .35 + j * .12, A.fewer + .5 + j * .12)), '#ff5f5f', 3); });
    DT.chip('c2x', 'FEWER <b>LINES</b>', 280, 396, P(t, A.fewer, A.fewer + .3) - P(t, A.f3 - .1, A.f3 + .2));
    // fix three: one corner holds the text block
    DT.sel('cs', { x: BX + M - 6, y: BY + 132, w: 260, h: 92 }, P(t, A.corner, A.corner + .3) * (1 - P(t, A.d3 + .2, A.d3 + .5)));
    DT.line('cv', BX + 18, BY + 120, BX + 18, BY + CH - 18, P(t, A.corner + .1, A.corner + .4) * (1 - P(t, A.same - .2, A.same + .1)), '#ffb35a', 3); DT.line('ch', BX + 18, BY + CH - 18, BX + 200, BY + CH - 18, P(t, A.corner + .2, A.corner + .5) * (1 - P(t, A.same - .2, A.same + .1)), '#ffb35a', 3);
    DT.chip('c3x', 'ONE STRONG <b>CORNER</b>', 150, 396, P(t, A.corner, A.corner + .3) - P(t, A.same - .2, A.same + .1));
    [[A.d1, BX + CW / 2, BY + CH / 2], [A.d2, BX + 300, BY + 160], [A.d3, BX + 40, BY + 210]].forEach(function(d, j){ DT.burst('b' + j, d[1], d[2], t, d[0], '#ffb35a'); });
    var br = Math.max(Math.sin(Math.PI * P(t, A.d1, A.d1 + .35)), Math.sin(Math.PI * P(t, A.d2, A.d2 + .35)), Math.sin(Math.PI * P(t, A.d3, A.d3 + .35)));
    $('board').style.boxShadow = '0 30px 70px rgba(0,0,0,.55),0 0 0 ' + (3 * br).toFixed(1) + 'px rgba(255,179,90,.55)';
    DT.chip('win', 'SAME CARD · <b>PREMIUM</b>', 150, 396, P(t, A.prem - .2, A.prem + .1) - P(t, A.e2 - .2, A.e2 + .1), 'g');
    DT.chip('win2', 'SPACE · <b>CALM · ONE CORNER</b>', 100, 396, P(t, A.e2, A.e2 + .3), 'g');
    DT.burst('b3', BX + M + 20, BY + M + 18, t, A.e1 + .2, '#f3dc8a');
    DT.dial(t, [{ t: 0, sym: '3', label: '3 FIXES' }, { t: A.f1, n: 1 }, { t: A.f2, n: 2 }, { t: A.f3, n: 3 }, { t: A.same, end: 1, sym: '✓', label: 'PREMIUM' }]);
    DT.title(t, [{ t: A.hook, html: 'Why so <em>cheap</em>?' }, { t: A.f1, html: 'Fix 1 · <em>margins</em>' }, { t: A.f2, html: 'Fix 2 · <em>fewer lines</em>' }, { t: A.f3, html: 'Fix 3 · <em>one corner</em>' }, { t: A.same, html: 'Same card. <em>Premium.</em>' }]);
    KM.subs($('cap'), t, V, PH, Math.max(0, V.words.findIndex(function(w){ return w.s - V.lead >= A.hook - .25; })), A.end, function(w){ return /^(cheap|edges|margins|calm|pull|fewer|corner|premium)/i.test(w) ? 'var(--amb)' : null; });
  }
  window.setVoice = function(v){ if (v && v.words && v.words.length) anchors(v.words); };
  window.seek = seek; window.DURATION = DUR; window.__A = A;
  Promise.all(["700 30px 'Space Grotesk'", "500 19px 'Space Grotesk'", "900 26px 'Unbounded'", "900 31px 'Unbounded'"].map(function(f){ return document.fonts.load(f); }))
    .then(function(){ anchors(); seek(+(new URLSearchParams(location.search).get('t') || 0)); document.documentElement.dataset.ready = 1; });
})();
/*script:end*/

/*stage:begin*/
<div style="position:absolute;inset:0;background:linear-gradient(165deg,#6a4a33 0%,#563a27 55%,#45301f 100%)"></div>
<div style="position:absolute;inset:0;background:repeating-linear-gradient(86deg,rgba(25,12,4,.2) 0 2px,transparent 2px 26px),repeating-linear-gradient(92deg,rgba(255,220,180,.06) 0 1px,transparent 1px 47px)"></div>
<div style="position:absolute;left:250px;top:700px;width:340px;height:240px;background:#f2ede2;transform:rotate(-6deg);box-shadow:0 12px 24px rgba(0,0,0,.35);background-image:repeating-linear-gradient(180deg,transparent 0 26px,rgba(90,120,180,.25) 26px 27px)"></div>
<div style="position:absolute;left:30px;top:760px;width:240px;height:12px;border-radius:6px;background:linear-gradient(90deg,#1b1b1b,#3a3a3a 80%,#c9a24a 80% 86%,#1b1b1b 86%);transform:rotate(12deg);box-shadow:0 6px 10px rgba(0,0,0,.4)"></div>
<div style="position:absolute;left:84px;top:690px;width:400px;height:250px;border-radius:10px;background:#e3dccd;transform:rotate(-4deg);box-shadow:0 10px 18px rgba(0,0,0,.3)"></div>
<div class="lit" style="background:radial-gradient(55% 40% at 50% 50%,rgba(255,230,190,.5),transparent 75%)"></div>
<div class="lit" style="background:linear-gradient(180deg,rgba(255,210,150,.14),rgba(255,180,110,.05))"></div>
/*stage:end*/
