// Fixed Cell layout check before a render (design/fixedcell.md): seeks the scene every 0.1 s with the voice simulated as in stills.mjs
// and reports text wider than its box: the title, captions, notes and formula bar past the 36 px side margins, a clipped formula,
// a clipped cell (columns narrower than 70 px are mid-insert and skipped). Usage: node scripts/fixedcell/qa.mjs scripts/fixedcell/<slug>.json   (exit 1 on any problem)
import { readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createRequire } from 'node:module';
const { chromium } = createRequire(process.env.PW_FROM || join(process.cwd(), 'node_modules/'))('playwright');
const cfg = JSON.parse(readFileSync(process.argv[2], 'utf8')), sp = +cfg.voice?.speed || 1;
let t = .1;
const words = (cfg.voice?.text || '').split(/\s+/).filter(Boolean).map((w) => {
  const d = w.replace(/[^A-Za-z]/g, '').length * .0765 / sp * .62, o = { w, s: t, e: t + d };
  t += d + (/[.?!]$/.test(w) ? .55 : /,$/.test(w) ? .3 : .06); return o;
});
const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 540, height: 960 } }), errors = [];
p.on('pageerror', (e) => errors.push(e.message));
await p.goto('file://' + resolve(cfg.seek)); await p.waitForSelector('html[data-ready]');
await p.evaluate((ws) => window.setVoice({ words: ws }), words);
const seen = new Map();
for (let x = 0; x <= cfg.dur; x = +(x + .1).toFixed(2)) {
  const bad = await p.evaluate((x) => { window.seek(x); const out = [];
    const vis = (e) => { let n = e; while (n && n !== document.body) { const s = getComputedStyle(n); if (+s.opacity < .05 || s.display === 'none') return false; n = n.parentElement; } return true; };
    for (const sel of ['#hook .ln > span', '#cap span', '#note span', '#lbl', '#hud']) for (const e of document.querySelectorAll(sel)) {
      const r = e.getBoundingClientRect(); if (r.width && vis(e) && (r.right > 506 || r.left < 30)) out.push(`${sel} "${e.textContent.trim().slice(0, 30)}" spans ${Math.round(r.left)}-${Math.round(r.right)} px`); }
    const capR = document.getElementById('cap').getBoundingClientRect(), view = document.getElementById('view').getBoundingClientRect();
    if (document.getElementById('cap').textContent.trim() && capR.bottom > view.top - 4) out.push(`captions run into the sheet (bottom ${Math.round(capR.bottom)}, sheet top ${Math.round(view.top)})`);
    const fx = document.getElementById('fx'); if (fx.scrollWidth > fx.clientWidth + 1) out.push(`formula bar clipped: "${fx.textContent}"`);
    for (const c of document.querySelectorAll('#cells .c')) if (c.clientWidth > 70 && c.scrollWidth > c.clientWidth + 1 && c.textContent.trim()) out.push(`cell clipped: "${c.textContent}"`);
    const note = document.getElementById('note').getBoundingClientRect(); if (document.getElementById('note').textContent.trim() && note.bottom > 750) out.push(`notes below 750 px (Instagram's caption zone): ${Math.round(note.bottom)}`);
    return out; }, x);
  for (const m of bad) if (!seen.has(m)) seen.set(m, x);
}
await b.close();
for (const [m, x] of seen) console.log(`QA ${x.toFixed(1)} s: ${m}`);
console.log(`QA: ${seen.size ? seen.size + ' problem(s)' : 'no text wider than its box'}; page errors: ${errors.length ? errors.join(' | ') : 'none'}`);
process.exit(seen.size || errors.length ? 1 : 0);
