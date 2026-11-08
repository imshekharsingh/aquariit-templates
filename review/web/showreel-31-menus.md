# Review: showreel-31-menus (web, postOn 2026-11-09 postAt 13:00 IST)

The Mandatory Gate, design/mandatory.md. Slow-mo details format in style C (experiment details-format, try 2), built 8 Nov ahead for 2026-11-09
(owner override, 8 Nov: build ahead for Mon 9 and Tue 10 Nov). Calm (rules-web.md rule 13): 3 details, one beat of 5.8 s each (the tap at real speed,
a rewind, the same tap in slow motion with its live curve and one speed chip, a settle hold), the recap grid plays once and holds. First reels with the
kit's element sound (scripts/explainer/kitsfx.js): every element that enters, changes or leaves has a cue matched to its size, in key, panned by x.
AUTO lines from preflight.mjs and stills.mjs, 8 Nov.

Sound change 8 Nov ~20:00 IST (owner: "the whooshes and swells are too much; tone them down for a more elegant tone"): sound.py air kinds (whoosh, swish, riser, move, swell) 5.5 dB lower, low-passed at 7 kHz, tails about a third shorter; the element-detail bus unchanged. Picture unchanged; ONE re-render for the sound (item 13).

1. Topic: PASS: three menu motions anyone taps daily (a tab bar, an accordion row, an overflow menu); rule 1 pass (everyday app controls, as a user), rule 2 pass (the tab line already sitting under "Live" at frame 0, then easing back to "For you" for part 1), rule 3 pass (the first CSS typed under the live component from ~2.7 s), rule 4 pass (a new detail at ~2.3-2.5, ~8.1-8.3, ~13.9-14.1 s and the recap at ~19.7-19.9 s; inside each beat a new pass every ~2 s), rule 5 pass (all visible motion), rule 6 pass ("Why do menus feel so smooth?", 6 words, two lines over the tabs), rule 7 pass (13:00 IST), rule 8 pass (each CSS line checked against MDN's compat data, BCD 8.1.8; the recap grid held 4.6 s+; the caption invites a save), rule 9 pass (no unchecked words), rule 10 pass (FLOW below), rule 11 pass (satisfying motion, result first), rule 12 pass (style C through KM.theme('glass'), cheap glass; minutes measured in item 13), rule 13 pass (PACE ok)
2. Frame 0: PASS: SUBJECT FILL: 70% at frame 0; HOOK: clear of the subject; the tab line already sitting under "Live" at frame 0, then easing back to "For you" for part 1
3. Safe zone: PASS: SAFE ZONE: ok (every still: the components, code panes, curve, speed badge and recap tiles inside x 60-960, y 250-1570; frame 0 framed at its hook zoom)
4. No overlap: PASS: OVERLAP: none; BAND: clear (code pane and curve above the band on every still; one chip at a time, the speed chip only in the slow pass)
5. Motion: PASS: STATIC STRETCH: none (least change 2.6 at 7 s, median 4.7); EMPTY FRAMES: none (scanned 50 moments, least detail 14.0 at 14 s); TEXT FIT: all text inside its box
6. Subtitles: PASS: SUBTITLES: at least 52 px, at most 6 words a line; every sentence shown and finished on the stills
7. Voice: PASS: PREFLIGHT voice: 5 timed sentences, 38 words, voice ends about 22.5 s (reel 24.6 s, must end by 24.0 s), 3.1 words/s while speaking, 1.7 overall: fits; PACE: beats 3, shortest beat 5.8 s, words/s 1.69, shortest breath 0.64 s, hook 2.3 s, recap 4.9 s: ok; PRONUNCIATION: 0 overrides used; no unchecked words
8. Sound: PASS: 137 cues: each tap a mid touch and its landing a snap, both at real speed and in slow motion, tuned to the bed; the menu items as a high pitched run; titles and recap tiles as pitched runs; the subtitle band a low move in and out; the camera glides, rewinds, slow-motion swell and whoosh, typing ticks, part bar clicks and the recap resolve from the kit (at most 7 non-tick cues in any 0.25 s); bed ducked under the voice (duck 8); the workflow's SOUND GATE checks the loudness; element sounds on the detail bus (8 Nov): SOUND DETAIL: 90 of 90 element cues audible (>= -18 dB vs voice); quietest -14.0 dB, median -11.6 dB (100%): ok (before the bus: 1 of 112, median -28.7 dB)
9. Payoff: PASS: each detail lands and holds (line under Live, the row open, three items in), then the recap grid of all three plays once at full speed and holds with a spotlight walking the tiles; the last frame is the grid
10. Facts: PASS: sources in the config: MDN grid-template-rows (BCD animation Chrome 107, Firefox 66, Safari 16), transition-delay, translate (Chrome 104, Firefox 72, Safari 14.1), transition-timing-function; tip + live demo "menus" on /tips/; npm run check passes
11. Post data: PASS: captions.json entry with channel web, postOn 2026-11-09, postAt 13:00, concept, about, note; 6 keywords, 5 hashtags in the config
12. Review file: PASS: this file, items 1-11, 14-18
13. After the render: PASS: re-render 8 Nov for the softer air (first try, run 42489105010, failed the loudness gate at -15.1 LUFS: the limiter took more off the peakier mix; fixed with a corrective second loudness pass in showreel.yml, #702), run 42491321589 green; SOUND DETAIL: 90 of 90 audible (100%): ok, quietest -13.8 dB, median -11.6 dB vs the voice (the details now lead, the air 5.5 dB lower behind them); SOUND GATE: ok -14.2 LUFS, true peak -1.4 dBTP; voice check: 1.73 words/s, only "one" at 2.72 s unsure (0.56, on screen as said); contact sheet artifact cannot be downloaded from the session (Forbidden); picture unchanged
14. Cuts: PASS: FLOW: cuts 0 (declared: 4 matchMoves from the kit, one into each part and the recap)
15. Dead runs: PASS: FLOW: dead runs none (no holds declared)
16. Continuity: PASS: FLOW: continuity 100% (median step 1.0, 4 declared transitions)
17. Strobes: PASS: FLOW: strobes 0
18. Element sound (web): PASS: ELEMENT SOUND: 144 of 144 animated elements have a cue (100%): ok
