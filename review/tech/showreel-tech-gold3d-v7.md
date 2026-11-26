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
