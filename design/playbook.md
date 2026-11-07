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

## What works

### @webin20sec (web)
- **Topic:** an everyday phone annoyance people see as users (numbers that wiggle, Nº 09: 100,928 reach; list feels flat 5,722; scroll behind a popup 4,235).
- **Frame 0:** the bug already moving in frame 0 (Nº 09 held 74%, Nº 04 70%, vs 28% when the bug shows after the hook).
- **Hook:** "Why does your X …?" in at most 8 words, over the broken thing (all 8 web reels past 1,300 reach open this way).
- **Fix:** one line of code under the live picture by ~8 s, then the same picture fixed (fixes you can see at a glance: list 5,722 vs invisible speed fixes 258-2,645).
- **Time:** 13:00 IST (30-day median 2,313 vs 12:00 899, 17:00 712); 19:00 under test (E13: sticky 1,430 at 24 h).
- **Craft (7 Nov):** everything inside the safe zone (x 60-960, y 250-1570), subtitles in their own band below the picture, sound cues that follow the motion, one continuous camera.

### Turns Out (c3)
- **Topic:** a world-famous thing everyone pictures one way, shown in a state that looks wrong: a visible transformation (Liberty copper-brown 1,051 reach, 15.2 s watched; the green Sahara 1,041 at 5 h).
- **Frame 0:** the payoff image in frame 0, the "wait, what?" picture (E14, running).
- **Form:** 25-35 s, 2.5D, one camera that never cuts, a big change every ~3 s, payoff in the last 3 s (Liberty held 46%, the channel's best).
- **Craft (7 Nov):** hook, captions and credit centred in the safe zone (the starter, SX = 255).

### @techin20sec (tech)
- **Topic:** an everyday puzzle you can see on your own phone, not news (explainers 110-120 reach vs news 8-35).
- **Open:** the answer's first step on screen inside 2 s; 18 s or shorter; a takeaway worth saving in the last 3 s.
- **Time:** Mon and Wed 19:00, Fri 17:30 IST (E15, running; 19:00 median 129 over 2 reels).

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
