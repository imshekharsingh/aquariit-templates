// Local frames for Output QA's CALM and HUE checks before the one render (15 Nov 2026; owner: the web reels are "too wiggly" and their main
// frame shows "similar colour grading"). A web scene is a pure function of t, so its seeks are the video's frames: this seeks every 0.1 s at
// 270x480 (phone size, half scale), times the captions with the simulated voice as stills.mjs does, and writes <out>/f0000.jpg ... plus
// <out>/<name>.subject0.json (the [data-subject] box every 0.5 s) and <name>.panes0.json (the BEFORE / AFTER panes every 0.1 s), in the render's format. Then: python3 scripts/qa/look.py <config> <out>
// Usage: node scripts/qa/frames.mjs scripts/explainer/<slug>.json <out dir> [fps=10]
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createRequire } from 'node:module';
import { simWords } from '../showreel/flow.mjs';
const { chromium } = createRequire(process.env.PW_FROM || join(process.cwd(), 'node_modules/'))('playwright');
const [cfgPath, out, fpsArg = '10'] = process.argv.slice(2);
const cfg = JSON.parse(readFileSync(cfgPath, 'utf8')), scene = resolve(cfg.seek || cfgPath.replace(/\.json$/, '.html')), FPS = +fpsArg;
mkdirSync(out, { recursive: true });
const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 540, height: 960 }, deviceScaleFactor: .5 });
await p.goto('file://' + scene); await p.waitForSelector('html[data-ready]');
await p.evaluate((ws) => { if (ws.length && window.setVoice) window.setVoice({ words: ws }); }, simWords(cfg).words);
// the video ends at window.CUES.dur when the scene sets it (Echoes: 1.4 s after the last word); the frames past it are never seen
const END = Math.min(cfg.dur, await p.evaluate(() => (window.CUES && window.CUES.dur) || 1e9));
const SUBJ = [], PANES = [], N = Math.floor(END * FPS);
for (let i = 0; i < N; i++) {
  const t = i / FPS; await p.evaluate((t) => window.seek(t), t);
  await p.screenshot({ path: join(out, 'f' + String(i).padStart(4, '0') + '.jpg'), type: 'jpeg', quality: 90 });
  if (i % Math.max(1, Math.round(FPS / 2)) === 0) { const bx = await p.evaluate(() => { const e = document.querySelector('[data-subject]'); if (!e) return null;
    const r = e.getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom].map((v) => Math.round(v)); }); if (bx) SUBJ.push([+t.toFixed(2), ...bx]); }
  const pn = await p.evaluate(() => [...document.querySelectorAll('[data-pane]')].map((e) => { const r = e.getBoundingClientRect(); let o = 1;
    for (let n = e; n && n.nodeType === 1; n = n.parentElement) o *= +getComputedStyle(n).opacity; return [e.dataset.pane, ...[r.left, r.top, r.right, r.bottom].map((v) => Math.round(v)), +o.toFixed(2)]; }));
  if (pn.length) PANES.push([+t.toFixed(2), pn]);
}
if (PANES.length) writeFileSync(join(out, cfg.name + '.panes0.json'), JSON.stringify(PANES));
writeFileSync(join(out, cfg.name + '.subject0.json'), JSON.stringify(SUBJ));
await b.close();
console.log(`frames: ${N} at ${FPS} fps -> ${out}`);
