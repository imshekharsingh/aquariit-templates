# The Mandatory Gate

Owner, 7 Nov 2026: "We should keep getting better. Add this as a mandatory rule; you cannot leave anything unaccounted, because I rely on you.
Make a set of mandatory checks we MUST NOT miss any day for any channel."

It applies to **every reel on every channel** (@webin20sec `web`, @techin20sec `tech`, Turns Out `c3`), **every day**. Nothing is rendered,
and nothing is called ready, until every item passes. A reel that fails an item is fixed, or its topic is swapped. No exceptions, no "next time".

Floor and ceiling (owner, 7 Nov 2026: "Can we further improve the overall animation and flow? Are the gates just a low-expectations check?"):
items 1-13 catch defects, a floor. Items 14-17 (FLOW) measure motion quality, the ceiling: how the reel moves frame to frame, the way a viewer
feels it. They exist because the first flash reel passed every other item with two hard jumps, a white strobe and three still runs.

Why it exists: on 7 Nov the owner or the parent session had to catch a static reel (one small phone still for 18 s), a developer-only topic,
text over UI and labels, subtitle pills over the list, the subtitle band slicing through the phone, the hook over the device, a key moment under
Instagram's right-side buttons, and voice pacing over the limit. Each of those is now an item below with a pass condition a script or the
builder checks.

**AUTO** = a script prints the line; paste it as the evidence. **REVIEW** = the builder looks at the stills sheet and writes what it saw.
Frame size is 1080x1920; the stills viewport is 540x960 (halve every number there).

## The 17 items (1-13, and the FLOW items 14-17 from 8 Nov)

| # | Item | Pass condition | Checked by |
|---|------|----------------|------------|
| 1 | Topic | A non-specialist feels the problem within 1 s (no developer-only topic); not done before on any channel; passes every rule of the channel rulebook (design/rules-web.md, rules-tech.md, rules-c3.md), scored rule by rule. | REVIEW |
| 2 | Frame 0 | The subject is already happening at frame 0; `SUBJECT FILL` at least 40 % on every channel (the hook above and the subtitle band below leave about 42 % for the subject); the hook is clear of the subject (`HOOK: clear of the subject`). | AUTO + REVIEW |
| 3 | Safe zone | Every overlay text box (hook, labels, subtitles, chips) and key action ([data-key]) inside x 60-960, y 250-1570; the subject's own UI text may run off the frame's edges in a push-in but never under the right-side buttons (x past 960): `SAFE ZONE: ok`. | AUTO |
| 4 | No overlap | No text box intersects another text box or a UI element's text (`OVERLAP: none`); the subject never crosses the subtitle band (`BAND: clear`). | AUTO |
| 5 | Motion | `STATIC STRETCH: none` (no still 2 s or more unless marked in window.HOLDS). | AUTO |
| 6 | Subtitles | Whole phrases, at least 52 px, at most about 6 words a line (`SUBTITLES: at least 52 px, at most 6 words a line`), every spoken line shown and finished. | AUTO + REVIEW |
| 7 | Voice | `PREFLIGHT ... fits`, `PRONUNCIATION` with no "check:" words, pace within the channel limit (web and c3 at most 2.6 words/s; tech ends inside the topic's voice limit); after the render the voice check hears every word. | AUTO |
| 8 | Sound | Cues on every move and impact, the bed ducked under the voice, -14 LUFS ±1, true peak at most -1 dBTP. | AUTO in the workflow: `SOUND GATE: ok`, the run fails otherwise |
| 9 | Payoff | A visible close-up result; the reel ends on the fix or the reveal (no sign-off). | REVIEW |
| 10 | Facts | Facts and sources as the channel requires (c3: 2+ sources in the config; web: the tip's source; tech: primary sources); `npm run check` passes. | AUTO + REVIEW |
| 11 | Post data | captions.json has channel, postOn, postAt, concept; the post text has a caption, 6 keywords, 5 hashtags (`npm run check` passes). | AUTO |
| 12 | Review file | review/&lt;channel&gt;/&lt;name&gt;.md complete (this list, below). | AUTO |
| 13 | After the render | `node scripts/reel-status.mjs` read (run green, `SOUND GATE: ok`, voice check, contact sheet looked at); if the contact sheet cannot be downloaded, the final scene's stills re-run locally. | REVIEW |
| 14 | FLOW: cuts | No undeclared hard jump: `FLOW: cuts 0`. A planned one (a wipe, a push-through, a match cut) is declared in `window.TRANSITIONS = [[t0, t1, 'kind']]` (the web kit declares its own). | AUTO |
| 15 | FLOW: dead runs | Nothing on screen is still for 1 s or more outside `window.HOLDS`: `FLOW: dead runs none`. | AUTO |
| 16 | FLOW: continuity | The picture is always moving and never jumping, 85 % of the time or more: `FLOW: continuity nn%` (holds count as still time). | AUTO |
| 17 | FLOW: strobes | At most one full-frame flash, declared as a `'flash'` transition: `FLOW: strobes 0` (or `1 (..., declared)`). | AUTO |

### Daily musts (every day, beside the items)
- The audit card (daily run step 2).
- The rulebook update when the numbers say so (daily run step 3).
- **One craft improvement per day per channel**: a measurable step up in motion, look or sound against that channel's last reel, logged as one
  line in design/craft-log.md (`- DD Mon, channel: what changed (the number)`), in the same push as that reel.

## How each AUTO line is made

- **Web** (scripts/explainer): every new reel starts from `node scripts/explainer/newweb.mjs` and the motion kit (scripts/explainer/kitmotion.js),
  which pass the whole gate and FLOW out of the box. `node scripts/showreel/preflight.mjs <config>` (PREFLIGHT, PRONUNCIATION), then
  `node scripts/showreel/stills.mjs <config> <out>` (EMPTY FRAMES, STATIC STRETCH, SUBJECT FILL, TEXT FIT, SAFE ZONE, OVERLAP, BAND, HOOK,
  SUBTITLES, FLOW). The scene marks its parts: `data-subject` on the subject (the phone, the card list), `data-band` on the subtitle band,
  `data-hook` on the hook, `data-subs` on the subtitle box, `data-key` on a key action (a tap, a cursor, the moment the reel is about), `data-ui`
  on the subject's UI when it sits outside the data-subject box. Unmarked = fail. BAND reads the subject's visible box: cut by overflow, a clip-path
  inset(), a top-to-bottom mask fade, or `data-visible-bottom` (viewport px); a band under 30% opacity (fading in) does not count.
- **Turns Out** (scripts/channel3): `node scripts/channel3/qa.mjs <config> --write` prints SAFE ZONE and OVERLAP from the text the canvas
  reports (window.__boxes); BAND, HOOK and SUBTITLES are drawn on the canvas, so they are REVIEW items read from the stills sheet. The starter
  (scripts/channel3/starter25d.html) centres the hook, captions and credit in the safe zone (SX = 255 of 540).
- **Tech** (techreel): `python3 techreel/make.py <slug> --fake-vo --stills <times>` prints PREFLIGHT, PRONUNCIATION, SAFE ZONE and OVERLAP
  (every text drawn, every 0.5 s); BAND and HOOK are fixed by the layout (scenes in y 430-1196, captions below, the hook card leaves first)
  and confirmed on the stills. The render's qa.txt repeats them and adds `SOUND GATE`.
- All layout rules live in one place, scripts/showreel/layout.mjs (the techreel copy in techreel/make.py follows it). Calibrated 7 Nov 2026:
  the first two Nº 16 longname versions in git history fail (top-bar text, captions over the list, static stretch); the reworked longname
  still fails only on the moments the owner flagged (the long name and Pay under the right-side buttons, the list under the band at 3 s,
  the hook touching the list at 2 s, the min-width chip over the code at 11.5 s); the reworked flash passes every line.

## FLOW (items 14-17): how it is measured

scripts/showreel/flow.mjs (web, Turns Out), the same code in techreel/make.py (tech). The frame every 0.1 s, shrunk to 54x96 from the 540x960
picture; one **step** = the mean absolute RGB change (0-255) between neighbouring frames.

- **Cut**: a step over 25 that comes from slow motion (the step before is under 12.5), or any step over 60, outside a declared transition.
  A fast camera whip that eases up to speed is not a cut (Sahara's zoom-through: 15 → 40 → 28); a jump from rest is (flash before: 0.1 → 41).
- **Dead run**: 1 s or more of steps under 0.5 (Turns Out 0.3: its 2.5D paper drifts 0.2-0.5 a step by design), outside `window.HOLDS`.
- **Continuity**: the share of steps whose 0.3 s average (a counter that ticks every 0.2 s is moving) is between the dead line and 25.
  Declared transitions are left out of the count; holds are not (a hold excuses a dead run, not the score).
- **Strobe**: a step over 60 and back within 1 s (the frame after looks like the frame before). One is allowed when declared `'flash'`.
- Printed by `stills.mjs` (web), `channel3/qa.mjs` (Turns Out), `techreel/make.py --stills` (tech, transitions and holds in the topic file),
  or alone: `node scripts/showreel/flow.mjs <config> [--diffs]` (`--diffs` prints every step, to find the moment).

### FLOW calibration (7 Nov 2026)

| Reel | Cuts | Dead runs | Continuity | Strobes | Median step | Verdict |
|------|------|-----------|-----------:|---------|------------:|---------|
| Nº 09 numbers (web, 100,928 reach, 74% hold) | 0 | none | 95% | 0 | 1.2 | pass |
| Nº 13 sideways (web) | 0 (an eased whip of 26 at 3.2 s) | 4, longest 15.9-19.4 s | 35% | 0 | 0.2 | fail: the static stretches the 0.5 s check also flagged |
| flash, before its flow pass (#643) | 2 (41 at 2.2 s, 32 at 6.8 s) | 3: 8.5-9.5, 11.5-12.6, 18.4-20.4 s | 65% | 1, not declared (91, 0.5-1.5 s) | 1.1 | fail: the jumps and stills the owner saw |
| flash, after its flow pass (#644) | 2 (32 and 40 at 0.3-0.7 s: its one soft flash, not declared yet) | none | 94% | 0 | 1.6 | pass once the flash is declared in window.TRANSITIONS |
| Turns Out Liberty (2.5D) | 0 | none | 100% | 0 | 1.8 | pass |
| Turns Out Sahara (2.5D) | 0 (whips of 40 and 30, eased up from 15) | none at 0.3 (several at 0.5) | 95% | 0 | 0.6 | pass with the Turns Out dead line 0.3 |
| tech wifi-address (fake voice) | 0 | 0.8-2.0, 12.4-19.5 s | 35% | 0 | 0.2 | fail: tech scenes hold still after each build-in |
| web kit demo (scripts/explainer/demo/kitdemo, starter as written) | 0 (3 declared: morph, sharedElement, wipeRestyle) | none | 95% | 0 | 1.3 | pass |

Thresholds: web and tech cut 25, dead 0.5, continuity 85%, strobe 60; Turns Out the same with dead 0.3. Change a threshold only with a new row here.

## The review file

`review/<channel>/<name>.md` (name = the reel's showreel name, e.g. review/web/showreel-30-example.md; tech = showreel-tech-<slug>).
Start from review/TEMPLATE.md. One line per item, exactly `N. <item>: PASS: <evidence>`; items 2, 3, 4 and 7 must paste their AUTO line
(`SUBJECT FILL`, `SAFE ZONE: ok`, `OVERLAP: none`, `fits`), and for reels posting from 2026-11-08 items 14-17 too (`FLOW: cuts 0`,
`FLOW: dead runs none`, `FLOW: continuity` 85%+, `FLOW: strobes 0` or one declared). Item 13 says `PENDING` until the render has been checked, then `PASS: <evidence>`.

- `npm run check` fails for any reel posting from 2026-11-08 on (not hidden, not a sample) without a complete file: items 1-12 PASS (and 14-17),
  and item 13 PASS once its post day is past (scripts/review-gate.mjs).
- The Showreel and Tech reel workflows refuse to render without items 1-12 (and 14-17) PASS (their first step, "Mandatory Gate", prints a REVIEW GATE
  error line). A Showreel preview (the "seconds" input) is exempt.
- Reels posting before 2026-11-08 are grandfathered (rendered before the gate).
