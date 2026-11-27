// App fresh test (task 19, owner 27 Nov 2026): a newer deploy reloads the installed app exactly once, and a stalled list reloads once before
// Try again. Runs freshDecide() / stallDecide() from templates/index.html and the Worker's page stamp. Run: node scripts/qa/app-fresh-test.mjs
import { readFileSync } from 'node:fs';
const html = readFileSync(new URL('../../templates/index.html', import.meta.url), 'utf8');
const a = html.indexOf('// FRESH-START'), b = html.indexOf('// FRESH-END');
if (a < 0 || b < 0) { console.log('FAIL freshDecide() not found in templates/index.html'); process.exit(1); }
const { freshDecide, stallDecide } = new Function(html.slice(a, b) + '; return { freshDecide, stallDecide };')();
let bad = 0; const ok = (n, c) => { if (!c) bad++; console.log(`${c ? 'PASS' : 'FAIL'} ${n}`); };
ok('same build: no reload', freshDecide('a1b2c3', 'a1b2c3', '') === 'ok');
ok('a newer deploy: reload', freshDecide('a1b2c3', 'ffee99', '') === 'reload');
// simulate the one reload: the old copy reloads to ?fresh=ffee99; if the page that comes back is STILL old, it must not reload again
let reloads = 0, search = '', mine = 'a1b2c3';
for (let i = 0; i < 5; i++) { if (freshDecide(mine, 'ffee99', search) === 'reload') { reloads++; search = '?fresh=ffee99'; } }
ok('a page still old after the reload never reloads again (exactly one reload)', reloads === 1);
ok('a later deploy after that reloads once more', freshDecide('ffee99', '7777aa', '?fresh=ffee99') === 'reload');
ok('no answer from the server: no reload', freshDecide('a1b2c3', null, '') === 'ok');
ok('a page served without the Worker stamp (local file): no reload', freshDecide('__APP_BUILD__', 'ffee99', '') === 'ok');
ok('a stalled list reloads once', stallDecide('') === 'reload' && stallDecide('?stall=1') === 'show');
ok('the page carries the build stamp the Worker fills in', /var APP_BUILD = '__APP_BUILD__'/.test(html));
const w = readFileSync(new URL('../../src/worker.js', import.meta.url), 'utf8');
ok('the Worker serves the page with its build and answers /api/version', /text\.replace\('__APP_BUILD__', v\)/.test(w) && /p === '\/api\/version'/.test(w));
console.log(bad ? `APP FRESH TEST: ${bad} FAILED` : 'APP FRESH TEST: all passed'); process.exit(bad ? 1 : 0);
