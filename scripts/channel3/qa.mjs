// Channel 3 pilot check before a render (CLAUDE.md, "Channel 3 pilots"): seeks the scene every 0.1 s and reports any text drawn past
// the frame's 12 px side margins or above 70 px / below 750 px (Instagram's top bar and caption zone), page errors, and whether the
// scripted outcome held (window.OUTCOME.ok, for the physics pilots). The scenes record each text box they draw (window.__boxes).
// Narrated pilots (owner, 31 Oct: "no audio, how do we expect the audience to connect?"): the scene says what the voice must say and
// when (window.VOICE = { text, at }); the config's voice must match it exactly (the line to paste is printed when it does not), and
// every sentence must be on screen as a caption at some point (window.__cap() = the sentence shown).
// Mandatory Gate (7 Nov 2026): it also prints SAFE ZONE and OVERLAP for the reported boxes every 0.5 s (scripts/showreel/layout.mjs; BAND, HOOK and
// SUBTITLES are canvas-drawn, so they are REVIEW items read from the stills sheet).
// FLOW (7 Nov 2026): cuts, dead runs, continuity and strobes from the frame every 0.1 s (scripts/showreel/flow.mjs, the c3 thresholds).
// Usage: node scripts/channel3/qa.mjs scripts/channel3/<slug>.json [--write]   (exit 1 on any problem; --write copies the scene's voice
// text, times and length into the config first)
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createRequire } from 'node:module';
import { judge } from '../showreel/layout.mjs';
import { sample, judgeFlow } from '../showreel/flow.mjs';
const { chromium } = createRequire(process.env.PW_FROM || join(process.cwd(), 'node_modules/'))('playwright');
const cfg = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 540, height: 960 } }), errors = [];
p.on('pageerror', (e) => errors.push(e.message));
await p.goto('file://' + resolve(cfg.seek)); await p.waitForSelector('html[data-ready]', { timeout: 60000 });
const seen = new Map(), shown = new Set(), lay = [];   // lay: the text boxes every 0.5 s for the Mandatory Gate layout lines (scripts/showreel/layout.mjs)
for (let t = 0; t <= cfg.dur; t = +(t + .1).toFixed(2)) {
  const [boxes, cap] = await p.evaluate((t) => { window.seek(t); return [window.__boxes(), window.__cap ? window.__cap() : -1]; }, t);
  shown.add(cap);
  if (Math.abs(t * 2 - Math.round(t * 2)) < .01) lay.push({ t, texts: boxes.filter(([, l, r, top, bot]) => r > 0 && l < 540 && bot > 0 && top < 960).map(([s, l, r, top, bot]) => ({ s: String(s).slice(0, 40), l: l * 2, r: r * 2, t: top * 2, b: bot * 2, a: 1, g: -1 })) });
  for (const [s, l, r, top, bot] of boxes) {
    if (r < 0 || l > 540 || bot < 0 || top > 960) continue;   // wholly off screen (a ball that fell out of view): not seen, not cut
    const m = l < 12 || r > 528 ? `"${s}" spans ${Math.round(l)}-${Math.round(r)} px across` : top < 70 || bot > 785 ? `"${s}" sits at ${Math.round(top)}-${Math.round(bot)} px down` : '';
    if (m && !seen.has(m)) seen.set(m, t);
  }
}
const out = await p.evaluate(() => window.OUTCOME || null), cues = await p.evaluate(() => (window.CUES || {}).cues?.length || 0);
const want = await p.evaluate(() => window.VOICE || null), dur = await p.evaluate(() => window.DURATION);
let vbad = 0;
if (want) {
  const v = cfg.voice || {};
  // the config may carry pronunciation markup the voice reads, [te](/tˈA/), over the scene's plain words (3 Nov 2026: "te" was read as "tea");
  // --write keeps it: each marked word is marked again wherever it stands alone in the scene's new text
  const plain = (s) => String(s || '').replace(/\[([^\]]+)\]\(\/[^)]*\/\)/g, '$1');
  if (process.argv.includes('--write')) { let text = want.text; const marks = [...String(v.text || '').matchAll(/\[([^\]]+)\]\(\/[^)]*\/\)/g)];
    for (const [w, k] of new Map(marks.map((q) => [q[1], q]))) text = text.replace(new RegExp(`(^|[^\\p{L}\\]])${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\]])`, 'gu'), (q, pre) => pre + k[0]);
    Object.assign(v, { text, at: want.at }); cfg.voice = v; cfg.dur = dur; writeFileSync(process.argv[2], JSON.stringify(cfg, null, 1) + '\n'); console.log('QA voice: config updated from the scene'); }
  if (plain(v.text) !== want.text || JSON.stringify(v.at) !== JSON.stringify(want.at) || +cfg.dur !== +dur) { vbad++; console.log(`QA voice: the config does not match the scene; use "dur": ${dur} and\n  "text": ${JSON.stringify(want.text)},\n  "at": ${JSON.stringify(want.at)}`); }
  const n = want.at.length, miss = [...Array(n).keys()].filter((i) => !shown.has(i));
  if (miss.length) { vbad++; console.log(`QA captions: sentence(s) ${miss.map((i) => i + 1).join(', ')} never on screen`); }
  else console.log(`QA captions: all ${n} sentences on screen`);
}
const FL = judgeFlow(await sample(p, +cfg.dur), 'c3');   // FLOW (design/mandatory.md items 14-17): Turns Out thresholds (scripts/showreel/flow.mjs)
await b.close();
for (const [m, t] of seen) console.log(`QA ${t.toFixed(1)} s: text outside the frame: ${m}`);
const L = judge(lay, false); for (const l of [...L.lines, ...FL.lines]) console.log(l);
if (out) console.log('QA outcome: ' + JSON.stringify(out));
console.log(`QA sound: ${cues} cues`);
const bad = L.bad + FL.bad + vbad + seen.size + errors.length + (out && out.ok === false ? 1 : 0) + (cues ? 0 : 1);
if (errors.length) console.log('QA page errors: ' + errors.join(' | '));
console.log(bad ? `QA: ${bad} problem(s)` : 'QA: clean');
process.exit(bad ? 1 : 0);
