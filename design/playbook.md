# Vibrancy playbook

A growing toolkit for making templates vivid and scroll-stopping. Every daily run MUST apply at least ONE
technique from the list below that has not yet been used (see advancements.md), and then log it.
The performance rules in CLAUDE.md still win: loop only transform/opacity, no animated blur/box-shadow/filter.

## Colour and light
- One saturated hero colour plus one unexpected accent; avoid timid, evenly balanced palettes.
- Static layered radial-gradient "mesh" backgrounds (never animated; move whole layers with transform if needed).
- Duotone SVG shapes and overprint effects (mix-blend-mode on static elements only).
- Grain/noise overlay drawn as an inline SVG pattern at low opacity.
- Light/dark inversion on a section boundary for a dramatic mid-page flip.

## Type
- Oversized display type that bleeds off the edge or is clipped by the frame.
- Outlined (text-stroke) words alternating with solid fills.
- Kinetic headline: per-line masked reveal, letters settling with a staggered transform.
- Variable-font weight/width contrast inside one headline (Google Fonts variable families).
- Marquee ticker band (transform-only, slow).

## Shape and illustration
- A custom hand-written SVG hero illustration that animates with stroke-dashoffset.
- Layered parallax depth using translate on 2-3 planes driven by IntersectionObserver or scroll-timeline.
- Clip-path reveals (circle, polygon wipes) triggered on scroll.
- Sticker/badge elements that rotate slowly (transform only).
- Pattern fills generated in code (dots, stripes, topographic lines, truchet tiles).

## Motion
- CSS scroll-driven animations (animation-timeline: view()) with a graceful fallback.
- Number counters, progress rings and bar fills that complete during the reel's payoff.
- Staggered card stack that fans out as it enters.
- Sequenced hero: element order plays like a short title card in the first 2 seconds.
- Cursor-free "magnetic" feel via scale/translate easing on reveal only (no hover dependence).

## Finish
- A memorable final frame: the CTA reveal that answers the reel hook.
- Micro-details: custom bullet shapes, hairline rules with tick marks, small caps labels, ornamental dividers.
- Consistent corner radius or hard-edge system chosen on purpose.

## Atmosphere (inspired by a lo-fi night-scene mood reference)
The reference is an illustrated rainy-night room: deep violet and indigo with a warm orange glow on the horizon,
soft cyan window light, and a glowing app-icon tile. Take the *feel*, never the artwork or branding; draw your own.
- Twilight gradient sky: violet to indigo to magenta, with ONE warm orange/peach glow band at the horizon.
- Hand-drawn SVG night scene (window, skyline, desk lamp) in flat shapes with a few lit windows as accents.
- Rain streaks as 20-40 thin SVG lines moved with transform only, low opacity, looping slowly.
- City-light bokeh: static soft circles in two or three colours, only opacity-twinkled.
- Glow tile: a dark rounded icon tile whose bottom edge fades into a saturated purple glow (static gradient).
- Floor/surface reflection: a mirrored, faded copy of the main light at the bottom of a section.
- Cozy detail layer: small scattered objects (paper scraps, mug, plant) drawn in SVG to make the scene feel lived in.

## Composition menus (structure, not skin)
Palette and fonts are skin. Visitors notice STRUCTURE, so each template must also differ from the previous
three in hero composition, section module and header style. Name your picks in the advancements line.

Hero compositions (hero:)
- type-only: giant headline fills the frame, no illustration
- scene-overlay: full-bleed scene with text laid over it
- diagonal-split: two colour fields cut at an angle, text on one, art on the other
- ui-mock: phone/dashboard mock-up built from CSS shapes
- data-hero: a chart or counter wall is the hero
- strip: a horizontal band of items sliding past (transform only)
- collage: overlapping rotated layers
- poster: framed cover with border, date and tiny print
- stack-reveal: layers peeling away as the hero loads

Section modules (modules:)
- big-number stats, horizontal swipe row, timeline, before/after pair, pricing table, quote wall,
  marquee band, sticky-title list, accordion-look list, checklist, step ladder, map/diagram, gallery grid

Header styles (header:)
- slim bar, floating pill, bottom bar, wordmark-centred, hidden-until-scroll, side tab
  (the required "All templates" link stays visible and reachable in every style)

## Modern direction (contemporary, product-grade)
Goal: pages that look like today's best product and studio sites, not heritage print. Prefer these over nostalgic looks.
- Aurora / mesh backgrounds: 3-5 oversized radial gradients in vivid hues, static or moved with `transform` only.
- Faux glass UI: translucent gradient cards, 1px light borders, inner top highlight, soft static shadow. NEVER `backdrop-filter`
  (the player removes it); fake depth with a blurred static blob behind the card instead.
- Soft 3D / clay shapes: layered inner shadows and radial highlights on rounded blobs (static), bouncy `linear()` entrances.
- Dark UI glow: near-black ground, one neon-leaning accent, glowing borders (static `box-shadow`), grid-line backgrounds.
- Product-UI mock-ups built from CSS shapes: dashboard, chat, calendar, code editor, phone; animate them (typing, bars growing, cursor moves).
- Gradient text and gradient strokes; oversized variable-font display type; tabular numbers for stats.
- Bento dashboards, sticky-title lists, logo marquee, testimonial wall, pricing table, before/after, FAQ-look list: conversion modules.
- Conversion kit for service pages: one-line value promise, proof numbers, 3-step process, pricing/packages, testimonial, strong CTA
  with a reason to act now. Every service-oriented template needs all five.
- Era balance: at most one vintage/period template (warm paper, art deco, retro, heritage craft) per three. Serif display
  headlines and cream backgrounds are the vintage signals; use them sparingly.

## CSS animation catalogue (what exists today)
Support notes come from MDN/Chrome/web.dev reading plus third-party posts; versions marked (unconfirmed) conflicted between
sources. Always wrap new features in `@supports` and make the FINAL state the default so unsupported browsers still look finished.
Reel rules still win: loops animate only `transform`/`opacity`; heavy properties only for one-shot reveals.

Scroll and view driven (run off the main thread, perfect for the ▶ auto-scroll)
- `animation-timeline: view()` / `scroll()`, `animation-range: entry 0% cover 40%` (named ranges entry/exit/cover/contain), `view-timeline`,
  `scroll-timeline`, `timeline-scope`. Safari 26+ (iOS 26 = iPhone 17 Pro), Chrome 115+. Declare `animation-timeline` AFTER the `animation` shorthand.
- Scroll-triggered animations: `animation-trigger` / `timeline-trigger` (Chrome 145 announced; treat as experimental, do not rely).
- Scroll snap, `scroll-padding`, sticky + `@container scroll-state(stuck: top)` (Chrome-only today: enhancement only).
Timing and motion
- `linear()` easing for springs, bounces, overshoot (all current browsers since 2024). `steps()` for typewriter and pixel looks.
- Individual transform properties `translate`, `rotate`, `scale` animated independently; `animation-composition: add`; `animation-fill-mode: both`.
- `sibling-index()` / `sibling-count()` for staggers without nth-child lists (Chrome 138; Safari 26.2 (unconfirmed)); fallback = same delay.
- `offset-path` + `offset-distance` + `offset-rotate`: objects travelling along an SVG path (use for one-shot flights).
- `@starting-style` + `transition-behavior: allow-discrete`: entry transitions for elements appearing from `display:none`.
- View Transitions API (`document.startViewTransition`, `view-transition-name`): state morphs between layouts; cross-document `@view-transition` for multipage.
- Counting numbers without JS: `@property --n { syntax:'<integer>'; initial-value:0; inherits:false }`, animate `--n`, print with `counter-reset: n var(--n)` + `content: counter(n)`.
Shape, colour, typography
- `@property` typed custom properties: animate angle, hue, percentage, colour inside gradients (repaint cost: one-shot only, never a loop).
- `clip-path` (circle, inset, polygon, `path()`, new `shape()` function) and `mask-image` / `mask-composite` reveals; `background-clip: text` gradient text.
- Colour: `oklch()`, `color-mix()`, relative colour syntax, `light-dark()`, `color(display-p3 ...)` wide gamut (iPhone shows far more vivid colour),
  gradient interpolation `linear-gradient(in oklch, ...)` avoids muddy mid-tones. Always give an sRGB fallback line first.
- Typography: variable fonts (`font-variation-settings`, `wght`/`wdth` axes), `text-wrap: balance|pretty`, `font-optical-sizing`, `initial-letter`, `text-box-trim` (new), tabular-nums.
- 3D: `perspective`, `transform-style: preserve-3d`, `rotateX/Y`, `translateZ`, `backface-visibility`; layered parallax with translateZ.
- Blend and filter (static): `mix-blend-mode`, `background-blend-mode`, SVG filters (`feTurbulence`, `feDisplacementMap`), `filter: contrast/saturate`.
- SVG: `stroke-dasharray`/`stroke-dashoffset` draws (`pathLength="1"`), SMIL `<animate>`, `<animateMotion>`.
Layout niceties
- Container queries and `@scope`; anchor positioning; `field-sizing`; `interpolate-size: allow-keywords` (Chrome) for height:auto transitions; `::details-content`; CSS carousels `::scroll-button` / `::scroll-marker` (Chrome 135+, experimental).

