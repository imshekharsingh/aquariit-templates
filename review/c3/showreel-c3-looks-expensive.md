# Review: showreel-c3-looks-expensive (c3, rebuilt 25 Nov 2026, posts 25 Nov at 17:00 IST once the critic says READY)

Turns Out design series #2 (design/c3-plan.md section 0), rebuilt on the improved kit (rules-c3.md V1-V3, B1-B3, P1-P2) from the gold reel showreel-c3-grey-text.
Scene scripts/channel3/design/looks-expensive.js (copy: scripts/channel3/looks-expensive.html). AUTO lines from stills.mjs on scripts/channel3/looks-expensive.json.

1. Topic: PASS: an invented honey label on a shop shelf, fixed in three moves (room, a small spaced name, two colours); one fix anyone can use on a label, logo or price tag; invented name, no real brand (design/safety.md)
2. Frame 0: PASS: SUBJECT FILL: 94% at frame 0; the claim alone in the top band ("Too much going on."), the crowded label fully lit, its problems ringed (TOO BIG, TOO MANY COLOURS)
3. Safe zone: PASS: SAFE ZONE: ok (title, dial, captions, chips, rings, label and colour card inside x 60-960, y 250-1570 on the 0.5 s scan)
4. No overlap: PASS: OVERLAP: none; BAND: clear; HOOK: clear of the subject
5. Motion: PASS: STATIC STRETCH: none (least change 0.9, median 4.6); EMPTY FRAMES: none; TEXT FIT: all text inside its box
6. Subtitles: PASS: SUBTITLES: at least 52 px, at most 6 words a line; key words amber
7. Voice: PASS: PREFLIGHT voice: 145 letters, 7 sentences, about 12.0 s at speed 1 with 1.95 s of breaths (reel 21 s, voice must end by 20.4 s): fits; HOOK PACE: the first sentence has 5 words: ok (6 or fewer); PRONUNCIATION: 0 overrides used; no unchecked words; one short sentence ("It looks cheap."); c3-script check in npm run check
8. Sound: PASS: the design vocabulary (DT.S, drum-free): sting, stamp on "cheap", lands as the clutter leaves, drag on the name, two eyedropper clicks, reveal chord on "premium"
9. Payoff: PASS: ends on the fixed label with BEFORE as a tilted thumbnail, two ticks and a green frame; no call to action on screen
10. Facts: PASS: white space, fewer colours and restrained type read as premium (CXL, How to Create a Luxurious User Experience; Butterick, Letterspacing: spaced capitals); the reel claims no number
11. Post data: PASS: captions.json entry (c3, engine design, concept); caption: claim, the 3 fixes as a numbered list, a save ask and one question; 6 keywords, 5 hashtags, 2 sources
12. Review file: PASS: this file, direction card with STILLS CHECK: APPROVED
13. After the render (render 2): PASS: OUTPUT QA PASS (Showreel run 45535868004, Output QA step success: FILL and ELEMENTS fixed; LOOK, VARIETY, NUMBERS, DEAD, GRADE as on render 1); render 1 (run 45529832138) failed FILL and ELEMENTS, see below
14. Cuts: PASS: no cuts (one board, camera pushes)
15. Dead runs: PASS: STATIC STRETCH none
16. Continuity: PASS: one stage, one object changing in place
17. Strobes: PASS: none by construction
18. Element sound (web): n/a (Turns Out)
19. Journey: PASS: claim, rings on the mistakes, each fix done on screen (clutter leaves with margin guides, the name shrinks and spreads inside a selection, an eyedropper samples the colours and the colour card counts them down), then the proof
20. Depth and life: PASS: design engine: shop shelf behind the label, mood brightening as fixes land, camera push per fix, spark bursts

Owner feedback (design/owner-feedback.md) against the stills: natural spoken sentences with breaths; the before is a believable first draft (big bold centred name, four colours, a badge and banner), not a strawman; the colour count on screen appears only after the voice says "two"; no rolling numbers.

Render 1 (run 45529832138, 25 Nov 2026): Output QA FAIL on FILL (71%: the label alone was a small centred picture; the gold's rulers beside the board were left out) and ELEMENTS (4.2 s with nothing new after the last tick: reel 21 s too long for its voice). Fix before render 2: the rulers are back (FILL 0.90 median on a local frame scan, none under 0.80) and the reel is 19.5 s (the tail after the last element is about 2.7 s). LOOK, VARIETY, NUMBERS, DEAD, GRADE passed on render 1.

## Critic (independent session, 25 Nov 2026, render 2, run 45535868004)
Judged on the real MP4 (reel-fetch), the side-by-side sheet with the gold reel showreel-c3-grey-text (8 times: 1.2, 3.7, 6.1, 8.5, 11.0, 13.4, 15.8, 18.3 s) and one strip at 0.5 s steps over 9.5-14.0 s. Voice: I could not listen to it (no audio playback or speech-to-text here); judged from loudness, breath gaps and on-screen subtitles only.
- 0 Safety: yes (invented brand, no real marks, sources cited). 0b AI label: "aiLabel" missing in captions.json; it should be false (flat drawn graphics). Not enforced until 27 Nov, but set it when the reel is rebuilt.
- 1 Frame 0: yes. The crowded label is lit at 1.2 s with TOO BIG / TOO MANY COLOURS rings; "Busy, so cheap" reads in under 1 s.
- 2 Every frame whole: NO. At 13.5-14.0 s the BEFORE flashback is drawn in front of the "SAME PRODUCT · PREMIUM" chip and cuts it off at the top; its green badge is clipped to "00% ATURAL" and a stray grey line sits mid-label (14.0 s strip).
- 3 Screen matches voice: yes ("two colours" at 10.0 s with the TWO COLOURS card; no rolling numbers).
- 4 One focus: yes, except the 13.5-14.0 s flashback, where the chip, thumbnail and label compete.
- 5 Lines shown and finished: subtitles show every line; pace about 12 s of voice for 34 words, below 2.6 words/s.
- 6 Sound and mix: -14.0 LUFS integrated, LRA 1.5 LU; six dips of -20 to -25 LUFS at 1.4, 2.7, 5.1, 6.7, 8.8, 10.9 s match the six breaths. I could not judge by ear whether each tool sound can be heard.
- 7 Payoff: weak. 15.8-19.5 s holds a cream square with a small spaced name; the payoff does not make you want to send it to a friend.
- D1 Voice like a person: the script is seven full sentences with a breath after each (config gaps 0.3-0.4 s, seen as loudness dips). Not heard.
- D2 Lines land on their change: fix 1 room at 6.1 s ("give it room", clutter leaving, guides); fix 2 at 8.5 s ("space the name", name small and spaced); fix 3 at 9.5-10.5 s ("two colours", eyedropper, name red to dark grey). At 2-4 fps all three are within the line; I cannot prove 0.3 s at this frame rate.
- D3 Believable before: yes. A big bold red name, four colours, a badge and a BUY 2 GET 1 banner is a common first-draft label (CXL).
- D4 Last frame BEFORE + AFTER: yes. The tagged thumbnail and the tagged after are held 15.8-19.5 s (3.7 s).
- 43 GOLD: below (15.8-18.3 s: gold's after is a full, readable menu with a tick on each line; ours is an almost empty square whose name is about 8 px cap height and whose "PURE · NATURAL · BEST" line cannot be read at phone size; LOOK numbers are level: bright 0.380 vs 0.352, contrast 0.346 vs 0.343, dark 32% both).
- 44 Direction card: hook shown in frame 0 yes; pause held 15.8-19.5 s yes; rewatch moment (the name shrinking at 8-9 s) delivered but small; payoff delivered as a layout, but it reads unfinished rather than premium. The after also deletes what a real label must keep (honey type and 500 g weight), so "give it room" turns into "delete everything": the wrong lesson for a design fix reel.
- STOP: 7/10 (0-1 s: the crowded label and red rings stop the thumb; the title is clear)
- REWATCH: 5/10 (8.5 s: the name shrink is the only surprise, and it ends on a blank card nobody scrubs back to)
PREMIUM: animation 7/10 (t 6.1-11.0 pushes and the eyedropper land cleanly; 14.0-14.5 s flashback pops in and doubles), cleanliness 6/10 (t 13.5-14.0 chip covered, badge clipped, stray line), premium 5/10 (t 15.8-19.5 the after is a near-empty cream square); weakest: t 15.8-19.5, the after label looks empty, fix: keep the product line and weight as a quiet second size, make the spaced name 2x larger, give the label one rich detail in the second colour (a thin rule or seal) so it looks 5x pricier, not unfinished.
ENHANCE: open on the honey jar itself on the shelf with the price tag, so "5x pricier" is a price the viewer can see change at the end.
CRITIC: NOT READY: the finished label at 15-19.5 s looks empty and unfinished rather than expensive (tiny name, unreadable second line, the honey type and weight deleted), and at 13.5-14 s the old label pops in over the "Same product" tag. Detail: questions 2, 7, 43, 44 (REWATCH 5/10) and PREMIUM (cleanliness 6, premium 5). Fix: the after keeps the product line and 500 g in a quiet second size, the name about 2x larger, one detail in the second colour; the BEFORE flashback sits behind or below the chip and is scaled to stay whole (badge not clipped, no stray line). Both renders are used, so the reel is skipped for today.
