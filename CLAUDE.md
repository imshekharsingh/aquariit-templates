# Daily Template Repo — Rules

Role: senior creative director and front-end engineer. Every template must be
elegant, highly creative, production-quality, and distinct from all others.

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

## Creative direction menus (rotate across these)
- Layout: editorial magazine, bento grid, asymmetric split, horizontal scroll,
  single-column long-form, card stack, full-bleed sections, sidebar-anchored,
  radial/orbital, brutalist grid, layered parallax
- Mood: MODERN — glassmorphism (faux glass), aurora/mesh gradient, pastel playful, claymorphism/soft 3D, dark UI glow,
  neo-brutalist pop, luxury minimal, Swiss modernist, bento dashboard, kinetic type, spatial 3D cards, monochrome high-contrast, dark neon.
  VINTAGE (use sparingly) — warm paper/print, Japanese-inspired calm, art deco, retro-futurist, organic/botanical craft.
- Purpose: SaaS landing, portfolio, agency, product launch, event,
  restaurant, personal blog, consultancy, app showcase, nonprofit, studio

## Design quality bar
- Strong typographic hierarchy, generous whitespace, deliberate grid
- One memorable "signature moment" (unusual hero, custom SVG illustration,
  striking scroll interaction)
- Subtle, purposeful motion (CSS animations / IntersectionObserver);
  respect prefers-reduced-motion
- Fully responsive (mobile → desktop), light/dark aware where it fits
- Accessible: semantic HTML, sufficient contrast, focus states, alt text
- Reel-ready: the page is played by templates/play/player.js, which loads it in a 9:16 frame
  and auto-scrolls it top→bottom (stopping at each <section>) while it is screen-recorded.
  So: wrap content in <main> with real <section>s, make the first screen impressive without
  any interaction, trigger entrance animations on load or on scroll (never on hover/click/pointer),
  and keep a signature moment visible during plain vertical scrolling. If a template scrolls
  horizontally or inside a custom scroller, define `window.__reel = { scroller: '#track', axis: 'x' }`
  (optional: `duration` in seconds, `stops` as selectors/pixel offsets).
- Design advancement: every template introduces ONE new technique from design/playbook.md (not used before, see
  design/advancements.md), vivid palette (saturated hero colour + unexpected accent); log it in design/advancements.md.
- Vibrancy: use today's CSS (design/playbook.md "CSS animation catalogue"): scroll-driven animations, linear() springs, @property,
  oklch/display-p3 gradients, view transitions, sibling-index() staggers; always with @supports fallbacks and a finished default state.
- Service-attracting pages (agency, studio, consultancy, SaaS) include a value promise, proof numbers, a 3-step process, packages and a strong CTA.
- Typical sections: nav, hero, features/content, social proof, CTA, footer —
  adapt to the concept

## iPhone Reel frame (the recording target — design for it)
The owner records with an iPhone 17 Pro (402×874 CSS px, DPR 3, top inset ≈62px with the Dynamic Island, bottom ≈34px),
using the installed PWA, and posts to Instagram Reels (9:16). The ▶ player therefore shows every template inside a centred
**402×715 (9:16) frame** — the status bar and home indicator fall in the bands above/below, which Instagram's default crop trims.
Design every template for a **402×715 viewport**, not a desktop page:
- First screen (402×715, header included) must be a finished composition: hero headline sized to fit 402px wide, one clear
  focal visual, no content cut mid-line. Verify at exactly 402×715 (emulate it, with `<html class="reel">`).
- Instagram's own UI covers the bottom ≈20% and right edge: keep key text/CTAs in the central ≈60% of the height.
- **Side safety (measured on a real phone):** Instagram fills its taller preview/feed area with the 9:16 video, scaling it ≈7–11% and cropping
  ≈14–20 css px off EACH side (Photos crop was fine; the zoom is Instagram's). So at 402px: all text ≥ 26px from each side, icons/buttons/rail dots/badges
  ≥ 18px (prefer 26px), use ≈30px page gutters on phones. Decoration meant to bleed (aurora blobs, marquee strips, shards) is marked `aria-hidden="true"`
  or `data-reel-bleed`. Also keep headings out of the top ≈90px of the frame when you can (Instagram's top bar covers it) and key text above the bottom ≈22%.
  `node scripts/reel-audit.mjs <ID>` prints SIDE-TIGHT lines and must end with "side safety: OK".
- Safe areas: declare `:root{--safe-top:env(safe-area-inset-top,0px);--safe-bottom:env(safe-area-inset-bottom,0px)}` and use only
  `var(--safe-top)` / `var(--safe-bottom)` (never raw `env(safe-area-inset-top/bottom)`). Sticky headers pad with `var(--safe-top)`
  and keep their background under the status bar (iOS PWA). Add `html.reel{--safe-top:0px;--safe-bottom:0px}`: the player adds the
  `reel` class and already frames the page inside the safe area.
- Reel mode also hides the "← All templates" link (display:none): add a `.reel` rule so the header still looks intentional
  without it (e.g. `.reel .bar .wrap{justify-content:center}`).
- `<meta name="viewport" content="..., viewport-fit=cover">` and `<meta name="theme-color">` = the page's top/background colour
  (the player tints the iOS status area with it). The page's `body` background should be a solid colour.
- **Alignment with the scroll flow.** The player pauses at *content blocks*, not at arbitrary pixels: it stops where a block
  starts just under the header and keeps the frame's bottom edge in a gap between blocks. Build for that:
  · Structure: `<main>` → `<section>` → (optional single wrapper) → blocks (heading group, card, list item, quote, CTA row).
  · Keep blocks ≤ ≈600px tall and leave a visible gap (≥14px) between neighbours; never one giant block. Stacked cards are fine but not the default:
    vary the section module (see design/playbook.md); avoid tall side-by-side columns on mobile. Two or three whole blocks should fit one frame (≈650px under the header).
  · A heading and the content it introduces should sit within one frame (≈650px) of each other.
  · Entrance animations on load/scroll only; each section should be "finished" when it is paused on.
  · To control a pause explicitly add `data-reel-stop` to the elements that should start a frame (then only those are used).
  · Run `node scripts/reel-audit.mjs <ID>` (needs Playwright; present in cloud sessions). It prints every pause, flags any pause
    where the bottom edge would slice a block ("CUTS at bottom"), and saves a screenshot per pause in /tmp/reel-audit/.
    OPEN THE SCREENSHOTS and confirm every pause is a finished frame, especially pause 0 (the first screen). Fix every
    "CUTS" line by splitting/resizing blocks or pinning pauses, then re-run until it reports "All pauses are clean".
- **Smooth when auto-scrolled.** The player moves the page from JavaScript, so (unlike native scrolling) anything slow on the page's
  main thread shows up as stutter on a phone. Keep pages light:
  · Infinite/looping animations: `transform` and `opacity` only. Never animate `filter: blur()`, `box-shadow`, `backdrop-filter`,
    `width/height/top/left`, or large gradients. Blurred glows may exist but must be static or only moved with `transform`.
  · Do not rely on `backdrop-filter` (the player removes it and makes the sticky header opaque, so the header must still look right
    as a plain solid bar over the page colour). Prefer a solid `var(--bg)`-based header background.
  · Canvas/JS animation: ≤ ~150 moving items, cap `devicePixelRatio` at 2, draw only what changed, no layout reads in the loop.
  · No heavy work in scroll handlers; use IntersectionObserver for reveals. Keep the DOM modest (a few hundred nodes).
  · Run `node scripts/reel-perf.mjs <ID>`: it plays the page through the real player under a simulated slower phone (CPU 4×) and must
    report "smooth" (< 3% irregular frames, no long frames). If it reports CHECK, simplify the heaviest effects and re-run.
`scripts/check.mjs` enforces the viewport-fit, theme-color, `html.reel` rule and the `--safe-*` convention.

## Instagram social kit (required for every template)
Every template ships with social/ID.md (NOT inside templates/, so it is
never deployed). It is the ready-to-paste kit for the Instagram Reel:
- `## Hook` — one line (≤ 10 words) of on-screen text for the first 2 seconds. It must open a loop the end of the video
  closes: a question ("Can a website feel like tea? Watch to the end"), a "Wait for …" promise, or a surprising contrast.
  Never a vague teaser, and never promise something the video does not show. Watch time is what Instagram rewards.
- `## Caption` — 2–4 short lines; the first line must contain the main search keywords in natural language (Instagram
  ranks on caption keywords); the LAST line must invite a share ("Send this to someone redesigning their site, and follow for
  a new template every day") because shares sent per reach is a top ranking signal. Say "send", "share" or "tag".
- `## Keywords` — 8–12 search phrases (SEO terms for caption, alt text, on-screen text)
- `## Hashtags` — EXACTLY 5, each starting with # (Instagram's per-post limit
  since Dec 2025): 2 broad, 2 niche, 1 topic-specific; then an `Alternates:` line
  with 5 more to rotate between posts (never all together)
- `## Reel` — lines `Length:` (20–30 s, matching the ▶ player's length setting; shorter pages = higher completion),
  `Shot plan:` (2–4 beats of what the ▶ player will show: it only scrolls and plays animations, it never taps),
  `Payoff:` (the moment near the end that answers the hook and rewards finishing, e.g. a signature animation completing or
  the final CTA reveal — make sure the template actually has one in its last third), `Cover:` (3–5 word cover text)
- `## Music` — lines `Mood:`, `Genre:`, `BPM:`, `Search:` (3–5 terms to type into
  Instagram's audio search), `Accent sounds:` (optional SFX), `Avoid:`
- Format is a vertical 9:16 Reel recorded from the screen (phone-width viewport).
- Account is a Professional/Personal (creator) account, NOT a business account:
  the full Instagram audio library is available, but audio can be muted if the
  Reel is boosted/promoted. Suggest moods/genres and search terms, never specific
  copyrighted songs, and never claim a track is trending. Keep a royalty-free
  fallback in mind (Instagram's royalty-free tab).
Music must follow the template's mood (e.g. warm paper → acoustic/lo-fi,
dark neon → synthwave, Japanese calm → ambient/koto-style, art deco → jazz). This section is for picking Instagram's own audio;
the ▶ player separately auto-picks one of its 11 generated styles from the theme (see MOODS in templates/play/player.js).

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

## Never do
- Force-push, rewrite history, or delete branches yourself
- Push to main or deploy manually
- Delete or modify past templates (unless fixing a broken record)
- Edit this CLAUDE.md file
- Commit secrets, large binaries, or files outside this project
