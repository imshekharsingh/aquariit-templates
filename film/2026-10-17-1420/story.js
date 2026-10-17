// FILM, theme D sitescroll (design/themes.md; reference R3): "What actually makes a website look expensive?" (service: web, a mini tutorial). 17 Oct 2026.
// BRIEF (creative director, written before building)
//   Brand on show: Halcyra, fine jewellery made to order (fictional; the template is proof, Aquarii is the protagonist).
//   Palette: restrained blue-black ink #07080f and bone #f2eee8, radiant light from one sapphire #4a5cff glow and a spectral fan (spinel #ff4f9a into violet);
//   never flat candy colour, the colour only ever arrives as light.
//   Type: Host Grotesk (tight display sans) + Bodoni Moda italic for the one word that matters in each caption.
//   Hero object: a brilliant-cut sapphire throwing a spectral fan of light over the poster headline.
//   Atmosphere: the template's own still scrolled full frame, its light brought back to life by a live overlay in page coordinates (rays sweep, sparkles
//   twinkle), dust and bokeh from P.scene, a sapphire halo and floor pool behind the phone, a spinel light leak on the pull-back, vignette.
//   Shot list (easing): 0.0 hook over the poster, slow push-in (glide) | 3.2 "01 one light that moves": glide down to the stone, then the pieces index (swing) |
//   6.8 "02 type with a voice": the drop-cap statement, the drawn cut and the numbers (swing) | 10.2 breath (dim) |
//   10.7 BIG MOMENT: the full-bleed page pulls back into a phone that swivels in 3D on a sapphire floor and keeps scrolling (glide) |
//   "03 one clear way to enquire": the commission steps, the quote, the sitting card | 16.0 Aquarii end card, sapphire grade.
//   No framing is held more than ~1.8 s (the gate allows 3.0 s for films of 22 s or less).
(function () {
  const E = window.FilmEngine, P = window.FilmParts, { clamp } = E, S = (E.story = {});
  S.selfStage = true;
  S.dna = {
    service: 'web',
    theme: 'sitescroll',
    format: 'mini tutorial',
    opening: 'a dark jewellery poster site fills the frame, a sapphire throws a live spectral fan over "Light, held by hand." under the pinned question "What makes a website look expensive?"',
    bigMoment: 'at the breath the full-bleed page pulls back into a phone that swivels in 3D over a sapphire floor pool while it keeps scrolling to the booking card',
    ground: 'blue-black ink with a sapphire glow and a spinel-to-violet spectral fan, the template\'s own palette',
    music: 'elegant minimal electronic with a soft pluck, a low riser into the pull-back and a warm pad at the end, about 104 BPM',
  };
  const INK = '#07080f', PINK = '#ff4f9a', SAP = '#4a5cff', BONE = '#f2eee8';
  const IN = (t, a, b, d = .4) => clamp((t - a) / d) * (1 - clamp((t - b) / d));
  S.setup = async function () {
    document.documentElement.classList.add('reel');
    await P.ready; await document.fonts.ready;
    const { world } = P.scene({ accent: PINK, ink: INK, glow: 'rgba(74,92,255,.12)', len: 18.8 });
    P.use('type', 'grotesk-bodoni-numbered'); P.use('opener', 'site-poster-question'); P.use('transition', 'spectral-light-leak');
    P.breath = [10.2, 10.7];
    // behind the phone once it pulls back: a sapphire halo and a floor pool it stands on
    const halo = E.el('div', 'position:absolute;left:-90px;top:230px;width:582px;height:470px;border-radius:50%;background:radial-gradient(closest-side,rgba(74,92,255,.42),rgba(255,79,154,.10) 62%,rgba(0,0,0,0));opacity:0', world);
    const pool = E.el('div', 'position:absolute;left:31px;top:560px;width:340px;height:90px;border-radius:50%;background:radial-gradient(closest-side,rgba(110,125,255,.55),rgba(74,92,255,0));opacity:0', world);
    // the page, scrolled; its light comes back to life through the overlay (page coordinates measured from the template at 402 px)
    const RAYS = [[-52, '255,79,154'], [-34, '255,170,90'], [-17, '250,240,140'], [0, '255,255,255'], [17, '90,240,190'], [34, '80,170,255'], [52, '120,100,255']];
    let rays = [], sparks = [], warm = null;
    await P.siteScroll(world, {
      src: '../../film/2026-10-17-1420/assets/scroll.jpg', x: 0, y: 206, w: 402, h: 509,
      stops: [[0, 0], [2.9, 70], [4.4, 200], [5.9, 700], [6.9, 760], [8.2, 1335], [9.4, 1640], [10.2, 1680], [10.7, 1690], [12.1, 2010], [13.5, 2330], [14.7, 2650], [15.8, 2960]],
      shrink: { at: 10.7, dur: 1.4, scale: .78, y: 212, swivel: -16 },
      overlay: (layer) => {
        const fan = E.el('div', 'position:absolute;left:201px;top:425px;width:0;height:0;mix-blend-mode:screen', layer);
        rays = RAYS.map(([deg, c], i) => ({ deg, i, el: E.el('i', `position:absolute;left:-2px;top:-330px;width:4px;height:330px;transform-origin:50% 100%;background:linear-gradient(to top,rgba(${c},.9),rgba(${c},.25) 55%,rgba(${c},0));filter:blur(1.5px);opacity:0`, fan) }));
        E.el('i', 'position:absolute;left:-70px;top:-70px;width:140px;height:140px;border-radius:50%;background:radial-gradient(closest-side,rgba(200,210,255,.55),rgba(74,92,255,0))', fan);
        sparks = [[247, 361, 16], [123, 403, 11], [293, 429, 10], [176, 392, 8], [228, 470, 9]].map(([x, y, d], i) => ({ i, el: E.el('i', `position:absolute;left:${x - d / 2}px;top:${y - d / 2}px;width:${d}px;height:${d}px;background:#fff;clip-path:polygon(50% 0,58% 42%,100% 50%,58% 58%,50% 100%,42% 58%,0 50%,42% 42%);opacity:0`, layer) }));
        warm = E.el('div', 'position:absolute;left:31px;top:3150px;width:340px;height:200px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,79,154,.35),rgba(74,92,255,0));mix-blend-mode:screen;opacity:0', layer);
      },
    });
    // spinel light leak across the pull-back
    const leak = E.el('div', 'position:absolute;left:-200px;top:-100px;width:420px;height:920px;transform:rotate(18deg);background:linear-gradient(90deg,rgba(255,79,154,0),rgba(255,79,154,.30),rgba(140,120,255,.22),rgba(74,92,255,0));mix-blend-mode:screen;opacity:0', P.front);
    // pinned caption band: a numbered mini tutorial (Host Grotesk + Bodoni Moda italic, the template's fonts)
    const band = E.el('div', `position:absolute;left:0;right:0;top:0;height:206px;background:linear-gradient(${INK} 80%,rgba(7,8,15,0))`, P.front);
    const CAP = [[0.05, 3.0, '', 'What makes a website', 'look <em>expensive?</em>'], [3.2, 6.6, '01', 'One light', 'that <em>moves.</em>'],
      [6.8, 10.2, '02', 'Type with', 'a <em>voice.</em>'], [10.7, 15.9, '03', 'One clear way', 'to <em>enquire.</em>']];
    const caps = CAP.map(([a, b, n, l1, l2]) => ({ a, b, el: E.el('div', 'position:absolute;left:30px;right:30px;top:104px;font:600 31px/1.05 "Host Grotesk",Archivo,sans-serif;letter-spacing:-.035em;color:' + BONE + ';opacity:0', band,
      (n ? `<span style="display:inline-block;margin-right:10px;padding:5px 8px 4px;border:1px solid rgba(255,79,154,.6);border-radius:99px;font:600 12px/1 'Host Grotesk',sans-serif;letter-spacing:.08em;color:${PINK};vertical-align:7px">${n}</span>` : '') +
      `${l1}<br>${l2}`.replace(/<em>/g, `<em style="font:italic 400 36px/1 'Bodoni Moda',Georgia,serif;letter-spacing:-.01em;background:linear-gradient(100deg,#ffd6ea,${PINK} 45%,#b9c2ff);-webkit-background-clip:text;background-clip:text;color:transparent;padding-right:3px">`)) }));
    const card = P.brandEnd({ at: 16.0, keyword: 'WEB', why: 'Want a website that looks this expensive?', grade: 'sapphire' });
    P.on((t) => {
      caps.forEach(({ a, b, el }) => { const k = P.tween(t, a, .7, 'glide'); el.style.opacity = (k * IN(t, -1, b, .35)).toFixed(3); el.style.transform = `translateY(${((1 - k) * 14).toFixed(1)}px)`; });
      // the fan sweeps like the template's (period 9 s) and the rays breathe out of phase; sparkles twinkle
      const sw = 7 * Math.sin(t * 2 * Math.PI / 6);
      rays.forEach(({ deg, i, el }) => { const b = .5 + .5 * Math.sin(t * 2.4 + i * 1.3); el.style.opacity = (.35 + .55 * b).toFixed(3); el.style.transform = `rotate(${(deg + sw).toFixed(2)}deg) scaleY(${(.78 + .22 * b).toFixed(3)})`; });
      sparks.forEach(({ i, el }) => { const b = .5 + .5 * Math.sin(t * 3.1 + i * 2.2); el.style.opacity = (.15 + .85 * b).toFixed(3); el.style.transform = `scale(${(.5 + .6 * b).toFixed(3)}) rotate(${(45 * b).toFixed(1)}deg)`; });
      if (warm) warm.style.opacity = (.4 + .6 * (.5 + .5 * Math.sin(t * 2.2))).toFixed(3);
      const q = P.EASE.glide(clamp((t - 10.7) / 1.5)), end = IN(t, -1, 16.0, .4);
      halo.style.opacity = (q * end).toFixed(3); halo.style.transform = `scale(${(.85 + .15 * q + .03 * Math.sin(t * 1.7)).toFixed(3)})`;
      pool.style.opacity = (q * end * (.75 + .25 * Math.sin(t * 2.1))).toFixed(3);
      const lk = clamp((t - 10.55) / 1.3); leak.style.opacity = (Math.sin(Math.PI * lk) * .9).toFixed(3); leak.style.transform = `translateX(${(560 * lk).toFixed(1)}px) rotate(18deg)`;
      // the hook holds on a slow push-in so the first framing is never still
      world.style.scale = (1 + .05 * P.EASE.glide(clamp(t / 3.2)) * (1 - clamp((t - 3.2) / 1.2))).toFixed(4);
      // keep the end card breathing (slow push-in over its whole hold)
      card.style.scale = (1 + .09 * P.EASE.swing(clamp((t - 16.2) / 2.6))).toFixed(4);
    });
    S.name = 'Halcyra: what makes a website look expensive (theme D sitescroll)';
    return { ok: true };
  };
  S.update = function (E, t) { P.update(t); };
  S.cues = () => [];
})();
