// LAB: the leaky-site idea in REAL 3D (owner, 14 Oct 2026: "why are we not doing 3D?"). An 8 s test shot to judge the look and the render cost before a full film:
// a glass browser window (refractive water inside, reflective glass, lit by a procedural studio) leaks from a crack; the camera starts in a close-up on the jet,
// pulls back, whips in as a lime patch slams onto the crack, tilts up to the address bar as water pours back in, and rides the level up.
// Render: node scripts/film/render-film.mjs 2026-10-14-0850 --film-dir film/_lab/leaky-3d --variant A [--stills ...]   (three.js injected automatically)
(function () {
  const E = window.FilmEngine, TM = window.FILM_T, P = window.FilmParts, { clamp, lerp } = E, S = (E.story = {});
  S.selfStage = true;
  S.dna = { service: 'studio', opening: 'lab: 3D close-up of a refractive jet from a cracked glass browser window', bigMoment: 'lab: 3D patch slam and refill', ground: 'studio navy', music: 'n/a (lab)' };
  const INK = '#061722', AQUA = '#1ec8ff', LIME = '#d6ff3d', RED = '#ff5a4f';

  S.setup = async function () {
    document.documentElement.classList.add('reel');
    await P.ready; await document.fonts.ready;
    const { world } = P.scene({ accent: LIME, ink: INK });
    // the lab shot, now built from the part the films use (P.tank3d)
    P.tank3d(world, {
      levels: [[0, .86], [4.4, .5], [5.4, .5], [7.4, .95], [8, .95]], leak: (t) => t < 4.4, patchAt: 4.4, pour: [5.4, 7.4], puddleSize: (t) => .3 + .3 * clamp(t / 4.4),
      camera: [
        [0, { p: [-1.45, .62, 3.1], at: [-.55, .1, .5], fov: 30 }],
        [1.8, { p: [-.95, .4, 1.85], at: [-.55, .12, .55], fov: 30 }, 'swing'],
        [2.9, { p: [2.3, .9, 8.4], at: [0, -.05, 0], fov: 30 }, 'default'],
        [4.0, { p: [2.1, .8, 8.1], at: [0, -.05, 0], fov: 30 }, 'swing'],
        [4.35, { p: [-.75, .5, 2.6], at: [-.55, .28, .5], fov: 30 }, 'bold'],
        [5.25, { p: [.5, 2.9, 5.8], at: [0, 1.35, 0], fov: 30 }, 'default'],
        [6.7, { p: [1.3, .5, 7.4], at: [0, -.2, 0], fov: 30 }, 'default'],
        [8, { p: [1.6, .7, 7.8], at: [0, 0, 0], fov: 30 }, 'swing'],
      ],
    });

    E.el('div', 'position:absolute;left:0;right:0;top:0;height:300px;background:linear-gradient(180deg,rgba(4,16,24,.78),rgba(4,16,24,0));pointer-events:none', world);   // a soft scrim so the hook reads over the bright page
    P.dripWord(world, `Your site<br>is <span style="color:${RED}">leaking.</span>`, { x: 30, y: 104, size: 66, drop: AQUA, at: -1, out: 1.9, n: 6 });
    S.name = 'lab 3D';
    return { ok: true };
  };
  S.update = function (E, t) { P.update(t); };
  S.cues = () => [];
})();
