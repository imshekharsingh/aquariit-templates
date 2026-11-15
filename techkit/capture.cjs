// Frame capture for a kit scene (the owner's motion kit, design/kits/motion_kit.zip capture.js): headless Chromium calls window.render(t)
// and screenshots each frame. Usage: node techkit/capture.cjs <scene.html> <outdir> <fps> <start> <end>
//                                 or node techkit/capture.cjs <scene.html> <outdir> times t1,t2,...
// Chromium: Playwright's own (local), or CHROME_BIN (GitHub runners ship Google Chrome; playwright-core drives it).
const path = require('path');
let pw; try { pw = require('playwright'); } catch { pw = require('playwright-core'); }
(async () => {
  const [scene, outdir, mode, a, b] = process.argv.slice(2);
  const opt = { args: ['--force-color-profile=srgb', '--hide-scrollbars'] };
  if (process.env.CHROME_BIN) opt.executablePath = process.env.CHROME_BIN;
  const browser = await pw.chromium.launch(opt);
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', (e) => { console.error('PAGEERR', e.message); process.exitCode = 2; });
  await page.goto('file://' + path.resolve(scene));
  await page.evaluate(() => document.fonts.ready);
  let jobs = [];
  if (mode === 'times') jobs = a.split(',').map((t) => [`t_${(+t).toFixed(2)}`, +t]);
  else { const fps = +mode; for (let i = +a; i < +b; i++) jobs.push([`f${String(i).padStart(5, '0')}`, i / fps]); }
  const t0 = Date.now();
  for (const [name, t] of jobs) {
    await page.evaluate((t) => window.render(t), t);
    await page.screenshot({ path: path.join(outdir, name + (mode === 'times' ? '.png' : '.jpg')), ...(mode === 'times' ? {} : { type: 'jpeg', quality: 94 }) });
  }
  console.error(`done ${jobs.length} in ${(Date.now() - t0) / 1000}s`);
  await browser.close();
})();
