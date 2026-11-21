/*css:begin*/
.rul{position:absolute;width:24px;border-radius:6px;background:repeating-linear-gradient(180deg,rgba(24,26,36,.9) 0 2px,transparent 2px 12px) left/9px 100% no-repeat,repeating-linear-gradient(180deg,rgba(24,26,36,.75) 0 2px,transparent 2px 60px) left/16px 100% no-repeat,linear-gradient(90deg,#ece7dd,#dcd5c7);box-shadow:0 10px 26px rgba(0,0,0,.35);z-index:1}
.rul.r{transform:scaleX(-1)}
#board{left:70px;top:396px;width:400px;height:370px;border-radius:4px;background:linear-gradient(170deg,#fdf6e6,#f0e2c6)}
.ev{position:absolute;left:0;top:0;white-space:nowrap;transform-origin:0 0;font-family:'Space Grotesk'}
#tt{font:900 34px var(--d);color:#1d2a52;letter-spacing:-.01em}
.lan{position:absolute;width:44px;height:58px;border-radius:16px;background:radial-gradient(60% 55% at 50% 50%,#fff2c4,#ffb347 60%,#e0701f);box-shadow:0 0 30px rgba(255,180,80,.7);transform-origin:50% -30px}
.lan::before{content:'';position:absolute;left:21px;top:-30px;width:2px;height:30px;background:rgba(255,230,190,.6)}
.pin{position:absolute;width:16px;height:16px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#ff9a8a,#c62f2f);box-shadow:0 3px 4px rgba(0,0,0,.4);z-index:5}
#beam{position:absolute;left:0;top:0;width:120px;height:120px;margin:-60px 0 0 -60px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.28),rgba(255,255,255,.08) 60%,transparent 70%);border:2px dashed rgba(255,255,255,.6);opacity:0;z-index:26}
/*css:end*/
/*board:begin*/
<div class="rul" style="left:8px;top:400px;height:246px"></div><div class="rul r" style="left:508px;top:400px;height:246px"></div>
<div id="board" class="board">
  <div class="lan" id="ln0" style="left:318px;top:196px"></div><div class="lan" id="ln1" style="left:352px;top:262px"></div><div class="lan" id="ln2" style="left:290px;top:282px"></div>
  <div class="ev" id="tt">LANTERN WALK</div>
  <div class="ev" id="d1">Saturday 23 Nov</div>
  <div class="ev" id="d2">7 PM</div>
  <div class="ev" id="pl">Riverside Park, east gate</div>
  <div class="ev" id="ex">Free · bring a torch</div>
  <div class="pin" style="left:8px;top:8px"></div><div class="pin" style="left:376px;top:8px"></div>
</div>
<div id="beam"></div>
/*board:end*/
/*script:begin*/
(function(){
  var $ = DT.$, P = KM.P, mix = KM.mix, E = KM.ease, cl = KM.cl; KM.theme('dark', 'turnsout'); DT.ctx(); DT.tint('#ffd27a', '#ff7a45');
  var TEXT = "When is this event? You can't tell. Turns out, related things sit together. Fix one: date and time together. Fix two: the place right under. Fix three: space between groups. Found it in a second.";
  var DUR = 16, BX = 70, BY = 396, V, PH, A = {}, CAM;
  // A: date, time and place scattered, tiny and tilted; 1: date and time in one block; 2: the place under it; 3: space between the groups
  var EV = {
    tt: { A: { x: 22, y: 112, s: 1, r: -3 }, B: { x: 28, y: 34, s: 1, r: 0 }, g: 0 },
    d1: { A: { x: 252, y: 24, s: .62, r: 7 }, B: { x: 28, y: 92, s: 1, r: 0 }, f: 1 },
    d2: { A: { x: 28, y: 318, s: .62, r: -9 }, B: { x: 28, y: 124, s: 1, r: 0 }, f: 1 },
    pl: { A: { x: 168, y: 246, s: .66, r: 11 }, B: { x: 28, y: 160, s: 1, r: 0 }, f: 2 },
    ex: { A: { x: 30, y: 190, s: .8, r: -5 }, B: { x: 28, y: 300, s: 1, r: 0 }, f: 2 } };
  var IDS = ['tt', 'd1', 'd2', 'pl', 'ex'];
  function at(w, n){ return V.at(w, n); }
  function anchors(words){
    V = KM.voice(TEXT, .12, words); PH = V.phrases(4); KM.reset(DUR);
    A.hook = at('You') - .1; A.tell = at('tell'); A.turns = at('Turns'); A.tog = at('together'); A.f1 = at('Fix'); A.date = at('date'); A.tog2 = at('together', 2); A.f2 = at('Fix', 2); A.under = at('under'); A.f3 = at('Fix', 3); A.groups = at('groups');
    A.found = at('Found'); A.second = at('second'); A.end = Math.min(DUR - .2, V.end + .8); A.e1 = Math.min(DUR - 1.8, A.second + .9); A.e2 = Math.min(DUR - .8, A.second + 2);
    window.COVER = .6;
    var S = DT.S; S.sting(0); [.35, .65, .95].forEach(function(t0, i){ S.land(t0 + .05, 270, i + 1); KM.cue({ t: t0, k: 'tick', g: .08, p: i, x: 270, synth: true }); }); S.whoosh(0, 270, .4);
    S.drag(A.hook, .5, 400, 120); S.drag(A.hook + .5, .5, 120, 360); S.stamp(A.tell + .1, 270); S.tint(A.tog, 270);
    S.rise(A.f1 - .4, .45); S.click(A.date - .1, 380); S.drag(A.date, .6, 380, 120); S.snap(A.tog2, 120, 0); S.snap(A.tog2 + .15, 120, 1); A.d1 = A.tog2 + .45; S.done(A.d1, 150, 0);
    S.rise(A.f2 - .1, .4); S.drag(A.under - .2, .4, 300, 120); S.snap(A.under + .2, 120, 2); A.d2 = A.under + .5; S.done(A.d2, 150, 2);
    S.rise(A.f3 - .1, .4); S.drag(A.groups - .1, .6, 270, 270); A.d3 = A.groups + .6; S.done(A.d3, 270, 4);
    S.whoosh(A.found - .1, 270, .3); S.reveal(A.second); S.land(A.e1, 200, 5); S.done(A.e2, 270, 6);
    CAM = KM.rig({ x: 270, y: 490, z: 1.06, drift: 1 }).pull(0, .55, 270, 490, 1);
    [A.d1, A.d2, A.d3].forEach(function(d){ CAM.pushIn(d - .12, .28, 270, 490, 1.06).pull(d + .55, .6, 270, 490, 1); });
    window.ALIGN = [{ at: A.end - .05, sel: '.ev', edge: 'left', why: 'every group starts on one edge' }];
    window.HOLDS = [[A.end, DUR]];
    KM.publish(DT.score(A.found, A.f1));
  }
  function seek(t){
    t = Math.max(0, Math.min(DUR, t)); var c = CAM.apply($('world'), t, null); KM.lights(t, c);
    DT.intro($('board'), t + .6, .55);
    var K = [0, DT.spring(t, A.date + .1, .8), DT.spring(t, A.under - .1, .7), DT.spring(t, A.groups - .05, .8)], k3 = K[3];
    IDS.forEach(function(id){ var e = EV[id], el = $(id), k = id === 'tt' ? K[1] : K[e.f], a = e.A, b = e.B, gy = id === 'tt' ? 0 : (id === 'ex' ? 0 : 14 * k3);
      var x = mix(a.x, b.x, k), y = mix(a.y, b.y, k) + gy - (id === 'tt' ? 0 : 0), s = mix(a.s, b.s, k), r = mix(a.r, b.r, k);
      if (id === 'd1' || id === 'd2') { el.style.font = '700 20px var(--f)'; el.style.color = '#1d1a16'; } else if (id === 'pl') { el.style.font = '500 17px var(--f)'; el.style.color = '#44506e'; } else if (id === 'ex') { el.style.font = '500 15px var(--f)'; el.style.color = '#c4572a'; el.style.letterSpacing = '.04em'; }
      el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) rotate(' + r.toFixed(2) + 'deg) scale(' + s.toFixed(3) + ')'; });
    for (var i = 0; i < 3; i++) { var ln = $('ln' + i); ln.style.transform = 'rotate(' + (Math.sin(t * 1.6 + i * 1.3) * 6).toFixed(2) + 'deg) scale(' + [1, .8, .7][i] + ')'; }
    DT.mood(t, .34 * E.out3(P(t, A.d1 - .2, A.d1 + .5)) + .33 * E.out3(P(t, A.d2 - .2, A.d2 + .5)) + .33 * E.out3(P(t, A.d3 - .2, A.d3 + .5)));
    DT.sweep(t, [A.d1, A.d2, A.d3, A.second]);
    DT.hook(t, '<i>When</i> <i>is</i> <i>this</i> <em><i>event?</i></em>', A.hook);
    // frame 0: the three facts ringed where they hide
    var ro = 1 - P(t, A.turns - .3, A.turns);
    [[.35, { x: BX + 244, y: BY + 14, w: 120, h: 34, r: 10 }, 'DATE?', BX + 290, BY + 330], [.65, { x: BX + 20, y: BY + 306, w: 66, h: 34, r: 10 }, 'TIME?', BX + 20, BY + 330], [.95, { x: BX + 160, y: BY + 238, w: 150, h: 58, r: 12 }, 'WHERE?', BX + 150, BY + 330]].forEach(function(q, i){
      DT.box('ring' + i, q[1], P(t, q[0], q[0] + .3) * ro, '#ff5f5f'); DT.chip('rl' + i, q[2], q[3], q[4], P(t, q[0] + .1, q[0] + .35) * ro, 'r sm'); });
    // the search beam hunts across the poster (lost), and at the end finds the block at once
    var bm = $('beam'), hu = P(t, A.hook, A.turns), pts = [[BX + 80, BY + 60], [BX + 320, BY + 300], [BX + 120, BY + 220], [BX + 300, BY + 90], [BX + 200, BY + 180]], si = Math.min(3, Math.floor(hu * 4)), sf = E.inOut3(hu * 4 - si);
    var bx = mix(pts[si][0], pts[si + 1][0], sf), by = mix(pts[si][1], pts[si + 1][1], sf), fo = P(t, A.found - .2, A.found + .2), fx = BX + 100, fy = BY + mix(EV.d1.B.y, EV.d2.B.y, .5) + 20;
    if (t >= A.found - .2) { bx = mix(BX + 300, fx, E.out3(P(t, A.found - .2, A.found + .2))); by = mix(BY + 300, fy, E.out3(P(t, A.found - .2, A.found + .2))); }
    bm.style.left = bx.toFixed(1) + 'px'; bm.style.top = by.toFixed(1) + 'px'; bm.style.opacity = Math.max(P(t, A.hook, A.hook + .2) * (1 - P(t, A.turns, A.turns + .3)), fo * (1 - P(t, A.e1, A.e1 + .3))).toFixed(3);
    DT.chip('lost', 'DATE · <b>LOST</b>', 300, 396, P(t, A.tell - .1, A.tell + .2) - P(t, A.turns - .2, A.turns + .1), 'r');
    DT.chip('tg', 'RELATED · <b>TOGETHER</b>', 120, 396, P(t, A.tog - .1, A.tog + .2) - P(t, A.f1 - .2, A.f1 + .1));
    // fix one: date and time pulled into one block
    var b1 = { x: BX + 22, y: BY + 86 + 14 * k3, w: 210, h: 66 }; DT.sel('s1', b1, P(t, A.tog2 - .2, A.tog2 + .2) * (1 - P(t, A.d1 + .2, A.d1 + .5)));
    DT.chip('c1', 'DATE + TIME · <b>ONE BLOCK</b>', 120, 396, P(t, A.tog2, A.tog2 + .3) - P(t, A.f2 - .1, A.f2 + .2));
    // fix two: the place snaps in right under
    DT.line('g2', BX + 28, BY + 154 + 14 * k3, BX + 300, BY + 154 + 14 * k3, P(t, A.under - .2, A.under + .2) * (1 - P(t, A.d2 + .2, A.d2 + .5)), '#ffb35a', 2, '6 5');
    DT.chip('c2', 'PLACE · <b>RIGHT UNDER</b>', 160, 396, P(t, A.under, A.under + .3) - P(t, A.f3 - .1, A.f3 + .2));
    // fix three: the gaps between groups open, measured
    var mk = P(t, A.groups - .1, A.groups + .3) * (1 - P(t, A.found - .2, A.found + .1));
    DT.measure('gA', BX + 300, BY + 76, BY + 86 + 14 * k3, mk, 'GAP', 1); DT.measure('gB', BX + 300, BY + 186 + 14 * k3, BY + 296, mk, 'GAP', 1);
    DT.chip('c3', 'SPACE · <b>BETWEEN GROUPS</b>', 120, 396, P(t, A.groups, A.groups + .3) - P(t, A.found - .2, A.found + .1));
    [[A.d1, BX + 120, BY + 120], [A.d2, BX + 120, BY + 175], [A.d3, BX + 300, BY + 200]].forEach(function(d, i){ DT.burst('b' + i, d[1], d[2], t, d[0], '#ffb35a'); });
    var br = Math.max(Math.sin(Math.PI * P(t, A.d1, A.d1 + .35)), Math.sin(Math.PI * P(t, A.d2, A.d2 + .35)), Math.sin(Math.PI * P(t, A.d3, A.d3 + .35)));
    $('board').style.boxShadow = '0 30px 70px rgba(0,0,0,.55),0 0 0 ' + (3 * br).toFixed(1) + 'px rgba(255,179,90,.55)';
    DT.box('fd', { x: BX + 18, y: BY + 84 + 14 * k3, w: 240, h: 110, r: 12 }, P(t, A.second - .2, A.second + .3), '#5ee0a0');
    DT.chip('win', 'FOUND IN <b>A SECOND</b>', 150, 396, P(t, A.second - .2, A.second + .1) - P(t, A.e2 - .2, A.e2 + .1), 'g');
    DT.chip('win2', 'WHEN · WHERE · <b>GROUPED</b>', 120, 396, P(t, A.e2, A.e2 + .3), 'g');
    DT.burst('b3', BX + 250, BY + 100, t, A.e1, '#5ee0a0');
    DT.dial(t, [{ t: 0, sym: '3', label: '3 FIXES' }, { t: A.f1, n: 1 }, { t: A.f2, n: 2 }, { t: A.f3, n: 3 }, { t: A.found, end: 1, sym: '✓', label: 'FOUND' }]);
    DT.title(t, [{ t: A.hook, html: 'Where is the <em>date</em>?' }, { t: A.f1, html: 'Fix 1 · <em>one block</em>' }, { t: A.f2, html: 'Fix 2 · <em>place under</em>' }, { t: A.f3, html: 'Fix 3 · <em>space groups</em>' }, { t: A.found, html: 'Found it. <em>Fast.</em>' }]);
    KM.subs($('cap'), t, V, PH, Math.max(0, V.words.findIndex(function(w){ return w.s - V.lead >= A.hook - .25; })), A.end, function(w){ return /^(tell|together|date|time|place|under|space|groups|second)/i.test(w) ? 'var(--amb)' : null; });
  }
  window.setVoice = function(v){ if (v && v.words && v.words.length) anchors(v.words); };
  window.seek = seek; window.DURATION = DUR; window.__A = A;
  Promise.all(["700 20px 'Space Grotesk'", "500 17px 'Space Grotesk'", "900 34px 'Unbounded'", "900 31px 'Unbounded'"].map(function(f){ return document.fonts.load(f); }))
    .then(function(){ anchors(); seek(+(new URLSearchParams(location.search).get('t') || 0)); document.documentElement.dataset.ready = 1; });
})();
/*script:end*/

/*stage:begin*/
<div style="position:absolute;inset:0;background:linear-gradient(180deg,#b88d5e 0%,#a87d50 50%,#946a42 100%)"></div>
<div style="position:absolute;inset:0;background:radial-gradient(circle,rgba(70,40,15,.35) 1px,transparent 1.6px) 0 0/7px 7px,radial-gradient(circle,rgba(255,230,190,.18) 1px,transparent 1.6px) 3px 4px/9px 9px"></div>
<div style="position:absolute;left:-20px;top:-20px;width:580px;height:30px;background:linear-gradient(180deg,#6b4a2c,#4e341e)"></div>
<div style="position:absolute;left:-10px;top:300px;width:90px;height:120px;background:#f4efe4;transform:rotate(-8deg);box-shadow:0 6px 12px rgba(0,0,0,.3)"></div>
<div style="position:absolute;left:470px;top:520px;width:100px;height:130px;background:#ffe27a;transform:rotate(7deg);box-shadow:0 6px 12px rgba(0,0,0,.3)"></div>
<div style="position:absolute;left:60px;top:800px;width:150px;height:110px;background:#cfe8ff;transform:rotate(4deg);box-shadow:0 6px 12px rgba(0,0,0,.3)"></div>
<div style="position:absolute;left:330px;top:810px;width:140px;height:100px;background:#ffd0d8;transform:rotate(-6deg);box-shadow:0 6px 12px rgba(0,0,0,.3)"></div>
<div class="lit" style="background:radial-gradient(55% 40% at 50% 55%,rgba(255,226,170,.5),transparent 75%)"></div>
<div class="lit" style="background:linear-gradient(180deg,rgba(255,200,130,.14),rgba(255,170,100,.05))"></div>
/*stage:end*/
