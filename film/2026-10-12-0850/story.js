// Gojigo · "24 minutes". Can a dumpling beat the clock? A bamboo steamer drawn in light; one tap orders the chili-crisp pork; the kitchen folds, steams and packs it;
// a scooter rides a glowing route across a dark city while the stopwatch runs; a held breath at 23:59; at 24:00 the door pin lights, DELIVERED slams down and the
// steam bursts out in a warm flood. A curl of steam is the recurring character: it rises from the steamer, rides with the order and bursts at the door.
// Built on scripts/film/parts.js (product-film grammar). Accent: Gojigo's goji red, brightened to glow on black; pistachio only for DELIVERED; warmth (chili) only at the payoff.
(function () {
  const E = window.FilmEngine, T = window.FILM_T, P = window.FilmParts, { clamp, lerp, ease } = E, S = (E.story = {});
  S.selfStage = true;
  const sm = P.sm, css = P.css, ACC = '#ff2e66', PIST = '#b9f26b', CHILI = '#ff9f1c', MONO = P.MONO, TAU = Math.PI * 2;
  const STEAM = '<path d="M8 21c-3-3 3-5 0-8.5s3-5 0-8.5"/><path d="M15.5 21c-3-3 3-5 0-8.5s3-5 0-8.5"/>';
  const DUMP = '<svg viewBox="0 0 40 26" width="34" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M3 20c2-11 9-17 17-17s15 6 17 17c-11 4-23 4-34 0z"/><path d="M12 9c1 3 1 6 0 9M20 6v12M28 9c-1 3-1 6 0 9"/></svg>';

  S.setup = async function () {
    document.documentElement.classList.add('reel');
    await P.ready; await document.fonts.ready;
    const { world } = P.scene({ accent: ACC, glow: 'rgba(160,60,90,.12)' });

    // ---- A. the steamer, drawn in light, steam rising (frame 0 and the loop)
    E.st = E.el('div', 'position:absolute;left:76px;top:170px;width:250px;height:230px;transform-origin:50% 70%', world);
    E.stGlow = E.el('div', 'position:absolute;left:10px;top:110px;width:230px;height:120px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,80,120,.35),rgba(0,0,0,0));filter:blur(8px)', E.st);
    E.st.insertAdjacentHTML('beforeend', `<svg viewBox="0 0 250 230" width="250" height="230" fill="none" stroke="rgba(240,236,238,.7)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="position:absolute;inset:0">
      <ellipse cx="125" cy="120" rx="100" ry="22"/><path d="M25 120v52c0 13 45 24 100 24s100-11 100-24v-52"/><path d="M25 148c0 12 45 22 100 22s100-10 100-22"/>
      <path d="M48 130v54M78 136v56M110 140v58M142 140v58M174 136v56M204 130v54" stroke-opacity=".35"/>
      <path d="M38 112c8-30 50-46 87-46s79 16 87 46"/><path d="M60 96c18-12 40-18 65-18s47 6 65 18" stroke-opacity=".45"/><rect x="113" y="60" width="24" height="9" rx="4.5"/>
      <path d="M0 214H250" stroke="rgba(255,255,255,.35)" stroke-width="1"/></svg>`);
    E.steamA = [0, 1, 2].map((i) => E.el('div', `position:absolute;left:${70 + i * 42}px;top:6px;width:40px;height:60px;color:rgba(255,255,255,.75)`, E.st, `<svg viewBox="0 0 24 24" width="40" height="60" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" preserveAspectRatio="none">${STEAM}</svg>`));
    E.badge = E.el('div', `position:absolute;left:62px;top:224px;width:126px;text-align:center;font:500 9px/1 ${MONO};letter-spacing:.2em;color:rgba(255,255,255,.6)`, E.st, 'GOJIGO · DUMPLING BAR');

    // ---- B. the phone: Gojigo's menu as skeleton rows, one real row gets tapped
    const ph = (E.ph = P.phone(world, { x: 111, y: 104, w: 180, h: 352 }));
    const sc = ph.screen; sc.style.background = '#160a10';
    E.el('div', `position:absolute;left:12px;top:14px;font:800 13px/1 Syne,Archivo,sans-serif;color:#fff;letter-spacing:-.02em`, sc, 'gojigo<span style="color:' + ACC + '">.</span>');
    E.el('div', `position:absolute;right:12px;top:15px;font:500 8px/1 ${MONO};letter-spacing:.12em;color:rgba(255,255,255,.5)`, sc, 'MENU');
    E.el('div', `position:absolute;left:12px;top:38px;font:800 17px/1 Syne,Archivo,sans-serif;color:#fff;letter-spacing:-.03em`, sc, 'Five folds.');
    const rowsY = [70, 122, 174, 226, 278];
    E.rows = rowsY.map((y, i) => {
      const r = E.el('div', `position:absolute;left:8px;right:8px;top:${y}px;height:44px;border-radius:12px;background:#241219;box-shadow:inset 0 1px 0 rgba(255,255,255,.06)`, sc);
      E.el('div', `position:absolute;left:9px;top:11px;color:${i ? 'rgba(255,255,255,.35)' : '#ffd0dc'}`, r, DUMP);
      if (i === 0) { E.el('div', 'position:absolute;left:50px;top:10px;color:#fff;font:700 10.5px/1.1 Archivo,sans-serif', r, 'Chili-crisp pork'); E.el('div', `position:absolute;left:50px;top:25px;color:rgba(255,255,255,.55);font:500 8px/1 ${MONO}`, r, '6 pcs · hot oil'); }
      else { E.el('div', 'position:absolute;left:50px;top:13px;width:70px;height:7px;border-radius:4px;background:rgba(255,255,255,.14)', r); E.el('div', 'position:absolute;left:50px;top:25px;width:44px;height:6px;border-radius:3px;background:rgba(255,255,255,.08)', r); }
      r.add = E.el('div', `position:absolute;right:8px;top:10px;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font:700 14px/1 Archivo,sans-serif;color:#fff;background:rgba(255,255,255,.1)`, r, '+');
      return r;
    });
    E.orderBar = E.el('div', `position:absolute;left:8px;right:8px;bottom:8px;padding:10px 12px;border-radius:14px;background:${ACC};color:#fff;font:800 11px/1.2 Archivo,sans-serif;box-shadow:0 0 24px rgba(255,46,102,.5)`, sc, `Order placed ✓<div style="font:500 8px/1.3 ${MONO};opacity:.85;margin-top:3px">Chili-crisp pork · ETA 24 min</div>`);
    E.brk = P.brackets(ph.el);
    E.addBox = P.rel(E.rows[0].add, ph.el);
    E.brk.snap(E.addBox, 3.0, 3.75);

    // ---- C. the kitchen: hub + fold / steam / pack
    P.hub(world, { cx: 201, cy: 290, from: { x: 201, y: 226 }, label: 'GOJIGO<br>KITCHEN', at: 6.0, out: 8.3,
      nodes: [{ x: 91, y: 400, icon: '<path d="M4 16c2-6 5-9 8-9s6 3 8 9c-5 2-11 2-16 0z"/><path d="M9 10.5c.7 1.5.7 3.5 0 5M12 9v7M15 10.5c-.7 1.5-.7 3.5 0 5"/>', label: 'Folded', at: 6.6 },
        { x: 201, y: 400, icon: STEAM, label: 'Steamed', at: 7.2 }, { x: 311, y: 400, icon: '<path d="M5 9h14l-1.5 11h-11z"/><path d="M9 9V7a3 3 0 0 1 6 0v2"/>', label: 'Packed', at: 7.8 }] });

    // ---- D. the route across a dark city
    E.map = E.el('div', 'position:absolute;inset:0', world);
    const blocks = [[40, 150, 70, 58], [122, 150, 94, 40], [228, 150, 60, 74], [300, 150, 62, 50], [40, 222, 52, 90], [104, 204, 64, 62], [180, 226, 84, 46], [276, 212, 86, 70], [40, 326, 96, 52], [148, 280, 60, 98], [220, 284, 70, 44], [302, 296, 60, 82], [40, 392, 60, 40], [112, 392, 120, 40], [244, 340, 50, 92], [306, 392, 56, 40]];
    blocks.forEach(([x, y, w, h]) => E.el('div', `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:7px;background:linear-gradient(160deg,#17191c,#0d0e10);box-shadow:inset 0 1px 0 rgba(255,255,255,.05),0 0 0 1px rgba(255,255,255,.05)`, E.map));
    E.map.insertAdjacentHTML('beforeend', `<svg viewBox="0 0 402 715" width="402" height="715" fill="none" aria-hidden="true" style="position:absolute;inset:0;overflow:visible">
      <path id="route" d="M66 214 L66 196 Q66 190 72 190 L170 190 Q176 190 176 196 L176 274 Q176 280 182 280 L268 280 Q274 280 274 286 L274 330 Q274 336 280 336 L330 336 Q336 336 336 342 L336 388" pathLength="1" stroke="${ACC}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 0 6px rgba(255,46,102,.8));stroke-dasharray:1;stroke-dashoffset:1"/></svg>`);
    E.route = E.map.querySelector('#route');
    const pin = (x, y, lab, c) => { const p = E.el('div', `position:absolute;left:${x - 9}px;top:${y - 9}px;width:18px;height:18px;border-radius:50%;background:${c};box-shadow:0 0 0 4px ${P.hexA(c, .25)},0 0 18px ${P.hexA(c, .7)}`, E.map); p.lab = E.el('div', `position:absolute;left:${x - 60}px;width:120px;top:${y + 14}px;text-align:center;font:500 8.5px/1 ${MONO};letter-spacing:.14em;color:rgba(255,255,255,.7)`, E.map, lab); return p; };
    E.pinA = pin(66, 214, 'KITCHEN', '#ffffff'); E.pinB = pin(336, 388, 'YOUR DOOR', PIST);
    E.scoot = E.el('div', `position:absolute;left:-14px;top:-14px;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:${ACC};color:#fff;box-shadow:0 0 0 5px rgba(255,46,102,.25),0 0 22px rgba(255,46,102,.9)`, E.map,
      '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="17" r="2.5"/><circle cx="18" cy="17" r="2.5"/><path d="M8.5 17h7l2-6h-4l-2 6M14 7h3l1 4"/></svg>');
    E.trail = E.el('div', 'position:absolute;left:-12px;top:-30px;width:24px;height:30px;color:rgba(255,255,255,.7)', E.map, `<svg viewBox="0 0 24 24" width="24" height="30" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" preserveAspectRatio="none">${STEAM}</svg>`);
    E.stamp = E.el('div', `position:absolute;left:201px;top:262px;white-space:nowrap;text-align:center;padding:10px 16px;border:2.5px solid ${PIST};border-radius:10px;color:${PIST};font:900 24px/1 Archivo,sans-serif;letter-spacing:.12em;background:rgba(8,10,6,.72);text-transform:uppercase;transform-origin:50% 50%;text-shadow:0 0 14px rgba(185,242,107,.6);box-shadow:0 0 18px rgba(185,242,107,.35),inset 0 0 12px rgba(185,242,107,.2);opacity:0`, E.map, `Delivered<div style="font:500 8.5px/1 ${MONO};letter-spacing:.16em;margin-top:5px;text-align:center">24 MIN · STILL HOT</div>`);
    E.burst = [0, 1, 2, 3, 4].map((i) => E.el('div', `position:absolute;left:${322 + (i - 2) * 12}px;top:330px;width:26px;height:44px;color:rgba(255,236,220,.9);opacity:0`, E.map, `<svg viewBox="0 0 24 24" width="26" height="44" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" preserveAspectRatio="none">${STEAM}</svg>`));

    // ---- E. stopwatch HUD (minutes on the order)
    E.sw = E.el('div', `position:absolute;left:30px;top:104px;display:flex;align-items:center;gap:8px;font:500 11px/1 ${MONO};letter-spacing:.14em;color:rgba(255,255,255,.85)`, P.front,
      `<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><circle cx="10" cy="10" r="8" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="2"/><circle class="arc" cx="10" cy="10" r="8" fill="none" stroke="${ACC}" stroke-width="2" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" transform="rotate(-90 10 10)" stroke-linecap="round"/></svg><span></span>`);
    E.swArc = E.sw.querySelector('.arc'); E.swT = E.sw.querySelector('span');

    // ---- F. payoff + CTA
    P.payoff({ at: 12.6, out: 17.4, breath: [12.0, 12.45], colors: ['rgba(255,190,90,1)', 'rgba(255,110,90,.78)', 'rgba(170,40,90,.45)'] });
    E.cta = P.card(world, 'left:41px;top:170px;width:320px;padding:20px 22px;border-radius:24px',
      `<div style="font:500 9px/1 ${MONO};letter-spacing:.16em;opacity:.65">GOJIGO · DUMPLING BAR · DEMO</div>
       <div style="font:900 34px/.95 Archivo,sans-serif;font-variation-settings:'wdth' 76;text-transform:uppercase;margin-top:12px">Hot. Folded.<br><span style="color:${ACC}">Gone.</span></div>
       <div style="font:500 10px/1.45 ${MONO};opacity:.75;margin-top:10px">Fold-to-order dumplings · live route map<br>Delivered in about 24 minutes</div>
       <div class="btn" style="display:inline-flex;align-items:center;gap:8px;margin-top:16px;padding:11px 16px;border-radius:99px;background:${ACC};color:#fff;font:800 12px/1 Archivo,sans-serif;letter-spacing:.05em;text-transform:uppercase">Order a bag <span aria-hidden="true">→</span></div>`);
    E.ctaRim = E.el('div', `position:absolute;left:41px;top:170px;width:320px;border-radius:24px;pointer-events:none;box-shadow:0 0 0 1px rgba(255,46,102,.55),0 0 34px rgba(255,46,102,.25)`, world);
    P.brackets(E.cta).snap(P.rel(E.cta.querySelector('.btn'), E.cta), 16.2, 16.85);

    // ---- captions
    P.captions([
      [-0.1, 1.15, 'Can a dumpling', 32], [1.15, 2.35, 'beat the clock?', 32, { 2: ACC }],
      [2.6, 3.55, '9:41 pm. Hungry.', 28], [3.6, 4.6, 'One tap.', 30, { 1: ACC }], [4.65, 5.4, 'The clock starts.', 28, { 2: ACC }],
      [5.6, 6.55, 'In the kitchen:', 28], [6.6, 7.2, 'Folded.', 30, { 0: ACC }], [7.2, 7.8, 'Steamed.', 30, { 0: ACC }], [7.8, 8.5, 'Packed.', 30, { 0: ACC }],
      [8.8, 10.0, 'Across town.', 28], [10.0, 11.95, 'Still hot?', 30, { 1: ACC }],
      [12.75, 14.2, '24 minutes.', 34, { 0: PIST }], [14.2, 15.5, 'Still hot.', 34, { 1: CHILI }],
      [15.8, 16.95, 'Hot. Folded. Gone.', 28, { 2: ACC }],
    ]);
    return { ok: true };
  };

  S.update = function (E, t) {
    const tf = E.frame / 30, ph = TAU * t / 18;
    // A. steamer: frame 0 and back at the loop
    const stO = Math.max(1 - sm(2.4, 2.8, t), sm(17.0, 17.6, t));
    css(E.st, { opacity: stO.toFixed(3), transform: `scale(${(t < 9 ? 1 - .08 * sm(2.4, 2.8, t) : 1.06 - .06 * sm(17.0, 17.6, t)).toFixed(4)})`, filter: stO < .98 ? `blur(${((1 - stO) * 3).toFixed(2)}px)` : 'none' });
    E.steamA.forEach((s, i) => { const u = ((t * .55 + i / 3) % 1); css(s, { opacity: (Math.sin(Math.PI * u) * .9).toFixed(3), transform: `translateY(${(-u * 46).toFixed(1)}px) scaleX(${(1 + .15 * Math.sin(ph * 3 + i)).toFixed(3)})` }); });
    E.stGlow.style.opacity = (.75 + .25 * Math.sin(tf * 2)).toFixed(3);
    // B. phone 2.4-5.4, shrinks into the kitchen system 5.4-6.0, gone by 8.4
    const pin = ease.spring(clamp((t - 2.45) / .7)), mini = sm(5.4, 6.0, t), gone = sm(8.3, 8.7, t);
    const py = (1 - pin) * 90 - 120 * mini, psc = lerp(.9, 1, pin) * lerp(1, .36, mini);
    const po = t < 2.45 ? 0 : clamp((t - 2.45) / .25) * (1 - gone);
    css(E.ph.el, { opacity: po.toFixed(3), transform: `translateY(${py.toFixed(1)}px) scale(${psc.toFixed(4)})` });
    css(E.ph.halo, { opacity: (po * (1 - mini)).toFixed(3), transform: `translateY(${py.toFixed(1)}px)` });
    const added = t >= 3.3;
    css(E.rows[0].add, { background: added ? ACC : 'rgba(255,255,255,.1)', boxShadow: added ? '0 0 12px rgba(255,46,102,.8)' : 'none' }); E.rows[0].add.textContent = added ? '✓' : '+';
    const ob = ease.spring(clamp((t - 3.6) / .5));
    css(E.orderBar, { opacity: clamp((t - 3.6) / .1).toFixed(3), transform: `translateY(${((1 - ob) * 50).toFixed(1)}px)` });
    // D. map 8.4-15.5: route draws as the scooter rides 8.9-11.9; breath; delivered at 12.6
    const mo = sm(8.4, 8.9, t) * (1 - sm(15.3, 15.7, t));
    const ride = ease.io3(clamp((t - 8.9) / 3.0)) * .985 + .015 * sm(12.45, 12.6, t);
    E.route.style.strokeDashoffset = (1 - ride).toFixed(4);
    const L = E.route.getTotalLength(), pt = E.route.getPointAtLength(L * ride);
    const fol = sm(8.9, 9.6, t) * (1 - sm(12.5, 13.2, t)), zs = 1 + .14 * fol;   // the camera follows the scooter, then pulls back for the delivery
    css(E.map, { opacity: mo.toFixed(3), transformOrigin: '201px 300px', transform: `translate(${((201 - pt.x) * .22 * fol).toFixed(1)}px,${((300 - pt.y) * .22 * fol + (1 - sm(8.4, 8.9, t)) * 20 - 30 * sm(15.3, 15.7, t)).toFixed(1)}px) scale(${zs.toFixed(4)})` });
    E.scoot.style.transform = `translate(${pt.x.toFixed(1)}px,${pt.y.toFixed(1)}px) scale(${(1 + .08 * Math.sin(tf * 8)).toFixed(3)})`;
    css(E.trail, { transform: `translate(${pt.x.toFixed(1)}px,${pt.y.toFixed(1)}px)`, opacity: (t > 8.9 && t < 12.6 ? .55 + .35 * Math.sin(tf * 6) : 0).toFixed(3) });
    E.pinB.style.transform = t >= 12.6 ? `scale(${(1 + .5 * Math.exp(-(t - 12.6) * 4)).toFixed(3)})` : 'none';
    const sk = ease.spring(clamp((t - 12.6) / .45));
    css(E.stamp, { opacity: clamp((t - 12.6) / .06).toFixed(3), transform: `translate(-50%,-50%) rotate(-7deg) scale(${lerp(1.8, 1, sk).toFixed(3)})` });
    E.burst.forEach((b, i) => { const u = clamp((t - 12.6 - i * .05) / 1.4); css(b, { opacity: (Math.sin(Math.PI * u) * (u > 0 ? 1 : 0)).toFixed(3), transform: `translate(${((i - 2) * 10 * u).toFixed(1)}px,${(-90 * ease.out3(u)).toFixed(1)}px) scale(${(1 + .6 * u).toFixed(3)})` }); });
    // E. stopwatch: 0:00 at 3.6, 23:59 in the breath, 24:00 at 12.6
    const mins = t < 3.6 ? 0 : t < 8.9 ? lerp(0, 9, (t - 3.6) / 5.3) : t < 12.0 ? lerp(9, 23.6, clamp((t - 8.9) / 3.0)) : t < 12.6 ? 23 + 59 / 60 : 24;   // kitchen 0-9 min, the ride 9-23.6, 23:59 in the breath
    const mm = Math.floor(mins), ss = t >= 12.0 && t < 12.6 ? 59 : Math.floor((mins - mm) * 60);
    E.swT.textContent = `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}  MIN`;
    E.swArc.setAttribute('stroke-dashoffset', (1 - mins / 24).toFixed(4)); E.swArc.setAttribute('stroke', t >= 12.6 ? PIST : ACC);
    const blink = t >= 12.0 && t < 12.6 ? (Math.floor(t * 5) % 2 ? .3 : 1) : 1;
    E.sw.style.opacity = (sm(3.5, 3.8, t) * (1 - sm(15.4, 15.7, t)) * blink).toFixed(3);
    // F. CTA
    const ck = ease.spring(clamp((t - 15.6) / .55)), co = clamp((t - 15.6) / .15) * (1 - sm(16.85, 17.15, t));
    css(E.cta, { opacity: co.toFixed(3), transform: `translateY(${((1 - ck) * 26).toFixed(1)}px) scale(${lerp(.94, 1, ck).toFixed(3)})` });
    css(E.ctaRim, { height: E.cta.offsetHeight + 'px', opacity: (co * (.6 + .4 * Math.sin(tf * 2.4))).toFixed(3), transform: E.cta.style.transform });
    P.update(t);
  };

  S.cover = function () {
    S.update(E, 12.0); E.frame = 7;
    P.front.querySelectorAll('div').forEach((d) => { if (d !== E.sw) d.style.opacity = '0'; });
    css(E.map, { transform: 'translateY(120px)', opacity: '1' });
    E.sw.style.opacity = '1'; E.swT.textContent = '23:59  MIN'; css(E.sw, { top: '150px' });
    E.el('div', `position:absolute;left:30px;top:176px;width:342px;color:#fff;font:900 46px/.92 Archivo,sans-serif;font-variation-settings:"wdth" 78;letter-spacing:-.02em;text-transform:uppercase`, E.scene, `Can dumplings beat <span style="color:${ACC};text-shadow:0 0 24px rgba(255,46,102,.55)">the clock?</span>`);
  };
  S.cues = () => T.cues;
})();
