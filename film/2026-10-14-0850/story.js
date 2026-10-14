// FILM: Aquarii Tech Studio, the studio itself (service: studio). Re-cut 14 Oct 2026: the first cut sold the template's laundry business; the owner's rule
// (design/services.md) is that every reel sells Aquarii's own services. Format: service ad ("Need X? We got you.") + cheat-sheet tour + one proof moment.
// Concept: a founder needs a website, then reach, then gets hacked: three vendors, three headaches. One studio covers every layer, and attacks bounce off.
// Combination (differs from the previous film in opener, transition, mechanism, payoff): pendulum + interstitial transitions, radial-tour mechanism,
// shield payoff (NEW part, P.shield), underline captions, ring CTA, deep-indigo ground. No page clone: the template is not the subject of this reel.
(function () {
  const E = window.FilmEngine, T = window.FILM_T, P = window.FilmParts, { clamp, lerp, ease } = E, S = (E.story = {});
  S.selfStage = true;
  S.dna = {
    service: 'studio',
    opening: 'a tag with the Aquarius sign swings across NEED A WEBSITE? and wipes it into the answer',
    bigMoment: 'red attacks fly in from every edge and burst on a mint shield around your site',
    ground: 'deep indigo with mint, a giant faint wave pattern edge to edge',
    music: 'confident minimal tech house at 100 BPM (tight kick, muted plucks, sub bass)',
  };
  const sm = P.sm, css = P.css;
  const INK = '#0a0f2c', MINT = '#3dffb5', RED = '#ff4d5e', SOFT = '#c9d2ff';
  const AQ = '<svg viewBox="0 0 16 12" width="34" height="26" aria-hidden="true"><path d="M1 5 3.5 2.5 6 5 8.5 2.5 11 5 13.5 2.5 15 4M1 10 3.5 7.5 6 10 8.5 7.5 11 10 13.5 7.5 15 9" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  S.setup = async function () {
    document.documentElement.classList.add('reel');
    await P.ready; await document.fonts.ready;
    const { world } = P.scene({ accent: MINT, ink: INK, glow: 'rgba(61,255,181,.10)' });

    // ---- the brand wave, huge and faint, edge to edge (uses the whole frame; drifts slowly) ----
    const rows = Array.from({ length: 9 }, (_, i) => { const y = 40 + i * 82; let d = `M-80 ${y}`; for (let x = -80; x < 500; x += 60) d += ` L${x + 30} ${y - 26} L${x + 60} ${y}`; return `<path d="${d}"/>`; }).join('');
    S.waves = E.el('div', 'position:absolute;left:-60px;top:0;width:522px;height:715px;opacity:.13', world,
      `<svg viewBox="0 0 522 715" width="522" height="715" fill="none" stroke="${MINT}" stroke-width="3" stroke-linejoin="round" aria-hidden="true">${rows}</svg>`);

    // ---- 0-6: the pendulum: question, then our answer, three times ----
    const qa = (S.qa = E.el('div', 'position:absolute;inset:0', world));
    P.pendulum(qa, [['Need a website?', 'We build it.'], ['Need more reach?', 'We run your socials.'], ['Hacked? Down?', 'We guard it.']],
      { at: 0, period: 1.0, pivot: [201, -70], len: 345, amp: 27, y: 318, size: 52, colour: '#ffffff', alt: MINT, tagHtml: AQ });
    // which service each answer is (reads as a catalogue, and fills the lower half)
    [['01 / WEB DESIGN', -1, 2], ['02 / SOCIAL MEDIA', 2, 4], ['03 / SECURITY + CDN', 4, 5.9]].forEach(([txt, a, b]) => {
      const el = E.el('div', `position:absolute;left:30px;right:30px;top:432px;text-align:center;color:${MINT};font:600 13px/1 ${P.MONO};letter-spacing:.28em`, qa, txt);
      P.fade(el, a, b, { fi: .2, fo: .2, dy: 8 });
    });
    // the loop: the same first line waits on the last frames, tag at its extreme (frame 0 is identical)
    const qb = (S.qb = E.el('div', 'position:absolute;inset:0;opacity:0', world));
    P.pendulum(qb, [['Need a website?', 'We build it.']], { at: 18.0, period: 1.0, pivot: [201, -70], len: 345, amp: 27, y: 318, size: 52, colour: '#ffffff', alt: MINT, tagHtml: AQ });

    // ---- 6.0-6.9: the pivot line ----
    P.interstitial(world, `<div>One studio.<br><span style="color:${INK}">Every layer.</span></div>`, { at: 6.0, out: 6.9, colour: MINT, ink: '#0b0d0f', size: 50 });

    // ---- 6.9-12.4: the cheat sheet: what we run around your business ----
    const radG = (S.radG = E.el('div', 'position:absolute;inset:0;opacity:0', world));
    P.radial(radG, { hub: 'Your business online', labels: ['Website', 'Socials', 'Security', 'CDN', 'Backups'], cx: 201, cy: 300, r: 100, at: 7.0, per: .85, pullback: 11.25, title: 'Screenshot this', zoom: 1.4 });
    P.wmHide.push([7.0, 7.85]);                                          // the zoomed hub sits on the watermark band on the first spoke
    P.fade(radG, 6.88, 12.3, { fi: .08, fo: .3 });

    // ---- breath, then the shield (12.9-15.7) ----
    P.breath = [12.3, 12.8]; P.punchAt = 12.9;
    P.shield(world, { cx: 201, cy: 292, w: 304, at: 12.9, out: 15.55, threats: 18, label: 'Your site', counter: 'BLOCKED', threat: RED });

    // ---- 15.7: the CTA to us ----
    const ctaG = E.el('div', 'position:absolute;inset:0;opacity:0', world);
    E.el('div', `position:absolute;left:30px;right:30px;top:118px;text-align:center;color:#fff;font:800 34px/1.02 Archivo,sans-serif;font-variation-settings:"wdth" 82;letter-spacing:-.02em`, ctaG, `Your whole<br><span style="color:${MINT}">tech team.</span>`);
    P.ring(ctaG, 'WEBSITES · SOCIALS · SECURITY · CDN · ', { x: 201, y: 318, r: 96, at: 15.75, label: 'DM' });
    P.fade(ctaG, 15.6, 17.4, { fi: .2, fo: .3 });

    // ---- captions (underline style, the spine) ----
    // on the top and left spokes the zoomed camera pushes the hub down over the usual caption line, so that one caption sits at the top (y 150, below Instagram's top bar)
    P.captions([[7.0, 7.85, 'Sites built to sell', 28, { 3: MINT }], [10.4, 11.25, 'Backed up nightly', 28, { 2: MINT }]], { style: 'underline', y: 150 });
    P.captions([
      [7.85, 8.7, 'Posts that get seen', 28, { 3: MINT }], [8.7, 9.55, 'Patched and watched', 28, { 2: MINT }],
      [9.55, 10.4, 'Fast everywhere', 28, { 1: MINT }],
      [11.35, 12.3, 'All one team.', 30, { 2: MINT }],
      [13.05, 14.3, 'Attacks bounce off.', 30, { 1: MINT }], [14.35, 15.55, 'We take the hits.', 30, { 3: MINT }],
      [15.7, 16.3, 'Send this to a founder', 28, { 4: MINT }], [16.3, 16.9, 'doing IT alone.', 30, { 1: MINT }],
    ], { style: 'underline' });
    P.signoff({});
    S.name = 'Aquarii Tech Studio';
    return { ok: true };
  };

  S.update = function (E, t) {
    S.qa.style.opacity = (1 - sm(5.85, 6.0, t)).toFixed(3);
    S.qb.style.opacity = sm(17.62, 17.9, t).toFixed(3);
    S.waves.style.transform = `translateX(${(-30 * Math.sin(Math.PI * 2 * t / 18)).toFixed(1)}px)`;
    S.waves.style.opacity = (t > 6 && t < 17.6 ? .07 : .13).toString();
    P.update(t);
  };

  S.cover = function () {
    E.frame = 357; S.update(E, 11.9);
    P.front.style.opacity = '0';
    E.el('div', `position:absolute;left:30px;top:452px;width:342px;color:#fff;font:800 44px/.98 Archivo,sans-serif;font-variation-settings:"wdth" 80;letter-spacing:-.02em`, E.scene, `Your whole <span style="color:${MINT}">tech team</span>`);
  };
  S.cues = () => T.cues || [];
})();
