// Post now test (24 Nov 2026): nothing is posted for real. Part 1 runs src/worker.js (POST /api/post, the lock, signed links, status, "Posted" marking)
// on an in-memory SQLite with a mock R2 and a mock GitHub. Part 2 runs scripts/ig-publish.mjs against a mock site and a mock Instagram API.
// Run: node scripts/qa/post-now-test.mjs
import http from 'node:http';
import { spawn } from 'node:child_process';
let DatabaseSync;
try { ({ DatabaseSync } = await import('node:sqlite')); } catch { console.log('POST NOW TEST: skipped (this Node has no node:sqlite)'); process.exit(0); }
const { default: worker } = await import('../../src/worker.js');
let bad = 0; const ok = (name, c) => { if (!c) bad++; console.log(`${c ? 'PASS' : 'FAIL'} ${name}`); };

// ---------- part 1: the Worker ----------
const sql = new DatabaseSync(':memory:');
const stmt = (q) => { let a = []; const o = { bind(...x) { a = x; return o; }, async run() { const r = sql.prepare(q).run(...a); return { meta: { changes: Number(r.changes) } }; },
  async first() { return sql.prepare(q).get(...a) || null; }, async all() { return { results: sql.prepare(q).all(...a) }; } }; return o; };
const DB = { exec: async (q) => { sql.exec(q); }, prepare: stmt, batch: async (l) => { for (const x of l) await x.run(); } };
sql.exec('CREATE TABLE IF NOT EXISTS reel_uploaded (id TEXT PRIMARY KEY, at TEXT NOT NULL)');
const CAPS = { 'showreel-1-demo': { caption: 'x' }, 'showreel-tech-2-demo': { channel: 'tech' }, 'showreel-hid': { hidden: true } };
const R2 = new Set(['v/showreel-1-demo.mp4', 'c/showreel-1-demo-cover.jpg', 'v/showreel-tech-2-demo.mp4', 'v/showreel-hid.mp4']);
const REELS = { async head(k) { return R2.has(k) ? { size: 3 } : null; },
  async get(k, o) { return R2.has(k) ? { body: 'VIDEO', size: 5, httpEtag: '"e"', uploaded: new Date(), range: undefined } : null; }, async list() { return { objects: [], truncated: false }; } };
const ASSETS = { fetch: async (r) => (/captions\.json$/.test(new URL(r.url).pathname) ? new Response(JSON.stringify(CAPS)) : new Response('APP')) };
const env = { BASIC_AUTH_USER: 'u', BASIC_AUTH_PASS: 'p', DB, REELS, ASSETS, GH_DISPATCH_TOKEN: 'dummy-dispatch-token' };
const lg = await worker.fetch(new Request('https://t/login', { method: 'POST', body: new URLSearchParams({ username: 'u', password: 'p' }) }), env, { waitUntil() {} });
const cookie = (lg.headers.get('Set-Cookie') || '').split(';')[0];
const call = async (path, { method = 'GET', body, e = env, hdr = {} } = {}) => { const r = await worker.fetch(new Request('https://t' + path, { method, headers: { Cookie: cookie, 'X-Requested-With': 'reel', ...hdr }, body: body ? JSON.stringify(body) : undefined }), e, { waitUntil() {} });
  const t = await r.text(); let j = {}; try { j = JSON.parse(t); } catch { /* not json */ } return { s: r.status, j, r, t }; };
const gh = []; const realFetch = globalThis.fetch; let ghStatus = 204;
globalThis.fetch = async (u, init) => { if (String(u).startsWith('https://api.github.com/')) { gh.push({ u: String(u), init }); return new Response(null, { status: ghStatus }); } return realFetch(u, init); };

let r = await call('/api/post', { method: 'POST', body: { reel: 'showreel-1-demo' }, e: { ...env, GH_DISPATCH_TOKEN: '' } });
ok('no GH_DISPATCH_TOKEN: a plain "not switched on" message and nothing started', r.s === 503 && /not switched on/.test(r.j.message) && gh.length === 0);
r = await call('/api/post', { method: 'POST', body: { reel: 'showreel-hid' } }); ok('a hidden reel is refused', r.s === 404);
r = await call('/api/post', { method: 'POST', body: { reel: 'showreel-nope' } }); ok('an unknown reel is refused', r.s === 404);
r = await call('/api/post', { method: 'POST', body: { reel: '../x' } }); ok('a bad name is refused', r.s === 400);
r = await call('/api/post', { method: 'POST', body: { reel: 'showreel-1-demo' }, hdr: { 'X-Requested-With': '' } }); ok('a cross-site style call is refused', r.s === 403);
r = await worker.fetch(new Request('https://t/api/post', { method: 'POST', body: '{"reel":"showreel-1-demo"}' }), env, { waitUntil() {} }); ok('signed out is refused', r.status === 401);

r = await call('/api/post', { method: 'POST', body: { reel: 'showreel-1-demo' } });
const sent = gh[0] && JSON.parse(gh[0].init.body);
ok('Post now dispatches ig-publish.yml with the reel and its channel only', r.s === 200 && r.j.row.state === 'queued' && /\/workflows\/ig-publish\.yml\/dispatches$/.test(gh[0].u) && sent.ref === 'main' && sent.inputs.reel === 'showreel-1-demo' && sent.inputs.channel === 'web' && Object.keys(sent.inputs).length === 2);
ok('the dispatch uses the token as a Bearer header', gh[0].init.headers.Authorization === 'Bearer dummy-dispatch-token');
r = await call('/api/post', { method: 'POST', body: { reel: 'showreel-1-demo' } }); ok('a second tap while it runs is refused (lock)', r.s === 409 && gh.length === 1);
r = await call('/api/post/sign', { method: 'POST', body: { reel: 'showreel-1-demo' } });
const link = r.j.video; ok('sign gives a 1-hour link to the MP4 and one to the cover', r.s === 200 && /\/pub\/\d+\/[\w-]+\/showreel-1-demo\.mp4$/.test(link) && /showreel-1-demo-cover\.jpg$/.test(r.j.cover) && Math.abs(r.j.exp - (Date.now() / 1000 + 3600)) < 30);
const pub = async (u) => worker.fetch(new Request(u), { ...env }, { waitUntil() {} });
let p = await pub(link); ok('the signed link opens the MP4 without a sign-in', p.status === 200 && p.headers.get('Content-Type') === 'video/mp4');
const parts = link.split('/'); const swap = (f) => parts.slice(0, 5).join('/') + '/' + f;
p = await pub(swap('showreel-tech-2-demo.mp4')); ok('the same link does not open another reel', p.status === 404);
p = await pub(link.replace(/\/pub\/(\d+)\//, (m, e) => `/pub/${+e + 1}/`)); ok('a changed expiry is refused', p.status === 404);
p = await pub(link.replace(/\/pub\/\d+\//, '/pub/1700000000/')); ok('an expired link is refused', p.status === 404);
p = await worker.fetch(new Request(link, { method: 'POST' }), env, { waitUntil() {} }); ok('POST to a signed link is refused', p.status === 404);
p = await pub(link.replace('.mp4', '.json')); ok('a signed link is only for mp4 and jpg', p.status === 404);
r = await call('/api/post/status', { method: 'POST', body: { reel: 'showreel-1-demo', state: 'processing' } }); ok('status: processing', r.s === 200);
r = await call('/api/post/showreel-1-demo'); ok('the app reads the stage', r.j.row.state === 'processing' && r.j.row.line === 'Processing');
r = await call('/api/post/status', { method: 'POST', body: { reel: 'showreel-1-demo', state: 'bogus' } }); ok('an unknown stage is refused', r.s === 400);
r = await call('/api/post/status', { method: 'POST', body: { reel: 'showreel-1-demo', state: 'failed', error: 'Instagram said no.' } }); ok('status: failed with a reason', r.s === 200);
r = await call('/api/post/sign', { method: 'POST', body: { reel: 'showreel-1-demo' } }); ok('no links once the run has ended', r.s === 409);
ghStatus = 401; r = await call('/api/post', { method: 'POST', body: { reel: 'showreel-1-demo' } });
ok('a failed reel can be tried again; a refused GitHub key is said in plain words and unlocks it', r.s === 502 && /GH_DISPATCH_TOKEN/.test(r.j.message) && r.j.row.state === 'failed');
ghStatus = 204; r = await call('/api/post', { method: 'POST', body: { reel: 'showreel-1-demo' } }); ok('Try again starts a new run', r.s === 200 && gh.length === 3);
r = await call('/api/post/status', { method: 'POST', body: { reel: 'showreel-1-demo', state: 'posted', media_id: '123', permalink: 'https://www.instagram.com/reel/abc/' } }); ok('status: posted', r.s === 200);
r = await call('/api/uploaded'); ok('Posted also marks the reel like "I posted it"', !!r.j.ids['showreel-1-demo']);
r = await call('/api/post', { method: 'POST', body: { reel: 'showreel-1-demo' } }); ok('a posted reel is refused and nothing is dispatched', r.s === 409 && gh.length === 3);
r = await call('/api/post/showreel-1-demo'); ok('the post link is kept', r.j.row.permalink === 'https://www.instagram.com/reel/abc/');
sql.prepare('INSERT INTO reel_uploaded (id, at) VALUES (?, ?)').run('showreel-tech-2-demo', new Date().toISOString());
r = await call('/api/post', { method: 'POST', body: { reel: 'showreel-tech-2-demo' } }); ok('a reel already marked posted by hand is refused', r.s === 409 && gh.length === 3);
sql.prepare('DELETE FROM reel_uploaded WHERE id = ?').run('showreel-tech-2-demo');
sql.prepare('DELETE FROM reel_uploaded WHERE id = ?').run('showreel-tech-2-demo');
r = await call('/api/post', { method: 'POST', body: { reel: 'showreel-tech-2-demo' } }); ok('a tech reel dispatches with channel tech', r.s === 200 && JSON.parse(gh.at(-1).init.body).inputs.channel === 'tech');
const n = gh.length; r = await call('/api/post', { method: 'POST', body: { reel: 'showreel-tech-2-demo' } }); ok('still locked while it runs', r.s === 409 && gh.length === n);
sql.prepare("UPDATE ig_publish SET at=? WHERE reel='showreel-tech-2-demo'").run(new Date(Date.now() - 40 * 60e3).toISOString());
r = await call('/api/post', { method: 'POST', body: { reel: 'showreel-tech-2-demo' } }); ok('a run silent for 30 minutes counts as dead and can be started again', r.s === 200 && gh.length === n + 1);
globalThis.fetch = realFetch;

// ---------- part 2: the script against mock Instagram + mock site ----------
const serve = (h) => new Promise((res) => { const s = http.createServer(h); s.listen(0, '127.0.0.1', () => res(s)); });
const read = (q) => new Promise((res) => { let b = ''; q.on('data', (d) => (b += d)); q.on('end', () => res(b)); });
async function scenario(name, { channel = 'web', secrets = {}, ig: igBehaviour = {}, existing = [], expect }) {
  const log = { calls: [], status: [], created: null };
  const igSrv = await serve(async (q, s) => {
    const u = new URL(q.url, 'http://x'), body = new URLSearchParams(await read(q)), tok = u.searchParams.get('access_token') || body.get('access_token');
    log.calls.push({ m: q.method, p: u.pathname, tok }); const send = (o, c = 200) => { s.writeHead(c, { 'Content-Type': 'application/json' }); s.end(JSON.stringify(o)); };
    if (u.pathname === '/me' && !igBehaviour.badToken) return send({ user_id: '1', username: 'acct' });
    if (u.pathname === '/me') return send({ error: { message: 'Invalid OAuth access token', code: 190 } }, 400);
    if (u.pathname === '/me/media' && q.method === 'GET') return send({ data: existing });
    if (u.pathname === '/me/media' && q.method === 'POST') { log.created = Object.fromEntries(body); if (igBehaviour.noPermission) return send({ error: { message: '(#10) Application does not have permission for this action', code: 10 } }, 403); return send({ id: 'C1' }); }
    if (u.pathname === '/C1') { log.polls = (log.polls || 0) + 1; return send({ status_code: igBehaviour.processError ? 'ERROR' : log.polls < 2 ? 'IN_PROGRESS' : 'FINISHED', status: igBehaviour.processError ? 'Video is too long' : '' }); }
    if (u.pathname === '/me/media_publish') { log.published = (log.published || 0) + 1; return send({ id: 'M1' }); }
    if (u.pathname === '/M1') return send({ permalink: 'https://www.instagram.com/reel/M1/' });
    send({ error: { message: 'nope' } }, 404); });
  const siteSrv = await serve(async (q, s) => {
    const u = new URL(q.url, 'http://x'), body = await read(q);
    if (u.pathname === '/login') { s.writeHead(303, { 'Set-Cookie': 'aq_session=abc; Path=/' }); return s.end(); }
    if (q.headers.cookie !== 'aq_session=abc') { s.writeHead(401); return s.end(); }
    const send = (o) => { s.writeHead(200, { 'Content-Type': 'application/json' }); s.end(JSON.stringify(o)); };
    if (u.pathname === '/api/perf/token') { s.writeHead(404); return s.end(); }
    if (u.pathname === '/reels/showreel-1-demo.json') return send({ caption: 'Fix this?\nBody line.', keywords: ['a', 'b', 'c', 'd', 'e', 'f', 'g'], hashtags: ['#1', '#2', '#3', '#4', '#5', '#6'] });
    if (u.pathname === '/showreels/captions.json') return send({ 'showreel-1-demo': {} });
    if (u.pathname === '/api/post/sign') return send({ video: 'https://signed.test/v.mp4', cover: 'https://signed.test/c.jpg', exp: 1 });
    if (u.pathname === '/api/post/status') { log.status.push(JSON.parse(body)); return send({ ok: true }); }
    s.writeHead(404); s.end(); });
  const env2 = { PATH: process.env.PATH, REEL: 'showreel-1-demo', CHANNEL: channel, BASIC_AUTH_USER: 'u', BASIC_AUTH_PASS: 'p', ...secrets,
    SITE_BASE: `http://127.0.0.1:${siteSrv.address().port}`, IG_API_BASE: `http://127.0.0.1:${igSrv.address().port}`, POLL_MS: '20', POLL_MAX_MS: '3000' };
  const out = await new Promise((res) => { const c = spawn(process.execPath, ['scripts/ig-publish.mjs'], { env: env2 }); let t = ''; c.stdout.on('data', (d) => (t += d)); c.stderr.on('data', (d) => (t += d)); c.on('close', (code) => res({ code, t })); });
  igSrv.close(); siteSrv.close();
  expect(log, out);
}
const caption = 'Fix this?\nBody line.\n\na · b · c · d · e · f\n\n#1 #2 #3 #4 #5';
await scenario('happy', { secrets: { INSTAGRAM_TOKEN: 'TOK-WEB', INSTAGRAM_TOKEN_2: 'TOK-TECH' }, expect(l, o) {
  ok('script: success exit', o.code === 0);
  ok('script: stages reported in order', l.status.map((x) => x.state).join() === 'uploading,processing,publishing,posted');
  ok('script: container is REELS with video, cover, share_to_feed and the app\'s exact post text', l.created && l.created.media_type === 'REELS' && l.created.video_url === 'https://signed.test/v.mp4' && l.created.cover_url === 'https://signed.test/c.jpg' && l.created.share_to_feed === 'true' && l.created.caption === caption);
  ok('script: polls until FINISHED, publishes once', l.polls >= 2 && l.published === 1);
  ok('script: reports the post id and permalink', l.status.at(-1).media_id === 'M1' && l.status.at(-1).permalink === 'https://www.instagram.com/reel/M1/');
  ok('script: web uses INSTAGRAM_TOKEN only', l.calls.every((c) => c.tok === 'TOK-WEB'));
  ok('script: the token is never printed', !/TOK-/.test(o.t)); } });
await scenario('tech', { channel: 'tech', secrets: { INSTAGRAM_TOKEN: 'TOK-WEB', INSTAGRAM_TOKEN_2: 'TOK-TECH', INSTAGRAM_TOKEN_3: 'TOK-C3' }, expect(l) { ok('script: tech uses INSTAGRAM_TOKEN_2 only', l.calls.length > 0 && l.calls.every((c) => c.tok === 'TOK-TECH')); } });
await scenario('c3', { channel: 'c3', secrets: { INSTAGRAM_TOKEN: 'TOK-WEB', INSTAGRAM_TOKEN_3: 'TOK-C3' }, expect(l) { ok('script: Turns Out uses INSTAGRAM_TOKEN_3 only', l.calls.length > 0 && l.calls.every((c) => c.tok === 'TOK-C3')); } });
await scenario('permission', { secrets: { INSTAGRAM_TOKEN: 'TOK-WEB' }, ig: { noPermission: true }, expect(l, o) {
  const f = l.status.at(-1); ok('script: missing permission gives the plain message', o.code === 1 && f.state === 'failed' && f.error === "The Instagram token for @webin20sec can't post yet: add the content publish permission and paste a new token." && !l.published); } });
await scenario('bad token', { secrets: { INSTAGRAM_TOKEN: 'TOK-WEB' }, ig: { badToken: true }, expect(l, o) { ok('script: a rejected token says which secret to replace', l.status.at(-1).state === 'failed' && /INSTAGRAM_TOKEN\b/.test(l.status.at(-1).error) && !l.created); } });
await scenario('no token', { secrets: {}, expect(l, o) { ok('script: a missing secret is said in plain words', l.status.at(-1).state === 'failed' && /add the GitHub secret INSTAGRAM_TOKEN/.test(l.status.at(-1).error)); } });
await scenario('processing error', { secrets: { INSTAGRAM_TOKEN: 'TOK-WEB' }, ig: { processError: true }, expect(l, o) { ok('script: a video Instagram rejects fails and does not publish', l.status.at(-1).state === 'failed' && /could not process/.test(l.status.at(-1).error) && !l.published); } });
await scenario('already there', { secrets: { INSTAGRAM_TOKEN: 'TOK-WEB' }, existing: [{ id: 'OLD', caption: 'Fix this?\nBody', permalink: 'https://www.instagram.com/reel/OLD/', timestamp: new Date().toISOString() }], expect(l, o) {
  ok('script: a post already on the account is marked, never posted twice', o.code === 0 && !l.created && !l.published && l.status.at(-1).state === 'posted' && l.status.at(-1).media_id === 'OLD'); } });

console.log(bad ? `POST NOW TEST: ${bad} FAILED` : 'POST NOW TEST: all passed'); process.exit(bad ? 1 : 0);
