// Download a reel's FINAL render (MP4 + cover + config json) from the app, so critic, review and improvement sessions judge the real video.
//   node scripts/reel-fetch.mjs <reel-name> [out-dir]      e.g. node scripts/reel-fetch.mjs showreel-45-homebar
// The key is NOT read or sent here: the session's network proxy adds "Authorization: Bearer <REELS_READ_KEY>" for the app host
// (a network secret on the environment). The key opens only GET/HEAD of /reels/<file> (src/worker.js). Reels stay private: never
// commit the files, never upload them anywhere. Output: <out-dir>/<name>.mp4, <name>-cover.jpg, <name>.json (default out-dir: reel-files/).
// Uses curl because it follows HTTPS_PROXY; Node 22's fetch does not without extra flags.
import { spawnSync } from 'node:child_process';
import { mkdirSync, statSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

const HOST = 'templates.aquariit.com';
const [raw, outArg] = process.argv.slice(2);
const name = String(raw || '').replace(/\.mp4$/, '');
if (!/^showreel-[a-z0-9-]{1,60}$/.test(name)) { console.error('Usage: node scripts/reel-fetch.mjs <showreel-name> [out-dir]   (name like showreel-45-homebar)'); process.exit(2); }
const out = resolve(outArg || 'reel-files');
mkdirSync(out, { recursive: true });

const files = [[`${name}.mp4`, true], [`${name}-cover.jpg`, false], [`${name}.json`, false]];   // [file, required]
let failed = false;
for (const [file, required] of files) {
  const dest = join(out, file);
  const r = spawnSync('curl', ['-sS', '--connect-timeout', '15', '--max-time', '600', '--retry', '3', '--retry-delay', '5',
    '-o', dest, '-w', '%{http_code}', `https://${HOST}/reels/${file}`], { encoding: 'utf8' });
  const code = +(r.stdout || '').trim().slice(-3) || 0;
  if (code === 200) { console.log(`OK   ${file}  ${(statSync(dest).size / 1e6).toFixed(2)} MB -> ${dest}`); continue; }
  rmSync(dest, { force: true });
  const proxyNo = !code && /CONNECT tunnel failed, response 40[37]/.test(r.stderr || '');   // the proxy allows the host only once the network secret exists
  if (code === 401 || code === 403 || proxyNo) {
    console.error(`FAIL ${file}: ${proxyNo ? 'the network proxy refused the host' : `HTTP ${code}`}. The read key is not set up yet (REELS_READ_KEY as a GitHub + Worker secret, and as a network secret`
      + ` for ${HOST} on this session's environment), or this session's environment does not have it. Do not judge from scene frames silently: say so in the review.`);
    process.exit(3);
  }
  if (code === 404) { console[required ? 'error' : 'log'](`${required ? 'FAIL' : 'skip'} ${file}: not in the app (404; MP4s are kept 15 days after upload)`); if (required) failed = true; continue; }
  console.error(`FAIL ${file}: ${code ? `HTTP ${code}` : 'no connection'}${r.stderr ? ` (${r.stderr.trim().split('\n').pop()})` : ''}`);
  if (required) failed = true;
}
if (failed) process.exit(1);
console.log('Next: frames at phone size every 0.25 s and the audio levels (design/critic.md, top).');
