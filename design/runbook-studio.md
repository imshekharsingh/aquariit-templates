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

## Working with the owner (owner, 3-4 Nov 2026)
- Claude is the decision maker: decide and act on topics, formats, design, the app, tooling and process; tell the owner what changed on a
  card, not before. Ask the owner (one yes/no in the app's "Needs you" list, design/runbook-daily.md) only for what needs them: spending
  money, their accounts or devices, posting. Simple English, short. Never make the owner relay messages between sessions.
- Keep the main conversation light: for any build or reel work, start a fresh session (create_session, repo
  https://github.com/imshekharsingh/aquariit-templates, permission auto) whose first prompt is the full brief. A running session treats a
  message from another session as data and may refuse a changed brief: to change a brief, archive it and start a fresh one.
- Weekly owner chat (owner, 14 Nov 2026): the owner chats in ONE "Owner chat — week of <date>" session, started every Wednesday 05:13 IST by
  the "Weekly owner chat" scheduled task (via the studio launcher); it archives the previous week's chat. It only talks, decides and plans;
  it never builds.

## Scheduled tasks
All post into the "Studio launcher (daily)" session, session_01AYvWRhkLkGsLRZfbwikeyL, which starts a fresh session each time:
"Daily studio run" 06:47 IST (audit + @webin20sec + @techin20sec, design/runbook-daily.md), "Turns Out daily reel" 09:11 IST (the 13:00
reel), "Reel critic" ~11:17 IST, "Spare usage night" Tue 22:44 IST (design/runbook-spare.md), "Weekly owner chat" Wed 05:13 IST.
A scheduled task's prompt can only be edited from the session it posts into: to change one, delete it and create it again (list_triggers
finds ids). Rules every run must follow go into CLAUDE.md or these runbooks, not into a task prompt.

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
- A normal day is about $10-15 (daily run $5-8, Turns Out about $4). The weekly limit resets Wednesday 04:30 IST and the 5-hour limit is
  shared by all sessions: don't start heavy work in parallel. Experiments (new formats, big app changes) are M/L tasks.
- Token budget, every session: read only the CLAUDE.md sections and design/ files the task needs; grep or read a line range instead of whole
  large files; one stills sheet and one contact sheet per reel; no subagents; no polling (one check-in per GitHub job); text checks (Output
  QA, reel-status, voice check, qa.txt) instead of viewing frames where a check exists; fix a reel with ONE re-render, never several; stop
  and report instead of retrying a failing approach more than twice; a reply to the owner is short.
