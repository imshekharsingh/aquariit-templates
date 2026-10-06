// Basic-auth gate in front of the static assets. Credentials live ONLY in Worker secrets
// (BASIC_AUTH_USER / BASIC_AUTH_PASS), never in the repo. Fails closed if they are missing.
const PUBLIC = (p) => p === '/manifest.webmanifest' || p.startsWith('/icons/'); // PWA install fetches these without credentials
const enc = new TextEncoder();

async function safeEqual(a, b) {
  const [x, y] = await Promise.all([crypto.subtle.digest('SHA-256', enc.encode(a)), crypto.subtle.digest('SHA-256', enc.encode(b))]);
  const A = new Uint8Array(x), B = new Uint8Array(y);
  let d = 0;
  for (let i = 0; i < A.length; i++) d |= A[i] ^ B[i];
  return d === 0;
}

function parse(header) {
  const m = /^Basic\s+(.+)$/i.exec(header || '');
  if (!m) return null;
  try {
    const bin = atob(m[1]);
    const text = new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
    const i = text.indexOf(':');
    return i < 0 ? null : { user: text.slice(0, i), pass: text.slice(i + 1) };
  } catch { return null; }
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (PUBLIC(pathname)) return env.ASSETS.fetch(request);

    if (!env.BASIC_AUTH_USER || !env.BASIC_AUTH_PASS) {
      return new Response('Site is locked: authentication is not configured.', { status: 503, headers: { 'Cache-Control': 'no-store' } });
    }
    const c = parse(request.headers.get('Authorization'));
    const ok = c && (await safeEqual(c.user, env.BASIC_AUTH_USER)) & (await safeEqual(c.pass, env.BASIC_AUTH_PASS));
    if (!ok) {
      return new Response('Authentication required.', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Aquarii Templates", charset="UTF-8"', 'Cache-Control': 'no-store' },
      });
    }
    return env.ASSETS.fetch(request);
  },
};
