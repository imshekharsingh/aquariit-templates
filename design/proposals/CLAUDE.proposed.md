# Daily Template Repo — Rules

Role: senior creative director and front-end engineer. Every template must be
elegant, highly creative, production-quality, and distinct from all others.

## How this file is organised (proposed 15 Oct 2026)
Films first: the daily reel is what brings clients, the template page is its proof. Detailed formats live in linked files, moved word for word:
design/kit-format.md (kit sections) · design/music-supervisor.md (dormant until a licensed music API exists) · design/template-rules.md (menus, quality bar) ·
design/recording-fallback.md (phone page rules + the screen-recording fallback) · design/film-playbook.md (how to make a film) · design/services.md (what we sell).
Where a linked file and this file disagree, this file wins.

## Directed film (the ONLY daily reel format from 2026-10-14; owner decision delegated to Claude, 13 Oct 2026)
Every daily reel is a directed motion film; screen recordings are retired (they averaged 2.5-4.6 s watch time) and stay only as the automatic fallback when a film fails to render.
Engine: scripts/film/ (engine.js, the parts library parts.js, render-film.mjs); per template: film/ID/story.js + timing.json. 18 s, 30 fps, 1080×1920, the hook building from frame 0,
a held "breath" before the payoff, payoff in the last 4 s, a last frame that loops into the first, effects-only sound (owner adds Instagram audio). How-to: design/film-playbook.md.
**Every reel looks like its own brand.** The account showcases range for many clients, so there is no house style. Only these stay constant: captions readable at phone size,
nothing key under Instagram's UI (top 96 px, bottom 22%, right column), smooth motion, a clean loop, and the sign-off at the end (P.signoff: "Aquarii Tech Studio · DM us", lower centre at y 540, from the CTA
to the loop; keep that band clear then). No watermark during the film (owner, 14 Oct 2026: Instagram already shows the account; the name appears once, with the CTA).
**Use the whole frame** (owner, 13 Oct 2026: "content feels forced into the centre"): subjects fill the width and may run off an edge or the bottom, grounds go
edge to edge, display type spans the width. `node scripts/film/fill-meter.mjs <stills dir>` must report at most a third of frames as TIGHT (transitions excepted).
**Variety is enforced, not hoped for.** Stories are built from the parts in scripts/film/parts.js; each part records the slot it fills (opener, transition, mechanism, focus,
payoff, type, captions, cta, ground) and the renderer writes film/ID/manifest.json automatically, with the story's declared `S.dna = { opening, bigMoment, ground, music }`.
scripts/check.mjs refuses a film that repeats the previous film in opener, transition, mechanism or payoff, is a near-copy of any of the last 7, or reuses an opening or big moment.
**Every film adds one new trick to the library** (a new part or a new option of a part in parts.js, with a `P.use` slot tag), so the vocabulary grows every day.
Ideas come from design/inspiration.md (a weekly study of current design, motion and web-animation work; take techniques, never copy a piece).
**The friend test decides, not a score.** Watch the stills like a stranger scrolling at night and answer honestly in reel-log.json (`friendTest`):
would I stop scrolling in the first second? would I watch it to the end? is there one moment I would screenshot? would I send it to a friend who runs this kind of business?
Any "no" means fix it and look again (usually 2-3 passes); write what each pass fixed in `notes`.
Speed: review with `--stills` at the cuts (not full previews), reuse parts instead of bespoke code, and stop polishing once the friend test is four yeses.


## Instagram social kit (required for every template)
Every template ships with social/ID.md (NOT inside templates/, so it is
never deployed). It is the ready-to-paste kit for the Instagram Reel:
**What we sell (owner, 14 Oct 2026; design/services.md):** every reel sells Aquarii Tech Studio's own services: web design and development, social media management,
website + security management, and CDN/security aggregation (we choose and wire CDN, DNS, WAF, bot and DDoS protection into one setup). The protagonist is Aquarii, never
the fictional business on the template: the template is proof of what we build. The hook comes from a buyer's pain in ONE service line (slow site, no enquiries, no reach,
hacked, downtime, attacks), the film shows what we deliver, and it ends on a CTA to us. Rotate the service (`S.dna.service` in the film, `## Service` in the kit:
web | social | security | edge | studio); never the same as the previous film. Never name the template's brand in the kit's Hook or Caption.
**Growth rules (owner-delegated, evidence-driven):** the account exists to attract clients for Aquarii Tech Studio, so every concept and hook speaks to the buyer
(a business owner or founder: money, time, results, "what should it cost / where am I losing / can it do X"), not only to designers. The reel starts moving at
frame 0 (no static title card), shows the hook on screen, runs ~18 s and pays off in its last 4 s. What is being tested, what the numbers said and what to try
next live in design/experiments.md; the operating rhythm and the do/don't list live in design/growth-playbook.md.
**Audience: people's choice (design/market.md; owner decision 13 Oct 2026, replaces the India-first market rules):** no fixed country, currency or business list.
Pick the market, currency and the template's business type per concept from what people respond to: the latest "Instagram collect" workflow log (per-reel reach, watch time, shares,
saves, comments), audience countries when known, and what commenters ask for. One honesty line stays: never present invented results as Aquarii's own work or
clients (numbers inside a fictional brand's page are example content, never the hook).
Required kit sections, in this order: `## Hook`, `## Service`, `## Caption`, `## Keywords`, `## Hashtags`, `## Reel`, `## Music` (formats: design/kit-format.md).

## Sound now (resolves the music-supervisor section vs "no music")
Films ship with NO music bed and never use code-generated music; effects only. The full music-supervisor process (brief, 3 candidates, analysis, edit to picture, mix,
log) is kept in design/music-supervisor.md and becomes the rule only when the owner connects a licensed music API.
Credentials for any music or sound API exist only as secrets (GitHub Actions / local environment), exactly like the site credentials: NEVER write a key into any file.
Until a licensed music API is connected, films ship with NO music bed (picture, plus effects only if a licensed source is available) and the owner adds Instagram's own audio at posting
(the kit's `## Music` section still gives mood, BPM and search terms for that).
Voice-over (tutorial films only, in test): AI voice generated only in GitHub Actions; kit says `Voice: AI (label it on Instagram)`.

## Save Claude usage (owner, 14 Oct 2026)
Heavy work runs on GitHub, not in the Claude session: full film renders, re-renders and long checks go through the workflows (pipeline, Reel publish), and results
are reviewed from what they produce. In a session, keep local runs to quick stills and checks; never render whole films locally to "see" them, and never poll or wait
on long jobs: the owner waits for the issue to show up.
Effort first (owner, 14 Oct 2026): before any task, tell the owner its size, S (< 15 min) / M (30-60 min) / L (1-3 h) of session work, plus any GitHub render time,
and wait for a go-ahead on M or bigger unless already approved. Offer the cheaper route when one exists.


## Dates and URLs
- Every run (scheduled or manual) creates ONE new template. Its ID is the India
  date and time of the run, computed with: TZ=Asia/Kolkata date +%F-%H%M
  (e.g. 2026-10-07-0905). Date alone: TZ=Asia/Kolkata date +%F; time: +%H:%M
- Several templates per day are allowed; each has its own ID. The first template
  (2026-10-06) is a legacy ID with no time suffix; both forms are valid.
- Template path: templates/ID/index.html
- Live URL: https://templates.aquariit.com/ID/
- Instagram kit: social/ID.md, shown in the app at /kit/?id=ID (a "Post kit" button on
  the home page). scripts/build-kits.mjs turns social/*.md into templates/social-kits.json
  (generated, gitignored, rebuilt by `npm run check` and the deploy job; never hand-edit)
- The whole site sits behind a sign-in page + 30-day session cookie (src/worker.js; PWA-friendly,
  no browser Basic-auth popup). Credentials exist only as secrets (GitHub + Worker):
  BASIC_AUTH_USER / BASIC_AUTH_PASS (+ optional second account BASIC_AUTH_USER_2 / BASIC_AUTH_PASS_2). NEVER write them into any file.
  Templates must not link to the kit page (it would appear in recordings).
- Home (date index): templates/index.html → https://templates.aquariit.com/
- 404 page: templates/404.html

## Git workflow
- One branch per template: template/ID, created from latest main (never reuse a branch whose PR was merged)
- Never commit or push directly to main
- Branch cleanup is automatic: the pipeline deletes a branch right after its PR merges, and a cleanup job sweeps any
  merged leftovers. Always confirm after a merge that no merged branch remains (never delete branches by hand).
- Never run wrangler deploy manually; deployment is owned by
  .github/workflows/pipeline.yml (checks → PR → merge → deploy → smoke test)
- Commit format: template: ID <slug> — <one-line concept>

## Design log schema (design-log.json)
Each entry: id, date, time (HH:MM IST; omit only for the legacy ID without time), slug, url, theme, layout archetype, color palette
(hex array), font pairing, signature visual motif, animation style,
page purpose, one-line description.
JSON keys: id, date, time, slug, url, theme, layout, palette, fonts, motif, animation,
purpose, description.
After every update, copy design-log.json to templates/design-log.json
(served at /design-log.json for the home page). Both copies must match.

## No-repeat rule
Each new design must differ from ALL previous entries on at least 5 of 7
dimensions: layout archetype, palette, font pairing, motif, animation style,
theme/mood, page purpose. Never reuse an exact palette or font pairing.
Era counts too: log `era: modern|vintage` for every template. A vintage/period template (cream paper, serif display, heritage copy,
art deco, retro) may not appear within two templates of another vintage one; prefer modern product-grade looks (design/playbook.md).
Structure counts too: versus each of the previous THREE templates, also change the hero composition, the main section
module and the header style (menus in design/playbook.md; record them in design/advancements.md).

## Template pages
Menus and the design quality bar: design/template-rules.md. Phone-first page rules (402x715 frame, safe zones, `--safe-*`, viewport-fit, theme-color, `html.reel`) and
the screen-recording fallback: design/recording-fallback.md. scripts/check.mjs enforces the parts it can.

## Required in every template (enforced by scripts/check.mjs)
- A small, visible link to "/" whose text includes "All templates"
  (e.g., "← All templates"), styled to fit that template's design and
  reachable on mobile without scrolling to the very bottom (in the nav, or
  as a fixed corner element using safe-area insets). This is the only way
  back when the site runs as an installed PWA with no address bar.
- A footer credit line reading exactly "Developed by Aquarii Technologies" (small, muted, last line of the page,
  styled to fit the design; plain text, no link). The "Developed by" wording is the owner's choice.
- <link rel="manifest" href="/manifest.webmanifest"> in <head>, so the
  app stays in standalone mode when opening a template.

## Copyright-safe rules (strict)
- All copy original; use an invented fictional brand name
- No real company names, logos, trademarks, or characters
- Do not imitate or clone any existing website, theme, or template
- Images: only hand-written inline SVG, CSS gradients/shapes, or generative
  patterns in code; no external or stock images
- Fonts: only open-licensed Google Fonts (SIL OFL / Apache) or system fonts
- Icons: hand-drawn inline SVG only
- No third-party code copied from elsewhere; write it yourself
- Each template is a single self-contained file (inline CSS and JS);
  the only allowed external origins are fonts.googleapis.com and
  fonts.gstatic.com

## Site infrastructure (do not modify during daily runs unless asked)
templates/index.html (home shell), templates/kit/index.html, templates/play/player.js, templates/404.html, src/worker.js,
templates/manifest.webmanifest, templates/sw.js, templates/icons/,
wrangler.jsonc, scripts/, .github/, .claude/

Exception (clarifies a contradiction): the daily film may add a part to scripts/film/parts.js and write film/ID/*; that is the film rule above, not an infrastructure change.

## Never do
- Force-push, rewrite history, or delete branches yourself
- Push to main or deploy manually
- Delete or modify past templates (unless fixing a broken record)
- Edit this CLAUDE.md file
- Commit secrets, large binaries, or files outside this project
