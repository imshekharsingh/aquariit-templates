# Turns Out rulebook (the gate every Turns Out reel passes before its one render)

Same use as design/rules-web.md: score every rule (pass / fail, one line each) in the stills review before the one render; fix or swap on a fail;
the daily audit adds, changes or drops a rule with the number. design/channel3.md (fact rules, never-list, quality bar) still applies.
Evidence = the Instagram collect run of 5 Nov 2026: 4 reels, median reach 157, 0 followers, 1 save, 1 share.

1. **The payoff image is in frame 0**: a "wait, what?" visual (the copper-brown Statue of Liberty), not a question written on paper.
   Evidence: Liberty (the colour change carries the reel) 1,051 reach, 15.2 s watched vs Eiffel 161 (13.4 s), blue sky 153 (8.4 s),
   60 minutes 118 (12.4 s). 6 Nov: the green Sahara (a map turning green) 1,041 at 5 h and the channel's first 4 followers: both reels past
   1,000 open on a colour change; the 3 without one sit at 150-161. Test from 6 Nov (E14): 3 reels; keep or drop by reach and hold vs the median (157).
   7 Nov, E14 reel 1 (flamingos, a grey chick in frame 0): 120 at 5 h vs the Sahara's 1,041 at 5 h (every Turns Out reel has ended at
   x1.0-1.0 of its 5-8 h reach, so this is close to final; 24 h reading at the 13:39 run). A colour change alone is not enough: the two hits show
   a world-famous thing everyone pictures one way (Liberty, the Sahara) in a state that looks wrong; a grey chick is not recognised as a
   flamingo, and "why are flamingos pink" is a fact many already know. Frame 0 = an icon in an unexpected state, recognised in under 1 s.
2. **Only topics with a visible transformation** (a colour, a shape, a map, a size that changes in front of you).
   Evidence: the one reel past 1,000 is the one with a transformation; the abstract ones (why 60 minutes, why the sky is blue) sit at 118-153. 6 Nov: the green Sahara (1,041 at 5 h) is the second.
3. **Hook spoken and shown from frame 0, in at most 9 words**, and answered by the payoff in the last 3 s. Evidence: every Turns Out reel
   so far; keep until the numbers say otherwise.
4. **25-35 s, a big change every ~3 s, one camera that never cuts** (2.5D kit). Evidence: Liberty held 15.2 s of 33.3 (46%), the best on the channel;
   blue sky held 8.4 s of 31.3 (27%).
5. **Globally known, 2 reliable sources per claim, short credit on the last frame.** Evidence: no source complaints; the rule protects reach
   on every continent.
6. **Post daily at 20:00 IST, reel ready by 18:30** (posting-time test, owner 5 Nov, 2 weeks from 6 Nov; E15; was 21:00-22:00).
   Evidence so far: Liberty went out at 18:21 (1,051); the 15:07, 17:30 and 20:16 posts reached 118-161; the Sahara (20:53) 1,041 at 5 h (5 reels, small sample: the topic drives it).
   Measure: each reel's 24 h reach and hold vs the channel median (157). It runs alongside E14 (frame-0 payoff), so read both together.
   Timing cannot fix a low hold: rules 1-4 stay the main gate.
7. **Tech terms and years are said the way people say them** (one shared lexicon for every channel, scripts/voice/say.json): the preflight
   PRONUNCIATION line shows no "check:" words before the render; a new term goes into say.json (or the config's "say"). Evidence: 5 Nov,
   Kokoro alone reads 1889 as "eighteen hundred eighty nine" (5 of 10 Turns Out scripts have years); Eiffel and metres were unknown to it.
8. **Two slots a day, 7-20 Nov (E16, owner 6 Nov): 13:30 IST and 20:00 IST**, each its own reel built that day, both passing rules 1-7.
   13:30 IST targets Europe's morning and Asia's afternoon (India, the Gulf, South-East Asia); 20:00 IST targets Europe's afternoon and the
   US morning. Each build checks captions.json for its own slot only (postOn = today AND postAt = 13:30 or 20:00).
   Compare per slot: 24 h reach and hold vs the median (157), followers per day, and the reached countries (AUDIT_SIGNALS reachedTop per slot,
   once available). Decide 21 Nov: keep two a day if reach per reel holds at 80%+ of the one-a-day median and followers per day rise; else one a day at the better slot.
