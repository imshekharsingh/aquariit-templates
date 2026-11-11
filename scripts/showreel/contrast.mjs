// CONTRAST (owner, 8 Nov 2026: more colour combinations reel to reel, and the text must stay easy to read; rules-web.md rule 12). Measured on
// the rendered frame, not the tokens: every 0.5 s it seeks the scene, takes the frame with the text hidden (what sits behind the text: the
// light, the panes, the band), and for every caption and label (visible text outside [data-subject], plus [data-hook] and [data-subs], at
// 90%+ opacity: text still fading in is not read) compares its colour with the brightest 5% of the pixels behind it (the brightest bloom it crosses). Prints
// "CONTRAST: n.n:1 (palette)" with the worst text, and exits 1 under 4.5:1 (WCAG AA). A demo's own text (inside [data-subject]) is the
// subject's look, not a label; an element can opt out with data-contrast="skip". Text that is covered (it changes under 2% of its box) is not read.
// Usage: node scripts/showreel/contrast.mjs scripts/explainer/<slug>.json [--palette name]  (the flag overrides the scene's palette, for sheets)
import { readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createRequire } from 'node:module';
const req = createRequire(process.env.PW_FROM || join(process.cwd(), 'node_modules/'));
let pw; try { pw = req('playwright'); } catch { pw = createRequire(import.meta.url)('playwright'); }
const args = process.argv.slice(2), pi = args.indexOf('--palette'), force = pi >= 0 ? args.splice(pi, 2)[1] : null;
const cfgPath = args[0], cfg = JSON.parse(readFileSync(cfgPath, 'utf8')), scene = cfgPath.replace(/\.json$/, '.html'), MIN = 4.5;
const b = await pw.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }), p = await b.newPage({ viewport: { width: 540, height: 960 } });
if (force) await p.addInitScript((x) => { window.WEB_PALETTE = x; }, force);
await p.goto('file://' + resolve(scene)); await p.waitForSelector('html[data-ready]');
const palette = await p.evaluate(() => document.documentElement.dataset.palette || document.documentElement.dataset.theme || 'none');
const texts = () => { const out = [], seen = new Set(), tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), op = (e) => { let a = 1; for (; e && e.nodeType === 1; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return 0; a *= +cs.opacity; } return a; };
  let n; while ((n = tw.nextNode())) { const el = n.parentElement, s = n.textContent.trim(); if (!s || !el || /^(SCRIPT|STYLE)$/.test(el.tagName) || seen.has(el)) continue;
    if (el.closest('[data-contrast=skip]') || (el.closest('[data-subject]') && !el.closest('[data-hook],[data-subs]'))) continue;
    const r = document.createRange(); r.selectNodeContents(n); const bx = r.getBoundingClientRect(); const a = op(el);
    if (bx.width < 2 || a < .9 || bx.right < 0 || bx.left > innerWidth || bx.bottom < 0 || bx.top > innerHeight) continue;
    // covered text (a pane gliding over it) is not read: an element painted above any part of it (centre or corners) with a background or border of its own covers it
    const X0 = Math.max(0, bx.left) + 1, X1 = Math.min(innerWidth, bx.right) - 1, Y0 = Math.max(0, bx.top) + 1, Y1 = Math.min(innerHeight, bx.bottom) - 1;
    let covered = false; for (const [px, py] of [[(X0 + X1) / 2, (Y0 + Y1) / 2], [X0, Y0], [X1, Y0], [X0, Y1], [X1, Y1]]) { for (const e of document.elementsFromPoint(px, py)) { if (e === el || e.contains(el)) break; if (el.contains(e)) continue;
      const cs = getComputedStyle(e), bgA = +((cs.backgroundColor.match(/[\d.]+/g) || [0, 0, 0, 0])[3] ?? 1), bd = parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== 'none';
      if ((bgA > .5 || cs.backgroundImage !== 'none' || bd) && op(e) > .5) { covered = true; break; } } if (covered) break; }
    if (covered) continue;
    const m = getComputedStyle(el).color.match(/[\d.]+/g).map(Number); seen.add(el);
    out.push({ s: (el.id ? "#" + el.id + " " : el.className ? "." + String(el.className).split(" ")[0] + " " : "") + s.slice(0, 24), x: Math.max(0, bx.left), y: Math.max(0, bx.top), w: Math.min(innerWidth, bx.right) - Math.max(0, bx.left), h: Math.min(innerHeight, bx.bottom) - Math.max(0, bx.top), c: m.slice(0, 3), a: (m[3] ?? 1) * a }); }
  return out; };
let worst = { r: 99 }, n = 0;
for (let t = 0; t <= cfg.dur - .05; t += .5) {
  await p.evaluate((x) => window.seek(x), t); await p.evaluate(() => { const s = document.getElementById('km-pe') || document.head.appendChild(Object.assign(document.createElement('style'), { id: 'km-pe' })); s.textContent = '*{pointer-events:auto!important}#km-lights{pointer-events:none!important}'; });
  const ts = await p.evaluate(texts); if (!ts.length) continue;
  const fg = (await p.screenshot({ type: 'png' })).toString('base64');
  await p.addStyleTag({ content: '*{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important}', }).then((h) => p.evaluate((e) => e.id = 'km-ct', h));
  const bg = (await p.screenshot({ type: 'png' })).toString('base64'); await p.evaluate(() => document.getElementById('km-ct').remove());
  const res = await p.evaluate(async ({ bg, fg, ts }) => { const load = async (b64) => { const im = new Image(); im.src = 'data:image/png;base64,' + b64; await im.decode(); const c = document.createElement('canvas'); c.width = im.width; c.height = im.height;
      const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(im, 0, 0); return g; }, g = await load(bg), gf = await load(fg), sx = g.canvas.width / innerWidth;
    const L = (r, gg, bb) => [r, gg, bb].map((v) => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }).reduce((s, v, i) => s + v * [.2126, .7152, .0722][i], 0);
    return ts.map((x) => { const box = [Math.round(x.x * sx), Math.round(x.y * sx), Math.max(1, Math.round(x.w * sx)), Math.max(1, Math.round(x.h * sx))], d = g.getImageData(...box).data, f = gf.getImageData(...box).data, px = [];
      // text that something covers (a pane gliding over it) changes nothing in the frame: not read
      let ch = 0; for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - f[i]) + Math.abs(d[i + 1] - f[i + 1]) + Math.abs(d[i + 2] - f[i + 2]) > 24) ch++; if (ch < d.length / 4 * .02) return null;
      for (let i = 0; i < d.length; i += 4) px.push([d[i], d[i + 1], d[i + 2], L(d[i], d[i + 1], d[i + 2])]); px.sort((u, v) => u[3] - v[3]);
      const hi = px[Math.floor(px.length * .95)] || px[px.length - 1], lo = px[Math.floor(px.length * .05)] || px[0];
      const vs = (q) => { const fc = x.c.map((v, k) => v * x.a + q[k] * (1 - x.a)), lt = L(...fc); return (Math.max(lt, q[3]) + .05) / (Math.min(lt, q[3]) + .05); };
      return { s: x.s, r: Math.min(vs(hi), vs(lo)) }; }).filter(Boolean); }, { bg, fg, ts });
  for (const x of res) { n++; if (process.env.CT_ALL && x.r < MIN) console.log(t.toFixed(1), x.r.toFixed(2), x.s); if (x.r < worst.r) worst = { r: x.r, s: x.s, t }; }
}
await b.close();
const ok = worst.r >= MIN;
console.log(`CONTRAST: ${n ? worst.r.toFixed(1) : '-'}:1 (${palette})${n ? `, worst "${worst.s}" at ${worst.t.toFixed(1)} s over ${n} text readings` : ', no captions or labels found'}${ok ? '' : ` (UNDER ${MIN}:1: retune the palette or give the text a pane)`}`);
process.exit(ok || !n ? 0 : 1);
