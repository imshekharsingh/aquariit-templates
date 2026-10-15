// FILM v2: "Why is your site slow abroad?" (service: edge). 15 Oct 2026, the first film on the owner's reel recipe (design/aligned-plan.md):
// 10 shots in 18 s with a hard cut every 1.6-2.3 s, a full-width hook from frame 0, one visible change per shot, payoff at 13.8 s, the brand ending, AI voice (voice.md).
// Shots: 1 hook card (SLOW fills the width, spinner) | 2 phone close-up, loading bar crawls, timer climbs | 3 route: London shopper -> one server in Mumbai, the request
// crawls 7,200 km | 4 type card "Each second, people leave." | 5 breath: black, "Now add the edge." | 6 route: edge nodes drop in, the request hops to the nearest one |
// 7 phone close-up, page snaps in, 0.4 s | 8 shield ring around the edge node bounces bots | 9 payoff: 2.8 s collapses into a giant 0.4 s | 10 brand ending, DM us "FAST".
(function () {
  const E = window.FilmEngine, P = window.FilmParts, { clamp, lerp } = E, S = (E.story = {});
  S.selfStage = true;
  S.dna = {
    service: 'edge',
    format: 'problem-fix',
    opening: 'full-width SLOW in coral under a spinning loader on ink, "Why is your site slow abroad?"',
    bigMoment: 'edge nodes drop onto the route and the request hops to the nearest one, then 2.8 s collapses into a giant 0.4 s',
    ground: 'brand ink with blue, lime and coral',
    music: 'tight ticking pulse that opens into a confident 100 BPM groove when the edge drops in',
  };
  const B = P.BRAND, MONO = "'Geist Mono',ui-monospace,monospace";
  const sp = (t, t0, n = 'bold') => P.springAt(t, t0, n), tw = (t, t0, d, n = 'swing') => P.tween(t, t0, d, n);
  // shot windows (hard cuts)
  const SH = [[-1, 1.8], [1.8, 3.6], [3.6, 5.6], [5.6, 7.3], [7.3, 8.45], [8.45, 10.2], [10.2, 12.0], [12.0, 13.8], [13.8, 16.1]];

  S.setup = async function () {
    document.documentElement.classList.add('reel');
    await P.ready; await document.fonts.ready;
    const { world } = P.scene({ accent: B.blue, ink: B.ink, glow: 'rgba(47,107,255,.16)' });
    P.use('opener', 'slow-hook-card'); P.use('transition', 'hard-cuts'); P.use('mechanism', 'edge-route'); P.use('payoff', 'number-collapse'); P.use('type', 'full-width-card');
    // each shot is a layer shown only inside its window, with a slow push-in so no framing is ever held still
    const shot = (i, push = .05) => { const el = E.el('div', 'position:absolute;inset:0;opacity:0;transform-origin:50% 45%', world);
      P.on((t) => { const [a, b] = SH[i], on = t >= a && t < b; el.style.opacity = on ? '1' : '0'; if (on) el.style.transform = `scale(${(1 + push * clamp((t - a) / (b - a))).toFixed(4)})`; }); return el; };
    const txt = (parent, html, css) => E.el('div', `position:absolute;left:30px;right:30px;text-align:center;color:${B.paper};font:900 40px/1 Archivo,sans-serif;font-variation-settings:"wdth" 92;letter-spacing:-.01em;word-spacing:.06em;${css}`, parent, html);
    const timer = (parent, css) => E.el('div', `position:absolute;left:30px;font:700 64px/1 ${MONO};letter-spacing:-.04em;${css}`, parent);

    // 1 hook card
    const s1 = shot(0, .04);
    const spin = E.el('div', `position:absolute;left:171px;top:118px;width:60px;height:60px;border-radius:50%;border:7px solid rgba(243,245,248,.15);border-top-color:${B.coral}`, s1);
    const h1 = txt(s1, 'Why is your site', 'top:212px;font-size:40px'), h2 = txt(s1, 'SLOW', `top:272px;font-size:112px;line-height:.9;color:${B.coral};font-variation-settings:"wdth" 96;white-space:nowrap`), h3 = txt(s1, 'abroad?', 'top:404px;font-size:46px');
    P.on((t) => { spin.style.transform = `rotate(${(t * 520).toFixed(0)}deg)`;
      [[h1, -.2], [h2, -.05], [h3, .12]].forEach(([el, a]) => { const k = sp(t, a); el.style.opacity = clamp(k * 1.4).toFixed(3); el.style.transform = `translateY(${((1 - k) * 26).toFixed(1)}px) scale(${lerp(.92, 1, k).toFixed(3)})`; }); });

    // phone close-up (shots 2 and 7 share the drawing)
    const phone = (parent, fast) => {
      const ph = E.el('div', `position:absolute;left:46px;top:150px;width:310px;height:640px;border-radius:42px;background:#121826;box-shadow:0 0 0 3px #2a3247,0 30px 60px rgba(0,0,0,.5);overflow:hidden`, parent);
      E.el('div', `position:absolute;left:18px;right:18px;top:20px;height:34px;border-radius:17px;background:#1c2436;color:${B.slate};font:500 13px/34px ${MONO};padding-left:16px`, ph, 'yourstore.in');
      const bar = E.el('div', `position:absolute;left:18px;top:62px;height:4px;border-radius:2px;background:${fast ? B.lime : B.coral};width:0`, ph);
      const blocks = [[18, 86, 274, 150], [18, 250, 130, 110], [162, 250, 130, 110], [18, 374, 274, 26], [18, 410, 200, 26]].map(([x, y, w, h], i) =>
        E.el('div', `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:14px;background:${fast ? (i === 0 ? B.blue : i < 3 ? '#26314a' : '#2b3550') : '#1a2132'}`, ph));
      return { ph, bar, blocks };
    };
    const s2 = shot(1, .06), p2 = phone(s2, false), t2 = timer(s2, `top:58px;color:${B.coral}`);
    E.el('div', `position:absolute;left:30px;top:128px;font:700 13px ${MONO};letter-spacing:.2em;color:${B.slate}`, s2, 'SHOPPER IN LONDON');
    P.on((t) => { const u = clamp((t - 1.8) / 1.8); p2.bar.style.width = (274 * u * .35).toFixed(0) + 'px'; t2.textContent = (u * 1.8).toFixed(1) + ' s';
      p2.blocks.forEach((b, i) => { b.style.opacity = (.45 + .35 * Math.sin(t * 6 + i)).toFixed(3); }); });

    // route shots (3 and 6): London shopper (left) to one server in Mumbai (right), drawn as a long arc
    const route = (parent, edge) => {
      const box = E.el('div', 'position:absolute;inset:0', parent);
      box.innerHTML = `<svg viewBox="0 0 402 715" width="402" height="715" style="position:absolute;inset:0" aria-hidden="true">
        <path class="arc" d="M70 420 Q201 120 332 420" fill="none" stroke="rgba(243,245,248,.22)" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round"/>
        <circle cx="70" cy="420" r="14" fill="${B.paper}"/><circle cx="332" cy="420" r="16" fill="${B.coral}"/><circle class="pk" r="9" fill="${edge ? B.lime : B.coral}"/>
        ${edge ? `<g class="nodes"></g><path class="hop" fill="none" stroke="${B.lime}" stroke-width="4" stroke-linecap="round"/>` : ''}</svg>`;
      E.el('div', `position:absolute;left:30px;top:446px;font:700 15px ${MONO};color:${B.paper}`, box, 'Shopper<br><span style="color:' + B.slate + '">London</span>');
      E.el('div', `position:absolute;right:30px;top:446px;text-align:right;font:700 15px ${MONO};color:${B.coral}`, box, 'Server<br><span style="color:' + B.slate + '">Mumbai</span>');
      const label = E.el('div', `position:absolute;left:0;right:0;top:150px;text-align:center;font:900 30px Archivo,sans-serif;color:${edge ? B.lime : B.paper}`, box, edge ? 'Edge: 20 km away' : '7,200 km, every click');
      return { svg: box.querySelector('svg'), pk: box.querySelector('.pk'), label };
    };
    const qb = (u) => { const x = (1 - u) * (1 - u) * 70 + 2 * (1 - u) * u * 201 + u * u * 332, y = (1 - u) * (1 - u) * 420 + 2 * (1 - u) * u * 120 + u * u * 420; return [x, y]; };
    const s3 = shot(2, .05), r3 = route(s3, false), t3 = timer(s3, `top:58px;font-size:40px;color:${B.coral}`);
    P.on((t) => { const u = clamp((t - 3.7) / 1.8), [x, y] = qb(P.EASE.swing(u)); r3.pk.setAttribute('cx', x.toFixed(1)); r3.pk.setAttribute('cy', y.toFixed(1)); t3.textContent = (1.8 + u).toFixed(1) + ' s'; });

    // 4 type card
    const s4 = shot(3, .05);
    const c1 = txt(s4, 'Each second,', 'top:228px;font-size:46px;white-space:nowrap'), c2 = txt(s4, 'people leave.', `top:284px;font-size:47px;color:${B.coral};white-space:nowrap`), c3 = timer(s4, `left:0;right:0;text-align:center;top:384px;font-size:44px;color:${B.slate}`);
    c3.textContent = '2.8 s';
    P.on((t) => { [[c1, 5.6], [c2, 5.8], [c3, 6.1]].forEach(([el, a]) => { const k = sp(t, a); el.style.opacity = clamp(k * 1.3).toFixed(3); el.style.transform = `translateX(${((1 - k) * -40).toFixed(1)}px)`; }); });

    // 5 breath
    const s5 = shot(4, .02); s5.style.background = '#000';
    const bl = txt(s5, 'Now add <span style="color:' + B.blue + '">the edge.</span>', 'top:300px;font-size:44px');
    P.on((t) => { bl.style.opacity = P.springAt(t, 7.6, 'fade').toFixed(3); });

    // 6 route with edge nodes: nodes drop in on the impact, the request hops to the nearest one and back
    const s6 = shot(5, .06), r6 = route(s6, true), nodesG = r6.svg.querySelector('.nodes'), hop = r6.svg.querySelector('.hop');
    const NODES = [[104, 372], [178, 300], [250, 256], [300, 340], [140, 470]];
    NODES.forEach(() => { const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); c.setAttribute('r', '11'); c.setAttribute('fill', B.blue); c.setAttribute('stroke', B.paper); c.setAttribute('stroke-width', '3'); nodesG.appendChild(c); });
    P.on((t) => { [...nodesG.children].forEach((c, i) => { const k = sp(t, 8.55 + i * .07); c.setAttribute('cx', NODES[i][0]); c.setAttribute('cy', (NODES[i][1] - (1 - k) * 60).toFixed(1)); c.setAttribute('opacity', clamp(k * 1.5).toFixed(2)); });
      const u = ((t - 9.0) % .7 + .7) % .7 / .7, go = t > 9.0, a = [70, 420], b = NODES[0], f = u < .5 ? u * 2 : 2 - u * 2;
      r6.pk.setAttribute('cx', go ? lerp(a[0], b[0], P.EASE.swing(f)).toFixed(1) : a[0]); r6.pk.setAttribute('cy', go ? lerp(a[1], b[1], P.EASE.swing(f)).toFixed(1) : a[1]);
      hop.setAttribute('d', `M70 420 L${b[0]} ${b[1]}`); hop.setAttribute('opacity', go ? '.9' : '0'); r6.label.style.opacity = sp(t, 9.1).toFixed(3); });

    // 7 phone: the page snaps in, 0.4 s
    const s7 = shot(6, .06), p7 = phone(s7, true), t7 = timer(s7, `top:58px;color:${B.lime}`);
    P.on((t) => { const u = clamp((t - 10.25) / .4); p7.bar.style.width = (274 * u).toFixed(0) + 'px'; t7.textContent = (u * .4).toFixed(1) + ' s';
      p7.blocks.forEach((b, i) => { const k = sp(t, 10.3 + i * .08); b.style.opacity = clamp(k * 1.4).toFixed(3); b.style.transform = `translateY(${((1 - k) * 22).toFixed(1)}px)`; }); });

    // 8 shield: a ring around the edge node, bots fly in and bounce off
    const s8 = shot(7, .05);
    s8.innerHTML = `<svg viewBox="0 0 402 715" width="402" height="715" style="position:absolute;inset:0" aria-hidden="true"><circle cx="201" cy="330" r="36" fill="${B.blue}"/>
      <circle class="ring" cx="201" cy="330" r="96" fill="none" stroke="${B.blue}" stroke-width="5"/><g class="bots"></g></svg>`;
    const ring = s8.querySelector('.ring'), bots = s8.querySelector('.bots');
    const BOTS = Array.from({ length: 9 }, (_, i) => { const a = i / 9 * Math.PI * 2 + .3; return { a, t0: 12.05 + (i % 5) * .22 }; });
    BOTS.forEach(() => { const c = document.createElementNS('http://www.w3.org/2000/svg', 'rect'); c.setAttribute('width', '14'); c.setAttribute('height', '14'); c.setAttribute('rx', '3'); c.setAttribute('fill', B.coral); bots.appendChild(c); });
    E.el('div', `position:absolute;left:0;right:0;top:150px;text-align:center;font:900 32px Archivo,sans-serif;color:${B.paper}`, s8, 'Bad bots <span style="color:' + B.coral + '">stay out.</span>');
    P.on((t) => { ring.setAttribute('stroke-width', (5 + 4 * Math.max(0, Math.sin(t * 9))).toFixed(1));
      [...bots.children].forEach((c, i) => { const bt = BOTS[i], u = (t - bt.t0) / .9, d = u < .5 ? lerp(260, 106, P.EASE.glide(u * 2)) : lerp(106, 300, P.EASE.snap((u - .5) * 2));
        const x = 201 + Math.cos(bt.a) * d, y = 330 + Math.sin(bt.a) * d; c.setAttribute('x', (x - 7).toFixed(1)); c.setAttribute('y', (y - 7).toFixed(1)); c.setAttribute('opacity', u > 0 && u < 1 ? '1' : '0'); }); });

    // 9 payoff: 2.8 s strikes through and collapses, 0.4 s fills the width
    const s9 = shot(8, .04);
    const old = timer(s9, `left:0;right:0;text-align:center;top:190px;font-size:70px;color:${B.coral}`); old.textContent = '2.8 s';
    const strike = E.el('div', `position:absolute;left:96px;top:226px;height:6px;width:0;background:${B.paper};border-radius:3px`, s9);
    const nu = timer(s9, `left:0;right:0;text-align:center;top:280px;font-size:148px;color:${B.lime}`); nu.textContent = '0.4s';
    const tag = txt(s9, 'Fast everywhere.<br><span style="color:' + B.blue + '">Protected everywhere.</span>', 'top:460px;font-size:32px;line-height:1.15');
    P.on((t) => { strike.style.width = (210 * P.EASE.glide(clamp((t - 14.0) / .35))).toFixed(0) + 'px';
      const ko = tw(t, 14.4, .3, 'snap'); old.style.opacity = (1 - ko * .6).toFixed(3); old.style.transform = `scale(${lerp(1, .8, ko).toFixed(3)})`;
      const k = sp(t, 14.25, 'bold'); nu.style.opacity = clamp(k * 1.5).toFixed(3); nu.style.transform = `scale(${lerp(.5, 1, k).toFixed(3)})`;
      const k2 = sp(t, 14.8); tag.style.opacity = clamp(k2 * 1.4).toFixed(3); tag.style.transform = `translateY(${((1 - k2) * 20).toFixed(1)}px)`; });

    // spoken-line captions on the shots without big type (the voice says the same words)
    P.captions([[1.9, 3.5, 'One far-away server.', 26, { 2: B.coral }], [3.7, 5.5, 'Every click travels.', 26, { 2: B.coral }],
      [10.3, 11.9, 'Close to every shopper.', 26, { 3: B.lime }]], { style: 'pill' });
    // 10 brand ending
    P.brandEnd({ at: 16.1, keyword: 'FAST' });
    S.name = 'Kitebox edge v2';
    return { ok: true };
  };
  S.update = function (E, t) { P.update(t); };
  S.cues = () => [];
})();
