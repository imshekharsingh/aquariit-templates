# Review: showreel-tech-charger-watts (tech, postOn 2026-11-15 postAt 13:00 IST)

Gadget myths · charger · global (design/topics.md Sun 15 row; yesterday was worth it or not · earbuds · India, so format, gadget and audience
all rotate). The first 40-45 s story-look reel (42 s), E25 try 1 ("40-45 s story format" vs the median; design/experiments.md) and E24 try 3.
Story: payoff (frame 0: MYTH over a 96 W charger charging a phone; "Bigger chargers don't hurt your phone.") -> ONE question ("So why doesn't a
big laptop charger overload a small phone?") -> step 1 Apple: a higher-wattage USB-C adapter is fine, even a Mac laptop's -> step 2 the
mechanism: phone and charger agree on power first (USB Power Delivery; the charger's 5 / 9 / 15 / 20 V offers, the phone picks one) -> step 3
bigger can be faster (iPhone 17: 50% in about 20 min on 40 W+) -> surprise: the real danger is heat (Apple: above 35 °C capacity can be lost
for good) -> takeaway: any good USB-C charger is fine; hot while charging? take the case off.
Media (rules-tech.md R0): the Sun (NASA SDO, public domain) under the heat beat. Two Media runs (43623733260, 43629144220) were read on their
sheets and every other pick was dropped: an electric-car plug, a burnt circuit board (wrong story), a charger held in a hand (a person), a
USB-C plug PNG whose transparent background flattened to grey blocks (looked broken in the stills); the USB-C candidates with a clean product
showed branded tablets and laptops. So the charger and phone are our own generic drawings (F3: no product photos or trade dress), in the story
look's lit rooms. R0 is met for one shot of seven; said plainly here for the critic.
AUTO lines from `python3 techreel/make.py charger-watts --fake-vo --stills ...` (final topic and engine; the last run added a tick loop to the cards
shot for the sound gap). One sheet of 10 stills read at phone size (plus two earlier sheets that found and fixed: a phone-only step with no
charger, chips crowding the phone, labels under the caption band, a voice 3 s too long, a blurred plug photo, four shots of the same picture).

1. Topic: PASS: anyone who owns two chargers feels it in 1 s; not done before (captions.json: charge-80 and heat-battery are about charge limits and heat, not charger wattage); rulebook design/rules-tech.md: R0 partial-pass (one real photo, reasons above), S1 pass (frame 0 = the answer: MYTH over the big charger charging), S2 pass (STORY: payoff -> question -> step -> step -> step -> surprise -> takeaway: ok; every step and the surprise carry a source), S3 pass (big words 70-180 px in the top band, subject big in the stage, captions low), S4 pass (ember, dusk, ocean, cobalt, jade, rose, gold), S5 pass (match, zoom, pan, push declared), S6 pass (LENGTH: long (42 s), 114 words, voice ends 38.3 s: ok), S7 pass (subjects end above the captions), S8 pass (below), F1 pass (gadget myths, charger; yesterday worth it or not, earbuds), F2 pass (global; yesterday india), F3 pass (Apple and iPhone named as text for facts from Apple's own pages, no logos, no brand put down), F4 pass (the verdict said and shown: ANY GOOD USB-C / HOT? CASE OFF), F5 pass (MYTH stamped in frame 0, the verdict returns on the takeaway), G5 pass (dark calm moods, one accent), G7 pass (ELEMENTS below), G13 pass (no rolling digits; 50% / 40 W / 35 °C land on their words), V1 pass (speed 1.0, long class), V2 pass, V3 pass, V4 pass
2. Frame 0: PASS: the subject is the answer happening: a 96 W charger lit gold, a cable with power pulses, a phone charging with a bolt, MYTH / BIG CHARGERS HURT PHONES in the top band, the payoff line in the caption band; HOOK: the words sit above the subject (no hook card in the story look); SUBJECT FILL by layout (charger + phone span x 85-920, y 640-1300)
3. Safe zone: PASS: SAFE ZONE: ok (every caption, big word, chip, card and readout inside x 60-960, y 250-1570, scanned every 0.5 s)
4. No overlap: PASS: OVERLAP: none; BAND: the subjects end above y 1330, captions centred at y 1462 on every still
5. Motion: PASS: the camera never stops (drift + 7 declared moves); pulses run along the cable, the battery fills, offers pop in, cards slam, the dial sweeps, the lock screen pulses; FLOW dead runs none (the final 3.4 s declared as a hold on the verdict in the topic's "holds")
6. Subtitles: PASS: word-by-word captions, 2 rows at most, every line shown and finished on the stills
7. Voice: PASS: PREFLIGHT voice: 491 letters, about 40.8 s at speed 1.00 (limit 41.3): fits; PRONUNCIATION: 2 overrides used: iPhone, USB; no unchecked words
8. Sound: PASS: ELEMENTS: 109 element sounds (small high 81, medium mid 14, large low 14); longest gap 1.0 s at 31.0 s; every piece of the new `charge` kind has its sound (offers small, the pick and the phone mid, the shot's entry low, a tick per pulse); the render's SOUND GATE and SOUND DETAIL check loudness and audibility
9. Payoff: PASS: the takeaway: a 65 W charger charging a phone to green, ANY GOOD USB-C / HOT? CASE OFF over it, held 3.4 s after the last word
10. Facts: PASS: Apple, Charge and connect with the USB-C connector on your iPhone (support.apple.com/en-us/105099): USB-C adapters incl. USB Power Delivery; "a 20W USB-C power adapter or higher-wattage USB-C power adapter, like the one that came with your Mac laptop, you can use it with your iPhone"; Apple, Fast charge your iPhone (102574): iPhone 17 up to 50% in around 20 minutes with a 40W adapter or higher, USB-PD; Apple, Batteries, Maximizing performance: above 35 °C can permanently damage battery capacity, charging in heat damages it further, take it out of its case if it gets hot. All three read 14 Nov 2026 in the session. The 5 / 9 / 15 / 20 V offers are the USB Power Delivery standard's fixed voltages, drawn as an illustration of the negotiation (the phone's pick is illustrative); npm run check passes
11. Post data: PASS: captions.json entry (tech, postOn 2026-11-15, postAt 13:00, concept, experiment tech-story-long); caption with the numbers and a send line, 6 keywords, 5 hashtags; "media" carries file, author, licence and source_url for the Sun photo (Output QA LICENCE); design/safety.md read: no logos, no people, no brand put down
12. Review file: PASS: this file, items 1-11 and 14-17 PASS before the one render
13. After the render: PASS: run 43637038995 green (14 Nov ~21:15 IST; renders 1-2, runs 43633250649 / 43634905195, failed only the SOUND GATE true peak at -0.7 dBTP, fixed in the engine's mux: a 0.4 s end fade and a measured true-peak loop, PR #882); voice in one take at speed 1.00, ends at 38.27 s; -14.4 LUFS, true peak -2.3 dBTP (mux try 1); SOUND DETAIL 97 of 97 audible; OUTPUT QA: PASS (LICENCE, PACE 3.00 words/s, STRAY, LOUD, SOUND, COLOUR no hard cuts, EDGES, NUMBERS 17/20/40/35 no contradictions, SYNC overload 3.6 / Power Delivery 14.6 / heat 26.0 / case 37.7 s, DEAD none). The contact sheet was not read in the session (scripts/reel-status.mjs reads Showreel runs only); the critic reads the stills
14. Cuts: PASS: FLOW: cuts 0 (7 declared moves: match, zoom, pan, push and the cycle)
15. Dead runs: PASS: FLOW: dead runs none (holds: 38.6-42.0 s, the verdict rests on screen after the last word)
16. Continuity: PASS: FLOW: continuity 90% (median step 0.7, 7 declared transitions)
17. Strobes: PASS: FLOW: strobes 0

Owner feedback, line by line (design/owner-feedback.md) against the stills: "still looks poor" with drawn shapes (14 Nov): the risk here; the
real Sun carries the heat beat and every other photo found looked worse than the drawing (above), the drawings are lit and shaded in the story
look's moods; "looks a bit flat" (14 Nov): the key idea happens on screen (the offers and the pick, power pulses, the battery filling, cards
slamming); "everything inside a small phone screen" (13 Nov): the charger, cable and phone span the frame, words 70-180 px; every named item on
screen when said (OVERLOAD, USB POWER DELIVERY, HEAT, CASE OFF: the qa.sync list); "audio slowed" (12 Nov): speed 1.0.
Would I stop and watch twice? Stop: MYTH over a big charger is a belief most people hold. Twice: the 5/9/15/20 V handshake is the save.
Improvement used (design/improvements.md, tech top item): frame 0 = the claim it breaks at full-frame scale (MYTH / BIG CHARGERS HURT PHONES
over the 96 W charger charging). Craft improvement: the new `charge` shot kind (design/craft-log.md, 15 Nov).

References used (design/references.md): none new; the story look's reference kit (design/kits/motion_kit.zip) techniques via scenes/story.py.
