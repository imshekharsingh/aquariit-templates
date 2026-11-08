// Pre-render stills for a narrated showreel (owner, 29 Oct 2026: review one small sheet, not separate frames, to save usage).
// Simulates the voice from the config (letters per word at the preflight rate, breaths after sentences), seeks the cover and
// n evenly spaced moments, and writes ONE contact sheet (cover first, time under each frame) plus any page errors.
// Usage: node scripts/showreel/stills.mjs scripts/explainer/<slug>.json [out dir] [n=11 | t1,t2,...]   (writes <out>/sheet.png; a comma list
// seeks those times, e.g. one per beat, after the cover)
// Empty-frame scan (todo P1, 3 Nov 2026): it also seeks every 0.5 s of the reel and prints EMPTY FRAMES for any moment whose picture is
// nearly one flat colour (luminance spread under 5 of 255 on a small copy), and exits 1: no render with a blank frame.
// Text fit (3 Nov 2026): at the same moments, any visible DOM text that runs past the box that clips it (the nearest parent with
// overflow other than visible) or past the frame's 12 px side margins is printed as TEXT WIDER THAN ITS BOX, and exits 1. Canvas text
// is not seen here (Turns Out scenes report theirs to scripts/channel3/qa.mjs). A demo that overflows on purpose (the bug a reel shows)
// marks its container data-fit="free".
// Static stretch and subject fill (7 Nov 2026): STATIC STRETCH lists any 2 s+ where the mean pixel change between moments 0.5 s apart stays under 1
// (calibrated: Nº 09 numbers passes, least 0.6 once; the old Nº 16 longname fails from 7.5 s on; Nº 13 sideways fails 3.5-7 s, where only subtitle
// words change); SUBJECT FILL is the share of the frame the subject covers at frame 0 (old Nº 16: 4%, reworked: 42%); both exit 1 when they fail.
// ELEMENT SOUND (8 Nov 2026): the share of animated elements that carry a cue (scripts/showreel/elsound.mjs; 90%+ on scenes with the kit's element sound).
// FLOW (items 14-17, 7 Nov 2026): cuts, dead runs, continuity, strobes on a 0.1 s scan (scripts/showreel/flow.mjs; declare window.TRANSITIONS).
// Layout (Mandatory Gate items 3-4, design/mandatory.md; 7 Nov 2026): SAFE ZONE, OVERLAP, BAND and HOOK from scripts/showreel/layout.mjs on the
// same 0.5 s scan (every text box via getBoundingClientRect); a scene marks its subject, subtitle band and hook with data-subject, data-band, data-hook.
import { readFileSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createRequire } from 'node:module';
import { collectDom, judge } from './layout.mjs';
import { sample, judgeFlow, channelOf, simWords } from './flow.mjs';
import { collectEls, judgeSound } from './elsound.mjs';
const { chromium } = createRequire(process.env.PW_FROM || join(process.cwd(), 'node_modules/'))('playwright');
const [cfgPath, out = 'stills', n = '11'] = process.argv.slice(2);
const cfg = JSON.parse(readFileSync(cfgPath, 'utf8')), scene = cfgPath.replace(/\.json$/, '.html');
const { words, end: t } = simWords(cfg);
mkdirSync(out, { recursive: true });
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }), p = await b.newPage({ viewport: { width: 540, height: 960 } }), errors = [];
p.on('pageerror', (e) => errors.push(e.message));
await p.goto('file://' + resolve(scene)); await p.waitForSelector('html[data-ready]');
const cover = await p.evaluate((ws) => { if (ws.length && window.setVoice) window.setVoice({ words: ws }); return window.COVER ?? 0; }, words);
const ts = [cover]; if (String(n).includes(',')) ts.push(...String(n).split(',').map(Number)); else for (let i = 0; i < +n; i++) ts.push(+(cover + .3 + i * (cfg.dur - cover - .6) / (+n - 1)).toFixed(2));
const shots = [];
for (const x of ts) { await p.evaluate((x) => window.seek(x), x); shots.push((await p.screenshot({ type: 'jpeg', quality: 70 })).toString('base64')); }
const scanT = [], scan = [];
const wide = new Map(), boxes = [], els = [];   // els: every element's box at every moment (ELEMENT SOUND, scripts/showreel/elsound.mjs)   // text -> first moment it overflowed; the layout at every moment (layout.mjs)
const fit = () => { const out = [], W = innerWidth, op = (e) => { let a = 1; for (; e && e.nodeType === 1; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return 0; a *= +cs.opacity; } return a; };
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
  while ((n = tw.nextNode())) { const s = n.textContent.trim(); if (!s || !n.parentElement || /^(SCRIPT|STYLE)$/.test(n.parentElement.tagName) || n.parentElement.closest('[data-fit=free]')) continue;
    const r = document.createRange(); r.selectNodeContents(n); const b = r.getBoundingClientRect(); if (b.width < 1 || op(n.parentElement) < .05) continue;
    let clip = null; for (let e = n.parentElement; e && e !== document.body; e = e.parentElement) { const o = getComputedStyle(e).overflowX; if (o !== 'visible') { clip = e.getBoundingClientRect(); break; } }
    const L = Math.max(clip ? clip.left : 12, 12), R = Math.min(clip ? clip.right : W - 12, W - 12);
    if (b.right > L - 1 && b.left < R + 1 && (b.left < L - 1 || b.right > R + 1)) out.push(s.slice(0, 40) + ' (' + Math.round(b.left) + '-' + Math.round(b.right) + ' px, box ' + Math.round(L) + '-' + Math.round(R) + ')'); }
  return out; };
for (let x = 0; x <= cfg.dur - .05; x += .5) { scanT.push(+x.toFixed(2)); await p.evaluate((x) => window.seek(x), x); scan.push((await p.screenshot({ type: 'jpeg', quality: 40 })).toString('base64'));
  boxes.push({ t: x, ...(await p.evaluate(`(${collectDom})()`)) }); els.push(await p.evaluate(`(${collectEls})()`));
  for (const w of await p.evaluate(fit)) { const k = w.replace(/ \(.*$/, ''); if (!wide.has(k)) wide.set(k, x.toFixed(1) + ' s: ' + w); } }
const spread = await p.evaluate(async (list) => { const c = document.createElement('canvas'); c.width = 54; c.height = 96; const g = c.getContext('2d', { willReadFrequently: true });
  const out = []; for (const b64 of list) { const im = new Image(); im.src = 'data:image/jpeg;base64,' + b64; await im.decode(); g.drawImage(im, 0, 0, 54, 96);
    const d = g.getImageData(0, 0, 54, 96).data; let s = 0, s2 = 0, n = d.length / 4; for (let i = 0; i < d.length; i += 4) { const l = .2126 * d[i] + .7152 * d[i + 1] + .0722 * d[i + 2]; s += l; s2 += l * l; }
    out.push(Math.sqrt(Math.max(0, s2 / n - (s / n) ** 2))); } return out; }, scan);
const empty = scanT.filter((x, i) => spread[i] < 5);
// Motion and fill (owner, 7 Nov 2026, after Nº 16 held one small phone still for 5 s): on the same 0.5 s scan, the mean pixel change between
// neighbouring moments (0-255 on a 108x192 copy) and, for frame 0, how much of the frame the subject covers (share of 20 px cells whose
// pixels differ from the background colour, read from the corners). A deliberate hold is marked in the scene: window.HOLDS = [[t0, t1], ...].
const vis = await p.evaluate(async (list) => { const c = document.createElement('canvas'); c.width = 108; c.height = 192; const g = c.getContext('2d', { willReadFrequently: true });
  const frames = []; for (const b64 of list) { const im = new Image(); im.src = 'data:image/jpeg;base64,' + b64; await im.decode(); g.drawImage(im, 0, 0, 108, 192); frames.push(g.getImageData(0, 0, 108, 192).data); }
  const diff = []; for (let i = 1; i < frames.length; i++) { const a = frames[i - 1], b = frames[i]; let s = 0; for (let j = 0; j < a.length; j += 4) s += (Math.abs(a[j] - b[j]) + Math.abs(a[j + 1] - b[j + 1]) + Math.abs(a[j + 2] - b[j + 2])) / 3; diff.push(s / (a.length / 4)); }
  const d = frames[0], px = (x, y) => (y * 108 + x) * 4, bg = [0, 1, 2].map((k) => Math.round(([px(1, 1), px(106, 1), px(1, 190), px(106, 190)].map((i) => d[i + k]).sort((m, n) => m - n)[1] + [px(1, 1), px(106, 1), px(1, 190), px(106, 190)].map((i) => d[i + k]).sort((m, n) => m - n)[2]) / 2));
  let on = 0, cells = 0; for (let cy = 0; cy < 192; cy += 4) for (let cx = 0; cx < 108; cx += 4) { cells++; let n = 0; for (let y = cy; y < cy + 4; y++) for (let x = cx; x < cx + 4; x++) { const i = px(x, y); if (Math.abs(d[i] - bg[0]) + Math.abs(d[i + 1] - bg[1]) + Math.abs(d[i + 2] - bg[2]) > 36) n++; } if (n >= 2) on++; }
  return { diff, fill: on / cells, holds: window.HOLDS || [] }; }, scan);
if (process.env.DIFFS) console.log("DIFFS " + vis.diff.map((d) => d.toFixed(1)).join(" "));   // DIFFS=1: every change value, to calibrate
const STILL = 1, held = (x) => vis.holds.some(([a, z]) => x >= a - .01 && x <= z + .01), stretches = [];
for (let i = 0, a = -1; i <= vis.diff.length; i++) { const quiet = i < vis.diff.length && vis.diff[i] < STILL && !(held(scanT[i]) && held(scanT[i + 1]));
  if (quiet && a < 0) a = i; if (!quiet && a >= 0) { if (scanT[i] - scanT[a] >= 2) stretches.push(scanT[a].toFixed(1) + '-' + scanT[i].toFixed(1) + ' s'); a = -1; } }
const FILL_MIN = .4, fill = Math.round(vis.fill * 100);
const lay = judge(boxes, !/channel3/.test(cfgPath));   // Turns Out draws on a canvas: BAND, HOOK and SUBTITLES are REVIEW items there
// FLOW (design/mandatory.md items 14-17; 7 Nov 2026): cuts, dead runs, continuity and strobes from the frame every 0.1 s (scripts/showreel/flow.mjs).
// Turns Out prints them from scripts/channel3/qa.mjs (its own thresholds), so they are not repeated here.
const snd = judgeSound(els, await p.evaluate(() => !!window.ELEMENT_SOUND));
const flow = /channel3/.test(cfgPath) ? { lines: [], bad: 0 } : judgeFlow(await sample(p, cfg.dur), channelOf(cfgPath));
await p.setViewportSize({ width: 1080, height: 100 });
await p.setContent(`<body style="margin:0;background:#111;display:grid;grid-template-columns:repeat(4,270px);gap:0;font:600 13px system-ui;color:#fff">${
  shots.map((s, i) => `<figure style="margin:0;position:relative"><img src="data:image/jpeg;base64,${s}" style="width:270px;display:block"><figcaption style="position:absolute;left:4px;top:4px;background:#000a;padding:1px 5px">${i ? ts[i].toFixed(1) + ' s' : 'cover'}</figcaption></figure>`).join('')}</body>`);
await p.screenshot({ path: `${out}/sheet.png`, fullPage: true });
await b.close();
console.log(`STILLS: ${ts.length} frames (cover ${cover} s) in ${out}/sheet.png; simulated voice ends ${t.toFixed(1)} s; page errors: ${errors.length ? errors.join(' | ') : 'none'}`);
console.log(`EMPTY FRAMES: ${empty.length ? empty.map((x) => x + ' s').join(', ') + ' (nearly one flat colour: fix before the render)' : 'none'} (scanned ${scanT.length} moments, least detail ${Math.min(...spread).toFixed(1)} at ${scanT[spread.indexOf(Math.min(...spread))]} s)`);
console.log(`STATIC STRETCH: ${stretches.length ? stretches.join(', ') + ' (under ' + STILL + ' mean change per 0.5 s for 2 s or more: give it a move, or mark a deliberate hold in window.HOLDS)' : 'none'} (least change ${Math.min(...vis.diff).toFixed(1)} at ${scanT[vis.diff.indexOf(Math.min(...vis.diff))]} s, median ${[...vis.diff].sort((a, b) => a - b)[vis.diff.length >> 1].toFixed(1)})`);
console.log(`SUBJECT FILL: ${fill}% at frame 0${fill < FILL_MIN * 100 ? ' (UNDER ' + FILL_MIN * 100 + '%: push the camera in so the subject fills the frame)' : ''}`);
console.log(`TEXT FIT: ${wide.size ? 'TEXT WIDER THAN ITS BOX: ' + [...wide.values()].join(' | ') : 'all text inside its box'}`);
for (const l of [...lay.lines, ...flow.lines, ...snd.lines]) console.log(l);
process.exit(lay.bad || flow.bad || snd.bad || errors.length || empty.length || wide.size || stretches.length || fill < FILL_MIN * 100 ? 1 : 0);
