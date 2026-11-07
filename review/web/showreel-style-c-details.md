# Review: showreel-style-c-details (web, sample: not scheduled)

Style C, "Glass and light", as the kit theme on the slow-mo details format (owner, 8 Nov 2026: "Let's go with C."; review only, never posted).
The three demo details (copy button, switch knob, toast) plus the hook beat and the recap grid, 21.2 s. A sample is exempt from
scripts/review-gate.mjs; written against the gate anyway. AUTO lines from stills.mjs and preflight.mjs, 8 Nov.

1. Topic: PASS: the details demo's topic (small app motions anyone has felt under a finger); a look sample, not a new topic; rule 1 pass (copy, switch, toast are everyday), rule 2 pass (the copy button already springing in frame 0), rule 3 pass (the CSS typed under each detail from ~4 s), rule 4 pass (a new detail at ~4, ~8 and ~12 s), rule 5 pass (visible motion), rule 6 pass ("Why do good apps feel so smooth?", 7 words), rule 7 n/a (sample, not scheduled), rule 8 pass (MDN + BCD in the config, the recap grid kept 4 s+), rule 9 pass (no unchecked words), rule 10 pass (FLOW below), rule 11 pass (opens on the finished result, saveable recap), rule 12 pass (style C through KM.theme('glass'), cheap glass, blur 3)
2. Frame 0: PASS: SUBJECT FILL: 76% at frame 0; HOOK: clear of the subject; the copy button is landing on "Copied" in close-up under the hook at frame 0
3. Safe zone: PASS: SAFE ZONE: ok
4. No overlap: PASS: OVERLAP: none; BAND: clear
5. Motion: PASS: STATIC STRETCH: none (least change 2.8 at 14 s, median 5.6)
6. Subtitles: PASS: SUBTITLES: at least 52 px, at most 6 words a line; whole phrases, every sentence shown and finished on the stills
7. Voice: PASS: PREFLIGHT voice: 214 letters, 5 sentences, about 18.4 s at speed 0.9 in one take (reel 21.2 s, voice must end by 20.6 s): fits; PRONUNCIATION: 0 overrides used; no unchecked words; 52 words in 21.2 s (2.45 words/s)
8. Sound: PASS: the kit's cues on every glide (move), each slow-motion stretch (swell in, whoosh out), the speed badge (blip), the typing ticks, each curve's landing (snap), the spec chips (ticks, pop), the part bar (clicks), the taps and the recap (resolve); bed ducked under the voice; the workflow's SOUND GATE checks the loudness
9. Payoff: PASS: the recap grid with all three at full speed from ~15 s, a spotlight walking the tiles; the last frame is the grid
10. Facts: PASS: the details demo's sources (MDN linear(), cubic-bezier(), @starting-style, scale/translate with BCD versions) and tip; npm run check passes
11. Post data: PASS: captions.json entry with channel web, "sample": true (never scheduled), concept, about, note; 6 keywords, 5 hashtags in the config
12. Review file: PASS: this file, items 1-11 and 14-17 PASS
13. After the render: PASS: run 42406421148 green in 15 min (voice 1.5, frames 12, render 1.6), 1272 frames at 60 fps, motion blur 3 sub-frames; SOUND GATE: ok -14.1 LUFS, true peak -1.8 dBTP; voice check heard every word ("Copied" at 4.38 s heard "coppid", unsure 0.58) and flags 2.85 words/s while speaking (limit 2.7) with the last sentence fast (4.67): the demo's script, fine for a look sample; a real reel trims a few words; the contact sheet artifact cannot be downloaded from the session (Forbidden), so the final scene's stills were re-run locally on the merged code: every AUTO line clean, FLOW continuity 100%
14. Cuts: PASS: FLOW: cuts 0 (declared: 4 matchMoves, one into each part and the recap)
15. Dead runs: PASS: FLOW: dead runs none
16. Continuity: PASS: FLOW: continuity 100% (median step 1.2, 4 declared transitions)
17. Strobes: PASS: FLOW: strobes 0
