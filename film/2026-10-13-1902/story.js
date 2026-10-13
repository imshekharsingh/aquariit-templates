// Dantika Dental · "After 8" (v3, the night-signal cut). Same story as v2 (the clinic closes at 8, booking does not), retold in a product-film grammar:
// near-black ground, ONE accent glow (Dantika lime), material cards with light rims, skeleton UI instead of tiny real text, connector lines with travelling
// data dots to show HOW it works, a scan-bar transformation, corner brackets on the focal element, and captions as the spine (1-3 words, one fixed anchor).
// Colour script by contrast: warm lit facade -> lime-on-black night -> warm sunrise only at the payoff -> the lit facade again (the loop).
(function () {
  const E = window.FilmEngine, T = window.FILM_T, { clamp, lerp, ease } = E, S = (E.story = {});
  S.selfStage = true;
  const sm = (a, b, t) => ease.io3(clamp((t - a) / (b - a)));
  const css = (el, o) => { for (const k in o) el.style[k] = o[k]; };
  const ACC = '#c8ff3d', INK = '#050607', TAU = Math.PI * 2;
  const MAT = 'background:linear-gradient(160deg,#1e2225,#0b0d0f);box-shadow:inset 0 1px 0 rgba(255,255,255,.09),0 0 0 1px rgba(255,255,255,.09),0 14px 30px rgba(0,0,0,.5)';
  const MONO = '"Geist Mono",ui-monospace,monospace';
  const TOOTH = '<svg viewBox="0 0 14 18" width="12" height="15" fill="currentColor" aria-hidden="true"><path d="M4 1.5C1.8 1.5.8 3.4.8 5.4c0 2.8 1.2 4.1 1.6 7 .3 2.2.8 3.6 1.7 3.6 1 0 1.2-2.2 1.7-4.1.3-1 .5-1.3.9-1.3s.6.3.9 1.3c.5 1.9.7 4.1 1.7 4.1.9 0 1.4-1.4 1.7-3.6.4-2.9 1.6-4.2 1.6-7 0-2-1-3.9-3.2-3.9-1.4 0-1.9.9-2.7.9S5.4 1.5 4 1.5z"/></svg>';

  // the clock in the corner runs the night as a time-lapse
  const CLOCK = [[2.4, 20 * 60], [3.0, 23 * 60 + 42], [5.4, 23 * 60 + 44], [10.2, 25 * 60 + 15], [11.7, 29 * 60 + 10], [12.0, 29 * 60 + 59], [12.6, 30 * 60], [15.6, 32 * 60 + 45], [17.4, 33 * 60], [18.1, 33 * 60]];
  function clockAt(t) { let i = 0; while (i < CLOCK.length - 2 && t >= CLOCK[i + 1][0]) i++; const [t0, m0] = CLOCK[i], [t1, m1] = CLOCK[i + 1]; const m = Math.floor(lerp(m0, m1, clamp((t - t0) / (t1 - t0)))) % 1440; const h = Math.floor(m / 60), mm = m % 60; return `${((h + 11) % 12) + 1}:${String(mm).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`; }

  // captions: [in, out, text, size, {word index: colour}] — one anchor (y = 492), narrow (<= 268 px), the eye rests there while the picture changes above
  const CAPS = [
    [-0.1, 1.15, 'Missing patients', 34], [1.15, 2.35, 'after 8 pm?', 34, { 1: ACC, 2: ACC }],
    [2.6, 3.5, '11:42 pm.', 28], [3.5, 4.3, 'A patient asks.', 28], [4.35, 5.35, 'Your website answers.', 28, { 2: ACC }],
    [5.45, 6.55, 'One system.', 28], [6.6, 7.2, 'Slot.', 30, { 0: ACC }], [7.2, 7.8, 'Deposit.', 30, { 0: ACC }], [7.8, 8.5, 'Reminder.', 30, { 0: ACC }],
    [8.6, 9.55, 'Thursday, 9:30.', 28], [9.6, 10.4, 'Booked.', 32, { 0: ACC }],
    [10.5, 11.2, 'While you sleep.', 28], [11.2, 11.95, 'Five patients.', 28, { 0: ACC }],
    [13.0, 14.25, 'Booked before', 34], [14.25, 15.5, 'you even open.', 34, { 2: '#ffc56b' }],
    [15.8, 16.95, 'Open 24×7 on WhatsApp', 26, { 1: ACC }],
  ];
  const SLOTS = [[0, 1, 'A. Rao'], [2, 0, 'S. Khan'], [1, 2, 'P. Iyer'], [3, 3, 'M. Das'], [4, 1, 'R. Jain']];   // [col, row, name]; the first one is the phone's Thursday 9:30
  const slotC = (c, r) => ({ x: 49 + c * 62 + 28, y: 170 + r * 44 + 19 });

  S.setup = async function () {
    document.documentElement.classList.add('reel');
    await document.fonts.ready;
    E.stage(); E.cam.style.display = 'none';
    [E.stageEl, document.body, document.documentElement].forEach((e) => { e.style.background = INK; });
    const L = (E.scene = E.el('div', `position:absolute;inset:0;overflow:hidden;background:${INK}`, E.stageEl)); E.stageEl.insertBefore(L, E.fx);
    E.el('div', 'position:absolute;inset:0;background:radial-gradient(70% 45% at 50% 40%,rgba(110,140,120,.13),rgba(0,0,0,0) 70%)', L);
    // sunrise (behind everything else, only at the payoff)
    E.sunr = E.el('div', 'position:absolute;left:-40%;right:-40%;top:0;height:100%;opacity:0;background:radial-gradient(60% 62% at 50% 86%,rgba(255,206,130,1),rgba(255,140,112,.78) 34%,rgba(160,70,150,.42) 60%,rgba(40,20,60,.2) 78%,rgba(0,0,0,0) 92%)', L);
    E.rays = E.el('div', 'position:absolute;inset:-30%;opacity:0;mix-blend-mode:screen;background:repeating-conic-gradient(from 0deg at 50% 80%,rgba(255,214,150,.2) 0deg 3deg,rgba(255,214,150,0) 3deg 10deg);-webkit-mask-image:radial-gradient(65% 60% at 50% 80%,#000,transparent 75%);mask-image:radial-gradient(65% 60% at 50% 80%,#000,transparent 75%)', L);
    // dust (canvas, periodic drift so the loop is seamless) + foreground bokeh (depth)
    const cv = E.el('canvas', 'position:absolute;inset:0;width:402px;height:715px', L); cv.width = 804; cv.height = 1430; E.dctx = cv.getContext('2d');
    let s = 4242; const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    E.dust = Array.from({ length: 70 }, () => ({ x: rnd() * 804, y: rnd() * 1430, r: .6 + rnd() * 1.6, a: .12 + rnd() * .38, p: rnd() * TAU }));
    E.bokeh = [[-70, 520, 190, 'rgba(200,255,61,.11)'], [300, 110, 150, 'rgba(255,255,255,.07)'], [250, 610, 170, 'rgba(255,190,120,.10)']].map(([x, y, d, c]) => E.el('div', `position:absolute;left:${x}px;top:${y}px;width:${d}px;height:${d}px;border-radius:50%;background:radial-gradient(circle,${c},rgba(0,0,0,0) 70%);filter:blur(10px)`, L));

    const world = (E.world = E.el('div', 'position:absolute;inset:0;transform-origin:50% 45%', L));

    // ---- A. the clinic facade, drawn in light; lit windows + OPEN neon (evening), dark + CLOSED (night), lit again at 9 am (the loop)
    E.fac = E.el('div', 'position:absolute;left:51px;top:140px;width:300px;height:290px;transform-origin:50% 60%', world);
    E.facGlow = E.el('div', 'position:absolute;left:20px;top:150px;width:260px;height:150px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,196,120,.32),rgba(0,0,0,0));filter:blur(8px)', E.fac);
    E.el('div', 'position:absolute;left:0;top:250px;width:300px;height:1px', E.fac).style.background = 'linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.5),rgba(255,255,255,0))';
    const svg = E.el('div', 'position:absolute;inset:0', E.fac);
    svg.innerHTML = `<svg viewBox="0 0 300 260" width="300" height="260" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect class="w" x="62" y="146" width="48" height="58" rx="3"/><rect class="w" x="190" y="146" width="48" height="58" rx="3"/><rect class="w" x="124" y="168" width="52" height="82" rx="3"/>
      <g stroke="rgba(236,242,238,.66)" stroke-width="1.5">
        <path d="M40 250V76H260V250"/><path d="M30 76H270M36 64H264V76"/><path d="M54 134H246L236 120H64Z"/>
        <rect x="62" y="146" width="48" height="58" rx="3"/><rect x="190" y="146" width="48" height="58" rx="3"/><path d="M86 146V204M62 175H110M214 146V204M190 175H238"/>
        <rect x="124" y="168" width="52" height="82" rx="3"/><path d="M150 168V250M144 212h-3M156 212h3"/>
        <path d="M232 120V100M226 94h12" stroke-width="1.2"/><circle cx="232" cy="90" r="4"/>
      </g></svg>`;
    E.facWins = [...svg.querySelectorAll('.w')];
    E.sign = E.el('div', `position:absolute;left:84px;top:84px;width:132px;height:30px;border-radius:7px;box-sizing:border-box;border:1.5px solid;display:flex;align-items:center;justify-content:center;gap:7px;font:800 14px/1 Archivo,sans-serif;letter-spacing:.26em;padding-left:.26em`, E.fac, `${TOOTH}<span>OPEN</span>`);
    E.signTxt = E.sign.querySelector('span');

    // ---- B. the phone: a dark device in the dark, its screen the only light
    E.halo = E.el('div', 'position:absolute;left:61px;top:90px;width:280px;height:380px;border-radius:50%;background:radial-gradient(closest-side,rgba(200,255,61,.16),rgba(0,0,0,0));filter:blur(14px)', world);
    E.ph = E.el('div', 'position:absolute;left:111px;top:104px;width:180px;height:352px;border-radius:30px;padding:7px;box-sizing:border-box;background:linear-gradient(160deg,#272b2f,#0a0b0c 55%,#16191b);box-shadow:0 0 0 1px rgba(255,255,255,.14),inset 0 1px 0 rgba(255,255,255,.18),0 30px 60px rgba(0,0,0,.6);transform-origin:50% 50%', world);
    const scr = (E.scr = E.el('div', 'position:relative;width:100%;height:100%;border-radius:23px;overflow:hidden;background:#0c0e10', E.ph));
    const hd = E.el('div', 'position:absolute;left:0;right:0;top:0;height:46px;background:#14171a;border-bottom:1px solid rgba(255,255,255,.06)', scr);
    E.el('div', `position:absolute;left:12px;top:12px;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;color:#14200a;background:linear-gradient(135deg,${ACC},#7dffb0)`, hd, TOOTH);
    E.el('div', 'position:absolute;left:44px;top:13px;color:#f2f4f2;font:700 10.5px/1 Archivo,sans-serif', hd, 'Dantika Dental');
    E.el('div', `position:absolute;left:44px;top:28px;color:${ACC};font:500 8px/1 ${MONO};letter-spacing:.06em`, hd, 'replies 24×7');
    E.el('div', 'position:absolute;left:10px;top:60px;width:96px;height:22px;border-radius:11px;background:#1c2024', scr);
    E.el('div', 'position:absolute;right:10px;top:90px;width:78px;height:22px;border-radius:11px;background:#1c2024', scr);
    E.msg = E.el('div', 'position:absolute;left:10px;top:126px;width:126px;box-sizing:border-box;padding:8px 10px;border-radius:14px 14px 14px 4px;background:#eef1ee;color:#101214;font:600 11px/1.3 Archivo,sans-serif;transform-origin:0 100%', scr, `Hi! Can I come Thursday morning? Tooth pain since evening.<div style="font:500 7.5px/1 ${MONO};opacity:.55;margin-top:5px">11:42 PM</div>`);
    E.typing = E.el('div', 'position:absolute;right:10px;top:212px;width:44px;height:22px;border-radius:11px;background:#1c2024;display:flex;align-items:center;justify-content:center;gap:4px', scr);
    E.dots = [0, 1, 2].map(() => E.el('i', 'width:5px;height:5px;border-radius:50%;background:#9aa19c', E.typing));
    E.rep = E.el('div', `position:absolute;right:10px;top:206px;width:134px;box-sizing:border-box;padding:8px 10px;border-radius:14px 14px 4px 14px;background:${ACC};color:#11180a;font:700 11px/1.3 Archivo,sans-serif;transform-origin:100% 100%`, scr, `Thu 9:30 am is free ✓<br>Hold it with ₹200 by UPI?<div style="font:500 7.5px/1 ${MONO};opacity:.6;margin-top:5px">auto-reply · 11:42 PM</div>`);
    // the scan result: Dantika's own slot calendar (cream, black chips, the brand red), revealed under the scan bar
    E.cal = E.el('div', 'position:absolute;inset:0;background:#f6f5ef;color:#121212', scr);
    E.el('div', 'position:absolute;left:12px;top:14px;display:flex;align-items:center;gap:5px;font:800 9px/1 Archivo,sans-serif;letter-spacing:.16em', E.cal, '<i style="width:8px;height:8px;background:#e3262f"></i>DANTIKA');
    E.el('div', 'position:absolute;left:12px;top:34px;font:900 18px/.98 Archivo,sans-serif;font-variation-settings:"wdth" 78;text-transform:uppercase', E.cal, 'Open 9 to 8.<br><span style="color:#e3262f">Booking open</span><br>all night.');
    E.el('div', `position:absolute;left:12px;top:100px;font:500 7.5px/1 ${MONO};letter-spacing:.12em;opacity:.6`, E.cal, 'THIS WEEK · SLOTS');
    const cg = E.el('div', 'position:absolute;left:10px;top:114px;width:146px;display:grid;grid-template-columns:repeat(4,1fr);gap:5px', E.cal);
    ['MON', 'TUE', 'WED', 'THU'].forEach((d) => E.el('div', `font:500 7px/1 ${MONO};letter-spacing:.08em;text-align:center;opacity:.55`, cg, d));
    const times = [['9:00', '10:00', '9:00', '9:00'], ['11:30', '12:00', '11:00', '9:30'], ['4:30', '5:00', '6:30', '11:00']];
    times.forEach((row, r) => row.forEach((tm, c) => { const chip = E.el('div', `height:22px;border-radius:5px;display:grid;place-items:center;font:600 8.5px/1 ${MONO};background:#121212;color:#f6f5ef`, cg, tm); if (r === 1 && c === 3) { E.thu = chip; css(chip, { background: 'transparent', color: '#121212', boxShadow: 'inset 0 0 0 1.5px #121212' }); } }));
    E.bookedStrip = E.el('div', `position:absolute;left:10px;right:10px;top:212px;padding:8px 9px;border-radius:7px;background:#eaff3b;font:700 9.5px/1.3 Archivo,sans-serif`, E.cal, `Booked: Thu, 9:30 am<div style="font:500 7.5px/1.2 ${MONO};opacity:.7;margin-top:3px">₹200 held · reminder Wed 8 pm</div>`);
    E.el('div', `position:absolute;left:12px;right:12px;top:268px;font:500 8.5px/1.45 Archivo,sans-serif;opacity:.7`, E.cal, 'A calm neighbourhood clinic. Pick a slot on WhatsApp at any hour; we confirm, remind and keep the chair ready.');
    E.scan = E.el('div', `position:absolute;left:94px;width:214px;top:0;height:2px;border-radius:2px;background:#fff;box-shadow:0 0 10px 3px rgba(255,255,255,.75),0 0 30px 10px rgba(200,255,61,.45);opacity:0`, world);
    E.scanWash = E.el('div', 'position:absolute;left:0;right:0;height:40px;background:linear-gradient(180deg,rgba(200,255,61,0),rgba(200,255,61,.28));pointer-events:none', scr);

    // ---- C. the system: the phone (mini) -> the booking hub -> slot / deposit / reminder
    const P = (E.paths = E.el('div', 'position:absolute;inset:0', world));
    P.innerHTML = `<svg viewBox="0 0 402 715" width="402" height="715" fill="none" aria-hidden="true" style="overflow:visible;filter:drop-shadow(0 0 4px rgba(200,255,61,.55))">
      <path id="pl" d="M201 226 L201 245" pathLength="1"/>
      <path id="n1" d="M188 334 C170 362 100 350 91 374" pathLength="1"/><path id="n2" d="M201 337 L201 374" pathLength="1"/><path id="n3" d="M214 334 C232 362 302 350 311 374" pathLength="1"/>
      <circle id="d0" r="2.6" fill="#fff"/><circle id="d1" r="2.6" fill="#fff"/><circle id="d2" r="2.6" fill="#fff"/><circle id="d3" r="2.6" fill="#fff"/></svg>`;
    E.lines = ['pl', 'n1', 'n2', 'n3'].map((id) => { const p = P.querySelector('#' + id); css(p, { stroke: 'rgba(200,255,61,.75)', strokeWidth: '1.4', strokeDasharray: '1', strokeDashoffset: '1' }); return p; });
    E.ldots = [0, 1, 2, 3].map((i) => P.querySelector('#d' + i));
    E.hub = E.el('div', 'position:absolute;left:153px;top:242px;width:96px;height:96px', world);
    E.hubRings = E.el('div', 'position:absolute;inset:0', E.hub, `<svg viewBox="0 0 96 96" width="96" height="96" fill="none" aria-hidden="true"><circle class="r1" cx="48" cy="48" r="45" stroke="rgba(255,255,255,.22)" stroke-width="1.2" stroke-dasharray="70 30 40 143" style="transform-origin:48px 48px"/><circle class="r2" cx="48" cy="48" r="37" stroke="${ACC}" stroke-opacity=".7" stroke-width="1.6" stroke-dasharray="44 20 90 78" style="transform-origin:48px 48px"/></svg>`);
    E.r1 = E.hubRings.querySelector('.r1'); E.r2 = E.hubRings.querySelector('.r2');
    E.el('div', `position:absolute;left:22px;top:22px;width:52px;height:52px;border-radius:50%;${MAT}`, E.hub);
    E.core = E.el('div', `position:absolute;left:34px;top:34px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle,#fff 0 28%,${ACC} 46%,rgba(200,255,61,0) 72%);box-shadow:0 0 22px 6px rgba(200,255,61,.45)`, E.hub);
    E.hubLab = E.el('div', `position:absolute;left:258px;width:80px;top:280px;text-align:left;line-height:1.5;font:500 9px/1 ${MONO};letter-spacing:.14em;color:rgba(255,255,255,.55)`, world, 'DANTIKA<br>BOOKING');
    const ICONS = [
      '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M8 15l2.5 2.5L16 13"/>',
      '<circle cx="12" cy="12" r="9"/><path d="M8.5 8h7M8.5 11h7M8.5 8c4 0 4 6 0 6l5 4"/>',
      '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
    ];
    E.nodes = [[91, 'Thu 9:30'], [201, '₹200 held'], [311, 'Reminder']].map(([x, lab], i) => {
      const n = E.el('div', `position:absolute;left:${x - 26}px;top:374px;width:52px;height:52px;border-radius:15px;${MAT};display:grid;place-items:center;color:#eef1ee`, world, `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[i]}</svg>`);
      n.lab = E.el('div', `position:absolute;left:${x - 50}px;width:100px;top:434px;text-align:center;font:500 9.5px/1 ${MONO};letter-spacing:.06em;color:rgba(255,255,255,.75)`, world, lab);
      return n;
    });

    // ---- D. corner brackets (selection) with a glowing dot, re-used on the slot and on the CTA button
    E.mkBrk = (parent) => { const b = E.el('div', 'position:absolute;left:0;top:0;width:0;height:0;opacity:0;z-index:5', parent);
      b.c = [0, 1, 2, 3].map((i) => E.el('i', `position:absolute;width:12px;height:12px;border-color:${ACC};border-style:solid;border-width:${i < 2 ? '2.5px' : '0'} ${i % 2 ? '2.5px' : '0'} ${i >= 2 ? '2.5px' : '0'} ${i % 2 ? '0' : '2.5px'};filter:drop-shadow(0 0 3px rgba(200,255,61,.8))`, b));
      b.dot = E.el('i', 'position:absolute;width:7px;height:7px;border-radius:50%;background:#fff;box-shadow:0 0 0 3px rgba(200,255,61,.45),0 0 14px 4px rgba(200,255,61,.6)', b); return b; };

    // ---- E. the night diary (skeleton slots; bookings light them)
    E.diary = E.el('div', 'position:absolute;left:49px;top:150px;width:304px', world);
    ['THU', 'FRI', 'SAT', 'MON', 'TUE'].forEach((d, i) => E.el('div', `position:absolute;left:${i * 62}px;top:0;width:56px;text-align:center;font:500 8.5px/1 ${MONO};letter-spacing:.14em;color:rgba(255,255,255,.45)`, E.diary, d));
    const rowsT = ['9:00', '9:30', '10:30', '11:00'];
    E.slots = {};
    for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) {
      const sl = E.el('div', `position:absolute;left:${c * 62}px;top:${20 + r * 44}px;width:56px;height:38px;border-radius:9px;${MAT};overflow:hidden`, E.diary);
      sl.t = E.el('div', `position:absolute;left:0;right:0;top:14px;text-align:center;font:500 8.5px/1 ${MONO};color:rgba(255,255,255,.3)`, sl, rowsT[r]);
      sl.n = E.el('div', `position:absolute;left:0;right:0;top:8px;text-align:center;color:#11180a;opacity:0;font:800 10px/1.15 Archivo,sans-serif`, sl, '');
      E.slots[c + ',' + r] = sl;
    }
    SLOTS.forEach(([c, r, nm]) => { E.slots[c + ',' + r].n.innerHTML = `${nm}<div style="font:500 8px/1 ${MONO};opacity:.7;margin-top:3px">${rowsT[r]}</div>`; });
    E.count = E.el('div', `position:absolute;left:0;right:0;top:376px;text-align:center;font:500 10px/1 ${MONO};letter-spacing:.12em;color:rgba(255,255,255,.7);text-transform:uppercase`, world, '');

    // ---- F. the CTA card (morning)
    E.cta = E.el('div', `position:absolute;left:41px;top:150px;width:320px;box-sizing:border-box;padding:20px 22px;border-radius:24px;${MAT};color:#f2f4f2`, world,
      `<div style="font:500 9px/1 ${MONO};letter-spacing:.16em;opacity:.65">DANTIKA DENTAL · DEMO CLINIC</div>
       <div style="font:900 30px/.98 Archivo,sans-serif;font-variation-settings:'wdth' 78;text-transform:uppercase;margin-top:12px">Booking open<br><span style="color:${ACC}">24×7</span> on WhatsApp</div>
       <div style="font:500 10px/1.45 ${MONO};opacity:.75;margin-top:10px">Pick a slot · ₹200 held by UPI<br>Reminder the night before</div>
       <div class="btn" style="display:inline-flex;align-items:center;gap:8px;margin-top:16px;padding:11px 16px;border-radius:99px;background:${ACC};color:#11180a;font:800 12px/1 Archivo,sans-serif;letter-spacing:.05em;text-transform:uppercase">Send “Hi” to book <span aria-hidden="true">→</span></div>`);
    E.ctaRim = E.el('div', `position:absolute;left:41px;top:150px;width:320px;border-radius:24px;pointer-events:none;box-shadow:0 0 0 1px rgba(200,255,61,.55),0 0 34px rgba(200,255,61,.25)`, world);

    E.brkPh = E.mkBrk(E.ph); E.brkCta = E.mkBrk(E.cta);
    // ---- HUD: the clock (outside the world: it does not shake on the impact)
    E.hud = E.el('div', `position:absolute;left:30px;top:104px;display:flex;align-items:center;gap:7px;font:500 11px/1 ${MONO};letter-spacing:.14em;color:rgba(255,255,255,.8)`, L, `<i style="width:6px;height:6px;border-radius:50%;background:${ACC};box-shadow:0 0 8px ${ACC}"></i><span></span>`);
    E.hudT = E.hud.querySelector('span'); E.hudDot = E.hud.querySelector('i');

    // ---- captions
    E.capWrap = E.el('div', 'position:absolute;left:0;right:0;top:492px;height:0', L);
    E.caps = CAPS.map(([a, b, text, size, acc = {}]) => {
      const card = E.el('div', `position:absolute;left:201px;top:0;transform:translate(-50%,-50%);white-space:nowrap;padding:6px 13px 8px;border-radius:12px;background:rgba(10,12,14,.82);box-shadow:0 0 0 1px rgba(255,255,255,.07),0 8px 24px rgba(0,0,0,.35);color:#fff;font:800 ${size}px/1.05 Archivo,sans-serif;font-variation-settings:"wdth" 84;letter-spacing:-.035em`, E.capWrap);
      const words = text.split(' ').map((w, i) => {
        const m = E.el('span', 'display:inline-block;overflow:hidden;vertical-align:bottom;padding:0 .02em .1em;margin:0 0 -.1em', card);
        const inner = E.el('span', `display:inline-block;${acc[i] ? `color:${acc[i]}` : ''}`, m, w);
        if (i) card.insertBefore(document.createTextNode(' '), m);
        return inner;
      });
      if (card.offsetWidth > 280) card.style.fontSize = (size * 280 / card.offsetWidth).toFixed(1) + 'px';   // keep captions narrow: clear of Instagram's button column
      return { a, b, card, words };
    });

    // measure targets for the brackets (nothing is transformed yet)
    const wr = (el) => { const r = el.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; };
    const rel = (el, par) => { const a = wr(el), b = wr(par); return { x: a.x - b.x, y: a.y - b.y, w: a.w, h: a.h }; };
    E.thuR = rel(E.thu, E.ph); E.btnR = rel(E.cta.querySelector('.btn'), E.cta); E.thuAbs = wr(E.thu);
    return { ok: true };
  };

  // place the brackets around a box; k (0..1) snaps them in from 14 px outside
  function brackets(b, box, k, o) {
    const d = (1 - k) * 14 + 5, { x, y, w, h } = box;
    [[x - d, y - d], [x + w + d - 12, y - d], [x - d, y + h + d - 12], [x + w + d - 12, y + h + d - 12]].forEach(([px, py], i) => css(b.c[i], { transform: `translate(${px.toFixed(1)}px,${py.toFixed(1)}px)` }));
    css(b.dot, { transform: `translate(${(x + w + d - 3.5).toFixed(1)}px,${(y - d - 3.5).toFixed(1)}px)` });
    b.style.opacity = o.toFixed(3);
  }

  S.update = function (E, t) {
    const tf = E.frame / 30, ph = TAU * t / 18;
    // ---- ambient: dust + bokeh (periodic over 18 s)
    const g = E.dctx; g.clearRect(0, 0, 804, 1430); g.fillStyle = '#fff';
    for (const d of E.dust) { g.globalAlpha = d.a * (.6 + .4 * Math.sin(d.p + tf * 1.3)); g.beginPath(); g.arc(d.x + 10 * Math.sin(ph + d.p), d.y + 16 * Math.sin(ph * 2 + d.p * 1.7), d.r, 0, TAU); g.fill(); }
    E.bokeh.forEach((b, i) => { b.style.transform = `translate(${(14 * Math.sin(ph + i * 2)).toFixed(1)}px,${(10 * Math.cos(ph + i)).toFixed(1)}px)`; });
    E.bokeh[2].style.opacity = String(.25 + .75 * sm(12.6, 13.6, t) * (1 - sm(16.8, 17.8, t)));

    // ---- world: slow breathing push, the breath dims everything, the sunrise lands as a punch
    const punch = t >= T.peak ? Math.exp(-(t - T.peak) * 5) * .04 : 0, drift = .012 * Math.sin(ph);
    const dim = t >= 11.95 && t < 12.6 ? sm(11.95, 12.2, t) * (1 - sm(12.45, 12.6, t)) : 0;
    css(E.world, { transform: `scale(${(1 + drift + punch).toFixed(4)})`, filter: dim > .01 ? `brightness(${(1 - .7 * dim).toFixed(3)})` : 'none' });
    E.vig.style.opacity = (.45 + .4 * dim).toFixed(3);

    // ---- A. facade: lights on in the evening, out at 8 pm (2.4), on again at 9 am (17.45)
    const flick = (t0, len) => { if (t < t0) return 0; const u = (t - t0) / len; if (u >= 1) return 1; return Math.sin(u * 47) * Math.sin(u * 13) > 0 ? 1 : .1; };
    const lit = t < 2.4 ? 1 : t < 17.45 ? 1 - flick(2.4, .32) : flick(17.45, .35);
    const facIn = 1 - sm(2.45, 2.85, t), facBack = sm(17.0, 17.5, t), fo = Math.max(facIn, facBack);
    css(E.fac, { opacity: fo.toFixed(3), transform: `scale(${(t < 9 ? 1 - .08 * sm(2.45, 2.85, t) : 1.06 - .06 * facBack).toFixed(4)})`, filter: fo < .98 ? `blur(${((1 - fo) * 3).toFixed(2)}px)` : 'none' });
    E.facWins.forEach((w, i) => { w.setAttribute('fill', lit > .5 ? (i === 2 ? 'rgba(255,214,150,.30)' : 'rgba(255,214,150,.42)') : 'rgba(255,255,255,.03)'); });
    E.facGlow.style.opacity = String(lit > .5 ? 1 : 0);
    css(E.sign, lit > .5 ? { color: ACC, borderColor: ACC, textShadow: '0 0 6px rgba(200,255,61,.9),0 0 18px rgba(200,255,61,.6)', boxShadow: '0 0 14px rgba(200,255,61,.45),inset 0 0 10px rgba(200,255,61,.25)', filter: `brightness(${(1 + .08 * Math.sin(tf * 3)).toFixed(3)})` }
      : { color: 'rgba(255,255,255,.3)', borderColor: 'rgba(255,255,255,.22)', textShadow: 'none', boxShadow: 'none', filter: 'none' });
    E.signTxt.textContent = lit > .5 ? 'OPEN' : 'CLOSED';

    // ---- B. phone: rises at 2.4, message 3.0, typing, auto-reply 4.2, shrinks to the top of the system 5.4-6.0, returns 8.4-9.0, scan, flies into the diary 10.2-10.5
    const pin = ease.spring(clamp((t - 2.45) / .7)), mini = sm(5.4, 6.0, t) * (1 - sm(8.4, 9.0, t)), fly = sm(10.15, 10.5, t);
    const tc = { x: slotC(0, 1).x - 201, y: slotC(0, 1).y - 280 };
    const zk = sm(9.25, 9.75, t) * (1 - sm(9.95, 10.15, t)), zs = 1 + .42 * zk, rel = { x: E.thuAbs.x + E.thuAbs.w / 2 - 201, y: E.thuAbs.y + E.thuAbs.h / 2 - 280 };   // push into Thursday 9:30
    const px = fly * tc.x - zk * (zs * rel.x), py = (1 - pin) * 90 - 120 * mini + fly * tc.y + zk * (-30 - zs * rel.y), psc = lerp(.9, 1, pin) * lerp(1, .36, mini) * lerp(1, .2, fly) * zs;
    const pop = t < 2.45 ? 0 : clamp((t - 2.45) / .25) * (1 - sm(10.4, 10.5, t));
    css(E.ph, { opacity: pop.toFixed(3), transform: `translate(${px.toFixed(1)}px,${py.toFixed(1)}px) scale(${psc.toFixed(4)})` });
    css(E.halo, { opacity: (pop * (1 - mini) * (1 - fly)).toFixed(3), transform: `translateY(${py.toFixed(1)}px)` });
    const mIn = ease.spring(clamp((t - 3.0) / .45)), rIn = ease.spring(clamp((t - 4.2) / .45));
    css(E.msg, { opacity: clamp((t - 3.0) / .12).toFixed(3), transform: `translateY(${((1 - mIn) * 14).toFixed(1)}px) scale(${lerp(.6, 1, mIn).toFixed(3)})` });
    E.typing.style.opacity = t >= 3.5 && t < 4.2 ? '1' : '0';
    E.dots.forEach((d, i) => { d.style.transform = `translateY(${(-2.5 * Math.max(0, Math.sin(tf * 9 - i * .9))).toFixed(1)}px)`; });
    css(E.rep, { opacity: clamp((t - 4.2) / .12).toFixed(3), transform: `translateY(${((1 - rIn) * 14).toFixed(1)}px) scale(${lerp(.6, 1, rIn).toFixed(3)})` });
    // scan 9.0-9.6: a bar of light runs down the screen; the chat turns into the clinic's slot calendar above it
    const su = clamp((t - 9.0) / .6), sy = 111 + ease.io3(su) * 338;
    E.cal.style.clipPath = t < 9.0 ? 'inset(0 0 100% 0)' : `inset(0 0 ${((1 - ease.io3(su)) * 100).toFixed(2)}% 0)`;
    css(E.scan, { opacity: (t >= 8.95 && t < 9.75 ? clamp((t - 8.95) / .08) * (1 - clamp((t - 9.6) / .15)) : 0).toFixed(3), transform: `translateY(${sy.toFixed(1)}px)` });
    css(E.scanWash, { top: `${(ease.io3(su) * 338 - 40).toFixed(1)}px`, opacity: (t >= 9.0 && t < 9.7 ? 1 - clamp((t - 9.55) / .15) : 0).toFixed(3) });
    const booked = t >= 9.6;
    css(E.thu, booked ? { background: '#e3262f', color: '#fff', boxShadow: '0 0 12px rgba(227,38,47,.6)' } : { background: 'transparent', color: '#121212', boxShadow: 'inset 0 0 0 1.5px #121212' });
    E.bookedStrip.style.opacity = clamp((t - 9.9) / .15).toFixed(3);
    E.bookedStrip.style.transform = `translateY(${((1 - ease.spring(clamp((t - 9.9) / .45))) * 10).toFixed(1)}px)`;

    // ---- C. the system (6.0-8.4): lines draw, the hub lights, three nodes on the beats, data dots run
    const sysO = sm(5.6, 6.0, t) * (1 - sm(8.4, 8.8, t));
    const draw = [[5.7, 6.0], [6.3, 6.6], [6.9, 7.2], [7.5, 7.8]];
    E.lines.forEach((p, i) => { p.style.strokeDashoffset = (1 - sm(draw[i][0], draw[i][1], t)).toFixed(4); p.style.opacity = sysO.toFixed(3); });
    E.ldots.forEach((d, i) => {
      const p = E.lines[i], st = draw[i][1]; if (t < st || sysO < .02) { d.setAttribute('opacity', '0'); return; }
      const u = ((t - st) / (i ? .9 : .6)) % 1, L = p.getTotalLength(), pt = p.getPointAtLength(L * u);   // data flows phone -> hub -> nodes
      d.setAttribute('cx', pt.x.toFixed(1)); d.setAttribute('cy', pt.y.toFixed(1)); d.setAttribute('opacity', (sysO * Math.sin(Math.PI * u)).toFixed(3));
    });
    const hk = ease.spring(clamp((t - 6.0) / .55));
    css(E.hub, { opacity: (sysO * clamp((t - 5.95) / .1)).toFixed(3), transform: `scale(${lerp(.5, 1, hk).toFixed(3)})` });
    E.r1.style.transform = `rotate(${(t * 40).toFixed(1)}deg)`; E.r2.style.transform = `rotate(${(-t * 65).toFixed(1)}deg)`;
    E.core.style.transform = `scale(${(1 + .12 * Math.sin(tf * 4)).toFixed(3)})`;
    E.hubLab.style.opacity = (sysO * clamp((t - 6.2) / .2)).toFixed(3);
    [6.6, 7.2, 7.8].forEach((at, i) => {
      const n = E.nodes[i], k = ease.spring(clamp((t - at) / .5)), o = sysO * clamp((t - at) / .1), on = t >= at;
      css(n, { opacity: o.toFixed(3), transform: `translateY(${((1 - k) * 16).toFixed(1)}px) scale(${lerp(.7, 1, k).toFixed(3)})`, color: on ? ACC : '#eef1ee', boxShadow: on ? `inset 0 1px 0 rgba(255,255,255,.09),0 0 0 1px rgba(200,255,61,.6),0 0 22px rgba(200,255,61,.3)` : '' });
      n.lab.style.opacity = (o * clamp((t - at - .1) / .2)).toFixed(3);
    });

    // ---- D. brackets: snap onto Thursday 9:30 (9.3-9.6), later onto the CTA button (16.1)
    brackets(E.brkPh, E.thuR, ease.spring(clamp((t - 9.6) / .45)), t >= 9.55 && t < 10.2 ? clamp((t - 9.55) / .08) * (1 - sm(10.0, 10.15, t)) : 0);
    brackets(E.brkCta, E.btnR, ease.spring(clamp((t - 16.2) / .45)), t >= 16.15 && t < 17.0 ? clamp((t - 16.15) / .08) : 0);

    // ---- E. diary (10.2-15.5): the phone lands in Thursday 9:30, four more bookings on the eighth notes, sunrise turns them gold
    const dO = sm(10.15, 10.5, t) * (1 - sm(15.3, 15.7, t));
    css(E.diary, { opacity: dO.toFixed(3), transform: `translateY(${((1 - sm(10.15, 10.5, t)) * 18 - 30 * sm(15.3, 15.7, t)).toFixed(1)}px)` });
    const gold = sm(12.6, 13.1, t);
    let n = 0;
    SLOTS.forEach(([c, r], i) => {
      const sl = E.slots[c + ',' + r], at = T.fills[i], on = sm(at, at + .12, t), k = ease.spring(clamp((t - at) / .4));
      if (tf >= at) n++;
      sl.style.background = on > .02 ? (gold > .02 ? `linear-gradient(160deg, color-mix(in srgb, #ffe08a ${(gold * 100).toFixed(0)}%, ${ACC}), color-mix(in srgb, #ffae55 ${(gold * 100).toFixed(0)}%, #9fdc2a))` : `linear-gradient(160deg,${ACC},#9fdc2a)`) : '';
      sl.style.boxShadow = on > .02 ? `0 0 ${(20 * on).toFixed(1)}px ${gold > .5 ? 'rgba(255,190,100,.55)' : 'rgba(200,255,61,.45)'},inset 0 1px 0 rgba(255,255,255,.5)` : '';
      sl.style.transform = on > .02 ? `scale(${lerp(.8, 1, k).toFixed(3)})` : 'none';
      sl.n.style.opacity = on.toFixed(3); sl.t.style.opacity = (1 - on).toFixed(3);
    });
    E.count.innerHTML = `<b style="font:900 15px/1 Archivo,sans-serif;color:${gold > .5 ? '#ffc56b' : ACC};letter-spacing:0">${n}</b>&nbsp; booked while closed`;
    E.count.style.opacity = (dO * clamp((t - 10.45) / .1)).toFixed(3);

    // ---- G. sunrise (12.6-17.8)
    const sun = sm(12.5, 13.4, t) * (1 - sm(16.6, 17.6, t));
    css(E.sunr, { opacity: sun.toFixed(3), transform: `translateY(${((1 - sm(12.5, 13.6, t)) * 260).toFixed(1)}px)` });
    css(E.rays, { opacity: (sun * .9).toFixed(3), transform: `rotate(${(t * 1.5).toFixed(2)}deg)` });

    // ---- F. CTA (15.6-17.1)
    const ck = ease.spring(clamp((t - 15.6) / .55)), co = clamp((t - 15.6) / .15) * (1 - sm(16.85, 17.15, t));
    css(E.cta, { opacity: co.toFixed(3), transform: `translateY(${((1 - ck) * 26).toFixed(1)}px) scale(${lerp(.94, 1, ck).toFixed(3)})` });
    css(E.ctaRim, { height: E.cta.offsetHeight + 'px', opacity: (co * (.6 + .4 * Math.sin(tf * 2.4))).toFixed(3), transform: E.cta.style.transform });

    // ---- HUD clock (2.4-17.6)
    E.hudT.textContent = clockAt(t);
    const blink = t >= 12.0 && t < 12.6 ? (Math.floor(t * 5) % 2 ? .3 : 1) : 1;
    E.hud.style.opacity = (sm(2.4, 2.7, t) * (1 - sm(17.3, 17.6, t)) * blink * (1 - sm(9.2, 9.4, t) * (1 - sm(10.0, 10.2, t)))).toFixed(3);   // hides while the phone fills the frame
    E.hudDot.style.opacity = (.55 + .45 * Math.sin(tf * 4)).toFixed(3);

    // ---- captions: words rise out of a mask on a spring, the card leaves quickly
    E.caps.forEach(({ a, b, card, words }) => {
      if (t < a - .05 || t > b + .02) { card.style.opacity = '0'; return; }
      const out = clamp((t - (b - .12)) / .12);
      card.style.opacity = (clamp((t - a) / .08 + (a < 0 ? 1 : 0)) * (1 - out)).toFixed(3);
      card.style.transform = `translate(-50%,calc(-50% - ${(out * 6).toFixed(1)}px))`;
      words.forEach((w, i) => { const k = ease.spring(clamp((t - a - i * .07) / .42)); w.style.transform = `translateY(${((1 - k) * 105).toFixed(1)}%)`; });
    });
    E.field.style.opacity = 0;
  };

  // the cover: the lit night diary under the question (title inside the 1:1 and 3:4 crops), a quiet clock above
  S.cover = function () {
    S.update(E, 11.9); E.frame = 7;
    E.caps.forEach(({ card }) => { card.style.opacity = '0'; });
    css(E.diary, { transform: 'translateY(182px)', opacity: '1' }); E.count.style.opacity = '0';
    E.hudT.textContent = '11:42 PM · CLINIC CLOSED'; css(E.hud, { opacity: '1', top: '170px' });
    E.el('div', `position:absolute;left:30px;top:192px;width:342px;color:#fff;font:900 44px/.92 Archivo,sans-serif;font-variation-settings:"wdth" 80;letter-spacing:-.02em;text-transform:uppercase`, E.scene, `Missing patients after <span style="color:${ACC};text-shadow:0 0 24px rgba(200,255,61,.5)">8 pm?</span>`);
  };
  S.cues = () => T.cues;
})();
