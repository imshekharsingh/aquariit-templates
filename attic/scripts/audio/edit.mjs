// Step 4: edit the chosen music to picture.   node scripts/audio/edit.mjs ID --track FILE [--stems DIR] [--out DIR]
//  - tempo: a track within 3% of the brief's BPM is time-stretched (ffmpeg rubberband, transient-preserving) so the beat grid lands on the cuts
//  - the strongest downbeat (a bar line) is placed exactly on the peak/hero reveal timestamp; cuts and extensions happen ONLY on bar boundaries
//  - the breath: the music is choked to silence for the brief's breath window (15 ms fades), so the reveal hits out of a vacuum
//  - the loop: the last beat is cross-faded into the material that precedes the opening downbeat, so the end leads straight back into the start
//  - stems (optional): drums/bass/etc. are edited identically and muted per film/ID/music-brief.json "stemPlan" instead of editing the full mix
import { join } from 'node:path';
import { existsSync, readdirSync } from 'node:fs';
import { readAudio, writeWav, readJson, writeJson, audioDir, SR, run, filmDir } from './lib.mjs';
import { analyze } from './analyze.mjs';

const ramp = (n) => Float32Array.from({ length: n }, (_, i) => i / Math.max(1, n - 1));
function stretch(path, ratio, out) { run('ffmpeg', ['-y', '-loglevel', 'error', '-i', path, '-filter:a', `rubberband=tempo=${ratio.toFixed(6)}:transients=crisp:detector=percussive:window=short`, '-ar', String(SR), out]); return out; }

export function editToPicture(id, trackPath, o = {}) {
  const dir = o.out || audioDir(id), brief = readJson(join(dir, 'brief.json')), A0 = analyze(trackPath, brief, null), log = { source: trackPath, analysis: { tempoBpm: A0.tempoBpm, downbeatSec: A0.downbeatSec, alignmentScore: A0.alignmentScore } };
  if (A0.rejects.length) throw new Error('track was rejected by the evaluator: ' + A0.rejects.join('; '));
  const beat = brief.beatSec, bar = brief.barSec, L = brief.durationSec, N = Math.round(L * SR), peak = brief.peak;
  // tempo correction
  let ratio = brief.bpm / A0.tempoBpm, src = trackPath;
  if (Math.abs(ratio - 1) > 0.0015) { if (Math.abs(ratio - 1) > 0.03) throw new Error(`tempo ${A0.tempoBpm} is too far from ${brief.bpm}`); src = stretch(trackPath, ratio, join(dir, 'stretched.wav')); log.tempoStretch = +ratio.toFixed(5); } else ratio = 1;
  const A1 = ratio === 1 ? A0 : analyze(src, brief, null), d0 = A1.downbeatSec;   // re-measure after the stretch (time-stretching shifts transients by a few ms)
  log.afterStretch = ratio === 1 ? null : { tempoBpm: A1.tempoBpm, downbeatSec: A1.downbeatSec };
  // which bar line becomes the peak? the one (at or after the peak time, at most 12 s later) whose onset is strongest: that is the track's own "drop"
  const strength = (t) => Math.max(0, ...A1.onsets.filter((x) => Math.abs(x.t - t) < 0.05).map((x) => x.v));
  const cands = []; for (let k = 0; ; k++) { const t = d0 + k * bar; if (t > peak + 12) break; if (t >= peak - 0.06) cands.push({ t, v: strength(t) }); }
  const best = cands.reduce((b, c) => (c.v > b.v + 0.3 ? c : b), cands[0] || { t: peak, v: 0 });
  const onsetNear = A1.onsets.map((x) => ({ t: x.t, v: x.v })).filter((x) => Math.abs(x.t - best.t) < 0.06).sort((a, b) => b.v - a.v)[0], p = onsetNear ? onsetNear.t : best.t, s = p - peak;   // snap to the real onset of the drop   // s = track time that becomes film time 0
  log.barLineAtPeak = +p.toFixed(3); log.startOffsetSec = +s.toFixed(3); log.peakOnsetStrength = +best.v.toFixed(2); log.peakIsBarAligned = Math.abs(peak / bar - Math.round(peak / bar)) < 1e-6;
  if (s < -0.06) throw new Error(`the track has no bar line within 60 ms of ${peak}s (nearest at ${p.toFixed(2)}s)`);
  const stems = o.stems ? readdirSync(o.stems).filter((f) => /\.(wav|mp3|flac|m4a)$/i.test(f)).map((f) => ({ name: f.replace(/\.[^.]+$/, ''), path: join(o.stems, f) })) : [{ name: 'mix', path: src }];
  const plan = (readJson(join(filmDir(id), 'music-brief.json'), {}).stemPlan) || [];
  const mixL = new Float32Array(N), mixR = new Float32Array(N);
  for (const st of stems) {
    const a = readAudio(st.path), outL = new Float32Array(N), outR = new Float32Array(N), off = Math.round(s * SR);
    // read [s, s+L] with bar-aligned looping when the track is too short: repeat the last two whole bars
    const total = a.n, get = (ch, i) => { // i = track sample index (may run past the end)
      if (i < 0) return 0; if (i < total) return ch[i];
      const endBar = Math.floor((total / SR - d0) / bar), loopStart = Math.round((d0 + Math.max(0, endBar - 2) * bar) * SR), loopEnd = Math.round((d0 + endBar * bar) * SR), len = loopEnd - loopStart; return ch[loopStart + ((i - loopEnd) % len)];
    };
    if ((s + L) * SR > total) log.extendedBars = true;
    for (let i = 0; i < N; i++) { outL[i] = get(a.L, off + i); outR[i] = get(a.R, off + i); }
    // loop: the last beat leads back into the opening (cross-fade with what precedes the opening downbeat)
    const xf = Math.round(beat * SR);
    if (off >= xf) { const w = ramp(xf); for (let i = 0; i < xf; i++) { const k = N - xf + i, wi = Math.sin(w[i] * Math.PI / 2), wo = Math.cos(w[i] * Math.PI / 2); outL[k] = outL[k] * wo + a.L[off - xf + i] * wi; outR[k] = outR[k] * wo + a.R[off - xf + i] * wi; } log.loopCrossfade = 'last beat <- material before the opening bar line'; }
    else { for (let i = 0; i < xf; i++) { const g = 1 - i / xf; outL[N - xf + i] *= g; outR[N - xf + i] *= g; } log.loopCrossfade = 'fade-out (the track starts at its beginning, nothing precedes the bar line)'; }
    // stem plan mutes
    for (const pl of plan.filter((x) => x.stem === st.name)) for (const [m0, m1] of [pl.mute]) { const i0 = Math.round(m0 * SR), i1 = Math.round(m1 * SR); for (let i = i0; i < i1 && i < N; i++) { outL[i] = 0; outR[i] = 0; } log.stemMutes = (log.stemMutes || []).concat([`${st.name} ${m0}-${m1}s`]); }
    for (let i = 0; i < N; i++) { mixL[i] += outL[i]; mixR[i] += outR[i]; }
  }
  // the breath: choke to silence with short fades
  const [b0, b1] = brief.breath || []; if (b0 != null) { const f = Math.round(0.015 * SR), i0 = Math.round(b0 * SR), i1 = Math.round(b1 * SR); for (let i = i0 - f; i < i1 + f; i++) { if (i < 0 || i >= N) continue; const g = i < i0 ? 1 - (i - (i0 - f)) / f : i >= i1 ? (i - i1) / f : 0; mixL[i] *= g; mixR[i] *= g; } log.breath = [b0, b1]; }
  const outPath = join(dir, 'music-edit.wav'); writeWav(outPath, mixL, mixR);
  // verify what we did (analysis of the edited result)
  const V = analyze(outPath, brief, dir, 'music-edit');
  log.verify = { tempoBpm: V.tempoBpm, downbeatSec: V.downbeatSec, downbeatOnBarLine: Math.abs(((V.downbeatSec % bar) + bar) % bar) < 0.03 || Math.abs(((V.downbeatSec % bar) + bar) % bar - bar) < 0.03, alignmentScore: V.alignmentScore, hits: V.hits.map((h) => `${h.t}s ${h.onsetErrMs}ms`), arc: V.arc, breathDipDb: V.arc.breathDipDb };
  writeJson(join(dir, 'edit.json'), log); return { outPath, log, verify: V };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const a = process.argv.slice(2), id = a[0], opt = (n) => { const i = a.indexOf(n); return i > -1 ? a[i + 1] : ''; };
  if (!id || !opt('--track')) { console.error('usage: edit.mjs ID --track FILE [--stems DIR] [--out DIR]'); process.exit(2); }
  const r = editToPicture(id, opt('--track'), { stems: opt('--stems') || null, out: opt('--out') || null }); console.log(JSON.stringify(r.log, null, 1));
}
