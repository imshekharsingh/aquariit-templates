# Review: showreel-NN-slug (channel, postOn YYYY-MM-DD postAt HH:MM IST)

The Mandatory Gate, design/mandatory.md. One line per item: "N. <item>: PASS: <evidence>" (paste the AUTO lines). Item 13 stays PENDING until the render is checked.

1. Topic: PASS: who feels it in 1 s; not done before; rulebook score (rule 1 pass, rule 2 pass, ...)
2. Frame 0: PASS: SUBJECT FILL: nn% at frame 0; HOOK: clear of the subject; what is happening at frame 0
3. Safe zone: PASS: SAFE ZONE: ok
4. No overlap: PASS: OVERLAP: none; BAND: clear
5. Motion: PASS: STATIC STRETCH: none (least change n at t s)
6. Subtitles: PASS: SUBTITLES: at least 52 px, at most 6 words a line; every line shown and finished on the stills
7. Voice: PASS: PREFLIGHT voice ... fits; PRONUNCIATION: no unchecked words; n words/s
8. Sound: PASS: n cues on the moves and impacts; bed ducked under the voice; the workflow's SOUND GATE checks the loudness; SOUND DETAIL: n of m element cues audible (>= -18 dB vs voice) ... ok (sound.py / techreel qa.txt)
9. Payoff: PASS: the close-up result at t s, the last frame shows ...
10. Facts: PASS: sources ...; npm run check passes
11. Post data: PASS: captions.json entry with channel, postOn, postAt, concept; 6 keywords, 5 hashtags
12. Review file: PASS: this file, items 1-11 PASS
13. After the render: PENDING
14. Cuts: PASS: FLOW: cuts ... (0 undeclared; list the window.TRANSITIONS the reel declares)
15. Dead runs: PASS: FLOW: dead runs ... (none; any window.HOLDS named with its reason)
16. Continuity: PASS: FLOW: continuity nn% (85% or more)
17. Strobes: PASS: FLOW: strobes ... (0, or 1 declared as a 'flash' transition)
18. Element sound (web): PASS: ELEMENT SOUND: n of m animated elements have a cue (pct%): ok
19. Journey (c3 only, from 9 Nov): PASS: scenes N (list them); transitions: list them, no two alike
20. Depth and life (c3 only, from 11 Nov): PASS: DEPTH <world>: n planes, parallax nn px, foreground yes (one per world, pasted from qa.mjs); figure actions checked every 0.1 s (name them); ambient life and its cue per world

References used (design/references.md): R<n>: <technique> (<kit piece>), ... or "none"
