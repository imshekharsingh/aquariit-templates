# @techin20sec rulebook (the gate every tech reel passes before its one render)

Same use as design/rules-web.md: score every rule (pass / fail, one line each) in the stills review before the one render; fix or swap on a fail;
the daily audit adds, changes or drops a rule with the number. Evidence = the Instagram collect run of 5 Nov 2026.
State on 5 Nov: 8 followers (-1 in 7 days), 6 explainer test reels at 110-120 reach, 3.5-4.7 s watched, 0 saves, 2 shares.
Verdict 6 Nov: the test missed all three targets (median reach 115 vs 300, ~4 s watched vs 6 s, 10 followers vs 20; 0 saves in 7 reels).
As decided by the owner on 5 Nov, the channel posted 2-3 reels a week; from Sun 8 Nov (owner) one reel every day at 13:00 IST, each built that morning.

1. **An everyday puzzle the viewer can see on their own phone**, not a feature or a news item. Evidence: explainers held 110-120 reach
   with 3.5-4.7 s watched; news reels in the same week sank to 8-35 (Siri 8, MacBook 29, Discord 35).
2. **The answer's first step on screen inside 2 s** (no label-only frame). Evidence: watch is 3.5-4.7 s, about 20-24% of the reel: most viewers
   leave before the mechanism starts; the two best older reels (encryption 7.1 s, Amazon cloud 7.0 s) opened on the answer as a claim.
3. **18 s or shorter.** Evidence: no tech reel has held more than ~7 s, so length only lowers the hold share Instagram reads.
4. **A takeaway worth saving, said and shown in the last 3 s** (a setting to change, a number to remember). Evidence: 0 saves in 6 test reels.
5. **Post one reel EVERY day at 13:00 IST** (owner, 8 Nov 2026: "Let's make the tech reel one per day as well; Sunday is the right time to check
   engagement" and "upload time at 13:00 for all three"). E15 (Mon/Wed 19:00, Fri 17:30) ended 8 Nov: Fri 17:30 airplane mode 129 at 8 h was the best of
   the 7 test reels (median 116) but inside the same ~110-130 pool, so timing was never the lever. Measure from 8 Nov: each reel's 24 h reach and hold
   vs the channel median (112 on 5 Nov); read engagement on Sundays. Timing cannot fix a low hold: rules 1-4 stay the main gate.
6. **No topic @webin20sec covers and no repeat of a test topic.**
7. **Tech terms and years are said the way people say them** (one shared lexicon for every channel, scripts/voice/say.json): the preflight
   PRONUNCIATION line shows no "check:" words before the render; a new term goes into say.json (or the config's "say"). Evidence: 5 Nov,
   the Wi-Fi reel was read "Wi" "Fi" (owner); a mispronounced brand makes the whole explainer sound wrong.
9. **On ESCALATE, change the format, not the topic** (8 Nov audit: ALARM two days running; the last 7 explainers sit at 113-131 reach,
   median 116, whatever the topic or hour: 12:31 passkey 113, 15:06 Face ID 116, 17:33 airplane 131). From 8 Nov the myth-bust (experiment
   tech-myth-verdict): a habit people believe, the verdict (MYTH / TRUE) stamped in frame 0 (topic "verdict"), why in 3 steps, a setting to change.
   Keep it if it beats the median (116) at 24 h in 2 of 3 reels; drop it after 2 losses.
8. **Every topic passes FLOW** (Mandatory Gate items 14-17: cuts 0, no dead runs, continuity 85%+). Evidence: the old engine held still after
   each build-in (wifi-address 35%, 7 Nov) and tech watch time is 3.5-4.7 s; the 8 Nov engine (glass light, camera drift, declared glides, secondary
   motion in every kind) measures wifi-address at 100% with the fake voice. `make.py --fake-vo --stills` prints the FLOW lines.
