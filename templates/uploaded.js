/* "Reel uploaded" checkbox, shared by the home page and the kit page.
   Source of truth: the D1 table behind /api/uploaded (works across every device). A copy is kept in localStorage
   ("reel.uploaded": { templateId: "ISO time it was ticked" }) so the page works instantly and offline.
   Exposes window.ReelUploaded = { make, has, all, count, backup, restore, sync, status }. */
(function () {
  var KEY = 'reel.uploaded';
  function read() { try { var o = JSON.parse(localStorage.getItem(KEY) || '{}'); return o && typeof o === 'object' ? o : {}; } catch (e) { return {}; } }
  function write(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  /* Server sync (D1 behind /api/uploaded). When the API is missing (501) or the network is down, the device copy keeps working
     and changes made offline are queued in "reel.pending" and sent next time. */
  var PK = 'reel.pending', remote = false;
  function pend() { try { return JSON.parse(localStorage.getItem(PK) || '{}') || {}; } catch (e) { return {}; } }
  function pendWrite(o) { try { localStorage.setItem(PK, JSON.stringify(o)); } catch (e) {} }
  function api(path, init) {
    init = init || {}; init.credentials = 'same-origin'; init.cache = 'no-store';
    init.headers = Object.assign({ 'X-Requested-With': 'reel' }, init.headers || {}, init.body ? { 'Content-Type': 'application/json' } : {});
    return fetch(path, init);
  }
  function put(id, on) {
    return api('/api/uploaded/' + id, { method: 'PUT', body: JSON.stringify({ on: on }) }).then(function (r) { if (!r.ok) throw new Error(String(r.status)); var p = pend(); delete p[id]; pendWrite(p); });
  }
  function fire(detail) { window.dispatchEvent(new CustomEvent('reel-uploaded', { detail: detail })); }
  function sync() {
    return api('/api/uploaded').then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.json(); }).then(function (j) {
      remote = true; var ids = j.ids || {}, loc = read(), p = pend(), mig = false;
      try { mig = localStorage.getItem('reel.migrated') === '1'; } catch (e) {}
      var push = Promise.resolve();
      if (!mig) { // first time with the server: send what this device already had
        var up = {}; Object.keys(loc).forEach(function (k) { if (!ids[k]) up[k] = loc[k]; });
        push = (Object.keys(up).length ? api('/api/uploaded/import', { method: 'POST', body: JSON.stringify({ ids: up }) }) : Promise.resolve()).then(function () { try { localStorage.setItem('reel.migrated', '1'); } catch (e) {} Object.keys(up).forEach(function (k) { ids[k] = up[k]; }); });
      }
      return push.then(function () {
        var merged = Object.assign({}, ids);
        Object.keys(p).forEach(function (k) { if (p[k]) merged[k] = merged[k] || new Date().toISOString(); else delete merged[k]; }); // unsent offline changes win locally
        write(merged); fire({ all: true });
        return Promise.all(Object.keys(p).map(function (k) { return put(k, !!p[k]).catch(function () {}); }));
      });
    }).catch(function () { remote = false; });
  }

  function has(id) { return !!read()[id]; }
  function set(id, on) {
    var o = read(); if (on) o[id] = new Date().toISOString(); else delete o[id]; write(o);
    fire({ id: id, on: !!on });
    var p = pend(); p[id] = !!on; pendWrite(p);
    if (remote) put(id, !!on).catch(function () {}); else sync();
  }
  function count(ids) { var o = read(); return (ids || Object.keys(o)).filter(function (i) { return o[i]; }).length; }
  function backup() { return JSON.stringify(read()); }
  function restore(text) {
    var o; try { o = JSON.parse(text); } catch (e) { return false; }
    if (!o || typeof o !== 'object' || Array.isArray(o)) return false;
    var cur = read(), add = {}; Object.keys(o).forEach(function (k) { if (/^\d{4}-\d{2}-\d{2}(-\d{4})?$/.test(k) && o[k]) { cur[k] = typeof o[k] === 'string' ? o[k] : new Date().toISOString(); add[k] = cur[k]; } });
    write(cur); fire({ all: true });
    if (Object.keys(add).length) api('/api/uploaded/import', { method: 'POST', body: JSON.stringify({ ids: add }) }).catch(function () {});
    return true;
  }
  function status() { return remote ? 'server' : 'device'; }

  var css = document.createElement('style');
  css.textContent =
    '.ru{flex:none;display:inline-flex;align-items:center;gap:8px;min-height:44px;min-width:44px;justify-content:center;padding:0 4px;border:0;background:transparent;color:inherit;cursor:pointer;font:700 .8rem system-ui,-apple-system,sans-serif;-webkit-tap-highlight-color:transparent}' +
    '.ru .bx{width:26px;height:26px;border:2px solid var(--mute,#8a8f98);border-radius:8px;display:grid;place-items:center;transition:background .15s,border-color .15s,transform .15s;color:transparent}' +
    '.ru .bx svg{width:16px;height:16px}' +
    '.ru:active .bx{transform:scale(.92)}' +
    '.ru[aria-checked="true"] .bx{background:var(--ok,#1f9d55);border-color:var(--ok,#1f9d55);color:#fff}' +
    '.ru:focus-visible{outline:3px solid var(--accent,#2e7df6);outline-offset:2px;border-radius:10px}' +
    '@media (prefers-reduced-motion:reduce){.ru .bx{transition:none}}';
  document.head.appendChild(css);

  function paint(b) { var on = has(b.dataset.id); b.setAttribute('aria-checked', String(on)); if (b.dataset.label) b.querySelector('.tx').textContent = on ? 'Reel uploaded ✓' : 'Mark reel as uploaded'; }
  function make(id, opts) {
    opts = opts || {};
    var b = document.createElement('button'); b.type = 'button'; b.className = 'ru'; b.dataset.id = id; b.setAttribute('role', 'checkbox');
    b.setAttribute('aria-label', 'Reel uploaded' + (opts.name ? ' for ' + opts.name : ''));
    b.innerHTML = '<span class="bx"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>';
    if (opts.label) { b.dataset.label = '1'; var t = document.createElement('span'); t.className = 'tx'; b.appendChild(t); }
    b.addEventListener('click', function () { set(id, !has(id)); });
    window.addEventListener('reel-uploaded', function (e) { if (!b.isConnected && !document.contains(b)) return; if (e.detail && (e.detail.all || e.detail.id === id)) paint(b); });
    paint(b); return b;
  }
  window.ReelUploaded = { make: make, has: has, set: set, count: count, backup: backup, restore: restore, all: read, sync: sync, status: status };
  sync(); window.addEventListener('online', sync);
})();
