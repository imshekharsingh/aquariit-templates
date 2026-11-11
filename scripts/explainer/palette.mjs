// Palette rotation for @webin20sec (owner, 8 Nov 2026: "introduce more colour combinations, video to video"; rules-web.md rule 12).
// The palettes live in the kit (scripts/explainer/kitmotion.js, PALETTES); this reads their names in order from it, finds the last web reel
// in templates/showreels/captions.json (latest postOn; its config's "palette", else "aurora", the original glass light) and returns the next.
// Usage (also imported by newweb.mjs and newdetails.mjs): node scripts/explainer/palette.mjs   -> prints "PALETTE: next <name> (last <name> on <reel>)"
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export function palettes() {
  const kit = readFileSync(join(root, 'scripts/explainer/kitmotion.js'), 'utf8'), a = kit.indexOf('var PALETTES = {'), z = kit.indexOf('\n  };', a);
  return [...kit.slice(a, z).matchAll(/^ {4}([a-z]+): \{/gm)].map((m) => m[1]);
}
// the palette a reel's config records (configs live in scripts/explainer as <slug>.json, named showreel-NN-<slug>)
function paletteOf(name) {
  const D = join(root, 'scripts/explainer');
  for (const f of readdirSync(D).filter((x) => x.endsWith('.json'))) { try { const j = JSON.parse(readFileSync(join(D, f), 'utf8')); if (j.name === name) return j.palette || 'aurora'; } catch {} }
  return 'aurora';
}
export function nextPalette() {
  const list = palettes(), P = join(root, 'templates/showreels/captions.json');
  const caps = existsSync(P) ? JSON.parse(readFileSync(P, 'utf8')) : {};
  const web = Object.entries(caps).filter(([, e]) => e && e.channel === 'web' && e.postOn && !e.hidden).sort((x, y) => x[1].postOn.localeCompare(y[1].postOn));
  const last = web.length ? web[web.length - 1][0] : null, lastPal = last ? paletteOf(last) : 'aurora';
  const i = list.indexOf(lastPal);
  return { name: list[(i + 1) % list.length], last, lastPal };
}
if (process.argv[1] === fileURLToPath(import.meta.url)) { const n = nextPalette(); console.log(`PALETTE: next ${n.name} (last ${n.lastPal}${n.last ? ' on ' + n.last : ''}; order ${palettes().join(', ')})`); }
