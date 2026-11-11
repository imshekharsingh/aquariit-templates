// Channel 3 pilot check before a render (CLAUDE.md, "Channel 3 pilots"): seeks the scene every 0.1 s and reports any text drawn past
// the frame's 12 px side margins or above 70 px / below 750 px (Instagram's top bar and caption zone), page errors, and whether the
// scripted outcome held (window.OUTCOME.ok, for the physics pilots). The scenes record each text box they draw (window.__boxes).
// Narrated pilots (owner, 31 Oct: "no audio, how do we expect the audience to connect?"): the scene says what the voice must say and
// when (window.VOICE = { text, at }); the config's voice must match it exactly (the line to paste is printed when it does not), and
// every sentence must be on screen as a caption at some point (window.__cap() = the sentence shown).
// Mandatory Gate (7 Nov 2026): it also prints SAFE ZONE and OVERLAP for the reported boxes every 0.5 s (scripts/showreel/layout.mjs; BAND, HOOK and
// SUBTITLES are canvas-drawn, so they are REVIEW items read from the stills sheet).
// FLOW (7 Nov 2026): cuts, dead runs, continuity and strobes from the frame every 0.1 s (scripts/showreel/flow.mjs, the c3 thresholds).
// DEPTH (11 Nov 2026; owner, 8 Nov: Turns Out "feels flat"; design/mandatory.md item 20, design/rules-c3.md rule 11): the kit reports every
// world drawn in a frame and its depth planes (window.__depth, Kt.world / Kt.plane). Per world: "DEPTH <world>: n planes, parallax nn px,
// foreground yes|no". n = the planes in a typical frame (median); parallax = how far a point on the nearest plane slides against the same
// point on the farthest plane while the world is on screen (measured on the frame, 540 px wide); foreground = one plane marked fg passes
// the lens. Fails under 4 planes, under 12 px or without a foreground plane; a reel that posts before 11 Nov 2026 is not judged.
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
const seen = new Map(), shown = new Set(), lay = [], depth = new Map();   // lay: the text boxes every 0.5 s for the Mandatory Gate layout lines (scripts/showreel/layout.mjs)
for (let t = 0; t <= cfg.dur; t = +(t + .1).toFixed(2)) {
  const [boxes, cap] = await p.evaluate((t) => { window.seek(t); return [window.__boxes(), window.__cap ? window.__cap() : -1]; }, t);
  shown.add(cap);
  for (const w of await p.evaluate(() => (window.__depth ? window.__depth() : []))) { if (!w.cam) continue; if (!depth.has(w.name)) depth.set(w.name, []); depth.get(w.name).push(w); }
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
    Object.assign(v, { text, at: want.at }); if (want.speeds) v.speeds = want.speeds; else delete v.speeds; cfg.voice = v; cfg.dur = dur; writeFileSync(process.argv[2], JSON.stringify(cfg, null, 1) + '\n'); console.log('QA voice: config updated from the scene'); }
  if (plain(v.text) !== want.text || JSON.stringify(v.at) !== JSON.stringify(want.at) || JSON.stringify(v.speeds || null) !== JSON.stringify(want.speeds || null) || +cfg.dur !== +dur) { vbad++; console.log(`QA voice: the config does not match the scene; use "dur": ${dur} and\n  "text": ${JSON.stringify(want.text)},\n  "at": ${JSON.stringify(want.at)}${want.speeds ? `,\n  "speeds": ${JSON.stringify(want.speeds)}` : ''}`); }
  const n = want.at.length, miss = [...Array(n).keys()].filter((i) => !shown.has(i));
  if (miss.length) { vbad++; console.log(`QA captions: sentence(s) ${miss.map((i) => i + 1).join(', ')} never on screen`); }
  else console.log(`QA captions: all ${n} sentences on screen`);
}
const FL = judgeFlow(await sample(p, +cfg.dur), 'c3');   // FLOW (design/mandatory.md items 14-17): Turns Out thresholds (scripts/showreel/flow.mjs)
await b.close();
// DEPTH: per world, the planes in a typical frame and the parallax between its nearest and farthest plane
const dLines = []; let dbad = 0;
const posted = (() => { try { return (JSON.parse(readFileSync('templates/showreels/captions.json', 'utf8'))[cfg.name] || {}).postOn || ''; } catch { return ''; } })();
for (const [name, fr] of depth) {
  const counts = fr.map((w) => new Set(w.planes.map((z) => z.toFixed(2))).size).sort((a, b) => a - b), n = counts[counts.length >> 1], fg = fr.some((w) => w.fg);
  const f0 = fr[0], F = f0.F, zs = [...new Set(f0.planes)].filter((z) => z - f0.cam[2] > .05).sort((a, b) => b - a), far = zs[0];
  const at = (w, z) => { const s0 = F / (z - f0.cam[2]), X = f0.cam[0] + 100 / s0, Y = f0.cam[1] + 100 / s0, dz = z - w.cam[2]; return dz < .05 ? null : [270 + (X - w.cam[0]) * F / dz, 480 - (Y - w.cam[1]) * F / dz]; };
  let par = 0; for (const w of fr) { const a = at(w, far); if (!a) continue; for (const z of zs) { const q = at(w, z); if (q) par = Math.max(par, Math.hypot(q[0] - a[0], q[1] - a[1])); } }
  const ok = n >= 4 && par >= 12 && fg; if (!ok) dbad++;
  dLines.push(`DEPTH ${name}: ${n} planes, parallax ${Math.round(Math.min(par, 9999))} px, foreground ${fg ? 'yes' : 'no'}${ok ? '' : ' (FAIL: 4+ planes, 12+ px and a foreground plane, design/rules-c3.md rule 11)'}`);
}
if (!depth.size) { const old = posted && posted < '2026-11-11'; if (!old) dbad++; dLines.push(old ? 'DEPTH: not judged (posts before 11 Nov 2026)' : 'DEPTH: no world declared (FAIL: draw every world with Kt.world and 4+ Kt.plane layers, design/rules-c3.md rule 11)'); }
for (const [m, t] of seen) console.log(`QA ${t.toFixed(1)} s: text outside the frame: ${m}`);
const L = judge(lay, false); for (const l of [...L.lines, ...FL.lines, ...dLines]) console.log(l);
if (out) console.log('QA outcome: ' + JSON.stringify(out));
console.log(`QA sound: ${cues} cues`);
const bad = L.bad + FL.bad + dbad + vbad + seen.size + errors.length + (out && out.ok === false ? 1 : 0) + (cues ? 0 : 1);
if (errors.length) console.log('QA page errors: ' + errors.join(' | '));
console.log(bad ? `QA: ${bad} problem(s)` : 'QA: clean');
process.exit(bad ? 1 : 0);
