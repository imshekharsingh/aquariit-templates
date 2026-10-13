// Shared helpers for the Music & Sound toolkit (see CLAUDE.md "Music & Sound"). Nothing here synthesises music: music comes from a licensed API (generate.mjs) or a file the owner provides.
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

export const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const SR = 48000;
export const indiaDate = () => new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 10);
export const readJson = (p, d = null) => { try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return d; } };
export const writeJson = (p, o) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, JSON.stringify(o, null, 2) + '\n'); };
export const run = (cmd, args, o = {}) => { const r = spawnSync(cmd, args, { encoding: 'utf8', maxBuffer: 1 << 28, ...o }); if (r.status !== 0 && !o.soft) throw new Error(`${cmd} ${args.join(' ').slice(0, 200)}\n${(r.stderr || '').slice(-1200)}`); return r; };
export const filmDir = (id) => join(root, 'film', id);
export const timing = (id) => readJson(join(filmDir(id), 'timing.json'));
// where the audio for one film lives: audio/<date>/<ID>/ (date = the film's own date, the first 10 chars of its id)
export const audioDir = (id, date) => join(process.env.AUDIO_ROOT || join(root, 'audio'), date || id.slice(0, 10), id);   // AUDIO_ROOT / REEL_LOG: overridden by the self-test so it never touches real files

// decode any audio file to stereo float32 at 48 kHz: {L,R}
export function readAudio(path) {
  const r = spawnSync('ffmpeg', ['-v', 'error', '-i', path, '-f', 'f32le', '-ac', '2', '-ar', String(SR), '-'], { maxBuffer: 1 << 30 });
  if (r.status !== 0) throw new Error('decode failed: ' + path + ' ' + String(r.stderr).slice(-300));
  const f = new Float32Array(r.stdout.buffer, r.stdout.byteOffset, Math.floor(r.stdout.byteLength / 4)), n = f.length >> 1, L = new Float32Array(n), R = new Float32Array(n);
  for (let i = 0; i < n; i++) { L[i] = f[2 * i]; R[i] = f[2 * i + 1]; }
  return { L, R, n };
}
export function writeWav(path, L, R) {
  const n = L.length, buf = Buffer.alloc(44 + n * 8);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 8, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(3, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 8, 28); buf.writeUInt16LE(8, 32); buf.writeUInt16LE(32, 34); buf.write('data', 36); buf.writeUInt32LE(n * 8, 40);
  const f = new Float32Array(n * 2); for (let i = 0; i < n; i++) { f[2 * i] = L[i]; f[2 * i + 1] = R[i]; }
  Buffer.from(f.buffer).copy(buf, 44); mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, buf);
}
// loudness: integrated LUFS, true peak (dBTP), loudness range, via ffmpeg ebur128
export function loudness(path) {
  const r = run('ffmpeg', ['-hide_banner', '-nostats', '-i', path, '-af', 'ebur128=peak=true', '-f', 'null', '-'], { soft: true }), t = r.stderr, last = (re) => { const m = [...t.matchAll(re)]; return m.length ? +m[m.length - 1][1] : null; };
  return { lufs: last(/I:\s+(-?[\d.]+) LUFS/g), truePeakDb: last(/Peak:\s+(-?[\d.]+) dBFS/g), lra: last(/LRA:\s+(-?[\d.]+) LU/g) };
}
// reel-log.json: find or create the entry for a film and merge fields into it
export function logFilm(id, patch) {
  const p = process.env.REEL_LOG || join(root, 'reel-log.json'), log = readJson(p, []); let e = log.find((x) => x.id === id);
  if (!e) { e = { id, date: id.slice(0, 10) }; log.push(e); }
  Object.assign(e, patch); writeJson(p, log); return e;
}
export const lastMusic = (n = 7, exceptId) => readJson(process.env.REEL_LOG || join(root, 'reel-log.json'), []).filter((e) => e.music && e.id !== exceptId).slice(-n);
