// FILM, theme `sitescroll` (the site itself is the show: its own GPU planet, then the real page), service `edge`: "Morning in Tokyo. Midnight in Berlin. Same speed." 19 s, 17 Oct 2026.
// BRIEF (creative director). Brand on the proof site: Veloria, fictional live language classes in every time zone; the site's hero is a live GPU planet.
// The idea: one world, every hour at once. The camera is a spacecraft: it opens on the limb at sunrise, orbits across the night side while edge nodes
// light up city by city (each ring of light is a copy of the site served from that city), dives through the atmosphere into the website, and pulls
// back to the whole blue world with the site in a phone: the same speed in every time zone.
// Look: the template's own fragment shader (P.glsl.fromPage: the film renders the SAME planet the site renders, driven by film time, patched with
// edge-node rings), deep space #04060d, gold sunrise rim, warm city sparks, electric-blue edge rings (#7cc4ff), white-blue flash on the dive.
// Type: Figtree 700 for the lines, Michroma (the site's display face) for the accent line with the site's gold-to-sky gradient. Finish: vignette from
// the shader, a soft top scrim, light grain, an electric brand end.
// Combination never used together in our work: (1) a template's own GLSL world reused live in the film (new part P.glsl: patches, extra passes, probe),
// (2) screen-projected HUD tags pinned to shader-space cities (the probe maps where the land and cities are, so tags land on real lights),
// (3) a camera dive through an atmosphere that becomes the live DOM website on the same shader, then a pull-back into a phone over the planet.
// Shot list (84 BPM, a beat every 0.714 s; cuts on beats):
//  0-3.57 close on the limb, the sun clears the horizon, gold rim, hook in three lines | 3.57-7.14 slow orbit across the night side, four cities ping
//  (rings + tags with latency) | breath 7.14-7.57 (dim, hold) | 7.57-8.57 dive through the atmosphere, flash | 8.57-12.86 the real website on its live
//  planet (2D camera): hero + "served from the nearest edge" chip, scroll to the city clocks, latency chips, Berlin turns midnight | 12.86-15.71 pull back:
//  the site shrinks into a phone in front of the whole blue world while edge nodes light round the globe | 15.71-19 brand end (electric), loops to frame 0.
(function () {
  const E = window.FilmEngine, P = window.FilmParts, { clamp, lerp } = E, S = (E.story = {});
  S.selfStage = true;
  S.dna = {
    service: 'edge', theme: 'sitescroll', format: 'world tour',
    combo: 'the template\'s own GLSL planet reused live in the film and patched with edge-node rings + HUD tags pinned to shader-space cities found by a probe pass + a camera dive through the atmosphere into the live DOM website on the same shader, then a pull-back into a phone over the whole world',
    opening: 'close on a planet\'s limb in deep space, the sun clears the horizon and runs gold along the atmosphere while city lights glitter below, under the hook "Morning in Tokyo. Midnight in Berlin. Same speed."',
    bigMoment: 'after a held breath over the night side the camera dives through the glowing atmosphere in a white-blue flash and lands inside the live website, the same planet now its hero',
    ground: 'the template\'s own GPU planet: deep space with stars, a gold sunrise rim, warm city sparks on the night side, electric-blue edge rings, vignette and light grain',
    music: 'cinematic ambient electronic, airy pads over a soft pulse that starts at the orbit, a held breath, a bright swell on the dive and a calm resolve, 84 BPM',
  };
  const INK = '#04060d', SKY = '#7cc4ff', GOLD = '#ffb45a', MINT = '#62f5c0', TXT = '#eef3ff';
  const DISP = "Michroma,sans-serif", BODY = "Figtree,system-ui,sans-serif", MONO = "'Geist Mono',ui-monospace,monospace";
  const B = 60 / 84, LEN = 19, CUT = { orbit: 5 * B, breath: 10 * B, dive: 7.57, site: 12 * B, pull: 18 * B, end: 22 * B };   // 3.57 7.14 7.57 8.57 12.86 15.71
  const io = (k) => P.EASE.swing(clamp(k)), seg = (t, a, b) => clamp((t - a) / (b - a));
  const win = (t, a, b, f = .3) => clamp((t - a) / f) * (1 - clamp((t - b) / f));
  // smooth camera keys: Catmull-Rom through [t, v...] keys (velocity carries through every key; no stops mid-move), held at both ends
  const path = (K) => (t) => { if (t <= K[0][0]) return K[0].slice(1); if (t >= K[K.length - 1][0]) return K[K.length - 1].slice(1);
    let i = 0; while (t > K[i + 1][0]) i++; const p0 = K[Math.max(0, i - 1)], p1 = K[i], p2 = K[i + 1], p3 = K[Math.min(K.length - 1, i + 2)], u = (t - p1[0]) / (p2[0] - p1[0]);
    return p1.slice(1).map((_, j) => { const a = p1[j + 1], b = p2[j + 1], m1 = (b - p0[j + 1]) / (p2[0] - p0[0]) * (p2[0] - p1[0]), m2 = (p3[j + 1] - a) / (p3[0] - p1[0]) * (p2[0] - p1[0]);
      return (2 * u ** 3 - 3 * u ** 2 + 1) * a + (u ** 3 - 2 * u ** 2 + u) * m1 + (-2 * u ** 3 + 3 * u ** 2) * b + (u ** 3 - u ** 2) * m2; }); };
  // [t, D distance, a pitch, az sun azimuth, el sun elevation, SP spin, YW yaw, RL roll]
  const SPACE = path([
    [-1.6, 1.44, .79, .18, .70, .80, .04, .15], [0, 1.41, .80, .17, .75, .84, .02, .14], [1.8, 1.38, .81, .15, .795, .90, 0, .12], [3.57, 1.46, .77, .05, .775, 1.10, -.08, .07],
    [5.4, 1.58, .68, -1.0, .34, 1.62, -.16, .02], [7.14, 1.62, .66, -1.2, .32, 1.92, -.2, 0], [7.57, 1.61, .67, -1.22, .32, 1.95, -.2, 0], [8.57, 1.12, 1.1, -1.05, .36, 2.1, -.24, -.05]]);
  const PULL = path([[12.86, 1.75, .5, -1.6, .34, 2.6, .1, 0], [14.3, 3.3, .1, -2.15, .42, 2.95, .02, 0], [15.71, 3.65, .06, -2.3, .44, 3.1, 0, 0]]);
  const SITEK = [[0, 2.1, .54, .14, .55], [.33, 1.62, .66, -1.2, .32], [.66, 2.4, .32, -1.75, .28], [1, 3.7, .02, -2.25, .42]];   // the template's own scroll flight
  const siteFlight = (s) => { let i = 0; while (i < SITEK.length - 2 && s > SITEK[i + 1][0]) i++; const k = io((s - SITEK[i][0]) / (SITEK[i + 1][0] - SITEK[i][0])); return [1, 2, 3, 4].map((j) => lerp(SITEK[i][j], SITEK[i + 1][j], k)); };

  S.setup = async function () {
    document.documentElement.classList.add('reel');
    await P.ready; await document.fonts.ready;
    await Promise.all(['400 30px Michroma', '700 34px Figtree', '600 14px Figtree', '500 12px Figtree'].map((f) => document.fonts.load(f)));
    await new Promise((r) => setTimeout(r, 1200));
    { const g = document.getElementById('world').getContext('webgl'), x = g && g.getExtension('WEBGL_lose_context'); if (x) x.loseContext(); }   // the live page's own loop stops; the film draws the planet itself
    const srcMain = document.querySelector('main'), srcPill = document.querySelector('.pill'), srcScrim = document.querySelector('.scrim');
    P.scene({ accent: SKY, ink: INK, glow: 'rgba(0,0,0,0)', len: LEN });
    [...P.L.children].forEach((c) => { if (/blur/.test(c.style.filter)) c.style.display = 'none'; });   // no bokeh discs over a real sky
    P.breath = [CUT.breath, CUT.dive - .02];
    P.use('opener', 'sunrise-limb-close'); P.use('transition', 'atmosphere-dive'); P.use('mechanism', 'edge-node-rings'); P.use('payoff', 'phone-over-world');
    P.use('focus', 'pinned-city-tags'); P.use('type', 'stacked-lines-gradient'); P.use('captions', 'top-third-lines');

    // ---------- the planet: the site's own shader, patched with edge-node rings (PG: q.xyz + age) and a free camera (yaw, roll) ----------
    const NP = 12, PG = Array.from({ length: NP }, () => [0, 0, 1, -1]);
    const W = P.glsl(P.L, {
      frag: P.glsl.fromPage('fs'), res: 1.9,
      patch: [
        ['uniform vec4 C;', `uniform vec4 C;uniform float YW,RL;uniform vec4 PG[${NP}];`],
        ['vec2 uv=(gl_FragCoord.xy-.5*R)/R.y;', 'vec2 uv=(gl_FragCoord.xy-.5*R)/R.y;uv=mat2(cos(RL),sin(RL),-sin(RL),cos(RL))*uv;'],
        ['mat3 Y=ry(.07*sin(T*.06));', 'mat3 Y=ry(.07*sin(T*.06)+YW);'],
        ['col+=vec3(1.,.64,.28)*zone*spark*night*(1.-cl*.85)*1.7;', `col+=vec3(1.,.64,.28)*zone*spark*night*(1.-cl*.85)*1.7;
    for(int i=0;i<${NP};i++){vec4 g=PG[i];if(g.w>0.){float d=length(q-g.xyz);
      col+=vec3(.42,.76,1.)*exp(-pow((d-g.w*.11)*70.,2.))*exp(-g.w*1.)*1.7+vec3(.42,.76,1.)*exp(-pow((d-g.w*.06)*90.,2.))*exp(-g.w*2.)*.9;
      col+=vec3(.62,.86,1.)*(exp(-d*d*9000.)*2.+exp(-d*d*2200.)*.3)*min(1.,g.w*7.)*(1.+.25*sin(T*5.+float(i)));
      col+=vec3(1.,.74,.4)*zone*spark*night*(1.-cl*.85)*exp(-d*d*36.)*smoothstep(0.,.3,g.w)*2.2;}}`],
      ],
      drive: (t, dim) => { const u = U(t); u.E *= 1 - .62 * dim; return u; },
      before: (t) => phonePass(t),   // the phone screen's copy of the world is drawn first; the main frame is drawn last (it is what the renderer grabs)
    });
    P.L.insertBefore(W.cv, P.world);

    // camera state per film time (the loop: from 18.3 s the opening shot plays again, so the last frame is the first)
    const life = (t) => (t >= 18.3 ? t - LEN : t);
    const flash = (t) => Math.pow(seg(t, CUT.dive + .35, CUT.site), 2.2) * (1 - seg(t, CUT.site, CUT.site + .55));
    const view = (t0) => { const t = life(t0);
      if (t < CUT.site) { const [D, a, az, el, SP, YW, RL] = SPACE(t); return { D, a, az, el, SP, YW, RL, T: 30 + t, E: 1.12 * (1 + 2.6 * flash(t)) }; }
      if (t < CUT.pull) { const s = siteS(t), [D, a, az, el] = siteFlight(s); return { D, a, az, el, SP: .9 + s * 2.2 + .14 + (t - CUT.site) * .02, YW: 0, RL: 0, T: 19 + t, E: 1.1 * (1 + 1.4 * flash(t)) }; }
      const [D, a, az, el, SP, YW, RL] = PULL(t); return { D, a, az, el, SP, YW, RL, T: 19 + t, E: 1.1 }; };
    const U = (t) => { const v = view(t), lt = life(t); if (lt >= CUT.site && lt < CUT.pull) PG.fill([0, 0, 1, -1]); else pingAges(lt, v);   /* the site's own planet has no rings */ return { T: v.T, SP: v.SP, E: v.E, C: [v.D, v.a, v.az, v.el], YW: v.YW, RL: v.RL, PG }; };

    // projection of a planet-fixed point q (the shader's own maths) to frame px; null when it faces away
    const project = (q, v) => { const s = Math.sin(.07 * Math.sin(v.T * .06) + v.YW), c = Math.cos(.07 * Math.sin(v.T * .06) + v.YW), ca = Math.cos(v.a), sa = Math.sin(v.a);
      const ro = [s * v.D, 0, c * v.D], fw = [-s * ca, sa, -c * ca], rt = [c, 0, -s], up = [s * sa, ca, c * sa];
      const cs = Math.cos(v.SP), ss = Math.sin(v.SP), n = [cs * q[0] - ss * q[2], q[1], ss * q[0] + cs * q[2]];
      const dot = (x, y) => x[0] * y[0] + x[1] * y[1] + x[2] * y[2], d = [n[0] - ro[0], n[1] - ro[1], n[2] - ro[2]];
      if (dot(n, [-d[0], -d[1], -d[2]]) <= .02) return null; const z = dot(d, fw); if (z <= 0) return null;
      let ux = dot(d, rt) / z, uy = dot(d, up) / z; const cr = Math.cos(-v.RL), sr = Math.sin(-v.RL); [ux, uy] = [cr * ux - sr * uy, sr * ux + cr * uy];
      const L = [Math.sin(v.az) * Math.cos(v.el), Math.sin(v.el), -Math.cos(v.az) * Math.cos(v.el)];
      return { x: 201 + ux * 715, y: 357.5 - uy * 715, night: dot(n, L) }; };

    // where the cities are: an equirect probe of the same noise (land, city zones), then local maxima
    const MW = 720, MH = 360, map = W.probe(`void main(){vec2 f=gl_FragCoord.xy/R;float lo=f.x*6.2831853-3.1415927,la=(f.y-.5)*3.1415927;vec3 q=vec3(cos(la)*sin(lo),sin(la),cos(la)*cos(lo));
      float cont=fbm(q*1.9+.35*n3(q*4.));float land=smoothstep(.49,.52,cont),ice=smoothstep(.8,.9,abs(q.y)+.06*n3(q*9.));
      gl_FragColor=vec4(land*(1.-ice)*smoothstep(.42,.68,fbm(q*5.+3.)),land,0.,1.);}`, MW, MH);
    const zoneAt = (x, y) => map[((y * MW) + ((x + MW) % MW)) * 4] / 255, cand = [];
    for (let y = 6; y < MH - 6; y += 2) for (let x = 0; x < MW; x += 2) { const z = zoneAt(x, y); if (z < .5) continue;   // dense: the close orbit sees a small patch of the globe
      const lo = (x + .5) / MW * 2 * Math.PI - Math.PI, la = ((y + .5) / MH - .5) * Math.PI; cand.push({ z, q: [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)] }); }

    // pings: four named cities in the orbit (on the beat), then eight more lighting round the globe in the pull-back
    const NAMED = [['Tokyo', 24], ['Mumbai', 31], ['Berlin', 19], ['New York', 27]], P_AT = [6 * B, 7 * B, 8 * B, 9 * B];   // 4.29 5.00 5.71 6.43
    const used = [], pick = (t, box, night) => { let best = null, bs = -1;
      for (const c of cand) { if (used.includes(c)) continue; const v = view(t), p = project(c.q, v), p2 = project(c.q, view(t + 1.2)); if (!p || !p2) continue;
        if (night && (p.night > .02 || p2.night > .02)) continue; if (p.x < box[0] || p.x > box[2] || p.y < box[1] || p.y > box[3] || p2.x < box[0] - 20 || p2.x > box[2] + 20) continue;
        const far = Math.min(999, ...used.map((u) => { const o = project(u.q, v); return o ? Math.hypot(o.x - p.x, o.y - p.y) : 999; })), sc = c.z + Math.min(far, 140) / 140;
        if (far > (box.wide ? 60 : 95) && sc > bs) { bs = sc; best = c; } }
      if (!best && !box.wide) return pick(t, Object.assign([box[0] - 50, box[1] - 60, box[2] + 50, box[3] + 60], { wide: 1 }), night);
      if (best) used.push(best); return best; };
    const pings = [];
    const NBOX = [[60, 300, 200, 470], [210, 260, 320, 430], [60, 250, 210, 420], [200, 380, 320, 500]];
    P_AT.forEach((t0, i) => { const c = pick(t0, NBOX[i], true); if (c) pings.push({ t0, q: c.q, name: NAMED[i] }); });
    for (let i = 0; i < 8; i++) { const t0 = 13.2 + i * .19, c = pick(t0, [[40, 150, 362, 285], [16, 290, 82, 520], [322, 290, 386, 520]][i % 3], false); if (c) pings.push({ t0, q: c.q }); }
    const pingAges = (t, v) => pings.forEach((p, i) => { if (i >= NP) return; PG[i] = [...p.q, t >= p.t0 ? t - p.t0 + .001 : -1]; });

    // ---------- the website: a same-document clone of the real page over the same live planet (2D camera only: crisp type) ----------
    const rig = E.el('div', 'position:absolute;inset:0', P.L); P.L.insertBefore(rig, P.front);
    const SX = 0, PHS = .6, PHX = 201, PHY = 288;   // phone: scale, centre x, top y
    const site = E.el('div', `position:absolute;left:0;top:0;width:402px;height:715px;overflow:hidden;transform-origin:50% 0;opacity:0;background:transparent`, rig);
    const scr = E.el('canvas', 'position:absolute;inset:0;width:402px;height:715px;opacity:0', site); scr.width = 402; scr.height = 715; const scx = scr.getContext('2d');
    const scrim = srcScrim.cloneNode(true); scrim.style.position = 'absolute'; site.appendChild(scrim);
    const roll = E.el('div', 'position:absolute;left:0;top:0;width:402px', site), main = srcMain.cloneNode(true); main.removeAttribute('id'); roll.appendChild(main);
    const pill = srcPill.cloneNode(true); pill.style.position = 'absolute'; site.appendChild(pill);
    [main, pill].forEach((r) => r.querySelectorAll('*').forEach((n) => { n.style.animation = 'none'; }));
    main.querySelectorAll('.sat').forEach((n) => n.remove());
    const notch = E.el('i', 'position:absolute;left:50%;top:10px;width:96px;height:28px;margin-left:-48px;border-radius:99px;background:#000;opacity:0;z-index:9', site);
    // fixed example content (the live page ticks with the real clock; the film holds its own minute): 21:59 UTC, then 22:00 on the beat
    const TZ = [['Tokyo', 540], ['Mumbai', 330], ['Berlin', 120], ['New York', -240]], FLIP = 16 * B;   // 11.43
    const clocks = [...main.querySelectorAll('.clock')], liveN = main.querySelector('#liveN'), count = main.querySelector('#count'), track = main.querySelector('.track');
    const setClocks = (utc) => clocks.forEach((c, i) => { const m = ((utc + TZ[i][1]) % 1440 + 1440) % 1440, h = Math.floor(m / 60), mm = m % 60;
      c.querySelector('.t').textContent = String(h).padStart(2, '0') + ':' + String(mm).padStart(2, '0');
      const f = (m / 60) / 24, x = 4 + f * 132, y = 28 - 38 * f * (1 - f) * 2, g = c.querySelector('.sun');
      g.setAttribute('transform', `translate(${x.toFixed(1)} ${Math.max(4, y).toFixed(1)})`); g.querySelector('circle').setAttribute('fill', h >= 6 && h < 19 ? GOLD : '#cfe0ff'); });
    // latency chips on the clock cards (left-aligned inside each card: clear of Instagram's button column)
    const LAT = [24, 31, 19, 27], chips = clocks.map((c, i) => E.el('span', `display:inline-flex;align-items:center;gap:6px;margin-top:8px;padding:5px 9px;border-radius:99px;background:rgba(124,196,255,.14);border:1px solid rgba(124,196,255,.45);font:600 11.5px/1 ${BODY};color:${TXT};opacity:0`, c,
      `<svg viewBox="0 0 12 12" width="11" height="11"><path d="M7 1 2 7h4l-1 4 5-6H6z" fill="${SKY}"/></svg>${LAT[i]} ms`));
    const off = (sel) => { const a = main.querySelector(sel).getBoundingClientRect(), b = roll.getBoundingClientRect(); return a.top - b.top; };
    site.style.opacity = '1'; const yZones = off('.zones') + 8, yClose = off('.close') - 40, pageH = roll.getBoundingClientRect().height, maxY = pageH - 715; site.style.opacity = '0';
    const STOPS = [[CUT.site, 0], [10.0, 0], [10.85, yZones], [CUT.pull + .25, yZones], [15.2, yClose]];
    const scrollY = (t) => { if (t <= STOPS[0][0]) return 0; for (let i = 0; i < STOPS.length - 1; i++) { const [a, ya] = STOPS[i], [b, yb] = STOPS[i + 1]; if (t <= b) return lerp(ya, yb, io((t - a) / (b - a))); } return STOPS[STOPS.length - 1][1]; };
    const siteS = (t) => clamp(scrollY(t) / Math.max(1, maxY));
    const phonePass = (t0) => { if (t0 < CUT.pull || t0 >= CUT.end + .4) return; const s = siteS(t0), [D, a, az, el] = siteFlight(s);
      W.pass(scx, 402, 715, { T: 19 + t0, SP: .9 + s * 2.2 + .14 + (t0 - CUT.site) * .02, E: 1.1, C: [D, a, az, el], YW: 0, RL: 0, PG: PG.map(() => [0, 0, 1, -1]) }); };
    // hero chip: where this copy of the page was served from
    const hero = E.el('div', `position:absolute;left:30px;top:322px;display:flex;align-items:center;gap:9px;padding:9px 14px 9px 10px;border-radius:14px;background:rgba(6,10,24,.84);border:1px solid rgba(124,196,255,.4);box-shadow:0 0 30px -6px rgba(124,196,255,.5);opacity:0`, site,
      `<i style="width:26px;height:26px;border-radius:8px;display:grid;place-items:center;background:linear-gradient(135deg,${SKY},#2f6bff)"><svg viewBox="0 0 12 12" width="13" height="13"><path d="M7 1 2 7h4l-1 4 5-6H6z" fill="#fff"/></svg></i>
       <div><div style="font:700 14px/1.1 ${BODY};color:${TXT}">Loaded in 0.4 s</div><div style="margin-top:3px;font:500 11px/1 ${MONO};color:#a9c8ee;letter-spacing:.04em">served from the Tokyo edge</div></div>`);

    // ---------- type ----------
    const scrimTop = E.el('div', `position:absolute;left:0;right:0;top:0;height:300px;background:linear-gradient(rgba(4,6,13,.78),rgba(4,6,13,.42) 55%,rgba(4,6,13,0))`, P.front);
    const T = (html, css) => E.el('div', `position:absolute;left:30px;right:26px;color:${TXT};font:700 34px/1.12 ${BODY};letter-spacing:-.015em;white-space:nowrap;text-shadow:0 2px 24px rgba(4,6,13,.9);opacity:0;${css}`, P.front, html);
    const ACC = (txt) => `<span style="font:400 29px/1.2 ${DISP};letter-spacing:.02em;background:linear-gradient(90deg,${GOLD},#ffe0b0 45%,${SKY});-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 14px rgba(255,180,90,.35))">${txt}</span>`;
    const LINES = [
      [-.75, 3.38, T('Morning in Tokyo.', 'top:104px'), T('Midnight in Berlin.', 'top:144px'), T(ACC('SAME SPEED.'), 'top:190px')],
      [3.85, 6.95, T('Served from', 'top:104px'), T('the city next door.', 'top:144px')],
      [13.1, 15.5, T('One setup.', 'top:104px'), T(ACC('EVERY TIME ZONE.').replace('29px', '24px'), 'top:148px')],
    ];
    // city tags pinned to the rings
    const tags = pings.filter((p) => p.name).map((p) => ({ p, el: E.el('div', `position:absolute;left:0;top:0;display:flex;align-items:center;gap:7px;padding:6px 10px 6px 8px;border-radius:10px;background:rgba(6,10,24,.78);border:1px solid rgba(124,196,255,.45);white-space:nowrap;opacity:0`, P.front,
      `<i style="width:7px;height:7px;border-radius:50%;background:${SKY};box-shadow:0 0 10px ${SKY}"></i><b style="font:700 13px/1 ${BODY};color:${TXT}">${p.name[0]}</b><span style="font:600 11.5px/1 ${MONO};color:${MINT}">${p.name[1]} ms</span>`) }));
    const lead = E.el('canvas', 'position:absolute;inset:0;width:402px;height:715px', P.front); lead.width = 804; lead.height = 1430; const lg = lead.getContext('2d');
    P.front.insertBefore(lead, tags[0] ? tags[0].el : null);

    // ---------- finish: dive flash, grain, brand end ----------
    const fl = E.el('div', `position:absolute;inset:0;background:radial-gradient(70% 55% at 50% 42%,#ffffff,#bfe2ff 35%,rgba(124,196,255,.55) 65%,rgba(47,107,255,0));opacity:0`, P.front);
    const gc = E.el('canvas', 'position:absolute;inset:0;width:402px;height:715px;opacity:.035;mix-blend-mode:overlay', P.front); gc.width = 201; gc.height = 358; const gx = gc.getContext('2d'), gimg = gx.createImageData(201, 358);
    P.brandEnd({ at: CUT.end, keyword: 'AQUARII', why: 'Fast for every customer, in every time zone.', fit: 'We’ll reply with the setup that fits your site.', grade: 'electric' });
    P.punchAt = CUT.site;

    P.on((t0) => {
      const t = life(t0), v = view(t0);
      // the site: full frame from the dive, then it pulls back into a phone over the world
      const onSite = t0 >= CUT.site && t0 < CUT.end + .4;
      site.style.opacity = onSite ? '1' : '0';
      if (onSite) {
        const q = P.springAt(t0, CUT.pull, 'default'), sc = lerp(1, PHS, q), land = P.springAt(t0, CUT.site, 'fade');
        const z = t0 < CUT.pull ? 1.06 - .06 * P.springAt(t0, CUT.site, 'default') + .025 * io(seg(t0, 9.2, CUT.pull)) : sc;   // 2D push-in on the page
        site.style.transform = `translate(${((PHX - 201) * q).toFixed(1)}px,${(PHY * q).toFixed(1)}px) scale(${z.toFixed(4)})`;
        site.style.borderRadius = `${(46 * q / Math.max(.2, sc)).toFixed(1)}px`; site.style.boxShadow = q > .01 ? `0 0 0 ${(9 / sc).toFixed(1)}px #0b0f1c,0 0 0 ${(10.5 / sc).toFixed(1)}px rgba(190,210,255,.28),0 30px 80px -10px rgba(0,0,0,.9),0 0 90px -10px rgba(124,196,255,${(.45 * q).toFixed(2)})` : 'none';
        notch.style.opacity = clamp(q * 3).toFixed(3); main.style.opacity = pill.style.opacity = land.toFixed(3);
        roll.style.transform = `translateY(${(-scrollY(t0)).toFixed(1)}px)`;
        scr.style.opacity = t0 >= CUT.pull ? '1' : '0';
        setClocks(1319 + (t0 >= FLIP ? 1 : 0));
        clocks.forEach((c, i) => { const tt = c.querySelector('.t'); const k = t0 >= FLIP ? P.springAt(t0, FLIP, 'bold') : 1; tt.style.display = 'inline-block'; tt.style.transform = i === 2 ? `translateY(${((1 - k) * -8).toFixed(1)}px)` : ''; tt.style.color = i === 2 && t0 >= FLIP ? GOLD : ''; });
        chips.forEach((el, i) => { const a = 11.0 + i * .18, k = P.springAt(t0, a, 'bold'); el.style.opacity = (t0 >= a ? P.springAt(t0, a, 'fade') : 0).toFixed(3); el.style.transform = `translateY(${((1 - k) * 8).toFixed(1)}px) scale(${(.85 + .15 * Math.min(1.05, k)).toFixed(3)})`; });
        liveN.textContent = String(312 + Math.floor((t0 - CUT.site) * 1.5));
        { const s = Math.max(0, 600 - Math.floor(t0 - CUT.site)); count.textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }
        track.style.transform = `translateX(${(-60 - (t0 - CUT.site) * 22).toFixed(1)}px)`;
        { const a = 9.05, k = P.springAt(t0, a, 'bold'), o = P.springAt(t0, a, 'fade') * (1 - P.tween(t0, 9.95, .25, 'snap')); hero.style.opacity = (t0 >= a ? o : 0).toFixed(3); hero.style.transform = `translateY(${((1 - k) * 14).toFixed(1)}px) scale(${(.92 + .08 * Math.min(1.04, k)).toFixed(3)})`; }
      }
      // type
      LINES.forEach(([a, b, ...els]) => els.forEach((el, i) => { const ti = t0 >= 18.3 && a < 0 ? t : t0, k = P.springAt(ti, a + i * .21, 'default'), o = P.springAt(ti, a + i * .21, 'fade') * (1 - P.tween(ti, b, .24, 'snap'));
        el.style.opacity = (a < 0 && ti < a + i * .21 + .02 ? 0 : o).toFixed(3); el.style.transform = `translateY(${((1 - k) * 18).toFixed(1)}px)`; }));
      // the frame-0 hook is already up (the loop returns to it): its first line is fully in at t = 0
      if (t0 < .02 || t0 >= LEN - .02) LINES[0][2].style.opacity = '1';
      scrimTop.style.opacity = (Math.max(win(t, -2, 3.45, .3), win(t, 3.8, 7.05, .3), win(t0, 13.0, 15.6, .3)) * (onSite && t0 < CUT.pull + .3 ? 0 : 1)).toFixed(3);
      // tags + leader lines to their rings
      lg.clearRect(0, 0, 804, 1430); const placed = [];
      tags.forEach(({ p, el }) => { const pr = project(p.q, v), a = p.t0 + .12, o = t >= a ? P.springAt(t, a, 'fade') * (1 - P.tween(t, Math.min(CUT.breath + .05, a + 1.65), .25, 'snap')) : 0;
        if (!pr || o <= .01 || t > CUT.breath + .4) { el.style.opacity = '0'; return; }
        const k = P.springAt(t, a, 'bold'), left = pr.x < 201, w = el.offsetWidth, x = left ? pr.x + 26 : pr.x - 26 - w; let y = pr.y - 44;
        for (const r of placed) if (Math.abs(r - y) < 32) y = r + 34;   // never stack one tag on another
        placed.push(y);
        el.style.opacity = o.toFixed(3); el.style.transform = `translate(${clamp(x, 30, 338 - w).toFixed(1)}px,${(y + (1 - k) * 10).toFixed(1)}px)`;
        lg.globalAlpha = o * .8; lg.strokeStyle = SKY; lg.lineWidth = 2; lg.beginPath(); lg.moveTo(pr.x * 2, pr.y * 2); lg.lineTo((clamp(x, 30, 338 - w) + (left ? 0 : w)) * 2, (y + 14) * 2); lg.stroke(); });
      fl.style.opacity = (Math.min(1, 1.15 * flash(t0))).toFixed(3);
      const d = gimg.data; let s = (Math.floor(t0 * 30) * 2654435761) >>> 0; for (let i = 0; i < d.length; i += 4) { s = (s * 1664525 + 1013904223) >>> 0; const g = s >>> 24; d[i] = d[i + 1] = d[i + 2] = g; d[i + 3] = 255; } gx.putImageData(gimg, 0, 0);
    });
    S.cuts = [CUT.site, CUT.pull];
    S.name = 'Veloria world-tour v1';
    return { ok: true };
  };
  S.update = function (E, t) { P.update(t); };
  S.cues = () => [];
})();
