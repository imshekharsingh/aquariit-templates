<!-- Moved word for word from CLAUDE.md lines 85-135 ("iPhone Reel frame"). Linked from CLAUDE.md; where this file and CLAUDE.md disagree, CLAUDE.md wins. -->
> Status: the screen recording is the automatic FALLBACK when a film fails to render (CLAUDE.md "Directed film"). The page rules below still apply to every template page (they make a good phone page) and scripts/check.mjs still enforces viewport-fit, theme-color, `html.reel` and the `--safe-*` convention.

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

