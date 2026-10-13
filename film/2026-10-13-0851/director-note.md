# Director's note · Tintwell "The Hue Dial" (2026-10-13-0851)

1. **Concept.** One turn of a colour dial is the whole film: each beat ticks the dial, the entire page recolours with it, the last turn lands back on tangerine, and the last frame is the first frame (a loop). It turns the template's signature moment into the film's structure.
2. **Why it should stop a thumb.** Frame 0 is already moving, in flat tangerine with a type slam (A) or a macro of the swatch pulling back (B); the hook builds word by word on the beats; a match cut on colour (tangerine to tangerine, "38°" to "38°") is the first "how did they do that" moment; the held silence and the impact at 14.0 s are the payoff set-up.
3. **What it says to a buyer.** Question (is your colour costing sales?) → proof (3 hues, 5 days, 14 tokens) → fixed price (₹9,999 / ₹19,999) → answer ("Yes. A weak hue can cost sales.") → one action (book an audit). No invented results.
4. **What to watch in performance.** Compare A vs B on 3-second retention and average watch time (the only difference is the first 3 s). Then shares/sends per reach against the screen-recording reels (design/experiments.md). If both beat the baseline, the cost of a film (about 5 min of free CPU) is worth it every day.
5. **Honest limits.** I checked the picture frame by frame, and the sound numerically (−14.4 LUFS integrated, true peak −1.4 dB before AAC, silence 12.0–12.6 s measured at −60 dB, impact +13 dB over the riser, event table identical to the picture's) but I cannot listen: please play it with sound on and tell me what feels off. The score is a placeholder for Instagram's own audio if you prefer it.

## Rubric (1–10), after 3 revision passes
| Criterion | Score | Note |
|---|---|---|
| First-second stopping power | 8 | moving at frame 0; A is type-first, B is image-first |
| Motion polish | 8 | no frozen frames (freeze detector), exact frame times, 4-sample motion blur; whip frames are blurred by design |
| Typography | 8 | template's own type, per-word mask reveals, ≤ 6 words per card |
| Rhythm and audio sync | 8 | one shared timing table drives picture and sound; not auditioned by ear |
| Fidelity to the template | 9 | live DOM of the page, colours kept true (the dial changes them on purpose and returns to 38°) |
| Originality vs the reel log | 9 | every earlier reel was a scroll recording |
| Loop seamlessness | 9 | first and last frame average colour within 2/255 |
| Safe zones | 8 | key text between 96 px and 78 % height and inside 30 px gutters; macro/transition frames bleed on purpose |

## Revision log
- **Pass 1:** counters flickered (the template's own real-time count animation fought the film clock) → disabled; proof numbers rendered tiny (a CSS bug in the template: `.stat span` shrinks the number) → fixed in the film, template fix proposed separately; macro text was pixelated (3D layer raster) → flat compositing; price macro was off-centre → measured text box; hue spin was a flash → slower curve; iris wipe was instant → eased; content sat low under Instagram's bottom UI → zoom 0.9 and centre raised.
- **Pass 2:** variant B held still for 1.5 s → pull-back and fan retimed; whip crossed empty void → sections closer; true peak clipped after AAC → limiter; motion-blurred digits ghosted → numbers read at frame time.
- **Pass 3:** the "silence" was only 5 dB quieter → true duck to −60 dB for 0.6 s; the impact was only +5 dB over the riser → riser stops 70 ms early, impact 13 dB louder.

## Files
`out/film/2026-10-13-0851/`: `…-A.mp4` and `…-B.mp4` (masters, 1080×1920, 30 fps, H.264 High, AAC 48 kHz), `…-cover.png` (+ `…-cover-grid-preview.png`: full 9:16, 3:4 and 1:1 crops), contact sheets. Source: `scripts/film/` (engine, renderer, synth), `film/2026-10-13-0851/` (story, timing table, score, treatment).
