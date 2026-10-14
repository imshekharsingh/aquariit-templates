// FILM: Aquarii Tech Studio, "the leaky site" v2 (service: studio). Our own metaphor (Aquarii = the water bearer): a website is a vessel, visitors are the water.
// v1 was a single locked-off wide shot (owner: "boring, while it has motion graphics"). v2 is SHOT like a film: a keyed camera that starts in an extreme close-up on
// the crack, whips crack to crack (each pain a giant word), pulls back to the empty glass, kicks on every patch, tilts up to the address bar and rides the pour down,
// then DIVES under the surface where messages rise past the lens at three depths, and breaks the surface into "DM us" in wet type. Grain over everything.
// No part from any reference reel (scripts/film/sources.json). CTA: DM only (owner, 14 Oct 2026).
(function () {
  const E = window.FilmEngine, T = window.FILM_T, P = window.FilmParts, { clamp, lerp, ease } = E, S = (E.story = {});
  S.selfStage = true;
  S.dna = {
    service: 'studio',
    opening: 'extreme close-up of a cracked browser window spraying water under wet type YOUR SITE IS LEAKING',
    bigMoment: 'the camera dives under the refilled surface and messages rise past the lens at three depths',
    ground: 'deep sea navy, aqua water, lime patches, red cracks, film grain',
    music: 'tense-to-warm downtempo electronic at 100 BPM (dripping plucks, sub swells, a drop into the dive)',
  };
  const sm = P.sm, css = P.css;
  const INK = '#061722', AQUA = '#1ec8ff', DEEP = '#0a4fd6', LIME = '#d6ff3d', RED = '#ff5a4f';

  S.setup = async function () {
    document.documentElement.classList.add('reel');
    await P.ready; await document.fonts.ready;
    const { world } = P.scene({ accent: LIME, ink: INK, glow: 'rgba(30,200,255,.10)' });

    // ---- the camera (world coordinates of the vessel; 100 BPM, a beat every 0.6 s) ----
    const F0 = { x: 40, y: 455, s: 2.6, r: -5 };
    const cam = P.camera([
      [0, F0], [1.7, { x: 46, y: 450, s: 3.15, r: -7 }, 'swing'],
      [2.35, { x: 201, y: 432, s: .97, r: 0 }, 'default'],                                // smash pull-back: the whole leaking window
      [2.9, { x: 100, y: 445, s: 1.75, r: -3 }, 'bold'], [4.0, { x: 96, y: 448, s: 1.92, r: -4 }, 'swing'],          // SLOW (crack 1)
      [4.22, { x: 318, y: 545, s: 2.1, r: 6 }, 'bold'], [5.3, { x: 314, y: 548, s: 2.3, r: 6 }, 'swing'],             // OUTDATED (crack 2)
      [5.52, { x: 84, y: 615, s: 2.1, r: -6 }, 'bold'], [6.6, { x: 88, y: 618, s: 2.3, r: -6 }, 'swing'],             // INVISIBLE (crack 3)
      [6.82, { x: 314, y: 672, s: 2.3, r: 5 }, 'bold'], [7.85, { x: 311, y: 676, s: 2.5, r: 5 }, 'swing'],            // HACKED (crack 4)
      [8.35, { x: 201, y: 468, s: .93, r: 0 }, 'default'], [9.05, { x: 201, y: 474, s: 1.04, r: 0 }, 'swing'],          // the empty glass, creeping in
      [9.22, { x: 86, y: 470, s: 2.3, r: -4 }, 'bold'], [9.7, { x: 88, y: 470, s: 2.42, r: -4 }, 'swing'],         // patch 1 FAST
      [9.84, { x: 316, y: 560, s: 2.3, r: 5 }, 'bold'], [10.3, { x: 314, y: 560, s: 2.42, r: 5 }, 'swing'],        // patch 2 FRESH
      [10.44, { x: 86, y: 630, s: 2.3, r: -5 }, 'bold'], [10.9, { x: 88, y: 630, s: 2.42, r: -5 }, 'swing'],       // patch 3 SEEN
      [11.04, { x: 316, y: 690, s: 2.3, r: 5 }, 'bold'], [11.45, { x: 314, y: 690, s: 2.42, r: 5 }, 'swing'],      // patch 4 SAFE
      [11.7, { x: 201, y: 236, s: 2.1, r: 0 }, 'default'],                                                            // tilt up to the address bar
      [12.0, { x: 201, y: 520, s: 1.15, r: 0 }, 'default'],                                                           // pull out as it pours
      [12.55, { x: 201, y: 310, s: 1.6, r: 0 }, 'default'],                                                           // rise with the water
      [12.9, { x: 201, y: 262, s: 3.4, r: 0 }, 'snap'],                                                     // push into the surface (dive)
      [17.349, { x: 201, y: 262, s: 3.4, r: 0 }, 'swing'],
      [17.35, { x: 40, y: 455, s: 2.3, r: -4 }, 'cut'], [18, F0, 'swing'],                                   // back to the crack: frame 0
    ], { handheld: 2.2, shake: [[0, .5, 4], [4.22, 4.6, 6], [5.52, 5.9, 6], [6.82, 7.4, 12], [9.25, 9.6, 9], [9.85, 10.2, 9], [10.45, 10.8, 9], [11.05, 11.4, 11]] });

    // ---- the vessel ----
    P.vessel(world, {
      x: 44, y: 206, w: 314, h: 600, url: 'yourbusiness.com', water: [AQUA, DEEP], leak: RED, patch: LIME, loopAt: 17.35, cam,
      levels: [[0, .74], [2.9, .72], [4.2, .6], [5.5, .47], [6.8, .36], [8.0, .12], [11.6, .12], [12.5, .97]],
      holes: [
        { side: 'l', y: 470, icon: 'bolt', open: [[-2, 99]], fix: 9.25, fixIcon: 'globe' },
        { side: 'r', y: 560, icon: 'phone', open: [[4.22, 99]], fix: 9.85, fixIcon: 'spark' },
        { side: 'l', y: 630, icon: 'chat', open: [[5.52, 99]], fix: 10.45, fixIcon: 'calendar' },
        { side: 'r', y: 690, icon: 'lock', open: [[6.82, 99]], fix: 11.05, fixIcon: 'lock' },
      ],
      pour: [11.6, 12.5],
    });

    // ---- type: wet hook, giant slam words (pains red, fixes lime), one quiet line in the empty glass ----
    const hook = `Your site<br>is <span style="color:${RED}">leaking.</span>`;
    S.hook = P.dripWord(world, hook, { x: 30, y: 104, size: 66, drop: AQUA, at: -1, out: 1.85, n: 6 });
    P.dripWord(world, hook, { x: 30, y: 104, size: 66, drop: AQUA, at: 17.42, out: 99, n: 6, pop: true });   // hero reveal (loop return)
    const slam = (word, sub, a, b, colour) => {
      // a solid slab behind the word, so it reads on dark glass and on bright water alike
      const box = E.el('div', 'position:absolute;left:26px;right:26px;top:100px;height:120px;overflow:hidden', world);
      const m = document.createElement('canvas').getContext('2d'); m.font = '900 100px Archivo, sans-serif';
      const size = Math.min(100, Math.floor(100 * 318 / (m.measureText(word).width * .86)));
      const ink = colour === LIME ? '#0b0d0f' : '#ffffff';
      const el = E.el('div', `position:absolute;left:0;bottom:0;padding:6px 12px 4px;background:${colour};color:${ink};font:900 ${size}px/.86 Archivo,sans-serif;font-variation-settings:"wdth" 70;letter-spacing:-.04em;white-space:nowrap;box-shadow:0 12px 30px rgba(0,0,0,.35)`, box, word);
      const sb = E.el('div', `position:absolute;left:30px;right:30px;top:230px;color:#fff;font:700 14px/1 ${P.MONO};letter-spacing:.16em;text-shadow:0 2px 10px rgba(0,0,0,.8)`, world, sub);
      // bold mood: the slab arrives on the bold spring (~5% overshoot, settled in 12 frames ~ 0.4 s) and leaves on snap in 0.26 s (35% faster)
      P.on((t) => { const i = P.springAt(t, a, 'bold'), o = P.tween(t, b - .26, .26, 'snap'), on = t >= a && t < b;
        css(el, { opacity: on ? P.springAt(t, a, 'fade').toFixed(3) : '0', transform: `translateY(${((1 - i) * 110 - o * 110).toFixed(1)}%)` });
        // technical line (mono): a short, hard-stopping arrival (glide 250 ms, no overshoot), out with the slab
        css(sb, { opacity: on ? (P.springAt(t, a + .1, 'fade') * (1 - o)).toFixed(3) : '0', transform: `translateX(${((1 - P.springAt(t, a + .1, 'default')) * -20).toFixed(1)}px)` }); });
    };
    slam('SLOW.', 'PAGES THAT CRAWL', 2.9, 4.16, RED);
    slam('OUTDATED.', 'BROKEN ON PHONES', 4.22, 5.46, RED);
    slam('INVISIBLE.', 'POSTS NOBODY SEES', 5.52, 6.76, RED);
    slam('HACKED.', 'ONE ATTACK. OFFLINE.', 6.82, 8.2, RED);
    slam('FAST.', 'CDN + CACHING', 9.25, 9.81, LIME);
    slam('FRESH.', 'REDESIGNED FOR PHONES', 9.85, 10.41, LIME);
    slam('SEEN.', 'SOCIAL, RUN FOR YOU', 10.45, 11.01, LIME);
    slam('SAFE.', 'FIREWALL · UPDATES · BACKUPS', 11.05, 11.62, LIME);
    const quiet = E.el('div', `position:absolute;left:30px;right:30px;top:300px;text-align:center;color:#fff;font:800 30px/1.1 Archivo,sans-serif;letter-spacing:-.02em`, world, 'Sound familiar?');
    P.fade(quiet, 8.35, 8.98, { fi: .2, fo: .12, dy: 10 });

    // ---- breath, then the dive ----
    P.breath = [12.55, 12.85]; P.punchAt = 12.9;
    const splash = E.el('div', 'position:absolute;inset:0;background:radial-gradient(circle at 50% 45%,rgba(255,255,255,.95),rgba(190,240,255,.6) 40%,rgba(30,200,255,0) 75%);opacity:0', world);
    P.on((t) => { splash.style.opacity = (t >= 12.85 && t < 13.25 ? P.springAt(t, 12.85, 'fade') * (1 - P.tween(t, 12.95, .3, 'snap')) : 0).toFixed(3); });
    const under = P.underwater(world, ['New enquiry', 'Can you send a quote?', 'Booked for Friday', 'Saw your post', 'Call me back?', 'Order placed', 'Is Monday free?'],
      { at: 12.9, out: 15.3, top: '#0c86e6', deep: '#03173a', accent: LIME });
    world.appendChild(splash);                                             // the flash sits over the water
    void under;

    // ---- break the surface into the CTA ----
    const ctaG = E.el('div', `position:absolute;inset:0;background:${AQUA};opacity:0`, world);
    E.el('div', 'position:absolute;left:0;right:0;top:0;height:300px;background:linear-gradient(180deg,rgba(255,255,255,.35),rgba(255,255,255,0))', ctaG);
    P.dripWord(ctaG, 'DM us', { x: 30, y: 150, size: 132, colour: '#04121a', drop: DEEP, at: 15.45, out: 17.35, n: 6, align: 'center', pop: true });   // hero reveal of the payoff
    E.el('div', `position:absolute;left:30px;right:30px;top:318px;text-align:center;color:#04121a;font:600 11px/1.6 ${P.MONO};letter-spacing:.14em`, ctaG, 'WEBSITES · SOCIAL MEDIA<br>SECURITY · CDN');
    P.on((t) => { ctaG.style.opacity = t >= 15.42 && t < 17.35 ? P.springAt(t, 15.42, 'fade').toFixed(3) : '0'; });
    // the CTA is never still: light ripples across the water ground, the wet type floats, and the camera keeps creeping in
    const shim = E.el('canvas', 'position:absolute;inset:0;width:402px;height:715px', ctaG); shim.width = 804; shim.height = 1430; const sg = shim.getContext('2d'); sg.scale(2, 2);
    ctaG.insertBefore(shim, ctaG.children[1]);
    const dm = ctaG.querySelector('div[style*="132px"]');
    P.on((t, tf) => { if (t < 15.4 || t >= 17.35) return; sg.clearRect(0, 0, 402, 715); sg.strokeStyle = 'rgba(255,255,255,.22)'; sg.lineWidth = 2;
      for (let j = 0; j < 16; j++) { sg.beginPath(); for (let px = -10; px <= 412; px += 8) { const py = 40 + j * 44 + 10 * Math.sin(px * .03 + tf * 1.8 + j * 1.9) + 6 * Math.sin(px * .07 - tf * 2.4 + j); px < 0 ? sg.moveTo(px, py) : sg.lineTo(px, py); } sg.stroke(); }
      const u = t - 15.45; ctaG.style.transform = `scale(${(1 + .035 * P.tween(t, 15.45, 1.9, 'swing')).toFixed(4)})`; if (dm) { dm.style.translate = `0 ${(4 * Math.sin(u * 3.2)).toFixed(2)}px`; dm.style.rotate = `${(-1.2 * Math.sin(u * 2.1)).toFixed(2)}deg`; } });
    const band = E.el('div', 'position:absolute;left:-20px;right:-20px;height:140px;top:0;background:linear-gradient(180deg,rgba(255,255,255,0),rgba(235,250,255,.95) 45%,rgba(255,255,255,.9) 55%,rgba(255,255,255,0));opacity:0', world);
    P.on((t) => { css(band, { opacity: (t >= 15.2 && t < 15.55 ? 1 : 0).toString(), transform: `translateY(${lerp(-160, 760, P.tween(t, 15.2, .3, 'snap')).toFixed(1)}px)` }); });
    P.use('cta', 'wet-dm');

    // ---- captions: almost none (the type is the picture) ----
    P.captions([
      [15.95, 16.6, 'Send this to a founder', 28], [16.6, 17.3, 'with a leaky site.', 28, { 2: RED }],
    ], { style: 'pill' });
    const so = P.signoff({ at: 16.7, out: 17.1 });
    so.style.color = 'rgba(4,18,26,.8)';
    P.grain({ amount: .025 });
    S.name = 'Aquarii Tech Studio';
    return { ok: true };
  };

  S.cuts = [12.85, 12.9, 15.2, 15.42, 17.35];                          // hard cuts (the dive flash, the surface break, the loop cut): jumps there are intended
  S.update = function (E, t) { P.update(t); };

  S.cover = function () {
    E.frame = 15; S.update(E, .5);
    P.front.style.opacity = '0'; S.hook.style.display = 'none';            // the square grid crop would cut the top line: the cover line sits in the middle
    E.el('div', `position:absolute;left:30px;top:250px;width:342px;color:#fff;font:900 64px/.88 Archivo,sans-serif;font-variation-settings:"wdth" 72;letter-spacing:-.035em;text-shadow:0 4px 30px rgba(0,0,0,.6)`, E.scene, `Your site<br>is <span style="color:${RED}">leaking.</span>`);
  };
  S.cues = () => T.cues || [];
})();
