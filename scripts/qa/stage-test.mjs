// Stage key test (24 Nov 2026): POST /api/stage opens only with the header X-Stage-Key = STAGE_KEY. A wrong key, no key, or an unset or empty
// secret get 401 (Authorization: Bearer STAGE_KEY or REELS_READ_KEY also opens it since 26 Nov 2026) and never reach the database. Run: node scripts/qa/stage-test.mjs
import worker from '../../src/worker.js';
const KEY = 'test-only-stage-key-0123456789';   // a dummy for this local test
let touched = 0;
const DB = { exec: async () => { touched++; }, prepare: () => ({ bind() { return this; }, run: async () => ({}), all: async () => ({ results: [] }) }) };
const ASSETS = { async fetch() { return new Response('APP PAGE'); } };
const base = { BASIC_AUTH_USER: 'u', BASIC_AUTH_PASS: 'p', ASSETS, DB };
const call = (env, headers) => worker.fetch(new Request('https://app.test/api/stage', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify({ reel: 'web', stage: 'building' }) }), env, { waitUntil() {} });
let bad = 0;
async function expect(name, env, headers, want) { const r = await call(env, headers); const pass = r.status === want; if (!pass) bad++; console.log(`${pass ? 'PASS' : 'FAIL'} ${name}: ${r.status}`); }
await expect('right key stores', { ...base, STAGE_KEY: KEY }, { 'X-Stage-Key': KEY }, 200);
await expect('wrong key is refused', { ...base, STAGE_KEY: KEY }, { 'X-Stage-Key': 'nope' }, 401);
await expect('no key is refused', { ...base, STAGE_KEY: KEY }, {}, 401);
await expect('unset secret opens nothing', base, { 'X-Stage-Key': KEY }, 401);
await expect('empty secret opens nothing', { ...base, STAGE_KEY: '  ' }, { 'X-Stage-Key': '  ' }, 401);
await expect('Bearer STAGE_KEY stores', { ...base, STAGE_KEY: KEY }, { Authorization: `Bearer ${KEY}` }, 200);
await expect('Bearer REELS_READ_KEY stores', { ...base, STAGE_KEY: KEY, REELS_READ_KEY: 'read-key-9876543210' }, { Authorization: 'Bearer read-key-9876543210' }, 200);
await expect('wrong Bearer is refused', { ...base, STAGE_KEY: KEY, REELS_READ_KEY: 'read-key-9876543210' }, { Authorization: 'Bearer nope' }, 401);
await expect('Bearer with no secrets set opens nothing', base, { Authorization: `Bearer ${KEY}` }, 401);
const r = await worker.fetch(new Request('https://app.test/api/stage', { method: 'POST', headers: { 'X-Stage-Key': KEY }, body: '{"reel":"web","stage":"bogus"}' }), { ...base, STAGE_KEY: KEY }, { waitUntil() {} });
if (r.status !== 400) { bad++; console.log('FAIL bad stage name is 400: ' + r.status); } else console.log('PASS bad stage name is 400');
const g = await worker.fetch(new Request('https://app.test/api/stage', { headers: { 'X-Stage-Key': KEY } }), { ...base, STAGE_KEY: KEY }, { waitUntil() {} });
if (g.status === 200) { bad++; console.log('FAIL the stage key must not read the board'); } else console.log('PASS the stage key does not read the board: ' + g.status);
// projects (owner, 26 Nov 2026): POST accepts project:<id> with a project stage (not a reel stage); GET /api/projects merges the file with newer rows
const post = (body) => worker.fetch(new Request('https://app.test/api/stage', { method: 'POST', headers: { 'X-Stage-Key': KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }), { ...base, STAGE_KEY: KEY }, { waitUntil() {} });
for (const [name, body, want] of [['project stage stores', { reel: 'project:3d-kit-v6', stage: 'critic' }, 200], ['reel stage on a project is 400', { reel: 'project:3d-kit-v6', stage: 'video' }, 400], ['bad project id is 400', { reel: 'project:Bad Id!', stage: 'done' }, 400]]) {
  const r2 = await post(body); const pass = r2.status === want; if (!pass) bad++; console.log(`${pass ? 'PASS' : 'FAIL'} ${name}: ${r2.status}`); }
{ const { projectsApi } = await import('../../src/worker.js');
  const file = { projects: [{ id: 'kit', name: 'Kit', account: 'other', stage: 'render', line: 'from the file', updatedAt: '2026-11-26T07:00:00Z', history: [] },
    { id: 'old', name: 'Old', account: 'other', stage: 'done', line: 'done long ago', updatedAt: '2020-01-01T00:00:00Z', history: [] },
    { id: 'meter', name: 'Meter', account: 'other', stage: 'building', line: 'x', updatedAt: '2099-01-01T00:00:00Z', history: [],
      steps: [{ name: 'Find cause', state: 'done' }, { name: 'Fix', state: 'now' }, { name: 'Live', state: 'next' }, { name: 'Bad', state: 'weird' }],
      next: { who: 'github', action: 'Render 1 running', eta: 'about 25 min' } }] };
  const rows = [{ reel: 'project-kit', stage: 'critic', line: 'from a stage call', pct: 90, at: '2026-11-26T08:00:00Z' }, { reel: 'project-new', stage: 'building', line: 'only a row', pct: null, at: '2026-11-26T08:00:00Z' }];
  const env = { DB: { exec: async () => {}, prepare: () => ({ bind() { return this; }, all: async () => ({ results: rows }) }) } };
  const j = await (await projectsApi(new Request('https://app.test/api/projects'), env, async () => new Response(JSON.stringify(file)))).json();
  const kit = j.projects.find((x) => x.id === 'kit'), checks = [['the newer row wins', kit && kit.stage === 'critic' && kit.line === 'from a stage call' && kit.history.length === 1],
    ['a done project older than 2 days leaves the board', !j.projects.some((x) => x.id === 'old')], ['a row without a file entry shows', j.projects.some((x) => x.id === 'new' && x.account === 'main')],
    ['project steps pass through, an unknown state is dropped (task 7)', (() => { const m = j.projects.find((x) => x.id === 'meter'); return m && m.steps.length === 3 && m.steps[1].state === 'now'; })()],
    ['the next action passes through with who and when', (() => { const m = j.projects.find((x) => x.id === 'meter'); return m && m.next.who === 'github' && m.next.eta === 'about 25 min'; })()],
    ['a project with no steps has an empty list and no next', kit && Array.isArray(kit.steps) && kit.steps.length === 0 && kit.next === null]];
  for (const [n, pass] of checks) { if (!pass) bad++; console.log(`${pass ? 'PASS' : 'FAIL'} ${n}`); } }
process.exit(bad ? 1 : 0);
