# Improvement to-do (owner, 1 Nov 2026)

Priority order for overall growth (more reach, followers and saves for less Claude time). The spare-usage night (CLAUDE.md, "Spare usage
night") works this list top-down, one item per push, and updates it: done items move to "Done" with the date. P1 = now, P2 = next, P3 = later.
Sources: design/webin20sec.md "Automation roadmap", design/channel3.md, the Results log (design/experiments.md) and the owner's brief of 1 Nov 2026.

## P1
- [ ] Reels 2-3 days ahead per channel, kept topped up: a missed day costs reach, and a buffer lets the daily run spend its time on quality.
- [ ] Turns Out starter, next layouts: a map move and a globe station for starter25d.html (the opening, stations, fly-through, number roll and payoff are in it since 3 Nov).

## P2
- [ ] Growth step 4: show the AUDIT_SIGNALS (best hour, best format, follower reels) in the app's Growth view.
- [ ] @techin20sec topic shortlist from primary sources each morning on GitHub (roadmap 4): 3 candidates with sources and a viewer-stake hook.
- [ ] One daily routine per channel that writes the script, renders stills to a private review page and stops (roadmap 3).

## P3
- [ ] Posting through Instagram's content publishing API (roadmap 6; needs Meta's review, owner's call).

## Done
- 1 Nov 2026: Posted list per channel with numbers; MP4s removed 15 days after upload; audit cards in the app; spare-usage night card,
  push reminder and "Spare check" workflow; Growth step 1 (followers and reach-per-reel charts per channel, light and dark); "Needs you" list for the owner's answers; Posted rows open (video, then cover after 15 days).
- 3 Nov 2026: spare-usage night is opt-out (owner: "my remaining usage goes to waste"): the Tuesday card says Claude uses it tonight with one
  "Skip tonight" button; the push says "Tap to skip"; each reminder send is logged and the card shows "Last reminder: <time>, sent to N phones".
- 3 Nov 2026: Turns Out posts daily (cost test passed on 2 Nov); next week's topics planned per channel and day in design/topics.md
  (every Tuesday night from now on); spare night built the Turns Out reel for Wed 4 Nov ahead ("Why are there 60 minutes in an hour?").
  Next spare night: start with "Reusable Turns Out story layouts in kit25d.js" (the 60-minutes scene adds two reusable pieces: a
  fly-through from one circle into the next era, and an exact deep zoom drawn in screen space past the kit's 5 cm limit).
- 3 Nov 2026: stills.mjs scans every 0.5 s of a reel and fails on a nearly flat frame ("EMPTY FRAMES"); the render workflows' ffmpeg
  fallback (used when the apt mirror is slow) works again.
- 3 Nov 2026: Growth step 2: "What each reel did" in the Growth view (typical saves and shares per 1,000 reached and % watched, and
  every reel with its rates and the follower change on its day, the best in each column starred).
- 3 Nov 2026: stills.mjs also prints TEXT FIT (any DOM text past its clipping box or the frame's side margins, every 0.5 s; fails the
  check). Covers the web showreels; techreel scenes keep their own --stills check.
- 3 Nov 2026: Turns Out starter: node scripts/channel3/new25d.mjs makes a new 2.5D reel from scripts/channel3/starter25d.html (core, kit,
  two stations with a fly-through, hook, captions, kinetic type, credit, payoff, sound), qa clean and stills without empty frames.
- 3 Nov 2026: the audit's numbers are computed on GitHub after each nightly collect (scripts/audit-numbers.mjs prints AUDIT_CHANNELS,
  ready as the card's "channels"): the daily run reads one line instead of the raw data.
- 3 Nov 2026: Growth step 3: the nightly audit numbers also print AUDIT_SIGNALS (30 days per channel: best posting hour, best format,
  the reels with the biggest follower gains); CLAUDE.md tells the daily run to plan from it.
