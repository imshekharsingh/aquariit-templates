# Playbook: what works, what didn't

The daily improvement loop (owner, 7 Nov 2026; CLAUDE.md, "Daily improvement loop"): every run picks ONE small experiment per channel,
reads yesterday's result, and writes it here. Every reel starts from its channel's current "What works" combination.
A change that wins 2 of 3 tries becomes a rule in the channel rulebook (design/rules-*.md); one that loses twice is dropped (moved to "What didn't").
Numbers: reach and avg watch from the Instagram collect run (AUDIT_CHANNELS / AUDIT_SIGNALS), with the hour of the reading.
Checked automatically (7 Nov 2026): each reel's config names its experiment (`"experiment": {"id", "change", "vs": "median"}`; a reel not built yet
is marked in design/targets.md, "Planned experiments"); every Instagram collect prints its verdict at 24 h and 72 h ("EXPERIMENT ... → WIN | LOSE"),
and "PROMOTE" after 2 WINs or "DROP" after 2 LOSEs: the daily run moves it here and into the rulebook the same day.

## Experiment log
One line per channel per day: `- DD Mon, channel: experiment (the one change) → result (number, vs what)`. A result is read at ~24 h, not at 5 h.

- 7 Nov, all: the Mandatory Gate's visual upgrades (safe zone, subtitle band, motion-following sound) on every new reel → read 8 Nov.
- 8 Nov, web: the "details" format (id details-format): a slow-mo compilation of small UI motions (3 calm beats after the owner's "rushed" note, rule 13), each with its live easing curve, a spec chip and its CSS line, result-first, recap grid at the end, caption invites a save → read 9 Nov (24 h) and 11 Nov (72 h) vs the web median (~1,300 reach, ~8.7 s watch, ~1.3% saves).
- 8 Nov, c3: posting at 13:00 IST (id c3-1300-slot; owner moved every channel to 13:00) on an E14-style frame 0 (the Golden Gate Bridge in black and yellow stripes) → read 9 Nov (24 h) vs the c3 median (157).

- 9 Nov, web: the details format, try 2 (id details-format; showreel-31-menus: tabs, accordion, cascading menu), first reel with size-matched element sound on every element → read 10 Nov (24 h) vs the web median.
- 10 Nov, web: the details format, try 3 (id details-format; showreel-32-waiting: send-button morph, photo fade, toast), element sound → read 11 Nov (24 h); 2 WINs of 3 → rule.

- 8 Nov, tech: the myth-bust format (id tech-myth-verdict; ESCALATE answer): "Does closing your apps save battery?", MYTH stamped in frame 0, why in 3 steps, Background App Refresh as the takeaway, 18 s → read 9 Nov (24 h) vs the tech median (116).
- 9 Nov, tech: the myth-bust, try 2 (heat-battery, TRUE in frame 0; natural voice pace, rule 10) → read 10 Nov (24 h) vs 116. Try 1 at 6 h: 121 vs the 6 h median 111.
- 9 Nov, c3: the journey, try 1 (id c3-journey; Sphinx in sand, seven worlds) → read 10 Nov (24 h) vs the c3 median. Yesterday's 13:00 slot (Golden Gate): 1,143 at 6 h vs the 6 h median 158 (x7), 24 h verdict at the 10:53 collect.
- 9 Nov, web: try 1 of details-format (showreel-30-alive) at 6 h: 1,333 vs the 6 h median 1,288 (on par); its 24 h verdict prints at the 10:53 collect.

## What works

### @webin20sec (web)
- **Topic:** an everyday phone annoyance people see as users (numbers that wiggle, Nº 09: 100,928 reach; list feels flat 5,722; scroll behind a popup 4,235).
- **Frame 0:** the bug already moving in frame 0 (Nº 09 held 74%, Nº 04 70%, vs 28% when the bug shows after the hook).
- **Hook:** "Why does your X …?" in at most 8 words, over the broken thing (all 8 web reels past 1,300 reach open this way).
- **Fix:** one line of code under the live picture by ~8 s, then the same picture fixed (fixes you can see at a glance: list 5,722 vs invisible speed fixes 258-2,645).
- **Time:** 13:00 IST (30-day median 2,313 vs 12:00 899, 17:00 712); 19:00 under test (E13: sticky 1,430 at 24 h).
- **Craft (7 Nov):** everything inside the safe zone (x 60-960, y 250-1570), subtitles in their own band below the picture, sound cues that follow the motion, one continuous camera.
- **Format under test (8 Nov 13:00, details-format):** a compilation of small satisfying UI motions in slow motion (the owner shared a reel of this kind; we take the techniques only:
  slow motion, a live easing curve with a riding dot, a spec chip, a numbered part bar). Built with `node scripts/explainer/newweb.mjs <slug> --details N` (now 3 beats of ~5.5 s, 24-26 s; first cut 4-5 beats in ~20 s):
  the hook over the first detail already finished (result first), one beat per detail (three-word title with one accent word, the component slowed, its CSS typed, the curve and
  the "ms" counter running with the dot), then a recap grid of all of them at full speed (the saveable frame). Why: rule 11 (motion tricks are our winners: numbers 103k, stagger 5.9k)
  and saves (a recap of copyable lines). Look: style C, "Glass and light" (owner, 8 Nov 2026), the kit's default theme; titles, wording and components are ours.
  **Calm (owner, 8 Nov 2026: the 4-detail 20 s cut "feels rushed"):** 3 details, ~5.5-5.9 s a beat (real speed, then slow-mo with its curve, then a hold), 24-26 s,
  at most 2.4 words/s with 0.6 s+ breaths; showreel-30-alive was rebuilt this way before posting (beats ~2.6-3.2 s → 5.9 s, 2.15 → 1.58 words/s). Rule 13; PACE in preflight.
- **Art direction (8 Nov, owner: "Let's go with C."):** style C, "Glass and light": frosted panes at three depths over slow coloured light blooms,
  a soft gradient grade, crisp white Sora type, floating code panes. Through the kit theme (`KM.theme('glass')`, the newweb.mjs default in both
  modes), cheap glass path only (style C's test with real backdrop blur: 52 GitHub minutes for 8 s; style A ~210 for 20 s). From the Sun 8 Nov
  13:00 details-format reel on (the 06:47 daily run builds it); sample: showreel-style-c-details, 21.2 s in 15 GitHub minutes (rules-web.md rule 12).

### Turns Out (c3)
- **Topic:** a world-famous thing everyone pictures one way, shown in a state that looks wrong: a visible transformation (Liberty copper-brown 1,051 reach, 15.2 s watched; the green Sahara 1,041 at 5 h).
- **Frame 0:** the payoff image in frame 0, the "wait, what?" picture (E14, running).
- **Icon in a colour nobody pictured (rule 10, 9 Nov):** Liberty 1,058, Sahara 1,076, white pyramid 1,102, black-and-yellow Golden Gate 1,143 at 6 h; every other reel 108-161.
- **Form:** 25-35 s, 2.5D, one camera that never cuts, a big change every ~3 s, payoff in the last 3 s (Liberty held 46%, the channel's best).
- **Craft (7 Nov):** hook, captions and credit centred in the safe zone (the starter, SX = 255).

### @techin20sec (tech)
- **Topic:** an everyday puzzle you can see on your own phone, not news (explainers 110-120 reach vs news 8-35).
- **Open:** the answer's first step on screen inside 2 s; 18 s or shorter; a takeaway worth saving in the last 3 s.
- **Time:** 13:00 IST every day from 8 Nov (owner); E15 ended (19:00 median 129 over 2 reels, inside the same ~110-130 pool).
- **Format under test (8 Nov, tech-myth-verdict):** the myth-bust, verdict first (rules-tech.md rule 9).

## What didn't
- web: fixes you must imagine or that only developers see (squashed photos 281, page jump 402, INP 258, springs 391, zero-JS transition 178).
- web: cover-card openers before the bug (13-26% hold, 2.7-5.0 s).
- web: a big hit does not carry the account (Nº 09's 97k, then Nº 10 at 312 at ~16 h): reach follows the topic.
- c3: abstract "why" topics with nothing to see change (why 60 minutes 118, why the sky is blue 153).
- c3: a transformation people don't recognise (flamingos, a grey chick in frame 0: 120 at 5 h vs the Sahara's 1,041).
- tech: news reels (Siri 8, MacBook 29, Discord 35); the 31 Oct-6 Nov test missed all three targets (median reach 115 vs 300).

- 7 Nov 2026, web plateau: since 1 Nov every web reel is a layout fix and reach sits at 305-2,267 (median 1,316), avg watch ~8.7 s, saves ~1.3%.
  The winners (numbers 103k, stagger 5.9k, overscroll 4.5k) were satisfying motion or polish tricks with 14 s watch and 3-4.5% saves.
  Next experiment (8 Nov 13:00): result-first opening on a satisfying motion trick (rules-web.md rule 11); read reach, watch and saves at 24 h vs the median above.
  Marked in design/targets.md (id result-first) so its verdict prints by itself; the 8 Nov config also carries it as "experiment".
