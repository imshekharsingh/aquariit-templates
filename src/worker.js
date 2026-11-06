// Sign-in gate in front of the static assets (PWA-friendly: a login page + signed session cookie, no browser Basic-auth popup).
// Credentials live ONLY in Worker secrets, never in the repo: BASIC_AUTH_USER / BASIC_AUTH_PASS, plus an optional second account
// BASIC_AUTH_USER_2 / BASIC_AUTH_PASS_2 (either account can sign in). Fails closed if no account is configured.
// HTTP Basic headers are still accepted so scripts/CI can authenticate with curl --user.
import { sendPush, PUSH_HOST } from './push.js';

const COOKIE = 'aq_session', TTL = 60 * 60 * 24 * 30; // 30 days
// /tips/ (owner, 27 Oct 2026) is the one public page: the reels' fixes with live demos, static only (no data, no API calls)
const PUBLIC = (p) => p === '/login' || p === '/logout' || p === '/manifest.webmanifest' || p === '/sw.js' || p.startsWith('/icons/') || p === '/tips' || p === '/tips/' || p === '/tips/index.html';
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
    // more than one account (owner, 21 Oct 2026: a second account for the audit): per-account snapshots and token slots 2+; slot 1 stays in ig_token
    env.DB.prepare('CREATE TABLE IF NOT EXISTS ig_accounts (day TEXT NOT NULL, username TEXT NOT NULL, followers INTEGER, follows INTEGER, media_count INTEGER, PRIMARY KEY (day, username))'),
    env.DB.prepare('CREATE TABLE IF NOT EXISTS ig_tokens (slot INTEGER PRIMARY KEY CHECK (slot BETWEEN 2 AND 9), token TEXT NOT NULL, saved_at TEXT NOT NULL)'),
    // collector failures shown as a banner in the app (owner, 31 Oct 2026: GitHub issues go unseen); one row per account slot, cleared on the next good run
    env.DB.prepare('CREATE TABLE IF NOT EXISTS ig_alerts (slot INTEGER PRIMARY KEY CHECK (slot BETWEEN 1 AND 9), secret TEXT NOT NULL, message TEXT NOT NULL, at TEXT NOT NULL)'),
    // audience and early signals (owner, 5 Nov 2026): one row per reel per collect run (nightly + 12:30 IST), audience breakdowns and daily account insights
    env.DB.prepare('CREATE TABLE IF NOT EXISTS ig_media_runs (ig_id TEXT NOT NULL, at TEXT NOT NULL, views INTEGER, reach INTEGER, saves INTEGER, shares INTEGER, watch_avg_ms INTEGER, follows INTEGER, profile_visits INTEGER, profile_activity INTEGER, extra TEXT, PRIMARY KEY (ig_id, at))'),
    env.DB.prepare('CREATE TABLE IF NOT EXISTS ig_audience (day TEXT NOT NULL, username TEXT NOT NULL, metric TEXT NOT NULL, breakdown TEXT NOT NULL, k TEXT NOT NULL, value INTEGER, PRIMARY KEY (day, username, metric, breakdown, k))'),
    env.DB.prepare('CREATE TABLE IF NOT EXISTS ig_insights_day (day TEXT NOT NULL, username TEXT NOT NULL, metric TEXT NOT NULL, value INTEGER, PRIMARY KEY (day, username, metric))'),
  ]).then(() => env.DB.prepare('ALTER TABLE ig_media ADD COLUMN username TEXT').run().catch(() => {}))   // already there after the first run
    .catch((e) => { perfReady = null; throw e; });
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
    const slot = Math.max(1, Math.min(9, Math.round(+url.searchParams.get('slot')) || 1));
    if (request.method === 'GET') {
      const row = slot === 1 ? await db.prepare('SELECT token, saved_at FROM ig_token WHERE id = 1').first() : await db.prepare('SELECT token, saved_at FROM ig_tokens WHERE slot = ?1').bind(slot).first();
      return jres(row ? { token: row.token, saved_at: row.saved_at } : { token: null });
    }
    if (request.method === 'PUT') {
      if (request.headers.get('X-Requested-With') !== 'reel') return jres({ error: 'forbidden' }, 403);
      let b = null; try { b = await request.json(); } catch { /* handled below */ }
      if (!b || typeof b.token !== 'string' || b.token.length < 20 || b.token.length > 600 || /\s/.test(b.token)) return jres({ error: 'bad-request' }, 400);
      if (slot === 1) await db.prepare('INSERT INTO ig_token (id, token, saved_at) VALUES (1, ?1, ?2) ON CONFLICT(id) DO UPDATE SET token = excluded.token, saved_at = excluded.saved_at').bind(b.token, new Date().toISOString()).run();
      else await db.prepare('INSERT INTO ig_tokens (slot, token, saved_at) VALUES (?1, ?2, ?3) ON CONFLICT(slot) DO UPDATE SET token = excluded.token, saved_at = excluded.saved_at').bind(slot, b.token, new Date().toISOString()).run();
      return jres({ ok: true });
    }
    return jres({ error: 'bad-request' }, 400);
  }
  if (p === '/api/perf/alert') { // the collector reports a failing account (PUT) or clears it after a good run (DELETE)
    if (!(await isPrimary(request, env)) || request.headers.get('X-Requested-With') !== 'reel') return jres({ error: 'forbidden' }, 403);
    const slot = Math.max(1, Math.min(9, Math.round(+url.searchParams.get('slot')) || 1));
    if (request.method === 'DELETE') { await db.prepare('DELETE FROM ig_alerts WHERE slot = ?1').bind(slot).run(); return jres({ ok: true }); }
    if (request.method === 'PUT') {
      let b = null; try { b = await request.json(); } catch { /* handled below */ }
      const secret = b && nStr(b.secret, 40), message = b && nStr(b.message, 400);
      if (!secret || !/^INSTAGRAM_TOKEN(_\d)?$|^BASIC_AUTH|^SITE$/.test(secret) || !message) return jres({ error: 'bad-request' }, 400);
      await db.prepare('INSERT INTO ig_alerts (slot, secret, message, at) VALUES (?1, ?2, ?3, ?4) ON CONFLICT(slot) DO UPDATE SET secret = excluded.secret, message = excluded.message, at = excluded.at')
        .bind(slot, secret, message, new Date().toISOString()).run();
      return jres({ ok: true });
    }
    return jres({ error: 'bad-request' }, 400);
  }
  if (request.method === 'GET' && p === '/api/perf/status') { // for the app's banner: open alerts and the last day each account was saved
    const alerts = await db.prepare('SELECT slot, secret, message, at FROM ig_alerts ORDER BY slot').all();
    const last = await db.prepare('SELECT username, MAX(day) AS day FROM ig_accounts GROUP BY username').all();
    return jres({ alerts: alerts.results || [], last: last.results || [] });
  }
  if (request.method === 'GET' && p === '/api/perf') {
    const days = Math.max(7, Math.min(365, Math.round(+url.searchParams.get('days')) || 90));
    const who = nStr(url.searchParams.get('account'), 60);
    const acc = who ? await db.prepare('SELECT day, username, followers, follows, media_count FROM ig_accounts WHERE username = ?2 ORDER BY day DESC LIMIT ?1').bind(days, who).all()
      : await db.prepare('SELECT day, username, followers, follows, media_count FROM ig_account ORDER BY day DESC LIMIT ?1').bind(days).all();
    const names = await db.prepare('SELECT DISTINCT username FROM ig_accounts').all();
    const media = await db.prepare(`SELECT m.ig_id, m.username, m.template_id, m.permalink, m.posted_at, m.caption, m.kind, m.duration_s, x.day AS metrics_day,
      x.views, x.reach, x.likes, x.comments, x.saves, x.shares, x.watch_avg_ms, x.watch_total_ms
      FROM ig_media m LEFT JOIN ig_metrics x ON x.ig_id = m.ig_id AND x.day = (SELECT MAX(day) FROM ig_metrics WHERE ig_id = m.ig_id)
      WHERE ${who ? 'm.username = ?1' : '(m.username IS NULL OR m.username = (SELECT username FROM ig_account ORDER BY day DESC LIMIT 1))'}
      ORDER BY m.posted_at DESC LIMIT 200`).bind(...(who ? [who] : [])).all();
    const last = await db.prepare('SELECT MAX(day) AS d FROM ig_metrics').first();
    const outp = { account: (acc.results || []).reverse(), accounts: (names.results || []).map((r) => r.username), media: media.results || [], updated: (last && last.d) || null };
    if (who && url.searchParams.get('extra') === '1') { // for scripts/audit-numbers.mjs: per-run readings (and the older daily rows), latest audience, daily insights
      const since = new Date(Date.now() - days * 864e5).toISOString();
      const runs = await db.prepare('SELECT r.ig_id, r.at, r.reach, r.views, r.follows, r.profile_visits FROM ig_media_runs r JOIN ig_media m ON m.ig_id = r.ig_id WHERE m.username = ?1 AND r.at >= ?2 ORDER BY r.at').bind(who, since).all();
      const daily = await db.prepare('SELECT x.ig_id, x.day, x.reach FROM ig_metrics x JOIN ig_media m ON m.ig_id = x.ig_id WHERE m.username = ?1 AND x.day >= ?2 ORDER BY x.day').bind(who, since.slice(0, 10)).all();
      const aday = await db.prepare('SELECT MAX(day) AS d FROM ig_audience WHERE username = ?1').bind(who).first();
      const aud = aday && aday.d ? await db.prepare('SELECT metric, breakdown, k, value FROM ig_audience WHERE username = ?1 AND day = ?2').bind(who, aday.d).all() : { results: [] };
      const ins = await db.prepare('SELECT day, metric, value FROM ig_insights_day WHERE username = ?1 AND day >= ?2 ORDER BY day').bind(who, since.slice(0, 10)).all();
      Object.assign(outp, { runs: runs.results || [], daily: daily.results || [], audience: { day: (aday && aday.d) || null, rows: aud.results || [] }, insights: ins.results || [] });
    }
    return jres(outp);
  }
  if (request.method === 'POST' && p === '/api/perf/ingest') {
    if (request.headers.get('X-Requested-With') !== 'reel') return jres({ error: 'forbidden' }, 403); // simple cross-site requests cannot set this header
    let b = null;
    try { b = await request.json(); } catch { /* handled below */ }
    if (!b || typeof b !== 'object') return jres({ error: 'bad-request' }, 400);
    const day = typeof b.day === 'string' && DAY_RE.test(b.day) ? b.day : new Date().toISOString().slice(0, 10);
    const st = [];
    const a = b.account;
    const slot = Math.max(1, Math.min(9, Math.round(+b.slot) || 1)), uname = a && typeof a === 'object' ? nStr(a.username, 60) : null;
    const snap = b.snapshot !== false; // the 12:30 IST run keeps the nightly follower snapshot of the day
    const at = typeof b.at === 'string' && /^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/.test(b.at) ? b.at : new Date().toISOString();
    if (a && typeof a === 'object' && slot === 1 && snap) st.push(db.prepare('INSERT INTO ig_account (day, username, followers, follows, media_count) VALUES (?1, ?2, ?3, ?4, ?5) ON CONFLICT(day) DO UPDATE SET username = COALESCE(excluded.username, username), followers = COALESCE(excluded.followers, followers), follows = COALESCE(excluded.follows, follows), media_count = COALESCE(excluded.media_count, media_count)')
      .bind(day, nStr(a.username, 60), nInt(a.followers), nInt(a.follows), nInt(a.media_count)));
    if (uname && snap) st.push(db.prepare('INSERT INTO ig_accounts (day, username, followers, follows, media_count) VALUES (?1, ?2, ?3, ?4, ?5) ON CONFLICT(day, username) DO UPDATE SET followers = excluded.followers, follows = excluded.follows, media_count = excluded.media_count')
      .bind(day, uname, nInt(a.followers), nInt(a.follows), nInt(a.media_count)));
    const list = Array.isArray(b.media) ? b.media.slice(0, 200) : [];
    for (const m of list) {
      if (!m || typeof m.ig_id !== 'string' || !/^\d{5,30}$/.test(m.ig_id)) continue;
      const tid = typeof m.template_id === 'string' && ID_RE.test(m.template_id) ? m.template_id : null;
      st.push(db.prepare('INSERT INTO ig_media (ig_id, template_id, permalink, posted_at, caption, kind, duration_s) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7) ON CONFLICT(ig_id) DO UPDATE SET template_id = COALESCE(excluded.template_id, template_id), permalink = COALESCE(excluded.permalink, permalink), posted_at = COALESCE(excluded.posted_at, posted_at), caption = COALESCE(excluded.caption, caption), kind = COALESCE(excluded.kind, kind), duration_s = COALESCE(excluded.duration_s, duration_s)')
        .bind(m.ig_id, tid, nStr(m.permalink, 300), nStr(m.posted_at, 40), nStr(m.caption, 600), nStr(m.kind, 30), Number.isFinite(+m.duration_s) ? +m.duration_s : null));
      if (uname) st.push(db.prepare('UPDATE ig_media SET username = ?2 WHERE ig_id = ?1').bind(m.ig_id, uname));
      const x = m.metrics;
      if (x && typeof x === 'object') st.push(db.prepare('INSERT INTO ig_metrics (ig_id, day, views, reach, likes, comments, saves, shares, watch_avg_ms, watch_total_ms) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10) ON CONFLICT(ig_id, day) DO UPDATE SET views = excluded.views, reach = excluded.reach, likes = excluded.likes, comments = excluded.comments, saves = excluded.saves, shares = excluded.shares, watch_avg_ms = excluded.watch_avg_ms, watch_total_ms = excluded.watch_total_ms')
        .bind(m.ig_id, day, nInt(x.views), nInt(x.reach), nInt(x.likes), nInt(x.comments), nInt(x.saves), nInt(x.shares), nInt(x.watch_avg_ms), nInt(x.watch_total_ms)));
      if (x && typeof x === 'object' && x.reach != null) { let ex = null; try { ex = x.extra && typeof x.extra === 'object' && Object.keys(x.extra).length ? JSON.stringify(x.extra).slice(0, 600) : null; } catch { /* none */ }
        st.push(db.prepare('INSERT OR REPLACE INTO ig_media_runs (ig_id, at, views, reach, saves, shares, watch_avg_ms, follows, profile_visits, profile_activity, extra) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)')
          .bind(m.ig_id, at, nInt(x.views), nInt(x.reach), nInt(x.saves), nInt(x.shares), nInt(x.watch_avg_ms), nInt(x.follows), nInt(x.profile_visits), nInt(x.profile_activity), ex)); }
    }
    if (uname) {
      const okS = (v) => typeof v === 'string' && /^[a-z_]{3,40}$/.test(v);
      for (const r of (Array.isArray(b.audience) ? b.audience.slice(0, 400) : [])) if (r && okS(r.metric) && okS(r.breakdown) && typeof r.k === 'string' && r.k)
        st.push(db.prepare('INSERT OR REPLACE INTO ig_audience (day, username, metric, breakdown, k, value) VALUES (?1, ?2, ?3, ?4, ?5, ?6)').bind(day, uname, r.metric, r.breakdown, r.k.slice(0, 80), nInt(r.value)));
      for (const r of (Array.isArray(b.insights) ? b.insights.slice(0, 200) : [])) if (r && okS(r.metric) && typeof r.day === 'string' && DAY_RE.test(r.day))
        st.push(db.prepare('INSERT OR REPLACE INTO ig_insights_day (day, username, metric, value) VALUES (?1, ?2, ?3, ?4)').bind(r.day, uname, r.metric, nInt(r.value)));
    }
    for (let i = 0; i < st.length; i += 90) await db.batch(st.slice(i, i + 90));
    return jres({ ok: true, day, statements: st.length });
  }
  return jres({ error: 'bad-request' }, 400);
}

// ---- Cards at the top of the app (owner, 1 Nov 2026: "the app should show me everything"): the daily audit, the spare-usage night's report.
// Primary account only. Written by the "Audit card" workflow (scripts/post-card.mjs signs in with the BASIC_AUTH secrets), deleted for good by "Mark read".
let cardsReady = null;
async function cardsDb(env) {
  if (!env.DB) return null;
  cardsReady = cardsReady || env.DB.exec('CREATE TABLE IF NOT EXISTS app_cards (id TEXT PRIMARY KEY, kind TEXT NOT NULL, day TEXT NOT NULL, body TEXT NOT NULL, at TEXT NOT NULL)').catch((e) => { cardsReady = null; throw e; });
  await cardsReady;
  return env.DB;
}
const CARD_ID = /^\/api\/cards\/([a-z0-9-]{1,60})$/, CHANNELS = ['web', 'tech', 'c3'];
const lines = (v, n, len) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string' && x.trim()).slice(0, n).map((x) => x.trim().slice(0, len)) : []);
function cleanCard(b) {
  if (!b || typeof b !== 'object' || !DAY_RE.test(b.day || '')) return null;
  const kind = ['audit', 'spare', 'note'].includes(b.kind) ? b.kind : 'audit', channels = {};
  for (const k of CHANNELS) { const l = lines(b.channels && b.channels[k], 12, 300); if (l.length) channels[k] = l; }
  const card = { kind, day: b.day, title: nStr(b.title, 120) || (kind === 'spare' ? 'Spare-usage night' : 'Daily audit'), points: lines(b.points, 12, 300), channels };
  return card.points.length || Object.keys(channels).length ? card : null;
}
async function cardsApi(request, env, p) {
  if (!(await isPrimary(request, env))) return request.method === 'GET' ? jres({ cards: [] }) : jres({ error: 'forbidden' }, 403);
  let db;
  try { db = await cardsDb(env); } catch { return jres({ error: 'db-unavailable' }, 503); }
  if (!db) return jres({ error: 'no-db' }, 501);
  if (request.method === 'GET' && p === '/api/cards') {
    const { results } = await db.prepare('SELECT id, body, at FROM app_cards ORDER BY day DESC, at DESC LIMIT 30').all();
    return jres({ cards: (results || []).map((r) => { let b = {}; try { b = JSON.parse(r.body); } catch { /* skip */ } return { id: r.id, ...b, at: r.at }; }) });
  }
  const m = CARD_ID.exec(p);
  if (!m || request.headers.get('X-Requested-With') !== 'reel') return jres({ error: 'forbidden' }, 403);
  if (request.method === 'DELETE') { await db.prepare('DELETE FROM app_cards WHERE id = ?1').bind(m[1]).run(); return jres({ ok: true }); }
  if (request.method === 'PUT') {
    let b = null; try { b = await request.json(); } catch { /* handled below */ }
    const card = cleanCard(b);
    if (!card) return jres({ error: 'bad-request' }, 400);
    await db.prepare('INSERT INTO app_cards (id, kind, day, body, at) VALUES (?1, ?2, ?3, ?4, ?5) ON CONFLICT(id) DO UPDATE SET kind = excluded.kind, day = excluded.day, body = excluded.body, at = excluded.at')
      .bind(m[1], card.kind, card.day, JSON.stringify(card), new Date().toISOString()).run();
    return jres({ ok: true, id: m[1] });
  }
  return jres({ error: 'bad-request' }, 400);
}

// ---- "Needs you" (owner, 1 Nov 2026: "add to-dos that need my input, in the app, so everything gets covered from there"): questions and tasks for
// the owner, above the cards. Answering stores the reply and takes the item off the list; Claude sessions read open replies with the "Owner answers"
// workflow (scripts/asks.mjs), act on them, then clear them. Primary account only.
let asksReady = null;
async function asksDb(env) {
  if (!env.DB) return null;
  asksReady = asksReady || env.DB.exec('CREATE TABLE IF NOT EXISTS owner_asks (id TEXT PRIMARY KEY, body TEXT NOT NULL, created TEXT NOT NULL, answer TEXT, answered_at TEXT)').catch((e) => { asksReady = null; throw e; });
  await asksReady;
  return env.DB;
}
const ASK_ID = /^\/api\/asks\/([a-z0-9-]{1,60})(\/answer)?$/;
async function asksApi(request, env, p, url) {
  if (!(await isPrimary(request, env))) return request.method === 'GET' ? jres({ asks: [] }) : jres({ error: 'forbidden' }, 403);
  let db;
  try { db = await asksDb(env); } catch { return jres({ error: 'db-unavailable' }, 503); }
  if (!db) return jres({ error: 'no-db' }, 501);
  const row = (r) => { let b = {}; try { b = JSON.parse(r.body); } catch { /* skip */ } return { id: r.id, ...b, created: r.created, answer: r.answer, answered_at: r.answered_at }; };
  if (request.method === 'GET' && p === '/api/asks') {   // open items for the app; ?answered=1 gives the replies waiting for Claude
    const answered = url.searchParams.get('answered') === '1';
    const { results } = await db.prepare(`SELECT id, body, created, answer, answered_at FROM owner_asks WHERE answer IS ${answered ? 'NOT ' : ''}NULL ORDER BY created LIMIT 50`).all();
    return jres({ asks: (results || []).map(row) });
  }
  const m = ASK_ID.exec(p);
  if (!m || request.headers.get('X-Requested-With') !== 'reel') return jres({ error: 'forbidden' }, 403);
  if (request.method === 'DELETE' && !m[2]) { await db.prepare('DELETE FROM owner_asks WHERE id = ?1').bind(m[1]).run(); return jres({ ok: true }); }
  let b = null; try { b = await request.json(); } catch { /* handled below */ }
  if (request.method === 'POST' && m[2]) {   // the owner's reply
    const answer = b && nStr(b.answer, 1000);
    if (!answer || !answer.trim()) return jres({ error: 'bad-request' }, 400);
    const r = await db.prepare('UPDATE owner_asks SET answer = ?2, answered_at = ?3 WHERE id = ?1 AND answer IS NULL').bind(m[1], answer.trim(), new Date().toISOString()).run();
    return jres({ ok: true, stored: !!(r.meta && r.meta.changes) });
  }
  if (request.method === 'PUT' && !m[2]) {   // a new item (or a rewrite of an open one); kind picks the buttons
    const q = b && nStr(b.question, 300), kind = b && ['yesno', 'done', 'text'].includes(b.kind) ? b.kind : 'text';
    if (!q || !q.trim()) return jres({ error: 'bad-request' }, 400);
    const body = JSON.stringify({ question: q.trim(), why: nStr(b.why, 300) || '', kind, channel: ['web', 'tech', 'c3'].includes(b.channel) ? b.channel : null });
    await db.prepare('INSERT INTO owner_asks (id, body, created) VALUES (?1, ?2, ?3) ON CONFLICT(id) DO UPDATE SET body = excluded.body, answer = NULL, answered_at = NULL').bind(m[1], body, new Date().toISOString()).run();
    return jres({ ok: true, id: m[1] });
  }
  return jres({ error: 'bad-request' }, 400);
}

// ---- Spare-usage night (owner, 1 Nov 2026): the owner's weekly Claude limit resets Wednesday 04:30 IST. From Tuesday 21:00 IST the app shows a card
// saying Claude uses the spare usage tonight, with one "Skip tonight" button (owner, 3 Nov 2026: opt-out; a skip flag for that week, stored here).
// /api/spare reports on = not skipped, and the "Spare check" workflow prints SPARE=yes unless skipped. The Worker's cron sends a Web Push reminder
// at 21:00 IST on Tuesdays to every subscribed device (VAPID keys: Worker secrets VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY) and logs each send here,
// so the card can show when the last reminder went out and to how many phones.
const IST_MS = 5.5 * 3600e3, DAY_MS = 864e5, SPARE_CRON = '30 15 * * *';   // wrangler.jsonc: the spare reminder's cron; every other cron is a post reminder
function spareWindow(now = Date.now()) {   // the next reset (Wed 04:30 IST) and whether its card is showing (from Tue 21:00 IST)
  const ist = now + IST_MS, midnight = ist - (ist % DAY_MS), dow = new Date(ist).getUTCDay();
  let reset = midnight + ((3 - dow + 7) % 7) * DAY_MS + 4.5 * 3600e3;
  if (reset <= ist) reset += 7 * DAY_MS;
  return { week: new Date(reset).toISOString().slice(0, 10), show: ist >= reset - 7.5 * 3600e3, until: new Date(reset - IST_MS).toISOString() };
}
let spareReady = null;
async function spareDb(env) {
  if (!env.DB) return null;
  spareReady = spareReady || env.DB.batch([
    env.DB.prepare('CREATE TABLE IF NOT EXISTS spare_skip (week TEXT PRIMARY KEY, at TEXT NOT NULL)'),
    env.DB.prepare('CREATE TABLE IF NOT EXISTS spare_push_log (at TEXT PRIMARY KEY, devices INTEGER NOT NULL, sent INTEGER NOT NULL, failed INTEGER NOT NULL, note TEXT)'),
    env.DB.prepare('CREATE TABLE IF NOT EXISTS push_subs (endpoint TEXT PRIMARY KEY, p256dh TEXT NOT NULL, auth TEXT NOT NULL, at TEXT NOT NULL)'),
    env.DB.prepare('CREATE TABLE IF NOT EXISTS cron_log (at TEXT NOT NULL, cron TEXT NOT NULL, scheduled TEXT, result TEXT)'),
    env.DB.prepare('CREATE TABLE IF NOT EXISTS push_ack (at TEXT NOT NULL, tag TEXT NOT NULL, shown TEXT)'),
  ]).catch((e) => { spareReady = null; throw e; });
  await spareReady;
  return env.DB;
}
async function spareApi(request, env, p, url) {
  if (p === '/api/push/key' && request.method === 'GET') return jres({ key: env.VAPID_PUBLIC_KEY || null });
  let db;
  try { db = await spareDb(env); } catch { return jres({ error: 'db-unavailable' }, 503); }
  if (!db) return jres({ error: 'no-db' }, 501);
  if (request.method !== 'GET' && request.headers.get('X-Requested-With') !== 'reel') return jres({ error: 'forbidden' }, 403);
  if (p === '/api/spare') {
    const w = spareWindow(), week = DAY_RE.test(url.searchParams.get('week') || '') ? url.searchParams.get('week') : w.week;
    if (request.method === 'PUT') {
      let b = null; try { b = await request.json(); } catch { /* handled below */ }
      const skip = b && typeof b.skip === 'boolean' ? b.skip : b && typeof b.on === 'boolean' ? !b.on : null;
      if (skip === null) return jres({ error: 'bad-request' }, 400);
      if (skip) await db.prepare('INSERT INTO spare_skip (week, at) VALUES (?1, ?2) ON CONFLICT(week) DO UPDATE SET at = excluded.at').bind(w.week, new Date().toISOString()).run();
      else await db.prepare('DELETE FROM spare_skip WHERE week = ?1').bind(w.week).run();
    }
    const row = await db.prepare('SELECT at FROM spare_skip WHERE week = ?1').bind(week).first();
    const last = await db.prepare('SELECT at, devices, sent, failed, note FROM spare_push_log ORDER BY at DESC LIMIT 1').first();
    return jres({ ...w, week, on: !row, skipped: !!row, at: row ? row.at : null, lastPush: last || null });
  }
  if (p === '/api/push/status' && request.method === 'GET') return jres(await pushStatus(env, db));   // read-only: the "Push check" workflow prints it
  if (p === '/api/push/ack' && request.method === 'POST') {   // the service worker's delivery receipt for each push it showed (kept 14 days)
    let b = null; try { b = await request.json(); } catch { /* handled below */ }
    if (!b || typeof b.tag !== 'string' || !/^[\w-]{1,90}$/.test(b.tag)) return jres({ error: 'bad-request' }, 400);
    await db.batch([db.prepare('INSERT INTO push_ack (at, tag, shown) VALUES (?1, ?2, ?3)').bind(new Date().toISOString(), b.tag, String(b.shown).slice(0, 100)),
      db.prepare('DELETE FROM push_ack WHERE at < ?1').bind(new Date(Date.now() - 14 * DAY_MS).toISOString())]);
    return jres({ ok: true });
  }
  if (p === '/api/push/test' && request.method === 'POST') {   // "Send a test notification": only to a device that is signed up
    let b = null; try { b = await request.json(); } catch { /* handled below */ }
    const r = b && typeof b.endpoint === 'string' ? await db.prepare('SELECT endpoint, p256dh, auth FROM push_subs WHERE endpoint = ?1').bind(b.endpoint).first() : null;
    if (!r) return jres({ error: 'not-subscribed' }, 404);
    if (!env.VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_KEY) return jres({ ok: true, sent: null });
    const status = await sendPush({ endpoint: r.endpoint, keys: { p256dh: r.p256dh, auth: r.auth } }, await testPayload(env, db), env, 600).catch(() => 0);
    if (status === 404 || status === 410) await db.prepare('DELETE FROM push_subs WHERE endpoint = ?1').bind(r.endpoint).run();
    return jres({ ok: true, sent: status });
  }
  if (p === '/api/push/subscribe') {
    let b = null; try { b = await request.json(); } catch { /* handled below */ }
    const ep = b && typeof b.endpoint === 'string' && b.endpoint.length < 1000 && PUSH_HOST.test(b.endpoint) ? b.endpoint : null;
    if (!ep) return jres({ error: 'bad-request' }, 400);
    if (request.method === 'DELETE') { await db.prepare('DELETE FROM push_subs WHERE endpoint = ?1').bind(ep).run(); return jres({ ok: true }); }
    const k = b.keys || {};
    if (request.method !== 'POST' || !/^[\w-]{80,100}$/.test(k.p256dh || '') || !/^[\w-]{16,30}$/.test(k.auth || '')) return jres({ error: 'bad-request' }, 400);
    await db.prepare('INSERT INTO push_subs (endpoint, p256dh, auth, at) VALUES (?1, ?2, ?3, ?4) ON CONFLICT(endpoint) DO UPDATE SET p256dh = excluded.p256dh, auth = excluded.auth, at = excluded.at')
      .bind(ep, k.p256dh, k.auth, new Date().toISOString()).run();
    if (!env.VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_KEY) return jres({ ok: true, sent: null });
    if (url.searchParams.get('quiet') === '1') return jres({ ok: true });   // the app re-saves an existing subscription on open: no message
    const status = await sendPush({ endpoint: ep, keys: k }, { title: 'Notifications are on', body: 'You will get a reminder 10 minutes before each post time, and the Tuesday 9 PM spare-usage reminder.', url: '/' }, env, 600).catch(() => 0);
    return jres({ ok: true, sent: status });
  }
  return jres({ error: 'bad-request' }, 400);
}
async function sparePush(env) {   // the cron runs daily at 15:30 UTC (21:00 IST); it only sends on Tuesdays (IST)
  const w = spareWindow(Date.now() + 120e3);   // a cron may fire a moment early
  if (!w.show) return { sent: 0, skipped: true };
  const db = await spareDb(env);
  if (!db) return { sent: 0 };
  const log = (devices, sent, failed, note) => db.prepare('INSERT OR REPLACE INTO spare_push_log (at, devices, sent, failed, note) VALUES (?1, ?2, ?3, ?4, ?5)')
    .bind(new Date().toISOString(), devices, sent, failed, note || null).run().catch(() => {});
  if (!env.VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_KEY) { await log(0, 0, 0, 'no-keys'); return { sent: 0, skipped: true }; }
  const { results } = await db.prepare('SELECT endpoint, p256dh, auth FROM push_subs').all();
  let sent = 0, failed = 0;
  for (const r of results || []) {
    const status = await sendPush({ endpoint: r.endpoint, keys: { p256dh: r.p256dh, auth: r.auth } },
      { title: 'Spare usage night', body: 'Tonight Claude uses your spare usage. Tap to skip.', url: '/' }, env).catch(() => 0);
    if (status === 404 || status === 410) { failed++; await db.prepare('DELETE FROM push_subs WHERE endpoint = ?1').bind(r.endpoint).run(); }   // unsubscribed device
    else if (status >= 200 && status < 300) sent++;
    else failed++;
  }
  await log((results || []).length, sent, failed);
  return { sent, failed };
}

// ---- Post-time reminders (owner, 5 Nov 2026: "less clarity on what should be uploaded when"; a 19:00 reel went out at 13:00). Each reel has an
// exact slot: "postAt" (HH:MM IST) in captions.json, else its channel's default (web 13:00, or 19:00 when its note says so; tech 19:00; c3 20:00: E15).
// The crons fire 10 minutes before each slot ("20 7,11,13,14,15 * * *" + "50 11 * * *" UTC = 12:50, 16:50, 18:50, 19:50, 20:50 + 17:20 IST) and sends "Post now: <title>" for each
// reel due then and not marked uploaded; the tap opens /#reel=<name> (the app scrolls to it, opens and highlights it). Each send is logged in D1.
// The same slot rule lives in templates/index.html and scripts/check.mjs (which also checks every postAt has a cron).
const CH_NAME = { web: '@webin20sec', tech: '@techin20sec', c3: '@itturns.out' };
export function postSlot(name, m) {
  if (m && /^\d{2}:\d{2}$/.test(m.postAt || '')) return m.postAt;
  const ch = m && CH_NAME[m.channel] ? m.channel : /^showreel-(tech-|t\d)/.test(name) ? 'tech' : /^showreel-c3-/.test(name) ? 'c3' : 'web';
  return ch === 'tech' ? '19:00' : ch === 'c3' ? '20:00' : /\b19:00\b/.test((m && m.note) || '') ? '19:00' : '13:00';
}
const chOfReel = (name, m) => (m && CH_NAME[m.channel] ? m.channel : /^showreel-(tech-|t\d)/.test(name) ? 'tech' : /^showreel-c3-/.test(name) ? 'c3' : 'web');
const hookLine = (c) => String(c || '').split('\n')[0].replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}️]/gu, '').trim();
async function reelTitle(env, name, m) {
  let t = hookLine(m.caption);
  if (!t && env.REELS) { try { const o = await env.REELS.get('c/' + name + '.json'); if (o) t = hookLine((await o.json()).caption); } catch { /* fall back */ } }
  if (!t && m.concept) t = String(m.concept).split(' · ').pop();
  return t || name.replace(/^showreel-(tech-|c3-|t\d+-)?(\d+-)?/, '').replace(/-/g, ' ');
}
export function postPayload(name, m, title) {
  return { title: 'Time to post', body: `Post now: ${title} (${CH_NAME[chOfReel(name, m)]}, ${postSlot(name, m)})`, url: '/#reel=' + name, tag: 'post-' + name };
}
async function captionsOf(env) {
  const r = await env.ASSETS.fetch(new Request('https://assets.local/showreels/captions.json'));
  return r.ok ? r.json() : {};
}
// reels not marked uploaded, due between `from` and `to` (ms), oldest first; sample (6 Nov 2026, temporary): "sample": true entries are never due
async function dueReels(env, db, from, to) {
  const caps = await captionsOf(env), up = new Set(((await db.prepare('SELECT id FROM reel_uploaded').all().catch(() => ({}))).results || []).map((r) => r.id));
  return Object.entries(caps).filter(([n, m]) => m && !m.hidden && !m.sample && /^\d{4}-\d{2}-\d{2}$/.test(m.postOn || '') && !up.has(n))
    .map(([n, m]) => ({ name: n, m, due: Date.parse(`${m.postOn}T${postSlot(n, m)}:00+05:30`) }))
    .filter((x) => x.due >= from && x.due <= to).sort((a, b) => a.due - b.due);
}
async function postDb(env) {
  const db = await spareDb(env);
  if (!db) return null;
  await db.batch([db.prepare('CREATE TABLE IF NOT EXISTS reel_uploaded (id TEXT PRIMARY KEY, at TEXT NOT NULL)'),
    db.prepare('CREATE TABLE IF NOT EXISTS post_push_log (reel TEXT NOT NULL, due TEXT NOT NULL, at TEXT NOT NULL, devices INTEGER NOT NULL, sent INTEGER NOT NULL, failed INTEGER NOT NULL, note TEXT, PRIMARY KEY (reel, due))')]);
  return db;
}
async function postPush(env, now = Date.now()) {
  const db = await postDb(env);
  if (!db) return { sent: 0 };
  const reels = await dueReels(env, db, now + 3 * 60e3, now + 20 * 60e3);   // the slot 10 minutes ahead (a cron may run a few minutes late or early)
  const out = [];
  for (const { name, m, due } of reels) {
    const dueIso = new Date(due).toISOString();
    if (await db.prepare('SELECT 1 FROM post_push_log WHERE reel = ?1 AND due = ?2').bind(name, dueIso).first()) continue;   // already reminded
    const log = (devices, sent, failed, note) => db.prepare('INSERT OR REPLACE INTO post_push_log (reel, due, at, devices, sent, failed, note) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)')
      .bind(name, dueIso, new Date().toISOString(), devices, sent, failed, note || null).run().catch(() => {});
    if (!env.VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_KEY) { await log(0, 0, 0, 'no-keys'); continue; }
    const payload = postPayload(name, m, await reelTitle(env, name, m));
    const { results } = await db.prepare('SELECT endpoint, p256dh, auth FROM push_subs').all();
    let sent = 0, failed = 0;
    for (const r of results || []) {
      const status = await sendPush({ endpoint: r.endpoint, keys: { p256dh: r.p256dh, auth: r.auth } }, payload, env).catch(() => 0);
      if (status === 404 || status === 410) { failed++; await db.prepare('DELETE FROM push_subs WHERE endpoint = ?1').bind(r.endpoint).run(); }
      else if (status >= 200 && status < 300) sent++;
      else failed++;
    }
    await log((results || []).length, sent, failed, payload.body.slice(0, 200));
    out.push({ name, sent, failed });
  }
  return out;
}
// Every cron run is logged (owner, 6 Nov 2026: a 12:50 reminder never came and nothing showed why), kept 14 days
async function cronLog(env, cron, scheduled, result) {
  try {
    const db = await spareDb(env); if (!db) return;
    await db.batch([db.prepare('INSERT INTO cron_log (at, cron, scheduled, result) VALUES (?1, ?2, ?3, ?4)').bind(new Date().toISOString(), cron || '', scheduled ? new Date(scheduled).toISOString() : null, String(result).slice(0, 500)),
      db.prepare('DELETE FROM cron_log WHERE at < ?1').bind(new Date(Date.now() - 14 * DAY_MS).toISOString())]);
  } catch { /* logging never breaks a send */ }
}
async function runCron(env, cron, scheduled) {
  let r;
  try { r = cron === SPARE_CRON ? await sparePush(env) : await postPush(env, scheduled || Date.now()); } catch (e) { r = { error: String(e && e.message || e) }; }
  await cronLog(env, cron, scheduled, JSON.stringify(r));
}
// GET /api/push/status (signed in, read-only): devices by push host only (never endpoints or keys), the send logs, the cron runs, and the reels due
async function pushStatus(env, db) {
  const q = async (sql) => ((await db.prepare(sql).all().catch((e) => ({ results: [{ error: String(e.message || e) }] }))).results || []);
  await postDb(env).catch(() => {});
  const subs = await q('SELECT endpoint, at FROM push_subs ORDER BY at DESC');
  const now = Date.now();
  let due = [], slots = [], captions = null;
  try {   // every reel with a slot within a day either side (hidden and uploaded ones too, flagged), and the ones a reminder would go to
    const caps = await captionsOf(env); captions = Object.keys(caps).length;
    const up = new Map((await q('SELECT id, at FROM reel_uploaded')).map((r) => [r.id, r.at]));
    slots = Object.entries(caps).filter(([, m]) => m && /^\d{4}-\d{2}-\d{2}$/.test(m.postOn || '')).map(([n, m]) => ({ name: n, due: Date.parse(`${m.postOn}T${postSlot(n, m)}:00+05:30`), hidden: !!m.hidden, uploaded: up.get(n) || null }))
      .filter((x) => Math.abs(x.due - now) <= DAY_MS).sort((a, b) => a.due - b.due).map((x) => ({ ...x, due: new Date(x.due).toISOString() }));
    due = (await dueReels(env, db, now - DAY_MS, now + DAY_MS)).map((x) => x.name);
  } catch (e) { captions = 'error: ' + (e.message || e); }
  return { now: new Date(now).toISOString(), vapid: !!(env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY), captions,
    devices: subs.length, subs: subs.map((r) => ({ host: r.endpoint ? new URL(r.endpoint).host : null, at: r.at })),
    slots, remindable: due,
    postLog: await q('SELECT reel, due, at, devices, sent, failed, note FROM post_push_log ORDER BY at DESC LIMIT 20'),
    spareLog: await q('SELECT at, devices, sent, failed, note FROM spare_push_log ORDER BY at DESC LIMIT 5'),
    acks: await q('SELECT at, tag, shown FROM push_ack ORDER BY at DESC LIMIT 20'),
    cronLog: await q('SELECT at, cron, scheduled, result FROM cron_log ORDER BY at DESC LIMIT 30') };
}
// "Send a test notification": the real reminder for the next reel to post (overdue or upcoming, 3 days either side), so the tap tests the deep link
async function testPayload(env, db) {
  try {
    await postDb(env);
    const now = Date.now(), list = await dueReels(env, db, now - 3 * DAY_MS, now + 3 * DAY_MS);
    const x = list.find((r) => r.due >= now - 12 * 3600e3) || list[list.length - 1];
    if (x) { const p = postPayload(x.name, x.m, await reelTitle(env, x.name, x.m)); return { ...p, title: 'Test: ' + p.title, tag: 'test' }; }
  } catch { /* the plain test below */ }
  return { title: 'Test notification', body: 'This is how the reminders will look.', url: '/' };
}

// ---- Reel-uploaded tracking in D1 (binding "DB"). Without the binding the API answers 501 and the pages fall back to localStorage. ----
const ID_RE = /^(\d{4}-\d{2}-\d{2}(-\d{4})?|showreel-[a-z0-9-]{1,60})$/;   // old template dates and showreels (the import is also how a Claude run marks reels the owner says are posted)
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
  const m = /^\/api\/uploaded\/(\d{4}-\d{2}-\d{2}(?:-\d{4})?|showreel-[a-z0-9-]{1,60})$/.exec(p);   // templates (old) and showreels (owner, 23 Oct)
  if (request.method === 'PUT' && m && body && typeof body.on === 'boolean') {
    if (body.on) await db.prepare('INSERT INTO reel_uploaded (id, at) VALUES (?1, ?2) ON CONFLICT(id) DO UPDATE SET at = excluded.at').bind(m[1], new Date().toISOString()).run();
    else await db.prepare('DELETE FROM reel_uploaded WHERE id = ?1').bind(m[1]).run();
    return jres({ ok: true });
  }
  if (request.method === 'POST' && p === '/api/uploaded/import' && body && body.ids && typeof body.ids === 'object') {
    const rows = Object.entries(body.ids).filter(([id, at]) => ID_RE.test(id) && typeof at === 'string').slice(0, 500);
    // force (owner, 5 Nov 2026): the collector marks reels at their real Instagram time, overwriting a hand-tapped time
    const sql = body.force === true ? 'INSERT INTO reel_uploaded (id, at) VALUES (?1, ?2) ON CONFLICT(id) DO UPDATE SET at = excluded.at' : 'INSERT OR IGNORE INTO reel_uploaded (id, at) VALUES (?1, ?2)';
    if (rows.length) await db.batch(rows.map(([id, at]) => db.prepare(sql).bind(id, at.slice(0, 40))));
    return jres({ ok: true, imported: rows.length });
  }
  return jres({ error: 'bad-request' }, 400);
}

// reel media (owner, 3 Nov 2026) live in the PRIVATE R2 bucket "aquarii-reels" (binding REELS; scripts/r2.sh), served only to signed-in users.
// The repo is public, so nothing goes to the GitHub releases any more. v/<name> = MP4 and review PNG (an R2 lifecycle rule deletes them
// 15 days after upload), c/<name> = cover, config json and the minutes meter (kept). Range requests are answered so phones can seek.
// /api/showreels lists a reel while its MP4 or its cover is there: after 15 days only the cover (and the post text) remain.
const REEL = /^\/reels\/(showreel-[a-z0-9-]{1,60}\.(?:mp4|jpg|json|png))$/;
const TYPES = { mp4: 'video/mp4', jpg: 'image/jpeg', json: 'application/json; charset=utf-8', png: 'image/png' };
const reelKey = (name) => (/\.(mp4|png)$/.test(name) ? 'v/' : 'c/') + name;
async function listAll(bucket, prefix) {
  const out = [];
  let cursor;
  do { const r = await bucket.list({ prefix, delimiter: '/', cursor, limit: 1000 }); out.push(...r.objects); cursor = r.truncated ? r.cursor : undefined; } while (cursor);
  return out;
}
async function showreelList(env) {
  if (!env.REELS) return jres({ error: 'no-store' }, 503);
  const [v, c] = await Promise.all([listAll(env.REELS, 'v/'), listAll(env.REELS, 'c/')]);
  const byName = new Map([...v, ...c].map((o) => [o.key.slice(2), o]));
  let first = {};   // original render times of reels copied from the old releases (R2 dates a copy with the day it was copied)
  try { const o = await env.REELS.get('c/rendered-at.json'); if (o) first = await o.json(); } catch { /* use the R2 dates */ }
  // <name>-play.mp4 (owner, 6 Nov 2026) is the light 720p copy the app plays; <name>.mp4 is the full-quality file "Save video" downloads
  const reels = new Set([...byName.keys()].filter((k) => !k.endsWith('-play.mp4')).map((k) => (/^(showreel-[a-z0-9-]{1,60}?)(?:\.mp4|-cover\.jpg)$/.exec(k) || [])[1]).filter(Boolean));
  // each URL carries its object's upload time: a re-render replaces the object, so the URL changes and the immutable cache never serves an old cut
  const url = (o) => (o ? `/reels/${o.key.slice(2)}?v=${o.uploaded.getTime()}` : null);
  const list = [...reels].map((n) => { const mp4 = byName.get(n + '.mp4'), main = mp4 || byName.get(n + '-cover.jpg'), play = mp4 && byName.get(n + '-play.mp4');
    return { name: n, video: url(mp4), play: url(play), cover: url(byName.get(n + '-cover.jpg')), info: byName.has(n + '.json') ? `/reels/${n}.json` : null,
      size: mp4 ? mp4.size : 0, playSize: play ? play.size : 0, uploaded: main.uploaded.toISOString(), at: first[n] || main.uploaded.toISOString() }; })
    .sort((x, y) => String(y.at).localeCompare(String(x.at)));
  return jres({ showreels: list });
}
async function reelFile(request, env, name) {
  if (!env.REELS) return null;
  const key = reelKey(name), head = request.method === 'HEAD', range = request.headers.get('Range');
  let obj;
  try { obj = head ? await env.REELS.head(key) : await env.REELS.get(key, range ? { range: request.headers } : {}); }
  catch { return new Response('Range not satisfiable', { status: 416, headers: { 'Content-Range': 'bytes */*' } }); }
  if (!obj) return null;
  const h = new Headers({ 'Content-Type': TYPES[name.split('.').pop()] || 'application/octet-stream', 'Accept-Ranges': 'bytes', ETag: obj.httpEtag,
    'Last-Modified': obj.uploaded.toUTCString(), 'Cache-Control': name.endsWith('.json') ? 'private, no-cache' : 'private, max-age=3600, immutable' });   // media names are versioned (?v=upload time)
  const r = obj.range, start = /^bytes=(\d+)-/.exec(range || '');
  if (!head && start && +start[1] >= obj.size) return new Response('Range not satisfiable', { status: 416, headers: { 'Content-Range': `bytes */${obj.size}` } });
  if (!head && range && r) {
    const suffix = typeof r.suffix === 'number', offset = suffix ? obj.size - r.suffix : (r.offset || 0), length = suffix ? r.suffix : (r.length ?? obj.size - offset);
    h.set('Content-Range', `bytes ${offset}-${offset + length - 1}/${obj.size}`); h.set('Content-Length', String(length));
    return new Response(obj.body, { status: 206, headers: h });
  }
  h.set('Content-Length', String(obj.size));
  return new Response(head ? null : obj.body, { status: 200, headers: h });
}

export default {
  async scheduled(controller, env, ctx) { ctx.waitUntil(runCron(env, controller.cron, controller.scheduledTime)); },
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
    if (p.startsWith('/api/')) return signedIn ? (p.startsWith('/api/uploaded') ? uploadedApi(request, env, p) : p.startsWith('/api/perf') ? perfApi(request, env, p, url) : p.startsWith('/api/cards') ? cardsApi(request, env, p) : p.startsWith('/api/asks') ? asksApi(request, env, p, url) : (p === '/api/spare' || p.startsWith('/api/push/')) ? spareApi(request, env, p, url) : p === '/api/showreels' ? showreelList(env) : jres({ error: 'not-found' }, 404)) : new Response('{"error":"unauthorized"}', { status: 401, headers: jsonHeaders });
    if (signedIn) {
      const m = (request.method === 'GET' || request.method === 'HEAD') && p.match(REEL);
      if (m) { try { const v = await reelFile(request, env, m[1]); if (v) return v; } catch { /* fall back to a site copy, if any */ } }
      return env.ASSETS.fetch(request);
    }

    const wantsPage = request.method === 'GET' && ((request.headers.get('Accept') || '').includes('text/html') || request.headers.get('Sec-Fetch-Mode') === 'navigate');
    if (wantsPage) return go(`/login?next=${encodeURIComponent(p + url.search)}`);
    return new Response('{"error":"unauthorized"}', { status: 401, headers: { 'Content-Type': 'application/json', ...noStore } }); // no WWW-Authenticate: never trigger the native popup
  },
};
