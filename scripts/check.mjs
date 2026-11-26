// Dependency-free repo sanity checks (run by `npm run check` and the pipeline). Exits non-zero with an itemized list.
// The app is the showreel studio: home = Showreels (the 6-17 Oct templates and their archive were deleted, owner 31 Oct 2026);
// reels = seekable scenes rendered by the Showreel workflow.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { KITS, kitText, kitCopy } from './channel3/kit-inline.mjs';
import { gateProblems } from './review-gate.mjs';

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

// 4b. every reel of every channel is scheduled the same way (owner, 2 Nov 2026): a captions.json entry with "channel" and "postOn" (or "hidden"), added in the push that makes the reel
// previews leave the Inbox by code (owner, 23 Nov 2026): the app hides a preview once the owner answered it or 7 days after its "added" date; the
// file must not pile up either, so every entry needs "added" (YYYY-MM-DD IST) and an entry past 7 days is a warning (the daily read lists it for removal).
{ const pvf = join(T, 'showreels', 'previews.json');
  if (existsSync(pvf)) { const pv = readJSON(pvf, 'templates/showreels/previews.json'), t0 = new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 10);
    for (const it of (pv && pv.items) || []) { if (typeof it.needsOwner !== 'boolean') err(`previews.json ${it.name}: add "needsOwner": true or false (true only when the owner must act; false goes to the Studio log)`);
      if (typeof it.ask !== 'string' || !it.ask.trim()) err(`previews.json ${it.name}: add "ask", one plain line for the owner (what to check, what to tap)`);
      if (it.needsOwner === true) err(`previews.json ${it.name}: needsOwner must be false (owner, 24 Nov 2026: the owner is asked nothing about reels; the critic decides)`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(it.added || '')) err(`previews.json ${it.name}: add "added" (YYYY-MM-DD IST); the app hides a preview 7 days after it`);
      else if ((Date.parse(t0) - Date.parse(it.added)) / 864e5 > 7) console.warn(`  ⚠ previews.json ${it.name}: added ${it.added}, past 7 days: the app already hides it; remove it from the file`); } } }
// starter copies (scripts/starter.mjs, 24 Nov 2026): a config pushed with a "_starter" block or an unfilled "CHANGE:" would voice the marker
for (const dir of ['scripts/explainer', 'scripts/channel3', 'techreel/topics']) { const D = join(root, dir); for (const f of existsSync(D) ? readdirSync(D).filter((x) => x.endsWith('.json')) : []) {
  const s = readFileSync(join(D, f), 'utf8'); if (/"_starter"|CHANGE: /.test(s)) err(`${dir}/${f}: a starter copy still has "_starter" or "CHANGE: " (fill every CHANGE: place, then delete the _starter block)`); } }
if (caps) {
  const need = [];
  for (const dir of ['scripts/explainer', 'scripts/explainer/styles', 'scripts/channel3']) { const D = join(root, dir); for (const f of existsSync(D) ? readdirSync(D).filter((x) => x.endsWith('.json')) : []) { try { const n = JSON.parse(readFileSync(join(D, f), 'utf8')).name; if (n) need.push([n, `${dir}/${f}`]); } catch {} } }
  const TD = join(root, 'techreel', 'topics');
  for (const f of existsSync(TD) ? readdirSync(TD).filter((x) => x.endsWith('.json')) : []) { try { const s = JSON.parse(readFileSync(join(TD, f), 'utf8')).slug; if (s) need.push(['showreel-tech-' + s, `techreel/topics/${f}`]); } catch {} }
  // onGo (owner, 21 Nov 2026, Turns Out design series: "Don't mark these with dates yet, I'll upload based on response"): a finished reel with no date
  // sample (6 Nov 2026, temporary): a "sample": true entry is for review only, never scheduled, so it needs "channel" but no "postOn"
  // samples expire (owner, 11 Nov 2026: "why do we keep such things?"): a visible "sample" needs "until" (YYYY-MM-DD IST, at most 3 days
  // after it was made); once that day has passed the check fails until it is hidden, so no sample lingers in the app.
  { const today = new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 10);
    for (const [n, e] of Object.entries(caps)) if (e && e.sample && !e.hidden) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(e.until || '')) err(`captions.json ${n}: a sample needs "until" (YYYY-MM-DD IST, at most 3 days ahead), then "hidden": true`);
      else if (e.until < today) err(`captions.json ${n}: sample expired on ${e.until}: hide it ("hidden": true) or post it`); } }
  for (const [n, from] of need) { const e = caps[n]; if (!e || (!e.hidden && (!e.channel || (!e.postOn && !e.sample && !e.onGo)))) err(`${from}: add "${n}" to templates/showreels/captions.json with "channel" and "postOn" (YYYY-MM-DD IST), or "hidden": true`); }
}

// 4c. exact post time (owner, 5 Nov 2026): every reel posting from 5 Nov on has "postAt" (HH:MM IST), and the Worker has a cron 10 minutes
// before every slot in use (wrangler.jsonc; the reminders in src/worker.js send "Post now" for each reel due at that slot)
if (caps) {
  let crons = [];
  try { crons = (JSON.parse(readFileSync(join(root, 'wrangler.jsonc'), 'utf8').replace(/^\s*\/\/.*$/gm, '')).triggers || {}).crons || []; } catch (e) { err(`wrangler.jsonc: cannot read its crons (${e.message})`); }
  const todayIST = new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 10);
  const fired = new Set();   // UTC minutes of the day the post-reminder crons fire at ("M H1,H2 * * *"; the spare reminder "30 15 * * *" excluded)
  for (const c of crons) { const [mm, hh] = c.split(' '); if (c === '30 15 * * *' || !/^\d+$/.test(mm)) continue; for (const h of hh.split(',')) if (/^\d+$/.test(h)) fired.add(+h * 60 + +mm); }
  for (const [name, j] of Object.entries(caps)) {
    // only reels still to post need a reminder (past slots may have lost their cron); from 8 Nov 2026 every channel posts at 13:00 IST (owner)
    if (!j || j.hidden || !j.postOn || j.postOn < '2026-11-05' || j.postOn < todayIST) continue;
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(j.postAt || '')) { err(`captions.json ${name}: add "postAt" (HH:MM IST, the exact slot: 13:00 for every channel from 8 Nov 2026)`); continue; }
    // posting window (owner, 20 Nov 2026): any slot from 13:00 to 21:00 IST is fine without a note; a reel that fails is fixed and posted inside it
    const inWindow = j.postAt >= '13:00' && j.postAt <= '21:00';
    if (j.postOn >= '2026-11-08' && j.postAt !== '13:00' && !inWindow && !j.slotNote) err(`captions.json ${name}: postAt ${j.postAt}: every channel posts at 13:00 IST from 8 Nov 2026 (owner); a deliberate one-off slot needs "slotNote" with the reason`);
    const [h, m] = j.postAt.split(':').map(Number), utc = (((h * 60 + m - 10 - 330) % 1440) + 1440) % 1440;
    // a one-off late slot may skip the push reminder: "noReminder": true next to its "slotNote" (owner, 18 Nov 2026: Turns Out at 14:00, no new cron)
    if (!fired.has(utc) && !(j.slotNote && j.noReminder) && !(inWindow && j.postAt !== '13:00')) err(`captions.json ${name}: no reminder for ${j.postAt} IST; add a cron at ${String(utc % 60)} ${Math.floor(utc / 60)} UTC to wrangler.jsonc ("triggers")`);
  }
}

// 4d. posting slots (owner, 24 Nov 2026): design/slots.json has one HH:MM IST slot per channel inside the 13:00-21:00 window; reels without a postAt use it
{
  let sl = null;
  try { sl = JSON.parse(readFileSync(join(root, 'design/slots.json'), 'utf8')); } catch (e) { err(`design/slots.json: cannot read it (${e.message})`); }
  if (sl) for (const k of ['web', 'tech', 'c3']) { const v = sl.slots && sl.slots[k];
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(v || '') || v < '13:00' || v > '21:00') err(`design/slots.json: slots.${k} must be HH:MM between 13:00 and 21:00 IST (got ${v})`); }
}

// 4d2. AI label (owner, 24 Nov 2026): from 27 Nov every visible reel has "aiLabel": true or false (true when anything looks realistic enough to pass as real
// footage); the builder sets it, the critic checks it (design/critic.md), the app shows it and Post now sends it to Instagram
if (caps) for (const [name, j] of Object.entries(caps)) {
  if (!j || j.hidden || j.sample || !j.postOn || j.postOn < '2026-11-27') continue;
  if (typeof j.aiLabel !== 'boolean') err(`captions.json ${name}: add "aiLabel": true or false (true when anything looks realistic enough to pass as real footage; runbook-reels.md "AI label")`);
}

// 4e. tech rotation (owner, 22 Nov 2026: "every reel looks the same, no variation"; design/rules-tech.md "X" and "Rotation"): every visible tech
// entry posting from 2026-11-22 has "format" and "device"; no two consecutive posting days share a format or a device class; at most one
// "charging" (battery or charging) reel in any 7 days
if (caps) {
  const FORMATS = ['xray', 'showdown', 'quickmyth', 'indiapick'], DEVICES = ['audio', 'camera', 'wearables', 'laptop', 'home', 'car', 'phone', 'charging'];
  const tech = Object.entries(caps).filter(([, e]) => e && e.channel === 'tech' && !e.hidden && !e.sample && /^\d{4}-\d{2}-\d{2}$/.test(e.postOn || '') && e.postOn >= '2026-11-22')
    .sort((a, b) => a[1].postOn.localeCompare(b[1].postOn));
  const day = (d) => Date.parse(d + 'T00:00:00Z') / 864e5;
  for (const [n, e] of tech) {
    if (!FORMATS.includes(e.format)) err(`captions.json ${n}: tech needs "format": one of ${FORMATS.join(', ')} (design/rules-tech.md "X")`);
    if (!DEVICES.includes(e.device)) err(`captions.json ${n}: tech needs "device": one of ${DEVICES.join(', ')} (battery or charging topics are "charging")`);
  }
  for (let i = 1; i < tech.length; i++) {
    const [pn, p] = tech[i - 1], [n, e] = tech[i];
    if (p.postOn === e.postOn) err(`captions.json ${n}: a second visible tech reel on ${e.postOn} (with ${pn}); one a day (hide the replaced one)`);
    else if (day(e.postOn) - day(p.postOn) === 1) {
      if (p.format && p.format === e.format) err(`captions.json ${n}: format "${e.format}" again the day after ${pn}; rotate formats (design/rules-tech.md "Rotation")`);
      if (p.device && p.device === e.device) err(`captions.json ${n}: device "${e.device}" again the day after ${pn}; rotate device classes (design/rules-tech.md "Rotation")`);
    }
  }
  const chg = tech.filter(([, e]) => e.device === 'charging');
  for (let i = 1; i < chg.length; i++) if (day(chg[i][1].postOn) - day(chg[i - 1][1].postOn) < 7) err(`captions.json ${chg[i][0]}: a second battery / charging reel within 7 days of ${chg[i - 1][0]} (at most one a week)`);
}

// 4f. style record (owner chat, 25 Nov 2026; design/what-works.md "Style record"): every visible web / tech / Turns Out entry posting from 2026-11-25
// carries a "style" object so the Sunday review can rank hooks, length, pace, look and hero. Planned values go in with the entry (hookType, look, hero,
// firstSecondTension, payoff); the three measured numbers (lengthS, wordsPerS, shotChanges) may be null until the reel's post day, then they must be
// filled from the MP4 (scripts/style-measure.mjs). null is only for a value that is truly unknown, never a guess.
if (caps) {
  const HOOKS = ['question', 'claim', 'number', 'contrast'], LOOKS = ['dark', 'light'], YN = ['yes', 'no'], PAY = ['tip', 'fact'];
  const nowIST = new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 10);
  for (const [n, e] of Object.entries(caps)) {
    if (!e || e.hidden || e.sample || !['web', 'tech', 'c3'].includes(e.channel) || !/^\d{4}-\d{2}-\d{2}$/.test(e.postOn || '') || e.postOn < '2026-11-25') continue;
    const st = e.style;
    if (!st || typeof st !== 'object') { err(`captions.json ${n}: add a "style" object (lengthS, wordsPerS, shotChanges, hookType, look, hero, firstSecondTension, payoff; design/what-works.md "Style record")`); continue; }
    const num = (k) => st[k] === null || (typeof st[k] === 'number' && st[k] >= 0);
    for (const k of ['lengthS', 'wordsPerS', 'shotChanges']) {
      if (!num(k)) err(`captions.json ${n}: style.${k} must be a number or null`);
      else if (st[k] === null && e.postOn <= nowIST) err(`captions.json ${n}: style.${k} is still null on its post day: run scripts/style-measure.mjs on the rendered MP4`);
    }
    if (!HOOKS.includes(st.hookType)) err(`captions.json ${n}: style.hookType must be one of ${HOOKS.join(' / ')}`);
    if (!LOOKS.includes(st.look)) err(`captions.json ${n}: style.look must be dark or light`);
    if (typeof st.hero !== 'string' || !st.hero.trim()) err(`captions.json ${n}: style.hero must name the main object (a short phrase)`);
    if (!YN.includes(st.firstSecondTension)) err(`captions.json ${n}: style.firstSecondTension must be yes or no`);
    if (!PAY.includes(st.payoff)) err(`captions.json ${n}: style.payoff must be tip or fact`);
  }
}

// 4d. the Mandatory Gate (owner, 7 Nov 2026; design/mandatory.md): every reel posting from 2026-11-08 on has review/<channel>/<name>.md with
// all 13 items PASS and their evidence (item 13, after the render, may be PENDING until its post day is past); scripts/review-gate.mjs
if (caps) for (const m of gateProblems(caps)) err(m);

// 5. reel configs: a showreel name, a scene that exists, and post text
for (const dir of ['scripts/explainer', 'scripts/explainer/styles', 'scripts/showreel', 'scripts/channel3']) {   // styles: the web style tests (7 Nov 2026)
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
    // the shared kits (scripts/channel3/kit3d.js, kit25d.js, scripts/explainer/kitmotion.js) are copied into each scene that uses them: a stale copy fails (node scripts/channel3/kit-inline.mjs <scene>)
    { const sc = j.seek && existsSync(join(root, j.seek)) ? readFileSync(join(root, j.seek), 'utf8') : '';
      for (const k of KITS) { const cp = kitCopy(sc, k); if (cp !== null && cp !== kitText(k)) err(`${label}: its copy of the ${k.name} kit is stale; run node scripts/channel3/kit-inline.mjs ${j.seek}`); } }
    // Channel 3 (owner, 31 Oct 2026: true stories, every claim in two sources): the sources the app lists and copies as a comment
    if (dir === 'scripts/channel3') {
      const src = Array.isArray(j.sources) ? j.sources : [];
      if (src.length < 2 || !src.every((x) => x && String(x.title || '').trim() && /^https:\/\/\S+$/.test(x.url || ''))) err(`${label}: needs a "sources" list of at least 2 entries, each { title, url (https) }`);
    }
  }
}

// 5b. the web motion kit's demo and starter scenes outside the reel folders (scripts/explainer/demo) keep a fresh copy of the kit too
{ const D = join(root, 'scripts/explainer/demo');
  for (const f of existsSync(D) ? readdirSync(D).filter((x) => x.endsWith('.html')) : []) { const sc = readFileSync(join(D, f), 'utf8');
    for (const k of KITS) { const cp = kitCopy(sc, k); if (cp !== null && cp !== kitText(k)) err(`scripts/explainer/demo/${f}: its copy of the ${k.name} kit is stale; run node scripts/channel3/kit-inline.mjs scripts/explainer/demo/${f}`); } } }

// 6. every ffmpeg command that writes a delivered MP4 puts the moov atom first (owner, 6 Nov 2026: reels were slow to start in the app because
// the sound remux dropped +faststart). A command writes an MP4 when a *.mp4 argument is not an input (-i), or when it encodes AAC (the final mux).
{
  const files = [];
  const add = (d, re) => { const D = join(root, d); if (existsSync(D)) for (const f of readdirSync(D)) { const p = join(D, f); if (statSync(p).isDirectory()) add(join(d, f), re); else if (re.test(f)) files.push(join(d, f)); } };
  add('.github/workflows', /\.ya?ml$/); add('scripts', /\.(sh|mjs|py)$/); add('techreel', /\.py$/);
  for (const f of files) {
    const text = readFileSync(join(root, f), 'utf8').replace(/\\\n/g, ' ');
    // one command = the ffmpeg line up to its end; for a Python or JS argument list, up to the closing bracket
    for (const m of text.matchAll(/(['"]?)ffmpeg\1[ ,]([^\n]*(?:\n(?![^\n]*ffmpeg)[^\n]*){0,2})/g)) {
      let cmd = m[2];
      if (m[1]) { const end = cmd.search(/\]/); if (end >= 0) cmd = cmd.slice(0, end); } else cmd = cmd.split('\n')[0];
      const toks = cmd.match(/'[^']*'|"[^"]*"|\S+/g) || [];
      const out = toks.some((t, i) => /\.mp4['"]?,?$/.test(t) && !/^['"]?-i['"]?,?$/.test(toks[i - 1] || '')) || /-c:a['"]?,? *['"]?aac/.test(cmd);
      if (out && !/\+faststart/.test(cmd)) err(`${f}: an ffmpeg command writes an MP4 without -movflags +faststart (the moov atom must come first so phones start playing at once): ${cmd.trim().slice(0, 120)}`);
    }
  }
}

// ready filter (owner, 26 Nov 2026): Post now cards may only show for a reel whose journey status is ready; no or old journey data shows none
{
  const idx = readFileSync(join(T, 'index.html'), 'utf8'), m = /\.filter\(function\(x\)\{ var m = c\[x\.name\][^\n]*\n[^\n]*return ([^\n]*?)\; \}\)/.exec(idx);
  if (!m) err('ready filter: the Ready-to-post filter in templates/index.html was not found');
  else if (!/!!r\s*&&/.test(m[1]) || !/status\(r\)\.k === 'ready'/.test(m[1]) || !/!j\.stale/.test(m[1])) err('ready filter: Ready to post must need a journey reel (!!r) with status ready and a fresh journey, found: ' + m[1].slice(0, 120));
  const wk = readFileSync(join(root, 'src/worker.js'), 'utf8');
  if (!/if \(j && j\.stale\) return no\('status-old'/.test(wk) || !/if \(r && !\(r\.stages && r\.stages\.ready/.test(wk)) err('ready filter: /api/post must refuse a reel whose journey status is not READY, and any reel while the journey is stale');
  const caps = readJSON(join(T, 'showreels/captions.json'), 'captions.json');
  if (caps && caps['showreel-tech-battery-cycles'] && !caps['showreel-tech-battery-cycles'].hidden) err('showreel-tech-battery-cycles must stay hidden (owner did not post it, 25 Nov)');
}
if (errors.length) {
  console.error(`✗ ${errors.length} problem(s):\n` + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}
console.log(`✓ checks passed — ${pages.length} pages, app shell and reel configs OK`);
