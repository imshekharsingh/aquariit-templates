// TEXT CLEAR dumper (owner, 26 Nov 2026; the analysis is scripts/showreel/textclear.py): for every 0.25 s of a scene writes the frame as drawn (A_i.png)
// and the same moment without its overlay text (B_i.png), plus the text boxes it can read (meta.json). Engines: a web or Turns Out scene
// (window.seek(t), 540x960 CSS px, DOM text and canvas fillText) and a tech kit scene (window.render(t), 1080x1920, DOM text, canvas labels
// and the 3D number figures, which hide themselves while window.__noText is set: techkit/lib3d.js).
// Text left out of B: every DOM text outside [data-subject] / [data-ui] (the subject's own UI is part of the picture), SVG text, every canvas
// fillText / strokeText, the 3D figures. Pictures are 540x960.
// Usage: node scripts/showreel/textclear.mjs <config.json> <out dir> [--scene <scene.html>] [--step 0.25]
//   a web or Turns Out config has "seek"; a tech topic ("slug" and "lines") needs --scene out/techreel/<slug>/scene.html (techkit/make.py --build-only).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createRequire } from 'node:module';
import { collectDom } from './layout.mjs';
import { simWords } from './flow.mjs';
const { chromium } = createRequire(process.env.PW_FROM || join(process.cwd(), 'node_modules/'))('playwright');
const a = process.argv.slice(2), at = (k, d) => (a.includes(k) ? a[a.indexOf(k) + 1] : d);
const cfg = JSON.parse(readFileSync(a[0], 'utf8')), out = resolve(a[1]);
let step = +at('--step', .25);
const kit = !!(cfg.slug && cfg.lines), scene = resolve(at('--scene', cfg.seek || ''));
mkdirSync(out, { recursive: true });
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--force-color-profile=srgb', '--hide-scrollbars', '--allow-file-access-from-files'] });
const W = kit ? 1080 : 540, H = kit ? 1920 : 960;
const p = await (await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 540 / W })).newPage();
const errs = []; p.on('pageerror', (e) => errs.push(e.message));
if (kit) await p.addInitScript((q) => { window.KITSCALE = q; }, +(process.env.KITSCALE || .5));   // a 3D scene draws at half size here: the pictures are 540x960 anyway
if (process.env.KIT_Q) await p.addInitScript((q) => { window.KITQ = q; }, +process.env.KIT_Q);
// canvas text is drawn through these two calls in every scene: with window.__noText set they draw nothing
await p.addInitScript(() => { for (const f of ['fillText', 'strokeText']) { const o = CanvasRenderingContext2D.prototype[f]; CanvasRenderingContext2D.prototype[f] = function (...x) { if (window.__noText) return; window.__ft = (window.__ft || 0) + 1; return o.apply(this, x); }; } });
await p.goto('file://' + scene, { timeout: 300000 }); if (!kit) await p.waitForSelector('html[data-ready]', { timeout: 60000 });
await p.evaluate(() => document.fonts.ready);
let total, seek, slow = false;
if (kit) { total = await p.evaluate(() => window.TL.total); seek = (t) => p.evaluate((t) => window.render(t), t); }
else {
  total = cfg.dur; seek = (t) => p.evaluate((t) => window.seek(t), t);
  const w = process.env.VOICE_WORDS ? JSON.parse(readFileSync(process.env.VOICE_WORDS, 'utf8')) : { words: simWords(cfg).words };
  await p.evaluate((w) => { if (w.words && w.words.length && window.setVoice) window.setVoice(w); }, w);
}
// a 3D scene (WebGL on a software GPU) takes seconds a moment: it is looked at every 0.5 s unless --step says otherwise
if (kit && !a.includes('--step')) { const t0 = Date.now(); await seek(1); await seek(2); if ((Date.now() - t0) / 2 > 700) step = .5; }
const HIDE = 'body *:not([data-subject]):not([data-subject] *):not([data-ui]):not([data-ui] *){color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important}svg text{fill:transparent!important;stroke:none!important}';
const samples = [], waive = (await p.evaluate(() => window.TEXTCLEAR_OK || [])) || [];
let i = 0;
for (let t = 0; t <= total - .05; t = +(t + step).toFixed(3), i++) {
  await p.evaluate(() => { window.__noText = false; const s = document.getElementById('__tc'); if (s) s.remove(); });
  await p.evaluate(() => { window.__ft = 0; });
  await seek(t);
  await p.evaluate(() => { window.__ftNow = window.__ft || 0; });
  const boxes = await p.evaluate(`(${collectDom})()`).then((r) => r.texts);
  await p.screenshot({ path: join(out, `A_${i}.png`), type: 'png' });
  await p.evaluate((css) => { window.__noText = true; const s = document.createElement('style'); s.id = '__tc'; s.textContent = css; document.head.appendChild(s); }, HIDE);
  // the second render is only needed when the frame holds text that is not in the page (3D figures, canvas text drawn during that render)
  if (!kit || await p.evaluate(() => (window.__figs || []).some((f) => f.userData.on()) || window.__ftNow > 0)) await seek(t);
  await p.screenshot({ path: join(out, `B_${i}.png`), type: 'png' });
  // a text's own backdrop or frame (a highlight, a label pill, a selection box around a word): any element with a fill, border or outline that wraps
  // the text tightly, 40 px (at 1080) of room at most on every side; its border is not an obstacle for that text
  const own = await p.evaluate(() => { const k = 1080 / innerWidth, out = [], els = [...document.body.querySelectorAll('*')].filter((e) => !/^(SCRIPT|STYLE|BR)$/.test(e.tagName)), tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const ink = els.map((e) => { const cs = getComputedStyle(e), bg = cs.backgroundColor.match(/[\d.]+/g) || [], a = bg.length === 4 ? +bg[3] : bg.length ? 1 : 0;
      const has = (a > .05 && cs.display !== 'none' && cs.visibility !== 'hidden') || cs.backgroundImage !== 'none' || parseFloat(cs.borderTopWidth) > 0 || parseFloat(cs.borderLeftWidth) > 0 || parseFloat(cs.outlineWidth) > 0 && cs.outlineStyle !== 'none' || cs.boxShadow !== 'none';
      return has ? [e, e.getBoundingClientRect()] : null; }).filter(Boolean);
    let n; while ((n = tw.nextNode())) { const s = n.textContent.replace(/\s+/g, ''), el = n.parentElement; if (!s || !el || /^(SCRIPT|STYLE)$/.test(el.tagName)) continue;
      const rg = document.createRange(); rg.selectNodeContents(n); const tr = rg.getBoundingClientRect(); if (tr.width < 1 || tr.height < 1) continue;
      for (const [e, r] of ink) { const L = tr.left - r.left, T = tr.top - r.top, R = r.right - tr.right, B = r.bottom - tr.bottom, m = 40 / k;
        if (L >= -2 && T >= -2 && R >= -2 && B >= -2 && L <= m && T <= m && R <= m && B <= m && r.width * r.height <= 10 * tr.width * tr.height) out.push([r.left, r.top, r.right, r.bottom, tr.left, tr.top, tr.right, tr.bottom].map((v) => Math.round(v * k))); } }
    return out; });
  samples.push({ own, t, boxes: boxes.map(({ s, l, t: tt, r, b: bb, a: aa, g, sub }) => ({ s, l, t: tt, r, b: bb, a: aa, g, sub })) });
}
await p.evaluate(() => { window.__noText = false; });
writeFileSync(join(out, 'meta.json'), JSON.stringify({ step, samples, waive, errors: errs }));
await b.close();
console.log(`TEXT CLEAR dump: ${samples.length} moments in ${out}${errs.length ? '; page errors: ' + errs.slice(0, 2).join(' | ') : ''}`);
