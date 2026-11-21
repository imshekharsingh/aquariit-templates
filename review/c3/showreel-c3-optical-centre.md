# Review: showreel-c3-optical-centre (c3, no date: onGo, the owner posts on response)

Turns Out design series (owner, 21 Nov 2026: "Move the finished ones to Turns Out section, we need all captions etc."), the full reel of the approved
preview scripts/channel3/design/optical.js (copy for the tools: scripts/channel3/optical-centre.html). AUTO lines from preflight.mjs, stills.mjs, flow.mjs and
qa/align.mjs on scripts/channel3/optical-centre.json.

1. Topic: PASS: the optical centre: a dot measured to the exact centre looks low; designers nudge things up a little (titles, buttons, logos); one fix anyone can use the same day; invented names only, no real brand, logo or person (design/safety.md); the design series the owner approved (21 Nov)
2. Frame 0: PASS: SUBJECT FILL: 99% at frame 0; the claim alone in the top band from frame 0, the design fully lit on its stage, its problems marked; title, captions and dial wait for the claim
3. Safe zone: PASS: SAFE ZONE: ok (dial, title, captions, hook, chips, labels, rulers and the design inside x 60-960, y 250-1570 on the 0.5 s scan)
4. No overlap: PASS: OVERLAP: none; BAND: clear; HOOK: clear of the subject
5. Motion: PASS: STATIC STRETCH: none (least change 0.7 at 1 s, median 4.7); EMPTY FRAMES: none (scanned 30 moments, least detail 77.9 at 12 s); TEXT FIT: all text inside its box
6. Subtitles: PASS: SUBTITLES: at least 52 px, at most 6 words a line; phrases of up to 4 words, spoken words white, key words amber
7. Voice: PASS: PREFLIGHT voice: 163 letters, 6 sentences, about 12.7 s at speed 1 in one take (reel 15 s, voice must end by 14.4 s): fits; HOOK PACE: the first sentence has 6 words: ok (6 or fewer); PRONUNCIATION: 0 overrides used; no unchecked words; every sentence over 6 words reads under 4.5 words/s at speed 1
8. Sound: PASS: the design vocabulary (core.js DT.S, drum-free, synth cues) on the tense-to-bright score (DT.score): opening sting, cursor clicks and drags, tuned plucks as things snap, shimmer on the payoff
9. Payoff: PASS: ends on the fixed design, fully lit, with the reel's last line and a light sweep; no call to action on screen
10. Facts: PASS: the optical centre of a rectangle sits slightly above its geometric centre (Fonts.com Fontology, Display Margins & Centering; Duke CCP graphic design notes); the on-screen nudge (17 of 340 px, about 5%) is shown as "a little", within the range those sources give; sources: Display Margins & Centering (Fonts.com Fontology); Graphic design: the optical centre (Duke University, Connected Curriculum Project)
11. Post data: PASS: captions.json entry (c3, engine design, concept, onGo: no date, owner posts on response); caption: the claim, the fixes as a numbered list, a save ask and one question; 6 keywords, 5 hashtags; 2 sources
12. Review file: PASS: this file, items 1-12 and 14-20 before the one render; ALIGN: SKIP (the scene declares no window.ALIGN)
13. After the render: PENDING: render 2 (the last allowed); render 1 (run 44922109469) failed Output QA PACE (two 7-word lines read at 6.1-6.5 words/s), FILL (median 71%) and ELEMENTS (3.7 s with nothing new at the end); fixed: lines of 5-6 words, design-tool rulers on both sides, 15 s; a local copy of Output QA FILL and GRADE on the scene's frames now passes (FILL median 95%)
14. Cuts: PASS: FLOW: cuts 0
15. Dead runs: PASS: FLOW: dead runs none
16. Continuity: PASS: FLOW: continuity 95% (median step 0.7, 0 declared transitions)
17. Strobes: PASS: FLOW: strobes 0
18. Element sound (web): n/a (Turns Out; every effect in item 8)
19. Journey: PASS: the claim over the flawed design, each fix done on screen with cursor, guides and snaps, then the fixed design lit
20. Depth and life: PASS: the design engine (captions.json "engine": "design"): the studio desk behind the design moving from dim to lit as fixes land, the camera drifting with a push per fix, spark bursts, motion blur in the render

Owner feedback (design/owner-feedback.md) against the stills: "doesn't look aligned": ALIGN where the scene declares groups; "drum-like sounds": no drum kinds; "frame 0": one message first; numbers on screen never run ahead of the voice (21 Nov: end states as words); "same background": its own stage.

Critic: PENDING (an independent session writes CRITIC: READY or NOT READY; the owner's watch decides the post).
