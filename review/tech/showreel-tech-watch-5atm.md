# Review: showreel-tech-watch-5atm (tech, postOn 2026-11-16 postAt 13:00 IST)

The Mandatory Gate, design/mandatory.md. Built Sun 15 Nov on the owner's ask ("Get reels ready for Web and Tech for Monday and Tuesday"),
on the kit engine's shared frame (techkit/base.html + techkit/scenes/watch-5atm.js). AUTO lines from `python3 techkit/make.py watch-5atm --fake-vo --stills ...`
(fake timings; the render re-times to the real voice); stills sheet at 14 moments read at phone size.

1. Topic: PASS: What does 5 ATM on your watch mean (specs decoded, smartwatch, global; yesterday phone camera): a real mechanism (pressure per 10 m, seals, the still-water test vs real-life spikes, heat and age) a watch buyer meets; never done on any channel; F1 pass, F2 pass (global), F3 pass (Samsung and Apple as text at their strengths, no logos, a drawn generic watch), F4 pass (verdict said and shown: Pool, yes. Sauna, no.), K0 kit engine
2. Frame 0: PASS: the split hero: the same drawn watch half in a blue pool (✓ POOL) and half under a hot shower (falling drops, steam, ✕ HOT SHOWER on the word), the screen reads 5 ATM, the divider sliding
3. Safe zone: PASS: SAFE ZONE: ok (DOM text and every canvas label every 0.5 s)
4. No overlap: PASS: OVERLAP: none
5. Motion: PASS: a moving hero every chapter (camera move per chapter, a sheen and drifting grid, cue-timed builds); FLOW: continuity 91% (median step 1.0, 10 declared transitions)
6. Subtitles: PASS: SUBTITLES: at least 52 px, at most 6 words a line; CAPTIONS: every spoken word shown (the last line as the title slam)
7. Voice: PASS: PREFLIGHT voice: 463 letters, about 38.5 s at speed 1.00 (limit 43.5): fits; PRONUNCIATION: 2 overrides used: ATM (config), metres; no unchecked words; natural speed 1.0
8. Sound: PASS: kit bed + 31 cue effects (3 thuds on Squeeze x3, snaps on crown / buttons / back, pops on five / fifty, fill blips on ten minutes, zaps on dive / jet / stroke, chimes on seals / Samsung / final); recorded CC0 samples, detail bus, SOUND GATE and SOUND DETAIL in qa.txt
9. Payoff: PASS: the watch calm in the pool, two recap pills (✓ Pool and sea swims, ✕ Sauna and hot showers), then the title slam That's 5 ATM.
10. Facts: PASS: Samsung Support (5ATM = 50 m still fresh water for 10 minutes; sauna can damage water resistance; not permanent), Apple Developer WR50 (ISO 22810:2010, pool or ocean swimming, not scuba or high-velocity water), NOAA Ocean Service (+1 atmosphere per 10 m); on screen: 5 ATM, 10 m, +1 ATM, 50 m, 10 min, all said; npm run check passes
11. Post data: PASS: captions.json entry (channel tech, postAt 13:00, concept, experiment tech-kit-engine); topic post: caption with the numbers and verdict, 6 keywords, 5 hashtags, sources
12. Review file: PASS: this file, items 1-11 and 14-17
13. After the render: PENDING: render 1 (run 43696497145, 43.5 s) Output QA FAIL on PACE only ("so why shouldn't it go in a hot shower?" 6.25 words/s, rushed after the pause); LOUD -14.6 LUFS / -2.4 dBTP, SOUND recorded CC0 + DETAIL 32 of 32, COLOUR 15%, EDGES, NUMBERS (5, 10, 1, 50 with no contradiction), DEAD, STRAY PASS. Fixed: line 1 reworded without the pause ("Your watch says five ATM. So why does a hot shower hurt it?"); render 2 pending
14. Cuts: PASS: FLOW: cuts 0 (10 declared: chapter camera moves, jolts, the title slam)
15. Dead runs: PASS: FLOW: dead runs none
16. Continuity: PASS: FLOW: continuity 91% (median step 1.0, 10 declared transitions)
17. Strobes: PASS: FLOW: strobes 0

Local Output QA pre-check on the stills: saturated fill at most 11.5% (limit 25%). Critic: no different session has watched this reel yet.
