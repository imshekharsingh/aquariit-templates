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
const heavy = log.filter((l) => /\.mp4|\/api\/refs\/\d+\/file/.test(l)).length;
console.log(`VIDEO REQUESTS WITHOUT A TAP: ${heavy} (want 0)`); const perr = log.filter((l) => l.startsWith('PAGE ERROR')).length;
console.log(heavy ? 'APP PROBE: FAIL (videos load on open)' : perr ? `APP PROBE: FAIL (${perr} page error)` : 'APP PROBE: PASS');
for (const ch of ['tech', 'web', 'c3']) {   // the Today board's Open to post / Open reel: the reels page must show that card's channel in every part
  await page.evaluate(() => { const b = [...document.querySelectorAll('.bnav button, nav button')].find((x) => /today/i.test(x.textContent || '')); if (b) b.click(); });
  await page.waitForTimeout(800);
  const went = await page.evaluate((c) => { const cards = [...document.querySelectorAll('.bcard')]; const card = cards.find((x) => x.querySelector('.dot.d-' + c)) ; const b = card && card.querySelector('.bopen'); if (b && !b.hidden) { b.click(); return true; } return false; }, ch);
  await page.waitForTimeout(1500);
  if (went) { const title = await txt('#title'), rt = await txt('#t-ready'); console.log(`OPEN FROM BOARD ${ch}: title=${title} | ready=${rt.slice(0, 80)}`);
    for (const [k, n] of Object.entries({ web: '@webin20sec', tech: '@techin20sec', c3: '@itturns.out' })) if (k !== ch && (rt.includes(n) || title.includes(n))) log.push(`PAGE ERROR  Open from board ${ch}: shows ${n}`); }
}
const perr2 = log.filter((l) => l.startsWith('PAGE ERROR')).length; if (perr2) console.log(`APP PROBE: FAIL (${perr2} page error)`);
console.log('STILL OPEN after the run:'); for (const [r, s] of open) console.log(`  ${Date.now() - s} ms  ${r.method()} ${new URL(r.url()).pathname}`);
console.log('REQUESTS AND ERRORS:'); for (const l of log) console.log('  ' + l);
await b.close();
