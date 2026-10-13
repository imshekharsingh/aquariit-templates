// Tintwell · "The Hue Dial": the whole film is one turn of a colour dial. One hue drives every swatch on the page, so each beat of the music
// ticks the dial, the page recolours with it, and the last turn lands back on tangerine: the last frame is the first frame (a loop).
// Variant A opens on a typographic slam on flat colour, variant B opens on a macro of the swatch and pulls back. Both are identical from t = join.
(function () {
  const E = window.FilmEngine, T = window.FILM_T, { clamp, lerp, ease, W, H } = E;
  const S = (E.story = {});
  const $ = E.$, $$ = E.$$;
  const HERO_CY = (r) => r.h1.y + (H / 2 - 118);          // camera centre that puts the headline top at screen y = 118 (below the Reels top bar)

  S.setup = function (variant) {
    E.variant = variant;
    E.el('style', null, document.head, `
      .bar,.back,.chip,footer,#sentinel{display:none!important}
      :root{--h:38;--tang:oklch(.7 .21 var(--h));--pair:oklch(.82 .15 calc(var(--h) + 180));--rose:oklch(.68 .22 calc(var(--h) - 43))}
      .js .rv{opacity:1;transform:none;transition:none}
      main>section:not(:first-child){margin-top:520px!important}
      section[aria-labelledby=h-steps],section[aria-labelledby=h-proof] .hd,section[aria-labelledby=h-pk] .hd{display:none}
      .hero{overflow:visible}
      .sw:nth-child(3){z-index:5}
      .stat:nth-child(2) b{color:var(--pair)} .stat:nth-child(3) b{color:oklch(.78 .12 calc(var(--h) + 240))}
      .pk.hot{border-color:color-mix(in oklch,var(--tang) 75%,transparent)}
      .cta{box-shadow:0 0 0 4px color-mix(in oklch,var(--tang) 28%,transparent)}
      .endc{background:linear-gradient(160deg,var(--tang),var(--rose))}
      .lab{animation:none!important}
      .lab .big{background:oklch(.7 .21 var(--h))}
      .fl{background:var(--tang)}
      .stat b .cnt{font:inherit;color:inherit}
      .in .cnt{animation:none!important}
    `);
    // the five fan swatches ride the dial too (original hues at 38°: violet 285, mint 178, tangerine 38, sun 95, rose 355)
    [[.55, .25, 247], [.82, .15, 140], [.7, .21, 0], [.87, .17, 57], [.68, .24, 317]].forEach((s, i) => $$('.sw')[i].style.setProperty('--c', `oklch(${s[0]} ${s[1]} calc(var(--h) + ${s[2]}))`));

    // the template's own load animations: take them over so they run on film time
    E.hero = { up: [], fan: [], fade: [] };
    document.getAnimations().forEach((a) => { const n = a.animationName; if (n === 'up') E.hero.up.push(a); else if (n === 'fan') E.hero.fan.push(a); else if (n === 'fade') E.hero.fade.push(a); else if (n === 'sweep' || n === 'count') a.cancel(); a.pause && a.pause(); });
    E.hero.up.forEach((a) => { a.line = [...a.effect.target.parentElement.parentElement.children].indexOf(a.effect.target.parentElement); });

    // world geometry (the page at camera identity, all load animations at their end state)
    const all = [...E.hero.up, ...E.hero.fan, ...E.hero.fade]; all.forEach((a) => { a.currentTime = 10000; });
    const R = (E.world = E.measure(() => {
      const fan = E.rect('.fan'), stats = $$('.stat').map((e) => E.rect(e)), pk = $$('.pk').map((e) => E.rect(e));
      return {
        h1: E.rect('h1'), fan, lead: E.rect('.lead'), cta: E.rect('.hero .cta'),
        sw: { x: fan.cx, y: fan.y + 6 + 88 },
        stats, statsCy: (stats[0].y + stats[2].b) / 2, pk, pkCy: (pk[0].y + pk[1].b) / 2,
        price: (() => { const n = $('.pk.hot .pr').firstChild, rg = document.createRange(); rg.selectNodeContents(n); const r = rg.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, cx: r.left + r.width / 2, cy: r.top + r.height / 2 }; })(), lab: E.rect('.lab'), big: E.rect('.lab .big'), hd: E.rect('#h-lab'),
        end: E.rect('.endc'), endCta: E.rect('.endc .cta'), endH2: E.rect('#h-end'),
      };
    }));
    const hcy = HERO_CY(R);
    R.labTop = R.hd.y - 28;                                // eyebrow sits above the h2
    R.labCy = (R.labTop + R.lab.b) / 2;

    // ---- camera ----
    const J = T.join, hookCut = T.hookCut, K = [];
    const k = (t, x, y, z, o = {}) => K.push(Object.assign({ t, x, y, z }, o));
    if (variant === 'A') {
      k(0, 201, hcy, 1.0);                                // flat colour field covers the page until the hook lands on the beat
      k(hookCut, 201, hcy, 1.0);                          // HARD CUT to the dark page, same camera: the type does not move, the world changes behind it
      k(J, 201, hcy, 1.04, { e: 'io3' });
    } else {
      k(0, R.sw.x - 18, R.sw.y + 32, 6.5, { ry: -4, rx: 2, rz: -3 });  // macro on the swatch: nothing but tangerine and the word "38°"
      k(2.5, 201, hcy, 1.0, { e: 'out3', ry: 0, rx: 0, rz: 0 });
      k(J, 201, hcy, 1.04, { e: 'io3' });
    }
    k(T.matchCut, R.sw.x - 18, R.sw.y + 32, 6.5, { e: 'in2', rz: -4 });                         // push into the swatch, accelerating
    k(T.matchCut, R.big.x + 62, R.big.y + 72, 5.2, { rz: 0 });                                  // MATCH CUT on colour: tangerine -> tangerine, "38°" -> "38°"
    const dy = (z) => 28 / z;                                  // keep key content above the Reels bottom UI: centre a little high
    k(6.0, 201, R.labCy + dy(.9), 0.9, { e: 'outX' });                                           // pull back: the dial and its derived swatches come into frame
    k(T.whip1[0], 201, R.labCy + dy(.95), .95, { e: 'io3', ry: -6, rx: 3 });
    k(T.whip1[1], 201, R.statsCy + dy(.9), 0.9, { e: 'io3', ry: 0, rx: 0 });                    // whip up to the proof cards
    k(T.cut2, 201, R.statsCy + dy(.96), .96, { e: 'lin' });
    k(T.cut2, 201, R.pkCy + dy(.9), 0.9);                                                        // hard cut on the downbeat to the packages
    k(T.push[0], 201, R.pkCy + dy(.94), .94, { e: 'lin' });
    k(T.push[1], R.price.cx, R.price.cy, 2.1, { e: 'io3', rx: 4, ry: -6 });                      // push in on the price: the held breath
    k(T.impact, R.price.cx, R.price.cy, 2.3, { e: 'lin', rz: -1.5 });
    k(T.impact, 201, R.labCy + dy(1.05), 1.05, { ry: -9, rx: 4, rz: 1.5 });                      // IMPACT: cut back to the dial, spinning
    k(T.whip2[0], 201, R.labCy + dy(.9), 0.9, { e: 'outX', ry: 0, rx: 0, rz: 0 });
    k(T.whip2[1], 201, R.end.cy, 1.0, { e: 'io3' });                                             // whip to the answer card
    k(T.iris[0], 201, R.end.cy, 1.05, { e: 'lin' });
    E.keys = K;
    E.irisAt = { x: 201 + (R.endCta.cx - 201) * 1.05, y: H / 2 + (R.endCta.cy - R.end.cy) * 1.05 };

    // ---- hook card (variant A): the hero headline cloned onto flat colour, words slam in on the beats ----
    if (variant === 'A') {
      const card = $('h1').cloneNode(true); card.removeAttribute('id');
      card.querySelectorAll('.ln>span').forEach((s) => { s.style.animation = 'none'; });
      card.querySelectorAll('.ln')[2].remove();
      card.style.cssText = `position:absolute;left:${W / 2 + (R.h1.x - 201)}px;top:${H / 2 + (R.h1.y - hcy)}px;width:${R.h1.w}px;margin:0;color:#1a0933`;
      card.querySelector('.t').style.color = '#fff3e8';
      E.cards.appendChild(card); E.hookCard = card;
      const w = E.splitWords(card);                         // Is · your · colour · costing
      [0, .05, .5, 1.0].forEach((at, i) => E.reveal(w[i], at - .12, null, .55));
    }
    // ---- type that lives in the page: the lab heading and the answer, word by word on the beats ----
    const lw = E.splitWords($('#h-lab'));                   // Watch one hue / become a system.
    [5.5, 5.56, 5.62, 6.0, 6.05, 6.1].forEach((at, i) => E.reveal(lw[i], at, null, .55));
    const ew = E.splitWords($('#h-end'));                   // Yes. A weak hue / can cost sales.
    [T.yes, T.yes + .25, T.yes + .3, T.yes + .35, T.weak, T.weak + .05, T.weak + .1].forEach((at, i) => E.reveal(ew[i], at, null, .6));
    E.tween($('#h-lab').previousElementSibling, [{ opacity: 0 }, { opacity: 1 }], 5.0, .4, 'ease-out');
    E.tween($('.endc .eyebrow'), [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], T.yes + .1, .5);
    E.tween($('.endc p'), [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], T.cta - .05, .7);
    E.tween($('.endc .cta'), [{ opacity: 0, transform: 'translateY(18px) scale(.92)' }, { opacity: 1, transform: 'none' }], T.cta + .1, .7);
    // grid-snap assembly of the proof cards, each on its beat
    $$('.stat').forEach((s, i) => E.tween(s, [{ opacity: 0, transform: `translate(${[-150, 150, -150][i]}px,${[20, 40, 60][i]}px) scale(.88)` }, { opacity: 1, transform: 'none' }], T.stat[i] - .08, .75));
    // package cards slide in from opposite sides; the MOST PICKED flag pops
    E.tween($$('.pk')[0], [{ opacity: 0, transform: 'translateX(-130%)' }, { opacity: 1, transform: 'none' }], T.pkSpark - .05, .8);
    E.tween($$('.pk')[1], [{ opacity: 0, transform: 'translateX(130%)' }, { opacity: 1, transform: 'none' }], T.pkHot - .05, .8);
    E.tween($('.fl'), [{ transform: 'scale(0) rotate(-12deg)' }, { transform: 'none' }], T.pkHot + .35, .6);
    return R;
  };

  // the dial: ticks forward on every beat 4.5..7.5 (a spring on each), rests, creeps, then one fast full turn that lands on 38 + 360
  S.hue = function (t) {
    let h = 38;
    for (let i = 0; i < T.tickN; i++) h += 34 * ease.spring(clamp((t - (T.tick0 + i * .5)) / .42));
    const rest = 38 + 34 * T.tickN;
    if (t > T.breath[0]) h = rest + 24 * ease.io3(clamp((t - T.breath[0]) / (T.impact - T.breath[0])));
    if (t >= T.spin[0]) h = lerp(rest + 24, 758, 1 - Math.pow(1 - clamp((t - T.spin[0]) / (T.spin[1] - T.spin[0])), 3));
    return h;
  };

  // the cover poster: hand-built in the template's own design language (dark page, tangerine headline word, the swatch fan on a hue ring).
  // Key content sits in the central square so it survives the profile-grid crop as well as the full 9:16.
  S.cover = function () {
    E.cam.style.display = 'none'; E.field.style.opacity = 0; E.vig.style.opacity = .5;
    const r = E.el('div', 'position:absolute;inset:0;background:radial-gradient(110% 60% at 50% 78%,#4a1fa0 0,#2a1160 45%,#1a0933 100%)', E.cards);
    const stops = Array.from({ length: 13 }, (_, i) => `oklch(.74 .2 ${i * 30 + 38})`).join(',');
    E.el('div', `position:absolute;left:${201 - 270}px;top:${668 - 270}px;width:540px;height:540px;border-radius:50%;background:conic-gradient(from 0deg,${stops});-webkit-mask:radial-gradient(circle,transparent 62%,#000 63%,#000 72%,transparent 73%);mask:radial-gradient(circle,transparent 62%,#000 63%,#000 72%,transparent 73%);opacity:.95`, r).setAttribute('aria-hidden', 'true');
    E.el('div', 'position:absolute;left:30px;top:112px;font:500 11px/1 "Martian Mono",monospace;letter-spacing:.12em;color:#2de2c5;text-transform:uppercase', r, 'Tintwell · the colour lab');
    E.el('div', 'position:absolute;left:30px;top:146px;width:342px;font:900 70px/.88 Gabarito,sans-serif;letter-spacing:-.05em;color:#f6f1ff', r, 'Is your<br><span style="color:#ff5a1f">colour</span><br>costing<br>you?');
    [[-34, '.55 .25 285'], [-17, '.82 .15 178'], [17, '.87 .17 95'], [34, '.68 .24 355'], [0, '.7 .21 38']].forEach(([rot, c], i) => E.el('div', `position:absolute;left:145px;top:498px;width:112px;height:176px;border-radius:22px;transform-origin:50% 130%;transform:rotate(${rot}deg);background:oklch(${c});box-shadow:inset 0 1px 0 rgba(255,255,255,.4),0 10px 24px rgba(0,0,0,.35);z-index:${i === 4 ? 5 : 1}`, r, i === 4 ? '<span style="position:absolute;left:12px;bottom:12px;font:500 9.5px/1.25 Martian Mono,monospace;color:rgba(20,8,40,.8)">tangerine<br>38°</span>' : ''));
  };

  S.update = function (E, t) {
    const R = E.world, A = E.variant === 'A';
    // camera + whip blur
    const c = E.camAt(t), sp = E.camSpeed(t);
    E.applyCam(c, clamp((sp.y - 1500) * 0.012, 0, 34));
    // dial
    const tf = E.frame / 30;                                  // numbers are read at the frame time, not per sub-frame, so motion blur never ghosts two digits on top of each other
    const h = S.hue(t), hn = ((Math.round(S.hue(tf)) % 360) + 360) % 360;
    document.documentElement.style.setProperty('--h', h.toFixed(2));
    const lab = $('.lab'); lab.style.setProperty('--h', h.toFixed(2)); lab.style.setProperty('--hn', hn);
    // the template's load animations on film time (variant decides when they start)
    const tFan = A ? 1.3 : .9, tL = A ? 1.3 : .9;
    E.hero.fan.forEach((a) => { a.currentTime = (t - tFan) * 1000; });
    E.hero.fade.forEach((a) => { a.currentTime = (t - tL) * 1000; });
    E.hero.up.forEach((a) => { a.currentTime = A ? (a.line === 2 ? (t - T.hookCut + .2) * 1000 : 10000) : (t - .5) * 1000; });
    // counters
    $$('.stat').forEach((s, i) => { const u = clamp((tf - T.stat[i] - .12) / .55), to = +s.querySelector('.cnt').style.getPropertyValue('--to'); s.querySelector('.cnt').style.setProperty('--n', Math.round(to * ease.out3(u))); });
    // colour field + iris + hook card
    let fo = 0, clip = 'none';
    if (A && t < T.hookCut) fo = 1;
    if (t >= T.iris[0]) { fo = 1; const r = lerp(0, 700, ease.io3(clamp((t - T.iris[0]) / (T.iris[1] - T.iris[0])))); clip = `circle(${r.toFixed(1)}px at ${E.irisAt.x}px ${E.irisAt.y}px)`; }
    E.field.style.opacity = fo; E.field.style.background = 'var(--tang)'; E.field.style.clipPath = clip;
    if (E.hookCard) E.hookCard.style.display = t < T.hookCut ? 'block' : 'none';
    // light sheens
    const sh = [[3.3, 3.9], T.sheen2, [16.45, 16.95]].find((w) => t >= w[0] && t <= w[1]);
    if (sh) { const u = (t - sh[0]) / (sh[1] - sh[0]); E.sheen.style.opacity = .55 * Math.sin(Math.PI * u); E.sheen.style.left = lerp(-260, 460, ease.io3(u)) + 'px'; } else E.sheen.style.opacity = 0;
    // vignette: loose, closes during the breath, opens on the impact
    let v = .42; if (t < 1) v = .2; if (t >= T.breath[0] && t < T.impact) v = lerp(.42, .9, ease.outX(clamp((t - T.breath[0]) / 1.2))); E.vig.style.opacity = v;
    // focus pull on the hot package during the push: the price stays sharp, everything else falls out of focus
    const f = ease.io3(clamp((t - T.push[0] - .2) / .7)) * 7;
    $$('.pk.hot h3,.pk.hot ul,.pk.hot .fl,.pk.hot .pr small').forEach((e) => { e.style.filter = f > .05 ? `blur(${f.toFixed(2)}px)` : 'none'; });
    $$('.pk:not(.hot)').forEach((e) => { e.style.filter = f > .05 ? `blur(${(f * 1.4).toFixed(2)}px)` : 'none'; });
  };
})();
