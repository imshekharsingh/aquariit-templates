# Review: showreel-c3-price-list (c3, rebuilt 27 Nov 2026, posts 27 Nov at 17:00 IST once the critic says READY)

Turns Out design series, queue of 10 (design/c3-queue.md), rebuilt on the improved kit (rules-c3.md V1-V3, B1-B3, P1-P2) from the gold reel showreel-c3-grey-text; the next held design in its order (design/c3-research-2026-11-24.md).
Scene scripts/channel3/design/prices.js (copy for the tools: scripts/channel3/price-list.html). AUTO lines from preflight.mjs, stills.mjs, flow.mjs and
qa/align.mjs on scripts/channel3/price-list.json.

1. Topic: PASS: a salon price list with every row centred so the prices jump left and right, fixed in three moves: one right edge for prices, same-width (tabular) digits, dot leaders to each name; one fix anyone can use the same day; invented names only, no real brand, logo or person (design/safety.md); the design series the owner approved (21 Nov)
2. Frame 0: PASS: SUBJECT FILL: 99% at frame 0; the claim alone in the top band from frame 0 ("These prices are hard to compare."), the design fully lit on its stage, its problems ringed with short labels; title, captions and dial wait for the claim
3. Safe zone: PASS: SAFE ZONE: ok (dial, title, captions, hook, chips, labels, rulers and the design inside x 60-960, y 250-1570 on the 0.5 s scan)
4. No overlap: PASS: OVERLAP: none; BAND: clear; HOOK: clear of the subject
5. Motion: PASS: STATIC STRETCH: none (least change 1.0 at 1 s, median 5.6); EMPTY FRAMES: none (scanned 32 moments, least detail 80.2 at 2.5 s); TEXT FIT: all text inside its box
6. Subtitles: PASS: SUBTITLES: at least 52 px, at most 6 words a line; phrases of up to 4 words, spoken words white, key words amber
7. Voice: PASS: seven spoken sentences with breaths (voice.gap 0.3-0.4 s), no label sentences: "These prices are hard to compare. They jump around. Turns out, numbers need one edge. First, line them up on the right. Next, use digits of one width. Then add dots to each name. Now the cheapest stands out."; the first sentence has 6 words (hook pace ok); C3 SCRIPT CHECK: 0 problems; PREFLIGHT voice fits the 20 s reel
8. Sound: PASS: the design vocabulary (DT.S, drum-free): sting, ticks as the ring lands and as a red zigzag joins the prices, a drag and rising snaps as each price meets the right edge, a swap as the digits change width, short drags as the dots draw, the reveal chord on "cheapest", the paper flip at the proof, two soft lands and a done note in the tail
9. Payoff: PASS: ends on the lined-up list, fully lit, the cheapest row (Beard 100) in green with an eye line down the price column, the BEFORE thumbnail tilted under the list, EDGE / WIDTH / DOTS ticks and a green frame; no call to action on screen
10. Facts: PASS: tabular figures are set on a fixed width and are essential for vertically aligned columns, as in grids of numbers (Butterick, Alternate figures); tables are the right tool for grids of numbers and side-by-side layouts (Butterick, Tables); the scene switches Space Grotesk to its real tabular figures (font-variant-numeric: tabular-nums); the salon and prices are invented; sources (read in full in the Sources run 44949452447): Alternate figures (Butterick's Practical Typography); Tables (Butterick's Practical Typography)
11. Post data: PASS: captions.json entry (c3, engine design, postOn 2026-11-27, postAt 17:00, concept, aiLabel false); caption: the claim, the 3 fixes as a numbered list, a save ask and one question; 6 keywords, 5 hashtags, 2 sources
12. Review file: PASS: this file and the direction card with its stills check line; local preflight-all (Output QA preview, LOOK vs gold, ELEMENTS, TEXT CLEAR) passed before the render
13. After the render: render 1 (run 45948452212) failed Output QA on two measures (PACE: "First, line them up on the right." 5.22 words/s; ELEMENTS: 3.1 s with nothing new at 16.9-20 s); fixed for render 2 (the fix render): that sentence is now "First, align them to the right." (6 words), an extra spark at the end and the reel cut to 19.2 s; preflight-all PASS; render 2 result below when it is in
14. Cuts: PASS: FLOW: cuts 0
15. Dead runs: PASS: FLOW: dead runs none
16. Continuity: PASS: FLOW: continuity 97% (median step 1.2, 0 declared transitions)
17. Strobes: PASS: FLOW: strobes 0
18. Element sound (web): n/a (Turns Out; every effect in item 8)
19. Journey: PASS: the claim over the centred price list, a red zigzag joining the jumping prices, each fix done on screen (a guide drops and every price snaps to it, digit-column guides as the figures change width, dot leaders draw row by row), then a green line runs down the column to the cheapest
20. Depth and life: PASS: the design engine (captions.json "engine": "design"): the salon wall behind the list moving from dim to lit as fixes land, the fern logo swaying, the camera drifting with a push per fix, spark bursts, motion blur in the render

Owner feedback (design/owner-feedback.md) against the stills: "doesn't look aligned": ALIGN where the scene declares groups; "drum-like sounds": no drum kinds; "frame 0": one message first, the flaw obvious at phone size; "feels useless": every element on screen takes part; numbers on screen never run ahead of the voice (end states as words); "same background": its own stage.


Rebuild notes (27 Nov): the before is plain centring with ordinary proportional digits (no extra scatter, B1); the list is one ring only (CENTRED ROWS) plus a red zigzag for "they jump around"; the stage is a dark teal wall and a wood counter (LOOK vs gold passes); the chips sit in their own band above the board; digit-column guides sit above and below the figures, never through them; the cheapest row is shown by colour and an eye line, no box close to its neighbours.

PREMIUM: animation 7/10 (t 6-13), cleanliness 7.5/10 (t 2.5), premium 7/10 (t 18); weakest: t 12-14, the dots draw while the title line cross-fades.

Critic: PENDING.
PREFLIGHT-ALL: PASS b4f1a7de (showreel-c3-price-list, 32 s)
