# Handoff: OPEN for one task (owner, 26 Nov 2026): 3D tech look sample v5

The owner runs this task from another Claude account. That session reads this file, does the task, and writes every stage in
"Progress" below (in its pushes). The main account's owner chat reads Progress; there is no other channel between the two.
When the task is done, the session marks it DONE here and the file goes back to CLOSED.

## Read first (only the parts you need)
CLAUDE.md; the last 5 entries of design/handoff-log.md; design/3d-kit-phase2.md; design/rules-tech.md (section L, rules D1-D8).
Never create, change or fire scheduled tasks (main account only). Model: the cheaper one (sonnet). Size M; say so in chat first.

## Task
- Branch claude/3d-kit-v5 from latest main. Files: techkit/scenes/gold3d-sample.html, techreel/topics/gold3d-sample.json.
- First merge the two unmerged critic branches, claude/critic-gold3d-sample (v3 pass) and claude/critic-gold3d-sample-v4 (v4 pass), so
  review/tech/showreel-tech-gold3d-sample.md holds both. Its "EXACT FIX (render v5)" is the list below.
- Status: v4 preview (R2 study/showreel-tech-gold3d-sample-v4-preview.mp4, 18.5 s) NOT READY, PREMIUM 6.5 / 7 / 7.5; 4 renders used.
  Keep: frame-0 hook ("3x8=24", question caption from 0.6 s), no code card, distinct names, aiLabel false, the colours.

The six fixes:
1. Opening 0-5.2 s: one slow camera move at about 2.6 s (low push-in or 15-20 degree orbit, at least 10 % scale change); no framing over 3 s. Keep the frame-0 picture.
2. Hub: between the tool wall and the app row (or lift the tool wall one tile height), so all eight tools are visible and whole from 7.5 s to the end; the picture matches "3+8=11".
3. Push-in 9.8-11.0 s: pull back about 10 % (or bring the apps closer) so "Notes", "Chat", "Mail" are whole in frame.
4. Tangle 0-6.3 s: cables to the side edges of the bottom tool row, so "Photos" and the 8th tile are not under cables.
5. End 13.3-18.5 s: one event in the last 2 s with the caption held: from about 16.3 s ease the camera back to the exact frame-0 camera (small orbit) and pulse the New tile's single cable once.
6. Hub line "one shared standard": 34 px or more at 1080 wide, or drop it.

## Steps
1. Make the six fixes. Text checks first, then ONE stills sheet at phone size: every fix shows, no name cut or covered.
2. `npm run check`, push the claude/ branch, the pipeline merges. Write "Progress: fixes pushed" in the same push.
3. STOP before the render. Ask the owner in your chat with a plain cost estimate (render 5 is past the 2-render cap). Render only on the
   owner's yes (in your chat, or "Owner yes for render 5: YES" below). Read .github/workflows/techreel.yml first (it renders main, so merge first).
   ONE render; if it fails, stop and report, no 6th.
4. Output QA on the MP4, then a separate critic session (tag critic, model claude-opus-5-5) on the v5 MP4. Never approve your own work.
5. Each stage gets one plain line in Progress (date, IST time, what happened, cost so far). One entry at the top of design/handoff-log.md
   in the final push. No subagents, no polling (one check-in per GitHub job, with a send_later wake-up), no secrets, no model names in files.

## Owner yes for render 5: NOT YET

## Progress (newest last)
- 26 Nov, owner chat: task written here; nothing started.

---

# History: CLOSED (owner, 22 Nov 2026)

The second account is no longer used; all work runs from the main account again. This file and design/handoff-log.md stay as history.
What the second account built (19-21 Nov) is listed in design/handoff-log.md; it is now owned by the main account.

---

# Handoff: start here (second account)

For sessions on the second account. The owner gives it its tasks in its own chat and it may work on anything in this repo the owner asks
for (owner, 20 Nov 2026). The one thing it never does: create, change or fire scheduled tasks; those belong to the main account.
Keeping the two accounts in sync is the main account's job; this account only has to leave a clear trail.
Read this file, then CLAUDE.md, then the last 5 entries of design/handoff-log.md. Nothing else up front.

## How to work
- Use the cheaper model unless the task needs more. One task per session.
- Branch from latest main (`claude/<topic>`). `npm run check` before every push. The pipeline merges and deploys; never push to main,
  force-push or deploy by hand. Merge origin/main right before you push; never rebase.
- The main account's daily runs push web and tech reels between 06:47 and 13:00 IST (captions.json, review/web, review/tech, their scenes).
  If you change those files, merge origin/main right before pushing so neither side loses work.
- Finish every session that changes the repo with ONE entry at the top of design/handoff-log.md (format there), in the same push:
  what changed, what is left, and anything the main account must know (e.g. a rule you changed, a reel you touched).

## Current state (20 Nov 2026; the log is newer than this)
- Web and tech: one reel a day each, posted any time 13:00-21:00 IST. Main account's scheduled tasks: daily run 06:47 (web + tech, cheaper
  model, at most 2 renders a reel), critic 11:17, spare night Tue 22:44, owner chat Wed 05:13.
- Turns Out: paused; its daily task is off. Its replan is with this account: design/c3-plan.md (20 Nov, read first; then channel3.md, rules-c3.md). Restarting
  its daily task is done by the main account when the owner says so.
- Open items for context: "Add reference" Inbox section (design/todo.md P1); Wikimedia refuses many GitHub-runner downloads (HTTP 429),
  the Media workflow also uses Openverse and the Library of Congress.
