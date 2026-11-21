// Builds a Turns Out design-tutorial scene: template.html + core.js + <slug>.js (the concept: CSS, BOARD markup, script) -> <slug>.html,
// then inlines the web motion kit. Usage: node scripts/channel3/design/build.mjs <slug> [more slugs]
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const D = new URL('./', import.meta.url).pathname;
for (const slug of process.argv.slice(2)) {
  const src = readFileSync(D + slug + '.js', 'utf8'), part = (k) => { const m = src.match(new RegExp('/\\*' + k + ':begin\\*/([\\s\\S]*?)/\\*' + k + ':end\\*/')); return m ? m[1].trim() : ''; };
  let h = readFileSync(D + 'template.html', 'utf8').replace('/*CSS*/', () => part('css')).replace('<!--BOARD-->', () => part('board')).replace('<!--STAGE-->', () => part('stage')).replace('/*CORE*/', () => readFileSync(D + 'core.js', 'utf8')).replace('/*CONCEPT*/', () => part('script'));
  writeFileSync(D + slug + '.html', h);
  execFileSync('node', [D + '../kit-inline.mjs', D + slug + '.html'], { stdio: 'inherit' });
}
