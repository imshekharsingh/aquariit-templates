// Seekable scenes (owner, 22 Oct 2026: explainer brief): a page that exposes window.seek(t) and draws every frame as a pure function of t.
// Steps t in 1/fps increments in headless Chromium and pipes the frames straight into ffmpeg (no audio; the owner adds Instagram audio).
// Usage: node scripts/showreel/seek.mjs <config.json> <out.mp4> [--seconds S]
//   config: { seek: "path/to/page.html", dur, fps, width, height, blur, shutter, grain, vignette }
// Film look (owner, 22 Oct 2026: "we are missing motion design"): blur = sub-frames per frame (real motion blur: the page is drawn at
// several instants inside the shutter and ffmpeg averages them), shutter = fraction of a frame the shutter is open (0.5 = 180 degrees),
// grain = temporal film grain strength (0-20), vignette = a soft edge falloff. All off by default, so older configs render as before.
import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { spawn } from 'child_process';
import { join, resolve } from 'path';
const require = createRequire(process.env.PW_FROM || join(process.cwd(), 'node_modules/'));
const { chromium } = require('playwright');
const [cfgPath, out] = process.argv.slice(2), R = JSON.parse(readFileSync(cfgPath, 'utf8'));
const FPS = R.fps || 60, W = R.width || 540, H = R.height || 960, K = Math.max(1, R.blur | 0), SH = R.shutter ?? .5;
const sec = process.argv.indexOf('--seconds'), DUR = sec > 0 ? +process.argv[sec + 1] : (R.dur || 30), N = Math.round(DUR * FPS);   // --seconds: quick local test
const vf = [];
if (K > 1) vf.push(`tmix=frames=${K}`, `select='eq(mod(n\\,${K})\\,${K - 1})'`, `setpts=N/(${FPS}*TB)`);
if (R.grain) vf.push(`noise=alls=${R.grain}:allf=t`);
if (R.vignette) vf.push('vignette=angle=PI/12');
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });   // software WebGL for shader scenes
const p = await (await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1080 / W })).newPage();
const errs = []; p.on('pageerror', (e) => errs.push(e.message));
await p.goto('file://' + resolve(R.seek)); await p.waitForSelector('html[data-ready]', { timeout: 30000 });
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS * K), '-c:v', 'mjpeg', '-i', '-',
  ...(vf.length ? ['-vf', vf.join(',')] : []), '-r', String(FPS), '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
const done = new Promise((ok, no) => ff.on('close', (c) => c === 0 ? ok() : no(new Error('ffmpeg exited ' + c))));
for (let i = 0; i < N; i++) {
  for (let j = 0; j < K; j++) {   // K sub-frames spread over the open shutter, centred on the frame's time
    const t = Math.min(DUR, Math.max(0, (i + (K > 1 ? SH * (j / (K - 1) - .5) : 0)) / FPS));
    await p.evaluate((t) => window.seek(t), t);
    const jpg = await p.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(jpg)) await new Promise((r) => ff.stdin.once('drain', r));
  }
  if (i % (FPS * 5) === 0) console.log(`frame ${i}/${N}`);
}
ff.stdin.end(); await done; await b.close();
if (errs.length) { console.error('page errors:', errs); process.exit(1); }
console.log(`wrote ${out}: ${N} frames at ${FPS} fps` + (K > 1 ? `, motion blur ${K} sub-frames, shutter ${SH}` : '') + (R.grain ? `, grain ${R.grain}` : ''));
