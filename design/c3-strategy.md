# Turns Out strategy: why new reels get no reach, and the plan for 3 a week (18 Nov 2026)
Owner, 18 Nov: "new ones don't get much visibility at all." Numbers: Instagram collect run of 18 Nov, 14:20 UTC (AUDIT_CHANNELS / AUDIT_SIGNALS, c3).
Docs only; no engine, kit or reel changed. Research sources are at the bottom (vendor blogs unless named; none isolates one effect).

## 1. Diagnosis (the numbers)
Account: 10 followers; 99% of 1,456 reach this week was non-followers; 0 saves, 2 shares in 7 days. Every c3 reel (reach | hold | skip in 3 s | length):
- Reached the ~1,100 first pool, 8 reels: sphinx 1,277 (18.7 s of ~35), opera 1,227 (15 s), terracotta 1,157, golden-gate 1,157, eiffel-red 1,145 (hold 63% of 23 s, skip 29%), white-pyramid 1,103, sahara 1,080 (8 shares, best ever), liberty-green 1,059.
- Stayed at 105-170, 8 reels: taj-mud 137 (hold 55% of 22.7 s, skip 33%), mona-stolen 117 and liberty-arm 106 (both ~40-43 s, hold 23-24%, skip 51-53%), pisa 112, flamingo 126, sixty-minutes 156, blue-flow 162, eiffel-flow 168.
- stonehenge-stones (18 Nov, 42 s): 12 reach, skip 79%, read at about 4 h (the old reels were at 1,100 by 5-7 h): too early to call, but it is the slowest start of any reel.
- Not posted, so no numbers: niagara-dry and greek-colour (not in the matched list).
- Topic: 7 of the 8 pool reels are a world icon in a state nobody pictured (all but opera-sphere, a story); the misses are almost all not that. Mona (a theft), liberty-arm (a story), stonehenge (origin) and taj-mud (how, not what) show nothing "wrong" in frame 0.
- Length and engine: all 3 reels since 15 Nov ran 40-43 s on the Echoes engine, against rule 3's 18-25 s. Their hold (23-26%) is half the pool reels'.
- Posting: planned 13:00, real 11:51-22:27 IST (liberty-arm went out a day early at 22:27; stonehenge 15:56 vs 18:00). The hour never separated hits from misses (rules-c3.md), so this is noise, not a cause.
- Where it is too thin: topic and length changed together since 15 Nov, so we cannot say which one hurt. Follows: 10 in total; 4 on the Sahara day. Saves/shares: 0-8 per reel; no lever can be read from them.

## 2. The 3 biggest likely causes
1. **Frame 0 does not say "wait, what?"** The last 4 misses open on a normal-looking photo or a title. The 8 pool reels open on the icon looking wrong (red Eiffel, white pyramid, buried Sphinx).
2. **Too long.** 40+ s with hold 23% means most viewers leave before the story turns; Instagram sees an early skip and stops the test (Mosseri: watch time and sends are the top signals, secondary sources).
3. **Nobody acts, so no second pool.** 99% of reach are strangers, 0-1 saves, 0-2 shares, and nothing says "follow" or "send". Even the best reels stop at ~1,100 (x1.0 after 6 h).

## 3. The plan (3 reels a week, Mon / Wed / Fri 13:00 IST)
- **Format:** the story look at 20-26 s, 50-60 words (rule 3: 18-25 s, loop to frame 0), 8-10 shots, a new element every ~2 s (rule 11). Use the Echoes engine only if its config can be 5 lines and about 24 s; if not, use the story engine (`new25d.mjs`). Do not change either engine.
- **Series:** "NOT HOW YOU PICTURE IT" Nº n (already Nº 3 on 18 Nov). Each reel names it once in the voice's last line and as the caption's first words, so a viewer who liked one knows there are more. Part 1 style: every reel works alone.
- **Topic rule (all 3 must be yes):** (a) people on every continent know the thing on sight; (b) the true past or present state looks wrong next to the picture they have; (c) one real photo shows that state. Curiosity about a thing everyone knows beats a place only locals know (our 8 of 8). Never abstract "why" topics, never a story with no strange picture.
- **Hook rule:** frame 0 IS the wrong-looking picture, held lit and still for 0.4 s, voice starting at 0.0 s with the oddity in 8 words or fewer ("This sign once said HOLLYWOODLAND."). No title card, no logo, no question first. Target: skip in 3 s at or under 35% (pool reels where read: 28-37%).
- **Ending (the missing lever):** the last line gives a reason to send: "Send this to someone who thinks it was always like this." Caption line 1 = the series name + the oddity as a search phrase ("Hollywood sign HOLLYWOODLAND history"); sources line unchanged; one comment pinned with the sources.
- **Trial Reels:** worth one test once the owner can post it (1,000+ followers is reported for eligibility, unverified, so ask "Needs you"). Not before.
- **Collaborations:** Emplifi H1 2026 says accepted Collab posts beat a brand's own posts, Reels most. We have no partner yet: one "Needs you" ask to the owner for a small history or travel account to co-post one reel. Low priority until the plan has a week of numbers.
- **Posting hour:** keep 13:00 IST (no slot beat another here). No search result gave a trusted hour for this audience; do not spend effort on it.

## 4. Next 6 topics (facts: two sources each before building; image sources are fetch.py's `nasa` and `loc` providers, never Wikimedia)
| Day | Reel (the state that looks wrong) | Image source |
|---|---|---|
| Mon 23 Nov | The Hollywood sign said HOLLYWOODLAND (a 1923 housing ad; "LAND" came off in 1949) | Library of Congress photos |
| Wed 25 Nov | The famous "Blue Marble" Earth photo was taken upside down (Apollo 17, 1972; south at the top, then turned) | NASA Image Library |
| Fri 27 Nov | The Colosseum had a roof: a giant cloth awning shaded the crowd, worked by sailors | Library of Congress prints |
| Mon 30 Nov | The Washington Monument is capped with aluminium, once as precious as silver (1884) | Library of Congress photos |
| Wed 2 Dec | Mount Rushmore was meant to go down to the waist; the money ran out in 1941 | Library of Congress photos |
| Fri 4 Dec | Brooklyn Bridge, 1884: 21 elephants walked across to prove it was safe | Library of Congress prints |
Checks before any build: the Rushmore faces are real photos of a monument (no new face drawn); drop any topic an official body or expert disputes (rules-c3.md rule 6).

## 5. One experiment per week (pass / fail)
- **Week 1 (23-27 Nov), E27 "wrong-looking frame 0 at 22-26 s":** the 3 reels' reach at 24 h. PASS = 2 of 3 reach 1,000+ AND median skip in 3 s at or under 35%. FAIL = fewer than 2 at 1,000+. A pass proves format and topic together are the fix; a fail says the pool is closed to the account, so go to Trial Reels or a collab.
- **Week 2 (30 Nov - 4 Dec), E28 "send line":** same format; the last line asks for a send and the caption's first line holds the search phrase. PASS = shares per 1,000 reached at 3 or more (best so far 0.7%) in 2 of 3 reels, with reach still at 1,000+. FAIL otherwise; then drop the send line.
- Read each at 24 h and 72 h in design/targets.md (add the rows in the daily run); keep at 2 WINs of 3 (existing rule).

## 6. Stop doing
- 40+ s reels, the 7-line Echoes arc, and "story of an event" topics with no strange picture (mona, stonehenge).
- Guess chips and countdowns (E19 dropped, 18 Nov); abstract "why" reels; transformations nobody recognises.
- Building a reel before the topic row above passes rule 2 on paper; calling a reel ready without frame 0 read first at phone size.
- Reading one reel's number as a trend: the account has 10 followers, so decide on 3-reel weeks only.

## Sources (read 18 Nov 2026)
- Watch time, likes per reach and sends per reach as top signals, sends strongest for non-followers: https://www.netinfluencer.com/instagram-views-up-27-percent-in-early-2026-as-publishing-increases-report-finds/ ; https://www.scottsocialmarketing.com/blog/instagrams-algorithm-updates-in-2026 (secondary; also design/references.md, 11 Nov).
- Small accounts get 55% of views from non-followers; no primary source: https://influencermarketinghub.com/Instagram-reels-stats
- Length: completion matters more than length; mid-form 15-30 s for stories; no official figure: https://klap.app/blog/how-long-should-reels-be ; https://www.opus.pro/blog/ideal-instagram-reels-length
- Hook in the first second: vendor claim only (60%+ skip rates): https://vidico.com/news/instagram-reels-statistics/
- Trial Reels: non-followers first, off the grid, scheduling since Feb 2026; 1,000-follower rule unconfirmed: https://publer.com/blog/instagram-trial-reels-guide/ ; https://www.makeinfluence.com/en/academy/instagram-trial-reels-testing-content-on-non-followers-first-and-what-it-means-for-sponsored-content
- Caption keywords feed Instagram search, Google indexing of public posts: https://metricool.com/instagram-seo/ ; https://www.inro.social/blog/instagram-seo-guide-2026
- Collab posts beat standard posts, Reels most: https://emplifi.io/resources/instagram-collaborations-boost-organic-engagement/
- Not found: a trusted best posting hour for this audience; evidence on trending-vs-evergreen topics for small history accounts; a series effect (Meta's Series hub is only a test, design/references.md).
