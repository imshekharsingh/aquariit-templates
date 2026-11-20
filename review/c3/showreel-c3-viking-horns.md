# Review: showreel-c3-viking-horns (c3, postOn 2026-11-21 postAt 13:00 IST)

Turns Out restart, myth Nº 1 (design/c3-plan.md, E30 c3-myth). Built 20-21 Nov night on the owner's go ("give me one to upload today with the best
work of yours"). The owner then ruled out media downloads ("highly time consuming and waste of resource"): the Media run was cancelled and the reel is
drawn in code: a new Echoes shot kind `sketch` (scripts/echoes/engine.html: engraved full-frame plates, lines that draw on in ~0.5 s, fills after,
a slow push, a red cross that lands on its word; heard in scripts/echoes/sound.py: pen strokes, a soft thud, a hit and a low drum on the cross).
Echoes engine otherwise unchanged (captions, cover moment, badge, chapters, film finish, af_heart at speed 1). 5 lines, 12 shots, ~19 s.
AUTO lines from `node scripts/showreel/preflight.mjs`, `node scripts/showreel/stills.mjs` (sheet, 11 frames), `node scripts/echoes/flow.mjs`,
`node scripts/echoes/colour.mjs` and `node scripts/qa/frames.mjs` + `python3 scripts/qa/look.py` on scripts/channel3/viking-horns.json.

1. Topic: PASS: rules-c3.md R1: a myth nearly everyone holds (the horned Viking) about something known on every continent; the truth is in 2+ reliable sources and no expert body disputes it (only how the myth spread is debated, so the voice says the look "took off" in 1876, not that it was invented then); code-drawn, so no photo needed; not on the never-list (no religion: the Veksø helmets' ritual use is left out; no living people; Wagner is named only as the opera's composer)
2. Frame 0: PASS: SUBJECT FILL: 86% at frame 0; the drawn horned Viking (no face, a silhouette with helmet, shield and spear) fully drawn at frame 0 (`drawn: true`) with the cover moment "TURNS OUT / Vikings Never Wore These" inside the centre 3:4; voice from 0.0 s: "Vikings never wore horned helmets." (5 words)
3. Safe zone: PASS: SAFE ZONE: ok (every stamp, label, counter and plinth inside the safe zone on the 0.5 s scan)
4. No overlap: PASS: OVERLAP: none; BAND: art and labels end at y ~1230, captions from y 1300
5. Motion: PASS: STATIC STRETCH: none (least change 0.4 at 20 s, after the voice; median 4.1); EMPTY FRAMES: none (least detail 21.8 at 9 s); TEXT FIT: all text inside its box
6. Subtitles: PASS: SUBTITLES: at least 52 px, at most 6 words a line; every line shown and finished on the stills, key words gold
7. Voice: PASS: PREFLIGHT voice: 272 letters, 5 sentences, about 20.3 s at speed 1 with 1.65 s of breaths (reel 25 s, voice must end by 24.4 s): fits; HOOK PACE: the first sentence has 5 words: ok; PRONUNCIATION: 1 overrides used: 1876 (year); no unchecked words
8. Sound: PASS: the Echoes score and effects (whoosh into each shot, typewriter keys under each stamp) plus the sketch's pen strokes while lines draw, a soft thud as it fills, a hit + snap + low drum on each red cross (3: "helmets", "horns", "Vikings"), counter ticks and a hit on "2,900"; recorded CC0 samples (scripts/showreel/samples.py)
9. Payoff: PASS: "Turns out, the horns came from the opera stage, not the Vikings." over a horned prop helmet under a stage spotlight ("A STAGE PROP"), then the frame-0 Viking returns and a red cross lands on his horns on "Vikings" (the loop to frame 0)
10. Facts: PASS: the Gjermundbu helmet (Norway, found 1943) is the only almost complete Viking-age helmet found and has no horns (History.com; History Hit); the Veksø helmets (Denmark, found 1942) are Bronze Age, about 900 BC, so about 2,900 years old, long before the Viking Age (National Museum of Denmark; Archaeology, AIA 2022: deposited ~900 BC, some 1,500 years before the Vikings); Carl Emil Doepler's costumes for the 1876 Bayreuth Ring had horned helmets and made the look popular (History.com; History Hit; Wikipedia's Doepler entry agrees). Read through web search summaries: natmus.dk, smithsonianmag.com and britannica.com are outside this session's network allowance. Caption keeps the cautious wording ("spread after 1876")
11. Post data: PASS: captions.json entry (c3, postOn 2026-11-21, postAt 13:00, engine echoes, concept, note, hidden until the render passes); caption line 1 is the myth as people search it, answered; the facts; the comment ask and the send line; 6 keywords, 5 hashtags; 4 sources in the config (Copy as comment); illustrations credited as drawn in code
12. Review file: PASS: this file, items 1-12 and 14-20 before the one render; COLOUR (pre-render): saturated fill at most 7% at 8.5 s; over 25%: never; Output QA on the scene's own frames (scripts/qa/look.py, simulated voice): FILL PASS (median 98%, 5% under 80%), ELEMENTS PASS (13 new elements, 9 picture changes, longest quiet 2.5 s, 5+ pictures per 10 s), REUSE PASS
13. After the render: PENDING: render 1 (Showreel run 44793013154) failed Output QA GRADE only (cover 1.6 s: subject vs its surroundings 0.01: the config's qa.subject box was the old photo reel's, and the close-up's dark dome sat on a mid-red plate); every other check PASS (PACE 2.72 words/s, SOUND recorded CC0, LOUD -14.0 LUFS, COLOUR, EDGES, NUMBERS, DEAD, FILL 98%, ELEMENTS, REUSE, COVER 4 of 4 words, STRAY; LICENCE WARN only: no media by the owner's call). Fixed: the close-up's dome lit bronze, qa.subject on the dome; local frames at 1.3-2.1 s: 0.30-0.45 (at least 0.2). Render 2 (the last allowed) pending
14. Cuts: PASS: FLOW: cuts 0 (window.TRANSITIONS declares 11 crossfades of 0.7 s)
15. Dead runs: PASS: FLOW: dead runs none
16. Continuity: PASS: FLOW: continuity 100% (median step 2.1, 11 declared transitions)
17. Strobes: PASS: FLOW: strobes 0
18. Element sound (web): n/a (Turns Out; every effect in item 8)
19. Journey: PASS: scenes 12 (the horned Viking with the cover; the horned helmet crossed out; a longship, "the Viking age"; the Gjermundbu helmet with its ghost horns crossed out; the two Veksø helmets on plinths; the timeline Bronze Age to Viking Age with the 2,900-year counter; the gap arrow "long before"; the Bayreuth festival theatre, 1876; a costume design sheet; the opera stage with a singer in a horned helmet; a horned stage prop under a spotlight; back to the Viking, crossed out); transitions: 11 crossfades with a slow push on every plate
20. Depth and life: PASS: Echoes engine (captions.json "engine": "echoes"), film finish and per-shot motion: every sketch plate pushes in 1.00 -> 1.07 and drifts 14 px while its engraved background moves at 0.4x (parallax); lines draw on and fills arrive on each plate; motes and grain from the engine

Owner feedback, line by line (design/owner-feedback.md) against the stills: "media downloads waste time" (20 Nov): none used; "elements are few and are
spread" (16 Nov): a new element every ~1.5-2.5 s (ELEMENTS PASS); "cover element in video itself" (16 Nov): frame 0 is the title over the Viking;
"make it more available on the screen" (15 Nov): every plate full-frame (FILL 98%); "use previous voice" (15 Nov): af_heart, speed 1; "too wiggly" (15 Nov):
one slow push per plate; "did not look like Niagara / drawn shapes" (14 Nov): risk noted: this reel IS drawn, so it is drawn as clear engraved
illustration (bold line art, no fake realism) and the subjects are simple objects (helmets, a ship, a building, a stage), not a landscape that has to look
real; "colour selection" (13 Nov): one calm plate colour per beat, saturated fill at most 7%; "the answer stays hidden until it is said" (12 Nov): each
red cross lands on its word; "a counter rolled past the voice" (12 Nov): the counter lands on "2,900" and never shows more; "toy-like sounds" (12 Nov):
recorded CC0 samples; "audio super slowed" (12 Nov): speed 1.0.

Critic: PENDING (an independent session writes CRITIC: READY or NOT READY; the owner asked for this reel tonight, so the owner may post on render 1's Output QA).
