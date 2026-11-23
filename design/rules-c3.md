# Turns Out rulebook (the gate every Turns Out reel passes before its one render)

> **Design series (21 Nov 2026, owner; design/c3-plan.md section 0) replaces the restart rules R1-R3 and the sketch plates below:**
> - **D1 Topic:** one design fix anyone can apply in a minute to their own menu, poster, slide, invite or sign; checked against a design source (cite 2).
> - **D2 Frame 0:** the claim alone in the top band, the flawed design fully lit on its real-world stage, its problems ringed with short labels.
> - **D3 Body:** 2-3 fixes, each done on screen (cursor, guides, snaps) with a "FIX n OF N" dial; numbers on screen never run ahead of the voice; 18 s, ~45 words.
> - **D4 End and caption:** end on the fixed design (no CTA on screen); caption = the fixes as a numbered list + "Save this for your next ..." + one question.
> - Engine "design" (scripts/channel3/design), stage per topic, drum-free sound vocabulary (DT.S); rules 5-11 below stand.

> **Restart rules (20 Nov 2026, design/c3-plan.md; owner's go 20 Nov). They replace rules S, 0, 1, 2, 3 and 4 below (kept as history); rules 5-11 stand.
> No media downloads (owner, 20 Nov): every shot is a code-drawn `sketch` plate (design/channel3.md "Sketch plates").**
> - **R1 Topic: a myth people believe** about something everyone knows, all 4 of c3-plan.md section 2 yes on paper (believed worldwide; truth in 2
>   reliable sources, undisputed; a real free photo for the myth and the truth; not on the never-list). An icon in a wrong state still passes if
>   people picture it one way (the old rule 2), but a myth comes first.
> - **R2 Format, frozen until 18 Dec:** Echoes engine, `sketch` plates only (no media), config-only (new drawings go in SK; no other engine change); 15-22 s, 40-55 words, 5 lines;
>   frame 0 = the myth picture with the cover title in the centre 3:4 and the voice denying the myth in 8 words or fewer; where the myth came
>   from, then the truth; "Turns out, ..." last; a new photo every ~2 s, each used once; loops to the myth picture. No call to action in the video.
> - **R3 Caption:** line 1 = the myth as people search it, answered ("Did Vikings wear horned helmets? No."); the facts; then the comment ask
>   ("Which myth did you believe the longest?") and the send line; images line; sources pinned as the first comment.
> - Experiment E30 (c3-myth) runs on every reel of week 1 (design/experiments.md).

Same use as design/rules-web.md: score every rule (pass / fail, one line each) in the stills review before the one render; fix or swap on a fail;
the daily audit adds, changes or drops a rule with the number. design/channel3.md (fact rules, never-list, quality bar) still applies.
Rewritten 11 Nov 2026 (owner: "Go all in on ... Turns Out ... don't bother about the existing pattern, theme or anything"). The old rules 1-11
and the ESCALATE notes are in git history; what the numbers backed is kept below, the rest is dropped.

**The diagnosis (Instagram collect, 11 Nov 2026, 11 reels):** reach is two flat levels, never a curve. Every reel whose frame 0 is a world icon in
a colour or state nobody pictured stops at 1,059-1,273 (Liberty 1,059, Sahara 1,079, white pyramid 1,103, Golden Gate 1,157, Opera House 1,225,
Sphinx 1,273), every other one at 111-168; nothing grows after its 6 h reading (x1.0, except the late-climbing pyramid). The ~1,100 is Instagram's
first test pool; no reel earns the next one because nobody acts on it: 0-8 shares (0-0.7% of reach), 0-1 saves, 13-24 likes, 0 comments, 8
followers after 11 reels. Watch is 12-19 s of 31-35 s (40-55%). Instagram's head says its three main ranking signals are watch time, likes per
reach and sends per reach, and that sends matter most for reaching people who don't follow you (design/references.md, R-trend 11 Nov). So the
topic gate works; the format must now make people answer, send and finish.

S. **Story engine, the default format** (owner, 14 Nov 2026, the rebuild from the reference kit: "make the content rich in learning and
   information; people stay engaged with good and smart storytelling"; design/channel3.md "Story engine"). Start every reel with
   `node scripts/channel3/new25d.mjs <slug> "Payoff." "Question?" "Step." "Step." ["Step."] "Turns out, ..."`. Frame 0 is the payoff picture
   (the "wait, what?" image, never a question card) with the payoff said over it in 6 words or fewer; ONE question; 2-3 steps, each one
   concrete fact in two sources, its big word (44 px+) landing on its spoken word; the surprise worth saving last; the camera returns to
   frame 0's view (rule 3's loop). One full-frame shot per beat with real media full-bleed, a colour mood per beat (this replaces rule 10's
   one mood: rule 10's contrast, plates and GRADE still apply per shot), a camera move between shots (push, match, pan, zoom-through), no
   small furniture (badge, title strip, dots, credit plates). Gates as before: qa.mjs clean (SAFE ZONE, OVERLAP, FLOW, DEPTH per shot, BUSY),
   preflight fits, Output QA, review file. While E19 runs, `--guess` still makes a guess reel (rule 1); rules 1 and 4 apply only to those.
0. **Real media by default** (owner, 14 Nov 2026: the Niagara reel "did not look like Niagara (a grey rectangle on rocks, toy shapes)"; "yes to
   free real images ... take those and work or animate your design around it"): the icon is a REAL photo (Wikimedia Commons PD / CC0 / CC BY,
   US government works such as the US Army Corps of Engineers, NASA, NOAA, the Library of Congress "no known restrictions"), animated by us in
   kit25d.js's photo stage: `Kt.photos(MEDIA, 'media/<name>/')` at load (each graded once by a canvas filter), `Kt.photo(id, [u, v, z])` with
   `Kt.kb(keys)` slow pushes and pans, `Kt.wipe` to change state (the answer reveal), `Kt.photoPt` + `Kt.pin` on the photo's own features, our type,
   motes and mist over it. The config's `"media"` list is fetched by the Media workflow (Actions -> Media -> config; it keeps the files in R2 and
   the Showreel render pulls them); copy its MEDIA_JSON line back into the config. Guess reels: frame 0 shows a photo that does NOT give the
   answer (the icon as everyone knows it), the answer photo arrives only on the reveal; grade the two apart (e.g. present cool, archive sepia)
   and set window.GUESS / qa.guess "answer" to the answer photo's grade colour. CC BY authors go in the caption's sources line; Output QA LICENCE.
1. **Guess first** (E19, c3-guess, from Thu 12 Nov): the reel is a question the viewer answers before we do. The hook question in frame 0
   (at most 9 words), three options read aloud and shown as chips (`Kt.choices`), "Lock in your guess.", a 3-2-1 countdown (`Kt.countdown`,
   a 2.6 s breath in the story, placed beside the subject, never on it), then the answer with a tick on the right chip and strikes on the
   others, then the why. **The answer stays hidden until it is said** (owner, 12 Nov 2026: the first guess reel painted the tower red while
   still asking "Gold, grey, or red?"): from the question to the reveal the subject is neutral (a silhouette, or the colour people picture
   today when that is not an option); the options live on the chips only, and the answer's change (`Kt.repaint`) starts AT the reveal. The
   scene declares `window.GUESS = { reveal, answer, box }` and qa.mjs prints "GUESS: answer hidden until n s" from the drawn frames; a frame
   before the reveal with the answer colour on the subject fails the reel. A number claim lands once on its word (never `Kt.roll`, whose
   rolling digits show numbers above the claim). One wrong option is the colour people picture today, one is plausible, one is true.
   Start every reel with `node scripts/channel3/new25d.mjs <slug> --guess "Question?" "A, B, or C?" "Lock in your guess." "Answer." "Why." "More." "Turns out, ..."`.
   Decides keep or drop: 3 reels (12-14 Nov), each read at 24 h; WIN = reach above 1,300 (the best non-guess reel was 1,273) OR 5+ shares and
   comments together (the best so far was 8 shares once). Verdict Sun 15 Nov in design/experiments.md (E19).
2. **The icon in a colour or state people never pictured, recognised in under 1 s** (kept: 6 of 6 such reels reached 1,059-1,273, all 5 others
   111-168). Pick the icon first (a landmark, artwork or object people on every continent know on sight), then its true past state. A
   transformation nobody recognises fails (flamingos 125).
3. **18-25 s and it loops** (was 25-35 s). Watch held 12-19 s on 31-35 s reels whatever happened after it; a reel that ends near the viewer's
   average watch is finished by most viewers and replayed by some. The last frame matches frame 0 (same view, same subject), so a replay is
   seamless. At most 2.6 words/s overall (preflight), a change every 1.5-2 s.
4. **The caption asks for the answer and a send**: line 1 is the question back to the viewer ("Gold, grey or red: what did you guess?"), the
   last line asks for the letter in the comments and a send to the friend who'd get it wrong. No other call to action (no "follow").
5. **Journey of 4+ scenes with declared transitions, depth in every world** (kept from rules 9 and 11: Sphinx 1,273 and Opera House 1,225 were
   the two best and the first two journeys; owner, 8 Nov: "feels flat"). The question world first (the icon, big), then 2+ worlds for the why
   (a place, a close detail, an archive), joined by different transitions in window.TRANSITIONS, and back to the question world for the payoff
   (rule 3's loop): 4+ scenes counting the return (review item 19). Every world: Kt.world with 4+ Kt.plane layers, a foreground plane, contact shadows, one light from the upper left, ambient
   life with its quiet cue; qa.mjs prints "DEPTH <world>" lines (4+ planes, 12+ px, foreground yes). People (if any) move from keyframed joints
   (Kt.act) and are read on a 0.1 s strip: no move may look like a fall (owner, 9 Nov).
6. **Facts: globally known, every claim in two reliable sources, nothing an expert or official body disputes** (kept; 11 Nov: Tower Bridge's
   "chocolate brown" first colour is disputed by a paint historian, so the topic was swapped). Credit on the last frames; 2+ sources in the config.
7. **Said right**: the preflight PRONUNCIATION line has no "check:" words (shared lexicon scripts/voice/say.json); years as people say them.
8. **One reel a day at 13:00 IST, ready by 12:00** (owner, 8 Nov 2026), built that morning or the evening before; never a second reel for a
   channel and day (captions.json).
9. **Something small lands and is heard every 0.5-1 s** (owner, 12 Nov 2026: "more detailing and stacking ... to avoid boring instances in
   the reel and make it tick, snap, click better"; the first Eiffel guess reel went quiet for 2.4 s at its payoff, 22.2-24.6 s, with nothing
   small moving or heard). Every world builds up in front of the viewer: rivets popping in, paint strokes, labels and stamps snapping on,
   paper pieces stacking with a shadow that tightens as they settle, a tally counting, dust and sparks, each a `Kt.beat` with its matched
   sound (`Kt.beatCues`). qa.mjs "BUSY: longest quiet run" must be 1.5 s or less with 80 %+ of the beats seen on the frames, and SOUND
   DETAIL 80 %+ after the render. In the guess world the details stay neutral until the reveal (rule 1).

10. **One colour mood per reel, the subject pops** (owner, 13 Nov 2026: "I don't find the colour selection better in the overall reel
   combination"; the fogged Taj reel measured 0.03 subject-vs-surroundings contrast on its cover and 93% washed-out frames). Set
   `Kt.mood('dusk')` (both starters do): every world uses its sky (`Kt.sky`, `M.night` for night), air, dark ground and water; the subject is
   lit warm (`Kt.warm`) with a gold rim (`Kt.rim`) against the deep blue; close-ups keep three clear values (bright panel, mid wall, dark
   material); ONE accent (amber) for every highlighted word; every title, label and subtitle on a solid dark plate (`Kt.plate`, HOOK.plate);
   `Kt.grade()` after the worlds every frame; at most a couple of particles in frame. Output QA GRADE must PASS (cover contrast 0.2+, washed
   frames 20% or fewer), with COLOUR (no hard hue cut) and GUESS.

11. **Echoes: a new element at least every 2.5 s; no photo used twice** (owner, 16 Nov 2026, the Liberty arm reel: "elements are few and are
   spread ... We should design it such that there are more elements to show on screen as the storyline moves forward"; 10 shots in ~40 s, one
   photo 3 times, stretches of 3.5-4.1 s with nothing new). A new visual beat on a phrase or key word about every 2 s (18-24 beats in a 35-40 s
   reel): a new photo, or a layered element that builds up as the story moves (the running year, the journey map's route, a label with an
   arrow, a cut-out figure for scale, a newspaper cutting, a counter only for a figure the voice says; design/channel3.md "Layered elements").
   Every photo is the picture of ONE shot. Output QA ELEMENTS (nothing new for over 3.0 s, or under 4 pictures in any 10 s) and REUSE must
   PASS; read them before the render with `node scripts/qa/frames.mjs <config> <dir>` + `python3 scripts/qa/look.py <config> <dir>`.

**Quality gate (unchanged, design/mandatory.md):** SAFE ZONE ok, OVERLAP none, BAND and HOOK read on the stills, FLOW (cuts 0, dead runs
none, continuity 85%+, strobes 0-1), DEPTH lines, SOUND GATE ok and SOUND DETAIL ok after the render (every moving element heard, small high,
medium mid, large low), the voice check, and design/owner-feedback.md line by line on the finished output.

**Dropped 11 Nov (the numbers do not support them):** the 25-35 s length (no reel's watch went past 19 s); "a big change every ~3 s" (now
1.5-2 s, owner feedback 7 Nov); the hour as a lever (13:00 vs evening made no difference: every slot gave 1,0xx or ~150 by topic); the
"Did you know / why" question with the answer spoken straight away (it reaches the first pool and stops there).

**12 Nov audit:** PROMOTE c3-journey (2 WINs, 0 LOSEs at 24 h: Sphinx 1,258 vs median 1,023, +23%; Opera House 1,224 vs 1,041, +18%) is
rule 5 already; the c3 channel is OK (median reach 1,103 vs target 500). E19 (guess) starts today with showreel-c3-eiffel-red.


**13 Nov audit:** PROMOTE c3-journey printed again (same 2 WINs); it is rule 5 since 12 Nov. c3 OK (median reach 1,154 vs target 500).
**14 Nov audit:** PROMOTE c3-journey printed again (2 WINs); rule 5 since 12 Nov. c3 OK. E19 so far: Eiffel 1,141 (LOSE at 24 h, -1%), Taj 135 at
~9 h (posted 15:56, late); Niagara today is try 3, verdict Sun 15 (the Turns Out run reads it).

**23 Nov audit:** c3 ALARM (median reach 132 over the last 7 vs target 500; best window 1,157) and ESCALATE (second day running). The answer is already running: the design series from 21 Nov (stop-centring 366 vs 131 at 24 h, thumb-targets reel 1,112 reached on 22 Nov). PROMOTE c3-journey is rule 5 since 12 Nov. DROP c3-guess (2 LOSEs: Eiffel -1%, Taj -88%) is in design/playbook.md.

