# Kokoro TTS (open-weight, Apache-2.0) for the film voice-over. Runs ONLY in GitHub Actions (voice-test / Reel publish), never in a Claude session.
# usage: python voice_kokoro.py lines.json out.wav words.json   (lines: [{"t0":..,"text":..}]); 24 kHz mono; word times come from the model's own durations
import json, sys
import numpy as np, soundfile as sf
from kokoro import KPipeline

VOICE = 'af_heart'
lines, out_wav, out_words = json.load(open(sys.argv[1])), sys.argv[2], sys.argv[3]
pipe = KPipeline(lang_code='a', repo_id='hexgrad/Kokoro-82M')
SR, LEN = 24000, 18.0
buf, words, spans = np.zeros(int(LEN * SR), dtype=np.float32), [], []
for i, ln in enumerate(lines):
    off = ln['t0']
    for r in pipe(ln['text'], voice=VOICE, speed=1.0):
        a = r.audio.cpu().numpy() if hasattr(r.audio, 'cpu') else np.asarray(r.audio)
        s = int(off * SR); e = min(len(buf), s + len(a)); buf[s:e] += a[: e - s]
        for tk in (r.tokens or []):
            if tk.start_ts is None or not tk.text.strip() or not any(c.isalnum() for c in tk.text): continue
            words.append({'w': tk.text, 'start': round(off + tk.start_ts, 3), 'end': round(off + tk.end_ts, 3), 'line': i})
        off += len(a) / SR
    spans.append({'line': i, 'start': ln['t0'], 'end': round(off, 3)})
sf.write(out_wav, buf, SR)
json.dump({'engine': 'kokoro', 'voice': VOICE, 'model': 'hexgrad/Kokoro-82M', 'words': words, 'lines': spans}, open(out_words, 'w'), indent=1)
print(f'kokoro: {len(lines)} lines, {len(words)} words, speech ends {spans[-1]["end"] if spans else 0}s')
