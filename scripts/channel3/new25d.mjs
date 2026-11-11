// Starts a Turns Out 2.5D reel from the starter (todo P1 "reusable story layouts", 3 Nov 2026): copies scripts/channel3/starter25d.html
// (shared core, the 2.5D kit, a station, a globe station and a map move with a route, all one camera, hook, captions, kinetic type, credit, payoff, sound cues) to
// scripts/channel3/<slug>.html with the story filled in, writes <slug>.json (name, timing, empty post text and sources to fill), and
// inlines the current kit. Then: draw the story's world in the scene, fill the config, `node scripts/channel3/qa.mjs <config> --write`.
// Usage: node scripts/channel3/new25d.mjs <slug> "Hook question?" "Sentence two." ... ("Turns out, ..." last)
// The GUESS format (11 Nov 2026, design/rules-c3.md rule 1): node scripts/channel3/new25d.mjs <slug> --guess "Question?" "Gold, grey, or red?"
//   "Lock in your guess." "Red." "Why." "One more fact." "Turns out, ..." copies scripts/channel3/starterguess.html (the Eiffel reel, a working
//   guess reel: options as chips painted onto the icon, a 3-2-1 countdown in a 2.6 s breath, the answer, three worlds and a loop back to frame 0).
//   The options are read from sentence 2 (comma-separated words); set ANSWER (index) and each option's colour in the scene, then redraw the worlds.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const argv = process.argv.slice(2), guess = argv.includes('--guess'), [slug, ...lines] = argv.filter((a) => a !== '--guess');
if (!/^[a-z0-9-]{2,40}$/.test(slug || '') || lines.length < 3) { console.error('usage: node scripts/channel3/new25d.mjs <slug> "Hook?" "Sentence." ... (3+ sentences)'); process.exit(1); }
const dir = new URL('./', import.meta.url).pathname, html = `${dir}${slug}.html`, cfg = `${dir}${slug}.json`;
if (existsSync(html) || existsSync(cfg)) { console.error(`${slug} already exists`); process.exit(1); }
const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
if (guess && (lines.length < 6 || !/,/.test(lines[1]))) { console.error('--guess needs: "Question?" "A, B, or C?" "Lock in your guess." "Answer." "Why." ... "Turns out, ..."'); process.exit(1); }
const breath = (i) => (i === 0 ? 0 : guess ? [0, .5, .45, 2.6, 1.3][i] ?? .5 : i === 1 ? .9 : .45);   // guess: the countdown sits in the 2.6 s breath before the answer, a 1.3 s hold on it
const story = '[' + lines.map((l, i) => `['${esc(l)}', ${breath(i)}]`).join(', ') + ']';
let s = readFileSync(`${dir}${guess ? 'starterguess' : 'starter25d'}.html`, 'utf8');
if (guess) { const words = lines[1].replace(/[?.!]/g, '').split(/,\s*(?:or\s+)?|\s+or\s+/).map((w) => w.trim()).filter(Boolean), cols = ['#e0b13e', '#8e939a', '#b3392b', '#3f7fbf'];
  s = s.replace(/var OPTS = \[[^\]]*\], ANSWER = \d+;/, () => `var OPTS = [${words.map((w, i) => `{ key: '${'ABCD'[i]}', word: '${esc(w.toUpperCase())}', col: '${cols[i % 4]}' }`).join(', ')}], ANSWER = ${Math.max(0, words.findIndex((w) => lines[3].toLowerCase().startsWith(w.toLowerCase())))};`); }
s = s.replace(/\/\*story\*\/[\s\S]*?\/\*story:end\*\//, () => `/*story*/${story}/*story:end*/`).replaceAll('__HOOK__', lines[0].replace(/[<>&"]/g, '')).replace('__DATE__', new Date().toISOString().slice(0, 10));
writeFileSync(html, s);
writeFileSync(cfg, JSON.stringify({ name: `showreel-c3-${slug}`, seek: `scripts/channel3/${slug}.html`, dur: 30, fps: 30, grain: 4,
  voice: { text: lines.join(' '), at: [], voice: 'af_heart', speed: .95 }, caption: '', keywords: [], hashtags: [], sources: [] }, null, 1) + '\n');
execFileSync('node', [`${dir}kit-inline.mjs`, html], { stdio: 'inherit' });
console.log(`NEW: ${html} and ${cfg}. Next: draw the world (stations, subject, kinetic type), fill caption, 6+ keywords, 5 hashtags and 2+ sources,
add the captions.json entry, then node scripts/channel3/qa.mjs scripts/channel3/${slug}.json --write`);
