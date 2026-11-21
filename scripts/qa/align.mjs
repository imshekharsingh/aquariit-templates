// ALIGN (owner, 21 Nov 2026, Turns Out design preview "Doesn't look aligned": the menu's last letters froze mid-flip off the baseline and the
// lower lines stopped a few px short of the left edge). A scene declares what must line up, and when: window.ALIGN = [{ at: s, sel: 'css',
// edge: 'left' | 'right' | 'bottom' | 'top', each: 'css' (optional: check the matches inside each of these separately, e.g. one baseline per line),
// tol: px (default 1), why: 'text' }]. This seeks the scene to each moment (voice timed as stills.mjs does) and measures the real boxes in CSS px.
// Prints "ALIGN: ok" or one FAIL line per group (the spread and the worst element) and exits 1 on any FAIL.
// Usage: PW_FROM=$(npm root -g)/ node scripts/qa/align.mjs <config.json>
import { readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createRequire } from 'node:module';
import { simWords } from '../showreel/flow.mjs';
const { chromium } = createRequire(process.env.PW_FROM || join(process.cwd(), 'node_modules/'))('playwright');
const cfg = JSON.parse(readFileSync(process.argv[2], 'utf8'));
let { words } = simWords(cfg);   // the real voice's words when the render has them (VOICE_WORDS, as seek.mjs), else the simulated timing
if (process.env.VOICE_WORDS) { try { const vw = JSON.parse(readFileSync(process.env.VOICE_WORDS, 'utf8')); words = vw.words || vw; } catch { /* keep the simulated words */ } }
const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 540, height: 960 } });
await p.goto('file://' + resolve(cfg.seek)); await p.waitForSelector('html[data-ready]');
const groups = await p.evaluate((ws) => { if (ws.length && window.setVoice) window.setVoice({ words: ws }); return window.ALIGN || []; }, words);
if (!groups.length) { console.log('ALIGN: SKIP (the scene declares no window.ALIGN)'); await b.close(); process.exit(0); }
let bad = 0;
for (const g of groups) {
  const r = await p.evaluate((g) => { window.seek(g.at); const edge = g.edge || 'left', hosts = g.each ? [...document.querySelectorAll(g.each)] : [document];
    return hosts.map((h) => [...h.querySelectorAll(g.sel)].filter((e) => e.getBoundingClientRect().width > 0 && (e.textContent || '').trim() !== '').map((e) => {
      const q = e.getBoundingClientRect(); return { v: q[edge], n: (e.id ? '#' + e.id : e.tagName.toLowerCase()) + ' "' + (e.textContent || '').trim().slice(0, 18) + '"' }; })); }, g);
  for (const list of r) { if (list.length < 2) continue; const vs = list.map((x) => x.v), lo = Math.min(...vs), hi = Math.max(...vs), spread = hi - lo, tol = g.tol ?? 1;
    const med = vs.slice().sort((a, c) => a - c)[vs.length >> 1], worst = list.reduce((w, x) => (Math.abs(x.v - med) > Math.abs(w.v - med) ? x : w));
    if (spread > tol) { bad++; console.log(`ALIGN: FAIL at ${g.at.toFixed(1)} s, ${g.why || g.sel} (${g.edge || 'left'} edges spread ${spread.toFixed(1)} px, at most ${tol}): worst ${worst.n} at ${worst.v.toFixed(1)} vs ${med.toFixed(1)}`); } } }
console.log(bad ? `ALIGN: ${bad} group(s) off` : `ALIGN: ok (${groups.length} groups)`);
await b.close(); process.exit(bad ? 1 : 0);
