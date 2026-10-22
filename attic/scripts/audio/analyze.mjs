// Step 3 of the Music & Sound process: evaluate a music candidate by ANALYSIS (nobody can listen in the pipeline). Pure Node + ffmpeg, no Python needed.
//   node scripts/audio/analyze.mjs FILE --brief audio/<date>/<ID>/brief.json [--out DIR]
// Reports: tempo and beat grid (stability), downbeat phase, onset alignment with the storyboard hit points, energy arc (intro -> build -> breath -> peak),
// loudness and dynamics, clipping, phone-speaker band, plus a spectrogram and an energy plot as images (hit points, beats and sections drawn on them).
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { createRequire } from 'node:module';
import { readAudio, loudness, readJson, writeJson, run } from './lib.mjs';

const HOP = 240, N = 1024, SR2 = 24000, FR = HOP / SR2;   // 10 ms frames at 24 kHz
const dB = (x) => 20 * Math.log10(Math.max(x, 1e-9));
const mean = (a) => a.reduce((s, x) => s + x, 0) / (a.length || 1), std = (a) => { const m = mean(a); return Math.sqrt(mean(a.map((x) => (x - m) ** 2))); };

function fft(re, im) { // in-place radix-2
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) { let bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; } }
  for (let len = 2; len <= n; len <<= 1) { const ang = -2 * Math.PI / len, wr = Math.cos(ang), wi = Math.sin(ang); for (let i = 0; i < n; i += len) { let cr = 1, ci = 0; for (let k = 0; k < len / 2; k++) { const a = i + k, b = a + len / 2, tr = re[b] * cr - im[b] * ci, ti = re[b] * ci + im[b] * cr; re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti; const nr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = nr; } } }
}
// decode to mono 24 kHz
function mono24(path) {
  const a = readAudio(path), m = new Float64Array(Math.floor(a.n / 2));
  for (let i = 0; i < m.length; i++) m[i] = (a.L[2 * i] + a.R[2 * i] + a.L[2 * i + 1] + a.R[2 * i + 1]) / 4;
  let peak = 0, clip = 0; for (let i = 0; i < a.n; i++) { const v = Math.max(Math.abs(a.L[i]), Math.abs(a.R[i])); if (v > peak) peak = v; if (v >= 0.999) clip++; }
  return { x: m, sec: a.n / 48000, peak, clipFraction: clip / a.n };
}
function spectra(x) {
  const F = Math.floor((x.length - N) / HOP), win = new Float64Array(N).map((_, i) => 0.5 - 0.5 * Math.cos(2 * Math.PI * i / N)), edges = Array.from({ length: 25 }, (_, i) => 40 * Math.pow(11000 / 40, i / 24)), binHz = SR2 / N;
  const bands = Array.from({ length: F }, () => new Float64Array(24)), low = new Float64Array(F), tot = new Float64Array(F), phone = new Float64Array(F), re = new Float64Array(N), im = new Float64Array(N);
  for (let f = 0; f < F; f++) {
    for (let i = 0; i < N; i++) { re[i] = x[f * HOP + i] * win[i]; im[i] = 0; } fft(re, im);
    for (let b = 1; b < N / 2; b++) { const p = re[b] * re[b] + im[b] * im[b], hz = b * binHz; tot[f] += p; if (hz >= 200 && hz <= 5000) phone[f] += p; if (hz >= 40 && hz <= 150) low[f] += p; for (let k = 0; k < 24; k++) if (hz >= edges[k] && hz < edges[k + 1]) { bands[f][k] += p; break; } }
  }
  return { F, bands, low, tot, phone };
}
function onsetEnv(S) {
  const o = new Float64Array(S.F);
  for (let f = 1; f < S.F; f++) { let s = 0; for (let k = 0; k < 24; k++) s += Math.max(0, Math.log1p(1e-3 * S.bands[f][k]) - Math.log1p(1e-3 * S.bands[f - 1][k])); o[f] = s; }
  const w = Math.round(0.4 / FR), out = new Float64Array(S.F); // subtract a local mean, keep the positive part
  for (let f = 0; f < S.F; f++) { let s = 0, c = 0; for (let j = Math.max(0, f - w); j <= Math.min(S.F - 1, f + w); j++) { s += o[j]; c++; } out[f] = Math.max(0, o[f] - s / c); }
  const sd = std(out) || 1; return out.map((v) => v / sd);
}
function tempoOf(o, lo = 0, hi = o.length) {
  const seg = o.slice(lo, hi), n = seg.length; let best = { bpm: 0, v: -1 };
  const ac = (lag) => { let s = 0; for (let i = lag; i < n; i++) s += seg[i] * seg[i - lag]; return s / (n - lag); };
  const lags = []; for (let bpm = 65; bpm <= 190; bpm += 0.25) { const lag = 60 / bpm / FR; lags.push([bpm, lag]); }
  for (const [bpm, lag] of lags) { const l0 = Math.floor(lag), fr = lag - l0, v = (1 - fr) * ac(l0) + fr * ac(l0 + 1), prior = Math.exp(-0.5 * (Math.log2(bpm / 112) / 0.75) ** 2), vv = v * (0.6 + 0.4 * prior) + 0.15 * (ac(Math.round(2 * lag)) + ac(Math.round(lag / 2))) * prior; if (vv > best.v) best = { bpm, v: vv }; }
  return best;
}
function beatGrid(o, bpm) { // phase search + per-beat snapping to the nearest onset peak
  const tau = 60 / bpm / FR, n = o.length; let bestPh = 0, bestV = -1;
  for (let ph = 0; ph < tau; ph += 0.25) { let s = 0; for (let t = ph; t < n - 1; t += tau) { const i = Math.floor(t); s += o[i] * (1 - (t - i)) + o[i + 1] * (t - i); } if (s > bestV) { bestV = s; bestPh = ph; } }
  const beats = []; for (let t = bestPh; t < n - 2; t += tau) { let bi = Math.round(t), bv = -1; for (let j = Math.round(t - tau / 8); j <= Math.round(t + tau / 8); j++) if (j > 0 && j < n && o[j] > bv) { bv = o[j]; bi = j; } const a = o[bi - 1] ?? 0, b = o[bi], c = o[bi + 1] ?? 0, d = a - 2 * b + c, fr = d < 0 ? 0.5 * (a - c) / d : 0; beats.push({ t: (bi + fr) * FR, snapped: (bi + fr) * FR - t * FR, v: bv }); }
  return beats;
}
function peaks(o, thr, minGap = 0.06) {
  const out = []; for (let i = 2; i < o.length - 2; i++) if (o[i] > thr && o[i] >= o[i - 1] && o[i] >= o[i + 1] && o[i] >= o[i - 2] && o[i] >= o[i + 2]) { if (out.length && (i - out[out.length - 1].i) * FR < minGap) { if (o[i] > out[out.length - 1].v) out[out.length - 1] = { i, v: o[i] }; } else out.push({ i, v: o[i] }); }
  return out.map((p) => { const a = o[p.i - 1], b = o[p.i], c = o[p.i + 1], d = a - 2 * b + c; return { i: p.i + (d < 0 ? 0.5 * (a - c) / d : 0), v: p.v }; });
}
const FRAME_BIAS = +(process.env.FRAME_BIAS ?? 0.016); // seconds; calibrated with the self-test click/kick track

// the spectral-flux peak is only accurate to ~15 ms (42 ms windows); find the real attack in the waveform: the first sharp rise of the 1 ms envelope
function refineOnset(x, t) {
  const k = 24, i0 = Math.max(k, Math.round((t - 0.05) * SR2)), i1 = Math.min(x.length - 1, Math.round((t + 0.07) * SR2)), n = Math.max(0, i1 - i0), env = new Float64Array(n); let peak = 0, run = 0;
  for (let i = i0 - k; i < i0; i++) run += Math.abs(x[i]);                       // prime the moving sum with the samples before the window
  for (let i = i0; i < i1; i++) { run += Math.abs(x[i]) - Math.abs(x[i - k]); env[i - i0] = run / k; if (env[i - i0] > peak) peak = env[i - i0]; }
  // the attack is the first sharp RISE (the envelope at least doubles within 0.5 ms) reaching at least 25% of the local peak: a decaying tail of an earlier note is not an attack
  for (let j = 0; j < n - 12; j++) if (env[j + 12] >= Math.max(2 * env[j], 0.25 * peak)) { let b = j; while (b > 0 && env[b - 1] < env[b]) b--; return (i0 + b - k / 2) / SR2; }
  return t;
}
export function analyze(path, brief, outDir, name = basename(path)) {
  const A = mono24(path), S = spectra(A.x), O = onsetEnv(S), dur = A.sec;
  const T = tempoOf(O), tA = tempoOf(O, 0, Math.floor(O.length / 2)), tB = tempoOf(O, Math.floor(O.length / 2), O.length);
  let beats = beatGrid(O, T.bpm).map((b) => ({ ...b, t: b.t + FRAME_BIAS }));
  // refine the tempo: least-squares line through the snapped beat times (period = slope), then track the beats again at that tempo
  const fit = (bs) => { const n = bs.length, mx = (n - 1) / 2, my = mean(bs.map((b) => b.t)); let sxy = 0, sxx = 0; bs.forEach((b, i) => { sxy += (i - mx) * (b.t - my); sxx += (i - mx) ** 2; }); const P = sxy / sxx; return { P, a: my - P * mx }; };
  for (let it = 0; it < 2 && beats.length > 8; it++) { const { P } = fit(beats); T.bpm = 60 / P; beats = beatGrid(O, T.bpm).map((b) => ({ ...b, t: b.t + FRAME_BIAS })); }
  const { P: PP, a: A0t } = fit(beats), grid = PP; T.bpm = 60 / PP;
  const ibi = beats.slice(1).map((b, i) => b.t - beats[i].t);
  // grid residual: how far the beats sit from a perfect grid (rms, ms); tempo drift: first half vs second half
  const resid = beats.map((b, i) => b.t - (A0t + i * grid)), residRms = Math.sqrt(mean(resid.map((r) => r * r))) * 1000, drift = Math.abs(tA.bpm - tB.bpm) / T.bpm;
  const clarity = mean(beats.map((b) => b.v)) / (mean(Array.from(O)) || 1);
  // downbeat: the beat of the 4 phases whose beats carry the most low-frequency (kick) energy
  const lowAt = (t) => S.low[Math.min(S.F - 1, Math.max(0, Math.round((t - FRAME_BIAS) / FR)))] || 0;
  const phaseE = [0, 1, 2, 3].map((k) => mean(beats.filter((_, i) => i % 4 === k).map((b) => lowAt(b.t)))), k0 = phaseE.indexOf(Math.max(...phaseE)), downbeat0 = beats[k0] ? beats[k0].t : 0;
  const onLater = null;
  const on = peaks(O, Math.max(1.0, mean(Array.from(O)) + 0.8 * std(Array.from(O)))).map((p) => ({ t: refineOnset(A.x, p.i * FR + FRAME_BIAS), v: p.v }));
  const dn = on.filter((o) => Math.abs(o.t - downbeat0) < 0.04).sort((a, b) => b.v - a.v)[0], downbeat = dn ? dn.t : downbeat0;
  // alignment of storyboard hit points with real onsets (and with the beat grid)
  const hits = (brief.hits || []).map((h) => { const near = on.reduce((b, o) => (Math.abs(o.t - h.t) < Math.abs(b.t - h.t) ? o : b), { t: 1e9, v: 0 }), err = near.t - h.t, g = ((h.t - downbeat) / grid), gridErr = Math.abs(g - Math.round(g)) * grid; return { ...h, onsetErrMs: Math.round(err * 1000), onsetStrength: +near.v.toFixed(2), gridErrMs: Math.round(gridErr * 1000), score: Math.max(0, 1 - Math.abs(err) / 0.08) }; });
  const alignment = hits.length ? mean(hits.map((h) => h.score)) : null;
  // energy over time (0.25 s windows, dB) and the arc checks
  const mono = A.x, W = Math.round(0.25 * SR2), E = []; for (let i = 0; i + W <= mono.length; i += W) { let s = 0; for (let j = 0; j < W; j++) s += mono[i + j] ** 2; E.push({ t: i / SR2, db: dB(Math.sqrt(s / W)) }); }
  const at = (a, b) => { const v = E.filter((e) => e.t >= a && e.t < b).map((e) => e.db); return v.length ? mean(v) : -90; };
  const secs = Object.fromEntries((brief.sections || []).map((s) => [s.name, s])), build = secs.build, intro = secs.intro;
  const arc = { introDb: intro ? +at(intro.t0, intro.t1).toFixed(1) : null, peakDb: brief.peak ? +at(brief.peak, brief.peak + 1.2).toFixed(1) : null };
  if (build) { const th = (build.t1 - build.t0) / 3; arc.buildRiseDb = +(at(build.t1 - th, build.t1) - at(build.t0, build.t0 + th)).toFixed(1); }
  if (brief.breath) arc.breathDipDb = +(at(brief.breath[0] + .05, brief.breath[1]) - (build ? at(build.t1 - 2, build.t1) : arc.introDb)).toFixed(1);
  arc.peakLiftDb = arc.peakDb != null && arc.introDb != null ? +(arc.peakDb - arc.introDb).toFixed(1) : null;
  arc.ok = (arc.peakLiftDb == null || arc.peakLiftDb >= 3) && (arc.buildRiseDb == null || arc.buildRiseDb >= 1.5) && (arc.breathDipDb == null || arc.breathDipDb <= -6);
  const dyn = E.map((e) => e.db).sort((a, b) => a - b), dynRange = dyn[Math.floor(dyn.length * .95)] - dyn[Math.floor(dyn.length * .1)];
  const ld = loudness(path), crest = ld.truePeakDb != null && ld.lufs != null ? ld.truePeakDb - ld.lufs : null, phone = mean(Array.from(S.phone)) / (mean(Array.from(S.tot)) || 1);
  const bpmErr = brief.bpm ? (T.bpm - brief.bpm) / brief.bpm : null;
  const rejects = [];
  if (clarity < 1.2 || residRms > 30) rejects.push(`beat grid unclear (clarity ${clarity.toFixed(2)}, grid residual ${residRms.toFixed(0)} ms rms)`);
  if (drift > 0.02) rejects.push(`tempo drifts ${(drift * 100).toFixed(1)}% between halves`);
  if (bpmErr != null && Math.abs(bpmErr) > 0.03) rejects.push(`tempo ${T.bpm.toFixed(1)} is ${(bpmErr * 100).toFixed(1)}% from the brief's ${brief.bpm} (cuts would drift off the beat)`);
  if (A.clipFraction > 0.0005 || A.peak > 1.0) rejects.push(`clips (peak ${A.peak.toFixed(3)}, ${(A.clipFraction * 100).toFixed(2)}% of samples)`);
  if (dynRange < 6) rejects.push(`flat dynamics (${dynRange.toFixed(1)} dB between quiet and loud passages)`);
  if (crest != null && crest < 6) rejects.push(`overcompressed (peak-to-loudness ${crest.toFixed(1)} dB)`);
  if (phone < 0.15) rejects.push(`weak in the phone-speaker band 200 Hz-5 kHz (${(phone * 100).toFixed(0)}% of energy)`);
  const score = Math.round(100 * (0.4 * (alignment ?? 0.5) + 0.3 * (arc.ok ? 1 : 0.4) + 0.15 * Math.max(0, 1 - residRms / 40) + 0.15 * Math.min(1, dynRange / 14)));
  const res = { file: name, durationSec: +dur.toFixed(2), tempoBpm: +T.bpm.toFixed(2), tempoErrPct: bpmErr == null ? null : +(bpmErr * 100).toFixed(2), tempoDriftPct: +(drift * 100).toFixed(2), beatClarity: +clarity.toFixed(2), gridResidualMs: +residRms.toFixed(1), downbeatSec: +downbeat.toFixed(3), firstBeatSec: +(beats[0]?.t ?? 0).toFixed(3), beats: beats.length, hits, alignmentScore: alignment == null ? null : +alignment.toFixed(2), arc, dynamicRangeDb: +dynRange.toFixed(1), loudness: ld, phoneBandFraction: +phone.toFixed(2), peak: +A.peak.toFixed(3), clipPct: +(A.clipFraction * 100).toFixed(3), rejects, score: rejects.length ? 0 : score, rawScore: score, onsets: on.slice(0, 600).map((o) => ({ t: +o.t.toFixed(3), v: +o.v.toFixed(2) })) };
  if (outDir) { mkdirSync(outDir, { recursive: true }); writeJson(join(outDir, `${name}.analysis.json`), res); plots(path, brief, res, E, beats, on, outDir, name); }
  return res;
}
// spectrogram (ffmpeg) + energy plot (SVG -> PNG with sharp), hit points / beats / sections drawn on both
function plots(path, brief, res, E, beats, on, outDir, name) {
  const require = createRequire(import.meta.url); let sharp; try { sharp = require('sharp'); } catch { return; }
  const dur = res.durationSec, Wd = 1200, X = (t) => (t / dur) * Wd, spec = join(outDir, `${name}.spec-raw.png`);
  run('ffmpeg', ['-y', '-loglevel', 'error', '-i', path, '-lavfi', `showspectrumpic=s=${Wd}x360:legend=0:scale=log:fscale=log:color=intensity`, spec]);
  const overlay = (h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${Wd}" height="${h}">${(brief.sections || []).map((s, i) => `<rect x="${X(s.t0)}" y="0" width="${X(s.t1) - X(s.t0)}" height="${h}" fill="${i % 2 ? '#ffffff' : '#000000'}" opacity=".06"/><text x="${X(s.t0) + 4}" y="14" font-family="sans-serif" font-size="11" fill="#fff">${s.name}</text>`).join('')}${beats.map((b) => `<line x1="${X(b.t)}" x2="${X(b.t)}" y1="${h - 10}" y2="${h}" stroke="#2de2c5" stroke-width="1"/>`).join('')}${(brief.hits || []).map((x) => `<line x1="${X(x.t)}" x2="${X(x.t)}" y1="0" y2="${h}" stroke="#ff5a1f" stroke-width="2"/>`).join('')}${on.map((o) => `<circle cx="${X(o.t)}" cy="${h - 18}" r="2.5" fill="#ffd21f"/>`).join('')}</svg>`;
  sharp(spec).composite([{ input: Buffer.from(overlay(360)) }]).toFile(join(outDir, `${name}.spectrogram.png`));
  const lo = -70, hi = Math.max(...E.map((e) => e.db), -6), Y = (d) => 20 + (1 - (Math.max(lo, d) - lo) / (hi - lo)) * 220, pts = E.map((e) => `${X(e.t + 0.125).toFixed(1)},${Y(e.db).toFixed(1)}`).join(' ');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${Wd}" height="260"><rect width="${Wd}" height="260" fill="#1a0933"/>${(brief.sections || []).map((s, i) => `<rect x="${X(s.t0)}" y="0" width="${X(s.t1) - X(s.t0)}" height="260" fill="${i % 2 ? '#ffffff' : '#000000'}" opacity=".07"/><text x="${X(s.t0) + 4}" y="14" font-family="sans-serif" font-size="11" fill="#b9a6e6">${s.name}</text>`).join('')}<polyline points="${pts}" fill="none" stroke="#2de2c5" stroke-width="2.5"/>${(brief.hits || []).map((x) => `<line x1="${X(x.t)}" x2="${X(x.t)}" y1="20" y2="240" stroke="#ff5a1f" stroke-width="2"/><text x="${X(x.t) + 3}" y="252" font-family="sans-serif" font-size="10" fill="#ff5a1f">${x.t}s</text>`).join('')}<text x="6" y="${Y(hi) + 4}" font-family="sans-serif" font-size="10" fill="#b9a6e6">${hi.toFixed(0)} dB</text><text x="6" y="${Y(lo) + 4}" font-family="sans-serif" font-size="10" fill="#b9a6e6">${lo.toFixed(0)} dB</text></svg>`;
  sharp(Buffer.from(svg)).png().toFile(join(outDir, `${name}.energy.png`));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const a = process.argv.slice(2), file = a.find((x, i) => !x.startsWith('--') && !['--brief', '--out'].includes(a[i - 1])), opt = (n) => { const i = a.indexOf(n); return i > -1 ? a[i + 1] : ''; };
  if (!file || !opt('--brief')) { console.error('usage: analyze.mjs FILE --brief brief.json [--out DIR]'); process.exit(2); }
  const r = analyze(file, readJson(opt('--brief')), opt('--out') || null); console.log(JSON.stringify(r, null, 1)); process.exit(r.rejects.length ? 1 : 0);
}
