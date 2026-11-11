# References the owner shared: techniques and the kit piece that covers each (11 Nov 2026)

Owner, 11 Nov 2026: "Do it now, I can't keep going back to something that needs improvement." Every reel the owner shares as a reference gets
an entry here the same day (CLAUDE.md, "Daily improvement loop"): what it showed, its techniques as a short checklist, and for each the kit piece
that covers it, or MISSING. A MISSING technique becomes a kit piece or a dated line in design/todo.md. A reel's review file names the reference
techniques it uses. Techniques only, never a piece: no lines, sequence, signature image, look or character of the reference (copyright rule).
Kits: kitmotion.js (KM, web), kitsfx.js (web element sound and entrances), kit25d.js (Kt, Turns Out), techreel/ (make.py, scenes/).
Older study notes stay in attic/design/film-playbook.md ("Reference study 2" and "3") and design/webin20sec.md ("Density").

## R1. A numbered "20 graphic design styles" list (13 Oct 2026; design/experiments.md E7: 470K saves, 171K shares)
Showed: one subject in many styles, a numbered list building on screen; built to be saved as a reference.
- [x] A numbered list that builds while the picture changes: KM.partProgress (numbered part bar) + the details recap grid (newweb.mjs --details).
- [x] One subject restyled on the beat (theme tokens swap, not a new page): KM.wipe (wipeRestyle) + KM.theme tokens.
- [x] A saveable last frame (all items together): the details recap grid (rules-web.md rule 13).

## R2. A "POV: you edited the whole night" brand film on a monitor (13 Oct 2026; attic/design/film-playbook.md, Reference study 2)
Showed: a sentence that builds word by word, pivot words with their own world, a recurring shape that becomes the wipe, a world change late.
- [x] A sentence that builds word by word, accent words coloured: KM.rise (blur to sharp, word by word), hook .acc spans.
- [ ] Pivot words alone, each with its own world response (a burst for "everywhere", emptiness for "nowhere"): MISSING.
- [ ] One recurring shape that travels through the reel and becomes the transition: MISSING (an object-led wipe).
- [ ] An organic wipe (a liquid wave from the bottom, a brush-smear reveal): MISSING (KM.wipe is a straight top-down wipe).
- [x] A highlighter swipe behind the accent words: KM.sweep.
- [x] A change of world at about three quarters: KM.rig.pushThrough / KM.pushThrough (web), Kt.through and Kt.match (Turns Out).
- [x] The ending opens out (the last frame the widest): KM.rig.pushIn to a lower z (a pull-back), Kt.track.
- [x] Motion from frame 0 (its rack focus): KM.rise on the hook word; a full-frame live blur is not allowed (rules-web.md rule 12).
- Not taken: the POV-on-a-monitor wrapper (a film format, retired with the films).

## R3. Four reels from the owner (14 Oct 2026; attic/design/film-playbook.md, Reference study 3)
Showed: a hub-and-spokes framework tour, a word-per-beat reel, an object-as-transition ad, a product film with icon sentences and snapping letters.
- [x] A framework toured spoke by spoke, labels typing, ending on the whole diagram: techreel hub scenes (rings, pulses along links); KM.type for labels.
- [ ] One object whose own motion is the transition (its swinging tag): MISSING (same piece as R2's travelling shape).
- [ ] Icons inside sentences (a small drawn icon in the line of type): MISSING.
- [ ] Letters spread on guide lines, then snapping into a word: MISSING.
- [x] A mark growing from a dot: KM.morph (a box morphs between shapes and colours).
- Not taken: one huge word per beat with the ground flipping colour every beat (fails FLOW strobes, design/mandatory.md item 17).

## R4. An AI-animated "system" reel (25 Oct 2026; design/webin20sec.md, "Density")
Showed: wall-to-wall voice, a visual event on every stressed word, live readouts, numbers as proof.
- [x] The caption word and its visual land ~0.15 s before the word is spoken: KM.voice (lead .15) + KM.subs.
- [x] A visual event every 0.5-1.3 s, nothing still over 1.2 s: KM.voice cues + the FLOW "dead runs" check (scripts/showreel/flow.mjs).
- [x] A live readout in a corner that changes every beat: KM.specChip (numbers roll), techreel badges (rolling numbers).
- [x] Counters that run up: KM.specChip, Kt.roll (Turns Out), techreel rolling numbers.
- [ ] A hand-drawn ring circling the final figure: MISSING in the web kit.
- [x] Stamps that slam in with a hit: Kt.stamp (Turns Out), techreel verdict stamp.
- [x] Fixed zones (caption block, picture, nothing over the bottom UI): scripts/showreel/layout.mjs (SAFE ZONE, BAND, HOOK).
- Not taken: the cartoon host, its look, income and follower claims, "comment X" giveaways.

## R5. Small UI motions in slow motion (8 Nov 2026; design/playbook.md, details format)
Showed: a compilation of small, satisfying UI motions, each at real speed, then slowed with its curve.
- [x] Slow motion with the camera on reel time: KM.timeScale.
- [x] A live easing curve with a riding dot and an "ms" counter: KM.curveGraph.
- [x] A spec chip whose numbers roll in: KM.specChip; a slow-mo badge: KM.slowmoBadge.
- [x] A numbered part bar: KM.partProgress.
- [x] A recap grid of all the motions at full speed: newweb.mjs --details (scripts/explainer/newdetails.mjs).

## R-trend: research pass for Turns Out (11 Nov 2026, web search; secondary sources unless named)
- R-trend 11 Nov: **Sends per reach is the reach lever for non-followers.** Instagram's head (Mosseri, Jan 2025 video, repeated in 2026 guides:
  Buffer, Sprout Social, SocialPilot) names watch time, likes per reach and sends per reach as the top signals, sends weighing most for people who
  don't follow you. Technique: give the viewer a reason to send (a guess a friend would get wrong). Kit: Kt.choices + the caption's send line. Taken (E19).
- R-trend 11 Nov: **Completion falls with length.** Vendor benchmarks (ttcalculator, Kapwing 2026 stats) agree that shorter clips finish far more
  often (no platform data); our own: watch 12-19 s on 31-35 s reels. Technique: end near the average watch and loop to frame 0. Kit: the guess
  starter ends on the frame-0 view. Taken (rules-c3.md rule 3).
- R-trend 11 Nov: **Quiz / guess-before-reveal reels draw comments and replays** (marketing blogs, mostly a quiz-tool vendor, Typito; Instagram
  also added a native quiz option to Reels). Technique: options on screen, a pause or countdown before the reveal, under 30 s. Kit: Kt.choices,
  Kt.countdown. Taken (E19); weak evidence, so it is a test, not a rule.
- R-trend 11 Nov: **History shorts: a specific date, number or name in the hook; one image every 3-5 s; sepia for the past, full colour for now**
  (FlowShorts, fluxnote guides). Covered: years in the voice and kinetic type, a world change every 3-5 s; the sepia/colour switch is Kt.print. Kept as is.
- Not taken: AI-generated photo-real images and voice-over channels as a format (copyright rules: images are code only).

## Count
5 references, 28 techniques: 21 covered, 7 MISSING (6 pieces: a pivot-word beat, a travelling object as the transition (R2 and R3), an organic
wipe, icons inside sentences, letters snapping into a word, a hand-drawn ring around a number); 3 more not taken by rule.
