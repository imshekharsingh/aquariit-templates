/* "Reel uploaded" checkbox, shared by the home page and the kit page.
   State lives on this device (localStorage key "reel.uploaded": { templateId: "ISO time it was ticked" }).
   Exposes window.ReelUploaded = { make, has, all, count, backup, restore }. */
(function () {
  var KEY = 'reel.uploaded';
  function read() { try { var o = JSON.parse(localStorage.getItem(KEY) || '{}'); return o && typeof o === 'object' ? o : {}; } catch (e) { return {}; } }
  function write(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  function has(id) { return !!read()[id]; }
  function set(id, on) {
    var o = read(); if (on) o[id] = new Date().toISOString(); else delete o[id]; write(o);
    window.dispatchEvent(new CustomEvent('reel-uploaded', { detail: { id: id, on: !!on } }));
  }
  function count(ids) { var o = read(); return (ids || Object.keys(o)).filter(function (i) { return o[i]; }).length; }
  function backup() { return JSON.stringify(read()); }
  function restore(text) {
    var o; try { o = JSON.parse(text); } catch (e) { return false; }
    if (!o || typeof o !== 'object' || Array.isArray(o)) return false;
    var cur = read(); Object.keys(o).forEach(function (k) { if (/^\d{4}-\d{2}-\d{2}(-\d{4})?$/.test(k) && o[k]) cur[k] = typeof o[k] === 'string' ? o[k] : new Date().toISOString(); });
    write(cur); window.dispatchEvent(new CustomEvent('reel-uploaded', { detail: { all: true } })); return true;
  }

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

  function sync(b) { var on = has(b.dataset.id); b.setAttribute('aria-checked', String(on)); if (b.dataset.label) b.querySelector('.tx').textContent = on ? 'Reel uploaded ✓' : 'Mark reel as uploaded'; }
  function make(id, opts) {
    opts = opts || {};
    var b = document.createElement('button'); b.type = 'button'; b.className = 'ru'; b.dataset.id = id; b.setAttribute('role', 'checkbox');
    b.setAttribute('aria-label', 'Reel uploaded' + (opts.name ? ' for ' + opts.name : ''));
    b.innerHTML = '<span class="bx"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>';
    if (opts.label) { b.dataset.label = '1'; var t = document.createElement('span'); t.className = 'tx'; b.appendChild(t); }
    b.addEventListener('click', function () { set(id, !has(id)); });
    window.addEventListener('reel-uploaded', function (e) { if (!b.isConnected && !document.contains(b)) return; if (e.detail && (e.detail.all || e.detail.id === id)) sync(b); });
    sync(b); return b;
  }
  window.ReelUploaded = { make: make, has: has, set: set, count: count, backup: backup, restore: restore, all: read };
})();
