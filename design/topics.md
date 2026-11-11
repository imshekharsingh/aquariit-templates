# Planned topics (spare-usage night plans the next week every Tuesday)

A run takes the topic for its channel and day from here, skips any already built (captions.json), and may swap one for a better or
fresher idea (say why in the log). Facts are still checked against two sources (Turns Out) or a primary source (web, tech) before building.

## Sun 8 Nov 2026 (set 8 Nov, 00:10 IST, owner-approved)
| Channel | Slot | Topic | How |
|---|---|---|---|
| web | 13:00 | **Slow-mo motion details**: 4-5 small UI motions (e.g. a copy button that springs into "Copied", a switch knob that stretches, a toast that settles and swipes away, a step bar that fills, a heart that pops), each slowed down with its live easing curve and its one CSS line | `node scripts/explainer/newweb.mjs <slug> --details 4` (or 5): ~20 s, result-first (the first detail finished in frame 0), recap grid at the end, the caption invites a save. Built by the 06:47 daily run; config `"experiment": {"id": "details-format", "change": "slow-mo motion details compilation", "vs": "median"}`. Use our own titles and components (the kinds in scripts/explainer/starterdetails.html, or new ones); every CSS line checked on MDN + BCD. Look: **style C, "Glass and light"** (owner, 8 Nov 2026), the kit's default theme in newweb.mjs (cheap glass, blur 3: rules-web.md rule 12); sample showreel-style-c-details. |

Tech, Sun 8 Nov 13:00 (daily run, 8 Nov): **Does closing your apps save battery?** (showreel-tech-close-apps), the myth-bust format, verdict
MYTH in frame 0 (ESCALATE answer; rules-tech.md rule 9). Note: the Thu 12 (airplane mode) and Sun 15 (fast charging, built as charge-80) tech
topics were already posted: replan them on Tuesday's spare night, as myth-busts if the format wins.

## Week of Mon 9 - Sun 15 Nov 2026 (planned Tue 3 Nov)

### @webin20sec (narrated "Why does your ...?" tip, one CSS/HTML fix, MDN + BCD support)
| Day | Hook | The fix |
|---|---|---|
| Mon 9 | Why do menus feel so smooth? (built 8 Nov as showreel-31-menus, details format; owner override: build ahead) | tab line translate + width, grid-template-rows 0fr to 1fr, transition-delay calc(var(--i) * 60ms) |
| Tue 10 | Why does waiting feel shorter? (built 8 Nov as showreel-32-waiting, details format; owner override: build ahead) | send button width morph, photo opacity + scale fade, toast @starting-style |
| Wed 11 | Why does your carousel stop between photos? (built 11 Nov as showreel-33-carousel; swapped from the scrollbar jump, which phones never show: overlay scrollbars, rule 1; ESCALATE answer, rule 11) | scroll-snap-type: x mandatory + scroll-snap-align: center |
| Thu 12 | Why does your button feel dead when you tap it? (E18: dark, motion-feel fix) | :active { transform: scale(.96) } + a 120 ms transition: the press you can feel |
| Fri 13 | Why does your list jump when you delete a row? (E18) | the row collapses first: grid-template-rows 1fr → 0fr with a transition, then it leaves |
| Sat 14 | Why does your toggle feel cheap? (E18) | a spring easing with linear() so the knob overshoots and settles |
| Sun 15 | Why does one long name break your card? | min-width: 0 on the flex child + text-overflow: ellipsis (or line-clamp) |

### @techin20sec (only if the 6 Nov audit keeps the format; "How does / why does" + the mechanism step by step)
| Day | Hook |
|---|---|
| Mon 9 | Why is Wi-Fi slower one room over? (2.4 vs 5 GHz, walls, range vs speed) |
| Tue 10 | How does AirDrop find a phone next to you? (Bluetooth LE discovery, then a direct peer-to-peer Wi-Fi link; Apple Platform Security, AirDrop) (tap-to-pay was built early as showreel-tech-applepay-number, 4 Nov) |
| Wed 11 | Why are video screenshots sometimes black? (built 11 Nov as showreel-tech-black-screenshot: the app marks its video window secure, Android FLAG_SECURE; "NO BUG" stamp, ESCALATE: new topic type) |
| Thu 12 | What does airplane mode actually turn off? (radios; Wi-Fi and Bluetooth can come back on) |
| Fri 13 | How does a torn QR code still scan? (error correction levels L/M/Q/H) |
| Sat 14 | How does your phone know where you are indoors? (Wi-Fi and Bluetooth positioning, no GPS) |
| Sun 15 | Why does fast charging slow down near full? (constant current, then constant voltage) |

### Turns Out (true story, 2.5D, 25-35 s; 5 continents in the week)
| Day | Hook | Continent |
|---|---|---|
| Mon 9 | Why was the Great Sphinx buried up to its neck in sand? (posted, 1,273 reach) | Africa |
| Tue 10 | How did one ball shape the Sydney Opera House? (posted, 1,225) | Oceania |
| Wed 11 | Was the Terracotta Army once painted in bright colours? (built 11 Nov as showreel-c3-terracotta-colour) | Asia |

### Turns Out, Thu 12 - Wed 18 Nov 2026: the GUESS format (E19; planned 11 Nov, design/rules-c3.md rewritten the same day)
Every reel: `node scripts/channel3/new25d.mjs <slug> --guess "Question?" "A, B, or C?" "Lock in your guess." "Answer." "Why." "One more fact." "Turns out, ..."`
(starts from the Eiffel reel; redraw the worlds for the icon). One option = what people picture today, one plausible, one true. Check every claim
in two sources before building; swap a topic if an expert disputes it (Tower Bridge's "chocolate brown" was swapped for this reason, 11 Nov).
| Day | Question · options (answer in bold) | Continent |
|---|---|---|
| Thu 12 | What colour was the Eiffel Tower at first? · gold, grey, **red** (built 11 Nov as showreel-c3-eiffel-red; swapped from Tower Bridge) | Europe |
| Fri 13 | What keeps the Taj Mahal white? · bleach, **a clay face mask**, new marble (multani mitti mud packs draw out the yellowing) | Asia |
| Sat 14 | What did engineers do to Niagara's American Falls in 1969? · froze it, **switched it off**, moved it (a dam of rock dried it for months) | North America |
| Sun 15 | What colour were ancient Greek marble statues? · white, gold, **bright paint** (traces of pigment under UV) | Europe |
| Mon 16 | What colour were Big Ben's clock dials trimmed at first? · black, gold, **Prussian blue** (restored in the 2017-2022 works) | Europe |
| Tue 17 | What did Easter Island's moai once have? · wings, crowns, **eyes** (white coral with dark stone pupils) | Oceania |
| Wed 18 | Where did Stonehenge's bluestones come from? · next door, **Wales**, France (about 240 km away; check the altar stone's Scottish origin as the "one more fact") | Europe |
E19's verdict is read Sun 15 (3 reels); from Mon 16 the rows run only if it is kept, otherwise as 25-35 s journeys.

## @techin20sec, Thu 12 - Wed 18 Nov 2026: "3 settings to change today" (E17; planned 11 Nov, rules-tech.md rewritten the same day)
Each reel: one benefit, three settings that exist on iPhone AND Android (rule 3: both paths on screen, each checked on Apple's and Google's
own pages that morning; swap any setting one platform lacks), kind `phone` x3 + the recap checklist, `hook_toggles` in frame 0, 20-22 s.
Start from techreel/topics/stop-tracking.json (copy, change the words). These replace the Thu 12 - Sun 15 explainer rows above.
| Day | Hook | The three settings (check each path that day) |
|---|---|---|
| Thu 12 | 3 settings that stop apps TRACKING you (built 11 Nov as showreel-tech-stop-tracking) | Location While Using · Precise Location off · ad tracking off / delete advertising ID |
| Fri 13 | 3 settings that stop SCAM calls | iPhone Silence Unknown Callers / Android caller ID and spam filter · filter unknown texts · block a number from the call log |
| Sat 14 | 3 settings to switch on BEFORE your phone is stolen | Stolen Device Protection / Theft Detection Lock · Find My / Find Hub on · a SIM PIN |
| Sun 15 | 3 settings that make your battery LAST longer | auto-lock / screen timeout 30 s · Low Power Mode / Battery Saver at 20% · charging limit (80% Limit / Battery protection) |
| Mon 16 | 3 settings that free up STORAGE today | offload / archive unused apps · keep messages 1 year, not forever · optimise photo storage |
| Tue 17 | 3 settings that stop eating your mobile DATA | Low Data Mode / Data Saver · Wi-Fi Assist / Adaptive connectivity off · app background data off |
| Wed 18 | 3 settings that help you SLEEP | Night Shift / Night Light · a bedtime focus / Bedtime mode · grayscale at night |
Swap a day for a better benefit only when the numbers say so (E17 verdict Sun 15); never repeat a setting.
