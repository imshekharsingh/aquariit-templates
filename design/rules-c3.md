# Turns Out rulebook (the gate every Turns Out reel passes before its one render)

Same use as design/rules-web.md: score every rule (pass / fail, one line each) in the stills review before the one render; fix or swap on a fail;
the daily audit adds, changes or drops a rule with the number. design/channel3.md (fact rules, never-list, quality bar) still applies.
Evidence = the Instagram collect run of 5 Nov 2026: 4 reels, median reach 157, 0 followers, 1 save, 1 share.

1. **The payoff image is in frame 0**: a "wait, what?" visual (the copper-brown Statue of Liberty), not a question written on paper.
   Evidence: Liberty (the colour change carries the reel) 1,051 reach, 15.2 s watched vs Eiffel 161 (13.4 s), blue sky 153 (8.4 s),
   60 minutes 118 (12.4 s). 6 Nov: the green Sahara (a map turning green) 1,041 at 5 h and the channel's first 4 followers: both reels past
   1,000 open on a colour change; the 3 without one sit at 150-161. Test from 6 Nov (E14): 3 reels; keep or drop by reach and hold vs the median (157).
   7 Nov, E14 reel 1 (flamingos, a grey chick in frame 0): 120 at 5 h vs the Sahara's 1,041 at 5 h (every Turns Out reel has ended at
   x1.0-1.0 of its 5-8 h reach, so this is close to final; 24 h reading at the 13:39 run). A colour change alone is not enough: the two hits show
   a world-famous thing everyone pictures one way (Liberty, the Sahara) in a state that looks wrong; a grey chick is not recognised as a
   flamingo, and "why are flamingos pink" is a fact many already know. Frame 0 = an icon in an unexpected state, recognised in under 1 s.
2. **Only topics with a visible transformation** (a colour, a shape, a map, a size that changes in front of you).
   Evidence: the one reel past 1,000 is the one with a transformation; the abstract ones (why 60 minutes, why the sky is blue) sit at 118-153. 6 Nov: the green Sahara (1,041 at 5 h) is the second.
3. **Hook spoken and shown from frame 0, in at most 9 words**, and answered by the payoff in the last 3 s. Evidence: every Turns Out reel
   so far; keep until the numbers say otherwise.
4. **25-35 s, a big change every ~3 s, one camera that never cuts** (2.5D kit). Evidence: Liberty held 15.2 s of 33.3 (46%), the best on the channel;
   blue sky held 8.4 s of 31.3 (27%).
5. **Globally known, 2 reliable sources per claim, short credit on the last frame.** Evidence: no source complaints; the rule protects reach
   on every continent.
6. **Post one reel daily at 13:00 IST, ready by 12:00** (owner, 8 Nov 2026: "upload time at 13:00 for all three"; built by "Turns Out daily reel" at ~09:11 IST).
   E15 (20:00 IST, 6-7 Nov) ended 8 Nov. Evidence so far: Liberty went out at 18:21 (1,051); the 15:07, 17:30 and 20:16 posts reached 118-161; the Sahara
   (20:53) 1,041 at 5 h: the topic drives reach, not the hour. Measure from 8 Nov: each reel's 24 h reach and hold vs the channel median (157).
   Timing cannot fix a low hold: rules 1-4 stay the main gate.
7. **Tech terms and years are said the way people say them** (one shared lexicon for every channel, scripts/voice/say.json): the preflight
   PRONUNCIATION line shows no "check:" words before the render; a new term goes into say.json (or the config's "say"). Evidence: 5 Nov,
   Kokoro alone reads 1889 as "eighteen hundred eighty nine" (5 of 10 Turns Out scripts have years); Eiffel and metres were unknown to it.
8. **One slot a day** (owner, 8 Nov 2026): E16 (13:30 + 20:00, 7 Nov only) ended; each build checks captions.json for its channel and day (postOn = today, postAt 13:00) and never builds a second reel.
9. **Journey: 4+ scenes, varied transitions, no single static set** (owner, 8 Nov 2026). At least 4 distinct places, scales or eras per reel
   (a wide view, a close detail, an archive, people or tools, the payoff view), joined by motivated transitions declared in window.TRANSITIONS,
   no two alike (the kit's Kt.through zoom-through, Kt.match match cut, Kt.page page turn, Kt.fold paper fold, Kt.seam parallax pan, Kt.print photo,
   a dive or a time-lapse); 4+ depth layers per scene with something passing the lens and secondary motion everywhere; every moving element
   has a sound by its size (small = high tick or blip, medium = snap or paper rustle, large = low move or thud), panned by its x. The review
   file's item 19 lists the scenes and transitions. Evidence: Golden Gate (8 Nov) passed FLOW (continuity 100%) with one bridge from start to
   end, because a drifting set counts as motion; the owner: "Turns Out feels flat at times ... such designs can be easily made." The channel
   median is 163 over the last 6; the first journey reels (Sphinx 9 Nov, Opera House 10 Nov) are E-journey, read vs that median.

10. **The icon in a colour or state people never pictured, recognised in under 1 s** (promoted 9 Nov 2026 from rules 1-2: 4 wins of 5).
   Evidence (Instagram collect, 9 Nov 05:10 IST): the four Turns Out reels past 1,000 reach are all a world-famous thing in a colour that looks
   wrong: Liberty copper-brown 1,058, the green Sahara 1,076, the white Great Pyramid 1,102, the black-and-yellow Golden Gate 1,143 at 6 h
   (vs the channel's 6 h median of 158, x7); every other reel sits at 108-161 (blue sky 160, 60 minutes 153, flamingo pink 123, Pisa 108).
   The one colour reel that missed (flamingos) showed a thing nobody recognised. So: pick the icon first (a landmark, artwork or object people on
   every continent know on sight), then the true state it was in; a shape or naming story is second choice and needs a visible change to pass.

**ESCALATE 8 Nov** (median reach 163 over the last 6, ALARM two days running; the two 1,000+ reels and the white pyramid's 465 at 5 h are all visible
transformations of a world-famous thing; every reel without one sits at 118-161): from Mon 9 Nov every Turns Out topic must be a visible transformation
of a landmark everyone pictures (not a naming or calendar story). Mon 9's Everest-name topic is swapped for the Sphinx buried in sand (design/topics.md).

**Figure motion (REVIEW; owner, 8 Nov 2026: the Sphinx prince lying down looked "like someone has abruptly fallen")**: any human action (sit, lie
down, stand, reach, walk) is a sequence of poses with anticipation (a yawn, a shift of weight), ease through every pose (no linear move, no snap,
no pose that appears whole) and weight (a hand or foot planted before the body moves onto it), about 1.5-2.5 s for a whole-body move, and a
settle after (a breath, a blink). The stills review checks it every 0.1 s across the move. Sound: cloth and breath, never a thud for a body.

**ESCALATE 9 Nov** (median reach 160 over the last 7, ALARM again): today's and tomorrow's reels (Sphinx 9 Nov, Opera House 10 Nov) are already
the format answer (the journey, E c3-journey, try 1 and 2) and are read at 24 h. The topic answer is applied to the week: Wed 11 - Sun 15 were
calendar, naming and map stories (pyramid north, Canberra, Brazil, leap day, Japan), which rule 10 fails; they are swapped in design/topics.md for
five icons in a colour or state nobody pictures. Golden Gate at 13:00 (1,143 at 6 h) is on track for a WIN at its 24 h reading.
