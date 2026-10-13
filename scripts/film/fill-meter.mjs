// Fill meter: how much of the 9:16 frame do the stills actually use? (owner, 13 Oct 2026: "content feels forced into the centre")
//   node scripts/film/fill-meter.mjs DIR            reads DIR/still-*.png (render-film.mjs --stills), prints one line per still and a verdict
// Per still: the ground colour (median of the border), a content mask (pixels clearly different from the ground, after downscaling so dust and grain vanish),
// then coverage (% of the frame with content), the content's bounding box (width and height as % of the frame) and the centre of mass.
// A frame is TIGHT when its content box is narrower than 75% of the width or shorter than 55% of the height: the shot is a small island in the middle.
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const dir = process.argv[2];
if (!dir) { console.error('usage: fill-meter.mjs DIR'); process.exit(2); }
const W = 67, H = 119;                                                    // 1 px = 6 css px of the 402x715 frame
const files = readdirSync(dir).filter((f) => /^still-.*\.png$/.test(f)).sort((a, b) => parseFloat(a.split('-').pop()) - parseFloat(b.split('-').pop()));
let tight = 0;
for (const f of files) {
  const r = spawnSync('ffmpeg', ['-loglevel', 'error', '-i', join(dir, f), '-vf', `scale=${W}:${H}:flags=area`, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], { maxBuffer: 1 << 24 });
  const px = r.stdout; if (!px || px.length < W * H * 3) { console.log(f, 'unreadable'); continue; }
  const at = (x, y) => { const i = (y * W + x) * 3; return [px[i], px[i + 1], px[i + 2]]; };
  const border = []; for (let x = 0; x < W; x++) { border.push(at(x, 0), at(x, H - 1)); } for (let y = 0; y < H; y++) { border.push(at(0, y), at(W - 1, y)); }
  const med = [0, 1, 2].map((c) => border.map((p) => p[c]).sort((a, b) => a - b)[Math.floor(border.length / 2)]);
  let n = 0, x0 = W, x1 = -1, y0 = H, y1 = -1, sx = 0, sy = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const p = at(x, y), d = Math.hypot(p[0] - med[0], p[1] - med[1], p[2] - med[2]);
    if (d > 34) { n++; sx += x; sy += y; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  }
  const cov = (100 * n / (W * H)), bw = x1 < 0 ? 0 : 100 * (x1 - x0 + 1) / W, bh = y1 < 0 ? 0 : 100 * (y1 - y0 + 1) / H;
  const isTight = bw < 75 || bh < 55; if (isTight) tight++;
  const t = f.replace(/^still-[A-Z]-/, '').replace('.png', '');
  console.log(`${t.padStart(6)}s  cover ${cov.toFixed(0).padStart(3)}%  box ${bw.toFixed(0).padStart(3)}% x ${bh.toFixed(0).padStart(3)}%  centre ${n ? (100 * sx / n / W).toFixed(0) : '-'}%,${n ? (100 * sy / n / H).toFixed(0) : '-'}%${isTight ? '   TIGHT (small island in the middle: make the subject bigger, let it bleed off an edge, or fill the ground)' : ''}`);
}
console.log(`\n${tight} of ${files.length} frames are tight.` + (tight > files.length / 3 ? ' Use the frame: see "Use the whole frame" in design/film-playbook.md.' : ' Frame use: OK.'));
