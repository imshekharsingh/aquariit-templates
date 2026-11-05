"""One way to say each word, for every channel's Kokoro voice (owner, 5 Nov 2026: "why not have audio consistency across all
channels?", after @techin20sec's Wi-Fi reel was read "Wi" "Fi"). The shared lexicon is scripts/voice/say.json (word as written ->
Kokoro markup [word](/phonemes/)); a reel config may add its own "say" on top (it wins). Years are said the way people say them
(1889 -> "eighteen eighty nine"; Kokoro alone says "eighteen hundred eighty nine").
Used by techreel/vo/tts.py, scripts/showreel/voice.py and sound.py voice(); scripts/showreel/preflight.mjs and techreel --fake-vo
print the PRONUNCIATION line from report().
CLI: python3 scripts/voice/say.py <config.json>   prints the PRONUNCIATION line; exits 1 when a config "say" entry matches no word."""
import json
import os
import re
import sys

LEX = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'say.json'), encoding='utf-8'))
WORDS, NUM = LEX['words'], LEX['numbers']
MARK = re.compile(r'\[([^\]]+)\]\(/([^)]*)/\)')


def core(w):
    return re.sub(r"[^\w']", '', w)


def key(w):
    """The word as written without its outer punctuation, inner hyphen kept: "Wi-Fi," -> "Wi-Fi"."""
    return re.sub(r"^[^\w]+|[^\w]+$", '', w)


def _year(k):
    """Phonemes for a year said in pairs (1889 eighteen eighty nine, 1908 nineteen oh eight, 1900 nineteen hundred, 2024 twenty
    twenty four), or None. 2000-2009 stay "two thousand five", which Kokoro already says."""
    if not re.fullmatch(r'\d{4}', k): return None
    n = int(k)
    if not (1100 <= n <= 1999 or 2010 <= n <= 2099): return None
    hi, lo = divmod(n, 100)
    ones = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split()
    tens = 'twenty thirty forty fifty sixty seventy eighty ninety'.split()
    say = lambda x: [ones[x]] if x < 20 else [tens[x // 10 - 2]] + ([ones[x % 10]] if x % 10 else [])
    words = say(hi) + (['hundred'] if lo == 0 else ['oh', ones[lo]] if lo < 10 else say(lo))
    return ' '.join(NUM[w] for w in words)


def lookup(w, extra=None):
    """(matched key, replacement, source) for one written word, or None. The config's own "say" wins over the lexicon."""
    k, c, raw = key(w), core(w), re.sub(r'^[^\w]+|[,.?!:;"\')]+$', '', w)   # raw keeps a sign such as "80%"
    for src, table in (('config', extra or {}), ('lexicon', WORDS)):
        for cand in (raw, k, k.lower(), c, c.lower()):
            if cand and cand in table:
                return cand, table[cand], src
    ph = _year(k)
    if ph:
        return k, f'[{k}](/{ph}/)', 'year'
    return None


def replacement(w, rep):
    """The written word w as spoken: markup gets the written word (punctuation off) as its bracket text, so the voice's word
    timings still line up with the script's words; plain spoken words ("self hosted") are used as given."""
    m = MARK.fullmatch(rep)
    return f'[{re.sub(r"[^A-Za-z0-9]", "", key(w)) or m.group(1)}](/{m.group(2)}/)' if m else rep


def apply(text, extra=None):
    """(spoken text, used) for free text: every word with an entry becomes its markup, punctuation kept around it; words already
    written as markup are left alone. used = [(key, source)] in order of first use."""
    used, out = [], []
    for chunk in re.split(r'(\[[^\]]+\]\(/[^)]*/\))', text):
        if MARK.fullmatch(chunk):
            out.append(chunk); continue
        words = re.split(r'(\s+)', chunk)
        for i, w in enumerate(words):
            hit = lookup(w, extra) if w.strip() else None
            if hit:
                k, rep, src = hit
                if (k, src) not in used: used.append((k, src))
                lead, trail = re.match(r'^[^\w\[]*', w).group(), re.search(r'[^\w\]]*$', w).group()
                words[i] = lead + replacement(w, rep) + trail
        out.append(''.join(words))
    return ''.join(out), used


def unused(extra, used):
    """A config "say" entry that matches no spoken word is a silent mispronunciation: list them, so the run stops."""
    got = {k for k, src in used if src == 'config'}
    return [k for k in (extra or {}) if k not in got and k.lower() not in got]


def risky(text, extra=None):
    """Words likely to be misread that have no entry: digits (except plain numbers and years, which Kokoro reads right), inner
    hyphens, inner dots (Node.js), ALL-CAPS or camelCase. Add each to say.json (shared terms) or the config's "say" (once checked, even as itself)."""
    out = []
    for w in MARK.sub(' ', text).split():
        k = key(w)
        if not k or lookup(w, extra) or re.fullmatch(r'\d{1,3}(,\d{3})+|\d+(\.\d+)?|\d+s', k): continue
        if re.search(r'\d', k) or '-' in k or re.search(r'\w\.\w', k) or re.fullmatch(r"[A-Z]{2,}s?", k) or re.search(r'[a-z][A-Z]', k):
            if k not in out: out.append(k)
    return out


def label(used):
    return ', '.join(k + (' (year)' if src == 'year' else ' (config)' if src == 'config' else '') for k, src in used)


def spoken_texts(cfg, path=None):
    """Every text a config's reel speaks: voice.text (web, Turns Out), lines (tech), and voice cues written in its scene."""
    out = []
    v = cfg.get('voice')
    if isinstance(v, dict) and v.get('text'): out.append(v['text'])
    if cfg.get('lines'): out.append(' '.join(l['text'] for l in cfg['lines']))
    if path:
        html = re.sub(r'\.json$', '.html', path)
        if os.path.exists(html):
            src = open(html, encoding='utf-8').read()
            out += [a or b for a, b in re.findall(r"k: *'voice'[^}]*?text: *'([^']*)'|text: *'([^']*)'[^}]*?k: *'voice'", src)]
    return out


def report(cfg, path=None):
    """(the PRONUNCIATION line, ok). ok is False when a config "say" entry matches no spoken word."""
    extra = cfg.get('say') or {}
    used, check = [], []
    for t in spoken_texts(cfg, path):
        for u in apply(t, extra)[1]:
            if u not in used: used.append(u)
        check += [w for w in risky(t, extra) if w not in check]
    bad = unused(extra, used)
    line = f'PRONUNCIATION: {len(used)} overrides used' + (f': {label(used)}' if used else '')
    line += '; check: ' + ', '.join(check) if check else '; no unchecked words'
    if bad: line += f'; "say" entries match no spoken word: {", ".join(bad)}'
    return line, not bad


if __name__ == '__main__':
    p = sys.argv[1]
    line, ok = report(json.load(open(p, encoding='utf-8')), p)
    print(line)
    sys.exit(0 if ok else 1)
