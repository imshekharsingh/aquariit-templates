# 2.5D tech look vs 3D kit v7: what to borrow (task 22, step 1; 28 Nov 2026)

Compared: the 3D kit v7 (render 4, 28 Nov; and the critic's render 3 verdict), the 27 Nov 2.5D reel showreel-tech-ai-words (critic READY,
PREMIUM 8.0 / 8.0 / 7.5), against the owner's reference (design/references.md "R-ref 27 Nov 2026", the 34 s system map).
Source: the critics' verdicts on both real MP4s, the Output QA lines of v7 render 4, and one contact sheet of each scene captured locally
(this session cannot download the reel MP4s: the app host and GitHub's artifact storage are not open to it). No new render.

| Point | Reference | 2.5D (ai-words) | 3D v7 | Wins | Take from 3D |
|---|---|---|---|---|---|
| Opening | the subject working, under a fixed title | a real chat window streaming the reply, match-cut into card 1 by 3.2 s (STOP 8/10) | Notes slams in; the only Output QA fault left (flicker 0.8 s) | 2.5D | nothing; keep the real-life first frame |
| Explanation clarity | numbered nodes, one lit at a time, a reason for every move | the process's own shape (line, loop, line), step pill, numbered cards | one idea (24 -> 11 cables) shown well, but a long build for one number | 2.5D | the one big countable payoff (v7's 24 -> 11 counter) as a beat type |
| Depth and material | flat vectors, depth by dimming and blur | flat outline cards on a dark grid; light wedges only | real materials (satin plastic, matte metal), a key light, contact shadows on the floor | 3D | soft directional light on cards, a material per card kind, contact shadows |
| Motion | moves less than v7, every move to the next step | 0.45-0.7 s moves, ghosts of the next card | big crane / dolly moves; strobed when fast (renders 2-3) | 2.5D | the slow "settle" of a heavy object landing |
| Shadow-first builds | not used | cards pop in with their outline | the shadow grows before a tile lands (v7 A_IN) | 3D | the two-tier shadow-first build (direction.md "2.5D map reels" note 7) |
| Glitches | none | READY; FLICKER passes | four renders to get near zero; still fails at 0.8 s | 2.5D | nothing |
| Pace | 34 s, calm | 29.6 s, 2.4 words/s | 22.9 s, 2.5 words/s, but busy | 2.5D | nothing |
| Objects people know | icons | icons in outline cards | tactile tiles, a board, a hub: things that feel real | 3D | ONE short object moment per reel about a real thing (a phone, a chip, a card) |

## Decision
2.5D stays the tech look (owner, 27 Nov). It takes four things from 3D, all as opt-in pieces of a new shared 2.5D kit
(scripts/explainer/kitmap.js) so the two existing 2.5D reels render the same:
1. Light and depth on cards: a soft key light from the top left (a gradient sheen and a lit top edge), a darker lower edge, and a two-layer
   shadow under each card that grows with its lift.
2. Materials: three card surfaces (glass, satin, metal) instead of outline-only cards; one per card kind, never more than three in a reel.
3. Two-tier shadow-first builds: tier 1 (cards, nodes, panels) shadow lands first, then the outline traces, the fill and content arrive, a
   small settle (0.3-0.5 s); tier 2 (lines, labels, small icons) a light 0.2 s build with its shadow.
4. One "object moment": a single short shot (about 1.5 s) of a physical object built in CSS 3D (a phone, a chip, a card) under the same key
   light, with a contact shadow and a slow turn that settles, for topics about a real thing. Built in CSS, not three.js, so it stays cheap to
   render and continuous in t (v7's lesson: fast 3D moves strobe).
Not taken: v7's big camera moves, its full-scene 3D world, its slam entrances.
