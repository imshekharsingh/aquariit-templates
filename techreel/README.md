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
| `scenes/base.py` | canvas (2x supersampling + a blurred glow layer), palette, easing and springs, background grid, header, progress bar, label chip, hook card, karaoke captions |
| `scenes/icons.py` | icon library built from shapes (bot, store, cart, card, lock, shield, check, cross, user, chat, gate, coin, doc, bolt, warning, key, chip, cloud, eye) |
| `scenes/kinds.py` | scene kinds (visual metaphors): `portal`, `flow`, `nest`, `choice`, `guard`, `checklist` |
| `audio/synth.py` | numpy synthesis: a pad per scene with chord changes, plucks, bells, clicks, whooshes, kick, thud, a resolving final chord, convolution reverb, ducking under the voice |
| `topics/<slug>.json` | one topic: script, scenes, pronunciation, post text and sources |

## The fixed structure
- 0–2 s: the hook card (the first line as a big three-or-four-line title, then IN 20 SECONDS); the voice reads it.
- Six scenes, one per remaining script line, each with a label chip at y≈392 (THE NEWS, THE FIX, ...) and its own tint.
- Header `<TOPIC> · EXPLAINED` at y≈292 and a progress bar at y=262. Scene content stays between y 430 and 1196.
- Captions at y≈1290, 72 px bold, wrapped at 860 px: spoken words white, the current word green, upcoming words dimmed.
- The last scene is the takeaway, ending on a big resolving chord, then a short fade.

## Topic file
```json
{
 "slug": "walmart-agents", "topic": "AI shopping", "voice": "af_heart", "speed": 1.05,
 "say": {"AI": "A I"},                       // display word -> spoken words (no digits, no hyphens)
 "hook": ["Can an AI", "shop Walmart", "for you?"],
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
