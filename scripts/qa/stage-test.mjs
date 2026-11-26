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
process.exit(bad ? 1 : 0);
