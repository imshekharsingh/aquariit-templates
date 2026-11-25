# Colour world test scene (25 Nov 2026, never posted)
Scene techkit/scenes/sample-colour-world.html, topic techreel/topics/colour-world-sample.json, captions.json "showreel-tech-colour-world-sample" (sample + hidden).
Own words: "Three apps, eight tools. Connect each pair by hand, and that is twenty four integrations. Add one shared standard, and it drops to eleven."
Stills self-check against the reference description (owner chat's study; the reference frames themselves were not available in this session):
- one continuous world, camera travelling through it (5 framings in ~11 s): MATCH. Dark floor grid, glossy blocks, glowing amber then green cables, 8 colourful tiles: MATCH.
- real artifact (JSON request card) readable at phone size: MATCH. Idea as picture (3 x 8 = 24 as a cable tangle, then 11): MATCH.
- captions word by word near the top, grey spoken / white current word, key word in a thin blue box with square handles: MATCH (size 60 px).
- real logos: NOT DONE, no licensed file at hand; tiles carry generic names (Mail, Files, Chat...) and hand-drawn glyphs.
- gaps: no depth of field (only foreground bokeh), no server racks, frame 0 is sparse (clients only, the voice starts at 0.6 s).
Fixes made after the first sheet: washed-out pastel blocks and the white wall plate (lower exposure, darker materials), cameras too close in shots 1, 2 and 4, wrong key word in line 3.
stills-sheet.png = 8 local stills (draft quality); grid.png = 8 frames of the final MP4.

## Preview render (one render, 25 Nov 2026, Tech reel run, preview r1; 11.5 s, 1080x1920)
grid.png = 8 frames of that MP4 (0.1, 1.6, 3.5, 5.5, 7.0, 8.0, 9.8, 11.2 s). Study file in R2: /reels/study/showreel-tech-colour-world-sample-r1-preview.mp4 (plus -stills.png).
Output QA: FAIL on two checks, both calibrated to the OLD grey look: COLOUR (saturated fill 33% at 2.0 s, over 25% for 5.0-7.0 s, a hard background colour cut at 6.3 s) and LOOK vs gold (bright 0.271 vs 0.154, background 0.213 vs 0.076, dark 38% vs 51%). DEAD, SHEEN passed (visual change in 98% of steps). If the colour look is adopted, scripts/qa COLOUR limits and gold.json LOOK need a colour-world baseline (this reel could become it).
Weak spots seen in the MP4: cables over the card at 7.0 s read as a smear; the Assistant block sits over the "3 + 8 = 11" number at 9.8 s; frame 0 is sparse; no depth of field.
