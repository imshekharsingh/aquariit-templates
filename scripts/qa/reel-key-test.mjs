// Read-only reel key test (owner chat job, 23 Nov 2026): runs src/worker.js locally against mock bindings.
// A request with Authorization: Bearer <REELS_READ_KEY> may GET/HEAD /reels/<file>, and nothing else: the API, the app page and any
// POST stay 401 (or the sign-in redirect); a wrong key, or an unset or empty secret, opens nothing. Run: node scripts/qa/reel-key-test.mjs
import worker from '../../src/worker.js';

const KEY = 'test-only-key-0123456789';   // a dummy for this local test; the real key exists only as secrets
const obj = { size: 4, uploaded: new Date(0), httpEtag: '"e"', body: 'MP4!' };
const REELS = { async get(k) { return k === 'v/showreel-45-homebar.mp4' || k === 'c/showreel-45-homebar-cover.jpg' ? { ...obj } : null; },
  async head(k) { return this.get(k); }, async list() { return { objects: [], truncated: false }; } };
const ASSETS = { async fetch() { return new Response('APP PAGE', { status: 200 }); } };
const base = { BASIC_AUTH_USER: 'u', BASIC_AUTH_PASS: 'p', REELS, ASSETS };
const ctx = { waitUntil() {} };
const call = (env, path, { method = 'GET', key = KEY, accept = '' } = {}) => worker.fetch(new Request('https://app.test' + path, {
  method, headers: { ...(key == null ? {} : { Authorization: `Bearer ${key}` }), ...(accept ? { Accept: accept } : {}) } }), env, ctx);

let bad = 0;
async function expect(name, env, path, opts, ok) {
  const r = await call(env, path, opts), body = opts && opts.method === 'HEAD' ? '' : await r.text();
  const pass = ok(r.status, body);
  if (!pass) bad++;
  console.log(`${pass ? 'PASS' : 'FAIL'} ${name}: ${r.status}`);
}
const on = { ...base, REELS_READ_KEY: KEY };
const opens = (s, b) => s === 200 && b === 'MP4!';
const shut = (s, b) => (s === 401 || s === 403 || (s >= 300 && s < 400)) && !b.includes('APP PAGE') && !b.includes('MP4!');

await expect('key GETs the reel MP4', on, '/reels/showreel-45-homebar.mp4', {}, opens);
await expect('key HEADs the reel MP4', on, '/reels/showreel-45-homebar.mp4', { method: 'HEAD' }, (s) => s === 200);
await expect('key GETs the cover', on, '/reels/showreel-45-homebar-cover.jpg', {}, opens);
await expect('key on a missing reel is 404, not the app', on, '/reels/showreel-nope.mp4', {}, (s, b) => s === 404 && !b.includes('APP PAGE'));
await expect('key on /api/showreels', on, '/api/showreels', {}, shut);
await expect('key on /api/asks', on, '/api/asks', {}, shut);
await expect('key on /api/perf/token', on, '/api/perf/token', {}, shut);
await expect('key on the app page', on, '/', { accept: 'text/html' }, shut);
await expect('key on /index.html', on, '/index.html', {}, shut);
await expect('key POST to a reel path', on, '/reels/showreel-45-homebar.mp4', { method: 'POST' }, shut);
await expect('key POST to /api/feedback', on, '/api/feedback', { method: 'POST' }, shut);
await expect('key PUT to /api/asks/1', on, '/api/asks/1', { method: 'PUT' }, shut);
await expect('wrong key on the reel', on, '/reels/showreel-45-homebar.mp4', { key: KEY + 'x' }, shut);
await expect('no key on the reel', on, '/reels/showreel-45-homebar.mp4', { key: null }, shut);
await expect('secret unset: key opens nothing', base, '/reels/showreel-45-homebar.mp4', {}, shut);
await expect('secret empty: empty bearer opens nothing', { ...base, REELS_READ_KEY: '' }, '/reels/showreel-45-homebar.mp4', { key: '' }, shut);
await expect('secret empty: key opens nothing', { ...base, REELS_READ_KEY: '' }, '/reels/showreel-45-homebar.mp4', {}, shut);
console.log(bad ? `READ KEY TEST: ${bad} FAIL` : 'READ KEY TEST: PASS');
process.exit(bad ? 1 : 0);
