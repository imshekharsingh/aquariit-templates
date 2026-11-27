// App Tests list test (task 14, owner 27 Nov 2026): every test video under study/ gets a plain title, a "what it tests" line and its channel, taken
// from previews.json when it has an entry. Runs testsMerge() from templates/index.html without a browser. Run: node scripts/qa/app-tests-test.mjs
import { readFileSync } from 'node:fs';
const html = readFileSync(new URL('../../templates/index.html', import.meta.url), 'utf8');
const a = html.indexOf('// TESTS-START'), b = html.indexOf('// TESTS-END');
if (a < 0 || b < 0) { console.log('FAIL testsMerge() not found in templates/index.html'); process.exit(1); }
const testsMerge = new Function(html.slice(a, b) + '; return testsMerge;')();
let bad = 0; const ok = (n, c) => { if (!c) bad++; console.log(`${c ? 'PASS' : 'FAIL'} ${n}`); };
const items = [{ name: 'showreel-pv-tech-gold3d-v7', channel: 'tech', title: '3D kit sample v7, the last sample (23 s)', about: 'The 3D look rebuilt to the notes. More detail here.', src: '/reels/study/showreel-tech-gold3d-v7-r2-preview.mp4' },
  { name: 'showreel-pv-web-homebar2', channel: 'web', title: 'Web kit: the home bar reel again', about: 'Rebuilt on the hook kit' }];
const out = testsMerge([{ name: 'showreel-tech-gold3d-v7-r2-preview', video: '/v1', at: '2026-11-26T18:00:00Z' }, { name: 'showreel-pv-web-homebar2-preview', video: '/v2', at: '2026-11-24T10:00:00Z' },
  { name: 'showreel-tech-gold3d-v7-r3-preview', video: '/v3', at: '2026-11-27T12:00:00Z', cover: '/c3' }, { name: 'showreel-x-r1-preview', video: '/v4', at: '2026-11-20T10:00:00Z' }], items);
ok('a test with an entry: its title and first sentence', out[0].title === items[0].title && out[0].what === 'The 3D look rebuilt to the notes.' && out[0].channel === 'tech');
ok('an entry found by its default file name', out[1].title === items[1].title && out[1].what === 'Rebuilt on the hook kit.' && out[1].channel === 'web');
ok('a test with no entry: a plain title with its render number, the channel from the name, its cover', out[2].title === 'Gold3d v7, render 3' && out[2].channel === 'tech' && out[2].cover === '/c3');
ok('no codes in a plain line', out[3].what === 'A test render, never posted.' && out[3].title === 'X, render 1' && out[3].channel === null);
ok('every test keeps its player', out.every((x) => x.video));
ok('the list is called Tests and says it is never posted', /<summary>Tests <span id="slog-n">/.test(html) && /Never posted, not counted as reels/.test(html));
console.log(bad ? `APP TESTS TEST: ${bad} FAILED` : 'APP TESTS TEST: all passed'); process.exit(bad ? 1 : 0);
