# Aquarii brand kit v1 (15 Oct 2026; owner: one recognisable look, replace the water waves)
Every reel uses this kit; the template page it shows can have its own look (it is the client's site, our proof).

| Token | Hex | Use |
|---|---|---|
| Ink | #0A0E17 | background of type cards and the ending |
| Paper | #F3F5F8 | light grounds, text on Ink |
| Blue (primary) | #2F6BFF | our colour: highlights, the "fixed" state, the mark |
| Lime (accent) | #C6F432 | success, ticks, the CTA keyword |
| Coral (problem) | #FF5A4F | the pain: attacks, slow, broken |
| Slate | #8A93A6 | secondary text |

- **Type:** Montserrat 800 for the wordmark only; Archivo (display, width 85-100, weight 800-900) for hooks and type cards; Geist Mono for labels and numbers. Both open-licensed Google Fonts and already loaded by the film engine.
- **Logo (v2, 16 Oct 2026; owner: match the reference exactly):** design/brand/aquarii-logo.svg is the owner's own reference mark (their other entity; "copy it"): an exact traced outline with the reference's own shading inside it. Wordmark "Aquarii" in Montserrat 800 with the reference's blue gradient (#2F68B0 → #16346C), "TECH STUDIO" in Montserrat 600 with wide tracking between two thin rules (a little lighter grey than the reference so it reads on navy). Lockup: design/brand/aquarii-logo-lockup.png (transparent), source design/brand/aquarii-lockup.html. Reels still use the older drawn mark in scripts/film/parts.js until the owner approves switching. No water, drops or waves.
- **Ending (last ~2 s of every reel):** Ink card, the mark, "Aquarii Tech Studio", then "DM us “KEYWORD” · Follow for more" with the keyword in Lime. Built by `P.brandEnd` in scripts/film/parts.js.
- **Captions:** pill style, Ink at 85% with Paper text, one coloured word (Blue = good, Coral = problem).
- **Voice:** the AI voice af_heart on every reel (Kokoro); "we", calm and expert; English; no invented numbers, clients or testimonials. Prices never shown: "DM us for pricing that fits your needs".
