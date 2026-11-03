# Planned topics (spare-usage night plans the next week every Tuesday)

A run takes the topic for its channel and day from here, skips any already built (captions.json), and may swap one for a better or
fresher idea (say why in the log). Facts are still checked against two sources (Turns Out) or a primary source (web, tech) before building.

## Week of Mon 9 - Sun 15 Nov 2026 (planned Tue 3 Nov)

### @webin20sec (narrated "Why does your ...?" tip, one CSS/HTML fix, MDN + BCD support)
| Day | Hook | The fix |
|---|---|---|
| Mon 9 | Why did your sticky header stop sticking? | position: sticky breaks under an ancestor with overflow: hidden; overflow: clip keeps it |
| Tue 10 | Why does iPhone zoom in when you tap a form? | inputs under 16px zoom on focus in Safari iOS; font-size: 16px (max(16px, 1rem)) |
| Wed 11 | Why does your layout jump when a page gets long? | the scrollbar appears and steals width; scrollbar-gutter: stable |
| Thu 12 | Why do your links hide the heading under the header? | scroll-margin-top on the target (or scroll-padding-top on html) |
| Fri 13 | Why did the focus ring vanish? | outline: none kills it for keyboards; :focus-visible keeps it for keys, not taps |
| Sat 14 | Why does your text flash in the wrong font? | font-display (swap vs optional) and a size-adjusted fallback |
| Sun 15 | Why does one long name break your card? | min-width: 0 on the flex child + text-overflow: ellipsis (or line-clamp) |

### @techin20sec (only if the 6 Nov audit keeps the format; "How does / why does" + the mechanism step by step)
| Day | Hook |
|---|---|
| Mon 9 | Why is Wi-Fi slower one room over? (2.4 vs 5 GHz, walls, range vs speed) |
| Tue 10 | How does tap-to-pay work without your card number? (device token, one-time cryptogram) |
| Wed 11 | Why are screenshots of some videos black? (protected video path, DRM) |
| Thu 12 | What does airplane mode actually turn off? (radios; Wi-Fi and Bluetooth can come back on) |
| Fri 13 | How does a torn QR code still scan? (error correction levels L/M/Q/H) |
| Sat 14 | How does your phone know where you are indoors? (Wi-Fi and Bluetooth positioning, no GPS) |
| Sun 15 | Why does fast charging slow down near full? (constant current, then constant voltage) |

### Turns Out (true story, 2.5D, 25-35 s; 5 continents in the week)
| Day | Hook | Continent |
|---|---|---|
| Mon 9 | Why is Mount Everest named after a man who never saw it? (Peak XV, 1856; Sagarmatha / Chomolungma) | Asia |
| Tue 10 | Why does the Panama Canal's Pacific end lie east of its Atlantic end? | Americas |
| Wed 11 | How did the builders point the Great Pyramid almost exactly north? | Africa |
| Thu 12 | Why is Australia's capital Canberra, not Sydney or Melbourne? | Oceania |
| Fri 13 | Why does Brazil speak Portuguese when its neighbours speak Spanish? (Tordesillas, 1494) | South America |
| Sat 14 | Why do we add a day every four years, but not always? (Julian 46 BC, Gregorian 1582) | Europe |
| Sun 15 | Why is Japan called the Land of the Rising Sun? (Nihon, "the sun's origin") | Asia |
