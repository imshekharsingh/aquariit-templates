# Craft log

One craft improvement per day per channel (the Mandatory Gate's daily musts, design/mandatory.md; owner, 7 Nov 2026): a measurable step up
in motion, look or sound against that channel's last reel. One line each, in the same push as the reel: `- DD Mon, channel: what changed (the number)`.

- 7 Nov, all: the Mandatory Gate: safe zone, overlap, subtitle band, hook and subtitle size checked by script on every reel (scripts/showreel/layout.mjs); the loudness gate fails a render outside -14 LUFS ±1 or above -1 dBTP.
- 7 Nov, all: FLOW gate (Mandatory Gate items 14-17, scripts/showreel/flow.mjs): cuts, dead runs, continuity and strobes on a 0.1 s scan for every channel (best web reel 95%, flash 65% → 94% after its flow pass, Liberty 100%); web motion kit + starter (scripts/explainer/kitmotion.js, newweb.mjs): the demo passes every gate line at 95% continuity with 3 declared transitions.
