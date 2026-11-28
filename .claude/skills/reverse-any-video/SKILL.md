---
name: reverse-any-video
description: Study a reference video frame by frame and write down its design patterns (timing, cuts, camera, layout, type, transitions, sound) so we can rebuild them in our own kit with our own content. Use when the owner's Inbox has a reference reel, or to "study", "break down", "reverse" or "learn from" a video. Studio use is study only, never a 1:1 copy.
---

> **Studio note (@webin20sec studio, 23 Nov 2026). Read this first.**
> Adapted from heygen-com/hyperframes `skills/reverse-any-video` (Apache-2.0, see LICENSE.txt; source, commit and changes in ../THIRD_PARTY.md).
> Their skill rebuilds a video 1:1 with the HyperFrames CLI, HeyGen re-shoots and their cloud render. We use it as a STUDY tool only (owner, 23 Nov 2026:
> "learn and improve, don't block ourselves from gaining skills"): break a reference into its patterns and rebuild those patterns in OUR kit with
> our own content, brand, colours and copy. Never ship a 1:1 copy, never use its footage, voice, music, copy, art, logo, faces or a near-identical
> look of that one piece (CLAUDE.md "Copyright and safety", design/safety.md). Our render runs only through our GitHub workflows.
> Left out: the CLI-launcher and usage-note lines, the Pro/billing/sign-in flow (references/start.md), HeyGen re-shoots (references/people.md),
> generated shots (references/animated.md), cloud render and diff. Kept: the measuring method and references/match.md (recipes).

# Study a video

The result is a **pattern card** in design/references.md, not a copy. A pattern card names what the reference does, measured, so a builder can
use the grammar on a new topic in our look.

## Measure first (frames, not memory)

Use ffmpeg, python and your own eyes on frames you extract (the reel itself stays out of the repo: it is study material, kept in the scratchpad).

1. The probe: size, fps, length. Note it on the card.
2. Every cut with its time, including jump cuts and punch-ins inside one take (a frame difference over the whole frame; scene scores miss punch-ins).
   Write cuts per minute and the average shot length.
3. Read consecutive frames wherever something changes: each cut, entrance, exit and transition, a few frames either side. Sheets a second apart
   miss 1-3-frame timing, which way things enter and leave, blurs and dissolves at cuts, and one-frame flashes.
4. Every large word through its life: a strip of frames from the frame it appears to the frame it leaves. How it arrives (pop, scale, fade,
   type-on, word by word, wipe), how it changes on screen (a fill sweeping across, a counter, a colour change: direction and duration) and how
   it leaves. Then what the letters are made of: solid, gradient, outline, glow, knockout. Size it as a share of the frame height.
5. Captions: group size (words), when each group switches (from the caption band's pixels), where the band sits.
6. Sound: where the hits land against the picture, music in or out, loudness if you can measure it.

## Action count (owner, 28 Nov 2026: "more actions and elements")
A 1-frame-a-second sheet misses most small actions (a screen typing, a ripple, a badge ticking). Count them, then read them:
1. Measure: the "Owner answers" workflow, action refs-study, ASKS {"ids": [<reference ids>], "reels": ["<our reel>.mp4", "study/<preview>.mp4"], "sheets": true}.
   It runs scripts/qa/action-count.py on each video the same way and prints ACTIONS (new actions a second, in the picture and in total; things
   moving at once; camera share; still share), TIMELINE (actions per second) and GAPS (over 1 s with no new action), plus 2 fps sheets.
   Always measure one of OUR reels in the same run, so the gap is a number.
2. Read: on the sheets, at the busiest seconds of the TIMELINE, name each action: what moves, what kind (enters, leaves, changes inside, reacts,
   counts, camera), how long, and on which object. Write an ACTION LIST: for each kind, how often it happens per 10 s in the reference.
3. Layers: count the elements on screen at once (hero, supporting objects, small detail, type, background life) at 3 moments.
4. The card gets an "Action count" line: reference vs ours (actions a second in the picture, moving at once, longest gap) and the 3-5 action kinds
   we lack, each as a kit piece to build (owner: actions inside objects already on screen are cheap; more camera moves are not).
The count is a guide, not a target to game: captions and camera moves are kept out of "picture" actions on purpose.

## Every layer (what it is, how we would build it)

- **A component** (text, captions, stickers, cards, UI, charts, maps): we rebuild the TECHNIQUE in our kit with our own content.
- **A sub-asset** (a photo, a clip, a logo, a person): never taken. Note only its role ("a real product photo fills the top half") and
  how we would fill that role under our media rules (code-drawn, or a PD/CC0/CC BY file through the "Media" workflow for tech).
- **A person on screen**: note framing and timing only; we never re-shoot or copy anyone.

What decides whether a technique reads right is in `references/match.md`: timing on exact frames, sizing type from its ink, the backdrop,
motion blur, and recipes (sweeping fills, gradient type, outline type, directional blur, ghost trail, masks, flash, grain).

## The pattern card (write it in design/references.md)

```
### R-<date> <short name of the reference> (study, <who sent it / where>)
- Probe: WxH, fps, length; cuts/min; average shot; longest hold.
- Hook (0-1 s): what is on screen, how it moves.
- Timing: each beat with its seconds; holds before the payoff.
- Camera: moves, eases, punch-ins, speeds.
- Layout: zones used (top / hero / captions / lower third), subject size.
- Type: faces (by traits), sizes as % of frame height, entrances and exits, caption group size.
- Transitions: kinds and their causes, durations.
- Sound: bed, hits, where they land.
- Measured vs guessed: mark each guessed line.
- Take for us: 2-4 patterns, each tweaked for our channel (which rulebook rule it meets) with our own content, colours and copy.
- Do not take: the specific footage, copy, art, characters, music, logo, and the look of this one piece as a whole.
```

## Check

A builder who uses a card names it in the reel's review file. The critic checks that the reel uses patterns, not the piece: put one still of
ours next to the reference; a stranger must not take ours for theirs (design/safety.md).
