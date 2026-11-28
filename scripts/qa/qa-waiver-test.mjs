// Output QA critic waivers in the app journey (28 Nov 2026): a failed run whose every failing check has a critic waiver in the review file is done.
// Run: node scripts/qa/qa-waiver-test.mjs
import { qaStage, waiversOf } from '../../src/journey.js';
let bad = 0; const ok = (n, c) => { if (!c) bad++; console.log(`${c ? 'PASS' : 'FAIL'} ${n}`); };
const rStage = { s: 'done' }, render = { status: 'completed', conclusion: 'failure', updated_at: '2026-11-28T06:00:00Z' };
const run = (fail) => ({ status: 'completed', conclusion: 'failure', updated_at: '2026-11-28T07:00:00Z', jobs: [{ conclusion: 'failure', errors: fail }] });
const W = waiversOf('x\nNUMBERS WAIVER (critic, 28 Nov 2026): not a number.\nHUE WAIVER (builder): mine.\n');
ok('waiversOf reads critic waivers only', W.length === 1 && W[0] === 'NUMBERS');
const rv = { waivers: W }, num = 'NUMBERS: counter at (608, 978) shows "6"', hue = 'HUE: too close';
ok('all failing checks waived = done', qaStage(render, run([num]), rv, rStage).s === 'done');
ok('the real annotation form "- NUMBERS: ..." is waived too', qaStage(render, run(['- ' + num]), rv, rStage).s === 'done');
ok('one unwaived failing check = fail', qaStage(render, run([num, hue]), rv, rStage).s === 'fail');
ok('a builder-written waiver is not a waiver', qaStage(render, run([hue]), { waivers: waiversOf('HUE WAIVER (builder): mine.') }, rStage).s === 'fail');
ok('no waivers = fail', qaStage(render, run([num]), { waivers: [] }, rStage).s === 'fail');
ok('no review = fail', qaStage(render, run([num]), null, rStage).s === 'fail');
ok('a passing run is still done', qaStage(render, { status: 'completed', conclusion: 'success', updated_at: '2026-11-28T07:00:00Z', jobs: [] }, rv, rStage).s === 'done');
console.log(bad ? `QA WAIVER TEST: ${bad} failed` : 'QA WAIVER TEST: all passed'); process.exit(bad ? 1 : 0);
