// The studio status sheet (owner, 26 Nov 2026), read by the studio probe (design/probe.md): ONE compact report, read-only, no secrets printed.
//   env: BASIC_AUTH_USER / BASIC_AUTH_PASS (site sign-in, like scripts/asks.mjs), GH_TOKEN + REPO (gh api, runs), STAGE_KEY (reads the probe log so an
//        action handled in the last 6 h is not raised again), SITE_BASE (default https://templates.aquariit.com)
//   test: STATUS_NOW=<ISO time> pretends it is that moment; STATUS_FIXTURE=<json file> {"/api/feedback?state=new": {...}, ...} replaces the site; --no-log skips the probe log
//   node scripts/studio-status.mjs
// Sections: FEEDBACK + ANSWERS (Fix items first), REELS (today and tomorrow per channel with their stage), RUNS (failed or stuck, last 3 h), DUE (within 2 h
// and not READY), POSTS (made 20-90 min ago with first numbers), PROJECTS (stuck = no update in 6 h while not waiting on the owner), then ONE last line: "ACTIONS: none" or "ACTIONS: <item> || <item>".
// Each item is "<KIND> <plain detail> [key]"; the key is what the probe logs so the next check does not raise it twice.
// KIND: START-BUILDER, START-CRITIC, START-FIX (probe starts a session) · OWNER-CHAT (probe messages the owner chat). The sheet never builds or renders.
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { catalogue, istDay } from './reel-match.mjs';
import { probeRows } from './probe-lib.mjs';

const NOW = process.env.STATUS_NOW ? Date.parse(process.env.STATUS_NOW) : Date.now(), HOUR = 36e5, MIN = 6e4;
const SITE = (process.env.SITE_BASE || 'https://templates.aquariit.com').replace(/\/$/, ''), REPO = process.env.REPO || 'imshekharsingh/aquariit-templates';
const today = istDay(new Date(NOW).toISOString()), tomorrow = istDay(new Date(NOW + 24 * HOUR).toISOString());
const hm = (ms) => new Date(ms + 5.5 * HOUR).toISOString().slice(11, 16), dm = (d) => new Date(d + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const out = [], say = (s = '') => { out.push(s); console.log(s); }, actions = [], blind = [];
const act = (kind, text, ...keys) => actions.push({ kind, text, keys });
const dueAt = (r) => Date.parse(`${r.postOn}T${r.postAt}:00+05:30`);

// ---- the site (signed in) or a test fixture
let cookie = null;
const fixture = process.env.STATUS_FIXTURE ? JSON.parse(readFileSync(process.env.STATUS_FIXTURE, 'utf8')) : null;
async function site(path) {
  if (fixture) { if (!(path in fixture)) throw new Error('not in fixture'); return fixture[path]; }
  if (!cookie) {
    const U = process.env.BASIC_AUTH_USER, P = process.env.BASIC_AUTH_PASS;
    if (!U || !P) throw new Error('no sign-in secrets');
    const login = await fetch(SITE + '/login', { method: 'POST', redirect: 'manual', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ username: U, password: P }) });
    cookie = (login.headers.getSetCookie ? login.headers.getSetCookie() : []).map((c) => c.split(';')[0]).join('; ');
    if (login.status !== 303 || !cookie) { cookie = null; throw new Error(`sign-in refused (HTTP ${login.status})`); }
  }
  const r = await fetch(SITE + path, { headers: { Cookie: cookie } });
  if (!r.ok) throw new Error(`${path}: HTTP ${r.status}`);
  return r.json();
}
const safe = async (what, fn, dflt) => { try { return await fn(); } catch (e) { blind.push(what); say(`  ${what}: cannot read (${String(e.message).slice(0, 80)})`); return dflt; } };
const gh = (p) => JSON.parse(execFileSync('gh', ['api', p], { encoding: 'utf8', maxBuffer: 1 << 26, timeout: 60000 }));

// ---- what was already handled in the last 6 h (probe log)
const handled = new Map();
if (!process.argv.includes('--no-log')) { const { rows, error } = probeRows(6); if (!error) for (const r of rows) if (r.acted) for (const k of r.keys) handled.set(k, r.at); }

say(`STUDIO STATUS ${today} ${hm(NOW)} IST`);

// ---- 1. feedback and answers
say('FEEDBACK');
const fbAll = await safe('feedback', async () => ((await site('/api/feedback?state=new')).feedback || []), []);
const fix = fbAll.filter((f) => f.priority), plain = fbAll.filter((f) => !f.priority);
const answers = await safe('answers', async () => ((await site('/api/asks?answered=1')).asks || []), []);
for (const f of fix) say(`  FIX ${f.id} ${f.channel || '-'} ${JSON.stringify(String(f.text || '').slice(0, 110))}`);
for (const f of plain.slice(0, 5)) say(`  new ${f.id} ${f.channel || '-'} ${JSON.stringify(String(f.text || '').slice(0, 80))}`);
for (const a of answers.slice(0, 5)) say(`  answer ${a.id}: ${JSON.stringify(String(a.answer || '').slice(0, 60))}`);
say(`  ${fix.length} priority Fix, ${plain.length} other new, ${answers.length} answers waiting`);
if (fix.length) act('OWNER-CHAT', `${fix.length} priority Fix item${fix.length > 1 ? 's' : ''} from the board (${fix.map((f) => f.id).join(', ')}): ${String(fix[0].text || '').slice(0, 70)}`, ...fix.map((f) => 'fix:' + f.id));
if (plain.length || answers.length) act('OWNER-CHAT', `${plain.length} new feedback, ${answers.length} owner answer${answers.length === 1 ? '' : 's'} waiting`, ...plain.map((f) => 'fb:' + f.id), ...answers.map((a) => 'ans:' + a.id));

// ---- 2. reels today and tomorrow
const cat = catalogue(), marks = await safe('posted marks', async () => (await site('/api/uploaded')).ids || {}, {});
const board = await safe('stage board', async () => (await site('/api/stage')).rows || [], []);
const perf = {};   // channel -> media rows
await safe('instagram numbers', async () => { for (const [ch, acc] of Object.entries({ web: 'webin20sec', tech: 'techin20sec', c3: 'itturns.out' })) perf[ch] = (await site('/api/perf?days=3&account=' + encodeURIComponent(acc))).media || []; }, null);
let runs = [];
try { runs = gh(`repos/${REPO}/actions/runs?per_page=100`).workflow_runs || []; } catch (e) { blind.push('runs'); say(`  runs: cannot read (${String(e.message).split('\n')[0].slice(0, 80)})`); }
const WF = { Showreel: 'render', 'Tech reel': 'render', 'Output QA': 'qa', 'Template pipeline': 'pipeline' };
const cuts = (r) => ({ id: r.id, wf: r.name, kind: WF[r.name], title: r.display_title || '', head: r.head_branch || '', st: r.status, concl: r.conclusion, at: Date.parse(r.run_started_at || r.created_at), url: r.html_url });
const R = runs.filter((r) => WF[r.name]).map(cuts).sort((a, b) => b.at - a.at);
const names = Object.keys(cat);
const reelOf = (run) => {   // same rule as src/journey.js runReel
  const m = /·\s*(\S+)/.exec(run.title); if (!m || /\(preview\)/.test(run.title)) return null;
  const arg = m[1], base = arg.split('/').pop().replace(/\.json$/, '');
  if (/^techreel\/topics\//.test(arg) || (!arg.includes('/') && /^Tech reel/.test(run.title))) return names.includes('showreel-tech-' + base) ? 'showreel-tech-' + base : null;
  return names.find((n) => n === base) || names.find((n) => n.endsWith('-' + base)) || null;
};
const latest = { render: {}, qa: {} };
for (const r of R) if (r.kind !== 'pipeline') { const n = reelOf(r); if (n && !latest[r.kind][n]) latest[r.kind][n] = r; }
const gitTime = (f) => { try { return Date.parse(execFileSync('git', ['log', '-1', '--format=%cI', '--', f], { encoding: 'utf8' }).trim()) || 0; } catch { return 0; } };
const verdictOf = (r) => {
  const f = `review/${r.channel}/${r.name}.md`; if (!existsSync(f)) return null;
  let v = null; for (const l of readFileSync(f, 'utf8').split('\n')) { const m = /CRITIC:\s*(NOT READY|READY)\b(.*)$/i.exec(l); if (m) v = { ready: m[1].toUpperCase() === 'READY', text: m[2].replace(/^\s*\([^)]*\)/, '').replace(/^[\s:,.-]+/, '').trim(), at: 0 }; }
  if (v) v.at = gitTime(f); return v;
};
const postedAt = (r) => { if (marks[r.name]) return Date.parse(marks[r.name]) || NOW; const p = (perf[r.channel] || []).find((m) => m.template_id === r.name); return p ? Date.parse(p.posted_at) : null; };
function stageOf(r) {
  const pa = postedAt(r); if (pa) return { s: 'POSTED', at: pa };
  const v = verdictOf(r), rr = latest.render[r.name], qq = latest.qa[r.name];
  const newer = rr && v && rr.at > v.at;
  if (v && !newer && !(qq && qq.concl === 'success' && qq.at > v.at && !v.ready)) return v.ready ? { s: 'READY', v } : { s: 'NOT READY', v };
  if (rr) {
    if (rr.st !== 'completed') return { s: 'RENDERING', run: rr, stuck: NOW - rr.at > 90 * MIN };
    if (rr.concl !== 'success') return { s: 'RENDER FAILED', run: rr };
    if (!qq || qq.at < rr.at) return { s: 'QA PENDING', run: rr };
    if (qq.st !== 'completed') return { s: 'QA RUNNING', run: qq, stuck: NOW - qq.at > 30 * MIN };
    if (qq.concl !== 'success') return { s: 'QA FAILED', run: qq };
    return { s: 'CRITIC PENDING', run: qq, at: qq.at };
  }
  return { s: r.config || existsSync(`review/${r.channel}/${r.name}.md`) ? 'BUILT' : 'PLANNED' };
}
say('REELS');
const reels = Object.values(cat).filter((r) => r.postOn && (r.postOn === today || r.postOn === tomorrow) && !r.hidden && ['web', 'tech', 'c3'].includes(r.channel))
  .sort((a, b) => dueAt(a) - dueAt(b));
const due = [], info = new Map();
for (const r of reels) {
  const st = stageOf(r); info.set(r.name, st);
  const b = board.find((x) => x.reel === r.name || x.reel === r.channel), boardTxt = b ? ` · board: ${b.stage}${b.pct != null ? ' ' + b.pct + '%' : ''} at ${hm(Date.parse(b.at))}` : '';
  say(`  ${r.channel.padEnd(4)} ${r.name}  ${r.postOn === today ? 'today' : dm(r.postOn)} ${r.postAt}  ${st.s}${st.stuck ? ' (stuck)' : ''}${st.s === 'CRITIC PENDING' ? ` (QA passed ${hm(st.at)})` : ''}${st.v && !st.v.ready ? ': ' + st.v.text.slice(0, 90) : ''}${boardTxt}`);
  const left = dueAt(r) - NOW, alive = b && NOW - Date.parse(b.at) < 60 * MIN, isToday = r.postOn === today;
  if (st.s === 'READY' || st.s === 'POSTED') continue;
  if (left < 2 * HOUR && left > -3 * HOUR) due.push({ r, st, left });
  if (st.s === 'CRITIC PENDING' && NOW - st.at > 20 * MIN) act('START-CRITIC', `${r.channel} ${r.name}: Output QA passed ${hm(st.at)}, no critic verdict`, 'critic:' + r.name);
  else if (st.s === 'NOT READY' && isToday && !alive) act('START-FIX', `${r.channel} ${r.name}: critic says NOT READY, no builder active (${st.v.text.slice(0, 90)})`, 'fix-reel:' + r.name);
  else if ((st.s === 'PLANNED' || st.s === 'BUILT') && isToday && left < 2 * HOUR && !alive) act('START-BUILDER', `${r.channel} ${r.name}: due ${r.postAt}, only ${st.s.toLowerCase()}, no builder active`, 'build:' + r.name);
  else if (['RENDER FAILED', 'QA FAILED'].includes(st.s) || st.stuck) act('OWNER-CHAT', `${r.channel} ${r.name}: ${st.s.toLowerCase()}${st.stuck ? ' (stuck)' : ''}, due ${r.postAt}; a fix render needs the owner's yes if it is render 3`, 'run:' + st.run.id);
}
if (!reels.length) say('  no reels planned for today or tomorrow');

// ---- 3. failed or stuck runs, last 3 h
say('RUNS (last 3 h)');
const seen = new Set(), bad = [];
for (const r of R.filter((x) => NOW - x.at < 3 * HOUR)) {
  const g = r.wf + '|' + (r.kind === 'pipeline' ? r.head : r.title); if (seen.has(g)) continue; seen.add(g);   // newest run of each job decides
  const stuck = r.st !== 'completed' && NOW - r.at > (r.kind === 'render' ? 90 : 30) * MIN;
  if (['failure', 'timed_out', 'startup_failure'].includes(r.concl) || stuck) bad.push({ r, stuck });
}
for (const { r, stuck } of bad) { say(`  ${stuck ? 'STUCK' : 'FAILED'} ${r.wf}: ${(r.kind === 'pipeline' ? r.head : r.title).slice(0, 70)} (${hm(r.at)}) ${r.url}`);
  const n = reelOf(r), st = n && info.get(n);
  if (!(st && st.run && st.run.id === r.id)) act('OWNER-CHAT', `${r.wf} ${stuck ? 'stuck' : 'failed'}: ${(r.kind === 'pipeline' ? r.head : r.title).slice(0, 60)} at ${hm(r.at)}`, 'run:' + r.id); }
if (!bad.length && !blind.includes('runs')) say('  none failing or stuck');

// ---- 4. due within 2 h and not READY
say('DUE within 2 h, not ready');
for (const { r, st, left } of due) say(`  ${r.channel} ${r.name} ${r.postAt} (${left > 0 ? 'in ' + Math.round(left / MIN) + ' min' : Math.round(-left / MIN) + ' min late'}): ${st.s}`);
if (!due.length) say('  none');

// ---- 5. posts made 20-90 min ago
say('POSTS made 20-90 min ago');
let np = 0;
for (const [ch, media] of Object.entries(perf)) for (const m of media || []) {
  const age = NOW - Date.parse(m.posted_at); if (!(age >= 20 * MIN && age <= 90 * MIN)) continue; np++;
  const nums = m.metrics_day ? `views ${m.views ?? '-'}, reach ${m.reach ?? '-'}, saves ${m.saves ?? '-'}, shares ${m.shares ?? '-'} (as of ${m.metrics_day})` : 'no numbers yet';
  const name = m.template_id || 'unmatched post'; say(`  ${ch} ${name}: posted ${hm(Date.parse(m.posted_at))} (${Math.round(age / MIN)} min ago), ${nums}`);
  if (m.metrics_day && m.template_id) act('OWNER-CHAT', `posted ${ch} ${name}: ${nums}`, 'posted:' + name);
  if (!m.template_id) act('OWNER-CHAT', `${ch}: a post at ${hm(Date.parse(m.posted_at))} matches no reel`, 'unmatched:' + m.ig_id);
}
if (!np) say('  none');

// ---- 6. projects (owner, 26 Nov 2026): work that is not a channel reel; stuck = no update in 6 h while not waiting on the owner or done
say('PROJECTS');
let projects = null;
try { projects = (await site('/api/projects')).projects; } catch { /* fall back to the file in this checkout */ }
if (!projects) { try { projects = JSON.parse(readFileSync('design/projects.json', 'utf8')).projects || []; } catch { projects = []; blind.push('projects'); } }
for (const p of projects) {
  const at = Date.parse(p.updatedAt || ''), age = Number.isFinite(at) ? NOW - at : Infinity;
  if (p.stage === 'done' && age > 2 * 24 * HOUR) continue;
  const stuck = !['waiting', 'done'].includes(p.stage) && age > 6 * HOUR;
  say(`  ${p.id} (${p.account || 'other'} account): ${p.stage}${p.pct != null ? ' ' + p.pct + '%' : ''}${Number.isFinite(at) ? ', updated ' + hm(at) + (age > 24 * HOUR ? ' ' + dm(istDay(p.updatedAt)) : '') : ''}${stuck ? ' (stuck)' : ''}: ${String(p.line || '').slice(0, 90)}`);
  if (stuck) act('OWNER-CHAT', `project ${p.name || p.id} has not moved for ${Math.round(age / HOUR)} h (${p.stage})`, `project-stuck:${p.id}:${p.updatedAt}`);
  else if (p.stage === 'failed') act('OWNER-CHAT', `project ${p.name || p.id} found a problem: ${String(p.line || '').slice(0, 90)}`, `project-failed:${p.id}:${p.updatedAt}`);
}
if (!projects.length) say('  none');

// ---- actions (minus what an earlier check already handled)
if (blind.length) act('OWNER-CHAT', `the status sheet cannot read: ${[...new Set(blind)].join(', ')}`, 'blind:' + [...new Set(blind)].sort().join('+'));
const live = [];
for (const a of actions) {
  const fresh = a.keys.filter((k) => !handled.has(k));
  if (a.keys.length && !fresh.length) { say(`already handled (${hm(Date.parse(handled.get(a.keys[0])))}): ${a.kind} ${a.text}`); continue; }
  live.push(`${a.kind} ${a.text} [${(fresh.length ? fresh : a.keys).join(',')}]`);
}
say(live.length ? `ACTIONS: ${live.join(' || ')}` : 'ACTIONS: none');
