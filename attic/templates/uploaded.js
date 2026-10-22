/* "Reel uploaded" checkbox, shared by the home page and the kit page.
   Remote only: the ticks live in Cloudflare D1 behind /api/uploaded (same sign-in as the site) and nothing about them is kept on the device.
   While the server is unreachable (or no database is bound) the boxes are disabled and say so.
   One-time clean-up: ticks an earlier version saved on this device are uploaded once, then removed from the device.
   Exposes window.ReelUploaded = { make, has, set, count, ready, available, reload }. */
(function () {
  var state = {}, loaded = false, up = false; // up = the server answered

  function fire(detail) { window.dispatchEvent(new CustomEvent('reel-uploaded', { detail: detail })); }
  function api(path, init) {
    init = init || {}; init.credentials = 'same-origin'; init.cache = 'no-store';
    init.headers = Object.assign({ 'X-Requested-With': 'reel' }, init.headers || {}, init.body ? { 'Content-Type': 'application/json' } : {});
    return fetch(path, init);
  }
  function legacy() { // ticks from the device-only version: move them to the server once, then forget them
    var loc = {};
    try { loc = JSON.parse(localStorage.getItem('reel.uploaded') || '{}') || {}; } catch (e) {}
    var ids = Object.keys(loc);
    function wipe() { try { ['reel.uploaded', 'reel.pending', 'reel.migrated', 'reel.filter'].forEach(function (k) { localStorage.removeItem(k); }); } catch (e) {} }
    if (!ids.length) { wipe(); return Promise.resolve(false); }
    return api('/api/uploaded/import', { method: 'POST', body: JSON.stringify({ ids: loc }) }).then(function (r) { if (r.ok) { wipe(); return true; } return false; }).catch(function () { return false; });
  }
  function reload() {
    return api('/api/uploaded').then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.json(); }).then(function (j) {
      up = true; return legacy().then(function (moved) { return moved ? api('/api/uploaded').then(function (r) { return r.json(); }) : j; });
    }).then(function (j) { state = (j && j.ids) || {}; loaded = true; fire({ all: true }); })
      .catch(function () { up = false; loaded = true; state = {}; fire({ all: true }); });
  }

  function has(id) { return !!state[id]; }
  function set(id, on) {
    if (!up) return;
    var before = state[id]; if (on) state[id] = new Date().toISOString(); else delete state[id];
    fire({ id: id, on: !!on });
    api('/api/uploaded/' + id, { method: 'PUT', body: JSON.stringify({ on: !!on }) }).then(function (r) { if (!r.ok) throw new Error(String(r.status)); })
      .catch(function () { if (before) state[id] = before; else delete state[id]; fire({ id: id, on: !!before }); }); // revert if the server said no
  }
  function count(ids) { return (ids || Object.keys(state)).filter(function (i) { return state[i]; }).length; }

  var css = document.createElement('style');
  css.textContent =
    '.ru{flex:none;display:inline-flex;align-items:center;gap:8px;min-height:44px;min-width:44px;justify-content:center;padding:0 4px;border:0;background:transparent;color:inherit;cursor:pointer;font:700 .8rem system-ui,-apple-system,sans-serif;-webkit-tap-highlight-color:transparent}' +
    '.ru .bx{width:26px;height:26px;border:2px solid var(--mute,#8a8f98);border-radius:8px;display:grid;place-items:center;transition:background .15s,border-color .15s,transform .15s;color:transparent}' +
    '.ru .bx svg{width:16px;height:16px}' +
    '.ru:active .bx{transform:scale(.92)}' +
    '.ru[aria-checked="true"] .bx{background:var(--ok,#1f9d55);border-color:var(--ok,#1f9d55);color:#fff}' +
    '.ru[disabled]{cursor:default;opacity:.45}.ru[disabled]:active .bx{transform:none}' +
    '.ru:focus-visible{outline:3px solid var(--accent,#2e7df6);outline-offset:2px;border-radius:10px}' +
    '@media (prefers-reduced-motion:reduce){.ru .bx{transition:none}}';
  document.head.appendChild(css);

  function paint(b) {
    var on = has(b.dataset.id); b.setAttribute('aria-checked', String(on)); b.disabled = !up; b.setAttribute('aria-busy', String(!loaded));
    b.title = !loaded ? 'Loading…' : up ? '' : 'Upload tracking is unavailable right now';
    if (b.dataset.label) b.querySelector('.tx').textContent = !loaded ? 'Loading…' : !up ? 'Tracking unavailable' : on ? 'Reel uploaded ✓' : 'Mark reel as uploaded';
  }
  function make(id, opts) {
    opts = opts || {};
    var b = document.createElement('button'); b.type = 'button'; b.className = 'ru'; b.dataset.id = id; b.setAttribute('role', 'checkbox');
    b.setAttribute('aria-label', 'Reel uploaded' + (opts.name ? ' for ' + opts.name : ''));
    b.innerHTML = '<span class="bx"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>';
    if (opts.label) { b.dataset.label = '1'; var t = document.createElement('span'); t.className = 'tx'; b.appendChild(t); }
    b.addEventListener('click', function () { set(id, !has(id)); });
    window.addEventListener('reel-uploaded', function (e) { if (!document.contains(b)) return; if (e.detail && (e.detail.all || e.detail.id === id)) paint(b); });
    paint(b); return b;
  }
  window.ReelUploaded = { make: make, has: has, set: set, count: count, reload: reload, ready: function () { return loaded; }, available: function () { return up; } };
  reload(); window.addEventListener('online', reload); document.addEventListener('visibilitychange', function () { if (!document.hidden) reload(); }); // pick up ticks made on another device
})();
