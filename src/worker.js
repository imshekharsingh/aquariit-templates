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
    if (await authed(request, env)) return env.ASSETS.fetch(request);

    const wantsPage = request.method === 'GET' && ((request.headers.get('Accept') || '').includes('text/html') || request.headers.get('Sec-Fetch-Mode') === 'navigate');
    if (wantsPage) return go(`/login?next=${encodeURIComponent(p + url.search)}`);
    return new Response('{"error":"unauthorized"}', { status: 401, headers: { 'Content-Type': 'application/json', ...noStore } }); // no WWW-Authenticate: never trigger the native popup
  },
};
