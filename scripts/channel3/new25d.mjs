// Starts a Turns Out 2.5D reel from the starter (todo P1 "reusable story layouts", 3 Nov 2026): copies scripts/channel3/starter25d.html
// (shared core, the 2.5D kit, a station, a globe station and a map move with a route, all one camera, hook, captions, kinetic type, credit, payoff, sound cues) to
// scripts/channel3/<slug>.html with the story filled in, writes <slug>.json (name, timing, empty post text and sources to fill), and
// inlines the current kit. Then: draw the story's world in the scene, fill the config, `node scripts/channel3/qa.mjs <config> --write`.
// Usage: node scripts/channel3/new25d.mjs <slug> "Hook question?" "Sentence two." ... ("Turns out, ..." last)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const [slug, ...lines] = process.argv.slice(2);
if (!/^[a-z0-9-]{2,40}$/.test(slug || '') || lines.length < 3) { console.error('usage: node scripts/channel3/new25d.mjs <slug> "Hook?" "Sentence." ... (3+ sentences)'); process.exit(1); }
const dir = new URL('./', import.meta.url).pathname, html = `${dir}${slug}.html`, cfg = `${dir}${slug}.json`;
if (existsSync(html) || existsSync(cfg)) { console.error(`${slug} already exists`); process.exit(1); }
const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const story = '[' + lines.map((l, i) => `['${esc(l)}', ${i === 0 ? 0 : i === 1 ? .9 : .45}]`).join(', ') + ']';
let s = readFileSync(`${dir}starter25d.html`, 'utf8');
s = s.replace(/\/\*story\*\/[\s\S]*?\/\*story:end\*\//, () => `/*story*/${story}/*story:end*/`).replaceAll('__HOOK__', lines[0].replace(/[<>&"]/g, '')).replace('__DATE__', new Date().toISOString().slice(0, 10));
writeFileSync(html, s);
writeFileSync(cfg, JSON.stringify({ name: `showreel-c3-${slug}`, seek: `scripts/channel3/${slug}.html`, dur: 30, fps: 30, grain: 4,
  voice: { text: lines.join(' '), at: [], voice: 'af_heart', speed: .95 }, caption: '', keywords: [], hashtags: [], sources: [] }, null, 1) + '\n');
execFileSync('node', [`${dir}kit-inline.mjs`, html], { stdio: 'inherit' });
console.log(`NEW: ${html} and ${cfg}. Next: draw the world (stations, subject, kinetic type), fill caption, 6+ keywords, 5 hashtags and 2+ sources,
add the captions.json entry, then node scripts/channel3/qa.mjs scripts/channel3/${slug}.json --write`);
