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
<div class="lbl" id="cardA"><div class="t" id="aT1">EMBER</div><div class="t" id="aT2">LANE</div><div class="ci" id="aC"></div><div class="ru" id="aR"></div><div class="t" id="aT3">vanilla!!</div></div>
<div class="lbl" id="cardB"><div class="t" style="top:122px;font:700 19px 'Space Grotesk';letter-spacing:.32em;color:#e9dcc3;padding-left:.32em">EMBER</div><div class="t" style="top:150px;font:700 19px 'Space Grotesk';letter-spacing:.32em;color:#e9dcc3;padding-left:.32em">LANE</div><div class="ru" style="top:186px;width:56px;margin-left:-28px"></div><div class="t" style="top:202px;font:500 11px 'Space Grotesk';letter-spacing:.24em;color:#9a9080;padding-left:.24em">VANILLA · 200 G</div></div>
<div class="vote" id="vA">A</div><div class="vote" id="vB">B</div>
<div class="pal" id="p0" style="background:#f2c94c"></div><div class="pal" id="p1" style="background:#c0392b"></div><div class="pal" id="p2" style="background:#2e86c1"></div><div class="pal" id="p3" style="background:#e67e22"></div><div class="pal" id="p4" style="background:#6c3483"></div>
<svg id="tr" class="a" width="540" height="960" viewBox="0 0 540 960"></svg>
/*board:end*/
/*script:begin*/
(function(){
  var $ = DT.$, P = KM.P, mix = KM.mix, E = KM.ease, cl = KM.cl; KM.theme('dark', 'turnsout');
  var TEXT = "Same words. Which one would you pay more for? It's B. Turns out, three things make it look expensive. Empty space. Small, spaced-out letters. And only two colours. Quiet costs more.";
  var DUR = 17, V, PH, A = {}, CAM, CUR = [];
  var AX = 50, BXp = 290, Y = 452, CX = 170;   // the two labels side by side, then A moves to the centre and becomes the premium one
  function hexMix(a, b, k){ var p = function(h){ return [1, 3, 5].map(function(i){ return parseInt(h.slice(i, i + 2), 16); }); }, x = p(a), y = p(b);
    return 'rgb(' + x.map(function(v, i){ return Math.round(mix(v, y[i], cl(k))); }).join(',') + ')'; }
  function at(w, n){ return V.at(w, n); }
  function anchors(words){
    V = KM.voice(TEXT, .12, words); PH = V.phrases(4); KM.reset(DUR);
    A.which = at('Which'); A.b = at('B'); A.three = at('three'); A.space = at('Empty'); A.small = at('Small'); A.two = at('only'); A.quiet = at('Quiet'); A.end = Math.min(DUR - .2, V.end + .8);
    window.COVER = .6;
    CAM = KM.rig({ x: 255, y: 480, z: 1, drift: .5 }).pushIn(A.space - .1, 1, 255, 500, 1.03).pull(A.quiet - .2, .9, 255, 480, 1);
    KM.cue({ t: 0, k: 'whoosh', d: .5, g: .3 });
    DT.snd(A.which + .1, 'blip', 120, .16, 2); DT.snd(A.which + .25, 'blip', 420, .16, 5);
    CUR = [[A.which + .3, 300, 700, 0], [A.b - .15, 392, 792, 0], [A.b + .05, 392, 792, 1], [A.b + .35, 392, 792, 0], [A.three + .2, 470, 720, 0]];
    DT.snd(A.b + .05, 'touch', 392); DT.snd(A.b + .12, 'pop', 392, .2, 6);
    KM.cue({ t: A.three, k: 'move', d: .7, g: .14, x: 120, x2: 270 });
    for (var i = 0; i < 6; i++) DT.snd(A.space + .1 + i * .06, 'tick', 270, .07, i); DT.snd(A.space + .5, 'snap', 270, .18, 2);
    for (i = 0; i < 6; i++) DT.snd(A.small + .1 + i * .07, 'tick', 270, .07, 6 - i); DT.snd(A.small + .6, 'snap', 270, .18, 4);
    [0, 1, 2].forEach(function(j){ DT.snd(A.two + .15 + j * .14, 'swish', 330 + j * 40, .14); }); DT.snd(A.two + .7, 'snap', 270, .2, 5);
    KM.cue({ t: A.quiet, k: 'resolve', g: .3, notes: [55, 62, 67, 71] });
    window.HOLDS = [[A.end, DUR]]; KM.publish();
  }
  function paintA(t){ var mv = E.inOut3(P(t, A.three, A.three + .7)), ks = DT.spring(t, A.space + .1, .7), kl = DT.spring(t, A.small + .1, .8), kc = E.inOut3(P(t, A.two + .2, A.two + .8));
    var c = $('cardA'), x = mix(AX, CX, mv), sc = mix(1, 1.2, mv); c.style.transform = 'translate(' + x.toFixed(1) + 'px,' + Y + 'px) scale(' + sc + ')';
    c.style.background = hexMix('#f2c94c', '#1b1d26', kc);
    // lever 1, empty space: everything draws in towards the middle (the content block shrinks, the margins grow)
    var z = mix(1, .74, ks), cy = 150;
    var T1 = $('aT1'), T2 = $('aT2'), T3 = $('aT3'), C = $('aC'), R = $('aR');
    // lever 2, small spaced letters: the loud display face becomes a small spaced sans as the tracking opens
    var big = kl < .5, ls = mix(0, .32, kl);
    T1.style.font = big ? "400 46px/1 'Anton'" : "700 22px/1 'Space Grotesk'"; T2.style.font = T1.style.font; T1.style.letterSpacing = T2.style.letterSpacing = ls.toFixed(3) + 'em'; T1.style.paddingLeft = T2.style.paddingLeft = ls.toFixed(3) + 'em';
    T3.style.font = big ? "400 18px/1.3 'Pacifico'" : "500 11px/1 'Space Grotesk'"; T3.style.letterSpacing = (kl * .24).toFixed(3) + 'em'; T3.textContent = big ? 'vanilla!!' : 'VANILLA · 200 G';
    var fl = Math.sin(Math.PI * cl(kl)); [T1, T2, T3].forEach(function(e){ e.style.filter = 'blur(' + (fl * 3).toFixed(2) + 'px)'; });
    var y1 = mix(big ? 44 : 112, 112, 0), place = function(e, y){ e.style.top = (cy + (y - cy) * z).toFixed(1) + 'px'; e.style.transform = 'scale(' + z.toFixed(3) + ')'; };
    place(T1, big ? 36 : 108); place(T2, big ? 96 : 140); place(T3, big ? 230 : 206);
    // lever 3, two colours: the five colours drop away; the loud ones fade to cream and a gold rule
    T1.style.color = hexMix('#c0392b', '#e9dcc3', kc); T2.style.color = hexMix('#2e86c1', '#e9dcc3', kc); T3.style.color = hexMix('#6c3483', '#9a9080', kc);
    var cs = mix(56, 0, kl), cz = cs * z; C.style.width = C.style.height = cz.toFixed(1) + 'px'; C.style.marginLeft = (-cz / 2).toFixed(1) + 'px'; C.style.top = (cy + ((big ? 182 : 170) - cy) * z - cz / 2).toFixed(1) + 'px'; C.style.background = hexMix('#e67e22', '#c9a46a', kc); C.style.opacity = (1 - P(kl, 0, .35)).toFixed(3);
    var rw = mix(0, 56, kl) * z; R.style.width = rw.toFixed(1) + 'px'; R.style.marginLeft = (-rw / 2).toFixed(1) + 'px'; R.style.top = (cy + (186 - cy) * z).toFixed(1) + 'px'; R.style.opacity = kl.toFixed(3);
    return { x: x, mv: mv, ks: ks, kl: kl, kc: kc }; }
  function seek(t){
    t = Math.max(0, Math.min(DUR, t)); var c = CAM.apply($('world'), t, null); KM.lights(t, c);
    var S = paintA(t);
    // B: the answer to the vote; it lifts when picked, then steps aside as A becomes it
    var b = $('cardB'), pick = DT.spring(t, A.b + .05, .6), away = E.inOut3(P(t, A.three, A.three + .6));
    b.style.transform = 'translate(' + mix(BXp, 420, away).toFixed(1) + 'px,' + (Y - 14 * pick).toFixed(1) + 'px)'; b.style.opacity = (1 - P(t, A.three, A.three + .25)).toFixed(3); b.style.boxShadow = '0 24px 60px rgba(0,0,0,.55),0 0 0 ' + (3 * pick).toFixed(1) + 'px #5ee0a0';
    $('cardA').style.opacity = (1 - .45 * pick * (1 - away)).toFixed(3);
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
    DT.cursor(t, CUR);
    DT.dial(t, [{ t: 0, sym: '?', label: 'A OR B' }, { t: A.space, n: 1, word: 'LEVER' }, { t: A.small, n: 2, word: 'LEVER' }, { t: A.two, n: 3, word: 'LEVER' }, { t: A.quiet, end: 1, sym: '✓', label: 'QUIET' }]);
    DT.title(t, [{ t: 0, html: 'Same words. Which costs <em>more</em>?' }, { t: A.three, html: 'Why <em>B</em> looks expensive' }, { t: A.space, html: 'Lever 1 · <em>empty space</em>' }, { t: A.small, html: 'Lever 2 · <em>spaced letters</em>' }, { t: A.two, html: 'Lever 3 · <em>two colours</em>' }, { t: A.quiet, html: 'Quiet <em>costs more.</em>' }]);
    KM.subs($('cap'), t, V, PH, 0, A.end, function(w){ return /^(B|expensive|empty|space|spaced|letters|two|colours|quiet|more)/i.test(w) ? 'var(--amb)' : null; });
  }
  window.setVoice = function(v){ if (v && v.words && v.words.length) anchors(v.words); };
  window.seek = seek; window.DURATION = DUR;
  Promise.all(["400 46px 'Anton'", "400 18px 'Pacifico'", "700 22px 'Space Grotesk'", "500 11px 'Space Grotesk'", "900 31px 'Unbounded'"].map(function(f){ return document.fonts.load(f); }))
    .then(function(){ anchors(); seek(+(new URLSearchParams(location.search).get('t') || 0)); document.documentElement.dataset.ready = 1; });
})();
/*script:end*/
