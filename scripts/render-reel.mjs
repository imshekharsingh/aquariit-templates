// Reel renderer: turns a template into a ready-to-post 1080×1920 MP4 (H.264 + AAC) by playing it through the real ▶ player
// in headless Chromium, exactly as the owner would screen-record it. Free: runs on any machine with Playwright + ffmpeg (and in GitHub Actions).
//   video  = Chrome screencast frames of the 402×715 reel frame (device scale 3, downscaled to 1080×1920), timestamped, then resampled to 30 fps
//   audio  = the player's own generated music, rendered offline for the exact length (original, royalty-free), placed where the player starts it
// Usage: node scripts/render-reel.mjs [ID] [--out DIR] [--len SECONDS] [--no-audio] [--fps 30]     (default ID: newest template)
// Output: DIR/ID.mp4, DIR/ID-cover.jpg (the cover card as a still), DIR/ID.json (timings + capture quality). Exit code 1 when the capture is too choppy.
import { createServer } from 'node:http';
import { readFileSync, existsSync, readdirSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..'), T = join(root, 'templates');
const args = process.argv.slice(2), opt = (n, d) => { const i = args.indexOf(n); return i > -1 ? args[i + 1] : d; };
const OUT = opt('--out', join(root, 'out', 'reels')), FPS = +opt('--fps', 30), NOAUDIO = args.includes('--no-audio');
const valueArgs = new Set(['--out', '--len', '--fps']);
let id = args.find((a, i) => !a.startsWith('--') && !valueArgs.has(args[i - 1]));
const log = JSON.parse(readFileSync(join(root, 'design-log.json'), 'utf8'));
if (!id) id = log.map((e) => e.id || e.date).sort().reverse()[0];
if (!id || !existsSync(join(T, id, 'index.html'))) { console.error(`No template ${id || ''}`); process.exit(2); }

// the kit decides the length (`Length: 25 s`) unless --len is given
spawnSync('node', [join(root, 'scripts', 'build-kits.mjs')], { stdio: 'ignore' }); // the kits file is generated: never trust an old copy (it carries the cover text and length)
let kit = null; try { kit = JSON.parse(readFileSync(join(T, 'social-kits.json'), 'utf8')).find((k) => k.id === id); } catch { /* no kit */ }
const lm = kit && kit.reel ? String(kit.reel.length || '').match(/(\d+)\s*(?:[–-]\s*(\d+))?\s*s\b/) : null, kitLen = lm ? +(lm[2] || lm[1]) : 0; // "24–30 s" -> 30
const LEN = Math.max(6, Math.min(60, +opt('--len', kitLen >= 15 && kitLen <= 60 ? kitLen : 30)));

const require = createRequire(import.meta.url);
let pw; for (const p of ['playwright', '/opt/node-tools/node_modules/playwright', '/opt/node-tools/node_modules/playwright-core']) { try { pw = require(p); break; } catch { /* next */ } }
if (!pw) { console.error('Playwright not found.'); process.exit(2); }
if (spawnSync('ffmpeg', ['-version']).status !== 0) { console.error('ffmpeg not found.'); process.exit(2); }
const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
const exe = existsSync(base) ? readdirSync(base).filter((d) => d.startsWith('chromium-')).map((d) => join(base, d, 'chrome-linux', 'chrome')).find(existsSync) : undefined;

const types = { '.html': 'text/html', '.json': 'application/json', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webmanifest': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png' };
const server = createServer((q, r) => { let p = decodeURIComponent(q.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html'; const f = join(T, p); if (!f.startsWith(T) || !existsSync(f)) { r.statusCode = 404; return r.end(); } r.setHeader('content-type', types[extname(f)] || 'application/octet-stream'); r.end(readFileSync(f)); });
await new Promise((ok) => server.listen(0, ok));

mkdirSync(OUT, { recursive: true });
const tmp = join(OUT, `.${id}-frames`); rmSync(tmp, { recursive: true, force: true }); mkdirSync(tmp, { recursive: true });

const browser = await pw.chromium.launch({ ...(exe ? { executablePath: exe } : {}), args: ['--autoplay-policy=no-user-gesture-required', '--hide-scrollbars'] });
// 402×715 is the 9:16 reel frame the player draws on a 402-wide phone; at a viewport of exactly that size the frame fills it (no bands)
const ctx = await browser.newContext({ viewport: { width: 402, height: 715 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 });
const pg = await ctx.newPage();
const errs = []; pg.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
await pg.addInitScript((len) => {
  localStorage.setItem('reel.settings', JSON.stringify({ len, music: 'off', frame: 'auto', hideBack: true, cover: true })); // music is rendered offline instead
  window.__sc = []; (function f() { try { const w = document.querySelector('#reel iframe').contentWindow; window.__sc.push([Date.now(), w.scrollY]); } catch (e) { /* not loaded yet */ } requestAnimationFrame(f); })(); // scroll position per frame: tells a held pause from a dropped frame
  window.addEventListener('DOMContentLoaded', () => new MutationObserver(() => { // the moment the camera "rolls": countdown overlay switches off, cover card appears in the same tick
    const cd = document.querySelector('#reel .cd');
    if (cd && cd.classList.contains('off') && !window.__goAt) { window.__goAt = Date.now(); window.__cover = !!document.querySelector('#reel .cv'); }
  }).observe(document.body, { subtree: true, attributes: true, childList: true, attributeFilter: ['class'] }));
}, LEN);
await pg.goto(`http://localhost:${server.address().port}/index.html`); await pg.waitForFunction(() => window.Reel, null, { timeout: 15000 });

const cdp = await ctx.newCDPSession(pg), frames = [];
cdp.on('Page.screencastFrame', (f) => { frames.push({ ts: f.metadata.timestamp, data: f.data }); cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {}); });
await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: 1080, maxHeight: 1920, everyNthFrame: 1 });
await pg.evaluate((i) => window.Reel.start(i), id);

const t0 = Date.now(); let state = {};
while (Date.now() - t0 < (LEN + 40) * 1000) {
  await pg.waitForTimeout(250);
  state = await pg.evaluate(() => ({ go: window.__goAt || 0, cover: !!window.__cover, done: !!document.querySelector('#reel .done.on'), D: (() => { try { return document.querySelector('#reel iframe').contentWindow.__reel?.duration || 0; } catch { return 0; } })() }));
  if (state.done) break;
}
await pg.waitForTimeout(400); // a short tail of the final frame
const sc = await pg.evaluate(() => window.__sc);
const endAt = Date.now();
await cdp.send('Page.stopScreencast');
if (!state.done || !state.go) { console.error('The player never finished (go=' + state.go + ', done=' + state.done + '). Page errors: ' + errs.join(' | ')); await browser.close(); server.close(); process.exit(1); }

const D = state.D ? Math.max(6, Math.min(120, state.D)) : LEN, COV = state.cover ? 1.3 : 0, LEAD = 0.6, audioAt = COV + LEAD;
const videoLen = audioAt + D + 0.35; // cover + lead + the scroll + a beat after the last frame

// ---- audio: the player's generated music, rendered offline for exactly D seconds (deterministic per template) ----
let style = '-';
if (!NOAUDIO) {
  const r = await pg.evaluate(async ({ id, D }) => {
    const lg = await (await fetch('/design-log.json')).json(), e = lg.find((x) => (x.id || x.date) === id) || {};
    const style = window.Reel.styleForTheme(e.theme, e.purpose, id), sr = 44100, oc = new OfflineAudioContext(2, Math.ceil(sr * (D + 1.5)), sr);
    const m = window.Reel._Music(oc, style, D, id, { eager: true }); m.start(0, oc.destination);
    const b = await oc.startRendering(), n = b.length, L = b.getChannelData(0), R = b.getChannelData(1), buf = new ArrayBuffer(44 + n * 4), v = new DataView(buf), w = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    w(0, 'RIFF'); v.setUint32(4, 36 + n * 4, true); w(8, 'WAVEfmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 2, true); v.setUint32(24, sr, true); v.setUint32(28, sr * 4, true); v.setUint16(32, 4, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, n * 4, true);
    for (let i = 0; i < n; i++) { v.setInt16(44 + i * 4, Math.max(-1, Math.min(1, L[i])) * 32767, true); v.setInt16(46 + i * 4, Math.max(-1, Math.min(1, R[i])) * 32767, true); }
    let s = '', u = new Uint8Array(buf); for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
    return { style, wav: btoa(s) };
  }, { id, D });
  style = r.style; writeFileSync(join(tmp, 'music.wav'), Buffer.from(r.wav, 'base64'));
}
await browser.close(); server.close();

// ---- video: keep the frames from "camera rolls" to the end, write them with their real durations ----
const goS = state.go / 1000, endS = goS + videoLen;
let kept = frames.filter((f) => f.ts <= endS), firstIdx = Math.max(0, kept.findLastIndex((f) => f.ts <= goS)); kept = kept.slice(firstIdx);
if (kept.length < 30) { console.error(`Only ${kept.length} frames were captured: the machine is too slow to render this template.`); process.exit(1); }
const list = [];
kept.forEach((f, i) => {
  const name = `f${String(i).padStart(5, '0')}.jpg`; writeFileSync(join(tmp, name), Buffer.from(f.data, 'base64'));
  const from = Math.max(f.ts, goS), to = i + 1 < kept.length ? kept[i + 1].ts : endS; list.push(`file '${name}'`, `duration ${Math.max(0.001, to - from).toFixed(4)}`);
});
list.push(`file 'f${String(kept.length - 1).padStart(5, '0')}.jpg'`); // concat demuxer quirk: the last file is repeated
writeFileSync(join(tmp, 'list.txt'), list.join('\n'));
const gaps = kept.slice(1).map((f, i) => f.ts - kept[i].ts), maxGap = Math.max(...gaps), avgFps = (kept.length - 1) / (kept[kept.length - 1].ts - kept[0].ts);
const yAt = (ms) => { let lo = 0, hi = sc.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (sc[m][0] <= ms) lo = m; else hi = m - 1; } return sc.length ? sc[lo][1] : 0; };
const slow = gaps.filter((g, i) => g > 0.05 && Math.abs(yAt(kept[i + 1].ts * 1000) - yAt(kept[i].ts * 1000)) > 3).length; // only gaps where the page was scrolling: a held pause legitimately produces no frames if (process.env.GAPS) console.log(kept.slice(1).map((f, i) => [+(kept[i].ts - goS).toFixed(2), Math.round(gaps[i] * 1000)]).filter((x) => x[1] > 50).map((x) => `${x[0]}s:${x[1]}ms`).join('  ')); // > 50 ms between frames = visibly dropped frames (a 60 Hz page makes ~16 ms)

const mp4 = join(OUT, `${id}.mp4`), inputs = ['-f', 'concat', '-safe', '0', '-i', join(tmp, 'list.txt')];
if (!NOAUDIO) inputs.push('-itsoffset', String(audioAt), '-i', join(tmp, 'music.wav'));
const enc = ['-vf', `fps=${FPS},scale=1080:1920:flags=lanczos,format=yuv420p`, '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-profile:v', 'high', '-movflags', '+faststart', '-t', videoLen.toFixed(2)];
if (!NOAUDIO) enc.push('-c:a', 'aac', '-b:a', '160k', '-ar', '44100', '-ac', '2', '-af', `afade=t=out:st=${(audioAt + D - 0.05).toFixed(2)}:d=0.35`);
const ff = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, ...enc, mp4], { encoding: 'utf8' });
if (ff.status !== 0) { console.error('ffmpeg failed:\n' + ff.stderr); process.exit(1); }
if (COV) spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', '1.1', '-i', mp4, '-frames:v', '1', '-q:v', '2', join(OUT, `${id}-cover.jpg`)]);
rmSync(tmp, { recursive: true, force: true });

const pr = JSON.parse(spawnSync('ffprobe', ['-v', 'error', '-print_format', 'json', '-show_format', '-show_streams', mp4], { encoding: 'utf8' }).stdout || '{}');
const vs = (pr.streams || []).find((s) => s.codec_type === 'video') || {}, as = (pr.streams || []).find((s) => s.codec_type === 'audio');
const info = { id, file: mp4, seconds: +(+pr.format.duration).toFixed(2), width: vs.width, height: vs.height, fps: vs.r_frame_rate, sizeMB: +(pr.format.size / 1e6).toFixed(1), audio: as ? `${as.codec_name} (${style})` : 'none', cover: !!COV, captured: { frames: kept.length, avgFps: +avgFps.toFixed(1), maxGapMs: Math.round(maxGap * 1000), gapsOver50msWhileScrolling: slow }, pageErrors: errs.length };
writeFileSync(join(OUT, `${id}.json`), JSON.stringify(info, null, 2));
console.log(`${id}: ${info.seconds}s ${info.width}×${info.height} @ ${info.fps}, ${info.sizeMB} MB, audio ${info.audio}${COV ? ', cover card first' : ''}`);
console.log(`capture: ${kept.length} frames, avg ${avgFps.toFixed(1)} fps, longest gap ${Math.round(maxGap * 1000)} ms, ${slow} gaps > 50 ms while scrolling`);
const smooth = avgFps >= 24 && slow <= Math.max(3, kept.length * 0.02);
console.log(smooth ? 'capture quality: OK' : 'capture quality: CHOPPY (frames were dropped while recording; run on a quieter/faster machine or simplify the template)');
process.exit(smooth ? 0 : 1);
