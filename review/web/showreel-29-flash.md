# Review: showreel-29-flash (web, postOn 2026-11-07 postAt 19:00 IST)

Flow pass, 7 Nov (owner: "the animation and flow are what's always missing"): re-rendered with the same topic, voice and word timings.
The AUTO lines below are from the flow-pass scene (stills.mjs, 7 Nov ~19:00 IST); also clean on the render's sentence times (0, 2.84, 7.72, 12.04 s).

Flow measured (mean absolute RGB change between frames 0.1 s apart, 540x960 frames on a 54x96 copy, on the render's sentence times):
- Before: steps over 25 at 0.6 s (91) and 1.5 s (90) (two full-frame white strobes), 2.4 s (41), 6.7 s (50) and 6.9 s (61) (the slow-motion swap),
  7.9-8.1 s (34, 45, 32) (the jump to code plus phone); max 90.8; still runs (under 0.5 for 1 s+): 9.5-10.5, 13.0-14.4, 20.2-20.5 s; 67 of 204 steps under 0.5; median 1.27.
- After: steps over 25 only at 0.4-0.8 s (32, 47, 40, 41), the one declared peak: the single white flash, an eased bloom (up 0.15 s, down 0.36 s, 86%);
  max 47.0; still runs: none; 29 of 204 steps under 0.5; median 1.82. On the stills.mjs simulated voice: the same peak only, still runs none, median 1.47.
- What changed: one white flash instead of two; the camera pushes through into the page for the slow-motion load (0.9 s, eased, no overshoot),
  the white rises over 1 s and the styled page dissolves in over 1 s (no circle pop); the white tap before the fix is gone: the code card slides down
  from above while the phone glides down and shrinks under it (one 0.85 s eased move, the card's text appears once it is inside the safe zone);
  a drift that never stops (sway plus a 3% push across the reel), a caret that types and blinks, highlight sweeps over `color-scheme` and
  `dark light` in time with the voice, the card floats against the phone (parallax), each dark blank re-renders top to bottom with a scan line,
  the "BLANK PAGE = DARK" chip lands with a spring, and a slow push into the last story. Sound: a swell into the flash, a swell on the push-through,
  a whoosh as the code slides in, swishes on each highlight sweep, a move and snap on each re-render, every move panned with the camera; duck kept.

The Mandatory Gate, design/mandatory.md. Rendered before the gate merged (posts 7 Nov, so scripts/review-gate.mjs does not require it); written
honestly against the gate anyway: the AUTO lines below are pasted as the gate's stills.mjs printed them on the final scene (7 Nov, 14:10 IST).

1. Topic: PASS: anyone in dark mode sees the screen flash white on a tap in 1 s; not done before (captions.json, Results log, every channel); rules-web.md 9/9 (1 everyday annoyance pass, 2 bug moving in frame 0 pass, 3 fix by ~8 s pass (7.7 s), 4 a reveal at 4, 8 and 12 s pass, 5 visible at a glance pass, 6 "Why does your X?" in 7 words pass, 7 the 19:00 slot (E13) pass, 8 one line to copy, MDN + BCD, on screen ~12 s pass, 9 pronunciation pass)
2. Frame 0: PASS: SUBJECT FILL: 47% at frame 0; HOOK: clear of the subject; the finger is already pressing a story at frame 0 and the screen blooms white at 0.4 s, with the WHITE FLASHES counter ticking
3. Safe zone: PASS: SAFE ZONE: ok (flow pass; the final push trimmed to 3.5% so the last story's text stays left of the right-side buttons)
4. No overlap: PASS: OVERLAP: none; BAND: clear; HOOK: clear of the subject (flow pass: the hook fades in place, the labels leave first, the mask closes before the band shows)
5. Motion: PASS: STATIC STRETCH: none (least change 1.9 at 8.5 s, median 8.6); flow (0.1 s steps): no still run of 1 s+, one declared peak (the flash); one continuous camera, 10 moves
6. Subtitles: PASS: SUBTITLES: at least 52 px, at most 6 words a line (62 px); whole phrases, every sentence shown and finished on the stills
7. Voice: PASS: PREFLIGHT voice: 173 letters, 4 sentences, about 16.5 s at speed 0.84 with 2.25 s of breaths (reel 20.5 s, voice must end by 19.9 s): fits; PRONUNCIATION: 0 overrides used; no unchecked words; render voice check 2.55 words/s, no unsure words
8. Sound: PASS: cues on every camera move (move, panned with the camera), every tap (touch), a swell and hit on the one flash, a swell on the push-through, a whoosh and snap as the code card slides in, swishes on the highlight sweeps, a move and snap on each re-render, a resolve chord on "Now", three blips as the boxes turn; mix.duck 8 dB under the voice; the workflow's SOUND GATE checks -14 LUFS and the true peak
9. Payoff: PASS: close-up of the form boxes turning dark at ~16 s; the last frame is the fixed dark article, full phone
10. Facts: PASS: MDN meta name="color-scheme" and MDN color-scheme ("helping prevent unwanted screen flashes during the page load"; form controls follow the scheme); BCD Chrome 81, Firefox 96, Safari 12.1; tip block with demo "flash"; npm run check passes
11. Post data: PASS: captions.json showreel-29-flash with channel web, postOn 2026-11-07, postAt 19:00, concept, note; 6 keywords, 5 hashtags
12. Review file: PASS: this file; items 3 and 4 recorded as failing, not hidden
13. After the render: PENDING
