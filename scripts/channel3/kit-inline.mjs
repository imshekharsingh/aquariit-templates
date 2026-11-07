// Turns Out toolkits: copies a kit into a scene between its markers, so the scene stays one self-contained file (like three.js,
// scripts/channel3/three-inline.mjs). The 3D kit (kit3d.js) sits in its own script tag, <script>/*kit:begin*/ ... /*kit:end*/</script>;
// the 2.5D kit (kit25d.js) sits inside the scene's main script after the shared core, /*kit25:begin*/ ... /*kit25:end*/, since it uses
// the core's helpers. Run it after any change to a kit, for every scene that uses it; npm run check (scripts/check.mjs) fails while a
// scene's copy differs from its kit.
// The web motion kit (scripts/explainer/kitmotion.js, 7 Nov 2026) sits the same way in @webin20sec scenes, /*kitmotion:begin*/ ... /*kitmotion:end*/.
// Usage: node scripts/channel3/kit-inline.mjs <scene.html> [more scenes]
import { readFileSync, writeFileSync } from 'node:fs';
export const KITS = [{ file: 'kit3d.js', begin: '<script>/*kit:begin*/', end: '/*kit:end*/</script>', skip: 8, name: '3D' }, { file: 'kit25d.js', begin: '/*kit25:begin*/', end: '/*kit25:end*/', skip: 0, name: '2.5D' },
  { file: '../explainer/kitmotion.js', begin: '/*kitmotion:begin*/', end: '/*kitmotion:end*/', skip: 0, name: 'web motion' }];   // @webin20sec (scripts/explainer/newweb.mjs)
export function kitText(k){ return readFileSync(new URL('./' + k.file, import.meta.url), 'utf8').trim().replace(/<\/script/gi, '<\\/script'); }
// the kit's copy in a scene (null when the scene has none)
export function kitCopy(html, k){ const a = html.indexOf(k.begin), b = html.indexOf(k.end); return a < 0 || b < a ? null : html.slice(a + k.begin.length, b).trim(); }
if (import.meta.url === 'file://' + process.argv[1]) for (const scene of process.argv.slice(2)) {
  let html = readFileSync(scene, 'utf8'), n = 0;
  for (const k of KITS) { const a = html.indexOf(k.begin), b = html.indexOf(k.end); if (a < 0 || b < a) continue;
    html = html.slice(0, a + k.begin.length) + '\n' + kitText(k) + '\n' + html.slice(b); n++; console.log(`inlined the ${k.name} kit (${(kitText(k).length / 1024).toFixed(0)} KB) into ${scene}`); }
  if (!n) throw new Error(scene + ' has no kit block (/*kit:begin*/ or /*kit25:begin*/)');
  writeFileSync(scene, html);
}
