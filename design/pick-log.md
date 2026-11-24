# Pick log: what Fable kept and rejected each day (design/runbook-daily.md "Fable decides")

One line per channel per day, written by the builder right after the Fable pick:
`YYYY-MM-DD | web|tech | W26-1:keep W26-2:keep W26-3:reject W26-4:reject W26-5:reject`
(every option shown that day gets one word, keep or reject; ids from design/topic-bank.md).
`node scripts/pick-sheet.mjs --log` reads the last two logged days. 8 or more rejected of the 10 options on each of those two days = the option
research moves to Opus (add a line `2026-MM-DD | note | research to Opus` here; it moves back after a day with 3 or fewer rejected).

