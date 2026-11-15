# CALM, HUE and SPLIT (Output QA, scripts/qa/output-qa.py) on local frames before the one render: the scene is a pure function of t, so its seeks are the
# video's frames (15 Nov 2026; owner: web reels "too wiggly", main frame "similar colour grading"). Same functions as the GitHub check.
# Margin (15 Nov 2026): the render's motion blur and real voice timings read SPLIT lower than these frames (follow 2.27x here, 1.78x on run
# 43733641343; form 2.25x here, 2.10x / 1.45x after a chip change): aim for 2.5x+ and BEFORE 9%+ here. CALM and HUE matched the render.
# Usage: node scripts/qa/frames.mjs <config> <dir>; python3 scripts/qa/look.py <config> <dir>   (prints the OQA CALM, HUE and SPLIT lines, the hue for demo-hues.json)
import glob, importlib.util, json, os, sys
import numpy as np
from PIL import Image
spec = importlib.util.spec_from_file_location('oqa', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'output-qa.py'))
oqa = importlib.util.module_from_spec(spec); spec.loader.exec_module(oqa)
cfgp, d = sys.argv[1], sys.argv[2]; c = json.load(open(cfgp)); name = c['name']; qa = c.get('qa') or {}
fs = sorted(glob.glob(os.path.join(d, 'f*.jpg')))
F = np.stack([np.asarray(Image.open(f).convert('RGB').resize((270, 480), Image.BOX)) for f in fs])
G = np.stack([np.asarray(Image.open(f).convert('L').resize((135, 240), Image.BOX)) for f in fs])
mp4 = os.path.join(d, name + '.mp4')   # never written: demo_boxes reads <name>.subject*.json next to it
oqa.hue_check(F, 10, mp4, qa, name); oqa.calm_check(G, 10, mp4, qa); oqa.split_check(G, 10, mp4)
rows, _ = oqa.demo_boxes(mp4, qa); e = oqa.calm_series(G, 10, qa.get('band') or oqa.T['calm_band'])
print(f'LOOK {name}: hue {oqa.demo_hue(F, 10, rows)[0]} (demo-hues.json), calm median {np.median(e):.3f} mean {e.mean():.3f}')
