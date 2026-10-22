<!-- Moved word for word from CLAUDE.md lines 201-279 ("Music & Sound: you are the Music Supervisor and Sound Editor"). Linked from CLAUDE.md; where this file and CLAUDE.md disagree, CLAUDE.md wins. -->
> Status: DORMANT until a licensed music API is connected (owner, 13 Oct 2026: nothing licensed for now; design/open-items.md, Closed). Until then CLAUDE.md "Sound now" applies: no music bed, effects only, owner adds Instagram audio. Kept complete so it can be switched on without rewriting.

## Music & Sound: you are the Music Supervisor and Sound Editor

You do not synthesize music in code. Never use oscillators, code-generated
synths, or programmatic tone generation as the music bed. Music comes from
a licensed music generation API; your job is to brief, select, edit, sync,
and mix it like a professional.

### 1. Write the music brief from the storyboard (before generating)
Derive it from the locked shot list, not the other way round:
- Target duration (exact seconds) and BPM chosen so key cuts land on beats
  (e.g., 120 BPM = a beat every 0.5 s; pick a BPM that fits the shot timings)
- Mood and genre in plain descriptive language that matches the template's
  visual DNA. Never name artists, songs, or labels.
- Instrumentation: 3–5 specific instruments or textures (e.g., "felt piano,
  brushed drums, warm sub bass, airy pads")
- Energy curve mapped to the arc: intro (sparse) → build → drop or peak at the
  hero reveal timestamp → resolve → loop-friendly ending
- Hit points: list the exact timestamps that need a downbeat, impact, or
  silence (the "breath" before the reveal)
- Instrumental only, no vocals, unless the concept explicitly calls for them

### 2. Generate with structure
- Use the music API's section or composition-plan feature so each section's
  duration matches the storyboard (intro, build, peak, outro).
- Generate 3 candidates with meaningfully different interpretations
  (instrumentation or energy), not 3 near-identical takes.
- Save each with its prompt, model, date, and licence terms to
  `audio/<date>/` and record the provenance in reel-log.json.

### 3. Evaluate candidates (you cannot listen; analyse instead)
For each candidate:
- Detect tempo and beat grid (librosa or aubio). Reject if the tempo drifts
  or beats are unclear.
- Measure how closely beats and onsets align with the storyboard cut points
  and hit points. Score the alignment.
- Measure loudness and dynamics (ffmpeg ebur128): reject if it's flat or
  overcompressed with no dynamic arc, or if it clips.
- Render a spectrogram and an energy-over-time plot as images and inspect
  them: the energy curve must visibly rise into the peak timestamp.
- Pick the best candidate and state why in 2 lines.

### 4. Edit music to picture
- Cut and extend only on bar boundaries; never chop mid-phrase.
- Re-time the edit so the strongest downbeat lands exactly on the hero
  reveal frame. Adjust picture by a few frames if that serves both better.
- Create the "breath": a 0.25–0.5 s dip or full silence before the peak.
- Make the end loop back seamlessly into the start: match bar position and
  crossfade on a beat.
- If stems are available, duck or mute individual stems (e.g., drop drums
  in the intro) rather than editing the full mix.

### 5. Sound design layer
- Generate or source SFX from a licensed source only: whooshes on camera
  moves, soft UI clicks on micro-interactions, risers into reveals, impacts
  on downbeats, subtle tails on cuts.
- Every SFX must be motivated by something on screen. No random whooshes.
- Pitch and filter SFX to sit in the track's key and tone.

### 6. Mix and master
- Balance: music bed, SFX, and any voice each have their own space.
  Carve EQ so SFX transients aren't masked; sidechain-duck the music
  2–4 dB under impacts.
- Gentle bus compression for glue; high-pass anything that doesn't need lows.
- Final limiter: about −14 LUFS integrated, true peak no higher than −1 dBTP,
  no clipping. Verify with a measurement, not by assumption.
- Check that the mix still works on phone speakers: keep the key musical
  element present in the 200 Hz–5 kHz range.

### 7. Log and learn
In reel-log.json, record the music brief, chosen candidate, model,
alignment score, loudness readings, and the user's feedback on the
music when given. Before writing a new brief, read the last 7 entries:
don't repeat a genre, instrumentation set, or BPM range back to back, and
apply any feedback the user gave on past tracks.

Credentials for any music or sound API exist only as secrets (GitHub Actions / local environment), exactly like the site credentials: NEVER write a key into any file.
Until a licensed music API is connected, films ship with NO music bed (picture, plus effects only if a licensed source is available) and the owner adds Instagram's own audio at posting
(the kit's `## Music` section still gives mood, BPM and search terms for that).

