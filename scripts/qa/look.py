# CALM, HUE, SPLIT and SPREAD (Output QA, scripts/qa/output-qa.py) on local frames before the one render: the scene is a pure function of t, so its seeks are the
# video's frames (15 Nov 2026; owner: web reels "too wiggly", main frame "similar colour grading"). Same functions as the GitHub check.
# Margin (15 Nov 2026): the render's motion blur and real voice timings read SPLIT lower than these frames (follow 2.27x here, 1.78x on run
# 43733641343; form 2.25x here, 2.10x / 1.45x after a chip change): aim for 2.5x+ and BEFORE 9%+ here. CALM and HUE matched the render.
# Usage: node scripts/qa/frames.mjs <config> <dir>; python3 scripts/qa/look.py <config> <dir>   (prints the OQA CALM, HUE and SPLIT lines, the hue for demo-hues.json;
#   a Turns Out config: FILL, ELEMENTS and REUSE)
# Tech kit topics (15 Nov 2026: SHEEN and HERO): KIT_SCALE=0.25 node techkit/capture.cjs out/techreel/<slug>/scene.html <dir> 10 0 <frames>
# (after make.py --fake-vo wrote scene.html; it records subject_0.json), then python3 scripts/qa/look.py techreel/topics/<slug>.json <dir>
import glob, importlib.util, json, os, sys
import numpy as np
from PIL import Image
spec = importlib.util.spec_from_file_location('oqa', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'output-qa.py'))
oqa = importlib.util.module_from_spec(spec); spec.loader.exec_module(oqa)
cfgp, d = sys.argv[1], sys.argv[2]; c = json.load(open(cfgp)); qa = c.get('qa') or {}
name = c.get('name') or f"showreel-tech-{c['slug']}"
fs = sorted(glob.glob(os.path.join(d, 'f*.jpg')))
F = np.stack([np.asarray(Image.open(f).convert('RGB').resize((270, 480), Image.BOX)) for f in fs])
G = np.stack([np.asarray(Image.open(f).convert('L').resize((135, 240), Image.BOX)) for f in fs])
mp4 = os.path.join(d, name + '.mp4')   # never written: demo_boxes reads <name>.subject*.json next to it
if 'slug' in c:   # a tech kit topic: the subject boxes capture.cjs wrote, in the render's file name
    rows = sorted(sum((json.load(open(f)) for f in glob.glob(os.path.join(d, 'subject_*.json'))), []))
    if rows: json.dump(rows, open(os.path.join(d, name + '.subject0.json'), 'w'))
    oqa.sheen_check(G, 10); oqa.hero_check(F, 10, mp4); sys.exit(1 if oqa.fails else 0)
if '/channel3/' in cfgp or name.startswith('showreel-c3-'):   # Turns Out (16 Nov 2026): FILL, ELEMENTS and REUSE on the scene's own frames
    oqa.fill_check(G, 10); oqa.elements_check(G, 10, qa.get('subs') or oqa.T['subs']['c3']); oqa.reuse_check(c); sys.exit(1 if oqa.fails else 0)
oqa.hue_check(F, 10, mp4, qa, name); oqa.calm_check(G, 10, mp4, qa); oqa.split_check(G, 10, mp4); oqa.spread_check(F, 10); oqa.focus_check(F, 10, qa)   # SPREAD (18 Nov 2026: showreel-40-expensive's first render failed it; it reads the same on the scene's frames)
rows, _ = oqa.demo_boxes(mp4, qa); e = oqa.calm_series(G, 10, qa.get('band') or oqa.T['calm_band'])
print(f'LOOK {name}: hue {oqa.demo_hue(F, 10, rows)[0]} (demo-hues.json), calm median {np.median(e):.3f} mean {e.mean():.3f}')
