// App Today test (task 12, owner 27 Nov 2026): runs two pieces of templates/index.html without a browser.
//   1. a channel tab shows only its own ready reels (the web tab once showed the tech reel);
//   2. a "Needs you" question about a reel or a preview finds that reel's cover, title and video (the app shows them beside the question, top of Today).
// Run: node scripts/qa/app-today-test.mjs
import { readFileSync } from 'node:fs';
const html = readFileSync(new URL('../../templates/index.html', import.meta.url), 'utf8');
const cut = (a, b) => { const i = html.indexOf(a), j = html.indexOf(b); if (i < 0 || j < 0) { console.log(`FAIL ${a} not found in templates/index.html`); process.exit(1); } return html.slice(i, j); };
let bad = 0; const ok = (n, c) => { if (!c) bad++; console.log(`${c ? 'PASS' : 'FAIL'} ${n}`); };
const CH = { web: { name: 'Web' }, tech: { name: 'Tech' }, c3: { name: 'Turns Out' } };
const { tabOnly } = new Function('CH', cut('// TAB-ONLY-START', '// TAB-ONLY-END') + '; return { chOf, tabOnly };')(CH);
const caps = { 'showreel-24-grid': { channel: 'web' }, 'showreel-tech-buds': { channel: 'tech' }, 'showreel-c3-door': { channel: 'c3' }, 'showreel-odd-name': { channel: 'tech' } };
const ready = Object.keys(caps).map((name) => ({ name })).concat([{ name: 'showreel-tech-nocaption' }, { name: 'showreel-30-plain' }]);
const names = (ch) => tabOnly(ready, caps, ch).map((x) => x.name).sort().join(',');
ok('web tab: only web reels', names('web') === 'showreel-24-grid,showreel-30-plain');
ok('tech tab: only tech reels (also by name when the caption has no channel)', names('tech') === 'showreel-odd-name,showreel-tech-buds,showreel-tech-nocaption');
ok('Turns Out tab: only its reels', names('c3') === 'showreel-c3-door');
ok('no reel shows on two tabs', ['web', 'tech', 'c3'].reduce((n, ch) => n + tabOnly(ready, caps, ch).length, 0) === ready.length);
const { askAbout } = new Function(cut('// ASK-ABOUT-START', '// ASK-ABOUT-END') + '; return { askAbout };')();
const shows = [{ name: 'showreel-tech-buds', cover: '/reels/showreel-tech-buds-cover.jpg?v=1', video: '/reels/showreel-tech-buds.mp4?v=1' }];
const r = askAbout({ reel: 'showreel-tech-buds' }, shows, { 'showreel-tech-buds': { concept: 'Why earbuds drop out' } }, []);
ok('ask about a reel: its cover, title and video', r && r.cover === shows[0].cover && r.video === shows[0].video && r.title === 'Why earbuds drop out' && r.kind === 'Reel');
const r2 = askAbout({ reel: 'showreel-tech-new' }, shows, {}, []);
ok('ask about a reel not uploaded yet: a title, no video', r2 && !r2.video && r2.title === 'tech new');
const r3 = askAbout({ preview: 'showreel-pv-tech-map' }, shows, {}, [{ name: 'showreel-pv-tech-map', title: 'Tech test: the node map' }]);
ok('ask about a preview: its title and its test video', r3 && r3.title === 'Tech test: the node map' && r3.video === '/reels/study/showreel-pv-tech-map-preview.mp4' && r3.kind === 'Test video');
ok('a plain ask has no reel row', askAbout({ question: 'x' }, shows, {}, []) === null);
const today = cut('<section class="pg" id="s-today"', '<section class="pg" id="s-reel"');
ok('Needs you sits at the top of Today, above the studio board', today.indexOf('id="needs"') > 0 && today.indexOf('id="needs"') < today.indexOf('id="board"'));
ok('the Today tab has its badge', /data-sec="today"[\s\S]{0,400}id="today-n"/.test(html));
console.log(bad ? `APP TODAY TEST: ${bad} FAILED` : 'APP TODAY TEST: all passed'); process.exit(bad ? 1 : 0);
