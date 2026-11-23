# Steering motion: what to say, what changes (and transitions by energy)

> **Studio note (24 Nov 2026).** From heygen-com/hyperframes docs/prompting/motion.mdx (Apache-2.0; commit in ../../THIRD_PARTY.md). Text kept;
> the embedded demo videos, lesson cards and site links were removed. Use it two ways: (1) the critic and the builder name a motion fault in
> these words and apply the listed fix; (2) the seven ideas are the checklist for a kit change. Block names in the transitions table
> (`whip-pan`, `cinematic-zoom`, ...) are their registry; read each as a KIND of change and build it in our kit (rules-tech.md M1,
> rules-web.md, rules-c3.md). Sound on a change, from their sfx notes: a riser crests exactly on the reveal (start it its own length
> earlier); an impact lands on the visual landing and its tail carries over the cut; effects sit under the voice (about a third of its level).

Your agent already follows HyperFrames' motion rules: elements land and hold still, moves overlap, cuts happen mid-motion.
Use this page when you want to steer it: what to say when the motion feels wrong, and the ideas worth asking for by name.

## Fix motion you don't like

Watch the video once, then tell your agent what you see in plain words. These phrasings work:

| What you see | Say | What the agent changes |
| --- | --- | --- |
| Everything moves too fast | "Too fast. Slow the zooms and pans." | Slows every camera move to about 0.7× and leaves the rest alone |
| It drags | "Speed this up." | Shortens each beat along with its content, and moves later beats earlier |
| Titles keep floating or growing after they appear | "Land the titles, then hold them still." | Titles arrive, stop dead, and leave with the scene |
| It feels like slides | "It feels like slides. Carry one thing across each cut." | Enters the next scene through something on screen and cuts mid-move |
| Everything appears at once | "Bring things in one after another, on the voice." | Staggers entrances so each starts before the last has settled |
| It looks bouncy or cheap | "No bounce on text or UI." | Uses long, smooth slow-downs; keeps overshoot for physical objects |
| There's a jump at a cut | "There's a jump at 4.2 s." | Matches positions and speeds on both sides of that cut |
| A scene sits there with nothing happening | "Scene 3 is dead. Give it something to do." | Adds real action: the UI working, footage, the camera travelling to the next thing |

Give a timestamp when you can ("at 4.2 s"). Ask for one change at a time and watch again.

## Ideas worth asking for

Each idea below has a side-by-side film: the same scene built twice, where the only difference is one line of the prompt.
Left is without, right is with.

### Move only what is live

Once something lands, it holds still. What keeps moving is what is actually changing: a live number, a feed, a progress bar.
Don't ask for "subtle breathing" to make a scene feel alive; it reads as generated.

> The panel lands by 1.9 s. After that, only what the feed changes moves: a reading arrives every 300 ms, the last digits change, the sparkline extends one segment, `LAST SYNC` restamps. Nothing else moves.

*Left: the whole panel freezes at 2 s, so it looks like a dead connection. Right: only the readings move, and the rest is still.*

### Move the camera to get somewhere

A camera move earns its place by travelling between things, so the viewer sees they live in one space.
A slow creeping push-in for its own sake does not.

> Lay the five pipeline stages out 640 px apart, wider than the frame, and move the camera across the whole run. A packet runs the wire and lights each stage as it arrives.

*Left: five stages cross-fade in one spot. Right: you travel to each one, and the neighbours stay in view.*

### Overlap, don't queue

The next element starts while the last is still settling. Stagger things that happen in sequence. Things that already existed show up together.

> The rollout spreads outward from `us-east-1`, reaching each region 0.09 s apart in order of distance. Each region's 0.5 s ignite is still running when the next three begin.

*Left: twelve regions light on one frame, so you can't tell where it started. Right: it visibly spreads.*

### One idea per move

Combine properties only when they say the same thing. Rising and fading in says "arriving". Adding a spin and a zoom makes text unreadable mid-flight.

> The confirmation sheet rises 470 px over 1.2 s while fading in. Rotation, scale and blur are never touched.

*Same travel and timing. Left: "Payment confirmed" is a tilted smear. Right: readable the whole way up.*

### Weight for physical objects only

Overshoot says "this has mass". Use it on things that have weight, like flaps, cards and characters. Never use it on text, UI or numbers: a counter that flies past 42 and falls back shows a number that was never true.

> The split-flap plates swing past their rest position and settle; the housing recoils when they land. The gate number never overshoots 42.

### Depth: near things move faster

Far layers move slower than the camera and near ones faster. One blurred foreground object passing in front of the content is the strongest depth cue. A second one is clutter.

> The horizon row moves at a fifth of the room's rate, the racks at full rate, and one near column sweeps past at six times, blurred, crossing in front of the headline.

### Pace to the format

A showreel gives each idea 1–4 seconds; a product demo holds one framing for 7–10 seconds while the UI works. Stretching a 2-second idea to 8 seconds feels slow however well it moves.

> Showreel pace: 1.1 s per beat, cutting hard, all three beats delivered by 3.3 s.

## Handmade, still deterministic

For a stop-motion or hand-animated feel, ask for movement that steps between held positions, with the irregularity coming from a seed.
Every render must give the same frame at the same time, so unseeded randomness is not allowed.

> Paper-cutout shapes on visible wires, like stop-motion. Seed a random offset per element (same seed every render) and hold each position for exactly two frames, quantized on the frame index.

Say "two frames", not "0.067 seconds": a hold measured in seconds drifts into uneven one- and three-frame steps.

## Between scenes: transitions

A good transition is caused by something on screen: the camera zooms through a button into the next screen, a card grows until it becomes the next scene, the background floods a new colour while the subject stays.
Ask for that kind of handoff and the agent builds it. Use 3–5 kinds in a film, each where it fits, and never a dissolve between two unrelated scenes.

To pin a specific effect, name a block from the catalog and the seam it goes on:

> Six-scene SaaS explainer. Use `whip-pan` between related points, and one `cinematic-zoom` into the final pricing reveal. About 0.4 s each.

| Energy | Shader blocks | CSS blocks | Duration |
| --- | --- | --- | --- |
| Calm (wellness, brand story) | `cross-warp-morph`, `light-leak` | `transitions-blur` | 0.5–0.8 s |
| Medium (SaaS, explainer) | `whip-pan`, `cinematic-zoom` | `transitions-push`, `transitions-cover` | 0.3–0.5 s |
| High (promo, music, launch) | `ridged-burn`, `glitch`, `chromatic-radial-split` | `transitions-scale`, `transitions-light` | 0.15–0.3 s |

Shader blocks warp and morph both scenes pixel by pixel; use them when the handoff itself is a moment. CSS blocks are lighter and fit ordinary scene changes.
All of them are in the catalog; a name that isn't there (`page-curl`) leaves the agent guessing.

**Don't ask to fade one scene out and then fade the next one in.** It renders as a jump cut with a dip in the middle. The transition is the exit: ask for "`cross-warp-morph` from scene 1 to scene 2".

## Words for how motion feels

Describe how motion should *feel* and the agent picks the matching GSAP ease:

| Say this    | Agent uses       | Feels like                     |
| ----------- | ---------------- | ------------------------------ |
| smooth      | `power2.out`     | Natural deceleration           |
| snappy      | `power4.out`     | Quick and decisive             |
| bouncy      | `back.out`       | Overshoots then settles        |
| springy     | `elastic.out`    | Oscillates into place          |
| dramatic    | `expo.out`       | Fast start, long glide         |
| dreamy      | `sine.inOut`     | Slow, symmetrical              |

**Timing shorthand:** fast (0.2s) = energy, medium (0.4s) = professional, slow (0.6s) = luxury, very slow (1–2s) = cinematic.
