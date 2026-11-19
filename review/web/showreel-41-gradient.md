# Review: showreel-41-gradient (web, postOn 2026-11-19 postAt 13:00 IST)

The Mandatory Gate, design/mandatory.md. Built 19 Nov by the daily run, the day it posts (learn-then-build), as the ESCALATE answer: the 19 Nov
audit says web ALARM two days running (median reach 1,552, target 2,000; watch 9.9 s vs 12; saves 1.5% vs 3%), so the format changes again, not a
tweak. Six single before/afters, then yesterday's details reel (1,573 reach, 27 saves and 10 shares per 1,000, the best save rate of the week); today's
new format is the swipe-reveal compare (design/improvements.md, web item 1, the researched improvement of the day): ONE divider crosses the SAME
card and shows the same two colours blended in oklch; the two states share one layout (same card, same text), so only the colour differs.
Topic: design/topics.md had no web row for Thu 19; chosen for the dynamic-fix test (rule 15) and satisfying-to-watch (rule 11): a gradient that
goes grey in the middle, fixed in one line. Hero card, whole frame, dark look in the saffron world (rule 12, 17); the gradient is the only thing that moves
before the fix (a slow turn).
- frame 0: the hook "Why does your gradient go grey?" is on screen over ONE frame-wide card (430 px, 290-780): a blue-to-yellow gradient turning slowly
  with the dead grey middle, "SUMMER SALE", the middle colour readout #808080 and chroma 0;
- "dead grey in the middle": the big stat "THE MIDDLE · sRGB #808080" fills the top zone, a ring pulses on the dull band, the BEFORE · sRGB tag;
- "The fix: blend in oklch": the code card types `.hero {` / `background: linear-gradient(` / `in oklch,` (lit) `blue, yellow);` / `}`;
- "Same two colours, and the middle stays vivid": ONE divider sweeps from the right edge across the same card, the oklch blend behind it (teal and green
  through the middle), the AFTER · oklch tag and the readout #00CFBD, chroma 14 (computed in the scene from the real blend: sRGB average, oklch average of
  lightness, chroma and the shorter hue arc, clamped to sRGB); both readouts stay side by side;
- payoff: the one line to copy on two lines above the card (`linear-gradient(in oklch, blue, yellow)`), the divider settles at the middle and scrubs
  gently, so the last frame is a saveable side by side: left sRGB, right oklch.
Facts checked in a real browser today: Chrome 157 (headless) renders linear-gradient(90deg, blue, yellow) with a grey middle (rgb 122,122,132 at 48%,
128,128,128 exactly at 50% by the average) and `in oklch` with a teal middle (rgb 0,203,194); BCD css.types.gradient.linear-gradient.interpolation_color_space:
Chrome 111, Edge 111, Firefox 127, Safari 16.2 (read 19 Nov 2026).
Local Output QA on the scene's own frames (node scripts/qa/frames.mjs + python3 scripts/qa/look.py, 10 fps): HUE 245 deg vs 40-expensive 155, 39-follow 325,
38-form 25 (needs 40); CALM median 0.6%, mean 1.7% (needs 3.5% / 5%); SPREAD 0%; SPLIT skipped (one card, no BEFORE and AFTER panes: the mute check below
reads the same card).

1. Topic: PASS: anyone who has used a gradient in a design tool or a CSS banner has seen the muddy grey middle, felt in 1 s; not done before (captions.json: no gradient or colour-space reel). Rulebook (design/rules-web.md): rule 1 pass (a banner every app has), rule 2 pass (the gradient is turning and grey at frame 0, the hook on it), rule 3 pass (the code card types at about 8.7 s on the simulated voice), rule 5 pass (a colour you see at a glance), rule 6 pass (hook "Why does your gradient go grey?", 6 words), rule 8 pass (one line to copy on screen to the end, MDN + BCD), rule 9 pass (sRGB and oklch have lexicon overrides), rule 10 pass (FLOW below), rule 11 pass (a satisfying colour sweep, saved to reuse), rule 12 pass (dark look, saffron world), rule 14 pass (the ring and the stat follow "dead grey", the code card follows "fix", the divider follows "same two colours"), rule 15 pass (the mute test: 1 s of the grey middle vs 1 s of the teal middle is obvious), rule 16 pass (hero 430 px wide to the foot of the zone, SPREAD 0%), rule 17 pass (no drift, no shake; the gradient turns and one divider moves)
2. Frame 0: PASS: SUBJECT FILL: 61% at frame 0; HOOK: clear of the subject; the turning gradient with its grey middle, the hook and the #808080 readout already on screen
3. Safe zone: PASS: SAFE ZONE: ok (the hook went from 52 to 48 px after the first sheet: "grey?" ran past x 960)
4. No overlap: PASS: OVERLAP: none; BAND: clear (the readout is two side by side columns, not two layers; the tags sit at the foot of the hero)
5. Motion: PASS: STATIC STRETCH: none (least change 0.3 at 12.5 s, median 3.7): the gradient turns all reel (30 deg either way), the divider crosses, then scrubs
6. Subtitles: PASS: SUBTITLES: at least 52 px, at most 6 words a line; all six sentences shown word by word and finished on the stills (the last, "Now your gradients stay alive.", on two lines)
7. Voice: PASS: PREFLIGHT voice: 189 letters, 6 sentences, about 14.7 s at speed 1 in one take (reel 18 s, voice must end by 17.4 s): fits; PRONUNCIATION: 2 overrides used: sRGB (config), oklch (config); no unchecked words; natural speed 1.0
8. Sound: PASS (by design; measured on the render at item 13): a whoosh at frame 0, a pop on "dead", typing ticks, a long move cue across the swipe, a snap when the divider settles, element cues on every moving element (ELEMENT SOUND 100%)
9. Payoff: PASS: the last 3 s: the line to copy above the card, the card split sRGB | oklch with both readouts (#808080 chroma 0 vs #00CFBD chroma 14), the divider scrubbing gently
10. Facts: PASS: MDN linear-gradient(), BCD (Chrome and Edge 111, Firefox 127, Safari 16.2, read 19 Nov 2026), a real-browser check in Chrome 157 (grey middle vs teal middle); npm run check passes
11. Post data: PASS: captions.json entry (channel web, postOn 2026-11-19, postAt 13:00, concept, experiment web-swipe-compare); 6 keywords, 5 hashtags; caption names who to send it to and invites a save; tip block with its demo in scripts/tips/demos.mjs
12. Review file: PASS: this file, items 1-11 and 14-18 PASS
13. After the render: PENDING
14. Cuts: PASS: FLOW: cuts 0 (declared: the swipe, wipeRestyle; the settle, sharedElement)
15. Dead runs: PASS: FLOW: dead runs none
16. Continuity: PASS: FLOW: continuity 70% (median step 0.8, 2 declared transitions; web from 16 Nov 35%+)
17. Strobes: PASS: FLOW: strobes 0
18. Element sound (web): PASS: ELEMENT SOUND: 47 of 47 animated elements have a cue (100%): ok

Owner-feedback lines, read against the stills: no wiggle (one slow turn, one divider); a colour world per reel, not the last three; whole frame used; nothing cut at the edges; every spoken line shown and finished; no brand card or call to action in the video; no saturated fill over 25% (the hero is 20% of the frame).
Researched improvement (design/improvements.md): web item 1, the swipe-reveal before/after: one vertical divider sweeps across a reel whose two states share one layout (ticked 19 Nov).
Craft improvement (design/craft-log.md): a computed readout in the picture: the middle colour of each blend is calculated in the scene (sRGB average, oklch average) and shown next to the swatch, so the number on screen is the fact the voice names; plus the swipe divider with a knob on one card.
References used (design/references.md): none
