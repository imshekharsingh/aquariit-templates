// Showreel capture (owner, 21 Oct 2026: "N styles, one reel" format). Plays our own live templates under a frame-exact clock
// (performance.now, Date.now, requestAnimationFrame, timers and every CSS animation/transition are stepped by hand), scrolls
// where a segment scrubs a pinned scene, and writes JPEG frames at 1080x1920 for compose.py.
// Usage: node scripts/showreel/capture.mjs <reel.json> <out dir> [--every N]   (--every N keeps one frame in N: quick stills)
import { createRequire } from 'module';
import { readFileSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';
const require = createRequire(process.env.PW_FROM || join(process.cwd(), 'node_modules/'));
const { chromium } = require('playwright');
const [cfgPath, out] = process.argv.slice(2), every = +(process.argv[process.argv.indexOf('--every') + 1] || 0) || 1;
const R = JSON.parse(readFileSync(cfgPath, 'utf8')), FPS = R.fps || 30, PAD = R.pad || 6, W = 402, H = 715, DSF = 1080 / W;
const SHIM = () => {
  let T = 0; const q = [], timers = []; let tid = 0;
  performance.now = () => T; const D0 = 1.76e12; Date.now = () => D0 + T;
  window.requestAnimationFrame = (cb) => { q.push(cb); return q.length; }; window.cancelAnimationFrame = () => {};
  window.setTimeout = (f, ms, ...a) => { timers.push({ id: ++tid, t: T + (+ms || 0), f, a }); return tid; };
  window.clearTimeout = (id) => { const x = timers.find((y) => y.id === id); if (x) x.done = 1; };
  window.setInterval = (f, ms, ...a) => { const id = ++tid; const run = { id, t: T + (+ms || 16), f, a, every: +ms || 16 }; timers.push(run); return id; };
  window.clearInterval = window.clearTimeout;
  window.__step = (dt) => {
    T += dt;
    for (const x of timers.slice()) if (!x.done && x.t <= T) { if (x.every) x.t += x.every; else x.done = 1; try { typeof x.f === 'function' && x.f(...x.a); } catch (e) {} }
    const cbs = q.splice(0); for (const cb of cbs) { try { cb(T); } catch (e) {} }
    for (const a of document.getAnimations()) {
      if (a.timeline !== document.timeline) continue;            // scroll-driven animations follow the scroll on their own
      if (a.__st == null) { a.__st = T - dt; a.pause(); }
      try { a.currentTime = T - a.__st; } catch (e) {}
    }
  };
};
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--hide-scrollbars'] });
let si = 0;
for (const S of R.segments) {
  si++; const dir = join(out, String(si).padStart(2, '0')); mkdirSync(dir, { recursive: true });
  const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: DSF });
  const p = await ctx.newPage(); await p.addInitScript(SHIM);
  await p.goto('file://' + resolve('templates', S.id, 'index.html'));
  await p.evaluate(() => document.fonts && document.fonts.ready);
  await p.evaluate(() => { document.documentElement.classList.add('reel'); document.querySelectorAll('.bbar,.bar,header').forEach((e) => { if (e.matches('header,.bbar')) e.style.display = 'none'; }); });
  const sel = S.scroll && S.scroll.sel, box = sel ? await p.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); return { t: r.top + scrollY, h: r.height }; }, sel) : null;
  const dt = 1000 / FPS, n = Math.round(S.dur * FPS) + 2 * PAD, t0 = (S.from || 0) * 1000 - PAD * dt;
  // run the clock up to the segment's start (the page's own entrance plays out first), in coarse steps
  await p.evaluate(({ t0 }) => { let k = 0; while (k < t0) { window.__step(Math.min(50, t0 - k)); k += 50; } }, { t0: Math.max(0, t0) });
  for (let i = 0; i < n; i++) {
    if (box) { const u = Math.min(1, Math.max(0, (i - PAD) / Math.max(1, n - 2 * PAD - 1))), e = S.scroll.ease === 'linear' ? u : u * u * (3 - 2 * u), q = S.scroll.q0 + (S.scroll.q1 - S.scroll.q0) * e;
      await p.evaluate(({ y }) => window.scrollTo(0, y), { y: box.t + q * (box.h - H) }); }
    await p.evaluate((d) => window.__step(d), dt);
    if (i % every === 0) await p.screenshot({ path: join(dir, String(i).padStart(4, '0') + '.jpg'), type: 'jpeg', quality: 92 });
  }
  await ctx.close(); console.log(`segment ${si} ${S.id}: ${n} frames`);
}
// overlays: one transparent label card per segment (Google font, rendered by the same Chromium)
{ const ctx = await b.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 }), p = await ctx.newPage(), N = R.segments.length;
  for (let k = 0; k < N; k++) { const S = R.segments[k];
    await p.setContent(`<html><head><link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet"><style>
      html,body{margin:0;background:transparent}.scrim{position:absolute;left:0;right:0;top:${(R.labelY || 1310) - 260}px;bottom:0;background:linear-gradient(rgba(5,6,12,0),rgba(5,6,12,.62) 38%,rgba(5,6,12,.78))}.tag{position:absolute;left:72px;top:${R.labelY || 1310}px;display:flex;align-items:center;gap:20px;padding:18px 34px 18px 18px;border-radius:999px;
      background:rgba(8,9,16,.78);border:1.5px solid rgba(255,255,255,.16);font:600 50px/1 'Space Grotesk',sans-serif;color:#fff;letter-spacing:-.01em}
      .n{font:700 34px/1 'Space Grotesk',sans-serif;padding:10px 14px;border-radius:999px;background:#fff;color:#0a0b12;letter-spacing:.02em}
      .note{position:absolute;left:78px;top:${(R.labelY || 1310) + 112}px;font:500 36px/1 'Space Grotesk',sans-serif;color:rgba(255,255,255,.88);text-shadow:0 2px 10px rgba(0,0,0,.6);letter-spacing:.01em}
      </style></head><body><div class="scrim"></div><div class="tag"><span class="n">${String(k + 1).padStart(2, '0')}/${String(N).padStart(2, '0')}</span>${S.label}</div><div class="note">${S.note || ''}</div></body></html>`);
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
    await p.screenshot({ path: join(out, `overlay-${String(k + 1).padStart(2, '0')}.png`), omitBackground: true });
  }
  await ctx.close(); }
await b.close();
