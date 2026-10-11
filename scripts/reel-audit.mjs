// Reel audit: plans the ▶ player's scroll for a template at the iPhone Reel frame (402×715, <html class="reel">),
// reports every pause where the frame's bottom edge would cut a content block in half, and screenshots each pause.
// Usage: node scripts/reel-audit.mjs [ID ...] [--len 30]        (defaults to the newest template)
// Needs Playwright + Chromium (present in the cloud sessions; not part of `npm run check`).
import { createServer } from 'node:http';
import { readFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';

const root = join(dirname(fileURLToPath(import.meta.url)), '..'), T = join(root, 'templates');
const args = process.argv.slice(2), li = args.indexOf('--len');
const LEN = li > -1 ? +args[li + 1] : 30;
let ids = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--len');
if (!ids.length) {
  const log = JSON.parse(readFileSync(join(root, 'design-log.json'), 'utf8'));
  ids = log.length ? [log.map((e) => e.id || e.date).sort().reverse()[0]] : [];
}
if (!ids.length) { console.error('No templates to audit.'); process.exit(0); }

const require = createRequire(import.meta.url);
let pw;
for (const p of ['playwright', '/opt/node-tools/node_modules/playwright', '/opt/node-tools/node_modules/playwright-core']) { try { pw = require(p); break; } catch { /* next */ } }
if (!pw) { console.error('Playwright not found: skipping the reel audit (look at the template at 402×715 yourself).'); process.exit(0); }
const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
const exe = existsSync(base) ? readdirSync(base).filter((d) => d.startsWith('chromium-')).map((d) => join(base, d, 'chrome-linux', 'chrome')).find(existsSync) : undefined;

const types = { '.html': 'text/html', '.json': 'application/json', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webmanifest': 'application/json' };
const server = createServer((q, r) => {
  let p = decodeURIComponent(q.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const f = join(T, p); if (!f.startsWith(T) || !existsSync(f)) { r.statusCode = 404; return r.end(); }
  r.setHeader('content-type', types[extname(f)] || 'application/octet-stream'); r.end(readFileSync(f));
});
await new Promise((ok) => server.listen(0, ok));
const port = server.address().port, out = join(tmpdir(), 'reel-audit'); mkdirSync(out, { recursive: true });
const browser = await pw.chromium.launch(exe ? { executablePath: exe } : {});
let warn = 0, sideWarn = 0;
for (const id of ids) {
  const page = await browser.newPage({ viewport: { width: 402, height: 715 }, deviceScaleFactor: 2 });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(`http://localhost:${port}/${id}/`); await page.waitForTimeout(1200);
  await page.evaluate(() => { document.documentElement.classList.add('reel'); document.querySelectorAll('a[href="/"]').forEach((a) => { if (/All templates/i.test(a.textContent)) a.style.setProperty('display', 'none', 'important'); }); }); // same as the player
  await page.addScriptTag({ path: join(T, 'play', 'player.js') }); await page.waitForTimeout(300);
  const plan = await page.evaluate((len) => { const p = window.Reel._plan(window, document, len); return { points: p.points, max: p.max, barH: p.barH, blocks: p.blocks, report: p.report, overflowX: document.documentElement.scrollWidth - innerWidth }; }, LEN);
  console.log(`\n== ${id} @402x715  length ${LEN}s  page height ${plan.max + 715}px  header ${Math.round(plan.barH)}px  blocks ${plan.blocks}  pauses ${plan.report.length}`);
  plan.report.forEach((r, i) => {
    const und = i === 0 ? [] : (r.under || []); const bad = r.sliced.length + und.length; warn += bad; // a block half-hidden under the header is a cut too
    console.log(`  ${String(i).padStart(2)}  y=${String(Math.round(r.y)).padStart(5)}  ${bad ? '' : 'clean'}${r.sliced.length ? 'CUTS at bottom: ' + r.sliced.join(' | ') : ''}${und.length ? (r.sliced.length ? '   ' : '') + 'CUTS under header: ' + und.join(' | ') : ''}`);
  });
  // Side safety: Instagram fills its (taller) preview/feed area with the 9:16 video, which scales it ~7-11% and crops ~14-20 css px off each side.
  // Text must stay >= SIDE px from the sides, small markers/icons/buttons >= EDGE px. Decoration that is meant to bleed: aria-hidden or data-reel-bleed.
  const SIDE = 26, EDGE = 18; let sideBad = 0;
  for (let i = 0; i < plan.report.length; i++) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), plan.report[i].y); await page.waitForTimeout(900);
    await page.screenshot({ path: join(out, `${id}-${String(i).padStart(2, "0")}.png`) });
    const tight = await page.evaluate(({ SIDE, EDGE, barH }) => {
      const W = innerWidth, H = innerHeight, out = [];
      const hid = (e) => { for (let n = e; n && n !== document.body; n = n.parentElement) { if (n.getAttribute && (n.getAttribute('aria-hidden') === 'true' || n.hasAttribute('data-reel-bleed'))) return true; const cs = getComputedStyle(n); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) return true; } return false; };
      const inFrame = (r) => r.width > 1 && r.height > 1 && r.bottom > barH + 4 && r.top < H - 4;
      const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (tw.nextNode()) {
        const n = tw.currentNode; if (!n.nodeValue.trim()) continue; const el = n.parentElement; if (!el || /^(SCRIPT|STYLE)$/.test(el.tagName) || hid(el)) continue;
        const rg = document.createRange(); rg.selectNodeContents(n);
        for (const r of rg.getClientRects()) { if (!inFrame(r)) continue; if (r.left < SIDE - 0.5 || r.right > W - SIDE + 0.5) { out.push(`text "${n.nodeValue.trim().slice(0, 26)}" ${r.left < SIDE ? 'left ' + Math.round(r.left) : 'right ' + Math.round(W - r.right)}px`); break; } }
      }
      document.querySelectorAll('button,a,svg,img,i,b,span,div').forEach((e) => {
        const r = e.getBoundingClientRect(); if (!inFrame(r) || r.width > 150 || r.height > 60 || hid(e)) return;
        const cs = getComputedStyle(e), ink = e.tagName === 'SVG' || e.tagName === 'IMG' || +cs.borderTopWidth > 0 || (cs.backgroundColor && !/rgba\(.*, 0\)|transparent/.test(cs.backgroundColor)) || cs.backgroundImage !== 'none';
        if (!ink) return;
        if (r.left < EDGE - 0.5 || r.right > W - EDGE + 0.5) out.push(`marker/box ${e.tagName.toLowerCase()}${e.className && typeof e.className === 'string' ? '.' + e.className.split(' ')[0] : ''} ${r.left < EDGE ? 'left ' + Math.round(r.left) : 'right ' + Math.round(W - r.right)}px`);
      });
      return [...new Set(out)].slice(0, 5);
    }, { SIDE, EDGE, barH: plan.barH });
    if (tight.length) { sideBad += tight.length; console.log(`  ${String(i).padStart(2)}  SIDE-TIGHT (Instagram may crop): ${tight.join(' | ')}`); }
  }
  if (sideBad) console.log(`  side safety: ${sideBad} item(s) closer than ${SIDE}px (text) / ${EDGE}px (icons, buttons) to a side. Inset them, or mark pure decoration aria-hidden / data-reel-bleed.`); else console.log(`  side safety: OK (text >= ${SIDE}px, icons/buttons >= ${EDGE}px from the sides)`);
  sideWarn += sideBad;
  if (errs.length) { warn += errs.length; console.log('  JS errors:', errs.join(' | ')); }
  console.log(`  screenshots: ${join(out, id)}-NN.png  (open them and check every pause looks like a finished frame)`);
  await page.close();
}
await browser.close(); server.close();
console.log(warn ? `\n${warn} thing(s) to look at: restructure those blocks (smaller blocks, gaps between them) or pin pauses with data-reel-stop.` : '\nAll pauses are clean.');
if (sideWarn) console.log(`${sideWarn} side-safety item(s) to inset (see SIDE-TIGHT lines).`);
