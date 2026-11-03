// GitHub Actions minutes this month, the way GitHub bills them (each job rounded up to a whole minute; all our jobs run on Linux, 1x),
// for the meter in the Showreels app (owner, 27 Oct 2026: know the minutes before the repo goes private, where they are capped).
// Reel videos are no longer cleaned up here (owner, 3 Nov 2026): they live in the private R2 bucket, whose lifecycle rule deletes v/ files
// 15 days after upload. The old release clean-up is in attic/scripts/actions-usage-cleanup.mjs.
//   env:  GH_TOKEN (the workflow token: actions read, contents write), REPO (owner/name), ALLOWANCE (minutes a month, default 2000 = GitHub Free)
//         GH_API_BASE (default https://api.github.com, for tests)
//   in:   prev.json (optional) the last result, so only new runs are asked for their jobs
//   out:  showreel-usage-actions.json in the current directory; the workflow keeps it in R2 (c/showreel-usage-actions.json)
// Usage: node scripts/actions-usage.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const TOKEN = process.env.GH_TOKEN || '', REPO = process.env.REPO || 'imshekharsingh/aquariit-templates';
const ALLOWANCE = +process.env.ALLOWANCE || 2000;
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
