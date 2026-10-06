---
description: Create today's unique webpage template and manage the repo end-to-end
argument-hint: [optional theme or purpose hint]
allowed-tools: Bash(git:*), Bash(gh:*), Bash(npx:*), Bash(ls:*), Bash(mkdir:*), Bash(cat:*), Bash(date:*), Read, Write, Edit, Glob, Grep
---

# Daily Template — Autonomous Repo Manager

You own this repository. Work without asking for confirmation unless
something is destructive or ambiguous. Optional hint from user: $ARGUMENTS

## Phase 1 — Repo health check (every run)
1. Run `git status`. If there are uncommitted changes from a previous run,
   inspect them: commit them if they are valid template work, otherwise
   stash them with a clear message and report it.
2. Run `git pull --rebase` on the default branch to stay in sync.
3. Ensure this structure exists; create anything missing:
   - `templates/` — one folder per template
   - `templates/index.html` — gallery page
   - `design-log.json` — design history (start as `[]`)
   - `CLAUDE.md` — repo conventions (create from Phase 6 if missing)
   - `README.md` — short project overview
   - `.gitignore` — ignore `.DS_Store`, `node_modules/`, `*.log`
4. Validate `design-log.json` is valid JSON and that every entry has a
   matching folder in `templates/`. Fix mismatches and report them.
5. If a folder for today's date already exists, do NOT overwrite it.
   Stop and report unless the user hint says "redo".

## Phase 2 — Choose a fresh direction
Read `design-log.json`. Today's design must differ from every previous entry
on at least 5 of 7 dimensions: layout archetype, palette, font pairing,
signature motif, animation style, mood, page purpose. Never reuse an exact
palette or font pairing. If a hint was given, honor it within these rules.
State the chosen direction in 3–4 lines before coding.

## Phase 3 — Build the template
Follow the design and copyright rules in `CLAUDE.md`. Output a single
self-contained file at `templates/YYYY-MM-DD-<slug>/index.html`.

## Phase 4 — Self-review before committing
- Re-read the file and check: valid HTML structure, no broken tags, no
  external image URLs, no real brand names, responsive breakpoints present,
  `prefers-reduced-motion` handled, alt text and focus states present.
- If `npx` is available, run `npx --yes html-validate` on the file and fix
  any errors (warnings may be noted, not required to fix).
- Compare against the last 3 templates: if it looks too similar in layout
  or palette, revise before continuing.

## Phase 5 — Update records and ship
1. Append today's entry to `design-log.json`.
2. Regenerate `templates/index.html` gallery, newest first, with date,
   name, mood, and one-line description for each template.
3. Update the template count and latest entry in `README.md`.
4. Stage only the files you created or changed (never `git add -A` blindly).
5. Commit: `template: YYYY-MM-DD <slug> — <one-line concept>`
6. Push to the current branch. If the push is rejected, pull with rebase,
   resolve conflicts in log/gallery files by merging both sides, and retry
   once. If it still fails, stop and report.
7. If working on a non-default branch and `gh` is available, open a PR
   titled `Daily template: YYYY-MM-DD <slug>`.

## Phase 6 — CLAUDE.md contents (create if missing)
Include: the design quality bar, the copyright-safe rules (original copy,
invented brand names, inline SVG/CSS visuals only, OFL/Apache fonts only,
no cloned sites or themes), the folder/naming convention, and the commit
message format.

## Phase 7 — Report in chat
Briefly report: repo fixes made (if any), the concept, palette, fonts,
signature moment, how it differs from recent designs, commit hash, and
push/PR status.

## Never do
- Force-push, rewrite history, or delete branches
- Delete or modify past templates (unless fixing a broken record)
- Commit secrets, large binaries, or files outside this project
