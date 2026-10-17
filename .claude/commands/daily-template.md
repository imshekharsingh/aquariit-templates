---
description: Create today's template on a new branch, verify it, and hand off to the deploy pipeline
argument-hint: [optional theme/purpose hint]
allowed-tools: Bash(git:*), Bash(gh:*), Bash(npm:*), Bash(npx:*), Bash(node:*), Bash(ls:*), Bash(mkdir:*), Bash(cat:*), Bash(cp:*), Bash(ffmpeg:*), Bash(date:*), Bash(TZ=Asia/Kolkata date:*), Read, Write, Edit, Glob, Grep
---

# Daily Template — Autonomous Repo Manager

You own this repository and follow CLAUDE.md. Work without asking for
confirmation unless something is destructive or ambiguous.
Optional hint from user: $ARGUMENTS
**Always start with Phase 0**, even when the routine's prompt says "Phases 1–7" (owner, 16 Oct 2026). Hint file: if design/next-hint.md exists and its `date:`
line is today's India date, honour that hint within the rules and delete the file in your template branch (an older date: delete it, no hint).
Write every time in your report in IST, never UTC (owner).

## The approach (owner, 17 Oct 2026; read first, it wins over anything older below)
You drive Aquarii's social content. One-pass, premium, never static. Do not ask the owner anything; design, build, render and report.
1. **Pick the look** from design/themes.md (rotation, never the previous film's theme) or the hint. Benchmarks to match or beat: film/2026-10-17-1223
   (theme G cinema, Aurelia) and the owner's references in design/brand/references.md. Range is the point: each piece looks like its own brand.
2. **Write the brief yourself first** (like a creative director): brand, palette (restrained base + radiant light, never flat candy colour), type, a shot list
   with timings and easing, the hero object, the atmosphere layers (light, glows, particles, depth, grain, grade). Put it at the top of film/ID/story.js.
3. **Build the website sample for the theme** (templates/ID): premium, and EVERY section moves: scroll-driven entrances (animation-timeline view() with
   @supports fallback) for every section below the fold, plus small transform-only loops in live visuals, all finished by default and off for reduced motion.
4. **Build the film in one composition** (film/ID/story.js) at full finish, using what exists (P.siteScroll, the Aurelia cinema kit in film/2026-10-17-1223,
   P.brandEnd with `grade` matching the film's palette). Voice: film/ID/voice.md telling the film's story, 2.3-3.2 words/s, last line "DM us to know more".
5. **Review once against the benchmark** with `--stills` at every shot; fix what is clearly weaker (atmosphere, hero size, legibility, empty frames). Two passes
   at most; then records, push, and let GitHub render.
6. **Add the look to the Style library** (templates/styles/index.html row + home strip card in templates/index.html) when it is a new theme or a new code.
A hint like "film day: <theme>" makes today a film day whatever the weekday; "light day" makes it a light day.

## Phase 0: film day or light day (owner, 16 Oct 2026: post every day)
Run `TZ=Asia/Kolkata date +%a` (a hint saying "film day" or "light day" overrides the weekday). Mon, Wed, Fri = **film day**: the full run below. Tue, Thu, Sat, Sun = **light day** (design/themes.md theme E `demo`), kept small to save usage:
- Build a compact template (all "Required in every template" items, design log, advancements line, cover, kit as usual) around ONE striking animated effect
  that is finished and moving in the first second (a hero effect from the playbook or design/brand/references.md: light ribbons, 3D-feeling shapes,
  kinetic type). 3-4 sections, not a full long page. The effect is the post: "this is what an animation looks like as a real website".
  Add `<script>window.__reel = { hold: 4.5 }</script>` so the recording stays on the effect for 4.5 s before it scrolls (result first).
- No film folder, no voice, no storyboard: the Reel publish workflow records the page (`render-reel.mjs --light`: 15 s, the kit's Hook on screen, Aquarii
  end card) and checks it with the demo profile. The kit's `## Reel` says Length: 15 s and puts the payoff on the effect itself.
- Skip Phase 4c. Everything else (checks, records, push) as usual.

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
3. Screenshot the page at 402×874 (phone) and 1440 wide (desktop) and look at both: no horizontal overflow, readable type, a finished first screen.
   (The reel is a film made in Phase 4c, so no Reel-frame emulation, reel-audit or reel-perf runs are needed.)
4. Compare against the last 3 templates; if too similar, revise.

## Phase 4a — Cover preview image
Run `node scripts/make-cover.mjs ID` (needs Playwright). It writes templates/covers/ID.jpg, the finished first screen shown
on the ▶ player's opening cover card (the first frame of the recording, used as the Reel cover). Open the image and make
sure the hero is complete (no half-faded elements); if not, fix the template's entrance timing and re-run. Commit the jpg.

## Phase 4b — Instagram social kit
Create social/ID.md following the "Instagram social kit" section of CLAUDE.md
(hook that opens a loop the ending closes, caption ending with a "Send this to…" share line,
8–12 keywords, exactly 5 hashtags + alternates, Reel plan with length/shot plan/payoff/cover text, music suggestion matched to the template's mood). Base keywords on what the page actually shows.
## Phase 4c — The reel (current rules, owner 15-16 Oct 2026; these replace every older reel rule in CLAUDE.md and this file)
Sources, in this order: design/aligned-plan.md (business, recipe, process), design/themes.md (pick today's theme; Rule 1: improve, never override), design/brand/premium.md (theme A's look), design/brand/kit.md (brand), design/film-playbook.md (how-to).
1. **Service and story.** One Aquarii service, in priority order (website design + SEO, then CDN/speed/protection, then security + maintenance), never the same as the
   previous film (`S.dna.service`). One reel type in rotation (problem -> fix, makeover, mini tutorial, offer; `S.dna.format`). Concept in 3 lines: the buyer's pain, what we
   deliver (shown as a mechanism), the payoff image. The example business on the template changes every reel: never the same kind of business as any of the last 5
   (bakery, clinic, salon, CA firm, gym, boutique, coaching, real estate, restaurant, school ...). The template is only proof; Hook, voice and caption sell Aquarii.
2. **Theme and look.** Pick a ready theme from design/themes.md (`S.dna.theme`; never the previous film's once two or more are ready) and follow that theme's recipe only.
   Each theme's look stays locked; it changes only by beating its benchmark (themes.md Rule 1). Theme A `collage` (the only ready one on 16 Oct) = premium cinematic tech (premium.md): navy, white, one lime accent, coral only for the problem; three layers in every frame (subject,
   supporting detail, depth layer such as P.sys globe/grid/spot); one 3D or depth hero moment; calm long-tail motion. Length fits the content, 15-30 s (timing.json `len`).
3. **Show the real work.** When the reel shows a site, use the real template: `node scripts/film/capture-site.mjs ID` writes film/ID/assets/{desk,tab,phone}.jpg; put them
   in device frames that scroll. Never placeholder blocks.
4. **Voice:** film/ID/voice.md, near-continuous, every line 2.3-3.2 words per second of its slot (`npm run check` refuses anything else, or the reel ships silent),
   one short breath before the reveal, first line = hook, last line ends "DM us to know more". English, "we", AI voice af_heart; never invent clients, years or results; never prices.
5. **Ending:** `P.brandEnd({ at, keyword, why, grade })` (it breathes by itself: push-in, halo, shine). No other sign-off. `grade` colours the Aquarii logo,
   wordmark and button to the film's palette (owner, 17 Oct 2026; presets in parts.js `P.GRADES`, add one when a film's palette has none).
6. **One new trick** in scripts/film/parts.js per film (`P.use(slot, id)`), as CLAUDE.md asks; reuse parts for everything else.
7. **Review before pushing (no full renders here; GitHub renders):** `node scripts/film/storyboard.mjs ID`, then 1 still per second (`--stills 0.5,1.5,...`) as one contact
   sheet. Fix: empty or cut-off frames, text in Instagram's zones, a picture that does not match the words, anything static for 3 s, placeholder content. Look again (2-3
   passes). The GitHub gate then checks shots, held framing, fullness, a live ending and the voice; a failed reel is kept off the site and opens "Reel needs fix".
8. **Records:** social/ID.md (Hook, Service, Caption, Keywords, Hashtags, Reel, Music), reel-log.json entry (concept, friendTest, revisionPasses, notes, new trick),
   film/ID/ with manifest.json (written by any still render). `npm run check` must pass.

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
