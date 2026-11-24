# LOOK (owner chat, 24 Nov 2026): the reel's light against its channel's GOLD reel (design/gold.md, numbers in scripts/qa/gold.json).
# The tech USB-C reel (showreel-tech-usbc-two-numbers) passed every other check and an Opus critic; the owner called it horrible: flat,
# washed-out grey light. Measured on the final MP4 at 2 frames a second, 135x240, luminance 0-1 (Rec.709):
#   bright  = mean luminance of the frame;            bg    = median luminance (the background level: most of a frame is background)
#   dark    = share of pixels under 0.08 (how much of the frame is deep, dark background)
#   grey    = share of mid-grey, colourless pixels (luminance 0.25-0.75, saturation under 0.18): the washed-out grey wash
#   contrast= standard deviation of luminance (a flat frame reads low)
#   accent  = the main hue (10-degree bins) of the lit, saturated pixels (S > .45, V > .35), weighted by S x V
# Each is the median over the reel's frames; plus the share of frames washed out (background over gold + .10 and dark under half gold's). A measure is OFF when it is clearly outside the gold band (T below, set 24 Nov 2026 on
# gold ai-memory / tabwiggle / grey-text, the USB-C reel and 7 other posted reels). FAIL when 2+ measures are off; one = WARN.
# Calibration (medians): tech gold ai-memory bright .154 bg .076 dark .51 grey .11 contrast .172; USB-C .328 / .208 / .19 / .21 / .269
# (5 off incl. 42 of 66 frames washed out: FAIL; gold 1 frame); heart-green .125 / .085 / .48 / .03 / .124 and wifi-button .139 / .109 / .38 / .01 / .131 (pass). Web gold tabwiggle
# .098 / .067 / .68 / .02 / .144; homebar, darkflash, tapzoom pass. Turns Out gold grey-text .352 / .233 / .32 / .05 / .343; resume passes.
import json, os, subprocess
import numpy as np

T = {'bright_add': .09, 'bg_add': .08, 'dark_mul': .55, 'grey_add': .07, 'grey_mul': 1.6, 'contrast_mul': .6, 'frame_bg_add': .10, 'frame_dark_mul': .5, 'frames_off': .25}
HERE = os.path.dirname(os.path.abspath(__file__))


def frames(mp4, fps=2, w=135, h=240):
    raw = subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-i', mp4, '-vf', f'fps={fps},scale={w}:{h}:flags=area', '-f', 'rawvideo',
                          '-pix_fmt', 'rgb24', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, h, w, 3).astype(np.float32) / 255


def measure(mp4, fps=2):
    F = frames(mp4, fps)
    L = .2126 * F[..., 0] + .7152 * F[..., 1] + .0722 * F[..., 2]
    mx, mn = F.max(-1), F.min(-1); S = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
    per = {'bright': L.mean((1, 2)), 'bg': np.median(L.reshape(len(L), -1), 1), 'dark': (L < .08).mean((1, 2)),
           'grey': ((L > .25) & (L < .75) & (S < .18)).mean((1, 2)), 'contrast': L.std((1, 2))}
    m = {k: round(float(np.median(v)), 3) for k, v in per.items()}
    r, g, b = F[..., 0], F[..., 1], F[..., 2]; d = np.where(mx - mn == 0, 1, mx - mn)
    hue = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
    sel = (S > .45) & (mx > .35)
    hist = np.bincount((hue[sel] // 10).astype(int) % 36, weights=(S * mx)[sel], minlength=36)
    m['accent'] = int(hist.argmax() * 10 + 5) if hist.sum() > 0 else None
    m['accent_share'] = round(float(sel.mean()), 4)
    m['_per'] = {k: v.round(3).tolist() for k, v in per.items()}; m['_fps'] = fps
    return m


def fmt(m):
    return (f"bright {m['bright']:.3f}  bg {m['bg']:.3f}  dark {m['dark']:.0%}\n"
            f"grey {m['grey']:.0%}  contrast {m['contrast']:.3f}  accent {m['accent']} deg")


def gold(channel):
    return json.load(open(os.path.join(HERE, 'gold.json'))).get(channel)


def judge(m, g):
    """-> (offs: list of plain reasons, off_times: seconds of frames clearly washed out vs gold)."""
    G = g['look']; offs = []
    if m['bright'] > G['bright'] + T['bright_add']: offs.append(f"brightness {m['bright']:.3f} vs gold {G['bright']:.3f} (at most {G['bright'] + T['bright_add']:.3f})")
    if m['bg'] > G['bg'] + T['bg_add']: offs.append(f"background level {m['bg']:.3f} vs gold {G['bg']:.3f} (at most {G['bg'] + T['bg_add']:.3f}): the background is lit, not dark")
    if m['dark'] < G['dark'] * T['dark_mul']: offs.append(f"dark background {m['dark']:.0%} of the frame vs gold {G['dark']:.0%} (at least {G['dark'] * T['dark_mul']:.0%})")
    if m['grey'] > max(G['grey'] + T['grey_add'], G['grey'] * T['grey_mul']): offs.append(f"washed-out grey {m['grey']:.0%} of the frame vs gold {G['grey']:.0%} (at most {max(G['grey'] + T['grey_add'], G['grey'] * T['grey_mul']):.0%})")
    if m['contrast'] < G['contrast'] * T['contrast_mul']: offs.append(f"contrast {m['contrast']:.3f} vs gold {G['contrast']:.3f} (at least {G['contrast'] * T['contrast_mul']:.3f}): flat")
    P = m['_per']; fps = m['_fps']
    bad = [i / fps for i, (b, d) in enumerate(zip(P['bg'], P['dark'])) if b > G['bg'] + T['frame_bg_add'] and d < G['dark'] * T['frame_dark_mul']]
    if len(bad) > T['frames_off'] * len(P['bg']): offs.append(f"{len(bad)} of {len(P['bg'])} frames washed out (lit background, little dark; at most {T['frames_off']:.0%})")
    return offs, bad


def spans(ts, step):
    out = []
    for t in ts:
        if out and t - out[-1][1] <= step + 1e-6: out[-1][1] = t
        else: out.append([t, t])
    return ', '.join(f'{a:.1f}-{b + step:.1f}' for a, b in out)
