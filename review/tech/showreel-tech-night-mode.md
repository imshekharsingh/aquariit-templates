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
7. Voice: PASS: PREFLIGHT voice: 486 letters, about 38.5 s at speed 1.05 (limit 43.0): fits; PRONUNCIATION: 2 overrides used: photo, align; no unchecked words; Kokoro af_heart (the kit's voice), gap 0.45 s
8. Sound: PASS: the kit's sound design (techkit/sound.py): A-minor bed, heartbeat kick under THE PROBLEM, groove from THE FIX, whoosh into every chapter, risers into THE FIX and the title; 31 cue effects (3 thuds on grainy / dark / blurry, 15 shutter clicks on the burst, 15 fill blips, chimes on fifteen, five, brighten, adds; snap on align; zaps on random; pops on the recap); recorded CC0 samples where they exist, detail bus + SOUND DETAIL and SOUND GATE in qa.txt (the run fails without them)
9. Payoff: PASS: the clean bright city returns on "brightens" and holds under the recap pills; ends on "That's Night mode." with SAVE THIS · SHARE IT, no sign-off
10. Facts: PASS: Google Research "Night Sight: Seeing in the Dark on Pixel Phones" (14 Nov 2018, read 15 Nov 2026): "up to 15 if it is handheld", "333ms x 15 frames = 5.0 seconds of capture", aligning and merging, merging reduces shot noise, hold still; Google Research astrophotography post (at most 15 frames); Apple Support 102519 (quick or several seconds, depending on the dark); on screen: 15 frames, ⅓ s, 5 s, all said; npm run check passes
11. Post data: PASS: captions.json entry (channel tech, postOn 2026-11-15, postAt 13:00, concept, experiment tech-kit-engine); topic post block: caption with the numbers, the tip and both sources, 6 keywords, 5 hashtags, 3 sources
12. Review file: PASS: this file, items 1-11 and 14-17
13. After the render: PENDING
14. Cuts: PASS: FLOW: cuts 0 (10 declared: 6 chapter camera moves, 3 jolts on grainy / dark / blurry, the title slam)
15. Dead runs: PASS: FLOW: dead runs none
16. Continuity: PASS: FLOW: continuity 92% (median step 1.2, 10 declared transitions)
17. Strobes: PASS: FLOW: strobes 0

Stills vs the kit's reference (honest read, before the render): the same architecture and density as the kit's CDN output (progress bar,
eyebrow + gradient title, a coloured chip per chapter, one glass panel per chapter with live bars / dots / a lit step flow, cue-timed status
pills on the hero, kinetic captions with key words lit). First sheet failed my own read: the grain covered the city (TV static in chapters
2-3) and the loupe pattern read as a digit 8; fixed (grain at 42% strength, four window panes), second sheet clean. Hero is a drawn
night city instead of the kit's globe; the burst grid and the loupes are less layered than the globe's arcs and packets, which is the one
place it sits below the reference.

Local Output QA pre-check on 89 full-size frames every 0.5 s: saturated fill worst 2% (limit 25%), no content on the outer 2% border.
Critic: no different session has watched this reel yet; CRITIC: READY is not written by the builder.
