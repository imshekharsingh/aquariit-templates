# @webin20sec rulebook (the gate every web reel passes before its one render)

How to use: before the one render, score the reel rule by rule (pass / fail, one line each) in the stills review. A reel that fails a rule
is fixed or its topic is swapped. The daily audit adds, changes or drops a rule when the numbers say so, always with the number.
Evidence = the Instagram collect run of 5 Nov 2026 (lifetime reach and avg watch per reel; reels are ~20 s, so hold = avg watch / 20).

1. **An everyday phone annoyance the viewer has seen this week, as a user, not only as a developer.**
   Evidence: numbers that wiggle 100,928 reach · page scrolls behind a popup 4,235 · list feels flat 5,722 · page slides sideways 1,872 (12 h)
   · button cut off on phones 1,357; versus fixes you must imagine or only a dev sees: squashed photos 281 · page jump on a link 402 ·
   INP 258 · springs 391 · zero-JS transition 178.
2. **The bug is moving in frame 0** (the hook frame already shows the broken thing in motion; no static title card, no setup).
   Evidence: hold 74% (Nº 09, the wiggle running from frame 0) and 70% (Nº 04) vs 28% for squashed photos (5.5 s, the box changes shape
   only after the hook) and 13-26% for the old cover-card openers (2.7-5.0 s).
3. **The fix is on screen by ~8 s**, as one line of code typed under the live picture, then the same picture fixed.
   Evidence: Results log 03 Nov (watch share decides reach; the reels that show the fixed picture early hold longest, see rule 4).
4. **Aim for a 60%+ hold (12 s of 20).** The 3 reels at 60%+ have a median reach of 5,722 (Nº 09 74% → 100,928, Nº 04 70% → 5,722,
   Nº 06 63% → 1,664); the 8 under 60% have a median of ~1,370 (28-55%: 281 to 4,235).
   In the stills review: is there a reason to keep watching at 4 s, 8 s and 12 s (a new reveal at each)?
5. **A fix you can see at a glance** (layout, spacing, motion, the keyboard, the screen), not an invisible one (speed, metrics).
   Evidence: stutter (invisible on a phone) 2,645 and a 1.8% save rate vs list 5,722 and 4.4%; INP 258.
6. **Hook = "Why does your X …?" in at most 8 words, over the broken thing.** Evidence: all 8 web reels past 1,300 reach open this way;
   every reel that opened another way (claims, "built in 20 s", "6 ways", "why did I…", service pitches) reached 26-330.
7. **Post at 13:00 IST** (one reel a day; the 19:00 slot is under test, E13). Evidence (AUDIT_SIGNALS, 30 days): 13:00 median reach 2,313
   (6 reels) vs 12:00 899, 17:00 712, 23:00 103. E13 first reading (6 Nov): 19:00 reel (sticky) 1,198 at 4 h vs the 13:00 reel (keyboard)
   1,159 at 11 h, 24 h pending; followers are most online 18:30-23:30 IST (peak 21:30). Decide on 14 Nov, not before.
8. **One concrete thing to copy, checked on MDN + BCD**, kept on screen 3 s+; the caption invites a save or a send.
   Evidence: save rate 2.9-4.4% on the reels that end on one copyable line (Nº 04, 08, 09, 13) vs 0.4% on squashed photos.
9. **Tech terms and years are said the way people say them** (one shared lexicon for every channel, scripts/voice/say.json): the preflight
   PRONUNCIATION line shows no "check:" words before the render; a new term goes into say.json (or the config's "say"). Evidence: 5 Nov,
   Wi-Fi was read "Wi" "Fi" on @techin20sec; Kokoro alone reads CSS-style units (px, vh, dvh) through its fallback voice.
