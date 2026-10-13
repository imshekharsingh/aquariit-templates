// Dantika Dental · "The Night Shift": a Swiss-precise time-lapse at 100 BPM. The hook builds on flat Swiss red, the day page books one slot,
// a shutter falls (day -> night, the primary transition), the after-hours checklist ticks itself, fees slide past in rupees, a held breath on the
// empty night diary, then it fills on the beats while the tally counts. The answer card closes and a red wipe returns to frame 0 (loop).
(function () {
  const E = window.FilmEngine, T = window.FILM_T, { clamp, lerp, ease, W, H } = E, $ = E.$, $$ = E.$$, S = (E.story = {});
  S.selfStage = true;
  const RED = '#e3262f', NIGHT = '#0f1226';

  S.setup = async function () {
    document.documentElement.classList.add('reel');
    await new Promise((r) => setTimeout(r, 1700));                 // let the page's own 1.3 s timer run, then cut every live observer/timer off by cloning <main>
    const main = $('main'), clone = main.cloneNode(true); main.replaceWith(clone);
    E.el('style', null, document.head, `
      .bar{position:relative!important} .back{display:none!important}
      .js .rv{opacity:1;transform:none;transition:none}
      .row{animation:none!important}
      .s{transition:none!important}
      main>section:not(:first-child):not(.night){margin-top:420px!important}
      .night{margin-top:420px!important;padding:260px 0!important}
      .endc{margin-top:420px!important}
    `);
    // hero slot: back to free, the film books it on the beat
    const red = $('.grid .s.new'); if (red) { red.className = 's'; red.textContent = '9:30'; }
    E.thu = [...$$('.grid .s')][3];
    $$('#ns [data-n], #ns .s.nt.new').forEach((s) => { s.className = 's nt'; s.textContent = '—'; });
    E.slots = [...$$('#ns .s.nt')]; E.tally = $('#tally');
    E.stage();
    // the page's own load animations (headline rise, booked bubble) run on film time from the hook cut
    E.hero = []; document.getAnimations().forEach((a) => { if (a.timeline === document.timeline) { a.pause(); E.hero.push(a); } });

    const R = (E.world = E.measure(() => {
      const r = (s) => E.rect(s), hd = (id) => E.rect($(id).parentElement);
      const lis = $$('.check li').map((e) => E.rect(e));
      return { h1: r('h1'), chat: r('.chat'), cal: r('.cal'), nightHd: hd('#h-night'), lastLi: lis[lis.length - 1], trHd: hd('#h-tr'), row: r('.rowwrap'), nsHd: hd('#h-ns'), ns: r('#ns'), end: r('.endc'), endBtn: r('.endc .btn.p') };
    }));
    const hcy = R.h1.y + (H / 2 - 118), dy = (z) => 28 / z, mid = (a, b) => (a + b) / 2;
    const nightCy = mid(R.nightHd.y, R.lastLi.b) + dy(.95), trCy = mid(R.trHd.y, R.row.b) + dy(.95), nsCy = mid(R.nsHd.y, R.ns.b) + dy(.95);
    const K = [], k = (t, x, y, z, o = {}) => K.push(Object.assign({ t, x, y, z }, o));
    k(0, 201, hcy, 1.0); k(T.hookCut, 201, hcy, 1.0);
    k(T.push[0], 201, hcy + 8, 1.03, { e: 'lin' });
    k(T.push[1], 201, R.chat.cy, 1.32, { e: 'io3' });                                   // push into the booking as it lands
    k(T.shutter[1], 201, R.chat.cy, 1.36, { e: 'lin' });
    k(T.shutter[1], 201, nightCy, .95);                                                  // cut under the shutter: night
    k(T.whip1[0], 201, nightCy - 6, 1.0, { e: 'lin' });
    k(T.whip1[1], 201, trCy, .95, { e: 'io3' });                                         // whip to the fees
    k(T.cut3, 201, trCy - 6, .98, { e: 'lin' });
    k(T.cut3, 201, nsCy, .95);                                                           // hard cut: the empty night diary
    k(T.fills[0], R.ns.cx, R.ns.cy + 10, 1.12, { e: 'in2' });                            // slow push through the breath
    k(T.whip2[0], R.ns.cx, R.ns.cy + 10, 1.06, { e: 'outX' });
    k(T.whip2[1], 201, R.end.cy, 1.0, { e: 'io3' });                                     // whip to the answer
    k(T.wipe[1], 201, R.end.cy, 1.04, { e: 'lin' });
    E.keys = K;

    // per-word answer, buttons, checklist rows, fee cards
    const ew = E.splitWords($('#h-end'));                                                // Book tonight. / Smile tomorrow.
    ew.forEach((w, i) => E.reveal(w, i < 2 ? T.endWords[0] + i * .06 : T.endWords[1] + (i - 2) * .06, null, .55));
    E.tween($('.endc .mono'), [{ opacity: 0 }, { opacity: 1 }], T.endWords[0] - .1, .3, 'ease-out');
    E.tween($('.endc p'), [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], T.btns - .2, .6);
    $$('.endc .btn').forEach((b, i) => E.tween(b, [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], T.btns + i * .12, .6));
    $$('.check li').forEach((li, i) => E.tween(li, [{ opacity: 0, transform: 'translateX(-24px)' }, { opacity: 1, transform: 'none' }], T.ticks[i] - .12, .5));
    E.tween($('#h-night').parentElement, [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], T.shutter[1] + .15, .6);
    $$('.card').forEach((c, i) => E.tween(c, [{ opacity: 0, transform: 'translateY(30px)' }, { opacity: 1, transform: 'none' }], (T.cards[i] ?? T.cards[2] + .3) - .1, .6));
    E.checks = $$('.check path');

    // hook card on flat Swiss red: 4 chunks on the beats, sized to the 30 px gutters
    const card = E.el('div', `position:absolute;left:30px;top:140px;width:342px;color:#fff;font:900 46px/.98 Archivo,sans-serif;font-variation-settings:"wdth" 72;text-transform:uppercase;letter-spacing:-.005em`, E.cards, 'Is your clinic missing patients after 8 pm?');
    const words = E.splitWords(card), chunk = [0, 0, 1, 1, 2, 2, 3, 3];
    words.forEach((w, i) => E.reveal(w, chunk[i] * .6 - .12 + (i % 2) * .05, null, .5));
    E.hookCard = card;
    return R;
  };

  S.update = function (E, t) {
    const R = E.world, tf = E.frame / 30;
    const c = E.camAt(t), sp = E.camSpeed(t); E.applyCam(c, clamp((sp.y - 1500) * 0.012, 0, 34));
    E.hero.forEach((a) => { a.currentTime = (t - T.hookCut + .15) * 1000; });
    // the booking lands: Thursday 9:30 turns red with a pop
    const u = clamp((t - T.slotRed) / .45);
    if (t >= T.slotRed) { E.thu.style.background = RED; E.thu.style.borderColor = RED; E.thu.style.color = '#fff'; E.thu.style.transform = `scale(${lerp(.6, 1, ease.spring(u))})`; }
    else { E.thu.style.background = ''; E.thu.style.borderColor = ''; E.thu.style.color = ''; E.thu.style.transform = ''; }
    // checklist ticks draw on the beats
    E.checks.forEach((p, i) => { p.style.strokeDashoffset = String(1 - ease.out3(clamp((t - T.ticks[i]) / .4))); });
    // fees slide past (the page's own scroll-driven slide, driven by the film clock)
    $('.row').style.transform = `translateX(${(-424 * ease.io3(clamp((t - T.rowSlide[0]) / (T.rowSlide[1] - T.rowSlide[0])))).toFixed(1)}px)`;
    // the night diary fills on the beats; numbers read at the frame time
    const names = ['A. Rao', 'S. Khan', 'P. Iyer', 'M. Das', 'R. Jain'];
    let n = 0;
    E.slots.forEach((s, i) => {
      const on = t >= T.fills[i], v = clamp((t - T.fills[i]) / .4);
      if (on) { s.style.background = RED; s.style.borderColor = RED; s.style.color = '#fff'; s.textContent = names[i]; s.style.transform = `scale(${lerp(.55, 1, ease.spring(v))})`; }
      else { s.style.background = ''; s.style.borderColor = ''; s.style.color = ''; s.textContent = '—'; s.style.transform = ''; }
      if (tf >= T.fills[i]) n++;
    });
    E.tally.textContent = String(n);
    // overlays: hook on red, the night shutter, the red loop wipe
    let fo = 0, bg = RED, clip = 'none';
    if (t < T.hookCut) fo = 1;
    const [s0, s1, s2] = T.shutter;
    if (t >= s0 && t < s1) { fo = 1; bg = NIGHT; clip = `inset(0 0 ${((1 - ease.io3((t - s0) / (s1 - s0))) * 100).toFixed(2)}% 0)`; }
    if (t >= s1 && t < s2) { fo = 1; bg = NIGHT; clip = `inset(${(ease.io3((t - s1) / (s2 - s1)) * 100).toFixed(2)}% 0 0 0)`; }
    if (t >= T.wipe[0]) { fo = 1; bg = RED; clip = `inset(${((1 - ease.io3(clamp((t - T.wipe[0]) / (T.wipe[1] - T.wipe[0] - .08)))) * 100).toFixed(2)}% 0 0 0)`; }
    E.field.style.opacity = fo; E.field.style.background = bg; E.field.style.clipPath = clip;
    E.hookCard.style.display = t < T.hookCut ? 'block' : 'none';
    // vignette: closes during the breath
    let v = .12; if (t >= T.cut3 && t < T.fills[0]) v = lerp(.12, .42, ease.outX(clamp((t - T.breath[0] + .4) / 1.0))); E.vig.style.opacity = v;
  };

  // the cover poster: the hook as Swiss type on red, the night diary as the image
  S.cover = function () {
    E.cam.style.display = 'none'; E.field.style.opacity = 0; E.vig.style.opacity = .25;
    const r = E.el('div', `position:absolute;inset:0;background:${RED}`, E.cards);
    E.el('div', 'position:absolute;left:30px;top:150px;font:500 11px/1 "Geist Mono",monospace;letter-spacing:.1em;color:#fff;text-transform:uppercase', r, 'Dantika Dental · after 8 pm');
    E.el('div', 'position:absolute;left:30px;top:176px;width:342px;color:#fff;font:900 54px/.95 Archivo,sans-serif;font-variation-settings:"wdth" 70;text-transform:uppercase', r, 'Missing<br>patients<br>after 8 pm?');
    const g = E.el('div', 'position:absolute;left:30px;top:378px;width:342px;background:#fff;border:2px solid #121212;padding:12px', r);
    E.el('div', 'font:500 10px/1 "Geist Mono",monospace;letter-spacing:.08em;text-transform:uppercase;color:#121212;margin-bottom:10px', g, 'Night diary · booked while closed');
    const cells = E.el('div', 'display:grid;grid-template-columns:1fr 1fr;gap:6px', g);
    ['A. Rao', '9:30', '10:15', 'S. Khan', 'P. Iyer', 'M. Das', '11:45', 'R. Jain'].forEach((x) => E.el('div', `height:30px;display:flex;align-items:center;justify-content:center;font:500 11px/1 "Geist Mono",monospace;${/\d/.test(x) ? 'background:#121212;color:#f6f5ef' : `background:${RED};color:#fff`}`, cells, x));
  };
  S.cues = () => T.cues;
})();
