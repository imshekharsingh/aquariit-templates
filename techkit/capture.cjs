// Frame capture for a kit scene (the owner's motion kit, design/kits/motion_kit.zip capture.js): headless Chromium calls window.render(t)
// and screenshots each frame. Usage: node techkit/capture.cjs <scene.html> <outdir> <fps> <start> <end>
//                                 or node techkit/capture.cjs <scene.html> <outdir> times t1,t2,...
// Chromium: Playwright's own (local), or CHROME_BIN (GitHub runners ship Google Chrome; playwright-core drives it).
// KIT_SCALE=0.25: frames at 270x480 for the local Output QA look (scripts/qa/look.py). In fps mode, a scene with window.__subject() (the hero's
// box in screen px, 1080 wide) has it recorded every 0.5 s into <outdir>/subject_<start>.json; make.py merges them for Output QA HERO.
const path = require('path');
let pw; try { pw = require('playwright'); } catch { pw = require('playwright-core'); }
(async () => {
  const [scene, outdir, mode, a, b] = process.argv.slice(2);
  const opt = { args: ['--force-color-profile=srgb', '--hide-scrollbars'] };
  if (process.env.CHROME_BIN) opt.executablePath = process.env.CHROME_BIN;
  const browser = await pw.chromium.launch(opt);
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: +(process.env.KIT_SCALE || 1) });
  page.on('pageerror', (e) => { console.error('PAGEERR', e.message); process.exitCode = 2; });
  if (process.env.KIT_Q) await page.addInitScript((q) => { window.KITQ = q; }, +process.env.KIT_Q);   // KIT_Q=0.5: a quick draft of a kit3d scene (fewer blur samples)
  // a 3D scene draws its first frame while it loads (shaders compile on the runner's software GPU, four workers at once): 30 s was not enough (23 Nov 2026)
  await page.goto('file://' + path.resolve(scene), { timeout: 300000 });
  await page.evaluate(() => document.fonts.ready);
  let jobs = [];
  if (mode === 'times') jobs = a.split(',').map((t) => [`t_${(+t).toFixed(2)}`, +t]);
  else { const fps = +mode; for (let i = +a; i < +b; i++) jobs.push([`f${String(i).padStart(5, '0')}`, i / fps]); }
  const t0 = Date.now(), SUBJ = [], every = mode === 'times' ? 0 : Math.max(1, Math.round(+mode / 2));
  for (const [i, [name, t]] of jobs.entries()) {
    await page.evaluate((t) => window.render(t), t);
    if (every && (+a + i) % every === 0) { const bx = await page.evaluate(() => (window.__subject ? window.__subject() : null)); if (bx) SUBJ.push([+t.toFixed(2), ...bx.map(Math.round)]); }
    await page.screenshot({ path: path.join(outdir, name + (mode === 'times' ? '.png' : '.jpg')), ...(mode === 'times' ? {} : { type: 'jpeg', quality: 94 }) });
  }
  if (SUBJ.length) require('fs').writeFileSync(path.join(outdir, `subject_${a}.json`), JSON.stringify(SUBJ));
  console.error(`done ${jobs.length} in ${(Date.now() - t0) / 1000}s`);
  await browser.close();
})();
