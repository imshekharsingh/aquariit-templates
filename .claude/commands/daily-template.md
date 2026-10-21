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

## Website first, then the video (owner, 17 Oct 2026 evening; wins over every older step that builds the film in the same run)
Two runs per piece, never one:
1. **Website run.** Build the template to its FINAL level in one pass (approach steps 1-4, 7 below: concept, combination, every section moving, a lit hero,
   phone first screen a finished composition, desktop and phone both checked with screenshots) plus the kit, design-log, advancements entries. No film folder.
   Push; the pipeline deploys it; no reel is rendered (the Reel publish workflow skips templates without film/ID/story.js). Report the live URL.
2. **Owner review.** The owner looks at the website and approves or asks for changes; fix the website until approved. Never start the film before the OK.
3. **Video run** (after the OK, started by the managing session with "video run: ID"): build film/ID (story.js, timing.json, voice.md) from the approved
   website, at its final level, in one pass (approach steps 5-7). Push; the reel renders automatically. A piece on hold has film/ID/HOLD (no render).

## The baseline level (owner, 18 Oct 2026: "realism, dynamism, flow"; reference: Aurelia, Veloria, Plumpaw sites)
Every website ships with, in its own style: (1) **realism**: the hero is a real lit 3D subject in our own WebGL (ray-marched or shader-rendered:
wrap/subsurface light, rim, specular, soft contact shadow), never flat CSS shapes; (2) **flow**: a living fluid/silk field behind the page that swirls
with the pointer/finger and the scroll speed; (3) **dynamism**: physics, not fixed tweens: scroll-velocity stretch and settle, word/letter spring
entrances, magnetic buttons, the hero reacting to scroll speed; (4) **layers + pointer depth**: 4-5 depth planes (incl. a blurred foreground) that
move by depth with the cursor/finger (idle wander on phones), cards that lean toward the pointer; (5) **scroll motion**: one pinned scroll scene
that is the film's big moment, plus scroll-linked depth in every section. Always: WebGL/IO fallbacks, reduced motion = finished still page,
no large hard shadows that clip, phones checked frame by frame, DPR capped at 2.

## The ending (owner, 21 Oct 2026; replaces the Comment "AQUARII" rule, the Aquarii sign-off and every older "DM us" rule in CLAUDE.md and below)
Nothing at the end: just the reel. No brand card, no sign-off, no studio name, no call to action (P.brandEnd and P.signoff draw nothing unless a story sets
P.BRAND_END = true; the light-day recording gets no end card). The account grows as an individual creator's account. Hold the payoff to the last frame and loop
cleanly into the opening; the voice closes the story naturally; the caption's last line may still invite a share ("Send this to a founder who …").

## The approach (owner, 17 Oct 2026, revised the same evening; read first, it wins over anything older below)
You drive Aquarii's social content. Imagination first, premium, never static. Do not ask the owner anything; design, build, render and report.
**No benchmark to copy or compare against.** Past pieces (Aurelia, Veloria, the references) are not targets: invent today's piece from its own idea.
Premium is judged on the piece's own merit, never by how close it is to something we made before.
1. **Invent the concept.** A business, a world and one idea worth stopping for. Read the last 7 film/*/manifest.json `dna` and design-log.json entries
   first, only to stay away from them: never repeat an opening, a hero object, a big moment or a combination of techniques. A theme from design/themes.md
   (or the hint) is a starting format, not a look to reproduce.
2. **Combine, don't repeat.** Every piece joins at least 3 techniques that have never appeared together in our work (e.g. a GPU shader world + kinetic type
   + a physical UI object; a clay character + live data + a camera orbit; light refraction + scroll-built 3D + particles). Name the combination in
   `S.dna.combo` and in design/advancements.md, and add at least one technique the library has never had (new part or option in scripts/film/parts.js,
   or a new web technique in the template).
3. **Write the brief yourself** (like a creative director): brand, palette (restrained base + radiant light), type, the hero, the atmosphere layers,
   a shot list with timings and easing. Put it at the top of film/ID/story.js (or the template's head comment on a light day).
4. **One idea, two outputs at the same level.** The website (templates/ID) and the reel are the same product: every effect the reel shows exists on the
   website, and the website's best moment is in the reel. EVERY section of the site moves (scroll-driven entrances with @supports fallback, transform-only
   loops in live visuals, finished by default, off for reduced motion).
5. **The reel is directed, on film days and light days alike:** camera moves (push-ins, orbits, reveals), close-ups on the best effect, a build to one
   payoff, a voice story (film/ID/voice.md, 2.3-3.2 words/s, ending on a natural closing line, no CTA), the graded sign-off (P.brandEnd `grade` in the piece's own palette).
   Light days use the same engine at lighter cost (e.g. P.siteScroll with push-ins over the live site), not a plain recording.
6. **Vary the words and the sound** (owner, 17 Oct 2026: "not everything starts with 'is your site slow abroad'"). Read the last 10 `## Hook` lines in
   social/*.md and the first lines of the last 5 film/*/voice.md: never reuse their wording or their shape. Rotate the hook's form: a bold statement, a
   surprising contrast, a number, an instruction, a tiny story ("At 2 a.m. a bakery's site went dark…"), a sound-led open. No question hook if the previous
   reel's hook was a question. The voice's first line does not just read the on-screen hook; it adds to it. Pick the voice for the piece's mood with a
   `Voice: <name>` line in voice.md (Kokoro: af_heart, af_bella, af_nicole, am_michael, am_fenrir, bf_emma, bm_george, bm_fable), not the same as the previous reel.
7. **Self-check on its own merit**, with `--stills` at every shot and a 1:1 crop (headings crisp). Ask of every still: is there light, depth and a lit hero?
   does something move across a large part of the frame? is the type confident? is there a finish (glow, reflection, grain)? would I screenshot it?
   Never put small readable text inside a 3D-tilted layer (Chrome rasters it at low resolution): true 3D for fly-ins and exploded views, a 2D camera
   (scale, translate, slight skew) for any shot where text is read (PR #248). A film that copies the live page must first remove the site's own
   motion (e.g. `document.documentElement.classList.remove('js')` in setup), or the page's reveal/scroll states freeze into the film (blank blocks). A slower voice needs shorter lines: speech must end before the film does.
   Fix what fails; two passes at most; then records, push, and let GitHub render.
8. **Add the look to the Style library** (templates/styles/index.html row + home strip card in templates/index.html) when it is a new look.
A hint like "film day: <theme>" makes today a film day whatever the weekday; "light day" makes it a light day.

## Phase 0: film day or light day (owner, 16 Oct 2026: post every day)
Run `TZ=Asia/Kolkata date +%a` (a hint saying "film day" or "light day" overrides the weekday). Mon, Wed, Fri = **film day**: the full run below. Tue, Thu, Sat, Sun = **light day** (design/themes.md theme E `demo`), kept small to save usage:
- Build a compact template (all "Required in every template" items, design log, advancements line, cover, kit as usual) around ONE striking animated idea
  that is finished and moving in the first second, imagined fresh (approach steps 1-2). 3-4 sections, not a full long page; every section moves.
- The reel is a SHORT DIRECTED FILM of that page (owner, 17 Oct 2026: a plain recording undersells the site): film/ID/story.js (~15 s, `len` in timing.json),
  built on the page itself (`node scripts/film/capture-site.mjs ID --tall` + `P.siteScroll`, or live captures of the effect) with real camera moves: a push-in
  on the effect, a close-up, a reveal, a pull-back; the voice story (film/ID/voice.md) and P.brandEnd. Phase 4c applies in a light form: one pass, stills at
  the cuts. The plain recording (`render-reel.mjs --light`) is only the automatic fallback when the film fails.
- Everything else (checks, records, push) as usual.

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
   A theme is a format, not a look to reproduce (owner, 17 Oct 2026: imagination first, no benchmark copying). Theme A `collage` (the only ready one on 16 Oct) = premium cinematic tech (premium.md): navy, white, one lime accent, coral only for the problem; three layers in every frame (subject,
   supporting detail, depth layer such as P.sys globe/grid/spot); one 3D or depth hero moment; calm long-tail motion. Length fits the content, 15-30 s (timing.json `len`).
3. **Show the real work.** When the reel shows a site, use the real template: `node scripts/film/capture-site.mjs ID` writes film/ID/assets/{desk,tab,phone}.jpg; put them
   in device frames that scroll. Never placeholder blocks.
4. **Voice:** film/ID/voice.md, near-continuous, every line 2.3-3.2 words per second of its slot (`npm run check` refuses anything else, or the reel ships silent),
   one short breath before the reveal, first line = hook, last line closes the story (no "Comment …" or "DM us"). English, "we", AI voice af_heart; never invent clients, years or results; never prices.
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
GitHub Actions usage (owner, 17 Oct 2026): run `python3 -I scripts/actions-usage.py` and add its first line (minutes this month, left of 2,000 if the repo
were private). If today's run used more than 60 minutes, say which workflow and why.
End with the oldest 1-3 open items from design/open-items.md, one line each, as questions to the owner (owner's standing request).
