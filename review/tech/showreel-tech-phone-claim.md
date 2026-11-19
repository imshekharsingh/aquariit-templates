# Review: showreel-tech-phone-claim (tech, postOn 2026-11-19 postAt 13:00 IST)

The Mandatory Gate, design/mandatory.md. Built 19 Nov by the daily run, the day it posts, on the kit engine's shared frame
(techkit/base.html + techkit/scenes/phone-claim.js). AUTO lines from `python3 techkit/make.py phone-claim --fake-vo --stills ...` (fake
timings; the render re-times to the real voice); stills sheet at 12 moments read at phone size; HERO and SHEEN from the scene's own frames
(KIT_SCALE=0.25 capture.cjs + scripts/qa/look.py).
Why this reel: the 19 Nov audit says tech OK (median 343, target 300) with the kit engine winning (night mode 1,481, 5 ATM 1,207, 120 Hz 958, laptop
1,413 at 24 h). The plan (design/topics.md, Thu 19) is a specs-decoded day for India after yesterday's myths: a phone, so no gadget repeats yesterday's laptop.
SWAP, said why: the planned power bank (mAh at the cell voltage vs what you get) needs a maker's "rated capacity" line, and the maker pages (mi.com, anker.com,
samsung.com) cannot be reached from this environment, so no figure could be checked against a primary source today (CLAUDE.md: facts checked against a
primary source). Apple's India iPhone 16 spec page loads, and it carries a decodable claim: video 22 h, streamed 18 h, audio 80 h, with a footnote. The power
bank row moves to a day when a maker page can be read.

1. Topic: PASS: What does "up to 22 hours" on a phone really mean? (specs decoded, phone, India; yesterday gadget myths, laptop): every phone buyer reads a battery claim; not done on any channel (captions.json: 5 ATM and 120 Hz were specs for other gadgets). Rulebook (design/rules-tech.md): K0 pass (kit engine, shared frame, 7-beat arc), K1 pass (no sheen: SHEEN PASS 0 sweeps; no box round the hero; the idea happens on the phone's own screen), K2 pass (the screen changes on every beat; HERO 69%), K3 pass (frame 0 is the cover: title and the phone inside the centre 3:4), F1 pass (specs decoded, phone, India; not two days alike), F2 pass (India), F3 pass (Apple named as text for facts, no logo, the phone drawn generically, no winner or loser), F4 pass (the verdict "up to is a ceiling, check the streamed number" said last and shown), V1 pass (natural speed 1.0)
2. Frame 0: PASS: the cover (K3): the title "Up to 22 hours?", the phone with 22 HOURS filling its screen, an UP TO stamp and the full battery; held still while the cover holds, then a ring of 22 hour ticks lights round the number; SUBJECT FILL: the phone is 41% of the frame width (440 of 1080)
3. Safe zone: PASS: SAFE ZONE: ok (DOM text and every canvas label every 0.5 s)
4. No overlap: PASS: OVERLAP: none (the first sheet had the hour ticks crossing the digits and the ceiling line crossing "22 h": ring moved out to r 150-176 with the number at 190 px, the line moved 16 px right)
5. Motion: PASS: the phone's screen transforms on every beat (number, test, small print to scale, blurred ends, ceiling); FLOW: dead runs none; local Output QA HERO PASS 69% (still moments left at the cover hold and a few beat starts), SHEEN PASS
6. Subtitles: PASS: SUBTITLES: at least 52 px, at most 6 words a line; CAPTIONS: 43 chunks, every spoken word shown (the last line as the title slam "That's the 'up to' ceiling.")
7. Voice: PASS: PREFLIGHT voice: 486 letters, about 40.4 s at speed 1.00 (limit 44.0): fits; PRONUNCIATION: 1 override used: twenty-two (config, said "twenty two"); no unchecked words; natural speed 1.0; about 110 words in 7 lines
8. Sound: PASS (by design; measured on the render at item 13): kit bed + 21 cue effects (blip on "day", snap on "test", ticks, pops on the three numbers, snap on "eighty", riser on "varies", pops on "apps" and "settings", snap on "ceiling", thud on "promise", chime on "closest", pops on the pills, impact and chime on the title slam)
9. Payoff: PASS: the recap: the phone pulls back with the small print (22 h, 18 h, 80 h) and the ceiling line, two pills land on "ceiling" and "streamed", then the title slam "That's the 'up to' ceiling." read standing still (a declared hold)
10. Facts: PASS: Apple India, iPhone 16 Technical Specifications (read 19 Nov 2026 with curl): "Video playback Up to 22 hours", "Video playback (streamed) Up to 18 hours", "Audio playback Up to 80 hours"; footnote "Battery life and charge cycles vary by use and settings. Battery tests are conducted using specific iPhone units." The bars are drawn to scale (22 : 18 : 80); "YOUR DAY" is a drawn marker with a question mark, not a measured number; no figure beyond Apple's page
11. Post data: PASS: captions.json entry (channel tech, postOn 2026-11-19, postAt 13:00, concept, experiment tech-number-open); topic post: caption with the three numbers, the verdict and a send to a named friend, 6 keywords, 5 hashtags, 1 source
12. Review file: PASS: this file, items 1-11 and 14-17
13. After the render: PASS: render 2, Tech reel run 44445372291 green (about 12 minutes; render 1, run 44442482136, failed only PACE: four sentences over 4.5 words/s, reworded); OUTPUT QA: PASS on the final MP4 (42.27 s): PACE 110 words in 39.3 s = 2.80 words/s (short lines are warnings), LOUD -14.6 LUFS / -2.1 dBTP, SOUND recorded CC0 samples (sonic-pi) with 14 of 14 element cues audible, HERO 68% (needs 55%) spanning 47% of the width, SHEEN 0 sweeps, COLOUR at most 3%, EDGES none, NUMBERS spoken 22, 22, 18, 80 read on screen with no roll past the voice, DEAD none (visual change in 100% of steps); LICENCE is a WARN only (no real media; the topic is drawn)
14. Cuts: PASS: FLOW: cuts 0 (7 declared camera transitions)
15. Dead runs: PASS: FLOW: dead runs none (the title slam a declared hold)
16. Continuity: PASS: FLOW: continuity 87% (median step 0.6, 7 declared transitions) (calm tech line 55%+)
17. Strobes: PASS: FLOW: strobes 0

Owner-feedback lines, read against the stills (the render is checked again at item 13): no light sweeps; the object does the thing on its words; nothing cut at the edges; every spoken line shown and finished; calm camera; numbers on screen match the voice (22, 18, 80 said and drawn).
Researched improvement (design/improvements.md): the 13 Nov tech item "Frame 0 is the surprising number itself at full-frame scale with the claim it breaks": 22 HOURS fills the screen with UP TO stamped on it, the title asks "Up to 22 hours?".
Craft improvement (design/craft-log.md): bars drawn to scale on the phone's own screen: when the 80 h audio row arrives the 22 h and 18 h bars shrink to 27.5% and 22.5% of the bar, so the three claims are compared by eye; a live screen light and a ring of 22 hour ticks keep FLOW at 87%.
References used (design/references.md): none
