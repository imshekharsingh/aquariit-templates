// Score for "The Hue Dial": 120 BPM, E minor pentatonic, one chord per bar (Em C G D Em C . G Em). Every event sits on the same timing table as the picture.
// Layers: drums, bass, arp, dial ticks (each tick of the dial = one rising note), whooshes that LEAD the cuts (J-cuts), reverb tails that carry past them (L-cuts),
// a deliberate silence at 12.0-12.8, a riser into the impact at 14.0, and a decaying chord that fades to nothing at 18.0 so the loop restarts clean.
import { join, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { Bus, V, SR, writeWav, writeIR } from '../../scripts/film/synth.mjs';

const hz = (n) => 440 * Math.pow(2, (n - 69) / 12);
const CH = { Em: [64, 67, 71, 76], C: [60, 64, 67, 72], G: [55, 59, 62, 67], D: [62, 66, 69, 74] };
const ROOT = { Em: 40, C: 36, G: 43, D: 38 };
const BARS = ['Em', 'C', 'G', 'D', 'Em', 'C', null, 'G', 'Em'];
const PENT = [76, 79, 81, 83, 86, 88, 91];            // E5 G5 A5 B5 D6 E6 G6: the dial's seven ticks climb this scale

export async function writeScore(outPath, T) {
  const LEN = T.len + .6, dry = new Bus(LEN), send = new Bus(LEN), fx = new Bus(LEN);
  const beat = 60 / T.bpm, inSilence = (t) => t >= T.breath[0] && t < T.riser[0];
  const live = (t) => !inSilence(t) && !(t >= T.riser[0] && t < T.impact);   // music bed is off during the breath and the riser

  // drums
  for (let t = 0; t < 11.75; t += beat) V.kick(dry, t, t < 1 ? .9 : 1, send);
  for (let t = 14.0; t <= 16.75; t += beat) V.kick(dry, t, 1, send);
  for (let t = .25; t < 11.75; t += beat) V.hat(dry, t, t < 3 ? .5 : .75, false, .35);
  for (let t = 3.0; t < 11.25; t += .25) if (Math.round(t * 4) % 2) V.hat(dry, t, .28, false, -.3);
  for (let t = 14.25; t < 17.0; t += beat) V.hat(dry, t, .75, false, .35);
  for (let bar = 2; bar < 18; bar += 2) for (const o of [.5, 1.5]) { const t = bar + o; if ((t >= 2.5 && t < 11.25) || (t >= 14.5 && t < 17.0)) V.clap(dry, t, .9, send); }
  for (let i = 0, t = 11.25; t < 11.95; i++, t += .125) V.clap(dry, t, .18 + .05 * i, send);   // snare roll into the breath

  // bass + arpeggio + a stab that rings out into the silence
  BARS.forEach((c, b) => {
    if (!c) return; const t0 = b * 2, root = hz(ROOT[c]);
    if (t0 >= 12 && t0 < 14) return;
    [.25, .75, 1.25, 1.75].forEach((o, i) => { const t = t0 + o; if (t < 11.75 || t >= 14.0) V.bass(dry, t, .22, i % 2 ? root * 1.5 : root, t < 14 ? .5 : .55); });
    if (t0 >= 14 || t0 < 11.75) V.bass(dry, t0, .35, root, .7);
    for (let i = 0; i < 8; i++) {
      const t = t0 + i * .25; if (t < 3 || t >= 11.5 && t < 14.25 || t >= 17.0) continue;
      const tickPhase = t >= T.tick0 && t < 8.0, g = tickPhase ? .07 : (t >= 14 ? .15 : .19);
      V.pluck(dry, t, hz(CH[c][[0, 1, 2, 3, 2, 1, 2, 3][i]] + 12), g, (i % 2 ? .3 : -.3), send);
    }
  });
  const bar5 = 10; V.pluck(dry, 11.5, hz(64), .26, -.2, send, 2.2); V.pluck(dry, 11.5, hz(71), .22, .2, send, 2.2); V.pluck(dry, 11.5, hz(79), .18, 0, send, 2.2);

  // dial ticks: one rising note per tick, plus a tiny mechanical click (the dial is a physical object)
  for (let i = 0; i < T.tickN; i++) { const t = T.tick0 + i * beat; V.bell(dry, t, hz(PENT[i]), .3, -.4 + i * .13, send); V.click(dry, t, .35, 0); V.tick(dry, t + .02, 2400, .1); }
  // match cut: riser leads in from 3.0, boom on 4.0
  V.whoosh(fx, 2.55, T.join, .35, send, 300, 4500, .25);
  V.riser(fx, T.join, T.matchCut, .32, send); V.impact(dry, T.matchCut, .55, send);
  // whip 1 + the proof cards, each on its beat with a counter that ticks every time its number changes
  V.whoosh(fx, T.whip1[0] - .05, T.whip1[1], .6, send, 200, 7000, .35);
  T.stat.forEach((t, i) => {
    V.whoosh(fx, t - .35, t, .28, send, 400, 3800, .15); V.click(dry, t, .5, [-.3, .3, 0][i]); V.bell(dry, t + .02, hz([72, 76, 79][i]), .16, 0, send);
    const to = [3, 5, 14][i]; let last = 0; for (let u = 0; u <= 1; u += 1 / 240) { const n = Math.round(to * (1 - Math.pow(1 - u, 3))); if (n !== last) { last = n; V.tick(dry, t + .12 + u * .55, 900 + 70 * n, .12, [-.2, .2, 0][i]); } }
  });
  // packages
  V.impact(dry, T.cut2, .6, send); V.whoosh(fx, T.pkSpark - .3, T.pkSpark, .3, send, 300, 4200, .15);
  V.whoosh(fx, T.pkHot - .3, T.pkHot, .35, send, 300, 4600, .15); V.click(dry, T.pkHot, .5); V.bell(dry, T.pkHot + .35, hz(96), .22, .2, send);
  V.whoosh(fx, T.sheen2[0], T.sheen2[1], .12, send, 3000, 9000, .2);
  V.riser(fx, T.push[0], T.push[1], .18, send);
  // breath: only reverb tails (the stab above) and a faint sub-swell
  V.glide(fx, 12.6, T.riser[0] + .1, .08, 40, 55, (u) => u);
  // riser into the impact
  V.riser(fx, T.riser[0], T.impact, .45, send); V.whoosh(fx, 13.3, T.impact, .3, send, 500, 8000, .1);
  V.impact(dry, T.impact, 1.5, send, 2);
  // the spin: a pitch sweep that follows the dial (fast, then settling), chime when it lands on tangerine
  V.glide(fx, T.spin[0], T.spin[1], .16, 220, 1760, (u) => 1 - Math.pow(2, -10 * u), send);
  [76, 79, 83, 90].forEach((n, i) => V.bell(dry, T.chime + i * .035, hz(n), .22, -.3 + i * .2, send));
  // whip 2 + the answer: a thump on every word
  V.whoosh(fx, T.whip2[0] - .08, T.whip2[1], .5, send, 300, 7000, .25);
  V.impact(dry, T.yes, .7, send); V.bass(dry, T.yes, .6, hz(40), .75);
  V.click(dry, T.yes + .25, .4); V.click(dry, T.weak, .55); V.bass(dry, T.weak, .5, hz(40), .6);
  V.bell(dry, T.cta + .1, hz(88), .16, .2, send);
  // loop seam: reverse-style swell into the wipe, then a chord that fades to silence at 18.0 (the next play starts on a kick and the same E)
  V.whoosh(fx, T.iris[0] - .1, T.iris[1], .45, send, 250, 6500, .2);
  V.pad(dry, T.iris[1] - .1, 18.0 - (T.iris[1] - .1), [hz(40), hz(52), hz(59), hz(64)], .5, send);

  // reverb: send bus through a synthetic impulse response (ffmpeg afir), mixed back under the dry sound
  const tmp = dirname(outPath), ir = join(tmp, 'ir.wav'), sendW = join(tmp, 'send.wav'), wet = join(tmp, 'wet.wav'), raw = join(tmp, 'score-raw.wav');
  writeIR(ir); writeWav(sendW, send.L, send.R);
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', sendW, '-i', ir, '-filter_complex', '[0][1]afir=dry=0:wet=1:gtype=none:irgain=.12', wet], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error('reverb: ' + r.stderr);
  // read the wet file back (16-bit PCM) and sum
  const { readFileSync } = await import('node:fs'); const wb = readFileSync(wet), off = wb.indexOf('data') + 8, n = Math.min(dry.n, Math.floor((wb.length - off) / 4));
  const L = new Float32Array(dry.n), R = new Float32Array(dry.n);
  for (let i = 0; i < dry.n; i++) {
    const wl = i < n ? wb.readInt16LE(off + i * 4) / 32768 : 0, wr = i < n ? wb.readInt16LE(off + i * 4 + 2) / 32768 : 0;
    const tt = i / SR, a0 = T.breath[0], b0 = T.riser[0], env = tt >= a0 && tt < b0 ? 1 - .97 * Math.min(1, (tt - a0) / .015) * Math.min(1, (b0 - tt) / .03) : 1; // true silence in the breath: bed and reverb tails duck to -30 dB
    L[i] = (dry.L[i] + wl * .9) * env + fx.L[i]; R[i] = (dry.R[i] + wr * .9) * env + fx.R[i];
  }
  // hard silence in the breath for the dry bed already; fade the last 120 ms, soft-clip, write, then loudness-normalise to about -14 LUFS
  const end = Math.floor(T.len * SR);
  for (let i = 0; i < dry.n; i++) { const f = i > end ? 0 : i > end - 6000 ? (end - i) / 6000 : 1; L[i] = Math.tanh(L[i] * .55) * f; R[i] = Math.tanh(R[i] * .55) * f; }
  writeWav(raw, L.subarray(0, end), R.subarray(0, end));
  const m = spawnSync('ffmpeg', ['-hide_banner', '-i', raw, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], { encoding: 'utf8' });
  const j = JSON.parse(m.stderr.slice(m.stderr.lastIndexOf('{')));
  const n2 = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', raw, '-af', `loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=${j.input_i}:measured_TP=${j.input_tp}:measured_LRA=${j.input_lra}:measured_thresh=${j.input_thresh}:offset=${j.target_offset}:linear=true,aresample=${SR}`, '-ar', String(SR), outPath], { encoding: 'utf8' });
  if (n2.status !== 0) throw new Error('loudnorm: ' + n2.stderr);
  return { measuredLUFS: j.input_i, truePeak: j.input_tp };
}
