# Gold reels: the one reel per channel every new reel starts from and is judged against

Owner chat, 24 Nov 2026: reels had not improved for days. The tech USB-C reel (showreel-tech-usbc-two-numbers) passed every check and an
Opus critic and the owner called it horrible (flat washed-out grey light, the same cable close-up for about 10 s, a plain plug). The only tech
reel the owner liked is showreel-tech-ai-memory. From 25 Nov each daily build starts from its channel's gold reel (`node scripts/starter.mjs
<tech|web|c3> <slug>`), Output QA LOOK compares its light with gold, and the critic views `scripts/qa/side-by-side.py` and writes NOT READY
unless the new reel matches or beats gold (design/critic.md question 43).

Everything below is measured on the posted MP4 (`node scripts/reel-fetch.mjs <name>`; light at 2 frames a second, 135x240; cuts from the
frame difference at 10 fps; loudness with ebur128) and read from the scene file, 24 Nov 2026. The LOOK numbers are in scripts/qa/gold.json.
Contact sheets: `python3 scripts/qa/side-by-side.py --contact reel-files/<name>.mp4` (16 frames, times printed).

Replace a gold reel only when a newer reel beats it on the critic's PREMIUM line and the owner did not dislike it: update gold.json (its
"look" from `gold_look.measure`), this file and the starter's source files in one push.

## Tech: showreel-tech-ai-memory ("Your next phone may have less memory")
Posted file = preview r3 (Output QA PASS, critic READY, PREMIUM 7 / 7.5 / 7.5; the owner liked it). Preview r4 (critic READY 7.5 / 7.5 / 7.5)
fixed r3's one weak spot (the first 8 s sat on one framing) and has real server faces; its MP4 sits in the study store, which the read key
cannot open, so it was not measured. The starter copies the r4 scene (techkit/scenes/ai-memory-r4.html, kit3d.js) with the r4 sound and
QA keys; the LOOK numbers come from the posted r3 MP4. 30.7 s, 1080x1920, -14.5 LUFS.

Shot list (from the MP4; hard changes at 2.7, 6.7, 8.2, 10.2, 11.7, 13.3, 16.5, 20.8, 24.7, 25.4 s):
| time | shot | bold word |
|---|---|---|
| 0-2.7 | A x-ray hero phone, front, chips tear out of the board toward the camera | 7 GB counting down |
| 2.7-8.2 | B the phone line-up (r4: low macro on the 4 GB board, then a three-quarter 8 GB phone) | 3 GB, 4 GB, 8 GB |
| 8.2-11.7 | C AI server hall, a curved wall of racks with amber heat, chips streaming in | WHY?, AI |
| 11.7-16.5 | D macro on a server memory module (r4: a tray of modules to the frame foot), rack focus | +90% |
| 16.5-20.8 | E the phone's board, chips flash amber, a laser cut | PRICIER, CUT |
| 20.8-24.7 | F the server aisle to the vanishing point, push into its light | 2027 |
| 24.7-30.7 | G the phone turns from its "About phone" screen to its back: the loop back to A | RAM, 8 GB |

How often the shot changes: 7 worlds, a new world every 3-5 s and a framing change about every 2.6 s (10 hard changes in 30.7 s); each world
change is a different kind (match cut, push-through, rack focus, light wipe, whip, push-through). 80% of 1 s windows have real motion.

Light and colour: mean brightness 0.154, background level (median) 0.076, deep dark background (luminance under 0.08) 51% of the frame,
washed-out grey 11%, contrast (luminance spread) 0.172. Ink #07080c background; the hero lit by rim and soft-box light, reflections on metal.
One accent at a time: amber #ffae3d for the problem (AI, heat, +90%, PRICIER, CUT), cyan #38e1ff only for the payoff (RAM), white for neutral
numbers. Washed-out frames: 1 of 61.

Type sizes (1080 px frame): bold word or number 168-320 px (GB number 270, AI 320, PRICIER 168), Inter Display 900, in the empty top band
(y 470-540), one at a time, each with its own entrance (drop, slam, wipe, rise, stamp, track); captions 52 px / 700 at y 1448, centred, shadowed.

Hero: one phone, low and large, the board seen through the back glass; it opens the reel, returns as E and closes as G, so the reel loops.
Between, every world shows what the phone's chips are part of (hall, module, aisle). The subject is always the only lit thing.

Numbers and labels: one big number at a time, which changes on the spoken word (7 -> 4 GB, 4 -> 8 GB, +0 -> +90%), with a small pop and a
low hit; white when fine, amber when bad; "GB" at half size beside the digit. No pills, cards, bars or chart labels.

Motion and sound: every hold has a slow push; real motion blur; sparks and slow motion on the chip rip; a laser on CUT. Sound: one hit or
whoosh per shot change and per word that lands (26 cues), a swell and low hit on each cut, a riser that crests on RAM, the voice at 1.0.

The 5 things that make it good:
1. Dark room, one lit hero: half the frame is near-black, so the phone and the numbers glow.
2. A new world every few seconds: phone, line-up, server hall, module, board, aisle, phone again; never the same picture twice in a row.
3. One huge number at a time that changes when the voice says it.
4. Objects that look real: glass, metal, chips with markings, server racks with lights; no plain shapes.
5. A story that loops: it starts and ends on the same phone, and the last line tells the viewer what to do.

## Web: showreel-46-tabwiggle ("Why do your tabs wiggle?")
Posted 24 Nov; Output QA all PASS; critic READY, PREMIUM 7.5 / 8 / 7.5 (the best web score). Chosen over showreel-45-homebar (READY with
HUE soft, an older build before the hook kit). 15.0 s, 60 fps, -14.0 LUFS. Scene scripts/explainer/tabwiggle.html (motion kit, hook kit,
black look).

Shot list (one still camera, no hard cuts; the frame changes by state):
| time | what |
|---|---|
| 0-1.4 | hook "Why do your tabs wiggle?" top-left; the phone already shows the bug: a tap at 0.25 s shoves the tabs, WIGGLES 1 |
| 1.4-4.2 | the width picture replaces the hook: "Following" regular -> bold, the extra width in red (+33 PX); bug again, "again?!" |
| 4.2-7.0 | the shove explained; taps keep counting (TAPS 5, WIGGLES 5) |
| 7.0-10.0 | the code card types in the hook's place (.tab::after content: attr(data-text)); the fix lands, slots appear |
| 10.0-15.0 | AFTER: taps move nothing, WIGGLES 0 in mint, "WIDTH HELD · 0 PX" label, AFTER THE FIX |

How often the picture changes: never a cut; something lands every 0.5-1 s (a tap, a count, a word, a code line); the top zone changes role
3 times (hook, measurement, code). Calm: the median 1 s change is a third of the tech gold's.

Light and colour: mean brightness 0.098, background 0.067, deep dark 68% of the frame, washed-out grey 2%, contrast 0.144. Near-black ink,
neutral surfaces, ONE accent mint #5fe3c0 (the fix, the good number) and red for the bug (red WIGGLES, "again?!", +33 PX). No frame, no glow.

Type sizes (540 px frame, double for 1080): hook 54 px Sora 800, last word in the accent; subtitles 30 px / 600 under it; meter numbers
72 px / 800; tabs 34 px; labels 15 px mono with wide tracking; code 19 px mono.

Hero: the top of a phone 504 px wide (93% of the frame), y 390-836, with the tab bar 2x real size; it never leaves; the bug happens inside
it by 0.5 s and again before 2 s.

Numbers and labels: TAPS / WIGGLES meter under the tabs, stepping on each tap with a pop; red while broken, mint 0 after the fix; a measured
number (+33 PX) in the hook's place; a leader-line label for the result.

Motion and sound: one clean shove per tap with a ghost of the old place; reaction words pop and leave; the code types with a caret; every
element has its own sound pitched by its size; a low hit on each bug.

The 5 things that make it good:
1. The bug happens in the first half second, before the viewer reads anything.
2. Black background, one accent colour: the eye goes straight to the broken thing.
3. A counter that proves it: WIGGLES climbs while broken and sits at 0 after the fix.
4. The fix is real code on screen, short enough to screenshot.
5. Short and calm: 15 s, one camera, one thing moving at a time.

## Turns Out: showreel-c3-grey-text ("This menu is hard to read")
Render 3 (Output QA PASS, run 45338746481; critic READY, PREMIUM 7.5 / 7.5 / 7.5; the owner liked its preview). Design engine
(scripts/channel3/design/contrast2.js, the improved kit: natural voice, believable before). 21.2 s, 30 fps, -14.0 LUFS.

Shot list (one stage, the board changes in place; the camera pushes per fix):
| time | what |
|---|---|
| 0-1.5 | "Hard to read." title, the café specials board in soft grey on cream, a LIGHT GREY tag |
| 1.5-6.5 | "Soft, but too light": the mistake marked (red outlines, LOW CONTRAST tag); "text needs contrast" |
| 6.5-9.5 | FIX 1 OF 3 · darker words: the words darken, the counter behind lights up |
| 9.5-11 | FIX 2 OF 3 · lighter board: the board lightens, selection handles |
| 11-15 | FIX 3 OF 3 · check it: a contrast chip FAIL -> PASS, MIN 4.5 : 1 |
| 15-21.2 | "Same menu. Clear.": checks on every line, the before thumbnail tagged BEFORE next to the AFTER board, held 3 s+ |

How often the picture changes: one stage, a visible change about every 1.5-2.5 s (ELEMENTS longest gap 2.6 s); the title line changes 4 times.

Light and colour: mean brightness 0.352, background 0.233, deep dark 32% (the navy top band), washed-out grey 5%, contrast 0.343 (the
highest: a cream board on a dark stage). Dark navy top, warm lit wooden counter, cream board. Accent: warm orange for the problem word
("read.", "too light"), mint for the fix and PASS.

Type sizes (540 px frame): title 31 px / 900 (hook 46 px), subtitles 29 px / 700, fix chip 15-16 px tracked caps, board title 30 px,
board items 21 px, descriptions 15 px.

Hero: the board, 408 x 368 px (76% of the width), always in the same place; only its design changes, so before and after compare in place.

Numbers and labels: "FIX n OF 3" with a ring counter; one check chip with the real ratio (MIN 4.5 : 1, FAIL red -> PASS green); tags at the
board's foot (LIGHT GREY, LOW CONTRAST, BEFORE, AFTER).

Motion and sound: a slow push on each fix, colours changing live, spark bursts on each change, the room light rising as the fixes land;
one sentence a fix with a breath after it.

The 5 things that make it good:
1. A believable before: a menu someone would really make, with one honest mistake.
2. One board that changes in place, so the before and after are the same thing.
3. Three numbered fixes, each landing on its own sentence.
4. A real number to aim for (4.5 : 1) that the viewer can check themselves.
5. A last frame with before and after side by side, worth saving.

## What the gold reels share (and what the USB-C reel missed)
- A dark frame (deep dark 32-68%) with one lit subject; the USB-C reel had 19% dark and a lit grey floor (background 0.208 vs 0.076).
- One accent colour for the change; the USB-C reel had grey gradients everywhere (washed-out grey 21% vs 11%).
- The hero is a real-looking object that stays the subject; the USB-C cable cross-section held about 10 s.
- One big number or word at a time, on the spoken word.
- Output QA LOOK on the USB-C reel vs gold: FAIL, 5 of 6 measures off, 42 of 66 frames washed out (0-5.5, 10.5-24, 31-33 s).

- (owner, 24 Nov 2026, storage-gap) The starter copies the look, light, type and pacing of the gold reel, never its hero object or layout. The critic fails a reel whose main object matches any of our last 5 reels.

## Tech, the colour-world 3D look: showreel-tech-gold3d-sample (candidate, 26 Nov 2026)
Built by the phase 2 3D kit (design/3d-kit-phase2.md, techkit/README.md "3D colour-world kit"). Candidate until the critic writes READY and the owner likes it; then it becomes the gold for tech reels in this look and
scripts/qa/gold.json "tech3d" holds its LOOK numbers. Start a reel in this look with `node scripts/starter.mjs tech3d <slug>` (config key `"look": "3d"` makes Output QA LOOK use "tech3d" and lets saturated fill cover up to 50 %).
What makes it the model: a neutral dark world with blurred background props, glossy colourful objects, thin separate glowing cables, number figures in 3D, one camera path, words boxed in blue.
Render v1 (26 Nov 2026, Actions run "Tech reel · gold3d-sample (preview)", about 12 min wall, 5.5 min a part on 6 parts): 13.8 s (the real voice is 11.3 s, so shorter than the 20 s asked), Output QA PASS (COLOUR, EDGES, LOUD, PACE, NUMBERS, VARIETY, DEAD pass; HERO warns: no subject box). LOOK numbers measured from that MP4 are in gold.json "tech3d": bright 0.19, bg 0.124, dark 43 %, grey 2 %, contrast 0.225. File: R2 study/showreel-tech-gold3d-sample-v1-preview.mp4 (app: Studio log, "3D kit sample reel", Watch).
