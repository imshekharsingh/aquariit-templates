"""Voiceover: Kokoro TTS (open licence, CPU, no key), generated line by line with a start and end time for every displayed word.
The topic's "say" map gives pronunciation overrides (display word -> spoken words, e.g. "AI": "A I"). The spoken text may not contain
digits or hyphens; the whole voice must end by 19.4 s (the speed is nudged up a little if needed, then it fails and asks for a trim)."""
import json
import re
import wave

import numpy as np

SR = 48000
GAP = .14          # silence between lines
FIRST = .08        # the first line starts here
MAX_END = 19.4
WPS = 3.9          # Kokoro af_heart at 1.05 speaks about 3.9 words a second (measured 24 Oct); used by --fake-vo


def core(w):
    return re.sub(r"[^\w']", '', w)


def spoken_words(line, say):
    """[(display word, [spoken words])] for a line, after pronunciation overrides."""
    out = []
    for w in line.split():
        c = core(w)
        rep = say.get(c, say.get(c.lower(), c))
        sp = rep.split()
        for s in sp:
            if re.search(r'\d', s) or '-' in s:
                raise SystemExit(f'spoken text must spell numbers out and avoid hyphens: "{s}" in "{line}" (add it to "say")')
        out.append((w, sp))
    return out


def _speak(pipe, text, voice, speed):
    audio, toks, off = [], [], 0.0
    for r in pipe(text, voice=voice, speed=speed):
        a = np.asarray(r.audio, dtype=np.float32).reshape(-1)
        for k in (r.tokens or []):
            if re.search(r'\w', k.text or '') and k.start_ts is not None:
                toks.append((k.text, off + k.start_ts, off + (k.end_ts if k.end_ts is not None else k.start_ts + .2)))
        audio.append(a)
        off += len(a) / 24000
    return np.concatenate(audio), toks


def _assign(pairs, toks, dur):
    """Map spoken tokens back to displayed words; falls back to spreading the line by characters if the counts differ."""
    need = sum(len(sp) for _, sp in pairs)
    words = []
    if len(toks) == need:
        i = 0
        for d, sp in pairs:
            words.append({'d': d, 's': round(toks[i][1], 3), 'e': round(toks[i + len(sp) - 1][2], 3)})
            i += len(sp)
    else:
        L = sum(len(d) + 1 for d, _ in pairs)
        c = .05
        span = max(.1, dur - .15)
        for d, _ in pairs:
            dd = span * (len(d) + 1) / L
            words.append({'d': d, 's': round(c, 3), 'e': round(c + dd * .9, 3)})
            c += dd
    return words


def generate(topic, wav_path, fake=False):
    say = topic.get('say', {})
    lines = [l['text'] for l in topic['lines']]
    pairs = [spoken_words(l, say) for l in lines]
    if fake:   # estimate at 3.2 words a second, no audio; for local stills
        res, cur = [], FIRST
        for l, pr in zip(lines, pairs):
            n = sum(len(sp) for _, sp in pr)
            dur = n / WPS
            ws = _assign(pr, [], dur)
            res.append({'text': l, 'start': round(cur, 3), 'end': round(cur + dur, 3), 'words': [dict(w, s=round(w['s'] + cur, 3), e=round(w['e'] + cur, 3)) for w in ws]})
            cur += dur + GAP
        return {'dur': round(cur - GAP, 3), 'lines': res, 'fake': True}
    from kokoro import KPipeline
    pipe = KPipeline(lang_code='a', repo_id='hexgrad/Kokoro-82M')
    speed = topic.get('speed', 1.05)
    while True:
        res, chunks, cur = [], [], FIRST
        for l, pr in zip(lines, pairs):
            text = ' '.join(' '.join(sp) for _, sp in pr) + ('.' if not re.search(r'[.?!]$', l) else l[-1])
            a, toks = _speak(pipe, text, topic.get('voice', 'af_heart'), speed)
            nz = np.flatnonzero(np.abs(a) > .01 * np.abs(a).max())   # trim the model's leading and trailing silence
            lead = nz[0] / 24000 if len(nz) else 0
            a = a[nz[0]:nz[-1] + 1] if len(nz) else a
            dur = len(a) / 24000
            ws = _assign(pr, [(x, s - lead, e - lead) for x, s, e in toks], dur)
            res.append({'text': l, 'start': round(cur, 3), 'end': round(cur + dur, 3), 'words': [dict(w, s=round(max(0, w['s']) + cur, 3), e=round(min(dur, w['e']) + cur, 3)) for w in ws]})
            chunks.append((cur, a))
            cur += dur + GAP
        end = cur - GAP
        print(f'voice at speed {speed:.2f}: ends at {end:.2f} s')
        if end <= MAX_END:
            break
        if speed < 1.14:
            speed = round(speed + .03, 2)
            continue
        raise SystemExit(f'the voice ends at {end:.2f} s; trim the script to end by {MAX_END} s (about {int(MAX_END * WPS)} words)')
    out = np.zeros(int((end + .2) * 24000), dtype=np.float32)
    for st, a in chunks:
        i = int(st * 24000)
        out[i:i + len(a)] += a
    out = np.interp(np.arange(0, len(out) * 2) / 2, np.arange(len(out)), out)   # 24 kHz -> 48 kHz
    out = out / (np.abs(out).max() + 1e-9) * .9
    with wave.open(wav_path, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((out * 32767).astype('<i2').tobytes())
    return {'dur': round(end, 3), 'lines': res, 'speed': speed}


if __name__ == '__main__':
    import sys
    t = json.load(open(sys.argv[1]))
    print(json.dumps(generate(t, sys.argv[2], fake=len(sys.argv) > 3), indent=1))
