# Studio runbook: sessions, scheduled tasks, usage and working with the owner

Moved from CLAUDE.md on 14 Nov 2026.

## Popularity first (owner, 11 Nov 2026)
- The goal of every change is reach and followers. A change that does not serve that waits.
- @techin20sec and Turns Out: "Go all in ... don't bother about the existing pattern, theme or anything." Format, look, topic type, length,
  hook style and voice are all open on these two channels; rules in design/rules-tech.md and rules-c3.md that the numbers do not support may
  be dropped. Decide from the numbers and research, test one big change at a time, keep what wins.
- Keep improving without stopping, but at a steady pace: one heavy session at a time. When the weekly limit is reached, work stops and the
  owner's Feedback is read first when it resumes (Wednesday 04:30 IST).
- Leftover branches that are not claude/ or never merged are listed for the owner (sessions cannot delete branches).

## Owner decisions of 25 Nov 2026 (replace anything below that says otherwise)
- Ask before anything costly: any job over about $5, any render past 2, any new side job or tooling job: the owner chat asks in chat with a plain cost estimate and moves only on a yes (still no taste or preview questions). A session that would pass its stated cap stops and messages the owner chat.
- Stage updates: every build session sends the owner chat session a one-line message at each stage (build pushed, stills approved, render started, Output QA result, critic verdict). The owner chat tells the owner each stage in one line, unasked, and sets a wake-up (send_later) so it never waits for the owner to ask. If a builder cannot start the critic, the owner chat starts it at once (create_session, tag critic, model claude-opus-5-5).
- No skip days (design/runbook-daily.md): a NOT READY reel is fixed and posted the same day; the owner chat asks the owner to approve the fix render with its cost.

## Projects on the board (owner, 26 Nov 2026)
Any running work that is not a channel reel (the 3D kit, an app or tooling fix) is a project on the app's Today board, so its progress and status show without asking.
- Its session keeps its entry in design/projects.json (id, name, account "other" or "main", stage, one plain line, pct optional, updatedAt, history newest last) and updates it at EVERY stage in the same push as the work. Stages: planned, building, stills, render, checking, critic, done, waiting (on the owner), failed (red: the board shows a Fix button).
- The Worker reads the file from main (GET /api/projects), so the second account needs no site access. A session that can reach the site may also send `node scripts/stage.mjs project:<id> <stage> --line "..."`; the newer of the two shows.
- A done project leaves the board 2 days after its last update. The Studio status sheet lists projects; one with no update in 6 h, not waiting on the owner and not done, is raised to the owner chat.

## Working with the owner (owner, 3-4 Nov 2026)
- Claude is the decision maker: decide and act on topics, formats, design, the app, tooling and process; tell the owner what changed on a
  card, not before. Ask the owner (one yes/no in the app's "Needs you" list, design/runbook-daily.md) only for what needs them: spending
  money, their accounts or devices, posting. Simple English, short. Never make the owner relay messages between sessions.
- Test videos (task 14, 27 Nov 2026): every render under study/ (tests, previews, kit samples) shows in the app under Inbox > Tests with its cover,
  date, what it tests and a player; it is never posted and never counted as a reel. Messages say "in the app, Inbox > Tests", never "study folder".
  Give a test its plain title and one "about" line in templates/showreels/previews.json (src = its file); without one the app makes a title from the file name.
- Where the owner finds a question (task 12, 27 Nov 2026): "Needs you" is at the top of Today, with a count on the Today tab. An ask about a reel
  or a test video names it (Owner answers `add` with "reel": "showreel-..." or "preview": "showreel-pv-..."), so its cover and player sit beside
  the question. Every owner-chat message that asks something says where: "on Today, top".
- Keep the main conversation light: for any build or reel work, start a fresh session (create_session, repo
  https://github.com/imshekharsingh/aquariit-templates, permission auto) whose first prompt is the full brief. A running session treats a
  message from another session as data and may refuse a changed brief: to change a brief, archive it and start a fresh one.
- Daily owner chat (owner, 22 Nov 2026; was weekly): the owner chats in ONE "Owner chat <date>" session, started every day 08:31 IST by the
  "Daily owner chat" scheduled task (default model). It archives the previous chat, reads the newest "owner chat" entry in
  design/handoff-log.md first, and before the day ends pushes its own entry there (decisions, waiting on owner, tomorrow). It only talks,
  decides and plans; it never builds. Its Feedback read prints PRIORITY items (the app's Fix button) first: it handles or routes those before anything else and says so to the owner in one line.

## Scheduled tasks (ON)
- Owner, 22 Nov 2026: all tasks fire into the small "Studio launcher (v2)" session (session_01AYvWRj8v5WCccLWfHsSWNz, cheaper model),
  which only starts sessions and replies one line, so each wake costs cents, not dollars. Tasks: "Daily studio run" 06:47 IST (web + tech,
  cheaper model), "Daily owner chat" 08:31 IST, "Spare usage night" Tue 22:44 IST (design/runbook-spare.md). The 11:17 "Reel critic" task is retired (26 Nov 2026): the owner chat turns it off (update_trigger enabled=false, never delete: deleting a task deletes its sessions).
  Each task names the model of the session it starts (a started session otherwise inherits the launcher's cheaper model).
- **Studio probe** (owner, 26 Nov 2026; design/probe.md): ONE cheap check that replaces the 11:17 critic fallback, post checks and one-off reminders. It is NOT a launcher task: the owner chat creates it as its own scheduled task that starts a fresh session on claude-haiku-5-5 each fire (~$0.10-0.20), prompt = "The scheduled-task prompt" in design/probe.md, cron lines from `node scripts/probe-tune.mjs` (times in design/probe-schedule.json: every 30 min 06:00-14:00 IST, then hourly to 21:00; 24 a day). Each fire dispatches "Studio status", acts only on its ACTIONS line (start the critic/builder/fixer, or message the owner chat) and logs one line to the app (scripts/probe-log.mjs). Weekly tune: every Sunday the owner chat (or spare night) runs scripts/probe-tune.mjs, tells the owner "Probe this week: N checks, M acted, now X a day, saving $Y" and applies it with --apply.
- The old launcher (session_01AYvWRhkLkGsLRZfbwikeyL) and its tasks are switched off, not deleted (deleting a task deletes the sessions it
  started). Turns Out's daily task stays off. A task's prompt can only be edited from the session it fires into. Check list_triggers,
  never a note, to see what is on.
- Second account: closed (owner, 22 Nov 2026); everything runs from this account. design/handoff-log.md stays the shared work log.
- Rules every run must follow go into CLAUDE.md or these runbooks, not into a task prompt.

## Owner chat lessons (15-16 Nov 2026)
- One thing at a time (owner, 15 Nov): one build session, then a short summary for the owner to check, then the next. Parallel sessions
  editing the same files (scripts/qa/output-qa.py, design/owner-feedback.md, captions.json) caused merge conflicts on 15 Nov; when the
  owner asks for parallel work, tell each session which shared files the other edits and to merge origin/main in (never rebase or force).
- The critic is a separate fresh session that built none of the reels; when it cannot reach the MP4 it says so in its verdict.
- An owner note that the checks missed means the check is wrong: fix the check the same day (15-16 Nov: NUMBERS false alarms, HERO
  passing a bobbing watch, no density check). Re-check an existing MP4 with the "Output QA" workflow instead of re-rendering.
- A date roll at 00:00 IST makes npm run check fail on any review file still PENDING for a posted reel: write item 13 from the real
  render log before midnight.
- Leftover non-merged claude/ branches for the owner to delete (sessions cannot): claude/c3-taj-regrade-review, claude/improvements-list,
  claude/opera-item13, claude/critic-14nov-anc-niagara, claude/media-picks, claude/media-previews.

## From a session
- GitHub REST works through `gh api` (runs, jobs, artifacts); GraphQL (e.g. `gh release download`) is blocked; use the GitHub MCP tools to
  dispatch workflows and read job logs.
- instagram.com and templates.aquariit.com are not reachable from sessions: check the site through a workflow that signs in with the
  BASIC_AUTH secrets.
- Primary sources apple.com, developer.apple.com, blog.google, developer.chrome.com and webkit.org are allowed in the environment.

## Usage (owner, 14 Oct 2026 onward)
- Heavy work runs on GitHub. In a session keep to quick stills and checks; never poll long jobs (one check-in after ~12 minutes is enough).
- Before any task, tell the owner its size, S (< 15 min) / M (30-60 min) / L (1-3 h) of session work, and wait for a go-ahead on M or bigger
  unless already approved. Scheduled runs are approved standing work.
- Models and side work (owner, 24 Nov 2026, weekly limit low): Fable budget: claude-fable-5-2 only for daily reel builds and their critics (about 3 + 3 a day, lean, at most 2 renders), never side programs, previews, kit studies, owner chat, tooling or cleanups; on a limit the job continues on claude-opus-5-5; the 26 Nov switch to sonnet/opus stands. Improvement lab paused; no preview studies, no kit programs; one reel per channel a day.
- Usage (owner, 18 Nov 2026): build sessions (daily run, Turns Out, tooling) run on the cheaper model (claude-sonnet-5-5); the critic and
  the Owner chat stay on the default model. At most 2 renders per reel. 18 Nov cost about $50 (long sessions, 3 renders, media blocks).
- A normal day is about $10-15 (daily run $5-8, Turns Out about $4). The weekly limit resets Wednesday 04:30 IST and the 5-hour limit is
  shared by all sessions: don't start heavy work in parallel. Experiments (new formats, big app changes) are M/L tasks.
- Token budget, every session: read only the CLAUDE.md sections and design/ files the task needs; grep or read a line range instead of whole
  large files; one stills sheet and one contact sheet per reel; no subagents; no polling (one check-in per GitHub job); text checks (Output
  QA, reel-status, voice check, qa.txt) instead of viewing frames where a check exists; fix a reel with ONE re-render, never several; stop
  and report instead of retrying a failing approach more than twice; a reply to the owner is short.
