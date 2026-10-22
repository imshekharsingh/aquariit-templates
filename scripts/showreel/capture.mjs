// Showreel capture (owner, 21 Oct 2026: "N styles, one reel" format). Plays our own live templates under a frame-exact clock
// (performance.now, Date.now, requestAnimationFrame, timers and every CSS animation/transition are stepped by hand), scrolls
// where a segment scrubs a pinned scene, and writes JPEG frames at 1080x1920 for compose.py.
// Usage: node scripts/showreel/capture.mjs <reel.json> <out dir> [--every N]   (--every N keeps one frame in N: quick stills)
import { createRequire } from 'module';
import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { execFileSync } from 'child_process';
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
  if (S.still) await p.emulateMedia({ reducedMotion: 'reduce' });   // 'without motion': the page's own reduced-motion version (before / after reels)
  // rev: play an older version of the page straight from git history (before / after reels; templates are single self-contained files)
  let page = S.page ? resolve(S.page.split('?')[0]) : resolve('templates', S.id, 'index.html');   // page: a scene made for the reel (scripts/showreel/scenes/)
  if (S.rev) { const d = resolve(out, '_rev', S.rev, S.id); mkdirSync(d, { recursive: true }); page = join(d, 'index.html');
    writeFileSync(page, execFileSync('git', ['show', `${S.rev}:templates/${S.id}/index.html`])); }
  await p.goto('file://' + page + (S.page && S.page.includes('?') ? '?' + S.page.split('?')[1] : ''));
  await p.evaluate(() => document.fonts && document.fonts.ready);
  await p.evaluate(() => { document.documentElement.classList.add('reel'); document.querySelectorAll('.bbar,.bar,header').forEach((e) => { if (e.matches('header,.bbar')) e.style.display = 'none'; }); });
  if (R.layout === 'crop' && S.hideText !== false) await p.addStyleTag({ content: 'main h1,main h2,main h3,main p,main .lede,main .row,main .cta,main .btn,main .kick,main .print,main .hero-foot,main .chs,main .card2,main .tl,main .meter,main .mhead,main .orbit,main .lab,main ol,main ul,main .head{visibility:hidden!important}' });
  const focus = [];
  const sel = S.scroll && S.scroll.sel, box = sel ? await p.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); return { t: r.top + scrollY, h: r.height }; }, sel) : null;
  const rate = S.rate || 1, dt = 1000 / FPS * rate, n = Math.round(S.dur * FPS) + 2 * PAD, t0 = (S.from || 0) * 1000 - PAD * dt;   // from = page time
  if (box) await p.evaluate(({ y }) => window.scrollTo(0, y), { y: box.t + S.scroll.q0 * (box.h - H) });   // settle at the scene's first scroll position first (no stale chapter text)
  // run the clock up to the segment's start (the page's own entrance plays out first), in coarse steps
  // (in short chunks with real pauses between, so IntersectionObservers and layout can catch up: scenes that only run while visible get to set their state)
  await p.waitForTimeout(300);
  for (let k = 0, T = Math.max(0, t0); k < T; k += 200) { await p.evaluate((d) => { for (let j = 0; j < d; j += 50) window.__step(50); }, Math.min(200, T - k)); await p.waitForTimeout(25); }
  for (let i = 0; i < n; i++) {
    if (box) { const u = Math.min(1, Math.max(0, (i - PAD) / Math.max(1, n - 2 * PAD - 1))), e = S.scroll.ease === 'linear' ? u : u * u * (3 - 2 * u), q = S.scroll.q0 + (S.scroll.q1 - S.scroll.q0) * e;
      await p.evaluate(({ y }) => window.scrollTo(0, y), { y: box.t + q * (box.h - H) }); }
    await p.evaluate((d) => window.__step(d), dt);
    if (S.focus) focus.push(await p.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }, S.focus));
    if (i % every === 0) await p.screenshot({ path: join(dir, String(i).padStart(4, '0') + '.jpg'), type: 'jpeg', quality: 92 });
  }
  if (S.focus) (await import('fs')).writeFileSync(join(dir, 'focus.json'), JSON.stringify(focus));
  await ctx.close(); console.log(`segment ${si} ${S.id}: ${n} frames`);
}
// overlays: one transparent label card per segment (Google font, rendered by the same Chromium); layout 'plain' = the scene draws its own labels
if (R.layout !== 'plain') { const ctx = await b.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 }), p = await ctx.newPage(), N = R.segments.length;
  for (let k = 0; k < N; k++) { const S = R.segments[k];
    // a compact lower-third panel: the progress bar (drawn by compose.py) sits on its top edge, so nothing of the site shows through behind the words
    const LY = R.labelY || 1310, L = R.layout || 'full', num = String(k + 1).padStart(2, '0'), tot = String(N).padStart(2, '0'), tag = S.tag;
    const css = L === 'device'
      ? `.n{position:absolute;left:72px;top:300px;font:700 40px/1 'Space Grotesk',sans-serif;color:rgba(255,255,255,.62);letter-spacing:.04em}.l{position:absolute;left:72px;top:356px;font:700 66px/1.05 'Space Grotesk',sans-serif;color:#fff;letter-spacing:-.02em}.s{position:absolute;left:74px;top:444px;font:500 36px/1 'Space Grotesk',sans-serif;color:rgba(255,255,255,.75)}`
      : L === 'crop'
      ? `.fade{position:absolute;left:0;right:0;top:${LY - 420}px;height:760px;background:linear-gradient(rgba(5,6,12,0),rgba(5,6,12,.78) 62%,rgba(5,6,12,.86))}.n{position:absolute;left:72px;top:${LY - 30}px;font:700 104px/1 'Space Grotesk',sans-serif;color:#fff;letter-spacing:-.03em}.l{position:absolute;left:72px;top:${LY + 86}px;font:700 62px/1.05 'Space Grotesk',sans-serif;color:#fff;letter-spacing:-.02em}.s{position:absolute;left:74px;top:${LY + 166}px;font:500 34px/1 'Space Grotesk',sans-serif;color:rgba(255,255,255,.78)}`
      : `.panel{position:absolute;left:60px;right:60px;top:${LY - 78}px;height:226px;border-radius:30px;background:rgba(9,10,18,.9);border:1.5px solid rgba(255,255,255,.12)}.tag{position:absolute;left:96px;top:${LY - 6}px;display:flex;align-items:center;gap:20px;font:600 50px/1 'Space Grotesk',sans-serif;color:#fff;white-space:nowrap}.tag .n{font:700 32px/1 'Space Grotesk',sans-serif;padding:9px 14px;border-radius:999px;background:#fff;color:#0a0b12}.s{position:absolute;left:98px;top:${LY + 76}px;font:500 34px/1 'Space Grotesk',sans-serif;color:rgba(255,255,255,.7)}`;
    const body = L === 'device' ? `<div class="n"${tag ? ` style="color:${S.tagColor || '#fff'}"` : ''}>${tag || num + ' / ' + tot}</div><div class="l">${S.label}</div><div class="s">${S.note || ''}</div>`
      : L === 'crop' ? `<div class="fade"></div><div class="n">${num}</div><div class="l">${S.label}</div><div class="s">${S.note || ''}</div>`
      : `<div class="panel"></div><div class="tag"><span class="n">${num}/${tot}</span>${S.label}</div><div class="s">${S.note || ''}</div>`;
    await p.setContent(`<html><head><link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet"><style>html,body{margin:0;background:transparent}${css}</style></head><body>${body}</body></html>`);
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
    await p.screenshot({ path: join(out, `overlay-${String(k + 1).padStart(2, '0')}.png`), omitBackground: true });
  }
  await ctx.close(); }
await b.close();
