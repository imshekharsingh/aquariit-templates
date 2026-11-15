# Review: showreel-tech-screen-120hz (tech, postOn 2026-11-17 postAt 13:00 IST)

The Mandatory Gate, design/mandatory.md. Built Sun 15 Nov on the owner's ask ("Get reels ready for Web and Tech for Monday and Tuesday"),
on the kit engine's shared frame (techkit/base.html + techkit/scenes/screen-120hz.js). AUTO lines from `python3 techkit/make.py screen-120hz --fake-vo --stills ...`
(fake timings; the render re-times to the real voice); stills sheet at 14 moments read at phone size.

1. Topic: PASS: Is a 120 Hz screen worth paying extra for (worth it or not, phone screen, global; Mon smartwatch): the mechanism of refresh (still pictures, 17 ms vs 8 ms, battery per picture, adaptive gears); refresh-120 was only a hidden sample, never posted; F1 pass, F2 pass, F3 pass (Samsung and Apple named as text, no comparison), F4 pass (verdict: Love scrolling? It's worth it.), K0 kit engine
2. Frame 0: PASS: the same swipe on two drawn phones: 60 Hz with ghost rows (60 Hz · JUMPY) and 120 Hz smooth (120 Hz · SMOOTH), panel 60 Hz vs 120 Hz
3. Safe zone: PASS: SAFE ZONE: ok (DOM text and every canvas label every 0.5 s)
4. No overlap: PASS: OVERLAP: none
5. Motion: PASS: a moving hero every chapter (camera move per chapter, a sheen and drifting grid, cue-timed builds); FLOW: continuity 92% (median step 1.0, 8 declared transitions)
6. Subtitles: PASS: SUBTITLES: at least 52 px, at most 6 words a line; CAPTIONS: every spoken word shown (the last line as the title slam)
7. Voice: PASS: PREFLIGHT voice: 501 letters, about 41.7 s at speed 1.00 (limit 44.0): fits; PRONUNCIATION: 0 overrides used; no unchecked words; natural speed 1.0
8. Sound: PASS: kit bed + 22 cue effects (ticks on still pictures, thud on jumpy, pops on sixty / eight / seventeen, chime on doubles, zaps on power, snaps on fast / slow / slowest, pops on the recap, impact and chime on the title); recorded CC0 samples, detail bus, SOUND GATE and SOUND DETAIL in qa.txt
9. Payoff: PASS: the smooth phone, recap pills (✓ Fast scrolling and games, ~ Mostly reading: a nice extra), title slam That's 120 Hz.
10. Facts: PASS: Samsung Support US (Standard 60 Hz best battery, High 120 Hz uses more battery, Adaptive up to 120 Hz) and PH (more refreshes per second need more battery power); 17 ms and 8 ms are 1 s / 60 and 1 s / 120; on screen: 60, 120 Hz, 17 ms, 8 ms, all said; npm run check passes
11. Post data: PASS: captions.json entry (channel tech, postAt 13:00, concept, experiment tech-kit-engine); topic post: caption with the numbers and verdict, 6 keywords, 5 hashtags, sources
12. Review file: PASS: this file, items 1-11 and 14-17
13. After the render: PENDING
14. Cuts: PASS: FLOW: cuts 0 (8 declared: chapter camera moves, jolts, the title slam)
15. Dead runs: PASS: FLOW: dead runs none
16. Continuity: PASS: FLOW: continuity 92% (median step 1.0, 8 declared transitions)
17. Strobes: PASS: FLOW: strobes 0

Local Output QA pre-check on the stills: saturated fill at most 2% (limit 25%). Critic: no different session has watched this reel yet.
