# Review: showreel-c3-fix-invite (c3, rebuilt 26 Nov 2026, posts 26 Nov at 17:00 IST once the critic says READY)

Turns Out design series #5 (design/c3-plan.md section 0; #3 was withdrawn on 21 Nov and #4 was posted on 21 Nov), rebuilt on the improved kit (rules-c3.md V1-V3, B1-B3, P1-P2) from the gold reel showreel-c3-grey-text.
Scene scripts/channel3/design/fix-invite.js (copy: scripts/channel3/fix-invite.html). AUTO lines from preflight.mjs, stills.mjs, flow.mjs and qa/align.mjs on scripts/channel3/fix-invite.json.

1. Topic: PASS: a kids' birthday invite on a fridge door fixed in three moves (one hero, the age; one font in two sizes; one colour used once); one fix anyone can use on an invite, poster or flyer; invented name (Aarav), no real brand, logo or person (design/safety.md)
2. Frame 0: PASS: SUBJECT FILL: 61% at frame 0 (stills check; Output QA FILL measures the picture's width with the rulers); the claim alone in the top band ("No hero, so no read"), the invite fully lit, its problems ringed (NO HERO, 4 FONTS, 6 COLOURS)
3. Safe zone: PASS: SAFE ZONE: ok (title, dial, captions, chips, rings, invite and rulers inside x 60-960, y 250-1570 on the 0.5 s scan)
4. No overlap: PASS: OVERLAP: none; BAND: clear; HOOK: clear of the subject
5. Motion: PASS: STATIC STRETCH: none (least change 1.2 at 17.5 s, median 5.4); EMPTY FRAMES: none (scanned 42 moments, least detail 82.6 at 17 s); TEXT FIT: all text inside its box
6. Subtitles: PASS: SUBTITLES: at least 52 px, at most 6 words a line; key words amber
7. Voice: PASS: PREFLIGHT voice: 185 letters, 7 sentences, about 14.7 s at speed 1 with 1.95 s of breaths (reel 20 s, voice must end by 19.4 s): fits; HOOK PACE: the first sentence has 4 words: ok (6 or fewer); PRONUNCIATION: 1 override used: colour; no unchecked words; seven spoken sentences with breaths (voice.gap), no label sentences, contractions not needed
8. Sound: PASS: the design vocabulary (DT.S, drum-free): sting, stamp on "nothing stands out", lands as the old lines step down, a swell and three notes as the 7 grows, a scan roll as the fonts flip, plucks as the confetti flies into the 7, reveal chord and paper flip at the proof
9. Payoff: PASS: ends on the fixed invite with BEFORE as a tilted thumbnail below the design, three ticks (7, name, date) and a green frame; no call to action on screen; the BEFORE flashback sits under the chip and never covers a tag
10. Facts: PASS: one focal element and fewer fonts, sizes and colours make a clear hierarchy (Nielsen Norman Group, Visual hierarchy in UX; Butterick, Typography in ten minutes); the reel claims no number beyond what is drawn
11. Post data: PASS: captions.json entry (c3, engine design, concept, aiLabel false); caption: claim, the 3 fixes as a numbered list, a save ask and one question; 6 keywords, 5 hashtags, 2 sources
12. Review file: PASS: this file, direction card with its stills check line
13. After the render: PASS: render 1 (Showreel run 45742683066) passed Output QA; 20.0 s, 30 fps, -14.0 LUFS integrated, LRA 1.2 LU; judged by the independent critic on the real MP4 (Critic section below)
14. Cuts: PASS: FLOW: cuts 0
15. Dead runs: PASS: FLOW: dead runs none
16. Continuity: PASS: FLOW: continuity 99% (median step 1.0, 0 declared transitions)
17. Strobes: PASS: FLOW: strobes 0
18. Element sound (web): n/a (Turns Out)
19. Journey: PASS: claim, rings on the mistakes, each fix done on screen (the lines step down and the 7 grows with read-order badges 1-2-3, a scan flips every line into one font in two sizes, the confetti flies into the 7 which takes the one colour), then the proof
20. Depth and life: PASS: design engine: a lit steel fridge door behind the invite, mood brightening as fixes land, camera push per fix, spark bursts

Owner feedback (design/owner-feedback.md) against the stills: natural spoken sentences with breaths; the before is a believable first draft (four fonts, all centred, confetti, no hero), not a strawman; nothing the invite needs is deleted (name, age, date, place and RSVP all stay); the 7 and any added element are hidden while the BEFORE picture is kept; the BEFORE flashback never covers a chip or tag; no CTA on screen.


Reference lessons applied 26 Nov (owner chat, refs 10 and 14): serif headline with the key word in italic accent, subtitles as a pill; check chips and before-to-after in one frame were already in the reel. Not applied: the reversal beat and a script change (the owner chat said keep our length).

## Owner fix, 26 Nov 2026 (render 2): text overlap and alignment
Owner watched render 1 (critic READY) and said the texts overlap slightly and want a cleaner alignment. Found on the real MP4 contact sheet: (1) chips on the board's top edge and on the subtitle pill, (2) ring tags on the board's bottom edge, (3) the three red rings touching, (4) confetti dots under text lines, (5) read-order badges on confetti, (6) BEFORE/AFTER tags on the board border, (7) the 7 near the name line; off grid: headline x 30 vs subtitle text x 42, chips on nine x positions, thumbnail on x 30. Fix in the scene only (story, voice, timing, look unchanged): subtitle pill 278-333 with text on x 32 like the dial and headline; chip band 356-401 centred on the board; board 424-744; rings spaced with 8 px gaps; confetti in a clear right column; ring tags inside the board's empty lower part; BEFORE/AFTER tags under the board; 7 at 112 px. Local: OVERLAP none, SAFE ZONE ok, TEXT FIT ok, ALIGN ok. The critic of render 2 must check overlap and alignment explicitly.

## Critic (independent session, 26 Nov 2026, render 1, run 45742683066)
Judged on the real MP4 (reel-fetch, 20.0 s): the side-by-side sheet with the gold reel showreel-c3-grey-text (8 times: 1.2, 3.8, 6.2, 8.8, 11.2, 13.8, 16.2, 18.8 s), 10 phone-size frames (0.0, 0.6, 2.5, 5.0, 7.0, 9.0, 10.0, 12.0, 14.0, 19.5 s), 0.2 s strips over 7.0-9.4 s and 11.6-14.0 s, a 0.1 s strip over 15.9-17.7 s (the BEFORE flashback) and a full-size look at 18.5 s. Voice: not heard (no audio playback here); judged from loudness and the word-by-word subtitles.
- 43 Side by side with gold: matches. Same stage, light and pacing; the after (cream invite, one orange 7) is as calm and finished as gold's menu, and the before/after end frame matches gold's layout.
- 0 Safety: yes (invented name Aarav, no real marks on screen, two sources). One post-text miss fixed here: the keyword "canva design tips" names a real company, which Turns Out does not do; captions.json now overrides the keywords with "poster design tips" in its place (post text only, the video is untouched).
- 0b AI label: false, correct (flat drawn graphics).
- 1 Frame 0: yes. The pale blue invite is whole and lit at 0.0 s with "No hero, so no read" in the serif headline and "Everything here is shouting" in the pill; it reads in under 1 s. The rings and NO HERO / 4 FONTS / 6 COLOURS tags are on by 2.5 s.
- 2 Every frame whole: yes. Nothing cut at the edges; the tags sit under the rings, the chips on the board's top edge. The shrinking flashback crosses the left of the after's lines for about 0.2 s at 16.4-16.6 s with motion blur: a move, not a defect.
- 3 Screen matches voice: yes ("one hero" with the 7, "one font in two sizes" with the scan, "one colour, just once" with the orange 7; FONTS 1 · COLOUR 1 at the end). Note: the after has the 7 plus two text sizes (the name and the lines), so "two sizes" holds with the 7 as the hero.
- 4 One focus: yes; one fix at a time, the read-order badges 1-2-3 at 8.2-8.6 s lead the eye down the invite.
- 5 Lines shown and finished: every line is in the pill subtitles, lit word by word; 44 words in about 14.7 s of voice.
- 6 Sound and mix: -14.0 LUFS integrated, LRA 1.2 LU. Tool sounds not judged by ear.
- 7 Payoff: yes. 16.5-20 s holds the cream invite with its one orange 7, three ticks, the green frame, FONTS 1 · COLOUR 1, and the tilted BEFORE thumbnail.
- D1 Voice like a person: seven full sentences, one idea each, breaths of 0.3-0.4 s (config); no label sentences. Not heard.
- D2 Lines land on their change: fix 1, "age" about 7.4 s: a small 7 appears at 7.4 s and grows to the hero by 7.6 s on "biggest"; fix 2, "one font" about 9.5 s: the scan line runs and flips the lines at about 9.8-10.2 s, within the line; fix 3, "colour" about 12.0 s: confetti flies into the 7 at 12.2-12.4 s and the 7 turns orange by 12.6 s. All within the sentence; at 5 frames a second I cannot prove 0.3 s for fix 2.
- D3 Believable before: yes. A script name, a condensed PARTY TIME, typewriter details, all centred, confetti dots in six colours: the way a quick invite from a template looks. Nobody would call it a strawman.
- D4 Last frame shows both: yes. BEFORE (red tag) and AFTER (green tag) both readable at phone size; the thumbnail is whole and its lines are legible; held from 17.0 s to 20.0 s (3 s).
- Key info kept (25 Nov lesson): yes. Name, age, date and time, place and RSVP are all in the after (18.5 s); only the confetti goes. The flashback (15.9-16.4 s) sits under the SAME PARTY chip, whole, with the 7 hidden, and covers no tag.
- Type: the serif headline with the italic accent word and the pill subtitles are legible at phone size at every frame checked.
- Dead stretches: none; something changes every 1-2 s, the end hold is the planned 3 s.
- Small notes, not worth a render: the headline "No hero, so no read" is a little clipped as English; the lower quarter of the frame is the floor, as in gold.

STOP 7/10 (a familiar messy invite and a bold claim from frame 0), REWATCH 7/10 (the font scan at 9.8-10.2 s and the confetti flying into the 7), PREMIUM 7.5/10 (animation 7.5, cleanliness 8, premium 7).

CRITIC: READY
