// FILM, theme D sitescroll (design/themes.md; reference R3): "Your landing page could look like this." (service: studio). 16 Oct 2026.
// Our own template (Quillmint) scrolled at full frame under one pinned caption band, the way a screen recording shows a site, but deterministic.
// 0.0 hook over the hero (silk-light ribbon) | 3.2 the hero's flow panel, then the glass bento | 7.2 numbers and isometric bars |
// 10.8 breath | 11.3 BIG MOMENT: the full-bleed view pulls back into a phone with a bezel and keeps scrolling to the plans and the closing card | 16.6 brand ending.
(function () {
  const E = window.FilmEngine, P = window.FilmParts, { clamp } = E, S = (E.story = {});
  S.selfStage = true;
  S.dna = {
    service: 'studio',
    theme: 'sitescroll',
    format: 'site showcase',
    opening: 'a dark SaaS landing page with a silk-light ribbon fills the frame under a pinned caption band: "Your landing page could look like this."',
    bigMoment: 'the full-bleed page pulls back into a phone with a bezel at the breath and keeps scrolling to its plans and closing card',
    ground: 'near-black with a solar-orange and teal silk light, the template\'s own palette',
    music: 'sleek minimal electronic, soft kick entering at the pull-back, about 96 BPM',
  };
  const INK = '#06070b', SUN = '#ff6a1a';
  const IN = (t, a, b, d = .4) => clamp((t - a) / d) * (1 - clamp((t - b) / d));
  S.setup = async function () {
    document.documentElement.classList.add('reel');
    await P.ready; await document.fonts.ready;
    const { world } = P.scene({ accent: SUN, ink: INK, glow: 'rgba(255,106,26,.10)', len: 20 });
    P.use('type', 'editorial-serif-mix'); P.use('opener', 'site-fullbleed-hook');
    // depth behind the phone once it pulls back: a soft orange and teal light
    const halo = E.el('div', 'position:absolute;left:-60px;top:250px;width:520px;height:460px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,106,26,.28),rgba(46,230,201,.08) 60%,rgba(0,0,0,0));opacity:0', world);
    // the page, scrolled: stops pause on the hero, the flow panel, the bento, the numbers, the bars, then (inside the phone) the plans and the closing card
    await P.siteScroll(world, {
      src: '../../film/2026-10-16-2055/assets/scroll.jpg', x: 0, y: 206, w: 402, h: 509,
      stops: [[0, 0], [2.8, 40], [4.4, 470], [6.8, 1080], [8.8, 2085], [10.5, 2540], [11.3, 2560], [13.4, 3030], [15.0, 3330], [16.4, 3972]],
      shrink: { at: 11.3, dur: 1.3, scale: .7, y: 222 },
    });
    // pinned caption band (template fonts: Geist + Instrument Serif italic), one pair of lines per voice line
    const band = E.el('div', `position:absolute;left:0;right:0;top:0;height:206px;background:linear-gradient(${INK} 82%,rgba(6,7,11,0))`, P.front);
    const CAP = [[0.1, 3.0, 'Your landing page', 'could look like <em>this.</em>'], [3.2, 7.0, 'A hero that moves.', 'Type with <em>character.</em>'],
      [7.2, 10.8, 'Product, proof,', '<em>plans.</em>'], [11.3, 15.0, 'Designed, built,', 'kept <em>fast & secure.</em>']];
    const caps = CAP.map(([a, b, l1, l2]) => ({ a, b, el: E.el('div', 'position:absolute;left:30px;right:30px;top:108px;font:650 33px/1.04 Geist,Archivo,sans-serif;letter-spacing:-.03em;color:#f4f1ea;opacity:0', band,
      `${l1}<br>${l2}`.replace(/<em>/g, `<em style="font:italic 400 37px/1 'Instrument Serif',Georgia,serif;letter-spacing:0;color:${SUN}">`)) }));
    P.on((t) => {
      caps.forEach(({ a, b, el }) => { const k = P.tween(t, a, .7, 'glide'); el.style.opacity = (k * IN(t, -1, b, .35)).toFixed(3); el.style.transform = `translateY(${((1 - k) * 14).toFixed(1)}px)`; });
      halo.style.opacity = (P.EASE.glide(clamp((t - 11.3) / 1.4)) * IN(t, -1, 16.6, .4)).toFixed(3);
    });
    P.brandEnd({ at: 16.6, keyword: 'STUDIO', why: 'Want a landing page like this?', out: 19.8 });
    S.name = 'Site scroll v1 (theme D benchmark)';
    return { ok: true };
  };
  S.update = function (E, t) { P.update(t); };
  S.cues = () => [];
})();
