// LAB: the brand ending (P.brandEnd) on its own. Render: node scripts/film/render-film.mjs 2026-10-14-0850 --film-dir film/_lab/brand-end --stills 2
(function () {
  const E = window.FilmEngine, P = window.FilmParts, S = (E.story = {});
  S.selfStage = true;
  S.dna = { service: 'web', opening: 'lab: brand end', bigMoment: 'lab: brand end', ground: 'ink', music: 'n/a (lab)' };
  S.setup = async function () {
    document.documentElement.classList.add('reel');
    await P.ready; await document.fonts.ready;
    P.scene({ accent: P.BRAND.blue, ink: P.BRAND.ink });
    P.brandEnd({ at: .5, keyword: 'SITE' });
    return { ok: true };
  };
  S.update = function (E, t) { P.update(t); };
  S.cues = () => [];
})();
