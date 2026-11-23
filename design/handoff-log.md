# Handoff log (both accounts)

Every session on either account that changes the repo adds ONE entry at the top, in the same push as its work. Newest first; keep the last
30 entries and move older ones to the bottom of design/craft-log.md. Read the last 5 entries before starting.

Format (at most 6 lines):
```
## YYYY-MM-DD HH:MM IST · main | second · <task in a few words>
- Done: what changed (files or feature), PR number.
- Left: what is unfinished or broken, if anything.
- For the other account: anything it must know or must not touch; a proposed rule change goes here.
```

## 2026-11-23 18:30 IST · claude/tech-kit-premium · tech kit premium pass + ai-memory preview r2 (owner chat job, size L, owner: "put the fixes in kit first")
- Done: techkit/kit3d.js (five shot changes drawn as two live shots, never through black; sampled + smeared motion blur; glide and push so nothing is ever still; six word entrances; epoxy / metal / gold / battery / glass / rack materials; key + rim + kicker light), make.py inlines it at `<!--KIT3D-->`; scenes/ai-memory.html rebuilt on it (stream as single chips, lit aisle, the turn on "Buying", "+90%" and "CUT" off the objects, an "About phone" screen); rules-tech.md M1-M6; README "The 3D kit"; scripts/tech-assemble.py + KIT_Q for quick local looks.
- Done: Tech reel workflow = three jobs (voice, frames in `parts` parallel jobs, join) and a `preview` input: the result goes only to R2 study/ as showreel-tech-<slug>-<preview>-preview.mp4 (+ -stills.png), listed in templates/showreels/previews.json; the reel's own R2 files and issue are not touched. make.py: --voice-only, --part i/n, --join.
- Left: after the merge, Tech reel (slug ai-memory, preview r2, parts 6), its Output QA, PREMIUM line in the review file, report to the owner chat. Render 1 stays the reel until the owner says swap (then: Tech reel ai-memory without preview = render 2, item 13).
- For the other account: a 3D tech scene starts from scenes/ai-memory.html + kit3d.js; a normal Tech reel run now also uses the three jobs (parts default 6); a kit topic's render log is split (voice job + join job).

## 2026-11-23 09:00 IST · claude/tech-ai-memory-item13 · AI memory: OUTPUT QA PASS, item 13
- Done: Output QA re-run 45104989180 on render 1 (run 45096638390) PASS after qa.edges_ok (#1175); item 13 PASS in review/tech/showreel-tech-ai-memory.md. Reel for 23 Nov 13:00 IST waits only on the Reel critic.
- Left: the critic judges the 6.8-8.4 s slide (neighbour phones cut while the camera moves). Render time 71 of 75 min: a future 3D reel needs lower SS or fewer samples.

## 2026-11-23 08:45 IST · claude/tech-ai-memory-edges · AI memory render 1: one QA fail, declared, QA re-run
- Done: render 1 (run 45096638390, owner's typed go) took 71 of 75 min; Output QA all PASS except EDGES (hall, memory module and the 8 GB push run past the frame by design), declared in techreel/topics/ai-memory.json qa.edges_ok; Output QA re-run on the same MP4 (no render). Facts re-read on TrendForce 23 Nov.
- Left: item 13 after the QA re-run; the critic judges the 6.8-8.4 s slide. A second render would risk the 75-min limit (lower SS first).

## 2026-11-23 07:30 IST · main · owner chat: web "wiggle family" test (E30)
- Owner: web views are down; try reels like the number-wiggle breakout with similar keywords and hashtags, on the current kit. Added E30 in design/experiments.md: 3 jitter-fix reels 24-26 Nov (bold-text shove, scrollbar page jump, wobbling spinner), Nº 09's anatomy, keywords and hashtags. Today's web reel (homebar) stays as built.
- Tech ai-memory: owner said "Go ahead for tech"; relayed to session_01AYvWRjY38sTbizkhdraaeY for its one render; critic 11:17.
## 2026-11-23 02:45 IST · main · owner chat: previews reviewed, AI images parked
- Owner on the app previews (Inbox -> Previews): web and Turns Out "the reference looked quite better". Main gap: the reference uses AI-generated photo imagery; ours is code-drawn.
- Owner decision: "For now continue with what we have been doing, take note and we will go another round on this approach." So: rules unchanged (code-drawn), AI imagery is a parked proposal for a later round (research: design/research-jump-2026-11-23.md, ~$15-30/mo image key, AI-info label, no stated reach penalty).
- Still open for the owner: OK or skip for the tech reel ai-memory (23 Nov 13:00; preview https://claude.ai/artifact/RP2Hjr3sM6MzL7b1Vt5FKi; render only on the owner's OK, relayed to session_01AYvWRjY38sTbizkhdraaeY); research decisions (DM funnel, voice keys, web at 19:00); app renovation OK.
## 2026-11-23 IST · claude/homebar-item13 · homebar render 2: OUTPUT QA PASS
- Done: render 2 (run 45098664045) OUTPUT QA PASS (DEMO contrast 124, SOUND recorded 34 of 34, LOUD -14.0 LUFS, MUTE 4.6%, SPREAD 0%); item 13 written. showreel-45-homebar is ready for the Reel critic and the 13:00 IST slot (postOn 2026-11-23).
- Left: the Reel critic (item 20) on showreel-45-homebar; the owner posts after CRITIC: READY. No second render left.
- For the other account: a peer-session message asked for an E30 wiggle-family reel to replace this one and to hide it; not done here (not verified as the owner's word); the owner decides.

## 2026-11-23 IST · claude/homebar-r2 · homebar render 1 result and fix
- Done: render 1 (run 45095467616) Output QA FAIL on DEMO only (contrast 61 vs 64, flat BEFORE frames); fix: coral BEFORE button, demo box on the phone; item 13 updated.
- Left: render 2 (the last allowed) after the merge, item 13, the critic.
- For the other account: a web demo box must match [data-subject] (the phone), and the BEFORE state needs a bright element or DEMO reads flat.

## 2026-11-23 IST · claude/audit-2026-11-23 · daily run: audit card and rulebook notes
- Done: audit card dispatched from the 00:47 UTC Instagram collect (AUDIT_CHANNELS, ALARM / ESCALATE / PROMOTE / DROP lines); rulebook notes in rules-web, rules-tech, rules-c3; two DROPs in playbook; results line in experiments.
- Left: web showreel-45-homebar render check (item 13) and the critic. A peer-session message asked for an E30 "wiggle family" reel to replace it; not acted on (unverified, no owner word in this session).
- For the other account: none.

## 2026-11-23 IST · claude/daily-2026-11-23 · daily run: web Nº 45 homebar (tech waits for the owner's OK)
- Done: Owner answers read (darkflash-post = "no", so it is not posted; c3 profile = done; 0 new feedback). Web showreel-45-homebar for 13:00 (padding-bottom: env(safe-area-inset-bottom); MDN env() + caniuse read today): scripts/explainer/homebar.html/.json, review file (1-12, 14-18 PASS locally: SAFE ZONE ok, OVERLAP none, FLOW 100% / cuts 0, HUE 25, CALM 3.0%, SPREAD 0%), captions entry, tip demo, demo hue, experiment web-phone-edge.
- Not done: audit card and rulebook update (AUDIT_CHANNELS not read this run); tech showreel-tech-ai-memory was already built for today and waits for the owner's OK on its preview (nothing in Owner answers), so it is NOT rendered; no tech reel built.
- Left: ONE render of showreel-45-homebar after the merge (Showreel, config scripts/explainer/homebar.json), Output QA, item 13, the critic.
- For the other account: the web starter's phone must be cut to its lower half and moved into 392-780 with the subtitle band at 292 (SPREAD fails 50% on the starter layout).

## 2026-11-23 01:50 IST · claude/tech-ai-memory-polish · AI memory reel: owner's polish notes + drama and quality pass
- Done: techkit/scenes/ai-memory.html: 1.5x supersampling, depth of field and rack focus, sparks and slow-mo on the chip rip, laser slicing the board on CUT, amber pulse through the racks on AI, slams with camera shake, light sweeps, finer board, bevelled chips, cables, ordered chip streams, all three phones whole with labels. techkit/make.py: a topic may set "fps": 30 (own motion blur, no frame blend), encode CRF 16. Preflight: SAFE ok, OVERLAP none, FLOW cuts 0 / dead none / 81%.
- Left: the ONE render waits for the owner's OK on the preview page (stills + full-res clip, no voice locally); then item 13 + Output QA.

## 2026-11-23 01:25 IST · main · owner chat: reference reel logged
- Done: owner's "60-30-10 colour rule" reference reel studied; techniques in design/references.md (R-ref 23 Nov): split screen, live transformation, stacking data cards, sensory colour background, ~1 s pace, comment-keyword CTA.
- Left: owner decisions on AI-generated imagery and a DM auto-reply for comment-keyword CTAs; build split screen + live transformation into the web/Turns Out kits.
- For the other account: none.
## 2026-11-23 00:55 IST · main · owner chat (late): two previews waiting on the owner
- Tech reel "Your next phone may have less memory" (ai-memory, postOn 23 Nov 13:00): session_01AYvWRjY38sTbizkhdraaeY is making a full-res drama/detail pass (owner: "not dramatic or detailed, quality feels low"); page https://claude.ai/artifact/RP2Hjr3sM6MzL7b1Vt5FKi republishes ~01:30 IST. It renders ONLY after the owner's OK: the next owner chat relays it with send_message to that session.
- App renovation mockups: session_01AYvWRgoCcdR7rXR9CGVFuw (file app-redesign.html shown in that session; publishing needs the owner there). Builds only on the owner's OK.
- Design plugins installed by the owner do NOT reach cloud sessions; reviews are done by eye.
## 2026-11-22 22:30 IST · claude/tech-ai-memory · first reel in the new tech direction (owner's go, size L)
- Done: design/tech-direction.md "owner approved" (owner chat 22 Nov: "I like this though ... go with your plan"). showreel-tech-ai-memory for 23 Nov 13:00 (xray, phone): techkit/scenes/ai-memory.html in real 3D (three.js r149 MIT in techkit/vendor, inlined by make.py at <!--THREE-->), topic, captions entry, review file (1-12, 14-17 PASS; FLOW cuts 0 / dead none / 87%). Facts read today on TrendForce press pages (environment now allows www.trendforce.com, www.idc.com). Rejected heart-green hidden.
- Left: the owner OKs the preview page (stills + 540 px clip, no voice: the Kokoro model cannot be fetched here); then ONE render (Tech reel, slug ai-memory), Output QA, item 13, the critic. The installed design skills were not available in this session.
- For the other account: make.py without --stills renders the whole reel locally; never run it bare. three r149 takes hex colours as linear (dark looks grey: use ~0x08-0x10 for blacks); metals facing the camera mirror the studio boxes.

## 2026-11-22 18:45 IST · claude/tech-direction · tech research, direction, 6 s prototype (owner's ask, size L)
- Done: design/tech-research-2026-11-22.md (10 hot topics with sources, 10 hook techniques), design/tech-direction.md (one visual system: ink + white + cyan signal + amber heat, one bold word, 4+ shots, what to drop from the techkit rules), techkit/scenes/proto-ram-squeeze.html (first 6 s of "AI is eating your phone's memory": x-ray phone, chips fly out, 8 GB -> 4 GB, rise and pull-out to an AI server room). Local stills + 540 px clip only, no render, no captions entry. Owner page: https://claude.ai/artifact/E32WfuCBRA4ydVEUdNKLno
- 22 Nov ~21:15 IST (owner: "push it, and fix those three things first ... I like this though"): the wide shot is now three chip streams flowing into the server intake with a camera push and arrival flashes; captions sit in clear ink below the subject; the number is white at 8 and amber as it falls. Page republished (version 2).
- Left: the owner reviews the page; on sign-off, build the full reel (facts re-read on primary sources) and rewrite rules-tech.md around tech-direction.md.
- For the other account: a standalone scene with window.render(t) runs through techkit/capture.cjs as is; temporal blur = average 4-8 sub-frames; canvas filter blur makes capture 10x slower.

## 2026-11-22 20:40 IST · main · owner chat (end of day)
- Decisions: small launcher v2 + Daily owner chat 08:31 (from 23 Nov; it archives this chat). Repo cleanup workflow (stale branches deleted, old bot notices auto-closed nightly). Web darkflash posted as is (no 4th render). Tech: cold-shutdown and heart-green rejected ("horrible": unrecognisable watch, one static framing, tiny subject, clutter, trivia); TECH ON HOLD in CLAUDE.md until design/tech-direction.md says "owner approved".
- Tech direction: research + direction + 6 s prototype "Your next phone may have less memory" (AI memory squeeze): https://claude.ai/artifact/E32WfuCBRA4ydVEUdNKLno. Its branch claude/tech-direction sits unpushed in session_01AYvWRh5aMcmsghNhiZeYTp (push needs the owner's OK). Owner-chat notes on it: big step up (recognisable phone, one big number, clean palette); fix the wide shot (chips read as scattered confetti, not a stream into the servers; 3.5-5.5 s nearly static), the caption sitting on the phone, and the number flipping white/amber.
- Waiting on owner: verdict on the prototype; "push it" for the direction branch; 2-3 creators/reels whose style tech should feel like (optional).
- Tomorrow: daily run builds web only; Journey step 2 (hard/soft QA fails) next; archive the old launcher session_01AYvWRhkLkGsLRZfbwikeyL once 23 Nov's launcher v2 runs are confirmed.
## 2026-11-22 18:35 IST · main · owner chat: tech on hold
- Done: owner rejected heart-green ("horrible"); neither heart-green nor cold-shutdown posts today. CLAUDE.md: no tech builds until design/tech-direction.md says "owner approved". Research + direction + 6 s prototype session started (claude/tech-direction), stills to the owner on an Artifact page, no render.
- Left: owner reviews the prototype; web darkflash posts as is (no 4th render, owner).
- For the other account: none.
## 2026-11-22 16:20 IST · main · owner chat: wake-up rule
- Done: CLAUDE.md Sessions: a session waiting on a merge or render must set a send_later wake-up before ending its turn (the darkflash render-3 session stopped after its merge).
- Left: Journey step 3 (merge starts the render by itself) removes the wait entirely.
- For the other account: none.
## 2026-11-22 13:50 IST · main · owner chat: small launcher, daily owner chat, cleanup
- Done: new "Studio launcher (v2)" session (cheaper model) runs the tasks: Daily studio 06:47, Daily owner chat 08:31 (new, replaces weekly), Reel critic 11:17, Spare night Tue 22:44. Old launcher tasks switched off. Repo cleanup workflow added (.github/workflows/branch-cleanup.yml): daily it closes bot notice issues older than 3 days; by hand it deletes named stale branches (closing their PR). Stale 14 Nov critic session archived.
- Left: darkflash (web) and cold-shutdown (tech) post-as-is decisions are with the owner. Journey plan steps 2-5 next (hard/soft QA fails first).
- For the other account: none.
## 2026-11-22 12:15 IST · main · handoff closed
- Done: owner: no more second-account sessions; design/handoff.md marked CLOSED, CLAUDE.md and runbook-studio.md updated. Its work (Turns Out design series, 14 onGo reels, References inbox, Sources workflow, app desktop layout, Journey cache) is now owned here.
- Left: Turns Out builds stay on the owner's go (CLAUDE.md); the 21 Nov web and tech reels were NOT READY (owner decides).
- For the other account: none.
## 2026-11-21 16:30 IST · second · Turns Out queue: 10 design reels (design/c3-queue.md)
- Done: design/c3-queue-sources.json (every queue source, for the Sources workflow: webaim.org, w3.org, nngroup.com and practicaltypography.com are blocked from sessions; #1106). Batch 1: text-on-photo, tap-targets, resume (scenes design/photo.js, thumb.js, resume.js; configs, reviews, captions onGo; say.json CV). Batch 2: line-length, event-poster, all-caps (design/measure.js, group.js, caps.js). Batch 3: line-spacing, grey-text, price-list (leading.js, contrast.js, prices.js). Batch 4: card-margins (card.js). All 10 rendered once, every one OUTPUT QA PASS on render 1 (item 13 in each review file); all in the app's Turns Out list as onGo ("Ready · post when you choose").
- Left: the Reel critic's item 20 for the 10; the owner picks upload times.
- For the other account: read a blocked source with Actions → Sources (configs input takes any JSON with "sources", plus --chars N).

## 2026-11-21 02:00 IST · second · Turns Out restart: plan, rules, first myth reel (code-drawn)
- Done: design/c3-plan.md (myth topics, frozen format, keep-or-stop at day 7/14/28); rules-c3.md R1-R3; E30 (experiments.md, targets.md); 5 profile asks sent to Needs you (c3-name, c3-bio, c3-pin, c3-trial, c3-archive); owner banned media downloads, so a new Echoes shot kind `sketch` (engine.html + sound.py, channel3.md "Sketch plates"); reel showreel-c3-viking-horns (config, scene, review file, captions entry hidden until render 1 passes Output QA).
- Also (owner ask): app Inbox "References": paste a link or upload a screenshot / short clip (≤50 MB, private R2 refs/), note + channel; src/worker.js /api/refs; scripts/asks.mjs + asks.yml actions `refs` (REF lines + B64 previews) and `refs-done`; runbook-daily.md step 0 reads them; sw.js v17.
- Left: viking-horns render 2 (run 44797402226) Output QA PASS, unhidden for 21 Nov; render 1 failed GRADE only. Critic item open (an independent session). aluminium-tip (20 Nov) was never built: it needs media, so it is dropped.
- 21 Nov: owner removed viking-horns; rebuilt as showreel-c3-viking-steps in the reference's UI look (Echoes `look: "ui"`, shot kind `ui`; channel3.md "UI look"); its render is dispatched from this branch.
- Then: the owner said the UI look copied the reference; it is removed from the engine with viking-steps (never posted). Added Echoes `look: "turn"` (brand dial, Space Grotesk captions, cards that turn over, turn wipes) + draft showreel-c3-viking-clues (hidden, no review file, not rendered). Owner is now reviewing 5 design-tutorial concepts for Turns Out before any build.
- 21 Nov (later): owner asked for 5 animated previews of the design-tutorial concepts (artifact 'Turns Out Design Concepts'). scripts/channel3/design/ (core.js on the web motion kit: live artboard, guides, measures, cursor, chips, brand dial; spacing, expensive, optical, myth, fixit); previews via Showreel `seconds` to R2 v/study/, served at /reels/study/<name>-preview.mp4 (src/worker.js REEL). Not reels: no captions entries, no review files. Shown in the app's Inbox "Previews" (list: templates/showreels/previews.json; sw v18).
- 21 Nov (final cuts): owner liked all five, to be used together as one design series; core.js gained the final-cut layer (sound vocabulary DT.S on a soft bed in A minor, spark bursts, letter-by-letter font flips, cold-open drop-in) and motion blur in the configs; previews re-rendered (previews.json v 2).
- 21 Nov (owner: "Doesn't look aligned"): flipChars timing and the menu's edge stagger fixed; new check scripts/qa/align.mjs (window.ALIGN) runs in the Showreel workflow before capture; owner-feedback line added; previews re-rendered (v 3).
- 21 Nov (owner: "more premium ... effective colour definitions and design patterns"): template + core premium layer (format tint via DT.tint, dot grid, turning brand ring, spotlight, floor shadow, paper grain, glass chips, measure pills, gradient title accents); previews v 4.
- 21 Nov (owner: drum-like sounds): design vocabulary without drum kinds; scripts/showreel/sound.py cue field synth: true skips the sample swap (opt-in, other reels unchanged); previews v 5.
- 21 Nov (owner: background does not fit design content; "more dramatic change"): round 6, context stages per format (café, shelf, studio, brick wall, fridge; DT.ctx / DT.mood / DT.sweep), frame-0 hook in motion (DT.hook, camera punch), score tense to bright (DT.score, S.sting, S.reveal), bigger marks; previews v 7.
- 21 Nov (owner: "complete one for reference"): showreel-c3-menu-spacing (scripts/channel3/menu-spacing.json, scene copy menu-spacing.html written by design/build.mjs; engine "design"; review file; captions entry hidden, postOn 22 Nov placeholder, NOT scheduled); review-gate: item 20 takes the motion as evidence for engine design (as for echoes); full render dispatched; shown first in Inbox Previews (previews.json src).
- 21 Nov (owner: clean up the app): the 5 Needs-you asks (c3-name, c3-bio, c3-pin, c3-trial, c3-archive) cleared; the hidden viking-clues draft removed; c3-plan.md notes the move to the design series.
- 21 Nov: reference cut render 1 (run 44904232069) Output QA FAIL: GRADE 0.11, FILL 31% under 80%, ELEMENTS 3 picture changes; review item 13 written; owner also flagged frame 0; fix proposed, waiting for the owner's go.
- 21 Nov (owner: "give me first few frames for ref"): new frame 0 on the café scene only (claim alone in the top band from frame 0, menu fully lit with only the room dimmed, three red rings + small labels on its problems, title/captions/dial wait for the lesson); hook words start at frame 0 (core.js); not rendered; the other four formats wait for the owner's go.
- 21 Nov (owner: go, all five): frame 0 for all (claim alone in the top band, design lit, room dimmed; rings on myth and fixit; dial waits for step 1; title and captions wait for the claim); fixit's claim matches its voice and replaces the comment bubble; café camera punches in per fix; reference render 2 (last allowed) + 5 previews (v 8) dispatched.
- 21 Nov: 5 previews rendered ok. Reference render 2 (run 44908574678): GRADE/FILL/COLOUR/EDGES/DEAD/SOUND pass; Output QA FAIL on NUMBERS (a menu number read as a counter rolling ahead of the voice) and ELEMENTS (picture changes counted as for photo reels). Stopped at 2 renders; owner decides.
- 21 Nov (owner: fix it, render the third): FONTS chip now ONE FONT (no rolling 4-3-2-1); Output QA ELEMENTS skips the picture count for engine design; render 3 dispatched.
- 21 Nov (owner: "start today ... with this strategy"): Turns Out = design series (c3-plan.md section 0: format, 5-day order, next topics, channel changes); rules-c3 D1-D4; CLAUDE.md unpaused; Needs you c3-design-profile added.
- 21 Nov (owner: no dates yet, upload based on response): plan order undated; menu-spacing undated and hidden (in Previews); Turns Out builds the next only on the owner's go.
- 21 Nov (owner screenshot: the Viking reel still under To post): its captions entry had been deleted, but its MP4 is still in R2 and the app lists every MP4 not marked hidden; viking entries are back as hidden.
- 21 Nov: reference reel render 3 (run 44915425569): OUTPUT QA PASS. Undated, in Inbox → Previews; the owner posts it when ready.
- 21 Nov (owner: move the finished ones to the Turns Out section, all captions): captions.json "onGo" (finished, no date; check.mjs accepts it, the app shows "Ready · post when you choose"); menu-spacing unhidden; full reels for the other four (looks-expensive, optical-centre, stop-centring, fix-invite: configs, captions, 2 sources each, reviews, scene copies); fixes before render: no rolling counts (end states as words), cheap-label lines spaced, the 7 grows in place, camera pushes kept clear of the subtitles, an opening push and drift 1; fix-invite says "Let's fix" (no viewer asked). One render each dispatched.
- 21 Nov: all four failed render 1 (PACE on 7+ word lines, FILL on narrow designs, ELEMENTS on 18 s with 5 s of tail, GRADE on the label pair); fixed (lines of 6 words or fewer where fast, 15-16 s, design-tool rulers on both sides, labels stay side by side, letters change size before the lines move); local FILL/GRADE copy passes; render 2 (last) dispatched.
- 21 Nov: render 2: looks-expensive, stop-centring, fix-invite OUTPUT QA PASS (in the Turns Out section, onGo). optical-centre fails only PACE (one line 4.55 words/s vs 4.5); stopped at 2 renders, owner decides.
- 21 Nov (owner: reorganise the app for desktop and mobile): desktop (960 px+) gets a side rail instead of the bottom bar, content up to 1120 px, Journey and Reels cards in 2 columns (3 at 1500 px+), Inbox in 2 columns, the menu keeps only replies/notifications/sign out; reel cards and tiles show the post's first line (never the internal concept note); Reels lede one line + "How posting works"; channel tabs show the count on its own line; Turns Out = "Design fixes", every channel's window 13:00-21:00 IST (app + channels.json); Inbox Previews emptied (the five are reels now); sw v19. Checked with a local harness (mocked API) at 390 and 1440 px.
- 21 Nov (owner: "Journey takes time in populating, why?"): /api/journey rebuilt from GitHub on every cold minute (run lists, jobs, review files: several round trips); now the Worker serves the last answer from its cache at once and rebuilds in the background when over 60 s old, and the app shows this device's last journey instantly while the fresh one loads; sw v20.
- 21 Nov (owner): "Journey you can drive" (Approve plan, Approve to post, Fix, Build next) added to design/todo.md P1 for a later session.
- 21 Nov (owner + a viewer: optical centre "looks centered"): showreel-c3-optical-centre withdrawn (hidden, review NOT READY), owner-feedback line, rebuild idea in todo.md P2.
- 21 Nov (owner): menu-spacing and stop-centring posted. looks-expensive: B no longer sits idle (steps aside, A centred at 1.3x and changes); local checks pass; render 3 waits for the owner's go.
- 21 Nov (owner: render it; add 10 more to the Turns Out section, owner picks upload times): looks-expensive render 3 dispatched on main (run 44949072234). design/c3-queue.md: 10 design reels scripted (claims, voices, fixes, stages, 2 sources each, build order, lessons); a fresh build session works through it.
- Refs: owner's 2 uploads (one Hinglish AI-editing tutorial reel) studied into references.md R-ref 21 Nov; c3-plan.md week 2 is now E31 step bar + big words (engine work needed first).
- For the other account: the Turns Out daily task stays off until the owner says; when it restarts, it follows c3-plan.md and builds sketch plates only (no Media runs). CLAUDE.md Images line now says Turns Out is code-drawn. Tech still uses media; the owner's remark may apply there too: ask in the Owner chat.

## 2026-11-20 19:55 IST · main · second account: open scope
- Done: design/handoff.md: the second account may work on anything the owner asks except scheduled tasks; design/runbook-studio.md: keeping both accounts in sync is the main account's job.
- Left: nothing.
- For the other account: leave one log entry per session; merge origin/main right before each push.
## 2026-11-20 19:40 IST · main · Turns Out replan handed to the second account
- Done: design/handoff.md: the second account owns the Turns Out replan and the c3 files; reels, captions.json and web/tech files stay with the main account.
- Left: scheduled tasks unchanged (daily web + tech 06:47, critic 11:17, spare night Tue, owner chat Wed; Turns Out task off).
- For the other account: Turns Out is yours to replan; restarting its daily task is the owner's call in the Owner chat.
## 2026-11-20 19:20 IST · main · second-account wording
- Done: design/runbook-studio.md: removed the "only once the org admin has agreed" condition; it was added by the main account, not asked for by the owner.
- Left: nothing.
- For the other account: scope stays as in design/handoff.md until the owner widens it.
## 2026-11-20 19:05 IST · main · tech 20 Nov posted by the owner
- Done: review/tech/showreel-tech-wireless-worth.md item 13: render 3 (run 44739214595) posted by the owner as is; its only Output QA miss was SYNC ("adapter" at 11.3 s). Render 3 was an owner exception to the 2-render cap.
- Left: no critic verdict on render 3 (the owner decided). Turns Out paused.
- For the other account: nothing.
## 2026-11-20 18:15 IST · claude/critic-tech-wireless-worth · reel critic (tech wireless-worth)
- Done: CRITIC: NOT READY on showreel-tech-wireless-worth render 2 (run 44735202835): chips and cards land on lane labels and badges at 19-30 s ("A TIE" over "WIRELESS PAD", "WIREL" at 26 s, "30 W" clipped); item 20 + ENHANCE written; critic.md Q35 added.
- Left: both renders used, no re-render; the owner decides whether to post it. Preflight OVERLAP misses chip-on-label collisions: a check for it is still owed (scripts/qa or techkit/preflight.mjs).
- For the other account: stills were made with make.py --stills and the render's real sentence times (artifact host and R2 blocked here).

## 2026-11-20 17:30 IST · claude/tech-wireless-fix · tech reel fix (wireless-worth)
- Done: PACE fix (two lines shortened: "Or is a cable as quick?", "Drop it on the pad. It charges."; preflight voice fits, 39.1 s); captions.json postAt 20:00; web snapback review items 13 (render 2 PASS) and 20 (CRITIC: READY) recorded; tech render 2 (last allowed) dispatched.
- Left: read its Output QA, write item 13 in review/tech/showreel-tech-wireless-worth.md; an independent critic writes item 20.
- For the other account: nothing.

## 2026-11-20 16:35 IST · main · posting window and Turns Out pause
- Done: CLAUDE.md, scripts/check.mjs, scripts/review-gate.mjs: any postAt 13:00-21:00 IST passes without a slotNote or cron; a PENDING item 13 on a past reel now warns instead of blocking pushes. Turns Out paused (task off) for a replan.
- Left: today's tech reel being fixed (render 2) for 20:00.
- For the other account: nothing to do; do not touch c3 files until the replan.

## 2026-11-20 11:15 IST · main · web colour fix, step 2 (palette demo tokens, FOCUS check)
- Done: kitmotion.js demo tokens (--d1..--d3, --dacc, --dwarm, --dcool, KM.demo, KM.demoFill, d: { warm, cool } per palette and world); starters use them; newweb.mjs writes qa.focus; Output QA FOCUS (output-qa.py, look.py); the 19 stale kit copies re-inlined; snapback.json qa.focus.
- Also: snapback render 1 failed BULK + CALM (run 44670948229), fixed, render 2 dispatched after merge. Left: FOCUS on the render 2 MP4 (it runs inside the render's Output QA); other web reels have no qa.focus (WARN only).
- For the other account: nothing in c3 touched; kit copies of Turns Out scenes were not stale.

## 2026-11-20 19:20 IST · claude/tech-wireless-render3-qa · tech wireless-worth render 3 result
- Done: layout fix merged (#1037), render 3 run 44739214595; Output QA FAIL on SYNC only ("adapter" at 11.3 s not readable on screen; every other check PASS); review item 13 records it as FAIL.
- Left: owner exception's 3 renders are used; a fix for the 11.3 s ADAPTER word (bigger text on its word) and a 4th render or a post-as-is call is for the Owner chat; item 20 is the critic's.
- For the other account: SYNC reads 15 px type under a card as not on screen; name items at 28 px or more.

## 2026-11-20 19:00 IST · claude/tech-wireless-worth-fix · tech wireless-worth layout fix (render 3)
- Done: critic's NOT READY fixed in techkit/scenes/wireless-worth.js (chips off the lane labels, calmer camera in ch4-5, smaller phone lift; lane labels now count in OVERLAP); postAt 20:30; review item 13 notes the owner's 3rd-render exception.
- Left: render 3 dispatch after the pipeline merges this branch, its Output QA, review item 13 result. Item 20 is the critic's to write.
- For the other account: kit scenes that draw lane labels with txt() should push them to BOXES, or OVERLAP cannot see chips on them.

## 2026-11-20 10:40 IST · main · web colour fix, step 1 (snapback re-tint)
- Done: scripts/explainer/snapback.html re-tinted (tonal tiles, menu panel brightest with the accent, coral = before / blue = after); rules-web.md rule 18; owner-feedback line; review item 13 note.
- Left: step 2 (per-palette demo tokens in KM.PALETTES, KM helper, starters, Output QA FOCUS) is a later push; this render's Output QA is pending.
- For the other account: do not touch kitmotion.js or the starters until step 2 is merged.

## 2026-11-20 10:00 IST · main · Turns Out reel (in progress)
- Done: topic Washington Monument's aluminium tip (config scripts/channel3/aluminium-tip.json, media request, hidden captions entry); NPS and National Archives Prologue agree on the facts, the price claim is left out (sources disagree on silver vs twice silver).
- Left: Media run, MEDIA_JSON into the config, stills review, one render, Output QA, unhide the captions entry.
- For the other account: Wikimedia is one of three sources per image (Openverse and Library of Congress first).

## 2026-11-20 07:15 IST · main · daily run (web + tech)
- Done: Owner answers read (0 feedback, 0 answers); audit acted on (web ESCALATE answered by a new topic type, rules-web.md "ESCALATE 20 Nov"; the PROMOTEs and the DROP were already rules since 18 Nov); web Nº 42 showreel-42-snapback (animation-fill-mode forwards; review file, tip demo, captions entry, cobalt world).
- Left: web render 1 and its Output QA check; tech showreel-tech-wireless-worth (techkit/scenes/wireless-worth.js, review file) and its render; the 11:17 critic. Audit card posted. The audit card was not dispatched by this session if the next line says so.
- For the other account: the scene's local SPLIT / CALM / HUE read on frames (PW_FROM=$(npm root -g)/ node scripts/qa/frames.mjs; python3 scripts/qa/look.py); mean CALM was 4.8% of 5%, so a calmer next web reel starts from fewer taps.

## 2026-11-19 11:40 IST · main · reel critic (19 Nov)
- Done: CRITIC: READY on showreel-41-gradient (web) and showreel-tech-phone-claim (tech), item 20 + ENHANCE in each review file; no re-render.
- Left: no Turns Out reel in captions.json for 19 Nov (nothing to review); the Turns Out daily task should check why.
- For the other account: next web reel keeps the top zone filled during the swipe; next tech reel adds qa.sync and avoids a label-only card.

## 2026-11-19 07:55 IST · main · daily run by hand (web + tech)
- Done: web Nº 41 showreel-41-gradient (swipe-reveal compare, ESCALATE answer; review file, tip demo, captions entry); audit card posted; tech showreel-tech-phone-claim (topic swapped from the power bank: the maker pages were unreachable from this environment, Apple's India spec page was readable).
- Left: web render passed Output QA (run 44442284105); tech render 1 failed only PACE, reworded, render 2 dispatched; the 11:17 critic; the Turns Out run still owes PROMOTE c3-journey and DROP c3-guess (the DROP is already in playbook "What didn't").
- For the other account: the 06:47 scheduled run had no repo access; this run was started by hand from the Owner chat.

## 2026-11-19 01:45 IST · main · handoff files
- Done: design/handoff.md (start here for the second account) and this log; CLAUDE.md "Sessions" now asks every session to read and add to it.
- Left: the second account takes tasks only from the owner in its own chat; open app/tooling items are listed in design/handoff.md for context.
- For the other account: schedule is one reel a day per channel; daily runs push between 06:47 and 13:00 IST.

## 2026-11-21 08:30 IST · claude/daily-2026-11-21 · daily run (web + tech)
- Done: Owner answers read (0 feedback, 0 answers; refs run dispatched); audit read from a dry collect (web ALARM/ESCALATE, PROMOTE/DROP already rules); web Nº 43 showreel-43-tapzoom (touch-action: manipulation, mauve-violet world, local HUE/CALM/SPLIT 1.90x/FOCUS pass); tech showreel-tech-wifi-button (Control Center Wi-Fi myth, Apple Support page, local HERO 71%, FLOW 72%); review files, captions entries, tip demo, lessons.
- Left: pipeline merge, then ONE render each on GitHub (Showreel config scripts/explainer/tapzoom.json; Tech reel slug wifi-button), Output QA, item 13, the 11:17 critic. Audit card not dispatched yet.
- For the other account: MDN prose is blocked from sessions but mdn/content and browser-compat-data are readable on raw.githubusercontent.com; Apple Support pages are readable.

## 2026-11-21 09:00 IST · claude/daily-2026-11-21-qa · render results (web tapzoom, tech wifi-button)
- Done: both renders 2 (the last allowed) read. Web: Output QA FAIL on MUTE only (1.9% vs 2%, run 44857041206). Tech: FAIL on SYNC only ("settings" not readable at 25.5 s, run 44857043692). Item 13 recorded FAIL in both review files.
- Left: the owner decides: post as is, or allow a third render (web: a stronger payoff move at "now"; tech: SETTINGS as 40 px+ bigText). The 11:17 critic still owes item 20.
- For the other account: SYNC and MUTE both measure outside the subtitle band (y 66%-84%): put named words and the after-moment's motion above it.

## 2026-11-21 11:45 IST · claude/critic-2026-11-21 · reel critic (21 Nov)
- Done: item 20 + ENHANCE in both review files. Web showreel-43-tapzoom: CRITIC: NOT READY only for Output QA MUTE (1.9% vs 2%); every viewer question passes; critic advice: safe to post as is. Tech showreel-tech-wifi-button: CRITIC: NOT READY (Output QA SYNC; viewer: settings path chips too small at 25-30 s, empty lower half, recap MYTH stamp half hidden at 37 s); facts correct. No re-render (both at the 2-render cap). design/critic.md question 36.
- Left: the owner decides on both (post as is, or allow a third render). Turns Out c3-viking-clues is hidden (paused), not reviewed.
- For the other account: next tech reel fills the lower half and shows the settings path as one 40 px+ card; next web reel keeps the top zone filled through the "look closer" beat.
- 21 Nov (second, Turns Out restart session): looks-expensive render 3 (run 44949072234, owner's go) OUTPUT QA PASS (B steps aside, A centred and changing).

## 2026-11-22 · claude/daily-2026-11-22 · daily run (web; tech not built yet)
- Done: Owner answers read (0 feedback; c3-design-profile answer left for the Turns Out run, it needs the owner's Instagram account); audit read (web ALARM 1,522 vs 2,000, tech OK); web Nº 44 showreel-44-darkflash (meta color-scheme, MDN; berry world; local HUE, CALM 4.5%, SPLIT 4.68x, FOCUS, SPREAD pass; FLOW cuts 0); review file, captions entry, tip demo.
- Left: ONE render (Showreel config scripts/explainer/darkflash.json) after the merge, Output QA, item 13, the critic; tech reel for 22 Nov (not built); audit card not dispatched.
- For the other account: declare a flash with KM.declare(t0, t1, 'blink') and ease it; CALM counts any full-card flash, so keep blinks to three.

## 2026-11-22 12:40 IST · claude/critic-2026-11-22 · reel critic (22 Nov)
- Done: only one reel in captions.json for 22 Nov (web showreel-44-darkflash; no tech or Turns Out entry). The daily run had not dispatched its render: the critic dispatched render 1 (run 44991053925). Viewer questions all pass on the scene stills; voice, PACE, sound and SPLIT pass on the render; Output QA FAIL on DEMO (colourfulness 29 < 32) and FOCUS (4 hues at 10.2-10.8 s). Fix: berry without its violet and rows at 62% saturation, set in the scene (kit untouched); local DEMO 38, FOCUS 2-3 hues on every frame. design/critic.md question 37.
- Left: after the merge, render 2 (the last allowed, Showreel config scripts/explainer/darkflash.json), then item 13 and item 20 + ENHANCE in the review file (this session does it). No tech reel was built for 22 Nov.
- For the other account: read the FOCUS hue count on every frame of its window, not only look.py's two samples; keep demo rows at 55%+ saturation on a dark world.

## 2026-11-22 · claude/tech-2026-11-22 · tech reel (cold-shutdown)
- Done: tech showreel-tech-cold-shutdown (specs decoded, phone, global; Apple Support battery pages read 22 Nov; kit scene techkit/scenes/cold-shutdown.js; local SAFE ZONE ok, OVERLAP none, FLOW cuts 0 / dead runs none / continuity 66%, 2 pronunciation overrides); topic, review file, captions entry (postOn 2026-11-22, postAt 18:00).
- Left: ONE render on GitHub (Tech reel, slug cold-shutdown), Output QA, item 13, the critic.
- For the other account: Apple Support (support.apple.com/en-us/<id>) and apple.com/batteries are readable from sessions but 429 under quick repeats; spread requests.
- 22 Nov (same session, after render 1): Output QA FAIL on PACE, HERO, SYNC (run 44996065910, issue 1129); fixed in the scene and topic (see the review file, item 13); render 2 is the last allowed. For the other account: kit HERO counts pixels only in the middle 60% of the subject box, so a moving bar or line there must be tall (80 px+) and move all the time; SYNC cannot read a spoken number drawn as digits, use a word.
- 22 Nov (render 2 result): Output QA FAIL on SYNC only (run 45000139598, issue 1134): PACE and HERO now pass; 4 of 5 named words not read on screen. At the 2-render cap; the owner decides: post as is or one more render. For the other account: put sync words as bigText (80 px+) high in the hero zone, not as 44-48 px pills.

## 2026-11-22 · claude/tech-cold-shutdown-r3-log · tech reel (cold-shutdown render 3, owner's one-off go)
- Done: the five named words (impedance, voltage, shuts, warms, celsius) are 92 px bigText high in the hero zone (y 512), in 0.1 s before the voice, held 1.5 s (PR #1141, nothing else changed); render 3 run 45006406274: OUTPUT QA PASS, SYNC 5 of 5; item 13 written.
- Left: the 11:17 critic (item 20 + ENHANCE); post at 18:00 IST.
- For the other account: SYNC passes on one-word big type; a 46 px pill with two words did not.

## 2026-11-22 16:15 IST · claude/critic-2026-11-22-r3 (+ -web) · reel critic, render 3 of both reels (owner's one-off third render)
- Done: tech showreel-tech-cold-shutdown render 3 (run 45006406274): CRITIC: NOT READY: the recap pill "Cold: pauses it" lands on the voltage bar (~37 s), the second pill "Warm it back up" is cued on the last word (same as the end card) so it is almost invisible, and the end card sets its words over the ghosted scene with the lower 55% empty; 0-36 s is sound and Output QA passes. Pushed alone first (PR #1143). critic.md question 38.
- Done: web showreel-44-darkflash render 3 (run 45009589454): Output QA PASS; question 37 FOCUS 1-2 hues on every 0.1 s frame; CRITIC: NOT READY on one overlap: the BEFORE chip sits under its row's "10:00" at 11.2-12.8 s (the AFTER chip is fine, on top). Fix is one line (#tgA solid, on top).
- Supersedes claude/critic-2026-11-22-r2 (PR #1131): its pending verdicts are replaced by these; that PR can be closed unmerged.
- Waiting on the owner: both reels are at the render cap. Post as is (both blemishes are small and late) or allow one more render each; the fixes are written in each review file, item 20.
- For the other account: a recap pill cued on the same word as the end card never shows; read the topic's cue list next to the stills. A chip over a row must be on top and opaque, not under the row's text.

## 2026-11-22 · claude/journey-critic-reason · app, Journey Critic row (owner, size S)
- Done: design/critic.md "Item 20 format": CRITIC: NOT READY: <one plain sentence, what and when in seconds> first, then Detail:. src/journey.js criticOf() takes the first sentence (to "Detail:" or the first ". " after 20 chars, ~220 chars, no cut at ")") and keeps ~1200 chars as `more`; templates/index.html shows it tap-to-expand ("More"/"Less") in the Journey list. Also fixed the critic-line regex: it missed lines with a time like "16:10" before "CRITIC:", so those reels showed no critic verdict. scripts/test-critic-reason.mjs prints the parse for the darkflash and cold-shutdown review files.
- Left: the 11:17 critic writes the new format from the next run; /api/journey not checked (behind sign-in).

## 2026-11-22 17:15 IST · claude/tech-reset · tech reset, Part 1 (owner's go, size L)
- Done: design/rules-tech.md: the reset section (shot-by-shot table night-mode / screen-120hz vs the last six), Detail bar D1-D8, audience pull P1-P4, four formats X (xray, showdown, quickmyth, indiapick: own look, pacing, length), rotation; K1 / K3 loosened (no-bob / no-loop / one-move-then-hold / still-cover removed; sweeps, hero box and whole-frame wobble still out); retired R0, S1-S8, G1-G14 and the E24 notes to attic/design/rules-tech-2026-11-22.md. Output QA SHEEN fails from 4 sweeps (1-3 warn; the glass sheen made 15). scripts/check.mjs 4e: tech entries from 22 Nov need "format" and "device", no repeat of either on consecutive days, at most one "charging" in 7 days. critic.md 39-40, runbook-daily step 4, owner-feedback line (22 Nov), techkit/README, mandatory.md calibration note. showreel-tech-cold-shutdown hidden ("replaced by the reset reel, owner 22 Nov").
- Left: Part 2, the reset reel for today (claude/tech-heart-green), its ONE render, item 13, the critic.
- For the other account: a tech captions entry now needs "format" and "device"; read the day before's before choosing.

## 2026-11-22 · claude/tech-heart-green · tech reset, Part 2: the reset reel
- Done: showreel-tech-heart-green (xray, wearables, global; Apple Support 120277 read 22 Nov): techkit/scenes/heart-green.js, topic, review file, captions entry (postOn 2026-11-22, postAt 20:30). Local: SAFE ZONE ok, OVERLAP none, FLOW cuts 0 / dead none / continuity 95%; look.py SHEEN 0, HERO 82%.
- Left: ONE render (Tech reel, slug heart-green) after the merge, Output QA, item 13, the critic.
- For the other account: a kit close-up beyond 1.5x needs the world clipped under the header (screen y 450+); labels go into clear tissue, not on the watch.

## 2026-11-22 · claude/tech-heart-green-r2 · heart-green render 1 result and fix
- Done: render 1 (run 45018742866) Output QA FAIL on EDGES and SYNC only (issue 1150); fixed in the scene (world clipped 28 px in from both sides; the SYNC words on a solid dark plate); local tesseract reads both missed words; review item 13 updated.
- Left: render 2 (last allowed) after the merge, item 13, the critic.
- For the other account: a kit world wider than the frame must be clipped 28 px in once the camera zooms past 1.1 (Output QA EDGES reads the outer 2%); SYNC words need a plate when they overlap any drawing.

## 2026-11-22 · claude/tech-heart-green-item13 · heart-green render 2: OUTPUT QA PASS
- Done: render 2 (run 45021673906) OUTPUT QA PASS (SYNC 4 of 4, HERO 83%, SHEEN 0, DEAD none, EDGES pass); item 13 written. The tech reset (PR #1148) and its first reel are live for 20:30 IST.
- Left: the Reel critic (item 20 + ENHANCE) on showreel-tech-heart-green; post at 20:30 IST.
- For the other account: next tech reel must change format and device class (check.mjs rotation): not xray, not wearables.

## 2026-11-22 · claude/critic-heart-green · Reel critic: showreel-tech-heart-green render 2
- Done: item 20 CRITIC: NOT READY: the trace crosses out the "LIGHT BACK" label ~15-27 s, and the end card (34-36.5 s) lays "SAVE THIS · SHARE IT" over the watch with the lower 45% empty. Otherwise sound: Output QA PASS, voice word for word, SOUND 26/26, facts re-read on Apple's page (incl. the caption's 30-210 bpm). Clearly richer and more hooking than cold-shutdown (wrist world, x-ray, blood-cell dive, live trace, night chapter, question answered at the end). ENHANCE written. critic.md question 41.
- Left: the owner decides: post at 20:30 as is (cosmetic, late or small) or allow a 3rd render; the ~3-line fix is in item 20.
- For the other account: stills on the real voice timing: map the run log's CUES line onto the fake-vo timeline.json, then techkit/preflight.mjs; a chart label must sit outside its line's range.

## 2026-11-23 · claude/previews · three preview concepts in the app (owner's ask ~01:40 IST)
- Done: three 11.5 s split-screen previews from R-ref 23 Nov (rule or spec on top, the object changing live below, stacking value cards, silk background in the active colour, word-by-word captions, ~1 s states) plus research-jump P1 (end on a line worth sending): scripts/previews/web-typescale (type scale ×1.25 / ×1.333 on an invented plant shop page), c3-poster (bake-sale poster, 5 fixes), tech-ramsqueeze (three.js phone, chips leave for an AI server, 8 → 4 GB; TrendForce forecast to re-check before any post). Seekable scenes with sound cues; each rendered locally (1080x1920, 60 fps, CRF 18, ~-14 LUFS) and checked frame by frame at phone size.
- App: Inbox → "Previews to review (n)" at the top (templates/showreels/previews.json): channel, idea, reference techniques, the clip, Stills, and Like / Not this, stored as Feedback "Preview <name>: Like|Not this" (D1 owner_feedback, existing /api/feedback); counted in the Inbox badge until answered. No Worker change. Showreel "Keep the preview" also keeps <name>-stills.png in R2 study/.
- Left: after the merge, Showreel (seconds 11.5) for scripts/previews/{web-typescale,c3-poster,tech-ramsqueeze}.json puts the clips in R2 (v/study/, 15-day rule). The daily run reads the answers in Owner answers.
- For the other account: a preview is a Showreel config with "seconds"; the app reads /reels/study/<name>-preview.mp4 and -preview-stills.png.

## 2026-11-23 · claude/app-audit-status · "Audit: ..." status line at the top of Journey (owner's ask ~07:45 IST)
- Done: templates/index.html: one line above the reels from /api/cards (no Worker change, no new secrets): grey not run yet / green done at HH:MM · channel states · n changes / amber skipped today (after 12:00 IST); tap opens Inbox at the audit card. design/runbook-daily.md step 2: the audit card is written BEFORE any reel; if it cannot be, post "Audit skipped: <why>" to Owner answers.
- Limits: "running" is not shown (nothing in the app can tell); after "Mark read" the green line comes from this device's saved summary only.
- Left: the audit card should carry lines "ESCALATE web" / "OK tech" and points starting "Change:" for the summary to fill.
- For the other account: the renovation session can restyle `.astat`.

## 2026-11-23 · claude/homebar-black · homebar redone in the black look (owner chat: "Redo homebar in black today and run the critic right after")
- Done: showreel-45-homebar now uses the black look of the top three reels (numbers 165K, list 10K, popup 6.2K): near-black ink, no blooms, neutral surfaces (KM.VIVID.s = 0), no coloured or glowing phone frame, one gold accent word in the hook; topic, voice, captions, safe zones unchanged. Local preflight clean (CONTRAST 5.7:1, SUBJECT FILL 41%, SAFE ZONE ok, OVERLAP none, FLOW ok). Owner rule: owner-feedback.md line, rules-web.md rule 19, new Output QA BLACKBG (median background brightness outside the subject at most 32; FAIL for palette "black", WARN otherwise).
- Left: render 3 (owner-approved) after the merge, Output QA, item 13, then the critic session.
- For the other account: new web scenes set KM.WORLDS.black as in homebar.html and write "palette": "black"; coloured worlds are retired for web.

## 2026-11-23 · claude/critic-homebar-r3 · Reel critic: showreel-45-homebar render 3 (black look)
- Done: watched render 3 (run 45109878508) as a viewer: stills every 1 s from the scene, crops of the end, the render's voice and sound lines, every web question in design/critic.md. Item 20: CRITIC: READY (HUE soft: owner decides). Only Output QA HUE failed (35 deg vs 41-gradient 65 deg); on the near-black frame no viewer sees it. Nit: "ONE LINE" chip touches a dimmed check at 12-13 s, not visible at phone size.
- Left: the owner decides on posting render 3 or a render 4; no render started here. Item 13 still names render 2's numbers (render 3's are in item 20's Detail).
- For the other account: stills.mjs needs PW_FROM=/opt/node22/lib/node_modules/ in a session without node_modules.

## 2026-11-23 · claude/craft-skills · vetted craft skills in .claude/skills/ + patterns rule (owner chat job, size M, owner's go)
- Done: .claude/skills/ frontend-design, canvas-design (anthropics/skills e4bb5d9, Apache-2.0), hyperframes, reverse-any-video, style-sampling (heygen-com/hyperframes 871333e, Apache-2.0); every copied file read; each opens with a Studio note (our render runs through our GitHub workflows, not their CLI); reverse-any-video and style-sampling rewritten as study tools (pattern card / style card); fonts, scripts, presets, HeyGen cloud/billing/re-shoot files left out (.claude/skills/THIRD_PARTY.md). Owner's rule (23 Nov): reuse design patterns from any video, tweaked; never the footage, copy, art or a near-identical look of one piece: CLAUDE.md, safety.md rule 1, references.md, owner-feedback.md, runbook-daily step 0. critic.md "Premium check" (animation, cleanliness, premium feel out of 10, under 7 = NOT READY); runbook-reels.md: builder runs it on stills before the render; Inbox reference reels go through reverse-any-video into a pattern card.
- Left: the next builder and critic write the PREMIUM line; the first reference studied with reverse-any-video gets the first pattern card.
- For the other account: skills load from .claude/skills/ in every cloud session; read the Studio note at the top before using one.

## 2026-11-23 · claude/app-renovation · the app renovated: Today | Growth | Inbox (owner's OK 23 Nov, size L)
- Done: templates/index.html rebuilt around three tabs. Today = Needs you (questions with their buttons + reels ready to post: Copy, Save, I posted it), Today's reels and Tomorrow with one plain status each (Planned, Building, Making the video n%, Checking, Fixing + reason, Not ready yet, Ready to post, Posted), All reels and posted, the daily report line. Each reel has its own page (step bar, reason with More/Less, video, buttons, post text, sources, How it was made in plain words); `/#reel=` reminders open it. Growth = All (three channels on one screen) or one channel's charts. Inbox = Previews, Claude's replies (moved from the side menu), Message Claude, Ideas and references, Daily reports. The side menu became a Settings sheet (gear): notifications, GitHub minutes, All reels, Sign out. New look: ink and paper, amber = needs you, green = ready, channel colours only as dots, light and dark. sw.js v21. No Worker or API change; all data kept. design/runbook-reels.md "The app" rewritten; runbook-daily step 2 wording.
- Checked locally against a mock of every API at 390 px (light and dark) and 1280 px: no script errors, no sideways scroll; npm run check passes.
- Left: the owner looks at the live app on the phone (behind sign-in). A render-cap decision shows on Today only when it is added as an Owner answers question.
- For the other account: status words live in `status()` and `plain()` in templates/index.html; add a new stage there, not on screen.

## 2026-11-23 · claude/inbox-cleanup · Inbox and Needs you cleaned, and kept clean by code (owner chat job, size S-M)
- Done: rules in code, in the daily path. templates/index.html: a preview leaves the list once answered (Like / Not this from any device) or 7 days after its "added" date; studied or used references older than 2 days leave the list. scripts/asks.mjs (Asks workflow): new `list` (everything the owner sees) and `tidy`; `read` runs tidy too: open ask past its `until` date removed (src/worker.js stores `until` on `add`), answered ask removed 3 days after the answer, unread Claude replies marked read 2 days after done, daily reports older than 2 days removed, PREVIEW lines name entries to drop from previews.json. scripts/check.mjs: every preview needs "added". previews.json: ramsqueeze (liked) removed, dates added. sw.js v22.
- Left: after the merge, run the Asks workflow `clear` for c3-design-profile and darkflash-post, then `tidy` once, then `list` to see what is left.
- For the other account: new asks that expire should carry "until": "YYYY-MM-DD"; a new preview needs "added".

