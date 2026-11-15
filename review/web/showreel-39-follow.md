# Review: showreel-39-follow (web, postOn 2026-11-17 postAt 13:00 IST)

The Mandatory Gate, design/mandatory.md. E20 try 3 (caption question + comment ask) on the in-sync before/after (the E23 format, try 5) and
the dark look (E18 KEPT 15 Nov, rules-web.md rule 12). Built 15 Nov, owner-approved in the owner chat (Mon 16 and Tue 17 built together, an
exception to build-on-the-day), with the owner's 15 Nov feedback applied from the first cut (owner-feedback.md 15 Nov, critic.md, Output QA SPLIT / DEMO).
Topic: design/topics.md's Tue 17 row said SWAP (the hover topic repeats showreel-20-hover). New topic: the Follow button that grows into
"Following" and pushes Message along, a toggle every Instagram user taps; the fix is a grid stack (one cell, the hidden word keeps its width).
- frame 0: ONE profile page, frame-wide (430 px, 290-780): avatar, "Mira Sen", the follower count, the yellow Follow button (tapped just before frame 0, so it reads "Following") and
  "Message" beside it, the bio and a grid of six bright posts; the hook "Why does your button jump?" is already on screen; the first tap is just before
  frame 0, so the page is already shaking, and every ~1.1 s the tap flips Follow / Following: the button grows or shrinks and Message slides
  37 px (measured from the real reflow) with a spring past it, a shake of the page, a trail, a warm flash and a red dashed ghost where it was
  ("jump!", "huh?"); counters TAPS and MESSAGE MOVED 37 px; the follower count ticks 9,412 / 9,413;
- "The fix": the code card types `.follow { display: inline-grid; }` / `.follow span {` / `grid-area: 1 / 1;` (lit) / `}` /
  `.follow .off { visibility: hidden; }` while the page splits into BEFORE (coral) over AFTER (teal); both are tapped in sync (every 0.95 s):
  BEFORE jolts, AFTER's word changes inside a button that is always as wide as "Following"; lock guides draw round AFTER's two buttons;
  chips "BEFORE / 37 PX SHIFT" (cross) and "AFTER / 0 PX SHIFT" (check);
- "Look closer": AFTER returns to full size, the dashed guides hold both buttons while the word changes inside them; the panel reads
  BEFORE 37 px · AFTER 0 px;
- payoff: the fix on two lines above, the page tapped in a rhythm, nothing moves; the reel ends on the page.
The layout is real CSS: BEFORE's button holds only the word it shows in an inline-flex row; AFTER's holds both words in one grid cell
(`grid-area: 1 / 1`, the other `visibility: hidden`); the browser reflows; nothing is a faked position. The button keeps one fill in both
states (only the word changes), so "the word changes, the button stays" is literally what AFTER shows.
Local Output QA estimates on frames at 135x240, 10 fps (the render's numbers replace them at item 13): SPLIT BEFORE 19.7% vs AFTER 8.3% of
its pane in 0.2 s = 2.37x (needs 1.8x; the first draft read 1.57x and was reworked: taps in sync every 0.95 s, a stronger shake and bounce, one
button fill in both states, AFTER fading in as it pops); saturated fill at most 18% (COLOUR needs under 25%); DEMO saturation 0.55,
colourfulness 106, contrast 155 (needs 0.35 / 32 / 64); VIBRANCY median 31%.
AUTO lines from preflight.mjs and stills.mjs, 15 Nov (simulated voice; the real voice re-anchors every beat).

1. Topic: PASS: anyone who uses Instagram taps Follow and sees it become Following; a row that slides under the thumb is felt in 1 s. Not done before (captions.json: no toggle-width reel; Nº 36 tabs was an underline that jumps, Nº 34 press a button that does not react). Rulebook: rule 1 pass (a profile page, as a user), rule 2 pass (already shaking at frame 0, the next tap at 0.65 s, the hook on it), rule 3 pass (the fix typed from ~7 s, the fixed page beside the broken one), rule 4 pass (new reveal at 4 s: counters; 8 s: the code and BEFORE over AFTER; 12 s: the guides holding both buttons), rule 5 pass (a button that grows and pushes, visible), rule 6 pass ("Why does your button jump?", 5 words), rule 7 pass (13:00), rule 8 pass (`grid-area: 1 / 1;` on screen 3 s+ in the code and the payoff line; MDN + BCD), rule 9 pass (no unchecked words), rule 10 pass (FLOW 93%, cuts 0), rule 11 pass (opens on the jolting row, a satisfying lock at the end, bright posts), rule 12 pass (dark), rule 13 n/a (single fix), rule 14 pass (item 9), rule 15 pass (BEFORE jolts on every tap, AFTER still: SPLIT est. 2.37x), rule 16 pass (the page fills 290-780 with the post grid in the lower third, two full-width cards in the split)
2. Frame 0: PASS: SUBJECT FILL: 58% at frame 0; HOOK: clear of the subject; the whole page under the hook, the row still shaking from the tap before frame 0, the ring on Follow
3. Safe zone: PASS: SAFE ZONE: ok (the card's shake is halved to the right, as on the form reel)
4. No overlap: PASS: OVERLAP: none; BAND: clear (the follower line was shortened to "9,412 followers" so the BEFORE / AFTER chips and the bubble sit at the card's top right clear of it; the card clears the band before the subtitles fade in)
5. Motion: PASS: STATIC STRETCH: none (least change 1.4 at 14 s, median 6.4); EMPTY FRAMES: none (scanned 40 moments, least detail 33.8 at 12 s); TEXT FIT: all text inside its box
6. Subtitles: PASS: SUBTITLES: at least 52 px, at most 6 words a line; the hook on screen from frame 0, then all 7 sentences in the band, key words in mint after the fix (stack, both, grid, cell, longer, width, stays, still)
7. Voice: PASS: HOOK PACE: the first sentence has 5 words: ok (6 or fewer); PREFLIGHT voice: 212 letters, 8 sentences, about 18.5 s at speed 1 with 3.85 s of breaths (reel 20 s, voice must end by 19.4 s): fits; PRONUNCIATION: 0 overrides used; no unchecked words; 47 words in ~18.5 s = 2.5 words/s at speed 1.0, no sentence over 9 words; CONTRAST: 5.1:1 (dark), worst "TAPS" at 3.5 s over 274 text readings
8. Sound: PASS (by design; measured on the render at item 13): every tap a touch and blip; BEFORE's jumps hard dry snaps (lower as Message is pushed out, higher as it comes back); AFTER's word change a soft high tick and a pop; typing ticks for the code; the guides' pop; the hook words; the whoosh at 0; recorded CC0 samples (Output QA SOUND prints SOUND SOURCE)
9. Payoff: PASS: rule 14, where the eye is at each beat: hook top → the page right under it (the ring on Follow, the row shaking, Message sliding, "jump!") → "the button grows" = Follow becoming the wider Following under the ring → "everything next to it slides away" = Message sliding, the ghost where it was, MESSAGE MOVED 37 px above → "The fix" = the code card unfolding above while the page splits under it → "grid cell" = the lit line sweeping → "Look closer" = the camera in on AFTER, the guides drawing round both buttons → "the button stays" = the word changing inside still guides → the payoff line over the page; last frame: the fixed page with the fix above
10. Facts: PASS: MDN grid-area (grid-area: 1 / 1 puts every label in the first cell, so the cell is as wide as the widest); MDN visibility (hidden still takes its space in layout, unlike display: none); BCD 8.1.9 (npm, read 15 Nov): css.properties.grid-area Chrome 57, Firefox 52, Safari 10.1, Safari iOS 10.3; 37 px measured in Chromium (Message's offsetLeft with each word); Sora and DM Mono are open-licensed Google Fonts; the profile ("Mira Sen", @mira.bakes) is invented; npm run check passes
11. Post data: PASS: captions.json entry (channel web, postOn 2026-11-17, postAt 13:00, concept, about, palette dark, experiment web-comment-ask); keywords button width change fix, follow button layout shift, CSS grid stack labels, grid-area 1 / 1, visibility hidden keeps space, toggle button UI, frontend tips; hashtags (niche, most specific first) #microinteractions #uidetails #cssgrid #csstips #frontendtips; caption line 1 "Has a button ever slid away right as you tapped it? yes or never 👇", names Play / Pause, Save / Saved, Add / Added, who to send it to, and asks for the word; tip block with its live demo (scripts/tips/demos.mjs "follow")
12. Review file: PASS: this file, items 1-11, 14-18
13. After the render: PENDING
14. Cuts: PASS: FLOW: cuts 0 (declared: sharedElement (the split into BEFORE over AFTER), sharedElement (the merge back to full size))
15. Dead runs: PASS: FLOW: dead runs none (no holds declared)
16. Continuity: PASS: FLOW: continuity 93% (median step 2.8, 2 declared transitions)
17. Strobes: PASS: FLOW: strobes 0
18. Element sound (web): PASS: ELEMENT SOUND: 89 of 89 animated elements have a cue (100%): ok

Owner-feedback lines, read one by one against the stills (the render is checked again at item 13): tech terms said right ("grid cell", "Following"); something changes every 1.5-2 s (a tap every ~1 s, counters, split, typing, guides); a non-developer feels it in 1 s (a Follow button pushing Message away); no text over text (OVERLAP none); motion never jumps except the jump itself, which is the bug; not rushed (2.5 words/s); colour: BEFORE warm coral with a yellow button, AFTER fresh teal with the mint one, six bright posts, no grey or flat navy (14-15 Nov); before/after unmistakable on mute (15 Nov: the broken pane jolts with a slide, spring, shake, bounce, trail, flash and ghost; the fixed pane holds under lock guides and "0 PX SHIFT"); keywords and 5 niche hashtags chosen for search (15 Nov); the slim touch ring; voice speed 1.0 for every sentence.

Would this make me stop scrolling and watch it twice? YES. Stop: frame 0 is a profile row already shaking, Message sliding off under a Follow tap. Watch: BEFORE and AFTER tapped at the same instant, one row sliding and one still. Twice: the word changing inside a button that does not move.

Today's improvement (design/improvements.md, web): the caption names who to send it to and where else the trick works ("Send this to whoever builds your profile page"; Play / Pause, Save / Saved, Add / Added), second try of the send item. The swipe-reveal divider was skipped again (BEFORE's two states do not share a layout); the seamless loop stays open (a reel that ends on the fixed state cannot match its broken frame 0 without ending on the bug).

References used (design/references.md): none new; the kit's sharedElement, KM.touch, KM.type, KM.sweep, element sound and the whole-frame zones.
