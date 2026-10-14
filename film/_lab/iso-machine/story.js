// LAB: P.iso check (14 Oct 2026). A small sorting machine: parcels ride a belt, a gate sends each one down the nearest of three chutes, a red one drops into the
// reject bin. Only a test of the toolkit's shading, depth order and springs; the daily film builds its own machine.
// Render: node scripts/film/render-film.mjs 2026-10-14-0850 --film-dir film/_lab/iso-machine --stills 1,3
(function () {
  const E = window.FilmEngine, P = window.FilmParts, { clamp } = E, S = (E.story = {});
  S.selfStage = true;
  S.dna = { service: 'edge', opening: 'lab: iso sorting machine', bigMoment: 'lab: iso sort', ground: 'warm paper', music: 'n/a (lab)' };
  const STEEL = '#b9c2cc', DARK = '#3b4350', AMB = '#ffb238', RED = '#ff5a4f', TEAL = '#2fd3b5', BASE = '#e9e4da';
  S.setup = async function () {
    document.documentElement.classList.add('reel');
    await P.ready; await document.fonts.ready;
    const { world } = P.scene({ accent: AMB, ink: '#f1ece2' });
    const I = P.iso(world, { ox: 190, oy: 330, s: 1.15, line: '#1d222b' });
    // base plate on feet, corner screws, a ruler along the front edge
    [[-110, -70], [100, -70], [-110, 90], [100, 90]].forEach(([x, y]) => I.cyl({ x, y, z: -10, r: 6, h: 10, c: DARK }));
    I.box({ x: -125, y: -85, w: 240, d: 190, h: 12, r: 10, c: BASE });
    [[-115, -75], [105, -75], [-115, 95], [105, 95]].forEach(([x, y]) => I.dot({ x, y, z: 12, r: 1.8 }));
    I.ticks({ x: -100, y: 98, z: 12, len: 180, n: 36, axis: 'x' });
    // three chutes at the back, a reject bin at the front right
    [-80, -20, 40].forEach((x, i) => { I.box({ x, y: -70, z: 12, w: 40, d: 46, h: 46, r: 4, c: [TEAL, '#7aa7ff', '#c9a4ff'][i] }); I.box({ x: x + 6, y: -64, z: 12.5, w: 28, d: 34, h: 46, r: 3, c: shadeless(DARK) }); });
    I.box({ x: 60, y: 40, z: 12, w: 46, d: 50, h: 30, r: 5, c: DARK });
    // the belt: a long rounded slab on two rollers, with posts
    I.box({ x: -110, y: 0, w: 200, d: 28, h: 8, z: 22, r: 12, c: '#4b5361' });
    [-100, 80].forEach((x) => I.cyl({ x, y: 14, z: 12, r: 9, h: 18, c: STEEL }));
    [-100, 80].forEach((x) => I.box({ x: x - 4, y: 30, w: 8, d: 6, h: 30, z: 12, c: STEEL }));
    // a sprung gate arm over the belt
    I.cyl({ x: 10, y: 40, z: 12, r: 5, h: 50, c: STEEL });
    I.coil({ x: 10, y: 40, z: 22, r: 9, h: 26, turns: 5, c: '#3b4350', lw: 1.2 });
    I.box((t) => { const a = Math.sin(t * 2.2) * 18; return { x: 10 - 4, y: 40 - 38 - a * .3, w: 8, d: 38, h: 6, z: 58, c: AMB }; });
    // parcels on the belt
    for (let i = 0; i < 5; i++) I.box((t) => { const u = ((t * 0.32 + i / 5) % 1); const bad = i === 3;
      return { x: -100 + u * 170, y: 4, z: 30, w: 18, d: 18, h: 16, r: 2, c: bad ? RED : '#d9b07a', o: clamp(u * 8) * clamp((1 - u) * 8) }; });
    return { ok: true };
  };
  function shadeless(c) { return c; }
  S.update = function (E, t) { P.update(t); };
  S.cues = () => [];
})();
