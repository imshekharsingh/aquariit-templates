# showreel-tech-gold3d-sample · independent critic (render v3, preview, 18.4 s, never posted)

Judged on the real MP4 (R2 study/showreel-tech-gold3d-sample-v3-preview.mp4, 1080x1920, 30 fps): one 4x4 contact sheet (0.6-17.9 s), the side-by-side sheet against the tech gold showreel-tech-ai-memory (same 8 relative times), and one full-size frame at 10.9 s for type size. Audio NOT heard (the critic cannot listen): questions 5, 6 and 16 rest on Output QA (PACE, LOUD pass on v3), not on my ears. Read against design/critic.md, rules-tech.md section L, gold.md "colour-world 3D look", references.md R-ref 25 Nov, 3d-kit-phase2.md.

## What works (keep it)
- L1 dark neutral ground, glossy colourful objects: yes. Teal / pink / amber app blocks, jewel tool tiles, purple hub, blurred props (pink blocks, amber slabs) at the sides. It is richer and more colourful than the gold's grey phone shots.
- L4 the picture does the maths: 2.9-6.3 s the cable tangle grows one colour per app, separate and readable as 24 strands; 7.5-9.8 s it collapses into the hub. The 3D number figures (3x8=24 amber, then 3+8=11 mint) are crisp, whole and in their own space under the cast. One clear idea: a shared hub turns N x M wiring into N + M.
- L5 captions: about 60 px at 1080 wide (10.9 s full frame), grey spoken / white current / key word in the thin blue box with square handles ("tools" 1.7 s, "twenty four" 5.2 s, "eleven" 8.6 s, "hub" 10.9 s, "one more cable" 13.2 s). No caption touches an object. No presenter, no top band.
- Nothing cut at the frame edges in any of the 16 frames.

## Findings (with times)
1. **Frame 0 is not a hook** (Q1, Q40/P1). 0-1.7 s: a small grid of tiles in the middle third, the caption "Three apps, eight tools." (a statement, no question, no number), and the lower 35% of the frame is empty floor until the 3x8=24 figure arrives at 5.2 s. The gold opens on a giant "5 GB" at 1.9 s. A stranger has no reason to stop.
2. **One framing for half the reel** (L2 "framing changes every 2-4 s", SHOT VARIETY spirit, Q39 "two kinds of camera move"). 9.8, 10.9, 12.1, 13.2, 14.4, 15.6, 16.7 and 17.9 s are the same shot of the same tower (only a slow drift): 8.6 s of 18.4 s, about 47% in one picture, plus 0.6-1.7 s and 5.2-8.6 s are near-identical wides too. The gold changes place at 3.1 / 8.3 / 11.6 / 16.4 / 19.7 / 21 s. Output QA VARIETY passed, but the eye sees one shot.
3. **The end drifts** (Q7, Q40/P3). 15.9-18.4 s: no caption, no new event, the same still tower. No payoff frame, no return to the opening picture for a loop.
4. **The "real artifact" is unreadable and overlaps** (L3, L8, Q2, Q35). The code card (8.6 s on) has text about 10-12 px at 1080 wide: unreadable on a phone. It also sits over the right tool column (Chat / Maps tiles behind it at 8.6-17.9 s), and the hub at 7.5-8.6 s covers the bottom two tools.
5. **Cables cross the tile labels** (Q26). After the hub lands (9.8-17.9 s) the glowing hub cables run straight up through "Mail", "Calendar", "Files", "Notes", "Chat" on the tool wall (10.9 s full frame): the names under the beams cannot be read at phone size.
6. **Apps and tools share names** (Q3 clarity). The three apps are Notes / Chat / Mail and the tool wall also holds Mail / Notes / Chat. "Three apps, eight tools" then shows the same words twice; a viewer cannot tell which row is which. The new tool at 12.1 s is a small teal tile at the far right, easy to miss on "one more cable".
7. aiLabel: the captions.json entry has no "aiLabel" (Q0b). It is a hidden sample, so not a blocker today; the first real reel in this look needs `"aiLabel": false` (clearly drawn 3D, nothing passes as real footage).
8. Safety: invented app names, no logos, no people, no claims to cite. Pass.

## Against the gold (question 43)
Materials and colour: beats the gold. Camera and story: below it (one tower, no hook number, no payoff). Overall it does not yet match the gold on the PREMIUM line, so it cannot become the gold for this look.

PREMIUM: animation 5.5/10 (t 2.9-6.3 cable growth and t 7.5-8.6 collapse to the hub are good; t 9.8-18.4 one drifting shot), cleanliness 6.5/10 (captions clean, edges clean; t 8.6-17.9 code card over the tool column, hub cables over the tool names), premium 7/10 (glossy tiles, rim light, blurred props, crisp 3D figures; t 0-2 and 15.9-18.4 the cheap frames); weakest: 9.8-18.4 s, the same tower framing with an unreadable card, fix below.

EXACT FIX (one more render, v4; needs the owner's yes via the owner chat as a 4th render of this sample):
1. Hook, 0-1.5 s: open close on the cable tangle already wired (end state of 6.3 s) with the 3x8=24 figure big in the lower third from frame 0, and change the first line to a question, e.g. "Why does adding one tool mean three new cables?" (6-9 words, PACE). The calm tile grid comes after, not before.
2. Camera path: add three distinct keys after the hub lands: 9.8 s a low push-in to the hub (hub and its label fill a third of the frame), 12.1 s a side orbit to the new tool tile as its ONE cable draws (tile at least 1/6 of the width, next to the frame centre), 14.4 s a pull back to the full wide for the payoff. No framing held over 3 s.
3. Code card: either remove it, or bring it to the camera (a front plane, at least 34 px text at 1080 wide, max 4 short lines, e.g. `{"tool": "calendar"}` / `200 OK`) in its own clear space left of the tower, never over a tile, for 2 s on "talks to the hub once".
4. Hub cables: route them to the tile's bottom edge (as the pre-hub cables do) or put the tool names on the tile top so no beam crosses a word.
5. Rename the tool wall so no name repeats an app (e.g. Calendar, Files, Maps, Pay, Photos, Docs, Tasks, Music), keeping Notes / Chat / Mail as the three apps.
6. End, 15.9-18.4 s: a payoff frame, caption shown through the last frame ("Same apps, same tools, far less wiring." held), then the last 0.5 s returns to the opening tangle framing so the replay loops.
7. captions.json: add `"aiLabel": false`.

ENHANCE: put "24 → 11" as the cover and first-second picture: two big 3D numbers, the 24 crossed out by the hub sliding in; a number drop is what made the gold stop thumbs.

20. CRITIC: NOT READY
