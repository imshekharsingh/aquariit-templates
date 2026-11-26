# Handoff: OPEN (26 Nov 2026): queued tasks 0, 2, 3 (task 3 is the 3D kit v6)

Tasks 0, 2 and 3 are below under their own headings; the v5 task and its history follow. Progress is at the end of the v5 section.

# History: 3D tech look sample v5 (owner, 26 Nov 2026), DONE

The owner runs this task from another Claude account. That session reads this file, does the task, and writes every stage in
"Progress" below (in its pushes). The main account's owner chat reads Progress; there is no other channel between the two.
When the task is done, the session marks it DONE here and the file goes back to CLOSED.

## Owner rule for this account (26 Nov 2026)
Do only the tasks written in this file, in the order given, and report each stage in Progress. No cost estimates, cost lines or cost talk,
here or in chat. Ask the owner only before something the task does not already cover (for example an extra render).

## Owner rule: code fixes come here (owner, 26 Nov 2026)
App and tooling CODE fixes are queued in this file for this account ("Queued task N"), in order. The main account keeps only reel builds,
critics, anything that needs reel videos or the signed-in site, and fixes needed for today's posts. Take queued tasks in this order: 0, 6, 7, 2, 5, 3 (3 may continue while a render runs)
(later numbers after these, in order); report each in Progress.
Every task here is also a project on the app's board: update its entry in design/projects.json at each stage, in the same push as the work (design/runbook-studio.md "Projects on the board").

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

## Queued task 3 (owner, 26 Nov 2026): 3D kit v6, a told story instead of a still scene
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
