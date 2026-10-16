# Reel themes (owner, 16 Oct 2026)

A reference the owner likes becomes a **theme**: one more look the account can wear on a given day. It never replaces another theme.
Each reel picks one theme; the theme's own recipe and checks apply to that reel only.

## How we work (owner, 16 Oct 2026)
- **Hand in hand, daily.** Every reference the owner shares, and anything Claude comes across that fits, goes into this system the same day
  (design/brand/references.md + a theme, a part or a check). The system gets a little better every day and never worse.
- **Use what we have, match the rest as we go.** If a reference needs something we cannot get yet (e.g. the owner's filmed clip), build the closest
  realistic version we can, and keep the theme so it improves later. Never drop a theme because it is not perfect yet.
- **Lean on usage.** Stay well under the weekly limit: heavy renders on GitHub only, stills not full previews, no polling, small batched commits.
  Small, clearly-in-scope steps (S) are done without asking; M or bigger waits for a go.

## Rule 1: improve, never override (owner, 16 Oct 2026)
"We use these learnings to improve things in future, not upgrade to something beautiful then degrade it because we replaced one good thing with a
bad one. That's not improvement, that's just overriding."
- **Add, don't swap.** A new learning adds a theme, a part, an option or a check. What already works stays as it is.
- **A change to an existing theme must beat it.** Re-render that theme's benchmark (below) before and after. Ship the change only if the new stills are
  at least as good on every point of the theme's recipe and better on one; otherwise it does not go in.
- **Checks are per theme.** A check made for one theme never judges another (e.g. "fullness" belongs to theme A; a calm one-subject frame is right for B).
- **Shared parts are extended with options, not changed in place.** When a shared part needs a new behaviour, add an option whose default is the old one,
  so every earlier reel renders the same.
- **Removing something needs evidence.** Only when the owner says so, or the numbers (design/experiments.md) show it hurts.

## The themes
`S.dna.theme` in story.js names it; the renderer writes it to film/ID/manifest.json; the gate picks its checks from it (`scripts/film/reel-gate.py --theme`).

### A · `collage` — makeover collage (live since 15 Oct; the look in design/brand/premium.md)
Real sites in device frames, UI layers, problem → makeover → proof. Navy, white, one lime accent, coral only for the problem; three layers in every frame.
Premium means **rich, ordered detail across the frame**.
Checks: shots, static, fullness, ending (+ contrast warning). Benchmark: film/2026-10-16-0850.

### B · `soft3d` — one soft 3D hero (reference R1, design/brand/references.md; not built yet)
One character or object, fully rendered, on a calm dark ground with a coloured halo; it changes mood or state every 1-1.5 s; colour follows the mood;
squash/stretch and springs; depth particles; a title and one line of text at most.
Premium means **a rich subject in a calm frame**.
Checks: shots, static, ending, subject (the hero is visible every second; no fullness rule). Benchmark: the first soft3d film.
Needs first: a soft-3D shading part (highlight, inner gradient, contact shadow, halo), squash/stretch presets, depth particles.

### C · `footage` — our site filmed on a real screen (reference R2; needs the owner's clip)
The owner films one of our templates on a desk screen with the phone (10-15 s, hand on the mouse), we add one hook line and the end card.
Premium means **authenticity and a fast rhythm**.
Checks: cuts (a new picture every ≤ 1.2 s), ending. Runs only when a clip exists; otherwise skipped in the rotation.
For it to wow, the filmed template needs a 3D hero section (terrain, globe, product): a template-side upgrade.

### D · `sitescroll` — one premium template, scrolled full-frame (reference R3; no filming needed; not built yet)
Our renderer scrolls one of our own templates top to bottom at full frame, with one hook line pinned on top and our end card. No camera, no collage.
Premium means **the site itself is the show**: a hero light effect (silk-light ribbon), editorial type (sans + italic serif), glass panels, one accent.
Checks: to define with its benchmark (likely: ending, and a smooth scroll with no stall over 1.5 s; no fullness rule).
Needs first: a template built to the R3 bar (the template side of the daily run), then a scroll-capture part in the film engine.
Also the closest no-camera stand-in for theme C until the owner can film a clip.

### Later · `glass` — glossy glass product (Blender pilot, 16 Oct: path tracing too slow on free runners; an engine glass part instead)

## Rotation
Mon / Wed / Fri, never the same theme two reels in a row (checked by scripts/check.mjs from 17 Oct). A theme joins the rotation only once its parts
exist and its benchmark passes; until then the rotation uses the ready ones (today: A only). Each theme's look stays locked while we rotate; it changes
only through Rule 1.

## Adding a theme
1. The owner sends a reference. Study it in design/brand/references.md (what is on screen, why it is premium; technique only, never copy).
2. Add a section here: name, look, what premium means for it, its checks, its benchmark, what must be built first.
3. Build the parts as new options in scripts/film/parts.js; add the theme's check profile to reel-gate.py (`PROFILES`).
4. Make its benchmark film, get the owner's yes, then add it to the rotation.

## Learning by theme
reel-log.json and the Instagram numbers are compared per theme (reach, watch time, shares, DMs), with the owner's 1-5 scores for look, motion and story.
The rotation can lean towards a theme that brings DMs, but never drops one without the owner.
