// Sign-in gate in front of the static assets (PWA-friendly: a login page + signed session cookie, no browser Basic-auth popup).
// Credentials live ONLY in Worker secrets, never in the repo: BASIC_AUTH_USER / BASIC_AUTH_PASS, plus an optional second account
// BASIC_AUTH_USER_2 / BASIC_AUTH_PASS_2 (either account can sign in). Fails closed if no account is configured.
// HTTP Basic headers are still accepted so scripts/CI can authenticate with curl --user.
import { sendPush, PUSH_HOST } from './push.js';
import { journeyApi } from './journey.js';
import { plan, NOTIFY_TYPES, istParts, fill, planToday } from './notify.js';
import SLOT_CONFIG from '../design/slots.json' with { type: 'json' };
import NOTIFY_POLICY from '../design/notify-policy.json' with { type: 'json' };   // the one notification plan (task 6)

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

// the read-only reel key: constant-time compare, fails closed when the secret is unset or empty
async function readKeyOk(request, env) {
  const key = typeof env.REELS_READ_KEY === 'string' ? env.REELS_READ_KEY.trim() : '';
  const m = /^Bearer\s+(\S+)\s*$/i.exec(request.headers.get('Authorization') || '');
  if (!key || !m) return false;
  return safeEqual(m[1], key);
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
      const runs = await db.prepare('SELECT r.ig_id, r.at, r.reach, r.views, r.saves, r.shares, r.watch_avg_ms, r.follows, r.profile_visits, r.extra FROM ig_media_runs r JOIN ig_media m ON m.ig_id = r.ig_id WHERE m.username = ?1 AND r.at >= ?2 ORDER BY r.at').bind(who, since).all();
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
    const NAME = /^showreel-[a-z0-9-]{1,70}$/;   // task 12 (owner, 27 Nov 2026): an ask may name the reel or preview it is about, so the app shows its cover and player beside the question
    const body = JSON.stringify({ question: q.trim(), why: nStr(b.why, 300) || '', kind, channel: ['web', 'tech', 'c3'].includes(b.channel) ? b.channel : null, until: /^\d{4}-\d{2}-\d{2}$/.test(b.until || '') ? b.until : null,
      reel: NAME.test(b.reel || '') ? b.reel : null, preview: NAME.test(b.preview || '') ? b.preview : null });
    await db.prepare('INSERT INTO owner_asks (id, body, created) VALUES (?1, ?2, ?3) ON CONFLICT(id) DO UPDATE SET body = excluded.body, answer = NULL, answered_at = NULL').bind(m[1], body, new Date().toISOString()).run();
    return jres({ ok: true, id: m[1] });
  }
  return jres({ error: 'bad-request' }, 400);
}

// ---- Feedback (owner, 11 Nov 2026: "when we reach the limit within the week, keep an option in the app where I can submit feedback for that window,
// so you visit it first before resuming"): the owner types feedback any time (optional channel); every Claude run reads the new items first with the
// "Owner answers" workflow (scripts/asks.mjs, action read or feedback), acts on them or files them in design/todo.md, then marks them done with a
// short note (action feedback-done), which the app shows under the item. Primary account only.
let fbReady = null;
async function fbDb(env) {
  if (!env.DB) return null;
  fbReady = fbReady || env.DB.exec('CREATE TABLE IF NOT EXISTS owner_feedback (id INTEGER PRIMARY KEY AUTOINCREMENT, created TEXT NOT NULL, channel TEXT, body TEXT NOT NULL, state TEXT NOT NULL DEFAULT \'new\', note TEXT, done_at TEXT)')
    // read_at (owner, 14 Nov 2026: the side menu shows one reply at a time with "Mark read"): when the owner has read Claude's note
    .then(() => env.DB.prepare('ALTER TABLE owner_feedback ADD COLUMN read_at TEXT').run().catch(() => {}))
    // flow (owner, 24 Nov 2026): flag = received | reviewed | in_progress | done | closed; reviewed_by = Fable / Opus; report + proof (a check name, or an image in R2 fb/<id>.jpg)
    .then(() => Promise.all(['flag', 'reviewed_by', 'report', 'proof', 'proof_img', 'closed_at'].concat(['priority']).map((c) => env.DB.prepare(`ALTER TABLE owner_feedback ADD COLUMN ${c} TEXT`).run().catch(() => {}))))
    .catch((e) => { fbReady = null; throw e; });
  await fbReady;
  return env.DB;
}
const FB_CH = ['web', 'tech', 'c3', 'app'], FB_ID = /^\/api\/feedback\/([0-9]{1,9})\/done$/, FB_READ = /^\/api\/feedback\/([0-9]{1,9})\/read$/;
const FB_FLAG = /^\/api\/feedback\/([0-9]{1,9})\/flag$/, FB_CLOSE = /^\/api\/feedback\/([0-9]{1,9})\/(close|reopen)$/;
async function feedbackApi(request, env, p, url) {
  if (!(await isPrimary(request, env))) return request.method === 'GET' ? jres({ feedback: [] }) : jres({ error: 'forbidden' }, 403);
  let db;
  try { db = await fbDb(env); } catch { return jres({ error: 'db-unavailable' }, 503); }
  if (!db) return jres({ error: 'no-db' }, 501);
  if (request.method === 'GET' && p === '/api/feedback') {   // newest first; ?state=new gives only the items waiting for Claude
    const onlyNew = url.searchParams.get('state') === 'new';
    const FL = "COALESCE(flag, CASE WHEN state = 'done' THEN 'done' ELSE 'received' END)";   // old rows have no flag yet
    const { results } = await db.prepare(`SELECT id, created, channel, body, state, note, done_at, read_at, ${FL} AS fl, reviewed_by, report, proof, proof_img, priority FROM owner_feedback WHERE ${FL} <> 'closed'${onlyNew ? " AND state = 'new'" : ''} ORDER BY (priority IS NOT NULL) DESC, id DESC LIMIT 50`).all();   // closed items leave the app
    return jres({ feedback: (results || []).map((r) => ({ id: r.id, created: r.created, channel: r.channel, text: r.body, state: r.state, note: r.note, done_at: r.done_at, read_at: r.read_at,
      flag: r.fl, priority: !!r.priority, by: r.reviewed_by || null, report: r.report || r.note || null, proof: r.proof || null, proofImg: r.proof_img ? `/api/feedback/${r.id}/proof` : null })) });
  }
  const pf = /^\/api\/feedback\/([0-9]{1,9})\/proof$/.exec(p);
  if (request.method === 'GET' && pf) {
    const r = await db.prepare('SELECT proof_img FROM owner_feedback WHERE id = ?1').bind(Number(pf[1])).first();
    const o = r && r.proof_img && env.REELS ? await env.REELS.get(r.proof_img) : null;
    if (!o) return jres({ error: 'not-found' }, 404);
    return new Response(o.body, { headers: { 'Content-Type': o.httpMetadata && o.httpMetadata.contentType || 'image/jpeg', 'Cache-Control': 'private, max-age=600', 'X-Content-Type-Options': 'nosniff' } });
  }
  if (request.method !== 'POST' || request.headers.get('X-Requested-With') !== 'reel') return jres({ error: 'forbidden' }, 403);
  let b = null; try { b = await request.json(); } catch { /* handled below */ }
  if (p === '/api/feedback') {   // the owner's new item
    const text = b && nStr(b.text, 2000);
    if (!text || !text.trim()) return jres({ error: 'bad-request' }, 400);
    const ch = b && FB_CH.includes(b.channel) ? b.channel : null;
    // priority (owner, 26 Nov 2026): the app's Fix button on a red board row sends the failure line as a top-priority item; every reader lists these first
    const r = await db.prepare('INSERT INTO owner_feedback (created, channel, body, priority) VALUES (?1, ?2, ?3, ?4)').bind(new Date().toISOString(), ch, text.trim(), b.priority ? '1' : null).run();
    return jres({ ok: true, id: r.meta && r.meta.last_row_id });
  }
  const rd = FB_READ.exec(p);
  if (rd) {   // the owner read Claude's reply (side menu "Mark read")
    const r = await db.prepare('UPDATE owner_feedback SET read_at = ?2 WHERE id = ?1').bind(Number(rd[1]), new Date().toISOString()).run();
    return jres({ ok: true, stored: !!(r.meta && r.meta.changes) });
  }
  const fl = FB_FLAG.exec(p);
  if (fl) {   // a Claude run moves an item along: reviewed (by Fable or Opus), in_progress, done (report + proof: a check name or an image)
    const f = b && b.flag, id = Number(fl[1]);
    if (!['reviewed', 'in_progress', 'done'].includes(f)) return jres({ error: 'bad-request' }, 400);
    const by = b && /fable/i.test(b.by || '') ? 'Fable' : b && /opus/i.test(b.by || '') ? 'Opus' : b && /sonnet|haiku/i.test(b.by || '') ? (/sonnet/i.test(b.by) ? 'Sonnet' : 'Haiku') : null;
    const report = b && nStr(b.report, 600), proof = b && nStr(b.proof, 160), now = new Date().toISOString();
    if (f === 'reviewed' && !by) return jres({ error: 'bad-request', need: 'by' }, 400);
    if (f === 'done' && (!report || !report.trim() || !((proof && proof.trim()) || (b.image && typeof b.image === 'string')))) return jres({ error: 'bad-request', need: 'report and proof' }, 400);
    let img = null;
    if (f === 'done' && typeof b.image === 'string' && env.REELS) {
      try { const bin = Uint8Array.from(atob(b.image.replace(/^data:image\/[a-z]+;base64,/, '')), (c) => c.charCodeAt(0)), png = bin[0] === 0x89, jpg = bin[0] === 0xff && bin[1] === 0xd8;
        if (bin.length <= 400 * 1024 && (png || jpg)) { img = `fb/${id}.${png ? 'png' : 'jpg'}`; await env.REELS.put(img, bin, { httpMetadata: { contentType: png ? 'image/png' : 'image/jpeg' } }); }
      } catch { /* a check name still counts */ }
    }
    let r;
    if (f === 'done') r = await db.prepare("UPDATE owner_feedback SET flag = 'done', state = 'done', note = ?2, report = ?2, proof = ?3, proof_img = ?4, done_at = ?5, read_at = NULL WHERE id = ?1 AND COALESCE(flag, 'received') <> 'closed'").bind(id, report.trim(), proof && proof.trim() || null, img, now).run();
    else if (f === 'reviewed') r = await db.prepare("UPDATE owner_feedback SET flag = 'reviewed', reviewed_by = ?2 WHERE id = ?1 AND COALESCE(flag, 'received') IN ('received', 'reviewed')").bind(id, by).run();
    else r = await db.prepare("UPDATE owner_feedback SET flag = 'in_progress', reviewed_by = COALESCE(?2, reviewed_by) WHERE id = ?1 AND COALESCE(flag, 'received') IN ('received', 'reviewed', 'in_progress')").bind(id, by).run();
    return jres({ ok: true, stored: !!(r.meta && r.meta.changes) });
  }
  const cl = FB_CLOSE.exec(p);
  if (cl) {   // the owner closes it (it leaves the app) or reopens it with a note (back to Received, read again by the next run)
    const id = Number(cl[1]), now = new Date().toISOString();
    if (cl[2] === 'close') { const r = await db.prepare("UPDATE owner_feedback SET flag = 'closed', closed_at = ?2, read_at = COALESCE(read_at, ?2) WHERE id = ?1").bind(id, now).run(); return jres({ ok: true, stored: !!(r.meta && r.meta.changes) }); }
    const note = b && nStr(b.note, 600);
    if (!note || !note.trim()) return jres({ error: 'bad-request' }, 400);
    const r = await db.prepare("UPDATE owner_feedback SET flag = 'received', state = 'new', body = body || ?2, note = NULL, report = NULL, proof = NULL, proof_img = NULL, reviewed_by = NULL, done_at = NULL, read_at = NULL, closed_at = NULL WHERE id = ?1").bind(id, '\n\nReopened: ' + note.trim()).run();
    return jres({ ok: true, stored: !!(r.meta && r.meta.changes) });
  }
  const m = FB_ID.exec(p);
  if (m) {   // a Claude run marks an item done, with a short note of what it did
    const note = b && nStr(b.note, 500);
    if (!note || !note.trim()) return jres({ error: 'bad-request' }, 400);
    const r = await db.prepare("UPDATE owner_feedback SET state = 'done', flag = 'done', note = ?2, report = ?2, done_at = ?3 WHERE id = ?1 AND COALESCE(flag, 'received') <> 'closed'").bind(Number(m[1]), note.trim(), new Date().toISOString()).run();
    return jres({ ok: true, stored: !!(r.meta && r.meta.changes) });
  }
  return jres({ error: 'bad-request' }, 400);
}

// ---- References (owner, 20 Nov 2026: "build the option to upload in app so that I can put the references"; design/todo.md 16 Nov spec): the owner adds
// a link (an Instagram reel, a site) or uploads a screenshot or a short clip, with an optional note and channel. Files go to the private R2 bucket
// under refs/ (never the repo), at most REF_MAX bytes. Claude runs read the new ones with the "Owner answers" workflow (scripts/asks.mjs, action refs:
// REF lines and small previews), study each into design/references.md (techniques only, never a piece) and set its state with a note (refs-done):
// new -> studied -> used. The owner may delete one (row and file). Primary account only.
let refReady = null;
async function refDb(env) {
  if (!env.DB) return null;
  refReady = refReady || env.DB.exec("CREATE TABLE IF NOT EXISTS owner_refs (id INTEGER PRIMARY KEY AUTOINCREMENT, created TEXT NOT NULL, channel TEXT, url TEXT, file_key TEXT, file_type TEXT, file_name TEXT, size INTEGER, note TEXT, state TEXT NOT NULL DEFAULT 'new', reply TEXT, done_at TEXT)")
    // flow (owner, 24 Nov 2026): checklist = JSON [{t, c: keep|skip|ask|null, th: [{w, t, at}]}], stills = number of report stills in R2 (refs/<id>-still-<n>.jpg), upload_id = a multipart upload in progress, closed_at = closed (video deleted)
    .then(() => Promise.all(['checklist', 'stills', 'upload_id', 'closed_at'].map((c) => env.DB.prepare(`ALTER TABLE owner_refs ADD COLUMN ${c} TEXT`).run().catch(() => {}))))
    .catch((e) => { refReady = null; throw e; });
  await refReady;
  return env.DB;
}
// up to 1 GB (owner, 24 Nov 2026): a file over REF_SINGLE goes up in parts (R2 multipart through this Worker, each part under REF_PART, which stays below the 100 MB request limit)
const REF_MAX = 1024 * 1024 * 1024, REF_SINGLE = 50 * 1024 * 1024, REF_PART = 90 * 1024 * 1024, REF_PART_SIZE = 64 * 1024 * 1024, REF_TYPES = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif', 'image/heic': 'heic', 'video/mp4': 'mp4', 'video/quicktime': 'mov', 'video/webm': 'webm' };
const REF_ST = ['new', 'studied', 'used'], REF_ID = /^\/api\/refs\/([0-9]{1,9})(\/file|\/state|\/delete|\/part|\/complete|\/abort|\/report|\/check|\/thread|\/close|\/still\/[0-9]{1,2})?$/;
const jparse = (t) => { try { const v = JSON.parse(t); return Array.isArray(v) ? v : []; } catch { return []; } };
const refOut = (r) => ({ id: r.id, created: r.created, channel: r.channel, url: r.url, file: r.file_key ? { type: r.file_type, name: r.file_name, size: r.size } : r.closed_at && r.file_name ? { type: r.file_type, name: r.file_name, size: r.size, deleted: true } : null,
  note: r.note, state: r.state, reply: r.reply, done_at: r.done_at, closed: r.closed_at || null, uploading: r.state === 'uploading',
  checklist: jparse(r.checklist), stills: Array.from({ length: Math.min(8, Number(r.stills) || 0) }, (_, i) => `/api/refs/${r.id}/still/${i + 1}`) });
async function refsApi(request, env, p, url) {
  if (!(await isPrimary(request, env))) return request.method === 'GET' ? jres({ refs: [] }) : jres({ error: 'forbidden' }, 403);
  let db;
  try { db = await refDb(env); } catch { return jres({ error: 'db-unavailable' }, 503); }
  if (!db) return jres({ error: 'no-db' }, 501);
  const m = REF_ID.exec(p);
  if (request.method === 'GET' && p === '/api/refs') {   // newest first; ?state=new gives only the ones waiting for Claude
    const onlyNew = url.searchParams.get('state') === 'new';
    const { results } = await db.prepare(`SELECT * FROM owner_refs ${onlyNew ? "WHERE state = 'new' AND closed_at IS NULL " : ''}ORDER BY id DESC LIMIT 60`).all();
    return jres({ refs: (results || []).map(refOut) });
  }
  if (request.method === 'GET' && m && m[2] === '/file') {   // the file itself, for the app's thumbnail and the workflow's preview
    if (!env.REELS) return jres({ error: 'no-store' }, 503);
    const r = await db.prepare('SELECT file_key, file_type FROM owner_refs WHERE id = ?1').bind(Number(m[1])).first();
    if (!r || !r.file_key) return jres({ error: 'not-found' }, 404);
    const o = await env.REELS.get(r.file_key);
    if (!o) return jres({ error: 'not-found' }, 404);
    return new Response(o.body, { headers: { 'Content-Type': r.file_type || 'application/octet-stream', 'Cache-Control': 'private, max-age=3600', 'X-Content-Type-Options': 'nosniff', 'Content-Disposition': 'inline' } });
  }
  if (request.method === 'GET' && m && /^\/still\//.test(m[2] || '')) {   // a still from the report
    if (!env.REELS) return jres({ error: 'no-store' }, 503);
    const o = await env.REELS.get(`refs/${m[1]}-still-${m[2].slice(7)}.jpg`);
    if (!o) return jres({ error: 'not-found' }, 404);
    return new Response(o.body, { headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'private, max-age=3600', 'X-Content-Type-Options': 'nosniff' } });
  }
  if (request.method !== 'POST' || request.headers.get('X-Requested-With') !== 'reel') return jres({ error: 'forbidden' }, 403);
  const ch = (v) => (FB_CH.includes(v) ? v : null), now = new Date().toISOString();
  if (p === '/api/refs/mp/start') {   // a big file: start a multipart upload; the app sends it in parts of partSize bytes, then completes
    if (!env.REELS || !env.REELS.createMultipartUpload) return jres({ error: 'no-store' }, 503);
    let b0 = null; try { b0 = await request.json(); } catch { /* below */ }
    const type = String(b0 && b0.type || '').toLowerCase(), ext = REF_TYPES[type], size = Number(b0 && b0.size);
    if (!ext) return jres({ error: 'type', allowed: Object.keys(REF_TYPES) }, 415);
    if (!(size > 0)) return jres({ error: 'bad-request' }, 400);
    if (size > REF_MAX) return jres({ error: 'too-big', max: REF_MAX }, 413);
    const name = (nStr(b0.name, 120) || 'file').replace(/[^\w. -]/g, '_'), note = nStr(b0.note, 1000);
    const ins = await db.prepare("INSERT INTO owner_refs (created, channel, file_type, file_name, size, note, state) VALUES (?1, ?2, ?3, ?4, ?5, ?6, 'uploading')").bind(now, ch(b0.channel), type, name, size, note && note.trim() ? note.trim() : null).run();
    const id = ins.meta && ins.meta.last_row_id, key = `refs/${id}.${ext}`;
    try { const mp = await env.REELS.createMultipartUpload(key, { httpMetadata: { contentType: type } });
      await db.prepare('UPDATE owner_refs SET file_key = ?2, upload_id = ?3 WHERE id = ?1').bind(id, key, mp.uploadId).run(); }
    catch { await db.prepare('DELETE FROM owner_refs WHERE id = ?1').bind(id).run(); return jres({ error: 'store-failed' }, 502); }
    return jres({ ok: true, id, partSize: REF_PART_SIZE, max: REF_PART });
  }
  if (m && (m[2] === '/part' || m[2] === '/complete' || m[2] === '/abort')) {
    const r = await db.prepare("SELECT file_key, upload_id, size FROM owner_refs WHERE id = ?1 AND state = 'uploading'").bind(Number(m[1])).first();
    if (!r || !r.upload_id || !env.REELS) return jres({ error: 'not-found' }, 404);
    const mp = env.REELS.resumeMultipartUpload(r.file_key, r.upload_id);
    if (m[2] === '/part') {   // raw part body (at most REF_PART bytes); returns its etag for /complete
      const n = Number(url.searchParams.get('n')), len = Number(request.headers.get('Content-Length') || 0);
      if (!(n >= 1 && n <= 10000) || !len) return jres({ error: 'bad-request' }, 400);
      if (len > REF_PART) return jres({ error: 'too-big', max: REF_PART }, 413);
      try { const part = await mp.uploadPart(n, request.body); return jres({ ok: true, partNumber: part.partNumber, etag: part.etag }); }
      catch { return jres({ error: 'store-failed' }, 502); }
    }
    if (m[2] === '/abort') { try { await mp.abort(); } catch { /* gone already */ } await db.prepare('DELETE FROM owner_refs WHERE id = ?1').bind(Number(m[1])).run(); return jres({ ok: true }); }
    let b1 = null; try { b1 = await request.json(); } catch { /* below */ }
    const parts = b1 && Array.isArray(b1.parts) ? b1.parts.filter((x) => x && Number(x.partNumber) >= 1 && typeof x.etag === 'string').map((x) => ({ partNumber: Number(x.partNumber), etag: x.etag })).sort((a, c) => a.partNumber - c.partNumber) : [];
    if (!parts.length) return jres({ error: 'bad-request' }, 400);
    let obj; try { obj = await mp.complete(parts); } catch { return jres({ error: 'store-failed' }, 502); }
    if (obj.size > REF_MAX) { try { await env.REELS.delete(r.file_key); } catch { /* row goes anyway */ } await db.prepare('DELETE FROM owner_refs WHERE id = ?1').bind(Number(m[1])).run(); return jres({ error: 'too-big', max: REF_MAX }, 413); }
    await db.prepare("UPDATE owner_refs SET state = 'new', upload_id = NULL, size = ?2 WHERE id = ?1").bind(Number(m[1]), obj.size).run();
    return jres({ ok: true, id: Number(m[1]) });
  }
  if (p === '/api/refs/upload') {   // raw file body; channel, note and name in the query
    if (!env.REELS) return jres({ error: 'no-store' }, 503);
    const type = (request.headers.get('Content-Type') || '').split(';')[0].trim().toLowerCase(), ext = REF_TYPES[type];
    if (!ext) return jres({ error: 'type', allowed: Object.keys(REF_TYPES) }, 415);
    const len = Number(request.headers.get('Content-Length') || 0);
    if (len > REF_SINGLE) return jres({ error: 'too-big', max: REF_SINGLE, multipart: true }, 413);   // bigger files use /api/refs/mp/start
    const buf = await request.arrayBuffer();
    if (!buf.byteLength) return jres({ error: 'bad-request' }, 400);
    if (buf.byteLength > REF_SINGLE) return jres({ error: 'too-big', max: REF_SINGLE, multipart: true }, 413);
    const name = (nStr(url.searchParams.get('name'), 120) || 'file').replace(/[^\w. -]/g, '_'), note = nStr(url.searchParams.get('note'), 1000);
    const ins = await db.prepare('INSERT INTO owner_refs (created, channel, file_type, file_name, size, note) VALUES (?1, ?2, ?3, ?4, ?5, ?6)')
      .bind(now, ch(url.searchParams.get('channel')), type, name, buf.byteLength, note && note.trim() ? note.trim() : null).run();
    const id = ins.meta && ins.meta.last_row_id, key = `refs/${id}.${ext}`;
    try { await env.REELS.put(key, buf, { httpMetadata: { contentType: type } }); }
    catch { await db.prepare('DELETE FROM owner_refs WHERE id = ?1').bind(id).run(); return jres({ error: 'store-failed' }, 502); }
    await db.prepare('UPDATE owner_refs SET file_key = ?2 WHERE id = ?1').bind(id, key).run();
    return jres({ ok: true, id });
  }
  let b = null; try { b = await request.json(); } catch { /* handled below */ }
  if (p === '/api/refs') {   // a link, with an optional note
    const link = b && nStr(b.url, 600), note = b && nStr(b.note, 1000);
    if (!link || !/^https:\/\/[^\s]+$/i.test(link.trim())) return jres({ error: 'bad-url' }, 400);
    const r = await db.prepare('INSERT INTO owner_refs (created, channel, url, note) VALUES (?1, ?2, ?3, ?4)').bind(now, ch(b.channel), link.trim(), note && note.trim() ? note.trim() : null).run();
    return jres({ ok: true, id: r.meta && r.meta.last_row_id });
  }
  if (m && m[2] === '/report') {   // a Claude run: the report, a checklist (short lines the owner marks Keep / Skip / Ask) and up to 8 stills (base64 JPEG, 200 KB each)
    const id = Number(m[1]), st = b && REF_ST.includes(b.state) ? b.state : 'studied', note = b && nStr(b.note, 1500);
    if (!note || !note.trim()) return jres({ error: 'bad-request' }, 400);
    const list = Array.isArray(b.checklist) ? b.checklist.filter((x) => typeof x === 'string' && x.trim()).slice(0, 12).map((x) => ({ t: x.trim().slice(0, 200), c: null, th: [] })) : [];
    let n = 0;
    if (Array.isArray(b.stills) && env.REELS) for (const x of b.stills.slice(0, 8)) {
      try { const bin = Uint8Array.from(atob(String(x).replace(/^data:image\/jpeg;base64,/, '')), (c) => c.charCodeAt(0));
        if (bin.length <= 200 * 1024 && bin[0] === 0xff && bin[1] === 0xd8) { n++; await env.REELS.put(`refs/${id}-still-${n}.jpg`, bin, { httpMetadata: { contentType: 'image/jpeg' } }); } } catch { /* skip this still */ }
    }
    const old0 = await db.prepare('SELECT checklist FROM owner_refs WHERE id = ?1').bind(id).first();
    const keep = old0 && jparse(old0.checklist).length ? null : JSON.stringify(list);   // a checklist the owner already marked is never replaced
    const r = await db.prepare('UPDATE owner_refs SET state = ?2, reply = ?3, done_at = ?4, checklist = COALESCE(?5, checklist), stills = CASE WHEN ?6 > 0 THEN ?6 ELSE stills END WHERE id = ?1').bind(id, st, note.trim(), now, keep, n).run();
    return jres({ ok: true, stored: !!(r.meta && r.meta.changes), stills: n, items: list.length });
  }
  if (m && (m[2] === '/check' || m[2] === '/thread')) {   // the owner marks a line Keep / Skip / Ask; Ask opens a short thread; Claude answers in it (who: claude)
    const id = Number(m[1]), i = Number(b && b.item), row = await db.prepare('SELECT checklist FROM owner_refs WHERE id = ?1').bind(id).first(), list = row ? jparse(row.checklist) : [];
    if (!row || !Number.isInteger(i) || !list[i]) return jres({ error: 'bad-request' }, 400);
    if (m[2] === '/check') { const c = b.choice === null ? null : ['keep', 'skip', 'ask'].includes(b.choice) ? b.choice : undefined; if (c === undefined) return jres({ error: 'bad-request' }, 400); list[i].c = c; }
    else { const t = nStr(b.text, 500), who = b.who === 'claude' ? 'claude' : 'owner'; if (!t || !t.trim()) return jres({ error: 'bad-request' }, 400);
      list[i].th = (list[i].th || []).concat([{ w: who, t: t.trim(), at: now }]).slice(-30); if (who === 'owner') list[i].c = 'ask'; }
    await db.prepare('UPDATE owner_refs SET checklist = ?2 WHERE id = ?1').bind(id, JSON.stringify(list)).run();
    return jres({ ok: true, item: list[i] });
  }
  if (m && m[2] === '/close') {   // the owner closes it: the video is deleted from R2 the same day; the report, stills and checklist stay
    const id = Number(m[1]), r = await db.prepare('SELECT file_key, file_type, upload_id FROM owner_refs WHERE id = ?1').bind(id).first();
    if (!r) return jres({ ok: true, stored: false });
    let gone = false;
    if (r.file_key && /^video\//.test(r.file_type || '') && env.REELS) {
      if (r.upload_id) { try { await env.REELS.resumeMultipartUpload(r.file_key, r.upload_id).abort(); } catch { /* none */ } }
      try { await env.REELS.delete(r.file_key); gone = true; } catch { return jres({ error: 'store-failed' }, 502); }   // not closed until the video is really gone
    }
    await db.prepare(`UPDATE owner_refs SET closed_at = ?2, upload_id = NULL${gone ? ', file_key = NULL' : ''}, state = CASE WHEN state = 'uploading' THEN 'new' ELSE state END WHERE id = ?1`).bind(id, now).run();
    return jres({ ok: true, stored: true, videoDeleted: gone });
  }
  if (m && m[2] === '/state') {   // a Claude run: studied / used, with a short note the app shows
    const st = b && REF_ST.includes(b.state) ? b.state : null, note = b && nStr(b.note, 500);
    if (!st || !note || !note.trim()) return jres({ error: 'bad-request' }, 400);
    const r = await db.prepare('UPDATE owner_refs SET state = ?2, reply = ?3, done_at = ?4 WHERE id = ?1').bind(Number(m[1]), st, note.trim(), now).run();
    return jres({ ok: true, stored: !!(r.meta && r.meta.changes) });
  }
  if (m && m[2] === '/delete') {   // the owner removes one: the row and its file
    const r = await db.prepare('SELECT file_key FROM owner_refs WHERE id = ?1').bind(Number(m[1])).first();
    if (!r) return jres({ ok: true, stored: false });
    if (r.file_key && env.REELS) { try { await env.REELS.delete(r.file_key); } catch { /* the row still goes */ } }
    await db.prepare('DELETE FROM owner_refs WHERE id = ?1').bind(Number(m[1])).run();
    return jres({ ok: true, stored: true });
  }
  return jres({ error: 'bad-request' }, 400);
}

// ---- Probe log (owner, 26 Nov 2026): the studio probe (design/probe.md) appends one line per check, so the next check and the weekly tune can read
// the week without a repo push per check. Auth is STAGE_KEY (header X-Stage-Key), like POST /api/stage. POST {found, acted, what, keys?, at?};
// GET ?hours=N (default 24, at most 840) gives the rows oldest first. `keys` = the action keys the check handled (the status sheet skips those for 6 h).
let probeReady = null;
async function probeApi(request, env, url) {
  if (!env.DB) return jres({ error: 'no-db' }, 501);
  try { probeReady = probeReady || env.DB.exec('CREATE TABLE IF NOT EXISTS probe_log (id INTEGER PRIMARY KEY AUTOINCREMENT, at TEXT NOT NULL, found TEXT NOT NULL, acted INTEGER NOT NULL DEFAULT 0, what TEXT, keys TEXT)').catch((e) => { probeReady = null; throw e; }); await probeReady; } catch { return jres({ error: 'db-unavailable' }, 503); }
  if (request.method === 'GET') {
    const hours = Math.max(1, Math.min(840, Number(url.searchParams.get('hours')) || 24)), since = new Date(Date.now() - hours * 3600e3).toISOString();
    const { results } = await env.DB.prepare('SELECT id, at, found, acted, what, keys FROM probe_log WHERE at >= ?1 ORDER BY at, id LIMIT 2000').bind(since).all();
    return jres({ rows: (results || []).map((r) => ({ id: r.id, at: r.at, found: r.found, acted: !!r.acted, what: r.what || '', keys: r.keys ? r.keys.split(',') : [] })) });
  }
  if (request.method === 'POST') {
    let b = null; try { b = await request.json(); } catch { /* below */ }
    const found = b && nStr(b.found, 200);
    if (!found) return jres({ error: 'bad-request' }, 400);
    const at = b.at && !isNaN(Date.parse(b.at)) ? new Date(b.at).toISOString() : new Date().toISOString();
    const keys = Array.isArray(b.keys) ? b.keys.map((k) => String(k).replace(/[^A-Za-z0-9:_.-]/g, '').slice(0, 80)).filter(Boolean).slice(0, 12).join(',') : '';
    await env.DB.prepare('INSERT INTO probe_log (at, found, acted, what, keys) VALUES (?1, ?2, ?3, ?4, ?5)').bind(at, found, b.acted ? 1 : 0, nStr(b.what, 300) || null, keys || null).run();
    await env.DB.prepare('DELETE FROM probe_log WHERE at < ?1').bind(new Date(Date.now() - 45 * 864e5).toISOString()).run();
    return jres({ ok: true });
  }
  return jres({ error: 'bad-request' }, 400);
}

// ---- Live studio board (owner, 24 Nov 2026): sessions and workflows tell the app which stage each channel's reel of today is in, with
// POST /api/stage {reel, stage, model, line, pct, thumb?}. Auth is the secret STAGE_KEY as the header X-Stage-Key (workflows), or Authorization: Bearer <STAGE_KEY or REELS_READ_KEY>
// (sessions: one network secret per host; 26 Nov 2026); unset or empty secret = off). `reel` is a reel name or a channel (web / tech / c3), as early as the
// research, before the reel has a name. The app reads GET /api/stage (signed in): today's rows, newest first. Render % still comes from /api/journey.
// thumb = a small JPEG as base64 (at most 200 KB), kept in R2 under stage/ and shown on the card.
const STAGE_IDS = ['researching', 'topic', 'building', 'stills', 'video', 'checking', 'ready', 'skipped', 'posted', 'failed'],   // failed (task 13, 27 Nov 2026): the line starts with the step that failed ("building: no access to the repo")
      STAGE_THUMB_MAX = 200 * 1024;
let stageReady = null;
async function stageDb(env) {
  if (!env.DB) return null;
  stageReady = stageReady || env.DB.exec('CREATE TABLE IF NOT EXISTS studio_stage (reel TEXT PRIMARY KEY, ch TEXT NOT NULL, day TEXT NOT NULL, stage TEXT NOT NULL, model TEXT, line TEXT, pct INTEGER, thumb INTEGER NOT NULL DEFAULT 0, at TEXT NOT NULL)')
    .catch((e) => { stageReady = null; throw e; });
  await stageReady;
  return env.DB;
}
async function stageKeyOk(request, env) {
  // two ways in (owner, 26 Nov 2026: a session environment holds ONE network secret per host, so sessions send Authorization: Bearer <key>):
  // the header X-Stage-Key (workflows) or Authorization: Bearer matching STAGE_KEY or REELS_READ_KEY. Unset or empty secrets open nothing.
  const clean = (v) => (typeof v === 'string' ? v.trim() : ''), key = clean(env.STAGE_KEY), rk = clean(env.REELS_READ_KEY), got = (request.headers.get('X-Stage-Key') || '').trim();
  const m = /^Bearer\s+(\S+)\s*$/i.exec(request.headers.get('Authorization') || ''), bearer = m ? m[1] : '';
  let ok = false;
  if (key && got && (await safeEqual(got, key))) ok = true;
  if (key && bearer && (await safeEqual(bearer, key))) ok = true;
  if (rk && bearer && (await safeEqual(bearer, rk))) ok = true;
  return ok;
}
const istDayNow = () => new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 10);
const stageKey = (reel) => String(reel).replace(/[^a-z0-9-]/g, '');
async function stageApi(request, env, p, ctx) {
  let db;
  try { db = await stageDb(env); } catch { return jres({ error: 'db-unavailable' }, 503); }
  if (!db) return jres({ error: 'no-db' }, 501);
  if (request.method === 'GET' && p === '/api/stage') {
    const { results } = await db.prepare("SELECT reel, ch, day, stage, model, line, pct, thumb, at FROM studio_stage WHERE day = ?1 AND ch <> 'project' ORDER BY at DESC LIMIT 12").bind(istDayNow()).all();
    return jres({ day: istDayNow(), rows: (results || []).map((r) => ({ reel: r.reel, ch: r.ch, stage: r.stage, model: r.model, line: r.line, pct: r.pct, thumb: r.thumb ? `/api/stage/thumb/${r.reel}` : null, at: r.at })) });
  }
  const th = /^\/api\/stage\/thumb\/([a-z0-9-]{1,80})$/.exec(p);
  if (request.method === 'GET' && th) {
    if (!env.REELS) return jres({ error: 'no-store' }, 503);
    const o = await env.REELS.get(`stage/${th[1]}.jpg`);
    if (!o) return jres({ error: 'not-found' }, 404);
    return new Response(o.body, { headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' } });
  }
  if (request.method === 'POST' && p === '/api/stage') {
    let b = null; try { b = await request.json(); } catch { /* handled below */ }
    const raw = b && typeof b.reel === 'string' ? b.reel.trim().toLowerCase() : '', pj = /^project:([a-z0-9-]{1,40})$/.exec(raw);   // project:<id> (owner, 26 Nov 2026): a project row
    const reel = pj ? 'project-' + pj[1] : stageKey(raw);
    if (pj ? !PROJECT_STAGES.includes(b.stage) : (!reel || reel.length > 80 || !STAGE_IDS.includes(b.stage))) return jres({ error: 'bad-request', stages: pj ? PROJECT_STAGES : STAGE_IDS }, 400);
    const ch = pj ? 'project' : ['web', 'tech', 'c3'].includes(reel) ? reel : chOfReel(reel, null);
    const pct = Number.isFinite(Number(b.pct)) && b.pct !== null && b.pct !== '' ? Math.max(0, Math.min(100, Math.round(Number(b.pct)))) : null;
    const model = nStr(b.model, 40), line = nStr(b.line, 140);
    let thumb = 0;
    if (typeof b.thumb === 'string' && b.thumb.length > 20 && env.REELS) {
      try { const bin = Uint8Array.from(atob(b.thumb.replace(/^data:image\/jpeg;base64,/, '')), (c) => c.charCodeAt(0));
        if (bin.length <= STAGE_THUMB_MAX && bin[0] === 0xff && bin[1] === 0xd8) { await env.REELS.put(`stage/${reel}.jpg`, bin, { httpMetadata: { contentType: 'image/jpeg' } }); thumb = 1; }
      } catch { /* no thumbnail */ }
    }
    const day = istDayNow();
    // a stage line without a new thumb keeps the one already stored for this reel today
    await db.prepare('INSERT INTO studio_stage (reel, ch, day, stage, model, line, pct, thumb, at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9) ON CONFLICT(reel) DO UPDATE SET ch = excluded.ch, stage = excluded.stage, model = excluded.model, line = excluded.line, pct = excluded.pct, at = excluded.at, thumb = CASE WHEN excluded.thumb = 1 THEN 1 WHEN studio_stage.day = excluded.day THEN studio_stage.thumb ELSE 0 END, day = excluded.day')
      .bind(reel, ch, day, b.stage, model || null, line || null, pct, thumb, new Date().toISOString()).run();
    return jres({ ok: true, reel, ch, stage: b.stage });
  }
  return jres({ error: 'bad-request' }, 400);
}

// ---- Projects (owner, 26 Nov 2026): work that is not a channel reel (the 3D kit, an app fix) gets a row on the Today board. Its session keeps
// design/projects.json up to date in the same push as the work; this reads that file from main (no site access needed, so the second account can
// report too) and merges any newer `node scripts/stage.mjs project:<id> <stage>` row (D1 studio_stage, ch 'project'). The newer of the two wins.
// A done project leaves the board 2 days after its last update. GET /api/projects (signed in): { projects: [{ id, name, account, stage, line, pct, updatedAt, history }] }
const PROJECT_STAGES = ['planned', 'building', 'stills', 'render', 'checking', 'critic', 'done', 'waiting', 'failed'];
const PROJECTS_RAW = 'https://raw.githubusercontent.com/imshekharsingh/aquariit-templates/main/design/projects.json', PROJECTS_TTL = 120;
async function projectsApi(request, env, fetchFile = fetch) {
  if (request.method !== 'GET') return jres({ error: 'bad-request' }, 400);
  let list = [];
  try { const r = await fetchFile(PROJECTS_RAW, { cf: { cacheTtl: PROJECTS_TTL, cacheEverything: true } }); if (r.ok) { const j = await r.json(); if (Array.isArray(j.projects)) list = j.projects; } } catch { /* the file is not reachable: the D1 rows only */ }
  let rows = [];
  try { const db = await stageDb(env); if (db) rows = (await db.prepare("SELECT reel, stage, line, pct, at FROM studio_stage WHERE ch = 'project' ORDER BY at DESC LIMIT 40").all()).results || []; } catch { /* no rows */ }
  const ok = (st) => PROJECT_STAGES.includes(st), by = new Map();
  for (const x of list) {
    if (!x || typeof x.id !== 'string' || !/^[a-z0-9-]{1,40}$/.test(x.id) || !ok(x.stage)) continue;
    by.set(x.id, { id: x.id, name: nStr(x.name, 80) || x.id, account: x.account === 'main' ? 'main' : 'other', stage: x.stage, line: nStr(x.line, 160) || '',
      pct: Number.isFinite(x.pct) ? Math.max(0, Math.min(100, Math.round(x.pct))) : null, updatedAt: typeof x.updatedAt === 'string' ? x.updatedAt : null,
      history: (Array.isArray(x.history) ? x.history : []).filter((h) => h && ok(h.stage)).slice(-20).map((h) => ({ at: typeof h.at === 'string' ? h.at : null, stage: h.stage, line: nStr(h.line, 160) || '' })) });
  }
  for (const r of rows) {
    const id = String(r.reel).replace(/^project-/, ''); if (!ok(r.stage)) continue;
    const p = by.get(id) || { id, name: id, account: 'main', stage: r.stage, line: '', pct: null, updatedAt: null, history: [] };
    if (!p.updatedAt || Date.parse(r.at) > Date.parse(p.updatedAt)) {
      p.stage = r.stage; p.line = r.line || p.line; p.pct = r.pct ?? null; p.updatedAt = r.at;
      p.history = p.history.concat([{ at: r.at, stage: r.stage, line: r.line || '' }]).slice(-20);
    }
    by.set(id, p);
  }
  const now = Date.now();
  const out = [...by.values()].filter((p) => !(p.stage === 'done' && p.updatedAt && now - Date.parse(p.updatedAt) > 2 * 864e5));
  return new Response(JSON.stringify({ projects: out }), { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
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
  if (p === '/api/push/plan' && request.method === 'GET') {   // today's plan in plain words (Settings > Notifications, task 6)
    const day = istParts(Date.now()).day;
    return jres({ day, lines: planToday(day, SLOT_CONFIG.slots || {}, SLOT_CONFIG.tests || {}, NOTIFY_POLICY) });
  }
  if (p === '/api/push/prefs') {   // one switch per notification type (all on until switched off)
    const d = await notifyDb(env);
    if (request.method === 'PUT') {
      let b = null; try { b = await request.json(); } catch { /* handled below */ }
      if (!b || !NOTIFY_TYPES.includes(b.type) || typeof b.on !== 'boolean') return jres({ error: 'bad-request' }, 400);
      await d.prepare('INSERT INTO push_prefs (type, on_) VALUES (?1, ?2) ON CONFLICT(type) DO UPDATE SET on_ = excluded.on_').bind(b.type, b.on ? 1 : 0).run();
    }
    return jres({ prefs: await notifyPrefs(d) });
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
    const status = await sendPush({ endpoint: ep, keys: k }, { title: 'Notifications are on', body: 'You will get a reminder when each reel is ready to post, and the Tuesday 9 PM spare-usage reminder.', url: '/' }, env, 600).catch(() => 0);
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
// The crons fire 10 minutes before each slot ("20 7 * * *" UTC = 12:50 IST, the one slot for every channel from 8 Nov 2026) and sends "Post now: <title>" for each
// reel due then and not marked uploaded; the tap opens /#reel=<name> (the app scrolls to it, opens and highlights it). Each send is logged in D1.
// The same slot rule lives in templates/index.html and scripts/check.mjs (which also checks every postAt has a cron).
const CH_NAME = { web: '@webin20sec', tech: '@techin20sec', c3: '@itturns.out' };
export function postSlot(name, m) {
  if (m && /^\d{2}:\d{2}$/.test(m.postAt || '')) return m.postAt;
  const ch = m && CH_NAME[m.channel] ? m.channel : /^showreel-(tech-|t\d)/.test(name) ? 'tech' : /^showreel-c3-/.test(name) ? 'c3' : 'web';
  return (SLOT_CONFIG.slots && SLOT_CONFIG.slots[ch]) || '13:00';   // design/slots.json (25 Nov 2026): tech 15:00, Turns Out 17:00, web 19:00
}
const chOfReel = (name, m) => (m && CH_NAME[m.channel] ? m.channel : /^showreel-(tech-|t\d)/.test(name) ? 'tech' : /^showreel-c3-/.test(name) ? 'c3' : 'web');
const hookLine = (c) => String(c || '').split('\n')[0].replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}️]/gu, '').trim();
async function reelTitle(env, name, m) {
  let t = hookLine(m.caption);
  if (!t && env.REELS) { try { const o = await env.REELS.get('c/' + name + '.json'); if (o) t = hookLine((await o.json()).caption); } catch { /* fall back */ } }
  if (!t && m.concept) t = String(m.concept).split(' · ').pop();
  return t || name.replace(/^showreel-(tech-|c3-|t\d+-)?(\d+-)?/, '').replace(/-/g, ' ');
}
const CH_SHORT = { web: 'Web', tech: 'Tech', c3: 'Turns Out' };
export function postPayload(name, m, title) {
  return { title: `${CH_SHORT[chOfReel(name, m)]} reel is ready to post`, body: `${title} · ${postSlot(name, m)} IST. Tap to open it.`, url: '/#reel=' + name, tag: 'ready-' + name };
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
// ---- Notifications (owner, 25 Nov 2026): at a reel's slot "<Channel> reel is ready to post"; 45 min later one gentle nudge; 20:30 IST one last call; "Posted ✓" with
// the link and the plain reason on a failure (both sent when Post now reports them); 08:00 IST one morning summary. One switch per type (D1 push_prefs; all on
// until switched off). Every send has a key in D1 notif_log, written first, so a type is never sent twice for the same reel (1 nudge and 1 last call at most).
// The cron "*/2 * * * *" runs the plan in src/notify.js (design/notify-policy.json); a reel the second look has not cleared gets no "ready" push (it shows in the morning summary instead).
async function notifyDb(env) {
  const db = await postDb(env);
  if (!db) return null;
  await db.batch([db.prepare('CREATE TABLE IF NOT EXISTS push_prefs (type TEXT PRIMARY KEY, on_ INTEGER NOT NULL)'),
    db.prepare('CREATE TABLE IF NOT EXISTS notif_log (key TEXT PRIMARY KEY, at TEXT NOT NULL, type TEXT, sent INTEGER, failed INTEGER)')]);
  return db;
}
async function notifyPrefs(db) {
  const o = Object.fromEntries(NOTIFY_TYPES.map((t) => [t, true]));
  for (const r of ((await db.prepare('SELECT type, on_ FROM push_prefs').all().catch(() => ({}))).results || [])) if (r.type in o) o[r.type] = !!r.on_;
  return o;
}
// send one notification to every device unless its switch is off or its key was already used; returns { skipped } or { sent, failed }
async function sendType(env, db, type, key, payload) {
  if (!(await notifyPrefs(db))[type]) return { skipped: 'off' };
  if (!env.VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_KEY) return { skipped: 'no-keys' };
  const claim = await db.prepare('INSERT OR IGNORE INTO notif_log (key, at, type, sent, failed) VALUES (?1, ?2, ?3, 0, 0)').bind(key, new Date().toISOString(), type).run();
  if (!claim || !claim.meta || claim.meta.changes !== 1) return { skipped: 'already-sent' };
  const { results } = await db.prepare('SELECT endpoint, p256dh, auth FROM push_subs').all();
  let sent = 0, failed = 0;
  for (const r of results || []) {
    const status = await sendPush({ endpoint: r.endpoint, keys: { p256dh: r.p256dh, auth: r.auth } }, { ...payload, tag: payload.tag || type }, env).catch(() => 0);
    if (status === 404 || status === 410) { failed++; await db.prepare('DELETE FROM push_subs WHERE endpoint = ?1').bind(r.endpoint).run(); }
    else if (status >= 200 && status < 300) sent++;
    else failed++;
  }
  await db.prepare('UPDATE notif_log SET sent = ?2, failed = ?3 WHERE key = ?1').bind(key, sent, failed).run().catch(() => {});
  return { sent, failed };
}
async function readyMap(env) {   // reel name -> true when the second look cleared it, 'blocked' when a stage failed; empty when the journey cannot be read
  const out = {};
  try { const j = await (await journeyFast(env, null)).json();
    for (const r of (j && j.reels) || []) { const st = r.stages || {}; out[r.name] = st.ready && st.ready.s === 'done' ? true : Object.values(st).some((x) => x && x.s === 'fail') ? 'blocked' : false; } } catch { /* fail open below */ }
  return out;
}
async function digestPayload(env, db, caps, day, ready) {
  const rows = Object.entries(caps).filter(([, m]) => m && !m.hidden && !m.sample && m.postOn === day)
    .map(([n, m]) => ({ n, m, ch: chOfReel(n, m), at: postSlot(n, m) })).sort((a, b) => a.at.localeCompare(b.at));
  const lines = rows.map((r) => `${r.at} ${CH_SHORT[r.ch]}`);
  const missing = ['tech', 'c3', 'web'].filter((k) => !rows.some((r) => r.ch === k)).map((k) => `${CH_SHORT[k]}: nothing planned yet`);
  const blocked = rows.filter((r) => ready[r.n] === 'blocked').map((r) => `${CH_SHORT[r.ch]} needs a fix first`);
  const fails = ((await db.prepare("SELECT ch FROM ig_publish WHERE state = 'failed' AND at > ?1").bind(new Date(Date.now() - 864e5).toISOString()).all().catch(() => ({}))).results || []).map((r) => `${CH_SHORT[r.ch] || r.ch}: the last post did not go through`);
  const stuck = [...blocked, ...fails];
  return { title: 'Today’s reels', body: (lines.length ? lines.join(' · ') : 'No reel is planned yet') + '. ' + (stuck.length ? 'Blocked: ' + stuck.join('; ') + '.' : 'Nothing is blocked.') + (missing.length && lines.length ? ' ' + missing.join('. ') + '.' : ''), url: '/', tag: 'digest-' + day };
}
async function notifyTick(env, now = Date.now()) {
  const db = await notifyDb(env);
  if (!db) return { sent: 0 };
  const caps = await captionsOf(env), up = new Set(((await db.prepare('SELECT id FROM reel_uploaded').all().catch(() => ({}))).results || []).map((r) => r.id));
  const day = istParts(now).day, tests = SLOT_CONFIG.tests || {}, upAt = {};
  for (const r of ((await db.prepare('SELECT id, at FROM reel_uploaded').all().catch(() => ({}))).results || [])) upAt[r.id] = Date.parse(r.at);
  const base = Object.entries(caps).filter(([, m]) => m && !m.hidden && !m.sample && m.postOn === day)
    .map(([n, m]) => ({ name: n, m, ch: chOfReel(n, m), day: m.postOn, due: Date.parse(`${m.postOn}T${postSlot(n, m)}:00+05:30`), posted: up.has(n), postedAt: upAt[n] || null }));
  // the timer runs every 2 minutes: the journey (who the second look cleared) is read only when a reel push is actually due
  const pre = plan(now, base.map((r) => ({ ...r, ready: true })), tests), ready = pre.some((x) => x.reel && x.type !== 'logged') ? await readyMap(env) : {};
  const reels = base.map((r) => ({ ...r, ready: ready[r.name] === undefined ? true : ready[r.name] === true }));
  const out = [];
  for (const x of plan(now, reels, tests)) {
    let payload;
    if (x.type === 'digest') payload = await digestPayload(env, db, caps, day, ready);
    else { const r = reels.find((q) => q.name === x.reel), title = await reelTitle(env, r.name, r.m), ch = CH_SHORT[chOfReel(r.name, r.m)], url = '/#reel=' + r.name;
      // words from design/notify-policy.json (the regular plan, or the slot-test plan on a test day)
      const P = x.test ? NOTIFY_POLICY.test : NOTIFY_POLICY.regular, line = P[x.type] || NOTIFY_POLICY.regular[x.type] || {};
      const v = { ch, title, slot: postSlot(r.name, r.m), n: x.test && x.test.n, days: x.test && x.test.days,
        time: r.postedAt ? new Date(r.postedAt + IST_MS).toISOString().slice(11, 16) : '', ontime: x.onTime ? 'on time, it counts' : 'late, the test day is weakened' };
      payload = x.type === 'ready' && !x.test ? postPayload(r.name, r.m, title) : { title: fill(line.title, v), body: fill(line.body, v), url, tag: x.type + '-' + r.name }; }
    out.push({ type: x.type, reel: x.reel, ...(await sendType(env, db, x.type, x.key, payload)) });
  }
  await db.prepare('DELETE FROM notif_log WHERE at < ?1').bind(new Date(now - 14 * DAY_MS).toISOString()).run().catch(() => {});
  return out;
}
// Post now reports back: "Posted ✓" with the link, or the plain reason
async function notifyPostResult(env, db, reel, state, row) {
  try {
    await notifyDb(env);
    const caps = await captionsOf(env).catch(() => ({})), m = caps[reel] || {}, ch = CH_SHORT[chOfReel(reel, m)], title = await reelTitle(env, reel, m);
    if (state === 'posted') return await sendType(env, db, 'posted', 'posted:' + reel, { title: 'Posted ✓', body: `${ch}: ${title}`, url: row.permalink || '/#reel=' + reel, tag: 'posted-' + reel });
    if (state === 'failed') return await sendType(env, db, 'failed', 'failed:' + reel + ':' + row.started, { title: `${ch} reel did not post`, body: String(row.error || 'Something went wrong.').slice(0, 160) + ' Tap to try again.', url: '/#reel=' + reel, tag: 'failed-' + reel });
  } catch { /* a missing notification never breaks posting */ }
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
  try { r = cron === SPARE_CRON ? await sparePush(env) : await notifyTick(env, scheduled || Date.now()); } catch (e) { r = { error: String(e && e.message || e) }; }
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

// GET /api/journey (owner, 15 Nov 2026): every scheduled reel's stages, planned to posted (src/journey.js). Posted comes from Mark posted / the
// collector's marks (reel_uploaded) and the collector's caption match (ig_media.template_id). Every source is optional: what is missing shows as waiting.
// stale-while-revalidate (owner, 21 Nov 2026: "Journey takes time in populating, why?"): building the journey asks GitHub for the run
// lists, each reel's jobs and review files (several round trips, 3-8 s on a cold minute). The last answer is kept in this data centre's
// cache for a day and served at once; when it is over 60 s old a fresh one is built in the background for the next open.
const J_FRESH = 60e3, J_STALE = 300e3;
// Owner, 26 Nov 2026: the board froze at 00:48 IST for ~10 h. The answer lived only in this data centre's Cache API, and every cache failure was
// swallowed (a put that threw left the 00:48 copy in place with nothing saying so). Now the answer lives in D1 (one row, the same for every phone and
// data centre) with its build time, and a failed build records WHY (note, time, count) next to it. Every answer carries builtAt, buildMs, age, and
// error {note, at, n} while the last build failed (stale:true once over 5 minutes old), plus warn (swallowed GitHub / subrequest failures of the
// build). An answer over 5 minutes old is rebuilt in the request; 1-5 minutes old is served and rebuilt in the background.
let jReady = null;
async function journeyDb(env) {
  if (!env.DB) return null;
  jReady = jReady || env.DB.exec('CREATE TABLE IF NOT EXISTS journey_answer (id INTEGER PRIMARY KEY, body TEXT, built_at TEXT, build_ms INTEGER, err_note TEXT, err_at TEXT, err_n INTEGER NOT NULL DEFAULT 0)')
    .catch((e) => { jReady = null; throw e; });
  await jReady;
  return env.DB;
}
const jHead = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
async function journeyFast(env, ctx) {
  let db = null, dbNote = null;
  try { db = await journeyDb(env); } catch (e) { dbNote = 'journey store: ' + String(e && e.message || e).slice(0, 60); }
  const build = async () => {   // -> { j } on success, { fail: note } on failure; records the outcome in D1
    const t0 = Date.now(); let r, note = null;
    try { r = await journey(env); } catch (e) { r = null; note = String(e && e.message || e).slice(0, 100); }
    let j = null;
    if (r && r.ok) { try { j = await r.json(); } catch (e) { note = 'unreadable journey: ' + String(e && e.message || e).slice(0, 60); } }
    else if (r) { try { note = (await r.json()).note; } catch { /* plain */ } note = note || 'journey ' + r.status; }
    if (j) { j.builtAt = new Date().toISOString(); j.buildMs = Date.now() - t0;
      if (db) { try { await db.prepare('INSERT INTO journey_answer (id, body, built_at, build_ms, err_note, err_at, err_n) VALUES (1, ?1, ?2, ?3, NULL, NULL, 0) ON CONFLICT(id) DO UPDATE SET body = excluded.body, built_at = excluded.built_at, build_ms = excluded.build_ms, err_note = NULL, err_at = NULL, err_n = 0')
        .bind(JSON.stringify(j), j.builtAt, j.buildMs).run(); } catch (e) { j.warn = (j.warn || []).concat('save failed: ' + String(e && e.message || e).slice(0, 60)); } }
      return { j }; }
    if (db) { try { await db.prepare('INSERT INTO journey_answer (id, err_note, err_at, err_n) VALUES (1, ?1, ?2, 1) ON CONFLICT(id) DO UPDATE SET err_note = excluded.err_note, err_at = excluded.err_at, err_n = journey_answer.err_n + 1')
      .bind(note, new Date().toISOString()).run(); } catch { /* the response still carries the note */ } }
    return { fail: note }; };
  const send = (j, status, age) => new Response(JSON.stringify(j), { status, headers: { ...jHead, 'X-Journey-Age': String(age) } });
  let row = null;
  if (db) { try { row = await db.prepare('SELECT body, built_at, build_ms, err_note, err_at, err_n FROM journey_answer WHERE id = 1').first(); } catch (e) { dbNote = 'journey store: ' + String(e && e.message || e).slice(0, 60); } }
  let old = null; try { old = row && row.body ? JSON.parse(row.body) : null; } catch { /* rebuild */ }
  const age = old && row.built_at ? Date.now() - Date.parse(row.built_at) : Infinity;
  if (old && age <= J_STALE) {
    if (age > J_FRESH && ctx) ctx.waitUntil(build().catch(() => {}));
    old.age = Math.round(age / 1000); if (row.err_note) old.error = { note: row.err_note, at: row.err_at, n: row.err_n };
    return send(old, 200, old.age);
  }
  const res = await build();
  if (res.j) { res.j.age = 0; return send(res.j, 200, 0); }
  const error = { note: res.fail || dbNote || 'build failed', at: new Date().toISOString(), n: (row && row.err_n || 0) + 1 };
  if (old) { old.stale = true; old.age = Math.round(age / 1000); old.error = error; return send(old, 200, old.age); }
  return send({ error: 'journey-failed', note: error.note, at: error.at }, 500, 0);
}
async function journey(env) {
  let captions = {}, uploaded = {}, media = {};
  try { captions = await captionsOf(env); } catch { /* empty journey */ }
  if (env.DB) {
    try { uploaded = Object.fromEntries(((await env.DB.prepare('SELECT id, at FROM reel_uploaded').all()).results || []).map((r) => [r.id, r.at])); } catch { /* none yet */ }
    try { for (const r of (await env.DB.prepare('SELECT template_id, permalink, posted_at FROM ig_media WHERE template_id IS NOT NULL ORDER BY posted_at').all()).results || []) media[r.template_id] = r; } catch { /* none yet */ }
  }
  try { return jres(await journeyApi(env, { captions, postSlot, chOf: chOfReel, uploaded, media })); }
  catch (e) { return jres({ error: 'journey-failed', note: String(e && e.message || e).slice(0, 80) }, 500); }
}

// reel media (owner, 3 Nov 2026) live in the PRIVATE R2 bucket "aquarii-reels" (binding REELS; scripts/r2.sh), served only to signed-in users.
// The repo is public, so nothing goes to the GitHub releases any more. v/<name> = MP4 and review PNG (an R2 lifecycle rule deletes them
// 15 days after upload), c/<name> = cover, config json and the minutes meter (kept). Range requests are answered so phones can seek.
// /api/showreels lists a reel while its MP4 or its cover is there: after 15 days only the cover (and the post text) remain.
const REEL = /^\/reels\/((?:study\/)?showreel-[a-z0-9-]{1,60}\.(?:mp4|jpg|json|png))$/;   // study/: the Showreel workflow's short previews (21 Nov 2026), opened by link
const TYPES = { mp4: 'video/mp4', jpg: 'image/jpeg', json: 'application/json; charset=utf-8', png: 'image/png' };
const reelKey = (name) => (/\.(mp4|png)$/.test(name) ? 'v/' : 'c/') + name;
async function listAll(bucket, prefix) {
  const out = [];
  let cursor;
  do { const r = await bucket.list({ prefix, delimiter: '/', cursor, limit: 1000 }); out.push(...r.objects); cursor = r.truncated ? r.cursor : undefined; } while (cursor);
  return out;
}
// Tests (task 14, owner 27 Nov 2026: test renders were invisible): every video under study/ (previews, tests, kit samples) for the app's Tests list,
// newest first, with its date and cover (study/<name>-cover-auto.jpg when the R2 workflow made one). Never posted, never counted as a reel.
async function testsList(env) {
  if (!env.REELS) return jres({ error: 'no-store' }, 503);
  const [v, c] = await Promise.all([listAll(env.REELS, 'v/study/'), listAll(env.REELS, 'c/study/')]);
  const covers = new Map(c.map((o) => [o.key.slice(8), o]));
  const url = (o) => `/reels/${o.key.slice(2)}?v=${o.uploaded.getTime()}`;
  const tests = v.filter((o) => /^v\/study\/showreel-[a-z0-9-]{1,60}\.mp4$/.test(o.key)).map((o) => { const base = o.key.slice(8, -4), cv = covers.get(base + '-cover-auto.jpg') || covers.get(base + '-cover.jpg');
    return { name: base, video: url(o), cover: cv ? url(cv) : null, at: o.uploaded.toISOString(), mb: Math.round(o.size / 1048576 * 10) / 10 }; })
    .sort((x, y) => (x.at < y.at ? 1 : -1)).slice(0, 60);
  return jres({ tests });
}
// ---- the app's build (task 19, owner 27 Nov 2026: the installed app hung on an old copy all afternoon): a short fingerprint of the deployed
// index.html. The page is served with it written in (__APP_BUILD__), and GET /api/version returns it; the app compares the two on open and on
// resume and reloads once when they differ (templates/index.html "fresh").
let BUILD = null;
async function buildOf(text) { const h = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))); return [...h.slice(0, 6)].map((b) => b.toString(16).padStart(2, '0')).join(''); }
async function appVersion(env) { if (!BUILD) { const r = await env.ASSETS.fetch(new Request('https://assets.local/')); BUILD = await buildOf(await r.text()); } return BUILD; }
async function appPage(request, env) {
  const r = await env.ASSETS.fetch(request);
  if (!r.ok || !(r.headers.get('Content-Type') || '').includes('text/html')) return r;
  const text = await r.text(), v = await buildOf(text); BUILD = BUILD || v;
  const h = new Headers(r.headers); h.set('Cache-Control', 'no-cache'); h.delete('Content-Length'); h.delete('ETag');
  return new Response(text.replace('__APP_BUILD__', v), { status: r.status, headers: h });
}
async function showreelList(env) {
  if (!env.REELS) return jres({ error: 'no-store' }, 503);
  const [v, c] = await Promise.all([listAll(env.REELS, 'v/'), listAll(env.REELS, 'c/')]);
  const byName = new Map([...v, ...c].map((o) => [o.key.slice(2), o]));
  let first = {};   // original render times of reels copied from the old releases (R2 dates a copy with the day it was copied)
  try { const o = await env.REELS.get('c/rendered-at.json'); if (o) first = await o.json(); } catch { /* use the R2 dates */ }
  // <name>.mp4 is the full-quality file the app plays and "Save video" downloads (owner, 11 Nov 2026); <name>-play.mp4 (a 720p copy made
  // 6-11 Nov 2026) is only a fallback for a reel without its full file
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

// ---- One-tap "Post now" (owner, 24 Nov 2026): the owner taps Post now on a Ready-to-post reel; nothing ever posts by itself. POST /api/post {reel}
// dispatches the workflow ig-publish.yml through the GitHub API (secret GH_DISPATCH_TOKEN, a fine-grained token with Actions write on this repo
// only; unset = the button says it is not switched on). The Instagram tokens never leave GitHub: the workflow signs in to this site like the
// collector does, asks POST /api/post/sign for 1-hour signed links to the reel's MP4 and cover (/pub/<exp>/<sig>/<file>, one file each, GET/HEAD
// only; Instagram fetches them), publishes through graph.instagram.com and reports each stage with POST /api/post/status. One row per reel in D1
// ig_publish is the lock: a reel that is Posted is refused, a running one is not started twice (a run silent for 30 minutes counts as dead).
// When the workflow reports "posted" the reel is also marked Posted (reel_uploaded), the same as "I posted it".
const POST_REPO = 'imshekharsingh/aquariit-templates', POST_STALE_MS = 30 * 60e3, SIGN_TTL_S = 3600;
const POST_STATES = ['uploading', 'processing', 'publishing', 'posted', 'failed'], POST_LINE = { queued: 'Starting', uploading: 'Uploading', processing: 'Processing', publishing: 'Publishing', posted: 'Posted', failed: 'Failed' };
const POST_REEL = /^showreel-[a-z0-9-]{1,60}$/;
let postReady = null;
async function postDbOf(env) {
  if (!env.DB) return null;
  postReady = postReady || env.DB.exec('CREATE TABLE IF NOT EXISTS ig_publish (reel TEXT PRIMARY KEY, ch TEXT NOT NULL, state TEXT NOT NULL, line TEXT, error TEXT, media_id TEXT, permalink TEXT, at TEXT NOT NULL, started TEXT NOT NULL)')
    .catch((e) => { postReady = null; throw e; });
  await postReady;
  return env.DB;
}
async function signKey(env) {
  const a = accounts(env)[0];
  if (!a) return null;
  return crypto.subtle.importKey('raw', await crypto.subtle.digest('SHA-256', enc.encode(`${a.u}\n${a.p}\naquarii-post-sign-v1`)), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
}
const signFile = async (env, exp, file) => b64u(await crypto.subtle.sign('HMAC', await signKey(env), enc.encode(`${exp}.${file}`)));
// GET/HEAD /pub/<exp>/<sig>/<file>: a signed link to one reel file (mp4 or jpg), valid until exp (at most 2 h ahead)
async function pubFile(request, env, p) {
  const m = /^\/pub\/(\d{9,12})\/([\w-]{20,64})\/(showreel-[a-z0-9-]{1,60}\.(?:mp4|jpg))$/.exec(p), none = () => new Response('Not found', { status: 404, headers: noStore });
  if (!m || (request.method !== 'GET' && request.method !== 'HEAD') || !(await signKey(env))) return none();
  const exp = +m[1], now = Date.now() / 1000;
  if (exp < now || exp > now + 2 * SIGN_TTL_S || !(await safeEqual(m[2], await signFile(env, exp, m[3])))) return none();
  try { return (await reelFile(request, env, m[3])) || none(); } catch { return none(); }
}
const postRow = (r) => r && ({ reel: r.reel, ch: r.ch, state: r.state, line: r.line || POST_LINE[r.state] || r.state, error: r.error || null, permalink: r.permalink || null, at: r.at, started: r.started });
async function postApi(request, env, p) {
  let db;
  try { db = await postDbOf(env); } catch { return jres({ error: 'db-unavailable' }, 503); }
  if (!db) return jres({ error: 'no-db', message: 'Post now needs the app database, which is not connected.' }, 501);
  if (request.method === 'GET') {
    const m = /^\/api\/post\/(showreel-[a-z0-9-]{1,60})$/.exec(p);
    if (m) { const r = await db.prepare('SELECT * FROM ig_publish WHERE reel = ?1').bind(m[1]).first(); return jres({ row: postRow(r) }); }
    if (p === '/api/post') {
      const { results } = await db.prepare('SELECT * FROM ig_publish WHERE at > ?1 OR state NOT IN (\'posted\', \'failed\')').bind(new Date(Date.now() - 3 * 864e5).toISOString()).all();
      return jres({ rows: Object.fromEntries((results || []).map((r) => [r.reel, postRow(r)])) });
    }
    return jres({ error: 'not-found' }, 404);
  }
  if (request.method !== 'POST' || request.headers.get('X-Requested-With') !== 'reel') return jres({ error: 'forbidden' }, 403);
  let b = null; try { b = await request.json(); } catch { /* handled below */ }
  const reel = b && typeof b.reel === 'string' ? b.reel.trim() : '';
  if (!POST_REEL.test(reel)) return jres({ error: 'bad-request' }, 400);
  const now = new Date().toISOString();

  if (p === '/api/post') {   // start: every refusal is a plain sentence the app shows as it is
    const no = (error, message, status = 409) => jres({ error, message }, status);
    const token = typeof env.GH_DISPATCH_TOKEN === 'string' ? env.GH_DISPATCH_TOKEN.trim() : '';
    if (!token) return no('not-switched-on', 'Post now is not switched on yet. It needs a GitHub key and Instagram access added first.', 503);
    let caps = {}; try { caps = await captionsOf(env); } catch { /* handled below */ }
    const m = caps[reel];
    if (!m || m.hidden || m.sample) return no('not-found', 'This reel is not on the posting list.', 404);
    if (await db.prepare('SELECT id FROM reel_uploaded WHERE id = ?1').bind(reel).first()) return no('posted', 'This reel is already marked as posted.');
    if (!env.REELS || !(await env.REELS.head('v/' + reel + '.mp4'))) return no('no-video', 'The video file is not available any more (it is removed 15 days after it is made).');
    try { const j = await (await journeyFast(env, null)).json(), r = ((j && j.reels) || []).find((x) => x.name === reel);   // the second look must have said READY (when the journey can be read)
      if (j && j.stale) return no('status-old', 'The reel status is out of date, so it cannot be checked. Try again in a minute.');   // 26 Nov 2026
      if (r && !(r.stages && r.stages.ready && r.stages.ready.s === 'done')) return no('not-ready', 'This reel is not ready to post yet.'); } catch { /* the journey is optional */ }
    const ch = chOfReel(reel, m);
    const claim = await db.prepare('INSERT INTO ig_publish (reel, ch, state, line, error, media_id, permalink, at, started) VALUES (?1, ?2, \'queued\', \'Starting\', NULL, NULL, NULL, ?3, ?3) ON CONFLICT(reel) DO UPDATE SET state = \'queued\', line = \'Starting\', error = NULL, media_id = NULL, permalink = NULL, at = ?3, started = ?3 WHERE ig_publish.state = \'failed\' OR (ig_publish.state <> \'posted\' AND ig_publish.at < ?4)')
      .bind(reel, ch, now, new Date(Date.now() - POST_STALE_MS).toISOString()).run();
    if (!claim || !claim.meta || claim.meta.changes !== 1) { const r = await db.prepare('SELECT * FROM ig_publish WHERE reel = ?1').bind(reel).first();
      return jres({ error: r && r.state === 'posted' ? 'posted' : 'running', message: r && r.state === 'posted' ? 'This reel is already posted.' : 'This reel is already being posted.', row: postRow(r) }, 409); }
    let res = null;
    try { res = await fetch(`https://api.github.com/repos/${POST_REPO}/actions/workflows/ig-publish.yml/dispatches`, { method: 'POST',
      headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'User-Agent': 'studio-app', 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' },
      body: JSON.stringify({ ref: 'main', inputs: { reel, channel: ch } }) }); } catch { /* shown below */ }
    if (!res || res.status !== 204) {
      const why = !res ? 'GitHub did not answer.' : res.status === 401 || res.status === 403 || res.status === 404 ? 'GitHub refused the key that lets this button post. The key needs permission to start jobs on this repo.' : 'GitHub refused to start it (HTTP ' + res.status + ').';
      await db.prepare('UPDATE ig_publish SET state = \'failed\', line = \'Failed\', error = ?2, at = ?3 WHERE reel = ?1').bind(reel, why, new Date().toISOString()).run();
      await notifyPostResult(env, db, reel, 'failed', await db.prepare('SELECT * FROM ig_publish WHERE reel = ?1').bind(reel).first());
      return jres({ error: 'dispatch-failed', message: why, row: postRow(await db.prepare('SELECT * FROM ig_publish WHERE reel = ?1').bind(reel).first()) }, 502);
    }
    return jres({ ok: true, row: postRow(await db.prepare('SELECT * FROM ig_publish WHERE reel = ?1').bind(reel).first()) });
  }

  const row = await db.prepare('SELECT * FROM ig_publish WHERE reel = ?1').bind(reel).first();
  if (!row || row.state === 'posted' || row.state === 'failed') return jres({ error: 'not-running', message: 'No post is running for this reel.' }, 409);
  if (p === '/api/post/sign') {   // links for the workflow to hand to Instagram (a reel being posted only)
    const exp = Math.floor(Date.now() / 1000) + SIGN_TTL_S, origin = new URL(request.url).origin, link = async (f) => `${origin}/pub/${exp}/${await signFile(env, exp, f)}/${f}`;
    const cover = env.REELS && (await env.REELS.head('c/' + reel + '-cover.jpg')) ? await link(reel + '-cover.jpg') : null;
    return jres({ video: await link(reel + '.mp4'), cover, exp });
  }
  if (p === '/api/post/status') {
    const state = b.state, clip = (v, n) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, n) : null);
    if (!POST_STATES.includes(state)) return jres({ error: 'bad-request', states: POST_STATES }, 400);
    const permalink = clip(b.permalink, 300), at = new Date().toISOString();
    await db.prepare('UPDATE ig_publish SET state = ?2, line = ?3, error = ?4, media_id = COALESCE(?5, media_id), permalink = COALESCE(?6, permalink), at = ?7 WHERE reel = ?1')
      .bind(reel, state, clip(b.line, 120) || POST_LINE[state], state === 'failed' ? clip(b.error, 400) || 'Something went wrong.' : null, clip(b.media_id, 40), permalink && /^https:\/\/(www\.)?instagram\.com\//.test(permalink) ? permalink : null, at).run();
    if (state === 'posted') await db.prepare('INSERT INTO reel_uploaded (id, at) VALUES (?1, ?2) ON CONFLICT(id) DO UPDATE SET at = excluded.at').bind(reel, at).run();   // same as "I posted it"
    if (state === 'posted' || state === 'failed') await notifyPostResult(env, db, reel, state, await db.prepare('SELECT * FROM ig_publish WHERE reel = ?1').bind(reel).first());   // "Posted ✓" or the plain reason
    return jres({ ok: true });
  }
  return jres({ error: 'not-found' }, 404);
}

export { projectsApi };
export default {
  async scheduled(controller, env, ctx) { ctx.waitUntil(runCron(env, controller.cron, controller.scheduledTime)); },
  async fetch(request, env, ctx) {
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

    if (p.startsWith('/pub/')) return pubFile(request, env, p);   // signed single-file links for Instagram (Post now)
    if (PUBLIC(p)) return env.ASSETS.fetch(request); // manifest, service worker and icons must load without a session (PWA install)

    if (!configured) return new Response('Site is locked: authentication is not configured.', { status: 503, headers: noStore });
    const signedIn = await authed(request, env);
    if (p === '/api/probe-log') return (await stageKeyOk(request, env)) ? probeApi(request, env, url) : new Response('{"error":"unauthorized"}', { status: 401, headers: jsonHeaders });   // STAGE_KEY only
    if (p === '/api/stage' && request.method === 'POST') return (await stageKeyOk(request, env)) ? stageApi(request, env, p, ctx) : new Response('{"error":"unauthorized"}', { status: 401, headers: jsonHeaders });   // STAGE_KEY only
    if (p === '/api/slots' && request.method === 'GET') return signedIn ? jres({ slots: SLOT_CONFIG.slots, reviewOn: SLOT_CONFIG.reviewOn }) : new Response('{"error":"unauthorized"}', { status: 401, headers: jsonHeaders });
    if (p === '/api/version' && request.method === 'GET') return signedIn ? appVersion(env).then((v) => new Response(JSON.stringify({ v }), { headers: { 'Content-Type': 'application/json', ...noStore } })) : new Response('{"error":"unauthorized"}', { status: 401, headers: jsonHeaders });
    if (p.startsWith('/api/')) return signedIn ? (p === '/api/projects' ? projectsApi(request, env) : p.startsWith('/api/stage') ? stageApi(request, env, p, ctx) : (p === '/api/post' || p.startsWith('/api/post/')) ? postApi(request, env, p) : p.startsWith('/api/uploaded') ? uploadedApi(request, env, p) : p.startsWith('/api/perf') ? perfApi(request, env, p, url) : p.startsWith('/api/cards') ? cardsApi(request, env, p) : p.startsWith('/api/asks') ? asksApi(request, env, p, url) : p.startsWith('/api/feedback') ? feedbackApi(request, env, p, url) : p.startsWith('/api/refs') ? refsApi(request, env, p, url) : (p === '/api/spare' || p.startsWith('/api/push/')) ? spareApi(request, env, p, url) : p === '/api/showreels' ? showreelList(env) : p === '/api/tests' ? testsList(env) : p === '/api/journey' && request.method === 'GET' ? journeyFast(env, ctx) : jres({ error: 'not-found' }, 404)) : new Response('{"error":"unauthorized"}', { status: 401, headers: jsonHeaders });
    // Read-only reel key (owner, 23 Nov 2026): critic and review sessions fetch the final reel files with Authorization: Bearer <REELS_READ_KEY>.
    // It opens ONLY GET/HEAD of /reels/<file> from R2: no API, no app pages, no writes, no site-copy fallback. Unset or empty secret = off.
    if (!signedIn && (await readKeyOk(request, env))) {
      const m = (request.method === 'GET' || request.method === 'HEAD') && p.match(REEL);
      if (m) { try { const v = await reelFile(request, env, m[1]); if (v) return v; } catch { /* not found below */ } return new Response('Not found', { status: 404, headers: noStore }); }
    }
    if (signedIn && request.method === 'GET' && (p === '/' || p === '/index.html')) return appPage(request, env);   // task 19: the page carries its build, so an old copy knows it is old
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
