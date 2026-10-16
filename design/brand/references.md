# Premium references (owner, 16 Oct 2026)

The owner's bar for "premium". Two screen recordings of other accounts' reels, studied for technique only (never copied, never posted, the videos are not
kept in the repo). Every new reel is compared with these at matching moments before the owner sees it.

## R1 · "Mochi, mascot — designed & animated in code" (dark, one character; ~8.7K likes, ~2.4K shares)
What is on screen: one soft 3D blob character, centred, on a near-black ground. In ~8 s it changes mood every second or so: smile with a green
status dot → sparkles → heart eyes with blush and floating hearts → wink and the light turns grey → plain eyes → particles swirl round it while
two little hands pop out → it turns lavender with a "typing" bubble. A small title and one-line subtitle under it, an arrow, nothing else.

Why it reads as premium:
- **One subject, fully rendered.** Most of the frame is empty dark, yet nothing feels missing: the subject carries all the detail. Our "fill the frame"
  rule is wrong for this look; what matters is that the hero is rich, not that the frame is busy.
- **Soft 3D from shading, not 3D software.** A rounded shape with a top-left highlight, a gentle inner gradient (subsurface feel), a soft contact
  shadow under it and a faint coloured halo behind. All drawable in our engine.
- **Character and emotion.** It does something human every beat (blink, blush, hearts, wink). Viewers watch to see the next expression.
- **Colour follows the emotion.** The halo and body tint change per beat (mint → neutral grey → lavender), so the colour change itself is a cut.
- **Physical motion.** Squash and stretch, springs that overshoot a little and settle, particles with depth (sizes and speeds vary).
- **Almost no text.** Title + subtitle in small clean type. The picture tells the story.
- **"Made in code" is the hook** for a builder audience: it proves skill.

## R2 · "Websites in 2026 😮‍💨" (phone filming a desktop screen; ~45K likes, ~12.5K shares; CTA "Comment UPGRADE")
What is on screen: a phone camera pointed at a real iMac on a desk (keyboard, hand on the mouse, a window behind). The screen flips through
immersive 3D websites every ~0.7 s: a misty mountain flythrough, a plane through clouds, the Earth from orbit, a glossy device with a blue ring,
a hand holding a product, an isometric 3D logistics world with trains, ships and cranes, then the mountain again. One line of hook text in a black box.

Why it works:
- **Real-world framing = trust.** It looks filmed, not generated. The desk and the hand make the websites feel real and attainable.
- **The wow is the websites themselves.** Each is a full 3D/WebGL scene with depth, fog, light and motion. The reel only has to show them.
- **Fast rhythm.** A new world every ~0.7 s; the eye never settles, so people rewatch.
- **One hook line, no voice needed.** "Websites in 2026" + emoji sets the frame; the CTA lives in the caption ("Comment UPGRADE").
- **Shares come from envy:** "send this to someone whose site is old".

## R3 · "Opus 5.5 absolutely cooked" (scroll through one AI-built SaaS site; ~9.3K likes, ~5.7K shares, ~12K saves)
What is on screen: a full-screen recording of one dark landing page ("Relay") scrolling top to bottom, with one hook line pinned above it.
The page: near-black ground, a single lime accent; a glowing silk-light ribbon (flowing luminous lines, lime into teal) sweeping behind the hero;
headline mixing a clean sans with an italic serif ("The handoffs run *themselves*."); dark glass panels with a small workflow diagram; a lime
rounded-square card; isometric 3D bars; big stat numbers ("60,166"); three pricing cards; a lime CTA card at the end.

Why it works:
- **The site is the show.** No camera, no character: a page this polished, scrolled smoothly, is the whole reel. Saves are high (people keep it as a reference).
- **One light effect carries the mood.** The silk ribbon gives depth and motion to every section without clutter.
- **Editorial type.** Sans + italic serif in one headline reads expensive.
- **Strict palette.** Near-black, white, one lime. Close to our own navy/white/lime kit.
- **Hook is about the maker**, not the business: the skill on show is the reason to follow.

For us: **we can make this ourselves without any filming.** Our renderer can scroll our own template full-frame. What it needs is a template built to
this bar (silk-light WebGL or canvas hero, editorial type pairing, glass panels, 3D bars, big numbers), then the reel is the scroll + one hook line +
our end card. Added as theme D `sitescroll` (design/themes.md).

## R4 · "Noway! Claude did this" (creator how-to over screen recordings; ~78K likes)
What is on screen: the result first (a product site with a glossy 3D bottle hero on a laptop), then a fast how-to told over screen recordings: an install
page, an animation library site, a terminal command, a UI skill, a "Black Hole Hero Section" prompt copied and pasted, and the finished surreal 3D-arch
website. Word-by-word captions in Hinglish ("daal do", "bolo usko", "10 minute") over the creator's face at the bottom.

Why it works:
- **Result first, then the method.** The wow is shown in second 0; the rest explains how, so people stay to learn and save it.
- **Cheap to make.** It is mostly screen recordings plus captions; the creator's voice and face carry it.
- **Word-by-word captions in the audience's own language**, big and centred: easy to follow muted.
- **The promise is speed and access** ("10 minute"): the viewer imagines doing it.

For us: a **demo** format (result first, then "what this becomes as a website" or "how we built it"), made from recordings of our own animated pages
plus captions, much lighter than a directed film. Lesson from our own numbers: plain screen recordings averaged 2.5-4.6 s watch time, so the packaging
(result-first hook, word captions, a fast rhythm, a real wow piece) is what makes it work, not the recording itself.

## The gap (honest, 16 Oct 2026)
We are not close yet. Our reels are collages of flat UI cards and captions; the references show either **one rich, lit subject** (R1) or **real
footage of 3D worlds** (R2). Specifically we lack: soft 3D shading and lighting, character or emotion, colour that moves with the story, real
footage, and 3D website heroes worth filming. We also use too much text.

## What we take from them (added as themes, never replacing the current look)
1. **R1 look in our engine (achievable, 1-2 weeks of gradual upgrades):** a soft-3D shading part (highlight, inner gradient, contact shadow,
   halo), spring/squash motion presets, depth particles, mood colour per beat. Fewer elements, richer hero. Text kept to a title and a line.
2. **R2 format (needs the owner, cheap):** film one of our own templates on a real screen with the phone (10-15 s), and we add the hook line and
   the end card. For this to wow, templates need a 3D hero (WebGL scene: terrain, globe, product) — a template-side upgrade, not a reel one.
3. **Each reference is a theme, not a replacement** (owner, 16 Oct 2026; design/themes.md). R1 = theme B `soft3d`, R2 = theme C `footage`; our current
   look stays theme A `collage`. The gate checks per theme: "fullness" keeps judging collage reels and does not apply to soft3d, which gets its own
   "subject" check instead. Nothing that works today is removed (themes.md Rule 1).
