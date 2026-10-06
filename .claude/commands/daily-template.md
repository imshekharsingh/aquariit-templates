---
description: Create today's template on a new branch, verify it, and hand off to the deploy pipeline
argument-hint: [optional theme/purpose hint, or "redo"]
allowed-tools: Bash(git:*), Bash(gh:*), Bash(npm:*), Bash(npx:*), Bash(node:*), Bash(ls:*), Bash(mkdir:*), Bash(cat:*), Bash(cp:*), Bash(date:*), Bash(TZ=Asia/Kolkata date:*), Read, Write, Edit, Glob, Grep
---

# Daily Template — Autonomous Repo Manager

You own this repository and follow CLAUDE.md. Work without asking for
confirmation unless something is destructive or ambiguous.
Optional hint from user: $ARGUMENTS

## Phase 1 — Repo health and branch
1. DATE = output of `TZ=Asia/Kolkata date +%F`.
2. `git status`. If there are leftover uncommitted changes, stash them with
   a clear message and report it.
3. `git fetch origin`, switch to main, `git pull --rebase`.
4. Confirm CLAUDE.md, wrangler.jsonc, package.json, scripts/check.mjs,
   .github/workflows/pipeline.yml, templates/index.html and
   templates/manifest.webmanifest exist. If any is missing, STOP and report.
5. If templates/DATE/ already exists on main, STOP and report, unless the
   hint is "redo" (then rebuild it on the new branch and replace the log
   entry for DATE).
6. If branch template/DATE already exists remotely, STOP and report its
   state (open PR? failed checks?) instead of creating a duplicate.
7. Create and switch to branch template/DATE from main.

## Phase 2 — Choose a fresh direction
Read design-log.json. Apply the no-repeat rule and rotate through the
creative direction menus in CLAUDE.md. Honor the hint within those rules.
Before coding, state the direction in 3–4 lines and explain why it is
distinct from the last 5 log entries.

## Phase 3 — Build
Create templates/DATE/index.html following the quality bar, the
"Required in every template" items, and the copyright-safe rules in
CLAUDE.md.

## Phase 4 — Sanity checks (must pass before pushing)
1. `npm install --no-audit --no-fund` (if node_modules is missing).
2. `npm run check`. Fix every error and re-run until it passes.
3. Reason through the page at mobile (375px) and desktop (1440px) widths:
   no horizontal overflow, readable type, working nav, "All templates"
   link visible and tappable.
4. Compare against the last 3 templates; if too similar, revise.

## Phase 4b — Instagram social kit
Create social/DATE.md following the "Instagram social kit" section of CLAUDE.md
(hook, caption, 8–12 keywords, exactly 5 hashtags + alternates, Reel plan with
length/shot plan/cover text, music suggestion matched to the template's mood). Base keywords on what the page actually shows.

## Phase 5 — Records and push
1. Append the DATE entry to design-log.json (schema in CLAUDE.md, with url
   https://templates.aquariit.com/DATE/).
2. Copy design-log.json to templates/design-log.json.
3. Update README.md: template count and latest template link.
4. Run `npm run check` once more.
5. Stage only files you created or changed (including social/DATE.md); commit with the CLAUDE.md format.
6. `git push -u origin template/DATE`. If rejected, report and stop.
   Do not merge or deploy yourself; the pipeline does that.

## Phase 6 — Follow the pipeline
If `gh` is available and authenticated, watch the run
(`gh run list --branch template/DATE`, then `gh run watch`). If it fails,
read the logs, fix on the same branch, push again, and re-watch (max 2
attempts). If `gh` is unavailable, give the user the Actions page link.

## Phase 7 — Report in chat
Concept, palette, fonts, signature moment, the 5 hashtags and music mood, how it differs from recent
designs, commit hash, pipeline status, and the live URL
https://templates.aquariit.com/DATE/
