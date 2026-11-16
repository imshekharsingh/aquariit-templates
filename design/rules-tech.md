# @techin20sec rulebook (the gate every tech reel passes before its one render)

Same use as design/rules-web.md: score every rule (pass / fail, one line each) in the stills review before the one render; fix or swap on a
fail; the daily audit adds, changes or drops a rule with the number.

**Rewritten 13 Nov 2026: the gadget channel** (design/rules-tech.md, "Channel brief"). Owner, 13 Nov: "I'm not
liking the content we are focusing on" (the "3 settings" format) and, on the scam-calls stills, make the animation "a similar grade as web"
and "more organised, with flow on the screen". Evidence: 1-13 Nov every tech reel (explainers, myth-busts, settings lists) reached 113-152,
0-2 saves; the settings format (E17) gave the best reel (stop-tracking, 152 reach, 2 saves) but the owner does not want the channel built on
it, and settings lists do not lead to gadget-brand collabs. The old rulebook (settings format, phone walkthrough look L1-L7) is in
attic/design/rules-tech-2026-11-12.md; its palette (L7), pronunciation, FLOW and voice rules carry over below.

## K0. The kit engine (owner, 15 Nov 2026: "port the owner's kit as it is ... get past our engine if it's not helping"; E26)
Tech reels are built on techkit/ (techkit/README.md): the owner's motion kit (design/kits/motion_kit.zip, motion_content_prompt.md) as it is,
topic `"engine": "kit"`, a scene in techkit/scenes/. Its 7-beat arc (question, problem, fix, how #1, how #2 as a numbered step flow, bonus,
recap + title slam) replaces S2's order; its drawn hero replaces R0's photos and S3's layout (header y 250, chip y 408, hero y 500-1200, panel
y 1240, captions y 1430). Kept: SAFE ZONE, OVERLAP, SUBTITLES, CAPTIONS, FLOW (techkit/preflight.mjs), PREFLIGHT voice, SOUND GATE + DETAIL,
Output QA, the review file. Vivid, high-contrast colour, motion on every key word, search keywords in the post text (web channel's inputs).

## K1. Calm, and the object does the thing (owner, 15 Nov 2026 night, on the 5 ATM frame: "covering the wave like coming in from left top corner to the right of the frame, it's happening in all videos"; "What's this in tech reels frame where actual object is? And I don't see much happening animation wise around watch"; and "too wiggly")
- No decorative sweeps: no glass sheen, glare band or light bar crossing the picture (Output QA SHEEN fails 2+ straight bright bands sweeping the hero zone; the old kit sheen made 15).
- No box around the hero: the world runs nearly the full width (x 24-1056, y 455-1228 on the kit frame); the object is a third of the width or more.
- The idea happens ON the object, on its words (squeezed, sealed, turned, filled, leaking, fogging), and the camera makes one eased move to the part named and holds; no bob, wobble, drift or looping decoration on the subject (Output QA HERO: the subject's own change, active in 55%+ of the samples from 16 Nov (K2), 33%+ of the width; a kit topic reports its box with subj()).
- Calm FLOW line for tech from 16 Nov: continuity 55%+, dead runs still under 1 s (design/mandatory.md calibration); a deliberate end hold goes in TOPIC.holds.
- On-screen shapes near a spoken number: no tick ladders, dashed rings or ring-and-dot clusters (Output QA NUMBERS read them as "6" and "7"); scan the numbers' windows with tesseract (psm 11) before the render.

## K2. An object topic opens up (owner, 16 Nov 2026, on 5 ATM render 5, which passed every check: "still doesn't do much in terms of animation around the main elements which may not attract audience ... While the current engine seem to work well but this one doesn't do much, why?")
- Why: a topic that is motion by nature (120 Hz) makes every chapter the motion; a topic about invisible forces on a rigid object (5 ATM) put the story in the backgrounds and in arrows and glows round a watch that only bobbed.
- An object topic opens up: cutaway, exploded view or parts that move; the subject transforms on every beat (it flexes, opens, its parts lift out and press back, light as named, warp, leak, fog), and the camera moves with it.
- The change is inside the subject, not round it: Output QA HERO (16 Nov) warps out the subject box's move, zoom and squeeze and leaves out a rim of 20% per side; 55%+ of the half-second samples must show change inside (render 5's watch 44% FAIL, screen-120hz 67%). Check it on the scene's frames before the render (techkit/README.md, "Calm and the object"); its line lists the still moments.
- Still K1: calm and purposeful, no constant wobble, loops or light sweeps; the subject a third of the width or more; every number on screen matches the voice (a counter stops at the spoken value).

## K3. The cover is frame 0 (owner, 16 Nov 2026: the reel cover inside the video, no separate cover file to download and upload; the owner picks that frame as the cover in Instagram)
- Frame 0, held still for the first 0.5-1 s, shows the title and the subject, readable at profile-grid size.
- The title and the subject sit inside the centre 3:4 of the 9:16 frame (y 240-1680 of 1080 x 1920: Instagram's grid crop). Check it before the render: frame 0 cropped to y 240-1680 and shrunk to about 270 x 360.
- Kit topics set `cover: true` in window.TOPIC (techkit/base.html: the header at full strength from frame 0, no fade-in) and keep the subject still until the hold ends.

## R0. Real media by default (owner, 14 Nov 2026: tech "still looks poor" after five renders of drawn shapes; "yes to free real images ... take those and work or animate your design around it")
Every tech reel is built AROUND free real photos, animated by us; drawn shapes are the overlay (type, rings, waves, charts), not the subject.
- The topic lists its photos in `"media"` ([{id, queries, sources, cut, avoid, min_side} or {id, url}]); the **Media** workflow (Actions -> Media ->
  config) searches Wikimedia Commons / Openverse (cc0, pdm, by) / NASA / Library of Congress, keeps PD, CC0 and CC BY only, downloads, cuts a
  product out when `"cut": true` and keeps the files in R2 (media/showreel-tech-<slug>/); copy its MEDIA_JSON line back into the topic
  (file, author, licence, source_url per entry). Its contact sheet (artifact media-<name>, 7 days) is the picking review: `"pick": n` or a direct
  `"url"` and run it again if a photo shows a logo, a brand's trade dress, a person's face or a watermark.
- Engine (techreel/scenes/photo.py, idea look): a cut-out `earbuds`-style entry replaces the drawn product (`PH.sprite`); `ride` cabins use the
  photo with the same id as the cabin kind (`bus`, `metro`, `flight`); a verdict panel takes `"photo": "<id>"`; `PH.rect` puts any photo through
  the camera (push-in, drift). Missing files fall back to the drawn version, so stills before the Media run still work.
- Gadgets only as generic products (no logos, no marketing photos, no product that is recognisably one brand's design, e.g. a white stem bud);
  no identifiable people. CC BY: the author goes in the caption's sources line. Output QA LICENCE checks every file; design/safety.md 5-7, 13.

## Look, story and motion: the story look (S1-S8; techreel/scenes/story.py, topic `"look": "story"`; the default for every tech reel from 14 Nov)
Owner, 14 Nov 2026 (approved L task): rebuild the engine from the reference kit (design/kits/motion_kit.zip, motion_content_prompt.md) and
"make the content rich in learning and information; people stay engaged if we follow good and smart storytelling". Overrides G9-G13 and the
HUD parts of the idea look (format pill, progress bar, tag row, chip); R0, F1-F5, G5's calm palette, G7, G13 and V2-V4 still apply.
- **S1. Payoff first**: frame 0 is the striking ANSWER image (the product doing the thing, the number big), never a question card; the
  payoff line (7 words or fewer) is said over it.
- **S2. The story order**: payoff -> ONE question -> 2-3 steps, each one concrete fact with its source (the line's `"source"` indexes
  post.sources) revealed on its word -> a surprise worth saving (sourced) -> an optional takeaway (F4). techreel/starter.py writes it;
  STORY on the stills fails anything else. Each line says what, why and what it means for you.
- **S3. The whole frame**: big words 90 px+ in the top band, the subject big in the stage (y 600-1330), full-bleed real photos (R0) under
  it, captions low (centre y 1462, inside the safe zone). Nothing small: no series badge, title strip, progress dots or credit plates;
  credits go in the caption. Check: every word on screen readable at phone size, no empty half of the frame.
- **S4. A colour mood per beat** (ember, dusk, ocean, cobalt, jade, rose, gold): light, glow and accent change with the story, each mood
  dark and calm (G5), flowing into the next during the move (Output QA COLOUR: no hard cut, no saturated fill over 25%).
- **S5. Camera moves between shots**: push, pan, match-move, zoom-through (scene `"move"`), declared for FLOW; never a plain fade; the
  old shot's type leaves before it flies past the lens (EDGES big type).
- **S6. Two lengths**: 20 s (19-23.5 s, 50-70 words, 2 steps) or 40-45 s (39-46 s, 100-140 words, 3 steps; `"dur": 42`, `"max_end": 41.3`),
  natural speed 1.0 (V1); LENGTH on the stills checks the class. A long reel earns its length with the third step and the surprise.
- **S7. Captions never on the subject**: the drawn subject ends above y ~1360, the captions sit under it.
- **S8. All gates unchanged**: SAFE ZONE, OVERLAP, FLOW, STORY, LENGTH on `--fake-vo --stills`; SOUND GATE, SOUND DETAIL and the GitHub
  Output QA on the render; the review file and critic as before.

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
- **F5. Myth days carry a verdict stamp** (PROMOTED 14 Nov 2026, tech-myth-verdict: 3 WINs of 3 at 24 h and 72 h: close-apps 123 vs median
  114, +8%, watch 6.0 s vs 4.7; heat-battery 117 vs 116, watch 5.2 s; drain-zero 119 vs 117, watch 6.3 s): on a gadget-myths reel the belief
  is stamped MYTH (or TRUE) in frame 0 and the stamp returns on the verdict. It lifted watch time every time, reach only a little, so it is a
  rule for the myth format, not the lever that fixes reach.

## Look and motion: the idea look (G9-G13; techreel/scenes/idea.py, topic `"look": "idea"`; the default 13-14 Nov, superseded by S1-S8)
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
- **G14. Depth and light in every scene** (owner, 14 Nov 2026, on the ANC reel: "looks a bit flat"; techreel/scenes/depth.py, on by default
  in the idea look): a lit room (key light, soft beams, a floor with a reflection under the captions: no black lower third), dust at three
  depths with parallax, shaded objects with a highlight and a contact shadow (D.sphere, D.capsule, D.panel, D.soft_shadow), giant type lit
  (a ramp, a lit edge, a soft shadow), bloom on the accents, a fine grain, motion blur on fast camera moves. Drawn worlds, not list cards;
  the key idea happens on screen (the waves cancel, the battery drains). Check: critic question 25.
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
- **V1. 20-22 s at the natural voice, speed 1.0**, about 3 words/s, 55-66 words, one sentence per scene, the hook 6 words or fewer (HOOK PACE);
  or the long story format, 40-45 s and 100-140 words (S6).
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

**Idea-look musts (owner, 13 Nov 2026, after the IP68 reel):** every item the voice names is on screen when it is said (no empty cards);
giant type stays inside the safe zone (x 60-1020); each idea scene shows the mechanism itself (dust stopped at a sealed seam, water rising
against a ruler), not an object with a label; a before/after shows both states side by side. The Output QA gets a SYNC check (words read on
screen vs the words spoken in the same 1 s) in design/todo.md.

**14 Nov audit:** ALARM tech (median reach 121 over the last 7 vs 300) and ESCALATE (two days running): answered by the format change already
running, the gadget channel (E24) in the idea look: try 1 IP68 reached 343 at 7 h (2.8x the channel median, the best tech reel since 1 Nov,
hold 47% vs 29%); try 2 today is a different format and gadget (worth it or not, earbuds, India: showreel-tech-anc-budget, two new worlds,
sound waves that cancel and battery bars). Not a tweak: the change is 2 reels old, so it is read at 3 (Sun 15) before anything else changes.

## Channel brief (moved from CLAUDE.md, 14 Nov 2026)
- Gadget channel built for brand collabs (owner, 13 Nov 2026: "Can we make it around something so that electronic gadget brands contact me
  for collab when my followers grow?"). The channel helps viewers understand and choose gadgets (phones, earbuds, watches, chargers,
  laptops): (1) specs decoded (what mAh, nits, Hz, IP68, ANC really mean for you, and when a number is marketing), (2) worth it or not (is a
  feature worth paying extra for), (3) gadget myths (fast charging, megapixels, battery habits). Faceless; built around free real media
  (R0, design/safety.md "Free real images and footage").
- Brands (owner, 13 Nov 2026: "We don't demean any brand or make them look bad compared to the good one; we highlight pros conservatively
  and diplomatically so people learn where they stand"): real brand and product names may be said and shown as text for factual
  comparisons, every product shown at its strengths, no "winner/loser", no mocking, no negative framing of any brand; never their logos,
  trade dress, product photos or marketing art; every spec from the maker's official spec page or a primary source, cited in the config.
  This overrides CLAUDE.md's "no real company names" for @techin20sec only.
- Audience mix (owner, 13 Nov 2026): 7 reels a week, 3 for India (prices in ₹, brands and models sold in India, Indian buying questions) and
  4 global; formats and categories rotate so no two days in a row repeat the same format or gadget type; design/topics.md plans the week
  with an "audience: india|global" column, and the mix carries over week to week (the audit reads reach by audience).
- One reel EVERY day at 13:00 IST, built that morning by the daily run. Engine: techreel/ (techreel/README.md); a camera that never stops
  (drift + declared glides between scenes), so every topic passes FLOW.
- Account Status checked by the owner on 1 Nov 2026: no issues (no reach limit), so low reach is distribution, not a restriction; don't ask again.
