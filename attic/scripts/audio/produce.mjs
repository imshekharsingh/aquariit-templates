// The whole Music & Sound process for one film: brief -> candidates -> evaluate -> edit to picture -> mix & master -> log.   node scripts/audio/produce.mjs ID [--from DIR --provider NAME --licence "terms"]
// Exit 0: audio/<date>/<ID>/final.wav exists (the renderer picks it up). Exit 3: no licensed music source configured (the film ships without a music bed). Exit 1: candidates rejected / a step failed.
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { readJson, audioDir, logFilm, root } from './lib.mjs';
import { evaluate } from './evaluate.mjs';
import { editToPicture } from './edit.mjs';
import { mixFilm } from './mix.mjs';

const a = process.argv.slice(2), id = a[0], dir = audioDir(id), node = (s, args) => spawnSync('node', [join(root, 'scripts', 'audio', s), ...args], { stdio: 'inherit', env: process.env });
if (!id) { console.error('usage: produce.mjs ID'); process.exit(2); }
if (node('brief.mjs', [id]).status !== 0) process.exit(1);
if (!['cand-1.mp3', 'cand-1.wav', 'cand-1.m4a'].some((f) => existsSync(join(dir, f)))) { const r = node('generate.mjs', [id, ...a.slice(1)]); if (r.status !== 0) process.exit(r.status === 3 ? 3 : 1); }
const { out, best } = evaluate(id, dir); console.log(out.why);
if (!best) process.exit(1);
const ed = editToPicture(id, join(dir, best.file), { out: dir }), mx = await mixFilm(id, { out: dir }), brief = readJson(join(dir, 'brief.json'));
logFilm(id, { music: { brief: { genre: brief.genre, instrumentation: brief.instrumentation, bpm: brief.bpm, mood: brief.mood, prompt: brief.prompt }, chosen: best.file, why: out.why, provider: best.meta.provider || null, model: best.meta.model || null, generated: best.meta.date || null, licence: best.meta.licence || null, alignmentScore: best.alignmentScore, candidates: out.candidates.map((c) => ({ file: c.file, score: c.score, rejects: c.rejects })), edit: { tempoStretch: ed.log.tempoStretch || null, startOffsetSec: ed.log.startOffsetSec }, loudness: { lufs: mx.log.lufs, truePeakDb: mx.log.truePeakDb, truePeakAfterAacDb: mx.log.truePeakAfterAacDb }, feedback: null } });
console.log('final mix:', JSON.stringify(mx.log)); process.exit(mx.log.ok ? 0 : 1);
