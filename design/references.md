# References the owner shared: techniques and the kit piece that covers each (11 Nov 2026)

Owner, 11 Nov 2026: "Do it now, I can't keep going back to something that needs improvement." Every reel the owner shares as a reference gets
an entry here the same day (design/runbook-daily.md, "Daily improvement loop"): what it showed, its techniques as a short checklist, and for each the kit piece
that covers it, or MISSING. A MISSING technique becomes a kit piece or a dated line in design/todo.md. A reel's review file names the reference
techniques it uses. Patterns are welcome, tweaked for our use (owner, 23 Nov 2026): layout, motion, pacing, type, transitions; never the reference's
footage, copy, art, characters or a near-identical look of that one piece (design/safety.md rule 1). From 23 Nov a reference reel is studied
with the reverse-any-video skill (.claude/skills/) into a pattern card (its format is in that skill).
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

- R-sound 12 Nov: **Recorded effects instead of synthesized ones** (owner, 12 Nov 2026: "sound elements feel cheap, as if from kids' toys").
  Source: Kenney's audio packs, https://kenney.nl/assets/interface-sounds, https://kenney.nl/assets/impact-sounds,
  https://kenney.nl/assets/rpg-audio, https://kenney.nl/assets/ui-audio. Licence: CC0 1.0 (public domain, https://creativecommons.org/publicdomain/zero/1.0/):
  no attribution, commercial use allowed. scripts/sound/fetch-samples.sh keeps a pack only if its own License.txt says CC0 and copies that file next to
  the sounds; the Showreel and Tech reel workflows cache them (actions/cache, key cc0-sounds-kenney-v1). Techniques: 2-4 real samples per cue kind
  (paper: book flips; small: wooden/plastic ticks and clicks; snaps: real switches; large: soft impacts; camera air: a cloth swish), a seeded pick,
  +-1 semitone and +-1.5 dB per hit so repeats differ, the synthesized sound's level, pan and timing kept (scripts/showreel/samples.py). Kit piece:
  samples.py (sound.py and techreel/audio/synth.py). The run prints "SOUND SOURCE: recorded CC0 samples ..." or "synthesized (fallback ...)".
  12 Nov, first render: kenney.nl answers HTTP 403 to GitHub runners, so the second source is the Sonic Pi sample set (CC0 Freesound
  recordings), https://raw.githubusercontent.com/sonic-pi-net/sonic-pi/v4.5.1/etc/samples/ ; its README.md: "All other samples in this
  directory are from http://freesound.org and have also been placed in the public domain via the Creative Commons 0 License"
  (http://creativecommons.org/publicdomain/zero/1.0/); the script checks that line before using them and keeps the README next to the
  sounds. Only recorded foley and percussion: perc_snap, perc_snap2 (finger snaps: ticks, clicks, snaps), drum_cymbal_pedal (a closed
  hat chick: taps, touches), drum_tom_hi/mid/lo_soft and drum_bass_soft (soft toms: blips, pops, thuds, hits), perc_swoosh and perc_swash
  (camera air, paper), perc_bell; never the elec_ synth sounds.

## R-trend: tech walkthrough look (12 Nov 2026, web search, standard; owner: "Tech reel doesn't feel like a change at all ... how do we expect to get audiences?")
- R-trend 12 Nov: **Settings tips that travel are a phone screen walked tap by tap.** Press coverage of viral settings videos: a screen recording of
  the settings page walking the viewer through turning a feature off, 820,000+ views (Daily Dot, https://dailydot.com/creepy-iphone-setting);
  "3 settings to turn off" from a faceless tips account, ~2 million views (Daily Dot, https://dailydot.com/news/disable-three-ios-18-settings/);
  numbered steps "open Settings, tap App Store, toggle off" in a 6 million view video (Dexerto,
  https://dexerto.com/tiktok/tiktok-could-be-removed-from-your-iphone-unless-you-disable-this-setting-3059565). Faceless tech guides agree the
  viewer trusts what they can see being tapped (FluxNote, https://fluxnote.io/guides/faceless-instagram-reels-tech-niche; vendor). Techniques:
  ONE phone filling the frame; a touch indicator on each tap with a ripple; the voice names the row as it is tapped; a number in the hook and a
  1/3 counter. Kit piece: techreel/scenes/phonecam.py (topic "look": "phone"); no real platform UI: our own generic drawing, platform names as text only.
- R-trend 12 Nov: **Word-by-word captions, current word highlighted, beat plain subtitles** (vendor data only, no published method: ~34% more watch
  time in one vendor's 80-video test, ~50% vs ~40% completion; Opus, https://www.opus.pro/blog/best-caption-presets-styles-boost-retention;
  ClipSpeed, https://www.clipspeed.ai/blog/11-caption-styles-ranked-viral-performance-2026.html). Direction repeated across sources, size unproven.
  Technique: 2-4 words at a time, heavy face, black outline, the spoken word yellow and lifted. Kit piece: phonecam.captions.
- R-trend 12 Nov: **Text and motion in the first 1-2 s, speech from frame 0** (Emplifi via Pulse, speech in 3 s +~25% 10 s retention; vendor claims
  of up to +50% 3 s hold for a text overlay plus motion vs a static open; https://www.pulse.bot/digital-marketing/news/human-speech-and-presence-help-drive-reels-engagement-26291baf-0b96-441f-aefa-8af987fa02e8).
  Technique: the hook title in a heavy face with the result already flipping on the phone (red → green) by 1.1 s. Kit piece: topic "hook_page".
- Not kept: "zoom on every tap" has no measured source (taken as craft, the screen-recording look, not as evidence); vendor 3 s benchmarks.

## R-trend: weekly research pass, 24 Nov 2026 (spare night, web search, standard)
- Ranking signals: no change since Mosseri's Jan 2025 list. Watch time, likes per reach and sends per reach lead; he said sends count slightly more for people who do not follow you, likes slightly more for followers; no exact weights (Buffer, Oct 2026; SocialPilot, Sep 2026; Social Media Today). Comments are not on his list.
- Hook: every source says show the payoff or the problem in the first 3 s and make a clear promise by 3-5 s. The numbers are creator anecdotes (one 120-video sample, r 0.84 between 3 s retention and total performance), so treated as direction, not proof. Sound-off viewing is large (one unnamed study: 54% of Reels views start muted): every spoken line stays shown.
- Kept: no new technique; confirms rules already in place (frame-0 hook, send line at the end, every line shown). Nothing needs a kit piece or a new experiment. Worth testing next: a closing line written to be sent to one person ("send this to whoever ...") on all three channels, read against sends per reach in the audit.
- Dropped: "real person in the first 3 s" (no data, and our copyright rules).

## Count
5 references, 28 techniques: 21 covered, 7 MISSING (6 pieces: a pivot-word beat, a travelling object as the transition (R2 and R3), an organic
wipe, icons inside sentences, letters snapping into a word, a hand-drawn ring around a number); 3 more not taken by rule.
Research passes (R-trend): 11 trends kept on 11 Nov 2026 (4 Turns Out, 7 all channels); 2 MISSING pieces (a caption question line in the web and
tech starters, a series tag in kit25d.js) and 1 owner item (Trial Reels), all in design/todo.md. Next pass: the spare-usage night, Tue 17 Nov.

## R-puzzle · visual "find the odd one" puzzle reel (owner reference, 13 Nov 2026; future channel idea)
- What it showed: a dark full-frame grid of ~150 small circles, each with a dot orbiting it; one circle spins the other way. On-screen text:
  "Only the 1% with perfect vision can find the single circle that spins in reverse." No voice needed, about 12 s, built to loop.
  Reached small numbers on a small account (about 107 likes, 18 comments, 39 saves), but saves and comments are high for its size.
- Techniques (take the mechanic, never the piece): (1) one-line challenge hook that flatters the viewer ("only X% can..."); (2) a dense
  procedural field with ONE odd element (direction, speed, colour shade, shape, phase); (3) no answer shown, or a reveal after a pause, so
  people rewatch, comment their answer and send it to friends; (4) loops seamlessly so watch time stacks; (5) calm dark palette, subtle motion.
- Kit piece: MISSING (a seeded "odd one out" field generator: grid of N items, one rule-breaker, difficulty knobs, optional delayed reveal).
- Fit: perfect for code-only, faceless, cheap renders (no voice, seconds of render time); could be its own channel. Owner: "We should be
  able to create a channel with such puzzles; we don't copy but take reference. Mark it to pick up in the future."

## R-ref 21 Nov 2026 · owner upload (app References 1 and 2): a Hinglish "AI video editing pipeline" tutorial reel (screen recordings)
- Seen: 47.1K likes, 49.4K comments, 65K shares, 115K saves (the on-screen counts, 17 Nov). Faceless motion graphics on dark UI cards, one accent
  colour; a top progress bar with named steps (SETUP · TOOLS · STYLE · EDIT) and "STEP 02 · ..." headers; big word-by-word captions mid-frame
  with one accent word; hook "But nobody shows the EXACT PROCESS" over a blurred, padlocked timeline, then the payoff promise "$0"; Hinglish voice.
- Why it worked (our read, not measured): saves come from a promised, step-by-step useful outcome; comments almost match likes, which points to a
  comment-to-get-it ask (caption cut off: not verified); the step bar tells the viewer how much is left, so they stay to the end.
- Techniques for us: (1) a labelled step bar at the top (Turns Out: MYTH · PROOF · ORIGIN · TRUTH); (2) captions as big mid-frame words, one accent
  word, instead of a small bottom band; (3) a locked-reveal hook (the answer blurred under a padlock until its word); (4) "the exact ..." framing
  that promises the full story; (5) a voice in the audience's own language (a test only: @itturns.out has 9 followers, no country data yet).
- Not for Turns Out: the topic (AI tools) belongs to @webin20sec / @techin20sec; a comment-to-DM ask needs a DM automation on the owner's account.
- Used: Turns Out E31 (design/c3-plan.md). Refs 1-2 marked studied.


## R-ref 23 Nov 2026 · owner upload in chat: a "60-30-10 colour rule" brand reel (13 s, 3 examples, labelled "AI content")
Showed: top half a glossy liquid/silk background in the active colour with stacking swatch cards (name, %, CMYK/RGB/HEX); bottom half a
realistic website that recolours live as each colour is added (accent lands on buttons, the glasses turn yellow, headphones go violet);
word-by-word captions with the colour word in its colour; three brands in 13 s; CTA "Comment COLOR and I'll DM you the 3 ...".
- [ ] Split screen: the rule on top, its application below, both moving at once. MISSING (web/Turns Out kit).
- [ ] Live transformation of ONE object as each element is added (the payoff happens while you watch). Partly: KM.wipe / theme tokens.
- [ ] Collectible data cards (exact values) that stack: save-worthy. MISSING.
- [ ] A rich, sensory background in the active colour (liquid/silk 3D), changing with each step. MISSING (three.js now used in tech).
- [ ] A new state every ~1 s; 3 examples in 13 s; no setup. Pace rule for web/Turns Out.
- [ ] Comment-keyword CTA ("Comment X and I'll DM you ..."): needs a DM auto-reply on the owner's side. Owner decision.
- [ ] Realistic photo-grade product imagery: the reference uses AI-generated images; our rule is code-drawn only. Owner decision.
Fits: Turns Out design series (design fixes) and web first; tech can borrow split screen + live transformation (spec card on top, the
gadget changing below).


## R-ref 25 Nov 2026 · owner reference: explainer "Why do we need MCP if we already have APIs" (5 clips, app References ids 4-8; studied by the owner chat)
Showed: one continuous 3D world (glossy product block, chips, server racks, glowing cables with real materials, soft depth of field, rim light) the camera travels through; dark ground with colourful objects (purple, warm amber cables, neon green, app tiles); real artifacts (readable code cards, JSON request / response, a login dialog, a dated announcement page, real app logos); "3 x 8 = 24 integrations" as a cable tangle between 3 clients and 8 tiles; an API as layers on a block; the spoken line shown word by word near the top at about 54-64 px, grey spoken words, white current word, key word in a thin blue selection box with square handles. Narrated by an avatar presenter.
- WE TAKE (patterns): one world with recurring objects; colour on the objects against a dark ground; glowing cables as the story carrier; real artifact cards; ideas as pictures; word-by-word captions near the top with a selection-box key word; roughly one new state a second.
- WE DO NOT TAKE: their avatar or any presenter (owner: no mascot), their footage, their exact look, layout or object arrangement, their script or words, their music. A stranger must not take our frame for theirs (safety.md item 1 check).
- Used: rules-tech.md section L; test scene techkit/scenes/sample-colour-world.html and review/tech/study-25nov/ (side-by-side of our frames).


## R-ref 26 Nov 2026 · owner uploads, app References ids 9-14 (5 reels; 13 is a duplicate of 12), studied whole clip, 1 frame a second
(The first look on 25-26 Nov saw only each clip's first 8 seconds: the preview tool sampled only the start. Fixed in scripts/asks.mjs; `refs` with {"full":[ids]} prints the whole clip.)
- 9 "AI posts reels" (68 s, white + green, flips to dark green at each section): a product world (robot arm, cards, a crowd of avatar coins); a big number counting up (3,200,000 → 3,300,000; 100 → 10x); a new picture every second.
- 10 "27 security checks" (62 s, owner: "Everything, I loved this one"): a 27-item LIST reel, one item every ~2 s, a "01/27 SECURITY PASS" pill counting the whole way; soft blue-pink gradient, frosted white cards with a blue accent;
  each item is a mini story on a recreated real UI (login form, code card, env file, CORS, cookie, dependency tree): the problem shows (red "exposed", "Rejected", "EXPIRED"), then the fix lands (green check, "Accepted");
  one recurring "Your server" card. Ends: the report card, then a typed comment box CTA.
- 11 "100 trial reels" (44 s, cream → dark amber): a 3D wall of cards behind one hero logo; giant counting numbers (30x, 3,100,000, 14K, 1,341); a gauge needle drops; dashboards rebuilt as clean cards.
- 12 "What GitHub actually is" (56 s, black + lime glow, one colour the whole reel): ONE timeline line that grows through the reel (commits as glowing nodes, then a branch, a merge, a tag), a 3D-tilted real repo page, a fork counter, avatar bubbles pouring in,
  a real terminal error then `git reset` and the app works again; a stat card (95.99% of developers).
- 14 "A skill that makes reels" (37 s, cream + terracotta): big serif headline with italic accent words; small check chips pop in; a word-by-word caption pill at the bottom;
  "you might be thinking: the reels must suck" → struck through → "not at all." reversal; a stats card counting up; typed comment box CTA.
SHARED GRAMMAR (all five): 1-3 words appear per beat and build the sentence on screen, the newest word carries the accent (colour, underline or italic), older words go grey;
the picture changes every ~1 s, never a still shot over 2 s; one persistent object that evolves through the reel (the line, the server card, the hero card); numbers count, never sit;
problem shown breaking first, then fixed in the same frame; a real interface rebuilt cleanly as the set (not an icon beside text); one colour world per reel, flipping light/dark only at a section change.
WHICH CHANNEL (studio decision, 26 Nov; the owner left the routing to us):
- Web: 10 (list format with a counting pill, frosted pastel cards, problem → fix micro-beats on recreated UI) and 12 (one growing diagram line as the spine).
- Tech: 9 and 11 (the product is the hero, giant counting numbers, light/dark flip at the section change) and 12 (dark + one neon line, a 3D-tilted real screen).
- Turns Out: 14 (serif headline with italic accent words, check chips, word-by-word caption pill, "you might be thinking" → struck → reversal) and 10's before → after micro-beat.
- All three: the word-build headline, a change every ~1 s, counting numbers, one persistent evolving object.
- WE DO NOT TAKE: any mascot (owner: none), their product names, logos, screens or palettes as they are, their scripts, their 37-68 s length (we keep ours), the comment-for-DM ask (no DM automation on our side).
- Used: 26 Nov web (:has), tech (SmartTag3 channel sounding), Turns Out (fix this invite) builds, before their render.
- Closed 26 Nov (owner: the studio decides what to keep; references are reported as "what we took" and closed, no Keep/Skip list).

## R-ref 27 Nov 2026 · owner upload in chat: a 34 s "system map" explainer (owner: "amazingly designed ... where I want to get our reels to"; reference for tech, web and Turns Out)
Studied from two screen recordings (0-12 s and 12-21 s of the reel, 4 fps measurements, the reel's caption band excluded). The videos stay in the owner chat; nothing of them is in this repo.
- FORMAT: a 2.5D motion-graphics MAP (flat vector shapes, glow, depth by blur and dimming), not 3D. One hub in the centre, 6 numbered nodes around it, lines between them.
- CAMERA: one continuous camera over one big canvas, no hard cuts (scene-cut detector found none); it flies hub -> node 1 -> node 2 ... -> pulls back to the whole map at the end. Every move has a reason: it goes to the next step of the story.
- COLOUR WORLDS: each node owns a colour and a spotlight cone (measured hue per 0.5 s: warm hub, then blue ~214 for 6 s, amber ~35 for 4 s, violet ~252, magenta ~327, teal ~162, crimson ~344); everything not in focus dims to ~20 % but stays visible as context.
- PERSISTENT FRAME: a fixed two-line title at the top for the whole reel; a section pill under it ("03 / 06 · VIDEO GENERATOR") that changes per node; word-by-word captions at the bottom with the key word in the accent colour.
- MINI INTERFACES at each node: a "viral topics" card with a number, a line chart drawing itself, an edit timeline, an approval card with buttons, platform icons fanning out with check badges. Each node shows something WORKING, not an icon alone.
- LIFE: light pulses travel along the lines; numbered badges; neighbours dim but keep their position; the final pull-back reveals the whole system (the payoff).
- MEASURED vs our 3D v7 render 2: motion per frame (mean abs diff) reference 10.8-12.9, v7 21.1; still frames reference 8-13 %, v7 1 %. The reference moves LESS than v7 but reads as far more designed: the quality comes from focus (one subject lit, the rest dimmed), structure (fixed title, section pill, numbered steps) and a reason for every move, not from more motion.
WHICH CHANNEL (studio decision; owner: test on tech first):
- Tech: "how a system works" topics as a node map (e.g. what happens after you tap to pay). Test scene first (owner chat, 27 Nov).
- Web: "how the browser does X" topics as a node map; single-fix topics take only the grammar (colour world per step, spotlight focus, persistent title + section pill, mini UI).
- Turns Out: the grammar only (spotlight focus, colour world per step, section pill, mini UI cards), never the map format; before -> after stays the spine.
- WE DO NOT TAKE: their hub disc look, any brand name or logo, their exact neon palette, their Hinglish captions (we stay in English), their 34 s length as a rule.


### R-ref 27 Nov 2026: rules for the first real 2.5D tech reel (from the tap-to-pay test, critic of render 2, NOT READY, PREMIUM 7.5 / 7.0 / 7.0)
Closer to the reference than the 3D v7 and the better format for "how a system works" topics; the 3D v7 still wins on big, tactile objects. Three faults to design out before the build:
- OPEN ON THE WHOLE MAP, never an empty glow: frame 0 shows the whole small map (all nodes, the lines, a packet already running), then the camera pushes into the hub. No title-only frame, and the first step lands by about 2.8 s.
- NO EMPTY CAPTION BOX: hide the caption pill until its first word. Put a pause mark after every step number in the spoken text and the captions ("One: your phone sends...", "Three: the shop's bank, the acquirer").
- NO SMALL PANEL TEXT: every panel, card and sub-line is at least 24 px at 1080, or it is dropped; panel text is 1-3 words. Node labels in the final pull-back too (scale the final map about 1.25x so its labels read). Use the band under the caption for content only if it clears the Instagram overlay.
- Waive near-grey cross-fades in the qa block (colour waiver with the reason): hue swings on near-grey colours are not cuts.

## R-ref 28 Nov 2026 · action count: owner uploads 15-19 (26 Nov, never studied before) against 3D kit v7 and the 2.5D tech gold
Measured on GitHub with scripts/qa/action-count.py (asks.yml refs-study, run 28 Nov; method in .claude/skills/reverse-any-video "Action count").
References 9-14 could not be counted: their videos were deleted when they were closed (26 Nov). 16 and 17 are the same clip.
- 15 "100 reels to a million views" (26 s, white then dark): a 3D wall of reel cards filling and flipping colour, counters 0 -> 100 -> 1,000,000, a phone card stamped NOT NEEDED, a 100x calendar grid filling, a bar chart growing.
- 16 "an app nobody knows exists" (72 s, white / purple, flips dark per section): a hub icon with cards fanning out, a terminal typing, a SHIPPED stamp, a Live chip, a node network spreading, a ring of tools around a hub, bars rising.
- 18 "fastest growing repos" (52 s, white + green, one continuous take, no cuts): a ranked card per item with a +49.3K counter and a sparkline, icons connecting to a hub by drawn lines, a terminal with checks ticking green, a blur hand-off between items.
- 19 "vibe coders making money" (35 s, white / pink, flips dark at the big number): a map filling with pins, an app-tracker card counting 194,485 -> 430,000, an invoice building line by line, an 81 % ring filling, chips (business / person / company) landing on cards.

| | actions a second (picture) | moving at once | longest still gaps | cuts a minute |
|---|---|---|---|---|
| References 15, 16, 18, 19 | 2.4 - 3.4 | 1.5 - 2.5 | 6-7 gaps over 1 s in 35-72 s (each about 1.1-2 s) | 0 - 23 |
| 3D kit v7 render 4 | 1.8 | 1.3 | 5 gaps in 23 s, 9.7 s in all (42 % of the reel), the longest 3.3 s (11.6-14.9 s) | 0 (23 % camera moves) |
| 2.5D tech gold (ai-words) | 2.3 | 1.35 | 8 gaps in 30 s, the longest 2.6 s at the end | 0 (31 % still) |
ACTION LIST (what the references do that v7 does not, per 10 s of reference):
1. Numbers that keep counting (3-5 per 10 s): every card carries a live number (+45.1K -> +49.3K, 0 -> 100, 81 % ring) that ticks while the voice talks. v7 counts 3 times in 23 s.
2. Small UI that works (3-4): a checklist ticks, a terminal types, an invoice adds lines, a toggle flips, a sparkline draws. v7's apps are icon tiles with dead screens.
3. Stamps and chips landing on objects (1-2): NOT NEEDED, SHIPPED, Live, Free, company. v7 has the big headline words only.
4. Fill-ups of many small things (1): a wall of cards, a map of pins, a grid of days, a dot sphere, bars. v7's cable cascade is its one fill.
5. Selection marks (1): a box or ring snaps round the number being said. v7: none.
6. Lines drawing between icons (1-2), and a blur hand-off to the next card instead of a camera move.
Not taken: their brands, logos, screens, palettes, faces and scripts; their 35-72 s lengths.
FOR V7 (owner yes 28 Nov, part b): build items 1-3 and 5 INSIDE objects already on screen (app screens alive, a connection-log card ticking each
plug, stamps TANGLED / 24 CABLES / 11 on the objects, a selection box on each number), so v7 reaches 2.5+ actions a second, 2+ moving at once
and no gap over 1.2 s, without more camera moves (fast 3D moves strobe: renders 2-4). The 2.5D builders take the same list.
