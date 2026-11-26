// Starter: a new reel begins as a copy of its channel's GOLD reel (owner chat, 24 Nov 2026: reels had not improved for days; the only tech reel
// the owner liked is showreel-tech-ai-memory; from 25 Nov each daily build starts from its channel's best reel). design/gold.md says what makes
// each gold reel good, measured on its real MP4; scripts/qa/gold.json holds its LOOK numbers (Output QA LOOK compares every reel with them).
//
//   node scripts/starter.mjs tech <slug>   techkit/scenes/ai-memory-r4.html -> techkit/scenes/<slug>.html, techreel/topics/ai-memory.json
//                                          (+ the r4 preview keys) -> techreel/topics/<slug>.json
//   node scripts/starter.mjs tech3d <slug> the colour-world 3D look (design/3d-kit-phase2.md): techkit/scenes/gold3d-sample.html (world3d.js + lib3d.js) and
//                                          techreel/topics/gold3d-sample.json -> techkit/scenes/<slug>.html, techreel/topics/<slug>.json
//   node scripts/starter.mjs web <slug>    scripts/explainer/tabwiggle.html/.json -> scripts/explainer/<slug>.html/.json
//                                          (also: node scripts/explainer/newweb.mjs <slug> --gold)
//   node scripts/starter.mjs c3 <slug>     scripts/channel3/design/contrast2.js -> scripts/channel3/design/<slug>.js, scripts/channel3/grey-text.json
//                                          -> scripts/channel3/<slug>.json (then node scripts/channel3/design/build.mjs <slug>)
//   [--force] overwrites existing files.
//
// The copy keeps the gold reel's light, framing, type sizes, shot rhythm, cut kinds, motion and sound. Every place the builder may change is
// marked "CHANGE:" in the copy (the topic's words and numbers, the objects, the voice lines, the post text); everything else stays as gold
// unless the review file says why it changed. Each config gets a "_starter" block listing those places; delete it once they are done.
// It also writes the empty direction card review/<channel>/<name>.direction.md (design/direction.md): fill it BEFORE the build.
// Then: the captions.json entry, the review file, stills (tech: KIT_Q=0.5 python3 techkit/make.py <slug> --fake-vo --stills ...; web and
// Turns Out: node scripts/showreel/stills.mjs <config>), ONE render, Output QA (LOOK vs gold), python3 scripts/qa/side-by-side.py for the critic.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cardTemplate, cardPath } from './direction.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2), force = args.includes('--force');
const [ch, slug] = args.filter((a) => !a.startsWith('--'));
if (!['tech', 'tech3d', 'web', 'c3'].includes(ch) || !/^[a-z0-9-]{2,40}$/.test(slug || '')) {
  console.error('usage: node scripts/starter.mjs tech|tech3d|web|c3 <slug> [--force]'); process.exit(1);
}
const rd = (p) => readFileSync(join(root, p), 'utf8');
const put = (p, s) => {
  if (existsSync(join(root, p)) && !force) { console.error(`${p} exists (pass --force to overwrite)`); process.exit(1); }
  writeFileSync(join(root, p), s); console.log('wrote', p);
};
// insert a CHANGE note before an anchor that must exist exactly once (a gold file that moved on fails loudly here, not silently)
const mark = (src, anchor, note, file) => {
  const i = src.indexOf(anchor);
  if (i < 0 || src.indexOf(anchor, i + 1) >= 0) { console.error(`starter: anchor not found once in ${file}: ${anchor.slice(0, 60)}`); process.exit(1); }
  return src.slice(0, i) + note + src.slice(i);
};
const gold = { name: { tech: 'showreel-tech-ai-memory', tech3d: 'showreel-tech-gold3d-sample', web: 'showreel-46-tabwiggle', c3: 'showreel-c3-grey-text' }[ch] };   // = scripts/qa/gold.json
const TODO = 'CHANGE: ';

if (ch === 'tech') {
  const F = 'techkit/scenes/ai-memory-r4.html'; let h = rd(F);
  h = h.replace(/<title>[^<]*<\/title>/, `<title>${slug}</title>`);
  h = mark(h, '<!-- PREVIEW STUDY r4', `<!-- STARTER (node scripts/starter.mjs tech ${slug}) from the GOLD tech reel ${gold.name} (design/gold.md "Tech").
     Keep: the ink background (#07080c), one lit hero object low and large, the empty top band for ONE bold word or number at a time (white,
     amber for the change, cyan for the payoff), 7 shots of 3-5 s with a different cut kind each (CUTS), a slow push under every hold, motion
     blur, the caption plate at y 1448. Change only the places marked "${TODO}" below: the objects (the worlds), the bold words and numbers
     (typeLayer), the hook's story motion (LEAVE / count) and the phone screen card. Output QA LOOK compares the render with gold. -->
`, F);
  h = mark(h, '// ---------- the worlds', `// ${TODO}the objects. One world per shot (A hero, B line-up, C a big place, D a macro, E the hero's inside, F a corridor or wide, G the hero
// again for the loop). Swap the phone, chips and racks for this topic's objects; keep each world dark around one lit subject, in its own place.
`, F);
  h = mark(h, "// the phone's screen", `// ${TODO}the screen card text (the payoff number on the hero's screen).
`, F);
  h = mark(h, '// hook: four chips leave', `// ${TODO}the hook's story motion: what happens to the hero in the first 2 s (here chips fly out while the count drops).
`, F);
  h = mark(h, '// ---------- type: one bold word', `// ${TODO}the words and numbers in typeLayer: one per shot, on its cue word (C.<cue> from the topic's "cues"); sizes 168-320 px, y 470-540.
`, F);
  put(`techkit/scenes/${slug}.html`, h);
  const t = JSON.parse(rd('techreel/topics/ai-memory.json')), r4 = JSON.parse(rd('techreel/previews/ai-memory-r4.json'));
  const out = {
    slug, engine: 'kit', scene: `techkit/scenes/${slug}.html`, topic: `${TODO}one line: the topic`,
    _starter: {
      gold: gold.name, from: ['techkit/scenes/ai-memory-r4.html', 'techreel/topics/ai-memory.json', 'techreel/previews/ai-memory-r4.json'],
      change: ['topic', 'format', 'gadget', 'device', 'lines (7 lines, one per shot: question, problem, why, number, step, surprise, takeaway)', 'cues (words the scene keys on)',
        'sfx (cue names)', 'post (title, caption, keywords, hashtags, sources)', 'qa.sync (the bold words)', 'qa.edges_ok (full-bleed shots, by time)', 'the CHANGE: places in the scene'],
      keep: 'voice, speed, gap, max_end, cutsound, fps, the scene outside its CHANGE: places',
    },
    format: t.format, audience: t.audience, gadget: t.gadget, device: t.device,
    voice: t.voice, speed: t.speed, max_speed: t.max_speed, gap: t.gap, max_end: t.max_end,
    lines: t.lines.map((l) => ({ ...l, text: `${TODO}${l.text}` })), cues: t.cues, sfx: t.sfx, cutsound: r4.cutsound,
    post: { ...t.post, title: `${TODO}${t.post.title}`, caption: `${TODO}${t.post.caption}` },
    qa: r4.qa, say: t.say, fps: t.fps,
  };
  put(`techreel/topics/${slug}.json`, JSON.stringify(out, null, 1) + '\n');
}

if (ch === 'tech3d') {
  const F = 'techkit/scenes/gold3d-sample.html'; let h = rd(F);
  h = h.replace(/<title>[^<]*<\/title>/, `<title>${slug}</title>`);
  h = mark(h, '<!-- 3D KIT GOLD (render v5', `<!-- STARTER (node scripts/starter.mjs tech3d ${slug}) from the tech 3D gold ${gold.name} render v5 (design/gold.md "Tech, the colour-world 3D look"; critic READY 26 Nov 2026). Keep: the stage,
     the neutral dark world and its blurred props, depth of field that follows the hero, contact shadows, glowing cables, the captions, the camera path method.
     Change only the places marked "${TODO}" below: the objects (apps, tools, hub, figures), the cables, the camera keys, the cue-driven timing.
     Rules (design/rules-tech.md D1-D8): frame 0 is the hook (busy picture + question or number), 3 distinct camera moves and a loop home, no framing over 3 s,
     cables end on tile side edges (never across a name), names never repeat, numbers ride the camera, captions on the dark fade, payoff held to the last frame, lines 6-9 words, aiLabel false.
     Critic lessons v3-v5 (techkit/README.md "3D colour-world kit"): nothing in front of the hero row may hide a middle object (check the hub against the apps, not only the wall); a close
     shot keeps every name whole; the opening moves within 3 s too; the last 2 s need an event; when a new item joins, the number on screen agrees with the picture; glow stays calm
     (bloom about .28, thin halos); give every tile its own icon; a daily reel is 20-35 s and carries one readable artifact (34 px+) in its own space. Keep window.__dbg current and
     copy techkit/check-gold3d.cjs for a no-render check of names, covers and cables. -->
`, F);
  put(`techkit/scenes/${slug}.html`, h);
  const t = JSON.parse(rd('techreel/topics/gold3d-sample.json'));
  const out = { ...t, slug, scene: `techkit/scenes/${slug}.html`, topic: `${TODO}one line: the topic`,
    _starter: { gold: gold.name, from: ['techkit/scenes/gold3d-sample.html', 'techreel/topics/gold3d-sample.json'],
      change: ['topic', 'format', 'gadget', 'device', 'lines (3-5 lines, one idea each)', 'cues (words the scene keys on)', 'sfx (cue names)', 'post (title, caption, keywords, hashtags, sources)', 'qa.edges_ok', 'the CHANGE: places in the scene (objects, cables, camera keys)'],
      keep: 'look "3d", voice, speed, gap, the world, light, DOF, captions, the scene outside its CHANGE: places' },
    lines: t.lines.map((l) => ({ ...l, text: `${TODO}${l.text}` })), post: { ...t.post, title: `${TODO}${t.post.title}`, caption: `${TODO}${t.post.caption}` } };
  put(`techreel/topics/${slug}.json`, JSON.stringify(out, null, 1) + '\n');
}

if (ch === 'web') {
  const F = 'scripts/explainer/tabwiggle.html'; let h = rd(F);
  h = mark(h, '<div id="vp"', `<!-- STARTER (node scripts/starter.mjs web ${slug}) from the GOLD web reel ${gold.name} (design/gold.md "Web"). Keep: the black look
     (KM.black, one accent), the label row + hook top-left (54 px, last word in the accent), the subtitles under it (30 px), the phone hero
     filling y 390-836 with the bug happening by 0.5 s and again before 2 s, the reaction words, the meter (72 px numbers), the code card that
     takes the hook's place, one still camera. Change only the "${TODO}" places: the phone's content (#bad / #good), the hook words, the
     code, the reaction words, the meter labels and the voice text (TEXT here and voice.text in the config, the same words). -->
<!-- ${TODO}the phone's content: draw this topic's broken (#bad) and fixed (#good) state; keep #ph, #scr, #hud and their boxes. -->
`, F);
  h = mark(h, '<div id="lbl"', `<!-- ${TODO}the label (Nº and topic), the hook words, the width picture (#wide: this topic's measurement), the payoff label (#lab), the reaction words (.rx). -->
`, F);
  h = mark(h, '  var TEXT = ', `  // ${TODO}TEXT = the config's voice.text, word for word.
`, F);
  h = mark(h, '  // the code: the hidden bold copy', `  // ${TODO}CODE = this fix's code (2 lit lines, the rest dim).
`, F);
  h = mark(h, '  // the tabs: real widths', `  // ${TODO}the demo's own logic below (here: tab widths, taps, wiggles). Keep the bug times (KM.bugs: first by 0.6 s, again before 2 s).
`, F);
  h = h.replace(/<title>[^<]*<\/title>/, `<title>${TODO}hook</title>`);
  put(`scripts/explainer/${slug}.html`, h);
  const c = JSON.parse(rd('scripts/explainer/tabwiggle.json'));
  const keep = ['dur', 'fps', 'blur', 'shutter', 'grain', 'vignette', 'cover', 'palette', 'voice', 'qa', 'caption', 'keywords', 'hashtags', 'sources'];
  const out = { name: `showreel-NN-${slug}`, seek: `scripts/explainer/${slug}.html`,
    _starter: { gold: gold.name, from: ['scripts/explainer/tabwiggle.html', 'scripts/explainer/tabwiggle.json'],
      change: ['name (next Nº)', 'style (one line: this reel)', 'voice.text (= TEXT in the scene)', 'qa.focus boxes if the demo moved', 'qa.mute "say" words', 'caption, keywords, hashtags, sources', 'the CHANGE: places in the scene', 'scripts/qa/demo-hues.json line after the render'],
      keep: 'dur near 15 s, fps 60, blur, shutter, grain, palette black, the scene outside its CHANGE: places' },
    style: `${TODO}one line`, ...Object.fromEntries(keep.filter((k) => k in c).map((k) => [k, c[k]])) };
  out.voice = { ...c.voice, text: `${TODO}${c.voice.text}` }; out.caption = `${TODO}${c.caption}`;
  put(`scripts/explainer/${slug}.json`, JSON.stringify(out, null, 1) + '\n');
}

if (ch === 'c3') {
  const F = 'scripts/channel3/design/contrast2.js'; let s = rd(F);
  s = mark(s, '/*css:begin*/', `/* STARTER (node scripts/starter.mjs c3 ${slug}) from the GOLD Turns Out reel ${gold.name} (design/gold.md "Turns Out"), on the design engine
   (template.html + core.js; node scripts/channel3/design/build.mjs ${slug}). Keep: the dark café stage, one artboard (the "board") at
   x 66-474 / y 396-764 that changes in place, the title line top-left with the accent word, the numbered fix chips (FIX n OF 3), one change
   per spoken sentence, the before thumbnail + after on the last 3 s. Change only the "${TODO}" places: the board's content (this topic's
   design), the before mistake, the three fixes in the script, the check chip. */
/* ${TODO}the board's CSS (sizes of this topic's design). */
`, F);
  s = mark(s, '/*board:begin*/', `/* ${TODO}the board markup: this topic's design as a believable first draft (rules-c3.md B1-B2). */
`, F);
  s = mark(s, '/*script:begin*/', `/* ${TODO}the three fixes: each lands on its spoken sentence (rules-c3.md V1-V3; critic D2). */
`, F);
  put(`scripts/channel3/design/${slug}.js`, s);
  const c = JSON.parse(rd('scripts/channel3/grey-text.json'));
  const out = { ...c, name: `showreel-c3-${slug}`, seek: `scripts/channel3/${slug}.html`,
    _starter: { gold: gold.name, from: ['scripts/channel3/design/contrast2.js', 'scripts/channel3/grey-text.json'],
      change: ['voice.text (spoken sentences, a breath after each: rules-c3.md V1-V3)', 'before.mistake and before.source', 'caption, keywords, hashtags, sources', 'qa.subject if the board moved', 'note', 'the CHANGE: places in the concept file'],
      keep: 'engine design, dt 2, fps, blur, shutter, grain, the stage and the board box' } };
  out.voice = { ...c.voice, text: `${TODO}${c.voice.text}` }; out.before = { mistake: `${TODO}${c.before.mistake}`, source: c.before.source };
  out.caption = `${TODO}${c.caption}`; delete out.note;
  put(`scripts/channel3/${slug}.json`, JSON.stringify(out, null, 1) + '\n');
}
// the direction card (owner, 24 Nov 2026; design/direction.md): filled BEFORE the build, approved with the stills
{ const name = ch === 'tech' || ch === 'tech3d' ? `showreel-tech-${slug}` : ch === 'c3' ? `showreel-c3-${slug}` : `showreel-NN-${slug}`;
  put(cardPath(ch === 'tech3d' ? 'tech' : ch, name), cardTemplate(ch === 'tech3d' ? 'tech' : ch, name));
  if (ch === 'web') console.log(`  (web: rename ${cardPath(ch, name)} with the reel's Nº once it has one)`); }
console.log(`starter: ${ch} ${slug} from gold ${gold.name}. Fill every "CHANGE:" (grep -n CHANGE: on the new files), delete "_starter", then the captions.json entry and review file.`);
