# Review: showreel-42-snapback (web, postOn 2026-11-20 postAt 13:00 IST)

The Mandatory Gate, design/mandatory.md. Built 20 Nov by the daily run, the day it posts (learn-then-build). The 20 Nov audit still says web ALARM
(median reach 1,673 over the last 7 vs target 2,000; watch 9.9 s vs 12; saves 1.6% vs 3%; ESCALATE two days running). Both PROMOTEs (details-format,
dynamic-fix) and the DROP (web-comment-ask) are already in design/rules-web.md rules 13 and 15 and in playbook "What didn't" since 18 Nov; the ESCALATE is
answered by a NEW TOPIC TYPE: so far every single fix was a layout, tap, load or colour bug; today's is an animation that ends wrong (a menu that slides
in and then jumps back out), told as one bug story (design/improvements.md web item 7: it breaks, you feel it, one word fixes it, it behaves).
Dynamic before / after in sync (rule 15, E23): BEFORE over AFTER, the same keyframes, one word apart; BEFORE jolts (the snap, a ghost of where the drawer was,
a warm flash, the bubble "gone!"), AFTER lands and stays with a dashed lock round the open drawer. Dark look in a new colour world, cobalt (hue 225; the last three
web reels were 65, 155 and 325).
- frame 0: the hook "Why does your menu snap back?" over ONE frame-wide app screen (430 px, 290-780): the menu drawer is already sliding in and, 0.5 s later,
  jumps back out with a red flash and a ghost outline;
- "You tap, and it slides in. Then it jumps right back out.": the counters (TAPS, MENU OPEN FOR 0 s) in the top zone, a second tap lands the snap on "jumps";
- "The fix: add forwards to the animation": the code card types `.menu { animation: slide-in .5s forwards; }` with `forwards` lit; the screen splits into BEFORE
  over AFTER, tapped in sync: BEFORE keeps snapping back (the user keeps tapping), AFTER opens once, stays open, and closes on its own tap;
- "Look closer. Same tap, but this one stays open.": AFTER alone, full size, "SAME TAP · ONE SECOND LATER: closed | open", one tap, the drawer stays;
- payoff: the one line to copy over the screen (`animation: slide-in .5s forwards;`), the drawer closes and opens once more and stays open to the last frame.
Facts checked in a real browser today: Chrome 157 (headless) puts a translateX(-100%) element animated to 0 over .5 s at x -100 px after the animation with
`animation: slide-in .5s` and at 0 px with `... .5s forwards`; MDN animation-fill-mode (read 20 Nov 2026: forwards keeps the last keyframe's values, none is the
default); BCD 8.1.10 css.properties.animation-fill-mode: Chrome 43, Edge 12, Firefox 16, Safari 9 (read 20 Nov 2026).
Local Output QA on the scene's own frames (PW_FROM=$(npm root -g)/ node scripts/qa/frames.mjs + python3 scripts/qa/look.py, 10 fps): HUE 225 deg vs 41-gradient 65,
40-expensive 155, 39-follow 325 (needs 40); CALM median 2.8%, mean 4.8% (needs 3.5% / 5%: close, the render's motion blur reads lower); SPREAD 0%; SPLIT 2.32x
(BEFORE 16.7% vs AFTER 7.2%; needs 1.8x; the first cut read 0.75x because AFTER slid out and in as much as BEFORE: AFTER now opens once and stays, BEFORE keeps
snapping, and the slide is slower, 0.9 s, so the snap is what is measured).

1. Topic: PASS: anyone who has tapped a menu that opens and shuts itself has felt it, in 1 s; not done before (captions.json: no animation fill-mode reel; the nearest are showreel-35-list (a row collapsing) and showreel-31-menus (a gliding tab line: a different bug)). Rulebook (design/rules-web.md): rule 1 pass (a menu every app has, felt as a user), rule 2 pass (the drawer is sliding and snapping at frame 0, the hook on it), rule 3 pass (the code card types from "The fix", about 6 s on the simulated voice), rule 5 pass (a menu that vanishes, seen at a glance), rule 6 pass (hook "Why does your menu snap back?", 6 words), rule 8 pass (one line to copy on screen to the end, MDN + BCD), rule 9 pass (no unchecked words; "forwards" is read normally), rule 10 pass (FLOW below), rule 11 pass (a satisfying slide, then the snap), rule 12 pass (dark theme), rule 13 n/a (single fix), rule 14 pass (see below), rule 15 pass (mute test: BEFORE's drawer is gone while AFTER's stays, obvious at phone size), rule 16 pass (the screen fills 290-780, SPREAD 0%), rule 17 pass (camera and light hold still, one clean move per tap, own colour world; CALM and HUE above)
2. Frame 0: PASS: SUBJECT FILL: 63% at frame 0; HOOK: clear of the subject; the drawer sliding in (nearly shut at 0.0 s) and snapping out at 0.5 s with the flash, the hook already on screen
3. Safe zone: PASS: SAFE ZONE: ok (the hook went from 52 to 47 px after the first sheet: "back?" ran past x 960)
4. No overlap: PASS: OVERLAP: none; BAND: clear (the title and the loaf grid were rebuilt so no text sits under the drawer's text; the BEFORE / AFTER tags sit at the foot of each screen over plain tiles)
5. Motion: PASS: STATIC STRETCH: none (least change 0.2 at 2 s, median 7.1)
6. Subtitles: PASS: SUBTITLES: at least 52 px, at most 6 words a line; all eight sentences shown word by word and finished on the stills
7. Voice: PASS: PREFLIGHT voice: 175 letters, 8 sentences, about 13.6 s at speed 1 in one take (reel 17 s, voice must end by 16.4 s): fits; PRONUNCIATION: 0 overrides used; no unchecked words; natural speed 1.0
8. Sound: PASS (by design; measured on the render at item 13): a whoosh at frame 0, a hard dry snap as the drawer jumps out, a soft tick and pop as AFTER's drawer lands, taps on every touch, typing ticks, element cues on every moving element (ELEMENT SOUND 100%)
9. Payoff: PASS: the last 3 s: the line to copy over the screen, the drawer open and still, the dashed lock round it, the last frame a saveable fixed state
10. Facts: PASS: MDN animation-fill-mode, BCD (Chrome 43, Edge 12, Firefox 16, Safari 9, read 20 Nov 2026), a real-browser check in Chrome 157 (x -100 px vs 0 px after the animation); npm run check passes
11. Post data: PASS: captions.json entry (channel web, postOn 2026-11-20, postAt 13:00, concept, experiment web-story-bug); 6 keywords, 5 hashtags; caption names who to send it to and invites a save; tip block with its demo in scripts/tips/demos.mjs (/tips/ rebuilt)
12. Review file: PASS: this file, items 1-11 and 14-18 PASS
13. After the render: PENDING
14. Cuts: PASS: FLOW: cuts 0 (declared: the split and the merge, sharedElement; the snap is a 0.14 s move, not a cut)
15. Dead runs: PASS: FLOW: dead runs none (declared holds: the fixed drawer simply staying, and the last beat on the copyable line)
16. Continuity: PASS: FLOW: continuity 74% (median step 1.3, 2 declared transitions; web from 16 Nov 35%+)
17. Strobes: PASS: FLOW: strobes 0
18. Element sound (web): PASS: ELEMENT SOUND: 89 of 89 animated elements have a cue (100%): ok

Rule 14, where the eye is at each beat: hook (top) -> the screen under it, where the drawer slides and snaps -> the counters above it ("TAPS 1, MENU OPEN FOR 0 s") on "Then it jumps" -> the code card (top) on "The fix", `forwards` lit on the word -> BEFORE and AFTER together, the open drawer in the lower pane while the upper one snaps -> "Look closer": the panel (top) then the one fixed screen -> the line to copy (top) over the screen. Never jumps more than half the frame.

Owner-feedback lines, read against the stills: no wiggle (one clean move per tap, camera still, one slow push for "Look closer"); a colour world per reel, not the last three; whole frame used; nothing cut at the edges; every spoken line shown and finished; no brand card or call to action in the video; no saturated fill over 25% (the BEFORE flash is a wash on the card, not a fill); dynamic before / after in sync, visible on mute (rule 15); 20 Nov critic note carried over: the top zone is filled through every beat (hook, counters, code, panel, line).
Researched improvement (design/improvements.md): web item 7, one bug told as a story (it breaks, you feel it, one word fixes it, it behaves) on a new topic type (ticked 20 Nov).
Craft improvement (design/craft-log.md): the bug's own moment is timed to its words: the snap lands on "jumps" (the tap is placed so the 0.9 s slide ends on the word), and BEFORE's ghost outline and flash mark exactly where the drawer was; the dashed lock shows AFTER's drawer holding.
References used (design/references.md): none
