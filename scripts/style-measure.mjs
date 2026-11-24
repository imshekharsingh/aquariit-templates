// Fill the per-reel "style" record in templates/showreels/captions.json (owner, 25 Nov 2026), so the Sunday review can rank styles.
//   node scripts/style-measure.mjs <dir> [--write] [--from YYYY-MM-DD] [--names a,b]   (dir = reel-fetch.mjs output: <name>.mp4 and <name>.json)
// Fetch first:  node scripts/reel-fetch.mjs <name> <dir>   (MP4s are kept 15 days; older ones only get what their config and text say).
// Fields (design/what-works.md "Style record"): lengthS, wordsPerS, shotChanges, hookType, look, hero, firstSecondTension, payoff, source.
// Rule: measure from the real MP4 where it exists; otherwise take it from the config / scene / review text; otherwise null. Never a guess.
//   lengthS      ffprobe duration of the MP4 (source "mp4"); without an MP4 the config's planned "dur" (source "config")
//   wordsPerS    spoken words in the voice text / lengthS (null without voice text)
//   shotChanges  jumps in the mean grey difference between frames 0.1 s apart (over 14 of 255 and 4x the median), peaks closer than 0.4 s counted once (null without an MP4)
//   hookType     first spoken sentence: "?" = question, starts with a digit or number word = number, "but|not|vs|instead|without" = contrast, else claim
//   look         mean luma of the MP4 sampled at 2 fps: under 90 (of 255) = dark, else light; without an MP4 the config palette (black/dark/ink = dark)
//   hero         tech: the topic's "gadget" (the lit hero object); web / Turns Out: null (needs a human read of the scene)
//   firstSecondTension  null unless a review file states it (a human call, never derived)
//   payoff       last spoken sentence names an action (use, set, add, turn, pick, check, keep, hide, darken, ...) = tip, else fact
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';

const args = process.argv.slice(2);
const dir = resolve(args.find(a => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--from' && args[args.indexOf(a) - 1] !== '--names') || 'reel-files');
const opt = n => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const write = args.includes('--write');
const from = opt('--from') || '2026-10-25', to = opt('--to') || '2026-11-24';
const only = opt('--names') ? opt('--names').split(',') : null;
const CAPS = 'templates/showreels/captions.json';
const caps = JSON.parse(readFileSync(CAPS, 'utf8'));

const CUT_DIFF = 14;   // mean grey-level jump (0-255) between two frames 0.1 s apart that counts as a shot change
const NUM = /^(\d|one|two|three|four|five|six|seven|eight|nine|ten|zero|half|twice)\b/i;
const ACT = /\b(use|set|add|turn|pick|check|keep|hide|darken|tap|try|switch|put|give|make|drop|stop|choose|wrap|fix|lighten|replace|swap|plug|open|clear|enable|disable)\b/i;
const sentences = t => (String(t).replace(/\s+/g, ' ').match(/[^.!?]+[.!?]*/g) || []).map(s => s.trim()).filter(Boolean);
const run = (cmd, a) => spawnSync(cmd, a, { encoding: 'utf8', maxBuffer: 1 << 26 });

function voiceText(name, cfg) {
  if (cfg && cfg.voice && cfg.voice.text) return cfg.voice.text;
  const slug = name.replace(/^showreel-tech-/, '');
  const tp = join('techreel', 'topics', `${slug}.json`);
  if (name.startsWith('showreel-tech-') && existsSync(tp)) {
    const t = JSON.parse(readFileSync(tp, 'utf8'));
    if (Array.isArray(t.lines)) return t.lines.map(l => l.text || l).join(' ');
  }
  return null;
}
function techHero(name) {
  const tp = join('techreel', 'topics', `${name.replace(/^showreel-tech-/, '')}.json`);
  if (name.startsWith('showreel-tech-') && existsSync(tp)) return JSON.parse(readFileSync(tp, 'utf8')).gadget || null;
  return null;
}
function reviewTension(name) {
  const ch = name.startsWith('showreel-tech-') ? 'tech' : name.startsWith('showreel-c3-') ? 'c3' : 'web';
  const f = join('review', ch, `${name}.md`);
  if (!existsSync(f)) return null;
  const m = readFileSync(f, 'utf8').match(/first[- ]second tension\s*[:=]\s*(yes|no)\b/i);
  return m ? m[1].toLowerCase() : null;
}
function measureMp4(mp4) {
  const pr = run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', mp4]);
  const len = parseFloat(pr.stdout);
  if (!(len > 0)) return null;
  // shot changes: mean absolute difference of consecutive 64x114 grey frames at 10 fps; a change = a jump over CUT_DIFF (and over 4x the median motion),
  // peaks closer than 0.4 s count once. Catches hard cuts, whips and wipes; a slow push or a fade inside one shot stays under it.
  const fr = spawnSync('ffmpeg', ['-v', 'error', '-i', mp4, '-vf', 'fps=10,scale=64:114,format=gray', '-an', '-f', 'rawvideo', '-'], { maxBuffer: 1 << 29 });
  const buf = fr.stdout || Buffer.alloc(0), FS = 64 * 114, n = Math.floor(buf.length / FS), diffs = [];
  for (let i = 1; i < n; i++) { let t = 0; const a0 = (i - 1) * FS, b0 = i * FS; for (let k = 0; k < FS; k++) t += Math.abs(buf[a0 + k] - buf[b0 + k]); diffs.push(t / FS); }
  const med = [...diffs].sort((x, y) => x - y)[Math.floor(diffs.length / 2)] || 0, thr = Math.max(CUT_DIFF, med * 4);
  let cuts = 0, last = -9;
  diffs.forEach((d, i) => { const t = (i + 1) / 10; if (d > thr && d >= (diffs[i - 1] || 0) && d >= (diffs[i + 1] || 0) && t - last >= 0.4) { cuts++; last = t; } });
  const lu = run('ffmpeg', ['-hide_banner', '-nostats', '-i', mp4, '-vf', 'fps=2,scale=90:-2,signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-', '-an', '-f', 'null', '-']);
  const ys = [...(lu.stdout + lu.stderr).matchAll(/YAVG=([\d.]+)/g)].map(m => +m[1]);
  const mean = ys.length ? ys.reduce((a, b) => a + b, 0) / ys.length : null;
  return { len: +len.toFixed(1), cuts, look: mean == null ? null : mean < 90 ? 'dark' : 'light' };
}

const names = Object.entries(caps).filter(([n, e]) => e && !e.hidden && !e.sample && ['web', 'tech', 'c3'].includes(e.channel)
  && e.postOn >= from && e.postOn <= to && (!only || only.includes(n))).map(([n]) => n).sort();
let measured = 0, textOnly = 0;
for (const n of names) {
  const cj = join(dir, `${n}.json`), mp = join(dir, `${n}.mp4`);
  const cfg = existsSync(cj) ? JSON.parse(readFileSync(cj, 'utf8')) : null;
  const m = existsSync(mp) ? measureMp4(mp) : null;
  const text = voiceText(n, cfg);
  const len = m ? m.len : (cfg && cfg.dur ? +cfg.dur : null);
  const ss = text ? sentences(text) : [];
  const first = ss[0] || '', lastS = ss[ss.length - 1] || '';
  let hookType = null;
  if (first) hookType = /\?\s*$/.test(first) ? 'question' : NUM.test(first) ? 'number' : /\b(but|not|vs|instead|without|never)\b/i.test(first) ? 'contrast' : 'claim';
  const pal = cfg && cfg.palette;
  const look = m ? m.look : pal ? (/^(black|dark|ink|night)$/i.test(pal) ? 'dark' : null) : null;
  const style = {
    lengthS: len,
    wordsPerS: text && len ? +(text.trim().split(/\s+/).length / len).toFixed(2) : null,
    shotChanges: m ? m.cuts : null,
    hookType,
    look,
    hero: techHero(n),
    firstSecondTension: reviewTension(n),
    payoff: lastS ? (ACT.test(lastS) ? 'tip' : 'fact') : null,
    source: m ? 'mp4' : cfg ? 'config' : 'none',
  };
  if (m) measured++; else textOnly++;
  console.log(n.padEnd(40), JSON.stringify(style));
  if (write) caps[n].style = style;
}
console.log(`${names.length} reels, ${measured} measured from the MP4, ${textOnly} from config/text only`);
if (write) { writeFileSync(CAPS, JSON.stringify(caps, null, 1) + "\n"); console.log(`wrote ${CAPS}`); }
