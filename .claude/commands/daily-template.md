---
description: Create today's template on a new branch, verify it, and hand off to the deploy pipeline
argument-hint: [optional theme/purpose hint]
allowed-tools: Bash(git:*), Bash(gh:*), Bash(npm:*), Bash(npx:*), Bash(node:*), Bash(ls:*), Bash(mkdir:*), Bash(cat:*), Bash(cp:*), Bash(ffmpeg:*), Bash(date:*), Bash(TZ=Asia/Kolkata date:*), Read, Write, Edit, Glob, Grep
---

# Daily Template — Autonomous Repo Manager

You own this repository and follow CLAUDE.md. Work without asking for
confirmation unless something is destructive or ambiguous.
Optional hint from user: $ARGUMENTS

## Phase 1 — Repo health and branch
1. ID = output of `TZ=Asia/Kolkata date +%F-%H%M` (India date + current time, e.g.
   2026-10-07-0905). DATE = first 10 chars of ID; TIME = `HH:MM` from the same
   run. Run the date command ONCE and reuse the values everywhere.
2. `git status`. If there are leftover uncommitted changes, stash them with
   a clear message and report it.
3. `git fetch origin`, switch to main, `git pull --rebase`.
4. Confirm CLAUDE.md, wrangler.jsonc, package.json, scripts/check.mjs,
   .github/workflows/pipeline.yml, templates/index.html and
   templates/manifest.webmanifest exist. If any is missing, STOP and report.
5. Several templates per day are allowed. Only if templates/ID/ already exists
   (same minute), STOP and report.
6. If branch template/ID already exists remotely, STOP and report its
   state (open PR? failed checks?) instead of creating a duplicate.
7. Create and switch to branch template/ID from main.

## Phase 2 — Choose a fresh direction
Read design-log.json. Apply the no-repeat rule and rotate through the
creative direction menus in CLAUDE.md. Honor the hint within those rules.
Before coding, state the direction in 3–4 lines and explain why it is
distinct from the last 5 log entries.

Structure check: read the last three lines of design/advancements.md. Your hero composition, main section
module and header style must each differ from all three (menus in design/playbook.md). Do not default to
"eyebrow label, headline, paragraph, centred illustration, buttons, stacked cards".

Era check: read the era of the previous two templates in design/advancements.md. If either is vintage, yours MUST be modern.
Prefer modern product-grade looks (design/playbook.md "Modern direction") and today's CSS (the CSS animation catalogue).

## Phase 2b — One design advancement
Read design/playbook.md and design/advancements.md. Choose ONE technique from the playbook that no earlier
template used (prefer a different playbook group than the last template) and make it the new, visible
"advancement" of this template, on top of the usual quality bar. State it in the direction summary.
Palettes must feel vivid: a saturated hero colour plus an unexpected accent. If you invent a strong new
technique that is not in the playbook, add it there (new line in the matching group).

## Phase 3 — Build
Create templates/ID/index.html following the quality bar, the
"Required in every template" items, and the copyright-safe rules in
CLAUDE.md.

## Phase 4 — Sanity checks (must pass before pushing)
1. `npm install --no-audit --no-fund` (if node_modules is missing).
2. `npm run check`. Fix every error and re-run until it passes.
3. Emulate the iPhone Reel frame (402×715 viewport, `<html class="reel">`) and also a
   plain 402×874 phone: no horizontal overflow, first screen is a finished composition,
   readable type, header looks right with the "All templates" link hidden, key content
   outside Instagram's bottom ≈20%. Take screenshots and look at them. Desktop (1440px)
   must still not break.
3b. Run `node scripts/reel-audit.mjs ID` (see "Alignment with the scroll flow" in CLAUDE.md).
   Open the screenshots it saves in /tmp/reel-audit/ and fix every "CUTS" line (split or
   resize blocks, add gaps, or pin pauses with data-reel-stop) until it says all pauses are
   clean and every pause looks like a finished frame. If Playwright is unavailable, say so.
3b2. The same audit prints SIDE-TIGHT lines when text sits closer than 26px (icons/buttons 18px) to a side: Instagram crops ≈14–20px off each side, so
   inset those (≈30px phone gutters) or mark pure decoration aria-hidden / data-reel-bleed. It also prints TOP-ZONE (a block starting under Instagram's top
   ≈90px bar; the player already offsets the first content to 96px) and RIGHT-ZONE (short right-aligned prices/badges/numbers/buttons in the right 16% of the lower
   half, covered by Instagram's button column: left-align, stack or centre them on phones). It must say "side safety: OK".
3c. Run `node scripts/reel-perf.mjs ID` (smoothness under a simulated slower phone, see "Smooth when
   auto-scrolled" in CLAUDE.md). It must say "smooth"; if it says CHECK, simplify the heaviest effects
   (animated blur/box-shadow/filter, big canvases) and re-run. If Playwright is unavailable, say so.
4. Compare against the last 3 templates; if too similar, revise.

## Phase 4a — Cover preview image
Run `node scripts/make-cover.mjs ID` (needs Playwright). It writes templates/covers/ID.jpg, the finished first screen shown
on the ▶ player's opening cover card (the first frame of the recording, used as the Reel cover). Open the image and make
sure the hero is complete (no half-faded elements); if not, fix the template's entrance timing and re-run. Commit the jpg.

## Phase 4b — Instagram social kit
Create social/ID.md following the "Instagram social kit" section of CLAUDE.md
(hook that opens a loop the ending closes, caption ending with a "Send this to…" share line,
8–12 keywords, exactly 5 hashtags + alternates, Reel plan with length/shot plan/payoff/cover text, music suggestion matched to the template's mood). Base keywords on what the page actually shows.
Reel format B is the current experiment (design/experiments.md): the reel is rendered automatically at about 18 s with the kit's hook shown on screen for the first
~3 s, so write `Length: 15–20 s`, make the hook SHORT (a question of at most 8 words, it is read on screen), and plan the shot plan and payoff to land inside 18 s
(payoff in the last 4 s). Read the latest results table in the "Instagram collect" workflow log, `design/experiments.md` and `design/growth-playbook.md` first, and favour what the numbers say is working. Concept and hook speak to the buyer (a business owner or founder: money, time, results), not only to designers. Read `design/market.md` (people's choice): pick the business, market and currency from what the audience responds to; never present invented results as Aquarii's own.

## Phase 4c — Directed film (the reel format; CLAUDE.md "Directed film" and "Music & Sound", how-to in design/film-playbook.md)
1. `cp -r film/_starter film/ID` (a working generic auto-director: hook words on flat colour → hero → up to 5 shots → closing shot → iris loop). Do NOT ship it unchanged:
   read reel-log.json (last 7 films) and make this film's concept, primary transition and sound direction different, and bend `story.js` around THIS template's signature moment
   (see film/2026-10-13-0851/ for a fully bespoke one). Pages with scroll-driven JS (headings that fill on scroll, parallax) need that progress driven from the film clock.
2. Edit `film/ID/timing.json` (BPM that puts every cut on a beat, hit points, breath) and `film/ID/music-brief.json` (mood, genre, 3-5 instruments, 3 genuinely different interpretations).
   `node scripts/audio/brief.mjs ID` must exit 0 (it refuses off-grid hits and a genre/instrumentation/BPM that repeats the previous film). Never synthesise music in code; with no licensed music source configured the film ships with effects only.
3. Preview: `node scripts/film/render-film.mjs ID --variant A --preview` (about a minute) writes out/film/ID/preview-sheet-A.png. OPEN IT and look at every cut, the first frame, the peak and the last frame
   (the last must equal the first). Score the rubric in CLAUDE.md, fix anything below 8, at most 3 passes. Also `node scripts/film/render-film.mjs ID --variant A --cover` if the story has a `cover()`.
4. Record the film in reel-log.json (concept, motionStyle, transitions, typeTreatment, grade, sound, cover, rubric). Stage film/ID/, audio/<date>/ID/ (brief files only) and reel-log.json with the template.
The Reel publish workflow renders the film after the deploy (and falls back to the screen recording if there is none or it fails).

## Phase 5 — Records and push
1. Append the entry to design-log.json (schema in CLAUDE.md: id=ID, date=DATE,
   time=TIME, url https://templates.aquariit.com/ID/).
2. Copy design-log.json to templates/design-log.json.
2b. Append one line to design/advancements.md: `- ID — technique (playbook group): what it looks like | hero: X | modules: Y | header: Z | era: modern|vintage`.
3. Update README.md: template count and latest template link.
4. Run `npm run check` once more.
5. Stage only files you created or changed (including social/ID.md); commit with the CLAUDE.md format.
6. `git push -u origin template/ID`. If rejected, report and stop.
   Do not merge or deploy yourself; the pipeline does that.

## Phase 6 — Follow the pipeline
If `gh` is available and authenticated, watch the run
(`gh run list --branch template/ID`, then `gh run watch`). If it fails,
read the logs, fix on the same branch, push again, and re-watch (max 2
attempts). If `gh` is unavailable, give the user the Actions page link.

## Phase 7 — Report in chat
Concept, palette, fonts, signature moment, the 5 hashtags and music mood, how it differs from recent
designs, commit hash, pipeline status, and the live URL
https://templates.aquariit.com/ID/
End with the oldest 1-3 open items from design/open-items.md, one line each, as questions to the owner (owner's standing request).
