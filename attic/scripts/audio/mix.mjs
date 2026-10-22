// Step 6: mix and master.   node scripts/audio/mix.mjs ID [--music FILE] [--sfx-gain 0.5]
// music bed (edited to picture) + sound effects + master: the music is ducked 3 dB under every impact, carved at 2-4 kHz so SFX transients are not masked, high-passed,
// bus-compressed gently, limited, then loudness-normalised to -14 LUFS integrated with true peak <= -1 dBTP (checked again after AAC encoding, which can overshoot).
import { join } from 'node:path';
import { readAudio, writeWav, readJson, writeJson, audioDir, timing, SR, run, loudness } from './lib.mjs';
import { analyze } from './analyze.mjs';
import { writeSfx } from '../film/sfx.mjs';

function normalize(inp, out, tp) {
  const m = run('ffmpeg', ['-hide_banner', '-i', inp, '-af', `loudnorm=I=-14:TP=${tp}:LRA=11:print_format=json`, '-f', 'null', '-'], { soft: true }), j = JSON.parse(m.stderr.slice(m.stderr.lastIndexOf('{')));
  run('ffmpeg', ['-y', '-loglevel', 'error', '-i', inp, '-af', `loudnorm=I=-14:TP=${tp}:LRA=11:measured_I=${j.input_i}:measured_TP=${j.input_tp}:measured_LRA=${j.input_lra}:measured_thresh=${j.input_thresh}:offset=${j.target_offset}:linear=true,aresample=${SR}`, '-ar', String(SR), '-c:a', 'pcm_f32le', out]);
}
export async function mixFilm(id, o = {}) {
  const dir = o.out || audioDir(id), T = timing(id), brief = readJson(join(dir, 'brief.json')), N = Math.round(T.len * SR), log = { sfxGain: o.sfxGain ?? 0.5 };
  // stems: music filtered (HPF 30 Hz, -2 dB carve around 2.8 kHz), SFX filtered (HPF 90 Hz)
  const mFile = join(dir, 'mix-music.wav'), sRaw = join(dir, 'sfx-raw.wav'), sFile = join(dir, 'mix-sfx.wav');
  run('ffmpeg', ['-y', '-loglevel', 'error', '-i', o.music || join(dir, 'music-edit.wav'), '-af', 'highpass=f=30,equalizer=f=2800:t=q:w=1.2:g=-2', '-ar', String(SR), '-c:a', 'pcm_f32le', mFile]);
  await writeSfx(sRaw, T, { raw: true });
  run('ffmpeg', ['-y', '-loglevel', 'error', '-i', sRaw, '-af', 'highpass=f=90', '-ar', String(SR), '-c:a', 'pcm_f32le', sFile]);
  const m = readAudio(mFile), s = readAudio(sFile), L = new Float32Array(N), R = new Float32Array(N), env = new Float32Array(N).fill(1);
  // sidechain-style duck: -3 dB under each impact (8 ms attack, 120 ms hold, 450 ms release)
  const impacts = (T.cues || []).filter((c) => c.k === 'impact').map((c) => c.t), depth = Math.pow(10, -3 / 20);
  for (const t of impacts) for (let i = Math.max(0, Math.round((t - 0.008) * SR)); i < Math.min(N, Math.round((t + 0.58) * SR)); i++) { const x = i / SR - t, g = x < 0 ? 1 - (1 - depth) * (1 + x / 0.008) : x < 0.12 ? depth : depth + (1 - depth) * (x - 0.12) / 0.45; env[i] = Math.min(env[i], g); }
  log.duckedUnder = impacts; log.duckDb = -3;
  for (let i = 0; i < N; i++) { L[i] = (i < m.n ? m.L[i] : 0) * env[i] + (i < s.n ? s.L[i] : 0) * log.sfxGain; R[i] = (i < m.n ? m.R[i] : 0) * env[i] + (i < s.n ? s.R[i] : 0) * log.sfxGain; }
  const pre = join(dir, 'mix-pre.wav'), bus = join(dir, 'mix-bus.wav'), final = join(dir, 'final.wav'); writeWav(pre, L, R);
  run('ffmpeg', ['-y', '-loglevel', 'error', '-i', pre, '-af', 'acompressor=threshold=0.2:ratio=2:attack=20:release=250:makeup=1.2,alimiter=limit=0.9:attack=3:release=40', '-c:a', 'pcm_f32le', bus]);
  // loudness to -14 LUFS, then a final true-peak limiter; AAC encoding overshoots the PCM peak by 1-2 dB, so the limit is lowered until the ENCODED audio is at or under -1 dBTP
  let limit = 0.72, tries = 0, ld, aac, tp = -2;
  const tmpN = join(dir, 'mix-norm.wav');
  normalize(bus, tmpN, tp);
  for (;;) {
    run('ffmpeg', ['-y', '-loglevel', 'error', '-i', tmpN, '-af', `alimiter=limit=${limit.toFixed(4)}:attack=2:release=30:level=disabled`, '-c:a', 'pcm_f32le', final]); ld = loudness(final);
    run('ffmpeg', ['-y', '-loglevel', 'error', '-i', final, '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', join(dir, 'final-check.m4a')]); aac = loudness(join(dir, 'final-check.m4a'));
    if (aac.truePeakDb <= -1.0 || ++tries > 4) break; limit *= Math.pow(10, -(aac.truePeakDb + 1.0 + 0.15) / 20);
  }
  const A = analyze(final, brief, dir, 'final');
  Object.assign(log, { lufs: ld.lufs, truePeakDb: ld.truePeakDb, truePeakAfterAacDb: aac.truePeakDb, lra: ld.lra, limiter: +limit.toFixed(3), phoneBandFraction: A.phoneBandFraction, ok: Math.abs(ld.lufs + 14) <= 0.8 && aac.truePeakDb <= -1.0 && A.phoneBandFraction >= 0.15 });
  writeJson(join(dir, 'mix.json'), log); return { final, log };
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const a = process.argv.slice(2), id = a[0], opt = (n) => { const i = a.indexOf(n); return i > -1 ? a[i + 1] : ''; };
  if (!id) { console.error('usage: mix.mjs ID [--music FILE] [--sfx-gain 0.5]'); process.exit(2); }
  const r = await mixFilm(id, { music: opt('--music') || null, sfxGain: opt('--sfx-gain') ? +opt('--sfx-gain') : undefined }); console.log(JSON.stringify(r.log, null, 1)); process.exit(r.log.ok ? 0 : 1);
}
