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
const seen = new Map(), shown = new Set(), lay = [], depth = new Map(), lum = [];   // lay: the text boxes every 0.5 s for the Mandatory Gate layout lines (scripts/showreel/layout.mjs)
for (let t = 0; t <= cfg.dur; t = +(t + .1).toFixed(2)) {
  const [boxes, cap] = await p.evaluate((t) => { window.seek(t); return [window.__boxes(), window.__cap ? window.__cap() : -1]; }, t);
  shown.add(cap);
  lum.push(await p.evaluate(() => { const c = document.querySelector('canvas'), m = document.createElement('canvas'); m.width = 54; m.height = 96; const g = m.getContext('2d'); g.drawImage(c, 0, 0, 54, 96);
    const d = g.getImageData(0, 0, 54, 96).data, o = []; for (let i = 0; i < d.length; i += 4) o.push(Math.round(.3 * d[i] + .59 * d[i + 1] + .11 * d[i + 2])); return o; }));
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
const FL = judgeFlow(await sample(p, +cfg.dur), 'c3');
// GUESS (owner, 12 Nov 2026: the Eiffel guess reel showed the tower red while asking "Gold, grey, or red?"): a guess reel (Kt.choices, or the
// c3-guess experiment) declares window.GUESS = { reveal: t, answer: '#hex', box: [l, t, r, b] (CSS px, where the subject sits during the guess) }.
// Measured on the drawn frames: the share of the box's pixels in the answer's hue (+-12 deg, saturation .35+, value .18+) every 0.2 s before
// the reveal, against the same share 1.0-1.5 s after it. Any frame before the reveal at a tenth of the after level (and 2%+ of the box) fails (the broken Eiffel reel: 11.5% at 4.6 s vs 53.9% after; fixed: under 1%):
// the answer must stay hidden until it is said.
const posted = (() => { try { return (JSON.parse(readFileSync('templates/showreels/captions.json', 'utf8'))[cfg.name] || {}).postOn || ''; } catch { return ''; } })();
const usesGuess = /Kt\.choices\(/.test(readFileSync(resolve(cfg.seek), 'utf8')) || /^c3-guess/.test(cfg.experiment?.id || '');
let gbad = 0; const gLines = [];
if (usesGuess) {
  const G = await p.evaluate(() => window.GUESS || null);
  if (!G || !(G.reveal > 0) || !/^#[0-9a-f]{6}$/i.test(G.answer || '') || !Array.isArray(G.box)) { gbad++; gLines.push('GUESS: not declared (FAIL: set window.GUESS = { reveal, answer: "#hex", box: [l, t, r, b] } in the scene, design/rules-c3.md rule 1)'); }
  else {
    const share = (t) => p.evaluate(([t, G]) => { window.seek(t); const c = document.querySelector('canvas'), w = 135, h = 240, m = document.createElement('canvas'); m.width = w; m.height = h;
      const g = m.getContext('2d'); g.drawImage(c, 0, 0, w, h); const d = g.getImageData(0, 0, w, h).data, k = w / 540;
      const hsv = (r, gg, b) => { const mx = Math.max(r, gg, b), mn = Math.min(r, gg, b), dd = mx - mn; let hh = 0; if (dd) hh = mx === r ? ((gg - b) / dd) % 6 : mx === gg ? (b - r) / dd + 2 : (r - gg) / dd + 4; return [(hh * 60 + 360) % 360, mx ? dd / mx : 0, mx / 255]; };
      const A = hsv(...[1, 3, 5].map((i) => parseInt(G.answer.slice(i, i + 2), 16)));
      let n = 0, hit = 0; for (let y = Math.round(G.box[1] * k); y < Math.round(G.box[3] * k); y++) for (let xx = Math.round(G.box[0] * k); xx < Math.round(G.box[2] * k); xx++) { const i = (y * w + xx) * 4, q = hsv(d[i], d[i + 1], d[i + 2]);
        n++; const dh = Math.min(Math.abs(q[0] - A[0]), 360 - Math.abs(q[0] - A[0])); if (dh <= 12 && q[1] >= .35 && q[2] >= .18) hit++; }
      return hit / Math.max(1, n); }, [t, G]);
    let after = 0; for (let t = G.reveal + 1; t <= G.reveal + 1.5; t += .25) after = Math.max(after, await share(t));
    let worst = 0, wt = 0; for (let t = 0; t < G.reveal - .02; t = +(t + .2).toFixed(2)) { const v = await share(t); if (v > worst) { worst = v; wt = t; } }
    const lim = Math.max(.02, after * .1), pc = (v) => (v * 100).toFixed(1) + '%';
    if (after < .05) { gbad++; gLines.push(`GUESS: FAIL the answer colour fills only ${pc(after)} of the subject after the reveal (${G.reveal} s): is the box or the answer colour right?`); }
    else if (worst > lim) { gbad++; gLines.push(`GUESS: FAIL the answer shows before the reveal: ${pc(worst)} of the subject is the answer colour at ${wt.toFixed(1)} s (after the reveal ${pc(after)}; limit ${pc(lim)}). Keep the subject neutral until ${G.reveal} s.`); }
    else gLines.push(`GUESS: answer hidden until ${G.reveal} s (answer colour at most ${pc(worst)} of the subject before it, ${pc(after)} after)`);
  }
}   // FLOW (design/mandatory.md items 14-17): Turns Out thresholds (scripts/showreel/flow.mjs)
// BUSY (owner, 12 Nov 2026: "more detailing and stacking ... to avoid boring instances in the reel and make it tick, snap, click better";
// design/rules-c3.md rule 9): the kit's beats (Kt.beat: a rivet, a stamp, a piece landing on the pile, window.__beats) are looked for on the
// drawn frames (the picture every 0.1 s at 54x96: the change within 30 px of the beat, 0.2 s before to 0.3 s after it, must stand 3+ levels
// above the frame's median change, so a camera drift does not count), and joined with the sound onsets (window.CUES, no bed over 1.5 s).
// "BUSY: longest quiet run n.n s": the longest stretch with no beat seen and no sound starting; fails over 1.5 s, or under 80 % of the beats seen.
const BEATS = await p.evaluate(() => (window.__beats ? window.__beats() : [])), CUEL = await p.evaluate(() => (window.CUES || {}).cues || []);
let busyBad = 0; const busyLines = [];
{ const W = 54, H = 96, med = (a) => { const s = [...a].sort((u, v) => u - v); return s[s.length >> 1]; }, D = [];
  for (let i = 0; i + 1 < lum.length; i++) { const d = lum[i + 1].map((v, j) => Math.abs(v - lum[i][j])); D.push({ d, m: med(d) }); }
  const seenB = BEATS.filter((bt) => bt.t <= +cfg.dur).map((bt) => { const cx = Math.round(bt.x / 10), cy = Math.round(bt.y / 10); let best = -1e9;
    for (let i = Math.max(0, Math.floor((bt.t - .2) / .1)); i < D.length && i * .1 <= bt.t + .3; i++) { let s = 0, n = 0;
      for (let y = Math.max(0, cy - 3); y <= Math.min(H - 1, cy + 3); y++) for (let xx = Math.max(0, cx - 3); xx <= Math.min(W - 1, cx + 3); xx++) { s += D[i].d[y * W + xx]; n++; }
      best = Math.max(best, s / n - D[i].m); }
    return { ...bt, ok: best >= 3 }; });
  const ev = [...seenB.filter((q) => q.ok).map((q) => q.t), ...CUEL.filter((q) => q.k !== 'voice' && !(+q.d > 1.5)).map((q) => +q.t)].filter((v) => v >= 0 && v <= +cfg.dur).sort((u, v) => u - v);
  let gap = 0, ga = 0, prev = 0; for (const e of [...ev, +cfg.dur]) { if (e - prev > gap) { gap = e - prev; ga = prev; } prev = Math.max(prev, e); }
  const nOk = seenB.filter((q) => q.ok).length, pct = seenB.length ? Math.round(100 * nOk / seenB.length) : 0, used = /Kt\.beat\(|Kt\.stackOn\(/.test(readFileSync(resolve(cfg.seek), 'utf8'));
  const ok = gap <= 1.5 && (!used || pct >= 80); if (!ok && (used || posted >= '2026-11-12' || !posted)) busyBad++;
  busyLines.push(`BUSY: longest quiet run ${gap.toFixed(1)} s (${ga.toFixed(1)}-${(ga + gap).toFixed(1)} s); ${BEATS.length} detail beats, ${nOk} seen on the frames (${pct}%)` + (ok ? ': ok' : `: FAIL (${gap > 1.5 ? 'over 1.5 s with nothing small moving or heard' : 'under 80% of the beats seen'}; design/rules-c3.md rule 9)`));
  const miss = seenB.filter((q) => !q.ok).slice(0, 8); if (miss.length) busyLines.push('BUSY not seen: ' + miss.map((q) => `${q.kind}@${q.t}s(${q.x},${q.y})`).join(' ')); }
await b.close();
// DEPTH: per world, the planes in a typical frame and the parallax between its nearest and farthest plane
const dLines = []; let dbad = 0;
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
const L = judge(lay, false); for (const l of [...L.lines, ...FL.lines, ...dLines, ...gLines, ...busyLines]) console.log(l);
if (out) console.log('QA outcome: ' + JSON.stringify(out));
console.log(`QA sound: ${cues} cues`);
const bad = L.bad + FL.bad + dbad + gbad + busyBad + vbad + seen.size + errors.length + (out && out.ok === false ? 1 : 0) + (cues ? 0 : 1);
if (errors.length) console.log('QA page errors: ' + errors.join(' | '));
console.log(bad ? `QA: ${bad} problem(s)` : 'QA: clean');
process.exit(bad ? 1 : 0);
