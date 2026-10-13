// Step 1 of the Music & Sound process: write the music brief FROM THE STORYBOARD (film/ID/timing.json "music" block + film/ID/music-brief.json), never the other way round.
//   node scripts/audio/brief.mjs ID
// Writes audio/<date>/<ID>/brief.json (machine), brief.md (people), plan.json (composition plan for the music API) and prompts.json (3 interpretations).
// Refuses a brief that repeats the previous film's genre/instrumentation/BPM (reel-log.json), and applies the owner's past feedback on music.
import { join } from 'node:path';
import { readJson, writeJson, timing, filmDir, audioDir, lastMusic } from './lib.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';

const ENERGY = {
  sparse: 'sparse and minimal, a soft intro with only a pulse and a light texture, no full drums yet',
  rising: 'building energy, add a layer every bar (hats, bass, pads, arpeggio), tension rising',
  'silence then riser': 'drop to near silence, a held breath, then a tense riser building into the downbeat',
  high: 'peak energy, the full arrangement, a big downbeat impact on the first beat',
  settling: 'resolving, thinning out, loop-friendly: it ends on the tonic on a bar boundary so it can restart',
};
const jacc = (a, b) => { const A = new Set(a.map((x) => x.toLowerCase())), B = new Set(b.map((x) => x.toLowerCase())); const i = [...A].filter((x) => B.has(x)).length; return i / (A.size + B.size - i || 1); };

export function buildBrief(id) {
  const T = timing(id), M = T.music, mb = readJson(join(filmDir(id), 'music-brief.json'));
  if (!M || !mb) throw new Error(`need film/${id}/timing.json "music" block and film/${id}/music-brief.json`);
  const beat = 60 / M.bpm, bar = beat * 4, problems = [], notes = [];
  // BPM must put the key cuts on beats: every hit must sit within 25 ms of a beat
  for (const h of M.hits) { const k = h.t / beat, err = Math.abs(k - Math.round(k)) * beat; if (err > 0.025) problems.push(`hit "${h.label}" at ${h.t}s is ${(err * 1000).toFixed(0)} ms off the ${M.bpm} BPM grid`); }
  if (Math.abs(M.duration / bar - Math.round(M.duration / bar)) > 1e-6) notes.push(`duration ${M.duration}s is not a whole number of bars (${(M.duration / bar).toFixed(2)}): the loop edit will crossfade on a beat`);
  const sections = M.sections.map((s) => ({ name: s.name, t0: s.t0, t1: s.t1, durationMs: Math.round((s.t1 - s.t0) * 1000), energy: s.energy, style: ENERGY[s.energy] || s.energy }));
  if (Math.abs(sections.reduce((a, s) => a + s.durationMs, 0) - M.duration * 1000) > 5) problems.push('sections do not add up to the duration');
  if ((mb.interpretations || []).length !== 3) problems.push('music-brief.json needs exactly 3 interpretations');
  else if (jacc(mb.interpretations[0].instrumentation, mb.interpretations[1].instrumentation) > 0.5 || jacc(mb.interpretations[0].instrumentation, mb.interpretations[2].instrumentation) > 0.5 || jacc(mb.interpretations[1].instrumentation, mb.interpretations[2].instrumentation) > 0.5) problems.push('the 3 interpretations are too similar (instrumentation overlaps by more than half)');
  if ((mb.instrumentation || []).length < 3 || mb.instrumentation.length > 5) problems.push('instrumentation: 3-5 items');
  // never repeat genre, instrumentation set or BPM range back to back; read the last 7 entries and the owner's feedback
  const prev = lastMusic(7, id), last = prev[prev.length - 1];
  if (last) {
    const m = last.music.brief || last.music;
    if (m.genre && m.genre.toLowerCase() === mb.genre.toLowerCase()) problems.push(`genre "${mb.genre}" repeats the previous film`);
    if (m.instrumentation && jacc(m.instrumentation, mb.instrumentation) >= 0.5) problems.push('instrumentation repeats the previous film');
    if (m.bpm && Math.abs(m.bpm - M.bpm) <= 4) problems.push(`BPM ${M.bpm} is within 4 of the previous film's ${m.bpm}`);
  }
  const feedback = prev.map((e) => ({ id: e.id, feedback: e.music.feedback })).filter((x) => x.feedback);
  const global = `Instrumental only, no vocals. ${mb.mood}. ${mb.genre}, ${M.bpm} BPM, exactly ${M.duration} seconds, ${M.duration / bar} bars of 4/4. ${mb.instrumentation.join(', ')}. Energy follows the picture: ${sections.map((s) => `${s.t0}-${s.t1}s ${s.name} (${s.style})`).join('; ')}. Downbeat or impact at ${M.hits.map((h) => h.t + 's').join(', ')}; near-silence from ${M.breath[0]}s to ${M.breath[1]}s; the last bar resolves so the track loops.`;
  const brief = { id, date: id.slice(0, 10), durationSec: M.duration, bpm: M.bpm, beatSec: beat, barSec: bar, mood: mb.mood, genre: mb.genre, instrumentation: mb.instrumentation, avoid: mb.avoid || [], vocals: !!mb.vocals, peak: M.peak, breath: M.breath, hits: M.hits, sections, feedbackToApply: feedback, problems, notes, prompt: global };
  const prompts = mb.interpretations.map((it, i) => ({ name: it.name, prompt: `${global} Interpretation ${i + 1}: ${it.name}. Instruments: ${it.instrumentation.join(', ')}. Feel: ${it.energy}.${feedback.length ? ' Apply the owner feedback: ' + feedback.map((f) => f.feedback).join(' / ') : ''} Do not imitate any existing song or artist.`, instrumentation: it.instrumentation }));
  const plan = (it) => ({ positive_global_styles: [mb.genre, `${M.bpm} bpm`, ...it.instrumentation], negative_global_styles: ['vocals', 'lyrics', ...(mb.avoid || [])], sections: sections.map((s) => ({ section_name: s.name, positive_local_styles: [s.style], negative_local_styles: s.energy === 'silence then riser' ? ['full drums', 'melody'] : [], duration_ms: s.durationMs, lines: [] })) });
  return { brief, prompts, plans: mb.interpretations.map(plan) };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const id = process.argv[2]; if (!id) { console.error('usage: brief.mjs ID'); process.exit(2); }
  const { brief, prompts, plans } = buildBrief(id), dir = audioDir(id); mkdirSync(dir, { recursive: true });
  writeJson(join(dir, 'brief.json'), brief); writeJson(join(dir, 'prompts.json'), prompts); writeJson(join(dir, 'plans.json'), plans);
  writeFileSync(join(dir, 'brief.md'), `# Music brief · ${id}\n\n- Duration: **${brief.durationSec} s** at **${brief.bpm} BPM** (${brief.durationSec / brief.barSec} bars; one beat = ${brief.beatSec} s)\n- Mood: ${brief.mood}\n- Genre: ${brief.genre}\n- Instrumentation: ${brief.instrumentation.join(', ')}\n- Avoid: ${brief.avoid.join(', ')}; instrumental only\n\n## Energy curve\n${brief.sections.map((s) => `- ${s.t0}-${s.t1} s **${s.name}**: ${s.style}`).join('\n')}\n\n## Hit points\n${brief.hits.map((h) => `- ${h.t} s ${h.kind}: ${h.label}`).join('\n')}\n- Breath (silence) ${brief.breath[0]}-${brief.breath[1]} s; peak ${brief.peak} s\n\n## Interpretations (3 candidates)\n${prompts.map((p, i) => `${i + 1}. ${p.name}: ${p.instrumentation.join(', ')}`).join('\n')}\n\n${brief.problems.length ? '## PROBLEMS (fix before generating)\n' + brief.problems.map((x) => '- ' + x).join('\n') + '\n' : ''}${brief.notes.length ? '## Notes\n' + brief.notes.map((x) => '- ' + x).join('\n') + '\n' : ''}`);
  console.log(`brief written to ${dir}`); brief.problems.forEach((x) => console.log('PROBLEM:', x)); brief.notes.forEach((x) => console.log('note:', x));
  process.exit(brief.problems.length ? 1 : 0);
}
