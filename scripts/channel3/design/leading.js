/*css:begin*/
.rul{position:absolute;width:24px;border-radius:6px;background:repeating-linear-gradient(180deg,rgba(24,26,36,.9) 0 2px,transparent 2px 12px) left/9px 100% no-repeat,repeating-linear-gradient(180deg,rgba(24,26,36,.75) 0 2px,transparent 2px 60px) left/16px 100% no-repeat,linear-gradient(90deg,#ece7dd,#dcd5c7);box-shadow:0 10px 26px rgba(0,0,0,.35);z-index:1}
.rul.r{transform:scaleX(-1)}
#board{left:60px;top:396px;width:420px;height:372px;border-radius:10px;background:#fffdf7}
#rt{position:absolute;left:24px;top:18px;font:700 24px 'Space Grotesk';color:#1d1a16;white-space:nowrap}
#rs{position:absolute;left:24px;top:50px;font:500 13px 'Space Grotesk';color:#8a8276;letter-spacing:.14em;white-space:nowrap}
#steps{position:absolute;left:24px;top:78px;width:372px}
.st{position:relative;font:400 16.5px 'Space Grotesk';color:#2d2924}
.nm{position:absolute;left:-2px;top:0;width:24px;height:24px;border-radius:50%;background:#e0662f;color:#fff;font:700 13px/24px 'Space Grotesk';text-align:center;opacity:0}
#lemon{position:absolute;left:330px;top:14px;width:62px;height:46px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#fff6a8,#f5d327 55%,#d9a90c);transform:rotate(-18deg);box-shadow:0 4px 8px rgba(0,0,0,.15)}
/*css:end*/
/*board:begin*/
<div class="rul" style="left:8px;top:400px;height:246px"></div><div class="rul r" style="left:508px;top:400px;height:246px"></div>
<div id="board" class="board">
  <div id="lemon"></div>
  <div id="rt">Lemon lentil soup</div>
  <div id="rs">SERVES FOUR</div>
  <div id="steps">
    <div class="st" id="s0"><i class="nm">1</i><span>Rinse the lentils and chop an onion, two carrots and a stick of celery.</span></div>
    <div class="st" id="s1"><i class="nm">2</i><span>Warm a spoon of oil in a big pot and soften the vegetables gently.</span></div>
    <div class="st" id="s2"><i class="nm">3</i><span>Add the lentils, the stock and a pinch of cumin, then let it simmer.</span></div>
    <div class="st" id="s3"><i class="nm">4</i><span>When the lentils are soft, blend half the soup and stir it back in.</span></div>
    <div class="st" id="s4"><i class="nm">5</i><span>Finish with the juice of a lemon, salt and pepper, and serve hot.</span></div>
  </div>
</div>
/*board:end*/
/*script:begin*/
(function(){
  var $ = DT.$, P = KM.P, mix = KM.mix, E = KM.ease, cl = KM.cl; KM.theme('dark', 'turnsout'); DT.ctx(); DT.tint('#ffd23f', '#e0662f');
  var TEXT = "Nobody can cook from this. The lines are too tight. Turns out, lines need air. Fix one: more space between lines. Fix two: space between steps. Fix three: number each step. Easy to cook from.";
  var DUR = 16, BX = 60, BY = 396, V, PH, A = {}, CAM;
  function at(w, n){ return V.at(w, n); }
  function anchors(words){
    V = KM.voice(TEXT, .12, words); PH = V.phrases(4); KM.reset(DUR);
    A.hook = at('The') - .1; A.tight = at('tight'); A.turns = at('Turns'); A.air = at('air'); A.f1 = at('Fix'); A.lines = at('lines', 3); A.f2 = at('Fix', 2); A.steps = at('steps'); A.f3 = at('Fix', 3); A.number = at('number');
    A.easy = at('Easy'); A.cook = at('cook', 2); A.end = Math.min(DUR - .2, V.end + .8); A.e1 = Math.min(DUR - 1.8, A.cook + 1); A.e2 = Math.min(DUR - .8, A.cook + 2);
    window.COVER = .6;
    var S = DT.S; S.sting(0); [.35, .65].forEach(function(t0, i){ S.land(t0 + .05, 270, i + 1); KM.cue({ t: t0, k: 'tick', g: .08, p: i, x: 270, synth: true }); }); S.whoosh(0, 270, .4);
    S.stamp(A.tight + .1, 270); S.tint(A.air, 270);
    S.rise(A.f1 - .4, .45); S.drag(A.lines - .2, .7, 270, 270); A.d1 = A.lines + .6; S.done(A.d1, 270, 0);
    S.rise(A.f2 - .1, .4); for (var i = 0; i < 4; i++) S.snap(A.steps + i * .1, 200, i); A.d2 = A.steps + .6; S.done(A.d2, 270, 2);
    S.rise(A.f3 - .1, .4); for (i = 0; i < 5; i++) S.land(A.number + .1 + i * .09, 120, i * 2); A.d3 = A.number + .7; S.done(A.d3, 150, 4);
    S.reveal(A.cook); S.land(A.e1, 380, 5); S.done(A.e2, 270, 6);
    CAM = KM.rig({ x: 270, y: 490, z: 1.06, drift: 1 }).pull(0, .55, 270, 490, 1);
    [A.d1, A.d2, A.d3].forEach(function(d){ CAM.pushIn(d - .12, .28, 270, 490, 1.06).pull(d + .55, .6, 270, 490, 1); });
    window.ALIGN = [{ at: A.end - .05, sel: '.st > span', edge: 'left', why: 'every step starts on one edge' }, { at: A.end - .05, sel: '.nm', edge: 'left', why: 'the numbers on one edge' }];
    window.HOLDS = [[A.end, DUR]];
    KM.publish(DT.score(A.easy, A.f1));
  }
  function seek(t){
    t = Math.max(0, Math.min(DUR, t)); var c = CAM.apply($('world'), t, null); KM.lights(t, c);
    DT.intro($('board'), t + .6, .55);
    var k1 = DT.spring(t, A.lines - .1, .8), k2 = DT.spring(t, A.steps, .6), k3 = DT.spring(t, A.number, .6);
    for (var i = 0; i < 5; i++) { var st = $('s' + i), sp = st.querySelector('span'), nm = st.querySelector('.nm');
      st.style.lineHeight = mix(1.0, 1.4, k1).toFixed(3); st.style.marginBottom = (mix(0, 10, k2)).toFixed(2) + 'px'; st.style.paddingLeft = (34 * k3).toFixed(2) + 'px';
      var kn = E.back(P(t, A.number + .1 + i * .09, A.number + .45 + i * .09), 2.2); nm.style.opacity = cl(kn * 2).toFixed(3); nm.style.transform = 'scale(' + (.4 + .6 * kn).toFixed(3) + ')'; nm.style.top = ((16.5 * mix(1, 1.4, k1) - 24) / 2).toFixed(1) + 'px'; }
    $('lemon').style.transform = 'rotate(' + (-18 + Math.sin(t * 1.4) * 4).toFixed(2) + 'deg)';
    DT.mood(t, .34 * E.out3(P(t, A.d1 - .2, A.d1 + .5)) + .33 * E.out3(P(t, A.d2 - .2, A.d2 + .5)) + .33 * E.out3(P(t, A.d3 - .2, A.d3 + .5)));
    DT.sweep(t, [A.d1, A.d2, A.d3, A.cook]);
    DT.hook(t, '<i>Nobody</i> <i>can</i> <em><i>cook</i></em> <i>from</i> <i>this.</i>', A.hook);
    var ro = 1 - P(t, A.turns - .3, A.turns);
    [[.35, { x: BX + 16, y: BY + 74, w: 388, h: 170, r: 14 }, 'A WALL', BX + 20, BY + 320], [.65, { x: BX + 16, y: BY + 74, w: 388, h: 34, r: 10 }, 'TIGHT LINES', BX + 140, BY + 320]].forEach(function(q, i){
      DT.box('ring' + i, q[1], P(t, q[0], q[0] + .3) * ro, '#ff5f5f'); DT.chip('rl' + i, q[2], q[3], q[4], P(t, q[0] + .1, q[0] + .35) * ro, 'r sm'); });
    DT.chip('tg', 'LINES <b>TOO TIGHT</b>', 280, 396, P(t, A.tight - .1, A.tight + .2) - P(t, A.turns - .2, A.turns + .1), 'r');
    DT.chip('air', 'LINES NEED <b>AIR</b>', 150, 396, P(t, A.air - .1, A.air + .2) - P(t, A.f1 - .2, A.f1 + .1));
    // fix one: the leading opens, measured between the first two lines of step one
    var lh = 16.5 * mix(1, 1.4, k1), go = P(t, A.lines - .3, A.lines) * (1 - P(t, A.f2 - .2, A.f2 + .1)); for (var b = 1; b <= 3; b++) DT.line('bl' + b, BX + 24, BY + 78 + lh * b - 2, BX + 396, BY + 78 + lh * b - 2, go, '#ffb35a', 2, '4 6');
    DT.chip('c1', 'LINE SPACING · <b>OPEN</b>', 120, 396, P(t, A.lines, A.lines + .3) - P(t, A.f2 - .1, A.f2 + .2));
    // fix two: gaps between the steps, ticked
    var gy = BY + 78; for (i = 0; i < 4; i++) { var e = $('s' + i); gy = BY + 78 + e.offsetTop + e.offsetHeight; DT.line('gp' + i, BX + 40, gy + 5 * k2, BX + 380, gy + 5 * k2, P(t, A.steps + i * .1, A.steps + .2 + i * .1) * (1 - P(t, A.f3 - .2, A.f3 + .1)), '#ffb35a', 2, '6 5'); }
    DT.chip('c2', 'SPACE · <b>BETWEEN STEPS</b>', 120, 396, P(t, A.steps, A.steps + .3) - P(t, A.f3 - .1, A.f3 + .2));
    DT.chip('c3', 'NUMBER <b>EACH STEP</b>', 150, 396, P(t, A.number, A.number + .3) - P(t, A.easy - .2, A.easy + .1));
    [[A.d1, BX + 200, BY + 120], [A.d2, BX + 200, BY + 200], [A.d3, BX + 40, BY + 160]].forEach(function(d, j){ DT.burst('b' + j, d[1], d[2], t, d[0], '#ffb35a'); });
    var br = Math.max(Math.sin(Math.PI * P(t, A.d1, A.d1 + .35)), Math.sin(Math.PI * P(t, A.d2, A.d2 + .35)), Math.sin(Math.PI * P(t, A.d3, A.d3 + .35)));
    $('board').style.boxShadow = '0 30px 70px rgba(0,0,0,.55),0 0 0 ' + (3 * br).toFixed(1) + 'px rgba(255,179,90,.55)';
    DT.chip('win', 'EASY TO <b>COOK FROM</b>', 150, 396, P(t, A.cook - .2, A.cook + .1) - P(t, A.e2 - .2, A.e2 + .1), 'g');
    DT.chip('win2', 'SAME RECIPE · <b>MORE AIR</b>', 120, 396, P(t, A.e2, A.e2 + .3), 'g');
    // the tail: a tick lands on each step, one after another (as if cooked)
    for (i = 0; i < 5; i++) { var s2 = $('s' + i), yy = BY + 78 + s2.offsetTop + 12; DT.line('ck' + i + 'a', BX + 392, yy, BX + 398, yy + 6, P(t, A.e1 + i * .12, A.e1 + .15 + i * .12), '#2fb37a', 4); DT.line('ck' + i + 'b', BX + 398, yy + 6, BX + 410, yy - 8, P(t, A.e1 + .1 + i * .12, A.e1 + .25 + i * .12), '#2fb37a', 4); }
    DT.dial(t, [{ t: 0, sym: '3', label: '3 FIXES' }, { t: A.f1, n: 1 }, { t: A.f2, n: 2 }, { t: A.f3, n: 3 }, { t: A.easy, end: 1, sym: '✓', label: 'EASY' }]);
    DT.title(t, [{ t: A.hook, html: 'Why is it so <em>hard</em>?' }, { t: A.f1, html: 'Fix 1 · <em>line spacing</em>' }, { t: A.f2, html: 'Fix 2 · <em>step gaps</em>' }, { t: A.f3, html: 'Fix 3 · <em>numbers</em>' }, { t: A.easy, html: 'Room to <em>breathe.</em>' }]);
    KM.subs($('cap'), t, V, PH, Math.max(0, V.words.findIndex(function(w){ return w.s - V.lead >= A.hook - .25; })), A.end, function(w){ return /^(tight|air|space|lines|steps|number|easy|cook)/i.test(w) ? 'var(--amb)' : null; });
  }
  window.setVoice = function(v){ if (v && v.words && v.words.length) anchors(v.words); };
  window.seek = seek; window.DURATION = DUR; window.__A = A;
  Promise.all(["400 16.5px 'Space Grotesk'", "700 24px 'Space Grotesk'", "900 31px 'Unbounded'"].map(function(f){ return document.fonts.load(f); }))
    .then(function(){ anchors(); seek(+(new URLSearchParams(location.search).get('t') || 0)); document.documentElement.dataset.ready = 1; });
})();
/*script:end*/

/*stage:begin*/
<div style="position:absolute;inset:0;background:linear-gradient(165deg,#e9e4dc 0%,#d9d2c6 55%,#c9c0b2 100%)"></div>
<div style="position:absolute;inset:0;background:linear-gradient(120deg,transparent 20%,rgba(150,140,130,.18) 22%,transparent 26%,transparent 55%,rgba(150,140,130,.14) 57%,transparent 60%),linear-gradient(60deg,transparent 40%,rgba(120,110,100,.12) 41%,transparent 44%)"></div>
<div style="position:absolute;left:0;right:0;top:0;height:300px;background:repeating-linear-gradient(90deg,#f3f1ec 0 66px,#dcd8d0 66px 68px),#f3f1ec;opacity:.9"></div>
<div style="position:absolute;left:0;right:0;top:300px;height:12px;background:linear-gradient(180deg,#8f8a80,#c9c0b2)"></div>
<div style="position:absolute;left:420px;top:800px;width:180px;height:26px;border-radius:13px;background:linear-gradient(90deg,#b07a46,#d9a066);transform:rotate(-22deg);box-shadow:0 6px 10px rgba(0,0,0,.25)"></div>
<div style="position:absolute;left:-30px;top:820px;width:130px;height:130px;border-radius:50%;background:radial-gradient(circle,#f4f1ea 0 50px,#c64a2c 51px 62px,transparent 63px);box-shadow:0 8px 14px rgba(0,0,0,.2)"></div>
<div class="lit" style="background:radial-gradient(55% 40% at 50% 55%,rgba(255,240,210,.5),transparent 75%)"></div>
<div class="lit" style="background:linear-gradient(180deg,rgba(255,226,180,.12),rgba(255,200,140,.05))"></div>
/*stage:end*/
