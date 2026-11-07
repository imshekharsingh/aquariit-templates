# The Mandatory Gate

Owner, 7 Nov 2026: "We should keep getting better. Add this as a mandatory rule; you cannot leave anything unaccounted, because I rely on you.
Make a set of mandatory checks we MUST NOT miss any day for any channel."

It applies to **every reel on every channel** (@webin20sec `web`, @techin20sec `tech`, Turns Out `c3`), **every day**. Nothing is rendered,
and nothing is called ready, until every item passes. A reel that fails an item is fixed, or its topic is swapped. No exceptions, no "next time".

Why it exists: on 7 Nov the owner or the parent session had to catch a static reel (one small phone still for 18 s), a developer-only topic,
text over UI and labels, subtitle pills over the list, the subtitle band slicing through the phone, the hook over the device, a key moment under
Instagram's right-side buttons, and voice pacing over the limit. Each of those is now an item below with a pass condition a script or the
builder checks.

**AUTO** = a script prints the line; paste it as the evidence. **REVIEW** = the builder looks at the stills sheet and writes what it saw.
Frame size is 1080x1920; the stills viewport is 540x960 (halve every number there).

## The 13 items

| # | Item | Pass condition | Checked by |
|---|------|----------------|------------|
| 1 | Topic | A non-specialist feels the problem within 1 s (no developer-only topic); not done before on any channel; passes every rule of the channel rulebook (design/rules-web.md, rules-tech.md, rules-c3.md), scored rule by rule. | REVIEW |
| 2 | Frame 0 | The subject is already happening at frame 0; `SUBJECT FILL` at least 40 % (web at least 50 %); the hook is clear of the subject (`HOOK: clear of the subject`). | AUTO + REVIEW |
| 3 | Safe zone | Every text box and key action ([data-key]) inside x 60-960, y 250-1570: `SAFE ZONE: ok`. | AUTO |
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

### Daily musts (every day, beside the 13 items)
- The audit card (daily run step 2).
- The rulebook update when the numbers say so (daily run step 3).
- **One craft improvement per day per channel**: a measurable step up in motion, look or sound against that channel's last reel, logged as one
  line in design/craft-log.md (`- DD Mon, channel: what changed (the number)`), in the same push as that reel.

## How each AUTO line is made

- **Web** (scripts/explainer): `node scripts/showreel/preflight.mjs <config>` (PREFLIGHT, PRONUNCIATION), then
  `node scripts/showreel/stills.mjs <config> <out>` (EMPTY FRAMES, STATIC STRETCH, SUBJECT FILL, TEXT FIT, SAFE ZONE, OVERLAP, BAND, HOOK,
  SUBTITLES). The scene marks its parts: `data-subject` on the subject (the phone, the card list), `data-band` on the subtitle band,
  `data-hook` on the hook, `data-subs` on the subtitle box, `data-key` on a key action that is not text (a tap, a cursor). Unmarked = fail.
- **Turns Out** (scripts/channel3): `node scripts/channel3/qa.mjs <config> --write` prints SAFE ZONE and OVERLAP from the text the canvas
  reports (window.__boxes); BAND, HOOK and SUBTITLES are drawn on the canvas, so they are REVIEW items read from the stills sheet. The starter
  (scripts/channel3/starter25d.html) centres the hook, captions and credit in the safe zone (SX = 255 of 540).
- **Tech** (techreel): `python3 techreel/make.py <slug> --fake-vo --stills <times>` prints PREFLIGHT, PRONUNCIATION, SAFE ZONE and OVERLAP
  (every text drawn, every 0.5 s); BAND and HOOK are fixed by the layout (scenes in y 430-1196, captions below, the hook card leaves first)
  and confirmed on the stills. The render's qa.txt repeats them and adds `SOUND GATE`.
- All layout rules live in one place, scripts/showreel/layout.mjs (the techreel copy in techreel/make.py follows it). Calibrated 7 Nov 2026:
  the first two Nº 16 longname versions in git history fail (top-bar text, captions over the list, static stretch); the reworked longname
  still showed the long name past x 960 and the list under the band, the moments the owner flagged.

## The review file

`review/<channel>/<name>.md` (name = the reel's showreel name, e.g. review/web/showreel-30-example.md; tech = showreel-tech-<slug>).
Start from review/TEMPLATE.md. One line per item, exactly `N. <item>: PASS: <evidence>`; items 2, 3, 4 and 7 must paste their AUTO line
(`SUBJECT FILL`, `SAFE ZONE: ok`, `OVERLAP: none`, `fits`). Item 13 says `PENDING` until the render has been checked, then `PASS: <evidence>`.

- `npm run check` fails for any reel posting from 2026-11-08 on (not hidden, not a sample) without a complete file: items 1-12 PASS,
  and item 13 PASS once its post day is past (scripts/review-gate.mjs).
- The Showreel and Tech reel workflows refuse to render without items 1-12 PASS (their first step, "Mandatory Gate", prints a REVIEW GATE
  error line). A Showreel preview (the "seconds" input) is exempt.
- Reels posting before 2026-11-08 are grandfathered (rendered before the gate).
