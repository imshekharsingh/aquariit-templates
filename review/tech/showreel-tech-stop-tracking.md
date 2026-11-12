# Review: showreel-tech-stop-tracking (tech, postOn 2026-11-12 postAt 13:00 IST)

The Mandatory Gate, design/mandatory.md. REMADE 12 Nov ~12:00-13:30 IST in the new phone walkthrough look (owner, 12 Nov: "Tech reel doesn't feel
like a change at all, same things, same design pattern"; design/rules-tech.md L1-L6, design/references.md R-trend 12 Nov): one big drawn phone on
a flat bold colour per setting, a touch indicator walking the path tap by tap on the spoken word, the camera leaning in to each tap, a result
banner red → green, the 1/3 counter, both paths on a black card, word-by-word captions. Same topic and facts (E17, tech-settings-list).
AUTO lines from `make.py stop-tracking --fake-vo --stills ...`, 12 Nov ~13:20 IST (stills every 0.6 s, read at 216 px wide).
References used: R-trend 12 Nov tech walkthrough (phonecam.py: phone + touch indicator + tap zoom), word-by-word captions (phonecam.captions), result in frame 0 (hook_page).

1. Topic: PASS: rulebook score: rule 1 pass (3 settings, kind tap x3 + recap), rule 2 pass (hook_page flips three red values to green safe values by 1.1 s; first tap on "Location" ~2.3 s), rule 3 pass (both paths on screen, unchanged from the 11-12 Nov checks on Apple Support 102647 / 102420 and Android / Google Play help), rule 4 pass (recap "SAVE THIS", voice "Save this, and send it to a friend", caption lists the three), rule 5 pass (64 words, preflight 21.5 s at speed 1.00, one sentence per setting with "so"), rule 6 pass (13:00 slot; remade late today), rule 7 pass (PRONUNCIATION: ID only), rule 8 pass (FLOW below), rule 9 pass (no repeat); L1 pass (phone 720 px, colour per setting), L2 pass (taps on "Location", "app", "While"; "off"; "Privacy", "off"), L3 pass (banner at the top of the screen, never under the card), L4 pass (counter + 35 px paths), L5 pass (2-3 word chunks, 88 px, yellow current word), L6 pass (frame 0 = hook + flips)
2. Frame 0: PASS: the hook "3 settings that / stop apps / TRACKING you" (112 px heavy, TRACKING yellow) over the phone's "Privacy check" with Always / On / On in red, flipping to While Using / Off / Off in green at 0.45 / 0.75 / 1.05 s; SUBJECT FILL: the phone fills ~67% of the width at frame 0
3. Safe zone: PASS: SAFE ZONE: ok (every text box at every 0.5 s inside x 60-960, y 250-1570 after the zoom, paths card and captions included)
4. No overlap: PASS: OVERLAP: none (screen texts counted where the viewer sees them after the zoom, minus what the banner or the path card covers); BAND: counter y 262-354, phone top never above y 384 (zoom focus clamped), card y 1078-1254, captions centred on y 1400: clear on every still
5. Motion: PASS: FLOW: dead runs none; a tap, page push, flip or banner every 0.5-1.2 s in each setting, the camera leans in to each tap and drifts always, the save screen pushes in slowly
6. Subtitles: PASS: chunks of 2-3 words (every line's chunk counts equal its words; make.py now refuses a short list), 88 px, at most 2 rows, every sentence finished on the stills
7. Voice: PASS: PREFLIGHT voice: 258 letters, about 21.5 s at speed 1.00 (limit 22.0): fits; PRONUNCIATION: 1 overrides used: ID; no unchecked words; speed 1.0, max_speed 1.0 (never slowed, never sped)
8. Sound: PASS: ELEMENTS: 48 element sounds (small high 23, medium mid 20, large low 5); longest gap 2.0 s at 6.9 s; each tap a mid snap, each page push a small tick, each flip a mid snap, each banner a low thud; recorded CC0 samples (SOUND SOURCE on the render); SOUND GATE and SOUND DETAIL after the render (item 13)
9. Payoff: PASS: the save screen: the three changes tick in on "Save", "send", "friend", the SAVE THIS stamp lands on "Allow" and holds with a slow push-in to the end
10. Facts: PASS: unchanged sources (5 in the topic's post block): Apple Support 102647 and 102420, Android Developers location permissions (two pages), Google Play Console Help 6048248; the lines say only what they support
11. Post data: PASS: captions.json entry (channel tech, postOn 2026-11-12, postAt 13:00, concept updated for the new look, experiment tech-settings-list); 6 keywords, 5 hashtags
12. Review file: PASS: this file, items 1-11, 14-17
13. After the render: PENDING
14. Cuts: PASS: FLOW: cuts 0 (10 declared: the push into each setting, the page pushes after each tap, the end fade)
15. Dead runs: PASS: FLOW: dead runs none
16. Continuity: PASS: FLOW: continuity 99% (median step 1.3, 10 declared transitions)
17. Strobes: PASS: FLOW: strobes 0

## Builder notes, 12 Nov remake
Fixed from the stills before the render: the zoom pushed the phone into the counter (focus now clamped); the result pill sat under the path card
(now a notification banner at the top of the screen); caption outlines merged letters (thinner outline, 30 px word gaps); two chunk lists were
one word short ("you.", "everything." never shown; now refused by make.py); Pillow ignored alpha on outlined text, so the hook popped off over
the counter at 2.2 s (now composited with real alpha); the end fade read as a cut (declared).

## Earlier build (11 Nov, glass engine), kept for the record
### Critic pass, 12 Nov 2026 (~10:40 IST, fresh session; stills every 1 s from `make.py stop-tracking --fake-vo --stills 0..21`, read at 360 px wide)
Problems found, with times (fake-vo times; the render's real voice runs ~25% later):
- 0.0-1.1 s: the hook switches were labelled "Location / Precise / Ad ID" and flipped ON, while the reel tells you to turn Precise and ad tracking OFF: screen against voice (critic Q3). Fixed: labelled as the protections they turn on: "While Using / Area only / Block Ad ID".
- 3-12 s: the iPhone / Android paths were 26 px, about 9 pt on a phone: not readable (critic Q13). Fixed: 36 px (platform 34 px), panel rows 64 px, phone 24 px shorter so nothing moves into the captions; SAFE ZONE ok, OVERLAP none.
- Paths checked against Apple Support 102647 / 102420 and Android / Google Play help: iPhone "Privacy › Location Services › app", "Location Services › app › Precise", "Privacy › Tracking › Request to Track" (the switch is "Allow Apps to Request to Track"; "allow apps to ask" was not its words); Android "Location › App location permissions", "App location › Use precise location", "Privacy › Ads › Delete advertising ID" (Android 12+).
- Last line "Save this and do it tonight" at 4.4 words/s in the 11 Nov render (critic Q5). Fixed: a comma ("Save this, and do it tonight.") and the take at speed 0.96 (preflight about 21.0 s, limit 21.4).
Passed: frame 0 stops (big hook + switches, readable < 1 s); nothing cut at the edges in any still (2 s and 12 s are declared glides); one focus at a time (finger, row shimmer, result pill); drawn phone UI is generic (no logos) and reads as a settings screen; ends on the full recap checklist with the save line. Would a stranger stop and save it? Yes: three things to do tonight, both platforms, a checklist to save.
FLOW: cuts 0 · dead runs none · continuity 100% · strobes 0. ELEMENTS: 53 (longest gap 2.3 s).

Re-render after the critic fixes: run 43160702033 (12 Nov, 10:50 IST), green. Voice in one take at speed 0.96, ends 19.92 s (limit 21.4); voice check: 56 of 56 words heard as written, no unsure words, 2.86 words/s overall (ok); SOUND DETAIL: 45 of 45 element cues audible, quietest -14.1 dB (100%): ok; SOUND GATE: ok -14.4 LUFS, true peak -2.5 dBTP; SAFE ZONE: ok; OVERLAP: none; ELEMENTS longest gap 3.1 s at 13.1 s. Pacing table: sentences 1-5 at 2.99-3.28 words/s; the last, "Save this, and do it tonight." (18.26 s), at 4.48 words/s (1.34 s for 6 words): the comma and speed 0.96 did not slow it, because Kokoro rushes a short closing sentence at the end of a take.
20. Critic: PENDING: the remade reel is checked by a fresh critic pass after its render (this session renders once, then reads the output as a viewer)
