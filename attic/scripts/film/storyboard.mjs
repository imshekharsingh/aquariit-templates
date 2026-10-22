// Storyboard: one image of 8 key frames for the owner to approve BEFORE a full render (owner, 15 Oct 2026: approve the look and fullness in a minute,
// not after a 20-minute render). Frames: the middle of each voice line (film/ID/voice.md) plus the timing.json peak, at most 8, each labelled with
// its time and the words spoken there. Quick: stills only, no video. Also prints the gate's fullness number per frame.
//   node scripts/film/storyboard.mjs ID [--out DIR]     -> DIR/storyboard.png (default out/storyboard/ID)
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const args = process.argv.slice(2), id = args[0], oi = args.indexOf('--out');
if (!id) { console.error('usage: node scripts/film/storyboard.mjs ID [--out DIR]'); process.exit(2); }
const OUT = oi > -1 ? args[oi + 1] : join(root, 'out', 'storyboard', id); mkdirSync(OUT, { recursive: true });
const T = JSON.parse(readFileSync(join(root, 'film', id, 'timing.json'), 'utf8'));
const vf = join(root, 'film', id, 'voice.md');
let shots = existsSync(vf) ? readFileSync(vf, 'utf8').split('\n').map((l) => l.match(/^- \[([\d.]+)-([\d.]+)\]\s+(.+)$/)).filter(Boolean)
  .map(([, a, b, text]) => ({ t: +((+a + +b) / 2).toFixed(2), text: text.trim() })) : [];
if (T.peak != null) shots.push({ t: +(+T.peak + .6).toFixed(2), text: '(the reveal)' });
if (!shots.length) shots = Array.from({ length: 8 }, (_, i) => ({ t: +((i + .5) * T.len / 8).toFixed(2), text: '' }));
shots = shots.sort((a, b) => a.t - b.t).slice(0, 8);
const r = spawnSync('node', [join(root, 'scripts/film/render-film.mjs'), id, '--stills', shots.map((s) => s.t).join(','), '--out', OUT], { encoding: 'utf8' });
if (r.status !== 0) { process.stderr.write(r.stderr || r.stdout); process.exit(1); }
const files = shots.map((s) => join(OUT, `still-A-${s.t.toFixed(2)}.png`));
const n = files.length, cols = 4, rows = Math.ceil(n / cols);
const inputs = files.flatMap((f) => ['-i', f]);
const cells = files.map((_, i) => `[${i}:v]scale=360:640,drawbox=y=ih-34:w=iw:h=34:color=black@0.6:t=fill,drawtext=text='${shots[i].t.toFixed(1)} s':x=10:y=h-24:fontsize=16:fontcolor=white[c${i}]`).join(';');
const layout = files.map((_, i) => `${(i % cols) * 364}_${Math.floor(i / cols) * 644}`).join('|');
const pads = Array.from({ length: rows * cols - n }, () => '').length;
const fc = `${cells};${files.map((_, i) => `[c${i}]`).join('')}xstack=inputs=${n}:layout=${layout}:fill=0x202020${pads ? '' : ''}[o]`;
const sheet = join(OUT, 'storyboard.png');
const f = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', fc, '-map', '[o]', '-frames:v', '1', sheet], { encoding: 'utf8' });
if (f.status !== 0) { console.error(f.stderr); process.exit(1); }
shots.forEach((s, i) => console.log(`${String(i + 1).padStart(2)}  ${s.t.toFixed(1).padStart(5)} s  ${s.text}`));
console.log('storyboard:', sheet);
