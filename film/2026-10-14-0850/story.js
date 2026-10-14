// FILM: "Is your website actually locked?" (service: security). Fourth cut of this slot, 14 Oct 2026, made with the new method (design/film-playbook.md "Design like
// the motion logo"): poster-first, ONE transforming idea, vector, no water (owner: Aquarii is only a name). The idea: a padlock. It pops open, attackers stream in
// through the gap, then it snaps shut and the site frame turns into a guarded border that bounces every attacker off while the security checklist ticks.
// Key frames (each a finished poster): 0.0 giant lock + hook | 4.5 the site swarmed by red cursors, pains tagged | 7.8 black, one line | 11.0 the violet frame,
// cursors bouncing, checks ticking | 14.8 LOCKED. WATCHED. HANDLED. + DM us. Every move on the easing toolkit (springs, swing, snap).
(function () {
  const E = window.FilmEngine, T = window.FILM_T, P = window.FilmParts, { clamp, lerp } = E, S = (E.story = {});
  S.selfStage = true;
  S.dna = {
    service: 'security',
    format: 'tutorial',                                                  // voice-over test (film/ID/voice.md)
    opening: 'a giant padlock under "Is your website actually locked?" pops its shackle open',
    bigMoment: 'the lock snaps shut and the site frame turns violet and bounces every attacker cursor off',
    ground: 'near black with violet, alarm red and a lime check',
    music: 'tense low pulse that resolves into a confident, clean beat at 100 BPM',
  };
  const css = P.css, NS = 'http://www.w3.org/2000/svg';
  const INK = '#0d0d12', VIO = '#8b7bff', RED = '#ff4d4d', LIME = '#c6ff3d', WHITE = '#f4f4f8';
  const sp = (t, t0, name = 'bold') => P.springAt(t, t0, name), tw = (t, t0, d, name = 'swing') => P.tween(t, t0, d, name);
  const life = (t, a, b, inName = 'fade', out = .2) => (t < a ? 0 : P.springAt(t, a, inName) * (1 - P.tween(t, b - out, out, 'snap')));

  S.setup = async function () {
    document.documentElement.classList.add('reel');
    await P.ready; await document.fonts.ready;
    const { world } = P.scene({ accent: VIO, ink: INK, glow: 'rgba(139,123,255,.10)' });
    P.use('opener', 'lock-pop'); P.use('transition', 'blackout-line'); P.use('mechanism', 'cursor-swarm'); P.use('payoff', 'guarded-frame'); P.use('type', 'slam-stack'); P.use('cta', 'dm-pill');

    const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 402 715'); svg.setAttribute('width', '402'); svg.setAttribute('height', '715');
    svg.style.cssText = 'position:absolute;inset:0;overflow:visible'; world.appendChild(svg);
    const mk = (tag, attrs, parent = svg) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; };

    // ---- the site frame (browser window) ----
    const FX = 30, FY = 118, FW = 342, FH = 470;
    const glow = mk('rect', { x: FX, y: FY, width: FW, height: FH, rx: 22, fill: 'none', stroke: VIO, 'stroke-width': 10, opacity: 0, filter: 'blur(6px)' });
    const frame = mk('rect', { x: FX, y: FY, width: FW, height: FH, rx: 22, fill: 'rgba(255,255,255,.025)', stroke: 'rgba(244,244,248,.55)', 'stroke-width': 2, pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1 });
    const barLine = mk('line', { x1: FX, y1: FY + 46, x2: FX + FW, y2: FY + 46, stroke: 'rgba(244,244,248,.25)', 'stroke-width': 1.5, opacity: 0 });
    const url = mk('text', { x: FX + 70, y: FY + 29, fill: 'rgba(244,244,248,.75)', 'font-family': "'Geist Mono', monospace", 'font-size': 13, opacity: 0 }); url.textContent = 'yourbusiness.com';
    const page = mk('g', { opacity: 0 });
    [[60, 200, 190, 18], [60, 230, 250, 10], [60, 248, 210, 10], [60, 290, 130, 34], [60, 350, 130, 90], [212, 350, 130, 90], [60, 460, 282, 10], [60, 478, 240, 10]].forEach(([x, y, w, h]) => mk('rect', { x, y, width: w, height: h, rx: 5, fill: 'rgba(244,244,248,.09)' }, page));

    // ---- the padlock (the one idea) ----
    const lock = mk('g', {});
    const lockGlow = mk('circle', { cx: 0, cy: 12, r: 70, fill: 'none', stroke: RED, 'stroke-width': 3, opacity: 0 }, lock);
    const shackle = mk('path', { d: 'M-24 -8 V-32 A24 24 0 0 1 24 -32 V-8', fill: 'none', stroke: WHITE, 'stroke-width': 11, 'stroke-linecap': 'round' }, lock);
    const body = mk('rect', { x: -38, y: -10, width: 76, height: 62, rx: 13, fill: WHITE }, lock);
    mk('path', { d: 'M0 8 a8 8 0 0 1 4 15 l2 14 h-12 l2 -14 a8 8 0 0 1 4 -15 z', fill: INK }, lock);

    // ---- attacker cursors (deterministic swarm) ----
    const CUR = 'M0 0 L0 22 L6 16 L10 26 L14 24 L10 14 L18 14 Z';
    let sd = 7; const rnd = () => { sd = (sd * 1664525 + 1013904223) >>> 0; return sd / 4294967296; };
    const swarm = Array.from({ length: 30 }, (_, i) => { const side = i % 3, sx = side === 0 ? -30 : side === 1 ? 432 : 40 + rnd() * 320, sy = side === 2 ? -40 : 140 + rnd() * 460;
      return { el: mk('path', { d: CUR, fill: RED, stroke: INK, 'stroke-width': 1.5, opacity: 0 }), t0: 3.4 + i * .12, sx, sy, ex: 70 + rnd() * 260, ey: 200 + rnd() * 330, rot: rnd() * 40 - 20 }; });
    const bounce = Array.from({ length: 22 }, (_, i) => { const ang = rnd() * Math.PI * 2, ex = 201 + Math.cos(ang) * 175, ey = 353 + Math.sin(ang) * 240;
      const cx = clamp(ex, FX, FX + FW), cy = clamp(ey, FY, FY + FH), sx = 201 + Math.cos(ang) * 420, sy = 353 + Math.sin(ang) * 520;
      return { el: mk('path', { d: CUR, fill: RED, stroke: INK, 'stroke-width': 1.5, opacity: 0 }), spark: mk('circle', { cx, cy, r: 4, fill: 'none', stroke: VIO, 'stroke-width': 2, opacity: 0 }), t0: 9.7 + i * .17, sx, sy, cx, cy, ang }; });

    // ---- HTML type ----
    const H = (html, css2) => E.el('div', `position:absolute;left:30px;right:30px;text-align:center;color:${WHITE};font:900 34px/1.02 Archivo,sans-serif;font-variation-settings:"wdth" 90;letter-spacing:-.01em;word-spacing:.08em;opacity:0;${css2}`, world, html);
    const hook = H(`Is your website<br><span style="color:${VIO}">actually locked?</span>`, 'top:118px;font-size:38px');
    const tags = [['Outdated plugin', 85, 300, 4.0], ['Weak password', 205, 245, 4.9], ['No backups', 95, 420, 5.8], ['Bot traffic', 215, 470, 6.7]].map(([txt, x, y, t0]) => {
      const el = E.el('div', `position:absolute;left:${x}px;top:${y}px;padding:6px 11px;border-radius:99px;background:${RED};color:#fff;font:800 13px/1 Archivo,sans-serif;white-space:nowrap;opacity:0;transform-origin:0 50%`, world, txt);
      return { el, t0 };
    });
    const quiet = H('One missed update<br>is enough.', 'top:300px;font-size:32px');
    P.front.appendChild(quiet);                                           // above the breath dim: it is the one bright thing in the dark
    const checks = [['Updates applied', 9.9], ['Backups taken', 10.5], ['Firewall on', 11.1], ['Uptime watched', 11.7]].map(([txt, t0], i) => {
      const el = E.el('div', `position:absolute;left:70px;top:${215 + i * 64}px;display:flex;align-items:center;gap:12px;color:${WHITE};font:800 22px/1 Archivo,sans-serif;opacity:0`, world,
        `<span style="display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:${LIME};color:#0b0d0f">${P.icon('check', 22)}</span>${txt}`);
      return { el, t0 };
    });
    const slam = ['Locked.', 'Watched.', 'Handled.'].map((w, i) => H(w, `top:${150 + i * 74}px;font-size:76px;line-height:1;color:${i === 2 ? LIME : WHITE}`));
    const dm = E.el('div', 'position:absolute;left:0;right:0;top:420px;display:flex;justify-content:center;opacity:0', world,
      `<div style="padding:13px 26px;border-radius:99px;background:${VIO};color:#0b0b12;font:900 22px/1 Archivo,sans-serif;letter-spacing:.02em">DM us</div>`);

    P.breath = [7.3, 8.35]; P.punchAt = 8.6;
    P.captions([
      [3.7, 5.4, 'Bots knock on every site.', 26, { 3: RED }], [5.4, 7.1, 'Every day.', 30, { 1: RED }],
      [15.5, 16.4, 'Website security, handled.', 26, { 2: VIO }],
      [16.4, 16.95, 'Send this to a founder', 28], [16.95, 17.4, 'who never checks.', 28, { 2: RED }],
    ], { style: 'pill' });
    P.signoff({ at: 15.4, out: 17.35, cta: '' });   // the DM us pill is right above: the sign-off is just the name

    S.u = (t, tf) => {
      // the lock: giant (P1) -> into the URL bar (P2) -> giant and shut (P4) -> back into the bar -> giant again for the loop
      const big = { x: 201, y: 370, s: 2.3 }, bar = { x: FX + 34, y: FY + 23, s: .26 };
      const k = clamp(sp(t, 2.75, 'default') - sp(t, 8.3, 'bold') + sp(t, 9.25, 'default') - sp(t, 17.35, 'default'), -.2, 1.2);
      const lx = lerp(big.x, bar.x, k), ly = lerp(big.y, bar.y, k), ls = lerp(big.s, bar.s, k);
      lock.setAttribute('transform', `translate(${lx.toFixed(2)} ${ly.toFixed(2)}) scale(${ls.toFixed(4)})`);
      const open = sp(t, 1.2) - sp(t, 8.55, 'bold');
      shackle.setAttribute('transform', `translate(24 -8) rotate(${(-32 * open).toFixed(2)}) translate(-24 8) translate(0 ${(-12 * open).toFixed(2)})`);
      body.setAttribute('fill', open > .5 && t < 8.6 ? '#ffd9d9' : WHITE);
      lockGlow.setAttribute('opacity', (Math.max(0, open) * (1 - tw(t, 2.5, .3, 'snap')) * .9).toFixed(3));
      lockGlow.setAttribute('r', (70 + 14 * Math.sin(tf * 6)).toFixed(1));
      lock.style.opacity = (t > 13.6 && t < 17.35 ? 1 - tw(t, 13.6, .25, 'snap') : 1).toFixed(3);
      hook.style.opacity = (t < 2.6 ? 1 - tw(t, 2.35, .25, 'snap') : sp(t, 17.5, 'fade')).toFixed(3);
      hook.style.transform = `translateY(${(t >= 17.5 ? (1 - sp(t, 17.5, 'default')) * 16 : 0).toFixed(1)}px)`;
      const fo = life(t, 2.8, 13.75, 'fade', .25), fd = tw(t, 2.8, .7);
      frame.setAttribute('stroke-dashoffset', (1 - fd).toFixed(4)); frame.style.opacity = fo.toFixed(3);
      const vio = sp(t, 9.3, 'default'); frame.setAttribute('stroke', vio > .5 ? VIO : 'rgba(244,244,248,.55)'); frame.setAttribute('stroke-width', (2 + 2 * vio).toFixed(2));
      glow.setAttribute('opacity', (vio * fo * (.55 + .2 * Math.sin(tf * 4))).toFixed(3));
      [barLine, url].forEach((e) => { e.setAttribute('opacity', life(t, 3.2, 13.75, 'fade', .25).toFixed(3)); });
      page.setAttribute('opacity', (life(t, 3.3, 13.75, 'fade', .25) * .9).toFixed(3));
      swarm.forEach((c) => { const u = tw(t, c.t0, .9, 'swing'), flee = tw(t, 8.6, .5, 'snap');
        const mx = (c.sx + c.ex) / 2 + 60, my = (c.sy + c.ey) / 2 - 50, x = (1 - u) * (1 - u) * c.sx + 2 * (1 - u) * u * mx + u * u * c.ex, y = (1 - u) * (1 - u) * c.sy + 2 * (1 - u) * u * my + u * u * c.ey;
        c.el.setAttribute('transform', `translate(${lerp(x, c.sx, flee).toFixed(1)} ${lerp(y, c.sy, flee).toFixed(1)}) rotate(${(c.rot + 6 * Math.sin(tf * 3 + c.t0 * 7)).toFixed(1)}) scale(.9)`);
        c.el.setAttribute('opacity', (t < c.t0 ? 0 : sp(t, c.t0, 'fade') * (1 - flee) * (t > 7.2 && t < 8.6 ? .35 : 1)).toFixed(3)); });
      bounce.forEach((c) => { const a = tw(t, c.t0, .45, 'snap'), b = tw(t, c.t0 + .45, .5, 'swing'), on = t >= c.t0 && t < c.t0 + 1 && t < 13.7;
        const x = b > 0 ? lerp(c.cx, c.sx, b) : lerp(c.sx, c.cx, a), y = b > 0 ? lerp(c.cy, c.sy, b) : lerp(c.sy, c.cy, a);
        c.el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(c.ang * 57.3 + 120 + 160 * b).toFixed(1)})`);
        c.el.setAttribute('opacity', on ? (sp(t, c.t0, 'fade') * (1 - b)).toFixed(3) : '0');
        const s = clamp((t - c.t0 - .45) / .4); c.spark.setAttribute('opacity', on && s > 0 && s < 1 ? (1 - P.EASE.snap(s)).toFixed(3) : '0'); c.spark.setAttribute('r', (4 + 18 * P.EASE.swing(s)).toFixed(1)); });
      tags.forEach(({ el, t0 }) => { const kk = sp(t, t0); css(el, { opacity: life(t, t0, 7.25, 'fade', .2).toFixed(3), transform: `scale(${lerp(.6, 1, kk).toFixed(3)})` }); });
      quiet.style.opacity = life(t, 7.45, 8.4, 'fade', .2).toFixed(3);
      checks.forEach(({ el, t0 }) => { const kk = sp(t, t0); css(el, { opacity: life(t, t0, 13.7, 'fade', .22).toFixed(3), transform: `translateX(${((1 - kk) * -24).toFixed(1)}px)` }); });
      slam.forEach((el, i) => { const t0 = 13.9 + i * .4, kk = sp(t, t0); css(el, { opacity: life(t, t0, 17.3, 'fade', .22).toFixed(3), transform: `translateY(${((1 - kk) * 40).toFixed(1)}px) scale(${lerp(1.15, 1, kk).toFixed(3)})` }); });
      { const kk = sp(t, 15.2); css(dm, { opacity: life(t, 15.2, 17.3, 'fade', .22).toFixed(3), transform: `scale(${lerp(.7, 1, kk).toFixed(3)})` }); }
    };
    S.cuts = [];
    S.name = 'Is your website actually locked?';
    return { ok: true };
  };

  S.update = function (E, t) { S.u(t, E.frame / 30); P.update(t); };
  S.cover = function () { E.frame = 0; S.update(E, 0); P.front.style.opacity = '0'; };
  S.cues = () => T.cues || [];
})();
