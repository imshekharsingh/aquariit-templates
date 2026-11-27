// Reference vs our reel, measured (task 9, owner 26 Nov 2026: "reference work must show in the reels and in the numbers").
// From our final MP4 and the reference clip it measures, for each: picture changes (cuts or big changes) per 10 s and the average time between
// them, words on screen per beat (a beat = the stretch between two big changes; tesseract reads a frame every 0.5 s), how often a number on
// screen changes (per 10 s), the longest still stretch, and the number of distinct colours. It prints both rows and the gap in plain words
// ("ours changes every 2.4 s, the reference every 1.0 s"); the line starting "REF COMPARE:" goes into the reel's review file.
//   node scripts/ref-compare.mjs <our.mp4 | reel name> <reference.mp4 | app reference id>
//   names and ids are fetched from the app when BASIC_AUTH_USER / BASIC_AUTH_PASS are set (the "Ref compare" workflow does this on GitHub).
// Needs ffmpeg; tesseract is optional (without it the words and numbers columns say "not read").
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const FPS = 10, W = 90, H = 160;
// ---------- the measures (pure; scripts/qa/ref-compare-test.mjs runs them) ----------
// grey: array of Uint8Array frames (W*H), rgb: array of Uint8Array frames (W*H*3), words: [{ t, n, nums }] OCR samples
export function measure(grey, rgb, words, fps = FPS) {
  const n = grey.length, dur = n / fps, d = [];
  for (let i = 1; i < n; i++) { let s = 0; const a = grey[i], b = grey[i - 1]; for (let k = 0; k < a.length; k++) s += Math.abs(a[k] - b[k]); d.push(s / a.length); }
  const cuts = []; for (let i = 0; i < d.length; i++) if (d[i] > 14 && (i === 0 || d[i] > 2 * (d[i - 1] + 1)) && (!cuts.length || i - cuts[cuts.length - 1] >= 3)) cuts.push(i);   // a big one-step change, at most one per 0.3 s
  let still = 0, run = 0; for (const x of d) { run = x < 1.2 ? run + 1 : 0; if (run > still) still = run; }
  const hue = new Map(); let lit = 0;
  for (let f = 0; f < rgb.length; f += Math.max(1, Math.round(fps / 2))) { const p = rgb[f];
    for (let k = 0; k < p.length; k += 3) { const r = p[k] / 255, g = p[k + 1] / 255, b = p[k + 2] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b);
      if (mx < .3 || mx - mn < .3 * mx) continue; lit++; let h = mx === r ? ((g - b) / (mx - mn)) % 6 : mx === g ? (b - r) / (mx - mn) + 2 : (r - g) / (mx - mn) + 4; h = Math.floor(((h * 60 + 360) % 360) / 30); hue.set(h, (hue.get(h) || 0) + 1); } }
  const colours = [...hue.values()].filter((v) => v > .04 * lit).length;   // 30-degree hue groups that hold at least 4 % of the coloured pixels
  let wpb = null, numMoves = null;
  if (words && words.length) { const edges = [0, ...cuts.map((i) => (i + 1) / fps), dur]; const per = [];
    for (let k = 0; k < edges.length - 1; k++) { const w = words.filter((x) => x.t >= edges[k] && x.t < edges[k + 1]); if (w.length) per.push(Math.max(...w.map((x) => x.n))); }
    wpb = per.length ? per.reduce((a, b) => a + b, 0) / per.length : 0;
    let mv = 0; for (let k = 1; k < words.length; k++) if (words[k].nums !== words[k - 1].nums && (words[k].nums || words[k - 1].nums)) mv++;
    numMoves = (mv * 10) / dur; }
  return { dur, changesPer10: (cuts.length * 10) / dur, every: cuts.length ? dur / (cuts.length + 1) : dur, stillS: still / fps, colours, wordsPerBeat: wpb, numberMovesPer10: numMoves };
}
const f1 = (x) => (x == null ? 'not read' : (Math.round(x * 10) / 10).toString());
export function gapLines(ours, ref) {
  const out = [], rel = (a, b, more, less) => (a > b * 1.25 ? more : a < b / 1.25 ? less : null);
  out.push(`ours changes every ${f1(ours.every)} s, the reference every ${f1(ref.every)} s` + (rel(ours.every, ref.every, ' (ours is slower)', ' (ours is faster)') || ''));
  out.push(`longest still stretch: ours ${f1(ours.stillS)} s, the reference ${f1(ref.stillS)} s`);
  if (ours.wordsPerBeat != null && ref.wordsPerBeat != null) out.push(`words on screen per beat: ours ${f1(ours.wordsPerBeat)}, the reference ${f1(ref.wordsPerBeat)}` + (rel(ours.wordsPerBeat, ref.wordsPerBeat, ' (ours says more per beat)', ' (ours says less per beat)') || ''));
  if (ours.numberMovesPer10 != null && ref.numberMovesPer10 != null) out.push(`a number on screen changes ${f1(ours.numberMovesPer10)} times per 10 s in ours, ${f1(ref.numberMovesPer10)} in the reference`);
  out.push(`colours: ours ${ours.colours}, the reference ${ref.colours}`);
  return out;
}
// ---------- reading a video ----------
function frames(mp4, fmt) { const px = fmt === 'gray' ? 1 : 3;
  const r = spawnSync('ffmpeg', ['-v', 'error', '-i', mp4, '-vf', `fps=${FPS},scale=${W}:${H}:flags=area`, '-f', 'rawvideo', '-pix_fmt', fmt === 'gray' ? 'gray' : 'rgb24', '-'], { maxBuffer: 1 << 30 });
  if (r.status) throw new Error('ffmpeg could not read ' + mp4); const b = r.stdout, sz = W * H * px, out = []; for (let o = 0; o + sz <= b.length; o += sz) out.push(new Uint8Array(b.subarray(o, o + sz))); return out; }
function ocr(mp4) {
  if (spawnSync('which', ['tesseract']).status) return null;
  const dir = mkdtempSync(join(tmpdir(), 'refcmp-')); spawnSync('ffmpeg', ['-v', 'error', '-i', mp4, '-vf', 'fps=2,scale=720:-2', join(dir, 'f%04d.png')]);
  return readdirSync(dir).filter((f) => f.endsWith('.png')).sort().map((f, i) => { const t = spawnSync('tesseract', [join(dir, f), '-', '--psm', '11'], { encoding: 'utf8' }).stdout || '';
    const ws = t.split(/\s+/).filter((w) => /[A-Za-z0-9]{2,}/.test(w)); return { t: i / 2, n: ws.length, nums: (t.match(/\d[\d.,%x×]*/g) || []).join(' ') }; });
}
async function fetchTo(url, out, cookie) { const r = await fetch(url, { headers: { Cookie: cookie } }); if (!r.ok) throw new Error(`${url}: ${r.status}`); writeFileSync(out, Buffer.from(await r.arrayBuffer())); return out; }
async function main() {
  const [a, b] = process.argv.slice(2); if (!a || !b) { console.error('Usage: node scripts/ref-compare.mjs <our.mp4 | reel name> <reference.mp4 | app reference id>'); process.exit(2); }
  let ours = a, ref = b;
  if (!existsSync(a) || !existsSync(b)) { const { BASIC_AUTH_USER: u, BASIC_AUTH_PASS: p } = process.env, SITE = (process.env.SITE_BASE || 'https://templates.aquariit.com').replace(/\/$/, '');
    if (!u || !p) { console.error('✗ a reel name or reference id needs BASIC_AUTH_USER / BASIC_AUTH_PASS (run the "Ref compare" workflow)'); process.exit(1); }
    const lg = await fetch(SITE + '/login', { method: 'POST', redirect: 'manual', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ username: u, password: p }) });
    const cookie = (lg.headers.getSetCookie?.() || [lg.headers.get('set-cookie') || '']).map((c) => c.split(';')[0]).filter(Boolean).join('; '), dir = mkdtempSync(join(tmpdir(), 'refget-'));
    if (!existsSync(a)) ours = await fetchTo(`${SITE}/reels/${a.replace(/\.mp4$/, '')}.mp4`, join(dir, 'ours.mp4'), cookie);
    if (!existsSync(b)) ref = await fetchTo(`${SITE}/api/refs/${encodeURIComponent(b)}/file`, join(dir, 'ref.mp4'), cookie); }
  const mo = measure(frames(ours, 'gray'), frames(ours, 'rgb'), ocr(ours)), mr = measure(frames(ref, 'gray'), frames(ref, 'rgb'), ocr(ref));
  const row = (n, m) => `${n.padEnd(10)} ${f1(m.dur).padStart(5)} s | changes per 10 s ${f1(m.changesPer10).padStart(4)} | every ${f1(m.every)} s | still ${f1(m.stillS)} s | words per beat ${f1(m.wordsPerBeat)} | number moves per 10 s ${f1(m.numberMovesPer10)} | colours ${m.colours}`;
  console.log(row('ours', mo)); console.log(row('reference', mr));
  const g = gapLines(mo, mr); g.forEach((l) => console.log('- ' + l)); console.log('REF COMPARE: ' + g.join('; '));
  if (process.env.GITHUB_STEP_SUMMARY) writeFileSync(process.env.GITHUB_STEP_SUMMARY, '### Ref compare: ' + a + ' vs reference ' + b + '\n' + [row('ours', mo), row('reference', mr)].map((l) => '    ' + l).join('\n') + '\n\n' + g.map((l) => '- ' + l).join('\n') + '\n', { flag: 'a' });
}
if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => { console.error('✗ ' + e.message); process.exit(1); });
