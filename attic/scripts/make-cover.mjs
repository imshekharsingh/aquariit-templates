// Cover preview: screenshots a template's first screen (402×715, <html class="reel">, after its entrance animations)
// into templates/covers/ID.jpg. The ▶ player shows it on the opening cover card, which becomes the first frame of the recording.
// Usage: node scripts/make-cover.mjs [ID ...] [--all]       (defaults to the newest template)
// Needs Playwright + Chromium (present in the cloud sessions; not part of `npm run check`, which only checks the file exists).
import { createServer } from 'node:http';
import { readFileSync, existsSync, readdirSync, mkdirSync, statSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = join(dirname(fileURLToPath(import.meta.url)), '..'), T = join(root, 'templates');
const args = process.argv.slice(2);
const log = JSON.parse(readFileSync(join(root, 'design-log.json'), 'utf8')), all = log.map((e) => e.id || e.date).sort();
const ids = args.includes('--all') ? all : args.filter((a) => !a.startsWith('--')).length ? args.filter((a) => !a.startsWith('--')) : all.slice(-1);
if (!ids.length) { console.error('No templates.'); process.exit(0); }

const require = createRequire(import.meta.url);
let pw;
for (const p of ['playwright', '/opt/node-tools/node_modules/playwright', '/opt/node-tools/node_modules/playwright-core']) { try { pw = require(p); break; } catch { /* next */ } }
if (!pw) { console.error('Playwright not found: cannot make the cover image.'); process.exit(1); }
const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
const exe = existsSync(base) ? readdirSync(base).filter((d) => d.startsWith('chromium-')).map((d) => join(base, d, 'chrome-linux', 'chrome')).find(existsSync) : undefined;

const types = { '.html': 'text/html', '.json': 'application/json', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webmanifest': 'application/json' };
const server = createServer((q, r) => {
  let p = decodeURIComponent(q.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const f = join(T, p); if (!f.startsWith(T) || !existsSync(f)) { r.statusCode = 404; return r.end(); }
  r.setHeader('content-type', types[extname(f)] || 'application/octet-stream'); r.end(readFileSync(f));
});
await new Promise((ok) => server.listen(0, ok));
const port = server.address().port, out = join(T, 'covers'); mkdirSync(out, { recursive: true });
const browser = await pw.chromium.launch(exe ? { executablePath: exe } : {});
for (const id of ids) {
  const page = await browser.newPage({ viewport: { width: 402, height: 715 }, deviceScaleFactor: 2 });
  await page.goto(`http://localhost:${port}/${id}/`); await page.waitForTimeout(500);
  await page.evaluate(() => { document.documentElement.classList.add('reel'); document.querySelectorAll('a[href="/"]').forEach((a) => { if (/All templates/i.test(a.textContent)) a.style.setProperty('display', 'none', 'important'); }); });
  await page.waitForTimeout(4500); // let the entrance animations finish: the cover must show a finished hero
  const file = join(out, `${id}.jpg`);
  await page.screenshot({ path: file, type: 'jpeg', quality: 80 });
  console.log(`${id}: ${file} (${Math.round(statSync(file).size / 1024)} KB)`);
  await page.close();
}
await browser.close(); server.close();
