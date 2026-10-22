// FILM, theme `collage` (A1 makeover collage), service `web`: "Is your website losing you bookings?" 23.5 s, 17 Oct 2026.
// BRIEF (creative director). Brand on the proof site: Fernhollow House, a fictional six-room guesthouse on a ridge (dawn sky, five ridges, procedural mist).
// Film look: premium cinematic tech (design/brand/premium.md): navy ink #070B16 with soft blue light, white Archivo type, ONE lime accent (#C6F432) for the
// answer, coral (#FF5A4F) only for the problem. Three layers in every frame: the subject (a glass browser or a phone), supporting detail (coral flags, floating
// UI layers: search snippet, chips, a booking calendar) and depth (a blue perspective floor grid, a drifting dot field, a spot that follows the focus, dust and bokeh).
// Atmosphere: blue spot + lime/blue light leaks on every cut, glass glare sweep, vignette, light live grain (.03), cool soft-light grade.
// Hero object: the browser, which turns from a dated 2000s guesthouse page into the new site in a diagonal wave of 3D tiles (the new trick, P.tileFlip).
// Motion: long-tail easing (swing/glide, springs for arrivals), the camera never holds a framing for more than ~2.8 s.
// Shot list:  0-2.9 wide, tilted browser with the dated page, slow push-in, hook in three lines | 2.9-5.6 close-up pan down the old page, three coral flags land |
// 5.6-8.7 the old page squeezed into a phone, a pinch, "Tab closed", the phone swivels (breath 8.2-8.65) | 8.7-11.5 frontal browser, the tiles flip in a wave
// (8.9-10.6), lime wash on the peak | 11.5-14.3 the new site scrolls, a search snippet and chips float in front | 14.3-17.1 the phone with the new site, a calendar
// layer comes out of it, two taps, the range fills, Confirm, "Booked" | 17.1-19.8 pull back: desktop and phone together, both scroll | 19.8-23.5 brand end (lime).
(function () {
  const E = window.FilmEngine, P = window.FilmParts, { clamp, lerp } = E, S = (E.story = {});
  S.selfStage = true;
  S.dna = {
    service: 'web', theme: 'collage', format: 'makeover',
    opening: 'a dated 2000s guesthouse page in a tilted glass browser on navy, beige tiles, a blinking marquee and "book by email", under the hook "Is your website losing you bookings?"',
    bigMoment: 'the old page breaks into a grid of 3D tiles that flip over in a diagonal wave with lime edge glints, revealing the new dawn-ridge guesthouse site, then a calendar layer pops out of a phone and books two nights in two taps',
    ground: 'cinematic navy with a blue perspective floor grid, a drifting dot field, a soft blue spot, lime and blue light leaks on the cuts, one coral problem colour',
    music: 'warm minimal electronic with a soft pluck, a held breath, a bright lift on the tile wave and a gentle resolve, about 96 BPM',
  };
  const B = P.BRAND, INK = '#070B16', LIME = B.lime, CORAL = B.coral, MONO = "'Geist Mono',ui-monospace,monospace";
  const io = (k) => P.EASE.swing(clamp(k)), G_ = P.EASE.glide;
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const win = (t, a, b, f = .3) => clamp((t - a) / f) * (1 - clamp((t - b) / f));
  // an object's placement per shot: [t0, t1, from, to]; outside every shot it is hidden
  const track = (segs, t) => { const s = segs.find(([a, b]) => t >= a && t < b); if (!s) return null; const k = io(seg(t, s[0], s[1])), o = {};
    for (const key of new Set([...Object.keys(s[2]), ...Object.keys(s[3])])) o[key] = lerp(s[2][key] ?? 0, s[3][key] ?? s[2][key] ?? 0, k); return o; };
  const place = (el, v, base = 1) => { if (!v) { el.style.opacity = '0'; return; } el.style.opacity = (base * (v.o ?? 1)).toFixed(3);
    el.style.transform = `translate(${(v.x || 0).toFixed(1)}px,${(v.y || 0).toFixed(1)}px) perspective(900px) rotateX(${(v.rx || 0).toFixed(2)}deg) rotateY(${(v.ry || 0).toFixed(2)}deg) scale(${(v.s || 1).toFixed(4)})`; };

  S.setup = async function () {
    document.documentElement.classList.add('reel');
    await P.ready; await document.fonts.ready;
    await new Promise((r) => setTimeout(r, 1800));
    const srcSite = document.querySelector('.site');
    const { world } = P.scene({ accent: LIME, ink: INK, glow: 'rgba(60,100,230,.12)', len: 23.5 });
    P.breath = [8.2, 8.65];
    P.use('opener', 'dated-site-browser-tilt'); P.use('mechanism', 'calendar-layer-taps'); P.use('payoff', 'tile-wave-makeover');
    P.use('type', 'archivo-stacked-lines'); P.use('focus', 'glass-glare-sweep');

    // ---------- depth: floor grid in perspective, drifting dot field, a spot that follows the focus ----------
    const view = E.el('div', 'position:absolute;inset:0;perspective:900px;perspective-origin:50% 40%', world);
    const floor = E.el('div', `position:absolute;left:-300px;top:560px;width:1002px;height:700px;transform-origin:50% 0;transform:rotateX(76deg);
      background-image:linear-gradient(rgba(110,150,255,.22) 1px,transparent 1px),linear-gradient(90deg,rgba(110,150,255,.22) 1px,transparent 1px);background-size:46px 46px;
      -webkit-mask:radial-gradient(50% 50% at 50% 0,#000,transparent);mask:radial-gradient(50% 50% at 50% 0,#000,transparent)`, view);
    const dots = E.el('div', 'position:absolute;left:-60px;top:-60px;width:530px;height:840px;background-image:radial-gradient(rgba(150,175,255,.2) 1.1px,transparent 1.5px);background-size:22px 22px;-webkit-mask:radial-gradient(70% 60% at 50% 45%,#000,transparent);mask:radial-gradient(70% 60% at 50% 45%,#000,transparent)', world);
    const spot = E.el('div', 'position:absolute;left:-120px;top:100px;width:640px;height:640px;border-radius:50%;background:radial-gradient(closest-side,rgba(70,110,255,.24),rgba(70,110,255,0))', world);
    const rig = E.el('div', 'position:absolute;inset:0', world);   // flat: each subject carries its own perspective() so the zoomed page rasterises at full scale

    // ---------- the dated page (built at the browser's own size) ----------
    const BX = 20, BY = 268, BW = 362, BH = 300, TB = 22, VW = BW - 2, VH = BH - TB - 1;
    const OLD = `<div style="text-align:center;font:700 21px/1.05 'Times New Roman',serif;color:#0000ee;text-decoration:underline">~ Welcome to FERNHOLLOW Guest House!! ~</div>
      <div style="margin:8px -8px 0;overflow:hidden;background:#000080;height:20px"><div class="mq" style="white-space:nowrap;font:700 12px/20px 'Courier New',monospace;color:#ff0;display:inline-block">*** ROOMS AVAILABLE *** BOOK BY EMAIL *** ROOMS AVAILABLE *** BOOK BY EMAIL *** ROOMS AVAILABLE ***</div></div>
      <div style="display:flex;gap:8px;margin-top:9px"><div style="flex:0 0 104px;height:74px;border:3px inset #999;background:#bbb;display:grid;place-items:center;font:11px/1.2 'Courier New',monospace;color:#444;text-align:center">photo<br>coming soon</div>
        <div style="font:12.5px/1.28 'Times New Roman',serif">Nice rooms in the hills. Breakfast maybe. <u style="color:#00e">Click here</u> for directions. <u style="color:#00e">Click here</u> for rates.</div></div>
      <table style="margin-top:8px;width:100%;border:3px outset #999;border-collapse:collapse;font:11.5px/1.35 'Times New Roman',serif;background:#e8e0c8"><tr><td>Room 1-2</td><td>ask</td></tr><tr><td>Room 3-6</td><td>call us</td></tr><tr><td>Weekends</td><td>???</td></tr></table>
      <div class="bk" style="margin-top:9px;padding:6px;border:2px dashed #c00;font:700 12.5px/1.3 'Times New Roman',serif;color:#c00;background:#fff8d8">TO BOOK: email fernhollow_house99@mail.example and wait for our reply (2-3 days).</div>
      <div style="margin-top:8px;text-align:center;font:700 12px/1 'Courier New',monospace;color:#0f0;background:#000;padding:5px">VISITORS: 000731</div>
      <div style="margin-top:8px;font:10.5px/1.3 'Times New Roman',serif">Best viewed in 1024x768. <u style="color:#00e">Guestbook</u> | <u style="color:#00e">Links</u> | <u style="color:#00e">Webring</u></div>`;
    const oldPage = (w = VW, n2 = 1) => { const n = E.el('div', `width:${w}px;height:${VH + 220 + (n2 - 1) * 440}px;padding:9px 8px;box-sizing:border-box;color:#000;background:#efe6cc repeating-linear-gradient(45deg,#f3ead2 0 7px,#e5dabb 7px 14px)`, null, OLD.repeat(n2)); return n; };
    // the new site, laid out at desktop width and zoomed (not scaled) into the frame so its type stays crisp (owner, 17 Oct 2026)
    const PW = 1024, Z = VW / PW;
    const mk = (w, z, heroOnly) => { const c = srcSite.cloneNode(true); c.style.cssText = `position:absolute;left:0;top:0;width:${w}px;zoom:${z}`;
      if (heroOnly) c.querySelectorAll('main > section:not(.hero), footer').forEach((n) => n.remove());
      c.querySelectorAll('*').forEach((n) => { n.style.animation = 'none'; }); return c; };

    // ---------- the glass browser ----------
    const frame = E.el('div', `position:absolute;left:${BX}px;top:${BY}px;width:${BW}px;height:${BH}px;border-radius:14px;transform-origin:50% 50%;
      background:linear-gradient(160deg,rgba(255,255,255,.16),rgba(255,255,255,.05));border:1px solid rgba(220,230,255,.28);box-shadow:0 40px 80px -30px rgba(0,0,0,.9),0 0 60px -16px rgba(70,110,255,.45)`, rig);
    E.el('div', `position:absolute;left:0;right:0;top:0;height:${TB}px;display:flex;align-items:center;gap:6px;padding:0 10px;border-bottom:1px solid rgba(255,255,255,.12);border-radius:14px 14px 0 0;background:rgba(10,14,26,.85)`, frame,
      `<i style="width:7px;height:7px;border-radius:50%;background:#ff5f57"></i><i style="width:7px;height:7px;border-radius:50%;background:#febc2e"></i><i style="width:7px;height:7px;border-radius:50%;background:#28c840"></i>
       <div style="margin-left:10px;flex:1;height:14px;border-radius:5px;background:rgba(255,255,255,.08);display:flex;align-items:center;padding:0 8px;font:500 9.5px/1 ${MONO};color:#cdd6ea">fernhollow.house</div>`);
    const vp = E.el('div', `position:absolute;left:1px;top:${TB}px;width:${VW}px;height:${VH}px;overflow:hidden;border-radius:0 0 13px 13px;background:#efe6cc`, frame);
    const oldLayer = oldPage(); oldLayer.style.position = 'absolute'; vp.appendChild(oldLayer);
    const newScroll = E.el('div', 'position:absolute;left:0;top:0;width:100%;opacity:0', vp), site = mk(PW, Z); newScroll.appendChild(site);
    const flip = P.tileFlip(vp, { w: VW, h: VH, cols: 6, rows: 5, at: 8.95, dur: .7, spread: 1.0, front: () => oldPage(), back: () => mk(PW, Z, true) });
    const glare = E.el('div', 'position:absolute;inset:0;border-radius:14px;overflow:hidden;pointer-events:none', frame, '<i style="position:absolute;top:-40%;left:0;width:80px;height:180%;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.14),rgba(255,255,255,0));transform:rotate(18deg)"></i>').firstChild;
    // page offsets of the new site (screen px inside the frame)
    const off = (root, sel) => { const a = root.querySelector(sel).getBoundingClientRect(), b = root.getBoundingClientRect(); return a.top - b.top; };
    const yRooms = off(site, '#rooms') - 4, yBook = off(site, '#book') - 8;
    const mq = oldLayer.querySelector('.mq');
    // the site's own loops, driven by film time (mist drift, ridge drift, timeline light)
    const loops = (root) => { const m = [...root.querySelectorAll('.mist')], r = [...root.querySelectorAll('.r3 svg,.r5 svg,.win svg')], sun = root.querySelector('.sun'), halo = root.querySelector('.halo');
      return (t) => { m.forEach((el, i) => { el.style.transform = `translateX(${(-((t * (i ? 26 : 16)) % 600)).toFixed(1)}px)`; });
        r.forEach((el, i) => { el.style.transform = `translateX(${(Math.sin(t * .5 + i) * 14).toFixed(1)}px)`; });
        if (sun) sun.style.transform = `translateY(${(Math.sin(t * .6) * 4).toFixed(1)}px)`; if (halo) halo.style.transform = `scale(${(1 + .06 * Math.sin(t * 1.1)).toFixed(3)})`; }; };
    const loopDesk = loops(site);

    // ---------- the phone ----------
    const PHX = 76, PHY = 226, PHW = 250, PHH = 500, SW = PHW - 14, SH = PHH - 14;
    const phone = E.el('div', `position:absolute;left:${PHX}px;top:${PHY}px;width:${PHW}px;height:${PHH}px;border-radius:34px;padding:7px;box-sizing:border-box;transform-origin:50% 50%;opacity:0;
      background:linear-gradient(160deg,#d9e2f7,#6f7fa6 40%,#1b2340);box-shadow:0 0 0 1px rgba(220,230,255,.35),0 40px 70px -20px rgba(0,0,0,.8),0 0 60px -10px rgba(80,120,255,.35)`, rig);
    const pscr = E.el('div', 'position:relative;width:100%;height:100%;border-radius:27px;overflow:hidden;background:#efe6cc', phone);
    E.el('i', 'position:absolute;left:50%;top:8px;width:70px;height:20px;margin-left:-35px;border-radius:99px;background:#05070c;z-index:3', pscr);
    // old page squeezed: the desktop page shrunk to the phone (tiny type)
    const oldPh = oldPage(VW, 2); oldPh.style.cssText += `;position:absolute;left:0;top:26px;zoom:${(SW / VW * .98).toFixed(4)}`; pscr.appendChild(oldPh);
    const mScroll = E.el('div', 'position:absolute;left:0;top:0;width:100%;opacity:0', pscr), msite = mk(402, SW / 402); mScroll.appendChild(msite);
    const loopPh = loops(msite);
    const mBook = off(msite, '#book') - 30, mRooms = off(msite, '#rooms') - 20;
    const pinch = E.el('div', 'position:absolute;left:0;top:0;width:100%;height:100%;opacity:0;z-index:4', pscr,
      '<i style="position:absolute;left:96px;top:200px;width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.55);box-shadow:0 0 0 2px #fff"></i><i style="position:absolute;left:110px;top:214px;width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.55);box-shadow:0 0 0 2px #fff"></i>');
    const [f1, f2] = pinch.children;

    // ---------- front: type, flags, floating layers, calendar ----------
    const T = (html, css) => E.el('div', `position:absolute;left:30px;right:30px;text-align:center;color:${B.paper};font:800 40px/1.04 Archivo,sans-serif;font-variation-settings:"wdth" 96;letter-spacing:-.02em;opacity:0;${css}`, P.front, html);
    const LINES = [
      [0, 2.75, T('Is your website', 'top:98px;font-size:33px'), T('losing you', 'top:136px;font-size:46px'), T(`<span style="color:${CORAL}">bookings?</span>`, 'top:184px;font-size:58px')],
      [3.0, 5.45, T('What guests', 'top:100px;font-size:34px'), T(`<span style="color:${CORAL}">see first.</span>`, 'top:140px;font-size:52px')],
      [5.7, 8.15, T('On a phone,', 'top:100px;font-size:34px'), T(`<span style="color:${CORAL}">they leave.</span>`, 'top:140px;font-size:52px')],
      [8.8, 11.35, T('We rebuild it,', 'top:100px;font-size:34px'), T(`<span style="color:${LIME}">tile by tile.</span>`, 'top:140px;font-size:52px')],
      [11.6, 14.15, T('Modern. Fast.', 'top:100px;font-size:34px'), T(`<span style="color:${LIME}">Found.</span>`, 'top:140px;font-size:56px')],
      [14.4, 16.95, T('Book in', 'top:100px;font-size:34px'), T(`<span style="color:${LIME}">two taps.</span>`, 'top:140px;font-size:56px')],
      [17.2, 19.7, T('One site,', 'top:96px;font-size:34px'), T(`<span style="color:${LIME}">every screen.</span>`, 'top:136px;font-size:48px;white-space:nowrap')],
    ];
    const flags = [['Booking by email', 3.3, 360, -3], ['No room photos', 3.95, 438, 2.5], ['Slow to load', 4.6, 516, -2]].map(([txt, t0, y, r]) => ({ t0, r, el: E.el('div',
      `position:absolute;left:${r < 0 ? 28 : 64}px;top:${y}px;display:flex;align-items:center;gap:9px;padding:11px 16px;border-radius:14px;background:rgba(255,90,79,.96);color:#fff;font:800 19px/1 Archivo,sans-serif;box-shadow:0 14px 34px rgba(0,0,0,.45);opacity:0`, P.front,
      `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"><path d="M3 3l10 10M13 3L3 13"/></svg>${txt}`) }));
    const closed = E.el('div', `position:absolute;left:96px;top:470px;display:flex;align-items:center;gap:9px;padding:11px 16px;border-radius:14px;background:rgba(255,90,79,.96);color:#fff;font:800 19px/1 Archivo,sans-serif;box-shadow:0 14px 34px rgba(0,0,0,.45);opacity:0`, P.front,
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4H5v16h4M14 8l4 4-4 4M18 12H9"/></svg>Tab closed');
    // floating UI layers over the new site (collage)
    const snip = E.el('div', `position:absolute;left:26px;top:214px;width:262px;padding:11px 13px;border-radius:14px;background:#fff;box-shadow:0 20px 40px -12px rgba(0,0,0,.6);opacity:0`, P.front,
      `<div style="font:500 10px/1 ${MONO};color:#4d6a5f">fernhollow.house › rooms</div><div style="margin-top:5px;font:700 14.5px/1.2 Figtree,Archivo,sans-serif;color:#1a3fbf">Fernhollow House · Rooms above the clouds</div>
       <div style="margin-top:5px;display:flex;align-items:center;gap:6px;font:600 11px/1 Figtree,sans-serif;color:#555"><span style="color:#f5a524">★★★★★</span> Book direct · Six rooms<span style="margin-left:auto;padding:4px 7px;border-radius:99px;background:${LIME};color:#0A0E17;font:800 10px/1 Archivo,sans-serif">FOUND</span></div>`);
    const chips = [['⚡ Loads fast', 12.5, 30], ['✓ Mobile-ready', 12.9, 168]].map(([txt, t0, x]) => ({ t0, el: E.el('div',
      `position:absolute;left:${x}px;top:548px;padding:10px 15px;border-radius:99px;background:rgba(10,14,23,.92);border:1.5px solid ${LIME};color:${LIME};font:800 16px/1 Archivo,sans-serif;box-shadow:0 0 18px rgba(198,244,50,.3);opacity:0`, P.front, txt) }));
    // the calendar layer that comes out of the phone
    const days = Array.from({ length: 35 }, (_, i) => i - 2).map((d) => (d < 1 || d > 31 ? '' : d));
    const BOOKED = [2, 3, 9, 10, 11, 17, 18, 29, 30, 31];
    const cal = E.el('div', `position:absolute;left:44px;top:330px;width:292px;padding:14px;border-radius:22px;background:#0f3b33;color:#eafff6;box-shadow:0 30px 60px -16px rgba(0,0,0,.75),0 0 0 1px rgba(159,209,189,.25);opacity:0`, P.front,
      `<div style="display:flex;align-items:center;font:700 16px/1 'Bricolage Grotesque',Archivo,sans-serif">October<span style="margin-left:auto;font:500 11px/1 Figtree,sans-serif;color:#9fd1bd">Cloud Loft</span></div>
       <div class="cg" style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-top:10px">${days.map((d) => `<i style="position:relative;height:30px;display:grid;place-items:center;border-radius:8px;font:600 12px/1 Figtree,sans-serif;font-style:normal;${d === '' ? '' : BOOKED.includes(d) ? 'color:#5f857a;background:repeating-linear-gradient(-45deg,rgba(255,255,255,.05) 0 4px,transparent 4px 8px)' : 'background:rgba(255,255,255,.07)'}">${d}</i>`).join('')}</div>
       <div style="display:flex;align-items:center;gap:8px;margin-top:10px;padding:9px 9px 9px 12px;border-radius:13px;background:rgba(255,255,255,.08);font:600 12.5px/1.25 Figtree,sans-serif"><span class="sm">Pick your dates</span><b class="ok" style="margin-left:auto;padding:9px 12px;border-radius:10px;background:#6dffc4;color:#0f3b33;font:700 13px/1 Figtree,sans-serif">Confirm</b></div>`);
    const cells = [...cal.querySelectorAll('.cg i')], d23 = cells[25], d24 = cells[26], d25 = cells[27], sumTxt = cal.querySelector('.sm'), okBtn = cal.querySelector('.ok');
    const toast = E.el('div', `position:absolute;left:62px;top:${330 + 0}px;display:flex;align-items:center;gap:9px;padding:11px 15px;border-radius:14px;background:#fff;color:#0f3b33;font:800 17px/1 Archivo,sans-serif;box-shadow:0 18px 40px -10px rgba(0,0,0,.6);opacity:0`, P.front,
      `<i style="display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:${LIME};color:#0A0E17;font:900 13px/1 Archivo,sans-serif;font-style:normal">✓</i>Booked. Two nights.`);
    const finger = E.el('div', 'position:absolute;left:0;top:0;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;background:rgba(255,255,255,.5);box-shadow:0 0 0 2px #fff,0 6px 16px rgba(0,0,0,.4);opacity:0', P.front);
    const ripple = E.el('div', `position:absolute;left:0;top:0;width:24px;height:24px;margin:-12px 0 0 -12px;border-radius:50%;border:2px solid ${LIME};opacity:0`, P.front);
    const cpos = (el) => { const a = el.getBoundingClientRect(), b = P.front.getBoundingClientRect(); return [a.left - b.left + a.width / 2, a.top - b.top + a.height / 2]; };
    cal.style.opacity = '1'; const P23 = cpos(d23), P25 = cpos(d25), POK = cpos(okBtn); cal.style.opacity = '0';
    const TAPS = [[15.15, ...P23], [15.65, ...P25], [16.2, ...POK]];
    const FPATH = [[14.85, P23[0] + 40, P23[1] + 60], ...TAPS, [16.8, POK[0] + 20, POK[1] + 40]];

    // a scrim under the top type keeps every caption legible over the subject
    const scrim = E.el('div', `position:absolute;left:0;right:0;top:0;height:260px;background:linear-gradient(${INK}e6,${INK}b3 55%,${INK}00)`, P.front); P.front.prepend(scrim);
    // ---------- atmosphere on top: light leaks, wash, grade, vignette, grain ----------
    const leak = E.el('div', 'position:absolute;inset:-20%;background:radial-gradient(40% 35% at 20% 30%,rgba(198,244,50,.55),rgba(198,244,50,0) 70%),radial-gradient(35% 30% at 85% 70%,rgba(70,110,255,.7),rgba(70,110,255,0) 70%);mix-blend-mode:screen;opacity:0', P.front);
    const wash = E.el('div', 'position:absolute;inset:0;background:radial-gradient(60% 45% at 50% 52%,rgba(198,244,50,.42),rgba(198,244,50,0) 70%);mix-blend-mode:screen;opacity:0', P.front);
    E.el('div', 'position:absolute;inset:0;background:linear-gradient(135deg,rgba(90,130,255,.10),rgba(0,0,0,0) 45%,rgba(198,244,50,.05));mix-blend-mode:soft-light', P.front);
    E.el('div', 'position:absolute;inset:0;background:radial-gradient(80% 65% at 50% 48%,rgba(0,0,0,0),rgba(0,0,0,.55))', P.front);
    const gc = E.el('canvas', 'position:absolute;inset:0;width:402px;height:715px;opacity:.03;mix-blend-mode:overlay', P.front); gc.width = 201; gc.height = 358; const gx = gc.getContext('2d'), gimg = gx.createImageData(201, 358);
    P.brandEnd({ at: 19.85, keyword: 'BOOK', why: 'Is your website losing you bookings?', grade: 'lime' });

    // ---------- placements per shot ----------
    const FR = [
      [0, 2.9, { s: 1.16, y: 18, ry: -18, rx: 7 }, { s: 1.03, y: 4, ry: -7, rx: 4 }],
      [2.9, 5.6, { s: 1.6, x: 26, y: 74, ry: 7, rx: 2 }, { s: 1.7, x: 6, y: 58, ry: 1, rx: 0 }],
      [8.65, 11.5, { s: .97, y: 14, ry: 9, rx: 3 }, { s: 1.06, y: 0, ry: -3, rx: 1 }],
      [11.5, 14.3, { s: 1.0, x: 6, y: 6, ry: -12, rx: 4 }, { s: 1.1, x: -6, y: 16, ry: 5, rx: 2 }],
      [17.1, 19.95, { s: .98, x: -14, y: -40, ry: 12, rx: 3 }, { s: .88, x: -8, y: -50, ry: -6, rx: 2 }],
    ];
    const PH = [
      [5.6, 8.75, { s: .94, y: 40, ry: 24, rx: 4 }, { s: 1.05, y: 10, ry: -8, rx: 2 }],
      [14.3, 17.1, { s: 1.0, x: 0, y: -10, ry: -16, rx: 3 }, { s: 1.05, x: 0, y: -24, ry: 4, rx: 1 }],
      [17.1, 19.95, { s: .6, x: 112, y: 112, ry: -22, rx: 2 }, { s: .62, x: 104, y: 92, ry: -6, rx: 1 }],
    ];
    const SPOT = [[0, 201, 420], [2.9, 201, 420], [5.6, 201, 470], [8.7, 201, 420], [11.5, 201, 400], [14.3, 201, 470], [17.1, 220, 430], [19.9, 201, 357]];

    P.on((t) => {
      // depth layer life
      dots.style.transform = `translate(${(-(t * 3.4) % 22).toFixed(1)}px,${(-(t * 5.2) % 22).toFixed(1)}px)`;
      floor.style.transform = `rotateX(76deg) translateY(${(-(t * 12) % 46).toFixed(1)}px)`;
      { let i = 0; while (i < SPOT.length - 2 && t > SPOT[i + 1][0]) i++; const a = SPOT[i], b = SPOT[i + 1], k = G_(clamp((t - a[0]) / Math.max(.01, b[0] - a[0])));
        spot.style.transform = `translate(${(lerp(a[1], b[1], k) - 201).toFixed(1)}px,${(lerp(a[2], b[2], k) - 420).toFixed(1)}px)`; }
      const endOn = t < 19.95;
      floor.style.opacity = endOn ? '.9' : '0'; scrim.style.opacity = endOn ? '1' : '0';
      // subjects
      place(frame, track(FR, t)); place(phone, track(PH, t));
      const fv = track(FR, t); glare.style.transform = `translateX(${(-90 + ((fv ? fv.ry : 0) + 20) * 7 + t * 6).toFixed(1)}px) rotate(18deg)`;
      // the dated page: marquee runs, page pans a little in the close-up
      mq.style.transform = `translateX(${(-((t * 70) % 330)).toFixed(1)}px)`;
      oldLayer.style.transform = `translateY(${(t < 2.9 ? 0 : -(70 + 90 * io(seg(t, 3.0, 5.5)))).toFixed(1)}px)`;
      // the tile wave: the live layers swap in under it once every tile has landed
      const after = t >= flip.done; flip.el.style.display = t >= 8.6 && !after ? '' : 'none';
      oldLayer.style.opacity = t < 8.6 ? '1' : '0'; newScroll.style.opacity = after ? '1' : '0';
      newScroll.style.transform = `translateY(${(-(t < 17.1 ? io(seg(t, 11.9, 13.9)) * yRooms : io(seg(t, 17.3, 19.7)) * yBook)).toFixed(1)}px)`;
      wash.style.opacity = (.9 * win(t, 9.5, 10.9, .5)).toFixed(3);
      loopDesk(t); loopPh(t);
      // phone: old squeezed page (5.6-8.75), the new site after
      const phNew = t >= 14.3; oldPh.style.display = phNew ? 'none' : ''; mScroll.style.opacity = phNew ? '1' : '0';
      oldPh.style.transform = `translateY(${(-40 * io(seg(t, 5.8, 7.6))).toFixed(1)}px)`;
      mScroll.style.transform = `translateY(${(-(t < 17.1 ? io(seg(t, 14.4, 15.0)) * mBook : io(seg(t, 17.4, 19.6)) * mRooms)).toFixed(1)}px)`;
      { const k = win(t, 6.0, 7.3, .25), sp = io(seg(t, 6.2, 7.0)) * 26; pinch.style.opacity = k.toFixed(3); f1.style.transform = `translate(${-sp}px,${-sp}px)`; f2.style.transform = `translate(${sp}px,${sp}px)`; }
      { const k = P.springAt(t, 7.3, 'bold'); closed.style.opacity = (clamp(k * 1.6) * win(t, 7.2, 8.6, .3)).toFixed(3); closed.style.transform = `translateY(${((1 - k) * 22).toFixed(1)}px) rotate(${(-3 * k).toFixed(2)}deg)`; }
      // type
      LINES.forEach(([a, b, ...els]) => els.forEach((el, i) => { const k = P.springAt(t, a + i * .22, 'default'), o = P.springAt(t, a + i * .22, 'fade') * (1 - P.tween(t, b, .26, 'snap'));
        el.style.opacity = (a === 0 ? Math.max(i ? 0 : .7, o) * (1 - P.tween(t, b, .26, 'snap')) : o).toFixed(3); el.style.transform = `translateY(${((1 - k) * 14).toFixed(1)}px)`; }));
      flags.forEach((f) => { const k = P.springAt(t, f.t0, 'bold'); f.el.style.opacity = (clamp(k * 1.6) * win(t, 3.0, 5.45, .3)).toFixed(3); f.el.style.transform = `translateY(${((1 - k) * 24).toFixed(1)}px) rotate(${(f.r * k).toFixed(2)}deg) scale(${(.86 + .14 * k).toFixed(3)})`; });
      { const k = P.springAt(t, 11.8, 'bold'); snip.style.opacity = (clamp(k * 1.6) * win(t, 11.6, 14.15, .3)).toFixed(3); snip.style.transform = `translate(${((1 - k) * -30).toFixed(1)}px,${(Math.sin(t * 1.3) * 3).toFixed(1)}px) rotate(${(-2 * k).toFixed(2)}deg)`; }
      chips.forEach((c) => { const k = P.springAt(t, c.t0, 'bold'); c.el.style.opacity = (clamp(k * 1.6) * win(t, 12.3, 14.15, .3)).toFixed(3); c.el.style.transform = `translateY(${((1 - k) * 20 + Math.sin(t * 1.6 + c.t0) * 3).toFixed(1)}px)`; });
      // the calendar layer: out of the phone, two taps, the range fills, Confirm, Booked
      { const k = P.springAt(t, 14.6, 'bold'); cal.style.opacity = (clamp(k * 1.6) * win(t, 14.5, 17.0, .3)).toFixed(3); cal.style.transform = `translate3d(0,${((1 - k) * 60).toFixed(1)}px,0) scale(${(.82 + .18 * k).toFixed(3)}) rotate(${((1 - k) * -4).toFixed(2)}deg)`; }
      const s23 = t >= 15.2, s25 = t >= 15.7, fillK = io(seg(t, 15.7, 15.95));
      [[d23, s23], [d25, s25]].forEach(([el, on]) => { el.style.background = on ? 'linear-gradient(135deg,#ff7a3d,#ff5e7e)' : 'rgba(255,255,255,.07)'; el.style.color = on ? '#fff' : ''; });
      d24.style.background = fillK > 0 ? `rgba(255,122,61,${(.35 * fillK).toFixed(3)})` : 'rgba(255,255,255,.07)';
      sumTxt.innerHTML = s25 ? '2 nights · Fri 23 – Sun 25' : (s23 ? 'Fri 23 → pick check-out' : 'Pick your dates');
      okBtn.style.transform = `scale(${(1 - .08 * win(t, 16.2, 16.35, .06)).toFixed(3)})`;
      { const k = P.springAt(t, 16.4, 'bold'); toast.style.opacity = (clamp(k * 1.6) * win(t, 16.3, 17.0, .2)).toFixed(3); toast.style.transform = `translateY(${((1 - k) * 24 - 50).toFixed(1)}px)`; }
      { const on = win(t, 14.85, 16.9, .2); finger.style.opacity = on.toFixed(3);
        if (on > 0) { let i = 0; while (i < FPATH.length - 2 && t > FPATH[i + 1][0]) i++; const a = FPATH[i], b = FPATH[i + 1], k = io(seg(t, a[0] + .1, b[0]));
          const press = TAPS.some(([tt]) => t > tt && t < tt + .14); finger.style.transform = `translate(${lerp(a[1], b[1], k).toFixed(1)}px,${lerp(a[2], b[2], k).toFixed(1)}px) scale(${press ? .82 : 1})`; }
        const tap = TAPS.find(([tt]) => t >= tt && t < tt + .5); if (tap) { const u = (t - tap[0]) / .5; ripple.style.opacity = (1 - u).toFixed(3); ripple.style.transform = `translate(${tap[1]}px,${tap[2]}px) scale(${(1 + u * 3).toFixed(2)})`; } else ripple.style.opacity = '0'; }
      // light leaks on the cuts
      leak.style.opacity = Math.max(...[2.9, 5.6, 8.7, 11.5, 14.3, 17.1].map((a) => Math.max(0, 1 - Math.abs(t - a) / .32) * .5)).toFixed(3);
      // grain: fresh noise every frame
      const d = gimg.data; let s = (Math.floor(t * 30) * 2654435761) >>> 0; for (let i = 0; i < d.length; i += 4) { s = (s * 1664525 + 1013904223) >>> 0; const v = s >>> 24; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; } gx.putImageData(gimg, 0, 0);
    });
    S.name = 'Fernhollow tile-wave makeover v1';
    return { ok: true };
  };
  S.update = function (E, t) { P.update(t); };
  S.cues = () => [];
})();
