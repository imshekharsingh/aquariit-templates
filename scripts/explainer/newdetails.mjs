// The "details" format for @webin20sec (owner, 8 Nov 2026): node scripts/explainer/newweb.mjs <slug> --details N "Hook?" ["One: ..." x N "Save ..."]
// writes a working multi-beat scene from scripts/explainer/starterdetails.html: a hook beat over the first detail already running (result
// first), N detail beats (numbered eyebrow, three-word title with one accent word, the component in slow motion, its CSS typed underneath, the
// easing curve drawn live with a riding dot, a spec chip, a speed badge, the segmented part bar), and a recap grid with all N at full speed.
// It passes the whole Mandatory Gate and FLOW as written (design/mandatory.md). The components come from the starter's KINDS library
// (copy, toggle, toast, stepper, like; N > 5 repeats them): edit DETAILS (kind, title, acc) and add the reel's own kinds, with their real CSS.
// Sentences: give N + 1 after the hook (one per detail, then the recap line), or none for the kinds' defaults ("One: the copy button ...").
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname, relative } from 'node:path';

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
export function write({ root, here, out, force, slug, hook, sentences, n }) {
  if (!slug || !/^[a-z0-9-]+$/.test(slug) || !hook || !(n >= 2 && n <= 6) || (sentences.length && sentences.length !== n + 1)) {
    console.error('usage: node scripts/explainer/newweb.mjs <slug> --details N(2-6) "Hook?" ["One: ..." (N of them) "Save all N ..."] [--out dir] [--force]'); process.exit(1); }
  const html = join(root, out, slug + '.html'), cfgP = join(root, out, slug + '.json');
  if (!force && (existsSync(html) || existsSync(cfgP))) { console.error(`${relative(root, html)} exists (pass --force to overwrite)`); process.exit(1); }
  mkdirSync(dirname(html), { recursive: true });
  let page = readFileSync(join(here, 'starterdetails.html'), 'utf8');
  // the kinds and their default sentences, read from the starter's KINDS library (one source)
  const kinds = [...page.matchAll(/^\s{4}(\w+): \{ title: (\[[^\]]*\]), acc: (\d), say: '([^']*)'/gm)].map((m) => ({ kind: m[1], say: m[4] }));
  const picked = Array.from({ length: n }, (_, i) => kinds[i % kinds.length]);
  const say = sentences.length ? sentences : [...picked.map((k, i) => `${WORDS[i + 1][0].toUpperCase() + WORDS[i + 1].slice(1)}: ${k.say}`), `Save all ${WORDS[n]} for your next app.`];
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const text = [hook, ...say].join(' '), hw = hook.split(/\s+/);
  // the hook in lines of at most 16 letters; two lines at 48 px, three at 40 px (Sora, the glass theme's face, is wider); the last word in the accent colour
  const lines = []; for (const w of hw) { const l = lines[lines.length - 1]; if (l && (l.join(' ') + ' ' + w).length <= 16) l.push(w); else lines.push([w]); }
  if (lines.length > 3) { console.error(`the hook needs ${lines.length} lines (at most 3 of 16 letters): shorten it`); process.exit(1); }
  let wi = 0; const hookHtml = lines.map((l) => '<span class="ln">' + l.map((w) => `<span${wi++ === hw.length - 1 ? ' class="acc"' : ''}>${esc(w)}</span>`).join(' ') + '</span>').join('');
  // the length: the preflight voice estimate (75.5 ms a letter at the speed), its margin, and about 2 s of recap after the voice
  const speed = .9, letters = (text.match(/[A-Za-z]/g) || []).length + 4 * (text.match(/\d/g) || []).length, est = .2 + letters * .0765 / speed;
  const dur = Math.ceil((est + .8 + 2) * 10) / 10, words = text.split(/\s+/).length;
  const recap = { eyebrow: `RECAP · ALL ${n} AT 1×`, title: ['All', WORDS[n], 'together'], acc: 1 };
  page = page.replace(/__TITLE__/g, esc(hook)).replace('__HOOK__', hookHtml).replace('__HOOK_FS__', lines.length > 2 ? '40' : '48').replace('__TEXT__', JSON.stringify(text))
    .replace('__DUR__', String(dur)).replace('__HOOK_N__', String(hw.length)).replace('__DETAILS__', JSON.stringify(picked.map((k) => ({ kind: k.kind }))))
    .replace('__RECAP__', JSON.stringify(recap));
  writeFileSync(html, page);
  execFileSync('node', [join(root, 'scripts/channel3/kit-inline.mjs'), html], { stdio: 'inherit' });
  const seek = relative(root, html);
  // the glass theme's render: 3 motion-blur sub-frames, grain 2, no vignette (the grade does it): about 25 GitHub minutes for 20 s (rules-web.md rule 12)
  const cfg = { name: `showreel-00-${slug}`, seek, dur, fps: 60, blur: 3, shutter: .45, grain: 2, vignette: false, cover: 1.2, style: 'Glass and light',
    voice: { text, voice: 'af_heart', speed },
    experiment: { id: 'details-format', change: 'slow-mo motion details compilation', vs: 'median' },
    caption: `TODO: the caption (the hook, one line per detail with its CSS property, browser support), then "Save it for your next app, or send it to a designer friend."`,
    keywords: ['TODO 1', 'TODO 2', 'TODO 3', 'TODO 4', 'TODO 5', 'TODO 6'], hashtags: ['#todo1', '#todo2', '#todo3', '#todo4', '#todo5'],
    sources: [{ url: 'https://developer.mozilla.org/', note: 'TODO: one MDN page + BCD versions per detail' }],
    tip: { title: hook, why: 'TODO', code: 'TODO', demo: slug, source: { url: 'https://developer.mozilla.org/', label: 'MDN, TODO' } } };
  writeFileSync(cfgP, JSON.stringify(cfg, null, 1) + '\n');
  console.log(`wrote ${seek} and ${relative(root, cfgP)}: ${dur} s, ${words} words (${(words / dur).toFixed(2)} words/s over the reel; web at most 2.6), ${n} details: ${picked.map((k) => k.kind).join(', ')}`);
  console.log(`next: edit DETAILS / KINDS (titles, components, real CSS), then node scripts/showreel/preflight.mjs ${relative(root, cfgP)} && node scripts/showreel/stills.mjs ${relative(root, cfgP)} <out dir>`);
}
