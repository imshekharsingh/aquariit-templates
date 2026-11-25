// Bench for techkit/scenes/test-3d-quality.html: seconds per frame (render + screenshot) for each cumulative technique step; optional stills.
// node techkit/3dtest-bench.cjs <scene.html> <outdir> [stillTimes]    (scene from scripts/3dtest-assemble.py)
const path = require('path'), fs = require('fs');
let pw; try { pw = require('playwright'); } catch { pw = require('playwright-core'); }
(async () => {
  const [scene, outdir, stills] = process.argv.slice(2); fs.mkdirSync(outdir, { recursive: true });
  const opt = { args: ['--force-color-profile=srgb', '--hide-scrollbars', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] };
  if (process.env.CHROME_BIN) opt.executablePath = process.env.CHROME_BIN;
  const browser = await pw.chromium.launch(opt);
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', (e) => { console.error('PAGEERR', e.message); });
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.error('CONSOLE', m.text().slice(0, 300)); });
  await page.goto('file://' + path.resolve(scene), { timeout: 300000 });
  const steps = [['0 baseline (Standard, no env, no shadow, no tone map)', {phys:0,env:0,shadow:0,bloom:0,dof:0,aces:0}],
    ['1 + physical clearcoat', {phys:1}], ['2 + environment map', {env:1}], ['3 + soft shadows', {shadow:1}], ['4 + bloom', {bloom:1}], ['5 + depth of field', {dof:1}], ['6 + ACES', {aces:1}]];
  const times = [0.3, 1.0, 1.4, 3.0], N = +(process.env.BENCH_N || 4);
  let cur = {};
  for (const [name, patch] of steps) {
    Object.assign(cur, patch);
    await page.evaluate((c) => { Object.assign(window.FX, c); }, cur);
    await page.evaluate(() => window.render(1.0));                       // warm: shader compile
    await page.screenshot({ path: path.join(outdir, 'warm.png') });
    const t0 = Date.now();
    for (let i = 0; i < N; i++) { await page.evaluate((t) => window.render(t), 1.0 + i * 0.37); await page.screenshot({ path: path.join(outdir, 'tmp.jpg'), type: 'jpeg', quality: 94 }); }
    const per = (Date.now() - t0) / 1000 / N;
    // render only (gl.finish via readPixels of 1 px) vs screenshot
    const r0 = Date.now(); for (let i = 0; i < N; i++) await page.evaluate((t) => { window.render(t); const g = document.querySelector('canvas').getContext('webgl2'); const px = new Uint8Array(4); g.readPixels(0, 0, 1, 1, g.RGBA, g.UNSIGNED_BYTE, px); }, 1.0 + i * 0.41);
    const rend = (Date.now() - r0) / 1000 / N;
    console.log(`STEP ${name}: ${per.toFixed(2)} s/frame (render+jpeg screenshot), render only ${rend.toFixed(2)} s`);
    if (stills && process.env.STEP_STILLS) { const tag = name.split(' ')[0]; for (const t of times) { await page.evaluate((t) => window.render(t), t); await page.screenshot({ path: path.join(outdir, `step${tag}_${t}.png`) }); } }
  }
  if (stills) for (const t of stills.split(',')) { await page.evaluate((t) => window.render(+t), t); await page.screenshot({ path: path.join(outdir, `t_${(+t).toFixed(2)}.png`) }); }
  await browser.close();
})();
