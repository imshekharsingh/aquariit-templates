#!/usr/bin/env node
// The full check before render 1 (owner, 26 Nov 2026: "yes, build the check"; design/todo.md "Full check before render 1"; design/runbook-reels.md "Preflight").
// On 25-26 Nov most render 1s failed on things a local check could catch, and every extra render plus its session costs about $8-15. One command,
// every channel (web showreel, Turns Out, tech kit, tech picture engine), all local, no GitHub render:
//   node scripts/preflight-all.mjs <reel name | config path> [--write] [--keep] [--voice <narration.wav>] [--only-textclear]
// 1. PREVIEW: the reel at 360x640 and 10 fps (web / Turns Out: scripts/showreel/seek.mjs --preview; tech kit: techkit/capture.cjs at 1/3 scale;
//    tech picture engine: techreel/make.py --preview), with the real voice when --voice is given, else silence (the voice is a fake one: the
//    scene is timed to simulated word times, as in the stills check).
// 2. OUTPUT QA on that preview, scripts/qa/output-qa.py with its own thresholds (scale-free: it reads frames at fixed sizes), the checks that need the
//    real sound (LOUD, SOUND, DEAD, PACE, MUTE, SYNC, NUMBERS) left to the render's Output QA (SKIP, said aloud); OQA_PREVIEW=1.
// 3. TEXT CLEAR every 0.25 s: every text against everything else on the frame and against the subtitle pill (scripts/showreel/textclear.mjs + .py:
//    the frame with and without the text, 8 px of room, text against text).
// 4. REVIEW LINT: the review file's items filled, the direction card APPROVED, a PREMIUM line (all three scores 7+), the CRITIC lines in the exact
//    "CRITIC: READY" / "CRITIC: NOT READY" form.
// 5. One line: "PREFLIGHT-ALL: PASS <fingerprint>" or "PREFLIGHT-ALL: FAIL <check> <time> <what>". --write puts it in the review file;
//    scripts/review-gate.mjs refuses render 1 without a PASS whose fingerprint matches the config and scene (reels posting from 27 Nov 2026).
import { spawn, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync, readdirSync, copyFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { resolveReel, reelHash, root } from './showreel/resolve.mjs';
import { simWords } from './showreel/flow.mjs';
import { reviewProblems, reviewPath, PREFLIGHT_FROM } from './review-gate.mjs';

const argv = process.argv.slice(2), at = (k) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : null);
if (!argv[0] || argv[0].startsWith('--')) { console.error('Usage: node scripts/preflight-all.mjs <reel name | config path> [--write] [--keep] [--voice narration.wav]'); process.exit(2); }
process.chdir(root);
const T0 = Date.now(), r = resolveReel(argv[0]), { name, kind, cfg, cfgPath } = r;
const env = { ...process.env, PW_FROM: process.env.PW_FROM || (existsSync(join(root, 'node_modules/playwright')) ? join(root, 'node_modules/') : '/opt/node-tools/node_modules/'), KIT_Q: process.env.KIT_Q || '0.5' };
const work = resolve('out/preflight', name); rmSync(work, { recursive: true, force: true }); mkdirSync(work, { recursive: true });
const log = (s) => console.log(s);
const run = (cmd, args, o = {}) => new Promise((ok) => { const p = spawn(cmd, args, { env: { ...env, ...(o.env || {}) }, stdio: ['ignore', 'pipe', 'pipe'] }); let out = ''; p.stdout.on('data', (d) => { out += d; }); p.stderr.on('data', (d) => { out += d; }); p.on('close', (c) => ok({ code: c, out })); });
const fails = [];   // { check, time, what }
const fail = (check, time, what) => fails.push({ check, time, what });
const dur = kind === 'kit' ? null : kind === 'pil' ? +(cfg.dur || 20) : +cfg.dur;

// ---- 1 + 2: preview, then Output QA on it ----
const previewAndQa = async () => {
  const silent = join(work, 'preview-silent.mp4'), mp4 = join(work, 'preview.mp4'), t0 = Date.now();
  let res;
  if (kind === 'web' || kind === 'c3') {
    const words = join(work, 'words.json'); writeFileSync(words, JSON.stringify({ words: simWords(cfg).words }));
    res = await run('node', ['scripts/showreel/seek.mjs', cfgPath, silent, '--preview'], { env: { VOICE_WORDS: words } });
  } else if (kind === 'kit') {
    const b = await run('python3', ['techkit/make.py', r.slug, '--fake-vo', '--build-only']); if (b.code) { fail('PREVIEW', '-', 'techkit/make.py could not build the scene: ' + b.out.trim().split('\n').slice(-3).join(' | ')); return; }
    const out = join(root, 'out/techreel', r.slug), TL = JSON.parse(readFileSync(join(out, 'timeline.json'), 'utf8')), n = Math.ceil(TL.total * 10), fr = join(work, 'frames'); mkdirSync(fr);
    const W = 3, per = Math.ceil(n / W);   // three Chrome workers
    const caps = await Promise.all([...Array(W).keys()].filter((i) => i * per < n).map((i) => run('node', ['techkit/capture.cjs', join(out, 'scene.html'), fr, '10', String(i * per), String(Math.min(n, (i + 1) * per))], { env: { KIT_SCALE: String(360 / 1080), KITSCALE: String(360 / 1080) } })));
    const bad = caps.find((c) => c.code); if (bad) { fail('PREVIEW', '-', 'frame capture failed: ' + bad.out.trim().split('\n').slice(-2).join(' | ')); return; }
    res = await run('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '10', '-i', join(fr, 'f%05d.jpg'), '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '23', '-pix_fmt', 'yuv420p', silent]);
    const subj = readdirSync(fr).filter((f) => /^subject_\d+\.json$/.test(f)).flatMap((f) => JSON.parse(readFileSync(join(fr, f), 'utf8'))).sort((a, b) => a[0] - b[0]);
    if (subj.length) writeFileSync(join(work, 'preview.subject0.json'), JSON.stringify(subj));
  } else {
    res = await run('python3', ['techreel/make.py', r.slug, '--fake-vo', '--preview']);
    const s = join(root, 'out/techreel', r.slug, 'preview-silent.mp4'); if (existsSync(s)) copyFileSync(s, silent);
  }
  if (res.code || !existsSync(silent)) { fail('PREVIEW', '-', 'the preview did not build: ' + res.out.trim().split('\n').slice(-3).join(' | ')); return; }
  const voice = at('--voice'), pageErr = /page errors?:/i.test(res.out) ? res.out.split('\n').find((l) => /page errors?/i.test(l)) : null;
  if (pageErr) fail('PREVIEW', '-', pageErr.trim().slice(0, 200));
  const total = +(spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', silent], { encoding: 'utf8' }).stdout) || 20;
  const mux = await run('ffmpeg', ['-y', '-loglevel', 'error', '-i', silent, ...(voice ? ['-i', voice] : ['-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo']), '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-t', String(total), mp4]);
  if (mux.code) { fail('PREVIEW', '-', 'mux failed: ' + mux.out.slice(-200)); return; }
  log(`PREVIEW: ${mp4} (360x640, 10 fps, ${total.toFixed(1)} s, ${voice ? 'real voice' : 'silent: fake voice timings'}) built in ${Math.round((Date.now() - t0) / 1000)} s`);
  const qa = await run('python3', ['scripts/qa/output-qa.py', mp4, cfgPath, '--fails', join(work, 'oqa-fails.txt')], { env: { OQA_PREVIEW: '1' } });
  writeFileSync(join(work, 'oqa.txt'), qa.out);
  const lines = qa.out.split('\n').filter((l) => /^OQA /.test(l)), count = (s) => lines.filter((l) => l.startsWith('OQA ') && new RegExp(`^OQA \\S+: ${s}\\b`).test(l)).length;
  for (const l of lines.filter((x) => /: (FAIL|WARN)\b/.test(x))) log(l.replace(/ \[guards:.*$/, ''));
  log(`OUTPUT QA (preview): ${count('PASS')} pass, ${count('FAIL')} fail, ${count('WARN')} warn, ${count('SKIP')} skipped (sound and voice checks run on the render)`);
  for (const l of lines.filter((x) => /: FAIL\b/.test(x))) { const m = l.match(/^OQA (\S+): FAIL (.*?)(?: \[guards:.*)?$/), t = (m[2].match(/(\d+(?:\.\d+)?)(?:-\d+(?:\.\d+)?)? ?s\b/) || [])[1]; fail('OQA-' + m[1], t ? t + 's' : '-', m[2].slice(0, 220)); }
  if (!lines.length) fail('OQA', '-', 'Output QA printed nothing: ' + qa.out.trim().split('\n').slice(-2).join(' | '));
};

// ---- 3: TEXT CLEAR ----
const textClear = async () => {
  const dump = join(work, 'textclear'), t0 = Date.now();
  let d;
  if (kind === 'pil') d = await run('python3', ['techreel/make.py', r.slug, '--fake-vo', '--textclear', dump]);
  else {
    if (kind === 'kit') { const b = await run('python3', ['techkit/make.py', r.slug, '--fake-vo', '--build-only']); if (b.code) { fail('TEXT-CLEAR', '-', 'techkit/make.py could not build the scene'); return; } }
    const words = join(work, 'words.json'); if (kind !== 'kit' && !existsSync(words)) writeFileSync(words, JSON.stringify({ words: simWords(cfg).words }));
    d = await run('node', ['scripts/showreel/textclear.mjs', cfgPath, dump, ...(kind === 'kit' ? ['--scene', join(root, 'out/techreel', r.slug, 'scene.html')] : [])], { env: kind === 'kit' ? {} : { VOICE_WORDS: words } });
  }
  if (d.code || !existsSync(join(dump, 'meta.json'))) { fail('TEXT-CLEAR', '-', 'the pictures did not build: ' + d.out.trim().split('\n').slice(-3).join(' | ')); return; }
  const meta = JSON.parse(readFileSync(join(dump, 'meta.json'), 'utf8')); if (meta.errors && meta.errors.length) fail('TEXT-CLEAR', '-', 'page errors: ' + meta.errors[0].slice(0, 160));
  const a = await run('python3', ['scripts/showreel/textclear.py', dump, '--config', cfgPath]);
  const line = a.out.split('\n').find((l) => /^TEXT CLEAR:/.test(l)) || 'TEXT CLEAR: no result: ' + a.out.trim().slice(-200);
  log(line + ` [${Math.round((Date.now() - t0) / 1000)} s]`);
  if (/^TEXT CLEAR: FAIL/.test(line)) for (const p of line.replace(/^TEXT CLEAR: FAIL /, '').replace(/ \(\+\d+ more\)$/, '').split(' | ')) fail('TEXT-CLEAR', (p.match(/^([\d.]+)-/) || [])[1] ? p.match(/^([\d.]+)-/)[1] + 's' : '-', p.replace(/^[\d.\-]+ s: /, ''));
  else if (!/^TEXT CLEAR: ok/.test(line)) fail('TEXT-CLEAR', '-', line);
};

// ---- 4: review-file lint ----
const lint = () => {
  const caps = JSON.parse(readFileSync(join(root, 'templates/showreels/captions.json'), 'utf8')), e = caps[name];
  if (!e) { fail('REVIEW', '-', `${name} has no entry in templates/showreels/captions.json`); return; }
  const f = join(root, reviewPath(e.channel, name));
  for (const p of reviewProblems(name, e, { render: true, preflight: false })) fail('REVIEW', '-', p.replace(/^review\/[^:]*: /, '').slice(0, 220));
  if (!existsSync(f)) return;
  const txt = readFileSync(f, 'utf8').split('\n');
  // PREMIUM: "PREMIUM: animation 7/10 (..), cleanliness 7.5/10 (..), premium 7/10 (..)" or "PREMIUM 7 / 7.5 / 7"; every score 7+ (design/runbook-reels.md "Preflight")
  const pl = txt.filter((l) => /^PREMIUM\b/.test(l));
  if (!pl.length) fail('REVIEW', '-', 'no PREMIUM line (the builder\'s own Premium check, design/critic.md "Premium check"): animation, cleanliness and premium out of 10');
  else {
    const l = pl[0], m = l.match(/^PREMIUM[:\s]+(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/), named = [...l.matchAll(/\b(animation|cleanliness|premium)\s+(\d+(?:\.\d+)?)/gi)].map((x) => +x[2]);
    const s = m ? m.slice(1).map(Number) : named;
    if (s.length < 3) fail('REVIEW', '-', 'the PREMIUM line needs three scores (animation, cleanliness, premium): "PREMIUM: animation n/10 (t ..), cleanliness n/10 (t ..), premium n/10 (t ..)"');
    else if (Math.min(...s) < 7) fail('REVIEW', '-', `PREMIUM has a score under 7 (${s.join(' / ')}): fix before the render`);
  }
  for (const l of txt.filter((x) => /^\s*CRITIC\b/.test(x))) if (!/^CRITIC: (READY|NOT READY)\b/.test(l)) fail('REVIEW', '-', `a CRITIC line not in the exact form "CRITIC: READY" / "CRITIC: NOT READY" (the app cannot read it): "${l.slice(0, 50)}"`);
  if (!txt.some((l) => /^STILLS CHECK: APPROVED\b/m.test(l)) && !existsSync(join(root, `review/${e.channel}/${name}.direction.md`))) fail('REVIEW', '-', 'no direction card');
};

log(`PREFLIGHT-ALL for ${name} (${kind}, ${cfgPath})`);
lint();
const quick = argv.includes('--only-textclear');   // while fixing a scene: just step 3 (a PASS is never written from it)
await Promise.all([quick ? null : previewAndQa(), textClear()]);
const secs = Math.round((Date.now() - T0) / 1000), hash = reelHash(r);
const order = ['PREVIEW', 'OQA', 'TEXT-CLEAR', 'REVIEW'], rank = (c) => { const i = order.findIndex((o) => c.startsWith(o)); return i < 0 ? 9 : i; };
fails.sort((a, b) => rank(a.check) - rank(b.check));
for (const f of fails) log(`  FAIL ${f.check} ${f.time}: ${f.what}`);
const verdict = fails.length ? `PREFLIGHT-ALL: FAIL ${fails[0].check} ${fails[0].time} ${fails[0].what}${fails.length > 1 ? ` (+${fails.length - 1} more)` : ''}` : `PREFLIGHT-ALL: PASS ${hash} (${name}, ${secs} s)`;
log(verdict); log(`run time ${secs} s`);
if (argv.includes('--write') && !quick) {
  const caps = JSON.parse(readFileSync(join(root, 'templates/showreels/captions.json'), 'utf8')), e = caps[name];
  if (e) { const f = join(root, reviewPath(e.channel, name)); if (existsSync(f)) { const keep = readFileSync(f, 'utf8').split('\n').filter((l) => !/^PREFLIGHT-ALL:/.test(l)); while (keep.length && keep[keep.length - 1] === '') keep.pop(); writeFileSync(f, keep.join('\n') + '\n' + verdict + '\n'); log(`written to ${reviewPath(e.channel, name)}`); } }
}
if (!argv.includes('--keep')) for (const d of ['frames']) rmSync(join(work, d), { recursive: true, force: true });
process.exit(fails.length ? 1 : 0);
