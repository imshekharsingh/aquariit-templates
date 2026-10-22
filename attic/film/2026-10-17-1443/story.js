// FILM, theme `cinema` (second cinema film, a new look): a 20 s product film for Aquarii's EDGE service (CDN + DNS + firewall + bot shield as one setup),
// told with our own Nimbra website (a fictional foldable camera drone sold worldwide).
// BRIEF (creative director)
//   Brand: Nimbra Air One. Look: cold brushed silver and electric blue light in a graphite studio, one emerald status LED as the only warm-ish note.
//   Palette: ink #04060b, graphite #0a0f1c, silver #c9d3e0 / #f4f7fb, electric blue #2f6bff, ice #5cd0ff, LED emerald #19f5a0; coral #ff6b5c only for the problem.
//   Type: Chakra Petch (squared tech display) for captions and HUD, Onest in the site.
//   Hero object: the drone itself, top-down and tilted, rotors spinning as motion-blur discs (not Aurelia's orb).
//   Atmosphere: three cold beams from above, blue/ice glows that drift, an ice grid floor with a blue pool, dust, bokeh, chroma scan on the cut, grain, vignette,
//   cold grade, handheld camera. Every framing moves (a push, orbit or cut at least every 3 s).
// SHOTS (easing: expo-out arrivals, cubic in-out camera, 'bold' springs for UI)
//   0-2.9   the drone rises into a dark studio as a glowing wireframe; a blue scan line turns it solid; hook "Why is your site slow abroad?"
//   2.9-5.6 chroma scan wipe -> a glass browser: nimbra.store stuck on skeletons; a packet crawls Tokyo -> distant origin, timer ticks (coral)
//   5.55-5.85 breath (the world dims)
//   5.9-9.0 BIG MOMENT: the camera pulls back, a silver wireframe globe rises under the browser, edge nodes light one by one and fire arcs into it; the page snaps in
//   9.0-12  push-in: the live site, rotors spinning, scroll to the spec dials as they draw
//   12-15   a shield ring locks round the browser, coral bot sparks burst on it; WAF / BOTS / DDOS chips tick; the site scrolls to its hub globe
//   15-17.4 a phone swings in, the drone sweeps across the frame over both
//   17.4-20 blue flash, Aquarii end card graded electric (silver to blue)
(function () {
  const E = window.FilmEngine, P = window.FilmParts, { clamp, lerp } = E, S = (E.story = {});
  S.selfStage = true;
  S.dna = {
    service: 'edge', theme: 'cinema', format: 'problem -> fix',
    opening: 'a silver camera drone rises into a dark studio as a glowing blue wireframe, rotors spinning, and a scan line turns it solid under the hook "Why is your site slow abroad?"',
    bigMoment: 'the camera pulls back from a stuck browser, a silver wireframe globe rises beneath it and edge nodes light one by one, firing blue arcs into the page until it snaps in',
    ground: 'graphite studio with cold silver beams, electric blue and ice glows, an ice grid floor with a blue pool, dust and bokeh, cold grade',
    music: 'cold cinematic electronic with a ticking pulse, a held breath, a bright synth swell on the globe and a clean resolve, about 110 BPM',
  };
  const BL = '#2f6bff', ICE = '#5cd0ff', SIL = '#c9d3e0', LED = '#19f5a0', COR = '#ff6b5c', INK = '#04060b', DISP = "'Chakra Petch',Archivo,sans-serif";
  const expo = (k) => (k >= 1 ? 1 : 1 - Math.pow(2, -10 * Math.max(0, k)));
  const io = (k) => P.EASE.swing(clamp(k));
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const win = (t, a, b, f = .35) => clamp((t - a) / f) * (1 - clamp((t - b) / f));
  const noise = (t, s) => Math.sin(t * 1.7 + s) * .5 + Math.sin(t * 2.9 + s * 2.1) * .3 + Math.sin(t * 4.3 + s * 3.7) * .2;
  let uid = 0;
  // clones of the page share SVG ids with the hidden original; give each clone its own ids so gradients still resolve
  const uniq = (root) => { const suf = '_c' + (++uid), map = {}; root.querySelectorAll('[id]').forEach((n) => { map[n.id] = n.id + suf; n.id += suf; });
    root.querySelectorAll('*').forEach((n) => ['fill', 'stroke'].forEach((a) => { const v = n.getAttribute(a); if (v && v.startsWith('url(#')) { const k = v.slice(5, -1); if (map[k]) n.setAttribute(a, `url(#${map[k]})`); } }));
    root.querySelectorAll('.ar').forEach((n) => { n.style.stroke = ICE; }); root.querySelectorAll('*').forEach((n) => { n.style.animation = 'none'; }); return root; };

  S.setup = async function () {
    document.documentElement.classList.add('reel');
    await P.ready; await document.fonts.ready; await document.fonts.load(`700 30px 'Chakra Petch'`);
    await new Promise((r) => setTimeout(r, 1000));
    const srcSite = document.querySelector('.site'), srcDrone = srcSite.querySelector('.drone');
    const { world } = P.scene({ accent: BL, ink: INK, glow: 'rgba(47,107,255,.10)', len: 20 });
    P.breath = [5.55, 5.85];
    P.use('opener', 'drone-wire-scan-rise'); P.use('transition', 'chroma-scan-wipe'); P.use('mechanism', 'request-crawl-to-edge');
    P.use('type', 'chakra-hud-captions'); P.use('focus', 'dof-glass-glare');

    // ---------- studio ----------
    E.el('div', 'position:absolute;left:-220px;top:-280px;width:842px;height:760px;border-radius:50%;background:radial-gradient(closest-side,rgba(120,170,255,.42),rgba(47,107,255,.16) 45%,rgba(47,107,255,0));pointer-events:none', world);
    const glows = [[BL, -140, 120, 440, .5], [ICE, 170, 380, 360, .3], [LED, 40, 600, 220, .1]].map(([c, x, y, d, o]) => ({ el: E.el('div', `position:absolute;left:${x}px;top:${y}px;width:${d}px;height:${d}px;border-radius:50%;background:radial-gradient(closest-side,${c}77,${c}00);opacity:${o}`, world) }));
    const beams = [[-10, -14, .45], [130, -3, .7], [262, 11, .45]].map(([x, r, o]) => ({ el: E.el('div', `position:absolute;left:${x}px;top:-120px;width:190px;height:820px;transform-origin:50% 0;background:linear-gradient(rgba(215,230,255,.5),rgba(120,170,255,.14) 55%,rgba(90,140,255,0));filter:blur(14px);opacity:${o};mix-blend-mode:screen`, world), r, o }));
    // the edge globe (new part) sits in the world, under the browser
    let camTy = 0;
    const globe = P.edgeGlobe(world, { x: 201, y: 900, d: 470, at: 6.15, spin: .2, color: SIL, hot: ICE, target: [201, 330],
      drive: (t) => { const k = P.springAt(t, 5.9, 'default'), s2 = io(seg(t, 9.2, 10.2)); return { y: lerp(900, 600, k) + 420 * s2, d: 470 + 40 * seg(t, 6, 9), op: t < 5.9 ? 0 : clamp(k * 1.4) * (1 - s2), ty: 330 + camTy * .5 }; } });
    const view = E.el('div', 'position:absolute;inset:0;perspective:880px;perspective-origin:50% 44%', world);
    const rig = E.el('div', 'position:absolute;inset:0;transform-style:preserve-3d', view);
    const floor = E.el('div', `position:absolute;left:-300px;top:520px;width:1002px;height:700px;transform-origin:50% 0;transform:rotateX(78deg);
      background-image:linear-gradient(rgba(92,208,255,.18) 1px,transparent 1px),linear-gradient(90deg,rgba(92,208,255,.18) 1px,transparent 1px);background-size:44px 44px;
      -webkit-mask:radial-gradient(50% 45% at 50% 0,#000,transparent);mask:radial-gradient(50% 45% at 50% 0,#000,transparent);opacity:.6`, rig);
    const pool = E.el('div', 'position:absolute;left:11px;top:488px;width:380px;height:90px;border-radius:50%;background:radial-gradient(closest-side,rgba(47,107,255,.6),rgba(47,107,255,0));filter:blur(6px)', rig);

    // ---------- the hero drone: a wireframe copy under a solid copy revealed by the scan ----------
    const droneBox = E.el('div', 'position:absolute;left:21px;top:200px;width:360px;height:360px;transform-style:preserve-3d', rig);
    const mkDrone = () => { const d = uniq(srcDrone.cloneNode(true)); d.style.cssText = 'position:absolute;left:0;top:0;width:226px;height:226px;margin:0;transform-origin:0 0;transform:scale(1.593)'; return d; };
    const wire = mkDrone(); wire.style.filter = `brightness(0) invert(1) sepia(1) saturate(6) hue-rotate(170deg) drop-shadow(0 0 6px ${ICE})`; wire.style.opacity = '.55'; droneBox.appendChild(wire);
    const solid = mkDrone(); droneBox.appendChild(solid);
    const scanL = E.el('div', `position:absolute;left:-30px;right:-30px;height:3px;background:linear-gradient(90deg,transparent,${ICE},#fff,${ICE},transparent);box-shadow:0 0 18px ${ICE},0 0 40px ${BL}`, droneBox);
    const props = [...wire.querySelectorAll('.prop'), ...solid.querySelectorAll('.prop')];
    const ledW = [...solid.querySelectorAll('.led')];
    const dTag = E.el('div', `position:absolute;left:0;right:0;top:568px;text-align:center;font:600 11px/1 ${DISP};letter-spacing:.32em;color:${SIL};opacity:0`, P.front, `<span style="color:${LED}">●</span>&nbsp; NIMBRA AIR ONE · 249 G`);

    // ---------- the glass browser with the live site inside ----------
    const BX = 14, BY = 250, BW = 374, BH = 258, TB = 22;
    const frame = E.el('div', `position:absolute;left:${BX}px;top:${BY}px;width:${BW}px;height:${BH}px;border-radius:14px;transform-style:preserve-3d;opacity:0;
      background:linear-gradient(160deg,rgba(220,232,255,.16),rgba(220,232,255,.04));border:1px solid rgba(220,232,255,.26);box-shadow:0 40px 80px -30px rgba(0,0,0,.9),0 0 60px -18px rgba(47,107,255,.55)`, rig);
    const bar = E.el('div', `position:absolute;left:0;right:0;top:0;height:${TB}px;display:flex;align-items:center;gap:6px;padding:0 10px;border-bottom:1px solid rgba(255,255,255,.12);border-radius:14px 14px 0 0;background:rgba(8,11,18,.8)`, frame,
      `<i style="width:7px;height:7px;border-radius:50%;background:#ff5f57"></i><i style="width:7px;height:7px;border-radius:50%;background:#febc2e"></i><i style="width:7px;height:7px;border-radius:50%;background:#28c840"></i>
       <div style="margin-left:10px;flex:1;height:14px;border-radius:5px;background:rgba(255,255,255,.07);display:flex;align-items:center;padding:0 8px;font:500 9.5px/1 Onest,sans-serif;color:#d9dfe8;position:relative;overflow:hidden"><span class="url"></span><i class="caret" style="width:1px;height:10px;background:#fff;margin-left:1px"></i><i class="lb" style="position:absolute;left:0;bottom:0;height:2px;width:0;background:${COR}"></i></div>`);
    const url = bar.querySelector('.url'), caret = bar.querySelector('.caret'), lb = bar.querySelector('.lb');
    const vp = E.el('div', `position:absolute;left:1px;right:1px;top:${TB}px;bottom:1px;overflow:hidden;border-radius:0 0 13px 13px;background:#05070c`, frame);
    const PW = 1280, K = BW / PW * .995;
    const site = uniq(srcSite.cloneNode(true)); site.style.cssText = `position:absolute;left:0;top:0;width:${PW}px;transform-origin:0 0;transform:scale(${K})`; vp.appendChild(site);
    const q = (s) => site.querySelector(s), qa = (s) => [...site.querySelectorAll(s)];
    const top = (el) => { let y = 0; while (el && el !== site) { y += el.offsetTop; el = el.offsetParent; } return y; };
    const yS = top(q('[id^=specs]')) - 30, yH = top(q('[id^=hubs]')) - 20;
    const sProps = qa('.prop'), sDrone = q('.drone'), arcs = qa('.dial .ar'), nums = qa('.dial .num'), spin = q('.spin'), rows = qa('.row'), h1 = q('h1'), lede = q('.lede'), btns = q('.btns'), calls = qa('.call');
    const ARC = arcs.map((a) => +a.getAttribute('stroke-dashoffset')), NUM = ['4K', '38′', '12 km'];
    // the stuck state: skeleton blocks and a spinner over the empty page
    const skel = E.el('div', 'position:absolute;inset:0;padding:18px 20px', vp,
      `<i style="display:block;height:12px;width:30%;border-radius:4px"></i><i style="display:block;height:26px;width:72%;margin:22px auto 0;border-radius:6px"></i><i style="display:block;height:26px;width:54%;margin:10px auto 0;border-radius:6px"></i>
       <i style="display:block;height:84px;width:84px;margin:22px auto 0;border-radius:50%"></i><i style="display:block;height:10px;width:46%;margin:18px auto 0;border-radius:4px"></i>`);
    [...skel.children].forEach((b) => { b.style.background = 'linear-gradient(90deg,rgba(201,211,224,.08),rgba(201,211,224,.18),rgba(201,211,224,.08))'; b.style.backgroundSize = '200% 100%'; });
    const spinner = E.el('div', `position:absolute;left:50%;top:50%;width:34px;height:34px;margin:-17px;border-radius:50%;border:3px solid rgba(255,107,92,.18);border-top-color:${COR}`, vp);
    const glare = E.el('div', 'position:absolute;inset:0;border-radius:14px;overflow:hidden;pointer-events:none', frame, `<i style="position:absolute;top:-40%;left:0;width:90px;height:180%;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.16),rgba(255,255,255,0));transform:rotate(18deg)"></i>`).firstChild;
    // shield ring + bot sparks (12-15)
    const shield = E.el('div', `position:absolute;left:-24px;top:-22px;width:${BW + 48}px;height:${BH + 44}px;border-radius:26px;border:2px solid ${ICE};box-shadow:0 0 24px ${ICE},inset 0 0 30px rgba(92,208,255,.25);opacity:0;transform:translateZ(30px)`, frame);
    const sparks = Array.from({ length: 9 }, (_, i) => ({ el: E.el('div', `position:absolute;left:0;top:0;width:10px;height:10px;margin:-5px;border-radius:50%;background:${COR};box-shadow:0 0 12px ${COR},0 0 24px ${COR};opacity:0`, rig), a: 12.3 + i * .27, ang: i * 2.4 + .5 }));
    const burst = sparks.map(() => E.el('div', `position:absolute;left:0;top:0;width:30px;height:30px;margin:-15px;border-radius:50%;border:2px solid ${ICE};opacity:0`, rig));

    // ---------- HUD under the browser: the request route (problem), then the edge status ----------
    const route = E.el('div', `position:absolute;left:30px;right:30px;top:540px;opacity:0;font:600 10.5px/1 ${DISP};letter-spacing:.2em;color:${SIL}`, P.front,
      `<div style="display:flex;justify-content:space-between"><span>TOKYO · VISITOR</span><span class="rt" style="color:${COR}">ORIGIN · 10,800 KM</span></div>
       <div style="position:relative;margin-top:12px;height:2px;background:repeating-linear-gradient(90deg,rgba(201,211,224,.35) 0 6px,transparent 6px 12px)"><i class="pk" style="position:absolute;top:-4px;left:0;width:10px;height:10px;border-radius:50%;background:${COR};box-shadow:0 0 12px ${COR}"></i></div>
       <div class="tm" style="margin-top:14px;text-align:center;font-size:22px;letter-spacing:.06em;color:#fff">LOADING …</div>`);
    const pk = route.querySelector('.pk'), tm = route.querySelector('.tm');
    const edge = E.el('div', `position:absolute;left:30px;right:30px;top:546px;text-align:center;opacity:0;font:600 12px/1 ${DISP};letter-spacing:.24em;color:${LED}`, P.front, '● SERVED FROM THE TOKYO EDGE');
    const chips = ['WAF', 'BOTS', 'DDOS'].map((w, i) => E.el('div', `position:absolute;top:548px;left:${44 + i * 110}px;width:94px;padding:9px 0;text-align:center;border-radius:8px;border:1px solid rgba(92,208,255,.5);background:rgba(10,20,40,.7);font:700 12px/1 ${DISP};letter-spacing:.16em;color:#fff;opacity:0`, P.front, `<span style="color:${LED}">✓</span> ${w}`));

    // ---------- phone with the mobile site ----------
    const phone = E.el('div', `position:absolute;left:262px;top:380px;width:118px;height:240px;border-radius:22px;background:#0b0d12;border:2px solid rgba(220,232,255,.28);box-shadow:0 30px 60px -20px rgba(0,0,0,.9),0 0 40px -10px rgba(47,107,255,.6);overflow:hidden;opacity:0;transform-style:preserve-3d`, rig);
    const pvp = E.el('div', 'position:absolute;inset:6px;border-radius:18px;overflow:hidden;background:#05070c', phone);
    const msite = uniq(srcSite.cloneNode(true)); msite.style.cssText = 'position:absolute;left:0;top:0;width:360px;transform-origin:0 0;transform:scale(.2944)'; pvp.appendChild(msite);
    const mProps = [...msite.querySelectorAll('.prop')];
    // the fly-by drone (15.6-17.3)
    const fly = mkDrone(); fly.style.opacity = '0'; P.front.appendChild(fly); const fProps = [...fly.querySelectorAll('.prop')];

    // ---------- front: chroma scan wipe, bokeh, grade, vignette, grain, flash, captions ----------
    const bok = Array.from({ length: 5 }, (_, i) => ({ el: E.el('div', `position:absolute;width:${30 + (i % 4) * 16}px;height:${30 + (i % 4) * 16}px;border-radius:50%;background:radial-gradient(closest-side,rgba(170,205,255,${.16 + (i % 3) * .06}),rgba(170,205,255,0));filter:blur(${3 + (i % 3) * 2}px)`, P.front), x: (i * 97) % 402, y: (i * 173) % 715, s: .4 + (i % 5) * .15 }));
    const wipe = E.el('div', 'position:absolute;left:0;right:0;top:0;height:120px;opacity:0', P.front,
      ['rgba(255,60,90,.75)', 'rgba(60,255,170,.6)', 'rgba(60,120,255,.9)'].map((c, i) => `<i style="position:absolute;left:0;right:0;top:${i * 10}px;height:100px;background:linear-gradient(180deg,rgba(0,0,0,0),${c} 45%,#fff 50%,${c} 55%,rgba(0,0,0,0));mix-blend-mode:screen"></i>`).join(''));
    const veil = E.el('div', `position:absolute;inset:0;background:${INK};opacity:0`, P.front);
    E.el('div', 'position:absolute;inset:0;background:linear-gradient(135deg,rgba(150,200,255,.10),rgba(0,0,0,0) 45%,rgba(47,107,255,.12));mix-blend-mode:soft-light', P.front);
    E.el('div', 'position:absolute;inset:0;background:radial-gradient(80% 65% at 50% 48%,rgba(0,0,0,0),rgba(0,0,0,.62))', P.front);
    const gc = E.el('canvas', 'position:absolute;inset:0;width:402px;height:715px;opacity:.07;mix-blend-mode:overlay', P.front); gc.width = 201; gc.height = 358; const gx = gc.getContext('2d'), gimg = gx.createImageData(201, 358);
    const flash = E.el('div', `position:absolute;inset:0;background:radial-gradient(60% 50% at 50% 45%,#ffffff,#9fd8ff 55%,${BL});opacity:0`, P.front);
    const hook = E.el('div', `position:absolute;left:30px;right:30px;top:112px;text-align:center;font:700 34px/1.04 ${DISP};letter-spacing:-.01em;color:#f4f7fb;text-transform:uppercase`, P.front,
      `Why is your site<br><span style="background:linear-gradient(100deg,#fff,${ICE} 40%,${BL});-webkit-background-clip:text;background-clip:text;color:transparent">slow abroad?</span>`);
    const CAP = [[3.1, 5.55, '01 — THE WAIT', 'Far from the server,', 'pages crawl.', COR], [6.0, 8.95, '02 — THE EDGE', 'Served from the', 'nearest city.', ICE], [9.2, 11.95, '03 — THE STORE', 'Loads like it', 'lives next door.', ICE],
      [12.2, 14.95, '04 — THE SHIELD', 'Firewall and bots,', 'stopped at the edge.', LED], [15.2, 17.3, '05 — EVERYWHERE', 'Fast and safe in', 'every country.', ICE]];
    const caps = CAP.map(([a, b, k, l1, l2, c]) => ({ a, b, el: E.el('div', 'position:absolute;left:30px;right:30px;top:108px;text-align:center;opacity:0', P.front,
      `<div style="font:600 10.5px/1 ${DISP};letter-spacing:.32em;color:${c}">${k}</div><div style="margin-top:10px;font:700 27px/1.08 ${DISP};letter-spacing:-.01em;color:#f4f7fb">${l1}<br><span style="color:${c}">${l2}</span></div><i style="display:block;width:44px;height:1px;margin:13px auto 0;background:linear-gradient(90deg,transparent,${c},transparent)"></i>`) }));
    P.brandEnd({ at: 17.45, keyword: 'EDGE', why: 'Want your site fast and protected everywhere?', grade: 'electric' });

    // ---------- the timeline ----------
    P.on((t) => {
      const sh = 1 + 1.3 * win(t, 2.9, 17.3, .6);
      world.style.transform = `translate(${(noise(t, 1) * 1.6 * sh).toFixed(2)}px,${(noise(t, 4) * 1.4 * sh).toFixed(2)}px) rotate(${(noise(t, 7) * .18).toFixed(3)}deg)`;
      glows.forEach((g, i) => { g.el.style.transform = `translate(${(Math.sin(t * .26 + i * 2) * 40).toFixed(1)}px,${(Math.cos(t * .21 + i) * 30).toFixed(1)}px) scale(${(1 + .12 * Math.sin(t * .3 + i)).toFixed(3)})`; });
      beams.forEach((b, i) => { b.el.style.transform = `rotate(${(b.r + Math.sin(t * .27 + i * 1.7) * 4).toFixed(2)}deg)`; b.el.style.opacity = (b.o * (.75 + .25 * Math.sin(t * .6 + i))).toFixed(3); });
      bok.forEach((b) => { b.el.style.transform = `translate(${((b.x + t * 9 * b.s) % 460 - 30).toFixed(1)}px,${((b.y - t * 14 * b.s + 800) % 780 - 40).toFixed(1)}px)`; });
      const rotor = (els, sp = 1) => els.forEach((p, i) => { p.style.transform = `rotate(${((i % 4 === 1 || i % 4 === 2 ? -1 : 1) * t * 1150 * sp + i * 40).toFixed(1)}deg)`; });
      rotor(props); rotor(sProps); rotor(mProps); rotor(fProps);
      const blink = Math.floor(t * 1.25) % 2 ? .25 : 1; ledW.forEach((l) => { l.style.opacity = blink; });

      // 0-2.9 drone: rises, wireframe -> solid by the scan, slow orbit, then flies at the camera
      { const up = expo(seg(t, 0, 1.3)), out = io(seg(t, 2.35, 2.95));
        const rx = lerp(62, 44, io(seg(t, 0, 2.4))), rz = lerp(-14, 6, io(seg(t, 0, 2.8))), z = lerp(-120, 40, io(seg(t, 0, 2.4))) + 900 * out;
        droneBox.style.transform = `translate3d(0,${((1 - up) * 340 + Math.sin(t * 2.2) * 6).toFixed(1)}px,${z.toFixed(1)}px) rotateX(${rx.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg)`;
        droneBox.style.opacity = (1 - seg(t, 2.75, 2.95)).toFixed(3); droneBox.style.display = t > 2.97 ? 'none' : '';
        const sc = io(seg(t, .45, 1.75)) * 100; solid.style.clipPath = `inset(0 0 ${(100 - sc).toFixed(1)}% 0)`; scanL.style.top = `${(sc * 3.6).toFixed(1)}px`; scanL.style.opacity = (win(t, .45, 1.75, .15)).toFixed(3);
        wire.style.opacity = (.95 * (1 - seg(t, 1.6, 2.1))).toFixed(3);
        dTag.style.opacity = (expo(seg(t, 1.5, 2)) * (1 - seg(t, 2.4, 2.6))).toFixed(3);
        hook.style.opacity = (expo(seg(t, .1, .6)) * (1 - seg(t, 2.6, 2.85))).toFixed(3); hook.style.transform = `translateY(${((1 - expo(seg(t, .1, .7))) * 14).toFixed(1)}px) scale(${(1 + .04 * seg(t, 0, 2.8)).toFixed(4)})`; }

      // the browser camera: fly-in 2.9-3.8, slow push 3.8-5.6, pull back + orbit 5.9-9, push-in 9-12, dolly 12-15, pull back 15-17.3
      const fi = expo(seg(t, 2.85, 3.9));
      let ry = lerp(-34, -8, fi), rx = lerp(14, 5, fi), tz = lerp(-1300, 0, fi), ty = 0, tx = 0;
      ry += 6 * io(seg(t, 3.8, 5.6)); tz += 110 * io(seg(t, 3.8, 5.6));
      const pb = io(seg(t, 5.9, 7.3)); tz += -110 * pb - 300 * pb; ty += -70 * pb; rx += 8 * pb;
      const orb = io(seg(t, 7.2, 9.0)); ry += -16 * orb;
      const pi = io(seg(t, 9.0, 10.6)); tz += 330 * pi; ty += 70 * pi; rx += -8 * pi; ry += 18 * pi;
      ry += 8 * io(seg(t, 10.6, 12.0));
      const dl = io(seg(t, 12.0, 13.6)); tz += -150 * dl; ry += -14 * dl; ty += -10 * dl;
      ry += 10 * io(seg(t, 13.6, 15.0)); tz += 40 * io(seg(t, 13.6, 15.0));
      const fin = io(seg(t, 15.0, 16.4)); tz += -170 * fin; tx += -60 * fin; ry += 14 * fin; ty += -30 * fin;
      frame.style.transform = `translate3d(${tx.toFixed(1)}px,${ty.toFixed(1)}px,${tz.toFixed(1)}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      frame.style.opacity = (seg(t, 2.85, 3.2) * (1 - seg(t, 17.3, 17.45))).toFixed(3);
      frame.style.filter = t < 3.9 && t > 2.8 ? `blur(${((1 - fi) * 7).toFixed(2)}px)` : 'none';
      pool.style.opacity = (.9 * (1 - .6 * win(t, 5.9, 15, .8))).toFixed(3);
      floor.style.opacity = (.6 * (1 - .7 * win(t, 5.9, 9.3, .6))).toFixed(3);
      glare.style.transform = `translateX(${(-100 + (ry + 40) * 6 + t * 4).toFixed(1)}px) rotate(18deg)`;

      // address bar, stuck load (coral), the request crawling
      url.textContent = 'nimbra.store'.slice(0, Math.floor(clamp((t - 3.2) / .7) * 12)); caret.style.opacity = t < 4 && Math.floor(t * 3) % 2 ? '1' : '0';
      const loaded = P.springAt(t, 6.95, 'bold'), on = t > 6.95;
      lb.style.width = `${(t < 6.95 ? 12 + 50 * io(seg(t, 3.9, 5.8)) : 62 + 38 * expo(seg(t, 6.95, 7.2))).toFixed(1)}%`; lb.style.background = on ? ICE : COR; lb.style.opacity = (1 - seg(t, 7.3, 7.6)).toFixed(3);
      skel.style.opacity = (1 - seg(t, 6.95, 7.15)).toFixed(3); [...skel.children].forEach((b) => { b.style.backgroundPosition = `${(-t * 120) % 400}px 0`; });
      spinner.style.opacity = (1 - seg(t, 6.9, 7.05)).toFixed(3); spinner.style.transform = `rotate(${(t * 300).toFixed(0)}deg)`;
      site.style.opacity = on ? clamp(loaded * 1.5).toFixed(3) : '0';
      route.style.opacity = (expo(seg(t, 3.5, 4)) * (1 - seg(t, 5.5, 5.75))).toFixed(3);
      pk.style.left = `${(io(seg(t, 3.6, 5.6)) * 38).toFixed(1)}%`;
      tm.textContent = t < 3.6 ? 'LOADING …' : `LOADING … ${(Math.min(t, 5.6) - 3.6 + .4).toFixed(1)} S`;
      edge.style.opacity = (expo(seg(t, 7.2, 7.6)) * (1 - seg(t, 8.8, 9.0))).toFixed(3);

      // the globe: rises from below at 5.9, holds under the browser, sinks out at 9.6
      camTy = ty;

      // the site, now live: hero with spinning rotors, then the specs dials (9-12), then the hub globe (12-15)
      { const pop = (el, a, dy = 16) => { const kk = P.springAt(t, a, 'bold'); el.style.opacity = clamp(kk * 1.6).toFixed(3); el.style.transform = `translateY(${((1 - kk) * dy).toFixed(1)}px)`; };
        pop(h1, 7.0, 30); pop(lede, 7.2); pop(btns, 7.3, 20); calls.forEach((c, i) => pop(c, 7.35 + i * .1, 12));
        { const kk = P.springAt(t, 7.05, 'bold'); sDrone.style.transform = `translateY(${(Math.sin(t * 2) * 8).toFixed(1)}px) scale(${(.4 + .6 * kk).toFixed(3)})`; }
        const s1 = io(seg(t, 10.4, 11.2)) * yS, s2 = io(seg(t, 12.6, 13.6)) * (yH - yS);
        site.style.transform = `translateY(${(-(s1 + s2) * K).toFixed(1)}px) scale(${K})`;
        arcs.forEach((a, i) => { const kk = expo(seg(t, 11.0 + i * .15, 11.9 + i * .15)); a.setAttribute('stroke-dashoffset', (1 - (1 - ARC[i]) * kk).toFixed(3)); });
        nums.forEach((n, i) => { n.style.opacity = expo(seg(t, 11.0 + i * .15, 11.4 + i * .15)).toFixed(3); n.textContent = NUM[i]; });
        spin.style.transform = `rotateY(${(t * 40).toFixed(1)}deg)`;
        rows.forEach((r, i) => pop(r, 13.4 + i * .12, 18)); }

      // 12-15 shield: ring locks on, bot sparks fly in and burst on it, chips tick
      { const k = P.springAt(t, 12.2, 'bold'); shield.style.opacity = (clamp(k * 1.5) * (1 - seg(t, 14.9, 15.3)) * (.75 + .25 * Math.sin(t * 6))).toFixed(3); shield.style.transform = `translateZ(30px) scale(${(1.25 - .25 * k).toFixed(3)})`; }
      sparks.forEach((s, i) => { const u = seg(t, s.a, s.a + .45), cx = BX + BW / 2, cy = BY + BH / 2 - 20, R0 = 330, R1 = 165;
        const r = lerp(R0, R1, P.EASE.snap(u)), x = cx + Math.cos(s.ang) * r * 1.1, y = cy + Math.sin(s.ang) * r * .9;
        s.el.style.opacity = u > 0 && u < 1 ? '1' : '0'; s.el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,40px)`;
        const b = seg(t, s.a + .45, s.a + .85), bx = cx + Math.cos(s.ang) * R1 * 1.1, by = cy + Math.sin(s.ang) * R1 * .9;
        burst[i].style.opacity = (b > 0 && b < 1 ? 1 - b : 0).toFixed(3); burst[i].style.transform = `translate3d(${bx.toFixed(1)}px,${by.toFixed(1)}px,40px) scale(${(.4 + 2.2 * expo(b)).toFixed(3)})`; });
      chips.forEach((c, i) => { const k = P.springAt(t, 13.3 + i * .3, 'bold'); c.style.opacity = (clamp(k * 1.6) * (1 - seg(t, 14.8, 15.05))).toFixed(3); c.style.transform = `translateY(${((1 - k) * 18).toFixed(1)}px) scale(${(.8 + .2 * k).toFixed(3)})`; });

      // 15-17.3 phone swings in, the drone sweeps across
      { const k = expo(seg(t, 15.1, 16.5)); phone.style.opacity = (seg(t, 15.1, 15.4) * (1 - seg(t, 17.3, 17.45))).toFixed(3);
        phone.style.transform = `translate3d(${((1 - k) * 220).toFixed(1)}px,${((1 - k) * 40).toFixed(1)}px,${(80 + (1 - k) * 120).toFixed(1)}px) rotateY(${lerp(-70, -16, k).toFixed(2)}deg) rotateZ(${lerp(8, 2, k).toFixed(2)}deg)`;
        msite.style.transform = `translateY(${(-io(seg(t, 15.8, 17.2)) * 300 * .2944).toFixed(1)}px) scale(.2944)`; }
      { const u = io(seg(t, 15.6, 17.35)); fly.style.opacity = (win(t, 15.6, 17.25, .15)).toFixed(3);
        fly.style.transform = `translate(${lerp(-330, 330, u).toFixed(1)}px,${lerp(640, 300, u).toFixed(1)}px) rotate(${lerp(-30, 12, u).toFixed(1)}deg) scale(${lerp(.9, 1.4, Math.sin(u * Math.PI)).toFixed(3)})`; }

      // cut effects: chroma scan wipe into the browser, a darker veil at the breath, the flash into the end card
      { const u = seg(t, 2.7, 3.15); wipe.style.opacity = u > 0 && u < 1 ? '1' : '0'; wipe.style.transform = `translateY(${(-140 + 860 * io(u)).toFixed(1)}px)`;
        const u2 = seg(t, 9.0, 9.35); if (u2 > 0 && u2 < 1) { wipe.style.opacity = '.7'; wipe.style.transform = `translateY(${(840 - 980 * io(u2)).toFixed(1)}px)`; } }
      veil.style.opacity = (.35 * win(t, 5.55, 5.85, .12)).toFixed(3);
      flash.style.opacity = (Math.max(0, 1 - Math.abs(t - 17.38) / .2)).toFixed(3);

      caps.forEach(({ a, b, el }) => { const k = expo(seg(t, a, a + .6)); el.style.opacity = (k * (1 - seg(t, b - .3, b))).toFixed(3); el.style.transform = `translateY(${((1 - k) * 12).toFixed(1)}px)`; });

      const d = gimg.data; let s = (Math.floor(t * 30) * 2654435761) >>> 0; for (let i = 0; i < d.length; i += 4) { s = (s * 1664525 + 1013904223) >>> 0; const v = s >>> 24; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; } gx.putImageData(gimg, 0, 0);
    });
    S.name = 'Nimbra edge cinema film v1';
    return { ok: true };
  };
  S.update = function (E, t) { P.update(t); };
  S.cues = () => [];
})();
