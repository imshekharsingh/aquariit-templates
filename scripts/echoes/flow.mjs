// FLOW for an Echoes engine scene (design/mandatory.md items 14-17): stills.mjs leaves FLOW to scripts/channel3/qa.mjs for Turns Out,
// whose 2.5D kit an Echoes scene does not use. This times the scene to the simulated voice (as stills.mjs) and prints the same
// FLOW lines (scripts/showreel/flow.mjs: cuts, dead runs, continuity, strobes, on a 0.1 s scan), honouring window.TRANSITIONS and HOLDS.
// Usage: node scripts/echoes/flow.mjs scripts/channel3/<slug>.json
import { readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createRequire } from 'node:module';
import { sample, judgeFlow, simWords } from '../showreel/flow.mjs';
const { chromium } = createRequire(process.env.PW_FROM || join(process.cwd(), 'node_modules/'))('playwright');
const cfgPath = process.argv[2], cfg = JSON.parse(readFileSync(cfgPath, 'utf8')), { words } = simWords(cfg);
const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 540, height: 960 } }), errs = [];
p.on('pageerror', (e) => errs.push(e.message));
await p.goto('file://' + resolve(cfg.seek)); await p.waitForSelector('html[data-ready]');
const end = await p.evaluate((ws) => { window.setVoice({ words: ws }); return window.CUES.dur; }, words);
const f = judgeFlow(await sample(p, end), 'c3');
for (const l of f.lines) console.log(l);
console.log(`(scanned 0-${end.toFixed(1)} s: the video ends 3 s after the last word)` + (errs.length ? `; page errors: ${errs.join('; ')}` : ''));
await b.close();
process.exit(f.bad || errs.length ? 1 : 0);
