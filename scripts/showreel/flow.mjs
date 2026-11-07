// FLOW: motion quality, not only defects (owner, 7 Nov 2026: "Can we further improve the overall animation and flow? Are the gates just a
// low-expectations check?"). The Mandatory Gate's STATIC STRETCH (0.5 s sampling, a low threshold) let a reel with hard jumps, strobes and
// 1-2.5 s still runs pass. This reads the reel the way a viewer feels it: the frame every 0.1 s, the mean absolute RGB difference (0-255) between
// neighbouring frames on a 54x96 copy of the 540x960 picture, then four lines (design/mandatory.md items 14-17):
//   FLOW: cuts N        steps above CUT (a hard jump) not inside a declared transition, window.TRANSITIONS = [[t0, t1, 'kind'], ...]. Pass = 0.
//   FLOW: dead runs     runs of DEAD_RUN s or more where every step is under DEAD (nothing moves), outside window.HOLDS. Pass = none.
//   FLOW: continuity    the share of time whose change (0.3 s average) is between DEAD and CUT (always moving, never jumping); declared
//                       transitions are left out of the count, holds are not. Pass >= CONT.
//   FLOW: strobes       full-frame flashes: a step above STROBE and back within 0.3 s (the frame two steps on looks like the one before).
//                       Pass = at most 1, and it must be declared (a transition of kind 'flash').
// Thresholds per channel (FLOW below): calibrated 7 Nov 2026 on the best reels (table in design/mandatory.md, "FLOW calibration").
// Usage: node scripts/showreel/flow.mjs <config.json> [--diffs]   (web and Turns Out scenes; stills.mjs and channel3/qa.mjs print the same lines;
// techreel/make.py --stills prints them for @techin20sec). Exit 1 when a line fails.
import { readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createRequire } from 'node:module';

export const STEP = .1;
export const FLOW = {
  web: { CUT: 25, DEAD: .5, DEAD_RUN: 1, CONT: .85, STROBE: 60 },
  tech: { CUT: 25, DEAD: .5, DEAD_RUN: 1, CONT: .85, STROBE: 60 },
  c3: { CUT: 25, DEAD: .3, DEAD_RUN: 1, CONT: .85, STROBE: 60 },   // 2.5D paper: the slow parallax drift moves 0.2-0.5 a step (Sahara)
};
export const channelOf = (cfgPath) => /channel3/.test(cfgPath) ? 'c3' : /techreel/.test(cfgPath) ? 'tech' : 'web';

// the simulated voice (letters per word at the preflight rate, breaths after sentences) that stills.mjs times the scene's captions to
export const simWords = (cfg) => {
  const sp = +cfg.voice?.speed || 1, AT = cfg.voice?.at; let t = .1, si = 0;
  const words = (cfg.voice?.text || '').split(/\s+/).filter(Boolean).map((w, i, all) => {
    if (AT && (i === 0 || /[.?!]$/.test(all[i - 1]))) { if (AT[si] != null) t = Math.max(t, AT[si]); si++; }
    const d = w.replace(/[^A-Za-z]/g, '').length * .0765 / sp * .62, o = { w, s: t, e: t + d };
    t += d + (/[.?!]$/.test(w) ? .55 : /,$/.test(w) ? .3 : .06); return o;
  });
  return { words, end: t };
};

// the steps: seeks every 0.1 s of a page already showing the scene (540x960 viewport), returns { t: [step start], d: [step], back: { i: [j, change] } }
export const sample = async (p, dur) => {
  const shots = [];
  for (let i = 0; i * STEP <= dur - .05 + 1e-9; i++) { await p.evaluate((x) => window.seek(x), +(i * STEP).toFixed(2)); shots.push((await p.screenshot({ type: 'jpeg', quality: 60 })).toString('base64')); }
  const r = await p.evaluate(async (list) => { const c = document.createElement('canvas'); c.width = 54; c.height = 96; const g = c.getContext('2d', { willReadFrequently: true });
    const fr = []; for (const b64 of list) { const im = new Image(); im.src = 'data:image/jpeg;base64,' + b64; await im.decode(); g.drawImage(im, 0, 0, 54, 96); fr.push(g.getImageData(0, 0, 54, 96).data); }
    const md = (a, b) => { let s = 0; for (let j = 0; j < a.length; j += 4) s += (Math.abs(a[j] - b[j]) + Math.abs(a[j + 1] - b[j + 1]) + Math.abs(a[j + 2] - b[j + 2])) / 3; return s / (a.length / 4); };
    const d = []; for (let i = 1; i < fr.length; i++) d.push(md(fr[i - 1], fr[i]));
    // a flash and back: for each big step i, the next big step j within 1 s, and how far the frame after j is from the frame before i
    const back = {}; for (let i = 0; i < d.length; i++) if (d[i] > 60) for (let j = i + 1; j <= i + 10 && j < d.length; j++) if (d[j] > 60) { back[i] = [j, md(fr[i], fr[j + 1])]; break; }
    return { d, back, holds: window.HOLDS || [], transitions: window.TRANSITIONS || [] }; }, shots);
  return { ...r, t: r.d.map((_, i) => +(i * STEP).toFixed(2)) };
};

// steps -> { lines, bad, stats }. A step i covers [t[i], t[i] + 0.1].
export const judgeFlow = ({ t, d, back = {}, holds = [], transitions = [] }, ch = 'web') => {
  const F = FLOW[ch] || FLOW.web, E = .051, inAny = (win, a) => win.some(([x, z]) => a >= x - E && a + STEP <= z + E), touches = (win, a) => win.some(([x, z]) => a + STEP > x - E && a < z + E);
  const held = (i) => inAny(holds, t[i]), declared = (i) => touches(transitions, t[i]);
  // strobes: up above STROBE and back within 1 s (the frame after the second big step looks like the one before the first)
  const strobe = new Set(), strobes = [];
  for (let i = 0; i < d.length; i++) if (d[i] > F.STROBE && !strobe.has(i) && back[i]) { const [j, ch] = back[i];
    if (d[j] > F.STROBE && ch < Math.min(d[i], d[j]) * .5) { strobe.add(i); strobe.add(j);
      strobes.push({ t: t[i], t1: t[j], peak: Math.max(d[i], d[j]), ok: transitions.some(([x, z, k]) => k === 'flash' && t[i] + STEP > x - E && t[i] < z + E) }); } }
  // cuts: steps above CUT that arrive from slow motion (the step before is under half of CUT: a jump, not a whip that eases up to speed),
  // or any step above STROBE; outside a declared transition (neighbouring steps are one cut)
  const cuts = []; for (let i = 0; i < d.length; i++) if (d[i] > F.CUT && (d[i] > F.STROBE || i === 0 || d[i - 1] < F.CUT / 2) && !declared(i) && !strobe.has(i)) { const last = cuts[cuts.length - 1]; if (last && last.i === i - 1) { last.i = i; last.peak = Math.max(last.peak, d[i]); } else cuts.push({ i, t: t[i], peak: d[i] }); }
  // dead runs: DEAD_RUN s or more of steps under DEAD (a hold breaks the run)
  const dead = []; for (let i = 0, a = -1; i <= d.length; i++) { const q = i < d.length && d[i] < F.DEAD && !held(i);
    if (q && a < 0) a = i; if (!q && a >= 0) { const len = (i - a) * STEP; if (len >= F.DEAD_RUN - 1e-6) dead.push({ t0: t[a], t1: +(t[a] + len).toFixed(2), len }); a = -1; } }
  // continuity: the change over 0.3 s around each step (three steps averaged: a counter that ticks every 0.2 s is moving) in the band;
  // declared transitions left out; a hold still counts as still time (HOLDS excuse a dead run, not the continuity score)
  const avg = (i) => (d[Math.max(0, i - 1)] + d[i] + d[Math.min(d.length - 1, i + 1)]) / 3;
  let n = 0, ok = 0; for (let i = 0; i < d.length; i++) { if (declared(i) || strobe.has(i)) continue; n++; const m = avg(i); if (m >= F.DEAD && m <= F.CUT) ok++; }
  const cont = n ? ok / n : 1, sorted = [...d].sort((a, b) => a - b), med = sorted[sorted.length >> 1] || 0, undeclared = strobes.filter((s) => !s.ok).length;
  const f1 = (x) => x.toFixed(1);
  const lines = [
    `FLOW: cuts ${cuts.length}${cuts.length ? ' (undeclared jumps over ' + F.CUT + ': ' + cuts.map((c) => f1(c.t) + ' s (' + Math.round(c.peak) + ')').join(', ') + '; make it a continuous move, or declare it in window.TRANSITIONS)' : ''}`,
    `FLOW: dead runs ${dead.length ? dead.map((r) => f1(r.t0) + '-' + f1(r.t1) + ' s').join(', ') + ' (under ' + F.DEAD + ' for ' + F.DEAD_RUN + ' s or more: keep something moving, or mark a deliberate hold in window.HOLDS)' : 'none'}`,
    `FLOW: continuity ${Math.round(cont * 100)}%${cont < F.CONT ? ' (UNDER ' + F.CONT * 100 + '%: too much time still or jumping)' : ''} (median step ${f1(med)}, ${transitions.length} declared transition${transitions.length === 1 ? '' : 's'})`,
    `FLOW: strobes ${strobes.length}${strobes.length ? ' (' + strobes.map((s) => f1(s.t) + '-' + f1(s.t1 + STEP) + ' s (' + Math.round(s.peak) + (s.ok ? ', declared' : ', NOT DECLARED') + ')').join(', ') + ')' : ''}${strobes.length > 1 ? ' (at most 1)' : ''}`,
  ];
  const bad = cuts.length + dead.length + (cont < F.CONT ? 1 : 0) + undeclared + (strobes.length > 1 ? 1 : 0);
  return { lines, bad, stats: { cuts: cuts.length, cutMax: Math.round(Math.max(0, ...cuts.map((c) => c.peak))), dead: dead.length, deadMax: Math.max(0, ...dead.map((r) => r.len)), cont: Math.round(cont * 100), strobes: strobes.length, med: +f1(med), max: Math.round(sorted[sorted.length - 1] || 0) } };
};

// CLI: one scene's FLOW lines (a web scene gets the simulated voice, as in stills.mjs; a Turns Out scene times itself)
if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) {
  const { chromium } = createRequire(process.env.PW_FROM || join(process.cwd(), 'node_modules/'))('playwright');
  const cfgPath = process.argv[2], cfg = JSON.parse(readFileSync(cfgPath, 'utf8')), ch = channelOf(cfgPath);
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }), p = await b.newPage({ viewport: { width: 540, height: 960 } });
  await p.goto('file://' + resolve(cfg.seek || cfgPath.replace(/\.json$/, '.html'))); await p.waitForSelector('html[data-ready]', { timeout: 60000 });
  const { words } = simWords(cfg); if (ch === 'web') await p.evaluate((ws) => { if (ws.length && window.setVoice) window.setVoice({ words: ws }); }, words);
  const s = await sample(p, +cfg.dur); await b.close();
  const r = judgeFlow(s, ch);
  if (process.argv.includes('--diffs')) console.log('STEPS ' + s.d.map((x) => x.toFixed(1)).join(' '));
  for (const l of r.lines) console.log(l);
  console.log('FLOW STATS ' + JSON.stringify(r.stats));
  process.exit(r.bad ? 1 : 0);
}
