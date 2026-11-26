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

## The reset (22 Nov 2026; rules-tech.md D, P, X)
Each format may hide the shared header panel and build its own world; secondary motion that belongs to the object (pulses, flowing particles,
spinning parts) is wanted again (D4). Still out: sweeps across the hero (SHEEN fails from 4), a box round the hero, whole-frame wobble.
First reel on the bar: scenes/heart-green.js (xray, added in its own push on 22 Nov: a watch on a wrist cut open in layers, light into the skin, blood cells streaming).

## Calm and the object (15 Nov 2026 night; rules-tech.md K1, loosened 22 Nov)
No glass sheen (removed from every kit topic; Output QA SHEEN) and no box around the hero on new topics (watch-5atm; screen-120hz still has its box). A topic calls `subj(l, t, r, b)` with its subject's own rectangle under the
current transform (capture.cjs records `window.__subject()` every 0.5 s, make.py writes `<slug>.subject0.json` next to the MP4 for Output QA HERO), and may
declare `holds()` (window.HOLDS: a deliberate still, e.g. the title slam). Local look before the render: `KIT_SCALE=0.25 node techkit/capture.cjs
out/techreel/<slug>/scene.html <dir> 10 0 <frames>` then `python3 scripts/qa/look.py techreel/topics/<slug>.json <dir>` (SHEEN and HERO lines).
Example: scenes/watch-5atm.js (one watch on one track, `inWorld()` clips the near full-width world in screen space, the camera pushes to the part named).

## The object opens up (16 Nov 2026; rules-tech.md K2)
An object topic transforms the subject itself on every beat: cutaway / x-ray (an iris clip over the drawing), parts that lift out and press back,
a case that flexes (`frect()` in scenes/watch-5atm.js: a rounded rect whose sides bow inward), an exploded view on an isometric stack. Output QA
HERO counts only change inside the subject's box (its move, zoom and squeeze warped out, a 20% rim left out): 55%+ of the samples; its line
lists the still moments to fix. The Tech reel run keeps `<slug>-subject.json` in R2 next to the MP4, so the Output QA workflow replays HERO by hand.

## The 3D kit: techkit/kit3d.js (23 Nov 2026; owner: "put the fixes in kit first"; rules-tech.md M1-M6)
A standalone 3D scene (three.js at `<!--THREE-->`) puts `<!--KIT3D-->` after it; make.py inlines techkit/kit3d.js there. First reel on it: scenes/ai-memory.html.
- **Shot changes**: `KIT3D.cut(kind, u, opt)` + `KIT3D.compose(...)`: `match` (both shots frame the same shape, three-frame dissolve), `push` (the camera goes
  into a part, a glow in the story's colour, the next shot is already moving forward), `rack` (focus dissolve), `wipe` (a band of light crosses, the next
  shot is behind it), `whip` (one fast pan, small yaw so the frame never empties). The scene draws the outgoing and the incoming shot at the same
  moment (`apply(t, shot, mod)`), so a change never passes through black. Use 3+ kinds a reel, each where it has a cause.
- **Motion blur**: `accumulate()` in the scene: 4-10 time samples over a 1/50 s shutter (`KIT3D.plan`), each smeared along the camera's own screen motion
  to the next sample (`KIT3D.smear`: shift + zoom), offset by part of a pixel (`KIT3D.jitter`), drawn at 1x (no supersampling). No stepped copies.
- **Never still**: `KIT3D.glide(u)` for a shot's move (speed at both ends) and `KIT3D.push(secs)` under a hold; something already in the air at frame 0.
- **Words**: `KIT3D.word(o, text, kind, t, t0, t1, opt)`: slam, drop, rise, track, stamp (+ `split`), wipe. One per shot, a different kind each time,
  in the empty top band (baseline y 450-540), gone before the shot starts to change; never on the object.
- **Materials and light**: `KIT3D.materials(THREE, ctex)` (epoxy chip tops with a faint laser mark, colour only as the edge glow; metal and gold that
  do not burn; a wrapped battery; screen glass that takes a drawn UI; perforated rack sides) and `KIT3D.light(THREE, scene)` (key, cool rim, warm kicker, exposure 1.2).
- **Frame**: the object large and low, the picture running to the bottom under a soft scrim (ink only in the last 2%), subjects whole unless the shot is a declared full-bleed.
- Local look: `python3 techkit/make.py <slug> --fake-vo --stills <times>` once (timeline), then `python3 scripts/tech-assemble.py <slug>` after each edit and
  `KIT_Q=0.5 KIT_SCALE=0.25 node techkit/capture.cjs out/techreel/<slug>/scene.html <dir> times <t1,t2,...>` (about 2.5 s a frame). `KIT_Q=0.5` also speeds up the preflight.
- Render: the Tech reel workflow splits the frames over `parts` jobs (default 6) and joins them; `preview: r2` keeps the result only in R2 study/ for the app's Previews.
- **Counts, framings, places, cut sound (24 Nov 2026; rules-tech.md M7-M10)**: `KIT3D.countTo(t, t1, a, b)` (a count in 0.55 s that lands on the spoken word), `KIT3D.reframe(A, B, k)` (a second framing inside a shot), `materials().server()` (a rack face that reads as servers), the topic's `"cutsound": {"payoff": "<cue>"}` (sound.py: swell + low hit on every shot change, a riser that crests on the payoff).
- **A preview with its own scene**: `techreel/previews/<slug>-<tag>.json` (keys replace the topic's when the Tech reel run has `preview: <tag>`; locally `PREVIEW=<tag>`). A posted reel's scene and topic are never edited for a study render: copy the scene (scenes/ai-memory-r4.html is the example).

## 3D colour-world kit (26 Nov 2026; design/3d-kit-phase1.md, design/3d-kit-phase2.md)
Files: `world3d.js` (window.W3D: stage, world, contactShadow, cable, place/check/clearOf, captions) and `lib3d.js` (W3D.lib objects, figures, camPath). A scene puts `<!--THREE-->` then `<!--WORLD3D-->`
(both files) in its html; techkit/make.py and scripts/3dkit-assemble.py inline them. Starter: `node scripts/starter.mjs tech3d <slug>` (copy of techkit/scenes/gold3d-sample.html).
Frame order: set objects and camera from t (`cam(t)`), `cable.update(t)` / `reveal(u)`, `shadow.update()`, `S.draw(t)`, caption fn(t). A scene is a pure function of t.
- `S = W3D.stage(THREE, {W,H})`: renderer, environment, lights, post chain. `S.dof = {on, aperture, focusRange, maxR}`, `S.focus = obj | Vector3` (DOF follows the hero), `S.bloom`, `S.exposure`.
- `W3D.world(S, {seed, props, palette, radius, heroZone, maxZ})`: dark neutral floor with a pool of light and haze, blurred racks / tiles / phones behind the hero (`maxZ` keeps them behind it).
- `W3D.contactShadow(S, obj, {w, d, surfaceY, rest})`: shadow + occlusion under an object; call `update()` each frame.
- `W3D.cable(S, points, {color, radius, glow, halo, pulse, floorGlow, light, segments})`: `update(t, on)`, `reveal(0..1)` grows or retracts it. With many cables use `light: 0` and `segments: 90`.
- `W3D.lib.appTile / phone / laptop / chip / rack / productBlock / codeCard / dialog`, all standing on y = 0, size in `userData.size`; `appTile` has a logo slot (`userData.logoSlot`, or pass `logo: texture` from a licensed file).
- `W3D.lib.figure(THREE, '3x8=24', {height, color})`: 3D number figures (0-9 + x = -). Ride the camera for a fixed screen spot (see gold3d-sample).
- `W3D.camPath(S, keys)`: one continuous move through keys `{t, pos, look, fov}`; `W3D.place(THREE, objs, {mode: row|column|stack|ring})`; `W3D.check(S, objs, rects)` / `W3D.clearOf` for logo and label overlap.
- `W3D.captions({lines: [{t0, t1, words, times, keyIdx}]})`: grey words, current white, key words in the blue selection box with padding.
Portrait frame: the view is narrow (width = 0.56 x height), so use fov 50-55 and keep the cast within about 6 units of width at the hero's distance.
Cost: about 2 s a frame at 1080x1920 (local software GPU); the 20 s sample at 60 fps is 1200 frames, run in 6 parts.
Lessons for every reel in this look (rules-tech.md D1-D8, critic 26 Nov 2026): frame 0 is the busy hook picture with a question or number; three distinct camera moves and a loop back to the first framing; no framing held over 3 s; cables end on tile side edges, names inside tiles and never repeated; any "artifact" card readable (34 px+) in clear space or dropped; numbers ride the camera (`lib.figure`) and step aside in close shots; captions on the dark fade (default); hold the payoff to the last frame; voice lines 6-9 words; `"aiLabel": false`. The sample techkit/scenes/gold3d-sample.html is the working example of all of them.
Lessons from the v3, v4 and v5 critics (26 Nov 2026; the v5 render is the tech 3D gold, critic READY 7.5 / 8 / 8):
- v3: frame 0 was a calm grid (no hook); one tower framing for half the reel; an unreadable code card over the tiles; cables across names; app and tool names repeated; the end drifted.
- v4: the opening and the ending each held one framing for about 5 s; the hub covered two of the eight tools so the picture no longer did "3+8=11"; the push-in cut "Notes"; the tangle ran over the bottom tool row; a 24 px sub-line.
- v5 (what fixed it): a camera move inside the first 3 s (a pull-back with a turn also counts: any 10 % scale change); the hub floats between the apps and the wall, high enough to clear the apps and low enough to clear the tools; close shots pulled back until every name is whole; cables routed outside the wall's sides; a small turn home in the last 2 s; no sub-line under a block name; calm glow (S.bloom .28, cable halos about .09, floor light about .28).
- Still to do in daily reels (v5 critic notes): when a new item joins, make the number agree (a "+1" or "3+9=12"); give every tile its own icon; 20-35 s, not 18; one readable artifact at 34 px+ in its own space.
- Checks before stills: `node techkit/check-gold3d.cjs out/techreel/<slug>/scene.html auto` (after `python3 scripts/tech-assemble.py <slug>`) reports names cut, under the caption fade, under the hub or a number, crossed by a cable, and a hub hidden by the apps; it reads the scene's `window.__dbg`, so keep those names (apps, tools, hub, newTool, tubes, hubTubes, newCable, figs) or adapt the check. It found every v4 fault except one: a hub that was never added to the scene (a comment pasted in front of code on one line). Look at the stills sheet as well.
