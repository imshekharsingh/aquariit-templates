#!/usr/bin/env python3
# Inline three.js r149 + the 3D kits into a standalone scene -> out/3dkit/scene.html (like techkit/make.py does).
# python3 scripts/3dkit-assemble.py [techkit/scenes/kit3d-phase1-demo.html]
import os, sys
src = sys.argv[1] if len(sys.argv) > 1 else 'techkit/scenes/kit3d-phase1-demo.html'
os.makedirs('out/3dkit', exist_ok=True)
html = open(src).read()
for marker, f in (('<!--THREE-->', 'vendor/three-0.149.0.min.js'), ('<!--KIT3D-->', 'kit3d.js'), ('<!--WORLD3D-->', 'world3d.js')):
    if marker in html: html = html.replace(marker, '<script>' + open('techkit/' + f).read() + '</script>', 1)
open('out/3dkit/scene.html', 'w').write(html)
print('out/3dkit/scene.html')
