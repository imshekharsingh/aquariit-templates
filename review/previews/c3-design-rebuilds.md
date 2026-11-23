# Preview review: Turns Out design rebuilds (CV = c3-resume2, grey menu = c3-greytext2)

Independent critic, 24 Nov 2026 03:10 IST. The owner's complaint these answer (23 Nov night): "audio doesn't feel natural and effectively aligned. Before and after has before like no one starts in that manner."

What I judged, and what I could not:
- A (CV): the real MP4 `study/showreel-pv-c3-resume2-preview.mp4` (20.4 s, 16.8 MB) against the posted `showreel-c3-resume` (16.0 s). Frames at 390 px: fps 4 for the whole reel, fps 10 for 0-3 s, 30 fps frame differences around every fix and the proof.
- B (grey menu): the preview MP4 answered 404 twice (before and after A), so it is NOT rendered. B is judged from its scene stills (stills.mjs, 12 + 4 frames at 270 px, simulated voice) and its code, against the real MP4 of the old `showreel-c3-grey-text`. Its motion, real timing and sound are NOT judged.
- The voice: nobody here can hear it. The transcription model download is blocked by the session's network rules (faster-whisper installs, its model host answers 403). Instead: for A-new the render's own word times (`study/...-preview-words.json`, the times the scene is anchored to), checked against the voice-band level (250-3400 Hz, 0.1 s steps) of the final MP4; for the old reels only the voice-band level. So pauses are good to about 0.1 s, the old reels have no word times, and tone, stress, clipped word ends and how the sound effects sit under the voice are NOT judged for any version.

## A. CV (c3-resume2)

CRITIC: NOT READY: the voice and the "before" are clearly better, but in the first 3 seconds the "NO ORDER" label prints over the "NAME = TEXT" label (1.1-3.5 s), the details turn lighter a second before the word "lighter", and the reel sits still for the last 4 seconds.

Detail:
- D1 voice, measured. New: 45 words, speech 0.0-14.8 s = 3.0 words/s while speaking, 2.2 over the reel. Per sentence 3.0-3.8 words/s (all under 4.5). Audible pause after each sentence (voice band drops to the music level): 0.55, 0.45, 0.6, 0.6, 0.5, 0.6 s (the word file says 0.19-0.36 s because the model counts each word's fading tail). No sentence starts within 0.15 s of the last. Old: 36 words in about 13.7 s = 2.6 words/s; pauses about 0.4, 0.3, 0.6, 0.8, 0.4, 0.5 s, plus a 0.1 s catch after "Fix one:". So the old reel was NOT without pauses; the new ones are a little longer and more even. The real change is the wording.
- D1 voice, read as speech. Old: "Fix one: the name, biggest. Fix two: headings, one size down. Fix three: details plain." = three labels, no verbs. New: "First, make the name the biggest. Next, give the headings a colour, one size down. Then let the details go lighter." = sentences a person would say. Still stiff in three places: (a) "one size down" hangs on the end of sentence 5 as a leftover label; (b) "your eyes need an order" is not how people talk ("your eyes need somewhere to start"); (c) all seven sentences are 4-9 words and four in a row open "First, / Next, / Then / Now", so the rhythm is still a list. Passes V1-V3 as written.
- D2 sync, word time against the first frame that moves (30 fps differences):
  - Fix 1: "name" 6.68 s, "biggest" 6.94 s. Selection box 6.33 s, the name starts growing 6.57 s, full size 7.05 s. On the word (0.11 s early).
  - Fix 2: "headings" 8.54 s, "colour" 8.89 s. First heading starts to flip 8.70 s, all three done 9.05 s. On the word. But "one size down" (9.41-10.6 s) changes nothing on the page: only the chip arrives at 9.75 s, and the headings are in fact drawn 1 px larger than before (18 to 19 px). A line with no picture.
  - Fix 3: "Then" 10.81 s, "details" 11.29 s, "lighter" 11.99 s. The scan line and the first lighter line start at 10.97 s and all five are done by 11.5 s. That is 0.32 s before "details" and 1.0 s before "lighter", the word that names the change. NOT on the word (rule V3: never earlier).
  - 12.30-12.75 s: the lines regroup (spacing opens). The voice never names it.
  - Payoff: "top" 13.69 s, "bottom" 14.14 s; badges 1-2-3 at 13.2-13.8 s, the green line 13.75-14.5 s. On the word.
  - Old reel: no word times; from the captions it was anchored the same way (name about 6.5 s, headings about 8.7 s, details about 11.0 s). Sync was not the old reel's main fault and is not much changed.
- D3 before (frames 0.5-2 s, old against new). Old: every line in a medium-bold weight under "Everything on this CV is bold." = a claim few people would see in their own CV. New: every line 18 px regular, only the headings bold capitals, evenly spaced = a CV typed into a blank document. One mistake (no size order), named by the source (NN/g visual hierarchy). A stranger would say "mine looks like that". PASS. Small notes: the hook says "Every line looks the same" while the headings are already bold capitals; three chips name the one mistake three ways.
- D4 last frame. BEFORE flashes 14.80-15.30 s, shrinks to the tilted thumbnail by 15.8 s, AFTER tag and CLEAR stamp by 16.2 s; then nothing moves from 16.3 to 20.4 s (4.1 s). Both tags are inside the safe zone and the thumbnail covers no line. AFTER is readable at phone size. BEFORE is about 110 px wide at phone size with letters 2-3 px tall: you can see even grey lines with no order, not words. Shows both: yes. Both readable: only partly.
- P2 close-ups: the camera goes to 1.07-1.10. At phone size the page grows from about 297 to 327 px wide. It does not read as "seen close"; the detail text stays about 13 px.
- Every channel. Q0 pass (invented person and firms, source cited). Q1: frame 0 is a plain white page with a headline, the same first 3 seconds as the posted reel that lost 71% of viewers in 3 s; the rebuild did not touch the hook. Q2: NO, "NO ORDER" covers the end of "NAME = TEXT" ("NAME = TEX") from 1.1 to 3.5 s; the posted reel has the same fault. Q3: see "one size down". Q4: one focus at a time, yes. Q5: every line shown as a caption and finished. Q6: -13.9 LUFS, LRA 1.5; whether each effect is audible is not judged. Q7: the payoff frame with both states is worth sending; the 4.1 s still hold after it is filler.

PREMIUM (old): animation 6.5/10 (t 6.5 name, 8.7 headings, 11.0 scan are fine; nothing after the stamp at 15.0), cleanliness 6.5/10 (t 1.4-3.5 chip over chip; no before on the last frame), premium 6/10 (t 0-3 a plain page; the end shows only the fixed page); voice 4.5/10 (labels; pauses were there); before 4/10 (all bold); weakest: the script and the before.
PREMIUM (new): animation 7/10 (t 6.33-7.05 select and grow, 8.70-9.05 letter flip, 14.80-15.8 flash and shrink are good; t 10.97 runs ahead of the voice; t 16.3-20.4 dead), cleanliness 6.5/10 (t 1.1-3.5 "NO ORDER" over "NAME = TEXT"; t 16.3 on, the before thumbnail is not readable; top to bottom use is fine), premium 7/10 (t 16.3 the two-state last frame; t 0-3 unchanged from the posted reel); voice 7/10 (measured and read, not heard); before 7.5/10; weakest: t 1.1-3.5, a label printed over a label in the hook, on a first 3 seconds that already lost 71%.

P0: t=1.1-3.5 · chips under the page · "NO ORDER" over "NAME = TEXT" → move it to x BX+262 or drop one of the three chips (they say one thing) · ring timing stays.
P1: t=10.97 · fix 3 · starts 1.0 s before "lighter" → start the scan on "details" (11.3 s) so the last line turns on "lighter"; or say "Then make the details lighter" and anchor on "details".
P1: t=9.4-10.6 · "one size down" has no picture → either the headings visibly step down from the name's size as it is said, or cut the phrase ("Next, give the headings a colour.").
P1: t=16.3-20.4 · 4.1 s with nothing moving → end at about 18 s (hold 1.5 s), or let the read-order dots replay once.
P1: t=16.3 on · before thumbnail letters 2-3 px → scale .38 to about .55, to the right of the pen; keep it clear of the last line.
P2: t=6.3-12.5 · close-ups 1.07-1.10 barely seen → 1.2 or more, on the line being fixed.

ENHANCE: put the proof first: open on the fixed CV for 0.4 s, flip it to the plain one under the hook, so a stranger sees in the first second what they will get.

## B. Grey menu (c3-greytext2)

CRITIC: NOT READY: the preview video does not exist yet (the file answered "not found" twice), so only its stills were judged; in them the red rings cross out "FROM THE KITCHEN" and "Carrot cake" from 0.4 to 3.5 s (cover included), and the "4.5 : 1" the voice says is too small to read.

Detail:
- Not judged: motion, the real voice timing, pauses, sync and sound of the new version. The stills print ELEMENT SOUND 6 of 80 (8%) FAIL for this scene; check that line on the render.
- D1 voice, script only. Old: "Grey on beige. Nobody can read it. ... Fix one: darken the words. Fix two: a lighter board. Fix three: check the ratio. Four and a half to one." = labels, a number alone as a sentence, and a verdict ("Nobody can read it"). Old measured: 34 words in about 13.2 s = 2.6 words/s; pauses about 0.2, 0.2, 0.7, 0.6, 0.4, 0.4, 0.2, 0.6 s (two of 0.2 s near the start). New: "This menu is hard to read. The soft grey looked nice, but it's too light. Turns out, text needs contrast. First, darken the words. Next, lighten the board a touch. Then check the ratio, and aim for four and a half to one. Same menu, now easy to read." = 49 words, sentence lengths 6, 9, 5, 4, 6, 13, 6, one contraction, "a touch": it reads more like a person than the CV script does. The same "First, / Next, / Then" run.
- D2 sync: from the code only: the words darken from "darken", the board from 0.1 s before "lighten", the checker from "ratio", PASS by "four". Not measured.
- D3 before (stills 0.6-2.9 s against the old MP4 at 0-3 s). Old: tan text on beige, under "Nobody can read it." New: grey (158,152,142) on cream (238,231,216) = 2.3 to 1 by my sum, the "soft grey looks elegant" choice people do make; the title and dish names can be read, the small lines only just. One mistake, named by the source (WCAG 1.4.3). Believable: PASS. At phone size it looks close to the old before (a little lighter board, greyer text); the bigger change is the claim, from "nobody can read it" to "hard to read ... looked nice, but it's too light", which no longer blames the maker.
- D4 last frame (still 20.9 s): BEFORE thumbnail lower left on the counter, AFTER tag lower right, "CONTRAST · PASS" on top, green frame, ticks. The thumbnail covers no line. AFTER readable; BEFORE is faint small text made smaller, so it reads as a pale card, not as a menu. Hold: ticks and frame land at about 18.2 and 19.1 s in the stills, then about 2 s still; to confirm on the render.
- Q2: NO. Ring 1's lower edge runs through "FROM THE KITCHEN" and ring 2's through "Carrot cake" (stills cover 0.6, 0.9, 1.5, 2.9 s); the old MP4 has the same fault at 0-1.6 s. The white cup behind the board reads as a grey blob beside the chips at 0.6-3 s, and the AFTER tag sits on it at the end.
- Q3 / question 34: the voice says "four and a half to one"; the screen shows "MIN 4.5 : 1" at 13 px in the scene = about 9 px type at phone size, on a card that overlaps the board corner (12.9-14.9 s). The number the reel teaches is the smallest thing on screen.
- Fixed from the old one, confirmed: the old MP4 shows "FAIL" on the checker from 9.6 s to 13 s, after the fix; the stills show PASS at 12.9 s.
- Q0 pass (invented café menu, source cited). Q1: "Hard to read." over a pale board is a fair stop, better than the CV's.

PREMIUM (old): animation 6.5/10 (t 4.8 words darken with a sweep, 6.4 board), cleanliness 6/10 (t 0-1.6 rings through text; t 9.6-13 checker says FAIL on the fixed menu), premium 6/10 (the end is the fixed board alone); voice 4/10 (labels, "Four and a half to one." alone, two 0.2 s pauses); before 4.5/10 (the claim "nobody can read it"); weakest: the wrong FAIL at 9.6-13 s.
PREMIUM (new): animation 6.5/10 (provisional: stills and code only, same kit moves as the CV; t 6.9-12.9 look right), cleanliness 6.5/10 (t 0.4-3.5 rings through two lines, cover included; t 12.9-14.9 ratio text about 9 px), premium 7/10 (t 20.9 two-state frame with the PASS chip; not seen moving); voice 7.5/10 (script only, not measured, not heard); before 7/10; weakest: t 0.4-3.5, both rings strike through the text they point at, on the cover frame.

P0: render it (Showreel "seconds"), then a critic pass on the real MP4: sync, pauses, sound.
P0: t=0.4-3.5 · rings · lower edges through "FROM THE KITCHEN" and "Carrot cake" → ring 1 height 70 to about 84, ring 2 height 230 to about 250 (or end it above "Carrot cake" with the item inside) · chips stay.
P1: t=12.9-14.9 · checker · "MIN 4.5 : 1" 13 px → show "4.5 : 1" at 26 px or more as the card's main line, the card in clear space on the counter, not on the board corner or the cup.
P1: t=18-21 · thumbnail · a faint menu shrunk to a pale card → larger (about .55) so its grey words still show next to the dark ones.

ENHANCE: split the first frame down the middle of the menu: left half as the pale before, right half dark, with "Hard to read." on top, so the cover itself is the before/after.

### B, render 2 (second look, 24 Nov 2026 03:50 IST; real MP4, 21.2 s, rendered from main 8808421)

CRITIC (render 2): READY

Detail (render 2): judged on the real MP4 at 390 px (fps 5 for 0-3 s, fps 2 for the rest, 30 fps frame differences around each fix), the render's word times and the voice-band level. Not heard: tone, stress, clipped word ends, how the effects sit under the voice. The CV was not re-scored (no new file).
- First-look faults: rings now sit clear of every line (0.4-4.3 s, cover 0.6 s included): fixed. "MIN 4.5 : 1" is about 14 px at phone size, the second line of the card: fixed. Checker ends on PASS: fixed. Tail: last change 18.6 s, then a slow push to 21.2 s (2.6 s): fine.
- D1 voice, measured: 49 words, speech 0.0-16.1 s = 3.05 words/s while speaking, 2.3 over the reel; each sentence 2.4-3.6 words/s. Audible pauses after the sentences: 0.5, 0.5, 0.7, 0.5, 0.6, 0.6 s, plus a breath at each comma; no sentence starts within 0.15 s of the last. -14.0 LUFS, LRA 1.7.
- D2 sync (word against the first frame that moves): "darken" 7.46 s, words start to darken 7.40-7.47 s. "lighten" 9.17 s, board selected 9.0 s, lightens 9.1-9.4 s. "ratio" 11.18 s, checker card lands 10.97-11.1 s. "four" 12.57 s, "MIN 4.5 : 1" appears 12.47 s. "read" 15.49 s, chip 15.4 s; BEFORE flash 16.2 s, thumbnail 16.8-17.1 s, ticks 17.5-18.0 s, frame and "CONTRAST · PASS" 18.5 s. All on the word.
- D3 before: pale grey on cream, title and dish names readable, small lines only just; a real "soft and elegant" choice. PASS.
- D4: both shown, tagged, inside the safe zone, held 2.6 s; the thumbnail covers no line. The before thumbnail is a pale card whose title can just be made out; for this topic that is the point.
- Q2 small notes, not blocking: the checker card's corner touches the last letter of "brewed slow with fresh ginger" (11.0-15.6 s); the two hook chips touch edge to edge (0.9-4.3 s); the AFTER tag sits on the white cup.
- Q3 small note: the card shows FAIL at 11.0-11.4 s on a menu that is already dark on light, then PASS. Fix 2 ("lighten the board a touch") is honest but hard to see at phone size; the selection handles and chip carry it.

PREMIUM (render 2): animation 7.5/10 (t 7.40 sweep and darken, 9.0 selection, 16.2-17.1 flash and shrink; t 9.1-9.4 the lighter board is faint), cleanliness 7.5/10 (t 0.4-4.3 rings clear; t 11.0-15.6 card corner on one letter), premium 7.5/10 (t 18.6-21.2 the two-state frame with ticks and PASS); voice 7.5/10 (measured and read, not heard); before 7/10; weakest: t 9.1-9.4, fix 2 is nearly invisible. Fix for the next one: let the board lighten a little more (or sweep a light band across it as it changes), move the checker card 14 px right and down, and show the card's reading as "..." until the dropper has sampled.

## For both
- The owner's two points: the before is answered in both (CV 4 to 7.5, menu 4.5 to 7). The voice wording is answered on paper (4.5 to 7, 4 to 7.5); whether it now SOUNDS natural is not something any session here can confirm. The owner should listen to the CV preview once (Inbox, Previews) before the other five are rebuilt this way.
- "Aligned": the old reels were already anchored on words. The one real miss in the new CV is fix 3 (1.0 s ahead of "lighter").
- Kit notes for the next rebuilds: the hook rings and chips need a check that no ring edge crosses a text line and no chip covers a chip (preflight OVERLAP printed "none" for the menu and did not see either); the proof thumbnail is too small at .38; the close-up at 1.07-1.10 is too gentle; a 20-21 s reel should not hold still for more than about 2 s.
