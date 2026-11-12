# Review: showreel-c3-eiffel-red (c3, postOn 2026-11-12 postAt 13:00 IST)

The Mandatory Gate, design/mandatory.md. AUTO lines pasted from `node scripts/channel3/qa.mjs scripts/channel3/eiffel-red.json --write`,
`node scripts/showreel/preflight.mjs` and `node scripts/showreel/stills.mjs` on the final scene (11 Nov). Stills: two sheets (first pass at
cover, 0, 1, 2, 3.3, 3.7, 4.1, 5, 6.5, 8, 8.6, 9.4, 10.4, 11.6, 12.8, 13.4, 14.5, 15.6, 16.8, 17.4, 18.4, 19.6, 21, 22.9 s; fix pass at cover,
0, 4.6, 7.2, 8.5, 8.9, 9.3, 9.7, 10.3, 11.2, 12.6, 13.6, 15.8, 18.3, 19.6, 21.8, 23.6 s), scored against design/channel3.md "Quality bar",
design/rules-c3.md (rewritten 11 Nov) and design/owner-feedback.md. First reel in the GUESS format (E19). The first pass showed three faults,
all fixed: the options row faded before the answer's ring and tick (the "Red." hold went from 0.2 s to 1.0 s), the painter's sleeve read as a
blue plank (now a narrow, lit brown sleeve with a cuff), the "anti-rust" label came after the camera left (now 0.4 s after "Venetian").

OWNER FIX PASS, 12 Nov 2026 (owner: "There's something wrong with the Turns Out reel. Are we really checking if something works or not?"). The
first render broke the format: the tower was painted red during "Gold, grey, or red?" and "Lock in your guess" (the answer before the guess),
the countdown sat on the spire, the counter rolled through 8 before "seven" with a half-wiped label, the colour cards and photos were cut at
the frame edges, a branch tip read as a black tick top-left and the lamp was cut at the right edge. Fixed: the tower drains from today's brown
to a silhouette during the question and stays a silhouette until "Red." (9.32 s), the options live on the chips only; the countdown sits left
of the tower (x 104, y 452); the 7 lands once on "seven" and its label fades up whole; the fan is narrower and the photos sit inside the
frame; the branch is gone and the lamp stands fully in frame on the left (the loop frame); "What colour..." at .9 and "Lock in your
guess." at .65 (SENTENCE PACE was 7.2 words/s: FAIL, now 4.0: ok); small sounds raised to .08+, the 7, credit and payoff got their own.
New check: qa.mjs GUESS (the answer colour's share of the subject on the drawn frames before the reveal vs after): the old render's scene
FAILS it (11.5% at 4.2 s vs 53.9% after, limit 5.4%), the fixed one: "GUESS: answer hidden until 9.32 s (answer colour at most 0.0% of the
subject before it, 53.9% after)". Stills (one sheet: cover, 0, 1.5, 3.5, 5.2, 6.6, 7.6, 8.6, 9.2, 9.9, 12, 14, 15.8, 16.8, 18, 20.2, 22.2,
24.5 s) read against design/owner-feedback.md and the format's own logic: does the guess still work? Yes: no frame before 9.32 s tells
gold, grey or red apart; the countdown 3-2-1 reads clear of the subject; the number never shows more than the claim.

DETAIL PASS, 12 Nov 2026 (owner: "I'm looking for improvements in animation with more detailing and stacking ... with sound element
enhancements, to avoid boring instances in the reel and make it tick, snap, click better." "Put all fixes in today's reels"). Built on the
guess fix above (#755), nothing of it undone: GUESS still "answer hidden until 9.32 s ... at most 0.0% ... 53.9% after". New kit pieces
(Kt.beat / Kt.beatCues, Kt.stackOn, Kt.rivet, Kt.tally, Kt.sparks) and 43 detail beats, each with its matched sound by kind and size, panned
by x: Paris (guess): six cream rivet heads pop up the legs as the tower drains to a silhouette (0.55-2.55 s, neutral: no option colour), a
padlock lands on "Lock" and its shackle clicks shut (5.1 s) and tugs (6.0 s), the countdown drops a notch between numerals (7.3, 8.1, 8.8 s);
workshop: rivets pop behind the brush with small sparks (every 3rd heard, ~0.35 s apart), six painted plates stack on the floor in two piles
(11.75-13.55 s), both labels snap on; chips: the blueprint draws itself, the two photos drop onto their strings and are pinned (14.9, 15.4 s),
each chip lands with a lift and a tightening shadow, a tally counts the chips (15.1-16.9 s, never past seven) and gives way to the 7 on
"seven"; Paris today: the match cut settles with a soft thud (19.7 s), the payoff's second line snaps on (22.15 s), the tower sparkles three
times to the end (22.75, 23.35, 23.95 s). qa.mjs BUSY (new): before "longest quiet run 2.4 s (22.2-24.6 s), 0 beats: FAIL"; now "BUSY:
longest quiet run 1.2 s (10.0-11.2 s); 43 detail beats, 42 seen on the frames (98%): ok" (the one not seen is the first tally mark, a thin
line, at 15.11 s; it is on the 15.5 s still). One stills sheet at 0.5 s steps (cover + 0-24.5 s, 51 frames) read as a viewer: the critic
answers are at the end of this file.

1. Topic: PASS: everyone pictures the Eiffel Tower bronze-brown; the reel asks what colour it was first and shows the options on chips while the tower stays a silhouette; not done before (the Eiffel reels of 1 Nov were about the demolition permit); rule 1 pass (guess first: 3 options as chips, each painted on the tower, "Lock in your guess.", 3-2-1, the answer with a tick), rule 2 pass (a world icon in a colour nobody pictured: a red Eiffel Tower), rule 3 pass (23.7 s, the last frame is the frame-0 view: same camera, same tower), rule 4 pass (caption line 1 asks what they guessed, the last line asks for the letter and a send), rule 5 pass (4 scenes, 3 different transitions, DEPTH lines in item 20), rule 6 pass (3 sources, every claim in two; Tower Bridge swapped out because its first colour is disputed), rule 7 pass (PRONUNCIATION clean), rule 8 pass (the only c3 reel for 12 Nov, 13:00; posting late today, owner), rule 9 pass (BUSY: longest quiet run 1.2 s, 42 of 43 beats seen; SOUND DETAIL after the render, item 13)
2. Frame 0: PASS: SUBJECT FILL: 91% at frame 0; HOOK: clear of the subject on the stills; frame 0 is Paris at dusk with the tower in today's brown (the loop's last frame) draining to a silhouette as the question lands, birds crossing, the street lamp fully in frame on the left
3. Safe zone: PASS: SAFE ZONE: ok (qa.mjs and stills.mjs)
4. No overlap: PASS: OVERLAP: none (qa.mjs and stills.mjs); BAND: read on the stills: the caption card sits on the river and the quay in Paris, the workshop floor, the chips' pivot and the ruler; the tower's base, the girder and the chips stay above it (the tower's foot touches the card's top edge only during the dive through the arch, 9.4-9.8 s)
5. Motion: PASS: STATIC STRETCH: none (least change 1.3 at 6 s, median 3.5); EMPTY FRAMES: none (least detail 20.3 at 10.5 s); TEXT FIT: all text inside its box; BUSY: longest quiet run 1.2 s (10.0-11.2 s); 43 detail beats, 42 seen on the frames (98%): ok
6. Subtitles: PASS: canvas-drawn (not marked): read on the stills: 27 px caption = 54 px in the 1080 frame, at most 6 words a line, all 7 sentences shown and finished (QA captions: all 7 sentences on screen)
7. Voice: PASS: PREFLIGHT voice: 7 timed sentences, 44 words, voice ends about 22.7 s (reel 24.6 s, must end by 24.0 s), 2.7 words/s while speaking, 1.9 overall: fits; SENTENCE PACE: fastest 4.0 words/s: ok; PRONUNCIATION: 4 overrides used: colour, Eiffel, 1889 (year), 1907 (year); no unchecked words
8. Sound: PASS: QA sound: 122 cues (12 Nov detail pass: 43 beats through Kt.beatCues: ticks for rivets, notches, the tally and sparkles; snaps for the labels and the payoff line; clicks for the padlock and the pins; a paper slide + tap for each stacked plate and photo; a soft thud + tap for the match cut settling; the label blips and the chips' extra tick dropped; earlier 12 Nov: birds, chip and light ticks raised .04-.05 to .08, the 7 a pop, the credit a tick, the payoff a pop), by size and panned by x: small = a pop per option chip, a tick per countdown numeral, ticks per colour chip and the counter, birds, the tower's lights; medium = a rustle and a snap for each coat of paint, the brush strokes along the girder (rustle + tap each), the labels' blips, the page; large = the dive through the arch, the match cut and the pull-back (low moves); a riser into the answer, a hit and a shimmer on it; ambient: wind and the street lamp in Paris, the lamp in the workshop; bed ducked 8 dB under the voice, lifting into the payoff; the workflow's SOUND GATE and SOUND DETAIL check the finished audio (item 13)
9. Payoff: PASS: from 21.7 s Paris today, the tower in its 1907 yellow-brown with its lights coming on; "It started red." / "TODAY'S SHADE IS FROM 1907" from 21.7 s; the last frame is the frame-0 view (loop)
10. Facts: PASS: 3 sources in the config (toureiffel.paris "Painting the Eiffel Tower", toureiffel.paris "What colors has the Tower sported over the years?", Smithsonian Magazine 2018), every claim in two (scene header): Venetian red as the anti-rust coat on every iron piece during pre-assembly, 1887-1888; seven official colours since the red-brown of 1889; today's shade is the historic 1907 yellow-brown (the campaign begun in 2019); checked by web search on 11 Nov (the official pages could not be opened from this session, network policy; their text was read in the search results); the seven chips carry no years (shades approximate); npm run check passes
11. Post data: PASS: captions.json entry with channel c3, postOn 2026-11-12, postAt 13:00, concept, about, note; 6 keywords, 5 hashtags; experiment c3-guess vs median
12. Review file: PASS: this file, items 1-11, 14-17, 19 and 20 PASS before the detail render (12 Nov); QA: clean incl. GUESS and BUSY
13. After the render: PENDING: the 12 Nov detail render (filled after reel-status)
14. Cuts: PASS: FLOW: cuts 0 (window.TRANSITIONS declares 3: zoom-through, page, match)
15. Dead runs: PASS: FLOW: dead runs none (no window.HOLDS)
16. Continuity: PASS: FLOW: continuity 94% (median step 0.9, 3 declared transitions)
17. Strobes: PASS: FLOW: strobes 0
19. Journey: PASS: scenes 4 (Paris at dusk, the guess; Eiffel's workshop in 1887, a girder brushed Venetian red; seven colour chips fanning over a blueprint; Paris today, the frame-0 view); transitions: zoom-through the arch, page turn, match cut on today's chip; no two alike
20. Depth and life: PASS: DEPTH paris: 9 planes, parallax 9999 px, foreground yes; DEPTH workshop: 7 planes, parallax 3223 px, foreground yes; DEPTH chips: 5 planes, parallax 280 px, foreground yes; far hills and rooftops read lighter and bluer than the quay on the stills, contact shadows under the tower, trestles, bucket and chip fan, light from the upper left on the tower, the sleeve and the chips; ambient life: twinkling stars, birds, trees swaying, the lamp's flicker and the water's streaks (Paris), lamp light and dust (workshop), swinging photos and dust (chips), each with a Kt.ambient or element cue; no human figure in full (one arm, its brush scrubbing; no move that could read as a fall)

Owner feedback, line by line (design/owner-feedback.md, read against the stills; the finished video after item 13): pronunciation (no unchecked words; the voice check after the render), something changes every 1.5-2 s (a coat of paint every 0.4-1 s in the guess, the brush, the chips one by one, least change 1.4), a non-specialist topic, no text over text or under the right-side buttons (SAFE ZONE ok, OVERLAP none), no jumps or dead runs (FLOW), not rushed (2.0 words/s overall, a 1 s hold on the answer), not flat (4 scenes, DEPTH lines), sounds audible (SOUND DETAIL after the render), air soft behind the details (ambient cues at .06-.1), no figure action that could look like a fall.
