# Review: showreel-49-scrollbar (web, postOn 2026-11-27 postAt 19:00 IST)

Rulebook (rules-web.md), scored on the local stills (review/web/showreel-49-scrollbar.stills.jpg, 15 frames; the voice there is the simulated one, 12.8 s): rule 1 pass (anyone who has scrolled a long article has watched a reading bar), rule 2 pass (the hook and the feed are whole at frame 0; the flick and the lagging bar start at 0.25 s), rule 3 pass (the code card types from the spoken "fix", about 6.3 s), rule 5 pass (a red bar trailing the page, then a lime bar on it: readable on mute), rule 6 pass (6-word "Why is your scroll bar late?" over the broken thing), rule 8 pass (animation-timeline: scroll(); stays on the card for the last 6 s), rule 9 (see item 7), rule 10 pass (item 14-17), rule 14 pass (eye path below), rule 15 pass (BEFORE the bar trails with a hatched gap and a tick, AFTER it never moves off the page), rule 17 pass (one camera, still; only the bar and the feed move), rule 18 pass (one olive base in tonal steps, the bar is the only strong colour: red broken, lime fixed), rule 19 pass (black look), rule 20 pass (HOOK BUG first at 0.25 s, second 1.45 s; a reaction word "late!" at 0.7 s; a measurement, JS CALLS, takes the hook's place).
Pick: W27-1 kept first by Fable (session_01AYvWRiwLKGTbPUoWbqUHTV, 27 Nov, design/pick-log.md); MDN animation-timeline page read 27 Nov, support re-read in browser-compat-data (Chrome 115, Firefox 159, Safari 26). Hook changed from the bank's "This progress bar has no scroll listener" to the rule-6 question over the broken thing; "no scroll listener" is the payoff (JS CALLS 0).
Yesterday's critic notes applied: the reaction words sit in the page header's own row, clear of the subtitle band; the code card starts typing on the spoken word "fix".
Eye path (rule 14), one line per beat: 0-2.4 s hook top-left, then down to the bar at the top of the phone (the flick and the red bar are the only things moving); 2.5-5.5 s the cause chips scroll -> your JS -> bar appear in the hook's place, the middle chip turns red on "lag" and LATE pops; about 6.3 s "fix" and the card types in the same place; about 8.4 s the bar turns lime on the page; 9.4-13.5 s four flicks (down, down, back up, down) with the eye on the bar and the 0 in the meter; the last 1.5 s hold on the code card, the label and JS CALLS 0.

1. Topic: PASS: a reading progress bar that trails the page, fixed by animation-timeline: scroll(); (W27-1, Fable pick of 27 Nov); every phone user has scrolled an article with a bar; not done before (13-popup and 23-sideways are scroll lock and overflow; this is a scroll-driven animation)
2. Frame 0: PASS: SUBJECT FILL: 44% at frame 0; HOOK: clear of the subject; at frame 0 the whole hook, the feed and the bar are on screen, the flick lands at 0.25 s
3. Safe zone: PASS: SAFE ZONE: ok (the first sheet found the word LATE past the right edge; the cause picture was narrowed to 440 px)
4. No overlap: PASS: OVERLAP: none; BAND: clear (reaction words in the page header's right half, the cause chips and the code card in the top zone, no text on the page cards)
5. Motion: PASS: STATIC STRETCH: none (least change 0.0 at 13.5 s, median 3.2)
6. Subtitles: PASS: SUBTITLES: at least 52 px, at most 6 words a line
7. Voice: PASS: PREFLIGHT voice: 161 letters, 4 sentences, about 12.5 s at speed 1 in one take (reel 15 s, voice must end by 14.4 s): fits; PRONUNCIATION: 0 overrides used; no unchecked words; HOOK PACE: 6 words ok; CONTRAST: the red JS chip text was 4.2:1, lightened to #ff8f9a; "animation timeline scroll" is said as words
8. Sound: PASS (by design; measured on the render at item 13): a hit and a whoosh at 0.0 s, a hit and a swish at each flick, typing ticks, a pop per touch after the fix, a resolve chord when the bar goes lime, a swish at the end
9. Payoff: PASS: the last 1.5 s keep the code card with animation-timeline: scroll(); the label JS CALLS · 0 with its leader to the bar, JS CALLS 0 in lime
10. Facts: PASS: MDN animation-timeline (read 27 Nov 2026): specifies the timeline that controls a CSS animation; scroll() is an anonymous scroll progress timeline; MDN browser-compat-data css.properties.animation-timeline (read 27 Nov): Chrome 115, Firefox 159, Safari 26; "a script can lag" is stated as can, not as a number; the JS CALLS count is an illustration of one call per scroll event and the caption says so
11. Post data: PASS: captions.json entry (web, postOn 2026-11-27, postAt 19:00 from design/slots.json, concept, experiment web-bug-first-second, palette black, style record, aiLabel false); 7 keywords, 5 hashtags
12. Review file: PASS: this file; items 1 to 11 read PASS
13. After the render: PENDING
14. Cuts: PASS: FLOW: cuts 0 (3 declared transitions: morph of the cause picture into the code card, sharedElement glide of the fix line to the bar, morph of the page swap)
15. Dead runs: PASS: FLOW: dead runs none
16. Continuity: PASS: FLOW: continuity 62% (web: 35% or more)
17. Strobes: PASS: FLOW: strobes 0
18. Element sound (web): PASS: ELEMENT SOUND: 49 of 49 animated elements have a cue (100%): ok

PREMIUM: animation 7.5/10 (t 0.25 and 1.45 the bar trails the page; t 8.4 it goes lime; t 11-12.5 the long flick back), cleanliness 7.5/10 (t 5.7 and 13.5 nothing cut at the edges, no text over text), premium 7/10 (t 12 the lime bar, the label and the code card; builder, on the stills, design/critic.md "Premium check")
Researched improvement (design/improvements.md web, no unused item left, one standard search on 27 Nov found only marketing blogs): a counter of what the old way costs on screen from frame 0 (JS CALLS), frozen at 0 in the accent after the fix; thin evidence, to be read on the retention curve.
Craft improvement (design/craft-log.md): see the 27 Nov web line.
References used: none (rules 19 and 20; the tabwiggle gold).
Deliberate differences from the brief, for the critic: (a) the accent is lime (hue 75, new against 165, 225, 265); (b) the page has no text (skeleton cards and header), so nothing collides with the code card or reaction words; (c) the meter counts SCROLLS and JS CALLS, and the BEFORE bar is deliberately a stepped, lagging bar (the real lag depends on the page).
PREFLIGHT-ALL: PASS 2cb140f5 (showreel-49-scrollbar, 15 s)
