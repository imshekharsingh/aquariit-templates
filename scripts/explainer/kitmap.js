// ---- @techin20sec 2.5D map kit (scripts/explainer/kitmap.js; task 22, 28 Nov 2026; review/tech/kit-2d5-depth.md) ----
// Why: the 2.5D map look (design/direction.md "2.5D map reels") wins on structure, pace and zero glitches, but its cards are flat outlines.
// The 3D kit v7 won on depth and material. This kit borrows those into 2.5D, as opt-in pieces (a reel without the kitmap markers is unchanged):
//   KMAP.card(el, o)            gives a card light, depth and a material: o.mat 'glass' | 'satin' | 'metal', o.hue (CSS colour of its world),
//                               o.r radius (px). A soft key light from the top left (a sheen and a lit top edge), a darker lower edge, an
//                               outline that can trace itself, and a two-layer contact shadow (tight + soft) placed under it in its parent.
//                               The card must be position:absolute with left / top / width / height set in px. Returns a handle h.
//   KMAP.build(h, t, t0, o)     the shadow-first build (direction.md note 7): o.tier 1 (default; cards, nodes, panels): the shadow lands, the
//                               outline traces, the fill and the content arrive, a small settle, over o.d (default .45 s); o.tier 2 (lines,
//                               labels, small icons): a light build with its shadow over .2 s. Before t0 the card is not there; after, it
//                               breathes (a slow 1 px idle). o.lift (0..1) raises it (the shadow softens and spreads). Every value is
//                               continuous in t: no pops, no random, no wraps.
//   KMAP.object(host, o)        ONE "object moment" per reel, for topics about a real thing: a CSS 3D object (o.kind 'phone' | 'chip' | 'card')
//                               under the same key light, with a contact shadow, entering shadow-first at o.t0 and turning slowly from o.from to
//                               o.to degrees over o.d (default 1.6 s), then settling. o.x, o.y its centre, o.s its scale, o.hue its accent,
//                               o.screen optional HTML for the phone's face. Returns { draw(t), el }.
// Inlined into a scene's main script between the kitmap markers (scripts/channel3/kit-inline.mjs).
var KMAP = (function(){
  var cl = function(v){ return v < 0 ? 0 : v > 1 ? 1 : v; }, P = function(t, a, b){ return b <= a ? (t >= a ? 1 : 0) : cl((t - a) / (b - a)); },
      out3 = function(k){ return 1 - Math.pow(1 - k, 3); }, inOut = function(k){ return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; },
      settle = function(k){ return 1 - Math.pow(1 - k, 3) * (1 + 1.6 * k); };   // ends at 1 with a small, smooth overshoot under 4 %
  var MAT = {   // the light falls from the top left: a sheen, a lit top edge, a darker lower edge; never more than three in a reel
    glass: function(h){ return { bg: 'linear-gradient(160deg,rgba(255,255,255,.13),rgba(255,255,255,.03) 42%,rgba(0,0,0,.18)),' + 'linear-gradient(' + h + '22,' + h + '0d),#14161d',
      edge: 'inset 0 1px 0 rgba(255,255,255,.22),inset 0 -1.5px 0 rgba(0,0,0,.45),inset 0 0 0 1px ' + h + '55' }; },
    satin: function(h){ return { bg: 'radial-gradient(120% 90% at 18% 0%,rgba(255,255,255,.16),rgba(255,255,255,0) 55%),linear-gradient(170deg,' + h + '3a,' + h + '18 60%,rgba(0,0,0,.25)),#191b22',
      edge: 'inset 0 1px 0 rgba(255,255,255,.18),inset 0 -2px 0 rgba(0,0,0,.4),inset 0 0 0 1px rgba(255,255,255,.07)' }; },
    metal: function(h){ return { bg: 'linear-gradient(165deg,#3a3d46,#23252c 38%,#2e3038 62%,#1a1c22),linear-gradient(' + h + '18,' + h + '18)',
      edge: 'inset 0 1px 0 rgba(255,255,255,.3),inset 0 -2px 0 rgba(0,0,0,.55),inset 0 0 0 1px rgba(255,255,255,.1)' }; } };
  function px(v){ return parseFloat(v) || 0; }
  function card(el, o){ o = o || {}; var hue = o.hue || '#7aa2ff', m = (MAT[o.mat] || MAT.glass)(hue), r = o.r == null ? 18 : o.r, par = el.parentNode;
    var x = px(el.style.left), y = px(el.style.top), w = px(el.style.width) || el.offsetWidth, hh = px(el.style.height) || el.offsetHeight;
    // the contact shadow: tight (where it touches) and soft (the light's spread), its own layer under the card
    var sh = document.createElement('div'), tight = document.createElement('div'), soft = document.createElement('div');
    sh.setAttribute('aria-hidden', 'true'); sh.style.cssText = 'position:absolute;left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;height:' + hh + 'px;pointer-events:none;opacity:0';
    soft.style.cssText = 'position:absolute;left:-6%;right:-6%;top:4%;bottom:-22%;background:radial-gradient(closest-side,rgba(0,0,0,.34),rgba(0,0,0,.14) 70%,rgba(0,0,0,0))';   // gradients, not blur filters (cheap to render, no blur stacks)
    tight.style.cssText = 'position:absolute;left:2%;right:2%;top:10%;bottom:-5%;border-radius:' + (r + 6) + 'px;background:radial-gradient(farthest-side,rgba(0,0,0,.42) 78%,rgba(0,0,0,0))';
    sh.appendChild(soft); sh.appendChild(tight); par.insertBefore(sh, el);
    // the fill and the traced outline, behind the card's own content
    var fill = document.createElement('div'), ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg'), rect = document.createElementNS(ns, 'rect');
    fill.style.cssText = 'position:absolute;inset:0;border-radius:' + r + 'px;background:' + m.bg + ';box-shadow:' + m.edge + ';pointer-events:none;opacity:0';
    svg.setAttribute('width', w); svg.setAttribute('height', hh); svg.style.cssText = 'position:absolute;left:0;top:0;overflow:visible;pointer-events:none';
    rect.setAttribute('x', 1); rect.setAttribute('y', 1); rect.setAttribute('width', w - 2); rect.setAttribute('height', hh - 2); rect.setAttribute('rx', r - 1);
    rect.setAttribute('fill', 'none'); rect.setAttribute('stroke', hue); rect.setAttribute('stroke-width', 1.6); rect.setAttribute('stroke-opacity', .85);
    var per = 2 * (w + hh - 4) - (8 - 2 * Math.PI) * (r - 1); rect.setAttribute('stroke-dasharray', per.toFixed(1)); rect.setAttribute('stroke-dashoffset', per.toFixed(1));
    svg.appendChild(rect); el.insertBefore(svg, el.firstChild); el.insertBefore(fill, el.firstChild);
    el.style.borderRadius = r + 'px'; el.style.background = 'none'; el.style.boxShadow = 'none';
    var kids = [].filter.call(el.children, function(c){ return c !== fill && c !== svg; });
    kids.forEach(function(c){ if (getComputedStyle(c).position === 'static') c.style.position = 'relative'; c.style.zIndex = '1'; });   // above the fill and the outline
    return { el: el, sh: sh, soft: soft, tight: tight, fill: fill, rect: rect, per: per, kids: kids, seed: (x * 7.1 + y * 3.3) % 6.28 };
  }
  function build(h, t, t0, o){ o = o || {}; var tier = o.tier || 1, d = o.d || (tier === 1 ? .45 : .2), u = P(t, t0, t0 + d), lift = cl(o.lift || 0);
    var kS, kO, kF, kC, dy;
    if (tier === 1) { kS = out3(P(u, 0, .4)); kO = inOut(P(u, .12, .62)); kF = out3(P(u, .35, .8)); kC = out3(P(u, .55, 1)); dy = (1 - settle(P(u, .3, 1))) * -7; }
    else { kS = out3(u); kO = out3(u); kF = out3(u); kC = out3(u); dy = (1 - out3(u)) * -3; }
    var idle = u >= 1 ? Math.sin((t - t0 - d) * 1.3 + h.seed) * Math.min(1, (t - t0 - d) * 2) : 0;   // breathes once landed (starts from 0, no jump)
    var y = dy - lift * 6 + idle * .8;
    h.el.style.opacity = kO > 0 || kF > 0 ? '1' : '0'; h.el.style.transform = 'translateY(' + y.toFixed(2) + 'px)';
    h.rect.setAttribute('stroke-dashoffset', (h.per * (1 - kO)).toFixed(1)); h.rect.setAttribute('stroke-opacity', (.85 * (1 - .55 * kF)).toFixed(3));
    h.fill.style.opacity = kF.toFixed(3); h.kids.forEach(function(c){ c.style.opacity = kC.toFixed(3); });
    // the shadow: lands first, grows from small; lifted, the tight one fades and the soft one spreads
    h.sh.style.opacity = kS.toFixed(3); h.sh.style.transform = 'translateY(' + (lift * 6 + idle * .4).toFixed(2) + 'px) scale(' + (.86 + .14 * kS + .05 * lift).toFixed(4) + ')';
    h.tight.style.opacity = (1 - .7 * lift).toFixed(3); h.soft.style.opacity = (.75 + .25 * lift).toFixed(3);
    return u;
  }
  // ---- the object moment: a CSS 3D object under the key light ----
  function object(host, o){ o = o || {}; var kind = o.kind || 'phone', hue = o.hue || '#7aa2ff', S = o.s || 1, t0 = o.t0 || 0, d = o.d || 1.6,
      from = o.from == null ? -32 : o.from, to = o.to == null ? 10 : o.to, W = kind === 'phone' ? 150 : kind === 'chip' ? 150 : 210, H = kind === 'phone' ? 300 : kind === 'chip' ? 150 : 132,
      R = kind === 'phone' ? 28 : kind === 'chip' ? 14 : 14, D = kind === 'phone' ? 12 : kind === 'chip' ? 14 : 4, N = 6;
    var wrap = document.createElement('div'), sh = document.createElement('div'), obj = document.createElement('div'), face = document.createElement('div'), sheen = document.createElement('div');
    wrap.setAttribute('aria-hidden', 'true'); wrap.setAttribute('data-key', 'object');
    wrap.style.cssText = 'position:absolute;left:' + ((o.x || 270) - W / 2) + 'px;top:' + ((o.y || 480) - H / 2) + 'px;width:' + W + 'px;height:' + H + 'px;perspective:900px;opacity:0;transform:scale(' + S + ')';
    sh.style.cssText = 'position:absolute;left:8%;right:8%;top:' + (H * .92) + 'px;height:' + (H * .16) + 'px;border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.72),rgba(0,0,0,.3) 60%,rgba(0,0,0,0))';
    obj.style.cssText = 'position:absolute;inset:0;transform-style:preserve-3d';
    for (var i = 0; i < N; i++) { var L = document.createElement('div'), z = -D + i * D / (N - 1), shade = Math.round(26 + i * 4);   // the thickness: layered edges, darker at the back
      L.style.cssText = 'position:absolute;inset:0;border-radius:' + R + 'px;background:rgb(' + shade + ',' + (shade + 2) + ',' + (shade + 8) + ');transform:translateZ(' + z.toFixed(2) + 'px)';
      obj.appendChild(L); }
    face.style.cssText = 'position:absolute;inset:0;border-radius:' + R + 'px;transform:translateZ(' + (D / (N - 1) * .5).toFixed(2) + 'px);overflow:hidden;' +
      (kind === 'phone' ? 'background:#0b0c10;box-shadow:inset 0 0 0 5px #2b2e36,inset 0 0 0 6px rgba(255,255,255,.12)' :
       kind === 'chip' ? 'background:linear-gradient(160deg,#3b3e48,#22242b);box-shadow:inset 0 0 0 10px #2a2c33,inset 0 0 0 11px ' + hue + '66' :
       'background:linear-gradient(135deg,' + hue + ',' + hue + '88 60%,#1b1d24);box-shadow:inset 0 1px 0 rgba(255,255,255,.3)');
    if (kind === 'phone') face.innerHTML = '<div style="position:absolute;left:50%;top:10px;width:46px;height:12px;margin-left:-23px;border-radius:8px;background:#000"></div><div data-screen style="position:absolute;left:10px;right:10px;top:30px;bottom:14px;border-radius:18px;background:linear-gradient(170deg,' + hue + '30,#0f1117);overflow:hidden">' + (o.screen || '') + '</div>';
    else if (kind === 'chip') face.innerHTML = '<div style="position:absolute;left:30%;top:30%;right:30%;bottom:30%;border-radius:6px;background:' + hue + '30;box-shadow:inset 0 0 0 1.5px ' + hue + '"></div>';
    else face.innerHTML = '<div style="position:absolute;left:16px;top:44px;width:34px;height:26px;border-radius:5px;background:linear-gradient(135deg,#e8d39a,#b89a52)"></div>';
    sheen.style.cssText = 'position:absolute;inset:0;border-radius:' + R + 'px;pointer-events:none;background:linear-gradient(115deg,rgba(255,255,255,0) 30%,rgba(255,255,255,.16) 48%,rgba(255,255,255,0) 62%)';
    face.appendChild(sheen); obj.appendChild(face); wrap.appendChild(sh); wrap.appendChild(obj); host.appendChild(wrap);
    function draw(t){ var kS = out3(P(t, t0, t0 + .3)), kIn = out3(P(t, t0 + .12, t0 + .55)), kT = inOut(P(t, t0, t0 + d)), idle = Math.sin(Math.max(0, t - t0 - d) * 1.1) * Math.min(1, Math.max(0, t - t0 - d) * 1.5);
      var ry = from + (to - from) * kT + idle * 2, rx = 9 - 3 * kT, y = (1 - kIn) * -26;
      wrap.style.opacity = Math.max(kS, kIn).toFixed(3);
      obj.style.opacity = kIn.toFixed(3); obj.style.transform = 'translateY(' + y.toFixed(2) + 'px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
      sh.style.opacity = (kS * (1 - .3 * (1 - kIn))).toFixed(3); sh.style.transform = 'scaleX(' + (.7 + .3 * kS - Math.abs(ry) / 400).toFixed(4) + ')';
      sheen.style.transform = 'translateX(' + ((ry - to) * 2.2).toFixed(2) + 'px)'; }   // the sheen slides as it turns: the light stays put
    return { draw: draw, el: wrap };
  }
  return { card: card, build: build, object: object, P: P, ease: { out3: out3, inOut: inOut, settle: settle } };
})();
