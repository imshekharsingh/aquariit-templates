// Dependency-free repo sanity checks. Exits non-zero with an itemized list.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const T = join(root, 'templates');
const errors = [];
const err = (m) => errors.push(m);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
// Template ids are the IST date, optionally followed by the IST time: YYYY-MM-DD or YYYY-MM-DD-HHMM
const ID_RE = /^(\d{4}-\d{2}-\d{2})(?:-(\d{2})(\d{2}))?$/;
const FIELDS = ['id', 'date', 'slug', 'url', 'theme', 'layout', 'palette', 'fonts', 'motif', 'animation', 'purpose', 'description'];
const DIMS = ['layout', 'palette', 'fonts', 'motif', 'animation', 'theme', 'purpose'];
const BANNED = ['Google', 'Apple', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Nike', 'Disney', 'Spotify', 'Airbnb'];
const ALLOWED_ORIGINS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

const validDate = (s) => {
  if (!DATE_RE.test(s)) return false;
  const d = new Date(s + 'T00:00:00Z');
  return !isNaN(d) && d.toISOString().slice(0, 10) === s;
};
const readJSON = (p, label) => {
  try { return JSON.parse(readFileSync(p, 'utf8')); }
  catch (e) { err(`${label}: missing or invalid JSON (${e.message})`); return null; }
};
const norm = (v) => Array.isArray(v) ? v.map((x) => String(x).toLowerCase()).sort().join('|') : String(v).trim().toLowerCase();

// 1–5: design log
const logPath = join(root, 'design-log.json');
const log = readJSON(logPath, 'design-log.json');
const folders = existsSync(T) ? readdirSync(T).filter((f) => ID_RE.test(f) && statSync(join(T, f)).isDirectory()) : [];

if (Array.isArray(log)) {
  log.forEach((e, i) => {
    const id = `design-log.json[${i}]`;
    for (const f of FIELDS) if (e[f] === undefined || e[f] === '' || (Array.isArray(e[f]) && !e[f].length)) err(`${id}: missing field "${f}"`);
    if (e.date && !validDate(e.date)) err(`${id}: invalid date "${e.date}"`);
    const m = ID_RE.exec(e.id || '');
    if (e.id && !m) err(`${id}: invalid id "${e.id}" (expected YYYY-MM-DD or YYYY-MM-DD-HHMM, IST)`);
    if (m) {
      if (m[1] !== e.date) err(`${id}: id "${e.id}" does not start with date "${e.date}"`);
      if (m[2] && (+m[2] > 23 || +m[3] > 59)) err(`${id}: id "${e.id}" has an invalid time`);
      if (m[2] && e.time !== `${m[2]}:${m[3]}`) err(`${id}: time must be "${m[2]}:${m[3]}" to match id "${e.id}"`);
    }
    if (Array.isArray(e.palette) && !e.palette.every((h) => /^#[0-9a-f]{3,8}$/i.test(h))) err(`${id}: palette must be an array of hex colors`);
    if (e.id && !existsSync(join(T, e.id, 'index.html'))) err(`${id}: templates/${e.id}/index.html does not exist`);
    if (e.id && e.url !== `https://templates.aquariit.com/${e.id}/`) err(`${id}: url must be https://templates.aquariit.com/${e.id}/`);
  });
  const seen = (key, label) => {
    const m = new Map();
    log.forEach((e) => {
      if (e[key] === undefined) return;
      const k = norm(e[key]);
      if (m.has(k)) err(`Duplicate ${label}: ${e.id} and ${m.get(k)}`);
      else m.set(k, e.id);
    });
  };
  seen('id', 'id'); seen('slug', 'slug'); seen('palette', 'palette'); seen('fonts', 'font pairing');
  for (const f of folders) if (!log.some((e) => e.id === f)) err(`templates/${f}/ has no design-log.json entry`);

  const sorted = [...log].sort((a, b) => (a.id < b.id ? 1 : -1));
  if (sorted.length > 1) {
    const [newest, ...older] = sorted;
    for (const o of older) {
      const differing = DIMS.filter((d) => norm(newest[d] ?? '') !== norm(o[d] ?? ''));
      if (differing.length < 5) err(`${newest.id} differs from ${o.id} on only ${differing.length}/7 dimensions (need 5): shared = ${DIMS.filter((d) => !differing.includes(d)).join(', ')}`);
    }
  }
  const copy = join(T, 'design-log.json');
  if (!existsSync(copy)) err('templates/design-log.json is missing');
  else if (readFileSync(copy, 'utf8') !== readFileSync(logPath, 'utf8')) err('templates/design-log.json differs from design-log.json (copy it)');
} else if (log !== null) err('design-log.json must be an array');

// 6–7: template HTML
const text = (h) => h.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ');
for (const f of folders) {
  const p = join(T, f, 'index.html');
  const id = `templates/${f}/index.html`;
  if (!existsSync(p)) { err(`${id}: missing`); continue; }
  const html = readFileSync(p, 'utf8');
  const need = [
    [/<!doctype html>/i, '<!doctype html>'], [/<html\b[^>]*\blang=/i, '<html lang>'],
    [/<title>[^<]+<\/title>/i, '<title>'], [/<meta\b[^>]*name=["']viewport["']/i, 'meta viewport'],
    [/<main\b/i, '<main>'], [/@media[^{]*prefers-reduced-motion/i, 'prefers-reduced-motion media query'],
    [/<link\b[^>]*rel=["']manifest["'][^>]*href=["']\/manifest\.webmanifest["']|<link\b[^>]*href=["']\/manifest\.webmanifest["'][^>]*rel=["']manifest["']/i, '<link rel="manifest" href="/manifest.webmanifest">'],
  ];
  for (const [re, label] of need) if (!re.test(html)) err(`${id}: missing ${label}`);
  const back = [...html.matchAll(/<a\b[^>]*\bhref=["']\/["'][^>]*>([\s\S]*?)<\/a>/gi)].some((m) => /All templates/.test(m[1].replace(/<[^>]+>/g, '')));
  if (!back) err(`${id}: missing <a href="/"> whose text includes "All templates"`);
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) if (!/\balt=/i.test(m[0])) err(`${id}: <img> without alt`);
  const urls = [
    ...[...html.matchAll(/\b(?:src|href|srcset|poster|action)=["']([^"']+)["']/gi)].map((m) => m[1]),
    ...[...html.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)].map((m) => m[1]),
    ...[...html.matchAll(/@import\s+["']([^"']+)["']/gi)].map((m) => m[1]),
  ];
  for (const u of urls) {
    if (!/^(https?:)?\/\//i.test(u)) continue;
    let host = '';
    try { host = new URL(u.startsWith('//') ? 'https:' + u : u).hostname; } catch { /* ignore */ }
    if (!ALLOWED_ORIGINS.includes(host)) err(`${id}: external URL not allowed: ${u}`);
  }
  if (statSync(p).size > 500 * 1024) err(`${id}: larger than 500 KB`);
  const body = text(html).replace(/Google Fonts/g, '');
  for (const b of BANNED) if (new RegExp(`\\b${b}\\b`).test(body)) err(`${id}: banned brand name "${b}" in text`);
}

// Instagram social kit: social/YYYY-MM-DD.md for every template folder
for (const f of folders) {
  const p = join(root, 'social', `${f}.md`);
  const id = `social/${f}.md`;
  if (!existsSync(p)) { err(`${id}: missing (every template needs an Instagram social kit)`); continue; }
  const md = readFileSync(p, 'utf8');
  const sec = (name) => { const m = md.match(new RegExp(`^## ${name}\\s*\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, 'm')); return m ? m[1].trim() : ''; };
  for (const n of ['Hook', 'Caption', 'Keywords', 'Hashtags', 'Reel', 'Music']) if (!sec(n)) err(`${id}: missing or empty "## ${n}" section`);
  const main = sec('Hashtags').split('\n').filter((l) => !/^alternates:/i.test(l.trim())).join(' ');
  const tags = main.match(/#[\p{L}\p{N}_]+/gu) || [];
  if (tags.length !== 5) err(`${id}: Hashtags must contain exactly 5 hashtags (found ${tags.length}); Instagram allows max 5 per post`);
  const alt = (sec('Hashtags').match(/^alternates:(.*)$/im) || [])[1] || '';
  if (!/#/.test(alt)) err(`${id}: Hashtags needs an "Alternates:" line`);
  const kw = sec('Keywords').split('\n').filter((l) => l.trim()).length;
  if (kw < 8 || kw > 12) err(`${id}: Keywords needs 8–12 lines (found ${kw})`);
  const reel = sec('Reel');
  for (const k of ['Length', 'Shot plan', 'Cover']) if (!new RegExp(`^[-*]?\\s*\\**${k}:`, 'mi').test(reel)) err(`${id}: Reel section missing "${k}:" line`);
  const music = sec('Music');
  for (const k of ['Mood', 'Genre', 'BPM', 'Search', 'Avoid']) if (!new RegExp(`^[-*]?\\s*\\**${k}:`, 'mi').test(music)) err(`${id}: Music section missing "${k}:" line`);
}

// 8: site infrastructure (also the auth Worker that fronts the assets)
if (!existsSync(join(root, 'src', 'worker.js'))) err('src/worker.js is missing (basic-auth gate)');
if (!existsSync(join(T, 'social-kits.json'))) err('templates/social-kits.json is missing (run npm run build)');
for (const f of ['index.html', '404.html', 'sw.js', 'manifest.webmanifest', 'kit/index.html', 'play/player.js']) if (!existsSync(join(T, f))) err(`templates/${f} is missing`);
const mp = join(T, 'manifest.webmanifest');
if (existsSync(mp)) {
  const m = readJSON(mp, 'manifest.webmanifest');
  if (m) {
    for (const k of ['name', 'start_url', 'display', 'icons']) if (!m[k]) err(`manifest.webmanifest: missing "${k}"`);
    for (const ic of m.icons || []) if (!existsSync(join(T, ic.src || ''))) err(`manifest.webmanifest: icon file missing: ${ic.src}`);
  }
}

if (errors.length) {
  console.error(`\n✗ ${errors.length} check(s) failed:\n` + errors.map((e) => `  - ${e}`).join('\n') + '\n');
  process.exit(1);
}
console.log(`✓ checks passed — ${log ? log.length : 0} log entr${log && log.length === 1 ? 'y' : 'ies'}, ${folders.length} template folder(s)`);
