// Output QA COLOUR, before the render (scripts/qa/output-qa.py colour_checks on the scene's own frames): the share of strongly saturated
// pixels (S > 0.6 and V > 0.4) every 0.5 s at 270x480, and the frames over 25% (a full-screen saturated colour, owner 12 Nov 2026).
// The Echoes engine gives each beat its own colour (15 Nov 2026) and this keeps that colour rich but under the gate.
// Usage: node scripts/echoes/colour.mjs scripts/channel3/<slug>.json
import { readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createRequire } from 'node:module';
import { simWords } from '../showreel/flow.mjs';
const { chromium } = createRequire(process.env.PW_FROM || join(process.cwd(), 'node_modules/'))('playwright');
const cfg = JSON.parse(readFileSync(process.argv[2], 'utf8')), { words } = simWords(cfg);
const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 270, height: 480 } });
await p.goto('file://' + resolve(cfg.seek)); await p.waitForSelector('html[data-ready]');
const end = await p.evaluate((ws) => { window.setVoice({ words: ws }); return window.CUES.dur; }, words);
const rows = [];
for (let t = 0; t <= end; t += .5) {
  await p.evaluate((x) => window.seek(x), t);
  const b64 = (await p.screenshot({ type: 'png' })).toString('base64');
  const f = await p.evaluate(async (s) => { const im = new Image(); im.src = 'data:image/png;base64,' + s; await im.decode(); const c = document.createElement('canvas'); c.width = 270; c.height = 480;
    const g = c.getContext('2d'); g.drawImage(im, 0, 0); const d = g.getImageData(0, 0, 270, 480).data; let n = 0;
    for (let i = 0; i < d.length; i += 4) { const mx = Math.max(d[i], d[i + 1], d[i + 2]) / 255, mn = Math.min(d[i], d[i + 1], d[i + 2]) / 255; if (mx > .4 && (mx - mn) / mx > .6) n++; }
    return n / (d.length / 4); }, b64);
  rows.push([+t.toFixed(1), f]);
}
const over = rows.filter((r) => r[1] > .25), worst = rows.reduce((a, r) => (r[1] > a[1] ? r : a), [0, 0]);
console.log(`COLOUR (pre-render): saturated fill at most ${(worst[1] * 100).toFixed(0)}% at ${worst[0]} s; over 25%: ${over.map((r) => r[0] + ' s ' + (r[1] * 100).toFixed(0) + '%').join(', ') || 'never'}`);
await b.close(); process.exit(over.length ? 1 : 0);
