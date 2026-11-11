// The app's "Needs you" list (owner, 1 Nov 2026): questions and tasks for the owner, answered in the app. Run by the "Owner answers" workflow,
// which a Claude session dispatches; it signs in with the BASIC_AUTH secrets like scripts/post-card.mjs.
//   env:  ACTION = read | add | clear | mark | feedback | feedback-done, ASKS (JSON, see below), BASIC_AUTH_USER / BASIC_AUTH_PASS, SITE_BASE (default https://templates.aquariit.com)
//   read:  prints every reply waiting for Claude, one line each: ANSWER <id> <answered_at> <answer> | Q: <question>; and the open count
//          read also prints the owner's new Feedback items (owner, 11 Nov 2026), one line each: FEEDBACK <id> <time> <channel|-> <text>
//   feedback:      prints only the FEEDBACK lines (new items) and the count
//   feedback-done: ASKS = {"ids": [3, 4], "note": "what was done, short"} marks those items done; the app shows the note under each
//   add:   ASKS = [{ "id": "tech-bio", "question": "plain English", "why": "why it matters", "kind": "yesno" | "done" | "text", "channel": "web"|"tech"|"c3" }]
//   clear: ASKS = ["tech-bio", ...] (after acting on the replies; removes them for good)
//   mark:  ASKS = {"showreel-19-numbers": "2026-10-31T07:51:00Z", ...} marks reels uploaded at their real post time (an answer such as
//          "these are already on Instagram"); a reel already marked keeps its own time (POST /api/uploaded/import, insert-or-ignore)
// Usage: node scripts/asks.mjs
const SITE = (process.env.SITE_BASE || 'https://templates.aquariit.com').replace(/\/$/, ''), ACTION = process.env.ACTION || 'read';
const die = (m) => { console.error('✗ ' + m); process.exit(1); };
let items = [];
if (ACTION !== 'read' && ACTION !== 'feedback' && ACTION !== 'feedback-done') { try { items = JSON.parse(process.env.ASKS || '[]'); } catch (e) { die('ASKS is not valid JSON: ' + e.message); } if (ACTION !== 'mark' && (!Array.isArray(items) || !items.length)) die('ASKS must be a non-empty list'); }
if (ACTION === 'mark') { if (!items || Array.isArray(items) || typeof items !== 'object' || !Object.keys(items).length) die('mark: ASKS is {"showreel-...": "ISO time"}'); for (const [id, at] of Object.entries(items)) if (!/^showreel-[a-z0-9-]{1,60}$/.test(id) || isNaN(Date.parse(at))) die(`mark: bad entry ${id}`); }
const ID = /^[a-z0-9-]{1,60}$/;
if (ACTION === 'add') for (const a of items) { if (!a || !ID.test(a.id || '') || !a.question) die('each item needs an id (lowercase, dashes) and a question'); if (a.kind && !['yesno', 'done', 'text'].includes(a.kind)) die('kind is yesno, done or text'); }
if (ACTION === 'clear') for (const id of items) if (!ID.test(String(id))) die(`bad id ${id}`);
let fbDone = null;
if (ACTION === 'feedback-done') { try { fbDone = JSON.parse(process.env.ASKS || '{}'); } catch (e) { die('ASKS is not valid JSON: ' + e.message); }
  if (!fbDone || !Array.isArray(fbDone.ids) || !fbDone.ids.length || !fbDone.ids.every((i) => /^[0-9]{1,9}$/.test(String(i))) || typeof fbDone.note !== 'string' || !fbDone.note.trim()) die('feedback-done: ASKS is {"ids": [3], "note": "what was done"}'); }
if (!['read', 'add', 'clear', 'mark', 'feedback', 'feedback-done'].includes(ACTION)) die('ACTION is read, add, clear, mark, feedback or feedback-done');
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
  const r = await fetch(`${SITE}/api/feedback/${id}/done`, { method: 'POST', headers: H, body: JSON.stringify({ note: fbDone.note.trim() }) });
  if (!r.ok) die(`could not mark feedback ${id} done (HTTP ${r.status})`); const j = await r.json(); console.log(j.stored ? `✓ feedback ${id} done` : `✗ no feedback item ${id}`);
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
