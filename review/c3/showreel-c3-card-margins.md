# Review: showreel-c3-card-margins (c3, no date: onGo, the owner posts on response)

Turns Out design series, queue of 10 (owner, 21 Nov 2026: "add 10 more to Turns Out upload section, I'll decide upload time"; design/c3-queue.md).
Scene scripts/channel3/design/card.js (copy for the tools: scripts/channel3/card-margins.html). AUTO lines from preflight.mjs, stills.mjs, flow.mjs and
qa/align.mjs on scripts/channel3/card-margins.json.

1. Topic: PASS: a business card with every line pushed to its edges, fixed in three moves: pull everything inside a margin, fewer lines, one strong corner holding the text block; one fix anyone can use the same day; invented names only, no real brand, logo or person (design/safety.md); the design series the owner approved (21 Nov)
2. Frame 0: PASS: SUBJECT FILL: 66% at frame 0; the claim alone in the top band from frame 0 ("This business card feels cheap."), the design fully lit on its stage, its problems ringed with short labels; title, captions and dial wait for the claim
3. Safe zone: PASS: SAFE ZONE: ok (dial, title, captions, hook, chips, labels, rulers and the design inside x 60-960, y 250-1570 on the 0.5 s scan)
4. No overlap: PASS: OVERLAP: none; BAND: clear; HOOK: clear of the subject
5. Motion: PASS: STATIC STRETCH: none (least change 0.8 at 14 s, median 5.2); EMPTY FRAMES: none (scanned 32 moments, least detail 77.4 at 4 s); TEXT FIT: all text inside its box
6. Subtitles: PASS: SUBTITLES: at least 52 px, at most 6 words a line; phrases of up to 4 words, spoken words white, key words amber
7. Voice: PASS: PREFLIGHT voice: 165 letters, 8 sentences, about 12.8 s at speed 1 in one take (reel 16 s, voice must end by 15.4 s): fits; HOOK PACE: the first sentence has 5 words: ok (6 or fewer); PRONUNCIATION: 0 overrides used; no unchecked words; every sentence 6 words or fewer (c3-queue.md lessons: no 7+ word line read fast)
8. Sound: PASS: the design vocabulary (core.js DT.S, drum-free, synth cues) on the tense-to-bright score (DT.score): opening sting, a stamp on "edges", a pull as the margin guides draw and the content moves inside, three short airs as lines strike and slide away, a drag and a snap as the block lands in its corner, a shimmer as the logo turns gold, the reveal chord on the payoff
9. Payoff: PASS: ends on the fixed design, fully lit, the calm card with its logo turning gold; no call to action on screen
10. Facts: PASS: bigger margins frame the text and give a comfortable line length; don't fear white space (Butterick, Page margins); elements close together read as one group, whitespace separates groups (Nielsen Norman Group, Proximity Principle in Visual Design); the name, studio and email are invented; sources (read in full in the Sources run 44949452447): Page margins (Butterick's Practical Typography); Proximity Principle in Visual Design (Nielsen Norman Group)
11. Post data: PASS: captions.json entry (c3, engine design, concept, onGo: no date, owner posts on response); caption: the claim, the fixes as a numbered list with one reason each, a save ask and one question; 6 keywords, 5 hashtags; 2 sources
12. Review file: PASS: this file, items 1-12 and 14-20 before the one render; ALIGN: ok (1 groups); local Output QA copy: FILL median 90% (6% of samples under 80%), GRADE subject vs surroundings 0.48, ELEMENTS longest gap 1.4 s at 0.4-1.8 s
13. After the render: PASS: render 1 (run 44956621843): OUTPUT QA PASS (PACE 2.49 words/s, GRADE 0.47, FILL median 91%, ELEMENTS longest gap 1.4 s, NUMBERS none past the voice, DEAD none, SOUND every cue audible, LOUD about -14 LUFS)
14. Cuts: PASS: FLOW: cuts 0
15. Dead runs: PASS: FLOW: dead runs none
16. Continuity: PASS: FLOW: continuity 99% (median step 1.0, 0 declared transitions)
17. Strobes: PASS: FLOW: strobes 0
18. Element sound (web): n/a (Turns Out; every effect in item 8)
19. Journey: PASS: the claim over the crammed card, its edges ringed, each fix done on screen (margin guides draw and are measured as everything moves inside, three lines strike and slide away, the text block snaps into the bottom-left corner on an L guide), then the calm card
20. Depth and life: PASS: the design engine (captions.json "engine": "design"): the desk behind the card moving from dim to lit as fixes land, the logo turning gold at the end, the camera drifting with a push per fix, spark bursts, motion blur in the render

Owner feedback (design/owner-feedback.md) against the stills: "doesn't look aligned": ALIGN where the scene declares groups; "drum-like sounds": no drum kinds; "frame 0": one message first, the flaw obvious at phone size; "feels useless": every element on screen takes part; numbers on screen never run ahead of the voice (end states as words); "same background": its own stage.

Critic: PENDING (an independent session writes CRITIC: READY or NOT READY; the owner's watch decides the post).
