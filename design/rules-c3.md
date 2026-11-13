# Turns Out rulebook (the gate every Turns Out reel passes before its one render)

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

**Quality gate (unchanged, design/mandatory.md):** SAFE ZONE ok, OVERLAP none, BAND and HOOK read on the stills, FLOW (cuts 0, dead runs
none, continuity 85%+, strobes 0-1), DEPTH lines, SOUND GATE ok and SOUND DETAIL ok after the render (every moving element heard, small high,
medium mid, large low), the voice check, and design/owner-feedback.md line by line on the finished output.

**Dropped 11 Nov (the numbers do not support them):** the 25-35 s length (no reel's watch went past 19 s); "a big change every ~3 s" (now
1.5-2 s, owner feedback 7 Nov); the hour as a lever (13:00 vs evening made no difference: every slot gave 1,0xx or ~150 by topic); the
"Did you know / why" question with the answer spoken straight away (it reaches the first pool and stops there).

**12 Nov audit:** PROMOTE c3-journey (2 WINs, 0 LOSEs at 24 h: Sphinx 1,258 vs median 1,023, +23%; Opera House 1,224 vs 1,041, +18%) is
rule 5 already; the c3 channel is OK (median reach 1,103 vs target 500). E19 (guess) starts today with showreel-c3-eiffel-red.


**13 Nov audit:** PROMOTE c3-journey printed again (same 2 WINs); it is rule 5 since 12 Nov. c3 OK (median reach 1,154 vs target 500).
