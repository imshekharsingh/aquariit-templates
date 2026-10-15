# Kokoro TTS (open-weight, Apache-2.0) for the film voice-over. Runs ONLY in GitHub Actions (voice-test / Reel publish), never in a Claude session.
# usage: python voice_kokoro.py lines.json out.wav words.json   (lines: [{"t0":..,"text":..}]); 24 kHz mono; word times come from the model's own durations
import json, sys
import numpy as np, soundfile as sf
from kokoro import KPipeline

lines, out_wav, out_words = json.load(open(sys.argv[1])), sys.argv[2], sys.argv[3]
VOICE = sys.argv[4] if len(sys.argv) > 4 else 'af_heart'          # chosen by voice.mjs (rotation test, owner 15 Oct 2026)
pipe = KPipeline(lang_code=VOICE[0], repo_id='hexgrad/Kokoro-82M')   # 'a' American, 'b' British voices
SR, LEN = 24000, float(sys.argv[5]) if len(sys.argv) > 5 else 18.0   # film length from timing.json (voice.mjs passes it)
buf, words, spans = np.zeros(int(LEN * SR), dtype=np.float32), [], []
for i, ln in enumerate(lines):
    off = ln['t0']
    # fit the shot: measure the line at 1.0x, then speak it at the pace that fills its slot
    slot = max(.5, ln['t1'] - ln['t0'])
    probe = sum(len(r.audio) for r in pipe(ln['text'], voice=VOICE, speed=1.0)) / SR        # natural pace (owner, 15 Oct 2026: 0.95 + short lines left noticeable pauses)
    speed = min(1.08, max(.92, probe / slot * 1.03))   # fill the slot at a natural pace (0.92-1.08x): no trailing silence, never rushed
    if abs(speed - 1) > .04: print(f"line {i + 1}: {probe:.2f} s for a {slot:.2f} s shot -> speed {speed:.2f}")
    for r in pipe(ln['text'], voice=VOICE, speed=speed):
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
