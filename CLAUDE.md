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
- **Reels**: one seekable scene per reel, `scripts/explainer/<slug>.html` exposing `window.seek(t)` (every frame a pure function of t,
  seeded randomness only), plus `scripts/explainer/<slug>.json` (name `showreel-NN-<slug>`, dur, fps 60, cover time, caption, 6+ keywords, exactly 5 hashtags).
- **Render**: always on GitHub (Actions, "Showreel" workflow, config = the json). The MP4, cover and contact sheet land in the "reels" release,
  the Showreels page lists them, and a "Showreel ready" issue carries the post text. Never render whole videos in the session.
- **Review**: Claude reviews stills at every beat itself before the render (see Ownership below); the owner reviews the finished reel. Fix what the stills show first.
- **Post text**: one block the owner copies whole, no labels: caption, a blank line, the first 6 keywords joined by " · ", a blank line, the 5 hashtags.
  Keywords and hashtags are chosen for reach (what people search for this kind of reel, most specific first, niche tags only).
- Reels end on the reel itself: no brand card, sign-off or call to action in the video (owner, 21 Oct). Captions may invite a save or a send.
- Every @webin20sec reel config carries a "tip" block (title, why, code, demo, source, reel link once posted) with its live demo in
  scripts/tips/demos.mjs: it becomes an entry on the public page /tips/ (scripts/build-tips.mjs; npm run check fails if the page is stale).
  /tips/ is the only public path (src/worker.js PUBLIC): static, no data, no API calls.
- Scheduling is the same for every channel (owner, 2 Nov 2026): each reel (scripts/explainer, scripts/channel3, techreel/topics as `showreel-tech-<slug>`)
  gets a templates/showreels/captions.json entry with "channel" (web / tech / c3), "postOn" (the IST day it should go out, chosen when it is made,
  e.g. a reel made the evening before for tomorrow says tomorrow) and "concept", in the push that makes it; npm run check fails without it.
- Hide a reel from the Showreels page with `"hidden": true` under its name in templates/showreels/captions.json.
- Archiving (owner, 1 Nov 2026; replaces the 7-day fold / 30-day rule): a reel marked uploaded leaves the main list at once for its channel's compact
  "Posted" list (cover, title, posted date, its numbers once the collector has them; no video). 15 days after upload the nightly "Actions usage"
  workflow removes its MP4 and review/contact-sheet PNG from the releases; caption/post text, sources, cover, config json, scene code and numbers stay.
  Replaced code moves to attic/ in the change that replaces it. The app's GitHub minutes meter comes from the same workflow; set the repo variable ACTIONS_MINUTES_ALLOWANCE for Pro (3000).
- `attic/` holds the retired tooling (films, recordings, kits, the daily-template routine). Nothing in it runs or deploys; don't build on it.

## Preflight: one render per reel, no blind runs (owner, 27 Oct 2026)
Every render, workflow run and push costs usage; a failed or repeated one is waste. Before any of them:
- Reels: script, pacing, hook and every visual fix are settled first, then ONE render. Run the local preview (`--fake-vo --stills` for techreel; `node scripts/showreel/preflight.mjs <config>` plus `node scripts/showreel/stills.mjs <config> <out>` for showreels, one sheet to review)
  and clear all of it: the PREFLIGHT voice line must say "fits", no "text wider than its box", and stills at every beat checked for empty frames.
  Re-render only for a real defect in the output.
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

## @techin20sec test, 31 Oct-6 Nov 2026 (owner, 30 Oct; overrides any daily-run instruction to pick "the freshest tech story")
- @techin20sec makes "Tech, explained in 20 s" reels, not news: design/webin20sec.md, "@techin20sec reels", has the brief and the pass/fail targets.
  The 6 Nov audit gives the owner the verdict (keep the format, or pause the channel).
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
  Posts DAILY 21:00-22:00 IST (owner, 3 Nov 2026); launched Sun 1 Nov with the 2.5D Eiffel reel (showreel-c3-eiffel-flow).
  Going daily: the cost test passed (Mon 2 Nov blue-sky reel, $4.08 of session usage, same quality), so Turns Out posts DAILY from Tue 3 Nov
  (owner). A scheduled task ("Turns Out daily reel", ~14:39 IST) asks the studio launcher to start a fresh session every day
  that builds THAT day's reel for 21:00 IST: new globally known true story, 2.5D kit, lean (one stills sheet, one render, no subagents, about $4),
  captions.json postOn = that day, and a "note" card in the app when it is ready. Logo: design/brand/accounts/turnsout-logo.svg (an amber arrow turning round a dark ring, TURNS OUT inside; the family look of the other two).
  The app's "Turns Out" tab has the profile card and the reels. Internal ids stay `c3` (scripts/channel3/, `showreel-c3-*`, `"channel": "c3"`).
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
  Scenes build their camera, layers, paper, figures and type from the shared kit scripts/channel3/kit25d.js; render with Showreel "parts" 1 (about 22 GitHub minutes).
  Before the one render: `node scripts/channel3/qa.mjs <config> --write` then clean, preflight says "fits", one stills sheet.

## Spare usage night (owner, 1 Nov 2026)
The owner's weekly Claude limit resets Wednesday 04:30 IST. From Tuesday 21:00 IST the app shows a card "Weekly reset at 4:30 AM. Spare usage
left?" with one "Use it" button (a flag for that week in D1, /api/spare) and sends a push reminder at 21:00 IST (Worker cron, Web Push; keys
are the GitHub secrets VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY, published as Worker secrets by the pipeline; never in a file).
A scheduled task (created by the parent session, not here) fires Tuesdays around 22:45 IST into the studio launcher, which starts a fresh session that:
1. dispatches the "Spare check" workflow (main) and reads SPARE=yes/no from its log. If no: end at once, no other work.
2. If yes: (1) build reels ahead so each channel has 2-3 days ready (same preflight rules, one render per reel); (2) plan next week's topics;
   (3) work design/todo.md top-down, one item per push; stop by 04:00 IST. Then update design/todo.md and post a short card
   (`"kind":"spare"`, "Audit card" workflow) saying what was done, in simple English.

## Accounts and data
- Instagram tokens live only in the GitHub secrets INSTAGRAM_TOKEN, INSTAGRAM_TOKEN_2 and INSTAGRAM_TOKEN_3 (Turns Out, @itturns.out) (+ the optional Worker secret GH_READ_TOKEN). Never print them or put them in files or chat.
- The "Instagram collect" workflow reads all three accounts nightly (slot 3 only once INSTAGRAM_TOKEN_3 exists).
- Daily audit (owner, 1 Nov 2026: the app shows the owner everything): every daily studio run writes its full audit as a CARD in the app, by
  dispatching the "Audit card" workflow on main with input `card` = JSON `{"kind":"audit","day":"YYYY-MM-DD","points":[today's points],
  "channels":{"web":[...],"tech":[...],"c3":[...]}}` (format in scripts/post-card.mjs; short bullets, numbers first, simple English; per channel the
  last 7 days: followers, reels with reach, avg watch, saves, shares, pattern used, best reel). The same day's id replaces the card; the owner's
  "Mark read" deletes it for good. In the repo only ONE line a day stays: the lesson, in design/experiments.md "Results log"
  (`- DD Mon: lesson`). The full report never goes into the repo or chat.
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
  never run wrangler deploy by hand. It deletes merged branches itself: never delete branches by hand.
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

## Save Claude usage (owner, 14 Oct 2026)
Heavy work runs on GitHub. In a session keep to quick stills and checks; never poll long jobs (one check-in after ~12 minutes is enough).
Before any task, tell the owner its size, S (< 15 min) / M (30-60 min) / L (1-3 h) of session work, and wait for a go-ahead on M or bigger unless already approved.
The daily studio run (scheduled task, 08:52 IST, a fresh session each day) does the audit (posted as a card in the app via the "Audit card" workflow, one lesson line in the Results log), then that day's @webin20sec and @techin20sec reels; approved standing work.
Lean by default (owner, 29 Oct 2026): scheduled work starts a fresh session, never a long-running one; review one stills sheet and one contact sheet
per reel, not separate frames; read the voice check and qa.txt as text; at most one check-in per render, inside the same session; no subagents.

## Never do
- Force-push, rewrite history, or delete branches yourself
- Push to main or deploy manually
- Commit secrets, large binaries, or files outside this project
