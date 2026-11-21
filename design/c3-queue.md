# Turns Out design series: build queue (owner, 21 Nov 2026: "add 10 more to Turns Out upload section, I'll decide upload time")

Ten reels in the format of design/c3-plan.md section 0 and design/rules-c3.md D1-D4, built from scripts/channel3/design (copy the closest
existing scene: spacing.js, expensive.js, myth.js, fixit.js; build.mjs COPIES; a scripts/channel3/<name>.json like menu-spacing.json).
Each lands in captions.json with "channel": "c3", "engine": "design", "onGo": true (no date; the owner picks the upload time).

**Lessons from the first five (read before each build; design/owner-feedback.md 21 Nov lines):**
- The flaw must be OBVIOUS at phone size in 1 s (the optical-centre reel failed: "it looks centred"). Test the frame-0 still first.
- Nothing idle on screen: every visible element takes part (the 5x-pricier label B "feels useless").
- Fill the frame by growing the subject; design-tool rulers (.rul) on both sides are part of the look.
- Sentences of 7+ words must read under 4.5 words/s: keep them 6 words or fewer where they come fast; 15-16 s reels, voice ends ~2 s
  before the end; numbers on screen never run ahead of the voice (end states as words, no rolling counts that pass a spoken number).
- No false claims ("you asked us"), no statistics without a source, invented names only.
- Before the render: stills (OVERLAP none, SAFE ok, TEXT FIT ok), flow (dead none, continuity 85%+), align, preflight, and the local copy
  of Output QA FILL / GRADE (scratch emulator: frames every 0.5 s, fill_share on 135x240 grey, zone y 20-66%, busy >= 6, line 25%).

| # | Name | Stage | Claim (frame 0, 6 words max) | Voice (about 40 words) | Fixes on screen | Sources |
|---|---|---|---|---|---|---|
| 1 | showreel-c3-text-on-photo | a gig poster on a lamp post at night | Nobody can read this poster. | Nobody can read this poster. The photo is too busy. Turns out, text needs calm behind it. Fix one: darken the photo. Fix two: put the words on a solid band. Fix three: one colour for the text. Now it reads from across the street. | busy photo (code-drawn crowd + lights) under white thin text; a dark gradient slides in; a solid band drops behind the title; the text turns one bold colour | WebAIM "Contrast and Color Accessibility" (webaim.org/articles/contrast/); W3C WCAG 2.2 "Contrast (Minimum)" (w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) |
| 2 | showreel-c3-grey-text | a cafe's specials board on a counter | Grey on beige. Nobody can read. | Grey on beige looks soft. Turns out, nobody can read it. Text needs contrast. Fix one: darken the words. Fix two: make the board lighter. Check it: four and a half to one. Same board, now readable. | a contrast meter chip reading FAIL then PASS (as words, no rolling numbers past the voice); the text darkens, the board lightens | WebAIM contrast checker article; WCAG 2.2 contrast minimum (4.5:1) |
| 3 | showreel-c3-line-length | a blog page on a laptop on a desk | Your eyes get lost here. | Your eyes get lost here. Every line is too long. Turns out, short lines read faster. Fix one: narrow the column. Fix two: about ten words a line. Fix three: more space between lines. Now it reads like a book. | a wall of full-width text, an eye path that loses its line; the column narrows with a drag handle; a ruler marks the width | Butterick "Line length" (practicaltypography.com/line-length.html); Butterick "Line spacing" (practicaltypography.com/line-spacing.html) |
| 4 | showreel-c3-all-caps | a shop's sale flyer taped to a glass door | STOP WRITING IN ALL CAPS. | Stop writing in all caps. It feels loud, and it's slow to read. Turns out, we read word shapes. Fix one: sentence case. Fix two: caps only for one short label. Fix three: add a little letter spacing. Calm, and easy to read. | a paragraph of caps; word-shape outlines (boxes over words) flat in caps, bumpy in lower case; caps kept for one short label with spacing | Butterick "All caps" (practicaltypography.com/all-caps.html); Butterick "Letterspacing" |
| 5 | showreel-c3-tap-targets | a phone on a cafe table (an invented booking app) | Your thumb keeps missing this. | Your thumb keeps missing this button. It's tiny. Turns out, a thumb needs room. Fix one: make it bigger. Fix two: space between buttons. Fix three: put it where the thumb rests. One tap, every time. | a thumb (simple drawn shape) misses a small button twice (red ripple); the button grows to a full-width bar; gaps open; it slides to the bottom | NN/g "Touch Targets on Touchscreens" (nngroup.com/articles/touch-target-size/); Apple Human Interface Guidelines, "Accessibility" (44 pt minimum) |
| 6 | showreel-c3-resume | a CV on a desk next to a coffee cup | Everything is bold. Nothing stands out. | Everything on this CV is bold. So nothing stands out. Turns out, the eye needs an order. Fix one: the name, biggest. Fix two: headings, one size down. Fix three: details plain. Now it reads top to bottom. | a CV with every line bold and same size; three sizes snap in; read-order badges 1-2-3 | NN/g "Visual Hierarchy in UX" (nngroup.com/articles/visual-hierarchy-ux-definition/); Butterick "Resumes" (practicaltypography.com/resumes.html) |
| 7 | showreel-c3-event-poster | a community notice board | When is this event? | When is this event? You can't tell. The date is lost. Turns out, things that belong together should sit together. Fix one: date and time in one block. Fix two: place under it. Fix three: space between groups. Found it in a second. | a poster with date, time and place scattered; a search beam hunting; items fly into one block; group gaps open | NN/g "Proximity Principle in Visual Design" (nngroup.com/articles/gestalt-proximity/); NN/g "Visual Hierarchy in UX" |
| 8 | showreel-c3-price-list | a salon's price list on a wall | These prices are hard to compare. | These prices are hard to compare. They jump around. Turns out, numbers should line up. Fix one: prices on one right edge. Fix two: same-width digits. Fix three: dotted leaders to the name. Now you see the cheapest at once. | a centred price list with ragged prices; prices slide to one right edge; leaders draw in; the eye compares straight down | Butterick "Tables" (practicaltypography.com/tables.html); Butterick "Alternate figures" (practicaltypography.com/alternate-figures.html) |
| 9 | showreel-c3-card-margins | a business card on a wooden desk | This card feels cheap. Why? | This business card feels cheap. Why? Everything touches the edges. Turns out, margins make it calm. Fix one: pull everything in. Fix two: fewer lines. Fix three: one strong corner. Same card, now it feels premium. | text crammed to the card's edges; margin guides appear; content pulls in; lines drop out; content anchors to one corner | Butterick "Page margins" (practicaltypography.com/page-margins.html); NN/g "Proximity Principle in Visual Design" |
| 10 | showreel-c3-line-spacing | a recipe card on a kitchen counter | This recipe is a wall of text. | This recipe is a wall of text. The lines are too tight. Turns out, lines need air. Fix one: more space between lines. Fix two: space between steps. Fix three: number each step. Easy to cook from. | cramped lines; leading opens line by line; steps separate; numbers pop in | Butterick "Line spacing" (practicaltypography.com/line-spacing.html); Butterick "Space between paragraphs" (practicaltypography.com/space-between-paragraphs.html) |

Captions follow the café reel: line 1 = the claim, then the three fixes as a numbered list with one reason each, "Save this for your next
<thing>." and one question; 6 keywords, 5 hashtags (#designtips #graphicdesign #typography + 2 topic tags); the 2 sources (Copy as comment).
Check every source page on the build day (WebFetch) and drop any claim it does not support.

Order: 1, 5, 6, 3, 7, 4, 10, 2, 8, 9 (strongest visual flaw first). Max 2 renders each; a reel that fails twice is reported, not re-rendered.

**Build notes (21 Nov 2026, build session):** the four source hosts are blocked from sessions; every page is read in the Sources workflow
(design/c3-queue-sources.json, run 44949452447). #5 tap-targets: fix three is now "the main one, biggest" (NN/g: primary actions deserve a
larger target; the Apple page has no readable text and "where the thumb rests" is not in the fetched sources); second source WCAG 2.5.8.
#6 resume: second source Butterick "Bold or italic" ("if everything is emphasized, then nothing is emphasized"). Scenes:
design/photo.js (#1), thumb.js (#5), resume.js (#6).
Batch 2: #3 line-length voice says "short lines are easier" (Butterick: more comfortable, not faster); before 90-97 characters a line, after
49-61 (inside 45-90). #4 all-caps: "lowercase words have shapes" and "caps for short labels" (6-word lines). #7 event-poster: "related things
sit together", "date and time together". Scenes: design/measure.js (#3), caps.js (#4), group.js (#7).
Batch 3: #10 line-spacing claim "Nobody can cook from this." (the queue's 7-word first line split); #2 grey-text voice "Grey on beige. Nobody
can read it. ... Fix three: check the ratio. Four and a half to one." (the checker computes the real WCAG ratio and shows FAIL / PASS, the
4.5:1 minimum only as the voice says it); #8 price-list "one right edge", "digits, all one width" (Space Grotesk tabular figures), "dots to each
name". Scenes: design/leading.js (#10), contrast.js (#2), prices.js (#8).
Batch 4: #9 card-margins (design/card.js); the card's lines start 12 px from its edges (closer fails the safe zone under the camera push).
