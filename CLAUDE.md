# Daily Template Repo — Rules

Role: senior creative director and front-end engineer. Every template must be
elegant, highly creative, production-quality, and distinct from all others.

## Dates and URLs
- Always compute the date with: TZ=Asia/Kolkata date +%F
- Template path: templates/YYYY-MM-DD/index.html (one template per date)
- Live URL: https://templates.aquariit.com/YYYY-MM-DD/
- Home (date index): templates/index.html → https://templates.aquariit.com/
- 404 page: templates/404.html

## Git workflow
- One branch per day: template/YYYY-MM-DD, created from latest main
- Never commit or push directly to main
- Never run wrangler deploy manually; deployment is owned by
  .github/workflows/pipeline.yml (checks → PR → merge → deploy → smoke test)
- Commit format: template: YYYY-MM-DD <slug> — <one-line concept>

## Design log schema (design-log.json)
Each entry: date, slug, url, theme, layout archetype, color palette
(hex array), font pairing, signature visual motif, animation style,
page purpose, one-line description.
JSON keys: date, slug, url, theme, layout, palette, fonts, motif, animation,
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
- Typical sections: nav, hero, features/content, social proof, CTA, footer —
  adapt to the concept

## Instagram social kit (required for every template)
Every template ships with social/YYYY-MM-DD.md (NOT inside templates/, so it is
never deployed). It is the ready-to-paste kit for the Instagram Reel/post:
- `## Hook` — one line of on-screen text for the first 2 seconds
- `## Caption` — 2–4 short lines; the first line must contain the main
  search keywords in natural language (Instagram ranks on caption keywords)
- `## Keywords` — 8–12 search phrases (SEO terms for caption, alt text, on-screen text)
- `## Hashtags` — EXACTLY 5, each starting with # (Instagram's per-post limit
  since Dec 2025): 2 broad, 2 niche, 1 topic-specific; then an `Alternates:` line
  with 5 more to rotate between posts (never all together)
- `## Music` — lines `Mood:`, `Genre:`, `BPM:`, `Search:` (3–5 terms to type into
  Instagram's audio search), `Accent sounds:` (optional SFX), `Avoid:`
- Music rules: the account may be a business account, so suggest moods/genres
  and search terms that match Meta's royalty-free Sound Collection. Never name
  specific copyrighted songs or claim a track is trending.
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
templates/index.html (home shell), templates/404.html,
templates/manifest.webmanifest, templates/sw.js, templates/icons/,
wrangler.jsonc, scripts/, .github/, .claude/

## Never do
- Force-push, rewrite history, or delete branches yourself
- Push to main or deploy manually
- Delete or modify past templates (unless fixing a broken record)
- Edit this CLAUDE.md file
- Commit secrets, large binaries, or files outside this project
