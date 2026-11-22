# @techin20sec rulebook: retired sections (moved out 22 Nov 2026, the tech reset)

R0 (real media), the story look (S1-S8), the idea look (G9-G14), the old layout (G1-G8) and the E24 / idea-look experiment notes. Every tech reel since 15 Nov is on the kit engine (rules-tech.md K0), so these no longer apply; kept for the record. Owner lines they answered stay honoured in design/owner-feedback.md and critic.md.

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

