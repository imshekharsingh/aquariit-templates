// Step 2: get 3 music candidates from a LICENSED source (never synthesised in code).
//   node scripts/audio/generate.mjs ID --provider elevenlabs          (needs ELEVENLABS_API_KEY and MUSIC_LICENCE_NOTE in the environment: secrets, never in files)
//   node scripts/audio/generate.mjs ID --from DIR --provider NAME --licence "terms"   (adopt 3 tracks made elsewhere, recording where they came from)
// Each candidate is saved as audio/<date>/<ID>/cand-N.(mp3|wav) with cand-N.json (prompt, plan, provider, model, date, licence terms).
// UNVERIFIED: the elevenlabs adapter follows the public Music API as I know it (composition plan, instrumental, exact length) but has never run against the live service
// (this environment cannot reach it); the first run must be checked by a human before it is trusted.
import { join, extname } from 'node:path';
import { readdirSync, copyFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { readJson, writeJson, audioDir } from './lib.mjs';

const a = process.argv.slice(2), id = a[0], opt = (n, d = '') => { const i = a.indexOf(n); return i > -1 ? a[i + 1] : d; };
if (!id) { console.error('usage: generate.mjs ID --provider elevenlabs | --from DIR --provider NAME --licence "terms"'); process.exit(2); }
const dir = audioDir(id), prompts = readJson(join(dir, 'prompts.json')), plans = readJson(join(dir, 'plans.json')), brief = readJson(join(dir, 'brief.json'));
if (!prompts) { console.error('run brief.mjs first'); process.exit(2); }
if (brief.problems?.length) { console.error('the brief has problems; fix them first:\n- ' + brief.problems.join('\n- ')); process.exit(2); }
const from = opt('--from'), provider = opt('--provider') || (process.env.ELEVENLABS_API_KEY ? 'elevenlabs' : '');
if (!provider && !from) { console.error('NO MUSIC SOURCE: no provider key is configured (add ELEVENLABS_API_KEY and MUSIC_LICENCE_NOTE as secrets) and no --from DIR was given. The film ships without a music bed.'); process.exit(3); }
mkdirSync(dir, { recursive: true });

if (from) {
  const files = readdirSync(from).filter((f) => /\.(mp3|wav|m4a|flac)$/i.test(f)).sort().slice(0, 3);
  if (files.length < 1 || !opt('--licence') || !provider) { console.error('need audio files in --from DIR, --provider and --licence "terms"'); process.exit(2); }
  files.forEach((f, i) => { copyFileSync(join(from, f), join(dir, `cand-${i + 1}${extname(f)}`)); writeJson(join(dir, `cand-${i + 1}.json`), { provider, source: 'imported', originalName: f, prompt: prompts[i]?.prompt || null, date: new Date().toISOString(), licence: opt('--licence') }); });
  console.log(`imported ${files.length} candidates`); process.exit(0);
}
if (provider !== 'elevenlabs') { console.error('unknown provider; supported: elevenlabs (or --from DIR)'); process.exit(2); }
const key = process.env.ELEVENLABS_API_KEY, licence = process.env.MUSIC_LICENCE_NOTE;
if (!key) { console.error('NO MUSIC SOURCE: ELEVENLABS_API_KEY is not set (add it as a GitHub secret / environment variable; never write it into a file). The film ships without a music bed.'); process.exit(3); }
if (!licence) { console.error('set MUSIC_LICENCE_NOTE to the licence terms of your plan (they are recorded with every candidate)'); process.exit(2); }
for (let i = 0; i < 3; i++) {
  const body = { composition_plan: plans[i], model_id: 'music_v1' }, r = await fetch('https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128', { method: 'POST', headers: { 'xi-api-key': key, 'content-type': 'application/json' }, body: JSON.stringify(body) });
  if (!r.ok) { console.error(`candidate ${i + 1}: HTTP ${r.status} ${(await r.text()).slice(0, 300)}`); process.exit(1); }
  writeFileSync(join(dir, `cand-${i + 1}.mp3`), Buffer.from(await r.arrayBuffer()));
  writeJson(join(dir, `cand-${i + 1}.json`), { provider, model: 'music_v1', prompt: prompts[i].prompt, plan: plans[i], date: new Date().toISOString(), licence });
  console.log(`candidate ${i + 1} saved (${prompts[i].name})`);
}
