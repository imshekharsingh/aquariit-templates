# Handoff log (both accounts)

Every session on either account that changes the repo adds ONE entry at the top, in the same push as its work. Newest first; keep the last
30 entries and move older ones to the bottom of design/craft-log.md. Read the last 5 entries before starting.

Format (at most 6 lines):
```



## 2026-11-28 · claude/gifted-clarke-qp3n4s · other account (Inputs): action list from the count, and a clearer Today board
- design/references.md "R-ref 28 Nov": references 15-19 make 2.4-3.4 actions a second, v7 1.8 (ACTION LIST for v7 part b). References 9-14 were deleted when closed.
- Board (owner: "there's no clarity"): src/journey.js puts a hidden reel dated today on the board as held; templates/index.html: [hidden] always hides, one plain line per card, folded cards, no model names, the top line names questions / reels to post.
- For the main account: a held reel now shows on Today; nothing else changes for builders.


## 2026-11-28 · claude/owner-chat-28nov · owner chat: day summary
- Decisions: owner said yes to a 3rd render on all three reels (~$18-28 total); the other account does everything 29 Nov - 2 Dec incl. daily reels, the owner chats with it in an "Inputs" session (design/inputs-brief.md); this account's Daily studio run and Turns Out tasks are OFF until Wed 3 Dec (owner chat re-enables them); 2.5D depth study: no 3rd render for now.
- Ready: Turns Out text-on-photo 14:00, web popover 19:00, tech tag-relay 20:30 (all reviewer READY on render 3). Turns Out spend ~$16.
- Broken / learned: the 05:11 Turns Out task failed 2 mornings (no repo/tools; built by hand from the owner chat); all three reels needed render 3 for faults a pre-render check would catch (voice longer than picture, grey "broken" states, frame-0 label spacing): in handoff.md GO NOW item 2. An Output QA text check read an icon as a digit (item 6).
- Tomorrow: the owner opens the other account's Inputs session before 05:00 IST so the 29 Nov reels get built.
## 2026-11-28 · claude/handoff-ocr-false-alarm · owner chat: queue a fix for an Output QA false alarm
- A text check read a padlock icon as a number on today's tech reel; handoff.md GO NOW item 6 asks the other account to fix it with a test.
## 2026-11-28 · claude/gifted-clarke-qp3n4s · other account (Inputs): action count for references
- Owner: count the actions in references so 3D kit v7 can get more actions and elements. scripts/qa/action-count.py (actions a second, things moving at once, gaps), asks.yml action refs-study (references by id in any state + our reels, 2 fps sheets), .claude/skills/reverse-any-video "Action count". References 15-19 (26 Nov) were never studied: in this run.
## 2026-11-28 · claude/gifted-clarke-qp3n4s · other account (Inputs): the critic is called "reviewer" to the owner
- Owner: "going forward critic will be called reviewer". CLAUDE.md and design/inputs-brief.md: owner-facing words only; "CRITIC: READY", the critic tag and design/critic.md stay (scripts read them).
## 2026-11-28 · claude/inputs-session-brief · owner chat: an "Inputs" session on the other account
- Owner will chat with the other account in one "Inputs" session for the rest of the week; design/inputs-brief.md gives it the full context (read order, reply style, 28 Nov state). handoff.md GO NOW item 5. The main account only coordinates its scheduled tasks.
## 2026-11-28 · claude/handoff-takes-all-till-tue · owner chat: the other account does everything 29 Nov - 2 Dec
- Owner: all tasks until Tuesday go to the handoff account, daily reels included; this account keeps only the hourly probe (checks and reports) and the owner chat. design/handoff.md "GO NOW 28 Nov", CLAUDE.md Sessions line. Daily studio run and Turns Out daily tasks switched off; the owner chat turns them back on Wed 3 Dec.
- Today (28 Nov): all three reels needed a 3rd render (owner yes ~09:10); they finish on this account.
## 2026-11-27 22:53 IST · claude/tabs-order · other account: task 20, channel tabs in posting order, the tab follows the workflow
- Done: templates/index.html chanOrder() orders the tabs by today's next reel to post (postAt, else the slot), posted channels last; only workflow entry points set the channel (board Open to post / Open reel, reel link or reminder, tab tap, All reels = the channel due next); the saved last tab and the Growth picker no longer switch it (Growth shows its own pick). scripts/qa/app-tabs-test.mjs in npm run check.
- Left: App probe PASS on the live app (Progress).
- For the main account: nothing.
## 2026-11-27 22:50 IST · claude/app-fresh · other account: task 19, the installed app never runs an old copy
- Done: src/worker.js stamps index.html with its build (appPage) and serves GET /api/version; templates/index.html checks it on open and resume and reloads once (?fresh=), and a 20 s stalled list reloads once (?stall=1). scripts/qa/app-fresh-test.mjs (exactly one reload); design/runbook-reels.md note.
- Left: App probe PASS on the live app (Progress).
- For the main account: nothing; a deploy reaches the installed app by itself.

## 2026-11-27 · claude/handoff-task-22-2d5-depth · owner chat: 2.5D kit borrows 3D's best parts (task 22)
- Owner: no full 2.5D+3D merge now; keep 2.5D, add 3D's strengths (light, depth, materials, contact shadows, two-tier shadow builds) and one drop-in 3D object moment; compare first, one study sample (max 2 renders, ~$10-15), our critic judges. Revisit a full hybrid after a week of 2.5D numbers. Queued after v7 render 4 and tasks 21, 19, 20.

## 2026-11-27 22:40 IST · claude/app-probe-cards · other account: task 21, App probe judges each Today button by what it says
- Done: scripts/qa/app-live-probe.mjs: "Open to post" must open that channel's reels tab (selected, Ready box names only that channel); "Open reel" must open that channel's reel page; one verdict line after every step (it printed PASS before the board step).
- Left: the App probe run on the live app (PASS line in Progress).
- For the main account: nothing.
## 2026-11-27 · claude/2d5-two-tiers · owner chat: shadow-first builds in two tiers
- Owner chose two tiers: main elements get the full shadow-first draw-on (0.3-0.5 s, cascaded), small lines and labels a quiet 0.2 s trace or fade with their shadow; everything breathes after. direction.md note 7, critic.md, owner-feedback.md updated.

## 2026-11-27 · claude/2d5-shadow-draw-on · owner chat: 2.5D elements come alive from their shadow
- Owner on the AI-words reel: elements should draw on from their shadow, coming alive, for all elements through the reel. design/direction.md "2.5D map reels" note 7, design/critic.md question 5, design/owner-feedback.md line. Next tech reel builds it.

## 2026-11-27 · claude/handoff-continue-27nov · owner chat: v7 render 4 approved; the other account keeps fixing
- v7 render 3 critic: NOT READY (cable cascade 7.7-8.7 s stutters; 6.5/6.5/7.5; board, hub, type, payoff reusable). Owner: let the other account continue fixing: v7 render 4 with the critic's exact fix (the last), then tasks 21, 19, 20, 6, 7, 16-18, each proven (Output QA / App probe PASS).

## 2026-11-27 · claude/handoff-probe-posted-cards · owner chat: Ready box fix proven for tech; probe task 21 queued
- App probe after the fix: the tech card opens the tech tab with the tech reel under Ready to post (PASS for the owner's case). Two probe "errors" are the probe's own mistake (posted cards open the reel page); handoff task 21 fixes the probe.

## 2026-11-27 · claude/option1-app-to-handoff · owner chat: all app work moves to the other account
- Owner chose option 1: every app change goes to the other account; this account keeps daily reels, critics and reminders. Done = App probe PASS on the live app. CLAUDE.md Sessions line and a rule in design/handoff.md.

## 2026-11-27 · claude/app-ready-follows-tab · owner chat: Ready to post always matches the tab
- Owner (21:48): the tech tab said "Nothing is ready to post for @webin20sec" and hid the tech reel. Opening the reels page from the Today board drew the list but left the Ready box from the last tab. render() now redraws the Ready box first. App probe: fails if a tab's Ready box names another channel, and now also opens the reels page from each board card.

## 2026-11-27 21:26 IST · claude/v7-r3-ready · other account: task 10, v7 render 3 done, ready for critic
- Done: render 3 (120 fps); Output QA passes every check but FLICKER (cable cascade 7.7-8.7 s, three weak moments); review file, projects.json, previews.json (the Tests list plays render 3).
- Left: the main account critic, then the owner decides. Fix idea for a later kit pass: show the cascade from further back.
- For the main account: start the v7 critic on render 3 (R2 study/showreel-tech-gold3d-v7-r3-preview.mp4).

## 2026-11-27 · claude/owner-chat-27nov · owner chat: day summary
- Decisions: tech restarted in the 2.5D map look (4 renders incl. a chat-window opening, owner's six 2.5D notes + "open on the real-life moment" now rules); the other account does app/kit work only (tasks 19-20, 6-7, 16-18 queued after v7), status every 30 min; owner chat opens 04:43; Turns Out back on 14:00.
- Posted: Turns Out price list (14:00), web scroll bar (19:00, app shows posted); tech AI-words due 20:30. App: stuck "Loading…" was videos streaming on open (fixed, App probe PASS: 0 videos, list 0.24 s); false Fix, tab mix-up, stale home-screen copy fixed.
- Broken / owed (owner chat, 28 Nov): 05:11 Turns Out task started without the repo ($9 lost); builder spend ran past caps (tech ~$64, Turns Out ~$23): read spend at every stage; probe repeats stale alerts and started a v7 critic early; status messages at 09:00, 14:00, 19:00, 21:15; v7 render 3 still pending on the other account.

## 2026-11-27 · claude/app-ready-null · owner chat: no page error when today's status arrives before the reel list
- App probe after the video fix: PASS on videos (0 without a tap; reel list 0.26 s, today's status 0.23 s, was 11 s), but one page error: readyRender read DATA.c before the list loaded. Guarded; the probe now FAILs on any page error.

## 2026-11-27 · claude/app-no-video-preload · owner chat: the app no longer streams videos when it opens
- App probe (signed in, iPhone size): the list itself loads in 0.5 s, but on open the app also fetched ~40 test videos (Tests list covers) and streamed every reference clip on a loop (refs thumbnails, 28 s each, repeated); /api/journey took 11 s behind them. On a phone that queue starves the reel list: the "Loading…" of 27 Nov. Now: reference thumbnails use a still, clips and test videos load only on a tap (preload none, no autoplay), no video fetch for a missing test cover. The probe prints VIDEO REQUESTS WITHOUT A TAP (want 0) and PASS/FAIL.

## 2026-11-27 · claude/app-probe-runner · owner chat: App probe runs on ubuntu-24.04
- First run failed before the probe: Playwright 1.56 has no Chromium for ubuntu-latest (26.04). Same runner as the Showreel workflow now.

## 2026-11-27 · claude/app-probe-workflow · owner chat: a live app probe (signs in, phone size, logs what hangs)
- Owner: posts still do not load in the app. New "App probe" workflow + scripts/qa/app-live-probe.mjs: signs in with the GitHub secrets, opens the live app as an iPhone, waits 25 s, prints every request with status and time, page errors, what Today and each reels tab show, and uploads screenshots. Run it whenever the app misbehaves.

## 2026-11-27 19:40 IST · claude/3d-kit-v7-r3-render · other account: task 10, why no render yet, glitch fixes
- Done: the scene passes every check but the new glitch check in a few moments; fixes to entrances, pulses, camera routes; techkit/make.py blends FPS/30 frames (v7 topic "fps": 120); stills sheet refreshed.
- Left: three moments, one whole-reel check, render 3, Output QA, "v7 ready for critic".
- For the main account: render 3 runs at 120 fps (about 40 min).

## 2026-11-27 · claude/handoff-heartbeat · owner chat: the other account reports every 30 minutes
- Owner: periodic status on open tasks. design/handoff.md rule: a Progress line at least every 30 min per started task, a last line saying why any session stopped, and the queue check flags a task silent for 30 min. First ask: what happened to task 10 (v7 render 3) after 15:34 IST.

## 2026-11-27 · claude/handoff-task-20-tabs · owner chat: the tab follows the workflow you came from
- Owner: "tabs must only be selected based on workflow selection". Handoff task 20 now says so: every entry point (board card, reminder, Needs you, reel link) opens its reel's channel and nothing switches it later; All reels on its own opens the next due channel. Today's part (the right channel even before the list loads) went live with the service-worker fix.
## 2026-11-27 · claude/sw-api-bypass · owner chat: the home-screen app reads live data straight from the network
- Owner's 19:05 recording: the re-added home-screen app still sat on "Loading…" (Today and the reel list) while Safari worked; "Open to post" showed the last channel. The service worker sent every /api/ request through its network-first cache; now /api/ goes straight to the network (sw.js v34), and going to the reels page paints the chosen channel even before the list loads. The web Fix at 19:06 was correct: its 19:00 time had passed unposted.

## 2026-11-27 · claude/handoff-task-19-20 · owner chat: stale installed app found; two app tasks queued
- The app hung on "Loading…" all afternoon only in the installed home-screen copy; Safari worked and re-adding the app fixed it (the deploy smoke test listed reels in 1 s). Handoff tasks 19 (app reloads itself on a newer deploy) and 20 (tabs in posting order, open on the next due channel) GO after task 10.

## 2026-11-27 · claude/app-list-timeout · owner chat: the reel list never hangs on "Loading…"
- Owner's screenshot (16:30): all tabs said "all posted" and the list stayed on "Loading…" (the reel list request never answered on 4G; reproduced with a request that never returns). Tabs now show "…" until the counts load; after 20 s, or on an error, the list says so with a Try again button. Why the list request was slow is not known yet (no signed-in access from here): next step for the other account if it repeats.

## 2026-11-27 · claude/app-fix-only-when-stuck · owner chat: Fix shows only on a reel that is really stuck
- Owner: Fix showed on all three channels. bProblem() judged old morning stage rows even after the reel was ready or posted. Now: ready or posted = no Fix (except a missed post time), and a stage row older than the reel's newest render or checks is ignored. Three new cases in scripts/qa/app-board-test.mjs.

## 2026-11-27 · claude/schedule-times-27nov · owner chat: owner chat opens 04:43; rule times match the real schedule
- Owner: open the daily chat around 05:00. "Daily owner chat" now 04:43 IST (before the 04:47 web/tech builds and the 05:11 Turns Out task, so their stage messages land). CLAUDE.md, runbook-studio.md, runbook-daily.md said 06:47 / 08:31 / 09:11; now 04:47 / 04:43 / 05:11.

## 2026-11-27 · claude/handoff-queue-16-18 · owner chat: more app and kit work handed over; old to-dos dropped
- design/handoff.md: tasks 6, 7 GO; new 16 (web before/after piece), 17 (whole-frame web starters), 18 (render speed), all after task 10, with rules that keep them off today's and tomorrow's reels (study clips only, after 21:00 or before 06:30, kit changes added behind new calls).
- design/todo.md: dropped the 17 Nov re-render, the per-channel script routine, the 26 Nov read-only question and the puzzle channel; Instagram API kept here for later; Turns Out task repo fix added for 28 Nov.

## 2026-11-27 15:34 IST · claude/3d-kit-v7-r3 · other account: task 10, v7 render 3 build (no render yet)
- Done: techkit/scenes/gold3d-v7.html: the plan critic's 7 changes and the no-glitch fixes; techkit/lib3d.js headline (fades, pill), numbers (letter fades, rolling tens), slam tilt/grow; techkit/world3d.js captions scrimRGB/scrimA/handles, sky colours; techreel/topics/gold3d-v7.json qa.subs (subtitles at the top).
- Left: the last glitch check, then ONE render 3, Output QA, "v7 ready for critic".
- For the main account: nothing to do until "v7 ready for critic".

## 2026-11-27 15:20 IST · claude/refs-measured · other account: task 9, references measured
- Done: scripts/ref-compare.mjs + .github/workflows/ref-compare.yml (Ref compare: reel, ref); captions "refs" tag with a check warning; scripts/audit-numbers.mjs AUDIT_REFS lines (with vs without a reference pattern, per pattern 3+ reels); design/runbook-daily.md "References, measured"; scripts/qa/ref-compare-test.mjs.
- Left: none of tasks 9-15; task 10 render 3 follows.
- For the main account: tag reels with "refs" (the 5 warned reels), dispatch Ref compare after each reel built from a reference, read AUDIT_REFS in the weekly review.

## 2026-11-27 15:16 IST · claude/refs-thumbs · other account: task 15, references you can tell apart and clean up
- Done: templates/index.html References: refView() (thumbnail or 3 s silent loop of the clip, state, one-line lesson, reels that used it via captions "refs": ["app:<id>"], safe-to-remove), a Clean up view with one Remove each. scripts/qa/app-refs-test.mjs in npm run check.
- Left: task 9 (refs tags, ref-compare, weekly numbers); it defines "app:<id>" in the refs tag.
- For the main account: tag a reel built from an app reference with "refs": ["app:<id>", ...] so the reference links to it.

## 2026-11-27 15:13 IST · claude/tests-list · other account: task 14, Tests list in the app
- Done: src/worker.js GET /api/tests (R2 v/study/*.mp4 with covers c/study/<name>-cover-auto.jpg); templates/index.html Inbox > Tests (replaces Studio log): cover, title, date, what it tests, inline player, "never posted". scripts/qa/app-tests-test.mjs in npm run check. design/runbook-studio.md: say "Inbox > Tests".
- Left: tasks 15 and 9.
- For the main account: give each test an entry in previews.json (title, about, src) so its line reads well; say "Inbox > Tests", never "study folder".

## 2026-11-27 15:11 IST · claude/fix-at-stage · other account: task 13, Fix at the exact stage
- Done: templates/index.html board: bProblem() finds the failed or stalled step (failed stage line, render/checks/critic fail, slot passed; render > 60 min, critic > 45 min after checks, build step quiet 2 h); that row turns red with its reason and the Fix button, the card opens once. New "Second look" row. stage.mjs + Worker: stage "failed" with --step. scripts/qa/app-board-test.mjs in npm run check.
- Left: tasks 14, 15 and 9.
- For the main account: a build or stills step that cannot go on sends `node scripts/stage.mjs <channel> failed --step <step> --line "why"` at once (design/runbook-reels.md).

## 2026-11-27 15:06 IST · claude/needs-you-today · other account: task 12, Needs you at the top of Today
- Done: templates/index.html: Needs you moved to the top of Today (count in the heading, badge on the Today tab), an ask can name "reel" or "preview" (src/worker.js stores it; scripts/asks.mjs add passes it) and the app shows its cover, name and an inline player. scripts/qa/app-today-test.mjs (npm run check): channel tabs show only their own ready reels; a question finds its reel or preview.
- Left: tasks 13, 14, 15 and 9.
- For the main account: when an ask is about a reel or a preview, add "reel" or "preview" to it; messages say "on Today, top".

## 2026-11-27 14:52 IST · claude/ref-upload-progress · other account: task 11, reference upload progress bar
- Done: templates/index.html References upload: progress bar (percent, part n of N, XHR progress within a part), 3 retries per part with back-off, a stop keeps the multipart upload and Try again resumes from the last good part, Added with a small preview. Worker unchanged (it already accepts a part again).
- Left: the owner tries one upload. Next GO: tasks 12-15, then 9 (after v7 render 3).
- For the main account: nothing to change; messages can say "the bar shows how far it is".

## 2026-11-27 · claude/handoff-scope-27nov · owner chat: the other account does app and kit work only
- Owner: the other account is a temporary helper for bigger app, tooling and kit chunks, never daily reels. CLAUDE.md Sessions line and a scope rule at the top of design/handoff.md.

## 2026-11-27 · claude/app-tab-mixup · owner chat: each channel tab shows only its own ready reels; app gaps queued
- Owner's screen recording: the web tab's "Ready to post" showed the tech reel, web's own READY reel sat under Up next, tech said "posts paused". Fixed: Ready box filtered by tab (re-drawn on tab switch), journey.js reads "CRITIC:" on any item number (web 49's READY was item 22), tech slot 20:30 in design/slots.json, help text slots updated.
- design/handoff.md tasks 12-15 GO (Needs you on Today, Fix at the failing stage, a Tests list for study renders, references with thumbnails and cleanup).

## 2026-11-27 · claude/c3-price-list-1400 · owner chat: Turns Out back on its 14:00 slot
- The price-list rebuild was set to 17:00 when 14:00 looked out of reach; it was READY at 13:30, so postAt is 14:00 again (slot test day 2 kept).

## 2026-11-27 · claude/handoff-lift-hold-27nov · owner chat: other account HOLD lifted, v7 render 3 is GO
- Owner: the other account starts the 3D kit v7 now. design/handoff.md: HOLD replaced by "HOLD LIFTED": 7 plan-critic changes, render 3 (last), QA, "v7 ready for critic"; apply the owner's 27 Nov 2.5D notes where they fit. Its queue check stays paused, so the owner starts it there.

## 2026-11-27 · claude/tech-27nov-stills-check · outside stills check: showreel-tech-ai-words APPROVED
- Verdict appended to review/tech/showreel-tech-ai-words.direction.md (owner notes 1-6, faults, UPGRADES). Two HIGH fixes before the one render: no type under 24 px on the wide shots (tile names and sub-node labels fade with the tags), ghosts kept out of the caption, bottom band and right edge. The builder's branch was already merged, so this went on its own branch. No render, no scene edit.

## 2026-11-27 · claude/todo-owner-app-gaps · owner chat: four app gaps noted as CRITICAL to-do
- Owner: study folder invisible, "Needs you" hard to find, Fix button not at the failing stage, references with no thumbnail/trace/cleanup. design/todo.md P1 item (27 Nov); not fixed yet, the owner chat plans it with size and cost.

## 2026-11-27 · claude/probe-wait-fix · owner chat: probe waits for its status sheet
- The 06:03 and 07:03 probes (and 15:04 yesterday) read the Studio status run while it was still queued and logged nothing. design/probe.md step 1: dispatch, then send_later 2 min and read on wake-up (one more 1-min wake-up at most). No code change.

## 2026-11-27 · claude/log-no-conflicts · owner chat: shared log clashes no longer turn runs red
- Most red pipeline runs on 26-27 Nov were several sessions writing the top of this file at once (PRs "not mergeable"). .gitattributes: union merge for design/handoff-log.md and design/owner-feedback.md; pipeline merge job: when a PR cannot merge, it merges main into the branch (union keeps both sides' lines), pushes and retries; any other conflict still fails loudly.

## 2026-11-27 01:38 IST · claude/handoff-queue-check-paused · other account: owner paused the hourly queue check
- Done: the "Handoff queue check" scheduled task is disabled (owner, until they say so); one Progress line in design/handoff.md.
- Left: render 3 of v7 waits for "PLAN: OK TO RENDER" and the owner telling this account.
- For the main account: this account no longer picks up GO tasks on its own.

## 2026-11-27 · claude/handoff-hold · owner chat: other account on HOLD (weekly limit)
- design/handoff.md HOLD at the top: no work until the owner lifts it. Waiting next: task 10, the 7 render 3 plan changes, then render 3.

## 2026-11-27 · claude/lesson-focus-structure · owner chat: focus, structure, reason in every plan and critic
- Owner: include the system-map lesson where it fits. design/direction.md "Focus, structure, reason" (one subject lit, a fixed frame, a reason for every move; more motion is not better), with where it fits per channel and kit; design/critic.md Ambition pass point 4.

## 2026-11-27 · claude/ref-nodemap-27nov · owner chat: reference study, 2.5D system map (owner's new target look)
- design/references.md R-ref 27 Nov: one continuous camera over a node map, a colour world + spotlight per step, fixed title + section pill, mini interfaces per node, measured motion vs 3D v7. Owner: test it on tech; 3D v7 continues as a kit. A tech test scene (preview, not posted) is being built.

## 2026-11-27 01:25 IST · claude/3d-kit-v7-r3-build + claude/3d-kit-v7-plan-ready · other account: 3D kit v7 render 3 built, plan ready for critic (task 10)
- Done: the upgrade critic's 15 items built in techkit/scenes/gold3d-v7.html and lib3d.js (W3D.numbers odometer, W3D.headline); plan + checks in review/tech/showreel-tech-gold3d-v7.md "Render 3 plan"; stills refreshed. Fixed two hard colour cuts found locally (hub whip from above the apps, 0.75 s; slow-start crane, camera `ease`; neutral blacks; world3d captions take `scrimRGB`).
- Left: the plan critic (main account's probe); on "PLAN: OK TO RENDER", ONE render 3 (preview r3), Output QA, "v7 ready for critic". Open point: headline over board tiles in close shots.
- For the main account: no render was made; render 3 is the last.

## 2026-11-27 · claude/handoff-v7-r3-yes · owner chat: owner yes to v7 render 3 with a plan check first
- 15-item render 3 list (upgrade critic, premium re-graded 6.5/6.5/6.5 against the owner's references). Plan + stills critic first (probe starts it), then the last render; tech restarts with a real reel either way.

## 2026-11-26 · claude/critic-ambition-26nov · owner chat: the critic becomes the design lead too
- Owner: spoon-feeding design notes must stop. design/critic.md "Ambition pass" (premium judged against the owner's references; at least 3 graded UPGRADES every verdict; HIGH ones go into the next fix); design/direction.md "Motion-design pass" in every plan. An upgrade critic re-grades v7 render 2 now for render 3.
## 2026-11-27 00:01 IST · claude/critic-3d-v7-upgrades · Upgrade critic (main account) of 3D kit v7 render 2: render 3 fix list (15 items)
- Done: judged the real v7 render 2 MP4 again as design lead, against the owner's references (shared grammar of 26 Nov), not our past reels: one contact sheet, four full frames. Kept the 5 faults; made the owner's two notes concrete (tools cascade as one flow with the camera riding it; the board builds itself and stays alive); 18 graded upgrades (problem breaks red at the tangle, one-motion collapse 24 -> 11, odometer numbers in a fixed spot, cold-to-warm light flip at the hub, kinetic headline words, a sound hit every beat). PREMIUM against the references 6.5 / 6.5 / 6.5. Section "Upgrade critic" in review/tech/showreel-tech-gold3d-v7.md; Progress line in design/handoff.md.
- Left: the owner's yes for render 3 (the owner chat asks); 6 lower upgrades move to the first real tech reel.
- For the other account: build the set (board, floor) on screen before anything lands on it, and stack groups as one cascade, never separate pop-ins.

## 2026-11-26 23:50 IST · claude/critic-3d-v7-r2 · Independent critic (main account) of 3D kit v7 render 2: NOT READY, not stable
- Done: judged the real v7 render 2 MP4 beside v6 (one contact sheet each, three full frames, frame-change and brightness at 10 fps). Plan changes 2, 4, 6 DONE; 1, 3, 5, 7 PARTLY. Faults: empty dark wall 3.9-4.6 s, the 24 block on top of the cables 9.3-11.4 s, an empty first frame (the loop jumps), a short tangle sweep. PREMIUM 8 / 6.5 / 7.5; verdict and five-step EXACT FIX in review/tech/showreel-tech-gold3d-v7.md; Progress line in design/handoff.md.
- Left: both v7 renders used; the owner decides (a third render with the five fixes, or accept as is). Tech stays paused.
- For the other account: start tool pops before the camera lands on an empty surface; place counting numbers over empty dark space, never over cables.

## 2026-11-26 · claude/handoff-ref-upload-bar · owner chat: reference upload progress bar queued (GO)
- design/handoff.md task 11 GO: progress bar with percent and part count, retry and resume of failed parts, a clear "Added" finish; done during v7 render waits or right after task 10, before task 9.

## 2026-11-26 23:41 IST · claude/3d-kit-v7-ready · other account: 3D kit v7 render 2 passed Output QA (task 10)
- Done: the plan critic's seven changes; render 1 failed only COLOUR (a hard cut in the crane to the wall); fixed (the crane is a rise then a push, tools start on "tools", edge props hidden in that shot); render 2 Output QA PASS (GLOW 1.0 %). Kit: W3D.numbers with placement, wire floorY, softer pulses, check-wires.cjs; a leader-line check in the scene.
- Left: the main account's critic on study/showreel-tech-gold3d-v7-r2-preview.mp4. Cap reached (2 renders): if not STABLE, the owner decides.
- For the main account: when the critic writes READY with every PREMIUM 7.5+, v7 becomes the tech 3D gold (gold.md, gold.json "tech3d", the tech3d starter) and task 10 is done.

## 2026-11-26 · claude/handoff-v7-loop · owner chat: v7 runs until stable, capped at 2 renders
- Owner: the other account keeps working v7 through its hourly check until stable (critic READY, all PREMIUM 7.5+, QA pass), at most 2 v7 renders, then the owner decides. The main account's probe will start the v7 critic by itself (status sheet change, separate job). Then v7 becomes the tech gold and tech restarts the next day.

## 2026-11-26 · claude/probe-start-critic · Probe starts the critic for the other account's projects (owner chat job, size S)
- Done: scripts/studio-status.mjs raises `START-CRITIC project:<id> <plan or render, MP4 / review file>` when a project is at the critic stage or the newest "other account ... ready for critic" Progress line (design/handoff.md) has no "main account ... critic" line after it; keyed on that line's time, so once per line (STATUS_HANDOFF=<file> tests it). design/probe.md has the exact create_session step and critic prompt (opus, tags critic and 3d, verdict line, PREMIUM scores, one Progress line, owner chat message, STABLE call for a render). Tested: today's state gives no START-CRITIC (the v7 plan has its verdict); a fake render-ready line gives one with the MP4 path; a verdict line after it clears it.
- Left: nothing; the probe's next fire uses the new step.
- For the other account: write "<who>, other account: ... ready for critic" in Progress with the R2 MP4 path (or the review file for a plan); the sheet reads exactly that wording.

## 2026-11-26 · claude/handoff-v7-go-changes · owner chat: owner decision on the v7 plan
- Owner saw the v7 plan stills and the 7 changes: make the 7 changes first, refresh the stills, then one render (no render on the known faults). Written in design/handoff.md Progress.

## 2026-11-26 19:00 IST · claude/owner-chat-26nov · owner chat: decisions, waiting on owner, tomorrow
- Day: Turns Out invite posted at the 14:00 slot test (render 3 after the owner's overlap note); web 48 READY for the 19:00 slot test (render 3); tech tag-sounding READY but HELD (tech paused until the 3D kit v7). Fixed today: stale board + false Post now, Today = workflow board, Projects section, Fix button, single studio key (one network secret per host), full check before render 1 (preflight-all), studio probe (hourly via launcher; the first two fires had no repo and did nothing, fixed 14:38).
- Decisions (owner): slot tests Turns Out 14:00 and web 19:00 until 2 Dec, owner reminded at each slot; tech paused until 3D v7 (the last sample), then a real reel judged by numbers; code fixes go to the other account, which works only on GO tasks (now task 10 v7, then task 9 references); DISCUSS, DON'T JUST FOLLOW; references must show in reels (critic Q52) and in numbers (task 9).
- Waiting on owner: GH_DISPATCH_TOKEN (Post now); GO for handoff tasks 6 (notification plan) and 7 (project steps); the other account to pick up task 10.
- Open: the launcher has not yet applied the web-only change to the Daily studio prompt (CLAUDE.md says tech is paused, so the build should skip tech); minutes ~930/day (going private waits on cutting them).
- Tomorrow: confirm the probe logs lines; remind Turns Out 14:00 and web 19:00; run the v7 plan critic when the other account writes "v7 plan ready for critic".

## 2026-11-26 18:42 IST · claude/3d-kit-v7-plan · other account: 3D kit v7 plan and stills (task 10, step a)
- Done: techkit/scenes/gold3d-v7.html + techreel/topics/gold3d-v7.json; kit: W3D.numbers (flat counting numbers + leader line), 'slam' entrance, wire floorY (never through the floor), soft pulses; techkit/check-wires.cjs; check-gold3d.cjs reads hubBox; plan review/tech/showreel-tech-gold3d-v7.md; stills review/tech/study-25nov/kit-phase2-v7.jpg.
- Left: the main account's critic checks the plan and stills (points 1-7), then ONE render on its OK. The reference clips were not measured (no video access here); a main-account measurement against v6 would settle point 3.
- For the main account: a glossy floor seen at low angles reads as a pale wash whatever its colour; v7 uses a matte floor (roughness .93).

## 2026-11-26 · claude/handoff-3d-v7 · owner chat: v7 replaces render 3 of v6; discuss-first practice
- v6 critic NOT READY (7.5/6/6.5). Owner notes discussed and agreed: design/handoff.md task 10 GO now (v7, last sample: no floor clipping, flat counting numbers tied to objects, measure colour and light first, camera with a reason, drama on 3 moments, tense hook, elements stay alive, the critic's faults; plan + stills checked by the critic before the render). Then task 9. CLAUDE.md: tech restarts after v7 with a real reel; DISCUSS, DON'T JUST FOLLOW rule.

## 2026-11-26 · claude/critic-3d-v6 · Independent critic (main account) of the 3D kit sample v6 render 2: NOT READY
- Done: fetched the real v6 MP4 and v5, one contact sheet each, three full frames, frame-change and brightness strips. v6 beats v5 on movement (about 2x frame change) and glow; own entrances, the first-cable beat and the hook all show. NOT READY on four defects: empty pale frame 1.4-2.1 s, doubled see-through HUB 11.5-12 s, straight straw-like cascade cables 8-9.3 s, near-still end 18.3-22.9 s. PREMIUM 7.5 / 6 / 6.5. Verdict and EXACT FIX in review/tech/showreel-tech-gold3d-v6.md; Progress line in design/handoff.md.
- Left: the other account applies the five-step EXACT FIX; render 3 needs the owner's yes; then a new critic here.
- For the other account: run a brightness strip on the preview (a frame far brighter than the reel's median is an empty or washed shot).

## 2026-11-26 · claude/handoff-go-only · owner chat: the other account works only on GO tasks
- Owner: it must not pick up the next item on its own. design/handoff.md rule: only tasks marked GO are worked on (the queue check starts only open GO tasks). GO now: task 3, then task 9. Tasks 6 and 7 wait until marked GO.

## 2026-11-26 · claude/refs-loop-26nov · owner chat: references must show in reels and numbers; other account priority 3 then 9
- design/critic.md question 52: the two key named reference patterns must be visible in the real video, with times. design/handoff.md task 9 (measuring: ref-compare script, refs tag per reel, with/without reference numbers in the weekly review). Owner priority for the other account: task 3 (3D kit), then 9, then the rest in number order.

## 2026-11-26 14:34 IST · claude/queue-check · other account: hourly queue check (queued task 8)
- Done: scheduled task "Handoff queue check" (this account, hourly at :04, cheapest model, fresh session each run) starts the next open queued task in the order of design/handoff.md, one session at a time, skipping a task touched in the last 3 hours.
- Left: its first run is 15:34 IST (next open task: 6). Task 3 (3D kit v6) continues in its own session.
- For the main account: write "task N done" in Progress when you close a task by hand, or the check will start it again.

## 2026-11-26 · claude/handoff-queue-hourly · owner chat: queue check hourly
- design/handoff.md task 8: the other account's queue check runs hourly (owner), not every 30 minutes.

## 2026-11-26 · claude/handoff-queue-watch · owner chat: the other account watches its queue on a schedule
- design/handoff.md: owner rule (pick up any queued task unasked; open/started/done markers in Progress) and task 8 (do now): a scheduled "Handoff queue check" in that account, every 30 min if allowed else hourly, cheapest model, starts one work session per open task. Order now 0, 8, 6, 7, 2, 5, 3.

## 2026-11-26 · claude/handoff-projects-flow · owner chat: projects get steps and a next action
- design/handoff.md task 7 (after task 6): per-project ordered steps with states, a "next" (who, action, expected time), step bar and Next line on the Today row, a project-done push. Order now 0, 6, 7, 2, 5, 3.

## 2026-11-26 · claude/handoff-notify-policy · owner chat: one notification policy, queued for the other account
- Owner posted Turns Out at the 14:00 test slot. design/handoff.md task 6 (right after task 0): design/notify-policy.json as the single source (ready before the slot, nudge, last call, summary), test-window pushes (day N of 7, late, logged), Settings shows the active plan. Order now 0, 6, 2, 5, 3.

## 2026-11-26 13:35 IST · claude/app-projects · other account: projects on the app's board (queued task 5)
- Done: design/projects.json + GET /api/projects (file on main merged with newer `stage.mjs project:<id>` rows; done leaves after 2 days); Today board "Projects" section (stage, line, bar, amber waiting, red + Fix, history on tap); scripts/stage.mjs and /api/stage accept project:<id>; GET /api/stage now shows channel rows only; studio-status.mjs PROJECTS (stuck = 6 h without update); rule in design/runbook-studio.md "Projects on the board".
- Left: the board shows the file's data about 2 min after a merge (cache). Task 3 (3D kit v6) continues; its render 1 is running.
- For the main account: any project you run (not a channel reel) gets an entry in design/projects.json or a `node scripts/stage.mjs project:<id> <stage>` line at each stage.

## 2026-11-26 · claude/handoff-projects-board · owner chat: Projects on the app board, queued for the other account
- design/handoff.md task 5 (before task 3): design/projects.json + Worker read from the repo + a "Projects" section on Today (stage, line, bar, history, Fix), stage.mjs project ids, probe watches stuck projects. Order now 0, 2, 5, 3.

## 2026-11-26 · claude/handoff-code-fixes · owner chat: code fixes go to the other account
- Owner rule: app/tooling code fixes are queued in design/handoff.md for the other account (CLAUDE.md Sessions line). Queued task 4: duplicate reel card (Ready to post + Up next) and the channel slot line. The session started here for it was stopped before any change.

## 2026-11-26 · claude/slot-test-c3-14 · owner chat: Turns Out slot test at 14:00, web 19:00 test kept
- Owner: complete both slot tests (growth validation first) and hold the owner to the times. design/slots.json c3 14:00 (test to 2 Dec), web 19:00 (test to 2 Dec); today's Turns Out postAt 14:00; CLAUDE.md slot line. The owner chat reminds at each slot and checks the post.

## 2026-11-26 · claude/tech-pause-26nov · owner chat: tech paused until the 3D kit v6
- Owner: hold today's tech reel and every tech reel until the 3D kit v6 passes its critic. showreel-tech-tag-sounding hidden (READY, not posted); CLAUDE.md Schedule line TECH PAUSED; probe line corrected to hourly (the scheduler refuses 30-min steps); owner-feedback line. The Daily studio task prompt now builds web only.

## 2026-11-26 · claude/handoff-3d-v6 · owner chat: 3D kit v6 queued for the other account
- design/handoff.md: task 0 (fix the two unmerged 3d-kit branches), task 3 (v6: beats, one entrance per object, per-app wiring beat then cascade, hook first, believable cables, far less glow; kit rules D9-D12, 4 critic questions, a GLOW check; the main account runs the critic). Owner agreed the four adjustments (length, hook, readability, believable not photoreal).

## 2026-11-26 · claude/todo-handoff-readonly · owner chat: critical to-do, read-only handoff account
- design/todo.md P1 CRITICAL: the owner's three questions on running the other account read-only (no commits, kept out of the reel pipeline and app, still heavy lifting). Not acted on yet (owner).
## 2026-11-26 11:49 IST · claude/3d-kit-done · other account: 3D kit finalised, handoff CLOSED
- Done: v5 critic READY (main account, 7.5 / 8 / 8) -> v5 is the tech 3D gold (design/gold.md, scripts/qa/gold.json "tech3d" from the v5 Output QA numbers, app preview plays v5); `node scripts/starter.mjs tech3d <slug>` copies it with the v3-v5 lessons (techkit/README.md); design/3d-kit-phase2.md known limits closed or accepted and DONE; design/rules-tech.md L0 + runbook-daily.md step 3: tech daily builds use the 3D look from the next build on. design/handoff.md is CLOSED.
- Left: gold.json "tech3d" accent hue and share are still v4's (the v5 log does not print them); re-measure with scripts/qa/gold_look.py from the main account, which can fetch the MP4.
- For the main account: the Daily studio task prompt may still name `starter.mjs tech`; the runbook (now `tech3d`) wins. Sessions on the second account cannot reach templates.aquariit.com, so its critics cannot fetch reels.

## 2026-11-26 11:58 IST · claude/minutes-meter · other account: GitHub minutes meter always shows (queued task 2)
- Done: templates/index.html: the meter in Settings no longer hides on an error; it shows "Minutes not counted yet" with the reason (HTTP code, empty or old file) and flags a count over 2 days old; a line says the limit counts only if the repo goes private. The nightly count and the R2 file were fine (9,730 of 2,000 min this month); the page works with that file in a browser test.
- Left: the owner's next look tells which error the live app gets, if any. 3D kit v5: the critic could not fetch the MP4 (this account's environment cannot reach templates.aquariit.com); waits on the owner (design/handoff.md Progress).
- For the other account: sessions on this account cannot fetch reel files or the app; a critic here needs that host allowed plus the REELS_READ_KEY network secret.

## 2026-11-26 · claude/handoff-no-cost · owner chat: handoff account does the tasks and reports, no cost talk
- design/handoff.md: owner rule added (only the written tasks, report each stage, no cost lines or estimates); cost wording and caps removed from the task steps.

## 2026-11-26 · claude/critic-gold3d-sample-v5 · critic: 3D kit sample v5 not judged (fetch refused)
- This critic session could not fetch the v5 MP4 (network refused templates.aquariit.com, 403 policy denial). Review file: v4 verdict kept as "20. CRITIC (v4)"; v5 section notes the six fixes look done on the builder's stills (motion items unchecked), no scores, verdict NOT READY (not judged).
- Next: re-run the critic from a session that has the read key on its network; no 6th render before that verdict.

## 2026-11-26 · claude/handoff-minutes-meter · owner chat: minutes meter fix queued for the other account
- design/handoff.md "Queued task 2": the app's GitHub minutes meter is not showing; the other account finds and fixes it (size S, cap ~$3).

## 2026-11-26 · claude/todo-preflight-all · owner chat: write-up, full check before render 1
- design/todo.md P1 NEXT: preflight-all (cheap local preview + Output QA thresholds + text clear space against everything + review-file lint, gate in review-gate.mjs), size M, $5-8. Waits on the owner's yes.

## 2026-11-26 · claude/critic-owner-26nov · owner chat: today's owner feedback into the critic rules
- design/critic.md: question 47 (text clear space and one alignment per screen, from the owner's Turns Out note) and the verdict line format rule (exact "CRITIC: READY / NOT READY", appended last). The owner's notes are already in design/owner-feedback.md, which every critic reads.

## 2026-11-26 · claude/c3-invite-hold-26nov · owner chat: Turns Out invite withdrawn until render 2
- Owner saw text overlaps in showreel-c3-fix-invite (render 1, critic READY). A NOT READY line (owner) is appended to its review file, so the app shows it as "Found a problem" with no Post now, still visible on the board; the fix session (render 2 + new critic) appends the new verdict.

## 2026-11-26 10:10 IST · claude/3d-kit-v5 · other account: 3D kit sample v5, the six critic fixes (no render yet)
- Done: merged both critic branches (review file holds v3 + v4); scene fixes 1-6 (opening move, hub between apps and wall with all 8 tools whole, push-in pulled back, tangle outside the wall, end turn home + New cable pulse, hub sub-line dropped); stills review/tech/study-25nov/kit-phase2-v5.jpg; techkit/check-gold3d.cjs (no-render name/cover check); scripts/tech-assemble.py now inlines the 3D kit (it did not, so a 3D scene failed locally).
- Left: render 5 only on the owner's yes (design/handoff.md Progress), Output QA, separate critic; then the "finalise the 3D kit" steps if READY.
- Update (owner, 10:20 IST): too much glow; bloom .45 to .28, cable halos and floor light cut by about half (claude/3d-kit-v5-glow).
- Update 10:55 IST: render 5 failed the sound loudness gate (-16.4 LUFS; the mux loop stopped on a safe peak without checking loudness). techkit/make.py now loops on both and has a gain step; owner rule: a failed render goes straight to the next one, a passed render that the critic sends back waits for the owner.
- For the other account: a comment pasted before code on one line silently drops that code (the hub was missing from the scene for a while); the stills caught it, the box check did not.

## 2026-11-26 · claude/handoff-3d-kit-final · owner chat: the other account also finalises the 3D kit
- design/handoff.md: after a READY v5, the same session makes it the tech 3D gold, updates the starter, closes the known limits, switches tech daily builds to the 3D look, then closes the handoff (cap ~$15 more, owner asked first past it).

## 2026-11-26 · claude/handoff-3d-kit-v5 · owner chat: 3D kit v5 handed to another account
- design/handoff.md reopened for one task (owner): the 3D tech look sample v5 (six critic fixes, render 5 only on the owner's yes). The other account's session writes each stage in its Progress section; the owner chat reads it there. The blocked 3D kit session is archived once that session starts.

## 2026-11-26 07:15 IST · claude/source-url-26nov · owner chat: morning builders stalled (no repo)
- The 04:49 daily run made the web and tech builders without source_url, so they had no repo, add_repo was refused, and both stalled; the 05:11 Turns Out task produced nothing. Owner chat restarted all three at 07:12 with the repo. runbook-daily.md now requires source_url on every child session; the Turns Out task prompt was updated (source_url, outside stills check, no skip days). The Daily studio task prompt still says "dark look with one accent" (stale) and can only be changed from the launcher conversation; runbook and rules-tech.md section L win.

## 2026-11-25 23:45 IST · claude/owner-chat-25nov-late · owner chat: tech not posted, colour, reference method
- Owner did not post tech battery-cycles (dated iPhone 14/15 framing, India line, top keyword bar, flat shots). Tech rules changed (all global, last-7-days tech news, freshness, no top bar, every shot alive; merged).
- Owner: tech reels are not colour rich. Cause: design/tech-direction.md (22 Nov) near-black ground, white/grey, two accents max. Under review.
- Approved (~$16): reference study of the owner's profile (adilet.fndr), owner uploads 4-5 reels to the app's References; full end-to-end measured style sheet, one test scene side by side with reference frames, owner sees that one comparison before tech adopts it. Waiting on owner: the uploads.

## 2026-11-25 20:45 IST · claude/tech-global-news-rules · tech rules: all global, fresh news, no top bar, every shot alive
- Done: rules-tech.md (F2 now all global, indiapick retired, new N1-N4), critic.md question 45, runbook-daily.md tech research line, topic-bank.md tech options marked STALE, CLAUDE.md tech line, owner-feedback.md 5 lines (25 Nov).
- Not done: scripts/check.mjs still lists indiapick as an allowed format (harmless; no script change in this size-S job).
- Left: tomorrow's tech pick comes from fresh 7-day news research, not the topic bank.


## 2026-11-25 20:15 IST · claude/owner-chat-25nov · owner chat: decisions, waiting on owner, tomorrow
- Day: all three posted-ready after a rescue. Web 47 user-invalid READY 09:30 (19:00). Turns Out looks-expensive failed critic on render 2, fixed and READY on render 3 (19:45, ~$15). Tech battery-cycles failed critic on render 2 (one battery all reel); rebuilt to 7 shots, outside stills check, render 3 failed EDGES+SYNC, render 4 (owner yes) READY 7.5/7.5/7.5 (20:45, ~$24 + morning $32).
- Decisions (owner, 25 Nov): NO SKIP DAYS; ask the owner before anything costly (>~$5, any render past 2, any side/tooling job), with a cost estimate; Turns Out gets an outside stills check; stage updates to the owner unasked; smaller morning run (all in CLAUDE.md + runbooks, merged). App fix: the board read only "Critic ... CRITIC:" lines, so "20. CRITIC: READY" reels stayed on Checking and out of Ready to post (fixed).
- What went wrong (owner's gap list): owner chat idle 08:30-16:40 while two reels failed at 09:30; stills checks approve dull ideas; SHOT VARIETY passed a one-battery reel (check measures the wrong thing, still to fix); render 1 spent on mechanical faults (pace, hue, fill, review-file lines) that a local preflight could catch; tech failed 4 days running on one object all reel; Turns Out self-approved stills.
- Cost: about $83 by 09:45 for 1 reel, plus ~$45 for the evening rescue and rules. Big context sessions cost ~$2 per wake-up; tech builder alone $17.
- Waiting on owner: STAGE_KEY (GitHub secret + network secret X-Stage-Key for templates.aquariit.com) so the board shows stage lines; Post now keys (GH_DISPATCH_TOKEN, Instagram publish tokens).
- Tomorrow: confirm all three posted from the Instagram collect; propose (with cost) the SHOT VARIETY check fix and a local preflight for pace/hue/fill/edges/review lines before render 1; tech builds start from today's 7-shot battery reel, not the one-object starter; small bits for the kit: phone 80% under the caption (tech 14-16 s), off-centre badge in the Turns Out flashback.

## 2026-11-25 17:30 IST · claude/fix-critic-line-25nov · owner chat: app showed a READY reel as "Checking"
- Done: src/journey.js read only "Critic ... CRITIC: READY" lines; critics write "20. CRITIC: READY", so web 47 (and 46 yesterday) stayed on Checking and out of Ready to post, and Post now would refuse it. The parser now takes both forms (tested on today's three review files: READY, NOT READY, NOT READY).
- For every session: after any review-file format change, check the app's Today board shows the verdict.

## 2026-11-25 · claude/no-skip-days · owner decisions written into the rules (size S, text only)
- Done: no skip days, ask before costly (over about $5, render past 2, side jobs), Turns Out outside stills check, unasked stage updates, smaller morning run. In CLAUDE.md (lean), runbook-daily, runbook-reels, runbook-studio, critic, c3-plan; four lines in owner-feedback.
- Left: scripts/stage.mjs still accepts a "skipped" stage (unused now); scheduled tasks untouched, so the 06:47 task prompt is unchanged (it follows runbook-daily.md).

## 2026-11-25 · claude/style-records · merged main into the style-records branch
- Done: kept both log entries and main's captions.json flags (c3-resume onGo, no date); added the branch's style fields; check passes.

## 2026-11-25 01:25 IST · claude/c3-cv-already-posted · owner chat: Turns Out CV was already posted
- Done: showreel-c3-resume loses its 25 Nov date (the owner posted the CV reel days ago; resume2 was a rebuild of a posted reel, my mistake). c3-plan section 0: only unposted reels are built; 25 Nov Turns Out = #2 looks-expensive, rebuilt on the improved kit by the 05:11 task.
- Tech 25 Nov: storage-gap render 2 failed 3 small checks; owner said no third render; the 04:47 run builds today's tech reel on the new flow.

## 2026-11-25 · claude/style-records · Reel style records (owner chat job, size M, part 1)
- Done: every posted web, tech and Turns Out reel of 25 Oct-24 Nov (81) now has a "style" object in captions.json (lengthS, wordsPerS, shotChanges, hookType, look, hero, firstSecondTension, payoff, source). 33 are measured from the real MP4 (the last 15 days; older MP4s are gone), 49 from config and spoken text only; unknown = null. scripts/style-measure.mjs does it (shot changes = frame-difference jumps, look = mean light). npm run check now requires the fields on any visible reel from 25 Nov (planned values with the entry, the three numbers filled by the post day). design/what-works.md has the Style record method for the Sunday review; design/runbook-spare.md points to it.
- Left: hero is only known for tech (its gadget) and the 25 Nov Turns Out reel; firstSecondTension is null for all older reels (a human call, not guessed). Slow camera moves in 3D reels can read 0 shot changes, so compare shotChanges inside one channel only.
- For the other account: a new reel's entry must carry style (hookType, look, hero, firstSecondTension, payoff) the day it is added, or npm run check fails.

## 2026-11-25 · claude/fable-decides · "Fable decides" daily flow + plain audit card (owner chat job, size M, part 2)
- Done: design/runbook-daily.md: the 8-step build flow for web and tech with the exact create_session settings (Fable claude-fable-5-2 for pick, stills check, critic; Sonnet claude-sonnet-5-5 for research and build; Opus claude-opus-5-5 as the fallback), the 25 Nov note (tech storage-gap READY = web only; NOT READY = fresh tech reel today), the rejection watch (8 of 10 rejected two days running = research to Opus); the audit card rewritten to at most 6 plain lines with one example. scripts/pick-sheet.mjs (the day's options on one sheet; --log counts rejects), design/pick-log.md. CLAUDE.md: Fable budget names the two short calls.
- Left: part 1 (style records in captions.json, check requirement, what-works method) follows in claude/reel-style-records. The app's Today header still reads "OK/ALARM <channel>" lines to show its status; the plain card no longer carries them, so that header shows only the time and changes until the app is changed to read something else.
- For the owner: nothing to paste. The daily task prompt already says to follow runbook-daily.md exactly, and the runbook now starts the Fable and Sonnet sessions itself.

## 2026-11-24 · claude/what-works-24nov · What works + posting slots from real numbers (owner chat job, size M)
- Done: design/what-works.md (per channel, top 5 vs bottom 5, do more / stop doing; weak evidence marked) and design/posting-slots.md. Data: one read-only dry collect (up to 50 posts per account). Strongest: web = fixes visible at a glance (Nov top 5 median 2,753 vs bottom 867); tech = gadget "worth it" questions (median 119 before 15 Nov, 1,206 since) with ~0 saves; Turns Out = 8 reels, too thin. Skip in 3 s (last 7 only) separates hits from misses on all channels.
- Slots: online_followers returns no rows for all three accounts, so the slots (tech 15:00, Turns Out 17:00, web 19:00) are from post time vs reach, low confidence.
- Left: length, pace, look and hero object are not stored per reel; add duration and a look tag to captions.json to rank them next time. Instagram gives no follows per reel.

## 2026-11-24 23:55 IST · claude/topic-bank-24nov · topic bank for 25-27 Nov (Sonnet research, Fable only picks)
- Done: design/topic-bank.md: web 15 options (25, 26, 27 Nov), tech 10 (26, 27 Nov; 25 Nov skipped), each with hook, the one lesson, 2 facts with URLs, gold-look fit, a prop and the 2 picks per day. Web facts read in MDN's page source and browser-compat-data; tech facts read on apple.com, support.apple.com and developer.android.com (the only maker hosts reachable from here).
- Not done: the CV critic verdict was NOT written into the review file; the write was blocked (it needs the critic's own session to write it, not a copy). Turns Out's task on 25 Nov re-checks and records it.
- Left: weak options are marked in the file (popover, inert and the T27 options need a support or footnote re-read the morning of the build).

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

## 2026-11-25 · claude/slots-config · Posting slots in one file (owner chat job, size L, part 1 of 5)
- Done: design/slots.json (tech 15:00, Turns Out 17:00, web 19:00 IST; web is a one-week test, review 2 Dec). The Worker takes channel defaults from it (reels without a postAt), GET /api/slots gives it to the app, the app's slotOf and the board cards show "Posts at HH:MM IST". scripts/check.mjs validates the file (13:00-21:00). One line each in CLAUDE.md "Schedule" and design/runbook-reels.md "Scheduling". sw.js v29.
- Left: nothing for the owner. Existing captions.json entries are untouched; builders use the file for new ones.
- For the other account: new entries take postAt from design/slots.json, not 13:00.

## 2026-11-25 · claude/notifications · Notifications per type (owner chat job, size L, part 2 of 5)
- Done: src/notify.js (the plan) + Worker: ready at the slot, one nudge at +45 min, one last call 20:30 IST, "Posted ✓" with the link and the plain reason on a failure (from Post now), a 08:00 IST morning summary; cron `*/10 * * * *`; one switch per type in Settings (/api/push/prefs, D1 push_prefs; notif_log keys stop repeats). sw.js v30 (an Instagram link opens on its own). scripts/qa/notify-test.mjs is in npm run check. The old 10-minutes-before reminder (postPush) is removed.
- Left: nothing for the owner; pushes need the device signed up as before. Real pushes have not been seen on a phone yet (the plan and switches are tested, the send path is the existing one).
- For the other account: a reel gets "ready" only when the journey says the second look cleared it.

## 2026-11-25 · claude/ai-label · AI label per reel (owner chat job, size L, part 3 of 5)
- Done: "aiLabel" true/false in captions.json (required from 27 Nov, check.mjs); shown on the reel card and the Post now confirm sheet; scripts/ig-publish.mjs sends is_ai_generated=true when it is true (Meta changelog, 22 Jun 2026) and stops with a plain message if Instagram refuses it; critic item 0b (design/critic.md); runbook-reels "AI label" (YouTube containsSyntheticMedia reserved). sw.js v31.
- Left: the parameter has not been tried on a real post (Post now is still off); the first real post will show it. Builders set aiLabel on new entries from 26 Nov (enforced from 27 Nov).
- For the other account: existing entries are untouched; no aiLabel yet shows "not decided yet" on the card.

## 2026-11-24 · claude/storage-gap-fix3 · Tech reel for 25 Nov: storage-gap, NOT READY (owner chat job, size L)
- Done: a new tech reel "A 256 GB phone can show 238" (Apple Support source), built twice: the first version reused ai-memory's phone and was rebuilt with its own props (retail box and ruler, 256-tile wall, three tiered boxes, a storage chip under a lens, a Storage card); direction card (review/tech/showreel-tech-storage-gap.direction.md) with two independent stills checks (the second APPROVED: as rich as ai-memory YES, not a copy YES); starter-rule line added to design/gold.md and design/direction.md. Render 2 (run 45467259029) failed Output QA: NUMBERS (rolling counts), SYNC (931 not readable), EDGES (1 TB box on both sides 18.4-20.2 s), plus a back-of-box grey slab at 26 s. The owner said no third render, so the reel stays hidden with no post day.
- For the 04:47 daily run: storage-gap does NOT cover 25 Nov; build the day's tech reel on the new flow. The ready fix (no rolling numbers, a whole 1 TB box, the box turning from its side) is on branch claude/storage-gap-fix3 and the review file's "Status after render 2" lists every finding; reuse the idea only with one render and a critic.
- Left: nothing for the owner.
- For the other account: a rolling counter fails NUMBERS even when it lands on the spoken word under a second; let an object do the counting or switch straight to the value.

## 2026-11-25 · claude/scorecard · Weekly scorecard on Growth (owner chat job, size L, part 4 of 5)
- Done: "This week" cards at the top of Growth (All channels): per channel, the last 7 days vs the 7 before: reach per reel, watched on average, saves per 1,000, new followers, critic's average score, changes kept or dropped; "not measured yet" where missing. src/journey.js reads the PREMIUM numbers from a review file's critic line (score per reel); kept/dropped counts read "verdict" inside a captions.json experiment. runbook-reels "Weekly scorecard". sw.js v32.
- Left: critic score and kept/dropped show "not measured yet" until the critic writes PREMIUM numbers on its line and the daily run writes experiment verdicts (design/runbook-daily.md was off limits tonight: add one line there). Hold % and per-reel follows are not available from Instagram.
- For the other account: put `"verdict": "keep"|"drop"` in the experiment object when the 72 h verdict is decided.



## 2026-11-25 · claude/plain-words · Plain words on every screen (owner chat job, size L, part 5 of 5)
- Done: pw() in templates/index.html turns codes from the server, review files and the daily report into plain words (video checks, below target, the rule, ...) and is applied to status reasons, Needs you, audit cards, collector alerts; the daily report line says "on target / below target"; Post now's "not switched on" and "key refused" messages and the collector fix lines no longer name secrets or menus (the access-key fix still names the secret to update). scripts/qa/plain-words-test.mjs is in npm run check. sw.js v33.
- Left: Claude replies and the owner's own words are shown as written (not filtered).
- For the other account: write plainly in review files, asks and cards; pw() is a net.

## 2026-11-25 · claude/daily-25nov · Daily run: audit, picks, rulebooks (daily studio run)
- Done: Owner answers read (nothing new); audit card sent (web and tech changes in plain words); Fable picked web W25-2 (:user-invalid, then W25-1, W25-5) and tech T26-1 (battery cycles, then T26-4, T26-3), logged in design/pick-log.md; sources re-read this morning (MDN field-sizing, :user-invalid, scroll-snap-stop; Apple battery page): same. Rulebook and playbook lines for the audit's PROMOTE/DROP/ESCALATE; one lesson line in experiments.md.
- Builds: tech reel battery-cycles and web reel user-invalid are built by their own build sessions (branches claude/tech-battery-cycles, claude/web-user-invalid); each writes its own entry.
- Left: nothing for the owner.
- For the other account: a Fable session started without source_url has no repo checkout; always pass the repo URL to create_session.

## 2026-11-25 · claude/c3-looks-expensive-25nov · Turns Out reel "One looks 5x pricier" rebuilt (Turns Out daily build)
- Done: showreel-c3-looks-expensive rebuilt from the gold Turns Out reel (starter): a crowded honey label fixed in three moves (room, a small spaced name, two colours), seven spoken sentences with breaths, direction card and review file written, captions entry kept hidden until the critic says READY. The old A/B scene is no longer built (COPIES entry removed).
- Left: render, Output QA, critic; then postOn 2026-11-25, postAt 17:00.
- For the other account: the 05:11 run lost its work because it had no repo access; always pass the repo URL to create_session.

## 2026-11-25 · claude/web-user-invalid · Web reel for 25 Nov: user-invalid, built to the stills check (web build session)
- Done: showreel-47-user-invalid ("Why is it red before typing?", :user-invalid; MDN and BCD re-read 25 Nov): a sign-up form whose three fields are lit red like warning lamps from frame 0, RED FIELDS 3 and TYPED 0 under them, the lamps flaring at 0.25 s and 1.45 s; the fix card (input:user-invalid), the lamps go dark on the spoken "user invalid" (3 -> 0), then name, email and age are tapped and only the email lights red once the finger has left it with "ada@"; the last 0.45 s reload the page into frame 0 (loop). New hue (navy fields, blue accent, 225), direction card, review file, stills sheet, captions entry (postAt 19:00), tip demo, demo-hues line.
- Left: the Fable stills check (APPROVED line in the direction card), then one render, Output QA, critic, style-measure.
- For the other account: a red demo fails Output QA HUE (red is within 40 deg of 25 and 315); put a base hue under it. KM.mixCol returns rgb(), so chain hex mixes with your own helper.

## 2026-11-25 · claude/web-user-invalid-3 · Web reel 47 render 1 failed Output QA (PACE, HUE); fixed for render 2 (web build session)
- Done: render 1 (run 45535361039): PACE 4.60 words/s on the last sentence and HUE 355 (red won against a thin navy); everything else passed. Last line shortened to "Now red waits until you leave.", fields brighter navy, red glow and counter fill lighter (blue 2.1x red locally). Render 2 dispatched from main after the merge.
- Left: render 2, Output QA, critic, style-measure.
- For the other account: a render can read HUE differently from the local frames; leave blue at 2x the red weight, not 1.1x.

## 2026-11-25 · claude/c3-looks-expensive-25nov-d · Turns Out "One looks 5x pricier": render 2 passed Output QA (Turns Out daily build)
- Done: render 1 failed Output QA (the label alone was a small centred picture; 4 s with nothing new at the end). Rulers back, reel cut to 19.5 s; render 2 passed Output QA. Critic session started (claude-opus-5-5, tags critic and c3).
- Left: the critic's verdict; on READY the reel gets postOn 2026-11-25, postAt 17:00 and loses "hidden" and "hold".
- For the other account: the review gate wants real evidence text on items 3 and 7 (the preflight "fits" line); a plain "SAFE ZONE: ok" is refused as a template line.

## 2026-11-25 · claude/web-user-invalid-4 · Web reel 47 render 2 passed Output QA (web build session)
- Done: render 2 (run 45538594185) succeeded, so Output QA passed; the MP4 is fetched, the style record measured (15 s, 2.27 words/s, 0 shot changes), review item 13 written. Two renders used.
- Left: the critic (a different session), then post at 19:00 IST. Listen to the hook word: the voice check heard "red" as "read".
- For the other account: style-measure.mjs needs --from and --to for today's date, and it nulls hero and firstSecondTension; put them back.

## 2026-11-25 · claude/critic-user-invalid · Web reel 47 critic: READY (critic session)
- Done: the final render judged on its real frames (every 0.25 s at phone size), its sound levels and the sheet against the gold reel; CRITIC: READY, PREMIUM 7.5 / 7.5 / 7.5, GOLD matches, STOP 7.5, REWATCH 7 written in the review file.
- Left: post at 19:00 IST. Optional, no render: a cover at 0.75 s (the 1.39 s one has the touch dot on the name), form-specific hashtags.
- For the next web reel: ENHANCE line (dimmer placeholders, the first tap on empty space).

## 2026-11-25 · claude/critic-c3-looks-expensive-25nov · Turns Out "One looks 5x pricier" critic: NOT READY (critic session)
- Done: judged render 2 (run 45535868004) on the real MP4 next to the gold reel (side-by-side sheet) and one 9.5-14 s strip; verdict and PREMIUM line in review/c3/showreel-c3-looks-expensive.md. The finished label looks empty (tiny name, unreadable second line, honey type and weight deleted), below gold; at 13.5-14 s the before flashback covers the "Same product" chip and clips its badge. Voice not heard (no playback here); loudness -14.0 LUFS with six breath dips.
- Left: two renders used, so the reel is skipped today and stays hidden; captions.json, scene and config untouched. A rebuild keeps the product line in a quiet second size, a larger spaced name and one detail in the second colour, and sets aiLabel false.
- For the other account: "give it room" must not become "delete everything"; the after of a design fix must still be a complete, real label.

## 2026-11-25 · claude/tech-battery-cycles-5 · Tech reel for 25 Nov: battery-cycles, Output QA PASS, waiting for the critic (daily build)
- Done: "Your phone battery has a number of lives" (Apple Support: 500 cycles for iPhone 14 and earlier, 1000 for iPhone 15, 80% design target under ideal conditions; a cycle = using 100% in total). Hero is its own object: a pouch battery cell opened like an x-ray with a tally of 500 then 1000 marks scratched into its glass (drawn live from t, no rolling counter). Direction card, two stills checks (first REDO with six fixes, second APPROVED), 2 renders: render 1 failed only SYNC (amber "80%" unreadable to OCR; the speech recogniser does not hear "1000"); render 2 (run 45538181782) all Output QA PASS. Style record measured from the MP4 (34.4 s, 12 shot changes).
- Left: the independent critic (started by the parent session) must write CRITIC: READY / NOT READY and the PREMIUM line in review/tech/showreel-tech-battery-cycles.md. Notes for the critic: check "500" after 80%, the struck-through DEADLINE and the tally wiping for the loop on the MP4.
- For the other account: hex colours in the three.js kit are linear (a near-black hex reads steel blue; use 0x010203); additive layers need toneMapped:false or they wash to white; no lit floor (its soft-box reflection was a grey slab); amber text on dark is not read by the text recogniser (SYNC), use white for a number that is in the SYNC list; make.py --stills runs 15-25 min locally.

## 2026-11-25 · claude/critic-battery-cycles · Tech battery-cycles critic: NOT READY (critic session)
- Done: judged render 2 on the real MP4 (every 0.25 s at phone size, a 0.1 s strip of the DEADLINE moment, the side-by-side sheet against the gold reel, loudness -14.5 LUFS); verdict, GOLD below, STOP 5, REWATCH 5 and PREMIUM 6.5 / 6.5 / 6 in review/tech/showreel-tech-battery-cycles.md; critic.md question 45. One battery cell in the same place for about 25 of 34 s, frame 0 has no word and the tally reads as a texture, the strike through DEADLINE stops after the "D" (25.7 s), "100%" fades across the cell at 10.0-10.3 s. Voice not heard (no playback here).
- Left: two renders used, so the reel is skipped today; captions.json, scene and config untouched (the builder or the daily run marks the entry hidden). Facts, post text, hashtags, cover time and aiLabel were fine.
- For the other account: a new camera angle on the same object is not a new shot to a viewer; shot variety can pass while every still shows the same thing. Give each idea its own picture.

## 2026-11-25 · claude/daily-25nov-fixes · Daily run result: web READY, tech skipped (daily studio run)
- Done: web Nº 47 "Why is it red before typing?" (:user-invalid) passed Output QA on render 2 and the critic wrote READY (PREMIUM 7.5 / 7.5 / 7.5); posts 19:00 IST. Hashtags swapped to form-specific ones (critic note). Tech "battery-cycles" passed Output QA on render 2 but the critic wrote NOT READY (PREMIUM 6.5 / 6.5 / 6: one cell in one place for ~25 of 34 s, a dull first second, a strike-through that stops after "D"); both renders used, so it is hidden and skipped for 25 Nov (captions.json "hidden": true).
- Process: the Fable pick, the stills checks (two for tech, one for web) and both critics ran as child sessions; builders cannot start sessions, so the parent starts them. A branch merged by the pipeline is deleted: later work needs a new branch from main.
- Left: web cover still the automatic 1.39 s frame (the critic prefers 0.75 s; fix via Actions -> R2 -> cover). Tech lesson for the next tech build: one hero object in one place cannot match gold's seven worlds; give every shot its own place (design/direction.md "Tech: the defaults to avoid").
- For the other account: run the stills check on the FIRST sheet only after frame 0 and the opening second are on it; the checker missed the dull first second and the flat middle that the critic caught on the MP4.

## 2026-11-25 · claude/tech-battery-cycles-rescue · Tech battery-cycles rescue: new pictures, render 3 (rescue session)
- Done: after the critic's NOT READY, the scene now has seven different pictures (tally macro with "500" on screen at frame 0, cycle ring, phone battery screen, two phones 500 vs 1000, target and dart, phone charging on a pad, health screen) and the DEADLINE strike has time to cross the whole word. postAt 20:30, still hidden until the critic says READY. Render 3 allowed by the owner for today only.
- Left: render 3 on GitHub, Output QA, then the independent critic (started by the owner chat).
- For the other account: a battery-shaped hero in every shot reads as one picture; give each idea its own object (phone, target, pad). Keep screen numbers above the caption band at y 1448.
## 2026-11-25 · claude/c3-looks-expensive-fix · Turns Out "One looks 5x pricier": critic fix for render 3 (builder session)
- Done: finished label now keeps the honey line and 500 g in a quiet size, a bigger spaced name, a green frame and rule; the BEFORE flashback is smaller and sits under the "Same product" chip (the stray line was the rule copied into the BEFORE picture). captions.json: postOn 25 Nov, postAt 19:45, aiLabel false, hidden until READY.
- Left: render 3 on GitHub, Output QA, then the independent critic (started by the owner chat).
- For the other account: elements added inside the board are copied into the BEFORE picture; hide them (display none) at the first seek.
- Gate: render 3 stopped at the review gate (items 14-17 need their FLOW lines once postOn is set); lines pasted, no frames were rendered, so the render count is unchanged.

## 2026-11-25 · claude/tech-battery-cycles-r3-qa · Tech battery-cycles render 4: edge and "500" fixes (rescue session)
- Done: render 3 failed Output QA on EDGES (cell, target ticks and charging pad touched the side edges) and SYNC (the "500" over the cell tabs was not read). Cell pulled back, "500" on clear dark, target and pad scaled in. Render 4 allowed by the owner; postAt 20:45.
- Left: render 4 result, then the critic.
- For the other account: keep every hero 3 to 8 percent inside the side edges (EDGES counts the outer 2%); a number over a light part of the object is not read by the recogniser.
## 2026-11-25 · claude/critic-c3-looks-expensive-r3 · Turns Out "One looks 5x pricier" critic, render 3: READY (critic session)
- Done: judged render 3 on the real MP4 (one contact sheet beside the gold reel, a full-size look at 18.3 s, a 0.1 s strip of the flashback); verdict, GOLD matches, STOP 7, REWATCH 7 and PREMIUM 7 / 7 / 7 in review/c3/showreel-c3-looks-expensive.md. The finished label is complete (bigger name, honey line and 500 g kept, green frame); the BEFORE flashback sits below the chip, whole, no stray line. captions.json: "hidden" and "hold" removed; posts 25 Nov 19:45 IST.
- Left: in the flashback copy the badge words "100% NATURAL" sit high-left and lose a letter for 0.6 s (13.1-13.7 s); fix in core.js DT.proof (scale the badge words with the badge) before the next design reel. No render for this. Voice not heard (no audio playback in the session).
- For the other account: a scaled copy of the board (DT.proof fs) does not scale text that is positioned in px inside a child; check badges and seals in the copy on a still.
## 2026-11-25 · claude/battery-cycles-critic-r4 · Tech battery-cycles critic, render 4: READY (critic session)
- Done: judged render 4 on the real MP4 (one contact sheet, frame 0 at phone size, a 0.125 s strip of the DEADLINE strike); verdict READY with PREMIUM 7.5 / 7.5 / 7.5 in review/tech/showreel-tech-battery-cycles.md. Seven different pictures, a big "500" at frame 0, the strike crosses the whole word, nothing touches the edges. captions.json: "hidden" removed, posts 25 Nov 20:45.
- Left: 14-16 s the phone's own "80%" sits dimmed under the caption line (not worth a render); keep screen numbers above the caption band on the next tech build. Voice not heard; no new side-by-side sheet with the gold reel (lean run).
- For the other account: nothing new.

## 2026-11-25 · claude/3d-kit-quality-test · 3D kit quality test: scene, stills, timings (owner-approved side job, cap $15)
- Done: hidden sample techkit/scenes/test-3d-quality.html (glossy purple block, invented tile, green chip drop, orange cable, orbit; flags window.FX switch each technique), local bench techkit/3dtest-bench.cjs, one-off workflow test-3d.yml, stills review/tech/study-25nov/3d-test.jpg. Findings in design/3d-kit-test.md.
- Left: the one preview render result (see the note) and the owner chat verdict.
- For the other account: the clear colour is written as-is on screen but encoded in a post pass: linearise it or the background turns grey.
## 2026-11-25 · claude/tech-colour-world-rules · Tech colour world look: rules, logo permission, test scene (builder session)
- Done: rules-tech.md section L and tech-direction.md section 7 replace the near-black + two-accent look and the top keyword band (dark ground, colourful materials, one world with recurring objects, real artifacts, word-by-word captions with a blue selection box); real product logos allowed on tech and web (safety.md 7, CLAUDE.md); owner-feedback lines; references.md entry. Test scene techkit/scenes/sample-colour-world.html (sample + hidden in captions.json), ONE preview render.
- Left: owner chat decides whether the look is adopted for the daily tech builds; real logos need a licensed file via the Media workflow; gold.md still describes the old look.
- For the other account: a cables-and-tiles scene reads best with the camera 14+ units back; hex colours need to be darker than they look (exposure .85) or blocks wash to pastel.

## 2026-11-25 · claude/tech-3d-kit-phase1 · 3D kit phase 1: world, shadows, cable, DOF, layout, captions (owner-approved side job, phase 1 cap ~$30)
- Done: techkit/world3d.js (W3D.stage / world / contactShadow / cable / place / check / clearOf / captions), make.py marker `<!--WORLD3D-->`, hidden 7 s demo techkit/scenes/kit3d-phase1-demo.html, scripts/3dkit-assemble.py, workflow kit3d-phase1.yml for the one preview render, stills review/tech/study-25nov/kit-phase1.jpg, notes design/3d-kit-phase1.md.
- Left: the one preview render (run the workflow after merge), then the owner chat's go for phase 2 (object library, camera path, starter, README, 20 s sample).
- For the other account: nothing new.

## 2026-11-25 · claude/tech-colour-world-render · Colour world sample: voice job failed on a missing "final" cue (builder session)
- Done: the first preview run stopped in the voice job (sound.py needs a "final" cue; no frames were rendered, so no render was used). Added the cue to techreel/topics/colour-world-sample.json.
- Left: dispatch the one preview render after this merges, then the 2x4 grid in review/tech/study-25nov/.
- For the other account: every kit topic needs a "final" cue (sound.py reads it); copy it from the starter.

## 2026-11-25 · claude/3d-kit-test-result · 3D kit test: runner timings and join fix
- Done: first Test 3D quality run rendered all 240 frames on GitHub (93-141 s per 40-frame part); the join step failed only for a missing ffmpeg; added the install and filled the runner numbers into design/3d-kit-test.md. Re-dispatching once for the MP4.
- Left: the MP4 artifact (7 days) and the owner chat verdict.
- For the other account: a workflow dispatched by name must be on main first; the branch pipeline merges it. The frames step is the only costly part.

## 2026-11-25 · claude/tech-3d-kit-phase1-findings · 3D kit phase 1: fold in the test-render findings (same side job)
- Done: full-length cable halo, stronger default depth of field, details and a second material on the demo block; stills kit-phase1-v2.jpg; notes in design/3d-kit-phase1.md.
- Left: the first preview render (older look) is already running; a second preview of this look needs the owner chat's yes; getting the MP4 into the app needs an upload step.
- For the other account: nothing new.

## 2026-11-25 · claude/tech-3d-kit-phase1-store · 3D kit phase 1: preview workflow fixed, upload to the app (same side job)
- Done: the first preview run failed at the join (no ffmpeg on the runner; the frames were fine); the join now installs ffmpeg and a new store job puts the MP4 and stills in R2 under study/showreel-pv-tech-kit3d-phase1-preview*; previews.json entry (needsOwner false, Studio log "Watch"). An earlier push of this conflicted after the squash merge, so it was redone from main.
- Left: run the workflow once on main for the new look; the owner chat gets the stills path and how to open the video.
- For the other account: nothing new.

## 2026-11-25 · claude/tech-colour-world-grid · Colour world preview render and 2x4 grid (builder session)
- Done: the one preview render of the sample (11.5 s) finished; Output QA FAILs only COLOUR and LOOK-vs-gold, which measure the old grey look. grid.png (8 frames) and notes in review/tech/study-25nov/.
- Left: owner chat decides whether to adopt the colour look; if yes, re-baseline COLOUR and LOOK in scripts/qa (gold.json) before any daily tech reel is built on it.
- For the other account: a preview run that fails Output QA still keeps its MP4 in R2 study/ (readable with the session's key at /reels/study/).

## 2026-11-26 · claude/tech-3d-kit-phase2 · 3D kit phase 2: library, camera path, starter, 20 s sample, QA look key (owner-approved side job, cap ~$40)
- Done: techkit/lib3d.js (appTile with logo slot, phone, laptop, chip, rack, productBlock, codeCard, dialog, 3D number figures, camPath), world3d.js fixes (neutral ground, DOF sparkle clamp, caption padding, cable reveal), gold3d-sample scene + topic (never posted), starter `tech3d`, techkit/README.md, design/3d-kit-phase2.md, design/gold.md candidate section, Output QA key `"look": "3d"` (gold.json "tech3d" entry to be filled from the real MP4).
- Left: render the sample on GitHub (Tech reel, preview), measure its LOOK numbers into gold.json "tech3d", critic session for READY.
- For the other account: nothing new.
- Update (same session): the owner chat's review of the first stills is folded in (fuller opening, tall tool wall with labels inside the tiles, hub raised, nothing cut at the edges, crisper numbers); kit-phase2.jpg replaced.

## 2026-11-26 · claude/tech-3d-kit-phase2-result · 3D kit sample rendered, LOOK gold measured, app entry (same side job)
- Done: sample render v1 passed Output QA (13.8 s; runner time about 12 min wall); gold.json "tech3d" LOOK numbers measured from that MP4; previews.json entry "3D kit sample reel" (Studio log, Watch); gold.md note.
- Left: the owner chat decides on a longer 20 s version (two more voice lines) and whether the critic session runs on it; HERO has no subject box (kit scenes report one with __subject; the 3D scene does not yet).
- For the other account: nothing new.

## 2026-11-26 · claude/tech-3d-kit-sample-20s · 3D kit sample extended to about 20 s (owner chat: two more voice lines)
- Done: six voice lines (new: "Each app and each tool talks to the hub once." and "A new tool is one more cable, not three."), hub cables brighten on "talks", a new tile plus ONE cable on "new", camera keys for both; stills review/tech/study-25nov/kit-phase2-20s.jpg (the six stills fixes from the owner chat are in it).
- Left: render once (Tech reel, gold3d-sample, preview v2), then the independent critic (opus, tag critic).
- For the other account: nothing new.

## 2026-11-26 · claude/tech-3d-kit-sample-pace · 3D kit sample: shorten the fast voice line (owner's yes for render 3)
- Done: render v2 (21 s) passed every Output QA check except PACE (one line at 4.63 words/s, limit 4.5); the line is now "Everything talks to the hub once." (6 words, key word "hub").
- Left: render 3 (preview v3), Output QA, the independent critic (opus, tag critic), the app list entry for the final video.
- For the other account: a 10-word line over 4.5 words/s fails PACE; keep lines to 6-9 words.

## 2026-11-26 · claude/tech-3d-kit-sample-final · 3D kit sample v3 passed Output QA; app entry and gold numbers (same side job)
- Done: render v3 (18.4 s) Output QA PASS; previews.json "3D kit sample reel" now points at v3; gold.json "tech3d" LOOK numbers measured from the v3 MP4; gold.md note. Runner time about 17 min wall for 6 parts.
- Left: the independent critic's verdict (review/tech/showreel-tech-gold3d-sample.md, "20. CRITIC: READY / NOT READY"); then the owner decides whether it becomes the gold for this look.
- For the other account: nothing new.

## 2026-11-26 · claude/daily-25nov · Daily studio run 26 Nov (smaller morning run)
- Done: Feedback read (none new) and owner answers (none); audit numbers read from a dry Instagram collect; rules-tech.md 26 Nov audit line; experiments.md lesson line; started one build session each for web (:has, the researcher's pick) and tech (fresh-news research first, old bank is stale).
- Left: both builders own their reel to READY (Fable pick, stills check, at most 2 renders, Output QA, critic). The audit card was dispatched from the numbers above.
- For the other account: the Instagram collect's scheduled run skips the audit step except at 05:23 and 20:14 UTC; a dry dispatch prints it.

## 2026-11-26 · claude/web-26nov-has-parent · Web reel 48 has-parent (W26-1 CSS :has parent selector): build, direction card, review file, stills (pending stills check)
- Done: Fable pick (KEEP W26-1 W26-3 W26-5, rejected W26-2 W26-4; design/pick-log.md), sources re-checked (MDN :has(), BCD: Chrome 105, Firefox 121, Safari 15.4), scene scripts/explainer/has-parent.html/.json built from the sibling reel 47 (three add-on cards, boxes ticked and cards dull, LIT 0 / TICKED 3, then .card:has(input:checked) lights them; violet accent hue 265), direction card, review file items 1-12 and 14-18 PASS, stills sheet, captions.json entry (postOn 2026-11-26, postAt 19:00), tip demo hasparent, demo-hues.json line, improvements and craft log lines.
- Left: the Fable stills check (APPROVED line in the direction card), then render 1 on GitHub (Showreel), Output QA, the critic (opus, tag critic).
- For the other account: a web FOCUS check measures colour on lit pixels, so a reel whose subject is grey cards fails it; give the demo one slate-violet base hue and put the whole screen in the subject box.
- Update (same session): Fable stills check round 1 said REDO (the reel read as 47 in violet); all five fixes made in one round (three tall icon tiles side by side, no red ring, 56 px reaction words, taps on the checkbox, LIT 0 -> 3 in one step, NO JAVASCRIPT at 52 px in the band); a short Fable confirmation of the new sheet is the next step.

## 2026-11-26 · claude/tech-3d-kit-sample-v4 · 3D kit sample v4: all of the critic's fixes, lessons into rules, README and starter (owner chat, cap ~$13)
- Done: scene rebuilt (hook = wired tangle + 24 + question from frame 0, camera path with three distinct moves and a loop home, cables on tile side edges, names inside tiles and distinct, no code card, held payoff, captions on a dark fade, numbers step aside in close shots); topic lines/cues/sfx for six lines; aiLabel false; rules-tech.md D1-D8, techkit/README.md, starter note; stills review/tech/study-25nov/kit-phase2-v4.jpg.
- Left: ONE render (Tech reel, gold3d-sample, preview v4), Output QA, then the independent critic (opus, tag critic).
- For the other account: nothing new.
## 2026-11-26 · claude/c3-fix-invite-26nov · Turns Out reel "You asked: fix this invite" rebuilt (Turns Out daily build)
- Done: showreel-c3-fix-invite rebuilt on the improved kit from the gold reel (optical-centre was withdrawn and stop-centring was posted on 21 Nov, so fix-invite is next in the plan): a party invite on a fridge door (four fonts, all centred, confetti, no hero) fixed in three moves (the age as the hero, one font in two sizes, one colour once), seven spoken sentences with breaths, direction card and review file written, captions entry kept hidden until the critic says READY. Nothing the invite needs is deleted; the 7 is hidden while the before is kept.
- Left: outside stills check, one render, Output QA, critic; then postOn 2026-11-26, postAt 17:00.
- For the other account: check c3-plan.md against captions.json posted marks before picking a held reel (stop-centring was already posted).

## 26 Nov 2026 02:10 IST+: owner chat, reference previews only showed the first 8 seconds
- Found: the refs preview was `fps=1,tile=4x2`, so every clip preview was its first 8 seconds only; references 4-14 were judged from openings.
- Fix: scripts/asks.mjs refs preview now spreads 8 frames over the whole clip; `asks.yml refs` with ASKS {"full":[ids]} adds time-stamped sheets of the whole clip at 1 frame a second (24 s a sheet). Timeout 20 min.
- Owner (26 Nov): full study of refs 9-14 approved (~$4); today's reels move only after it; the studio decides which reference goes to which channel.

## 2026-11-26 · claude/c3-fix-invite-26nov-c · Turns Out fix-invite: reference type treatment (same build)
- Done: serif headline with italic accent word and pill subtitles from the 26 Nov references; stills checks (overlap, safe zone, text fit, band) pass.
- Left: one render, Output QA, critic; then postOn 2026-11-26, postAt 17:00.
- For the other account: the reversal beat from the references was not added (script length kept).
- 26 Nov 07:45 IST: refs 9-14 studied whole (design/references.md "R-ref 26 Nov"), routed per channel; today's three builders held before render 1 and sent their lessons.

## 2026-11-26 · claude/tech-3d-kit-sample-v4-result · 3D kit sample v4 rendered: Output QA PASS, app entry, gold numbers (owner chat, one render)
- Done: render v4 (18.5 s, runner time about 20 min wall) Output QA PASS (HERO warns: no subject box; LOOK passes, one washed-out frame at 11.5-12.0 s, the close-up on the hub); previews.json entry points at v4; gold.json "tech3d" numbers re-measured from v4 (brighter than v3 because of the close-ups).
- Left: the second independent critic's verdict (review/tech/showreel-tech-gold3d-sample.md, branch claude/critic-gold3d-sample-v4).
- For the other account: nothing new.
- Update (same session, 26 Nov): render 1 of web 48 failed Output QA on BULK (near-white ticked boxes) and DEMO (colourfulness 30 of 32); colours fixed and both checks pass on the scene frames; render 2 next. For the other account: scripts/qa/look.py does not run BULK or DEMO; call oqa.bulk_check and oqa.demo_check on the frames before the render.


## 2026-11-26 · claude/critic-c3-fix-invite-26nov · Independent critic: Turns Out fix-invite render 1 READY
- Done: judged the real MP4 (render 1, Output QA PASS): side-by-side with gold, phone-size frames, strips over the three fixes and the BEFORE flashback, loudness (-14.0 LUFS); D1-D4 pass, key info kept, flashback covers no tag; STOP 7, REWATCH 7, PREMIUM 7.5; CRITIC: READY in the review file. captions.json: postOn 2026-11-26, postAt 17:00, hidden and hold removed; keyword "canva design tips" (a real brand) replaced by "poster design tips" in the config and captions.json (post text only); caption, hashtags and a measured style record added to the captions.json entry (check needs them on a dated reel).
- Left: posting at 17:00 IST.
- For the other account: Turns Out keywords print into the post text (ig-publish.mjs), so the no-real-brands rule applies to keywords too.

## 2026-11-26 · claude/tech-26nov-tag-sounding · Tech reel 26 Nov: SmartTag3 and Bluetooth Channel Sounding (builder session)
- Done: fresh news bank (5 options, 19-23 Nov, Samsung and Google pages), Fable pick (tag first), scene techkit/scenes/tag-sounding.html and topic techreel/topics/tag-sounding.json on the 3D colour-world kit, captions entry (postOn 26 Nov, 15:00), direction card APPROVED by Fable (two rounds), review file items 1-17, preflight lines (SAFE ZONE ok, FLOW ok); the 3D scene needed window.CHUNKS, window.seek and TRANSITIONS to run the preflight (now in the scene).
- Left: render 1 on GitHub (Tech reel, slug tag-sounding), Output QA, critic (opus, tag critic), then the post day.
- For the other account: a branch cut from an old checkout conflicts in captions.json and pick-log.md; merge main in before the first push. The preflight of a 3D scene takes about 12 min (FLOW samples 223 full frames).
- Update (same session, 26 Nov): render 2 of web 48 passed Output QA; the independent critic (Opus) said NOT READY: the first 7 s do not show a bug (dull tiles read as selected, dips of 5%). The fix (flicker and fail on each bug beat, two ignored taps, plum-grey tiles, code card faded before the loop) is built and checked on the scene frames; render 3 needs the owner's yes (about 16 GitHub minutes, under $1) and is NOT started; the posted reel is still render 2 until then. For the other account: a dull state must be visibly broken in the first second; a tile that looks half selected does not read as a bug.


## 2026-11-26 · claude/tech-26nov-tag-sounding-fix · Tech reel 26 Nov: critic NOT READY on render 1, fix for render 2 (builder session)
- Done: render 1 passed Output QA; critic (Opus) NOT READY (numbers over the phone, no old-vs-new range, misleading 60 m on the phone screen, AI label); scene fixed (numbers smaller and clear, amber old ring vs 3x ring from a top-down, phone screen arrow only), aiLabel false.
- Left: render 2 (the last one), Output QA, second critic, then the post day; a third render needs the owner chat's yes.
- For the other account: three big camera-riding numbers cover the product; keep them in a fixed clear screen spot and check them against the phone in the stills before render 1. The critic branch is merged and deleted by the pipeline, so a verdict file appears on main.
## 2026-11-26 · claude/critic-gold3d-sample · Independent critic of the 3D kit sample render v3
- Done: review/tech/showreel-tech-gold3d-sample.md, verdict NOT READY on the real MP4 (contact sheet + side-by-side with the tech gold). Strong colour, materials, cable maths and captions; weak hook at frame 0, one tower framing for 9.8-18.4 s, no payoff or loop at the end, unreadable code card over the tool column, hub cables over the tool names, apps and tools share names. Seven-step EXACT FIX in the file. PREMIUM 5.5 / 6.5 / 7.
- Left: the owner chat decides on a 4th render of this sample (owner's yes and cost estimate); it is not the gold for the 3D look until a critic writes READY.
- For the other account: nothing new.
## 2026-11-26 · claude/critic-gold3d-sample-v4 · Independent critic (second pass) of the 3D kit sample render v4
- Done: review/tech/showreel-tech-gold3d-sample.md, verdict NOT READY on the real v4 MP4 (one contact sheet, two full frames). Of the v3 fix list: hook, code card, distinct names and aiLabel DONE; camera path, cables and held payoff PARTLY. Still failing D2 (0.6-5.2 s and 13.3-18.5 s each one framing, about 5 s), the hub hides two of the eight tools from 7.5 s (the picture says 3+8 but shows 6 tools), "Notes" cut at the edge in the 9.8 s push-in. Six-step EXACT FIX in the file. PREMIUM 6.5 / 7 / 7.5.
- Left: the owner chat asks the owner about a 5th render of this sample (with its cost); not the 3D gold until a critic writes READY. The v3 critic branch (claude/critic-gold3d-sample) was never merged; this file replaces it.
- For the other account: the 3D look's camera keys must also cover the opening and the last 5 s, not only the middle beat.

## 2026-11-26 · claude/app-ready-fix-26nov · App: stale status and Post now on unready reels (tooling, owner-approved)
- Done: the journey cache kept serving its last answer when a rebuild failed (no mark, no error); now an answer over 5 min old is rebuilt in the request, a failed build is remembered, and if it fails the old answer comes back marked stale with the reason. The Ready-to-post list now needs a journey reel with status ready and a fresh journey (no data = a "status not loaded" line); /api/post refuses while stale. showreel-tech-battery-cycles hidden. npm run check has a "ready filter" check; owner-feedback line added.
- Left: confirm on the live board after the deploy (sign-in needed); if the board still says old, the stale mark now carries the real failure note.
- For the other account: never treat missing or old status as ready.


## 2026-11-26 · claude/c3-fix-invite-26nov-r2 · Turns Out fix-invite: owner text overlap and alignment fix, render 2 (builder session)
- Done: contact sheet of render 1 and full-size scene frames showed 7 overlap groups (chips on the board's top edge and the subtitle pill, ring tags and BEFORE/AFTER tags on board edges, touching rings, confetti under text, badges on confetti) and 3 off-grid items; scene fixed (chip band centred on the board between pill and board, board 424-744, one left edge x 32 for dial, headline and subtitle text, confetti in a clear column, tags inside or under the board); stills OVERLAP none, SAFE ZONE ok, ALIGN ok; reel hidden until the critic says READY again; owner-feedback and todo lines added.
- Left: independent stills check, render 2 (the last one without the owner's yes), Output QA, critic (opus, tag critic) checking overlap and alignment, then unhide for the 17:00 post.
- For the other account: DT.chip forces y 374 for any y in 380-420, so chips land on a board whose top is 396; keep chips in their own band above the board (board top at least 420) and centre them; test with the stills OVERLAP line and look at the sheet.
## 2026-11-26 · claude/app-today-board-26nov · App: Today shows the workflow board only (tooling, owner-approved via owner chat)
- Done: Today = the board (one row per channel: Building / Rendering % / Checking / Found a problem: why / Ready, post at slot / Posted; "old status" shown when the journey is over 15 min old or marked stale). Reel lists, Post now and the reel cards left Today; Needs you holds only questions. Ready-to-post cards (all buttons) are at the top of "All reels and posted", critic-READY and fresh status only; a Ready row's "Open to post" button goes there. Badge = questions + ready reels. Checked at phone width with Playwright on a local build (fresh and stale mock data); npm run check has the updated ready-filter check.
- Left: confirm on the live app after the deploy (sign-in needed).
- For the other account: Today never lists reels; ready reels live in the reels menu.
## 2026-11-26 · claude/web-26nov-verdict3 · Web reel showreel-48-has-parent: render 3 passed Output QA, critic READY
- Done: render 3 (run 45755239976) Output QA PASS; independent critic CRITIC: READY (STOP 7.5, REWATCH 7.5); verdict and notes added to the review file. Posts 26 Nov 19:00 IST.
- Left: the owner posts it. No further renders. Next web reel: give the reaction word its own row clear of the subtitle; start the code card typing on "fix".
- Update (same session, 26 Nov): the independent stills check passed with four near-misses (chips edge to edge, rings 5 px apart, thumbnail 3 px from the board); cleared them in branch claude/c3-fix-invite-26nov-r3 (chips spaced, ring gap 14 px, thumbnail lower) before render 2. For the other account: a stills-check session needs the repo as a source at creation (source_url), or it cannot run.

## 2026-11-26 · claude/preflight-all · Tooling: the full check before render 1 (owner-approved, "yes, build the check")
- Done: scripts/preflight-all.mjs <reel> for every channel: 360x640 10 fps preview (seek.mjs --preview; techkit capture at 1/3 scale with a smaller 3D drawing buffer, window.KITSCALE in world3d.js; techreel/make.py --preview), Output QA on it (OQA_PREVIEW: sound checks are SKIP), TEXT CLEAR (scripts/showreel/textclear.mjs + .py: the frame with and without its text every 0.25 s, 6 px of room, chips and tags judged by their outline, text against text), review lint, one PREFLIGHT-ALL line with a fingerprint of config and scene; review-gate.mjs refuses render 1 without a matching PASS for reels posting from 27 Nov. Tested: tech tag-sounding render 1 FAIL (figures over the phone 11.5-17.5 s), final only the figures over the dial ring; Turns Out fix-invite render 1 FAIL (19 problems: tags on borders, pills touching, confetti under text), final 4 small ones. Run time: web 21 s, Turns Out about 1 min, tech 3D 2-3 min.
- Left: the older tech picture engine's TEXT CLEAR is not calibrated (older reels only); a real voice (--voice) is only a mux here, voice and loudness checks stay on the render; first builders to use it should tell the owner chat about false alarms (waive a deliberate overlap with "qa": {"textclear_ok": [[t0, t1, "why"]]}).
- For the other account: run it after the stills check and before render 1, and paste nothing by hand: --write puts the line in the review file. Tech kit scenes: a 3D number or word figure must come from lib3d figure() so TEXT CLEAR can hide it; other 3D text is not seen.
## 2026-11-26 · claude/c3-fix-invite-26nov-r3b · Turns Out fix-invite: critic 2 NOT READY, three spacing fixes for render 3 (builder session)
- Done: render 2 passed Output QA; the independent critic (Opus) said NOT READY on three small items (the NO HERO and 4 FONTS tags touched, the BEFORE tag 6-9 px from the thumbnail, the dial 13 px right of the headline edge). Scene fixed: tags 13 px, laid out from their measured widths with 18 px between each pair, BEFORE tag 25 px from the thumbnail, dial moved so its ring sits on the headline edge; stills OVERLAP none, SAFE ZONE ok.
- Left: render 3 needs the owner's yes (asked via the owner chat; NOT started), Output QA, a third critic, then unhide for the post.
- For the other account: lay tag rows out from measured widths (offsetWidth) with the gap in code, not by fixed x positions; check dial and headline ring edges, not box edges.
## 2026-11-26 · claude/critic-c3-fix-invite-r2 · Turns Out showreel-c3-fix-invite: critic of render 2, NOT READY
- Done: independent critic on the real render 2 MP4. The owner's overlap fix mostly landed (chips in their own band, rings spaced, confetti clear, tags off the board border), but the NO HERO and 4 FONTS tags share one border at 1.8-4.2 s; BEFORE tag 6-9 px from the thumbnail at 17-20 s; dial 13 px right of the text edge. Verdict and EXACT FIX in the review file.
- Left: the builder applies the 3-step EXACT FIX; render 3 needs the owner's yes with its cost estimate; then a new critic.
## 2026-11-26 · claude/critic-gold3d-v5 · Independent critic (main account) of the 3D kit sample render v5: READY
- Done: fetched the real v5 MP4 (the other account's critic could not reach the app host) and judged it: one contact sheet, two full frames, a frame-difference strip. All six v4 fixes DONE (opening moves, hub clear of all eight tools, names whole in the push-in, tangle off the tool row, end returns to the frame-0 framing, hub sub-line dropped). PREMIUM 7.5 / 8 / 8; CRITIC: READY in review/tech/showreel-tech-gold3d-sample.md; Progress line in design/handoff.md.
- Left: the other account finalises the 3D kit (handoff.md "Then"), with the critic's notes: a "+1" by the New cable, its own icon for the New tile, 20-35 s and one readable artifact in daily reels.
- For the other account: study previews live at /reels/study/<name>.mp4; scripts/reel-fetch.mjs takes only showreel names, so fetch a study file with curl on that path.
## 2026-11-26 · claude/app-journey-26nov · App: board freeze fix, Fix button, stage-line rules (tooling, owner-approved via owner chat)
- Done: the journey answer now lives in D1 (journey_answer) instead of only the data centre's cache, where a failed save was swallowed and an old copy stayed with nothing saying so (most likely cause of the 00:48 freeze; not provable without logs). /api/journey carries builtAt, buildMs, age, warn (swallowed GitHub / subrequest failures) and error {note, at, n} for the last failed build. Fix button on a red board row: /api/feedback with priority, "Sent to the studio"; asks.mjs feedback prints PRIORITY items first. Runbooks name which session posts which stage. todo.md "Journey you can drive" moved to Done (Approve plan / Approve to post / Build next dropped). Phone-width check on a local build with mocked data; npm run check has "journey store" and "fix button".
- Left: after the deploy, confirm stage lines with scripts/stage.mjs on today's reel (before the deploy it returned 401: the key is synced on deploy) and read /api/journey's builtAt on the live board.
- For the other account: if the board freezes again, read error and warn in /api/journey first.

## 2026-11-26 · claude/studio-probe · Studio probe: status sheet, probe log, weekly tune (tooling, owner-approved via owner chat)
- Done: scripts/studio-status.mjs + workflow "Studio status" (read-only: feedback with priority Fix first, owner answers, today's and tomorrow's reels with stage, failed or stuck runs in 3 h, reels due within 2 h not ready, posts 20-90 min old with first numbers, last line ACTIONS: none | items with keys; keys handled in the last 6 h are left out). Probe log in the app: /api/probe-log (STAGE_KEY, D1 table probe_log, 45 days) + scripts/probe-log.mjs add|list. Weekly tune: scripts/probe-tune.mjs + design/probe-schedule.json. design/probe.md holds the exact steps and the scheduled-task prompt. Docs: CLAUDE.md and runbook-studio "Scheduled tasks", runbook-reels critic line (11:17 Reel critic retired).
- Left: after the merge and deploy the owner chat creates the probe task (prompt in design/probe.md, cron lines from probe-tune.mjs; the scheduler may refuse 30-minute steps: then report), turns the 11:17 "Reel critic" task off (enabled=false, not deleted), and confirms probe-log.mjs add works from a session (before the deploy /api/probe-log answers 401/404). Sunday: run probe-tune.mjs, tell the owner its line.
- For the other account: nothing; the probe never builds or renders.
## 2026-11-26 · claude/app-stage-bearer-26nov · App: /api/stage also accepts Authorization: Bearer (tooling, owner approved key reset)
- Done: POST /api/stage opens with X-Stage-Key (workflows) or Authorization: Bearer matching STAGE_KEY or REELS_READ_KEY (sessions hold one network secret per host); stage.mjs sends no placeholder header when STAGE_KEY env is empty; stage-test.mjs covers both; runbook-reels updated.
- Left: owner sets the new key as both GitHub secrets and the session network secret; then test reel-fetch and stage.mjs together.
## 2026-11-26 · claude/critic-c3-fix-invite-r3 · Critic 3: showreel-c3-fix-invite render 3 READY
- Done: independent critic on the real render 3 MP4; all three EXACT FIX items measured fixed (tags 36/34 px apart, 16 px from the confetti ring; BEFORE 52 px from the thumbnail; dial edge x 64 on the text edge x 65); verdict CRITIC: READY in review/c3/showreel-c3-fix-invite.md.
- Left: post today in the Turns Out slot. Next invite-style reel: keep rings 16 px+ apart (13 px here, outline to outline).
## 2026-11-26 · claude/app-dup-ready-26nov · App: no repeat of a ready reel under Up next; channel line shows the slot (tooling, owner asked)
- Done: render() leaves reels that readyReels() lists out of Up next/Later (all channels share the path); the page re-renders when the journey arrives. The channel line and profile card use slotLine() from /api/slots (tech "paused", others "at 14:00 IST, slot test until 2 Dec"). Phone-width check (390 px, mocked data): before 2 cards, after 1 under Ready and only tomorrow's under Up next. check.mjs "ready dup".
- Left: nothing; owner confirms on the phone after the deploy.
## 2026-11-26 · claude/critic-3d-v7-plan · Plan critic: 3D kit v7 plan, CHANGE FIRST
- Done: independent plan critic (no render) on review/tech/showreel-tech-gold3d-v7.md and its stills sheet against task 10 points 1-7 and critic questions 47-52; measured the v6 render 2 MP4 and the tech gold MP4 (luma, colour, pale frames): the builder's numbers hold and the floor fix is the right and only light change. Verdict PLAN: CHANGE FIRST with seven exact changes (readable hook frame, whole apps after the pull-back, wall fills the frame, a real tangle at moment 2, leader lines clear of tiles, New the subject of its shot, a moving end and loop home).
- Left: the other account makes changes 1-7, refreshes the stills sheet and runs the one render; the render critic checks idle motion, light sweeps and the loop on the real MP4.
- For the other account: last-4 s median frame change at least 5 locally before rendering.

## 2026-11-26 · claude/tech-2d5-test · Tech 2.5D node-map test: tap to pay (preview only, owner-approved test, main account)
- Done: scene scripts/previews/tech-2d5-test.html (+ .json): one camera over one canvas, hub -> six steps -> pull-back, colour world and spotlight per step, fixed title + section pill, word-by-word captions, a working mini interface per step, light pulses on the lines, English voice config. Direction card with the Motion-design pass, review file with sources (EMVCo tokenisation, Mastercard card-flow page, a Federal Reserve paper, a Visa developer guide; the sites were not reachable from the session, read through search), previews.json and captions.json (hidden sample) entries, projects.json entry. preflight-all passes Output QA and TEXT CLEAR on the preview.
- Left: outside stills check (opus, tag stills) with the Ambition pass, preflight-all PASS line, ONE render on the preview path (R2 study/), Output QA, independent critic (opus, tag critic) against the reference notes and the 3D v7 render 2.
- For the other account: textclear hides every text outside [data-subject]; a root element outside the subject that gets color:transparent makes the subject's text inherit it, so a scene that wraps its subject must give the subject its own color (symptom: UI text flagged "touches something" in TEXT CLEAR). The OQA CALM average (5%) is the check a camera-flight scene fights: shorter travel and no zoom dip fixed it.
## 2026-11-27 · claude/critic-3d-v7-r3-plan · Plan critic: 3D kit v7 render 3 plan, CHANGE FIRST
- Done: independent plan critic (no render) on the builder's "Render 3 plan" and the refreshed stills sheet against the 15-item RENDER 3 FIX LIST, the Ambition pass (incl. focus, structure, reason) and questions 46-52. 12 items OK, items 4, 13 and 15 CHANGE; plus focus (dim the non-subjects at 5.3-7.8, 9.0-11.4, 15.1-18.2 s), structure (a step pill 01-04 instead of the grey older words), reason (a still hold for the orbit at 13.9-15.1 s, one move home at the end) and a clean New shot. Open points decided: headline words on the wide shots only, no band; "TANGLED" at 9.0 s so 24 shows once.
- Left: the other account makes the seven changes, checks them locally (TEXT CLEAR, frame 0 vs 22.86 s, last-4 s change 5+) and runs render 3 with no further plan check.
## 2026-11-27 · claude/web-27nov-scrollbar · Web: showreel-49-scrollbar (W27-1, a scroll bar with no JavaScript), render 1 passed Output QA
- Done: Fable pick KEEP W27-1 W27-2 (design/pick-log.md); starter from tabwiggle; new demo (a feed that scrolls on every flick, a script's bar trailing in steps with a hatched gap and tick against animation-timeline: scroll() locking the bar, SCROLLS / JS CALLS meter, lime accent hue 85); direction card and review file; stills check round 1 REDO (4 fixes, one round) then APPROVED by a second Fable session; preflight-all PASS (the first run failed DEMO colourfulness 26 against 32 and the PREMIUM line form; feed colours enriched); render 1 (run 45914418236): OUTPUT QA PASS, style record measured, demo-hues.json line added. Yesterday's notes applied (reaction word in the header's own row, code typing from the spoken "fix").
- Left: independent critic (opus, tag critic) on the real MP4; post at 19:00 IST (design/slots.json). Render 2 is still unused.
- For the other account: a squash-merged first push makes a later push of the same branch conflict on its own files (add/add); merge origin/main with -X ours into the branch and push again. The Pipeline "merge" job then passes. Local output-qa.py has no recogniser, so MUTE says "after moment not found" there; the CI Output QA is the verdict.
## 2026-11-27 · claude/critic-web-49-scrollbar · Critic: showreel-49-scrollbar, NOT READY (render 1)
- Done: judged the real MP4 (frames every 0.25 s at 390 px, -14.0 LUFS, 1.39 s cover clean, side-by-side vs gold tabwiggle). CRITIC: NOT READY, item 20 in review/web/showreel-49-scrollbar.md: frame 0 shows only "Why" (question 42; the direction card promised the whole hook), the glide ghost doubles over the subtitle at 7.8-8.0 s, and the 10 px bar is smaller than its counter. STOP 6.5, REWATCH 7, PREMIUM 7/7/7.
- Left: the builder applies the three-point EXACT FIX (dim full hook at frame 0, drop the flying ghost, bar 14 -> 22 px), reruns preflight-all, and uses render 2 (no owner yes needed); then a fresh critic. Post at 19:00 IST.
## 2026-11-27 · claude/critic-web-49-scrollbar-r2 · Critic: showreel-49-scrollbar, READY (render 2)
- Done: judged the render 2 MP4 (frames every 0.25 s at 390 px, a 20 fps strip of 7.6-8.2 s, -14.0 LUFS, side-by-side vs gold tabwiggle). All three fixes show: whole dim hook at frame 0, no ghost pill (the lit lines sweep in place, bar lime at 8.25 s), 22 px bar. CRITIC: READY, item 22 in review/web/showreel-49-scrollbar.md; STOP 7.5, REWATCH 7.5, PREMIUM 7.5 / 7.5 / 7.5. Stage set to ready.
- Left: post at 19:00 IST (design/slots.json).
## 2026-11-27 · claude/tech-2d5-test-stillscheck2 · Stills check 2: tech 2.5D tap-to-pay map (preview, never posted), REDO
- Done: outside stills check of round 2 (builder sheet + one extra sheet, 12 moments). Owner notes 3, 4, 5, 6 met; 1 and 2 partly (hook is one card, panel text 10-12 px at 1080). PREMIUM about 7.0.
- Left: builder fixes HIGH first (EXAMPLE TIME readable, panels to 1-3 words at 24 px+, open on the whole map), then MED (bottom quarter, token resolves by 6.8 s, earlier pull-back with reply pulses); direction card has the exact list.
## 2026-11-27 · claude/tech-2d5-test-critic2 · Critic: tech 2.5D tap-to-pay preview render 2, NOT READY
- Done: judged the real render 2 MP4 (18-frame sheet, full-size checks at 0.3 and 14.5 s, colour trace 3.2-4.4 s, -14.1 LUFS) and the 3D v7 render 2. The 3.7 s COLOUR FAIL is a near-grey cross-fade (no step over 2.3 per frame), not a defect: waive it. Owner notes 3, 4, 5, 6 met; 1 and 2 partly. PREMIUM 7.5 / 7.0 / 7.0, CRITIC: NOT READY in review/tech/showreel-pv-tech-2d5-test.md with six ordered UPGRADES (top: frame 0 shows the whole map and no empty caption box; "One: ..." pause marks in captions; panel sub-lines 24 px+ or dropped). The 2.5D is closer to the reference and the better format for process topics.
- Left: the owner decides on a render 3 (cost estimate from the builder); no render started.
## 2026-11-27 · claude/tech-2d5-test-r2 · Tech 2.5D tap-to-pay test closed (render 2, NOT READY, preview only, never posted)
- Done: render 2 (run 45927723694) in R2 as study/showreel-pv-tech-2d5-test-preview.mp4; Output QA: one COLOUR FAIL at 3.7 s, waived on the critic's reason (near-grey smooth cross-fade); critic NOT READY, PREMIUM 7.5 / 7.0 / 7.0; owner notes 3, 4, 5, 6 met, 1 and 2 partly. Test spend about $20 (the cap). The three faults are now rules for the first real 2.5D tech reel in design/references.md.
- Left: nothing running. Render 3 only if the owner says yes (Needs you id tech-2d5-r3; the owner chat advises no). Tech stays paused until the 3D v7 passes its critic.
## 2026-11-27 · claude/tech-27nov-2d5 · Tech restarts (owner): showreel-tech-ai-words, the first real 2.5D map reel, built; stills check next
- Done: topic "Why AI types word by word" (a line out, a loop, a line back; Anthropic glossary + streaming docs, OpenAI latency guide); new scene scripts/explainer/tech-ai-words.html (+ .json) from the tap-to-pay test grammar with a glitch-free engine; direction card with the whole-frame map per beat; review file; captions.json entry (tech, 2026-11-27 20:30, xray, laptop). Owner's 2.5D notes 1-6 + the critic's three recorded in design/owner-feedback.md and folded into design/direction.md ("2.5D map reels") and design/critic.md (Ambition pass 5). New Output QA FLICKER (scripts/qa/output-qa.py): one-frame flicker and jumps, FAIL for tech, WARN elsewhere; calibrated on the tap-to-pay render 2 (panel vanish 7.5, scramble 12.7); this reel's 60 fps local capture PASS. CLAUDE.md: tech restarted 27 Nov in the 2.5D look, 3D v7 continues as a kit.
- Then (branch claude/tech-27nov-ai-words-r1): stills check APPROVED (Fable, #1549) with 2 HIGH + MED upgrades, all applied (wide-shot labels fade, ghosts kept in the safe zone, a dashed ring on every next tile, moves 0.6 s); colour turns round the wheel (COLOUR pass); Output QA judges showreel-tech-* as tech, HERO skips 2.5D maps; FLICKER formula 1.25 c; preflight-all PASS cfb86ee1.
- Left: render 1, Output QA, critic (opus). Post 20:30 IST.
- For the other account: FLICKER on web needs its own calibration (design/todo.md); scripts/showreel/resolve.mjs reports a tech reel in scripts/explainer as channel "web" (Output QA judges it with the web checks, like the tap-to-pay test; the gate uses captions.json and is right).
## 2026-11-27 · claude/c3-price-list-27nov · Turns Out: showreel-c3-price-list rebuilt on the improved kit (build pushed, stills check next)
- Done: new scene scripts/channel3/design/prices.js (plain centred before, one ring plus a red zigzag, three fixes: right edge, same-width digits, dot leaders; dark teal stage; chips in their own band; BEFORE proof and tail ticks), script with seven spoken sentences and breaths, direction card, review file, captions.json (c3, 2026-11-27, 17:00; hold removed). preflight-all passes except the stills-check line; npm run check passes.
- Left: outside stills check (opus, tag stills), one render, Output QA, critic (opus, tag critic).
## 2026-11-27 · claude/c3-price-list-27nov · Turns Out price-list: stills check round 1 REDO applied
- Done: all six points of the REDO fixed: thumbnail smaller with its BEFORE tag on its own top edge, cover frame shows all rows and the ring at full strength, card line 9 matches, the Fix 3 chip and title swap on "Then", the first snap starts on "line", the last subtitle clears 0.6 s after the voice. SAFE ZONE ok, OVERLAP none, preflight-all passes but for the new stills line.
- Left: second stills check, one render, Output QA, critic.
## 2026-11-27 · claude/c3-price-list-27nov · Turns Out price-list: render 1 failed Output QA (PACE, ELEMENTS), fixed for render 2
- Done: render 1 (run 45948452212) failed two Output QA measures; sentence 3 of the fixes shortened to 6 words ("First, align them to the right."), an end spark added, reel cut to 19.2 s, proof 0.12 s later (a TEXT CLEAR sample hit the flash). preflight-all PASS, npm run check passes.
- Left: render 2, Output QA, critic.
## 2026-11-27 · claude/critic-tech-ai-words-r1 · Critic: showreel-tech-ai-words render 1, NOT READY (captions)
- Done: judged the real render 1 MP4 (118 frames at 390 px, full-size checks at 3.9, 5.5, 11.8, 21.9 s, 30 fps strips of the step 6 move and the pull-back, -14.2 LUFS, side-by-side vs gold). The 2.5D map holds (whole map at frame 0, moves on the number, no glitch, ghosts, wedges, loop structure, panel text 24 px+, facts). CRITIC: NOT READY, item 18 in review/tech/showreel-tech-ai-words.md: subtitles lose the colon after each step number and leave 1-2 words alone in the box for 1.5-2 s (5.0, 11.3, 15.8, 23.4 s). STOP 7, REWATCH 7.5, PREMIUM 7.5 / 7.0 / 7.5. EXACT FIX: punctuation from the voice text, one caption group per sentence (split once at the comma when 10+ words).
- Left: the builder applies the caption fix (+ MED upgrades if FLICKER stays PASS), preflight-all, render 2, then a fresh critic. Post 20:30 IST.
## 2026-11-27 · claude/tech-ai-words-r2 · Tech showreel-tech-ai-words: render 1 Output QA PASS, critic NOT READY (captions), fix for render 2
- Done: render 1 (run 45944079244, 2 parts, 31 min): OUTPUT QA PASS incl. FLICKER (0 at 60 fps), LOUD -14.2, PACE 2.42. Critic (opus) NOT READY 7.5 / 7.0 / 7.5: captions lost the pause marks and left lone words. Fixed in the scene: captions use the script's words with marks, one group per sentence (comma split for 10+ words), two lines max; panel 6 fades in later. Preflight-all PASS 410c1ad3.
- Left: render 2 after the owner's notes window (owner chat), Output QA, a fresh critic. Post 20:30 IST.
## 2026-11-27 · claude/critic-tech-ai-words-r2 · Critic: showreel-tech-ai-words render 2, NOT READY (one lone word in the hook caption)
- Done: judged the real render 2 MP4 (119 frames at 270 px, caption crops at 1.0, 3.9, 11.8, 22.5, 26.5 s, 30 fps strips at 3.4, 21.4 and 24.85 s, -14.1 LUFS). Render 1's caption fault is fixed (pause marks kept, one sentence per group, comma splits), panel 6 is clean; the 6-word hook still wraps with "this?" alone at 0-3.4 s. PREMIUM 7.5 / 7.0 / 7.5.
- Left: the builder applies the one-line break fix (caption(), line 301); a third render needs the owner's yes with its cost. Post 20:30 IST.
## 2026-11-27 · claude/critic-c3-price-list-27nov · Critic: showreel-c3-price-list render 2, READY
- Done: judged the real render 2 MP4 (run 45953304430; 19.2 s, -14.0 LUFS): side-by-side vs gold (LOOK matches: 0.367 / 0.212 / 32% / 5% / 0.344), contact sheet, 20 phone-size frames, full-size end crop. Every fix lands on its word (6.2, 8.6, 10.6, 12.6 s), believable before, no text overlap, end holds before and after 14.3-19.2 s. STOP 7, REWATCH 7, PREMIUM 7.5 / 7.5 / 7.5. CRITIC: READY.
- Left: post at the Turns Out slot. Upgrades for the next Turns Out reel (no re-render): make a subtle fix visible at phone size, thumbnail at 0.45 above y 1570, shorter still tail, full claim on frame 0.
## 2026-11-27 · claude/c3-price-list-27nov · Turns Out: showreel-c3-price-list render 2 READY (critic), posts 17:00 IST
- Done: render 1 failed PACE and ELEMENTS and was fixed; render 2 (run 45953304430) passed Output QA; the critic (opus) wrote READY on the real MP4 (PREMIUM 7.5 / 7.5 / 7.5). captions.json: c3, postOn 2026-11-27, postAt 17:00, no hold. Review item 13 is PASS.
- Left: post at 17:00 IST. For the next Turns Out reel (critic's notes): make the changed digit width visible (a bracket under each 1), a larger BEFORE thumbnail (0.45 of the board if it fits above y 1570), end about 1.5 s after the green frame, whole claim and ring on frame 0.
## 2026-11-27 · claude/critic-tech-ai-words-r3 · Critic: showreel-tech-ai-words render 3, READY
- Done: judged the real render 3 MP4 (run 45958061268; 29.6 s, -14.1 LUFS): one contact sheet at 0.25 s, 0-3.5 s hook strip, 25.0-26.0 s banner strip at 30 fps, every caption group. Hook now "Why do chatbots / type like this?", every group a whole sentence with pause marks, banner fades in whole; nothing regressed. PREMIUM 7.5 / 8.0 / 7.5, STOP 7.5, REWATCH 7.5.
- Left: post at 20:30 IST. Next 2.5D reel: a question pill above the frame-0 reply, wide shots at scale 0.27+.
## 2026-11-27 · claude/tech-ai-words-close-2 · Tech showreel-tech-ai-words: READY on render 3, posts 20:30 IST (builder close-out)
- Done: render 2 (caption fix) Output QA PASS, critic NOT READY on one lone hook word; render 3 (owner's yes) Output QA PASS, final critic READY. The critic's branch could not merge (it carried an old Turns Out postAt and log lines); its verdict and log entry re-landed here. First real 2.5D map reel; tech restarted.
- Left: the owner posts at 20:30 IST. Next 2.5D reel: captions from the script text (keep marks), one sentence per group, break wrapped groups at the middle; check every group with the real voice word times before render 1.
## 2026-11-27 · claude/tech-ai-words-r4 · Tech showreel-tech-ai-words: opening redone for render 4 (owner)
- Done: owner note ("show a chatbot window"): frame 0-2.6 s is an invented chat window with the reply streaming, a 0.6 s pull-back turns it into card 1 (match cut), ring ghost on card 2; rest as render 3. Rule recorded (owner-feedback, direction.md 2.5D map reels, critic.md 5): open on the real-life moment, never an abstract map. FLICKER 60 fps PASS, preflight-all PASS.
- Left: outside stills check of the opening, render 4 (the last, cap $12), Output QA, final critic. Post 20:30 IST.
## 2026-11-27 · claude/tech-ai-words-close-r4 · Tech showreel-tech-ai-words: READY on render 4 (new chat-window opening), posts 20:30 IST (builder close-out)
- Done: opening redone per the owner's note; outside stills check REDO fixed (cursor follows words, one image at the hand-over, first caption word lit); render 4 (run 45979158248) Output QA PASS incl. FLICKER at 60 fps; final critic READY (STOP 8, REWATCH 7.5, PREMIUM 8.0/8.0/7.5; verdict on claude/tech-ai-words-critic-r4). 4 renders used, the owner approved all past 2.
- Left: the owner posts at 20:30 IST. Next 2.5D reel: keep a fading box opaque until its contents are gone (critic r4 LOW note); open on the real-life moment from frame 0.
## 2026-11-27 · claude/tech-ai-words-critic-r4 · Critic: showreel-tech-ai-words render 4, READY
- Done: judged the real render 4 MP4 (run 45979158248; 29.6 s, -14.1 LUFS): one 0-4 s strip every 0.1 s at phone size, a 20 fps crop of the hand-over 2.85-3.3 s, one contact sheet at 0.25 s. The opening answers the owner's note: an unbranded chat window with the question and the reply streaming word by word from frame 0, cursor at the last word's end, hook on screen with "Why" lit; the pull-back hands over with one header and one bubble at every frame (no double image, pop or jump); ghosts of the next cards from 2.8 s. Nothing regressed from 3.5 s. STOP 8, REWATCH 7.5, PREMIUM 8.0 / 8.0 / 7.5. CRITIC: READY, item 21.
- Left: post at 20:30 IST. Two LOW upgrades for the next 2.5D reel in the review file (opaque fading box at the hand-over; end frame matches frame 0 for the loop).
## 2026-11-27 · claude/critic-tech-gold3d-v7-r3 · Critic: 3D kit v7 render 3, NOT READY (v7 capped)
- Done: judged the real render 3 MP4 (22.87 s): one contact sheet, a 7.6-8.8 s strip, four full frames. All seven plan changes landed and the payoff wide is v7's best frame, but the cable cascade at 7.7-8.7 s shows four stepped copies of every cable and tile (the FLICKER fail, visible by eye), plus an empty frame at 3.0 s and cut tiles at 17.25 s. PREMIUM 6.5 / 6.5 / 7.5. CRITIC: NOT READY with the exact fix in the review file.
- Left: v7 is not STABLE and its render cap is used: the owner decides (a fix render, or reuse v7's parts in the 2.5D tech reels). Not usable as a whole tech reel as-is.
## 2026-11-27 · claude/notify-policy · App: one notification plan (task 6)
- Done: design/notify-policy.json is the single plan (times and words); src/notify.js reads it: ready 2 min before the slot, nudge 15 min after, last call 20:30, 08:00 summary; slot tests from design/slots.json "tests" (c3 14:00, web 19:00, 26 Nov to 2 Dec) get "Slot test day N of M", nudge at 10, late at 30, logged when posted. Worker cron every 2 min, GET /api/push/plan, Settings shows today's plan. Tests in scripts/qa/notify-test.mjs. Runbooks: the owner chat sends no slot reminders of its own.
- Left: App probe on the live app after deploy.
## 2026-11-27 · claude/t6-t20-done · Handoff: tasks 6 and 20 done (APP PROBE: PASS)
- Done: live App probe passed after both deploys; projects marked done.
- Left: task 10 render 4 (glitch screen running), then task 7.
## 2026-11-27 · claude/project-steps · App: projects show their steps and the next action (task 7)
- Done: projects.json steps + next (Worker passes them through, tests in scripts/qa/stage-test.mjs); Today step bar, Next line, step list; project-done push type; backfill; rule in runbook-studio and handoff.
- Left: live App probe after deploy.
## 2026-11-28 · claude/v7-r4-whip · 3D kit v7 render 4: the cascade restaged after the whole-reel glitch screen (task 10)
- Done: the move to the high wide is 1.7 s on a higher arc to the far wide (it was 0.62 s, low over the floor); the cascade lands once the camera is still and the 3 x 8 counter counts with it; Chat and Mail enter dim; the board rises over 0.9 s; the counter's ones digit rolls and fades (lib3d numbers). Full-size glitch checks pass at 1.2, 2.8, 7.8-9.4, 9.4-11.0, 14.0-15.6 and 22.3 s; TEXT CLEAR passes.
- Left: re-check 7.8-9.4 s after the last framing change, colour and glow, stills sheet, then render 4 (not dispatched; paused by the owner).
## 2026-11-27 · claude/t7-done · Handoff: task 7 done (APP PROBE: PASS), v7 render 4 cascade fix found
- Done: task 7 live and probed; v7 r4 glitch screen finished; cascade restaged (far high wide, 1.7 s move, dim edge entry).
- Left: full-size checks at the other flagged moments, then render 4.
## 2026-11-28 · claude/t10-r4-running · Handoff: v7 render 4 dispatched (the last)
- Done: local glitch checks all pass; render 4 started on GitHub; owner: v7 closes after this render.
- Left: Output QA, v7 ready for critic; then tasks 16, 17, 18.
## 2026-11-28 · claude/web-split · Web kit: before/after split piece (task 16)
- Done: scripts/explainer/kitsplit.js (KM.split), its kit-inline entry, study clip scripts/explainer/demo/split.html, rules-web.md rule 21.
- Left: none; the next web builder can use it.
## 2026-11-28 · claude/web-start-gold · Web: a new reel starts from the gold reel by default (task 17)
- Done: newweb.mjs defaults to the gold start; --classic keeps the old template; runbook-reels.md updated.
- Left: none.
## 2026-11-28 · claude/v7-closed · 3D kit v7 closed after render 4
- Done: render 4 Output QA recorded (all pass but FLICKER at 0.8 s); v7 closed per the owner; project marked done.
- Left: none for v7.
## 2026-11-28 · claude/web-28nov-popover · Web 28 Nov: showreel-50-popover (a menu cut off by its card, fixed with popover)
- Done: wrote the 28 Nov web options in the bank (W28-1 to W28-5) and re-read W27-2; Fable kept W28-1 first (pick-log); built the reel from the gold start with the KM.split pair (BEFORE sliced menu, AFTER popover), direction card, review file, captions entry (postOn 2026-11-28, 19:00); all local stills lines pass (subject fill 50%, safe zone ok, continuity 43%, element sound 100%).
- Left: stills check, preflight-all, render 1, Output QA, critic.
## 2026-11-28 · claude/daily-28nov-launch · Daily studio run 28 Nov: feedback, audit card, builders started
- Done: Owner answers read (0 answers, 0 new feedback); audit card sent (web below usual and in ALARM, tech fine, Turns Out low); no options for 28 Nov in the topic bank, so each builder researches fresh options and runs the Fable pick. Web builder (session_01AYvWRjJfUMBr1p7gctqGLW, post 19:00 IST) and tech builder (session_01AYvWRhzdyLvkLqFNWEBAnK, post 20:30 IST, from showreel-tech-ai-words) started with the full brief.
- Left: both builders own their reel to READY (stills check, max 2 renders, Output QA, critic). Turns Out has its own task.
## 2026-11-28 · claude/c3-text-on-photo-28nov · Turns Out: showreel-c3-text-on-photo rebuilt on the improved kit (build pushed, stills check next)
- Done: new scene scripts/channel3/design/text-on-photo.js (white regular words on a bright busy poster photo, three fixes: dim the photo, bold words, date on a band; BEFORE proof and tail), seven spoken sentences with breaths, direction card, review file, captions.json (c3, postOn 2026-11-28, postAt 14:00; hidden and hold stay until the critic says READY). Stills lines pass (SUBJECT FILL 89%, SAFE ZONE ok, OVERLAP none); npm run check passes.
- Left: outside stills check (fable, tag stills), preflight-all, one render, Output QA, critic (opus, tag critic).
## 2026-11-28 · claude/c3-text-on-photo-28nov · Turns Out text-on-photo: stills check round 1 REDO applied
- Done: rings and tags at full strength from t 0, one green frame clear of the bold title and band, BEFORE thumbnail raised 66 scene px, chips held about 1 s, last subtitle cleared 0.8 s after the voice, photo kept saturated with beams at .7. SAFE ZONE ok, OVERLAP none.
- Left: second outside stills check, preflight-all, one render, Output QA, critic.
## 2026-11-28 · claude/stills-c3-text-on-photo-28nov-r2 · Turns Out: outside stills check round 2 of showreel-c3-text-on-photo: APPROVED
- Done: one new stills sheet plus position measurements on the builder's fix commit (no render, no scene or config change). All six round 1 points are fixed and nothing regressed; verdict written in review/c3/showreel-c3-text-on-photo.direction.md.
- Left: the builder corrects card line 9 (one green frame, not two), then preflight-all, one render, Output QA, critic.
## 2026-11-28 · claude/c3-text-on-photo-28nov · Turns Out text-on-photo: stills round 2 APPROVED, preflight-all PASS, render 1 next
- Done: round 2 approved by the outside check; preflight fixes after it: reel 19.6 s with an extra spark in the tail, the before flash declared as a transition, band and small print moved 14 px down clear of the title, chip timings, a brighter stage, text-clear waivers for the poster's own words on the photo and the BEFORE flash. preflight-all PASS 0fb398f4.
- Left: render 1 on GitHub, Output QA, critic (opus, tag critic).
## 2026-11-28 · claude/tech-28nov-r2 · Tech showreel-tech-tag-relay: stills check APPROVED with fixes, render 1 failed PACE only, fix for render 2
- Done: topic "can a tag be found far from your phone" (Samsung Newsroom 23 Nov, Galaxy SmartTag3 offline finding relay; Fable pick T28-1); second real 2.5D map reel from showreel-tech-ai-words (find-my-tag window opening, six steps, loop-home ending); stills check APPROVED on condition (hook wording contradicted step 2, labels cut at the left edge; all fixed); FLICKER PASS at 60 fps locally and on render 1; preflight-all PASS; render 1 (run 46085220882) failed Output QA on PACE alone (sentence 5, 4.63 words/s), sentence shortened.
- Left: render 2, Output QA, independent critic (opus), post 20:30 IST.
- For the other account: the Pipeline merge job fails when main moved under a claude/ branch (captions.json add/add): merge origin/main into the branch keeping both entries, then push.

## 2026-11-28 · claude/critic-tech-tag-relay-r2 · Critic, showreel-tech-tag-relay render 2: NOT READY (last words clipped)
- Done: independent critic on the real MP4 of render 2; item 18 CRITIC: NOT READY: the payoff line "and only you can read where" is never finished on screen (caption fades at 29.1-29.3 s under the voice) and "where" is cut by the 29.6 s end; everything else passes (frame 0, title, captions, loop picture, facts, sound). PREMIUM 7.5 / 7.0 / 7.5.
- Left: fix 1 (reel 30.4 s, the move home after the voice) needs render 3, which needs the owner's yes with its cost; then a critic pass on render 3.
## 2026-11-28 · claude/tech-28nov-r3 · Tech showreel-tech-tag-relay: render 2 passed Output QA, critic NOT READY (last caption cut), render 3 fix ready, waiting for the owner's yes
- Done: render 2 (run 46089101336) passed Output QA (PACE, LOUD -14.0, 32 of 32 cues, FLICKER at 60 fps); independent critic (opus) NOT READY 7.5 / 7.0 / 7.5: the payoff caption "and only you can read where" fades while the voice is still talking and the loop restarts mid-word (the real voice ends about 1 s later than the simulated one). Fix (timing only): reel 30.4 s, move home at 29.8 s, last caption lit until the voice ends, lit links fade back for the loop; FLICKER PASS at 60 fps locally, preflight-all PASS.
- Left: the owner's yes for render 3 (asked of the owner chat, about $12), render 3, Output QA, a fresh critic, post 20:30 IST.
- For the other account: plan a payoff hold from the real voice end, not the simulated one (an Output QA voice-end line would catch it).

## 2026-11-28 · claude/c3-text-on-photo-28nov-r2 · Turns Out text-on-photo: render 1 failed Output QA (PACE, ELEMENTS), fixed for render 2
- Done: render 1 (run 46087823761) failed PACE (two sentences of short words read at 6.4 and 4.7 words/s) and ELEMENTS (3.6 s with nothing new at the end). Sentences 6 and 7 rewritten ("Then add a solid band." / "Now it reads, even from far away."), reel cut from 19.6 s to 17.4 s. preflight-all PASS 757435d0, npm run check passes.
- Left: merge, render 2 (the last without the owner's yes), Output QA, critic.
## 2026-11-28 · claude/kit-2d5-depth · 2.5D map kit with 3D's depth (task 22)
- Done: comparison page, scripts/explainer/kitmap.js (KMAP.card / build / object), kit-inline entry, study sample scripts/previews/tech-2d5-depth; local FLICKER pass.
- Left: render 1, Output QA, 2.5D depth ready for critic.

## 2026-11-28 · claude/critic-c3-text-on-photo-28nov · Critic, showreel-c3-text-on-photo render 2: NOT READY (frame-0 tags overlap, flat after)
- Done: independent critic on the real MP4 of render 2 (run 46093523921, 17.4 s, -14.0 LUFS); gold sheet, contact sheet, 24 phone-size frames, full-size crops. Fixes land on their words, the before is honest, voice natural, BEFORE/AFTER tagged and held. NOT READY: the "WHITE ON GLARE" and "NOTHING BEHIND IT" tags overlap 0-4.5 s (frame 0 and cover); the after (12-17.4 s) is muddy next to gold (GOLD: below). STOP 7, REWATCH 7, PREMIUM 7.5 / 6 / 6.5.
- Left: builder applies the EXACT FIX in the review file (tag moved up a row, dark layer .7 with beams back on "Now", cursor off the small print), preflight-all, render 3 needs the owner's yes with its cost, Output QA, fresh critic, post today.
## 2026-11-28 · claude/c3-text-on-photo-28nov-r3 · Turns Out text-on-photo: critic NOT READY on render 2, fix for render 3 prepared
- Done: render 2 (run 46093523921) passed Output QA; the critic (opus) wrote NOT READY (PREMIUM 7.5 / 6 / 6.5: the two frame-0 labels, a flat finish next to gold). Fix applied in the scene: first label one row up, dark layer .7, beams back on "Now", cursor off the small print. preflight-all PASS 6fbe4850. Measured on the scene: the two labels had a gap of about 20 px, so "overlap" was too strong a word, the stacked rows make it certain anyway.
- Left: render 3 needs the owner's yes with its cost (asked in the Owner chat); then Output QA and a fresh critic. Reel stays hidden and on hold until READY.
## 2026-11-28 · claude/kit-2d5-depth-r2 · 2.5D depth study: render 1 fixes (task 22)
- Done: channel tech, payoff end (DEAD), phone move tied to step one, flat line caps; local FLICKER pass.
- Left: render 2 (the last), Output QA, ready for critic.
## 2026-11-28 · claude/t22-ready · 2.5D depth study ready for critic (task 22)
- Done: render 2 Output QA (FLICKER and DEAD pass); review file for the critic.
- Left: the main account's critic.

## 2026-11-28 · claude/critic-kit-2d5-depth · 2.5D depth study: critic NOT READY on render 2 (task 22)
- Done: critic on the real MP4 (PREMIUM 6.5 / 6.0 / 6.5): lone dark shadow blobs and line ticks at 4.55 s and 6.95 s, frame 0 title only, lower half empty; builders keep the 27 Nov kit; exact fix for kitmap.js in review/tech/showreel-pv-tech-2d5-depth.md.
- Left: the other account applies the fix to kitmap.js; no third render without the owner's yes.

## 2026-11-28 · claude/critic-web-28nov-popover-r3 · Critic, showreel-50-popover render 3: READY
- Done: independent critic on the real MP4 of render 3 (run 46106486981, 15.0 s, -14.0 LUFS); contact sheet, gold side-by-side, 60 fps steps round 3.43 s and the re-open. All five render 1 fixes are on screen and render 2's grey is gone; the 3.43 s FLICKER warn is the subtitle page turning (intended). GOLD matches, STOP 7, REWATCH 7, PREMIUM 7.5 / 8 / 7.5.
- Left: the builder / owner chat moves it to Ready to post for the 19:00 IST slot; next web reel applies the HIGH upgrade (one wide hero card after the fix).
## 2026-11-28 · claude/tech-28nov-ready · Tech showreel-tech-tag-relay: READY on render 3, posts 20:30 IST (builder close-out)
- Done: render 1 failed PACE (one 10-word sentence), render 2 passed but the critic (opus) found the last caption cut off while the voice was still talking (the real voice ends about 1 s later than the simulated one), render 3 (the owner's yes via the owner chat, 30.4 s, timing only) passed Output QA except NUMBERS, a false positive on card 3's padlock icon (no counter in the reel), and the render 3 critic wrote READY (STOP 7, REWATCH 7.5, PREMIUM 7.5 / 7.5 / 7.5) and waived NUMBERS with that reason. 3 renders used, all past 2 approved by the owner.
- Left: the owner posts at 20:30 IST. Next 2.5D reel: plan the payoff hold from the real voice end, keep step sentences to 8-9 words, teach the NUMBERS check to ignore icon shapes (critic's upgrade), 900 MILLION+ as a hero number, card 3 key-turn line, card 1 grows 8 %.
- For the other account: Output QA NUMBERS read a closed padlock icon as "6" (one render in two); a voice-end line in Output QA would have caught the clipped last word before the critic did.


## 2026-11-28 · claude/critic-c3-text-on-photo-28nov-r3 · Critic, showreel-c3-text-on-photo render 3: READY
- Done: independent critic on the real MP4 of render 3 (run 46106428084, 17.4 s, -14.0 LUFS); gold sheet, contact sheet, 20 phone-size frames, full-size crops of the frame-0 labels and the finished poster. All three render 2 fixes landed: the labels are stacked about 25 px apart, the after has its beams back and reads as a lit stage, the cursor stays below the small print. No regression. GOLD matches, STOP 7, REWATCH 7, PREMIUM 7.5 / 7.5 / 7.5.
- Left: the owner chat moves it to Ready to post (Turns Out slot 14:00 IST, so it posts late today inside the window). Next Turns Out reel: bigger BEFORE thumbnail with a ring kept on it, chips handed over with the titles.
## 2026-11-28 · claude/c3-text-on-photo-28nov-ready · Turns Out: showreel-c3-text-on-photo render 3 READY (critic), posts 14:00 IST
- Done: render 1 failed PACE and ELEMENTS, render 2 got NOT READY (frame-0 labels, flat finish), render 3 (run 46106428084, the owner's yes) passed Output QA and the independent critic (opus) wrote READY on the real MP4 (PREMIUM 7.5 / 7.5 / 7.5, STOP 7, REWATCH 7). captions.json: c3, postOn 2026-11-28, postAt 14:00, hidden and hold removed.
- Left: post at 14:00 IST. Next Turns Out reel: critic's notes in the review file (the MAKE IT BOLD chip lingers a little; a larger BEFORE thumbnail).

## 2026-11-28 · claude/web-popover-focus · Web popover focus hand-off test (study preview, owner's idea)
- Done: preview copy of showreel-50-popover with the focus hand-off (BEFORE lit with a soft glow while the problem is told, AFTER dark and blurred; hand-over at the fix word in .5 s, the AFTER menu opens to the top layer as it lands; both lit for the last second): scripts/previews/web-popover-focus.html and .json, review/web/showreel-50-popover-focus.md, Inbox > Tests entry. showreel-50-popover and its MP4 untouched. Local stills clear (SUBJECT FILL 41%, OVERLAP none, SAFE ZONE ok, FLOW ok).
- Left: one full-length preview render (R2 study/), Output QA, reviewer session; the swap into the 19:00 post only if the reviewer writes READY and Inputs says the owner likes it before 17:30 IST.

## 2026-11-28 · claude/numbers-icon-fix · Output QA NUMBERS ignores icons; board Ready follows the journey (item 6)
- Done: output-qa.py digit_like(): a read needs digit proportions (a square padlock blob is not a digit), padlock case and unit checks in scripts/qa/test-numbers.py; templates/index.html bRowReady(): a "ready" stage row no longer overrides a journey that is not ready, cases in scripts/qa/app-board-test.mjs.
- Left: Output QA re-run on showreel-tech-tag-relay after merge, then the App probe.
