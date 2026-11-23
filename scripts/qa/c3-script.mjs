// Turns Out design series: the script and the "before" (owner, 23 Nov 2026 night: "audio doesn't feel natural and effectively aligned.
// Before and after has before like no one starts in that manner"). Every complaint is a check (CLAUDE.md): this runs in npm run check.
// A design config with "dt": 2 (the improved kit; rules-c3.md V1-V3, B1-B2) must have:
//   V1  spoken sentences: at most one sentence under 4 words, no "Fix one:" / "Move two:" label sentences (they read as a list, clipped)
//   V2  breaths: voice.gap set, every breath 0.2 s or more (each sentence is spoken on its own and lands on its change)
//   V3  the first sentence 6 words or fewer; 2.8 words a second at most over the voice's own time
//   B1  "before": { "mistake": what a real first draft gets wrong, in words, "source": https link that names it as a common mistake }
// A design reel that waits for the owner's go ("onGo" in captions.json) must be dt 2, unless it was posted before this check existed.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..'), bad = [];
const POSTED_BEFORE = ['menu-spacing', 'stop-centring', 'tap-targets', 'line-length', 'event-poster', 'resume', 'card-margins'].map((x) => 'showreel-c3-' + x);
const caps = JSON.parse(readFileSync(join(root, 'templates/showreels/captions.json'), 'utf8'));
const files = [];
for (const dir of ['scripts/channel3', 'scripts/previews']) { const D = join(root, dir); if (existsSync(D)) for (const f of readdirSync(D)) if (f.endsWith('.json')) files.push(`${dir}/${f}`); }
let n2 = 0;
for (const f of files) {
  let c; try { c = JSON.parse(readFileSync(join(root, f), 'utf8')); } catch { continue; }
  if (c.engine !== 'design' || !c.voice || !c.voice.text) continue;
  const e = caps[c.name] || {};
  if (c.dt !== 2) { if (e.onGo && !POSTED_BEFORE.includes(c.name)) bad.push(`${f}: a design reel waiting for the owner's go must be on the improved kit ("dt": 2), or held ("hidden": true with "hold")`); continue; }
  n2++;
  const sents = c.voice.text.match(/[^.?!]+[.?!]+/g).map((s) => s.trim()), words = (s) => s.split(/\s+/).filter(Boolean).length;
  const short = sents.filter((s) => words(s) < 4), labels = sents.filter((s) => /^(fix|move|lever|step|tip)\s+(one|two|three|four|five|\d)\s*[:,.]/i.test(s));
  if (short.length > 1) bad.push(`${f}: V1 ${short.length} sentences under 4 words (${short.map((s) => '"' + s + '"').join(', ')}): write spoken sentences, at most one short one`);
  if (labels.length) bad.push(`${f}: V1 label sentences (${labels.map((s) => '"' + s + '"').join(', ')}): say "First, ...", "Next, ...", "Then ..." inside a full sentence`);
  const g = c.voice.gap, gs = Array.isArray(g) ? g : [g];
  if (g == null || gs.some((x) => !(x >= .2))) bad.push(`${f}: V2 voice.gap missing or under 0.2 s: one breath after every sentence`);
  if (Array.isArray(g) && g.length !== sents.length - 1 && g.length !== sents.length) bad.push(`${f}: V2 voice.gap has ${g.length} breaths for ${sents.length} sentences`);
  if (words(sents[0]) > 6) bad.push(`${f}: V3 the first sentence has ${words(sents[0])} words (6 at most)`);
  const b = c.before || {};
  if (!(String(b.mistake || '').length >= 20) || !/^https:\/\/\S+$/.test(b.source || '')) bad.push(`${f}: B1 add "before": { "mistake": "...", "source": "https://..." } (the real first-draft mistake this reel starts from)`);
}
if (bad.length) { for (const l of bad) console.error('  ✗ ' + l); console.error(`C3 SCRIPT CHECK: ${bad.length} problem(s) (design/rules-c3.md V1-V3, B1)`); process.exit(1); }
console.log(`C3 SCRIPT CHECK: ${n2} design config(s) on the improved kit, 0 problems`);
