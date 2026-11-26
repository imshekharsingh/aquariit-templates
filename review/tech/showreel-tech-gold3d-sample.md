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

20. CRITIC (v3): NOT READY

---

# showreel-tech-gold3d-sample · independent critic, second pass (render v4, preview, 18.5 s, never posted)

v3 verdict (first critic, 26 Nov 2026): NOT READY (weak hook, one tower framing for half the reel, unreadable code card, cables over names, repeated names, no payoff).

Judged on the real MP4 (R2 study/showreel-tech-gold3d-sample-v4-preview.mp4, 1080x1920, 30 fps, 18.47 s): one 4x4 contact sheet (0.6-17.9 s) and two full-size frames (0.6 s, 9.8 s). Compared with the gold.md description of the tech gold (not fetched, to stay lean). Audio NOT heard (the critic cannot listen): Output QA PACE and LOUD pass on v4; questions 5, 6 and 16 rest on that.

## The v3 EXACT FIX list, item by item
1. Hook from frame 0: **DONE.** 0.0 s opens on the wired tangle, "3x8=24" big in the lower fifth, question caption "Why does one new tool add three cables?" on screen from 0.6 s. A stranger sees a busy, colourful puzzle with a number.
2. Three distinct camera moves and a loop home: **PARTLY.** After the hub: 9.8 s low push-in (good), 12.1 s side orbit to the "New" tile (good), 13.3 s pull-back to the wide (good). But 0.6-5.2 s is one framing (only the caption changes, about 5 s) and 13.3-18.5 s is one framing (about 5 s), both over D2's 3 s. The last frame is the opening wide, so the loop framing is there.
3. Readable card or none: **DONE** (code card removed). Small leftover: the hub's sub-line "one shared standard" is about 24 px at 1080 wide (9.8 s), too small to read on a phone.
4. Cables not across names: **PARTLY.** After the hub (8.7-18.5 s) the green cables land on the tile side edges, no name crossed. Before it (0-6.3 s) the tangle runs over the bottom tool row: "Photos" and the 8th tile are hidden under cables at 0.6 s.
5. Distinct names: **DONE.** Apps Notes / Chat / Mail; tools Tasks, Music, Calendar, Docs, Files, Maps, Photos, + one. New tool is a big teal "New" tile beside the camera at 12.1 s.
6. Held payoff: **PARTLY.** "Same apps, same tools, far less wiring." is held through the last frame with "3+8=11" (14.4-18.5 s), but the picture does not change for about 5 s: a drift without an event (D7).
7. aiLabel: **DONE** (`"aiLabel": false` in captions.json).

## New findings on v4
- **The hub hides two of the eight tools** (7.5-18.5 s, 9.8 s full frame): the hub block sits on the bottom tool row, so only six tools show while the figure says "3+8=11". The picture no longer does the maths (L4) and it is an overlap.
- **Cut name in the push-in** (9.8-11.0 s): "Notes" is cut at the left edge ("otes") and Mail at the right; 12.1 s the pink tile is cut left. A close shot may crop objects, but not a name.
- Tool names on the wides are about 20-22 px at 1080 wide: secondary labels, acceptable, but they cannot be read on a phone.

## The whole reel
- Hook in the first second: yes (number + question + busy picture).
- One clear idea: yes, a shared hub turns N x M wiring into N + M; captions match the picture.
- Readable at phone size: captions yes (about 60 px, blue-boxed key word, dark band); hub sub-line and tool names no.
- Premium look: yes; glossy jewel tiles, rim light, glowing separate cables, crisp 3D figures, blurred props. Better materials than the gold.
- Cut or overlap: hub over two tools (7.5-18.5 s); "Notes" cut at 9.8-11.0 s.
- Pacing and shot variety: the middle (7.5-13.3 s) is lively; the first 5 s and the last 5 s are each one still framing. Against the gold (new place every 3-5 s, number drop as the hook) it now matches the hook but not the rhythm.
- Safety: invented app names, no logos, no people, no claims to cite. Pass.

PREMIUM 6.5 / 7 / 7.5 (animation 6.5: t 7.5-13.3 collapse, push-in, orbit and pull-back are good, t 0.6-5.2 and t 13.3-18.5 are held; cleanliness 7: captions and edges clean, hub over two tools from t 7.5, "otes" at t 9.8; premium 7.5: materials and colour above the gold). Weakest: t 0.6-5.2 and t 13.3-18.5, one framing each.

## EXACT FIX (render v5; this sample already used 4 renders, so the owner chat asks the owner first with the cost)
1. Opening, 0-5.2 s: add one slow camera move at about 2.6 s (a low push-in or a 15-20 degree orbit around the tangle, at least 10 % change in scale), so no framing holds over 3 s. Keep the frame-0 picture as is.
2. Hub: place it between the tool wall and the app row (lower and nearer the apps), or lift the tool wall by one tile height, so all eight tools stay visible and whole from 7.5 s to the end.
3. Push-in, 9.8-11.0 s: pull the camera back about 10 % (or bring the three apps closer together) so "Notes", "Chat" and "Mail" are whole in frame.
4. Tangle, 0-6.3 s: route the cables to the side edges of the bottom tool row (as after the hub) so "Photos" and the 8th tile are not under cables.
5. End, 13.3-18.5 s: one event inside the last 2 s with the caption still held: from about 16.3 s ease the camera back to the exact frame-0 camera (small orbit), and pulse the New tile's single cable once.
6. Hub sub-line: 34 px or more at 1080 wide, or drop it (the word HUB is enough).

20. CRITIC (v4): NOT READY

---

# showreel-tech-gold3d-sample · independent critic, third pass (render v5, preview, 18.45 s, never posted)

v4 verdict (second critic, 26 Nov 2026): NOT READY (held 5 s framings at the start and end, hub over two tools, "Notes" cut in the push-in, tangle over the bottom tool row, end drift, 24 px hub sub-line).

**The MP4 was NOT judged: the fetch was refused.** This critic session's network refused the app host (templates.aquariit.com: the proxy answered 403 to the tunnel, a policy denial, so it was not retried). The read key is not set up for this session's environment. Per the brief, I do not judge from scene frames silently and I do not pass a reel I have not seen. Output QA on v5 (builder's run): PASS (LOUD -14.6 LUFS, PACE, VARIETY 11 %, LOOK, NUMBERS, DEAD, SHEEN, EDGES), WARN LICENCE and WARN HERO as on v4.

What I did look at, openly and NOT as the verdict: the builder's scene stills sheet review/tech/study-25nov/kit-phase2-v5-glow.jpg (5 stills, not the rendered MP4, no times).

## The v4 EXACT FIX list, item by item (stills only; each needs the MP4 to confirm)
1. Opening camera move at about 2.6 s: **NOT CHECKED.** A move cannot be seen on stills; stills 1 and 2 do differ in scale (about 10 %), which suggests it is there.
2. Hub between the wall and the apps, all eight tools whole: **LOOKS DONE** on the stills (hub sits under the wall, above Notes / Chat / Mail; Tasks, Music, Calendar, Docs, Files, Maps, Pay, Photos all whole).
3. Push-in shows Notes, Chat and Mail whole: **LOOKS DONE** on still 4 (all three names whole, Notes and Mail near the edges but not cut). Needs the MP4 for the 9.8-11.0 s span.
4. Tangle off the bottom tool row: **LOOKS DONE** on stills 1-2 (cables loop outside the wall; no name under a cable).
5. End event in the last 2 s (turn home, New cable pulse): **NOT CHECKED** (motion; still 5 shows the New tile with its one cable and the held caption).
6. Hub sub-line 34 px or dropped: **DONE** (dropped; only "HUB" on the block).

## Provisional notes from the stills (no times, to check on the MP4)
- Glow is down as the owner asked: cables read as clean coloured lines, no halo wash; the floor is darker. Good.
- The word "HUB" on the block is small on the wides (stills 3 and 5, roughly 20 px at 1080 wide); the 3D numbers and the captions carry the idea, so it is secondary, but it should be checked on a phone frame.
- Tool names on the wides stay tiny (secondary labels, as on v4).
- The "New" tile at the right of the hub (still 5) is small on the wide; it should be clearly bigger in the 12.1 s orbit.

PREMIUM: not scored (no MP4 seen). Animation, cleanliness and premium scores need the rendered video at phone size with times; scores from stills would be guesses.

## EXACT FIX (no v6 render)
Nothing in the picture is asked to change yet. The fix is the review, not the reel:
1. Re-run this critic in a session whose environment can reach the app host (the read key as a network secret for templates.aquariit.com, as the v3 and v4 critics had), fetch R2 study/showreel-tech-gold3d-sample-v5-preview.mp4, and judge it (4x4 contact sheet + up to two full frames), replacing this section's verdict.
2. Do not spend a 6th render on this sample before that verdict.

20. CRITIC: NOT READY

---

# showreel-tech-gold3d-sample · independent critic, fourth pass (render v5, preview, 18.47 s, never posted; main account)

The third pass could not fetch the MP4; this pass judged the real video (R2 study/showreel-tech-gold3d-sample-v5-preview.mp4, 1080x1920, 30 fps, 18.47 s) from the main account: one 4x4 contact sheet at phone size (0.0-18.3 s), two full frames (1.3 s, 12.1 s) and a frame-difference strip every 0.5 s (picture change, a text check for held framings). Audio NOT heard (the critic cannot listen): Output QA LOUD -14.6 LUFS and PACE pass; questions 5, 6 and 16 rest on that.

## The v4 EXACT FIX list, item by item
1. Opening camera move, no framing over 3 s: **DONE.** 0.0-1.5 s pull-back with a turn, a short settle at 2.0-2.6 s, a second move from 3.0 s (3.9 s and 5.2 s are framed wider than 2.6 s). The difference strip never stays quiet for more than about 1 s anywhere in the reel. The frame-0 hook is unchanged ("3x8=24", the question caption, the full tangle).
2. Hub clear of the tools: **DONE.** From 7.5 s to the end the hub floats between the wall and the apps; Tasks, Music, Calendar, Docs, Files, Maps, Pay and Photos are all visible and whole on every sheet frame. The picture now shows 3 app cables and 8 tool cables under "3+8=11".
3. Push-in names whole: **DONE.** 9.8-11.0 s: "Notes", "Chat" and "Mail" are whole; the Notes and Mail tiles touch the frame edges but no name is cut. 12.1 s (full frame): all three names whole.
4. Tangle off the bottom tool row: **DONE.** 0.0-6.3 s (full frame 1.3 s): the cables loop outside the wall's sides and land on the tile edges; Pay and Photos are clear.
5. End event in the last 2 s: **DONE.** 14.4 s wide, 16.3 s closer, 17.4 s turned, 18.3 s back on the frame-0 framing (wall and apps in the same place as 0.0 s); "Same apps, same tools, far less wiring." held. The New cable pulse is too small to confirm on stills; the camera event alone answers the fix.
6. Hub sub-line: **DONE** (dropped; "HUB" only).

## The whole reel
- Hook in the first second: yes (busy colourful tangle, "3x8=24", the question).
- One clear idea, the picture does the maths (L4): yes; the 24 cables collapse into a hub and 11 cables, and the number changes with it at 8.7 s.
- Readable at phone size: captions yes (two-tone, key word boxed in blue); the 3D numbers yes. Tool names and "HUB" are small secondary labels (about 16-20 px at 1080 wide): fine for a sample, not for a fact a viewer must read.
- Question 47 (text spacing and alignment): captions top-centre, number bottom-centre, tile names inside their tiles; no text touches another text, a cable or a border on any sheet frame. Pass.
- Cut or overlap: none. A small specular glint sits on the Mail tile's top edge at 12.1 s; "Mail" stays readable.
- Pacing and shot variety: the camera keeps moving (push-in 9.0-10.5 s, orbit to New 11.5-13.0 s, pull-back 13.5-14.5 s, return 16.3-18.3 s). Output QA VARIETY 11 %.
- Look: dark floor, jewel tiles, clean coloured cables with the calmer glow, depth of field on the props. Premium, above the flat tech gold.
- Safety: invented app names, no logos, no people, no claims to cite. Pass.

## Notes for the gold and the next 3D builds (not blockers)
- From 12.1 s the New tile adds a 12th cable while the figure still reads "3+8=11"; the caption says "one more cable", so it reads, but a small "+1" by the New cable (or "3+9=12" at 13.3 s) would make the picture and the number agree exactly.
- The New tile reuses the music-note icon of the Music tool; give it its own icon.
- The sample is 18.5 s; daily 3D reels keep L6's 20-35 s.
- No readable real artifact (L3) since the code card was dropped; a daily reel needs one at 34 px or more in its own space (D4).

PREMIUM 7.5 / 8 / 8 (animation 7.5: a move in every part, the loop return at 16.3-18.3 s, the 2.0-2.6 s settle is the quietest moment; cleanliness 8: no name cut or covered, nothing over the captions, all eight tools whole after the hub; premium 8: materials, colour and calmer glow). Weakest: 2.0-2.6 s, the short settle before the second opening move.

20. CRITIC: READY
