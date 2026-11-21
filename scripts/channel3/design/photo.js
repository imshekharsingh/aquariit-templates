/*css:begin*/
.rul{position:absolute;width:24px;border-radius:6px;background:repeating-linear-gradient(180deg,rgba(24,26,36,.9) 0 2px,transparent 2px 12px) left/9px 100% no-repeat,repeating-linear-gradient(180deg,rgba(24,26,36,.75) 0 2px,transparent 2px 60px) left/16px 100% no-repeat,linear-gradient(90deg,#ece7dd,#dcd5c7);box-shadow:0 10px 26px rgba(0,0,0,.35);z-index:1}
.rul.r{transform:scaleX(-1)}
#board{left:70px;top:396px;width:400px;height:380px;border-radius:6px;background:#2a0f4a}
#ph{position:absolute;left:0;top:0;width:400px;height:380px;transform-origin:50% 50%}
#dk{position:absolute;left:0;top:0;width:400px;height:380px;background:linear-gradient(180deg,rgba(10,6,24,.62),rgba(10,6,24,.84));transform-origin:50% 100%;opacity:0}
#bnd{position:absolute;left:0;top:86px;width:400px;height:120px;background:#110c1e;transform-origin:0 50%;transform:scaleX(0)}
.tx{position:absolute;left:0;top:0;white-space:nowrap}
.tape{position:absolute;width:62px;height:20px;background:rgba(240,232,210,.82);box-shadow:0 2px 4px rgba(0,0,0,.25);z-index:29}
/*css:end*/
/*board:begin*/
<div class="rul" style="left:8px;top:400px;height:246px"></div><div class="rul r" style="left:508px;top:400px;height:246px"></div>
<div id="board" class="board">
  <svg id="ph" viewBox="0 0 400 380">
    <defs>
      <linearGradient id="phg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a1f8a"/><stop offset=".45" stop-color="#d0407a"/><stop offset=".8" stop-color="#ffad4a"/><stop offset="1" stop-color="#ffd27a"/></linearGradient>
      <radialGradient id="hot" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset=".55" stop-color="#fff2fa" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <linearGradient id="bmg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    </defs>
    <rect width="400" height="380" fill="url(#phg)"/>
    <g id="beams" style="mix-blend-mode:screen">
      <polygon id="bm0" points="60,-10 74,-10 140,380 -10,380" fill="url(#bmg)"/>
      <polygon id="bm1" points="150,-10 164,-10 260,380 90,380" fill="url(#bmg)"/>
      <polygon id="bm2" points="240,-10 254,-10 330,380 170,380" fill="url(#bmg)"/>
      <polygon id="bm3" points="330,-10 344,-10 420,380 260,380" fill="url(#bmg)"/>
    </g>
    <ellipse id="hotA" cx="200" cy="140" rx="190" ry="110" fill="url(#hot)"/>
    <ellipse id="hotB" cx="200" cy="262" rx="160" ry="60" fill="url(#hot)" opacity=".8"/>
    <g id="bok"></g>
    <path id="crowd" d="M0 380 L0 330 Q14 304 30 326 Q40 290 58 318 L64 270 L72 316 Q86 296 100 322 Q112 300 128 324 Q142 292 156 320 L162 262 L172 318 Q186 300 200 326 Q214 296 230 322 Q244 302 258 326 L266 276 L276 320 Q290 296 304 324 Q318 300 334 326 Q348 294 362 320 L370 268 L378 318 Q390 304 400 322 L400 380 Z" fill="#1c0b22"/>
    <rect x="0" y="22" width="400" height="7" fill="#2a1430" opacity=".9"/>
  </svg>
  <div id="dk"></div>
  <div id="bnd"></div>
  <div class="tx" id="t0">NIGHT SIGNALS</div>
  <div class="tx" id="t1">live at the old mill</div>
  <div class="tx" id="t2">SAT 14 DEC · 8 PM</div>
  <div class="tape" style="left:-14px;top:-4px;transform:rotate(-24deg)"></div><div class="tape" style="left:352px;top:-4px;transform:rotate(22deg)"></div>
  <div class="tape" style="left:-14px;top:362px;transform:rotate(22deg)"></div><div class="tape" style="left:352px;top:362px;transform:rotate(-24deg)"></div>
</div>
/*board:end*/
/*script:begin*/
(function(){
  var $ = DT.$, P = KM.P, mix = KM.mix, E = KM.ease, cl = KM.cl; KM.theme('dark', 'turnsout'); DT.ctx(); DT.tint('#ffc44d', '#ff7a45');
  var TEXT = "Nobody can read this poster. The photo is too busy. Turns out, text needs calm. Fix one: darken the photo. Fix two: a solid band. Fix three: one bold colour. Now it reads across the street.";
  var DUR = 16, BX = 70, BY = 396, BW = 400, V, PH, A = {}, CAM, CUR = [];
  // A: thin pale text in three pastel colours straight on the brightest part of the photo; B: one bold colour (amber), the title on a solid band
  var TX = {
    t0: { A: { f: "400 40px 'Space Grotesk'", c: '#fff4fc', y: 108, ls: '.06em' }, B: { f: "700 44px 'Space Grotesk'", c: '#ffc44d', y: 104, ls: '.01em' } },
    t1: { A: { f: "400 19px 'Space Grotesk'", c: '#dff6ff', y: 164, ls: '.04em' }, B: { f: "700 19px 'Space Grotesk'", c: '#ffc44d', y: 164, ls: '.06em' } },
    t2: { A: { f: "400 22px 'Space Grotesk'", c: '#ffe3ef', y: 250, ls: '.06em' }, B: { f: "700 24px 'Space Grotesk'", c: '#ffc44d', y: 250, ls: '.04em' } } };
  var IDS = ['t0', 't1', 't2'], BOK = [];
  function font(el, s){ el.style.font = s.f; el.style.color = s.c; el.style.letterSpacing = s.ls || 'normal'; }
  function build(){ var g = $('bok'), NS = 'http://www.w3.org/2000/svg', cols = ['#fff', '#ffe3f4', '#d9f2ff', '#fff2c4'];
    for (var i = 0; i < 30; i++) { var c = document.createElementNS(NS, 'circle'), x = (i * 137.5) % 400, y = 40 + ((i * 71) % 250), r = 4 + (i * 7) % 13;
      c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', r); c.setAttribute('fill', cols[i % 4]); g.appendChild(c); BOK.push({ e: c, ph: i * 1.7, o: .45 + (i % 5) * .1 }); }
    IDS.forEach(function(id){ font($(id), TX[id].A); }); }
  function at(w, n){ return V.at(w, n); }
  function anchors(words){
    V = KM.voice(TEXT, .12, words); PH = V.phrases(4); KM.reset(DUR);
    A.hook = at('The') - .1; A.busy = at('busy'); A.turns = at('Turns'); A.calm = at('calm'); A.f1 = at('Fix'); A.dark = at('darken'); A.f2 = at('Fix', 2); A.band = at('band'); A.f3 = at('Fix', 3); A.bold = at('bold');
    A.now = at('Now'); A.street = at('street'); A.end = Math.min(DUR - .2, V.end + .8); A.e1 = Math.min(DUR - 2, A.street + 1.1); A.e2 = Math.min(DUR - .9, A.street + 2.3);
    window.COVER = .6;
    var S = DT.S; S.sting(0); [.35, .65, .95].forEach(function(t0, i){ S.land(t0 + .05, 270, i + 1); KM.cue({ t: t0, k: 'tick', g: .08, p: i, x: 270, synth: true }); }); S.whoosh(0, 270, .4);
    // the busy beat: the beams swing (air moving left and right), a stamp on "busy"
    S.drag(A.hook, .6, 120, 420); S.drag(A.hook + .6, .6, 420, 120); S.stamp(A.busy + .1, 270); S.tint(A.calm, 270);
    // fix one: the cursor grabs the photo and pulls the dark layer up
    S.rise(A.f1 - .4, .45); S.click(A.dark - .05, 270); S.drag(A.dark, .7, 270, 270); A.d1 = A.dark + .8; S.done(A.d1, 270, 0);
    // fix two: the band slides in from the left edge under the title
    S.rise(A.f2 - .1, .4); S.whoosh(A.f2 + .3, 90, .2); S.snap(A.band + .1, 270, 2); A.d2 = A.band + .5; S.done(A.d2, 270, 2);
    // fix three: a scan line, the letters flip into one bold colour
    A.scan = A.f3 + .35; S.rise(A.f3 - .1, .4); IDS.forEach(function(id, i){ S.swap(A.scan + .1 + i * .2, .4, 270, 6); }); S.tint(A.bold + .2, 270); A.d3 = A.scan + 1.05; S.done(A.d3, 270, 4);
    // the payoff: the camera steps back (across the street), the score resolves
    S.whoosh(A.now - .1, 270, .5); S.reveal(A.street - .05); S.done(A.e1 + .3, 400, 6); S.land(A.e2 + .1, 270, 4);
    CAM = KM.rig({ x: 270, y: 490, z: 1.06, drift: 1 }).pull(0, .55, 270, 490, 1);
    [A.d1, A.d2, A.d3].forEach(function(d){ CAM.pushIn(d - .12, .28, 270, 490, 1.06).pull(d + .55, .6, 270, 490, 1); });
    CAM.pull(A.now, 1.1, 270, 490, .93);
    window.ALIGN = [{ at: A.end - .05, sel: 'span', each: '#t0, #t1, #t2', edge: 'bottom', why: 'every letter on its line' }];
    window.HOLDS = [[A.end, DUR]];
    KM.publish(DT.score(A.now, A.f1));
  }
  function seek(t){
    t = Math.max(0, Math.min(DUR, t)); var c = CAM.apply($('world'), t, null); KM.lights(t, c);
    DT.intro($('board'), t + .6, .55);
    var k1 = E.out3(P(t, A.dark, A.dark + .8)), k2 = DT.spring(t, A.band - .15, .7), k3 = P(t, A.scan, A.scan + 1.05);
    // the photo: beams swing and the lights twinkle (the busy part), calming as the dark layer lands
    var calm = 1 - .8 * k1, sw = Math.sin(t * 1.9) * 9 * calm;
    for (var i = 0; i < 4; i++) $('bm' + i).setAttribute('transform', 'rotate(' + (sw * (i % 2 ? -1 : 1) + Math.sin(t * 1.3 + i) * 4 * calm).toFixed(2) + ' ' + (67 + i * 90) + ' 0)');
    BOK.forEach(function(b){ b.e.setAttribute('opacity', (b.o * (.6 + .4 * Math.sin(t * 3.1 + b.ph) * calm + .4 * (1 - calm))).toFixed(3)); });
    var jp = Math.max(0, Math.sin(Math.PI * P(t, A.e2, A.e2 + .45))) + .7 * Math.max(0, Math.sin(Math.PI * P(t, A.e2 + .5, A.e2 + .95))); $('crowd').setAttribute('transform', 'translate(0,' + (-22 * jp).toFixed(2) + ')');   // the crowd jumps on the payoff
    $('beams').style.opacity = (1 - .5 * k1 + .5 * P(t, A.e2, A.e2 + .5)).toFixed(3);
    $('ph').style.filter = 'saturate(' + (1 - .3 * k1).toFixed(3) + ')';
    var dk = $('dk'); dk.style.opacity = k1.toFixed(3); dk.style.transform = 'scaleY(' + (.2 + .8 * k1).toFixed(3) + ')';
    $('bnd').style.transform = 'scaleX(' + cl(k2).toFixed(4) + ')';
    IDS.forEach(function(id, i){ var el = $(id), a = TX[id].A, b = TX[id].B, t0f = A.scan + .1 + i * .2, kf = cl((t - t0f) / .45);
      font(el, kf >= .5 ? b : a); DT.flipChars(el, t, t0f, .45, a, b);
      var w = el.offsetWidth; el.style.transform = 'translate(' + ((BW - w) / 2).toFixed(1) + 'px,' + mix(a.y, b.y, k3 > 0 ? cl((t - t0f) / .45) : 0).toFixed(1) + 'px)';
      el.style.textShadow = kf >= 1 ? '0 2px 10px rgba(0,0,0,.35)' : 'none'; });
    // the payoff wave: the title's letters hop one after another (a new element in the tail, above the captions)
    var tl = $('t0')._ch || []; if (t >= A.e2 - .05) tl.forEach(function(s, i){ var u = P(t, A.e2 + i * .05, A.e2 + i * .05 + .4); s.style.transform = 'translateY(' + (-14 * Math.sin(Math.PI * u)).toFixed(2) + 'px)'; s.style.color = u > 0 && u < 1 ? '#fff1c9' : '#ffc44d'; });
    DT.mood(t, .34 * E.out3(P(t, A.d1 - .2, A.d1 + .5)) + .33 * E.out3(P(t, A.d2 - .2, A.d2 + .5)) + .33 * E.out3(P(t, A.d3 - .2, A.d3 + .5)));
    DT.sweep(t, [A.d1, A.d2, A.d3, A.street - .05]);
    DT.hook(t, '<i>Nobody</i> <i>can</i> <em><i>read</i></em> <i>this</i> <i>poster.</i>', A.hook);
    // frame 0: the problems ringed
    var ro = 1 - P(t, A.turns - .3, A.turns);
    [[.35, { x: BX + 20, y: BY + 92, w: 360, h: 104, r: 16 }, 'THIN TEXT', BX + 8, BY + 334], [.65, { x: BX + 30, y: BY + 222, w: 340, h: 62, r: 14 }, 'NO CONTRAST', BX + 128, BY + 334], [.95, { x: BX + 300, y: BY + 30, w: 84, h: 70, r: 14 }, 'BUSY PHOTO', BX + 196, BY + 2]].forEach(function(r, i){
      DT.box('ring' + i, r[1], P(t, r[0], r[0] + .3) * ro, '#ff5f5f'); DT.chip('rl' + i, r[2], r[3], r[4], P(t, r[0] + .1, r[0] + .35) * ro, 'r sm'); });
    DT.chip('busy', 'TOO <b>BUSY</b>', 300, 396, P(t, A.busy - .1, A.busy + .2) - P(t, A.turns - .2, A.turns + .1), 'r');
    DT.chip('calm', 'TEXT NEEDS <b>CALM</b>', 100, 396, P(t, A.calm - .1, A.calm + .2) - P(t, A.f1 - .2, A.f1 + .1));
    // fix one: select the photo, the cursor pulls the dark layer up
    var sk = P(t, A.f1 + .1, A.f1 + .5), so = 1 - P(t, A.d1, A.d1 + .3);
    DT.sel('phs', { x: BX + 6, y: BY + 6, w: BW - 12, h: 368 }, sk * so);
    DT.chip('c1', 'DARKEN <b>PHOTO</b>', 100, 396, P(t, A.dark, A.dark + .3) - P(t, A.f2 - .1, A.f2 + .2));
    // fix two: the band, measured across the poster
    DT.sel('bns', { x: BX, y: BY + 86, w: BW * cl(k2), h: 120 }, P(t, A.band - .1, A.band + .2) * (1 - P(t, A.d2 + .2, A.d2 + .5)));
    DT.chip('c2', 'SOLID <b>BAND</b>', 300, 396, P(t, A.band, A.band + .3) - P(t, A.f3 - .1, A.f3 + .2));
    // fix three: the scan line, then the colour chip with its swatch
    var sc = P(t, A.scan, A.scan + 1.05); DT.line('scan', BX + 4, BY + 90 + sc * 200, BX + BW - 4, BY + 90 + sc * 200, sc > 0 && sc < 1 ? 1 : 0, '#ffb35a', 3);
    DT.chip('c3', '<i style="display:inline-block;width:14px;height:14px;border-radius:4px;background:#ffc44d;margin-right:8px;vertical-align:-1px"></i>ONE <b>BOLD COLOUR</b>', 150, 396, P(t, A.bold, A.bold + .3) - P(t, A.now - .2, A.now + .1));
    [[A.d1, BX + BW / 2, BY + 300], [A.d2, BX + 40, BY + 146], [A.d3, BX + BW / 2, BY + 120]].forEach(function(d, i){ DT.burst('b' + i, d[1], d[2], t, d[0], '#ffb35a'); });
    var br = Math.max(Math.sin(Math.PI * P(t, A.d1, A.d1 + .35)), Math.sin(Math.PI * P(t, A.d2, A.d2 + .35)), Math.sin(Math.PI * P(t, A.d3, A.d3 + .35)));
    $('board').style.boxShadow = '0 30px 70px rgba(0,0,0,.6),0 0 0 ' + (3 * br).toFixed(1) + 'px rgba(255,179,90,.55)';
    DT.chip('win', 'READS AT A <b>GLANCE</b>', 150, 396, P(t, A.street - .2, A.street + .15) - P(t, A.e2 - .2, A.e2 + .1), 'g');
    // the tail keeps landing things: a green frame on the readable title with a spark, then the recap chip
    DT.box('ok', { x: BX + 14, y: BY + 92, w: BW - 28, h: 108, r: 14 }, P(t, A.e1, A.e1 + .4), '#5ee0a0'); DT.burst('b3', BX + BW - 20, BY + 96, t, A.e1 + .3, '#5ee0a0');
    DT.chip('recap', 'SAME PHOTO · <b>3 FIXES</b>', 150, 396, P(t, A.e2, A.e2 + .3), 'g');
    DT.box('ok2', { x: BX + 60, y: BY + 236, w: BW - 120, h: 52, r: 12 }, P(t, A.e2, A.e2 + .4), '#5ee0a0'); DT.burst('b4', BX + 70, BY + 262, t, A.e2 + .3, '#5ee0a0');
    var cp = DT.cursor(t, CUR);
    DT.dial(t, [{ t: 0, sym: '3', label: '3 FIXES' }, { t: A.f1, n: 1 }, { t: A.f2, n: 2 }, { t: A.f3, n: 3 }, { t: A.now, end: 1, sym: '✓', label: 'READABLE' }]);
    DT.title(t, [{ t: A.hook, html: 'Why can\'t you <em>read</em> it?' }, { t: A.f1, html: 'Fix 1 · <em>darken the photo</em>' }, { t: A.f2, html: 'Fix 2 · <em>a solid band</em>' }, { t: A.f3, html: 'Fix 3 · <em>one bold colour</em>' }, { t: A.now, html: 'Now it <em>reads.</em>' }]);
    KM.subs($('cap'), t, V, PH, Math.max(0, V.words.findIndex(function(w){ return w.s - V.lead >= A.hook - .25; })), A.end, function(w){ return /^(busy|calm|darken|photo|solid|band|bold|colour|street)/i.test(w) ? 'var(--amb)' : null; });
  }
  function cursorKeys(){ CUR = [[A.f1 + .1, 420, 700, 0], [A.dark - .05, 270, 740, 1], [A.dark + .7, 270, 560, 1], [A.d1 + .2, 300, 560, 0], [A.band - .25, 90, 540, 0], [A.band + .3, 440, 540, 1], [A.d2 + .2, 450, 600, 0]]; }
  window.setVoice = function(v){ if (v && v.words && v.words.length) { anchors(v.words); cursorKeys(); } };
  window.seek = seek; window.DURATION = DUR; window.__A = A;
  Promise.all(["400 40px 'Space Grotesk'", "700 44px 'Space Grotesk'", "900 31px 'Unbounded'"].map(function(f){ return document.fonts.load(f); }))
    .then(function(){ build(); anchors(); cursorKeys(); seek(+(new URLSearchParams(location.search).get('t') || 0)); document.documentElement.dataset.ready = 1; });
})();
/*script:end*/

/*stage:begin*/
<div style="position:absolute;inset:0;background:linear-gradient(180deg,#6a4a5e 0%,#5a3e56 50%,#46344e 100%)"></div>
<div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(30,16,28,.55) 0 3px,transparent 3px 34px),repeating-linear-gradient(90deg,rgba(30,16,28,.45) 0 3px,transparent 3px 70px);opacity:.8"></div>
<div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 34px,transparent 34px 68px),repeating-linear-gradient(90deg,rgba(150,80,64,.28) 0 35px,rgba(110,60,56,.2) 35px 70px)"></div>
<div style="position:absolute;left:290px;top:0;width:30px;height:1040px;background:linear-gradient(90deg,#2a2f3e,#596178 45%,#232836);box-shadow:6px 0 14px rgba(0,0,0,.4)"></div>
<div style="position:absolute;left:0;right:0;top:850px;height:190px;background:linear-gradient(180deg,#4a4a5e,#2c2c3c);box-shadow:0 -2px 0 rgba(255,200,140,.18)"></div>
<div style="position:absolute;left:120px;top:880px;width:380px;height:60px;border-radius:50%;background:radial-gradient(50% 50% at 50% 50%,rgba(255,190,110,.25),transparent 70%)"></div>
<div class="lit" style="background:radial-gradient(42% 30% at 58% 8%,rgba(255,196,110,.75),transparent 75%)"></div>
<div class="lit" style="background:radial-gradient(60% 40% at 50% 55%,rgba(255,170,90,.22),transparent 75%)"></div>
/*stage:end*/
