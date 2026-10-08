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
