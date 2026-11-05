// Preflight for a narrated showreel (owner, 27 Oct 2026: one render per reel, no blind runs): estimates how long the voice will take
// before anything is dispatched, from the reel config alone. Kokoro af_heart reads about 75.5 ms per letter at speed 1 in one take,
// pauses included (5 renders, 26-27 Oct, within 3%); a "gap" config adds its breaths. The voice must end 0.6 s before the reel does.
// Usage: node scripts/showreel/preflight.mjs scripts/explainer/<slug>.json   (exit 1 when it does not fit)
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const c = JSON.parse(readFileSync(process.argv[2], 'utf8')), v = c.voice || {};
// pronunciation (owner, 5 Nov 2026): the overrides the shared lexicon (scripts/voice/say.json) and the config's "say" apply, and every
// word with digits, hyphens or capitals that has no entry ("check: <word>"); a config "say" entry that matches no word fails
const pr = spawnSync('python3', [new URL('../voice/say.py', import.meta.url).pathname, process.argv[2]], { encoding: 'utf8' });
process.stdout.write(pr.stdout || `PRONUNCIATION: could not run scripts/voice/say.py: ${pr.stderr || pr.error}\n`);
if (pr.status !== 0) process.exitCode = 1;
if (!v.text) { console.log('PREFLIGHT voice: no voice in this config'); process.exit(process.exitCode || 0); }
// a digit counts as 4 letters (31 Oct: "1889" is spoken "eighteen eighty nine"; letters alone made years free)
const spoken = (x) => (x.match(/[A-Za-z]/g) || []).length + 4 * (x.match(/\d/g) || []).length;
const text = v.text.replace(/\[([^\]]+)\]\(\/[^)]*\/\)/g, '$1'), letters = spoken(text), speed = +v.speed || 1;
const parts = (text.match(/(?:[^.?!]|\.(?=\d))+[.?!]?/g) || []).map((x) => x.trim()).filter(Boolean), sentences = parts.length;
// voice.at (Channel 3, 31 Oct): every sentence starts at its own time; each must end 0.15 s before the next one starts
if (Array.isArray(v.at)) {
  if (v.at.length !== sentences) { console.log(`PREFLIGHT voice: TOO LONG/SHORT: voice.at has ${v.at.length} times for ${sentences} sentences`); process.exit(1); }
  const words = text.split(/\s+/).filter(Boolean).length, limit = (+c.dur || 20) - .6, bad = [];
  let end = 0;
  const slots = parts.map((x, i) => { const s = v.at[i] ?? end + (+v.gap || .25), d = .1 + spoken(x) * .07 / speed; end = Math.max(s, end + (i ? .12 : 0)) + d; return [s, end]; });
  slots.forEach(([s, e], i) => { const next = i + 1 < sentences ? (v.at[i + 1] ?? e + .25) - .15 : limit; if (e > next) bad.push(`sentence ${i + 1} ("${parts[i].slice(0, 30)}") ends about ${e.toFixed(1)} s, ${(e - next).toFixed(1)} s past its slot`); });
  const talk = slots.reduce((a, [s, e]) => a + e - s, 0);
  console.log(`PREFLIGHT voice: ${sentences} timed sentences, ${words} words, voice ends about ${end.toFixed(1)} s (reel ${c.dur} s, must end by ${limit.toFixed(1)} s), ${(words / talk).toFixed(1)} words/s while speaking, ${(words / end).toFixed(1)} overall: ${bad.length ? 'TOO LONG: ' + bad.join('; ') : 'fits'}`);
  process.exit(bad.length || process.exitCode ? 1 : 0);
}
const gaps = Array.isArray(v.gap) ? v.gap.slice(0, sentences - 1).reduce((a, b) => a + b, 0) : (+v.gap || 0) * (sentences - 1);
// with breaths each sentence is trimmed of the model's own pauses, so letters read faster (about 68 ms each, less calibrated than one take)
const est = .2 + letters * (gaps ? .068 : .0765) / speed + gaps, limit = (+c.dur || 20) - .6;
const verdict = est <= limit - .2 ? 'fits' : est <= limit ? 'tight (within 0.2 s): trim a word to be safe' : `TOO LONG: trim about ${Math.ceil((est - limit + .3) * speed / .0765)} letters`;
console.log(`PREFLIGHT voice: ${letters} letters, ${sentences} sentences, about ${est.toFixed(1)} s at speed ${speed}${gaps ? ` with ${gaps.toFixed(2)} s of breaths` : ' in one take'} (reel ${c.dur} s, voice must end by ${limit.toFixed(1)} s): ${verdict}`);
process.exit(est <= limit && !process.exitCode ? 0 : 1);
