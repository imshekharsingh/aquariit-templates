# Improvement to-do (owner, 1 Nov 2026)

Priority order for overall growth (more reach, followers and saves for less Claude time). The spare-usage night (CLAUDE.md, "Spare usage
night") works this list top-down, one item per push, and updates it: done items move to "Done" with the date. P1 = now, P2 = next, P3 = later.
Sources: design/webin20sec.md "Automation roadmap", design/channel3.md, the Results log (design/experiments.md) and the owner's brief of 1 Nov 2026.

## P1
- [ ] 11 Nov 2026, from the first research pass (design/references.md, R-trend 11 Nov), before the experiments that need them:
  - caption question line: newweb.mjs and the techreel starter write caption line 1 as a one-word-answer question and the last line as the
    comment ask (E20 web from Sun 15; E21 tech uses it only if E20 wins);
  - a series tag in kit25d.js (`Kt.seriesTag(name, n)`: small, above the hook in frame 0 and on the cover; the guess starter calls it) (E22, Mon 16);
  - Trial Reels: one "Needs you" yes/no for the owner on the daily run (is "Trial" offered when posting on each account?); if yes, post one
    hook variant of a reel as a trial (non-followers only) to read hooks without risking the grid.
- [ ] Reel tooling that raises the hit rate: the stills review prints a rulebook score block (design/rules-*.md) next to the sheet.
      (The 2-3 day buffer item was dropped on 5 Nov 2026: owner, learn-then-build.)

- [ ] 11 Nov 2026, from design/references.md (MISSING kit pieces; one per push, web kit first):
  - a pivot-word beat: one word alone, its own world response (R2);
  - a travelling object that becomes the transition (one shape through the reel, declared to FLOW) (R2, R3);
  - an organic wipe (a liquid wave or brush-smear reveal), cheap (rule 12: no full-frame mask) (R2);
  - icons inside sentences (a small drawn icon in the line of type, sized to the text) (R3);
  - letters spread on guide lines that snap into a word (R3);
  - a hand-drawn ring that circles a final number (R4).

## P2
- [ ] @techin20sec topic shortlist from primary sources each morning on GitHub (roadmap 4): 3 candidates with sources and a viewer-stake hook.
- [ ] One daily routine per channel that writes the script, renders stills to a private review page and stops (roadmap 3).

## P3
- [ ] Posting through Instagram's content publishing API (roadmap 6; needs Meta's review, owner's call).

## Done
- 11 Nov 2026: first research pass (design/references.md, "R-trend: first weekly research pass"): 7 trends kept with sources, 2 kit pieces
  and 1 owner item to todo; next experiments queued after E17-E19: E20 web (caption asks a question and a comment), E21 tech ("ships with
  this ON" default hook), E22 Turns Out (a named series); topics in design/topics.md. Weekly from now on the spare-usage night.
- 11 Nov 2026: web colour variety: 5 palettes in look C (kitmotion.js KM.PALETTES: aurora, ember, lagoon, orchid, glacier), rotated by newweb.mjs
  (scripts/explainer/palette.mjs, the config's "palette"), CONTRAST line in preflight (scripts/showreel/contrast.mjs, 4.5:1 on rendered frames),
  scripts/explainer/palettesheet.mjs for a sheet of a scene in every palette. Citrus tried and dropped (muddy at phone size).
- 4 Nov 2026: reel media live in the private R2 bucket aquarii-reels (only the signed-in app serves it; Range/seek and Save video kept).
  Renders, tech reels, previews, reel study and the minutes meter write to R2; the "Showreel ready" issue names the reel only; an R2
  lifecycle rule deletes v/ (MP4 + contact sheet) 15 days after upload; the release clean-up moved to attic/. The old release files
  were copied ("R2 -> move") and the releases emptied.
- 3 Nov 2026: Turns Out starter, map and globe: kit25d.js has Kt.globe (a matte cut-paper globe that turns a place to the front), Kt.map
  (the same coastlines flat, so the camera dives from the globe onto the map with no cut), Kt.route/Kt.bow and Kt.place (pin tags that stay
  in the frame); starter25d.html goes hook -> globe -> dive -> route from A to B -> payoff. qa clean, stills: no empty frames, text fits.
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
- 3 Nov 2026: Growth step 4: "What works" card in the Growth view (best time to post, best format, reels that brought followers; 30 days).
- 3 Nov 2026 (spare night, second session): reels ahead: tech "Apple Pay card number" (4 Nov) and "Wi-Fi fake address" (5 Nov), web Nº 14
  sticky header (5 Nov) and Nº 15 anchor under header (6 Nov), Turns Out "Was the Sahara always a desert?" (5 Nov) and "Tea or chai?" (6 Nov);
  CLAUDE.md buffer rule (a run builds for the first day without a reel).
- 3 Nov 2026: scripts/reel-status.mjs: one command after a render for its result, voice check, issue and contact sheet (was done by hand).
