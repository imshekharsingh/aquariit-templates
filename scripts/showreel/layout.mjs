// Layout checks shared by every channel's preflight (Mandatory Gate items 3 and 4, design/mandatory.md; owner, 7 Nov 2026).
// Every box is in 1080x1920 pixels. A box: { s: text, l, t, r, b, a: opacity, g: group } (group = the block the text belongs to:
// two pieces of one paragraph never count as overlapping). Frames: [{ t, texts: [box], subject, band, hook, keys: [box] }].
//   SAFE ZONE: every overlay text box and key action ([data-key]) inside x 60-960, y 250-1570 (Instagram's top bar, right-side buttons, caption);
//              the subject's own UI text may run off the frame's edges but never under the right-side buttons.
//   OVERLAP:   no two text boxes from different blocks intersect by more than 6 px each way.
//   BAND:      the subject's visible box ([data-subject], cut by any overflow clip, clip-path inset, bottom mask fade or data-visible-bottom)
//              never reaches into the subtitle band ([data-band]) while the band shows (30% opacity or more).
//   HOOK:      the hook ([data-hook]) never covers the subject.
//   SUBTITLES: the subtitle box ([data-subs]) shows text at 52 px or more (1080 wide) and at most 6 words on a line.
// Only boxes at 30% opacity or more count (a crossfade is not an overlap); a box wholly off the frame is not seen.
export const SAFE = { l: 60, r: 960, t: 250, b: 1570 }, MIN_A = .3, TOL = 6;

// runs in the page (stills.mjs): the boxes at this moment, scaled from the viewport to 1080 wide
export const collectDom = () => {
  const k = 1080 / innerWidth, H = innerHeight * k, op = (e) => { let a = 1; for (; e && e.nodeType === 1; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return 0; a *= +cs.opacity; } return a; };
  const box = (r, s, a, g) => ({ s, l: r.left * k, t: r.top * k, r: r.right * k, b: r.bottom * k, a, g });
  const vis = (b) => b.r > 0 && b.l < 1080 && b.b > 0 && b.t < H && b.r - b.l >= 2 && b.b - b.t >= 2;
  // group = the nearest positioned box (a card, a label, the captions): texts inside one box are laid out together, so only boxes are compared
  const blocks = new Map(), group = (el) => { for (let e = el; e; e = e.parentElement) if (e === document.body || /absolute|fixed/.test(getComputedStyle(e).position)) { if (!blocks.has(e)) blocks.set(e, blocks.size); return blocks.get(e); } return -1; };
  // what is seen: the text's box cut by every parent that clips it (overflow other than visible; an ellipsis name, a card)
  // a fade or cut at the bottom: data-visible-bottom (viewport px), a clip-path inset(), or a top-to-bottom mask that ends transparent at N px
  const cutB = (e) => { const cs = getComputedStyle(e), r = e.getBoundingClientRect(); let y = Infinity;
    if (e.dataset && e.dataset.visibleBottom) y = Math.min(y, +e.dataset.visibleBottom);
    const ci = (cs.clipPath || '').match(/^inset\(\s*([\d.]+)px\s+([\d.]+)px\s+([\d.]+)px/); if (ci) y = Math.min(y, r.bottom - +ci[3]);
    const mk = cs.maskImage || cs.webkitMaskImage || ''; const g = mk.match(/linear-gradient\(([^]*)\)/), m = g && !/^\s*(to (top|left|right)|(?!180)[\d.]+deg)/.test(g[1]) && g[1].match(/rgba\(0,\s*0,\s*0,\s*0\)\s+([\d.]+)px/); if (m) y = Math.min(y, r.top + +m[1]);   // the computed style drops the default "to bottom"
    return y; };
  const clip = (el, r) => { let { left: l, top: t, right: R, bottom: B } = r; for (let e = el; e && e !== document.body; e = e.parentElement) { if (getComputedStyle(e).overflow !== 'visible') { const c = e.getBoundingClientRect(); l = Math.max(l, c.left); t = Math.max(t, c.top); R = Math.min(R, c.right); B = Math.min(B, c.bottom); } B = Math.min(B, cutB(e)); } return { left: l, top: t, right: R, bottom: B }; };
  // seen = not covered: at one of five points inside the box no element above it paints a solid background (a text under a panel or the
  // subtitle band's fade is hidden; a dashed outline or an empty box over it is not)
  const solid = (e) => { const cs = getComputedStyle(e), m = cs.backgroundColor.match(/[\d.]+/g) || [], a = m.length === 4 ? +m[3] : m.length ? 1 : 0; return (a >= .5 || cs.backgroundImage !== 'none') && op(e) >= .5; };
  const seen = (el, c) => [[.5, .5], [.2, .3], [.8, .3], [.2, .7], [.8, .7]].some(([u, v]) => { const x = c.left + (c.right - c.left) * u, y = c.top + (c.bottom - c.top) * v;
    if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) return false;
    for (const h of document.elementsFromPoint(x, y)) { if (h === el || el.contains(h) || h.contains(el)) return true; if (solid(h)) return false; } return true; });
  const texts = [], nodes = [], tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
  while ((n = tw.nextNode())) { const s = n.textContent.trim(), el = n.parentElement; if (!s || !el || /^(SCRIPT|STYLE)$/.test(el.tagName) || el.closest('[aria-hidden=true]')) continue;
    const rg = document.createRange(); rg.selectNodeContents(n); const c = clip(el, rg.getBoundingClientRect()), b = box(c, s.slice(0, 40), op(el), group(el));
    if (vis(b) && b.a >= .05 && seen(el, c)) { if (el.closest('[data-subject],[data-ui]') && !el.closest('[data-key]')) b.sub = 1;   /* data-ui: the subject's UI when it is not inside the data-subject box */ texts.push(b); nodes.push(el); } }
  const one = (sel) => { const e = document.querySelector(sel); if (!e) return null; const b = box(clip(e, e.getBoundingClientRect()), sel, op(e), -1);   /* the visible box: overflow, fade, cut */ return vis(b) ? b : { ...b, a: 0 }; };
  // canvas scenes (Turns Out) report the text they draw: window.__boxes() = [[text, left, right, top, bottom]] in CSS px
  if (window.__boxes) for (const [s, l, r, t, b] of window.__boxes()) { const q = { s: String(s).slice(0, 40), l: l * k, r: r * k, t: t * k, b: b * k, a: 1, g: -1 }; if (vis(q)) texts.push(q), nodes.push(null); }
  // the hook = the union of its own texts that are up (its words fade one by one)
  const hk = document.querySelector('[data-hook]'), hw = hk ? texts.filter((b, i) => b.a >= .3 && nodes[i] && hk.contains(nodes[i])) : [];
  const hook = !hk ? null : hw.length ? { s: 'hook', l: Math.min(...hw.map((b) => b.l)), t: Math.min(...hw.map((b) => b.t)), r: Math.max(...hw.map((b) => b.r)), b: Math.max(...hw.map((b) => b.b)), a: 1, g: -1 } : { s: 'hook', l: 0, t: 0, r: 0, b: 0, a: 0, g: -1 };
  // subtitles ([data-subs]): the smallest font on screen (px at 1080 wide) and the most words on one line
  const sb = document.querySelector('[data-subs]'); let subs = null;
  if (sb && op(sb) >= .3) { const rows = new Map(); let size = 1e9; const w2 = document.createTreeWalker(sb, NodeFilter.SHOW_TEXT); let q;
    while ((q = w2.nextNode())) { if (!q.textContent.trim() || op(q.parentElement) < .05) continue; size = Math.min(size, parseFloat(getComputedStyle(q.parentElement).fontSize) * k);
      for (const m of q.textContent.matchAll(/\S+/g)) { const r = document.createRange(); r.setStart(q, m.index); r.setEnd(q, m.index + m[0].length); const y = Math.round(r.getBoundingClientRect().top / 8); rows.set(y, (rows.get(y) || 0) + 1); } }
    if (rows.size) subs = { size: Math.round(size), words: Math.max(...rows.values()) }; }
  return { texts, subs, subject: one('[data-subject]'), band: one('[data-band]'), hook, keys: [...document.querySelectorAll('[data-key]')].map((e) => box(e.getBoundingClientRect(), e.dataset.key || e.id || 'key', op(e), -1)).filter((b) => vis(b) && b.a >= .3) };   // .3 = MIN_A, written out: this runs in the page
};

const cross = (a, b, tol = TOL) => Math.min(a.r, b.r) - Math.max(a.l, b.l) > tol && Math.min(a.b, b.b) - Math.max(a.t, b.t) > tol;
const px = (b) => `${Math.round(b.l)}-${Math.round(b.r)} x, ${Math.round(b.t)}-${Math.round(b.b)} y`;

// frames -> { lines: [printed lines], bad: number of problems }
export const judge = (frames, needMarks = true) => {   // needMarks false: a scene with no DOM subject (canvas, Python) gets BAND/HOOK as REVIEW items
  const safe = new Map(), over = new Map(), band = new Map(), hook = new Map(), subs = new Map(); let marked = false, hookMarked = false, subsMarked = false;
  const first = (m, k, v) => { if (!m.has(k)) m.set(k, v); };
  for (const f of frames) {
    const T = f.t.toFixed(1) + ' s', on = f.texts.filter((b) => b.a >= MIN_A);
    // overlay text and key actions: the whole safe zone. The subject's own UI text (inside [data-subject], not [data-key]) may run off the frame's
    // edges as the camera pushes in, but never under the right-side buttons (x past 960 between y 250 and 1570)
    for (const b of [...on, ...(f.keys || [])]) if (b.sub ? b.r > SAFE.r + 1 && b.b > SAFE.t && b.t < SAFE.b : b.l < SAFE.l - 1 || b.r > SAFE.r + 1 || b.t < SAFE.t - 1 || b.b > SAFE.b + 1) first(safe, b.s, `${T}: "${b.s}" at ${px(b)}${b.sub ? ' (under the right-side buttons)' : ''}`);
    for (let i = 0; i < on.length; i++) for (let j = i + 1; j < on.length; j++) { const a = on[i], b = on[j]; if ((a.g === b.g && a.g !== -1) || (a.s === b.s && Math.abs(a.l - b.l) < 12 && Math.abs(a.t - b.t) < 12)) continue;   // one paragraph, or a word and its own shadow
      if (cross(a, b)) first(over, a.s + '|' + b.s, `${T}: "${a.s}" x "${b.s}"`); }
    if (f.subs !== undefined) { if (f.subs) { subsMarked = true; if (f.subs.size < 52) first(subs, 'size', `${T}: ${f.subs.size} px (at least 52)`); if (f.subs.words > 6) first(subs, 'words', `${T}: ${f.subs.words} words on a line (at most 6)`); } }
    if (f.band && f.subject) { marked = true; if (f.band.a >= MIN_A && f.subject.a >= .05 && f.subject.b > f.band.t + TOL && f.subject.r > f.band.l && f.subject.l < f.band.r) first(band, 'b', `${T}: subject bottom ${Math.round(f.subject.b)} px, band top ${Math.round(f.band.t)} px`); }
    if (f.hook && f.subject) { hookMarked = true; if (f.hook.a >= MIN_A && f.subject.a >= .05 && cross(f.hook, f.subject)) first(hook, 'h', `${T}: hook ${px(f.hook)} over subject ${px(f.subject)}`); }
  }
  const lines = [
    `SAFE ZONE: ${safe.size ? 'OUTSIDE x 60-960, y 250-1570: ' + [...safe.values()].join(' | ') : 'ok'}`,
    `OVERLAP: ${over.size ? [...over.values()].join(' | ') : 'none'}`,
    `BAND: ${!marked ? (needMarks ? 'NOT MARKED (add data-band to the subtitle band and data-subject to the subject)' : 'not marked here: REVIEW the stills (subject clear of the subtitles)') : band.size ? 'SUBJECT IN THE SUBTITLE BAND ' + [...band.values()].join(' | ') : 'clear'}`,
    `HOOK: ${!hookMarked ? (needMarks ? 'NOT MARKED (add data-hook to the hook)' : 'not marked here: REVIEW the stills (hook clear of the subject)') : hook.size ? 'OVER THE SUBJECT ' + [...hook.values()].join(' | ') : 'clear of the subject'}`,
    `SUBTITLES: ${!subsMarked ? (needMarks ? 'NOT MARKED (add data-subs to the subtitle box)' : 'not marked here: REVIEW the stills (52 px+, 6 words a line at most)') : subs.size ? [...subs.values()].join(' | ') : 'at least 52 px, at most 6 words a line'}`,
  ];
  return { lines, bad: safe.size + over.size + band.size + hook.size + subs.size + (subsMarked || !needMarks ? 0 : 1) + (marked || !needMarks ? 0 : 1) + (hookMarked || !needMarks ? 0 : 1) };
};
