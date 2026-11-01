# Turns Out: true stories (owner, 31 Oct 2026; planned as "Channel 3")

**Promise: "The true story behind something everyone knows."** A 25-35 s narrated reel that takes something the whole world recognises
(a landmark, the sky, a calendar, an invention, an animal) and tells the true, surprising story behind it.

## The account (owner, 31 Oct 2026)
| | |
|---|---|
| Name | **Turns Out** |
| Username | **@itturns.out** |
| Bio | True stories behind things everyone knows. Sources in the comments. |
| Post window | 3 times a week, Mon, Wed, Fri, 21:00-22:00 IST (owner, 1 Nov 2026: while the channel is in 3D; was daily). Evening in Europe, morning to afternoon in the Americas |
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

### 3D craft notes (the first full 3D reel, scripts/channel3/eiffel-saved.html, 1 Nov 2026)
- One self-contained file: three.js r170 between `/*three:begin*/` and `/*three:end*/` (`node scripts/channel3/three-inline.mjs <scene> <three.module.min.js>`).
  Two canvases: the 3D layer (`#gl`) and a 2D layer over it (`#c`, 1080x1920) for the hook, captions, credit and payoff, drawn by the shared core.
- `window.seek(t)` sets camera, light and any motion from t, then renders: scene into a 4x MSAA half-float target, then one final pass
  (depth of field from the depth buffer, ACES tone, the grade, vignette). Renderer with `preserveDrawingBuffer: true` so frames capture.
- Headless Chromium renders it on SwiftShader (CPU WebGL; seek.mjs and stills.mjs launch it with the SwiftShader flags).
- The four fixes from the 3-second test (1 Nov): (1) the hook and payoff sit on open sky, with a soft dark grade behind them on the 2D layer;
  (2) the ground has detail (striped lawns in hedged panels, fine gravel, lamps, tree crowns shaded as one volume, Haussmann blocks with zinc
  mansard roofs and chimneys in a full ring round the tower), and shots are framed so no ground area dominates; (3) one low warm key from the
  back left (warm rim on the iron), a cool sky fill and hemisphere on the shadow side, a blue-to-amber sky, and haze that takes the sky's
  colour in each direction (a patched fog chunk: amber toward the sun, pale away from it; never brown); (4) one shot per sentence, cut in
  the breath before it, every shot a crane, dolly or orbit that is already moving at its first frame.
- Portrait frames are narrow (about 27 degrees across at a 46-degree vertical fov): place type and props within about 10 degrees of the
  camera's line, and check them in stills, not by eye in the code. Type faces the camera after the camera moves (not before).
- Type in 3D: a canvas texture on 9 stacked alpha-tested planes (the back ones dark bronze) reads as solid letters; no fog on type;
  dark type on a bright sky, light type on iron or city.
- Cost: render at 30 fps with no motion blur; the 3D layer at 1.4x (756x1344, upscaled; type stays at 2x); one shadow map for the whole reel
  (`shadowMap.autoUpdate = false`; nothing that casts a shadow moves); no environment map (it cost 0.7 s a frame); leaf clusters as
  icosahedra of detail 1; far city blocks at double size without chimneys; 20-tap depth of field.
- People and titles: superseded by the kit below (1 Nov, second pass).

### 3D toolkit (scripts/channel3/kit3d.js, owner 1 Nov 2026: shared parts for every 3D reel)
One file, copied into each scene between the kit markers (`node scripts/channel3/kit-inline.mjs <scene.html>`; npm run check fails on a
stale copy). In the scene: `var K = TOKIT(THREE, scene, { seed })`, then `K.tick(t)` in `seek` (wind). Built for the Eiffel reel's
review flaws; the sky and lost-day reels reuse it.
- **Figures** `K.figure({ coat, trousers, skin, hair, brows, beard, stache, hat: 'top'|'bowler'|'kepi'|'lady', dress, tunic, jacket,
  bun, parasol, phones, belt, buttons, facing, lod })`: clay-diorama miniatures about 1.75 m tall with a head of about 1/6 of the height;
  turned coats with folds in the geometry and a cloth bump, lapels and a shirt front laid on the curved chest, double-breasted buttons,
  a waist seam, collars and cuffs, mitt hands with a thumb; an egg head with a narrower jaw, skin-tone with warm cheeks (vertex colours),
  dark bead eyes, friendly brows, a nose, ears, a mouth, hair, a beard shell with sideburns and a moustache. Every clay material adds a
  little warm light in the shade and at the rim (a cheap subsurface look; `K.clay(colour, { r, m, sss, bump })`). `fig.userData.idle(t, k)`
  breathes, shifts weight and turns the head; arms are `userData.arms[i]` (shoulder, `.userData.elbow`, `.userData.hand`). `lod: 1` for
  crowds (no lapels, buttons, brows, ears, thumbs). Grey or salt-and-pepper beards, never pure white (a white beard plus a pale face read
  as a white plate). Show figures only in the shots that frame them (`visible` per shot): hundreds of small meshes cost about 0.5 s a frame.
- **Titles** `K.title(lines, widthM, o)` + `K.titleFade(group, k)`: cream type (9 stacked alpha-tested layers, dark bronze behind) on a
  thin dark plate (alpha 0.93, rounded, a fine amber rule inside the edge) that writes depth, so the depth of field keeps it sharp with
  its letters. No glow, no haze plane. Subtitles at least 150 px in the canvas (smaller ones vanish at phone size on small plates).
- **Trees** `K.tree(x, z, s, 'plane'|'round'|'far', hero)` then `K.forest()` once: a barked trunk (mottled plane-tree bark), three
  limbs with twigs, 11-13 lumpy leaf clusters (three shapes, welded and displaced icosahedra) in five greens, shaded as one crown
  (light side, shadow side, darker underneath and inside), leaf texture that fades with distance (no shimmer), a slight sway.
  `hero` (finer clusters) only for trees close to a camera; leaves are the biggest cost (keep under about 2M triangles).
- **City** `K.city({ near, mid, far, skip(x, z, f, isTree), avenues: [[x0, z0, x1, z1, width]], river: { z, w, bridges }, extra })`:
  Haussmann perimeter blocks round light courtyards; near blocks split into buildings of varied height, each with a zinc mansard (dormers
  and standing seams drawn in the shader) and chimney stacks with pots on its party walls; facades drawn in the shader at real scale (a
  shop floor, tall windows, iron balconies on the 2nd and 5th floors) fading to their average with distance; districts keep their own
  street angle; avenues cut through with plane trees down both sides; the river with quays, tree rows and bridges. Instanced and grouped
  by area so the camera skips what it cannot see; streets are grey paving (the scene's ground), parks lay their own gravel and lawns.
- Cost (Eiffel reel, 1 Nov): about 1.6-2 s a frame locally at 1080x1920 (the reel before the kit: 1.6 s); render it split in 2 parts.

### 2.5D toolkit (scripts/channel3/kit25d.js, owner 1 Nov 2026: "2.5D, continuous flow", the lighter alternative to real-time 3D)
Why: the 3D reel costs about 50 GitHub minutes, its people read as toys and its ten hard-cut shots hold the camera mostly still; flow,
not model detail, holds viewers. The 2.5D look: flat engraved layers (ink linework, cross-hatching, old paper, one amber accent, matte,
no glow) at real depths in front of ONE pinhole camera that never stops and never cuts. 2D canvas only: about 0.01-0.5 s a frame, parts 1.
Pilot: scripts/channel3/eiffel-flow.html (showreel-c3-eiffel-flow). The kit sits inside the scene's main script after the shared core
(it uses the core's helpers), between `/*kit25:begin*/` and `/*kit25:end*/`; `node scripts/channel3/kit-inline.mjs <scene.html>` copies
it in (the same command inlines kit3d.js), npm run check fails on a stale copy. In the scene: `var Kt = K25`.
- **Camera** `Kt.track([[t, x, y, cz, plane], ...])(t)` -> `{ x, y, z }`: metres, y up, looking along +Z. Between keys the distance to
  `plane` moves in log space and x, y follow 1/zoom, so a zoom from the tower (300 m) to a map (2,500 km) keeps its target in frame;
  every key keeps some speed (the camera never stops). Fly-throughs are real: put the next scene behind a plane and pass through a hole
  in it (the tower's arch). A match cut to another world: draw the new world inside a clip (the counter of the "0" in 1909, measured
  from the font at load) with its own track and `Kt.off(dx, dy)`, easing the offset to 0 as the hole covers the frame.
- **Layers** `Kt.use(cam, Z)` sets the canvas to metres at depth Z (returns px per metre, 0 when behind the camera); `Kt.proj(cam, X, Y, Z)`
  for things that span depths (wires, a floor in perspective); `Kt.vis()` is what is on screen; sort items far to near; fade an item
  as the camera reaches it (`(Z - cam.z - 3) / 10`). `Kt.ground(cam, col, line, paths, z0, z1)`: the y = 0 plane with rows fixed to it.
- **Engraving** `Kt.hatch(x0, y0, x1, y1, angle, px, col, lw)`: lines fixed to the layer at a power-of-two spacing, every other one fading
  as the zoom halves them, so they stay about `px` apart on screen at any zoom with no swimming or popping. Lattice and fine detail fade in
  by size on screen (the tower's diamonds subdivide as the camera closes in). `Kt.paperTex(seed)` once at load, laid over each frame
  with 'multiply' (fibres, mottling, specks, warm vignette; static, so it is paper, not a second grain; the render's grain 4 stays).
- **Scenery** `Kt.city(Z, seed, tone, { h, domes, dark })` an endless row of Paris blocks; `Kt.tree(x, h, seed, tone, ink)`.
- **People** `Kt.person({ h, coat, trousers, skin, hair, beard, stache, hat: 'top'|'bowler'|'kepi'|'lady', dress, parasol, sit, arms: [[hx, hy],
  [hx, hy]], phones, buttons, chain, belt, long, detail })`: clean illustrated figures in metres (feet at 0, facing +x), hands placed by a
  two-bone reach, one eye dot and no other facial detail, recognised by props; scale them with the canvas (outlines stay in px).
- **Kinetic type** `Kt.roll(s, X, Y, size, font, col, k, knock)` (digits roll up into place), `Kt.label(...)` (spaced capitals wiped in),
  `Kt.stamp(lines, X, Y, rot, col, k)` (a rubber stamp that lands); key `k` to the word's spoken time (`WT(sentence, /word/)`), not the
  sentence's. Dark type on paper gets a paper `knock` outline; no glow. `Kt.rings(cam, X, Y, Z, t, t0, t1, every, col)`: radio rings
  that grow exp(3 x age) metres, so they keep spreading on screen through any zoom.
- Learned on the pilot's stills (1 Nov): a log of a negative distance (the camera past Z = 0) silently blanks the frame; outlines on a
  figure scaled 400x must use the canvas's real scale (`cs()`), not the layer's; a rolled number must not show its neighbours; long
  zooms over featureless land are empty, so pass them in about 0.4 s and keep a subject (rings, the tower glyph on Paris) on screen.

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
  "fits", one stills sheet (`node scripts/showreel/stills.mjs <config> <out> 15`, or a comma list of times, one per beat) scored beat by beat
  against the Quality bar. Then the Showreel workflow (3D reels: "parts" 2, the capture split across two jobs).

## The three pilots (31 Oct 2026; premium pass and re-render the same day)
| Pattern | Topic | Length | Sources |
|---|---|---|---|
| Storybook cut-out | How the Eiffel Tower was nearly torn down (1889 fair, 20-year permit, army radio from 1903, Bizerte soon after (no year: sources say 1904-1907), saved 1910) | 34.4 s | Eiffel Tower official site (2 pages), History.com, Guinness World Records |
| One continuous zoom | Why the sky is blue but sunsets are red (scattering by nitrogen and oxygen, longer path at sunset) | 30.1 s | Met Office, NOAA NESDIS, NASA Space Place, Royal Museums Greenwich |
| Living globe | The sailors who lost a day (Pigafetta's Wednesday, Cape Verde's Thursday, July 1522; the date line) | 35 s | Linda Hall Library, Utrecht University (van Gent), National Geographic |

## 3D reels (from 1 Nov 2026)
| Reel | Topic | Length | Render |
|---|---|---|---|
| showreel-c3-eiffel-saved (scripts/channel3/eiffel-saved.html) | Why the Eiffel Tower was almost torn down: the pilot's facts and voice, ten 3D shots | 34.4 s | 30 fps, one job: 41 GitHub minutes (capture 38.5 min, about 2.2 s a frame; 1.3x the local time). Rendered and checked 1 Nov, posts Mon 2 Nov. Polish pass the same day (miniature figures, titles on a soft haze, a closer cover, Bizerte re-checked), re-rendered in place. Second pass the same day on the 3D toolkit (clay figures, matte title plates, real trees, a Haussmann city), re-rendered in place split in 2 parts |
| showreel-c3-eiffel-flow (scripts/channel3/eiffel-flow.html) | The same story, voice and sources in 2.5D (engraved layers, one continuous camera, no cuts), made 1 Nov to compare with the 3D version for that night's post | 34.4 s | 30 fps, parts 1 (2D canvas) |
The flat 2D Eiffel pilot and the 3-second 3D test are in attic/scripts/channel3/.
Learned from its render (fix in the shared core before the next 3D reel): at a cut the caption card stays up empty for about 0.2 s
while it changes shape (seen at 3 cuts); the voice check counts a year as four words, so its "too dense" pacing flag misreads
year-heavy scripts (81 script words in 32.1 s = 2.5 words/s). The sky and the lost day are next in 3D (step 3).

## Launch order (31 Oct 2026)
The three pilots, after the premium pass, are the first three posts, 21:00-22:00 IST: Eiffel Tower (1 Nov), the sky (2 Nov), the lost day (3 Nov).
Superseded (owner, 1 Nov 2026): the pilots were hidden and the channel moved to 3D at 3 posts a week (Mon, Wed, Fri). First post: the 3D
Eiffel reel on Mon 2 Nov; the sky and the lost day follow once rebuilt in 3D.
