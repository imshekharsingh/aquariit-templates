// Turns Out on the Echoes engine (owner's kit, design/kits/echoes_kit.zip; 15 Nov 2026: "port the owner's kit as it is").
// Builds the reel's one self-contained scene from its config: the config's "echoes" block (the kit's episodes.py: title, lines, keys,
// shots) and its "media" list (the Media workflow's files, PD / CC0 / CC BY, recorded per file) are inlined into scripts/echoes/engine.html.
// The scene loads its images from media/<name>/<file> next to it (pulled from R2 at render time; Media previews for the session's stills).
// Usage: node scripts/echoes/build.mjs scripts/channel3/<slug>.json      (writes the config's "seek" scene)
// A shot (the kit's): {line, at: "start" | "<word>" | "<word>#n", type: "arch" | "ill", img: "a|b" (the first that arrived: a fallback per shot),
//   mode: "framed" | "full" | "depth" (2.5D: cut, cam, sat; design/channel3.md), develop, stamp: "TEXT", stampRed, grade (depth: a CSS filter such as "contrast(1.3) brightness(.8)" for a bright print), tone (colour of the beat: teal green red blue amber violet terra gold or #hex),
//   glow, focus, kind (ill: wall | dossier | counter | map, with their own fields; bg: an image id as the 2.5D far plane behind the card)}.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const cfgPath = process.argv[2], c = JSON.parse(readFileSync(cfgPath, 'utf8')), X = c.echoes;
if (!X) { console.error(`${cfgPath} has no "echoes" block`); process.exit(1); }
const text = X.lines.join(' ');
if (c.voice?.text !== text) { console.error('voice.text must be the echoes lines joined by spaces (the captions and the voice say the same words)'); process.exit(1); }
const credit = (m) => {
  const l = (m.licence || '').toLowerCase(), src = /loc/.test(m.source || '') ? 'LIBRARY OF CONGRESS' : 'WIKIMEDIA COMMONS';
  if (l.startsWith('cc-by')) return `${(m.licence_name || 'CC BY').toUpperCase()} · ${(m.author || '').toUpperCase().slice(0, 40)}`;
  return `${l === 'cc0' ? 'CC0' : 'PUBLIC DOMAIN'} · ${src}`;
};
const img = {};
for (const m of c.media || []) {
  if (!m.file) continue;
  img[m.id] = { src: `media/${c.name}/${m.file}`, w: m.w, h: m.h, title: (X.titles || {})[m.id] || m.title.replace(/\.(jpe?g|png|tiff?)$/i, ''), credit: credit(m), mono: (X.mono || []).includes(m.id) };
}
const bad = X.shots.filter((s) => s.type === 'arch' && !s.img.split('|').some((k) => img[k]));
if (bad.length) console.log(`ECHOES: no image arrived for ${bad.map((s) => s.img).join(', ')} (the shot shows a dark card: change its "img" fallback)`);
const EPC = { look: X.look, steps: X.steps, credit: X.credit, chapters: X.chapters, title: X.title, cover: X.cover, coverTitle: X.coverTitle, coverKicker: X.coverKicker, coverY: X.coverY, hud: X.hud, badge: X.badge, lines: X.lines, keys: X.keys, shots: X.shots, dur: c.dur, img };
const html = readFileSync(join(here, 'engine.html'), 'utf8').replace('/*EPISODE*/', '/* facts and sources: ' + (c.sources || []).map((x) => x.title + ' ' + x.url).join(' | ').split('*/').join('') + ' */\nwindow.EPC=' + JSON.stringify(EPC) + ';');
writeFileSync(c.seek, html);
console.log(`ECHOES: ${c.seek}: ${X.lines.length} lines, ${X.shots.length} shots (${X.shots.filter((s) => s.type === 'arch').length} archival, ${Object.keys(img).length} images)`);
