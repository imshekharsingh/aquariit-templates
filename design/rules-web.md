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
7. **Post at 13:00 IST** (one reel a day; E13, the 19:00 second slot, ended 8 Nov; owner, 8 Nov 2026: 13:00 for all three channels). Evidence (AUDIT_SIGNALS, 30 days): 13:00 median reach 2,313
   (6 reels) vs 12:00 899, 17:00 712, 23:00 103. E13 first reading (6 Nov): 19:00 reel (sticky) 1,198 at 4 h vs the 13:00 reel (keyboard)
   1,159 at 11 h, 24 h pending; followers are most online 18:30-23:30 IST (peak 21:30). Decide on 14 Nov, not before.
   7 Nov: the 12:27-13:21 posts are one slot (AUDIT_SIGNALS splits them: 12:00 median 1,221 over 9 reels, 13:00 1,172); 24 h readings on the
   first two-reel day: 13:00 keyboard 1,221, 19:00 sticky 1,430 (x1.2 from 4 h). 6 Nov: 13:00 anchor 1,172 at 13 h, 19:00 thumb 910 at 5 h.
   Followers now most online 16:30-21:30 IST (18:30 peak, 196), so 19:00 sits inside the peak.
8. **One concrete thing to copy, checked on MDN + BCD**, kept on screen 3 s+; the caption invites a save or a send.
   Evidence: save rate 2.9-4.4% on the reels that end on one copyable line (Nº 04, 08, 09, 13) vs 0.4% on squashed photos.
9. **Tech terms and years are said the way people say them** (one shared lexicon for every channel, scripts/voice/say.json): the preflight
   PRONUNCIATION line shows no "check:" words before the render; a new term goes into say.json (or the config's "say"). Evidence: 5 Nov,
   Wi-Fi was read "Wi" "Fi" on @techin20sec; Kokoro alone reads CSS-style units (px, vh, dvh) through its fallback voice.
10. **Motion that never stops and never jumps: `FLOW: continuity` 85%+, `FLOW: cuts 0` (every planned jump declared in window.TRANSITIONS),
   `FLOW: dead runs none`.** Web from 16 Nov (rule 17, owner 15 Nov: "too wiggly"): dead runs of 2 s, continuity 35%+ (scripts/showreel/flow.mjs FLOW.web). Start from scripts/explainer/newweb.mjs and the motion kit. Evidence (7 Nov, design/mandatory.md "FLOW calibration"):
   the best web reel, Nº 09 numbers (100,928 reach, 74% hold), is 95% continuous with no cut and no dead run; Nº 13 sideways (1,872) is 35% with
   4 dead runs; the first flash cut was 65% with 2 cuts, an undeclared strobe and 3 dead runs, and 94% after its flow pass.
11. **Satisfying to watch, saved to reuse (owner, 7 Nov 2026: "we haven't gone past 2k views on many of our last reels").** Pick a topic whose
   result is a pleasure to look at (motion, rhythm, polish: a stagger, a smooth number, a spring, a reveal) and OPEN on that finished result
   for ~1 s, then show the broken version and the one-line fix. Plain layout bug fixes (overflow, truncation, scroll offset, input types) are
   second choice and need a visual payoff to pass. A reel must aim for a save rate of 3%+ (end on one copyable line, caption invites a save).
   Evidence (Instagram collect, 7 Nov 2026, lifetime): the five reels past 3,000 reach are all motion or visual-polish tricks with avg watch
   9.5-14.7 s and saves 2.2-4.5% (numbers 103,105 · stagger 5,869 · overscroll 4,496 · transform 2,670 at 9.5 s · balance 1,677 at 12.6 s
   is the exception); every reel since 1 Nov is a layout fix: reach 305-2,267 (median 1,316), avg watch 5.9-11.8 s (median 8.7 s of ~20),
   saves 0.3-3.3% (median 1.3%). Hold and saves fell together, and reach followed.
12. **The dark theme `KM.theme('dark')` is the web look (E18 KEPT, 15 Nov 2026: list 2,545 (+65%) and tabs 1,860 (+20%) vs the glass median 1,546, press 1,532 (-1%); 2 of 3 above, watch 10-12 s vs 8.8). The next look test is the background alone (dark vs glass on the same topic type).** Before 15 Nov: **E18 (12-14 Nov 2026) overrode the look: the dark theme `KM.theme('dark')` with a motion-feel single fix (design/experiments.md E18); after the 3 reels the audit keeps or drops it.** Otherwise: **Style C, "Glass and light", through the kit theme; render at most 30 GitHub minutes for a 20 s reel, measured** (owner, 8 Nov 2026:
   "Let's go with C."). Every web reel starts from newweb.mjs (normal or `--details N`), whose starters call `KM.theme('glass')`
   (scripts/explainer/kitmotion.js): frosted panes at three depths over slow coloured light, a soft grade, Sora + DM Mono, crisp white type.
   Cheap glass only: no backdrop-filter, no live `filter: blur` on big layers, no full-frame mask (KM.lights paints the light in a small canvas,
   KM.cutBelow ends the world above the band); blur 3 in the config. Item 13 of the review writes the run's measured minutes (its job times).
   Evidence: the style C test (real backdrop blur) took 52 GitHub minutes for 8 s, about 130 for 20 s; a frame of the kit theme costs ~218 ms
   locally vs 393 for the first glass draft (big bloom layers) and 341 for the dark details demo; the sample showreel-style-c-details (21.2 s) rendered in 15 GitHub minutes (frames 12; run 42406421148, 8 Nov), so the target holds with room.
   Colour rotation (owner, 8 Nov 2026: "introduce more colour combinations, video to video"; 11 Nov): the type, panes and layout stay; the light
   and accents rotate through 5 palettes (KM.PALETTES: aurora, ember, lagoon, orchid, glacier). newweb.mjs picks the next after the last web reel's
   "palette" in captions.json order and writes it into the config (read reach by palette). Preflight's CONTRAST line must read 4.5:1 or more for
   captions and labels on rendered frames over the brightest light (starters, 11 Nov: aurora 4.7, ember 4.8, lagoon 4.6, orchid 5.1, glacier 4.9;
   the old dim labels read 2.9). A new palette passes CONTRAST on both starters and a phone-size palettesheet.mjs review first (citrus failed it).

13. **A details reel is calm: 3 details, one beat of ~5.5 s each (never under 4.5 s), 24-26 s in all, the voice at most 2.4 words/s overall
   (PROMOTED 18 Nov 2026, details-format: 2 WINs, 1 LOSE at 24 h and 72 h: waiting 2,144 (+47%, 4.1% saves), alive 1,536 (+5%), menus 1,216 (-17%); the format to switch to on a web ESCALATE after a run of single fixes.)
   with 0.6 s+ of breath between sentences** (owner, 8 Nov 2026: "The web reel seems to have too much in 20 s ... It feels rushed."). Each beat:
   the motion once at real speed, once in slow motion with its curve (the curve only then), a settle hold; one chip at a time (the speed chip);
   the hook ~2-2.6 s, the recap grid 3 s+ with a real hold. `newweb.mjs --details` writes it (default 3 beats of 5.5 s, sentences timed with
   voice.at, config "format": "details"); preflight's PACE line fails a beat under 4.5 s, over 2.5 words/s, a breath under 0.6 s or a recap
   under 3 s. Why: the slow-mo format needs time per motion; the first cut (showreel-30-alive, 4 details in 20 s: beats of ~2.6-3.2 s,
   2.15 words/s with no breaths) gave no single motion time to land. Reworked the same morning: beats 5.9 s, 1.58 words/s, breaths 0.71 s+.
14. **The motion leads the eye to what is being said (owner, 11 Nov 2026: "have the animation flow across the frame with the right position, so
   the eye can follow it easily and understand what is being said").** One focus at a time: the thing the voice names is the thing that moves,
   lights up or comes closer at that moment (within ~0.2 s of the word), and nothing else competes with it. Each new element enters from where
   the eye already is (or along the path from the last focus) and the camera glides toward it, so the eye travels one clear path through the
   frame: hook at the top → the broken thing → the code line → the fixed thing, never jumping back and forth across the frame. The subtitle sits
   next to the focus it describes. Check in the stills review: at every beat, write where the eye is and why (one line each); a beat where the
   focus is not what the voice says, or the eye has to jump more than half the frame with no motion leading it, fails.
15. **The fix is dynamic: the broken thing visibly misbehaves in motion, and the fixed thing visibly behaves, both obvious at a glance
   (PROMOTED 18 Nov 2026, dynamic-fix: 2 WINs, 0 LOSEs: list 2,609 at 72 h (+70%), tabs 2,085 (+36%).)
   (owner, 12 Nov 2026: "people engage with fixes that are more dynamic when they show up; number wiggle is the right example").** Topic test
   before building: mute the reel and watch 1 s of "before" and 1 s of "after" at phone size; if a stranger cannot tell which is broken, swap the
   topic. Evidence (Instagram collect, 11 Nov): dynamic before/after topics: numbers wiggle 104,925 reach, stagger 6,053, overscroll 4,645,
   flash 3,808, transform stutter 2,685; subtle or invisible ones: INP 272, squash 320, smooth 429, springs 440, hover 509. Today's press reel
   (a 4% dip, 12 Nov) failed this test and was rebuilt; owner: "it doesn't engage me".
   **Before/after must show visible motion: wiggle and shift (owner, 15 Nov 2026: "clearer wiggle and shift in animation has clearly helped our reels
   grow better").** When BEFORE and AFTER sit side by side, the broken pane jolts on every failure (the real shift shown as a fall from where it was,
   a spring past it, a short shake, a trail, a ghost outline of the old place, a warm red flash) and the fixed pane stays rock-steady with a calm
   lock cue (guides, a check chip "0 PX SHIFT"); BEFORE warm coral, AFTER fresh green / teal, never two matching cards. Exaggerate the motion,
   never the fact. From 16 Nov the jolt is ONE clean move with no shake or tilt (rule 17: "too wiggly"), and the panes carry the reel's colour world
   with the coral / teal as washes and signals on it. Output QA SPLIT fails a reel whose BEFORE pane moves under 1.8x its AFTER pane (fontswap first cut 1.31x, rebuild 1.9x+).
16. **Use the whole frame; the subject of the fix is the biggest thing on screen (owner, 14 Nov 2026: "it seems we are squeezing most of it
   in one place of the screen"; "web reels' main elements colouring can be made a bit more vibrant").** The frame is filled top to bottom inside
   the safe zone (KM.ZONES, CSS px of 540x960): the top zone (125-290) holds the hook, then the counters, the code or the slow-motion panel; the
   subtitle band sits under it (292-388), next to the focus; the hero (392-780) is the thing being fixed at about twice the old size (a tab bar
   430 px wide with 31 px labels and a 12 px glowing line, not a 2 px line in a 60 px bar) with its supporting list below it, down to the foot
   of the safe zone. Card edges are locked to the zones (KM.worldY) so a camera push never opens a gap. A before/after is two full-width
   cards, one over the other, filling the hero. The key UI (active tab, line, avatars, thumbnails, accents) carries the jewel tones and the
   accent at full strength, never as a large saturated fill (Output QA COLOUR, VIBRANCY). Output QA SPREAD fails a web reel whose lower third of
   the safe zone is over 10% empty on average. Evidence (stills at 270x480 every 0.5 s): showreel-35-list 34% empty, showreel-36-tabs first cut
   18% (a 414 px card in the top 60%, the bottom empty but for the subtitles), its whole-frame rebuild 0%.

17. **Calm motion, a colour world per reel (owner, 15 Nov 2026: the Mon / Tue web reels "are too wiggly and main frame where we see the changes seem
   to show similar colour grading so doesn't look different from other videos").** Only the broken element moves: one clean eased move per change
   (KM.ease.back at about 1.1, 0.4-0.6 s, a trail, the warm flash, the ghost of the old place), never a shake, tilt or multi-bounce spring, with a held
   beat after it to read it; each move lands on the words that name it (rule 14); AFTER is solid (only the thing that changes on purpose, a word or a
   message). Everything else holds still: KM.rig({ drift: 0 }), at most one slow push for "Look closer" and back, KM.lights(t, c, true), no bobbing
   panes, no wobbling touch ring, no kicking hook word. The demo pane and the background light take the reel's own colour world (KM.theme('dark', world),
   KM.WORLDS; next: node scripts/explainer/palette.mjs --world); BEFORE keeps its warm signals (cross chip, flash, ghost) and AFTER its cool lock (--ok, from rule 18 the same blue as the accent, not green;
   check chip, guides), on top of the world. The type, layout and brand frame stay. Output QA CALM fails a frame that changes over 3.5% in 0.2 s at the
   median (or 5% on average) outside the subtitle band; HUE fails a demo main hue within 40 deg of any of the last 3 web reels (scripts/qa/demo-hues.json:
   add the new reel's hue, measured with node scripts/qa/frames.mjs + python3 scripts/qa/look.py, in the push that makes it). FLOW for web follows
   (rule 10): dead runs 2 s, continuity 35%+. Evidence (the scenes' own frames at 135x240, 10 fps, 15 Nov): CALM median / mean: the wiggly cuts form 7.0 /
   8.3%, follow 5.1 / 7.3%, fontswap 4.9 / 7.1%; calmer tabs 1.9 / 3.4%, list 2.9 / 4.5%; the calm rebuilds form 1.2 / 3.7%, follow 0.4 / 3.2%, with SPLIT
   still 2.25x and 2.27x. HUE: fontswap 225, tabs 235, list 235, old form and follow 225; rebuilds saffron 25, berry 325.

**ESCALATE 8 Nov** (median reach 1,247 over the last 7 vs target 2,000; watch 8.5 s; saves 1.3%; ALARM two days running): answered by a format
change, the slow-mo "details" compilation (showreel-30-alive, 8 Nov 13:00, experiment details-format; rule 11). Read at 24 h (9 Nov) vs the median;
if it wins, the next web reels stay in the format; if it loses, the 10 Nov reel tries a different topic type (a phone trick people use as users).

**ESCALATE 9 Nov** (median reach 1,458 over the last 7 vs target 2,000; watch 9 s; saves 1.7%; ALARM again, but up from 1,247): the format answer
is already running and is not changed mid-test (one change at a time): the details format, try 1 (showreel-30-alive, 1,333 at 6 h vs the web 6 h
median of 1,288: on par, 24 h verdict at the ~10:53 IST collect), try 2 today (showreel-31-menus), try 3 tomorrow (showreel-32-waiting). The window is
lifting on its own (flash 3,630 and longname 2,354, both "fast start", a satisfying polish fix and a layout fix with a visual payoff, rule 11).
If try 1 reads LOSE at 24 h, the Wed 11 reel is the different topic type named on 8 Nov (a phone trick people use as users), not a fourth details reel.

**ESCALATE 11 Nov** (median reach 1,468 over the last 7 vs 2,000; watch 8.8 s; saves 1.7%; ALARM two days running): the details format reads 1 WIN
(alive 1,486 vs 1,331), 1 LOSE (menus 1,180), try 3 pending (waiting 1,360 at 6 h), and every details reel stops at x1.1 of its 6 h reach, while the
single narrated fixes with a visual payoff kept climbing (flash 1,967 → 3,696, x1.9; longname 1,388 → 2,273, x1.6). Answer: a format change back to
ONE narrated fix whose result is a satisfying motion (rule 11), in style C with element sound: showreel-33-carousel (a photo row that snaps;
experiment web-single-satisfying). The planned Wed 11 topic (scrollbar-gutter) was swapped: phones draw overlay scrollbars, so the layout jump is a
desktop bug and fails rule 1. The details format is decided by try 3's 24 h verdict (2 WINs → rule, 2 LOSEs → What didn't).

**ESCALATE 12 Nov** (median reach 1,548 over the last 7 vs 2,000; watch 8.8 s; saves 2%; ALARM two days running, though up from 1,470): answered by
E18 try 1 (showreel-34-press: the dark theme + a motion-feel single fix, a Pay button that presses), a change of look AND topic type, not a
tweak. The RULE lines flag rules 1-6, 8 and 9 ("passed by 4 of 4, yet ALARM"): they are hygiene every reel already passes, not the lever; the
lever under test is the format and look (E18, read 14-15 Nov). They stay until a reel that breaks one does better.
**PROMOTED 12 Nov: the details format is a kept format** (2 WINs of 3 at 24 h: alive 1,486 vs median 1,331, +12%; waiting 1,695 vs 1,331,
+27%, saves 4% vs 1.7%, 98 saves + shares, the best save rate on the channel; menus LOSE 1,180, -11%). Rule 13 is its gate. After E18 (Sun 15),
the web reels alternate it with the winning single-fix look, so each format is read against the other on the same weeks.


**ESCALATE 13 Nov** (median reach 1,552 over the last 7 vs 2,000; watch 8.8 s; saves 2.1%; ALARM two days running, flat since 12 Nov): answered by
E23 try 1 (showreel-35-list: the broken and fixed lists deleting the same row side by side, in sync, a change of how the fix is shown, not a
tweak) on E18 try 2 (dark). Carousel read LOSE at 24 h (814 vs 1,486, -45%, the snap fix a stranger cannot see on mute: rule 15's reason).
PROMOTE details-format (2 WINs, 1 LOSE) was written on 12 Nov (above); nothing new to add.

**ESCALATE 14 Nov** (median reach 1,557 over the last 7 vs 2,000; watch 10 s; saves 2.1%; ALARM two days running, flat): the change is already in
flight and winning early, so it continues rather than being swapped for a tweak: E23 try 1 (showreel-35-list, broken and fixed lists in sync)
reached 2,273 at ~10 h, the best web reel of the last 7 (7 h: 1,818 vs the 6 h median 1,288, "fast start"), 17 saves and 5.3 shares per 1,000.
Today: E23 try 2 on E18 try 3, showreel-36-tabs (a tab underline that blinks vs one that slides, BEFORE over AFTER, tapped in sync). PROMOTE
details-format printed again (2 WINs, 1 LOSE): it is rule 13 since 12 Nov. RULE lines 2, 3, 4, 6, 8, 9 "question it" again: still hygiene
(every reel passes them); the lever under test is how the fix is shown (E23).


**ESCALATE 15 Nov** (median reach 1,562 over the last 7 vs 2,000; watch 10 s; saves 2%; ALARM two days running): the window's floor is the old
carousel (840) and menus (1,236); the in-sync before/after (E23) is the best run of the week (list 2,545, tabs 1,860 at ~24 h), so it continues on a
new topic type (a page-load annoyance, not a tap: the font swap, showreel-37-fontswap) with the caption change E20 (a one-word question and a comment
ask) as the day's one experiment. E18 read today: KEPT (rule 12). PROMOTE details-format printed again: rule 13 since 12 Nov.

**ESCALATE 20 Nov** (median reach 1,673 over the last 7 vs 2,000, up from 1,552; watch 9.9 s; saves 1.6%; hold 48%; ALARM, ESCALATE two days running): the formats were changed on 18 Nov (details, 24 h +8%: 1,582 vs 1,461) and 19 Nov (swipe compare, 7 h: 309, slow start, read at 24 h), so today changes the TOPIC TYPE inside the winning in-sync before/after (rule 15, 2 WINs): an animation that ends wrong, not another layout / tap / load / colour bug (Nº 42, showreel-42-snapback, `animation-fill-mode: forwards`), told as one bug story (design/improvements.md web item 7). PROMOTE details-format and dynamic-fix: rules 13 and 15 since 18 Nov. DROP web-comment-ask (1 WIN, 2 LOSEs): in playbook "What didn't" since 18 Nov. RULE lines 2, 3, 4, 6, 8, 9, 11, 12 "question it" again: still hygiene (7 of 7 pass).

18. **Demo colours are chosen, not scattered (owner, 20 Nov 2026: "the colour combination doesn't give a feeling that any thought was put into it; it matters a lot and many reels are designed like this").**
    (a) Demo content (tiles, cards, dots, rows) is ONE base hue in 3 tonal steps (same hue, lighter / darker, low saturation) plus ONE accent, from the
    palette; never rainbow tiles or per-item hues. (b) The subject (what the reel is about: the menu, the toggle, the card) carries the accent and the
    highest contrast and saturation in the demo; everything else is muted tonal steps, so the eye lands on the subject and the filler never outshines it.
    (c) Fixed meaning across the whole reel: one warm hue = broken / before, one cool hue = fixed / after; headline words, counters, tags, border and
    glow states all use the same two. (d) At most 3 hues in the demo area (base + warm + cool, the cool may be the base's own accent).
    How: no hex colours in demo content. The kit sets --d1 / --d2 / --d3 (the 3 tonal steps of the palette's surface hue), --dacc (the subject's accent),
    --dwarm / --dcool (the fixed pair) in every KM.theme() call; KM.demo() reads them in JS, KM.demoFill(i) is the i-th step. A palette or world lists
    d: { warm, cool } in KM.PALETTES / KM.WORLDS (else warm = c.red, cool = c.acc); the web starters use the tokens.
    Check: the stills sheet read with "could I name the palette in one line?"; Output QA FOCUS (scripts/qa/output-qa.py, 20 Nov 2026): at most 3 hues in the
    demo area and the subject more colourful (mean chroma) than the rest of the demo, over a window the config declares: "qa": {"focus": {"demo": [l, t, r, b],
    "subject": [l, t, r, b], "from": t0, "to": t1}} in CSS px (a reel without it gets a WARN). Run it before the render with scripts/qa/frames.mjs + look.py.
    Calibration (snapback frames, 12.3-14.8 s): the old rainbow scene subject 101 vs rest 124 = FAIL, the re-tinted one 123 vs 75 = PASS.

## Channel brief (moved from CLAUDE.md, 14 Nov 2026)
- How a web reel is made: design/runbook-reels.md ("Making a web reel"); plan, series and craft bar: design/webin20sec.md. Benchmark is
  @techin20sec; the daily audit compares both (design/experiments.md, "Results log").
- Look: the dark theme from 15 Nov 2026 (E18 kept, rule 12); style C, "Glass and light" ran 8-11 Nov 2026 (owner: "Let's go with C."), through the kit theme (`KM.theme('glass')`, the default of both newweb.mjs modes: frosted
  panes at three depths over drifting coloured light, a soft grade, Sora + DM Mono).
- Cheap glass only (no backdrop-filter, no live blur on big layers, no full-frame mask); render at most 30 GitHub minutes for 20 s (rule 12).
- One reel EVERY day at 13:00 IST, built that morning by the daily run.
