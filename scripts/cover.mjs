// A designed reel cover (owner, 23 Nov 2026: an automatic cover caught "7 GB" mid-count): one frame of the finished MP4, a solid band
// low in the frame and one or two big text lines on it, one of them in the accent colour. ffmpeg + the repo's Inter Display Bold
// (scripts/cover/, OFL). The recipe comes from the reel's entry in templates/showreels/captions.json:
//   "cover": { "t": 6.5, "lines": ["Your next phone", "may have LESS memory"], "accent": 1 }
//   t = seconds into the MP4 (a frame where the hook number or word is complete, never mid-count; without t the automatic time is used),
//   lines = 1 or 2 lines of at most 24 letters, accent = which line is amber (0 = first, 1 = second; leave out for all white).
// Usage:
//   node scripts/cover.mjs <mp4> <out.jpg> --reel <showreel-name> [--t-default <s>]   recipe from captions.json; no recipe = nothing written, exit 0
//   node scripts/cover.mjs <mp4> <out.jpg> --cover '<json>'                           recipe given here
//   node scripts/cover.mjs --check                                                    every recipe in captions.json is well formed (npm run check)
// The cover is written to <out.jpg> only when ffmpeg made it, so a failure (exit 1) leaves the automatic cover in place.
// In R2: bash scripts/r2.sh cover <showreel-name> ['<json>']   (Actions -> R2 -> cover).
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, renameSync, statSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FONT = join(ROOT, 'scripts/cover/InterDisplay-Bold.otf');
const CAPS = join(ROOT, 'templates/showreels/captions.json');
const W = 1080, H = 1920, BAND = { y: 1360, h: 560, colour: '0x0B0D12' }, WHITE = '0xFFFFFF', ACCENT = '0xFFB23A';
const SIZE = [88, 84], Y2 = [1440, 1555], Y1 = 1490, MAXW = 960, MAXLEN = 24;   // two lines: the owner's recipe; one line sits between them

export function problems(c) {   // -> list of what is wrong with a recipe ([] = fine)
  const p = [];
  if (!c || typeof c !== 'object' || Array.isArray(c)) return ['"cover" must be an object {"t", "lines", "accent"}'];
  if (c.t !== undefined && !(typeof c.t === 'number' && c.t >= 0 && c.t < 600)) p.push('"t" must be seconds into the reel (a number)');
  if (!Array.isArray(c.lines) || c.lines.length < 1 || c.lines.length > 2) p.push('"lines" must be 1 or 2 lines');
  else for (const l of c.lines) if (typeof l !== 'string' || !l.trim() || l.length > MAXLEN || /[\n\r]/.test(l)) p.push(`line ${JSON.stringify(l)}: 1 to ${MAXLEN} letters on one line`);
  if (c.accent !== undefined && !(Number.isInteger(c.accent) && c.accent >= 0 && c.accent < (c.lines?.length || 0))) p.push('"accent" must be 0 (first line) or 1 (second line)');
  for (const k of Object.keys(c)) if (!['t', 'lines', 'accent'].includes(k)) p.push(`unknown key "${k}"`);
  return p;
}

const args = process.argv.slice(2), opt = (k) => { const i = args.indexOf(k); return i < 0 ? undefined : args[i + 1]; };
if (args[0] === '--check') {
  const caps = JSON.parse(readFileSync(CAPS, 'utf8')); let bad = 0, n = 0;
  for (const [name, e] of Object.entries(caps)) if (e && e.cover !== undefined) { n++; for (const p of problems(e.cover)) { bad++; console.error(`captions.json ${name}: cover: ${p}`); } }
  statSync(FONT);
  console.log(`COVER CHECK: ${n} designed cover${n === 1 ? '' : 's'} in captions.json, ${bad} problem${bad === 1 ? '' : 's'}`);
  process.exit(bad ? 1 : 0);
}
const [mp4, out] = args;
if (!mp4 || !out || mp4.startsWith('--') || out.startsWith('--')) { console.error(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(6, 12).join('\n')); process.exit(2); }
let c;
if (opt('--cover')) { try { c = JSON.parse(opt('--cover')); } catch { console.error('COVER: --cover is not JSON'); process.exit(2); } }
else if (opt('--reel')) c = (JSON.parse(readFileSync(CAPS, 'utf8'))[opt('--reel')] || {}).cover;
if (c === undefined) { console.log(`COVER: no designed cover for ${opt('--reel') || 'this reel'} in captions.json; the automatic frame stays`); process.exit(0); }
const bad = problems(c); if (bad.length) { console.error('COVER: ' + bad.join('; ')); process.exit(1); }
const t = c.t ?? +(opt('--t-default') ?? 1.6);

const tmp = mkdtempSync(join(tmpdir(), 'cover-')), esc = (s) => s.replace(/\\/g, '/').replace(/([:'])/g, '\\$1');
const two = c.lines.length === 2;
const draw = c.lines.map((line, i) => {
  const f = join(tmp, `line${i}.txt`); writeFileSync(f, line.trim());
  const size = Math.min(SIZE[i], Math.floor(MAXW / (0.6 * line.trim().length)));   // a long line shrinks to stay inside the frame (Inter Display Bold: about 0.56 em a letter)
  return `drawtext=fontfile='${esc(FONT)}':textfile='${esc(f)}':fontsize=${size}:fontcolor=${c.accent === i ? ACCENT : WHITE}:x=(w-text_w)/2:y=${two ? Y2[i] : Y1}`;
});
const vf = [`scale=${W}:${H}`, `drawbox=x=0:y=${BAND.y}:w=${W}:h=${BAND.h}:color=${BAND.colour}:t=fill`, ...draw].join(',');
const part = join(tmp, 'cover.jpg');
const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', String(t), '-i', mp4, '-frames:v', '1', '-vf', vf, '-q:v', '2', part], { encoding: 'utf8' });
let size = 0; try { size = statSync(part).size; } catch {}
if (r.status !== 0 || size < 10000) { console.error(`COVER: ffmpeg did not make the cover (${(r.stderr || r.error?.message || 'empty file').trim().split('\n').pop()}); is ${t} s inside the reel?`); rmSync(tmp, { recursive: true, force: true }); process.exit(1); }
try { renameSync(part, out); } catch { writeFileSync(out, readFileSync(part)); }
rmSync(tmp, { recursive: true, force: true });
console.log(`COVER: designed cover ${out} (${size} bytes): frame at ${t} s, ${c.lines.map((l, i) => `"${l.trim()}"${c.accent === i ? ' (accent)' : ''}`).join(' / ')}`);
