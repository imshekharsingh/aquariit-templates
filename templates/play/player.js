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
    playful:   { name: 'Playful',   bpm: 108, verb: .18, delay: 0,    gain: 1.2 },
    chillhop:  { name: 'Chill-hop', bpm: 84,  verb: .26, delay: 0,    gain: .72 },
    folk:      { name: 'Folk',      bpm: 92,  verb: .22, delay: 0,    gain: 1.3 },
    ballad:    { name: 'Piano',     bpm: 66,  verb: .45, delay: .10,  gain: 1.7 },
    funk:      { name: 'Funk',      bpm: 106, verb: .12, delay: 0,    gain: 1.3 },
    tech:      { name: 'Tech',      bpm: 120, verb: .16, delay: .22,  gain: 1.25 },
    cinematic: { name: 'Cinematic', bpm: 76,  verb: .55, delay: .15,  gain: 1.0 }
  };

  // Each mood maps to several fitting styles; the template's id picks one deterministically, so similar moods don't all sound alike.
  var MOODS = [
    [/neon|cyber|retro|synth|futur/, ['synthwave', 'tech', 'cinematic']],
    [/paper|print|editorial|vintage|warm/, ['lofi', 'folk', 'ballad', 'chillhop']],
    [/luxury|premium|refined/, ['ballad', 'jazz', 'cinematic']],
    [/swiss|mono|minimal|brutal|grid/, ['tech', 'ambient', 'chillhop']],
    [/japan|calm|zen|ambient|glass|dream/, ['ambient', 'ballad', 'cinematic']],
    [/deco|jazz|noir|elegan/, ['jazz', 'ballad', 'funk']],
    [/pastel|play|fun|bright|kid|bold/, ['playful', 'funk', 'folk']],
    [/organic|botanical|nature|earth|craft|handmade/, ['folk', 'lofi', 'ballad']],
    [/epic|cinematic|dramatic|hero|launch|event/, ['cinematic', 'synthwave', 'tech']],
    [/urban|street|hip|agency|portfolio/, ['chillhop', 'funk', 'lofi']]
  ];
  function styleForTheme(theme, purpose, seed) {
    var texts = [String(theme || '').toLowerCase(), String(purpose || '').toLowerCase()], cands = null; // the theme decides first, then the page purpose
    for (var k = 0; k < texts.length && !cands; k++) for (var i = 0; i < MOODS.length; i++) if (MOODS[i][0].test(texts[k])) { cands = MOODS[i][1]; break; }
    cands = cands || ['lofi', 'folk', 'ballad', 'chillhop']; // warm paper/print and anything unmatched
    return cands[hash(String(seed || theme || '')) % cands.length];
  }

  function impulse(ctx, secs) {
    var n = Math.floor(ctx.sampleRate * secs), b = ctx.createBuffer(2, n, ctx.sampleRate);
    for (var c = 0; c < 2; c++) { var d = b.getChannelData(c); for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.6); }
    return b;
  }

  function Music(ctx, style, D, seedStr, opts) {
    opts = opts || {}; // opts.eager: schedule every bar immediately (offline rendering); otherwise a few seconds ahead so building never stalls the screen
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
    function piano(m, t, dur, peak, wet) { // soft piano: three decaying partials + a tiny hammer tick
      [[1, 1, 1.4], [2, .42, .8], [3, .16, .45]].forEach(function (p) {
        var o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.value = mtof(m) * p[0];
        o.connect(g); adsr(g.gain, t, .004, Math.min(2.2, dur * p[2] + .5), .001, .25, .05, peak * p[1]); o.start(t); o.stop(t + 3); route(g, wet == null ? .5 : wet, 0); nodes.push(o);
      });
      noise(t, .02, 'bandpass', 2400, 1, peak * .35, .001, .02, 0);
    }
    function pluck(m, t, dur, peak, wet) { // plucked string: one saw through a quickly closing filter
      tone({ t: t, dur: dur, f: mtof(m), type: 'sawtooth', a: .003, d: .3, s: .04, r: .1, peak: peak, cut: 3400, cutEnd: 650, cutDur: .22, wet: wet == null ? .25 : wet });
    }
    function strum(notes, t, gap, down, peak) { (down ? notes : notes.slice().reverse()).forEach(function (m, k) { pluck(m, t + k * gap, .7, peak, .22); }); }
    function boom(t, v) { var o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(78, t); o.frequency.exponentialRampToValueAtTime(34, t + .5); o.connect(g); adsr(g.gain, t, .004, 1.0, .001, .2, .05, v); o.start(t); o.stop(t + 1.5); route(g, .5, 0); nodes.push(o); noise(t, .12, 'lowpass', 400, .7, v * .5, .001, .12, .3); }
    function riser(t, dur, peak) { // noise swell that opens up into the final bar
      var s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = NB; s.loop = true; f.type = 'highpass'; f.Q.value = 1.2;
      f.frequency.setValueAtTime(500, t); f.frequency.exponentialRampToValueAtTime(6500, t + dur);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + dur); g.gain.linearRampToValueAtTime(0, t + dur + .05);
      s.connect(f); f.connect(g); route(g, .4, 0); s.start(t); s.stop(t + dur + .1); nodes.push(s);
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

    A.cinematic = {
      chords: [[57, 62, 65, 69], [58, 62, 65, 70], [57, 60, 65, 69], [55, 60, 64, 67]], bass: [38, 34, 41, 36], end: [50, 57, 62, 66, 69],
      bar: function (b, t, c, i) {
        pad(c, t, i.last ? spb * 6 : spb * 4.4, i.intro ? .05 : .065, i.intro ? 1000 : 1700, 'sawtooth', .9);
        tone({ t: t, dur: i.last ? spb * 5 : spb * 4.2, f: mtof(i.bassNote), type: 'sawtooth', a: .6, d: .4, s: .8, r: 1, peak: .12, cut: 380, wet: .4 }); // cello-like drone
        if (!i.intro && !i.last) { boom(t, .45); boom(t + spb * 2, .28); for (var k = 0; k < 8; k++) piano(c[k % 4] + (k > 3 ? 12 : 0), t + k * spb / 2, spb * .6, .04, .6); }
        if (i.last) boom(t, .5);
        if (b === n - 2) riser(t + spb * 2, spb * 2, .05);
      }
    };
    A.folk = {
      chords: [[55, 59, 62, 67], [52, 55, 59, 64], [48, 55, 60, 64], [50, 57, 62, 66]], bass: [43, 40, 36, 38], end: [55, 59, 62, 67, 74],
      bar: function (b, t, c, i) {
        var pat = i.last ? [[0, 1]] : i.intro ? [[0, 1], [2.5, 0]] : [[0, 1], [1, 1], [1.5, 0], [2.5, 0], [3, 1], [3.5, 0]];
        pat.forEach(function (q) { strum(c, t + swing(b, q[0], .55), .016, q[1], i.last ? .08 : .06); });
        tone({ t: t, dur: spb * 1.8, f: mtof(i.bassNote), type: 'triangle', a: .006, d: .2, s: .5, r: .15, peak: .22, cut: 650 });
        if (!i.last) tone({ t: t + spb * 2, dur: spb * 1.6, f: mtof(i.bassNote + 7), type: 'triangle', a: .006, d: .2, s: .5, r: .15, peak: .16, cut: 650 });
        if (!i.intro && !i.last) { kick(t, .28); kick(t + spb * 2, .24); snare(t + spb, .07); snare(t + spb * 3, .07); for (var k = 0; k < 8; k++) hat(t + k * spb / 2, k % 2 ? .022 : .038); if (R() < .7) pluck([67, 69, 71, 74, 76, 79][Math.floor(R() * 6)], t + swing(b, [1.5, 2, 3][Math.floor(R() * 3)], .55), spb * .8, .06, .4); }
        if (i.last) { kick(t, .25); pad(c, t, spb * 5, .03, 1300, 'triangle', .8); }
      }
    };
    A.chillhop = {
      chords: [[60, 63, 67, 70], [56, 60, 63, 67], [53, 56, 60, 63], [55, 59, 62, 65]], bass: [36, 32, 41, 43], end: [60, 63, 67, 70, 74],
      bar: function (b, t, c, i) {
        c.forEach(function (m, k) { ep(t + k * .012, i.last ? spb * 5 : spb * 2.7, m, i.last ? .07 : .05, .6); });
        if (!i.last) c.slice(1).forEach(function (m, k) { ep(t + swing(b, 2.5, .6) + k * .01, spb * .8, m, .03, .5); });
        tone({ t: t, dur: i.last ? spb * 4 : spb * 2.2, f: mtof(i.bassNote), type: 'sine', a: .01, d: .25, s: .85, r: .3, peak: .3, cut: 500 });
        if (!i.intro && !i.last) {
          kick(t, .5); kick(t + swing(b, 1.75, .6), .3); kick(t + swing(b, 2.5, .6), .4); snare(t + spb, .2); snare(t + spb * 3, .2);
          for (var k2 = 0; k2 < 16; k2++) hat(t + swing(b, k2 / 4, .6), k2 % 4 === 2 ? .045 : .02);
          if (R() < .6) bell(t + swing(b, [1.5, 2.5, 3.5][Math.floor(R() * 3)], .6), [72, 75, 79, 82][Math.floor(R() * 4)], .04, .9);
        }
        if (i.last) kick(t, .4);
      },
      extra: function (t0) { var s0 = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); s0.buffer = NB; s0.loop = true; f.type = 'highpass'; f.frequency.value = 3200; g.gain.value = .007; s0.connect(f); f.connect(g); route(g, 0, 0); s0.start(t0); s0.stop(t0 + D + .5); nodes.push(s0); }
    };
    A.funk = {
      chords: [[52, 55, 59, 62], [57, 61, 64, 67], [52, 55, 59, 62], [59, 63, 66, 69]], bass: [40, 45, 40, 47], end: [52, 55, 59, 62, 66],
      bar: function (b, t, c, i) {
        var q = spb / 4;
        if (!i.last) [0, 3, 6, 8, 11, 14].forEach(function (st) { if (i.intro && st > 0) return; c.slice(1).forEach(function (m) { tone({ t: t + st * q, dur: q * .7, f: mtof(m + 12), type: 'sawtooth', a: .002, d: .08, s: .01, r: .04, peak: i.intro ? .028 : .042, cut: 2600, cutEnd: 900, cutDur: .12, q: 3, wet: .1 }); }); });
        else c.forEach(function (m) { tone({ t: t, dur: spb * 3, f: mtof(m + 12), type: 'sawtooth', a: .004, d: .3, s: .3, r: .8, peak: .04, cut: 2200, wet: .4 }); });
        if (!i.last) [0, 2, 3, 6, 8, 10, 11, 14].forEach(function (st, k) { tone({ t: t + st * q, dur: q * (k % 3 === 0 ? 1.8 : .8), f: mtof(i.bassNote + ([0, 12, 0, 7, 0, 12, 0, 10][k])), type: 'sawtooth', a: .003, d: .1, s: .35, r: .05, peak: .2, cut: 700, cutEnd: 350, cutDur: .12, q: 2 }); });
        else tone({ t: t, dur: spb * 4, f: mtof(i.bassNote), type: 'triangle', a: .01, d: .3, s: .7, r: .5, peak: .25, cut: 600 });
        if (!i.intro && !i.last) { [0, 7, 10].forEach(function (st) { kick(t + st * q, .4); }); snare(t + 4 * q, .17); snare(t + 12 * q, .17); for (var k2 = 0; k2 < 16; k2++) hat(t + k2 * q, k2 % 4 === 2 ? .05 : .02, k2 === 14); }
        if (i.last) kick(t, .35);
      }
    };
    A.ballad = {
      chords: [[48, 55, 60, 64], [47, 55, 59, 62], [45, 52, 57, 60], [41, 48, 53, 57]], bass: [36, 31, 33, 29], end: [48, 55, 60, 64, 74],
      bar: function (b, t, c, i) {
        piano(c[0], t, spb * 3.8, .1, .55);
        if (i.last) { c.forEach(function (m, k) { piano(m, t + k * .02, spb * 5, .06, .7); }); pad(c, t, spb * 6, .035, 1100, 'triangle', .9); return; }
        [1, 2, 3, 2, 1, 2, 3, 2].forEach(function (idx, k) { if (i.intro && k % 2) return; piano(c[idx] + 12, t + swing(b, k / 2, .52), spb * 1.4, .05 + (k === 0 ? .015 : 0), .6); });
        if (!i.intro) pad(c, t, spb * 4.4, .03, 1200, 'triangle', .9);
      }
    };
    A.tech = {
      chords: [[57, 60, 64], [53, 57, 60], [55, 59, 62], [52, 55, 59]], bass: [45, 41, 43, 40], end: [57, 60, 64, 69],
      bar: function (b, t, c, i) {
        if (i.last) { kick(t, .4); pad(c, t, spb * 6, .045, 1000, 'sawtooth', .8); tone({ t: t, dur: spb * 4, f: mtof(i.bassNote), type: 'sawtooth', a: .01, d: .3, s: .6, r: .5, peak: .2, cut: 420 }); return; }
        if (!(i.intro && b === 0)) for (var k = 0; k < 4; k++) { kick(t + k * spb, .42); hat(t + k * spb + spb / 2, .05, k === 3); }
        for (var k2 = 0; k2 < 4; k2++) tone({ t: t + k2 * spb + spb / 2, dur: spb * .4, f: mtof(i.bassNote), type: 'sawtooth', a: .004, d: .1, s: .4, r: .05, peak: .17, cut: 420, q: 2 });
        if (!i.intro) { [3, 6, 10, 13].forEach(function (st) { c.forEach(function (m) { tone({ t: t + st * spb / 4, dur: spb * .22, f: mtof(m + 12), type: 'square', a: .002, d: .08, s: .02, r: .05, peak: .02, cut: 2400, cutEnd: 800, cutDur: .1, wet: .3, dly: 1 }); }); }); clap(t + spb, .13); clap(t + spb * 3, .13); }
        if (i.intro) pad(c, t, spb * 4, .03, 800, 'sawtooth', .8);
        if (b === n - 2) riser(t + spb * 2, spb * 2, .05);
      }
    };

    var arr = A[style] || A.lofi, timer = null;
    function bar(b, t0) {
      var intro = n >= 8 ? 2 : 1, last = b === n - 1, ci = b % arr.chords.length;
      arr.bar(b, t0 + b * 4 * spb, last ? arr.end : arr.chords[ci], { last: last, intro: b < intro, bassNote: last ? arr.bass[0] : arr.bass[ci], spb: spb });
    }
    function schedule(t0) {
      var next = 0;
      function pump() { // schedule bars up to 5 s ahead of the audio clock (all at once when rendering offline)
        var horizon = opts.eager ? Infinity : ctx.currentTime + 5;
        while (next < n && t0 + next * 4 * spb < horizon) bar(next++, t0);
        if (next >= n && timer) { clearInterval(timer); timer = null; }
      }
      pump(); if (next < n) timer = setInterval(pump, 250);
      if (arr.extra) arr.extra(t0);
      // fade in/out on the master so the end lands exactly with the scroll
      var fi = Math.min(1.4, D * .1), fo = Math.min(2.2, D * .14), peak = S.gain * .85;
      master.gain.setValueAtTime(0, t0); master.gain.linearRampToValueAtTime(peak, t0 + fi);
      master.gain.setValueAtTime(peak, t0 + D - fo); master.gain.linearRampToValueAtTime(0, t0 + D);
    }
    return {
      out: master, bars: n, bpm: bpm,
      start: function (t0, dest) { master.connect(dest); schedule(t0); },
      stop: function (when) { if (timer) { clearInterval(timer); timer = null; } var t = when || ctx.currentTime; try { master.gain.cancelScheduledValues(t); master.gain.setValueAtTime(master.gain.value, t); master.gain.linearRampToValueAtTime(0, t + .25); } catch (e) {} setTimeout(function () { try { master.disconnect(); } catch (e) {} }, 400); }
    };
  }

  /* =====================================================================
     SCROLL DIRECTOR — turns a page into a timed, human-looking camera move
     ===================================================================== */
  function jump(t, y, x) { // instant scroll; falls back for browsers that reject behavior:'instant'
    try { t.scrollTo(x ? { left: y, behavior: 'instant' } : { top: y, behavior: 'instant' }); } catch (e) { t.scrollTo(x ? y : 0, x ? 0 : y); }
  }
  var easeIO = function (x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };

  // Content blocks = the units a viewer reads (heading groups, cards, list items). The planner pauses where a block starts just under
  // the header and keeps the frame's bottom edge out of the middle of a block. A template can pin the pauses with [data-reel-stop].
  function contentBlocks(win, doc, vh) {
    var sy = win.scrollY, out = [];
    function ok(e) { var cs = win.getComputedStyle(e), r = e.getBoundingClientRect(); return r.height > 8 && r.width > 8 && cs.display !== 'none' && cs.visibility !== 'hidden' && cs.position !== 'fixed' && !/^(SCRIPT|STYLE|CANVAS|LINK|META)$/.test(e.tagName); }
    function kids(e) { return Array.prototype.filter.call(e.children, ok); }
    function push(c) { // layout position (offsetTop chain) so entrance transforms like translateY(22px) never skew the plan
      if (typeof c.offsetTop === 'number' && c.offsetParent !== undefined) { var t = 0, n = c; while (n) { t += n.offsetTop; n = n.offsetParent; } out.push({ el: c, top: t, bottom: t + c.offsetHeight }); }
      else { var r = c.getBoundingClientRect(); out.push({ el: c, top: r.top + sy, bottom: r.bottom + sy }); }
    }
    function atomic(e) { // a unit that must stay together: a semantic group, or anything with its own visible box (card, panel, quote block)
      if (e.hasAttribute('data-reel-block') || /^(FIGURE|ARTICLE|BLOCKQUOTE|LI|DETAILS|FORM|TABLE|UL|OL|DL|PRE|FOOTER)$/.test(e.tagName)) return true;
      var cs = win.getComputedStyle(e);
      return (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent') || (cs.borderTopStyle !== 'none' && parseFloat(cs.borderTopWidth) > 0) || cs.boxShadow !== 'none';
    }
    function descend(e, depth) {
      var k = kids(e);
      while (k.length === 1 && depth < 6 && !atomic(k[0])) { e = k[0]; k = kids(e); depth++; } // skip plain single-child wrappers (.wrap ...) but never a unit (figure, card...)
      k.forEach(function (c) {
        var cs = win.getComputedStyle(c), r = c.getBoundingClientRect();
        if (kids(c).length > 1 && /grid|flex/.test(cs.display) && r.height > vh * .45 && depth < 5 && !atomic(c)) descend(c, depth + 1); // tall grid/list: its items are the blocks
        else push(c);
      });
    }
    var pinned = doc.querySelectorAll('[data-reel-stop]');
    if (pinned.length) Array.prototype.forEach.call(pinned, push);
    else {
      var secs = doc.querySelectorAll('main > *, body > section, body > footer'); if (!secs.length) secs = doc.body.children;
      Array.prototype.filter.call(secs, ok).forEach(function (sec) { var n = out.length; descend(sec, 0); if (out.length === n) push(sec); });
    }
    return out.sort(function (a, b) { return a.top - b.top; });
  }
  function label(b) { return b.el.tagName.toLowerCase() + (b.el.className && typeof b.el.className === 'string' ? '.' + b.el.className.trim().split(/\s+/)[0] : '') + ' "' + (b.el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 28) + '"'; }

  function planStops(win, doc, vh, max, barH) {
    var usable = vh - barH, BR = 28, blocks = contentBlocks(win, doc, vh), stops = [], cur = 0;
    blocks.forEach(function (b, i) { // how much air the bottom edge should leave under a block: half the gap to the next block (6–14px)
      var n = blocks[i + 1], gap = n && n.top >= b.bottom ? n.top - b.bottom : 40; b.gap = gap; b.need = Math.max(6, Math.min(14, gap / 2 - 1));
    });
    var small = blocks.filter(function (b) { return b.bottom - b.top <= usable * .9; }); // blocks that could fit a frame; bigger ones can't avoid being cut
    function sliceAt(line) { return small.filter(function (b) { return b.top < line - 8 && b.bottom > line - b.need; }); } // cut through, or hugging the edge without the air it could have had
    function sliceTop(line) { return small.filter(function (b) { return b.top < line - 8 && b.bottom > line + 8; }); } // half-hidden under the header (a thin sliver of the previous block is fine)
    function amount(list, line) { return list.length ? list.length * 200 + 2 * list.reduce(function (a, b) { return a + Math.min(vh * .4, Math.abs(line - b.top), Math.abs(b.bottom - line)); }, 0) : 0; } // any cut block costs far more than an extra pause
    // a frame is judged on both edges: the bottom edge slicing a block counts fully, a block half-hidden under the header counts less
    function pen(y) { var bl = y + vh, tl = y + barH + 6; return amount(sliceAt(bl), bl) + amount(sliceTop(tl), tl); }
    // Plan ALL pauses together (shortest path over candidate positions): fewest cut blocks first, then fewest pauses, preferring neat frames
    // where a block starts under the header or the bottom edge sits in the gap after a block. Each hop is 0.5–0.96 of a frame, so nothing is skipped.
    var neat = {}, ys = [0], seen = { 0: 1 };
    function add(y) { y = Math.round(y); if (y > 0 && y < max && !seen[y]) { seen[y] = 1; ys.push(y); } }
    blocks.forEach(function (b) {
      var y1 = Math.round(b.top - barH - BR), y2 = Math.round(b.bottom + Math.min(b.gap / 2, 30) - vh);
      [y1, y2].forEach(function (y) { if (y > 0 && y < max) { neat[y] = 1; add(y); } });
    });
    for (var sy = 8; sy < max; sy += 8) add(sy);
    ys.sort(function (a, b) { return a - b; });
    var hasEnd = max > 4; if (hasEnd) ys.push(max);
    var n = ys.length, K = 25, best = [], prev = [], i, j;
    var cost = ys.map(function (y, k) { return k === 0 || (hasEnd && k === n - 1) ? 0 : pen(y) - (neat[y] ? 5 : 0) + K; });
    for (i = 0; i < n; i++) best[i] = Infinity; best[0] = 0;
    for (i = 0; i < n - 1; i++) {
      if (best[i] === Infinity) continue;
      for (j = i + 1; j < n; j++) {
        var d = ys[j] - ys[i], isEnd = hasEnd && j === n - 1;
        if (d > usable * (isEnd ? 1.3 : .96)) break;
        if (d < usable * (isEnd ? .4 : .5) && !(isEnd && i === 0)) continue;
        if (best[i] + cost[j] < best[j]) { best[j] = best[i] + cost[j]; prev[j] = i; }
      }
    }
    if (best[n - 1] === Infinity) { for (var f = usable * .85; f < max - usable * .4; f += usable * .85) stops.push(Math.round(f)); } // pages the search can't cover: even spacing
    else { for (j = prev[n - 1]; j > 0; j = prev[j]) stops.unshift(ys[j]); }
    var all = [0].concat(stops, max > 4 ? [max] : []);
    return { stops: stops, blocks: blocks.length, report: all.map(function (y) { var end = max > 4 && y >= max - 1; return { y: y, sliced: end ? [] : sliceAt(y + vh).map(label), under: end ? [] : sliceTop(y + barH + 6).map(label) }; }) }; // the last frame is the end of the page: nothing is cut there
  }

  function buildPlan(win, doc, D) {
    var cfg = win.__reel || {}, vh = win.innerHeight, scroller = null;
    if (cfg.scroller) scroller = doc.querySelector(cfg.scroller);
    var axisX = scroller && cfg.axis === 'x';
    var max = scroller ? Math.max(0, axisX ? scroller.scrollWidth - scroller.clientWidth : scroller.scrollHeight - scroller.clientHeight)
                       : Math.max(0, doc.documentElement.scrollHeight - vh);
    var pts = [0], report = [], blocksN = 0, barH = 0;
    if (!scroller) {
      // height of a sticky/fixed top bar so section titles don't hide under it
      Array.prototype.some.call(doc.querySelectorAll('header,nav,[class*="bar"]'), function (e) {
        var cs = win.getComputedStyle(e), r = e.getBoundingClientRect();
        if ((cs.position === 'sticky' || cs.position === 'fixed') && r.top < 4 && r.height < 120 && r.width > win.innerWidth * .6) { barH = r.height; return true; }
      });
      var H0x = Math.min(2.8, D * .13), H1x = Math.min(2.6, D * .12), maxStops = Math.max(2, Math.floor((D - H0x - H1x) / 2.2));
      if (cfg.stops) { // explicit pauses chosen by the template (selectors or pixel offsets)
        var cand = cfg.stops.map(function (s) { var e = typeof s === 'string' ? doc.querySelector(s) : null; return typeof s === 'number' ? s : e ? e.getBoundingClientRect().top + win.scrollY - barH - 6 : null; });
        var kept = cand.filter(function (y) { return y != null && y > vh * .3 && y < max - vh * .3; }).sort(function (a, b) { return a - b; });
        pts = pts.concat(kept);
      } else {
        var ps = planStops(win, doc, vh, max, barH), st = ps.stops;
        while (st.length > maxStops) st = st.filter(function (_, i) { return i % 2 === 1; }); // too many pauses for this length: keep every other one
        report = ps.report; blocksN = ps.blocks; pts = pts.concat(st);
      }
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
      points: pts, stops: Math.max(0, pts.length - 2), max: max, scroller: scroller, axisX: axisX, barH: barH, blocks: blocksN, report: report,
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
  var DEF = { len: 30, music: 'auto', frame: 'auto', hideBack: true, cover: true };
  function load() { try { return Object.assign({}, DEF, JSON.parse(localStorage.getItem('reel.settings') || '{}')); } catch (e) { return Object.assign({}, DEF); } }
  function save(s) { try { localStorage.setItem('reel.settings', JSON.stringify(s)); } catch (e) {} }

  /* =====================================================================
     UI + RUNTIME
     ===================================================================== */
  var css = '' +
    'body.reel-lock>*:not(#reel):not(#reelset){visibility:hidden!important}body.reel-lock>*:not(#reel) *{animation-play-state:paused!important}' + // the page behind the player must not keep animating/painting
    '#reel iframe{transform:translateZ(0)}' +
    '#reel{position:fixed;inset:0;box-sizing:border-box;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent;z-index:2147483000;background:#000;display:flex;align-items:center;justify-content:center;cursor:none;touch-action:none;overscroll-behavior:none;font-family:system-ui,-apple-system,sans-serif;color:#fff}' +
    '#reel iframe{border:0;background:#fff;display:block;pointer-events:none}' +
    '#reel .cd{position:absolute;inset:0;background:radial-gradient(circle at 50% 40%,#12394d,#05080c 70%);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;transition:opacity .35s}' +
    '#reel .cd.off{opacity:0;pointer-events:none}' +
    '#reel .cd small{font:700 .8rem ui-monospace,monospace;letter-spacing:.22em;text-transform:uppercase;opacity:.7}' +
    '#reel .ring{position:relative;width:min(56vw,260px);aspect-ratio:1;display:grid;place-items:center}' +
    '#reel .ring svg{position:absolute;inset:0;transform:rotate(-90deg)}#reel .ring circle{fill:none;stroke-width:6}' +
    '#reel .num{font:800 min(34vw,150px)/1 system-ui,sans-serif;letter-spacing:-.04em}' +
    '#reel .name{font:600 1.1rem system-ui,sans-serif;opacity:.85;text-align:center;padding:0 24px}' +
    '#reel .cv{position:absolute;box-sizing:border-box;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;transition:opacity .25s}' +
    '#reel .cv.off{opacity:0;pointer-events:none}' +
    '#reel .cv .k{font:700 .72rem ui-monospace,monospace;letter-spacing:.24em;text-transform:uppercase;opacity:.75}' +
    '#reel .cv .t{font:800 1em/1.02 system-ui,-apple-system,sans-serif;letter-spacing:-.03em;margin:.35em 0 0;text-wrap:balance}' +
    '#reel .cv .pv{display:block;border-radius:22px;box-shadow:0 18px 40px rgba(0,0,0,.35);border:1px solid rgba(128,128,128,.25);background:#fff}' +
    '#reel .cv .n{font:700 .95rem system-ui,sans-serif;opacity:.85}' +
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

  // A translucent, blurred sticky header is very expensive to repaint on every scrolled frame: make it opaque (same look over a solid page colour).
  function solidifyBar(doc, win, page) {
    try {
      Array.prototype.some.call(doc.querySelectorAll('header,nav,[class*="bar"]'), function (e) {
        var cs = win.getComputedStyle(e), r = e.getBoundingClientRect();
        if (!((cs.position === 'sticky' || cs.position === 'fixed') && r.top < 4 && r.height < 160 && r.width > win.innerWidth * .6)) return false;
        var m = /^rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:[ ,/]+([\d.]+))?/.exec(cs.backgroundColor), p = /([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)/.exec(page);
        var out = page; // unparsable or fully transparent colour: use the page colour
        if (m && p) { var a = m[4] == null ? 1 : +m[4]; if (a > 0) out = 'rgb(' + [1, 2, 3].map(function (i) { return Math.round(a * m[i] + (1 - a) * p[i]); }).join(',') + ')'; }
        e.style.setProperty('background-color', out, 'important'); return true;
      });
    } catch (e) {}
  }

  // iOS paints the status-bar area from the top-level page's colours: match them to the template so the recording looks seamless
  function pageColor(doc, win) {
    var c = '', m = doc.querySelector('meta[name="theme-color"]');
    try { c = win.getComputedStyle(doc.body).backgroundColor; if (!c || /rgba\(.*,\s*0\)|transparent/.test(c)) c = win.getComputedStyle(doc.documentElement).backgroundColor; } catch (e) {}
    if (!c || /rgba\(.*,\s*0\)|transparent/.test(c)) c = (m && m.content) || '#000';
    return c;
  }
  function tintPage(color) {
    var root = document.documentElement, meta = document.querySelector('meta[name="theme-color"]'), made = false;
    if (!meta) { meta = document.createElement('meta'); meta.name = 'theme-color'; document.head.appendChild(meta); made = true; }
    var prev = { meta: meta.content, bg: root.style.backgroundColor, scheme: root.style.colorScheme };
    meta.content = color; root.style.backgroundColor = color;
    var rgb = (color.match(/[\d.]+/g) || [0, 0, 0]).map(Number), lum = (.299 * rgb[0] + .587 * rgb[1] + .114 * rgb[2]) / 255;
    root.style.colorScheme = lum < .5 ? 'dark' : 'light';
    return function () { if (made) meta.remove(); else meta.content = prev.meta; root.style.backgroundColor = prev.bg; root.style.colorScheme = prev.scheme; };
  }

  var actx = null, silent = null, logP = null, run = null;
  function ensureAudio() {
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
    if (!actx) { try { actx = new AC({ latencyHint: 'playback' }); } catch (e) { actx = new AC(); } } // larger audio buffers: fewer wake-ups competing with scrolling
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

  var kitsP = null;
  function getKits() { if (!kitsP) kitsP = fetch('/social-kits.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).catch(function () { return []; }); return kitsP; }

  function stop(r) {
    if (!r || r.dead) return; r.dead = true;
    if (r.raf) cancelAnimationFrame(r.raf); clearTimeout(r.tm); clearInterval(r.iv);
    if (r.music) r.music.stop(); if (r.lock) try { r.lock.release(); } catch (e) {}
    if (r.restore) r.restore(); document.body.classList.remove('reel-lock');
    if (r.node && r.node.parentNode) r.node.parentNode.removeChild(r.node);
    if (silent) try { silent.pause(); } catch (e) {}
    if (run === r) run = null;
  }

  function start(id) {
    if (run) stop(run);
    addCss();
    var st = load(), ctx = ensureAudio(); // must happen inside the tap (iOS needs the user gesture)
    var r = run = { id: id, dead: false };
    var box = el('div'); box.id = 'reel'; r.node = box; document.body.appendChild(box); document.body.classList.add('reel-lock');
    // Reel frame: the largest 9:16 box that fits the screen, centred. On a tall phone (iPhone 17 Pro is 9:19.5) the bands above and
    // below hold the status bar / home indicator and are exactly what Instagram's default 9:16 crop trims away.
    var vw = innerWidth, vh = innerHeight, fw = vw, fh = vh;
    if (st.frame !== 'full') { fw = Math.min(vw, Math.round(vh * 9 / 16)); fh = Math.min(vh, Math.round(fw * 16 / 9)); }
    var restore = tintPage('#05080c');
    r.restore = restore;
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
      if (e) { nm.textContent = e.name || e.slug; style = styleForTheme(e.theme, e.purpose, id); }
      if (st.music !== 'auto' && STYLES[st.music]) style = st.music;
    });

    var cover = { text: '', name: '', img: null };
    if (st.cover) {
      getKits().then(function (ks) { var k = (ks || []).filter(function (x) { return x.id === id; })[0]; if (k) { cover.text = (k.reel && k.reel.cover) || k.hook || ''; cover.name = k.name || ''; } });
      var im = new Image(); im.onload = function () { cover.img = im; }; im.src = '/covers/' + id + '.jpg'; // decoded now so the cover card is complete on its very first frame
    }
    function makeCover(tint) { // the opening card: becomes the first frame of the recording, so Instagram can use it as the Reel cover
      var rgb = (tint.match(/[\d.]+/g) || [0, 0, 0]).map(Number), dark = (.299 * rgb[0] + .587 * rgb[1] + .114 * rgb[2]) / 255 < .5, ink = dark ? '#fff' : '#111';
      var cv = el('div', 'cv'); cv.style.left = Math.floor((innerWidth - fw) / 2) + 'px'; cv.style.top = Math.floor((innerHeight - fh) / 2) + 'px'; cv.style.width = fw + 'px'; cv.style.height = fh + 'px'; cv.style.background = tint; cv.style.color = ink; cv.style.padding = Math.round(fh * .07) + 'px ' + Math.round(fw * .08) + 'px';
      cv.appendChild(el('div', 'k', 'New template · every day'));
      var t = el('div', 't', cover.text || cover.name); t.style.fontSize = Math.round(fw * (cover.text.length > 22 ? .1 : .12)) + 'px'; cv.appendChild(t);
      if (cover.img) {
        var ph = Math.round(fh * (cover.text ? .5 : .62)), pw = Math.round(ph * 402 / 715), pv = el('img', 'pv'); pv.src = cover.img.src; pv.alt = ''; pv.style.width = pw + 'px'; pv.style.height = ph + 'px'; pv.style.margin = Math.round(fh * .035) + 'px 0';
        cv.appendChild(pv);
      }
      if (cover.name) cv.appendChild(el('div', 'n', cover.name + ' · Aquarii'));
      return cv;
    }
    function freeze(doc, win) { // pause CSS animations until the camera "starts rolling"; optionally hide the back link
      if (doc.getElementById('__reel_freeze')) return;
      var s = doc.createElement('style'); s.id = '__reel_freeze'; s.textContent = '*,*::before,*::after{animation-play-state:paused!important}';
      var b = doc.createElement('style'); b.id = '__reel_base'; b.textContent = 'html{scroll-behavior:auto!important}*,*::before,*::after{-webkit-backdrop-filter:none!important;backdrop-filter:none!important}'; // our scrolling must never be smoothed by the page
      var host = doc.head || doc.documentElement; host.appendChild(b); host.appendChild(s);
      doc.documentElement.classList.add('reel'); // templates style this: no safe-area padding (the frame already sits inside it), centred header, etc.
    }
    function hideBack(doc) {
      if (!st.hideBack) return;
      Array.prototype.forEach.call(doc.querySelectorAll('a[href="/"]'), function (a) { if (/All templates/i.test(a.textContent)) a.style.setProperty('display', 'none', 'important'); });
    }
    function loadFresh() {
      fresh = true; ready = false;
      try { frame.contentWindow.__reelOld = true; } catch (e) {} // mark the preloaded copy so the poller never mistakes it for the fresh load
      frame.src = 'about:blank';
      setTimeout(function () { if (r.dead) return; frame.src = url; }, 30);
      clearInterval(r.iv);
      r.iv = setInterval(function () {
        try {
          var d = frame.contentDocument, w = frame.contentWindow;
          if (d && w && !w.__reelOld && d.URL.indexOf(url) > -1 && d.documentElement) { freeze(d, w); if (d.readyState === 'complete' && !ready) { hideBack(d); var f = d.fonts && d.fonts.ready ? Promise.race([d.fonts.ready, new Promise(function (ok) { setTimeout(ok, 1500); })]) : Promise.resolve(); f.then(function () { setTimeout(function () { ready = true; }, 200); }); ready = 'pending'; clearInterval(r.iv); }
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
      var tint = pageColor(d, w); box.style.background = tint; tintPage(tint);
      var plan = buildPlan(w, d, D);
      var LEAD = .6, COV = st.cover && (cover.text || cover.img) ? 1.3 : 0, thawed = false, tStart, music = null; // short lead: overlay fades out and the audio graph is built BEFORE "action", so the first frames don't stutter on phones
      if (ctx && st.music !== 'off') music = Music(ctx, style, D, id);
      solidifyBar(d, w, tint); cd.classList.add('off'); xb.style.display = 'none'; hideBack(d);
      if (COV) { var cv = makeCover(tint); box.appendChild(cv); setTimeout(function () { cv.classList.add('off'); }, COV * 1000 + 150); setTimeout(function () { if (cv.parentNode) cv.parentNode.removeChild(cv); }, COV * 1000 + 600); }
      var c0 = ctx ? ctx.currentTime : 0, p0 = performance.now(); // one reading of both clocks, back to back
      if (music) { r.music = music; music.start(c0 + COV + LEAD, ctx.destination); }
      // The SCROLL runs on the screen's own frame clock (rAF timestamps), not the audio clock: audio clocks tick in coarse chunks
      // (9–20 ms steps on a 16.7 ms frame), which showed up as stutter. The audio clock is used once, to line the start up.
      var lat = ctx ? Math.min(250, ((ctx.outputLatency || ctx.baseLatency || 0) * 1000)) : 0;
      tStart = p0 + (COV + LEAD) * 1000 + lat;
      var dpr = w.devicePixelRatio || 1, lastY = -1, lastH = d.documentElement.scrollHeight, chk = 0;
      (function loop(ts) {
        if (r.dead) return;
        ts = ts || performance.now();
        var t = (ts - tStart) / 1000;
        if (!thawed && t >= 0) { thawed = true; if (fz && fz.parentNode) fz.parentNode.removeChild(fz); } // animations start exactly with the music
        if (ts - chk > 500) { // layout can settle after fonts/images load: re-plan only if the page height really changed (planning is expensive)
          chk = ts; var h = d.documentElement.scrollHeight;
          if (Math.abs(h - lastH) > 4) { lastH = h; setTimeout(function () { if (!r.dead) plan = buildPlan(w, d, D); }, 0); }
        }
        var y = Math.round(plan.at(Math.max(0, t)) * dpr) / dpr; // whole device pixels: no blurry half-pixel positions
        if (y !== lastY) { lastY = y; if (plan.scroller) jump(plan.scroller, y, plan.axisX); else jump(w, y); }
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
    group('Music', 'music', [['auto', 'Auto (matches template)']].concat(Object.keys(STYLES).map(function (k) { return [k, STYLES[k].name]; }), [['off', 'Off']]));
    group('Cover card (first 1.3 s)', 'cover', [['true', 'On — use it as the Reel cover'], ['false', 'Off']]);
    group('Frame', 'frame', [['auto', 'Reel 9:16 (recommended)'], ['full', 'Full screen']]);
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
