<!-- PROPOSED (not applied). Moved word for word from CLAUDE.md lines 152-181 ("Instagram social kit: section formats"). Linked from CLAUDE.md; where this file and CLAUDE.md disagree, CLAUDE.md wins. -->
> Status: in force for every social/ID.md. Superseded lines (CLAUDE.md wins): "Format is a vertical 9:16 Reel recorded from the screen" -> the reel is a directed film; the recording is only the fallback. "`Shot plan:` (... what the ▶ player will show ...)" -> for a film, the film's 2-4 beats. "the ▶ player separately auto-picks one of its 11 generated styles" -> applies only to the player in the app; reels never ship code-generated music (Reel publish renders the fallback with --no-audio).

- `## Hook` — one line (≤ 8 words, a question or a surprising contrast) shown ON SCREEN by the renderer for the first ~3 seconds, so it must read at a glance. It must open a loop the end of the video
  closes: a buyer's question about OUR service ("Is your website actually protected?", "Why is your site slow abroad?"), a "Wait for …" promise, or a surprising contrast.
  Never a vague teaser, and never promise something the video does not show. Watch time is what Instagram rewards.
- `## Service` — one of web | social | security | edge | studio (design/services.md), matching the film's `S.dna.service`.
- `## Caption` — 2–4 short lines; the first line must contain the service's search keywords in natural language (Instagram
  ranks on caption keywords: "website security for small businesses", not the template's business); the LAST line must invite a share
  ("Send this to a founder doing IT alone, and DM us 'SECURE'") because shares sent per reach is a top ranking signal. Say "send", "share" or "tag".
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

