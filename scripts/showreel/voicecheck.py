# Voice check (owner, 26 Oct 2026: "at times one cannot understand what it is saying"): transcribe the narration with an open
# speech recogniser (faster-whisper, MIT, CPU, no key) and compare it with the script, word by word. Lists every word that was heard
# differently, missed or added, and every word the recogniser was unsure of, with its time, so a mumbled word is caught before posting.
# Pacing (owner, 26 Oct: "each statement should be clear and long enough to understand what it says"): per sentence, how long it is
# spoken, its rate in words a second and the pause before the next one, flagged against limits set from Nº 01, the reel the owner liked.
# Usage: python3 scripts/showreel/voicecheck.py <config.json> <narration.wav> [report.md]
import difflib, json, re, sys

# limits from Nº 01, the reel the owner liked (measured 26 Oct: 2.65 words a second overall, sentences up to ~4.4 words a second
# from first to last word, pauses mostly 0.56-0.86 s); the recogniser's sentence times run first word to last, so they read fast
MAX_WPS = 4.0       # a sentence spoken faster than this is hard to follow
MIN_PAUSE = .55     # the breath after a sentence, before the next idea starts
MAX_OVERALL = 2.7   # words a second across the whole voice, pauses included

ONES = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split()
TENS = 'twenty thirty forty fifty sixty seventy eighty ninety'.split()


def spell(n):
    """Digits as the voice says them (Kokoro reads 40 as forty, 2024 as twenty twenty-four), so both sides compare as words."""
    n = int(n)
    if n < 20: return ONES[n]
    if n < 100: return TENS[n // 10 - 2] + ('' if n % 10 == 0 else ' ' + ONES[n % 10])
    if 2000 <= n < 2100 and n % 100: return 'twenty ' + spell(n % 100)
    if n < 1000: return ONES[n // 100] + ' hundred' + ('' if n % 100 == 0 else ' ' + spell(n % 100))
    return ' '.join(ONES[int(d)] for d in str(n))


def words(text):
    text = re.sub(r'\d+', lambda m: ' ' + spell(m.group()) + ' ', text.lower())
    return [w for w in re.sub(r"[^a-z' ]", ' ', text.replace('-', ' ')).split() if w]


def main(cfg_path, wav_path, report=None):
    script = json.load(open(cfg_path))['voice']['text']
    from faster_whisper import WhisperModel
    model = WhisperModel('small.en', device='cpu', compute_type='int8')
    segs, _ = model.transcribe(wav_path, word_timestamps=True, beam_size=5)   # no prompt: priming it with the script would hide the very errors we look for
    heard = []   # (word, start, probability) per recognised token, split the same way as the script
    for s in segs:
        for w in s.words:
            for x in words(w.word):
                heard.append((x, w.start, w.probability, w.end))
    want = words(script)
    got = [h[0] for h in heard]
    rows = []
    for op, a0, a1, b0, b1 in difflib.SequenceMatcher(a=want, b=got, autojunk=False).get_opcodes():
        if op == 'equal':
            continue
        at = heard[b0][1] if b0 < len(heard) else (heard[-1][1] if heard else 0)
        rows.append(f"| {at:5.2f} s | {op} | {' '.join(want[a0:a1]) or '-'} | {' '.join(got[b0:b1]) or '-'} |")
    unsure = [f"{w} ({t:.2f} s, {p:.2f})" for w, t, p, _ in heard if p < .6]
    # pacing: map script words to heard words through the matching blocks, then time each sentence of the script
    m = {}
    for blk in difflib.SequenceMatcher(a=want, b=got, autojunk=False).get_matching_blocks():
        for k in range(blk.size): m[blk.a + k] = blk.b + k
    sents, i = [], 0
    for sent in re.findall(r'[^.?!]+[.?!]?', script):
        n = len(words(sent))
        if n: sents.append((sent.strip(), i, i + n)); i += n
    prow, flags, times = [], 0, []
    for k, (sent, a0, a1) in enumerate(sents):
        hs = [m[j] for j in range(a0, a1) if j in m]
        if not hs: continue
        st, en = heard[hs[0]][1], heard[hs[-1]][3]
        times.append((st, en))
    for k, (sent, a0, a1) in enumerate(sents[:len(times)]):
        st, en = times[k]; dur = max(.01, en - st); wps = (a1 - a0) / dur
        pause = times[k + 1][0] - en if k + 1 < len(times) else None
        bad = [x for x, c in (('fast', wps > MAX_WPS), ('no breath', pause is not None and pause < MIN_PAUSE)) if c]
        flags += bool(bad)
        prow.append(f"| {st:5.2f} s | {sent} | {dur:.2f} s | {a1 - a0} | {wps:.2f} | {'end' if pause is None else f'{pause:.2f} s'} | {', '.join(bad) or 'ok'} |")
    total = (times[-1][1] - times[0][0]) if times else 0
    overall = len(want) / max(total, .01)
    pacing = (f"### Pacing: {len(want)} words in {total:.1f} s of voice = {overall:.2f} words a second overall "
              f"({'too dense' if overall > MAX_OVERALL else 'ok'}, limit {MAX_OVERALL}); "
              f"{flags} of {len(prow)} sentences flagged (limits: at most {MAX_WPS} words a second, a pause of at least {MIN_PAUSE} s after)\n\n"
              "| at | sentence | spoken | words | words/s | pause after | flag |\n|---|---|---|---|---|---|---|\n" + '\n'.join(prow))
    out = [f"### Voice check: {len(want)} words in the script, {len(got)} heard",
           'Every word heard as written.' if not rows else '| at | change | script | heard |\n|---|---|---|---|\n' + '\n'.join(rows),
           'Unsure words (recogniser confidence under 0.6): ' + (', '.join(unsure) if unsure else 'none'),
           'Heard: ' + ' '.join(got), pacing]
    text = '\n\n'.join(out)
    print(text)
    if report:
        open(report, 'a').write(text + '\n')


if __name__ == '__main__':
    main(*sys.argv[1:4])
