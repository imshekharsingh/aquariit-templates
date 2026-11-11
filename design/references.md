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

## R-trend: first weekly research pass, all three channels (11 Nov 2026, web search)
Evidence is thin for our exact niches (no study of CSS or phone-tip reels exists in the results; most pages are tool vendors). Kept only what
has numbers, comes from Instagram itself, or repeats across several sources. Each line: the finding, its source, the technique, the kit piece.
- R-trend 11 Nov: **A caption that asks for comments gets ~3x the comments; a question in it +37%; asking for likes -5%** (Metricool study,
  24.4M posts, 375k accounts, Jan-Feb 2025 vs 2026, via NetInfluencer). Same study: Reels views +27% year on year, average watch per Reel 8.5 s.
  Comments are not one of Instagram's top three signals, but they are the cheapest action we are not asking for on web and tech.
  - [ ] Line 1 of the caption is a question the viewer can answer in one word; the last line asks for that word in the comments (never likes).
  - Kit: the caption is plain text in the config; newweb.mjs and techreel starters do not write a question line: MISSING (todo).
  Queued: E20 (web). Turns Out already does it (E19).
- R-trend 11 Nov: **Speech in the first 3 s beats music-only openings: 3 s retention +11.7%, 10 s +24.7%** (Emplifi, 10,000+ Facebook Reels,
  Mar 2026, via Social Media Today; Facebook, not Instagram). On speech reels, heavy text overlays went with slightly LOWER retention (-6% at 10 s).
  - [x] Voice from frame 0 on all three channels (hook voice in every starter; Mandatory Gate).
  - [ ] Text on screen supports the voice, never competes with it: one line at a time, key words big. Covered by the subtitle band (data-subs)
    and the owner's rule that every spoken line is shown, so no cut to fewer words; watch it in the stills review. Kept as is.
- R-trend 11 Nov: **Series: Meta is testing a native "Series" hub that groups Reels into episodes** (MediaPost, June 2026, via Lindsey Gamble
  and Social Media Today); guides agree (Later via SocialPilot, CreatorFlow) that a named, numbered series gives viewers a reason to follow, each
  part must work alone, and "Part 1" is the best entry point. No independent number isolates the effect, so it is a test, not a rule.
  - [ ] A fixed series name + number on the cover and in frame 0 (small, above the hook), the same name opening the caption.
  - [x] Web already numbers its reels (Nº 09 ...).
  - Kit: Turns Out has no series tag in kit25d.js: MISSING (todo). Queued: E22 (Turns Out), on the topic type that already won 6 of 6.
- R-trend 11 Nov: **Tech tips that get saved: settings and "most people don't know" angles, and things that make the sender look informed**
  (fluxnote "40 viral tech ideas 2026", wreltik "why some reels get saved and shared"; vendors, two sources agree). Settings lists are E17.
  - [ ] Hook names a setting most phones ship with the wrong way ("Your phone ships with this ON"), the curiosity of a default, not a count.
  - Kit: techreel `header` + `hook_toggles` cover it (the switch shown in its factory state at frame 0). Queued: E21 (tech).
- R-trend 11 Nov: **Instagram rewards originality and demotes aggregators** (creators.instagram.com, "Rewarding original creators", extended
  to photos and carousels 2026): reposts with only a watermark, subtitles or credit added lose recommendations. Covered: every scene is our own code.
- R-trend 11 Nov: **Trial Reels** (Instagram feature): a reel is shown to non-followers first, off the grid, with its numbers in ~24 h; Meta
  said 80% of the creators who posted more after trying it grew non-follower reach (secondhand summaries of Meta's 2024 note; eligibility now
  reported as 1,000+ followers by one 2026 blog, unverified). Fits our one-change tests (two hooks of the same reel). Needs the owner (posting): todo.
- R-trend 11 Nov: **Keywords in the caption feed Instagram search, and public posts show in Google and Bing since July 2025** (Metricool;
  several SEO guides agree, Instagram names usernames, bios, captions, hashtags and places as the fields search reads). Covered: the post text
  carries 6 keywords, most specific first.
- Not kept: "hashtags no longer matter" (no primary source found), "TikTok watermark suppression" (not in Instagram's own text), vendor
  hook-rate benchmarks that define the metric differently (NestScale 25-30% vs Blitzcut 60%+), and every "3-5x saves" claim without a method.

## Count
5 references, 28 techniques: 21 covered, 7 MISSING (6 pieces: a pivot-word beat, a travelling object as the transition (R2 and R3), an organic
wipe, icons inside sentences, letters snapping into a word, a hand-drawn ring around a number); 3 more not taken by rule.
Research passes (R-trend): 11 trends kept on 11 Nov 2026 (4 Turns Out, 7 all channels); 2 MISSING pieces (a caption question line in the web and
tech starters, a series tag in kit25d.js) and 1 owner item (Trial Reels), all in design/todo.md. Next pass: the spare-usage night, Tue 17 Nov.
