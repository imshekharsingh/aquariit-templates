# 3D kit quality test (25 Nov 2026, owner-approved, hidden sample, never posted)
Scene: techkit/scenes/test-3d-quality.html (4 s). Stills: review/tech/study-25nov/3d-test.jpg (4 frames), step-by-step crops: 3d-test-steps.jpg
(left to right, top row then bottom: baseline, +clearcoat, +env, +shadows, +bloom, +DOF, +ACES). Bench: `python3 scripts/3dtest-assemble.py && node techkit/3dtest-bench.cjs out/3dtest/scene.html <dir> <times>`.

## What each technique added, and its cost (local software GPU, 1080x1920, seconds per frame incl. screenshot)
| step (cumulative) | s/frame | added | look |
|---|---|---|---|
| 0 Standard material, one light, no env | 0.28 | | flat plastic |
| 1 MeshPhysicalMaterial + clearcoat | 0.31 (+0.03) | almost nothing alone | needs an environment to show |
| 2 environment map (own PMREM soft-box room) | 0.43 (+0.12) | the gloss: edge glints, reflections on the block and chip | the biggest look gain for the cost |
| 3 soft shadows (PCFSoft, 2048 map, ShadowMaterial over the grid) | 0.57 (+0.14) | block and chip sit on the floor | worth it |
| 4 bloom (HDR target, threshold + 4 blurred levels) | 1.00 (+0.43) | the cable and plug glint glow | needs the HDR target; MSAA target is the cost |
| 5 depth of field (24-tap disc blur from a depth texture) | 1.99 (+1.0) | soft far floor | subtle at this camera; the costliest step |
| 6 ACES tone mapping (in the final pass) | 1.97 (+0) | richer purple, highlights roll off | free |

## Verdict
Closer, not there yet. Glossy purple block, chip, grid floor, shadow and glow read as a real 3D explainer and are clearly above our flat chip look.
What is still missing against the reference: a thicker visible glow bloom on the cable (bloom is a hot spot at the plug, not a halo along it), a stronger
rim light and floor reflection, visible depth of field (needs a closer, lower camera), and finer detail on the objects.

## Time for a 30 s reel
Frames: 30 s x 60 fps = 1800 (the kit blurs 60 to 30 fps).
**GitHub runner, all effects on (measured 25 Nov):** 6 parts of 40 frames each took 93 to 141 s per part (browser start and shader compile included),
so about 2.3 to 3.5 s a frame, median ~2.5 s; the whole 4 s (240 frames) frame stage took 2.5 min wall. That is about 1.25x the local figure.
A 30 s reel at that cost: 1800 x ~2.5 s = ~75 min of frames, ~13 min wall over 6 parts (+ ~2 min join), ~80 runner-minutes. Over 8 parts: ~10 min wall.
(The first join step failed only because ffmpeg was not installed on that runner; fixed in test-3d.yml.) The local figures below are the estimate by step:
- Steps 0-3 (gloss + shadow, no post): ~0.55 s x 1800 = 16.5 min of frames; over 6 parts ~3 min plus start-up.
- All on (bloom + DOF + ACES): ~2.0 s x 1800 = 60 min of frames; over 6 parts ~10 min per part plus start-up (about 15 min wall), but 6 runner-jobs of 10 min each.
- Cheapest good look: steps 0-4 (no DOF) ~1.0 s x 1800 = 30 min, 5 min per part over 6 parts. Suggest this; add DOF only on hero shots (render those frames with it).
Cost is runner minutes only, no model cost.
