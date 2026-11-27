// Notification test (25 Nov 2026; one policy, task 6, 27 Nov 2026): the plan in src/notify.js (what is sent when, from design/notify-policy.json),
// the slot-test plan (design/slots.json "tests"), today's plan in words, and the per-type switches in the Worker (GET/PUT /api/push/prefs).
// Run: node scripts/qa/notify-test.mjs
import { plan, planToday, testOf, fill, NOTIFY_TYPES } from '../../src/notify.js';
let bad = 0; const ok = (name, c) => { if (!c) bad++; console.log(`${c ? 'PASS' : 'FAIL'} ${name}`); };
const at = (hhmm, day = '2026-11-25') => Date.parse(`${day}T${hhmm}:00+05:30`);
const reel = (o = {}) => ({ name: 'showreel-x', ch: 'web', day: '2026-11-25', due: at('15:00'), ready: true, posted: false, ...o });
const types = (now, rs, tests) => plan(now, rs, tests).map((x) => x.type).join(',');
// regular plan
ok('2 minutes before the slot: ready', types(at('14:58'), [reel()]) === 'ready');
ok('10 minutes after the slot: still ready (the timer may be late)', types(at('15:10'), [reel()]) === 'ready');
ok('3 minutes before: nothing yet', types(at('14:57'), [reel()]) === '');
ok('15 minutes after: one nudge', types(at('15:15'), [reel()]) === 'nudge' && types(at('15:45'), [reel()]) === 'nudge');
ok('two hours after: no second nudge', types(at('17:30'), [reel()]) === '');
ok('20:30: one last call, no nudge', types(at('20:30'), [reel({ due: at('19:00') })]) === 'last');
ok('20:30 last call even when the slot was 17:00', types(at('20:40'), [reel({ due: at('17:00') })]) === 'last');
ok('21:40: nothing more', types(at('21:40'), [reel({ due: at('19:00') })]) === '');
ok('posted reel (no test): nothing', types(at('15:00'), [reel({ posted: true, postedAt: at('15:01') })]) === '' && types(at('20:30'), [reel({ posted: true })]) === '');
ok('a reel not cleared by the second look: no push', types(at('15:00'), [reel({ ready: false })]) === '');
ok("yesterday's reel: nothing", types(at('15:00'), [reel({ day: '2026-11-24' })]) === '');
ok('08:00: one morning summary', types(at('08:00'), []) === 'digest' && types(at('07:50'), []) === '' && types(at('09:10'), []) === '');
const keys = new Set(); for (const m of ['14:58', '15:00', '15:10', '15:16', '15:45', '16:00', '20:30', '20:40']) for (const x of plan(at(m), [reel({ due: at('15:00') })])) keys.add(x.key);
ok('a reel has one key per type, however often the timer runs', ['ready', 'nudge', 'last'].every((t) => [...keys].filter((k) => k.startsWith(t + ':')).length === 1));
// slot test plan
const tests = { web: { from: '2026-11-24', until: '2026-11-30', slot: '19:00' } };
const tr = (o = {}) => reel({ due: at('19:00'), ...o });
ok('test day number', JSON.stringify(testOf('web', '2026-11-25', tests)) === JSON.stringify({ n: 2, days: 7, slot: '19:00', until: '2026-11-30' }));
ok('outside the test days: no test', testOf('web', '2026-12-01', tests) === null && testOf('tech', '2026-11-25', tests) === null);
ok('test: ready 2 min before, says the test day', (() => { const x = plan(at('18:58'), [tr()], tests); return x.length === 1 && x[0].type === 'ready' && x[0].test.n === 2; })());
ok('test: nudge at 10 min', types(at('19:10'), [tr()], tests) === 'nudge' && types(at('19:09'), [tr()], tests) === 'ready');
ok('test: late at 30 min, once', types(at('19:30'), [tr()], tests) === 'late' && types(at('19:50'), [tr()], tests) === 'late' && types(at('20:31'), [tr()], tests) === 'last');
ok('test: logged once posted, on time within 30 min', (() => { const x = plan(at('19:20'), [tr({ posted: true, postedAt: at('19:05') })], tests); return x.length === 1 && x[0].type === 'logged' && x[0].onTime === true; })());
ok('test: posted 40 min late is logged as late', plan(at('19:42'), [tr({ posted: true, postedAt: at('19:40') })], tests)[0].onTime === false);
ok('test: the other channel keeps the regular plan', types(at('19:10'), [tr({ ch: 'c3' })], tests) === 'ready');
// words
ok('fill puts the values in', fill('Slot test day {n} of {days}: post {ch} at {slot}', { n: 2, days: 7, ch: 'Web', slot: '19:00' }) === 'Slot test day 2 of 7: post Web at 19:00');
const lines = planToday('2026-11-27', { c3: '14:00', web: '19:00', tech: '20:30' }, { c3: { from: '2026-11-26', until: '2026-12-02' }, web: { from: '2026-11-26', until: '2026-12-02' } });
ok('today in words: test channels', lines[0].startsWith('Turns Out: ready 13:58, nudge 14:10, late 14:30') && lines[0].includes('day 2 of 7') && lines[1].startsWith('Web: ready 18:58, nudge 19:10'));
ok('today in words: a nudge after the last call is not promised', lines[2].startsWith('Tech: ready 20:28, no nudge'));
ok('every type has a switch', ['ready', 'nudge', 'late', 'logged', 'last', 'posted', 'failed', 'digest'].every((t) => NOTIFY_TYPES.includes(t)));

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
const call = async (method, body, path = '/api/push/prefs') => { const r = await worker.fetch(new Request('https://t' + path, { method, headers: { Cookie: cookie, 'X-Requested-With': 'reel', 'Content-Type': 'application/json' }, body: body && JSON.stringify(body) }), env, { waitUntil() {} }); return { s: r.status, j: await r.json() }; };
let r = await call('GET');
ok('every type is on by default', r.s === 200 && Object.values(r.j.prefs).length === NOTIFY_TYPES.length && Object.values(r.j.prefs).every(Boolean));
r = await call('PUT', { type: 'nudge', on: false });
ok('a switch turns one type off', r.s === 200 && r.j.prefs.nudge === false && r.j.prefs.ready === true);
r = await call('PUT', { type: 'nudge', on: true });
ok('and back on', r.j.prefs.nudge === true);
r = await call('PUT', { type: 'bogus', on: true });
ok('an unknown type is refused', r.s === 400);
r = await call('GET', null, '/api/push/plan');
ok("today's plan in words is served", r.s === 200 && Array.isArray(r.j.lines) && r.j.lines.some((l) => l.startsWith('Last call')));
console.log(bad ? `NOTIFY TEST: ${bad} FAILED` : 'NOTIFY TEST: all passed'); process.exit(bad ? 1 : 0);
