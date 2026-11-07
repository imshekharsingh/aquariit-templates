# Review: showreel-style-b-editorial (web, sample: not scheduled)

Style test B, "Editorial dark" (owner, 7 Nov 2026: three premium art directions on the flash reel's beats; review only, never posted).
A sample is exempt from scripts/review-gate.mjs; written against the gate anyway. AUTO lines from stills.mjs and preflight.mjs, 7 Nov.

1. Topic: PASS: the flash reel's topic (anyone in dark mode sees the white flash in 1 s); a style test, not a new topic; rules-web.md 1-10 as showreel-29-flash, rule 10 below
2. Frame 0: PASS: SUBJECT FILL: 56% at frame 0; HOOK: clear of the subject; a finger is already tapping a story at frame 0, the screen blooms white at 0.3 s
3. Safe zone: PASS: SAFE ZONE: ok
4. No overlap: PASS: OVERLAP: none; BAND: clear
5. Motion: PASS: STATIC STRETCH: none (least change 2.1 at 5.5 s, median 6.7)
6. Subtitles: PASS: SUBTITLES: at least 52 px, at most 6 words a line; whole phrases, every sentence shown on the stills
7. Voice: PASS: PREFLIGHT voice: 76 letters, 3 sentences, about 6.3 s at speed 0.95 in one take (reel 8 s, voice must end by 7.4 s): fits; PRONUNCIATION: 0 overrides used; no unchecked words; 19 words in 8 s (2.4 words/s)
8. Sound: PASS: cues on every camera move, both taps, the flash (swell), the code pane, typing ticks and the fixed page (resolve); the style's own bed and mix (window.CUES); the workflow's SOUND GATE checks the loudness
9. Payoff: PASS: the dark blank and the fixed article in close-up from ~6 s, labelled BLANK = DARK; the last frame is the fixed page
10. Facts: PASS: MDN meta name="color-scheme" (the flash reel's sources and tip); npm run check passes
11. Post data: PASS: captions.json entry with channel web, "sample": true (never scheduled), concept, note; 6 keywords, 5 hashtags in the config
12. Review file: PASS: this file
13. After the render: PASS: run 42381343796 green in 45 min (frames 41), 480 frames at 60 fps; SOUND GATE: ok -14.1 LUFS, true peak -1.8 dBTP; MP4 179 MB (grain 8 plus the scene's paper grain); voice check heard every word ("dark" at 4.34 s unsure, about 0.43) and flags pacing at 3.0 words/s while speaking (limit 2.7): the 8 s cut of a 20 s script, acceptable for a sample, never for a reel; the contact sheet could not be downloaded in the session (403), so the final scene's stills were re-run locally: every gate and FLOW line as above
14. Cuts: PASS: FLOW: cuts 0 (declared: flash, morph)
15. Dead runs: PASS: FLOW: dead runs none
16. Continuity: PASS: FLOW: continuity 86% (median step 1.1, 2 declared transitions)
17. Strobes: PASS: FLOW: strobes 0 (the flash is a declared 'flash' transition: an eased bloom inside the screen)
