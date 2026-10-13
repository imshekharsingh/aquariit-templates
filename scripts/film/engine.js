// Film engine (runs inside the page, driven frame by frame by scripts/film/render-film.mjs).
// The template stays a live DOM; a virtual camera (CSS 3D transform on #cam) flies over it, so every shot is vector-sharp at any zoom.
// Nothing runs on a clock: render(t) is a pure function of the film time t, so every frame is exact and repeatable.
(function () {
  const W = 402, H = 715;
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, k) => a + (b - a) * k;
  // easing: all take 0..1
  const ease = {
    lin: (k) => k,
    in2: (k) => k * k,
    out3: (k) => 1 - Math.pow(1 - k, 3),
    io3: (k) => (k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
    outX: (k) => (k >= 1 ? 1 : 1 - Math.pow(2, -10 * k)),          // expo out: long, slow settle (luxury)
    inX: (k) => (k <= 0 ? 0 : Math.pow(2, 10 * k - 10)),            // expo in: accelerating push
    ioX: (k) => (k <= 0 ? 0 : k >= 1 ? 1 : k < .5 ? Math.pow(2, 20 * k - 10) / 2 : (2 - Math.pow(2, -20 * k + 10)) / 2),
    back: (k) => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); },
    spring: (k) => (k <= 0 ? 0 : k >= 1 ? 1 : 1 - Math.exp(-7.5 * k) * Math.cos(12 * k)), // damped spring, lands at 1
  };
  const SPRING_CSS = 'linear(0,.128,.403,.695,.929,1.076,1.14,1.143,1.111,1.068,1.028,.999,.983,.978,.981,.986,.993,.998,1.001,1.003,1.003,1.002,1.002,1.001,1,1,1,1,1)'; // the template's own spring

  const E = (window.FilmEngine = {
    W, H, clamp, lerp, ease, SPRING_CSS, anims: [], frame: 0, keys: [], world: {},
    $: (s, r = document) => r.querySelector(s),
    $$: (s, r = document) => [...r.querySelectorAll(s)],
    el(tag, css, parent, html) { const e = document.createElement(tag); if (css) e.style.cssText = css; if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e; },
  });

  // ---- stage: #stage (clips) > #cam (the template) + #fx overlays -----------------------------------------------------------------------
  E.stage = function () {
    document.documentElement.style.cssText = `width:${W}px;height:${H}px;overflow:hidden;background:#1a0933`;
    document.body.style.cssText = `margin:0;width:${W}px;height:${H}px;overflow:hidden;position:relative;background:#1a0933`;
    const stage = E.el('div', `position:absolute;left:0;top:0;width:${W}px;height:${H}px;overflow:hidden;perspective:1100px;perspective-origin:50% 50%;background:#1a0933`, document.body);
    stage.id = 'stage';
    const cam = E.el('div', `position:absolute;left:0;top:0;width:${W}px;transform-origin:0 0`, stage);
    cam.id = 'cam';
    [...document.body.children].filter((e) => e !== stage && e.tagName !== 'SCRIPT').forEach((e) => cam.appendChild(e));
    const fx = E.el('div', `position:absolute;inset:0;pointer-events:none`, stage); fx.id = 'fx';
    E.stageEl = stage; E.cam = cam; E.fx = fx;
    // directional motion blur filter for whips (vertical; stdDeviation is set per frame)
    const svg = E.el('div', 'position:absolute;width:0;height:0', document.body, '<svg width="0" height="0"><filter id="mb" x="-5%" y="-30%" width="110%" height="160%"><feGaussianBlur id="mbg" stdDeviation="0 0"/></filter></svg>');
    E.mbg = svg.querySelector('#mbg');
    // overlays, bottom to top
    E.field = E.el('div', 'position:absolute;inset:0;opacity:0;background:#ff5a1f', fx);                    // flat colour field (match cuts, iris, loop frame)
    E.cards = E.el('div', 'position:absolute;inset:0', fx);                                                   // type cards
    E.sheen = E.el('div', 'position:absolute;left:-60%;top:-10%;width:60%;height:120%;opacity:0;mix-blend-mode:soft-light;background:linear-gradient(100deg,transparent 0,rgba(255,255,255,.0) 20%,rgba(255,255,255,.95) 50%,rgba(255,255,255,0) 80%,transparent 100%)', fx);
    E.vig = E.el('div', 'position:absolute;inset:0;opacity:.45;background:radial-gradient(120% 90% at 50% 46%,transparent 52%,rgba(8,2,20,.78) 100%)', fx);
    E.grain = E.el('div', 'position:absolute;inset:-40px;opacity:.09;mix-blend-mode:overlay', fx);
    const c = document.createElement('canvas'); c.width = c.height = 192; const g = c.getContext('2d'), d = g.createImageData(192, 192);
    let s = 1234567; for (let i = 0; i < d.data.length; i += 4) { s = (s * 1664525 + 1013904223) >>> 0; const v = s >>> 24; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
    g.putImageData(d, 0, 0); E.grain.style.backgroundImage = `url(${c.toDataURL()})`; E.grain.style.backgroundSize = '192px 192px';
  };

  // ---- measuring the world (page coordinates with the camera at identity) ------------------------------------------------------------------
  E.rect = (elOrSel) => {
    const e = typeof elOrSel === 'string' ? E.$(elOrSel) : elOrSel; const r = e.getBoundingClientRect();
    return { x: r.left, y: r.top, w: r.width, h: r.height, cx: r.left + r.width / 2, cy: r.top + r.height / 2, r: r.right, b: r.bottom };
  };
  E.measure = (fn) => { const t = E.cam.style.transform; E.cam.style.transform = 'none'; const out = fn(); E.cam.style.transform = t; return out; };

  // ---- camera ---------------------------------------------------------------------------------------------------------------------------
  // keys: {t, x, y, z, rx, ry, rz, e}; the camera looks at world point (x,y), zoom z, tilt rx/ry, roll rz (deg). `e` eases the move INTO this key.
  // two keys at the same time = a hard cut. Zoom is interpolated in log space so zooms feel even.
  E.camAt = (t) => {
    const K = E.keys; let a = K[0], b = null;
    for (let i = 0; i < K.length; i++) { if (K[i].t <= t) { a = K[i]; b = K[i + 1] || null; } else break; }
    const base = { x: a.x, y: a.y, z: a.z, rx: a.rx || 0, ry: a.ry || 0, rz: a.rz || 0 };
    if (!b || b.t - a.t < 1e-6) return base;
    const k = (E.ease[b.e || 'io3'])(clamp((t - a.t) / (b.t - a.t)));
    return { x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), z: Math.exp(lerp(Math.log(a.z), Math.log(b.z), k)), rx: lerp(a.rx || 0, b.rx || 0, k), ry: lerp(a.ry || 0, b.ry || 0, k), rz: lerp(a.rz || 0, b.rz || 0, k) };
  };
  E.applyCam = (c, blurY) => {
    E.cam.style.transform = `translate3d(${W / 2}px,${H / 2}px,0) rotateX(${c.rx}deg) rotateY(${c.ry}deg) rotateZ(${c.rz}deg) scale(${c.z}) translate3d(${-c.x}px,${-c.y}px,0)`;
    if (blurY > 0.3) { E.mbg.setAttribute('stdDeviation', `0 ${blurY.toFixed(1)}`); E.cam.style.filter = 'url(#mb)'; } else E.cam.style.filter = 'none';
  };

  // ---- type ----------------------------------------------------------------------------------------------------------------------------
  // wrap every word of an element in mask>inner spans so each word can slide up out of a mask, on its own beat
  E.splitWords = (root) => {
    const words = [];
    const walk = (n) => {
      [...n.childNodes].forEach((c) => {
        if (c.nodeType === 3) {
          const parts = c.textContent.split(/(\s+)/); const frag = document.createDocumentFragment();
          parts.forEach((p) => {
            if (!p) return; if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            const m = document.createElement('span'); m.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top;padding:.04em .02em .12em;margin:-.04em -.02em -.12em';
            const i = document.createElement('span'); i.style.cssText = 'display:inline-block;will-change:transform'; i.textContent = p; m.appendChild(i); frag.appendChild(m); words.push(i);
          });
          n.replaceChild(frag, c);
        } else if (c.nodeType === 1 && c.tagName !== 'BR' && !c.classList.contains('sr')) walk(c);
      });
    };
    walk(root); return words;
  };
  // a word slides up out of its mask at `at` and (optionally) leaves upward at `out`; driven by film time (absolute delays)
  E.reveal = (inner, at, out, dur = .6) => {
    const total = (out ? out + .32 : at + dur + 2) - at;
    const kf = [{ transform: 'translateY(112%)', offset: 0, easing: SPRING_CSS }, { transform: 'none', offset: Math.min(.99, dur / total) }];
    if (out) { kf.push({ transform: 'none', offset: Math.min(.995, (out - at) / total), easing: 'cubic-bezier(.7,0,.9,.5)' }); kf.push({ transform: 'translateY(-112%)', offset: 1 }); }
    else kf.push({ transform: 'none', offset: 1 });
    const a = inner.animate(kf, { duration: total * 1000, delay: at * 1000, fill: 'both' }); a.pause(); E.anims.push(a); return a;
  };
  // generic element animation driven by film time
  E.tween = (el, kf, at, dur, easing = SPRING_CSS) => { const a = el.animate(kf, { duration: dur * 1000, delay: at * 1000, fill: 'both', easing }); a.pause(); E.anims.push(a); return a; };

  // ---- one frame --------------------------------------------------------------------------------------------------------------------
  E.render = (t, frame) => {
    E.frame = frame || 0;
    E.anims.forEach((a) => { a.currentTime = t * 1000; });
    E.story.update(E, t);
    // grain: new random offset every output frame (deterministic by frame number)
    const gx = (E.frame * 97) % 192, gy = (E.frame * 61) % 192; E.grain.style.transform = `translate(${-gx}px,${-gy}px)`;
  };
  // the speed of the camera in screen px/s (used by the story to size the whip blur)
  E.camSpeed = (t) => { const d = 1 / 60, a = E.camAt(t - d), b = E.camAt(t + d); const z = (a.z + b.z) / 2; return { y: Math.abs(b.y - a.y) * z / (2 * d), x: Math.abs(b.x - a.x) * z / (2 * d), z: Math.abs(Math.log(b.z / a.z)) / (2 * d) }; };
})();
