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
Move types in order (after render 1): hold, pull back, crane up (the apps sink slowly out of the frame), dolly in to the wall, truck down to the plug, arc, pull back, truck in, crane up, orbit, truck, pull back, arc, dolly in home: never the same twice in a row. Render 1 showed a hard colour cut at 4.4 s (the apps left the frame bottom in one step while tiles popped in at the edge); render 2 splits that crane into a rise and a push, lands on the wall before the first tool pops, and hides two colourful background props that sat on the frame edge there.

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

## Plan critic (main account, 26 Nov)
Judged: the shot-by-shot plan above, the stills sheet review/tech/study-25nov/kit-phase2-v7.jpg (14 scene frames at the real cue times), the v6 verdict, task 10 points 1-7, critic questions 47-52 and the owner's 26 Nov notes. No render, no scene edits.
Colour measured from this account on the real MP4s (2 fps, below the caption band): v6 render 2 luma p5 .01, median .20, p95 .73, colourful 18 %, 6 of 46 frames pale (median over .40); the tech gold showreel-tech-ai-memory p5 .03, median .10, p95 .63, colourful 4 %, 0 pale frames. The reference clips 9-14 are closed (videos deleted), so the written notes stand in for them. v6 render 2 matches the builder's local numbers, so the builder's measurement is sound: the one gap against our best reel is pale frames, and the floor fix is the right change. No grading or key/rim change is needed. Pale close-ups that are left (0-1.5 s Notes, 12.4-13.1 s Mail) are dealt with in change 1.

Point by point:
1. Cables, no clipping: OK. The 7.2 s and 8.4 s stills show cables lying on the floor and draping up the wall with plugs; check-wires.cjs covers all 36. Keep it in the render's QA.
2. Numbers: OK on style: flat, white, one size, small line above and below, counting, readable in half a second at 9.8, 14.0, 18.9 and 21.6 s. CHANGE on leaders: at 18.9 s and 21.6 s the leader from "12" to the New tile cuts across the Chat and Mail tiles. On the 9.8 s still the leader to the tangle cannot be seen at all (change 5).
3. Colour and light: OK (see the measurement above).
4. Camera: OK on the list (a reason for each move, no type twice in a row, one push-in onto Notes). CHANGE where the stills do not deliver the move's reason: beat 2 is meant to pull back but still crops Notes and Mail (change 2); beat 3 wastes the frame (change 3); beat 10 is meant to be about New but the hub fills it (change 6).
5. Drama on 3 moments: OK in the plan. CHANGE on moment 2: at 9.8 s the "tangle at its worst" reads as tidy rainbow arches either side of the wall, using the middle third of the frame. It does not look like a tangle (change 4).
6. Hook and life: CHANGE. Frame 0.3 s is a cropped, out-of-focus cyan slab with no readable name or icon, and it is a pale frame. A first second that cannot be read is not tension (change 1). "All apps in by ~4 s" OK (by ~3 s); nothing pre-set OK; idle motion cannot be judged from stills, so the render critic will check it.
7. v6 faults: empty frame OK (Notes from frame 0, darker floor); doubled HUB label OK (12.2 and 12.7 s: one opaque label); stiff cables OK (7.2-8.4 s drape). CHANGE on the still ending: the 18.9 s and 21.6 s stills have the same framing, and the builder's own last-4 s frame change is a median of 2.2. That is below v6's near-still end that failed (2-10). To the builder's question: no, it is not lively enough (change 7).
Questions 48-52: own entrance per object yes (slam, rise, slide-turn, pops, drop, pop-in); each connection its own beat yes; wires would pass as real on 7.2/8.4 s yes; over-glow none visible, GLOW 1.2 % median locally; references named with times yes (counting numbers, one evolving object). Q47: captions are clear of the objects in every still; the leader lines are the only crossing found.

Would v7 as written beat v6? Realism (cables on the floor, opaque hub, matte floor) and storytelling (a hook that is no longer pre-set, counting numbers on their words) yes. Movement: yes from 0 to 18 s, but it repeats v6's failed still end. v5/v6 strengths kept: colours, materials, own entrances, whole names on the wides, low glow. Fix the seven points below and it should clear v6 everywhere.

CHANGES (exact):
1. 0-0.5 s hook: start the slam with Notes whole in frame (the tile at most about 70 % of the frame width, the name and icon sharp by 0.3 s, the dark floor visible under it, frame median luma under .40); keep the scale 1.45 to 1, overshoot and light sweep at that framing.
2. 1.4-3.0 s: the pull-back must end with Notes, Chat and Mail all whole, names uncut, by 3.0 s (stills 1.9 and 2.9 s still crop "otes" and Mail).
3. 3.0-5.2 s (still 4.4 s): the wall fills about 70 % of the frame width so each tool's entrance and name read at phone size. Keep the apps out of frame or whole, never cut at the bottom edge ("tes", "Mail").
4. 9.0-11.0 s, big moment 2: make the tangle look like a tangle. Cables cross and overlap on the floor between the apps and the wall with varied sag (still on the floor, check-wires still passing). The camera goes lower and closer so the tangle fills the frame width, not the middle third.
5. Leader lines: every leader runs through empty space and never crosses another object or a name (one bend, or the number placed beside its object). The 24's leader visibly lands on the tangle with its ring.
6. 15.1-18.2 s: New is the subject. The New tile is at least about 25 % of the frame width; the hub is foreground at the edge, not the main mass (still 15.9 s: New about 5 %, hub about 40 %).
7. 18.2-22.9 s: the end moves. An arc of about 20-30 degrees from about 19.0 s, then the dolly home landing exactly on the frame-0 framing at 22.9 s, with idle motion visible on every tile. Last-4 s median frame change at least 5 on the local check, and the 18.9 s and 21.6 s frames framed differently.
After these: one render, Output QA, and the render critic judges idle motion, the three light sweeps and the loop on the real MP4.

PLAN: CHANGE FIRST: the plan fixes v6's cables, hub and floor, but the hook frame is an unreadable blur, the tangle does not look tangled, two shots miss their subject, leader lines cross tiles and the end is as still as v6's; make changes 1-7 above, refresh the stills sheet, then render.
