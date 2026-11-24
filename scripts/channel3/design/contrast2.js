/*css:begin*/
.rul{position:absolute;width:24px;border-radius:6px;background:repeating-linear-gradient(180deg,rgba(24,26,36,.9) 0 2px,transparent 2px 12px) left/9px 100% no-repeat,repeating-linear-gradient(180deg,rgba(24,26,36,.75) 0 2px,transparent 2px 60px) left/16px 100% no-repeat,linear-gradient(90deg,#ece7dd,#dcd5c7);box-shadow:0 10px 26px rgba(0,0,0,.35);z-index:1}
.rul.r{transform:scaleX(-1)}
#board{left:66px;top:396px;width:408px;height:368px;border-radius:14px;border:10px solid #6b4a2e}
.sp{position:absolute;left:28px;white-space:nowrap;font-family:'Space Grotesk'}
#h0{top:20px;font:700 30px 'Space Grotesk';letter-spacing:-.01em}
#h1{top:60px;font:500 14px 'Space Grotesk';letter-spacing:.18em}
.it{font:700 21px 'Space Grotesk'}.ds{font:400 15px 'Space Grotesk'}
#chk{left:292px;top:676px;width:176px;padding:9px 11px;border-radius:16px;background:#141827;border:1.5px solid #2a3150;box-shadow:0 14px 30px rgba(0,0,0,.5);z-index:28;opacity:0;font-family:'Space Grotesk'}
#chk .sw{display:inline-block;width:24px;height:24px;border-radius:8px;vertical-align:middle;border:2px solid rgba(255,255,255,.2)}
#chk .lb{display:block;font:700 11px 'Space Grotesk';letter-spacing:.16em;color:#9aa1b8;margin-bottom:5px}
#chk .rs{display:inline-block;margin-left:8px;font:900 19px var(--d);vertical-align:middle}
#chk .rt{display:block;margin-top:6px;font:700 21px 'Space Grotesk';color:#fff;letter-spacing:.02em;white-space:nowrap}
#drop{position:absolute;left:0;top:0;width:34px;height:34px;z-index:31;opacity:0;pointer-events:none}
/*css:end*/
/*board:begin*/
<div class="rul" style="left:8px;top:400px;height:246px"></div><div class="rul r" style="left:508px;top:400px;height:246px"></div>
<div id="board" class="board">
  <div class="sp" id="h0">Today's specials</div>
  <div class="sp" id="h1">FROM THE KITCHEN</div>
  <div class="sp it" id="i0" style="top:100px">Pumpkin soup</div><div class="sp ds" id="j0" style="top:128px">with toasted seeds and warm bread</div>
  <div class="sp it" id="i1" style="top:164px">Cheese toastie</div><div class="sp ds" id="j1" style="top:192px">three cheeses, sourdough, chutney</div>
  <div class="sp it" id="i2" style="top:228px">Masala chai</div><div class="sp ds" id="j2" style="top:256px">brewed slow with fresh ginger</div>
  <div class="sp it" id="i3" style="top:292px">Carrot cake</div>
</div>
<div id="chk" class="a"><span class="lb">CONTRAST</span><i class="sw" id="cw1"></i><i class="sw" id="cw2" style="margin-left:6px"></i><span class="rs" id="crs">FAIL</span><span class="rt" id="crt"></span></div>
<svg id="drop" class="a" viewBox="0 0 34 34"><path d="M24 4 L30 10 L14 26 L6 28 L8 20 Z" fill="#fff" stroke="#0b0d16" stroke-width="2" stroke-linejoin="round"/><circle cx="7" cy="27" r="3" fill="#ffb35a"/></svg>
/*board:end*/
/*script:begin*/
(function(){
  var $ = DT.$, P = KM.P, mix = KM.mix, E = KM.ease, cl = KM.cl; KM.theme('dark', 'turnsout'); DT.ctx(); DT.tint('#5ee0a0', '#ffb35a');
  // spoken sentences with breaths (rules-c3.md V1-V3); the before is the common "soft grey looks elegant" choice, about 2.4 : 1 (B1), not text too faint to exist
  var TEXT = "This menu is hard to read. The soft grey looked nice, but it's too light. Turns out, text needs contrast. First, darken the words. Next, lighten the board a touch. Then check the ratio. For body text, aim for four and a half to one. Same menu, now easy to read.";
  var DUR = 21.2, BX = 66, BY = 396, V, PH, A = {}, CAM;
  var TA = [158, 152, 142], TB = [43, 36, 30], GA = [238, 231, 216], GB = [250, 246, 238];   // text grey -> near black, board beige -> warm white
  var IDS = ['h0', 'h1', 'i0', 'j0', 'i1', 'j1', 'i2', 'j2', 'i3'];
  function rgb(a){ return 'rgb(' + a.map(function(v){ return Math.round(v); }).join(',') + ')'; }
  function mixc(a, b, k){ return [mix(a[0], b[0], k), mix(a[1], b[1], k), mix(a[2], b[2], k)]; }
  function lum(c){ var v = c.map(function(x){ x /= 255; return x <= .03928 ? x / 12.92 : Math.pow((x + .055) / 1.055, 2.4); }); return .2126 * v[0] + .7152 * v[1] + .0722 * v[2]; }
  function ratio(a, b){ var l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + .05) / (Math.min(l1, l2) + .05); }   // WCAG contrast ratio
  function at(w, n){ return V.at(w, n); }
  function anchors(words){
    V = KM.voice(TEXT, .12, words); PH = V.phrases(4); KM.reset(DUR);
    A.hook = at('The') - .1; A.read = at('light'); A.turns = at('Turns'); A.con = at('contrast'); A.f1 = at('First'); A.dark = at('darken'); A.f2 = at('Next'); A.light = at('lighten'); A.f3 = at('Then'); A.ratio = at('ratio'); A.four = at('four');
    A.same = at('Same'); A.readable = at('read', 2); A.proof = A.readable + .8; A.e1 = A.proof + 1.2; A.e2 = A.e1 + .9; A.end = Math.min(DUR - .2, A.e2 + 1.5);   // the payoff word, the before/after proof, the ticks, the frame, a hold
    window.COVER = .6;
    var S = DT.S; S.sting(0); [.35, .65].forEach(function(t0, i){ S.land(t0 + .05, 270, i + 1); KM.cue({ t: t0, k: 'tick', g: .08, p: i, x: 270, synth: true }); }); S.whoosh(0, 270, .4);
    S.stamp(A.read + .1, 270); S.tint(A.con, 270);
    S.rise(A.f1 - .4, .45); for (var i = 0; i < 9; i++) S.land(A.dark + .1 + i * .08, 140 + i * 25, i); A.d1 = A.dark + 1; S.done(A.d1, 270, 0);
    S.rise(A.f2 - .1, .4); S.tint(A.light, 270); S.drag(A.light - .1, .6, 120, 420); A.d2 = A.light + .6; S.done(A.d2, 270, 2);
    S.rise(A.f3 - .1, .4); S.click(A.ratio - .2, 200); S.click(A.ratio + .2, 330); S.whoosh(A.ratio, 400, .3); S.stamp(A.four + .2, 400); A.d3 = A.four + .6; S.done(A.d3, 400, 4);
    S.reveal(A.readable); S.flip(A.proof, .5); S.land(A.e1, 200, 5); S.done(A.e2, 270, 6);
    CAM = KM.rig({ x: 270, y: 490, z: 1.06, drift: 1 }).pull(0, .55, 270, 490, 1);
    DT.close(CAM, A.d1, 1.09); DT.close(CAM, A.d2, 1.07);   // the first two fixes seen close; the third happens on the checker card below the board
    window.ALIGN = [{ at: A.end - .05, sel: '.sp', edge: 'left', why: 'every line starts on one edge' }];
    window.HOLDS = [[A.end, DUR]];
    KM.publish(DT.score(A.same, A.f1));
  }
  function seek(t){
    t = Math.max(0, Math.min(DUR, t)); var c = CAM.apply($('world'), t, null); KM.lights(t, c);
    DT.intro($('board'), t + .6, .55);
    var k2 = E.inOut3(P(t, A.light - .1, A.light + .6)), bg = mixc(GA, GB, k2); $('board').style.background = rgb(bg);
    var txt = TA, worst = 99;
    IDS.forEach(function(id, i){ var k = E.out3(P(t, A.dark + .1 + i * .08, A.dark + .45 + i * .08)), col = mixc(TA, TB, k); if (id === 'h1') col = mixc(col, [196, 87, 42], k * .9); $(id).style.color = rgb(col); worst = Math.min(worst, ratio(col, bg)); if (i === 2) txt = col; });
    DT.mood(t, .34 * E.out3(P(t, A.d1 - .2, A.d1 + .5)) + .33 * E.out3(P(t, A.d2 - .2, A.d2 + .5)) + .33 * E.out3(P(t, A.d3 - .2, A.d3 + .5)));
    DT.sweep(t, [A.d1, A.d2, A.d3, A.readable]);
    DT.hook(t, '<i>Hard</i> <i>to</i> <em><i>read.</i></em>', A.hook);
    var ro = 1 - P(t, A.turns - .3, A.turns);
    [[.35, { x: BX + 20, y: BY + 16, w: 300, h: 82, r: 12 }, 'LIGHT GREY', BX + 24, BY + 350], [.65, { x: BX + 20, y: BY + 102, w: 368, h: 240, r: 14 }, 'LOW CONTRAST', BX + 160, BY + 350]].forEach(function(q, i){
      DT.box('ring' + i, q[1], P(t, q[0], q[0] + .3) * ro, '#ff5f5f'); DT.chip('rl' + i, q[2], q[3], q[4], P(t, q[0] + .1, q[0] + .35) * ro, 'r sm'); });
    DT.chip('rd', 'TOO <b>LIGHT</b>', 300, 396, P(t, A.read - .1, A.read + .2) - P(t, A.turns - .2, A.turns + .1), 'r');
    DT.chip('con', 'TEXT NEEDS <b>CONTRAST</b>', 120, 396, P(t, A.con - .1, A.con + .2) - P(t, A.f1 - .2, A.f1 + .1));
    var sk = P(t, A.dark + .05, A.dark + 1); DT.line('scan', BX + 6, BY + 16 + sk * 320, BX + 402, BY + 16 + sk * 320, sk > 0 && sk < 1 ? 1 : 0, '#ffb35a', 3);
    DT.chip('c1', 'DARKEN <b>THE WORDS</b>', 120, 396, P(t, A.dark, A.dark + .3) - P(t, A.f2 - .1, A.f2 + .2));
    DT.sel('s2', { x: BX - 6, y: BY - 6, w: 420, h: 380 }, P(t, A.light - .3, A.light) * (1 - P(t, A.d2 + .2, A.d2 + .5)));
    DT.chip('c2', 'LIGHTER <b>BOARD</b>', 280, 396, P(t, A.light, A.light + .3) - P(t, A.f3 - .1, A.f3 + .2));
    // fix three: the eyedropper samples the words, then the board; the checker card shows both swatches, PASS, then the minimum as the voice says it
    var dr = $('drop'), dk = [[A.ratio - .4, 300, 520], [A.ratio - .2, 150, 512], [A.ratio + .2, 380, 600], [A.ratio + .6, 400, 720]], dx = dk[0][1], dy = dk[0][2];
    for (var i = 0; i < dk.length - 1; i++) if (t >= dk[i][0]) { var u = E.inOut3(P(t, dk[i][0], dk[i + 1][0])); dx = mix(dk[i][1], dk[i + 1][1], u); dy = mix(dk[i][2], dk[i + 1][2], u); }
    dr.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + (dy - 30).toFixed(1) + 'px)'; dr.style.opacity = (P(t, A.ratio - .6, A.ratio - .4) * (1 - P(t, A.ratio + .6, A.ratio + .9))).toFixed(3);
    var ck = E.back(P(t, A.ratio - .1, A.ratio + .3), 1.8), ch = $('chk'); ch.style.opacity = (cl(ck) * (1 - P(t, A.proof - .35, A.proof - .05))).toFixed(3);   // the checker leaves before the before/after proof ch.style.transform = 'translateY(' + ((1 - ck) * 30).toFixed(1) + 'px)';
    var was = t < A.ratio + .45; $('cw1').style.background = rgb(was ? TA : txt); $('cw2').style.background = rgb(was ? GA : bg); var ok = !was && worst >= 4.5;   // the checker first reads the old pair (FAIL), then the fixed one (PASS)
    $('crs').textContent = ok ? 'PASS' : 'FAIL'; $('crs').style.color = ok ? '#5ee0a0' : '#ff6b6b';
    $('crt').textContent = t >= A.four ? 'MIN 4.5 : 1' : '';
    DT.chip('c3', 'CHECK <b>THE RATIO</b>', 120, 396, P(t, A.ratio, A.ratio + .3) - P(t, A.same - .2, A.same + .1));
    [[A.d1, BX + 200, BY + 150], [A.d2, BX + 200, BY + 200], [A.d3, 390, 720]].forEach(function(d, j){ DT.burst('b' + j, d[1], d[2], t, d[0], '#ffb35a'); });
    var br = Math.max(Math.sin(Math.PI * P(t, A.d1, A.d1 + .35)), Math.sin(Math.PI * P(t, A.d2, A.d2 + .35)), Math.sin(Math.PI * P(t, A.d3, A.d3 + .35)));
    $('board').style.boxShadow = '0 30px 70px rgba(0,0,0,.55),0 0 0 ' + (3 * br).toFixed(1) + 'px rgba(255,179,90,.55)';
    DT.proof(t, A.proof, { flash: .5, x: 30, y: 772, s: .34, tx: 180, ty: 752 });
    DT.chip('win', 'SAME MENU · <b>READABLE</b>', 120, 396, P(t, A.readable - .2, A.readable + .1) - P(t, A.e2 - .2, A.e2 + .1), 'g'); DT.chip('win2', 'CONTRAST · <b>PASS</b>', 150, 396, P(t, A.e2, A.e2 + .3), 'g');
    // the tail: a green tick on each special in turn, then the board frame
    for (var j = 0; j < 4; j++) { var yy = BY + [112, 176, 240, 304][j]; DT.line('tk' + j + 'a', BX + 340, yy, BX + 348, yy + 8, P(t, A.e1 + j * .12, A.e1 + .15 + j * .12), '#2fb37a', 4); DT.line('tk' + j + 'b', BX + 348, yy + 8, BX + 364, yy - 10, P(t, A.e1 + .1 + j * .12, A.e1 + .25 + j * .12), '#2fb37a', 4); }
    DT.box('ok', { x: BX + 14, y: BY + 14, w: 380, h: 328, r: 14 }, P(t, A.e2, A.e2 + .5), '#5ee0a0');
    DT.dial(t, [{ t: 0, sym: '3', label: '3 FIXES' }, { t: A.f1, n: 1 }, { t: A.f2, n: 2 }, { t: A.f3, n: 3 }, { t: A.same, end: 1, sym: '✓', label: 'READABLE' }]);
    DT.title(t, [{ t: A.hook, html: 'Soft, but <em>too light</em>' }, { t: A.f1, html: 'Fix 1 · <em>darker words</em>' }, { t: A.f2, html: 'Fix 2 · <em>lighter board</em>' }, { t: A.f3, html: 'Fix 3 · <em>check it</em>' }, { t: A.same, html: 'Same menu. <em>Clear.</em>' }]);
    KM.subs($('cap'), t, V, PH, Math.max(0, V.words.findIndex(function(w){ return w.s - V.lead >= A.hook - .25; })), A.end, function(w){ return /^(read|light|contrast|darken|words|lighten|board|ratio)/i.test(w) ? 'var(--amb)' : null; });
  }
  window.setVoice = function(v){ if (v && v.words && v.words.length) anchors(v.words); };
  window.seek = seek; window.DURATION = DUR; window.__A = A;
  Promise.all(["700 30px 'Space Grotesk'", "400 15px 'Space Grotesk'", "900 31px 'Unbounded'"].map(function(f){ return document.fonts.load(f); }))
    .then(function(){ anchors(); seek(1.2); DT.keep($('board')); seek(+(new URLSearchParams(location.search).get('t') || 0)); document.documentElement.dataset.ready = 1; });
})();
/*script:end*/

/*stage:begin*/
<div style="position:absolute;inset:0;background:linear-gradient(175deg,#3a2a22 0%,#2e211b 55%,#241914 100%)"></div>
<div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(255,220,180,.05) 0 2px,transparent 2px 44px)"></div>
<div style="position:absolute;left:0;right:0;top:820px;height:220px;background:linear-gradient(180deg,#7a5236,#5a3a24);box-shadow:0 -3px 0 rgba(255,220,180,.25)"></div>
<div style="position:absolute;left:412px;top:760px;width:110px;height:90px;border-radius:0 0 30px 30px;background:linear-gradient(90deg,#e9e4da,#fff,#d9d3c8);box-shadow:0 10px 16px rgba(0,0,0,.35)"></div>
<div style="position:absolute;left:30px;top:150px;width:480px;height:40px;background:repeating-linear-gradient(90deg,#c9a46a 0 14px,transparent 14px 40px);opacity:.25"></div>
<div class="lit" style="background:radial-gradient(55% 40% at 50% 55%,rgba(255,220,170,.45),transparent 75%)"></div>
<div class="lit" style="background:linear-gradient(180deg,rgba(255,200,130,.14),rgba(255,170,100,.05))"></div>
/*stage:end*/
