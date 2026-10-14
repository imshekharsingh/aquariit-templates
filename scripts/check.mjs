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
  need.push(
    [/<meta\b[^>]*name=["']viewport["'][^>]*viewport-fit=cover/i, 'viewport-fit=cover in the viewport meta (iPhone safe areas)'],
    [/<meta\b[^>]*name=["']theme-color["'][^>]*content=["']#?[\w(),.% ]+["']/i, '<meta name="theme-color"> matching the page top colour (iOS status area)'],
    [/html\.reel\s*\{[^}]*--safe-top\s*:\s*0/i, 'Reel-mode rule: html.reel{--safe-top:0px;--safe-bottom:0px} (see CLAUDE.md)'],
  );
  for (const [re, label] of need) if (!re.test(html)) err(`${id}: missing ${label}`);
  // safe-area insets must go through --safe-top/--safe-bottom so the Reel player can neutralise them
  const rawEnv = html.replace(/--safe-(?:top|bottom)\s*:\s*env\([^)]*\)/g, '').match(/env\(\s*safe-area-inset-(?:top|bottom)/g);
  if (rawEnv) err(`${id}: use var(--safe-top)/var(--safe-bottom) instead of raw env(safe-area-inset-top/bottom) (${rawEnv.length} found)`);
  const back = [...html.matchAll(/<a\b[^>]*\bhref=["']\/["'][^>]*>([\s\S]*?)<\/a>/gi)].some((m) => /All templates/.test(m[1].replace(/<[^>]+>/g, '')));
  if (!back) err(`${id}: missing <a href="/"> whose text includes "All templates"`);
  if (!/Developed by Aquarii Technologies/.test(html)) err(`${id}: missing footer credit "Developed by Aquarii Technologies"`);
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

// Design advancement: every template folder is recorded in design/advancements.md
const advPath = join(root, 'design', 'advancements.md');
const adv = existsSync(advPath) ? readFileSync(advPath, 'utf8') : '';
if (!adv) err('design/advancements.md is missing');
for (const f of folders) if (adv && !new RegExp(`^- ${f} — `, 'm').test(adv)) err(`design/advancements.md: no line "- ${f} — technique (group): what it looks like" for ${f}`);
for (const f of folders) {
  const line = adv.split('\n').find((l) => l.startsWith(`- ${f} — `));
  if (line && !/\| hero: .+ \| modules: .+ \| header: .+ \| era: (modern|vintage)\s*$/.test(line)) err(`design/advancements.md: line for ${f} needs "| hero: X | modules: Y | header: Z | era: modern|vintage"`);
}
// Era balance (from 2026-10-12 on): a vintage/period template may not follow another vintage one within two templates.
{
  const eraOf = (f) => ((adv.split('\n').find((l) => l.startsWith(`- ${f} — `)) || '').match(/\| era: (\w+)\s*$/) || [])[1];
  const sorted = [...folders].sort();
  sorted.forEach((f, i) => {
    if (f < '2026-10-12' || eraOf(f) !== 'vintage') return;
    if (sorted.slice(Math.max(0, i - 2), i).some((g) => eraOf(g) === 'vintage')) err(`${f}: vintage era within two templates of another vintage one (design/playbook.md "Era balance")`);
  });
}

// Cover preview image: every template has templates/covers/ID.jpg (node scripts/make-cover.mjs ID), shown on the ▶ cover card
for (const f of folders) {
  const c = join(T, 'covers', `${f}.jpg`);
  if (!existsSync(c)) err(`templates/covers/${f}.jpg missing (run: node scripts/make-cover.mjs ${f})`);
  else if (statSync(c).size > 250 * 1024) err(`templates/covers/${f}.jpg is larger than 250 KB`);
}

// Instagram social kit: social/YYYY-MM-DD.md for every template folder
const logById = {}; try { for (const e of JSON.parse(readFileSync(join(root, 'design-log.json'), 'utf8'))) logById[e.id || e.date] = e; } catch { /* reported elsewhere */ }
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
  const words = sec('Hook').replace(/[^\p{L}\p{N}\s'’-]/gu, ' ').split(/\s+/).filter(Boolean).length;
  if (words > 10) err(`${id}: Hook is ${words} words; keep it to 10 or fewer (it is on-screen text for the first 2 seconds)`);
  const capLines = sec('Caption').split('\n').map((l) => l.trim()).filter(Boolean);
  if (capLines.length < 2 || capLines.length > 4) err(`${id}: Caption must be 2–4 lines (found ${capLines.length})`);
  if (capLines.length && !/\b(send|share|tag)\b/i.test(capLines[capLines.length - 1])) err(`${id}: the last Caption line must invite a share ("Send this to someone …"): shares per reach drive distribution`);
  const reel = sec('Reel');
  for (const k of ['Length', 'Shot plan', 'Payoff', 'Cover']) if (!new RegExp(`^[-*]?\\s*\\**${k}:`, 'mi').test(reel)) err(`${id}: Reel section missing "${k}:" line`);
  const music = sec('Music');
  for (const k of ['Mood', 'Genre', 'BPM', 'Search', 'Avoid']) if (!new RegExp(`^[-*]?\\s*\\**${k}:`, 'mi').test(music)) err(`${id}: Music section missing "${k}:" line`);
  // reels sell Aquarii's own services, never the template's fictional business (owner, 14 Oct 2026; design/services.md)
  if (f >= '2026-10-14') {
    const svc = sec('Service').toLowerCase().match(/\b(web|social|security|edge|studio)\b/);
    if (!svc) err(`${id}: needs "## Service" with one of web | social | security | edge | studio (design/services.md): every reel sells an Aquarii service`);
    const brand = (logById[f] || {}).slug;
    if (brand && brand.length > 2 && new RegExp(`\\b${brand.replace(/[^a-z0-9]/gi, '')}\\b`, 'i').test(sec('Hook') + '\n' + sec('Caption')))
      err(`${id}: Hook/Caption name the template's brand "${brand}"; the reel sells Aquarii's service, the template is only proof (design/services.md)`);
  }
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

// films made from 2026-10-14 on must be built on the film parts (product-film grammar) and must not ship the starter unchanged
{
  const FD = join(root, 'film');
  const starter = existsSync(join(FD, '_starter', 'story.js')) ? readFileSync(join(FD, '_starter', 'story.js'), 'utf8') : '';
  let rl = []; try { rl = JSON.parse(readFileSync(join(root, 'reel-log.json'), 'utf8')); } catch { /* reported elsewhere */ }
  for (const id of existsSync(FD) ? readdirSync(FD) : []) {
    if (!/^\d{4}-\d{2}-\d{2}/.test(id) || id < '2026-10-14') continue;
    const sp = join(FD, id, 'story.js'); if (!existsSync(sp)) continue;
    const src = readFileSync(sp, 'utf8');
    if (!/FilmParts/.test(src)) err(`film/${id}/story.js: must be built on scripts/film/parts.js (window.FilmParts), see design/film-playbook.md`);
    if (starter && src.trim() === starter.trim()) err(`film/${id}/story.js: is the starter unchanged; bend it around this business's own concept`);
    const e = rl.find((x) => x.id === id);
    if (!e) err(`reel-log.json: no entry for the film ${id}`);
    else if (!(e.revisionPasses >= 2) || !e.notes) err(`reel-log.json ${id}: record the style-frame passes (revisionPasses >= 2 and notes on what each pass fixed)`);
    if (e && !e.friendTest) err(`reel-log.json ${id}: answer the friend test (friendTest: stop scrolling? watch to the end? a moment to screenshot? send it to a friend?)`);
  }
}

// variety across reels: every film writes film/ID/manifest.json (auto, from the parts it used) + a declared dna; new films must not repeat the previous film
// in the four story-defining slots, and must not be a near-copy of any of the last 7 (warnings for partial overlap)
{
  const FD = join(root, 'film'), KEY = ['opener', 'transition', 'mechanism', 'payoff'], ALL = ['ground', 'opener', 'transition', 'mechanism', 'focus', 'payoff', 'type', 'captions', 'cta'];
  const ms = (existsSync(FD) ? readdirSync(FD) : []).filter((d) => /^\d{4}-/.test(d) && existsSync(join(FD, d, 'manifest.json')))
    .map((d) => { try { return JSON.parse(readFileSync(join(FD, d, 'manifest.json'), 'utf8')); } catch { err(`film/${d}/manifest.json: not valid JSON`); return null; } }).filter(Boolean)
    .sort((a, b) => String(a.made).localeCompare(String(b.made)));
  const slot = (m, k) => { const v = (m.slots || {})[k] || []; return v.length ? v.slice().sort().join('+') : (k === 'opener' && m.dna && m.dna.opening ? 'bespoke:' + m.dna.opening.toLowerCase() : ''); };
  const warns = [];
  ms.forEach((m, i) => {
    if (m.legacy) return;                                                  // hand-written manifests of films made before the kit are history, not judged
    if (!m.dna || ['opening', 'bigMoment', 'ground', 'music'].some((k) => !m.dna[k])) err(`film/${m.id}: story.js must declare S.dna = { opening, bigMoment, ground, music } (written to manifest.json by the renderer)`);
    const prev = ms[i - 1], last = ms.slice(Math.max(0, i - 7), i);
    if (m.id >= '2026-10-14') {                                            // every film sells one Aquarii service line, never the same as the previous film
      const sv = m.dna && m.dna.service;
      if (!['web', 'social', 'security', 'edge', 'studio'].includes(sv)) err(`film/${m.id}: S.dna.service must be web | social | security | edge | studio (design/services.md)`);
      else if (prev && prev.dna && prev.dna.service === sv) err(`film/${m.id}: same service line as the previous film (${prev.id}: ${sv}); rotate (design/services.md)`);
    }
    if (prev) KEY.forEach((k) => { const a = (m.slots || {})[k] || [], b = (prev.slots || {})[k] || []; const same = a.filter((x) => b.includes(x)); if (same.length) err(`film/${m.id}: repeats the previous film (${prev.id}) in "${k}": ${same.join(', ')}; pick another option (see scripts/film/parts.js)`); });
    for (const o of last) {
      const eq = ALL.filter((k) => slot(m, k) && slot(m, k) === slot(o, k));
      if (eq.length >= 6) err(`film/${m.id}: near-copy of ${o.id} (same ${eq.join(', ')})`); else if (eq.length >= 4) warns.push(`film/${m.id}: overlaps ${o.id} in ${eq.join(', ')}`);
      if (m.dna && o.dna) ['opening', 'bigMoment'].forEach((k) => { if (m.dna[k] && o.dna[k] && m.dna[k].toLowerCase().trim() === o.dna[k].toLowerCase().trim()) err(`film/${m.id}: same ${k} as ${o.id}`); });
    }
  });
  if (warns.length) console.warn('⚠ variety warnings (allowed, but say why in reel-log notes):\n' + warns.map((w) => '  - ' + w).join('\n'));
  // films from 2026-10-14 on must have a manifest (render a still once and it is written)
  for (const d of existsSync(FD) ? readdirSync(FD) : []) if (/^\d{4}-/.test(d) && d >= '2026-10-14' && existsSync(join(FD, d, 'story.js')) && !existsSync(join(FD, d, 'manifest.json'))) err(`film/${d}: no manifest.json (render at least one still: it is written automatically)`);
}

if (errors.length) {
  console.error(`\n✗ ${errors.length} check(s) failed:\n` + errors.map((e) => `  - ${e}`).join('\n') + '\n');
  process.exit(1);
}
console.log(`✓ checks passed — ${log ? log.length : 0} log entr${log && log.length === 1 ? 'y' : 'ies'}, ${folders.length} template folder(s)`);
