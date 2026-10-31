// Channel 3 pilot check before a render (CLAUDE.md, "Channel 3 pilots"): seeks the scene every 0.1 s and reports any text drawn past
// the frame's 12 px side margins or above 70 px / below 750 px (Instagram's top bar and caption zone), page errors, and whether the
// scripted outcome held (window.OUTCOME.ok, for the physics pilots). The scenes record each text box they draw (window.__boxes).
// Usage: node scripts/channel3/qa.mjs scripts/channel3/<slug>.json   (exit 1 on any problem)
import { readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createRequire } from 'node:module';
const { chromium } = createRequire(process.env.PW_FROM || join(process.cwd(), 'node_modules/'))('playwright');
const cfg = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 540, height: 960 } }), errors = [];
p.on('pageerror', (e) => errors.push(e.message));
await p.goto('file://' + resolve(cfg.seek)); await p.waitForSelector('html[data-ready]', { timeout: 60000 });
const seen = new Map();
for (let t = 0; t <= cfg.dur; t = +(t + .1).toFixed(2)) {
  const boxes = await p.evaluate((t) => { window.seek(t); return window.__boxes(); }, t);
  for (const [s, l, r, top, bot] of boxes) {
    if (r < 0 || l > 540 || bot < 0 || top > 960) continue;   // wholly off screen (a ball that fell out of view): not seen, not cut
    const m = l < 12 || r > 528 ? `"${s}" spans ${Math.round(l)}-${Math.round(r)} px across` : top < 70 || bot > 750 ? `"${s}" sits at ${Math.round(top)}-${Math.round(bot)} px down` : '';
    if (m && !seen.has(m)) seen.set(m, t);
  }
}
const out = await p.evaluate(() => window.OUTCOME || null), cues = await p.evaluate(() => (window.CUES || {}).cues?.length || 0);
await b.close();
for (const [m, t] of seen) console.log(`QA ${t.toFixed(1)} s: text outside the frame: ${m}`);
if (out) console.log('QA outcome: ' + JSON.stringify(out));
console.log(`QA sound: ${cues} cues`);
const bad = seen.size + errors.length + (out && out.ok === false ? 1 : 0) + (cues ? 0 : 1);
if (errors.length) console.log('QA page errors: ' + errors.join(' | '));
console.log(bad ? `QA: ${bad} problem(s)` : 'QA: clean');
process.exit(bad ? 1 : 0);
