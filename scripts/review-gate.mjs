// The Mandatory Gate's review file (design/mandatory.md; owner, 7 Nov 2026: "you cannot leave anything unaccounted").
// Every reel has review/<channel>/<name>.md with the 13 gate items, one line each: "N. <item>: PASS: <evidence>" (item 13 may say
// "PENDING" until the render has been checked). The AUTO lines are pasted as evidence: item 2 "SUBJECT FILL", item 3 "SAFE ZONE: ok",
// item 4 "OVERLAP: none", item 7 "fits".
//   npm run check (scripts/check.mjs): every reel posting from 2026-11-08 on needs a complete file (items 1-12 PASS; 13 PASS once its day is past).
//   The Showreel and Tech reel workflows refuse to render without items 1-12 PASS:
//     node scripts/review-gate.mjs --config scripts/explainer/<slug>.json   |   node scripts/review-gate.mjs --name showreel-tech-<slug>
// Reels posting before 2026-11-08 are grandfathered (rendered before the gate existed).
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
export const GATE_FROM = '2026-11-08', ITEMS = 13;
export const reviewPath = (channel, name) => `review/${channel}/${name}.md`;
const NEED = { 2: /SUBJECT FILL/, 3: /SAFE ZONE: ok/, 4: /OVERLAP: none/, 7: /fits/ };
// the template's own placeholder evidence never counts
const TEMPLATE = (() => { try { return new Set(readFileSync(join(root, 'review/TEMPLATE.md'), 'utf8').split('\n').map((l) => (l.match(/:\s+PASS:\s*(.*)$/) || [])[1]).filter(Boolean).map((x) => x.trim())); } catch { return new Set(); } })();
export const todayIST = () => new Date(Date.now() + 330 * 60000).toISOString().slice(0, 10);

// problems with one reel's review file; render = true: only what must hold before the render (items 1-12)
export const reviewProblems = (name, e, { render = false, today = todayIST() } = {}) => {
  const p = reviewPath(e.channel, name), f = join(root, p);
  if (!existsSync(f)) return [`${p} is missing (the Mandatory Gate review: design/mandatory.md)`];
  const got = new Map(), out = [];
  for (const line of readFileSync(f, 'utf8').split('\n')) { const m = line.match(/^\s*(\d{1,2})\.\s+(.+?):\s+(PASS|FAIL|PENDING)\b:?\s*(.*)$/); if (m && !got.has(+m[1])) got.set(+m[1], { st: m[3], ev: m[4].trim() }); }
  for (let i = 1; i <= ITEMS; i++) {
    const g = got.get(i);
    if (!g) { if (!(render && i === ITEMS)) out.push(`${p}: item ${i} is missing ("${i}. <item>: PASS: <evidence>")`); continue; }
    if (i === ITEMS && g.st === 'PENDING') { if (!render && e.postOn < today) out.push(`${p}: item 13 is still PENDING; read reel-status and write "13. After the render: PASS: <evidence>"`); continue; }
    if (g.st !== 'PASS') { out.push(`${p}: item ${i} is ${g.st}: fix the reel (or swap the topic) before it is rendered or called ready`); continue; }
    if (TEMPLATE.has(g.ev) || /\bnn\b|\.\.\.|<evidence>/.test(g.ev)) out.push(`${p}: item ${i} still has the template's placeholder evidence`);
    else if (g.ev.length < 8) out.push(`${p}: item ${i} needs its evidence after "PASS:"`);
    else if (NEED[i] && !(i === 2 && e.channel === 'tech') && !NEED[i].test(g.ev)) out.push(`${p}: item ${i} must paste its AUTO line (${NEED[i].source})`);
  }
  return out;
};

// every reel in captions.json that the gate covers
export const gateProblems = (caps, today = todayIST()) => {
  const out = [];
  for (const [name, e] of Object.entries(caps || {})) {
    if (!e || e.hidden || e.sample || !e.channel || !e.postOn || e.postOn < GATE_FROM) continue;
    out.push(...reviewProblems(name, e, { today }));
  }
  return out;
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const a = process.argv.slice(2), at = (k) => a[a.indexOf(k) + 1];
  const name = a.includes('--name') ? at('--name') : JSON.parse(readFileSync(at('--config'), 'utf8')).name;
  const caps = JSON.parse(readFileSync(join(root, 'templates/showreels/captions.json'), 'utf8')), e = caps[name];
  if (!e) { console.log(`::error::REVIEW GATE: ${name} has no entry in templates/showreels/captions.json; nothing is rendered without its schedule and review (design/mandatory.md)`); process.exit(1); }
  if (e.sample) { console.log(`REVIEW GATE: ${name} is a sample (review only, never posted): allowed`); process.exit(0); }
  if (e.postOn && e.postOn < GATE_FROM) { console.log(`REVIEW GATE: ${name} posts ${e.postOn}, before the gate (${GATE_FROM}): grandfathered`); process.exit(0); }
  const bad = reviewProblems(name, e, { render: true });
  if (bad.length) { for (const b of bad) console.log(`::error::REVIEW GATE: ${b}`); console.log('REVIEW GATE: refused. The Mandatory Gate (design/mandatory.md) must pass, items 1-12, before the one render.'); process.exit(1); }
  console.log(`REVIEW GATE: ${reviewPath(e.channel, name)}: items 1-12 PASS`);
}
