// Reel renderer: turns a template into a ready-to-post 1080×1920 MP4 (H.264 + AAC) by playing it through the real ▶ player
// in headless Chromium, exactly as the owner would screen-record it. Free: runs on any machine with Playwright + ffmpeg (and in GitHub Actions).
//   video  = every frame is rendered at its exact time: the page runs on a paused virtual clock (Playwright clock) that is stepped 1/30 s per frame,
//            CSS animations are set to that exact time, and a screenshot of the 402×715 reel frame (device scale 3) is taken. The scroll and the
//            animations are therefore perfectly even, whatever the speed of the machine. `--realtime` falls back to a real-time screencast capture.
//   audio  = the player's own generated music, rendered offline for the exact length (original, royalty-free), placed where the player starts it
// FORMAT B (default, experiment E1 in design/experiments.md): no static intro (the video starts the moment the page starts moving), the kit's hook as an on-screen line for the
// first ~2.7 s, 18 s long, and the cover card written separately as ID-cover.jpg to upload as the Instagram cover. FORMAT A (--format A) is the first format: cover card
// as the first 1.3 s of the video, kit length (24-30 s), no hook line.
// Usage: node scripts/render-reel.mjs [ID] [--out DIR] [--format A|B] [--len SECONDS] [--no-hook] [--no-audio] [--fps 30] [--crf 15] [--realtime] [--light]   (default ID: newest template)
// --light (owner, 16 Oct 2026: post every day; light days are recordings of our own pages, design/themes.md theme E demo): 15 s by default and an Aquarii
// end card over the last 2.8 s ("Comment AQUARII", owner 17 Oct 2026; was "DM us to know more"). Without --light nothing changes.
// Output: DIR/ID.mp4, DIR/ID-cover.jpg (the cover card as a still), DIR/ID.json (timings + quality). Exit code 1 when the capture is not smooth.
import { createServer } from 'node:http';
import { readFileSync, existsSync, readdirSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..'), T = join(root, 'templates');
const args = process.argv.slice(2), opt = (n, d) => { const i = args.indexOf(n); return i > -1 ? args[i + 1] : d; };
const OUT = opt('--out', join(root, 'out', 'reels')), FPS = +opt('--fps', 30), NOAUDIO = args.includes('--no-audio'), REALTIME = args.includes('--realtime'), CRF = +opt('--crf', 15), FORMAT = String(opt('--format', 'B')).toUpperCase() === 'A' ? 'A' : 'B', HOOK_ON = FORMAT === 'B' && !args.includes('--no-hook');
const valueArgs = new Set(['--out', '--len', '--fps', '--crf', '--format']);
let id = args.find((a, i) => !a.startsWith('--') && !valueArgs.has(args[i - 1]));
const log = JSON.parse(readFileSync(join(root, 'design-log.json'), 'utf8'));
if (!id) id = log.map((e) => e.id || e.date).sort().reverse()[0];
if (!id || !existsSync(join(T, id, 'index.html'))) { console.error(`No template ${id || ''}`); process.exit(2); }

// the kit decides the length (`Length: 24–30 s` -> 30) unless --len is given
spawnSync('node', [join(root, 'scripts', 'build-kits.mjs')], { stdio: 'ignore' }); // the kits file is generated: never trust an old copy (it carries the cover text and length)
let kit = null; try { kit = JSON.parse(readFileSync(join(T, 'social-kits.json'), 'utf8')).find((k) => k.id === id); } catch { /* no kit */ }
const lm = kit && kit.reel ? String(kit.reel.length || '').match(/(\d+)\s*(?:[–-]\s*(\d+))?\s*s\b/) : null, kitLen = lm ? +(lm[2] || lm[1]) : 0;
const LIGHT = args.includes('--light');
// the end card's last line follows the kit's service line (a social reel must not promise websites)
let SVC = ''; try { SVC = ((readFileSync(join(root, 'social', `${id}.md`), 'utf8').match(/## Service\s*\n\s*([a-z]+)/) || [])[1] || ''); } catch { /* no kit */ }
const ENDLINE = { social: 'We plan, make and post content like this.', security: 'We build and protect websites like this.', edge: 'We make websites this fast, everywhere.' }[SVC] || 'We design, build and run websites like this.';
const LEN = Math.max(6, Math.min(60, +opt('--len', LIGHT ? 15 : FORMAT === 'B' ? 18 : kitLen >= 15 && kitLen <= 60 ? kitLen : 30)));
const HOOK = kit && typeof kit.hook === 'string' ? kit.hook.trim().slice(0, 90) : '';

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
const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));
let browser;
const fail = async (msg) => { console.error(msg); try { await browser.close(); } catch { /* closed */ } server.close(); process.exit(1); };

browser = await pw.chromium.launch({ ...(exe ? { executablePath: exe } : {}), args: ['--autoplay-policy=no-user-gesture-required', '--hide-scrollbars'] });
// 402×715 is the 9:16 reel frame the player draws on a 402-wide phone; at a viewport of exactly that size the frame fills it (no bands)
const ctx = await browser.newContext({ viewport: { width: 402, height: 715 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 });
const pg = await ctx.newPage();
const errs = []; pg.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
if (!REALTIME) await pg.clock.install({ time: Date.now() }); // virtual time for Date, performance.now, timers and requestAnimationFrame in every frame
await ctx.addInitScript(({ len, rt, fps }) => {
  if (window.top === window) localStorage.setItem('reel.settings', JSON.stringify({ len, music: 'off', frame: 'auto', hideBack: true, cover: true })); // music is rendered offline instead
  if (!rt) { // requestAnimationFrame fires exactly at the video frame boundaries (the fake clock's own 16 ms tick would sample 33.3 ms frames unevenly)
    const T = 1000 / fps, timers = new Map(); let seq = 0;
    window.requestAnimationFrame = (cb) => {
      const now = Math.round(performance.now()); let n = Math.floor(now / T) + 1; while (Math.round(n * T) <= now) n++;
      const h = ++seq; timers.set(h, setTimeout(() => { timers.delete(h); cb(performance.now()); }, Math.round(n * T) - now)); return h;
    };
    window.cancelAnimationFrame = (h) => { clearTimeout(timers.get(h)); timers.delete(h); };
  }
  // Animation driver (virtual-time mode): CSS animations and transitions run on the real clock, which does not wait for us, so each one is paused and set
  // to "virtual now minus the time it started". Animations tied to a scroll/view timeline follow the scroll position by themselves and are left alone.
  window.__drive = () => {
    const now = performance.now(), frozen = !!document.getElementById('__reel_freeze'); // the player freezes animations until "camera rolls"
    for (const a of document.getAnimations()) {
      if (a.timeline !== document.timeline) continue;
      if (a.__t0 === undefined) { if (frozen) continue; try { a.pause(); } catch (e) { continue; } a.__t0 = now - (+a.currentTime || 0); }
      a.currentTime = now - a.__t0;
    }
  };
  if (window.top === window) {
    window.addEventListener('DOMContentLoaded', () => new MutationObserver(() => { // the moment the camera "rolls": countdown overlay switches off, cover card appears in the same tick
      const cd = document.querySelector('#reel .cd');
      if (cd && cd.classList.contains('off') && !window.__goAt) { window.__goAt = Date.now(); window.__goPerf = performance.now(); window.__cover = !!document.querySelector('#reel .cv'); }
    }).observe(document.body, { subtree: true, attributes: true, childList: true, attributeFilter: ['class'] }));
    if (rt) { window.__sc = []; (function f() { try { const w = document.querySelector('#reel iframe').contentWindow; window.__sc.push([Date.now(), w.scrollY]); } catch (e) { /* not loaded yet */ } requestAnimationFrame(f); })(); } // real-time mode: scroll per frame, tells a held pause from a dropped frame
  }
}, { len: LEN, rt: REALTIME, fps: FPS });
await pg.goto(`http://localhost:${server.address().port}/index.html`);
for (let i = 0; i < 100 && !(await pg.evaluate(() => !!window.Reel)); i++) await sleep(100);

const readState = () => pg.evaluate(() => ({ go: window.__goAt || 0, goPerf: window.__goPerf || 0, cover: !!window.__cover, done: !!document.querySelector('#reel .done.on'), D: (() => { try { return document.querySelector('#reel iframe').contentWindow.__reel?.duration || 0; } catch { return 0; } })() }));
const driveAll = () => Promise.all(pg.frames().map((f) => f.evaluate(() => window.__drive && window.__drive()).catch(() => {})));
const scrollY = () => pg.evaluate(() => { try { return document.querySelector('#reel iframe').contentWindow.scrollY; } catch { return null; } });

let startFrame = 0, state = {}, D = LEN, COV = 0, audioAt = 0, videoLen = 0, kept = null, gaps = [], slow = 0, avgFps = 0, maxGap = 0, nFrames = 0, perFrameMs = 0, irregular = 0, moving = 0;
const LEAD = 0.6;

if (!REALTIME) {
  // ---------- virtual-time capture ----------
  await pg.clock.pauseAt((await pg.evaluate(() => Date.now())) + 50);
  await pg.evaluate((i) => window.Reel.start(i), id);
  const wall0 = Date.now();
  for (;;) { // countdown + load: step the virtual clock until the player says "camera rolls"; let real loading (fonts) catch up
    if (Date.now() - wall0 > 120000) await fail('The player never started rolling (page errors: ' + errs.join(' | ') + ')');
    for (let k = 0; k < 60; k++) { const loading = await pg.evaluate(() => { try { const d = document.querySelector('#reel iframe').contentDocument; return d.fonts.status === 'loading'; } catch { return false; } }); if (!loading) break; await sleep(50); }
    await pg.clock.runFor(16); await sleep(6);
    state = await readState(); if (state.go) break;
  }
  D = state.D ? Math.max(6, Math.min(120, state.D)) : LEN; COV = state.cover ? 1.3 : 0; videoLen = COV + LEAD + D + 0.35; nFrames = Math.ceil(videoLen * FPS);
  if (HOOK_ON && HOOK) { // the hook as an on-screen line: it appears when the page starts moving (after the cover card and lead-in, which format B trims) and holds ~2.4 s
    await pg.evaluate(({ text, delay }) => {
      const box = document.querySelector('#reel'); if (!box) return;
      const d = document.createElement('div'); d.setAttribute('aria-hidden', 'true'); d.textContent = text;
      // inside Instagram's safe area: 30px from the left, clear of the right button column, above the caption zone (bottom edge at y=548 of 715)
      Object.assign(d.style, { position: 'absolute', left: '30px', right: '64px', bottom: '167px', zIndex: '2147483000', boxSizing: 'border-box', padding: '12px 16px', borderRadius: '16px', background: 'rgba(8,10,14,.78)', color: '#fff',
        font: '800 22px/1.18 system-ui,-apple-system,"Segoe UI",sans-serif', letterSpacing: '-.01em', textWrap: 'balance', boxShadow: '0 6px 24px rgba(0,0,0,.28)', pointerEvents: 'none', opacity: '0' });
      d.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)', offset: .1 }, { opacity: 1, transform: 'translateY(0)', offset: .88 }, { opacity: 0, transform: 'translateY(0)' }], { duration: 2700, delay: delay * 1000, fill: 'both' });
      box.appendChild(d);
    }, { text: HOOK, delay: COV + LEAD });
  }
  if (LIGHT) { // light-day end card: Aquarii sign-off over the last 2.8 s, centred, clear of Instagram's bottom and right zones
    await pg.evaluate(({ at, line }) => {
      const box = document.querySelector('#reel'); if (!box) return;
      const d = document.createElement('div'); d.setAttribute('aria-hidden', 'true');
      d.innerHTML = '<div style="font:800 40px/1 system-ui,-apple-system,sans-serif;letter-spacing:-.02em;background:linear-gradient(180deg,#B5D0FF,#5C8FFF 45%,#2450D8);-webkit-background-clip:text;background-clip:text;color:transparent">Aquarii</div>'
        + '<div style="margin-top:6px;font:600 11px/1 system-ui,sans-serif;letter-spacing:.42em;color:#8d94a8">TECH STUDIO</div>'
        + '<div style="margin-top:22px;padding:12px 22px;border-radius:99px;background:#2F6BFF;color:#fff;font:800 22px/1 system-ui,sans-serif">Comment “AQUARII”</div>'
        + '<div style="margin-top:12px;font:600 14px/1.3 system-ui,sans-serif;color:#aab1c4">' + line + '</div>';
      Object.assign(d.style, { position: 'absolute', inset: '0', zIndex: '2147483001', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: '120px',
        background: '#070B16', pointerEvents: 'none', opacity: '0', textAlign: 'center' });
      d.animate([{ opacity: 0, transform: 'scale(1.04)' }, { opacity: 1, transform: 'scale(1)', offset: .15 }, { opacity: 1, transform: 'scale(1.03)' }], { duration: 2800, delay: at * 1000, fill: 'forwards', easing: 'cubic-bezier(.16,1,.3,1)' });
      box.appendChild(d);
    }, { at: Math.max(0, videoLen - 2.8), line: ENDLINE });
  }
  await driveAll();
  const ys = [], t1 = Date.now(); let firstPerf = 0;
  for (let n = 0; n < nFrames; n++) {
    if (n > 0) { const step = Math.round((n * 1000) / FPS) - Math.round(((n - 1) * 1000) / FPS); await pg.clock.runFor(step); await driveAll(); }
    if (n === 0) firstPerf = await pg.evaluate(() => performance.now());
    ys.push(await scrollY());
    writeFileSync(join(tmp, `f${String(n).padStart(5, '0')}.jpg`), await pg.screenshot({ type: 'jpeg', quality: 97 }));
  }
  perFrameMs = (Date.now() - t1) / nFrames; if (process.env.YLOG) writeFileSync(process.env.YLOG, JSON.stringify(ys));
  audioAt = Math.max(0, COV + LEAD - (firstPerf - state.goPerf) / 1000);
  if (FORMAT === 'B') { startFrame = Math.round((COV + LEAD) * FPS); audioAt -= startFrame / FPS; } // the video begins the moment the page thaws; the music begins with it (audioAt is now relative to that first frame)
  // evenness of the scroll: frames sit exactly 1/30 s apart, so judder could only come from the scroll position itself. Count "spikes": one frame that steps
  // noticeably more than both neighbours and then falls back (a smooth ease never does that).
  const dys = []; for (let i = 1; i < ys.length; i++) if (ys[i] != null && ys[i - 1] != null) dys.push(ys[i] - ys[i - 1]);
  for (let i = 2; i < dys.length - 2; i++) { const m = Math.abs(dys[i]); if (m < 2.5) continue; moving++; const a = dys[i] - dys[i - 1], b = dys[i + 1] - dys[i]; if (a * b < 0 && Math.min(Math.abs(a), Math.abs(b)) > Math.max(3, 0.12 * m)) irregular++; }
  avgFps = FPS;
} else {
  // ---------- real-time capture (fallback): Chrome screencast frames with their own timestamps ----------
  const cdp = await ctx.newCDPSession(pg), frames = [];
  cdp.on('Page.screencastFrame', (f) => { frames.push({ ts: f.metadata.timestamp, data: f.data }); cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {}); });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: 1080, maxHeight: 1920, everyNthFrame: 1 });
  await pg.evaluate((i) => window.Reel.start(i), id);
  const t0 = Date.now();
  while (Date.now() - t0 < (LEN + 40) * 1000) { await sleep(250); state = await readState(); if (state.done) break; }
  await sleep(400);
  const sc = await pg.evaluate(() => window.__sc); await cdp.send('Page.stopScreencast');
  if (!state.done || !state.go) await fail('The player never finished (go=' + state.go + ', done=' + state.done + '). Page errors: ' + errs.join(' | '));
  D = state.D ? Math.max(6, Math.min(120, state.D)) : LEN; COV = state.cover ? 1.3 : 0; audioAt = COV + LEAD; videoLen = audioAt + D + 0.35;
  const goS = state.go / 1000, endS = goS + videoLen;
  kept = frames.filter((f) => f.ts <= endS); kept = kept.slice(Math.max(0, kept.findLastIndex((f) => f.ts <= goS)));
  if (kept.length < 30) await fail(`Only ${kept.length} frames were captured: the machine is too slow to render this template.`);
  const list = [];
  kept.forEach((f, i) => {
    const name = `f${String(i).padStart(5, '0')}.jpg`; writeFileSync(join(tmp, name), Buffer.from(f.data, 'base64'));
    const from = Math.max(f.ts, goS), to = i + 1 < kept.length ? kept[i + 1].ts : endS; list.push(`file '${name}'`, `duration ${Math.max(0.001, to - from).toFixed(4)}`);
  });
  list.push(`file 'f${String(kept.length - 1).padStart(5, '0')}.jpg'`); writeFileSync(join(tmp, 'list.txt'), list.join('\n'));
  gaps = kept.slice(1).map((f, i) => f.ts - kept[i].ts); maxGap = Math.max(...gaps); avgFps = (kept.length - 1) / (kept[kept.length - 1].ts - kept[0].ts); nFrames = kept.length;
  const yAt = (ms) => { let lo = 0, hi = sc.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (sc[m][0] <= ms) lo = m; else hi = m - 1; } return sc.length ? sc[lo][1] : 0; };
  slow = gaps.filter((g, i) => g > 0.05 && Math.abs(yAt(kept[i + 1].ts * 1000) - yAt(kept[i].ts * 1000)) > 3).length;
}

// ---------- audio: the player's generated music, rendered offline for exactly D seconds (deterministic per template) ----------
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

// ---------- encode ----------
const mp4 = join(OUT, `${id}.mp4`);
if (FORMAT === 'B' && !REALTIME && COV) { // the cover card as a still for the Instagram cover (frame ~0.85 s: card fully visible), written before the intro is trimmed away
  spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', join(tmp, `f${String(Math.round(0.85 * FPS)).padStart(5, '0')}.jpg`), '-vf', 'scale=1080:1920:flags=lanczos', '-q:v', '2', join(OUT, `${id}-cover.jpg`)]);
}
const outLen = FORMAT === 'B' && !REALTIME ? D + 0.35 : videoLen;
const inputs = REALTIME ? ['-f', 'concat', '-safe', '0', '-i', join(tmp, 'list.txt')] : ['-framerate', String(FPS), '-start_number', String(startFrame), '-i', join(tmp, 'f%05d.jpg')];
if (!NOAUDIO) { if (audioAt >= 0) inputs.push('-itsoffset', audioAt.toFixed(3), '-i', join(tmp, 'music.wav')); else inputs.push('-ss', (-audioAt).toFixed(3), '-i', join(tmp, 'music.wav')); }
const enc = ['-vf', `${REALTIME ? `fps=${FPS},` : ''}scale=1080:1920:flags=lanczos+accurate_rnd+full_chroma_int,format=yuv420p`, '-c:v', 'libx264', '-preset', 'slow', '-crf', String(CRF), '-maxrate', '18M', '-bufsize', '36M', '-profile:v', 'high', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-movflags', '+faststart', '-r', String(FPS), '-t', outLen.toFixed(2)];
if (!NOAUDIO) enc.push('-c:a', 'aac', '-b:a', '256k', '-ar', '44100', '-ac', '2', '-af', `afade=t=out:st=${(Math.max(0, audioAt) + D - 0.05).toFixed(2)}:d=0.35`);
const ff = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, ...enc, mp4], { encoding: 'utf8' });
if (ff.status !== 0) { console.error('ffmpeg failed:\n' + ff.stderr); process.exit(1); }
if (COV && !(FORMAT === 'B' && !REALTIME)) spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', '1.1', '-i', mp4, '-frames:v', '1', '-q:v', '2', join(OUT, `${id}-cover.jpg`)]);
rmSync(tmp, { recursive: true, force: true });

const pr = JSON.parse(spawnSync('ffprobe', ['-v', 'error', '-print_format', 'json', '-show_format', '-show_streams', mp4], { encoding: 'utf8' }).stdout || '{}');
const vs = (pr.streams || []).find((s) => s.codec_type === 'video') || {}, as = (pr.streams || []).find((s) => s.codec_type === 'audio');
const mbps = +((pr.format.size * 8) / pr.format.duration / 1e6).toFixed(1);
const info = { id, format: FORMAT, hook: HOOK_ON ? HOOK : null, file: mp4, mode: REALTIME ? 'realtime' : 'virtual-time', seconds: +(+pr.format.duration).toFixed(2), width: vs.width, height: vs.height, fps: vs.r_frame_rate, sizeMB: +(pr.format.size / 1e6).toFixed(1), videoMbps: mbps, audio: as ? `${as.codec_name} (${style})` : 'none', cover: !!COV, audioStartsAtSeconds: +audioAt.toFixed(3), frames: nFrames, pageErrors: errs.length,
  ...(REALTIME ? { captured: { avgFps: +avgFps.toFixed(1), maxGapMs: Math.round(maxGap * 1000), gapsOver50msWhileScrolling: slow } } : { renderSecondsPerFrame: +(perFrameMs / 1000).toFixed(2), scrollSpikes: irregular, movingFrames: moving }) };
writeFileSync(join(OUT, `${id}.json`), JSON.stringify(info, null, 2));
console.log(`${id}: ${info.seconds}s ${info.width}×${info.height} @ ${info.fps}, ${info.sizeMB} MB (${mbps} Mbps), audio ${info.audio}${COV ? ', cover card first' : ''}, ${REALTIME ? 'real-time capture' : 'virtual-time render'}`);
let smooth;
if (REALTIME) { console.log(`capture: ${nFrames} frames, avg ${avgFps.toFixed(1)} fps, longest gap ${Math.round(maxGap * 1000)} ms, ${slow} gaps > 50 ms while scrolling`); smooth = avgFps >= 24 && slow <= Math.max(3, nFrames * 0.02); }
else { console.log(`render: ${nFrames} frames at exactly ${FPS} fps, ${(perFrameMs / 1000).toFixed(2)} s per frame, scroll spikes ${irregular} in ${moving} moving frames`); smooth = moving >= 30 && irregular <= Math.max(2, moving * 0.005); }
console.log(smooth ? 'capture quality: OK' : 'capture quality: NOT SMOOTH (check the template for animation that does not follow time, or retry with --realtime)');
process.exit(smooth ? 0 : 1);
