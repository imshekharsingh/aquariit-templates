// FILM: Aquarii Tech Studio, "the leaky site" (service: studio). Third cut of this slot, 14 Oct 2026: cut 1 sold the template's laundry business, cut 2 rebuilt a
// reference reel almost as-is (owner: "that's plagiarism"). This one is built on our own metaphor: Aquarii is the water bearer, so a business's website is a vessel and
// its visitors are the water. Four cracks (slow, old on phones, no posts, hacked) drain it; our four services patch them, water pours back in through the address bar,
// and what used to leak now rises as enquiries. CTA: DM us or WhatsApp.
// Combination: leak cold open + vessel mechanism (NEW, ours), headline swap, pill captions, wave flood transition, rise-chips payoff (NEW, ours), contact CTA.
// No part from any reference reel (scripts/film/sources.json).
(function () {
  const E = window.FilmEngine, T = window.FILM_T, P = window.FilmParts, { clamp, lerp, ease } = E, S = (E.story = {});
  S.selfStage = true;
  S.dna = {
    service: 'studio',
    opening: 'a browser window full of water already leaking from a crack under the hook',
    bigMoment: 'the sealed window brims and visitors rise out of it as enquiries',
    ground: 'deep sea navy with aqua water, lime patches and red leaks',
    music: 'warm, steady downtempo electronic at 100 BPM (round bass, soft clicks, water-drop plucks)',
  };
  const sm = P.sm, css = P.css;
  const INK = '#061722', AQUA = '#1ec8ff', DEEP = '#0a4fd6', LIME = '#d6ff3d', RED = '#ff5a4f';

  S.setup = async function () {
    document.documentElement.classList.add('reel');
    await P.ready; await document.fonts.ready;
    const { world } = P.scene({ accent: LIME, ink: INK, glow: 'rgba(30,200,255,.12)' });

    // ---- the vessel: the whole story happens in one browser window that fills the width and runs off the bottom ----
    P.vessel(world, {
      x: 44, y: 206, w: 314, h: 600, loopAt: 17.43, url: 'yourbusiness.com', water: [AQUA, DEEP], leak: RED, patch: LIME,
      levels: [[0, .62], [3.4, .52], [5.0, .40], [6.4, .30], [8.5, .13], [8.9, .13], [12.3, .97]],
      holes: [
        { side: 'l', y: 470, icon: 'bolt', open: [[-2, 99]], fix: 8.95, fixIcon: 'globe' },
        { side: 'r', y: 560, icon: 'phone', open: [[3.6, 99]], fix: 9.75, fixIcon: 'spark' },
        { side: 'l', y: 630, icon: 'chat', open: [[5.0, 99]], fix: 10.55, fixIcon: 'calendar' },
        { side: 'r', y: 690, icon: 'lock', open: [[6.4, 99]], fix: 11.35, fixIcon: 'lock' },
      ],
      pour: [8.95, 12.3],
    });
    // the loop: from 17.43 (under the flood) the vessel replays its frame-0 state (loopAt)

    // ---- the headline zone (top, under Instagram's bar): one line pair per act, swapped with a rising mask ----
    const heads = [
      [-1, 2.9, `Is your website<br><span style="color:${RED}">leaking customers?</span>`],
      [2.9, 8.7, `Here’s where<br>they slip out.`],
      [8.7, 12.4, `We seal it.<br><span style="color:${LIME}">All four cracks.</span>`],
      [12.4, 15.5, `Now they<br><span style="color:${AQUA}">stay and ask.</span>`],
      [17.45, 99, `Is your website<br><span style="color:${RED}">leaking customers?</span>`],
    ].map(([a, b, html]) => {
      const box = E.el('div', 'position:absolute;left:30px;right:30px;top:104px;height:84px;overflow:hidden', world);
      const el = E.el('div', `color:#fff;font:900 35px/1.08 Archivo,sans-serif;font-variation-settings:"wdth" 78;letter-spacing:-.02em;text-transform:none`, box, html);
      P.on((t) => { const i = ease.out3(clamp((t - a) / .4)), o = ease.in2(clamp((t - b + .25) / .25)); css(el, { transform: `translateY(${((1 - i) * 100 - o * 100).toFixed(1)}%)`, opacity: t < a || t >= b ? '0' : '1' }); });
      return box;
    });
    void heads;

    // ---- payoff: what used to leak now rises as messages ----
    P.breath = [12.3, 12.8]; P.punchAt = 12.85;
    P.riseChips(world, ['New enquiry', 'Can you send a quote?', 'Booked for Friday', 'Saw your post, DM’d', 'Call me back?'],
      { at: 12.85, per: .42, x0: 80, x1: 300, from: () => 480, to: 252, dur: 1.5, out: 15.35, icon: 'chat', right: 336 });   // they rise through the water like bubbles (above the watermark band, clear of Instagram's button column)

    // ---- 15.35: the water floods the frame, the contact card sits on it ----
    P.wave(world, { at: 15.35, dur: .5, colour: AQUA, hold: 1.55 });
    P.use('cta', 'contact-flood');
    const cta = E.el('div', 'position:absolute;left:30px;right:30px;top:150px;text-align:center;color:#04121a;opacity:0', world,
      `<div style="font:900 84px/.9 Archivo,sans-serif;font-variation-settings:'wdth' 72;letter-spacing:-.03em">DM us</div>
       <div style="margin-top:14px;font:700 20px/1 Archivo,sans-serif">or WhatsApp</div>
       <div style="margin-top:10px;font:800 33px/1 Archivo,sans-serif;letter-spacing:-.01em">+91 95356 21491</div>
       <div style="margin-top:18px;font:600 11px/1.4 ${P.MONO};letter-spacing:.1em">WEBSITES · SOCIAL MEDIA · SECURITY · CDN</div>`);
    P.fade(cta, 15.8, 17.3, { fi: .25, fo: .2, dy: 14 });

    // ---- captions (pill, the spine): the pain at each crack, then the fix ----
    P.captions([
      [-0.3, 1.3, 'Visitors come in.', 28], [1.3, 3.5, 'Slow site? They leave.', 28, { 2: RED }],
      [3.6, 4.95, 'Old on phones? Gone.', 28, { 3: RED }], [5.0, 6.35, 'No posts? Forgotten.', 28, { 2: RED }], [6.4, 8.4, 'Hacked? Shut.', 30, { 1: RED }],
      [8.95, 9.7, 'We speed it up.', 28, { 3: LIME }], [9.75, 10.5, 'We rebuild it.', 28, { 2: LIME }], [10.55, 11.3, 'We run your posts.', 28, { 3: LIME }], [11.35, 12.25, 'We lock it down.', 28, { 3: LIME }],
      [15.85, 16.4, 'Send this to a founder', 28], [16.4, 16.95, 'with a leaky site.', 28, { 2: RED }],
    ], { style: 'pill' });
    const so = P.signoff({});
    so.style.color = 'rgba(4,18,26,.8)';                                   // it sits on the aqua flood
    S.name = 'Aquarii Tech Studio';
    return { ok: true };
  };

  S.update = function (E, t) { P.update(t); };

  S.cover = function () {
    E.frame = 360; S.update(E, 12.0);
    P.front.style.opacity = '0';
    E.el('div', `position:absolute;left:30px;top:96px;width:342px;color:#fff;font:900 46px/.98 Archivo,sans-serif;font-variation-settings:"wdth" 76;letter-spacing:-.02em;background:${INK};box-shadow:0 0 0 40px ${INK}`, E.scene, `Your site is <span style="color:${RED}">leaking</span>`);
  };
  S.cues = () => T.cues || [];
})();
