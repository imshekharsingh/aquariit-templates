// App references test (task 15, owner 27 Nov 2026): each reference shows a thumbnail or a 3 s loop, its state, the lesson in one line and the reels
// that used it (captions.json "refs": ["app:<id>"]); the Clean up view lists only the safe ones. Runs refView() from templates/index.html.
// Run: node scripts/qa/app-refs-test.mjs
import { readFileSync } from 'node:fs';
const html = readFileSync(new URL('../../templates/index.html', import.meta.url), 'utf8');
const a = html.indexOf('// REF-VIEW-START'), b = html.indexOf('// REF-VIEW-END');
if (a < 0 || b < 0) { console.log('FAIL refView() not found in templates/index.html'); process.exit(1); }
const refView = new Function(html.slice(a, b) + '; return refView;')();
let bad = 0; const ok = (n, c) => { if (!c) bad++; console.log(`${c ? 'PASS' : 'FAIL'} ${n}`); };
const NOW = Date.parse('2026-11-27T12:00:00Z'), ago = (d) => new Date(NOW - d * 864e5).toISOString();
const caps = { 'showreel-tech-buds': { refs: ['app:7', 'R-ref 26 Nov: 10'] }, 'showreel-31-grid': { refs: ['App: 7'] }, 'showreel-x': { refs: ['app:70'] } };
let v = refView({ id: 7, state: 'used', file: { type: 'video/mp4' }, reply: 'Took the 0.5 s card flips. Also the colour.', done_at: ago(3) }, caps, NOW);
ok('a clip: a 3 s loop of the clip', v.thumb && v.thumb.kind === 'loop' && /\/api\/refs\/7\/file$/.test(v.thumb.src));
ok('the reels that used it (and no other id)', v.reels.sort().join() === 'showreel-31-grid,showreel-tech-buds' && v.state === 'Used in 2 reels');
ok('the lesson in one line', v.lesson === 'Took the 0.5 s card flips.');
ok('used and studied 3 days ago: safe to remove', v.safe);
v = refView({ id: 8, state: 'studied', file: { type: 'image/png' }, done_at: ago(1) }, caps, NOW);
ok('an image: its own thumbnail; studied yesterday: not safe yet', v.thumb.kind === 'img' && !v.safe && v.state === 'Studied');
v = refView({ id: 9, state: 'studied', file: { type: 'video/mp4', deleted: true }, stills: ['/s1.jpg'], done_at: ago(5), checklist: [{ c: 'skip' }, { c: 'skip' }] }, caps, NOW);
ok('a closed clip: its first report still; every point skipped: safe', v.thumb.src === '/s1.jpg' && v.safe && v.why === 'every point skipped');
v = refView({ id: 10, state: 'new', url: 'https://x', created: ago(0) }, caps, NOW);
ok('a new link: says not studied, never safe', v.lesson === 'Not studied yet.' && !v.safe && v.state === 'New' && v.thumb === null);
ok('an upload in progress is never safe', !refView({ id: 11, state: 'used', uploading: true, done_at: ago(9) }, caps, NOW).safe);
ok('the Clean up view is on the page', /id="ref-clean"/.test(html));
console.log(bad ? `APP REFS TEST: ${bad} FAILED` : 'APP REFS TEST: all passed'); process.exit(bad ? 1 : 0);
