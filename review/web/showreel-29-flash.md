# Review: showreel-29-flash (web, postOn 2026-11-07 postAt 19:00 IST)

The Mandatory Gate, design/mandatory.md. Rendered before the gate merged (posts 7 Nov, so scripts/review-gate.mjs does not require it); written
honestly against the gate anyway: the AUTO lines below are pasted as the gate's stills.mjs printed them on the final scene (7 Nov, 14:10 IST).

1. Topic: PASS: anyone in dark mode sees the screen flash white on a tap in 1 s; not done before (captions.json, Results log, every channel); rules-web.md 9/9 (1 everyday annoyance pass, 2 bug moving in frame 0 pass, 3 fix by ~8 s pass (7.7 s), 4 a reveal at 4, 8 and 12 s pass, 5 visible at a glance pass, 6 "Why does your X?" in 7 words pass, 7 the 19:00 slot (E13) pass, 8 one line to copy, MDN + BCD, on screen ~12 s pass, 9 pronunciation pass)
2. Frame 0: PASS: SUBJECT FILL: 57% at frame 0; HOOK: clear of the subject; the screen is already white mid-flash with the tap ring, the progress line running and the WHITE FLASHES counter
3. Safe zone: FAIL (not re-rendered): SAFE ZONE: OUTSIDE x 60-960, y 250-1570: 1.0 s: "6 MIN · TRAVEL" at 420-648 x, 1607-1637 y | 3.0 s: "9:41" at 46-130 x, 388-434 y | 6.5 s: "duskpost.example" at 26-436 x, 299-356 y | 7.0 s: "Tonight" at 32-362 x, 690-818 y | 7.5 s: "A field guide to the night sea" at 437-829 x, 1779-1860 y. Hook, labels, code and subtitles are all inside; what is outside is the phone's own page text: under the caption area for the first 2.5 s, and cut by the frame's left edge in the camera push-ins
4. No overlap: FAIL as measured, clear on the stills: OVERLAP: 7.5 s: "Night trains are back across the map" x "meta" | 8.0 s: "Night trains are back across the map" x "tag,"; BAND: SUBJECT IN THE SUBTITLE BAND 2.5 s: subject bottom 2564 px, band top 1284 px. The phone is faded out 22 px above the band by a CSS mask while subtitles show; layout.mjs measures the phone's whole element box and does not see the mask, so the card title it flags is hidden on screen
5. Motion: PASS: STATIC STRETCH: none (least change 1.0 at 15 s, median 8.1); one continuous camera, 9 moves with overshoot and settle
6. Subtitles: PASS: SUBTITLES: at least 52 px, at most 6 words a line (62 px); whole phrases, every sentence shown and finished on the stills
7. Voice: PASS: PREFLIGHT voice: 173 letters, 4 sentences, about 16.5 s at speed 0.84 with 2.25 s of breaths (reel 20.5 s, voice must end by 19.9 s): fits; PRONUNCIATION: 0 overrides used; no unchecked words; render voice check 2.55 words/s, no unsure words
8. Sound: PASS: cues on every camera move (move), every tap (touch), every white flash (hit), the styles landing and the code (snap), a swell into the fix, a resolve chord on "Now", three blips as the boxes turn; mix.duck 8 dB under the voice; the workflow levels to -14 LUFS with a 0.8 limiter (this render ran before SOUND GATE existed)
9. Payoff: PASS: close-up of the form boxes turning dark at ~16 s; the last frame is the fixed dark article, full phone
10. Facts: PASS: MDN meta name="color-scheme" and MDN color-scheme ("helping prevent unwanted screen flashes during the page load"; form controls follow the scheme); BCD Chrome 81, Firefox 96, Safari 12.1; tip block with demo "flash"; npm run check passes
11. Post data: PASS: captions.json showreel-29-flash with channel web, postOn 2026-11-07, postAt 19:00, concept, note; 6 keywords, 5 hashtags
12. Review file: PASS: this file; items 3 and 4 recorded as failing, not hidden
13. After the render: PENDING
