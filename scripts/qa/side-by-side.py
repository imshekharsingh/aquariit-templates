# Side-by-side sheet for the critic (owner chat, 24 Nov 2026: the tech USB-C reel passed every check and an Opus critic, the owner called it
# horrible; only showreel-tech-ai-memory was good). One JPEG: the new reel (left column) next to its channel's GOLD reel (right column,
# design/gold.md) at the same 8 relative times (5%, 17%, ... 95% of each reel's length), each frame at phone width (390 px), with the LOOK
# numbers of both reels under the header. The critic views it and writes CRITIC: NOT READY unless the new reel matches or beats gold
# (design/critic.md question 43).
# Usage: python3 scripts/qa/side-by-side.py <new.mp4> [--gold <gold.mp4>] [--channel tech|web|c3] [--out <sheet.jpg>]
#   Without --gold: the channel's gold reel from scripts/qa/gold.json, fetched with scripts/reel-fetch.mjs into reel-files/.
#   --contact <mp4> [--out f.jpg]: a one-reel contact sheet instead (16 frames, 4 x 4, times printed), used for design/gold.md.
# Needs ffmpeg, numpy, Pillow.
import json, os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
W, H = 390, 693


def dur(mp4):
    t = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp4], capture_output=True, text=True).stdout
    return float(t.strip())


def frame(mp4, t):
    raw = subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-ss', f'{t:.3f}', '-i', mp4, '-frames:v', '1',
                          '-vf', f'scale={W}:{H}:flags=area', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True, check=True).stdout
    return Image.fromarray(np.frombuffer(raw, np.uint8).reshape(H, W, 3)) if raw else Image.new('RGB', (W, H), (60, 0, 0))


def font(sz):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'):
        if os.path.exists(p): return ImageFont.truetype(p, sz)
    return ImageFont.load_default()


def label(im, s, sz=22):
    d = ImageDraw.Draw(im); f = font(sz); d.rectangle([0, 0, W, sz + 10], fill=(0, 0, 0)); d.text((8, 4), s, fill=(255, 220, 80), font=f)
    return im


def gold_for(channel):
    g = json.load(open(os.path.join(HERE, 'gold.json')))[channel]
    mp4 = os.path.join(ROOT, 'reel-files', g['name'] + '.mp4')
    if not os.path.exists(mp4):
        subprocess.run(['node', os.path.join(ROOT, 'scripts', 'reel-fetch.mjs'), g['name'], os.path.join(ROOT, 'reel-files')], check=True)
    return mp4


def contact(mp4, out, n=16, cols=4):
    d = dur(mp4); ts = [d * (i + .5) / n for i in range(n)]
    sw, sh = W // 2 + 40, (H // 2 + 72)
    sheet = Image.new('RGB', (cols * sw, -(-n // cols) * sh + 40), (20, 20, 20))
    ImageDraw.Draw(sheet).text((8, 8), f'{os.path.basename(mp4)}  {d:.1f} s', fill=(255, 255, 255), font=font(22))
    for i, t in enumerate(ts):
        im = label(frame(mp4, t), f'{t:.1f} s', 30).resize((sw - 6, sh - 6), Image.BOX)
        sheet.paste(im, ((i % cols) * sw + 3, 40 + (i // cols) * sh + 3))
    sheet.save(out, quality=85); print(f'contact sheet: {out}')


def main():
    a = sys.argv[1:]
    opt = lambda k, dv=None: a[a.index(k) + 1] if k in a else dv
    if '--contact' in a:
        mp4 = opt('--contact'); contact(mp4, opt('--out', os.path.splitext(mp4)[0] + '-contact.jpg')); return
    new = a[0]; ch = opt('--channel')
    if not ch:
        n = os.path.basename(new)
        ch = 'tech' if n.startswith('showreel-tech-') else 'c3' if n.startswith('showreel-c3-') else 'web'
    gold = opt('--gold') or gold_for(ch)
    out = opt('--out', os.path.splitext(new)[0] + '-vs-gold.jpg')
    sys.path.insert(0, HERE)
    import importlib.util
    spec = importlib.util.spec_from_file_location('gold_look', os.path.join(HERE, 'gold_look.py')); lg = importlib.util.module_from_spec(spec); spec.loader.exec_module(lg)
    mn, mg = lg.measure(new), lg.measure(gold)
    dn, dg = dur(new), dur(gold); rel = [(i + .5) / 8 for i in range(8)]   # 6%, 19%, ... 94%
    head = 110
    sheet = Image.new('RGB', (2 * W + 30, head + 8 * (H + 10)), (16, 16, 16)); d = ImageDraw.Draw(sheet)
    d.text((10, 6), f'NEW  {os.path.basename(new)[9:40]}', fill=(255, 255, 255), font=font(18))
    d.text((W + 30, 6), f'GOLD {os.path.basename(gold)[9:40]}', fill=(255, 220, 80), font=font(18))
    for x, m in ((10, mn), (W + 30, mg)):
        d.text((x, 34), lg.fmt(m), fill=(200, 200, 200), font=font(15))
    d.text((10, 82), 'same relative times; the critic writes NOT READY unless the left matches or beats the right', fill=(150, 150, 150), font=font(14))
    for i, r in enumerate(rel):
        y = head + i * (H + 10)
        sheet.paste(label(frame(new, r * dn), f'{r:.0%}  {r * dn:.1f} s'), (10, y))
        sheet.paste(label(frame(gold, r * dg), f'{r:.0%}  {r * dg:.1f} s'), (W + 30, y))
    sheet.save(out, quality=85); print(f'side-by-side sheet: {out}')


if __name__ == '__main__':
    main()
