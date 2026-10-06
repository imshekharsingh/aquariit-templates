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
- The whole site sits behind HTTP basic auth (src/worker.js). Credentials exist only as
  secrets (GitHub + Worker): BASIC_AUTH_USER / BASIC_AUTH_PASS. NEVER write them into any file.
  Templates must not link to the kit page (it would appear in recordings).
- Home (date index): templates/index.html → https://templates.aquariit.com/
- 404 page: templates/404.html

## Git workflow
- One branch per template: template/ID, created from latest main (never reuse a branch whose PR was merged)
- Never commit or push directly to main
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

## Creative direction menus (rotate across these)
- Layout: editorial magazine, bento grid, asymmetric split, horizontal scroll,
  single-column long-form, card stack, full-bleed sections, sidebar-anchored,
  radial/orbital, brutalist grid, layered parallax
- Mood: luxury minimal, retro-futurist, organic/botanical, Swiss modernist,
  dark neon, warm paper/print, Japanese-inspired calm, art deco,
  glassmorphism, monochrome high-contrast, pastel playful
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
- Typical sections: nav, hero, features/content, social proof, CTA, footer —
  adapt to the concept

## Instagram social kit (required for every template)
Every template ships with social/ID.md (NOT inside templates/, so it is
never deployed). It is the ready-to-paste kit for the Instagram Reel:
- `## Hook` — one line of on-screen text for the first 2 seconds
- `## Caption` — 2–4 short lines; the first line must contain the main
  search keywords in natural language (Instagram ranks on caption keywords)
- `## Keywords` — 8–12 search phrases (SEO terms for caption, alt text, on-screen text)
- `## Hashtags` — EXACTLY 5, each starting with # (Instagram's per-post limit
  since Dec 2025): 2 broad, 2 niche, 1 topic-specific; then an `Alternates:` line
  with 5 more to rotate between posts (never all together)
- `## Reel` — lines `Length:` (7–15 s), `Shot plan:` (2–4 beats of what to screen-record,
  e.g. hero load → scroll → signature moment → CTA), `Cover:` (3–5 word cover text)
- `## Music` — lines `Mood:`, `Genre:`, `BPM:`, `Search:` (3–5 terms to type into
  Instagram's audio search), `Accent sounds:` (optional SFX), `Avoid:`
- Format is a vertical 9:16 Reel recorded from the screen (phone-width viewport).
- Account is a Professional/Personal (creator) account, NOT a business account:
  the full Instagram audio library is available, but audio can be muted if the
  Reel is boosted/promoted. Suggest moods/genres and search terms, never specific
  copyrighted songs, and never claim a track is trending. Keep a royalty-free
  fallback in mind (Instagram's royalty-free tab).
Music must follow the template's mood (e.g. warm paper → acoustic/lo-fi,
dark neon → synthwave, Japanese calm → ambient/koto-style, art deco → jazz).

## Required in every template (enforced by scripts/check.mjs)
- A small, visible link to "/" whose text includes "All templates"
  (e.g., "← All templates"), styled to fit that template's design and
  reachable on mobile without scrolling to the very bottom (in the nav, or
  as a fixed corner element using safe-area insets). This is the only way
  back when the site runs as an installed PWA with no address bar.
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
