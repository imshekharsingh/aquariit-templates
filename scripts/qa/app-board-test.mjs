// App board test (task 13, owner 27 Nov 2026): the studio board puts the Fix button on the exact step that failed or stalled. Runs bProblem() from
// templates/index.html without a browser. Run: node scripts/qa/app-board-test.mjs
import { readFileSync } from 'node:fs';
const html = readFileSync(new URL('../../templates/index.html', import.meta.url), 'utf8');
const a = html.indexOf('// B-PROBLEM-START'), b = html.indexOf('// B-PROBLEM-END');
if (a < 0 || b < 0) { console.log('FAIL bProblem() not found in templates/index.html'); process.exit(1); }
const bProblem = new Function(html.slice(a, b) + '; return bProblem;')();
const BST = [['researching'], ['topic'], ['building'], ['stills'], ['video'], ['checking'], ['critic']];
const NOW = Date.parse('2026-11-27T12:00:00Z'), ago = (m) => new Date(NOW - m * 60000).toISOString();
let bad = 0; const ok = (n, c) => { if (!c) bad++; console.log(`${c ? 'PASS' : 'FAIL'} ${n}`); };
const P = (row, r) => bProblem(row, r, NOW, BST);
let p = P({ stage: 'failed', line: 'building: no access to the repo', at: ago(5) }, null);
ok('a failed build: Fix on the Building step, with its reason', p && p.idx === 2 && p.why === 'no access to the repo' && !p.stalled);
p = P({ stage: 'failed', line: 'stills: the stills sheet did not build', at: ago(5) }, null);
ok('a failed stills check: Fix on the Stills step', p && p.idx === 3);
p = P({ stage: 'building', line: 'Building', at: ago(150) }, null);
ok('a build step with no news for 2 h is stalled (today\'s Turns Out case)', p && p.idx === 2 && p.stalled && /2 h/.test(p.why));
ok('a build step updated 30 min ago is fine', P({ stage: 'building', at: ago(30) }, null) === null);
p = P(null, { stages: { render: { s: 'now', at: ago(75) } } });
ok('a video running 75 min is stalled at Making the video', p && p.idx === 4 && p.stalled && /75 min/.test(p.why));
ok('a video running 20 min is fine', P(null, { stages: { render: { s: 'now', at: ago(20) } } }) === null);
p = P(null, { stages: { render: { s: 'fail', why: 'a runner stopped' } } });
ok('a failed video: Fix on Making the video', p && p.idx === 4 && /a runner stopped/.test(p.why));
p = P(null, { stages: { render: { s: 'done' }, checks: { s: 'fail', t: 'Failed: COLOUR' } } });
ok('a failed check: Fix on Machine checks', p && p.idx === 5 && /COLOUR/.test(p.why));
p = P(null, { stages: { render: { s: 'done' }, checks: { s: 'done', at: ago(50) }, critic: { s: 'wait' } } });
ok('no second look 50 min after the checks is stalled', p && p.idx === 6 && p.stalled);
p = P(null, { stages: { render: { s: 'done' }, checks: { s: 'done', at: ago(10) }, critic: { s: 'fail', why: 'the hook is late' } } });
ok('a NOT READY verdict: Fix on Second look, with the reason', p && p.idx === 6 && /hook is late/.test(p.why));
p = P(null, { stages: { render: { s: 'done' }, checks: { s: 'done' }, critic: { s: 'done' }, ready: { s: 'done' }, posted: { s: 'fail' } } });
ok('the posting time passed: Fix on the post row', p && p.idx === BST.length);
ok('a ready reel has no problem', P(null, { stages: { render: { s: 'done' }, checks: { s: 'done' }, critic: { s: 'done' }, ready: { s: 'done' }, posted: { s: 'wait' } } }) === null);
ok('a posted reel with an old failed morning row has no Fix (27 Nov, all three channels)', P({ stage: 'failed', line: 'building: no access', at: ago(400) }, { stages: { render: { s: 'done', at: ago(200) }, ready: { s: 'done' }, posted: { s: 'done' } } }) === null);
ok('a ready reel with a stale building row has no Fix', P({ stage: 'building', at: ago(500) }, { stages: { render: { s: 'done', at: ago(100) }, checks: { s: 'done', at: ago(90) }, critic: { s: 'done' }, ready: { s: 'done' }, posted: { s: 'wait' } } }) === null);
ok('a redone reel ignores the old failed row and judges the new render', P({ stage: 'failed', line: 'building: no access', at: ago(300) }, { stages: { render: { s: 'now', at: ago(20) } } }) === null);
console.log(bad ? `APP BOARD TEST: ${bad} FAILED` : 'APP BOARD TEST: all passed'); process.exit(bad ? 1 : 0);
