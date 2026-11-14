# Review: showreel-c3-niagara-dry (c3, postOn 2026-11-14 postAt 13:00 IST; posted late today by the owner)

REMADE 14 Nov ~18:00-19:30 IST on REAL photos (owner, 14 Nov: the drawn reel "did not look like Niagara (a grey rectangle on rocks, toy
shapes)"; "yes to free real images ... take those and work or animate your design around it"). The render of 12:29 (run 43568930456) is replaced.
Photos (Media workflow runs 43591928011, 43595382325, 43596291560; previews read in the session through scripts/media/from-log.mjs):
falls-now = "The American Falls and Bridal Veil Falls at Niagara" (Mustang Joe, CC0, Wikimedia Commons, 3840 x 1596); dry-1969 = "Dewatered
American Falls (1969)" (James St. John, CC BY 2.0, Wikimedia Commons, 2800 x 1935): the real bare cliff and rock pile. No real photo of the
cofferdam itself was found under an allowed licence (the search's picks were other rivers or wrong subjects and were rejected on the sheet),
so the dam beat shows the real dried riverbed above the falls from the 1969 photo with our label "A DAM OF ROCK / UPSTREAM, ACROSS THE RIVER".
Kept: the story, voice, guess machinery (chips, padlock, countdown), captions, sound and transitions; the drawn worlds stay only as the fallback.

Final qa.mjs --write: SAFE ZONE ok, OVERLAP none, FLOW cuts 0 / dead runs none / continuity 100% / strobes 0, DEPTH falls 4, dam 4, cliff 4,
falls-again 4 planes (photo far, mist, motes, a near foreground layer; all foreground yes), "GUESS: answer hidden until 9.28 s (answer colour at
most 0.0% of the subject before it, 20.1% after)", "BUSY: longest quiet run 1.3 s (10.9-12.2 s); 65 detail beats, 62 seen on the frames (95%):
ok", QA: clean. Two stills sheets (stills.mjs, 12 frames). Fixed from the first sheet: a stale wrong-subject preview file in the local folder
(never pulled by the render, which reads the config); the 1969 grade was a garish yellow (now a soft archive sepia), the answer colour set
from the real rock on the reveal frame (hue 26).

1. Topic: PASS: rule 0 pass (both worlds are real photos of the American Falls: today pouring, 1969 bare), rule 1 pass (guess first: FROZEN / DRAINED / MOVED, padlock, countdown, the answer only on "Drained"), rule 2 pass (the falls with no water, a state nobody pictured), rule 3 pass (24.8 s, ends on the frame-0 view), rule 4 pass (caption asks for the letter and a send), rule 5 pass (4 worlds, 3 declared transitions), rule 6 pass (4 sources + the photo's source), rule 7 pass, rule 9 pass (BUSY ok), rule 10 pass (one mood: cool present, warm archive)
2. Frame 0: PASS: SUBJECT FILL: 86% at frame 0; the real American Falls pouring, tight on the curtain (the icy rocks of the winter photo mostly out of frame), the hook on its plate above the crest
3. Safe zone: PASS: SAFE ZONE: ok (qa.mjs and stills.mjs, every chip, label, card and caption inside)
4. No overlap: PASS: OVERLAP: none (qa.mjs and stills.mjs); the caption card sits on the darkened lower band of each photo
5. Motion: PASS: STATIC STRETCH: none (least change 7.1 at 8 s, median 17.2); EMPTY FRAMES: none (scanned 50 moments, least detail 29.4 at 9 s); TEXT FIT: all text inside its box; the photo pans along the curtain, the drain wipes top to bottom on the answer, slow pushes on the 1969 photo, motes and mist drifting at their own depths
6. Subtitles: PASS: canvas-drawn: 27 px caption = 54 px in the 1080 frame, at most 6 words a line, all 7 sentences shown and finished (QA captions: all 7 sentences on screen)
7. Voice: PASS: PREFLIGHT voice: 7 timed sentences, 46 words, voice ends about 22.9 s (reel 24.8 s, must end by 24.2 s), 2.8 words/s while speaking, 2.0 overall: fits; speed 1.0; HOOK PACE 6 words ok
8. Sound: PASS: QA sound: 110 cues: the falls' roar while the water pours, stopping at the answer, back with the water; a pop per chip, ticks per numeral and notch, a click on the padlock, a tick per pin landing on the photo, page rustle, low moves on the zoom-through and match
9. Payoff: PASS: from about 20.5 s the real pouring falls wipe back down over the 1969 rock; one end card, "DRAINED." over "BACK ON IN NOVEMBER"; the last frame is the frame-0 view (loop)
10. Facts: PASS: unchanged claims (June 1969 rock cofferdam above the American Falls, months of study and bolting, water back in November 1969; History.com, DVIDS / US Army Corps of Engineers, Niagara Falls USA, NiagaraFallsInfo); the photo is captioned on Commons as the dewatered American Falls, 1969
11. Post data: PASS: captions.json entry unchanged (c3, postOn 2026-11-14, postAt 13:00); caption gains a credit line for James St. John (CC BY 2.0) and Mustang Joe (CC0) and the sources list the photo page; "media" carries file, author, licence and source_url (Output QA LICENCE); qa.guess answer #8c5e3c; design/safety.md 1-20 read: no people identifiable, no disaster framing, licences CC0 / CC BY only, no maps
12. Review file: PASS: this file, items 1-11 and 14-20 PASS before the one render; QA: clean incl. GUESS, DEPTH and BUSY
13. After the render: PASS: run 43599191319 green (14 Nov ~18:49-19:20 IST, the re-render after render 1 / run 43597817472 failed Output QA EDGES and GRADE); -14.1 LUFS, true peak -2.8 dBTP; SOUND SOURCE recorded CC0 samples, 86 of 86 element cues audible; OUTPUT QA: PASS (LICENCE 2 files, 1 CC BY credited; PACE 2.19 words/s, STRAY, LOUD, COLOUR, EDGES worst side 0% outside the declared full-bleed photo, GRADE cover 0.26 and 1 of 50 frames washed out, GUESS answer hidden until 9.22 s, NUMBERS, DEAD). The contact sheet cannot be downloaded in a session (blob host blocked); the frames were judged on the session's stills of the same scene
14. Cuts: PASS: FLOW: cuts 0 (window.TRANSITIONS declares 3: zoom-through, page, match)
15. Dead runs: PASS: FLOW: dead runs none (no window.HOLDS)
16. Continuity: PASS: FLOW: continuity 100% (median step 3.7, 3 declared transitions)
17. Strobes: PASS: FLOW: strobes 0
18. Element sound (web): n/a (Turns Out; every element sound in item 8)
19. Journey: PASS: scenes 4 (the falls today, the guess and the drain to 1969; the dried riverbed upstream; the bare rock close while the months pass; the falls back on); transitions: zoom-through, page, match
20. Depth and life: PASS: DEPTH falls: 4 planes, parallax 1560 px, foreground yes; DEPTH dam: 4 planes, parallax 334 px, foreground yes; DEPTH cliff: 4 planes, parallax 546 px, foreground yes; DEPTH falls-again: 4 planes, parallax 444 px, foreground yes; mist and motes drift at their own depths over the photos

Owner feedback, line by line (design/owner-feedback.md) against the stills: "did not look like Niagara" (14 Nov): it is the real Niagara now,
both in 2026 and 1969; the answer is not shown before the guess (GUESS 0.0% before); no text over text; the colour: one cool present, one warm archive.

Render 1 (run 43597817472, green frames) failed Output QA on two checks, both fixed before the one re-render: EDGES (the full-bleed photo touched the right edge; the photo stage is full-bleed by design, now declared in qa.edges_ok) and GRADE (cover: the curtain vs its surroundings 0.11, the winter mist below it as bright as the water; the lower band and the sides are now darkened, 0.24 measured on the local cover frame); GUESS 19.8% after, DEPTH 4 planes per world, QA clean.

Critic (CLAUDE.md): CRITIC: READY (Reel critic session, 14 Nov evening; stills every 1 s from 0 to 24.7 s plus 10.6-12.5 and 15.2-16.0 s every 0.2-0.3 s, on the scene before and after #864, and run 43599191319's log). Render 1 failed Output QA on GRADE (cover 0.11: the falls faded into a pale grey mist over the lower half, the 13 Nov fog wash) and EDGES (the full-bleed photo on the right side): the critic found the same two and made the same fix, but the builder's #864 landed first and its re-render passed, so that is the reel (cover 0.26, the falls white over a dark foot). Guess: the answer is hidden in every frame to 9.22 s (q8), no option word lit before the reveal (q24), the 3-2-1 sits above the falls (q9), frame 0 is flowing water under bare trees, no ice or snow (q27). Real media (q27): the real American Falls today (CC0) and the real dewatered falls of 1969 (CC BY 2.0, James St. John, credited in the caption); no people, no logos or marks. Facts on screen match the sources (cofferdam June 1969, rock bolting through the months, the dam removed in November). Safety 1-20: nothing controversial, no disaster framing; the caption's "Comment your letter" asks for an honest answer to the guess, not engagement bait (safety 15). Owner 14 Nov "did not look like Niagara": it is Niagara now. Minor, not blocking: the zoom-through at 10.9-12.3 s grows a hard-edged patch of the same 1969 photo (reads as a zoom, a little flat); the page turn at 15.4-15.8 s shows a plain tan paper back. Would I stop? Yes: real Niagara and "What happened to Niagara in 1969?". Twice: the water draining off to bare rock is the moment.)
