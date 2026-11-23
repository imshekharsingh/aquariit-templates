// Builds a Turns Out design-tutorial scene: template.html + core.js + <slug>.js (the concept: CSS, BOARD markup, script) -> <slug>.html,
// then inlines the web motion kit. Usage: node scripts/channel3/design/build.mjs <slug> [more slugs]
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const D = new URL('./', import.meta.url).pathname;
const COPIES = { spacing: 'menu-spacing.html', expensive: 'looks-expensive.html', optical: 'optical-centre.html', myth: 'stop-centring.html', fixit: 'fix-invite.html', photo: 'text-on-photo.html', thumb: 'tap-targets.html', resume: 'resume.html', measure: 'line-length.html', group: 'event-poster.html', caps: 'all-caps.html', leading: 'line-spacing.html', contrast: 'grey-text.html', prices: 'price-list.html', card: 'card-margins.html', resume2: '../previews/c3-resume2.html', contrast2: '../previews/c3-greytext2.html' };   // scene -> scripts/channel3/<copy> (showreel-c3-menu-spacing, the reference cut)
for (const slug of process.argv.slice(2)) {
  const src = readFileSync(D + slug + '.js', 'utf8'), part = (k) => { const m = src.match(new RegExp('/\\*' + k + ':begin\\*/([\\s\\S]*?)/\\*' + k + ':end\\*/')); return m ? m[1].trim() : ''; };
  let h = readFileSync(D + 'template.html', 'utf8').replace('/*CSS*/', () => part('css')).replace('<!--BOARD-->', () => part('board')).replace('<!--STAGE-->', () => part('stage')).replace('/*CORE*/', () => readFileSync(D + 'core.js', 'utf8')).replace('/*CONCEPT*/', () => part('script'));
  writeFileSync(D + slug + '.html', h);
  execFileSync('node', [D + '../kit-inline.mjs', D + slug + '.html'], { stdio: 'inherit' });
  // a finished reel made from this scene keeps a copy next to its config (the stills and gate tools read the scene beside the config)
  for (const [scene, copy] of Object.entries(COPIES)) if (scene === slug) writeFileSync(D + '../' + copy, readFileSync(D + slug + '.html', 'utf8'));
}
