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
  smooth: {
    css: `
#smooth .box{position:absolute;left:8px;right:8px;top:30px;bottom:8px;overflow-y:auto;border-radius:10px}
#smooth .fix .box{scroll-behavior:smooth}
@media (prefers-reduced-motion: reduce){#smooth .fix .box{scroll-behavior:auto}}
#smooth .sec{height:120px;margin-bottom:8px;border-radius:10px;padding:10px;font:800 15px/1.2 system-ui,sans-serif;color:#0b0d14}
#smooth .pane{height:190px}`,
    html: `
<div class="pair">
  <div class="pane"><span class="tag">Before</span><div class="box"><div class="sec" style="background:#7aa7ff">Top</div><div class="sec" style="background:#52d6a4">Features</div><div class="sec" style="background:#ffb547">Pricing</div></div></div>
  <div class="pane fix"><span class="tag ok">scroll-behavior: smooth</span><div class="box"><div class="sec" style="background:#7aa7ff">Top</div><div class="sec" style="background:#52d6a4">Features</div><div class="sec" style="background:#ffb547">Pricing</div></div></div>
</div>
<button class="play" type="button">Go to Pricing</button>
<p class="note">Both boxes get the same jump to Pricing. With motion turned off on your device, the right box jumps too, as it should.</p>`,
    js: `function(root, btn){ btn.addEventListener('click', function(){ var down = btn.textContent.indexOf('Pricing') > -1;
  root.querySelectorAll('.box').forEach(function(b){ b.scrollTo({ top: down ? b.scrollHeight : 0 }); }); btn.textContent = down ? 'Back to top' : 'Go to Pricing'; }); }`,
  },
  overscroll: {
    css: `
#overscroll .pane{height:220px;padding:0}
#overscroll .page{position:absolute;inset:30px 8px 8px;overflow-y:auto;border-radius:10px;background:repeating-linear-gradient(180deg,#232633 0 40px,#1b1e29 40px 80px)}
#overscroll .page .tall{height:600px}
#overscroll .pop{position:absolute;left:14%;right:14%;top:24px;height:120px;overflow-y:auto;border-radius:12px;background:#2f2b36;border:1.5px solid #3c3846}
#overscroll .fix .pop{overscroll-behavior:contain}
#overscroll .pop div{height:34px;margin:6px;border-radius:8px;background:#3a3644;font:600 13px/34px system-ui,sans-serif;color:#d9d6ce;padding-left:10px}`,
    html: `
<div class="pair">
  <div class="pane"><span class="tag">Before</span><div class="page"><div class="tall"></div><div class="pop">${['Starter', 'Basic', 'Plus', 'Team', 'Pro', 'Studio'].map((x) => `<div>${x}</div>`).join('')}</div></div></div>
  <div class="pane fix"><span class="tag ok">overscroll-behavior: contain</span><div class="page"><div class="tall"></div><div class="pop">${['Starter', 'Basic', 'Plus', 'Team', 'Pro', 'Studio'].map((x) => `<div>${x}</div>`).join('')}</div></div></div>
</div>
<p class="note">Scroll each list to its end and keep going: on the left the striped page behind starts moving, on the right it stays put.</p>`,
    js: `function(root, btn){}`,
  },
  numbers: {
    css: `
#numbers .pane{height:110px}
#numbers .n{position:absolute;left:14px;top:40px;font:800 44px/1 system-ui,-apple-system,"Segoe UI",sans-serif;font-variant-numeric:proportional-nums;white-space:nowrap}
#numbers .n i{font:700 14px/1 ui-monospace,monospace;font-style:normal;color:#8a8780;margin-left:6px}
#numbers .fix .n{font-variant-numeric:tabular-nums}`,
    html: `
<div class="pair">
  <div class="pane"><span class="tag">Proportional digits</span><div class="n"><span>10.00</span><i>sec</i></div></div>
  <div class="pane fix"><span class="tag ok">font-variant-numeric: tabular-nums</span><div class="n"><span>10.00</span><i>sec</i></div></div>
</div>
<button class="play" type="button">Run the timers (4 s)</button>
<p class="note">Watch the word "sec": on the left it shifts every time a digit changes; on the right it holds still. (Some fonts already use tabular digits by default; the left side forces proportional ones so you can compare.)</p>`,
    js: `function(root, btn){ btn.addEventListener('click', function(){ if (btn.disabled) return; btn.disabled = true;
  var ns = root.querySelectorAll('.n span'), t0 = performance.now();
  (function tick(){ var e = (performance.now() - t0) / 1000, n = Math.floor(e * 10), v = (10 + n * .173 + (n * 7919 % 13) * .01).toFixed(2);
    ns.forEach(function(s){ s.textContent = v; }); if (e < 4) requestAnimationFrame(tick); else btn.disabled = false; })(); }); }`,
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
