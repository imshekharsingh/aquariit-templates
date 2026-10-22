// STARTER (built on scripts/film/parts.js). Copy to film/ID/story.js, then REWRITE it around today's Aquarii service (design/services.md): the protagonist is
// Aquarii, the page below is only proof ("a site we designed"); the hook, captions and CTA ("DM us") sell our service, never the page's business.
// Originality: at most one part per reference reel (scripts/film/sources.json); prefer our own metaphor (P.vessel: the water bearer). Default it ships with:
// it already works on any template (it reads the page's name, accent, headline, features and call to action), but shipping it unchanged is not allowed
// (scripts/check.mjs refuses a film whose story.js equals this file). Worked example of a fully bespoke film: film/2026-10-13-1902/story.js ("After 8").
// The default arc (100 BPM, a beat every 0.6 s):
//   0-2.4   hook captions over the lit phone in the dark (the page's first screen)        -> REPLACE with the business's own opening image (shopfront, product, desk...)
//   2.4-5.4 the page scrolls on the phone; its headline builds as a sentence above it     -> keep the sentence, make the pivot word land
//   5.4-8.4 pull back to the system: hub + 3 nodes from the page's features, data flowing -> name the mechanism THIS business sells
//   8.4-10.2 phone returns, an iris opens on the offer section                             -> the focal proof
//   10.2-12 a sentence builds the promise; 12.0-12.45 breath; 12.6 a bloom with the answer captions
//   15.6-17 CTA card (business name + CTA); 17-18 everything returns to the frame-0 state (loop)
(function () {
  const E = window.FilmEngine, T = window.FILM_T, KIT = window.FILM_KIT || {}, P = window.FilmParts, { clamp, lerp, ease } = E, S = (E.story = {});
  S.selfStage = true;
  S.dna = { opening: 'EDIT: the opening image', bigMoment: 'EDIT: the big moment', ground: 'EDIT: black / deep colour / light', music: 'EDIT: feel + BPM' };
  const sm = P.sm, css = P.css, $$ = E.$$;
  const sat = (c) => { const m = (c.match(/[\d.]+/g) || [0, 0, 0]).map(Number), mx = Math.max(...m.slice(0, 3)), mn = Math.min(...m.slice(0, 3)); return mx ? (mx - mn) / mx : 0; };
  const lum = (c) => { const m = (c.match(/[\d.]+/g) || [0, 0, 0]).map(Number); return (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / 255; };
  const words = (s, n) => s.replace(/\s+/g, ' ').trim().split(' ').slice(0, n);
  const short = (s, max = 16) => { const w = s.replace(/\s+/g, ' ').trim().split(' '); let out = ''; for (const x of w) { if ((out + ' ' + x).trim().length > max) break; out = (out + ' ' + x).trim(); } return out || w[0].slice(0, max); };

  S.setup = async function () {
    document.documentElement.classList.add('reel');
    await P.ready; await document.fonts.ready;
    await new Promise((r) => setTimeout(r, 1500));                       // let the page's own load animations finish before cloning it
    // ---- read the page ----
    let accent = T.accent || ['--accent', '--acc', '--brand', '--primary', '--hot', '--a'].map((v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim()).find((v) => v && !/var\(|gradient/.test(v)) || '', best = accent ? 1 : 0;
    if (!accent) $$('a,button').forEach((e) => { const bg = getComputedStyle(e).backgroundColor; if (!bg || /rgba\(0, 0, 0, 0\)|transparent/.test(bg)) return; const v = sat(bg) * (lum(bg) > .15 ? 1 : .4); if (v > best) { best = v; accent = bg; } });
    if (!accent || best < .25) accent = '#c8ff3d';
    { const pr = E.el('div', `color:${accent}`, document.body); const c = getComputedStyle(pr).color; pr.remove(); if (sat(c) < .25) accent = '#c8ff3d'; }
    if (lum(accent) < .35) accent = `color-mix(in srgb, ${accent} 70%, #fff)`;       // the accent must glow on black
    const probe = E.el('div', `color:${accent}`, document.body); accent = getComputedStyle(probe).color; probe.remove();
    const hex = (c) => '#' + (c.match(/\d+/g) || [200, 255, 61]).slice(0, 3).map((n) => (+n).toString(16).padStart(2, '0')).join('');
    const A = hex(accent);
    const name = T.name || (document.title.split(/[—|·:-]/)[0] || 'Studio').trim();
    const h1 = (document.querySelector('h1') || {}).textContent || name;
    const hook = (T.hook || KIT.hook || h1).replace(/[?!.]+$/, '') + (/\?\s*$/.test(T.hook || KIT.hook || '') ? '?' : '');
    const feats = (T.features || $$('main h3').map((h) => h.textContent).filter((x) => x.trim().length > 2).slice(0, 3));
    while (feats.length < 3) feats.push(['Fast', 'Clear', 'Yours'][feats.length]);
    const ctaEl = $$('main a, main button').find((e) => hex(getComputedStyle(e).backgroundColor) === A) || $$('main a, main button')[0];
    const cta = T.cta || (ctaEl ? ctaEl.textContent.replace(/\s+/g, ' ').trim() : 'Get in touch');
    const mainEl = document.querySelector('main');

    // ---- stage ----
    const { world } = P.scene({ accent: A });
    // the phone shows a frozen clone of the real page (same document, so its CSS applies)
    const ph = (E.ph = P.phone(world, { x: 111, y: 104, w: 180, h: 352 }));   // the starter keeps a small phone so its pull-back fits; a real film should go big (fill the frame)
    const scrIn = (E.scrIn = E.el('div', 'position:absolute;left:0;top:0;width:402px;transform-origin:0 0', ph.screen));
    [...E.cam.children].filter((n) => /^(HEADER|MAIN|NAV)$/.test(n.tagName) || n.classList.contains('bar')).forEach((n) => scrIn.appendChild(n.cloneNode(true)));
    ph.screen.id = 'phScr';
    E.el('style', null, document.head, '#phScr *,#phScr *::before,#phScr *::after{animation:none!important;transition:none!important} #phScr .rv,#phScr [class*="reveal"]{opacity:1!important;transform:none!important} #phScr header,#phScr nav,#phScr .bar{position:relative!important}');
    E.pageH = scrIn.scrollHeight;
    const scale = (ph.w - 14) / 402;
    // an offer section to reveal with the scan: the section containing the CTA (else the last section)
    const secs = [...scrIn.querySelectorAll('main > section')];
    const ctaClone = ctaEl ? [...scrIn.querySelectorAll('main a, main button')].find((e) => e.textContent.replace(/\s+/g, ' ').trim() === cta) : null;
    const offer = (ctaClone && ctaClone.closest('section')) || secs[secs.length - 1] || secs[0];
    const offerY = offer ? offer.offsetTop : 0;
    E.offerTarget = ctaClone;

    // ---- the system ----
    const icons = ['calendar', 'chat', 'check', 'star', 'cart', 'bell', 'pin', 'clock', 'rupee'];
    const pickIcon = (s, i) => { const x = s.toLowerCase(); return /book|slot|date|day|calendar|schedule/.test(x) ? 'calendar' : /chat|whatsapp|message|support|talk/.test(x) ? 'chat' : /pay|price|₹|\$|fee|cost|deposit/.test(x) ? 'rupee' : /shop|cart|order|deliver/.test(x) ? 'cart' : /remind|alert|notif/.test(x) ? 'bell' : /map|visit|locat|where/.test(x) ? 'pin' : /fast|time|hour|minute|day/.test(x) ? 'clock' : icons[i % 3 + 2]; };
    P.hub(world, { cx: 201, cy: 290, from: { x: 201, y: 226 }, label: short(name.toUpperCase(), 12).replace(' ', '<br>'), at: 6.0, out: 8.4,
      nodes: feats.map((f, i) => ({ x: [91, 201, 311][i], y: 400, icon: pickIcon(f, i), label: short(f, 14), at: [6.6, 7.2, 7.8][i] })) });

    // ---- brackets on the CTA inside the phone, and on the CTA card ----
    // ---- sentence: the headline builds while the page scrolls (2.6-5.2); the promise builds in the night (10.3-11.9)
    const hw = words(h1, 7);
    E.promise = P.sentence(world, hw, { at: 10.4, per: .26, out: 15.3, y: 250, size: 26, weight: 700, accents: { [hw.length - 1]: A }, highlight: true });   // the promise builds while the phone is away and stays through the payoff
    // ---- payoff + clock-less HUD label ----
    P.bloom({ at: 12.6, out: 17.6 }); P.breath = [12.0, 12.45];   // our own payoff (the flood came from a reference reel: scripts/film/sources.json)
    E.cta = P.card(world, `left:41px;top:170px;width:320px;padding:20px 22px;border-radius:24px`,
      `<div style="font:500 9px/1 ${P.MONO};letter-spacing:.16em;opacity:.65">${name.toUpperCase()} · DEMO</div>
       <div style="font:900 30px/.98 Archivo,sans-serif;font-variation-settings:'wdth' 78;text-transform:uppercase;margin-top:12px">${words(h1, 6).join(' ')}</div>
       <div class="btn" style="display:inline-flex;align-items:center;gap:8px;margin-top:16px;padding:11px 16px;border-radius:99px;background:${A};color:#11180a;font:800 12px/1 Archivo,sans-serif;letter-spacing:.05em;text-transform:uppercase">${cta} <span aria-hidden="true">→</span></div>`);
    E.ctaRim = E.el('div', `position:absolute;left:41px;top:170px;width:320px;border-radius:24px;pointer-events:none;box-shadow:0 0 0 1px ${P.hexA(A, .55)},0 0 34px ${P.hexA(A, .25)}`, world);
    // ---- captions (the spine) ----
    const hk = words(hook, 9), chunks = []; for (let i = 0; i < hk.length; i += 3) chunks.push(hk.slice(i, i + 3).join(' '));
    const hookCaps = chunks.map((c, i) => { const d = 2.45 / chunks.length; return [i ? i * d : -0.1, (i + 1) * d - .05, c, 32, i === chunks.length - 1 ? { [c.split(' ').length - 1]: A } : {}]; });
    const nm = words(name, 3).join(' ');
    P.captions([
      ...hookCaps,
      [5.45, 6.55, 'Here is how.', 28, { 2: A }],
      [6.6, 7.2, short(feats[0], 18), 28, { 0: A }], [7.2, 7.8, short(feats[1], 18), 28, { 0: A }], [7.8, 8.5, short(feats[2], 18), 28, { 0: A }],
      [9.6, 10.4, words(cta, 3).join(' ') + '.', 30, { 0: A }],
      [13.0, 15.5, nm + '.', 34, { 0: A }],
      [15.8, 16.95, 'Your version next?', 26, { 1: A }],
    ]);
    // ---- the frozen page, measured for the scan + brackets ----
    E.scale = scale; E.offerY = offerY;
    E.ctaBox = ctaClone ? (() => { const r = P.rel(ctaClone, scrIn), s = scale; return { x: 7 + r.x * s, y: 7 + (r.y - offerY + 40) * s, w: r.w * s, h: r.h * s }; })() : null;
    // the scan reveals a second copy of the page parked at the offer section
    const off = (E.off = E.el('div', 'position:absolute;inset:0;overflow:hidden;background:#fff', ph.screen));
    const offIn = E.el('div', `position:absolute;left:0;top:0;width:402px;transform-origin:0 0;transform:scale(${scale}) translateY(${-(offerY - 40)}px)`, off);
    offIn.appendChild(scrIn.querySelector('main').cloneNode(true));
    P.iris(off, { at: 9.0, dur: .6, x: ph.cx, y: ph.cy });
    E.ph.halo.style.zIndex = 0;
    P.signoff({});
    S.A = A; S.name = name; S.h1 = h1;
    return { ok: true, accent: A, name, feats, cta };
  };

  S.update = function (E, t) {
    const ph = E.ph;
    // phone: lit at frame 0, scrolls 2.4-5.2, shrinks to the top of the system 5.4-6.0, returns 8.4-9.0, rests, leaves under the payoff, back at 17.2 (loop)
    const mini = sm(5.4, 6.0, t) * (1 - sm(8.4, 9.0, t)), away = sm(10.2, 10.7, t) * (1 - sm(17.0, 17.6, t));
    const py = -120 * mini + 40 * away, sc = lerp(1, .36, mini) * lerp(1, .92, away);
    css(ph.el, { opacity: (1 - away).toFixed(3), transform: `translateY(${py.toFixed(1)}px) scale(${sc.toFixed(4)})` });
    css(ph.halo, { opacity: ((1 - mini) * (1 - away)).toFixed(3), transform: `translateY(${py.toFixed(1)}px)` });
    const scroll = lerp(0, Math.min(E.pageH - 700, 900), sm(2.6, 5.2, t) * (1 - sm(17.0, 17.6, t)));
    E.scrIn.style.transform = `scale(${E.scale}) translateY(${(-scroll).toFixed(1)}px)`;
    // the promise card (CTA) in the morning
    const ck = ease.spring(clamp((t - 15.6) / .55)), co = clamp((t - 15.6) / .15) * (1 - sm(16.85, 17.15, t));
    css(E.cta, { opacity: co.toFixed(3), transform: `translateY(${((1 - ck) * 26).toFixed(1)}px) scale(${lerp(.94, 1, ck).toFixed(3)})` });
    css(E.ctaRim, { height: E.cta.offsetHeight + 'px', opacity: (co * (.6 + .4 * Math.sin(E.frame / 30 * 2.4))).toFixed(3), transform: E.cta.style.transform });
    P.update(t);
  };

  S.cover = function () {
    S.update(E, 1.0); E.frame = 7;
    P.front.style.opacity = '0';
    const hookTxt = ((T.hook || KIT.hook || S.h1) + '').replace(/\s+/g, ' ').trim();
    E.el('div', `position:absolute;left:30px;top:150px;width:342px;color:#fff;font:900 40px/.95 Archivo,sans-serif;font-variation-settings:"wdth" 80;letter-spacing:-.02em;text-transform:uppercase;text-shadow:0 0 24px ${P.hexA(S.A, .35)}`, E.scene, hookTxt);
    css(E.ph.el, { transform: 'translateY(150px) scale(.8)' }); css(E.ph.halo, { transform: 'translateY(150px)' });
  };
  S.cues = () => T.cues || [];
})();
