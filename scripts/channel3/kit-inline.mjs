// Turns Out 3D toolkit (scripts/channel3/kit3d.js): copies the kit into a scene between /*kit:begin*/ and /*kit:end*/, so the scene stays
// one self-contained file (like three.js, scripts/channel3/three-inline.mjs). Run it after any change to the kit, for every scene that
// uses it; npm run check (scripts/check.mjs) fails while a scene's copy differs from the kit.
// Usage: node scripts/channel3/kit-inline.mjs <scene.html> [more scenes]
import { readFileSync, writeFileSync } from 'node:fs';
const kit = readFileSync(new URL('./kit3d.js', import.meta.url), 'utf8').trim();
for (const scene of process.argv.slice(2)) {
  const html = readFileSync(scene, 'utf8'), a = html.indexOf('<script>/*kit:begin*/') + 8, b = html.indexOf('/*kit:end*/</script>');
  if (a < 8 || b < a) throw new Error(scene + ' has no /*kit:begin*/ ... /*kit:end*/ block');
  writeFileSync(scene, html.slice(0, a + 13) + '\n' + kit.replace(/<\/script/gi, '<\\/script') + '\n' + html.slice(b));
  console.log(`inlined the 3D kit (${(kit.length / 1024).toFixed(0)} KB) into ${scene}`);
}
