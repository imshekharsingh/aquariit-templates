# Review: showreel-32-waiting (web, postOn 2026-11-10 postAt 13:00 IST)

The Mandatory Gate, design/mandatory.md. Slow-mo details format in style C (experiment details-format, try 3), built 8 Nov ahead for 2026-11-10
(owner override, 8 Nov: build ahead for Mon 9 and Tue 10 Nov). Calm (rules-web.md rule 13): 3 details, one beat of 5.8 s each (the tap at real speed,
a rewind, the same tap in slow motion with its live curve and one speed chip, a settle hold), the recap grid plays once and holds. First reels with the
kit's element sound (scripts/explainer/kitsfx.js): every element that enters, changes or leaves has a cue matched to its size, in key, panned by x.
AUTO lines from preflight.mjs and stills.mjs, 8 Nov.

1. Topic: PASS: three motions anyone sees while an app works (a send button, a photo loading, a saved toast); rule 1 pass (everyday app controls, as a user), rule 2 pass (the send button already shrunk to a check at frame 0, then grown back to "Send" for part 1), rule 3 pass (the first CSS typed under the live component from ~2.7 s), rule 4 pass (a new detail at ~2.3-2.5, ~8.1-8.3, ~13.9-14.1 s and the recap at ~19.7-19.9 s; inside each beat a new pass every ~2 s), rule 5 pass (all visible motion), rule 6 pass ("Why does waiting feel shorter?", 5 words, two lines over the button), rule 7 pass (13:00 IST), rule 8 pass (each CSS line checked against MDN's compat data, BCD 8.1.8; the recap grid held 4.6 s+; the caption invites a save), rule 9 pass (no unchecked words), rule 10 pass (FLOW below), rule 11 pass (satisfying motion, result first), rule 12 pass (style C through KM.theme('glass'), cheap glass; minutes measured in item 13), rule 13 pass (PACE ok)
2. Frame 0: PASS: SUBJECT FILL: 67% at frame 0; HOOK: clear of the subject; the send button already shrunk to a check at frame 0, then grown back to "Send" for part 1
3. Safe zone: PASS: SAFE ZONE: ok (every still: the components, code panes, curve, speed badge and recap tiles inside x 60-960, y 250-1570; frame 0 framed at its hook zoom)
4. No overlap: PASS: OVERLAP: none; BAND: clear (code pane and curve above the band on every still; one chip at a time, the speed chip only in the slow pass)
5. Motion: PASS: STATIC STRETCH: none (least change 2.1 at 16.5 s, median 4.7); EMPTY FRAMES: none (scanned 49 moments, least detail 17.1 at 20 s); TEXT FIT: all text inside its box
6. Subtitles: PASS: SUBTITLES: at least 52 px, at most 6 words a line; every sentence shown and finished on the stills
7. Voice: PASS: PREFLIGHT voice: 5 timed sentences, 35 words, voice ends about 22.5 s (reel 24.5 s, must end by 23.9 s), 2.9 words/s while speaking, 1.6 overall: fits; PACE: beats 3, shortest beat 5.8 s, words/s 1.56, shortest breath 0.61 s, hook 2.5 s, recap 4.6 s: ok; PRONUNCIATION: 0 overrides used; no unchecked words
8. Sound: PASS: 125 cues: each tap a mid touch and its landing a snap, both at real speed and in slow motion, tuned to the bed; titles and recap tiles as pitched runs; the subtitle band a low move in and out; the camera glides, rewinds, slow-motion swell and whoosh, typing ticks, part bar clicks and the recap resolve from the kit (at most 6 non-tick cues in any 0.25 s); bed ducked under the voice (duck 8); the workflow's SOUND GATE checks the loudness
9. Payoff: PASS: each detail lands and holds (the check drawn, the photo in, the toast settled), then the recap grid of all three plays once at full speed and holds with a spotlight walking the tiles; the last frame is the grid
10. Facts: PASS: sources in the config: MDN width, scale (BCD Chrome 104, Firefox 72, Safari 14.1), @starting-style (Chrome 117, Firefox 129, Safari 17.5), cubic-bezier() overshoot; tip + live demo "waiting" on /tips/; npm run check passes
11. Post data: PASS: captions.json entry with channel web, postOn 2026-11-10, postAt 13:00, concept, about, note; 6 keywords, 5 hashtags in the config
12. Review file: PASS: this file, items 1-11, 14-18
13. After the render: PASS: run 42460745987 green, about 15 GitHub minutes (voice 1.5, frames 11.7, render 1.4; rule 12 target 30), 24.5 s at 60 fps, cover at 1.79 s; SOUND GATE: ok -14.8 LUFS, true peak -1.9 dBTP; voice check: 35 words in the script, 35 heard as written ("one" at 2.92 s at 0.47, "then" at 16.04 s at 0.57, both on screen as said); pacing 1.60 words/s overall, no sentence flagged, pauses of 3.0-3.4 s after each detail line; the contact sheet artifact cannot be downloaded from the session (Forbidden), so the stills sheet of the merged scene (identical file) stands for it
14. Cuts: PASS: FLOW: cuts 0 (declared: 4 matchMoves from the kit, one into each part and the recap)
15. Dead runs: PASS: FLOW: dead runs none (no holds declared)
16. Continuity: PASS: FLOW: continuity 100% (median step 1.1, 4 declared transitions)
17. Strobes: PASS: FLOW: strobes 0
18. Element sound (web): PASS: ELEMENT SOUND: 139 of 139 animated elements have a cue (100%): ok
