// Builds templates/social-kits.json from social/*.md (generated, gitignored; run in CI and by `npm run check`).
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'social');
const files = existsSync(dir) ? readdirSync(dir).filter((f) => /^\d{4}-\d{2}-\d{2}(-\d{4})?\.md$/.test(f)) : [];

const section = (md, name) => {
  const m = md.match(new RegExp(`^## ${name}\\s*\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, 'm'));
  return m ? m[1].trim() : '';
};
const bullets = (t) => t.split('\n').map((l) => l.replace(/^[-*]\s*/, '').trim()).filter(Boolean);
const field = (t, k) => ((t.match(new RegExp(`^[-*]?\\s*\\**${k}:\\**\\s*(.*)$`, 'mi')) || [])[1] || '').trim();
const tags = (t) => t.match(/#[\p{L}\p{N}_]+/gu) || [];

const kits = files.map((f) => {
  const id = f.replace(/\.md$/, '');
  const md = readFileSync(join(dir, f), 'utf8');
  const title = (md.match(/^#\s+.*?·\s*([^(\n]+?)\s*(?:\(|$)/m) || [])[1] || id;
  const hashLines = section(md, 'Hashtags').split('\n');
  const reel = section(md, 'Reel'), music = section(md, 'Music');
  const shot = field(reel, 'Shot plan');
  return {
    id, name: title.trim(),
    hook: section(md, 'Hook'),
    caption: section(md, 'Caption'),
    keywords: bullets(section(md, 'Keywords')),
    hashtags: tags(hashLines.filter((l) => !/^alternates:/i.test(l.trim())).join(' ')),
    alternates: tags(hashLines.filter((l) => /^alternates:/i.test(l.trim())).join(' ')),
    reel: {
      length: field(reel, 'Length'),
      beats: shot.split(/\(\d\)\s*/).map((b) => b.replace(/\s*→\s*$/, '').trim()).filter(Boolean),
      cover: field(reel, 'Cover').replace(/^"|"$/g, ''),
      payoff: field(reel, 'Payoff'),
    },
    music: {
      mood: field(music, 'Mood'), genre: field(music, 'Genre'), bpm: field(music, 'BPM'),
      search: [...field(music, 'Search').matchAll(/"([^"]+)"/g)].map((m) => m[1]),
      accent: field(music, 'Accent sounds'), avoid: field(music, 'Avoid'), licensing: field(music, 'Licensing'),
    },
  };
}).sort((a, b) => (a.id < b.id ? 1 : -1));

writeFileSync(join(root, 'templates', 'social-kits.json'), JSON.stringify(kits));
console.log(`✓ built templates/social-kits.json — ${kits.length} kit(s)`);
