"""Voiceover: Kokoro TTS (open licence, CPU, no key), generated line by line with a start and end time for every displayed word.
The topic's "say" map gives pronunciation overrides: display word -> spoken words, or Kokoro phoneme markup for letters and brands,
e.g. "AI": "[AI](/ˌAˈI/)". Spelling letters with spaces ("A I") makes two separately stressed words ("AY. EYE."), which sounds
choppy (measured 24 Oct). Every line's phonemes are kept in vo.json and listed in qa.txt so the pronunciation can be checked. The spoken text may not contain
digits or hyphens; the whole voice must end by 19.4 s (the speed is nudged up a little if needed, then it fails and asks for a trim)."""
import json
import re
import wave

import numpy as np

SR = 48000
GAP = .04          # extra silence between lines (each line already keeps 50 ms before and 110 ms after its sound)
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
            if re.search(r'\d', s) or ('-' in s and not s.startswith('[')):
                raise SystemExit(f'spoken text must spell numbers out and avoid hyphens: "{s}" in "{line}" (add it to "say")')
        out.append((w, sp))
    return out


def _speak(pipe, text, voice, speed):
    audio, toks, off, ps = [], [], 0.0, []
    for r in pipe(text, voice=voice, speed=speed):
        ps.append(r.phonemes or '')
        a = np.asarray(r.audio, dtype=np.float32).reshape(-1)
        for k in (r.tokens or []):
            if re.search(r'\w', k.text or '') and k.start_ts is not None:
                toks.append((k.text, off + k.start_ts, off + (k.end_ts if k.end_ts is not None else k.start_ts + .2)))
        audio.append(a)
        off += len(a) / 24000
    return np.concatenate(audio), toks, ' '.join(ps)


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
            cur += dur + float(topic.get('gap', GAP))
        return {'dur': round(cur - float(topic.get('gap', GAP)), 3), 'lines': res, 'fake': True}
    from kokoro import KPipeline
    pipe = KPipeline(lang_code='a', repo_id='hexgrad/Kokoro-82M')
    speed = topic.get('speed', 1.05)
    # how the phonemizer reads each overridden word on its own, spelled with spaces, and with the override (for QA)
    checks = {}
    for k, v in say.items():
        try:
            checks[k] = {form: pipe.g2p(f'Can an {form} shop?')[0] for form in (k, ' '.join(k), v)}
        except Exception as e:
            checks[k] = {'error': str(e)}
    gap = float(topic.get('gap', GAP))           # the breath between lines (owner, 26 Oct: each statement long enough to understand)
    max_end = float(topic.get('max_end', MAX_END))
    while True:
        res, chunks, cur = [], [], FIRST
        for l, pr in zip(lines, pairs):
            text = ' '.join(' '.join(sp) for _, sp in pr) + ('.' if not re.search(r'[.?!]$', l) else l[-1])
            a, toks, ph = _speak(pipe, text, topic.get('voice', 'af_heart'), speed)
            # trim the model's leading and trailing silence, but gently: a low threshold, 50 ms kept before the first sound and
            # 110 ms after the last, with short fades, so soft onsets ("So", "Per") and final consonants ("bought") survive
            env = np.convolve(np.abs(a), np.ones(240) / 240, 'same')
            nz = np.flatnonzero(env > .004 * env.max())
            i0 = max(0, nz[0] - int(.05 * 24000)) if len(nz) else 0
            i1 = min(len(a), nz[-1] + int(.11 * 24000)) if len(nz) else len(a)
            lead = i0 / 24000
            a = a[i0:i1].copy()
            f = min(len(a) // 4, 240); a[:f] *= np.linspace(0, 1, f); a[-f:] *= np.linspace(1, 0, f)
            dur = len(a) / 24000
            ws = _assign(pr, [(x, s - lead, e - lead) for x, s, e in toks], dur)
            res.append({'phonemes': ph, 'text': l, 'start': round(cur, 3), 'end': round(cur + dur, 3), 'words': [dict(w, s=round(max(0, w['s']) + cur, 3), e=round(min(dur, w['e']) + cur, 3)) for w in ws]})
            chunks.append((cur, a))
            cur += dur + gap
        end = cur - gap
        print(f'voice at speed {speed:.2f}: ends at {end:.2f} s')
        if end <= max_end:
            break
        if speed < float(topic.get('max_speed', 1.14)) - .001:   # a topic can forbid speeding up (owner, 26 Oct: rushed voice is lost)
            speed = round(speed + .03, 2)
            continue
        raise SystemExit(f'the voice ends at {end:.2f} s; trim the script to end by {max_end} s (about {int(max_end * WPS)} words)')
    out = np.zeros(int((end + .2) * 24000), dtype=np.float32)
    for st, a in chunks:
        i = int(st * 24000)
        out[i:i + len(a)] += a
    from scipy.signal import resample_poly
    out = resample_poly(out, 2, 1)   # 24 kHz -> 48 kHz with a proper low-pass (linear interpolation added a metallic edge)
    out = out / (np.abs(out).max() + 1e-9) * .9
    with wave.open(wav_path, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((out * 32767).astype('<i2').tobytes())
    return {'dur': round(end, 3), 'lines': res, 'speed': speed, 'say_checks': checks}


if __name__ == '__main__':
    import sys
    t = json.load(open(sys.argv[1]))
    print(json.dumps(generate(t, sys.argv[2], fake=len(sys.argv) > 3), indent=1))
