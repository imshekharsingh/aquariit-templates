# Review: showreel-c3-greek-colour (c3, postOn 2026-11-15 postAt 13:00 IST)

First Turns Out reel on the story engine (PR #874, the default; 22.2 s, its default 20-24 s class). Built 14 Nov evening (learn-then-build:
the evening before at most). Topic from design/topics.md (Sun 15: Greek statues were painted), told as a story instead of a guess: E19 ran its
3 reels 12-14 Nov and the owner's 14 Nov brief asks for "good and smart storytelling". Story: payoff (the painted sphinx in frame 0, "These
white statues were once painted.") -> ONE question ("So why do we picture marble statues pure white?") -> step: weathering over 2,000 years ->
step: traces survive, ultraviolet light shows them -> surprise: "Turns out, one ancient blue still glows in infrared, so cameras can map it."
-> the camera returns to frame 0's view (loop).
Photos (Media runs 43626616719 and 43629461794; previews via scripts/media/from-log.mjs): sphinx = the Met's Archaic marble sphinx finial,
c. 530 BC (CC0, Met Open Access), graded three ways (paint boosted / white / dark infrared look); kore = a close-up of the Lyon kore's hair with
real red paint traces (Mark Landon, CC BY 4.0, credited in the caption). Rejected on the sheets: a marble head seen from the back; an Acropolis
view whose author name came back truncated (could not be credited properly); a sculpture-gallery painting (no allowed licence found).
AUTO lines from `node scripts/channel3/qa.mjs scripts/channel3/greek-colour.json --write`, `node scripts/showreel/preflight.mjs` and
`node scripts/showreel/stills.mjs` (two sheets: the first found the top word plates over the sphinx's head and an empty top word at frame 0;
fixed: the payoff keeps only its line plate, pins land on the paint, the question and surprise views sit lower).

1. Topic: PASS: anyone who has seen a white marble statue feels the surprise in 1 s; not done before on any channel (captions.json); rulebook design/rules-c3.md: rule S pass (payoff picture in frame 0, 6-word payoff, one question, 2 sourced steps, a "Turns out" surprise, one shot per beat with real media, a mood per beat, camera moves, loop), rule 0 pass (two real photos, CC0 and CC BY), rule 1 n/a (story, not a guess reel), rule 2 pass (a marble statue in colour, a state people never picture), rule 3 pass (22.2 s, loops to frame 0's view, 2.6 words/s overall), rule 4 pass (caption line 1 asks a question back, last line asks for one word in the comments and a send), rule 5 pass (5 shots, declared moves, DEPTH 4 planes each), rule 6 pass (each claim in 2 sources, below), rule 7 pass (PRONUNCIATION clean), rule 8 pass (Sun 15, 13:00), rule 9 pass (BUSY ok), rule 10 pass per shot (one mood per beat by rule S; contrast plates; GRADE on the render)
2. Frame 0: PASS: SUBJECT FILL: 66% at frame 0; the sphinx whole and lit, paint on its wing and chest boosted, pins landing on the paint from 0.5 s, the payoff line on its plate under the head; HOOK: clear of the subject (the plate sits over the legs, the head and wing clear)
3. Safe zone: PASS: SAFE ZONE: ok (qa.mjs and stills.mjs)
4. No overlap: PASS: OVERLAP: none; BAND: the caption card sits low on the darkened lower band in every still, the big words over the top band above the sphinx's head (third sheet)
5. Motion: PASS: STATIC STRETCH: none (least change 1.5 at 16 s, median 4.5); EMPTY FRAMES: none; TEXT FIT: all text inside its box; slow pushes on every photo, a light beam sweeping each step, the meander band drawing on
6. Subtitles: PASS: canvas captions 27 px = 54 px in the 1080 frame, at most 6 words a line, QA captions: all 5 sentences on screen, every line shown and finished on the stills
7. Voice: PASS: PREFLIGHT voice: 5 timed sentences, 53 words, voice ends about 20.0 s (reel 22.2 s, must end by 21.6 s), 3.1 words/s while speaking, 2.6 overall: fits; HOOK PACE 6 words ok; SENTENCE PACE fastest 4.3 words/s ok; PRONUNCIATION: 0 overrides used; no unchecked words; speed 1.0
8. Sound: PASS: QA sound: 47 cues (a low move under every camera move, a tick per pin and pop, the big words' landings, a resolve on the surprise); bed ducked under the voice; the render's SOUND GATE and SOUND DETAIL check loudness and audibility
9. Payoff: PASS: the surprise: the sphinx in an infrared-camera dark with "EGYPTIAN BLUE / GLOWS IN INFRARED" and a glowing Greek-key band drawn on (our illustration of the technique, not a map of this statue), then the pull back to frame 0's painted sphinx (loop)
10. Facts: PASS: (a) Greek marble sculpture was painted in bright colours: The Met, Chroma (exhibition and press release, 2022); (b) the paint mostly lost over time, traces survive: The Met, Chroma; (c) ultraviolet imaging used to read the traces: The Met, Chroma press release (the archer reconstruction used ultraviolet imagery); (d) Egyptian blue emits infrared when lit by visible light, so a camera maps it (visible-induced luminescence): Harvard Art Museums, "Exciting Pigments", and Archaeology magazine 2024; the Met sphinx keeps visible paint (Met Open Access, the photo itself); 4 sources in the config; npm run check passes
11. Post data: PASS: captions.json entry (c3, postOn 2026-11-15, postAt 13:00, concept); caption, 6 keywords, 5 hashtags; "media" carries file, author, licence and source_url for both photos (Output QA LICENCE); the CC BY author credited in the caption; design/safety.md read: no living people, no religious figure (a sphinx grave finial and a votive maiden), nothing disputed, nothing controversial (the Parthenon is not named in the reel)
12. Review file: PASS: this file, items 1-11 and 14-20 PASS before the one render; QA: clean
13. After the render: PASS: run 43634908029 green (14 Nov ~21:00 IST; render 1, run 43633253387, failed only Output QA COLOUR: hard hue cuts in the frame's outer ring at 3.0, 6.5 and 21.3 s as each shot opened over the last; fixed with a colour vignette, the outer 8% desaturated, PR #880); -14.0 LUFS, true peak -2.3 dBTP; SOUND DETAIL 34 of 34 audible; voice 53 words in 20.2 s = 2.63 words/s; OUTPUT QA: PASS (LICENCE 2 files, 1 CC BY credited; PACE, STRAY, LOUD, SOUND, COLOUR hard cuts none, EDGES, GRADE cover 0.32, NUMBERS, DEAD none)
14. Cuts: PASS: FLOW: cuts 0 (window.TRANSITIONS declares 5: push, match, pan, zoom-through, and the loop's match)
15. Dead runs: PASS: FLOW: dead runs none (no window.HOLDS)
16. Continuity: PASS: FLOW: continuity 98% (median step 1.4, 5 declared transitions)
17. Strobes: PASS: FLOW: strobes 0
18. Element sound (web): n/a (Turns Out; every element sound in item 8)
19. Journey: PASS: scenes 5 (the painted sphinx; the sphinx white; its worn wing up close; the kore's hair with red traces under a violet lamp; the sphinx under an infrared camera) plus the return to frame 0; transitions: push, match, pan, zoom-through (four kinds; the loop's match is the return)
20. Depth and life: PASS: DEPTH shot1: 4 planes, parallax 125 px, foreground yes; DEPTH shot2: 4 planes, parallax 203 px, foreground yes; DEPTH shot3: 4 planes, parallax 295 px, foreground yes; DEPTH shot4: 4 planes, parallax 356 px, foreground yes; DEPTH shot5: 4 planes, parallax 127 px, foreground yes; no figures; motes, haze and dust per shot, the beams and the meander band with their ticks; BUSY: longest quiet run 1.2 s (4.2-5.4 s); 31 detail beats, 28 seen on the frames (90%): ok

Owner feedback, line by line (design/owner-feedback.md) against the stills: "did not look like Niagara / drawn shapes" (14 Nov): the subject is a
real photographed statue, our drawing is only the pins, beams and meander; "colour selection" (13 Nov): one mood per beat, the subject lit and
clear of the plates, the cover warm against a dark ground; "audio super slowed" (12 Nov): speed 1.0, the question rewritten (not slowed) to pass
SENTENCE PACE; every spoken line shown and finished.
Would I stop and watch twice? Stop: yes, a white-marble sphinx with colour on it is a "wait, what?". Twice: the infrared glow is the save.
Improvement used (design/improvements.md, Turns Out): "One object, one surprise" (setup -> twist -> proof about one thing: the same sphinx in
colour, in white, under infrared) and the exact loop (the last 0.9 s return to frame 0's view).

References used (design/references.md): none new; the story engine's reference kit (design/kits/echoes_kit.zip) techniques via kit25d.js.
