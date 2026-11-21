/*css:begin*/
.rul{position:absolute;width:24px;border-radius:6px;background:repeating-linear-gradient(180deg,rgba(24,26,36,.9) 0 2px,transparent 2px 12px) left/9px 100% no-repeat,repeating-linear-gradient(180deg,rgba(24,26,36,.75) 0 2px,transparent 2px 60px) left/16px 100% no-repeat,linear-gradient(90deg,#ece7dd,#dcd5c7);box-shadow:0 10px 26px rgba(0,0,0,.35);z-index:1}
.rul.r{transform:scaleX(-1)}
#board{left:66px;top:396px;width:408px;height:368px;border-radius:3px;background:#fff8ec}
.tx{position:absolute;left:30px;width:350px;font-family:'Space Grotesk';color:#2b1d14;z-index:5}
.tx .w{display:inline-block;white-space:nowrap;margin-right:.28em}
.tx .c{display:inline-block;white-space:pre}
#tag{top:22px;font:700 17px 'Space Grotesk';color:#2b1d14;padding:5px 0;border-radius:6px}
#hd{top:60px;font:700 29px/1.12 'Space Grotesk'}
#pa{top:150px;font:700 22px/1.4 'Space Grotesk';color:#3a2a1e}
#scarf{position:absolute;left:250px;top:292px;width:140px;height:56px;border-radius:12px;background:repeating-linear-gradient(90deg,#c4572a 0 14px,#e9a23b 14px 28px,#2d5a8c 28px 42px);box-shadow:0 6px 12px rgba(0,0,0,.18);transform-origin:20% 50%}
#shapes{position:absolute;left:0;top:0;width:408px;height:368px;pointer-events:none;z-index:2}
.tape{position:absolute;width:70px;height:22px;background:rgba(235,240,245,.7);box-shadow:0 2px 4px rgba(0,0,0,.15);z-index:6}
/*css:end*/
/*board:begin*/
<div class="rul" style="left:8px;top:400px;height:246px"></div><div class="rul r" style="left:508px;top:400px;height:246px"></div>
<div id="board" class="board">
  <div class="tx" id="tag"></div>
  <div class="tx" id="hd"></div>
  <div class="tx" id="pa"></div>
  <div id="scarf"></div>
  <svg id="shapes" viewBox="0 0 408 368"></svg>
  <div class="tape" style="left:-18px;top:-6px;transform:rotate(-30deg)"></div><div class="tape" style="left:356px;top:-6px;transform:rotate(30deg)"></div>
</div>
/*board:end*/
/*script:begin*/
(function(){
  var $ = DT.$, P = KM.P, mix = KM.mix, E = KM.ease, cl = KM.cl; KM.theme('dark', 'turnsout'); DT.ctx(); DT.tint('#ff8a5a', '#7aa2ff');
  var TEXT = "Stop writing in all caps. It's hard to read. Turns out, lowercase words have shapes. Fix one: sentence case. Fix two: caps for short labels. Fix three: space out those caps. Calm, and easy to read.";
  var DUR = 16, BX = 66, BY = 396, V, PH, A = {}, CAM, NS = 'http://www.w3.org/2000/svg';
  // every line starts in caps; the paragraph turns to sentence case (fix 1), the heading too (fix 2, caps stay only on the short tag), the tag gets letterspacing (fix 3)
  var TXT = { tag: ['THIS WEEKEND ONLY', 'THIS WEEKEND ONLY'], hd: ['WINTER SALE AT MOSS & THREAD', 'Winter sale at Moss & Thread'],
    pa: ['EVERYTHING IN THE SHOP IS HALF PRICE. COME EARLY FOR THE BEST PICKS. OPEN TEN TILL SIX.', 'Everything in the shop is half price. Come early for the best picks. Open ten till six.'] };
  var L = {};
  function build(id){ var el = $(id), U = TXT[id][0], Lw = TXT[id][1], ws = U.split(' '), wl = Lw.split(' '); el.innerHTML = ''; L[id] = [];
    ws.forEach(function(w, i){ var sw = document.createElement('span'); sw.className = 'w'; for (var j = 0; j < w.length; j++) { var c = document.createElement('span'); c.className = 'c'; c.textContent = w[j]; c._u = w[j]; c._l = wl[i][j]; c._w = i; sw.appendChild(c); L[id].push(c); } el.appendChild(sw); }); }
  // a letter flip wave: each letter switches from caps to its sentence-case form with a small hop, left to right
  function flip(id, t, t0, d){ var n = L[id].length; L[id].forEach(function(c, i){ var a = t0 + d * .7 * i / Math.max(1, n - 1), k = P(t, a, a + d * .3), ch = k >= .5 ? c._l : c._u; if (c.textContent !== ch) c.textContent = ch;
    c.style.transform = k > 0 && k < 1 ? 'translateY(' + (-Math.sin(Math.PI * k) * 6).toFixed(2) + 'px)' : 'none'; c.style.color = k > 0 && k < 1 ? '#c4572a' : ''; }); }
  // word shapes: a filled column per letter, as tall as the letter really is (caps all the same: flat boxes; lowercase: ascenders and descenders)
  var SH = [];
  function shapes(t, o, col){ var g = $('shapes'), list = L.pa, pa = $('pa'), fs = parseFloat(getComputedStyle(pa).fontSize), ox = pa.offsetLeft, oy = pa.offsetTop;
    while (SH.length < list.length) { var r = document.createElementNS(NS, 'rect'); g.appendChild(r); SH.push(r); }
    list.forEach(function(c, i){ var r = SH[i], ch = c.textContent, x = ox + c.offsetLeft + c.parentNode.offsetLeft * 0, lh = c.offsetHeight, base = oy + c.offsetTop + lh * .74;
      var top, bot; if (/[A-Z0-9&]/.test(ch) || /[bdfhklt]/.test(ch)) top = base - fs * .72; else top = base - fs * .52; bot = /[gjpqy]/.test(ch) ? base + fs * .2 : base; if (/[.,]/.test(ch)) { top = base - fs * .14; }
      r.setAttribute('x', (x - .5).toFixed(1)); r.setAttribute('y', top.toFixed(1)); r.setAttribute('width', (c.offsetWidth + 1).toFixed(1)); r.setAttribute('height', (bot - top).toFixed(1)); r.setAttribute('fill', col); r.style.opacity = o.toFixed(3); }); }
  function at(w, n){ return V.at(w, n); }
  function anchors(words){
    V = KM.voice(TEXT, .12, words); PH = V.phrases(4); KM.reset(DUR);
    A.hook = at('It\'s') - .1; A.hard = at('hard'); A.turns = at('Turns'); A.shapes = at('shapes'); A.f1 = at('Fix'); A.sent = at('sentence'); A.f2 = at('Fix', 2); A.labels = at('labels'); A.f3 = at('Fix', 3); A.space = at('space');
    A.calm = at('Calm'); A.easy = at('easy'); A.end = Math.min(DUR - .2, V.end + .8); A.e1 = Math.min(DUR - 1.8, A.easy + 1); A.e2 = Math.min(DUR - .8, A.easy + 2);
    A.fl1 = A.sent; A.fl2 = A.f2 + .5;
    window.COVER = .6;
    var S = DT.S; S.sting(0); [.35, .65, .95].forEach(function(t0, i){ S.land(t0 + .05, 270, i + 1); KM.cue({ t: t0, k: 'tick', g: .08, p: i, x: 270, synth: true }); }); S.whoosh(0, 270, .4);
    S.stamp(A.hard + .1, 270); for (var i = 0; i < 6; i++) S.land(A.turns + .3 + i * .1, 160 + i * 40, i);
    S.rise(A.f1 - .4, .45); S.swap(A.fl1, 1.1, 270, 14); A.d1 = A.fl1 + 1.2; S.done(A.d1, 270, 0);
    S.rise(A.f2 - .1, .4); S.swap(A.fl2, .7, 270, 9); S.snap(A.labels, 150, 2); A.d2 = A.labels + .5; S.done(A.d2, 200, 2);
    S.rise(A.f3 - .1, .4); S.drag(A.space, .5, 150, 300); A.d3 = A.space + .6; S.done(A.d3, 200, 4);
    S.reveal(A.easy); S.land(A.e1, 330, 5); S.done(A.e2, 270, 6);
    CAM = KM.rig({ x: 270, y: 490, z: 1.06, drift: 1 }).pull(0, .55, 270, 490, 1);
    [A.d1, A.d2, A.d3].forEach(function(d){ CAM.pushIn(d - .12, .28, 270, 490, 1.06).pull(d + .55, .6, 270, 490, 1); });
    window.ALIGN = [{ at: A.end - .05, sel: '#tag .w:first-child, #hd .w:first-child, #pa .w:first-child', edge: 'left', why: 'tag, heading and text on one edge' }];
    window.HOLDS = [[A.end, DUR]];
    KM.publish(DT.score(A.calm, A.f1));
  }
  function seek(t){
    t = Math.max(0, Math.min(DUR, t)); var c = CAM.apply($('world'), t, null); KM.lights(t, c);
    DT.intro($('board'), t + .6, .55);
    flip('pa', t, A.fl1, 1.1); flip('hd', t, A.fl2, .7);
    var k2 = DT.spring(t, A.labels - .1, .6), k3 = DT.spring(t, A.space, .7), pa = $('pa'), hd = $('hd'), tg = $('tag');
    pa.style.fontWeight = t >= A.fl1 + .6 ? 500 : 700; hd.style.fontSize = mix(29, 31, k2).toFixed(2) + 'px';
    tg.style.letterSpacing = mix(0, .12, k3).toFixed(3) + 'em'; tg.style.background = 'rgba(196,87,42,' + (.14 * k2).toFixed(3) + ')'; tg.style.padding = '5px ' + (10 * k2).toFixed(1) + 'px'; tg.style.left = (30 - 10 * k2).toFixed(1) + 'px'; tg.style.color = k2 > .5 ? '#c4572a' : '#2b1d14';
    $('scarf').style.transform = 'rotate(' + (Math.sin(t * 2.1) * 3).toFixed(2) + 'deg)';
    // the word shapes: red flat boxes on the caps, turning into green skylines as the letters drop to lowercase
    var so = P(t, A.turns + .2, A.turns + .5) * (1 - P(t, A.d1 + .4, A.d1 + .8)); shapes(t, so * .55, t < A.fl1 + .55 ? '#ff5f5f' : '#2fb37a');
    DT.mood(t, .34 * E.out3(P(t, A.d1 - .2, A.d1 + .5)) + .33 * E.out3(P(t, A.d2 - .2, A.d2 + .5)) + .33 * E.out3(P(t, A.d3 - .2, A.d3 + .5)));
    DT.sweep(t, [A.d1, A.d2, A.d3, A.easy]);
    DT.hook(t, '<i>Stop</i> <i>writing</i> <i>in</i> <em><i>all</i> <i>caps.</i></em>', A.hook);
    var ro = 1 - P(t, A.turns - .3, A.turns);
    [[.35, { x: BX + 22, y: BY + 52, w: 364, h: 72, r: 12 }, 'ALL CAPS', BX + 24, BY + 318], [.65, { x: BX + 22, y: BY + 142, w: 364, h: 138, r: 14 }, 'A WALL', BX + 150, BY + 318]].forEach(function(q, i){
      DT.box('ring' + i, q[1], P(t, q[0], q[0] + .3) * ro, '#ff5f5f'); DT.chip('rl' + i, q[2], q[3], q[4], P(t, q[0] + .1, q[0] + .35) * ro, 'r sm'); });
    DT.chip('hard', 'HARD <b>TO READ</b>', 300, 396, P(t, A.hard - .1, A.hard + .2) - P(t, A.turns - .2, A.turns + .1), 'r');
    DT.chip('shp', 'CAPS = <b>FLAT BOXES</b>', 120, 396, P(t, A.shapes - .3, A.shapes) - P(t, A.f1 - .2, A.f1 + .1));
    DT.chip('c1', 'SENTENCE <b>CASE</b>', 120, 396, P(t, A.sent, A.sent + .3) - P(t, A.f2 - .1, A.f2 + .2));
    DT.sel('s2', { x: BX + 14, y: BY + 18, w: tg.offsetWidth + 22, h: 36 }, P(t, A.labels - .2, A.labels + .1) * (1 - P(t, A.d2 + .2, A.d2 + .5)));
    DT.chip('c2', 'CAPS · <b>SHORT LABELS</b>', 200, 396, P(t, A.labels, A.labels + .3) - P(t, A.f3 - .1, A.f3 + .2));
    DT.hmeasure('ls', BX + 20, BX + 20 + tg.offsetWidth, BY + 16, P(t, A.space, A.space + .3) * (1 - P(t, A.calm - .2, A.calm + .1)), 'SPACED');
    DT.chip('c3', 'SPACE OUT · <b>CAPS</b>', 200, 396, P(t, A.space + .1, A.space + .4) - P(t, A.calm - .2, A.calm + .1));
    [[A.d1, BX + 200, BY + 200], [A.d2, BX + 200, BY + 90], [A.d3, BX + 120, BY + 36]].forEach(function(d, i){ DT.burst('b' + i, d[1], d[2], t, d[0], '#ffb35a'); });
    var br = Math.max(Math.sin(Math.PI * P(t, A.d1, A.d1 + .35)), Math.sin(Math.PI * P(t, A.d2, A.d2 + .35)), Math.sin(Math.PI * P(t, A.d3, A.d3 + .35)));
    $('board').style.boxShadow = '0 30px 70px rgba(0,0,0,.55),0 0 0 ' + (3 * br).toFixed(1) + 'px rgba(255,179,90,.55)';
    DT.chip('win', 'CALM · <b>EASY TO READ</b>', 150, 396, P(t, A.easy - .2, A.easy + .1) - P(t, A.e2 - .2, A.e2 + .1), 'g'); DT.chip('win2', 'SAME WORDS · <b>NO SHOUTING</b>', 120, 396, P(t, A.e2, A.e2 + .3), 'g');
    if (t >= A.e1) L.hd.forEach(function(c, i){ var u = P(t, A.e1 + i * .03, A.e1 + i * .03 + .35); if (u > 0 && u < 1) { c.style.transform = 'translateY(' + (-10 * Math.sin(Math.PI * u)).toFixed(2) + 'px)'; c.style.color = '#2fb37a'; } else c.style.color = ''; });
    var sp = E.back(P(t, A.e1, A.e1 + .4), 2); $('scarf').style.boxShadow = '0 6px 12px rgba(0,0,0,.18),0 0 0 ' + (4 * Math.sin(Math.PI * P(t, A.e1, A.e1 + .5))).toFixed(1) + 'px rgba(94,224,160,.7)';
    DT.burst('b3', BX + 320, BY + 320, t, A.e1, '#5ee0a0');
    DT.box('ok', { x: BX + 18, y: BY + 50, w: 372, h: 230, r: 14 }, P(t, A.e2, A.e2 + .5), '#5ee0a0');
    DT.dial(t, [{ t: 0, sym: '3', label: '3 FIXES' }, { t: A.f1, n: 1 }, { t: A.f2, n: 2 }, { t: A.f3, n: 3 }, { t: A.calm, end: 1, sym: '✓', label: 'CALM' }]);
    DT.title(t, [{ t: A.hook, html: 'Why does it <em>shout</em>?' }, { t: A.f1, html: 'Fix 1 · <em>sentence case</em>' }, { t: A.f2, html: 'Fix 2 · <em>short labels</em>' }, { t: A.f3, html: 'Fix 3 · <em>space caps</em>' }, { t: A.calm, html: 'Calm. <em>Easy.</em>' }]);
    KM.subs($('cap'), t, V, PH, Math.max(0, V.words.findIndex(function(w){ return w.s - V.lead >= A.hook - .25; })), A.end, function(w){ return /^(hard|lowercase|shapes|sentence|case|labels|space|caps|easy)/i.test(w) ? 'var(--amb)' : null; });
  }
  window.setVoice = function(v){ if (v && v.words && v.words.length) anchors(v.words); };
  window.seek = seek; window.DURATION = DUR; window.__A = A;
  Promise.all(["700 22px 'Space Grotesk'", "500 22px 'Space Grotesk'", "700 29px 'Space Grotesk'", "900 31px 'Unbounded'"].map(function(f){ return document.fonts.load(f); }))
    .then(function(){ ['tag', 'hd', 'pa'].forEach(build); anchors(); seek(+(new URLSearchParams(location.search).get('t') || 0)); document.documentElement.dataset.ready = 1; });
})();
/*script:end*/

/*stage:begin*/
<div style="position:absolute;inset:0;background:linear-gradient(160deg,#6d8a8f 0%,#56717a 50%,#43585f 100%)"></div>
<div style="position:absolute;inset:0;background:radial-gradient(30% 20% at 20% 30%,rgba(255,220,160,.35),transparent 70%),radial-gradient(25% 18% at 80% 70%,rgba(255,200,140,.3),transparent 70%),radial-gradient(20% 30% at 60% 20%,rgba(200,120,90,.3),transparent 70%)"></div>
<div style="position:absolute;inset:0;background:linear-gradient(115deg,transparent 30%,rgba(255,255,255,.18) 38%,transparent 44%,transparent 60%,rgba(255,255,255,.12) 66%,transparent 70%)"></div>
<div style="position:absolute;left:-20px;top:-20px;width:44px;height:1080px;background:linear-gradient(90deg,#2a2e33,#5a6068,#2a2e33)"></div>
<div style="position:absolute;left:516px;top:-20px;width:44px;height:1080px;background:linear-gradient(90deg,#2a2e33,#5a6068,#2a2e33)"></div>
<div style="position:absolute;left:470px;top:560px;width:22px;height:140px;border-radius:11px;background:linear-gradient(90deg,#8a8f96,#e0e3e8,#8a8f96)"></div>
<div class="lit" style="background:radial-gradient(55% 40% at 50% 55%,rgba(255,236,200,.45),transparent 75%)"></div>
<div class="lit" style="background:linear-gradient(180deg,rgba(255,220,170,.12),rgba(255,190,120,.05))"></div>
/*stage:end*/
