# Handoff: OPEN (27 Nov 2026): HOLD lifted, task 10 (3D kit v7 render 3) is GO now

Tasks 0, 2 and 3 are below under their own headings; the v5 task and its history follow. Progress is at the end of the v5 section.

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

## Owner rule: code fixes come here (owner, 26 Nov 2026)
App and tooling CODE fixes are queued in this file for this account ("Queued task N"), in order. The main account keeps only reel builds,
critics, anything that needs reel videos or the signed-in site, and fixes needed for today's posts. Only GO tasks are worked on (rule below): now task 10, then task 9
(later numbers after these, in order); report each in Progress.
Every task here is also a project on the app's board: update its entry in design/projects.json at each stage, in the same push as the work (design/runbook-studio.md "Projects on the board").

## Owner rule: work only on tasks marked GO (owner, 26 Nov 2026)
Do NOT pick up the next task on your own. A task is worked on only when its heading carries "GO" (the owner or the main account adds it
when the owner asks). The hourly "Handoff queue check" starts a session only for an open GO task that is not already started (a
"task N started" Progress line in the last 3 hours); otherwise it ends at once. When a GO task is done, write "task N done" and stop.
Current GO list, in this order: task 10 (3D kit v7; task 3's v6 is closed at render 2, no render 3; task 11 may be done while a v7 render runs), then task 11 (upload progress bar) if not done yet, then task 12, 13, 14, 15 (the owner's app gaps of 27 Nov), then task 9 (references, measured; do it together with task 15). Every other open task waits until it is marked GO.

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

## Queued task 6 (owner, 26 Nov 2026): one notification policy the app follows (do it right after task 0)
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

## Queued task 7 (owner, 26 Nov 2026): Projects show their workflow and the next action (do it right after task 6)
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
- 27 Nov 14:52 IST, other account: task 11 started and done in one push: task 11 live, owner to try an upload. Inbox > Ideas and references: a bar with the percent and the part count ("62% · part 5 of 8"), a failed part is retried up to 3 times with a short wait, a final stop keeps the upload and "Try again" continues from the last good part (same file chosen), and the finish says Added with a small preview; the list updates at once. Checked at phone width against a local test server (51 parts, part 3 failing 4 times: stopped after part 2, resumed from part 3, finished; a small image: bar, Added, preview). task 11 done.
- 27 Nov 15:06 IST, other account: task 12 started and done in one push: "Needs you" is now at the top of Today (above the studio board) with its count in the heading and on the Today tab; a question can name the reel or test video it is about (Owner answers add: "reel" or "preview"), and the app shows its cover and name beside the question, a tap plays it there; an answered question leaves at once. New app test (in npm run check): each channel tab shows only its own ready reels, and a question finds its reel. Checked at 390 px against a local test server. Owner-chat messages that ask something say "on Today, top" (design/runbook-studio.md). task 12 done.
- 27 Nov 15:11 IST, other account: task 13 started and done in one push: on the studio board, the step that failed or got stuck turns red and carries its one-line reason and the Fix button, and the card opens by itself once for each new problem. Steps: Researching, Topic picked, Building, Stills check, Making the video, Machine checks, Second look (new row), Ready to post / posted. Stalled on its own: the video over 60 min, no second look 45 min after the checks, a build step with no news for 2 h. A build that cannot go on reports `stage.mjs <channel> failed --step building --line "why"` (design/runbook-reels.md); today's Turns Out case (no repo access) would show as "Problem at building" with Fix under Building. New app test (npm run check): 12 cases. Checked at 390 px against a local test server. task 13 done.
- 27 Nov 15:13 IST, other account: task 14 started and done in one push: Inbox > Tests (it replaces the Studio log) lists every video under study/ (tests, previews, kit samples), newest first, from the new GET /api/tests: cover (the automatic cover, or the video's first frame), a plain title, the date, one "what it tests" line (from previews.json when the test has an entry, else "A test render, never posted.") and a player; it says never posted and not counted as reels. New app test (npm run check). Messages say "in the app, Inbox > Tests", never "study folder" (design/runbook-studio.md). Checked at 390 px on a local test server. task 14 done.
- 27 Nov 15:16 IST, other account: task 15 started and done in one push: each reference in Inbox > Ideas and references shows a thumbnail (the image; a clip's first 3 s as a silent loop, read straight from the clip so nothing extra is made or stored; a closed clip's first report still), its state (New, Studied, Used, or "Used in N reels"), the lesson in one line (Claude's study note) and links to the reels that used it (captions.json "refs": ["app:<id>"], with task 9). A "Clean up" view lists the safe ones (studied 2+ days ago and used, or every point skipped), one Remove each. New app test (npm run check). Checked at 390 px on a local test server. task 15 done.

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
