// Step 3: analyse every candidate in audio/<date>/<ID>/ (cand-*.mp3|wav|m4a|flac), reject the bad ones, pick the best, say why in two lines.
//   node scripts/audio/evaluate.mjs ID          exit 1 when every candidate is rejected
import { join } from 'node:path';
import { readdirSync, writeFileSync } from 'node:fs';
import { readJson, writeJson, audioDir } from './lib.mjs';
import { analyze } from './analyze.mjs';

export function evaluate(id, dir = audioDir(id)) {
  const brief = readJson(join(dir, 'brief.json')), files = readdirSync(dir).filter((f) => /^cand-\d+\.(mp3|wav|m4a|flac)$/i.test(f)).sort();
  if (!files.length) throw new Error('no candidates in ' + dir);
  const res = files.map((f) => ({ ...analyze(join(dir, f), brief, join(dir, 'analysis'), f.replace(/\.[^.]+$/, '')), file: f, meta: readJson(join(dir, f.replace(/\.[^.]+$/, '.json')), {}) }));
  const ok = res.filter((r) => !r.rejects.length).sort((x, y) => y.score - x.score), best = ok[0] || null;
  const line = (r) => `${r.file}: score ${r.score || 0}${r.rejects.length ? ' REJECTED (' + r.rejects.join('; ') + ')' : ''}, tempo ${r.tempoBpm} BPM, alignment ${r.alignmentScore}, ${r.loudness.lufs} LUFS, dynamic range ${r.dynamicRangeDb} dB, arc ${r.arc.ok ? 'rises into the peak' : 'FLAT / wrong shape'}`;
  const why = best ? `Chosen ${best.file}: highest score (${best.score}) of ${ok.length} acceptable; storyboard hits align to ${Math.round(best.alignmentScore * 100)}% and the energy ${best.arc.ok ? 'rises into the peak at ' + brief.peak + ' s' : 'arc is acceptable'}.\nRunner-up: ${ok[1] ? ok[1].file + ' (' + ok[1].score + ')' : 'none'}; ${res.length - ok.length} rejected.` : 'Every candidate was rejected: no music bed (see the reasons above).';
  const out = { id, chosen: best && best.file, why, candidates: res.map(({ onsets, hits, beats, ...r }) => r) };
  writeJson(join(dir, 'evaluation.json'), out);
  writeFileSync(join(dir, 'evaluation.md'), `# Candidate evaluation · ${id}\n\n${res.map((r) => '- ' + line(r)).join('\n')}\n\n${why}\n\nPlots per candidate: analysis/<name>.spectrogram.png (hit points in orange, beats in green) and analysis/<name>.energy.png (energy over time; it must rise into the peak).\n`);
  return { out, best, res };
}
if (import.meta.url === `file://${process.argv[1]}`) { const id = process.argv[2]; const { out } = evaluate(id); console.log(out.why); out.candidates.forEach((c) => console.log(`${c.file}: score ${c.score}${c.rejects.length ? ' rejected: ' + c.rejects.join('; ') : ''}`)); process.exit(out.chosen ? 0 : 1); }
