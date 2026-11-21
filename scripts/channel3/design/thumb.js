/*css:begin*/
.rul{position:absolute;width:24px;border-radius:6px;background:repeating-linear-gradient(180deg,rgba(24,26,36,.9) 0 2px,transparent 2px 12px) left/9px 100% no-repeat,repeating-linear-gradient(180deg,rgba(24,26,36,.75) 0 2px,transparent 2px 60px) left/16px 100% no-repeat,linear-gradient(90deg,#ece7dd,#dcd5c7);box-shadow:0 10px 26px rgba(0,0,0,.35);z-index:1}
.rul.r{transform:scaleX(-1)}
#board{left:110px;top:396px;width:320px;height:384px;border-radius:0 0 44px 44px;background:#f6f3ee;border:11px solid #15161c;border-top:none}
#hd{position:absolute;left:18px;top:28px;font:700 22px 'Space Grotesk';color:#1d1a16;white-space:nowrap}
#hd small{font:500 15px 'Space Grotesk';color:#8a8276;margin-left:8px}
#card{position:absolute;left:14px;top:66px;width:270px;height:170px;border-radius:18px;background:#fff;box-shadow:0 6px 18px rgba(60,40,20,.12);overflow:hidden}
#pic{position:absolute;left:0;top:0;width:270px;height:96px;background:radial-gradient(circle at 30% 60%,#e2563c 0 16px,transparent 17px),radial-gradient(circle at 52% 40%,#f2b33d 0 20px,transparent 21px),radial-gradient(circle at 74% 62%,#6aa84f 0 15px,transparent 16px),radial-gradient(circle at 50% 50%,#fffaf2 0 46px,#e8dccb 47px 52px,transparent 53px),linear-gradient(135deg,#3a2a20,#5a4030)}
.ln{position:absolute;left:16px;white-space:nowrap}
.btn{position:absolute;left:0;top:0;border-radius:999px;display:flex;align-items:center;justify-content:center;white-space:nowrap;font-family:'Space Grotesk'}
#bk{background:#1d1a16;color:#fff;font-weight:700}
#cn{background:#ece6dc;color:#5a5248;font-weight:500}
#thumb{position:absolute;left:0;top:0;width:96px;height:190px;border-radius:48px 48px 40px 40px;background:linear-gradient(90deg,#c98a66,#e9b996 45%,#d79f7b);box-shadow:-8px 14px 26px rgba(40,20,10,.45);z-index:27;transform-origin:50% 12%}
#thumb::before{content:'';position:absolute;left:20px;top:12px;width:56px;height:60px;border-radius:28px 28px 22px 22px;background:linear-gradient(180deg,#f6d9c6,#ecc2a6);box-shadow:inset 0 -3px 0 rgba(180,110,80,.25)}
.rip{position:absolute;left:0;top:0;width:60px;height:60px;margin:-30px 0 0 -30px;border-radius:50%;border:4px solid #ff5f5f;opacity:0;z-index:26}
#print{position:absolute;left:0;top:0;width:84px;height:84px;margin:-42px 0 0 -42px;border-radius:50%;border:3px dashed #ffb35a;background:rgba(255,179,90,.16);opacity:0;z-index:26}
#toast{position:absolute;left:14px;top:24px;width:270px;height:40px;border-radius:14px;background:#1f8a5b;color:#fff;font:700 17px/40px 'Space Grotesk';text-align:center;opacity:0;z-index:3}
/*css:end*/
/*board:begin*/
<div class="rul" style="left:8px;top:400px;height:246px"></div><div class="rul r" style="left:508px;top:400px;height:246px"></div>
<div id="board" class="board">
  <div id="hd">Nook<small>book a table</small></div>
  <div id="card"><div id="pic"></div>
    <div class="ln" id="l0" style="top:106px;font:700 19px 'Space Grotesk';color:#1d1a16">The Lantern Room</div>
    <div class="ln" id="l1" style="top:134px;font:500 15px 'Space Grotesk';color:#6f675c">Friday · 8 PM · 2 people</div>
  </div>
  <div class="btn" id="bk">Book</div>
  <div class="btn" id="cn">Cancel</div>
  <div id="toast">Table booked ✓</div>
</div>
<div class="rip" id="rp0"></div><div class="rip" id="rp1"></div><div class="rip" id="rp2" style="border-color:#5ee0a0"></div>
<div id="print"></div>
<div id="thumb"></div>
/*board:end*/
/*script:begin*/
(function(){
  var $ = DT.$, P = KM.P, mix = KM.mix, E = KM.ease, cl = KM.cl; KM.theme('dark', 'turnsout'); DT.ctx(); DT.tint('#ffb35a', '#ff7a45');
  var TEXT = "Your thumb keeps missing this button. It's tiny. Turns out, a thumb needs room. Fix one: make it bigger. Fix two: space between buttons. Fix three: the main one, biggest. One tap, every time.";
  var DUR = 16, BX = 121, BY = 396, V, PH, A = {}, CAM;
  // the two buttons in board-screen px (inside the 11 px bezel): A tiny and touching, 1 bigger, 2 apart, 3 the main one full width
  var BK = [{ x: 168, y: 300, w: 52, h: 22, f: 11 }, { x: 40, y: 286, w: 112, h: 52, f: 18 }, { x: 28, y: 286, w: 116, h: 52, f: 18 }, { x: 14, y: 252, w: 270, h: 60, f: 22 }];
  var CN = [{ x: 222, y: 300, w: 56, h: 22, f: 11 }, { x: 156, y: 286, w: 112, h: 52, f: 18 }, { x: 168, y: 286, w: 116, h: 52, f: 18 }, { x: 89, y: 326, w: 120, h: 40, f: 16 }];
  function lerp(a, b, k){ return { x: mix(a.x, b.x, k), y: mix(a.y, b.y, k), w: mix(a.w, b.w, k), h: mix(a.h, b.h, k), f: mix(a.f, b.f, k) }; }
  function at(w, n){ return V.at(w, n); }
  function anchors(words){
    V = KM.voice(TEXT, .12, words); PH = V.phrases(4); KM.reset(DUR);
    A.hook = at('It\'s') - .1; A.tiny = at('tiny'); A.turns = at('Turns'); A.room = at('room'); A.f1 = at('Fix'); A.big = at('bigger'); A.f2 = at('Fix', 2); A.space = at('space'); A.f3 = at('Fix', 3); A.main = at('main'); A.most = at('biggest');
    A.one = at('One', 3); A.every = at('every'); A.end = Math.min(DUR - .2, V.end + .8); A.e1 = Math.min(DUR - 1.6, A.every + 1); A.e2 = Math.min(DUR - .8, A.every + 2);
    A.miss = [.45, 1.25]; A.tap = A.one + .1;
    window.COVER = .6;
    var S = DT.S; S.sting(0); S.whoosh(0, 270, .4);
    A.miss.forEach(function(m, i){ S.drag(m - .35, .3, 470, 380); S.click(m, 380); S.stamp(m + .05, 380); });
    [.35, .65].forEach(function(t0, i){ S.land(t0 + .05, 300, i + 1); });
    S.roll(A.tiny, .3, 330, 3); S.tint(A.room, 300);
    S.rise(A.f1 - .4, .45); S.drag(A.big - .1, .5, 220, 320); A.d1 = A.big + .6; S.done(A.d1, 270, 0);
    S.rise(A.f2 - .1, .4); S.drag(A.space, .5, 200, 340); A.d2 = A.space + .6; S.done(A.d2, 270, 2);
    S.rise(A.f3 - .1, .4); S.whoosh(A.main, 270, .3); S.snap(A.most, 270, 3); A.d3 = A.most + .45; S.done(A.d3, 270, 4);
    S.drag(A.tap - .35, .3, 470, 270); S.click(A.tap, 270); S.reveal(A.every); S.land(A.e1, 270, 5); S.done(A.e2, 270, 6);
    CAM = KM.rig({ x: 270, y: 490, z: 1.06, drift: 1 }).pull(0, .55, 270, 490, 1);
    [A.d1, A.d2, A.d3].forEach(function(d){ CAM.pushIn(d - .12, .28, 270, 490, 1.06).pull(d + .55, .6, 270, 490, 1); });
    window.ALIGN = [{ at: A.end - .05, sel: '.ln', edge: 'left', why: 'the card lines start on one edge' }];
    window.HOLDS = [[A.end, DUR]];
    KM.publish(DT.score(A.one, A.f1));
  }
  // the thumb: [t, x, y, press] in world px (its tip), from the bottom right
  function thumbKeys(){ var b = A.miss; return [[0, 470, 760, 0], [b[0] - .3, 400, 712, 0], [b[0], 396, 706, 1], [b[0] + .25, 420, 730, 0], [b[1] - .3, 404, 712, 0], [b[1], 398, 708, 1], [b[1] + .3, 470, 790, 0],
    [A.f1 - .2, 520, 900, 0], [A.tap - .45, 470, 780, 0], [A.tap, 270, 684, 1], [A.tap + .3, 330, 760, 0], [A.e1, 500, 900, 0]]; }
  function thumb(t){ var K = thumbKeys(), a = K[0], b = K[0]; for (var i = 0; i < K.length; i++) if (K[i][0] <= t) { a = K[i]; b = K[i + 1] || K[i]; }
    var k = b === a ? 1 : E.inOut3(P(t, a[0], b[0])), x = mix(a[1], b[1], k), y = mix(a[2], b[2], k), pr = (k > .7 ? b[3] : a[3]) ? 1 : 0;
    var e = $('thumb'); e.style.transform = 'translate(' + (x - 48).toFixed(1) + 'px,' + (y - 8).toFixed(1) + 'px) rotate(-28deg) scale(' + (pr ? .95 : 1) + ')'; }
  function ripple(id, x, y, t, t0, col){ var e = $(id), u = P(t, t0, t0 + .5); e.style.left = x + 'px'; e.style.top = y + 'px'; e.style.opacity = (u > 0 && u < 1 ? 1 - u : 0).toFixed(3); e.style.transform = 'scale(' + (.4 + 1.2 * E.out3(u)).toFixed(3) + ')'; }
  function seek(t){
    t = Math.max(0, Math.min(DUR, t)); var c = CAM.apply($('world'), t, null); KM.lights(t, c);
    DT.intro($('board'), t + .6, .55);
    var k1 = DT.spring(t, A.big - .1, .7), k2 = DT.spring(t, A.space, .7), k3 = DT.spring(t, A.most - .2, .7);
    var b = lerp(lerp(lerp(BK[0], BK[1], k1), BK[2], k2), BK[3], k3), n = lerp(lerp(lerp(CN[0], CN[1], k1), CN[2], k2), CN[3], k3);
    [['bk', b], ['cn', n]].forEach(function(r){ var e = $(r[0]), q = r[1]; e.style.transform = 'translate(' + q.x.toFixed(1) + 'px,' + q.y.toFixed(1) + 'px)'; e.style.width = q.w.toFixed(1) + 'px'; e.style.height = q.h.toFixed(1) + 'px'; e.style.fontSize = q.f.toFixed(1) + 'px'; });
    var pressed = t >= A.tap && t < A.tap + .25; $('bk').style.background = t >= A.tap + .1 ? '#1f8a5b' : (k3 > .5 ? '#e0662f' : '#1d1a16'); $('bk').textContent = t >= A.tap + .1 ? 'Booked ✓' : 'Book a table'.slice(0, k3 > .5 ? 12 : 4);
    $('bk').style.boxShadow = pressed ? 'inset 0 3px 8px rgba(0,0,0,.3)' : (k3 > .5 ? '0 8px 18px rgba(224,102,47,.35)' : 'none');
    $('cn').style.background = k3 > .5 ? 'transparent' : '#ece6dc'; $('cn').style.textDecoration = k3 > .5 ? 'underline' : 'none';
    // the missed taps: red ripples on Cancel (the wrong button), the hit: a green one on Book
    ripple('rp0', BX + 238, BY + 311, t, A.miss[0], 0); ripple('rp1', BX + 244, BY + 311, t, A.miss[1], 0); ripple('rp2', 270, BY + 282, t, A.tap, 0);
    DT.chip('m0', 'MISSED · <b>CANCEL</b>', 280, 398, P(t, A.miss[0] + .1, A.miss[0] + .3) - P(t, A.hook, A.hook + .3), 'r sm');
    thumb(t);
    DT.mood(t, .34 * E.out3(P(t, A.d1 - .2, A.d1 + .5)) + .33 * E.out3(P(t, A.d2 - .2, A.d2 + .5)) + .33 * E.out3(P(t, A.d3 - .2, A.d3 + .5)));
    DT.sweep(t, [A.d1, A.d2, A.d3, A.every]);
    DT.hook(t, '<i>Your</i> <i>thumb</i> <i>keeps</i> <em><i>missing</i></em> <i>this</i> <i>button.</i>', A.hook);
    // frame 0: the problems ringed
    var ro = 1 - P(t, A.turns - .3, A.turns);
    [[.35, { x: BX + 160, y: BY + 292, w: 126, h: 38, r: 12 }, 'TINY', BX + 150, BY + 344], [.65, { x: BX + 214, y: BY + 288, w: 16, h: 46, r: 8 }, 'NO GAP', BX + 230, BY + 344]].forEach(function(r, i){
      DT.box('ring' + i, r[1], P(t, r[0], r[0] + .3) * ro, '#ff5f5f'); DT.chip('rl' + i, r[2], r[3], r[4], P(t, r[0] + .1, r[0] + .35) * ro, 'r sm'); });
    // "it's tiny": the button's width measured against the thumb print
    DT.hmeasure('w0', BX + 168, BX + 220, BY + 280, P(t, A.tiny - .1, A.tiny + .3) * (1 - P(t, A.f1, A.f1 + .3)), 'TINY');
    var pr = $('print'), po = P(t, A.room - .4, A.room) * (1 - P(t, A.f1 + .2, A.f1 + .5)); pr.style.left = (BX + 194) + 'px'; pr.style.top = (BY + 311) + 'px'; pr.style.opacity = po.toFixed(3); pr.style.transform = 'scale(' + (.6 + .4 * E.back(po, 2)).toFixed(3) + ')';
    DT.chip('rm', 'THUMB <b>&gt; BUTTON</b>', 120, 396, P(t, A.room - .2, A.room + .1) - P(t, A.f1 - .2, A.f1 + .1));
    // fix one: the buttons grow to fingertip size
    DT.sel('s1', { x: BX + b.x - 6, y: BY + b.y - 6, w: n.x + n.w - b.x + 12, h: b.h + 12 }, P(t, A.big - .3, A.big) * (1 - P(t, A.d1, A.d1 + .3)));
    DT.chip('c1', 'FINGERTIP <b>SIZE</b>', 120, 396, P(t, A.big, A.big + .3) - P(t, A.f2 - .1, A.f2 + .2));
    // fix two: the gap opens, measured
    DT.hmeasure('g', BX + b.x + b.w, BX + n.x, BY + 270, P(t, A.space, A.space + .3) * (1 - P(t, A.f3 - .2, A.f3 + .1)), 'ROOM');
    DT.chip('c2', 'SPACE <b>BETWEEN</b>', 280, 396, P(t, A.space, A.space + .3) - P(t, A.f3 - .1, A.f3 + .2));
    // fix three: the main action takes the full width
    DT.sel('s3', { x: BX + b.x - 6, y: BY + b.y - 6, w: b.w + 12, h: b.h + 12 }, P(t, A.main, A.main + .3) * (1 - P(t, A.d3 + .2, A.d3 + .5)));
    DT.chip('c3', 'MAIN ONE <b>BIGGEST</b>', 120, 396, P(t, A.most - .1, A.most + .2) - P(t, A.one - .2, A.one + .1));
    [[A.d1, BX + 150, BY + 312], [A.d2, BX + 150, BY + 312], [A.d3, 270, BY + 282], [A.tap + .1, 270, BY + 282]].forEach(function(d, i){ DT.burst('b' + i, d[1], d[2], t, d[0], i === 3 ? '#5ee0a0' : '#ffb35a'); });
    var br = Math.max(Math.sin(Math.PI * P(t, A.d1, A.d1 + .35)), Math.sin(Math.PI * P(t, A.d2, A.d2 + .35)), Math.sin(Math.PI * P(t, A.d3, A.d3 + .35)));
    $('board').style.boxShadow = '0 30px 70px rgba(0,0,0,.55),0 0 0 ' + (3 * br).toFixed(1) + 'px rgba(255,179,90,.55)';
    DT.chip('win', 'ONE TAP · <b>EVERY TIME</b>', 150, 396, P(t, A.every - .2, A.every + .1) - P(t, A.e2 - .2, A.e2 + .1), 'g'); DT.chip('win2', 'NO MORE <b>MISSES</b>', 150, 396, P(t, A.e2, A.e2 + .3), 'g');
    // the tail: the booking toast drops in over the card, then the card lifts to say it is done
    var tk = E.back(P(t, A.e1, A.e1 + .45), 1.6), te = $('toast'); te.style.opacity = cl(tk).toFixed(3); te.style.transform = 'translateY(' + ((1 - tk) * -30).toFixed(1) + 'px)';
    $('card').style.transform = 'translateY(' + (12 * E.out3(P(t, A.e1, A.e1 + .45))).toFixed(1) + 'px)';
    DT.box('ok', { x: BX + 10, y: BY + 72, w: 278, h: 182, r: 20 }, P(t, A.e2, A.e2 + .4), '#5ee0a0');
    DT.dial(t, [{ t: 0, sym: '3', label: '3 FIXES' }, { t: A.f1, n: 1 }, { t: A.f2, n: 2 }, { t: A.f3, n: 3 }, { t: A.one, end: 1, sym: '✓', label: 'ONE TAP' }]);
    DT.title(t, [{ t: A.hook, html: 'Why does it <em>miss</em>?' }, { t: A.f1, html: 'Fix 1 · <em>bigger</em>' }, { t: A.f2, html: 'Fix 2 · <em>space between</em>' }, { t: A.f3, html: 'Fix 3 · <em>main one biggest</em>' }, { t: A.one, html: 'One tap. <em>Booked.</em>' }]);
    KM.subs($('cap'), t, V, PH, Math.max(0, V.words.findIndex(function(w){ return w.s - V.lead >= A.hook - .25; })), A.end, function(w){ return /^(tiny|room|bigger|space|between|main|biggest|tap)/i.test(w) ? 'var(--amb)' : null; });
  }
  window.setVoice = function(v){ if (v && v.words && v.words.length) anchors(v.words); };
  window.seek = seek; window.DURATION = DUR; window.__A = A;
  Promise.all(["700 22px 'Space Grotesk'", "500 15px 'Space Grotesk'", "900 31px 'Unbounded'"].map(function(f){ return document.fonts.load(f); }))
    .then(function(){ anchors(); seek(+(new URLSearchParams(location.search).get('t') || 0)); document.documentElement.dataset.ready = 1; });
})();
/*script:end*/

/*stage:begin*/
<div style="position:absolute;inset:0;background:linear-gradient(170deg,#9a6a44 0%,#83553a 50%,#6e4530 100%)"></div>
<div style="position:absolute;inset:0;background:repeating-linear-gradient(97deg,rgba(60,30,14,.16) 0 2px,transparent 2px 19px),repeating-linear-gradient(93deg,rgba(255,220,180,.07) 0 1px,transparent 1px 33px)"></div>
<div style="position:absolute;left:-30px;top:330px;width:170px;height:170px;border-radius:50%;background:radial-gradient(circle,#3a2214 0 46px,#f3ece2 47px 62px,#e6dccd 63px 80px,rgba(0,0,0,.2) 81px,transparent 86px)"></div>
<div style="position:absolute;left:470px;top:820px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,#f5efe6 0 50px,#ddd2c2 51px 56px,transparent 58px)"></div>
<div class="lit" style="background:radial-gradient(55% 38% at 55% 55%,rgba(255,214,150,.5),transparent 75%)"></div>
<div class="lit" style="background:linear-gradient(180deg,rgba(255,190,110,.16),rgba(255,160,80,.06))"></div>
/*stage:end*/
