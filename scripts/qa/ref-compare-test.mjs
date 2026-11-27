// Ref compare test (task 9): the measures on made-up frames (no video needed). Run: node scripts/qa/ref-compare-test.mjs
import { measure, gapLines } from '../ref-compare.mjs';
let bad = 0; const ok = (n, c) => { if (!c) bad++; console.log(`${c ? 'PASS' : 'FAIL'} ${n}`); };
const W = 90 * 160, mk = (v) => new Uint8Array(W).fill(v), rgbOf = (r, g, b) => { const a = new Uint8Array(W * 3); for (let k = 0; k < a.length; k += 3) { a[k] = r; a[k + 1] = g; a[k + 2] = b; } return a; };
// 10 s at 10 fps: a hard change every 1 s (ours) vs every 2.5 s (reference); the reference holds still for its first 2.4 s
const seq = (every) => Array.from({ length: 100 }, (_, i) => mk(Math.floor(i / (every * 10)) % 2 ? 200 : 30));
const ours = measure(seq(1), Array.from({ length: 10 }, (_, i) => (i < 5 ? rgbOf(230, 40, 40) : rgbOf(40, 40, 230))), [{ t: .5, n: 3, nums: '24' }, { t: 1.5, n: 5, nums: '11' }, { t: 2.5, n: 4, nums: '11' }]);
const ref = measure(seq(2.5), [rgbOf(230, 40, 40)], [{ t: .5, n: 2, nums: '' }, { t: 3, n: 2, nums: '' }]);
ok('ours: 9 changes in 10 s, one every second', Math.round(ours.changesPer10) === 9 && Math.abs(ours.every - 1) < .01);
ok('reference: 3 changes, one every 2.5 s', Math.round(ref.changesPer10) === 3 && Math.abs(ref.every - 2.5) < .01);
ok('longest still stretch', Math.abs(ref.stillS - 2.4) < .11 && ours.stillS < 1);
ok('colours counted by hue group', ours.colours === 2 && ref.colours === 1);
ok('words per beat and number moves', ours.wordsPerBeat > ref.wordsPerBeat && ours.numberMovesPer10 > 0 && ref.numberMovesPer10 === 0);
const g = gapLines(ours, ref);
ok('the gap in plain words', /^ours changes every 1 s, the reference every 2\.5 s \(ours is faster\)$/.test(g[0]) && g.some((l) => /words on screen per beat/.test(l)));
console.log(bad ? `REF COMPARE TEST: ${bad} FAILED` : 'REF COMPARE TEST: all passed'); process.exit(bad ? 1 : 0);
