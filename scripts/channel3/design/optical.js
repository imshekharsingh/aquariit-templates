/*css:begin*/
#art{left:100px;top:432px;width:340px;height:340px;border-radius:14px;background:#f4efe6}
#dot{position:absolute;left:0;top:0;width:76px;height:76px;margin:-38px 0 0 -38px;border-radius:50%;background:#ff7a45;box-shadow:0 8px 24px rgba(255,122,69,.45);z-index:3}
#ghost{position:absolute;left:0;top:0;width:76px;height:76px;margin:-38px 0 0 -38px;border-radius:50%;border:3px dashed #ff7a45;opacity:0;z-index:2}
#felt{position:absolute;left:0;right:0;height:34px;background:rgba(122,162,255,.22);border-top:2px solid rgba(122,162,255,.7);border-bottom:2px solid rgba(122,162,255,.7);opacity:0;z-index:1}
#felt b{position:absolute;left:10px;top:7px;font:700 13px var(--f);letter-spacing:.12em;color:#2b4aa8}
.mini{position:absolute;width:150px;height:190px;border-radius:14px;background:#f4efe6;opacity:0;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,.5)}
.mini .obj{position:absolute;left:50%;top:50%}
.mini .gh{position:absolute;left:50%;top:50%;opacity:0;border:2px dashed #ff7a45;border-radius:8px}
.mini .tg{position:absolute;left:0;right:0;bottom:8px;text-align:center;font:700 11px var(--f);letter-spacing:.16em;color:#8a7f70}
/*css:end*/
/*board:begin*/
<div id="art" class="board"><div id="felt"><b>FELT CENTRE</b></div><div id="ghost"></div><div id="dot"></div></div>
<div class="mini board" id="m0"><div class="gh"></div><div class="obj" style="font:700 19px/1 'Space Grotesk';color:#1d1a16;white-space:nowrap">Night Market</div><div class="tg">TITLE</div></div>
<div class="mini board" id="m1"><div class="gh"></div><div class="obj" style="padding:12px 22px;border-radius:999px;background:#ff7a45;color:#fff;font:700 16px/1 'Space Grotesk';white-space:nowrap">Book now</div><div class="tg">BUTTON</div></div>
<div class="mini board" id="m2"><div class="gh"></div><div class="obj" style="width:62px;height:62px;border-radius:50%;border:5px solid #1d1a16;display:grid;place-items:center;font:900 22px/1 'Unbounded';color:#1d1a16">K</div><div class="tg">BADGE</div></div>
/*board:end*/
/*script:begin*/
(function(){
  var $ = DT.$, P = KM.P, mix = KM.mix, E = KM.ease, cl = KM.cl; KM.theme('dark', 'turnsout'); DT.ctx(); DT.tint('#8fb0ff', '#6a7dff');
  var TEXT = "Your eyes are lying to you. This dot is in the exact centre. So why does it look too low? Turns out, your eyes see the middle a little higher than it really is. So designers nudge things up. Titles, buttons, even logos.";
  var DUR = 18, V, PH, A = {}, CAM, CUR = [], AX = 100, AY = 432, S = 340, NUDGE = 17;
  function at(w, n){ return V.at(w, n); }
  function anchors(words){
    V = KM.voice(TEXT, .12, words); PH = V.phrases(4); KM.reset(DUR); A.hook = at('This');
    A.exact = at('exact'); A.why = at('why'); A.low = at('low'); A.turns = at('Turns'); A.higher = at('higher'); A.nudge = at('nudge'); A.titles = at('Titles'); A.buttons = at('buttons'); A.logos = at('logos'); A.end = Math.min(DUR - .2, V.end + .8);
    window.COVER = .6;
    CAM = KM.rig({ x: 255, y: 480, z: 1.14, drift: .5 }).pull(0, .55, 255, 480, 1).pushIn(A.why - .1, 1.2, 255, 500, 1.03).pull(A.titles - .4, .8, 255, 480, 1);
    var S = DT.S; S.sting(0); S.whoosh(0, 270, .4); S.land(.2, 270, 0); S.land(.45, 270, 4);
    S.rise(A.exact - .3, .3); S.roll(A.exact + .1, .5, 330, 8); S.land(A.exact + .5, 270, 2); S.land(A.exact + .6, 270, 4);
    S.stamp(A.low, 330); S.rise(A.higher - .4, .6); S.tint(A.higher + .1, 270); S.land(A.higher + .45, 270, 6);
    CUR = [[A.nudge - .5, 420, 720, 0], [A.nudge - .1, 288, 602, 0], [A.nudge + .05, 288, 602, 1], [A.nudge + .5, 288, 585, 1], [A.nudge + .7, 288, 585, 0], [A.titles - .1, 470, 700, 0]];
    S.click(A.nudge + .05, 288); S.drag(A.nudge + .05, .45, 288, 288); S.roll(A.nudge + .1, .4, 330, 6); A.d1 = A.nudge + .55; S.done(A.d1, 288, 2);
    [A.titles, A.buttons, A.logos].forEach(function(t0, i){ S.whoosh(t0 - .15, 110 + i * 160, .2); S.land(t0, 110 + i * 160, i * 2); S.snap(t0 + .45, 110 + i * 160, 3 + i * 2); });
    S.reveal(A.logos + .7);
    window.HOLDS = [[A.end, DUR]]; KM.publish(DT.score(A.titles, A.nudge));
  }
  function seek(t){
    t = Math.max(0, Math.min(DUR, t)); var c = CAM.apply($('world'), t, null); KM.lights(t, c);
    DT.mood(t, (.5 * E.out3(P(t, A.d1 - .2, A.d1 + .5)) + .5 * E.out3(P(t, A.logos + .2, A.logos + .9)))); DT.sweep(t, [A.d1, A.titles + .45, A.buttons + .45, A.logos + .45]); DT.hook(t, '<i>Your</i> <i>eyes</i> <i>are</i> <em><i>lying.</i></em>', A.hook);
    var art = $('art'), out = E.inOut3(P(t, A.titles - .35, A.titles + .2)); art.style.opacity = (1 - out).toFixed(3); var ia = 1; art.style.opacity = (1 - out).toFixed(3); art.style.transform = 'translateY(' + (-30 * out + (1 - ia) * 60).toFixed(1) + 'px) perspective(1200px) rotateX(' + ((1 - ia) * 18).toFixed(1) + 'deg) scale(' + ((1 - .1 * out) * (.92 + .08 * ia)).toFixed(3) + ')';
    // the dot: in the exact centre, then nudged up by the cursor (a ghost stays where the maths put it)
    var nk = DT.spring(t, A.nudge + .05, .6), cy = S / 2 - NUDGE * nk; $('dot').style.left = S / 2 + 'px'; $('dot').style.top = cy.toFixed(1) + 'px';
    var g = $('ghost'); g.style.left = S / 2 + 'px'; g.style.top = S / 2 + 'px'; g.style.opacity = (P(t, A.nudge + .1, A.nudge + .4) * (1 - out)).toFixed(3);
    // the proof: crosshairs and two equal measurements (180 / 180)
    var pk = P(t, A.exact, A.exact + .5) * (1 - P(t, A.titles - .4, A.titles - .1));
    DT.line('hx', AX, AY + S / 2, AX + S, AY + S / 2, pk, '#7aa2ff', 1.5, '5 5'); DT.line('vy', AX + S / 2, AY, AX + S / 2, AY + S, pk, '#7aa2ff', 1.5, '5 5');
    var top = Math.round(S / 2 - 38 - NUDGE * nk), bot = Math.round(S / 2 - 38 + NUDGE * nk);
    DT.measure('mt', AX + S / 2 + 60, AY, AY + cy - 38, pk, top + ' px'); DT.measure('mb', AX + S / 2 + 60, AY + cy + 38, AY + S, pk, bot + ' px');
    DT.chip('eq', 'EXACT <b>CENTRE</b>', 300, 400, P(t, A.exact + .3, A.exact + .6) - P(t, A.turns - .2, A.turns + .1));
    // "too low": the felt centre band appears a little above the real one
    var fk = P(t, A.higher - .1, A.higher + .4) * (1 - P(t, A.nudge + .7, A.nudge + 1)), f = $('felt'); f.style.top = (S / 2 - NUDGE - 17) + 'px'; f.style.opacity = fk.toFixed(3);
    DT.chip('low', 'LOOKS <b>TOO LOW</b>', 300, 400, P(t, A.low, A.low + .3) - P(t, A.higher - .2, A.higher + .1), 'r');
    DT.chip('opt', 'OPTICAL CENTRE <b>↑ 5%</b>', 210, 400, P(t, A.nudge + .4, A.nudge + .7) - P(t, A.titles - .4, A.titles - .1), 'g');
    // three small designs: each one starts at the maths centre (dashed) and snaps up to the optical one
    [A.titles, A.buttons, A.logos].forEach(function(s, i){ var m = $('m' + i), k = E.back(P(t, s - .15, s + .25), 1.6), up = DT.spring(t, s + .35, .5);
      m.style.left = (35 + i * 160) + 'px'; m.style.top = (470 + (1 - k) * 40) + 'px'; m.style.opacity = cl(k).toFixed(3);
      var o = m.querySelector('.obj'), w = o.offsetWidth, h = o.offsetHeight; o.style.transform = 'translate(' + (-w / 2) + 'px,' + (-h / 2 - 12 * up).toFixed(1) + 'px)';
      var gh = m.querySelector('.gh'); gh.style.width = w + 'px'; gh.style.height = h + 'px'; gh.style.transform = 'translate(' + (-w / 2) + 'px,' + (-h / 2) + 'px)'; gh.style.opacity = (P(t, s + .35, s + .6) * .9).toFixed(3); });
    DT.burst('b0', AX + S / 2, AY + S / 2 - NUDGE, t, A.d1, '#5ee0a0'); [A.titles, A.buttons, A.logos].forEach(function(t0, i){ DT.burst('m' + i, 110 + i * 160, 565, t, t0 + .45, '#ffb35a'); });
    DT.chip('all', 'NUDGE IT <b>UP</b>', 190, 690, P(t, A.logos + .6, A.logos + .9), 'g');
    DT.cursor(t, CUR);
    DT.dial(t, [{ t: 0, sym: '?', label: 'LOOK' }, { t: A.exact, n: 1, word: 'STEP' }, { t: A.turns, n: 2, word: 'STEP' }, { t: A.nudge, n: 3, word: 'STEP' }, { t: A.titles, end: 1, sym: '✓', label: 'EVERYWHERE' }]);
    DT.title(t, [{ t: A.hook, html: 'Is this dot <em>centred</em>?' }, { t: A.exact, html: 'Measured: <em>centre</em>' }, { t: A.turns, html: 'Your eye aims <em>higher</em>' }, { t: A.nudge, html: 'Designers <em>nudge it up</em>' }, { t: A.titles, html: 'Titles, buttons, <em>logos</em>' }]);
    KM.subs($('cap'), t, V, PH, Math.max(0, V.words.findIndex(function(w){ return w.s - V.lead >= A.hook - .25; })), A.end, function(w){ return /^(exact|centre|low|eyes|higher|nudge|up|titles|buttons|logos)/i.test(w) ? 'var(--amb)' : null; });
  }
  window.setVoice = function(v){ if (v && v.words && v.words.length) anchors(v.words); };
  window.seek = seek; window.DURATION = DUR;
  Promise.all(["700 24px 'Space Grotesk'", "900 22px 'Unbounded'", "900 31px 'Unbounded'"].map(function(f){ return document.fonts.load(f); }))
    .then(function(){ anchors(); seek(+(new URLSearchParams(location.search).get('t') || 0)); document.documentElement.dataset.ready = 1; });
})();
/*script:end*/

/*stage:begin*/
<div style="position:absolute;inset:0;background:radial-gradient(90% 60% at 50% 40%,#fbfaf7,#e6e2da 80%)"></div>
<div style="position:absolute;left:0;right:0;top:820px;bottom:0;background:linear-gradient(180deg,#e2ddd3,#d4cec2)"></div>
<div class="lit" style="background:radial-gradient(50% 40% at 50% 48%,rgba(255,255,255,.85),transparent 75%)"></div>
<div class="lit" style="background:linear-gradient(120deg,rgba(150,180,255,.12),transparent 60%)"></div>
/*stage:end*/
