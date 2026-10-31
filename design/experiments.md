# Content experiments (the advisor's lab notebook)

**Scale note (owner, 16 Oct 2026):** the account has about 6 followers, so per-reel averages (watch time, reach) say almost nothing yet. We do not judge,
keep or drop a format on them; we post daily, keep raising quality by our own bar (design/themes.md) and let Instagram's distribution decide what spreads.
Read the numbers as signals only once reels reach a few thousand non-followers.

Rule: change one thing at a time where possible, post at least 3 reels per variant, decide with the numbers in the daily collector's log
(Instagram collect → run log → "Reels" table), write the verdict here. Small samples lie: with a new account every number is noisy, so the bar is
a clear difference across 3+ reels, not one lucky reel.

## Baseline (format A), posted 2026-10-09 → 2026-10-12, 5 reels, 1 follower
Static cover card for the first 1.3 s + 0.6 s lead-in, 24-30 s long, no on-screen hook line.
Read on 2026-10-12: 205 views, 181 reach (sum), 0 shares, 1 save, 3 likes, 0 comments. Average watch 2.5-4.6 s on ~30 s videos. Best reach 102 (Lumen).

## E1 · format B (started 2026-10-12)
**Hypothesis:** people leave during the static first ~2 s and a 30 s scroll is too long for strangers. A video that moves from frame 0, shows the question as
on-screen text for ~3 s, and runs ~18 s will be watched longer and sent more.
**Change:** renderer `--format B` (default): no cover card in the video (the card is a separate image used as the Instagram cover), hook line on screen, 18 s.
**First three reels in format B:** the first three posted from 2026-10-13: Tidemark (2026-10-11-0939, localised to ₹) and the next two daily templates, which are made to design/market.md (India, ₹, no invented results). Popcraft and Vantaris were dropped from the queue on 2026-10-13: US-sized prices and made-up results do not fit an Indian beginner studio.
**Measure (per reel, after ~48 h):** average watch time (baseline 2.5-4.6 s), reach (baseline ~20-100), shares and saves (baseline ~0).
**Verdict rule:** keep format B if average watch is clearly above baseline on at least 2 of 3 reels. If not, test the next variable (E2: a different hook style, or a
shorter 12 s cut). If watch time rises but shares stay at 0, the problem is the idea, not the format (E3: the "send this to someone who..." content angle).

## E6 · directed film vs screen recording (started 2026-10-13)
**Hypothesis:** a motion-directed film (virtual camera, hook words on the beat, a match cut, a held breath, a loop, effects-only sound) holds cold viewers longer and gets sent more than a
screen recording of the same page. Owner chose variant A (type-first open: hook slams in on flat colour) over B (macro open) after seeing both.
**Change:** `film/ID/story.js` + `timing.json` per template (see design/film-playbook.md); the Reel publish workflow renders it (falls back to the screen recording if there is no film).
**Reels:** Tintwell (2026-10-13-0851, film) vs Tidemark (2026-10-11-0939, format B screen recording) and the next daily templates (films). **Measure:** same as E1 (average watch, reach, shares, saves, after ~48 h).
**Verdict rule:** keep the film if average watch is above the screen-recording reels on at least 2 of 3 films; if equal, drop the film (it costs CPU minutes and authoring time).

## E12 · distribution first, two weeks (owner yes, 14 Oct 2026; runs 15-28 Oct). Changed 15 Oct: posting Mon/Wed/Fri 19:30 IST (3 a week, owner); the motion freeze is lifted (design/aligned-plan.md)
**Why:** films hold viewers (13.5 s of 18) but reach is 4-113 per reel with 0 shares: almost nobody sees them. **What the owner does per post (~10 min):** post at
19:30 IST, add an Instagram audio track (kit `Search:` terms), share to Stories with a poll sticker, DM it to 5-10 matching people, then comment on the Reel ready
issue `posted HH:MM audio y/n story y/n dms N`. **Motion freeze:** no engine changes and no new parts during the test (bug fixes and the approved iso-machine trial
excepted) so a change in reach comes from distribution, not from a different kind of film. **Measure:** Instagram collect (reach, average watch, saves, shares per
reel) read next to each post's comment. **Verdict (29 Oct):** keep the routine if median reach per reel is at least 3x the 9-14 Oct median and at least one reel
gets shares; otherwise test the next lever (hook style, posting time). Then decide area 3 of the process review (signature parts).

## E13 · which AI voice: CANCELLED the same day (owner: keep only af_heart for consistency)
Six Kokoro voices rotate by film date (af_heart, am_michael, bf_emma, am_fenrir, af_bella, bm_george; scripts/film/voice.mjs). Each reel's voice is in its voice
report. **Measure:** average watch time and shares per reach per voice (Instagram collect). **Verdict:** after each voice has 2+ posted reels, keep the one with the
best average watch as the single Aquarii voice (pin it with a `Voice:` line or change the default).

## Queue of next ideas
- E2: hook style: question vs bold claim vs number ("+212% leads").
- E3: audience: show the template as a *result for a business* (before/after) rather than as a design showcase.
- E4: posting time: 12:30 vs 19:30 IST, same format, 3 reels each.
- E5: account type Business → Creator (music library): check whether reach changes with licensed music.
- E7 (from an owner-shared reel, 13 Oct: a numbered "20 graphic design styles" list, 470K saves and 171K shares): **reference value drives saves and shares.** Try a buyer-facing
  style-switch film: one business (e.g. a café) shown in 4-5 styles on the beat, a numbered list that builds on screen while the picture changes, ending on "Which one is your café?".
  Rules: the list speaks to owners (styles as moods: calm, bold, premium, playful), not to designers; original copy and look; the film engine swaps theme tokens, no new page per style.
  Measure saves and shares per reach against the single-template films.
- E8: comment-keyword CTA: **started 17 Oct 2026, owner: "Comment AQUARII"** on every reel (end card, voice, caption); replies by hand within a few hours (no paid DM automation). Measure comments and profile visits.
- E9 (from an owner-shared POV reel, 13 Oct): a **POV wrapper** ("POV: you built a café's site at 2 am"): the film plays on a virtual monitor in a night room with slow ambient
  light in the film's palette; inside, a sentence that builds word by word, pivot words with their own world responses, and one brand shape as a recurring character
  (design/film-playbook.md, Reference study 2). Measure average watch and shares against the plain films.
- E10 (owner's "formula for viral content" reel, 14 Oct): **a saveable cheat-sheet reel for buyers**: "The 6 parts of a website that gets bookings" toured on a radial
  diagram (`P.radial`), pivot lines on black, ending on the whole diagram with "Screenshot this". Saves are a ranking signal and the account has 1 save in 7 posts.
  Measure saves per reach vs the template films.
- E11 (owner's agency reel, 14 Oct): **Aquarii's own service ad**: "Need a website? We got you." / "Need bookings? We got you." with a swinging Aquarii tag as the
  wipe (`P.pendulum`), then flip words and a contact line. One per week between template films; measure profile visits and DMs.
- Style menu: the same list has styles our menus lack (maximalism, vector art, collage, pixel art, Y2K, surreal, graffiti, handwritten). Proposal for the owner: add the modern ones to
  the CLAUDE.md mood menu (needs the owner's go-ahead, CLAUDE.md is owner-edited).

## Backlog (owner: "keep it in todo", 13 Oct)
- **Re-film the existing templates in the product-film grammar** (design/film-playbook.md, worked example film/2026-10-13-1902). Estimate: a shared film kit from the Dantika story (~2 h, once),
  then ~45-75 min per film (story, 2-3 still passes, render, cover, log); ~15-20 h for all 19, in sittings of 3-4 films; zero cost (~3 h of Actions minutes).
  Order: 1) kit + Tintwell redo; 2) market-fit pages: Tidemark, Gojigo, Lumen, Chatwise, Devstream, Halcyon, Kinetika; 3) Stratos, Gumdrop, Tessera, Pulsarium, Loudhaus (quick ₹ check);
  4) only if wanted: the vintage pages (Ledgerleaf, Shizuku, Maison Vesper, Understory, Quasarine) and the dropped Popcraft/Vantaris, after their copy is fixed for design/market.md.

## Results log
### 31 Oct 2026, 08:52 IST audit (collect 05:11 IST; @webin20sec 69 followers (+13), 25 posts; @techin20sec 9 followers (+0), 27 posts)
Studio, 7 days (8 reels): **30 Oct 13:28 Nº 08 "Why does the page scroll, behind your popup?" 2,518 reach, 9.0 s, 80 saves, 12 shares at ~10 h** (milestone: a fourth reel over 1,000) · Nº 04 4,704 · Nº 05 2,401 · Nº 06 1,422 · Nº 03 1,168 · Nº 07 182 · others 166-182. Median 1,295 (was 176); 411 saves, 43 shares. Account, last day: reach 2,963 (98% non-followers), views 4,032.
techin20sec, 7 days (19 reels): 30 Oct 18:45 "The MacBook Pro now has a touchscreen" 24 reach, 3.0 s · best Amazon cloud 173. Median 113; 2 saves, 0 shares. Account, last day: reach 62. Head-to-head median 1,295 vs 113.
Lesson: Nº 07 (182) and Nº 08 (2,518) are the same series and shape; Nº 08 fixes an annoyance every phone user has felt this week (the page scrolling behind a popup). Pick fixes people feel, not ones they must imagine.
Today: Nº 09 tabular-nums (rendered 30 Oct); @techin20sec test day 1, "Why does your iPhone stop at 80%?" (Apple Support 108055), a mechanism, not news.

### 30 Oct 2026, 08:52 IST audit (collect 05:25 IST; @webin20sec 56 followers (+5), 24 posts; @techin20sec 9 followers (+0), 26 posts)
Studio, 7 days (9 reels): **29 Oct 12:32 Nº 07 "Why does your page jump when you tap a link?" 160 reach, 7.8 s, 2 saves at 11.4 h** (Nº 06 had 300 at 6.5 h) · 28 Oct Nº 06 headline 1,376, 12.5 s, 43 saves · 27 Oct Nº 05 2,379 · 26 Oct Nº 04 4,645, 186 saves · 25 Oct Nº 03 1,157 · others 63-176. Median 176; 285 saves, 32 shares. Account, last day: reach 1,772 (35 followers), views 2,694.
techin20sec, 7 days (20 reels): **29 Oct 15:36 "Your Discord messages could soon show up on Google" 31 reach, 2.6 s at 8.3 h** · best of the week Amazon cloud 173 · PHP2Shell 147. Median 115.5; 3 saves, 0 shares. Account, last day: reach 46, views 84.
Head to head: median reach 176 vs 115.5 (1.5x). No new milestone (Nº 06 passed 1,000 on 29 Oct; 100 followers not yet).
Lesson: a fix most devs already know (smooth scroll) starts slow; the non-obvious fixes (text-wrap: balance, stagger) earn the saves. Pick tips people have not seen. Tech: today a gadget launch (touchscreen MacBook Pro) to test a buying-decision stake against the security run.

### 29 Oct 2026, 08:52 IST audit (collect 05:28 IST; @webin20sec 51 followers (+7 since 19:10), 23 posts; @techin20sec 9 followers (+0), 25 posts)
Studio, 7 days (9 reels): **28 Oct 12:33 Nº 06 "Why does your headline break so badly?" (Steal this) 1,202 reach, 12.6 s of 20, 34 saves, 3 shares at 16.9 h** (was 300 at 6.5 h) · 27 Oct Nº 05 stutter (Steal this) 2,357, 8.9 s, 46 saves, 4 shares · 26 Oct Nº 04 list (Steal this) 4,525, 14.2 s, 180 saves, 22 shares · 25 Oct Nº 03 popup (Steal this) 1,152, 8.1 s · Nº 02 INP (other) 157 · 24 Oct Nº 01 springs (other) 170 · 23 Oct zero-JS (Steal this) 59 · Built in 20 s 116 · 22 Oct cancel order (other) 26. Median 170; 271 saves, 32 shares. Account, last day: reach 3,757 (36 followers), views 5,520.
techin20sec, 7 days (20 reels): **28 Oct 12:57 "Siri now remembers your past chats" 6 reach, 3.6 s at 16.5 h** · 27 Oct Wero 67, 3.9 s · Starlink rival 8 · best of the week Amazon cloud 173, 7.0 s (25 Oct 15:20) · PHP2Shell 146. Median 116.5; 4 saves, 2 shares. Account, last day: reach 70, views 138.
Same age (~17 h): Nº 06 1,202 vs Nº 05 2,276 vs Nº 04 3,585 (24 h figure for Nº 06 tomorrow). Follows by reel day: 26 Oct Nº 04 +17 · 27 Oct Nº 05 +13 · 28 Oct Nº 06 +7 (all overnight). Tech: +0 since 26 Oct.
**Head to head:** median reach 170 vs 116.5; saves 271 vs 4. **Read:** Nº 06 was a late starter, not a miss: it climbed 4x overnight and holds 63% of 20 s, the series' second best, so last night's "static type loses" read was premature; the "Why does your X…?" + one CSS fix format has now cleared 1,000 reach four times in a row. Tech's last two news reels sit under 10 reach: distribution, not hook, is its problem.
**Milestone:** 51/100 followers; best reel 4,525/1,000 reach (since 26 Oct). **Next:** studio keeps the narrated "Why does your X…?" CSS fix with a visible before/after, 12:30-13:30 IST; tech posts one explainer with a viewer stake (question hook) at 15:00-19:00 IST, not breaking news.
### 28 Oct 2026, 19:10 IST audit (collect 19:05 IST; @webin20sec 44 followers (+0 since 05:13), 23 posts; @techin20sec 9 followers (+0), 25 posts)
Studio, 7 days (10 reels): **28 Oct 12:33 Nº 06 "Why does your headline break so badly?" (text-wrap: balance) 300 reach, 7.1 s of 20, 4 saves, 0 shares at 6.5 h** (Nº 05 at 6.1 h: 2,132, 8.9 s, 39 saves, 4 shares) · Nº 05 2,335, 8.9 s of 21, 46 saves, 4 shares at 30.5 h (+59 since 05:13) · Nº 04 4,385, 13.0 s of 20, 169 saves, 21 shares at 53.6 h · Nº 03 1,150 · Nº 01 167 · Nº 02 155 · Built in 20 s 114 · zero-JS 56 · heroes 30 · cancel order 24. Median 161; 260 saves, 28 shares.
techin20sec, 7 days (21 reels): **28 Oct 12:57 "Siri now remembers your past chats" 6 reach, 3.6 s at 6.1 h** (GitLab at 6.0 h: 65, 4.3 s; Starlink rival at 7.2 h: 7, 1.5 s; PHP2Shell at 3.7 h: 143) · now GitLab 118, PHP2Shell 146, Wero 67, Starlink rival 8 · best Amazon cloud 173, 7.0 s. Median 116; 3 saves, 0 shares.
Account, last day: @webin20sec reach 2,896 (non-followers 2,867, followers 31), views 4,078 (3,974 / 104); @techin20sec reach 70 (62 / 8), views 137 (90 / 47).
Follows by reel day (studio): 24 Oct Nº 01 +1 · 25 Oct Nº 02 + Nº 03 +1 · 26 Oct Nº 04 +17 · 27 Oct Nº 05 +13 · 28 Oct Nº 06 +0 so far. Tech: +1 on 26 Oct, +0 since.
**Read:** Nº 06 kept the "Why does your X…?" hook, the ~20 s length and the midday slot, yet sits at 14% of Nº 05's reach at the same age with the lowest hold of the series (36% of 20 s vs 65% for Nº 04): the three tips past 1,000 reach (popup, list, animation) all show an element moving; the static type fix did not.
Tech's two pre-13:00 posts in a row stalled under 10 reach (Starlink rival 8, Siri 6) while its 15:00-23:30 posts sit at 67-146.
**Next:** tomorrow's studio tip goes back to a visible motion before/after (the shape of Nº 04/05), ~20 s, posted 12:30-13:30 IST; re-read Nº 06 at 24 h before judging it.
### 28 Oct 2026, audit (collect 05:13 IST; @webin20sec 44 followers (+6 since 18:50), 22 posts; @techin20sec 9 followers (+0), 24 posts)
Studio, 7 days (9 reels): **27 Oct 12:38 Nº 05 "Why does your animation stutter?" (Steal this) 2,276 reach, 8.9 s, 45 saves, 4 shares at 16.6 h** · 26 Oct 13:31 Nº 04 list (Steal this) 4,249 (+187), 13.1 s, 161 saves, 17 shares · 25 Oct Nº 03 popup (Steal this) 1,147, 8.0 s, 32 saves · Nº 02 INP (other) 153 · Nº 01 springs (other) 164 · zero-JS (Steal this) 53 · Built in 20 s 113, 2.7 s · cancel order (other) 23 · heroes (Six ways) 27. Median 153; 246 saves, 24 shares.
techin20sec, 7 days (21 reels): **27 Oct 15:30 Wero 59 reach, 3.7 s at 13.7 h** (Starlink rival 11:35: 7, 1.4 s) · Amazon AI cloud 173, 7.0 s · PHP2Shell 146 · CA weak keys 136. Median 117; 5 saves, 2 shares.
Account, last day: @webin20sec reach 6,227 (non-followers 6,211, followers 29), views 8,860 (non-followers 8,733); @techin20sec reach 506 (498 / 8), views 779 (634 / 145).
Head to head: median 153 vs 117 (Goal 1 holds). Follows: +6 overnight on the day of Nº 05 + Nº 04's tail, still ~1 follow per 1,000 reach.
Why Nº 05 worked: same "Why does your X?" hook as Nº 04, posted midday, but it decays faster (2,276 at 17 h vs Nº 04 3,025 at 9 h): an invisible fix saves less (2.0% vs 3.8%).
Milestone: 44/100 followers; reel reach met (best 4,249/1,000). **Next:** a Six ways reel told as a question with a visible before/after (three Steal this in a row).

### 27 Oct 2026, 18:50 IST audit (collect 18:45 IST; @webin20sec 38 followers (+7 since 05:19), 22 posts; @techin20sec 9 followers (+0), 24 posts)
Studio, 7 days (9 reels): **27 Oct 12:38 Nº 05 "Why does your animation stutter?" 2,132 reach, 8.9 s, 39 saves, 4 shares at 6.1 h** (Nº 04 at 9.3 h: 3,025, 11.3 s, 91 saves, 12 shares) · 26 Oct 13:31 Nº 04 4,062 (+477 since 05:19), 13.1 s, 151 saves, 16 shares at 29 h · Nº 03 1,141, 32 saves · Nº 02 147 · Nº 01 157 · zero-JS 51 · Built in 20 s 110 · layout shift 22 · heroes 26. Median 147; 229 saves, 23 shares.
techin20sec, 7 days (22 reels): **27 Oct 11:35 Europe Starlink rival 7 reach, 1.5 s at 7.2 h** (GitLab at 6.0 h: 65, 4.3 s; PHP2Shell at 10.1 h: 144, 3.0 s) · 15:30 Wero 36, 3.2 s at 3.3 h · GitLab now 118, 3.7 s, 1 save · PHP2Shell 145 (+1). Median 117; 7 saves, 3 shares in 24 posts.
**Read:** Nº 05 reached 70% of Nº 04's 9.3 h reach in 6.1 h, but holds less (8.9 vs 11.3 s) and is saved half as often (1.8% vs 3.0%). The studio gained 7 followers today on Nº 04/05 traffic; tech gained 0 and its newest reel stalled at 7. The collector reads no profile visits, follows per reel or traffic sources (only views, reach, saves, shares, likes, comments, watch time).
### 27 Oct 2026, 08:55 IST audit (collect 05:19 IST; @webin20sec 31 followers (+2), 21 posts; @techin20sec 9 followers (+0), 22 posts)
Studio, 7 days (8 reels): **26 Oct 13:31 Nº 04 "Why does your list feel so flat?" (Steal this, narrated) 3,585 reach, 11.3 s, 120 saves, 12 shares** · 25 Oct 17:17 Nº 03 popup (Steal this, narrated) 1,134, 8.0 s, 31 saves, 2 shares · 25 Oct 11:37 Nº 02 INP (other, narrated) 142, 8.5 s, 1 save · 24 Oct Nº 01 springs (Steal this, narrated) 153, 8.9 s, 3 saves · 23 Oct zero-JS (Steal this) 46, 6.0 s · 23 Oct Built in 20 s 107, 2.6 s · 22 Oct layout shift (other) 18 · 21 Oct heroes (Six ways) 22. Median 124.5.
techin20sec, 7 days (21 reels): last 24 h best 26 Oct 19:10 PHP2Shell 144, 3.0 s, 0 saves · 23:21 GitLab takeover 65, 4.3 s (at 6 h) · undersea volcano 105, prime editing 111. Median 117; 6 saves + 3 shares across 22 posts.
**Head to head:** median reach 124.5 vs 117; studio saves 166 vs 6. Nº 04 grew 3,025 → 3,585 overnight (+19%), save rate 3.3%: a "Why does your X feel Y?" question over a visible flaw, then one CSS line, keeps getting pushed a day later; tech's news hooks stay pinned near 115 reach.
**Milestone:** 31/100 followers; best reel 3,585/1,000 reach (reached 26 Oct). Reach is not converting to follows (+2 from 3,585 reach): the profile and the caption need a reason to follow (a numbered series to collect).
**Next:** Six ways, told as a narrated tip (rotation rule after three Steal-this reels; it is the earlier saver), opening on the same "Why does your … feel …?" question form, posted 13:00-14:00 IST.
### 26 Oct 2026, 22:50 IST audit (collect dispatched 22:49 IST; @webin20sec 29 followers (+15), 21 posts; @techin20sec 9 followers (+1), 21 posts)
**Milestone: first reels past 1,000 reach.** Studio, 7 days: **26 Oct 13:31 Nº 04 "Why does your list feel so flat?" (narrated motion tip) 3,025 reach, 11.3 s, 91 saves, 12 shares at 9.3 h** · 25 Oct 17:17 Nº 03 popup (motion tip) 1,124, 8.0 s, 30 saves, 2 shares (was 540 this morning) · 25 Oct 11:37 Nº 02 INP 142, 8.5 s, 1 save · 24 Oct Nº 01 springs 153, 8.9 s, 3 saves · 23 Oct zero-JS (Steal this) 45, 6.0 s, 1 share · 23 Oct Built in 20 s 107, 2.6 s, 2 saves · 22 Oct layout shift (other) 17 · 21 Oct heroes (Six ways) 22. Median 124.5 (8 reels).
techin20sec, 7 days (20 reels): 26 Oct 19:10 PHP2Shell remake 143, 3.0 s, 0 saves, 0 shares at 3.7 h · 12:31 undersea volcano 104, 2.3 s · 10:34 prime editing 111, 1.4 s · 25 Oct 15:20 Amazon cloud 172, 7.1 s (best) · rest 87-136. Median 117; 5 saves + 2 shares all week.
**Read:** head to head 124.5 vs 117 median, but the studio's two motion tips alone reached 4,149 vs 2,397 for all 20 benchmark reels; Nº 04 is 5.6x Nº 03 at the same age, so the 13:30 IST slot did not hurt and the format compounds (Nº 03 doubled overnight on Nº 04's traffic). Saves at 3.0% of reach say people keep the one-line fix.
**Next:** "Why does your animation stutter?" (left vs transform) keeps the exact winning shape: "Why does your X…?" on your own UI, the broken version first, one copyable line, ~17 s, post ~13:30 IST. Benchmark GitLab 10/10: security news sits at/above its median (PHP bugs 117, CA keys 136, PHP2Shell 143), its best watch comes from stakes stated as a claim (Amazon 7.1 s, "encrypted" 7.0 s) and 15:00-19:00 IST posts.
### 26 Oct 2026, 08:55 IST audit (nightly collect 04:00 IST; @webin20sec 14 followers (+1), 20 posts; @techin20sec 8 followers (+0), 17 posts)
Studio, 7 days: **25 Oct 17:17 Nº 03 "Why does your popup just snap in?" (narrated motion tip) 540 reach, 6.8 s, 15 saves, 1 share at 10.7 h (4 h: 272, 5.6 s, 3 saves, 1 share; still climbing, new account best)** · 25 Oct 11:37 Nº 02 INP (narrated explainer) 134, 8.1 s, 1 save · 24 Oct 13:16 Nº 01 springs (narrated explainer) 146, 8.2 s, 3 saves · 23 Oct 21:21 zero-JS (Steal this) 40, 6.3 s, 1 share · 23 Oct 13:23 Built in 20 s 103, 2.5 s, 2 saves · 22 Oct layout shift (other) 15, 5.2 s · 21 Oct heroes (Six ways) 21, 3.6 s · 19 Oct launch (other) 23, 2.7 s. Median 71.5 reach (8 reels).
techin20sec, 7 days (17 reels): 26 Oct 00:20 SpaceX cell sites 113, 4.8 s · 25 Oct 21:33 training agent loophole 77, 1.7 s · 19:20 open model hacking 72, 2.9 s · 15:20 AI demand outruns the cloud 170, 7.3 s · 11:41 container data center 113, 1.8 s · 01:17 AI-chip profit share 114 · earlier 110-135, 19 Oct 34. Median 114, 1 save + 0 shares this week after 21 Oct; five reels in 24 h.
**Head to head:** median reach 71.5 vs 114 (gap halved from 35.5 vs 115). Best of 24 h: ours Nº 03 (540, 15 saves: a "why" question about a bug every dev has seen, the snap shown in second 1, a one-rule fix worth saving, 17:17 evening slot); theirs AI demand (170, 7.3 s: a big number and a named company in the first line, 15:20).
**Read:** Nº 03 is the first reel to get a second wave (272 → 540 overnight) and 2.8% save rate; a concrete UI pain + one CSS rule beats the abstract explainers (Nº 01/02 ~140). Shares are still 1: the caption needs a line worth sending.
Milestone: 14/100 followers, best reel 540/1,000 reach (Nº 03). **Next:** Nº 04 stagger (narrated motion tip, ready, 14:00 IST today as planned: same shape as Nº 03, and the daytime test); keep motion tips over explainers until one stalls; re-check Nº 03 at 48 h.

### 25 Oct 2026, 09:00 IST audit (nightly collect 03:56 IST; @webin20sec 13 followers (+0), 18 posts; @techin20sec 8 followers (+0), 12 posts)
Studio, 7 days: **24 Oct 13:16 Nº 01 "Why do some buttons feel expensive?" (narrated explainer) 143 reach, 8.1 s avg watch, 3 saves, 0 shares at 14.7 h (3 h: 140, 8.2 s, 3 saves: flat after the first push)** · 23 Oct 21:21 zero-JS transition (Steal this) 39, 6.5 s, 1 share (first share in 7 days) · 23 Oct 13:23 Built in 20 s 102, 2.5 s, 2 saves · 22 Oct layout shift (other) 14, 4.6 s · 21 Oct heroes (Six ways) 19, 3.8 s · 19 Oct launch site (other) 22, 2.8 s · 18 Oct 22:14 CDN (other) 32, 3.2 s · 18 Oct 14:20 6 motion styles (Six ways) 278, 4.8 s, 8 saves. Median 35.5 reach.
techin20sec, 7 days: 25 Oct 01:17 AI-chip profit share 5, 4.7 s · 24 Oct 14:56 coding agents weakened safety monitoring 94, 3.9 s · 24 Oct 11:58 AI shopping 73, 4.8 s · 24 Oct 00:04 PHP bugs 116 · 23 Oct weak-key flaw 135, 1 save; MCP 116, 1 save · 22 Oct encrypted data 119, 7.1 s · 21 Oct quantum 113; AI-agent hijack 119, 2 saves, 2 shares · 20 Oct RAM 122; giant models 114, 2 saves · 19 Oct AI agents 34. Median 115 reach, ~4.2 s; its last three reels fell (94, 73, 5).
**Head to head:** median reach 35.5 vs 115; best of 24 h: ours Nº 01 (143, question hook + voice, the best watch time on either account this week), theirs coding agents (94, a news hook naming a big lab).
**Read:** Nº 01 got its one push in the first 3 h (140 of 143) and stalled: 0 shares means nobody sent it, so it never got a second wave; watch time is not the bottleneck, sends are.
Milestone: 13/100 followers, best reel 278/1,000 reach. **Next explainer:** keep the question hook, voice and ~8 s hold; get to the answer by ~10 s (Nº 02 does) and give the caption
a line worth sending ("send this to the dev who ships ease-in-out"; no call to action in the video); post 19:00-21:30 IST, when our only share came.

### 24 Oct 2026, 16:20 IST audit (on-request collect 16:20 IST; @webin20sec 13 followers (+1), 18 posts; @techin20sec 8 followers (+0), 11 posts)
Studio, 7 days: **24 Oct 13:16 "Why do some buttons feel expensive?" (Nº 01, showreel-11-springs, first narrated explainer) 140 reach, 8.2 s avg watch (36% of 23 s), 3 saves, 0 shares at 3.1 h** · 23 Oct 21:21 zero-JS transition 17, 11.3 s (71% of 16 s), 0 saves at 19 h · 23 Oct 13:23 Built in 20 s 102, 2.5 s, 2 saves · 22 Oct 16:20 layout shift 14, 4.6 s · 21 Oct 23:21 heroes 19, 3.8 s · 19 Oct 18:31 launch site 22, 2.5 s · 18 Oct 22:14 CDN 32, 3.2 s · 18 Oct 14:20 6 motion styles 278, 4.8 s, 8 saves · 17 Oct 21:21 CDN 49, 4.9 s. 0 shares all week.
techin20sec, 7 days: 24 Oct 14:56 coding agents vs safety monitoring 9, 5.3 s · 24 Oct 11:58 AI shopping 19, 5.2 s · 24 Oct 00:04 PHP bugs 116, 3.8 s · 23 Oct 14:12 weak-key flaw 134, 4.3 s, 1 save · 23 Oct 11:52 MCP 115, 4.0 s, 1 save · 22 Oct 16:43 encrypted data 119, 7.1 s · 21 Oct quantum 113, 4.1 s; AI-agent hijack 119, 4.7 s, 2 saves, 2 shares · 20 Oct RAM 122, 5.7 s; giant models 114, 3.7 s, 2 saves · 19 Oct AI agents 34, 1 share. Medians: 115 reach, 4.3 s, 0 saves.
**Nº 01 vs references, signals ranked:** (1) reach: 140 in 3 h already beats Built in 20 s (102 lifetime), zero-JS (17) and the benchmark median (115); (2) saves: 3, the best since 6 motion styles (2.1% save rate); (3) avg watch 8.2 s: 3.3x Built in 20 s and 1.9x the benchmark median, but below zero-JS (11.3 s) and only 36% of the reel; (4) shares: still 0.
**Head to head, median reach per reel (7 days):** studio 32 (9 reels) vs techin20sec 115 (11 reels). **Milestone:** not hit; 13/100 followers, best reel 278/1,000 reach (Nº 01 at 140).
**Read:** the narrated question hook gets distribution the silent reels never got, but two thirds of the 23 s go unwatched. **Next narrated explainer:** answer the question by ~8 s and cut it to 16-18 s, so the payoff sits inside the watch time people actually give; ask for a send in the caption.
### 24 Oct 2026, 08:55 IST audit (collect 04:36 IST; @webin20sec 12 followers (+0), 17 posts; @techin20sec 8 followers (+0), 9 posts)
Studio, 7 days: 23 Oct 21:21 "This page transition uses zero JavaScript" (Steal this, showreel-10) **12 reach, 13.4 s avg watch** (5 h old) · 23 Oct 13:23 Built in 20 s 102, 2.5 s, 2 saves · 22 Oct 16:20 layout shift (other) 14, 4.6 s · 21 Oct 23:21 heroes (Six ways) 19, 3.8 s · 19 Oct 18:31 launch site (other) 22, 2.5 s · 18 Oct 22:14 CDN (other) 32, 3.2 s · 18 Oct 14:20 6 motion styles (Six ways) 278, 4.8 s, 8 saves · 17 Oct 21:21 CDN (other) 49, 4.9 s. 0 shares all week.
techin20sec, 7 days: 24 Oct 00:04 PHP bugs 109, 3.8 s · 23 Oct 14:12 weak-key flaw 129, 4.4 s, 1 save · 23 Oct 11:52 MCP 112, 4.0 s, 1 save · 22 Oct 16:43 encrypted data 119, 7.1 s · 21 Oct quantum 113, 4.1 s; AI-agent hijack 119, 4.7 s, 2 saves, 2 shares · 20 Oct RAM 121, 5.7 s; giant models 114, 3.7 s · 19 Oct AI agents 33.
**Head to head:** median reach per reel 27 (studio, 8 reels) vs 114 (techin20sec, 9 reels). Best of 24 h: studio Built in 20 s (102, 2 saves, nearly doubled overnight); techin20sec weak-key flaw (129), a news claim that is answered in the first line.
**Read:** showreel-10 (paradox hook + sound, closest to the narrated format) held 13.4 s, the account's best hold since the 13 Oct film, but Instagram had shown it to 12 people; Built in 20 s got reach (102) yet held 2.5 s. Hook + voice keeps people; distribution still does not.
techin20sec's floor is ~110 reach per reel with only 8 followers: a question or claim in the first words, posted daily. **Milestone:** 12/100 followers; best reel 278/1,000 reach.
**Next:** Nº 01 "Why do some buttons feel expensive?" (narrated explainer) as soon as the rough cut passes review; re-check showreel-10 at 24 h and 48 h as its baseline.

### 23 Oct 2026, 20:25 IST audit (collect 20:23 IST; @webin20sec 12 followers (+0), 16 posts; @techin20sec 8 followers (+1), 8 posts)
Studio: 23 Oct 13:23 "A website, built in 20 seconds" (Built in 20 s, film look) **54 reach, 2.8 s avg watch**, 0 saves, 0 shares (7 h old) · 22 Oct 16:20 layout shift 14, 4.6 s · 21 Oct 23:21 heroes 19, 3.8 s.
techin20sec: 23 Oct 14:12 weak-key flaw 102, 4.7 s, 1 save · 23 Oct 11:52 MCP explained 107, 4.1 s, 1 save · 22 Oct 16:43 "Why steal data you can't even read?" 119, 7.2 s.
**Head to head (median reach, 7 days):** studio 32 vs techin20sec 113. Built in 20 s reached more than our last four, but 2.8 s of 20 s watched: its first second (grid lines on bone, the headline still arriving) states nothing.
**Lesson:** every techin20sec reel opens with a question or a claim on screen; ours open on a picture. **Action:** a hook line on screen from frame 0 on every reel (done for showreel-10; added to 08 and 09 before they post).
**Milestone:** 12/100 followers; best reel 278/1,000.

### 23 Oct 2026, 08:52 IST audit (collect 04:48 IST; @webin20sec 12 followers (+0), 15 posts; @techin20sec 7 followers (+3), 6 posts)
Studio, 7 days (posted IST, series, reach, avg watch, saves, shares): 22 Oct 16:20 "Why did I just cancel my order?" (other: layout-shift explainer) 10, 5.7 s, 0, 0 · 21 Oct 23:21 heroes (Six ways) 19, 3.8 s, 0, 0 ·
19 Oct 18:31 launch (other) 22, 2.5 s · 18 Oct 22:14 CDN (other) 32, 3.2 s · 18 Oct 14:20 "6 motion styles" (Six ways) **278**, 4.7 s, **8**, 0 · 17 Oct 21:21 CDN (other) 48, 4.9 s · 16 Oct 17:31 outdated (other) 15, 4.1 s. 0 shares in 15 posts.
techin20sec: 22 Oct 16:43 "Why steal data you can't even read?" 118, **7.2 s**, 0, 0 · 21 Oct 23:41 quantum 112, 4.2 s · 21 Oct 09:19 AI-agent hijack 118, 4.7 s, 2, **2** · 21 Oct 00:51 RAM 121, 5.7 s · 20 Oct 15:03 AI models 113, 3.7 s, 2, 0 · 19 Oct 14:47 agents 33, 3.9 s, 0, 1.
**Median reach per reel, 7 days:** studio 22 vs techin20sec 115.5. **Best of 24 h:** techin20sec's encryption reel, a paradox question ("steal data you can't read?") that makes the viewer wait for the answer: its best watch yet (7.2 s).
Studio's only post (16:20, afternoon) reached 10: moving off late night did not lift reach, so time is not the main lever; techin20sec gets ~115 on every reel whatever the topic, studio's floor is 10-50.
Heroes (Six ways) at 33 h: 19 vs 278 for motion styles: the series name alone does not repeat the result; the first frame and the element do.
**Milestone:** 12/100 followers; best studio reel 278/1,000 reach. **Next:** post Built in 20 s (showreel-07, ready, never posted; Six ways and an explainer just ran) with a question hook in second 1, 14:00-17:00 IST.
### 22 Oct 2026, 08:55 IST audit (collect 04:44 IST; @webin20sec 12 followers (+0 since 21 Oct), 14 posts; @techin20sec 4 followers (+2), 5 posts)
Studio, last 7 days (posted IST, reach, avg watch, saves, shares): 21 Oct 23:21 "6 website heroes. 20 seconds. All built in code." 11, 4.9 s, 0, 0 (5 h old) · 19 Oct 18:31 launch film 22, 2.5 s, 0, 0 ·
18 Oct 22:14 CDN film 32, 3.2 s, 0, 0 · 18 Oct 14:20 "6 motion styles" **277**, 4.7 s, **8**, 0 · 17 Oct 21:21 CDN film 48, 4.9 s, 0, 0 · 16 Oct 17:31 "outdated website" 15, 4.1 s, 0, 0 · 15 Oct 23:22 "slow abroad" 115, 5.5 s, 0, 0.
techin20sec: 21 Oct 23:41 quantum 108, 4.0 s, 0, 0 · 21 Oct 09:19 "Can a webpage hijack your AI agent?" 114, 4.8 s, 2, **2** · 21 Oct 00:51 RAM prices 118, 5.8 s, 0, 0 · 20 Oct 15:03 AI models 110, 3.7 s, 2, 0 · 19 Oct 14:47 AI agents 29, 3.7 s, 0, 1.
**Best of 24 h:** the prompt-injection reel (techin20sec): a yes/no question with a threat in it ("hijack"), answered "Yes" at once, gets sends (2 shares, 1.8%); the studio account has 0 shares in 14 posts.
techin20sec holds a steady 108-118 reach per reel with 4 followers; the studio's late-night posts (22:00-23:30) sit at 11-48. The style series repeat (23:21) has not repeated the 14:20 result yet: re-check at 48 h.
**Milestone:** 12/100 followers; best studio reel 277/1,000 reach. **Next:** 14:00 IST studio post = a threat-question hook on a buyer's risk ("Can a bot take your site down?"), answered in second 1, ending on a send-to-a-founder line.

### 21 Oct 2026, 17:44 IST audit (new token; @aquarii.techstudio, 12 followers (9 on 18 Oct), 13 posts)
| posted | format | views | reach | avg watch | likes | comments | saves | shares |
|---|---|---|---|---|---|---|---|---|
| 19 Oct | film | 28 | 22 | 2.5 s | 4 | 0 | 0 | 0 |
| 18 Oct | film | 48 | 32 | 3.2 s | 5 | 0 | 0 | 0 |
| 18 Oct | film | **329** | **277** | 4.5 s | 11 | 1 | **8** | 0 |
| 17 Oct | film | 73 | 48 | 4.7 s | 5 | 1 | 0 | 0 |
| 16 Oct | film | 28 | 15 | 4.2 s | 5 | 0 | 0 | 0 |
| 15 Oct | film | 133 | 115 | 5.5 s | 8 | 0 | 0 | 0 |
| 14 Oct | film | 23 | 12 | 9.8 s | 8 | 0 | 0 | 0 |
| 13 Oct | film (Dantika) | 26 | 14 | 8.1 s | 6 | 0 | 0 | 0 |
| 9-12 Oct | 5 recordings | 12-122 | 9-110 | 2.4-4.0 s | 5-7 | 0 | 1 | 0 |
**Read:** (1) the 18 Oct film is the best post so far: 277 reach (2.5x the old best) and 8 saves (2.9% of reach, the first real save signal). (2) Reach is moving:
the median since 15 Oct is 40 against 15 for 9-14 Oct (2.7x; E12 wants 3x by 29 Oct). Followers went from 9 to 12. (3) **Watch time is sliding on the newest films:**
4.5, 3.2 and 2.5 s on 18-19 Oct against 8.1-9.8 s for the first films; the newest ones are longer (voiced, about 24 s) and open slower. (4) Shares are still 0 on all 13 posts.
**Next:** films back to about 18 s with the hook moving in the first second; keep the voice short; end on a line made to be sent to a friend plus Comment "AQUARII";
find which reel made the 18 Oct jump (the collector cannot match it to a template) and repeat its hook and subject. Token refreshed and stored for 60 days.
**Which reel (collector now prints links and captions):** the 18 Oct jump is "6 motion styles. 20 seconds. One reel. ⚡" (posted 14:20 IST,
https://www.instagram.com/reel/DeoSjGQJfrY/): a numbered showcase of styles, not a service pitch, posted in the afternoon. Its 8 saves say people keep it as a reference.
This is the E7 style-switch idea (open item #2) working in the wild: make it a series. 17 Oct 21:21 and 18 Oct 22:14 are the same Veloria/CDN film posted twice
(48 and 32 reach); 19 Oct 18:31 is the Aurelia launch film (22 reach, 2.5 s).

### 21 Oct 2026, verdict (numbers from the last good Instagram collect, 18 Oct 03:44 IST; @aquarii.techstudio, 9 followers, 10 posts)
The collector has failed every night since 19 Oct: Instagram invalidated the token (code 190, "session invalidated", usually a password change or a Meta security reset).
The run still shows green because the log is piped through `tee`, so the failure alert never fired. Numbers below are frozen at 18 Oct.
| posted | reel | format | views | reach | avg watch | likes | comments | saves | shares |
|---|---|---|---|---|---|---|---|---|---|
| 17 Oct | (unmatched) | film | 47 | 31 | **7.1 s** | 3 | 1 | 0 | 0 |
| 16 Oct | (unmatched) | film | 27 | 14 | 4.3 s | 4 | 0 | 0 | 0 |
| 15 Oct | (unmatched) | film | 132 | 114 | **5.6 s** | 7 | 0 | 0 | 0 |
| 14 Oct | (unmatched) | film | 22 | 11 | **10.2 s** | 7 | 0 | 0 | 0 |
| 13 Oct | Dantika | film v3 | 24 | 13 | **8.4 s** | 5 | 0 | 0 | 0 |
| 12 Oct | Gojigo | recording | 21 | 14 | 2.4 s | 5 | 0 | 0 | 0 |
| 12 Oct | Gumdrop | recording | 10 | 7 | 3.0 s | 3 | 0 | 0 | 0 |
| 11 Oct | Lumen | recording | 121 | 109 | 2.5 s | 6 | 0 | 0 | 0 |
| 10 Oct | (unmatched) | recording | 30 | 23 | 3.5 s | 4 | 0 | 0 | 0 |
| 9 Oct | Tessera | recording | 75 | 63 | 4.1 s | 5 | 0 | 1 | 0 |
**E6 verdict: keep films.** 3+ films have 48 h of data (13, 14, 15 Oct). Average watch on films: 8.4, 10.2, 5.6, 4.3, 7.1 s (median 7.1) against 2.4-4.1 s
(median 3.0) for every screen recording, so 4 of 5 films beat the best recording (the rule needed 2 of 3).
**E1 verdict: format B recordings did not lift watch time** (2.4-3.5 s, inside the 2.5-4.6 s baseline). Closed; films replaced them.
**Still the bottleneck: distribution.** Median reach is 31 for films from 15-17 Oct against about 18 for 9-14 Oct (about 1.7x; E12 needs 3x by 29 Oct).
Shares are 0 on all 10 posts, saves 1, and the first comment arrived on 17 Oct.
**Next:** (1) the owner regenerates INSTAGRAM_TOKEN; (2) films only, each with Comment "AQUARII" and a line written to be sent to a friend;
(3) after the website redesigns, re-post the strongest sites (Aurelia, Veloria, Plumpaw, Halcyra) as films at 19:30 IST Mon/Wed/Fri, with an Instagram track,
shared to Stories and sent by DM to 5-10 owners of that kind of business; (4) re-check on 29 Oct for the E12 verdict.

### 14 Oct 2026, 05:16 UTC (@aquarii.techstudio, renamed; 6 followers, 6 posts)
| posted | template | format | views | reach | avg watch | saves | shares |
|---|---|---|---|---|---|---|---|
| 13 Oct | Dantika | film v3 | 11 | 7 | **13.5 s of 18** | 0 | 0 |
| 12 Oct | Gojigo | recording | 10 | 9 | 2.1 s | 0 | 0 |
| 12 Oct | Gumdrop | recording | 4 | 3 | 3.7 s | 0 | 0 |
| 11 Oct | Lumen | recording | 114 | 105 | 2.5 s | 0 | 0 |
| 9 Oct | Tessera | recording | 70 | 60 | 4.0 s | 1 | 0 |
**Read:** after ~16 h the film still holds people for 13.5 s on average (about 75% of the reel) against 2-4 s for every recording: the format works for whoever sees it.
Reach is still tiny (7) and nobody has shared anything yet, so distribution is the whole problem. **Next:** post Suddly tonight at 19:00-20:00 IST with an Instagram track,
share to Stories and DM it to 5-10 laundry/dry-cleaning owners; keep films only; first E6 verdict when 3 films have 48 h of data (Dantika, Suddly, tomorrow's).

### 13 Oct 2026, 19:25 UTC (Instagram collect; @aquarii.webstudio, Creator account, 6 followers, 6 posts)
| posted | template | format | views | reach | avg watch | saves | shares |
|---|---|---|---|---|---|---|---|
| 13 Oct | Dantika (2026-10-13-1902) | film v3 | 5 | 4 | **17.8 s of 18** | 0 | 0 |
| 12 Oct | Gojigo (2026-10-12-0850) | recording | 10 | 9 | 2.1 s | 0 | 0 |
| 12 Oct | Gumdrop (2026-10-11-0931) | recording | 2 | 2 | 4.3 s | 0 | 0 |
| 11 Oct | Lumen (2026-10-11-0930) | recording | 113 | 104 | 2.5 s | 0 | 0 |
| 10 Oct | (unmatched) | recording | 23 | 19 | 4.2 s | 0 | 0 |
| 9 Oct | Tessera (2026-10-07-0916) | recording | 69 | 59 | 4.0 s | 1 | 0 |
**Read:** the first film was watched almost to the end by the few who saw it (17.8 s vs 2-4 s for every recording). Tiny sample (4 people, a few hours old), so not a
verdict, but it supports the switch to films (E6). **The bottleneck is reach, not the video:** 4-113 reach per reel, 0 shares in 6 posts.
**Next actions:** (1) films only (done); (2) reach: post at one fixed evening time (19:00-20:00 IST) every day, add an Instagram audio (not silent), share each reel to
Stories and send it by DM to 5-10 people in that business type (sends are the strongest signal), reply to every comment; (3) give viewers a reason to send it: end on a
line addressed to a friend ("Send this to a café owner who closes at 10"); (4) trial reels need 1,000+ followers (third-party guides), so not yet;
(5) re-check Dantika after 24 h and 48 h; first real E6 verdict once 3 films have 48 h of data.

## 14 Oct 2026: services pivot (owner feedback)
The owner: the reels read as if Aquarii sells laundry, food delivery and dentistry. Every reel from now on sells one Aquarii service line (design/services.md:
web, social, security, edge; studio for intros) with the template only as proof. First one: the Suddly slot re-cut as the studio ad (pendulum "Need X? We got you."
+ diagram tour + shield). E11 is therefore running; E10 (cheat sheet) is folded into the formats list. What to watch: sends and DMs per reach vs the template-led reels.
Same day, owner: that re-cut copied the reference reel (swinging tag, "Need X? We got you.", "Screenshot this"): plagiarism. E10/E11 as written above are retired in
that form; the ideas behind them (a save-worthy summary, a service ad) stay, built in our own words and visuals. The slot was re-made as "the leaky site" (our water-bearer
metaphor). Originality is now enforced (scripts/film/sources.json).

