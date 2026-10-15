// Voice-over for tutorial films (step 1 of 3, 14 Oct 2026). Runs ONLY in GitHub Actions (.github/workflows/voice-test.yml), never in a Claude session.
//   node scripts/film/voice.mjs ID [--out DIR]       reads film/ID/voice.md, writes DIR/{voice.wav, voice-timing.json, final.wav, voice-report.json}
// 1. checks the script: words per shot (target ~2.5/s, fail above 3/s) and that speech fits the 18 s film
// 2. speaks it with Kokoro (scripts/film/voice_kokoro.py; open-weight, pinned in the workflow); word times come from the model's durations
// 3. mixes: voice high-passed at 80 Hz, de-essed, gently compressed, loudness -16 LUFS; the film's effects ducked 6 dB under every spoken line;
//    true peak <= -1 dBTP; leaves headroom for the Instagram music added at posting. Loudness is MEASURED with ffmpeg ebur128, never assumed.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { writeSfx } from './sfx.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..'), args = process.argv.slice(2), id = args[0];
const OUT = args.includes('--out') ? args[args.indexOf('--out') + 1] : join('out', 'voice', id);
const run = (cmd, a, soft) => { const r = spawnSync(cmd, a, { encoding: 'utf8', maxBuffer: 1 << 28 }); if (r.status !== 0 && !soft) throw new Error(cmd + ' failed\n' + (r.stderr || '').slice(-1500)); return r; };
mkdirSync(OUT, { recursive: true });
const T = JSON.parse(readFileSync(join(root, 'film', id, 'timing.json'), 'utf8')), LEN = T.len || 18;

// ---- 1. the script ----
const lines = readFileSync(join(root, 'film', id, 'voice.md'), 'utf8').split('\n').map((l) => l.match(/^- \[([\d.]+)-([\d.]+)\]\s+(.+)$/)).filter(Boolean)
  .map(([, a, b, text]) => ({ t0: +a, t1: +b, text: text.trim(), words: text.trim().split(/\s+/).length }));
let bad = 0;
for (const l of lines) { l.wps = +(l.words / (l.t1 - l.t0)).toFixed(2); const flag = l.wps > 3 ? 'TOO FAST' : l.wps > 2.6 ? 'brisk' : 'ok';
  if (l.wps > 3 || l.t1 > LEN - .4) bad++; console.log(`  [${l.t0}-${l.t1}] ${l.words} words, ${l.wps} w/s ${flag}: ${l.text}`); }
if (!lines.length || bad) { console.error('voice.md: fix the lines above (max 3 words/s, speech must end before', LEN - .4, 's)'); process.exit(1); }

// ---- 2. speak ----
const lj = join(OUT, 'lines.json'), raw = join(OUT, 'voice-raw.wav'), tj = join(OUT, 'voice-timing.json');
writeFileSync(lj, JSON.stringify(lines));
// voice: a `Voice: name` line in voice.md wins; otherwise the rotation test (owner, 15 Oct 2026) picks one of six by film date, so consecutive reels differ.
// Results per voice are compared in design/experiments.md (E13); the winner becomes the one Aquarii voice.
const VOICES = ['af_heart', 'am_michael', 'bf_emma', 'am_fenrir', 'af_bella', 'bm_george'];
const md = readFileSync(join(root, 'film', id, 'voice.md'), 'utf8'), pinned = (md.match(/^Voice:\s*([a-z]{2}_[a-z]+)/m) || [])[1];
const day = Math.floor(Date.parse(id.slice(0, 10)) / 864e5), voiceName = pinned || VOICES[day % VOICES.length];
console.log('voice:', voiceName, pinned ? '(pinned in voice.md)' : '(rotation)');
const py = run('python3', [join(root, 'scripts/film/voice_kokoro.py'), lj, raw, tj, voiceName]); process.stdout.write(py.stdout);
const VT = JSON.parse(readFileSync(tj, 'utf8'));
for (const s of VT.lines) { const l = lines[s.line]; if (s.end > l.t1 + .35) console.log(`::warning::line ${s.line + 1} runs ${(s.end - l.t1).toFixed(2)} s past its shot`); }
const speechEnd = Math.max(...VT.lines.map((s) => s.end));
if (speechEnd > LEN - .2) { console.error('speech overruns the film:', speechEnd, 's'); process.exit(1); }

// ---- 3. mix ----
const vProc = join(OUT, 'voice.wav'), sfx = join(OUT, 'sfx.wav'), final = join(OUT, 'final.wav');
const vChain = 'highpass=f=80,deesser=i=0.35:m=0.5:f=0.5,acompressor=threshold=0.1:ratio=3:attack=5:release=120:makeup=1.5';
const m = run('ffmpeg', ['-hide_banner', '-i', raw, '-af', `${vChain},loudnorm=I=-16:TP=-1.5:LRA=7:print_format=json`, '-f', 'null', '-'], true);
const j = JSON.parse(m.stderr.slice(m.stderr.lastIndexOf('{'), m.stderr.lastIndexOf('}') + 1));
run('ffmpeg', ['-y', '-loglevel', 'error', '-i', raw, '-af', `${vChain},loudnorm=I=-16:TP=-1.5:LRA=7:measured_I=${j.input_i}:measured_TP=${j.input_tp}:measured_LRA=${j.input_lra}:measured_thresh=${j.input_thresh}:offset=${j.target_offset}:linear=true,aresample=48000`, '-ac', '2', '-c:a', 'pcm_f32le', vProc]);
await writeSfx(sfx, T, { raw: true });
const duck = VT.lines.map((s) => `between(t,${(s.start - .08).toFixed(2)},${(s.end + .15).toFixed(2)})`).join('+');   // effects -6 dB under speech
run('ffmpeg', ['-y', '-loglevel', 'error', '-i', vProc, '-i', sfx, '-filter_complex',
  `[1:a]aresample=48000,highpass=f=90,volume=0.45,volume=0.501:enable='${duck}'[s];[0:a][s]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.84:attack=3:release=50:level=disabled,atrim=0:${LEN}[o]`,
  '-map', '[o]', '-c:a', 'pcm_f32le', final]);
const meter = (f) => { const r = run('ffmpeg', ['-hide_banner', '-nostats', '-i', f, '-af', 'ebur128=peak=true', '-f', 'null', '-'], true).stderr;
  const num = (re) => { const x = r.match(re); return x ? +x[1] : null; }; return { lufs: num(/I:\s+(-?[\d.]+) LUFS/), lra: num(/LRA:\s+(-?[\d.]+) LU/), truePeak: num(/Peak:\s+(-?[\d.]+) dBFS/) }; };
const report = { id, engine: VT.engine, voiceName: VT.voice, model: VT.model, lines: lines.map(({ t0, t1, words, wps, text }) => ({ t0, t1, words, wps, text })),
  speechEnd, voice: meter(vProc), final: meter(final), duckDb: -6, target: { voiceLufs: -16, truePeak: -1 } };
writeFileSync(join(OUT, 'voice-report.json'), JSON.stringify(report, null, 1));
console.log('voice (measured):', JSON.stringify(report.voice), ' final mix (measured):', JSON.stringify(report.final));
if (report.final.truePeak != null && report.final.truePeak > -1) console.log('::warning::true peak above -1 dBTP:', report.final.truePeak);
console.log('wrote', final);
