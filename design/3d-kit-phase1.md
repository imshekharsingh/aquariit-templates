# 3D kit phase 1 (25 Nov 2026, owner-approved side job, hidden demo, never posted)
Code: techkit/world3d.js (window.W3D, inlined at `<!--WORLD3D-->` by techkit/make.py and scripts/3dkit-assemble.py). Demo: techkit/scenes/kit3d-phase1-demo.html (7 s).
Stills: review/tech/study-25nov/kit-phase1.jpg (frames at 0.1, 1.0, 1.4, 2.6, 4.2, 6.4 s). Workflow for the one preview render: Actions -> "3D kit phase 1 preview".

| gap | piece | what it does |
|---|---|---|
| 1 floating | `W3D.contactShadow(S, obj, {surfaceY, rest, w, d})` | a wide soft occlusion blob + a tight contact blob under the object; they grow and fade as it rises, and sit on whatever it lands on (block top) |
| 2 empty ground | `W3D.world(S, opts)` | tiled glossy floor, spot pool of light, stage glow, gradient sky = fog colour, 30+ coloured racks / tiles / phones / slabs behind the hero (depth of field blurs them) |
| 3 cables | `W3D.cable(S, pts, {color, radius, glow, pulse, floorGlow})` | thick tube + white-hot core (HDR, bloom), additive light ribbon on the floor, a point light that rides the travelling pulse; `update(t, on)` |
| 4 depth of field | `S.focus = obj` (on by default, `S.dof`) | focus plane follows the hero, objects within `focusRange` stay sharp |
| 5 layout | `W3D.place(THREE, objs, {mode: row/column/stack/ring})`, `W3D.check(S, objs, rects)`, `W3D.clearOf(S, obj, rects)` | placement from real bounding boxes; screen-rectangle check against logos, labels and the caption band; the demo asserts none of them touch (`window.__layoutCheck(t)`) |
| captions | `W3D.captions({lines:[{t0,t1,text,key}]})` | spoken line near the top, 60 px, grey words, current word white, key word in a thin blue (#4a8cff) selection box with square handles |

Usage order per frame: set the objects and camera from t, `cable.update(t, on)`, each `shadow.update()`, `S.draw(t)`, caption fn(t).
Cost (local software GPU, 1080x1920): about 2 s a frame (same chain as the quality test: HDR + 4 bloom mips + 24-tap DOF). Floor, props, shadows and cable add little.
Lessons: props must be limited to behind the hero (`maxZ`) or they fill the foreground; exposure 0.8 with a weak pool light (0.55): the first try washed everything to pastel; keep the drop height low so a falling object never crosses the caption band.

## Findings folded in (owner chat, 25 Nov, after the 3D test render) - stills: review/tech/study-25nov/kit-phase1-v2.jpg
- Cable glow was a hot spot at the port: the tube body is now bright along its whole length and a soft additive halo sheath (`halo`, `haloSize`) runs the full path.
- Depth of field was too faint: defaults raised (aperture 3.4, maxR 22, focusRange 2.2); props and tiles now visibly blur, the hero stays sharp.
- Objects looked plain: the demo block now has a glowing LED strip, brushed-metal feet and a metal ring round the port (second material, small details).
- Cost: the DOF pass is about half of the ~2.5 s a frame; for a long reel render DOF only on hero shots (`S.dof.on = false` elsewhere) or lower `maxR`.
- Demo as a video in the app: needs the render uploaded to R2 and a previews entry; not done here (asked the owner chat).
