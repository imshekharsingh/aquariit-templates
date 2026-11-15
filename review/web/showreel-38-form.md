# Review: showreel-38-form (web, postOn 2026-11-16 postAt 13:00 IST)

The Mandatory Gate, design/mandatory.md. E20 try 2 (caption question + comment ask) on E23 try 4 (dynamic fix: broken and fixed in sync) and the
dark look (E18 KEPT 15 Nov, rules-web.md rule 12). Built 15 Nov (evening before, owner-approved in the owner chat: Mon 16 and Tue 17 built
together) on the fontswap reel's whole-frame structure, with the owner's 15 Nov feedback applied from the first cut (owner-feedback.md 15 Nov,
critic.md, Output QA SPLIT / DEMO).
Topic swap: design/topics.md had "Why does your counter jump instead of counting up?" (@property). Swapped: its fixed version (a number that
counts) moves MORE than the broken one (a number that snaps), the opposite of the owner's 15 Nov rule (BEFORE visibly breaks, AFTER holds) and
of Output QA SPLIT. The form jump is a layout shift every phone user has hit, and its fix is one line.
- frame 0: ONE checkout form, frame-wide (430 px, 290-780): EMAIL field, the message slot, a yellow "Pay ₹1,499" button with its state chip,
  the receipt line and three order rows; the hook "Why does your form jump?" is already on screen; at 0.1 s the first key pops "Enter a valid
  email" and the button drops one line (32 px, measured from the real reflow) with a spring past it, a shake, a trail, a warm flash and a
  red dashed ghost where it was, just as the touch ring presses: the tap lands on the message, "missed!";
- every typing round (1.35 s) the message comes (drop) and goes (jump back up): two jolts per round; counters JUMPS and BUTTON MOVED 32 px;
- "The fix": the code card types `.error {` / `min-height: 1lh;` (lit) / `}` / `/* one line of room, always */` while the form splits into
  BEFORE (coral) over AFTER (teal); both type the same email in sync: BEFORE jolts twice a round, AFTER's message appears in its reserved line
  and the button holds; lock guides draw round AFTER's reserved line and button; chips "BEFORE / 32 PX SHIFT" (cross) and "AFTER / 0 PX SHIFT" (check);
- "Look closer": AFTER returns to full size, the dashed guides hold the empty line and the button while the message comes and goes inside
  them; the panel reads BEFORE 32 px · AFTER 0 px;
- payoff: the fix on two lines above, the form typed in a rhythm, every tap lands; the reel ends on the form.
The layout is real CSS: the message is a real element whose text comes and goes (empty = 0 px tall in BEFORE; `min-height: 1lh` in AFTER) and
the browser reflows; nothing is a faked position.
Local Output QA estimates on frames at 135x240, 10 fps (the render's numbers replace them at item 13): SPLIT BEFORE 31.6% vs AFTER 13.3% of
its pane in 0.2 s = 2.38x (needs 1.8x; fontswap's first cut 1.31x); saturated fill at most 9% (COLOUR needs under 25%); DEMO saturation 0.55,
colourfulness 53, contrast 137 (needs 0.35 / 32 / 64); VIBRANCY median 29%.
AUTO lines from preflight.mjs and stills.mjs, 15 Nov (simulated voice; the real voice re-anchors every beat).

1. Topic: PASS: anyone who has filled a form on a phone has had the button move as an error popped in; felt in 1 s (the message pops, the button drops, the tap misses). Not done before (captions.json: no form or validation reel; Nº 14 "page jump on a link" was a scroll anchor, Nº 37 a font swap on load, this is a jump while typing). Rulebook: rule 1 pass (a form jumping under the thumb, as a user), rule 2 pass (the first jump at 0.1 s with the hook already on it), rule 3 pass (the fix typed from ~6.8 s, the fixed form beside the broken one), rule 4 pass (new reveal at 4 s: counters; 8 s: the code and BEFORE over AFTER; 12 s: the guides holding the empty line), rule 5 pass (a button that moves, visible), rule 6 pass ("Why does your form jump?", 5 words), rule 7 pass (13:00), rule 8 pass (`min-height: 1lh` on screen 3 s+ in the code and the payoff line; MDN + BCD), rule 9 pass (no unchecked words; "min height" said as words), rule 10 pass (FLOW 93%, cuts 0), rule 11 pass (opens on the jolting form, a satisfying lock at the end), rule 12 pass (dark), rule 13 n/a (single fix), rule 14 pass (item 9), rule 15 pass (BEFORE jolts twice a round, AFTER still: SPLIT est. 2.38x), rule 16 pass (form fills 290-780, two full-width cards in the split)
2. Frame 0: PASS: SUBJECT FILL: 57% at frame 0; HOOK: clear of the subject; the whole form under the hook, the first key typed, the message popping and the button falling at 0.1 s
3. Safe zone: PASS: SAFE ZONE: ok (the card's shake is halved to the right, so the CHECKOUT label stays inside x 480 at the 1.07 push-in)
4. No overlap: PASS: OVERLAP: none; BAND: clear (the message fades in only once the button has left its line, 0.05-0.14 s after the jump; the card clears the band before the subtitles fade in)
5. Motion: PASS: STATIC STRETCH: none (least change 1.0 at 14 s, median 8.2); EMPTY FRAMES: none (scanned 40 moments, least detail 27.7 at 7 s); TEXT FIT: all text inside its box
6. Subtitles: PASS: SUBTITLES: at least 52 px, at most 6 words a line; the hook on screen from frame 0, then all 7 sentences in the band, key words in mint after the fix (min, height, line, space, stays, still)
7. Voice: PASS: HOOK PACE: the first sentence has 5 words: ok (6 or fewer); PREFLIGHT voice: 195 letters, 8 sentences, about 17.3 s at speed 1 with 3.85 s of breaths (reel 20 s, voice must end by 19.4 s): fits; PRONUNCIATION: 0 overrides used; no unchecked words; 50 words in ~17.3 s = 2.9 words/s at speed 1.0, no sentence over 9 words (the fontswap re-cut failed PACE on a dense one); CONTRAST: 5.2:1 (dark), worst "JUMPS" at 3.5 s over 272 text readings
8. Sound: PASS (by design; measured on the render at item 13): three soft key ticks a round; BEFORE's jumps hard dry snaps (lower as it drops, higher as it jumps back) and the missed tap a low blip; AFTER's message a soft high tick and the landed tap a pop; typing ticks for the code; the guides' pop; the hook words; the whoosh at 0; recorded CC0 samples (Output QA SOUND prints SOUND SOURCE)
9. Payoff: PASS: rule 14, where the eye is at each beat: hook top → the form right under it (the ring on Pay, the message popping, the button dropping, "missed!" where the ring is) → "an error pops in" = the red message under the field → "everything under it moves" = BUTTON MOVED 32 px above, the ghost under the ring → "The fix" = the code card unfolding above while the form splits under it → "min height" = the lit line sweeping → "Look closer" = the camera in on AFTER, the guides drawing round the empty line → "the button stays" = the message coming and going inside still guides → the payoff line over the form, every tap landing; last frame: the fixed form with the fix above
10. Facts: PASS: MDN <length> lh (the computed line-height of the element it is used on); BCD 8.1.9 (npm, read 15 Nov): css.types.length.lh Chrome 109, Firefox 120, Safari 16.4, Safari iOS 16.4, Chrome Android 109; MDN min-height; 32 px measured in Chromium (the message's line-height); Sora and DM Mono are open-licensed Google Fonts; npm run check passes
11. Post data: PASS: captions.json entry (channel web, postOn 2026-11-16, postAt 13:00, concept, about, palette dark, experiment web-comment-ask); keywords form layout shift fix, error message layout shift, min-height 1lh, CSS lh unit, form validation UX, Cumulative Layout Shift CLS, frontend tips; hashtags (niche, most specific first) #formvalidation #webforms #layoutshift #csstips #frontendtips; caption line 1 "Has a form ever moved the button right as you tapped it? yes or never 👇", the last line names who to send it to and asks for the word; tip block with its live demo (scripts/tips/demos.mjs "form")
12. Review file: PASS: this file, items 1-11, 14-18
13. After the render: PENDING
14. Cuts: PASS: FLOW: cuts 0 (declared: sharedElement (the split into BEFORE over AFTER), sharedElement (the merge back to full size))
15. Dead runs: PASS: FLOW: dead runs none (no holds declared)
16. Continuity: PASS: FLOW: continuity 93% (median step 2.6, 2 declared transitions)
17. Strobes: PASS: FLOW: strobes 0
18. Element sound (web): PASS: ELEMENT SOUND: 101 of 101 animated elements have a cue (100%): ok

Owner-feedback lines, read one by one against the stills (the render is checked again at item 13): tech terms said right ("min height" as plain words, "error"); something changes every 1.5-2 s (a jump every ~0.6 s, counters, split, typing, guides); a non-developer feels it in 1 s (a button that moves as you tap); no text over text (OVERLAP none; the ring sits on the button, the bubble and chips in the row); motion never jumps except the jump itself, which is the bug; not rushed (2.9 words/s, breaths 0.45-0.6 s); colour: BEFORE warm coral with a yellow button, AFTER fresh teal with the mint one, no grey or flat navy (15 Nov); before/after unmistakable on mute (15 Nov: the broken pane jolts with a fall, spring, shake, trail, flash and ghost; the fixed pane holds under lock guides and "0 PX SHIFT"); keywords and 5 niche hashtags chosen for search (15 Nov); no big white finger (the slim ring); voice speed 1.0 for every sentence.

Would this make me stop scrolling and watch it twice? YES. Stop: frame 0 is a form whose Pay button falls away from the thumb as an error pops, with "missed!". Watch: BEFORE and AFTER typed at the same instant, one jumping twice a round and one still. Twice: the empty dashed line holding its room while the message comes and goes.

Today's improvement (design/improvements.md, web): the caption names who to send it to ("Send this to whoever builds your sign-up form") (sends per reach is one of Instagram's named ranking signals; Sprout Social). The top item (swipe-reveal divider) was skipped again: BEFORE's two states do not share a layout (the button moves), so a divider through it shows half a button.

References used (design/references.md): none new; the kit's sharedElement, KM.touch, KM.type, KM.sweep, element sound and the whole-frame zones.
