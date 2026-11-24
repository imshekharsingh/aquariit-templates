// References flow test (24 Nov 2026): runs src/worker.js against an in-memory SQLite (as D1) and a mock R2. Checks the 1 GB limit, the multipart
// upload (start, parts, complete), the report + checklist (Keep / Skip / Ask thread), and that Close deletes the video but keeps report, stills and checklist.
// Run: node scripts/qa/refs-test.mjs
let DatabaseSync;
try { ({ DatabaseSync } = await import('node:sqlite')); } catch { console.log('REFS TEST: skipped (this Node has no node:sqlite)'); process.exit(0); }
const { default: worker } = await import('../../src/worker.js');

const sql = new DatabaseSync(':memory:');
const stmt = (q) => { let args = []; const o = { bind(...a) { args = a; return o; },
  async run() { const r = sql.prepare(q).run(...args); return { meta: { last_row_id: Number(r.lastInsertRowid), changes: Number(r.changes) } }; },
  async first() { return sql.prepare(q).get(...args) || null; }, async all() { return { results: sql.prepare(q).all(...args) }; } }; return o; };
const DB = { exec: async (q) => { sql.exec(q); }, prepare: stmt, batch: async (l) => { for (const x of l) await x.run(); } };
const files = new Map(), ups = new Map();
const REELS = { async put(k, v) { files.set(k, v); }, async get(k) { return files.has(k) ? { body: 'x', size: 1, httpMetadata: {} } : null; }, async delete(k) { files.delete(k); },
  async list() { return { objects: [], truncated: false }; },
  async createMultipartUpload(k) { const id = 'up' + ups.size; ups.set(id, { k, parts: [] }); return { uploadId: id }; },
  resumeMultipartUpload(k, id) { const u = ups.get(id); return { async uploadPart(n) { u.parts.push(n); return { partNumber: n, etag: 'e' + n }; }, async complete() { files.set(u.k, 'bytes'); return { size: 150 * 1024 * 1024 }; }, async abort() { ups.delete(id); } }; } };
const env = { BASIC_AUTH_USER: 'u', BASIC_AUTH_PASS: 'p', DB, REELS, ASSETS: { fetch: async () => new Response('APP') } };
let cookie = '';
const lg = await worker.fetch(new Request('https://t/login', { method: 'POST', body: new URLSearchParams({ username: 'u', password: 'p' }) }), env, { waitUntil() {} });
cookie = (lg.headers.get('Set-Cookie') || '').split(';')[0];
const call = async (path, { method = 'GET', body, headers = {} } = {}) => { const r = await worker.fetch(new Request('https://t' + path, { method, headers: { Cookie: cookie, 'X-Requested-With': 'reel', ...(body && typeof body === 'object' && !(body instanceof Uint8Array) ? { 'Content-Type': 'application/json' } : {}), ...headers }, body: body instanceof Uint8Array ? body : body ? JSON.stringify(body) : undefined }), env, { waitUntil() {} }); let j = null; try { j = await r.clone().json(); } catch { /* not json */ } return { s: r.status, j }; };
let bad = 0; const ok = (name, c) => { if (!c) bad++; console.log(`${c ? 'PASS' : 'FAIL'} ${name}`); };

let r = await call('/api/refs/mp/start', { method: 'POST', body: { name: 'big.mp4', type: 'video/mp4', size: 2 * 1024 ** 3 } });
ok('a file over 1 GB is refused', r.s === 413 && r.j.max === 1024 ** 3);
r = await call('/api/refs/mp/start', { method: 'POST', body: { name: 'big.mp4', type: 'video/mp4', size: 900 * 1024 ** 2, channel: 'web', note: 'n' } });
ok('900 MB starts a multipart upload', r.s === 200 && r.j.id && r.j.partSize < 100 * 1024 * 1024);
const id = r.j.id;
let l = await call('/api/refs?state=new'); ok('an upload in progress is hidden from Claude\'s read', l.j.refs.length === 0);
r = await call(`/api/refs/${id}/part?n=1`, { method: 'POST', body: new Uint8Array(10), headers: { 'Content-Length': String(100 * 1024 * 1024) } });
ok('a part over 90 MB is refused', r.s === 413);
r = await call(`/api/refs/${id}/part?n=1`, { method: 'POST', body: new Uint8Array(10), headers: { 'Content-Length': '10' } }); ok('a part uploads and returns an etag', r.s === 200 && r.j.etag === 'e1');
r = await call(`/api/refs/${id}/complete`, { method: 'POST', body: { parts: [{ partNumber: 1, etag: 'e1' }] } }); ok('complete finishes the upload', r.s === 200);
l = await call('/api/refs?state=new'); ok('the finished upload is new and has its file', l.j.refs.length === 1 && l.j.refs[0].file && l.j.refs[0].file.size === 150 * 1024 * 1024);
const still = Buffer.from([0xff, 0xd8, 1, 2, 3]).toString('base64');
r = await call(`/api/refs/${id}/report`, { method: 'POST', body: { note: 'Report text', checklist: ['Slow camera push', 'Hard cut on the beat'], stills: [still] } }); ok('the report stores a checklist and a still', r.s === 200 && r.j.items === 2 && r.j.stills === 1);
r = await call(`/api/refs/${id}/check`, { method: 'POST', body: { item: 0, choice: 'keep' } }); ok('Keep is stored', r.s === 200 && r.j.item.c === 'keep');
r = await call(`/api/refs/${id}/thread`, { method: 'POST', body: { item: 1, text: 'Why this cut?' } }); ok('Ask opens a thread', r.s === 200 && r.j.item.c === 'ask' && r.j.item.th.length === 1);
r = await call(`/api/refs/${id}/thread`, { method: 'POST', body: { item: 1, text: 'Because the beat lands.', who: 'claude' } }); ok('Claude answers in the thread', r.j.item.th.length === 2 && r.j.item.th[1].w === 'claude');
r = await call(`/api/refs/${id}/report`, { method: 'POST', body: { note: 'Report 2', checklist: ['Another'] } }); l = await call('/api/refs');
ok('a second report never replaces the owner\'s checklist', l.j.refs[0].checklist.length === 2 && l.j.refs[0].checklist[0].c === 'keep');
r = await call(`/api/refs/${id}/close`, { method: 'POST', body: {} }); l = await call('/api/refs'); const x = l.j.refs[0];
ok('Close deletes the video from R2', r.j.videoDeleted && !files.has(`refs/${id}.mp4`));
ok('Close keeps the report, the stills and the checklist', x.reply === 'Report 2' && x.stills.length === 1 && x.checklist.length === 2 && x.closed && x.file.deleted);
l = await call('/api/refs?state=new'); ok('a closed reference is not offered to Claude again', l.j.refs.length === 0);
process.exit(bad ? 1 : 0);
