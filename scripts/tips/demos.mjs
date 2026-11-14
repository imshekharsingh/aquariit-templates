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
};
