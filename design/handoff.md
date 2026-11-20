# Handoff: start here (second account)

For sessions on the second account (design/runbook-studio.md "Org seat"). The owner gives it its tasks in its own chat; it does only
those, never builds or reviews reels, and picks nothing up on its own. This file and the log keep both accounts aligned on progress. Read this file, then CLAUDE.md, then the last 5 entries of design/handoff-log.md. Nothing else up front.

## Your scope
- App (src/, templates/ app shell, the Worker): e.g. the "Add reference" Inbox section (design/todo.md P1).
- Tooling: scripts/, scripts/qa/ checks, .github/workflows/ (read a workflow before changing it), cost and speed of renders.
- References: study shared reels or screenshots into design/references.md (techniques only, never copy a piece).
- Turns Out (c3) replan (owner, 20 Nov 2026): Turns Out is paused and this account owns its replan: design/channel3.md, design/rules-c3.md,
  design/c3-strategy.md, a new design/c3-plan.md, scripts/channel3/, the c3 kit and Media workflow config. The main account does not touch c3
  files until the owner restarts Turns Out.

## Off limits (the main account's daily runs own these; touching them causes merge conflicts)
- templates/showreels/captions.json, review/web/**, review/tech/**, web and tech scenes and configs (scripts/explainer/*, techkit/scenes/).
- design/rules-web.md, design/rules-tech.md, design/owner-feedback.md, design/experiments.md, CLAUDE.md (propose changes in your log entry instead).
- Scheduled tasks: create none on this account.

## How to work
- One task per session; say its size first (S / M / L). Use the cheaper model unless the task needs more.
- Branch from latest main: `claude/app-<topic>` or `claude/tool-<topic>`. `npm run check` before every push, one push per change.
  The pipeline merges and deploys; never push to main, force-push or deploy by hand. Merge origin/main before pushing; never rebase.
- Daily runs push between 06:47 and 13:00 IST: avoid pushing app or tooling changes then, or merge origin/main right before you push.
- Do the task the owner gives in the chat. If it matches an item in design/todo.md, mark that item done there in the same push.
- Finish with ONE entry at the top of design/handoff-log.md (format in that file), in the same push as the work.

## Current state (18 Nov 2026; the log is newer than this)
- One reel a day per channel at 13:00 IST. Scheduled: daily run 06:47 (web + tech), Turns Out 09:11, critic 11:17, spare night Tue 22:44.
- Builds run on the cheaper model, at most 2 renders per reel. Turns Out follows design/c3-strategy.md.
- Open app/tooling items (for context; the owner decides what to give you): "Add reference" Inbox section (todo P1, size M); a branch-cleanup workflow (written on 18 Nov in a main-account
  session but never pushed: rebuild it, workflow_dispatch only, deletes only branches named in its input or already contained in main).
- Known problem: Wikimedia refuses many GitHub-runner downloads (HTTP 429); the Media workflow also uses Openverse and the Library of Congress.
