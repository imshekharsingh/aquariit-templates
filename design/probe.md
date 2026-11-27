# Studio probe (owner, 26 Nov 2026)

ONE cheap check that replaces the 11:17 "Reel critic" fallback, post checks and one-off reminders. A scheduled task starts a fresh session on
`claude-haiku-5-5` at each time in **design/probe-schedule.json** (every 30 min 06:00-14:00 IST, then hourly to 21:00; 24 a day, about $0.10-0.20
each). Each session reads one status sheet, acts only on what it lists, logs one line and ends. All green = one workflow, one log line, done.

## What the probe is NOT
It never builds, renders, edits a file, pushes, merges, posts to Instagram, creates scheduled tasks or asks the owner a question about taste.
It starts the right session or messages the owner chat, nothing more. No subagents, no polling, no `sleep`.

## Parts
- `.github/workflows/studio-status.yml` ("Studio status", `workflow_dispatch`, read-only) runs `scripts/studio-status.mjs` and prints ONE report; no secrets printed.
- `scripts/probe-log.mjs add|list` writes and reads the probe log in the app's database (`/api/probe-log`, auth STAGE_KEY like `/api/stage`; in a session the
  network proxy adds the key, nothing to set). No git commit per check.
- `scripts/probe-tune.mjs` + `design/probe-schedule.json`: the weekly tune (below).

## The status sheet (what it prints)
`STUDIO STATUS <date> <time> IST`, then:
1. **FEEDBACK**: new owner feedback, the priority **Fix** items (the app's Fix button on a red board row) first, and owner answers waiting.
2. **REELS**: today's and tomorrow's reels per channel with their stage: PLANNED, BUILT, RENDERING, RENDER FAILED, QA RUNNING, QA FAILED, CRITIC PENDING
   (Output QA passed, no verdict), NOT READY (the critic's reason), READY, POSTED (Instagram collect / posted mark), plus the board's own line.
3. **RUNS (last 3 h)**: failed or stuck render, Output QA and pipeline runs (the newest run of each job decides, so a fixed one is not listed).
4. **DUE within 2 h, not ready**: a reel due within 2 h (or up to 3 h late) that is not READY or POSTED.
5. **POSTS made 20-90 min ago** with their first numbers if the collect has them.
6. **PROJECTS** (work that is not a reel; stuck = no update in 6 h; a project at the critic stage, or a "ready for critic" Progress line with no main-account critic line after it, raises START-CRITIC).
7. Last line: `ACTIONS: none` or `ACTIONS: <item> || <item>`; each item is `<KIND> <plain detail> [key,key]`. The keys of anything an earlier check
   handled in the last 6 h are left out by the sheet itself, so nothing is raised twice.

## The probe's exact steps (one fresh haiku session per fire)
1. Dispatch "Studio status" (GitHub MCP `actions_run_trigger`, workflow `studio-status.yml`, ref `main`, repo imshekharsingh/aquariit-templates). The run takes
   about 30-60 s and a session cannot sleep, so do NOT read it right away (27 Nov 2026: the 06:03 and 07:03 probes read a queued run and logged nothing).
   Instead call `send_later` with delay_minutes 2 and the message "Probe: read the Studio status run you dispatched and finish design/probe.md steps 2-5",
   then end the turn. On that wake-up: one `get_job_logs` of the newest run; if it is still running, ONE more `send_later` of 1 minute; if it then is still not done
   or failed, log `found: status sheet not ready/failed` and message the owner chat once (key `blind:workflow`) only if the last probe line was not the same.
2. Read only the last line `ACTIONS: ...` (and the sheet if you need a name).
3. **ACTIONS: none** -> `node scripts/probe-log.mjs add --found "<one line: reels/stages seen>" --acted no` and END. No other call.
4. Otherwise handle each item, in order, and only these kinds:
   - `START-CRITIC <ch> <reel>` (a channel reel): `create_session` with source_url `https://github.com/imshekharsingh/aquariit-templates`, model `claude-opus-5-5`, tags `["critic"]`,
     title `Critic <reel>`, prompt: "Independent critic for <reel> (<ch>). Read CLAUDE.md, design/runbook-reels.md 'Independent critic' and design/critic.md; fetch the
     final MP4 with scripts/reel-fetch.mjs; write the verdict (CRITIC: READY or NOT READY with the exact fix) in review/<ch>/<reel>.md, push a claude/critic-<reel> branch,
     post the board stage with scripts/stage.mjs, message the owner chat session in one line." (The builder normally starts the critic itself; this is the fallback.)
   - `START-CRITIC project:<id> <plan or render, MP4 path or review file> [critic-project:<id>:<time>]` (owner, 26 Nov 2026): the other account cannot judge videos, so
     when it writes "ready for critic" in design/handoff.md Progress (or sets its project to the critic stage) and no main-account critic line follows, the sheet raises this
     ONCE per ready line (the key carries that line's time). Start ONE session: `create_session` with source_url `https://github.com/imshekharsingh/aquariit-templates`,
     model `claude-opus-5-5`, tags `["critic","3d"]`, title `Critic: <id> (<IST date time>)`, prompt (standalone): "Independent critic for the project <id>. Read CLAUDE.md,
     design/critic.md, design/owner-feedback.md (the 26 Nov lines) and design/handoff.md task 10 with its Progress. Judge <what the item says>: a PLAN means the plan and stills
     sheet in the review file; a RENDER means the real MP4: download https://templates.aquariit.com/reels/<path> with curl (the network proxy adds the key; the path is the
     R2 key from the Progress line, e.g. study/...mp4) and look at real frames. Write the verdict in the project's review file ending with the exact verdict line (CRITIC: READY
     or NOT READY for a render; PLAN: OK TO RENDER or PLAN: CHANGE FIRST for a plan) and the PREMIUM scores, with the exact fix when it is not READY. Add ONE line to design/handoff.md Progress
     ('- <date> <time> IST, main account critic: ...', no cost lines). Merge through the pipeline (branch claude/critic-<id>). Then message the owner chat session in one plain
     line with the verdict; for a render verdict also say whether v7 is STABLE (READY and every PREMIUM score 7.5 or more and Output QA passed)." Never start a second critic for the same key.
   - `START-BUILDER <ch> <reel>`: `create_session`, same source_url, model `claude-sonnet-5-5` (Fable only if CLAUDE.md "Sessions" says so for the day), tags `["builder"]`, title
     `<ch> reel <reel>`; prompt: "Build today's <ch> reel <reel>. Follow CLAUDE.md and design/runbook-daily.md steps for that channel, one render, at most 2 renders, post
     board stages, message the owner chat at each stage. The probe started you because it was due <time> and nothing was building."
   - `START-FIX <ch> <reel>`: `create_session` as the builder, prompt: "The critic said NOT READY for <reel>. Read review/<ch>/<reel>.md, apply its EXACT FIX, one render; if that
     would be render 3, stop and message the owner chat for the owner's yes with a cost estimate first." Model sonnet.
   - `OWNER-CHAT <text>`: `list_sessions` (mine, not archived), take the newest session titled "Owner chat ..." and `send_message` it the text in plain words, one line, then
     what is needed from the owner last. Never name run numbers, branches or tool names to the owner. If no owner chat session is open, log it and leave it for the next check.
   Never act on anything that is not an ACTIONS item; never start two sessions for one key; never retry a failed `create_session` more than once.
5. Log once: `node scripts/probe-log.mjs add --found "<what the sheet showed>" --acted yes --what "<started critic for X; told owner chat about Y>" --keys <the keys in the items you handled>`
   (a failed action: `--acted no --what "failed: <why>"`, leave out its key so the next check tries again).
6. End the turn. Do not wait for the sessions you started.

## Log format
One row per check in the app's database: time (IST in the listing), `found` (one short line), `acted` (yes/no), `what`, `keys`.
`node scripts/probe-log.mjs list --hours 24` prints them as `MM-DD HH:MM IST | ACTED|quiet | found | what | keys k1,k2`. Rows older than 45 days are dropped by the app.

## The scheduled-task prompt (fresh session each fire, model claude-haiku-5-5)
> You are the studio probe. Do exactly what design/probe.md "The probe's exact steps" says, in this repo (imshekharsingh/aquariit-templates, branch main): dispatch the
> "Studio status" workflow, read its log once, act only on the last line "ACTIONS:", log one line with scripts/probe-log.mjs, and end. Never build, render, edit or push;
> no subagents; no polling. If ACTIONS is "none", log one quiet line and stop at once.

## Weekly tune (owner, 26 Nov 2026: "as the process aligns we tune it for future with less frequency")
Every Sunday the owner chat (or the spare night, whichever runs first) runs `node scripts/probe-tune.mjs`. It reads the last 14 days of the log and the current times:
- never touched: 06:00-11:00 (the owner's morning check) and the first slot 30 min after each posting slot in design/slots.json (added if missing);
- a :30 slot that never acted in 7 days (at least 3 checks) goes hourly;
- a run of neighbouring slots that never acted in 14 days (at least 6 checks each) is dropped.
It prints the owner's line: `Probe this week: N checks, M acted, now X a day, saving $Y a week`, the new times and the cron lines (IST) for the task. With fewer than 5 days of
log it proposes nothing. The owner chat tells the owner that line first; then `--apply` writes design/probe-schedule.json (in the owner chat's own push) and the task's
cron is updated from the printed lines. A cron line the scheduler rejects (finest allowed step) is reported to the owner, not worked around.
