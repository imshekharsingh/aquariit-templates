# Tech explainer reel generator

20-second, 9:16 (1080x1920, 30 fps) reels that explain one tech topic in plain words: a hook card, six scenes, a voice
for the whole reel with karaoke captions, and synthesized sound. A new topic needs only a new topic file.

## Run it
- On GitHub (the normal way): Actions → **Tech reel** → slug. The MP4, contact sheet, QA report and word timings land in the
  `techreel` release as `<slug>.mp4`, `<slug>-contact.png`, `<slug>-qa.txt` and `<slug>-vo.json`.
- Locally, stills only (no voice model needed): `python3 techreel/make.py <slug> --fake-vo --stills 1.5,6,12`
  (timings estimated at 3.2 words a second; PNGs in `out/techreel/<slug>/`).
- Full local run (needs Kokoro, PyTorch CPU, espeak-ng, ffmpeg, fonts-inter): `python3 techreel/make.py <slug>`.

## Layout
| path | what it does |
|---|---|
| `make.py` | runs everything: voice → timeline → frames piped to ffmpeg (libx264, 8 Mbps) → sound → mux (AAC 192k, two-pass loudness to about -14.5 LUFS, true peak ≤ -1) → QA |
| `vo/tts.py` | Kokoro `af_heart` at about 1.05, line by line, with a start and end for every word; pronunciation overrides; refuses digits and hyphens; must end by 19.4 s, or the topic's `max_end` |
| `scenes/base.py` | canvas (2x supersampling + a faint glow layer), the camera offset (`Frame.dx/dy`), palette (gold accent), easing and springs, the light (`lights`: drifting blooms and orbs, the scene tint, a soft grade), glass panes (`glass`), rolling numbers (`roll`), part progress bar, label chip, hook card, karaoke captions |
| `scenes/icons.py` | icon library built from shapes (bot, store, cart, card, lock, shield, check, cross, user, chat, gate, coin, doc, bolt, warning, key, chip, cloud, eye) |
| `scenes/kinds.py` | scene kinds (visual metaphors): `portal`, `flow`, `nest`, `choice`, `guard`, `checklist` |
| `audio/synth.py` | numpy synthesis: a pad per scene with chord changes, plucks, bells, clicks, whooshes, kick, thud, a resolving final chord, convolution reverb, ducking under the voice |
| `topics/<slug>.json` | one topic: script, scenes, pronunciation, post text and sources |

## Look and motion (owner, 8 Nov 2026)
- The sister of web's style C, "Glass and light" (scripts/explainer/kitmotion.js, theme 'glass'), with tech's own accent, warm gold: frosted panes
  faked cheaply (a translucent fill, a lighter upper half, a 1.5 px edge, a lit top rim, a soft offset shadow, a slow highlight sweep; no blur) over
  slow drifting coloured light painted at 1/8 size and scaled up (the upscale is the blur), crisp white type. About 0.28 s a frame.
- The camera never stops (make.py `camera`): a slow sway (the web kit's drift, x2.4) and, between scenes, an eased 0.6 s glide sideways (scenes sit
  1200 px apart in one world). The glides are declared transitions (make.py `transitions`, plus any in the topic's "transitions"), so FLOW reads them.
- Secondary motion while every line is spoken: pulses along links, the hub's rings, a highlight stepping through lists, a renewal ring, rolling
  numbers in badges, a loading shimmer, breathing rings on ticked steps, the part progress bar (one segment per scene), drifting motes.
- Every element has its own flow and sound (owner, 8 Nov 2026): kinds call `fr.el(key, t0, size, x)` before drawing an element (an entrance
  that rotates between from below, from the centre outwards, from above and a push from depth; a staggered exit as the line ends; a sound event)
  and `fr.hit(...)` for a move inside it. Size picks the sound: s = high blip, m = mid snap, l = low thud with a swish, panned by x, on the
  element-detail bus (scripts/showreel/detail.py). `--stills` prints ELEMENTS; the render prints SOUND DETAIL (80%+ or it fails).
- A scene starts 0.35 s before its line, so its content arrives during the glide with its label (no label-only frame).
- `--stills` prints SAFE ZONE, OVERLAP and the four FLOW lines (Mandatory Gate items 3-4 and 14-17); wifi-address: continuity 100%.

## The settings format (11 Nov 2026, design/rules-tech.md; experiment E17)
"3 settings to change today": the hook names the number and the benefit, with `"hook_toggles": ["A", "B", "C"]` (three switches drawn off at
frame 0, flipping on at 0.45 / 0.75 / 1.05 s, each with a mid snap) in place of IN 20 SECONDS; `"header"` replaces the TOPIC · EXPLAINED line;
three scenes of kind `phone` and a closing `checklist` (label "SAVE THIS · ..."). Start a new one by copying `topics/stop-tracking.json`.
`phone` params: `screen` and `sub` (title and small line), `rows` [{text, on?}] (three rows, short text), `control` "switch" (the picked row's
switch flips) or "choice" (a tick moves from row `from` to row `pick`), `pick`, `cue` (the word the finger taps on), `before` / `after`
(the result pill flips red to green), `paths` [["iPhone", "..."], ["Android", "..."]] (each path checked on the platform's own page).
The phone is our own drawing (no platform's UI, icons or fonts); platform names appear only as text.

## The idea look (13 Nov 2026; topic `"look": "idea"`, scenes/idea.py; design/rules-tech.md G9-G13): the default for every tech reel
Owner, 13 Nov: "Let's build it with new animation." The idea at full-frame scale, one subject per scene, a crisp camera (`Cam`: zoom about a
focus point + drift; text scales with it), declared zoom-throughs between worlds. Copy topics/ip68.json to start one, and
keep its `"qa": {"sync": [...]}` up to date: every word the voice says that names a card, verdict or label on screen (Output QA SYNC fails
when one is not readable on screen within 1 s of being said; without the list it uses the scenes' `cards` and `good` / `bad` texts).
- HUD: progress bar + `"format"` pill (top), the TAG row (a giant gold glyph that travels between scenes + one or two big words on their cue
  words + a small sub line), a chip at the foot of the stage (`"chips"`: [{text, cue, ok?}]), captions in their own band over a dark bed.
- Topic keys: `"hook_glyphs"` {text, size, y, water (px under the letters' centre, or omit), dust, labels [{i, text, t, gold?}], ripples [{i, t}]}:
  frame 0 is the giant term doing the thing; the first scene's `tag.from_hook` letter rises out of it to the tag row, the others sink.
- Scene params (every kind): `tag` {glyph?, from_hook?, words [{text, cue, gold?}], sub?, sub_cue?}, `push` [zoom, x, y], `chips`, `world`
  (scenes with the same key share one world, no zoom-through).
- Kinds (sets): `barrier` (a product edge in macro, particles bounce off the seam; seam_cue, particles), `fill` + `depth` (one water world:
  rise_cue, sink_cue; then depth {value, unit, cue, labels, label} with a ruler and a readout, ring {value, unit, cue}), `slam` (cards
  [{icon, text, cue, dot}] slamming in with a jolt), `split` (before / after of one object with a wiping divider: before, after, show_cue,
  wipe_cue, inside), `verdict` (the term reassembles over two panels: glyphs, good {icon, text, cue}, bad {...}). Icons: scenes/gadget.py.
- New kinds go in scenes/idea.py as `set_<name>(cm, fr, s, t, cur)` drawn through `cm` (world px), each element calling `hit()` for its sound.
- Text: Pillow 12 draws text ink opaque whatever its alpha, so faded text goes through `ftext` (a mask); never fade text with an RGBA fill.

- Depth and light (14 Nov 2026, owner: "looks a bit flat"; scenes/depth.py, rules-tech.md G14): `atmosphere()` replaces the flat background
  (key light, beams, floor, vignette), `motes()` (parallax dust), `reflect()` (the stage mirrored on the floor under the captions), `post()`
  (bloom, motion blur on zoom-throughs and pans outside the HUD and caption rows, film grain; every frame a pure function of t). Shading
  helpers for new kinds: `sphere`, `capsule`, `panel`, `soft_shadow`, `cm_ellipse`; giant type (120 px+) is lit automatically. New kinds:
  `wave` (two scenes: a shaded bud with noise rings; the money shot: noise + gold mirror wave flatten into a calm line: mic_cue, noise_cue,
  opp_cue, cancel_cue), `ride` (cabins in perspective the camera pans through: rides [{kind bus|metro|plane, text, cue}]; declare
  `"qa": {"edges_ok"}` for its full-bleed walls), `drain` (glass batteries draining against a clock with no digits: rows, max, clock_cue).

## The gadget look (13 Nov 2026, superseded the same day by the idea look; topic `"look": "gadget"`, scenes/gadget.py; design/rules-tech.md G1-G8)
The default for every tech reel from 13 Nov (the gadget channel; owner: "a similar grade as web", "more organised, with flow on the screen").
One fixed layout: the header row (`"format"` pill in gold + `"header"` title + a progress bar), the drawn product centred in the stage
(y 384-1326; the world is masked to that band, so a zoom never reaches the header or captions, and the camera keeps the whole product in it),
the captions in their own band (line 1, the hook, shown whole from frame 0 with `"hook_key"` in gold). Topic keys: `"hook_screen"` (the
screen's widgets in frame 0), `"tank": true` + `"water0"` (a glass test tank and its water level at frame 0). Scene kind `gadget`, params:
`screen` [widgets], `focus` {cue, w (widget index) | wy, hold} (the 6% lean-in), `callouts` [{side, y, big | count {to, dec, unit}, small, cue,
anchor [x, y], gold?}], `water` [{cue?, level}], `dust` (cue), `seal` {draw, wear}, `ruler` (cue). Widgets (fill the screen together, enter
at the scene's start, light up on their `cue`): `title` {text, sub?, gold?}, `spec` {text, hi [char indexes], hi_cue, label?},
`meter` {label, icon?, n}, `row` {icon, text, sub?, dot green|red, hi_cue?}, `count` {value, unit, label, count_cue, secs, dec?},
`ring` {value, unit, label, count_cue}, `drain` {label, icon?, drain_cue, to}, `note` {text, gold?, size?}; any widget takes `h`.
Icons: drop, dust, swim, shower, steam, cup, seal, timer, depth. Copy topics/ip68.json to start one.

## The phone walkthrough look (12 Nov 2026; topic `"look": "phone"`, scenes/phonecam.py; design/rules-tech.md L1-L6)
The default for every tech reel from 12 Nov (owner: "Tech reel doesn't feel like a change at all"). One big drawn phone on the dark palette (rules-tech.md L7, owner 12 Nov: no colour per
setting, one gold accent); `hook_page` {title, sub, rows [{text, from, to}]} flips the risky values to the safe ones by 1.1 s under the hook title; scene kind `tap` with params
`name` (the counter label), `steps` [{page, tap, cue?, action?: "choice" | "switch"}] (a page: {title, back?, sub?, icons?, rows [{text, value?,
switch?: bool, chevron?}], choice?: {from, pick}}), `before` / `after` (the notification banner), `paths`; the last scene kind `recap` with
`page`, `items` [{cue}], `stamp`, `stamp_cue`. Each tap time is its cue word (or spaced between its neighbours); each tap, page push, flip,
banner, card and tick is an element sound. Copy topics/stop-tracking.json to start one.

## The fixed structure
- 0–2 s: the hook card (the first line as a big three-or-four-line title, then IN 20 SECONDS); the voice reads it.
- Six scenes, one per remaining script line, each with a label chip at y≈392 (THE NEWS, THE FIX, ...) and its own tint.
- Header `<TOPIC> · EXPLAINED` at y≈300 and the part progress bar at y=262 (a segment per scene). The world is centred on x 510. Scene content stays between y 430 and 1196.
- Captions at y≈1290, 72 px bold, wrapped at 820 px and centred on x 510 (the safe zone's middle) on a faint glass plate: spoken words white, the current word gold, upcoming words dimmed.
- The last scene is the takeaway, ending on a big resolving chord, then a short fade.

## Topic file
```json
{
 "slug": "walmart-agents", "topic": "AI shopping", "voice": "af_heart", "speed": 1.05,
 "say": {"AI": "A I"},                       // display word -> spoken words (no digits, no hyphens)
 "hook": ["Can an AI", "shop Walmart", "for you?"],
 "verdict": "MYTH",                           // optional: a myth-bust stamp over the hook, on screen from frame 0 (rules-tech.md rule 9)
 "lines": [
  {"text": "Can an AI shop Walmart for you?"},  // line 1: the hook, no scene
  {"text": "...", "scene": {"label": "THE NEWS", "tint": "blue", "kind": "portal", "params": {...}}},
  ... six scene lines in all
 ],
 "chords": ["Am9", "Fmaj7", ...],            // optional: one per scene (hook first); see audio/synth.py
 "post": {"title": "...", "caption": "...", "keywords": [...], "hashtags": [5 tags], "sources": [{"url": "...", "note": "news"}]}
}
```
Scene params name the words that trigger each move (`open`, `hub_cue`, `inner_cue`, `a.cue`, `b.cue`, `stop_cue`, `items[].cue`), so every
animation lands on the word that says it.

## Rules for every topic
- Accuracy first: at least two sources, cross-checked; vendor research, news and government statements are kept apart; when they disagree,
  the script hedges ("per Microsoft", "reported", "attempts") and never states an unverified number. No sources inside the video; a short
  qualifier is fine.
- The script is plain spoken words: numbers spelled out, no hyphenated words, overrides for brand names and acronyms. Kokoro speaks about 3.9 words a second at 1.05; aim for 70 to 75 spoken words. A line longer than two caption rows is shown in chunks (automatic, or `"chunks": [word counts]` on the line).
- Shapes only: no stock footage, no real logos. Company and product names appear as text pills.
- QA before posting: read the contact sheet (a frame at every word onset) and `qa.txt` (text that overflows its box, captions over two lines,
  blank stretches over 0.3 s, loudness and true peak).
