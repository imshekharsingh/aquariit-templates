// Film renderer: turns a template into a directed 9:16 film (virtual camera, beat-locked type, motion blur, original score) instead of a screen recording.
//   node scripts/film/render-film.mjs ID [--variant A|B|both] [--out DIR] [--sub 4] [--shutter .5] [--workers 3] [--frames a-b] [--stills t1,t2,...] [--no-audio] [--crf 16]
// Needs film/ID/{story.js,timing.json,audio.mjs}. Every frame is a pure function of the film time, so output is exact and repeatable (no real-time capture).
// Motion blur = SUB sub-frames per output frame spread over a 180-degree shutter, averaged by ffmpeg (tmix).
import { readFileSync, existsSync, readdirSync, mkdirSync, writeFileSync, rmSync, symlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const args = process.argv.slice(2), opt = (n, d) => { const i = args.indexOf(n); return i > -1 ? args[i + 1] : d; };
const valueArgs = new Set(['--variant', '--out', '--sub', '--shutter', '--workers', '--frames', '--stills', '--crf']);
const id = args.find((a, i) => !a.startsWith('--') && !valueArgs.has(args[i - 1]));
if (!id || !existsSync(join(root, 'film', id, 'story.js'))) { console.error('usage: render-film.mjs ID  (needs film/ID/story.js)'); process.exit(2); }
const dir = join(root, 'film', id), T = JSON.parse(readFileSync(join(dir, 'timing.json'), 'utf8'));
const OUT = opt('--out', join(root, 'out', 'film', id)), VAR = opt('--variant', 'both'), SUB = +opt('--sub', 4), SHUT = +opt('--shutter', .5), WORKERS = +opt('--workers', 3), CRF = +opt('--crf', 19);
const FPS = 30, LEN = T.len, NF = LEN * FPS, JOIN_F = Math.round(T.join * FPS), SCALE = 1080 / 402;
const only = opt('--frames', ''), stills = opt('--stills', ''), COVER = args.includes('--cover');

const require = createRequire(import.meta.url);
let pw; for (const p of ['playwright', '/opt/node-tools/node_modules/playwright', '/opt/node-tools/node_modules/playwright-core']) { try { pw = require(p); break; } catch { /* next */ } }
if (!pw) { console.error('Playwright not found.'); process.exit(2); }
const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
const exe = existsSync(base) ? readdirSync(base).filter((d) => d.startsWith('chromium-')).map((d) => join(base, d, 'chrome-linux', 'chrome')).find(existsSync) : undefined;
const tplUrl = pathToFileURL(join(root, 'templates', id, 'index.html')).href;
const engineSrc = readFileSync(join(root, 'scripts', 'film', 'engine.js'), 'utf8'), storySrc = readFileSync(join(dir, 'story.js'), 'utf8');
mkdirSync(OUT, { recursive: true });

async function openPage(browser, variant) {
  const ctx = await browser.newContext({ viewport: { width: 402, height: 715 }, deviceScaleFactor: SCALE, reducedMotion: 'no-preference' });
  const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', (e) => errs.push(String(e).slice(0, 200)));
  await pg.goto(tplUrl, { waitUntil: 'networkidle' });
  await pg.evaluate(async () => { await document.fonts.ready; await Promise.all(['900 20px Gabarito', '500 12px "Martian Mono"'].map((f) => document.fonts.load(f))); });
  await pg.evaluate((t) => { window.FILM_T = t; }, T);
  await pg.addScriptTag({ content: engineSrc }); await pg.addScriptTag({ content: storySrc });
  await pg.evaluate((v) => { FilmEngine.stage(); FilmEngine.story.setup(v); }, variant);
  if (errs.length) throw new Error('page error: ' + errs.join(' | '));
  return pg;
}
// give the compositor two frames to re-raster at the new camera zoom (otherwise a big zoom can be captured from a stale, low-resolution raster)
const settle = (pg) => pg.evaluate(() => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok))));
// one output frame = SUB sub-frames across the shutter; file index = f*SUB + k
async function frame(pg, dest, f) {
  for (let k = 0; k < SUB; k++) {
    const t = (f + SHUT * ((k + .5) / SUB - .5)) / FPS;
    await pg.evaluate(([tt, ff]) => FilmEngine.render(tt, ff), [t, f]);
    await settle(pg);
    await pg.screenshot({ path: join(dest, String(f * SUB + k).padStart(6, '0') + '.jpg'), type: 'jpeg', quality: 93 });
  }
}

const browsers = [];
const variants = VAR === 'both' ? ['A', 'B'] : [VAR];
if (COVER) { // the cover poster (1080x1920) + a preview of how it crops on the profile grid
  const b = await pw.chromium.launch({ ...(exe ? { executablePath: exe } : {}) }); const pg = await openPage(b, 'A');
  await pg.evaluate(() => { FilmEngine.story.cover(); FilmEngine.frame = 7; });
  await pg.screenshot({ path: join(OUT, 'cover-raw.png') }); await b.close();
  const sp = (a) => { const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', ...a], { encoding: 'utf8' }); if (r.status !== 0) { console.error(r.stderr); process.exit(1); } };
  sp(['-i', join(OUT, 'cover-raw.png'), '-vf', 'scale=1080:1920:flags=lanczos', join(OUT, `${id}-cover.png`)]);
  sp(['-i', join(OUT, `${id}-cover.png`), '-filter_complex', '[0]split=3[a][b][c];[a]scale=-2:640[x];[b]crop=1080:1440:0:240,scale=-2:640[y];[c]crop=1080:1080:0:420,scale=-2:640[z];[x][y][z]hstack=3', join(OUT, `${id}-cover-grid-preview.png`)]);
  console.log('cover written'); process.exit(0);
}
if (stills) { // debug: single stills at given film times, variant A (or --variant)
  const b = await pw.chromium.launch({ ...(exe ? { executablePath: exe } : {}) }); const pg = await openPage(b, variants[0]);
  for (const s of stills.split(',')) { const t = +s; await pg.evaluate(([tt]) => FilmEngine.render(tt, Math.round(tt * 30)), [t]); await settle(pg); await pg.screenshot({ path: join(OUT, `still-${variants[0]}-${t.toFixed(2)}.png`) }); console.log('still', t); }
  await b.close(); process.exit(0);
}

// ---- frames ----
const jobs = [], ASSEMBLE = args.includes('--assemble-only'); // --assemble-only: re-encode from the frames already on disk
const [fa, fb] = only ? only.split('-').map(Number) : [0, NF - 1];
for (const f of ASSEMBLE ? [] : Array.from({ length: fb - fa + 1 }, (_, i) => fa + i)) {
  if (f < JOIN_F) variants.forEach((v) => jobs.push({ v, f, name: v })); else jobs.push({ v: variants[0], f, name: 'S' });
}
for (const n of new Set(jobs.map((j) => j.name))) { rmSync(join(OUT, 'f-' + n), { recursive: true, force: true }); mkdirSync(join(OUT, 'f-' + n), { recursive: true }); }
const t0 = Date.now(); let done = 0;
const lanes = Array.from({ length: WORKERS }, () => []); jobs.forEach((j, i) => lanes[i % WORKERS].push(j));
await Promise.all(lanes.map(async (lane) => {
  const b = await pw.chromium.launch({ ...(exe ? { executablePath: exe } : {}) }); browsers.push(b);
  const pages = {};
  for (const j of lane) {
    pages[j.v] = pages[j.v] || (await openPage(b, j.v));
    await frame(pages[j.v], join(OUT, 'f-' + j.name), j.f);
    if (++done % 30 === 0) console.log(`frames ${done}/${jobs.length}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  await b.close();
}));
console.log(`rendered ${jobs.length} frames x${SUB} in ${((Date.now() - t0) / 1000).toFixed(0)}s`);

// ---- assemble each variant: sequence = variant head (f < JOIN_F) + shared tail, motion-blurred by averaging each group of SUB sub-frames ----
const run = (cmd, a, o = {}) => { const r = spawnSync(cmd, a, { encoding: 'utf8', ...o }); if (r.status !== 0) { console.error(cmd, a.join(' ').slice(0, 300), '\n', (r.stderr || '').slice(-1500)); process.exit(1); } return r; };
const audio = join(OUT, 'score.wav');
if (!args.includes('--no-audio') && !only) {
  const m = await import(pathToFileURL(join(dir, 'audio.mjs')).href); await m.writeScore(audio, T);
}
for (const v of variants) {
  const seq = join(OUT, 'seq-' + v); rmSync(seq, { recursive: true, force: true }); mkdirSync(seq, { recursive: true });
  for (let f = fa; f <= fb; f++) for (let k = 0; k < SUB; k++) {
    const nm = String(f * SUB + k).padStart(6, '0') + '.jpg', src = join(OUT, 'f-' + (f < JOIN_F ? v : 'S'), nm);
    if (existsSync(src)) symlinkSync(src, join(seq, String((f - fa) * SUB + k).padStart(6, '0') + '.jpg'));
  }
  const mp4 = join(OUT, `${id}-${v}.mp4`);
  // blur (average SUB sub-frames), bloom on highlights, gentle grade, scale to exactly 1080x1920
  const vf = `[0:v]tmix=frames=${SUB},select='not(mod(n+1\\,${SUB}))',setpts=N/(30*TB),scale=1080:1920:flags=lanczos,format=yuv420p,split[a][b];[b]curves=all='0/0 0.62/0 1/1',gblur=sigma=26[bl];[a][bl]blend=all_mode=screen:all_opacity=0.16,eq=contrast=1.04:saturation=1.05[v]`;
  const haveAudio = existsSync(audio) && !only;
  run('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS * SUB), '-i', join(seq, '%06d.jpg'), ...(haveAudio ? ['-i', audio] : []), '-filter_complex', vf, '-map', '[v]', ...(haveAudio ? ['-map', '1:a', '-af', 'alimiter=limit=0.66:attack=3:release=40:level=disabled', '-c:a', 'aac', '-ar', '48000', '-b:a', '192k', '-shortest'] : []), '-r', String(FPS), '-c:v', 'libx264', '-profile:v', 'high', '-level', '4.2', '-preset', 'medium', '-crf', String(CRF), '-maxrate', '14M', '-bufsize', '28M', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4]);
  console.log('wrote', mp4);
}
