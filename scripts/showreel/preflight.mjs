// Preflight for a narrated showreel (owner, 27 Oct 2026: one render per reel, no blind runs): estimates how long the voice will take
// before anything is dispatched, from the reel config alone. Kokoro af_heart reads about 75.5 ms per letter at speed 1 in one take,
// pauses included (5 renders, 26-27 Oct, within 3%); a "gap" config adds its breaths. The voice must end 0.6 s before the reel does.
// Usage: node scripts/showreel/preflight.mjs scripts/explainer/<slug>.json   (exit 1 when it does not fit)
// A web reel with a "palette" also gets the CONTRAST line (scripts/showreel/contrast.mjs; a few seconds of headless frames).
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const c = JSON.parse(readFileSync(process.argv[2], 'utf8')), v = c.voice || {};
// pronunciation (owner, 5 Nov 2026): the overrides the shared lexicon (scripts/voice/say.json) and the config's "say" apply, and every
// word with digits, hyphens or capitals that has no entry ("check: <word>"); a config "say" entry that matches no word fails
const pr = spawnSync('python3', [new URL('../voice/say.py', import.meta.url).pathname, process.argv[2]], { encoding: 'utf8' });
process.stdout.write(pr.stdout || `PRONUNCIATION: could not run scripts/voice/say.py: ${pr.stderr || pr.error}\n`);
if (pr.status !== 0) process.exitCode = 1;
// CONTRAST (11 Nov 2026; rules-web.md rule 12): a web reel with a palette (newweb.mjs writes it) has its captions and labels measured on
// rendered frames over the light (scripts/showreel/contrast.mjs): "CONTRAST: n.n:1 (palette)", under 4.5:1 fails
if (c.palette) { const ct = spawnSync('node', [new URL('./contrast.mjs', import.meta.url).pathname, process.argv[2]], { encoding: 'utf8' });
  process.stdout.write(ct.stdout || `CONTRAST: could not run scripts/showreel/contrast.mjs: ${ct.stderr || ct.error}\n`); if (ct.status !== 0) process.exitCode = 1; }
if (!v.text) { console.log('PREFLIGHT voice: no voice in this config'); process.exit(process.exitCode || 0); }
// a digit counts as 4 letters (31 Oct: "1889" is spoken "eighteen eighty nine"; letters alone made years free)
const spoken = (x) => (x.match(/[A-Za-z]/g) || []).length + 4 * (x.match(/\d/g) || []).length;
const text = v.text.replace(/\[([^\]]+)\]\(\/[^)]*\/\)/g, '$1'), letters = spoken(text), speed = +v.speed || 1;
const parts = (text.match(/(?:[^.?!]|\.(?=\d))+[.?!]?/g) || []).map((x) => x.trim()).filter(Boolean), sentences = parts.length;
// PACE (owner, 8 Nov 2026: the 4-5 detail 20 s web reel "feels rushed"; rules-web.md rule 13): a "details" reel (config format "details")
// times every sentence with voice.at (the hook, one per detail, the recap line); a beat runs from 0.3 s before its sentence to 0.3 s before
// the next. Fails when a detail beat is under 4.5 s, the voice is over 2.5 words/s overall (words / the voice's end), a breath between
// sentences is under 0.6 s, or the recap is under 3 s.
function pace(parts, at, speed, dur){
  if (c.format !== 'details') return true;
  if (!Array.isArray(at) || at.length < 3) { console.log('PACE: FAIL: a details reel times its sentences with voice.at (newweb.mjs --details writes it)'); return false; }
  const sd = (x) => .1 + spoken(x) * .07 / speed, ends = parts.map((x, i) => at[i] + sd(x)), words = parts.join(' ').split(/\s+/).filter(Boolean).length;
  const beats = at.slice(1, -1).map((s, i) => at[i + 2] - s), short = Math.min(...beats), wps = words / ends[ends.length - 1];
  const breath = Math.min(...at.slice(1).map((s, i) => s - ends[i])), recap = dur - (at[at.length - 1] - .3), bad = [];
  if (short < 4.5) bad.push(`a beat under 4.5 s`); if (wps > 2.5) bad.push(`over 2.5 words/s`); if (breath < .6) bad.push(`a breath under 0.6 s`); if (recap < 3) bad.push(`recap under 3 s`);
  console.log(`PACE: beats ${beats.length}, shortest beat ${short.toFixed(1)} s, words/s ${wps.toFixed(2)}, shortest breath ${breath.toFixed(2)} s, hook ${(at[1] - .3).toFixed(1)} s, recap ${recap.toFixed(1)} s: ${bad.length ? 'FAIL: ' + bad.join(', ') : 'ok'}`);
  return !bad.length; }
// voice.at (Channel 3, 31 Oct): every sentence starts at its own time; each must end 0.15 s before the next one starts
if (!Array.isArray(v.at) && !pace(parts, null, speed, +c.dur || 20)) process.exitCode = 1;
if (Array.isArray(v.at)) {
  if (v.at.length === sentences && !pace(parts, v.at, speed, +c.dur || 20)) process.exitCode = 1;
  if (v.at.length !== sentences) { console.log(`PREFLIGHT voice: TOO LONG/SHORT: voice.at has ${v.at.length} times for ${sentences} sentences`); process.exit(1); }
  const words = text.split(/\s+/).filter(Boolean).length, limit = (+c.dur || 20) - .6, bad = [];
  let end = 0;
  const sp = (i) => (Array.isArray(v.speeds) && +v.speeds[i]) || speed;
  const slots = parts.map((x, i) => { const s = v.at[i] ?? end + (+v.gap || .25), d = .1 + spoken(x) * .07 / sp(i); end = Math.max(s, end + (i ? .12 : 0)) + d; return [s, end]; });
  // SENTENCE PACE (11 Nov 2026: "Lock in your guess." was heard at 7.7 words/s, 0.52 s for 4 words, in the Eiffel reel): each sentence's
  // rate as the voice check will measure it (first word to last, so about 0.55 s shorter than the letter estimate; a comma adds about 0.3 s;
  // calibrated on that reel's 7 sentences); over 4 words/s fails. Fix: a slower "speeds" value for that sentence, or more words.
  const rates = parts.map((x, i) => { const n = x.split(/\s+/).filter(Boolean).length; return [n / Math.max(.3, spoken(x) * .07 / sp(i) - .55 + .3 * (x.match(/,/g) || []).length), i]; });
  const fast = rates.filter(([r]) => r > 4), top = rates.reduce((a, b) => (b[0] > a[0] ? b : a));
  console.log(`SENTENCE PACE: fastest ${top[0].toFixed(1)} words/s (sentence ${top[1] + 1}, "${parts[top[1]].slice(0, 30)}"): ${fast.length ? 'FAIL: over 4 words/s: ' + fast.map(([r, i]) => `sentence ${i + 1} ("${parts[i].slice(0, 30)}") ${r.toFixed(1)}`).join('; ') + ' (give it a slower voice.speeds value or more words)' : 'ok'}`);
  if (fast.length) process.exitCode = 1;
  if (Array.isArray(v.speeds) && v.speeds.length !== sentences) { console.log(`PREFLIGHT voice: voice.speeds has ${v.speeds.length} values for ${sentences} sentences`); process.exitCode = 1; }
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
