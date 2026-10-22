<!-- PROPOSED (not applied). Moved word for word from CLAUDE.md lines 51-84 ("Creative direction menus + Design quality bar"). Linked from CLAUDE.md; where this file and CLAUDE.md disagree, CLAUDE.md wins. -->
> Status: in force for every template page (design/playbook.md has the technique menus).

## Creative direction menus (rotate across these)
- Layout: editorial magazine, bento grid, asymmetric split, horizontal scroll,
  single-column long-form, card stack, full-bleed sections, sidebar-anchored,
  radial/orbital, brutalist grid, layered parallax
- Mood: MODERN — glassmorphism (faux glass), aurora/mesh gradient, pastel playful, claymorphism/soft 3D, dark UI glow,
  neo-brutalist pop, luxury minimal, Swiss modernist, bento dashboard, kinetic type, spatial 3D cards, monochrome high-contrast, dark neon.
  VINTAGE (use sparingly) — warm paper/print, Japanese-inspired calm, art deco, retro-futurist, organic/botanical craft.
- Purpose: SaaS landing, portfolio, agency, product launch, event,
  restaurant, personal blog, consultancy, app showcase, nonprofit, studio; and pages that prove the day's service line (design/services.md):
  status/uptime page, security dashboard, global storefront, social content hub, booking site for a service business

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

