// Preflight for a kit scene (Mandatory Gate items 3, 4, 6, 14-17): the repo's own layout and FLOW checkers (scripts/showreel/layout.mjs,
// flow.mjs) run on the kit scene. Text boxes every 0.5 s (DOM text + the canvas labels the scene reports in window.__boxes), the frame every
// 0.1 s for FLOW, the captions read at chapter times, and one stills sheet (a still at every chapter's key moment).
// Usage: node techkit/preflight.mjs <out dir with scene.html + timeline.js> <sheet times comma list>
import { resolve, join } from 'node:path';
import { createRequire } from 'node:module';
import { collectDom, judge } from '../scripts/showreel/layout.mjs';
import { sample, judgeFlow } from '../scripts/showreel/flow.mjs';
const req = createRequire(import.meta.url);
let pw; try { pw = req('playwright'); } catch { pw = req('playwright-core'); }

const [dir, times] = process.argv.slice(2);
const opt = { args: ['--force-color-profile=srgb', '--hide-scrollbars'] }; if (process.env.CHROME_BIN) opt.executablePath = process.env.CHROME_BIN;
const b = await pw.chromium.launch(opt), p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
const errs = []; p.on('pageerror', (e) => errs.push(e.message));
await p.goto('file://' + resolve(dir, 'scene.html')); await p.evaluate(() => document.fonts.ready);
const total = await p.evaluate(() => window.TL.total);
// layout every 0.5 s
const frames = [];
for (let t = 0; t <= total - .1; t += .5) { await p.evaluate((x) => window.render(x), t); frames.push({ t, ...(await p.evaluate(collectDom)) }); }
const L = judge(frames, false);
// captions: every spoken word shown (each chunk's text read on screen at its middle)
const caps = await p.evaluate(() => { const out = []; for (const c of window.CHUNKS) { const m = (c.t0 + c.t1) / 2; window.render(m); const fe = document.querySelector('#final'), cap = document.querySelector('#caps').textContent.replace(/\s+/g, ' ').trim(); out.push([+m.toFixed(2), cap || (fe && +getComputedStyle(fe).opacity > .5 ? fe.querySelector('.t1').textContent : ''), c.words.map((w) => w.w).join(' ')]); } return out; });
const missing = caps.filter(([, got, want]) => got.replace(/…/g, '...').replace(/\s/g, '').toLowerCase() !== want.replace(/\s/g, '').toLowerCase());
// FLOW: the viewport shrunk to 54x96 inside sample()
const s = await sample(p, total); const F = judgeFlow(s, 'tech');
// stills sheet
const sh = []; for (const t of (times || '').split(',').filter(Boolean)) { await p.evaluate((x) => window.render(x), +t); sh.push((await p.screenshot({ type: 'jpeg', quality: 80 })).toString('base64')); }
if (sh.length) {
  const html = `<body style="margin:0;background:#111;display:flex;flex-wrap:wrap;width:${Math.min(sh.length, 5) * 270}px">${sh.map((x, i) => `<div style="position:relative"><img src="data:image/jpeg;base64,${x}" width="270" height="480"><span style="position:absolute;left:6px;top:4px;color:#fff;font:12px sans-serif;background:#000a;padding:2px 4px">${times.split(',')[i]} s</span></div>`).join('')}</body>`;
  const q = await b.newPage({ viewport: { width: Math.min(sh.length, 5) * 270, height: Math.ceil(sh.length / 5) * 480 } }); await q.setContent(html); await q.screenshot({ path: join(dir, 'stills.png') });
}
await b.close();
const lines = [...L.lines.filter((l) => /^(SAFE ZONE|OVERLAP|SUBTITLES)/.test(l)), `CAPTIONS: ${caps.length} chunks, ${missing.length ? 'MISSING ' + missing.map((m) => m[0] + ' s "' + m[2] + '"').join(' | ') : 'every spoken word shown'}`, ...F.lines, `PAGE ERRORS: ${errs.length ? errs.join(' | ') : 'none'}`];
console.log(lines.join('\n'));
const bad = (L.lines.some((l) => /^SAFE ZONE: (?!ok)|^OVERLAP: (?!none)/.test(l)) ? 1 : 0) + missing.length + F.bad + errs.length;
process.exit(bad ? 1 : 0);
