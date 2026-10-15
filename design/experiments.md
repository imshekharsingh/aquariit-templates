# Content experiments (the advisor's lab notebook)

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

## E12 · distribution first, two weeks (owner yes, 14 Oct 2026; runs 15-28 Oct). Changed 15 Oct: posting Mon/Wed/Fri/Sun 19:30 IST; the motion freeze is lifted (design/aligned-plan.md)
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
- E8: comment-keyword CTA ("Comment SITE for the price list"): drives comments; replies by hand at first (no paid DM automation). Measure comments and profile visits.
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

