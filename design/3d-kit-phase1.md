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
