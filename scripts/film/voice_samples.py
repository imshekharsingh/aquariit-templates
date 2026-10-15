# Voice sample pack for the owner to pick a voice (15 Oct 2026). Runs ONLY in GitHub Actions (voice-test.yml, mode=samples).
# usage: python voice_samples.py OUTDIR   -> OUTDIR/voice-<name>.wav, one per voice, all saying the same line
import sys, os
import numpy as np, soundfile as sf
from kokoro import KPipeline
LINE = "Is your website slow, or hard to find on Google? We design, speed up and protect sites for growing businesses. DM us, and we'll show you how."
VOICES = {'a': ['af_heart', 'af_bella', 'am_michael', 'am_fenrir'], 'b': ['bf_emma', 'bm_george']}
out = sys.argv[1]; os.makedirs(out, exist_ok=True)
for lang, names in VOICES.items():
    pipe = KPipeline(lang_code=lang, repo_id='hexgrad/Kokoro-82M')
    for v in names:
        parts = [r.audio.cpu().numpy() if hasattr(r.audio, 'cpu') else np.asarray(r.audio) for r in pipe(LINE, voice=v, speed=1.0)]
        sf.write(os.path.join(out, f'voice-{v}.wav'), np.concatenate(parts), 24000); print('wrote', v)
