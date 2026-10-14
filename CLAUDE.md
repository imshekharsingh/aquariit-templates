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
(Since 2026-10-14 the daily reel is a film, so the player recording below is only the fallback. Keep the page rules (they make a good phone page), but
`reel-audit.mjs` and `reel-perf.mjs` are no longer required in the daily run; run them only when a film has failed and the recording is used.)
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
  or `data-reel-bleed`. Also keep key text above the bottom ≈22%.
  **Top and right zones (enforced):** Instagram's status bar + Reels tabs cover the top ≈96 css px, and its button column (like/comment/share) covers the
  right ≈16% (x > 338px) between ≈50% and ≈90% of the height. The ▶ player already pushes the first content below 96px and fades the tail of the previous
  block under the bar, so do not add your own extra top padding; never leave short right-aligned items (prices, badges, "per month", status pills, key numbers,
  right-hand CTAs) in that right zone on phones: left-align, stack or centre them.
  `node scripts/reel-audit.mjs <ID>` prints SIDE-TIGHT lines (sides, TOP-ZONE, RIGHT-ZONE) and must end with "side safety: OK".
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
**Growth rules (owner-delegated, evidence-driven):** the account exists to attract clients for Aquarii Technologies, so every concept and hook speaks to the buyer
(a business owner or founder: money, time, results, "what should it cost / where am I losing / can it do X"), not only to designers. The reel starts moving at
frame 0 (no static title card), shows the hook on screen, runs ~18 s and pays off in its last 4 s. What is being tested, what the numbers said and what to try
next live in design/experiments.md; the operating rhythm and the do/don't list live in design/growth-playbook.md.
**Audience: people's choice (design/market.md; owner decision 13 Oct 2026, replaces the India-first market rules):** no fixed country, currency or business list.
Pick the business type, market and currency per concept from what people respond to: the latest "Instagram collect" workflow log (per-reel reach, watch time, shares,
saves, comments), audience countries when known, and what commenters ask for. One honesty line stays: never present invented results as Aquarii's own work or
clients (numbers inside a fictional brand's page are example content, never the hook).
- `## Hook` — one line (≤ 8 words, a question or a surprising contrast) shown ON SCREEN by the renderer for the first ~3 seconds, so it must read at a glance. It must open a loop the end of the video
  closes: a question ("Can a website feel like tea? Watch to the end"), a "Wait for …" promise, or a surprising contrast.
  Never a vague teaser, and never promise something the video does not show. Watch time is what Instagram rewards.
- `## Caption` — 2–4 short lines; the first line must contain the main search keywords in natural language (Instagram
  ranks on caption keywords); the LAST line must invite a share ("Send this to someone redesigning their site, and follow for
  a new template every day") because shares sent per reach is a top ranking signal. Say "send", "share" or "tag".
- `## Keywords` — 8–12 search phrases (SEO terms for caption, alt text, on-screen text)
- `## Hashtags` — EXACTLY 5, each starting with # (Instagram's per-post limit
  since Dec 2025): 2 broad, 2 niche, 1 topic-specific; then an `Alternates:` line
  with 5 more to rotate between posts (never all together)
  Hashtags are SECONDARY now (owner decision): the text pasted into Instagram is the caption plus one keyword line (the first 6 `## Keywords` joined with ` · `),
  hashtags stay in the kit as an optional extra. Write the first 6 keywords in order of search value.
- `## Reel` — lines `Length:` (15–20 s: scripts/render-reel.mjs renders reels at ~18 s; shorter = higher completion for cold viewers),
  `Shot plan:` (2–4 beats of what the ▶ player will show: it only scrolls and plays animations, it never taps),
  `Payoff:` (the moment near the end that answers the hook and rewards finishing, e.g. a signature animation completing or
  the final CTA reveal — make sure the template actually has one in the last 4 seconds of the 18 s reel), `Cover:` (3–5 word cover text; the cover card is its own image,
  uploaded as the Instagram cover, never the first seconds of the video)
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

## Directed film (the ONLY daily reel format from 2026-10-14; owner decision delegated to Claude, 13 Oct 2026)
Every daily reel is a directed motion film; screen recordings are retired (they averaged 2.5-4.6 s watch time) and stay only as the automatic fallback when a film fails to render.
Engine: scripts/film/ (engine.js, the parts library parts.js, render-film.mjs); per template: film/ID/story.js + timing.json. 18 s, 30 fps, 1080×1920, the hook building from frame 0,
a held "breath" before the payoff, payoff in the last 4 s, a last frame that loops into the first, effects-only sound (owner adds Instagram audio). How-to: design/film-playbook.md.
**Every reel looks like its own brand.** The account showcases range for many clients, so there is no house style. Only these stay constant: captions readable at phone size,
nothing key under Instagram's UI (top 96 px, bottom 22%, right column), smooth motion, a clean loop, the "Aquarii Tech Studio" watermark (lower centre at y 540, between the captions and
Instagram's caption area, the whole reel; P.scene adds it; keep that band free of key text) and the sign-off at the end (P.signoff).
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

## Music & Sound: you are the Music Supervisor and Sound Editor

You do not synthesize music in code. Never use oscillators, code-generated
synths, or programmatic tone generation as the music bed. Music comes from
a licensed music generation API; your job is to brief, select, edit, sync,
and mix it like a professional.

### 1. Write the music brief from the storyboard (before generating)
Derive it from the locked shot list, not the other way round:
- Target duration (exact seconds) and BPM chosen so key cuts land on beats
  (e.g., 120 BPM = a beat every 0.5 s; pick a BPM that fits the shot timings)
- Mood and genre in plain descriptive language that matches the template's
  visual DNA. Never name artists, songs, or labels.
- Instrumentation: 3–5 specific instruments or textures (e.g., "felt piano,
  brushed drums, warm sub bass, airy pads")
- Energy curve mapped to the arc: intro (sparse) → build → drop or peak at the
  hero reveal timestamp → resolve → loop-friendly ending
- Hit points: list the exact timestamps that need a downbeat, impact, or
  silence (the "breath" before the reveal)
- Instrumental only, no vocals, unless the concept explicitly calls for them

### 2. Generate with structure
- Use the music API's section or composition-plan feature so each section's
  duration matches the storyboard (intro, build, peak, outro).
- Generate 3 candidates with meaningfully different interpretations
  (instrumentation or energy), not 3 near-identical takes.
- Save each with its prompt, model, date, and licence terms to
  `audio/<date>/` and record the provenance in reel-log.json.

### 3. Evaluate candidates (you cannot listen; analyse instead)
For each candidate:
- Detect tempo and beat grid (librosa or aubio). Reject if the tempo drifts
  or beats are unclear.
- Measure how closely beats and onsets align with the storyboard cut points
  and hit points. Score the alignment.
- Measure loudness and dynamics (ffmpeg ebur128): reject if it's flat or
  overcompressed with no dynamic arc, or if it clips.
- Render a spectrogram and an energy-over-time plot as images and inspect
  them: the energy curve must visibly rise into the peak timestamp.
- Pick the best candidate and state why in 2 lines.

### 4. Edit music to picture
- Cut and extend only on bar boundaries; never chop mid-phrase.
- Re-time the edit so the strongest downbeat lands exactly on the hero
  reveal frame. Adjust picture by a few frames if that serves both better.
- Create the "breath": a 0.25–0.5 s dip or full silence before the peak.
- Make the end loop back seamlessly into the start: match bar position and
  crossfade on a beat.
- If stems are available, duck or mute individual stems (e.g., drop drums
  in the intro) rather than editing the full mix.

### 5. Sound design layer
- Generate or source SFX from a licensed source only: whooshes on camera
  moves, soft UI clicks on micro-interactions, risers into reveals, impacts
  on downbeats, subtle tails on cuts.
- Every SFX must be motivated by something on screen. No random whooshes.
- Pitch and filter SFX to sit in the track's key and tone.

### 6. Mix and master
- Balance: music bed, SFX, and any voice each have their own space.
  Carve EQ so SFX transients aren't masked; sidechain-duck the music
  2–4 dB under impacts.
- Gentle bus compression for glue; high-pass anything that doesn't need lows.
- Final limiter: about −14 LUFS integrated, true peak no higher than −1 dBTP,
  no clipping. Verify with a measurement, not by assumption.
- Check that the mix still works on phone speakers: keep the key musical
  element present in the 200 Hz–5 kHz range.

### 7. Log and learn
In reel-log.json, record the music brief, chosen candidate, model,
alignment score, loudness readings, and the user's feedback on the
music when given. Before writing a new brief, read the last 7 entries:
don't repeat a genre, instrumentation set, or BPM range back to back, and
apply any feedback the user gave on past tracks.

Credentials for any music or sound API exist only as secrets (GitHub Actions / local environment), exactly like the site credentials: NEVER write a key into any file.
Until a licensed music API is connected, films ship with NO music bed (picture, plus effects only if a licensed source is available) and the owner adds Instagram's own audio at posting
(the kit's `## Music` section still gives mood, BPM and search terms for that).

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
