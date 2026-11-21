# Review: showreel-c3-price-list (c3, no date: onGo, the owner posts on response)

Turns Out design series, queue of 10 (owner, 21 Nov 2026: "add 10 more to Turns Out upload section, I'll decide upload time"; design/c3-queue.md).
Scene scripts/channel3/design/prices.js (copy for the tools: scripts/channel3/price-list.html). AUTO lines from preflight.mjs, stills.mjs, flow.mjs and
qa/align.mjs on scripts/channel3/price-list.json.

1. Topic: PASS: a salon price list with every row centred so the prices jump left and right, fixed in three moves: one right edge for prices, same-width (tabular) digits, dot leaders to each name; one fix anyone can use the same day; invented names only, no real brand, logo or person (design/safety.md); the design series the owner approved (21 Nov)
2. Frame 0: PASS: SUBJECT FILL: 99% at frame 0; the claim alone in the top band from frame 0 ("These prices are hard to compare."), the design fully lit on its stage, its problems ringed with short labels; title, captions and dial wait for the claim
3. Safe zone: PASS: SAFE ZONE: ok (dial, title, captions, hook, chips, labels, rulers and the design inside x 60-960, y 250-1570 on the 0.5 s scan)
4. No overlap: PASS: OVERLAP: none; BAND: clear; HOOK: clear of the subject
5. Motion: PASS: STATIC STRETCH: none (least change 1.0 at 1 s, median 5.6); EMPTY FRAMES: none (scanned 32 moments, least detail 80.2 at 2.5 s); TEXT FIT: all text inside its box
6. Subtitles: PASS: SUBTITLES: at least 52 px, at most 6 words a line; phrases of up to 4 words, spoken words white, key words amber
7. Voice: PASS: PREFLIGHT voice: 152 letters, 7 sentences, about 11.8 s at speed 1 in one take (reel 16 s, voice must end by 15.4 s): fits; HOOK PACE: the first sentence has 6 words: ok (6 or fewer); PRONUNCIATION: 0 overrides used; no unchecked words; every sentence 6 words or fewer (c3-queue.md lessons: no 7+ word line read fast)
8. Sound: PASS: the design vocabulary (core.js DT.S, drum-free, synth cues) on the tense-to-bright score (DT.score): opening sting, ticks as a red zigzag joins the jumping prices, a drag and rising snaps as each price lands on the right edge, letter flicks as the digits switch width, a run of short drags as the dot leaders draw, the reveal chord on the payoff
9. Payoff: PASS: ends on the fixed design, fully lit, a green eye line running down the price column to the cheapest row, framed; no call to action on screen
10. Facts: PASS: tabular figures are set on a fixed width and are essential for vertically aligned columns, as in grids of numbers (Butterick, Alternate figures); tables are the right tool for grids of numbers and side-by-side layouts (Butterick, Tables); the scene switches Space Grotesk to its real tabular figures (font-variant-numeric: tabular-nums); the salon and prices are invented; sources (read in full in the Sources run 44949452447): Alternate figures (Butterick's Practical Typography); Tables (Butterick's Practical Typography)
11. Post data: PASS: captions.json entry (c3, engine design, concept, onGo: no date, owner posts on response); caption: the claim, the fixes as a numbered list with one reason each, a save ask and one question; 6 keywords, 5 hashtags; 2 sources
12. Review file: PASS: this file, items 1-12 and 14-20 before the one render; ALIGN: ok (2 groups); local Output QA copy: FILL median 92% (6% of samples under 80%), GRADE subject vs surroundings 0.49, ELEMENTS longest gap 1.5 s at 14.5-16.0 s
13. After the render: PASS: render 1 (run 44953978128): OUTPUT QA PASS (PACE 2.74 words/s, GRADE 0.49, FILL median 92%, ELEMENTS longest gap 1.5 s, NUMBERS none past the voice, DEAD none, SOUND every cue audible, LOUD about -14 LUFS)
14. Cuts: PASS: FLOW: cuts 0
15. Dead runs: PASS: FLOW: dead runs none
16. Continuity: PASS: FLOW: continuity 97% (median step 1.2, 0 declared transitions)
17. Strobes: PASS: FLOW: strobes 0
18. Element sound (web): n/a (Turns Out; every effect in item 8)
19. Journey: PASS: the claim over the centred price list, a red zigzag joining the jumping prices, each fix done on screen (a guide drops and every price snaps to it, digit-column guides as the figures change width, dot leaders draw row by row), then a green line runs down the column to the cheapest
20. Depth and life: PASS: the design engine (captions.json "engine": "design"): the salon wall behind the list moving from dim to lit as fixes land, the fern logo swaying, the camera drifting with a push per fix, spark bursts, motion blur in the render

Owner feedback (design/owner-feedback.md) against the stills: "doesn't look aligned": ALIGN where the scene declares groups; "drum-like sounds": no drum kinds; "frame 0": one message first, the flaw obvious at phone size; "feels useless": every element on screen takes part; numbers on screen never run ahead of the voice (end states as words); "same background": its own stage.

Critic: PENDING (an independent session writes CRITIC: READY or NOT READY; the owner's watch decides the post).
