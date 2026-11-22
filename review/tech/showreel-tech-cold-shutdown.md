# Review: showreel-tech-cold-shutdown (tech, postOn 2026-11-22 postAt 18:00 IST)

The Mandatory Gate, design/mandatory.md. Built 22 Nov by the tech rescue session (the 06:47 run did not build it), the day it posts, on the kit engine's shared frame (techkit/base.html + techkit/scenes/cold-shutdown.js).
AUTO lines from `python3 techkit/make.py cold-shutdown --fake-vo --stills 0,3,9,13,17,21,25,28,33,36,38.5,40` (fake timings; the render re-times to the real voice).
Why this reel: audit 22 Nov tech OK; global kit reels reach 958-1,481, so global again. Format SPECS DECODED (what "30%" means in the cold), rotation: 21 Nov was gadget myths. Gadget is a phone again (the only Apple pages the session could reach with a battery-cold fact; the laptop angle is already laptop-plugged). Sources: Apple Support "iPhone battery and performance" and apple.com/batteries/maximizing-performance, both read 22 Nov 2026. Critic fixes of 21 Nov applied: named words as 40 px+ pills in the hero above the subtitle band, lower half filled (thermometer, cell, resistance, voltage gauge, step panels), recap pills not over the object.

1. Topic: PASS: nearly everyone has seen a phone die at 30% in the cold; not done on any channel; rulebook: K0 pass (kit, 7 beats), K1 pass (no sheen, no box round the hero, hero spans x 150-900), K2 pass (the cell, resistance zigzag, voltage bar, thermometer and current dots change on every beat), K3 pass (cover frame 0: title, 30% cell, thermometer, voltage bar inside the centre 3:4), R0 n/a (drawn generic cell, no photos), S6 long class (107 words), F1 pass (specs decoded, phone), F2 global, F3 pass (Apple named only as a source in text, nothing drawn as its UI), F4 pass (verdict: cold pauses it, keep it warm), F5 n/a (not a myth day)
2. Frame 0: PASS: the cover: title "Phone dies in the cold?", the 30% cell, the thermometer, the zigzag and the voltage bar above the MIN line, held still then moving; SUBJECT FILL: the hero spans x 150-900 of 1080 (69% of the width)
3. Safe zone: PASS: SAFE ZONE: ok (every text and canvas label every 0.5 s on the stills)
4. No overlap: PASS: OVERLAP: none
5. Motion: PASS: the thermometer drops on "cold", the zigzag grows on "impedance", the bar sags below MIN on "sags", the cell goes dark with a power icon on "shuts", warms back on "warms"; camera moves in every chapter; FLOW dead runs none
6. Subtitles: PASS: SUBTITLES: at least 52 px, at most 6 words a line; CAPTIONS: 40 chunks, every spoken word shown
7. Voice: PASS: PREFLIGHT voice: 474 letters, about 39.4 s at speed 1.00 (limit 44.0): fits; PRONUNCIATION: 2 overrides used: iPhones (config), thirty-five (config); no unchecked words
8. Sound: PASS (by design; measured on the render at item 13): impact at frame 0, blips and ticks on each named word, a thud on "impedance" and "shuts", a chime on "normal", the final chime
9. Payoff: PASS: the last frame: "Cold pauses it. Warm it." over the cell, the two recap pills before it
10. Facts: PASS: Apple Support page text read 22 Nov 2026 (low charge, higher chemical age and cold raise impedance; voltage drops more; components need a minimum voltage; the shutdown is intentional to preserve them) and apple.com/batteries (cold effect temporary; works best 0 to 35 C; heat above 35 C can damage permanently), in post.sources; npm run check passes
11. Post data: PASS: captions.json entry (channel tech, postOn 2026-11-22, postAt 18:00, concept, experiment tech-battery-voltage); 6 keywords, 5 hashtags; caption names who to send it to
12. Review file: PASS: this file, items 1-11 and 14-17 PASS
13. After the render: PASS: render 3 (owner's one-off go, run 45006406274): Output QA PASS, SYNC PASS 5 of 5 named items on screen (impedance 7.6 s +0.00, voltage 11.3 s +0.00, shuts 18.1 s +0.25, warms 25.7 s +0.00, celsius 33.1 s +0.25); named words are 92 px bigText at y 512 held 1.5 s. Earlier: render 2, run 45000139598, FAIL on SYNC only; render 1, run 44996065910, FAIL on PACE, HERO, SYNC. Critic item 20 still to come.
14. Cuts: PASS: FLOW: cuts 0 (declared: 7 camera moves between chapters, the final slam)
15. Dead runs: PASS: FLOW: dead runs none (declared hold: the end card)
16. Continuity: PASS: FLOW: continuity 66% (tech calm 55%+)
17. Strobes: PASS: FLOW: strobes 0

Researched improvement (design/improvements.md tech item 4 family): the invisible cause is drawn as a gauge on the object (voltage bar under a MIN line), so "30% left but off" is visible.
Craft improvement (design/craft-log.md): named words are drawn as 40 px+ pills in the hero zone, outside the subtitle band, so Output QA SYNC can read them.
References used (design/references.md): none
