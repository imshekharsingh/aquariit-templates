# Inspiration log (techniques to turn into film parts)

Fed by a weekly study (a scheduled Claude routine, Sundays) plus anything the owner shares. Each entry: what was seen, the technique in one line, and the part it
could become. Take techniques, never copy a piece, a brand or a layout. When a daily film builds one of these into scripts/film/parts.js, tick it and name the part.

## Backlog of techniques (newest first)
- [ ] **Type that breaks apart and reforms on the beat** (letters split, slide, re-assemble into the next word). 2026 trend lists put kinetic type first because most
  short video is watched muted. Part idea: `P.morphWord(from, to)` (letters fly to new positions). Sources: graphicdesignjunction.com/2026/01/video-and-motion-creative-trends-2026,
  autoae.online/blog/motion-graphics-trends-2026.
- [ ] **Imperfect, handmade texture** (grain, tape strips, cut-paper collage, stamps) as a counter to over-polished AI work. Part idea: `P.collage` (paper cards with torn
  edges and tape that pin onto the frame) and a `ground: 'paper'` option. Source: graphicdesignjunction.com (2026 trends).
- [ ] **Blur reveal** (text sharpens out of a heavy blur while sliding a few px) and **SVG filter text effects** (turbulence wobble, displacement). Part idea: caption style
  `blur`, and `P.wobble(el)` with feTurbulence. Source: tympanus.net/codrops (Playground: blurry text reveal, scroll-based SVG filter animations).
- [ ] **Kinetic-type page transition** (a word fills the frame and becomes the wipe). Part idea: `P.typeWipe(word)`. Source: tympanus.net/codrops (Playground).
- [ ] **3D text and image parallax on scroll** (layers at different depths). Part idea: `P.depthStack` (3-5 flat layers with parallax, no 3D raster tilt on text).
  Source: tympanus.net/codrops (on-scroll horizontal parallax gallery, 3D text scroll animations).
- [ ] **ASCII / dot-matrix shader look** (an image rendered as characters or dots). Part idea: `P.asciiImage(svg)` on a canvas. Source: tympanus.net/codrops (ASCII shader demo).
- [ ] **Reaction-diffusion / organic growth patterns** as a payoff background. Part idea: a precomputed canvas pattern that grows from the centre. Source: tympanus.net/codrops (WebGPU reaction-diffusion).
- [x] Building sentence, pivot words, recurring brand shape, world change at 3/4 (reference study 2, owner's POV reel) → `P.sentence`, `P.shape`.
- [x] One accent on black, material cards, skeleton UI, connector lines with data dots, scan bar, brackets (reference study 1) → `P.scene`, `P.card`, `P.hub`, `P.scan`, `P.brackets`.

## Where to look each week
Codrops (tympanus.net/codrops), web.dev and Chrome developer blog (new CSS: scroll-driven animations, view transitions), CSS-Tricks, Smashing Magazine, Awwwards
sites of the day, motion-design trend round-ups (read critically: many are vendors), and the reels the owner shares. Note the date and the source.
