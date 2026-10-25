# Parked: more channels, less Claude time (owner, 25 Oct 2026)

Status: **parked** until the audits show the existing accounts at a stable level. Come back to it then; nothing here is being built yet.

## The idea
Claude keeps the thinking (topics, research and fact checks, script and hook, post text, weekly strategy). Everything that is
machine work runs on GitHub: rendering, quality checks, scheduling, the audit numbers, and later the posting.

## Where Claude time goes today (24-25 Oct)
1. A hand-written scene per reel (springs.html, inp.html), then fix-and-re-render rounds. The biggest cost.
2. Visual checks: stills, contact sheets, audio measurements.
3. Watching runs: waiting, reading logs, retrying.
4. The daily audit as a Claude session (about $0.5-0.9 each), mostly arithmetic.

## The route
1. One engine, one topic file per reel (as techreel/ does). Nº 01/02's look becomes a theme; new scene kinds are written once and reused.
2. Automatic QA on GitHub (text overflow, blank stretches, loudness, voice length, phonemes) that fails the run; the owner glances at the contact sheet in the app.
3. A topic queue: Claude writes a week of topic files in one sitting; a scheduled workflow renders one a day into the app.
4. The audit as a script: numbers, medians, deltas and the milestone written by GitHub; Claude reads a weekly summary.
5. Channels as profiles (look, length, aspect, caption rules, hashtag limits, handle): one topic file renders every format in parallel;
   the app gets a tab per channel.

## Expected effect (estimate, not measured)
Claude time per reel from 1-2 h of building and debugging to a 15-20 min writing pass.

## Limits
- A shared engine is more consistent and less bespoke; new scene kinds still need Claude now and then.
- Automatic checks catch defects, not taste; a human or Claude glance stays.
- Auto-posting is its own project per platform (official APIs, account setup and app approval, credentials as GitHub secrets).
  Start semi-automatic (the owner posts from the app).

## Open questions for the owner
1. Which channels, in what order?
2. The same reel per channel, or different angles per channel?
3. Auto-post eventually, or always posted by the owner?
