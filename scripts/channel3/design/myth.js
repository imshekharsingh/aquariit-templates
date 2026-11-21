/*css:begin*/
#poster{left:60px;top:420px;width:420px;height:360px;border-radius:16px;background:#f4efe6}
.pl{position:absolute;left:0;top:0;white-space:nowrap;color:#1d1a16}
#stamp{left:318px;top:704px;padding:8px 18px;border:4px solid #ff6b6b;border-radius:10px;font:900 30px/1 var(--d);color:#ff6b6b;opacity:0;z-index:26;background:rgba(11,13,22,.85)}
#eye{left:0;top:0;width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:50%;background:#7aa2ff;box-shadow:0 0 0 6px rgba(122,162,255,.3),0 0 18px #7aa2ff;opacity:0;z-index:27}
/*css:end*/
/*board:begin*/
<div id="poster" class="board">
  <div class="pl" id="l0" style="font:700 34px/1 'Space Grotesk'">Night Market</div>
  <div class="pl" id="l1" style="font:700 15px/1 'Space Grotesk';letter-spacing:.14em;color:#c4572a">SATURDAY · 7 PM</div>
  <div class="pl" id="l2" style="font:500 22px/1 'Space Grotesk'">Food and music</div>
  <div class="pl" id="l3" style="font:500 22px/1 'Space Grotesk'">for the whole neighbourhood.</div>
  <div class="pl" id="l4" style="font:500 22px/1 'Space Grotesk'">Bring a bag.</div>
  <div class="pl" id="l5" style="font:700 22px/1 'Space Grotesk'">Free entry</div>
</div>
<div id="stamp" class="a">MYTH</div>
<div id="eye" class="a"></div>
/*board:end*/
/*script:begin*/
(function(){
  var $ = DT.$, P = KM.P, mix = KM.mix, E = KM.ease, cl = KM.cl; KM.theme('dark', 'turnsout'); DT.ctx(); DT.tint('#ff7f7f', '#ff9a6a');
  var TEXT = "Stop centring everything. It looks neat, but turns out, it's hard to read. Watch your eye. Every centred line starts somewhere new, so it jumps. Line them up on the left, and it reads in one smooth path.";
  var DUR = 18, V, PH, A = {}, CAM, CUR = [], PX = 60, PY = 420, PW = 420, LX = 36, YS = [40, 92, 150, 186, 222, 280], W = [];
  function at(w, n){ return V.at(w, n); }
  function anchors(words){
    V = KM.voice(TEXT, .12, words); PH = V.phrases(4); KM.reset(DUR); A.hook = at('It');
    A.turns = at('Turns'); A.watch = at('Watch'); A.every = at('Every'); A.jumps = at('jumps'); A.line = at('Line', 2); A.left = at('left'); A.smooth = at('smooth'); A.end = Math.min(DUR - .2, V.end + .8);
    window.COVER = .6;
    CAM = KM.rig({ x: 255, y: 480, z: 1.14, drift: .5 }).pull(0, .55, 255, 480, 1).pushIn(A.watch, 1, 255, 500, 1.02).pull(A.smooth, .8, 255, 480, 1);
    var S = DT.S; S.sting(0); S.whoosh(0, 270, .4); for (var q = 0; q < 6; q++) S.land(.12 + q * .05, 270, q); S.stamp(.12, 400); S.stamp(A.turns + .05, 350);
    // the eye: each jump to a new line start is a pitched hop (a restless, broken little tune); after the fix one rising glide
    A.e1 = A.watch + .2; A.e1d = Math.max(2, A.line - A.watch - .6); A.e2 = A.left + .55; A.e2d = 1.4;
    S.rise(A.watch - .3, .3); for (var i = 0; i < 6; i++) S.land(A.e1 + i * A.e1d / 5, 200 + (i % 2) * 140, [0, 5, 1, 6, 2, 7][i]);
    CUR = [[A.line - .3, 440, 700, 0], [A.line, 100, 440, 0], [A.line + .15, 100, 440, 1], [A.line + .6, 470, 730, 1], [A.line + .8, 470, 730, 0], [A.left + .3, 470, 760, 0]];
    S.click(A.line + .15, 100); S.drag(A.line + .15, .45, 100, 470);
    for (i = 0; i < 6; i++) S.snap(A.left + .05 + i * .07 + .3, 96, i); A.d1 = A.left + .9; S.done(A.d1, 96, 0);
    S.rise(A.e2 - .2, .3); S.drag(A.e2, A.e2d, 96, 96); A.d2 = A.e2 + A.e2d; S.done(A.d2, 96, 4); S.reveal(A.smooth + .3);
    window.ALIGN = [{ at: A.end - .05, sel: '.pl', edge: 'left', why: 'every line starts on one edge' }];
    window.HOLDS = [[A.end, DUR]]; KM.publish(DT.score(A.smooth, A.line));
  }
  function xAt(i, k){ var xc = (PW - W[i]) / 2; return mix(xc, LX, k); }
  function eyePath(t, k){ // the reading path at progress u (0..1) over the six lines: start of each line, then across it
    var pts = []; YS.forEach(function(y, i){ pts.push([PX + xAt(i, k) - 16, PY + y + 11]); }); return pts; }   // where the eye lands at the start of each line
  function seek(t){
    t = Math.max(0, Math.min(DUR, t)); var c = CAM.apply($('world'), t, null); KM.lights(t, c);
    DT.mood(t, (.5 * E.out3(P(t, A.d1 - .2, A.d1 + .5)) + .5 * E.out3(P(t, A.d2 - .2, A.d2 + .5))), [$('poster')]); DT.sweep(t, [A.d1, A.d2]); DT.hook(t, '<i>Stop</i> <em><i>centring</i></em> <i>everything.</i>', A.hook);
    DT.intro($('poster'), t, .55); DT.burst('b1', PX + LX - 8, PY + 160, t, A.d1, '#ffb35a'); DT.burst('b2', PX + LX - 16, PY + 291, t, A.d2, '#5ee0a0');
    var ks = []; for (var i = 0; i < 6; i++) { ks.push(DT.spring(t, A.left + .05 + i * .07, .6)); var el = $('l' + i); el.style.transform = 'translate(' + xAt(i, ks[i]).toFixed(1) + 'px,' + YS[i] + 'px)'; }
    // the myth stamp slams on, then leaves when the eye starts
    var sk = P(t, .05, .35), so = 1 - P(t, A.watch - .3, A.watch); $('stamp').style.opacity = (cl(sk * 3) * so).toFixed(3); $('stamp').style.transform = 'rotate(-10deg) scale(' + mix(1.8, 1, E.out3(sk)).toFixed(3) + ')';
    // the ragged left edges: a red tick at each line's start (before), one amber edge (after)
    var rk = P(t, A.every, A.every + .3) * (1 - P(t, A.smooth + .6, A.smooth + .9));
    for (i = 0; i < 6; i++) { var x = PX + xAt(i, ks[i]) - 8; DT.line('rt' + i, x, PY + YS[i] - 2, x, PY + YS[i] + 24, rk, ks[i] > .98 ? '#ffb35a' : '#ff6b6b', 3); }
    // the eye's reading path: zigzag before (red), one smooth path after (green)
    var run = function(t0, d, k, id, col){ var pts = eyePath(t, k), u = P(t, t0, t0 + d), n = pts.length - 1, f = u * n, j = Math.min(n - 1, Math.floor(f)), r = f - j;
      for (var q = 0; q < n; q++) { var a = pts[q], b = pts[q + 1], kk = q < j ? 1 : q === j ? r : 0; DT.line(id + q, a[0], a[1], b[0], b[1], kk * (u > 0 ? 1 : 0), col, 4); }
      var p = u >= 1 ? pts[n] : [mix(pts[j][0], pts[j + 1][0], E.inOut3(r)), mix(pts[j][1], pts[j + 1][1], E.inOut3(r))]; return { p: p, u: u }; };
    var fade1 = 1 - P(t, A.line - .2, A.line + .1), e1 = run(A.e1, A.e1d, 0, 'z', '#ff6b6b');
    for (i = 0; i < 5; i++) { var ln = DT.svg('z' + i, 'line'); ln.style.opacity = (+ln.style.opacity || 0) * fade1; }
    var e2 = run(A.e2, A.e2d, 1, 's', '#5ee0a0'), eye = $('eye'), ep = t < A.line ? e1 : e2, eo = t < A.line ? (e1.u > 0 ? fade1 : 0) : (e2.u > 0 ? 1 - P(t, A.end - .3, A.end) : 0);
    eye.style.left = ep.p[0].toFixed(1) + 'px'; eye.style.top = ep.p[1].toFixed(1) + 'px'; eye.style.opacity = eo.toFixed(3); eye.style.background = t < A.line ? '#ff6b6b' : '#5ee0a0';
    var jumps = Math.min(5, Math.floor(P(t, A.e1, A.e1 + A.e1d) * 5 + .001));
    DT.chip('jumps', 'EYE JUMPS <b>' + jumps + '</b>', 320, 412, P(t, A.e1, A.e1 + .3) - P(t, A.line - .2, A.line + .1), 'r');
    DT.line('edge', PX + LX - 8, PY + 20, PX + LX - 8, PY + 320, P(t, A.left + .4, A.left + .8) * (1 - P(t, A.smooth + .6, A.smooth + .9)), '#ffb35a', 2, '6 5');
    DT.chip('path', 'ONE <b>SMOOTH PATH</b>', 280, 412, P(t, A.smooth, A.smooth + .3), 'g');
    DT.cursor(t, CUR);
    DT.dial(t, [{ t: 0, sym: '!', label: 'MYTH' }, { t: A.watch, n: 1, word: 'STEP' }, { t: A.line, n: 2, word: 'STEP' }, { t: A.smooth, end: 1, sym: '✓', label: 'TURNS OUT' }]);
    DT.title(t, [{ t: 0, html: '"Centre it to look <em>neat</em>"' }, { t: A.turns, html: 'Turns out: <em>hard to read</em>' }, { t: A.watch, html: 'Watch your <em>eye</em>' }, { t: A.line, html: 'One edge. <em>One path.</em>' }]);
    KM.subs($('cap'), t, V, PH, 0, A.end, function(w){ return /^(centre|neat|hard|eye|jumps|left|smooth|path)/i.test(w) ? 'var(--amb)' : null; });
  }
  window.setVoice = function(v){ if (v && v.words && v.words.length) anchors(v.words); };
  window.seek = seek; window.DURATION = DUR;
  Promise.all(["700 34px 'Space Grotesk'", "500 22px 'Space Grotesk'", "900 30px 'Unbounded'"].map(function(f){ return document.fonts.load(f); }))
    .then(function(){ for (var i = 0; i < 6; i++) W.push($('l' + i).offsetWidth); anchors(); seek(+(new URLSearchParams(location.search).get('t') || 0)); document.documentElement.dataset.ready = 1; });
})();
/*script:end*/

/*stage:begin*/
<div style="position:absolute;inset:0;background:#9a5944"></div>
<div style="position:absolute;inset:0;background:repeating-linear-gradient(180deg,transparent 0 34px,rgba(225,210,190,.55) 34px 38px)"></div>
<div style="position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent 0 76px,rgba(225,210,190,.5) 76px 80px);-webkit-mask-image:repeating-linear-gradient(180deg,#000 0 38px,transparent 38px 76px)"></div>
<div style="position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent 0 36px,rgba(225,210,190,.5) 36px 40px,transparent 40px 80px);-webkit-mask-image:repeating-linear-gradient(180deg,transparent 0 38px,#000 38px 76px)"></div>
<div style="position:absolute;inset:0;background:radial-gradient(120% 80% at 30% 20%,rgba(255,255,255,.06),rgba(0,0,0,.25))"></div>
<div class="lit" style="background:linear-gradient(115deg,rgba(255,214,150,.55) 0%,rgba(255,214,150,.15) 45%,transparent 70%)"></div>
/*stage:end*/
