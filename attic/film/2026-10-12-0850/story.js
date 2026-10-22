// Gojigo · "24 minutes" (v3: a different animation combination from the previous film, Dantika).
// Opener: steam-coloured dots assemble into a giant red 24 (the deadline is the hero). Transitions: whip and zoom-through (no scan). Mechanism: a steps rail in the
// kitchen, then a route across the city (no hub, no grid). Focus: spotlight (no brackets). Payoff: DELIVERED stamp + a burst (no warm flood). Type: bare uppercase
// captions + a giant number (no pills). Ending: a tapped button (no card). Ground: deep plum (not black). The dots scatter at the end, so the loop returns to frame 0.
(function () {
  const E = window.FilmEngine, T = window.FILM_T, P = window.FilmParts, { clamp, lerp, ease } = E, S = (E.story = {});
  S.selfStage = true;
  S.dna = { opening: 'steam-coloured dots assemble into a giant red 24', bigMoment: 'DELIVERED stamp slams with a burst of steam at 24:00', ground: 'deep plum', music: 'upbeat funk ~100 BPM' };
  const sm = P.sm, css = P.css, ACC = '#ff2e66', PIST = '#b9f26b', MONO = P.MONO;
  const DUMP = '<svg viewBox="0 0 40 26" width="34" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M3 20c2-11 9-17 17-17s15 6 17 17c-11 4-23 4-34 0z"/><path d="M12 9c1 3 1 6 0 9M20 6v12M28 9c-1 3-1 6 0 9"/></svg>';
  const layer = (parent) => E.el('div', 'position:absolute;inset:0', parent);

  S.setup = async function () {
    document.documentElement.classList.add('reel');
    await P.ready; await document.fonts.ready;
    const { world } = P.scene({ accent: ACC, ink: '#1a0712', glow: 'rgba(255,46,102,.16)' });

    // ---- A. opener: dots assemble into 24 (and scatter back at the end)
    E.A = layer(world);
    P.assemble(E.A, '24', { at: -0.2, dur: 1.5, y: 300, fill: 372, back: 17.1, backDur: .8 });
    E.el('div', `position:absolute;left:30px;right:30px;top:440px;display:flex;justify-content:space-between;font:600 12px/1 ${MONO};letter-spacing:.24em;color:rgba(255,255,255,.7)`, E.A, '<span>MINUTES</span><span>DOOR TO DOOR</span>');

    // ---- B. the phone menu (whips in at 2.4)
    E.B = layer(world);
    const ph = (E.ph = P.phone(E.B, { x: 56, y: 132, w: 290, h: 640 })), sc = ph.screen; sc.style.background = '#160a10';
    E.el('div', 'position:absolute;left:18px;top:20px;font:800 18px/1 Syne,Archivo,sans-serif;color:#fff', sc, `gojigo<span style="color:${ACC}">.</span>`);
    E.el('div', 'position:absolute;left:18px;top:52px;font:800 30px/1 Syne,Archivo,sans-serif;color:#fff;letter-spacing:-.03em', sc, 'Five folds.');
    E.rows = [104, 178, 252, 326, 400].map((y, i) => {
      const r = E.el('div', `position:absolute;left:12px;right:12px;top:${y}px;height:64px;border-radius:16px;background:#241219`, sc);
      E.el('div', `position:absolute;left:14px;top:20px;color:${i ? 'rgba(255,255,255,.35)' : '#ffd0dc'}`, r, DUMP);
      if (!i) { E.el('div', 'position:absolute;left:60px;top:15px;color:#fff;font:700 16px/1.1 Archivo,sans-serif', r, 'Chili-crisp pork'); E.el('div', `position:absolute;left:60px;top:38px;color:rgba(255,255,255,.55);font:500 10px/1 ${MONO}`, r, '6 pcs · hot oil'); }
      else { E.el('div', 'position:absolute;left:60px;top:20px;width:110px;height:9px;border-radius:5px;background:rgba(255,255,255,.14)', r); E.el('div', 'position:absolute;left:60px;top:37px;width:70px;height:8px;border-radius:4px;background:rgba(255,255,255,.08)', r); }
      r.add = E.el('div', 'position:absolute;right:12px;top:15px;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;font:700 18px/1 Archivo,sans-serif;color:#fff;background:rgba(255,255,255,.1)', r, '+');
      return r;
    });
    E.orderBar = E.el('div', `position:absolute;left:12px;right:12px;top:480px;padding:16px 18px;border-radius:18px;background:${ACC};color:#fff;font:800 18px/1.2 Archivo,sans-serif;box-shadow:0 0 30px rgba(255,46,102,.45)`, sc, `Order placed ✓<div style="font:500 11px/1.3 ${MONO};opacity:.85;margin-top:5px">Chili-crisp pork · ETA 24 min</div>`);
    const add = P.rel(E.rows[0].add, world);
    P.spotlight(world, [{ at: 2.95, out: 3.5, x: add.x + add.w / 2, y: add.y + add.h / 2, r: 110 }]);
    P.whip(E.A, E.B, { at: 2.35, dur: .4, dir: -1 });
    // zoom-through the red order bar into the kitchen
    const ob = P.rel(E.orderBar, world);
    E.C = layer(world); E.C.style.opacity = '0';
    P.zoomThrough(E.B, { at: 4.55, dur: .6, x: ob.x + ob.w / 2, y: ob.y + ob.h / 2, then: E.C });

    // ---- C. the kitchen: a steps rail (fold / steam / pack)
    E.ghost = E.el('div', `position:absolute;right:-40px;top:250px;color:transparent;-webkit-text-stroke:2px rgba(255,46,102,.28);font:900 330px/.8 Archivo,sans-serif;font-variation-settings:"wdth" 70;letter-spacing:-.04em`, E.C, '09');
    E.el('div', `position:absolute;left:30px;top:140px;font:600 12px/1 ${MONO};letter-spacing:.3em;color:rgba(255,255,255,.6)`, E.C, 'GOJIGO KITCHEN');
    P.steps(E.C, ['Folded<br>by hand', 'Steamed<br>9 minutes', 'Packed<br>hot'], { x: 30, y: 180, gap: 104, at: 5.25, per: .6, size: 34 });

    // ---- D. the route across the city (whip in at 7.9)
    E.D = layer(world); E.D.style.opacity = '0';
    { let q = 5; const rnd = () => { q = (q * 1664525 + 1013904223) >>> 0; return q / 4294967296; };
      for (let y = 96; y < 715; y += 64) { let x = -10; while (x < 402) { const w = 40 + Math.floor(rnd() * 70); if (rnd() > .12) E.el('div', `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${52 + Math.floor(rnd() * 8)}px;border-radius:8px;background:linear-gradient(160deg,#2a1020,#1c0a15);box-shadow:inset 0 1px 0 rgba(255,255,255,.05),0 0 0 1px rgba(255,255,255,.04)`, E.D); x += w + 12; } } }
    P.route(E.D, 'M44 150 L150 150 Q160 150 160 160 L160 266 Q160 276 170 276 L330 276 Q340 276 340 286 L340 340 Q340 350 330 350 L110 350 Q100 350 100 360 L100 414 Q100 424 110 424 L250 424', { at: 8.6, dur: 3.2, icon: 'pin', from: 'KITCHEN', to: 'YOUR DOOR' });
    P.whip(E.C, E.D, { at: 7.85, dur: .4, dir: -1 });

    // ---- E. payoff: DELIVERED + burst at 24:00 (breath before it)
    P.breath = [12.0, 12.45];
    E.stamp = P.stamp(E.D, `Delivered<div style="font:600 11px/1 ${MONO};letter-spacing:.16em;margin-top:7px">24 MIN · STILL HOT</div>`, { x: 201, y: 236, at: 12.6, colour: PIST, size: 28 });
    P.burst(E.D, { x: 250, y: 424, at: 12.6, colours: ['#ffffff', ACC, '#ffb3c6', PIST], spread: 380, n: 140 });
    E.big = P.giant(world, '24:00', { at: 13.0, out: 14.05, y: 300, colour: ACC });

    // ---- stopwatch (mono, top-left)
    E.sw = E.el('div', `position:absolute;left:30px;top:104px;font:600 12px/1 ${MONO};letter-spacing:.14em;color:rgba(255,255,255,.85)`, P.front, '');

    // ---- F. ending: the order button gets tapped
    E.F = layer(world); E.F.style.opacity = '0';
    E.el('div', `position:absolute;left:30px;right:20px;top:140px;color:#fff;font:900 88px/.86 Archivo,sans-serif;font-variation-settings:"wdth" 66;letter-spacing:-.03em;text-transform:uppercase`, E.F, `Hot.<br>Folded.<br><span style="color:${ACC}">Gone.</span>`);
    P.tap(E.F, 'Order a bag', { x: 201, y: 430, at: 16.2, done: '✓ Ordered' });
    P.signoff({ at: 16.9, out: 17.6 });

    // ---- captions: bare, uppercase, no pill
    P.captions([
      [-0.1, 1.15, 'Can a dumpling', 28], [1.15, 2.3, 'beat the clock?', 28, { 2: ACC }],
      [2.6, 3.5, 'One tap.', 28, { 1: ACC }], [3.6, 4.5, 'Clock starts.', 28],
      [5.4, 7.6, 'In the kitchen', 26],
      [8.6, 10.0, 'Across town', 26], [10.0, 11.95, 'Still hot?', 28, { 1: ACC }],
      [14.2, 15.4, 'Still hot.', 30, { 1: ACC }],
    ], { style: 'bare' });
    return { ok: true };
  };

  S.update = function (E, t) {
    const added = t >= 3.3;
    css(E.rows[0].add, { background: added ? ACC : 'rgba(255,255,255,.1)', boxShadow: added ? '0 0 12px rgba(255,46,102,.8)' : 'none' }); E.rows[0].add.textContent = added ? '✓' : '+';
    const ob = ease.spring(clamp((t - 3.6) / .5));
    css(E.orderBar, { opacity: clamp((t - 3.6) / .1).toFixed(3), transform: `translateY(${((1 - ob) * 50).toFixed(1)}px)` });
    E.B.style.visibility = t >= 2.3 && t < 5.2 ? 'visible' : 'hidden';
    E.C.style.visibility = t >= 4.9 && t < 8.3 ? 'visible' : 'hidden';
    E.D.style.visibility = t >= 7.8 && t < 15.6 ? 'visible' : 'hidden';
    E.F.style.opacity = (sm(15.4, 15.8, t) * (1 - sm(16.9, 17.1, t))).toFixed(3);
    // stopwatch: 0 at 3.6, kitchen to 9 min, ride to 23:36, 23:59 in the breath, 24:00 at the peak
    const mins = t < 3.6 ? 0 : t < 8.6 ? lerp(0, 9, (t - 3.6) / 5) : t < 12.0 ? lerp(9, 23.6, clamp((t - 8.6) / 3.2)) : t < 12.6 ? 23 + 59 / 60 : 24;
    const mm = Math.floor(mins), ss = t >= 12.0 && t < 12.6 ? 59 : Math.floor((mins - mm) * 60);
    E.sw.textContent = `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')} MIN`;
    const blink = t >= 12.0 && t < 12.6 ? (Math.floor(t * 5) % 2 ? .3 : 1) : 1;
    E.sw.style.opacity = (sm(3.5, 3.8, t) * (1 - sm(15.2, 15.5, t)) * blink).toFixed(3);
    E.sw.style.color = t >= 12.6 ? PIST : 'rgba(255,255,255,.85)';
    P.update(t);
    // after the parts: the opener layer shows only at the start and again for the loop (the whip moved it away)
    if (t >= 16.95) css(E.A, { transform: 'none', filter: 'none' });
    E.A.style.visibility = t < 2.8 || t >= 16.95 ? 'visible' : 'hidden';
    E.D.style.opacity = t >= 7.85 ? (t < 8.3 ? E.D.style.opacity : (1 - sm(15.1, 15.5, t)).toFixed(3)) : '0';
  };

  S.cover = function () {
    S.update(E, 1.6); E.frame = 7;
    P.front.querySelectorAll('div').forEach((d) => { d.style.opacity = '0'; });
    E.el('div', `position:absolute;left:30px;top:150px;width:342px;color:#fff;font:900 40px/.95 Archivo,sans-serif;font-variation-settings:"wdth" 76;letter-spacing:-.02em;text-transform:uppercase`, E.scene, `Can dumplings beat <span style="color:${ACC}">the clock?</span>`);
    css(E.A, { transform: 'translateY(90px) scale(.9)' });
  };
  S.cues = () => T.cues;
})();
