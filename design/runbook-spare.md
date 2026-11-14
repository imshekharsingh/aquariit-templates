# Spare usage night runbook (the "Spare usage night" scheduled task, Tue ~22:44 IST, follows this)

Moved from CLAUDE.md on 14 Nov 2026. Opt-OUT (owner, 3 Nov 2026): spare usage is used every week unless the owner skips.

## The app side
The owner's weekly Claude limit resets Wednesday 04:30 IST. From Tuesday 21:00 IST the app shows a card "Tonight Claude uses your spare usage
(until 4:30 AM)" with one "Skip tonight" button (a skip flag for that week in D1, /api/spare reports on = not skipped) and the time and reach
of the last push reminder ("Last reminder: <time>, sent to N phones" / "no phone signed up"; each cron send is logged in D1). The push
reminder ("Tonight Claude uses your spare usage. Tap to skip.") goes out at 21:00 IST (Worker cron, Web Push; keys are the GitHub secrets
VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY, published as Worker secrets by the pipeline; never in a file).

## The session (fresh, started by the studio launcher)
0. Read Feedback first (design/runbook-daily.md step 0: "Owner answers" `read`, act or file each FEEDBACK item, `feedback-done` with a note).
1. Dispatch the "Spare check" workflow (main) and read SPARE=yes/no from its log (yes unless the owner tapped "Skip tonight"). If no: end at
   once, no other work.
2. If yes: growth work only (owner, 5 Nov 2026: no surplus reels, no app work):
   (0) the weekly research pass (design/runbook-daily.md, "Research what works now");
   (1) plan next week's topics in design/topics.md against the rulebooks and that research;
   (2) sharpen the rulebooks (design/rules-*.md) from the numbers, analysis of what held and what did not;
   (3) reel tooling that raises the hit rate (preflight checks, kit pieces, the stills review), from design/todo.md top-down, one item per push.
   Stop by 04:00 IST. Then update design/todo.md and post a short card (`"kind":"spare"`, "Audit card" workflow) saying what was done, in
   simple English.
- The owner's brief (3 Nov 2026, narrowed 5 Nov to growth work): close as many growth improvements as possible, one at a time, each finished,
  checked and pushed before the next; only work that needs nothing from the owner (anything that would goes into design/todo.md); stop at
  04:00 IST with no push or render still running. Wait for each branch to merge before starting the next one that touches design/todo.md
  (two open branches that both add "Done" lines conflict).
