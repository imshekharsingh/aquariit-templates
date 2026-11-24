# @techin20sec rulebook (the gate every tech reel passes before its one render)

## Start from gold (owner chat, 24 Nov 2026; design/gold.md)
Every new tech reel starts as a copy of the gold reel showreel-tech-ai-memory: `node scripts/starter.mjs tech <slug>` copies techkit/scenes/ai-memory-r4.html and techreel/topics/ai-memory.json (+ the r4 preview keys) and marks the only places to
change with "CHANGE:" (the objects in each world, the bold words and numbers, the hook motion, the screen card, the 7 voice lines, cues, sfx and post text). Keep the rest as gold (light, framing, type sizes, shot rhythm, motion, sound) unless the review file says
why. `npm run check` fails while a config still has "_starter" or "CHANGE: ". After the render: Output QA LOOK compares its light with gold,
and `python3 scripts/qa/side-by-side.py reel-files/<name>.mp4` makes the sheet the critic must view (critic.md question 43).
Direction card (owner, 24 Nov 2026; design/direction.md): the starter also writes review/<channel>/<name>.direction.md. Fill its 9 lines
(hook, pacing curve, camera, light, type motion, transitions, sound, rewatch moment, payoff; each a choice and why, never "default",
"steady" or "simple") BEFORE the build, avoiding this channel's list in design/direction.md; the stills check approves card and stills
together; no render without "STILLS CHECK: APPROVED".

Same use as design/rules-web.md: score every rule (pass / fail, one line each) in the stills review before the one render; fix or swap on a
fail; the daily audit adds, changes or drops a rule with the number. History: the gadget channel from 13 Nov (owner: "make it around something
so that electronic gadget brands contact me"), the kit engine from 15 Nov (K0), **the reset of 22 Nov** (below). Retired sections (R0 real media,
the story look S1-S8, the idea look G9-G14, the old layout G1-G8, the E24 notes): attic/design/rules-tech-2026-11-22.md.

## The reset (owner, 22 Nov 2026: "every reel looks the same, no variation, no detail, no audience pull ... I'm not hooked to my own content"; the early kit reels "had rich, detailed animation and we have degraded since")
Why (numbers): every tech reel 16-22 Nov was "Kit engine (shared frame), ~40 s", the same 7-beat arc, three formats rotating, and 6 of the
last 8 were phone, charger or battery topics. The two richest early kit reels are still the best: night-mode 1,468 views, screen-120hz 958
(median 123). Shot by shot, what they had and the last six (laptop-plugged, phone-claim, wireless-worth, wifi-button, cold-shutdown) lack:

| | night-mode / screen-120hz (15-16 Nov) | the last six (18-22 Nov) |
|---|---|---|
| Subject | a drawn world: a night city with a moon, a lit tower, water and its reflection; two phones scrolling a list | flat diagram parts: a rounded-rect cell, a zigzag line, a bar, a thermometer, chips in a row |
| Build | parts arrive one by one on their words: 15 burst frames fly from the lens into slots, a time bar fills segment by segment, frames fly back into one photo | the whole diagram is on screen from frame 0; beats change a colour or a bar length |
| Depth | 3+ planes: the photo, frames floating over it, loupes over those, light trails between | one plane over the shared background blobs |
| Secondary motion | an aperture iris snapping per frame, a shutter ring per shot, light flowing along the full time bar, orbiting light on the end card | removed by K1 (no bob, drift, loops); only the named part moves |
| Camera | a push, a pull back, a pan, a push into the loupes, a pull back for the title | one eased push per chapter, then a hold |
| Micro-detail | grain, noise and ghosted copies on the photo, a registration crosshair, a sensor grid, photon specks | a few labels and pills |
| Hook | the answer split (one quick shot vs Night mode) in frame 0 | a title over the still diagram |

### D. The Detail bar (minimums, every tech reel from 23 Nov; score each line in the stills review)
- **D1. A world, not a diagram**: the subject is drawn as the real object or place (a watch on a wrist, an earbud in an ear, a car dash),
  with its own materials (glass, metal, skin, fabric), never a rounded rect standing for it.
- **D2. Built part by part**: at least 6 named parts arrive on their own words (eased, staggered), and the subject opens up at least once
  (cutaway, X-ray, exploded view, a lid lifting, layers peeling).
- **D3. Three depth planes or more** in every chapter: background world, the subject, a foreground layer (particles, light, a lens, a loupe,
  labels on leaders), each moving at its own speed (parallax).
- **D4. Secondary motion is welcome** when it belongs to the object or its world: light pulsing, particles flowing, cells streaming,
  a fan spinning, a needle settling, a counter ticking with the voice. At least 2 such loops on screen in every chapter. What stays out
  (owner complaints, honoured): sweeps of light or glass sheen across the picture (15 Nov, Output QA SHEEN), a box round the hero (15 Nov),
  the whole camera or page wobbling (15 Nov "too wiggly"), an idle copy parked next to the subject (21 Nov).
- **D5. Two camera moves of different kinds** per reel at least (push in, pull back, pan, orbit, track along a path, zoom through a layer),
  each eased and declared for FLOW; holds are for reading, never the default.
- **D6. Micro-detail on the object**: 10+ small details visible at phone size (screws, seams, a grille, specks, a scale, tiny readouts),
  so a paused frame still rewards a look.
- **D7. Every chapter looks different** from the one before (a new layer, a new angle or a new scale), so the grid of stills reads as a story.
- **D8. Check**: the stills sheet next to night-mode's: would a follower say it is at least as rich? If not, add layers, not text.

### P. Audience pull (every tech reel from 23 Nov)
- **P1. A surprising picture at 0-1 s**: frame 0 shows something a stranger has not seen (the inside of the gadget, light inside a wrist,
  a part mid-air), not a title over a still object; the title sits on it (K3).
- **P2. A curiosity gap**: the first line asks or shows something the reel only explains at the end (why it glows green, why it dies at 30%).
- **P3. The payoff closes the gap and loops**: the last line answers the first, and the last frame returns to the opening picture (same
  framing), so the replay feels seamless.
- **P4. A comment question**: the caption's first or last line asks one easy question the viewer can answer in a word (and the end card may
  show it). Never claim a viewer asked (owner, 21 Nov).

### X. Four formats, each with its own look, pacing and length (replaces the three-format F1 rotation)
| format (captions "format") | look | pacing and length |
|---|---|---|
| **xray**: X-ray / teardown | the gadget opens up: the case goes clear, layers lift, parts get labels on leaders; the camera dives in and pulls out | 30-40 s, 6-7 lines, a new part every 2-3 s |
| **showdown**: head-to-head | the frame split in two (two products or two settings), rounds with a scoreboard that fills on each word, both at their strengths (F3) | 35-45 s, 3 rounds + a verdict |
| **quickmyth**: quick myth-bust | MYTH / TRUE stamp in frame 0 (F5), one demo on the object, the verdict stamped | 15-20 s, 3-4 lines, 45-60 words |
| **indiapick**: India "worth the price" | a price tag in ₹ as the hero, what the money buys built up part by part, the verdict on the tag | 25-35 s, 5 lines, F2 India |
Each format has its own chapter chips and its own colour world (xray: cool clear blues with one warm accent; showdown: two hues, one per
side; quickmyth: stamp red / green on dark; indiapick: saffron and teal on deep navy). The 7-beat arc of K0 is now one option inside a format,
not the default.

### Rotation (scripts/check.mjs enforces it from 22 Nov; design/runbook-daily.md step 4)
- Every tech entry in templates/showreels/captions.json has `"format"` (xray, showdown, quickmyth, indiapick) and `"device"` (audio, camera,
  wearables, laptop, home, car, phone, charging; a battery or charging topic is `charging` whatever the device).
- No two consecutive posting days with the same format or the same device class; at most one `charging` reel in any 7 days.
- design/topics.md plans the week across all eight device classes.

## M. Motion and material bar for the 3D direction (owner, 23 Nov 2026: "Put the fixes in kit first ... we go premium and all in on improvements"; two independent reviews scored ai-memory render 1 at animation 6, cleanliness 6-8, premium 5-6.5)
Every tech reel from 24 Nov is built on techkit/kit3d.js and must reach 7+ on all three Premium check scores before its render. Score each line on the stills sheet.
- **M1. Shot changes**: 3+ different kinds a reel (match cut on a shape, push-through, rack-focus dissolve, light wipe, at most one whip), each with a cause in the picture, each carried into the next shot (the next shot is already moving the same way). Never through black, never the same change twice in a row.
- **M2. Motion blur**: smooth streaks only (the kit's sampled + smeared blur). A frame that shows stepped copies of an edge is a defect. The render stays inside the limit by splitting the frames over parallel jobs, not by dropping samples.
- **M3. Never fully still**: a slow eased push or drift under every hold (about 2-3% a second), a move that keeps speed at both ends of its shot, and something already in motion at frame 0. A bold word does not move after it lands.
- **M4. Materials and light**: chips are dark epoxy with a faint laser mark, cyan (or amber) only as an edge glow; a cool rim and a warm kicker on the hero; exposure about 15% over render 1; metal and gold keep their colour under a moving light (no white burn); battery, screen and rack sides each have a material (no flat grey slabs, no blank screen).
- **M5. Composition**: the top band (y 250-560) stays empty for the bold word; the word never touches the object; the object is large and low and the picture runs to the bottom of the frame (no empty black third); a subject is whole unless the shot is a declared full-bleed (qa.edges_ok with the reason).
- **M6. Words**: one per shot, each arriving its own way (slam, drop, rise, track, stamp, wipe); no two neighbours alike.
- **M7. A count never crawls** (critic on ai-memory r3, 23 Nov: a 1-2-3-4 GB count at 0.7 s a step read as "2 GB" on a paused frame): first choice: the object does the counting (chips light one by one in about half a second) and the number shows only the end value, on the spoken word; a number that must count runs in under 1 s (`KIT3D.countTo`, 0.55 s by default) and lands on that word. Before it there is a word or nothing, never a wrong number.
- **M8. Two framings in any 8 s** (same review: "0-8 s is one framing of the same phone"): no stretch of 4 s sits on one picture of one object. A second framing is a real change of angle, height or distance (`KIT3D.reframe`: a low macro, a three-quarter view), not a slow push. The first one comes inside the first 4 s.
- **M9. Sound on the cuts** (owner, 23 Nov night: "next level"; hyperframes steer.md note): the topic sets `"cutsound": {"payoff": "<cue>"}`. Every shot change gets air that rises into it and a low hit that lands on it and rings over it; one long riser crests exactly on the payoff word, the music held back for a breath under it. Effects stay under the voice.
- **M10. A place reads as what it is**: server racks are servers (`materials().server()`: units with handles, vents, drive bays, small cyan and amber lights), never plain glowing panels; a macro subject sits in a tray, a row or on a surface of its own kind so the picture runs to the bottom (M5), never a single object over black.
Why: the first 3D reel had seven real shots but one sideways whip six times, stepped ghost copies in every whip, shots that slammed in and froze, flat teal chips, and two words on top of the object. What changed in the kit: techkit/README.md "The 3D kit".

## K0. The kit engine (owner, 15 Nov 2026: "port the owner's kit as it is ... get past our engine if it's not helping"; E26)
PROMOTED 18 Nov 2026 (tech-kit-engine: 2 WINs, 0 LOSEs at 24 h: night mode 1,468 vs median 123, 120 Hz 958 vs 123; 5 ATM 1,203 at its first reading).
Tech reels are built on techkit/ (techkit/README.md): the owner's motion kit (design/kits/motion_kit.zip, motion_content_prompt.md), topic
`"engine": "kit"`, a scene in techkit/scenes/. The shared frame (techkit/base.html: header y 250, chip y 408, hero y 500-1200, panel y 1240,
captions y 1430) is the default layout; a format may hide the panel or header and use the space for the world (from 22 Nov). Kept: SAFE
ZONE, OVERLAP, SUBTITLES, CAPTIONS, FLOW (techkit/preflight.mjs), PREFLIGHT voice, SOUND GATE + DETAIL, Output QA, the review file.

## K1. No sweeps, no box, no wobble (owner, 15 Nov 2026 night, on the 5 ATM frame: "covering the wave like coming in from left top corner to the right of the frame, it's happening in all videos"; "What's this in tech reels frame where actual object is?"; and "too wiggly"). Loosened 22 Nov (the reset): secondary motion is wanted again (D4).
- No decorative sweeps: no glass sheen, glare band or light bar crossing the picture (Output QA SHEEN: FAIL at 4+ straight bright bands
  sweeping the hero zone, 1-3 a WARN to look at; the old kit sheen made 15).
- No box around the hero: the world runs nearly the full width; the object is a third of the width or more (Output QA HERO width).
- No wobble of the whole picture: the camera and the page do not shake or drift all the time; jolts only on a declared word.
- The idea happens ON the object, on its words, and its parts keep living (D4); the subject's own change is active in 55%+ of the samples
  (Output QA HERO, K2). Retired 22 Nov: "no bob, drift or looping decoration on the subject" and "one camera move per chapter, then hold"
  (they stripped the layered motion of the early kit reels; the complaint behind them is kept by the three lines above).
- FLOW line for tech: continuity 55%+, dead runs under 1 s (design/mandatory.md calibration); a deliberate end hold goes in TOPIC.holds.
- On-screen shapes near a spoken number: no tick ladders, dashed rings or ring-and-dot clusters (Output QA NUMBERS read them as "6" and "7");
  scan the numbers' windows with tesseract (psm 11) before the render.

## K2. An object topic opens up (owner, 16 Nov 2026, on 5 ATM render 5, which passed every check: "still doesn't do much in terms of animation around the main elements which may not attract audience")
- An object topic opens up: cutaway, exploded view or parts that move; the subject transforms on every beat and the camera moves with it.
- The change is inside the subject, not round it: Output QA HERO warps out the subject box's move, zoom and squeeze and leaves out a rim of
  20% per side; 55%+ of the half-second samples must show change inside. Check it on the scene's frames before the render (techkit/README.md).
- Every number on screen matches the voice (a counter stops at the spoken value).

## K3. The cover is frame 0 (owner, 16 Nov 2026: the reel cover inside the video, no separate cover file; the owner picks that frame as the cover in Instagram)
- Frame 0 shows the title and the surprising picture (P1), readable at profile-grid size, inside the centre 3:4 (y 240-1680 of 1080 x 1920).
  Check: frame 0 cropped to y 240-1680 and shrunk to about 270 x 360.
- Kit topics set `cover: true` (the header at full strength from frame 0). The subject stays in place for the first 0.5 s; its own life (a
  glow, particles) may run from frame 0 (loosened 22 Nov: "keep the subject still until the hold ends" removed).

## Format rules kept (F2-F5)
- **F2. Audience mix**: 7 reels a week, 3 for India (prices in ₹, brands and models sold in India, Indian buying questions) and 4 global;
  the topic file carries `"audience": "india" | "global"`, `"format"` and `"gadget"`, and the audit reads reach by audience.
- **F3. Brands, diplomatically** (owner, 13 Nov 2026): real brand and model names only as text and voice, for facts; every product at its
  strengths, no winner / loser, no mocking, no "X is worse"; never logos, trade dress, product photos or marketing art (products drawn
  generically by us); every spec from the maker's official spec or support page (or the standard), cited in the topic's "sources" with the date read.
- **F4. One useful verdict a viewer can act on**, said in the last line and shown on the product: the reason to save and send. The caption
  repeats it in text with the numbers and invites a send to a named kind of friend.
- **F5. Myth days carry a verdict stamp** (PROMOTED 14 Nov 2026, tech-myth-verdict: 3 WINs of 3 at 24 h): on a quickmyth reel the belief is
  stamped MYTH (or TRUE) in frame 0 and the stamp returns on the verdict.

## Voice, length and gates (V1-V4, kept from the old rulebook)
- **V1. Natural voice, speed 1.0**, about 3 words/s; the length is the format's (X: quickmyth 15-20 s, indiapick 25-35, xray 30-40,
  showdown 35-45); `max_end` in the topic matches it.
- **V2. Tech terms said the way people say them** (scripts/voice/say.json or the topic's "say"; PRONUNCIATION: no "check:" words).
- **V3. FLOW** (cuts 0, no dead runs, continuity 55%+ (K1), at most one declared strobe), SAFE ZONE ok, OVERLAP none, SOUND GATE, SOUND DETAIL, and
  the GitHub Output QA PASS on the final MP4.
- **V4. Post one reel EVERY day**, aim 13:00 IST, any slot 13:00-21:00 IST (owner, 18 and 20 Nov 2026); no topic repeated on the channel or covered by @webin20sec.

## Channel brief (moved from CLAUDE.md, 14 Nov 2026)
- Gadget channel built for brand collabs (owner, 13 Nov 2026: "Can we make it around something so that electronic gadget brands contact me
  for collab when my followers grow?"). The channel helps viewers understand and choose gadgets (phones, earbuds, watches, chargers,
  laptops, cameras, home and car gadgets) in four formats (X: xray, showdown, quickmyth, indiapick), rotating device classes. Faceless;
  drawn in code on the kit engine (K0; real media retired with R0, attic/design/rules-tech-2026-11-22.md).
- Brands (owner, 13 Nov 2026: "We don't demean any brand or make them look bad compared to the good one; we highlight pros conservatively
  and diplomatically so people learn where they stand"): real brand and product names may be said and shown as text for factual
  comparisons, every product shown at its strengths, no "winner/loser", no mocking, no negative framing of any brand; never their logos,
  trade dress, product photos or marketing art; every spec from the maker's official spec page or a primary source, cited in the config.
  This overrides CLAUDE.md's "no real company names" for @techin20sec only.
- Audience mix (owner, 13 Nov 2026): 7 reels a week, 3 for India (prices in ₹, brands and models sold in India, Indian buying questions) and
  4 global; formats and categories rotate so no two days in a row repeat the same format or gadget type; design/topics.md plans the week
  with an "audience: india|global" column, and the mix carries over week to week (the audit reads reach by audience).
- One reel EVERY day (13:00-21:00 IST), built that day by the daily run. Engine: techkit/ (K0).
- Account Status checked by the owner on 1 Nov 2026: no issues (no reach limit), so low reach is distribution, not a restriction; don't ask again.

**23 Nov audit:** PROMOTE tech-myth-verdict (3 WINs, 0 LOSEs) and tech-kit-engine (4 WINs, 0 LOSEs) printed again; both are already rules (F5, and the kit-engine rule, 18 Nov). Tech OK (median reach 1,212 over the last 7 vs target 300). The 22 Nov reset replaces these formats; rules here keep the facts, brand and safety.

## Owner gate removed, shot variety (owner, 24 Nov 2026)
- The owner is not asked to approve a tech preview or render; the critic decides (tech-direction.md's "stills + a short preview to the owner" no longer applies).
- Never one subject or view for more than a few seconds: Output QA VARIETY fails a reel when over 60% of its one-second frames look like one shot (owner on miniled-zones: "one screen across the reel"). Plan a new subject or view every 2-4 s.
