# Review: showreel-c3-stonehenge-stones (c3, postOn 2026-11-18 postAt 18:00 IST)

Turns Out, Wed 18 Nov (topic from design/topics.md, Wed 18 row: Stonehenge's bluestones). Built late on the day from the Owner chat task: the
09:11 IST run did not start (usage limit). First set for 14:00 IST, moved to 18:00 at 12:51 IST because Wikimedia refused 10 of the 12 photo
downloads (HTTP 429 to every GitHub runner at the default 3840 px rendition; Media runs 44244582093 and 44248220283 hit the 30-minute limit).
Fixed in scripts/media/fetch.py: a Wikimedia search may ask for a smaller cached rendition ("width"), and at 1280 px the files arrived.
Echoes engine, 2.5D depth on every photo, af_heart at speed 1, 6 lines, 17 shots: 10 real photos and prints (each used once), 3 coasts-only maps of
Britain (new in scripts/echoes/engine.html: "map": "britain" on a journey card; no borders, design/safety.md 16), 2 typed cards, 1 paper card,
1 counter card. The guess: frame 0 says only "Stonehenge's smaller stones aren't local."; the line "So where were they from?" lets the
viewer guess; nothing names or shows Wales (no map pin, no hill photo, no label) before the voice says "Preseli Hills in Wales" (~11 s on the
simulated voice). Media runs used: 44248211949, 44248216029, 44253965958, 44255163979, 44256764197, 44257691291, 44257896048, 44257961006.
AUTO lines from `node scripts/showreel/preflight.mjs`, `node scripts/showreel/stills.mjs` (one sheet, 12 frames), `node scripts/echoes/flow.mjs`,
`node scripts/echoes/colour.mjs` and `node scripts/qa/frames.mjs` + `python3 scripts/qa/look.py` on scripts/channel3/stonehenge-stones.json.

1. Topic: PASS: anyone knows Stonehenge in 1 s and few know its smaller stones were dragged from west Wales and its Altar Stone from northeast Scotland; rulebook design/rules-c3.md: rule S as adjusted for the Echoes engine (payoff "Stonehenge's smaller stones aren't local." over the circle in frame 0, 5 words; ONE question "So where were they from?"; each line one sourced fact; "Turns out" last over Stonehenge at sunset, then an old print of the stones), rule 0 pass (10 real photos and prints, PD / CC0 / CC BY), rule 6 pass (two sources per claim, item 10), rule 7 pass (no "check:" words), rule 11 pass (ELEMENTS and REUSE below); rules 1 and 4 (E19 guess chips) n/a: E19 was dropped 18 Nov, the answer is still kept hidden until said
2. Frame 0: PASS: SUBJECT FILL: 80% at frame 0; the cover moment "TURNS OUT / The Stones That Travelled" on a dark plate over the stone circle (Arian Zwegers, CC BY 2.0), inside the centre 3:4; the title does not give the answer; the payoff line in the captions from frame 0; camera widened after the stills so more of the circle shows
3. Safe zone: PASS: SAFE ZONE: ok (every text box, tag, map label and card inside the safe zone on the 0.5 s scan)
4. No overlap: PASS: OVERLAP: none; BAND: clear (tags end at y 1100 or above, the map's lowest label at ~1196, captions from y 1300)
5. Motion: PASS: STATIC STRETCH: none (least change 0.6 at 38 s, after the voice; median 9.9); EMPTY FRAMES: none (least detail 17.9 at 19.5 s, the counter card); TEXT FIT: all text inside its box
6. Subtitles: PASS: SUBTITLES: at least 52 px, at most 6 words a line; every line shown and finished on the stills, the key words gold
7. Voice: PASS: PREFLIGHT voice: 521 letters, 7 sentences, about 37.9 s at speed 1 with 2.30 s of breaths (reel 42 s, voice must end by 41.4 s): fits; HOOK PACE: the first sentence has 5 words: ok; PRONUNCIATION: 2 overrides used: kilometres, 2024 (year); no unchecked words; af_heart at speed 1.0
8. Sound: PASS: the Echoes engine's score and effects (whoosh into each shot, typewriter keys under each stamp and typed card, thud as each 2.5D cut-out comes forward, ticks along each map route and a tap on arrival, tap and click on each label, ticks under the counter); the effects play the recorded CC0 samples (render log SOUND SOURCE; checked after the render in item 13)
9. Payoff: PASS: "Turns out, Stonehenge was built from stones gathered across Britain, and nobody knows exactly how they got there." over Stonehenge at sunset, then both routes on the map of Britain (Preseli Hills and northeast Scotland to Stonehenge), then an 1860s print of the stones, "STILL A MYSTERY"
10. Facts: PASS: sarsens from nearby (West Woods, ~25 km: English Heritage "Building Stonehenge"; Nash et al. 2020 via English Heritage); bluestones traced to the Preseli Hills, west Wales, over 200 km / 125 miles (English Heritage; UCL 2019 on Parker Pearson et al., Antiquity; Phys.org/UCL 2015: 140 miles / 225 km; Archaeology magazine ~250 km straight line, so "over 200 km, 125 miles" holds for every source); quarries at Craig Rhos-y-felin and Carn Goedog, pillars prised loose, ~3400-3000 BC = over 5,000 years ago (UCL 2019; Popular Archaeology); left out: the stone wedges (a 2023 critique disputes them); Altar Stone from northeast Scotland (Orcadian Basin), ~750 km / 460 miles (UCL 2024 on Clarke et al., Nature 632; Al Jazeera 2024); how the stones were moved is unknown (English Heritage; UCL 2024); every source in the config's "sources"
11. Post data: PASS: captions.json entry (c3, postOn 2026-11-18, postAt 18:00 with slotNote and noReminder, engine echoes, concept, note); caption opens with the guess question and ends with a send, 6 keywords, 5 hashtags, images and sources line with every CC BY author; "media" carries file, author, licence and source_url for the 10 images used (Output QA LICENCE); design/safety.md read: no living person identifiable (a hooded visitor seen from behind is out of frame; two 1860s men in the old print, tiny, died 50+ years ago), no religion, no borders on the map, Wales and Scotland named as places only
12. Review file: PASS: this file, items 1-11 and 14-20 PASS before the render; COLOUR (pre-render): saturated fill at most 6% at 17 s; over 25%: never; Output QA on the scene's own frames (scripts/qa/look.py, simulated voice): FILL PASS (median 90%, 22% of samples under 80%), ELEMENTS PASS (33 new elements, 9.8 per 10 s, 15 picture changes, longest gap 2.2 s, at least 4 pictures per 10 s), REUSE PASS (10 photos over 10 photo shots, none twice)
13. After the render: PENDING
14. Cuts: PASS: FLOW: cuts 0 (window.TRANSITIONS declares 16 crossfades of 0.7 s, the engine's shot change)
15. Dead runs: PASS: FLOW: dead runs none
16. Continuity: PASS: FLOW: continuity 100% (median step 3.0, 16 declared transitions)
17. Strobes: PASS: FLOW: strobes 0
18. Element sound (web): n/a (Turns Out; every effect in item 8)
19. Journey: PASS: scenes 17 (the circle with the cover title; the sarsen trilithons; Constable's Stonehenge at sunset, "from nearby hills"; inside the circle, "no local match"; the 1890s photochrom, "so where from?"; the bluestone sample card; the Preseli Hills, "west Wales"; the map, Wales to Stonehenge, 200 km / 125 miles; Craig Rhos-y-felin's rock face; the counter, over 5,000 years ago; the 2024 study card; the trilithon beside the Altar Stone; the 2024 paper; the map, Scotland to Stonehenge, 750 km; Stonehenge at sunset; the map across Britain; the 1860s print, "still a mystery"); transitions: 16 declared crossfades with a camera push or pan in every shot
20. Depth and life: PASS: Echoes engine with 2.5D depth: every photo on three planes (far blurred and dimmed, mid cut-out sharp coming forward 1.05 -> 1.13 and panning 1.4x the far plane, near motes 2.5x) under a slow push or pan per shot; bright skies deepened with grade "contrast(1.3) brightness(.85)"; film grain, dust and corner light kept; the map routes draw on their words with a stone travelling along them

Owner feedback, line by line (design/owner-feedback.md) against the stills: "keep the guess answer hidden" (task, 18 Nov): no Wales, Preseli or
map pin before the word; "elements are few and are spread" (16 Nov): a new element every 1-2.5 s, 10 photos each used once; "cover element in
video itself" (16 Nov): frame 0 is the title over the circle; "make it more available on the screen" and "use previous voice" (15 Nov): photos
full-frame in 2.5D, af_heart; "too wiggly" (15 Nov): one slow move per shot; "did not look like Niagara / drawn shapes" (14 Nov): real photos are
the subject of 10 shots, the maps and cards are clearly drawn; "colour selection" / calm low saturation (13 Nov): saturated fill at most 6%;
"the voice names an item while its card is still empty" (13 Nov): every shot opens 0.25 s before its word; "a counter rolled through 8 before
seven" (12 Nov): the 5,000 counter shows one fixed number, on "over 5,000"; "toy-like sounds" (12 Nov): recorded CC0 samples; "audio super
slowed" (12 Nov): speed 1.0.

Critic: today's 11:17 IST Reel critic ran before this reel existed; item 20's CRITIC line is for the next critic pass or the owner.
