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
2. Audit card FIRST (owner, 23 Nov 2026: a skipped audit went unseen; 25 Nov 2026: "it feels like I'm consuming keywords"): write and dispatch the card BEFORE
   building any reel (step 4). If the card cannot be written (no collect run, workflow failing), do NOT carry on silently: post "Audit skipped: <why>" to
   Owner answers `add` (the "Needs you" list) and continue with step 3 and 4. The app shows "Audit: skipped today" in amber after 12:00 IST with no card.
   **What you read (for you, never shown):** the latest "Instagram collect" run's AUDIT_CHANNELS, AUDIT_SIGNALS and AUDIT_CHECKS lines
   (scripts/audit-numbers.mjs; targets in design/targets.md). The run MUST act on every ALARM, ESCALATE, PROMOTE and DROP in them that same day, in the day's
   push: ALARM = a rulebook or playbook change; ESCALATE = a different topic type or format for the day's reel (not a tweak); PROMOTE = a rule in
   design/rules-<ch>.md; DROP = "What didn't" in design/playbook.md. Every reel's config carries its one experiment (`"experiment": {"id", "change", "vs": "median"}`)
   so its verdict prints by itself at 24 h and 72 h; its review file's item 1 scores the rulebook as "rule N pass|fail". Choose hooks and topics with
   AUDIT_SIGNALS' audience (countries, cities, onlineHoursIST) and its "early" line (a "slow start" is not a verdict until 24 h). Instagram collect also runs
   at about 10:53 IST; the early builds read the nightly numbers.
   **What you write (plain words only):** the card is at most 6 lines, dispatched with the "Audit card" workflow (kind audit, id audit-YYYY-MM-DD; format in
   scripts/post-card.mjs: `points` = the lines, no `channels` needed):
   1. One plain line on how the channels did yesterday, in words: "Web did well: 2,700 people saw it, above usual."
   2. One short line per channel (web, tech, Turns Out): what happened, why we think so, what we change today. Start the change with "Change:".
   3. A last line: anything that needs the owner, as ONE action, or "Nothing needs you today."
   Never on the card: ALARM, ESCALATE, PROMOTE, DROP, median, OQA, P1, run numbers, rule codes, branch names, tool names. A number is allowed only with what it means and
   "usual" next to it (usual = that channel's recent typical post). Followers, how many people saw it, how long they watched are the words to use.
   Example card:
   - "Web did well yesterday: about 2,700 people saw it, above usual. Tech and Turns Out were quiet."
   - "Web: the tab-wiggle fix was easy to see at a glance, and people watched most of it. Change: today's reel shows the broken thing moving in the first second."
   - "Tech: 140 people saw it, below usual. It opened with a claim, and viewers left in the first 3 seconds. Change: today opens on a question you can answer in one word."
   - "Turns Out: 260 saw it, about usual. Nothing to change yet, too few posts to tell."
   - "Nothing needs you today."
   The card replaces itself if the same day's id is sent again. In the repo only ONE line a day stays: the lesson in design/experiments.md "Results log".
3. Update the rulebooks (design/rules-web.md, rules-c3.md, rules-tech.md) when the numbers say so: add, change or drop a rule, with the number.
4. Build that day's reels (learn-then-build, nothing ahead), @webin20sec and @techin20sec, one each, both for 13:00 IST, in the eight steps of "Fable decides" below. Each is scored
   against its rulebook in the stills review before its ONE render; then reel-status. Every reel passes the Mandatory Gate with its review
   file (item 13 after reel-status), and each channel logs its one craft improvement in design/craft-log.md (design/runbook-reels.md).
   Tech (owner, 22 Nov 2026, the reset): pick the day's format (xray, showdown, quickmyth, indiapick) and device class (audio, camera,
   wearables, laptop, home, car, phone, charging) so neither repeats the day before and battery / charging comes at most once a week; write
   both into the captions entry ("format", "device"; npm run check enforces it) and meet the Detail bar and audience pull (rules-tech.md D, P).
   Turns Out keeps its own scheduled task (09:11 IST for the 13:00 reel), under the same rulebook gate (design/channel3.md, "Channel brief").
5. One lesson line in design/experiments.md "Results log" (`- DD Mon: lesson`), in the same push as the day's first reel.

## Fable decides: the build steps for web and tech (owner chat, 25 Nov 2026)
Step 4 above (build the day's web and tech reels) runs in these eight steps. Sonnet does the work, Fable makes the three calls that matter
(what to make, whether the stills are good, whether it beats gold). The Turns Out task keeps its fixed design order and does not use steps 1-2.
Stage board: `node scripts/stage.mjs <channel> <stage> ...` at each step as before.
**Sessions and models (the run starts them itself; nothing is pasted by the owner).** Each call is a child session made with `create_session` (same environment as
this run), one task, one channel, one at a time; its result comes back as the reply or the pushed file. Settings:
- Research re-check (step 1), build (steps 3-4, 6), style record (step 7): `model: "claude-sonnet-5-5"`, tag `build`.
- Pick (step 2), stills check (step 5), critic (step 8): `model: "claude-fable-5-2"`, tag `pick` / `stills` / `critic`.
- If a Fable call hits a limit or fails to start, make the same call with `model: "claude-opus-5-5"` (same prompt) and say so in the review file; never skip the call.
- The prompt names the task, the files to read (the pick sheet, the direction card, the stills sheet, the gold contact sheet, design/critic.md) and the one
  line to write back. A child that cannot push gives its verdict in its reply; the builder copies it into the file (as the critic did on 24 Nov).
- Nobody approves their own reel: the critic is never the builder's session.
**25 Nov 2026 only:** tech is already built (showreel-tech-storage-gap, postOn 25 Nov 15:00). If its critic verdict is READY, build web only today. If it is NOT READY, build a fresh tech
reel today from design/topic-bank.md (steps 1-8, the first KEEP of the tech list; the 25 Nov tech list is empty, so use the 26 Nov tech options), set its postOn to 25 Nov, postAt inside the 13:00-21:00 IST window, and post it today.
1. **Options, re-checked (Sonnet).** Take the day's 10 options from design/topic-bank.md (5 web, 5 tech; `node scripts/pick-sheet.mjs --day "26 Nov"`).
   Re-read the source links of the top 5 (the two marked PICK per channel plus the next best) and fix any fact that changed. Add a line "re-checked
   <date>: same | changed: what" under each of the 5. If the bank has no options for the day, the research pass (spare night, or Sonnet on the spot)
   writes them first, in the bank's format.
2. **Fable picks.** One short Fable call on the pick sheet only (`node scripts/pick-sheet.mjs`, about one screen; do not paste the bank). It answers one line
   per channel: `KEEP <ids in the order to use>` and `REJECT <ids>`. Keep one or more; the reel uses ONE at a time, the other kept ones wait for
   later days and need a re-check the morning they are used. Log the answer in design/pick-log.md (line format in that file).
3. **Build from gold (Sonnet).** `node scripts/starter.mjs <web|tech> <slug>`. It copies the gold look (light, framing, type sizes, shot rhythm, cuts, motion,
   sound) and never the hero object: the gold reel's phone, card or cable does not appear; the new topic brings its own hero, drawn new.
   The captions.json entry carries the "style" record (design/what-works.md "Style record"); the fields are planned now and re-measured from the MP4 after the render.
4. **Direction card and stills (Sonnet).** Fill review/<channel>/<name>.direction.md (design/direction.md) before the build, then render the stills
   sheet (one stills sheet, one contact sheet per reel). Text checks before looking at frames.
5. **Fable checks the stills, once.** One Fable call with the stills sheet, the direction card and the gold contact sheet; it writes the APPROVED line
   in the card file or lists what to change (one fix round at most, by Sonnet, then the render). A Fable check that finds the reel a copy of gold's hero or flatter than gold sends it back to step 3 once.
6. **Render (Sonnet), at most 2 times** on GitHub, as design/runbook-reels.md "Preflight" says. A second render only for a real defect.
7. **Output QA** runs on the final MP4 (every FAIL = NOT READY), then the style record is measured:
   `node scripts/reel-fetch.mjs <name> reel-files && node scripts/style-measure.mjs reel-files --names <name> --write`.
8. **Fable critic**, a different session from the builder, tag critic, side by side with gold (`python3 scripts/qa/side-by-side.py`). It writes
   CRITIC: READY only if all four are yes: as rich as gold; not a copy of it; would stop a scroll; would be watched twice. Anything else is NOT READY and the reel is skipped for the day
   (two renders used) or fixed once (a render left).

Rejection watch: `node scripts/pick-sheet.mjs --log` counts the options Fable rejected on each of the last two logged days. At 8 or more rejected
of the 10 on both days, the research of the options moves from Sonnet to Opus until a day passes with 3 or fewer rejected; write the switch
and the day in design/pick-log.md. Fable budget (CLAUDE.md "Sessions"): the pick and the stills check are short calls (one sheet each) inside
the daily Fable allowance; if Fable hits a limit, Opus does that call.

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
