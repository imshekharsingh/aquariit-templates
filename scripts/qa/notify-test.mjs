// Notification test (25 Nov 2026): the plan in src/notify.js (what is sent when) and the per-type switches in the Worker (GET/PUT /api/push/prefs).
// Run: node scripts/qa/notify-test.mjs
import { plan } from '../../src/notify.js';
let bad = 0; const ok = (name, c) => { if (!c) bad++; console.log(`${c ? 'PASS' : 'FAIL'} ${name}`); };
const at = (hhmm, day = '2026-11-25') => Date.parse(`${day}T${hhmm}:00+05:30`);
const reel = (o = {}) => ({ name: 'showreel-x', day: '2026-11-25', due: at('15:00'), ready: true, posted: false, ...o });
const types = (now, rs) => plan(now, rs).map((x) => x.type).join(',');
ok('at the slot: ready', types(at('15:00'), [reel()]) === 'ready');
ok('10 minutes after the slot: still ready (cron may be late)', types(at('15:10'), [reel()]) === 'ready');
ok('before the slot: nothing', types(at('14:50'), [reel()]) === '');
ok('45 minutes after: one nudge', types(at('15:45'), [reel()]) === 'nudge');
ok('two hours after: no second nudge', types(at('17:30'), [reel()]) === '');
ok('20:30: one last call, no nudge', types(at('20:30'), [reel({ due: at('19:00') })]) === 'last');
ok('20:30 last call even when the slot was 17:00', types(at('20:40'), [reel({ due: at('17:00') })]) === 'last');
ok('21:40: nothing more', types(at('21:40'), [reel({ due: at('19:00') })]) === '');
ok('posted reel: no ready, nudge or last', types(at('15:00'), [reel({ posted: true })]) === '' && types(at('20:30'), [reel({ posted: true })]) === '');
ok('a reel not cleared by the second look: no push', types(at('15:00'), [reel({ ready: false })]) === '');
ok("yesterday's reel: nothing", types(at('15:00'), [reel({ day: '2026-11-24' })]) === '');
ok('08:00: one morning summary', types(at('08:00'), []) === 'digest' && types(at('07:50'), []) === '' && types(at('09:10'), []) === '');
const keys = new Set(); for (const m of ['15:00', '15:10', '15:45', '16:00', '20:30', '20:40']) for (const x of plan(at(m), [reel({ due: at('15:00') })])) keys.add(x.key);
ok('a reel has one key per type, however often the cron runs', [...keys].filter((k) => k.startsWith('nudge')).length === 1 && [...keys].filter((k) => k.startsWith('last')).length === 1);

let DatabaseSync;
try { ({ DatabaseSync } = await import('node:sqlite')); } catch { console.log('NOTIFY TEST: switches skipped (no node:sqlite)'); process.exit(bad ? 1 : 0); }
const { default: worker } = await import('../../src/worker.js');
const sql = new DatabaseSync(':memory:');
const stmt = (q) => { let a = []; const o = { bind(...x) { a = x; return o; }, async run() { const r = sql.prepare(q).run(...a); return { meta: { changes: Number(r.changes) } }; },
  async first() { return sql.prepare(q).get(...a) || null; }, async all() { return { results: sql.prepare(q).all(...a) }; } }; return o; };
const DB = { exec: async (q) => { sql.exec(q); }, prepare: stmt, batch: async (l) => { for (const x of l) await x.run(); } };
const env = { BASIC_AUTH_USER: 'u', BASIC_AUTH_PASS: 'p', DB, ASSETS: { fetch: async () => new Response('{}') } };
const lg = await worker.fetch(new Request('https://t/login', { method: 'POST', body: new URLSearchParams({ username: 'u', password: 'p' }) }), env, { waitUntil() {} });
const cookie = (lg.headers.get('Set-Cookie') || '').split(';')[0];
const call = async (method, body) => { const r = await worker.fetch(new Request('https://t/api/push/prefs', { method, headers: { Cookie: cookie, 'X-Requested-With': 'reel', 'Content-Type': 'application/json' }, body: body && JSON.stringify(body) }), env, { waitUntil() {} }); return { s: r.status, j: await r.json() }; };
let r = await call('GET');
ok('every type is on by default', r.s === 200 && Object.values(r.j.prefs).length === 6 && Object.values(r.j.prefs).every(Boolean));
r = await call('PUT', { type: 'nudge', on: false });
ok('a switch turns one type off', r.s === 200 && r.j.prefs.nudge === false && r.j.prefs.ready === true);
r = await call('PUT', { type: 'nudge', on: true });
ok('and back on', r.j.prefs.nudge === true);
r = await call('PUT', { type: 'bogus', on: true });
ok('an unknown type is refused', r.s === 400);
console.log(bad ? `NOTIFY TEST: ${bad} FAILED` : 'NOTIFY TEST: all passed'); process.exit(bad ? 1 : 0);
