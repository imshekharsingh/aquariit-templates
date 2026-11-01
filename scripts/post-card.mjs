// Puts a card at the top of the app (owner, 1 Nov 2026): the daily audit, or the spare-usage night's report. Run by the "Audit card"
// workflow, which a Claude session dispatches with the card as JSON; it signs in with the BASIC_AUTH secrets like scripts/ig-collect.mjs.
//   env:  CARD (the card JSON), BASIC_AUTH_USER / BASIC_AUTH_PASS, SITE_BASE (default https://templates.aquariit.com)
//   card: { "id": "audit-2026-11-02", "kind": "audit" | "spare" | "note", "day": "2026-11-02", "title": "optional",
//           "points": ["today's points, numbers first"], "channels": { "web": ["..."], "tech": ["..."], "c3": ["..."] } }
// The same id replaces the card (a re-run never duplicates it). Usage: node scripts/post-card.mjs [--dry]
const DRY = process.argv.includes('--dry'), SITE = (process.env.SITE_BASE || 'https://templates.aquariit.com').replace(/\/$/, '');
const die = (m) => { console.error('✗ ' + m); process.exit(1); };
let card;
try { card = JSON.parse(process.env.CARD || ''); } catch (e) { die('CARD is not valid JSON: ' + e.message); }
if (!card || typeof card !== 'object') die('CARD must be a JSON object');
const day = card.day || new Date(Date.now() + 5.5 * 36e5).toISOString().slice(0, 10), kind = card.kind || 'audit';
const id = card.id || `${kind}-${day}`;
if (!/^[a-z0-9-]{1,60}$/.test(id)) die('id must be lowercase letters, digits and dashes (max 60)');
if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) die('day must be YYYY-MM-DD');
const isList = (v) => Array.isArray(v) && v.every((x) => typeof x === 'string');
if (card.points !== undefined && !isList(card.points)) die('points must be a list of strings');
for (const [k, v] of Object.entries(card.channels || {})) { if (!['web', 'tech', 'c3'].includes(k)) die(`unknown channel "${k}" (web, tech, c3)`); if (!isList(v)) die(`channels.${k} must be a list of strings`); }
const body = { kind, day, title: card.title, points: card.points || [], channels: card.channels || {} };
if (!body.points.length && !Object.values(body.channels).some((v) => v.length)) die('the card is empty');
console.log(`Card ${id} (${kind}, ${day}): ${body.points.length} points, channels ${Object.keys(body.channels).join(', ') || 'none'}`);
if (DRY) { console.log(JSON.stringify(body, null, 2)); process.exit(0); }
const U = process.env.BASIC_AUTH_USER, P = process.env.BASIC_AUTH_PASS;
if (!U || !P) die('BASIC_AUTH_USER / BASIC_AUTH_PASS are missing');
const login = await fetch(SITE + '/login', { method: 'POST', redirect: 'manual', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ username: U, password: P }) });
const cookie = (login.headers.getSetCookie ? login.headers.getSetCookie() : []).map((c) => c.split(';')[0]).join('; ');
if (login.status !== 303 || !cookie) die(`the site refused the sign-in (HTTP ${login.status})`);
const r = await fetch(`${SITE}/api/cards/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'reel', Cookie: cookie }, body: JSON.stringify(body) });
if (!r.ok) die(`the site did not store the card (HTTP ${r.status}: ${(await r.text()).slice(0, 200)})`);
console.log(`✓ card ${id} is in the app`);
