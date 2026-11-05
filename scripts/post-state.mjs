// Posting state (owner, 5 Nov 2026: "are all the reels marked right with right content to upload"). Read-only. Run by the "Instagram collect"
// workflow after the collect (and alone with its "state-only" input). Per channel, every reel with postOn from 7 days ago to 2 days ahead:
// postOn, postAt, posted on Instagram (when), marked in the app, video in R2, post text present. Problems print as PROBLEM lines:
// posted but not marked, marked but not posted, a due reel without video or post text, overdue and not posted, two reels in one channel slot.
//   env: BASIC_AUTH_USER / BASIC_AUTH_PASS (site sign-in), SITE_BASE (default https://templates.aquariit.com)
//   node scripts/post-state.mjs [--fresh]    --fresh: Instagram data was collected just now (else only marks older than the last collect day are judged)
import { appendFileSync } from 'node:fs';
import { catalogue, CHANNEL_ACCOUNT, istDay } from './reel-match.mjs';

const SITE = (process.env.SITE_BASE || 'https://templates.aquariit.com').replace(/\/$/, ''), U = process.env.BASIC_AUTH_USER, P = process.env.BASIC_AUTH_PASS;
const FRESH = process.argv.includes('--fresh'), DAY = 864e5, now = Date.now(), today = istDay(new Date(now).toISOString());
const out = [], say = (m) => { out.push(m); console.log(m); };
if (!U || !P) { console.error('✗ BASIC_AUTH_USER / BASIC_AUTH_PASS are not set'); process.exit(1); }
const login = await fetch(SITE + '/login', { method: 'POST', redirect: 'manual', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ username: U, password: P }) });
const cookie = (login.headers.getSetCookie ? login.headers.getSetCookie() : []).map((c) => c.split(';')[0]).join('; ');
if (login.status !== 303 || !cookie) { console.error(`✗ The site refused the sign-in (HTTP ${login.status})`); process.exit(1); }
const get = async (p) => { const r = await fetch(SITE + p, { headers: { Cookie: cookie } }); if (!r.ok) throw new Error(`${p}: HTTP ${r.status}`); return r.json(); };

const marks = (await get('/api/uploaded')).ids || {};
const store = Object.fromEntries(((await get('/api/showreels')).showreels || []).map((s) => [s.name, s]));
const posted = {};   // reel -> earliest Instagram post
let updated = null;
for (const [ch, acc] of Object.entries(CHANNEL_ACCOUNT)) {
  const j = await get('/api/perf?days=30&account=' + encodeURIComponent(acc)).catch(() => ({}));
  if (j.updated && (!updated || j.updated > updated)) updated = j.updated;
  for (const m of j.media || []) if (m.template_id && m.posted_at && (!posted[m.template_id] || m.posted_at < posted[m.template_id].posted_at)) posted[m.template_id] = { ...m, ch };
}
// marks made after the last Instagram read cannot be judged yet (the post may be newer than the data)
const judgedUntil = FRESH ? now : updated ? Date.parse(updated + 'T00:00:00+05:30') : 0;

const cat = catalogue(), from = istDay(new Date(now - 7 * DAY).toISOString()), to = istDay(new Date(now + 2 * DAY).toISOString());
const hm = (iso) => new Date(Date.parse(iso) + 5.5 * 3600e3).toISOString().slice(5, 16).replace('T', ' ');
const yn = (b) => (b ? 'yes' : 'NO');
const problems = [];
say(`Posting state ${today} IST (reels due ${from} .. ${to}; Instagram data ${FRESH ? 'fresh' : 'as of ' + (updated || '?')})`);
for (const ch of ['web', 'tech', 'c3']) {
  const rows = Object.values(cat).filter((r) => r.channel === ch && r.postOn && r.postOn >= from && r.postOn <= to && (!r.hidden || posted[r.name] || marks[r.name]))
    .sort((a, b) => (a.postOn + a.postAt).localeCompare(b.postOn + b.postAt));
  say(`\n${ch} (@${CHANNEL_ACCOUNT[ch]}): postOn | postAt | reel | on Instagram | marked | video | post text`);
  const slots = {};
  for (const r of rows) {
    const ig = posted[r.name], mk = marks[r.name], s = store[r.name] || {}, video = !!s.video, text = !!(r.caption || s.info), due = Date.parse(`${r.postOn}T${r.postAt}:00+05:30`);
    say([r.postOn, r.postAt, r.name + (r.hidden ? ' (hidden)' : ''), ig ? 'yes ' + hm(ig.posted_at) : 'no', mk ? 'yes ' + hm(mk) : 'no', yn(video), yn(text)].join(' | '));
    const p = (m) => problems.push(`PROBLEM ${ch} ${r.name}: ${m}`);
    if (!r.hidden) (slots[r.postOn + ' ' + r.postAt] = slots[r.postOn + ' ' + r.postAt] || []).push(r.name);
    if (ig && !mk) p('posted on Instagram but not marked in the app');
    if (ig && mk && Math.abs(Date.parse(mk) - Date.parse(ig.posted_at)) > 5 * 60e3) p(`marked at ${hm(mk)} but posted at ${hm(ig.posted_at)}`);
    if (!ig && mk && Date.parse(mk) < judgedUntil) p(`marked posted (${hm(mk)}) but not found on Instagram`);
    if (!ig && !mk && !r.hidden && r.postOn <= today && (!video || !text)) p(`due ${r.postOn} ${r.postAt} but ${!video ? 'no video in R2' : ''}${!video && !text ? ' and ' : ''}${!text ? 'no post text' : ''}`);
    if (!ig && !mk && !r.hidden && due < now - 3 * 3600e3 && due < judgedUntil) p(`overdue since ${r.postOn} ${r.postAt} and not on Instagram`);
  }
  for (const [slot, names] of Object.entries(slots)) if (names.length > 1) problems.push(`PROBLEM ${ch} slot ${slot}: ${names.length} reels (${names.join(', ')})`);
}
say('');
for (const p of problems) say(p);
say(problems.length ? `POST_STATE=problems (${problems.length})` : 'POST_STATE=ok');
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, '### Posting state\n\n```\n' + out.join('\n') + '\n```\n');
