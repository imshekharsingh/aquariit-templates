# Handoff log (both accounts)

Every session on either account that changes the repo adds ONE entry at the top, in the same push as its work. Newest first; keep the last
30 entries and move older ones to the bottom of design/craft-log.md. Read the last 5 entries before starting.

Format (at most 6 lines):
```
## YYYY-MM-DD HH:MM IST · main | second · <task in a few words>
- Done: what changed (files or feature), PR number.
- Left: what is unfinished or broken, if anything.
- For the other account: anything it must know or must not touch; a proposed rule change goes here.
```



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
