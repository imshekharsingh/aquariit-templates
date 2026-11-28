#!/usr/bin/env python3
# Self-test for the Output QA NUMBERS check (scripts/qa/output-qa.py numbers_check), 15 Nov 2026. Builds small synthetic 1080x1920 clips with
# Pillow + ffmpeg and a made-up recogniser word list (no voice needed), and checks the verdicts:
#   rolled   a counter rolls 0 -> 8 before the voice says "seven"                       -> FAIL (the 12 Nov owner catch)
#   stopped  a counter rolls 0 -> 7 and stops as the voice says "seven"                 -> PASS
#   saidnext a counter reaches 8 as the voice says "seven ... eight"                     -> PASS
#   card     a still date card "22" while the voice says "twenty one" (Mona 4.3 s)      -> PASS
#   card4    a still "4" while the voice says "two" (Mona 26.1 s)                        -> PASS
#   article  a small "3" label while the voice says "one" as an article (web form 8.8 s) -> PASS
#   padlock  a closed padlock icon (square blob) while the voice says "six" / "four" (tech tag-relay 28 Nov) -> PASS (its pixels are still, so even a flickering OCR read is no counter; proven on the real tag-relay render); digit_like unit checks
#   shapes   small digit-like shapes near "six" / "seven" (tech watch-5atm)             -> PASS
# Run: python3 scripts/qa/test-numbers.py (needs ffmpeg, tesseract, numpy, Pillow). Exit 1 on any wrong verdict.
import importlib.util, os, subprocess, sys, tempfile
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('oqa', os.path.join(HERE, 'output-qa.py')); oqa = importlib.util.module_from_spec(spec)
sys.argv = [sys.argv[0]]; spec.loader.exec_module(oqa)
FONT = next((f for f in ('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf') if os.path.exists(f)), None)
FPS, DUR = 10, 6.0


def clip(path, draw_at):
    """draw_at(t, draw) paints frame t; white type on a dark ground."""
    with tempfile.TemporaryDirectory() as td:
        for i in range(int(DUR * FPS)):
            im = Image.new('RGB', (1080, 1920), (14, 16, 24)); draw_at(i / FPS, ImageDraw.Draw(im)); im.save(os.path.join(td, f'{i:04d}.png'))
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', str(FPS), '-i', os.path.join(td, '%04d.png'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', path], check=True)


def big(d, txt, y=520, size=300):
    f = ImageFont.truetype(FONT, size); w = d.textlength(txt, font=f); d.text(((1080 - w) / 2, y), txt, font=f, fill=(240, 240, 240))


def small(d, txt, x, y, size=40):
    d.text((x, y), txt, font=ImageFont.truetype(FONT, size), fill=(200, 200, 210))


def counter(stop, step=.3, start=.5):
    return lambda t, d: big(d, str(min(stop, max(0, int((t - start) / step)))))


def said(*words):   # (word, start): the recogniser's (word, start, end, probability, raw)
    return [(w, t, t + .3, .9, w) for w, t in words]


def padlock(t, d):   # a closed padlock: body, shackle, keyhole, about 150 px square (it flips between a 6-like and an 8-like read)
    x, y = 530, 900
    d.rounded_rectangle((x, y + 70, x + 150, y + 190), 18, outline=(230, 230, 230), width=14)
    d.arc((x + 25, y, x + 125, y + 140), 180, 360, fill=(230, 230, 230), width=14)
    d.ellipse((x + 65, y + 110, x + 85, y + 130), fill=(230, 230, 230))


CASES = [   # name, frame painter, heard, expected
    ('rolled', counter(8), said(('it', 3.0), ('took', 3.2), ('seven', 3.4), ('tries', 3.7)), 'FAIL'),   # 8 shows at 2.9 s
    ('stopped', counter(7), said(('it', 3.0), ('took', 3.2), ('seven', 3.4), ('tries', 3.7)), 'PASS'),
    ('saidnext', counter(8, step=.4), said(('seven', 3.1), ('then', 3.4), ('eight', 3.6)), 'PASS'),   # 7 at 3.3 s, 8 at 3.7 s
    ('card', lambda t, d: big(d, '22'), said(('on', 2.8), ('the', 3.0), ('twenty', 3.2), ('one', 3.5), ('august', 3.7)), 'PASS'),
    ('card4', lambda t, d: big(d, '4'), said(('just', 3.0), ('two', 3.2), ('men', 3.4)), 'PASS'),
    ('article', lambda t, d: (small(d, '3', 90, 300), small(d, 'step', 130, 300)), said(('one', 3.0), ('field', 3.2), ('breaks', 3.5)), 'PASS'),
    ('padlock', padlock, said(('six', 2.5), ('then', 3.0), ('four', 4.0)), 'PASS'),
    ('shapes', lambda t, d: (small(d, '6' if t < 3 else '7', 500, 900, 44), d.ellipse((400, 1000, 470, 1070), outline=(220, 220, 220), width=8)),
     said(('six', 2.5), ('then', 2.8), ('seven', 3.0)), 'PASS'),
]


def main():
    bad = 0
    for n, w, h, want in ((1, 180, 300, True), (1, 190, 180, False), (1, 150, 150, False), (2, 380, 300, True), (3, 560, 300, True), (1, 25, 300, False)):
        ok = oqa.digit_like(n, w, h) == want; bad += not ok
        print(f'{"ok  " if ok else "WRONG"} digit_like({n}, {w}, {h}) want {want}')
    with tempfile.TemporaryDirectory() as td:
        for name, paint, heard, want in CASES:
            p = os.path.join(td, name + '.mp4'); clip(p, paint)
            n = len(oqa.out); oqa.numbers_check(p, '', heard, (.66, .84)); got = oqa.out[n] if len(oqa.out) > n else ''
            ok = got.startswith(f'NUMBERS: {want}') or f'NUMBERS: {want}' in got
            bad += not ok
            print(f'{"ok  " if ok else "WRONG"} {name:9s} want {want}: {got}', flush=True)
    print('NUMBERS self-test:', 'PASS' if not bad else f'FAIL ({bad} wrong)')
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
