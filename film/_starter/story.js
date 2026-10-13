// STARTER story: a generic "auto-director" that works on a simple vertical page and is meant to be COPIED to film/ID/story.js and then bent to the template's own concept
// (what is the signature moment? what should the camera do with it? see design/film-playbook.md and film/2026-10-13-0851/story.js for a fully bespoke film).
// Timeline (fixed so the music brief in timing.json stays valid): 0-2 s hook words on a flat accent colour, hard cut to the page at 2.0, hero push to 4.0, up to 5 shots 4.0-12.0
// (alternating whip / hard cut on the beat), breath 12.0-12.6, closing shot with the impact at 14.0, iris wipe from its button 17.0-17.8 into flat accent = the first frame (loop).
(function () {
  const E = window.FilmEngine, T = window.FILM_T, KIT = window.FILM_KIT || {}, { clamp, lerp, ease, W, H } = E, $ = E.$, $$ = E.$$, S = (E.story = {});
  S.selfStage = true;                                                                 // setup() stages the page itself (after the scroll that reveals everything)
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms)), snap = (t) => Math.round(t * 2) / 2;
  const lum = (c) => { const m = c.match(/[\d.]+/g).map(Number); return (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / 255; };
  const sat = (c) => { const m = c.match(/[\d.]+/g).map(Number), mx = Math.max(...m.slice(0, 3)), mn = Math.min(...m.slice(0, 3)); return mx ? (mx - mn) / mx : 0; };

  S.setup = async function () {
    document.documentElement.classList.add('reel');                                  // the pages' own reel rules (hide the back link, zero safe areas)
    // 1. let the page reveal everything it reveals on scroll, then settle: finite animations finish, endless ones rest at 0 (deterministic)
    E.el('style', null, document.head, '*,*::before,*::after{transition:none!important}');   // class changes from the page's scroll observers must apply instantly, never in real time
    const total = document.documentElement.scrollHeight; for (let y = 0; y <= total; y += 200) { window.scrollTo(0, y); await sleep(70); } window.scrollTo(0, 0); await sleep(700);
    document.getAnimations().forEach((a) => { try { if (a.timeline !== document.timeline) { a.finish(); return; }   // scroll-/view-driven (e.g. text that fills as you scroll): rest at the END, the revealed state
      const e = a.effect.getComputedTiming().endTime; if (isFinite(e)) a.finish(); else { a.pause(); a.currentTime = 0; } } catch (e2) { /* ignore */ } });
    E.el('style', null, document.head, `a[href="/"],.back{display:none!important} *{scroll-behavior:auto!important} header,nav,.bar{position:absolute!important}`);
    // 2. brand accent: the most saturated solid button/link background; the hook text; contrast ink for the flat field
    let accent = T.accent || '', best = 0;
    if (!accent) $$('a,button').forEach((e) => { const bg = getComputedStyle(e).backgroundColor; if (!bg || /rgba\(0, 0, 0, 0\)|transparent/.test(bg)) return; const sv = sat(bg); if (sv > best) { best = sv; accent = bg; } });
    if (!accent) accent = '#ff5a1f';
    const ink = (() => { try { const d = E.el('div', `color:${accent}`, document.body); const l = lum(getComputedStyle(d).color); d.remove(); return l > 0.55 ? '#111' : '#fff'; } catch (e2) { return '#111'; } })();
    const h1 = $('h1') || $('h2'), hook = (T.hook || KIT.hook || (h1 && h1.textContent) || 'Watch this').replace(/\s+/g, ' ').trim();
    E.stage();
    // 3. shots from the page's own blocks ([data-reel-stop] if present, else sections' children), grouped like the ▶ player does (<= 560 px tall)
    const raw = $$('[data-reel-stop]').length ? $$('[data-reel-stop]') : $$('main > section, main > section > *, main > section .wrap > *');
    let blocks = E.measure(() => raw.map((e) => ({ e, r: E.rect(e) })).filter((b) => b.r.h > 30 && b.r.w > 120 && b.r.y >= 0)).sort((a, b) => a.r.y - b.r.y || a.r.h - b.r.h);
    blocks = blocks.filter((b, i) => !blocks.slice(0, i).some((p) => b.r.y >= p.r.y - 2 && b.r.b <= p.r.b + 2 && p.r.h > b.r.h * 1.4 && p.e.contains(b.e) && false));
    const groups = []; blocks.forEach((b) => { const g = groups[groups.length - 1]; if (g && b.r.b - g.y <= 560 && b.r.y - g.b < 80) { g.blocks.push(b); g.b = Math.max(g.b, b.r.b); } else groups.push({ y: b.r.y, b: b.r.b, blocks: [b] }); });
    const hero = groups[0], last = groups[groups.length - 1], mids = groups.slice(1, -1), pick = mids.length <= 5 ? mids : Array.from({ length: 5 }, (_, i) => mids[Math.round(i * (mids.length - 1) / 4)]);
    const zFor = (g) => { const h = g.b - g.y, w = Math.max(...g.blocks.map((b) => b.r.w)); return clamp(Math.min(560 / h, 402 / w * 0.98), 0.8, 1.12); };
    const cyFor = (g, z) => g.y + (g.b - g.y) / 2 + 28 / z;
    // 4. camera keys + entrance tweens + sound cues
    const K = [], cues = [], k = (t, x, y, z, o = {}) => K.push(Object.assign({ t, x, y, z }, o)), hc = T.hookCut;
    const cut = (t, g) => { const z = zFor(g); k(t, 201, cyFor(g, z), z); };
    k(0, 201, hero.y + (H / 2 - 118), 1.0); k(hc, 201, hero.y + (H / 2 - 118), 1.0); k(4.0, 201, hero.y + (H / 2 - 118) + 20, 1.05, { e: 'io3' });
    const slot = pick.length ? snap(8 / pick.length) || 1 : 0; let t = 4.0;
    pick.forEach((g, i) => {
      const z = zFor(g), cy = cyFor(g, z), whip = i % 2 === 0, t0 = snap(4.0 + i * (8 / pick.length)), t1 = snap(4.0 + (i + 1) * (8 / pick.length));
      if (whip) { k(t0 - 0.0, 201, K[K.length - 1].y, K[K.length - 1].z); k(t0 + 0.3, 201, cy, z, { e: 'io3', ry: i % 4 === 0 ? -4 : 4, rx: 2 }); cues.push({ k: 'whoosh', t0: t0 - 0.05, t1: t0 + 0.3, g: 0.45, tail: 0.2 }); }
      else { k(t0, 201, cy, z, { ry: 0, rx: 0 }); cues.push({ k: 'impact', t: t0, g: 0.5 }); }
      k(t1, 201, cy + 8, z * 1.05, { e: 'lin', ry: 0, rx: 0 });
      g.blocks.forEach((b, j) => { const at = t0 + (whip ? 0.3 : 0.05) + j * 0.1; E.tween(b.e, [{ opacity: 0, translate: '0 36px', scale: 0.97 }, { opacity: 1, translate: '0 0', scale: 1 }], at, 0.7, E.SPRING_CSS, 'backwards'); if (j < 3) cues.push({ k: 'click', t: at, g: 0.35 }); });
    });
    const zl = zFor(last), cyl = cyFor(last, zl), tl = 14.0;
    k(12.0, 201, K[K.length - 1].y, K[K.length - 1].z, { e: 'lin' }); k(tl - 0.25, 201, K[K.length - 1].y, K[K.length - 1].z * 1.06, { e: 'in2' });
    k(tl, 201, cyl, zl, { ry: -6, rx: 3 }); k(17.0, 201, cyl + 6, zl * 1.05, { e: 'out3', ry: 0, rx: 0 });
    last.blocks.forEach((b, j) => E.tween(b.e, [{ opacity: 0, translate: '0 40px', scale: 0.96 }, { opacity: 1, translate: '0 0', scale: 1 }], tl + 0.1 + j * 0.15, 0.8, E.SPRING_CSS, 'backwards'));
    E.keys = K;
    const btn = last.blocks.map((b) => b.e).flatMap((e) => [...e.querySelectorAll('a,button'), e]).filter((e) => e.matches('a,button')).sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width)[0];
    const br = btn ? E.measure(() => E.rect(btn)) : { cx: 201, cy: last.y + (last.b - last.y) / 2 };
    E.irisAt = { x: 201 + (br.cx - 201) * zl * 1.05, y: H / 2 + (br.cy - cyl) * zl * 1.05 };
    // 5. the hook: words slam in on the beats on a flat accent field, then a hard cut to the page
    const font = h1 ? getComputedStyle(h1) : { fontFamily: 'system-ui', fontWeight: 900 };
    const card = E.el('div', `position:absolute;left:30px;top:140px;width:342px;color:${ink};font-family:${font.fontFamily};font-weight:${Math.max(700, +font.fontWeight || 800)};font-size:60px;line-height:.98;letter-spacing:-.035em;text-wrap:balance`, E.cards, hook);
    const words = E.splitWords(card), per = Math.ceil(words.length / 4);
    const widest = Math.max(...words.map((w) => w.getBoundingClientRect().width)); if (widest > 342) card.style.fontSize = Math.floor(60 * 342 / widest) + 'px';   // wide display fonts: shrink until the widest word fits the 30 px gutters
    words.forEach((w, i) => { const at = Math.floor(i / per) * 0.5 - 0.1; E.reveal(w, at, null, 0.55); if (i % per === 0) cues.push({ k: 'click', t: Math.max(0.02, at + 0.1), g: 0.45 }); });
    E.hookCard = card; E.accent = accent; S._cues = cues.concat([
      { k: 'whoosh', t0: hc - 0.35, t1: hc, g: 0.3 }, { k: 'impact', t: hc, g: 0.5 }, { k: 'riser', t0: 12.8, t1: 14.0, g: 0.5 }, { k: 'sub', t0: 12.6, t1: 13.1, g: 0.1 },
      { k: 'impact', t: 14.0, g: 1.4, big: 2 }, { k: 'sparkle', t: 14.4, g: 0.25 }, { k: 'whoosh', t0: 16.9, t1: 17.8, g: 0.45 }]);
    return { shots: pick.length, hero: !!hero, last: !!last, accent, hook };
  };
  S.cues = () => S._cues || [];
  S.update = function (E, t) {
    const c = E.camAt(t), sp = E.camSpeed(t); E.applyCam(c, clamp((sp.y - 1500) * 0.012, 0, 34));
    const hc = T.hookCut; let fo = 0, clip = 'none';
    if (t < hc) fo = 1;
    if (t >= T.iris[0]) { fo = 1; clip = `circle(${lerp(0, 760, ease.io3(clamp((t - T.iris[0]) / (T.iris[1] - T.iris[0])))).toFixed(1)}px at ${E.irisAt.x}px ${E.irisAt.y}px)`; }
    E.field.style.opacity = fo; E.field.style.background = E.accent; E.field.style.clipPath = clip; E.hookCard.style.display = t < hc ? 'block' : 'none';
    let v = 0.4; if (t >= 12 && t < 14) v = lerp(0.4, 0.85, ease.outX(clamp((t - 12) / 1.2))); E.vig.style.opacity = v;
  };
})();
