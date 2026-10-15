// Film renderer: turns a template into a directed 9:16 film (virtual camera, beat-locked type, motion blur, original score) instead of a screen recording.
//   node scripts/film/render-film.mjs ID [--variant A|B|both] [--out DIR] [--sub 4] [--shutter .5] [--workers 3] [--frames a-b] [--stills t1,t2,...] [--no-audio] [--crf 16]
// Needs film/ID/{story.js,timing.json,audio.mjs}. Every frame is a pure function of the film time, so output is exact and repeatable (no real-time capture).
// Motion blur = SUB sub-frames per output frame spread over a 180-degree shutter, averaged by ffmpeg (tmix).
import { readFileSync, existsSync, readdirSync, mkdirSync, writeFileSync, rmSync, symlinkSync, copyFileSync, unlinkSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const args = process.argv.slice(2), opt = (n, d) => { const i = args.indexOf(n); return i > -1 ? args[i + 1] : d; };
const valueArgs = new Set(['--variant', '--out', '--sub', '--shutter', '--workers', '--frames', '--stills', '--crf', '--deliver', '--audio', '--film-dir']);
const id = args.find((a, i) => !a.startsWith('--') && !valueArgs.has(args[i - 1]));
const FD = (() => { const i = args.indexOf('--film-dir'); return i > -1 ? args[i + 1] : ''; })(), dir = FD || join(root, 'film', id), T = JSON.parse(readFileSync(join(dir, 'timing.json'), 'utf8'));
if (!id || !existsSync(join(FD || join(root, 'film', id), 'story.js'))) { console.error('usage: render-film.mjs ID  (needs film/ID/story.js)'); process.exit(2); }
const OUT = resolve(opt('--out', join(root, 'out', 'film', id))), VAR = opt('--variant', 'both'), PREVIEW = args.includes('--preview'), SUB = PREVIEW ? 1 : +opt('--sub', T.sub || 4), SHUT = +opt('--shutter', .5), WORKERS = +opt('--workers', 3), CRF = PREVIEW ? 28 : +opt('--crf', 17);
const FPS = 30, LEN = T.len, NF = LEN * FPS, JOIN_F = Math.round(T.join * FPS), SCALE = 1080 / 402;
const AUDIO = opt('--audio', ''), only = opt('--frames', ''), stills = opt('--stills', ''), COVER = args.includes('--cover'), DELIVER = opt('--deliver', '');

const require = createRequire(import.meta.url);
let pw; for (const p of ['playwright', '/opt/node-tools/node_modules/playwright', '/opt/node-tools/node_modules/playwright-core']) { try { pw = require(p); break; } catch { /* next */ } }
if (!pw) { console.error('Playwright not found.'); process.exit(2); }
const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
const exe = existsSync(base) ? readdirSync(base).filter((d) => d.startsWith('chromium-')).map((d) => join(base, d, 'chrome-linux', 'chrome')).find(existsSync) : undefined;
// 3D: a story that uses THREE gets three.js (MIT, pinned in the workflow) injected before the parts; WebGL runs on SwiftShader (deterministic, no GPU needed)
const GL_ARGS = ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-gpu-compositing'];
let threeSrc = ''; { let tp = ''; try { tp = require.resolve('three', { paths: [root, '/opt/node-tools'] });} catch { /* not installed */ } if (tp) threeSrc = 'var module={exports:{}},exports=module.exports;' + readFileSync(tp, 'utf8') + ';window.THREE=module.exports;'; }
const tplUrl = pathToFileURL(join(root, 'templates', id, 'index.html')).href;
const engineSrc = readFileSync(join(root, 'scripts', 'film', 'engine.js'), 'utf8'), partsSrc = readFileSync(join(root, 'scripts', 'film', 'parts.js'), 'utf8'), storySrc = readFileSync(join(dir, 'story.js'), 'utf8');
mkdirSync(OUT, { recursive: true });

async function openPage(browser, variant) {
  const ctx = await browser.newContext({ viewport: { width: 402, height: 715 }, deviceScaleFactor: SCALE, reducedMotion: 'no-preference' });
  const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', (e) => errs.push(String(e).slice(0, 200)));
  await pg.goto(tplUrl, { waitUntil: 'networkidle' });
  await pg.evaluate(async () => { await document.fonts.ready; await Promise.all(['900 20px Gabarito', '500 12px "Martian Mono"'].map((f) => document.fonts.load(f))); });
  let kit = null; try { kit = JSON.parse(readFileSync(join(root, 'templates', 'social-kits.json'), 'utf8')).find((k) => k.id === id) || null; } catch { /* no kit */ }
  await pg.evaluate(([t, k]) => { window.FILM_T = t; window.FILM_KIT = k; }, [T, kit]);
  if (/\bTHREE\b|P\.three\(|P\.tank3d\(/.test(storySrc)) { if (!threeSrc) throw new Error('this film uses 3D: npm install --no-save three@0.180.0'); await pg.addScriptTag({ content: threeSrc }); }
  await pg.addScriptTag({ content: engineSrc }); await pg.addScriptTag({ content: partsSrc }); await pg.addScriptTag({ content: storySrc });
  await pg.evaluate(async (v) => { if (!FilmEngine.story.selfStage) FilmEngine.stage(); await FilmEngine.story.setup(v); }, variant);
  if (errs.length) throw new Error('page error: ' + errs.join(' | '));
  // auto-manifest (no hand upkeep): the parts record the slot each one fills; the story declares its DNA (opening, bigMoment, ground, music)
  if (!FD) { try {
    const m = await pg.evaluate(() => ({ used: (window.FilmParts || {}).used || {}, dna: FilmEngine.story.dna || null }));
    const mp = join(dir, 'manifest.json'); let made = new Date().toISOString(); try { made = JSON.parse(readFileSync(mp, 'utf8')).made || made; } catch { /* first time */ }
    writeFileSync(mp, JSON.stringify({ id, made, slots: m.used, dna: m.dna }, null, 2) + '\n');
  } catch (e) { console.error('manifest not written:', String(e).slice(0, 120)); } }
  return pg;
}
// give the compositor two frames to re-raster at the new camera zoom (otherwise a big zoom can be captured from a stale, low-resolution raster)
const settle = (pg) => pg.evaluate(() => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok))));
// one output frame = SUB sub-frames across the shutter; file index = f*SUB + k
async function frame(pg, dest, f) {
  if (pg.__3d === undefined) pg.__3d = await pg.evaluate(() => !!window.__film3d);
  for (let k = 0; k < SUB; k++) {
    const t = (f + SHUT * ((k + .5) / SUB - .5)) / FPS, nm = join(dest, String(f * SUB + k).padStart(6, '0'));
    const in3d = pg.__3d && (await pg.evaluate(([tt]) => window.__film3d.active(tt), [t]));
    // 3D sub-frames are the costly ones: render every other one and reuse it for the next (2-sample blur instead of SUB)
    if (in3d && SUB > 2 && k % 2 === 1) { copyFileSync(join(dest, String(f * SUB + k - 1).padStart(6, '0') + '.jpg'), nm + '.jpg'); continue; }
    await pg.evaluate(([tt, ff]) => FilmEngine.render(tt, ff), [t, f]);
    if (!in3d) { await settle(pg); await pg.screenshot({ path: nm + '.jpg', type: 'jpeg', quality: 93 }); continue; }
    // 3D: the WebGL frame straight from its canvas (~50 ms) + a transparent screenshot of the layers above it (~1 s), laid together right away
    // (one screenshot of a page holding a software-GL canvas takes 3-4 s)
    const url = await pg.evaluate(() => window.__film3d.grab()); writeFileSync(nm + '_gl.jpg', Buffer.from(url.split(',')[1], 'base64'));
    await pg.evaluate(() => window.__film3d.hide(true)); await pg.screenshot({ path: nm + '_ov.png', omitBackground: true }); await pg.evaluate(() => window.__film3d.hide(false));
    const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', nm + '_gl.jpg', '-i', nm + '_ov.png', '-filter_complex', '[0:v][1:v]scale2ref[b][o];[b][o]overlay=format=auto,format=yuvj420p', '-q:v', '2', nm + '.jpg']   /* same size and pixel format as the 2D screenshots: a change mid-sequence restarts the blur filter and truncates the film */, { encoding: 'utf8' });
    if (r.status !== 0) throw new Error('3D composite failed: ' + (r.stderr || '').slice(-400));
    unlinkSync(nm + '_gl.jpg'); unlinkSync(nm + '_ov.png');
  }
}

const browsers = [];
const variants = VAR === 'both' ? ['A', 'B'] : [VAR];
async function makeCover() { // the cover poster (1080x1920) + a preview of how it crops on the profile grid; returns false when the story has no poster
  const b = await pw.chromium.launch({ ...(exe ? { executablePath: exe } : {}), args: GL_ARGS }); const pg = await openPage(b, 'A');
  const has = await pg.evaluate(() => { if (typeof FilmEngine.story.cover !== 'function') return false; FilmEngine.story.cover(); FilmEngine.frame = 7; return true; });
  if (has) await pg.screenshot({ path: join(OUT, 'cover-raw.png') });
  await b.close(); if (!has) return false;
  const sp = (a) => { const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', ...a], { encoding: 'utf8' }); if (r.status !== 0) { console.error(r.stderr); process.exit(1); } };
  sp(['-i', join(OUT, 'cover-raw.png'), '-vf', 'scale=1080:1920:flags=lanczos', join(OUT, `${id}-cover.png`)]);
  sp(['-i', join(OUT, `${id}-cover.png`), '-q:v', '3', join(OUT, `${id}-cover.jpg`)]);
  sp(['-i', join(OUT, `${id}-cover.png`), '-filter_complex', '[0]split=3[a][b][c];[a]scale=-2:640[x];[b]crop=1080:1440:0:240,scale=-2:640[y];[c]crop=1080:1080:0:420,scale=-2:640[z];[x][y][z]hstack=3', join(OUT, `${id}-cover-grid-preview.png`)]);
  console.log('cover written'); return true;
}
if (COVER) { await makeCover(); process.exit(0); }
if (args.includes('--motion-check')) { // easing self-check (owner, 14 Oct 2026): sample every scripted element 4x per frame and judge the motion itself
  const b = await pw.chromium.launch({ ...(exe ? { executablePath: exe } : {}), args: GL_ARGS }); const pg = await openPage(b, variants[0]);
  const HZ = 120, data = await pg.evaluate(async ([LEN, HZ]) => {
    const els = [...E_ALL()]; function E_ALL() { return document.querySelectorAll('#stage *'); }
    const track = els.filter((e) => /transform|opacity|translate|rotate/.test(e.getAttribute('style') || '') && e.tagName !== 'CANVAS');
    const out = track.map(() => []);
    for (let i = 0; i <= LEN * HZ; i++) { const t = i / HZ; FilmEngine.render(t, Math.round(t * 30));
      track.forEach((e, k) => { const r = e.getBoundingClientRect(); let o = 1, m = new DOMMatrix(), n = e;
        while (n && n.nodeType === 1) { const cs = getComputedStyle(n); o *= +cs.opacity; if (cs.transform && cs.transform !== 'none') m = new DOMMatrix(cs.transform).multiply(m); n = n.parentElement; }
        out[k].push([r.left + r.width / 2, r.top + r.height / 2, Math.hypot(m.a, m.b) * e.offsetWidth, o]); }); }   // size = true scale x width (a rotated box's outline would kink)
    const name = (e) => (e.textContent || '').trim().slice(0, 24) || e.tagName.toLowerCase();
    return { names: track.map(name), out, cuts: FilmEngine.story.cuts || [], used: (window.FilmParts.used || {}).easing || [], info: Object.fromEntries(((window.FilmParts.used || {}).easing || []).map((id) => [id, window.FilmParts.easeInfo(id.replace(/^spring-/, ''))])) };
  }, [LEN, HZ]);
  await b.close();
  const near = (t) => data.cuts.some((c) => Math.abs(t - c) < .06), rep = [];
  data.out.forEach((ser, k) => {
    const vis = (i) => ser[i][3] > .03 && ser[i][0] > -50 && ser[i][0] < 452 && ser[i][1] > -50 && ser[i][1] < 765;
    for (const [q, unit, vmin] of [[0, 'px', 20], [1, 'px', 20], [2, 'px', 20], [3, '', .4]]) {
      const v = ser.map((p, i) => (i ? (p[q] - ser[i - 1][q]) * HZ : 0));
      let run = 0;
      for (let i = 2; i < ser.length - 1; i++) {
        if (!vis(i) || !vis(i - 1) || !vis(i - 2) || !vis(i + 1) || near(i / HZ)) { run = 0; continue; }
        const dv = Math.abs(v[i] - v[i - 1]), dvn = Math.max(Math.abs(v[i - 1] - v[i - 2]), Math.abs(v[i + 1] - v[i])), big = q === 3 ? 6 : 60;
        if (dv > big && dv > 4 * dvn) rep.push(`JUMP    ${(i / HZ).toFixed(3)}s  "${data.names[k]}" ${['x', 'y', 'size', 'opacity'][q]}: speed ${v[i - 1].toFixed(0)} -> ${v[i].toFixed(0)}${unit}/s`);
        run = Math.abs(v[i]) > vmin && Math.abs(v[i] - v[i - 1]) < .004 * Math.abs(v[i]) ? run + 1 : 0;
        if (run === 18) rep.push(`LINEAR  ${((i - 17) / HZ).toFixed(3)}s  "${data.names[k]}" ${['x', 'y', 'size', 'opacity'][q]} moves at a constant ${v[i].toFixed(1)}${unit}/s`);
      }
    }
  });
  const uniq = [...new Set(rep)];
  console.log(`motion check: ${data.out.length} scripted elements x ${data.out[0] ? data.out[0].length : 0} samples (${HZ}/s)`);
  console.log(uniq.slice(0, 60).join('\n') || 'no jumps, no linear motion in the DOM layers');
  if (uniq.length > 60) console.log(`... ${uniq.length - 60} more`);
  console.log('easing used:'); for (const id of data.used) { const f = data.info[id]; const ok = f.overshoot < .08 && f.settleFrames <= 18; console.log(`  ${id.padEnd(16)} overshoot ${(f.overshoot * 100).toFixed(1)}%  settles in ${f.settleFrames} frames  ${ok ? 'PASS' : 'FAIL'}`); }
  const src = readFileSync(join(dir, 'story.js'), 'utf8').replace(/\/\/.*$/gm, '') + readFileSync(join(dir, 'timing.json'), 'utf8');
  const lin = src.match(/'lin'|"lin"|linear\(|ease\.(lin|io3|out3|in2|inX|outX|ioX|spring)\b|clamp\(\(t\s*-/g);
  console.log(lin ? `GREP: linear or untooled curves in the film config: ${[...new Set(lin)].join(', ')}` : 'GREP: no linear or untooled curves in story.js / timing.json');
  process.exit(uniq.length || lin ? 1 : 0);
}
if (stills) { // debug: single stills at given film times, variant A (or --variant)
  const b = await pw.chromium.launch({ ...(exe ? { executablePath: exe } : {}), args: GL_ARGS }); const pg = await openPage(b, variants[0]);
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
  const b = await pw.chromium.launch({ ...(exe ? { executablePath: exe } : {}), args: GL_ARGS }); browsers.push(b);
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
// audio: a finished mix made by scripts/audio/produce.mjs (licensed music + effects, mastered) when one exists for this film, otherwise the effects-only track
if (!T.cues && !only && !PREVIEW) { // stories that compute their own shots hand over their sound cues
  const b0 = await pw.chromium.launch({ ...(exe ? { executablePath: exe } : {}), args: GL_ARGS }); const p0 = await openPage(b0, variants[0]);
  T.cues = await p0.evaluate(() => (FilmEngine.story.cues ? FilmEngine.story.cues() : [])); await b0.close(); console.log('cues from the story:', T.cues.length);
}
let audio = join(OUT, 'score.wav');
const finalMix = (() => { if (AUDIO) return AUDIO; const root2 = join(root, 'audio'); if (!existsSync(root2)) return ''; for (const d of readdirSync(root2).sort().reverse()) { const f = join(root2, d, id, 'final.wav'); if (existsSync(f)) return f; } return ''; })();
if (finalMix && existsSync(finalMix)) { audio = finalMix; console.log('audio: finished mix', finalMix); }
else if (!args.includes('--no-audio') && !only && !PREVIEW) {
  const custom = join(dir, 'audio.mjs'); // optional per-film score; the default is the effects-only track built from timing.json cues
  const m = existsSync(custom) ? await import(pathToFileURL(custom).href) : await import('./sfx.mjs'); console.log('audio:', JSON.stringify(await (m.writeScore || m.writeSfx)(audio, T)));
}
for (const v of variants) {
  const seq = join(OUT, 'seq-' + v); rmSync(seq, { recursive: true, force: true }); mkdirSync(seq, { recursive: true });
  for (let f = fa; f <= fb; f++) for (let k = 0; k < SUB; k++) {
    const nm = String(f * SUB + k).padStart(6, '0') + '.jpg', src = join(OUT, 'f-' + (f < JOIN_F ? v : 'S'), nm);
    if (existsSync(src)) symlinkSync(src, join(seq, String((f - fa) * SUB + k).padStart(6, '0') + '.jpg'));
    const srcP = src.replace(/\.jpg$/, '.png'); if (existsSync(srcP)) symlinkSync(srcP, join(seq, String((f - fa) * SUB + k).padStart(6, '0') + '.png'));
  }
  const layered = existsSync(join(seq, '000000.png'));   // 3D film: lay the overlay sequence over the WebGL sequence first
  const mp4 = join(OUT, `${id}-${v}.mp4`);
  // blur (average SUB sub-frames), bloom on highlights, gentle grade, scale to exactly 1080x1920
  const vf = `${layered ? '[0:v][1:v]overlay=format=auto[c];[c]' : '[0:v]'}tmix=frames=${SUB},select='not(mod(n+1\\,${SUB}))',setpts=N/(30*TB),scale=1080:1920:flags=lanczos,format=yuv420p,split[a][b];[b]curves=all='0/0 0.62/0 1/1',gblur=sigma=26[bl];[a][bl]blend=all_mode=screen:all_opacity=0.08,eq=contrast=1.04:saturation=1.05[v]`;
  const haveAudio = existsSync(audio) && !only && !PREVIEW && !args.includes('--no-audio');
  run('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS * SUB), '-i', join(seq, '%06d.jpg'), ...(layered ? ['-framerate', String(FPS * SUB), '-i', join(seq, '%06d.png')] : []), ...(haveAudio ? ['-i', audio] : []), '-filter_complex', vf, '-map', '[v]', ...(haveAudio ? ['-map', (layered ? '2' : '1') + ':a', ...(finalMix ? [] : ['-af', 'alimiter=limit=0.66:attack=3:release=40:level=disabled']), '-c:a', 'aac', '-ar', '48000', '-b:a', '192k', '-shortest'] : []), '-r', String(FPS), '-c:v', 'libx264', '-profile:v', 'high', '-level', '4.2', '-preset', 'medium', '-crf', String(CRF), '-maxrate', '10M', '-bufsize', '20M', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4]);
  console.log('wrote', mp4);
  if (PREVIEW) { run('ffmpeg', ['-y', '-loglevel', 'error', '-i', mp4, '-vf', 'fps=2,scale=200:356,tile=9x4:padding=4:color=black', '-frames:v', '1', join(OUT, `preview-sheet-${v}.png`)]); console.log('contact sheet', join(OUT, `preview-sheet-${v}.png`)); }
}

// ---- deliver: the file names the Reel publish workflow and the site expect (ID.mp4, ID-cover.jpg, ID.json) ----
if (DELIVER && !only) {
  mkdirSync(DELIVER, { recursive: true });
  const v = variants[0], { copyFileSync } = await import('node:fs');
  copyFileSync(join(OUT, `${id}-${v}.mp4`), join(DELIVER, `${id}.mp4`));
  // hard cap: the site cannot serve a file over 25 MiB (the deploy fails). Re-encode at a fixed bitrate if a busy film (grain, particles) still came out too big.
  const { statSync } = await import('node:fs'), dm = join(DELIVER, `${id}.mp4`);
  if (statSync(dm).size > 24 * 1024 * 1024) {
    const tmp = join(OUT, `${id}-capped.mp4`);
    run('ffmpeg', ['-y', '-loglevel', 'error', '-i', dm, '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-b:v', Math.min(8, Math.floor(170 / LEN * 10) / 10) + 'M', '-maxrate', Math.min(9, Math.floor(190 / LEN * 10) / 10) + 'M', '-bufsize', '18M', '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-movflags', '+faststart', tmp]);
    copyFileSync(tmp, dm); console.log('capped the delivered reel to', (statSync(dm).size / 1048576).toFixed(1), 'MiB (site limit 25 MiB)');
  }
  if (await makeCover()) copyFileSync(join(OUT, `${id}-cover.jpg`), join(DELIVER, `${id}-cover.jpg`));
  else if (existsSync(join(root, 'templates', 'covers', `${id}.jpg`))) copyFileSync(join(root, 'templates', 'covers', `${id}.jpg`), join(DELIVER, `${id}-cover.jpg`));
  else { console.error('no cover image'); process.exit(1); }
  writeFileSync(join(DELIVER, `${id}.json`), JSON.stringify({ id, format: 'film', variant: v, fps: FPS, length: LEN, audio: finalMix ? 'mixed' : 'effects-only', bpm: T.bpm || null, note: 'directed film (virtual camera), see film/' + id }, null, 1));
  console.log('delivered', DELIVER);
}
