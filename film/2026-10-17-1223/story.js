// FILM, theme `cinema`: a 25 s cinematic product film of our own Aurelia website (a fictional sculpted speaker), made to look like a 3D render finished
// in compositing: dark studio, amber beams, colour glows, dust, a reflective floor, glass glare, light leaks, grain, vignette, grade, handheld camera.
// 0-3 logo draws on, letters sharpen, the camera flies through | 3-8 a glass browser flies in tilted, types the address, the page builds |
// 8-12 the page explodes into layers with cyan wireframes and labels while the camera circles ~32 deg, then snaps back | 12-16.5 features: cards flip
// up with live visuals, a cursor hovers | 16.5-20 dashboard: the chart draws, stats count up, the cursor clicks Pre-order (ripple, "Reserved") |
// 20-22.5 a phone swings in beside the browser | 22.5-25 warm flash, Aurelia end card, Aquarii sign-off.
(function () {
  const E = window.FilmEngine, P = window.FilmParts, { clamp, lerp } = E, S = (E.story = {});
  S.selfStage = true;
  S.dna = {
    service: 'web', theme: 'cinema', format: 'product film',
    opening: 'a glowing amber ring draws itself on in a dark studio, AURELIA sharpens letter by letter, and the camera flies through the ring',
    bigMoment: 'the live website splits into floating layers with cyan wireframes and labels while the camera circles around them, then snaps back together',
    ground: 'dark navy studio with amber light beams, amber-violet-cyan glows, drifting dust and a faint reflective grid floor',
    music: 'cinematic minimal electronic with a deep pulse, a riser into the layer split and a warm swell at the end, about 100 BPM',
  };
  const A1 = '#FFB35C', A2 = '#FF6A2C', CY = '#38e1ff', VIO = '#8b6cff', INK = '#05060a';
  const expo = (k) => (k >= 1 ? 1 : 1 - Math.pow(2, -10 * Math.max(0, k)));          // expo-out
  const io = (k) => P.EASE.swing(clamp(k));                                           // cubic in-out
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const win = (t, a, b, f = .35) => clamp((t - a) / f) * (1 - clamp((t - b) / f));
  const noise = (t, s) => Math.sin(t * 1.7 + s) * .5 + Math.sin(t * 2.9 + s * 2.1) * .3 + Math.sin(t * 4.3 + s * 3.7) * .2;

  S.setup = async function () {
    document.documentElement.classList.add('reel');
    await P.ready; await document.fonts.ready;
    await new Promise((r) => setTimeout(r, 1200));
    const srcSite = document.querySelector('.site');
    const { world } = P.scene({ accent: A1, ink: INK, glow: 'rgba(255,150,70,.08)', len: 25 });
    P.use('opener', 'logo-ring-flythrough'); P.use('mechanism', 'browser-build-3d'); P.use('payoff', 'exploded-layers-orbit');
    P.use('transition', 'light-leak'); P.use('type', 'inter-display-captions'); P.use('focus', 'dof-glass-glare');

    // ---------- studio: glows, beams, floor ----------
    E.el('div', 'position:absolute;left:-200px;top:-260px;width:802px;height:760px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,170,90,.55),rgba(255,130,60,.22) 45%,rgba(255,120,50,0));pointer-events:none', world);
    E.el('div', 'position:absolute;left:-160px;top:470px;width:722px;height:420px;border-radius:50%;background:radial-gradient(closest-side,rgba(110,80,255,.42),rgba(110,80,255,0));pointer-events:none', world);
    const glows = [[A2, -120, 80, 420, .45], [VIO, 160, 420, 380, .38], [CY, -60, 520, 300, .18]].map(([c, x, y, d, o]) => ({ el: E.el('div', `position:absolute;left:${x}px;top:${y}px;width:${d}px;height:${d}px;border-radius:50%;background:radial-gradient(closest-side,${c}66,${c}00);opacity:${o}`, world), x, y, o }));
    const beams = [[10, -12, .5], [140, -4, .75], [270, 9, .5]].map(([x, r, o]) => ({ el: E.el('div', `position:absolute;left:${x}px;top:-120px;width:200px;height:800px;transform-origin:50% 0;background:linear-gradient(rgba(255,196,130,.5),rgba(255,160,80,.16) 55%,rgba(255,150,70,0));filter:blur(14px);opacity:${o};mix-blend-mode:screen`, world), r, o }));
    const view = E.el('div', 'position:absolute;inset:0;perspective:880px;perspective-origin:50% 44%', world);
    const rig = E.el('div', 'position:absolute;inset:0;transform-style:preserve-3d', view);
    const floor = E.el('div', `position:absolute;left:-300px;top:516px;width:1002px;height:700px;transform-origin:50% 0;transform:rotateX(78deg);
      background-image:linear-gradient(rgba(56,225,255,.16) 1px,transparent 1px),linear-gradient(90deg,rgba(56,225,255,.16) 1px,transparent 1px);background-size:44px 44px;
      -webkit-mask:radial-gradient(50% 45% at 50% 0,#000,transparent);mask:radial-gradient(50% 45% at 50% 0,#000,transparent);opacity:.55`, rig);
    const pool = E.el('div', 'position:absolute;left:21px;top:492px;width:360px;height:80px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,150,70,.55),rgba(255,150,70,0));filter:blur(6px)', rig);

    // ---------- logo intro ----------
    const logo = E.el('div', 'position:absolute;left:0;right:0;top:250px;text-align:center;transform-style:preserve-3d', rig,
      `<svg width="120" height="120" viewBox="0 0 120 120" style="display:block;margin:0 auto;overflow:visible"><circle cx="60" cy="60" r="44" fill="none" stroke="${A1}" stroke-width="3" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" style="filter:drop-shadow(0 0 8px ${A1}) drop-shadow(0 0 22px ${A2})"/><circle cx="60" cy="60" r="20" fill="${A1}" opacity="0" style="filter:blur(8px)"/></svg>
       <div class="lw" style="margin-top:22px;font:700 34px/1 Inter,sans-serif;font-variation-settings:'opsz' 32;color:#f6efe4">${'AURELIA'.split('').map((c) => `<span style="display:inline-block">${c}</span>`).join('')}</div>
       <div class="tg" style="margin-top:14px;font:400 14px/1 Inter,sans-serif;letter-spacing:.32em;color:#c9b9a4;text-transform:uppercase">Sound, sculpted.</div>`);
    const ring = logo.querySelector('circle'), core = logo.querySelectorAll('circle')[1], letters = [...logo.querySelectorAll('.lw span')], tag = logo.querySelector('.tg'), lw = logo.querySelector('.lw');

    // ---------- the glass browser with the live site inside ----------
    const BX = 14, BY = 262, BW = 374, BH = 252, TB = 22;
    const frame = E.el('div', `position:absolute;left:${BX}px;top:${BY}px;width:${BW}px;height:${BH}px;border-radius:16px;transform-style:preserve-3d;
      background:linear-gradient(160deg,rgba(255,255,255,.14),rgba(255,255,255,.04));border:1px solid rgba(255,255,255,.22);box-shadow:0 40px 80px -30px rgba(0,0,0,.9),0 0 60px -20px rgba(255,140,60,.35)`, rig);
    const bar = E.el('div', `position:absolute;left:0;right:0;top:0;height:${TB}px;display:flex;align-items:center;gap:6px;padding:0 10px;border-bottom:1px solid rgba(255,255,255,.12);border-radius:16px 16px 0 0;background:rgba(10,12,18,.75)`, frame,
      `<i style="width:7px;height:7px;border-radius:50%;background:#ff5f57"></i><i style="width:7px;height:7px;border-radius:50%;background:#febc2e"></i><i style="width:7px;height:7px;border-radius:50%;background:#28c840"></i>
       <div style="margin-left:10px;flex:1;height:14px;border-radius:5px;background:rgba(255,255,255,.07);display:flex;align-items:center;padding:0 8px;font:500 9.5px/1 Inter,sans-serif;color:#d9d6cf;position:relative;overflow:hidden"><span class="url"></span><i class="caret" style="width:1px;height:10px;background:#fff;margin-left:1px"></i><i class="lb" style="position:absolute;left:0;bottom:0;height:2px;width:0;background:linear-gradient(90deg,${A1},${A2})"></i></div>`);
    const url = bar.querySelector('.url'), caret = bar.querySelector('.caret'), lb = bar.querySelector('.lb');
    const vp = E.el('div', `position:absolute;left:1px;right:1px;top:${TB}px;bottom:1px;overflow:hidden;border-radius:0 0 15px 15px;background:#07080d`, frame);
    const mk = (w) => { const c = srcSite.cloneNode(true); c.style.cssText = `position:absolute;left:0;top:0;width:${w}px;transform-origin:0 0;zoom:${BW / w * .995}`   /* zoom, not scale: the text is laid out at its final size, so it stays crisp inside the 3D frame */; c.querySelectorAll('*').forEach((n) => { n.style.animation = 'none'; }); return c; };
    const PW = 860, site = mk(PW); vp.appendChild(site);
    const K = BW / PW * .995;                                                         // page px -> frame px
    const q = (s) => site.querySelector(s), qa = (s) => [...site.querySelectorAll(s)];
    const top = (el) => { let y = 0; while (el && el !== site) { y += el.offsetTop; el = el.offsetParent; } return y; };
    const nav = q('.nav'), badge = q('.badge'), h1s = qa('h1 span'), lede = q('.lede'), btns = q('.btns'), orb = q('.orb'), r1 = q('.ring.r1'), r2 = q('.ring.r2'), sats = qa('.sat'), cEq = q('.card.eq'), cBat = q('.card.bat');
    const feats = qa('.feat'), featsBox = q('.feats'), fH = q('#features h2'), lH = q('#live h2'), line = q('.dash .line'), fill = q('.dash path'), nums = qa('.num'), pbs = qa('.pb i'), order = q('.order .btn');
    const yFeat = top(q('#features')) - 20, yLive = Math.max(top(q('#live')) - 10, top(order) + order.offsetHeight + 40 - (BH - TB - 1) / K);   // keep Pre-order inside the window at any page width
    featsBox.style.perspective = '700px';
    const glare = E.el('div', 'position:absolute;inset:0;border-radius:16px;overflow:hidden;pointer-events:none', frame, `<i style="position:absolute;top:-40%;left:0;width:90px;height:180%;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.16),rgba(255,255,255,0));transform:rotate(18deg)"></i>`).firstChild;

    // ---------- exploded view: copies of the page, each clipped to one layer, stacked in depth ----------
    const exp = E.el('div', `position:absolute;left:1px;top:${TB}px;width:${BW - 2}px;height:${BH - TB - 1}px;transform-style:preserve-3d;opacity:0`, frame);
    const vpr = vp.getBoundingClientRect(), stageScale = vpr.width / (BW - 2);
    const rel = (el) => { const r = el.getBoundingClientRect(); return { x: (r.left - vpr.left) / stageScale, y: (r.top - vpr.top) / stageScale, w: r.width / stageScale, h: r.height / stageScale }; };
    const LAY = [['base', null, 0], ['HEADER · NAV', nav, 40], ['H1 · INTER DISPLAY 92', q('h1'), 120], ['TEXT · 17 / 1.55', lede, 80], ['BUTTONS · SPRING', btns, 150], ['3D · PRODUCT RENDER', q('.stage'), 200], ['CARD · GLASS', cEq, 260], ['CARD · LIVE DATA', cBat, 230]];
    const layers = LAY.map(([label, el, z], i) => {
      const plane = E.el('div', 'position:absolute;inset:0;transform-style:preserve-3d', exp);
      const copy = mk(PW); plane.appendChild(copy);
      if (!el) { copy.style.filter = 'brightness(.7)'; copy.style.clipPath = `inset(0 0 calc(100% - ${((BH - TB - 1) / K).toFixed(1)}px) 0 round 0 0 30px 30px)`; return { plane, z, i }; }
      const r = rel(el); copy.style.clipPath = `inset(${r.y / K}px ${(PW - (r.x + r.w) / K)}px calc(100% - ${(r.y + r.h) / K}px) ${r.x / K}px)`;
      E.el('div', `position:absolute;left:${r.x - 2}px;top:${r.y - 2}px;width:${r.w + 4}px;height:${r.h + 4}px;border:1px solid ${CY};box-shadow:0 0 10px ${CY}66;border-radius:4px`, plane);
      E.el('div', `position:absolute;left:${r.x}px;top:${r.y - 13}px;font:600 7.5px/1 'Geist Mono',ui-monospace,monospace;letter-spacing:.08em;color:${CY};white-space:nowrap`, plane, label);
      return { plane, z, i };
    });

    // ---------- phone with the mobile site ----------
    const phone = E.el('div', `position:absolute;left:262px;top:388px;width:116px;height:236px;border-radius:22px;background:#0b0c11;border:2px solid rgba(255,255,255,.2);box-shadow:0 30px 60px -20px rgba(0,0,0,.9),0 0 40px -10px rgba(255,140,60,.4);overflow:hidden;opacity:0;transform-style:preserve-3d`, rig);
    const pvp = E.el('div', 'position:absolute;inset:6px;border-radius:20px;overflow:hidden;background:#07080d', phone);
    const msite = srcSite.cloneNode(true); msite.style.cssText = 'position:absolute;left:0;top:0;width:360px;transform-origin:0 0;transform:scale(.2889)'; msite.querySelectorAll('*').forEach((n) => { n.style.animation = 'none'; }); pvp.appendChild(msite);

    // ---------- cursor, ripple, popup ----------
    const cur = E.el('div', 'position:absolute;left:0;top:0;width:18px;height:18px;opacity:0;z-index:5', frame, `<svg viewBox="0 0 24 24" width="18" height="18"><path d="M4 2l15 10-7 1.5L9 21z" fill="#fff" stroke="#111" stroke-width="1.2"/></svg>`);
    const ripple = E.el('div', `position:absolute;width:20px;height:20px;margin:-10px 0 0 -10px;border-radius:50%;border:2px solid ${A1};opacity:0`, frame);
    const popup = E.el('div', `position:absolute;right:12px;top:${TB + 12}px;padding:9px 12px;border-radius:12px;background:rgba(20,22,30,.92);border:1px solid rgba(255,179,92,.5);font:600 11px/1 Inter,sans-serif;color:#f6efe4;opacity:0;box-shadow:0 10px 30px -10px rgba(255,140,60,.6)`, frame, `<span style="color:${A1}">●</span>&nbsp; Reserved · Aurelia One`);

    // ---------- front: bokeh dust, light leaks, grade, vignette, grain, captions ----------
    const bok = Array.from({ length: 5 }, (_, i) => ({ el: E.el('div', `position:absolute;width:${30 + (i % 4) * 16}px;height:${30 + (i % 4) * 16}px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,210,160,${.18 + (i % 3) * .06}),rgba(255,210,160,0));filter:blur(${3 + (i % 3) * 2}px)`, P.front), x: (i * 97) % 402, y: (i * 173) % 715, s: .4 + (i % 5) * .15 }));
    const leak = E.el('div', `position:absolute;inset:-20%;background:radial-gradient(40% 35% at 20% 30%,rgba(255,170,90,.9),rgba(255,120,50,0) 70%),radial-gradient(35% 30% at 85% 70%,rgba(139,108,255,.6),rgba(139,108,255,0) 70%);mix-blend-mode:screen;opacity:0`, P.front);
    E.el('div', 'position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,170,90,.10),rgba(0,0,0,0) 45%,rgba(56,140,255,.10));mix-blend-mode:soft-light', P.front);
    E.el('div', 'position:absolute;inset:0;background:radial-gradient(80% 65% at 50% 48%,rgba(0,0,0,0),rgba(0,0,0,.6))', P.front);
    const gc = E.el('canvas', 'position:absolute;inset:0;width:402px;height:715px;opacity:.035;mix-blend-mode:overlay', P.front); gc.width = 201; gc.height = 358; const gx = gc.getContext('2d'), gimg = gx.createImageData(201, 358);
    const flash = E.el('div', 'position:absolute;inset:0;background:radial-gradient(60% 50% at 50% 45%,#fff3df,#ffb35c 60%,#ff6a2c);opacity:0', P.front);
    const CAP = [[3.6, 7.8, '01 — BUILD', 'Every pixel,', 'in motion.'], [8.1, 11.8, '02 — DECONSTRUCT', 'Every layer,', 'on purpose.'], [12.2, 16.3, '03 — EXPLORE', 'Features that', 'feel alive.'],
      [16.6, 19.9, '04 — INTERACT', 'Data you can', 'feel.'], [20.2, 22.4, '05 — EVERYWHERE', 'Desktop', 'to pocket.']];
    const caps = CAP.map(([a, b, k, l1, l2]) => ({ a, b, el: E.el('div', 'position:absolute;left:30px;right:30px;top:112px;text-align:center;opacity:0', P.front,
      `<div style="font:600 9.5px/1 Inter,sans-serif;letter-spacing:.3em;color:rgba(255,200,150,.75)">${k}</div><div style="margin-top:10px;font:600 27px/1.08 Inter,sans-serif;font-variation-settings:'opsz' 32;letter-spacing:-.03em;color:#f6efe4">${l1}<br><span style="background:linear-gradient(100deg,${A1},${A2});-webkit-background-clip:text;background-clip:text;color:transparent">${l2}</span></div><i style="display:block;width:44px;height:1px;margin:14px auto 0;background:linear-gradient(90deg,transparent,${A1},transparent)"></i>`) }));
    // the end: Aurelia mark and wordmark with a light sweep, then the Aquarii sign-off
    const end = E.el('div', 'position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding-bottom:90px;background:#06070b;opacity:0', P.front,
      `<svg width="84" height="84" viewBox="0 0 120 120" style="overflow:visible"><circle cx="60" cy="60" r="44" fill="none" stroke="${A1}" stroke-width="4" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" style="filter:drop-shadow(0 0 10px ${A1})"/></svg>
       <div class="ew" style="position:relative;margin-top:16px;font:700 38px/1 Inter,sans-serif;font-variation-settings:'opsz' 32;letter-spacing:.3em;margin-right:-.3em;color:#f6efe4;overflow:hidden">AURELIA<i style="position:absolute;top:0;bottom:0;width:60px;left:-80px;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,230,190,.85),rgba(255,255,255,0));mix-blend-mode:overlay"></i></div>
       <div class="et" style="margin-top:14px;font:400 14px/1.3 Inter,sans-serif;color:#c9b9a4">Sound, sculpted from silence.</div>
       <div class="ep" style="margin-top:16px;padding:8px 16px;border-radius:99px;border:1px solid rgba(255,179,92,.6);font:600 13px/1 Inter,sans-serif;color:${A1}">aurelia.audio →</div>`);
    const eRing = end.querySelector('circle'), eW = end.querySelector('.ew'), eSweep = eW.querySelector('i'), eT = end.querySelector('.et'), eP = end.querySelector('.ep');
    P.brandEnd({ at: 23.7, keyword: 'SITE', why: 'Want your website to move like this?', out: 24.85, grade: 'amber' });

    // cursor targets measured from the page itself (frame px, after the page has scrolled to its section)
    const at = (el, yScroll) => { const r = rel(el); return [r.x + r.w * .55, r.y - yScroll * K + TB + r.h * .5]; };
    const FC = feats.map((f) => at(f, yFeat)), CLICK = at(order, yLive);
    const CURP = [[13.6, FC[0][0] - 30, FC[0][1] + 40], [14.3, ...FC[0]], [14.9, ...FC[1]], [15.5, ...FC[2]], [16.1, ...FC[3]], [18.9, CLICK[0] + 60, CLICK[1] - 30], [19.3, ...CLICK]];
    const path = line.getTotalLength ? line : null, LEN = path ? path.getTotalLength() : 1;
    const tip = E.el('div', `position:absolute;width:8px;height:8px;margin:-4px 0 0 -4px;border-radius:50%;background:#fff;box-shadow:0 0 10px ${A1},0 0 22px ${A2};opacity:0`, vp);
    const lineBox = () => { const r = line.getBoundingClientRect(), v = vp.getBoundingClientRect(); return { x: r.left - v.left, y: r.top - v.top, sx: r.width / 400, sy: r.height / 150 }; };

    // ---------- the timeline ----------
    P.on((t) => {
      // handheld camera + studio life
      const sh = 1 + 1.4 * win(t, 3, 22.5, .6);
      world.style.transform = `translate(${(noise(t, 1) * 1.6 * sh).toFixed(2)}px,${(noise(t, 4) * 1.4 * sh).toFixed(2)}px) rotate(${(noise(t, 7) * .18).toFixed(3)}deg)`;
      glows.forEach((g, i) => { g.el.style.transform = `translate(${(Math.sin(t * .23 + i * 2) * 40).toFixed(1)}px,${(Math.cos(t * .19 + i) * 30).toFixed(1)}px) scale(${(1 + .12 * Math.sin(t * .3 + i)).toFixed(3)})`; });
      beams.forEach((b, i) => { b.el.style.transform = `rotate(${(b.r + Math.sin(t * .25 + i * 1.7) * 4).toFixed(2)}deg)`; b.el.style.opacity = (b.o * (.75 + .25 * Math.sin(t * .6 + i))).toFixed(3); });
      bok.forEach((b, i) => { b.el.style.transform = `translate(${((b.x + t * 9 * b.s) % 460 - 30).toFixed(1)}px,${((b.y - t * 14 * b.s + 800) % 780 - 40).toFixed(1)}px)`; });

      const hover = (i) => { const H = [[14.0, 14.6], [14.6, 15.2], [15.2, 15.8], [15.8, 16.4]][i]; return win(t, H[0], H[1], .2); };
      // 0-3 logo: ring draws, letters sharpen and close up, tagline, fly through
      const fly = io(seg(t, 2.35, 3.25));
      ring.setAttribute('stroke-dashoffset', (1 - expo(seg(t, .1, 1.5))).toFixed(4)); core.setAttribute('opacity', (.7 * expo(seg(t, .9, 1.8))).toFixed(3));
      letters.forEach((s, i) => { const k = expo(seg(t, .45 + i * .11, 1.25 + i * .11)); s.style.filter = `blur(${((1 - k) * 9).toFixed(2)}px)`; s.style.opacity = k.toFixed(3); });
      lw.style.letterSpacing = `${(.62 - .38 * expo(seg(t, .4, 2))).toFixed(3)}em`; lw.style.marginRight = `-${(.62 - .38 * expo(seg(t, .4, 2))).toFixed(3)}em`;
      tag.style.opacity = (expo(seg(t, 1.5, 2.3))).toFixed(3);
      logo.style.transform = `translateZ(${(fly * 760).toFixed(1)}px)`; logo.style.opacity = (1 - seg(t, 2.85, 3.2)).toFixed(3); logo.style.display = t > 3.25 ? 'none' : '';

      // 3-4.8 browser flies in, tilted, out of focus -> sharp
      const fi = expo(seg(t, 2.9, 4.8));
      let ry = lerp(34, 0, fi), rx = lerp(16, 0, fi), tz = lerp(-1500, 0, fi), ty = 0, sc = 1;   // lands square, so the 2D camera below takes over seamlessly
      // the camera keeps easing while the page builds, then the 8-12 orbit, then the 20-22.5 pull-back
      ry += lerp(0, 6, io(seg(t, 4.8, 8)));
      const orb3 = io(seg(t, 8.2, 10.2)) * (1 - io(seg(t, 10.6, 11.8)));
      ry += -32 * orb3; rx += 6 * orb3; tz += -170 * orb3;
      // 13.6-17.2 push-in on the features, 17.4-20 dolly to the dashboard (no framing holds over 3 s)
      const p1 = io(seg(t, 13.6, 15.8)) * (1 - io(seg(t, 16.3, 17.2))); ry += 2 * p1; rx += -2 * p1; tz += 140 * p1;
      const p2 = io(seg(t, 17.4, 19.4)) * (1 - io(seg(t, 20, 21.6))); ry += 7 * p2; tz += 120 * p2; ty += 10 * p2;
      const pb = io(seg(t, 20, 21.6)); tz += -260 * pb; ry += 10 * pb; ty += -60 * pb; sc = 1;
      // a 3D tilt makes Chrome raster the page's type at low resolution, so true 3D only for the fly-in and the exploded view;
      // the page shots use an equivalent 2D camera (perspective scale about the vanishing point, skew for the turn): crisp type
      const cam3d = t < 4.9 || (t > 8.05 && t < 11.75);
      if (cam3d) frame.style.transform = `translate3d(0,${ty.toFixed(1)}px,${tz.toFixed(1)}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${sc})`;
      else { const s2 = 880 / (880 - tz), dy = (BY + BH / 2 - 715 * .44) * (s2 - 1) + ty * s2;
        frame.style.transform = `translate(0,${dy.toFixed(1)}px) scale(${(s2 * sc).toFixed(4)},${(s2 * sc * Math.cos(rx * Math.PI / 180)).toFixed(4)}) skewY(${(ry * .15).toFixed(2)}deg)`; }
      frame.style.opacity = (seg(t, 2.95, 3.4) * (1 - seg(t, 22.45, 22.6))).toFixed(3);
      frame.style.filter = t < 4.9 ? `blur(${((1 - fi) * 7).toFixed(2)}px)` : 'none';
      pool.style.opacity = (seg(t, 3.6, 4.8) * .9 * (1 - seg(t, 22.4, 22.6))).toFixed(3);
      glare.style.transform = `translateX(${(-100 + (ry + 40) * 6 + t * 4).toFixed(1)}px) rotate(18deg)`;

      // address bar types, load bar runs
      const typed = 'aurelia.audio'.slice(0, Math.floor(clamp((t - 4.2) / .9) * 13)); url.textContent = typed; caret.style.opacity = t < 5.3 && Math.floor(t * 3) % 2 ? '1' : '0';
      lb.style.width = `${(io(seg(t, 5.1, 5.8)) * 100).toFixed(1)}%`; lb.style.opacity = (1 - seg(t, 5.8, 6.1)).toFixed(3);
      // the page builds (5.4-8)
      const pop = (el, a, dy = 14) => { const k = P.springAt(t, a, 'bold'); el.style.opacity = clamp(k * 1.6).toFixed(3); el.style.transform = `translateY(${((1 - k) * dy).toFixed(1)}px)`; };
      site.style.opacity = seg(t, 5.3, 5.6).toFixed(3);
      { const k = expo(seg(t, 5.4, 6.1)); nav.style.transform = `translateY(${((k - 1) * 60).toFixed(1)}px)`; }
      pop(badge, 5.7); h1s.forEach((s, i) => pop(s, 5.9 + i * .22, 26)); pop(lede, 6.6); pop(btns, 6.85, 20);
      { const k = P.springAt(t, 6.6, 'bold'); orb.style.transform = `scale(${(.2 + .8 * k).toFixed(3)})`; orb.style.opacity = clamp(k * 2).toFixed(3);
        r1.style.transform = `rotate(${(-14 + t * 22).toFixed(1)}deg) scale(${k.toFixed(3)})`; r2.style.transform = `rotateX(70deg) rotate(${(24 - t * 30).toFixed(1)}deg) scale(${k.toFixed(3)})`;
        sats.forEach((s, i) => { const a = t * (i ? -.9 : 1.2) + i * 2; s.style.transform = `translate(${(Math.cos(a) * 18).toFixed(1)}px,${(Math.sin(a) * 10).toFixed(1)}px)`; s.style.opacity = k.toFixed(3); }); }
      pop(cEq, 7.1, 24); pop(cBat, 7.3, 24);

      // 8-12 exploded view
      const ex = io(seg(t, 8.1, 9.3)) * (1 - io(seg(t, 10.9, 11.7)));
      const exOn = t > 8.05 && t < 11.75; exp.style.opacity = exOn ? '1' : '0'; vp.style.opacity = exOn ? '0' : '1';
      layers.forEach((l) => { l.plane.style.transform = `translateZ(${(l.z * ex).toFixed(1)}px)`; l.plane.style.opacity = l.i ? (exOn ? 1 : 0) : (1 - .4 * ex).toFixed(3); });
      layers.slice(1).forEach((l) => { [...l.plane.children].slice(1).forEach((c) => { c.style.opacity = clamp(ex * 1.4).toFixed(3); }); });

      // 12-16.5 features: scroll, heading, cards flip, live visuals, cursor
      const scroll1 = io(seg(t, 12, 13)) * yFeat, scroll2 = io(seg(t, 16.3, 17.2)) * (yLive - yFeat);
      site.style.transform = `translateY(${(-(scroll1 + scroll2)).toFixed(1)}px)`;   // page px (the clone is zoomed by K)
      pop(fH, 12.6, 22);
      feats.forEach((f, i) => { const k = P.springAt(t, 13 + i * .32, 'bold'); f.style.transform = `rotateX(${((1 - k) * 85).toFixed(1)}deg) translateY(${(-hover(i) * 8).toFixed(1)}px)`; f.style.transformOrigin = '50% 100%'; f.style.opacity = clamp(k * 1.8).toFixed(3);
        f.style.boxShadow = hover(i) > .05 ? `0 0 ${(24 * hover(i)).toFixed(0)}px rgba(255,179,92,${(.45 * hover(i)).toFixed(2)}),inset 0 1px 0 rgba(255,255,255,.12)` : '';
        const ic = f.querySelector('svg path,svg circle,svg rect'); if (ic) { ic.setAttribute('pathLength', '1'); ic.style.strokeDasharray = '1'; ic.style.strokeDashoffset = (1 - expo(seg(t, 13.2 + i * .32, 14 + i * .32))).toFixed(3); }
        const v = f.querySelector('.viz'); if (v) { const vv = v.firstElementChild;
          if (i === 0) v.querySelector('path').style.transform = `translateX(${(-(t * 30) % 40).toFixed(1)}px)`;
          if (i === 1) [...v.querySelectorAll('circle')].forEach((c, j) => { c.style.transformOrigin = '80px 20px'; c.style.transform = `scale(${(1 + .25 * Math.sin(t * 4 - j)).toFixed(3)})`; });
          if (i === 2) { const x = 60 + 50 * (.5 + .5 * Math.sin(t * 1.6)); v.querySelectorAll('rect')[1].setAttribute('width', x.toFixed(1)); v.querySelector('circle').setAttribute('cx', x.toFixed(1)); }
          if (i === 3) [...v.querySelectorAll('rect')].forEach((r, j) => { r.style.transformOrigin = `${18 + j * 30}px 40px`; r.style.transform = `scaleY(${(.55 + .45 * Math.abs(Math.sin(t * 3 + j))).toFixed(3)})`; }); } });

      // 16.5-20 dashboard: chart draws with a glowing tip, stats count, bars fill, click
      pop(lH, 17, 22);
      const ck = io(seg(t, 17.2, 18.8)); line.style.strokeDasharray = `${LEN}`; line.style.strokeDashoffset = `${(LEN * (1 - ck)).toFixed(1)}`; fill.style.opacity = (ck * .9).toFixed(3);
      if (path && t > 17.1 && t < 19.4) { const pt = line.getPointAtLength(LEN * ck), b = lineBox(); tip.style.opacity = '1'; tip.style.left = `${(b.x + pt.x * b.sx).toFixed(1)}px`; tip.style.top = `${(b.y + pt.y * b.sy).toFixed(1)}px`; } else tip.style.opacity = '0';
      const cnt = io(seg(t, 17.4, 19)); nums[0].textContent = `${Math.round(32 * cnt)} h`; nums[1].textContent = `${(1.2 * cnt).toFixed(1)}M`; nums[2].textContent = `${(99.9 * cnt).toFixed(1)}%`;
      pbs.forEach((b) => { b.style.transform = `scaleX(${cnt.toFixed(3)})`; b.style.transformOrigin = '0 50%'; });

      // cursor path: hovers the feature cards, then clicks Pre-order
      const CUR = CURP;
      const cOn = win(t, 13.5, 19.9, .3); cur.style.opacity = cOn.toFixed(3);
      if (cOn > 0) { let i = 0; while (i < CUR.length - 2 && t > CUR[i + 1][0]) i++; const a = CUR[i], b = CUR[i + 1], k = io(seg(t, a[0], b[0])); cur.style.transform = `translate(${lerp(a[1], b[1], k).toFixed(1)}px,${lerp(a[2], b[2], k).toFixed(1)}px) scale(${t > 19.3 && t < 19.45 ? .85 : 1})`; }
      const press = win(t, 19.3, 19.5, .08); order.style.transform = `scale(${(1 - .06 * press).toFixed(3)})`;
      const rp = seg(t, 19.35, 19.95); ripple.style.left = `${CLICK[0]}px`; ripple.style.top = `${CLICK[1]}px`; ripple.style.opacity = (rp > 0 && rp < 1 ? 1 - rp : 0).toFixed(3); ripple.style.transform = `scale(${(1 + rp * 5).toFixed(2)})`;
      { const k = P.springAt(t, 19.55, 'bold'); popup.style.opacity = (clamp(k * 1.6) * (1 - seg(t, 21.6, 22))).toFixed(3); popup.style.transform = `translateX(${((1 - k) * 40).toFixed(1)}px)`; }

      // 20-22.5 the phone swings in
      { const k = expo(seg(t, 20.1, 21.6)); phone.style.opacity = (seg(t, 20.1, 20.4) * (1 - seg(t, 22.45, 22.6))).toFixed(3);
        phone.style.transform = `translate3d(${((1 - k) * 220).toFixed(1)}px,${((1 - k) * 40).toFixed(1)}px,${(60 + (1 - k) * 120).toFixed(1)}px) rotateY(${lerp(-70, -14, k).toFixed(2)}deg) rotateZ(${lerp(8, 2, k).toFixed(2)}deg)`; }

      // light leaks between scenes, the warm flash
      leak.style.opacity = Math.max(...[3.05, 8.0, 12.05, 16.4, 20.05].map((a) => Math.max(0, 1 - Math.abs(t - a) / .35) * .55)).toFixed(3);
      flash.style.opacity = (Math.max(0, 1 - Math.abs(t - 22.55) / .22)).toFixed(3);
      // end card
      end.style.opacity = (seg(t, 22.5, 22.6)).toFixed(3);
      eRing.setAttribute('stroke-dashoffset', (1 - expo(seg(t, 22.6, 23.3))).toFixed(4));
      { const k = expo(seg(t, 22.7, 23.3)); eW.style.filter = `blur(${((1 - k) * 8).toFixed(2)}px)`; eW.style.opacity = k.toFixed(3); }
      eSweep.style.left = `${(-80 + 420 * io(seg(t, 23.0, 23.7))).toFixed(1)}px`;
      eT.style.opacity = expo(seg(t, 23.1, 23.5)).toFixed(3); eP.style.opacity = expo(seg(t, 23.25, 23.6)).toFixed(3);

      // captions
      caps.forEach(({ a, b, el }) => { const k = expo(seg(t, a, a + .6)); el.style.opacity = (k * (1 - seg(t, b - .3, b))).toFixed(3); el.style.transform = `translateY(${((1 - k) * 12).toFixed(1)}px)`; });

      // grain: fresh noise every frame
      const d = gimg.data; let s = (Math.floor(t * 30) * 2654435761) >>> 0; for (let i = 0; i < d.length; i += 4) { s = (s * 1664525 + 1013904223) >>> 0; const v = s >>> 24; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; } gx.putImageData(gimg, 0, 0);
    });
    S.name = 'Aurelia cinematic product film v1';
    return { ok: true };
  };
  S.update = function (E, t) { P.update(t); };
  S.cues = () => [];
})();
