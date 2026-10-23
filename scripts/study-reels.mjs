// Reel study (owner, 23 Oct 2026: "audio and transition sounds are really important ... these aren't even evaluated by you"):
// downloads the latest reels of one account through the official Instagram API (read-only, the same token rules as ig-collect.mjs)
// so the workflow can measure their audio and look at their first seconds. Never prints the token.
// Usage: node scripts/study-reels.mjs --slot N --limit K --out DIR
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const args = process.argv.slice(2), opt = (n, d) => { const i = args.indexOf(n); return i > -1 ? args[i + 1] : d; };
const SLOT = +opt('--slot', 1), LIMIT = +opt('--limit', 3), OUT = opt('--out', 'out/study'), IG = 'https://graph.instagram.com', SITE = 'https://templates.aquariit.com';
const ENV_TOKEN = process.env.INSTAGRAM_TOKEN || '';
if (!ENV_TOKEN) { console.error('missing token'); process.exit(1); }
let cookie = '';
const U = process.env.BASIC_AUTH_USER, P = process.env.BASIC_AUTH_PASS;
if (U && P) { const r = await fetch(SITE + '/login', { method: 'POST', redirect: 'manual', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ username: U, password: P }) });
  cookie = (r.headers.getSetCookie ? r.headers.getSetCookie() : []).map((c) => c.split(';')[0]).join('; '); }
let stored = null; if (cookie) { try { const r = await fetch(SITE + '/api/perf/token?slot=' + SLOT, { headers: { Cookie: cookie } }); if (r.ok) { const j = await r.json(); if (j && j.token) stored = j.token; } } catch {} }
async function media(token){ const u = new URL(IG + '/me/media'); u.searchParams.set('fields', 'id,caption,media_type,media_url,permalink,timestamp'); u.searchParams.set('limit', '25'); u.searchParams.set('access_token', token);
  const r = await fetch(u); const j = await r.json().catch(() => ({})); return r.ok && !j.error ? j.data || [] : null; }
let list = null; for (const t of [stored, ENV_TOKEN].filter(Boolean)) { list = await media(t); if (list) break; }
if (!list) { console.error('could not list media (token or permission)'); process.exit(1); }
const reels = list.filter((m) => m.media_type === 'VIDEO' && m.media_url).slice(0, LIMIT);
mkdirSync(OUT, { recursive: true });
const meta = [];
for (const [i, m] of reels.entries()) {
  const name = `slot${SLOT}-${i + 1}`, r = await fetch(m.media_url); if (!r.ok) { console.error('download failed', name); continue; }
  writeFileSync(join(OUT, name + '.mp4'), Buffer.from(await r.arrayBuffer()));
  meta.push({ name, posted: m.timestamp, permalink: m.permalink, caption: (m.caption || '').split('\n')[0].slice(0, 120) });
  console.log(name, m.timestamp, (m.caption || '').split('\n')[0].slice(0, 80));
}
writeFileSync(join(OUT, `slot${SLOT}.json`), JSON.stringify(meta, null, 1));
