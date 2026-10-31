// Pre-render stills for a narrated showreel (owner, 29 Oct 2026: review one small sheet, not separate frames, to save usage).
// Simulates the voice from the config (letters per word at the preflight rate, breaths after sentences), seeks the cover and
// n evenly spaced moments, and writes ONE contact sheet (cover first, time under each frame) plus any page errors.
// Usage: node scripts/showreel/stills.mjs scripts/explainer/<slug>.json [out dir] [n=11]   (writes <out>/sheet.png)
import { readFileSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createRequire } from 'node:module';
const { chromium } = createRequire(process.env.PW_FROM || join(process.cwd(), 'node_modules/'))('playwright');
const [cfgPath, out = 'stills', n = '11'] = process.argv.slice(2);
const cfg = JSON.parse(readFileSync(cfgPath, 'utf8')), scene = cfgPath.replace(/\.json$/, '.html'), sp = +cfg.voice?.speed || 1;
let t = .1, si = 0;
const AT = cfg.voice?.at;   // timed sentences (voice.at): each sentence's words start at its own time
const words = (cfg.voice?.text || '').split(/\s+/).filter(Boolean).map((w, i, all) => {
  if (AT && (i === 0 || /[.?!]$/.test(all[i - 1]))) { if (AT[si] != null) t = Math.max(t, AT[si]); si++; }
  const d = w.replace(/[^A-Za-z]/g, '').length * .0765 / sp * .62, o = { w, s: t, e: t + d };
  t += d + (/[.?!]$/.test(w) ? .55 : /,$/.test(w) ? .3 : .06); return o;
});
mkdirSync(out, { recursive: true });
const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 540, height: 960 } }), errors = [];
p.on('pageerror', (e) => errors.push(e.message));
await p.goto('file://' + resolve(scene)); await p.waitForSelector('html[data-ready]');
const cover = await p.evaluate((ws) => { if (ws.length && window.setVoice) window.setVoice({ words: ws }); return window.COVER ?? 0; }, words);
const ts = [cover]; for (let i = 0; i < +n; i++) ts.push(+(cover + .3 + i * (cfg.dur - cover - .6) / (+n - 1)).toFixed(2));
const shots = [];
for (const x of ts) { await p.evaluate((x) => window.seek(x), x); shots.push((await p.screenshot({ type: 'jpeg', quality: 70 })).toString('base64')); }
await p.setViewportSize({ width: 1080, height: 100 });
await p.setContent(`<body style="margin:0;background:#111;display:grid;grid-template-columns:repeat(4,270px);gap:0;font:600 13px system-ui;color:#fff">${
  shots.map((s, i) => `<figure style="margin:0;position:relative"><img src="data:image/jpeg;base64,${s}" style="width:270px;display:block"><figcaption style="position:absolute;left:4px;top:4px;background:#000a;padding:1px 5px">${i ? ts[i].toFixed(1) + ' s' : 'cover'}</figcaption></figure>`).join('')}</body>`);
await p.screenshot({ path: `${out}/sheet.png`, fullPage: true });
await b.close();
console.log(`STILLS: ${ts.length} frames (cover ${cover} s) in ${out}/sheet.png; simulated voice ends ${t.toFixed(1)} s; page errors: ${errors.length ? errors.join(' | ') : 'none'}`);
process.exit(errors.length ? 1 : 0);
