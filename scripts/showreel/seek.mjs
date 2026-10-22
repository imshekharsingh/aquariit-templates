// Seekable scenes (owner, 22 Oct 2026: explainer brief): a page that exposes window.seek(t) and draws every frame as a pure function of t.
// Steps t in 1/fps increments in headless Chromium and pipes the frames straight into ffmpeg (no audio; the owner adds Instagram audio).
// Usage: node scripts/showreel/seek.mjs <config.json> <out.mp4>   config: { seek: "path/to/page.html", dur, fps, width, height }
import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { spawn } from 'child_process';
import { join, resolve } from 'path';
const require = createRequire(process.env.PW_FROM || join(process.cwd(), 'node_modules/'));
const { chromium } = require('playwright');
const [cfgPath, out] = process.argv.slice(2), R = JSON.parse(readFileSync(cfgPath, 'utf8'));
const FPS = R.fps || 60, DUR = R.dur || 30, W = R.width || 540, H = R.height || 960, N = Math.round(DUR * FPS);
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1080 / W })).newPage();
const errs = []; p.on('pageerror', (e) => errs.push(e.message));
await p.goto('file://' + resolve(R.seek)); await p.waitForSelector('html[data-ready]', { timeout: 30000 });
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
const done = new Promise((ok, no) => ff.on('close', (c) => c === 0 ? ok() : no(new Error('ffmpeg exited ' + c))));
for (let i = 0; i < N; i++) {
  await p.evaluate((t) => window.seek(t), i / FPS);
  const jpg = await p.screenshot({ type: 'jpeg', quality: 95 });
  if (!ff.stdin.write(jpg)) await new Promise((r) => ff.stdin.once('drain', r));
  if (i % (FPS * 5) === 0) console.log(`frame ${i}/${N}`);
}
ff.stdin.end(); await done; await b.close();
if (errs.length) { console.error('page errors:', errs); process.exit(1); }
console.log(`wrote ${out}: ${N} frames at ${FPS} fps`);
