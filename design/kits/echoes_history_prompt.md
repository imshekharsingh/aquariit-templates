# Prompt: "ECHOES · True Stories" — Vertical History Shorts (archival + illustrated hybrid)

> Paste everything below the line into a new Claude Code session and fill in **INPUTS**.
> Strongly recommended: upload `echoes_kit.zip` (the working engine, scenes, sound design, image fetcher,
> fonts and reference images from the first two episodes) and say "use echoes_kit as the starting point".
> The environment must allow the domains in §3.

---

You are producing a **9:16 short-form documentary video** for the series **ECHOES · True Stories**: a true story
linking a **person** and a **monument** from world history. It is narrated, with an original cinematic score,
sound effects synced to on-screen events and word-synced captions. The visual style is a **hybrid**: **real
public-domain archival imagery** (paintings, early photographs, prints) for people and real places, plus
**hand-built illustrated scenes** (maps, blueprints, documents, symbolic interiors, diagrams) that explain.
Work autonomously end-to-end. Ask only if an input is missing and can't be defaulted.

## INPUTS
- **Story:** [person + monument, e.g. "Shah Jahan & the Taj Mahal", "Gustave Eiffel & the Eiffel Tower"]
- **The twist / payoff fact:** [optional; otherwise find one during research]
- **Length:** [45–50 s default; 30–35 s if "tight cut"]
- **Narrator:** [Kokoro `bm_george`, speed 0.98, lang en-gb; alternatives `bm_fable`, `bm_lewis`, `am_onyx`, `bf_emma`, `af_heart`]
- **Series line on end card:** ["TRUE STORIES · CARVED IN STONE" / episode title in italic / "FOLLOW FOR THE NEXT STORY"]

## 1. Deliverable spec
- 1080×1920, 30 fps, H.264 High@4.2 yuv420p CRF 17 GOP 60, AAC 192k 48 kHz, `+faststart`;
  saved to `/home/user/history_samples/echoes_<ep>.mp4` and sent with the file-send tool.
- Also deliver `CREDITS.txt`: every image with its title, license, artist and source URL.
- Safe zones: keep key content out of y < 140 and y > 1536, and out of the right edge x > 960 between y 900–1500.
- Audio: about −16 LUFS integrated, true peak −1 dBTP, **voice ≥ 12 dB above the background** during speech.

## 2. Story & accuracy rules (non-negotiable)
- **7 narration lines**, each ≤ 22 words:
  1. Hook / inciting fact with a date ("In 1631, an emperor lost the woman he loved.")
  2. The human moment (loss, protest, ambition)
  3. The making of the monument, with 1–2 hard numbers ("Twenty thousand artisans. Twenty-two years.")
  4. The turn (betrayal, threat, deadline) with a date
  5. The consequence, or what was used to save it
  6. The payoff / little-known fact (the "secret")
  7. `"Echoes. True stories, carved in stone."` (fixed series outro)
- Fact-check every claim against at least 2 reliable sources (Wikipedia + its citations, museum and
  UNESCO pages, Wikidata). Write the sources into `CREDITS.txt`/notes.
- **Legends must be framed as legends** ("Legend says…"). Use round numbers that sources agree on
  (18,038 parts; 2.5 million rivets; "about 20,000 artisans").
- Never fabricate an archival artifact. If you recreate a document (e.g. the *Le Temps* page), real elements
  (masthead, date, headline, quote, names) must be accurate, and you must tell me that body text is a
  placeholder. Illustrations are clearly stylised, never fake photos.
- On-screen numbers must be real facts; dates in typewriter stamps must be correct (check weekday names).

## 3. Network & sources (lessons from the first run)
Domains that must be allowed (Environment → Edit → Network access → Allowed domains, package managers ticked):
`commons.wikimedia.org`, `upload.wikimedia.org`, `en.wikipedia.org`, `www.wikidata.org`, `www.loc.gov`,
`tile.loc.gov`; optional `api.artic.edu`, `www.artic.edu`, `openaccess-api.clevelandart.org`,
`openaccess-cdn.clevelandart.org`, `collectionapi.metmuseum.org`, `images.metmuseum.org`.

What actually happened, and how to handle it:
- **Wikimedia rate-limits shared cloud egress hard (HTTP 429)**, even on the first calls. Rules:
  - Always send a descriptive User-Agent, e.g. `EchoesHistoryShorts/0.1 (educational video research; https://claude.ai)`.
  - Use **curl via subprocess** (Python urllib got 429s where curl worked) and pace requests **4–25 s apart**, with backoff.
  - **Save results after every request**, so a 429 never throws away work already done.
  - Prefer the **REST endpoints** (`/api/rest_v1/page/media-list/<Article>`, `/page/summary/<Article>`) to discover
    the images on the relevant articles (person, monument, construction, photographer).
  - Then make **one batched** `action=query&prop=imageinfo&iiprop=url|size|extmetadata` call (≤ 50 titles,
    URL-encode the `|`) to read `LicenseShortName`, Artist and Date.
  - Download from `upload.wikimedia.org` using the md5 path: `h=md5(name)`, `.../commons/{h[0]}/{h[:2]}/{name}`.
    Thumbnails **must use standard widths** (e.g. `1920px-`; a non-standard size like `1800px` returns 400).
  - Some files may never download (two didn't in run 1). Always define a fallback image per shot (`"img": "a|b"`).
- **Library of Congress is fast and reliable:** `https://www.loc.gov/photos/?q=<query>&fo=json&c=40&dates=1880/1920`
  → `results[].image_url` (take the last, ~1024 px `v.jpg` on `tile.loc.gov`). Bain News Service = "No known
  restrictions"; 19th-century photos = public domain. That's where the 1914 "Guard at Eiffel Tower — Wireless
  Station" and the 1889 night photo came from.
- The Met API returned **410** from this environment; don't depend on it.
- **License policy:** use Public domain / CC0 / "No known restrictions" freely. CC BY is allowed only with an
  on-screen credit plus a credit in the description. Never use CC BY-SA or NC, or anything unverified.
  Record everything in `images/manifest.json` (src, w, h, title, credit, license, artist, page, mono).
- Fonts via npm (allowed): `npm pack @fontsource/cinzel @fontsource/cormorant-garamond @fontsource/special-elite`
  → load the `files/*latin-*.woff2` through `@font-face` from local paths.
- Voice: Kokoro ONNX from GitHub releases (Hugging Face was blocked):
  `.../thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/{kokoro-v1.0.onnx,voices-v1.0.bin}`;
  `pip install --break-system-packages kokoro-onnx soundfile scipy`. Output is 24 kHz; resample to 48 kHz.
- Tools: Node 22 + global Playwright (`NODE_PATH=/opt/node22/lib/node_modules`), Chromium at `/opt/pw-browsers`
  (never `playwright install`), ffmpeg. Don't `rm` globs after `cd` (the safety check blocks it); use absolute paths.

## 4. Look & feel (ECHOES design system)
- **Palette:** night ink #04060c to warm umber #120c07 backgrounds; gold #d9b866 / #e8c46a accents; parchment
  #efe2c2; ink #2e1f0e / #3a2814; seal red #b3241a / #e2483a; blueprint #0d2a4a with lines #e8f3ff.
- **Type:** Cinzel (series badge, labels, numbers, name cards; letter-spaced .2–.42em), Cormorant Garamond
  (headlines, **captions** 700 at 66px, key words in *gold italic*), Special Elite (typewriter stamps and
  tape labels).
- **Persistent UI:** a row of gold diamond progress markers at y≈110 (one per narration line); badge
  "ECHOES · TRUE STORIES" with a gold rule at y≈150; episode title in italic at y≈222; captions at y≈1440
  (chunks of ≤ 4 words, spoken words full white, not-yet-spoken words 35%, story key words gold italic). On
  parchment shots switch to an **ink theme** (ink-coloured captions with no shadow, red accent).
- **Finish:** film grain (feTurbulence overlay ~11%, re-seeded at 15 fps), flickering dust specks plus an occasional
  vertical scratch, slight projector brightness flicker, warm light leak, vignette, and top/bottom
  shading bands for legibility. Fade in from and out to black.
- **Archival shot types** (the engine builds them from `episodes.py`):
  - `framed`: a painting or portrait in a gold hairline museum frame (max 820×860, centred at y 820), over a
    blurred, darkened, sepia copy of the same image; museum caption plate under the frame (italic title +
    Cinzel credit). Slow Ken Burns (scale 1.02→1.12), rise-in on entry, optional typewriter date stamp.
  - `full`: full-bleed photo (object-fit cover), Ken Burns 1.04→1.16, **"develop" entry** (brightness 2.2→1,
    blur 6→0 over 1.1 s), sepia for monochrome photos, a small credit plate at bottom-right above the captions,
    optional radio-wave rings overlay.
  - `stack`: photo cards (cream border, typewriter date label) slamming in on specific spoken words with
    rotation, with counters underneath (e.g. 18,038 iron parts / 2,500,000 rivets).
  - Illustrated scenes can embed archival photos (e.g. the palace-window view shows the real 1860s photo
    with a dusk tint; the crypt plan view sits over the darkened real crypt postcard).
- **Illustrated scene library** (inline SVG + DOM, all code-drawn):
  - moonlit monument silhouette with water reflection (feTurbulence ripple), mist and cypresses — keep the moon **beside** the dome, not behind it (behind it reads as an eclipse)
  - candle-lit interior with a Mughal arch window, flicker and smoke, plus a gold name **cartouche** (name, title, life dates)
  - parchment map: grid, inked rivers, mountains, a dotted route drawing itself with a pen nib, a wax seal stamp with the year, compass rose, burnt edges, title cartouche "HINDUSTAN · ANNO MDCXXXI"
  - blueprint: the monument elevation drawing itself stroke by stroke, construction geometry, dimension line ("HEIGHT · 73 M"), big Cinzel counters
  - view through a cusped palace window with jali lattice panels at dusk
  - symmetry and plan-view diagram ("hers" centred, "his" off-axis, highlighted)
  - period newspaper page (masthead, date, headline, real quote circled in red ink, signatories)
  - year **odometer** (1889→1909) with a dashed red outline on the monument and a red "PERMIT EXPIRES" stamp
  - night skyline with radio waves from the tower tip, Morse tape and an "INTERCEPTED · 1914" stamp
  - end card: ornament draws on, gold-gradient "ECHOES" wordmark (sharpens from blur), series line, episode title, follow line
- Reusable monument geometry lives in JS (Taj front elevation built from arches, onion dome, chhatris and
  minarets; Eiffel outline with platforms and a lattice generator). Add new monuments the same way: a list
  of SVG paths drawable as a silhouette, a marble fill or a blueprint stroke (`pathLength=1` dash draw).

## 5. Architecture (proven)
- `episodes.py`: per episode `title, voice, lang, speed, pause_after{line: secs}, keys[], lines[7], shots[]`.
  A shot is `{line, at: "start" | "<word>" | "<word>#n", type: arch|ill|stack|end, img|imgs, mode, stamp,
  develop, waves, n}`. Example: the archival Taj photo cuts in on "years" and is held by `pause_after {2: 1.6}`.
- `build_ep.py <ep>`: TTS per line (cached by hash; trim silence), timeline (lead 0.7 s, gap 0.55 s, tail 2.6 s),
  **per-word timing estimate** (chars + 1.6; pause weights `...` 7, `.?!` 4.5, `,;:` 2.5), shot t0 = word
  time − 0.25 (or line start − 0.35), t1 = next t0 + 0.7 (crossfade). Writes `ep_<ep>.js/json` and `vo_<ep>.wav`.
- `episode_tpl.html`: all scenes + `window.render(T)`, a pure function of time that crossfades the active
  shots (z-index by order, 0.7 s ease) and drives captions, UI and post effects. `mk.sh <ep>` injects
  `images/manifest.js` and `ep_<ep>.js`.
- `sound_h.py <ep>`: score + SFX + mix from the same JSON (see §6).
- `render_ep.sh <ep> 3`: 60 fps PNG capture across 3 Playwright workers → `tmix=frames=2` motion blur → 30 fps
  encode + audio → contact sheet. About 20 min per 48 s episode.

## 6. Sound design (numpy/scipy, original, no licensing)
- **Bed:** detuned string pads (7 harmonics, 5.2 Hz vibrato, low-passed 900–1200 Hz, slow swells) in 4.8 s chord
  cycles, plus a sparse piano motif (inharmonic additive partials) from line 2.
  - Mughal / Indian stories: D phrygian-dominant motif (D Eb F# G…) plus a **tanpura-style drone** (A–D–D–D pluck cycle with jawari-like harmonic shimmer).
  - European stories: A minor melancholic motif.
- **Timpani** on lines 4 and 6 (the turns), with a cymbal swell before each; final pad chord plus a low **gong** under the end card.
- **SFX on cues:** soft air whoosh before every shot; typewriter key clicks under every typed stamp (one per
  character) plus a bell ding; shutter click + swell on full-bleed photos; low thud on framed portraits;
  candle crackle; blueprint pen ticks, then rapid ticks under counters; paper rustle + pen scratch for the
  newspaper circle; clockwork ticks speeding up on the odometer, then a stamp slam + timpani; radio static bed +
  real-cadence Morse beeps (780 Hz) + thud on "INTERCEPTED"; whoosh + slap for each photo card; faint wind
  room tone throughout.
- **Mix:** voice chain (75 Hz high-pass, light 2.5–6 kHz presence, gentle tanh); ducking 55% (30 ms attack / 400 ms
  release); music reverb 3 s / 35% wet, SFX reverb 1.6 s / 20%; gains: music 0.55, ambience 0.6, SFX 0.5, voice 1.0;
  normalise peak to 0.89. **Measure the stems** (voice vs. background RMS during speech); run 1 hit ≈ 13 dB.

## 7. Workflow & quality gates
1. Research + fact-check → write the 7 lines → generate a **voice audition reel** if the narrator isn't fixed.
2. Find and verify the images (§3), write the manifest. Aim for 4–6 archival images per episode, ≥ 800 px where possible.
   Smaller construction photos are fine as framed or card shots.
3. Build the episode → render **12 preview stills at cue times** → tile them into a contact sheet → **look at it**.
   Bugs hit in run 1, check for each one:
   - Overlays hidden behind shots: give the UI and post layers `z-index:100`.
   - `<use>` doesn't override the fill of a referenced `<path>` that has its own fill: keep the referenced path fill-less.
   - Missing `t` clamp in the lattice generator → NaN path errors (watch the console).
   - Framed plates colliding with the captions: keep frames ≤ 860 tall, centred at y 820.
   - Caption legibility on light backgrounds: use the ink theme.
   - Elements overlapping the caption zone (newspaper height, stamps, counters).
   - Images that never arrived: confirm the fallbacks render.
4. Generate the audio, check LUFS, true peak and voice-to-background ratio.
5. Render, encode, `ffprobe`, then a contact sheet of every ~3 s of the final file; confirm captions, stamps and
   credits are visible and on the right words.
6. Deliver the MP4s + `CREDITS.txt` + a short summary: what's archival vs. illustrated, sources, anything
   recreated, which images failed to download, estimated word timings, and that you can't listen to the audio yourself.
   Remind me the cloud storage is temporary.

## 8. Reference episodes (already produced; reuse the patterns)
- **Taj Mahal, "The Prisoner and the Tomb":** Shah Jahan on a globe (framed) + BURHANPUR · 1631 stamp → candle and
  Mumtaz Mahal cartouche (1593–1631) → blueprint draw-on + 20,000 / 22 counters → Samuel Bourne 1860s photo
  (develop) → Shah Jahan & Aurangzeb c.1659 → Aurangzeb enthroned (on "seized") → palace window with the Bourne
  photo ("Legend says…") → 1905 crypt postcard → plan view "hers/his" on "only" → end card.
- **Eiffel Tower, "The Tower Paris Wanted Gone":** *Le Temps* 14 Feb 1887 page, red circle on « l'inutile et
  monstrueuse tour Eiffel » → Nadar 1888 portrait → 4 construction cards (Dec 1887 → Mar 1889) + 18,038 /
  2,500,000 counters → odometer 1889→1909 + PERMIT EXPIRES stamp → 1889 World's Fair print → radio waves
  ("giant radio antenna") → 1914 wireless-station photo (framed, LoC) → INTERCEPTED · 1914 → 1889 night photo
  with radio rings → end card.
