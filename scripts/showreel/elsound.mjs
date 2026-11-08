// ELEMENT SOUND (owner, 8 Nov 2026: "Every element's flow should have a compatible sound"): on the stills run's 0.5 s scan, every element
// that enters, moves, changes size or fades (relative to its parent, so children riding a moving parent count once) is "animated"; it has
// a cue when it, or an ancestor registered as a tree, carries data-sfx (set by the kit's element sound, scripts/explainer/kitsfx.js:
// KM.sfx / sfxRun / el / mark). Prints "ELEMENT SOUND: n of m animated elements have a cue (pct%)": pass at 90%+. Scenes without the
// kit's element sound (window.ELEMENT_SOUND unset: reels before 8 Nov) print n/a and do not fail.
// Thresholds: a move of 6 px+, a size change of 6 px+ or an opacity change of 0.25+ between two moments 0.5 s apart, while visible
// (on screen, area 100 px²+, opacity 0.05+ including its parents) in at least one of them.
export const collectEls = () => {
  const out = {}, W = innerWidth, H = innerHeight;
  const walk = (e, path, pr, op) => { let i = 0;
    for (const c of e.children) { const key = path + '/' + (i++);
      if (/^(SCRIPT|STYLE|LINK|META|defs|clipPath|linearGradient|stop)$/i.test(c.tagName)) continue;
      const cs = getComputedStyle(c); if (cs.display === 'none') continue;
      const r = c.getBoundingClientRect(), o = +cs.opacity, a = op * o * (cs.visibility === 'hidden' ? 0 : 1);
      const vis = a > .05 && r.width * r.height >= 100 && r.right > 0 && r.bottom > 0 && r.left < W && r.top < H;
      const sfx = c.getAttribute('data-sfx'), cov = !!sfx || !!(c.parentElement && c.parentElement.closest('[data-sfx=tree]'));
      out[key] = [r.left - pr.left, r.top - pr.top, r.width, r.height, o, vis ? 1 : 0, cov ? 1 : 0, (c.id ? '#' + c.id : '') + (typeof c.className === 'string' && c.className ? '.' + c.className.split(' ')[0] : '') || c.tagName.toLowerCase()];
      walk(c, key, r, a); } };
  walk(document.body, '', { left: 0, top: 0 }, 1); return out; };
export function judgeSound(samples, on){
  if (!on) return { lines: ['ELEMENT SOUND: n/a (the scene predates the kit\'s element sound, scripts/explainer/kitsfx.js)'], bad: 0 };
  const anim = new Map();
  for (let i = 1; i < samples.length; i++) { const a = samples[i - 1], b = samples[i];
    for (const k in b) { const p = a[k], q = b[k]; if (!p || !(p[5] || q[5])) continue;
      if (Math.abs(p[0] - q[0]) >= 6 || Math.abs(p[1] - q[1]) >= 6 || Math.abs(p[2] - q[2]) >= 6 || Math.abs(p[3] - q[3]) >= 6 || Math.abs(p[4] - q[4]) >= .25) {
        const prev = anim.get(k); anim.set(k, { cov: (prev ? prev.cov : true) && !!(p[6] || q[6]), name: q[7] }); } } }
  const m = anim.size, n = [...anim.values()].filter((x) => x.cov).length, pct = m ? Math.round(n / m * 100) : 100;
  const miss = [...new Set([...anim.values()].filter((x) => !x.cov).map((x) => x.name))].slice(0, 8);
  return { lines: [`ELEMENT SOUND: ${n} of ${m} animated elements have a cue (${pct}%): ${pct >= 90 ? 'ok' : 'FAIL (under 90%; give these a KM.sfx / sfxRun / el: ' + miss.join(', ') + ')'}${pct >= 90 && miss.length ? ' (no cue: ' + miss.join(', ') + ')' : ''}`], bad: pct >= 90 ? 0 : 1 };
}
