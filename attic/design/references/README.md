# Reference library (owner yes, 14 Oct 2026)
Reels the owner admires, studied for PRINCIPLES only. No reference is ever rebuilt.

## How the owner adds one
Open a GitHub issue with the label `reference`: paste the link or attach a screen recording, plus one line on what you liked.

## What Claude writes (one file per reference: `design/references/<date>-<slug>.md`)
- **Source:** link or "owner's screen recording" (the recording itself is never committed).
- **What the owner liked:** their line, verbatim.
- **Pacing:** cut lengths, holds, where it breathes, BPM feel (measured with `scripts/film/frame-review.py` on the recording).
- **Transition logic:** what motivates each cut (motion, shape, colour, a word).
- **Type behaviour:** size against the frame, entrance, how long it holds, how much text per beat.
- **Use of the frame:** fill, crop, safe zones, where the eye goes.
- **Do not copy:** its lines, its sequence, its signature image or object.

## Rules
- Notes only: no frames, clips or contact sheets of someone else's work are committed.
- A part derived from a reference gets an entry in `scripts/film/sources.json`, so `scripts/check.mjs` keeps enforcing: at most one part per reference in a film,
  never as the payoff, and none of the reference's own lines.

## Earlier studies (kept where they are)
- Reference study 2 (POV reel) and Reference study 3 (flip words, pendulum, radial tour…): `design/film-playbook.md`.
- Reference reel 1 (product film): parts listed under `ref1-product-film` in `scripts/film/sources.json`.
