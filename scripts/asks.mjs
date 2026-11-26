// The app's "Needs you" list (owner, 1 Nov 2026): questions and tasks for the owner, answered in the app. Run by the "Owner answers" workflow,
// which a Claude session dispatches; it signs in with the BASIC_AUTH secrets like scripts/post-card.mjs.
//   env:  ACTION = read | add | clear | mark | unmark | feedback | feedback-done, ASKS (JSON, see below), BASIC_AUTH_USER / BASIC_AUTH_PASS, SITE_BASE (default https://templates.aquariit.com)
//   read:  prints every reply waiting for Claude, one line each: ANSWER <id> <answered_at> <answer> | Q: <question>; and the open count
//          read also prints the owner's new Feedback items (owner, 11 Nov 2026), one line each: FEEDBACK <id> <time> <channel|-> <text>
//   feedback:      prints only the FEEDBACK lines (new items) and the count
//   feedback-done: ASKS = {"ids": [3, 4], "note": "what was done, short"} marks those items done; the app shows the note under each
//   refs:          prints the owner's new References (owner, 20 Nov 2026: links, screenshots, short clips), one line each:
//                  REF <id> <time> <channel|-> <url|-> <file type|-> <note>; for each file a small JPEG preview (an image scaled to 720 px, a clip as
//                  a 4x2 sheet of 8 frames spread over the whole clip; ASKS {"full": [ids]} adds time-stamped sheets of the whole clip at 1 frame a second) as a "B64 ref-<id>.jpg <base64>" log line (stderr, not the summary):
//                  node scripts/media/from-log.mjs <run id> <dir> turns them back into files. Study each into design/references.md, then refs-done
//   refs-done:     (also "checklist", "stills", "replies", see below) ASKS = {"ids": [3], "state": "studied" | "used", "note": "what was taken, or the reel it went into"}; the app shows the note
//   add:   ASKS = [{ "id": "tech-bio", "question": "plain English", "why": "why it matters", "kind": "yesno" | "done" | "text", "channel": "web"|"tech"|"c3" }]
//   clear: ASKS = ["tech-bio", ...] (after acting on the replies; removes them for good)
//   mark:  ASKS = {"showreel-19-numbers": "2026-10-31T07:51:00Z", ...} marks reels uploaded at their real post time (an answer such as
//          "these are already on Instagram"); a reel already marked keeps its own time (POST /api/uploaded/import, insert-or-ignore)
//   unmark: ASKS = ["showreel-tech-watch-5atm", ...] clears a "posted" mark tapped by mistake (owner, 15 Nov 2026), as the app's own untick does
//          (PUT /api/uploaded/<id> {"on": false}); prints whether each reel was marked before
//   list:  prints everything the owner sees in the app, one line each (ASK / ANSWER / REPLY / REF / CARD / PREVIEW), to review before a cleanup
//   tidy:  the Inbox cleanup rules (owner, 23 Nov 2026), run by `read` too, so the daily run applies them without a new task:
//          asks:     an open ask past its "until" date (add: {"id","question","until":"YYYY-MM-DD"}) is removed; an answered ask is removed 3 days after the answer
//          replies:  Claude's replies (done feedback) still unread 2 days after done are marked read
//          cards:    daily reports older than 2 days (IST) are removed
//          previews: PREVIEW lines name entries of templates/showreels/previews.json that the owner answered or that are past 7 days (the app already hides them; remove them from the file)
//          refs:     studied/used references older than 2 days are hidden by the app (nothing deleted here)
// Usage: node scripts/asks.mjs
const SITE = (process.env.SITE_BASE || 'https://templates.aquariit.com').replace(/\/$/, ''), ACTION = process.env.ACTION || 'read';
const die = (m) => { console.error('✗ ' + m); process.exit(1); };
let items = [];
if (ACTION !== 'read' && ACTION !== 'list' && ACTION !== 'tidy' && ACTION !== 'feedback' && ACTION !== 'feedback-done' && ACTION !== 'refs' && ACTION !== 'refs-done') { try { items = JSON.parse(process.env.ASKS || '[]'); } catch (e) { die('ASKS is not valid JSON: ' + e.message); } if (ACTION === 'unmark' && (!Array.isArray(items) || !items.length || !items.every((id) => /^showreel-[a-z0-9-]{1,60}$/.test(id)))) die('unmark: ASKS is ["showreel-..."]');
if (ACTION !== 'mark' && (!Array.isArray(items) || !items.length)) die('ASKS must be a non-empty list'); }
if (ACTION === 'mark') { if (!items || Array.isArray(items) || typeof items !== 'object' || !Object.keys(items).length) die('mark: ASKS is {"showreel-...": "ISO time"}'); for (const [id, at] of Object.entries(items)) if (!/^showreel-[a-z0-9-]{1,60}$/.test(id) || isNaN(Date.parse(at))) die(`mark: bad entry ${id}`); }
const ID = /^[a-z0-9-]{1,60}$/;
if (ACTION === 'add') for (const a of items) { if (!a || !ID.test(a.id || '') || !a.question) die('each item needs an id (lowercase, dashes) and a question'); if (a.kind && !['yesno', 'done', 'text'].includes(a.kind)) die('kind is yesno, done or text'); }
if (ACTION === 'clear') for (const id of items) if (!ID.test(String(id))) die(`bad id ${id}`);
let fbDone = null;
if (ACTION === 'feedback-done') { try { fbDone = JSON.parse(process.env.ASKS || '{}'); } catch (e) { die('ASKS is not valid JSON: ' + e.message); }
  if (!fbDone || !Array.isArray(fbDone.ids) || !fbDone.ids.length || !fbDone.ids.every((i) => /^[0-9]{1,9}$/.test(String(i)))) die('feedback-done: ASKS is {"ids": [3], "flag": "done", "note": "action report", "proof": "check name"}');
  fbDone.flag = fbDone.flag || 'done';
  if (!['reviewed', 'in_progress', 'done'].includes(fbDone.flag)) die('feedback-done: flag is reviewed, in_progress or done');
  if (fbDone.flag === 'reviewed' && !/fable|opus|sonnet|haiku/i.test(fbDone.by || '')) die('feedback-done: flag reviewed needs "by": "fable" or "opus"');
  if (fbDone.flag === 'done' && (typeof fbDone.note !== 'string' || !fbDone.note.trim() || !((fbDone.proof || '').trim() || fbDone.image))) die('feedback-done: flag done needs "note" (the action report) and "proof" (a check name) or "image" (base64 JPEG/PNG under 400 KB)'); }
let refDone = null;
if (ACTION === 'refs-done') { try { refDone = JSON.parse(process.env.ASKS || '{}'); } catch (e) { die('ASKS is not valid JSON: ' + e.message); }
  if (!refDone || !Array.isArray(refDone.ids) || !refDone.ids.length || !refDone.ids.every((i) => /^[0-9]{1,9}$/.test(String(i))) || !['new', 'studied', 'used'].includes(refDone.state) || typeof refDone.note !== 'string' || !refDone.note.trim()) die('refs-done: ASKS is {"ids": [3], "state": "studied", "note": "what was taken"}'); }
if (!['read', 'list', 'tidy', 'add', 'clear', 'mark', 'unmark', 'feedback', 'feedback-done', 'refs', 'refs-done'].includes(ACTION)) die('ACTION is read, list, tidy, add, clear, mark, unmark, feedback, feedback-done, refs or refs-done');
const U = process.env.BASIC_AUTH_USER, P = process.env.BASIC_AUTH_PASS;
if (!U || !P) die('BASIC_AUTH_USER / BASIC_AUTH_PASS are missing');
const login = await fetch(SITE + '/login', { method: 'POST', redirect: 'manual', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ username: U, password: P }) });
const cookie = (login.headers.getSetCookie ? login.headers.getSetCookie() : []).map((c) => c.split(';')[0]).join('; ');
if (login.status !== 303 || !cookie) die(`the site refused the sign-in (HTTP ${login.status})`);
const H = { 'Content-Type': 'application/json', 'X-Requested-With': 'reel', Cookie: cookie };
if (ACTION === 'read') {
  const get = async (q) => { const r = await fetch(SITE + '/api/asks' + q, { headers: { Cookie: cookie } }); if (!r.ok) die(`could not read the list (HTTP ${r.status})`); return (await r.json()).asks || []; };
  const done = await get('?answered=1'), open = await get('');
  for (const a of done) console.log(`ANSWER ${a.id} ${a.answered_at} ${JSON.stringify(a.answer)} | Q: ${a.question}`);
  console.log(`${done.length} answered, waiting for Claude; ${open.length} still open in the app${open.length ? ': ' + open.map((a) => a.id).join(', ') : ''}`);
}
if (ACTION === 'read' || ACTION === 'feedback') {
  const r = await fetch(SITE + '/api/feedback?state=new', { headers: { Cookie: cookie } });
  if (!r.ok) die(`could not read the feedback (HTTP ${r.status})`);
  const fb = ((await r.json()).feedback || []).slice().reverse();   // oldest first
  for (const f of fb) console.log(`FEEDBACK ${f.id} ${f.created} ${f.channel || '-'} ${JSON.stringify(f.text)}`);
  console.log(`${fb.length} new feedback item${fb.length === 1 ? '' : 's'} (act on each or file it in design/todo.md, then feedback-done with a note)`);
}
if (ACTION === 'feedback-done') for (const id of fbDone.ids) {
  const r = await fetch(`${SITE}/api/feedback/${id}/flag`, { method: 'POST', headers: H, body: JSON.stringify({ flag: fbDone.flag, by: fbDone.by, report: (fbDone.note || '').trim(), proof: fbDone.proof, image: fbDone.image }) });
  if (!r.ok) die(`could not set feedback ${id} to ${fbDone.flag} (HTTP ${r.status})`); const j = await r.json(); console.log(j.stored ? `✓ feedback ${id} ${fbDone.flag}` : `✗ feedback ${id}: not changed (closed, or no such item)`);
}
if (ACTION === 'refs') {
  const r = await fetch(SITE + '/api/refs?state=new', { headers: { Cookie: cookie } });
  if (!r.ok) die(`could not read the references (HTTP ${r.status})`);
  const refs = ((await r.json()).refs || []).slice().reverse();   // oldest first
  const { execFileSync } = await import('node:child_process'), { mkdtempSync, writeFileSync, readFileSync, existsSync } = await import('node:fs'), { tmpdir } = await import('node:os'), { join } = await import('node:path');
  let ff = true; try { execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' }); } catch { ff = false; }
  const td = mkdtempSync(join(tmpdir(), 'refs-'));
  let fullIds = []; try { fullIds = ((JSON.parse(process.env.ASKS || '{}') || {}).full || []).map(Number); } catch { /* none */ }
  for (const f of refs) {
    console.log(`REF ${f.id} ${f.created} ${f.channel || '-'} ${f.url || '-'} ${f.file ? f.file.type + ' ' + JSON.stringify(f.file.name) + ' ' + f.file.size + ' B' : '-'} ${JSON.stringify(f.note || '')}`);
    if (!f.file || !ff) continue;
    const g = await fetch(`${SITE}/api/refs/${f.id}/file`, { headers: { Cookie: cookie } });
    if (!g.ok) { console.log(`  (file ${f.id}: HTTP ${g.status})`); continue; }
    const src = join(td, `in-${f.id}`), out = join(td, `ref-${f.id}.jpg`);
    { const { createWriteStream } = await import('node:fs'), { Readable } = await import('node:stream'), { pipeline } = await import('node:stream/promises');   // files up to 1 GB: stream to disk, never into memory
      await pipeline(Readable.fromWeb(g.body), createWriteStream(src)); }
    const video = /^video\//.test(f.file.type);
    let dur = 0; if (video) try { dur = parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', src]).toString()) || 0; } catch { /* unknown */ }
    if (video) console.log(`  length ${dur.toFixed(1)} s`);
    // 26 Nov 2026: the sheet was fps=1 tile=4x2, i.e. only the first 8 seconds of a clip. Now 8 frames spread over the whole clip;
    // ASKS {"full": [ids]} also prints the whole clip at 1 frame a second, 24 frames (24 s) per sheet: ref-<id>-s01.jpg, -s02.jpg, ...
    const vf = video ? `fps=${dur > 8 ? (8 / dur).toFixed(4) : 1},scale=240:-2,tile=4x2` : "scale='min(720,iw)':-2";
    try { execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', src, '-vf', vf, '-frames:v', '1', '-q:v', '5', out], { stdio: 'ignore', timeout: 60000 }); } catch { /* no preview */ }
    if (existsSync(out)) console.error(`B64 ref-${f.id}.jpg ${readFileSync(out).toString('base64')}`); else console.log(`  (no preview for ${f.id})`);
    if (video && fullIds.includes(Number(f.id))) {
      const pat = join(td, `ref-${f.id}-s%02d.jpg`);
      try { execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', src, '-vf', "fps=1,scale=180:-2,drawtext=text='%{pts\\:hms}':x=4:y=4:fontsize=18:fontcolor=yellow:box=1:boxcolor=black@0.6,tile=6x4", '-q:v', '6', pat], { stdio: 'ignore', timeout: 300000 }); } catch (e) { console.log(`  (full sheets ${f.id} failed: ${e.message.split('\n')[0]})`); }
      const { readdirSync } = await import('node:fs'); let n = 0;
      for (const s of readdirSync(td).filter((x) => x.startsWith(`ref-${f.id}-s`)).sort()) { console.error(`B64 ${s} ${readFileSync(join(td, s)).toString('base64')}`); n++; }
      console.log(`  full study: ${n} sheets (1 frame a second, 24 s a sheet, time stamped)`);
    }
  }
  console.log(`${refs.length} new reference${refs.length === 1 ? '' : 's'}${ff ? '' : ' (ffmpeg missing: no previews)'} (study each into design/references.md, then refs-done with a note)`);
  // the owner's answers on earlier reports (owner, 24 Nov 2026): Keep / Skip on each checklist line, and the Ask questions waiting for a reply
  const all = (await (await fetch(SITE + '/api/refs', { headers: { Cookie: cookie } })).json()).refs || [];
  for (const f of all) { if (f.closed) continue; (f.checklist || []).forEach((c, i) => { if (c.c === 'keep' || c.c === 'skip') console.log(`REFCHECK ${f.id} ${i} ${c.c} ${JSON.stringify(c.t)}`);
    const last = (c.th || [])[(c.th || []).length - 1]; if (last && last.w === 'owner') console.log(`REFASK ${f.id} ${i} ${JSON.stringify(c.t)} QUESTION ${JSON.stringify(last.t)} (answer with refs-done "replies": [{"item": ${i}, "text": "..."}])`); }); }
}
if (ACTION === 'refs-done') for (const id of refDone.ids) {
  // report (owner, 24 Nov 2026): "checklist": ["short line the owner marks Keep / Skip / Ask", ...], "stills": [a JPEG path or base64, at most 8, 200 KB each], "replies": [{"item": 0, "text": "answer to an Ask"}]
  const { readFileSync, existsSync } = await import('node:fs');
  const stills = (refDone.stills || []).slice(0, 8).map((x) => (typeof x === 'string' && x.length < 400 && existsSync(x) ? readFileSync(x).toString('base64') : x));
  const rich = (refDone.checklist && refDone.checklist.length) || stills.length;
  const r = rich ? await fetch(`${SITE}/api/refs/${id}/report`, { method: 'POST', headers: H, body: JSON.stringify({ state: refDone.state, note: refDone.note.trim(), checklist: refDone.checklist || [], stills }) })
    : await fetch(`${SITE}/api/refs/${id}/state`, { method: 'POST', headers: H, body: JSON.stringify({ state: refDone.state, note: refDone.note.trim() }) });
  if (!r.ok) die(`could not set reference ${id} (HTTP ${r.status})`); const j = await r.json(); console.log(j.stored ? `✓ reference ${id} ${refDone.state}${rich ? ` (${j.items || 0} checklist lines, ${j.stills || 0} stills)` : ''}` : `✗ no reference ${id}`);
  for (const q of refDone.replies || []) { const t = await fetch(`${SITE}/api/refs/${id}/thread`, { method: 'POST', headers: H, body: JSON.stringify({ item: q.item, text: q.text, who: 'claude' }) }); console.log(t.ok ? `✓ reference ${id} line ${q.item} answered` : `✗ reference ${id} line ${q.item} (HTTP ${t.status})`); }
}
if (ACTION === 'add') for (const a of items) {
  const r = await fetch(`${SITE}/api/asks/${a.id}`, { method: 'PUT', headers: H, body: JSON.stringify(a) });
  if (!r.ok) die(`could not add ${a.id} (HTTP ${r.status})`); console.log(`✓ added ${a.id}`);
}
if (ACTION === 'clear') for (const id of items) {
  const r = await fetch(`${SITE}/api/asks/${id}`, { method: 'DELETE', headers: H });
  if (!r.ok) die(`could not clear ${id} (HTTP ${r.status})`); console.log(`✓ cleared ${id}`);
}
if (ACTION === 'mark') {
  const r = await fetch(SITE + '/api/uploaded/import', { method: 'POST', headers: H, body: JSON.stringify({ ids: items }) });
  if (!r.ok) die(`could not mark the reels (HTTP ${r.status})`); console.log(`✓ marked uploaded (already-marked reels keep their time): ${Object.keys(items).join(', ')}`);
}
if (ACTION === 'unmark') {
  const g = await fetch(SITE + '/api/uploaded', { headers: { Cookie: cookie } }); if (!g.ok) die(`could not read the marks (HTTP ${g.status})`);
  const before = (await g.json()).ids || {};
  for (const id of items) {
    const r = await fetch(`${SITE}/api/uploaded/${id}`, { method: 'PUT', headers: H, body: JSON.stringify({ on: false }) });
    if (!r.ok) die(`could not clear the mark on ${id} (HTTP ${r.status})`);
    console.log(before[id] ? `✓ cleared the posted mark on ${id} (it was marked ${before[id]})` : `✓ ${id} was not marked (nothing to clear)`);
  }
}

// ---- list / tidy (owner, 23 Nov 2026: keep the Inbox and Needs you clear of what no longer needs the owner)
if (ACTION === 'list' || ACTION === 'tidy' || ACTION === 'read') {
  const J = async (path) => { const r = await fetch(SITE + path, { headers: { Cookie: cookie } }); if (!r.ok) die(`could not read ${path} (HTTP ${r.status})`); return r.json(); };
  const day = (t) => new Date(Date.parse(t) + 5.5 * 36e5).toISOString().slice(0, 10), todayIST = day(new Date().toISOString()), ageDays = (t) => (Date.now() - Date.parse(t)) / 864e5;
  const open = (await J('/api/asks')).asks || [], answered = (await J('/api/asks?answered=1')).asks || [], fb = (await J('/api/feedback')).feedback || [],
    refs = (await J('/api/refs')).refs || [], cards = (await J('/api/cards')).cards || [];
  let pv = []; try { pv = JSON.parse((await import('node:fs')).readFileSync('templates/showreels/previews.json', 'utf8')).items || []; } catch { /* not checked out */ }
  const said = new Map(); for (const f of fb.slice().reverse()) { const m = /^Preview ([a-z0-9-]+): (Like|Reject|Not this)/.exec(f.text || ''); if (m) said.set(m[1], m[2]); }
  const pvOld = pv.filter((p) => said.has(p.name) || !p.added || ageDays(p.added + 'T00:00:00+05:30') > 7);
  if (ACTION === 'list') {
    for (const a of open) console.log(`ASK ${a.id} ${a.created} ${a.channel || '-'} until ${a.until || '-'} ${JSON.stringify(a.question)}`);
    for (const a of answered) console.log(`ANSWERED ${a.id} ${a.answered_at} ${JSON.stringify(a.answer)}`);
    for (const f of fb) if (f.state === 'done' && f.note) console.log(`REPLY ${f.id} done ${f.done_at} ${f.read_at ? 'read' : 'UNREAD'} ${JSON.stringify(f.text.slice(0, 80))}`); else console.log(`MESSAGE ${f.id} ${f.created} ${f.state} ${JSON.stringify(f.text.slice(0, 80))}`);
    for (const r of refs) console.log(`REF ${r.id} ${r.created} ${r.state} ${r.done_at || '-'} ${r.url || (r.file && r.file.name) || '-'}`);
    for (const c of cards) console.log(`CARD ${c.id} ${c.day} ${c.kind || 'audit'} ${JSON.stringify(c.title)}`);
    for (const p of pv) console.log(`PREVIEW ${p.name} added ${p.added || '-'} ${said.get(p.name) ? 'answered: ' + said.get(p.name) : 'waiting'}`);
  }
  if (ACTION === 'tidy' || ACTION === 'read') {
    let n = 0; const del = async (path, what) => { const r = await fetch(SITE + path, { method: 'DELETE', headers: H }); console.log(r.ok ? `✓ tidy: removed ${what}` : `✗ tidy: could not remove ${what} (HTTP ${r.status})`); n += r.ok ? 1 : 0; };
    for (const a of open) if (a.until && a.until < todayIST) await del('/api/asks/' + a.id, `ask ${a.id} (past ${a.until})`);
    for (const a of answered) if (a.answered_at && ageDays(a.answered_at) > 3 ) await del('/api/asks/' + a.id, `answered ask ${a.id}`);
    for (const f of fb) if (f.state === 'done' && f.note && !f.read_at && f.done_at && ageDays(f.done_at) > 2) {
      const r = await fetch(`${SITE}/api/feedback/${f.id}/read`, { method: 'POST', headers: H, body: '{}' }); console.log(r.ok ? `✓ tidy: reply ${f.id} marked read` : `✗ tidy: reply ${f.id} (HTTP ${r.status})`); n += r.ok ? 1 : 0; }
    for (const c of cards) if (c.day && ageDays(c.day + 'T00:00:00+05:30') > 2) await del('/api/cards/' + encodeURIComponent(c.id), `report ${c.id} (${c.day})`);
    for (const p of pvOld) console.log(`PREVIEW ${p.name}: ${said.has(p.name) ? 'answered (' + said.get(p.name) + ')' : 'past 7 days'}; the app hides it; remove it from templates/showreels/previews.json (and its study/ files)`);
    console.log(`tidy: ${n} item${n === 1 ? '' : 's'} cleaned, ${pvOld.length} preview${pvOld.length === 1 ? '' : 's'} to drop from the file`);
  }
}
