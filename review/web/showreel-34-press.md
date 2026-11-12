# Review: showreel-34-press (web, postOn 2026-11-12 postAt 13:00 IST)

The Mandatory Gate, design/mandatory.md. REBUILT 12 Nov (owner, ~08:30 IST: "it doesn't engage me"). What was wrong with the first cut
(run 43136841166): the payoff was a 4% scale change on a button that looked the same before and after; from 6.9 s to the end the frame was
the same checkout card with the code on top, the lower third empty, and it ended drifting into a product list. E18 kept (dark theme, one
motion-feel fix, the same :active fix, the same hook). The rebuild makes the difference impossible to miss:
- frame 0: ONE Pay button as wide as the frame in a checkout pane, a finger tapping it ("tap?", "tap??", "tap??!", "hello?") and NOTHING
  moves, in silence; then a TAPS counter (5, 6, 7) and "BUTTON MOVED 0 px" in red, and a dashed outline still a perfect fit on "Nothing moves";
- the fix typed on a code card (`transition: .12s` + `:active { scale: .96; box-shadow: 0 2px 6px #0006; filter: brightness(.92) }`), while
  the button splits into DEAD | PRESSED side by side and the finger taps each in turn: the dead one silent and still, the pressed one sinking
  (scale .96, its lip and shadow collapsing, a slight darken, exactly the CSS on the card) with a soft thock and a mint ring;
- "Watch it slowed down": the pressed one glides back to full width, the camera closes in (z 1.2), one press replayed at 0.25x
  (KM.timeScale, badge "0.25× SPEED") with its live CSS-ease curve (KM.curveGraph), a 0-120 ms counter (KM.specChip) and the live scale
  (1.00 → 0.96); the press starts on "sinks", a mint glow on "shadow", the release on "springs"; real speed again after;
- payoff: a rhythm of 15 presses (three quick, a breath) with thock + tick + ring each, the button big (z 1.1), the fix on three lines
  above it; the reel ends on the button, its last press released before the loop.
AUTO lines from preflight.mjs and stills.mjs, 12 Nov ~09:10 IST (simulated voice; the real voice re-anchors every beat).

1. Topic: PASS: anyone who has tapped Pay and tapped again because nothing moved; felt in 1 s (a big dead button and a finger). Rulebook: rule 1 pass (a checkout button, as a user), rule 2 pass (the finger is tapping the dead button at frame 0), rule 3 pass (the fix typed from ~6.6 s), rule 4 pass (a new reveal at 4 s: TAPS / 0 px, 8 s: dead vs pressed side by side, 12 s: the 0.25x replay, 16 s+: the rhythm), rule 5 pass (a press you see and hear), rule 6 pass ("Why does your button feel dead on tap?", 8 words, over the dead button), rule 7 pass (13:00 slot; posting late is the owner's call), rule 8 pass (the three-line fix on screen 6.6-11 s and again 17.5 s to the end; MDN + BCD), rule 9 pass (PRONUNCIATION clean), rule 10 pass (items 14-16), rule 11 pass (a satisfying press as the payoff, the result shown big and in rhythm), rule 12 pass (E18 dark theme, KM.theme('dark'); cheap glass), rule 13 n/a (single fix, not details), rule 14 pass (see item 9)
2. Frame 0: PASS: SUBJECT FILL: 48% at frame 0; HOOK: clear of the subject; the finger is coming down on a frame-wide Pay button that does not move, the "tap?" bubble rising beside it
3. Safe zone: PASS: SAFE ZONE: ok
4. No overlap: PASS: OVERLAP: none; BAND: clear (the subtitles sit inside the pane under the button; the finger fades out before it reaches them)
5. Motion: PASS: STATIC STRETCH: none (least change 1.6 at 14 s, median 5.0); EMPTY FRAMES: none (scanned 44 moments, least detail 45.0 at 8.5 s); TEXT FIT: all text inside its box
6. Subtitles: PASS: SUBTITLES: at least 52 px, at most 6 words a line; every sentence shown and finished (hook on the card, then all 7 sentences in the band, key words in mint)
7. Voice: PASS: PREFLIGHT voice: 198 letters, 8 sentences, about 18.8 s at speed 0.9 with 3.65 s of breaths (reel 22 s, voice must end by 21.4 s): fits; PRONUNCIATION: 0 overrides used; no unchecked words; CONTRAST: 4.5:1 (dark), worst "TAPS" at 6.0 s; 48 words, 2.2 words/s over the reel, short sentences at natural pace (speed 0.9, the hook 0.8)
8. Sound: PASS: by design a dead tap is SILENT (only its bubble a muted blip) and every live press a soft thock (thud) going down + a light tick (pop) coming back, the slow press a deeper thock; typing ticks, the outline's draw, the camera moves, the two declared glides, the slow-motion swell and whoosh, the curve's move and snap, the badge blip, the counter ticks, the hook words; checked on the render (item 13: SOUND GATE, SOUND DETAIL)
9. Payoff: PASS: rule 14, where the eye is at each beat: hook top → the button (the finger, the bubble right above it) → "Nothing moves" = the outline round the button and "0 px" pulsing → "The fix" = the code card unfolding at the top while the button splits under it → "ninety six percent" = the PRESSED button sinks + the scale line swept → "drop the shadow" = it sinks again → "slowed down" = the glide back to full width, the badge → "sinks" / "shadow" / "springs" = the slow press, the glow, the release → "every tap" = the rhythm. One focus at a time, the eye stays in the middle band; the last frame is the button
10. Facts: PASS: MDN :active (matches while the element is being activated) and BCD css.selectors.active (all browsers; safari_ios note: needs a touchstart listener on the element or <body>, in the caption and the tip); BCD css.properties.scale (Chrome 104, Firefox 72, Safari 14.1); box-shadow and filter: brightness() are baseline everywhere; `transition: .12s` = all properties, 120 ms, ease (the curve on screen is CSS ease, cubic-bezier(.25,.1,.25,1))
11. Post data: PASS: captions.json entry (channel web, postOn 2026-11-12, postAt 13:00, concept and about updated, caption synced with the config); 6 keywords, 5 hashtags; tip code and the /tips/ demo updated to the same CSS (npm run check: tips page up to date)
12. Review file: PASS: this file, items 1-11, 14-18
13. After the render: PENDING
14. Cuts: PASS: FLOW: cuts 0 (declared: sharedElement (the split into DEAD | PRESSED), sharedElement (the merge back to full width))
15. Dead runs: PASS: FLOW: dead runs none (no holds declared)
16. Continuity: PASS: FLOW: continuity 91% (median step 1.5, 2 declared transitions)
17. Strobes: PASS: FLOW: strobes 0
18. Element sound (web): PASS: ELEMENT SOUND: 63 of 64 animated elements have a cue (98%): ok (the badge's dot rides the badge's blip)

Owner-feedback lines, read one by one against the stills (the render is checked again at item 13): tech terms said right (PRONUNCIATION clean; listen at 13); something changes every 1.5-2 s (taps, counter, outline, split, presses, glide, slow press, rhythm); a non-developer feels it in 1 s (a dead Pay button); no text over text (OVERLAP none), nothing under the right-side buttons (SAFE ZONE ok); no jumps or dead stretches (FLOW); not too packed (8 short sentences, 2.2 words/s, each motion has its own beat); a sound for every element that moves, the details leading (listen at 13); clear sentences at a natural pace (speed 0.9).

Would this make me stop scrolling and watch it twice? YES. Stop: frame 0 is a giant button being jabbed and not moving, with "tap??!" floating up; everyone has done that. Watch: "TAPS 7 / BUTTON MOVED 0 px" is a joke you get without sound, then the dead and the pressed side by side, silence vs a thock, is the whole lesson in one second. Twice: the 0.25x replay and the rhythm of presses are the satisfying part, and the reel ends mid-rhythm and loops straight back to the dead button, so the contrast plays again. The first cut failed this question (a 4% change on a static card); this one answers it.

References used (design/references.md): none new; the kit's sharedElement, timeScale, curveGraph, slowmoBadge, specChip and element sound.
