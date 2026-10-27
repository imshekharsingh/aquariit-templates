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

