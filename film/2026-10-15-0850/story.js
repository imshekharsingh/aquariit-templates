// FILM: "Why is your site slow abroad?" (service: edge). 15 Oct 2026. First daily use of an isometric machine (P.iso, design/film-playbook.md): the service IS the machine.
// The idea: a sorting machine. Before: every parcel (a shopper's request) crawls the whole belt to ONE far-away tower (the origin), bots ride along with the rest.
// Then "Add the edge": chute doors drop, pushers fire, every parcel goes down the NEAREST chute and the red ones (bad traffic) are shoved into a reject tray.
// Key frames: 0.0 tight on the tower, parcels creeping + hook | 4.5 the whole machine, timer 2.9 s climbing | 7.6 dim, "Add the edge." | 8.6 doors drop, camera pushes in |
// 11.0 sorted parcels, red one hits the tray, 0.4 s | 14.2 "Fast everywhere." | 16.5 send line + sign-off, machine resets for the loop.
(function () {
  const E = window.FilmEngine, T = window.FILM_T, P = window.FilmParts, { clamp, lerp } = E, S = (E.story = {});
  S.selfStage = true;
  S.dna = {
    service: 'edge',
    format: 'explainer',
    opening: 'close on a navy origin tower where parcels creep along a belt under "Why is your site slow abroad?"',
    bigMoment: 'the chute doors drop and pushers sort every parcel into its nearest chute while red ones are shoved into the reject tray',
    ground: 'light ice blue with navy, cyan, coral and sun yellow',
    music: 'dry mechanical ticking that opens into a bright, bouncy 100 BPM groove at the sort',
  };
  const NAVY = '#0a1a3a', CY = '#16c1ff', COR = '#ff4f6d', SUN = '#ffd23f', MINT = '#6ee7b7', KRAFT = '#e2b36e', STEEL = '#b9c6d3', DARK = '#27324a', BASE = '#dfe7ee', BELT = '#4b5568';
  const sp = (t, t0, n = 'bold') => P.springAt(t, t0, n), tw = (t, t0, d, n = 'swing') => P.tween(t, t0, d, n);
  const PEAK = 8.6, VA = 22, VB = 66, X0 = -100, XT = 80;                 // peak time, belt speeds (units/s), belt start, tower face
  const CHUTES = [{ cx: -70, c: CY }, { cx: -20, c: SUN }, { cx: 30, c: MINT }], BIN = { cx: 67 };

  S.setup = async function () {
    document.documentElement.classList.add('reel');
    await P.ready; await document.fonts.ready;
    const { world } = P.scene({ accent: COR, ink: '#e6f5fb', glow: 'rgba(22,193,255,.20)' });
    P.use('opener', 'tight-pull-back'); P.use('transition', 'breath-cut'); P.use('payoff', 'sort-burst'); P.use('type', 'stacked-title'); P.use('cta', 'sign-off');
    const rig = E.el('div', 'position:absolute;left:0;top:0;width:402px;height:715px', world);
    const cam = P.camera([[0, { x: 262, y: 380, s: 1.6 }], [2.5, { x: 262, y: 380, s: 1.6 }, 'swing'], [8.3, { x: 201, y: 372, s: 1 }, 'default'], [PEAK - .02, { x: 201, y: 372, s: 1 }, 'swing'],
      [9.3, { x: 262, y: 322, s: 1.38 }, 'swing'], [13.4, { x: 232, y: 352, s: 1.28 }, 'swing'], [17.0, { x: 201, y: 372, s: 1 }, 'default'], [18, { x: 262, y: 380, s: 1.6 }, 'default']], { shake: [[PEAK, PEAK, 7]], handheld: .5 });
    cam.film(rig);
    const I = P.iso(rig, { ox: 212, oy: 405, s: 1.7, line: '#12203c' });

    // ---- the belt's clock: slow before the peak, fast after (a pure function of time; the last 0.65 s map back to negative time so the film loops) ----
    const tt = (t) => (t >= 17.35 ? t - 18 : t);
    const Xc = (t) => (t < PEAK ? VA * t : VA * PEAK + VB * (t - PEAK));       // belt travel since t = 0
    const open = (t) => clamp(sp(t, PEAK, 'bold') - sp(t, 17.0, 'default'), 0, 1.04);   // 0 = doors shut (the origin does it all), 1 = the edge is on

    // ---- the parcels ----
    const bLate = [8.25, 8.85, 9.45, 10.05, 10.65, 11.25, 11.85, 12.45], dLate = ['a', 'b', 'x', 'c', 'a', 'b', 'x', 'c'];
    const items = [];
    for (let j = 1; j <= 11; j++) items.push({ b: -9 + 1.5 * j, red: j % 3 === 2 });
    bLate.forEach((b, i) => items.push({ b, red: dLate[i] === 'x' }));
    const xAt = (p, t) => X0 + Xc(t) - Xc(p.b);
    items.forEach((p, i) => {                                                  // destination: the first chute ahead of the parcel when the edge switches on
      const x8 = xAt(p, PEAK), ahead = CHUTES.map((c, k) => ({ c, k })).filter(({ c }) => c.cx > x8 + 12);
      if (p.red) p.dest = x8 < BIN.cx - 12 ? 'bin' : 'tower';
      else if (p.b >= PEAK - .5) p.dest = ['a', 'b', 'c'].indexOf(dLate[bLate.indexOf(p.b)]) , p.dest = p.dest < 0 ? 0 : p.dest;
      else p.dest = ahead.length ? ahead[i % ahead.length].k : 'tower';
      if (p.dest === 'bin' || typeof p.dest === 'number') {
        const cx = p.dest === 'bin' ? BIN.cx : CHUTES[p.dest].cx;
        let tt0 = Math.max(p.b, PEAK); while (tt0 < 17 && xAt(p, tt0) + 9 < cx) tt0 += .005;
        p.hit = tt0; p.px = cx - 9;
      }
    });
    const state = (p, t0) => {
      const t = tt(t0); if (t < p.b - .01 && !(t0 >= 17.35)) return null;
      const op = t0 >= 17.35 ? tw(t0, 17.45, .3, 'glide') : 1;                    // reset: parcels fade back in over the last 0.55 s
      const out = t0 >= 16.9 && t0 < 17.35 ? 1 - tw(t0, 16.9, .35, 'snap') : 1;
      let x = xAt(p, t), y = 5, z = 30.3, o = clamp((x - X0) / 10) * op * out;
      if (t0 >= 17.35 && t < p.b) return null;
      if (p.hit != null && t >= p.hit && t0 < 17.35) {
        const u = P.EASE.swing(clamp((t - p.hit) / .42));
        if (p.dest === 'bin') { x = p.px; y = lerp(5, 52, u); z = 30.3 - 16 * clamp((y - 24) / 26); }
        else { x = p.px; y = lerp(5, -50, u); z = 30.3 - 16 * clamp((-y) / 18); }
        if (p.dest !== 'bin') o *= 1 - tw(t, p.hit + 1.3, .35, 'swing'); else o *= 1 - tw(t, p.hit + 1.6, .35, 'swing');
        return { x, y, z, o, col: p.red ? COR : KRAFT, tape: p.red ? '#ffd6dd' : '#f3d9a8' };
      }
      if (x > XT - 6) { const g = clamp((x - (XT - 6)) / 14); o *= 1 - g; x = Math.min(x, XT + 8); z = 30.3 - 8 * g; }
      return { x, y, z, o, col: p.red ? COR : KRAFT, tape: p.red ? '#ffd6dd' : '#f3d9a8' };
    };

    // ---- base: plate on feet, corner screws, ruler, label plate ----
    [[-110, -70], [100, -70], [-110, 90], [100, 90]].forEach(([x, y]) => I.cyl({ x, y, z: -10, r: 7, h: 10, c: DARK, k: -400 }));
    I.box({ x: -125, y: -85, w: 240, d: 190, h: 12, r: 10, c: BASE, k: -300 });
    I.box({ x: -118, y: -78, w: 226, d: 176, h: .8, z: 12, r: 8, c: '#cfd9e2', lw: .6, k: -250 });
    [[-115, -75], [105, -75], [-115, 95], [105, 95]].forEach(([x, y]) => { I.dot({ x, y, z: 12.9, r: 2.4, c: STEEL }); I.dot({ x, y, z: 12.9, r: 1.1, c: DARK }); });
    I.ticks({ x: -100, y: 96, z: 12.9, len: 150, n: 30, axis: 'x' });
    I.box({ x: -112, y: 70, w: 44, d: 20, h: 3, z: 12, r: 3, c: NAVY }); I.dot({ x: -104, y: 80, z: 15.2, r: 2.4, c: CY }); I.dot({ x: -96, y: 80, z: 15.2, r: 2.4, c: SUN }); I.dot({ x: -88, y: 80, z: 15.2, r: 2.4, c: MINT });

    // ---- belt: segmented (so parcels sort correctly), side rails, rollers, posts, moving chevrons ----
    for (let k = 0; k < 7; k++) I.box({ x: X0 - 10 + k * 28, y: 0, w: 28.2, d: 28, h: 8, z: 22, c: BELT, lw: .5 });
    I.box({ x: X0 - 12, y: 28, w: 196, d: 3, h: 12, z: 22, c: STEEL });
    [X0 - 8, XT - 6].forEach((x) => I.cyl({ x, y: 14, z: 12, r: 10, h: 18, c: STEEL }));
    [-60, 0, 60].forEach((x) => { I.box({ x: x - 4, y: 31, w: 8, d: 6, h: 24, z: 12, c: STEEL }); I.dot({ x, y: 34, z: 36.4, r: 1.2, c: DARK }); });
    const chev = [];
    for (let i = 0; i < 9; i++) {
      const spec = (t) => { const u = ((i * 22 + Xc(tt(t)) * .9) % 198 + 198) % 198, x = X0 - 6 + u; if (x > XT - 16) return null;
        const on = t > 17.35 ? tw(t, 17.4, .3, 'glide') : 1;
        const near = items.some((p) => { const s = state(p, t); return s && s.o > .05 && s.y > 0 && Math.abs(s.x + 9 - x) < 17; }); if (near) return null;
        return { pts: [[x, 5, 30.2], [x + 6, 14, 30.2], [x, 23, 30.2]], c: '#6b7790', lw: 2, k: 14, o: clamp((x - X0) / 14) * on }; };
      chev.push(I.path(spec));
    }

    // ---- the origin tower at the far end, LEDs, cable ----
    I.box({ x: 88, y: -8, w: 24, d: 44, h: 74, z: 12, r: 3, c: '#1c2b4d' });
    I.box({ x: 86, y: -10, w: 28, d: 48, h: 7, z: 86, r: 3, c: STEEL });
    [[92, 1], [92, 13], [92, 25]].forEach(([x, y], i) => I.dot((t) => { const tn = tt(t), hot = tn < PEAK && (Math.sin(tn * 5 + i * 2.1) > .1); return { x: x + 3, y, z: 93.3, r: 2.6, c: tn < PEAK ? (hot ? COR : '#7a2c3d') : CY }; }));
    [[94, 30], [100, 30], [106, 30]].forEach(([x, y]) => I.dot({ x: x - 5, y: y - 4, z: 93.3, r: 1.2, c: DARK }));
    I.path({ pts: [[92, 36, 40], [92, 52, 18], [50, 70, 13.6], [-60, 70, 13.6]], c: '#12203c', lw: 2.2 });
    I.box({ x: 96, y: 40, w: 16, d: 14, h: 8, z: 12, r: 2, c: DARK });

    // ---- chutes: open-front bays with a colour stripe, a door that drops when the edge goes on ----
    CHUTES.forEach((ch, i) => {
      const x = ch.cx - 20;
      I.box({ x, y: -66, w: 40, d: 66, h: 2.5, z: 12, c: '#c9d3dd' });
      I.box({ x, y: -66, w: 40, d: 4, h: 40, z: 12, c: ch.c });
      I.box({ x, y: -66, w: 4, d: 66, h: 13, z: 12, c: ch.c }); I.box({ x: x + 36, y: -66, w: 4, d: 66, h: 13, z: 12, c: ch.c });
      I.box({ x: x + 4, y: -62, w: 32, d: 2, h: 6, z: 14.5, c: DARK, lw: .6 });
      I.dot((t) => ({ x: ch.cx, y: -64, z: 52.5, r: 3, c: tt(t) >= PEAK + .5 ? ch.c : '#8895a8' })); I.dot({ x: ch.cx, y: -64, z: 52.7, r: 1.2, c: NAVY });
      I.box((t) => { const o = open(t); return o > .98 ? null : { x: x + 4, y: -6, w: 32, d: 3, h: 22, z: 12 - 24 * o, c: DARK, o: 1 - clamp(o * 1.15) * .6 }; });   // the door drops into the floor
      I.box({ x: x + 5, y: -8, w: 5, d: 3, h: 24, z: 12, c: STEEL }); I.box({ x: x + 30, y: -8, w: 5, d: 3, h: 24, z: 12, c: STEEL });
    });
    // ---- pushers (one per chute, in front of the belt) and the red pusher at the back ----
    const hitOf = (dest) => (t) => { let best = null; const tn = tt(t); items.forEach((p) => { if (p.hit != null && p.dest === dest && t < 17.35 && tn >= p.hit - .35 && tn <= p.hit + 1.0) best = p.hit; }); return best; };
    CHUTES.forEach((ch, i) => {
      const hit = hitOf(i);
      const yP = (t) => { const th = hit(t); if (th == null) return 44; const tn = tt(t), a = tw(tn, th - .3, .26, 'glide'), pu = P.EASE.swing(clamp((tn - th) / .42)), back = tw(tn, th + .5, .4, 'swing');
        const fwd = lerp(44, 23.5, a); const pushed = lerp(fwd, -31.5, pu); return lerp(pushed, 44, back); };
      I.box({ x: ch.cx - 13, y: 56, w: 26, d: 14, h: 22, z: 12, r: 3, c: STEEL });
      I.box((t) => { const y = yP(t); return { x: ch.cx - 3, y: y + 4, w: 6, d: Math.max(2, 58 - y - 4), h: 5, z: 26, c: DARK, lw: .7 }; });
      I.box((t) => ({ x: ch.cx - 11, y: yP(t), w: 22, d: 4, h: 15, z: 24, r: 1.5, c: NAVY }));
      I.cyl({ x: ch.cx + 18, y: 62, z: 12, r: 3.4, h: 26, c: DARK }); I.coil({ x: ch.cx + 18, y: 62, z: 14, r: 6, h: 22, turns: 5, c: '#6b7b96', lw: 1.1 });
      I.dot({ x: ch.cx - 6, y: 57, z: 34.2, r: 1.5, c: ch.c });
    });
    {
      const hit = hitOf('bin');
      const yP = (t) => { const th = hit(t); if (th == null) return -40; const tn = tt(t), a = tw(tn, th - .3, .26, 'glide'), pu = P.EASE.swing(clamp((tn - th) / .42)), back = tw(tn, th + .5, .4, 'swing');
        return lerp(lerp(lerp(-40, -4.5, a), 41, pu), -40, back); };
      I.box({ x: BIN.cx - 13, y: -66, w: 26, d: 14, h: 22, z: 12, r: 3, c: STEEL });
      I.box((t) => { const y = yP(t); return { x: BIN.cx - 3, y: -54, w: 6, d: Math.max(2, y + 54), h: 5, z: 26, c: DARK, lw: .7 }; });
      I.box((t) => ({ x: BIN.cx - 11, y: yP(t) - 2, w: 22, d: 4, h: 15, z: 24, r: 1.5, c: COR }));
      I.cyl({ x: BIN.cx + 18, y: -62, z: 12, r: 3.4, h: 26, c: DARK });
    }
    // reject tray (open box in front of the belt's far end)
    I.box({ x: 52, y: 44, w: 52, d: 50, h: 3, z: 12, c: '#c93a55' });
    I.box({ x: 52, y: 44, w: 3, d: 50, h: 22, z: 12, c: COR }); I.box({ x: 101, y: 44, w: 3, d: 50, h: 22, z: 12, c: COR });
    I.box({ x: 52, y: 44, w: 52, d: 3, h: 6, z: 12, c: COR });
    // parcels (box + tape)
    items.forEach((p) => {
      I.box((t) => { const s = state(p, t); return s && s.o > .02 ? { x: s.x, y: s.y, z: s.z, w: 18, d: 18, h: 16, r: 2, c: s.col, o: s.o } : null; });
      I.box((t) => { const s = state(p, t); return s && s.o > .02 ? { x: s.x + 7, y: s.y, z: s.z + 15.6, w: 4, d: 18, h: .6, c: s.tape, lw: .4, o: s.o, k: 2 } : null; });
    });
    // impact rings where red parcels hit the tray and parcels land in a chute
    const ov = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); ov.setAttribute('viewBox', '0 0 402 715'); ov.style.cssText = 'position:absolute;inset:0;width:402px;height:715px;overflow:visible;pointer-events:none'; rig.appendChild(ov);
    const rings = items.filter((p) => p.hit != null).map((p) => { const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); c.setAttribute('fill', 'none'); c.setAttribute('stroke-width', '2.5'); ov.appendChild(c); return { p, c }; });
    P.on((t) => rings.forEach(({ p, c }) => { const tn = tt(t), u = (tn - (p.hit + .42)) / .6, on = t < 17.3 && u >= 0 && u < 1;
      const [sx, sy] = p.dest === 'bin' ? I.P(BIN.cx, 66, 36) : I.P(CHUTES[p.dest].cx, -64, 56);
      c.setAttribute('cx', sx.toFixed(1)); c.setAttribute('cy', sy.toFixed(1)); c.setAttribute('stroke', p.dest === 'bin' ? COR : CHUTES[p.dest].c);
      c.setAttribute('r', (6 + 20 * P.EASE.glide(clamp(u))).toFixed(1)); c.setAttribute('opacity', on ? (1 - P.EASE.snap(clamp(u))).toFixed(3) : '0'); }));

    // ---- type ----
    const H = (html, css2, parent = P.front) => E.el('div', `position:absolute;left:30px;right:30px;color:${NAVY};font:900 38px/.98 Archivo,sans-serif;font-variation-settings:"wdth" 82;letter-spacing:-.02em;opacity:0;${css2}`, parent, html);
    const veil = E.el('div', 'position:absolute;left:0;right:0;top:84px;height:150px;opacity:0;background:linear-gradient(#e6f5fb 55%,rgba(230,245,251,0))', P.front);
    const hook = H(`Why is your site<br><span style="color:${COR}">slow abroad?</span>`, 'top:104px');
    const timer = E.el('div', `position:absolute;left:30px;top:108px;opacity:0;font:700 12px/1 ${P.MONO};letter-spacing:.14em;text-transform:uppercase;color:${NAVY}`, P.front,
      `Shopper in Lagos<br><span id="tmv" style="display:block;margin-top:8px;font:900 64px/.9 Archivo,sans-serif;font-variation-settings:'wdth' 80;letter-spacing:-.01em;color:${COR};text-transform:none"></span>`);
    const tmv = timer.querySelector('#tmv');
    const quiet = H(`Now add<br><span style="color:${CY}">the edge.</span>`, 'top:118px;font-size:44px');
    const title = ['Fast', 'everywhere.'].map((w, i) => H(w, `top:${112 + i * 62}px;font-size:${i ? 54 : 66}px;color:${i ? NAVY : CY}`));
    P.front.appendChild(quiet);                                           // above the breath dim
    P.breath = [7.3, 8.4]; P.punchAt = PEAK;
    P.captions([
      [3.5, 5.3, 'One far-away server.', 27, { 1: COR }], [5.3, 7.2, 'Every shopper waits.', 27, { 2: COR }],
      [9.1, 10.7, 'Nearest copy.', 30, { 0: CY }], [10.7, 12.6, 'Bad traffic out.', 30, { 0: COR }],
      [15.5, 16.4, 'Edge setup, handled.', 26, { 0: CY }],
      [16.4, 16.95, 'Send this to a founder', 28], [16.95, 17.4, 'selling abroad.', 28, { 1: COR }],
    ], { style: 'blur' });
    P.signoff({ at: 15.4, out: 17.35 });

    S.u = (t, tf) => {
      const tn = tt(t);
      hook.style.opacity = (t < 3.0 ? (t < .001 ? 1 : 1 - tw(t, 2.75, .25, 'snap')) : sp(t, 17.5, 'fade')).toFixed(3);
      veil.style.opacity = hook.style.opacity;
      hook.style.transform = `translateY(${(t >= 17.5 ? (1 - sp(t, 17.5, 'default')) * 14 : 0).toFixed(1)}px)`;
      const tin = t < 3.4 ? 0 : t < 8.7 ? sp(t, 3.4, 'fade') * (1 - tw(t, 7.15, .2, 'snap')) : sp(t, 8.7, 'fade') * (1 - tw(t, 13.7, .2, 'snap'));
      timer.style.opacity = clamp(tin).toFixed(3);
      const sec = t < 7.2 ? clamp((t - 3.4) / 3.2) * 2.9 : 2.9;
      tmv.textContent = t >= PEAK + .05 ? '0.4 s' : sec.toFixed(1) + ' s';
      tmv.style.color = t >= PEAK + .05 ? CY : COR;
      quiet.style.opacity = (t < 7.4 || t > 8.5 ? 0 : sp(t, 7.4, 'fade') * (1 - tw(t, 8.32, .18, 'snap'))).toFixed(3);
      title.forEach((el, i) => { const t0 = 13.9 + i * .3, k = sp(t, t0); el.style.opacity = (t < t0 ? 0 : k * (1 - tw(t, 15.1, .2, 'snap'))).toFixed(3); el.style.transform = `translateY(${((1 - k) * 36).toFixed(1)}px) scale(${lerp(1.12, 1, k).toFixed(3)})`; });
    };
    S.cuts = [];
    S.name = 'Why is your site slow abroad?';
    return { ok: true };
  };

  S.update = function (E, t) { S.u(t, E.frame / 30); P.update(t); };
  S.cover = function () { E.frame = 0; S.update(E, 0); P.front.style.opacity = '0'; };
  S.cues = () => T.cues || [];
})();
