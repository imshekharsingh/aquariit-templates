# Review: showreel-tech-storage-gap (tech, postOn 2026-11-25 postAt 13:00 IST)

The Mandatory Gate, design/mandatory.md. Built 24 Nov evening by the builder session started by the owner chat (size L, approved; the owner wants to see it tonight). Built on the ai-memory scene (the one tech reel the owner likes): techkit/scenes/storage-gap.html, topic techreel/topics/storage-gap.json. Direction card: review/tech/showreel-tech-storage-gap.direction.md (STILLS CHECK: APPROVED by a separate Opus session). Stills next to ai-memory's: review/tech/storage-gap-stills-vs-ai-memory.png.
AUTO lines from `KIT_Q=0.25 python3 techkit/make.py storage-gap --fake-vo --stills 0,4,10.5,15,19,22,25.5,29` (fake timings; the render re-times every shot and word to the real voice).
Why this reel: the owner's 24 Nov complaints (one subject for the whole reel, flat grey, nothing premium); new topic on ai-memory's look: a 256 GB box that shows 238. Format xray, device phone, global.

1. Topic: PASS: a stranger buying a phone feels it at once (the number on the box is not the number they see); the surprise is that nothing is missing (units, not scarcity); one useful rule: take about 7% off the box number; not covered on any channel; tech-direction.md sections 1-4 pass (ink ground, white + cyan + amber only, one bold word or number per shot, hero phone with materials, 7 shots); F3 pass (Apple named as text only for a fact, no logo, a generic phone), F4 pass (verdict said in the last line and shown: "7%").
2. Frame 0: PASS: a chip is already in the air over the phone's board under a huge "256 GB"; the phone spans about 80% of the width (window.__subject)
3. Safe zone: PASS: SAFE ZONE: ok (every caption and every bold word every 0.5 s; NOTHING, SOFTWARE and SYSTEM were narrowed after the first run flagged them)
4. No overlap: PASS: OVERLAP: none
5. Motion: PASS: something moves in every shot (chips tearing out, the tile wave, 18 tiles squeezed out, three phones with rolling numbers, the laser, the Storage bar filling, the turn); FLOW dead runs none
6. Subtitles: PASS: SUBTITLES: at least 52 px, at most 6 words a line; CAPTIONS: 15 chunks, every spoken word shown
7. Voice: PASS: PREFLIGHT voice: 379 letters, about 31.5 s at speed 1.00 (limit 32.0): fits; PRONUNCIATION: 9 overrides used (the numbers and 1.07), no unchecked words
8. Sound: PASS (by design; measured on the render at item 13): impacts on 256 / 238 / BIGGER / 931 / 69, pops on 119 and 477, whooshes on every shot change, a riser that crests on the last words; SOUND DETAIL is checked by the render
9. Payoff: PASS: the phone turns from its Storage screen to its x-ray back, its eight chips light one by one, "7%" lands on "seven percent" and the frame settles on "256 GB" over the opening framing (the loop)
10. Facts: PASS: read 24 Nov 2026 on Apple Support https://support.apple.com/en-in/102119 (published 21 May 2024): "1 GB = 1 billion bytes and 1 TB = 1 trillion bytes; actual formatted capacity less"; binary "1 GB = 1,073,741,824 bytes"; "Some apps and operating systems, such as iOS 10 and earlier, report storage capacity using the binary system"; "Additional storage space is used by factors such as the device's operating system". Arithmetic: 128e9 / 1,073,741,824 = 119.2; 256e9 = 238.4; 512e9 = 476.8; 1e12 = 931.3; gaps 8.8 / 17.6 / 35.2 / 68.7 GB; 6.9% is "about seven percent"; cited in post.sources
11. Post data: PASS: captions.json entry (channel tech, postOn 2026-11-25, postAt 13:00 IST, format xray, device phone, concept, experiment); 7 keywords, 5 hashtags; the caption asks "Which size is yours?" and names who to send it to
12. Review file: PASS: this file, items 1-11 and 14-17 PASS
13. After the render: PENDING: render, Output QA and the critic come next
14. Cuts: PASS: FLOW: cuts 0 (11 declared transitions: 6 shot changes of five kinds, 4 jolts, the phone's turn)
15. Dead runs: PASS: FLOW: dead runs none
16. Continuity: PASS: FLOW: continuity 76% (median step 1.7, 11 declared transitions)
17. Strobes: PASS: FLOW: strobes 0

Researched improvement (design/improvements.md): the owner's 24 Nov reference ("1,000 safe choices, one boring video"): every beat has a written choice in the direction card, checked by a separate session before the render.
Craft improvement (design/craft-log.md): one instanced grid (256 tiles, one draw call for the bodies and one for their glow) re-measured by a single parameter, with the removed tiles flown out by the same function: the picture is the explanation.
Skills: hyperframes and frontend-design guidance applied by the card (one bold word per beat, the empty top band, the object low and large); the stills were compared with ai-memory's at the same relative times.
