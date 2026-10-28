// Preflight for a narrated showreel (owner, 27 Oct 2026: one render per reel, no blind runs): estimates how long the voice will take
// before anything is dispatched, from the reel config alone. Kokoro af_heart reads about 75.5 ms per letter at speed 1 in one take,
// pauses included (5 renders, 26-27 Oct, within 3%); a "gap" config adds its breaths. The voice must end 0.6 s before the reel does.
// Usage: node scripts/showreel/preflight.mjs scripts/explainer/<slug>.json   (exit 1 when it does not fit)
import { readFileSync } from 'node:fs';
const c = JSON.parse(readFileSync(process.argv[2], 'utf8')), v = c.voice || {};
if (!v.text) { console.log('PREFLIGHT voice: no voice in this config'); process.exit(0); }
const text = v.text.replace(/\[([^\]]+)\]\(\/[^)]*\/\)/g, '$1'), letters = (text.match(/[A-Za-z]/g) || []).length, speed = +v.speed || 1;
const sentences = (text.match(/[^.?!]+[.?!]?/g) || []).filter((x) => x.trim()).length;
const gaps = Array.isArray(v.gap) ? v.gap.slice(0, sentences - 1).reduce((a, b) => a + b, 0) : (+v.gap || 0) * (sentences - 1);
// with breaths each sentence is trimmed of the model's own pauses, so letters read faster (about 68 ms each, less calibrated than one take)
const est = .2 + letters * (gaps ? .068 : .0765) / speed + gaps, limit = (+c.dur || 20) - .6;
const verdict = est <= limit - .2 ? 'fits' : est <= limit ? 'tight (within 0.2 s): trim a word to be safe' : `TOO LONG: trim about ${Math.ceil((est - limit + .3) * speed / .0765)} letters`;
console.log(`PREFLIGHT voice: ${letters} letters, ${sentences} sentences, about ${est.toFixed(1)} s at speed ${speed}${gaps ? ` with ${gaps.toFixed(2)} s of breaths` : ' in one take'} (reel ${c.dur} s, voice must end by ${limit.toFixed(1)} s): ${verdict}`);
process.exit(est <= limit ? 0 : 1);
