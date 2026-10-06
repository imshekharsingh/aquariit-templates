// Aquarii Templates service worker.
// Network-first: HTML + /design-log.json (cache fallback => offline revisits work).
// Cache-first: icons and Google Fonts. Bump VERSION to invalidate old caches.
const VERSION = 'v4';
const CACHE = `aquarii-${VERSION}`;
const SHELL = ['/', '/404.html', '/manifest.webmanifest', '/design-log.json', '/social-kits.json', '/kit/', '/play/player.js', '/icons/icon.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => Promise.all(SHELL.map((u) => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('aquarii-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const put = (req, res) => {
  if (res && res.ok && !res.redirected) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
  return res;
};

const networkFirst = async (req, fallbackUrl) => {
  try { return put(req, await fetch(req)); }
  catch {
    return (await caches.match(req, { ignoreSearch: new URL(req.url).pathname === '/kit/' })) || (fallbackUrl && (await caches.match(fallbackUrl))) ||
      new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
  }
};

const cacheFirst = async (req) => {
  const hit = await caches.match(req);
  if (hit) return hit;
  try { return put(req, await fetch(req)); } catch { return Response.error(); }
};

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const fontHost = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (!fontHost && url.origin !== location.origin) return;

  if (fontHost || url.pathname.startsWith('/icons/')) return e.respondWith(cacheFirst(req));
  if (req.mode === 'navigate' || url.pathname === '/design-log.json' || url.pathname === '/social-kits.json' || url.pathname.endsWith('.html')) {
    return e.respondWith(networkFirst(req, req.mode === 'navigate' ? '/' : null));
  }
  e.respondWith(networkFirst(req, null));
});
