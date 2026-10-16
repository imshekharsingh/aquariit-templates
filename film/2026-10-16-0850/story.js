// FILM v5 (premium, rich), makeover: "Does your website look outdated?" (service: web, design + SEO). 16 Oct 2026. Same calm cinematic-tech look (design/brand/premium.md).
// Beats follow the voice lines (film/ID/voice.md):
// 0.0 hook type over a big dated site on a phone (tiled grey ground, rainbow marquee, hit counter) | 3.4 three coral flags land on it: dated, breaks on phones, hard to trust |
// 7.4 a search card: the old result sits at #7 under "bakery near me" | 10.7 breath | 11.2 MAKEOVER: a lime scan turns the old page into the new one, Modern / Fast / Found |
// 15.6 the search card again: the result climbs from #7 to #1 and restyles | 19.6 one site, three screens (desktop, tablet, phone reflow) | 23.5 brand ending.
(function () {
  const E = window.FilmEngine, P = window.FilmParts, { clamp, lerp } = E, S = (E.story = {});
  S.selfStage = true;
  S.dna = {
    service: 'web',
    format: 'makeover',
    opening: 'premium type over a dated 2000s-style website on a big phone: tiled grey ground, rainbow marquee, hit counter, "Does your website / look outdated?"',
    bigMoment: 'a lime scan sweeps down the phone and the dated page becomes a modern emerald-and-pink site, then the search result climbs from #7 to #1',
    ground: 'cinematic navy with soft blue light, a lime scan and one coral problem colour',
    music: 'warm ambient pads with a soft pulse lifting into a bright, confident beat at the makeover, about 90 BPM',
  };
  const B = P.BRAND, MONO = "'Geist Mono',ui-monospace,monospace", INK = '#070B16';
  const sp = (t, t0, n = 'default') => P.springAt(t, t0, n), tw = (t, t0, d, n = 'glide') => P.tween(t, t0, d, n), G_ = P.EASE.glide;
  const IN = (t, a, b, d = .5) => clamp((t - a) / d) * (1 - clamp((t - b) / d));

  S.setup = async function () {
    document.documentElement.classList.add('reel');
    await P.ready; await document.fonts.ready;
    await new Promise((r) => setTimeout(r, 2800));                          // let the page's own load animations finish before cloning it
    // the real page, frozen, is the "after" (cloned before the scene takes over)
    const pageNodes = [...document.body.children].filter((n) => /^(HEADER|MAIN)$/.test(n.tagName)).map((n) => n.cloneNode(true));
    const { world } = P.scene({ accent: B.lime, ink: INK, glow: 'rgba(60,100,230,.10)', len: 28 });
    // depth layer (premium.md "three layers"): a faint dot grid drifting slowly and a soft spotlight that follows the focus of each beat
    const grid = E.el('div', 'position:absolute;left:-80px;top:-80px;width:560px;height:880px;background-image:radial-gradient(rgba(150,175,255,.22) 1.1px,transparent 1.5px);background-size:22px 22px;-webkit-mask:radial-gradient(70% 60% at 50% 50%,#000,transparent);mask:radial-gradient(70% 60% at 50% 50%,#000,transparent)', world);
    const spot = E.el('div', 'position:absolute;left:-120px;top:0;width:640px;height:640px;border-radius:50%;background:radial-gradient(closest-side,rgba(70,110,255,.20),rgba(70,110,255,0))', world);
    world.prepend(spot); world.prepend(grid);
    const SPOT = [[0, 201, 430], [7.4, 201, 400], [11, 201, 470], [15.6, 201, 420], [19.6, 201, 380], [23.5, 201, 357]];
    P.on((t) => { grid.style.transform = `translate(${(-(t * 3.2) % 22).toFixed(1)}px,${(-(t * 5.5) % 22).toFixed(1)}px)`;
      let i = 0; while (i < SPOT.length - 2 && t > SPOT[i + 1][0]) i++; const a = SPOT[i], b = SPOT[i + 1], k = G_(clamp((t - a[0]) / Math.max(.01, b[0] - a[0])));
      spot.style.transform = `translate(${(lerp(a[1], b[1], k) - 201).toFixed(1)}px,${(lerp(a[2], b[2], k) - 320).toFixed(1)}px)`; grid.style.opacity = (t > 23.4 ? .25 : .7).toString(); });
    P.use('opener', 'dated-site-phone'); P.use('payoff', 'makeover-scan-bloom'); P.use('type', 'premium-minimal'); P.use('ground', 'deep-colour');

    // ---- the phone: old page underneath, the new page revealed by the scan ----
    const PW = 330, PH = 640, PX = 36, PY = 236;
    const ph = P.phone(world, { x: PX, y: PY, w: PW, h: PH });
    ph.el.style.background = 'linear-gradient(160deg,#cfd8f2,#5b6a96 45%,#1a2342)';
    const IW = PW - 14;
    const oldPg = E.el('div', `position:absolute;left:0;top:0;width:${IW}px;background:#c4c4c4 repeating-linear-gradient(45deg,#d6d6d6 0 6px,#bcbcbc 6px 12px);font-family:'Times New Roman',Times,serif;color:#000;padding:10px 10px 400px;box-sizing:border-box;transform-origin:0 0`, ph.screen,
      `<div style="text-align:center;font:700 25px/1.05 'Times New Roman',serif;color:#0000ee;text-decoration:underline">~* Welcome to Oventide Bakery!!! *~</div>
       <div style="margin:10px -10px 0;overflow:hidden;background:linear-gradient(90deg,#f00,#f90,#ff0,#0c0,#0cf,#00f,#90f);height:24px"><div class="mq" style="white-space:nowrap;font:700 15px/24px 'Courier New',monospace;color:#fff;text-shadow:1px 1px #000;display:inline-block">★ BEST BREAD IN TOWN ★ CALL NOW ★ BEST BREAD IN TOWN ★ CALL NOW ★ BEST BREAD IN TOWN ★ CALL NOW ★</div></div>
       <div style="display:flex;gap:10px;margin-top:12px"><div style="width:110px;height:84px;border:3px outset #888;background:repeating-conic-gradient(#e6c27a 0 25%,#b98a3c 0 50%) 0 0/8px 8px;display:grid;place-items:center;font:11px 'Courier New',monospace;color:#400">bread.jpg</div>
         <div style="font:13px/1.25 'Times New Roman',serif">Our bakery has been baking since the old days. <u style="color:#00e">Click here</u> to see our products. <u style="color:#00e">Click here</u> for the menu.</div></div>
       <div style="margin-top:10px;text-align:center;font:700 14px/1 'Courier New',monospace;color:#0f0;background:#000;padding:6px">VISITOR NO. 004521</div>
       <table style="margin-top:10px;width:100%;border:3px outset #999;font:12px/1.35 'Times New Roman',serif;background:#ddd"><tr><td>MON-FRI</td><td>8:00 - ???</td></tr><tr><td>SAT</td><td>call us</td></tr><tr><td>SUN</td><td>closed (maybe)</td></tr></table>
       <div style="margin:12px -10px 0;height:22px;background:repeating-linear-gradient(-45deg,#fc0 0 12px,#000 12px 24px);color:#000;font:700 12px/22px 'Courier New',monospace;text-align:center"><span style="background:#fc0;padding:0 8px">UNDER CONSTRUCTION</span></div>
       <div style="margin-top:12px;font:11px/1.3 'Times New Roman',serif">Best viewed at 800x600. Email us: bakery_oventide_1998@mail.example. <u style="color:#00e">Guestbook</u> | <u style="color:#00e">Links</u> | <u style="color:#00e">Sitemap</u></div>`);
    const mq = oldPg.querySelector('.mq');
    const newWrap = E.el('div', 'position:absolute;inset:0;overflow:hidden;background:#f4fff9', ph.screen);
    const newScale = IW / 402;
    const newPg = E.el('div', `position:absolute;left:0;top:0;width:402px;transform-origin:0 0;transform:scale(${newScale})`, newWrap);
    newPg.id = 'phNew'; pageNodes.forEach((n) => newPg.appendChild(n));
    E.el('style', null, document.head, '#phNew *,#phNew *::before,#phNew *::after{animation:none!important;transition:none!important} #phNew header,#phNew .bar{position:relative!important} #phNew .reel,#phNew .back{display:none}');
    P.scan(ph, newWrap, 11.6, 1.2); P.use('transition', 'scan-makeover');

    // ---- the search card (mechanism) ----
    P.serpClimb(world, { x: 30, y: 196, windows: [[7.4, 10.7], [15.6, 19.5]], climbAt: 16.5, from: 6, rowH: 50, others: ['Corner Loaf Co.', 'Daily Crumb', 'Flour & Fork', 'Crust House', 'Rye & Co.', 'Bun Lane'] });

    // ---- one site, three screens (19.6-23.3): desktop, tablet and phone re-flow the same blocks ----
    // the real bakery site at three widths (film/ID/assets/*.jpg, captured from templates/ID at 1280, 820 and 402 px), each scrolling inside its frame
    const A = '../../film/2026-10-16-0850/assets/';
    const dev = (img, x, y, w, h, rad, bez, iw) => { const el = E.el('div', `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${rad}px;padding:${bez}px;box-sizing:border-box;background:linear-gradient(160deg,#d9e2f7,#6f7fa6 40%,#1b2340);box-shadow:0 0 0 1px rgba(220,230,255,.35),0 30px 60px rgba(0,0,0,.55),0 0 50px rgba(80,120,255,.18);opacity:0`, P.front,
      `<div style="width:100%;height:100%;border-radius:${Math.max(3, rad - bez)}px;overflow:hidden;background:#f4fff9;position:relative"><img src="${A}${img}.jpg" alt="" style="position:absolute;left:0;top:0;width:100%;display:block"></div>`);
      return { el, img: el.querySelector('img'), h: h - 2 * bez }; };
    const dDesk = dev('desk', 30, 168, 342, 236, 12, 6), dTab = dev('tab', 30, 432, 186, 258, 18, 7), dPh = dev('phone', 236, 432, 136, 258, 24, 6);
    const stand = E.el('div', 'position:absolute;left:171px;top:404px;width:60px;height:14px;opacity:0;background:linear-gradient(#8e9bbd,#3a4566);clip-path:polygon(18% 0,82% 0,100% 100%,0 100%)', P.front);
    const labels = [];
    // ---- type ----
    const T = (html, css) => E.el('div', `position:absolute;left:30px;right:30px;text-align:center;color:${B.paper};font:800 40px/1.05 Archivo,sans-serif;font-variation-settings:"wdth" 96;letter-spacing:-.015em;opacity:0;${css}`, P.front, html);
    const h1 = T('Does your website', 'top:104px;font-size:34px'), h2 = T(`look <span style="color:${B.coral}">outdated?</span>`, 'top:144px;font-size:46px;white-space:nowrap');
    const j1 = T('Customers decide', 'top:100px;font-size:36px'), j2 = T(`<span style="color:${B.coral}">fast.</span>`, 'top:142px;font-size:56px');
    const s1 = T('Far below', 'top:104px;font-size:36px'), s2 = T(`the <span style="color:${B.coral}">competition.</span>`, 'top:146px;font-size:42px;white-space:nowrap');
    const m1 = T(`<span style="color:${B.lime}">Modern.</span>`, 'top:100px;font-size:50px');
    const m2 = T(`Fast. <span style="color:${B.lime}">Found.</span>`, 'top:100px;font-size:50px');
    const f1 = T('First in', 'top:90px;font-size:36px'), f2 = T(`<span style="color:${B.lime}">search.</span>`, 'top:128px;font-size:56px');
    const e1 = T('One site,', 'top:60px;font-size:36px'), e2 = T(`<span style="color:${B.lime}">every screen.</span>`, 'top:102px;font-size:44px;white-space:nowrap');
    // coral flags that land on the old page
    const flags = [['Looks dated', 3.6, 262, -4], ['Breaks on phones', 4.9, 400, 3], ['Hard to trust', 6.0, 536, -3]].map(([txt, t0, y, r]) => ({ t0, r, el: E.el('div',
      `position:absolute;left:${r < 0 ? 24 : 58}px;top:${y}px;display:flex;align-items:center;gap:9px;padding:11px 16px;border-radius:14px;background:rgba(255,90,79,.96);color:#fff;font:800 19px/1 Archivo,sans-serif;box-shadow:0 14px 34px rgba(0,0,0,.4);opacity:0`, P.front,
      `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"><path d="M3 3l10 10M13 3L3 13"/></svg>${txt}`) }));
    const chips = [['Modern', 12.6], ['Fast', 13.1], ['Found', 13.6]].map(([txt, t0], i) => ({ t0, i, el: E.el('div',
      `position:absolute;left:${[44, 154, 238][i]}px;top:192px;padding:10px 16px;border-radius:99px;background:rgba(10,14,23,.9);border:1.5px solid ${B.lime};color:${B.lime};font:800 17px/1 Archivo,sans-serif;box-shadow:0 0 18px rgba(198,244,50,.35);opacity:0`, P.front, txt) }));
    const warm = E.el('div', 'position:absolute;inset:-80px;background:radial-gradient(70% 55% at 50% 52%,rgba(255,110,90,.22),rgba(255,110,90,.05) 60%,rgba(0,0,0,0));opacity:0', world);
    const nob = E.el('div', `position:absolute;left:50%;top:516px;margin-left:-125px;width:250px;text-align:center;padding:11px 0;border-radius:99px;background:rgba(255,90,79,.96);color:#fff;font:800 17px/1 Archivo,sans-serif;box-shadow:0 12px 30px rgba(0,0,0,.4);opacity:0`, P.front, 'Nobody scrolls this far.');
    P.bloom({ at: 13.5, out: 15.4, colour: B.lime });

    P.on((t) => {
      // old phone: present 0-7.4 (hook + flags), leaves for the search card, returns for the makeover (11.2-15.6), leaves again
      const away1 = tw(t, 7.2, .5, 'snap'), back = tw(t, 11.0, .7), away2 = tw(t, 15.4, .5, 'snap');
      const present = t < 7.2 ? 1 : (t >= 11.0 && t < 15.5 ? back : 0), out = (t >= 7.2 && t < 11.0) ? away1 : (t >= 15.4 ? away2 : 0);
      const vis = t < 7.2 ? 1 - 0 : (t < 11.0 ? 1 - away1 : (t < 15.4 ? back : 1 - away2));
      const ky = t < 7.2 ? 0 : (t < 11.0 ? away1 * 70 : (t < 15.4 ? (1 - back) * 70 : away2 * 70));
      const k0 = Math.max(.7, tw(t, 0, .8)), kk = t < 1 ? k0 : 1;
      ph.el.style.opacity = (Math.max(0, vis) * kk).toFixed(3); ph.halo.style.opacity = (Math.max(0, vis) * .8).toFixed(3);
      const bob = 5 * Math.sin(t * 1.2), grow = t < 3.2 ? 1 + .035 * G_(clamp(t / 3.2)) : 1;
      ph.el.style.transform = `translateY(${(ky + bob + (1 - kk) * 30).toFixed(1)}px) scale(${(grow * (t >= 11 && t < 15.4 ? 1 + .045 * G_(clamp((t - 13.5) / 1.9)) : 1)).toFixed(4)})`;
      ph.halo.style.transform = `translateY(${ky.toFixed(1)}px)`;
      // the dated page scrolls slowly; the new page scrolls after the scan
      oldPg.style.transform = `translateY(${(t < 11 ? -Math.min(Math.max(0, t - 1.2), 6) * 26 : -40).toFixed(1)}px)`;   // stops when it leaves; back near the top for the makeover
      newPg.style.transform = `scale(${newScale}) translateY(${(-(Math.max(0, t - 13.6) * 95)).toFixed(1)}px)`;
      mq.style.transform = `translateX(${(-((t * 90) % 360)).toFixed(1)}px)`;
      // hook
      [[h1, 0], [h2, .3]].forEach(([el, a]) => { const k = a ? tw(t, a, .9) : Math.max(.6, tw(t, a, .9)); el.style.opacity = (k * IN(t, -1, 3.2, .4)).toFixed(3); el.style.transform = `translateY(${((1 - k) * 12).toFixed(1)}px)`; });
      [[j1, 3.4], [j2, 3.7]].forEach(([el, a]) => { const k = tw(t, a, .9); el.style.opacity = (k * IN(t, 3.2, 7.2, .4)).toFixed(3); el.style.transform = `translateY(${((1 - k) * 12).toFixed(1)}px)`; });
      flags.forEach((f) => { const k = sp(t, f.t0, 'bold'); f.el.style.opacity = (G_(clamp(k * 1.6)) * IN(t, 3.2, 7.2, .35)).toFixed(3); f.el.style.transform = `translateY(${((1 - k) * 24).toFixed(1)}px) rotate(${(f.r * k).toFixed(2)}deg) scale(${(.85 + .15 * k).toFixed(3)})`; });
      // search beat
      warm.style.opacity = (G_(clamp((t - 7.6) / 1.4)) * IN(t, -1, 10.7, .4)).toFixed(3);
      [[s1, 7.6], [s2, 7.9]].forEach(([el, a]) => { const k = tw(t, a, .9); el.style.opacity = (k * IN(t, -1, 10.7, .4)).toFixed(3); el.style.transform = `translateY(${((1 - k) * 12).toFixed(1)}px)`; });
      { const k = sp(t, 9.1, 'bold'); nob.style.opacity = (G_(clamp(k * 1.6)) * IN(t, 9.0, 10.7, .35)).toFixed(3); nob.style.transform = `translateY(${((1 - k) * 18).toFixed(1)}px)`; }
      // makeover type
      const km = tw(t, 11.5, .8); m1.style.opacity = (km * IN(t, -1, 12.6, .3)).toFixed(3); m1.style.transform = `translateY(${((1 - km) * 12).toFixed(1)}px)`;
      const km2 = tw(t, 12.9, .8); m2.style.opacity = (km2 * IN(t, -1, 15.4, .4)).toFixed(3); m2.style.transform = `translateY(${((1 - km2) * 12).toFixed(1)}px)`;
      chips.forEach((c) => { const k = sp(t, c.t0, 'bold'); c.el.style.opacity = (G_(clamp(k * 1.6)) * IN(t, 12.4, 15.3, .35)).toFixed(3); c.el.style.transform = `translateY(${((1 - k) * 20).toFixed(1)}px)`; });
      // climb type
      [[f1, 15.8], [f2, 16.1]].forEach(([el, a]) => { const k = tw(t, a, .9); el.style.opacity = (k * IN(t, -1, 19.5, .4)).toFixed(3); el.style.transform = `translateY(${((1 - k) * 12).toFixed(1)}px)`; });
      // three screens
      [[dDesk, 19.7], [dTab, 20.2], [dPh, 20.6]].forEach(([d, a]) => { const k = sp(t, a, 'bold'); d.el.style.opacity = (G_(clamp(k * 1.6)) * IN(t, 19.6, 23.3, .4)).toFixed(3); d.el.style.transform = `translateY(${((1 - k) * 46).toFixed(1)}px) scale(${(.92 + .08 * k).toFixed(3)})`;
        const ih = d.img.offsetHeight || 0; d.img.style.transform = `translateY(${(-Math.max(0, ih - d.h) * .55 * G_(clamp((t - a - .5) / 2.6))).toFixed(1)}px)`; });
      stand.style.opacity = (G_(clamp(sp(t, 19.7, 'bold') * 1.6)) * IN(t, 19.6, 23.3, .4)).toFixed(3);
      [[e1, 19.7], [e2, 20.0]].forEach(([el, a]) => { const k = tw(t, a, .9); el.style.opacity = (k * IN(t, -1, 23.3, .4)).toFixed(3); el.style.transform = `translateY(${((1 - k) * 12).toFixed(1)}px)`; });
    });
    P.brandEnd({ at: 23.5, keyword: 'SITE', why: 'Does your website feel outdated?', out: 27.8 });
    S.name = 'Makeover premium v5';
    return { ok: true };
  };
  S.update = function (E, t) { P.update(t); };
  S.cues = () => [];
})();
