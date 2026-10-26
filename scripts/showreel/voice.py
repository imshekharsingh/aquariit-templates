# Narration for explainer reels (owner, 23 Oct 2026: the voice runs the whole reel, captions follow it word by word).
# Speaks the config's voice.text with Kokoro-82M (Apache-2.0, CPU, no key) and writes the audio plus a timestamp for every word,
# so the scene times its beats and captions to the real voice (seek.mjs hands the words to window.setVoice before rendering).
# Usage: python3 scripts/showreel/voice.py <config.json> <out.wav> <words.json>
#   config.voice: { text, voice? (default af_heart), speed? (default 1.0), gap? (seconds of silence after each sentence, or a list
#   with one value per sentence; default none) }
#   gap (owner, 26 Oct: "each statement should be clear and long enough to understand"): each sentence is spoken on its own, its
#   own leading and trailing silence trimmed, and followed by exactly that much silence: a breath before the next statement
import json, re, sys, wave
import numpy as np

SR = 48000


def main(cfg_path, wav_path, words_path):
    V = json.load(open(cfg_path))['voice']
    from kokoro import KPipeline
    pipe = KPipeline(lang_code='a', repo_id='hexgrad/Kokoro-82M')
    audio, words, off = [], [], 0.0
    gaps = V.get('gap', 0)   # one number for every breath, or a list: one breath per sentence (owner, 26 Oct: pauses that follow the thought)
    gap = (max(gaps) if gaps else 0) if isinstance(gaps, list) else float(gaps)
    parts = [x.strip() for x in re.findall(r'[^.?!]+[.?!]?', V['text']) if x.strip()] if gap else [V['text']]
    for n, part in enumerate(parts):
        pa, pw, po = [], [], 0.0   # this sentence's audio and words, timed from its own start
        for r in pipe(part, voice=V.get('voice', 'af_heart'), speed=V.get('speed', 1.0)):
            a = np.asarray(r.audio, dtype=float).reshape(-1)
            toks = [k for k in (r.tokens or []) if re.search(r'\w', k.text or '')]
            if toks and all(k.start_ts is not None for k in toks):
                for k in toks: pw.append({'w': k.text, 's': po + k.start_ts, 'e': po + (k.end_ts or k.start_ts + .2)})
            else:   # no timestamps from the model: spread the chunk's words by length (good enough for captions)
                ws = r.graphemes.split(); L = sum(len(w) for w in ws) or 1; c = po
                for w in ws: d = len(a) / 24000 * len(w) / L; pw.append({'w': w, 's': c, 'e': c + d}); c += d
            pa.append(a); po += len(a) / 24000
        pa = np.concatenate(pa); lead = 0.0
        if gap:   # spoken one sentence at a time: trim the model's own silence (40 ms kept before, 90 ms after) so the pause is the gap
            env = np.convolve(np.abs(pa), np.ones(240) / 240, 'same'); nz = np.flatnonzero(env > .004 * env.max())
            if len(nz):
                i0, i1 = max(0, nz[0] - 960), min(len(pa), nz[-1] + 2160); lead = i0 / 24000; pa = pa[i0:i1]
        for w in pw: words.append({'w': w['w'], 's': round(off + max(0, w['s'] - lead), 3), 'e': round(off + max(0, w['e'] - lead), 3)})
        audio.append(pa); off += len(pa) / 24000
        if gap and n < len(parts) - 1:   # the breath after a sentence
            g = float(gaps[min(n, len(gaps) - 1)]) if isinstance(gaps, list) else gap
            audio.append(np.zeros(int(g * 24000))); off += g
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
