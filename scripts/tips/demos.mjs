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
  hover: {
    css: `
#hover .pane{height:120px}
#hover .b{position:absolute;left:14px;width:calc(100% - 28px);top:46px;height:52px;border-radius:26px;border:2px solid #f2efe8;background:transparent;color:#f2efe8;font:700 17px/48px system-ui,-apple-system,"Segoe UI",sans-serif;text-align:center;cursor:pointer;transition:background .15s,color .15s}
#hover .b:active{transform:scale(.97)}
#hover .pane:not(.fix) .b:hover{background:#f2efe8;color:#111214}
@media (hover: hover){#hover .fix .b:hover{background:#f2efe8;color:#111214}}`,
    html: `
<div class="pair">
  <div class="pane"><span class="tag">Plain :hover</span><button class="b" type="button">Add to bag</button></div>
  <div class="pane fix"><span class="tag ok">Inside @media (hover: hover)</span><button class="b" type="button">Add to bag</button></div>
</div>
<p class="note">Open this on a phone and tap both buttons: the left one can stay lit after your finger lifts, until you tap somewhere else; the right one only presses. With a mouse both light up on hover.</p>`,
    js: `function(){}`,
  },
  keyboard: {
    css: `
#keyboard .pane{height:120px;display:flex;flex-direction:column;justify-content:center}
#keyboard input{margin:28px 10px 0;width:calc(100% - 20px);min-height:44px;border-radius:10px;border:1.5px solid #cfcac0;background:#fff;color:#111214;padding:0 12px;font:700 17px/1 ui-monospace,Menlo,monospace;letter-spacing:.2em}`,
    html: `
<div class="pair">
  <div class="pane"><span class="tag">No inputmode (text)</span><input type="text" placeholder="6-digit code" aria-label="Code, default keyboard"></div>
  <div class="pane fix"><span class="tag ok">inputmode="numeric"</span><input type="text" inputmode="numeric" placeholder="6-digit code" aria-label="Code, number keyboard"></div>
</div>
<p class="note">Open this on a phone and tap each field: the left one opens the letter keyboard, the right one opens a number pad. inputmode only changes the keyboard, not what the field accepts.</p>`,
    js: `function(){}`,
  },
  // sample (6 Nov 2026, temporary): the contrast sample's demo (its tip stays off the public page while it is a sample)
  contrast: {
    css: `
#contrast .shop{margin:30px 10px 0;border-radius:10px;background:#fff;padding:6px 12px}
#contrast .shop p{display:flex;justify-content:space-between;margin:0;padding:8px 0;color:#1d1d1f;font:700 14px/1.2 system-ui,-apple-system,"Segoe UI",sans-serif}
#contrast .shop span{color:#b3b3b3}
#contrast .fix .shop span{color:#767676}`,
    html: `
<div class="pair">
  <div class="pane"><span class="tag">#b3b3b3 · 2.1 : 1</span><div class="shop"><p>Stoneware mug <span>$24</span></p><p>Shallow bowl <span>$32</span></p></div></div>
  <div class="pane fix"><span class="tag ok">#767676 · 4.5 : 1</span><div class="shop"><p>Stoneware mug <span>$24</span></p><p>Shallow bowl <span>$32</span></p></div></div>
</div>
<p class="note">Turn your screen brightness down or step outside: the left prices fade first. WCAG asks for at least 4.5 : 1 for body text; on white, #767676 is the lightest grey that passes.</p>`,
    js: `function(){}`,
  },
  // the scroll-snap demo (sample 6 Nov 2026; adopted 11 Nov by showreel-33-carousel, whose tip is on the public page)
  snap: {
    css: `
#snap .row{display:flex;gap:0;margin:30px 10px 0;border-radius:10px;overflow-x:auto;overflow-y:hidden}
#snap .row div{flex:0 0 100%;height:84px;display:flex;align-items:center;justify-content:center;color:#111214;font:800 22px system-ui,-apple-system,"Segoe UI",sans-serif}
#snap .fix .row{scroll-snap-type:x mandatory}
#snap .fix .row div{scroll-snap-align:center}`,
    html: `
<div class="pair">
  <div class="pane"><span class="tag">No snap</span><div class="row"><div style="background:#c9714f">1</div><div style="background:#8fa58a">2</div><div style="background:#e3c9a0">3</div><div style="background:#d9a441">4</div></div></div>
  <div class="pane fix"><span class="tag ok">scroll-snap-type: x mandatory</span><div class="row"><div style="background:#c9714f">1</div><div style="background:#8fa58a">2</div><div style="background:#e3c9a0">3</div><div style="background:#d9a441">4</div></div></div>
</div>
<p class="note">Swipe each row and let go halfway. The left one stops wherever you let go; the right one always settles on one whole photo.</p>`,
    js: `function(){}`,
  },
  thumb: {
    css: `
#thumb .menu{margin:30px 10px 0;border-radius:10px;background:#fff;overflow:hidden;padding:4px 0}
#thumb .menu a{display:block;padding:0 12px;color:#111214;font:600 13px/16px system-ui,-apple-system,"Segoe UI",sans-serif;text-decoration:none}
#thumb .menu a.del{color:#d8392b}
#thumb .fix .menu a{min-height:44px;line-height:44px}
#thumb .menu a:active{background:#7cf0b6}`,
    html: `
<div class="pair">
  <div class="pane"><span class="tag">16 px links</span><div class="menu"><a href="#thumb">Share</a><a href="#thumb">Copy link</a><a href="#thumb">Archive</a><a href="#thumb" class="del">Delete</a></div></div>
  <div class="pane fix"><span class="tag ok">min-height: 44px</span><div class="menu"><a href="#thumb">Share</a><a href="#thumb">Copy link</a><a href="#thumb">Archive</a><a href="#thumb" class="del">Delete</a></div></div>
</div>
<p class="note">On a phone, try to tap Archive in each menu with your thumb. The left links are one line of text tall, so your thumb covers two; the right ones are 44 px tall with the same text.</p>`,
    js: `function(){}`,
  },
  flash: {
    css: `
#flash .pane{background:#16171c;color:#f2efe8;padding-bottom:12px}
#flash .fix{color-scheme:dark}
#flash .box{display:block;width:calc(100% - 20px);margin:34px 10px 8px;font:15px system-ui,-apple-system,"Segoe UI",sans-serif}
#flash label{display:flex;align-items:center;gap:8px;margin:0 10px 8px;font:600 13px system-ui,-apple-system,"Segoe UI",sans-serif}
#flash select{margin:0 10px;font:14px system-ui,-apple-system,"Segoe UI",sans-serif}`,
    html: `
<div class="pair">
  <div class="pane"><span class="tag">no color-scheme</span><input class="box" type="search" placeholder="Search stories" aria-label="Search stories (default colors)"><label><input type="checkbox" checked> Unread only</label><select aria-label="Sort (default colors)"><option>Latest</option><option>Oldest</option></select></div>
  <div class="pane fix"><span class="tag ok">color-scheme: dark</span><input class="box" type="search" placeholder="Search stories" aria-label="Search stories (dark scheme)"><label><input type="checkbox" checked> Unread only</label><select aria-label="Sort (dark scheme)"><option>Latest</option><option>Oldest</option></select></div>
</div>
<p class="note">Both panes have the same dark background and the same unstyled form controls. The left keeps the browser's default light colors; the right says color-scheme: dark, so the boxes, checkbox and menu follow the dark page. On a whole site, the meta tag in the head does this before any CSS loads, which is what stops the white flash between pages.</p>`,
    js: `function(){}`,
  },
  sideways: {
    css: `
#sideways .pane{height:150px;overflow-x:auto;overflow-y:hidden}
#sideways .card{margin:36px 10px 0;width:calc(100% - 20px);border-radius:12px;background:#f2efe8;color:#111214;padding:10px 12px;font:600 13px/1.35 system-ui,-apple-system,"Segoe UI",sans-serif;transition:width .4s}
#sideways .narrow .card{width:60%}
#sideways .card a{color:#2e5bd8;font:500 13px/1.4 ui-monospace,Menlo,monospace}
#sideways .fix .card a{overflow-wrap:anywhere}
#sideways .go{margin-top:10px;width:100%;min-height:44px;border-radius:22px;border:1.5px solid #f2efe8;background:transparent;color:#f2efe8;font:700 15px system-ui,-apple-system,"Segoe UI",sans-serif;cursor:pointer}`,
    html: `
<div class="pair">
  <div class="pane"><span class="tag">overflow-wrap: normal (default)</span><div class="card">Track it here:<br><a href="#sideways">https://parcelbay.example/track/7Q4KXW92LMZRHT8VBN2C</a></div></div>
  <div class="pane fix"><span class="tag ok">overflow-wrap: anywhere</span><div class="card">Track it here:<br><a href="#sideways">https://parcelbay.example/track/7Q4KXW92LMZRHT8VBN2C</a></div></div>
</div>
<button class="go" type="button">Make the cards narrower</button>
<p class="note">The left link has no space to break at, so it sticks out of its card and the box scrolls sideways. The right one breaks wherever it must and stays inside.</p>`,
    js: `function(root){ root.querySelector('.go').addEventListener('click', function(){ root.querySelectorAll('.pane').forEach(function(p){ p.classList.toggle('narrow'); }); }); }`,
  },
  sticky: {
    css: `
#sticky .sc{height:130px;overflow-y:auto;margin:0 8px 8px;border-radius:10px;background:#f2efe8}
#sticky .wrap{overflow:hidden}
#sticky .fix .wrap{overflow:clip}
#sticky .hd{position:sticky;top:0;background:#111214;color:#f2efe8;padding:8px 10px;font:800 13px system-ui,-apple-system,"Segoe UI",sans-serif}
#sticky .it{margin:8px;height:34px;border-radius:8px;background:#d8d4cb}
#sticky .go{margin-top:10px;width:100%;min-height:44px;border-radius:22px;border:1.5px solid #f2efe8;background:transparent;color:#f2efe8;font:700 15px system-ui,-apple-system,"Segoe UI",sans-serif;cursor:pointer}`,
    html: `
<div class="pair">
  <div class="pane"><span class="tag">.wrap { overflow: hidden }</span><div class="sc"><div class="wrap"><div class="hd">FERNLY</div>${'<div class="it"></div>'.repeat(8)}</div></div></div>
  <div class="pane fix"><span class="tag ok">.wrap { overflow: clip }</span><div class="sc"><div class="wrap"><div class="hd">FERNLY</div>${'<div class="it"></div>'.repeat(8)}</div></div></div>
</div>
<button class="go" type="button">Scroll both</button>
<p class="note">Both headers are position: sticky; top: 0. On the left the wrapper's overflow: hidden makes it the box the header sticks to, so the header scrolls away. On the right overflow: clip is not a scroll box, so the header stays. (Needs Safari 16+.)</p>`,
    js: `function(root){ root.querySelector('.go').addEventListener('click', function(){ root.querySelectorAll('.sc').forEach(function(s){ s.scrollTo({ top: s.scrollTop > 10 ? 0 : 200, behavior: 'smooth' }); }); }); }`,
  },
  anchor: {
    css: `
#anchor .sc{position:relative;height:130px;overflow-y:auto;margin:0 8px 8px;border-radius:10px;background:#f2efe8;color:#111214}
#anchor .fix .sc{scroll-padding-top:34px}
#anchor .hd{position:sticky;top:0;z-index:1;height:30px;background:#111214;color:#f2efe8;padding:0 10px;font:800 12px/30px system-ui,-apple-system,"Segoe UI",sans-serif}
#anchor h4{margin:10px;font:800 15px system-ui,-apple-system,"Segoe UI",sans-serif}
#anchor .it{margin:8px 10px;height:10px;border-radius:5px;background:#d8d4cb}
#anchor .go{margin-top:10px;width:100%;min-height:44px;border-radius:22px;border:1.5px solid #f2efe8;background:transparent;color:#f2efe8;font:700 15px system-ui,-apple-system,"Segoe UI",sans-serif;cursor:pointer}`,
    html: `
<div class="pair">
  <div class="pane"><span class="tag">No scroll padding</span><div class="sc"><div class="hd">HELP</div>${'<div class="it"></div>'.repeat(10)}<h4 class="to">3. Billing</h4>${'<div class="it"></div>'.repeat(10)}</div></div>
  <div class="pane fix"><span class="tag ok">scroll-padding-top</span><div class="sc"><div class="hd">HELP</div>${'<div class="it"></div>'.repeat(10)}<h4 class="to">3. Billing</h4>${'<div class="it"></div>'.repeat(10)}</div></div>
</div>
<button class="go" type="button">Jump to Billing</button>
<p class="note">Both boxes jump to the "3. Billing" heading the way a #link does. On the left it lands at the very top, under the dark header. On the right scroll-padding-top marks the header's strip as covered, so it stops just below it.</p>`,
    js: `function(root){ var b = root.querySelector('.go'); b.addEventListener('click', function(){ var y = window.scrollY, back = b.dataset.on === '1';
  root.querySelectorAll('.sc').forEach(function(s){ if (back) s.scrollTop = 0; else s.querySelector('.to').scrollIntoView({ block: 'start' }); });
  window.scrollTo(0, y); b.dataset.on = back ? '0' : '1'; b.textContent = back ? 'Jump to Billing' : 'Back to top'; }); }`,
  },
  longname: {
    css: `
#longname .row{display:flex;align-items:center;gap:8px;margin:0 8px 8px;padding:8px;border-radius:12px;background:#f2efe8;color:#111214;overflow:hidden;transition:width .5s}
#longname .narrow .row{width:150px}
#longname .av{flex:none;width:26px;height:26px;border-radius:50%;background:#d8572e}
#longname .who{flex:1}
#longname .fix .who{min-width:0}
#longname .nm{font:800 13px/1.3 system-ui,-apple-system,"Segoe UI",sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#longname .pay{flex:none;padding:5px 10px;border-radius:14px;background:#111214;color:#f2efe8;font:800 11px system-ui,-apple-system,"Segoe UI",sans-serif}
#longname .go{margin-top:10px;width:100%;min-height:44px;border-radius:22px;border:1.5px solid #f2efe8;background:transparent;color:#f2efe8;font:700 15px system-ui,-apple-system,"Segoe UI",sans-serif;cursor:pointer}`,
    html: `
<div class="pair">
  <div class="pane"><span class="tag">.who { min-width: auto }</span><div class="row"><span class="av"></span><div class="who"><div class="nm">Maximiliana Okonkwo-Vandenberg</div></div><span class="pay">Pay</span></div></div>
  <div class="pane fix"><span class="tag ok">.who { min-width: 0 }</span><div class="row"><span class="av"></span><div class="who"><div class="nm">Maximiliana Okonkwo-Vandenberg</div></div><span class="pay">Pay</span></div></div>
</div>
<button class="go" type="button">Make the cards narrower</button>
<p class="note">Both names have text-overflow: ellipsis. On the left the flex item can't shrink below the whole name, so Pay is pushed out of the card. On the right min-width: 0 lets it shrink, and the name ends in dots.</p>`,
    js: `function(root){ root.querySelector('.go').addEventListener('click', function(){ root.querySelectorAll('.pane').forEach(function(p){ p.classList.toggle('narrow'); }); }); }`,
  },
  squash: {
    css: `
#squash .pane{height:190px}
#squash .ph{position:absolute;left:10px;top:40px;width:calc(100% - 20px);height:140px;border-radius:12px;display:block;transition:width .5s,height .5s,left .5s}
#squash .wide .ph{height:70px;top:75px}
#squash .tall .ph{width:70px;left:calc(50% - 35px)}
#squash .fit{object-fit:cover}
#squash .go{margin-top:10px;width:100%;min-height:44px;border-radius:22px;border:1.5px solid #f2efe8;background:transparent;color:#f2efe8;font:700 15px system-ui,-apple-system,"Segoe UI",sans-serif;cursor:pointer}`,
    html: `
<div class="pair">
  <div class="pane"><span class="tag">object-fit: fill (default)</span><img class="ph" alt="A round cat face" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200' preserveAspectRatio='none'%3E%3Crect width='200' height='200' fill='%238fd3c8'/%3E%3Crect y='160' width='200' height='40' fill='%23d9b77a'/%3E%3Ccircle cx='100' cy='102' r='56' fill='%23f0a24b'/%3E%3Ccircle cx='78' cy='98' r='8' fill='%231f2328'/%3E%3Ccircle cx='122' cy='98' r='8' fill='%231f2328'/%3E%3Cellipse cx='100' cy='130' rx='30' ry='20' fill='%23fbe3c8'/%3E%3C/svg%3E"></div>
  <div class="pane fix"><span class="tag ok">object-fit: cover</span><img class="ph fit" alt="A round cat face" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200' preserveAspectRatio='none'%3E%3Crect width='200' height='200' fill='%238fd3c8'/%3E%3Crect y='160' width='200' height='40' fill='%23d9b77a'/%3E%3Ccircle cx='100' cy='102' r='56' fill='%23f0a24b'/%3E%3Ccircle cx='78' cy='98' r='8' fill='%231f2328'/%3E%3Ccircle cx='122' cy='98' r='8' fill='%231f2328'/%3E%3Cellipse cx='100' cy='130' rx='30' ry='20' fill='%23fbe3c8'/%3E%3C/svg%3E"></div>
</div>
<button class="go" type="button">Change the box shape</button>
<p class="note">Tap the button: both boxes go wide, then tall. The left photo stretches to match the box; the right one keeps its shape and crops the edges.</p>`,
    js: `function(root){ var i = 0, k = ['', 'wide', 'tall']; root.querySelector('.go').addEventListener('click', function(){ i = (i + 1) % 3; root.querySelectorAll('.pane').forEach(function(p){ p.classList.remove('wide', 'tall'); if (k[i]) p.classList.add(k[i]); }); }); }`,
  },
  dvh: {
    css: `
#dvh .pane{height:110px;display:flex;align-items:flex-end;padding:10px}
#dvh .open{width:100%;min-height:44px;border-radius:22px;border:1.5px solid #f2efe8;background:transparent;color:#f2efe8;font:700 15px system-ui,-apple-system,"Segoe UI",sans-serif;cursor:pointer}
#dvh .sheet{display:none;position:fixed;left:0;right:0;top:0;z-index:50;background:#f2efe8;color:#111214;padding:24px;font:800 28px/1.1 system-ui,-apple-system,"Segoe UI",sans-serif}
#dvh .sheet.on{display:block}
#dvh .vh{height:100vh}#dvh .dv{height:100dvh}
#dvh .sheet button{position:absolute;left:24px;right:24px;bottom:24px;min-height:52px;border:0;border-radius:26px;background:#111214;color:#f2efe8;font:800 17px system-ui,-apple-system,"Segoe UI",sans-serif;cursor:pointer}`,
    html: `
<div class="pair">
  <div class="pane"><span class="tag">height: 100vh</span><button class="open" type="button" data-s="vh">Open full screen</button></div>
  <div class="pane fix"><span class="tag ok">height: 100dvh</span><button class="open" type="button" data-s="dv">Open full screen</button></div>
</div>
<div class="sheet vh">100vh<button type="button">Close (bottom button)</button></div>
<div class="sheet dv">100dvh<button type="button">Close (bottom button)</button></div>
<p class="note">Open both on a phone with the browser bars showing: the 100vh screen can put its bottom button under the bars; the 100dvh one fits what you can see. On a laptop both look the same.</p>`,
    js: `function(root){ root.querySelectorAll('.open').forEach(function(b){ b.addEventListener('click', function(){ root.querySelector('.sheet.' + b.dataset.s).classList.add('on'); }); });
  root.querySelectorAll('.sheet button').forEach(function(b){ b.addEventListener('click', function(){ b.parentNode.classList.remove('on'); }); }); }`,
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
  alive: {
    css: `
#alive .pane{display:flex;align-items:center;justify-content:space-around;height:96px;padding-top:18px}
#alive .ht{width:30px;height:30px;fill:transparent;stroke:#f1efe9;stroke-width:6}
#alive .sw{position:relative;width:46px;height:26px;border-radius:13px;background:#3a4160}
#alive .kn{position:absolute;left:3px;top:3px;width:20px;height:20px;border-radius:10px;background:#f1efe9}
#alive .bx{width:26px;height:26px;border-radius:8px;background:#3a4160}
#alive .tk{fill:none;stroke:#10131c;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:22px;stroke-dashoffset:22px}
#alive .on .ht{fill:#ff5a7a;stroke:#ff5a7a;scale:1.2}
#alive .on .sw{background:#7cf0b6}
#alive .on .kn{translate:20px}
#alive .on .bx{background:#7cf0b6}
#alive .on .tk{stroke-dashoffset:0}
#alive .fix .ht{transition:scale .45s linear(0, 1.3 30%, .9 55%, 1.04 78%, 1)}
#alive .fix .kn{transition:translate .4s cubic-bezier(.34, 1.56, .64, 1)}
#alive .fix.on .kn{animation:tip-squash .4s}
#alive .fix .tk{transition:stroke-dashoffset .4s cubic-bezier(.65, 0, .35, 1)}
@keyframes tip-squash{40%{scale:1.3 .8}}`,
    html: `
<div class="pair">${['', ' fix'].map((f) => `
  <div class="pane${f}"><span class="tag${f ? ' ok' : ''}">${f ? 'With the motion' : 'Before'}</span>
    <svg class="ht" viewBox="0 0 86 86" aria-hidden="true"><path d="M43 74 C14 54 6 40 6 28 C6 16 15 8 26 8 C34 8 40 13 43 19 C46 13 52 8 60 8 C71 8 80 16 80 28 C80 40 72 54 43 74Z"/></svg>
    <div class="sw"><div class="kn"></div></div>
    <svg class="bx" viewBox="0 0 26 26" aria-hidden="true"><path class="tk" d="M7 13.5 L11.5 18 L19.5 9"/></svg>
  </div>`).join('')}
</div>
<button class="play" type="button">Tap all three</button>`,
    js: `function(root, btn){ btn.addEventListener('click', function(){ var panes = root.querySelectorAll('.pane'), on = !panes[0].classList.contains('on');
  panes.forEach(function(p){ p.classList.toggle('on', on); }); btn.textContent = on ? 'Tap all three again' : 'Tap all three'; }); }`,
  },
  menus: {
    css: `
#menus .pane{height:150px;padding:30px 12px 0}
#menus .tabs{position:relative;display:flex;gap:14px;font-weight:700;font-size:13px;color:#9aa0b8}
#menus .ink{position:absolute;left:0;top:20px;width:44px;height:3px;border-radius:2px;background:#7cf0b6}
#menus .ac{margin-top:16px;border-radius:8px;background:#262b40;font-size:12px;font-weight:700}
#menus .ac b{display:block;padding:6px 8px}
#menus .panel{display:grid;grid-template-rows:0fr}
#menus .panel > div{overflow:hidden;color:#9aa0b8;padding:0 8px}
#menus .menu{list-style:none;margin:10px 0 0;padding:0;display:flex;gap:6px;font-size:12px;font-weight:700}
#menus .menu li{opacity:0;translate:0 -8px;padding:3px 7px;border-radius:6px;background:#262b40}
#menus .on .ink{translate:96px;width:30px}
#menus .on .panel{grid-template-rows:1fr}
#menus .on .menu li{opacity:1;translate:0}
#menus .fix .ink{transition-property:translate,width;transition-duration:.45s;transition-timing-function:cubic-bezier(.22, 1, .36, 1)}
#menus .fix .panel{transition:grid-template-rows .4s cubic-bezier(.4, 0, .2, 1)}
#menus .fix .menu li{transition:opacity .3s,translate .3s;transition-timing-function:ease-out;transition-delay:calc(var(--i) * 60ms)}`,
    html: `
<div class="pair">${['', ' fix'].map((f) => `
  <div class="pane${f}"><span class="tag${f ? ' ok' : ''}">${f ? 'With the motion' : 'Before'}</span>
    <div class="tabs"><span>For you</span><span>Following</span><span>Live</span><i class="ink"></i></div>
    <div class="ac"><b>Shipping</b><div class="panel"><div>Free over 30 days.</div></div></div>
    <ul class="menu"><li style="--i:0">Share</li><li style="--i:1">Rename</li><li style="--i:2">Delete</li></ul>
  </div>`).join('')}
</div>
<button class="play" type="button">Tap all three</button>`,
    js: `function(root, btn){ btn.addEventListener('click', function(){ var panes = root.querySelectorAll('.pane'), on = !panes[0].classList.contains('on');
  panes.forEach(function(p){ p.classList.toggle('on', on); }); btn.textContent = on ? 'Tap all three again' : 'Tap all three'; }); }`,
  },
  expensive: {
    css: `
#expensive .pane{display:flex;flex-direction:column;align-items:center;gap:12px;height:190px;padding-top:30px;overflow:hidden;position:relative}
#expensive .fld{position:relative;width:150px;height:34px;border-radius:9px;background:#11402f}
#expensive .fld i{position:absolute;left:10px;top:0;font-size:12px;line-height:34px;color:#c2ded1;font-style:normal;transform-origin:0 50%}
#expensive .fld b{position:absolute;left:10px;top:6px;font-size:12px;line-height:34px;opacity:0}
#expensive .cnt{height:22px;width:22px;border-radius:11px;background:#ff7a6b;overflow:hidden;font-weight:800;font-size:13px;line-height:22px;text-align:center;color:#fff}
#expensive .cnt span{display:block}
#expensive .sh{position:absolute;left:12%;right:12%;bottom:0;height:46px;border-radius:12px 12px 0 0;background:#0f3828;font-size:12px;line-height:46px;text-align:center;translate:0 100%}
#expensive .on .fld i{translate:0 -10px;scale:.7}
#expensive .on .fld b{opacity:1}
#expensive .on .cnt span{translate:0 -22px}
#expensive .on .sh{translate:0}
#expensive .fix .fld i{transition:translate .3s,scale .3s;transition-timing-function:cubic-bezier(.2, 0, 0, 1)}
#expensive .fix .cnt span{transition:translate .4s cubic-bezier(.34, 1.56, .64, 1)}
#expensive .fix .sh{transition:translate .6s linear(0, 1.08 40%, .98 65%, 1)}`,
    html: `
<div class="pair">${['', ' fix'].map((f) => `
  <div class="pane${f}"><span class="tag${f ? ' ok' : ''}">${f ? 'With the motion' : 'Before'}</span>
    <div class="fld"><i>Email</i><b>mira@mail.com</b></div><div class="cnt"><span>3</span><span>4</span></div><div class="sh">Share to story</div>
  </div>`).join('')}
</div>
<button class="play" type="button">Play all three</button>`,
    js: `function(root, btn){ btn.addEventListener('click', function(){ var panes = root.querySelectorAll('.pane'), on = !panes[0].classList.contains('on');
  panes.forEach(function(p){ p.classList.toggle('on', on); }); btn.textContent = on ? 'Reset' : 'Play all three'; }); }`,
  },
  waiting: {
    css: `
#waiting .pane{display:flex;flex-direction:column;align-items:center;gap:10px;height:170px;padding-top:30px;overflow:hidden}
#waiting .send{width:110px;height:30px;border-radius:15px;background:#7cf0b6;color:#10131c;font-weight:700;font-size:13px;line-height:30px;text-align:center;overflow:hidden;white-space:nowrap}
#waiting .img{width:90px;height:44px;border-radius:8px;background:linear-gradient(180deg,#ffb38a,#ff7eb3 55%,#7a5cff);opacity:0;scale:1.06}
#waiting .toast{padding:5px 10px;border-radius:8px;background:#262b40;font-size:12px;font-weight:700;translate:0 120%;opacity:0}
#waiting .on .send{width:30px}
#waiting .on .img{opacity:1;scale:1}
#waiting .on .toast{translate:0;opacity:1}
#waiting .fix .send{transition:width .5s cubic-bezier(.65, 0, .35, 1)}
#waiting .fix .img{transition:opacity .5s,scale .5s;transition-timing-function:cubic-bezier(.2, .7, .3, 1)}
#waiting .fix .toast{transition:translate .5s cubic-bezier(.2, .9, .3, 1.25),opacity .2s}`,
    html: `
<div class="pair">${['', ' fix'].map((f) => `
  <div class="pane${f}"><span class="tag${f ? ' ok' : ''}">${f ? 'With the motion' : 'Before'}</span>
    <div class="send">Send</div><div class="img"></div><div class="toast">Saved to your list</div>
  </div>`).join('')}
</div>
<button class="play" type="button">Send it</button>`,
    js: `function(root, btn){ btn.addEventListener('click', function(){ var panes = root.querySelectorAll('.pane'), on = !panes[0].classList.contains('on');
  panes.forEach(function(p){ p.classList.toggle('on', on); }); btn.textContent = on ? 'Reset' : 'Send it'; }); }`,
  },
  // the press demo (showreel-34-press, 12 Nov 2026): the same Pay button with and without the :active scale
  press: {
    css: `
#press .pane{display:flex;align-items:center;justify-content:center;height:130px}
#press .pay{width:84%;height:52px;border:0;border-radius:26px;background:#7cf0b6;color:#111214;font:700 18px system-ui,-apple-system,"Segoe UI",sans-serif;cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:0 5px 0 #2f9c72,0 12px 18px #0008}
#press .fix .pay{transition:.12s}
#press .fix .pay:active{scale:.96;box-shadow:0 2px 6px #0006;filter:brightness(.92)}`,
    html: `
<div class="pair">
  <div class="pane"><span class="tag">No :active</span><button class="pay" type="button">Pay $64.00</button></div>
  <div class="pane fix"><span class="tag ok">:active { scale: .96 } + shadow</span><button class="pay" type="button">Pay $64.00</button></div>
</div>
<p class="note">Press and hold each button. The left one gives no sign the tap landed; the right one sinks under your finger, its shadow collapsing, and springs back when you let go.</p>`,
    // Safari on iOS applies :active only when the page listens for touchstart (BCD css.selectors.active, safari_ios note)
    js: `function(){ document.addEventListener('touchstart', function(){}, { passive: true }); }`,
  },
  // the list demo (showreel-35-list, 13 Nov 2026): delete a row with and without the grid-template-rows collapse
  list: {
    css: `
#list .pane{padding:8px}
#list ul{list-style:none;margin:0;padding:0}
#list li{display:grid;grid-template-rows:1fr}
#list li>div{overflow:hidden}
#list li span{display:flex;justify-content:space-between;align-items:center;margin:0 0 6px;padding:10px 12px;border-radius:12px;background:#ffffff12;font:600 15px system-ui,-apple-system,"Segoe UI",sans-serif}
#list li button{border:0;border-radius:50%;width:26px;height:26px;background:#ffffff1a;color:inherit;cursor:pointer}
#list .fix li{transition:.3s}
#list .fix li.gone{grid-template-rows:0fr;opacity:0}`,
    html: `
<div class="pair">
  ${['', 'fix'].map((c) => `<div class="pane ${c}"><span class="tag${c ? ' ok' : ''}">${c ? 'Collapse, then remove' : 'Remove at once'}</span><ul>${['Mia', 'Leo', 'Ava', 'Noah', 'Zoe'].map((n) => `<li><div><span>${n}<button type="button" aria-label="Delete ${n}">×</button></span></div></li>`).join('')}</ul></div>`).join('')}
</div>
<button class="play" type="button">Reset</button>
<p class="note">Tap × in each list. On the left the row is removed at once and every row under it jumps up; on the right it fades while its grid row collapses to 0fr, and it is removed on transitionend.</p>`,
    js: `function(root, btn){ var html = [].map.call(root.querySelectorAll('ul'), function(u){ return u.innerHTML; });
  root.addEventListener('click', function(e){ var b = e.target.closest('li button'); if (!b) return; var li = b.closest('li');
    if (!li.closest('.fix')) { li.remove(); return; }
    li.addEventListener('transitionend', function(){ li.remove(); }, { once: true }); li.classList.add('gone'); });
  btn.addEventListener('click', function(){ root.querySelectorAll('ul').forEach(function(u, i){ u.innerHTML = html[i]; }); }); }`,
  },
  tabs: {
    css: `
#tabs .bar{position:relative;display:flex;justify-content:space-around;border-bottom:1px solid #ffffff1f}
#tabs .bar button{border:0;background:none;color:inherit;padding:12px 10px;font:600 15px system-ui,-apple-system,"Segoe UI",sans-serif;cursor:pointer;opacity:.7;border-bottom:3px solid transparent}
#tabs .bar button.on{opacity:1}
#tabs .bad button.on{border-bottom-color:currentColor}
#tabs .ink{position:absolute;left:0;bottom:-1px;width:1px;height:3px;background:currentColor;transform-origin:left;transition:transform .3s}`,
    html: `
<div class="pair">
  ${['bad', 'fix'].map((c) => `<div class="pane ${c}"><span class="tag${c === 'fix' ? ' ok' : ''}">${c === 'fix' ? 'One line, translateX + scaleX' : 'A border on each tab'}</span><div class="bar">${['For you', 'Following', 'Saved'].map((n, i) => `<button type="button"${i ? '' : ' class="on"'}>${n}</button>`).join('')}${c === 'fix' ? '<span class="ink"></span>' : ''}</div></div>`).join('')}
</div>
<p class="note">Tap the tabs in each bar. On the left each tab draws its own border, so the line blinks from tab to tab; on the right one line slides to the tapped tab and stretches to its width.</p>`,
    js: `function(root){ root.querySelectorAll('.bar').forEach(function(bar){ var ink = bar.querySelector('.ink');
    function go(b){ bar.querySelectorAll('button').forEach(function(x){ x.classList.toggle('on', x === b); });
      if (ink) ink.style.transform = 'translateX(' + b.offsetLeft + 'px) scaleX(' + b.offsetWidth + ')'; }
    bar.addEventListener('click', function(e){ var b = e.target.closest('button'); if (b) go(b); });
    if (ink) { ink.style.transition = 'none'; go(bar.querySelector('button')); ink.getBoundingClientRect(); ink.style.transition = ''; } }); }`,
  },
  fontswap: {
    css: `
#fontswap .page{padding:12px 4px}
#fontswap h4{margin:0 0 10px;font:700 19px/26px Arial,Helvetica,"Liberation Sans",Roboto,sans-serif}
#fontswap h4.web{font-family:Verdana,"DejaVu Sans","Segoe UI",Tahoma,sans-serif;letter-spacing:.03em}
#fontswap .fix h4:not(.web){font-family:"Demo Fallback",Arial,sans-serif}
#fontswap .go{border:0;border-radius:18px;padding:8px 16px;font-weight:700;background:#5ff2b0;color:#0b0b10}`,
    html: `
<div class="pair">
  ${['bad', 'fix'].map((c) => `<div class="pane ${c}"><span class="tag${c === 'fix' ? ' ok' : ''}">${c === 'fix' ? 'Backup font with size-adjust' : 'Plain backup font'}</span><div class="page"><h4 class="web">Your parcel is on its way and arrives by 6 pm</h4><button type="button" class="go">Track parcel</button></div></div>`).join('')}
</div>
<p><button type="button" class="reload">Reload both</button></p>
<p class="note">Tap Reload. Each page draws its headline in a backup font first and swaps in the wider web font 0.7 s later. On the left the lines rewrap and the button jumps; on the right the backup font is scaled with size-adjust (measured here from the two fonts, as a build tool does), so the lines stay put.</p>`,
    js: `function(root){ var h = root.querySelectorAll('h4'), timer = 0;
  var c = document.createElement('canvas').getContext('2d'), txt = h[0].textContent, cs = getComputedStyle(h[0]);
  c.font = "700 19px " + cs.fontFamily; var w1 = c.measureText(txt).width + txt.length * .57; c.font = '700 19px Arial,Helvetica,"Liberation Sans",Roboto,sans-serif'; var w0 = c.measureText(txt).width;
  var st = document.createElement('style'); st.textContent = '@font-face{font-family:"Demo Fallback";src:local("Arial"),local("Helvetica"),local("Liberation Sans"),local("Roboto");size-adjust:' + Math.round(w1 / w0 * 100) + '%}'; document.head.appendChild(st);
  root.querySelector('.reload').addEventListener('click', function(){ clearTimeout(timer); h.forEach(function(e){ e.classList.remove('web'); });
    timer = setTimeout(function(){ h.forEach(function(e){ e.classList.add('web'); }); }, 700); }); }`,
  },
  // the form demo (showreel-38-form, 16 Nov 2026): live validation with and without min-height: 1lh on the message
  form: {
    css: `
#form .pane{padding:10px}
#form input{box-sizing:border-box;width:100%;padding:9px 10px;border-radius:10px;border:2px solid #ffffff33;background:#ffffff12;color:inherit;font:600 15px system-ui,-apple-system,"Segoe UI",sans-serif}
#form input.bad{border-color:#ff7a6b}
#form .err{font:600 13px/20px system-ui,-apple-system,"Segoe UI",sans-serif;color:#ff8f82}
#form .fix .err{min-height:1lh}
#form .go{margin-top:6px;border:0;border-radius:18px;padding:8px 16px;font-weight:700;background:#5ff2b0;color:#0b0b10}`,
    html: `
<div class="pair">
  ${['', 'fix'].map((c) => `<div class="pane ${c}"><span class="tag${c ? ' ok' : ''}">${c ? '.error { min-height: 1lh }' : 'Empty message, 0 px'}</span><input type="email" placeholder="you@mail.com" aria-label="Email"><div class="err"></div><button type="button" class="go">Pay</button></div>`).join('')}
</div>
<p class="note">Type an email in each form. While it is not valid a message shows under the field. On the left the empty message is 0 px tall, so the Pay button jumps on every change; on the right the message keeps one line of room (1lh), so the button never moves.</p>`,
    js: `function(root){ root.querySelectorAll('input').forEach(function(i){ var e = i.parentNode.querySelector('.err');
  i.addEventListener('input', function(){ var bad = i.value !== '' && !/^[^@\\s]+@[^@\\s]+\\.[^@\\s]{2,}$/.test(i.value);
    e.textContent = bad ? 'Enter a valid email' : ''; i.classList.toggle('bad', bad); }); }); }`,
  },
  // the follow demo (showreel-39-follow, 17 Nov 2026): a toggle button with its two words stacked in one grid cell
  follow: {
    css: `
#follow .pane{padding:10px}
#follow .row{display:flex;gap:6px;align-items:center}
#follow .row button{border:0;border-radius:18px;padding:8px 12px;font:700 14px system-ui,-apple-system,"Segoe UI",sans-serif;white-space:nowrap;cursor:pointer}
#follow .fol{background:#5ff2b0;color:#0b0b10}
#follow .msg{background:#ffffff1f;color:inherit}
#follow .fix .fol{display:inline-grid}
#follow .fix .fol span{grid-area:1 / 1}
#follow .fix .fol .off{visibility:hidden}`,
    html: `
<div class="pair">
  ${['', 'fix'].map((c) => `<div class="pane ${c}"><span class="tag${c ? ' ok' : ''}">${c ? 'Both words in one cell' : 'One word at a time'}</span><div class="row"><button type="button" class="fol">${c ? '<span>Follow</span><span class="off">Following</span>' : '<span>Follow</span>'}</button><button type="button" class="msg">Message</button></div></div>`).join('')}
</div>
<p class="note">Tap Follow in each row. On the left the button grows to fit "Following" and Message slides away (and back on the next tap); on the right both words share one grid cell, the hidden one with visibility: hidden, so the button is always as wide as "Following" and Message stays put.</p>`,
    js: `function(root){ root.querySelectorAll('.fol').forEach(function(b){ var fix = !!b.closest('.fix');
  b.addEventListener('click', function(){ var on = b.dataset.on !== '1'; b.dataset.on = on ? '1' : '';
    b.innerHTML = fix ? '<span' + (on ? ' class="off"' : '') + '>Follow</span><span' + (on ? '' : ' class="off"') + '>Following</span>' : '<span>' + (on ? 'Following' : 'Follow') + '</span>'; }); }); }`,
  },
  // the gradient demo (showreel-41-gradient, 19 Nov 2026): the same two colours blended in sRGB and in oklch, turned together
  gradient: {
    css: `
#gradient .bar{height:96px;margin:8px 10px;border-radius:12px}
#gradient .bar.a{background:linear-gradient(var(--ang, 90deg), blue, yellow)}
#gradient .bar.b{background:linear-gradient(in oklch var(--ang, 90deg), blue, yellow)}`,
    html: `
<div class="pair">
  <div class="pane"><span class="tag">Default (sRGB)</span><div class="bar a"></div></div>
  <div class="pane fix"><span class="tag ok">in oklch</span><div class="bar b"></div></div>
</div>
<button class="play" type="button">Turn both</button>
<p class="note">Both bars are blue to yellow. The left one is blended in sRGB, so its middle is a flat grey; the right one says in oklch, so the middle stays colourful. The button turns both gradients together.</p>`,
    js: `function(root, btn){ var a = 90; btn.addEventListener('click', function(){ a = (a + 40) % 360; root.style.setProperty('--ang', a + 'deg'); }); }`,
  },
  // the snap-back demo (showreel-42-snapback, 20 Nov 2026): the same slide-in keyframes on two menus, one with animation-fill-mode: forwards
  snapback: {
    css: `
#snapback .stage{position:relative;height:92px;margin:8px 10px;overflow:hidden;border-radius:12px;background:rgba(255,255,255,.07)}
#snapback .drawer{position:absolute;left:0;top:0;bottom:0;width:46%;border-radius:0 12px 12px 0;background:#3a6fd8;transform:translateX(-110%);color:#fff;font:700 15px/1 system-ui,sans-serif;padding:14px}
@keyframes slide-in-42{from{transform:translateX(-110%)}to{transform:translateX(0)}}
#snapback .stage.go .drawer{animation:slide-in-42 .5s}
#snapback .stage.go.fix .drawer{animation:slide-in-42 .5s forwards}`,
    html: `
<div class="pair">
  <div class="pane"><span class="tag">animation: slide-in .5s</span><div class="stage"><div class="drawer">Menu</div></div></div>
  <div class="pane fix"><span class="tag ok">... .5s forwards</span><div class="stage fix"><div class="drawer">Menu</div></div></div>
</div>
<button class="play" type="button">Open both menus</button>
<p class="note">Tap the button. Both menus run the same slide-in keyframes. On the left the menu jumps back off-screen the moment the animation ends, because without a fill mode the element returns to its own style; on the right the word forwards keeps the last keyframe, so the menu stays open.</p>`,
    js: `function(root, btn){ btn.addEventListener('click', function(){ root.querySelectorAll('.stage').forEach(function(st){ st.classList.remove('go'); void st.offsetWidth; st.classList.add('go'); }); }); }`,
  },
  // the double-tap zoom demo (showreel-43-tapzoom, 21 Nov 2026): a simulation, two like buttons; two quick taps zoom the left page (what a phone does) and not the one with touch-action: manipulation
  tapzoom: {
    css: `
#tapzoom .stage{position:relative;height:92px;margin:8px 10px;overflow:hidden;border-radius:12px;background:rgba(255,255,255,.07)}
#tapzoom .pg{position:absolute;inset:0;transform-origin:88% 22%;transition:transform .35s cubic-bezier(.2,.8,.2,1)}
#tapzoom .stage.z .pg{transform:scale(1.9)}
#tapzoom .n{position:absolute;left:14px;top:12px;font:800 34px/1 system-ui,sans-serif;color:#fff}
#tapzoom .like{position:absolute;right:12px;top:10px;width:38px;height:38px;border-radius:50%;border:0;background:#c76cf0;color:#240838;font:700 18px/1 system-ui,sans-serif;touch-action:auto}
#tapzoom .fix .like{touch-action:manipulation}
#tapzoom .row{position:absolute;left:14px;right:14px;bottom:10px;height:20px;border-radius:7px;background:rgba(255,255,255,.14)}`,
    html: `
<div class="pair">
  <div class="pane"><span class="tag">touch-action: auto</span><div class="stage" data-fix="0"><div class="pg"><div class="n">12</div><button class="like" type="button">&#9829;</button><div class="row"></div></div></div></div>
  <div class="pane fix"><span class="tag ok">touch-action: manipulation</span><div class="stage fix" data-fix="1"><div class="pg"><div class="n">12</div><button class="like" type="button">&#9829;</button><div class="row"></div></div></div></div>
</div>
<p class="note">Tap a heart twice, fast. Phones read two quick taps on the same spot as a double-tap and zoom the page (here the left page simulates it); with touch-action: manipulation on the button the taps just count. On a real phone the zoom is the browser's own.</p>`,
    js: `function(root){ root.querySelectorAll('.stage').forEach(function(st){ var last = 0, n = 12; st.querySelector('.like').addEventListener('click', function(){ var now = Date.now(); n++; st.querySelector('.n').textContent = n; if (st.dataset.fix === '0' && now - last < 450) st.classList.toggle('z'); last = now; }); }); }`,
  },
  // the dark-mode flash demo (showreel-44-darkflash, 22 Nov 2026): a simulation, two dark pages that "reload"; the left one paints its default white canvas for a moment first (a page with no colour-scheme), the right one (meta color-scheme) stays dark
  darkflash: {
    css: `
#darkflash .stage{position:relative;height:92px;margin:8px 10px;overflow:hidden;border-radius:12px;background:#15101c}
#darkflash .pg{position:absolute;inset:0;padding:12px 14px}
#darkflash .pg b{display:block;font:800 22px/1 system-ui,sans-serif;color:#fff}
#darkflash .pg i{display:block;margin-top:9px;height:16px;border-radius:6px;background:rgba(255,255,255,.14)}
#darkflash .white{position:absolute;inset:0;background:#e6e2d8;opacity:0}
#darkflash .stage[data-fix="0"].go .white{animation:dfflash 1s ease both}
#darkflash .stage.go .pg{animation:dfpage 1s ease both}
@keyframes dfflash{0%{opacity:0}30%{opacity:1}60%{opacity:1}100%{opacity:0}}
@keyframes dfpage{0%,40%{opacity:0}100%{opacity:1}}`,
    html: `
<div class="pair">
  <div class="pane"><span class="tag">no meta tag</span><div class="stage" data-fix="0"><div class="pg"><b>Today</b><i></i><i></i></div><div class="white"></div></div></div>
  <div class="pane fix"><span class="tag ok">meta color-scheme</span><div class="stage fix" data-fix="1"><div class="pg"><b>Today</b><i></i><i></i></div><div class="white"></div></div></div>
</div>
<button class="play" type="button">Reload both pages</button>
<p class="note">Tap the button. The left page blinks its default white canvas before the dark page arrives (simulated); the right page, whose head has &lt;meta name="color-scheme" content="dark light"&gt; before any CSS, stays dark. MDN: the tag helps prevent unwanted screen flashes during the page load.</p>`,
    js: `function(root, btn){ btn.addEventListener('click', function(){ root.querySelectorAll('.stage').forEach(function(st){ st.classList.remove('go'); void st.offsetWidth; st.classList.add('go'); }); }); }`,
  },
  // the home-bar demo (showreel-45-homebar, 23 Nov 2026): a simulation, two phone bottoms; the left bar sits flush so its button hides under the swipe line, the right one has padding-bottom: env(safe-area-inset-bottom)
  homebar: {
    css: `
#homebar .stage{position:relative;height:104px;margin:8px 10px;overflow:hidden;border-radius:12px;background:#1a1410}
#homebar .btn2{position:absolute;left:14px;right:14px;height:38px;border-radius:19px 19px 0 0;background:#f6b94a;color:#201400;font:700 15px/52px system-ui,sans-serif;text-align:center;bottom:0;transition:bottom .6s cubic-bezier(.3,1.4,.5,1);overflow:hidden}
#homebar .stage.go[data-fix="1"] .btn2{bottom:22px}
#homebar .pill{position:absolute;left:50%;margin-left:-34px;bottom:5px;width:68px;height:5px;border-radius:3px;background:#fff}`,
    html: `
<div class="pair">
  <div class="pane"><span class="tag">no safe-area padding</span><div class="stage" data-fix="0"><div class="btn2">Save the day</div><i class="pill"></i></div></div>
  <div class="pane fix"><span class="tag ok">env(safe-area-inset-bottom)</span><div class="stage fix" data-fix="1"><div class="btn2">Save the day</div><i class="pill"></i></div></div>
</div>
<button class="play" type="button">Add the padding</button>
<p class="note">Tap the button. The right bar gains padding-bottom: env(safe-area-inset-bottom) and its button lifts clear of the swipe line (simulated; on a real phone the inset is 0 where nothing covers the screen). MDN, env().</p>`,
    js: `function(root, btn){ btn.addEventListener('click', function(){ root.querySelectorAll('.stage').forEach(function(st){ st.classList.remove('go'); void st.offsetWidth; st.classList.add('go'); }); }); }`,
  },
  // the tab wiggle demo (showreel-46-tabwiggle, 24 Nov 2026): real CSS, two tab rows; each tap makes the next tab bold; the left row is laid out again and its tabs jump, the right row's tabs carry a hidden bold copy (::after, content: attr(data-text)) and stay put
  tabwiggle: {
    css: `
#tabwiggle .stage{margin:8px 10px;padding:14px 10px;border-radius:12px;background:#10171a;white-space:nowrap;overflow:hidden}
#tabwiggle .tab{display:inline-block;margin-right:12px;font:400 17px/1.4 system-ui,sans-serif;color:#b9c4c1;text-align:center}
#tabwiggle .tab.on{font-weight:800;color:#5fe3c0}
#tabwiggle .fix .tab::after{content:attr(data-text);font-weight:800;display:block;height:0;visibility:hidden}`,
    html: `
<div class="pair">
  <div class="pane"><span class="tag">bold only</span><div class="stage"><span class="tab on" data-text="Following">Following</span><span class="tab" data-text="Popular">Popular</span><span class="tab" data-text="New">New</span></div></div>
  <div class="pane fix"><span class="tag ok">hidden bold copy</span><div class="stage fix"><span class="tab on" data-text="Following">Following</span><span class="tab" data-text="Popular">Popular</span><span class="tab" data-text="New">New</span></div></div>
</div>
<button class="play" type="button">Tap the next tab</button>
<p class="note">Tap the button a few times. On the left the bold tab is wider, so the tabs after it jump. On the right every tab has a hidden bold copy of its label (::after with content: attr(data-text)), so it is always as wide as its bold self and nothing moves. MDN, attr().</p>`,
    js: `function(root, btn){ var n = 0; btn.addEventListener('click', function(){ n = (n + 1) % 3; root.querySelectorAll('.stage').forEach(function(st){ st.querySelectorAll('.tab').forEach(function(t, i){ t.classList.toggle('on', i === n); }); }); }); }`,
  },
  // the user-invalid demo (showreel-47-user-invalid, 25 Nov 2026): real CSS, two sign-up forms; the left one styles input:invalid, so its empty required fields are red at once; the right one styles input:user-invalid, so a field turns red only after you type a bad value and leave it
  userinvalid: {
    css: `
#userinvalid .stage{margin:8px 10px;padding:12px 10px;border-radius:12px;background:#10171a}
#userinvalid input{display:block;width:100%;margin:0 0 8px;padding:8px 10px;border-radius:8px;border:2px solid #3a4448;background:#161d20;color:#e8efed;font:500 15px/1.2 system-ui,sans-serif}
#userinvalid .bad input:invalid{border-color:#ff5f6d;background:#2a171b}
#userinvalid .fix input:user-invalid{border-color:#ff5f6d;background:#2a171b}`,
    html: `
<div class="pair">
  <div class="pane"><span class="tag">input:invalid</span><div class="stage bad"><input type="text" required placeholder="Name" aria-label="Name"><input type="email" required placeholder="Email" aria-label="Email"></div></div>
  <div class="pane fix"><span class="tag ok">input:user-invalid</span><div class="stage fix"><input type="text" required placeholder="Name" aria-label="Name"><input type="email" required placeholder="Email" aria-label="Email"></div></div>
</div>
<p class="note">The left form is red before you touch it: an empty required field is invalid from the first paint. The right form stays dark. Type "ada@" in its email field and click away: only then does it turn red. MDN, :user-invalid (Chrome 119, Firefox 88, Safari 16.5).</p>`,
    js: `function(root){}`,
  },
  // the has-parent demo (showreel-48-has-parent, 26 Nov 2026): real CSS, two option lists; the left one has no parent rule, so a ticked card looks the same; the right one styles .card:has(input:checked), so the whole card lights when its box is ticked
  hasparent: {
    css: `
#hasparent .stage{margin:8px 10px;padding:12px 10px;border-radius:12px;background:#10171a}
#hasparent label{display:flex;align-items:center;justify-content:space-between;margin:0 0 8px;padding:10px 12px;border-radius:10px;border:2px solid #3a4448;background:#161d20;color:#e8efed;font:600 15px/1.2 system-ui,sans-serif}
#hasparent .fix label:has(input:checked){border-color:#d79bff;background:#3b2468}`,
    html: `
<div class="pair">
  <div class="pane"><span class="tag">no parent rule</span><div class="stage bad"><label>Oat milk<input type="checkbox" checked></label><label>Extra shot<input type="checkbox" checked></label></div></div>
  <div class="pane fix"><span class="tag ok">.card:has(input:checked)</span><div class="stage fix"><label>Oat milk<input type="checkbox" checked></label><label>Extra shot<input type="checkbox" checked></label></div></div>
</div>
<p class="note">Both lists have every box ticked. On the left the cards stay dull, because CSS could not style a parent from its child. On the right label:has(input:checked) lights the whole card; untick a box and its card dims at once. MDN, :has() (Chrome 105, Firefox 121, Safari 15.4).</p>`,
    js: `function(root){}`,
  },
};
