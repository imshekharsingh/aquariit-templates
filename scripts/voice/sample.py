"""Hear a word before and after a lexicon fix, without rendering a reel (owner, 11 Nov 2026: "photos" "sounds weird" in the carousel reel).
Speaks each line with Kokoro (af_heart) twice, without and with the say.json entries named in --off (before / after), transcribes both
with the voice check's recogniser (faster-whisper small.en, no prompt) and prints, per line: the phonemes Kokoro spoke, what was heard,
and the recogniser's confidence for every word of the line.
Usage (GitHub, "Voice check" workflow, input sample): python3 scripts/voice/sample.py --speed 0.84 --off photos,photo "Line one." "Line two."
"""
import argparse, os, re, sys, wave
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import say   # noqa: E402


def speak(pipe, text, speed, path):
    a, ph = [], []
    for r in pipe(text, voice='af_heart', speed=speed):
        a.append(np.asarray(r.audio, dtype=float).reshape(-1)); ph.append(r.phonemes)
    a = np.concatenate([np.zeros(6000), *a, np.zeros(6000)])
    a = (a / (np.abs(a).max() + 1e-9) * .9 * 32767).astype('<i2')
    with wave.open(path, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000); w.writeframes(a.tobytes())
    return ' '.join(ph)


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--speed', type=float, default=1.0); ap.add_argument('--off', default='')
    ap.add_argument('lines', nargs='+'); o = ap.parse_args()
    off = [w.strip() for w in o.off.split(',') if w.strip()]
    from kokoro import KPipeline
    from faster_whisper import WhisperModel
    pipe = KPipeline(lang_code='a', repo_id='hexgrad/Kokoro-82M'); model = WhisperModel('small.en', device='cpu', compute_type='int8')
    full = dict(say.WORDS)
    for line in o.lines:
        for tag in ('before', 'after'):
            say.WORDS.clear(); say.WORDS.update({k: v for k, v in full.items() if tag == 'after' or k not in off})
            text = say.apply(line)[0]
            ph = speak(pipe, text, o.speed, '/tmp/sample.wav')
            segs, _ = model.transcribe('/tmp/sample.wav', word_timestamps=True, beam_size=5)
            ws = [(re.sub(r"[^\w']", '', w.word), w.probability) for s in segs for w in s.words]
            print(f'SAMPLE {tag}: "{line}" speed {o.speed}\n  spoken as: {ph}\n  heard: {" ".join(w for w, _ in ws)}\n  confidence: '
                  + ', '.join(f'{w} {p:.2f}' for w, p in ws))


if __name__ == '__main__':
    main()
