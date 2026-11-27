// App tabs test (task 20, owner 27 Nov 2026): the channel tabs are in posting order, and the selected tab follows the workflow the owner came
// from (a board button, a reel link or reminder, a tab tap, All reels = the channel due next); nothing else switches it. Runs chanOrder() from
// templates/index.html and checks every place the page sets the channel. Run: node scripts/qa/app-tabs-test.mjs
import { readFileSync } from 'node:fs';
const html = readFileSync(new URL('../../templates/index.html', import.meta.url), 'utf8');
const a = html.indexOf('// TAB-ORDER-START'), b = html.indexOf('// TAB-ORDER-END');
if (a < 0 || b < 0) { console.log('FAIL chanOrder() not found in templates/index.html'); process.exit(1); }
const CH = { web: {}, tech: {}, c3: {} };
const chanOrder = new Function('CH', html.slice(a, b) + '; return chanOrder;')(CH);
let bad = 0; const ok = (n, c) => { if (!c) bad++; console.log(`${c ? 'PASS' : 'FAIL'} ${n}`); };
const SL = { c3: '14:00', web: '19:00', tech: '20:30' }, T = '2026-11-27';
const caps = { 'showreel-c3-door': { channel: 'c3', postOn: T, postAt: '14:00' }, 'showreel-40-grid': { channel: 'web', postOn: T, postAt: '19:00' }, 'showreel-tech-ai': { channel: 'tech', postOn: T, postAt: '20:30' } };
const shows = Object.keys(caps).map((name) => ({ name }));
ok('today: Turns Out 14:00, web 19:00, tech 20:30', chanOrder(shows, caps, {}, T, SL).join() === 'c3,web,tech');
ok('a posted channel goes last', chanOrder(shows, caps, { 'showreel-c3-door': '2026-11-27T08:40:00Z' }, T, SL).join() === 'web,tech,c3');
ok('two posted: the one still to post leads', chanOrder(shows, caps, { 'showreel-c3-door': 1, 'showreel-40-grid': 1 }, T, SL).join() === 'tech,web,c3');
ok("a reel's own postAt counts over the slot", chanOrder(shows, { ...caps, 'showreel-tech-ai': { channel: 'tech', postOn: T, postAt: '13:30' } }, {}, T, SL)[0] === 'tech');
ok('nothing due today: by slot', chanOrder([], {}, {}, T, SL).join() === 'c3,web,tech');
// every place the main script sets the channel must be a workflow entry point
const js = html.slice(html.indexOf('<script>'), html.lastIndexOf('</script>'));
const sets = [...js.matchAll(/(^|[^\w.])ch = ([^;]+);/gm)].map((m) => js.slice(m.index, m.index + m[0].length + 20).trim());   // with what follows (chSet = true)
const allowed = [/ch = 'web', chSet = false/, /ch = location\.hash\.slice\(1\)/, /ch = t\.getAttribute\('data-ch'\)/, /ch = k; chSet = true/, /ch = dueNext\(\)/];
const stray = sets.filter((x) => !allowed.some((r) => r.test(x)) && !/[a-z]ch = |fbCh|refCh|^,?\s*ch = e && e\.channel/.test(x));
ok('the channel is set only by a workflow entry point (board, reel link, tab tap, All reels)', stray.length === 0 || (console.log('   stray:', stray), false));
ok('no saved last tab is restored', !/localStorage\.getItem\('studio-ch'\)/.test(html));
ok('the Growth picker does not switch the reels tab', !/function gPick\(k\)\{[^}]*ch = k/.test(html));
ok('Open to post opens that card\'s channel', /if \(c\.ready\) \{ ch = k; chSet = true; go\('reels'\); \}/.test(html));
ok('a reel link or reminder opens the reel\'s channel', /if \(k\) \{ ch = k; chSet = true; \}\s*reelName = name; go\('reel'\);/.test(html));
ok('All reels opens the channel due next', /function allReels\(\)\{ ch = dueNext\(\);/.test(html) && /getElementById\('t-all'\)\.addEventListener\('click', allReels\)/.test(html));
console.log(bad ? `APP TABS TEST: ${bad} FAILED` : 'APP TABS TEST: all passed'); process.exit(bad ? 1 : 0);
