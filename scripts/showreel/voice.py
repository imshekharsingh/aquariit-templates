# Narration for explainer reels (owner, 23 Oct 2026: the voice runs the whole reel, captions follow it word by word).
# Speaks the config's voice.text with Kokoro-82M (Apache-2.0, CPU, no key) and writes the audio plus a timestamp for every word,
# so the scene times its beats and captions to the real voice (seek.mjs hands the words to window.setVoice before rendering).
# Usage: python3 scripts/showreel/voice.py <config.json> <out.wav> <words.json>
#   config.voice: { text, voice? (default af_heart), speed? (default 1.0) }
import json, re, sys, wave
import numpy as np

SR = 48000


def main(cfg_path, wav_path, words_path):
    V = json.load(open(cfg_path))['voice']
    from kokoro import KPipeline
    pipe = KPipeline(lang_code='a', repo_id='hexgrad/Kokoro-82M')
    audio, words, off = [], [], 0.0
    for r in pipe(V['text'], voice=V.get('voice', 'af_heart'), speed=V.get('speed', 1.0)):
        a = np.asarray(r.audio, dtype=float).reshape(-1)
        toks = [k for k in (r.tokens or []) if re.search(r'\w', k.text or '')]
        if toks and all(k.start_ts is not None for k in toks):
            for k in toks: words.append({'w': k.text, 's': round(off + k.start_ts, 3), 'e': round(off + (k.end_ts or k.start_ts + .2), 3)})
        else:   # no timestamps from the model: spread the chunk's words by length (good enough for captions)
            ws = r.graphemes.split(); L = sum(len(w) for w in ws) or 1; c = off
            for w in ws: d = len(a) / 24000 * len(w) / L; words.append({'w': w, 's': round(c, 3), 'e': round(c + d, 3)}); c += d
        audio.append(a); off += len(a) / 24000
    a = np.concatenate(audio)
    a = np.interp(np.arange(0, len(a) * 2) / 2, np.arange(len(a)), a)   # 24 kHz -> 48 kHz
    a = a / (np.abs(a).max() + 1e-9) * .9
    pcm = (np.stack([a, a]).T * 32767).astype('<i2')
    with wave.open(wav_path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    json.dump({'dur': round(off, 3), 'words': words}, open(words_path, 'w'), indent=0)
    print(f'narration {off:.2f} s, {len(words)} words; first {words[:3]}; last {words[-1:]}')


if __name__ == '__main__':
    main(*sys.argv[1:4])
