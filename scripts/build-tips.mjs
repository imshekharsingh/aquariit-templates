// The public tips page (owner, 27 Oct 2026: people should be able to see how the reels' learnings work in real use).
// Built from the "tip" block of every reel config in scripts/explainer/*.json, so a new reel adds its own entry:
//   "tip": { "title", "why", "code", "demo" (a key in scripts/tips/demos.mjs), "source": { "url", "label" }, "reel": Instagram link (optional) }
// Writes templates/tips/index.html; --check only compares (npm run check fails when the page is out of date).
// The page is the one public part of the site (src/worker.js PUBLIC): static, no data, no API calls, system fonts only.
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { demos } from './tips/demos.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..'), dir = join(root, 'scripts', 'explainer'), out = join(root, 'templates', 'tips', 'index.html');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const tips = [];
for (const f of readdirSync(dir).filter((x) => x.endsWith('.json')).sort()) {
  const c = JSON.parse(readFileSync(join(dir, f), 'utf8'));
  if (!c.tip) continue;
  const t = c.tip, id = t.demo;
  for (const k of ['title', 'why', 'code', 'demo', 'source']) if (!t[k]) throw new Error(`${f}: tip.${k} is missing`);
  if (!demos[id]) throw new Error(`${f}: tip.demo "${id}" has no demo in scripts/tips/demos.mjs`);
  if (!/^https:\/\//.test(t.source.url) || (t.reel && !/^https:\/\/www\.instagram\.com\//.test(t.reel))) throw new Error(`${f}: tip links must be https (reel: instagram.com)`);
  const no = (/^showreel-(\d+)-/.exec(c.name) || [])[1];
  tips.push({ ...t, id, no: no ? +no - 10 : null, name: c.name });
}
tips.sort((a, b) => (b.name > a.name ? 1 : -1));   // newest reel first

const card = (t) => `
<article class="tip" id="${esc(t.id)}">
  <p class="no">${t.no ? `Nº ${String(t.no).padStart(2, '0')}` : 'Tip'}</p>
  <h2>${esc(t.title)}</h2>
  <p class="why">${esc(t.why)}</p>
  <div class="demo">${demos[t.id].html}</div>
  <div class="code"><pre><code>${esc(t.code)}</code></pre><button class="copy" type="button">Copy</button></div>
  <p class="links"><a href="${esc(t.source.url)}" rel="noopener">Source: ${esc(t.source.label)}</a>${t.reel ? ` · <a href="${esc(t.reel)}" rel="noopener">Watch the reel</a>` : ''}</p>
</article>`;

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Web fixes · webin20sec</title>
<meta name="description" content="Every fix from the webin20sec reels: the problem, a live demo and the code to copy.">
<meta name="theme-color" content="#0b0d14">
<link rel="icon" href="/icons/icon.svg" type="image/svg+xml">
<style>
  :root{--bg:#0b0d14;--card:#141724;--ink:#f1efe9;--mute:#9aa0b2;--line:#252a3b;--accent:#7c8cff;--ok:#6fd49a}
  *{box-sizing:border-box;margin:0}
  html{-webkit-text-size-adjust:100%}
  body{background:var(--bg);color:var(--ink);font:400 16px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif}
  .wrap{max-width:640px;margin:0 auto;padding:28px 16px 80px}
  :focus-visible{outline:3px solid var(--accent);outline-offset:2px;border-radius:8px}
  a{color:var(--accent)}
  header .handle{font:800 .95rem system-ui,sans-serif;color:var(--mute)}
  h1{font:800 2.1rem/1.05 system-ui,sans-serif;letter-spacing:-.02em;margin:8px 0 10px}
  header p{color:var(--mute)}
  .tip{margin-top:30px;padding:20px 18px;background:var(--card);border:1px solid var(--line);border-top:3px solid var(--accent);border-radius:20px}
  .no{font:800 .8rem system-ui,sans-serif;letter-spacing:.08em;color:var(--accent)}
  h2{font:800 1.45rem/1.15 system-ui,sans-serif;letter-spacing:-.01em;margin:6px 0 8px}
  .why{color:#d9d7d0}
  .demo{margin-top:16px}
  .pair{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .pane{position:relative;min-height:150px;padding-top:34px;border-radius:14px;background:#0e1019;border:1px solid var(--line);overflow:hidden}
  .tag{position:absolute;top:9px;left:10px;font:700 .72rem system-ui,sans-serif;color:var(--mute)}
  .tag.ok{color:var(--ok)}
  .play,.copy{min-height:44px;padding:0 16px;border:1.5px solid var(--line);border-radius:999px;background:transparent;color:var(--ink);font:700 .85rem system-ui,sans-serif;cursor:pointer}
  .play{margin-top:10px}
  .play:disabled{opacity:.6;cursor:default}
  .note{margin-top:8px;font-size:.82rem;color:var(--mute)}
  .code{position:relative;margin-top:14px}
  pre{overflow-x:auto;padding:48px 14px 14px;border-radius:14px;background:#0e1019;border:1px solid var(--line);font:500 .85rem/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;color:#d9d7d0}
  .copy{position:absolute;top:8px;right:8px;min-height:34px;background:var(--card)}
  .links{margin-top:12px;font-size:.85rem;color:var(--mute)}
  footer{margin-top:40px;color:var(--mute);font-size:.85rem}
${Object.entries(demos).filter(([k]) => tips.some((t) => t.id === k)).map(([, d]) => d.css.trim()).join('\n')}
</style>
</head>
<body>
<main class="wrap">
  <header>
    <p class="handle">@webin20sec</p>
    <h1>One web fix a day, in 20 seconds</h1>
    <p>Every fix from the reels, working: try the problem and the fix side by side, then copy the code.</p>
  </header>
${tips.map(card).join('\n')}
  <footer>${tips.length} fixes so far. New ones arrive with each reel on <a href="https://www.instagram.com/webin20sec/" rel="noopener">Instagram</a>.</footer>
</main>
<script>
(function(){
  var wire = {${tips.map((t) => `\n    ${JSON.stringify(t.id)}: ${demos[t.id].js}`).join(',')}
  };
  Object.keys(wire).forEach(function(id){ var root = document.getElementById(id); if (root) wire[id](root.querySelector('.demo'), root.querySelector('.play')); });
  document.querySelectorAll('.copy').forEach(function(b){ b.addEventListener('click', function(){ var t = b.previousElementSibling.textContent;
    (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function(){ b.textContent = 'Copied'; setTimeout(function(){ b.textContent = 'Copy'; }, 1600); }, function(){}); }); });
})();
</script>
</body>
</html>
`;

if (process.argv.includes('--check')) {
  if (!existsSync(out) || readFileSync(out, 'utf8') !== page) { console.error('✗ templates/tips/index.html is out of date: run node scripts/build-tips.mjs'); process.exit(1); }
  console.log(`✓ tips page up to date (${tips.length} tips)`);
} else {
  mkdirSync(dirname(out), { recursive: true }); writeFileSync(out, page); console.log(`Wrote templates/tips/index.html (${tips.length} tips)`);
}
