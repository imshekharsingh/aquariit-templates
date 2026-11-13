# Review: showreel-tech-ip68 (tech, postOn 2026-11-13 postAt 13:00 IST)

The Mandatory Gate, design/mandatory.md. REMAKE 13 Nov ~13:00-15:30 IST in the new idea look (techreel/scenes/idea.py, design/rules-tech.md
G9-G13) after the owner's "Tech reel animation doesn't live up to expectation" / "Let's build it with new animation". Same script, facts and
sources as the gadget build (render 2, run 43383520926), which is replaced by this render at the same R2 key. AUTO lines from
`make.py ip68 --fake-vo --stills ...` (fake timings), stills read every 1 s from 0 to 22 s at 270 px wide (one sheet), 13 Nov.

1. Topic: PASS: rule F1 pass (specs decoded, phone), F2 pass (global), F3 pass (Apple named as text only, at its strength: "tested at six metres, for thirty minutes", "per Apple"), F4 pass (verdict "saves a spill, not a swim" said and shown as two panels), G9 pass (one subject per scene at full-frame scale), G10 pass (6 worlds: giant type in water, macro seam, water + depth ruler, cards, seal split, verdict), G11 pass (the 6 and 8 travel; dust bounces, water rises, cards slam, the divider wipes), G12 pass (push per scene, zoom-throughs), G13 pass (6 m and 30 pop on their words, no rolling digits), G5 pass, G6 pass, G7 pass, G8 pass, V1 pass, V2 pass, V3 pass (render pending), V4 pass
2. Frame 0: PASS: giant IP68 (330 px type, ~830 px wide) with its lower third under moving water and dust drifting above, the hook "What does IP68 really protect?" whole in the caption band with IP68 gold; readable at thumbnail size
3. Safe zone: PASS: SAFE ZONE: ok (every text box at every 0.5 s inside x 60-960, y 250-1570, through the push-ins; world text scales with the camera)
4. No overlap: PASS: OVERLAP: none (first sheet: the flying 6 crossed the P at 2.5 s; now the I and P sink while the 6 rises, then travels)
5. Motion: PASS: a big change every 1.5-3 s (the word splitting, dust bouncing, water rising, phone sinking, ruler, readout, ring sweep, three slams, ring trace, divider wipe, letters reassembling, two panels); the camera pushes in on each world and drifts; FLOW continuity 90%
6. Subtitles: PASS: every line word by word in its own band over a dark bed, chunks equal the words (make.py checks), every sentence finished on the stills; the hook whole from frame 0
7. Voice: PASS: PREFLIGHT voice: 263 letters, about 21.9 s at speed 1.00 (limit 22.5): fits; PRONUNCIATION: 3 overrides used: IP68 (config), iPhones (config), metres; no unchecked words; speed 1.0 (unchanged script: render 2 voice check 66 of 66 words heard)
8. Sound: PASS: ELEMENTS: 66 element sounds (small high 37, medium mid 19, large low 10); longest gap 1.4 s at 7.2 s (dust hits small, tag words and chips medium, the water rise, slams, depth readout and the wipe low), recorded CC0 samples
9. Payoff: PASS: IP68 reassembles (I and P drop in, the 6 and 8 rise from below) over two big panels, SPILL (gold edge, green dot, drops arcing from the cup) on "spill" and SWIM (red dot) on "swim", held to the end with the drops and the drift
10. Facts: PASS: Apple Support "About splash, water, and dust resistance of iPhone" (support.apple.com/en-us/108039), read 13 Nov 09:20 IST: IP68 under IEC 60529, maximum depth of 6 meters up to 30 minutes (iPhone 16 and later, 17, Air, 18); avoid swimming, showering (pressurized or high velocity water), saunas and steam rooms; resistance "not permanent conditions and resistance might decrease as a result of normal wear"; "resistant to accidental spills". IEC 60529 digits (6 = dust tight, 8 = continuous immersion under conditions the maker specifies): iec.ch is refused by this session's network (403 at the proxy), so from the standard as known, cited as the second source. The voice says only "new iPhones" for the 6 m figure; samsung.com was refused too, so no Android depth is claimed.
11. Post data: PASS: captions.json entry (channel tech, postOn 2026-11-13, postAt 13:00, concept rewritten for the remake, experiment tech-idea-look); post block unchanged: caption with the numbers and the verdict, 6 keywords, 5 hashtags, 2 sources
12. Review file: PASS: this file, items 1-11, 14-17
13. After the render: PENDING: render 1 (run 43388306199) failed Output QA EDGES only (the macro phone edge ran past both frame sides in the 3.8-5.3 s push-in; PACE, LOUD, SOUND 56/56, COLOUR, NUMBERS, DEAD passed); fixed (slab x 160-860, push 1.14) and re-rendered
14. Cuts: PASS: FLOW: cuts 0 (7 declared: 5 zoom-throughs between worlds, 1 glide inside the water world, the end fade)
15. Dead runs: PASS: FLOW: dead runs none
16. Continuity: PASS: FLOW: continuity 90% (median step 1.0, 7 declared transitions)
17. Strobes: PASS: FLOW: strobes 0
20. Critic: PENDING: no different session has watched this remake yet (the 11:17 critic ran before it existed); the builder's own answers below

Builder's critic answers (stills every 1 s at phone size, design/critic.md): Q1 yes (giant IP68 half under water, 0 s); Q2 yes (nothing cut by accident: the macro seam at 4-5.6 s runs past the right edge by the push-in on purpose; no stray marks); Q3 yes (6 = DUST TIGHT, 8 = FRESH WATER, 6 m and 30 MIN on their words, Swimming / Showers / Sauna on theirs); Q4 yes (one focus per scene, the push leads to the seam, the phone, the readouts, the divider); Q5 yes (speed 1.0); Q7 yes (ends on SPILL / SWIM); Q19 yes (Apple as text, at its strength, specs equal the support page); Q21 yes (subject 70%+ of the frame in every still from 0 to 22 s except the 0.3 s zoom-throughs, six different worlds, no faded word left behind after the masked-text fix).

Owner-feedback lines against the stills: tech terms overridden (IP68, iPhones); something changes every 1.5 s or less; a non-developer feels it in 1 s; no text over text, nothing under the right-side buttons (all text x 60-960); premium dark palette with one gold accent, depth from the camera push, drift, bubbles and the water's grade; 20-22 s at natural pace; Android owners: the rating and the seal ageing apply to any IP68 phone, only the 6 m test is Apple's (said "per Apple").

Would this make me stop scrolling and watch it twice? Stop: yes, a giant IP68 sinking in water with the question is a strong first frame. Twice: the 6 and 8 travelling and the avoid list (showers, sauna) are the surprise; the verdict line is the send.

References used: web motion kit techniques (kitmotion.js: springs, staggers, the camera leading the eye, before/after split), rebuilt in Python for techreel.
