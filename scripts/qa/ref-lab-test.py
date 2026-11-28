#!/usr/bin/env python3
"""Test of scripts/qa/ref-lab.py on synthetic videos made with ffmpeg lavfi (nothing to download):
  A. a moving background inside black bars and a static bottom strip      -> CROP finds the moving area
  B. a box easing in with overshoot at 1.0 s, three tone bursts (120 Hz at 0.5 s, 800 Hz at 2.0 s, 5 kHz at 4.0 s),
     a text line fading in at 3.0 s                                         -> MOVES, HITS by kind, TEXT LIFE
  python3 scripts/qa/ref-lab-test.py        (skips with a note when ffmpeg or numpy is missing)
"""
import importlib.util, os, shutil, subprocess, sys, tempfile

try:
    import numpy  # noqa: F401
except ImportError:
    print('ref-lab-test: SKIP (numpy missing)'); sys.exit(0)
if not shutil.which('ffmpeg'):
    print('ref-lab-test: SKIP (ffmpeg missing)'); sys.exit(0)

here = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('lab', os.path.join(here, 'ref-lab.py'))
lab = importlib.util.module_from_spec(spec); spec.loader.exec_module(lab)
fails = []


def check(ok, what):
    print(('ok   ' if ok else 'FAIL ') + what)
    if not ok:
        fails.append(what)


def ff(*a):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-y', *a], capture_output=True, text=True)
    if r.returncode:
        print(r.stderr); sys.exit('ffmpeg failed')


with tempfile.TemporaryDirectory() as td:
    A, B = os.path.join(td, 'a.mp4'), os.path.join(td, 'b.mp4')
    # A: 360x640 moving pattern, padded into 400x800 with a 20 px / 100 px black border, a static light strip over the bottom 60 px
    ff('-f', 'lavfi', '-i', "color=c=gray:s=360x640:r=10:d=4,geq=r='128+90*sin(X/25+3*T)':g='128+90*sin(Y/30+4*T)':b='128+60*sin((X+Y)/40+2*T)'",
       '-vf', 'pad=400:800:20:100:black,drawbox=x=0:y=740:w=400:h=60:color=0xdddddd:t=fill', '-pix_fmt', 'yuv420p', A)
    # B: static bg, white box easing in with overshoot (easeOutBack, 0.7 s from 1.0 s), tone bursts, a text line fading in at 3.0 s
    ease = "1+2.70158*pow(min(max((t-1)/0.7,0),1)-1,3)+1.70158*pow(min(max((t-1)/0.7,0),1)-1,2)"
    vf = (f"[0:v][1:v]overlay=x='20+230*({ease})':y=300:eval=frame,"
          "drawtext=text='LAB TEXT':x=(w-text_w)/2:y=120:fontsize=64:fontcolor=white:alpha='if(lt(t,3),0,min(1,(t-3)/0.4))'[v]")
    ff('-f', 'lavfi', '-i', 'color=c=0x202030:s=360x640:r=30:d=6', '-f', 'lavfi', '-i', 'color=c=white:s=90x90:r=30:d=6',
       '-f', 'lavfi', '-i', 'sine=f=120:d=0.12', '-f', 'lavfi', '-i', 'sine=f=800:d=0.1', '-f', 'lavfi', '-i', 'sine=f=5000:d=0.08',
       '-filter_complex', vf + ";[2]adelay=500|500[a];[3]adelay=2000|2000[b];[4]adelay=4000|4000[c];[a][b][c]amix=inputs=3:normalize=0,apad=whole_dur=6[aud]",
       '-map', '[v]', '-map', '[aud]', '-t', '6', '-pix_fmt', 'yuv420p', B)

    pw, ph, _ = lab.probe(A)
    crop, note = lab.find_crop(A, pw, ph)
    print('CROP', crop, note)
    check(abs(crop[0] - 20) <= 6 and abs(crop[1] - 100) <= 6 and abs(crop[2] - 360) <= 8 and abs(crop[3] - 640) <= 8, f'crop finds the moving area (20,100,360,640), got {crop}')

    pw, ph, dur = lab.probe(B)
    moves, _ = lab.motion(B, (0, 0, pw, ph))
    big = [m for m in moves if 0.8 <= m['start'] <= 1.5 and m['travel'] >= 25]
    print('MOVES', [(round(m['start'], 2), round(m['dur'], 2), round(m['travel']), m['ease'], round(m['over'])) for m in moves])
    check(len(big) == 1, 'the box move is found once (starts near 1.0 s, travels over 25 % of the frame)')
    if big:
        m = max(big, key=lambda x: x['travel'])
        check(m['ease'] == 'overshoot + settle' and m['over'] >= 5, f"the box move is an overshoot with settle (got {m['ease']}, {m['over']:.0f} %)")
        check(0.3 <= m['dur'] <= 1.0, f"the box move lasts about 0.7 s (got {m['dur']:.2f})")

    sd = lab.ac.sound_hits(B)
    hits = lab.hit_kinds(sd) if sd else []
    print('HITS', [(round(h['t'], 2), h['band'], round(h['ms']), round(h['db'], 1)) for h in hits])
    for t, band in ((0.5, 'low'), (2.0, 'mid'), (4.0, 'high')):
        near = [h for h in hits if abs(h['t'] - t) < 0.12]
        check(bool(near) and near[0]['band'] == band, f'a {band} hit at {t} s')

    G = lab.grab(B, (0, 0, pw, ph), 2.8, 4.2, 360, 640)
    tl = lab.text_life(G)
    print('TEXT', tl)
    check(tl is not None and tl['how'] == 'fade', f"the text line arrives as a fade (got {tl and tl['how']})")
    check(tl is not None and 100 <= tl['line_px'] <= 250, f"its line height is about 145 px at 1080 wide (got {tl and tl['line_px']})")

    out = subprocess.run([sys.executable, os.path.join(here, 'ref-lab.py'), '--no-strips', 'ref-1=' + B, 'ours=' + B], capture_output=True, text=True)
    check(out.returncode == 0 and 'SCORECARD' in out.stdout and 'GAP' in out.stdout and out.stdout.count('KEY ') >= 4, 'the full run prints CROP, MOVES, HITS, KEY lines, the scorecard and GAP lines')
    if out.returncode:
        print(out.stderr)

print('ref-lab-test: ' + ('FAILED: ' + '; '.join(fails) if fails else 'all passed'))
sys.exit(1 if fails else 0)
