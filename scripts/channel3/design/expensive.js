/*css:begin*/
.lbl{position:absolute;top:0;left:0;width:200px;height:300px;border-radius:18px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.55)}
.lbl .t{position:absolute;left:0;right:0;text-align:center;white-space:nowrap;line-height:1}
.lbl .ci{position:absolute;left:50%;border-radius:50%}
.lbl .ru{position:absolute;left:50%;height:2px;background:#c9a46a}
#cardB{background:#1b1d26}
.vote{position:absolute;width:62px;height:62px;border-radius:50%;display:grid;place-items:center;font:900 26px var(--d);color:#fff;background:#141827;border:2px solid rgba(255,255,255,.25);opacity:0;z-index:22}
.vote.on{border-color:#5ee0a0;color:#5ee0a0}
.pal{position:absolute;width:40px;height:40px;border-radius:12px;box-shadow:0 6px 16px rgba(0,0,0,.4);opacity:0;z-index:22}
#tr{left:0;top:0;opacity:0;z-index:23}
/*css:end*/
/*board:begin*/
<div class="lbl board" id="cardA"><div class="t" id="aT1">EMBER</div><div class="t" id="aT2">LANE</div><div class="ci" id="aC"></div><div class="ru" id="aR"></div><div class="t" id="aT3">vanilla!!</div></div>
<div class="lbl board" id="cardB"><div class="t" style="top:122px;font:700 19px 'Space Grotesk';letter-spacing:.32em;color:#e9dcc3;padding-left:.32em">EMBER</div><div class="t" style="top:150px;font:700 19px 'Space Grotesk';letter-spacing:.32em;color:#e9dcc3;padding-left:.32em">LANE</div><div class="ru" style="top:186px;width:56px;margin-left:-28px"></div><div class="t" style="top:202px;font:500 11px 'Space Grotesk';letter-spacing:.24em;color:#9a9080;padding-left:.24em">VANILLA · 200 G</div></div>
<div class="vote" id="vA">A</div><div class="vote" id="vB">B</div>
<div class="pal" id="p0" style="background:#f2c94c"></div><div class="pal" id="p1" style="background:#c0392b"></div><div class="pal" id="p2" style="background:#2e86c1"></div><div class="pal" id="p3" style="background:#e67e22"></div><div class="pal" id="p4" style="background:#6c3483"></div>
<svg id="tr" class="a" width="540" height="960" viewBox="0 0 540 960"></svg>
/*board:end*/
/*script:begin*/
(function(){
  var $ = DT.$, P = KM.P, mix = KM.mix, E = KM.ease, cl = KM.cl; KM.theme('dark', 'turnsout'); DT.ctx(); DT.tint('#d9b46a', '#a8783a');
  var TEXT = "One of these looks five times pricier. Which one would you pay more for? It's B. Turns out, three things make it look expensive. Empty space. Small, spaced-out letters. And only two colours. Quiet costs more.";
  var DUR = 18, V, PH, A = {}, CAM, CUR = [];
  var AX = 50, BXp = 290, Y = 452, CX = 170;   // the two labels side by side, then A moves to the centre and becomes the premium one
  function hexMix(a, b, k){ var p = function(h){ return [1, 3, 5].map(function(i){ return parseInt(h.slice(i, i + 2), 16); }); }, x = p(a), y = p(b);
    return 'rgb(' + x.map(function(v, i){ return Math.round(mix(v, y[i], cl(k))); }).join(',') + ')'; }
  function at(w, n){ return V.at(w, n); }
  function anchors(words){
    V = KM.voice(TEXT, .12, words); PH = V.phrases(4); KM.reset(DUR); A.hook = at('Which');
    A.which = at('Which'); A.b = at('B'); A.three = at('three'); A.space = at('Empty'); A.small = at('Small'); A.two = at('only'); A.quiet = at('Quiet'); A.end = Math.min(DUR - .2, V.end + .8);
    window.COVER = .6;
    CAM = KM.rig({ x: 255, y: 480, z: 1.14, drift: .5 }).pull(0, .55, 255, 480, 1).pushIn(A.space - .1, 1, 255, 500, 1.03).pull(A.quiet - .2, .9, 255, 480, 1);
    var S = DT.S; S.sting(0); S.whoosh(0, 120, .4); S.land(.1, 120, 0); S.whoosh(.25, 420, .4); S.land(.35, 420, 2);
    S.land(A.which + .1, 120, 2); S.land(A.which + .25, 420, 4);
    CUR = [[A.which + .3, 300, 700, 0], [A.b - .15, 392, 760, 0], [A.b + .05, 392, 760, 1], [A.b + .35, 392, 760, 0], [A.three + .2, 470, 720, 0]];
    S.click(A.b + .05, 392); S.done(A.b + .12, 392, 4);
    S.drag(A.three, .7, 120, 270); S.whoosh(A.three + .05, 420, .3);
    // lever 1: the margins roll open; lever 2: the letters flip and the tracking opens; lever 3: three colours drop away, two stay
    S.rise(A.space - .3, .3); S.roll(A.space + .1, .6, 270, 8); A.d1 = A.space + .75; S.done(A.d1, 270, 0);
    S.rise(A.small - .3, .3); S.swap(A.small + .1, .5, 270, 8); S.roll(A.small + .1, .8, 270, 8); A.d2 = A.small + .95; S.done(A.d2, 270, 2);
    S.rise(A.two - .3, .3); for (var i = 0; i < 5; i++) S.land(A.two + i * .05, 150 + i * 50, i); [1, 2, 3].forEach(function(n){ S.whoosh(A.two + .5 + n * .08, 150 + n * 50, .2); }); S.tint(A.two + .3, 270); A.d3 = A.two + 1.05; S.done(A.d3, 270, 4);
    S.reveal(A.quiet);
    window.ALIGN = [{ at: A.end - .05, sel: 'span', each: '#aT1, #aT2', edge: 'bottom', why: 'every letter on its line' }];
    window.HOLDS = [[A.end, DUR]]; KM.publish(DT.score(A.quiet, A.space));
  }
  function paintA(t){ var mv = E.inOut3(P(t, A.three, A.three + .7)), ks = DT.spring(t, A.space + .1, .7), kl = DT.spring(t, A.small + .1, .8), kc = E.inOut3(P(t, A.two + .2, A.two + .8));
    var c = $('cardA'), x = mix(AX, CX, mv), sc = mix(1, 1.2, mv), ia = 1, br = Math.max(Math.sin(Math.PI * P(t, A.d1, A.d1 + .35)), Math.sin(Math.PI * P(t, A.d2, A.d2 + .35)), Math.sin(Math.PI * P(t, A.d3, A.d3 + .35)));
    c.style.transform = 'translate(' + x.toFixed(1) + 'px,' + (Y + (1 - ia) * 70).toFixed(1) + 'px) perspective(1000px) rotateY(' + ((1 - ia) * 25).toFixed(1) + 'deg) scale(' + (sc * (1 + .02 * br)).toFixed(4) + ')';
    c.style.background = hexMix('#f2c94c', '#1b1d26', kc);
    // lever 1, empty space: everything draws in towards the middle (the content block shrinks, the margins grow)
    var z = mix(1, .74, ks), cy = 150;
    var T1 = $('aT1'), T2 = $('aT2'), T3 = $('aT3'), C = $('aC'), R = $('aR');
    // lever 2, small spaced letters: the loud display face becomes a small spaced sans as the tracking opens
    var big = kl < .5, ls = mix(0, .32, kl), kc0 = P(t, A.two + .2, A.two + .8);
    T1.style.font = T2.style.font = big ? "400 46px/1 'Anton'" : "700 22px/1 'Space Grotesk'"; T1.style.paddingLeft = T2.style.paddingLeft = ls.toFixed(3) + 'em';
    var ca = function(col){ return hexMix(col, '#e9dcc3', kc0); };
    DT.flipChars(T1, t, A.small + .1, .5, { f: "400 46px/1 'Anton'", c: ca('#c0392b') }, { f: "700 22px/1 'Space Grotesk'", c: ca('#c0392b'), ls: ls.toFixed(3) + 'em' });
    DT.flipChars(T2, t, A.small + .15, .5, { f: "400 46px/1 'Anton'", c: ca('#2e86c1') }, { f: "700 22px/1 'Space Grotesk'", c: ca('#2e86c1'), ls: ls.toFixed(3) + 'em' });
    T3.style.font = big ? "400 18px/1.3 'Pacifico'" : "500 11px/1 'Space Grotesk'"; T3.style.letterSpacing = (kl * .24).toFixed(3) + 'em'; T3.textContent = big ? 'vanilla!!' : 'VANILLA · 200 G';
    var fl = Math.sin(Math.PI * cl(kl)); T3.style.filter = 'blur(' + (fl * 3).toFixed(2) + 'px)';
    var y1 = mix(big ? 44 : 112, 112, 0), place = function(e, y){ e.style.top = (cy + (y - cy) * z).toFixed(1) + 'px'; e.style.transform = 'scale(' + z.toFixed(3) + ')'; };
    place(T1, big ? 36 : 108); place(T2, big ? 96 : 140); place(T3, big ? 230 : 206);
    // lever 3, two colours: the five colours drop away; the loud ones fade to cream and a gold rule
    T3.style.color = hexMix('#6c3483', '#9a9080', kc);
    var cs = mix(56, 0, kl), cz = cs * z; C.style.width = C.style.height = cz.toFixed(1) + 'px'; C.style.marginLeft = (-cz / 2).toFixed(1) + 'px'; C.style.top = (cy + ((big ? 182 : 170) - cy) * z - cz / 2).toFixed(1) + 'px'; C.style.background = hexMix('#e67e22', '#c9a46a', kc); C.style.opacity = (1 - P(kl, 0, .35)).toFixed(3);
    var rw = mix(0, 56, kl) * z; R.style.width = rw.toFixed(1) + 'px'; R.style.marginLeft = (-rw / 2).toFixed(1) + 'px'; R.style.top = (cy + (186 - cy) * z).toFixed(1) + 'px'; R.style.opacity = kl.toFixed(3);
    return { x: x, mv: mv, ks: ks, kl: kl, kc: kc }; }
  function seek(t){
    t = Math.max(0, Math.min(DUR, t)); var c = CAM.apply($('world'), t, null); KM.lights(t, c);
    DT.mood(t, (.34 * E.out3(P(t, A.d1 - .2, A.d1 + .5)) + .33 * E.out3(P(t, A.d2 - .2, A.d2 + .5)) + .33 * E.out3(P(t, A.d3 - .2, A.d3 + .5)))); DT.sweep(t, [A.d1, A.d2, A.d3, A.quiet]); DT.hook(t, '<i>One</i> <i>looks</i> <em><i>5×</i> <i>pricier.</i></em>', A.hook);
    var S = paintA(t);
    // B: the answer to the vote; it lifts when picked, then steps aside as A becomes it
    var b = $('cardB'), pick = DT.spring(t, A.b + .05, .6), away = E.inOut3(P(t, A.three, A.three + .6)), ib = 1;
    b.style.transform = 'translate(' + mix(BXp, 420, away).toFixed(1) + 'px,' + (Y - 14 * pick + (1 - ib) * 70).toFixed(1) + 'px) perspective(1000px) rotateY(' + ((1 - ib) * -25).toFixed(1) + 'deg)'; b.style.opacity = ((1 - P(t, A.three, A.three + .25)) * 1).toFixed(3); b.style.boxShadow = '0 24px 60px rgba(0,0,0,.55),0 0 0 ' + (3 * pick).toFixed(1) + 'px #5ee0a0';
    $('cardA').style.opacity = ((1 - .45 * pick * (1 - away)) * 1).toFixed(3);
    // the vote buttons under each label
    [['vA', AX + 69], ['vB', BXp + 69]].forEach(function(v, i){ var e = $(v[0]), k = E.back(P(t, A.which + .1 + i * .15, A.which + .5 + i * .15), 2), o = k * (1 - P(t, A.three - .2, A.three + .1));
      e.style.left = v[1] + 'px'; e.style.top = (Y + 270) + 'px'; e.style.opacity = cl(o).toFixed(3); e.style.transform = 'scale(' + (.6 + .4 * k) + ')'; e.className = 'vote' + (i === 1 && t >= A.b + .05 ? ' on' : ''); });
    DT.chip('pick', 'B <b>WINS</b>', 330, 414, P(t, A.b + .15, A.b + .45) - P(t, A.three - .2, A.three + .1), 'g');
    // lever 1: margin brackets roll from 8% to 30%
    var cx = S.x, mk = P(t, A.space + .05, A.space + .35) * (1 - P(t, A.small - .1, A.small + .2)), m = DT.roll(8, 30, P(t, A.space + .1, A.space + .7));
    var sc2 = 1.2, L0 = 270 - 100 * sc2, R0 = 270 + 100 * sc2, mm = mix(18, 64, S.ks); DT.hmeasure('ml', L0 + 4, L0 + 4 + mm, Y + 150, mk, m + '%'); DT.hmeasure('mr', R0 - 4 - mm, R0 - 4, Y + 150, mk, m + '%');
    DT.chip('l1', 'EMPTY <b>SPACE</b>', 300, 414, P(t, A.space, A.space + .3) - P(t, A.small - .1, A.small + .2));
    // lever 2: a tracking ruler opens under the name
    var tk = P(t, A.small + .05, A.small + .35) * (1 - P(t, A.two - .1, A.two + .2)), tw = mix(70, 190, S.kl), ry = 602 + (108 - 150) * .74 * 1.2 - 18;
    for (var i = 0; i < 6; i++) { var x = 270 - tw / 2 + tw * i / 5; DT.line('tk' + i, x, ry, x, ry + 12, tk, '#ffb35a', 2); }
    DT.line('tkb', 270 - tw / 2, ry + 12, 270 + tw / 2, ry + 12, tk, '#ffb35a', 2);
    DT.chip('l2', 'TRACKING <b>+' + DT.roll(0, 320, P(t, A.small + .1, A.small + .9)) + '</b>', 300, 414, P(t, A.small, A.small + .3) - P(t, A.two - .1, A.two + .2));
    // lever 3: the palette: five swatches line up under the label, three drop away, two stay
    for (i = 0; i < 5; i++) { var e = $('p' + i), k = E.back(P(t, A.two + i * .05, A.two + .35 + i * .05), 2), keep = i === 0 || i === 4, drop = keep ? 0 : E.inOut3(P(t, A.two + .5 + i * .08, A.two + .9 + i * .08));
      e.style.left = (150 + i * 50).toFixed(1) + 'px'; e.style.top = (Y + 338 + drop * 120).toFixed(1) + 'px'; e.style.opacity = (k * (1 - drop) * (1 - P(t, A.quiet + .4, A.quiet + .8))).toFixed(3);
      e.style.background = keep ? (i === 0 ? '#1b1d26' : '#c9a46a') : e.style.background; e.style.transform = 'scale(' + (.6 + .4 * k).toFixed(3) + ') rotate(' + (drop * (i - 2) * 30).toFixed(1) + 'deg)'; e.style.border = keep ? '2px solid rgba(255,255,255,.3)' : 'none'; }
    DT.chip('l3', 'COLOURS <b>' + DT.roll(5, 2, P(t, A.two + .2, A.two + .8)) + '</b>', 300, 414, P(t, A.two, A.two + .3) - P(t, A.quiet - .1, A.quiet + .2));
    DT.chip('end', 'QUIET <b>COSTS MORE</b>', 170, 414, P(t, A.quiet, A.quiet + .3), 'g');
    [[A.d1, 270, 600], [A.d2, 270, 560], [A.d3, 270, 790]].forEach(function(d, i){ DT.burst('b' + i, d[1], d[2], t, d[0], '#ffb35a'); }); DT.burst('bw', 392, 790, t, A.b + .12, '#5ee0a0');
    DT.cursor(t, CUR);
    DT.dial(t, [{ t: 0, sym: '?', label: 'A OR B' }, { t: A.space, n: 1, word: 'LEVER' }, { t: A.small, n: 2, word: 'LEVER' }, { t: A.two, n: 3, word: 'LEVER' }, { t: A.quiet, end: 1, sym: '✓', label: 'QUIET' }]);
    DT.title(t, [{ t: A.hook, html: 'Same words. Which costs <em>more</em>?' }, { t: A.three, html: 'Why <em>B</em> looks expensive' }, { t: A.space, html: 'Lever 1 · <em>empty space</em>' }, { t: A.small, html: 'Lever 2 · <em>spaced letters</em>' }, { t: A.two, html: 'Lever 3 · <em>two colours</em>' }, { t: A.quiet, html: 'Quiet <em>costs more.</em>' }]);
    KM.subs($('cap'), t, V, PH, Math.max(0, V.words.findIndex(function(w){ return w.s - V.lead >= A.hook - .25; })), A.end, function(w){ return /^(B|expensive|empty|space|spaced|letters|two|colours|quiet|more)/i.test(w) ? 'var(--amb)' : null; });
  }
  window.setVoice = function(v){ if (v && v.words && v.words.length) anchors(v.words); };
  window.seek = seek; window.DURATION = DUR;
  Promise.all(["400 46px 'Anton'", "400 18px 'Pacifico'", "700 22px 'Space Grotesk'", "500 11px 'Space Grotesk'", "900 31px 'Unbounded'"].map(function(f){ return document.fonts.load(f); }))
    .then(function(){ anchors(); seek(+(new URLSearchParams(location.search).get('t') || 0)); document.documentElement.dataset.ready = 1; });
})();
/*script:end*/

/*stage:begin*/
<div style="position:absolute;inset:0;background:linear-gradient(180deg,#e9e2d6 0%,#ddd3c3 70%,#cfc3b0 100%)"></div>
<div style="position:absolute;left:0;right:0;top:800px;height:26px;background:linear-gradient(180deg,#b88a5a,#8f643c);box-shadow:0 14px 26px rgba(0,0,0,.35),inset 0 2px 0 rgba(255,235,205,.5)"></div>
<div style="position:absolute;left:0;right:0;top:826px;bottom:0;background:linear-gradient(180deg,#c6b8a2,#b3a48c)"></div>
<div class="lit" style="background:radial-gradient(22% 38% at 30% 52%,rgba(255,236,200,.75),transparent 70%),radial-gradient(22% 38% at 72% 52%,rgba(255,236,200,.75),transparent 70%)"></div>
<div class="lit" style="background:linear-gradient(180deg,rgba(255,220,170,.12),transparent)"></div>
/*stage:end*/
