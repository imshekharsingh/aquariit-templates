// FILM, theme `soft3d` (B1 clay character), 20 s, service `security`. The first soft3d film, made to the Aurelia finish.
// BRIEF (creative director, written before the build)
//   Idea: your website is a clay creature with feelings. Bun (the mascot of Plumpaw, a pet daycare site we designed) is the site; its mood is the
//   site's health. Bots and neglect make it scared and grey; Aquarii puts a glass shield round it and keeps it patched; it ends proud and in love.
//   Palette: restrained plum-black studio (#0d0b14) + one radiant clay body whose colour follows the mood: peach (happy), cold steel (scared),
//   moss grey (worried), mint (determined, the Aquarii colour), lilac (wink), rose (love), gold (proud). Threats are coral-red sparks.
//   Type: Baloo 2 (rounded display) for the one line per shot, Geologica small caps for the numbered kicker, both from the template.
//   Hero object: Bun, ~250 px wide in the centre third, soft-3D from shading only (tint, gloss, inner shade, rim, contact shadow, mood halo).
//   Atmosphere: a mood-coloured key light, a soft floor pool, dust and bokeh at three depths, light leaks on the cuts, grade, vignette, live grain,
//   a handheld camera that never holds a framing for more than ~2.6 s.
//   Shots (cut or camera move every <= 2.7 s; easing: bold/bouncy springs for the character, swing for the camera, glide for light):
//   0-2.7    Bun drops in from above (frame 0 is mid-fall), squash on landing, happy -> wink; hook on screen; slow push-in
//   2.7-5.3  CUT closer: 3 a.m., red bot sparks stream in and hit; scared (shake) -> worried (sweat); camera drifts left
//   5.3-7.7  pull back: three warning chips (SSL expired, 14 old plugins, backup: never); worried -> scared; light goes cold
//   7.7-8.05 the breath: everything dims and holds
//   8.05-10.6 BIG MOMENT: a mint glass shield draws itself round Bun, bots burst on it with ripples; determined + a hop; push-in
//   10.6-13.2 four clay badges orbit (SSL renewed, updates, daily backups, firewall), each ticks on; wink -> proud; lateral dolly
//   13.2-16.0 Bun steps aside, the real Plumpaw site scrolls in a phone; love, hearts at three depths; camera eases right
//   16.0-17.6 close-up: proud, sparkles; "Website care by Aquarii."
//   17.6-20  P.brandEnd (grade 'clay'); the loop returns to Bun falling in.
(function () {
  const E = window.FilmEngine, P = window.FilmParts, { clamp, lerp } = E, S = (E.story = {});
  S.selfStage = true;
  S.dna = {
    service: 'security', theme: 'soft3d', format: 'problem -> fix',
    opening: 'a clay mascot drops into a dark studio mid-fall, squashes on landing and smiles while the hook reads "Your website has moods"',
    bigMoment: 'a mint glass hex shield draws itself round the scared clay mascot and red bot sparks burst on it while the mascot turns mint and determined',
    ground: 'plum-black studio with a key light and floor pool that change colour with the mascot mood, dust and bokeh at three depths, grain and vignette',
    music: 'playful soft electronic with plucks and a bouncy bass, tension in the bot section, a riser into the shield and a warm resolve, about 112 BPM',
  };
  const INK = '#0d0b14', MINT = '#4df0b8', RED = '#ff4d6a', CREAM = '#fff4ea';
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const io = (k) => P.EASE.swing(clamp(k));
  const noise = (t, s) => Math.sin(t * 1.7 + s) * .5 + Math.sin(t * 2.9 + s * 2.1) * .3 + Math.sin(t * 4.3 + s * 3.7) * .2;
  const DISP = "'Baloo 2',ui-rounded,sans-serif", TXT = "Geologica,system-ui,sans-serif";

  S.setup = async function () {
    document.documentElement.classList.add('reel');
    await P.ready; await document.fonts.ready;
    await Promise.all(['800 30px "Baloo 2"', '600 12px Geologica'].map((f) => document.fonts.load(f)));
    const srcMain = document.querySelector('main');
    const { world } = P.scene({ accent: MINT, ink: INK, glow: 'rgba(255,148,102,.10)', len: 20 });
    P.use('opener', 'clay-drop'); P.use('transition', 'mood-colour-cut'); P.use('payoff', 'mood-bloom'); P.use('type', 'kicker-line-rounded'); P.use('focus', 'mood-key-light');

    // ---------- studio: key light (mood colour), floor, camera rig ----------
    const key = E.el('div', 'position:absolute;left:-180px;top:40px;width:762px;height:640px;border-radius:50%;opacity:.9', world);
    const rig = E.el('div', 'position:absolute;inset:0;transform-origin:201px 380px', world);
    const floor = E.el('div', 'position:absolute;left:-240px;top:470px;width:882px;height:420px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,236,220,.07),rgba(255,236,220,0))', rig);
    const rings = E.el('div', 'position:absolute;left:-100px;top:400px;width:602px;height:190px;border-radius:50%;border:1px solid rgba(255,236,220,.06);box-shadow:0 0 0 46px rgba(255,236,220,.015)', rig);
    const BX = 201, BY = 470;   // Bun's feet

    // ---------- bots (red sparks that fly at Bun; after 8.05 they burst on the dome) ----------
    const domeR = 168, domeY = BY - 115;
    const BOTS = Array.from({ length: 22 }, (_, i) => {
      const t0 = i < 12 ? 2.75 + i * .38 : 8.15 + (i - 12) * .22, ang = (i * 2.399) % (Math.PI * 2), side = i % 2 ? 1 : -1;
      const sx = BX + side * (260 + (i % 3) * 30), sy = 120 + ((i * 97) % 420);
      return { t0, dur: .75 + (i % 3) * .12, sx, sy, ang, el: E.el('div', `position:absolute;left:0;top:0;width:22px;height:22px;margin:-11px;opacity:0;transform-origin:50% 50%`, rig,
        `<svg viewBox="0 0 14 14" width="22" height="22" style="overflow:visible"><path d="M7 0L14 7 7 14 0 7z" fill="${RED}" style="filter:drop-shadow(0 0 5px ${RED}) drop-shadow(0 0 12px ${RED})"/><circle cx="7" cy="7" r="2" fill="#ffe0e6"/></svg>`) };
    });
    const sparks = BOTS.map(() => E.el('div', `position:absolute;left:0;top:0;width:44px;height:44px;margin:-22px;border-radius:50%;opacity:0;border:2px solid ${RED};box-shadow:0 0 14px ${RED}`, rig));
    const hits = [];
    BOTS.forEach((b) => {
      const target = b.t0 >= 8.1 ? [BX + Math.cos(b.ang) * domeR, domeY + Math.sin(b.ang) * domeR * .98] : [BX + Math.cos(b.ang) * 92, BY - 110 + Math.sin(b.ang) * 80];
      b.tx = target[0]; b.ty = target[1];
      if (b.t0 >= 8.1) hits.push([b.t0 + b.dur, Math.atan2(b.ty - domeY, b.tx - BX)]);
    });

    // ---------- Bun ----------
    const bun = P.clay(rig, { x: BX, y: BY, size: 250,
      moods: [[0, 'happy'], [1.65, 'wink'], [2.7, 'scared'], [4.05, 'worried'], [5.3, 'sleepy'], [6.45, 'scared'], [8.05, 'determined'], [9.4, 'proud'], [10.6, 'wink'], [11.9, 'proud'], [13.2, 'love'], [14.6, 'happy'], [15.3, 'love'], [16.0, 'proud']],
      drop: { t: -.76, h: 410, dur: .8 }, hops: [{ t: 8.7, h: 46, dur: .62 }, { t: 12.0, h: 30, dur: .5 }, { t: 14.55, h: 40, dur: .55 }, { t: 16.1, h: 52, dur: .62 }],
      blinks: [1.2, 3.6, 6.0, 7.2, 10.1, 11.5, 13.9, 16.9] });
    bun.place([[0, { x: BX, y: BY, s: 1 }], [13.15, { x: BX, y: BY, s: 1 }], [13.9, { x: 118, y: BY + 10, s: .74 }], [15.7, { x: 128, y: BY + 10, s: .74 }], [16.2, { x: BX, y: BY - 6, s: 1.04 }]]);
    bun.fx('sparkles', .7, 2.5, { n: 9 }).fx('sweat', 4.1, 5.2, { n: 4, spread: .7 }).fx('zzz', 5.4, 6.3, { n: 4, spread: .8 }).fx('sparkles', 9.4, 10.5, { n: 9, colour: MINT })
      .fx('hearts', 13.3, 15.9, { n: 12 }).fx('sparkles', 16.0, 17.6, { n: 12 });
    const dome = P.dome(rig, { x: BX, y: domeY, r: domeR, at: 8.05, colour: MINT, hits, out: 13.05 });

    // ---------- warning chips (5.3-7.7) and care badges (10.6-13.2) ----------
    const chip = (html, colour) => E.el('div', `position:absolute;left:0;top:0;display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:16px;white-space:nowrap;opacity:0;
      background:linear-gradient(160deg,#2a2238,#1a1526);border:1px solid rgba(255,236,220,.12);box-shadow:0 18px 30px -14px #000,inset 0 1px 0 rgba(255,255,255,.1);font:600 14px/1 ${TXT};color:${CREAM}`, rig,
      `<i style="width:10px;height:10px;border-radius:50%;background:${colour};box-shadow:0 0 10px ${colour}"></i>${html}`);
    const warns = [[chip('SSL expired', RED), 30, 196, 5.45], [chip('14 plugins out of date', RED), 30, 244, 5.75], [chip('Last backup: never', '#ffc56b'), 30, 520, 6.05]];
    warns.forEach(([el]) => { el.style.zIndex = 4; });
    const badgeSvg = (d) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06281d" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
    const badge = (label, d) => E.el('div', `position:absolute;left:0;top:0;display:flex;align-items:center;gap:8px;padding:9px 14px 9px 9px;border-radius:18px;white-space:nowrap;opacity:0;
      background:radial-gradient(circle at 30% 25%,#e8fff6,#9af7d6 40%,#3fd9a3);box-shadow:inset -4px -6px 10px rgba(13,92,68,.35),inset 3px 3px 6px rgba(255,255,255,.6),0 16px 26px -12px #000;font:700 14px/1 ${TXT};color:#06281d`, rig,
      `<span style="display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.55)">${badgeSvg(d)}</span>${label}<b class="tk" style="margin-left:2px;font-size:15px;opacity:0">✓</b>`);
    const BADGES = [badge('SSL renewed', '<rect x="5" y="11" width="14" height="10" rx="3"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'), badge('Updates', '<path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v5h-5"/>'),
      badge('Daily backups', '<path d="M7 18a5 5 0 0 1-.6-10A6 6 0 0 1 18 9a4.5 4.5 0 0 1-1 9z"/>'), badge('Firewall', '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>')];

    // ---------- the real site in a phone (13.2-16.0) ----------
    const phone = E.el('div', `position:absolute;left:206px;top:196px;width:172px;height:352px;border-radius:30px;background:#05040a;padding:7px;opacity:0;
      box-shadow:0 0 0 1.5px rgba(255,236,220,.18),0 40px 70px -24px #000,0 0 50px -14px rgba(255,111,168,.45)`, rig);
    const scr = E.el('div', `position:relative;width:100%;height:100%;border-radius:24px;overflow:hidden;background:${INK}`, phone);
    const site = srcMain.cloneNode(true); site.id = 'phSite'; site.style.cssText = `position:absolute;left:0;top:0;width:402px;transform-origin:0 0`; scr.appendChild(site);
    E.el('style', null, document.head, '#phSite *{animation:none!important} #phSite .rv,#phSite .port{opacity:1!important;translate:none!important;scale:none!important;-webkit-mask:none!important;mask:none!important}');
    const PK = 158 / 402;
    const pill = E.el('div', `position:absolute;left:10px;right:10px;bottom:10px;height:26px;border-radius:10px;background:#191426;border:1px solid rgba(255,236,220,.1);display:flex;align-items:center;justify-content:space-between;padding:0 4px 0 8px;font:800 10px/1 ${DISP};color:${CREAM}`, scr,
      `plumpaw<i style="font:700 8px/1 ${TXT};font-style:normal;padding:5px 7px;border-radius:6px;background:${MINT};color:#06281d">Book</i>`);
    const toast = E.el('div', `position:absolute;left:-26px;top:112px;display:flex;align-items:center;gap:8px;padding:9px 12px;border-radius:14px;background:#fff4ea;color:#2a1206;font:700 12px/1.1 ${TXT};white-space:nowrap;opacity:0;box-shadow:0 14px 28px -10px #000`, phone,
      `<span style="width:22px;height:22px;border-radius:7px;background:${MINT};display:grid;place-items:center;font-size:12px">🐾</span>New booking · Fri 18`);

    // ---------- front: captions, hook, leaks, grade, vignette, grain ----------
    const hook = E.el('div', 'position:absolute;left:28px;right:28px;top:118px;text-align:center;text-shadow:0 4px 24px rgba(13,11,20,.8)', P.front,
      `<div style="font:800 40px/1.0 ${DISP};letter-spacing:-.02em;color:${CREAM}">Your website<br>has <span style="background:linear-gradient(100deg,#ffc56b,#ff9466 55%,#ff6fa8);-webkit-background-clip:text;background-clip:text;color:transparent">moods.</span></div>
       <div style="margin-top:10px;font:600 13px/1 ${TXT};letter-spacing:.28em;text-transform:uppercase;color:rgba(255,236,220,.7)">Watch closely</div>`);
    const hookWords = [...hook.firstElementChild.childNodes];
    const CAP = [[2.75, 5.25, '02 · 3:12 AM', 'Bots knock. All night.'], [5.35, 7.65, '03 · NO ONE WATCHING', 'Old, open, unbacked.'], [8.15, 10.55, '04 · AQUARII STEPS IN', 'Shields up.'],
      [10.65, 13.15, '05 · WATCHED 24/7', 'Patched, backed up, renewed.'], [13.3, 15.95, '06 · THE SITE WE PROTECT', 'Bookings keep coming.'], [16.05, 17.55, '07 · WEBSITE CARE', 'A happy site sells.']];
    const caps = CAP.map(([a, b, k, l]) => ({ a, b, el: E.el('div', 'position:absolute;left:30px;right:30px;top:116px;text-align:center;opacity:0', P.front,
      `<div class="kk" style="font:600 11px/1 ${TXT};letter-spacing:.26em;color:rgba(255,236,220,.72)">${k}</div><div style="margin-top:10px;font:800 31px/1.02 ${DISP};letter-spacing:-.02em;color:${CREAM}">${l}</div>`) }));
    const leak = E.el('div', 'position:absolute;inset:-20%;mix-blend-mode:screen;opacity:0', P.front);
    E.el('div', 'position:absolute;inset:0;background:linear-gradient(150deg,rgba(255,170,120,.10),rgba(0,0,0,0) 45%,rgba(120,90,255,.10));mix-blend-mode:soft-light', P.front);
    E.el('div', 'position:absolute;inset:0;background:radial-gradient(85% 70% at 50% 50%,rgba(0,0,0,0),rgba(0,0,0,.55))', P.front);
    const dim = E.el('div', 'position:absolute;inset:0;background:#05040a;opacity:0', P.front);
    const flash = E.el('div', `position:absolute;inset:0;background:radial-gradient(55% 45% at 50% 52%,#eafff7,${MINT} 55%,rgba(77,240,184,0));mix-blend-mode:screen;opacity:0`, P.front);
    const bok = Array.from({ length: 6 }, (_, i) => ({ el: E.el('div', `position:absolute;width:${26 + (i % 3) * 18}px;height:${26 + (i % 3) * 18}px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,226,200,${.14 + (i % 3) * .05}),rgba(255,226,200,0));filter:blur(${2 + (i % 3) * 2}px)`, P.front), x: (i * 113) % 402, y: (i * 151 + 60) % 715, s: .5 + (i % 4) * .2 }));
    const gc = E.el('canvas', 'position:absolute;inset:0;width:402px;height:715px;opacity:.075;mix-blend-mode:overlay', P.front); gc.width = 201; gc.height = 358; const gx = gc.getContext('2d'), gimg = gx.createImageData(201, 358);
    P.brandEnd({ at: 17.6, keyword: 'SAFE', why: 'Is your website actually protected?', grade: 'clay' });

    // camera keys: [t, x, y, z, roll]; a duplicated time = a hard cut. Swing-eased between keys.
    const CAM = [[0, 201, 360, 1.0, 0], [2.7, 201, 352, 1.1, -.6], [2.7, 214, 372, 1.32, 1.2], [5.3, 176, 380, 1.26, -.8], [5.3, 186, 368, 1.0, 0], [7.7, 190, 372, 0.94, .6],
      [8.05, 201, 360, 0.9, 0], [10.6, 201, 356, 1.08, -1.0], [10.6, 201, 350, 0.96, 0], [13.2, 214, 356, 1.06, 1.0], [13.2, 214, 372, 1.0, 0], [16.0, 236, 372, 1.08, -.8], [16.0, 201, 346, 1.24, 0], [17.6, 201, 340, 1.36, .5]];
    const camAt = (t) => { let i = 0; while (i < CAM.length - 1 && CAM[i + 1][0] <= t) i++; const a = CAM[i], b = CAM[i + 1]; if (!b || b[0] - a[0] < 1e-6) return a.slice(1);
      const k = io((t - a[0]) / (b[0] - a[0])); return [1, 2, 3, 4].map((j) => j === 3 ? Math.exp(lerp(Math.log(a[j]), Math.log(b[j]), k)) : lerp(a[j], b[j], k)); };

    // ---------- the timeline ----------
    P.on((t) => {
      const [cx, cy, cz, cr] = camAt(t);
      rig.style.transform = `translate(${(201 - cx + noise(t, 1) * 1.6).toFixed(2)}px,${(380 - cy + 20 + noise(t, 4) * 1.4).toFixed(2)}px) rotate(${(cr + noise(t, 7) * .2).toFixed(3)}deg) scale(${cz.toFixed(4)})`;
      const mc = bun.colour(t);
      key.style.background = `radial-gradient(closest-side,${P.hexA(mc, .30)},${P.hexA(mc, .08)} 55%,${P.hexA(mc, 0)})`;
      key.style.transform = `translate(${(Math.sin(t * .3) * 24).toFixed(1)}px,${(Math.cos(t * .23) * 18).toFixed(1)}px)`;
      floor.style.opacity = (.7 + .3 * Math.sin(t * .7)).toFixed(3); rings.style.transform = `scale(${(1 + .03 * Math.sin(t * 1.1)).toFixed(4)})`;
      bok.forEach((b) => { b.el.style.transform = `translate(${((b.x + t * 8 * b.s) % 440 - 20).toFixed(1)}px,${((b.y - t * 12 * b.s + 800) % 760 - 30).toFixed(1)}px)`; });

      // hook: words spring up at 0.15 / 0.35, kicker at 0.7; leaves at 2.5
      { const k1 = .55 + .45 * P.springAt(t, 0, 'bold'), o = (1 - P.tween(t, 2.45, .22, 'snap'));
        hook.style.opacity = o.toFixed(3); hook.firstElementChild.style.transform = `translateY(${((1 - k1) * 22).toFixed(1)}px)`;
        hook.lastElementChild.style.opacity = P.springAt(t, .35, 'fade').toFixed(3); void hookWords; }
      caps.forEach(({ a, b, el }) => { const k = P.springAt(t, a, 'bold'), o = P.springAt(t, a, 'fade') * (1 - P.tween(t, b - .22, .22, 'snap')); el.style.opacity = o.toFixed(3); el.style.transform = `translateY(${((1 - k) * 16).toFixed(1)}px)`; });

      // bots
      BOTS.forEach((b, i) => { const u = (t - b.t0) / b.dur; const sp = sparks[i];
        if (u < 0 || u > 1) b.el.style.opacity = '0';
        else { const k = P.EASE.snap(u) * .6 + u * .4, x = lerp(b.sx, b.tx, k) + Math.sin(u * 9 + i) * 10 * (1 - u), y = lerp(b.sy, b.ty, k);
          b.el.style.opacity = clamp(u * 5).toFixed(3); b.el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${(t * 360 + i * 40).toFixed(0)}deg)`; }
        const v = (t - b.t0 - b.dur) / .35; if (v > 0 && v < 1) { sp.style.opacity = (1 - v).toFixed(3); sp.style.transform = `translate(${b.tx.toFixed(1)}px,${b.ty.toFixed(1)}px) scale(${(.3 + 1.2 * P.EASE.glide(v)).toFixed(3)})`; sp.style.borderColor = b.t0 >= 8.1 ? MINT : RED; sp.style.boxShadow = `0 0 14px ${b.t0 >= 8.1 ? MINT : RED}`; } else sp.style.opacity = '0';
      });

      // warnings pop in on the left (clear of Instagram's right column), shake when a bot lands
      warns.forEach(([el, x, y, at]) => { const k = P.springAt(t, at, 'bold'), o = P.springAt(t, at, 'fade') * (1 - P.tween(t, 7.75, .2, 'snap')); el.style.opacity = o.toFixed(3);
        el.style.transform = `translate(${x + (1 - k) * -40 + Math.sin(t * 30) * (t > 6.45 && t < 6.8 ? 3 : 0)}px,${y}px) rotate(${((1 - k) * -8).toFixed(2)}deg)`; });

      // badges orbit in depth (10.6-13.2): an ellipse round Bun, near side bigger and in front
      BADGES.forEach((el, i) => { const at = 10.7 + i * .22, k = P.springAt(t, at, 'bold'), o = P.springAt(t, at, 'fade') * (1 - P.tween(t, 13.1, .2, 'snap'));
        const a = -Math.PI / 2 + i * Math.PI / 2 + (t - 10.6) * .9, d = Math.sin(a), x = BX + Math.cos(a) * 128 - 70, y = BY - 120 + d * 150, s = (.84 + .16 * d) * (.5 + .5 * k);
        el.style.opacity = o.toFixed(3); el.style.zIndex = d > 0 ? 5 : 0; el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) scale(${s.toFixed(3)})`;
        el.querySelector('.tk').style.opacity = P.springAt(t, at + .5, 'fade').toFixed(3); });
      bun.el.style.zIndex = 2;

      // phone: swings in from the right, the site scrolls, a booking toast lands
      { const k = P.springAt(t, 13.3, 'default'), o = P.springAt(t, 13.3, 'fade') * (1 - P.tween(t, 15.95, .2, 'snap'));
        phone.style.opacity = o.toFixed(3); phone.style.transform = `translate(${((1 - k) * 160).toFixed(1)}px,${((1 - k) * 30).toFixed(1)}px) rotate(${((1 - k) * 14 + 3).toFixed(2)}deg)`;
        const sy = io(seg(t, 13.9, 15.6)) * 860; site.style.transform = `translateY(${(-sy * PK).toFixed(1)}px) scale(${PK})`;
        const tk = P.springAt(t, 14.6, 'bold'); toast.style.opacity = (P.springAt(t, 14.6, 'fade')).toFixed(3); toast.style.transform = `translateY(${((1 - tk) * 20).toFixed(1)}px) scale(${(.8 + .2 * tk).toFixed(3)})`; void pill; }

      // breath before the shield, the mint flash on it, light leaks on the cuts
      dim.style.opacity = (.62 * clamp((t - 7.7) / .12) * (1 - clamp((t - 8.02) / .08))).toFixed(3);
      flash.style.opacity = (.75 * Math.max(0, 1 - Math.abs(t - 8.12) / .28)).toFixed(3);
      const L = [[2.7, '255,77,106'], [5.3, '140,134,168'], [10.6, '166,139,255'], [13.2, '255,111,168'], [16.0, '255,197,107']];
      let lo = 0, lc = L[0][1]; L.forEach(([a, c]) => { const v = Math.max(0, 1 - Math.abs(t - a) / .32) * .5; if (v > lo) { lo = v; lc = c; } });
      leak.style.opacity = lo.toFixed(3); leak.style.background = `radial-gradient(40% 35% at 18% 28%,rgba(${lc},.9),rgba(${lc},0) 70%),radial-gradient(35% 30% at 86% 74%,rgba(${lc},.55),rgba(${lc},0) 70%)`;

      // grain: fresh noise every frame
      const d = gimg.data; let s = (Math.floor(t * 30) * 2654435761) >>> 0; for (let i = 0; i < d.length; i += 4) { s = (s * 1664525 + 1013904223) >>> 0; const v = s >>> 24; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; } gx.putImageData(gimg, 0, 0);
    });
    S.name = 'Bun, the website with moods (soft3d v1)';
    return { ok: true };
  };
  S.update = function (E, t) { P.update(t); };
  S.cues = () => [];
})();
