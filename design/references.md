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

## Count
5 references, 28 techniques: 21 covered, 7 MISSING (6 pieces: a pivot-word beat, a travelling object as the transition (R2 and R3), an organic
wipe, icons inside sentences, letters snapping into a word, a hand-drawn ring around a number); 3 more not taken by rule.
