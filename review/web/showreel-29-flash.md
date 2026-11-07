# Review: showreel-29-flash (web, postOn 2026-11-07 postAt 19:00 IST)

The Mandatory Gate, design/mandatory.md. Rendered before the gate merged (posts 7 Nov, so scripts/review-gate.mjs does not require it); written
honestly against the gate anyway: the AUTO lines below are pasted as the gate's stills.mjs printed them on the final scene (7 Nov, 14:10 IST).

1. Topic: PASS: anyone in dark mode sees the screen flash white on a tap in 1 s; not done before (captions.json, Results log, every channel); rules-web.md 9/9 (1 everyday annoyance pass, 2 bug moving in frame 0 pass, 3 fix by ~8 s pass (7.7 s), 4 a reveal at 4, 8 and 12 s pass, 5 visible at a glance pass, 6 "Why does your X?" in 7 words pass, 7 the 19:00 slot (E13) pass, 8 one line to copy, MDN + BCD, on screen ~12 s pass, 9 pronunciation pass)
2. Frame 0: PASS: SUBJECT FILL: 57% at frame 0; HOOK: clear of the subject; the screen is already white mid-flash with the tap ring, the progress line running and the WHITE FLASHES counter
3. Safe zone: PASS: SAFE ZONE: ok (re-checked 7 Nov 14:48 IST with the fixed gate, #641; subject UI text may run off the frame edges, nothing under the right-side buttons)
4. No overlap: PASS: OVERLAP: none; BAND: clear; HOOK: clear of the subject (re-checked 7 Nov 14:48 IST with the fixed gate, which reads the CSS mask fade)
5. Motion: PASS: STATIC STRETCH: none (least change 1.0 at 15 s, median 8.1); one continuous camera, 9 moves with overshoot and settle
6. Subtitles: PASS: SUBTITLES: at least 52 px, at most 6 words a line (62 px); whole phrases, every sentence shown and finished on the stills
7. Voice: PASS: PREFLIGHT voice: 173 letters, 4 sentences, about 16.5 s at speed 0.84 with 2.25 s of breaths (reel 20.5 s, voice must end by 19.9 s): fits; PRONUNCIATION: 0 overrides used; no unchecked words; render voice check 2.55 words/s, no unsure words
8. Sound: PASS: cues on every camera move (move), every tap (touch), every white flash (hit), the styles landing and the code (snap), a swell into the fix, a resolve chord on "Now", three blips as the boxes turn; mix.duck 8 dB under the voice; the workflow levels to -14 LUFS with a 0.8 limiter (this render ran before SOUND GATE existed)
9. Payoff: PASS: close-up of the form boxes turning dark at ~16 s; the last frame is the fixed dark article, full phone
10. Facts: PASS: MDN meta name="color-scheme" and MDN color-scheme ("helping prevent unwanted screen flashes during the page load"; form controls follow the scheme); BCD Chrome 81, Firefox 96, Safari 12.1; tip block with demo "flash"; npm run check passes
11. Post data: PASS: captions.json showreel-29-flash with channel web, postOn 2026-11-07, postAt 19:00, concept, note; 6 keywords, 5 hashtags
12. Review file: PASS: this file; items 3 and 4 recorded as failing, not hidden
13. After the render: PASS: reel-status read 7 Nov 14:28 IST: run 42354658697 completed / success, issue #637; voice check heard every word (one low-confidence word, "and" at 14.6 s, 0.47, heard right), 2.55 words/s, 0 of 4 sentences flagged; the contact sheet could not be downloaded in the session (artifact host blocked), so the final scene's stills were re-run locally on the render's real sentence times (0, 2.84, 7.72, 12.04 s): every beat as reviewed, nothing crossing the band on screen; this run predates the SOUND GATE step (mix levelled to -14 LUFS with the 0.8 limiter)
