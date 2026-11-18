# Handoff: start here (second account)

For sessions on the second account (design/runbook-studio.md "Org seat"). It never builds or reviews reels; it improves the app and the
tooling and studies references. Read this file, then CLAUDE.md, then the last 5 entries of design/handoff-log.md. Nothing else up front.

## Your scope
- App (src/, templates/ app shell, the Worker): e.g. the "Add reference" Inbox section (design/todo.md P1).
- Tooling: scripts/, scripts/qa/ checks, .github/workflows/ (read a workflow before changing it), cost and speed of renders.
- References: study shared reels or screenshots into design/references.md (techniques only, never copy a piece).

## Off limits (the main account's daily runs own these; touching them causes merge conflicts)
- templates/showreels/captions.json, review/**, scenes and reel configs (scripts/explainer/*.json, scripts/channel3/*.json, techkit/scenes/).
- design/rules-*.md, design/owner-feedback.md, design/experiments.md, design/c3-strategy.md, CLAUDE.md (propose changes in your log entry instead).
- Scheduled tasks: create none on this account.

## How to work
- One task per session; say its size first (S / M / L). Use the cheaper model unless the task needs more.
- Branch from latest main: `claude/app-<topic>` or `claude/tool-<topic>`. `npm run check` before every push, one push per change.
  The pipeline merges and deploys; never push to main, force-push or deploy by hand. Merge origin/main before pushing; never rebase.
- Daily runs push between 06:47 and 13:00 IST: avoid pushing app or tooling changes then, or merge origin/main right before you push.
- Pick work from design/todo.md (P1 first, app and tooling items only). Mark an item done there in the same push.
- Finish with ONE entry at the top of design/handoff-log.md (format in that file), in the same push as the work.

## Current state (18 Nov 2026; the log is newer than this)
- One reel a day per channel at 13:00 IST. Scheduled: daily run 06:47 (web + tech), Turns Out 09:11, critic 11:17, spare night Tue 22:44.
- Builds run on the cheaper model, at most 2 renders per reel. Turns Out follows design/c3-strategy.md.
- Open for this account: "Add reference" Inbox section (todo P1, size M); a branch-cleanup workflow (written on 18 Nov in a main-account
  session but never pushed: rebuild it, workflow_dispatch only, deletes only branches named in its input or already contained in main).
- Known problem: Wikimedia refuses many GitHub-runner downloads (HTTP 429); the Media workflow also uses Openverse and the Library of Congress.
