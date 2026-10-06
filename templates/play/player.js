/* Reel player — plays a template full-screen for screen recording.
   Tap ▶ → 5 s countdown → template loads in a frame → auto-scroll choreography + generated music, ending together.
   Music is synthesised in the browser with Web Audio (original, nothing to license). Exposes window.Reel. */
(function () {
  'use strict';

  /* ---------- tiny helpers ---------- */
  var mtof = function (m) { return 440 * Math.pow(2, (m - 69) / 12); };
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  /* =====================================================================
     MUSIC ENGINE — five moods, each composed to fit an exact duration
     ===================================================================== */
  var STYLES = {
    lofi:      { name: 'Lo-fi',     bpm: 78,  verb: .30, delay: 0,    gain: .9 },
    synthwave: { name: 'Synthwave', bpm: 108, verb: .22, delay: .30,  gain: 1.05 },
    ambient:   { name: 'Ambient',   bpm: 64,  verb: .50, delay: .22,  gain: .95 },
    jazz:      { name: 'Jazz',      bpm: 100, verb: .26, delay: 0,    gain: .9 },
    playful:   { name: 'Playful',   bpm: 108, verb: .18, delay: 0,    gain: 1.1 }
  };

  function styleForTheme(theme) {
    var t = (theme || '').toLowerCase();
    if (/neon|cyber|retro|synth|futur/.test(t)) return 'synthwave';
    if (/japan|calm|zen|ambient|glass|dream/.test(t)) return 'ambient';
    if (/deco|luxury|jazz|noir|elegan/.test(t)) return 'jazz';
    if (/pastel|play|fun|bright|kid/.test(t)) return 'playful';
    return 'lofi'; // warm paper/print, organic, swiss, etc.
  }

  function impulse(ctx, secs) {
    var n = Math.floor(ctx.sampleRate * secs), b = ctx.createBuffer(2, n, ctx.sampleRate);
    for (var c = 0; c < 2; c++) { var d = b.getChannelData(c); for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.6); }
    return b;
  }

  function Music(ctx, style, D, seedStr) {
    var S = STYLES[style] || STYLES.lofi, R = rng(hash(seedStr + style));
    // fit the grid to the exact duration: whole bars, tempo nudged by a few %
    var n = Math.max(4, Math.round(D * S.bpm / 240)), bpm = n * 240 / D, spb = 60 / bpm;
    var master = ctx.createGain(); master.gain.value = 0;
    var comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.knee.value = 14; comp.ratio.value = 3.5; comp.attack.value = .01; comp.release.value = .22;
    var dry = ctx.createGain(), verb = ctx.createConvolver(), wet = ctx.createGain(); verb.buffer = impulse(ctx, 2.4); wet.gain.value = S.verb;
    dry.connect(comp); verb.connect(wet); wet.connect(comp); comp.connect(master);
    var dly = null;
    if (S.delay) { dly = ctx.createDelay(2); dly.delayTime.value = spb * .75; var fb = ctx.createGain(); fb.gain.value = .38; var dl = ctx.createBiquadFilter(); dl.type = 'lowpass'; dl.frequency.value = 2400; var dw = ctx.createGain(); dw.gain.value = S.delay; dly.connect(dl); dl.connect(fb); fb.connect(dly); dl.connect(dw); dw.connect(comp); }
    var NB = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), nd = NB.getChannelData(0); for (var q = 0; q < nd.length; q++) nd[q] = Math.random() * 2 - 1;
    var nodes = [];

    function route(node, w, d) {
      node.connect(dry);
      if (w) { var g = ctx.createGain(); g.gain.value = w; node.connect(g); g.connect(verb); nodes.push(g); }
      if (d && dly) { var g2 = ctx.createGain(); g2.gain.value = d; node.connect(g2); g2.connect(dly); nodes.push(g2); }
    }
    function adsr(p, t, a, d, s, r, dur, peak) {
      var sus = Math.max(peak * s, .0002), hold = t + Math.max(dur, a + d + .01);
      p.setValueAtTime(.0001, t); p.linearRampToValueAtTime(peak, t + a);
      p.exponentialRampToValueAtTime(sus, t + a + Math.max(d, .01));
      p.setValueAtTime(sus, hold); p.exponentialRampToValueAtTime(.0001, hold + r);
    }
    function tone(o) {
      var g = ctx.createGain(), f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.Q.value = o.q || .7;
      f.frequency.setValueAtTime(o.cut || 4000, o.t);
      if (o.cutEnd) f.frequency.exponentialRampToValueAtTime(o.cutEnd, o.t + (o.cutDur || .15));
      var end = o.t + Math.max(o.dur, (o.a || .005) + (o.d || .1) + .01) + o.r + .05;
      (o.det || [0]).forEach(function (dt) { var os = ctx.createOscillator(); os.type = o.type || 'sawtooth'; os.frequency.value = o.f; os.detune.value = dt; os.connect(f); os.start(o.t); os.stop(end); nodes.push(os); });
      f.connect(g); adsr(g.gain, o.t, o.a || .005, o.d || .1, o.s == null ? .4 : o.s, o.r, o.dur, o.peak); route(g, o.wet, o.dly);
    }
    function ep(t, dur, m, peak, wet) { // FM electric piano
      var f = mtof(m), car = ctx.createOscillator(), mod = ctx.createOscillator(), mg = ctx.createGain(), g = ctx.createGain();
      car.frequency.value = f; mod.frequency.value = f; mg.gain.setValueAtTime(f * 1.6, t); mg.gain.exponentialRampToValueAtTime(f * .12, t + .5);
      mod.connect(mg); mg.connect(car.frequency); car.connect(g); adsr(g.gain, t, .004, .9, .25, .5, dur, peak);
      car.start(t); mod.start(t); var e = t + dur + 1.2; car.stop(e); mod.stop(e); route(g, wet == null ? .5 : wet, 0); nodes.push(car, mod);
    }
    function bell(t, m, peak, wet) {
      [[1, 1], [2.76, .35], [5.4, .12]].forEach(function (p) {
        var o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.value = mtof(m) * p[0];
        o.connect(g); adsr(g.gain, t, .003, 1.6, .001, .2, .05, peak * p[1]); o.start(t); o.stop(t + 2.2); route(g, wet || .8, S.delay ? .4 : 0); nodes.push(o);
      });
    }
    function noise(t, dur, type, freq, q, peak, a, d, wetv) {
      var s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = NB; f.type = type; f.frequency.value = freq; f.Q.value = q || .7;
      s.connect(f); f.connect(g); adsr(g.gain, t, a || .002, d || dur, .001, .02, dur, peak); s.start(t, R() * 1.2, dur + .1); s.stop(t + dur + .15); route(g, wetv || 0, 0); nodes.push(s);
    }
    function kick(t, v) { var o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(42, t + .13); o.connect(g); adsr(g.gain, t, .002, .28, .001, .03, .05, v); o.start(t); o.stop(t + .4); route(g, 0, 0); nodes.push(o); }
    function snare(t, v) { noise(t, .16, 'bandpass', 1900, .8, v, .001, .14, .2); tone({ t: t, dur: .05, f: 185, type: 'triangle', peak: v * .5, a: .001, d: .08, s: .001, r: .04, cut: 1200 }); }
    function clap(t, v) { [0, .012, .024].forEach(function (o, i) { noise(t + o, .09, 'bandpass', 1300, .9, v * (i === 2 ? 1 : .6), .001, .08, .3); }); }
    function hat(t, v, open) { noise(t, open ? .22 : .045, 'highpass', 7200, .7, v, .001, open ? .2 : .04, 0); }
    function brush(t, v) { noise(t, .12, 'bandpass', 4200, .6, v, .01, .1, .1); }
    function pad(notes, t, dur, peak, cut, type, wetv) {
      var a = Math.min(1.1, dur * .35);
      notes.forEach(function (m) { tone({ t: t, dur: dur, f: mtof(m), type: type || 'triangle', det: [-8, 8], a: a, d: .6, s: .8, r: 1.4, peak: peak, cut: cut || 1400, wet: wetv == null ? .7 : wetv }); });
    }
    var swing = function (b, k, sw) { return (k % 1 ? (Math.floor(k) + sw) : k) * spb; };

    /* ---- arrangements: each bar() writes that bar's events ---- */
    var A = {
      lofi: {
        chords: [[65, 69, 72, 76], [64, 67, 71, 74], [62, 65, 69, 72], [60, 64, 67, 71]], bass: [41, 40, 38, 36], end: [60, 64, 67, 71, 79],
        bar: function (b, t, c, i) {
          c.forEach(function (m, k) { ep(t + k * .012, i.last ? spb * 5 : spb * 2.7, m, i.last ? .075 : .055); });
          if (!i.last) c.slice(1).forEach(function (m, k) { ep(t + swing(b, 2.5, .6) + k * .01, spb * .9, m, .035); });
          tone({ t: t, dur: i.last ? spb * 4 : spb * 1.9, f: mtof(i.bassNote), type: 'sine', a: .01, d: .2, s: .8, r: .25, peak: .26, cut: 600 });
          if (!i.last && !i.intro) tone({ t: t + swing(b, 2.5, .6), dur: spb * .8, f: mtof(i.bassNote + 7), type: 'sine', a: .01, d: .2, s: .6, r: .2, peak: .16, cut: 600 });
          if (!i.intro && !i.last) { kick(t, .42); kick(t + swing(b, 2.5, .6), .3); snare(t + spb, .13); snare(t + spb * 3, .13); for (var k = 0; k < 8; k++) hat(t + swing(b, k / 2, .6), k % 2 ? .035 : .05); }
          if (i.last) kick(t, .35);
          if (!i.intro && !i.last && R() < .75) { var sc = [72, 74, 76, 79, 81, 84], m = sc[Math.floor(R() * sc.length)]; ep(t + swing(b, [1.5, 2, 3.5][Math.floor(R() * 3)], .6), spb * 1.2, m, .045, .7); }
        },
        extra: function (t0) { // steady vinyl hiss
          var s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = NB; s.loop = true; f.type = 'highpass'; f.frequency.value = 3500;
          g.gain.value = .008; s.connect(f); f.connect(g); route(g, 0, 0); s.start(t0); s.stop(t0 + D + .5); nodes.push(s);
        }
      },
      synthwave: {
        chords: [[57, 60, 64, 69], [53, 57, 60, 65], [60, 64, 67, 72], [55, 59, 62, 67]], bass: [45, 41, 48, 43], end: [57, 60, 64, 69, 76],
        bar: function (b, t, c, i) {
          pad(c, t, i.last ? spb * 6 : spb * 4, i.intro ? .05 : .035, i.intro ? 700 : 1300, 'sawtooth', .8);
          if (!i.intro && !i.last) for (var k = 0; k < 8; k++) tone({ t: t + k * spb / 2, dur: spb * .4, f: mtof(i.bassNote), type: 'sawtooth', a: .005, d: .12, s: .5, r: .05, peak: k % 2 ? .13 : .2, cut: 520, q: 3 });
          if (i.last) tone({ t: t, dur: spb * 4, f: mtof(i.bassNote), type: 'sawtooth', a: .01, d: .3, s: .7, r: .4, peak: .2, cut: 500, q: 2 });
          if (!i.last && b >= 1) for (var j = 0; j < 16; j++) { var seq = [0, 1, 2, 3, 2, 1, 2, 3], m = c[seq[j % 8]] + (j % 8 > 3 ? 12 : 0) + 12; tone({ t: t + j * spb / 4, dur: spb * .22, f: mtof(m), type: 'sawtooth', a: .003, d: .1, s: .2, r: .06, peak: i.intro ? .035 : .06, cut: 3600, cutEnd: 500, cutDur: .14, q: 2, wet: .3, dly: 1 }); }
          if (!i.intro && !i.last) { for (var k2 = 0; k2 < 4; k2++) { kick(t + k2 * spb, .42); hat(t + k2 * spb + spb / 2, .05); } clap(t + spb, .16); clap(t + spb * 3, .16); }
          if (i.last) { kick(t, .4); hat(t, .08, true); }
        }
      },
      ambient: {
        chords: [[50, 57, 61, 64], [43, 50, 54, 59], [47, 54, 57, 62], [45, 52, 57, 59]], bass: [38, 31, 35, 33], end: [50, 57, 61, 64, 69],
        bar: function (b, t, c, i) {
          pad(c, t, i.last ? spb * 6 : spb * 4.6, .045, 1100, 'triangle', .9);
          if (b % 2 === 0 || i.last) tone({ t: t, dur: spb * 5, f: mtof(i.bassNote), type: 'sine', a: .8, d: .5, s: .8, r: 1.5, peak: .16, cut: 400 });
          var sc = [62, 64, 66, 69, 71, 74, 76, 78];
          if (!i.last) for (var k = 0; k < 4; k++) if (R() < (i.intro ? .25 : .5)) bell(t + k * spb + R() * spb * .5, sc[Math.floor(R() * sc.length)], .05, .9);
          if (i.last) bell(t + spb, 74, .05, 1); 
        }
      },
      jazz: {
        chords: [[55, 58, 62, 65], [52, 58, 60, 64], [53, 57, 60, 64], [54, 57, 60, 64]], bass: [43, 36, 41, 38], end: [53, 57, 60, 64, 69],
        bar: function (b, t, c, i) {
          var next = A.jazz.bass[(b + 1) % 4], r = i.bassNote, third = (b % 4 === 0 || b % 4 === 3) ? 3 : 4;
          var walk = i.last ? [r] : [r, r + 7, r + third, next + (next >= r ? -1 : 1)];
          walk.forEach(function (m, k) { tone({ t: t + k * spb, dur: spb * .85, f: mtof(m), type: 'triangle', a: .008, d: .15, s: .6, r: .12, peak: .24, cut: 700 }); });
          if (i.last) tone({ t: t, dur: spb * 4, f: mtof(r), type: 'triangle', a: .01, d: .3, s: .7, r: .5, peak: .22, cut: 600 });
          c.forEach(function (m, k) { ep(t + (i.last ? 0 : spb * 1) + k * .014, i.last ? spb * 5 : spb * .9, m, i.last ? .07 : .05); });
          if (!i.last) c.slice(1).forEach(function (m, k) { ep(t + swing(b, 2.5, .64) + k * .012, spb * .7, m, .035); });
          if (!i.intro && !i.last) { for (var k = 0; k < 4; k++) { hat(t + k * spb, .06); hat(t + k * spb + spb * .66, .035); } brush(t + spb, .05); brush(t + spb * 3, .05); kick(t, .16); }
        }
      },
      playful: {
        chords: [[60, 64, 67, 72], [55, 59, 62, 67], [57, 60, 64, 69], [53, 57, 60, 65]], bass: [36, 43, 45, 41], end: [60, 64, 67, 72, 76],
        bar: function (b, t, c, i) {
          var pat = [0, 1, 2, 3, 2, 1, 2, 1];
          if (!i.last) for (var k = 0; k < 8; k++) tone({ t: t + k * spb / 2, dur: spb * .3, f: mtof(c[pat[k]] + 12 * (k % 4 === 3 ? 1 : 0)), type: 'triangle', a: .003, d: .12, s: .05, r: .08, peak: i.intro ? .09 : .13, cut: 3500, wet: .25 });
          else c.forEach(function (m, k) { tone({ t: t + k * .03, dur: spb * 3, f: mtof(m), type: 'triangle', a: .005, d: .3, s: .4, r: .8, peak: .08, cut: 3000, wet: .5 }); });
          tone({ t: t, dur: spb * .8, f: mtof(i.bassNote), type: 'sine', a: .005, d: .15, s: .4, r: .1, peak: .3, cut: 500 });
          if (!i.last) tone({ t: t + spb * 2, dur: spb * .8, f: mtof(i.bassNote + 7), type: 'sine', a: .005, d: .15, s: .4, r: .1, peak: .22, cut: 500 });
          if (!i.intro && !i.last) { kick(t, .36); kick(t + spb * 2, .3); clap(t + spb, .15); clap(t + spb * 3, .15); for (var k2 = 0; k2 < 16; k2++) hat(t + k2 * spb / 4, k2 % 4 ? .02 : .04); }
          if (i.last) kick(t, .3);
        }
      }
    };

    var arr = A[style] || A.lofi;
    function schedule(t0) {
      var intro = n >= 8 ? 2 : 1;
      for (var b = 0; b < n; b++) {
        var last = b === n - 1, ci = b % arr.chords.length;
        arr.bar(b, t0 + b * 4 * spb, last ? arr.end : arr.chords[ci], { last: last, intro: b < intro, bassNote: last ? arr.bass[0] : arr.bass[ci], spb: spb });
      }
      if (arr.extra) arr.extra(t0);
      // fade in/out on the master so the end lands exactly with the scroll
      var fi = Math.min(1.4, D * .1), fo = Math.min(2.2, D * .14), peak = S.gain * .85;
      master.gain.setValueAtTime(0, t0); master.gain.linearRampToValueAtTime(peak, t0 + fi);
      master.gain.setValueAtTime(peak, t0 + D - fo); master.gain.linearRampToValueAtTime(0, t0 + D);
    }
    return {
      out: master, bars: n, bpm: bpm,
      start: function (t0, dest) { master.connect(dest); schedule(t0); },
      stop: function (when) { var t = when || ctx.currentTime; try { master.gain.cancelScheduledValues(t); master.gain.setValueAtTime(master.gain.value, t); master.gain.linearRampToValueAtTime(0, t + .25); } catch (e) {} setTimeout(function () { try { master.disconnect(); } catch (e) {} }, 400); }
    };
  }

  /* =====================================================================
     SCROLL DIRECTOR — turns a page into a timed, human-looking camera move
     ===================================================================== */
  function jump(t, y, x) { // instant scroll; falls back for browsers that reject behavior:'instant'
    try { t.scrollTo(x ? { left: y, behavior: 'instant' } : { top: y, behavior: 'instant' }); } catch (e) { t.scrollTo(x ? y : 0, x ? 0 : y); }
  }
  var easeIO = function (x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };

  function buildPlan(win, doc, D) {
    var cfg = win.__reel || {}, vh = win.innerHeight, scroller = null;
    if (cfg.scroller) scroller = doc.querySelector(cfg.scroller);
    var axisX = scroller && cfg.axis === 'x';
    var max = scroller ? Math.max(0, axisX ? scroller.scrollWidth - scroller.clientWidth : scroller.scrollHeight - scroller.clientHeight)
                       : Math.max(0, doc.documentElement.scrollHeight - vh);
    var pts = [0];
    if (!scroller) {
      var barH = 0; // height of a sticky/fixed top bar so section titles don't hide under it
      Array.prototype.some.call(doc.querySelectorAll('header,nav,[class*="bar"]'), function (e) {
        var cs = win.getComputedStyle(e), r = e.getBoundingClientRect();
        if ((cs.position === 'sticky' || cs.position === 'fixed') && r.top < 4 && r.height < 120 && r.width > win.innerWidth * .6) { barH = r.height; return true; }
      });
      var cand = [];
      if (cfg.stops) cfg.stops.forEach(function (s) { var e = typeof s === 'string' ? doc.querySelector(s) : null; cand.push(typeof s === 'number' ? s : e ? e.getBoundingClientRect().top + win.scrollY : null); });
      else Array.prototype.forEach.call(doc.querySelectorAll('main > *, body > section, body > footer, section'), function (e) {
        var r = e.getBoundingClientRect(); if (r.height > vh * .3) cand.push(r.top + win.scrollY);
      });
      cand = cand.filter(function (y) { return y != null; }).map(function (y) { return Math.round(y - barH - 6); }).filter(function (y) { return y > vh * .3 && y < max - vh * .3; }).sort(function (a, b) { return a - b; });
      var last = 0, kept = [];
      cand.forEach(function (y) { if (y - last >= vh * .6) { kept.push(y); last = y; } });
      while (kept.length > 9) kept = kept.filter(function (_, i) { return i % 2 === 0; });
      pts = pts.concat(kept);
    } else {
      var n = Math.max(2, Math.round(max / (axisX ? win.innerWidth : vh))); for (var i = 1; i < n; i++) pts.push(Math.round(max * i / n));
    }
    if (max > 4) pts.push(max);
    var H0 = Math.min(2.8, D * .13), H1 = Math.min(2.6, D * .12), W = Math.max(1, D - H0 - H1);
    var segs = [], wsum = 0;
    for (var s = 1; s < pts.length; s++) { var dist = pts[s] - pts[s - 1], w = Math.pow(dist / vh, .75) + .35; segs.push({ a: pts[s - 1], b: pts[s], w: w }); wsum += w; }
    var t = H0;
    segs.forEach(function (g, k) { g.t0 = t; g.dur = W * g.w / wsum; g.move = g.dur * (k === segs.length - 1 ? .92 : .74); t += g.dur; });
    return {
      points: pts, stops: Math.max(0, pts.length - 2), max: max, scroller: scroller, axisX: axisX,
      at: function (time) {
        if (!segs.length || time <= H0) return 0;
        for (var k = 0; k < segs.length; k++) { var g = segs[k]; if (time < g.t0 + g.dur) return g.a + (g.b - g.a) * easeIO(clamp((time - g.t0) / g.move, 0, 1)); }
        return pts[pts.length - 1];
      }
    };
  }

  /* =====================================================================
     SETTINGS
     ===================================================================== */
  var DEF = { len: 30, music: 'auto', frame: 'auto', hideBack: true };
  function load() { try { return Object.assign({}, DEF, JSON.parse(localStorage.getItem('reel.settings') || '{}')); } catch (e) { return Object.assign({}, DEF); } }
  function save(s) { try { localStorage.setItem('reel.settings', JSON.stringify(s)); } catch (e) {} }

  /* =====================================================================
     UI + RUNTIME
     ===================================================================== */
  var css = '' +
    '#reel{position:fixed;inset:0;box-sizing:border-box;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent;z-index:2147483000;background:#000;display:flex;align-items:center;justify-content:center;cursor:none;touch-action:none;overscroll-behavior:none;font-family:system-ui,-apple-system,sans-serif;color:#fff}' +
    '#reel iframe{border:0;background:#fff;display:block;pointer-events:none}' +
    '#reel .cd{position:absolute;inset:0;background:radial-gradient(circle at 50% 40%,#12394d,#05080c 70%);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;transition:opacity .35s}' +
    '#reel .cd.off{opacity:0;pointer-events:none}' +
    '#reel .cd small{font:700 .8rem ui-monospace,monospace;letter-spacing:.22em;text-transform:uppercase;opacity:.7}' +
    '#reel .ring{position:relative;width:min(56vw,260px);aspect-ratio:1;display:grid;place-items:center}' +
    '#reel .ring svg{position:absolute;inset:0;transform:rotate(-90deg)}#reel .ring circle{fill:none;stroke-width:6}' +
    '#reel .num{font:800 min(34vw,150px)/1 system-ui,sans-serif;letter-spacing:-.04em}' +
    '#reel .name{font:600 1.1rem system-ui,sans-serif;opacity:.85;text-align:center;padding:0 24px}' +
    '#reel .x{position:absolute;top:calc(env(safe-area-inset-top) + 14px);left:14px;width:46px;height:46px;border-radius:50%;border:1.5px solid rgba(255,255,255,.4);background:rgba(0,0,0,.35);color:#fff;font-size:20px;cursor:pointer}' +
    '#reel .done{position:absolute;left:50%;bottom:calc(env(safe-area-inset-bottom) + 22px);transform:translate(-50%,30px);opacity:0;transition:.35s;display:flex;gap:10px;align-items:center;padding:10px 12px 10px 18px;border-radius:999px;background:rgba(10,20,28,.92);border:1px solid rgba(255,255,255,.25);font:700 .9rem system-ui,sans-serif;white-space:nowrap;cursor:default}' +
    '#reel .done.on{opacity:1;transform:translate(-50%,0)}#reel .done button{min-height:40px;padding:0 16px;border-radius:999px;border:0;font:700 .85rem system-ui,sans-serif;cursor:pointer;background:#2ee6c5;color:#042}#reel .done button.g{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.4)}' +
    '#reelset{position:fixed;inset:0;z-index:2147482000;background:rgba(0,0,0,.55);display:flex;align-items:flex-end;justify-content:center;font-family:system-ui,-apple-system,sans-serif}' +
    '#reelset .sh{width:min(560px,100%);max-height:92vh;overflow:auto;background:var(--card,#fffdf8);color:var(--ink,#10232d);border-radius:24px 24px 0 0;padding:22px 20px calc(24px + env(safe-area-inset-bottom))}' +
    '#reelset h2{font:700 1.3rem system-ui;margin:0 0 4px}#reelset p{color:var(--mute,#5d6b72);font-size:.9rem;margin:0 0 14px}' +
    '#reelset h3{font:700 .72rem ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--accent,#c4452b);margin:16px 0 8px}' +
    '#reelset .row{display:flex;flex-wrap:wrap;gap:8px}#reelset button.c{min-height:44px;padding:0 16px;border-radius:999px;border:1.5px solid var(--line,#dcd5c4);background:transparent;color:inherit;font:600 .92rem system-ui;cursor:pointer}' +
    '#reelset button.c[aria-pressed="true"]{background:var(--ink,#10232d);color:var(--bg,#f6f2e9);border-color:var(--ink,#10232d)}' +
    '#reelset .tips{margin-top:16px;padding:14px;border-radius:14px;background:var(--chip,#efe8d6);font-size:.88rem;line-height:1.5}#reelset .tips b{display:block;margin-bottom:4px}' +
    '#reelset .go{width:100%;min-height:52px;margin-top:16px;border:0;border-radius:16px;background:var(--accent,#c4452b);color:var(--bg,#f6f2e9);font:800 1rem system-ui;cursor:pointer}';
  var cssAdded = false;
  function addCss() { if (cssAdded) return; var s = document.createElement('style'); s.textContent = css; document.head.appendChild(s); cssAdded = true; }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }

  var actx = null, silent = null, logP = null, run = null;
  function ensureAudio() {
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
    if (!actx) actx = new AC();
    if (actx.state !== 'running') actx.resume();
    if (!silent) { // keeps iOS audio session in "playback" mode so the mute switch doesn't silence Web Audio
      var rate = 8000, n = rate / 5, b = new ArrayBuffer(44 + n * 2), v = new DataView(b), w = function (o, s) { for (var i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
      w(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); w(8, 'WAVEfmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, n * 2, true);
      silent = new Audio(URL.createObjectURL(new Blob([b], { type: 'audio/wav' }))); silent.loop = true; silent.setAttribute('playsinline', '');
    }
    try { silent.play().catch(function () {}); } catch (e) {}
    return actx;
  }
  function getLog() { if (!logP) logP = fetch('/design-log.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).catch(function () { return []; }); return logP; }

  function stop(r) {
    if (!r || r.dead) return; r.dead = true;
    if (r.raf) cancelAnimationFrame(r.raf); clearTimeout(r.tm); clearInterval(r.iv);
    if (r.music) r.music.stop(); if (r.lock) try { r.lock.release(); } catch (e) {}
    if (r.node && r.node.parentNode) r.node.parentNode.removeChild(r.node);
    if (silent) try { silent.pause(); } catch (e) {}
    if (run === r) run = null;
  }

  function start(id) {
    if (run) stop(run);
    addCss();
    var st = load(), ctx = ensureAudio(); // must happen inside the tap (iOS needs the user gesture)
    var r = run = { id: id, dead: false };
    var box = el('div'); box.id = 'reel'; r.node = box; document.body.appendChild(box);
    var probe = el('div'); probe.style.cssText = 'position:fixed;top:0;left:0;visibility:hidden;padding-top:env(safe-area-inset-top)'; document.body.appendChild(probe);
    var top = parseFloat(getComputedStyle(probe).paddingTop) || 0; probe.remove(); // iPhone installed-app status bar / Dynamic Island
    box.style.paddingTop = top + 'px';
    var vw = innerWidth, vh = innerHeight - top, fw = vw, fh = vh;
    if (st.frame === 'phone' || (st.frame === 'auto' && vw / vh > .66)) fw = Math.min(vw, Math.round(vh * 9 / 16));
    var frame = el('iframe'); frame.style.width = fw + 'px'; frame.style.height = fh + 'px'; frame.setAttribute('title', 'Template preview'); frame.setAttribute('aria-hidden', 'true');
    box.appendChild(frame);
    var cd = el('div', 'cd'), small = el('small', null, 'Recording starts in'), ring = el('div', 'ring');
    ring.innerHTML = '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" stroke="rgba(255,255,255,.15)"/><circle id="reelarc" cx="50" cy="50" r="46" stroke="#2ee6c5" stroke-linecap="round" stroke-dasharray="289" stroke-dashoffset="289"/></svg>';
    var num = el('div', 'num', '5'); ring.appendChild(num);
    var nm = el('div', 'name', 'Loading…'); cd.appendChild(small); cd.appendChild(ring); cd.appendChild(nm); box.appendChild(cd);
    var xb = el('button', 'x', '✕'); xb.setAttribute('aria-label', 'Cancel'); xb.style.cursor = 'pointer'; xb.addEventListener('click', function () { stop(r); }); box.appendChild(xb);
    var done = el('div', 'done'); box.appendChild(done);
    try { navigator.wakeLock && navigator.wakeLock.request('screen').then(function (l) { r.lock = l; }).catch(function () {}); } catch (e) {}

    var url = '/' + id + '/', style = 'lofi', D = clamp(+st.len || 30, 6, 120), fresh = false, ready = false;
    getLog().then(function (log) {
      var e = (log || []).filter(function (x) { return (x.id || x.date) === id; })[0];
      if (e) { nm.textContent = e.name || e.slug; style = styleForTheme(e.theme); }
      if (st.music !== 'auto' && STYLES[st.music]) style = st.music;
    });

    function freeze(doc, win) { // pause CSS animations until the camera "starts rolling"; optionally hide the back link
      if (doc.getElementById('__reel_freeze')) return;
      var s = doc.createElement('style'); s.id = '__reel_freeze'; s.textContent = '*,*::before,*::after{animation-play-state:paused!important}';
      var b = doc.createElement('style'); b.id = '__reel_base'; b.textContent = 'html{scroll-behavior:auto!important}'; // our scrolling must never be smoothed by the page
      var host = doc.head || doc.documentElement; host.appendChild(b); host.appendChild(s);
    }
    function hideBack(doc) {
      if (!st.hideBack) return;
      Array.prototype.forEach.call(doc.querySelectorAll('a[href="/"]'), function (a) { if (/All templates/i.test(a.textContent)) a.style.setProperty('visibility', 'hidden', 'important'); });
    }
    function loadFresh() {
      fresh = true; ready = false; frame.src = 'about:blank';
      setTimeout(function () { if (r.dead) return; frame.src = url; }, 30);
      clearInterval(r.iv);
      r.iv = setInterval(function () {
        try {
          var d = frame.contentDocument, w = frame.contentWindow;
          if (d && w && d.URL.indexOf(url) > -1 && d.documentElement) { freeze(d, w); if (d.readyState === 'complete' && !ready) { hideBack(d); var f = d.fonts && d.fonts.ready ? Promise.race([d.fonts.ready, new Promise(function (ok) { setTimeout(ok, 1500); })]) : Promise.resolve(); f.then(function () { setTimeout(function () { ready = true; }, 200); }); ready = 'pending'; clearInterval(r.iv); }
          }
        } catch (e) {}
      }, 8);
    }

    // preload once to warm the cache (fonts, etc.), then reload fresh at the end of the countdown
    frame.src = url; frame.style.visibility = 'hidden';
    var arc = box.querySelector('#reelarc'), T0 = performance.now(), COUNT = 5000, reloaded = false;
    (function tick() {
      if (r.dead) return;
      var el_ = performance.now() - T0, left = Math.max(0, Math.ceil((COUNT - el_) / 1000));
      num.textContent = left || '●'; arc.setAttribute('stroke-dashoffset', String(289 * (1 - Math.min(1, el_ / COUNT))));
      if (!reloaded && el_ > COUNT - 900) { reloaded = true; frame.style.visibility = 'visible'; loadFresh(); }
      if (el_ < COUNT || !ready || ready === 'pending') {
        if (el_ > COUNT + 6000) { cd.querySelector('small').textContent = 'Page is slow to load…'; }
        r.raf = requestAnimationFrame(tick); return;
      }
      go();
    })();

    function go() { // camera rolling: reveal page, release animations, start music + scroll on the same clock
      var d = frame.contentDocument, w = frame.contentWindow, fz = d.getElementById('__reel_freeze');
      var cfg = w.__reel || {}; if (cfg.duration) D = clamp(cfg.duration, 6, 120);
      jump(w, 0);
      var plan = buildPlan(w, d, D);
      var clockStart, LEAD = .6, thawed = false; // short lead: overlay fades out and the audio graph is built BEFORE "action", so the first frames don't stutter on phones
      if (ctx && st.music !== 'off') {
        r.music = Music(ctx, style, D, id); clockStart = ctx.currentTime + LEAD; r.music.start(clockStart, ctx.destination);
      }
      cd.classList.add('off'); xb.style.display = 'none'; hideBack(d);
      var perf0 = performance.now() + LEAD * 1000, lastCheck = 0;
      (function loop() {
        if (r.dead) return;
        var t = clockStart != null ? ctx.currentTime - clockStart : (performance.now() - perf0) / 1000;
        if (!thawed && t >= 0) { thawed = true; if (fz && fz.parentNode) fz.parentNode.removeChild(fz); } // animations start exactly with the music
        if (t > lastCheck + 1) { lastCheck = t; var np = buildPlan(w, d, D); if (Math.abs(np.max - plan.max) > 4) { /* layout settled after fonts/images: re-plan */ plan = np; } }
        var y = plan.at(Math.max(0, t));
        if (plan.scroller) jump(plan.scroller, y, plan.axisX); else jump(w, y);
        if (t >= D) { finish(); return; }
        r.raf = requestAnimationFrame(loop);
      })();
    }
    function finish() {
      done.innerHTML = '';
      done.appendChild(el('span', null, '✓ Done — stop recording'));
      var again = el('button', null, 'Replay'), close = el('button', 'g', 'Close');
      again.addEventListener('click', function () { start(id); }); close.addEventListener('click', function () { stop(r); });
      done.appendChild(again); done.appendChild(close); box.style.cursor = 'default'; done.style.cursor = 'pointer';
      setTimeout(function () { done.classList.add('on'); }, 500);
      try { navigator.vibrate && navigator.vibrate([60, 40, 60]); } catch (e) {}
      if (r.lock) try { r.lock.release(); } catch (e) {}
    }
  }

  var prev = null;
  function openSettings() {
    addCss(); var st = load(), ov = el('div'); ov.id = 'reelset';
    var sh = el('div', 'sh'); ov.appendChild(sh);
    sh.appendChild(el('h2', null, 'Reel settings')); sh.appendChild(el('p', null, 'Saved on this device. They apply every time you press ▶.'));
    function group(title, key, opts) {
      sh.appendChild(el('h3', null, title)); var row = el('div', 'row');
      opts.forEach(function (o) { var b = el('button', 'c', o[1]); b.type = 'button'; b.setAttribute('aria-pressed', String(String(st[key]) === String(o[0])));
        b.addEventListener('click', function () { st[key] = typeof DEF[key] === 'number' ? +o[0] : typeof DEF[key] === 'boolean' ? o[0] === 'true' : o[0]; save(st); Array.prototype.forEach.call(row.children, function (c) { c.setAttribute('aria-pressed', 'false'); }); b.setAttribute('aria-pressed', 'true'); });
        row.appendChild(b); }); sh.appendChild(row);
    }
    group('Length of the recording', 'len', [[20, '20 s'], [30, '30 s'], [45, '45 s'], [60, '60 s']]);
    group('Music', 'music', [['auto', 'Auto (matches template)'], ['lofi', 'Lo-fi'], ['synthwave', 'Synthwave'], ['ambient', 'Ambient'], ['jazz', 'Jazz'], ['playful', 'Playful'], ['off', 'Off']]);
    group('Frame', 'frame', [['auto', 'Auto'], ['phone', 'Phone 9:16'], ['full', 'Full screen']]);
    group('“← All templates” link', 'hideBack', [['true', 'Hide while recording'], ['false', 'Show']]);
    var pv = el('button', 'c', '🎧 Preview music (8 s)'); pv.type = 'button'; pv.style.marginTop = '14px';
    pv.addEventListener('click', function () {
      var ctx = ensureAudio(); if (!ctx) return; if (prev) { prev.stop(); prev = null; pv.textContent = '🎧 Preview music (8 s)'; return; }
      var s = st.music === 'auto' || st.music === 'off' ? 'lofi' : st.music; prev = Music(ctx, s, 8, 'preview'); prev.start(ctx.currentTime + .05, ctx.destination); pv.textContent = '■ Stop preview';
      setTimeout(function () { prev = null; pv.textContent = '🎧 Preview music (8 s)'; }, 8200);
    });
    sh.appendChild(pv);
    var tips = el('div', 'tips'); tips.innerHTML = '<b>Before you record</b>1. Start your screen recording.<br>2. Turn the silent switch off and raise the volume (the music is captured as device audio).<br>3. Tap ▶ on a template. A 5-second countdown, then everything runs by itself.<br>4. Stop recording when it says “Done”. Trim the countdown and tail in Instagram.<br>Tip: the installed app has no browser bars, so the recording is cleaner.';
    sh.appendChild(tips);
    var go = el('button', 'go', 'Done'); go.type = 'button'; go.addEventListener('click', function () { if (prev) { prev.stop(); prev = null; } ov.remove(); }); sh.appendChild(go);
    ov.addEventListener('click', function (e) { if (e.target === ov) go.click(); });
    document.body.appendChild(ov);
  }

  window.Reel = { start: start, openSettings: openSettings, _state: function () { return { ctx: actx && actx.state, running: !!run }; }, _Music: Music, _STYLES: STYLES, _plan: buildPlan, styleForTheme: styleForTheme };
})();
