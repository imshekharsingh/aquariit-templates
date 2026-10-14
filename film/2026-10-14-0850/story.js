// FILM: Suddly (laundry pickup). Light ground, sky blue + hot pink. Concept: the shop shutter comes down at 7 PM, but the customer's evening is just starting.
// A pickup does not need a shop: book in a tap, a dial counts to 48 hours, and a folded stack takes a shine.
// Combination (differs from the previous film in opener, transition, mechanism, payoff): rack-focus opener, blinds + iris transitions, meter mechanism, lens focus, sweep payoff,
// sentence + giant type, blur captions (NEW option), ring CTA, light ground.
(function () {
  const E = window.FilmEngine, T = window.FILM_T, P = window.FilmParts, { clamp, lerp, ease } = E, S = (E.story = {});
  S.selfStage = true;
  S.dna = {
    opening: 'a giant blurred 7 PM pulls back sharp in front of a closed rolling shutter',
    bigMoment: 'a stack of folded towels pops up and takes a shine after the 48-hour dial',
    ground: 'light: foam white-blue with sky blue and hot pink',
    music: 'bright, bouncy light funk pop at 100 BPM (marimba, pizzicato, finger snaps)',
  };
  const sm = P.sm, css = P.css, $$ = E.$$;
  const SKY = '#00a9ec', DEEP = '#0087c4', PINK = '#ff4f9a', BUTTER = '#ffd84a', INK = '#0b2a3a', FOAM = '#e8f8ff';
  const CLAY = 'box-shadow:inset 0 -8px 0 rgba(11,42,58,.10),inset 0 5px 0 rgba(255,255,255,.85),0 22px 34px -14px rgba(0,50,90,.5)';
  const BAGEL = "'Bagel Fat One',Archivo,sans-serif";

  S.setup = async function () {
    document.documentElement.classList.add('reel');
    await P.ready; await document.fonts.ready;
    await Promise.all(['400 40px "Bagel Fat One"', '800 20px Figtree'].map((f) => document.fonts.load(f)));
    await new Promise((r) => setTimeout(r, 1200));
    const defs = document.querySelector('svg[width="0"]');                 // gradients and symbols must not live under the hidden camera
    const mainEl = document.querySelector('main');
    const { world } = P.scene({ accent: PINK, ink: FOAM, glow: 'rgba(0,169,236,.10)' });
    if (defs) E.stageEl.insertBefore(defs, E.stageEl.firstChild);

    // ---- 0-2.4: a closed rolling shutter at 7 PM, the 7 PM pulls back sharp ----
    S.shutter = E.el('div', `position:absolute;inset:0;background:repeating-linear-gradient(180deg,#d4edf8 0 38px,#b4dcee 38px 41px);opacity:1`, world);
    E.el('div', 'position:absolute;left:0;right:0;bottom:0;height:150px;background:linear-gradient(180deg,rgba(232,248,255,0),#e8f8ff 80%)', S.shutter);
    S.seven = P.rackWord(world, '7 PM', { at: 0, dur: 1.1, y: 300, size: 156, out: 2.4, colour: DEEP });
    const sub = E.el('div', `position:absolute;left:0;right:0;top:368px;text-align:center;font:700 12px/1 ${P.MONO};letter-spacing:.3em;color:${INK}`, world, 'SHUTTER DOWN');
    P.fade(sub, .7, 2.1, { fi: .25, fo: .25 });

    // ---- the phone (frozen clone of the page) ----
    S.phG = E.el('div', 'position:absolute;inset:0;opacity:0', world);
    const ph = (S.ph = P.phone(S.phG, { x: 56, y: 112, w: 290, h: 640 }));
    ph.screen.style.background = FOAM;
    const scrIn = (S.scrIn = E.el('div', 'position:absolute;left:0;top:0;width:402px;transform-origin:0 0', ph.screen));
    scrIn.appendChild(mainEl.cloneNode(true));
    ph.screen.id = 'phScr';
    E.el('style', null, document.head, '#phScr *,#phScr *::before,#phScr *::after{animation:none!important;transition:none!important} #phScr .rv{opacity:1!important;transform:none!important} #phScr .steps::before{transform:none!important}');
    E.pageH = scrIn.scrollHeight; S.scale = (ph.w - 14) / 402;
    P.blinds(world, S.phG, { at: 2.4, dur: .5, n: 7, colour: SKY });

    // ---- 6-8.7: the dial counts to 48 hours ----
    const meterG = E.el('div', 'position:absolute;inset:0;opacity:0', world);
    P.meter(meterG, { cx: 201, cy: 372, r: 156, at: 6.1, dur: 1.7, from: 0, to: 48, unit: 'HOURS', label: 'BACK AT YOUR DOOR' });
    P.fade(meterG, 5.95, 8.5, { fi: .25, fo: .3 });

    // ---- 9-12: iris opens on the plan (sky ground, clay card, wobbly bubbles), a lens reads the small print ----
    const planL = (S.planL = E.el('div', `position:absolute;inset:0;overflow:hidden;background:${SKY};clip-path:circle(0px at 201px 330px)`, world));
    E.el('div', 'position:absolute;inset:0;background:radial-gradient(70% 50% at 70% 20%,rgba(255,255,255,.28),rgba(255,255,255,0) 70%)', planL);
    S.bubs = [[250, 70, 120, 'wob1'], [-26, 410, 100, 'wob2'], [300, 400, 64, 'wob2'], [20, 90, 54, 'wob1']].map(([x, y, d, f], i) => {
      const b = E.el('i', `position:absolute;left:${x}px;top:${y}px;width:${d}px;height:${d}px;border-radius:50%;background:radial-gradient(circle at 32% 28%,#fff 0 9%,rgba(255,255,255,.55) 10% 22%,rgba(255,255,255,.12) 52%,rgba(255,255,255,.34) 74%,rgba(255,255,255,.7) 78%,rgba(255,255,255,0) 80%);filter:url(#${f})`, planL); b.dataset.i = i; return b;
    });
    const card = E.el('div', `position:absolute;left:30px;top:116px;width:342px;height:292px;border-radius:34px;background:#fff;${CLAY};transform-origin:50% 60%`, planL,
      `<div style="position:absolute;left:24px;top:22px;background:${PINK};color:#fff;font:800 11px/1 Figtree,sans-serif;letter-spacing:.12em;padding:7px 11px;border-radius:99px">MOST PICKED</div>
       <svg viewBox="0 0 100 100" width="92" height="92" style="position:absolute;right:20px;top:14px" aria-hidden="true"><use href="#bag"/></svg>
       <div style="position:absolute;left:24px;top:56px;font:400 60px/1 ${BAGEL};color:${INK}">Pair</div>
       <div style="position:absolute;left:24px;top:116px;font:400 112px/1 ${BAGEL};color:${PINK};letter-spacing:-.02em">$34</div>
       <div style="position:absolute;left:218px;top:192px;font:800 22px/1 Figtree,sans-serif;color:${INK}">/ week</div>
       <div style="position:absolute;left:24px;top:252px;font:600 8px/1 ${P.MONO};letter-spacing:.1em;color:#5a7f93">FIRST PICKUP FREE · PAUSE ANY TIME</div>`);
    S.card = card;
    P.lens(planL, `<div style="text-align:center;font:400 18px/1.05 ${BAGEL};color:${INK}">First pickup<br><span style="color:${PINK}">free</span></div>`, { x: 128, y: 384, r: 62, at: 9.9, out: 11.5, zoom: 1 });

    // ---- 12.6: the folded stack and its shine ----
    P.giant(world, 'FRESH.', { at: 12.6, out: 15.4, y: 104, colour: DEEP, maxW: 360 });
    const towelSpec = [[SKY, '#007cb5', 395, 4], ['#ffffff', '#8cc9e6', 340, -3], [PINK, '#d92f78', 285, 0]];
    S.towels = towelSpec.map(([bg, rim, top, dx], i) => {
      const el = E.el('div', `position:absolute;left:${51 + dx}px;top:${top}px;width:300px;height:50px;border-radius:20px;background:linear-gradient(160deg,${bg === '#ffffff' ? '#ffffff,#d6f0ff' : bg + ',' + bg});box-shadow:inset 0 -6px 0 rgba(11,42,58,.12),inset 0 4px 0 rgba(255,255,255,.7),0 0 0 2.5px ${rim},0 16px 20px -10px rgba(0,50,90,.45)`, world);
      E.el('div', 'position:absolute;left:18px;right:18px;bottom:11px;height:3px;border-radius:2px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.75) 0 6px,transparent 6px 14px)', el);
      const at = 12.6 + i * .12;
      P.on((t) => { const k = ease.spring(clamp((t - at) / .5)), o = clamp((t - at) / .08) * (1 - sm(15.4, 15.7, t)); css(el, { opacity: o.toFixed(3), transform: `translateY(${((1 - k) * 90).toFixed(1)}px) scale(${lerp(.82, 1, k).toFixed(3)})` }); });
      P.sweep(el, { at: 13.0 + i * .12, dur: .7 });
      return el;
    });
    P.punchAt = 12.6; P.breath = [12.0, 12.45];

    // ---- 15.6: brand + ring CTA ----
    const ctaG = E.el('div', 'position:absolute;inset:0;opacity:0', world);
    E.el('div', `position:absolute;left:0;right:0;top:120px;text-align:center;font:400 78px/1 ${BAGEL};color:${DEEP};letter-spacing:-.01em`, ctaG, 'suddly');
    E.el('div', `position:absolute;left:0;right:0;top:206px;text-align:center;font:700 11px/1 ${P.MONO};letter-spacing:.2em;color:${INK}`, ctaG, 'LAUNDRY THAT LEAVES WHEN YOU DO');
    P.ring(ctaG, 'BOOK TONIGHT’S PICKUP · FIRST ONE FREE · ', { x: 201, y: 340, r: 84, at: 15.8, label: '→' });
    P.fade(ctaG, 15.55, 16.95, { fi: .2, fo: .35 });

    // ---- captions (blur reveal, the spine) ----
    P.captions([
      [-0.1, .8, 'Why do busy', 32], [.8, 1.65, 'customers skip', 32], [1.65, 2.45, 'your laundry?', 32, { 1: PINK }],
      [3.0, 4.1, 'Book in a tap.', 30, { 3: PINK }], [4.2, 5.5, 'We collect tonight.', 30, { 2: PINK }],
      [6.6, 7.2, 'Book.', 36, { 0: PINK }], [7.2, 7.8, 'Bag.', 36, { 0: PINK }], [7.8, 8.7, 'Back.', 36, { 0: PINK }],
      [9.6, 10.8, 'One price a week.', 30, { 3: PINK }], [10.9, 11.85, 'Pause any time.', 30, { 2: PINK }],
      [13.05, 14.3, 'Back at your door.', 30, { 3: PINK }], [14.35, 15.5, 'Folded. Free pickup.', 28, { 0: PINK }],
      [15.62, 16.85, 'Send this to a laundry owner', 28, { 5: PINK }],
    ], { style: 'blur' });
    P.signoff({});
    S.name = 'Suddly';
    return { ok: true };
  };

  S.update = function (E, t) {
    const ph = S.ph;
    // phone: appears with the blinds (2.65), scrolls 2.6-5.4, leaves 5.6-6.0 (down and away), stays away
    const away = sm(5.55, 6.0, t);
    css(ph.el, { opacity: (1 - away).toFixed(3), transform: `translateY(${(away * 160).toFixed(1)}px) scale(${lerp(1, .9, away).toFixed(3)})` });
    css(ph.halo, { opacity: (1 - away).toFixed(3) });
    const scroll = lerp(0, Math.min(E.pageH - 700, 800), sm(2.7, 5.4, t));
    S.scrIn.style.transform = `scale(${S.scale}) translateY(${(-scroll).toFixed(1)}px)`;
    // shutter ground: visible in the opener, back at the end (loop)
    const loopIn = sm(17.1, 17.95, t);
    S.shutter.style.opacity = (t < 2.65 ? 1 : loopIn).toFixed(3);
    // the 7 PM returns blurred and huge in the last second (frame 0 is the same blurred 7 PM)
    if (t >= 17.0) css(S.seven, { opacity: (.5 * loopIn).toFixed(3), transform: `translateY(-50%) scale(${lerp(1.8, 4.2, loopIn).toFixed(3)})`, filter: `blur(${(loopIn * 14).toFixed(2)}px)` });
    // plan scene: iris open 9.0-9.6, close 11.75-12.15; card springs in; bubbles drift
    const open = ease.io3(clamp((t - 9.0) / .6)), shut = ease.io3(clamp((t - 11.75) / .4));
    S.planL.style.clipPath = open <= 0 || shut >= 1 ? 'circle(0px at 201px 330px)' : `circle(${(open * (1 - shut) * 900).toFixed(1)}px at 201px 330px)`;
    const ck = ease.spring(clamp((t - 9.15) / .55));
    S.card.style.transform = `translateY(${((1 - ck) * 40).toFixed(1)}px) scale(${lerp(.9, 1, ck).toFixed(3)})`;
    S.bubs.forEach((b, i) => { b.style.transform = `translate(${(10 * Math.sin(t * .9 + i * 2)).toFixed(1)}px,${(16 * Math.sin(t * 1.1 + i)).toFixed(1)}px)`; });
    P.update(t);
  };

  S.cover = function () {
    S.update(E, 1.7); E.frame = 7;
    P.front.style.opacity = '0';
    E.el('div', `position:absolute;left:30px;top:410px;width:342px;color:${INK};font:400 46px/.98 ${BAGEL};letter-spacing:-.01em`, E.scene, 'Who skips <span style="color:#ff4f9a">your</span> laundry?');
  };
  S.cues = () => T.cues || [];
})();
