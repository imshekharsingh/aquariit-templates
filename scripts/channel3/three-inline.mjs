// Turns Out 3D scenes (owner, 31 Oct 2026: real-time 3D): three.js (MIT) is inlined into each scene so the scene stays one self-contained
// file. This puts three's ES module build in the scene between the markers /*three:begin*/ and /*three:end*/ as a classic script that
// sets window.THREE (the module's export list becomes one object). Get the build with `npm pack three@0.170.0` (package/build/three.module.min.js).
// Usage: node scripts/channel3/three-inline.mjs <scene.html> <three.module.min.js>
import { readFileSync, writeFileSync } from 'node:fs';
const [scene, lib] = process.argv.slice(2);
let src = readFileSync(lib, 'utf8');
const at = src.lastIndexOf('export{');
if (at < 0) throw new Error('no export list in ' + lib);
const list = src.slice(at + 7, src.indexOf('}', at)).split(',').map((e) => { const [a, , b] = e.trim().split(/\s+/); return `${b || a}:${a}`; });
src = `(function(){${src.slice(0, at)}window.THREE={${list.join(',')}};})();`;
if (/\bimport\s*[{(*]|\bimport\.meta/.test(src)) throw new Error('the build still imports something; use three.module.min.js');
const html = readFileSync(scene, 'utf8'), a = html.indexOf('/*three:begin*/'), b = html.indexOf('/*three:end*/');
if (a < 0 || b < a) throw new Error(scene + ' has no /*three:begin*/ ... /*three:end*/ block');
writeFileSync(scene, html.slice(0, a + 15) + '\n' + src.replace(/<\/script/gi, '<\\/script') + '\n' + html.slice(b));
console.log(`inlined three.js (${list.length} exports, ${(src.length / 1024).toFixed(0)} KB) into ${scene}`);
