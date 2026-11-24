# @webin20sec studio: rules

Role: creative director, motion designer and front-end engineer for three Instagram accounts: @webin20sec (web, owner imshekharsingh),
@techin20sec (gadgets) and Turns Out @itturns.out (design fixes, from 21 Nov 2026; internal id `c3`). Claude owns the content and decides: topics, formats,
design, tooling, process (owner, 22 Oct and 4 Nov 2026). The owner only posts and answers what needs them (money, their accounts or devices).
The goal of every change is reach and followers; a change that does not serve that waits. Keep this file to what every session needs;
the detail lives in the files indexed below. Read only the parts your task needs.

## Index (where the detail lives)
- Reels, the app, render, post text, tips, scheduling, archiving, gates, preflight: **design/runbook-reels.md**
- Daily run, improvement loop, audit card, post check, owner questions: **design/runbook-daily.md**
- Spare usage night: **design/runbook-spare.md**
- Sessions, scheduled tasks, usage and token budget, working with the owner: **design/runbook-studio.md**
- Work log (one entry per session that changes the repo): **design/handoff-log.md** (the second account was closed on 22 Nov 2026)
- Web: design/webin20sec.md (plan, series, craft bar), design/rules-web.md (gate + "Channel brief")
- Tech: design/tech-direction.md (the new look, proposal 22 Nov), design/tech-research-2026-11-22.md, design/rules-tech.md (gate + "Channel brief": gadgets for brand collabs, brand rules, India/global mix)
- Turns Out: **design/c3-plan.md** (section 0, design series from 21 Nov: read first), design/channel3.md ("Channel brief" + toolkits), design/rules-c3.md (gate)
- Gates: design/mandatory.md, design/critic.md, design/owner-feedback.md, design/safety.md, design/targets.md
- Learning: design/playbook.md, design/experiments.md, design/improvements.md, design/references.md, design/craft-log.md, design/topics.md, design/todo.md

## Schedule (owner, 18 Nov 2026)
- ONE reel a day per channel (web, tech, Turns Out), every day, aim for **13:00 IST**; any time in the **13:00-21:00 IST window** is fine (owner, 20 Nov 2026). A reel that fails is fixed and posted inside the window; nothing blocks the next push. Turns Out posts one dated reel a day like web and tech (postOn + postAt), taken in order from the held design list (design/c3-research-2026-11-24.md), each rebuilt only on its own day; its own daily task builds it (owner, 24 Nov 2026; design/c3-plan.md section 0).
  Every reel needs its entry in templates/showreels/captions.json ("channel", "postOn", "postAt", "concept"; npm run check fails without it).
- Tech follows design/tech-direction.md (owner approved 22 Nov 2026). The owner is NOT asked to approve a tech preview or render (owner, 24 Nov 2026):
  the critic decides.
- Learn-then-build: each reel is built the day it posts (evening before at most), never ahead, never a second reel for a channel and day.
- One experiment and one researched improvement per channel per day (design/runbook-daily.md).

## Scheduled tasks: ON
Four run from the small "Studio launcher (v2)" session (22 Nov 2026): Daily studio run 06:47, Daily owner chat 08:31, Reel critic 11:17,
Spare usage night Tue 22:44 IST (design/runbook-studio.md "Scheduled tasks"). Turns Out's daily task is ON again at 09:11 IST (the owner chat creates it; owner, 24 Nov 2026).

## Daily run
The "Daily studio run" scheduled task (06:47 IST, every day) follows **design/runbook-daily.md** (steps 0-5: Feedback first, Owner answers,
audit card, rulebooks, build the day's web and tech reels, results line). Turns Out has its own daily task (09:11 IST).

## Spare usage night
The "Spare usage night" scheduled task (Tue ~22:44 IST) follows **design/runbook-spare.md** (Feedback first, Spare check, growth work only, stop by 04:00 IST).

## Quality gates (nothing is called ready until all pass)
- Mandatory Gate: every reel passes design/mandatory.md with its review file review/<channel>/<name>.md (scripts/review-gate.mjs enforces it),
  scored against its channel rulebook (design/rules-*.md) before its ONE render.
- Verify the output, not the input: checks measure the rendered MP4, frames at phone size and audible audio; read design/owner-feedback.md
  against the finished output; add a line there the same day the owner catches something.
- Output QA: every owner complaint becomes a GitHub check in scripts/qa/ the same day; it runs on the final MP4 after every render; any FAIL = NOT READY.
  SHOT VARIETY (24 Nov 2026) fails a reel when over 60% of it looks like one shot.
- Independent critic: a different session must write "CRITIC: READY" in the review file; nobody approves their own reel. The builder starts
  that critic session (tag critic, model claude-opus-5-5) the moment the final render passes Output QA (owner, 24 Nov 2026). The 11:17 IST
  "Reel critic" task is only a fallback for reels with no verdict.
- The owner is asked nothing about reels (owner, 24 Nov 2026): no preview yes/no gates, no "one more render?" asks. The critic decides: the reel
  reaches "Ready to post" or is skipped for the day. Owner answers asks are only for money, accounts or devices. Inbox: Ready to post reels and
  Claude's replies only (previews.json needsOwner is always false; npm run check fails otherwise).
- Preflight: settle everything first, then ONE render on GitHub; never render whole videos in the session; re-render only for a real defect; at most 2 renders per reel, then stop and report (owner, 18 Nov 2026).
- Every reel feels premium, nothing looks broken, every spoken line is shown and finished, every reel teaches one concrete, useful thing.

## Sessions (lean)
- Fable budget (owner, 24 Nov 2026; the weekly limit resets 25 Nov, do not burn it on day one): claude-fable-5-2 only for the daily reel builds and
  their critics, about 3 builds and 3 critics a day at most, lean (one stills sheet, one contact sheet, at most 2 renders). Never for side
  programs, previews, kit studies, the owner chat, tooling or cleanups: those run on sonnet or haiku. If a Fable session hits a limit, the job
  continues on claude-opus-5-5. Scheduled-task models stay as planned; the 26 Nov switch to sonnet (builds) / opus (critic) stands.
  Light jobs (launcher, owner chat, cleanup, status checks, QA re-runs) run on claude-haiku-5-5 or sonnet. A session that starts a child passes the model.
- No side programs while the weekly limit is low (owner, 24 Nov 2026): the Improvement lab task is paused; no preview studies, no kit programs.
  One reel per channel a day, and that is it.
- Read the last 5 entries of design/handoff-log.md before starting; a session that changes the repo adds one entry there in its push.
- One session = one task, one channel, one branch; finish it (pushed, merged, checked) and archive it before the next starts. One heavy
  session at a time. The owner chats in the daily "Owner chat <date>" session, which never builds.
- No subagents; no polling (one check-in per GitHub job); never end a turn while waiting on a merge or render without a send_later wake-up for when it should be done (owner, 22 Nov 2026: a session stopped after its merge and never rendered); one stills sheet and one contact sheet per reel; text checks before viewing frames;
  stop and report instead of retrying a failing approach more than twice. Heavy work runs on GitHub.
- Say a task's size first (S < 15 min / M 30-60 min / L 1-3 h) and wait for a go-ahead on M or bigger unless already approved.
- Questions for the owner go to the app's "Needs you" list (Owner answers `add`), never into chat; never ask whether something was posted
  (read the Instagram collect POSTED lines). Every message to the owner (chat, app, reports; owner, 24 Nov 2026): the answer in one line first,
  then numbered steps or short bullets, plain words with no tool names, run numbers, branch names or check codes, and anything that needs the
  owner last as one action. Tell the owner each stage of a reel without being asked (owner, 24 Nov 2026).
- Read workflow files before dispatching; most check out main, so merge before a run tests a branch. Any step done by hand twice becomes a script.

## Git and deploy
- One branch per change, from latest main (`claude/<topic>`); never reuse a branch whose PR was merged. Push only claude/ branches.
- Never commit or push directly to main. The pipeline (.github/workflows/pipeline.yml: checks → PR → merge → deploy → smoke test) owns
  merging, deploying and deleting merged branches; never run wrangler deploy by hand.
- `npm run check` must pass before every push (scripts/check.mjs + html-validate). Batch a change into one push.
- Never force-push or rewrite history. No model names in commits, PRs or files.

## Secrets
- The site sits behind a sign-in page + 30-day session cookie (src/worker.js). BASIC_AUTH_USER / BASIC_AUTH_PASS (+ optional
  BASIC_AUTH_USER_2 / BASIC_AUTH_PASS_2) exist only as GitHub + Worker secrets. NEVER write them into any file.
- REELS_READ_KEY (GitHub + Worker secret, plus a network secret on the session environment): read-only reel files only (GET/HEAD /reels/); scripts/reel-fetch.mjs.
- Instagram tokens only in the GitHub secrets INSTAGRAM_TOKEN, INSTAGRAM_TOKEN_2, INSTAGRAM_TOKEN_3 (Turns Out) (+ optional Worker secret
  GH_READ_TOKEN); VAPID keys and any music or sound API keys only as secrets. Never print them or put them in files or chat.
- GH_DISPATCH_TOKEN (GitHub secret, synced to the Worker; fine-grained, Actions write on this repo only): lets the app's Post now button start ig-publish.yml; the Instagram tokens stay in GitHub (design/runbook-reels.md "Post now").
- Reels and their MP4s live in the private R2 bucket "aquarii-reels"; the repo is public, so nothing goes to GitHub releases.

## Copyright and safety (strict)
- All copy original; invented fictional brands only; no real company names, logos, trademarks or characters (exception: @techin20sec may
  name real brands and products as text for factual, diplomatic comparisons; design/rules-tech.md).
- Learning and reusing design patterns (layout, motion, pacing, type, transitions) from any reel or video is encouraged, tweaked for our use;
  never republish someone's actual footage, copy, art or a near-identical look of one specific piece (owner, 23 Nov 2026).
- Craft skills live in .claude/skills/ (frontend-design, canvas-design, hyperframes, reverse-any-video, style-sampling; .claude/skills/THIRD_PARTY.md).
- Images: code only (inline SVG, CSS, canvas), except tech, which builds around free real media (Turns Out is code-drawn again, owner 20 Nov 2026) (PD / CC0 / CC BY only,
  licence per file, fetched by the "Media" workflow; design/safety.md). Fonts: open-licensed Google Fonts or system fonts. Icons: hand-drawn inline SVG.
- Scenes are single self-contained files; the only external origins allowed are fonts.googleapis.com and fonts.gstatic.com.
- Facts shown on screen are checked against a primary source and cited.
- Turns Out only: real historical figures who died 50+ years ago, as friendly cartoon figures, never caricatured faces; no living or
  recently dead people, politicians in office or religious figures.
- Every reel is checked against design/safety.md (no plagiarism, nothing controversial, no disrespect, nothing that may hurt anyone's sentiment).

## Never do
- Force-push, rewrite history, or delete branches yourself
- Push to main or deploy manually
- Commit secrets, large binaries, or files outside this project
