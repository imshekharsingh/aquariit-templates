# Tintwell · "The Hue Dial" — treatment

Subject: `templates/2026-10-13-0851` (Tintwell, a fictional brand-colour studio). Format: 1080×1920, 30 fps, 18.0 s, 120 BPM (1 beat = 15 frames, 1 bar = 60 frames).
Hook (≤ 8 words, from the template's own headline): **"Is your colour costing you sales?"**. Payoff (last 4 s): **"Yes. A weak hue can cost sales."**

## 1. Visual DNA
- **Palette:** night violet `#1a0933` / `#25104a` / card `#2c1558`; tangerine `#ff5a1f` (hero), mint `#2de2c5`, violet `#7a3cff`, rose `#ff3d9a`, ink `#f6f1ff`. One live variable, `--h`, drives every derived colour (oklch).
- **Type:** Gabarito 900, tight tracking (−0.05 em) for display; Martian Mono for labels. Sentence case, confident and a little playful.
- **Grid and motif:** one column, rounded cards (22–28 px radius), the five-swatch fan, the hue dial (`38°` read-out) and its tint / shade / pair / accent row.
- **Motion personality:** springs that overshoot and settle (the template's own `linear()` spring), hard cuts on the beat.
- **Emotion:** "I found the one colour that makes people click": confident, bright, slightly cheeky, with a clear promise (fixed price).

## 2. Three concepts (scored 1–10: stopping power · originality vs the reel log · fidelity to the DNA · clarity of payoff)
| # | Concept | Logline | Arc | Motion | Sound | Score |
|---|---|---|---|---|---|---|
| 1 | **The Hue Dial** | The whole film is one turn of a colour dial; each beat ticks it and the entire page recolours; the last turn lands on tangerine, which is also the first frame. | question → the colour object → the dial turns (page recolours) → proof and price → silence → the spin lands → answer → loop | virtual camera, match cut on colour, spring type, whips, speed ramp | rising marimba note per dial tick, four-on-floor, riser into an impact | 9 · 9 · 10 · 9 |
| 2 | Page as architecture | Camera flies through the sections as if they were rooms. | wide → tilt → corridor → reveal | tilted 3D dolly | cinematic pads | 7 · 6 · 7 · 6 |
| 3 | Typographic manifesto | Type cards dissolve into the hero. | words → words → hero | kinetic type | percussive | 8 · 7 · 6 · 7 |

**Winner: 1.** It is the only concept that turns the template's signature moment (one hue driving every swatch) into the film's own structure, so the picture, the music (one note per tick) and the loop (hue 38° → 758° = 38°) all say the same thing.

## 3. Storyboard (frames at 30 fps, camera = virtual camera over the live page, every shot vector-sharp)
| Frames | Shot | Camera | On-screen text | Sound | Out |
|---|---|---|---|---|---|
| 0–44 (A) | type card on flat tangerine, the hook builds word by word on the beats (already moving at frame 0) | locked | "Is your / colour / costing" (≤ 6 words per card) | kick, hat; whoosh leads into the cut | HARD CUT on beat 3 (the type stays in place, the world changes behind it) |
| 0–66 (B) | macro of the tangerine swatch (label "tangerine 38°"), pull-back with roll and tilt while the five swatches fan open from under it | expo pull-back | headline slides up as the camera clears | same | continues |
| 45–89 (A) / 66–89 (B) | the hero: headline, the fan springing open, CTA; identical from frame 90 | slow push 1.0 → 1.04 | "you sales?" lands on the cut (A) | arp enters | push into the swatch |
| 90–119 | accelerating push into the tangerine swatch, light sweep | ease-in zoom to 6.5× | – | riser (J-cut into the match cut), sheen | MATCH CUT on colour (tangerine → tangerine, "38°" → "38°") |
| 120–179 | macro of the dial read-out, then pull back to the colour lab; the dial ticks +34° on every beat from 4.5 s and the whole page recolours | expo pull-back to 0.9× | "Watch one hue / become a system." per word | one rising note per tick (E minor pentatonic) + a click | whip |
| 232–245 | whip up to the proof cards (vertical motion blur) | speed ramp | – | whoosh | cards snap in |
| 255–299 | proof cards assemble on the beats, counters count 0 → 3 / 5 / 14 | slow push | "3 hues · 5 days · 14 tokens" | click + counter ticks | HARD CUT on the downbeat |
| 300–359 | packages slide in from opposite sides (₹9,999 / ₹19,999), light sweep | drift, then push into the price with a focus pull (everything else defocuses) | "₹19,999" | whooshes, "ding" on MOST PICKED | – |
| 360–383 | **breath**: held macro on the price, vignette closing, music drops out (reverb tail of the last chord rings) | micro-dolly | – | deliberate silence 12.0–12.8 s, then the riser | IMPACT cut |
| 420–452 | the dial spins one full turn (fast, then settling), every swatch following | tilted settle | – | impact, pitch sweep following the hue, chime when it lands on tangerine | whip |
| 465–510 | the answer card, word by word on the beats, CTA arrives | slow push | "Yes." · "A weak hue" · "can cost sales." · "Book my audit" | thumps on the words | iris wipe from the CTA button |
| 513–539 | iris fills the frame with flat tangerine: **the last frame is the first frame** | – | – | tail fades to silence at 18.0 s | LOOP |

## 4. Motion language
Springs for type and cards (the template's own `linear()` spring), expo-out for camera pull-backs (long settle), expo-in for the push-in (acceleration), hard cuts only on downbeats. One change on screen every 1.5–2.5 s. Techniques used (restrained, not all at once): match cut on colour, kinetic type locked to the beat, grid-snap assembly, whip with directional blur, focus pull, light sweep, speed-ramped spin, iris wipe, loop.

## 5. Finish
Subtle film grain (new offset every frame), gentle vignette that closes during the breath, bloom on highlights only, mild contrast/saturation (`eq=contrast 1.04, saturation 1.05`); the template's colours are not crushed. Motion blur: 4 sub-frames across a 180° shutter, averaged.

## 6. Sound
Original synthesis (`scripts/film/synth.mjs`, `film/…/audio.mjs`): kick, hats, claps, plucked bass, marimba-style arpeggio, bell ticks, whooshes that lead into cuts (J-cuts) and reverb tails that carry past them (L-cuts), riser and impact, silence at 12.0–12.8 s. Mixed to about −14 LUFS integrated, true peak ≤ −1.5 dB. For posting, the owner can swap it for Instagram's own audio (search terms are in the kit).
