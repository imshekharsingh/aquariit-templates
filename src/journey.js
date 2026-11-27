// The reel journey (owner, 15 Nov 2026: "make it cover the whole flow of reel making in the app"): GET /api/journey gives every scheduled reel
// of every channel with its seven stages in order, in plain words: planned (captions.json) -> built (PR merged) -> rendering (live, from the
// Showreel / Tech reel runs) -> checks (Output QA) -> critic (the review file) -> ready to post (the slot) -> posted (Instagram collect / Mark posted).
// GitHub data comes through the optional Worker secret GH_READ_TOKEN (read-only; never printed or returned) and is cached here for a minute,
// so phones never poll GitHub themselves. Without the token (or when GitHub fails) the stages fall back to R2, D1 and the public review files.
const REPO = 'imshekharsingh/aquariit-templates';
const API = 'https://api.github.com/repos/' + REPO;
const RAW = 'https://raw.githubusercontent.com/' + REPO + '/main/';
const IST_MS = 5.5 * 3600e3, DAY_MS = 864e5;
const GH_TTL = 60, DONE_TTL = 6 * 3600, REVIEW_TTL = 120;   // seconds: run lists, a finished run's jobs, the review files

// Output QA check names in plain words (scripts/qa/output-qa.py "OQA <CHECK>")
const QA_WORDS = { PACE: 'voice too fast or slow', STRAY: 'stray words at the end', LOUD: 'loudness', SOUND: 'sound effects', COLOUR: 'colour', GRADE: 'colour grade',
  BULK: 'white blobs on screen', VIBRANCY: 'too dull', SPREAD: 'layout squeezed', EDGES: 'content at the edge', GUESS: 'guess timing', SYNC: 'words not shown in time',
  LICENCE: 'media licence', CALM: 'screen too busy', HUE: 'colour too close to another reel', MUTE: 'unclear without sound', SPLIT: 'before / after not clear',
  DEMO: 'demo looks flat', NUMBERS: 'numbers differ from the voice', DEAD: 'dead stretch', SHEEN: 'glass sheen', HERO: 'main subject too small or still', FILL: 'picture too small' };
// workflow step names in plain words (.github/workflows/showreel.yml, techreel.yml)
const STEP_WORDS = [[/mandatory gate/i, 'gate check'], [/narration/i, 'voice'], [/voice model/i, 'voice'], [/capture/i, 'frames'], [/^render$/i, 'voice + frames'],
  [/join/i, 'joining'], [/sound/i, 'sound'], [/voice check/i, 'voice check'], [/real media/i, 'media'], [/keep|r2/i, 'saving'], [/contact sheet/i, 'contact sheet'],
  [/output qa/i, 'checks'], [/tools|setup|checkout|npm|set up|cache|post /i, 'setting up']];
const stepWord = (n) => { for (const [re, w] of STEP_WORDS) if (re.test(n || '')) return w; return String(n || '').toLowerCase().slice(0, 30); };

async function cached(key, ttl, make) {
  const c = typeof caches !== 'undefined' ? caches.default : null, url = 'https://journey.cache/' + key;
  if (c) { try { const hit = await c.match(url); if (hit) return await hit.json(); } catch { /* make it */ } }
  const data = await make();
  if (c && data != null) { try { await c.put(url, new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json', 'Cache-Control': `max-age=${ttl}` } })); } catch { /* no cache */ } }
  return data;
}
function gh(env) {
  const h = { Authorization: 'Bearer ' + env.GH_READ_TOKEN, Accept: 'application/vnd.github+json', 'User-Agent': 'studio-app', 'X-GitHub-Api-Version': '2022-11-28' };
  return async (path) => { const r = await fetch(API + path, { headers: h }); if (!r.ok) throw new Error('github ' + r.status); return r.json(); };
}
// which reel a run is for: the run-name ("Showreel · <config>", "Tech reel · <slug>", "Output QA · <config>"); previews say "(preview)"
function runReel(run, names) {
  const t = String(run.display_title || ''), m = /·\s*(\S+)/.exec(t);
  if (!m || /\(preview\)/.test(t)) return null;
  const arg = m[1], base = arg.split('/').pop().replace(/\.json$/, '');
  if (/^techreel\/topics\//.test(arg) || (!arg.includes('/') && /^Tech reel/.test(t))) return names.includes('showreel-tech-' + base) ? 'showreel-tech-' + base : null;
  return names.find((n) => n === base) || names.find((n) => n.endsWith('-' + base)) || null;
}
async function jobsOf(get, run) {
  const done = run.status === 'completed';
  return cached(`jobs-${run.id}-${run.run_attempt || 1}-${done ? 'done' : run.updated_at}`, done ? DONE_TTL : GH_TTL, async () => {
    const j = await get(`/actions/runs/${run.id}/jobs?per_page=30`);
    const jobs = (j.jobs || []).map((x) => ({ id: x.id, name: x.name, status: x.status, conclusion: x.conclusion, started_at: x.started_at,
      steps: (x.steps || []).map((s) => ({ name: s.name, status: s.status, conclusion: s.conclusion })) }));
    for (const x of jobs) {   // the reasons a failed job gives (Output QA writes one "::error title=Output QA::<CHECK>: ..." line per failing check)
      if (x.conclusion !== 'failure') continue;
      try { const a = await get(`/check-runs/${x.id}/annotations?per_page=20`);
        x.errors = (a || []).filter((e) => e.annotation_level === 'failure' && !/^Process completed with exit code/.test(e.message || '')).map((e) => String(e.message || '').slice(0, 300)).slice(0, 8);
      } catch { x.errors = []; }
    }
    return jobs;
  });
}
async function github(env, names, reels, warns) {
  const warn = (w, e) => { if (warns && warns.length < 12) warns.push(w + ': ' + String(e && e.message || e).slice(0, 70)); };
  if (!env.GH_READ_TOKEN) return { state: 'no-token' };
  const get = gh(env);
  try {
    const base = await cached('gh-lists-v1', GH_TTL, async () => {
      const [sr, tr, qa] = await Promise.all([get('/actions/workflows/showreel.yml/runs?per_page=25'), get('/actions/workflows/techreel.yml/runs?per_page=15'),
        get('/actions/workflows/output-qa.yml/runs?per_page=15')]);
      const slim = (r, kind) => ({ id: r.id, kind, display_title: r.display_title, status: r.status, conclusion: r.conclusion, run_attempt: r.run_attempt,
        started: r.run_started_at || r.created_at, updated_at: r.updated_at });
      return { runs: [...(sr.workflow_runs || []).map((r) => slim(r, 'render')), ...(tr.workflow_runs || []).map((r) => slim(r, 'render')), ...(qa.workflow_runs || []).map((r) => slim(r, 'qa'))] };
    });
    // the newest render run and the newest Output QA run per reel (run lists come newest first)
    const latest = {};
    for (const r of base.runs) { const n = runReel(r, names); if (!n) continue; const k = n + '|' + r.kind; if (!latest[k] || r.started > latest[k].started) latest[k] = r; }
    const runs = {};
    await Promise.all(Object.entries(latest).map(async ([k, r]) => { let jobs = []; try { jobs = await jobsOf(get, r); } catch (e) { warn('jobs ' + k, e); /* stage from the run alone */ } runs[k] = { ...r, jobs }; }));
    // built: the commit that first added the reel's review file (its squash message ends with the PR number), cached 30 minutes
    const built = {};
    await Promise.all(reels.map(async ([n, ch]) => { try { built[n] = await cached('built-' + n, 1800, async () => {
      const c = await get(`/commits?path=${encodeURIComponent(`review/${ch}/${n}.md`)}&per_page=100`), first = Array.isArray(c) && c.length ? c[c.length - 1] : null;
      if (!first) return { none: true };
      const pr = /\(#(\d+)\)\s*$/m.exec(String(first.commit.message).split('\n')[0]);
      return { pr: pr ? +pr[1] : null, at: first.commit.committer.date }; }); } catch (e) { warn('built ' + n, e); /* fall back */ } }));
    return { state: 'ok', runs, built };
  } catch (e) { warn('github lists', e); return { state: 'error', note: String(e.message || e).slice(0, 80) }; }
}
// the critic's reason: the first plain sentence (up to "Detail:" or the first ". " after 20 chars), ~220 chars, never cut at ")"; the full text (~1200 chars) is kept for "More"
export function criticOf(verdict, rest) {
  const full = String(rest || '').replace(/^[\s:,(.-]+/, '').trim(), d = full.search(/\bDetail:/i);
  let end = d >= 0 ? d : full.length;
  if (d < 0) { const m = /\.\s/g; let x; while ((x = m.exec(full))) { if (x.index >= 20) { end = x.index + 1; break; } } }
  let why = full.slice(0, end).trim();
  if (why.length > 220) why = why.slice(0, 219).replace(/\s+\S*$/, '') + '…';
  const ready = verdict.toUpperCase() === 'READY';
  return { ready, why, more: !ready && full.length > why.length ? full.slice(0, 1200) : '' };
}
// the review file: CRITIC: READY / NOT READY on the critic line (item 20), and item 13 (the render's Output QA line) as a fallback for checks
async function review(ch, name, warns) {
  return cached(`review-${name}`, REVIEW_TTL, async () => {
    try {
      const r = await fetch(RAW + `review/${ch}/${name}.md`, { cf: { cacheTtl: REVIEW_TTL, cacheEverything: true } });
      if (!r.ok) { if (warns && r.status !== 404 && warns.length < 12) warns.push('review ' + name + ': HTTP ' + r.status); return { exists: false }; }
      const t = await r.text(), out = { exists: true, critic: null, qa: null };
      for (const l of t.split('\n')) {
        const c = /^\s*(?:\d+\.\s*)?(?:Critic\b.*?\b)?CRITIC:\s*(NOT READY|READY)\b(.*)$/i.exec(l);   // any item number (27 Nov: a fix verdict as item 22 was missed, so a READY web reel showed as not ready); both "20. CRITIC: READY" and "Critic ... CRITIC: READY" (25 Nov: the first form was missed, so READY reels stayed on Checking)
        if (c) out.critic = criticOf(c[1], c[2]);
        const pm = /\bPREMIUM\s+(\d+(?:\.\d+)?(?:\s*\/\s*\d+(?:\.\d+)?)*)/i.exec(l);   // "PREMIUM 7.5 / 8 / 7.5": the critic's craft scores (0-10); the average goes on the weekly scorecard
        if (pm) { const v = pm[1].split('/').map(Number).filter((x) => x >= 0 && x <= 10); if (v.length) out.score = Math.round(v.reduce((a, b) => a + b, 0) / v.length * 10) / 10; }
        if (/^\s*13\.\s/.test(l)) { const p = l.lastIndexOf('OUTPUT QA: PASS'), f = Math.max(l.lastIndexOf('OUTPUT QA: FAIL'), l.search(/Output QA[^.]{0,40}fail/i));
          if (p >= 0 && p > f) out.qa = { pass: true }; else if (f >= 0) out.qa = { pass: false, why: l.slice(f).replace(/^OUTPUT QA: FAIL\s*/, '').slice(0, 140) }; }
      }
      return out;
    } catch (e) { if (warns && warns.length < 12) warns.push('review ' + name + ': ' + String(e && e.message || e).slice(0, 70)); return { exists: null }; }
  });
}
const hook = (c) => String(c || '').split('\n')[0].replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\uFE0F]/gu, '').trim();
const istTime = (iso) => new Date(Date.parse(iso) + IST_MS).toISOString().slice(11, 16);
const istDay = (iso) => new Date(Date.parse(iso) + IST_MS).toISOString().slice(0, 10);
const when = (iso) => istDay(iso) + ' ' + istTime(iso);
// a render run as a stage: live step and %, done, or failed with the step and its reasons
function renderStage(run, mp4At, rv) {
  if (!run) return mp4At ? { s: 'done', t: 'Video saved', at: mp4At } : rv && rv.qa ? { s: 'done', t: 'Rendered' } : { s: 'wait', t: 'Not started' };
  const jobs = run.jobs || [], at = run.started;
  if (run.status !== 'completed') {
    const job = jobs.find((j) => j.status === 'in_progress') || jobs.find((j) => j.status === 'queued');
    const step = job && (job.steps.find((s) => s.status === 'in_progress') || job.steps.find((s) => s.status === 'queued'));
    // progress: the Showreel's three jobs weigh voice 15%, frames 60%, render 25%; inside a job, by finished steps
    const W = { voice: [0, 15], render: [75, 25] }, frac = (j) => (j.steps.length ? j.steps.filter((s) => s.status === 'completed').length / j.steps.length : 0);
    let pct = null;
    if (job) { const w = W[job.name] || (/capture|frames|part/i.test(job.name) ? [15, 60] : jobs.length === 1 ? [0, 100] : null); if (w) pct = Math.round(w[0] + w[1] * frac(job)); }
    return { s: 'now', t: run.status === 'queued' || !job ? 'Waiting for a runner' : stepWord(step ? step.name : job.name), pct, at, live: true };
  }
  if (run.conclusion === 'success') return { s: 'done', t: 'Rendered', at: mp4At || run.updated_at };
  if (run.conclusion === 'cancelled') return { s: 'fail', t: 'Stopped', at, why: 'The run was cancelled.' };
  const bad = jobs.find((j) => j.conclusion === 'failure'), st = bad && bad.steps.find((s) => s.conclusion === 'failure');
  if (st && /output qa/i.test(st.name)) return { s: 'done', t: 'Rendered', at: mp4At || run.updated_at, qaFailed: bad.errors || [] };   // the video is fine; the checks failed
  return { s: 'fail', t: 'Failed: ' + (st ? stepWord(st.name) : 'render'), at, why: (bad && bad.errors && bad.errors[0]) || (st ? 'The "' + st.name + '" step failed.' : 'The run failed.') };
}
function qaReason(lines) {
  const l = (lines || []).find((x) => /^[A-Z]{3,10}: /.test(x)) || (lines || [])[0];
  if (!l) return { t: 'Failed', why: 'Output QA failed; the reason is in the run on GitHub.' };
  const m = /^([A-Z]{3,10}): (.*)$/.exec(l), more = (lines || []).filter((x) => /^[A-Z]{3,10}: /.test(x)).length - 1;
  return m ? { t: 'Failed: ' + (QA_WORDS[m[1]] || m[1].toLowerCase()) + (more > 0 ? ' (+' + more + ' more)' : ''), why: m[1] + ': ' + m[2].slice(0, 160) } : { t: 'Failed', why: l.slice(0, 160) };
}
function qaStage(render, qaRun, rv, rStage) {
  // the newest of: the Output QA step of the render run, or a separate Output QA run
  const fromRender = render && render.status === 'completed' && rStage.s === 'done' ? { at: render.updated_at, fail: rStage.qaFailed, ok: render.conclusion === 'success' } : null;
  let fromQa = null;
  if (qaRun) {
    if (qaRun.status !== 'completed') fromQa = { at: qaRun.started, live: true };
    else { const bad = (qaRun.jobs || []).find((j) => j.conclusion === 'failure'); fromQa = { at: qaRun.updated_at, ok: qaRun.conclusion === 'success', fail: bad ? bad.errors || [] : null }; }
  }
  const pick = fromQa && (!fromRender || fromQa.at > fromRender.at) ? fromQa : fromRender;
  if (pick && pick.live) return { s: 'now', t: 'Running the checks', at: pick.at, live: true };
  if (pick && pick.ok) return { s: 'done', t: 'Output QA PASS', at: pick.at };
  if (pick && pick.fail) return { s: 'fail', ...qaReason(pick.fail), at: pick.at };
  if (rStage.s === 'now') return { s: 'wait', t: 'After the render' };
  if (rv && rv.qa) return rv.qa.pass ? { s: 'done', t: 'Output QA PASS' } : { s: 'fail', t: 'Failed', why: rv.qa.why || 'See the review file.' };
  return { s: 'wait', t: rStage.s === 'done' ? 'No result yet' : 'After the render' };
}

export async function journeyApi(env, { captions, postSlot, chOf, uploaded, media }) {
  const now = Date.now(), today = istDay(new Date(now).toISOString());
  const from = istDay(new Date(now - 3 * DAY_MS).toISOString()), to = istDay(new Date(now + 3 * DAY_MS).toISOString());
  const reels = Object.entries(captions).filter(([, m]) => m && !m.hidden && !m.sample && /^\d{4}-\d{2}-\d{2}$/.test(m.postOn || '') && m.postOn >= from && m.postOn <= to);
  const names = Object.keys(captions);
  let r2 = {};
  if (env.REELS) {   // the MP4 (v/, deleted after 15 days) or its cover (c/, kept) shows the render finished
    try { for (const pre of ['c/', 'v/']) { let cursor; do { const l = await env.REELS.list({ prefix: pre, delimiter: '/', cursor, limit: 1000 });
      for (const o of l.objects) { const m = /^[cv]\/(showreel-[a-z0-9-]+?)(?:\.mp4|-cover\.jpg)$/.exec(o.key); if (m && !o.key.endsWith('-play.mp4')) r2[m[1]] = o.uploaded.toISOString(); }
      cursor = l.truncated ? l.cursor : undefined; } while (cursor); } } catch { /* stages from GitHub and the review files */ } }
  // the post text's first line names the reel; tech and Turns Out keep their caption in R2 (c/<name>.json)
  const capR2 = {};
  if (env.REELS) await Promise.all(reels.filter(([, m]) => !m.caption).map(async ([n]) => { try { const o = await env.REELS.get('c/' + n + '.json'); if (o) capR2[n] = (await o.json()).caption || ''; } catch { /* name instead */ } }));
  const warns = [];   // swallowed failures (GitHub errors, "Too many subrequests"): returned as warn so a stuck board says why
  const [g, reviews] = await Promise.all([github(env, names, reels.map(([n, m]) => [n, chOf(n, m)]), warns), Promise.all(reels.map(([n, m]) => review(chOf(n, m), n, warns)))]);
  const out = reels.map(([name, m], i) => {
    const ch = chOf(name, m), slot = postSlot(name, m), due = Date.parse(`${m.postOn}T${slot}:00+05:30`), rv = reviews[i] || {};
    const run = g.runs && g.runs[name + '|render'], qaRun = g.runs && g.runs[name + '|qa'];
    const short = name.replace(/^showreel-(tech-|c3-)?(\d+-)?/, '');
    const b = g.built && g.built[name];
    const st = {};
    st.planned = { s: 'done', t: 'In the plan, slot ' + slot + ' IST' };
    st.built = b && b.at ? { s: 'done', t: b.pr ? 'PR #' + b.pr + ' merged' : 'Merged', at: b.at } : rv.exists || r2[name] || run ? { s: 'done', t: 'On main' } : { s: 'wait', t: 'Not built yet' };
    st.render = renderStage(run, r2[name], rv);
    st.checks = qaStage(run, qaRun, rv, st.render);
    st.critic = rv.critic ? (rv.critic.ready ? { s: 'done', t: 'READY' } : { s: 'fail', t: 'Not ready', why: rv.critic.why || 'See the review file.', more: rv.critic.more || '' })
      : { s: 'wait', t: st.checks.s === 'done' ? 'Waiting for the critic' : 'After the checks' };
    const postedAt = uploaded[name] || (media[name] && media[name].posted_at) || null;
    const ok = st.render.s === 'done' && st.checks.s === 'done' && st.critic.s === 'done';
    st.ready = postedAt || ok ? { s: 'done', t: 'Post at ' + slot + (m.postOn === today ? ' today' : '') } : now > due ? { s: 'fail', t: 'Slot ' + slot + ' passed', why: 'Not every step above is green.' } : { s: 'wait', t: slot + ' slot' };
    st.posted = postedAt ? { s: 'done', t: 'Posted ' + istTime(postedAt), at: postedAt, link: (media[name] && media[name].permalink) || null }
      : now > due + 6 * 3600e3 ? { s: 'fail', t: 'Not marked posted', why: 'The ' + slot + ' slot passed. If it went out, tap Mark posted in Reels (the nightly collect also finds it).' }
      : ok && now > due ? { s: 'now', t: 'Due now' } : { s: 'wait', t: 'Not yet' };
    for (const k of Object.keys(st)) if (st[k].at) st[k].at = when(st[k].at);
    const cap = hook(m.caption || capR2[name]), con = / · /.test(m.concept || '') ? String(m.concept).split(' · ').pop().split(':')[0].trim() : '';
    const title = (cap || con || short.replace(/-/g, ' ')).slice(0, 90);
    return { name, ch, day: m.postOn, slot, title, score: rv.score == null ? null : rv.score, stages: st, live: !!(st.render.live || st.checks.live) };
  }).sort((a, b) => (a.day === b.day ? ['web', 'tech', 'c3'].indexOf(a.ch) - ['web', 'tech', 'c3'].indexOf(b.ch) : a.day < b.day ? 1 : -1));
  return { now: new Date(now).toISOString(), today, github: g.state, warn: warns, reels: out };
}
