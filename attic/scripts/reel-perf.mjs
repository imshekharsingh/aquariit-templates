// Reel smoothness check: plays a template through the real ▶ player at 402×874 under a simulated slower phone (CPU 4×)
// and measures how evenly the page scrolls. Usage: node scripts/reel-perf.mjs [ID ...] [--cpu 4]   (default: newest template)
// "irregular" = a moving frame whose step is >40% off its neighbours (visible judder). Aim for < 3% and no long frames.
import { createServer } from 'node:http';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = join(dirname(fileURLToPath(import.meta.url)), '..'), T = join(root, 'templates');
const args = process.argv.slice(2), ci = args.indexOf('--cpu'), CPU = ci > -1 ? +args[ci + 1] : 4, LEN = 12;
let ids = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--cpu');
if (!ids.length) { const log = JSON.parse(readFileSync(join(root, 'design-log.json'), 'utf8')); ids = log.length ? [log.map((e) => e.id || e.date).sort().reverse()[0]] : []; }
if (!ids.length) process.exit(0);
const require = createRequire(import.meta.url);
let pw; for (const p of ['playwright', '/opt/node-tools/node_modules/playwright', '/opt/node-tools/node_modules/playwright-core']) { try { pw = require(p); break; } catch { /* next */ } }
if (!pw) { console.error('Playwright not found: skipping the smoothness check.'); process.exit(0); }
const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
const exe = existsSync(base) ? readdirSync(base).filter((d) => d.startsWith('chromium-')).map((d) => join(base, d, 'chrome-linux', 'chrome')).find(existsSync) : undefined;
const types = { '.html': 'text/html', '.json': 'application/json', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webmanifest': 'application/json' };
const server = createServer((q, r) => { let p = decodeURIComponent(q.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html'; const f = join(T, p); if (!f.startsWith(T) || !existsSync(f)) { r.statusCode = 404; return r.end(); } r.setHeader('content-type', types[extname(f)] || 'application/octet-stream'); r.end(readFileSync(f)); });
await new Promise((ok) => server.listen(0, ok));
const browser = await pw.chromium.launch({ ...(exe ? { executablePath: exe } : {}), args: ['--autoplay-policy=no-user-gesture-required'] });
let bad = 0;
for (const id of ids) {
  const ctx = await browser.newContext({ viewport: { width: 402, height: 874 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 }); const pg = await ctx.newPage();
  await pg.addInitScript((len) => localStorage.setItem('reel.settings', JSON.stringify({ len, music: 'auto', frame: 'auto', hideBack: true })), LEN);
  await pg.goto(`http://localhost:${server.address().port}/index.html`); await pg.waitForTimeout(600);
  const cdp = await ctx.newCDPSession(pg); await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU });
  await pg.evaluate(() => { window.__fr = []; window.__on = false; (function f(t) { if (window.__on) { let y = null; try { y = -document.querySelector('#reel iframe').contentDocument.querySelector('main').getBoundingClientRect().top; } catch (e) {} window.__fr.push([t, y]); } requestAnimationFrame(f); })(0); });
  await pg.evaluate((i) => window.Reel.start(i), id);
  const t0 = Date.now(); let done = false;
  while (Date.now() - t0 < 45000) { await pg.waitForTimeout(300); const s = await pg.evaluate(() => ({ run: document.querySelector('#reel .cd').classList.contains('off'), done: document.querySelector('#reel .done').classList.contains('on') })); if (s.run) await pg.evaluate(() => { window.__on = true; }); if (s.done) { done = true; break; } }
  const fr = await pg.evaluate(() => window.__fr); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  const dys = []; for (let i = 1; i < fr.length; i++) if (fr[i][1] != null && fr[i - 1][1] != null) dys.push(fr[i][1] - fr[i - 1][1]);
  let moving = 0, irregular = 0;
  for (let i = 3; i < dys.length - 3; i++) { const w = dys.slice(i - 3, i + 4).sort((a, b) => a - b), med = w[3]; if (med < 2.5) continue; moving++; if (Math.abs(dys[i] - med) > .4 * med) irregular++; }
  const dts = []; for (let i = 1; i < fr.length; i++) dts.push(fr[i][0] - fr[i - 1][0]); const long = dts.filter((d) => d > 25).length, pct = moving ? 100 * irregular / moving : 0;
  const ok = done && pct < 3 && long <= Math.max(2, dts.length * .01); if (!ok) bad++;
  console.log(`${ok ? 'smooth ' : 'CHECK  '} ${id} @ CPU ${CPU}x: ${moving} moving frames, ${pct.toFixed(1)}% irregular, ${long} long frames (>25 ms)${done ? '' : ', DID NOT FINISH'}`);
  await ctx.close();
}
await browser.close(); server.close();
console.log(bad ? '\nSomething looks uneven. Likely causes: animated blur/box-shadow/filter, big canvas work every frame, huge DOM, or heavy JS on scroll. Simplify and re-run.' : '\nScrolling is smooth.');
