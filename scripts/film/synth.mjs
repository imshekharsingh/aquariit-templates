// Tiny offline synthesiser for the film scores: every sound is generated from maths (no samples, no third-party audio), so it is original and royalty-free.
import { writeFileSync } from 'node:fs';
export const SR = 48000;
let seed = 987654321; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 * 2 - 1; };
const TAU = Math.PI * 2, exp = Math.exp, sin = Math.sin;

export class Bus {
  constructor(len) { this.n = Math.ceil(len * SR); this.L = new Float32Array(this.n); this.R = new Float32Array(this.n); }
  // render a mono voice: fn(tt, i) -> sample, for dur seconds from t0; pan -1..1 (or fn(tt)); gain
  voice(t0, dur, gain, pan, fn) {
    const s = Math.max(0, Math.floor(t0 * SR)), e = Math.min(this.n, Math.floor((t0 + dur) * SR));
    for (let i = s; i < e; i++) {
      const tt = (i - t0 * SR) / SR, v = fn(tt, i) * gain, p = typeof pan === 'function' ? pan(tt) : pan;
      const l = Math.cos((p + 1) * Math.PI / 4), r = Math.sin((p + 1) * Math.PI / 4);
      this.L[i] += v * l; this.R[i] += v * r;
    }
  }
}
const svf = () => { let lp = 0, bp = 0; return (x, f, q) => { const g = 2 * sin(Math.PI * Math.min(0.45, f / SR)); lp += g * bp; const hp = x - lp - q * bp; bp += g * hp; return { lp, bp, hp }; }; };

export const V = {
  kick(b, t, g = 1, send) { let ph = 0; b.voice(t, .4, g, 0, (tt) => { ph += TAU * (46 + 120 * exp(-tt * 34)) / SR; return (sin(ph) * exp(-tt * 8.5) + rnd() * exp(-tt * 400) * .25) * 1.1; }); if (send) send.voice(t, .1, g * .15, 0, (tt) => rnd() * exp(-tt * 300)); },
  clap(b, t, g = 1, send) { const f = svf(); const fn = (tt) => { const burst = [0, .011, .022].reduce((a, o) => a + (tt >= o ? exp(-(tt - o) * 190) : 0), 0) + exp(-tt * 20) * .55; return f(rnd(), 1500 + 600 * rnd(), .6).bp * burst * 2.2; }; b.voice(t, .35, g * .55, 0, fn); if (send) send.voice(t, .35, g * .4, 0, fn); },
  hat(b, t, g = .5, open = false, pan = .3) { let p = 0; b.voice(t, open ? .3 : .06, g * .35, pan, (tt) => { const n = rnd(), d = n - p; p = n; return d * exp(-tt * (open ? 14 : 80)); }); },
  bass(b, t, dur, f, g = .6) { let y = 0, ph = 0; b.voice(t, dur + .15, g, 0, (tt) => { ph += f / SR; const saw = 2 * (ph % 1) - 1, a = tt < dur ? Math.min(1, tt / .006) * exp(-tt * 3.2) : exp(-3.2 * dur) * exp(-(tt - dur) * 40), c = .05 + .13 * exp(-tt * 14); y += c * (saw - y); return (y * .9 + sin(TAU * ph) * .55) * a; }); },
  pluck(b, t, f, g = .3, pan = 0, send, decay = 6.5) { const fn = (tt) => (sin(TAU * f * tt) * exp(-tt * decay) + .38 * sin(TAU * f * 2 * tt) * exp(-tt * decay * 1.5) + .16 * sin(TAU * f * 4.01 * tt) * exp(-tt * decay * 3.4)) * Math.min(1, tt / .002); b.voice(t, 1.1, g, pan, fn); if (send) send.voice(t, 1.1, g * .8, pan, fn); },
  bell(b, t, f, g = .3, pan = 0, send) { const fn = (tt) => sin(TAU * f * tt + 2.6 * sin(TAU * f * 3.5 * tt) * exp(-tt * 6)) * exp(-tt * 2.1) * Math.min(1, tt / .002); b.voice(t, 2.4, g, pan, fn); if (send) send.voice(t, 2.4, g * .9, pan, fn); },
  tick(b, t, f = 1800, g = .14, pan = 0) { b.voice(t, .05, g, pan, (tt) => sin(TAU * f * tt) * exp(-tt * 140)); },
  click(b, t, g = .3, pan = 0) { const s = svf(); b.voice(t, .03, g, pan, (tt) => s(rnd(), 3200, .5).bp * exp(-tt * 260) * 2.4); },
  // swept noise whoosh: rises to t1 (so it leads INTO the cut, a J-cut), then a short tail
  whoosh(b, t0, t1, g = .5, send, f0 = 250, f1 = 6000, tail = .3) { const s = svf(), dur = t1 - t0 + tail; const fn = (tt) => { const u = Math.min(1, tt / (t1 - t0)), f = f0 * Math.pow(f1 / f0, u), a = tt < t1 - t0 ? Math.pow(u, 2.2) : exp(-(tt - (t1 - t0)) * 14); return s(rnd(), f, .45).bp * a * 2; }; b.voice(t0, dur, g, (tt) => -.7 + 1.4 * Math.min(1, tt / (t1 - t0)), fn); if (send) send.voice(t0, dur, g * .5, 0, fn); },
  riser(b, t0, t1, g = .4, send) { const s = svf(), d = t1 - t0; let ph = 0; const fn = (tt) => { const u = tt / d; ph += TAU * (160 * Math.pow(12, u)) / SR; return (s(rnd(), 400 + 7000 * u * u, .5).hp * .8 + sin(ph) * .35 * (1 + .5 * sin(tt * TAU * (4 + 10 * u)))) * Math.pow(u, 1.7) * Math.min(1, Math.max(0, (d - tt) / .07)); }; b.voice(t0, d, g, 0, fn); if (send) send.voice(t0, d, g * .6, 0, fn); },
  impact(b, t, g = 1, send, big = 1) { let ph = 0; const s = svf(); const fn = (tt) => { ph += TAU * (30 + 34 * exp(-tt * 5)) / SR; return sin(ph) * exp(-tt * 2.1) * 1.2 + s(rnd(), 500 * exp(-tt * 2) + 80, .7).lp * exp(-tt * 3.5) * 1.1; }; b.voice(t, 2.2, g * .8, 0, fn); const h = svf(); const cr = (tt) => h(rnd(), 6500, .8).hp * exp(-tt * (big > 1 ? 1.6 : 4)) * .55; b.voice(t, 1.6, g * .35 * big, .15, cr); if (send) send.voice(t, 1.6, g * .5, 0, cr); },
  glide(b, t0, t1, g, fa, fb, shape, send) { let ph = 0; const d = t1 - t0, fn = (tt) => { const u = Math.min(1, tt / d); ph += TAU * (fa * Math.pow(fb / fa, shape(u))) / SR; return (sin(ph) + .3 * sin(ph * 2)) * Math.min(1, tt / .03) * exp(-Math.max(0, tt - d) * 20); }; b.voice(t0, d + .1, g, 0, fn); if (send) send.voice(t0, d + .1, g * .6, 0, fn); },
  pad(b, t, dur, freqs, g = .1, send) { const fn = (tt) => freqs.reduce((a, f, i) => a + sin(TAU * f * tt + i) + .4 * sin(TAU * f * 2.003 * tt), 0) * Math.min(1, tt / .25) * Math.max(0, 1 - tt / dur) * Math.max(0, 1 - tt / dur); b.voice(t, dur, g / freqs.length, 0, fn); if (send) send.voice(t, dur, g / freqs.length * .8, 0, fn); },
};

export function writeWav(path, L, R) {
  const n = L.length, buf = Buffer.alloc(44 + n * 4);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) { buf.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(L[i] * 32767))), 44 + i * 4); buf.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(R[i] * 32767))), 46 + i * 4); }
  writeFileSync(path, buf);
}
// a decaying stereo noise impulse response for the reverb send (convolved by ffmpeg afir)
export function writeIR(path, sec = 1.6) {
  const n = Math.floor(sec * SR), L = new Float32Array(n), R = new Float32Array(n); let a = 0, b = 0;
  for (let i = 0; i < n; i++) { const e = exp(-i / SR * 3.4); a += .35 * (rnd() - a); b += .35 * (rnd() - b); L[i] = a * e * (i < 400 ? i / 400 : 1); R[i] = b * e * (i < 400 ? i / 400 : 1); }
  writeWav(path, L, R);
}
