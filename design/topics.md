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
| Thu 12 | (built early as showreel-25-anchor, posts 6 Nov, with scroll-padding-top on html) Why do your links hide the heading under the header? | scroll-margin-top on the target (or scroll-padding-top on html) |
| Fri 13 | Why did the focus ring vanish? | outline: none kills it for keyboards; :focus-visible keeps it for keys, not taps |
| Sat 14 | Why does your text flash in the wrong font? | font-display (swap vs optional) and a size-adjusted fallback |
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
| Mon 9 | Why was the Great Sphinx buried up to its neck in sand? (swapped 8 Nov for a visible transformation: rules-c3.md ESCALATE; Everest moves to a later week) | Africa |
| Tue 10 | How did one ball shape the Sydney Opera House? (swapped 8 Nov: Panama is a map fact, not a visible transformation of a landmark; rules-c3.md ESCALATE; Panama moves to a later week) | Oceania |
| Wed 11 | Was the Terracotta Army once painted in bright colours? (built 11 Nov as showreel-c3-terracotta-colour, the first reel on the depth kit; swapped 9 Nov, rules-c3.md rule 10; the pyramid-north story moves to a later week) | Asia |
| Thu 12 | Was Tower Bridge once painted chocolate brown? (1894 brown, 1977 red-white-blue, now blue and white; swapped 9 Nov, rule 10; Canberra moves later) | Europe |
| Fri 13 | Why did the Taj Mahal need a mud face mask? (yellowing marble, clay-pack cleaning; swapped 9 Nov, rule 10; Brazil moves later) | Asia |
| Sat 14 | Was Niagara Falls ever switched off? (American Falls dried in 1969; swapped 9 Nov, rule 10; leap day moves later) | North America |
| Sun 15 | Were Greek marble statues once brightly painted? (the Parthenon and its statues in colour; swapped 9 Nov, rule 10; Japan's name moves later) | Europe |
