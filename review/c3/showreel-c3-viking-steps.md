# Review: showreel-c3-viking-steps (c3, postOn 2026-11-21 postAt 13:00 IST)

Turns Out myth Nº 1 rebuilt in the owner's reference style (owner, 21 Nov: "Remove the one you added for turns out and make one based on this animation
style now for immediate check"; reference = app References 1-2, design/references.md R-ref 21 Nov). Replaces showreel-c3-viking-horns (removed).
Echoes engine with the new `look: "ui"` (scripts/echoes/engine.html: Inter type, a labelled step bar MYTH · PROOF · AGE · ORIGIN · TRUTH with "STEP 0n"
headers, big mid-frame word-by-word captions with one orange key word, no grain / dust / leak, 0.3 s crossfades) and shot kind `ui` (flat glass cards,
icon tiles, an orbiting hero, a card fan, a padlock, outlined step numbers, a stat, a timeline, a flow, a myth-vs-real verdict; every piece pops on its
own delay and is heard as a tap + click, scripts/echoes/sound.py). Same checked facts as the removed reel. 6 lines, 14 shots, ~24 s with the real voice.
AUTO lines from `node scripts/showreel/preflight.mjs`, `node scripts/showreel/stills.mjs`, `node scripts/echoes/flow.mjs`, `node scripts/echoes/colour.mjs`
and `node scripts/qa/frames.mjs` + `python3 scripts/qa/look.py` on scripts/channel3/viking-steps.json.

1. Topic: PASS: rules-c3.md R1: a myth nearly everyone holds (the horned Viking), the truth in 2+ reliable sources, undisputed (the voice says the look "took off" in 1876, not that it was invented then); drawn icons only; not on the never-list (no religion: the Veksø helmets' ritual use is left out; no living people)
2. Frame 0: PASS: SUBJECT FILL: 74% at frame 0; the hero (orange orb with the horned-helmet icon, orbiting tiles) fully drawn at frame 0 with the cover "TURNS OUT · MYTHS / Vikings Never Wore Horns" in the centre 3:4; voice from 0.0 s, "Everyone pictures Vikings with horns." (5 words); config cover 0.6 s (inside the cover moment)
3. Safe zone: PASS: SAFE ZONE: ok (step bar, headers, chips, cards, labels and captions inside the safe zone on the 0.5 s scan)
4. No overlap: PASS: OVERLAP: none; art ends at y ~1110, captions from y 1196
5. Motion: PASS: STATIC STRETCH: none (least change 1.1 at 4 s, median 2.6); EMPTY FRAMES: none (least detail 10.0 at 5 s); TEXT FIT: all text inside its box
6. Subtitles: PASS: SUBTITLES: at least 52 px, at most 6 words a line; up to 3 words a chunk at 64 px, spoken words white, key words orange, coming words grey
7. Voice: PASS: PREFLIGHT voice: 294 letters, 6 sentences, about 22.1 s at speed 1 with 1.95 s of breaths (reel 28 s, voice must end by 27.4 s): fits; HOOK PACE: the first sentence has 5 words: ok; PRONUNCIATION: 1 overrides used: 1876 (year); no unchecked words
8. Sound: PASS: the Echoes score, a whoosh into each shot, a tap + click on every piece that pops in (pops copied from the scene's delays), a hit + low drum on each red cross ("horns", "stage"); recorded CC0 samples
9. Payoff: PASS: "Turns out, they came from the stage." over MYTH (horned, red cross) vs REAL (round, green tick), then the frame-0 hero returns with a red cross over its horns and "NOT VIKING" (loop to frame 0)
10. Facts: PASS: the Gjermundbu helmet (Norway, 1943) is the only almost complete Viking-age helmet found and has no horns (History.com; History Hit); the Veksø helmets (Denmark, found 1942) are Bronze Age, about 900 BC, so about 2,900 years old, long before the Viking Age (National Museum of Denmark; Archaeology, AIA 2022); Carl Emil Doepler's costumes for the 1876 Bayreuth Ring had horned helmets and made the look popular (History.com; History Hit). Read through web search summaries (natmus.dk, smithsonianmag.com, britannica.com are outside this session's network allowance)
11. Post data: PASS: captions.json entry (c3, postOn 2026-11-21, postAt 13:00, engine echoes, concept, note, hidden until the render passes); caption line 1 is the myth as people search it, answered, then the 3 steps as a numbered list (save value), the comment ask and the send line; 6 keywords, 5 hashtags; 4 sources (Copy as comment)
12. Review file: PASS: this file, items 1-12 and 14-20 before the one render; COLOUR (pre-render): saturated fill at most 10% at 2 s; over 25%: never; Output QA on the scene's own frames (scripts/qa/look.py, simulated voice): FILL PASS (median 99%, 0% under 80%), ELEMENTS PASS (17 new elements, 9 picture changes, longest quiet 2.1 s), REUSE PASS; GRADE on the local frames at 0.4-0.8 s: 0.28-0.29 (at least 0.2)
13. After the render: PENDING: Showreel render 1 and its Output QA
14. Cuts: PASS: FLOW: cuts 0 (window.TRANSITIONS declares 13 crossfades of 0.3 s)
15. Dead runs: PASS: FLOW: dead runs none
16. Continuity: PASS: FLOW: continuity 100% (median step 1.4, 13 declared transitions)
17. Strobes: PASS: FLOW: strobes 0
18. Element sound (web): n/a (Turns Out; every effect in item 8)
19. Journey: PASS: scenes 14 (the hero with the cover; the card fan "everywhere"; the padlocked timeline "where did the horns come from?"; step 01; the Gjermundbu card; "0 horns on it" with the ghost horns crossed out; step 02; "2,900 years old"; the timeline Bronze Age to Viking Age with the gap arrow; step 03; the flow Wagner opera → costumes → horned look, "the myth is born"; the horned prop under a spotlight; MYTH vs REAL; the hero crossed out); transitions: 13 crossfades, a slow push on every plate
20. Depth and life: PASS: Echoes engine (captions.json "engine": "echoes"), per-shot motion: every plate pushes in 1.00 -> 1.045, the hero's tiles orbit, each piece springs in on its delay, the padlock's shackle rattles, arrows draw, crosses and ticks draw on their words

Owner feedback, line by line (design/owner-feedback.md) against the stills: the reference style (21 Nov): step bar, STEP headers, big word-by-word captions,
flat dark cards, one orange accent, icon tiles, padlock hook; "media downloads waste time" (20 Nov): none; "elements are few" (16 Nov): ELEMENTS PASS;
"cover element in video itself" (16 Nov): frame 0 is the title over the hero; "centered mostly" (15 Nov): full-frame grid and glow (FILL 99%), cards wide;
"use previous voice" (15 Nov): af_heart, speed 1; "too wiggly" (15 Nov): one slow push per plate, pops settle; "colour selection" (13 Nov): one muted glow per
step, saturated fill at most 10%; "a counter rolled past the voice" (12 Nov): the step numbers land on their spoken words; "toy-like sounds" (12 Nov): recorded samples.

Critic: PENDING (an independent session writes CRITIC: READY or NOT READY).
