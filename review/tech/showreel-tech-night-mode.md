# Review: showreel-tech-night-mode (tech, postOn 2026-11-15 postAt 13:00 IST)

The Mandatory Gate, design/mandatory.md. Replaces showreel-tech-charger-watts (hidden; the owner on 14 Nov: "your topics are not content-rich
nor the animation itself"). First reel on the new engine techkit/ (the owner's motion kit ported as it is: one HTML scene with a pure
window.render(t), cues W(scene, "word", n), the 7-beat arc, a chip + panel per chapter, the kit's sound design). AUTO lines from
`python3 techkit/make.py night-mode --fake-vo --stills ...` (fake timings at 3 words/s; the render re-times everything to the real voice),
stills sheet at 12 chapter moments next to the kit's own CDN scene rendered at 8 moments, 15 Nov ~09:00 IST.

1. Topic: PASS: how phone Night mode works, a real mechanism shown as steps (burst, align, merge, brighten) that every phone buyer meets ("hold still"); never done on any channel (techreel/topics, scripts/explainer, channel3 checked). rules-tech.md F1 pass (specs decoded, phone camera; yesterday earbuds), F2 pass (global), F3 pass (Google Pixel and iPhone named as text, each at its strength, no comparison, no logos, drawn city only), F4 pass (verdict said and shown: hold still, the recap), S1 pass (frame 0 = the payoff split: one quick shot vs Night mode), S2 pass (question, problem, fix, 2 sourced steps, the why, recap), S6 pass (43-44 s, 118 words), R0 adjusted: no photos (the kit's look is drawn; owner: "a gate that blocks the kit's look is adjusted"), LICENCE WARN expected
2. Frame 0: PASS: the night-city photo split down the middle (left: one quick shot, dark and grainy, ✕ label; right: Night mode, bright and clean, ✓ label), the divider sliding, HOLD STILL panel and header up; readable in under 1 s
3. Safe zone: PASS: SAFE ZONE: ok (every DOM text and every canvas label reported in window.__boxes, every 0.5 s; the kit's header moved from y 150 to y 250 and the panels narrowed to x 84-956 to fit)
4. No overlap: PASS: OVERLAP: none
5. Motion: PASS: something always moves (divider, photons, shutter pings, thumbnails flying, time bar, stack converging, loupe grain changing every frame, orbiting light on the title, blobs, grain, camera move every chapter); FLOW continuity 92%
6. Subtitles: PASS: SUBTITLES: at least 52 px, at most 6 words a line (66 px, kit chunks of 3 words or to the punctuation); CAPTIONS: 51 chunks, every spoken word shown (the last line shown as the title slam)
7. Voice: PASS: PREFLIGHT voice: 486 letters, about 40.4 s at speed 1.00 (limit 43.5): fits; PRONUNCIATION: 2 overrides used: photo, align; no unchecked words; Kokoro af_heart (the kit's voice), gap 0.45 s
8. Sound: PASS: the kit's sound design (techkit/sound.py): A-minor bed, heartbeat kick under THE PROBLEM, groove from THE FIX, whoosh into every chapter, risers into THE FIX and the title; 31 cue effects (3 thuds on grainy / dark / blurry, 15 shutter clicks on the burst, 15 fill blips, chimes on fifteen, five, brighten, adds; snap on align; zaps on random; pops on the recap); recorded CC0 samples where they exist, detail bus + SOUND DETAIL and SOUND GATE in qa.txt (the run fails without them)
9. Payoff: PASS: the clean bright city returns on "brightens" and holds under the recap pills; ends on "That's Night mode." with SAVE THIS · SHARE IT, no sign-off
10. Facts: PASS: Google Research "Night Sight: Seeing in the Dark on Pixel Phones" (14 Nov 2018, read 15 Nov 2026): "up to 15 if it is handheld", "333ms x 15 frames = 5.0 seconds of capture", aligning and merging, merging reduces shot noise, hold still; Google Research astrophotography post (at most 15 frames); Apple Support 102519 (quick or several seconds, depending on the dark); on screen: 15 frames, ⅓ s, 5 s, all said; npm run check passes
11. Post data: PASS: captions.json entry (channel tech, postOn 2026-11-15, postAt 13:00, concept, experiment tech-kit-engine); topic post block: caption with the numbers, the tip and both sources, 6 keywords, 5 hashtags, 3 sources
12. Review file: PASS: this file, items 1-11 and 14-17
13. After the render: PASS: render 3 run 43687198252 green (15 Nov 12:32 IST), OUTPUT QA: PASS (PACE, STRAY, LOUD, SOUND, COLOUR, EDGES, NUMBERS 15 and 5 with no contradiction, DEAD; LICENCE WARN: drawn, no media). History: render 1 (run 43672326170, 41.9 s) Output QA FAIL on PACE ("In the dark, the sensor catches only a few specks of light." 4.88 words/s at speed 1.05) and NUMBERS (a "2" read on screen at 8.7 s near the spoken "one"); LOUD -14.5 LUFS / -2.2 dBTP, SOUND recorded CC0 + DETAIL 66 of 66, COLOUR 2%, EDGES, DEAD, STRAY PASS. Fixed: natural speed 1.0, a pause after "In the dark...", the word "one" removed ("a night photo", "a quick shot", "a single photo"), so the voice says only fifteen and five; render 2 (run 43685018163, 43.2 s) NUMBERS PASS, LOUD -14.6 LUFS, SOUND, EDGES, DEAD, STRAY PASS, but PACE FAIL ("for a few seconds, just to take a night photo?" 4.55 words/s) and COLOUR FAIL (the red edge flash on "grainy" read as a hard background hue cut at 10.1 s); fixed: a pause after "seconds...", the red edge flash removed (shake and thud kept)
14. Cuts: PASS: FLOW: cuts 0 (10 declared: 6 chapter camera moves, 3 jolts on grainy / dark / blurry, the title slam)
15. Dead runs: PASS: FLOW: dead runs none
16. Continuity: PASS: FLOW: continuity 92% (median step 1.2, 10 declared transitions)
17. Strobes: PASS: FLOW: strobes 0

Stills vs the kit's reference (honest read, before the render): the same architecture and density as the kit's CDN output (progress bar,
eyebrow + gradient title, a coloured chip per chapter, one glass panel per chapter with live bars / dots / a lit step flow, cue-timed status
pills on the hero, kinetic captions with key words lit). First sheet failed my own read: the grain covered the city (TV static in chapters
2-3) and the loupe pattern read as a digit 8; fixed (grain at 42% strength, four window panes), second sheet clean. Hero is a drawn
night city instead of the kit's globe. Third sheet (detail pass, after the owner's "match the kit's level of detail before the one render"):
the burst and loupes were thinner than the globe's arcs and packets, so they gained the kit's layering: a lens iris snapping once per
frame with light trails flying to each slot, light packets travelling from every frame into its time-bar segment and flowing on along it,
sensor cells lighting where photons land, grain shedding off the photo on "merges", dashed callouts from the lit tower to both loupes and
stacked frame rings behind the merged one. Two defects found and fixed on that sheet (the sum pill showed empty before "fifteen"; the merged
photo sat near-black for 2 s before "brightens"). Now level with the reference's detail.

Local Output QA pre-check on 89 full-size frames every 0.5 s: saturated fill worst 2% (limit 25%), no content on the outer 2% border.
Critic: no different session has watched this reel yet; CRITIC: READY is not written by the builder.
