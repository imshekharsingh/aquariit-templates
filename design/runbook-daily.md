# Daily run runbook (the "Daily studio run" scheduled task, 06:47 IST, follows this)

Moved from CLAUDE.md "Daily run", "Daily improvement loop" and "Accounts and data" on 14 Nov 2026. A fresh session, lean, no subagents,
in this order:

Stage board (owner, 24 Nov 2026): at every stage change of a reel build (research, topic, build, stills, video, checking, ready or skipped) run
`node scripts/stage.mjs <channel> <stage> --model <name> --line "plain words"` (design/runbook-reels.md "Live studio board"). Never blocks work.

0. Feedback first (owner, 11 Nov 2026): the "Owner answers" `read` prints the app's new Feedback items as FEEDBACK lines (id, time, channel,
   text). Act on each new item that day, or put it in design/todo.md with a date, then move it along with `feedback-done`
   (message flow, owner 24 Nov 2026: Received > Reviewed > In progress > Done > Closed): when you have read it `{"ids":[..],"flag":"reviewed","by":"fable"|"opus"}`,
   when you start `{"ids":[..],"flag":"in_progress"}`, when finished `{"ids":[..],"note":"action report","proof":"check name"}` (or `"image":"<base64 JPEG/PNG under 400 KB>"`; a Done needs a proof).
   The app shows the flag, the report and the proof under the item; the owner Closes it (it leaves the app) or Reopens it with a note (it comes back as a new item). Every run reads it first: the daily run, the Turns Out run
   and the spare-usage night.
   References (owner, 20 Nov 2026): dispatch "Owner answers" `refs` too: REF lines (link, file, note, channel) and a "B64 ref-<id>.jpg" preview per
   file (`node scripts/media/from-log.mjs <run id> <dir>` makes the files). Study each into design/references.md (reverse-any-video skill: a pattern card,
   patterns tweaked for our use, never the piece; owner, 23 Nov 2026), then `refs-done` with `{"ids":[..],"state":"studied","note":"the report: what was taken","checklist":["3-8 short lines the owner marks Keep / Skip / Ask"],"stills":["up to 8 JPEG paths"]}` (owner, 24 Nov 2026; the `refs` read also prints REFCHECK / REFASK lines: honour Keep and Skip, answer each REFASK with `"replies":[{"item":n,"text":"..."}]`) (`"used"` + the reel name once a reel uses it).
1. Dispatch "Owner answers" with action `read` (the same dispatch as step 0), act on each ANSWER line, then `clear` the ids acted on.
2. Audit card FIRST (owner, 23 Nov 2026: a skipped audit went unseen): write and dispatch the card BEFORE building any reel (step 4). The app shows
   "Daily report: done at HH:MM · web ESCALATE, tech OK · n changes" on Today (card lines "ESCALATE web" / "OK tech" and points starting
   "Change: ..." feed it; the same-day card id is audit-YYYY-MM-DD) and "Audit: skipped today" in amber after 12:00 IST with no card. If the card
   cannot be written (no collect run, workflow failing), do NOT carry on silently: post the reason to Owner answers `add` (the "Needs you" list)
   as "Audit skipped: <why>" and then continue with step 3 and 4. Numbers:  from the latest "Instagram collect" run's AUDIT_CHANNELS line, plan from its AUDIT_SIGNALS line, add only the lesson;
   dispatch "Audit card" (kind audit). Results checks (owner, 7 Nov 2026): the card MUST lead with the run's AUDIT_CHECKS lines
   (scripts/audit-numbers.mjs, targets in design/targets.md): "ALARM/OK <ch>" (last 7 reels vs target and best window), "ESCALATE <ch>"
   (ALARM two days running), "EXPERIMENT ... → WIN | LOSE | TOO EARLY" and "PROMOTE / DROP", and the RULE lines flagged "question it". The
   run MUST act on every ALARM, ESCALATE, PROMOTE and DROP that same day, in the day's push, with the numbers: ALARM = a rulebook or playbook
   change; ESCALATE = a different topic type or format for the day's reel (not a tweak); PROMOTE = a rule in design/rules-<ch>.md;
   DROP = "What didn't" in design/playbook.md. The card says what was checked and what changed. Every reel's config carries its one
   experiment (`"experiment": {"id", "change", "vs": "median"}`) so its verdict prints by itself at 24 h and 72 h, and its review file's
   item 1 scores the rulebook as "rule N pass|fail" (the RULE lines read it).
   Choose hooks and topics with AUDIT_SIGNALS' audience (followersTop/reachedTop countries and cities, onlineHoursIST: the reels have a
   global audience and followers arrive at night) and its "early" line (reach ~6 h after posting vs ~24 h later): a "slow start" is not a
   verdict until its 24 h reading; a "late climber" topic is a keep. Instagram collect also runs at about 10:53 IST (GitHub often starts it
   hours late); the 06:47 and 09:11 builds read the nightly numbers, the same-morning run feeds the next day (the PROBE lines in its log say
   which Instagram metrics each account offers).
3. Update the rulebooks (design/rules-web.md, rules-c3.md, rules-tech.md) when the numbers say so: add, change or drop a rule, with the number.
4. Build that day's reels (learn-then-build, nothing ahead), @webin20sec and @techin20sec, one each, both for 13:00 IST. Each is scored
   against its rulebook in the stills review before its ONE render; then reel-status. Every reel passes the Mandatory Gate with its review
   file (item 13 after reel-status), and each channel logs its one craft improvement in design/craft-log.md (design/runbook-reels.md).
   Tech (owner, 22 Nov 2026, the reset): pick the day's format (xray, showdown, quickmyth, indiapick) and device class (audio, camera,
   wearables, laptop, home, car, phone, charging) so neither repeats the day before and battery / charging comes at most once a week; write
   both into the captions entry ("format", "device"; npm run check enforces it) and meet the Detail bar and audience pull (rules-tech.md D, P).
   Turns Out keeps its own scheduled task (09:11 IST for the 13:00 reel), under the same rulebook gate (design/channel3.md, "Channel brief").
5. One lesson line in design/experiments.md "Results log" (`- DD Mon: lesson`), in the same push as the day's first reel.

## Daily improvement loop (owner, 7 Nov 2026)
Claude is social media manager, design manager and product manager; content, design, sound, growth, audience, product, process, cost and
research are all Claude's to improve every day without waiting to be asked. The owner only posts, and answers what needs them.
- Every daily run (and each Turns Out run) picks ONE small experiment per channel from the numbers and the rulebook: a topic angle, hook,
  motion or transition, sound, caption or hashtags. Only one change at a time, so the result can be read.
- Results go into design/playbook.md: "What works" (combinations that won, with their numbers) and "What didn't" (dropped, with numbers).
  Every reel starts from its channel's current "What works" combination. A change that wins 2 out of 3 tries becomes a rule in the channel
  rulebook; one that loses twice is dropped.
- The audit card adds one line per channel: "Today's experiment: X. Yesterday's: Y → result."
- One researched improvement per channel per day (owner, 13 Nov 2026): every day's web, tech and Turns Out reel carries ONE visible
  improvement taken from what is working now on Instagram Reels or YouTube Shorts in that niche (hook pattern, motion, layout, pacing, sound,
  caption, format). Source: the next unused item for that channel in design/improvements.md (each item: date found, source link, the
  technique, why it should help reach, which kit piece). If a channel has no unused item, the run does 2-3 quick web searches for that niche
  first and adds 3 items. The weekly research pass refills 7 items per channel. The reel's review file and design/craft-log.md name the item
  applied; the audit card says "Today's improvement: X (source)". Techniques only, never a copy.
- Research what works now (owner, 11 Nov 2026): once a week (spare-usage night, design/runbook-spare.md) a research pass with web search on
  short-form video design gaining reach right now for each channel's niche. Keep only what is backed by evidence (numbers, platform
  guidance, repeated across sources), write each finding in design/references.md ("R-trend: ..." with source and date, techniques, kit piece
  or MISSING), turn the best one or two into next week's experiments (design/experiments.md + design/topics.md), drop findings that do not
  fit our copyright rules.
- Learn from every reference (owner, 11 Nov 2026): each reel the owner shares as a reference gets an entry in design/references.md the same
  day (what it showed, its techniques as a checklist, the kit piece that covers each or MISSING). Each MISSING technique becomes a kit piece
  or a dated line in design/todo.md. A reel's review file names the reference techniques it uses (e.g. "R5: KM.curveGraph").

## Audit card, post check and owner questions
- Daily audit (owner, 1 Nov 2026): the full audit is a CARD in the app: dispatch the "Audit card" workflow on main with input `card` = JSON
  `{"kind":"audit","day":"YYYY-MM-DD","points":[today's points],"channels":{"web":[...],"tech":[...],"c3":[...]}}` (format in
  scripts/post-card.mjs; short bullets, numbers first, simple English; per channel the last 7 days: followers, reels with reach, avg watch,
  saves, shares, pattern used, best reel). The numbers are computed nightly on GitHub (scripts/audit-numbers.mjs, the "Audit numbers" step of
  the latest "Instagram collect" run): use its AUDIT_CHANNELS line as "channels" and add only the lesson. AUDIT_CHANNELS also carries, per
  channel, the last 7 reels' hold %, skip % in 3 s, saves and shares per 1,000 reached, and the account's 7-day discovery (non-follower share
  of reach, follows per 1,000 reached); the REEL lines give the same per reel (owner, 11 Nov 2026). Keep both on the card. The same day's id
  replaces the card; the owner's "Mark read" deletes it. In the repo only ONE line a day stays: the lesson in design/experiments.md
  "Results log". The full report never goes into the repo or chat.
- Cards (owner, 5 Nov 2026): only the daily audit, the spare-night summary and anything that needs the owner. Fixes and tooling are applied
  without a card.
- Post check (owner, 7 Nov 2026): Instagram collect also runs a light post check about 40 minutes after the posting slot (13:43 IST) and at
  23:43 IST (input `post_check` to run it by hand; latest 5 posts per account, auto-marked at Instagram's time). Its log has one line per
  reel due today: "POSTED web: showreel-29-flash at 19:04 IST (marked)" or "NOT POSTED web 19:00: showreel-29-flash". Sessions read these
  lines (latest Instagram collect run) to know what went out; never ask the owner whether something was posted.
- Owner answers asks are only for money, accounts or devices (owner, 24 Nov 2026); never about a reel, a preview or a render.
- Questions for the owner (owner, 1 Nov 2026) go into the app's "Needs you" list, never into chat: dispatch "Owner answers" (main) with
  action `add` and `asks` = `[{"id":"short-id","question":"plain English","why":"why it matters","kind":"yesno|done|text","channel":"web|tech|c3"}]`
  (format in scripts/asks.mjs).
- The "Instagram collect" workflow reads all three accounts nightly and at about 10:53 IST.
