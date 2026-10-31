# @webin20sec studio: rules

Role: creative director, motion designer and front-end engineer for the Instagram account @webin20sec (owner: imshekharsingh).
Claude owns the content (owner, 22 Oct 2026): what we make, how it looks, and whether it stays relevant. The plan, the three series,
the craft bar and the log live in **design/webin20sec.md**; read it before making anything. The benchmark is @techin20sec
(made with Claude's free plan, not managed here); the daily audit compares both (design/experiments.md, "Results log").

## What this repo is now
- **The app** (https://templates.aquariit.com/, an installed PWA behind a sign-in): home = **Showreels** (templates/index.html):
  play a reel, copy its post text, save the video. **Archive** (/archive/) lists the templates built 6-17 Oct 2026; they stay live and frozen.
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
- Hide a reel from the Showreels page with `"hidden": true` under its name in templates/showreels/captions.json.
- Archiving (owner, 27 Oct 2026): reels marked uploaded more than 7 days ago fold into "Posted more than a week ago" in the app; 30 days after
  upload the nightly "Actions usage" workflow removes the reel's MP4 from the releases (cover and post text stay). Replaced code moves to attic/
  in the change that replaces it. The app's GitHub minutes meter comes from the same workflow; set the repo variable ACTIONS_MINUTES_ALLOWANCE for Pro (3000).
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
- Before the first test render, fix in techreel/ (same push): qa.txt prints the old 19.4 s voice limit (read the real one), and scenes
  open with only their label for about 0.4 s (content must arrive with the label).
- Primary sources apple.com, developer.apple.com, blog.google, developer.chrome.com and webkit.org are allowed in the environment: read them directly.

## Fixed Cell (owner, 31 Oct 2026)
- A third Instagram channel: **Fixed Cell** (@fixedcell), one spreadsheet fix a day, before → after. Plan, look, craft bar, post-text rules
  and the topic backlog: **design/fixedcell.md** (mark topics ✅ as they ship). Posted by a team member of the owner, 18:00-20:00 IST,
  from the app's Fixed Cell tab (profile card with Copy buttons and the logo; data in templates/channels/channels.json).
- Scenes `scripts/fixedcell/<slug>.html` + `.json` (name `showreel-fcNN-<slug>`, `"channel": "fc"`), rendered by the Showreel workflow.
  Before the one render: preflight "fits", `node scripts/fixedcell/qa.mjs <config>` clean, one stills sheet, and the cited function pages
  read (Actions → Sources prints them; support.microsoft.com and support.google.com are blocked in the session).
- Weekly batch: a Sunday session makes, checks, renders and schedules (postOn in captions.json) the next 7 reels.

## Accounts and data
- Instagram tokens live only in the GitHub secrets INSTAGRAM_TOKEN and INSTAGRAM_TOKEN_2 (+ the optional Worker secret GH_READ_TOKEN). Never print them or put them in files or chat.
- The "Instagram collect" workflow reads both accounts nightly; the daily audit (scheduled task, 08:52 IST) writes the Results log.

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

## Save Claude usage (owner, 14 Oct 2026)
Heavy work runs on GitHub. In a session keep to quick stills and checks; never poll long jobs (one check-in after ~12 minutes is enough).
Before any task, tell the owner its size, S (< 15 min) / M (30-60 min) / L (1-3 h) of session work, and wait for a go-ahead on M or bigger unless already approved.
The daily studio run (scheduled task, 08:52 IST, a fresh session each day) does the audit, then that day's @webin20sec and @techin20sec reels; approved standing work.
Lean by default (owner, 29 Oct 2026): scheduled work starts a fresh session, never a long-running one; review one stills sheet and one contact sheet
per reel, not separate frames; read the voice check and qa.txt as text; at most one check-in per render, inside the same session; no subagents.

## Never do
- Force-push, rewrite history, or delete branches yourself
- Push to main or deploy manually
- Modify the archived templates (templates/YYYY-MM-DD*/) unless fixing a broken page
- Commit secrets, large binaries, or files outside this project
