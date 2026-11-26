# Handoff: OPEN for one task (owner, 26 Nov 2026): 3D tech look sample v5

The owner runs this task from another Claude account. That session reads this file, does the task, and writes every stage in
"Progress" below (in its pushes). The main account's owner chat reads Progress; there is no other channel between the two.
When the task is done, the session marks it DONE here and the file goes back to CLOSED.

## Owner rule for this account (26 Nov 2026)
Do only the tasks written in this file, in the order given, and report each stage in Progress. No cost estimates, cost lines or cost talk,
here or in chat. Ask the owner only before something the task does not already cover (for example an extra render).

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
Take it up after the 3D task is DONE (or now, if the 3D task is waiting on the owner). Size S, no renders.
- The owner cannot see the "GitHub minutes" meter in the app's settings sheet. It is hidden until /api data loads: templates/index.html
  (id "use", ~line 651; loader ~line 1646-1656, which hides it silently on any error), fed by the nightly "Actions usage" workflow
  (.github/workflows/actions-usage.yml, scripts/actions-usage.mjs) writing c/showreel-usage-actions.json to R2.
- Find why it stays hidden (workflow failing? file missing in R2? the loader's request or field names?) and fix it; if the data cannot load,
  show the meter with a plain "minutes not counted yet" line instead of hiding it.
- Why the owner needs it: deciding whether to make the repo private (private repos get 2,000 free minutes a month, then pay per minute).
- Write each stage in Progress below; one handoff-log entry.

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
