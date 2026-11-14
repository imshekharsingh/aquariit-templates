# Prompt: Vertical Tech-Explainer Motion Video (voiceover, music, SFX, synced animation)

> Paste everything below the line into a new Claude Code session. Fill in the **INPUTS** block first.
> Optional but recommended: upload `motion_kit.zip` (scene/audio/render source from the reference
> project) into the working directory and tell Claude to use it as the starting point.

---

You are producing a **short-form vertical (9:16) motion-design explainer video** about one tech concept, with a
**narrated voiceover that explains the concept**, an **original music bed**, **sound effects synced to on-screen
events**, **word-synced kinetic captions**, and **continuous animation flow** across the frame. Output one
ready-to-upload MP4 for Instagram Reels / TikTok / YouTube Shorts. Work autonomously end-to-end; don't stop to ask
unless an input below is missing and can't be defaulted.

## INPUTS (fill in; defaults in brackets)
- **Topic:** [e.g. "How a CDN works" / "Zero Trust" / "WAF" / "DNS" / "TLS handshake"]
- **Audience:** [technical decision-makers + curious engineers; plain language, no jargon without explanation]
- **Target length:** [40–50 s; hard max 58 s]
- **Brand / series line:** [eyebrow text "TECH IN 45 SECONDS"; no company logo unless I provide one]
- **Voice:** [Kokoro `af_heart`, speed 1.05; alternatives `am_michael`, `bf_emma`, `am_fenrir`]
- **Palette:** [dark navy space bg #04060c; primary cyan #3de0ff; violet #7a7cff; success green #4ee28a; warn amber #ffb35c; danger red #ff4d5e; text #eef2f8]
- **Font:** [Inter / Inter Display (check `fc-list`); fall back to any installed sans]
- **CTA end line:** ["SAVE THIS · SHARE IT"]

## 1. Deliverable spec (non-negotiable)
- 1080×1920, 30 fps, H.264 High@4.2, yuv420p, CRF 17, GOP 60, AAC 192 kbps 48 kHz stereo, `+faststart`.
- File saved to the primary working directory (e.g. `/home/user/<topic>_explainer_9x16.mp4`) and sent to me with
  the file-send tool. Scratch work goes in the session scratchpad.
- **Safe zones:** nothing important in the bottom ~20 % (y > 1536) or under the right-side app buttons
  (x > 960 between y 900–1500), or in the top ~140 px. Header starts at y≈150.
- Loudness ≈ −16 LUFS integrated, true peak ≤ −1 dBTP; **voice ≥ 10–12 dB above the background** during speech.
- Every number shown on screen that isn't a real measurement must be described to me as illustrative.

## 2. Pipeline (proven — follow it)
Everything is code-generated, deterministic, and frame-accurate:
1. **Script** → 6–8 short narration lines (one per chapter).
2. **TTS** each line separately with Kokoro (local neural TTS) → trim silence → measure durations.
3. **Timeline builder** (Python) → places lines on a timeline (lead 0.6 s, gap 0.45 s between lines, tail 2.2 s),
   **estimates per-word timings**, defines named **cues** tied to specific spoken words, writes
   `timeline.json` + `timeline.js` (`window.TL = {...}`) + `vo_full.wav`.
4. **Scene** = one HTML file (1080×1920) with a `<canvas>` for the main graphic + DOM overlays, exposing a pure
   `window.render(t)` that sets **everything** from time `t` (no CSS transitions/animations, no `requestAnimationFrame`,
   no `Date.now`, all randomness from a seeded PRNG).
5. **Capture**: headless Chromium via Playwright calls `render(i/60)` then screenshots PNG per frame, **60 fps**,
   split across 4 parallel worker processes.
6. **Sound design** (Python numpy/scipy) reads the **same cues** → synthesizes music + SFX → ducks under voice →
   mixes with voice → `mix.wav`.
7. **Encode**: ffmpeg blends frame pairs for motion blur (`tmix=frames=2`, then `fps=30`) and muxes audio.
8. **Verify** (see §9) before delivering.

## 3. Environment setup & known pitfalls (from the reference run)
- Tools present in the reference container: `ffmpeg` (has `flite`, but it sounds robotic — don't use for VO),
  Node 22 with **global Playwright** (`NODE_PATH=/opt/node22/lib/node_modules`), Chromium at `/opt/pw-browsers`
  (never run `playwright install`), Python 3.13 with pip.
- `pip install --break-system-packages kokoro-onnx soundfile scipy`.
- **Hugging Face was blocked (403) by the network proxy; GitHub release downloads worked.** Get Kokoro files from:
  - `https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx` (~325 MB)
  - `https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin`
  - Fallback voice: Piper `https://github.com/rhasspy/piper/releases/download/v0.0.2/voice-en-us-ryan-high.tar.gz`.
  - If a host fails, check `curl -sS "$HTTPS_PROXY/__agentproxy/status"`; never disable TLS verification.
- Kokoro outputs **24 kHz** mono — resample to 48 kHz (`scipy.signal.resample_poly`) before mixing.
- **Don't use `rm` with globs after `cd`** (the safety check blocks it). Use absolute paths or just overwrite files.
- Render speed reference: ~0.8–2 s per frame per worker at 1080×1920; ~2,900 frames (48 s @ 60 fps) took ~15 min
  on 4 workers. Run long renders **in the background** and keep working (e.g. on audio) meanwhile.

## 4. Narrative structure (what made it work)
Use this 7-beat arc; each beat = one narration line = one chapter with its own **chip label** and **panel**:
1. **THE QUESTION** — a hook in the form of a relatable paradox ("Why does a website load instantly in Tokyo… when its server sits in New York?"). 4–5 s.
2. **THE PROBLEM** — what happens without the technology; end with punchy rhythm ("Every. Single. Time.") → 3 hard hits.
3. **THE FIX** — introduce the concept by name + its core mechanism.
4. **HOW IT WORKS #1** — the happy path (e.g. cache hit), with a before/after metric comparison.
5. **HOW IT WORKS #2** — the edge case (e.g. cache miss) as a numbered step flow (01 MISS › 02 FETCH › 03 STORE › 04 SERVE).
6. **BONUS BENEFIT** — a second dimension (e.g. security / DDoS absorption).
7. **RECAP** — three-benefit triad ("Faster pages. Lower load. Stronger security.") then a title slam ("That's a CDN.").

Writing rules: ≤ 20 words per line, conversational, second person ("your server"), concrete places/numbers,
use "..." and periods to create TTS pauses, say acronyms the way people say them. Final line ≤ 10 words.

Reference script (CDN):
```
Why does a website load instantly in Tokyo... when its server sits in New York?
Without a CDN, every request travels all the way to one origin server. Thousands of kilometers. Every. Single. Time.
A content delivery network fixes that. It copies your content to edge servers, all around the world.
Now, when someone in Tokyo opens your page, the nearest edge answers. That's a cache hit, in milliseconds.
If the edge doesn't have it yet, that's a cache miss. It fetches once from the origin, stores it, and serves everyone after.
And because traffic is spread across the edge, a CDN absorbs DDoS attacks before they ever reach your server.
Faster pages. Lower load. Stronger security. That's a CDN.
```

## 5. Timing & sync system
- **Word timing estimate** per line: weight per word = alphanumeric chars + 1.6; extra pause weight after
  punctuation: `...` = 7, `.?!` = 4.5, `,;:` = 2.5. Scale weights so they sum to the clip duration.
- **Cues** = `W(scene, "word", n)` → start time of the n-th word in that scene starting with that text
  (case-insensitive). Watch for duplicates (e.g. "every request" vs "Every." — the second needed `n=1`).
  Print all cues and sanity-check that they're in a sensible order.
- Every visual beat and every SFX hit references a named cue, so audio and picture stay locked.
- Captions: chunk words (break at punctuation or every 3 words). A chunk stays visible **until the next chunk in
  the same scene starts** (`next.words[0].t0 − 0.03`), or last word end + 0.5 s at scene end.
  ⚠️ Bug hit in the reference run: computing `c.t1` from `next.t0` inside the same loop that assigns `t0` made it
  `undefined` → captions vanished. Use `next.words[0].t0`, and **unit-test caption text at 10 timestamps** before
  rendering.

## 6. Visual design system (reproduce this look)
**Layout (1080×1920):**
- y≈150: chapter progress bar (one segment per narration line, fills cyan over each chapter's duration, glow).
- y≈200: eyebrow (Inter 600 17px, letter-spacing .32em, cyan) + title (Inter Display 700 60px, −.035em; key term in
  cyan→violet gradient text).
- y≈350: **chapter chip** (pill, uppercase, letter-spacing .2em, colored per chapter: question cyan, problem red,
  fix cyan, hit green, miss amber, security pink-red, recap violet). Springs in with back-ease at each chapter.
- y≈480–1240: **hero graphic** (canvas). Reference = 3D dot-globe, radius 380 (zooms 300–480), center (540, 860).
- y≈1250: **glass data panel** (940×130, radius 28, dark gradient glass, 1px light border, deep shadow) — one
  per chapter: live counter + bar (latency), node-online counter with segment dots, A/B comparison bars,
  numbered step flow lighting up on cues, attack counter + "ORIGIN LOAD NORMAL ✓".
- y≈1430: **kinetic captions** (Inter Display 800 66px, white, heavy dark text-shadow; not-yet-spoken words at
  38 % opacity; current word scales 1.06; key terms (topic nouns, "hit", "miss", "faster", etc.) turn cyan).
- Bottom 20 % deliberately empty (app UI).

**Hero graphic techniques (canvas 2D, all from scratch):**
- Globe: Fibonacci sphere of 1,700 dots, orthographic projection with rotation by longitude `L` and tilt `A`,
  dot alpha/size by depth; dark radial-gradient body, glowing rim (shadowBlur), outer atmosphere gradient,
  faint graticule every 30°. Globe camera (L, A, R, cy) keyframed per chapter with ease-in-out, expo-out entry.
- Cities as lat/lon unit vectors. **Great-circle arcs** via slerp with altitude lift `sin(πs)`; segments behind
  the globe drawn at 12 % alpha. Arcs "draw on" (0→1), **packets** are glowing dots with a short trail moving
  along arcs; loops for continuous traffic.
- Node types: origin = big amber glow + ring + label pill; edge = cyan rotated diamond + outline + 3-letter code;
  user = white dot / **screen-space phone icon** connected with a dashed quadratic curve (much more readable
  than tiny arcs).
- Event FX: expanding ping rings on arrivals, status label pills ("✓ CACHE HIT", "✕ CACHE MISS",
  "▣ STORED AT EDGE", "🛡 ORIGIN SAFE") clamped inside the frame, cache-fill progress ring, hexagon shields,
  red attack swarm (90 seeded particles, ease-in travel to visible edges, burst rings on impact).
- Background: radial navy gradient, 3 slow-drifting blurred color blobs (blue/violet/teal, screen blend),
  faint 90 px grid masked to center, seeded twinkling stars.
- Post: animated film grain (SVG feTurbulence tile, random offset per frame, overlay ~7 %), vignette,
  red edge-flash + small camera shake on emphasis words, fade from/to black.
- Recap: three glass pills sliding in alternately from left/right with back-ease, then a giant title slam
  (scale 1.25→1, blur→sharp) with the globe dimmed to ~28 %; hide labels that would show through.

**Motion principles:** something is always moving (globe drift, packet loops, counters, blobs); every new element
enters with an ease (expo-out / back-out / cubic), never pops; chapters transition with chip swap + whoosh +
globe camera move; key visual beats land on the spoken word.

## 7. Sound design (synthesized in numpy — no licensing issues)
- **Music bed:** A minor, 100 BPM, 2-bar chords Am–F–C–G (with 7ths): detuned additive-saw pads low-passed at
  1.5 kHz with slow attack; 8th-note sub-bass from chapter 2; 16th-note pluck arpeggio from "THE FIX";
  drums: heartbeat kick on beats 1&3 during THE PROBLEM, then four-on-the-floor kick + offbeat hats + clap on 2&4
  from THE FIX, extra hats from chapter 4. Music stops on the final title; a soft A-major pad rings out.
- **SFX (each on a named cue):** impact + reverse whoosh on hook; pops on pins; whoosh before every chapter;
  noise riser into THE FIX and into the final title; latency-counter ticks; 3 heavy thuds on
  "Every. Single. Time."; ascending pentatonic pings as each node comes online; up-blip on request,
  major-triad chime on success, descending two-note on failure, long whoosh out/back for origin fetch,
  click + chime on "stored", quick ascending blips for "serves everyone"; alarm blips + per-particle zaps for the
  attack; low tremolo shield hum; bright chime on "safe"; three rising pops on the recap; final impact +
  bell chord.
- **Processing:** synthetic-IR convolution reverb (music 2.2 s / 30 % wet, SFX 1.4 s / 18 %), voice chain =
  80 Hz high-pass + slight 2.5–6 kHz presence + gentle tanh saturation.
- **Ducking:** voice-envelope sidechain (30 ms attack, 350 ms release), background reduced by 60 % under speech.
- **Gains that worked:** bed × 0.34, SFX × 0.42, voice × 1.0, normalize peak to 0.89.
- **Measure, don't guess:** export the background and voice as separate stems and compute RMS during speech.
  (Subtracting the voice from the mix overstates the background, because the voice chain is nonlinear.)
  Target ≥ 10 dB voice-over-background; check LUFS with `ffmpeg -af loudnorm=print_format=summary`.

## 8. Rendering & encoding commands
```bash
# capture worker (per range):  node capture.js frames 60 <start> <end>   # SCENE, W=1080, H=1920 env vars
ffmpeg -framerate 60 -i frames/f%05d.png -i mix.wav \
  -vf "tmix=frames=2:weights='1 1',fps=30,format=yuv420p" -map 0:v -map 1:a -shortest \
  -c:v libx264 -profile:v high -level 4.2 -preset slow -crf 17 -g 60 -c:a aac -b:a 192k -ar 48000 \
  -movflags +faststart OUT.mp4
```
Capture script essentials: `chromium.launch({args:['--force-color-profile=srgb','--hide-scrollbars']})`, viewport
1080×1920, `await document.fonts.ready`, log `pageerror`, then for each frame `page.evaluate(t => render(t))` +
`page.screenshot({path})`.

## 9. Quality gates (do all of these before delivering)
1. After writing the scene, render **~12 preview stills** at key cue times, tile them into one contact sheet
   (`ffmpeg ... -vf "scale=360:-1,tile=6x2"`), **look at it**, and fix layout issues (clipping at frame edges,
   overlapping labels, labels visible through the far side of the globe, empty captions).
2. Script-test captions/state: evaluate `render(t)` at 10 timestamps and print caption text.
3. Audio checks from §7 (voice-to-background ratio, LUFS, true peak).
4. After encoding: `ffprobe` (resolution, fps, duration, audio stream present) + a contact sheet of every
   ~4 s of the final MP4; confirm captions are visible in every speaking frame.
5. Report honestly: what was verified, what's estimated (word timings), what's illustrative (numbers),
   and that you can't listen to the audio yourself.

## 10. Lessons learned in the earlier 3D website renders (apply if the design uses CSS 3D)
- In `transform-style: preserve-3d`, **`opacity < 1`, `filter`, `overflow:hidden`, `clip-path`, `mix-blend-mode`
  and `-webkit-box-reflect` flatten 3D** — put them on leaves, or only when layers are coplanar.
- Billboarded or rotated elements that cross another plane get split by Chrome's plane sorting (dark wedges).
  Keep them flat at z=0, or offset them in z beyond their radius.
- **SVG gradients defined inside a `display:none` SVG don't render elsewhere** — keep shared `<defs>` in an
  always-rendered 0×0 SVG.
- `background-clip:text` on a parent breaks when its child spans have transforms or filters — apply the gradient per span.
- Fake rings around a sphere: two clipped copies (back half behind the sphere, front half in front).

## 11. Final report to me
Send the MP4 with the file-send tool, then give a short summary covering: the chapter/visual table, the audio
approach, the verification results, caveats, and where the source project lives (remind me that the cloud
session's storage is temporary, so I should download the files). Offer quick variants: another topic, voice swap,
branding, 16:9 cut, or a version without captions.
