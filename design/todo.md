# Improvement to-do (owner, 1 Nov 2026)

Priority order for overall growth (more reach, followers and saves for less Claude time). The spare-usage night (CLAUDE.md, "Spare usage
night") works this list top-down, one item per push, and updates it: done items move to "Done" with the date. P1 = now, P2 = next, P3 = later.
Sources: design/webin20sec.md "Automation roadmap", design/channel3.md, the Results log (design/experiments.md) and the owner's brief of 1 Nov 2026.

## P1
- [ ] **NEXT (owner asked for the write-up, 26 Nov 2026; waits on the owner's yes with the cost)**: **Full check before render 1** (`scripts/preflight-all.mjs <reel>`).
  Why: on 25-26 Nov most render 1s failed on things a local check could catch, and each extra render plus its session costs about $8-15
  (web 48 took 3 renders, about $27; tech 2 renders, about $26). Today's preflight checks only marked elements, and Output QA runs only on the final MP4.
  What it does, all locally in the builder's session, under 2 minutes, no GitHub render:
  1. A cheap preview: the scene at 360x640, 10 fps, with the real voice if made, else the fake voice.
  2. Output QA on that preview with the same thresholds (scripts/qa/output-qa.py: PACE, HUE/LOOK, COLOUR, FILL, EDGES, VARIETY, NUMBERS, SYNC, BULK).
  3. TEXT CLEAR: every text box against every other visible element and the subtitle band every 0.25 s, not only the marked ones
     (today's misses: numbers over the phone and the pointer line in tech; chips on borders and the subtitle pill in Turns Out).
  4. Review-file lint: direction card APPROVED, items 1-19 filled, PREMIUM line, no stale CRITIC line format.
  5. Prints one line `PREFLIGHT-ALL: PASS` or `PREFLIGHT-ALL: FAIL <check> <time> <what>`, and the builder pastes it in the review file.
  Gate: scripts/review-gate.mjs refuses render 1 without `PREFLIGHT-ALL: PASS`. Runbook line in design/runbook-reels.md "Preflight".
  Test: run it on today's three render 1 scenes (web 48 v2, tech tag-sounding r1, Turns Out invite r1); it must flag the tech numbers and the
  Turns Out overlaps. The web "nothing happens in the first 7 s" fault is a taste call: it stays with the stills check and the critic.
  Size M, one cheaper-model session, estimate $5-8, no renders.
- [ ] 21 Nov 2026 (owner: "mark it to-do, we pick this up soon"; second account, not for the spare night): **Journey you can drive**. Four
  buttons, not seven manual stages (render and checks already run themselves): (1) **Approve plan** on a planned reel: topic, script and 3 stills
  shown, Approve or Change + note, before any render (saves the 2-render budget); (2) **Approve to post** after Output QA: the owner's watch
  replaces the critic that keeps not running, the reel moves to Ready; (3) **Fix** on any red stage: sends the failure line as a top-priority
  Feedback item; (4) **Build next** for Turns Out (design series, no dates): queues the next design reel in design/c3-plan.md section 0.
  Needs: a Worker route that stores the approvals (like /api/asks), the daily runs reading them first, and the owner adding a GitHub token
  that can start workflows (Needs you, never in a file). Option later: an instant build via a GitHub workflow with a Claude API key (owner's
  cost call). Size L (1-3 h).
- [ ] 18 Nov 2026 (owner: "new ones don't get much visibility"): **run design/c3-strategy.md for Turns Out** from Mon 23 Nov: 20-26 s reels, frame 0 = the wrong-looking icon, a send line, series "NOT HOW YOU PICTURE IT"; add targets.md rows for E27 (week 1) and E28 (week 2); check the Echoes config can be 5 lines, else use the story engine. Size S per reel.
- [x] 16 Nov 2026 (done 21 Nov, second account: Inbox "References", /api/refs, Owner answers `refs` / `refs-done`): **"Add reference" in the app's Inbox tab**: paste a link (Instagram reel, site), upload a
  screenshot or a short clip (private R2 under refs/, size cap per file, never in the repo), optional note and channel. The daily run reads new
  references with Feedback, studies each into design/references.md (techniques only, never a piece) and replies on the item; status per
  reference: new -> studied -> used in <reel>. Size M.
- [ ] 15 Nov 2026 (night): showreel-tech-screen-120hz (posts Tue 17 Nov 13:00) needs ONE re-render on Mon 16 evening before its post: the glass sheen was removed from techkit/scenes/screen-120hz.js and techkit/base.html changed (subject box, holds), so its R2 video no longer matches its source. Check its Output QA SHEEN and HERO lines (HERO may need a bigger, busier phone and no box around the hero, rules-tech.md K1: the 5 ATM rebuild is the pattern) and update review/tech/showreel-tech-screen-120hz.md item 13.
- [ ] 14 Nov 2026: the whole-frame tabs reel took 33 GitHub minutes (frames 29.2, was 19.5 before the rebuild; rule 12 caps 30): find the frame cost (the blurred line glow `.inkg` filter, the bigger cards) and bring a 20 s whole-frame reel back under 25.
- [ ] 14 Nov 2026 (owner: "squeezing most of it in one place of the screen"): move the two web starters (starterweb.html, starterdetails.html,
  newweb.mjs) to the whole-frame layout of showreel-36-tabs (rules-web.md rule 16: KM.ZONES, subtitles under the top zone, hero to y 780,
  card edges locked with KM.worldY), so tomorrow's reel starts from it; Output QA SPREAD already fails a squeezed reel.
- [ ] 12 Nov 2026 (owner, E23): web kit "split" piece: the broken and fixed versions of the same component running side by side in sync (labels BEFORE / AFTER, the broken one visibly misbehaving), one call in kitmotion.js and an option in newweb.mjs, so every web reel can show its fix as motion; must pass SAFE ZONE, OVERLAP and FLOW on the starter. Needed by Fri 13 Nov 06:47 IST.
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

- [ ] 13 Nov 2026: support.google.com (Android help pages) is refused by the session's network (proxy 403), so tech reels cannot re-read Android setting paths the morning they are built (rules-tech.md rule 3): read them on GitHub instead (a small workflow step that fetches the topic's support.google.com sources and prints the matching lines), or ask the owner to allow the host.

- 14 Nov 2026 (real media, not done today): short real VIDEO clips (Wikimedia webm / NASA) in the Media workflow and both engines; DVIDS (needs a key) and NOAA as sources; a depth map (MiDaS) for true photo parallax instead of overlay layers; a real photo at tech frame 0 (the hook is still the drawn ANC glyph); Wikimedia throttles GitHub runners on originals: fetch.py asks for a cached rendition width ("width" per entry), keep it.

## P2
- [ ] 21 Nov 2026 (owner: the optical centre reel "looks centered"): rebuild only if the illusion can be made obvious at phone size: two tall posters side by side, the same heavy title at the maths centre (left) and nudged up ~5% (right), "which one is centred?", then the measure reveals the left one is exact; test the stills on 3 people first. Otherwise drop the topic. Size M.
- [ ] @techin20sec topic shortlist from primary sources each morning on GitHub (roadmap 4): 3 candidates with sources and a viewer-stake hook.
- [ ] One daily routine per channel that writes the script, renders stills to a private review page and stops (roadmap 3).

## P3
- [ ] Future channel (owner, 13 Nov 2026; reference R-puzzle in design/references.md): a visual-puzzle channel ("find the odd one": the circle spinning in reverse, the shape a shade off, the dot out of phase), procedural and voice-free, built to loop and pull comments/saves. Before starting: a name and handle, a puzzle generator kit, 10 puzzle types, difficulty ramp, and when to reveal the answer; needs a new Instagram account from the owner. Pick up when the three current channels are stable.
- [ ] Posting through Instagram's content publishing API (roadmap 6; needs Meta's review, owner's call).

## Done
- 24 Nov 2026 (spare night): feedback 7 and 8 answered, two answered previews removed, weekly research pass written (design/references.md "R-trend 24 Nov": ranking signals unchanged; next test: a closing line made to be sent to one person, read against sends per reach). Topics, rulebooks and tooling not touched tonight: no new numbers to act on, and the P1 items need the owner or a long build.
- 15 Nov 2026: the reel journey in the app and the mobile-app layout (owner, Owner chat 15 Nov; Feedback 2 of 14 Nov): bottom tab bar
  Journey | Reels | Growth | Inbox, a side menu with Claude's Feedback replies one at a time (Mark read / Next), and the Journey section
  (seven stages per reel, live render step from GitHub through GH_READ_TOKEN, failed steps red with the reason). design/runbook-reels.md "The app".
- 13 Nov 2026: Output QA SYNC (scripts/qa/output-qa.py): OCR of the final frames (subtitle band ignored, it always shows the spoken word)
  fails when an item the voice names ("qa": {"sync"}, tech topics default to their cards) is not readable within 1.0 s of being said; EDGES
  also fails very large type (glyphs over 8% of the frame tall, in a row, read by tesseract) touching the outer 3% for 0.3 s+. Small chips
  (Turns Out guess options, ~22 px) do not OCR reliably: no sync list on them.
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
- 14 Nov 2026 (tech, anc-budget remake): DONE the same day: tesseract run in the session on the stills showed why SYNC missed "bus": the sign's gold outline read as underscores ("__Bus", confidence 12-21) and a bus pole crossed the chip's last letter ("oninabu"); the outline and the back poles are gone and every cabin name reads at 93-96. Lesson: a label for a named item needs clean space round it (no outline hugging the word, nothing crossing it); test with scripts/qa ocr() locally (apt-get install tesseract-ocr works in sessions).
- 18 Nov 2026 (web): a frame-0 loop for details reels (the recap's last 0.4 s returns to the hook frame: design/improvements.md "Seamless loop"); build it in starterdetails.html before the next details reel.

- (owner, 23 Nov 2026) NEXT ROUND: AI-generated photo imagery for web/Turns Out/tech (the reference reel's quality gap). Parked by the owner; bring back with a side-by-side preview plan and cost.
- (owner, 26 Nov 2026, Turns Out text overlap) Tooling: a QA check on the final MP4 that finds overlaps between chips, tags, rings and text lines and the subtitle pill's bottom edge (OCR boxes plus the scene's element boxes per 0.25 s), and a chip-band rule in core.js (DT.chip currently forces y 374 for any y in 380-420, which lands chips on a board top edge at y 396). Not built; needs the owner chat's go.
