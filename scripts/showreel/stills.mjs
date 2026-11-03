// Pre-render stills for a narrated showreel (owner, 29 Oct 2026: review one small sheet, not separate frames, to save usage).
// Simulates the voice from the config (letters per word at the preflight rate, breaths after sentences), seeks the cover and
// n evenly spaced moments, and writes ONE contact sheet (cover first, time under each frame) plus any page errors.
// Usage: node scripts/showreel/stills.mjs scripts/explainer/<slug>.json [out dir] [n=11 | t1,t2,...]   (writes <out>/sheet.png; a comma list
// seeks those times, e.g. one per beat, after the cover)
// Empty-frame scan (todo P1, 3 Nov 2026): it also seeks every 0.5 s of the reel and prints EMPTY FRAMES for any moment whose picture is
// nearly one flat colour (luminance spread under 5 of 255 on a small copy), and exits 1: no render with a blank frame.
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
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }), p = await b.newPage({ viewport: { width: 540, height: 960 } }), errors = [];
p.on('pageerror', (e) => errors.push(e.message));
await p.goto('file://' + resolve(scene)); await p.waitForSelector('html[data-ready]');
const cover = await p.evaluate((ws) => { if (ws.length && window.setVoice) window.setVoice({ words: ws }); return window.COVER ?? 0; }, words);
const ts = [cover]; if (String(n).includes(',')) ts.push(...String(n).split(',').map(Number)); else for (let i = 0; i < +n; i++) ts.push(+(cover + .3 + i * (cfg.dur - cover - .6) / (+n - 1)).toFixed(2));
const shots = [];
for (const x of ts) { await p.evaluate((x) => window.seek(x), x); shots.push((await p.screenshot({ type: 'jpeg', quality: 70 })).toString('base64')); }
const scanT = [], scan = [];
for (let x = 0; x <= cfg.dur - .05; x += .5) { scanT.push(+x.toFixed(2)); await p.evaluate((x) => window.seek(x), x); scan.push((await p.screenshot({ type: 'jpeg', quality: 40 })).toString('base64')); }
const spread = await p.evaluate(async (list) => { const c = document.createElement('canvas'); c.width = 54; c.height = 96; const g = c.getContext('2d', { willReadFrequently: true });
  const out = []; for (const b64 of list) { const im = new Image(); im.src = 'data:image/jpeg;base64,' + b64; await im.decode(); g.drawImage(im, 0, 0, 54, 96);
    const d = g.getImageData(0, 0, 54, 96).data; let s = 0, s2 = 0, n = d.length / 4; for (let i = 0; i < d.length; i += 4) { const l = .2126 * d[i] + .7152 * d[i + 1] + .0722 * d[i + 2]; s += l; s2 += l * l; }
    out.push(Math.sqrt(Math.max(0, s2 / n - (s / n) ** 2))); } return out; }, scan);
const empty = scanT.filter((x, i) => spread[i] < 5);
await p.setViewportSize({ width: 1080, height: 100 });
await p.setContent(`<body style="margin:0;background:#111;display:grid;grid-template-columns:repeat(4,270px);gap:0;font:600 13px system-ui;color:#fff">${
  shots.map((s, i) => `<figure style="margin:0;position:relative"><img src="data:image/jpeg;base64,${s}" style="width:270px;display:block"><figcaption style="position:absolute;left:4px;top:4px;background:#000a;padding:1px 5px">${i ? ts[i].toFixed(1) + ' s' : 'cover'}</figcaption></figure>`).join('')}</body>`);
await p.screenshot({ path: `${out}/sheet.png`, fullPage: true });
await b.close();
console.log(`STILLS: ${ts.length} frames (cover ${cover} s) in ${out}/sheet.png; simulated voice ends ${t.toFixed(1)} s; page errors: ${errors.length ? errors.join(' | ') : 'none'}`);
console.log(`EMPTY FRAMES: ${empty.length ? empty.map((x) => x + ' s').join(', ') + ' (nearly one flat colour: fix before the render)' : 'none'} (scanned ${scanT.length} moments, least detail ${Math.min(...spread).toFixed(1)} at ${scanT[spread.indexOf(Math.min(...spread))]} s)`);
process.exit(errors.length || empty.length ? 1 : 0);
