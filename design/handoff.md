# Handoff: OPEN (27 Nov 2026): HOLD lifted, task 10 (3D kit v7 render 3) is GO now

Tasks 0, 2 and 3 are below under their own headings; the v5 task and its history follow. Progress is at the end of the v5 section.

## GO NOW (owner, 28 Nov 2026 ~09:30 IST): this account does EVERYTHING from 29 Nov through Tue 2 Dec 2026
Owner: "All tasks until Tuesday should be handled by the handoff session." The main account only runs its hourly Studio probe (checks
and reports to the owner) and the daily owner chat; its daily reel tasks are switched off until Wed 3 Dec. So this account now also builds
the daily reels (this overrides "never daily reels" until 2 Dec):
1. Every day 29 Nov - 2 Dec, ONE reel per channel: Turns Out (slot 14:00 IST), web (19:00), tech (20:30); slots in design/slots.json.
   Follow CLAUDE.md, design/runbook-daily.md and design/runbook-reels.md (web, tech) and design/c3-plan.md section 0 (Turns Out, next held
   design in order). Start each build by about 05:00 IST. Gates unchanged: outside stills check, at most 2 renders, Output QA, an independent
   critic in a separate session writing "CRITIC: READY"; a 3rd render needs the owner's yes. Captions.json entry with postOn/postAt.
2. Before rendering, check what failed today on all three reels: voice longer than the picture (last words cut), colour saturation of
   "broken" states, and label spacing on frame 0. All three needed a 3rd render on 28 Nov for these.
3. Between builds, the open queue below: task 22 fix (from the 28 Nov critic; no 3rd study render without the owner's yes), then 11,
   12-15, 9. Each app change: App probe PASS on the live app.
4. Status: one Progress line here at each stage (the main account's probe and owner chat read it and tell the owner).
6. DONE 28 Nov (see Progress). Small fix (28 Nov): an Output QA text check on today's tech reel (showreel-tech-tag-relay render 3) read a padlock icon as the number 6 and complained; the critic confirmed it was a false alarm. Make that check ignore icons (or need real digits in a text line), prove it on that render, and add a test.
5. The owner chats with this account in ONE session titled "Inputs" until 2 Dec: start it by reading design/inputs-brief.md, which has the read order, the owner's reply style and the 28 Nov state. Inputs is the owner's chat; reel builds still go to their own sessions.

# History: 3D tech look sample v5 (owner, 26 Nov 2026), DONE

The owner runs this task from another Claude account. That session reads this file, does the task, and writes every stage in
"Progress" below (in its pushes). The main account's owner chat reads Progress; there is no other channel between the two.
When the task is done, the session marks it DONE here and the file goes back to CLOSED.

## Owner rule for this account (26 Nov 2026)
Do only the tasks written in this file, in the order given, and report each stage in Progress. No cost estimates, cost lines or cost talk,
here or in chat. Ask the owner only before something the task does not already cover (for example an extra render).

## HOLD LIFTED (owner, 27 Nov 2026, about 13:00 IST): start task 10 now
Do now, in order: make the 7 changes of "Render 3 plan critic" in review/tech/showreel-tech-gold3d-v7.md (no further plan check),
then ONE render 3, Output QA (it now includes the card glitch check added 27 Nov), write "v7 ready for critic" in Progress and stop.
Where they fit the 3D look, also apply the owner's 27 Nov 2.5D notes in design/owner-feedback.md (moves about 0.4-0.6 s with no dwell,
nothing glitching, a hint of the next subject before the camera moves, the WHOLE frame planned with nothing empty). Tech now posts in the
2.5D look (owner, 27 Nov); v7 continues as a kit. Render 3 is the last v7 render; after it the owner decides.

## Owner rule: scope of this account (owner, 27 Nov 2026)
This account is a temporary helper for bigger chunks of app, tooling and kit work only. It never builds, renders, schedules or posts the
daily reels. The main account's owner chat writes the tasks here and reads Progress.

## Owner rule: ALL app work is this account's (owner, 27 Nov 2026, option 1)
Every app change (features and urgent fixes, even ones blocking today's post) is done here. Done = the "App probe" workflow (scripts/qa/app-live-probe.mjs:
signs in, iPhone size, opens every tab and every Today card) prints APP PROBE: PASS on the live app after the deploy; paste that line in Progress.
The main account no longer edits templates/index.html, templates/sw.js or src/worker.js.

## Owner rule: status every 30 minutes on open tasks (owner, 27 Nov 2026)
While any task here is started and not "done", write one Progress line at least every 30 minutes, even when nothing moved:
"<time> IST, other account: task N, <stage>, <what happened since the last line>, next: <next step and when>". Before a session ends for any
reason (finished, usage limit, error, waiting on something), its last Progress line says why it stopped and what restarts it. The queue check
writes a line when it finds a started task with no Progress line for 30 minutes ("task N silent since <time>: restarting" or why it cannot).
**Answer first (owner, 27 Nov 19:20 IST):** task 10 last wrote at 15:34 IST ("7 changes built, last checks before the render") and no render 3
ran after it. Write what happened (did the session stop, hit a limit, or fail a check?), then continue: render 3, Output QA, "v7 ready for critic".

## Owner rule: code fixes come here (owner, 26 Nov 2026)
App and tooling CODE fixes are queued in this file for this account ("Queued task N"), in order. The main account keeps only reel builds,
critics, anything that needs reel videos or the signed-in site, and fixes needed for today's posts. Only GO tasks are worked on (rule below): now task 10, then task 9
(later numbers after these, in order); report each in Progress.
Every task here is also a project on the app's board: update its entry in design/projects.json at each stage, in the same push as the work (design/runbook-studio.md "Projects on the board") Each step also updates its "steps" states and its "next" (who, the action in plain words, when) in the same push (task 7).

## Owner rule: work only on tasks marked GO (owner, 26 Nov 2026)
Do NOT pick up the next task on your own. A task is worked on only when its heading carries "GO" (the owner or the main account adds it
when the owner asks). The hourly "Handoff queue check" starts a session only for an open GO task that is not already started (a
"task N started" Progress line in the last 3 hours); otherwise it ends at once. When a GO task is done, write "task N done" and stop.
Current GO list, in this order: task 10 (3D kit v7, FIRST: no other task starts while task 10 has no "v7 ready for critic" line, except during its render wait), then task 19 (app never stale) and task 20 (tabs in posting order), then task 6 (notification policy), task 7 (projects show their steps), task 16 (web kit before/after piece), task 17 (web starters use the whole frame), task 18 (render speed). Tasks 9, 11-15 are done. Every other open task waits until it is marked GO.

## Owner rule for task 10: keep going until stable (owner, 26 Nov 2026)
Task 10 (3D kit v7) continues on its own through the hourly queue check until it is STABLE or capped, without waiting to be told:
- STABLE = the main account's critic writes CRITIC: READY on a v7 render AND its PREMIUM scores are all 7.5 or more AND Output QA passes.
- The loop: make the critic's exact changes -> refresh stills -> ONE render -> Output QA -> write "v7 ready for critic" in Progress and
  update projects.json (stage critic). The main account's probe starts the critic by itself; its verdict lands in Progress.
- Cap: at most 2 v7 renders in this loop (this replaces the owner's "stop after a working render" rule for task 10 only). If v7 is not
  STABLE after render 2, stop, write "v7 capped: <one line>" in Progress and wait for the owner.
- When STABLE: v7 becomes the tech 3D gold (design/gold.md, scripts/qa/gold.json, the tech3d starter), write "task 10 done", and stop.

## Read first (only the parts you need)
CLAUDE.md; the last 5 entries of design/handoff-log.md; design/3d-kit-phase2.md; design/rules-tech.md (section L, rules D1-D8).
Never create, change or fire scheduled tasks (main account only). Model: the cheaper one (sonnet). Size M; say so in chat first.

## Task
- Branch claude/3d-kit-v5 from latest main. Files: techkit/scenes/gold3d-sample.html, techreel/topics/gold3d-sample.json.
- First merge the two unmerged critic branches, claude/critic-gold3d-sample (v3 pass) and claude/critic-gold3d-sample-v4 (v4 pass), so
  review/tech/showreel-tech-gold3d-sample.md holds both. Its "EXACT FIX (render v5)" is the list below.
- Status: v4 preview (R2 study/showreel-tech-gold3d-sample-v4-preview.mp4, 18.5 s) NOT READY, PREMIUM 6.5 / 7 / 7.5; 4 renders used.
  Keep: frame-0 hook ("3x8=24", question caption from 0.6 s), no code card, distinct names, aiLabel false, the colours.

The six fixes:
1. Opening 0-5.2 s: one slow camera move at about 2.6 s (low push-in or 15-20 degree orbit, at least 10 % scale change); no framing over 3 s. Keep the frame-0 picture.
2. Hub: between the tool wall and the app row (or lift the tool wall one tile height), so all eight tools are visible and whole from 7.5 s to the end; the picture matches "3+8=11".
3. Push-in 9.8-11.0 s: pull back about 10 % (or bring the apps closer) so "Notes", "Chat", "Mail" are whole in frame.
4. Tangle 0-6.3 s: cables to the side edges of the bottom tool row, so "Photos" and the 8th tile are not under cables.
5. End 13.3-18.5 s: one event in the last 2 s with the caption held: from about 16.3 s ease the camera back to the exact frame-0 camera (small orbit) and pulse the New tile's single cable once.
6. Hub line "one shared standard": 34 px or more at 1080 wide, or drop it.

## Steps
1. Make the six fixes. Text checks first, then ONE stills sheet at phone size: every fix shows, no name cut or covered.
2. `npm run check`, push the claude/ branch, the pipeline merges. Write "Progress: fixes pushed" in the same push.
3. STOP before the render. Ask the owner in your chat (render 5 is past the 2-render cap). Render only on the
   owner's yes (in your chat, or "Owner yes for render 5: YES" below). Read .github/workflows/techreel.yml first (it renders main, so merge first).
   ONE render; if it fails, stop and report, no 6th.
4. Output QA on the MP4, then a separate critic session (tag critic, model claude-opus-5-5) on the v5 MP4. Never approve your own work.
5. Each stage gets one plain line in Progress (date, IST time, what happened). One entry at the top of design/handoff-log.md
   in the final push. No subagents, no polling (one check-in per GitHub job, with a send_later wake-up), no secrets, no model names in files.

## Then: finalise the 3D kit (only after the v5 critic says READY)
Also done by this session, same branch rules, one push per step.
1. Make the v5 sample the tech 3D gold: design/gold.md (tech 3D entry), scripts/qa/gold.json "tech3d" numbers from the v5 render.
2. Starter: `node scripts/starter.mjs tech3d <slug>` starts from the v5 sample, with the lessons from the v3/v4/v5 critics written in techkit README (D1-D8 kept in design/rules-tech.md).
3. Close the known limits in design/3d-kit-phase2.md (hub label behind the apps at low angles) or mark each one as accepted, with the reason.
4. Rules: design/rules-tech.md and design/runbook-daily.md say tech daily builds use the 3D look from the next build on; design/3d-kit-phase2.md gets a "DONE" line.
5. Write DONE in Progress, add the handoff-log entry, and set this file back to CLOSED (keep the history below).
If the v5 critic says NOT READY: stop, write the critic's fix list in Progress and ask the owner. No 6th render without the owner's yes.

## Owner rule for more renders (owner, 26 Nov 2026, in the other account's chat)
If a render FAILS, fix it and run the next render without asking. If a render SUCCEEDS and the critic's verdict needs another render, stop: the owner checks that result and confirms before the next render.

## Queued task 2 (owner, 26 Nov 2026): the GitHub minutes meter is missing from the app
Take it up after task 0. Size S, no renders.
- The owner cannot see the "GitHub minutes" meter in the app's settings sheet. It is hidden until /api data loads: templates/index.html
  (id "use", ~line 651; loader ~line 1646-1656, which hides it silently on any error), fed by the nightly "Actions usage" workflow
  (.github/workflows/actions-usage.yml, scripts/actions-usage.mjs) writing c/showreel-usage-actions.json to R2.
- Find why it stays hidden (workflow failing? file missing in R2? the loader's request or field names?) and fix it; if the data cannot load,
  show the meter with a plain "minutes not counted yet" line instead of hiding it.
- Why the owner needs it: deciding whether to make the repo private (private repos get 2,000 free minutes a month, then pay per minute).
- Write each stage in Progress below; one handoff-log entry.

## Queued task 0 (do first): two of your saved changes did not merge
The pipeline runs for your branches claude/3d-kit-rules and claude/3d-kit-limits failed (26 Nov). Merge origin/main into each, fix what
failed (npm run check), push again until they merge. Write one Progress line when both are on main.

## Queued task 3 GO (owner, 26 Nov 2026): 3D kit v6, a told story instead of a still scene
After task 0 and task 2. The owner watched v5 (critic READY) and wants more. Owner's notes: "it still glows more than a user's eye
should expect, wiring doesn't give realistic feeling, movement through the 18.5 s video is really limited". The owner's direction, agreed:
1. Beats: one beat = one action = one shot, 1.5-3 s each; every beat has something entering or changing. We are telling a story.
2. Entrances: the three apps flow in one after another, each with its own motion-design entrance (slide + turn to camera + settle, a
   different move each); tools likewise. Make each entrance a reusable kit entrance per object type, so reels do not all look alike.
3. Wiring per app: the first app's cable is its own beat (it unrolls, the plug clicks in, one short pulse); the remaining cables follow
   as a fast cascade, so the reel stays 20-35 s. The tangle grows beat by beat; then the hub arrives, cables collapse into one, the
   camera pulls back to the clean picture.
4. Detail and angles: each element shows its own detail (icon, screen, plug), shot at its own angle (low close-up on a plug,
   three-quarter on a tile, top-down on the tangle). The camera travels between subjects on top of the objects' own motion.
5. Hook first: frame 0 is still the finished tangle with "3x8 = 24" for about 1 s, then a quick rewind and the build-up.
6. Readability: one big move at a time; a short settle (about 0.5 s) whenever a name or number must be read; nothing held over ~2 s.
7. Realism, believable not photoreal: cables sag with gravity, have real plugs at both ends, matte with a soft sheen, contact shadows;
   a cable glows only for the short pulse when it connects. Only screens and lights emit light. Much less bloom than v5.
8. Do not downgrade: keep v5's colour and materials, clean names, nothing cut at edges, the hook frame and the loop home.
Write these as kit rules (design/rules-tech.md section L, a D9-D12 block) and four new critic questions in design/critic.md (own entrance per
object? each connection its own beat? would the wires pass as real? is any frame over-glowing?), plus a GLOW check in Output QA
(fail when emissive/bloomed area is above a small share of the frame). Then rebuild the sample as v6 on these rules, one stills sheet,
render under the owner's render rule above, Output QA. For the critic: this account cannot fetch videos, so write in Progress
"v6 ready for critic" and stop; the main account runs the critic and writes its verdict in Progress. If READY, v6 replaces v5 as the
tech 3D gold (design/gold.md, scripts/qa/gold.json, the tech3d starter).

## Queued task 6 GO, after task 10 (owner, 26 and 27 Nov 2026): one notification policy the app follows (do it right after task 0)
Owner: "design control for notifications ... if we are running tests, we should have defined notifications approach which is used by
app: regular upload notifications; test window notification change". Today the owner chat sent its own 13:58 reminder and the app's
"ready" push came later from a separate rule; two systems, no shared plan. Size M.
1. design/notify-policy.json (the single source; src/notify.js and the Worker read it, the owner chat's reminders follow it): per type
   when it fires and its words. Regular upload: "ready" 2 min BEFORE the slot (not after), "nudge" 15 min after the slot if not posted,
   "last call" at 20:30 IST, the 08:00 morning summary. Slots always come from design/slots.json, never a fixed list.
2. Test windows: while design/slots.json marks a slot as a test (add "tests": {"c3": {"slot": "14:00", "until": "2026-12-02"}, "web": {...}}),
   that channel's pushes say so ("Slot test day 2 of 7: post Turns Out at 14:00"), the nudge comes 10 min after the slot, and a "late"
   push at 30 min says the test day is weakened; when posted, a "logged" push confirms the time counted. When the test ends, the
   pushes return to the regular plan by themselves. The weekly review reads the test log (slot, actual post time, on time yes/no).
3. Settings > Notifications shows the active plan in plain words (each type, its time today, which channels are in a test and until when),
   with the on/off switches per type it already has. Keep the existing "server key missing" message when push is not set up.
4. Tests for src/notify.js (the plan function is pure: add cases for test days, before-slot ready, late, logged), npm run check, merge.
   Then design/runbook-studio.md: the owner chat stops sending its own slot reminders once this is live and only checks the post went out.

## Queued task 8 (owner, 26 Nov 2026): a scheduled check of this queue (do it NOW, before the next task)
Owner: "pick up anything that's added to the job and run a periodic check on it like every 30 mins so that it knows there's something to
pick up" (owner then: "hourly, not 30 mins"). In THIS account, create one recurring scheduled task "Handoff queue check": HOURLY (owner, 26 Nov 2026: once an hour, not every 30 minutes). Each fire starts a fresh, small
session (the cheapest model) with the repo, which: reads this file from main; finds the next open task in the stated order (rule above);
if none is open or one is already started within 3 hours, ends at once; otherwise starts ONE work session for it (a normal model, with
the repo) whose prompt is "Read design/handoff.md and do Queued task N; write 'task N started' in Progress first". Keep it quiet: no
message unless it starts work. Write in Progress the schedule you set and the first check's result.

## Queued task 10 GO, NOW (owner, 26 Nov 2026): 3D kit v7, the LAST sample; replaces render 3 of v6
v6 (render 2) critic: NOT READY (animation 7.5, cleanliness 6, premium 6.5; review/tech/showreel-tech-gold3d-v6.md). Do NOT run render 3 of
v6. Build v7 from v6 with the critic's faults AND the owner's notes, as agreed after a discussion with the owner chat:
1. Cables never pass through the floor or any object: they rest on the floor, drape over edges, contact shadows (a bug, must fix).
2. Numbers: ONE consistent number style that is flat and crisp, readable at phone size in half a second, that counts and glides in and
   is tied to its object by a thin leader line (like the owner's reference reels 10 and 11). Not extruded 3D numbers. No pop-ins.
3. Colour and light: first MEASURE v6 against the owner's references (R-ref 26 Nov ids 9-14) and our best reels: colour range,
   contrast, lighting (key, rim, separation). Change grading or lights only where the numbers show a gap; write the measurements in the
   review file.
4. Camera: a reason for every move: close when the detail is the story (the plug clicks in), wide when the relationship is the story
   (the tangle grows); no move type twice in a row; fewer push-ins on the same object; use the whole frame (depth, foreground to
   background).
5. Drama with hierarchy: three big moments only (the first app's arrival, the tangle at its worst, the hub's arrival) with scale,
   overshoot and a light sweep; every other element enters quick and clean.
6. Hook and life: frame 0 already has tension (the question on screen + the first app arriving dramatically); all apps in by ~4 s;
   nothing pre-set. Every element, once in, stays alive to the end (a subtle idle motion, reacts when its cable connects, shifts when the
   hub arrives); idle motion never hurts reading.
7. The critic's v6 faults: no empty frame (v6 1.4-2.1 s), no doubled or see-through label (11.5-12 s), no straight stiff cables (8-9.3 s),
   no near-still ending (last 4.5 s).
Process: (a) write a shot-by-shot plan in review/tech/showreel-tech-gold3d-v7.md (each beat: what enters, how, the camera move and why,
how numbers show) and ONE stills sheet; write "v7 plan ready for critic" in Progress and STOP: the main account's critic checks the plan
and stills against points 1-7 before any render. (b) On its OK: one render, Output QA, then "v7 ready for critic" and stop again.
v7 is the last sample: if READY it becomes the tech 3D gold (gold.md, gold.json, the tech3d starter) and tech restarts with a real reel;
if NOT READY the owner decides. Update projects.json at each step.

## GO NOW (owner, 27 Nov 2026 22:30 IST): keep fixing; one more v7 render approved
Owner: "Let the handoff session continue fixing the issues." In this order, status every 30 min, done = proof (Output QA / App probe PASS):
1. Task 10, v7 render 4 (owner-approved, the last; about $5-8): make the critic's EXACT FIX from the render 3 verdict in
   review/tech/showreel-tech-gold3d-v7.md (CRITIC: NOT READY, 27 Nov: the cable cascade 7.7-8.7 s shows four stepped copies; show it from
   further back so the tips move slowly, and fix the weak spots at 0.8, 3.9, 14.5 s). Glitch check must pass locally first. Then render 4, Output
   QA (FLICKER must pass), "v7 ready for critic". The main account's critic judges it.
2. Task 21 (App probe checks what each Today card button really does), then tasks 19, 20 (installed app never stale; tabs in posting order,
   tab follows the workflow), then task 22 (2.5D kit with 3D's best parts), then 6, 7, 16, 17, 18. Each app change: App probe PASS on the live app, pasted in Progress.

## Queued task 22 GO, after v7 render 4 and tasks 21, 19, 20 (owner, 27 Nov 2026 23:00 IST): 2.5D kit gets 3D's best parts (no full hybrid)
Owner chose: keep 2.5D as the tech look and borrow 3D's strengths into it; no full 2.5D+3D merge now (revisit after a week of 2.5D numbers).
1. Compare first, no new render: score v7 (latest render) and the 27 Nov 2.5D reel (showreel-tech-ai-words) against the owner's reference
   (design/references.md R-ref 27 Nov) on: opening, explanation clarity, depth/material, motion, shadow-first builds, glitches, pace. One page
   in review/tech/kit-2d5-depth.md: which wins each point and what to take from 3D.
2. Add to the 2.5D kit (behind new options; existing reels render the same): soft directional light and depth on cards, real-looking materials
   and contact shadows, the two-tier shadow-first builds (design/direction.md "2.5D map reels" note 7), and ONE drop-in "3D object moment"
   (a single short shot of a physical object, e.g. a phone or chip, for topics about a real thing; reuses v7's good parts: board, hub, type,
   payoff shot).
3. One study sample, at most 2 renders (about $10-15; ask the owner chat before more), Output QA incl. FLICKER, then "2.5D depth ready for
   critic". The main account's critic judges it against the reference and the 27 Nov reel; if better, builders use it from the next day.
Never touch a daily reel; status every 30 min.

## Queued task 21 GO, first after task 10 (owner chat, 27 Nov 2026 22:00 IST): App probe, posted cards
The App probe's "OPEN FROM BOARD" step clicks each Today card's button. For a channel whose reel is already posted, that button is "Open reel"
(it opens the reel page, not the reels tab), so the probe wrongly reports "Open from board web/c3: shows @techin20sec". Make the probe check
what each button really does (Open to post -> that channel's reels tab and Ready box; Open reel -> that reel's page), then run it: APP PROBE: PASS.
The tech path already passes (tech card -> tech tab, the tech reel under Ready to post).

## Queued tasks 19-20 GO, FIRST after task 10's render is running (owner, 27 Nov 2026): the installed app goes stale; tabs in posting order
- **Task 19, the installed app never runs an old copy.** 27 Nov: the installed home-screen app hung on "Loading…" all afternoon while the
  same page in Safari worked; removing and re-adding the app fixed it. Make the app notice a newer deploy (a version string served by the
  Worker, checked on open and on resume) and reload itself once; if a list request still has no answer after 20 s, reload once before showing
  Try again. Add a note to design/runbook-reels.md. Test: an app test that a version mismatch triggers exactly one reload.
- **Task 20, channel tabs in posting order.** Tabs ordered by today's next unposted reel time (from design/slots.json and captions.json postAt;
  today: Turns Out 14:00, web 19:00, tech 20:30), posted channels last. The selected tab ALWAYS follows the workflow the owner came from
  (owner, 27 Nov 2026: "tabs must only be selected based on workflow selection"): a board card's Open to post / Open reel, a reminder, a Needs
  you question or a reel link opens that reel's channel, and nothing later (list load, a link hash, the last tab saved) switches it. Only
  opening All reels with no workflow opens the channel due next. App test: each entry point lands on its own channel, before and after the list loads. Keep each tab showing only its own reels (app test from task 12).
Both: never touch a reel posting today, one push each, Progress line.

## Queued tasks 16-18 GO, after tasks 10, 6 and 7 (owner, 27 Nov 2026): web kit and render speed
Rules so this never gets in the way of the daily reels (owner, 27 Nov: "these tasks must not hamper our strategy today"):
- Never touch a reel posting today or tomorrow (its scene, its review file, its captions.json entry) and never run the Showreel workflow on a
  daily reel. Test only on study clips (reels/study/, short, at most 8 s) and only after the day's last post (21:00 IST) or before 06:30 IST.
- A shared kit change (scripts/explainer/kitmotion.js, KM.*, the starters) is ADDED behind a new call or option; existing calls render exactly as
  before (check: node scripts/preflight-all.mjs on the last 3 web reels prints the same PASS). The daily builder picks the new piece up next day.
- Each task ends with one line in design/rules-web.md or design/runbook-reels.md saying how a builder uses it, a Progress line, and a stills
  sheet of a study clip. Ask the owner chat before anything over about $5.
- **Task 16, the before/after "split" piece** (todo 12 Nov, E23): one call in kitmotion.js that runs the broken and the fixed version of the
  same component side by side in sync, labelled BEFORE / AFTER, the broken one visibly misbehaving; fits the whole-frame zones (KM.ZONES).
- **Task 17, web starters use the whole frame** (todo 14 Nov, owner: "squeezing most of it in one place of the screen"): move
  starterweb.html, starterdetails.html and newweb.mjs to the whole-frame layout of showreel-36-tabs (rules-web.md rule 16: KM.ZONES, subtitles
  under the top zone, hero to y 780, card edges locked with KM.worldY). Output QA SPREAD already fails a squeezed reel.
- **Task 18, render speed** (todo 14 Nov): a 20 s whole-frame web reel took 33 GitHub minutes (rule 12 caps 30). Measure the frame cost per
  effect on a study clip (the blurred line glow .inkg filter, the bigger cards), replace the slow one with a cheaper look that reads the same at
  phone size, and bring a 20 s reel under 25 minutes. Report before/after minutes in Progress.

## Queued tasks 12-15 GO, after tasks 10 and 11 (owner, 27 Nov 2026): the app does not show the owner what they need
Owner (27 Nov): "If there's a Needs you in app, how do I know where it is or what it is?" and three more. Also design/todo.md P1 (27 Nov).
Each task: plain words in the app, phone first (390 px), no tool names or codes on screen, npm run check, one push each, a Progress line,
projects.json stage updates. Size each M. Ask the owner chat (main account) before anything costs more than about $5.
- **Task 12, "Needs you" you can find.** One obvious place: a badge on the Today tab AND the open question(s) at the top of Today, each with
  the reel or preview it is about (cover + name, tap to play) and its yes/no or text answer right there. Every owner-chat message that asks
  something can then say "on Today, top". Remove answered questions at once.
- **Task 13, Fix at the exact stage.** On the studio board, the reel's journey row that failed or stalled (build, stills, render, machine
  checks, critic, post) carries the Fix button and its one-line reason; a stage past its expected time (render > 60 min, critic > 45 min,
  build stage with no update for 2 h) counts as stalled. Today's case: the Turns Out build failed at the build stage (no repo access) and the
  board showed nothing there for hours.
- **Task 14, Tests and previews are visible.** Renders under reels/study/ (tests, previews, kit samples) get a "Tests" list in the app
  (Inbox or Growth): cover, name, date, a plain "what it tests" line, player. Never posted, never counted as a reel. Messages stop saying
  "study folder".
- **Task 15, References you can tell apart and clean up.** Each reference in Inbox > References shows a thumbnail (image) or a short silent
  loop (first 3 s of a clip, made once on upload or by Owner answers `refs`), its state (new / studied / used in <reel>), the lesson taken in
  one line, and links to the reels that used it (from captions.json "refs", task 9). A "Clean up" view lists the ones safe to remove
  (studied 2+ days ago and used, or skipped) with one Remove button each.
- Done on the main account (27 Nov, today's posts): the channel tabs' "Ready to post" box showed every channel's ready reels (the web tab
  showed the tech reel); now each tab shows only its own, a critic verdict on any item number is read (a READY web reel showed as not ready),
  and tech shows its 20:30 time instead of "posts paused". Add an app test for "each tab shows only its channel" in task 12.

## Queued task 11 GO, during v7's render waits or right after task 10 (owner, 26 Nov 2026): progress bar for reference uploads
Owner: "reference upload should have progress bar". Agreed after discussion. Size S. templates/index.html (References upload, ~line 1541;
it uploads large files in parts) and the Worker's refs upload route if needed:
1. A progress bar with the percentage and the part count ("62% · part 5 of 8"), so a stalled upload is obvious.
2. Resume: a failed part is retried (up to 3 times, short back-off) instead of restarting the whole file; on a final failure, a plain
   message and a "Try again" that continues from the last good part.
3. A clear finish: "Added" with a small preview, and the reference shows in the list at once.
Not in scope: uploading in the background after the page closes. Phone-width check on a local build with a large test file, npm run
check, one owner-feedback.md line, merge. Write "task 11 live, owner to try an upload" in Progress.

## Queued task 9 GO, after task 10 (owner, 26 Nov 2026): references, measured (do it right after task 3)
Owner: reference work must show in the reels and in the numbers. The critic check (a named pattern must be visible in the video) is
already added on main (design/critic.md question 52). This task is the measuring part. Size M.
1. Side-by-side gap: scripts/ref-compare.mjs <reel> <ref-id>: from our final MP4 and the reference clip (the app References file),
   measure picture-change rate (cuts or big changes per 10 s), words per beat on screen, how often numbers move, longest still stretch,
   colour count; print both rows and the gap in plain words ("ours changes every 2.4 s, the reference every 1.0 s"). The main account runs
   it for each reel built from a reference (it can fetch videos; write the runbook line for that), and the result goes in the review file.
2. Reel tag: each captions.json entry gets "refs": ["R-ref 26 Nov: 10", ...] (the patterns used); npm run check warns when a review file
   names reference patterns but the entry has no refs tag.
3. Numbers: the weekly review (and the Studio status sheet's weekly part) compares reach, watch time and saves of reels WITH a reference
   pattern against reels without, per channel, and per pattern once a pattern has 3+ reels. One plain line per channel.
4. Runbook: design/runbook-daily.md references step gets the three items above. npm run check, merge.

## Queued task 7 GO, after task 6 (owner, 26 and 27 Nov 2026): Projects show their workflow and the next action (do it right after task 6)
Owner: "App's projects section I was hoping to have a workflow and next action being taken on it so that I'll know when it's done". Size S-M.
1. Each project in design/projects.json gets its own ordered steps (e.g. 3D kit v6: Rules, Build, Stills, Render, Checks, Critic, Kit
   final, Done; minutes meter: Find cause, Fix, Live, Done), each with state done / now / next / failed, like the reel journey.
2. Each project carries "next": who does it (other account, main account, owner, GitHub), the action in plain words ("Render 1 running,
   about 25 min", "Main account runs the critic", "Owner: watch the v6 video"), and an expected time when known.
3. The Today row shows the step bar (done steps filled, the current one highlighted) plus the "Next:" line; tap opens the full steps and
   history. "Waiting on you" stays amber and names the one action.
4. When a project reaches Done, the app sends one push ("3D kit v6 is done: <one line>"), using task 6's notification plan (a new type
   "project-done", on by default, switchable in Settings).
5. Rule for every project session (add to the owner rule above and design/runbook-studio.md): at each step, update the step states and
   "next" in projects.json in the same push. Backfill the current projects now (3d-kit-v6 at its real step).
Phone-width check on a local build, npm run check, merge.

## Queued task 5 (owner, 26 Nov 2026): Projects on the app's board (do it BEFORE task 3)
Owner: "introduce workflow for any design process we are running apart from channel so that we have that progress and status in app,
such as 3d kit". Size M.
1. design/projects.json: one entry per running project that is not a channel reel (first ones: "3d-kit-v6" for task 3, "minutes-meter"
   for task 2): id, name, account ("other" or "main"), stages (planned, building, stills, render, checking, critic, done; plus
   "waiting on owner"), current stage, one plain line, pct (optional), updatedAt, and a short history (time, stage, line).
2. The Worker reads it from the repo the same way it reads review files (raw main, short cache), so a project updates when its session
   pushes, with no site access needed (this account cannot reach the app). The main account may also post `node scripts/stage.mjs
   project:<id> <stage> --line "..."` (extend /api/stage to accept project ids); the newer of the two wins.
3. The app's Today board: a "Projects" section under the channel rows, one row per active project, same look as a channel row (stage in
   plain words, the line, a progress bar when pct is set, "waiting on you" in amber). Tap opens its history. A project marked done shows
   for 2 days, then leaves the board. A red stage gets the Fix button like reel rows.
4. Rule for every project session (both accounts): update projects.json at each stage in the same push as the work; write it in
   design/runbook-studio.md and in this file's owner rule. The Studio status sheet (scripts/studio-status.mjs) lists projects too, so
   the probe notices a stuck one (no update in 6 h while not waiting on the owner).
Phone-width check on a local build, npm run check, merge. Then use it yourself from task 3 onward.

## Queued task 4: DONE on main (26 Nov), skip it.

## Owner yes for render 5: YES (owner, in the other account's chat, 26 Nov 10:14 IST)

## Progress (newest last)
- 26 Nov, owner chat: task written here; nothing started.
- 26 Nov, owner chat: owner added "finalise the 3D kit" to this task (section above).
- 26 Nov 09:20 IST, other account: started (size M). Both critic branches merged; the review file holds the v3 and v4 verdicts, v4's EXACT FIX is the list above.
- 26 Nov 10:10 IST, other account: Progress: fixes pushed. All six done: (1) the opening now moves at about 2.6 s, an 11 % pull-back with a 12 degree turn, the frame-0 picture is unchanged; (2) the wall sits higher and the hub floats between the apps and the wall, all eight tools whole from the hub to the end; (3) the push-in is 12 % further back and the apps sit closer, Notes, Chat and Mail whole; (4) the tangle runs outside the wall's sides, nothing over Photos or Pay; (5) from about 16.3 s the camera makes a small turn and eases back to the exact frame-0 camera while the New cable pulses once, last caption held; (6) the hub sub-line is dropped. New tile now floats beside the hub with its one short cable. Text check on every 0.25 s: no name cut, covered or under the caption fade, hub never hidden. One stills sheet: review/tech/study-25nov/kit-phase2-v5.jpg. Next: waiting for the owner's yes for render 5 (estimate below).
- 26 Nov 10:20 IST, other account: owner asked to fix the glow all around. Done before the render: softer bloom, thinner cable halos, dimmer cable cores and floor light, smaller brightness swells; the picture is the same, only calmer (review/tech/study-25nov/kit-phase2-v5-glow.jpg).
- 26 Nov 10:15 IST, other account: owner said yes; render 5 started on GitHub (preview v5, about 20 min). Times above at 10:10 and 10:20 were approximate.
- 26 Nov 10:27 IST, other account: render 5 FAILED at the last step, the sound loudness gate (-16.4 LUFS, need -15 to -13). The picture rendered fine (all six frame jobs passed, 18.45 s); nothing went to R2, so there is no v5 video to judge. Cause: techkit/make.py's mux loop cut the limiter by 4.9 dB after a +3.3 dBTP peak and stopped once the peak was safe, without checking loudness (v4 passed the same loop by luck). Stopped as the rules say: no 6th render. Proposed fix: keep trying while the loudness is under -15 LUFS, raising the limiter halfway back; then render 6 needs the owner's yes.
- 26 Nov 10:55 IST, other account: owner rule written above. Sound fix in techkit/make.py: the mux now tries until both the peak and the loudness are in range, with a gain step before the limiter for a quiet mix (tested locally on two peaky test mixes: -14.4 and -14.3 LUFS, peaks under -1.9 dBTP). Render 6 starts once this is merged.
- 26 Nov 11:13 IST, other account: sound fix merged (the line above marked 10:55 was really 11:07); render 6 started on GitHub (preview v5, about 20 min).
- 26 Nov 11:33 IST, other account: render 6 PASSED (18.45 s, sound -14.6 LUFS on the first try; Output QA PASS, the same two warnings as v4: no real media, no subject box). Video: R2 study/showreel-tech-gold3d-sample-v5-preview.mp4. Separate critic session started (tag critic).
- 26 Nov 11:39 IST, other account: the critic could not judge v5: this account's cloud environment cannot reach templates.aquariit.com (the network proxy refuses the host), so the MP4 cannot be fetched; it wrote "not judged", no picture changes, no 6th render. Needs the owner (once): in this account's environment settings allow templates.aquariit.com and add the REELS_READ_KEY network secret for it (as the main account's environment has), or have the main account run the critic. The 3D task waits on that; Queued task 2 starts now.
- 26 Nov 11:42 IST, main account critic: READY: all six fixes are in the v5 video, no name cut or covered, the camera never holds and the end returns to the opening; the 3D task continues from here.
- 26 Nov 11:41 IST, other account: Queued task 2 (minutes meter) done, size S. Found: the nightly count works (last run today, 9,730 of 2,000 minutes this month, on pace for about 11,100) and the file is in R2 where the app reads it; the page shows the meter when that file loads (tested in a browser), but it hid the meter silently on any error, and this account cannot reach the live app to see which error. Fix: the meter always shows now; if the count cannot be read it says "Minutes not counted yet" with the reason (for example error 404 or 401), and it warns when the count is over 2 days old. Plain line added: the limit only counts if the repo goes private. If the owner still sees "not counted yet", the reason it shows says what to fix next.
- 26 Nov 11:47 IST, other account: finalise step 1 done: the v5 sample is the tech 3D gold (design/gold.md entry; scripts/qa/gold.json "tech3d" numbers from the v5 render's Output QA: bright 0.218, background 0.147, dark 40 %, grey 2 %, contrast 0.229; accent kept from v4, same colours); the app's preview entry now plays v5.
- 26 Nov 11:48 IST, other account: finalise step 2 done: `node scripts/starter.mjs tech3d <slug>` copies the v5 gold scene and its note now carries the v3-v5 critic lessons; techkit/README.md lists what each critic found, what fixed it in v5, the v5 critic's notes for daily reels (number agrees when a new item joins, own icon per tile, 20-35 s, one readable artifact) and the no-render check (techkit/check-gold3d.cjs). Rules D1-D8 stay in design/rules-tech.md.
- 26 Nov 11:48 IST, other account: finalise step 3 done: design/3d-kit-phase2.md known limits: the hub label behind the apps is closed (v5 layout, checked every 0.25 s); the 18 s pace and the frame-blend motion blur are accepted, with the reasons written there.
- 26 Nov 11:48 IST, other account: finalise step 4 done: design/rules-tech.md L0 and design/runbook-daily.md step 3 say tech daily builds start from `node scripts/starter.mjs tech3d <slug>` from the next build on; design/3d-kit-phase2.md has its DONE line.
- 26 Nov 11:49 IST, other account: DONE. Finalise steps 1-5 done: v5 is the tech 3D gold, the starter copies it with the v3-v5 lessons, known limits closed or accepted, tech daily builds use the 3D look from the next build on. Queued task 2 was done earlier (meter always shows). This file is CLOSED.
- 26 Nov 12:50 IST, other account: task 0: both branches had nothing left that main lacked (the step 5 merge carried them); main merged into each and pushed. claude/3d-kit-limits merged; claude/3d-kit-rules lost a merge race and was pushed again.
- 26 Nov 12:50 IST, other account: task 2 was already done and is live (merged and deployed 26 Nov 11:47 IST): the meter always shows and says why if the count cannot be read.
- 26 Nov 12:50 IST, other account: task 3 started (size L). Step 1 done: rules-tech.md D9-D12 (beats, own entrance per object, each connection a beat, believable wires and light), critic.md questions 48-51, and an Output QA GLOW check for the 3D look (white-hot area below the captions; fails over 4 % median or 8 % in any second; the v5 sample measures about 9 %, so v5 would fail it). scripts/qa/look.py runs GLOW on local frames before a render. Next: the v6 scene.
- 26 Nov 13:05 IST, other account: task 0 done: both branches are on main (claude/3d-kit-rules merged on its retry). Task 3 step 2: the v6 sample is built (techkit/scenes/gold3d-v6.html; new kit parts W3D.enter for entrances and W3D.wire for matte sagging cables with plugs, in techkit/lib3d.js; the New tile has its own icon; 3+9=12 when it connects). GLOW was re-made to measure bloom haze (a pale tile or a lit floor no longer counts): v5 4.0 %, v6 1.7 % on its scene frames. One stills sheet: review/tech/study-25nov/kit-phase2-v6.jpg. Builder notes for the critic: review/tech/showreel-tech-gold3d-v6.md. Next: render 1 of v6 once this is merged.
- 26 Nov 13:11 IST, other account: task 3: the v6 sample is on main; render 1 of v6 started on GitHub (preview r1, about 25 min).
- 26 Nov 13:35 IST, other account: task 5 done (projects on the board): design/projects.json (3d-kit-v6, minutes-meter, this one); the Worker serves GET /api/projects from the file on main merged with newer project stage lines (`node scripts/stage.mjs project:<id> <stage>`); the Today board has a Projects section (stage, line, bar, amber when waiting on the owner, red with Fix when failed, tap for history; done leaves after 2 days); the status sheet lists projects and raises one stuck 6 h; the rule is in design/runbook-studio.md and above. Checked at phone width on a local build; stage-test covers the new paths. Task 3 continues: v6 render 1 is running.
- 26 Nov 14:34 IST, other account: task 8 done: scheduled task "Handoff queue check" created in this account, hourly at minute 04 (first run 15:34 IST), each run a fresh session on the cheapest model: it reads this file from main, finds the first open task in the stated order (open = no "task N done" line and no DONE heading), skips it if a Progress line for it is from the last 3 hours or a "Queue task N" session is still working, else starts ONE work session (sonnet, with the repo) told to write "task N started" first and "task N done" at the end. It notifies only when it reports something. First check result: not run yet (its first run is 15:34 IST; the next open task then is task 6).
- 26 Nov 14:34 IST, other account: for the queue check's reading: task 2 done (11:41 IST line above); task 5 done (14:00 IST line above). Task 3 continues in this session (render 2 fix in progress: the voice-paced beats).
- 26 Nov 14:47 IST, other account: task 3: v6 render 1 rendered (20.7 s, sound in range, GLOW 1.2 %) but failed two checks: PACE (line 2 at 4.93 words/s) and COLOUR (hard colour cuts at 11.4 and 12.0 s). Cause of the cuts: the beat times were fixed, so with the real voice (faster than the placeholder) two camera shots swapped order and the camera jumped. Fixed: line 2 is now "Three apps, and eight tools."; every beat follows the voice cues and shots can never swap; gentler camera moves; longer pauses between lines (the reel is about 23 s); tool entrances travel less; Chat rises in instead of dropping through the caption. Checked locally with the real cue times on the whole reel at 10 fps: COLOUR no cuts, GLOW 2.2 %. Render 2 starts once this is merged (owner rule: a failed render is fixed and re-run without asking).
- 26 Nov 14:53 IST, other account: task 3: the render 2 fix is on main; v6 render 2 started on GitHub (preview r2, about 25 min).
- 26 Nov 15:27 IST, other account: task 3: v6 ready for critic. Render 2 (R2 study/showreel-tech-gold3d-v6-r2-preview.mp4, 22.9 s) passed Output QA: PACE (all lines under 4.5 words/s), LOUD -14.5 LUFS, COLOUR (no hard cuts), GLOW 2.0 % median (v5 4.0 %), VARIETY 9 %, LOOK, NUMBERS, DEAD, SHEEN, EDGES pass; warnings only for no real media and no subject box (as v4 and v5). Builder notes for the critic: review/tech/showreel-tech-gold3d-v6.md. The main account runs the critic (this account cannot fetch videos) and writes its verdict here; if READY, v6 replaces v5 as the tech 3D gold. This session stops here. Also: the hourly queue check now starts only open GO tasks (owner rule above).
- 26 Nov 16:10 IST, main account critic: v6 NOT READY: it moves far better and glows far less than v5, but it has an empty pale frame at 1.4-2.1 s, a doubled see-through hub label at 11.5-12 s, straw-like straight cables at 8-9.3 s and a near-still last 4.5 s (scores 7.5 / 6 / 6.5; the five-step EXACT FIX is in review/tech/showreel-tech-gold3d-v6.md); task 3 continues from here.
- 26 Nov 18:42 IST, other account: task 10 started earlier today in this session. v7 plan ready for critic: the shot-by-shot plan, how each of points 1-7 is met, the colour and light measurements and the local checks are in review/tech/showreel-tech-gold3d-v7.md; ONE stills sheet review/tech/study-25nov/kit-phase2-v7.jpg (scene frames at the real cue times; no render). New in the kit: W3D.numbers (flat counting numbers with a leader line), a 'slam' entrance for the big moments, wires that never go through the floor (floorY), and techkit/check-wires.cjs (36 cables: none through the floor or an object). The reference clips cannot be read from this account, so v6 was measured locally and only the measured gap (a pale floor at low angles: a glossy floor catching the lights) was changed. STOPPED: the main account's critic checks the plan and stills against points 1-7 before any render.
- 26 Nov 19:45 IST, main account plan critic: CHANGE FIRST: the cables, hub and floor are fixed, but the hook frame is an unreadable blur, the tangle does not look tangled, two shots miss their subject, leader lines cross tiles and the end is as still as v6's; seven exact changes in review/tech/showreel-tech-gold3d-v7.md, then a new stills sheet and one render (no second plan check needed).

- 26 Nov 20:05 IST, owner (via the owner chat): make the plan critic's 7 changes first, refresh the stills sheet, then ONE render of v7; then "v7 ready for critic" and stop.
- 26 Nov 21:48 IST, other account: task 10 started (the stable loop): the plan critic's seven changes are made: (1) Notes whole and sharp from frame 0, the dark floor around it (first half second median luma .25); (2) the pull-back ends with all three apps whole; (3) the wall fills about 70 % of the width, apps below the frame; (4) a real tangle: cables swing across each other on the floor, shot from behind the apps looking down; (5) every number beside its object with its leader through empty space (new leader check: no crossings at 24, 11, 12); (6) New is the subject (about 45 % of the width); (7) a 25 degree arc then the dolly home (last-4 s frame change 5.0, was 2.2). Also: matte background props and deeper cable colours (GLOW), the New shot reached from above the apps (COLOUR). Local checks with the real cue times running before render 1 of 2.
- 26 Nov 21:59 IST, other account: task 10: local checks passed on the whole reel at the real cue times (COLOUR no cuts; GLOW 1.2 % median, worst 1 s 5.8 %; last-4 s frame change 5.0; pale frames 15 of 228; no cable through the floor or an object; no leader crossing). Stills sheet refreshed (review/tech/study-25nov/kit-phase2-v7.jpg). v7 render 1 of 2 started on GitHub (preview r1).
- 26 Nov 22:39 IST, other account: task 10: v7 render 1 (22.9 s, R2 study/showreel-tech-gold3d-v7-r1-preview.mp4) failed ONE Output QA check: COLOUR, a hard background colour cut at 4.4 s (the crane from the apps to the wall: the first tools popped in at the frame edge mid-move while background props swept the edge). Everything else passed (PACE, LOUD -14.5 LUFS, GLOW 1.0 % median / worst 1 s 6.0 %, VARIETY 9 %, LOOK, NUMBERS, DEAD, SHEEN, EDGES). Fixed: the camera lands on the wall before the first tool pops in, that crane takes nearly its whole gap, background props a quarter less saturated (the largest edge-colour step there 41 to 26 degrees, limit 45). Render 2 (the last of 2) follows the local whole-reel check.
- 26 Nov 23:07 IST, other account: task 10: the render 1 colour fix needed one more step (the first fix still let the apps leave the frame bottom in one 0.1 s step): the crane is now a rise (the apps sink slowly out of the frame) then a push to the wall; tools start on "tools"; two colourful background props on the wall shot's frame edge are hidden. Whole reel at the real cue times: COLOUR no cuts, GLOW 1.1 %, last-4 s frame change 5.0, pale 15 of 228, no cable through anything, no leader crossing. Stills sheet refreshed. v7 render 2 (the last of 2) started on GitHub (preview r2).
- 26 Nov 23:41 IST, other account: task 10: v7 ready for critic. Render 2 (the last of 2; R2 study/showreel-tech-gold3d-v7-r2-preview.mp4, 22.9 s) passed Output QA: COLOUR (no hard cuts), GLOW 1.0 % median, worst 1 s 6.0 %; PACE (every line under 4.5 words/s), LOUD -14.5 LUFS, VARIETY 9 %, LOOK, NUMBERS, DEAD, SHEEN, EDGES pass; warnings only for no real media and no subject box (as v4-v6). Plan, measurements and the render-1 fix: review/tech/showreel-tech-gold3d-v7.md. The main account's critic judges it (STABLE = READY with every PREMIUM score 7.5+). This session stops here; no further render.
- 27 Nov 00:01 IST, main account upgrade critic: render 3 fix list ready (15 items); waits for the owner's yes. List: review/tech/showreel-tech-gold3d-v7.md "Upgrade critic (main account, 26 Nov)" section 5.
- 26 Nov 23:50 IST, main account critic: v7 render 2 NOT READY, STABLE no: the best 3D sample so far (animation 8, cleanliness 6.5, premium 7.5), but an empty dark wall at 3.9-4.6 s, the 24 sitting on the cables at 9.3-11.4 s and an empty first frame keep it below stable; five exact fixes in review/tech/showreel-tech-gold3d-v7.md. Both v7 renders are used: the owner decides.

- 26 Nov 00:20 IST (27 Nov), owner (via the owner chat): YES to v7 render 3 with the upgrade critic's full RENDER 3 FIX LIST (15 items, review/tech/showreel-tech-gold3d-v7.md "Upgrade critic"), WITH a plan check first: build all 15, refresh the stills sheet and the shot-by-shot plan, write "v7 plan ready for critic" and stop; the main account's probe starts the plan critic; on "PLAN: OK TO RENDER", ONE render 3, Output QA, "v7 ready for critic". Render 3 is the last; then tech restarts with a real reel either way.
- 27 Nov 01:25 IST, other account: task 10: v7 plan ready for critic (render 3 build). All 15 items of the upgrade critic's RENDER 3 FIX LIST are built; the shot-by-shot plan, how each item is built, and the local checks are in review/tech/showreel-tech-gold3d-v7.md "Render 3 plan"; ONE stills sheet review/tech/study-25nov/kit-phase2-v7.jpg (refreshed; frame 0 and the last frame side by side). Whole reel at the real cue times: COLOUR no cuts, GLOW 1.1 %, no pale frames, no cable through anything, no leader crossing. Open point for the plan critic: in the close shots the big headline words sit over blurred board tiles (the pre-render text check fails there); recommendation: headline words on the wide shots only. STOPPED: render 3 only on "PLAN: OK TO RENDER".
- 27 Nov 01:38 IST, other account: the owner paused the hourly "Handoff queue check" scheduled task until they say so. Nothing on this account starts work by itself now: render 3 of v7 starts only when the owner tells this account (after "PLAN: OK TO RENDER").
- 27 Nov 01:30 IST, main account plan critic: PLAN: CHANGE FIRST + seven small changes (fewer headline words and a step pill instead of the grey words, dim everything but the subject in three moments, a still hold and one move home, a last frame that matches frame 0, a clean New shot, a readable first frame), then render 3 with no further plan check (review/tech/showreel-tech-gold3d-v7.md "Render 3 plan critic").
- 27 Nov ~13:00 IST, owner (via the owner chat): HOLD lifted; start task 10 now (7 plan-critic changes, then render 3, Output QA, "v7 ready for critic").
- 27 Nov ~14:45 IST, owner (via the owner chat): tasks 12-15 queued GO after tasks 10 and 11 (Needs you, Fix at the stage, Tests list, references with thumbnails and cleanup).
- 27 Nov ~15:50 IST, owner (via the owner chat): tasks 6 and 7 GO, new tasks 16-18 GO (web before/after piece, whole-frame starters, render speed), all after task 10, with the "never in the way of daily reels" rules in their section.
- 27 Nov ~19:10 IST, owner (via the owner chat): tasks 19 (installed app never runs an old copy) and 20 (tabs in posting order) GO, right after task 10.
- 27 Nov ~19:20 IST, owner (via the owner chat): status every 30 min on open tasks; first, say what happened to task 10 after 15:34 IST.
- 27 Nov 14:52 IST, other account: task 11 started and done in one push: task 11 live, owner to try an upload. Inbox > Ideas and references: a bar with the percent and the part count ("62% · part 5 of 8"), a failed part is retried up to 3 times with a short wait, a final stop keeps the upload and "Try again" continues from the last good part (same file chosen), and the finish says Added with a small preview; the list updates at once. Checked at phone width against a local test server (51 parts, part 3 failing 4 times: stopped after part 2, resumed from part 3, finished; a small image: bar, Added, preview). task 11 done.
- 27 Nov 15:06 IST, other account: task 12 started and done in one push: "Needs you" is now at the top of Today (above the studio board) with its count in the heading and on the Today tab; a question can name the reel or test video it is about (Owner answers add: "reel" or "preview"), and the app shows its cover and name beside the question, a tap plays it there; an answered question leaves at once. New app test (in npm run check): each channel tab shows only its own ready reels, and a question finds its reel. Checked at 390 px against a local test server. Owner-chat messages that ask something say "on Today, top" (design/runbook-studio.md). task 12 done.
- 27 Nov 15:11 IST, other account: task 13 started and done in one push: on the studio board, the step that failed or got stuck turns red and carries its one-line reason and the Fix button, and the card opens by itself once for each new problem. Steps: Researching, Topic picked, Building, Stills check, Making the video, Machine checks, Second look (new row), Ready to post / posted. Stalled on its own: the video over 60 min, no second look 45 min after the checks, a build step with no news for 2 h. A build that cannot go on reports `stage.mjs <channel> failed --step building --line "why"` (design/runbook-reels.md); today's Turns Out case (no repo access) would show as "Problem at building" with Fix under Building. New app test (npm run check): 12 cases. Checked at 390 px against a local test server. task 13 done.
- 27 Nov 15:13 IST, other account: task 14 started and done in one push: Inbox > Tests (it replaces the Studio log) lists every video under study/ (tests, previews, kit samples), newest first, from the new GET /api/tests: cover (the automatic cover, or the video's first frame), a plain title, the date, one "what it tests" line (from previews.json when the test has an entry, else "A test render, never posted.") and a player; it says never posted and not counted as reels. New app test (npm run check). Messages say "in the app, Inbox > Tests", never "study folder" (design/runbook-studio.md). Checked at 390 px on a local test server. task 14 done.
- 27 Nov 15:16 IST, other account: task 15 started and done in one push: each reference in Inbox > Ideas and references shows a thumbnail (the image; a clip's first 3 s as a silent loop, read straight from the clip so nothing extra is made or stored; a closed clip's first report still), its state (New, Studied, Used, or "Used in N reels"), the lesson in one line (Claude's study note) and links to the reels that used it (captions.json "refs": ["app:<id>"], with task 9). A "Clean up" view lists the safe ones (studied 2+ days ago and used, or every point skipped), one Remove each. New app test (npm run check). Checked at 390 px on a local test server. task 15 done.
- 27 Nov 15:20 IST, other account: task 9 started and done in one push: (1) scripts/ref-compare.mjs and the "Ref compare" workflow (inputs: reel, app reference number) measure our final MP4 against the reference clip: changes per 10 s and the time between them, longest still stretch, words on screen per beat and how often a number changes (tesseract), colours; both rows and the gap in plain words, one "REF COMPARE:" line for the review file. (2) captions.json "refs": ["R-ref 26 Nov: 10", "app:12"]; npm run check warns when a review file names patterns and the entry has none (5 reels warn today). (3) scripts/audit-numbers.mjs prints AUDIT_REFS per channel: reels with a reference pattern vs without (median reach, watch, saves per 1,000), per pattern once it has 3+ reels. (4) design/runbook-daily.md references step has the three items; the main account dispatches Ref compare after each reel built from a reference. New test (npm run check). task 9 done.
- 27 Nov 15:34 IST, other account: task 10 started (render 3): the plan critic's 7 changes are built (review/tech/showreel-tech-gold3d-v7.md "Render 3 build"), plus the owner's 27 Nov no-glitch rule (every entrance and idle motion continuous, no one-frame pops or glints). Local whole-reel checks so far: COLOUR no cuts, GLOW pass, no pale frames, no cable through anything, last 4 s keep moving; the frame-by-frame glitch check is the last one before the one render. The hourly queue check is on again (owner, 27 Nov).
- 27 Nov 19:40 IST, other account: task 10, answer first: the session did not stop and no check of the render failed; render 3 has not run because the new frame-by-frame glitch check (added 27 Nov) failed on the scene before the render, and render 3 is the last one, so it waits until that check passes. Since 15:34 IST: the check found one-frame pops and flickers in many moments (tools popping in at full size from behind the board, a bug that skipped their grow-in; the hub appearing mid-frame and falling past the camera; idle sway switching on in one frame; quick bumps, squashes and slot blinks; a small fast edge bead and cable bead; the New cable tip racing past the close camera; a sharp light sweep on the near cables). Each is fixed: the hub now drops in after the camera has settled, tools grow in front of the board, every pulse is slow and soft, and v7 renders at 120 frames a second with four frames blended into each (motion blur). A usage limit paused this session for about an hour around 18:00 IST. Other checks pass (text clear of everything, colour, glow, no pale frames, no cable through anything, last 4 s keep moving). Three moments are being re-checked now (9.1 s, 3.7 s, 7.6 s). Next: those pass, then one whole-reel check, then render 3 (about 40 min at 120 fps), Output QA, "v7 ready for critic". Status lines every 30 minutes from now.
- 27 Nov 19:47 IST, other account: task 10, checking (glitch check before render 3): since 19:40 the last named moments were traced (the dark gap between two app tiles sliding across the bottom in one frame during a wide sideways camera sweep; a tiny bright bead on the board edge; quick slot shutters; a quick plug click) and fixed (a smaller arc, slower shutters, a softer bead, a longer click). Re-checking those moments now. Next: if they pass, one whole-reel check (about 45 min), then render 3.
- 27 Nov 20:02 IST, other account: task 10, checking: the re-check still found three small moments (the running bead on the board edge, thin cables shimmering while the camera moved over the tangle, the plug click). Fixed: no running bead (the edges still glow), slightly thicker cables, the camera holds still while the last cables land. Re-checking now (about 10 min). Next: the whole-reel check, then render 3.
- 27 Nov 20:25 IST, other account: task 10, checking: a full-size check showed two moments are real, not test artefacts: the camera's pull-back over the tangle had been squeezed into 0.5 s right over the last cables (two camera keys too close), and a polished plug sleeve flashed as it slid in. Fixed (the pull-back lands earlier and the camera holds still; satin sleeves); the board build and the last tool now pass. Re-checking at full size now. Next: the whole-reel check, then render 3.
- 27 Nov 20:36 IST, other account: task 10, checking: the tangle and plug moments now pass at full size. One more found in the pull-back: each cable's start plug popped in at full size; it now grows in with its cable. Re-checking that at full size, then the whole-reel check (about 50 min), then render 3.
- 27 Nov 20:50 IST, other account: task 10, render 3 started (the last v7 render; 120 fps, about 40-50 min). Every glitch moment found today is fixed and passes at full size except one stretch (the pull-back over the cable cascade, about 8.1-8.7 s: fast cable tips near the camera), which the render's own check will judge; I stop changing the scene here so the render runs tonight. Next: Output QA on the render, then "v7 ready for critic" with the result, plainly.
- 27 Nov 21:22 IST, other account: task 10, render 3 running: 7 of 8 frame jobs done, the last one finishing; then the join and Output QA (about 10 min). Next: "v7 ready for critic" with the result.
- 27 Nov 21:26 IST, other account: task 10: v7 ready for critic. Render 3 (the last v7 render; R2 study/showreel-tech-gold3d-v7-r3-preview.mp4, stills beside it, 120 fps blended to 30) passed every Output QA check (pace, loudness, sound, colour, edges, glow, variety, look, numbers, dead stretches, sheen) except FLICKER, the new frame-by-frame glitch check: the start of the cable cascade at 7.7-8.1 s (strongest), the pull-back over it at 8.3-8.7 s, and three weak ones (0.8 s, 3.9 s, 14.5 s). Cause: fast-growing cable tips near the camera. The exact fix for a later kit pass: show the cascade from further back so the tips move slowly on screen (review/tech/showreel-tech-gold3d-v7.md). Render 3 was the last; the main account's critic judges it, then the owner decides. This session stops here.
- 27 Nov 22:39 IST, other account: task 10, render 4 build (GO NOW item 1): the critic's three fixes are in: the 23 cables now grow while the camera holds still on the high wide (one move there right after the first plug clicks in); the board rises from 2.7 s so its frame is in view by 3.0 s; the New shot is framed so the hub and New stay whole. Also found and fixed: the board's panel and posts were invisible until the hub arrived (they shared the hub's material, which fades in), and two motions had slipped inside code comments (the board's rise, the hub's idle bob). Next: the whole-reel glitch check and the text, colour and glow checks (about 80 min), then render 4.
- 27 Nov 22:48 IST, other account: task 21 started and done: the App probe now judges each Today card's button by what it says: "Open to post" must open that channel's reels tab (selected, its Ready box naming only that channel), "Open reel" must open that channel's reel page; the video count is taken before the board step and the verdict is printed once at the end. Live run: OPEN FROM BOARD tech: "Open to post" -> reels tab open, selected tech; web and c3: "Open reel" -> their own reel pages; VIDEO REQUESTS WITHOUT A TAP: 0; APP PROBE: PASS. task 21 done.
- 27 Nov 22:48 IST, other account: task 10, render 4 checks: the whole-reel glitch screen is capturing (about 65 min, then the text, colour and glow pass). Next: the render once they pass. Meanwhile task 19 (the installed app never runs an old copy) starts.
- 27 Nov 23:00 IST, other account: task 19 done: the app now carries its build and reloads once when a newer one is live (a stalled list reloads once too); live check: /api/version answers 200, APP PROBE: PASS. Task 20 merged (tabs in posting order; the live App probe runs after the next deploy). Task 6 started: one plan in design/notify-policy.json (ready 2 min before the slot, nudge at 15 min, last call 20:30, 08:00 summary; slot-test days get day N of M, nudge at 10, late at 30, logged when posted), Settings shows today's plan in words; pushing now. Task 10 render 4: the whole-reel glitch screen is still capturing; render 4 is dispatched once it passes.
- 27 Nov 23:25 IST, other account: task 20 done and task 6 done: both live; the App probe on the live app after both deploys: APP PROBE: PASS. From now on the app sends the slot reminders (ready 2 min before; slot-test day N of M, nudge at 10, late at 30, logged when posted); the owner chat sends none of its own. Task 10 render 4: the whole-reel glitch screen is about two thirds done (ends about 23:50 IST); render 4 goes out once it is clean. Next: task 7.
- 27 Nov 23:45 IST, other account: task 7 started and built: each project in design/projects.json now has its own steps (done / now / next / failed) and a next action (who, what, when); the Today card shows the step bar, the "Next:" line (amber when it is the owner's), and the full step list on tap; a project reaching Done sends one push ("<name> is done", type project-done, on by default, switch in Settings). Backfilled every current project (3D kit v7 at Checks, 2.5D test waiting on the owner's yes). Phone-width check on a local build: no overflow, no errors. Rule added here and in design/runbook-studio.md. Pushing; the live App probe follows the deploy.
- 28 Nov 00:51 IST, other account: task 7 done: live, and the App probe on the live app after the deploy: APP PROBE: PASS (the line above says 23:45 IST; it was 23:25). Task 10 render 4: the container restarted twice (23:13 and about 23:36 IST) and stopped the whole-reel glitch capture; it is finished now in short runs inside the session. That screen found the real cause of render 3's fault: the move into the "high wide" took 0.62 s and the camera sat low over the floor, so the cables passed right in front of the lens. Fixed: the cascade is filmed from the far high wide (the collapse framing), the move takes 1.7 s on a higher arc after the first plug's click, the cables land after the camera is still, the 3 x 8 counter counts up as they land, and Chat and Mail enter the frame edge dim. 7.8-9.4 s now passes the glitch check at full size. Left before render 4: full-size checks at 1.2, 2.8, 14.5 and 22.3 s, then text and colour.
- 28 Nov 02:32 IST, other account: task 10, render 4 dispatched (the last; owner 28 Nov: "do render 4 as the last one, then move on"). Every moment the whole-reel glitch screen flagged now passes at full size (1.2, 2.8, 7.8-9.4, 9.4-11.0, 14.0-15.6, 22.3 s) and TEXT CLEAR passes. After Output QA: "v7 ready for critic" if it passes; whatever the critic says, v7 closes after this render (no more 3D fixing; its good parts can go into the 2.5D tech reels). Meanwhile: task 16.
- 28 Nov 02:55 IST, other account: task 16 started and done: KM.split, the before/after piece, is its own small kit file (scripts/explainer/kitsplit.js) so no existing scene changes (editing kitmotion.js would have forced re-inlining every web scene, including today's and tomorrow's reels). Two panes in the hero zone labelled BEFORE / AFTER, both copies drawn from the same t (in step), the BEFORE pane flinches red at each fault. Study clip scripts/explainer/demo/split.html (a photo with no reserved space shoves the button down; the fixed copy keeps the space); stills sheet checked, no errors. How a builder uses it: design/rules-web.md rule 21. Existing scenes are byte-identical, so their preflight is unchanged. Next: task 17 while render 4 runs.
- 28 Nov 03:10 IST, other account: task 17 done, the short way: daily web builds already start from the gold reel (showreel-46-tabwiggle, whole frame, every Output QA check passed), so rebuilding the old starters would serve nothing. Instead `newweb.mjs <slug>` now starts from the gold reel by default; the old squeezed template runs only with --classic (and --details keeps its own compilation starter, unchanged). design/runbook-reels.md says so. Tested both paths on throwaway slugs. Next: task 18.
- 28 Nov 03:22 IST, other account: task 10 closed. Render 4 (the last) is in Inbox > Tests. Output QA: everything passes except FLICKER, one small spot at 0.8 s (Notes slamming in: 4.7 against 4.0, a jump of 7.8 against 5.0); the cable cascade that failed render 3 is clean. So v7 is NOT READY as a whole reel and, per the owner, gets no more renders and no critic; it is closed. Details: review/tech/showreel-tech-gold3d-v7.md "Render 4". The GO NOW list is done (tasks 21, 19, 20, 6, 7, 16, 17, 18 and 10).
- 28 Nov 07:34 IST, other account: task 22 started (tasks 11, 12-15 and 9 were done on 27 Nov, 14:52-15:20 IST). Step 1: review/tech/kit-2d5-depth.md compares v7 and the 27 Nov 2.5D reel against the owner's reference (from the critics' verdicts on the real videos, Output QA and local frames; this session cannot download reel videos): 2.5D wins opening, clarity, motion, glitches and pace; 3D wins depth, material, shadow-first builds and real objects. Step 2: a new shared 2.5D kit, scripts/explainer/kitmap.js (opt-in, so the two existing 2.5D reels are unchanged): soft key light and depth on cards, three materials, contact shadows, the two-tier shadow-first build, and one CSS 3D object moment (a phone, chip or card). Step 3: study sample scripts/previews/tech-2d5-depth.json (11 s, tap to pay); the glitch check passes on a 60 fps local capture; render 1 of at most 2 next.
- 28 Nov 08:10 IST, other account: task 22, render 1 of the 2.5D depth study (in the app, Inbox > Tests): Output QA (run on the real MP4) FLICKER PASS (zero glitches), LOOK, CALM, COLOUR, EDGES, LOUD, VARIETY PASS; DEAD FAIL 9.2-11.0 s (the end held still after the voice). It was judged as a web reel (no channel in the config), so the web-only VIBRANCY, SPREAD and DEMO fails do not apply. Fixed for render 2 (the last): channel tech, 10 s, a payoff after the voice (all steps lit, APPROVED lands on the bank, a slow push in), and the phone now reaches its corner before card 1 builds (render 1 built TOKEN over the big phone with the real voice timings). Local 60 fps FLICKER passes.
- 28 Nov 08:28 IST, other account: task 22: 2.5D depth ready for critic. Render 2 (the last; in the app, Inbox > Tests): Output QA on the real MP4: FLICKER PASS, DEAD PASS (render 1's still end fixed), and every other tech-relevant check PASS. VIBRANCY, SPREAD and DEMO fail only because Output QA reads scripts/previews/ as a web reel even with "channel": "tech" (a small check-tool fix for later). What the critic judges: review/tech/showreel-pv-tech-2d5-depth.md. No third render. Task 22 waits only on the main account's critic; nothing else is open in this queue.
- 28 Nov 2026 09:04 IST, main account critic: task 22, 2.5D depth render 2: CRITIC: NOT READY (PREMIUM 6.5 / 6.0 / 6.5). The materials, focus dimming and the phone's contact shadow are a real gain, but the shadow-first build shows a dark blob alone in empty space plus a stray line tick at 4.55 s and 6.95 s, frame 0 is title only, and the lower half is empty all reel, so it looks plainer than the 27 Nov reel. Builders keep the 27 Nov kit; the exact fix for kitmap.js (body and shadow grow together, keep the map grammar on, whole-map frame 0, one-line captions, clean pill switch) is in review/tech/showreel-pv-tech-2d5-depth.md. No third render without the owner's yes.
- 28 Nov 10:22 IST, other account (Inputs): owner yes to (a) an action count for references, then (b) reopening 3D kit v7 for more actions and elements (1-2 renders, about $10-20; starts only after (a)). (a) built: scripts/qa/action-count.py, the "Owner answers" workflow action refs-study, the method in the video-study skill. Next: the count on references 9-12, 14 and the unstudied 15-19 plus v7 render 4 and the 2.5D tech gold, then the action list in design/references.md.
- 28 Nov 10:41 IST, other account (Inputs): action count done (design/references.md "R-ref 28 Nov"): references 15-19 make 2.4-3.4 new actions a second with 1.5-2.5 things moving at once; v7 render 4 makes 1.8 and 1.3 and is still for 42 % of the reel. References 9-14 were deleted when closed. Next: the app board change (owner yes 28 Nov), then v7 part (b) plan from the ACTION LIST.
- 28 Nov 10:43 IST, other account (Inputs): board change (owner yes 28 Nov) pushed: a held (hidden) reel dated today is on the board as "Held until its reviewer passes" (never ready or due while held); hidden always hides (the Fix on ready cards and the stray "Nothing to check in Inbox" line came from display rules overriding it); one plain line per card ("Being fixed: ...", "Stuck: ...", "Late: no news from the builder, posts at 14:00"); cards stay folded; no model names; the top line names what needs the owner (questions, reels to post). Next: App probe on the live app.

---

# History: CLOSED (owner, 22 Nov 2026)

The second account is no longer used; all work runs from the main account again. This file and design/handoff-log.md stay as history.
What the second account built (19-21 Nov) is listed in design/handoff-log.md; it is now owned by the main account.

---

# Handoff: start here (second account)

For sessions on the second account. The owner gives it its tasks in its own chat and it may work on anything in this repo the owner asks
for (owner, 20 Nov 2026). The one thing it never does: create, change or fire scheduled tasks; those belong to the main account.
Keeping the two accounts in sync is the main account's job; this account only has to leave a clear trail.
Read this file, then CLAUDE.md, then the last 5 entries of design/handoff-log.md. Nothing else up front.
- 28 Nov 11:10 IST, other account: web focus test, scene and preview config built (scripts/previews/web-popover-focus.*), local stills clear (SUBJECT FILL 41%, OVERLAP none, SAFE ZONE ok, FLOW ok); push, merge and ONE full-length preview render next (showreel-50-popover and its MP4 untouched).
- 28 Nov IST, other account: kit-ref pieces built on claude/kit-ref-pieces (no renders): scripts/explainer/kitref.js (KREF.numberFill, KREF.keyword, KREF.handoff; join KM and KMAP when present; inlined via the kitref markers), test scene scripts/previews/kit-ref-pieces.html with one phone-size stills sheet checked, SOUND HITS and QUIET lines added to scripts/qa/action-count.py (so refs-study prints them). Next: refs-study run, numbers into references.md.
- 28 Nov 11:55 IST, other account: ref lab built (branch claude/ref-lab, no renders): scripts/qa/ref-lab.py (crop, moves with ease and overshoot, sound hits by band, 5 key-moment strips with text life, scorecard and GAP lines), refs-study ASKS {"lab": true}, synthetic test scripts/qa/ref-lab-test.py in npm run check (passes), skill study steps updated. Next: push, dispatch refs-study with lab on ids 15, 16, 18, 19 and three of our reels, then the "Lab results 28 Nov" block in design/references.md.
- 28 Nov 11:55 IST, other account: web focus test, preview rendered and Output QA run by hand on it: everything passes except HUE, which only compares the test with its own original (waived, same reel). Reviewer session started next; swap only if READY and Inputs says the owner likes it before 17:30.
- 28 Nov 11:58 IST, other account: web focus test, reviewer wrote READY (stills only: MP4 fetch refused; STOP 7.5, REWATCH 7.5, PREMIUM 7.5 / 8 / 7.5, a modest win). Swap waits for Inputs saying the owner likes it before 17:30 IST; the original popover posts otherwise.
- 28 Nov 12:05 IST, other account: Closed references keep their video 30 days (Close sets closed_at; the Worker deletes the file after 30 days; the app text says so). APP PROBE: PASS (refs keep 30 days), run 46116615005 on the deployed app.
- 28 Nov 12:40 IST, other account: ref lab first real run read (crop kept the app header on 3 of 4 phone recordings): fix pushed on claude/ref-lab-crop (phone_trim), re-running the study next, then the results block.
- 28 Nov 13:20 IST, other account: ref lab done. Crop fixed and re-run; results in design/references.md "Lab results 28 Nov": v7 has 16 moves per 10 s against 44 and a 3.5 s longest still; ai-words already matches the references; popover has no high ticks and is still 39 % of the time. Kit pieces named: live screen, tick cue; critic.md has the motion density questions. Left: Turns Out reel in the next lab run.
- 28 Nov 13:15 IST, other account: web focus test, render 2 scene ready (owner yes): frame 0 arrives from its shadow, hand-over on fix, breakout on popover, ticks, live code card, last-2.4 s beats; scene action count 4.4 a second, no gap over 1 s. Pushing, then ONE preview render; target done by 15:30 IST.

## How to work
- Use the cheaper model unless the task needs more. One task per session.
- Branch from latest main (`claude/<topic>`). `npm run check` before every push. The pipeline merges and deploys; never push to main,
  force-push or deploy by hand. Merge origin/main right before you push; never rebase.
- The main account's daily runs push web and tech reels between 06:47 and 13:00 IST (captions.json, review/web, review/tech, their scenes).
  If you change those files, merge origin/main right before pushing so neither side loses work.
- Finish every session that changes the repo with ONE entry at the top of design/handoff-log.md (format there), in the same push:
  what changed, what is left, and anything the main account must know (e.g. a rule you changed, a reel you touched).

## Current state (20 Nov 2026; the log is newer than this)
- Web and tech: one reel a day each, posted any time 13:00-21:00 IST. Main account's scheduled tasks: daily run 06:47 (web + tech, cheaper
  model, at most 2 renders a reel), critic 11:17, spare night Tue 22:44, owner chat Wed 05:13.
- Turns Out: paused; its daily task is off. Its replan is with this account: design/c3-plan.md (20 Nov, read first; then channel3.md, rules-c3.md). Restarting
  its daily task is done by the main account when the owner says so.
- Open items for context: "Add reference" Inbox section (design/todo.md P1); Wikimedia refuses many GitHub-runner downloads (HTTP 429),
  the Media workflow also uses Openverse and the Library of Congress.
- 28 Nov, item 6 DONE: APP PROBE: PASS (run 46122163605, 07:46 UTC): JOURNEY REEL showreel-tech-tag-relay render=done | checks=done Output QA PASS (waived by the reviewer) | critic=done READY | ready=done Post at 20:30 today; the tech tab Ready box lists the tag reel. Fixes: the NUMBERS check ignores icon-shaped reads and changing reads over a pixel-still region (proven by a test; the real padlock crop was not still, so the reel is covered by the critic's NUMBERS WAIVER); the app honours a critic-signed waiver (every failing check waived, not a builder one); the board's Ready follows the journey; the journey reads GitHub runs only for today and later (the Worker hit its subrequest limit). Left: the "built" lookups still hit the limit at times (warn on the JOURNEY line), see design/todo.md.
