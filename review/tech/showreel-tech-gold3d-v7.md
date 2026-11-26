# showreel-tech-gold3d-v7 · the plan, for the critic BEFORE any render (design/handoff.md task 10)

v7 is the last 3D sample. It is v6 (render 2, critic NOT READY 7.5 / 6 / 6.5) rebuilt to that critic's faults and the owner's task 10 notes.
Scene techkit/scenes/gold3d-v7.html, topic techreel/topics/gold3d-v7.json (same seven voice lines as v6 render 2, so the same real cue times:
apps 3.90, tools 4.47, wires 6.46, twenty 9.05, add 11.65, hub 12.30, eleven 13.50, newt 15.11, same 18.22, final 20.05; reel 22.9 s).
Stills sheet: review/tech/study-25nov/kit-phase2-v7.jpg (scene frames at the real cue times, placeholder voice; no render yet).
Ask of the critic: check this plan and the stills against points 1-7 below; say OK (one render follows) or the exact changes.

## Shot-by-shot plan (times with the real voice)
| Beat | Time | What enters / changes, and how | Camera move, and why | Numbers |
|---|---|---|---|---|
| 1 hook, BIG MOMENT 1 | 0.0-1.4 | the question is on screen from frame 0; Notes slams in from close and above (scale 1.45 to 1, overshoot, a short squash on landing), a warm light sweep crosses its face at 0.3-1.2 | hold, close and low on Notes: the first object is the story; frame 0 already has an object moving at the lens | none |
| 2 | 1.4-3.0 | Chat rises in (1.45), Mail slides and turns in (2.25), quick and clean; Notes idles | pull back: Chat and Mail join, the relationship of the three is the story | none |
| 3 | 3.0-5.2 | the 8 tools enter one after another on "eight tools" (pop, rise, slide; small moves) on a wall that stands on a dark frame | crane up: the wall is where they land | none |
| 4 | 5.2-7.8 | the first cable unrolls from Notes along the floor, runs up the outside of the wall, the plug slides into Pay's side edge, one pulse; Pay and Notes bump once | dolly in, low, onto the plug: the click is the detail | none |
| 5 | 7.8-9.0 | the other 23 cables cascade, each lying on the floor and draping up the wall; every tool bumps when its cable lands | high arc over the floor: the tangle growing is the relationship | none |
| 6 BIG MOMENT 2 | 9.0-11.0 | the tangle at its worst: one light sweep runs along all 24 cables; a warm light crosses the floor | pull back to the whole picture | "3 x 8 / 24 / cables" glides up and counts 0 to 24 on "twenty four", a leader line to the tangle, a small tick when it lands |
| 7 BIG MOMENT 3 | 11.0-12.9 | the hub drops a short way onto its pillar (scale overshoot, lands), a light sweep across its face; apps and tools lean once toward it | truck in, low three-quarter: the hub's arrival is the story | hidden in the close shot |
| 8 | 12.9-13.9 | the 24 cables retract; 11 green cables unroll one after another (apps to hub, hub to tools) | crane up to the high wide: the collapse is the relationship | counts 24 down to 11 on "eleven", "3 + 8", leader to the hub |
| 9 | 13.9-15.1 | the clean picture; everything idles (bob, breathe, small turns); tools bump as their green cable lands | orbit, small | 11 stays, leader to the hub |
| 10 | 15.1-18.2 | the New tile pops in on its pillar beside the hub, its one cable unrolls along the floor, one pulse | truck right to it: the new tool is the story | hidden in the close shot |
| 11 payoff | 18.2-21.2 | all 11 + 1 cables pulse once (about 20.0), the New cable pulses again near the end | pull back to the payoff wide | counts 11 to 12 ("3 + 9"), leader to the New tile, a tick at about 18.9 |
| 12-13 loop | 21.2-22.9 | everything still idles | a small orbit, then dolly in home to the frame-0 framing (close on Notes) | 12 until the close shot |
Move types in order: hold, pull back, crane up, dolly in, arc, pull back, truck in, crane up, orbit, truck, pull back, orbit, dolly in: never the same twice in a row; one push-in onto Notes (at the very end, the loop home).

## Task 10 points, how v7 meets them
1. Cables never pass through the floor or an object: every cable is resampled with each point at least its radius above the floor (W3D.wire floorY), lies on the floor, runs up the outside of the wall and ends in plugs; floor shadows under it. New check techkit/check-wires.cjs: 36 cables, through the floor none, through an object none (apps, tools, hub and pillar, New tile and pillar, wall frame).
2. Numbers: one style (W3D.numbers): flat white, 148 px at 1080 wide, small line above ("3 x 8", "3 + 8", "3 + 9") and below ("cables"), counts (0 to 24, 24 to 11, 11 to 12), glides up as it shows, a hairline leader with a ring at its object. No 3D figures, no pop-ins.
3. Colour and light, measured on v6 (local scene frames at the real cue times, 46 frames below the caption band): luma p5 0.01, median 0.19, p95 0.71 (contrast 0.70); colourful share 16 %; 6 of 12 hue families (max 8); object-vs-ground luma separation 0.28; 8 of 46 frames had a pale floor (median luma over 0.40, the critic's "empty pale frame"). The reference clips (R-ref 26 Nov ids 9-14) cannot be read from this account (no video access); their written notes (design/references.md) say one colour world per reel, light/dark flips only at a section change, numbers that count. The one measured gap is the pale floor, so only the floor changes. Found by test (frame 8.6 s, median luma 0.52): the floor's colour did not matter (a black floor stayed 0.52); at low camera angles the glossy floor caught the key and rim lights. Fix: a matte floor (roughness .6 to .93, metalness .15 to 0, reflections .25 to .1), a darker floor colour, the light pool .32 to .1 and no additive stage glow; the same frame is 0.25. Grading, key, rim and palette stay. The cascade and the big-moment sweep along the cables are soft pulses without beads (only the first cable's pulse carries a bead), so 23 cables lighting at once do not bloom. v7 numbers: see "Local checks" below. A main-account measurement of the reference clips against v6 would settle whether more is needed.
4. Camera: a reason per move (table), no move type twice in a row, one push-in onto one object, foreground and background used (tiles in the foreground of the hub and New shots, the wall frame and props behind).
5. Three big moments only (Notes 0-1.4 s, the tangle 9.0-11.0 s, the hub 11.0-12.9 s) with scale, overshoot and a light sweep; every other entrance is quick and small (0.45-0.5 s, small travel).
6. Hook and life: frame 0 = the question + Notes arriving; all apps in by about 3 s; nothing pre-set (no finished tangle and rewind any more). Once in, every tile idles (a bob or a breath and a small turn), bumps when its cable lands, leans once when the hub lands; the hub floats a little on its pillar.
7. v6 faults: no empty frame (Notes from frame 0, darker floor); the hub is opaque from its first frame, one "HUB" label (no fade; a short drop so the frame blend cannot double it); no straight stiff cables (they lie on the floor and drape); the ending changes at least every 2 s (12 lands about 18.9, cable pulse about 20.0, orbit from about 21.2, dolly home, New pulse about 21.6).

## Reference patterns used (critic fix 5; design/references.md R-ref 26 Nov)
- "numbers count, never sit" (refs 9 and 11): the 24, 11 and 12 count on their words (9.0-9.4, 13.1-13.8, 18.0-18.6 s).
- "one persistent object that evolves" (refs 10 and 12): the wall of tools and its cables from the first plug (5.2 s) to the payoff (18.2 s).

## Local checks (scene frames, not the render)
- techkit/check-wires.cjs: no cable through the floor or an object.
- techkit/check-gold3d.cjs: no name under a number or the hub on the wides; the close shots crop neighbouring tiles at the frame edge by design.
- The whole reel at 10 fps with the real cue times (scene frames, not the render): COLOUR pass, no hard colour cuts; GLOW pass, median 1.2 % (v6 render 2: 2.0 %, v5 4.0 %), worst 1 s 6.3 % at 8.4 s (limit 8 %); pale frames (median luma over .40) 21 of 228 (9 %; v6 17 %), almost all the close-ups where a pastel tile fills the frame (0-1.5 s Notes, 12.4-13.1 s Mail), not the floor; median luma .18.
- Frame change: median 8.7 per 0.1 s; the last 4 s median 2.2 (calmer, with the 12 tick, a cable pulse, the orbit and the dolly home). For the critic to judge: is the end lively enough, or should the orbit be larger?

(No verdict line here: the builder never writes one. The critic adds its own.)
