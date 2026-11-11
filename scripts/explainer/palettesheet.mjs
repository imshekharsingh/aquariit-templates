// One stills sheet of a scene in every palette (11 Nov 2026; rules-web.md rule 12): a row per palette (KM.PALETTES, scripts/explainer/kitmotion.js),
// the given moments across, each frame at phone size (270x480), to judge a new or retuned palette against the others before a reel uses it.
// Usage: node scripts/explainer/palettesheet.mjs <scene.html>[,<scene2.html>] <out.png> t1,t2,...[;t1,t2 for scene2]
import { resolve } from 'node:path';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { palettes } from './palette.mjs';
const req = createRequire(process.env.PW_FROM || join(process.cwd(), 'node_modules/'));
let pw; try { pw = req('playwright'); } catch { pw = createRequire(import.meta.url)('playwright'); }
const [scenes, out, times] = process.argv.slice(2), S = scenes.split(','), T = times.split(';').map((x) => x.split(',').map(Number));
const b = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }), rows = [];
for (const pal of palettes()) { const row = [];
  for (const [i, sc] of S.entries()) { const p = await b.newPage({ viewport: { width: 540, height: 960 } }); await p.addInitScript((x) => { window.WEB_PALETTE = x; }, pal);
    await p.goto('file://' + resolve(sc)); await p.waitForSelector('html[data-ready]');
    for (const t of T[i] || T[0]) { await p.evaluate((x) => window.seek(x), t); row.push({ t, img: (await p.screenshot({ type: 'jpeg', quality: 80 })).toString('base64') }); } await p.close(); }
  rows.push({ pal, row }); }
const p = await b.newPage({ viewport: { width: 100, height: 100 } }), n = rows[0].row.length;
await p.setContent(`<body style="margin:0;background:#111;font:600 15px system-ui;color:#fff">${rows.map((r) => `<div style="display:grid;grid-template-columns:90px repeat(${n},270px)"><div style="padding:8px">${r.pal}</div>${
  r.row.map((x) => `<figure style="margin:0;position:relative"><img src="data:image/jpeg;base64,${x.img}" style="width:270px;display:block"><figcaption style="position:absolute;left:4px;top:4px;background:#000a;padding:1px 5px;font-size:12px">${x.t.toFixed(1)} s</figcaption></figure>`).join('')}</div>`).join('')}</body>`);
await p.setViewportSize({ width: 90 + 270 * n, height: 100 }); await p.screenshot({ path: out, fullPage: true }); await b.close();
console.log(`PALETTE SHEET: ${rows.length} palettes x ${n} frames in ${out}`);
