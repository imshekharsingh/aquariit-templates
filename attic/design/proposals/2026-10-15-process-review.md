# Process review: proposal (15 Oct 2026). NOTHING HERE IS APPLIED.

Size of this proposal: M (~50 min of session work, no GitHub renders). Drafts: `design/proposals/CLAUDE.proposed.md` and `design/proposals/moved/*.md`.
Decisions are asked in the GitHub issue "Process review: decisions needed".

## Non-negotiable: no regression in motion design
- No part, option, preset or check in `scripts/film/` is deleted or weakened. Parts are only labelled **signature**, **keep** or **dormant**; dormant parts stay in the
  code and stay usable.
- No rule is dropped. Every line of today's CLAUDE.md is either kept in the proposed file or moved **word for word** into a linked file. This was verified
  mechanically: 321 original lines, 0 missing (`python3 design/proposals/coverage.py`; re-run it before applying).
- **Regression plan (before any approved change that touches `scripts/`):**
  1. A new workflow job `regression-stills` (proposed, M) renders `--stills` at the cuts (every `timing.json` cue + 0, 3, peak, len-0.5 s) of the **last 3 films**
     (today: 2026-10-14-0850, 2026-10-13-1902, 2026-10-12-0850) from `main` (baseline) and from the change's branch, on GitHub.
  2. It diffs each pair (per-pixel mean difference and the % of pixels changed by more than 8/255) and posts a contact sheet of baseline | branch | diff.
  3. Any difference that is not listed as intended in the PR body blocks the merge (a failing required check). Renders are deterministic (frames are pure
     functions of film time), so an unchanged film must diff to 0.
  4. Docs-only changes (like this one) skip it.

## 1. Lean CLAUDE.md (films first)
**Today:** 321 lines. Films come after 180 lines of template and screen-recording rules. Contradictions:
(a) a 79-line music-supervisor process vs "films ship with no music" (the owner chose nothing licensed, 13 Oct);
(b) the kit says "Reel recorded from the screen" and plans what "the ▶ player" shows, while reels are films;
(c) "do not modify scripts/ during daily runs" vs "every film adds a new part to scripts/film/parts.js";
(d) the ▶ player's 11 code-generated music styles vs "never use code-generated music" (it only affects the in-app player and the fallback, which renders with `--no-audio`).
**Proposal:** `CLAUDE.proposed.md`, 151 lines, films first, with a short "Sound now" section and an explicit exception for (c). Four sections move word for word:

| Current rule (CLAUDE.md lines) | Status | Where it lives after the change |
|---|---|---|
| Title + role (1-4) | kept | CLAUDE.md, top |
| Dates and URLs (6-23) | kept | CLAUDE.md |
| Git workflow (24-32) | kept | CLAUDE.md |
| Design log schema (33-41) | kept | CLAUDE.md |
| No-repeat rule (42-50) | kept | CLAUDE.md |
| Creative direction menus (51-61) | moved | design/template-rules.md (+ pointer in CLAUDE.md "Template pages") |
| Design quality bar (62-84) | moved | design/template-rules.md |
| iPhone Reel frame / recording rules (85-135) | moved | design/recording-fallback.md (check.mjs still enforces its page rules) |
| Kit intro, What we sell, Growth rules, Audience (136-151) | kept | CLAUDE.md, right after the film section |
| Kit section formats: Hook, Service, Caption, Keywords, Hashtags, Reel, Music, account notes (152-181) | moved | design/kit-format.md (+ the required-sections list stays in CLAUDE.md) |
| Directed film (182-200) | kept | CLAUDE.md, first section after the intro |
| Music supervisor steps 1-7 (201-275) | moved, **dormant** | design/music-supervisor.md, switched on only when a licensed music API is connected |
| Music credentials + "no music bed until an API" (276-278) | kept | CLAUDE.md "Sound now" (also in the moved file) |
| Required in every template (280-290) | kept | CLAUDE.md |
| Copyright-safe rules (291-303) | kept | CLAUDE.md |
| Site infrastructure (304-308) | kept + clarified | CLAUDE.md, plus one line: a daily film may add a part to parts.js |
| Save Claude usage + Effort first (309-315) | kept | CLAUDE.md, moved up next to the film rules |
| Never do (316-321) | kept | CLAUDE.md |
| (new) How this file is organised; Sound now; Template pages; voice-over line | merged | short glue lines; no rule changes |

Each moved file starts with a status line and lists the lines CLAUDE.md supersedes, so nothing contradicts. **Why:** the daily run reads the film rules first and
stops tripping over retired ones. **Risk:** low; a rule could be missed. Mitigation: the coverage check (0 missing) re-runs before applying.
**Effort:** S to apply (the owner edits CLAUDE.md; I create the four linked files by extraction, not retyping).

## 2. Independent review (not the maker)
**Today:** the session that makes a film also grades it (`friendTest` in reel-log.json, always four yeses). frame-review.py and `--motion-check` exist but only
the maker reads them. The owner sees the film in the "Reel ready" issue.
**Proposal:**
- After the render, the Reel publish workflow (a) extracts stills at the cuts, a contact sheet and `frame-review.py` flags + `motion.png`, (b) uploads them as an
  artifact, and (c) starts a **fresh reviewer session** (a new Claude Code session via the remote-session tool, no shared context). It is given only: the stills,
  the contact sheet, the motion data, the hook text, the safe-zone rules and design/references/. It never sees the story, notes or reel-log.
- The reviewer returns **PASS** or **REJECT** with reasons on each criterion: first-second stop power; one clear idea; timing and weight between frames (from the
  motion graph: FROZEN/JUMP/JUDDER flags, arrival curves, not just stills); caption readability at phone size; safe zones (top 96 px, bottom 22%, right column);
  the loop (last vs first frame). It posts the verdict as a comment on the "Reel ready" issue.
- REJECT: the next daily run fixes and re-renders once; a second REJECT goes to the owner. `friendTest` stays in reel-log.json as the maker's notes only.
- **Final gate: the owner.** The "Reel ready" issue already carries the MP4 link. Add one line on top: "Watch once on your phone, then tick ☐ Post it / ☐ Fix it".
- Alternative if a separate session is not wanted: a GitHub job calling the Claude API (needs an `ANTHROPIC_API_KEY` secret and a small per-film API cost).
**Why:** a self-grader always passes its own work. **Risk:** reviewer too strict or too loose at first; calibrate on the last 3 films before it can block.
**Effort:** M to build; each review is a short, separate session (about S of usage per film).

## 3. Signature over novelty
**Today:** 46 tagged part options in parts.js. check.mjs refuses any overlap with the previous film in opener, transition, mechanism or payoff, refuses
near-copies of the last 7 (6+ equal slots), and refuses a repeated opening or big moment. CLAUDE.md asks for a new trick every film.
**Evidence (thin):** only one film has Instagram numbers: Dantika (2026-10-13-1902) held **13.5 s of 18** on average vs 2-4 s for every screen recording (reach 7).
Its parts: draw-on opener, scan, hub, grid-fill, brackets, flood, pill captions, card CTA, clock. Four of these (hub, scan, brackets, flood) are tagged to the owner's
reference reel 1 in sources.json, so they can't become a signature (max one per film). The lock film (2026-10-14-0850) has not been posted yet.
**Proposed signature set (7):** the easing toolkit (P.EASE/P.SPRING/P.tween: no linear motion); P.camera (keyed camera with springs); P.captions 'pill' (readable,
in the best film and in the lock film); P.drawOn (Dantika's opener); P.giant + the slam stack (one huge word / "Locked. Watched. Handled."); P.signoff (the end card);
P.iso (isometric machines; a candidate until the owner approves the first machine reel).
**Keep:** all other parts. **Keep, reference-limited:** hub, scan, brackets, flood, pendulum, radial-tour and the rest listed in sources.json (one per film, never the payoff).
**Dormant (stay in code, usable on request):** the water family, since the owner said Aquarii is not a water brand: P.vessel, P.tank3d, P.underwater, P.dripWord.
**Cadence:** one genuinely new technique per week, from the Sunday design study. Other days refine one signature part (logged in reel-log.json as `refined`).
**check.mjs (proposed change, S-M):**
- Signature parts are exempt from the "repeats the previous film" error.
- At least 2 of the 4 story slots must still differ from the previous film.
- Unchanged: the near-copy rule (last 7), the opening/big-moment rule, service rotation and the originality guard.
- This is a loosening in check.mjs (not in scripts/film/), so it needs your explicit yes.
**Risk:** films start to look alike. The near-copy rule and opening/big-moment rule still prevent copies.

## 4. Reference library (design/references/)
**Today:** reference notes are scattered in the film playbook ("Reference study 2/3") and sources.json guards parts taken from them.
**Proposal:**
- **How you add a reel:** open an issue with the label `reference`, paste the link or attach a screen recording, plus one line on what you liked.
- **What I write:** one note per reference, `design/references/<date>-<slug>.md`, containing principles only:
  - pacing (cut lengths, holds, BPM feel);
  - transition logic (what motivates each cut);
  - type behaviour (size, entrance, how long it holds);
  - use of the frame (fill, crop, safe zones);
  - what not to copy (its lines, its sequence, its signature image).
- **Analysis:** done with frame-review.py on the recording.
- **What is committed:** no frames, clips or contact sheets of someone else's work, only notes.
- **Originality guard:** any part derived from a reference gets a sources.json entry, so check.mjs keeps enforcing "one per film, never the payoff, banned lines".
- **No reference is ever rebuilt.**
- **Reviewer:** the independent reviewer (area 2) reads these notes as its taste guide.
**Risk:** low. **Effort:** S (folder, README, move the two existing studies).

## 5. Distribution first
**What blocks reach (experiments.md, open-items.md):** reach is 4-113 per reel, 0 shares across 6 posts, 1 save. The films hold attention (13.5 s of 18), so the
video is not the bottleneck: almost nobody sees it. **Items that need the owner:**
- #6: fixed time, Instagram audio, Stories share, 5-10 DMs per reel.
- #7: profile checklist and link-in-bio.
- #3: replying to comments for a keyword CTA.
- #11: the service names.
**Two-week plan (15-28 Oct):**
- Post daily at **19:30 IST**, within the 19:00-20:00 window chosen in experiments.md.
- Add an Instagram audio track using the kit's `Search:` terms.
- Share every reel to Stories with a poll sticker.
- DM it to 5-10 people who match that day's service. The kit can list who.
- Measurement: the Instagram collect workflow already logs views, reach, average watch, saves and shares per reel daily.
  - Proposed addition (S): you leave one comment on the "Reel ready" issue, e.g. `posted 19:32 audio y story y dms 7`.
  - The collect run copies it into the results table, so each number sits next to what was done.
**Recommendation: hold motion design steady for the two weeks.** No engine changes and no new parts, except bug fixes and the iso-machine trial if you approve it.
The weekly study only writes notes. This way any change in reach is due to distribution, not to a different film.
**Risk:** two quieter weeks for the film library. **Effort:** about 10 minutes per post from you; S from me.

## Conflicts with the current setup (to resolve if approved)
- **"Every reel looks like its own brand / no house style" (CLAUDE.md) vs a signature set:** the signature is craft (motion, captions, end card), never
  a look. Every film keeps its own palette and type.
- **"Every film adds one new trick" (CLAUDE.md) vs the weekly cadence:** the line would become "every film refines one signature part or adds a trick; one new
  technique per week". It needs your edit.
- **Daily routine "Daily motion graphics prompt" (08:19 IST) and the Sunday design study vs the two-week freeze:** pause the first during the freeze; the
  study writes notes only.
- **The independent reviewer vs "Save Claude usage":** one short session per film. Calibrate it first, then decide whether it can block.
- **check.mjs loosening (area 3) vs "no check weakened":** the film checks in `scripts/film/` stay as they are; the change is in `scripts/check.mjs` and needs your yes.

## Recommend NOT changing
- The originality guard (sources.json + check.mjs): it fixed a real plagiarism problem.
- Service rotation and "sell Aquarii, never the template's business".
- The easing toolkit and `--motion-check`: they set the motion quality floor.
- Heavy renders on GitHub, Effort first, and Save Claude usage.
- Safe zones, readable captions and the clean loop.
- The template page rules: they are the proof pages behind every reel.

## Order: quick wins first
1. **Distribution plan + motion freeze** (owner action, zero code). This is the biggest lever.
2. **Reference library** (S).
3. **Lean CLAUDE.md** (S to apply after your edit).
4. **Regression harness** (M). It must exist before any change to `scripts/`.
5. **Signature tags + check.mjs change** (S-M, behind the regression check).
6. **Independent reviewer** (M). Calibrate on the last 3 films, then let it gate.
