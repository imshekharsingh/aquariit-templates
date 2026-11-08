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
