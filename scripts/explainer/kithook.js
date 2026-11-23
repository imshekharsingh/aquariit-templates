// ---- @webin20sec hook kit (scripts/explainer/kithook.js; premium program, 24 Nov 2026) ----
// Why: showreel-45-homebar (black look) lost 64% of viewers in 3 s and held 36%; the top web reels (numbers 165K, list 10K, popup 6.2K)
// hold because the bug HAPPENS in the first half second, happens again before 2 s, is named on the spot by a short reaction word, and is
// then measured by a big number that takes the hook's place. This kit makes that the default (rules-web.md rule 20):
//   KM.black()                      the black look (rule 19) as one call: near-black ink, no blooms, neutral surfaces, one accent
//   KM.bugs([t1, t2, ...], o)       declares when the bug happens; the first must be at or before 0.6 s, the second before 2.0 s
//                                   (window.HOOK for the preflight); each gets a low hit so the ear catches it too
//   KM.react(el, t, t0, o)          a short reaction word ("gone!", "again?!") that pops in at the place of the bug, tilted, in the bug
//                                   colour, and leaves by itself (o.hold, default 0.85 s)
//   KM.meter(el, t, items)          the measurement that replaces the hook: [{ label, at: [times], tone: 'bad' | 'good' | null }];
//                                   each number steps on its event with a small pop, never counts past it
//   KM.away(el, t, t0, o)           0..1..0 envelope for "the thing goes wrong and comes back" (out fast, held, back), for transforms
// Inlined after the kitsfx block between the kithook markers (scripts/channel3/kit-inline.mjs); scenes without the markers are untouched.
(function(KM){
  var P = KM.P, E = KM.ease, cl = KM.cl, mix = KM.mix;
  KM.black = function(o){ o = o || {}; KM.VIVID.s = 0;
    KM.WORLDS.black = { d: { warm: '#ff5f6d', cool: '#5fd8c8' }, c: { ink: '#060608', dim: '#c9c5bd', acc: o.acc || '#ffc247', red: '#ff5f6d', ctl: '#34302a', raise: '#2c2822', skel: '#1f1d19', pg: '#141416', card: '#2a2418', on: '#1d1102' },
      v: { glass: '#17171b', frost: '#17171b', glow: 'rgba(255,194,71,.0)', soft: 'rgba(255,194,71,.1)', ring: 'rgba(255,194,71,.55)' }, blooms: [] };
    return KM.theme('dark', 'black'); };
  KM.bugs = function(times, o){ o = o || {}; times = times.slice().sort(function(a, b){ return a - b; });
    window.HOOK = { first: times[0], second: times[1] == null ? null : times[1], ok: times[0] <= .6 && times[1] != null && times[1] <= 2 };
    times.forEach(function(t, i){ KM.cue({ t: t + (o.lag || .1), k: 'hit', g: (o.g || .34) * Math.pow(.85, i), p: -.5 - .1 * i }); });
    return times; };
  KM.away = function(t, t0, o){ o = o || {}; var out = o.out || .28, hold = o.hold || .55, back = o.back || .4;
    return E.out3(P(t, t0, t0 + out)) * (1 - E.inOut3(P(t, t0 + out + hold, t0 + out + hold + back))); };
  KM.react = function(el, t, t0, o){ o = o || {}; var hold = o.hold || .85, k = P(t, t0, t0 + .22), g = P(t, t0 + hold, t0 + hold + .2), e = E.back(k, 2.2);
    el.style.opacity = (cl(k * 4) * (1 - g)).toFixed(3);
    el.style.transform = 'rotate(' + (o.rot == null ? -7 : o.rot) + 'deg) scale(' + mix(.5, 1, e).toFixed(4) + ') translateY(' + (-10 * g).toFixed(2) + 'px)'; };
  KM.meter = function(el, t, items){ var html = '';
    items.forEach(function(it){ var n = (it.from || 0), last = -9; it.at.forEach(function(x){ if (t >= x) { n += (it.step == null ? 1 : it.step); last = x; } });
      var pop = 1 + .22 * (1 - E.out3(P(t, last, last + .3)));
      html += '<div class="km-m' + (it.tone ? ' km-' + it.tone : '') + '"><small>' + it.label + '</small><b style="transform:scale(' + pop.toFixed(3) + ')">' + n + (it.unit || '') + '</b></div>'; });
    if (el.__km !== html) { el.innerHTML = html; el.__km = html; } };
})(KM);
