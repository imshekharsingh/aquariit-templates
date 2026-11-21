# Review: showreel-c3-text-on-photo (c3, no date: onGo, the owner posts on response)

Turns Out design series, queue of 10 (owner, 21 Nov 2026: "add 10 more to Turns Out upload section, I'll decide upload time"; design/c3-queue.md).
Scene scripts/channel3/design/photo.js (copy for the tools: scripts/channel3/text-on-photo.html). AUTO lines from preflight.mjs, stills.mjs, flow.mjs and
qa/align.mjs on scripts/channel3/text-on-photo.json.

1. Topic: PASS: a gig poster on a lamp post at night whose thin pale text sits on a busy, bright crowd photo, fixed in three moves: darken the photo, put the title on a solid band, one bold colour for the text; one fix anyone can use the same day; invented names only, no real brand, logo or person (design/safety.md); the design series the owner approved (21 Nov)
2. Frame 0: PASS: SUBJECT FILL: 88% at frame 0; the claim alone in the top band from frame 0 ("Nobody can read this poster."), the design fully lit on its stage, its problems ringed with short labels; title, captions and dial wait for the claim
3. Safe zone: PASS: SAFE ZONE: ok (dial, title, captions, hook, chips, labels, rulers and the design inside x 60-960, y 250-1570 on the 0.5 s scan)
4. No overlap: PASS: OVERLAP: none; BAND: clear; HOOK: clear of the subject
5. Motion: PASS: STATIC STRETCH: none (least change 2.4 at 13.5 s, median 5.6); EMPTY FRAMES: none (scanned 32 moments, least detail 33.4 at 8.5 s); TEXT FIT: all text inside its box
6. Subtitles: PASS: SUBTITLES: at least 52 px, at most 6 words a line; phrases of up to 4 words, spoken words white, key words amber
7. Voice: PASS: PREFLIGHT voice: 143 letters, 7 sentences, about 11.1 s at speed 1 in one take (reel 16 s, voice must end by 15.4 s): fits; HOOK PACE: the first sentence has 5 words: ok (6 or fewer); PRONUNCIATION: 2 overrides used: photo, colour; no unchecked words; every sentence 6 words or fewer (c3-queue.md lessons: no 7+ word line read fast)
8. Sound: PASS: the design vocabulary (core.js DT.S, drum-free, synth cues) on the tense-to-bright score (DT.score): opening sting, the beams swinging as air, a stamp on "busy", a pull as the dark layer rises, a whoosh as the band slides in, letter flips as the text turns bold, a done chord per fix, the crowd hopping on the payoff, the reveal chord on the payoff
9. Payoff: PASS: ends on the fixed design, fully lit, the camera stepping back "across the street", a green frame on the title and the crowd hopping; no call to action on screen
10. Facts: PASS: text needs enough contrast with what is behind it, 4.5:1 for normal text, also for text inside images (WCAG 2.2 SC 1.4.3; WebAIM: the white text on the photo example "has insufficient contrast"); bold text counts as large at a smaller size, so it holds up better (WebAIM); the band and gig are invented; sources (read in full in the Sources run 44949452447): Contrast and Color Accessibility (WebAIM); Understanding SC 1.4.3 Contrast (Minimum) (W3C WCAG 2.2)
11. Post data: PASS: captions.json entry (c3, engine design, concept, onGo: no date, owner posts on response); caption: the claim, the fixes as a numbered list with one reason each, a save ask and one question; 6 keywords, 5 hashtags; 2 sources
12. Review file: PASS: this file, items 1-12 and 14-20 before the one render; ALIGN: ok (1 groups); local Output QA copy: FILL median 92% (0% of samples under 80%), GRADE subject vs surroundings 0.70, ELEMENTS longest gap 1.1 s at 13.2-14.3 s
13. After the render: PENDING
14. Cuts: PASS: FLOW: cuts 0
15. Dead runs: PASS: FLOW: dead runs none
16. Continuity: PASS: FLOW: continuity 100% (median step 1.3, 0 declared transitions)
17. Strobes: PASS: FLOW: strobes 0
18. Element sound (web): n/a (Turns Out; every effect in item 8)
19. Journey: PASS: the claim over the unreadable poster, the busy beams called out, each fix done on screen (select the photo and pull the dark layer up, the band slides in, a scan flips the letters into one bold colour), then the poster seen from further back, still readable
20. Depth and life: PASS: the design engine (captions.json "engine": "design"): the street at night behind the poster moving from dim to lamp-lit as fixes land, the photo's beams and lights moving until the dark layer calms them, the camera drifting with a push per fix, spark bursts, motion blur in the render

Owner feedback (design/owner-feedback.md) against the stills: "doesn't look aligned": ALIGN where the scene declares groups; "drum-like sounds": no drum kinds; "frame 0": one message first, the flaw obvious at phone size; "feels useless": every element on screen takes part; numbers on screen never run ahead of the voice (end states as words); "same background": its own stage.

Critic: PENDING (an independent session writes CRITIC: READY or NOT READY; the owner's watch decides the post).
