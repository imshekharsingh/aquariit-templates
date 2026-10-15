# Aligned plan (owner + Claude, 15 Oct 2026). Source of truth for reels from now on.

## The business
- Clients: small businesses in India first; the look must also win larger clients' trust.
- Sell, in order: (1) website design + SEO, (2) CDN/speed/protection setup (the owner's strongest skill), (3) website security + maintenance.
- Voice: always "we", a confident, experienced team of specialists. Honesty line: never invent specifics (years in business, client counts, results, testimonials).
- Money: at least INR 25,000 per client per year (internal floor, never published). Clients should feel treated like a big company at a small price. Several packages (design/packages.md).
- Prices are NEVER shown. Reels and captions say: "DM us to discuss pricing that fits your needs; we offer competitive prices." (keeps the currency and scope open).
- Client worries: not known yet; reels rotate the five common ones (hacked, slow, builder disappeared, not found on Google, not sure it is safe) and we do more of whatever brings DMs.

## The reels
- English captions and AI voice-over (keep the voice; owner wants to hear more voice variations).
- One recognisable Aquarii look on every reel: one palette, one font, one logo mark, one ending. Replaces "every reel looks like its own brand".
- New brand kit; the water-wave (zigzag) icon is replaced.
- Ending: why to DM (talk through your needs / pain points), the DM keyword, then "we'll find the package that fits you" + follow; the spoken/on-screen close is "DM us to know more" (owner, 15 Oct 2026). No prices, no free promises. The owner replies to DMs within a few hours.
- 3 reels a week (owner, 15 Oct 2026): Mon, Wed, Fri, posted at 19:30 IST. Templates drop to the same days (one proof page per reel). Move to 4 (add Sun) once two reels in a row pass on the first render.
- Weekly mix (rotate): problem -> fix story; mini tutorial with voice; makeover (old site -> modern site); offer (one package explained, no price: "DM us for pricing that fits you").
- Final gate: the owner watches each reel once and replies "post" or "fix" in the Claude chat.

## Reel recipe (every film)
- Premium style (owner, 15 Oct 2026, "go full"; length is Claude's call per content, 15-30 s, see premium.md): calm "cinematic tech" look per design/brand/premium.md (one idea per frame, navy/white/lime, glass and light,
  one 3D hero shot, 1-1.5 s holds), voice af_heart at about 2 words/s, ending "DM us to know more". If the owner approves the 2026-10-15-0850 test, this replaces the 18 s line below.
- Before any full render (owner, 15 Oct 2026): `node scripts/film/storyboard.mjs ID` makes one 8-frame storyboard (the middle of each voice line + the reveal); in a chat session the owner
  approves it ("go") before the GitHub render; in a scheduled run Claude reviews the board itself and the automatic checks guard the render. Claude first reviews every second of the film as stills against: full frame (a subject, supporting detail and
  a depth layer), one focal point, nothing clipped at the sides, the picture matching the words.
- Phone draft before the full render (owner, 15 Oct 2026): Reel publish with `draft: true` renders half resolution, no motion blur, with the voice (about 6-8 min)
  and uploads ID-draft.mp4; Claude sends it, the owner checks motion and voice in 30 s, one feedback message (must-fix / nice-to-have), then the full render.
- Style is locked for 4-6 weeks (v5 cinematic tech); reels change story and content, not the look. Style upgrades happen once a month, on purpose.
- Automatic checks (fail = "Reel needs fix", never sent): voice pauses over 0.9 s between lines (0.6-0.9 s warns; the declared breath is exempt; lines may start up to 0.8 s ahead of their picture) and lines outside 2.3-3.2 words/s (Kokoro speaks about 2.9 words/s at 1.0x)
  (scripts/film/voice.mjs); fewer than 6 shots, a framing held over 3.5 s, more than 30% of seconds with under 25% of the frame holding detail ("fullness"),
  a dead ending (scripts/film/reel-gate.py).
- 8-10 shots in 18 s, a cut every 1.5-2.5 s; shot types: wide, push-in, close-up, full-width type card.
- Hook fills the width in the first second; one visible change per shot; high-contrast palette.
- Payoff transforms the picture at 13-16 s; CTA 16-18 s; no dead ending.
- Automatic quality gate on GitHub before the owner sees a reel: cut count, any shot static for 3 s or more, hook width, contrast, dead ending. A failing reel is fixed, not sent.

## Why (diagnosis of the 15 Oct reel)
One wide shot for 18 s, a busy object whose story needs captions, small corner type, a dead last 3 s, pale low contrast. Root causes: each film invented from scratch and self-graded, rules rewarding novelty over quality, no shot structure, review on stills not motion.

## Work list (sized; done in this order)
1. Packages draft: Care / Shield / Growth for owner approval (S).
2. Brand kit: palette, font, logo mark, ending card (M).
3. Voice sample pack: 4-6 English voices saying the same line, rendered on GitHub (S).
4. Reel recipe + quality gate in the film engine and checks (M).
5. Schedule: daily template routine -> Mon/Wed/Fri 08:50 IST; posting checklist 19:30 (S).
6. Rules: owner-approved CLAUDE.md update (lean draft + this plan), lift the motion freeze (S).
7. First reel on the new system, for Friday 16 Oct (M + GitHub render).
Superseded: process-review areas 2 and 3 (folded into the recipe and quality gate); the E12 motion freeze is lifted, the 19:30 posting routine stays.

## Working rule (owner, 15 Oct): hand over to automation
Foundations are built once in a session; after that the scheduled runs and GitHub workflows do the work. Sessions stay short.

## Revisit later (owner, 15 Oct 2026)
- Instagram today: the INSTAGRAM_TOKEN secret is read-only statistics (ig-collect.yml, daily, feeds /performance/). Nothing posts, replies or reads DMs.
- Add first, when we pick this up: the "Social Media Skills" plugin (Anthropic plugin directory; knowledge only, no account access): reels-script, hook-writer,
  caption-writer, instagram-seo, social-selling-and-dm, to sharpen hooks, captions and the DM keyword.
- Later, once DMs arrive often enough that replying by hand is a chore: the "instagram" plugin (official Graph API: read/reply comments and DMs, comment-to-DM,
  e.g. comment "FAST" -> auto DM). Needs its own Meta app with messaging permissions; the current read-only token cannot do it.
- Skip for now: Windsor.ai (paid; our collector already covers reach/watch/shares/saves), Posty (auto-publishing loses Instagram's music library),
  Hyper Marketing / AdWhispr (ads-focused), BlitzReels (we render our own films).
