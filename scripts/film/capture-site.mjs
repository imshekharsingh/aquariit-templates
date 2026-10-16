// Capture the template's real page at desktop, tablet and phone widths for a film (owner, 16 Oct 2026: show the real site we built, never placeholder blocks).
//   node scripts/film/capture-site.mjs ID      -> film/ID/assets/{desk,tab,phone}.jpg (small JPEGs, about 90 KB each; the "All templates" link is hidden)
// In story.js: <img src="../../film/ID/assets/desk.jpg"> inside a device frame (see film/2026-10-16-0850/story.js "the real bakery site at three widths").
import { mkdirSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..'), id = process.argv[2];
if (!id || !existsSync(join(root, 'templates', id, 'index.html'))) { console.error('usage: node scripts/film/capture-site.mjs ID (needs templates/ID/index.html)'); process.exit(2); }
const require = createRequire(import.meta.url);
let pw; for (const p of ['playwright', '/opt/node-tools/node_modules/playwright']) { try { pw = require(p); break; } catch { /* next */ } }
if (!pw) { console.error('Playwright not found.'); process.exit(2); }
const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
const exe = existsSync(base) ? readdirSync(base).filter((d) => d.startsWith('chromium-')).map((d) => join(base, d, 'chrome-linux', 'chrome')).find(existsSync) : undefined;
const out = join(root, 'film', id, 'assets'); mkdirSync(out, { recursive: true });
const url = pathToFileURL(join(root, 'templates', id, 'index.html')).href;
const shots = [['desk', 1280, 800, 1, 700], ['tab', 820, 1180, 1, 420], ['phone', 402, 874, 2, 300]];   // name, viewport w, h, scale, saved width
const browser = await pw.chromium.launch(exe ? { executablePath: exe } : {});
for (const [n, w, h, s, keep] of shots) {
  const pg = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: s, reducedMotion: 'reduce' });
  await pg.goto(url, { waitUntil: 'networkidle' }); await pg.waitForTimeout(2500);
  await pg.addStyleTag({ content: '.back,a[href="/"]{visibility:hidden!important}' });
  const full = await pg.evaluate(() => document.body.scrollHeight), tmp = join(out, `${n}.png`), dst = join(out, `${n}.jpg`);
  await pg.screenshot({ path: tmp, fullPage: true, clip: { x: 0, y: 0, width: w, height: Math.min(Math.round(h * 2.2), full) } });
  await pg.close();
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', tmp, '-vf', `scale=${keep}:-2:flags=lanczos`, '-q:v', '4', dst]);
  spawnSync('rm', ['-f', tmp]); console.log(r.status === 0 ? `wrote ${dst}` : `ffmpeg failed for ${n}`);
}
await browser.close();
