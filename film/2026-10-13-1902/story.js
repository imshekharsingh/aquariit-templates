// Dantika Dental · "After 8" (v2). A colour script, not a page pan: the clinic's clock runs from golden hour through dusk into night and back to dawn.
// The clinic building's windows are the appointment diary: at night they light up one by one as WhatsApp bookings arrive, and dawn turns them gold.
// Dawn returns the colours of frame 0, so the loop IS the story (every evening the same thing happens again).
// Built as a scene of layers (sky, sun, clouds, stars, skyline, the clinic, a floating phone showing the real page, glass message cards, kinetic type),
// all drawn from film time. Offline rendering means real blur, glass and glow are allowed here (they are not allowed on the live page).
(function () {
  const E = window.FilmEngine, T = window.FILM_T, { clamp, lerp, ease, W, H } = E, $ = E.$, $$ = E.$$, S = (E.story = {});
  S.selfStage = true;
  const sm = (a, b, t) => ease.io3(clamp((t - a) / (b - a)));          // smooth 0..1 over [a,b]
  const css = (el, o) => { for (const k in o) el.style[k] = o[k]; };

  // ---------- colour script: [top, mid, horizon] per key, mixed in oklch by the browser ----------
  const SKY = {
    gold: ['#f59ac0', '#ffc39c', '#fff1cf'],     // golden hour: rose top, peach, butter horizon (not the usual orange)
    dusk: ['#3d2a92', '#c43b98', '#ff8a6b'],     // dusk: violet, magenta, coral glow
    night: ['#030622', '#0b1d5c', '#2a2f8f'],    // night: ink, cobalt, electric indigo horizon
    dawn: ['#3b4aa8', '#ff8fb0', '#ffd1a1'],     // dawn: periwinkle, pink, peach
  };
  // weights of each palette over time (sum 1)
  function skyMix(t) {
    const w = { gold: 0, dusk: 0, night: 0, dawn: 0 };
    if (t < 2.4) w.gold = 1;
    else if (t < 4.8) { const k = sm(2.4, 4.8, t); w.gold = 1 - k; w.dusk = k; }
    else if (t < 7.2) { const k = sm(4.8, 7.2, t); w.dusk = 1 - k; w.night = k; }
    else if (t < 12.6) w.night = 1;
    else if (t < 14.4) { const k = sm(12.6, 14.4, t); w.night = 1 - k; w.dawn = k; }
    else if (t < 17.9) { const k = sm(14.4, 17.9, t); w.dawn = 1 - k; w.gold = k; }
    else w.gold = 1;
    return w;
  }
  const mixColor = (w, i) => {                                         // nested color-mix in oklch of the 4 palettes for stop i
    const parts = Object.entries(w).filter(([, v]) => v > 0.001);
    if (parts.length === 1) return SKY[parts[0][0]][i];
    const [[a, wa], [b, wb]] = parts; return `color-mix(in oklch, ${SKY[a][i]} ${(wa / (wa + wb) * 100).toFixed(2)}%, ${SKY[b][i]})`;
  };
  const nightness = (t) => { const w = skyMix(t); return w.night + w.dusk * .45; };

  // clock: 7:58 pm -> 8:00 at the cut -> 11:42 pm when the booking lands -> 5:59 in the breath -> 6:00 sunrise -> 9:00 am opening
  const CLOCK = [[0, 19 * 60 + 58], [2.4, 20 * 60], [5.4, 23 * 60 + 42], [8.4, 24 * 60 + 60], [12.0, 24 * 60 + 5 * 60 + 59], [12.6, 24 * 60 + 6 * 60], [15.6, 24 * 60 + 8 * 60 + 30], [17.4, 24 * 60 + 9 * 60], [18, 24 * 60 + 9 * 60]];
  function clockAt(t) { let i = 0; while (i < CLOCK.length - 2 && t >= CLOCK[i + 1][0]) i++; const [t0, m0] = CLOCK[i], [t1, m1] = CLOCK[i + 1]; const m = Math.floor(lerp(m0, m1, clamp((t - t0) / (t1 - t0)))) % (24 * 60); const h = Math.floor(m / 60), mm = m % 60, ap = h >= 12 ? 'PM' : 'AM', h12 = ((h + 11) % 12) + 1; return `${h12}:${String(mm).padStart(2, '0')} ${ap}`; }

  S.setup = async function () {
    document.documentElement.classList.add('reel');
    await new Promise((r) => setTimeout(r, 300));
    E.stage(); E.cam.style.display = 'none';
    E.stageEl.style.background = '#000';
    const L = (E.scene = E.el('div', 'position:absolute;inset:0;overflow:hidden', E.stageEl)); E.stageEl.insertBefore(L, E.fx);
    // sky + sun + clouds
    E.sky = E.el('div', 'position:absolute;inset:-2px', L);
    E.sun = E.el('div', 'position:absolute;left:0;top:0;width:260px;height:260px;margin:-130px 0 0 -130px;border-radius:50%;background:radial-gradient(circle,#fff6dc 0 18%,rgba(255,214,150,.85) 24%,rgba(255,170,110,.35) 45%,rgba(255,150,100,0) 70%)', L);
    E.moon = E.el('div', 'position:absolute;left:300px;top:150px;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;background:radial-gradient(circle at 38% 35%,#ffffff,#dfe6ff 55%,#b9c4ff 70%);box-shadow:0 0 30px 10px rgba(170,190,255,.35),0 0 90px 30px rgba(120,140,255,.18)', L);
    E.clouds = [[-40, 190, 260, 60, .55], [170, 250, 300, 70, .45], [40, 330, 220, 46, .35]].map(([x, y, w, h, o]) => { const c = E.el('div', `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:50%;filter:blur(18px);opacity:${o}`, L); c.dataset.x = x; return c; });
    // stars (deterministic): a canvas, 140 stars twinkling by film time
    const cv = E.el('canvas', 'position:absolute;inset:0;width:402px;height:715px', L); cv.width = 804; cv.height = 1430; E.starCtx = cv.getContext('2d'); E.starCv = cv;
    let s = 99991; const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    E.stars = Array.from({ length: 140 }, () => ({ x: rnd() * 804, y: rnd() * 900, r: .6 + rnd() * 1.9, p: rnd() * 6.28, f: 1.5 + rnd() * 3 }));
    // skyline (far) and the clinic (near): SVG, coloured per frame
    E.city = E.el('div', 'position:absolute;left:0;right:0;bottom:0;height:300px', L);
    E.city.innerHTML = `<svg viewBox="0 0 402 300" width="402" height="300" preserveAspectRatio="none" aria-hidden="true"><path class="far" d="M0 300V150h28v-30h24v40h18v-62h30v52h22v-34h26v60h20v-90h34v80h16v-40h30v56h22v-70h28v50h20v-28h26v116z"/><path class="far2" d="M0 300V200h40v-20h40v30h50v-16h60v26h40v-36h50v30h60v-18h62v104z"/></svg>`;
    // the clinic building: windows = the diary
    const B = (E.bld = E.el('div', 'position:absolute;left:96px;bottom:0;width:210px;height:410px;transform-origin:50% 100%', L));
    E.bldSide = E.el('div', 'position:absolute;left:100%;top:58px;bottom:0;width:26px;transform:skewY(-28deg);transform-origin:0 0', B);   // a side face: the building has depth
    E.bldBody = E.el('div', 'position:absolute;inset:44px 0 0 0;border-radius:6px 6px 0 0', B);
    E.roof = E.el('div', 'position:absolute;left:-8px;right:-8px;top:40px;height:8px;border-radius:2px', B);
    E.tank = E.el('div', 'position:absolute;right:22px;top:14px;width:30px;height:26px;border-radius:4px 4px 0 0', B);
    E.ant = E.el('div', 'position:absolute;left:30px;top:-14px;width:2px;height:54px', B); E.antDot = E.el('div', 'position:absolute;left:-2px;top:-3px;width:6px;height:6px;border-radius:50%;background:#ff3b5c', E.ant);
    E.sign = E.el('div', 'position:absolute;left:0;right:0;top:-34px;height:40px;display:flex;align-items:center;justify-content:center;font:800 15px/1 Archivo,sans-serif;font-variation-settings:"wdth" 125;letter-spacing:.12em;white-space:nowrap', B, '');
    E.signOpen = E.el('span', 'position:absolute;transition:none', E.sign, 'OPEN');
    E.signBook = E.el('span', 'position:absolute;transition:none', E.sign, 'BOOKING OPEN 24×7');
    E.wins = []; const grid = E.el('div', 'position:absolute;left:18px;right:18px;top:70px;display:grid;grid-template-columns:repeat(4,1fr);gap:12px 12px', B);
    for (let i = 0; i < 24; i++) { const w = E.el('div', 'height:34px;border-radius:3px;position:relative;overflow:hidden', grid); E.el('i', 'position:absolute;left:50%;top:0;bottom:0;width:2px;margin-left:-1px;background:rgba(0,0,0,.22)', w); E.el('i', 'position:absolute;left:0;right:0;top:46%;height:2px;background:rgba(0,0,0,.22)', w); E.el('i', 'position:absolute;left:-2px;right:-2px;bottom:-1px;height:3px;background:rgba(0,0,0,.28)', w); w.shine = E.el('i', 'position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.35),rgba(255,255,255,0) 45%)', w); E.wins.push(w); }
    E.door = E.el('div', 'position:absolute;left:50%;bottom:0;width:46px;height:62px;margin-left:-23px;border-radius:4px 4px 0 0', B);
    // which windows the night bookings light (and when), plus the ones lit by people at home (warm, random)
    E.bookWin = [[9, 'A. Rao'], [14, 'S. Khan'], [6, 'P. Iyer'], [19, 'M. Das'], [11, 'R. Jain']];
    // the phone: a generic device showing the real page in an iframe (no real-device silhouette)
    const P = (E.phone = E.el('div', 'position:absolute;left:96px;top:236px;width:210px;height:430px;border-radius:34px;background:linear-gradient(160deg,#2a2f4a,#0c0e18 60%);padding:9px;box-shadow:0 30px 60px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.25),inset 0 0 0 1.5px rgba(255,255,255,.08);transform-origin:50% 60%', L));
    const scr = E.el('div', 'position:relative;width:192px;height:412px;border-radius:26px;overflow:hidden;background:#f6f5ef', P);
    // the screen shows a frozen clone of the real page (same document, so the page's own CSS applies; clones carry no timers or observers)
    scr.id = 'phoneScr';
    const inner = (E.scrIn = E.el('div', 'position:absolute;left:0;top:0;width:402px;transform-origin:0 0', scr));
    E.cam.querySelectorAll(':scope > header, :scope > main, :scope > .bar').forEach((n) => inner.appendChild(n.cloneNode(true)));
    const st = E.el('style', null, document.head); st.textContent = '#phoneScr *,#phoneScr *::before,#phoneScr *::after{animation:none!important;transition:none!important} #phoneScr .rv{opacity:1!important;transform:none!important} #phoneScr .row{transform:none!important} #phoneScr header{position:relative!important}';
    inner.querySelectorAll('.check path').forEach((p) => { p.style.strokeDashoffset = '0'; });
    const red = inner.querySelector('.grid .s.new'); if (red) { red.className = 's'; red.textContent = '9:30'; } E.thu = [...inner.querySelectorAll('.grid .s')][3];
    E.glare = E.el('div', 'position:absolute;inset:0;border-radius:26px;background:linear-gradient(115deg,rgba(255,255,255,.22) 0,rgba(255,255,255,0) 32%,rgba(255,255,255,0) 70%,rgba(255,255,255,.08));pointer-events:none', scr);
    // glass message cards (real backdrop blur: allowed offline)
    const glass = 'position:absolute;padding:11px 14px;border-radius:18px;background:linear-gradient(140deg,rgba(255,255,255,.34),rgba(255,255,255,.12));border:1px solid rgba(255,255,255,.45);backdrop-filter:blur(14px) saturate(1.4);-webkit-backdrop-filter:blur(14px) saturate(1.4);box-shadow:0 18px 40px rgba(8,6,40,.35),inset 0 1px 0 rgba(255,255,255,.6);color:#fff;font:600 13.5px/1.3 Archivo,sans-serif';
    E.b1 = E.el('div', glass + ';left:30px;top:142px;width:238px', L, 'Can I come Thursday morning? Tooth pain since evening.<div style="font:500 9.5px/1 Geist Mono,monospace;opacity:.8;margin-top:6px">11:42 PM</div>');
    E.b2 = E.el('div', glass + ';left:118px;top:318px;width:222px;background:linear-gradient(140deg,rgba(214,255,70,.9),rgba(160,255,120,.72));color:#13210a;border-color:rgba(240,255,200,.9)', L, 'Booked ✓ Thu, 9:30 am<div style="font:500 9.5px/1.4 Geist Mono,monospace;margin-top:6px">₹200 held by UPI · reminder set</div>');
    E.b3 = E.el('div', glass + ';left:30px;top:420px;display:flex;align-items:center;gap:8px;font-size:12.5px', L, '<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 18s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z"/><circle cx="10" cy="8" r="2.2"/></svg>Maps pin sent');
    // night booking toasts: each booking lands as a glass notification under the clock while its window lights
    E.toastNames = [['A. Rao', 'Thu 9:30 am'], ['S. Khan', 'Thu 11:00 am'], ['P. Iyer', 'Fri 10:30 am'], ['M. Das', 'Sat 9:00 am'], ['R. Jain', 'Sat 12:30 pm']];
    E.toasts = E.toastNames.map(([n, d]) => E.el('div', glass + ';left:30px;top:222px;width:250px;display:flex;align-items:center;gap:10px;padding:9px 12px;font-size:12.5px;opacity:0', L, `<span style="width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#d6ff46,#7dffb0);display:grid;place-items:center;color:#13210a;font:800 11px/1 Archivo,sans-serif">✓</span><span><b style="font-weight:800">${n}</b> booked<br><span style="font:500 9.5px/1.3 Geist Mono,monospace;opacity:.85">${d} · ₹200 held</span></span>`));
    // HUD: the clock + tally
    E.clock = E.el('div', 'position:absolute;left:30px;top:104px;font:500 13px/1 "Geist Mono",monospace;letter-spacing:.14em;color:#fff;text-shadow:0 0 12px rgba(255,255,255,.55)', L, '');
    E.tally = E.el('div', 'position:absolute;left:30px;top:124px;font:500 10.5px/1.4 "Geist Mono",monospace;letter-spacing:.08em;color:#fff;opacity:.85;text-transform:uppercase', L, '');
    // kinetic type layers
    const kt = 'position:absolute;left:30px;width:350px;color:#fff;font:900 64px/.9 Archivo,sans-serif;text-transform:uppercase;white-space:nowrap';
    E.k1 = E.el('div', kt + ';top:118px', L); E.k2 = E.el('div', kt + ';top:176px', L); E.k3 = E.el('div', kt + ';top:234px', L);
    E.split = (el, text) => { el.innerHTML = ''; return [...text].map((ch) => E.el('span', 'display:inline-block;will-change:transform', el, ch === ' ' ? '&nbsp;' : ch)); };
    E.h1 = E.split(E.k1, 'Missing'); E.h2 = E.split(E.k2, 'patients'); E.h3 = E.split(E.k3, 'after 8 pm?');
    E.p1 = E.el('div', kt + ';top:118px;font-size:76px', L); E.p2 = E.el('div', kt + ';top:188px;font-size:44px', L); E.p3 = E.el('div', kt + ';top:230px;font-size:44px', L);
    E.q1 = E.split(E.p1, 'Booked'); E.q2 = E.split(E.p2, 'before you'); E.q3 = E.split(E.p3, 'even open.');
    // CTA glass
    E.cta = E.el('div', glass + ';left:30px;top:300px;width:342px;padding:18px 20px;border-radius:24px;color:#22123a', L, '<div style="font:500 10px/1 Geist Mono,monospace;letter-spacing:.12em;text-transform:uppercase;opacity:.8">Dantika Dental · demo clinic</div><div style="font:900 30px/1 Archivo,sans-serif;font-variation-settings:\'wdth\' 78;margin-top:10px;text-transform:uppercase">Booking open 24×7<br>on WhatsApp</div><div style="font:500 11px/1.4 Geist Mono,monospace;margin-top:8px;opacity:.85">Pick a slot · ₹200 held by UPI · reminder the night before</div><div style="display:inline-flex;align-items:center;gap:8px;margin-top:12px;padding:10px 14px;border-radius:99px;background:#1b1242;color:#fff;font:800 12px/1 Archivo,sans-serif;letter-spacing:.06em;text-transform:uppercase">Send "Hi" to book</div>');
    // light: sunrise flare + light leak (screen blend)
    E.flare = E.el('div', 'position:absolute;inset:-20%;mix-blend-mode:screen;opacity:0;background:radial-gradient(40% 30% at 50% 78%,rgba(255,236,190,1),rgba(255,160,120,.55) 40%,rgba(255,120,160,0) 75%)', L);
    E.leak = E.el('div', 'position:absolute;inset:0;mix-blend-mode:screen;opacity:0;background:linear-gradient(105deg,rgba(255,120,80,0) 20%,rgba(255,180,120,.9) 45%,rgba(255,90,160,.6) 60%,rgba(255,90,160,0) 80%)', L);
    E.vig.style.background = 'radial-gradient(120% 90% at 50% 45%,transparent 55%,rgba(10,6,30,.65) 100%)';
    return { ok: true };
  };

  // per-letter kinetic entry: width axis stretches from 125 (wide) to its target while the letter springs up; exit flies up and fades
  function letters(arr, t, at, out, { wFrom = 125, wTo = 74, stag = .03, dy = 50 } = {}) {
    arr.forEach((l, i) => {
      const u = clamp((t - at - i * stag) / .55), v = out == null ? 0 : clamp((t - out - i * .02) / .35);
      const k = ease.spring(u), o = clamp(u * 3) * (1 - ease.in2(v));
      l.style.transform = `translateY(${((1 - k) * dy - ease.in2(v) * 60).toFixed(1)}px)`;
      l.style.opacity = o.toFixed(3);
      l.style.fontVariationSettings = `"wdth" ${lerp(wFrom, wTo, ease.out3(u)).toFixed(1)}`;
    });
  }

  S.update = function (E, t) {
    const tf = E.frame / 30, w = skyMix(t), night = nightness(t);
    // ---- camera (scene-level): a slow drift, a pull into the building for the night diary, a small kick on the peak
    const zoomB = 1 + .3 * sm(8.4, 9.6, t) - .3 * sm(12.6, 14.0, t);
    const camY = -6 * Math.sin(t * .5) + (-60 * sm(8.4, 9.6, t) + 60 * sm(12.6, 14.0, t));
    // ---- sky
    E.sky.style.background = `linear-gradient(in oklch 180deg, ${mixColor(w, 0)} 0%, ${mixColor(w, 1)} 55%, ${mixColor(w, 2)} 100%)`;
    const sunY = 372 + 300 * sm(0, 4.6, t) - 300 * sm(12.0, 15.6, t);
    css(E.sun, { transform: `translate(62px,${(sunY + camY * .2).toFixed(1)}px)`, opacity: String(clamp(1 - night * 1.2)) });
    css(E.moon, { opacity: String(clamp((w.night - .2) * 1.4)), transform: `translateY(${(camY * .1).toFixed(1)}px)` });
    E.clouds.forEach((c, i) => { const dx = 46 * Math.sin(2 * Math.PI * t / 18) * (1 + i * .4); c.style.transform = `translate(${dx.toFixed(1)}px,${(camY * (.15 + i * .05)).toFixed(1)}px)`; c.style.background = `color-mix(in oklch, ${mixColor(w, 2)} 60%, ${night > .5 ? '#3a3080' : '#fff3e0'})`; });
    // stars
    const g = E.starCtx; g.clearRect(0, 0, 804, 1430); const so = clamp((night - .35) * 1.6);
    if (so > 0) for (const s of E.stars) { g.globalAlpha = so * (.45 + .55 * (.5 + .5 * Math.sin(s.p + tf * s.f))); g.fillStyle = '#fff'; g.beginPath(); g.arc(s.x, s.y + camY * .2, s.r, 0, 6.283); g.fill(); }
    // skyline + clinic colours follow the light
    const ink = `color-mix(in oklch, ${night > .5 ? '#0a0a26' : '#4a2346'} ${(60 + 40 * night).toFixed(0)}%, ${mixColor(w, 1)})`;
    E.city.querySelector('.far').setAttribute('fill', `color-mix(in oklch, ${mixColor(w, 1)} 55%, ${night > .5 ? '#151446' : '#7a3a5a'})`);
    E.city.querySelector('.far2').setAttribute('fill', `color-mix(in oklch, ${mixColor(w, 1)} 30%, ${night > .5 ? '#0c0c30' : '#5a2a4a'})`);
    E.city.style.transform = `translateY(${(camY * .35).toFixed(1)}px)`;
    E.bldBody.style.background = `linear-gradient(180deg, color-mix(in oklch, ${ink} 85%, #ffffff), ${ink})`;
    E.bldSide.style.background = `color-mix(in oklch, ${ink} 70%, #000)`; E.roof.style.background = `color-mix(in oklch, ${ink} 80%, #fff)`;
    E.tank.style.background = `color-mix(in oklch, ${ink} 75%, #fff)`; E.ant.style.background = `color-mix(in oklch, ${ink} 70%, #fff)`;
    E.antDot.style.opacity = night > .4 ? String(Math.floor(tf * 1.25) % 2 ? .25 : 1) : '.6'; E.antDot.style.boxShadow = night > .4 ? '0 0 10px 3px rgba(255,60,90,.6)' : 'none';
    E.door.style.background = night > .6 ? '#ffcf7a' : 'color-mix(in oklch, #ffd9a0 50%, transparent)';
    E.door.style.boxShadow = night > .6 ? '0 0 24px 6px rgba(255,200,110,.45)' : 'none';
    const bldY = 34 * (1 - sm(2.4, 3.4, t)) + 34 * sm(17.0, 18.0, t) + 20 * sm(8.4, 9.6, t) - 20 * sm(12.6, 14.0, t) - 6 * Math.sin(t * .5) * .6;   // sits low under the hook, settles, rises back into the loop
    E.bld.style.transform = `translateY(${bldY.toFixed(1)}px) scale(${zoomB.toFixed(4)})`;
    // windows: dusk -> a few homes lit; night -> the 5 bookings light up on the beats; dawn -> all lit windows turn gold then fade into day
    const lit = new Set([2, 17, 22]), reset = sm(16.8, 17.7, t);       // reset: booked windows hand back to daylight so the last frame matches frame 0
    E.wins.forEach((win, i) => {
      const bk = E.bookWin.findIndex(([n]) => n === i), at = bk >= 0 ? T.fills[bk] : null;
      let on = 0, gold = sm(12.6, 13.4, t);
      if (at != null) on = sm(at, at + .25, t) * (1 - reset); else if (lit.has(i)) on = clamp(night * 1.2) * .8;
      const day = 1 - clamp(night * 1.5);
      const base = `color-mix(in srgb, #1a1840 ${(70 * (1 - day)).toFixed(0)}%, color-mix(in oklch, ${mixColor(w, 2)} 60%, #ffffff))`;
      const warm = at == null ? '#c98a3e' : gold > 0 ? `color-mix(in oklch, #ffe066 ${(gold * 100).toFixed(0)}%, #ffb257)` : '#ffb257';
      win.style.background = on > .02 ? `color-mix(in srgb, ${warm} ${(on * 100).toFixed(0)}%, ${base})` : base;
      win.style.boxShadow = on > .02 ? `0 0 ${(14 * on).toFixed(1)}px ${(3 * on).toFixed(1)}px rgba(255,180,90,${(.55 * on).toFixed(2)})` : 'none';
      win.style.transform = at != null && t >= at ? `scale(${lerp(.7, 1, ease.spring(clamp((t - at) / .4))).toFixed(3)})` : 'none';
    });
    // the neon sign: OPEN (coral) flickers off at 8:00, BOOKING OPEN 24×7 (lime) flickers on at dusk; off at full daylight
    // 9:00 am: OPEN flickers back on at 17.2, so the last frame is the same sign as frame 0
    const flick = (t0, len) => { if (t < t0) return 0; const u = (t - t0) / len; if (u >= 1) return 1; const f = Math.sin(u * 47) * Math.sin(u * 13); return u < .7 ? (f > 0 ? 1 : .15) : 1; };
    const openOn = t < 2.4 ? 1 : t >= 17.2 ? flick(17.2, .4) : 1 - flick(2.4, .4), bookOn = flick(3.6, .6) * (1 - sm(16.2, 17.6, t));
    const neon = (c, a) => `0 0 4px ${c}, 0 0 12px ${c}, 0 0 28px ${c}, 0 0 54px ${c}`.replace(/\)/g, ')') ;
    css(E.signOpen, { color: openOn > .5 ? '#fff1ea' : '#7a4a50', textShadow: openOn > .5 ? neon('rgba(255,110,90,.95)') : 'none', opacity: String(t > 4.4 && t < 17.4 ? 0 : 1) });
    css(E.signBook, { color: bookOn > .5 ? '#f6ffd6' : 'rgba(200,220,150,.25)', textShadow: bookOn > .5 ? neon('rgba(200,255,60,.95)') : 'none', opacity: String(t >= 3.6 && t < 17.6 ? 1 : 0), fontSize: '11px' });
    // ---- the phone: rises at dusk, floats through the booking, exits as the camera goes to the building
    const pin = ease.spring(clamp((t - 2.9) / .9)), pout = sm(8.2, 8.9, t);
    const bob = Math.sin(t * 1.6) * 5, ry = -14 + 10 * sm(3.0, 6.0, t) + 8 * pout, rx = 8 - 6 * sm(3.0, 6.0, t);
    const py = lerp(560, 0, pin) + bob - pout * 620;
    css(E.phone, { transform: `perspective(900px) translate(${(30 * pout).toFixed(1)}px,${py.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg) rotateZ(${(-3 + 3 * sm(3, 6, t)).toFixed(2)}deg)`, opacity: String(t < 2.6 ? 0 : 1 - sm(8.5, 8.9, t)) });
    E.scrIn.style.transform = `scale(.4776) translateY(${-Math.round(lerp(0, 230, sm(6.3, 7.4, t)))}px)`;
    if (E.thu) { const r = t >= 6.6; E.thu.style.background = r ? '#e3262f' : ''; E.thu.style.borderColor = r ? '#e3262f' : ''; E.thu.style.color = r ? '#fff' : ''; }
    E.glare.style.transform = `translateX(${(-40 + 80 * sm(3, 8, t)).toFixed(1)}px)`;
    // glass cards pop on the beats, drift in depth, leave with the phone
    const pop = (el, at, x0 = 0) => { const u = clamp((t - at) / .55), k = ease.spring(u), o = clamp(u * 3) * (1 - sm(8.1, 8.6, t)); css(el, { opacity: o.toFixed(3), transform: `translate(${((1 - k) * x0 + Math.sin(t * 1.3 + at) * 3).toFixed(1)}px,${((1 - k) * 24 - sm(8.1, 8.6, t) * 80).toFixed(1)}px) scale(${lerp(.86, 1, k).toFixed(3)})` }); };
    pop(E.b1, 5.4, -30); pop(E.b2, 6.6, 30); pop(E.b3, 7.2, -30);
    // ---- night toasts: newest slides in at the top, older ones step down and fade (max 3 visible)
    E.toasts.forEach((el, i) => {
      const at = T.fills[i], u = clamp((t - at) / .5), k = ease.spring(u);
      const later = T.fills.filter((f, j) => j > i && t >= f).length, slot = T.fills.slice(i + 1).reduce((a, f) => a + ease.out3(clamp((t - f) / .35)), 0);
      const o = clamp(u * 3) * clamp(1 - Math.max(0, slot - 2)) * (1 - sm(11.9, 12.3, t));
      css(el, { opacity: o.toFixed(3), transform: `translate(${((1 - k) * -40).toFixed(1)}px,${(slot * 58).toFixed(1)}px) scale(${(lerp(.9, 1, k) * (1 - slot * .04)).toFixed(3)})` }); void later;
    });
    // ---- HUD
    E.clock.textContent = t >= 2.4 ? clockAt(t) : '';
    E.clock.style.opacity = String(t < 2.4 || t > 17.75 ? 0 : t > 17.4 ? 1 - sm(17.4, 17.75, t) : (t >= 12.0 && t < 12.6 ? (Math.floor(t * 4) % 2 ? .25 : 1) : 1));
    const n = E.bookWin.filter((_, i) => tf >= T.fills[i]).length;
    E.tally.textContent = t >= T.fills[0] - .1 && t < 12.9 ? `${n} booked while closed` : '';
    // ---- kinetic type: the hook (golden hour), the answer (dawn)
    letters(E.h1, t, -.15, 2.25); letters(E.h2, t, .45, 2.3); letters(E.h3, t, 1.05, 2.35, { wFrom: 125, wTo: 82 });
    E.k3.style.color = '#fff'; E.k3.style.fontSize = '50px';
    letters(E.q1, t, T.answer[0], 17.1, { wFrom: 125, wTo: 70, dy: 70 }); letters(E.q2, t, T.answer[1], 17.15, { wFrom: 125, wTo: 90 }); letters(E.q3, t, T.answer[2], 17.2, { wFrom: 125, wTo: 90 });
    const glow = '0 2px 0 rgba(80,20,40,.18), 0 0 30px rgba(255,240,220,.45)';
    [E.k1, E.k2, E.k3].forEach((k) => { k.style.textShadow = glow; });
    [E.p1, E.p2, E.p3].forEach((k) => { k.style.textShadow = '0 0 26px rgba(255,220,180,.6)'; k.style.color = '#fff'; });
    // ---- CTA (morning)
    const cu = clamp((t - T.cta) / .6), ck = ease.spring(cu);
    css(E.cta, { opacity: (clamp(cu * 3) * (1 - sm(17.3, 17.8, t))).toFixed(3), transform: `translateY(${((1 - ck) * 40).toFixed(1)}px)` });
    // ---- light: sunrise flare on the peak, a light leak across the cut to dawn, breath = everything dims
    E.flare.style.opacity = (sm(12.55, 12.8, t) * (1 - sm(13.2, 14.6, t)) * .95).toFixed(3);
    E.leak.style.opacity = (Math.sin(Math.PI * clamp((t - 12.5) / .9)) * .85).toFixed(3);
    E.leak.style.transform = `translateX(${lerp(-200, 260, clamp((t - 12.5) / .9)).toFixed(1)}px)`;
    const dim = t >= 11.9 && t < 12.6 ? sm(11.9, 12.2, t) * (1 - sm(12.45, 12.6, t)) : 0;
    E.vig.style.opacity = (.35 + .5 * dim).toFixed(3);
    E.scene.style.filter = dim > .01 ? `brightness(${(1 - .45 * dim).toFixed(3)}) saturate(${(1 - .3 * dim).toFixed(3)})` : 'none';
    const kick = t >= T.peak ? Math.exp(-(t - T.peak) * 5) * .035 : 0;   // the sunrise lands like a hit: a short scale punch that settles
    E.scene.style.transform = kick > .0005 ? `scale(${(1 + kick).toFixed(4)})` : 'none';
    E.field.style.opacity = 0;
  };

  // the cover: golden-to-night split poster with the lit building and the question
  S.cover = function () {
    S.update(E, 10.9); E.frame = 7;
    E.tally.textContent = ''; E.clock.textContent = '11:42 PM';
    const t = E.el('div', 'position:absolute;left:30px;top:150px;width:342px;color:#fff;font:900 58px/.92 Archivo,sans-serif;font-variation-settings:"wdth" 76;text-transform:uppercase;text-shadow:0 0 30px rgba(180,190,255,.55)', E.scene, 'Missing<br>patients<br>after 8 pm?');
    void t;
  };
  S.cues = () => T.cues;
})();
