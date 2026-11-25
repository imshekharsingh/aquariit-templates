# What works (from real numbers, read 24 Nov 2026 ~00:30 IST)

Source: one read-only Instagram collect (dry run, up to 50 posts per account) on 24 Nov; per-reel reach, views, saves, shares, average watch, and
(for the last 7 reels per channel only) hold % and skip % in the first 3 s. Reels posted in the last 24 h are left out (their numbers are not settled).
Saves and shares are per 1,000 reached. Instagram gives **no follows per reel** (the API refuses it), so "followers gained" cannot be ranked per reel.
Followers now: web 484 (+22 follows / -3 unfollows in 7 days), tech 13, Turns Out 9.
**Style fields (from 25 Nov 2026 stored per reel in captions.json "style"; see "Style record" at the end):** length, pace (words/s, shot changes), hook type, look, hero, first-second tension, payoff. Until the Sunday review has 5+ reels per value, anything about them is weak.
(This review of 24 Nov was written before they existed: it only knew length for the last 7 reels, and look by date.)
Mark: **[weak]** = fewer than 5 reels behind it.

## Account-level facts that frame everything
- Reach is almost all non-followers: web 9,920 of 10,207 in 7 days (97%), tech 4,135 of 4,146, Turns Out 2,888 of 2,896. Views from followers: web 1,829 of 17,650.
- Reached viewers by country (web, this month): India 17,415, Germany 9,667, USA 8,390, Indonesia 6,264, UK 4,456. Followers: India 97, USA 37, Indonesia 22, UK 20, Germany 17.

## Web (@webin20sec): 40 posts, median reach 1,423, median watch 9.3 s
Top 5 (reach): numbers wiggle 107,586; list feels flat 6,963; scroll behind popup 4,764; dark page flashes white 4,157; long name breaks card 2,772.
Bottom 5: INP "feels slow" 275, zero-JS transition 204, built-in-20-seconds film 204, layout shift 120, six heroes 113.

1. **Top 5 vs bottom 5: reach median 4,764 vs 204, watch 12.1 s vs 8.0 s, saves 37.8 vs 18.0 per 1,000, shares 4.1 vs 1.0.** But all bottom 5 are from 21-25 Oct, when a typical post reached ~100. Treat the gap as partly "new account", not only content.
2. **Same comparison inside November only (27 reels):** top 5 median 2,753 (flash, long name, list delete, sideways, waiting), watch 11.1 s, saves 31.6 per 1,000; bottom 5 median 867 (tapzoom first post 1,064, homebar 923, carousel 867, hover 527, squash 333), watch 7.9 s, saves 10.5.
   The top five are fixes you can see at a glance (white flash, card overflow, row collapsing, page slides sideways, a waiting animation). Two of the bottom five (squash, hover) are fixes a viewer must imagine; this matches the older "What didn't" notes.
3. **Hook type: nothing to compare.** 24 of the 27 November reels open "Why does your X ...?" (median 1,434); the 3 other questions median 1,531. The only non-"Why" hooks (claims about the maker: "built in 20 seconds", "zero JavaScript", "6 heroes") are 3 of the bottom 5, all October [weak].
4. **First 3 seconds matter more than length.** Of the last 7 web reels, the one with the highest skip (63% in 3 s, 5.8 s watched) was homebar at 923; the best hold (58%, skip 44%) was snapback at 1,541. Last 7 are all 15-19 s, so length cannot be compared [weak].
5. **Look [weak]:** dark look from 12 Nov, median 1,531 (13 reels) vs glass look 1-11 Nov, 1,358 (14 reels): +13%, inside the noise of topic. The details format (waiting 2,225, 90 saves) saved best but its other two tries were 1,275 and 1,575.

## Tech (@techin20sec): 28 matched posts, median reach 123, watch 5.0 s
Top 5: night mode "hold still" 1,483; wireless charging worth it 1,440; laptop plugged in 1,420; watch 5 ATM 1,212; AI memory 1,199.
Bottom 5: all 9-30 reach, all October news or one-off ("MacBook touchscreen", "Siri remembers", "Europe satellite rival", "iPhone stops at 80%", black screenshots).

1. **A step change on 15 Nov.** Before it, 20 posts: median 119, best 347. Since it, 8 settled posts: median 1,206, six at 1,016-1,483; watch 4.5 s -> 11.1 s (median). The change is the move to gadget questions ("is it worth it", "what the spec really means"; playbook 13-15 Nov); not enough posts to say which part did it.
2. **Top 5 vs bottom 5: reach 1,420 vs 10, watch 15.3 s vs 3.2 s.** Same split as the news-vs-puzzle note in the playbook; news and brand-news reels never passed 30.
3. **Skip in 3 s separates hits from misses (last 7):** posts with skip 64-66% stayed at 129-148 (phone-claim, wifi-button); posts with skip 32-58% reached 1,016-1,440 (ai-memory 32%, wireless 43%, 5 ATM 44%, laptop 58%). 7 posts [weak].
4. **Reach without saves:** top 5 earn 1.9 saves and 1.1 shares per 1,000 vs 37.8 saves on web. Tech reels are watched (wireless 22.2 s) but nobody saves them: the payoff is not a usable thing to keep yet.
5. **Two post-15-Nov misses (129, 148)** were a battery-claim explainer and a Wi-Fi toggle explainer; the reels that landed asked a decision ("worth it?", "stay plugged in?"). Two posts [weak].

## Turns Out (@itturns.out): 7 settled reels (8 total), median reach 260. All findings [weak].
Top: tap targets 1,115 (watch 10.3 s, hold 64%, skip 33%), line length 749, stop centring 366. Bottom: CV bold 137, menu spacing 134, business card margins 124.
1. Top 3 skip 33-44% in 3 s, bottom 3 skip 61-70% (CV 70%). Same pattern as tech.
2. Top topics are things everyone does on a phone or reads (thumb, long lines, centred text); bottom ones are print or menu objects (CV, menu, business card).
3. Shares exist where reach is low: the CV reel had 4 shares (29 per 1,000, best of any reel on any channel) but reach 137. No reel here has more than 1 save.
4. 8 reels in 4 days: far too few to rank hooks, length or look.

## Do more
- Web: fixes visible in one glance; "Why does your X ...?" over the broken thing moving in frame 0 (still the only hook with data behind it).
- Web: the details format when a save is the aim (waiting: 90 saves, 40 per 1,000, the highest in November alongside flash).
- Tech: "worth it / what does it really mean" gadget questions answered with a verdict.
- All: read the skip-in-3-s number first; a reel at 60%+ is the one to rework.
- Turns Out: everyday phone and reading topics (tap targets, line length).

## Stop doing
- Web: claims about how fast it was built (built-film, zero JS, six heroes): the three weakest hooks. Fixes the viewer must imagine (squash, hover).
- Tech: news and brand-news reels; spec explainers that open with a claim, not a decision.
- Turns Out: print-object topics (CV, card, menu) for now.
- Everywhere: do not call a hook, look or length a winner yet; the Style record (below) now stores them, and the Sunday review ranks them.

## Style record (method, owner chat 25 Nov 2026)
Every posted web, tech and Turns Out reel carries a "style" object in templates/showreels/captions.json; npm run check requires it on any reel posting from 25 Nov.
Fields: **lengthS** (seconds), **wordsPerS** (spoken words / length), **shotChanges** (cuts), **hookType** (question / claim / number / contrast, from the first spoken
sentence), **look** (dark / light), **hero** (the main object, a short phrase), **firstSecondTension** (yes / no: something is already wrong or moving in the first second),
**payoff** (tip = the viewer can do something / fact = the viewer learns something), **source** (mp4 = measured from the real video; config = from the config and text only).
Unknown = null, never a guess. How each is measured is at the top of scripts/style-measure.mjs. 24 Nov backfill: every posted reel from 25 Oct to 24 Nov; 32 of them
(the last 15 days, the MP4s still in the app) are measured from the MP4, the older ones carry what their config and text say, and hero is only known for tech (its gadget) and for new reels.

How to fill: when the reel's captions.json entry is made, plan hookType, look, hero, firstSecondTension, payoff (the direction card has them). After the one render:
`node scripts/reel-fetch.mjs <name> reel-files` then `node scripts/style-measure.mjs reel-files --names <name> --write` fills the measured fields and `source`.
Keep the planned values the script leaves as they are; check hero and firstSecondTension by hand (the script only fills hero for tech, tension from a review line "first-second tension: yes|no").

Sunday review (design/runbook-spare.md and the weekly audit) ranks styles:
1. Join each reel's style with its settled numbers (reel older than 24 h): reach, average watch, hold %, skip % in 3 s, saves and shares per 1,000 (Instagram collect REEL lines).
2. For each field, group the reels by value (length: under 15 s, 15-25 s, over 25 s; pace: under 2.2, 2.2-2.8, over 2.8 words/s; cuts per 10 s: under 3, 3-5, over 5) and
   print per group: n, median reach, median watch, median skip in 3 s, median saves per 1,000. Compare inside one channel only; never mix channels.
3. A group counts only with n of 5 or more; mark smaller ones [weak]. Report a difference only if it is 30% or more on reach AND the same direction on watch or skip.
   Two fields that move together (e.g. dark look and number hooks) are one finding, not two.
4. Output: a "Style ranking" block per channel in this file (replace the previous one): best and worst group per field, with n and numbers, then 1-3 rules for the next week's
   builds ("Do more" / "Stop doing"), and the experiment each rule becomes in design/experiments.md. A rule needs the same result in two Sundays to go into the rulebook.
5. The per-reel hero field answers the "one hero vs many" question; firstSecondTension answers the skip-in-3-s question; payoff answers the saves question (tips should save more than facts).
