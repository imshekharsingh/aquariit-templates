// Self-test of the Music & Sound toolkit with STAND-IN tracks (made with the film synth, test fixtures only: never shipped as music).
// It proves the evaluator can tell a good candidate from bad ones, and that edit + mix hit their targets.   node scripts/audio/selftest.mjs
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';
import { Bus, V, writeWav as writeBusWav } from '../film/synth.mjs';
import { analyze } from './analyze.mjs';
import { buildBrief } from './brief.mjs';

const out = join(process.argv[2] || 'out/audio-selftest'); mkdirSync(out, { recursive: true });
const id = '2026-10-13-0851', { brief } = buildBrief(id);
const bar = 2;
function track(name, o) {
  const b = new Bus(19.8), beat = (t) => o.warp ? t * (1 + o.warp * t / 18) : t;
  const bpmScale = 120 / (o.bpm || 120), tt = (t) => beat(t * bpmScale) + (o.lead || 0);
  const on = (t, f) => { const s = tt(t); if (s < 18.3 + (o.lead || 0)) f(s); };
  for (let t = 0; t < 18; t += 0.5) {
    const sec = t < 3 ? 0 : t < 12 ? 1 : t < 14 ? 2 : t < 15.5 ? 3 : 4, inBreath = t >= 12 && t < 12.6;
    if (inBreath && !o.flat) continue;
    const g = o.flat ? 1 : sec === 1 ? .55 + .45 * (t - 3) / 9 : [.5, 0, 0, 1, .7][sec];
    if (t < 12 || t >= 14) on(t, (s) => V.kick(b, s, g * (o.gain || 1)));
    if (sec >= 1 && !(t >= 12 && t < 14)) { on(t + 0.25, (s) => V.hat(b, s, .6 * g)); if (Math.round(t * 2) % 2 === 1) on(t, (s) => V.clap(b, s, .8 * g)); }
    if (sec >= 1 || o.flat) on(t + 0.25, (s) => V.bass(b, s, .2, 41.2, .5 * g));
    if ((sec === 1 || sec >= 3 || o.flat) && !o.noMid) for (const [i, n] of [64, 67, 71, 76].entries()) on(t + 0.125 * i, (s) => V.pluck(b, s, 440 * Math.pow(2, (n - 69) / 12), .3 * g, 0));
  }
  if (!o.flat) { on(14, (s) => V.impact(b, s, 1.2, null, 2)); on(4, (s) => V.impact(b, s, .5)); on(1.5, (s) => V.impact(b, s, .3)); on(10, (s) => V.impact(b, s, .5)); on(15.5, (s) => V.impact(b, s, .6)); }
  let peak = 0; for (let i = 0; i < b.n; i++) peak = Math.max(peak, Math.abs(b.L[i]), Math.abs(b.R[i])); const k = o.hardClip ? 6 : (0.7 / peak);
  for (let i = 0; i < b.n; i++) { b.L[i] = Math.max(-1, Math.min(1, b.L[i] * k)); b.R[i] = Math.max(-1, Math.min(1, b.R[i] * k)); }
  const p = join(out, name + '.wav'); writeBusWav(p, b.L.subarray(0, Math.floor((18 + (o.lead || 0)) * 48000)), b.R.subarray(0, Math.floor((18 + (o.lead || 0)) * 48000))); return p;
}
const cases = [
  ['good-120', {}, true],
  ['drifting-tempo', { warp: .12 }, false],
  ['wrong-tempo-100', { bpm: 100 }, false],
  ['flat-and-clipped', { flat: true, hardClip: true, gain: 3 }, false],
];
let fails = 0;
for (const [name, o, shouldPass] of cases) {
  const r = analyze(track(name, o), brief, out, name), ok = (r.rejects.length === 0) === shouldPass;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}: tempo ${r.tempoBpm} (drift ${r.tempoDriftPct}%), grid ${r.gridResidualMs} ms, alignment ${r.alignmentScore}, arc ${JSON.stringify(r.arc)}, dyn ${r.dynamicRangeDb} dB, LUFS ${r.loudness.lufs}, score ${r.score}${r.rejects.length ? '\n     rejects: ' + r.rejects.join(' | ') : ''}`);
  if (name === 'good-120') console.log('     hits:', r.hits.map((h) => `${h.t}s err ${h.onsetErrMs} ms`).join(', '), `downbeat ${r.downbeatSec}s`);
  if (!ok) fails++;
}
console.log(fails ? `${fails} FAILED` : 'analysis self-test passed');

// part 2: edit to picture + mix on a stand-in that is 1% slow and starts 1.2 s late (so it needs a tempo stretch and a re-timed bar line)
const { editToPicture } = await import('./edit.mjs'), { mixFilm } = await import('./mix.mjs'), { writeJson } = await import('./lib.mjs');
writeJson(join(out, 'brief.json'), brief);
const odd = track('needs-editing', { bpm: 118.8, lead: 1.2 });
const ed = editToPicture(id, odd, { out }), v = ed.verify;
const peakErr = v.hits.find((h) => h.kind === 'impact').onsetErrMs;
const checks = [
  ['tempo stretched to the brief (±0.3%)', Math.abs(v.tempoBpm - brief.bpm) / brief.bpm < 0.003],
  ['peak impact lands on the hero timestamp (±15 ms)', Math.abs(peakErr) <= 15],
  ['all hit points aligned (score >= 0.9)', v.alignmentScore >= 0.9],
  ['breath is silent (>= 20 dB below the build)', v.arc.breathDipDb <= -20],
  ['downbeat on a bar line', ed.log.verify.downbeatOnBarLine],
];
const mx = await mixFilm(id, { out });
checks.push(['mix: -14 LUFS integrated (±0.8)', Math.abs(mx.log.lufs + 14) <= 0.8], ['mix: true peak <= -1 dBTP after AAC', mx.log.truePeakAfterAacDb <= -1.0], ['mix: phone band present', mx.log.phoneBandFraction >= 0.15]);
for (const [n, ok] of checks) { console.log(`${ok ? 'PASS' : 'FAIL'} ${n}`); if (!ok) fails++; }
console.log('edit:', JSON.stringify({ stretch: ed.log.tempoStretch, startOffsetSec: ed.log.startOffsetSec, peakErrMs: peakErr, loop: ed.log.loopCrossfade }), 'mix:', JSON.stringify({ lufs: mx.log.lufs, tp: mx.log.truePeakDb, tpAac: mx.log.truePeakAfterAacDb, phone: mx.log.phoneBandFraction }));

// part 3: the whole pipeline (produce.mjs) with 3 imported stand-in candidates: it must reject the bad ones, pick the good one, and write final.wav + a reel-log entry
import { mkdirSync as mk, copyFileSync as cp, writeFileSync as wf, existsSync as ex, readFileSync as rf, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const cand = join(out, 'cands'); mk(cand, { recursive: true });
cp(track('x1-drifting', { warp: .12 }), join(cand, 'a.wav')); cp(track('x2-flat', { flat: true, hardClip: true, gain: 3 }), join(cand, 'b.wav')); cp(track('x3-good-slightly-slow', { bpm: 119.4, lead: 0 }), join(cand, 'c.wav'));
const env = { ...process.env, AUDIO_ROOT: join(out, 'audio'), REEL_LOG: join(out, 'reel-log.json') }; wf(env.REEL_LOG, '[]');
const pr = spawnSync('node', [join(import.meta.dirname, 'produce.mjs'), id, '--from', cand, '--provider', 'selftest', '--licence', 'test fixture, not music'], { env, encoding: 'utf8' });
const fin = join(env.AUDIO_ROOT, id.slice(0, 10), id, 'final.wav'), lg = JSON.parse(rf(env.REEL_LOG, 'utf8'))[0];
for (const [n, ok] of [['produce.mjs exits 0', pr.status === 0], ['picked the good candidate (cand-3)', lg && lg.music && lg.music.chosen.startsWith('cand-3')], ['final.wav written', ex(fin)], ['bad candidates logged as rejected', lg && lg.music.candidates.filter((c) => c.rejects.length).length === 2], ['licence + provenance recorded', lg && lg.music.licence === 'test fixture, not music']]) { console.log(`${ok ? 'PASS' : 'FAIL'} ${n}`); if (!ok) fails++; }
if (pr.status !== 0) console.log(pr.stdout.slice(-800), pr.stderr.slice(-600));
console.log(fails ? `${fails} FAILED` : 'ALL TOOLKIT SELF-TESTS PASSED'); process.exit(fails ? 1 : 0);
