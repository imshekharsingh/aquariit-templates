# Review: showreel-34-press (web, postOn 2026-11-12 postAt 13:00 IST)

The Mandatory Gate, design/mandatory.md. Built 12 Nov by the daily run (learn-then-build), E18 try 1 (dark-return: the dark theme + a
motion-feel single fix; rules-web.md rule 12) and the ESCALATE 12 Nov answer (a format change, not a tweak). From `newweb.mjs`, then the
reel's own picture: a checkout's Pay button that a finger taps from frame 0 and that never moves ("tap?", "tap??", "TAP!?"); the BEFORE tag
morphs into the code card and the fix is typed (`.btn { transition: scale .12s }`, `.btn:active { scale: .96 }`, the iPhone note
`<body ontouchstart>`); the page scrolls up under the card, "scale: .96" glides onto the button, and every tap now dips the button to 96%
and lets it go in 0.12 s, as the CSS does; a "PRESSED · 96%" leader label. AUTO lines from preflight.mjs and stills.mjs, 12 Nov ~08:00 IST.

1. Topic: PASS: anyone who has tapped Pay or Send and tapped again because nothing moved; not done before on the channel (showreel-11-springs was easing, showreel-20-hover the sticky hover); rulebook score: rule 1 pass (a checkout button, felt as a user), rule 2 pass (the finger is tapping the dead button at frame 0, the "tap??" bubble rising), rule 3 pass (the fix typed from ~6.9 s), rule 4 pass (new reveal at ~4 s push-in on the dead taps, ~6.5 s the code card, ~9.5 s the glide onto the button, ~11 s the first live press, ~12 s the leader label), rule 5 pass (a press you can see), rule 6 pass ("Why does your button feel dead on tap?", 8 words), rule 7 pass (13:00 IST), rule 8 pass (two copyable lines + the iPhone note held on screen ~10 s; caption invites a save and a send), rule 9 pass (PRONUNCIATION clean), rule 10 pass (FLOW lines below), rule 11 pass (a satisfying press-and-release on every tap to the last frame), rule 12 pass (E18: `KM.theme('dark')`, Ink and mint; render minutes in item 13), rule 13 n/a (single fix, not a details reel), rule 14 pass (eye path: hook at the top → the finger on the Pay button (centre) → the code card at the top as the voice says "the fix" → "scale: .96" glides back down onto the button → the press and its label; the subtitle band sits under the button)
2. Frame 0: PASS: SUBJECT FILL: 42% at frame 0; HOOK: clear of the subject; the finger is coming down on the Pay button and the "tap??" bubble rises beside it
3. Safe zone: PASS: SAFE ZONE: ok (the total moved next to its label so "$64.00" never reaches the right-side buttons at the 1.05 push-in)
4. No overlap: PASS: OVERLAP: none; BAND: clear (the page scrolls 110 px up inside its own clip as the code card arrives, so the phone's text never sits under the card)
5. Motion: PASS: STATIC STRETCH: none (least change 1.1 at 10 s, median 3.4); EMPTY FRAMES: none (scanned 35 moments, least detail 31.3 at 2.5 s); TEXT FIT: all text inside its box
6. Subtitles: PASS: SUBTITLES: at least 52 px, at most 6 words a line; every sentence shown and finished on the stills (the hook on the card, then the three sentences in the band)
7. Voice: PASS: PREFLIGHT voice: 157 letters, 4 sentences, about 14.8 s at speed 0.86 with 2.20 s of breaths (reel 17.4 s, voice must end by 16.8 s): fits; PRONUNCIATION: 0 overrides used; no unchecked words ("ninety-six" was flagged and is now "ninety six"); CONTRAST: 4.6:1 (dark), worst the Nº 34 label at 2.5 s; 39 words, 2.2 words/s over the reel
8. Sound: PASS: every dead tap a dull low touch and its bubble a low blip (pitch rising tap to tap); every live tap the touch + a pop as the button goes down; the hook words a pitched run, the label exit, band, BEFORE tag, code card morph, typing ticks, page scroll whoosh, glide and its landing, leader label each cued; bed ducked under the voice; the workflow's SOUND GATE and SOUND DETAIL check loudness and audibility (item 13)
9. Payoff: PASS: from ~11 s the camera closes in (z 1.15) on the button under the code card; a press every 0.85 s to the last frame (17.1 s: the finger lifting off), each 0.12 s down and 0.12 s back as the CSS says
10. Facts: PASS: MDN :active (read from mdn/content 12 Nov: matches an element while it is being activated by the user); BCD css.selectors.active (read 12 Nov): all browsers, safari_ios note "Safari on iOS does not use :active unless there is a touchstart event handler on the relevant element or on the <body>" (hence the third code line, the caption and the tip demo's listener); BCD css.properties.scale: Chrome 104, Firefox 72, Safari 14.1 (the caption says so and offers transform: scale(.96) for older browsers); tip + live demo "press" on /tips/; npm run check passes
11. Post data: PASS: captions.json entry with channel web, postOn 2026-11-12, postAt 13:00, concept, about, note, experiment dark-return; 6 keywords, 5 hashtags in the config
12. Review file: PASS: this file, items 1-11, 14-18
13. After the render: PENDING (first render, run 43135099372 green, 13 GitHub minutes: SOUND GATE ok -13.9 LUFS, true peak -1.3 dBTP; SOUND DETAIL 63 of 63 element cues audible, 100%; every word heard as written; but the voice check flagged the hook at 4.49 words/s (limit 4.0) and 2.70 words/s overall ("too dense", limit 2.7): the hook is now spoken at speed 0.72 (voice.speeds) and the reel is rendered once more)
14. Cuts: PASS: FLOW: cuts 0 (declared by the kit: morph (tag to code card), sharedElement ("scale: .96" glides onto the button))
15. Dead runs: PASS: FLOW: dead runs none (no holds declared)
16. Continuity: PASS: FLOW: continuity 87% (median step 0.8, 2 declared transitions)
17. Strobes: PASS: FLOW: strobes 0
18. Element sound (web): PASS: ELEMENT SOUND: 80 of 80 animated elements have a cue (100%): ok

References used (design/references.md): none new; the kit's tap, morph, sharedElement, leader and element sound.
