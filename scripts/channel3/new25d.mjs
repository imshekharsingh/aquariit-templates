// Starts a Turns Out reel (design/channel3.md "Story engine", design/rules-c3.md rule S). Three starters:
//   (default) the STORY engine, 14 Nov 2026 (the owner's reference kit; "make the content rich in learning and information; people stay
//     engaged with good and smart storytelling"): copies scripts/channel3/starterstory.html. The lines are the beats, in order:
//     node scripts/channel3/new25d.mjs <slug> "Payoff (6 words max)." "One question?" "Step one fact." "Step two fact." ["Step three fact."] "Turns out, the surprise."
//     payoff = the "wait, what?" statement said over the payoff picture in frame 0; question = ONE question the rest answers; 2-3 steps =
//     one concrete sourced fact each; the surprise worth saving, starting "Turns out". One shot per beat (Kt.shots), a colour mood each,
//     camera moves between them, real media full-bleed (the config's "media": one entry per shot, ids payoff, question, step1-3, surprise).
//   --guess (11 Nov 2026, design/rules-c3.md rule 1, while the E19 guess experiment runs): copies scripts/channel3/starterguess.html:
//     node scripts/channel3/new25d.mjs <slug> --guess "Question?" "A, B, or C?" "Lock in your guess." "Answer." "Why." "More." "Turns out, ..."
//     options as chips, the subject neutral until the answer, a 3-2-1 countdown, window.GUESS (qa.mjs GUESS checks the frames).
//   --drawn: the older drawn 2.5D starter (scripts/channel3/starter25d.html: stations, a globe, a map move), any 3+ sentences.
// All of them write <slug>.json (name, timing, empty post text and sources to fill) and inline the current kit (kit-inline.mjs). Then:
// fill the scene's TODOs and the config, add the captions.json entry, node scripts/channel3/qa.mjs scripts/channel3/<slug>.json --write.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const argv = process.argv.slice(2), guess = argv.includes('--guess'), drawn = argv.includes('--drawn'), [slug, ...lines] = argv.filter((a) => !/^--(guess|drawn)$/.test(a));
const storyArc = !guess && !drawn;
if (!/^[a-z0-9-]{2,40}$/.test(slug || '') || lines.length < 3) { console.error('usage: node scripts/channel3/new25d.mjs <slug> "Payoff." "Question?" "Step." "Step." ["Step."] "Turns out, ..." (or --guess / --drawn)'); process.exit(1); }
const dir = new URL('./', import.meta.url).pathname, html = `${dir}${slug}.html`, cfg = `${dir}${slug}.json`, name = `showreel-c3-${slug}`;
if (existsSync(html) || existsSync(cfg)) { console.error(`${slug} already exists`); process.exit(1); }
const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
if (guess && (lines.length < 6 || !/,/.test(lines[1]))) { console.error('--guess needs: "Question?" "A, B, or C?" "Lock in your guess." "Answer." "Why." ... "Turns out, ..."'); process.exit(1); }
if (storyArc) { const bad = [];
  if (lines.length < 5 || lines.length > 6) bad.push(`5 or 6 lines (payoff, question, 2-3 steps, surprise), got ${lines.length}`);
  if (lines[0].split(/\s+/).length > 6) bad.push('the payoff line is 6 words or fewer (preflight HOOK PACE)');
  if (!/\?$/.test(lines[1] || '') || lines.slice(2).some((l) => /\?$/.test(l))) bad.push('line 2 is the ONE question (ends with "?"), no other line is a question');
  if (!/^turns out\b/i.test(lines[lines.length - 1])) bad.push('the last line is the surprise, starting "Turns out"');
  if (bad.length) { console.error('story arc: ' + bad.join('; ')); process.exit(1); } }
// breaths before each line: guess = the countdown in a 2.6 s breath before the answer, a 1.3 s hold on it; story = a beat after the payoff
// and the question, a breath before the surprise. Natural speed 1.0 for every line (owner, 12 Nov 2026): a line that reads quick is made
// shorter or split, never slowed (preflight SENTENCE PACE warns on short lines)
const breath = (i) => (i === 0 ? 0 : guess ? [0, .5, .7, 2.6, 1.3][i] ?? .5 : storyArc ? (i === 1 ? .6 : i === 2 ? .55 : i === lines.length - 1 ? .7 : .45) : i === 1 ? .9 : .45);
const story = '[' + lines.map((l, i) => `['${esc(l)}', ${breath(i)}]`).join(', ') + ']';
let s = readFileSync(`${dir}${guess ? 'starterguess' : drawn ? 'starter25d' : 'starterstory'}.html`, 'utf8'), guessCol = '';
if (guess) { const words = lines[1].replace(/[?.!]/g, '').split(/,\s*(?:or\s+)?|\s+or\s+/).map((w) => w.trim()).filter(Boolean), cols = ['#e0b13e', '#8e939a', '#b3392b', '#3f7fbf'];
  s = s.replace(/var OPTS = \[[^\]]*\], ANSWER = \d+;/, () => `var OPTS = [${words.map((w, i) => `{ key: '${'ABCD'[i]}', word: '${esc(w.toUpperCase())}', col: '${cols[i % 4]}' }`).join(', ')}], ANSWER = ${Math.max(0, words.findIndex((w) => lines[3].toLowerCase().startsWith(w.toLowerCase())))};`);
  guessCol = cols[Math.max(0, words.findIndex((w) => lines[3].toLowerCase().startsWith(w.toLowerCase()))) % 4]; }   // Output QA's GUESS check (scripts/qa/output-qa.py) reads it from the config
s = s.replace(/\/\*story\*\/[\s\S]*?\/\*story:end\*\//, () => `/*story*/${story}/*story:end*/`).replaceAll('__HOOK__', lines[0].replace(/[<>&"]/g, '')).replaceAll('__NAME__', name).replace('__DATE__', new Date().toISOString().slice(0, 10));
writeFileSync(html, s);
const ids = ['payoff', 'question', 'step1', 'step2', 'step3'].slice(0, lines.length - 1).concat('surprise');
const media = storyArc ? ids.map((id) => ({ id, queries: [`TODO ${id}: what the photo shows`], sources: ['wikimedia', 'loc', 'nasa', 'openverse'], min_side: 1600, avoid: ['logo'] })) : undefined;
writeFileSync(cfg, JSON.stringify({ name, seek: `scripts/channel3/${slug}.html`, dur: 30, fps: 30, grain: 4,
  voice: { text: lines.join(' '), at: [], voice: 'af_heart', speed: 1 }, caption: '', keywords: [], hashtags: [], sources: [],
  ...(media ? { media, qa: { subject: [60, 330, 450, 640], edges_ok: [{ from: 0, to: 30, sides: ['left', 'right', 'top', 'bottom'], why: 'the story engine: full-bleed real media fills the whole frame by design' }] } } : {}),
  ...(guess ? { qa: { guess: { answer: guessCol, reveal: { say: lines[3].split(/\s+/).slice(0, 1).concat(lines[4].split(/\s+/).slice(0, 1)).join(' ').replace(/[^\w' ]/g, '') }, box: [150, 270, 390, 690], css_width: 540 } } } : {}) }, null, 1) + '\n');
execFileSync('node', [`${dir}kit-inline.mjs`, html], { stdio: 'inherit' });
console.log(`NEW: ${html} and ${cfg}. Next: ${storyArc ? 'fill the media list (one photo per shot), run the Media workflow, copy MEDIA_JSON back; set each shot\'s view, focus and big words' : 'draw the world (stations, subject, kinetic type)'};
fill caption (CC BY credits in it), 6+ keywords, 5 hashtags and 2+ sources, add the captions.json entry, then node scripts/channel3/qa.mjs scripts/channel3/${slug}.json --write`);
