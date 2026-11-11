# Targets and planned experiments (read by scripts/audit-numbers.mjs on every Instagram collect)

The owner (or Claude) can change any number here; the next Instagram collect uses it. "–" = no target for that number.
The audit prints, per channel, "ALARM <ch>: ..." when the last 7 posted reels (24 h old or more) miss any target, else "OK <ch>: ...",
next to the best 7-reel window of the last 30 days. ALARM two days in a row prints "ESCALATE <ch>": the daily run answers it with a change
of topic type or format that day (not a tweak). Owner, 7 Nov 2026: "Who the fuck is going to check all of this?": this file and the
audit's AUDIT_CHECKS lines do, every day, without anyone remembering to.

## Targets
| Channel | Median reach | Avg watch (s) | Saves (%) |
|---|---|---|---|
| web | 2000 | 12 | 3 |
| c3 | 500 | – | – |
| tech | 300 | – | – |

Why: web's winners (numbers 103k, stagger 5.9k, overscroll 4.5k) had 10-15 s watch and 3-4.5% saves; since 1 Nov web sits at a median
~1,300 reach, ~8.7 s, ~1.3% saves. Turns Out's two hits passed 1,000 (median 157 on 5 Nov). Tech's test target was 300 (median 115).

## Planned experiments
A reel normally declares its experiment in its config: `"experiment": {"id": "result-first", "change": "result-first opening", "vs": "median"}`
("vs": "median" = the channel's 7 reels before it at the same age, a reel name, or a fixed baseline "reach 1546, watch 8.8[, saves 1.7]";
a planned row with the same id as the config sets the baseline). A row here marks a reel that is not built yet (learn-then-build):
the audit matches it by channel, postOn and postAt in templates/showreels/captions.json, so its verdict prints at 24 h and 72 h even if the
config forgets. Two WINs of one id print PROMOTE (becomes a rulebook rule that day), two LOSEs print DROP (moves to "What didn't").

| Channel | Post on | Post at | Id | Change | Vs |
|---|---|---|---|---|---|
| web | 2026-11-08 | 13:00 | details-format | slow-mo motion details compilation (newweb.mjs --details; it opens result-first, rules-web.md rule 11) | median |
| web | 2026-11-12 | 13:00 | dark-return | E18: dark theme + motion-feel single fix (October formula) | reach 1546, watch 8.8 |
| web | 2026-11-13 | 13:00 | dark-return | E18: dark theme + motion-feel single fix (October formula) | reach 1546, watch 8.8 |
| web | 2026-11-14 | 13:00 | dark-return | E18: dark theme + motion-feel single fix (October formula) | reach 1546, watch 8.8 |
| tech | 2026-11-13 | 13:00 | tech-settings-list | E17: 3 phone settings to change today, tapped on a drawn phone | median |
| tech | 2026-11-14 | 13:00 | tech-settings-list | E17: 3 phone settings to change today, tapped on a drawn phone | median |
| c3 | 2026-11-13 | 13:00 | c3-guess | E19: GUESS format (three options on the icon, 3-2-1, the answer, loops) | median |
| c3 | 2026-11-14 | 13:00 | c3-guess | E19: GUESS format (three options on the icon, 3-2-1, the answer, loops) | median |
