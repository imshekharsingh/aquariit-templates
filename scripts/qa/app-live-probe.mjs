// App live probe (owner, 27 Nov 2026: "posts do not load" on the phone while the server answers): signs in to the live app, opens it at phone
// size, and prints every request with its status and time, page errors, what the reel list and the board show after 25 s, and screenshots.
// Run on GitHub (App probe workflow; needs BASIC_AUTH_USER / BASIC_AUTH_PASS). Never prints a secret.
import { chromium, devices } from 'playwright';
import { mkdirSync } from 'node:fs';
const B = process.env.BASE || 'https://templates.aquariit.com', U = process.env.BASIC_AUTH_USER, P = process.env.BASIC_AUTH_PASS;
if (!U || !P) { console.log('PROBE: no sign-in secrets'); process.exit(1); }
mkdirSync('probe', { recursive: true });
const b = await chromium.launch();
const ctx = await b.newContext({ ...devices['iPhone 13'] });
const page = await ctx.newPage();
const log = [], t0 = Date.now(), open = new Map();
page.on('request', (r) => { if (new URL(r.url()).origin === B) open.set(r, Date.now()); });
page.on('requestfinished', async (r) => { const s = open.get(r); open.delete(r); const res = await r.response(); log.push(`${String(Date.now() - s).padStart(6)} ms  ${res ? res.status() : '---'}  ${r.method()} ${new URL(r.url()).pathname}`); });
page.on('requestfailed', (r) => { open.delete(r); log.push(`FAILED  ${r.method()} ${new URL(r.url()).pathname}  ${r.failure() && r.failure().errorText}`); });
page.on('pageerror', (e) => log.push(`PAGE ERROR  ${e.message}  ${(e.stack || '').split('\n')[1] || ''}`));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') log.push(`CONSOLE ${m.type()}  ${m.text().slice(0, 200)}`); });
await page.goto(B + '/login');
await page.fill('input[name=username]', U); await page.fill('input[name=password]', P);
await Promise.all([page.waitForNavigation(), page.click('button[type=submit], input[type=submit]')]);
const shot = async (n) => page.screenshot({ path: `probe/${n}.png` });
await page.waitForTimeout(25000); await shot('1-today');
const txt = async (sel) => ((await page.$(sel)) ? (await page.textContent(sel)).replace(/\s+/g, ' ').trim().slice(0, 300) : '(missing)');
console.log('TODAY BOARD:', await txt('#s-today'));
for (const ch of ['web', 'tech', 'c3']) {
  await page.evaluate(() => { const b = document.getElementById('t-all'); if (b) b.click(); });
  await page.waitForTimeout(500);
  const t = await page.$(`.tab[data-ch=${ch}]`); if (t) await t.click(); await page.waitForTimeout(3000); await shot(`2-reels-${ch}`);
  const rt = await txt('#t-ready'), other = { web: '@webin20sec', tech: '@techin20sec', c3: '@itturns.out' };
  for (const [k, n] of Object.entries(other)) if (k !== ch && rt.includes(n)) log.push(`PAGE ERROR  tab ${ch}: Ready to post names ${n}`);
  console.log(`REELS ${ch}: tabs=`, await txt('.tabs'), '| ready=', await txt('#t-ready'), '| list=', await txt('#list'));
}
// the Today board (task 21, owner chat 27 Nov 2026): each card's button is judged by what it says it does.
//   "Open to post" -> that channel's reels tab, its Ready box naming only that channel; "Open reel" -> that reel's own page, of that channel.
const NAMES = { web: '@webin20sec', tech: '@techin20sec', c3: '@itturns.out' };
for (const ch of ['tech', 'web', 'c3']) {
  await page.evaluate(() => { const b = [...document.querySelectorAll('.bnav button, nav button')].find((x) => /today/i.test(x.textContent || '')); if (b) b.click(); });
  await page.waitForTimeout(800);
  const btn = await page.evaluate((c) => { const card = [...document.querySelectorAll('.bcard')].find((x) => x.querySelector('.dot.d-' + c)); const b = card && card.querySelector('.bopen'); if (!b || b.hidden) return null; const t = b.textContent.trim(); b.click(); return t; }, ch);
  await page.waitForTimeout(1500); await shot(`3-board-${ch}`);
  if (!btn) { console.log(`OPEN FROM BOARD ${ch}: no button (nothing to open yet)`); continue; }
  const vis = async (sel) => page.evaluate((q) => { const e = document.querySelector(q); return !!e && !e.hidden && e.offsetParent !== null; }, sel);
  if (/open to post/i.test(btn)) {
    const onTab = await vis('#s-chan'), sel = await page.evaluate(() => { const t = document.querySelector('.tab[aria-selected="true"], .tab.on'); return t ? t.getAttribute('data-ch') : null; }), rt = await txt('#t-ready');
    const wrong = Object.entries(NAMES).filter(([k, n]) => k !== ch && rt.includes(n)).map(([, n]) => n);
    console.log(`OPEN FROM BOARD ${ch}: "${btn}" -> reels tab ${onTab ? 'open' : 'NOT open'}, selected ${sel || '?'}, ready=${rt.slice(0, 80)}`);
    if (!onTab) log.push(`PAGE ERROR  Open to post ${ch}: the reels tab did not open`);
    if (sel && sel !== ch) log.push(`PAGE ERROR  Open to post ${ch}: the ${sel} tab is selected`);
    if (wrong.length) log.push(`PAGE ERROR  Open to post ${ch}: Ready to post names ${wrong.join(', ')}`);
  } else if (/open reel/i.test(btn)) {
    const onReel = await vis('#s-reel'), head = await txt('#reel-page .rhead');
    console.log(`OPEN FROM BOARD ${ch}: "${btn}" -> reel page ${onReel ? 'open' : 'NOT open'}, ${head}`);
    if (!onReel) log.push(`PAGE ERROR  Open reel ${ch}: the reel page did not open`);
    else if (!head.includes(NAMES[ch])) log.push(`PAGE ERROR  Open reel ${ch}: the page is for ${head}`);
  } else console.log(`OPEN FROM BOARD ${ch}: button "${btn}" (not judged)`);
}
const heavy = log.filter((l) => /\.mp4|\/api\/refs\/\d+\/file/.test(l)).length, perr = log.filter((l) => l.startsWith('PAGE ERROR')).length;
console.log(`VIDEO REQUESTS WITHOUT A TAP: ${heavy} (want 0)`);
console.log(heavy ? 'APP PROBE: FAIL (videos load on open)' : perr ? `APP PROBE: FAIL (${perr} page error)` : 'APP PROBE: PASS');   // one verdict, after every step
console.log('STILL OPEN after the run:'); for (const [r, s] of open) console.log(`  ${Date.now() - s} ms  ${r.method()} ${new URL(r.url()).pathname}`);
console.log('REQUESTS AND ERRORS:'); for (const l of log) console.log('  ' + l);
await b.close();
