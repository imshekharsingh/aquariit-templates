# Reel critic: the questions every finished reel must answer (owner, 12 Nov 2026)

Judge the REAL video (owner chat, 23 Nov 2026): `node scripts/reel-fetch.mjs <reel-name>` downloads the final MP4, cover and json from the app into reel-files/ (git-ignored; never commit or upload them); then `ffmpeg -i reel-files/<name>.mp4 -vf "fps=4,scale=390:-2" reel-files/f-%04d.png` gives frames at phone size every 0.25 s (look closely around every cut), and listen to the audio (`ffmpeg -i reel-files/<name>.mp4 -af ebur128 -f null -` for levels, then the words against the voice script). If reel-fetch says "read key not set up yet", fall back to the scene stills and say so in the review.

Answer each with the frame times you looked at. First of all, question 43: the side-by-side sheet against the gold reel (design/gold.md). Any "no" = not ready. Add a question here the same day the critic or the owner finds a new kind of miss.

## Every channel
0. Does the reel pass every line of design/safety.md (plagiarism, controversy, disrespect, sentiment, licences, Instagram rules, maps, brands)?
1. Frame 0: does it make a stranger stop? Is the hook readable in under 1 s at phone size?
2. Does every frame make sense on its own: nothing cut at the frame edges, no stray marks, nothing overlapping, nothing that looks broken?
3. Does what is on screen match what the voice says at that moment (numbers, names, colours, counts)? Never more or less than the claim.
4. Does the motion lead the eye to what is being said (rules-web.md rule 14)? Is there one focus at a time?
5. Is every spoken line shown and finished, at natural speed 1.0 (no slowed voice; a full sentence under 4.5 words/s, a short line may be quicker), with no stray words?
6. Is every moving element's sound audible (SOUND DETAIL) and the mix -14 LUFS?
7. Does the end land on the payoff (not drift into filler)? Would I watch it twice or send it to a friend?

## Turns Out, design series (owner, 23 Nov 2026 night)
D1. Does the voice sound like a person talking: full sentences, a breath after each, no list of labels ("Fix one: ..."), no line that runs into the next? Listen to the real audio; give the times of any clipped or rushed line.
D2. Does each spoken line land on its visual change (the change starts within 0.3 s of the word that names it)? Give the frame time of every fix against its word.
D3. Is the "before" a first draft a real person would make: one common, honest mistake (name it), left the way a tool's defaults leave it? A before nobody would make (every line bold, text too faint to exist, a layout scrambled on purpose) = NOT READY.
D4. Does the last frame show both the before (thumbnail, tagged) and the after, readable at phone size, held for 1 s or more?

## Turns Out, guess format (E19)
8. Is the answer hidden in EVERY frame before the reveal (colour, state, label, icon)? (12 Nov: the Eiffel tower was red while asking "gold, grey or red?")
9. Is the 3-2-1 countdown clear, complete and placed away from the subject?
10. Do counters and dates on screen equal the facts said (12 Nov: "8" shown for "seven colours")?
15. Does something small land and get heard every 0.5-1 s in every world (qa.mjs BUSY ok; 12 Nov: 2.4 s with nothing at the payoff), is each detail readable at phone size (not specks), and does no detail in the guess world hint at the answer?

24. (14 Nov, critic) Is no option word coloured as a key word before the reveal (the caption "Frozen, drained, or moved?" lit "drained" amber while the viewer was guessing: a STYLE.hl word must match the answer line only, e.g. /drained\./)?

22. (13 Nov, colour) On the cover at phone size, does the subject pop off its background (a white icon never on a pale sky)? Does every scene look like the same film (one sky and light family, no fog wash, no sudden hue jump), every title on a solid dark plate, one accent colour, hardly any floating particles (Output QA GRADE)?

## @webin20sec
11. Mute test: 1 s of "before" and 1 s of "after" at phone size: is it obvious which is broken (rules-web.md rule 15; 12 Nov: a 4% press dip was invisible)?
12. Is the fixed state big in the frame at the end, not a list or empty space?
23. (14 Nov) Is the frame used top to bottom (top zone, subtitles, hero, list; no empty lower third, Output QA SPREAD) and is the thing being fixed the biggest thing on screen, its key part (a line, a button) thick and bright enough to read at thumbnail size? Is a before/after two full-width cards filling the hero?
18. (13 Nov) Is every touch a slim ring that leaves the button visible (no finger or blob, Output QA BULK), inside the safe zone? Is the subject never cut at the bottom and the lower third (above the subtitles) used? Does the grid have colour (jewel avatars, accents; Output QA VIBRANCY) without loud fills?

## @techin20sec
15. Is every item the voice names (a card, a label, a number) already on screen when it is said, never an empty slot (13 Nov: "or the sauna" over an empty card)?
16. Does each idea scene SHOW the idea, not just a label next to an object (13 Nov: dust scene was a flat phone with dots), and does a before/after show both states?
13. Is every setting's path readable for 2 s+ and correct on both iPhone and Android as stated?
14. Is the drawn phone UI generic (no real logos) and still clearly recognisable?
15. (12 Nov) Do the hook's switches show the RESULT the reel asks for (a "turn off" setting must not flip ON in frame 0)? Are the paths at least 34 px (about 12 pt on a phone)?
16. (12 Nov) Is the LAST sentence clear on the finished audio? Kokoro reads a short closing line quick (4.48 words/s); that is a warning, not a fail (owner, 12 Nov: never slow the voice): if a word is lost, shorten or split the line. 13 Nov: a 7-word line ("And the seals wear out with age.") read at 5.0 words/s failed Output QA PACE; a line of 9+ words reads at the natural pace, so lengthen a short scene line to a full sentence instead.
17. (12 Nov, new look) Is every word of every line on screen as a caption (no chunk list short by a word; make.py now refuses one)? Does the result banner show red then green, and is the phone's top never under the counter at any zoom?
19. (13 Nov, gadget look) Is the product in the SAME place and whole (never cut by the frame) in every still, its screen full top to bottom, nothing (card, caption) over it? Is each brand named only as text, at its strengths, with no winner or loser, and every spec on screen equal to the maker's page in the sources?
21. (13 Nov, idea look) Does every scene show the IDEA at full-frame scale (subject 70%+ of the frame, numbers and labels readable at phone size), does each scene look like a different world (not the same picture with new text), and is there one moment per scene where the idea itself moves? Does any faded word linger over the next scene's words? Does a push-in keep the subject whole inside the frame (13 Nov: the macro phone edge ran past both sides at 3.8-5.3 s, Output QA EDGES)?
25. (14 Nov, tech depth) Does every scene look lit and deep, not flat shapes on a black void: a light source and soft beams, objects shaded with a highlight and a contact shadow, dust or layers at different depths moving at different speeds, the floor and its reflection filling the lower third? Does the key idea itself happen on screen (e.g. the two waves visibly cancel into a flat line), and are scenes drawn worlds rather than list cards?
26. (14 Nov, tech OCR) Does every label of a named item sit in clean space (no outline hugging the word, no line, pole or ring crossing it), so Output QA SYNC can read it as the viewer does?
27. (14 Nov, real media) Is the subject a REAL photo of the real place or a generic real product (not code shapes), recognised in under 1 s, with no logo, emblem, airline or maker mark, watermark or identifiable person anywhere in the frame? Does every media entry carry its licence and source, and is each CC BY author credited in the caption (Output QA LICENCE)? On a guess reel, does the frame-0 photo give nothing away (e.g. a winter photo hinting "frozen")?

28. (14 Nov, web vivid demo) Does the live demo, the frame where the difference plays out, read radiant at phone size: full-colour thumbnails and accents, surfaces with a hue (deep indigo, not a grey slab), no white haze or veil over it, the moving part clearly brighter than what is around it? Is Output QA DEMO a PASS (saturation, colourfulness, contrast inside [data-subject])?

29. (owner Feedback 1, 14 Nov: "During reels review post rendering identify one enhancement you can make to it to attract audience. Do it on daily basis.") After the verdict, write ONE line "ENHANCE: <one change that would pull more viewers>" in the review file (a hook word, a sharper first second, a payoff frame, a sound, a caption line). The next reel on that channel applies it and names it in its review file; it never triggers a re-render on its own.

30. (15 Nov, web before/after motion) Freeze any frame where BEFORE and AFTER sit side by side: can a stranger tell which is broken from the still alone (warm vs cool pane, ghost of the old place, a cross chip vs a check chip)? Play it muted at phone size: does BEFORE visibly jolt (drop, shake, trail) on every failure while AFTER holds still with its lock cue? Is Output QA SPLIT a PASS (BEFORE moves at least 1.8x AFTER)? Are the keywords and hashtags what people search for this fix (most specific first, niche only)?

31. (15 Nov, Turns Out Mona Lisa: "make it more available on the screen (as it seems to be centered mostly)") Does every photo use the whole 9:16 frame (no picture sitting small in the middle on a blurred or flat field), with its planes moving at different speeds? Read the render's Output QA FILL line and name any shot under 0.80.

32. (15 Nov evening, web: "too wiggly" and "similar colour grading") Watch it muted at phone size: does anything move that is not the broken thing (a drifting camera, drifting light, a page that shakes, tilts or bobs)? Does each move happen once, cleanly, with a held beat to read it, and is AFTER solid? Put the demo frame next to the last 3 web reels: does it have its own hue and light, so the grid shows a new reel at a glance? Read the render's Output QA CALM and HUE lines.

33. (15 Nov night, tech 5 ATM: "covering the wave ... from left top corner to the right", "What's this in tech reels frame where actual object is?", "I don't see much happening animation wise around watch") Watch it muted at phone size: does any band, glare or line sweep across the picture that is not part of the object? Is the object big (a third of the width or more) and not shut in a small box? While each line is said, does the object itself change (squeezed, sealed, turned, filling, leaking), with the camera moving once to the part named, or does only the background move around a still drawing? Read the render's Output QA SHEEN and HERO lines.

34. (18 Nov, critic, tech laptop-plugged) Is every setting name the reel teaches readable where it is drawn: text on the device's own screen at least 34 px in the final frame after the camera zoom (scene px x zoom), the path cards too? (Settings rows were 26 px and 22 px, about 28 / 24 px after the 1.08 push-in.) Does a pointer never sit on the value it changes?

35. (20 Nov, critic, tech wireless-worth) Freeze every frame where a chip, badge or card appears, lifts or moves: does it sit in clear space, never on a lane label, a badge or another chip (19-30 s: "A TIE" over "WIRELESS PAD", the lifted card cutting it to "WIREL", the pad card clipping the "30 W" badge)? Preflight OVERLAP does not see these; look at the stills.

36. (21 Nov, critic, tech wifi-button) Freeze the recap and end card: does every stamp or chip that lands on the recap sit in clear space, whole and on top (37 s: the MYTH stamp half under the Wi-Fi tile; the second recap line almost invisible)? Is the lower half of the frame used in every still, never a dark void under the subject?

37. (22 Nov, critic, web darkflash) Did the local look.py FOCUS read pass by a margin, or only on its 2 samples? Read the hue count on EVERY 0.1 s frame of the qa.focus window (local FOCUS passed at 3, the render hit 4 at 10.0-10.3 s from a violet ~265 deg between the cool wash and the berry rows); every frame must sit at 3 or fewer, and DEMO colourfulness at 35+ (32 is the floor; render 1 read 29).

38. (22 Nov, critic, tech cold-shutdown render 3) Read the topic's cue list for the recap: is any recap pill cued on the same word as the end card (cue "warm2" = cue "final"), so it appears only while the scene fades out? Does every recap pill hold 1 s+ in clear space before the end card, and does the end card sit on a solid plate (no ghosted scene under its words) with the lower half used?

39. (22 Nov, owner: "every reel looks the same, no variation, no detail") Tech Detail bar (rules-tech.md D1-D8): put the stills sheet next to night-mode's. Is the subject a drawn world with its own materials (not a rounded rect standing for it)? Do 6+ named parts arrive on their words, does it open up at least once, are there 3+ depth planes moving at their own speeds, 2+ loops of secondary motion that belong to the object in every chapter, two kinds of camera move, and 10+ micro-details at phone size? Does each chapter look different from the one before? Is its format (xray, showdown, quickmyth, indiapick) visible in the look, not only the chip?

40. (22 Nov, owner: "no audience pull ... I'm not hooked to my own content") Tech audience pull (rules-tech.md P1-P4): does frame 0-1 s show a picture a stranger has not seen? Does the first line open a question that only the end answers? Does the last frame return to the opening picture so the replay loops? Does the caption ask one easy comment question (and never claim a viewer asked)?

41. (22 Nov, critic, tech heart-green) Freeze every frame of a live chart or trace panel: does its label sit outside the line's range, never struck through by it (15-27 s: "LIGHT BACK" crossed out by the trace for 12 s)? On the end card: is the subject still whole and the payoff plate in the empty lower half, not laid over the subject's body?

42. (24 Nov, critic, web tabwiggle) Read frame 0 alone at phone size: is the WHOLE hook question on screen (dim words that light up as they are spoken are fine), not built word by word so that frame 0 shows one word ("Why" until 1.2 s)? Does the touch dot rest clear of every label and reaction word between taps, and does no pointer line end right after a word like a cursor?

43. (24 Nov, owner: the tech USB-C reel passed every check and an Opus critic, and was "horrible"; design/gold.md) Run
`python3 scripts/qa/side-by-side.py reel-files/<name>.mp4` and VIEW the sheet: the new reel and its channel's gold reel at the same 8 relative
times, with both LOOK numbers. Read Output QA LOOK (brightness, background, dark share, washed-out grey, contrast vs gold). **Rule: CRITIC:
NOT READY unless the reel matches or beats gold on the sheet** (as dark and deep, one lit hero, one accent, the shot changing as often, the
number or word as bold). Write one line: `GOLD: matches | beats | below (<the frame, what is weaker>)`.

## Premium check (owner, 23 Nov 2026): before any verdict
Load the skills frontend-design and hyperframes (.claude/skills/; Skill tool) and read hyperframes/references/motion.md and review.md, plus
types/vertical.md. Then score the reel on its stills and the render (frame times for every point), each out of 10:
- Animation: arrivals land on a long tail, exits shorter, overlap and stagger, one hero move at a time, eases by role, cuts with a cause,
  no generated-looking defaults (breathing loops, everything fading and sliding up, titles moving after they land).
- Cleanliness: one focus per frame, nothing clipped, crowded or overlapping, type sizes and holds readable at phone size, safe zones, the
  frame used top to bottom.
- Premium feel: a deliberate look (frontend-design: no template defaults, boldness spent in one place), light and depth, sound on what moves,
  a payoff frame worth sending.
Write one line in the review file: `PREMIUM: animation n/10 (t ..), cleanliness n/10 (t ..), premium n/10 (t ..); weakest: <t, what, fix>`.
Under 7 on any of the three = CRITIC: NOT READY, unless the owner says otherwise. (The hyperframes review.md says never to score out of 10; we
score because the owner asked, and still write its P0/P1 notes with times.) Also check question 0 against design/safety.md rule 1: a reel
built from a pattern card uses the patterns, not the piece.

## Item 20 format (owner, 22 Nov 2026)
The app's Journey shows only the start of the critic line to the owner, so write it plain first: `CRITIC: NOT READY: <one plain sentence the owner understands: what is wrong, and where in seconds>` and only then `Detail: ...` with question numbers, frames and the fix. No question numbers in the first sentence. Example: `CRITIC: NOT READY: the "10:00" time prints over the BEFORE label at 11-13 s. Detail: questions 2 and 35, ...`. `CRITIC: READY` needs no sentence. The app shows the first sentence (up to "Detail:") and the rest under "More"; older files without "Detail:" still work.
