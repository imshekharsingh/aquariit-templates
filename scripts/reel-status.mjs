// After a render (CLAUDE.md "Automate as we go", 3 Nov 2026: done by hand on the spare night): finds the latest "Showreel" run for a
// reel, says whether it is running, failed (which job, and its last error lines) or done, prints the voice check (pacing table, unsure
// words, what the recogniser heard) and the "Showreel ready" issue, and saves the contact sheet (the run's "review" artifact) to look at. Uses `gh api` (REST), which
// works from a session; one call per run, no polling (start it once, about 25 minutes after the dispatch).
// Usage: node scripts/reel-status.mjs scripts/channel3/<slug>.json [out dir]   (exit 0 done, 1 failed, 2 still running or not found)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const [cfgPath, out = '.'] = process.argv.slice(2);
if (!cfgPath) { console.error('usage: node scripts/reel-status.mjs <config.json> [out dir]'); process.exit(2); }
const NAME = JSON.parse(readFileSync(cfgPath, 'utf8')).name, REPO = process.env.REPO || 'imshekharsingh/aquariit-templates';
const gh = (path, raw) => execFileSync('gh', ['api', ...(raw ? ['-H', 'Accept: application/octet-stream'] : []), path], { maxBuffer: 1 << 28, encoding: raw ? 'buffer' : 'utf8', timeout: 90000 });
const runs = JSON.parse(gh(`repos/${REPO}/actions/workflows/showreel.yml/runs?per_page=12`)).workflow_runs;
for (const run of runs) {
  const jobs = JSON.parse(gh(`repos/${REPO}/actions/runs/${run.id}/jobs`)).jobs, log = (j) => gh(`repos/${REPO}/actions/jobs/${j.id}/logs`);
  const probe = jobs.find((j) => j.name === 'voice' && j.status === 'completed') || jobs.find((j) => j.status === 'completed') || jobs[0];
  if (!probe) continue;
  let text = ''; try { text = log(probe); } catch { continue; }
  if (!text.includes(cfgPath) && !text.includes(NAME)) continue;   // another reel's run
  console.log(`RUN ${run.id}: ${run.status}${run.conclusion ? ' / ' + run.conclusion : ''}, started ${run.run_started_at} (${run.html_url})`);
  if (run.status !== 'completed') { console.log('Still running: check once more later (no polling).'); jobs.forEach((j) => console.log(`  ${j.name}: ${j.status}${j.conclusion ? ' / ' + j.conclusion : ''}`)); process.exit(2); }
  if (run.conclusion !== 'success') {
    for (const j of jobs.filter((j) => j.conclusion === 'failure')) { const L = log(j).split('\n').map((l) => l.replace(/^\S+Z /, ''));
      const i = L.findIndex((l) => l.includes('##[error]')); console.log(`FAILED job "${j.name}":\n` + L.slice(Math.max(0, i - 12), i + 1).join('\n')); }
    process.exit(1);
  }
  const R = jobs.find((j) => j.name === 'render'), L = R ? log(R).split('\n').map((l) => l.replace(/^\S+Z /, '')) : [];
  const keep = L.filter((l) => /^(Unsure words|Heard:|### Pacing|SOUND (GATE|DETAIL)|\| )/.test(l) || /issues\/\d+$/.test(l));
  console.log(keep.length ? keep.join('\n') : 'No voice check lines found in the render job.');
  // the contact sheet is a run artifact kept 2 days (owner, 3 Nov 2026: reel media live only in the private R2 bucket, never in public releases)
  const art = JSON.parse(gh(`repos/${REPO}/actions/runs/${run.id}/artifacts`)).artifacts.find((x) => x.name === 'review' && !x.expired);
  if (art) { mkdirSync(out, { recursive: true }); const zip = `${out}/${NAME}-review.zip`;
    // the zip comes from a blob storage host that some sessions cannot reach (4 Nov 2026: HTTP 415 with the octet-stream header, Forbidden
    // without it): say so instead of crashing, so the voice check above still stands
    try { writeFileSync(zip, gh(`repos/${REPO}/actions/artifacts/${art.id}/zip`)); execFileSync('unzip', ['-o', '-q', zip, '-d', out]); console.log(`CONTACT SHEET: ${out}/${NAME}-review.png (artifact of run ${run.id}, kept 2 days)`); }
    catch (e) { console.log(`CONTACT SHEET: could not download artifact ${art.id} from this session (${String(e.stderr || e.message).split('\n')[0].slice(0, 120)}); open it from ${run.html_url}`); } }
  else console.log('CONTACT SHEET: no "review" artifact on this run (kept 2 days)');
  process.exit(0);
}
console.log(`No recent Showreel run found for ${NAME}.`); process.exit(2);
