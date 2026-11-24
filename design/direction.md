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
