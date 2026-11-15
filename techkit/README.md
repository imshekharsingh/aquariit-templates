# techkit: the @techin20sec kit engine (15 Nov 2026)

The owner's motion kit (design/kits/motion_kit.zip, design/kits/motion_content_prompt.md) ported as it is, wired to the repo's gates.
A topic file in techreel/topics/ with `"engine": "kit"` renders here; everything else still renders on techreel/make.py.

## Run it
- Stills and every pre-render gate (no voice model needed):
  `python3 techkit/make.py <slug> --fake-vo --stills 0,3,8.5,13.6,...` → PREFLIGHT, PRONUNCIATION, TIMELINE, CUES, SAFE ZONE, OVERLAP,
  SUBTITLES, CAPTIONS, FLOW x4, PAGE ERRORS, and `out/techreel/<slug>/stills.png` (one stills sheet).
- On GitHub: Actions → **Tech reel** → slug (the same workflow: Mandatory Gate, voice, render, voice check, R2, Output QA).

## Pieces
| path | what it does |
|---|---|
| `make.py` | voice (techreel/vo/tts.py, real Kokoro word times) → timeline (kit: 0.6 s lead, the topic's gap, 2.2 s tail, cues `[line, "word", n]`) → `timeline.js` + `scene.html` in out/ → frames (4 workers, 60 fps, JPEG) → ffmpeg `tmix` blur to 30 fps, CRF 17 → sound → two-pass loudness (-14.5 LUFS, true peak ≤ -1.2) → qa.txt, contact.png |
| `scenes/<slug>.html` | the kit scene: one file, `window.render(t)` sets everything from t (no CSS animation, no rAF, seeded randomness), `window.TL` cues, `window.TRANSITIONS` (declared camera moves and jolts), `window.__boxes()` (canvas label boxes for SAFE ZONE / OVERLAP), `data-subs` on the captions |
| `capture.cjs` | the kit's capture.js: Chromium (Playwright locally, the runner's Google Chrome via playwright-core and CHROME_BIN) |
| `preflight.mjs` | scripts/showreel/layout.mjs (SAFE ZONE, OVERLAP, SUBTITLES) and flow.mjs (FLOW) on the kit scene, every spoken chunk read on screen, the stills sheet |
| `sound.py` | the kit's sound.py: A-minor 100 BPM bed (pads, sub, arp, drums by chapter), whoosh into every chapter, the topic's `"sfx"` list `[cue, kind, gain, pan, {opts}]` (impact, pop, blip, tick, snap, thud, whoosh, chime, riser_end, ticks, shutters, zaps, fill); effects swapped for recorded CC0 samples (scripts/showreel/samples.py), small sounds on the detail bus (SOUND DETAIL) |

## A new topic
Copy techreel/topics/night-mode.json (lines, cues, sfx, post) and techkit/scenes/night-mode.html (keep the shared top: header, chip,
panels, captions, post effects; replace the hero drawing and the panels' contents). Layout that passes the gates: header y 250, chip y 408,
hero y 500-1200 (x 160-920), panel y 1240 (x 84-956), recap pills y 1000-1394, captions y 1430; canvas labels through `label()` (clamped
to x 64-956). Write 7 lines (≤ 20 words, the last ≤ 10), 100-140 words for 40-45 s.

## The shared frame (15 Nov 2026)
New topics use `techkit/base.html` (header, chapter chip, panel helper, step flows, recap pills, kinetic captions, camera, post effects) plus
one topic file `techkit/scenes/<slug>.js` that sets `window.TOPIC` = {title, eyebrow, final, vars (colours), chips, keyw, jolts, html (panels and
pills), cam(), hero(t) (world space, under the camera), labels(t) (screen space, `label()` reports boxes), panels(t)}. The topic's `"scene"`
points at the .js; make.py assembles scene.html. Examples: scenes/watch-5atm.js, scenes/screen-120hz.js. `DIFFS=1` on `--stills` prints the
still stretches FLOW counts against continuity.

## Calm and the object (15 Nov 2026 night; rules-tech.md K1)
No glass sheen (removed from every kit topic; Output QA SHEEN) and no box around the hero on new topics (watch-5atm; screen-120hz still has its box). A topic calls `subj(l, t, r, b)` with its subject's own rectangle under the
current transform (capture.cjs records `window.__subject()` every 0.5 s, make.py writes `<slug>.subject0.json` next to the MP4 for Output QA HERO), and may
declare `holds()` (window.HOLDS: a deliberate still, e.g. the title slam). Local look before the render: `KIT_SCALE=0.25 node techkit/capture.cjs
out/techreel/<slug>/scene.html <dir> 10 0 <frames>` then `python3 scripts/qa/look.py techreel/topics/<slug>.json <dir>` (SHEEN and HERO lines).
Example: scenes/watch-5atm.js (one watch on one track, `inWorld()` clips the near full-width world in screen space, the camera pushes to the part named).

