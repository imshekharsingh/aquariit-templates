// Tell the app's live studio board which stage today's reel is in (owner, 24 Nov 2026). Sessions and workflows call it.
//   node scripts/stage.mjs <reel|web|tech|c3> <stage> [--model fable] [--line "Rendering 62%"] [--pct 40] [--thumb frame.jpg]
//   node scripts/stage.mjs project:<id> <planned|building|stills|render|checking|critic|done|waiting|failed> [--line "..."] [--pct n]   a project row
//   (owner, 26 Nov 2026; the project's entry in design/projects.json is the main record: the newer of the two shows on the board)
// stage: researching | topic | building | stills | video | checking | ready | skipped | posted
// Use the channel (web, tech, c3) until the reel has a name. --thumb is a small JPEG (at most 200 KB; make one with
// ffmpeg -i frame.png -vf scale=360:-1 -q:v 5 thumb.jpg). The key: in a workflow set env STAGE_KEY from the secret; in a session the
// network proxy adds an Authorization: Bearer header for the app host (one network secret per host), so nothing is needed here. The key is never printed or written anywhere.
// Never blocks work: a failed call prints one line and exits 0 (use --strict to fail).
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const a = process.argv.slice(2), strict = a.includes('--strict');
const pos = a.filter((x, i) => !x.startsWith('--') && !(i > 0 && a[i - 1].startsWith('--') && a[i - 1] !== '--strict'));
const opt = (n) => { const i = a.indexOf('--' + n); return i >= 0 ? a[i + 1] : undefined; };
const [reel, stage] = pos;
const STAGES = ['researching', 'topic', 'building', 'stills', 'video', 'checking', 'ready', 'skipped', 'posted'];
const PSTAGES = ['planned', 'building', 'stills', 'render', 'checking', 'critic', 'done', 'waiting', 'failed'], isProject = /^project:[a-z0-9-]{1,40}$/.test(reel || '');
if (isProject && !PSTAGES.includes(stage)) { console.error('Usage: node scripts/stage.mjs project:<id> <' + PSTAGES.join('|') + '> [--line text] [--pct n]'); process.exit(2); }
if (!isProject && (!reel || !STAGES.includes(stage))) { console.error('Usage: node scripts/stage.mjs <reel|web|tech|c3> <' + STAGES.join('|') + '> [--model m] [--line text] [--pct n] [--thumb file.jpg]'); process.exit(2); }
const body = { reel, stage };
if (opt('model')) body.model = opt('model');
if (opt('line')) body.line = opt('line');
if (opt('pct') !== undefined) body.pct = Number(opt('pct'));
if (opt('thumb')) { try { body.thumb = readFileSync(opt('thumb')).toString('base64'); } catch { console.error('stage: thumb file not readable, sending without it'); } }
const host = process.env.STAGE_HOST || 'templates.aquariit.com';
// workflows pass the secret in env STAGE_KEY (header X-Stage-Key); with it empty nothing is sent and the proxy's Authorization header is used (sessions)
const r = spawnSync('curl', ['-sS', '--connect-timeout', '15', '--max-time', '60', '--retry', '2', '-o', '/dev/null', '-w', '%{http_code}', '-X', 'POST',
  '-H', 'Content-Type: application/json', ...(process.env.STAGE_KEY ? ['-H', 'X-Stage-Key: ' + process.env.STAGE_KEY] : []), '--data-binary', '@-', `https://${host}/api/stage`],
  { input: JSON.stringify(body), encoding: 'utf8' });
const code = +(r.stdout || '').trim().slice(-3) || 0;
if (code === 200) console.log(`stage ok: ${reel} -> ${stage}`);
else { console.error(`stage not sent (${code ? 'HTTP ' + code : 'no connection'}${code === 401 ? ': STAGE_KEY is not set up yet' : ''})`); if (strict) process.exit(1); }
