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
13. After the render: PENDING: render 1 not started; Output QA, critic and the storage-gap lessons (no rolling counters, nothing touching the frame edges, no blank back faces) to be checked on the MP4
14. Cuts: PASS: FLOW: cuts 0 (8 declared camera moves on one path)
15. Dead runs: PASS: FLOW: dead runs none
16. Continuity: PASS: FLOW: continuity 100% (median step 6.8, 8 declared transitions)
17. Strobes: PASS: FLOW: strobes 0

Researched improvement (design/improvements.md): owner chat reference lessons 26 Nov (persistent glowing line, problem then fix, numbers that land on the word).
Craft: the tag, phone, waves, compass and rings all come from techkit lib3d / world3d; one camera path through one world.
Known risks for Output QA: the tag and phone come near the frame edge mid-move (EDGES), the floor reads grey in the wide shots (LOOK vs gold tech3d).

STILLS CHECK: APPROVED is in the direction card (Fable, second round). Final stills: review/tech/showreel-tech-tag-sounding.stills.jpg.

CRITIC: PENDING (starts when the final render passes Output QA)
