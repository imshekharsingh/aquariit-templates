// Sign-in gate in front of the static assets (PWA-friendly: a login page + signed session cookie, no browser Basic-auth popup).
// Credentials live ONLY in Worker secrets, never in the repo: BASIC_AUTH_USER / BASIC_AUTH_PASS, plus an optional second account
// BASIC_AUTH_USER_2 / BASIC_AUTH_PASS_2 (either account can sign in). Fails closed if no account is configured.
// HTTP Basic headers are still accepted so scripts/CI can authenticate with curl --user.
const COOKIE = 'aq_session', TTL = 60 * 60 * 24 * 30; // 30 days
const PUBLIC = (p) => p === '/login' || p === '/logout' || p === '/manifest.webmanifest' || p === '/sw.js' || p.startsWith('/icons/');
const enc = new TextEncoder();

const b64u = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64u = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4)), (c) => c.charCodeAt(0));

async function safeEqual(a, b) {
  const [x, y] = await Promise.all([crypto.subtle.digest('SHA-256', enc.encode(a)), crypto.subtle.digest('SHA-256', enc.encode(b))]);
  const A = new Uint8Array(x), B = new Uint8Array(y);
  let d = 0;
  for (let i = 0; i < A.length; i++) d |= A[i] ^ B[i];
  return d === 0;
}
// Accounts: index 0 = primary, 1 = optional second. Each session cookie remembers which account signed in, and is signed with a key
// derived from THAT account's credentials, so changing one account's password signs out only that account.
const accounts = (env) => [[env.BASIC_AUTH_USER, env.BASIC_AUTH_PASS], [env.BASIC_AUTH_USER_2, env.BASIC_AUTH_PASS_2]]
  .map(([u, p], i) => ({ i, u, p })).filter((a) => a.u && a.p);
// username is case-insensitive (phones love capital letters), the password is exact. Every account is always compared (no early exit).
async function matchAccount(user, pass, env) {
  let hit = -1;
  for (const a of accounts(env)) {
    const ok = ((await safeEqual(String(user).trim().toLowerCase(), a.u.trim().toLowerCase())) & (await safeEqual(String(pass), a.p))) === 1;
    if (ok && hit < 0) hit = a.i;
  }
  return hit;
}
async function sessionKey(env, idx) {
  const a = accounts(env).find((x) => x.i === idx);
  if (!a) return null;
  const raw = await crypto.subtle.digest('SHA-256', enc.encode(`${a.u}\n${a.p}\naquarii-session-v1`));
  return crypto.subtle.importKey('raw', raw, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}
async function makeSession(env, idx) {
  const exp = Math.floor(Date.now() / 1000) + TTL, msg = idx === 0 ? String(exp) : `${idx}.${exp}`;
  const sig = b64u(await crypto.subtle.sign('HMAC', await sessionKey(env, idx), enc.encode(msg)));
  return idx === 0 ? `v1.${exp}.${sig}` : `v2.${idx}.${exp}.${sig}`; // v1 = primary account (the format already issued), v2 = other accounts
}
async function validSession(env, value) {
  const m = /^v1\.(\d+)\.([\w-]+)$/.exec(value || '') || /^v2\.(\d+)\.(\d+)\.([\w-]+)$/.exec(value || '');
  if (!m) return false;
  const v2 = value.startsWith('v2.'), idx = v2 ? +m[1] : 0, exp = v2 ? +m[2] : +m[1], sig = v2 ? m[3] : m[2];
  if (exp < Date.now() / 1000) return false;
  try { const k = await sessionKey(env, idx); return !!k && (await crypto.subtle.verify('HMAC', k, unb64u(sig), enc.encode(v2 ? `${idx}.${exp}` : String(exp)))); } catch { return false; }
}
function cookieOf(request) {
  const m = new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`).exec(request.headers.get('Cookie') || '');
  return m ? m[1] : '';
}
function basicOf(request) {
  const m = /^Basic\s+(.+)$/i.exec(request.headers.get('Authorization') || '');
  if (!m) return null;
  try {
    const text = new TextDecoder().decode(Uint8Array.from(atob(m[1]), (c) => c.charCodeAt(0)));
    const i = text.indexOf(':');
    return i < 0 ? null : { user: text.slice(0, i), pass: text.slice(i + 1) };
  } catch { return null; }
}
// Only the primary account (BASIC_AUTH_USER): used for the one thing that must not be visible to the optional second account, the stored Instagram token.
async function isPrimary(request, env) {
  const c = cookieOf(request);
  if (c.startsWith('v1.') && (await validSession(env, c))) return true; // v1 sessions are the primary account's
  const b = basicOf(request);
  return !!b && (await matchAccount(b.user, b.pass, env)) === 0;
}
async function authed(request, env) {
  if (await validSession(env, cookieOf(request))) return true;
  const b = basicOf(request);
  return !!b && (await matchAccount(b.user, b.pass, env)) >= 0;
}

const safeNext = (n) => (typeof n === 'string' && n.startsWith('/') && !n.startsWith('//') && !n.startsWith('/login') && !n.startsWith('/logout') && !/[\\\r\n]/.test(n) ? n : '/');
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const noStore = { 'Cache-Control': 'no-store' };

function loginPage(next, error) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Sign in · Aquarii Templates</title>
<meta name="theme-color" content="#0b2a3a"><meta name="robots" content="noindex">
<link rel="manifest" href="/manifest.webmanifest"><link rel="icon" href="/icons/icon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<style>
:root{--bg:#0b2a3a;--bg2:#05131b;--ink:#eee8da;--mute:#9db3bd;--accent:#2ee6c5;--err:#ff8a7a;--field:#10384c}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;min-height:100dvh;display:grid;place-items:center;padding:max(24px,env(safe-area-inset-top)) 22px max(24px,env(safe-area-inset-bottom));
 background:radial-gradient(circle at 50% 0,#14566b,var(--bg) 45%,var(--bg2));color:var(--ink);font:400 17px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
main{width:min(400px,100%)}
.logo{width:64px;height:64px;border-radius:18px;margin:0 auto 18px;display:block}
h1{font:700 1.7rem/1.1 "Iowan Old Style","Palatino Linotype",Georgia,serif;text-align:center;margin:0 0 6px;letter-spacing:-.02em}
p.s{text-align:center;color:var(--mute);margin:0 0 24px;font-size:.95rem}
form{display:grid;gap:14px}
label{display:grid;gap:6px;font:700 .72rem ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--mute)}
input{font:400 17px system-ui;min-height:52px;padding:0 16px;border-radius:14px;border:1.5px solid #24526a;background:var(--field);color:var(--ink);width:100%}
input:focus{outline:3px solid var(--accent);outline-offset:1px;border-color:var(--accent)}
button{min-height:54px;margin-top:6px;border:0;border-radius:16px;background:linear-gradient(90deg,#2ee6c5,#c6ff3d);color:#042;font:800 1.05rem system-ui;cursor:pointer}
button:active{transform:translateY(1px)}
.err{background:rgba(255,138,122,.14);border:1px solid var(--err);color:var(--err);padding:10px 14px;border-radius:12px;font-size:.92rem;text-align:center}
small{display:block;text-align:center;color:var(--mute);margin-top:18px;font-size:.82rem}
</style></head><body><main>
<img class="logo" src="/icons/icon.svg" alt="">
<h1>Aquarii Templates</h1><p class="s">Sign in to continue</p>
<form method="post" action="/login">
${error ? `<div class="err" role="alert">${esc(error)}</div>` : ''}
<input type="hidden" name="next" value="${esc(next)}">
<label>Username<input name="username" type="text" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" enterkeyhint="next" required autofocus></label>
<label>Password<input name="password" type="password" autocomplete="current-password" enterkeyhint="go" required></label>
<button type="submit">Sign in</button>
</form>
<small>You'll stay signed in on this device for 30 days.</small>
</main></body></html>`;
}

const html = (body, status = 200) => new Response(body, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', ...noStore } });
const go = (location, extra = {}) => new Response(null, { status: 303, headers: { Location: location, ...noStore, ...extra } });

// ---- Instagram performance in D1 (same "DB" binding): daily account snapshots and per-reel metrics. Written once a day by the collector
// (it signs in like any client and POSTs /api/perf/ingest), read by /performance/. Without the binding the API answers 501. ----
let perfReady = null;
async function perfDb(env) {
  if (!env.DB) return null;
  perfReady = perfReady || env.DB.batch([
    env.DB.prepare('CREATE TABLE IF NOT EXISTS ig_account (day TEXT PRIMARY KEY, username TEXT, followers INTEGER, follows INTEGER, media_count INTEGER)'),
    env.DB.prepare('CREATE TABLE IF NOT EXISTS ig_media (ig_id TEXT PRIMARY KEY, template_id TEXT, permalink TEXT, posted_at TEXT, caption TEXT, kind TEXT, duration_s REAL)'),
    env.DB.prepare('CREATE TABLE IF NOT EXISTS ig_metrics (ig_id TEXT NOT NULL, day TEXT NOT NULL, views INTEGER, reach INTEGER, likes INTEGER, comments INTEGER, saves INTEGER, shares INTEGER, watch_avg_ms INTEGER, watch_total_ms INTEGER, PRIMARY KEY (ig_id, day))'),
    env.DB.prepare('CREATE INDEX IF NOT EXISTS ig_metrics_day ON ig_metrics (day)'),
    env.DB.prepare('CREATE TABLE IF NOT EXISTS ig_token (id INTEGER PRIMARY KEY CHECK (id = 1), token TEXT NOT NULL, saved_at TEXT NOT NULL)'),
  ]).catch((e) => { perfReady = null; throw e; });
  await perfReady;
  return env.DB;
}
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const nInt = (v) => (v == null || v === '' || !Number.isFinite(+v) ? null : Math.max(0, Math.min(2e9, Math.round(+v))));
const nStr = (v, n) => (typeof v === 'string' ? v.slice(0, n) : null);
async function perfApi(request, env, p, url) {
  let db;
  try { db = await perfDb(env); } catch { return jres({ error: 'db-unavailable' }, 503); }
  if (!db) return jres({ error: 'no-db' }, 501);
  if (p === '/api/perf/token') { // the refreshed Instagram token, kept so the daily collector can keep itself alive (a GitHub secret cannot be rewritten by a workflow)
    if (!(await isPrimary(request, env))) return jres({ error: 'forbidden' }, 403);
    if (request.method === 'GET') {
      const row = await db.prepare('SELECT token, saved_at FROM ig_token WHERE id = 1').first();
      return jres(row ? { token: row.token, saved_at: row.saved_at } : { token: null });
    }
    if (request.method === 'PUT') {
      if (request.headers.get('X-Requested-With') !== 'reel') return jres({ error: 'forbidden' }, 403);
      let b = null; try { b = await request.json(); } catch { /* handled below */ }
      if (!b || typeof b.token !== 'string' || b.token.length < 20 || b.token.length > 600 || /\s/.test(b.token)) return jres({ error: 'bad-request' }, 400);
      await db.prepare('INSERT INTO ig_token (id, token, saved_at) VALUES (1, ?1, ?2) ON CONFLICT(id) DO UPDATE SET token = excluded.token, saved_at = excluded.saved_at').bind(b.token, new Date().toISOString()).run();
      return jres({ ok: true });
    }
    return jres({ error: 'bad-request' }, 400);
  }
  if (request.method === 'GET' && p === '/api/perf') {
    const days = Math.max(7, Math.min(365, Math.round(+url.searchParams.get('days')) || 90));
    const acc = await db.prepare('SELECT day, username, followers, follows, media_count FROM ig_account ORDER BY day DESC LIMIT ?1').bind(days).all();
    const media = await db.prepare(`SELECT m.ig_id, m.template_id, m.permalink, m.posted_at, m.caption, m.kind, m.duration_s, x.day AS metrics_day,
      x.views, x.reach, x.likes, x.comments, x.saves, x.shares, x.watch_avg_ms, x.watch_total_ms
      FROM ig_media m LEFT JOIN ig_metrics x ON x.ig_id = m.ig_id AND x.day = (SELECT MAX(day) FROM ig_metrics WHERE ig_id = m.ig_id)
      ORDER BY m.posted_at DESC LIMIT 200`).all();
    const last = await db.prepare('SELECT MAX(day) AS d FROM ig_metrics').first();
    return jres({ account: (acc.results || []).reverse(), media: media.results || [], updated: (last && last.d) || null });
  }
  if (request.method === 'POST' && p === '/api/perf/ingest') {
    if (request.headers.get('X-Requested-With') !== 'reel') return jres({ error: 'forbidden' }, 403); // simple cross-site requests cannot set this header
    let b = null;
    try { b = await request.json(); } catch { /* handled below */ }
    if (!b || typeof b !== 'object') return jres({ error: 'bad-request' }, 400);
    const day = typeof b.day === 'string' && DAY_RE.test(b.day) ? b.day : new Date().toISOString().slice(0, 10);
    const st = [];
    const a = b.account;
    if (a && typeof a === 'object') st.push(db.prepare('INSERT INTO ig_account (day, username, followers, follows, media_count) VALUES (?1, ?2, ?3, ?4, ?5) ON CONFLICT(day) DO UPDATE SET username = COALESCE(excluded.username, username), followers = COALESCE(excluded.followers, followers), follows = COALESCE(excluded.follows, follows), media_count = COALESCE(excluded.media_count, media_count)')
      .bind(day, nStr(a.username, 60), nInt(a.followers), nInt(a.follows), nInt(a.media_count)));
    const list = Array.isArray(b.media) ? b.media.slice(0, 200) : [];
    for (const m of list) {
      if (!m || typeof m.ig_id !== 'string' || !/^\d{5,30}$/.test(m.ig_id)) continue;
      const tid = typeof m.template_id === 'string' && ID_RE.test(m.template_id) ? m.template_id : null;
      st.push(db.prepare('INSERT INTO ig_media (ig_id, template_id, permalink, posted_at, caption, kind, duration_s) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7) ON CONFLICT(ig_id) DO UPDATE SET template_id = COALESCE(excluded.template_id, template_id), permalink = COALESCE(excluded.permalink, permalink), posted_at = COALESCE(excluded.posted_at, posted_at), caption = COALESCE(excluded.caption, caption), kind = COALESCE(excluded.kind, kind), duration_s = COALESCE(excluded.duration_s, duration_s)')
        .bind(m.ig_id, tid, nStr(m.permalink, 300), nStr(m.posted_at, 40), nStr(m.caption, 600), nStr(m.kind, 30), Number.isFinite(+m.duration_s) ? +m.duration_s : null));
      const x = m.metrics;
      if (x && typeof x === 'object') st.push(db.prepare('INSERT INTO ig_metrics (ig_id, day, views, reach, likes, comments, saves, shares, watch_avg_ms, watch_total_ms) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10) ON CONFLICT(ig_id, day) DO UPDATE SET views = excluded.views, reach = excluded.reach, likes = excluded.likes, comments = excluded.comments, saves = excluded.saves, shares = excluded.shares, watch_avg_ms = excluded.watch_avg_ms, watch_total_ms = excluded.watch_total_ms')
        .bind(m.ig_id, day, nInt(x.views), nInt(x.reach), nInt(x.likes), nInt(x.comments), nInt(x.saves), nInt(x.shares), nInt(x.watch_avg_ms), nInt(x.watch_total_ms)));
    }
    for (let i = 0; i < st.length; i += 90) await db.batch(st.slice(i, i + 90));
    return jres({ ok: true, day, statements: st.length });
  }
  return jres({ error: 'bad-request' }, 400);
}

// ---- Reel-uploaded tracking in D1 (binding "DB"). Without the binding the API answers 501 and the pages fall back to localStorage. ----
const ID_RE = /^\d{4}-\d{2}-\d{2}(-\d{4})?$/;
const jsonHeaders = { 'Content-Type': 'application/json', ...noStore };
const jres = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: jsonHeaders });
let tableReady = null;
async function uploadedDb(env) {
  if (!env.DB) return null;
  tableReady = tableReady || env.DB.exec('CREATE TABLE IF NOT EXISTS reel_uploaded (id TEXT PRIMARY KEY, at TEXT NOT NULL)').catch((e) => { tableReady = null; throw e; });
  await tableReady;
  return env.DB;
}
async function uploadedApi(request, env, p) {
  let db;
  try { db = await uploadedDb(env); } catch { return jres({ error: 'db-unavailable' }, 503); }
  if (!db) return jres({ error: 'no-db' }, 501);
  if (request.method === 'GET' && p === '/api/uploaded') {
    const { results } = await db.prepare('SELECT id, at FROM reel_uploaded').all();
    return jres({ ids: Object.fromEntries((results || []).map((r) => [r.id, r.at])) });
  }
  if (request.method !== 'GET' && request.headers.get('X-Requested-With') !== 'reel') return jres({ error: 'forbidden' }, 403); // simple cross-site requests cannot set this header
  let body = null;
  try { body = await request.json(); } catch { /* handled below */ }
  const m = /^\/api\/uploaded\/(\d{4}-\d{2}-\d{2}(?:-\d{4})?)$/.exec(p);
  if (request.method === 'PUT' && m && body && typeof body.on === 'boolean') {
    if (body.on) await db.prepare('INSERT INTO reel_uploaded (id, at) VALUES (?1, ?2) ON CONFLICT(id) DO UPDATE SET at = excluded.at').bind(m[1], new Date().toISOString()).run();
    else await db.prepare('DELETE FROM reel_uploaded WHERE id = ?1').bind(m[1]).run();
    return jres({ ok: true });
  }
  if (request.method === 'POST' && p === '/api/uploaded/import' && body && body.ids && typeof body.ids === 'object') {
    const rows = Object.entries(body.ids).filter(([id, at]) => ID_RE.test(id) && typeof at === 'string').slice(0, 500);
    if (rows.length) await db.batch(rows.map(([id, at]) => db.prepare('INSERT OR IGNORE INTO reel_uploaded (id, at) VALUES (?1, ?2)').bind(id, at.slice(0, 40))));
    return jres({ ok: true, imported: rows.length });
  }
  return jres({ error: 'bad-request' }, 400);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url), p = url.pathname;
    const configured = accounts(env).length > 0;
    const secure = url.protocol === 'https:' ? '; Secure' : '';

    if (p === '/logout') return go('/login', { 'Set-Cookie': `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure}` });

    if (p === '/login') {
      if (!configured) return new Response('Site is locked: authentication is not configured.', { status: 503, headers: noStore });
      if (request.method === 'POST') {
        let f = null;
        try { f = await request.formData(); } catch { /* fall through */ }
        const next = safeNext(f && f.get('next'));
        const who = f ? await matchAccount(f.get('username') || '', f.get('password') || '', env) : -1;
        if (who >= 0) return go(next, { 'Set-Cookie': `${COOKIE}=${await makeSession(env, who)}; Path=/; Max-Age=${TTL}; HttpOnly; SameSite=Lax${secure}` });
        await new Promise((r) => setTimeout(r, 700)); // slow down guessing
        return html(loginPage(next, 'Wrong username or password.'), 401);
      }
      const next = safeNext(url.searchParams.get('next'));
      if (await authed(request, env)) return go(next);
      return html(loginPage(next, ''));
    }

    if (PUBLIC(p)) return env.ASSETS.fetch(request); // manifest, service worker and icons must load without a session (PWA install)

    if (!configured) return new Response('Site is locked: authentication is not configured.', { status: 503, headers: noStore });
    const signedIn = await authed(request, env);
    if (p.startsWith('/api/')) return signedIn ? (p.startsWith('/api/uploaded') ? uploadedApi(request, env, p) : p.startsWith('/api/perf') ? perfApi(request, env, p, url) : jres({ error: 'not-found' }, 404)) : new Response('{"error":"unauthorized"}', { status: 401, headers: jsonHeaders });
    if (signedIn) return env.ASSETS.fetch(request);

    const wantsPage = request.method === 'GET' && ((request.headers.get('Accept') || '').includes('text/html') || request.headers.get('Sec-Fetch-Mode') === 'navigate');
    if (wantsPage) return go(`/login?next=${encodeURIComponent(p + url.search)}`);
    return new Response('{"error":"unauthorized"}', { status: 401, headers: { 'Content-Type': 'application/json', ...noStore } }); // no WWW-Authenticate: never trigger the native popup
  },
};
