// Dependency-free repo sanity checks (run by `npm run check` and the pipeline). Exits non-zero with an itemized list.
// The app is the showreel studio: home = Showreels (the 6-17 Oct templates and their archive were deleted, owner 31 Oct 2026);
// reels = seekable scenes rendered by the Showreel workflow.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const T = join(root, 'templates');
const errors = [];
const err = (m) => errors.push(m);
const ID_RE = /^(\d{4}-\d{2}-\d{2})(?:-(\d{2})(\d{2}))?$/;
const ALLOWED_ORIGINS = ['fonts.googleapis.com', 'fonts.gstatic.com'];
const readJSON = (p, label) => {
  try { return JSON.parse(readFileSync(p, 'utf8')); }
  catch (e) { err(`${label}: missing or invalid JSON (${e.message})`); return null; }
};
const externalHosts = (html) => [
  ...[...html.matchAll(/\b(?:src|href|srcset|poster|action)=["']([^"']+)["']/gi)].map((m) => m[1]),
  ...[...html.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)].map((m) => m[1]),
  ...[...html.matchAll(/@import\s+["']([^"']+)["']/gi)].map((m) => m[1]),
].filter((u) => /^(https?:)?\/\//i.test(u)).map((u) => { try { return [u, new URL(u.startsWith('//') ? 'https:' + u : u).hostname]; } catch { return [u, '']; } });

// 2. every page we serve stays self-contained (Google Fonts only) and installable
const pages = [];
const walk = (d) => { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (f.endsWith('.html')) pages.push(p); } };
walk(T);
for (const p of pages) {
  const id = p.slice(root.length + 1), html = readFileSync(p, 'utf8');
  // the public tips page (owner, 27 Oct 2026) may LINK out (sources, the reels: <a href> only, never loaded); it is not part of the installable app
  const tips = /templates[\\/]tips[\\/]/.test(p), links = tips ? new Set([...html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)].map((m) => m[1])) : new Set();
  for (const [u, host] of externalHosts(html)) if (!ALLOWED_ORIGINS.includes(host) && !links.has(u)) err(`${id}: external URL not allowed: ${u}`);
  if (!/rel=["']manifest["']/i.test(html) && !/404\.html$/.test(p) && !tips) err(`${id}: missing <link rel="manifest" href="/manifest.webmanifest">`);
  if (statSync(p).size > 500 * 1024) err(`${id}: larger than 500 KB`);
}

// 3. the app shell
if (!existsSync(join(root, 'src', 'worker.js'))) err('src/worker.js is missing (sign-in gate, reels and APIs)');
for (const f of ['index.html', 'showreels/captions.json', 'channels/channels.json', '404.html', 'sw.js', 'manifest.webmanifest']) if (!existsSync(join(T, f))) err(`templates/${f} is missing`);
const m = existsSync(join(T, 'manifest.webmanifest')) ? readJSON(join(T, 'manifest.webmanifest'), 'manifest.webmanifest') : null;
if (m) {
  for (const k of ['name', 'start_url', 'display', 'icons']) if (!m[k]) err(`manifest.webmanifest: missing "${k}"`);
  for (const ic of m.icons || []) if (!existsSync(join(T, ic.src || ''))) err(`manifest.webmanifest: icon file missing: ${ic.src}`);
}

// 4. post text: whatever the owner copies has a caption, 6+ keywords and exactly 5 hashtags (Instagram's limit)
const postText = (j, label) => {
  if (!j || j.hidden) return;
  if (j.postOn !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(j.postOn)) err(`${label}: postOn must be YYYY-MM-DD (IST)`);
  if (j.caption === undefined && !j.keywords && !j.hashtags) return;   // schedule-only entry; the caption comes from the render's json
  if (!j.caption || !String(j.caption).trim()) err(`${label}: caption is empty`);
  if (!Array.isArray(j.keywords) || j.keywords.length < 6) err(`${label}: needs at least 6 keywords (the first 6 go into the post text)`);
  const tags = Array.isArray(j.hashtags) ? j.hashtags : [];
  if (tags.length !== 5 || !tags.every((h) => /^#[\p{L}\p{N}_]+$/u.test(h))) err(`${label}: needs exactly 5 hashtags, each "#word"`);
};
const caps = existsSync(join(T, 'showreels', 'captions.json')) ? readJSON(join(T, 'showreels', 'captions.json'), 'templates/showreels/captions.json') : null;
if (caps) for (const [name, j] of Object.entries(caps)) postText(j, `captions.json ${name}`);

// 5. reel configs: a showreel name, a scene that exists, and post text
for (const dir of ['scripts/explainer', 'scripts/showreel', 'scripts/channel3']) {
  const D = join(root, dir);
  for (const f of existsSync(D) ? readdirSync(D).filter((x) => x.endsWith('.json')) : []) {
    const label = `${dir}/${f}`, j = readJSON(join(D, f), label);
    if (!j) continue;
    if (!/^showreel-[a-z0-9-]{1,60}$/.test(j.name || '')) err(`${label}: name must look like showreel-NN-slug (the Worker only serves that pattern)`);
    if (j.seek) {
      if (!existsSync(join(root, j.seek))) err(`${label}: seek page ${j.seek} does not exist`);
      else if (!/window\.seek\s*=/.test(readFileSync(join(root, j.seek), 'utf8'))) err(`${label}: ${j.seek} must expose window.seek(t)`);
    }
    postText(j, label);
    // Channel 3 (owner, 31 Oct 2026: true stories, every claim in two sources): the sources the app lists and copies as a comment
    if (dir === 'scripts/channel3') {
      const src = Array.isArray(j.sources) ? j.sources : [];
      if (src.length < 2 || !src.every((x) => x && String(x.title || '').trim() && /^https:\/\/\S+$/.test(x.url || ''))) err(`${label}: needs a "sources" list of at least 2 entries, each { title, url (https) }`);
    }
  }
}

if (errors.length) {
  console.error(`✗ ${errors.length} problem(s):\n` + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}
console.log(`✓ checks passed — ${pages.length} pages, app shell and reel configs OK`);
