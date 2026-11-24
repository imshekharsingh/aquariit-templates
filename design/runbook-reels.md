# Reel runbook: the app, how a reel is made, rendered, checked and scheduled

Moved from CLAUDE.md on 14 Nov 2026 (owner: slim CLAUDE.md). CLAUDE.md keeps the principles; this file has the detail.
Channel briefs: web design/rules-web.md, tech design/rules-tech.md ("Channel brief"), Turns Out design/channel3.md ("Channel brief").

## The app
- https://templates.aquariit.com/, an installed PWA behind a sign-in (templates/index.html, templates/sw.js; APIs in src/worker.js and
  src/journey.js). Renovated on 23 Nov 2026 (owner, 22 Nov: "clean, and I can see where my primary focus lies"; mockups approved 23 Nov).
- Three tabs: **Today | Growth | Inbox** (bottom bar on phones, side rail on desktop; the last one used is remembered). The gear (top right)
  opens Settings: notifications, GitHub minutes, "All reels and channel profiles", Sign out. Nothing else lives in a menu.
- **Today** answers "what needs me" and "where is today's reel": Needs you (the open questions from Owner answers `add`, with their buttons,
  then every reel ready to post due by the end of today: Copy post text, Save video, I posted it), Today's reels and Tomorrow (one row per
  channel, one status in plain words), "All reels and posted", the daily report line (`auditShow`, from /api/cards) and when it updated.
  The Today badge counts questions plus reels ready to post.
- Status words (templates/index.html `status()`, from the seven stages of GET /api/journey): Planned, Building, Making the video n%,
  Checking, Fixing (+ the reason in one line), Not ready yet (amber, the second look's first sentence, More/Less for the rest),
  Ready to post (green), Posted. No stage jargon on screen (Checks / Critic / Output QA / PR numbers); the reel page's "How it was made"
  list uses Planned, Built, Video, Machine checks, Second look, Ready to post, Posted (`plain()`).
- A decision for the owner ("post as is or one more try", "approve a preview") is an Owner answers `add` question: it shows at the top of
  Today with Yes / No (or Done / a reply). There is no separate decision API.
- Each reel has its own page (tap any row; post reminders `/#reel=<name>` open it too): step bar Planned, Made, Checked, Ready, Posted,
  the status and reason, the video, Copy post text / Save video / I posted it (Undo for a day), the post text, sources, How it was made.
- **All reels** (from Today or Settings): the old per-channel list (channel tabs, profile card, Up next / Later / Posted with each post's
  numbers). Hide a reel with `"hidden": true` under its name in templates/showreels/captions.json.
- **Growth**: All shows the three channels on one screen (followers, change this week, 30-day line, typical reach / seconds watched /
  saves of the last 7 reels); Web / Tech / Turns Out show that channel's charts, "What each reel did" and "What works" (/api/perf, inline SVG).
- **Inbox** (owner, 24 Nov 2026: "too many items, add a clear message what I need to check"): the top line says "You have N things to check" (Today shows the same). (24 Nov 2026: Inbox = Ready to post reels plus Claude's replies only; every preview is needsOwner false, npm run check fails otherwise.) Older rule, no longer used: previews with `"needsOwner": true` (templates/showreels/previews.json, Like / Reject stored as Feedback), each headed by its one-line `ask`, and unread replies. **Every preview entry must carry `needsOwner` (true/false) and `ask`** (npm run check fails otherwise). Set needsOwner true only when the owner has to listen or look and the critic has already said READY (or the owner asked); a study record, a critic-decided item or a rebuild that is not READY is false and goes to the Studio log (collapsed, bottom of Inbox, 30 days). A needsOwner ask is one plain line that ends with the tap: "Listen: does the voice sound natural now? Like or Reject". A decision for the owner ("one more render?") is an Owner answers ask with a plain question ending "Yes / No". When unsure, log rather than Inbox. Other Inbox parts: Claude's replies (Mark read, Next;
  /api/feedback/<id>/read), Message Claude (D1 owner_feedback, /api/feedback; read first by every run), Ideas and references (/api/refs,
  private R2 refs/), Daily reports (/api/cards). The Inbox badge counts unread replies, previews to answer and reports.
- Look: ink and paper, amber = needs you, green = ready; channel colours only as 8 px dots; type 28 / 16 / 14.5 / 12; cards 14 px radius,
  hairline borders; follows the phone's light or dark setting. Bump VERSION in templates/sw.js when the page changes.
- Journey data: GitHub is read with the optional Worker secret GH_READ_TOKEN (read-only Actions + Contents; cached a minute in the Worker;
  Today asks again every minute only while a reel renders). Without it, finished steps still show from R2, D1 and the review files.
  Runs name their reel through run-name ("Showreel · <config>", "Tech reel · <slug>", "Output QA · <config>"); Output QA prints one
  `::error title=Output QA::<CHECK>: ...` line per failing check, which becomes the Fixing reason. Keep both when editing those workflows.

## Making a web reel
- Every new @webin20sec reel starts from `node scripts/explainer/newweb.mjs <slug> "Hook?" "Sentence." ...` and the shared motion kit
  scripts/explainer/kitmotion.js (camera rig with drift and named moves, declared transitions, springs, text and secondary motion, cues, and
  the slow-mo "details" pieces: live easing curve, time scale, spec chip, part bar). `newweb.mjs <slug> --details N` makes a compilation of
  N small UI motions with a recap grid (owner, 8 Nov 2026). Premium motion by default, not hand-built per reel (owner, 7 Nov 2026).
  A kit change: `node scripts/channel3/kit-inline.mjs <scene>`.
- Look and render budget: design/rules-web.md ("Channel brief").
- One seekable scene per reel, `scripts/explainer/<slug>.html` exposing `window.seek(t)` (every frame a pure function of t, seeded randomness
  only), plus `scripts/explainer/<slug>.json` (name `showreel-NN-<slug>`, dur, fps 60, cover time, caption, 6+ keywords, exactly 5 hashtags).
- Tech reels: techreel/ (techreel/README.md, design/rules-tech.md). Turns Out: scripts/channel3/ (design/channel3.md).

## Render
- Always on GitHub (Actions, "Showreel" workflow, config = the json). Never render whole videos in the session.
- The MP4, cover and contact sheet go to the PRIVATE Cloudflare R2 bucket "aquarii-reels" (owner, 3 Nov 2026: the repo is public, so nothing
  goes to the GitHub releases, which stay empty; scripts/r2.sh, Worker binding REELS, only the signed-in app serves it). The Showreels page
  lists them; the public "Showreel ready" issue only names the reel (no links, no post text: the app has it). The contact sheet is also the
  run's "review" artifact for 2 days (scripts/reel-status.mjs reads it).
- Cover (owner, 23 Nov 2026: an automatic cover caught "7 GB" mid-count): give each reel a designed cover in its captions.json entry, `"cover": {"t": seconds, "lines": ["one or two lines"], "accent": 1}`; pick a frame where the hook number or word is complete, never mid-count. The render builds it (scripts/cover.mjs; no "cover" = the old automatic frame); for a reel already in the app: Actions -> R2 -> cover (dst = the reel's name).
- Sound: reels carry their own sound (owner, 23 Oct: audio supports the hook): effects, bed and hook voice made in code from the scene's
  window.CUES (scripts/showreel/sound.py, on GitHub); the owner may add an Instagram track under it.
- Workflows: read the workflow file first (which ref it checks out, its inputs, what it uploads). Most check out main, so a branch must be
  merged before a run can test it; never dispatch to test code that is not on the ref the workflow runs.
- After a render, one `node scripts/reel-status.mjs <config> <scratch dir>` (about 25 minutes after the dispatch) gives the run's result,
  the voice check and the contact sheet; a failed run prints the failing job's error lines.

## Post text and tips
- Post text: one block the owner copies whole, no labels: caption, a blank line, the first 6 keywords joined by " · ", a blank line, the
  5 hashtags. Keywords and hashtags are chosen for reach (what people search for this kind of reel, most specific first, niche tags only).
- Reels end on the reel itself: no brand card, sign-off or call to action in the video (owner, 21 Oct). Captions may invite a save or a send.
- Every @webin20sec reel config carries a "tip" block (title, why, code, demo, source, reel link once posted) with its live demo in
  scripts/tips/demos.mjs: it becomes an entry on the public page /tips/ (scripts/build-tips.mjs; npm run check fails if the page is stale).
  /tips/ is the only public path (src/worker.js PUBLIC): static, no data, no API calls.

## Scheduling
- Same for every channel (owner, 2 Nov 2026): each reel (scripts/explainer, scripts/channel3, techreel/topics as `showreel-tech-<slug>`)
  gets a templates/showreels/captions.json entry with "channel" (web / tech / c3), "postOn" (the IST day it should go out, chosen when it is
  made), "postAt" (the exact IST slot, HH:MM: 13:00 for every channel; the app's "Up next" shows it and a push reminder goes out 10 minutes
  before, so a new slot needs its cron in wrangler.jsonc; the only reminder cron is 12:50 IST) and "concept", in the push that makes it;
  npm run check fails without it.
- One reel a day per channel, all at 13:00 IST (owner, 8 Nov 2026). Learn-then-build (owner, 5 Nov 2026): every reel is built the day it
  posts (or the evening before at most), from the latest numbers and its channel's rulebook. No reels ahead. Before building, a run reads
  captions.json and never builds a second reel for a channel and slot that already has one.
- Topics for each channel and day are planned a week ahead in design/topics.md (spare-usage night); runs take theirs from it, and swap it for
  a better one when the rulebook says so.

## Archiving
- A reel marked uploaded leaves the main list at once for its channel's compact "Posted" list (cover, title, posted date, its numbers once
  the collector has them; no video) (owner, 1 Nov 2026).
- An R2 lifecycle rule deletes every file under v/ (MP4, review/contact-sheet PNG) 15 days after upload (owner, 3 Nov 2026); caption/post
  text, sources, cover (c/), config json, scene code and numbers stay.
- Replaced code moves to attic/ in the change that replaces it. `attic/` holds retired tooling; nothing in it runs or deploys; don't build on it.
- The app's GitHub minutes meter comes from the same workflow; set the repo variable ACTIONS_MINUTES_ALLOWANCE for Pro (3000).

## Mandatory Gate (owner, 7 Nov 2026)
design/mandatory.md: 13 items with a pass condition each, plus the FLOW items 14-17 (no undeclared cuts, no dead runs, continuity 85%+, at
most one declared strobe) (AUTO = a script prints it, REVIEW = the builder checks the stills and writes the evidence), plus the daily musts
(audit card, rulebook update, one craft improvement per channel logged in design/craft-log.md). Applies to every reel on every channel,
every day: nothing is rendered or called ready until every item passes; a failing reel is fixed or its topic swapped. Each reel has
review/<channel>/<name>.md (from review/TEMPLATE.md, "N. item: PASS: evidence", the AUTO lines pasted); npm run check and the Showreel /
Tech reel workflows refuse a reel without it (scripts/review-gate.mjs).

## Verify the output, not the input (owner, 8 Nov 2026)
Claude is the critic. Every check measures what the viewer gets: the rendered MP4, its frames at phone size and its audio (levels, what is
audible), never only the scene code, cue lists or counts. Before calling any reel ready, read design/owner-feedback.md line by line against
the finished output, and add a line there the same day whenever the owner catches something. When a new rule or check is added, ask "would
this have caught the owner's last complaint on the final video?" If not, it isn't done. Critics, the Improvement lab and every quality
review fetch the real render with `node scripts/reel-fetch.mjs <reel-name>` (read-only reel key; see "Independent critic" below) and judge
its frames and audio, not frames rebuilt from the scene.

## Output QA (owner, 12 Nov 2026: every owner complaint is a GitHub check)
Every issue the owner reports becomes an automated Output QA check (scripts/qa/) the same day, run on GitHub on the final MP4; a reel whose
Output QA fails is NOT READY. scripts/qa/output-qa.py runs by itself at the end of every Showreel and Tech reel render (and by hand:
Actions -> "Output QA", config + R2 key, no re-render): one "OQA <CHECK>: PASS|FAIL" line per check with its numbers and the owner-feedback
line it guards; any FAIL fails the run and posts "NOT READY" on the reel's issue (scripts/qa/notify.sh). Configs declare what the frames
cannot tell: "qa": {"guess"} (Turns Out guess reels; new25d.mjs --guess writes it), "mute" (web before/after), "edges_ok" (a world built
full-bleed on purpose). Web CALM, HUE, SPLIT and SPREAD can be read before the render on the scene's own frames: `node scripts/qa/frames.mjs <config> <dir>`
then `python3 scripts/qa/look.py <config> <dir>` (same functions); the new reel's demo hue goes into scripts/qa/demo-hues.json in its push.

## Independent critic (owner, 12 Nov 2026): nobody approves their own reel
A reel is ready only when a DIFFERENT session, the critic, has watched it as a
viewer. **The builder starts that critic the moment the final render passes Output QA (owner, 24 Nov 2026): create_session, tag critic, model claude-opus-5-5, prompt = reel name + this section. The "Reel critic" scheduled task (~11:17 IST) is only a fallback for reels with no verdict. The critic decides: READY goes to "Ready to post"; NOT READY after the 2-render cap means the reel is skipped for the day. The owner is never asked (no preview yes/no, no "one more render?").** The critic and written "CRITIC: READY" in its review file (item 20). The critic:
- fetches the final render and judges that (23 Nov 2026): `node scripts/reel-fetch.mjs <reel-name>` downloads the final MP4, cover and json from the app into reel-files/ (git-ignored; never commit or upload them); then `ffmpeg -i reel-files/<name>.mp4 -vf "fps=4,scale=390:-2" reel-files/f-%04d.png` gives frames at phone size every 0.25 s (look closely around every cut), and listen to the audio (`ffmpeg -i reel-files/<name>.mp4 -af ebur128 -f null -` for levels, then the words against the voice script). If reel-fetch says "read key not set up yet", fall back to the scene stills and say so in the review.
  Scene stills every 1 s (stills.mjs / qa.mjs / techreel --stills) are only for planning a fix; reads the render's voice check and sound lines;
- answers the format's own questions in design/critic.md (e.g. guess: is the answer hidden until the reveal? web: is the before/after obvious
  on mute? tech: is every setting path readable and correct?) plus design/owner-feedback.md line by line, and "would I stop scrolling and
  watch it twice?";
- writes every problem with its time; if any is found it fixes the reel and dispatches ONE re-render (or swaps the reel for the next day's
  topic if it cannot be fixed by 12:30 IST), then writes CRITIC: READY or CRITIC: NOT READY with the reason. The owner posts only READY reels.
- Each problem the critic or the owner finds becomes a question in design/critic.md the same day.

## Preflight: one render per reel, no blind runs (owner, 27 Oct 2026)
Every render, workflow run and push costs usage; a failed or repeated one is waste. Before any of them:
- Script, pacing, hook and every visual fix are settled first, then ONE render. Run the local preview (`--fake-vo --stills` for techreel,
  which also prints SAFE ZONE and OVERLAP; `node scripts/showreel/preflight.mjs <config>` plus `node scripts/showreel/stills.mjs <config> <out>`
  for showreels, one sheet to review) and clear all of it:
  - PREFLIGHT voice line says "fits" (and, for a web details reel, the PACE line "ok"); PRONUNCIATION shows no "check:" words (shared
    lexicon scripts/voice/say.json, every channel); no "text wider than its box";
  - stills lines: "EMPTY FRAMES: none", "TEXT FIT: all text inside its box", "STATIC STRETCH: none", "SUBJECT FILL: nn% at frame 0" at 40% or
    more (all scan every 0.5 s; a demo that overflows on purpose marks its container data-fit="free"; a deliberate hold is marked with
    window.HOLDS = [[t0, t1]]), "SAFE ZONE: ok", "OVERLAP: none", "BAND: clear", "HOOK: clear of the subject", the SUBTITLES line;
  - the four FLOW lines ("FLOW: cuts 0", "FLOW: dead runs none", "FLOW: continuity" 85%+, "FLOW: strobes" 0 or 1 declared;
    scripts/showreel/flow.mjs, also printed by channel3/qa.mjs and techreel --stills; a planned jump is declared in
    window.TRANSITIONS = [[t0, t1, 'kind']], a tech topic's "transitions") (scripts/showreel/layout.mjs; the scene marks data-subject,
    data-band, data-hook, data-subs);
  - stills at every beat checked. All of it goes into the reel's review file. Re-render only for a real defect in the output.
  - Premium check (owner, 23 Nov 2026): the builder runs the same check as the critic (design/critic.md "Premium check": frontend-design +
    hyperframes skills, animation, cleanliness and premium feel out of 10 with frame times) on the stills before the one render, and writes
    the PREMIUM line in the review file. Under 7 on any of them: fix before the render.
  - References (owner, 23 Nov 2026): a reference reel from the owner's Inbox is studied with the reverse-any-video skill (.claude/skills/),
    producing a pattern card in design/references.md; a series style goes through style-sampling. Patterns, tweaked for our use; never the
    piece (design/safety.md rule 1). A reel that uses a card names it in its review file.
- Rulebooks are a gate (owner, 5 Nov 2026): design/rules-web.md, rules-c3.md, rules-tech.md, 5-8 hard rules each with the numbers behind
  them. Before the one render, every reel is scored rule by rule (pass / fail, one line each) in the stills review. A reel that fails a rule
  is fixed or its topic swapped. The daily audit adds, changes or drops a rule when the numbers say so (always with the number).
- Ownership (owner, 28 Oct 2026): Claude decides the topics, runs every check, renders and delivers; the owner watches and posts. The bar is
  the owner's: every reel feels premium, nothing looks broken, every spoken line is shown and finished (no half-relayed statement), and every
  reel teaches one concrete, useful thing. Claude reviews its own stills at every beat (no overlapping or clipped text, no empty frames, the
  hook fits, the cover shows the title) and checks the render's voice check and contact sheet before calling it ready. Advise the owner
  only on what Claude cannot do itself.
- External APIs and features: check the documentation, or the result of an earlier run, that the thing exists before building on it.
- Pushes: batch a change into one push; every push to a claude/ branch is merged and deployed by the pipeline. No follow-up pushes for things
  that could have been checked before the first one.
- Say the check you ran when reporting; if a check is impossible in the session, say so before acting, not after.
- Automate as we go (owner, 27 Oct 2026): any step done by hand twice becomes a script, check or workflow step in the same change that
  repeats it. The roadmap is in design/webin20sec.md, "Automation roadmap".
