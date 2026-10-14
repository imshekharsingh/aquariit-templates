# Film playbook (directed reels): how a film is made, checked and sounded

Rules live in CLAUDE.md ("Directed film", "Music & Sound"). This file is the how-to. Worked example: `film/2026-10-13-0851/` (Tintwell, "The Hue Dial").

## Sell Aquarii, not the template's business (owner, 14 Oct 2026; read design/services.md first)
The first films sold laundry, food delivery and dentistry. The owner: "I don't do laundry... by the end we have to sell our own services." The story grammar is now:
**buyer's pain in one service line → what Aquarii delivers (the mechanism on screen) → the result → send line → CTA to us.** The template appears only as proof
("a site we designed", "the site we protect"). Useful parts per line: web → phone + scan + compare (old vs new); social → gridFill (a month of posts), steps, chat;
security → P.shield (attacks bounce off), hub (SSL, backups, updates, firewall around the site), meter; edge → route (a request travels via the nearest edge), radial.

## Real 3D (lab, 14 Oct 2026)
Why it was not done before: the engine was built on the page's DOM (flat layers moved by a virtual camera), and every film was made inside a 30-45 minute daily budget,
so we kept adding 2D tricks instead of changing the renderer. Nothing technical was stopping it: WebGL runs in the same headless Chromium (SwiftShader, no GPU needed).
What exists now:
- `P.three(parent, opts)`: a three.js scene (MIT library, injected by render-film.mjs when a story uses THREE; the workflow installs it, nothing is committed), lit by a
  procedural studio baked into a PMREM environment (no images or stock assets). `P.three.look(G, keys)` is a keyed 3D camera on the same springs and eases.
- Fast capture: a page holding a software-GL canvas screenshots slowly, so the renderer reads the 3D frame straight from the canvas, screenshots only the layers above it,
  and ffmpeg lays one over the other. Breath dims reach the 3D scene through its exposure.
- Lab shot: film/_lab/leaky-3d (8 s): a glass browser window with refractive water (the page behind it bends through the water), reflective glass, a cracked front pane
  spraying drops at the lens, a lime patch on the bold spring, a pour from the address bar. Render: `render-film.mjs 2026-10-14-0850 --film-dir film/_lab/leaky-3d`.
Fit against the reel rules: 1080x1920, 30 fps, deterministic, safe zones, watermark, captions, loop and the 25 MiB cap all work the same way. Cost is the catch: ~2.5 s per
3D sub-frame on a 4-core machine (the 2D films are ~0.3 s), so an 18 s film fully in 3D takes ~45 min with 2 sub-frames of blur. Recommended use: 3D for the hero
shots (3-6 s per reel) and 2D for the rest, which adds ~10-15 min to a render. Next steps for realism: caustics (light through the water onto the floor), a shader water
surface with real normals and foam, depth of field, and lights tuned per mood.
Things to avoid: mix-blend grain over a transparent overlay (it turns into noise), drops sized for a wide shot in a close-up (they read as pearls), a dark page behind the
water (refraction then looks murky; a bright page reads as clear water).

## Hybrid films: 3D hero shots + 2D (owner decision, 14 Oct 2026)
The owner chose hybrid after the 3D lab. A film declares its 3D windows; everything else stays 2D (cheap). First use, the leaky-site film: the opening close-up and
smash pull-back (0-2.35 s), the refill through the address bar and the push onto the surface (11.62-12.88 s) and the loop return (17.35-18 s), all with `P.tank3d`.
- `P.tank3d(parent, { active, loopAt, levels, leak(t), sealed(t), pour, camera, puddleSize })` is the leaky vessel in real 3D; `P.three({ active, loopAt })` draws only inside
  its windows and replays its frame-0 state after loopAt. Hide the 2D twin of the subject during the windows; type, captions and the watermark stay on top.
- Cut between 3D and 2D where both show the same framing (the 3D pull-back ends on the same wide window the 2D film opens on) or under a flash.
- The renderer decides per sub-frame: 2D sub-frames screenshot as before; 3D sub-frames take the canvas + a transparent overlay screenshot and composite at once, and
  render every other sub-frame (2-sample blur), so 3D seconds cost about 3x 2D seconds instead of 10x.
Water realism pass (same day): a procedural ripple normal map scrolled two ways (fine refraction wobble), caustics as additive light on the page, the tank floor and the
studio floor, a meniscus line, buoyant bubbles, landing splashes and a puddle, Neutral tone mapping so lime and aqua stay saturated. Still missing for "film" realism:
real caustic projection from the surface shape, depth of field, a simulated surface for the pour.

## Easing and spring physics (motion focus, 14 Oct 2026)
Linear or default ease-in-out motion is the clearest sign of an amateur reel. The toolkit lives at the top of scripts/film/parts.js and every film uses it:
- `P.cubicBezier(x1, y1, x2, y2)` (Newton-Raphson, 8 iterations, bisection fallback) and presets `P.EASE.glide` (0.16,1,0.3,1), `snap` (0.7,0,0.84,0), `settle`
  (0.34,1.56,0.64,1) and `swing` (0.65,0,0.35,1, in-out with zero speed at both ends).
- `P.spring(t, { stiffness, damping, mass })`: the closed-form step response of a real damped spring released from rest. `P.SPRING.default` 170/26/1, `bouncy` 220/14/1,
  `bold` 300/24/1, `fade` 1100/66/1.
- `P.tween`, `P.springAt`, `P.life` (arrival + a departure 35% faster) and `P.easeInfo` (overshoot and settle frames, for the self-check).
Measured (P.easeInfo; settle = within 1% of travel): glide 0% / 10 frames, snap 0% / 15, swing 0% / 14, **settle 9.8%** (over the 8% limit: not used), default spring
0% / 16, **bouncy 18.6%** (cartoon only: not used), bold 4.9% / 12, fade 0% / 6.

Mood map (the film picks by its DNA): calm or luxury: glide or the default spring, 600-900 ms, no overshoot. Playful or bold: the bold spring (4-8% overshoot, settled
within 18 frames). Technical: short hard-stopping arrivals (200-300 ms, no overshoot). Every element eases OUT on arrival and IN (snap) on departure; departures are 30-40%
faster than arrivals.

Lessons from applying it to the leaky-site film (bold + technical DNA):
- **Arrivals must start at rest.** glide and settle start at full speed (their first control point jumps), so speed jumps on the first frame. Positions, scales and the
  camera therefore arrive on springs (they start at zero speed by construction); opacity arrives on the `fade` spring (critically damped, full by frame 6), so the shape
  leads and the fade follows. glide stays in the kit for things that arrive from behind a mask, where the first-frame jump cannot be seen.
- **Camera moves are added, not chained.** Each key is a move from the previous key (a spring on its own clock, or an ease over the gap); the moves are summed, so a whip
  can start before the last one has settled without any jump in position or speed. A 'lin' key now throws.
- **Shake must start at zero and stay under ~7 Hz.** An envelope that rises from 0 times sines that start at 0; at 30 fps anything near 15 Hz aliases into jitter.
- **Impacts are impulses, not steps.** The punch on the big moment is `A * u * e^(1-u)`: it rises from zero, peaks at 90 ms and decays, instead of jumping.
- Ambient motion (bubbles, light) uses buoyancy (accelerating rise) or slow oscillation, never a constant-speed drift; the handheld drift uses whole cycles per film so
  the loop stays seamless.
- Hero reveal: `P.dripWord(..., { pop: true })` scales 0.92 -> 1 on the default spring with opacity on the fade spring (full by frame 6). Used on "DM us" (payoff) and on the
  hook when the loop returns.

Self-check (`render-film.mjs ID --motion-check`): samples every scripted element 120 times a second and flags JUMP (a speed change much larger than its neighbours,
outside declared hard cuts `S.cuts`), LINEAR (constant speed for 0.15 s or more) and per-preset overshoot/settle against 8% / 18 frames, then greps story.js and
timing.json for linear or untooled curves. Canvas content (water, drops, grain) is not measured by it; it is physics (gravity, buoyancy) or oscillation by construction.
Result on the leaky-site film after three fixes (arrival jumps from glide, a phase offset in the vertical shake, a 14 Hz shake that aliased): no jumps, no linear motion,
all presets PASS, grep clean.

## Review every frame, not a few stills (owner, 14 Oct 2026)
Stills at the cuts miss dead air, stutter and fake-looking moments. After the stills passes, render the full film and run scripts/film/frame-review.py: it measures every
frame (motion and brightness), flags frozen stretches, unplanned jumps, judder and flashes, draws motion.png and writes contact sheets of every 2nd frame. Look at all of
them. First use (leaky site v2) found: a 1 s dead hold after the pull-back, red words unreadable on bright water, bead-like jets, unreadable sublines, flat frames while the
camera rode the water, messages bunched low, and a 2 s motionless ending; all fixed in one pass (v3).
Realism notes from that pass: liquid reads as liquid when the jet is a tapered ribbon that breaks into drops stretched along their velocity with a highlight; a water body
needs a depth gradient, light inside it and a bright meniscus; any held shot needs something alive (handheld drift, light moving).

## What a film is
A virtual camera over the LIVE template page (CSS 3D transform on one wrapper), so every shot is vector-sharp at any zoom. Every frame is a pure function of the film time: no real-time capture, no jitter.
Engine: `scripts/film/engine.js` (stage, camera, easing, per-word type reveals, tweens). Story (per template): `film/ID/story.js`. Timing table (shared by picture and sound): `film/ID/timing.json`.
Render: `node scripts/film/render-film.mjs ID --variant A` (≈ 3 min on 4 cores; `--stills t1,t2` for single frames, `--frames a-b` for a range, `--cover` for the poster, `--deliver DIR` for the files the workflow uploads).
The Reel publish workflow renders it automatically when `film/ID/story.js` exists (otherwise the screen recording).

## Parts, starter and preview
`scripts/film/parts.js` (window.FilmParts, loaded by the renderer after the engine) holds the reusable pieces of the approved look: `scene` (near-black stage, dust, bokeh,
breathing push, breath dim, impact punch), `captions`, `sentence`, `card`, `brackets`, `phone` + `chat`, `scan`, `hub`, `payoff`, `clock`, `shape`, `wave`, `icons`. Each part
registers its own per-frame update; the story calls `P.update(t)` at the end of its `update`.
`film/_starter/` is a working default built only from the parts (it reads the page's name, accent, headline, features and CTA): copy it to `film/ID/` and rewrite it around the
business's metaphor. Shipping it unchanged fails `scripts/check.mjs` (films from 2026-10-14 on must use FilmParts, differ from the starter and log revisionPasses + notes).
`render-film.mjs ID --stills t1,t2` renders single frames (the main review tool); `--preview` renders all 540 frames without blur or sound and writes a contact sheet;
`--film-dir DIR` renders a story from elsewhere (e.g. `--film-dir film/_starter` to see the default on any page).

## Variety and the friend test (13 Oct 2026)
- The menu of options per slot is at the top of scripts/film/parts.js. Each film picks a combination that differs from the previous film in opener, transition,
  mechanism and payoff (scripts/check.mjs reads the auto-written film/ID/manifest.json), declares `S.dna`, and adds ONE new option to the library.
- Gallery check for new parts: write a tiny story in a scratch folder and render it with `--film-dir DIR --stills ...` on any template.
- The review question is human: would I stop on it, watch to the end, screenshot a moment, send it to a friend in that business? Log the answers as `friendTest`.

## Reference study 3 (study notes, NOT a recipe: rebuilding these is plagiarism; at most one technique per reference per film, see scripts/film/sources.json) (owner's reels, 14 Oct 2026; the phone recordings were at 2x speed, timings doubled)
1. A framework reel (hub + spokes, the camera tours each spoke while the label types, pivot lines on black, ends on the whole diagram + "Screenshot this"): built to be
   SAVED. Content for buyers that teaches something is a different job from a showcase; both have a place (E10).
2. A word-per-beat reel: one huge word fills the width, the ground flips between two colours on every beat. Nothing else on screen; rhythm is the whole idea.
3. An agency's own ad: a tag swinging on a string wipes "Need branding?" into "We got you." over and over, one service per swing. The moving object IS the transition (E11).
4. A product film: icons inside sentences, a collage orbiting a line, letters spread on guide lines then snapping into a word, a logo growing from a dot, real-world
   shots mixed with UI. Each idea gets one beat, then the next arrives.
All seven techniques are parts now (see the menu in scripts/film/parts.js).

## Review lessons from the first kit-built daily film (Suddly, 14 Oct)
- Look at frame 0 at full size on its own: a rack focus or blur opener must already be readable at t = 0 (start it mid-pull with a negative `at`), and the hook caption
  must be legible at t = 0 (start its card slightly before 0).
- Check the last frame against frame 0 side by side. Story code that overrides a part (e.g. bringing a word back for the loop) must run AFTER `P.update(t)`,
  because each part re-applies its own state every frame.

## Watermark (owner, 14 Oct 2026)
The Aquarius sign + AQUARII TECH STUDIO in a soft translucent pill, centred at y ≈ 535-552: the band between the captions (anchor 492) and Instagram's caption area. It is
added by P.scene to every film and steps aside during P.signoff. Do not put key text in that band.

## Use the whole frame (owner feedback, 13 Oct 2026)
The first films put a small subject in a narrow central column with a lot of empty frame (Gojigo v3 measured 2-18% coverage, 15 of 20 frames TIGHT). Rules now:
- the subject fills the width (phone 270-290 px wide and running off the bottom edge; numbers and display type 340-390 px wide; buttons full width);
- grounds go edge to edge (a city map, a grid, a gradient field, a giant outlined ghost number bleeding off a side);
- compose off-centre (type left-aligned at the 30 px gutter, ghost elements on the right); key text still stays inside the safe zones;
- measure: `node scripts/film/fill-meter.mjs DIR` on the stills; at most a third TIGHT (Gojigo v4: 8 of 20, all transitions or the breath).
Gotcha: P.MONO contains font names in quotes; it is single-quoted so it can sit inside style="..." attributes (double quotes broke every inline mono style before).

## Authoring a film (the order matters)
1. Read `reel-log.json` (last 7 films) and design/experiments.md. Do not repeat a concept, primary transition or sound direction.
2. Write the visual DNA (5 lines), pitch 3 concepts, score them, pick one (see `film/2026-10-13-0851/treatment.md` for the shape).
3. Lock the storyboard as `timing.json`: BPM (cuts must sit on beats: `brief.mjs` fails if a hit is more than 25 ms off the grid), cut times, `music` block (peak, breath, hit points, sections), `cues` for sound effects.
4. Write `story.js`: `setup(variant)` builds the world and the camera keys; `update(E, t)` sets everything that changes (dial values, counters, overlays). Rules that cost hours to learn:
   - any non-zero 3D tilt (rotateX/rotateY) resamples the raster: held text turns soft (measured 4.9 vs 31 edge sharpness at 2.2x zoom, still 35% softer at 0.1 degrees); the engine fades tilt out above z = 1.0 and dead-zones angles under 1.2 degrees, so tilt only during fast moves and never on a frame people must read;
   - heavy defocus (focus pull > 3 px) and strong grain/bloom read as a quality fault on a phone: keep them subtle;
   - never use `transform-style: preserve-3d` on the camera (it forces a low-resolution raster, text turns to pixels when zoomed): flat compositing only;
   - the template's own real-time animations fight the film clock: disable them (`animation:none!important`) or drive them (`getAnimations()` + `currentTime`);
   - read counters/numbers at the frame time, not per motion-blur sub-frame, or two digits ghost on top of each other;
   - keep key content between y = 96 px and ≈ 560 px of the 715 px frame and inside 30 px gutters (Instagram's UI covers the rest); zoom 0.9 on holds;
   - give every shot something that moves; a held frame is only for the breath before the reveal; the last frame must equal the first (loop).
5. Preview: render stills at every cut + first/peak/last, build a contact sheet (ffmpeg `fps=2,tile`), LOOK at it, score the rubric (CLAUDE.md), fix anything below 8, max 3 passes.
6. Checks that must pass: no frozen frames (`ffmpeg -vf freezedetect`), first and last frame match, 1080×1920 H.264 High 30 fps, loudness per Music & Sound.
7. Log the film in `reel-log.json` (concept, motion style, transitions, type, grade, sound, cover, rubric, music provenance).

## Craft bar: a film is a world, not a page pan (owner feedback, 13 Oct 2026)
The owner rejected films that only zoom around the page in its own colours ("any beginner editor can do this"). Worked example of the fix: `film/2026-10-13-1902/` ("After 8").
- **Start from a story with a metaphor**, not from the page. The page appears INSIDE the world (on a floating phone, a billboard, a window), it is not the world. After 8: the clinic building's windows ARE the diary; bookings light them at night, sunrise turns them gold.
- **Colour script before code.** Write 3-5 lighting states across the 18 s (golden hour → dusk → night → dawn) as 3-stop palettes and mix between them with `color-mix(in oklch, …)` per frame. Avoid the default orange/red/blue: pick hues with tension (rose + butter, violet + magenta + coral, ink + cobalt + electric indigo). Use `in srgb` when mixing warm lights into dark blues (oklch drifts orange to coral/pink).
- **Light is a character.** Neon that flickers on a beat, windows that glow (box-shadow halos), a sun and moon that move, a light leak and flare (screen blend) on the peak, a short scale punch on the impact, the breath = brightness and saturation dip. Offline rendering allows real blur, glass (`backdrop-filter`) and glow, which the live page may not use.
- **Layers and parallax.** Sky, stars (canvas), clouds (blurred, periodic drift), far skyline, near building with a side face and rooftop props, UI overlays (glass toasts, clock HUD), kinetic type: each layer moves at its own rate.
- **Type is choreography.** Per-letter entries with a variable-font axis animating (Archivo `wdth` 125 → 74) on a spring; the hook builds in lines on the beat; the answer holds until the loop.
- **Every 0.6 s something lands** (100 BPM): a toast, a window, a sign flicker, a clock jump. A section with no event is dead air (v1 left the night empty and lit the bookings at dawn: backwards).
- **The loop is the story.** Anything that drifts (clouds, sun, clock, signs, lit windows) must return to its frame-0 state; use periodic motion (`sin(2πt/18)`) rather than `t % n`.
- **Mandatory style-frame loop.** Before any full render: `--stills` at 10-12 times (every cut, the breath, the peak, first and last), build a contact sheet in TIME order (sort numerically, the glob order is lexical), write a written critique (story logic, colour, collisions, safe zones, dead air, loop), fix, repeat. After 8 needed 4 passes; every pass found real faults.
- Same-document clones beat iframes: a `file://` iframe has an opaque origin (`contentDocument` is null). Clone `<main>` into the device screen and freeze it with a scoped `animation:none` style.

### Product-film grammar (studied from an owner-supplied reference reel, 13 Oct 2026; v3 of `film/2026-10-13-1902/` is the worked example)
Premium does not mean more colours. What made the reference look expensive, and what we now do:
1. **One grade, one accent.** Near-black ground (#050607), neutral surfaces, ONE glowing accent (the template's own accent). Warmth or a second hue is saved for the payoff, so the payoff lands (After 8: lime-on-black night, a sunrise only at the peak).
2. **Material, not flat fills.** Cards = dark gradient (160deg, #1e2225 → #0b0d0f) + 1 px light rim + inner top highlight + soft drop; the ACTIVE element gets an accent rim and outer glow.
3. **Skeleton UI.** Grey bars stand for text you do not need to read. Anything that must be read is shown big and alone (a phone at full frame, a zoom into one slot). Never a shrunken real page.
4. **Show the mechanism.** Connector lines draw on the beat, data dots travel along them, a hub with counter-rotating arc rings, nodes that light up with icons. The viewer sees HOW it works.
5. **Transform, don't cut.** A scan bar of light runs down the phone and turns one UI into another; the phone flies into the next shot's element (here: into the diary slot it just booked).
6. **Captions are the spine.** 1-3 words per card, heavy and tightly kerned (Archivo 800, wdth 84, -0.035em), white with one accent word, on a solid dark pill, ALWAYS at the same anchor (centre x, y ≈ 492 of 715) and ≤ 280 px wide so Instagram's button column never covers them. Words rise out of a mask on a spring; cards change every 0.6-1.2 s.
7. **Focus marks.** Corner brackets snap onto the focal element with a glowing dot on one corner; the camera pushes in a little (≤ 1.45x) so the reader sees it, never so far that it runs over the captions. Hide HUD overlays while a shot fills the frame (white HUD text ghosts on light screens).
8. **Depth cheaply.** Static blurred bokeh discs moved only by transform, a dust canvas with periodic drift, a soft halo behind the lit object.
9. **One idea per ~1.2 s, one centred focal object per shot, big negative space.**

### Reference study 2: a "POV: you edited the whole night" reel (owner screen recording, 13 Oct 2026; studied frame by frame, timings at real speed)
What it is: a phone filming a monitor in a dark room lit by a colour-cycling RGB keyboard; a fixed caption on top ("POV - you edited the whole night"); on the monitor a ~19 s brand
film. The work is the content, the POV caption is the hook, the filmed room adds texture and constant colour motion. Its edit grammar, and what we take:
1. **A sentence that builds, not cards that replace.** "Every / great / idea / starts / with a / Spark" appears word by word on ONE line, ~0.5-0.7 s per word, small light-weight
   type in lots of air; the accent words are coloured. The viewer reads along, so even slow pacing holds. Use it for the claim; keep pill captions for the punchy beats.
2. **Pivot words alone.** The line clears and single words carry the turns ("But", "Inspiration", "Everywhere", "Nowhere"), and each gets its own world response: a busy burst of
   UI cards flying in for "Everywhere", sudden emptiness for "Nowhere". Contrast pairs make the problem felt.
3. **A recurring shape as a character.** A coral asterisk ("spark") enters from the edge, spins beside the words, then flies to the centre and becomes the wipe. One brand shape
   that travels through the film gives continuity better than unrelated transitions. Also used: a liquid wave wipe from the bottom, a brush-smear reveal.
4. **Logo, then the claim.** The mark pops in, the name follows, then the promise builds next to it with a highlighter swipe behind the accent words.
5. **A change of world at about three quarters.** Flat 2D type cuts to a photoreal desk with a monitor, a slow push-in, the screen cycling one wide-tracked word every ~0.6 s
   (PLACE / ORGANIZED / VISUAL); then the real product panel slides in from the right and fills with content. Show the product only after the idea has landed.
6. **The ending opens out.** The product's content flies out over a big soft photographic world: the last frame is the largest space in the film.
7. **Restraint again.** Warm cream, one coral gradient that slowly drifts, one secondary accent used once; no heavy outlines, no pills. Calm, slow (~66 BPM), un-gridded music:
   this kind of film is cut to the words, not to the beat.
8. **The opening is a rack focus.** Frame 0 is a huge blurred word in a white flare that pulls back and sharpens into the line: motion and curiosity from the first frame.
For us: a POV wrapper ("POV: you built a clinic's booking site at 2 am") rendered as a virtual monitor in a night room with slow ambient light cycling in the film's own palette;
and inside, the sentence-build + pivot words + one brand shape per template (Dantika: a tooth or a clock hand; a café: a steam curl).

## Sound (Music & Sound in CLAUDE.md, implemented in `scripts/audio/`)
No music is ever synthesised in code. Music comes from a licensed source; until one is connected a film ships with NO music bed and the owner adds Instagram's own audio (the kit's `## Music` gives BPM and search terms; the film is cut on its BPM grid, so pick a track near it and start it on a downbeat).
The toolkit (each step is a script; `produce.mjs ID` runs them all):
| Step | Script | What it does |
|---|---|---|
| 1 brief | `brief.mjs` | from `timing.json` "music" + `film/ID/music-brief.json` (mood, genre, 3-5 instruments, avoid, 3 interpretations): duration, BPM on-grid check, energy curve per section, hit points, composition plan, 3 prompts; refuses a brief that repeats the previous film's genre/instrumentation/BPM (reel-log) and applies the owner's past feedback |
| 2 generate | `generate.mjs` | 3 candidates from a licensed API (`--provider elevenlabs`, needs the secrets `ELEVENLABS_API_KEY` and `MUSIC_LICENCE_NOTE`; adapter is UNVERIFIED against the live service) or `--from DIR` for tracks made elsewhere; saves prompt, plan, model, date, licence next to each file in `audio/<date>/<ID>/` |
| 3 evaluate | `evaluate.mjs` + `analyze.mjs` | tempo and beat grid, drift, onset alignment with the hit points (ms), energy arc (must rise into the peak, dip in the breath), loudness/dynamics/clipping, phone band; spectrogram and energy plots; rejects bad candidates, picks one, explains in 2 lines |
| 4 edit | `edit.mjs` | rubberband tempo-fit (≤ 3%), strongest bar line onto the peak frame, bar-boundary cuts/loops only, breath = silence, loop crossfade on a beat, optional stem plan |
| 5 sound design | `scripts/film/sfx.mjs` | whooshes/risers/impacts/clicks from `timing.json` cues, every one motivated by a picture event. NOTE: these are generated in code (original, no third-party material); CLAUDE.md asks for a licensed source, so treat them as an interim layer and replace them when a licensed SFX source exists |
| 6 mix | `mix.mjs` | music duck −3 dB under impacts, carve at 2.8 kHz, HPFs, bus compression, −14 LUFS, true peak ≤ −1 dBTP verified AFTER AAC encoding, phone-band check |
| 7 log | `produce.mjs` | writes the provenance, scores and loudness into reel-log.json; later add the owner's feedback to `music.feedback` |
`node scripts/audio/selftest.mjs` proves the evaluator rejects drifting/wrong-tempo/flat/clipped tracks, that edit lands the peak within a few ms with the tempo fitted, and that the mix meets −14 LUFS / −1 dBTP (stand-in tracks only; never shipped).
The renderer uses `audio/<date>/<ID>/final.wav` when it exists (`--audio PATH` to force), otherwise the effects-only track.
