// Live demos for the public tips page (templates/tips/), one per reel tip, keyed by the reel config's "tip.demo".
// Each demo shows the problem and the fix side by side and runs only when the visitor taps its button.
// css: scoped under #<id>; html: the demo's markup; js: wires its button (runs once, inside the page's script).
export const demos = {
  popup: {
    css: `
#popup .pane{position:relative;height:150px}
#popup .pop{display:none;position:absolute;inset:auto 10px 10px;padding:14px;border-radius:14px;background:#262b40;color:#f1efe9;font-weight:700;opacity:1;transform:none;transition:opacity .3s,transform .3s}
#popup .pop.open{display:block}
@starting-style{#popup .fix .pop.open{opacity:0;transform:scale(.9)}}`,
    html: `
<div class="pair">
  <div class="pane"><span class="tag">Before</span><div class="pop">Saved to your list</div></div>
  <div class="pane fix"><span class="tag ok">With @starting-style</span><div class="pop">Saved to your list</div></div>
</div>
<button class="play" type="button">Open both</button>`,
    js: `function(root, btn){ btn.addEventListener('click', function(){ var pops = root.querySelectorAll('.pop'), open = !pops[0].classList.contains('open');
  pops.forEach(function(p){ p.classList.toggle('open', open); }); btn.textContent = open ? 'Close both' : 'Open both'; }); }`,
  },
  stagger: {
    css: `
#stagger .row{height:18px;margin:6px 10px;border-radius:6px;background:#3a4160;opacity:0}
#stagger .run .row{animation:tip-rise .45s ease-out both}
#stagger .fix.run .row{animation-delay:calc(var(--i) * 40ms)}
@keyframes tip-rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}`,
    html: `
<div class="pair">
  <div class="pane"><span class="tag">Before</span>${[0, 1, 2, 3, 4].map((i) => `<div class="row" style="--i:${i}"></div>`).join('')}</div>
  <div class="pane fix"><span class="tag ok">Staggered</span>${[0, 1, 2, 3, 4].map((i) => `<div class="row" style="--i:${i}"></div>`).join('')}</div>
</div>
<button class="play" type="button">Play</button>`,
    js: `function(root, btn){ btn.addEventListener('click', function(){ root.querySelectorAll('.pane').forEach(function(p){ p.classList.remove('run'); void p.offsetWidth; p.classList.add('run'); }); btn.textContent = 'Replay'; }); }`,
  },
  balance: {
    css: `
#balance .pane{min-height:170px;padding:34px 12px 12px}
#balance .hd{font:800 21px/1.12 system-ui,sans-serif;letter-spacing:-.02em;color:#f1efe9}
#balance .fix.on .hd{text-wrap:balance}
#balance .pane .hd{width:100%}`,
    html: `
<div class="pair">
  <div class="pane"><span class="tag">Before</span><div class="hd">A website that works as hard as you do</div></div>
  <div class="pane fix"><span class="tag ok">text-wrap: balance</span><div class="hd">A website that works as hard as you do</div></div>
</div>
<button class="play" type="button">Balance it</button>
<p class="note">Narrow the window to see it on different widths: the left heading keeps leaving words alone, the right one stays even.</p>`,
    js: `function(root, btn){ btn.addEventListener('click', function(){ var f = root.querySelector('.fix'), on = !f.classList.contains('on'); f.classList.toggle('on', on); btn.textContent = on ? 'Unbalance it' : 'Balance it'; }); }`,
  },
  transform: {
    css: `
#transform .pane{height:96px}
#transform .dot{position:absolute;top:44px;left:12px;width:34px;height:34px;border-radius:10px;background:#7c8cff}
#transform .run .dot{animation:tip-left 2s ease-in-out infinite alternate}
#transform .fix.run .dot{animation-name:tip-move}
@keyframes tip-left{to{left:calc(100% - 46px)}}
@keyframes tip-move{to{transform:translateX(calc(var(--w) - 58px))}}`,
    html: `
<div class="pair">
  <div class="pane"><span class="tag">Animating left</span><div class="dot"></div></div>
  <div class="pane fix"><span class="tag ok">Animating transform</span><div class="dot"></div></div>
</div>
<button class="play" type="button">Play on a busy page (4 s)</button>
<p class="note">The button also keeps the page busy, like a heavy app does. The left box can only move when the page has a moment; the transform box keeps moving.</p>`,
    js: `function(root, btn){ btn.addEventListener('click', function(){ if (btn.disabled) return; btn.disabled = true;
  var panes = root.querySelectorAll('.pane'); panes.forEach(function(p){ p.style.setProperty('--w', p.clientWidth + 'px'); p.classList.add('run'); });
  var end = performance.now() + 4000;
  (function busy(){ var t = performance.now(); while (performance.now() - t < 40) {} if (t < end) requestAnimationFrame(busy); else { panes.forEach(function(p){ p.classList.remove('run'); }); btn.disabled = false; } })(); }); }`,
  },
};
