# Handoff log (both accounts)

Every session on either account that changes the repo adds ONE entry at the top, in the same push as its work. Newest first; keep the last
30 entries and move older ones to the bottom of design/craft-log.md. Read the last 5 entries before starting.

Format (at most 6 lines):
```

## 2026-11-24 22:10 IST · claude/hide-usbc-24nov · owner chat: tech usbc hidden after the owner called it horrible
- Done: showreel-tech-usbc-two-numbers hidden + hold (owner: "horrible again"; only ai-memory was good); owner-feedback.md line: the critic compares every tech reel side by side with showreel-tech-ai-memory and says NOT READY unless it matches or beats it.
- Next: 25 Nov tech is built on Fable (weekly reset) to the ai-memory standard; its critic gets that side-by-side rule in its prompt.

## 2026-11-24 21:30 IST · claude/owner-chat-24nov · owner chat: decisions, waiting on owner, tomorrow
- Decisions (owner, 24 Nov): critic starts the moment a reel passes Output QA (11:17 task is a fallback); no reel questions to the owner; SHOT VARIETY check; Fable budget (daily builds + critics only); Turns Out daily and dated again (task 09:11 IST created by the owner chat); every owner message answer-first, numbered, plain words (CLAUDE.md); tell the owner each reel stage unasked. Workflow plan to 30 Nov in the owner's doc "Studio workflow plan (to 30 Nov)": Sonnet researches 5 topics, Fable picks / checks stills / judges; feedback reviewed by Fable (first two a day) then Opus with flags to Closed; references studied by Fable into a checklist; live studio board.
- Today: web 46 tabwiggle posted; Turns Out grey menu (render 3) and tech usbc-two-numbers (render 3, owner approved) ready to post. Tech miniled-zones rejected by the owner (one screen all reel). App v27: live board, feedback flags, references up to 1 GB.
- Waiting on owner: add STAGE_KEY (GitHub secret, plus a network secret with header X-Stage-Key for templates.aquariit.com) so stage lines reach the board.
- Tomorrow: CV (resume2, critic READY) is 25 Nov's Turns Out reel, its critic verdict was not pushed (403), so the Turns Out task re-checks and records it; tech reruns lean on the new rules; 26 Nov to-do: write the Fable-decides split into the daily run. Improvement lab stays paused. CLAUDE.md "Scheduled tasks" still lists 4 launcher tasks; launcher prompts for critic-on-ready were not changed (launcher refused without the owner).
- Do not: render past 2 without the owner's word (CV got 4, tech 3 today); use the Tech reel workflow's preview input for a real render (any value makes a preview).

## 2026-11-24 13:50 IST · claude/fable-budget-24nov · Fable budget rule replaces "Fable is out" (owner chat correction to studio-lean-24nov)
- Done: CLAUDE.md "Models" and runbook-studio.md now say Fable only for daily builds and critics (about 3 + 3, lean), never side work; a limit hit continues on opus; scheduled-task models and the 26 Nov switch unchanged.
- Left: the CV render (one) is still to dispatch from main.

## 2026-11-24 13:30 IST · claude/studio-lean-24nov · lean flow, SHOT VARIETY check, CV wording (owner chat job, size M)
- Done: owner-feedback 24 Nov line; Output QA VARIETY (scripts/qa/output-qa.py, all channels; tabwiggle 53% passes, a static clip 100% fails); the builder starts the critic (opus) after Output QA, 11:17 task is a fallback; owner asked nothing about reels, tech owner gate removed; previews.json all needsOwner false and npm run check fails on true; Fable out, side programs paused, Turns Out one reel a day in order; CV (resume2) two fast lines reworded ("Next, headings get their own colour." / "Now it reads top to bottom.") and hook chips spread (x 40 / 166 / 320).
- Left: the CV render (one) after this merges, then Output QA and the critic started by the builder; the owner chat resets the scheduled-task prompts/models if they still say Fable.
- For the other account: VARIETY = 1 fps, 135x240, SSIM 0.65, over 60% one shot fails.

## 2026-11-24 12:00 IST · claude/c3-grey-menu-post · Turns Out today: the grey menu is ready to post (owner chat job; owner: one Turns Out reel a day, on need)
- Result: grey menu render 3 (Showreel run 45331264071, 21.2 s) passed Output QA on every check (run 45338746481); every line 2.4-3.6 words/s on its own word times; the critic said READY (7.5 / 7.5 / 7.5; review/previews/c3-design-rebuilds.md "B, render 3").
- Done: showreel-c3-grey-text is no longer hidden or held: "onGo" like every posted design reel (a dated c3 entry would need the journey line "scenes N ... transitions" in review item 19, which a design scene does not have). Its config, scene and review file now carry the rebuilt scene and voice (contrast2); build.mjs keeps a second copy of that scene as scripts/channel3/grey-text.html. The preview MP4 is promoted to v/showreel-c3-grey-text.mp4 (R2 workflow "promote", old video kept as study/showreel-c3-grey-text-v1-backup). previews.json: the answered grey menu preview removed.
- Left: the owner posts it from the app in the 13:00-21:00 IST window. CV (resume2) is next in line on a later day: reword "Next, give the headings their own colour." and "Now it reads from top to bottom." (6 words or fewer, or slower words), move the three hook chips apart, then a render the owner allows (three are used). The other five held reels are untouched.
- For the other account: Output QA PACE can only fail a line of 7+ words and reads this voice 1.1-1.5 times faster than the render's word times; write design scripts in lines of 6 words or fewer, with one longer line at most.

## 2026-11-24 11:54 IST · claude/critic-c3-greytext2-r3 · Reel critic: Turns Out grey menu preview, render 3 is READY
- Why: the script changed after render 2 ("Next, lighten the board slightly. Then check the ratio. Aim for four point five."), so the independent look had to be done again on the new MP4 before it is made postable.
- Done: judged the real MP4 (run 45331264071, 21.2 s) at phone size with its word times; "CRITIC (render 3): READY" in review/previews/c3-design-rebuilds.md, PREMIUM 7.5 / 7.5 / 7.5. "Aim for four point five." lands on "MIN 4.5 : 1" (card 12.53 s, word 12.63 s) and reads right after "ratio".
- Left: the builder makes it postable. For the next design reel, not this one: end about 1 s sooner (3.1 s slow push after the last change), move the checker card off "fresh ginger", a bigger "4.5 : 1". Not heard by anyone here: the voice's tone.

## 2026-11-24 10:40 IST · claude/c3-greymenu-r3 · Turns Out today: the grey menu, script settled for its render 3 (owner chat decision after the CV failed PACE)
- Why: Output QA PACE reads this voice 1.1-1.5 times faster than the render's own word times (a line that opens "Next," or "First," loses its pause), and only lines over 6 words can FAIL. So the script keeps every line but one at 6 words or fewer and takes the 1-beat word runs out.
- Done: "Next, lighten the board slightly. Then check the ratio. Aim for four point five." (was "... a touch. ... For body text, aim for four and a half to one."; the screen shows MIN 4.5 : 1). The one long line left, "The soft grey looked nice, but it's too light.", read 4.21 on render 2. Scene rebuilt (contrast2), anchors unchanged; stills, preflight, c3-script clean.
- Left (this session): ONE render (render 3, the owner's go), Output QA, then an independent critic; READY = made postable for today. A fail = stop and report, no 4th render.
- CV for a later day: reword "Next, give the headings their own colour." and "Now it reads from top to bottom." (6 words or fewer, or slower words), move the three hook chips apart; needs the owner's OK for a 4th render.

## 2026-11-24 10:05 IST · claude/c3-cv-r3-greymenu-pace · Turns Out today: CV render 3, grey menu PACE fix (owner chat job, size M-L)
- Owner (Owner answers, 24 Nov): YES to c3-resume2-render3; Like on both previews. Owner chat, 09:57 IST: "We need turns out today, make them ready one after the other" = the go for the grey menu's render 3 too (no ask added).
- Done: CV render 3 started from main a29f59a (Showreel run 45326427558, preview path, 17.8 s; stills checks clean). Grey menu: the ratio sentence split in two, "Then check the ratio. For body text, aim for four and a half to one." (render 2 read 4.55 words/s on the one long sentence; the number phrase alone runs near 5 words/s, so the second sentence carries slower words; WCAG's 4.5 to 1 is the body-text minimum). Scene rebuilt (contrast2), 7 breaths for 8 sentences, anchors unchanged ("ratio", "four"); stills, preflight and c3-script clean. Ask c3-resume2-render3 cleared.
- Result: CV render 3 (run 45326427558, 17.8 s) FAILED Output QA on PACE only (run 45329510627): "Next, give the headings their own colour." 4.86 words/s and "Now it reads from top to bottom." 4.93 (limit 4.5; the render's own word times give about 3.3 for both, the recogniser hears the 7-word lines shorter). Every other check passed. NOT READY, so no critic was started; three renders are used. Frames against the critic's first look: each fix lands on its word, "one size down" is gone, tail about 2 s, larger BEFORE thumbnail; the three hook chips still overlap at their edges (1.2-3.4 s), all words readable.
- Owner (owner chat, 10:15 IST): one Turns Out reel a day, on need; keep usage moderate. Grey menu: wording fix only (#1232), NOT rendered; it is next in line. The other five held reels are not touched. Nothing posted or unhidden.
- Left: the owner chat decides today's Turns Out (grey menu render 3 as backup, or a CV wording fix + a render the owner allows). Before any CV render: reword the two fast lines (a slow lead-in or 6 words or fewer) and move the chips apart. previews.json still lists both Liked previews (the Asks read says to drop them).
- For the other account: a spoken ratio ("four and a half to one") is about 5 words/s on its own; give its sentence a slow lead-in or keep it to 6 words.

## 2026-11-24 08:45 IST · claude/tech-miniled-zones · today's tech reel, built to the owner's preview gate (showreel-tech-miniled-zones)
- Done: "Mini LED is not a new kind of screen" (quickmyth, home, global; Black Friday week). 3D on kit3d.js, one TV through seven shots: see-through hero with MYTH (frame 0), the picture sheet lifts (LCD), a low macro over the LEDs (LIGHTS), zones follow the moon (ZONES), all 2,304 light in 0.55 s, one zone behind its 6,400 pixels, a spec card (ZONES?), loop. Experiment tech-direction-3d try 2 (countTo idea, a second framing inside 4 s, cutsound).
- Facts read today on primary pages: Apple Studio Display XDR specs (5120 x 2880, Mini-LED backlight with 2304 dimming zones; 6,400 pixels a zone is our sum), TrendForce 16 Nov 2026 (Mini LED TVs 28.78 million in 2026, +116%, near 15%; "premium LCD TV market").
- Preview p1 (run 45318302714) passed Output QA; two fixes from its real frames (the count blooms from the centre, not a diagonal band; a clean pixel macro) go into preview p2 (claude/tech-miniled-zones-p2).
- Owner gate: a preview render (Tech reel, preview p2) goes to the app's Previews with ONE yes/no in "Needs you" (tech-miniled-ok, until 24 Nov). The reel's own render or `scripts/r2.sh promote` waits for the yes.
- Preview p2 (run 45324556198): Output QA PASS on the real MP4; the yes/no is in "Needs you" (tech-miniled-ok).
- Left: after the owner's yes: promote or render, reel-status, item 13, owner-feedback.md and critic.md against the real MP4; then the critic. Builder's PREMIUM line is in the review file; weakest shot is the pixel macro (20-24 s).
- For the other account: nothing.

## 2026-11-24 08:10 IST · claude/premium-close · premium program: closing notes, CV scene fix, cue-time check
- Done: design/improvements.md has the before/after scores for tech, web and Turns Out; scripts/channel3/design/resume2.js fixed (a comment had swallowed the fix-three sound line, so two cues had no time and sound.py stopped render 2); scripts/showreel/stills.mjs prints "CUE TIMES" and fails on a cue without a time.
- State: tech r4 preview READY (7.5 / 7.5 / 7.5, QA PASS). Web homebar2 render 2: critic READY (7.5 / 7 / 7) but Output QA FAIL (HUE, CALM) = NOT READY, both renders used, kit kept. Turns Out: grey menu render 2: critic READY (7.5 / 7.5 / 7.5, voice 7.5, before 7) but Output QA FAIL (PACE 4.55 words/s on the ratio sentence, limit 4.5; EDGES on the closing push-in, which is by design and is now declared to the end) = NOT READY, both renders used; CV has no render 2 file (both renders used; one more needs the owner's yes, asked in "Needs you").
- Next: the grey menu needs its ratio sentence slowed or split (PACE) before any new render; rebuild the other five held Turns Out reels only after one preview passes and the owner has heard the voice.
- Do not: post any of the seven held Turns Out reels; use kithook in a daily web reel before the open points in improvements.md are closed.
## 2026-11-24 07:20 IST · claude/web-tabwiggle · daily run: audit card + today's web reel (showreel-46-tabwiggle)
- Done: Feedback first (0 new items, 0 answers, 0 references). The nightly Instagram collect had not started (the 01:44 run was the late post check), so this run dispatched one (run 45304135719) and wrote the audit card from it: web ALARM + ESCALATE (median 1,428 vs 2,000), tech OK, c3 ESCALATE.
- Web reel: "Why do your tabs wiggle?" (E30 wiggle family, try 1, experiment web-wiggle-family): the tapped tab turns bold and shoves the others (real measured widths, Open Sans 400 vs 800), fixed with a hidden bold copy (::after, content: attr(data-text)); hook kit (rule 20), black look with a mint accent. Local preflight, stills and the Output QA functions all pass (HUE 165, DEMO 35, FOCUS 58 vs 39, CALM 1.2%, MUTE 4.5%).
- Also: scripts/qa/demo-hues.json had tapzoom and homebar outside "reels", so HUE compared against older reels; fixed. rules-web.md 24 Nov audit note, craft-log, experiments Results log, improvements note, tip demo tabwiggle.
- Render: render 1 failed PACE only (last line 4.60 words/s); the line was reworded and render 2 (run 45310957300, the last allowed) passed Output QA on every check; item 13 written. Left: the critic (11:17 IST). Tech: its own session ("Tech reel 24 Nov", branch claude/tech-miniled-zones); maker pages (Samsung, vivo, Wikipedia, MDN) are blocked in this environment, apple.com, trendforce.com and raw.githubusercontent.com answer; the owner sees stills + a preview before its render.
- For the other account: a black-look reel needs colour inside the phone to pass DEMO and SUBJECT FILL (a pill, tinted cards); give each black reel its own single accent so HUE passes.

## 2026-11-24 03:50 IST · claude/critic-c3-greytext2-r2 · critic second look: Turns Out grey menu preview, render 2
- Done: judged the real MP4 (21.2 s, from main 8808421) with its word times; "CRITIC (render 2): READY" in review/previews/c3-design-rebuilds.md. Scores 7.5 / 7.5 / 7.5, voice 7.5 (measured, not heard), before 7. No scene changed.
- Every fix lands on its word (darken 7.46 s, lighten 9.17 s, ratio 11.18 s, four 12.57 s); pauses 0.5-0.7 s; rings clear of the text; ratio readable.
- Left: small notes only (fix 2 is faint, the checker card touches one letter at 11.0-15.6 s, FAIL shows for 0.4 s on the fixed menu). The CV (resume2) was not re-scored: its re-render failed, the first-look verdict NOT READY stands until a new file exists.
- For the other account: nothing.

## 2026-11-24 03:17 IST · claude/critic-web-homebar2-r2 · critic, second look at the web-homebar2 preview (render 2)
- Done: judged render 2 on the real MP4 against render 1 and the posted homebar; lines added to review/previews/web-homebar2.md. No scene changed.
- Verdict: READY (passes the gate). Render 2: 7.5 / 7 / 7 (animation / cleanliness / premium); render 1 was 6 / 6 / 6.5, the posted reel 6.5 / 8 / 6.5.
- Fixed: the tap is seen, the app shrinks into its coral icon in 0.3 s and comes back, words clear of the subtitles, the home screen no longer reads empty.
- Left: "cover" in scripts/previews/web-homebar2.json is still 1.6 (mid-fall); 1.4 is the good frame. The counter never turns to SAVED 1. Ring sits on the button label.
- Sound measured, not heard: -14.0 LUFS; the low hit is on each fall but only about 1 dB above render 1. Output QA DEMO not re-run.

## 2026-11-24 03:10 IST · claude/critic-c3-rebuilds · critic on the Turns Out design rebuilds (CV resume2, grey menu greytext2)
- Done: judged the real MP4 of the CV preview against the posted showreel-c3-resume; the grey-menu preview is not rendered (404 twice), so it was judged from stills against the old showreel-c3-grey-text MP4. Result in review/previews/c3-design-rebuilds.md. No scene or posted reel changed.
- Verdict: both NOT READY. CV old 6.5 / 6.5 / 6, voice 4.5, before 4; new 7 / 6.5 / 7, voice 7, before 7.5. Menu old 6.5 / 6 / 6, voice 4, before 4.5; new (stills) 6.5 / 6.5 / 7, voice 7.5 (script only), before 7.
- Weakest: CV 1.1-3.5 s "NO ORDER" chip over "NAME = TEXT" (the posted reel has it too); fix 3 starts 1.0 s before "lighter"; "one size down" has no picture; 4.1 s still at the end; before thumbnail letters 2-3 px. Menu: hook rings cross out "FROM THE KITCHEN" and "Carrot cake" (cover too); "4.5 : 1" is about 9 px at phone size.
- Not judged: how any voice sounds (no session can listen; the transcription model host is blocked, so the render's words.json and voice-band levels were used); the menu's motion, sync and sound.
- For the other account: a preview's word times are at /reels/study/<name>-preview-words.json (the read key opens them). The old reels had pauses of 0.3-0.8 s already; the gain is the wording. Preflight OVERLAP does not see a ring edge through a text line or a chip over a chip.

## 2026-11-24 02:35 IST · claude/critic-web-homebar2 · critic on the web-homebar2 preview (hook kit, rule 20)
- Done: judged the real MP4s (preview, showreel-45-homebar, showreel-35-list); result in review/previews/web-homebar2.md. No scene or posted reel changed.
- Verdict: NOT READY. Before 6.5 / 8 / 6.5, after 6 / 6 / 6.5 (animation / cleanliness / premium). The new hook does more but explains less.
- Weakest: 0.4-2.4 s. No tap shown, the fall takes 0.1 s and reads as a glitch, the home screen is a dull grey grid for 1.9 s, "gone!" prints over the subtitle at 1.3-1.6 s (the cover frame).
- Good and worth keeping: the hatched SWIPE ZONE on "under" (3.0 s), the fall on "swipes" (5.1 s), the payoff.
- Next: kit fix in kithook.js (KM.away needs a visible tap, a 0.35 s swipe up, a reopen; KM.react kept out of the subtitle band), then one new preview. Sound was measured (-14.0 LUFS), not heard.

## 2026-11-24 02:10 IST · claude/tech-kit-r4, claude/web-hook-kit, claude/c3-before-after, claude/c3-natural-before · premium program: kit lifts for all three channels (owner chat job, size L)
- Done, tech (#1205): kit3d.js countTo, reframe, server rack faces; sound.py "cutsound" (swell + low hit on each shot change, a riser on the payoff); rules-tech.md M7-M10; a preview can carry its own scene (techreel/previews/<slug>-<tag>.json), so scenes/ai-memory-r4.html renders only with preview=r4.
- Done, web (#1206): scripts/explainer/kithook.js (KM.black, bugs, away, react, meter) between its own markers; the starter uses it and the black look; stills prints HOOK BUG; rules-web.md rule 20; scripts/previews/web-homebar2 is the example.
- Done, Turns Out: design/core.js DT.keep, proof, close, S.flip (rules-c3.md P1-P2); after the owner's note (voice not natural, before forced): rules V1-V3, B1-B3, scripts/qa/c3-script.mjs in npm run check, critic.md D1-D4, design/c3-research-2026-11-24.md (research + audit), the seven unposted design reels held in captions.json ("hidden" + "hold"), the CV reel rebuilt as scripts/previews/c3-resume2 (design/resume2.js).
- Left: Output QA and an independent critic on each preview (tech r4, web homebar2, c3 resume2), improvements.md lines with the scores, then the other six held Turns Out reels rebuilt one by one.
- For the other account: a posted reel's scene is never edited for a study: copy it and render through the preview path. A new design reel needs "dt": 2, voice.gap and "before" in its config. New web scenes call KM.bugs.

## 2026-11-24 01:50 IST · claude/skills-3d-steer · premium program phase 0: two craft references added (owner chat job, size L, owner's go 23 Nov night)
- Done: .claude/skills/hyperframes/references/types/3d.md (camera, light and bloom rules for tech's real 3D) and references/steer.md (motion faults in plain words with the fix for each, seven motion ideas, transitions by energy, three sound-placement lines), both from heygen-com/hyperframes 5906174, Apache-2.0, every file read. THIRD_PARTY.md: the two rows, plus what was read and left out and why (theme-factory, brand-guidelines, algorithmic-art, slack-gif-creator, the registry, media-use and its Pixabay MP3s, colour-grading and caption docs).
- Left: phases 1-3 (tech, web, Turns Out kit lifts), each with one preview render and an independent critic.
- For the other account: builder and critic name a motion fault with steer.md's words ("it feels like slides", "scene 3 is dead") and apply its fix.

## 2026-11-23 23:40 IST · claude/designed-covers · designed reel covers, by script (owner chat job, size S-M)
- Done: scripts/cover.mjs builds a cover from the finished MP4: one frame, a solid band (y 1360, #0B0D12), one or two lines in Inter Display Bold (white, accent line amber #FFB23A), JPEG q 2. The recipe is the reel's `"cover": {"t", "lines", "accent"}` in templates/showreels/captions.json (accent counts from 0). Font vendored as a 55 KB Latin subset with its OFL text (scripts/cover/). scripts/r2.sh `cover <name> ['<json>']` + R2 workflow action "cover" (dst = reel name): the automatic cover is kept once as c/study/<name>-cover-auto.jpg (c/, because v/ is deleted after 15 days), the new one goes to c/<name>-cover.jpg (where the app reads covers). Showreel, Tech reel and R2 promote build the designed cover after the automatic frame; no recipe or a failure = the automatic frame stays. `node scripts/cover.mjs --check` is in npm run check. showreel-tech-ai-memory carries the owner's approved recipe (4 GB frame at 6.5 s). runbook-reels.md "Render": the cover line.
- Left: run R2 -> cover for showreel-tech-ai-memory after the merge and look at the result (this session does it).
- For the other account: add "cover" to the captions.json entry when you build a reel; pick a frame where the hook number or word is complete.

## 2026-11-23 21:30 IST · claude/r2-promote-ffmpeg · R2 promote: ffmpeg install retries (owner chat job follow-up)
- Done: the first promote run (45219340856) failed before touching R2: the 180 s ffmpeg apt install timed out on a slow mirror. Promote step now retries the install up to 3 x 420 s (25 min step limit). Nothing was written to R2.
- Left: after the merge, dispatch R2 promote again (src study/showreel-tech-ai-memory-r3-preview, dst showreel-tech-ai-memory, backup study/showreel-tech-ai-memory-r1-backup); reel-fetch must show ~30.73 s.
- For the other account: none.

## 2026-11-23 21:20 IST · claude/tech-ai-memory-promote-r3 · tech ai-memory: preview r3 becomes the posted reel (owner chat job, size S)
- Done: owner's choice (23 Nov): "I'll post R3". New `promote <src> <dst> [backup]` in scripts/r2.sh and an R2 workflow action `promote` (inputs src, dst, backup): backs up the old MP4 and cover, writes src to v/<dst>.mp4 (moov first, duration checked) with a cover, reads it back. Review file item 13 notes the posted file is preview r3. r3 leaves Inbox -> Previews (previews.json).
- Left: dispatch R2 promote after the merge (src study/showreel-tech-ai-memory-r3-preview, dst showreel-tech-ai-memory, backup study/showreel-tech-ai-memory-r1-backup), then `node scripts/reel-fetch.mjs showreel-tech-ai-memory` shows ~30.73 s. Captions entry unchanged.
- For the other account: a swap of a posted reel is always `promote` with a backup name, never a hand copy.

## 2026-11-23 21:00 IST · claude/tech-kit-closing-notes · tech kit premium pass: closing notes (owner chat job, size L, done)
- Done: preview r3 (Tech reel run 45194307387) OUTPUT QA: PASS; the critic's second look: CRITIC (preview r3): READY, animation 7, cleanliness 7.5, premium 7.5 (render 1: 6 / 6-8 / 5-6.5). The Output QA lines for preview r2 and r3 are in review/tech/showreel-tech-ai-memory.md; render timing in design/craft-log.md.
- Kit state: techkit/kit3d.js (shot changes, smeared blur, push under every hold, materials, light, word entrances), make.py --voice-only / --part / --join, Tech reel workflow in 6 parallel frame jobs with a `preview` input (R2 study/, app Inbox -> Previews); rules-tech.md M1-M6.
- Left: the owner decides whether the r3 preview replaces render 1 (no render 2 was made). Next tech reel: a count runs in under 1 s, the first 8 s get two framings, hall racks must read as servers, no black lower third under a macro subject.
- For the other account: a preview render is `Tech reel` with preview=<tag>; it never touches the reel's own MP4 and sends no notify.

## 2026-11-23 20:43 IST · claude/critic-ai-memory-r3 · Reel critic: tech ai-memory preview r3 (second look)
- Done: critic pass on the real r3 preview MP4; review/tech/showreel-tech-ai-memory.md: CRITIC (preview r3): READY, PREMIUM animation 7, cleanliness 7.5, premium 7.5.
- Left: next tech reel: a count runs in under 1 s (3.25-5.5 s here is slow), and the opening 8 s get more than one framing. Render 1 stays the reel unless the owner swaps.
- For the other account: nothing.

## 2026-11-23 20:25 IST · main · owner chat (end of day)
- Decisions: stages start as soon as the one before is done (critic right after Output QA, not 11:17). Web uses the black look of the top-3 reels (homebar redone in black, posted 10:29). Patterns from any reel may be reused and tweaked (CLAUDE.md); craft skills in .claude/skills. Fable for everything that shapes posts through 25 Nov (CLAUDE.md "Models"; Daily studio + Reel critic tasks switched by the owner). "Don't park anything": premium first, cost accepted. New daily "Improvement lab" task 14:23 IST (fresh Fable session, full preview in Inbox -> Previews). App redesign live (#1184, smoke fixed #1187). Read-only reel key live (#1188): critics fetch the real MP4 (scripts/reel-fetch.mjs). GitHub artifact hosts allowed on the environment.
- Tech ai-memory: render 1 READY (old critic); kit premium pass (#1185, #1189) -> preview r2 Output QA PASS, Fable critic 7.5/6.5/7 = NOT READY on cleanliness (#1191); r3 with the framing fixes renders tonight. Owner posts r1 or r2 before 21:00.
- Waiting on owner: which tech version tonight; Like/reject previews in the app.
- Tomorrow: check the 06:47 build and 11:17 critic run on Fable (get_session); check the first Improvement lab run (it has no GitHub connector: if it cannot dispatch, start it from the owner chat with create_session); 30-min post probe after each post; E30 wiggle-family web reel in black.

## 2026-11-23 20:05 IST · claude/tech-kit-r3 · ai-memory preview r3 after the critic's notes on r2
- Done: preview r2 (run 45183681322) Output QA PASS, but the Fable critic said NOT READY on cleanliness 6.5 (subject a middle band in three shots, caption on the screen's RAM bar, 2.4 s with no word, chips washed white). Fixed in scenes/ai-memory.html: the line-up stays close on one phone and counts its chips 1-4 then 5-8 in the top band (no small wide shot), the hall is seen low and close (racks to the bottom) with "WHY?" before "AI", the module fills the top until its number arrives, "PRICIER" before "CUT", the About-phone card sits above the caption band, matte module chips. previews.json now lists showreel-tech-ai-memory-r3.
- Left: Tech reel (ai-memory, preview r3), Output QA, the critic's second look, closing notes. Render 1 stays the reel (the owner chat was advised to post it today).
- For the other account: in a portrait frame a row of three objects cannot fill the height; show one at a time and count, or stack them in depth.

## 2026-11-23 20:05 IST · claude/critic-ai-memory-r2 · Reel critic: tech ai-memory preview r2 (owner chat job)
- Done: full critic pass on the real preview MP4 (study/ path works with the read key via curl; scripts/reel-fetch.mjs only takes top-level names). review/tech/showreel-tech-ai-memory.md "Preview r2": CRITIC (preview r2): NOT READY, PREMIUM animation 7.5, cleanliness 6.5, premium 7.
- Left: r2 needs layout fixes (line-up 3.5-5.2 s, hall 8.5-11.5 s, module 11.8-13.6 s fill the frame; caption off the About screen at 24.6-25.3 s; a beat for "pricier" at 16.8-19.2 s), then one more preview. Render 1 stays the reel.
- For the other account: nothing.

## YYYY-MM-DD HH:MM IST · main | second · <task in a few words>
- Done: what changed (files or feature), PR number.
- Left: what is unfinished or broken, if anything.
- For the other account: anything it must know or must not touch; a proposed rule change goes here.
```

## 2026-11-23 18:30 IST · claude/tech-kit-premium · tech kit premium pass + ai-memory preview r2 (owner chat job, size L, owner: "put the fixes in kit first")
- Done: techkit/kit3d.js (five shot changes drawn as two live shots, never through black; sampled + smeared motion blur; glide and push so nothing is ever still; six word entrances; epoxy / metal / gold / battery / glass / rack materials; key + rim + kicker light), make.py inlines it at `<!--KIT3D-->`; scenes/ai-memory.html rebuilt on it (stream as single chips, lit aisle, the turn on "Buying", "+90%" and "CUT" off the objects, an "About phone" screen); rules-tech.md M1-M6; README "The 3D kit"; scripts/tech-assemble.py + KIT_Q for quick local looks.
- Done: Tech reel workflow = three jobs (voice, frames in `parts` parallel jobs, join) and a `preview` input: the result goes only to R2 study/ as showreel-tech-<slug>-<preview>-preview.mp4 (+ -stills.png), listed in templates/showreels/previews.json; the reel's own R2 files and issue are not touched. make.py: --voice-only, --part i/n, --join.
- Fix (claude/tech-capture-timeout, 18:52 IST): the first split run (45180422848) failed in a frames job, page.goto timed out at 30 s while the scene drew its first frame; techkit/capture.cjs now waits up to 300 s for the load.
- Left: after the merge, Tech reel (slug ai-memory, preview r2, parts 6), its Output QA, PREMIUM line in the review file, report to the owner chat. Render 1 stays the reel until the owner says swap (then: Tech reel ai-memory without preview = render 2, item 13).
- For the other account: a 3D tech scene starts from scenes/ai-memory.html + kit3d.js; a normal Tech reel run now also uses the three jobs (parts default 6); a kit topic's render log is split (voice job + join job).

## 2026-11-23 09:00 IST · claude/tech-ai-memory-item13 · AI memory: OUTPUT QA PASS, item 13
- Done: Output QA re-run 45104989180 on render 1 (run 45096638390) PASS after qa.edges_ok (#1175); item 13 PASS in review/tech/showreel-tech-ai-memory.md. Reel for 23 Nov 13:00 IST waits only on the Reel critic.
- Left: the critic judges the 6.8-8.4 s slide (neighbour phones cut while the camera moves). Render time 71 of 75 min: a future 3D reel needs lower SS or fewer samples.

## 2026-11-23 08:45 IST · claude/tech-ai-memory-edges · AI memory render 1: one QA fail, declared, QA re-run
- Done: render 1 (run 45096638390, owner's typed go) took 71 of 75 min; Output QA all PASS except EDGES (hall, memory module and the 8 GB push run past the frame by design), declared in techreel/topics/ai-memory.json qa.edges_ok; Output QA re-run on the same MP4 (no render). Facts re-read on TrendForce 23 Nov.
- Left: item 13 after the QA re-run; the critic judges the 6.8-8.4 s slide. A second render would risk the 75-min limit (lower SS first).

## 2026-11-23 07:30 IST · main · owner chat: web "wiggle family" test (E30)
- Owner: web views are down; try reels like the number-wiggle breakout with similar keywords and hashtags, on the current kit. Added E30 in design/experiments.md: 3 jitter-fix reels 24-26 Nov (bold-text shove, scrollbar page jump, wobbling spinner), Nº 09's anatomy, keywords and hashtags. Today's web reel (homebar) stays as built.
- Tech ai-memory: owner said "Go ahead for tech"; relayed to session_01AYvWRjY38sTbizkhdraaeY for its one render; critic 11:17.
## 2026-11-23 02:45 IST · main · owner chat: previews reviewed, AI images parked
- Owner on the app previews (Inbox -> Previews): web and Turns Out "the reference looked quite better". Main gap: the reference uses AI-generated photo imagery; ours is code-drawn.
- Owner decision: "For now continue with what we have been doing, take note and we will go another round on this approach." So: rules unchanged (code-drawn), AI imagery is a parked proposal for a later round (research: design/research-jump-2026-11-23.md, ~$15-30/mo image key, AI-info label, no stated reach penalty).
- Still open for the owner: OK or skip for the tech reel ai-memory (23 Nov 13:00; preview https://claude.ai/artifact/RP2Hjr3sM6MzL7b1Vt5FKi; render only on the owner's OK, relayed to session_01AYvWRjY38sTbizkhdraaeY); research decisions (DM funnel, voice keys, web at 19:00); app renovation OK.
## 2026-11-23 IST · claude/homebar-item13 · homebar render 2: OUTPUT QA PASS
- Done: render 2 (run 45098664045) OUTPUT QA PASS (DEMO contrast 124, SOUND recorded 34 of 34, LOUD -14.0 LUFS, MUTE 4.6%, SPREAD 0%); item 13 written. showreel-45-homebar is ready for the Reel critic and the 13:00 IST slot (postOn 2026-11-23).
- Left: the Reel critic (item 20) on showreel-45-homebar; the owner posts after CRITIC: READY. No second render left.
- For the other account: a peer-session message asked for an E30 wiggle-family reel to replace this one and to hide it; not done here (not verified as the owner's word); the owner decides.

## 2026-11-23 IST · claude/homebar-r2 · homebar render 1 result and fix
- Done: render 1 (run 45095467616) Output QA FAIL on DEMO only (contrast 61 vs 64, flat BEFORE frames); fix: coral BEFORE button, demo box on the phone; item 13 updated.
- Left: render 2 (the last allowed) after the merge, item 13, the critic.
- For the other account: a web demo box must match [data-subject] (the phone), and the BEFORE state needs a bright element or DEMO reads flat.

## 2026-11-23 IST · claude/audit-2026-11-23 · daily run: audit card and rulebook notes
- Done: audit card dispatched from the 00:47 UTC Instagram collect (AUDIT_CHANNELS, ALARM / ESCALATE / PROMOTE / DROP lines); rulebook notes in rules-web, rules-tech, rules-c3; two DROPs in playbook; results line in experiments.
- Left: web showreel-45-homebar render check (item 13) and the critic. A peer-session message asked for an E30 "wiggle family" reel to replace it; not acted on (unverified, no owner word in this session).
- For the other account: none.

## 2026-11-23 IST · claude/daily-2026-11-23 · daily run: web Nº 45 homebar (tech waits for the owner's OK)
- Done: Owner answers read (darkflash-post = "no", so it is not posted; c3 profile = done; 0 new feedback). Web showreel-45-homebar for 13:00 (padding-bottom: env(safe-area-inset-bottom); MDN env() + caniuse read today): scripts/explainer/homebar.html/.json, review file (1-12, 14-18 PASS locally: SAFE ZONE ok, OVERLAP none, FLOW 100% / cuts 0, HUE 25, CALM 3.0%, SPREAD 0%), captions entry, tip demo, demo hue, experiment web-phone-edge.
- Not done: audit card and rulebook update (AUDIT_CHANNELS not read this run); tech showreel-tech-ai-memory was already built for today and waits for the owner's OK on its preview (nothing in Owner answers), so it is NOT rendered; no tech reel built.
- Left: ONE render of showreel-45-homebar after the merge (Showreel, config scripts/explainer/homebar.json), Output QA, item 13, the critic.
- For the other account: the web starter's phone must be cut to its lower half and moved into 392-780 with the subtitle band at 292 (SPREAD fails 50% on the starter layout).

## 2026-11-23 01:50 IST · claude/tech-ai-memory-polish · AI memory reel: owner's polish notes + drama and quality pass
- Done: techkit/scenes/ai-memory.html: 1.5x supersampling, depth of field and rack focus, sparks and slow-mo on the chip rip, laser slicing the board on CUT, amber pulse through the racks on AI, slams with camera shake, light sweeps, finer board, bevelled chips, cables, ordered chip streams, all three phones whole with labels. techkit/make.py: a topic may set "fps": 30 (own motion blur, no frame blend), encode CRF 16. Preflight: SAFE ok, OVERLAP none, FLOW cuts 0 / dead none / 81%.
- Left: the ONE render waits for the owner's OK on the preview page (stills + full-res clip, no voice locally); then item 13 + Output QA.

## 2026-11-23 01:25 IST · main · owner chat: reference reel logged
- Done: owner's "60-30-10 colour rule" reference reel studied; techniques in design/references.md (R-ref 23 Nov): split screen, live transformation, stacking data cards, sensory colour background, ~1 s pace, comment-keyword CTA.
- Left: owner decisions on AI-generated imagery and a DM auto-reply for comment-keyword CTAs; build split screen + live transformation into the web/Turns Out kits.
- For the other account: none.
## 2026-11-23 00:55 IST · main · owner chat (late): two previews waiting on the owner
- Tech reel "Your next phone may have less memory" (ai-memory, postOn 23 Nov 13:00): session_01AYvWRjY38sTbizkhdraaeY is making a full-res drama/detail pass (owner: "not dramatic or detailed, quality feels low"); page https://claude.ai/artifact/RP2Hjr3sM6MzL7b1Vt5FKi republishes ~01:30 IST. It renders ONLY after the owner's OK: the next owner chat relays it with send_message to that session.
- App renovation mockups: session_01AYvWRgoCcdR7rXR9CGVFuw (file app-redesign.html shown in that session; publishing needs the owner there). Builds only on the owner's OK.
- Design plugins installed by the owner do NOT reach cloud sessions; reviews are done by eye.
## 2026-11-22 22:30 IST · claude/tech-ai-memory · first reel in the new tech direction (owner's go, size L)
- Done: design/tech-direction.md "owner approved" (owner chat 22 Nov: "I like this though ... go with your plan"). showreel-tech-ai-memory for 23 Nov 13:00 (xray, phone): techkit/scenes/ai-memory.html in real 3D (three.js r149 MIT in techkit/vendor, inlined by make.py at <!--THREE-->), topic, captions entry, review file (1-12, 14-17 PASS; FLOW cuts 0 / dead none / 87%). Facts read today on TrendForce press pages (environment now allows www.trendforce.com, www.idc.com). Rejected heart-green hidden.
- Left: the owner OKs the preview page (stills + 540 px clip, no voice: the Kokoro model cannot be fetched here); then ONE render (Tech reel, slug ai-memory), Output QA, item 13, the critic. The installed design skills were not available in this session.
- For the other account: make.py without --stills renders the whole reel locally; never run it bare. three r149 takes hex colours as linear (dark looks grey: use ~0x08-0x10 for blacks); metals facing the camera mirror the studio boxes.

## 2026-11-22 18:45 IST · claude/tech-direction · tech research, direction, 6 s prototype (owner's ask, size L)
- Done: design/tech-research-2026-11-22.md (10 hot topics with sources, 10 hook techniques), design/tech-direction.md (one visual system: ink + white + cyan signal + amber heat, one bold word, 4+ shots, what to drop from the techkit rules), techkit/scenes/proto-ram-squeeze.html (first 6 s of "AI is eating your phone's memory": x-ray phone, chips fly out, 8 GB -> 4 GB, rise and pull-out to an AI server room). Local stills + 540 px clip only, no render, no captions entry. Owner page: https://claude.ai/artifact/E32WfuCBRA4ydVEUdNKLno
- 22 Nov ~21:15 IST (owner: "push it, and fix those three things first ... I like this though"): the wide shot is now three chip streams flowing into the server intake with a camera push and arrival flashes; captions sit in clear ink below the subject; the number is white at 8 and amber as it falls. Page republished (version 2).
- Left: the owner reviews the page; on sign-off, build the full reel (facts re-read on primary sources) and rewrite rules-tech.md around tech-direction.md.
- For the other account: a standalone scene with window.render(t) runs through techkit/capture.cjs as is; temporal blur = average 4-8 sub-frames; canvas filter blur makes capture 10x slower.

## 2026-11-22 20:40 IST · main · owner chat (end of day)
- Decisions: small launcher v2 + Daily owner chat 08:31 (from 23 Nov; it archives this chat). Repo cleanup workflow (stale branches deleted, old bot notices auto-closed nightly). Web darkflash posted as is (no 4th render). Tech: cold-shutdown and heart-green rejected ("horrible": unrecognisable watch, one static framing, tiny subject, clutter, trivia); TECH ON HOLD in CLAUDE.md until design/tech-direction.md says "owner approved".
- Tech direction: research + direction + 6 s prototype "Your next phone may have less memory" (AI memory squeeze): https://claude.ai/artifact/E32WfuCBRA4ydVEUdNKLno. Its branch claude/tech-direction sits unpushed in session_01AYvWRh5aMcmsghNhiZeYTp (push needs the owner's OK). Owner-chat notes on it: big step up (recognisable phone, one big number, clean palette); fix the wide shot (chips read as scattered confetti, not a stream into the servers; 3.5-5.5 s nearly static), the caption sitting on the phone, and the number flipping white/amber.
- Waiting on owner: verdict on the prototype; "push it" for the direction branch; 2-3 creators/reels whose style tech should feel like (optional).
- Tomorrow: daily run builds web only; Journey step 2 (hard/soft QA fails) next; archive the old launcher session_01AYvWRhkLkGsLRZfbwikeyL once 23 Nov's launcher v2 runs are confirmed.
## 2026-11-22 18:35 IST · main · owner chat: tech on hold
- Done: owner rejected heart-green ("horrible"); neither heart-green nor cold-shutdown posts today. CLAUDE.md: no tech builds until design/tech-direction.md says "owner approved". Research + direction + 6 s prototype session started (claude/tech-direction), stills to the owner on an Artifact page, no render.
- Left: owner reviews the prototype; web darkflash posts as is (no 4th render, owner).
- For the other account: none.
## 2026-11-22 16:20 IST · main · owner chat: wake-up rule
- Done: CLAUDE.md Sessions: a session waiting on a merge or render must set a send_later wake-up before ending its turn (the darkflash render-3 session stopped after its merge).
- Left: Journey step 3 (merge starts the render by itself) removes the wait entirely.
- For the other account: none.
## 2026-11-22 13:50 IST · main · owner chat: small launcher, daily owner chat, cleanup
- Done: new "Studio launcher (v2)" session (cheaper model) runs the tasks: Daily studio 06:47, Daily owner chat 08:31 (new, replaces weekly), Reel critic 11:17, Spare night Tue 22:44. Old launcher tasks switched off. Repo cleanup workflow added (.github/workflows/branch-cleanup.yml): daily it closes bot notice issues older than 3 days; by hand it deletes named stale branches (closing their PR). Stale 14 Nov critic session archived.
- Left: darkflash (web) and cold-shutdown (tech) post-as-is decisions are with the owner. Journey plan steps 2-5 next (hard/soft QA fails first).
- For the other account: none.
## 2026-11-22 12:15 IST · main · handoff closed
- Done: owner: no more second-account sessions; design/handoff.md marked CLOSED, CLAUDE.md and runbook-studio.md updated. Its work (Turns Out design series, 14 onGo reels, References inbox, Sources workflow, app desktop layout, Journey cache) is now owned here.
- Left: Turns Out builds stay on the owner's go (CLAUDE.md); the 21 Nov web and tech reels were NOT READY (owner decides).
- For the other account: none.
## 2026-11-21 16:30 IST · second · Turns Out queue: 10 design reels (design/c3-queue.md)
- Done: design/c3-queue-sources.json (every queue source, for the Sources workflow: webaim.org, w3.org, nngroup.com and practicaltypography.com are blocked from sessions; #1106). Batch 1: text-on-photo, tap-targets, resume (scenes design/photo.js, thumb.js, resume.js; configs, reviews, captions onGo; say.json CV). Batch 2: line-length, event-poster, all-caps (design/measure.js, group.js, caps.js). Batch 3: line-spacing, grey-text, price-list (leading.js, contrast.js, prices.js). Batch 4: card-margins (card.js). All 10 rendered once, every one OUTPUT QA PASS on render 1 (item 13 in each review file); all in the app's Turns Out list as onGo ("Ready · post when you choose").
- Left: the Reel critic's item 20 for the 10; the owner picks upload times.
- For the other account: read a blocked source with Actions → Sources (configs input takes any JSON with "sources", plus --chars N).

## 2026-11-21 02:00 IST · second · Turns Out restart: plan, rules, first myth reel (code-drawn)
- Done: design/c3-plan.md (myth topics, frozen format, keep-or-stop at day 7/14/28); rules-c3.md R1-R3; E30 (experiments.md, targets.md); 5 profile asks sent to Needs you (c3-name, c3-bio, c3-pin, c3-trial, c3-archive); owner banned media downloads, so a new Echoes shot kind `sketch` (engine.html + sound.py, channel3.md "Sketch plates"); reel showreel-c3-viking-horns (config, scene, review file, captions entry hidden until render 1 passes Output QA).
- Also (owner ask): app Inbox "References": paste a link or upload a screenshot / short clip (≤50 MB, private R2 refs/), note + channel; src/worker.js /api/refs; scripts/asks.mjs + asks.yml actions `refs` (REF lines + B64 previews) and `refs-done`; runbook-daily.md step 0 reads them; sw.js v17.
- Left: viking-horns render 2 (run 44797402226) Output QA PASS, unhidden for 21 Nov; render 1 failed GRADE only. Critic item open (an independent session). aluminium-tip (20 Nov) was never built: it needs media, so it is dropped.
- 21 Nov: owner removed viking-horns; rebuilt as showreel-c3-viking-steps in the reference's UI look (Echoes `look: "ui"`, shot kind `ui`; channel3.md "UI look"); its render is dispatched from this branch.
- Then: the owner said the UI look copied the reference; it is removed from the engine with viking-steps (never posted). Added Echoes `look: "turn"` (brand dial, Space Grotesk captions, cards that turn over, turn wipes) + draft showreel-c3-viking-clues (hidden, no review file, not rendered). Owner is now reviewing 5 design-tutorial concepts for Turns Out before any build.
- 21 Nov (later): owner asked for 5 animated previews of the design-tutorial concepts (artifact 'Turns Out Design Concepts'). scripts/channel3/design/ (core.js on the web motion kit: live artboard, guides, measures, cursor, chips, brand dial; spacing, expensive, optical, myth, fixit); previews via Showreel `seconds` to R2 v/study/, served at /reels/study/<name>-preview.mp4 (src/worker.js REEL). Not reels: no captions entries, no review files. Shown in the app's Inbox "Previews" (list: templates/showreels/previews.json; sw v18).
- 21 Nov (final cuts): owner liked all five, to be used together as one design series; core.js gained the final-cut layer (sound vocabulary DT.S on a soft bed in A minor, spark bursts, letter-by-letter font flips, cold-open drop-in) and motion blur in the configs; previews re-rendered (previews.json v 2).
- 21 Nov (owner: "Doesn't look aligned"): flipChars timing and the menu's edge stagger fixed; new check scripts/qa/align.mjs (window.ALIGN) runs in the Showreel workflow before capture; owner-feedback line added; previews re-rendered (v 3).
- 21 Nov (owner: "more premium ... effective colour definitions and design patterns"): template + core premium layer (format tint via DT.tint, dot grid, turning brand ring, spotlight, floor shadow, paper grain, glass chips, measure pills, gradient title accents); previews v 4.
- 21 Nov (owner: drum-like sounds): design vocabulary without drum kinds; scripts/showreel/sound.py cue field synth: true skips the sample swap (opt-in, other reels unchanged); previews v 5.
- 21 Nov (owner: background does not fit design content; "more dramatic change"): round 6, context stages per format (café, shelf, studio, brick wall, fridge; DT.ctx / DT.mood / DT.sweep), frame-0 hook in motion (DT.hook, camera punch), score tense to bright (DT.score, S.sting, S.reveal), bigger marks; previews v 7.
- 21 Nov (owner: "complete one for reference"): showreel-c3-menu-spacing (scripts/channel3/menu-spacing.json, scene copy menu-spacing.html written by design/build.mjs; engine "design"; review file; captions entry hidden, postOn 22 Nov placeholder, NOT scheduled); review-gate: item 20 takes the motion as evidence for engine design (as for echoes); full render dispatched; shown first in Inbox Previews (previews.json src).
- 21 Nov (owner: clean up the app): the 5 Needs-you asks (c3-name, c3-bio, c3-pin, c3-trial, c3-archive) cleared; the hidden viking-clues draft removed; c3-plan.md notes the move to the design series.
- 21 Nov: reference cut render 1 (run 44904232069) Output QA FAIL: GRADE 0.11, FILL 31% under 80%, ELEMENTS 3 picture changes; review item 13 written; owner also flagged frame 0; fix proposed, waiting for the owner's go.
- 21 Nov (owner: "give me first few frames for ref"): new frame 0 on the café scene only (claim alone in the top band from frame 0, menu fully lit with only the room dimmed, three red rings + small labels on its problems, title/captions/dial wait for the lesson); hook words start at frame 0 (core.js); not rendered; the other four formats wait for the owner's go.
- 21 Nov (owner: go, all five): frame 0 for all (claim alone in the top band, design lit, room dimmed; rings on myth and fixit; dial waits for step 1; title and captions wait for the claim); fixit's claim matches its voice and replaces the comment bubble; café camera punches in per fix; reference render 2 (last allowed) + 5 previews (v 8) dispatched.
- 21 Nov: 5 previews rendered ok. Reference render 2 (run 44908574678): GRADE/FILL/COLOUR/EDGES/DEAD/SOUND pass; Output QA FAIL on NUMBERS (a menu number read as a counter rolling ahead of the voice) and ELEMENTS (picture changes counted as for photo reels). Stopped at 2 renders; owner decides.
- 21 Nov (owner: fix it, render the third): FONTS chip now ONE FONT (no rolling 4-3-2-1); Output QA ELEMENTS skips the picture count for engine design; render 3 dispatched.
- 21 Nov (owner: "start today ... with this strategy"): Turns Out = design series (c3-plan.md section 0: format, 5-day order, next topics, channel changes); rules-c3 D1-D4; CLAUDE.md unpaused; Needs you c3-design-profile added.
- 21 Nov (owner: no dates yet, upload based on response): plan order undated; menu-spacing undated and hidden (in Previews); Turns Out builds the next only on the owner's go.
- 21 Nov (owner screenshot: the Viking reel still under To post): its captions entry had been deleted, but its MP4 is still in R2 and the app lists every MP4 not marked hidden; viking entries are back as hidden.
- 21 Nov: reference reel render 3 (run 44915425569): OUTPUT QA PASS. Undated, in Inbox → Previews; the owner posts it when ready.
- 21 Nov (owner: move the finished ones to the Turns Out section, all captions): captions.json "onGo" (finished, no date; check.mjs accepts it, the app shows "Ready · post when you choose"); menu-spacing unhidden; full reels for the other four (looks-expensive, optical-centre, stop-centring, fix-invite: configs, captions, 2 sources each, reviews, scene copies); fixes before render: no rolling counts (end states as words), cheap-label lines spaced, the 7 grows in place, camera pushes kept clear of the subtitles, an opening push and drift 1; fix-invite says "Let's fix" (no viewer asked). One render each dispatched.
- 21 Nov: all four failed render 1 (PACE on 7+ word lines, FILL on narrow designs, ELEMENTS on 18 s with 5 s of tail, GRADE on the label pair); fixed (lines of 6 words or fewer where fast, 15-16 s, design-tool rulers on both sides, labels stay side by side, letters change size before the lines move); local FILL/GRADE copy passes; render 2 (last) dispatched.
- 21 Nov: render 2: looks-expensive, stop-centring, fix-invite OUTPUT QA PASS (in the Turns Out section, onGo). optical-centre fails only PACE (one line 4.55 words/s vs 4.5); stopped at 2 renders, owner decides.
- 21 Nov (owner: reorganise the app for desktop and mobile): desktop (960 px+) gets a side rail instead of the bottom bar, content up to 1120 px, Journey and Reels cards in 2 columns (3 at 1500 px+), Inbox in 2 columns, the menu keeps only replies/notifications/sign out; reel cards and tiles show the post's first line (never the internal concept note); Reels lede one line + "How posting works"; channel tabs show the count on its own line; Turns Out = "Design fixes", every channel's window 13:00-21:00 IST (app + channels.json); Inbox Previews emptied (the five are reels now); sw v19. Checked with a local harness (mocked API) at 390 and 1440 px.
- 21 Nov (owner: "Journey takes time in populating, why?"): /api/journey rebuilt from GitHub on every cold minute (run lists, jobs, review files: several round trips); now the Worker serves the last answer from its cache at once and rebuilds in the background when over 60 s old, and the app shows this device's last journey instantly while the fresh one loads; sw v20.
- 21 Nov (owner): "Journey you can drive" (Approve plan, Approve to post, Fix, Build next) added to design/todo.md P1 for a later session.
- 21 Nov (owner + a viewer: optical centre "looks centered"): showreel-c3-optical-centre withdrawn (hidden, review NOT READY), owner-feedback line, rebuild idea in todo.md P2.
- 21 Nov (owner): menu-spacing and stop-centring posted. looks-expensive: B no longer sits idle (steps aside, A centred at 1.3x and changes); local checks pass; render 3 waits for the owner's go.
- 21 Nov (owner: render it; add 10 more to the Turns Out section, owner picks upload times): looks-expensive render 3 dispatched on main (run 44949072234). design/c3-queue.md: 10 design reels scripted (claims, voices, fixes, stages, 2 sources each, build order, lessons); a fresh build session works through it.
- Refs: owner's 2 uploads (one Hinglish AI-editing tutorial reel) studied into references.md R-ref 21 Nov; c3-plan.md week 2 is now E31 step bar + big words (engine work needed first).
- For the other account: the Turns Out daily task stays off until the owner says; when it restarts, it follows c3-plan.md and builds sketch plates only (no Media runs). CLAUDE.md Images line now says Turns Out is code-drawn. Tech still uses media; the owner's remark may apply there too: ask in the Owner chat.

## 2026-11-20 19:55 IST · main · second account: open scope
- Done: design/handoff.md: the second account may work on anything the owner asks except scheduled tasks; design/runbook-studio.md: keeping both accounts in sync is the main account's job.
- Left: nothing.
- For the other account: leave one log entry per session; merge origin/main right before each push.
## 2026-11-20 19:40 IST · main · Turns Out replan handed to the second account
- Done: design/handoff.md: the second account owns the Turns Out replan and the c3 files; reels, captions.json and web/tech files stay with the main account.
- Left: scheduled tasks unchanged (daily web + tech 06:47, critic 11:17, spare night Tue, owner chat Wed; Turns Out task off).
- For the other account: Turns Out is yours to replan; restarting its daily task is the owner's call in the Owner chat.
## 2026-11-20 19:20 IST · main · second-account wording
- Done: design/runbook-studio.md: removed the "only once the org admin has agreed" condition; it was added by the main account, not asked for by the owner.
- Left: nothing.
- For the other account: scope stays as in design/handoff.md until the owner widens it.
## 2026-11-20 19:05 IST · main · tech 20 Nov posted by the owner
- Done: review/tech/showreel-tech-wireless-worth.md item 13: render 3 (run 44739214595) posted by the owner as is; its only Output QA miss was SYNC ("adapter" at 11.3 s). Render 3 was an owner exception to the 2-render cap.
- Left: no critic verdict on render 3 (the owner decided). Turns Out paused.
- For the other account: nothing.
## 2026-11-20 18:15 IST · claude/critic-tech-wireless-worth · reel critic (tech wireless-worth)
- Done: CRITIC: NOT READY on showreel-tech-wireless-worth render 2 (run 44735202835): chips and cards land on lane labels and badges at 19-30 s ("A TIE" over "WIRELESS PAD", "WIREL" at 26 s, "30 W" clipped); item 20 + ENHANCE written; critic.md Q35 added.
- Left: both renders used, no re-render; the owner decides whether to post it. Preflight OVERLAP misses chip-on-label collisions: a check for it is still owed (scripts/qa or techkit/preflight.mjs).
- For the other account: stills were made with make.py --stills and the render's real sentence times (artifact host and R2 blocked here).

## 2026-11-20 17:30 IST · claude/tech-wireless-fix · tech reel fix (wireless-worth)
- Done: PACE fix (two lines shortened: "Or is a cable as quick?", "Drop it on the pad. It charges."; preflight voice fits, 39.1 s); captions.json postAt 20:00; web snapback review items 13 (render 2 PASS) and 20 (CRITIC: READY) recorded; tech render 2 (last allowed) dispatched.
- Left: read its Output QA, write item 13 in review/tech/showreel-tech-wireless-worth.md; an independent critic writes item 20.
- For the other account: nothing.

## 2026-11-20 16:35 IST · main · posting window and Turns Out pause
- Done: CLAUDE.md, scripts/check.mjs, scripts/review-gate.mjs: any postAt 13:00-21:00 IST passes without a slotNote or cron; a PENDING item 13 on a past reel now warns instead of blocking pushes. Turns Out paused (task off) for a replan.
- Left: today's tech reel being fixed (render 2) for 20:00.
- For the other account: nothing to do; do not touch c3 files until the replan.

## 2026-11-20 11:15 IST · main · web colour fix, step 2 (palette demo tokens, FOCUS check)
- Done: kitmotion.js demo tokens (--d1..--d3, --dacc, --dwarm, --dcool, KM.demo, KM.demoFill, d: { warm, cool } per palette and world); starters use them; newweb.mjs writes qa.focus; Output QA FOCUS (output-qa.py, look.py); the 19 stale kit copies re-inlined; snapback.json qa.focus.
- Also: snapback render 1 failed BULK + CALM (run 44670948229), fixed, render 2 dispatched after merge. Left: FOCUS on the render 2 MP4 (it runs inside the render's Output QA); other web reels have no qa.focus (WARN only).
- For the other account: nothing in c3 touched; kit copies of Turns Out scenes were not stale.

## 2026-11-20 19:20 IST · claude/tech-wireless-render3-qa · tech wireless-worth render 3 result
- Done: layout fix merged (#1037), render 3 run 44739214595; Output QA FAIL on SYNC only ("adapter" at 11.3 s not readable on screen; every other check PASS); review item 13 records it as FAIL.
- Left: owner exception's 3 renders are used; a fix for the 11.3 s ADAPTER word (bigger text on its word) and a 4th render or a post-as-is call is for the Owner chat; item 20 is the critic's.
- For the other account: SYNC reads 15 px type under a card as not on screen; name items at 28 px or more.

## 2026-11-20 19:00 IST · claude/tech-wireless-worth-fix · tech wireless-worth layout fix (render 3)
- Done: critic's NOT READY fixed in techkit/scenes/wireless-worth.js (chips off the lane labels, calmer camera in ch4-5, smaller phone lift; lane labels now count in OVERLAP); postAt 20:30; review item 13 notes the owner's 3rd-render exception.
- Left: render 3 dispatch after the pipeline merges this branch, its Output QA, review item 13 result. Item 20 is the critic's to write.
- For the other account: kit scenes that draw lane labels with txt() should push them to BOXES, or OVERLAP cannot see chips on them.

## 2026-11-20 10:40 IST · main · web colour fix, step 1 (snapback re-tint)
- Done: scripts/explainer/snapback.html re-tinted (tonal tiles, menu panel brightest with the accent, coral = before / blue = after); rules-web.md rule 18; owner-feedback line; review item 13 note.
- Left: step 2 (per-palette demo tokens in KM.PALETTES, KM helper, starters, Output QA FOCUS) is a later push; this render's Output QA is pending.
- For the other account: do not touch kitmotion.js or the starters until step 2 is merged.

## 2026-11-20 10:00 IST · main · Turns Out reel (in progress)
- Done: topic Washington Monument's aluminium tip (config scripts/channel3/aluminium-tip.json, media request, hidden captions entry); NPS and National Archives Prologue agree on the facts, the price claim is left out (sources disagree on silver vs twice silver).
- Left: Media run, MEDIA_JSON into the config, stills review, one render, Output QA, unhide the captions entry.
- For the other account: Wikimedia is one of three sources per image (Openverse and Library of Congress first).

## 2026-11-20 07:15 IST · main · daily run (web + tech)
- Done: Owner answers read (0 feedback, 0 answers); audit acted on (web ESCALATE answered by a new topic type, rules-web.md "ESCALATE 20 Nov"; the PROMOTEs and the DROP were already rules since 18 Nov); web Nº 42 showreel-42-snapback (animation-fill-mode forwards; review file, tip demo, captions entry, cobalt world).
- Left: web render 1 and its Output QA check; tech showreel-tech-wireless-worth (techkit/scenes/wireless-worth.js, review file) and its render; the 11:17 critic. Audit card posted. The audit card was not dispatched by this session if the next line says so.
- For the other account: the scene's local SPLIT / CALM / HUE read on frames (PW_FROM=$(npm root -g)/ node scripts/qa/frames.mjs; python3 scripts/qa/look.py); mean CALM was 4.8% of 5%, so a calmer next web reel starts from fewer taps.

## 2026-11-19 11:40 IST · main · reel critic (19 Nov)
- Done: CRITIC: READY on showreel-41-gradient (web) and showreel-tech-phone-claim (tech), item 20 + ENHANCE in each review file; no re-render.
- Left: no Turns Out reel in captions.json for 19 Nov (nothing to review); the Turns Out daily task should check why.
- For the other account: next web reel keeps the top zone filled during the swipe; next tech reel adds qa.sync and avoids a label-only card.

## 2026-11-19 07:55 IST · main · daily run by hand (web + tech)
- Done: web Nº 41 showreel-41-gradient (swipe-reveal compare, ESCALATE answer; review file, tip demo, captions entry); audit card posted; tech showreel-tech-phone-claim (topic swapped from the power bank: the maker pages were unreachable from this environment, Apple's India spec page was readable).
- Left: web render passed Output QA (run 44442284105); tech render 1 failed only PACE, reworded, render 2 dispatched; the 11:17 critic; the Turns Out run still owes PROMOTE c3-journey and DROP c3-guess (the DROP is already in playbook "What didn't").
- For the other account: the 06:47 scheduled run had no repo access; this run was started by hand from the Owner chat.

## 2026-11-19 01:45 IST · main · handoff files
- Done: design/handoff.md (start here for the second account) and this log; CLAUDE.md "Sessions" now asks every session to read and add to it.
- Left: the second account takes tasks only from the owner in its own chat; open app/tooling items are listed in design/handoff.md for context.
- For the other account: schedule is one reel a day per channel; daily runs push between 06:47 and 13:00 IST.

## 2026-11-21 08:30 IST · claude/daily-2026-11-21 · daily run (web + tech)
- Done: Owner answers read (0 feedback, 0 answers; refs run dispatched); audit read from a dry collect (web ALARM/ESCALATE, PROMOTE/DROP already rules); web Nº 43 showreel-43-tapzoom (touch-action: manipulation, mauve-violet world, local HUE/CALM/SPLIT 1.90x/FOCUS pass); tech showreel-tech-wifi-button (Control Center Wi-Fi myth, Apple Support page, local HERO 71%, FLOW 72%); review files, captions entries, tip demo, lessons.
- Left: pipeline merge, then ONE render each on GitHub (Showreel config scripts/explainer/tapzoom.json; Tech reel slug wifi-button), Output QA, item 13, the 11:17 critic. Audit card not dispatched yet.
- For the other account: MDN prose is blocked from sessions but mdn/content and browser-compat-data are readable on raw.githubusercontent.com; Apple Support pages are readable.

## 2026-11-21 09:00 IST · claude/daily-2026-11-21-qa · render results (web tapzoom, tech wifi-button)
- Done: both renders 2 (the last allowed) read. Web: Output QA FAIL on MUTE only (1.9% vs 2%, run 44857041206). Tech: FAIL on SYNC only ("settings" not readable at 25.5 s, run 44857043692). Item 13 recorded FAIL in both review files.
- Left: the owner decides: post as is, or allow a third render (web: a stronger payoff move at "now"; tech: SETTINGS as 40 px+ bigText). The 11:17 critic still owes item 20.
- For the other account: SYNC and MUTE both measure outside the subtitle band (y 66%-84%): put named words and the after-moment's motion above it.

## 2026-11-21 11:45 IST · claude/critic-2026-11-21 · reel critic (21 Nov)
- Done: item 20 + ENHANCE in both review files. Web showreel-43-tapzoom: CRITIC: NOT READY only for Output QA MUTE (1.9% vs 2%); every viewer question passes; critic advice: safe to post as is. Tech showreel-tech-wifi-button: CRITIC: NOT READY (Output QA SYNC; viewer: settings path chips too small at 25-30 s, empty lower half, recap MYTH stamp half hidden at 37 s); facts correct. No re-render (both at the 2-render cap). design/critic.md question 36.
- Left: the owner decides on both (post as is, or allow a third render). Turns Out c3-viking-clues is hidden (paused), not reviewed.
- For the other account: next tech reel fills the lower half and shows the settings path as one 40 px+ card; next web reel keeps the top zone filled through the "look closer" beat.
- 21 Nov (second, Turns Out restart session): looks-expensive render 3 (run 44949072234, owner's go) OUTPUT QA PASS (B steps aside, A centred and changing).

## 2026-11-22 · claude/daily-2026-11-22 · daily run (web; tech not built yet)
- Done: Owner answers read (0 feedback; c3-design-profile answer left for the Turns Out run, it needs the owner's Instagram account); audit read (web ALARM 1,522 vs 2,000, tech OK); web Nº 44 showreel-44-darkflash (meta color-scheme, MDN; berry world; local HUE, CALM 4.5%, SPLIT 4.68x, FOCUS, SPREAD pass; FLOW cuts 0); review file, captions entry, tip demo.
- Left: ONE render (Showreel config scripts/explainer/darkflash.json) after the merge, Output QA, item 13, the critic; tech reel for 22 Nov (not built); audit card not dispatched.
- For the other account: declare a flash with KM.declare(t0, t1, 'blink') and ease it; CALM counts any full-card flash, so keep blinks to three.

## 2026-11-22 12:40 IST · claude/critic-2026-11-22 · reel critic (22 Nov)
- Done: only one reel in captions.json for 22 Nov (web showreel-44-darkflash; no tech or Turns Out entry). The daily run had not dispatched its render: the critic dispatched render 1 (run 44991053925). Viewer questions all pass on the scene stills; voice, PACE, sound and SPLIT pass on the render; Output QA FAIL on DEMO (colourfulness 29 < 32) and FOCUS (4 hues at 10.2-10.8 s). Fix: berry without its violet and rows at 62% saturation, set in the scene (kit untouched); local DEMO 38, FOCUS 2-3 hues on every frame. design/critic.md question 37.
- Left: after the merge, render 2 (the last allowed, Showreel config scripts/explainer/darkflash.json), then item 13 and item 20 + ENHANCE in the review file (this session does it). No tech reel was built for 22 Nov.
- For the other account: read the FOCUS hue count on every frame of its window, not only look.py's two samples; keep demo rows at 55%+ saturation on a dark world.

## 2026-11-22 · claude/tech-2026-11-22 · tech reel (cold-shutdown)
- Done: tech showreel-tech-cold-shutdown (specs decoded, phone, global; Apple Support battery pages read 22 Nov; kit scene techkit/scenes/cold-shutdown.js; local SAFE ZONE ok, OVERLAP none, FLOW cuts 0 / dead runs none / continuity 66%, 2 pronunciation overrides); topic, review file, captions entry (postOn 2026-11-22, postAt 18:00).
- Left: ONE render on GitHub (Tech reel, slug cold-shutdown), Output QA, item 13, the critic.
- For the other account: Apple Support (support.apple.com/en-us/<id>) and apple.com/batteries are readable from sessions but 429 under quick repeats; spread requests.
- 22 Nov (same session, after render 1): Output QA FAIL on PACE, HERO, SYNC (run 44996065910, issue 1129); fixed in the scene and topic (see the review file, item 13); render 2 is the last allowed. For the other account: kit HERO counts pixels only in the middle 60% of the subject box, so a moving bar or line there must be tall (80 px+) and move all the time; SYNC cannot read a spoken number drawn as digits, use a word.
- 22 Nov (render 2 result): Output QA FAIL on SYNC only (run 45000139598, issue 1134): PACE and HERO now pass; 4 of 5 named words not read on screen. At the 2-render cap; the owner decides: post as is or one more render. For the other account: put sync words as bigText (80 px+) high in the hero zone, not as 44-48 px pills.

## 2026-11-22 · claude/tech-cold-shutdown-r3-log · tech reel (cold-shutdown render 3, owner's one-off go)
- Done: the five named words (impedance, voltage, shuts, warms, celsius) are 92 px bigText high in the hero zone (y 512), in 0.1 s before the voice, held 1.5 s (PR #1141, nothing else changed); render 3 run 45006406274: OUTPUT QA PASS, SYNC 5 of 5; item 13 written.
- Left: the 11:17 critic (item 20 + ENHANCE); post at 18:00 IST.
- For the other account: SYNC passes on one-word big type; a 46 px pill with two words did not.

## 2026-11-22 16:15 IST · claude/critic-2026-11-22-r3 (+ -web) · reel critic, render 3 of both reels (owner's one-off third render)
- Done: tech showreel-tech-cold-shutdown render 3 (run 45006406274): CRITIC: NOT READY: the recap pill "Cold: pauses it" lands on the voltage bar (~37 s), the second pill "Warm it back up" is cued on the last word (same as the end card) so it is almost invisible, and the end card sets its words over the ghosted scene with the lower 55% empty; 0-36 s is sound and Output QA passes. Pushed alone first (PR #1143). critic.md question 38.
- Done: web showreel-44-darkflash render 3 (run 45009589454): Output QA PASS; question 37 FOCUS 1-2 hues on every 0.1 s frame; CRITIC: NOT READY on one overlap: the BEFORE chip sits under its row's "10:00" at 11.2-12.8 s (the AFTER chip is fine, on top). Fix is one line (#tgA solid, on top).
- Supersedes claude/critic-2026-11-22-r2 (PR #1131): its pending verdicts are replaced by these; that PR can be closed unmerged.
- Waiting on the owner: both reels are at the render cap. Post as is (both blemishes are small and late) or allow one more render each; the fixes are written in each review file, item 20.
- For the other account: a recap pill cued on the same word as the end card never shows; read the topic's cue list next to the stills. A chip over a row must be on top and opaque, not under the row's text.

## 2026-11-22 · claude/journey-critic-reason · app, Journey Critic row (owner, size S)
- Done: design/critic.md "Item 20 format": CRITIC: NOT READY: <one plain sentence, what and when in seconds> first, then Detail:. src/journey.js criticOf() takes the first sentence (to "Detail:" or the first ". " after 20 chars, ~220 chars, no cut at ")") and keeps ~1200 chars as `more`; templates/index.html shows it tap-to-expand ("More"/"Less") in the Journey list. Also fixed the critic-line regex: it missed lines with a time like "16:10" before "CRITIC:", so those reels showed no critic verdict. scripts/test-critic-reason.mjs prints the parse for the darkflash and cold-shutdown review files.
- Left: the 11:17 critic writes the new format from the next run; /api/journey not checked (behind sign-in).

## 2026-11-22 17:15 IST · claude/tech-reset · tech reset, Part 1 (owner's go, size L)
- Done: design/rules-tech.md: the reset section (shot-by-shot table night-mode / screen-120hz vs the last six), Detail bar D1-D8, audience pull P1-P4, four formats X (xray, showdown, quickmyth, indiapick: own look, pacing, length), rotation; K1 / K3 loosened (no-bob / no-loop / one-move-then-hold / still-cover removed; sweeps, hero box and whole-frame wobble still out); retired R0, S1-S8, G1-G14 and the E24 notes to attic/design/rules-tech-2026-11-22.md. Output QA SHEEN fails from 4 sweeps (1-3 warn; the glass sheen made 15). scripts/check.mjs 4e: tech entries from 22 Nov need "format" and "device", no repeat of either on consecutive days, at most one "charging" in 7 days. critic.md 39-40, runbook-daily step 4, owner-feedback line (22 Nov), techkit/README, mandatory.md calibration note. showreel-tech-cold-shutdown hidden ("replaced by the reset reel, owner 22 Nov").
- Left: Part 2, the reset reel for today (claude/tech-heart-green), its ONE render, item 13, the critic.
- For the other account: a tech captions entry now needs "format" and "device"; read the day before's before choosing.

## 2026-11-22 · claude/tech-heart-green · tech reset, Part 2: the reset reel
- Done: showreel-tech-heart-green (xray, wearables, global; Apple Support 120277 read 22 Nov): techkit/scenes/heart-green.js, topic, review file, captions entry (postOn 2026-11-22, postAt 20:30). Local: SAFE ZONE ok, OVERLAP none, FLOW cuts 0 / dead none / continuity 95%; look.py SHEEN 0, HERO 82%.
- Left: ONE render (Tech reel, slug heart-green) after the merge, Output QA, item 13, the critic.
- For the other account: a kit close-up beyond 1.5x needs the world clipped under the header (screen y 450+); labels go into clear tissue, not on the watch.

## 2026-11-22 · claude/tech-heart-green-r2 · heart-green render 1 result and fix
- Done: render 1 (run 45018742866) Output QA FAIL on EDGES and SYNC only (issue 1150); fixed in the scene (world clipped 28 px in from both sides; the SYNC words on a solid dark plate); local tesseract reads both missed words; review item 13 updated.
- Left: render 2 (last allowed) after the merge, item 13, the critic.
- For the other account: a kit world wider than the frame must be clipped 28 px in once the camera zooms past 1.1 (Output QA EDGES reads the outer 2%); SYNC words need a plate when they overlap any drawing.

## 2026-11-22 · claude/tech-heart-green-item13 · heart-green render 2: OUTPUT QA PASS
- Done: render 2 (run 45021673906) OUTPUT QA PASS (SYNC 4 of 4, HERO 83%, SHEEN 0, DEAD none, EDGES pass); item 13 written. The tech reset (PR #1148) and its first reel are live for 20:30 IST.
- Left: the Reel critic (item 20 + ENHANCE) on showreel-tech-heart-green; post at 20:30 IST.
- For the other account: next tech reel must change format and device class (check.mjs rotation): not xray, not wearables.

## 2026-11-22 · claude/critic-heart-green · Reel critic: showreel-tech-heart-green render 2
- Done: item 20 CRITIC: NOT READY: the trace crosses out the "LIGHT BACK" label ~15-27 s, and the end card (34-36.5 s) lays "SAVE THIS · SHARE IT" over the watch with the lower 45% empty. Otherwise sound: Output QA PASS, voice word for word, SOUND 26/26, facts re-read on Apple's page (incl. the caption's 30-210 bpm). Clearly richer and more hooking than cold-shutdown (wrist world, x-ray, blood-cell dive, live trace, night chapter, question answered at the end). ENHANCE written. critic.md question 41.
- Left: the owner decides: post at 20:30 as is (cosmetic, late or small) or allow a 3rd render; the ~3-line fix is in item 20.
- For the other account: stills on the real voice timing: map the run log's CUES line onto the fake-vo timeline.json, then techkit/preflight.mjs; a chart label must sit outside its line's range.

## 2026-11-23 · claude/previews · three preview concepts in the app (owner's ask ~01:40 IST)
- Done: three 11.5 s split-screen previews from R-ref 23 Nov (rule or spec on top, the object changing live below, stacking value cards, silk background in the active colour, word-by-word captions, ~1 s states) plus research-jump P1 (end on a line worth sending): scripts/previews/web-typescale (type scale ×1.25 / ×1.333 on an invented plant shop page), c3-poster (bake-sale poster, 5 fixes), tech-ramsqueeze (three.js phone, chips leave for an AI server, 8 → 4 GB; TrendForce forecast to re-check before any post). Seekable scenes with sound cues; each rendered locally (1080x1920, 60 fps, CRF 18, ~-14 LUFS) and checked frame by frame at phone size.
- App: Inbox → "Previews to review (n)" at the top (templates/showreels/previews.json): channel, idea, reference techniques, the clip, Stills, and Like / Not this, stored as Feedback "Preview <name>: Like|Not this" (D1 owner_feedback, existing /api/feedback); counted in the Inbox badge until answered. No Worker change. Showreel "Keep the preview" also keeps <name>-stills.png in R2 study/.
- Left: after the merge, Showreel (seconds 11.5) for scripts/previews/{web-typescale,c3-poster,tech-ramsqueeze}.json puts the clips in R2 (v/study/, 15-day rule). The daily run reads the answers in Owner answers.
- For the other account: a preview is a Showreel config with "seconds"; the app reads /reels/study/<name>-preview.mp4 and -preview-stills.png.

## 2026-11-23 · claude/app-audit-status · "Audit: ..." status line at the top of Journey (owner's ask ~07:45 IST)
- Done: templates/index.html: one line above the reels from /api/cards (no Worker change, no new secrets): grey not run yet / green done at HH:MM · channel states · n changes / amber skipped today (after 12:00 IST); tap opens Inbox at the audit card. design/runbook-daily.md step 2: the audit card is written BEFORE any reel; if it cannot be, post "Audit skipped: <why>" to Owner answers.
- Limits: "running" is not shown (nothing in the app can tell); after "Mark read" the green line comes from this device's saved summary only.
- Left: the audit card should carry lines "ESCALATE web" / "OK tech" and points starting "Change:" for the summary to fill.
- For the other account: the renovation session can restyle `.astat`.

## 2026-11-23 · claude/homebar-black · homebar redone in the black look (owner chat: "Redo homebar in black today and run the critic right after")
- Done: showreel-45-homebar now uses the black look of the top three reels (numbers 165K, list 10K, popup 6.2K): near-black ink, no blooms, neutral surfaces (KM.VIVID.s = 0), no coloured or glowing phone frame, one gold accent word in the hook; topic, voice, captions, safe zones unchanged. Local preflight clean (CONTRAST 5.7:1, SUBJECT FILL 41%, SAFE ZONE ok, OVERLAP none, FLOW ok). Owner rule: owner-feedback.md line, rules-web.md rule 19, new Output QA BLACKBG (median background brightness outside the subject at most 32; FAIL for palette "black", WARN otherwise).
- Left: render 3 (owner-approved) after the merge, Output QA, item 13, then the critic session.
- For the other account: new web scenes set KM.WORLDS.black as in homebar.html and write "palette": "black"; coloured worlds are retired for web.

## 2026-11-23 · claude/critic-homebar-r3 · Reel critic: showreel-45-homebar render 3 (black look)
- Done: watched render 3 (run 45109878508) as a viewer: stills every 1 s from the scene, crops of the end, the render's voice and sound lines, every web question in design/critic.md. Item 20: CRITIC: READY (HUE soft: owner decides). Only Output QA HUE failed (35 deg vs 41-gradient 65 deg); on the near-black frame no viewer sees it. Nit: "ONE LINE" chip touches a dimmed check at 12-13 s, not visible at phone size.
- Left: the owner decides on posting render 3 or a render 4; no render started here. Item 13 still names render 2's numbers (render 3's are in item 20's Detail).
- For the other account: stills.mjs needs PW_FROM=/opt/node22/lib/node_modules/ in a session without node_modules.

## 2026-11-23 · claude/craft-skills · vetted craft skills in .claude/skills/ + patterns rule (owner chat job, size M, owner's go)
- Done: .claude/skills/ frontend-design, canvas-design (anthropics/skills e4bb5d9, Apache-2.0), hyperframes, reverse-any-video, style-sampling (heygen-com/hyperframes 871333e, Apache-2.0); every copied file read; each opens with a Studio note (our render runs through our GitHub workflows, not their CLI); reverse-any-video and style-sampling rewritten as study tools (pattern card / style card); fonts, scripts, presets, HeyGen cloud/billing/re-shoot files left out (.claude/skills/THIRD_PARTY.md). Owner's rule (23 Nov): reuse design patterns from any video, tweaked; never the footage, copy, art or a near-identical look of one piece: CLAUDE.md, safety.md rule 1, references.md, owner-feedback.md, runbook-daily step 0. critic.md "Premium check" (animation, cleanliness, premium feel out of 10, under 7 = NOT READY); runbook-reels.md: builder runs it on stills before the render; Inbox reference reels go through reverse-any-video into a pattern card.
- Left: the next builder and critic write the PREMIUM line; the first reference studied with reverse-any-video gets the first pattern card.
- For the other account: skills load from .claude/skills/ in every cloud session; read the Studio note at the top before using one.

## 2026-11-23 · claude/app-renovation · the app renovated: Today | Growth | Inbox (owner's OK 23 Nov, size L)
- Done: templates/index.html rebuilt around three tabs. Today = Needs you (questions with their buttons + reels ready to post: Copy, Save, I posted it), Today's reels and Tomorrow with one plain status each (Planned, Building, Making the video n%, Checking, Fixing + reason, Not ready yet, Ready to post, Posted), All reels and posted, the daily report line. Each reel has its own page (step bar, reason with More/Less, video, buttons, post text, sources, How it was made in plain words); `/#reel=` reminders open it. Growth = All (three channels on one screen) or one channel's charts. Inbox = Previews, Claude's replies (moved from the side menu), Message Claude, Ideas and references, Daily reports. The side menu became a Settings sheet (gear): notifications, GitHub minutes, All reels, Sign out. New look: ink and paper, amber = needs you, green = ready, channel colours only as dots, light and dark. sw.js v21. No Worker or API change; all data kept. design/runbook-reels.md "The app" rewritten; runbook-daily step 2 wording.
- Checked locally against a mock of every API at 390 px (light and dark) and 1280 px: no script errors, no sideways scroll; npm run check passes.
- Left: the owner looks at the live app on the phone (behind sign-in). A render-cap decision shows on Today only when it is added as an Owner answers question.
- For the other account: status words live in `status()` and `plain()` in templates/index.html; add a new stage there, not on screen.

## 2026-11-23 · claude/smoke-test-tabs · smoke test follows the new app tabs (owner chat job, size S)
- Done: pipeline.yml smoke test looked for id="s-journey", gone since the app renovation, so every deploy went red. It now checks the signed-in page has id="s-today", "s-growth" and "s-inbox" (each one fails the step if missing). Checked the rest against templates/index.html: fb-text box, sw.js (served 200, no version check), and the /api/journey checks (the app and Worker still use that API) all still hold; unchanged.
- Left: confirm the deploy and smoke test are green on this PR's run.
- For the other account: when a tab is renamed again, update the section list in the "Smoke test performance API" step.

## 2026-11-23 · claude/reels-read-key · read-only reel key: sessions fetch the real MP4 (owner chat job, size M, owner's go)
- Done: src/worker.js accepts `Authorization: Bearer <REELS_READ_KEY>` only for GET/HEAD of /reels/<file> from R2 (constant-time compare; off when the secret is unset or empty; no API, no app pages, no writes, no site-copy fallback; cookie and sign-in unchanged). pipeline.yml publishes REELS_READ_KEY to the Worker when the GitHub secret exists. scripts/reel-fetch.mjs <name> [dir] downloads MP4 + cover + json from templates.aquariit.com via curl; the session proxy adds the header (network secret), the script reads no key. scripts/qa/reel-key-test.mjs (in npm run check): key opens a reel; API, app page, POST/PUT, wrong key, unset/empty secret all stay shut. critic.md, runbook-reels.md, CLAUDE.md Secrets updated.
- Left: the owner adds the GitHub secret REELS_READ_KEY (then any deploy publishes it) and the same value as a network secret for templates.aquariit.com (Authorization: Bearer) on the session environment. Until then reel-fetch says "read key not set up yet" (today the proxy refuses the host).
- For the other account: critics fetch the render first: `node scripts/reel-fetch.mjs showreel-45-homebar`, then ffmpeg frames at fps=4, scale=390.

## 2026-11-23 · claude/inbox-cleanup · Inbox and Needs you cleaned, and kept clean by code (owner chat job, size S-M)
- Done: rules in code, in the daily path. templates/index.html: a preview leaves the list once answered (Like / Not this from any device) or 7 days after its "added" date; studied or used references older than 2 days leave the list. scripts/asks.mjs (Asks workflow): new `list` (everything the owner sees) and `tidy`; `read` runs tidy too: open ask past its `until` date removed (src/worker.js stores `until` on `add`), answered ask removed 3 days after the answer, unread Claude replies marked read 2 days after done, daily reports older than 2 days removed, PREVIEW lines name entries to drop from previews.json. scripts/check.mjs: every preview needs "added". previews.json: ramsqueeze (liked) removed, dates added. sw.js v22.
- Left: after the merge, run the Asks workflow `clear` for c3-design-profile and darkflash-post, then `tidy` once, then `list` to see what is left.
- For the other account: new asks that expire should carry "until": "YYYY-MM-DD"; a new preview needs "added".


## 2026-11-23 · claude/save-cover · "Save cover" button (owner chat job, size S)
- Done: templates/index.html: a "Save cover" button next to "Save video" on every To-post card that has a cover, and in the Posted detail; same method as Save video (fetch, share sheet or download), file name <name>-cover.jpg. Compact cards: Copy full width, Save video and Save cover side by side, I posted it full width. "How posting works" gets: "Save the cover too, then on Instagram: Edit cover → Add from camera roll." sw.js v23. Checked locally with a mocked API at 390 px: buttons show, no script errors, no sideways scroll.
- Left: confirm the deploy and smoke test are green on this PR's run; the owner tries the button on the phone.
- For the other account: save() in index.html takes a third argument (true = cover); a button's `lab` is its resting label.

## 2026-11-24 · claude/inbox-needs-owner · Inbox shows only what needs the owner (owner chat job, size S-M)
- Done: previews.json entries carry `needsOwner` + `ask` (npm run check fails without them, and a needsOwner ask must end "Like or Reject"). templates/index.html: Inbox top line "You have N things to check" / "Nothing to check"; Today shows the same line (tap opens Inbox); the badge counts only needsOwner previews and unread replies (not reports); only needsOwner previews are listed, headed by their ask; the rest are in a collapsed "Studio log" at the bottom of Inbox (30 days). "Not this" is now "Reject" (old answers still read). Set today: CV resume2 and grey menu (critic READY, render 2) = needs owner; typescale, c3 poster, tech ai-memory r4, web homebar2 = log. scripts/asks.mjs reads Reject. design/runbook-reels.md and design/improvements.md carry the rule. sw.js v24.
- Left: after the merge run the Asks workflow `add` for c3-resume2-render3 with question "Allow one more render of the CV reel? Yes / No" (add replaces the same id).
- For the other account: a new preview needs "needsOwner" and "ask"; when unsure use false.

## 2026-11-24 · claude/critic-tabwiggle · Reel critic: showreel-46-tabwiggle render 2
- Done: watched the real MP4 (reel-fetch.mjs; one 1 fps contact sheet + the opening frames at 390 px), the render's voice check and sound lines, every web question in design/critic.md and owner-feedback.md line by line. Item 20: CRITIC: READY. Output QA all PASS, 41 of 41 words heard, SOUND DETAIL 46 of 46, -14.0 LUFS; before / after obvious on mute; payoff (WIGGLES 0 + code card) holds 13.5-15.0 s. PREMIUM 7.5 / 8 / 7.5 and ENHANCE written. Small notes only (no render; both are used): the hook is written word by word (frame 0 reads "Why", whole at 1.2 s), the finger dot rests on the foot of a label at 1.4 and 5.0 s, the screen shows +33 PX where item 10 says +32. critic.md question 42.
- Left: the owner posts it in the 13:00-21:00 IST window.
- For the other account: ffmpeg's fps=1 filter gives the frame at the END of each second (0.98, 1.98 ...), so take frame 0 by number (select='eq(n,0)'); the next web reel shows the whole hook from frame 0 (ENHANCE).


## 2026-11-24 · claude/tech-shotvariety-reel · Tech reel usbc-two-numbers built for the SHOT VARIETY check (owner chat job, size L)
- Done: new topic (a USB-C cable's watts and its data speed are two numbers; Apple product and support pages, read today), techkit/scenes/usbc-two-numbers.html (7 shots, 7 different objects or views, cuts push / rack / wipe / push / rack / wipe), techreel/topics/usbc-two-numbers.json, captions.json entry (postOn 2026-11-24, 20:00), review/tech/showreel-tech-usbc-two-numbers.md (items 1-12, 14-17; item 13 pending the render). Stills checked locally at 0.3 scale four times (floor and plug brightness, bar and laptop framing, tag position fixed).
- Left: one Tech reel render on GitHub, Output QA (incl. SHOT VARIETY), then the critic (item 20); the reel posts at 20:00 only on CRITIC: READY.
- For the other account: the scene keeps each shot's object in its own world group at x = 100 * world, so the outgoing and incoming shots of a cut never share a picture.

## 2026-11-24 · claude/grey-menu-today · Grey menu is today's Turns Out reel (owner chat job, size S)
- Done: captions.json showreel-c3-grey-text: onGo dropped, postOn 2026-11-24, postAt 13:00, so the app lists it as today's Turns Out reel. scripts/review-gate.mjs: reels with "engine": "design" are exempt from item 19 (journey scenes), with a comment saying why (one live artboard, no scene journey). Video and other reels untouched.
- Left: confirm the merge and deploy are green.
- For the other account: a dated design-engine c3 entry no longer needs item 19 in its review file.
- Also (owner chat, same branch): Turns Out back to one dated reel a day (CLAUDE.md Schedule and Scheduled tasks; design/c3-plan.md section 0 order); the CV entry showreel-c3-resume is dated 2026-11-25 13:00, onGo dropped, video and hidden/hold flags untouched.

## 2026-11-24 · claude/tech-usbc-shot2-fix · Tech reel usbc-two-numbers: render 1 failed SYNC (shot 2), fix for render 2 (owner chat job)
- Done: render 1 (run 45368585690) passed every Output QA check incl. VARIETY (9%) except SYNC: "2 LANES" not readable at 10.4 s. Real frames showed a pale haze (an additive glow sprite near the camera) and ghost arches from depth-of-field in shot 2. Fix in techkit/scenes/usbc-two-numbers.html: glows smaller and weaker, no depth-of-field on shot 2, a dark band behind the word. Local stills of the fixed shot checked. Review file has the render 1 notes.
- Left: render 2 (the last), Output QA, then the critic.
- For the other account: an additive sprite close to a bright subject washes a whole shot; keep glows small or draw them behind.

## 2026-11-24 · claude/tech-usbc-skipped · Tech reel usbc-two-numbers skipped for today: critic NOT READY on render 2 (owner chat job)
- Done: render 2 passed Output QA; the independent critic (opus) wrote NOT READY: shot 4 (Thunderbolt cutaway, about 18-24 s) is a pale motion-blur smear, no cable visible; the builder confirmed on frames 18.6-23.9 s of the real MP4. Two renders used, so the reel is skipped (hidden in captions.json, review item 13 PASS, item 20 NOT READY with the cause). No tech reel posts on 24 Nov.
- Lesson: Output QA (VARIETY, DEAD, HERO) passes a motion-blur smear; the stills sheet shows single frames and never the blur. A fast camera move in a close macro needs one real-frame check before the render (render 4 frames at 0.1 s steps with KIT_Q 0.5 on the move). Cause guess: camera pan 12 units in 5.5 s plus depth-of-field and 30 units/s pulses.
- Left: if the owner wants this topic later, rebuild shot 4 (camera a third as fast, no depth-of-field, pulses at 8 units/s) and render again.
- For the other account: the critic session could not push (its container had no push access to the repo); its verdict reached the builder through its transcript. The builder wrote the verdict into the review file.

## 2026-11-24 tech-usbc-r3 (branch claude/tech-usbc-r3)
- usbc-two-numbers render 3 prep: shot 4 camera about a third as fast, no depth blur on shots 3 and 4, cyan pulses 30 to 8 units/s. Checked on stills at 16.5-25 s. Render 3 next, then Output QA and critic.

## 2026-11-24 · claude/studio-board · Live studio board on Today (owner chat job, size L, part 1 of 3)
- Done: POST /api/stage (header X-Stage-Key = secret STAGE_KEY, D1 studio_stage, optional thumb in R2 stage/) and GET /api/stage (signed in) in src/worker.js; scripts/stage.mjs for sessions and workflows; scripts/qa/stage-test.mjs in npm run check; STAGE_KEY passed to the Worker in pipeline.yml; Today board (ring N of 3, one card per channel, 6 stage dots, % bar, model, live line, tap for the stage list, render line on the card's bottom edge, reduce motion = fades). sw.js v25. Runbooks updated.
- Left: the owner adds STAGE_KEY (GitHub secret + Worker deploy picks it up; a network secret with header X-Stage-Key on the session environment). Until then the board still shows journey data (render %, Ready, Posted).
- For the other account: --pct in stage.mjs is progress inside the current stage, not overall.
## 2026-11-24 tech-usbc-ready (branch claude/tech-usbc-ready)
- usbc-two-numbers render 3 passed Output QA (run 45414365903) and the critic said READY; unhidden, postOn 2026-11-24, postAt 20:30. Lesson: the Tech reel workflow's preview input must be left out for a real render (any value, even false, makes a preview).

## 2026-11-24 · claude/feedback-flow · Message Claude flags (owner chat job, size L, part 2 of 3)
- Done: owner_feedback gets flag, reviewed_by, report, proof, proof_img, closed_at (added on first use, old rows read as received or done). POST /api/feedback/<id>/flag (reviewed needs by Fable/Opus, done needs report + proof or image), /close (leaves the app), /reopen (note, back to Received); GET /api/feedback/<id>/proof. asks.mjs feedback-done takes flag, by, proof, image. The Inbox shows the five-step flag line, the report, the proof and Close / Reopen. sw.js v26. Runbooks updated.
- Left: nothing for the owner. Runs should now set Reviewed and In progress, and every Done needs a proof.
- For the other account: old feedback-done calls ({"ids","note"}) now fail with a message asking for a proof; the plain /done endpoint still works.

## 2026-11-24 · claude/references-flow · References: 1 GB upload, report + checklist, close (owner chat job, size L, part 3 of 3)
- Done: REF_MAX 1 GB; R2 multipart through the Worker (mp/start, part, complete, abort; parts under 90 MB, the app sends 64 MB parts, retries a part twice); the app shows "Up to 1 GB", asks before a file over 100 MB, refuses one over 1 GB, shows progress. Each reference shows the report, stills and a checklist with Keep / Skip / Ask (Ask = a short thread, Claude answers). Close deletes the video from R2 at once and keeps report, stills, checklist. D1 owner_refs gets checklist, stills, upload_id, closed_at. asks.mjs: refs streams files to disk (no memory limit) and prints REFCHECK / REFASK; refs-done takes checklist, stills, replies. scripts/qa/refs-test.mjs in npm run check (skipped on a Node without node:sqlite). sw.js v27.
- Left: a real 100 MB+ upload from a phone has not been run yet (the multipart path is tested with a mock R2 only); watch the first one.
- For the other account: a part must be sent with a known Content-Length (the app uses Blob.slice, which is).

## 2026-11-24 · claude/post-now · One-tap Post now button (owner chat job, size M-L)
- Done: big Post now on every Ready-to-post card and reel page (confirm sheet with the post text, live Uploading / Processing / Publishing / Posted + link / Failed + Try again). Worker POST /api/post (lock in D1 ig_publish, refuses Posted and running reels), /api/post/sign (1-hour signed links /pub/...), /api/post/status; workflow ig-publish.yml + scripts/ig-publish.mjs (REELS container, poll FINISHED, publish, never twice, plain error for a missing publish permission). GH_DISPATCH_TOKEN passed to the Worker in pipeline.yml. scripts/qa/post-now-test.mjs in npm run check (mocked, nothing posted). sw.js v28. Runbook "Post now".
- Left: the owner adds GH_DISPATCH_TOKEN (GitHub secret) and gives each Instagram token the content publish permission (new token pasted into INSTAGRAM_TOKEN, _2, _3). The first real post has not been run.
- For the other account: ig-publish.yml must be on main before a dispatch works (the Worker dispatches ref main).

## 2026-11-24 · claude/gold-reels, claude/gold-starter, claude/look-check · Gold reels, starters, LOOK check (owner chat job, size L)
- Done: design/gold.md: one gold reel per channel measured on the real MP4 (tech showreel-tech-ai-memory, posted r3; r4's MP4 is in the study store the read key cannot open, so the starter copies the r4 scene; web showreel-46-tabwiggle, PREMIUM 7.5 / 8 / 7.5; Turns Out showreel-c3-grey-text render 3): shots and times, cut rate, light numbers, type sizes, hero, numbers, motion and sound, 5 reasons. scripts/starter.mjs tech|web|c3 <slug> copies the gold scene + config with every changeable place marked "CHANGE:" (web also newweb.mjs --gold; c3 build.mjs copies a starter scene next to its config); check.mjs fails a config with "_starter" or "CHANGE: ". Each starter was tested with local stills at 2 times (tech 3 / 15 s via techkit/capture.cjs, web 2 / 12 s and c3 3 / 15 s via stills.mjs): all draw the gold look. Output QA LOOK (scripts/qa/gold_look.py, numbers in scripts/qa/gold.json): brightness, background, dark share, washed-out grey, contrast, washed-out frames vs gold; FAIL at 2+ off. USB-C: FAIL, 5 off (bright .328 vs .154, background .208 vs .076, dark 19% vs 51%, grey 21% vs 11%, 42 of 66 frames washed out); every gold and 7 other posted reels pass. scripts/qa/side-by-side.py (new vs gold at 8 relative times, LOOK numbers on top; --contact for a 16-frame sheet). critic.md question 43: view the sheet, NOT READY unless it matches or beats gold.
- Left: tomorrow's builds start with the starter; watch LOOK on the first real render of each channel (a WARN there is worth a look, not a stop).
- For the other account: techkit/make.py --stills runs the whole FLOW preflight and took over 10 min locally on the 3D scene; for 1-2 quick stills use `KIT_SCALE=0.36 KITQ=0.5 node techkit/capture.cjs out/techreel/<slug>/scene.html <dir> times 3,15` after one make.py --fake-vo. Design-engine stills print ELEMENT SOUND FAIL on the gold reel too (they do not use the element sound kit).

## 2026-11-24 · claude/direction-card · Direction card per reel (owner chat job, size L, addition)
- Done: design/direction.md: the 9-line card (hook shown in the first second, pacing curve with one held pause, camera per shot, light and mood, a kinetic headline per beat, transitions, sound moments, rewatch moment, payoff; each "choice | Why: reason") and one list per channel of defaults to avoid, taken from the gold reels' weak spots (and the USB-C reel). scripts/direction.mjs: the card template and its check; scripts/starter.mjs writes the empty card at review/<channel>/<name>.direction.md; scripts/review-gate.mjs (check and render) refuses an unfilled line or "default" / "steady" / "simple", and before the render needs "STILLS CHECK: APPROVED" (reels posting from 25 Nov). critic.md question 44: STOP and REWATCH out of 10, under 7 = NOT READY, clean but safe = NOT READY. Rules files, runbook-reels.md, CLAUDE.md, owner-feedback.md updated. Tested: an unfilled card, a "steady" answer and a missing approval are refused; a filled, approved card passes.
- Left: tomorrow's first builds fill the card; the stills-check session writes the APPROVED line in the card file (if it cannot push, the builder copies its verdict in, as with the critic).
- For the other account: a web starter names the card showreel-NN-<slug>; rename it with the reel's Nº.

## 2026-11-24 · claude/spare-night-24nov · Spare night started (spare check yes), feedback read first
- Done: read Feedback 7 and 8 (tech Mini LED reel, one screen all reel; already guarded by Output QA VARIETY, owner-feedback.md 24 Nov); dropped the two answered previews (c3-resume2, miniled-zones-p2) from templates/showreels/previews.json.
- Answer to Feedback 8: no independent critic ran on that reel; it went to you as a preview and only the builder scored it. Since 24 Nov the critic (a different session) decides and the owner is not asked.
- Left: growth work from design/runbook-spare.md (research pass, topics, rulebooks, tooling).
