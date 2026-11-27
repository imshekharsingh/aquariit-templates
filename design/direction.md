# Direction card: one per reel, filled before the build (owner, 24 Nov 2026)

Why: the owner's reference reel: "It isn't a longer prompt, it's direction. Claude has to guess 1,000 things and takes the safest choice each
time: 1,000 safe choices, one boring video." Our reels read as boring next to reels like that. The gold reels (design/gold.md) set the floor;
the card is where each reel makes its own choices on top of gold.

How:
- `node scripts/starter.mjs <tech|web|c3> <slug>` writes the empty card at `review/<channel>/<name>.direction.md`. Fill it BEFORE you build.
- Write each of the 9 lines as `N. <Name>: <the choice, concrete, with times> | Why: <what it does for the viewer>`. The words "default",
  "steady" and "simple" are refused as answers (npm run check). "Like gold" is not a choice either: name what you keep and why.
- The stills check (the Fable session that checks the stills) approves the card and the stills together. It reads each line against the
  stills and writes one line at the end: `STILLS CHECK: APPROVED (<session>, <date>): <one sentence>` or `STILLS CHECK: REDO: <which lines>`.
  The Tech reel and Showreel workflows refuse to render a reel that posts from 25 Nov without the APPROVED line (scripts/review-gate.mjs).
- The critic checks that the reel delivers the card: the rewatch moment really happens, and so do the hook and payoff (critic.md question 44).

## Focus, structure, reason (owner, 27 Nov 2026; measured on the R-ref 27 Nov system-map reel)
The reel the owner wants to reach moves LESS than our 3D v7 (motion per frame ~11-13 vs 21; still frames 8-13 % vs 1 %) yet reads far more
designed. Quality comes from three things, not from more motion; every plan, every channel, every kit (2.5D, 3D, web, Turns Out) answers them:
1. FOCUS: one subject lit per beat (spotlight or colour world), everything else dimmed to ~20 % but kept as context.
2. STRUCTURE: a fixed frame the viewer can hold on to (a title that stays, a step pill "0N / 0M · NAME", numbered steps, one map or set
   that persists), so each beat has a place in the whole.
3. REASON: every camera move goes to the next thing in the story; no move for its own sake; a calm hold is allowed when the beat needs
   reading (a still 0.5-1 s is fine), motion is not a score to maximise.
Where it fits: tech 3D kit (spotlight + dimming instead of glow everywhere; a step pill; a fixed title; camera only between story
beats), tech/web node maps (the full grammar), Turns Out (spotlight on the part being fixed, step pill over the before/after spine).
The critic's Ambition pass asks these three for every reel.

## 2.5D map reels (owner, 27 Nov 2026, notes 1-6 on the tap-to-pay test; design/references.md "R-ref 27 Nov 2026" rules)
Every 2.5D map reel (tech, and web "how the browser does X") plans these on its card:
1. Moves 0.4-0.6 s with a quick ease, leaving on the spoken step number (no dwell); no line glow or flowing pulses; one short line draw per move (cause -> effect).
2. Zero glitches: every value continuous in t (no modulo wraps, no per-frame random, fades instead of instant swaps, no will-change layers); flights start from the real hold position. Output QA FLICKER passes on a 60 fps local capture before the render.
3. A ghost of the next card 0.5 s before the camera goes there; ambient life outside the cards (dust, sub-nodes drifting, light breathing).
4. Torch-like light wedges in each node's hue; faint sub-nodes, grid and dust fill the background; dim, low contrast, no blur stacks.
5. A whole-frame map per beat on the card: top band, middle subject, edges, background, empty zones (none), Instagram zones (bottom ~25 %, right edge) with background only.
6. The structure is the topic's shape (line, loop, tree; a hub only when there is one); the camera follows the action; the explained part stays in the middle safe area.
7. Elements come alive from their shadow, in two tiers (owner, 27 Nov 2026, chose "two tiers"; all through the reel):
   - Tier 1, main elements (cards, nodes, panels, key icons): the full build: the soft shadow lands first, then the element draws itself on above
     it (outline traces, fill and content arrive, a small settle), 0.3-0.5 s, overlapped in a cascade.
   - Tier 2, small things (lines, sub-node dots, labels, small icons): a light build: lines trace in, labels fade in with their shadow, about
     0.2 s, quiet. A label is readable the moment it is spoken.
   - Everything breathes once landed (light breathing, slow idle). Nothing appears without its build; only the subject being explained is lit
     (focus rule); the glitch check still passes (note 2).
Plus (owner, 27 Nov 2026, replaces "frame 0 is the whole map"): frame 0 is the real-life moment the topic is about, the thing viewers already know (a chat window with the reply streaming in, a phone at the till, a tag in a bag), readable at phone size with the hook line on screen; within about 2.5-3 s one quick pull-back (0.5-0.6 s) turns it into the map's first card (a match cut) with the next card's ghost showing; never open on an abstract map. A pause mark after every step number; all panel text 24 px+ at 1080 (or dropped).

## Motion-design pass (owner, 26 Nov 2026), part of every direction card and 3D plan
Before the critic sees a plan, the builder writes, per element and per set piece: its entrance (how it arrives), how groups stack or
cascade, how the set itself builds (boards, walls, floors are animated in, never pre-set), and its life after landing. Taken from the
owner's references (design/references.md), named per line. Nothing may simply appear.

## The card (all channels)
1. Hook: the tension or contrast SHOWN in the first second (a thing breaking, two things side by side, a number that should not be), not a label or a title.
2. Pacing curve: a new visual idea every 1.5-2 s; say where it speeds up (times) and where the ONE held pause sits (time, how long, why).
3. Camera: one named move per shot (push, pull, orbit, rack focus, whip, crane, macro slide), with the shot's times.
4. Light and mood: the key light, the dark share, the one accent colour and what it marks; where the light changes and why.
5. Type motion: the big kinetic headline every beat (a word or number at 120+ px on a 1080 frame), its entrance, its one accent word. Subtitles alone never carry a beat.
6. Transitions: each cut's kind and what causes it (a word, a motion, a match on shape).
7. Sound moments: the 3-5 hits the ear must catch (time, sound, what it lands on), the riser, the silence if any.
8. Rewatch moment: the one surprising moment a viewer would scrub back to see again (time, what happens, why it surprises).
9. Payoff: the last 2 s: what the viewer keeps (the frame, the number, the fix) and how it loops into frame 0.

## Tech: the defaults to avoid (from the gold reel's weak spots and the USB-C reel)
- One framing for the first 8 s (ai-memory r3; r4 fixed it with a low macro and a three-quarter view): change the view by 2.5 s.
- A soft stretch with no new idea (ai-memory 16.8-19.2 s) and a black empty lower third (12.0-13.4 s): plan the pause on purpose (line 2), never by accident.
- A caption over the hero's screen UI (24.6 s): the subject's text and the subtitles never share a place.
- USB-C: a lit grey floor and a pale wash (Output QA LOOK), the same cross-section for 10 s, a plain plastic object, a small subject in a big frame, bar charts for numbers, a fast camera smear with depth blur.
- A number that only appears: it must change on the spoken word (7 -> 4 GB) or count to it.

## Web: the defaults to avoid (from the gold reel's weak spots)
- A hook built word by word, so frame 0 shows one word (tabwiggle: "Why" until 1.2 s): the whole hook and the bug are on screen at frame 0.
- One still camera for the whole reel (tabwiggle 0-15 s): calm is right, but give each beat one deliberate move (a push on the bug, a pull back for the fix).
- The idea carried by 30 px subtitles after the hook leaves (tabwiggle 1.4-15 s): a kinetic headline each beat (+33 PX, WIGGLES 0, the fix's key word).
- The touch dot resting on a label between taps; a pointer line that ends like a cursor.
- The same black and mint look every day: the accent hue moves reel to reel (Output QA HUE); the black stays.

## Turns Out: the defaults to avoid (from the gold reel's weak spots)
- A hook that is a label ("Hard to read.") over a calm board: show the tension in the first second (the menu seen from across the counter, the words vanishing as the eye reaches them).
- One camera distance for 21 s (grey-text): a push into the problem, a pull back for the before and after.
- A 6 s payoff of one picture (grey-text 15-21 s): the payoff lands, holds 1.5-2 s, then loops.
- Small title lines (31 px) as the only type: one kinetic headline per fix (FIX 1 · DARKER at 120+ px on 1080).
- A voice line near the pace limit (render 2 read 4.55 words/s): shorter sentences, a breath after each.

- (owner, 24 Nov 2026, storage-gap) The starter copies the look, light, type and pacing of the gold reel, never its hero object or layout. The critic fails a reel whose main object matches any of our last 5 reels.
