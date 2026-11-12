// Starter for a new @webin20sec reel (owner, 7 Nov 2026: premium motion by default, not hand-built per reel). Writes a working scene in
// style C, "Glass and light" (owner, 8 Nov 2026: the kit theme KM.theme('glass'), cheap glass, blur 3; rules-web.md rule 12) that uses the shared motion kit (scripts/explainer/kitmotion.js, inlined) and passes the whole Mandatory Gate and the FLOW lines out
// of the box: a phone that fills the frame from frame 0 with the broken thing already moving, the hook rising word by word over it, the
// fix typed with a caret under a code card that morphs out of the BEFORE tag, the fix line gliding into the page (sharedElement), the page
// re-themed top to bottom (wipeRestyle), a tap that squeezes the button with a ripple, a leader-line label on the result; one camera with a
// continuous drift and named moves; the safe zone, the subtitle band and the data-subject / data-band / data-hook / data-subs markers;
// window.TRANSITIONS declared by the kit, window.CUES from every move.
// Usage: node scripts/explainer/newweb.mjs <slug> "Why does your X ...?" "Sentence." "The fix: ..." "Now ..." [--out dir] [--force] [--palette name]
//   Palette (11 Nov 2026): the next after the last web reel's in captions.json (scripts/explainer/palette.mjs), written into the scene and the config.
//   Details mode (owner, 8 Nov 2026): node scripts/explainer/newweb.mjs <slug> --details [N] [--beat S] "Hook?" ["One: ..." x N "Save all N ..."]:
//   a compilation of N small UI motions (default 3, calm: one beat of S s each, default 5.5; owner, 8 Nov 2026) at real speed, then in slow
//   motion with live easing curves, and a recap grid (scripts/explainer/newdetails.mjs).
//   The sentence that says "fix" (else the middle one) starts the fix beat; the last sentence is the payoff. Then: draw the reel's own
//   broken and fixed states in .bad and .good (keep the same text in both, at most 10 px apart), write the code, fill the config's post text
//   and tip, and run preflight.mjs and stills.mjs (design/mandatory.md).
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { nextPalette } from './palette.mjs';
const here = dirname(fileURLToPath(import.meta.url)), root = join(here, '..', '..');
const args = process.argv.slice(2), flag = (f) => { const i = args.indexOf(f); if (i < 0) return null; const v = args[i + 1]; args.splice(i, 2); return v; };
const out = flag('--out') || 'scripts/explainer', force = args.includes('--force'); if (force) args.splice(args.indexOf('--force'), 1);
// --details [N]: N details (default 3; owner, 8 Nov 2026: calm by default), --beat S: seconds a detail (default 5.5)
let details = null; { const i = args.indexOf('--details'); if (i >= 0) { const v = args[i + 1]; details = /^\d+$/.test(v || '') ? +v : 3; args.splice(i, /^\d+$/.test(v || '') ? 2 : 1); } }
const beat = +(flag('--beat') || 5.5);
// the palette (rules-web.md rule 12): the next after the last web reel's, or --palette <name>
const palette = flag('--palette') || nextPalette().name;
const [slug, hook, ...sentences] = args;
if (details) { await import('./newdetails.mjs').then((m) => m.write({ root, here, out, force, slug, hook, sentences, n: details, beat, palette })); process.exit(0); }
if (!slug || !/^[a-z0-9-]+$/.test(slug) || !hook || sentences.length < 2) { console.error('usage: node scripts/explainer/newweb.mjs <slug> "Hook?" "Sentence." "The fix: ..." "Now ..." [--out dir] [--force]'); process.exit(1); }
const html = join(root, out, slug + '.html'), cfgP = join(root, out, slug + '.json');
if (!force && (existsSync(html) || existsSync(cfgP))) { console.error(`${relative(root, html)} exists (pass --force to overwrite)`); process.exit(1); }
mkdirSync(dirname(html), { recursive: true });
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const text = [hook, ...sentences].join(' '), hw = hook.split(/\s+/);
// the hook in lines of at most 3 words (58 px, 450 px wide); the last word or two in the accent colour
const lines = []; for (let i = 0; i < hw.length; i += 3) lines.push(hw.slice(i, i + 3));
const hookHtml = lines.map((l, li) => '<span class="ln">' + l.map((w, wi) => `<span${li * 3 + wi >= hw.length - 2 ? ' class="acc"' : ''}>${esc(w)}</span>`).join(' ') + '</span>').join('');
// the reel's length: the preflight voice estimate (75.5 ms a letter at the speed), its 0.6 s margin, and about 1.5 s of payoff after the voice
const speed = 1, letters = (text.match(/[A-Za-z]/g) || []).length + 4 * (text.match(/\d/g) || []).length, est = .2 + letters * .0765 / speed;
const dur = Math.ceil((est + .8 + 1.5) * 10) / 10, words = text.split(/\s+/).length;
const fixI = Math.max(1, sentences.findIndex((s) => /\bfix\b/i.test(s)) + 1 || Math.ceil((sentences.length + 1) / 2));
let page = readFileSync(join(here, 'starterweb.html'), 'utf8');
page = page.replace(/__TITLE__/g, esc(hook)).replace('__HOOK__', hookHtml).replace('__TEXT__', JSON.stringify(text)).replace('__DUR__', String(dur))
  .replace('__HOOK_N__', String(hw.length)).replace('__HOOK_LINES__', String(lines.length)).replace('__FIX_S__', String(fixI)).replace('__SLUG__', slug.toUpperCase().replace(/-/g, ' ')).replace('__PALETTE__', palette);
writeFileSync(html, page);
execFileSync('node', [join(root, 'scripts/channel3/kit-inline.mjs'), html], { stdio: 'inherit' });
const seek = relative(root, html);
// the glass theme's render: 3 motion-blur sub-frames, grain 2, no vignette (the grade does it): 15 GitHub minutes for the 21.2 s sample (rules-web.md rule 12)
const cfg = { name: `showreel-00-${slug}`, seek, dur, fps: 60, blur: 3, shutter: .45, grain: 2, vignette: false, cover: 1.6, style: 'Glass and light', palette,
  voice: { text, voice: 'af_heart', speed },
  caption: 'TODO: the caption (hook, the why in two sentences, the fix, browser support), then "Save it for ..., or send it to ...".',
  keywords: ['TODO 1', 'TODO 2', 'TODO 3', 'TODO 4', 'TODO 5', 'TODO 6'], hashtags: ['#todo1', '#todo2', '#todo3', '#todo4', '#todo5'],
  sources: [{ url: 'https://developer.mozilla.org/', note: 'TODO: the MDN page and BCD versions' }],
  tip: { title: hook, why: 'TODO', code: 'TODO', demo: slug, source: { url: 'https://developer.mozilla.org/', label: 'MDN, TODO' } } };
writeFileSync(cfgP, JSON.stringify(cfg, null, 1) + '\n');
console.log(`wrote ${seek} and ${relative(root, cfgP)}: palette ${palette}, ${dur} s, ${words} words (${(words / dur).toFixed(2)} words/s over the reel; web at most 2.6), fix beat = sentence ${fixI + 1}`);
console.log(`next: node scripts/showreel/preflight.mjs ${relative(root, cfgP)} && node scripts/showreel/stills.mjs ${relative(root, cfgP)} <out dir>`);
