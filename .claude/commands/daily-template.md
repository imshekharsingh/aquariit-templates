---
description: Create today's template on a new branch, verify it, and hand off to the deploy pipeline
argument-hint: [optional theme/purpose hint]
allowed-tools: Bash(git:*), Bash(gh:*), Bash(npm:*), Bash(npx:*), Bash(node:*), Bash(ls:*), Bash(mkdir:*), Bash(cat:*), Bash(cp:*), Bash(ffmpeg:*), Bash(date:*), Bash(TZ=Asia/Kolkata date:*), Read, Write, Edit, Glob, Grep
---

# Daily Template — Autonomous Repo Manager

You own this repository and follow CLAUDE.md. Work without asking for
confirmation unless something is destructive or ambiguous.
Optional hint from user: $ARGUMENTS

## Phase 0: reel days only (owner, 15 Oct 2026)
Run `TZ=Asia/Kolkata date +%a`. On Tue, Thu or Sat: do nothing else; reply "Not a reel day (Mon/Wed/Fri/Sun only)" and stop.

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
**Service first (owner, 14 Oct 2026):** read design/services.md and the previous film's `film/*/manifest.json` (`dna.service`). Pick today's service line
(web | social | security | edge; `studio` rarely), never the previous one, and one buyer pain from that line. That pain is the reel; the template is the proof.
Where it helps, choose a template purpose that suits the service (design/services.md "What the template is for now").
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
3b. (Fallback only) `reel-audit.mjs` / `reel-perf.mjs` are not needed: the reel is the film. Run them only if the film failed and the recording will be used.
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
(payoff in the last 4 s). Read the latest results table in the "Instagram collect" workflow log, `design/experiments.md` and `design/growth-playbook.md` first, and favour what the numbers say is working. Concept and hook speak to the buyer (a business owner or founder: money, time, results) about OUR service of the day (design/services.md), never about the template's
fictional business: add `## Service` (the line), keep the template's brand name out of Hook and Caption (check.mjs refuses it), and end on a CTA to us ("DM us 'SITE'"). Read `design/market.md` (people's choice): pick the business, market and currency from what the audience responds to; never present invented results as Aquarii's own.

**READ FIRST (owner plan, 15 Oct 2026): design/aligned-plan.md overrides CLAUDE.md and this file where they differ.** Runs are Mon/Wed/Fri/Sun only.
Every film: (1) one service, in the plan's order of priority (design + SEO, then CDN/speed/protection, then security + maintenance; still never the same as the previous film);
(2) one of the four reel types in rotation (problem -> fix, mini tutorial, makeover, offer) and record it as `S.dna.format`; (3) the reel recipe: 8-10 shots in 18 s, a cut
every 1.5-2.5 s (wide, push-in via P.camera, close-up, full-width type card), hook filling the width in the first second, one visible change per shot, payoff at 13-16 s;
(4) brand kit: P.BRAND colours, Archivo + Geist Mono, pill captions, and `P.brandEnd({ keyword })` from ~16.1 s instead of P.signoff (design/brand/kit.md); (5) film/ID/voice.md
(English AI voice, "we", one line per shot, <= 3 words/s, first line = hook, last = "DM us 'KEYWORD'"), voiced on GitHub automatically; (6) never show prices ("DM us for
pricing that fits your needs") and never invent years, clients, results or testimonials. Before pushing, render 4-6 `--stills` and ask: is there a new picture every 2 s? The
quality gate on GitHub (scripts/film/reel-gate.py: 6+ cuts, no framing held 3 s, live ending) rejects reels that are not; a rejected reel costs a day.

## Phase 4c — Directed film (the reel; CLAUDE.md "Directed film"; how-to design/film-playbook.md)
0. **Design like the motion logo** (design/film-playbook.md): poster-first (4-6 finished key frames before code), one visual idea that transforms, logo-grade craft, the motion logo as sign-off.
   Machines: when the service can be shown as one working object, build it with P.iso (design/film-playbook.md "Isometric machines"). First use (15 Oct 2026): the edge service as a sorting machine; the owner judges that reel before machines become a regular option.
1. **Concept first (3 lines):** the buyer's pain in today's service line, what Aquarii delivers (the mechanism the film shows), the payoff image. Pick a format from
   design/services.md (service ad, cheat sheet, before/after, explainer, what you get, myth vs fact). Every reel still looks like its own piece: pick the ground
   (black / deep colour / light), the accent and the caption style for THIS film. The template appears only as proof ("a site we designed", "the site we protect").
2. **Pick the combination:** read the previous film's `film/*/manifest.json` (newest `made`) and choose, for opener, transition, mechanism, focus, payoff, type, captions and cta,
   options from scripts/film/parts.js (the header lists them) that differ from it in opener, transition, mechanism and payoff. Read design/inspiration.md and **add one new
   trick to parts.js** (a new part or option, tagged with `P.use(slot, id)`) and use it in this film.
3. `cp -r film/_starter film/ID`, then write the story around the concept with those parts. Declare `S.dna = { service, opening, bigMoment, ground, music }`. End with `P.signoff()`.
   The last caption before the sign-off is a **send line** naming who should get it ("Send this to a founder doing IT alone"): reach is the bottleneck and sends are the strongest signal (design/experiments.md, 13 Oct).
   `film/ID/timing.json`: 100 BPM grid by default (a beat every 0.6 s), effects `cues` that each match something on screen.
4. **Look and fix (2-3 passes):** `node scripts/film/render-film.mjs ID --variant A --stills t1,t2,...` at every cut + first, breath, peak, last frame; contact sheet in time order
   (`ls still-A-*.png | sort -t- -k3 -g`). Answer the friend test (CLAUDE.md) honestly; check text against Instagram's zones and for collisions or dead air; fix and look again.
   Run `node scripts/film/fill-meter.mjs <stills dir>`: no more than a third of the frames TIGHT (make subjects bigger, bleed off an edge, fill the ground).
   **Hybrid 3D (owner, 14 Oct 2026):** give each film 1-3 short 3D hero shots (3-6 s in total) with P.three / P.tank3d (`active` windows), the rest 2D; render cost
   grows about 3x per 3D second, so keep it short. See design/film-playbook.md "Hybrid films".
   **Easing (14 Oct 2026):** every move uses the toolkit in parts.js (springs or P.EASE, never 'lin'); pick by mood (design/film-playbook.md "Easing and spring
   physics"). `node scripts/film/render-film.mjs ID --variant A --motion-check` must print no JUMP/LINEAR lines, PASS for every preset and a clean grep.
   **Frame by frame (owner, 14 Oct 2026):** render the whole film once (`render-film.mjs ID --variant A --out DIR`), then
   `python3 -I scripts/film/frame-review.py DIR/ID-A.mp4 DIR/review --every 2 --cuts <your cut times>`. Open motion.png and EVERY sheet: fix every FROZEN
   stretch (dead air), unplanned JUMP, JUDDER and FLASH, plus anything that looks fake or unreadable in any frame; re-render and review again until clean.
   Rendering a still also writes film/ID/manifest.json; `npm run check` must pass (variety rules). Then `--cover` and check the crops.
5. reel-log.json: concept, motionStyle, primaryTransition, typeTreatment, grade, sound, cover, `friendTest` (the four answers), revisionPasses, notes (what each pass fixed),
   and the new trick added. Stage film/ID/ (with manifest.json), the parts.js change and reel-log.json with the template.
The Reel publish workflow renders the full film after the deploy. Budget about 30-45 minutes for this phase; it gets faster as the library grows.

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
