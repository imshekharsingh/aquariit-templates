# Review: showreel-c3-golden-gate (c3, postOn 2026-11-08 postAt 13:00 IST)

The Mandatory Gate, design/mandatory.md. AUTO lines pasted from `node scripts/channel3/qa.mjs scripts/channel3/golden-gate.json --write`,
`node scripts/showreel/preflight.mjs` and `node scripts/showreel/stills.mjs` on the final scene (8 Nov, ~03:30 IST). Stills: three sheets
(first pass, fix pass, final), the final at the cover and 1.5, 5, 9, 11, 13.5, 15.5, 18, 20, 22.5, 24.5, 27, 30.5, 33.5 s, scored beat by beat
against design/channel3.md "Quality bar" (read for 2.5D).

1. Topic: PASS: anyone who knows the orange Golden Gate Bridge sees it painted black and yellow in frame 0 and feels "wait, what?" in 1 s; not done before (captions.json: no bridge or paint story on any channel); rules-c3.md: rule 1 pass (a world icon in a state that looks wrong, recognised by its Art Deco towers and cables), rule 2 pass (four repaints you watch happen: Navy stripes, Army stripes, primer, International Orange), rule 3 pass (hook spoken and shown from frame 0 in 9 words, answered by "Started as primer." in the last 3 s), rule 4 pass (34.8 s; a big change every ~3-4 s; one camera, FLOW: cuts 0), rule 5 pass (5 sources, every claim in two; credit on the last frame), rule 6 pass (slot moved by the owner to 13:00 IST today: postAt 13:00), rule 7 pass (PRONUNCIATION: no unchecked words; "US" and "red-orange" reworded out of the voice), rule 8 pass (one a day from 8 Nov; no other c3 reel for 2026-11-08)
2. Frame 0: PASS: SUBJECT FILL: 93% at frame 0; HOOK: clear of the subject on the stills (the tower tops sit below the hook's last line); frame 0 is the whole bridge in black and yellow stripes over drifting fog, the camera already pushing in
3. Safe zone: PASS: SAFE ZONE: ok (qa.mjs and stills.mjs)
4. No overlap: PASS: OVERLAP: none (qa.mjs and stills.mjs); BAND: read on the stills: the caption card sits on the water or the headland in the wide beats; in the close-up of the paint (21-25 s) it covers only the tower's pier and the near deck, never the paint front
5. Motion: PASS: STATIC STRETCH: none (least change 1.3 at 34 s, median 5.5); EMPTY FRAMES: none (least detail 47.1)
6. Subtitles: PASS: SUBTITLES are canvas-drawn (not marked): read on the stills: the shared core's 27 px caption at the 540 px scale = 54 px in the 1080 frame, at most 6 words a line, every sentence shown and finished (QA captions: all 8 sentences on screen)
7. Voice: PASS: PREFLIGHT voice: 8 timed sentences, 82 words, voice ends about 32.9 s (reel 34.8 s, must end by 34.2 s), 2.8 words/s while speaking, 2.5 overall: fits; PRONUNCIATION: 2 overrides used: colour, 1937 (year); no unchecked words
8. Sound: PASS: QA sound: 18 cues: a low hit with the question, a whoosh on each of the 6 camera moves, thuds on the two stripe stamps and the primer stamp, swishes under the two repaints, a long soft whoosh under the slow-motion orange, hits on Morrow, International Orange and 1937, a thud on the payoff; the bed lifts into the payoff; the workflow's SOUND GATE checks the loudness
9. Payoff: PASS: International Orange rolls up the near tower in slow motion at 21-24 s; from 25 s the whole orange bridge with traffic and "1937 OPENED", the year counter rolling to "STILL ORANGE IN 2026"; the last frame shows "Started as primer." / "THE STRIPES NEVER HAPPENED" over the orange bridge at golden hour, credit above
10. Facts: PASS: 5 sources in the config (goldengate.org painting page, NPR 2011, History.com, Gizmodo, San Francisco Examiner); every claim in two (scene header): Navy black and yellow (History.com, Gizmodo), Army Air Corps red and white (History.com, Gizmodo), red primer (NPR, SF Examiner), Morrow and the setting, International Orange (NPR, goldengate.org), opened 1937 (History.com, goldengate.org); npm run check passes
11. Post data: PASS: captions.json entry with channel c3, postOn 2026-11-08, postAt 13:00, concept, about, note; 7 keywords, 5 hashtags; experiment c3-1300-slot vs median
12. Review file: PASS: this file, items 1-11 and 14-17 PASS before the one render
13. After the render: PASS: run 42432860027 completed/success (25 GitHub minutes); SOUND GATE: ok -14.2 LUFS, true peak -1.4 dBTP; voice check heard every line (84 words, 2.59 words/s, limit 2.7); unsure words are names and short words at confidence 0.49-0.59 (Morrow, navy), heard correctly in the transcript; 1 breath at 4.1 s is 0.52 s (limit 0.55), not a defect; contact sheet not downloadable in-session (artifact host blocked), the final scene's stills were checked before the render
14. Cuts: PASS: FLOW: cuts 0 (no window.TRANSITIONS: every repaint is a wipe of 1.4-2.9 s)
15. Dead runs: PASS: FLOW: dead runs none (no window.HOLDS; the 2.7-3.7 s run of the first pass was fixed with a longer push and faster fog)
16. Continuity: PASS: FLOW: continuity 100% (median step 1.0, 0 declared transitions)
17. Strobes: PASS: FLOW: strobes 0

Quality bar, beat by beat (final sheet): 1 documentary still: engraved paper towers with fluting and shade hatching, matte; 2 full frames:
sky, fog at three depths, hills, water, the bridge across depths, the headland in front; 3 the camera always moves (push, down to the ship,
up to the biplane, in on the primer, out to Morrow, close on the paint, out to the whole bridge); 4 type: Playfair hook and payoff, Inter
captions in one lower card, labels and stamps keyed to the spoken words; 5 one grade: fog-grey morning to a golden evening, no glow;
6 Morrow is an illustrated figure recognised by props (bowler, a paint swatch); 7 sound as item 8; 8 frame 0 is cover quality (the hook over the
striped bridge). Fixed on the way: the hook sat over the tower (camera pulled back, hook 46 px); a near cable drew as a black blob (widths
clamped); fog read as rocks (soft radial blobs); stamp lines touched (spacer line); primer and orange looked alike (primer browner); "Yes."
split the sentence count (now "Yes,"); the ship sat in the caption band (fades out sooner); the International Orange card came in late (keyed to "warm").
