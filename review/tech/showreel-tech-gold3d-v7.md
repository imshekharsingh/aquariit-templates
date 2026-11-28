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

## Render critic, render 2 (main account, 26 Nov 23:50 IST)
Judged the real MP4 study/showreel-tech-gold3d-v7-r2-preview.mp4 (22.87 s, 1080x1920, 30 fps) beside v6 render 2: one contact sheet each at phone size (24 frames, same times), three full frames (0.0, 10.3, 16.5 s), frame-change and brightness numbers at 10 fps above the caption band. Output QA: PASS (builder's render 2 run; not re-run here).
Measured: frame change median 7.6 per 0.1 s (v6 8.4); last 4 s median 6.4 (v6 2.3, the target was 5+); longest near-still stretch 0.6 s (v6 1.0 s); pale frames 0 of 229 (v6 18); median luma about .17 (gold .10, v6 .20).

Plan critic's 7 changes:
1. Readable hook frame: PARTLY. From 0.03 s Notes slams in at about 65 % of the width over the dark floor, light sweep at about 1.0 s. But frame 0 itself (the first frame and the thumbnail) is an empty floor with a pole and the question only, and the "Notes" name stays soft under the blur and sweep until about 1.2 s.
2. Whole apps after the pull-back: DONE (2.9 s: Notes, Chat, Mail whole, names uncut).
3. Wall fills the frame: PARTLY. At 5.2 s the wall and tools fill about 75 % of the width and read well, but from 3.9 to 4.6 s the frame is an empty dark wall panel with nothing on it (brightest 1 % of the frame drops from 200 to about 55; tools appear at 4.7 s).
4. A real tangle at moment 2: DONE (9.3-11.4 s: cables cross and overlap on the floor across the full width, varied sag).
5. Leaders clear of tiles: PARTLY. The 24's leader lands on the tangle with its ring (10.3 s); the 11 (14.5 s) and 12 (18.9 s) leaders run through empty space. But the 24 block itself sits on top of the cables: "3 x 8" and "cables" are crossed by a yellow and a pink cable 9.3-11.4 s.
6. New the subject: DONE from about 16.2 s (New about 45 % of the width at 16.5 s, the hub a foreground edge); 15.1-16.0 s it is still small and see-through while it pops in.
7. A moving end and loop home: PARTLY. The arc (19.0-21.6 s, framed differently) and the last-4 s change (6.4) are DONE. The home is not frame 0: the last frame is close on Notes, Chat, the hub and New, frame 0 is the empty floor, so the loop jumps.

Task 10 points 1-7:
1. Cables never through the floor or an object: DONE (7.2 s plug into Pay's side, cables lie on the floor and drape at 8.0-11.4 s; nothing through a tile seen).
2. One flat counting number style with leaders: DONE in style (24, 11, 12 flat white, small line above and below, readable in half a second); the 24 sits on cables (change 5).
3. Colour and light: DONE (no pale frames, matte floor, dark and deep; colours and materials kept from v5/v6).
4. Camera with a reason, no move twice in a row, whole frame used: DONE (pull back 1.4-2.9, rise and push to the wall, dolly to the plug, arc over the tangle, truck in on the hub, crane to the wide, truck to New, arc and dolly home).
5. Three big moments with a light sweep: PARTLY. Sweep 1 on Notes (about 1.0 s) and sweep 3 on the hub (11.5-12.1 s, the brightest frame of the reel) show; sweep 2 on the tangle lasts only about 0.3 s (9.0-9.2 s), the rest of moment 2 is flat.
6. Hook and life: PARTLY. Frame 0 has no object (change 1). Idle motion: nothing looks frozen (no near-still stretch over 0.6 s), tiles bump when cables land (7.2 s) and lean at the hub (12.4 s), but at phone size the idle is not separable from the camera move; it never hurts reading.
7. v6 faults: doubled or see-through HUB label: DONE (12.4 s, one opaque label). Straight stiff cables: DONE. Near-still ending: DONE. No empty frame: NOT DONE, a new one at 3.9-4.6 s.

Q47 text: the 24 block crossed by cables 9.3-11.4 s; "Notes" cut at the left edge on the 13.5 s wide; captions clear everywhere else. Q48 own entrance per object: yes (slam, rise, slide-turn, tool pops, drop, pop-in). Q49 each connection its own beat: yes (first cable and plug 5.2-7.8 s, cascade 7.8-9.0 s, green cables 12.9-13.9 s); the 3.9-4.6 s gap is the one stretch where nothing reads. Q50 wires real at phone size: yes (sag, plugs, matte, floor contact). Q51 over-glow: none; brightest frame 12.1 s (the hub sweep), no haze. Q52 references: "numbers count" seen (24 at 9.5 s, 11 at 14.5 s, 12 at 18.9 s); "one persistent object that evolves" seen (the wall and its cables 5.2-22.8 s).
GOLD: below the tech gold on depth only at 3.9-4.6 s (empty panel) and 9.3-11.4 s (number on a busy background); otherwise matches.
Against v6: better on every point except the new empty frame at 3.9-4.6 s.

PREMIUM: animation 8/10 (t 0-3 slam and pull-back, 7.2 plug, 19-21.6 arc), cleanliness 6.5/10 (t 3.9-4.6 empty dark wall; t 9.3-11.4 the 24 on top of cables; t 0.0 empty first frame), premium 7.5/10 (t 9.5-11.4 a real tangle, t 16.5 New, matte cables, no glow); weakest: 3.9-4.6 s an empty wall panel, start the tool pops at 3.9 s.

CRITIC: NOT READY: v7 is the best 3D sample so far, but at 3.9-4.6 s the screen is an empty dark wall, at 9.3-11.4 s the 24 and its labels sit on top of the cables, and the first frame is an empty floor so the loop jumps. Detail: changes 1, 3, 5, 7; task 10 points 5-7; question 47; animation 8, cleanliness 6.5, premium 7.5.
EXACT FIX:
1. 3.9-4.6 s: the first tool pops onto the wall by 3.9 s (or the apps stay in frame until it lands): no frame without a lit object.
2. 9.3-11.4 s: place the 24 block over dark empty space (above the tangle, beside the wall frame) with no cable under "3 x 8", "24" or "cables"; keep the leader and ring on the tangle.
3. Frame 0: Notes already in frame on the first frame (the slam starts at frame 0), and the dolly home ends on that same framing at 22.9 s so the loop joins.
4. 9.0-11.0 s: the tangle's light sweep runs along the cables for about 1 s, not 0.3 s.
5. 13.5 s: "Notes" whole on the wide (crop the tile or keep its name inside the frame).
STABLE: no (cleanliness 6.5, under 7.5). This was the last render of the loop (2 of 2): the owner decides.

## Upgrade critic (main account, 26 Nov)
Judged the same real MP4 again (study/showreel-tech-gold3d-v7-r2-preview.mp4, 22.87 s): one 24-frame contact sheet at phone size, full frames at 0.0, 4.2, 10.3 and 17.0 s, the topic's sound list (6 cues), against the owner's references (R-ref 26 Nov ids 9-14, SHARED GRAMMAR, design/references.md) and the "Ambition pass" (design/critic.md) and "Motion-design pass" (design/direction.md). The question is no longer "is anything broken" but "what separates this from a premium motion-design reel". Honest summary: v7 is a clean 3D diagram that moves well, but its SET does not build, its GROUPS do not flow, it has no headline type, the problem never breaks and the light never changes. Those are the things the references do every second.

### 1. The five faults already found (kept, unchanged)
F1. 3.9-4.6 s: an empty dark wall panel, no lit object (seen again at 4.2 s: a grey slab and the floor grid only).
F2. 9.3-11.4 s: the "3 x 8 / 24 / cables" block sits on top of the cables.
F3. Frame 0 is an empty floor with a pole; the dolly home does not end on it, so the loop jumps.
F4. 9.0-11.0 s: the tangle's light sweep lasts 0.3 s, not about 1 s.
F5. 13.5 s: "Notes" cut at the left edge on the wide.

### 2. The owner's two notes, made concrete
N1. The 8 tools cascade as ONE flow (3.9-5.2 s, on "eight tools" at 4.47). Today they pop in as separate tiles. Make it a stack: tool 1 (Files) drops onto the top-left slot of the board; each next tool starts 0.15 s after the one before (offsets 0.12-0.2 s, so all 8 are in within about 1.3 s), arrives from just above and behind the previous tile, lands against it with a 4-6 % squash and a 1-frame contact flash on the shared edge, and nudges the tile it lands against by 2-3 px (a domino ripple, not 8 pops). Order: down the left column, then up the right column (an S path, so the eye travels one line). The camera rides it: a crane down of about 1 tile height per tool from 3.9 to 5.2 s, keeping the newest tile at the upper third, then settles as tile 8 lands. One rising "tick" per tile on the sound track, pitch up each step (8 ticks), the last a soft thunk.
N2. The board builds itself before the tools land (3.0-3.9 s), and stays alive after. Today it is a grey slab that is just there. Build: (a) 3.0 s a thin lit line draws the board's outline on the floor (0.25 s); (b) the back panel rises out of the floor along that line (0.3 s, ease-out, slight overshoot); (c) the 8 slot recesses unfold left-right like shutters, 0.04 s apart (0.3 s); (d) a light runs once round the board's edge (0.4 s) and stops at slot 1, which is where Files drops (hand-off to N1). After: the edge light runs again at each section change (9.0 tangle, 12.3 hub, 18.2 payoff); each slot's base glows for 0.2 s when its tool's cable plugs in; a slow 1 % breathing of the edge light the rest of the time. This also fixes F1 (the board is moving from 3.0 s, so no empty frame).

### 3. UPGRADES (element by element; HIGH / MED / LOW)
Apps (Notes, Chat, Mail)
- U1 HIGH, 0.0-3.0 s: the three apps arrive as a CHAIN, not three single entrances: Chat is launched off Notes' landing (Notes squashes at 0.45 s, Chat rises from behind it 0.1 s later), Mail slides in pushed by Chat's overshoot. Each lands with a contact shadow that grows in (shadow first, tile second: it reads as weight).
- U2 MED, 0.0-22.9 s: each app shows a tiny live screen (Notes: a line types; Chat: a bubble pops; Mail: an envelope count 3 -> 4) on a 2-3 s loop. "Real interface rebuilt as the set" (ref 12, 10) at the smallest cost; it is what keeps them alive after landing.
Tools (8)
- N1 above. U3 MED, 7.8-9.0 s: when the cascade of 23 cables lands, each tool's bump follows the cable order (a ripple down the board), not all at once.
Board / wall
- N2 above. U4 LOW: a thin rim light on the board's top edge so it separates from the dark background (at 4.2 s it melts into it).
Floor
- U5 MED, 3.0 s and 12.3 s: the floor is part of the build. The grid lines draw outward from Notes at 0.0-1.0 s (radial reveal, 0.8 s) instead of being pre-set; at the hub's landing (12.3 s) a ring wave runs across the floor grid from the hub's pillar (0.6 s). Background props (the pole, the blue box at 4.2 s) go: they read as clutter, not world.
Cables
- U6 HIGH, 9.0-11.4 s: the PROBLEM BREAKS (shared grammar: "problem shown breaking first, then fixed"). At the tangle's worst, 2-3 cables flash red where they cross, one plug pops half out of its socket with a spark and the tool above it (Pay) flickers grey for 0.3 s; the 24 turns red for 0.4 s as it lands. Then at 12.3 s the hub's arrival is visibly the fix: the red cables are the first to retract.
- U7 HIGH, 12.9-13.9 s: the collapse 24 -> 11 is one motion, not "24 retract, 11 unroll": every old cable is pulled back into its socket in a fast wave (0.04 s apart, from the farthest to the nearest, a little whip at the end), and the 11 green ones shoot out of the hub in a fan (3 down to the apps, 8 up to the tools) as the last old one is gone. The counter ticks down with each retraction, so the number IS the motion.
- U8 MED: F4's sweep made a feature: the light sweep along the tangle travels plug to plug (from Notes to Photos) for 1.0 s, and the same sweep, green, runs along the 11 at 14.0 s: the before/after rhyme.
Numbers
- U9 HIGH, 9.0, 13.1, 18.0 s: numbers get a home and a build. One fixed number spot per section (top-left on dark, clear of cables: fixes F2), the small line types in first ("3 x 8"), then the big number counts with a rolling-digit (odometer) motion, then "cables" slides up under it; on a change (24 -> 11) the old digits roll away, never fade. Add a thin progress bar under it that shrinks from 24 to 11 (the size of the saving, at a glance).
Hub
- U10 HIGH, 11.0-12.9 s: the hub's landing is the reel's turn, so it gets the light flip (refs 9 and 11: light/dark flips only at a section change): as it lands, the key light warms from cold blue-grey to a warm white over 0.5 s, the floor's ring wave (U5) runs, apps and tools lean (kept), and the scene stays in that warmer light to the end. Problem world cold, fixed world warm.
- U11 MED: the hub's face shows its port count filling 0 -> 11 as the green cables plug in (small LEDs along the front), so it is alive after landing.
Captions and headline type
- U12 HIGH, every beat: a kinetic headline word, 120+ px at 1080 wide, in the upper third, one per beat, building the sentence (shared grammar: "1-3 words appear per beat ... the newest word carries the accent, older words go grey"). Words: 0.0 "ONE TOOL" -> 1.4 "3 APPS" -> 3.9 "8 TOOLS" -> 6.5 "EVERY" -> 9.0 "24 CABLES" (red) -> 12.3 "ONE HUB" -> 13.5 "11" handled by the number -> 15.1 "+1" -> 18.2 "LESS WIRING" (accent). Today the only words are the 30 px subtitles with a box on the spoken word: direction card point 5 says subtitles alone never carry a beat. Keep the subtitles; the headline sits above them and clear of the number spot.
- U13 LOW: the spoken-word box on the subtitles (blue corner brackets) is a UI-selection look; replace with the accent colour on the word.
Camera
- U14 MED: the camera rides events, not just beats: the crane rides the cascade (N1); a 2-frame shake and a 3 % push on the red spark (U6); a whip pan from the tangle to the hub on "hub" at 12.3 s (motion blur on the whip only), replacing the truck in.
- U15 LOW: one rack focus, 15.1-16.0 s, from the hub (foreground) to New as it pops in (fixes "New small and see-through" in the render 2 verdict).
Light
- U10 above (the flip). U16 LOW: at the payoff pulse (20.0 s) the board edge light (N2) and the 11 + 1 cable pulse fire together, one bright moment that rhymes with the opening sweep.
Sound cues
- U17 HIGH (cheap): today 6 cues (impact, pop, impact, whoosh, chime, pop). The references hit something every second. Add: the board build riser 3.0-3.9 s ending on a soft click; 8 rising ticks on the tool cascade (N1); a plug click at 7.2 s; a quick rattle under the 23-cable cascade; an electrical crackle on the red spark (U6, about 10.0 s); a low thump on the hub landing (12.3 s, replacing the whoosh); a reverse-zip for the 24-cable retraction; a bright chime on 11 (kept) and on 12. All quiet under the voice (ducked about 8 dB).
End and loop
- U18 MED, 21.2-22.9 s: the end returns home by a story move, not only the camera: the New tile's cable pulses, the camera dollies to the frame-0 framing (F3), and the scene's last 0.3 s match frame 0's light so the loop is seamless.

### 4. PREMIUM, re-graded against the owner's references (not our past reels)
Next to refs 9, 11 and 12 v7 looks like a well-lit 3D diagram, not a motion-design piece: no headline type, no build of the set, groups that pop instead of flowing, a problem that never breaks, one light world from start to end, and 6 sound hits in 23 s.
PREMIUM: animation 6.5/10 (entrances are individual pops; the refs chain and cascade everything), cleanliness 6.5/10 (F1-F3, F5 unchanged), premium 6.5/10 (materials, cables and colour are at the refs' level; type, light change and sound are far below). The 8 / 6.5 / 7.5 of the earlier pass judged v7 against v5 and v6; against the references it is lower.

### 5. RENDER 3 FIX LIST (in build order; one render)
1. Board build 3.0-3.9 s: outline draws, panel rises, slots unfold, edge light runs to slot 1 (N2; fixes F1).
2. Tool cascade 3.9-5.2 s: 8 tools stack one after another along an S path, 0.15 s apart, each landing against the previous one with squash, contact flash and a nudge; camera cranes down with it (N1).
3. Board alive after: slot base glows on each plug-in, edge light at 9.0 / 12.3 / 18.2 s, slow breathing otherwise (N2).
4. Apps as a chain 0.0-3.0 s, shadow first then tile (U1); Notes already in frame on frame 0 (F3).
5. Floor grid draws outward from Notes 0.0-1.0 s; background props removed (U5 first half).
6. The problem breaks 9.0-11.4 s: red crossings, one half-unplugged spark, Pay flickers, the 24 flashes red (U6).
7. Tangle light sweep plug to plug for 1.0 s (F4, U8 first half).
8. Number spot top-left on dark, clear of all cables: typed small line, odometer count, a shrinking bar 24 -> 11 -> 12 (U9; fixes F2).
9. Hub landing 12.3 s: whip pan in, key light flips cold to warm and stays warm, ring wave across the floor (U10, U14 whip, U5 second half).
10. Collapse 12.9-13.9 s as one motion: old cables retract in a wave as the counter ticks down, then the 11 fan out of the hub (U7).
11. 13.5 s: "Notes" whole on the wide (F5).
12. Green sweep along the 11 at 14.0 s (U8 second half); hub LEDs fill 0 -> 11 (U11).
13. Kinetic headline words, 120+ px, one per beat, newest word in the accent, older words grey (U12).
14. Sound: board riser, 8 rising ticks, plug click, cascade rattle, crackle, hub thump, reverse-zip, chimes on 11 and 12, ducked under the voice (U17).
15. End: payoff pulse with the board edge light (U16), dolly home to the exact frame-0 framing and light at 22.9 s (F3, U18).
Moved to the first real tech reel (not render 3, too much for one render or not needed to prove the kit): U2 live app screens, U3 ripple bumps, U4 rim light, U13 subtitle word style, U14 shake, U15 rack focus.
Check before the render: preflight-all PASS (TEXT CLEAR covers the headline and the number spot), check-wires, last-4 s frame change 5+, frame 0 and 22.9 s side by side on one stills sheet.

CRITIC: NOT READY: v7 moves cleanly but does not yet look like a premium motion-design reel: the board is just there, the tools pop in one by one instead of stacking as one flow, there is no big headline type, the problem never visibly breaks and the light never changes; render 3 fixes 15 items at once. Detail: faults F1-F5, owner notes N1-N2, upgrades U1, U5-U12, U14 (whip), U16-U18; PREMIUM against the references 6.5 / 6.5 / 6.5.

## Render 3 plan (builder, 27 Nov): the upgrade critic's 15 items, built; for the plan critic before render 3
Scene techkit/scenes/gold3d-v7.html (rebuilt), kit techkit/lib3d.js (W3D.numbers: odometer digits, typed top line, bar, dark backing; W3D.headline), topic techreel/topics/gold3d-v7.json (same voice, 14 sound cues).
Stills: review/tech/study-25nov/kit-phase2-v7.jpg (refreshed; scene frames at the real cue times; frame 0 and 22.86 s side by side in the last two cells).

### Shot by shot (real cue times)
| Time | What happens | Camera (move, why) | Words / number |
|---|---|---|---|
| 0.0-1.5 | Notes already slamming in at frame 0 (lands 0.45 with a squash), Chat rises off its landing (0.55), Mail slides in pushed by Chat (0.95); each shadow grows in before its tile; the floor grid draws outward from Notes over the first second; light sweep across Notes | hold close and low on Notes, the first big moment | headline "ONE TOOL" from 0.5 |
| 1.5-3.0 | the chain of three whole | pull back (the relationship of the three) | "3 APPS" from 1.4 |
| 3.0-3.9 | the board builds: an outline draws on the floor, the panel rises out of it with a slight overshoot, the 8 slot recesses unfold left to right, an edge light runs once round the board and stops at slot 1 | crane up (the apps sink slowly out of the frame), then dolly in to the board as it finishes | |
| 4.0-5.3 | the 8 tools stack as one flow down the left column and up the right, 0.15 s apart, each arriving from just above and behind the one before, landing with a squash, a one-frame contact flash on the shared edge and a nudge of the tile it lands against; 8 rising ticks, a soft thunk at the end | the camera rides the stack (follows the newest tile) | "8 TOOLS" |
| 5.3-7.8 | the first cable unrolls along the floor and up the wall, the plug clicks into Pay, its slot base glows | truck down to the plug | "EVERY" |
| 7.8-9.0 | the other 23 cascade; each slot glows as its cable lands; a quick rattle | high arc over the floor | |
| 9.0-11.4 | BIG MOMENT 2, the problem breaks: three crossings turn red, the Notes-Pay plug is pulled half out with a spark and a crackle, Pay flickers grey for 0.3 s; a 1 s light sweep runs plug to plug along one cable; the edge light runs | pull back, behind the apps, looking down on the tangle | "24 CABLES" (red); the number spot: "3 x 8" types in, 24 rolls up (red as it lands), a bar fills, "cables" slides up; dark backing, leader to the tangle |
| 11.4-12.9 | BIG MOMENT 3: the hub lands on its pillar (scale overshoot, a low thump), the key light turns from cold blue-grey to warm white over 0.5 s and stays warm, a ring runs across the floor grid from the pillar, apps and tools lean once, the edge light runs | fast whip pan (0.75 s) to the hub from just above the apps: the hub sits on its cables with the wall behind (the near apps stay out of the frame) | "ONE HUB" (green) |
| 12.9-14.2 | the collapse is one motion: the red cables retract first, then the rest farthest to nearest, 0.04 s apart (a reverse zip); the counter ticks down with each one; then the 11 green cables fan out of the hub together and the hub's 11 LEDs light | crane up to the high wide, with a slow start (the near apps rise into the frame and settle gently) | 24 rolls down to 11 with the bar shrinking, leader to the hub |
| 13.9-15.1 | a green sweep along the 11 (the before/after rhyme); everything idles | orbit | 11 |
| 15.1-18.2 | New pops in on its pillar, its one cable | truck to New, from a little further back and higher (Chat and Mail whole at the frame bottom) | "+1" |
| 18.2-21.0 | the payoff: 12 rolls up with a tick, the bar grows a step; at about 20.0 the board's edge light and all 12 cables pulse together; a chime | pull back to the payoff wide | "LESS WIRING" (green); 12 with a leader to New |
| 21.0-22.86 | everything idles; the headline leaves; the light turns back to frame 0's cold light in the last 0.3 s; the New cable pulses | arc, then dolly in home to the exact frame-0 framing | |
Move types in order: hold, pull back, crane up, dolly in, truck down, arc, pull back, whip, crane up, orbit, truck, pull back, arc, dolly in: none twice in a row.

### The 15 items, how each is built
1 board build: done (outline, panel rise, slot shutters, edge light to slot 1; no frame without a lit object). 2 tool cascade as one flow: done (S path, 0.15 s steps, squash, contact flash, nudge; the camera rides it at a smaller amplitude than asked, so the top row stays below the headline). 3 board alive: done (slot glow on every plug-in, edge light at 9.0 / 12.3 / 20.0 s, slow breathing). 4 apps as a chain, shadow first, Notes in frame on frame 0: done. 5 floor grid draws outward from Notes; background props removed: done. 6 the problem breaks: done (3 red crossings, the half-pulled plug and spark, Pay flickers, the 24 flashes red). 7 the tangle sweep plug to plug for 1 s: done. 8 number spot: done (typed small line, odometer digits, a bar 24 -> 11 -> 12, a dark backing so no cable crosses the digits; the leader to the object). 9 hub landing: done (whip pan, cold to warm light that stays, ring across the floor). 10 collapse as one motion: done (red first, farthest to nearest, the counter ticks down with each, then the 11 fan out of the hub). 11 Notes whole on the wide: done (the wides pulled back and aimed higher). 12 green sweep along the 11, hub LEDs 0 -> 11: done. 13 kinetic headline words, 128 px, one per beat, the newest in the accent, the one before grey: done. 14 sound: done (impact, board riser and click, 8 rising blips, a thunk, the plug snap, a rattle, an impact on "twenty", a crackle, a hub thump, a reverse zip, chimes on 11 and 12, all at low gain under the voice). 15 the end: done (payoff pulse with the board's edge light, the headline leaves, home to frame 0's framing and light).

### For the plan critic to decide (honest open points)
- The headline and the tall board share the upper third. On every wide shot the headline is clear of all objects (the check below). In the close shots (the board 5.5-6.5 s, the plug 6.5-7.8 s, the tangle arc 8.0-9.0 s, the hub 12.0-13.0 s, New 15.5-17.5 s) the words sit over out-of-focus tiles of the board behind the subject. Options: (a) accept that (the tiles are blurred background), (b) a dark band behind the headline (but rules-tech.md and critic question 46 fail a big keyword bar at the top), (c) headline words only on the wide shots. The pre-render TEXT CLEAR check (scripts/preflight-all.mjs) FAILS on (a): it counts the words over those tiles (6.5-10.3 s and the other close shots, placeholder-voice times). (b) or (c) would pass it. Recommendation now: (c), the words on the wides only (0-3 s, 9-11 s, 13.5-15 s, 18-21 s), which keeps U12's grammar where the picture has room and keeps the owner's no-top-bar rule.
- The headline itself: critic question 46 (owner, 25 Nov) fails "a big keyword bar at the top"; U12 asks for big headline words. v7 has no bar or band, only the words over the picture. Please confirm this is what U12 meant.
- The camera ride in the tool cascade is smaller than asked (it would push the top row into the headline).
- Preflight (placeholder voice): Output QA on the preview 6 pass, 0 fail (warnings: no real media, no subject box, one SHEEN line at 16.9 s); REVIEW items fail because this is a never-posted sample with no mandatory-gate items or direction card (as v5 and v6; scripts/review-gate.mjs allows samples).
- Local checks on the whole reel at the real cue times (scene frames at 10 fps, no render; 27 Nov): COLOUR pass (no hard background cut; the first pass found two, at 13.1 s and 17.7 s, where the near Chat and Mail tiles left the frame edge in one 0.1 s step after the close hub and New shots: fixed by the hub whip from just above the apps, 0.75 s, a slow-start crane, the New truck a little further back, and neutral blacks for the caption fade, the page and the haze, so the empty background reads dark, not blue); GLOW pass (1.1 % median, worst 1 s 3.5 %); frame change median 7.8, last 4 s 5.7; pale frames 0 of 229; 36 cables, none through the floor or an object; no leader crossing a tile, no number over a cable (9.6, 14.4, 18.9 s).
- The whip is now 0.75 s (asked: a whip pan); at 0.38 s its frame-edge colour jumped 56 degrees in one step (Output QA COLOUR fails over 45).
- Moved to the first real tech reel, as the upgrade critic listed: live app screens, ripple bumps, the rim light, the subtitle word style, the shake, the rack focus. The whip pan has no extra motion blur beyond the render's frame blend.

## Render 3 plan critic (main account, 27 Nov)
Judged the builder's "Render 3 plan" and the refreshed stills sheet (review/tech/study-25nov/kit-phase2-v7.jpg, 14 scene frames at the real cue times, frame 0 and 22.86 s side by side) against the upgrade critic's RENDER 3 FIX LIST, critic.md Ambition pass points 1-4 and questions 46-52, and direction.md "Focus, structure, reason" (R-ref 27 Nov: the target reel moves LESS than v7 and reads more designed because of focus, structure and reason). No render, no scene edits. This is the last render, so every item below is either OK or a cheap, exact change.

### What the stills show
- Good: the board builds (3.4 s), the tools stack as one column flow (4.6, 5.2 s), the problem breaks with the number on a dark backing clear of the cables (10.0 s), the hub lands big (12.6 s), the high wide reads as one clean system with all of Notes whole (13.6 s), the payoff wide with 12 and its leader (19.0 s). This is a clear step up from render 2.
- Clutter: the "older word in grey" line stacks a second headline under the subtitles in every frame (1.4, 3.4, 4.6, 7.3, 8.5, 10.0, 12.6, 16.2, 19.0 s). With the subtitles above and the number spot beside it, 10.0 s has four text layers in the top 40 % and two "24"s (headline "24 CABLES" and the number 24). At 7.3 and 8.5 s "8 TOOLS / EVERY" sit on the Files and board tiles; at 12.6 and 16.2 s the grey word sits on the Maps tile.
- 3.4 s: "3 APPS" is on screen while the apps have craned out of the frame (the word names nothing in the picture).
- 16.2 s: a large cut-off yellow shape (Mail) fills the bottom-left corner of the New shot.
- The loop: frame 0 shows Notes alone, big (about 68 % of the width) and centred in the upper middle, its "Notes" label bleached by the light sweep; the 22.86 s frame shows Notes smaller (about 45 %) and low, with Chat, the hub, Photos and the wall in frame. The two frames do not match, so the loop still jumps (F3 not fixed).

### The 15 items
1. Board build: OK (the panel rises with its slot recesses at 3.4 s; the edge light must be visible by 3.6 s, Output QA checks no frame without a lit object).
2. Tool cascade as one flow: OK (the smaller camera ride is accepted; the reason, keeping the top row clear, is good).
3. Board alive: OK.
4. Apps as a chain, Notes on frame 0: CHANGE: start the Notes light sweep at 0.5 s (after the landing), not on frame 0, so the hook frame reads "Notes" clearly (today the label is bleached at 0.0 s).
5. Floor grid draws, props gone: OK.
6. The problem breaks: OK, with the focus change (A below).
7. Tangle sweep 1 s: OK.
8. Number spot: OK (dark backing, clear of the cables, leader to its object).
9. Hub landing: OK. The 0.75 s pan is accepted in place of a whip: a 0.38 s whip fails the COLOUR check and the pan has a story reason (the hub arrives).
10. Collapse as one motion: OK.
11. Notes whole on the wide: OK (13.6 s).
12. Green sweep and hub LEDs: OK; the camera under it changes (C below).
13. Headline words: CHANGE (the open points decided): (a) big headline words on the wide and clean shots only: 0.5-3.0 s ("ONE TOOL", then "3 APPS"), 4.0-5.3 s ("8 TOOLS", it clears the board top), 9.0-11.4 s, 13.5-15.1 s ("11" is the number, so no headline word there), 18.2-21.0 s; none on the close shots 5.3-9.0, 12.3-13.5 and 15.1-18.2 s; (b) "3 APPS" leaves at 3.0 s as the apps leave the frame; (c) at 9.0 s the word is "TANGLED" (red), not "24 CABLES", because the number spot already shows 24 (one subject per beat, no two 24s); (d) drop the grey older-word line everywhere; the step pill (B below) takes its place. No band or bar behind the words (question 46); the words are the picture's, over empty dark only. TEXT CLEAR must pass on the whole reel at the real voice times.
14. Sound: OK (to be heard on the render: every added hit at least 8 dB under the voice).
15. End and loop: CHANGE: the last move lands on frame 0's framing exactly: Notes centre within 5 % of the frame size and its width within 10 % of frame 0's (about 68 % of the width), Chat, Mail, the hub and the wall outside the frame by 22.86 s, frame 0's cold light; checked with frame 0 and 22.86 s side by side on the stills sheet before the render.

### Focus, structure, reason
- FOCUS (one subject lit, the rest dimmed but kept as context): today everything is lit all the time. CHANGE A: three dim windows, everything not the subject brought down to about 30 % brightness over 0.3 s and back up over 0.4 s: (1) 5.3-7.8 s the first cable: only Notes, Pay and that cable stay full; (2) 9.0-11.4 s the problem: the three red crossings, the half-pulled plug and Pay stay full, the other cables and tiles dim to about 50 %; (3) 15.1-18.2 s New: only New, its cable and the hub stay full. Everything returns to full by 18.2 s so the payoff wide is the whole system revealed (the reference's final pull-back). The board build (3.0-3.9 s) needs no dim: the apps have left the frame and the board is alone.
- STRUCTURE (a fixed frame to hold on to): today none; the headline changes every beat and there is nothing that stays. CHANGE B: one small step pill in the spot of the dropped grey line (centred, about 30 px caps on 1080, a dark capsule, not a bar), on screen 0.5-21.0 s, changing per section with a short slide: "01 / 04 · THE SETUP" (0.5-5.3 s), "02 / 04 · THE WIRING" (5.3-9.0 s), "03 / 04 · THE PROBLEM" (9.0-12.3 s), "04 / 04 · THE FIX" (12.3-21.0 s). At least 24 px clear of the subtitles' lowest line (they wrap to two lines at 0-1.5 s) and of the headline; it leaves at 21.0 s with the headline so the last frame matches frame 0. The number spot keeps its one fixed place (top left) for 24, 11 and 12: that is the second fixed frame.
- REASON (every camera move goes to the next thing in the story): most moves have one (hold on the hook, pull back to the three, crane to the board, ride the stack, truck to the plug, arc over the cascade, pull back to the tangle, pan to the hub, crane up for the collapse, truck to New, pull back to the payoff). Two do not. CHANGE C: 13.9-15.1 s the orbit becomes a still hold (at most a 2 % push) while the green sweep runs along the 11: the sweep is the subject and the reference holds 0.5-1 s on a beat that needs reading. 21.0-22.86 s "arc, then dolly home" becomes one curved dolly home to Notes (where the story began), not two moves. Keep the last-4 s frame change at 5 or more (the move home from the payoff wide to the close Notes is large enough; check it locally).

### Also
- CHANGE D: 15.1-18.2 s the New shot: Mail either fully outside the frame or whole; no cut-off tile in the bottom-left corner (16.2 s).
- Before the render (as the upgrade critic listed): preflight-all PASS with TEXT CLEAR covering the headline, the pill and the number spot; check-wires; COLOUR and GLOW local checks; last-4 s frame change 5+; frame 0 and 22.86 s side by side on the refreshed stills sheet. No new stills round for the critic: the builder checks these and renders.

PLAN: CHANGE FIRST: make seven small changes (fewer headline words, a step pill instead of the grey words, dim the rest in three moments, two calmer camera moves, a matching last frame, a clean New shot, a readable first frame), check them locally, then run render 3 without another plan check.
1. Item 4: Notes light sweep starts at 0.5 s; frame 0 reads "Notes".
2. Item 13: headline words on the wide and clean shots only (0.5-3.0, 4.0-5.3, 9.0-11.4, 18.2-21.0 s); "3 APPS" leaves at 3.0 s; "TANGLED" at 9.0 s instead of "24 CABLES"; the grey older-word line removed.
3. B: a step pill "01 / 04 · THE SETUP" ... "04 / 04 · THE FIX", 0.5-21.0 s, 24 px clear of the subtitles and the headline.
4. A: dim the non-subjects to about 30 % at 5.3-7.8 s (first cable), to about 50 % at 9.0-11.4 s (the problem) and to about 30 % at 15.1-18.2 s (New); all full again by 18.2 s.
5. C: 13.9-15.1 s a still hold instead of the orbit; 21.0-22.86 s one curved dolly home instead of arc then dolly.
6. Item 15: the last frame matches frame 0 (Notes about 68 % wide, same centre within 5 %, nothing else in frame, cold light).
7. D: the New shot has no cut-off Mail tile.

## Render 3 build (builder, 27 Nov): the plan critic's 7 changes, then the checks before the one render
The seven changes:
1. Item 4: the Notes light sweep starts at 0.5 s; Notes starts its slam 0.1 s earlier with less tilt, so frame 0 shows a big, readable "Notes" below the subtitle fade.
2. Item 13: big words only on the wide and clean shots: ONE TOOL / 3 APPS (0.5-3.0 s, 3 APPS leaves with the apps), 8 TOOLS (3.9-5.3 s), TANGLED in red (9.0-11.4 s; the number spot shows the 24), LESS WIRING (18.2-20.6 s); none on the close shots; no grey older word. Each word fades and slides in and out (no instant swaps).
3. B: one step pill under the subtitles ("01 / 04 · THE SETUP" ... "04 / 04 · THE FIX"), 30 px caps on a dark capsule, 24 px clear of the two-line subtitles and of the headline; it crossfades per section and leaves with the headline.
4. A: three focus moments: 5.3-7.8 s only Notes, Pay and the first cable at full (the rest at 30 % on screen), 9.0-11.4 s the red crossings, the pulled plug and Pay at full (the rest at 50 %), 15.1-18.2 s New, its cable and the hub at full (the rest at 30 %); all full again by 18.2 s. Reflections dim with the colour.
5. C: 13.7-15.1 s a still hold (a 2 % push) while the green sweep runs; the end is one curved dolly home (20.3-22.86 s) after a slow push on the payoff; the headline and pill leave as the dolly starts.
6. Item 15: the last frame matches frame 0's Notes in size and place (box within 0.5 %), cold light. Open point: Chat sits 1.88 beside Notes, so its edge stays at the right of the last frame (about 17 % of the width) and the hub shows behind Notes; frame 0 has neither (Chat and the hub have not arrived). Removing them would mean moving Chat, which breaks the chain story.
7. D: the New shot is framed from beside Mail, so no cut-off tile in the corner; its move curves up over the apps.
Also (the owner's 27 Nov notes and the new checks): no one-frame glitches: the idle sway of every tile fades in after it lands (it switched on in one frame), the camera ride glides between tiles (it stepped), the tools arrive from just in front of the tile before (they came from behind the panel and popped into view), the hub grows in as it falls, the contact flash and Pay's grey dips are soft pulses, the spark fades, the number block changes its content only while hidden and its count rolls (no steps), its typed line fades letter by letter, satin finishes (no one-frame glints). The subtitles sit at the top, so the topic declares that band for the checks ("qa": "subs"). Neutral blacks (caption fade, page, haze, sky) and a darker caption fade keep the board's edges from showing under the subtitles.
Checks before render 3 (27 Nov, scene frames at the real voice times; the render is the judge): TEXT CLEAR ok on the whole reel (an earlier build; later changes moved no text); COLOUR no hard cuts and GLOW pass on the changed stretches; no cable through the floor or an object; last 4 s keep moving. The frame-by-frame glitch check (new, 27 Nov) was run on the whole reel and then moment by moment: every named moment was fixed (see the list above) and passes at full size, except the pull-back over the cable cascade (about 8.1-8.7 s), where fast-growing cable tips near the camera still read as one-frame jumps in the check. Render 3 runs at 120 fps with four frames blended into each (motion blur). If the render's check still names that stretch, the fix is to show the cascade from further back (the tips then move slowly on screen).

## Render 3 (builder, 27 Nov, the last v7 render)
R2 study/showreel-tech-gold3d-v7-r3-preview.mp4 (stills: -r3-preview-stills.png), 120 fps blended four to one into 30 fps.
Output QA: FAIL (1): FLICKER only. One-frame flicker: 0.77 s (4.9), 7.73-7.87 s (15.1), 8.33-8.70 s (19.7), 14.53-14.60 s (6.4); one-frame jumps: 0.83 s (7.7), 3.90 s (5.3), 7.87-8.10 s (48.8).
Everything else PASS: PACE (2.5 words/s), STRAY, LOUD -14.5 LUFS, SOUND (25 of 25 cues audible), COLOUR (no hard cuts), EDGES, GLOW 0.8 % median, VARIETY 9 %, LOOK, NUMBERS, DEAD, SHEEN; warnings only for no real media and no subject box (as v4-v6).
Where the glitches come from: the cable cascade (7.7-8.7 s): 23 cables grow from the apps near the camera; their tips cross a patch of the screen within one frame. The fix for a later kit pass: show the cascade from further back (a wide where the tips move slowly on screen) or let the cables fade in instead of growing.
For the critic: judge the render as usual (critic.md, PREMIUM); the glitch check result above is from the machine check.


## Render critic, render 3 (main account, 27 Nov, the last v7 render)
Judged the real MP4 (R2 study/showreel-tech-gold3d-v7-r3-preview.mp4; 22.87 s, 1080x1920, 30 fps): one contact sheet every 0.75 s, a 7.6-8.8 s strip at 30 fps, full frames at 3.0, 7.93, 8.5 and 14.25 s.
What landed: the seven plan changes are all in: big words only on the wide shots (ONE TOOL, 3 APPS, 8 TOOLS, TANGLED in red, LESS WIRING), the step pill 01-04 sits clear of the subtitles, the focus dims read, the New close (16.5 s) is clean, the payoff wide (18-21 s) is the best frame v7 has made: lit board, purple hub, green cables, 12 counter. Materials and type are at the references' level.
Faults (visible at phone size):
1. 7.7-8.7 s (the FLICKER moment, confirmed by eye): the cable cascade is drawn as four separate stepped copies, not a blur. At 7.93 s every cable and the Notes and Chat tiles show four offset images ("Notes" printed four times); at 7.6-7.7 s and 8.3-8.6 s the board tiles (Files, Maps, Pay, Photos) show doubled edges and striped labels. The 120 fps four-into-one blend makes a strobe wherever things move more than a few pixels per sub-frame. It is the main beat of the story (the tangle growing) and it looks broken.
2. 3.0 s: the three apps sit at the bottom edge with the whole middle and top empty and the subtitle fading out; reads as a dead frame between the hook and the board (Output QA weak flicker 0.8 s / 3.9 s sits beside it).
3. 17.25 s: the hub cut at the left edge and the New tile cut at the right of a mostly dark frame (the truck away from New).
4. Loop: the last frame (22.8 s) has Chat beside Notes and the hub behind; frame 0 has Notes alone (the open point the builder named). Minor.
PREMIUM: animation 6.5/10 (t 7.7-8.7 four-copy strobe on the main beat; t 0-3 slam and pull-back and t 18-21 payoff good), cleanliness 6.5/10 (t 3.0 empty middle, t 7.93 ghosted labels, t 17.25 cut tiles), premium 7.5/10 (t 9.5 tangle, t 16.5 New, t 19.5 payoff wide); weakest: 7.7-8.7 s the cascade strobes; show it from the high wide (tips moving slowly on screen) or fade the cables in, so no part moves more than about 8 px per 120 fps sub-frame.

CRITIC: NOT READY: v7 render 3 is not STABLE: the cable cascade at 7.7-8.7 s shows four stepped copies of every cable and tile (a visible glitch on the story's main beat), with an empty frame at 3.0 s and cut tiles at 17.25 s; animation 6.5, cleanliness 6.5, premium 7.5. Exact fix (a kit pass, needs a render the owner must approve): (1) 7.7-8.7 s film the cascade from the high wide used at 9.0 s, or let the 23 cables fade in along their path instead of growing their tips past the lens, then re-check FLICKER at 60 fps; (2) 2.6-3.4 s start the crane before the apps reach the bottom so the board's frame enters by 3.0 s; (3) 16.9-17.6 s frame the truck so the hub and New stay whole or fully out. Is v7 usable for a tech reel as-is? No for the 7.7-8.7 s stretch; yes as a source of parts (the board, tiles, hub, materials, headline type, step pill and the payoff wide are good enough to reuse). Render cap reached: the owner decides.


## Render 4 (builder, 28 Nov 2026): the last render; v7 closed (owner: "do render 4 as the last one, then move on")
- MP4: R2 study/showreel-tech-gold3d-v7-r4-preview.mp4 (22.87 s); stills: study/showreel-tech-gold3d-v7-r4-preview-stills.png.
- What changed from render 3: the whole-reel glitch screen showed the real cause of the stepped cascade (the move into the "high wide" took 0.62 s
  with the camera low over the floor, so the cables passed right in front of the lens). The cascade is now filmed from the far high wide (1.7 s move
  on a higher arc after the first plug's click), the cables land once the camera is still, the 3 x 8 counter counts with them, Chat and Mail enter
  the frame edge dim, the board rises over 0.9 s, the counter's ones digit rolls and fades (lib3d numbers), "TANGLED" no longer sits on the board.
- Output QA: everything PASS (PACE, STRAY, LOUD, SOUND, COLOUR, EDGES, GLOW, VARIETY, LOOK, NUMBERS, DEAD, SHEEN; LICENCE and HERO warn as before)
  except FLICKER: FAIL 0.77 s (A-B-A 4.7, limit 4.0) and a one-frame jump at 0.83 s (7.8, limit 5.0): Notes slamming in at the start. The cascade
  (render 3's fault, up to 64) is clean.
- Verdict: NOT READY as a whole reel (FLICKER fails), and no render is left: v7 is closed. No critic session is started for it. Its good parts
  (the wall build, the far high wide over the cascade, the collapse and the payoff wide) can be reused as pieces in the 2.5D tech reels; the opening
  slam would need a slower landing first.


## Part b plan (builder, 28 Nov 2026, branch claude/v7-actions): more actions and elements inside objects already on screen; NO render yet, waiting for the owner's yes
Owner yes 28 Nov (part b): reopen v7 for more actions, budget about $10-20 with at most 2 renders, render 5 only after the owner approves this plan. Target (design/references.md "R-ref 28 Nov 2026 · action count"): 2.5+ new actions a second in the picture, 2+ moving at once, no gap over 1.2 s, measured with scripts/qa/action-count.py. No new camera moves (the SH list is untouched).
Stills sheet (ONE, phone size, scene frames at the real cue times, placeholder voice, no render): review/tech/study-28nov/v7-partb-stills.jpg (1.8, 2.7, 4.6, 6.9, 7.9, 10.0, 10.9, 14.9, 17.2, 19.4 s).
Where the pieces live: techkit/scenes/gold3d-v7.html, the block "PART B" (const ACT) before frame(); every value a pure function of t (no modulo wraps, no per-frame random).

### The render 4 fault first (FLICKER 0.77 s and the 0.83 s jump)
Notes now lands at 0.9 s (was 0.65 s; the slam takes 1.4 s, was 1.0 s), its light sweep runs 0.95-1.8 s (was 0.5-1.4 s), Chat and Mail start 0.25 s later (0.8 / 1.2 s) and their shadows fade in from the moment the tile appears (they popped in at 0.8 s: that was the real one-frame jump, a dark shadow smear at the right edge). Checked locally at 60 fps on scene frames 0-1.6 s: FLICKER PASS (render 4: A-B-A 4.7 and a 7.8 jump). The first build of this change failed with a 14.9 jump at 0.85 s (the shadow); the shadow fix cleared it.

### Beat by beat: what is new, where, and when (real cue times; times in s)
| Beat | New action (all inside objects already on screen) | Where |
|---|---|---|
| 0.9-3.1 the three apps | Notes screen types a line at a time (0.95 on); Chat pops a bubble every 0.95 s (1.3 on) with typing dots before each; Mail inbox gets a new row and its badge counts 3 to 4 (2.6), later 5, 6, 7 (9.9, 15.7, 19.7); chips land on the apps: SAVED on Notes (1.55), 3 NEW on Chat (2.05), +1 MAIL on Mail (2.65); a blue selection box snaps round "3 APPS" (1.55) | on the tiles, headline word |
| 3.9-5.3 the 8 tools | selection box round "8 TOOLS" as it is said (4.5) | headline word |
| 6.8-7.8 first cable | PAID stamp lands on Pay (6.8), the first plug click (7.66) puts badge 1 on Pay and a ripple ring round it | on Pay |
| 9.3-11.6 the tangle | selection box round TANGLED (9.35); the connection log card slides in (9.4): 24 pips fill in four beats of 0.42 s (9.86, 10.28, 10.70, 11.12), each beat a row wipes in ("Tasks ✓✓✓"); every tool gets a badge that ticks 1, 2, 3 and a ripple ring as its cables land; selection box snaps round the 24 (10.36); the red 24 CABLES stamp lands on the tangle (10.51) with a ring; red crossings, half-pulled plug, Pay grey dips stay (11.26) | tools, floor, right margin (log), number block |
| 13.4-15.5 the fix | the log shows the pips going out in the retraction order, then 11 green pips refilling as the hub cables arrive, rows "Hub → Notes ✓" ...; tool badges turn green 1; hub LEDs fill (already in v7); selection box round the 11 (14.58); the green 11 CABLES stamp lands on the hub (15.59) | right margin, hub, tools |
| 16.4-18.4 New | New cable grows (as before) | New tile |
| 18.6-20.3 payoff hold | selection box round LESS WIRING (18.52) and the 12 (19.17); the log card moves left (the 12 is on the right) with three beats: Hub → New (18.9), Hub → 3 apps (19.2), Hub → 8 tools (19.55), "All 12 linked" (19.9); the 12th pip pulses; the +1 CABLE stamp lands above New (18.77) | headline, number block, left margin, New |
| 20.3-22.9 dolly home | nothing new: the whole picture moves with the camera (see below) | |
Not taken or changed from the owner chat's list: "hub LEDs filling" was already in v7 (U11); "number-to-picture fill, keyword jump, blur hand-off" from branch claude/kit-ref-pieces: that branch is not on origin yet, so v7 has its own 3D equivalents: the 24 log pips are the number-to-picture fill; a keyword jump on the headline words was built and removed (it merged into the headline's own change and lowered the count); no blur hand-off (it is a camera-like move). When the other session's pieces land they can replace these.

### Expected action count per second, and what was measured (no render: scene frames at the real cue times, 270x480, 10 fps, the same script)
| | picture actions a second | moving at once | gaps over 1 s |
|---|---|---|---|
| v7 render 4 (the MP4, from the owner chat) | 1.8 | 1.3 | 5 (9.7 s) |
| v7 scene as in render 4, scene frames | 2.27 | 1.33 | 5.1-7.0, 7.8-10.0, 11.4-12.7, 12.7-14.6, 20.2-22.9 |
| v7 with part b, scene frames | 2.27 | 1.52 | 5.1-7.0, 7.8-9.9, 11.1-12.7, 12.7-14.4, 15.7-16.8, 17.2-18.8, 20.3-22.9 |
The scene frames read about 0.45 a second higher than the MP4 (2.27 here against 1.8 on render 4), so the expected render numbers are about 1.8 actions a second, about 1.5 at once, with five gaps.
Per second (picture onsets): before 3 2 4 3 4 2 0 3 0 0 4 4 1 0 2 4 1 2 2 9 2 0 0; after 3 1 4 3 4 2 0 3 0 1 4 1 1 0 6 4 1 2 1 5 6 0 0. Gains: the hub close 14-15.5 s (2 to 6), the cascade 9-10 s; losses: 11 s and 19 s, where the new rings and flashes merged into the cable pulses that were already counted separately (the 9 at 19.x).

### Why part b alone does not reach the target (the finding to decide on)
The counter counts a thing only when it starts in a part of the picture that was still for the last 0.3 s, and it skips every frame where over 45 % of the picture moves (camera time). In v7 four stretches are camera moves with 35-65 % of the picture moving: 5.1-6.6 s (dolly to the first plug), 7.6-9.2 s (the pull-back to the high wide), 11.5-14.4 s (whip to the hub and the collapse) and 20.1-22.9 s (the dolly home): 11 s of 23 s. Anything added inside them joins the moving picture and does not count (the dolly-home log beats and the headline jump were tried: zero onsets), and those moves are slow on purpose (render 3 strobed when they were faster). So with the camera as it is, part b gives the pieces (live screens, log, stamps, selection boxes, ripples, badges) and +0.2 things moving at once, but not 2.5 a second, not 2 at once and not "no gap over 1.2 s".
Options for the owner (the owner chat decides, then render 5):
1. Render as it is (about $10, one render, then the reviewer): expect about 1.8 a second, 1.5 at once, five camera-bound gaps; FLICKER fixed; it does NOT meet the target and I would not call it done on the numbers.
2. Recommended: a short camera retime first, no render: cut each of the four long moves to about 1.2 s and put a 1.2 s hold with events after it (the dolly home as 1.4 s of move after a 1.2 s hold with the log beats; the collapse stretch as whip, hold, collapse). That is a change of timing, not a new move, but a faster move risks the strobe, so it needs the same local 60 fps FLICKER screen before any render (about one more session, no render cost). Then render 5 with the numbers measured locally first.
3. Stop at the pieces: keep part b as a kit of parts for the 2.5D reels (the screens, the log, the stamps and the selection box are the same grammar there) and close v7.

### Checks done locally (no render)
- FLICKER at 60 fps on scene frames 0-1.6 s: PASS (the render 4 fail).
- Stills sheet read at phone size: no text over an object except the stamps and selection boxes that sit on their own object; the log card clears the number block (the log is on the other side); the first +1 CABLE stamp covered New's name in the close shot and was moved to the payoff wide (18.77 s).
- Not run yet (they come with the render): Output QA on the MP4, preflight-all TEXT CLEAR on the new log card and stamps, the reviewer.

(No verdict line here: the builder never writes one. The critic adds its own.)
