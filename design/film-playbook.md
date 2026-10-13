# Film playbook (directed reels): how a film is made, checked and sounded

Rules live in CLAUDE.md ("Directed film", "Music & Sound"). This file is the how-to. Worked example: `film/2026-10-13-0851/` (Tintwell, "The Hue Dial").

## What a film is
A virtual camera over the LIVE template page (CSS 3D transform on one wrapper), so every shot is vector-sharp at any zoom. Every frame is a pure function of the film time: no real-time capture, no jitter.
Engine: `scripts/film/engine.js` (stage, camera, easing, per-word type reveals, tweens). Story (per template): `film/ID/story.js`. Timing table (shared by picture and sound): `film/ID/timing.json`.
Render: `node scripts/film/render-film.mjs ID --variant A` (≈ 3 min on 4 cores; `--stills t1,t2` for single frames, `--frames a-b` for a range, `--cover` for the poster, `--deliver DIR` for the files the workflow uploads).
The Reel publish workflow renders it automatically when `film/ID/story.js` exists (otherwise the screen recording).

## Starter and preview
`film/_starter/` is a working generic story (it was tried unchanged on Tidemark and Gojigo and produced a coherent film both times). Copy it to `film/ID/` and bend it. Known limits: it finishes the page's own scroll-driven
CSS animations at their END state, but cannot replay page JavaScript that reacts to the scroll position (headings that fill as you scroll stay dim), and it assumes a vertical page (horizontal scrollers need a custom story).
`render-film.mjs ID --preview` renders 540 frames without motion blur or sound in about a minute and writes `preview-sheet-A.png` (a frame every 0.5 s); `--film-dir DIR` renders a story from elsewhere (tests).

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
