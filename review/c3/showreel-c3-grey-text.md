# Review: showreel-c3-grey-text (c3, onGo: ready 24 Nov 2026, the owner posts it in the 13:00-21:00 IST window)

Turns Out design series, queue of 10 (owner, 21 Nov 2026: "add 10 more to Turns Out upload section, I'll decide upload time"; design/c3-queue.md).
Scene scripts/channel3/design/contrast.js (copy for the tools: scripts/channel3/grey-text.html). AUTO lines from preflight.mjs, stills.mjs, flow.mjs and
qa/align.mjs on scripts/channel3/grey-text.json.

1. Topic: PASS: a café specials board in grey text on beige, fixed in three moves: darker words, a lighter board, checking the contrast ratio; one fix anyone can use the same day; invented names only, no real brand, logo or person (design/safety.md); the design series the owner approved (21 Nov)
2. Frame 0: PASS: SUBJECT FILL: 93% at frame 0; the claim alone in the top band from frame 0 ("Grey on beige."), the design fully lit on its stage, its problems ringed with short labels; title, captions and dial wait for the claim
3. Safe zone: PASS: SAFE ZONE: ok (dial, title, captions, hook, chips, labels, rulers and the design inside x 60-960, y 250-1570 on the 0.5 s scan)
4. No overlap: PASS: OVERLAP: none; BAND: clear; HOOK: clear of the subject
5. Motion: PASS: STATIC STRETCH: none (least change 2.1 at 14 s, median 5.9); EMPTY FRAMES: none (scanned 32 moments, least detail 73.5 at 2 s); TEXT FIT: all text inside its box
6. Subtitles: PASS: SUBTITLES: at least 52 px, at most 6 words a line; phrases of up to 4 words, spoken words white, key words amber
7. Voice: PASS: PREFLIGHT voice: 148 letters, 8 sentences, about 11.5 s at speed 1 in one take (reel 16 s, voice must end by 15.4 s): fits; HOOK PACE: the first sentence has 3 words: ok (6 or fewer); PRONUNCIATION: 0 overrides used; no unchecked words; every sentence 6 words or fewer (c3-queue.md lessons: no 7+ word line read fast)
8. Sound: PASS: the design vocabulary (core.js DT.S, drum-free, synth cues) on the tense-to-bright score (DT.score): opening sting, a stamp on "read it", rising plucks as each line darkens, a shimmer as the board lightens, two eyedropper clicks and a stamp as the checker turns to PASS, the reveal chord on the payoff
9. Payoff: PASS: ends on the fixed design, fully lit, green ticks on each special and a frame on the board; no call to action on screen
10. Facts: PASS: contrast is the difference in luminance between text and background; WCAG asks for at least 4.5:1 for normal text and 3:1 for large text; #777777 on white is 4.47:1 and fails (WebAIM, Contrast and Color Accessibility; WCAG 2.2 SC 1.4.3); the checker in the scene computes the real WCAG ratio of the colours on screen (before about 1.6:1, after about 14:1) and shows only FAIL / PASS and the 4.5:1 minimum as the voice says it; the café is invented; sources (read in full in the Sources run 44949452447): Contrast and Color Accessibility (WebAIM); Understanding SC 1.4.3 Contrast (Minimum) (W3C WCAG 2.2)
11. Post data: PASS: captions.json entry (c3, engine design, concept, onGo: no date, owner posts on response); caption: the claim, the fixes as a numbered list with one reason each, a save ask and one question; 6 keywords, 5 hashtags; 2 sources
12. Review file: PASS: this file, items 1-12 and 14-20 before the one render; ALIGN: ok (1 groups); local Output QA copy: FILL median 92% (9% of samples under 80%), GRADE subject vs surroundings 0.60, ELEMENTS longest gap 1.3 s at 13.4-14.7 s
13. After the render: PASS: render 1 (run 44953976460): OUTPUT QA PASS (PACE 2.82 words/s, GRADE 0.58, FILL median 91%, ELEMENTS longest gap 1.4 s, NUMBERS none past the voice, DEAD none, SOUND every cue audible, LOUD about -14 LUFS)
14. Cuts: PASS: FLOW: cuts 0
15. Dead runs: PASS: FLOW: dead runs none
16. Continuity: PASS: FLOW: continuity 98% (median step 1.2, 0 declared transitions)
17. Strobes: PASS: FLOW: strobes 0
18. Element sound (web): n/a (Turns Out; every effect in item 8)
19. Journey: PASS: the claim over the faint board, "hard to read" called out, each fix done on screen (a scan darkens every line, the board lightens while selected, an eyedropper samples text and board and the checker turns FAIL to PASS), then each special ticked
20. Depth and life: PASS: the design engine (captions.json "engine": "design"): the café counter behind the board moving from dim to lit as fixes land, the colours changing live, the camera drifting with a push per fix, spark bursts, motion blur in the render

Owner feedback (design/owner-feedback.md) against the stills: "doesn't look aligned": ALIGN where the scene declares groups; "drum-like sounds": no drum kinds; "frame 0": one message first, the flaw obvious at phone size; "feels useless": every element on screen takes part; numbers on screen never run ahead of the voice (end states as words); "same background": its own stage.

Rebuild (24 Nov 2026): the scene is now scripts/channel3/design/contrast2.js (the improved kit: rules-c3.md V1-V3, B1-B3, P1-P2), built as the preview scripts/previews/c3-greytext2.json; items 1-12 and 14-20 above describe the first build and still hold on the new scene's AUTO lines (SUBJECT FILL 93%, SAFE ZONE ok, OVERLAP none, BAND clear, FLOW cuts 0, dead runs none, continuity 96%, CUE TIMES ok, 24 Nov stills). The reel's MP4 is that preview's render 3 (Showreel run 45331264071, 21.2 s, from main 676ec64), promoted to v/showreel-c3-grey-text.mp4; no separate render.
13 (render 3). After the render: PASS: OUTPUT QA PASS (run 45338746481: LOUD -14.0 LUFS, EDGES none, GRADE 0.68, NUMBERS none past the voice, DEAD none, FILL median 92%, ELEMENTS longest gap 2.6 s); frames read at phone size against design/owner-feedback.md (voice in full sentences with a breath after each, each fix on its word, a believable before, BEFORE next to AFTER on the last frame).
Owner: Like on the preview (Inbox, 24 Nov 2026).

CRITIC: READY (render 3; independent session, 24 Nov 2026; detail and PREMIUM 7.5 / 7.5 / 7.5 in review/previews/c3-design-rebuilds.md, "B, render 3"; not heard: the voice's tone).
