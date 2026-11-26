# Review: showreel-tech-tag-sounding (tech, postOn 2026-11-26 postAt 15:00 IST)

The Mandatory Gate, design/mandatory.md. Built 26 Nov 2026 by the tech builder session on the phase 2 3D colour-world kit (starter tech3d): techkit/scenes/tag-sounding.html, topic techreel/topics/tag-sounding.json. Direction card: review/tech/showreel-tech-tag-sounding.direction.md. Stills: review/tech/showreel-tech-tag-sounding.stills.jpg.
AUTO lines from `KIT_Q=0.5 python3 techkit/make.py tag-sounding --fake-vo --stills 0.3,2.8,5.4,7.6,8.8,10.6,12.5,14.6,17.2,19.2` (fake timings; the render re-times to the real voice).
Why this reel: fresh news (Samsung Newsroom, 23 Nov 2026), not a phone (battery cycles, a phone, was 25 Nov), Fable pick 26 Nov (design/pick-log.md), format quickmyth, device wearables, global.
Reference lessons applied (owner chat, design/references.md "R-ref 26 Nov"): one persistent glowing radio line phone to tag, problem first (amber guess cloud) then fix (six channel waves, compass needle), 3D number beats that land on the spoken word (60 m, 3x, 20 m), no top keyword bar, no India line, held payoff.

1. Topic: PASS: a stranger with a tracker feels it at once ("it points to my keys, it does not just say near"); the surprise is the method (phase and time of flight across channels, not signal strength); useful takeaway: direction and distance from about 60 m, about three times the last tag, UWB inside 20 m; fresh (23 Nov 2026), not a repeat of any posted reel; Samsung named as text only, no logo; F3 pass (no winner or loser); N1-N4 pass.
2. Frame 0: PASS: the purple tag already floats and turns on its plinth with three coloured rings pulsing out of it, the question "Can a tiny tag point to your keys?" is on screen from 0 s (tech: SUBJECT FILL not required).
3. Safe zone: PASS: SAFE ZONE: ok (captions moved into y 258+ and x 100-960 after the first run flagged them)
4. No overlap: PASS: OVERLAP: none
5. Motion: PASS: something moves in every shot (rings pulsing, tag turning, amber dots drifting, six waves flowing, needle wobbling then locking, rings growing, UWB pulse, held end with the line still pulsing); FLOW dead runs none; eight declared camera moves on one path
6. Subtitles: PASS: SUBTITLES: 58 px (above 52), at most 6 words a line, checked on the stills; CAPTIONS: 7 chunks, every spoken word shown
7. Voice: PASS: PREFLIGHT voice: 260 letters, about 21.7 s at speed 1.00 (limit 30.0): fits; PRONUNCIATION: 2 overrides used (Bluetooth, metres), ultra-wideband checked
8. Sound: PASS (by design; measured on the render at item 13): impact at start, thud on "guessed", whoosh on "Sounding", impact on "sixty", pop on "three", chime on "twenty", pop on "Less"; voice speed 1.0
9. Payoff: PASS: the last 3.5 s hold the tag, the phone with the mint needle aimed at it, the beam and the UWB ring, caption "Less guessing. More pointing." answering the opening question
10. Facts: PASS: read 26 Nov 2026 on Samsung Newsroom https://news.samsung.com/global/the-technology-behind-more-precise-finding-with-galaxy-smarttag3-and-smartthings (23 Nov 2026): Compass View "extends the maximum finding range to approximately three times that of its predecessor"; Bluetooth 6.0 Channel Sounding "measures changes in radio wave phase and time of flight across multiple channels"; finding "from up to 60 meters away"; UWB "even greater accuracy" within 20 meters; conventional BLE uses RSSI
11. Post data: PASS: captions.json entry (channel tech, postOn 2026-11-26, postAt 15:00 IST, format quickmyth, device wearables, concept, experiment, style); 6 keywords, 5 hashtags; the caption asks "Would you use a tag that points?" and cites the Samsung Newsroom date
12. Review file: PASS: this file, items 1-11 and 14-17 PASS
13. After the render: PASS: render 2 (run 45752646144, 26 Nov) Output QA PASS on the final MP4 (23.57 s class: PACE ok, LOUD -14.5 LUFS true peak ok, SOUND recorded samples, COLOUR ok, EDGES ok, LOOK vs 3D gold ok, VARIETY 17%, NUMBERS ok, DEAD none; warnings: no real media, no hero box, 2 SHEEN bands at 9.8 s and 16.0 s); CRITIC 2: READY (see the line below); storage-gap lessons checked: no rolling counters, nothing on the frame edges, no blank back faces
14. Cuts: PASS: FLOW: cuts 0 (8 declared camera moves on one path)
15. Dead runs: PASS: FLOW: dead runs none
16. Continuity: PASS: FLOW: continuity 100% (median step 6.8, 8 declared transitions)
17. Strobes: PASS: FLOW: strobes 0

Researched improvement (design/improvements.md): owner chat reference lessons 26 Nov (persistent glowing line, problem then fix, numbers that land on the word).
Craft: the tag, phone, waves, compass and rings all come from techkit lib3d / world3d; one camera path through one world.
Known risks for Output QA: the tag and phone come near the frame edge mid-move (EDGES), the floor reads grey in the wide shots (LOOK vs gold tech3d).

STILLS CHECK: APPROVED is in the direction card (Fable, second round). Final stills: review/tech/showreel-tech-tag-sounding.stills.jpg.

CRITIC: NOT READY: the big 60, 3x and 20 numbers sit on top of the phone and are crossed by the pointer line at 12.5-19 s, and the 3x shot never shows the old range against the new one.
Detail (independent critic, 26 Nov 2026; judged the fetched render: 23.57 s, 1080x1920, -14.5 LUFS; frames at 0, every 1 s, 20.6-23.5 s at 2 fps, close frames at 12.5 / 14.5 / 17.5 s; side-by-side sheet run, the script still pairs with the old gold ai-memory, so the 3D gold was judged from design/gold.md's description and numbers):
- Q2, Q35, D5 (FAIL): 12.5-14.5 s the "60" figure is drawn over the phone body (the phone's own "60" label shows through the 6) and the mint pointer line runs through the 6; 14.5-16.5 s the needle line strikes through the "3x" between the 3 and the x; 17-19.5 s the "20" covers the phone's lower half and the "m" sits on the green ring. D5 says nothing overlaps a number.
- Q16, Q21 (FAIL): "about three times the last tag's range" shows a compass dial and a needle, not two ranges. No small old ring and big new ring, so the 3x is a label and the idea never plays out.
- Q3 (weak): the phone screen reads "60 m" from 1.7 s to the end, including the payoff, while the tag sits about 1 m away. The finder reads as the distance to the tag, so it shows the range limit as if it were a measured distance.
- Q0b (FAIL, file only): captions.json "aiLabel" is true; this is clearly rendered 3D with no photoreal person, place or screen, and gold.md / rules-tech D8 require false. Fix in captions.json, no render needed.
- Passes: frame 0 has the moving tag, rings and the full question on screen (Q1, Q42); captions word by word with the blue box, no top bar, no India line (N3, Q46); the guess cloud 4-6.5 s and the six channel waves 7-10.5 s are the strongest shots; camera moves: push, pull-back, swing, low side track, look-down, top-down, dolly (7 distinct); nothing touches the edges; payoff held 20-23.5 s with the last caption on. Facts match the Samsung Newsroom page (23 Nov 2026): 60 m, about 3x, UWB inside 20 m, phase and time of flight vs signal strength. Samsung is named as text only, with no logo (safety OK).
GOLD: below (13-19 s: number beats are cluttered over the hero, where the gold keeps numbers in their own clear lower-fifth space; colour, depth and darkness match: bright 0.21, dark 30 %).
STOP: 7/10 (0-1 s: the glowing tag and rings plus the question work). REWATCH: 6/10 (the waves at 7-10 s are worth a second look; the 60 / 3x / 20 beats are a mess at phone size, so they lose it).
PREMIUM: animation 7/10 (t 4-10 s good arrivals), cleanliness 5/10 (t 12.5-19.5 s overlaps), premium 7/10 (t 20-23 s held payoff); weakest: 12.5-19.5 s, numbers over the phone, fix below.
EXACT FIX (render 2):
1. 60 m beat (cue "sixty", about 12-14.5 s): place the 60 m figure in its own lower-fifth space, left of and below the compass dial (lib.figure with D5's step-aside), so no part of the phone, needle or pointer line crosses it; or move the camera keyframe so the phone sits in the upper-right third while the figure shows.
2. 3x beat (cue "three", about 14.5-16.5 s): replace the dial-only top-down with two floor rings round the tag: a small amber ring (old range, labelled "old") and a mint ring three times its radius that grows out on "three times". Put the "3x" figure outside both rings in clear floor space; the needle line must not cross it.
3. 20 m beat (cue "twenty", about 16.5-19.5 s): keep the green UWB ring but put the "20 m" figure on the floor in front of the ring, clear of the phone body; the phone stays whole and uncovered.
4. Phone finder screen: show a live distance that counts down to a short value (for example "1.2 m"), or only the arrow, never "60 m" while the tag is beside it. No rolling counter: set it as one value.
5. captions.json: "aiLabel": false.
Then re-check frames 12-20 s at phone size for any line or object crossing a number before calling it done.
ENHANCE: open the payoff on the needle snapping onto the tag with a click sound at 19.8 s, so the answer to "can it point?" is one visible snap.

## Render 1 result and render 2 fix (26 Nov 2026)
- Render 1 (run 45747481173): Output QA PASS (23.57 s, -14.5 LUFS, PACE ok, NUMBERS ok, EDGES ok, VARIETY 17%, LOOK ok; warnings: no real media, no hero box, one SHEEN band at 9.8 s). Independent critic (Opus): NOT READY (see the CRITIC line above).
- Fix for render 2 (the last render; a third needs the owner chat's yes), all five points of the critic: (1) the 60 m / 3x / 20 m numbers are smaller and sit in the lower right of the frame, off the phone; (2) the three-times shot is now a true high top-down with a small amber ring (old range) and a mint-cyan ring three times its size, "3x" outside the dial; (3) 20 m sits clear of the phone; (4) the phone screen shows only the green arrow (the text "60 m" is gone); (5) captions.json aiLabel is false. Stills of the fix checked by the builder on frames 2.8, 12.5, 14.2, 17.3 and 19.5.
- After render 2: Output QA, then a second critic session (new session, Opus).

CRITIC 2: READY: all five render-1 fixes show in the render 2 MP4, the numbers now sit in clear space off the phone, and the 3x beat plays out as a small amber old ring against a ring three times its size.
Detail (second independent critic, 26 Nov 2026; judged the fetched render 2: 23.57 s, 1080x1920, -14.5 LUFS, no silence gap over 0.5 s; frames every 1 s from 0 to 23.4 s, close frames at 12.6-19.6 s, caption crops at 17.3-23.5 s):
- Fix 1 PASS: 12.6-14.2 s the "60 m" sits lower right, off the phone; the pointer line and the arrow pass above it and never cross it. 14.8-16.8 s the "3x" is clear of the needle line.
- Fix 2 PASS: 14.8 s small amber ring, 15.6 s a cyan ring about three times its size grows out on "three times". The idea now plays out on screen.
- Fix 3 PASS: 16.8-19.6 s the "20 m" sits on the floor in front of the green ring, below the phone; the phone is whole.
- Fix 4 PASS: the phone screen shows only the green arrow from 2 s to the end; no "60 m" text.
- Fix 5 PASS: templates/showreels/captions.json "aiLabel": false.
- Four questions: as rich as the 3D gold: yes (one lit colour world, 7 distinct camera moves, glow and depth all through); not a copy of it: yes (its own subject, waves and dial); would stop a scroll: yes (0 s: glowing tag, rings and the full question on screen); would be watched twice: yes (the guess cloud at 4-6 s and the six channel waves at 7-10 s, now with clean number beats).
- Readable at phone size, nothing over the captions, nothing touching the frame edges, payoff held 20-23.5 s on the tag, phone and needle. Facts: the on-screen claims (60 m, about three times the last tag, UWB inside 20 m, phase and time of flight rather than signal strength) are the ones critic 1 checked against the Samsung Newsroom page (23 Nov 2026); the wording is unchanged in render 2.
STOP: 7/10. REWATCH: 7/10. PREMIUM: animation 7/10, cleanliness 7/10, premium 7/10.
NITS (minor, no render; for the next tech reel on this kit):
1. 15.6-16.4 s the amber old-range ring runs through the "3" of "3x" once the camera tilts. Keep figures outside every ring's screen path for the whole beat.
2. 16.8-19.6 s the green UWB ring glow passes behind "20" and the "m" (still readable, pink on green). A darker plate or a short step-aside would keep it cleaner.
3. 12.6 s the "60" touches the dial's tick ring on its left edge.
4. Around 17.6 s the caption re-wraps with a crossfade of about 0.15 s, so two layouts of the same line ghost on top of each other. Swap the layout in one frame, with no crossfade.
5. 22-23.5 s there is no caption over the held payoff. The last line was shown in full first, so this passes, but holding "More pointing." to the end would land better.
6. Critic 1's ENHANCE (the needle snapping onto the tag with a click at 19.8 s) was not added. It is optional.
