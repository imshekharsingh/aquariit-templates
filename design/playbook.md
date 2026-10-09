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

