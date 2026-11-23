# Review: showreel-45-homebar (web, postOn 2026-11-23 postAt 13:00 IST)

Rulebook (rules-web.md): 1 pass (every phone owner has hit a button under the home bar), 2 pass (the list scrolls and the pill glows red from frame 0), 3 pass (code card at the fix sentence), 5 pass (visible at a glance: the screen sags on every tap, the button rises clear), 6 pass (hook "Why does your button hide?", 5 words), 8 pass (one copyable line, caption invites a save and a send), 9 pass, 10 pass (FLOW below), 12 pass (black look, rule 19), 14 pass (eye: hook top, phone, tap, code card, phone again), 15 pass (BEFORE sags on each tap, AFTER stays put and lifts), 16 pass (SPREAD 0% empty), 17 pass (CALM 3.0%).

1. Topic: PASS: a fixed bottom button under the phone's home bar (MDN env() / viewport-fit=cover, read 23 Nov 2026); not done before (21-dvh was the browser bar, 28-thumb tap size); rule score above
2. Frame 0: PASS: SUBJECT FILL: 46% at frame 0; HOOK: clear of the subject; the list scrolls under the bar and the white swipe line glows red over the button label
3. Safe zone: PASS: SAFE ZONE: ok (every caption and bold word every 0.5 s; hook, code card, phone and subtitles all inside the zone on the 12-frame sheet)
4. No overlap: PASS: OVERLAP: none; BAND: clear (the first run found "Lunch with Ana" x the result label at 12.0 s; the label was shortened to ONE LINE and moved right, the rerun reads none)
5. Motion: PASS: STATIC STRETCH: none (least change 2.9 at 4.5 s, median 4.2)
6. Subtitles: PASS: SUBTITLES: at least 52 px, at most 6 words a line; every spoken word shown (stills sheet)
7. Voice: PASS: PREFLIGHT voice: 168 letters, 5 sentences, about 13.1 s at speed 1 (reel 15.4 s): fits; PRONUNCIATION: 0 overrides, no unchecked words; HOOK PACE 5 words ok; CONTRAST 5.4:1 (saffron)
8. Sound: PASS (by design; measured on the render at item 13): tap cues on every tap, tick typing, pop, land on each row, resolve chime
9. Payoff: PASS: the fixed bar with the button lifted clear of the swipe line, label ONE LINE, held to the last frame
10. Facts: PASS: MDN env() (zero where nothing covers the viewport, grows otherwise; viewport-fit=cover; sticky footer example with env(safe-area-inset-bottom)); caniuse / BCD: Chrome 69, Firefox 65, Safari 11 (read 23 Nov 2026); npm run check passes
11. Post data: PASS: captions.json entry (web, postOn 2026-11-23, postAt 13:00, concept, experiment web-phone-edge); 7 keywords, 5 hashtags; tip demo homebar
12. Review file: PASS: this file
13. After the render: PASS: render 2 (run 45098664045, the last allowed; render 1 run 45095467616 failed DEMO only, fixed): OUTPUT QA: PASS. PACE 3.24 words/s; STRAY none; LOUD -14.0 LUFS, -2.8 dBTP; SOUND recorded CC0 samples (sonic-pi), 34 of 34 element cues audible; COLOUR ok; EDGES ok; BULK 0; VIBRANCY 19.8%; SPREAD 0% empty; DEMO saturation 0.74, colourfulness 55, contrast 124 (was 61); HUE 25 deg; FOCUS pass (colourfulness 154 vs 73); DEAD none; CALM 3.0% / 3.9%; MUTE fix 4.6%, before 3.2%. Voice check passed in the run; Showreel job success; MP4 in R2. Critic (item 20) still to write.
14. Cuts: PASS: FLOW: cuts 0 (3 declared transitions: morph, glide, wipe)
15. Dead runs: PASS: FLOW: dead runs none
16. Continuity: PASS: FLOW: continuity 100%
17. Strobes: PASS: FLOW: strobes 0
18. Element sound (web): PASS: ELEMENT SOUND: 46 of 46 animated elements have a cue (100%): ok

Local look: OQA HUE pass (25 deg vs 315 / 225 / 65), CALM 3.0% median / 3.9% mean, SPREAD 0% empty, FOCUS warn only (no coloured-demo sample in the declared window).
Researched improvement (design/improvements.md): a phone-edge topic with the screen reacting to each tap (the home swipe) so the bug is felt, not told.
Craft improvement (design/craft-log.md): the starter's phone cut to its bottom half and moved into the 392-780 hero zone, so the fixed bar is the biggest thing on screen (SPREAD 0% empty vs 50% on the starter layout).
References used: none.

Render 3 (owner-approved, 23 Nov 2026 chat: "Redo homebar in black today and run the critic right after"): the black look of the top three reels (numbers 165K, list 10K, popup 6.2K): near-black ink, no blooms, no coloured or glowing frame, neutral surfaces, one gold accent word in the hook ("button"); topic, voice, captions and safe zones unchanged. Local preflight after the change: CONTRAST 5.7:1, PREFLIGHT voice fits, EMPTY none, STATIC none, SUBJECT FILL 41% at frame 0, SAFE ZONE ok, OVERLAP none, BAND clear, HOOK clear, TEXT FIT ok, FLOW cuts 0 / dead none / continuity 95% / strobes 0, ELEMENT SOUND 46 of 46. Item 13 must be re-written on render 3 (new check BLACKBG).
