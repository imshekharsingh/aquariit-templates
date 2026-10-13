// Sound-effects score for a film: whooshes that lead into cuts, risers, impacts, clicks, counter ticks. No music bed and no pitched notes, so any track the owner
// adds in Instagram fits on top (the film is cut on a 120 BPM grid; pick a track of about 120 BPM and start it on a downbeat).
// The cues come from film/ID/timing.json -> "cues": [{k, ...}]. Kinds:
//   whoosh {t0,t1,g?,f0?,f1?,tail?}   noise sweep that rises INTO t1 (a J-cut: the sound arrives before the picture cuts)
//   riser  {t0,t1,g?}                 noise + rising tone, stops 70 ms before t1 so the hit that follows lands in a vacuum
//   impact {t,g?,big?}                sub boom + noise; big=2 adds a cymbal-like wash
//   click  {t,g?}  tick {t,f?,g?}     UI click / small blip
//   count  {t,to,dur?,g?}             a tick every time a counting number changes 0 -> to (same easing as the picture: ease-out cubic)
//   sparkle {t,g?}                    short high shimmer (a colour "landing")
//   sub    {t0,t1,g?}                 low swell
import { join, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { Bus, V, SR, writeWav, writeIR } from './synth.mjs';

export async function writeSfx(outPath, T) {
  const LEN = T.len + .6, dry = new Bus(LEN), send = new Bus(LEN);
  for (const c of T.cues || []) {
    const g = c.g;
    switch (c.k) {
      case 'whoosh': V.whoosh(dry, c.t0, c.t1, g ?? .4, send, c.f0 ?? 300, c.f1 ?? 5000, c.tail ?? .25); break;
      case 'riser': V.riser(dry, c.t0, c.t1, g ?? .4, send); break;
      case 'impact': V.impact(dry, c.t, g ?? .8, send, c.big ?? 1); break;
      case 'click': V.click(dry, c.t, g ?? .4, c.pan ?? 0); break;
      case 'tick': V.tick(dry, c.t, c.f ?? 2200, g ?? .12, c.pan ?? 0); break;
      case 'sparkle': V.sparkle(dry, c.t, g ?? .25, send); break;
      case 'sub': V.glide(dry, c.t0, c.t1, g ?? .1, 40, 55, (u) => u); break;
      case 'count': { let last = 0; for (let u = 0; u <= 1; u += 1 / 240) { const n = Math.round(c.to * (1 - Math.pow(1 - u, 3))); if (n !== last) { last = n; V.tick(dry, c.t + u * (c.dur ?? .55), 2000, g ?? .12, 0); } } break; }
      default: throw new Error('unknown cue ' + c.k);
    }
  }
  const tmp = dirname(outPath), ir = join(tmp, 'ir.wav'), sendW = join(tmp, 'send.wav'), wet = join(tmp, 'wet.wav'), raw = join(tmp, 'sfx-raw.wav');
  writeIR(ir, 1.2); writeWav(sendW, send.L, send.R);
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', sendW, '-i', ir, '-filter_complex', '[0][1]afir=dry=0:wet=1:gtype=none:irgain=.12', wet], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error('reverb: ' + r.stderr);
  const wb = readFileSync(wet), off = wb.indexOf('data') + 8, n = Math.min(dry.n, Math.floor((wb.length - off) / 4)), end = Math.floor(T.len * SR);
  const L = new Float32Array(end), R = new Float32Array(end);
  for (let i = 0; i < end; i++) {
    const wl = i < n ? wb.readInt16LE(off + i * 4) / 32768 : 0, wr = i < n ? wb.readInt16LE(off + i * 4 + 2) / 32768 : 0, f = i > end - 4800 ? (end - i) / 4800 : 1;
    L[i] = Math.tanh((dry.L[i] + wl * .8) * .7) * f; R[i] = Math.tanh((dry.R[i] + wr * .8) * .7) * f;
  }
  writeWav(raw, L, R);
  // effects only: normalise to about -20 LUFS (quiet enough to sit under a music track, loud enough to hear on its own), peaks under -2 dB
  const m = spawnSync('ffmpeg', ['-hide_banner', '-i', raw, '-af', 'loudnorm=I=-20:TP=-3:LRA=15:print_format=json', '-f', 'null', '-'], { encoding: 'utf8' });
  const j = JSON.parse(m.stderr.slice(m.stderr.lastIndexOf('{')));
  const o = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', raw, '-af', `loudnorm=I=-20:TP=-3:LRA=15:measured_I=${j.input_i}:measured_TP=${j.input_tp}:measured_LRA=${j.input_lra}:measured_thresh=${j.input_thresh}:offset=${j.target_offset}:linear=true,aresample=${SR}`, '-ar', String(SR), outPath], { encoding: 'utf8' });
  if (o.status !== 0) throw new Error('loudnorm: ' + o.stderr);
  return { measuredLUFS: j.input_i };
}
