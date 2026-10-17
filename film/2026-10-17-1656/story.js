// FILM, theme `cinema` (a directed product film, its own look), service `social`: "One climbing session. Thirty posts." 20 s, 17 Oct 2026.
// BRIEF (creative director). Brand on the proof site: Kruxa Bouldering, a fictional night-lit bouldering hall. The idea: a month of social posts is set
// like a climbing route. Every hold is one day's post; a chalked hand climbs, each grab throws chalk and peels a post off the wall; the posts fill a feed;
// then the camera pulls back and the whole wall is a 30-day calendar that lights from the floor to the top-out.
// Look: night climbing hall. Teal-black wall (#071416 / #143740) with a T-nut dot grid and panel seams, magenta route (#FF2BD6), sulphur light (#FFD23A)
// raking across the wall, chalk white (#F3EFE6) as the only "atmosphere" (puffs, dust), an aqua side hold (#38E0C8). Type: Big Shoulders Display, condensed
// and huge, set like route tape across the full width. Finish: a moving sulphur beam, magenta/sulphur light leaks on the cuts, vignette, light grain (.022).
// Combination never used together in our work: (1) a climbing route as the content plan (P.holdRoute: hand-climbed holds that light, draw the route, emit posts),
// (2) physical chalk-dust particles as the transition and the texture (P.chalk: closed-form drag + gravity puffs, and a frame-filling chalk burst wipe),
// (3) a camera that travels a 1000x1400 wall (close-up grabs, then a pull-back reveal) + condensed kinetic type spanning the width, with
// (4) the posts flying from the wall into a phone feed grid. New library tricks: P.chalk, P.holdRoute, P.GRADES.magenta.
// Shot list (camera never holds a framing longer than ~2.4 s):
//  0-2.4 wall, three-quarter width, hand grabs holds 1-3 with puffs, slow push and tilt up, hook in three lines | 2.4-4.8 close-up on holds 4-6, each grab
//  peels a post card off the wall into a fan | 4.65 chalk burst wipe | 4.8-6.3 a phone rises, the three posts fly into its feed grid | 6.3-7.8 push into
//  the grid while six more posts land | breath 7.8-8.4 (dim) | 8.4-10.8 whip pull-back: the whole wall, holds 7-30 ignite floor to top, day counter to 30 |
//  10.8-13.2 the phone: comments answered, a weekly review fills | 13.2-15.4 a glass browser with the Kruxa site scrolling to its month wall |
//  15.4-17.3 pull back, browser and phone together | 17.3-20 brand end (magenta grade).
(function () {
  const E = window.FilmEngine, P = window.FilmParts, { clamp, lerp } = E, S = (E.story = {});
  S.selfStage = true;
  S.dna = {
    service: 'social', theme: 'cinema', format: 'tiny story',
    combo: 'a climbing route as the content plan (hand-climbed holds that light up and emit posts) + physical chalk-dust particles as texture and as the transition + a camera travelling a giant wall to a pull-back calendar reveal, with condensed kinetic type spanning the width',
    opening: 'a night-lit teal climbing wall fills the frame, a chalked hand grabs magenta holds one by one, each grab throwing a chalk puff, under the hook "One climbing session. Thirty posts." in huge condensed type',
    bigMoment: 'after a held breath the camera whips back to the whole wall: thirty numbered holds ignite from the floor to the top-out in a wave of chalk while a day counter runs to 30, the route becomes a month of posts',
    ground: 'teal-black climbing wall with a T-nut dot grid and panel seams, a moving sulphur light beam, chalk dust, magenta and sulphur light leaks, vignette and light grain',
    music: 'driving indie-electronic with a taut bass pulse and hand claps, a held breath, a bright lift on the ignite wave and a tight resolve, about 100 BPM',
  };
  const INK = '#071416', MAG = '#ff2bd6', SUL = '#ffd23a', CHALK = '#f3efe6', AQUA = '#38e0c8', MONO = "'Geist Mono',ui-monospace,monospace";
  const DISP = "'Big Shoulders Display',Impact,sans-serif", BODY = "'Funnel Sans',Archivo,sans-serif";
  const io = (k) => P.EASE.swing(clamp(k)), seg = (t, a, b) => clamp((t - a) / (b - a));
  const win = (t, a, b, f = .3) => clamp((t - a) / f) * (1 - clamp((t - b) / f));
  const track = (segs, t) => { const s = segs.find(([a, b]) => t >= a && t < b); if (!s) return null; const k = io(seg(t, s[0], s[1])), o = {};
    for (const key of new Set([...Object.keys(s[2]), ...Object.keys(s[3])])) o[key] = lerp(s[2][key] ?? 0, s[3][key] ?? s[2][key] ?? 0, k); return o; };
  const place = (el, v) => { if (!v) { el.style.opacity = '0'; return; } el.style.opacity = (v.o ?? 1).toFixed(3);
    el.style.transform = `translate(${(v.x || 0).toFixed(1)}px,${(v.y || 0).toFixed(1)}px) perspective(900px) rotateX(${(v.rx || 0).toFixed(2)}deg) rotateY(${(v.ry || 0).toFixed(2)}deg) scale(${(v.s || 1).toFixed(4)})`; };

  S.setup = async function () {
    document.documentElement.classList.add('reel');
    await P.ready; await document.fonts.ready;
    await Promise.all(['900 60px "Big Shoulders Display"', '800 20px "Big Shoulders Display"', '600 14px "Funnel Sans"', '800 14px "Funnel Sans"'].map((f) => document.fonts.load(f)));
    await new Promise((r) => setTimeout(r, 1500));
    const srcSite = document.querySelector('.site');
    const { world } = P.scene({ accent: MAG, ink: INK, glow: 'rgba(56,224,200,.08)', len: 20 });
    P.breath = [7.8, 8.4];
    P.use('opener', 'night-wall-hand-climb'); P.use('payoff', 'wall-calendar-ignite'); P.use('type', 'condensed-route-tape');
    P.use('focus', 'sulphur-beam-rake'); P.use('captions', 'two-line-condensed');

    // ---------- the wall: 1000 x 1400 wall units, travelled by a camera ----------
    const WW = 1000, WH = 1400, NS = 'http://www.w3.org/2000/svg';
    const wall = E.el('div', `position:absolute;left:0;top:0;width:${WW}px;height:${WH}px;transform-origin:0 0`, world);
    { const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', `0 0 ${WW} ${WH}`); svg.setAttribute('width', WW); svg.setAttribute('height', WH); svg.style.cssText = 'position:absolute;inset:0;overflow:visible'; wall.appendChild(svg);
      let s = 31; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
      let h = `<defs><linearGradient id="wg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#16404a"/><stop offset=".55" stop-color="#0e2a30"/><stop offset="1" stop-color="#081a1d"/></linearGradient>
        <pattern id="tn" width="38" height="38" patternUnits="userSpaceOnUse"><circle cx="19" cy="19" r="2" fill="rgba(243,239,230,.14)"/></pattern></defs>
        <rect x="-400" y="-400" width="${WW + 800}" height="${WH + 800}" fill="url(#wg)"/><rect x="-400" y="-400" width="${WW + 800}" height="${WH + 800}" fill="url(#tn)"/>`;
      [[-400, 420, 1400, 300], [560, -400, 420, 1800], [-400, 1000, 1400, 1160], [180, -400, 80, 1800]].forEach(([a, b, c, d]) => { h += `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="rgba(0,0,0,.4)" stroke-width="4"/><line x1="${a}" y1="${b + 3}" x2="${c}" y2="${d + 3}" stroke="rgba(255,255,255,.05)" stroke-width="2"/>`; });
      // decoration holds: dim teal-grey and a few coloured ones, not on the route
      for (let i = 0; i < 70; i++) { const x = -200 + rnd() * 1400, y = -200 + rnd() * 1800, r = 9 + rnd() * 16, c = ['#2b5a60', '#2b5a60', '#2b5a60', '#7d6a1d', '#1e6f66', '#6d6a64'][i % 6];
        h += `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${(rnd() * 360).toFixed(0)})"><ellipse rx="${r.toFixed(1)}" ry="${(r * .78).toFixed(1)}" fill="#000" opacity=".4" transform="translate(3 5)"/><ellipse rx="${r.toFixed(1)}" ry="${(r * .78).toFixed(1)}" fill="${c}"/><circle r="2.5" fill="#06110f"/></g>`; }
      svg.innerHTML = h; }
    const KC = { m: MAG, s: SUL, c: CHALK, a: AQUA }, KINDS = ['m', 's', 'c', 'm', 's', 'm', 'c', 'a'];
    let sj = 9; const jit = () => { sj = (sj * 16807) % 2147483647; return sj / 2147483647 - .5; };
    const PTS = Array.from({ length: 30 }, (_, i) => { const r = Math.floor(i / 5), c = r % 2 ? 4 - i % 5 : i % 5; return [Math.round(110 + c * 195 + jit() * 40), Math.round(1310 - r * 228 + jit() * 50), KC[KINDS[i % 8]], String(i + 1)]; });
    const chalk = P.chalk(wall, { w: WW, h: WH });
    const GRABS = [.25, .95, 1.65, 2.75, 3.45, 4.15], IGN = [8.5, .075];
    const route = P.holdRoute(wall, { pts: PTS, grabs: GRABS, ignite: IGN, chalk, w: WW, h: WH, r: 34, hs: 68 });
    // camera over the wall: keys [t, cx, cy, s], swing between keys (zero speed at both ends of every move)
    const CAM = [[0, 300, 1100, .8], [2.4, 330, 1060, .9], [2.75, 760, 1190, 1.38], [4.8, 790, 1170, 1.52], [5.1, 520, 820, .66], [7.8, 500, 780, .72], [8.4, 500, 760, .74], [8.85, 500, 690, .47], [10.8, 500, 680, .41], [11.1, 520, 900, .8], [17.3, 480, 820, .9], [20, 480, 820, .9]];
    const cam = (t) => { let i = 0; while (i < CAM.length - 2 && t >= CAM[i + 1][0]) i++; const a = CAM[i], b = CAM[i + 1], k = io(seg(t, a[0], b[0]));
      return { cx: lerp(a[1], b[1], k), cy: lerp(a[2], b[2], k), s: lerp(a[3], b[3], k) }; };
    const toScreen = (x, y, t) => { const c = cam(t); return [201 + (x - c.cx) * c.s, 400 + (y - c.cy) * c.s]; };
    // the sulphur beam that rakes the wall + dim layer for the phone/browser shots
    const beam = E.el('div', 'position:absolute;left:-200px;top:-300px;width:520px;height:1400px;background:linear-gradient(90deg,rgba(255,210,58,0),rgba(255,210,58,.17) 45%,rgba(255,210,58,0));mix-blend-mode:screen;transform-origin:50% 50%', world);
    const dim = E.el('div', `position:absolute;inset:0;background:${INK};opacity:0`, world);
    const rig = E.el('div', 'position:absolute;inset:0', world);

    // ---------- post cards (peel off holds 4-6 in the close-up) ----------
    const POSTS = [['REEL', 'Heel hook 101', 'linear-gradient(160deg,#ff2bd6,#7a0a68)', '#fff'], ['CAROUSEL', '5 first-visit mistakes', 'linear-gradient(160deg,#ffd23a,#c77b00)', '#1d1600'],
      ['STORY', 'New set Friday', 'linear-gradient(160deg,#f3efe6,#9db5b2)', '#0b1a1d'], ['LIVE', 'Setter Q&A', 'linear-gradient(160deg,#38e0c8,#0a6d63)', '#04201d'],
      ['REEL', 'Top-out of the week', 'linear-gradient(160deg,#c21fa6,#2a0a3a)', '#fff'], ['CAROUSEL', 'Grades, explained', 'linear-gradient(160deg,#ffb23a,#7a3b00)', '#1d1000'],
      ['STORY', 'Which wall next?', 'linear-gradient(160deg,#e9e2d4,#7f9895)', '#0b1a1d'], ['REEL', 'First send', 'linear-gradient(160deg,#ff5bd0,#5a0a50)', '#fff'], ['CAROUSEL', 'Chalk up right', 'linear-gradient(160deg,#ffe066,#b58a00)', '#1d1600']];
    const blobSvg = (fill) => `<svg viewBox="-30 -30 60 60" width="64" height="64" style="position:absolute;right:-12px;top:22px"><path d="M-22,-4C-22,-18 -6,-24 8,-20S26,-6 22,8 6,24 -8,22 -22,10 -22,-4Z" fill="${fill}"/><circle r="3" fill="rgba(0,0,0,.35)"/></svg>`;
    const postHtml = ([ty, ti, g, col], big) => `<div style="position:absolute;inset:0;border-radius:${big ? 16 : 6}px;overflow:hidden;background:${g};color:${col};box-shadow:inset 0 0 0 1px rgba(255,255,255,.14)">${blobSvg('rgba(255,255,255,.28)')}
      <span style="position:absolute;left:${big ? 10 : 5}px;top:${big ? 10 : 5}px;padding:${big ? '5px 7px' : '2px 4px'};border-radius:5px;background:rgba(7,20,22,.6);color:${CHALK};font:800 ${big ? 10 : 6}px/1 ${BODY};letter-spacing:.1em">${ty}${ty === 'REEL' ? ' ▶' : ''}</span>
      <b style="position:absolute;left:${big ? 10 : 5}px;right:${big ? 8 : 4}px;bottom:${big ? 10 : 5}px;font:900 ${big ? 22 : 11}px/.9 ${DISP};text-transform:uppercase">${ti}</b></div>`;
    const CW = 108, CH = 136, SLOTS = [[30, 300, -6], [147, 268, 1], [264, 236, 6]];
    const cards = [3, 4, 5].map((hi, n) => ({ hi, n, el: E.el('div', `position:absolute;left:0;top:0;width:${CW}px;height:${CH}px;opacity:0;box-shadow:0 22px 40px -14px rgba(0,0,0,.8);border-radius:16px`, P.front, postHtml(POSTS[n], true)) }));

    // ---------- the phone ----------
    const PHX = 76, PHY = 210, PHW = 250, PHH = 500, SW = PHW - 14, SH = PHH - 14;
    const phone = E.el('div', `position:absolute;left:${PHX}px;top:${PHY}px;width:${PHW}px;height:${PHH}px;border-radius:36px;padding:7px;box-sizing:border-box;transform-origin:50% 40%;opacity:0;
      background:linear-gradient(160deg,#e8e4dc,#8f9a98 40%,#1b2a2c);box-shadow:0 0 0 1px rgba(243,239,230,.3),0 40px 70px -20px rgba(0,0,0,.85),0 0 60px -12px rgba(255,43,214,.35)`, rig);
    const pscr = E.el('div', `position:relative;width:100%;height:100%;border-radius:29px;overflow:hidden;background:#0b1a1d`, phone);
    E.el('i', 'position:absolute;left:50%;top:8px;width:70px;height:20px;margin-left:-35px;border-radius:99px;background:#030807;z-index:5', pscr);
    // screen 1: the feed grid (a generic profile grid, our own drawing)
    const feed = E.el('div', 'position:absolute;inset:0', pscr,
      `<div style="position:absolute;left:14px;top:40px;display:flex;align-items:center;gap:10px"><i style="width:46px;height:46px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ff7ae6,#ff2bd6 55%,#7a0a68);box-shadow:0 0 0 2px #0b1a1d,0 0 0 4px ${SUL}"></i>
        <div><div style="font:900 18px/1 ${DISP};color:${CHALK};letter-spacing:.03em">KRUXA</div><div style="margin-top:4px;font:600 10px/1 ${BODY};color:#9db5b2">Bouldering · open till midnight</div></div></div>
       <div style="position:absolute;left:14px;right:14px;top:98px;display:flex;gap:8px"><i style="flex:1;height:22px;border-radius:7px;background:${MAG}"></i><i style="flex:1;height:22px;border-radius:7px;background:rgba(243,239,230,.12)"></i></div>`);
    const TW = (SW - 4) / 3, TOP = 132;
    const tiles = POSTS.map((p, i) => E.el('div', `position:absolute;left:${(i % 3) * (TW + 2)}px;top:${TOP + Math.floor(i / 3) * (TW * 1.25 + 2)}px;width:${TW}px;height:${TW * 1.25}px;opacity:0`, feed, postHtml(p, false)));
    const LAND = [5.55, 5.75, 5.95, 6.5, 6.7, 6.9, 7.1, 7.3, 7.5];
    // screen 2: replies + weekly review
    const replies = E.el('div', 'position:absolute;inset:0;opacity:0', pscr);
    const bub = (html, me, top) => E.el('div', `position:absolute;${me ? 'right:12px' : 'left:12px'};top:${top}px;max-width:178px;padding:9px 11px;border-radius:14px;${me ? `background:${MAG};color:#fff;border-bottom-right-radius:4px` : `background:rgba(243,239,230,.1);color:${CHALK};border-bottom-left-radius:4px`};font:600 11.5px/1.3 ${BODY};opacity:0`, replies, html);
    E.el('div', `position:absolute;left:14px;top:40px;font:900 20px/1 ${DISP};color:${CHALK};letter-spacing:.03em`, replies, 'COMMENTS');
    const BUBS = [[bub('Is Friday’s set OK for a first timer?', false, 72), 11.0], [bub('Yes! Start on the yellow holds. See you there.', true, 124), 11.35], [bub('Booked for Saturday', false, 184), 11.7], [bub('See you on the wall!', true, 222), 11.95]];
    const review = E.el('div', `position:absolute;left:12px;right:12px;top:282px;padding:12px;border-radius:16px;background:linear-gradient(160deg,#143740,#0b1d20);box-shadow:inset 0 0 0 1px rgba(243,239,230,.12);opacity:0`, replies,
      `<div style="font:900 15px/1 ${DISP};color:${SUL};letter-spacing:.06em">WEEKLY REVIEW</div>` + ['Reach', 'Saves', 'Shares', 'Visits'].map((n, i) => `<div style="display:flex;align-items:center;gap:8px;margin-top:10px;font:600 10.5px/1 ${BODY};color:#9db5b2"><span style="width:40px">${n}</span><i style="flex:1;height:9px;border-radius:5px;background:rgba(243,239,230,.1);overflow:hidden"><b class="rb" style="display:block;height:100%;width:${[86, 64, 72, 58][i]}%;border-radius:5px;background:linear-gradient(90deg,${MAG},${SUL});transform-origin:0 50%"></b></i></div>`).join(''));
    const rbars = [...review.querySelectorAll('.rb')];
    // screen 3: the Kruxa site, mobile layout (zoomed, not scaled: crisp type)
    const mk = (w, z) => { const c = srcSite.cloneNode(true); c.style.cssText = `position:absolute;left:0;top:0;width:${w}px;zoom:${z}`;
      c.querySelectorAll('*').forEach((n) => { n.style.animation = 'none'; }); c.querySelectorAll('canvas,.hand').forEach((n) => n.remove()); return c; };
    const mScroll = E.el('div', 'position:absolute;left:0;top:0;width:100%;opacity:0', pscr), msite = mk(402, SW / 402); mScroll.appendChild(msite);
    const off = (root, sel) => { const a = root.querySelector(sel).getBoundingClientRect(), b = root.getBoundingClientRect(); return a.top - b.top; };
    const mMonth = off(msite, '#month') - 10;

    // ---------- the glass browser with the desktop site ----------
    const BX = 20, BY = 262, BW = 362, BH = 300, TB = 22, VW = BW - 2, VH = BH - TB - 1;
    const frame = E.el('div', `position:absolute;left:${BX}px;top:${BY}px;width:${BW}px;height:${BH}px;border-radius:14px;transform-origin:50% 50%;opacity:0;
      background:linear-gradient(160deg,rgba(255,255,255,.16),rgba(255,255,255,.05));border:1px solid rgba(243,239,230,.28);box-shadow:0 40px 80px -30px rgba(0,0,0,.9),0 0 60px -16px rgba(255,43,214,.4)`, rig);
    E.el('div', `position:absolute;left:0;right:0;top:0;height:${TB}px;display:flex;align-items:center;gap:6px;padding:0 10px;border-bottom:1px solid rgba(255,255,255,.12);border-radius:14px 14px 0 0;background:rgba(7,20,22,.9)`, frame,
      `<i style="width:7px;height:7px;border-radius:50%;background:#ff5f57"></i><i style="width:7px;height:7px;border-radius:50%;background:#febc2e"></i><i style="width:7px;height:7px;border-radius:50%;background:#28c840"></i>
       <div style="margin-left:10px;flex:1;height:14px;border-radius:5px;background:rgba(255,255,255,.08);display:flex;align-items:center;padding:0 8px;font:500 9.5px/1 ${MONO};color:#cfe0dd">kruxa.climb</div>`);
    const vp = E.el('div', `position:absolute;left:1px;top:${TB}px;width:${VW}px;height:${VH}px;overflow:hidden;border-radius:0 0 13px 13px;background:${INK}`, frame);
    const dScroll = E.el('div', 'position:absolute;left:0;top:0;width:100%', vp), dsite = mk(1180, VW / 1180); dScroll.appendChild(dsite);
    const dMonth = off(dsite, '#month') - 6;
    const glare = E.el('div', 'position:absolute;inset:0;border-radius:14px;overflow:hidden;pointer-events:none', frame, '<i style="position:absolute;top:-40%;left:0;width:80px;height:180%;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.14),rgba(255,255,255,0));transform:rotate(18deg)"></i>').firstChild;

    // ---------- type: condensed lines spanning the width, at the top ----------
    const scrim = E.el('div', `position:absolute;left:0;right:0;top:0;height:300px;background:linear-gradient(${INK}e0,${INK}a8 55%,${INK}00)`, P.front); P.front.prepend(scrim);
    const T = (html, css) => E.el('div', `position:absolute;left:28px;right:28px;color:${CHALK};font:900 56px/.88 ${DISP};text-transform:uppercase;letter-spacing:-.005em;white-space:nowrap;opacity:0;${css}`, P.front, html);
    const LINES = [
      [-.7, 2.25, T('One climbing', 'top:98px;font-size:66px'), T('session.', 'top:156px;font-size:66px'), T(`<span style="color:${MAG};text-shadow:0 0 30px rgba(255,43,214,.55)">Thirty posts.</span>`, 'top:214px;font-size:64px')],
      [2.5, 4.6, T('Every move', 'top:100px;font-size:46px'), T(`<span style="color:${MAG}">is a post.</span>`, 'top:144px;font-size:66px')],
      [4.95, 7.7, T('Planned. Shot.', 'top:100px;font-size:46px'), T(`<span style="color:${SUL}">Posted.</span>`, 'top:144px;font-size:72px')],
      [8.45, 10.65, T('Day <span class="dc">07</span> <span style="color:#9db5b2">→ 30</span>', 'top:98px;font-size:46px'), T(`<span style="color:${SUL};text-shadow:0 0 30px rgba(255,210,58,.5)">A month, mapped.</span>`, 'top:142px;font-size:50px')],
      [10.95, 13.05, T('We post.', 'top:100px;font-size:46px'), T(`<span style="color:${MAG}">Reply. Review.</span>`, 'top:144px;font-size:60px')],
      [13.35, 15.25, T('Your site', 'top:100px;font-size:46px'), T(`<span style="color:${SUL}">climbs too.</span>`, 'top:144px;font-size:66px')],
      [15.5, 17.2, T('Feed + site.', 'top:100px;font-size:46px'), T(`<span style="color:${MAG}">One team.</span>`, 'top:144px;font-size:68px')],
    ];
    const dc = P.front.querySelector('.dc');

    // ---------- finish: chalk wipe, light leaks, grade, vignette, grain ----------
    const fx = P.chalk(P.front, { color: CHALK }); fx.wipe(4.62, 220, 420);
    const leak = E.el('div', 'position:absolute;inset:-20%;background:radial-gradient(40% 35% at 18% 28%,rgba(255,43,214,.55),rgba(255,43,214,0) 70%),radial-gradient(35% 30% at 85% 72%,rgba(255,210,58,.5),rgba(255,210,58,0) 70%);mix-blend-mode:screen;opacity:0', P.front);
    const wash = E.el('div', 'position:absolute;inset:0;background:radial-gradient(60% 50% at 50% 60%,rgba(255,210,58,.30),rgba(255,43,214,.12) 45%,rgba(0,0,0,0) 75%);mix-blend-mode:screen;opacity:0', P.front);
    E.el('div', 'position:absolute;inset:0;background:linear-gradient(135deg,rgba(56,224,200,.07),rgba(0,0,0,0) 45%,rgba(255,43,214,.06));mix-blend-mode:soft-light', P.front);
    E.el('div', 'position:absolute;inset:0;background:radial-gradient(85% 70% at 50% 48%,rgba(0,0,0,0),rgba(0,0,0,.5))', P.front);
    const gc = E.el('canvas', 'position:absolute;inset:0;width:402px;height:715px;opacity:.022;mix-blend-mode:overlay', P.front); gc.width = 201; gc.height = 358; const gx = gc.getContext('2d'), gimg = gx.createImageData(201, 358);
    P.brandEnd({ at: 17.3, keyword: 'MONTH', why: 'One climbing session. Thirty posts.', grade: 'magenta' });

    // ---------- placements ----------
    const PH = [
      [6.3, 8.4, { s: 1.04, y: 0 }, { s: 1.2, y: -70 }],
      [10.8, 13.2, { s: .98, y: 30, ry: -8, rx: 2 }, { s: 1.07, y: 6, ry: 4, rx: 1 }],
      [15.4, 17.45, { s: .6, x: 112, y: 118, ry: -20, rx: 2 }, { s: .64, x: 104, y: 98, ry: -6, rx: 1 }],
    ];
    const FR = [[13.2, 15.4, { s: .97, y: 14, ry: 10, rx: 3 }, { s: 1.07, y: 0, ry: -3, rx: 1 }], [15.4, 17.45, { s: .98, x: -14, y: -44, ry: 12, rx: 3 }, { s: .88, x: -8, y: -54, ry: -6, rx: 2 }]];
    const tilePos = (i, t) => { const ph = phoneAt(t), sc = ph.s, ox = PHX + PHW / 2, oy = PHY + PHH * .4;   // tile centre on screen, through the phone's transform
      const lx = PHX + 7 + (i % 3) * (TW + 2) + TW / 2, ly = PHY + 7 + TOP + Math.floor(i / 3) * (TW * 1.25 + 2) + TW * .625; return [ox + (lx - ox) * sc + (ph.x || 0), oy + (ly - oy) * sc + (ph.y || 0)]; };
    const phoneAt = (t) => { if (t >= 4.75 && t < 6.3) { const k = P.springAt(t, 4.75, 'default'); return { y: (1 - k) * 420, s: .96 + .08 * io(seg(t, 4.8, 6.3)), o: clamp((t - 4.75) * 8) }; } return track(PH, t) || { o: 0, s: 1 }; };

    P.on((t) => {
      const c = cam(t); wall.style.transform = `translate(${(201 - c.cx * c.s).toFixed(2)}px,${(400 - c.cy * c.s).toFixed(2)}px) scale(${c.s.toFixed(4)})`;
      beam.style.transform = `translateX(${(-60 + 260 * (.5 + .5 * Math.sin(t * Math.PI * 2 / 10))).toFixed(1)}px) rotate(14deg)`;
      const onDev = (t >= 4.8 && t < 8.4) || (t >= 10.8 && t < 17.45);
      dim.style.opacity = (Math.max(win(t, 4.85, 8.35, .35) * .5, win(t, 10.85, 17.4, .3) * .62)).toFixed(3);
      // cards: peel off their hold, fan out under the caption, then fly into the phone grid
      cards.forEach((o) => { const tg = GRABS[o.hi], [hx, hy] = toScreen(PTS[o.hi][0], PTS[o.hi][1], tg), [sx, sy, rot] = SLOTS[o.n];
        if (t < tg) { o.el.style.opacity = '0'; return; }
        const k = P.springAt(t, tg, 'bold'), land = LAND[o.n], fly = io(seg(t, 5.1 + o.n * .2, land));
        let x = lerp(hx - CW / 2, sx, k), y = lerp(hy - CH / 2, sy, k), sc = .35 + .65 * Math.min(1.05, k), r = rot * k;
        if (t > 5.1) { const [tx, ty] = tilePos(o.n, t), tsc = (TW / CW) * phoneAt(t).s; x = lerp(x, tx - CW / 2, fly); y = lerp(y, ty - CH / 2, fly); sc = lerp(sc, tsc, fly); r = lerp(r, 0, fly); }
        o.el.style.opacity = (Math.min(1, (t - tg) * 10) * (t >= land ? 0 : 1)).toFixed(3);
        o.el.style.transform = `translate(${x.toFixed(1)}px,${(y + (t < 5.1 ? Math.sin(t * 2 + o.n) * 3 : 0)).toFixed(1)}px) rotate(${r.toFixed(2)}deg) scale(${sc.toFixed(3)})`; });
      // phone
      const ph = phoneAt(t); place(phone, ph);
      feed.style.opacity = t < 8.4 ? '1' : '0'; replies.style.opacity = t >= 10.8 && t < 13.2 ? '1' : '0'; mScroll.style.opacity = t >= 15.4 ? '1' : '0';
      tiles.forEach((el, i) => { const k = P.springAt(t, LAND[i], 'bold'); el.style.opacity = t >= LAND[i] ? '1' : '0'; el.style.transform = `scale(${(i < 3 ? 1 : .6 + .4 * Math.min(1.04, k)).toFixed(3)})`; });
      BUBS.forEach(([el, t0]) => { const k = P.springAt(t, t0, 'bold'); el.style.opacity = (t >= t0 ? Math.min(1, (t - t0) * 9) : 0).toFixed(3); el.style.transform = `translateY(${((1 - k) * 14).toFixed(1)}px) scale(${(.9 + .1 * Math.min(1, k)).toFixed(3)})`; });
      { const k = P.springAt(t, 12.2, 'bold'); review.style.opacity = (t >= 12.2 ? Math.min(1, (t - 12.2) * 8) : 0).toFixed(3); review.style.transform = `translateY(${((1 - k) * 20).toFixed(1)}px)`;
        rbars.forEach((b, i) => { b.style.transform = `scaleX(${io(seg(t, 12.35 + i * .12, 12.95 + i * .12)).toFixed(3)})`; }); }
      mScroll.style.transform = `translateY(${(-io(seg(t, 15.6, 17.2)) * mMonth).toFixed(1)}px)`;
      // browser
      place(frame, track(FR, t)); const fv = track(FR, t);
      glare.style.transform = `translateX(${(-90 + ((fv ? fv.ry : 0) + 20) * 7 + t * 6).toFixed(1)}px) rotate(18deg)`;
      dScroll.style.transform = `translateY(${(-io(seg(t, 13.7, 15.2)) * dMonth).toFixed(1)}px)`;
      // type
      LINES.forEach(([a, b, ...els]) => els.forEach((el, i) => { const k = P.springAt(t, a + i * .18, 'default'), o = P.springAt(t, a + i * .18, 'fade') * (1 - P.tween(t, b, .24, 'snap'));
        el.style.opacity = (a < 0 ? Math.max(i ? 0 : .85, o) * (1 - P.tween(t, b, .24, 'snap')) : o).toFixed(3); el.style.transform = `translateY(${((1 - k) * 16).toFixed(1)}px)`;
        el.style.fontVariationSettings = ''; }));
      { let n = 6; for (let i = 6; i < 30; i++) if (t >= route.litAt(i)) n = i + 1; dc.textContent = String(n).padStart(2, '0'); }
      scrim.style.opacity = t < 17.3 ? '1' : '0';
      wash.style.opacity = (.85 * win(t, 8.5, 10.5, .4)).toFixed(3);
      leak.style.opacity = Math.max(...[2.4, 4.8, 8.4, 10.8, 13.2, 15.4].map((a) => Math.max(0, 1 - Math.abs(t - a) / .3) * .45)).toFixed(3);
      const d = gimg.data; let s = (Math.floor(t * 30) * 2654435761) >>> 0; for (let i = 0; i < d.length; i += 4) { s = (s * 1664525 + 1013904223) >>> 0; const v = s >>> 24; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; } gx.putImageData(gimg, 0, 0);
    });
    S.name = 'Kruxa route-month v1';
    return { ok: true };
  };
  S.update = function (E, t) { P.update(t); };
  S.cues = () => [];
})();
