# showreel-pv-tech-2d5-depth: the 2.5D map kit's depth pieces (task 22 study sample; never posted)

Study sample for scripts/explainer/kitmap.js (review/tech/kit-2d5-depth.md): light and depth on cards, three materials (TOKEN glass,
TERMINAL satin, BANK metal), contact shadows, the two-tier shadow-first build, and one CSS 3D object moment (a phone at the till).
Video: in the app, Inbox > Tests (R2 study/showreel-pv-tech-2d5-depth-preview.mp4, 10 s). Render 2 of 2 (the last).

## Builder
- Render 1: FLICKER PASS; DEAD FAIL 9.2-11.0 s (the end held still after the voice); with the real voice the TOKEN card built over the big phone.
- Render 2 fixes: a payoff after the voice (every step lit, APPROVED lands on the bank, a slow push in), the phone reaches its corner before
  step one, flat line caps (no stray dot), 10 s.
- Output QA on the render 2 MP4 (Output QA workflow): FLICKER PASS (zero glitches at 60 fps), DEAD PASS, PACE, STRAY, LOUD, COLOUR, EDGES,
  BULK, HUE, BLACKBG, VARIETY, LOOK, NUMBERS, CALM PASS. VIBRANCY, SPREAD and DEMO fail, but they are web-only checks: Output QA reads
  scripts/previews/ as web even with "channel": "tech" in the config (a check-tool detail for the app queue, not a defect of the sample).

## For the critic (main account)
2.5D DEPTH READY FOR CRITIC. Judge it against the owner's reference (design/references.md "R-ref 27 Nov 2026") and the 27 Nov 2.5D reel
showreel-tech-ai-words (READY, PREMIUM 8.0 / 8.0 / 7.5). The question is one: do the depth pieces make 2.5D look more premium without losing
its clarity and calm? Look at: the phone moment (0-1.5 s: does it read as a real object, is the turn calm), the shadow-first builds
(do the shadows read as shadows, not dark blobs, at 2.0, 4.6, 6.7 s), the three materials (distinct but one family), the focus dimming,
and the end payoff. Write CRITIC: READY (builders use the kit from the next day) or NOT READY with the exact fix; no third render.

## Critic (main account, 28 Nov 2026, render 2: study/showreel-pv-tech-2d5-depth-preview.mp4, 10.0 s, 1080x1920 60 fps, -14.0 LUFS)
Judged on the real MP4 (frames at phone size every 0.5 s, 10-15 fps strips around 4.3-5.2 s and 6.5-7.3 s, full-size frames at 0, 0.8, 2.0,
4.6, 6.7 and 9.6 s), next to the 27 Nov reel showreel-tech-ai-words (its real MP4) and the owner's reference (R-ref 27 Nov 2026).
The question was one: do the depth pieces make 2.5D look more premium without losing its clarity and calm? Partly: the materials and the
focus dimming are a real gain, but the shadow-first build reads as dark stains, and the sample drops the frame-filling grammar the 27 Nov
reel already had, so next to that reel it looks plainer, not more premium.
- What works (keep): the three materials are distinct but one family (TOKEN cool glass, TERMINAL warm amber satin, BANK teal metal; 9.6 s);
  focus dimming is clear (6.7 s: TOKEN and TERMINAL dim, the new card lit); the phone has a real contact shadow and a soft glass sheen
  (0.8 s); APPROVED landing on the bank with every step relit is a good payoff (8.7-9.6 s); FLICKER-clean on the step changes I stepped.
- Shadow-first build (the point of the study): FAILS. At 4.55 s and 6.95 s a dark oval appears alone in empty space for about 0.2 s before
  its card exists, with nothing above it, so it reads as a stain or a hole, not a shadow; at the same frames a lone 1-frame tick (amber at
  4.55 s, x 60-90 y 925; green at 6.95 s) shows where the outline trace starts. Then the card is an empty outlined box for about 0.2 s.
- Phone moment (0-1.5 s): frame 0 is title only, the phone is a ghost until about 0.6 s; it reads as a phone, flat and front-on, with no
  turn to speak of; calm but not a 3D object moment. Then it shrinks to a small corner icon ("Hold near reader" about 20 px) for the rest.
- Frame use: the map sits in the top 15-45 % of the frame; under the captions (y about 1700-1920 at 1080) and between map and captions is
  empty dark for the whole reel. The 27 Nov reel fills the frame with light wedges, sub-nodes and colour worlds; this one has none.
- Captions: the whole four-sentence script is on screen as one dim 4-line paragraph from 0.6 s to 9.0 s, lighting word by word, with no
  pause marks after the step numbers ("till One it sends", "Two the terminal") against the R-ref 27 Nov rule.
- Frame 0 does not show the whole small map (R-ref 27 Nov rule: open on the whole map); hook readable, but nothing to stop for.
- Section pill change at 4.6 s: one frame shows "01" and "02" pills over each other (a 1-frame cross-blend), with TOKEN's text doubled as it
  nudges about 4 px; small, but it is the kind of glitch the 2.5D rules forbid.
- Safety and AI label: generic phone, invented labels, no brands; flat graphics, aiLabel false would be right (study sample, never posted).
- GOLD (q43): the side-by-side script compared it to the web gold (it reads previews as web), so I compared by eye with the 27 Nov tech reel:
  below (every time: less of the frame used, no colour world light, smaller map).
- STOP: 5/10 (0-1 s: a title over black, the phone fading in). REWATCH: 6/10 (8.7 s: APPROVED lands; nothing else to watch twice).

PREMIUM: animation 6.5/10 (t 4.55 and 6.95: shadow blob then empty box then text, three separate steps; the phone shrink at 1.5-2.0 s is smooth), cleanliness 6.0/10 (t 4.55 and 6.95: stray ticks and stains; t 0.6-9.0: 4-line caption paragraph; lower third empty all reel), premium 6.5/10 (t 9.6: materials and payoff are good, but the frame is mostly empty next to showreel-tech-ai-words); weakest: 4.55 s and 6.95 s, the shadow appears alone as a dark blob; fix: shadow and card body grow together (see EXACT FIX 1).

UPGRADES:
- HIGH (4.4-5.0 s and 6.8-7.4 s): the shadow-first tier as one move: the card body rises from 40 % opacity and 6 px below while its shadow
  tightens under it from soft and wide to sharp and close (0.35 s, ease out), the outline traces round the body during the rise; never a
  shadow with no body above it.
- HIGH (whole reel): bring back the 27 Nov kit's frame-filling grammar under the depth pieces: each step's colour-world light wedge, faint
  sub-nodes and grid in the lower half, packets running along the lines.
- HIGH (0-1.5 s): open on the whole small map with the phone large in front, already tapping (a ring pulse from its reader), then the pull
  back makes it the map's first card; the phone tilts about 15 degrees as it travels (the 3D object moment the study promised).
- MED (9.0-10.0 s): after APPROVED, a pulse runs phone to token to terminal to bank and a quiet "paid" tick lands on the phone screen, so the
  end returns to the opening picture.
- LOW: caption chunks of one line at a time (as in showreel-tech-ai-words), the key word in the step's colour.

CRITIC: NOT READY: the depth pieces look good on the cards, but the shadow-first build shows dark blobs and stray marks at 4.5 s and 7 s, and the frame is mostly empty next to the 27 Nov reel. Detail: questions 1, 2, 23/36 (lower half), 43 (below the 27 Nov reel), 44 (STOP 5, REWATCH 6), Ambition pass 5 (shadow-first, frame 0 whole map, frame use); PREMIUM 6.5 / 6.0 / 6.5.
EXACT FIX: (study sample, no third render without the owner's yes; these go into kitmap.js so the first real reel that uses it gets them)
1. kitmap.js shadow-first build: the shadow never shows without its body; body and shadow start together (body 0 -> 1 opacity with a 6 px
   rise, shadow from blur 40 / offset 18 to blur 16 / offset 6 over the same 0.35 s); the outline trace starts only after the body is at
   0.4 opacity; drop the empty-outline box stage. Check: no frame at 4.4-5.0 s or 6.8-7.4 s shows a dark oval or a lone line tick.
2. Keep the 27 Nov map grammar on in kitmap (light wedge per step, sub-nodes, grid, packets on lines) so the lower half is used; depth is
   added on top of it, never instead.
3. Frame 0: the whole small map with the phone large in front (R-ref 27 Nov rule), then the pull back; a short tilt on the phone.
4. Captions: one line at a time, pause marks after every step number ("One: it sends a token...").
5. Section pill: switch with a 0.15 s fade-out then fade-in, never both pills in one frame; the old card does not nudge when the step changes.
Verdict for the kit: builders do NOT switch to kitmap from tomorrow; keep the 27 Nov 2.5D kit, and take only the three materials, the
focus dimming and the phone's contact shadow from kitmap until fix 1 is in and checked on a real render.
ENHANCE: open on the phone mid-tap with the ring pulse and the word "tap" landing on the beat; the first second is where this sample loses people.
