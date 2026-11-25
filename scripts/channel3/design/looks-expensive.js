/* STARTER (node scripts/starter.mjs c3 looks-expensive) from the GOLD Turns Out reel showreel-c3-grey-text (design/gold.md "Turns Out"), on the design engine
   (template.html + core.js; node scripts/channel3/design/build.mjs looks-expensive). Keep: the dark café stage, one artboard (the "board") at
   x 66-474 / y 396-764 that changes in place, the title line top-left with the accent word, the numbered fix chips (FIX n OF 3), one change
   per spoken sentence, the before thumbnail + after on the last 3 s. Change only the "changed" places: the board's content (this topic's
   design), the before mistake, the three fixes in the script, the check chip. */
/* the board's CSS (sizes of this topic's design). */
/*css:begin*/
.rul{position:absolute;width:24px;border-radius:6px;background:repeating-linear-gradient(180deg,rgba(24,26,36,.9) 0 2px,transparent 2px 12px) left/9px 100% no-repeat,repeating-linear-gradient(180deg,rgba(24,26,36,.75) 0 2px,transparent 2px 60px) left/16px 100% no-repeat,linear-gradient(90deg,#ece7dd,#dcd5c7);box-shadow:0 10px 26px rgba(0,0,0,.35);z-index:1}
.rul.r{transform:scaleX(-1)}
#board{left:66px;top:396px;width:408px;height:368px;border-radius:14px;border:10px solid #8a6a46}
.sp{position:absolute;white-space:nowrap;font-family:'Space Grotesk'}
.c{left:0;right:0;text-align:center}
#nm{top:16px;font:700 44px 'Space Grotesk';color:#d62f2f}
#tg{top:76px;font:600 22px 'Space Grotesk';color:#ee8a1c}
#sm{top:206px;font:500 15px 'Space Grotesk';color:#333}
#bd{position:absolute;right:12px;top:104px;width:100px;height:100px;border-radius:50%;background:#1fa35b;color:#fff;font:800 15px/1.1 'Space Grotesk';display:flex;align-items:center;justify-content:center;text-align:center;transform:rotate(12deg);box-shadow:0 3px 0 #0e6b3a}
#st{position:absolute;left:0;right:0;top:246px;height:48px;background:#2b6cd6;color:#fff;font:800 23px/48px 'Space Grotesk';text-align:center}
#rl{position:absolute;left:150px;right:150px;top:150px;height:2px;background:#20392c;opacity:0}
#chk{left:292px;top:676px;width:176px;padding:9px 11px;border-radius:16px;background:#141827;border:1.5px solid #2a3150;box-shadow:0 14px 30px rgba(0,0,0,.5);z-index:28;opacity:0;font-family:'Space Grotesk'}
#chk .sw{display:inline-block;width:24px;height:24px;border-radius:8px;vertical-align:middle;border:2px solid rgba(255,255,255,.2);margin-right:6px}
#chk .lb{display:block;font:700 11px 'Space Grotesk';letter-spacing:.16em;color:#9aa1b8;margin-bottom:5px}
#chk .rt{display:block;margin-top:6px;font:700 21px 'Space Grotesk';color:#fff;letter-spacing:.02em;white-space:nowrap}
#drop{position:absolute;left:0;top:0;width:34px;height:34px;z-index:31;opacity:0;pointer-events:none}
/*css:end*/
/* the board markup: this topic's design as a believable first draft (rules-c3.md B1-B2). */
/*board:begin*/
<div class="rul" style="left:8px;top:400px;height:246px"></div><div class="rul r" style="left:508px;top:400px;height:246px"></div>
<div id="board" class="board">
  <div class="sp c" id="nm">GOLDEN HONEY</div>
  <div class="sp c" id="tg">Pure · Natural · Best</div>
  <div class="sp c" id="sm">Raw wildflower honey, 500 g</div>
  <div id="bd">100%<br>NATURAL</div>
  <div id="st">BUY 2 GET 1 FREE</div>
  <div id="rl"></div>
</div>
<div id="chk" class="a"><span class="lb">COLOURS</span><i class="sw" id="cw1"></i><i class="sw" id="cw2"></i><i class="sw" id="cw3"></i><i class="sw" id="cw4"></i><span class="rt" id="crt"></span></div>
<svg id="drop" class="a" viewBox="0 0 34 34"><path d="M24 4 L30 10 L14 26 L6 28 L8 20 Z" fill="#fff" stroke="#0b0d16" stroke-width="2" stroke-linejoin="round"/><circle cx="7" cy="27" r="3" fill="#ffb35a"/></svg>
/*board:end*/
/* the three fixes: each lands on its spoken sentence (rules-c3.md V1-V3; critic D2). */
/*script:begin*/
(function(){
  var $ = DT.$, P = KM.P, mix = KM.mix, E = KM.ease, cl = KM.cl; KM.theme('dark', 'turnsout'); DT.ctx(); DT.tint('#5ee0a0', '#ffb35a');
  // spoken sentences with breaths (rules-c3.md V1-V3); the before is a default first draft: big bold centred name, four colours, a badge and a banner, text touching the edges (B1)
  var TEXT = "Too much is going on. It looks cheap. Turns out, quiet looks expensive. First, give it room. Next, shrink and space the name. Then, keep just two colours. Same product, now it looks premium.";
  var DUR = 19.5, BX = 66, BY = 396, V, PH, A = {}, CAM;
  var NA = [214, 47, 47], NB = [32, 57, 44], TA_ = [238, 138, 28], SA = [51, 51, 51], GA = [255, 255, 255], GB = [246, 240, 228];
  function rgb(a){ return 'rgb(' + a.map(function(v){ return Math.round(v); }).join(',') + ')'; }
  function mixc(a, b, k){ return [mix(a[0], b[0], k), mix(a[1], b[1], k), mix(a[2], b[2], k)]; }
  function dist(a, b){ return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2)); }
  function at(w, n){ return V.at(w, n); }
  function anchors(words){
    V = KM.voice(TEXT, .12, words); PH = V.phrases(4); KM.reset(DUR);
    A.hook = at('Too') - .1; A.read = at('cheap'); A.turns = at('Turns'); A.con = at('quiet'); A.f1 = at('First'); A.dark = at('room'); A.f2 = at('Next'); A.light = at('shrink'); A.f3 = at('Then'); A.ratio = at('keep'); A.four = at('two');
    A.same = at('Same'); A.readable = at('premium'); A.proof = A.readable + .8; A.e1 = A.proof + 1.2; A.e2 = A.e1 + .9; A.end = Math.min(DUR - .2, A.e2 + 1.5);
    window.COVER = .6;
    var S = DT.S; S.sting(0); [.35, .65].forEach(function(t0, i){ S.land(t0 + .05, 270, i + 1); KM.cue({ t: t0, k: 'tick', g: .08, p: i, x: 270, synth: true }); }); S.whoosh(0, 270, .4);
    S.stamp(A.read + .1, 270); S.tint(A.con, 270);
    S.rise(A.f1 - .4, .45); for (var i = 0; i < 5; i++) S.land(A.dark + .1 + i * .1, 140 + i * 40, i); A.d1 = A.dark + 1; S.done(A.d1, 270, 0);
    S.rise(A.f2 - .1, .4); S.tint(A.light, 270); S.drag(A.light - .1, .6, 120, 420); A.d2 = A.light + .8; S.done(A.d2, 270, 2);
    S.rise(A.f3 - .1, .4); S.click(A.ratio - .2, 200); S.click(A.ratio + .2, 330); S.whoosh(A.ratio, 400, .3); S.stamp(A.four + .2, 400); A.d3 = A.four + .8; S.done(A.d3, 400, 4);
    S.reveal(A.readable); S.flip(A.proof, .5); S.land(A.e1, 200, 5); S.done(A.e2, 270, 6);
    CAM = KM.rig({ x: 270, y: 490, z: 1.06, drift: 1 }).pull(0, .55, 270, 490, 1);
    DT.close(CAM, A.d1, 1.09); DT.close(CAM, A.d2, 1.08);
    window.ALIGN = [{ at: A.end - .05, sel: '#nm', edge: 'center', why: 'the name sits on the label centre' }];
    window.HOLDS = [[A.end, DUR]];
    KM.publish(DT.score(A.same, A.f1));
  }
  function seek(t){
    t = Math.max(0, Math.min(DUR, t)); var c = CAM.apply($('world'), t, null); KM.lights(t, c);
    DT.intro($('board'), t + .6, .55);
    var k1 = E.inOut3(P(t, A.dark, A.dark + .8)), k2 = E.inOut3(P(t, A.light, A.light + .9)), k3 = E.inOut3(P(t, A.ratio, A.ratio + .9));
    var bg = mixc(GA, GB, k3), nm = mixc(NA, NB, k3), tg = mixc(TA_, NB, k3), sm = mixc(SA, NB, k3);
    $('board').style.background = rgb(bg);
    var n = $('nm'), g = $('tg'), s = $('sm');
    n.style.color = rgb(nm); g.style.color = rgb(tg); s.style.color = rgb(sm);
    n.style.top = mix(16, 146, k2).toFixed(1) + 'px'; n.style.fontSize = mix(44, 20, k2).toFixed(1) + 'px'; n.style.letterSpacing = mix(0, .36, k2).toFixed(3) + 'em'; n.style.fontWeight = k2 > .5 ? 500 : 700;
    g.style.top = mix(76, 190, k2).toFixed(1) + 'px'; g.style.fontSize = mix(22, 12, k2).toFixed(1) + 'px'; g.style.letterSpacing = mix(0, .3, k2).toFixed(3) + 'em'; g.style.textTransform = k2 > .5 ? 'uppercase' : 'none';
    s.style.top = '206px'; s.style.opacity = (1 - k1).toFixed(3);
    var bo = 1 - k1; $('bd').style.opacity = bo.toFixed(3); $('bd').style.transform = 'rotate(12deg) scale(' + (1 - .4 * k1).toFixed(3) + ')'; $('st').style.opacity = bo.toFixed(3);
    $('rl').style.opacity = k2.toFixed(3); $('rl').style.top = '174px';
    DT.mood(t, .34 * E.out3(P(t, A.d1 - .2, A.d1 + .5)) + .33 * E.out3(P(t, A.d2 - .2, A.d2 + .5)) + .33 * E.out3(P(t, A.d3 - .2, A.d3 + .5)));
    DT.sweep(t, [A.d1, A.d2, A.d3, A.readable]);
    DT.hook(t, '<i>Too</i> <i>much</i> <em><i>going</i></em> <em><i>on.</i></em>', A.hook);
    var ro = 1 - P(t, A.turns - .3, A.turns);
    [[.35, { x: BX + 14, y: BY + 14, w: 380, h: 62, r: 12 }, 'TOO BIG', BX + 24, BY + 350], [.65, { x: BX + 14, y: BY + 90, w: 380, h: 262, r: 14 }, 'TOO MANY COLOURS', BX + 130, BY + 350]].forEach(function(q, i){
      DT.box('ring' + i, q[1], P(t, q[0], q[0] + .3) * ro, '#ff5f5f'); DT.chip('rl' + i, q[2], q[3], q[4], P(t, q[0] + .1, q[0] + .35) * ro, 'r sm'); });
    DT.chip('rd', 'LOOKS <b>CHEAP</b>', 300, 396, P(t, A.read - .1, A.read + .2) - P(t, A.turns - .2, A.turns + .1), 'r');
    DT.chip('con', 'QUIET LOOKS <b>EXPENSIVE</b>', 80, 396, P(t, A.con - .1, A.con + .2) - P(t, A.f1 - .2, A.f1 + .1));
    DT.box('mg', { x: BX + 38, y: BY + 38, w: 332, h: 292, r: 6 }, P(t, A.dark + .1, A.dark + .5) * (1 - P(t, A.d2 + .6, A.d2 + 1)), '#ffb35a');
    DT.chip('c1', 'GIVE IT <b>ROOM</b>', 120, 396, P(t, A.dark, A.dark + .3) - P(t, A.f2 - .1, A.f2 + .2));
    DT.sel('s2', { x: BX + 80, y: BY + 150, w: 250, h: 70 }, P(t, A.light - .3, A.light) * (1 - P(t, A.d2 + .2, A.d2 + .5)));
    DT.chip('c2', 'SMALL, <b>SPACED</b>', 250, 396, P(t, A.light, A.light + .3) - P(t, A.f3 - .1, A.f3 + .2));
    // fix three: the eyedropper samples the name, the tagline, the board; the colour card keeps two
    var dr = $('drop'), dk = [[A.ratio - .5, 300, 560], [A.ratio - .25, 270, 570], [A.ratio, 270, 610], [A.ratio + .5, 400, 720]], dx = dk[0][1], dy = dk[0][2];
    for (var i = 0; i < dk.length - 1; i++) if (t >= dk[i][0]) { var u = E.inOut3(P(t, dk[i][0], dk[i + 1][0])); dx = mix(dk[i][1], dk[i + 1][1], u); dy = mix(dk[i][2], dk[i + 1][2], u); }
    dr.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + (dy - 30).toFixed(1) + 'px)'; dr.style.opacity = (P(t, A.ratio - .6, A.ratio - .4) * (1 - P(t, A.ratio + .5, A.ratio + .8))).toFixed(3);
    var ck = E.back(P(t, A.ratio - .1, A.ratio + .3), 1.8), ch = $('chk'); ch.style.opacity = (cl(ck) * (1 - P(t, A.proof - .35, A.proof - .05))).toFixed(3);
    var cols = [nm, tg, sm, bg]; ['cw1', 'cw2', 'cw3', 'cw4'].forEach(function(id, i){ $(id).style.background = rgb(cols[i]); });
    var distinct = [], sh = [nm, tg, sm, bg]; sh.forEach(function(x){ if (!distinct.some(function(y){ return dist(x, y) < 60; })) distinct.push(x); });
    $('crt').textContent = t >= A.four ? ({ 1: 'ONE', 2: 'TWO', 3: 'THREE', 4: 'FOUR' }[distinct.length] || '') + ' COLOURS' : '';
    DT.chip('c3', 'TWO <b>COLOURS</b>', 150, 396, P(t, A.ratio, A.ratio + .3) - P(t, A.same - .2, A.same + .1));
    [[A.d1, BX + 200, BY + 150], [A.d2, BX + 200, BY + 170], [A.d3, BX + 200, BY + 190]].forEach(function(d, j){ DT.burst('b' + j, d[1], d[2], t, d[0], '#ffb35a'); });
    var br = Math.max(Math.sin(Math.PI * P(t, A.d1, A.d1 + .35)), Math.sin(Math.PI * P(t, A.d2, A.d2 + .35)), Math.sin(Math.PI * P(t, A.d3, A.d3 + .35)));
    $('board').style.boxShadow = '0 30px 70px rgba(0,0,0,.55),0 0 0 ' + (3 * br).toFixed(1) + 'px rgba(255,179,90,.55)';
    DT.proof(t, A.proof, { flash: .5, x: 30, y: 772, s: .34, tx: 180, ty: 752 });
    DT.chip('win', 'SAME PRODUCT · <b>PREMIUM</b>', 100, 396, P(t, A.readable - .2, A.readable + .1) - P(t, A.e2 - .2, A.e2 + .1), 'g'); DT.chip('win2', 'COLOURS · <b>TWO</b>', 150, 396, P(t, A.e2, A.e2 + .3), 'g');
    [[A.e1, BX + 330, BY + 172], [A.e1 + .12, BX + 330, BY + 204]].forEach(function(d, j){ DT.line('tk' + j + 'a', d[1], d[2], d[1] + 8, d[2] + 8, P(t, d[0], d[0] + .15), '#2fb37a', 4); DT.line('tk' + j + 'b', d[1] + 8, d[2] + 8, d[1] + 24, d[2] - 10, P(t, d[0] + .1, d[0] + .25), '#2fb37a', 4); });
    DT.box('ok', { x: BX + 14, y: BY + 14, w: 380, h: 340, r: 14 }, P(t, A.e2, A.e2 + .5), '#5ee0a0');
    DT.dial(t, [{ t: 0, sym: '3', label: '3 FIXES' }, { t: A.f1, n: 1 }, { t: A.f2, n: 2 }, { t: A.f3, n: 3 }, { t: A.same, end: 1, sym: '✓', label: 'PREMIUM' }]);
    DT.title(t, [{ t: A.hook, html: 'Busy, so <em>cheap</em>' }, { t: A.f1, html: 'Fix 1 · <em>give it room</em>' }, { t: A.f2, html: 'Fix 2 · <em>small, spaced</em>' }, { t: A.f3, html: 'Fix 3 · <em>two colours</em>' }, { t: A.same, html: 'Now <em>premium</em>' }]);
    KM.subs($('cap'), t, V, PH, Math.max(0, V.words.findIndex(function(w){ return w.s - V.lead >= A.hook - .25; })), A.end, function(w){ return /^(cheap|room|shrink|space|colours|quiet|expensive|premium|label)/i.test(w) ? 'var(--amb)' : null; });
  }
  window.setVoice = function(v){ if (v && v.words && v.words.length) anchors(v.words); };
  window.seek = seek; window.DURATION = DUR; window.__A = A;
  Promise.all(["700 30px 'Space Grotesk'", "400 15px 'Space Grotesk'", "900 31px 'Unbounded'"].map(function(f){ return document.fonts.load(f); }))
    .then(function(){ anchors(); seek(1.2); DT.keep($('board')); seek(+(new URLSearchParams(location.search).get('t') || 0)); document.documentElement.dataset.ready = 1; });
})();
/*script:end*/

/*stage:begin*/
<div style="position:absolute;inset:0;background:linear-gradient(175deg,#2c3a36 0%,#22302d 55%,#1a2523 100%)"></div>
<div style="position:absolute;inset:0;background:repeating-linear-gradient(90deg,rgba(220,255,240,.05) 0 2px,transparent 2px 60px)"></div>
<div style="position:absolute;left:20px;top:230px;width:60px;height:110px;border-radius:12px;background:linear-gradient(90deg,#8a6a3a,#d9a95a,#8a6a3a);opacity:.28"></div>
<div style="position:absolute;left:470px;top:250px;width:60px;height:90px;border-radius:12px;background:linear-gradient(90deg,#8a6a3a,#d9a95a,#8a6a3a);opacity:.28"></div>
<div style="position:absolute;left:0;right:0;top:820px;height:220px;background:linear-gradient(180deg,#8a6a46,#5e452c);box-shadow:0 -3px 0 rgba(255,235,200,.28)"></div>
<div style="position:absolute;left:380px;top:760px;width:120px;height:92px;border-radius:14px 14px 30px 30px;background:linear-gradient(90deg,#d9a95a,#f5d78e,#c8963f);box-shadow:0 10px 16px rgba(0,0,0,.35)"></div>
<div class="lit" style="background:radial-gradient(55% 40% at 50% 55%,rgba(255,235,190,.42),transparent 75%)"></div>
<div class="lit" style="background:linear-gradient(180deg,rgba(255,220,150,.12),rgba(255,190,110,.05))"></div>
/*stage:end*/
