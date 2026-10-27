// GitHub Actions minutes this month, the way GitHub bills them (each job rounded up to a whole minute; all our jobs run on Linux, 1x),
// for the meter in the Showreels app (owner, 27 Oct 2026: know the minutes before the repo goes private, where they are capped).
// Plus the 30-day clean-up (owner, 27 Oct 2026): a reel's MP4 is removed from the releases 30 days after it was marked uploaded;
// its cover and post text stay. Nothing else is ever deleted.
//   env:  GH_TOKEN (the workflow token: actions read, contents write), REPO (owner/name), ALLOWANCE (minutes a month, default 2000 = GitHub Free)
//         GH_API_BASE (default https://api.github.com, for tests)
//         BASIC_AUTH_USER / BASIC_AUTH_PASS (site sign-in, to read the "uploaded" marks), SITE_BASE (default https://templates.aquariit.com)
//   in:   prev.json (optional) the last result, so only new runs are asked for their jobs
//   out:  showreel-usage-actions.json in the current directory; the workflow uploads it to the "reels" release
// Usage: node scripts/actions-usage.mjs [--cleanup] [--dry]
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const args = process.argv.slice(2), DRY = args.includes('--dry'), CLEAN = args.includes('--cleanup');
const TOKEN = process.env.GH_TOKEN || '', REPO = process.env.REPO || 'imshekharsingh/aquariit-templates';
const ALLOWANCE = +process.env.ALLOWANCE || 2000, SITE = (process.env.SITE_BASE || 'https://templates.aquariit.com').replace(/\/$/, '');
const API = (process.env.GH_API_BASE || 'https://api.github.com') + '/repos/' + REPO, MAX_JOB_CALLS = 600;   // the workflow token allows 1,000 calls an hour; the first run of a month catches up over two nights
if (!TOKEN) { console.error('✗ GH_TOKEN is missing'); process.exit(1); }
const gh = async (path, opt = {}) => {
  const r = await fetch(path.startsWith('http') ? path : API + path, { ...opt, headers: { Authorization: 'Bearer ' + TOKEN, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', ...(opt.headers || {}) } });
  if (!r.ok && r.status !== 204) throw new Error(`GitHub API ${r.status} on ${path.replace(/\?.*/, '')}`);
  return r.status === 204 ? null : r.json();
};
const mins = (a, b) => Math.max(1, Math.ceil((Date.parse(b) - Date.parse(a)) / 60000));

// 1. minutes this month (UTC month, as GitHub bills)
const now = new Date(), month = now.toISOString().slice(0, 7), start = month + '-01T00:00:00Z';
let prev = {}; try { if (existsSync('prev.json')) prev = JSON.parse(readFileSync('prev.json', 'utf8')); } catch { /* start fresh */ }
const known = prev.month === month && prev.runs ? prev.runs : {};
const runs = [];
for (let page = 1; page <= 30; page++) {
  const j = await gh(`/actions/runs?created=${encodeURIComponent('>=' + start.slice(0, 10))}&per_page=100&page=${page}`);
  runs.push(...j.workflow_runs); if (j.workflow_runs.length < 100) break;
}
let calls = 0, estimated = 0;
const out = {};
for (const r of runs) {
  if (r.status !== 'completed' || !r.run_started_at) continue;
  const id = String(r.id);
  if (known[id] && !known[id].est) { out[id] = known[id]; continue; }
  if (calls < MAX_JOB_CALLS) {
    calls++;
    const j = await gh(`/actions/runs/${id}/jobs?per_page=100`);
    const m = j.jobs.filter((x) => x.started_at && x.completed_at && x.conclusion !== 'skipped').reduce((s, x) => s + mins(x.started_at, x.completed_at), 0);
    out[id] = { w: r.name, m };
  } else { out[id] = { w: r.name, m: mins(r.run_started_at, r.updated_at), est: 1 }; estimated++; }   // filled in properly on the next run
}
const by = {};
for (const v of Object.values(out)) { by[v.w] = by[v.w] || { runs: 0, minutes: 0 }; by[v.w].runs++; by[v.w].minutes += v.m; }
const used = Object.values(by).reduce((s, v) => s + v.minutes, 0);
const day = now.getUTCDate() + now.getUTCHours() / 24, days = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)).getUTCDate();
const last7 = runs.filter((r) => out[r.id] && Date.parse(r.run_started_at) > now - 7 * 864e5).reduce((s, r) => s + out[r.id].m, 0);
const result = { month, at: now.toISOString(), allowance: ALLOWANCE, used, pace: Math.round(used / day * days), last7,
  estimatedRuns: estimated, workflows: Object.entries(by).map(([name, v]) => ({ name, ...v })).sort((a, b) => b.minutes - a.minutes), runs: out };
console.log(`Actions minutes ${month}: ${used} of ${ALLOWANCE} (${Math.round(100 * used / ALLOWANCE)}%), on pace for ${result.pace}; last 7 days ${last7}` + (estimated ? `; ${estimated} runs estimated, filled in next run` : ''));
for (const w of result.workflows) console.log(`  ${w.name}: ${w.minutes} min in ${w.runs} runs`);
writeFileSync('showreel-usage-actions.json', JSON.stringify(result));

// 2. the 30-day clean-up: MP4s of reels marked uploaded more than 30 days ago, from the "reels" release and, for tech reels, the "techreel" release
if (CLEAN) {
  const U = process.env.BASIC_AUTH_USER, P = process.env.BASIC_AUTH_PASS;
  if (!U || !P) { console.log('Clean-up skipped: no site sign-in to read the uploaded marks.'); process.exit(0); }
  const login = await fetch(SITE + '/login', { method: 'POST', redirect: 'manual', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ username: U, password: P }) });
  const cookie = (login.headers.getSetCookie ? login.headers.getSetCookie() : []).map((c) => c.split(';')[0]).join('; ');
  if (login.status !== 303 || !cookie) { console.log(`Clean-up skipped: the site refused the sign-in (HTTP ${login.status}).`); process.exit(0); }
  const up = await fetch(SITE + '/api/uploaded', { headers: { Cookie: cookie } });
  if (!up.ok) { console.log(`Clean-up skipped: could not read the uploaded marks (HTTP ${up.status}).`); process.exit(0); }
  const ids = (await up.json()).ids || {}, cutoff = Date.now() - 30 * 864e5;
  const old = Object.entries(ids).filter(([n, at]) => /^showreel-[a-z0-9-]+$/.test(n) && Date.parse(at) < cutoff).map(([n]) => n);
  const targets = [];
  for (const tag of ['reels', 'techreel']) {
    let rel; try { rel = await gh('/releases/tags/' + tag); } catch { continue; }
    const assets = [];
    for (let page = 1; page <= 10; page++) { const a = await gh(`/releases/${rel.id}/assets?per_page=100&page=${page}`); assets.push(...a); if (a.length < 100) break; }
    for (const n of old) {
      const file = tag === 'reels' ? n + '.mp4' : n.startsWith('showreel-tech-') ? n.slice('showreel-tech-'.length) + '.mp4' : null;
      const a = file && assets.find((x) => x.name === file);
      if (a) targets.push({ tag, id: a.id, name: a.name });
    }
  }
  if (!targets.length) console.log('Clean-up: nothing is past 30 days since upload.');
  for (const t of targets) {
    if (DRY) { console.log(`Clean-up (dry run): would remove ${t.tag}/${t.name}`); continue; }
    await gh(`/releases/assets/${t.id}`, { method: 'DELETE' });
    console.log(`Clean-up: removed ${t.tag}/${t.name} (posted more than 30 days ago; cover and post text kept)`);
  }
}
