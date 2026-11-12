# @techin20sec rulebook (the gate every tech reel passes before its one render)

Same use as design/rules-web.md: score every rule (pass / fail, one line each) in the stills review before the one render; fix or swap on a fail;
the daily audit adds, changes or drops a rule with the number.

**Rewritten 11 Nov 2026** (owner: "Go all in on techin20sec ... don't bother about the existing pattern, theme or anything, we need to get it to
work"). Evidence (Instagram collect, 11 Nov 18:19 IST): 11 followers; the 9 explainers and myth-busts since 1 Nov all reached 113-133 (median 119)
whatever the topic, hour, look or stamp, every one ending at x1.0 of its 6 h reach; 0 saves and 2 shares in 10 reels; watch 3.4-8.8 s of ~20 s
(~28% hold). Turns Out has FEWER followers (8) and reaches 1,059-1,273 with ~50% hold, so the ~120 pool is not the follower count: Instagram's
first test audience is not keeping, saving or sending these reels. "How does X work" is curiosity with nothing to do; the old rules 1-4, 9 and 10
were all passed by reels stuck at 119 (the audit's "question it" lines) and are dropped. The new format gives the viewer something to DO, now,
on their own phone, and a reason to save it and send it.

**12 Nov 2026: the phone walkthrough LOOK** (owner: "Tech reel doesn't feel like a change at all, same things, same design pattern, how do we
expect to get audiences?"). The format (E17) stayed but the look did not: the glass panels, labels and small phone read as every tech reel since
1 Nov (113-133 reach). From showreel-tech-stop-tracking (12 Nov) every tech reel uses topic `"look": "phone"` (techreel/scenes/phonecam.py).
Evidence (design/references.md, R-trend 12 Nov): the settings videos that travel are a phone screen walked tap by tap (820k, ~2M and 6M views in
press coverage of "settings to turn off" videos), and word-by-word captions with the spoken word highlighted beat plain subtitles (vendor data,
direction repeated, size unproven). Rules L1-L6 are the gate for the look; rules 1-9 below still hold for the format.

- **L1. One big phone fills the frame** (720 px wide, running off the foot of the frame), on a flat bold colour that changes with every setting
  (blue, purple, red, green for the save): the viewer sees "a phone" in frame 0. Our own generic drawing: no platform UI, icons or fonts.
- **L2. The touch indicator walks the real path tap by tap, ON the word that names it** (`steps` [{page, tap, cue, action}]): every step's
  `cue` is a word in the line ("in Location" → tap Location; "your app" → tap the app; "While Using" → the tick moves). 2-3 taps per setting, a
  page push after each, the camera leaning in to every tap (1.09, the change 1.13). The script is written as the path ("One: in Location, set your
  app to While Using, so ...").
- **L3. The result as a notification banner**, dropping in at the top of the screen after the change: red (the old state, struck through), then
  green with a tick (the new state). Never under the path card or the captions.
- **L4. The 1/3 counter and the setting's name, top left; both paths on a black card (36 px) for the whole setting** (rule 3, critic Q13).
- **L5. Word-by-word captions**: 2-4 words at a time (`chunks`), 88 px heavy, white with a black outline, the spoken word yellow and lifted.
- **L6. Frame 0 = the result**: the hook in 112 px heavy type (the key word yellow) over the phone showing `hook_page`: three red values flipping to
  green safe values by 1.1 s (critic Q15: the flips show the protection, never a "turn off" setting going ON).
- Verdict with E17 on Sun 15 Nov: the same targets (24 h reach 150+, or 3+ saves and shares). The look is the change; topics stay settings lists.

1. **Format: "3 settings to change today"** (experiment tech-settings-list, E17): one benefit per reel (privacy, battery, scam calls, storage,
   theft, data, sleep), three phone settings that deliver it, each tapped on a phone we draw (kind `phone`: a generic settings screen, a finger
   taps the row, the switch or tick flips on the word, a before → after pill, the path on both platforms), then the recap (kind `checklist`).
   Evidence: 9 explainers / myth-busts at 113-133, 0 saves; research (11 Nov): settings and "hidden feature" lists are the most saved and sent
   tech format on Reels (vendor guides, so a hypothesis to test, not a fact).
2. **The payoff in frame 0**: the hook names the number and the benefit ("3 settings that stop apps TRACKING you") and the switches are on
   screen at frame 0, flipping on by 1.1 s (topic `hook_toggles`); the first setting is tapped by ~6 s. Evidence: the best tech reel ever
   (airplane mode, 133 reach, 8.8 s) and every Turns Out winner showed the payoff first; explainers that opened on a question held ~24%.
3. **Every setting exists on iPhone AND Android, with both paths on screen**, each checked on the platform's own page (support.apple.com,
   developer.android.com, Google's help pages) that day. A setting one platform lacks is swapped. Evidence: owner 8 Nov, "we lean too much on
   Apple"; a path people can follow is what makes the reel worth saving.
4. **Built to be saved and sent**: the last scene is the recap checklist (label "SAVE THIS · ..."), the voice says "save this", and the caption
   lists the three settings in text (so the post works as a note) and invites a send to a named kind of friend. Evidence: 0 saves, 2 shares in
   10 reels; sends per reach is Instagram's main signal for reaching non-followers (Mosseri, as reported by several 2026 guides).
5. **20-22 s at the natural voice pace, one complete sentence per setting**: "Number: do X, so Y for you." (what to change, then what it does for
   you, joined by "so"). Kokoro at speed ~1.0, about 3 words/s, 60-66 words. Evidence: owner 8 Nov, "clearer sentences, not slowed"; at 29 s the
   slowed voice lost the owner, at 18 s the explainers lost the viewer.
6. **Post one reel EVERY day at 13:00 IST** (owner, 8 Nov 2026). E15 showed timing was never the lever (19:00 median 129, inside the same pool).
7. **Tech terms are said the way people say them** (scripts/voice/say.json; the preflight PRONUNCIATION line shows no "check:" words). Evidence:
   5 Nov, "Wi-Fi" read as two words.
8. **Every reel passes FLOW** (Mandatory Gate items 14-17: cuts 0, no dead runs, continuity 85%+, at most one declared strobe), and SAFE ZONE,
   OVERLAP, SOUND GATE, SOUND DETAIL and the voice check after the render. These protect quality whatever the format.
9. **No repeat**: no setting already shown on the channel, no topic @webin20sec covers. Check captions.json and design/topics.md first.

**Decide E17 on Sun 15 Nov** (the owner's engagement day) after 3 reels (12, 13, 14 Nov): a reel WINS if its 24 h reach is 150 or more (no tech
reel since 1 Nov passed 133) or it gets 3+ saves and shares together. 2 of 3 WINs: keep it and make it the channel's format. 0-1: drop it to
"What didn't" in design/playbook.md and test the next format in design/experiments.md, "Queue of next ideas".

Dropped 11 Nov (the numbers do not support them): old rule 1 (an everyday puzzle, 113-133), rule 2 (answer's first step in 2 s; kept in spirit
as rule 2), rule 3 / 10 (length caps; now rule 5), rule 4 (a takeaway to save: 0 saves; now rule 4 with the recap), rule 9 (the verdict stamp:
lifted watch 4.7 → 6.0 s, never reach: 117-123), rule 11 (platform balance; now rule 3, both paths).

**12 Nov audit:** ESCALATE tech (median reach 119, ALARM two days running) is answered by E17 starting today (showreel-tech-stop-tracking,
13:00: a new format, not a tweak). PROMOTE tech-myth-verdict (3 WINs: +8%, +1%, +2% vs median) was already written on 11 Nov as old rule 9
and dropped the same day in the rewrite: its wins are inside the 113-133 pool (watch 6.0 / 5.2 / 6.4 s vs 4.7, reach flat), so it lifts
watch, not reach. It is the fallback format if E17 is dropped on Sun 15 (not a rule while E17 runs).

