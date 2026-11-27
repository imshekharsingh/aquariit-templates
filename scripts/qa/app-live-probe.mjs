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
  console.log(`REELS ${ch}: tabs=`, await txt('.tabs'), '| ready=', await txt('#t-ready'), '| list=', await txt('#list'));
}
console.log('STILL OPEN after the run:'); for (const [r, s] of open) console.log(`  ${Date.now() - s} ms  ${r.method()} ${new URL(r.url()).pathname}`);
console.log('REQUESTS AND ERRORS:'); for (const l of log) console.log('  ' + l);
await b.close();
