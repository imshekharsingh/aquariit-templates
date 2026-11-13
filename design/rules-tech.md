# @techin20sec rulebook (the gate every tech reel passes before its one render)

Same use as design/rules-web.md: score every rule (pass / fail, one line each) in the stills review before the one render; fix or swap on a
fail; the daily audit adds, changes or drops a rule with the number.

**Rewritten 13 Nov 2026: the gadget channel** (CLAUDE.md, "@techin20sec: gadget channel built for brand collabs"). Owner, 13 Nov: "I'm not
liking the content we are focusing on" (the "3 settings" format) and, on the scam-calls stills, make the animation "a similar grade as web"
and "more organised, with flow on the screen". Evidence: 1-13 Nov every tech reel (explainers, myth-busts, settings lists) reached 113-152,
0-2 saves; the settings format (E17) gave the best reel (stop-tracking, 152 reach, 2 saves) but the owner does not want the channel built on
it, and settings lists do not lead to gadget-brand collabs. The old rulebook (settings format, phone walkthrough look L1-L7) is in
attic/design/rules-tech-2026-11-12.md; its palette (L7), pronunciation, FLOW and voice rules carry over below.

## Format (F1-F4)
- **F1. Three formats, rotating**: (a) **specs decoded**: what a number on the box means for you (mAh, nits, Hz, IP68, ANC, watts, megapixels)
  and when it is marketing; (b) **worth it or not**: is a feature worth paying extra for (120 Hz, wireless charging, 1 TB, an ultra-wide);
  (c) **gadget myths**: a belief about charging, batteries, cameras or speakers, settled by the maker's own pages. No two days in a row with
  the same format or the same gadget type (phone, earbuds, watch, charger, laptop, speaker); design/topics.md plans the week.
- **F2. Audience mix**: 7 reels a week, 3 for India (prices in ₹, brands and models sold in India, Indian buying questions) and 4 global;
  the topic file carries `"audience": "india" | "global"`, `"format"` and `"gadget"`, and the audit reads reach by audience.
- **F3. Brands, diplomatically** (owner, 13 Nov 2026): real brand and model names only as text and voice, for facts; every product at its
  strengths, no winner / loser, no mocking, no "X is worse"; never logos, trade dress, product photos or marketing art (products drawn
  generically by us); every spec from the maker's official spec or support page (or the standard), cited in the topic's "sources" with the date read.
- **F4. One useful verdict a viewer can act on**, said in the last line and shown on the product ("IP68 saves a spill, not a swim"): the
  reason to save and send. The caption repeats it in text with the numbers and invites a send to a named kind of friend.

## Look and motion: the idea look (G9-G13; techreel/scenes/idea.py, topic `"look": "idea"`; the default for every tech reel from 13 Nov)
Owner, 13 Nov 2026: "Tech reel animation doesn't live up to expectation"; "Let's build it with new animation." The parent review of the gadget
IP68 stills: everything happened inside a small phone screen (under half the frame width, numbers and labels tiny on a real phone, the rest of
the frame black), every scene was the same phone with only its screen text changing (a slideshow), and the motion was small. These rules
override G1-G4 below; G5-G8 (palette, frame 0, sound, captions) still apply.
- **G9. The idea at full-frame scale**: one subject per scene filling 70-80% of the frame (giant type, the product's edge in macro, water
  across the whole frame, big cards, a before/after split), never widgets inside a small screen. A phone screen appears only when the screen
  itself is the point, and then large. Check: every number and label readable at phone size (34 px+), nothing small in an empty frame.
- **G10. Every scene a different world**: no two scenes share the same picture with new text; consecutive scenes may share a world (`"world"`
  key) only when the camera moves through it (water rising, then the camera following the phone down).
- **G11. The idea itself moves**: one big moment per scene where the concept acts (dust bounces off the sealed seam, water rises, cards slam,
  the divider wipes new into worn), and a travelling element ties the scenes (IP68's 6 and 8 fly out of the word into the tag row and back).
- **G12. The camera leads the eye** (rules-web.md rule 14): each scene pushes towards what the voice names (`"push": [zoom, x, y]`), a drift
  that never stops, a declared zoom-through between worlds (FLOW reads them), a jolt on a slam.
- **G13. Numbers on screen equal the voice**: a readout pops on its word with the value said (no rolling digits that Output QA NUMBERS could
  read as a different number); a ring or a bar may sweep.

## Old layout rules (G1-G8; techreel/scenes/gadget.py, topic `"look": "gadget"`; G1-G4 retired 13 Nov by G9-G13)
- **G1. One fixed layout for every scene**: the header row at the top (the format pill in gold + a short title, a progress bar under it), the
  drawn product centred in the stage (y 384-1326) and fully inside the frame at every zoom, the captions in their own band below (y ~1350-1530).
  Nothing moves between left, centre and right; nothing sits on the product but its own screen. (13 Nov parent review: the phone moved left /
  centre / right, its foot was always cut, captions sat on the empty phone, the path card covered it.)
- **G2. The product's screen is full**: its widgets (title, spec, meters, rows, counts, rings, bars) share the whole screen height and enter
  together at the scene's start (staggered 0.07 s); a widget with a cue waits dimmed and lights up ON its word. No half-empty screen in any still.
- **G3. Web-grade motion** (scripts/explainer/kitmotion.js): numbers count up to the value said and never past it (no "29" after "thirty" is
  said, no overshoot), meters fill segment by segment on springs, items stagger in, a ripple and a gold edge on the detail being named, the
  camera leans in at most 6% towards it and back (rules-web.md rule 14: the camera leads the eye), a slow drift so nothing is ever still, the
  screen content slides up between scenes (declared transitions).
- **G4. Side callouts** in two fixed columns (x 64-234 and 786-956), joined to the product by a leader line with a dot and one ripple; short
  (a value and a 1-2 word label), never repeating a whole line.
- **G5. The dark palette** (old L7, owner 12 Nov): one near-black background with a soft warm glow, the product in dark greys, ONE gold accent
  (the named detail, counts landing, the format pill, the spoken word), red / green only as small dots, water a low-saturation steel blue.
  Check: the cover at thumbnail size is calm and premium.
- **G6. Frame 0 = the subject doing the thing** (the phone half under water, the charger at 100%, the earbuds with ANC on) with the hook
  question in the caption band, its key term gold; readable in under 1 s.
- **G7. Every element has its sound** (recorded CC0 samples): entrances small, activations and callouts medium, counts landing and water low;
  ELEMENTS longest gap under 1.6 s; SOUND DETAIL 80%+.
- **G8. Word-by-word captions** 2-4 words at a time (`chunks`), 80 px heavy, white with a black outline, the spoken word gold.

## Voice, length and gates (V1-V4, kept from the old rulebook)
- **V1. 20-22 s at the natural voice, speed 1.0**, about 3 words/s, 55-66 words, one sentence per scene, the hook 6 words or fewer (HOOK PACE).
- **V2. Tech terms said the way people say them** (scripts/voice/say.json or the topic's "say"; PRONUNCIATION: no "check:" words).
- **V3. FLOW** (cuts 0, no dead runs, continuity 85%+, at most one declared strobe), SAFE ZONE ok, OVERLAP none, SOUND GATE, SOUND DETAIL, and
  the GitHub Output QA PASS on the final MP4.
- **V4. Post one reel EVERY day at 13:00 IST** (owner, 8 Nov 2026); no topic repeated on the channel or covered by @webin20sec.

## Experiment
**tech-gadget-specs (E24, from 13 Nov)**: the gadget format in the fixed layout. Try 1: showreel-tech-ip68 (13 Nov, specs decoded, global,
phone). Decide after 3 reels (13, 14, 15 Nov) on Sun 15 / Mon 16: a reel WINS at 150+ reach in 24 h (no tech reel since 1 Nov passed 152) or
3+ saves and shares. 2 of 3 WINs: the format stays and the formats keep rotating; 0-1: change the look or the hook style next (one change).
E17 (settings lists) ends early by the owner's decision on 13 Nov, 2 reels in (stop-tracking 152 / 2 saves; scam-calls replaced the same
morning, never posted): "What didn't" in design/playbook.md with that reason.
**tech-idea-look (from 13 Nov, owner: "Let's build it with new animation")**: the idea look replaces the gadget layout from the remade
showreel-tech-ip68 on; E24 (gadget format) keeps counting its 3 reels in this look. Read with the 24 h reach and hold of 13, 14, 15 Nov.
