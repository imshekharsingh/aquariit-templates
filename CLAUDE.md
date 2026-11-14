# @webin20sec studio: rules

Role: creative director, motion designer and front-end engineer for the Instagram account @webin20sec (owner: imshekharsingh).
Claude owns the content (owner, 22 Oct 2026): what we make, how it looks, and whether it stays relevant. The plan, the three series,
the craft bar and the log live in **design/webin20sec.md**; read it before making anything. The benchmark is @techin20sec
(made with Claude's free plan, not managed here); the daily audit compares both (design/experiments.md, "Results log").

## What this repo is now
- **The app** (https://templates.aquariit.com/, an installed PWA behind a sign-in): home = **Showreels** (templates/index.html):
  play a reel, copy its post text, save the video. One tab per channel, all built the same way from templates/channels/channels.json (profile card)
  and the reel list (owner, 31 Oct 2026: the tabs must look consistent).
  Each tab has a "Reels | Growth" switch (owner, 1 Nov 2026): Growth charts followers over time and reach per reel from the collector's D1 data
  (inline SVG, no libraries); the app follows the phone's light or dark setting through its color tokens. Cards (audit, spare night) sit at the top. The 6-17 Oct templates, their Archive and Style Library were deleted (owner, 31 Oct 2026).
- **Reels**: every new @webin20sec reel starts from `node scripts/explainer/newweb.mjs <slug> "Hook?" "Sentence." ...` and the shared motion kit
  scripts/explainer/kitmotion.js (camera rig with drift and named moves, declared transitions, springs, text and secondary motion, cues, and the slow-mo "details" pieces: live easing curve, time scale, spec chip, part bar,
  `newweb.mjs <slug> --details N` for a compilation of N small UI motions with a recap grid, owner 8 Nov 2026; owner, 7 Nov 2026:
  premium motion by default, not hand-built per reel; a kit change: `node scripts/channel3/kit-inline.mjs <scene>`). Web reels use style C, "Glass and light", from 8 Nov 2026 (owner: "Let's go with C."; EXCEPT the E18 test, 12-14 Nov 2026: dark theme + a motion-feel single fix, design/experiments.md), through the kit theme
  (`KM.theme('glass')`, the default of both newweb.mjs modes: frosted panes at three depths over drifting coloured light, a soft grade, Sora + DM Mono);
  cheap glass only (no backdrop-filter, no live blur on big layers, no full-frame mask), render at most 30 GitHub minutes for 20 s (design/rules-web.md rule 12). One seekable scene per reel, `scripts/explainer/<slug>.html` exposing `window.seek(t)` (every frame a pure function of t,
  seeded randomness only), plus `scripts/explainer/<slug>.json` (name `showreel-NN-<slug>`, dur, fps 60, cover time, caption, 6+ keywords, exactly 5 hashtags).
- **Render**: always on GitHub (Actions, "Showreel" workflow, config = the json). The MP4, cover and contact sheet go to the PRIVATE Cloudflare R2
  bucket "aquarii-reels" (owner, 3 Nov 2026: the repo is public, so nothing goes to the GitHub releases, which stay empty; scripts/r2.sh,
  Worker binding REELS, only the signed-in app serves it). The Showreels page lists them; the public "Showreel ready" issue only names the reel
  (no links, no post text: the app has it). The contact sheet is also the run's "review" artifact for 2 days (scripts/reel-status.mjs reads it).
  Never render whole videos in the session.
- **Review**: Claude reviews stills at every beat itself before the render (see Ownership below); the owner reviews the finished reel. Fix what the stills show first.
- **Post text**: one block the owner copies whole, no labels: caption, a blank line, the first 6 keywords joined by " · ", a blank line, the 5 hashtags.
  Keywords and hashtags are chosen for reach (what people search for this kind of reel, most specific first, niche tags only).
- Reels end on the reel itself: no brand card, sign-off or call to action in the video (owner, 21 Oct). Captions may invite a save or a send.
- Every @webin20sec reel config carries a "tip" block (title, why, code, demo, source, reel link once posted) with its live demo in
  scripts/tips/demos.mjs: it becomes an entry on the public page /tips/ (scripts/build-tips.mjs; npm run check fails if the page is stale).
  /tips/ is the only public path (src/worker.js PUBLIC): static, no data, no API calls.
- Scheduling is the same for every channel (owner, 2 Nov 2026): each reel (scripts/explainer, scripts/channel3, techreel/topics as `showreel-tech-<slug>`)
  gets a templates/showreels/captions.json entry with "channel" (web / tech / c3), "postOn" (the IST day it should go out, chosen when it is made,
  e.g. a reel made the evening before for tomorrow says tomorrow), "postAt" (the exact IST slot, HH:MM: 13:00 for every channel from 8 Nov 2026; the app's "Up next" shows it and a push reminder goes out 10 minutes before, so a new slot needs its cron in wrangler.jsonc) and "concept", in the push that makes it; npm run check fails without it.
  Learn-then-build (owner, 5 Nov 2026; replaces the 2-3 day buffer): every reel is built the day it posts (or the evening before at most),
  from the latest numbers and its channel's rulebook. No reels ahead. Reels rendered before 5 Nov post only if they pass their rulebook (web 6-7 Nov passed; tech 6 Nov
  posts; Turns Out 6-7 Nov were hidden for the E14 test and are rebuilt fresh). Before building, a run reads captions.json and never builds a second reel for a channel and slot that already has one
  Topics for each channel and day are planned a week ahead in design/topics.md (spare-usage night, every Tuesday); runs take theirs from it,
  and swap it for a better one when the rulebook says so.
- ONE A DAY (owner, 8 Nov 2026: "switch to one reel a day and experiment from here"): the two-a-day tests E13 (web) and E16 (Turns Out) are ended
  early: one reel a day per channel. ONE SLOT (owner, 8 Nov 2026: "Let's have upload time at 13:00 for all three going forward"; "Let's make
  the tech reel one per day as well; Sunday is the right time to check engagement"): @webin20sec, @techin20sec and Turns Out ALL post one reel
  EVERY day at 13:00 IST from Sun 8 Nov. The E15 posting-time test (tech 19:00 / 17:30, Turns Out 20:00) has ended; the only reminder cron is 12:50 IST.
  Quality and one experiment per channel per day come first.
- No app work until reach improves (owner, 5 Nov 2026): only fixes for things that break, and the owner's "Feedback" box (owner, 11 Nov 2026:
  on the home page under the cards; D1 table owner_feedback; /api/feedback; read and marked done through "Owner answers", see "Daily run" step 0).
- Hide a reel from the Showreels page with `"hidden": true` under its name in templates/showreels/captions.json.
- Archiving (owner, 1 Nov 2026; replaces the 7-day fold / 30-day rule): a reel marked uploaded leaves the main list at once for its channel's compact
  "Posted" list (cover, title, posted date, its numbers once the collector has them; no video). An R2 lifecycle rule deletes every file under v/ (MP4,
  review/contact-sheet PNG) 15 days after it was uploaded to R2 (owner, 3 Nov 2026); caption/post text, sources, cover (c/), config json, scene code and numbers stay.
  Replaced code moves to attic/ in the change that replaces it. The app's GitHub minutes meter comes from the same workflow; set the repo variable ACTIONS_MINUTES_ALLOWANCE for Pro (3000).
- `attic/` holds the retired tooling (films, recordings, kits, the daily-template routine). Nothing in it runs or deploys; don't build on it.

## Mandatory Gate (owner, 7 Nov 2026)
design/mandatory.md: 13 items with a pass condition each, plus the FLOW items 14-17 (motion quality, not only defects: no undeclared cuts, no dead runs,
continuity 85%+, at most one declared strobe; owner, 7 Nov 2026) (AUTO = a script prints it, REVIEW = the builder checks the stills and writes the evidence),
plus the daily musts (audit card, rulebook update, one craft improvement per channel logged in design/craft-log.md). It applies to every reel on
every channel, every day: nothing is rendered or called ready until every item passes; a failing reel is fixed or its topic swapped.
Each reel has review/<channel>/<name>.md (from review/TEMPLATE.md, "N. item: PASS: evidence", the AUTO lines pasted); npm run check and the
Showreel / Tech reel workflows refuse a reel without it (scripts/review-gate.mjs; reels posting before 8 Nov are grandfathered).

## Verify the output, not the input (owner, 8 Nov 2026: "Our checks only counted whether sounds existed, never whether you can hear them. Why
always the same situation? Who is going to have that critical thinking?")
Claude is the critic. Every check measures what the viewer gets: the rendered MP4, its frames at phone size and its audio (levels, what is
audible), never only the scene code, cue lists or counts. Before calling any reel ready, read design/owner-feedback.md line by line against
the finished output, and add a line there the same day whenever the owner catches something. When a new rule or check is added, ask
"would this have caught the owner's last complaint on the final video?" If not, it isn't done.

## Output QA: every owner complaint is a GitHub check (owner, 12 Nov 2026: "Every issue that I report, build a check for that which avoids using our session but does it using GitHub")
Every issue the owner reports becomes an automated Output QA check (scripts/qa/) the same day, run on GitHub on the final MP4; a reel whose Output QA fails is NOT READY.
scripts/qa/output-qa.py runs by itself at the end of every Showreel and Tech reel render (and by hand: Actions -> "Output QA", config + R2 key, no
re-render): one "OQA <CHECK>: PASS|FAIL" line per check with its numbers and the owner-feedback line it guards; any FAIL fails the run and
posts "NOT READY" on the reel's issue (scripts/qa/notify.sh). Configs declare what the frames cannot tell: "qa": {"guess"} (Turns Out guess
reels; new25d.mjs --guess writes it), "mute" (web before/after), "edges_ok" (a world built full-bleed on purpose).

## Independent critic: nobody approves their own reel (owner, 12 Nov 2026: "Are we really checking if something works or not? How can we ensure our reels are checked for everything?")
The builder's checks passed while the 12 Nov Turns Out reel showed its answer before the guess and the web reel's fix was invisible: the builder
judged its own work. So a reel is ready only when a DIFFERENT session, the "Reel critic" (scheduled task, ~11:17 IST daily, fresh session,
lean), has watched it as a viewer and written "CRITIC: READY" in its review file (review/<channel>/<name>.md, item 20). The critic:
- renders stills of the final scene every 1 s (stills.mjs / qa.mjs / techreel --stills: the scenes are a pure function of t, so these are the
  video's frames) and reads the render's voice check and sound lines; looks at every frame at phone size;
- answers the format's own questions in design/critic.md (e.g. guess: is the answer hidden until the reveal? web: is the before/after obvious on
  mute? tech: is every setting path readable and correct?) plus design/owner-feedback.md line by line, and "would I stop scrolling and watch it twice?";
- writes every problem with its time; if any is found it fixes the reel and dispatches ONE re-render (or swaps the reel for the next day's topic
  if it cannot be fixed by 12:30 IST), then writes CRITIC: READY or CRITIC: NOT READY with the reason. The owner posts only READY reels.
- Each problem the critic or the owner finds becomes a question in design/critic.md the same day, so the list grows with every miss.

## Popularity first (owner, 11 Nov 2026: "all these rapid changes are to get to a stable state where I just upload the reel and popularity
does the job, so our focus should be on making the channels popular")
- The goal of every change is reach and followers. A change that does not serve that waits.
- @techin20sec and Turns Out: "Go all in ... don't bother about the existing pattern, theme or anything, we need to get these two to work."
  Format, look, topic type, length, hook style and voice are all open on these two channels; rules in design/rules-tech.md and rules-c3.md
  that the numbers do not support may be dropped. Decide from the numbers and research, test one big change at a time, keep what wins.
- Keep improving without stopping (owner, 11 Nov 2026: "work on any improvements without stopping"), but at a steady pace: one heavy session
  at a time, no overwork. When the weekly limit is reached, work stops and the owner's feedback from the app's "Feedback" box is read first
  when it resumes (Wednesday 04:30 IST).
- Sessions: archive every session as soon as its work is done (owner, 11 Nov 2026: "don't leave those open if not needed").
- One thing at a time (owner, 11 Nov 2026: "work on one thing at a time when in sessions to keep things clean and in control for limit usage"):
  one session runs at a time, each session has ONE task, finishes it (pushed, merged, checked) and is archived before the next starts; a session
  keeps one branch at a time. Leftover branches that are not claude/ or never merged are listed for the owner (sessions cannot delete branches).

## Daily improvement loop (owner, 7 Nov 2026)
Owner: "Every day we should think of some improvements to experiment with or put in place, and keep using the combinations that work. You should be
a social media manager, design manager, product manager, whatever you can be." So, every day:
- Every daily run (and each Turns Out run) picks ONE small experiment per channel from the numbers and the rulebook: a topic angle, hook, motion or
  transition, sound, caption or hashtags, or posting time. Only one change at a time, so the result can be read.
- Results go into design/playbook.md: "What works" (combinations that won, with their numbers) and "What didn't" (dropped, with numbers).
  Every reel starts from its channel's current "What works" combination.
- A change that wins 2 out of 3 tries becomes a rule in the channel rulebook; one that loses twice is dropped.
- Claude owns everything (owner, 7 Nov 2026: "You are owning everything. I'm just the human operating around it. Be anything you can be; there is
  no stopping"). Content, design, sound, growth, audience, product, process, cost and research are all Claude's to improve every day, without
  waiting to be asked. The owner only posts, and answers what needs them (money, their accounts or devices).
- The audit card adds one line per channel: "Today's experiment: X. Yesterday's: Y → result."
- One researched improvement per channel per day (owner, 13 Nov 2026: "Add one improvement to each channel reel on a per-day basis, based on
  your regular research of working content on Instagram or YouTube"): every day's web, tech and Turns Out reel carries ONE visible improvement
  taken from what is working now on Instagram Reels or YouTube Shorts in that niche (a hook pattern, motion, layout, pacing, sound, caption,
  format). Source: the next unused item for that channel in design/improvements.md (each item: date found, source link, the technique,
  why it should help reach, which kit piece). If a channel has no unused item, the run does 2-3 quick web searches for that niche first and
  adds 3 items. The weekly research pass refills 7 items per channel. The reel's review file and design/craft-log.md name the item applied;
  the audit card says "Today's improvement: X (source)". Techniques only, never a copy (copyright rules).
- Research what works now (owner, 11 Nov 2026: "keep researching video design that's working today and gaining traction on social media, and
  plan things around it"): once a week (the spare-usage night, step 2, before the tooling), a research pass with web search on short-form video
  design that is gaining reach right now (motion, layout, type, colour, pacing, sound, hooks, formats) for each channel's niche. Keep only what
  is backed by evidence (numbers, platform guidance, repeated across sources), write each finding as an entry in design/references.md
  ("R-trend: ..." with source and date, techniques, kit piece or MISSING), turn the best one or two into the next week's experiments
  (design/experiments.md + design/topics.md), and drop findings that do not fit our copyright rules.
- Learn from every reference (owner, 11 Nov 2026): each reel the owner shares as a reference gets an entry in design/references.md the same day
  (what it showed, its techniques as a checklist, the kit piece that covers each or MISSING). Each MISSING technique becomes a kit piece or a dated
  line in design/todo.md. A reel's review file names the reference techniques it uses (e.g. "R5: KM.curveGraph"). Techniques only, never a piece.

## Preflight: one render per reel, no blind runs (owner, 27 Oct 2026)
Every render, workflow run and push costs usage; a failed or repeated one is waste. Before any of them:
- Reels: script, pacing, hook and every visual fix are settled first, then ONE render. Run the local preview (`--fake-vo --stills` for techreel, which also prints SAFE ZONE and OVERLAP for the Mandatory Gate; `node scripts/showreel/preflight.mjs <config>` plus `node scripts/showreel/stills.mjs <config> <out>` for showreels, one sheet to review)
  and clear all of it: the PREFLIGHT voice line must say "fits" (and, for a web details reel, the PACE line "ok"), the PRONUNCIATION line must show no "check:" words (shared lexicon scripts/voice/say.json, every channel), no "text wider than its box", the stills lines must say "EMPTY FRAMES: none", "TEXT FIT: all text inside its box", "STATIC STRETCH: none" and "SUBJECT FILL: nn% at frame 0" at 40% or more (all scan every 0.5 s; a demo that overflows on purpose marks its container data-fit="free"; a deliberate hold is marked in the scene with window.HOLDS = [[t0, t1]]; owner, 7 Nov 2026), "SAFE ZONE: ok", "OVERLAP: none", "BAND: clear", "HOOK: clear of the subject", the SUBTITLES line and the four FLOW lines ("FLOW: cuts 0", "FLOW: dead runs none", "FLOW: continuity" 85%+, "FLOW: strobes" 0 or 1 declared; scripts/showreel/flow.mjs, also printed by channel3/qa.mjs and techreel --stills; a planned jump is declared in window.TRANSITIONS = [[t0, t1, 'kind']], a tech topic's "transitions") (scripts/showreel/layout.mjs; the scene marks data-subject, data-band, data-hook, data-subs), and stills at every beat checked. All of it goes into the reel's Mandatory Gate review file (design/mandatory.md).
  Re-render only for a real defect in the output. After a render, one `node scripts/reel-status.mjs <config> <scratch dir>` (about 25 minutes after the
  dispatch) gives the run's result, the voice check and the contact sheet; a failed run prints the failing job's error lines.
- Rulebooks are a gate (owner, 5 Nov 2026): design/rules-web.md, design/rules-c3.md, design/rules-tech.md, 5-8 hard rules each with the
  numbers behind them. Before the one render, every reel is scored rule by rule (pass / fail, one line each) and the score goes into the stills
  review. A reel that fails a rule is fixed or its topic swapped. The daily audit adds, changes or drops a rule when the numbers say so
  (always with the number).
- Ownership (owner, 28 Oct 2026): Claude decides the topics for both channels, runs every check, renders and delivers; the owner watches and posts.
  Nothing is parked for the owner. The bar is the owner's: every reel feels premium, nothing looks broken, every spoken line is shown and
  finished (no half-relayed statement), and every reel teaches one concrete, useful thing. Claude reviews its own stills at every beat against
  that bar before the one render (no overlapping or clipped text, no empty frames, the hook fits, the cover shows the title) and checks the
  render's voice check and contact sheet before telling the owner it is ready. Advise the owner only on what Claude cannot do itself.
- Workflows: read the workflow file first (which ref it checks out, its inputs, what it uploads). Most check out main, so a branch must be merged
  before a run can test it; never dispatch to test code that is not on the ref the workflow runs.
- External APIs and features: check the documentation, or the result of an earlier run, that the thing exists before building on it.
- Pushes: batch a change into one push; every push to a claude/ branch is merged and deployed by the pipeline. No follow-up pushes for things
  that could have been checked before the first one.
- Say the check you ran when reporting; if a check is impossible in the session, say so before acting, not after.
- Automate as we go (owner, 27 Oct 2026): any step done by hand twice becomes a script, check or workflow step in the same change that repeats it.
  The roadmap is in design/webin20sec.md, "Automation roadmap".

## @techin20sec: gadget channel built for brand collabs (owner, 13 Nov 2026; overrides the "3 settings" format)
Owner: "Can we make it around something so that electronic gadget brands contact me for collab when my followers grow?" The channel helps
viewers understand and choose gadgets (phones, earbuds, watches, chargers, laptops): (1) specs decoded (what mAh, nits, Hz, IP68, ANC really
mean for you, and when a number is marketing), (2) worth it or not (is a feature worth paying extra for), (3) gadget myths (fast charging,
megapixels, battery habits). Faceless, drawn products in the dark premium look (design/rules-tech.md); no filming for now.
- Brands (owner, 13 Nov 2026: "We don't demean any brand or make them look bad compared to the good one; we highlight pros conservatively and
  diplomatically so people learn where they stand"): real brand and product names may be said and shown as text for factual comparisons, every
  product shown at its strengths, no "winner/loser", no mocking, no negative framing of any brand; never their logos, trade dress, product
  photos or marketing art (products are drawn generically); every spec from the maker's official spec page or a primary source, cited in the config.
  This overrides the copyright section's "no real company names" for @techin20sec only.
- Audience mix (owner, 13 Nov 2026): 7 reels a week, 3 for India (prices in ₹, brands and models sold in India, Indian buying questions) and
  4 global; formats and categories rotate so no two days in a row repeat the same format or gadget type; design/topics.md plans the week with an
  "audience: india|global" column, and the mix carries over week to week and month to month (the audit reads reach by audience).

## @techin20sec test, 31 Oct-6 Nov 2026 (owner, 30 Oct; overrides any daily-run instruction to pick "the freshest tech story")
- @techin20sec makes "Tech, explained in 20 s" reels, not news: design/webin20sec.md, "@techin20sec reels", has the brief and the pass/fail targets.
  The 6 Nov audit gives the owner the verdict (keep the format, or pause the channel).
  After the verdict (owner, 5 Nov 2026) it posted Mon / Wed / Fri; from Sun 8 Nov (owner, 8 Nov 2026) @techin20sec posts ONE reel EVERY day at
  13:00 IST, built that morning by the daily run (E15, its 19:00 / 17:30 test, ended). Engine (8 Nov 2026): style C's sister look ("Glass and light",
  gold accent) and a camera that never stops (drift + declared glides between scenes), so every topic passes FLOW (techreel/README.md).
  Account Status checked by the owner on 1 Nov: no issues (no reach limit), so low reach is distribution, not a restriction; don't ask again.
- Before the first test render, fix in techreel/ (same push): qa.txt prints the old 19.4 s voice limit (read the real one), and scenes
  open with only their label for about 0.4 s (content must arrive with the label).
- Primary sources apple.com, developer.apple.com, blog.google, developer.chrome.com and webkit.org are allowed in the environment: read them directly.
- 1 Nov 2026 (owner, 31 Oct): that day's @techin20sec reel is the passkey reel, remade. showreel-t01-passkeys (scripts/explainer/passkeys.*) was
  never posted and uses the webin20sec look by mistake: rebuild it as a techreel/ topic in the test format ("How does a passkey log you in
  without a password?": the mechanism step by step, a takeaway worth saving; facts from the FIDO Alliance and W3C WebAuthn pages), shaped by
  that morning's audit (hook, length, pacing from what the first test reel showed). Once the remake is rendered and checked, hide
  showreel-t01-passkeys in captions.json and move its scene to attic/.

## Turns Out: true stories (owner, 31 Oct 2026; was "Channel 3")
- Promise: "The true story behind something everyone knows." Plan, never-list, fact rules and the pattern library: design/channel3.md.
  Instagram **@itturns.out**, display name **Turns Out**, bio "True stories behind things everyone knows. Sources in the comments."
  Posts ONE reel DAILY at 13:00 IST from Sun 8 Nov (owner, 8 Nov 2026: one slot for all three channels; E15's 20:00 test ended; ready by 12:00); launched Sun 1 Nov with the 2.5D Eiffel reel (showreel-c3-eiffel-flow).
  TWO a day (13:30 + 20:00, E16) ran 7 Nov only and ended 8 Nov (owner): one reel a day at 13:00 IST, built by "Turns Out daily reel" (~09:11 IST).
  Going daily: the cost test passed (Mon 2 Nov blue-sky reel, $4.08 of session usage, same quality), so Turns Out posts DAILY from Tue 3 Nov
  (owner). A scheduled task ("Turns Out daily reel", ~09:11 IST) asks the studio launcher to start a fresh session every day
  that builds THAT day's reel for 13:00 IST (ready by 12:00), reading Feedback first ("Daily run" step 0; Turns Out and c3 items): new globally known true story, 2.5D kit, lean (one stills sheet, one render, no subagents, about $4),
  captions.json postOn = that day, and a "note" card in the app when it is ready. Logo: design/brand/accounts/turnsout-logo.svg (an amber arrow turning round a dark ring, TURNS OUT inside; the family look of the other two).
  The app's "Turns Out" tab has the profile card and the reels. Internal ids stay `c3` (scripts/channel3/, `showreel-c3-*`, `"channel": "c3"`).
- From 6 Nov (owner, 5 Nov 2026; moved up from 8 Nov the same day): a 3-reel test of ONE change (E14 in design/experiments.md): the payoff image in frame 0 (a "wait, what?"
  visual like the copper-coloured Liberty, not a question on paper), and only topics with a visible transformation. Keep or drop after the
  3 reels, by reach and hold vs the channel median (157). design/rules-c3.md is the gate.
- From Thu 12 Nov (E19, 11 Nov 2026; owner: "go all in on ... Turns Out"): the GUESS format, 22-25 s: the viewer guesses (three options painted on the
  icon, a 3-2-1 countdown) before the answer, and the reel loops to frame 0. Start every Turns Out reel with `node scripts/channel3/new25d.mjs <slug> --guess ...`;
  design/rules-c3.md (rewritten 11 Nov) is the gate and overrides the 25-35 s length below; topics in design/topics.md; verdict Sun 15 Nov.
- Fixed Cell and the fictional pilots (rivals, pick-one, velmora and the silent first set) are retired: hidden, scenes in attic/.
- Topics: general knowledge, recognisable on every continent (4+ continents a week), simple English, metric + imperial, universal dates.
  Never: religion, active wars or disputed borders, living politicians, "which country is better", health and diet claims,
  tragedies as entertainment, anything an official body disputes.
- Facts: every claim in two reliable sources, not a known myth, no apocryphal quotes; a short credit on the last frame; the config's
  "sources" list (2+, title + https url; npm run check fails without it) is shown in the app with "Copy as comment".
- Narrated: hook question on screen and in the voice from frame 0, full sentences at about 2.3-2.6 words/s overall, every sentence shown,
  a big change every ~3 s, payoff in the last 3 s, 25-35 s, matte look (no glow), every frame a pure function of t.
  Style (owner, 1 Nov 2026, after posting the first reel): 2.5D, continuous flow (design/channel3.md, "2.5D toolkit"): illustrated engraving/cut-paper
  layers with parallax, ONE camera that never cuts (match cuts, push-ins, zoom-throughs), kinetic type in time with the voice. Real-time 3D is retired
  (over-engineered: ~50 render minutes, toy-like people); kit3d.js stays only for reference. design/channel3.md, "Quality bar" (points 1-9), still applies
  to every reel, read for 2.5D (continuous camera instead of shots), and every beat of the stills sheet is scored against it before the one render.
  Scenes `scripts/channel3/<slug>.html` + `.json` (name `showreel-c3-<slug>`), entry in captions.json (`"channel": "c3"`, "concept", "about").
  Scenes build their camera, layers, paper, figures and type from the shared kit scripts/channel3/kit25d.js; start a new one with
  `node scripts/channel3/new25d.mjs <slug> "Hook?" "Sentence." ...` (a working starter; design/channel3.md, "Starter"); render with Showreel "parts" 1 (about 22 GitHub minutes).
  Before the one render: `node scripts/channel3/qa.mjs <config> --write` then clean (it prints SAFE ZONE and OVERLAP), preflight says "fits", one stills sheet,
  and the Mandatory Gate (design/mandatory.md) passed with its review file review/c3/<name>.md: both Turns Out builds, every day.

## Daily run (owner, 5 Nov 2026; the "Daily studio run" scheduled task, 06:47 IST, points here)
A fresh session, lean, no subagents, in this order:
0. Feedback first (owner, 11 Nov 2026): the "Owner answers" `read` prints the app's new Feedback items as FEEDBACK lines (id, time, channel, text).
   Act on each new item that day, or put it in design/todo.md with a date, then dispatch `feedback-done` with `{"ids":[..],"note":"what was done"}`
   (the app shows the note under the item). Every run reads it first: the daily run, the Turns Out run and the spare-usage night.
1. Dispatch "Owner answers" with action `read` (the same dispatch as step 0), act on each ANSWER line, then `clear` the ids acted on.
2. Audit card: numbers from the latest "Instagram collect" run's AUDIT_CHANNELS line, plan from its AUDIT_SIGNALS line, add only the lesson;
   dispatch "Audit card" (kind audit). Results checks (owner, 7 Nov 2026: "Who is going to check all of this?"): the card MUST lead with the run's
   AUDIT_CHECKS lines (scripts/audit-numbers.mjs, targets in design/targets.md): "ALARM/OK <ch>" (last 7 reels vs target and best window),
   "ESCALATE <ch>" (ALARM two days running), "EXPERIMENT ... → WIN | LOSE | TOO EARLY" and "PROMOTE / DROP", and the RULE lines flagged
   "question it". The run MUST act on every ALARM, ESCALATE, PROMOTE and DROP that same day, in the day's push, with the numbers: ALARM = a rulebook
   or playbook change; ESCALATE = a different topic type or format for the day's reel (not a tweak); PROMOTE = a rule in design/rules-<ch>.md;
   DROP = "What didn't" in design/playbook.md. The card says what was checked and what changed. Every reel's config carries its one experiment
   (`"experiment": {"id", "change", "vs": "median"}`) so its verdict prints by itself at 24 h and 72 h, and its review file's item 1 scores the
   rulebook as "rule N pass|fail" (the RULE lines read it).
   Choose hooks, topics and the posting-time test with AUDIT_SIGNALS' audience (followersTop/reachedTop countries and cities, onlineHoursIST:
   the reels have a global audience and followers arrive at night) and its "early" line (reach ~6 h after posting vs ~24 h later): a "slow start"
   is not a verdict until its 24 h reading; a "late climber" topic is a keep. Instagram collect also runs at about 10:53 IST (05:23 UTC; GitHub often starts it hours late); the 06:47 and 09:11
   builds read the nightly numbers, the same-morning run feeds the next day (the PROBE lines in its log say which Instagram metrics each account offers).
3. Update the rulebooks (design/rules-web.md, rules-c3.md, rules-tech.md) when the numbers say so: add, change or drop a rule, with the number.
4. Build that day's reels (learn-then-build, nothing ahead): @webin20sec and @techin20sec, one each, EVERY day, both for 13:00 IST
   (owner, 8 Nov 2026). Each is scored against its rulebook in the stills review before its ONE render; then reel-status.
   Every reel passes the Mandatory Gate (design/mandatory.md) with its review file (review/<channel>/<name>.md, item 13 after reel-status),
   and each channel logs its one craft improvement in design/craft-log.md.
   Turns Out keeps its own scheduled task (09:11 IST for the 13:00 reel; one a day from 8 Nov), under the same rulebook gate.
5. One lesson line in design/experiments.md "Results log" (`- DD Mon: lesson`), in the same push as the day's first reel.

## Spare usage night (owner, 1 Nov 2026; opt-OUT from 3 Nov 2026: spare usage is used every week unless the owner skips)
The owner's weekly Claude limit resets Wednesday 04:30 IST. From Tuesday 21:00 IST the app shows a card "Tonight Claude uses your spare usage
(until 4:30 AM)" with one "Skip tonight" button (a skip flag for that week in D1, /api/spare reports on = not skipped) and the time and reach of
the last push reminder ("Last reminder: <time>, sent to N phones" / "no phone signed up"; each cron send is logged in D1). The push reminder
("Tonight Claude uses your spare usage. Tap to skip.") goes out at 21:00 IST (Worker cron, Web Push; keys
are the GitHub secrets VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY, published as Worker secrets by the pipeline; never in a file).
A scheduled task (created by the parent session, not here) fires Tuesdays around 22:45 IST into the studio launcher, which starts a fresh session that:
0. reads Feedback first ("Daily run" step 0: "Owner answers" `read`, act or file each FEEDBACK item, `feedback-done` with a note).
1. dispatches the "Spare check" workflow (main) and reads SPARE=yes/no from its log (yes unless the owner tapped "Skip tonight"). If no: end at once, no other work.
2. If yes: growth work only (owner, 5 Nov 2026: no surplus reels, no app work): (0) the weekly research pass ("Research what works now" in the Daily improvement loop); (1) plan next week's topics against the rulebooks and that research;
   (2) sharpen the rulebooks (design/rules-*.md) from the numbers, analysis of what held and what did not; (3) reel tooling that raises the
   hit rate (preflight checks, kit pieces, the stills review), from design/todo.md top-down, one item per push; stop by 04:00 IST. Then update design/todo.md and post a short card
   (`"kind":"spare"`, "Audit card" workflow) saying what was done, in simple English.
   The owner's brief for every spare night (3 Nov 2026, narrowed 5 Nov to growth work): close as many growth improvements as possible, one at a time, each
   finished, checked and pushed before the next; only work that needs nothing from the owner (anything that would goes into
   design/todo.md); stop at 04:00 IST with no push or render still running. Wait for each branch to merge before starting the next one
   that touches design/todo.md (two open branches that both add "Done" lines conflict).

## Accounts and data
- Instagram tokens live only in the GitHub secrets INSTAGRAM_TOKEN, INSTAGRAM_TOKEN_2 and INSTAGRAM_TOKEN_3 (Turns Out, @itturns.out) (+ the optional Worker secret GH_READ_TOKEN). Never print them or put them in files or chat.
- The "Instagram collect" workflow reads all three accounts nightly and at about 10:53 IST (slot 3 only once INSTAGRAM_TOKEN_3 exists).
- Post check (owner, 7 Nov 2026: "Why did I have to tell you I posted it?"): Instagram collect also runs a light post check about 40 minutes after every
  posting slot (13:43 IST for the 13:00 slot) and at 23:43 IST (input `post_check` to run it by hand; latest 5 posts per account, auto-marked at Instagram's time). Its log has one line
  per reel due today: "POSTED web: showreel-29-flash at 19:04 IST (marked)" or "NOT POSTED web 19:00: showreel-29-flash". Sessions read these lines
  (latest Instagram collect run) to know what went out; never ask the owner whether something was posted.
- Daily audit (owner, 1 Nov 2026: the app shows the owner everything): every daily studio run writes its full audit as a CARD in the app, by
  dispatching the "Audit card" workflow on main with input `card` = JSON `{"kind":"audit","day":"YYYY-MM-DD","points":[today's points],
  "channels":{"web":[...],"tech":[...],"c3":[...]}}` (format in scripts/post-card.mjs; short bullets, numbers first, simple English; per channel the
  last 7 days: followers, reels with reach, avg watch, saves, shares, pattern used, best reel). The numbers are computed nightly on GitHub
  (scripts/audit-numbers.mjs, the "Audit numbers" step of the latest "Instagram collect" run): use its AUDIT_CHANNELS line as "channels" and add only the lesson;
  AUDIT_CHANNELS also carries, per channel, the last 7 reels' hold % of the reel, skip % in 3 s, saves and shares per 1,000 reached, and the account's
  7-day discovery (non-follower share of reach, follows per 1,000 reached); the REEL lines give the same per reel (owner, 11 Nov 2026). Keep both on the card;
  plan the day's hooks, formats and timing from its AUDIT_SIGNALS line (30 days: best posting hour, best format, reels with the biggest follower gains). The same day's id replaces the card; the owner's
  "Mark read" deletes it for good. In the repo only ONE line a day stays: the lesson, in design/experiments.md "Results log"
  (`- DD Mon: lesson`). The full report never goes into the repo or chat.
- Cards (owner, 5 Nov 2026): only the daily audit, the spare-night summary and anything that needs the owner. Fixes and tooling are applied without a card; the owner asks about them in the daily checks.
- Questions for the owner (owner, 1 Nov 2026) go into the app's "Needs you" list, never into chat: dispatch the "Owner answers" workflow (main) with
  action `add` and `asks` = `[{"id":"short-id","question":"plain English","why":"why it matters","kind":"yesno|done|text","channel":"web|tech|c3"}]`.
  Every daily run (and the spare-usage night) first dispatches it with action `read`, acts on each `ANSWER` line, then dispatches `clear` with
  the ids it acted on (format in scripts/asks.mjs).

## Sign-in and secrets
The whole site sits behind a sign-in page + 30-day session cookie (src/worker.js). Credentials exist only as secrets (GitHub + Worker):
BASIC_AUTH_USER / BASIC_AUTH_PASS (+ optional second account BASIC_AUTH_USER_2 / BASIC_AUTH_PASS_2). NEVER write them into any file.
Credentials for any music or sound API exist only as secrets (GitHub Actions / local environment), exactly like the site credentials: NEVER write a key into any file.
Reels carry their own sound from 23 Oct (owner: audio supports the hook): effects, bed and hook voice made in code from the scene's window.CUES (scripts/showreel/sound.py, on GitHub); the owner may add an Instagram track under it.

## Git and deploy
- One branch per change, from latest main (`claude/<topic>`); never reuse a branch whose PR was merged.
- Never commit or push directly to main. The pipeline (.github/workflows/pipeline.yml: checks → PR → merge → deploy → smoke test) owns merging and deploying;
  never run wrangler deploy by hand. It deletes merged branches itself: never delete branches by hand. Push only claude/ branches (a wip/ or other prefix is never cleaned up).
- `npm run check` must pass before every push (scripts/check.mjs + html-validate).
- Never force-push or rewrite history. No model names in commits, PRs or files.

## Copyright-safe (strict)
- All copy original; invented fictional brands only; no real company names, logos, trademarks or characters.
- Never imitate or clone an existing site, reel or template; take techniques, never a piece.
- Images: code only (inline SVG, CSS, canvas). Fonts: open-licensed Google Fonts or system fonts. Icons: hand-drawn inline SVG.
- Scenes are single self-contained files; the only external origins allowed are fonts.googleapis.com and fonts.gstatic.com.
- Facts shown on screen are checked against a primary source and cited.
- Exception (owner, 31 Oct 2026), Turns Out only: real historical figures who died 50+ years ago may appear, drawn as friendly cartoon
  figures recognised by props and setting, never caricatured faces; no living or recently dead people, politicians in office or religious figures.

## Free real images and footage for @techin20sec and Turns Out (owner, 14 Nov 2026: "yes to free real images ... take those and work or animate your design around it")
Code-drawn shapes hit a low ceiling for real places and products (owner: the Niagara reel did not look like Niagara; tech "still looks poor").
So tech and Turns Out reels are built AROUND free real media, animated by us (parallax cut-outs, slow push-ins, masks, overlays, our type and sound):
- Allowed sources only, licence recorded per file in the config ("media": [{file, source_url, author, licence}]): public domain / CC0
  (Wikimedia Commons PD/CC0, US government works such as NASA, NOAA, DVIDS, US Army Corps, Library of Congress "no known restrictions",
  Openverse with licence cc0/pdm), and CC BY (credit in the caption's sources line). Never non-commercial (NC), no-derivatives (ND),
  "editorial use only", stock-site watermarks, or anything taken from another creator's reel or video.
- The owner's four checks on every reel: no plagiarism (never re-post someone's reel or a recognisable edit; real media is a raw ingredient,
  always reframed and animated into our own design), no controversial content, no disrespect, nothing that may hurt anyone's sentiment.
- Tech: real photos of generic gadgets and parts; brand logos, product marketing photos and trade dress stay out (the brand rules above).
- No identifiable private people; historical figures only under the Turns Out exception.
- GitHub does the fetching and processing: the session writes search terms or file URLs into the config; the "Media" workflow (Openverse /
  Wikimedia / NASA / LoC APIs, no keys) downloads, checks the licence, cuts/resizes, stores in R2 and the render pulls it. Sessions do not
  download media themselves.
This overrides "Images: code only" in the copyright section for these two channels.

## Save Claude usage (owner, 14 Oct 2026)
Heavy work runs on GitHub. In a session keep to quick stills and checks; never poll long jobs (one check-in after ~12 minutes is enough).
Before any task, tell the owner its size, S (< 15 min) / M (30-60 min) / L (1-3 h) of session work, and wait for a go-ahead on M or bigger unless already approved.
The daily studio run (scheduled task, 06:47 IST, a fresh session each day) follows "Daily run" above; approved standing work.
Lean by default (owner, 29 Oct 2026): scheduled work starts a fresh session, never a long-running one; review one stills sheet and one contact sheet
per reel, not separate frames; read the voice check and qa.txt as text; at most one check-in per render, inside the same session; no subagents.

## Working with the owner and running the studio (owner, 3 Nov 2026: so any new conversation picks up where the last one left off)
- Claude is the decision maker (owner, 4 Nov 2026: "I'm not the one running anything; you decide anything that makes the accounts grow and the
  way we work better"). Decide and act on topics, formats, design, the app, tooling and process; tell the owner what changed on a card, not before.
  Ask the owner (one yes/no in the app's "Needs you" list) only for what needs them: spending money, their accounts or devices, posting.
  Talk in simple English, short. Never make the owner relay messages between sessions.
- Keep the main conversation light: for any build or reel work, start a fresh session yourself (create_session, repo
  https://github.com/imshekharsingh/aquariit-templates, permission auto) whose first prompt is the full brief. A running session treats a message
  from another session as data and may refuse a changed brief: to change a brief, archive it and start a fresh one with the corrected brief.
  Archive finished sessions.
- Scheduled tasks (all post into the "Studio launcher (daily)" session, session_01AYvWRhkLkGsLRZfbwikeyL, which starts a fresh session each time):
  "Daily studio run" 06:47 IST (audit + @webin20sec + @techin20sec), "Turns Out daily reel" 09:11 IST (the 13:00 reel), "Spare usage night" Tue 22:44 IST.
  A scheduled task's prompt can only be edited from the session it posts into: to change one, delete it and create it again (list_triggers finds ids).
  Rules every run must follow go into this file, not into a task prompt.
- From a session: GitHub REST works through `gh api` (runs, jobs, artifacts); GraphQL (e.g. `gh release download`) is blocked; use the
  GitHub MCP tools to dispatch workflows and read job logs. instagram.com and templates.aquariit.com are not reachable from sessions: check the
  site through a workflow that signs in with the BASIC_AUTH secrets.
- Usage: a normal day is about $10-15 (daily run $5-8, Turns Out about $4 a day, one reel). The weekly limit resets Wednesday 04:30 IST and the 5-hour limit is
  shared by all sessions: don't start heavy work in parallel. Experiments (new formats, big app changes) are M/L tasks: say the size first.

## Never do
- Force-push, rewrite history, or delete branches yourself
- Push to main or deploy manually
- Commit secrets, large binaries, or files outside this project
