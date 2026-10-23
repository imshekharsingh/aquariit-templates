# @webin20sec: content plan (owned by Claude; owner handed over 22 Oct 2026)

The owner's brief: design and define the content, keep it relevant, push the premium side as far as it goes. The benchmark is @techin20sec
(made with the free plan, not managed here); the daily audit reads both accounts.

## Where we stand (audit 22 Oct 2026)
- @techin20sec: 108-118 reach on every reel, 3.7-5.8 s average watch, the first shares. One topic per reel, a question with a stake in it.
- @webin20sec: 11-48 reach on most reels; one outlier, "6 motion styles" (18 Oct 14:20 IST): 277 reach, 8 saves. Posts at 22:00-23:30 IST did worst.
- Both: average watch 4-6 s. The first second decides the reel; the rest is for the few who stay (and for saves).

## Goal
1. Beat @techin20sec's median reach per reel (about 110) within two weeks.
2. Then the milestone: 100 followers or one reel at 1,000 reach.

## Position
Premium web motion, built in code, in 20 seconds. Audience: designers, front-end developers and founders who care how a site feels.
Every reel should be something a designer saves for reference or sends to the person building their site.

## Four series (rotate; never the same series twice in a row)
1. **Built in 20 s.** One fictional brand's site builds itself: grid, type, imagery, UI, scroll, a page opening, a pull-back. A timer counts to 20.
   Each one has a different industry and art direction (first: Halden, Swiss modernist, scripts/explainer/built.html).
2. **Six ways.** One element (hero, button, loader, card, menu, text reveal, page transition) in six premium treatments, numbered, full frame.
   The proven saver (277 reach, 8 saves). It must look premium, not like a demo: one art direction holds all six together.
3. **Steal this.** One premium technique shown full frame, then the one to three lines of real CSS/JS that make it, on screen.
   Facts are checked (browser support, specs) and cited on screen.
4. **Material.** Interface rendered as a real object: glass that refracts, metal that reflects, soft shadows, light that moves.
   A WebGL renderer written per reel (first: scripts/explainer/glass.html, liquid glass over a music app). Renders on a software GPU,
   so these run at 30 fps with 4 blur sub-frames.

## Craft bar (every reel)
- Film look on every reel from 22 Oct (owner: "we are missing motion design"): in the config, `"blur": 12, "shutter": 0.45` (real motion blur from 12 sub-frames per frame),
  `"grain": 6`, and `"vignette": true` on dark grounds only (on light grounds it greys the corners). The scene itself still owns camera language: depth layers, dolly and rack focus, light that reacts to motion.
- One art direction: at most five colours, one type family, a real grid. No glows, gradient title cards, floating particles, or everything fading in.
- Frame 0 is already a finished, cover-quality composition, and it is already moving; something completes inside 1.5 s.
- Real interface over illustration; images drawn in code; fictional brands only.
- Motion with intent: springs, masks, variable-font axes, match cuts. Every move has a reason.
- 15-20 s, payoff in the last 3 s, a seamless loop (the last frame leads into the first).
- Text only where it carries the idea; key text clear of Instagram's UI (top 96 px, bottom 22%, the right-hand column).
- Variation (owner, 23 Oct: "where's the variation?"): something big changes at least every ~3 s: the scene, the colour world, the scale
  or the camera. One look held for 17 s is a still with motion, not a reel.

## Self-review before the owner sees anything (owner, 23 Oct: "where's the accountability?")
Claude reviews every draft as a critical creative director before sending it, and does not wait to be asked to improve it.
1. Watch the stills at every beat and the GIF, then answer in writing:
   - Does something big change at least every ~3 s (scene, colour, scale, camera)?
   - Is frame 0 cover-quality and already moving? Would a stranger stop in the first second?
   - Does it use the whole frame? Is key text clear of Instagram's UI?
   - What is the one moment someone would screenshot or send? Is it strong enough, and does it land in the last 3 s?
   - Is it premium (light, material, motion blur, type), or does it read as a demo?
   - Is it clearly different from the last three reels (series, palette, motion, layout)?
   - Does the loop close cleanly?
2. Fix every "no" that is small before sending. Name anything bigger as the next improvement and say whether it was done.
3. Every draft message to the owner includes "Self-review": what was checked, what was changed because of it, and what would still make it better.

## How a reel is made
1. Scene: `scripts/explainer/<slug>.html` exposes `window.seek(t)`; every frame is a pure function of t (seeded randomness only).
2. Config: `scripts/explainer/<slug>.json` (name `showreel-NN-<slug>`, dur, fps 60, cover time, caption, 6 keywords, 5 niche hashtags).
3. Review: stills at each beat and a GIF on a private page for the owner; fix what the stills show (two or three passes).
4. Render on GitHub: Actions, Showreel workflow, config = the json. The MP4 lands in the reels release, the Showreels page and a "Showreel ready" issue.
5. The owner posts at 14:00 IST and adds a trending Instagram audio track.

## Post text
The first caption line holds the search words in plain language. Then one line with the six keywords joined by ` · `, then exactly five niche hashtags.
No call to action and nothing at the end of the reel (owner, 21 Oct); the caption may invite a send.
The owner gets it as one block to copy whole, with no labels (owner, 22 Oct): on the Showreels page (Copy post text), in the Showreel ready issue, and in the chat message.
Keywords and hashtags are chosen for reach: what people type into Instagram search for this kind of reel, the most specific first; no broad tags.

## Measure and decide
- The daily audit records per reel: reach, average watch, saves, shares, and the series it belongs to, next to @techin20sec's numbers.
- After three reels per series, drop or rework the weakest series.
- If reach stays under @techin20sec for a week, test one lever at a time: posting time, the first second (type-first versus picture-first), length (15 s versus 20 s).

## Log
| date | reel | series | notes |
|---|---|---|---|
| 22 Oct | showreel-05-layout-shift | (explainer, owner brief) | 30 s; too slow in the middle; first second barely moved |
| 22 Oct | showreel-07-built-in-20s | Built in 20 s | first of the series; Halden, Swiss modernist |
| 22 Oct | showreel-08-six-transitions | Six ways | Tinta paint studio; each page's circle is the next colour; zoom-through payoff loops to frame 0 |
| 22 Oct | showreel-08-six-transitions v2 | Six ways | 17 s, transition every ~2.5 s, liquid wipe replaces push, motion between transitions, promise on screen from frame 0 |
| 22 Oct | showreel-07-built-film | Built in 20 s | the film-look re-cut replaces the original (motion blur on the word drops, scroll and card open) |
| 23 Oct | showreel-09-liquid-glass v2 | Material | four worlds on the beat (music night, wallet, weather noon, map macro), light and frost per world, payoff = macro lens + drop split |
