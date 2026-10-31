# Turns Out: true stories (owner, 31 Oct 2026; planned as "Channel 3")

**Promise: "The true story behind something everyone knows."** A 25-35 s narrated reel that takes something the whole world recognises
(a landmark, the sky, a calendar, an invention, an animal) and tells the true, surprising story behind it.

## The account (owner, 31 Oct 2026)
| | |
|---|---|
| Name | **Turns Out** |
| Username | **@itturns.out** |
| Bio | True stories behind things everyone knows. Sources in the comments. |
| Post window | daily, 21:00-22:00 IST (evening in Europe, morning to afternoon in the Americas) |
| Logo | design/brand/accounts/turnsout-logo.svg, option M2 (see below) |

In code the channel keeps its internal id `c3`: scenes in scripts/channel3/, reels named `showreel-c3-<slug>`, `"channel": "c3"` in captions.json.

### Logo (owner chose M2, 31 Oct 2026)
**M2, "The turn"**: an amber arrow turning three quarters round a dark ring (the @techin20sec dial's sibling), with TURNS in white and OUT
in amber set large inside, in Unbounded on the same dark ink. It matches the family of the other two logos (one object, heavy Unbounded
type, one bright accent on ink), the arrow says "turns", and the name stays readable as a 110 px avatar. The owner asked for no question
mark in it. Source: design/brand/accounts/turnsout-logo.svg (+ 1080 PNG and 320 PNG; the app serves templates/channels/turnsout-logo.png).

Every option drawn on the way is in design/channel3-logo-options/: A-C (first round: turned page, the question that turns, lens), D-K
(premium serif round: masthead, serif question, coin, monogram, seal, lowercase, page turn, light masthead), L, M1, N (family round:
story book, the turn with "!", folded card). The owner found the first round not premium; the family round was preferred so the three
accounts read as siblings.

## Audience and topics
- Global: a topic must be recognisable on every continent. Over any week, the reels cover at least 4 continents.
- General knowledge: countries, people, science, history, nature, inventions. True, checked, non-controversial.
- Simple English (short sentences, no idioms that do not travel). Metric first, imperial beside it on screen (300 m · 984 ft).
  Dates as "9 July 1522" or "JUL 1522" (no 7/9/1522).

## Never (check every topic against this list first)
- Religion; active wars and disputed borders; living politicians; "which country or people is better".
- Health and diet claims; tragedies as entertainment.
- Anything an official body currently disputes.

## People
- Only historical figures who died 50 or more years ago; no living or recently dead people, no politicians in office, no religious figures.
- Drawn as friendly cartoon figures recognised by props and setting (Eiffel: top hat, white beard, the tower; Pigafetta: feathered cap,
  quill and diary), never caricatured faces. This is the owner-approved exception in CLAUDE.md, Copyright-safe, for this channel only.

## Facts
- Every claim on screen or in the voice is in two reliable sources (museums, official bodies, space agencies, encyclopedias,
  peer-reviewed work). Check that it is not a known myth; no apocryphal quotes.
- When sources disagree (the Victoria's crew count: 18, 21 or 22), leave the number out rather than pick one.
- A short source credit on the last 3 s ("SOURCES: ..."). The config's `"sources"` list (title + https URL, 2 or more;
  `npm run check` fails without it) is shown on the reel in the app with **Copy as comment**: one ready-to-paste comment listing them.
- Write the checked facts and their sources in the scene's header comment.

## What works (from our reels; the craft bar is design/webin20sec.md)
- The hook question on screen and in the voice from frame 0; the cover shows it fully lit.
- Narrated in one natural take, full sentences with breaths, about 2.3-2.6 words/s overall; every spoken sentence on screen.
- A big change every ~3 s; one clear turning point; the payoff in the last 3 s.
- Real 3D, documentary look: see "Quality bar" below. No glow, no neon, no bloom.
- 25-35 s. Every frame a pure function of t (seeded randomness only).

## Quality bar (owner, 31 Oct 2026: replaces the "Premium rules"; real-time 3D from now on)
The three 2D pilots were hidden: flat shapes read as a school diagram, frames were mostly empty, a caption card stood empty, grain was
doubled. Polish cannot fix a cheap base style, so the channel moves to real-time 3D in the browser (three.js inlined into the scene,
scripts/channel3/three-inline.mjs). The bar, for a channel that tells true stories to a global audience with a documentary-explainer feel:
1. **Documentary still.** Every frame could be a still from a high-end documentary title sequence: real 3D, one motivated key light with
   soft shadows, believable materials (iron, stone, water, sky, paper), atmospheric haze for depth, gentle depth of field.
2. **Full frames.** Edge to edge: 3+ depth layers (foreground, subject, background), one focal point, no flat untextured area larger than
   about 15 % of the frame, no empty backgrounds.
3. **The camera always moves** (slow dolly, orbit, crane); cuts are motivated; a new shot every 2.5-3.5 s; flow from shot to shot (match
   cuts, the camera carries through), never pops or empty fades.
4. **Type.** One editorial serif for the hook and payoff (Playfair Display), one clean sans for captions (Inter); captions in one
   consistent lower third, at most 2 lines, never an empty caption box; dates and numbers as type set into the 3D space.
5. **One colour grade per reel** (warm golden hour, cool dawn, ...), no neon or glow; grain at most once and subtle (the render's grain 4, none in the scene).
6. **People**: stylised 3D miniature or clay figures recognised by props and setting, never caricatured faces (CLAUDE.md exception rules).
7. **Sound**: a score bed that lifts into the payoff; a clear voice; effects tied to on-screen motion.
8. **Frame 0 is cover quality**: the hook question over a finished, lit shot.
9. **The check before any render**: score every beat of the stills sheet against points 1-8; any failure is fixed first. Ask of each
   frame: "would this look at home on a premium documentary or museum channel watched worldwide?" If not, it is not ready.

### 3D craft notes (from the test shot, scripts/channel3/eiffel-3d.html)
- One self-contained file: three.js r170 between `/*three:begin*/` and `/*three:end*/` (`node scripts/channel3/three-inline.mjs <scene> <three.module.min.js>`).
- `window.seek(t)` sets camera, light and any motion from t, then renders: scene into a 4x MSAA half-float target, then one final pass
  (depth of field from the depth buffer, ACES tone, the grade, vignette). Renderer with `preserveDrawingBuffer: true` so frames capture.
- Headless Chromium renders it on SwiftShader (CPU WebGL; seek.mjs and stills.mjs launch it with the SwiftShader flags).
- Cost: about 3-3.5 s a frame at 1080x1920 locally (tower lattice 10k beams, 6k leaf clusters, 3.6k city blocks; MSAA alone about 1 s).
  Draw the sky last (renderOrder) so only open sky pays for the clouds; keep instanced meshes; shadow map 2048 over the subject only.

## Pattern library (2D, retired with the pilots on 31 Oct 2026; kept for the story ideas, rebuilt in 3D)
Rotate patterns so the feed never shows the same look two days running. Each entry is a reusable recipe; a new pattern gets an entry here
before its first reel.

### 1. Storybook cut-out
Pilot: `scripts/channel3/eiffel-tower.html`, how the Eiffel Tower was nearly torn down.
- One shot per sentence. Each shot is a small paper theatre: 3-5 flat layers at depths 1.2-10 (sky, far set, subject, figures, foreground).
- Inside a shot the camera dollies forward a little (parallax: near layers move more). On the next sentence it pushes THROUGH the old
  stack (layers fly past and fade as one sheet) while the new stack already stands behind it: the signature cut.
- Figures are cut-outs with simple limb rigs (shoulder and elbow angles as functions of t): one prop identifies the person.
- Kinetic paper objects carry the numbers: hanging signs, scrolls that unroll, stamps that slam, counters that roll.
- Keep text within about 190 px of the centre on near layers: the dolly scales them by up to 1.3.
- Best for: history with people, inventions, "how X was saved / nearly lost".

### 2. One continuous zoom
Pilot: `scripts/channel3/blue-sky.html`, why the sky is blue but sunsets are red.
- One world, one camera, no cuts. The camera is (zoom, focus) keys interpolated in log zoom; the focus follows 1/zoom so a pull-out
  never swings past its target.
- Each sentence is a new scale (1x hill, 22x sunbeam strands, 160x molecules, 600x one molecule, back out to 1/26x the planet, back in).
- Details appear by scale (fade in over a zoom range), not by time, so the move itself reveals them.
- Things far away (the sun) sit on screen in their direction, kept inside the frame.
- Label small things with tags pinned to them on screen; label anything not to scale ("AIR LAYER DRAWN THICKER THAN IT IS").
- Best for: science and nature mechanisms that live at a different scale (light, cells, atoms, planets).

### 3. Living globe
Pilot: `scripts/channel3/lost-day.html`, the sailors who lost a day.
- A paper globe: hand-drawn coarse coastlines rasterised once into a land mask (coast and 30-degree grid lines precomputed), drawn per pixel
  in orthographic projection; lit by the key light with darker edges, deep ocean with paler shelves (a blurred land mask), a soft day/night edge only when the story needs the sun, a soft shadow on the paper.
- The camera follows the subject (centre longitude lags it), zooms in to a place for the turning point, spins for time passing.
- A small cartoon crew (ships, a caravan, a plane) inks the route as it goes; dates roll in a chip at the top; cards slam in for the
  turning point (diary against shore).
- Route waypoints are approximate: say so in the header comment, never on screen as exact.
- Per-pixel globe costs about 0.1-0.4 s a frame locally (the most at a 640 px close-up); keep its radius at or under ~640 px.
- Best for: geography, exploration, time zones, migrations, trade routes, "where in the world".

### Rotation (recommended)
Match the pattern to the subject, then rotate: Living globe, Storybook cut-out, One continuous zoom, repeat; never the same pattern on two
consecutive days, and no more than 3 of one pattern in a week. Spread continents across the week (at least 4).

## Making a reel
- Scene `scripts/channel3/<slug>.html` + config `<slug>.json` (name `showreel-c3-<slug>`, `"sources"`, caption with a comment prompt,
  6+ keywords, exactly 5 niche hashtags) and an entry in templates/showreels/captions.json (`"channel": "c3"`, `"concept"`:
  "Pattern N · name: topic", `"about"`).
- Start from the pilot of the same pattern. The shared core (story timing, voice, captions, hook, text probes, grain) is the block that
  starts "shared core of the Channel 3 scenes" (the Turns Out scenes); keep it identical across scenes.
- `story([[sentence, breath before it], ...])` sets one start time per sentence from the same estimate preflight uses (0.07 s a letter at
  speed 1, a digit as 4 letters) and window.VOICE; beats key off `A[i]` (sentence i's start).
- Before the one render: `node scripts/channel3/qa.mjs <config> --write` then clean, `node scripts/showreel/preflight.mjs <config>` says
  "fits", one stills sheet (`node scripts/showreel/stills.mjs <config> <out> 15`) scored beat by beat against the Quality bar. Then the Showreel workflow.

## The three pilots (31 Oct 2026; premium pass and re-render the same day)
| Pattern | Topic | Length | Sources |
|---|---|---|---|
| Storybook cut-out | How the Eiffel Tower was nearly torn down (1889 fair, 20-year permit, army radio from 1903, Bizerte 1904, saved 1910) | 34.4 s | Eiffel Tower official site (2 pages), History.com, Guinness World Records |
| One continuous zoom | Why the sky is blue but sunsets are red (scattering by nitrogen and oxygen, longer path at sunset) | 30.1 s | Met Office, NOAA NESDIS, NASA Space Place, Royal Museums Greenwich |
| Living globe | The sailors who lost a day (Pigafetta's Wednesday, Cape Verde's Thursday, July 1522; the date line) | 35 s | Linda Hall Library, Utrecht University (van Gent), National Geographic |

## Launch order (31 Oct 2026)
The three pilots, after the premium pass, are the first three posts, 21:00-22:00 IST: Eiffel Tower (1 Nov), the sky (2 Nov), the lost day (3 Nov).
