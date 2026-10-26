# Voice check (owner, 26 Oct 2026: "at times one cannot understand what it is saying"): transcribe the narration with an open
# speech recogniser (faster-whisper, MIT, CPU, no key) and compare it with the script, word by word. Lists every word that was heard
# differently, missed or added, and every word the recogniser was unsure of, with its time, so a mumbled word is caught before posting.
# Usage: python3 scripts/showreel/voicecheck.py <config.json> <narration.wav> [report.md]
import difflib, json, re, sys

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
                heard.append((x, w.start, w.probability))
    want = words(script)
    got = [h[0] for h in heard]
    rows = []
    for op, a0, a1, b0, b1 in difflib.SequenceMatcher(a=want, b=got, autojunk=False).get_opcodes():
        if op == 'equal':
            continue
        at = heard[b0][1] if b0 < len(heard) else (heard[-1][1] if heard else 0)
        rows.append(f"| {at:5.2f} s | {op} | {' '.join(want[a0:a1]) or '-'} | {' '.join(got[b0:b1]) or '-'} |")
    unsure = [f"{w} ({t:.2f} s, {p:.2f})" for w, t, p in heard if p < .6]
    out = [f"### Voice check: {len(want)} words in the script, {len(got)} heard",
           'Every word heard as written.' if not rows else '| at | change | script | heard |\n|---|---|---|---|\n' + '\n'.join(rows),
           'Unsure words (recogniser confidence under 0.6): ' + (', '.join(unsure) if unsure else 'none'),
           'Heard: ' + ' '.join(got)]
    text = '\n\n'.join(out)
    print(text)
    if report:
        open(report, 'a').write(text + '\n')


if __name__ == '__main__':
    main(*sys.argv[1:4])
