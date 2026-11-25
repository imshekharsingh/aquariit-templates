#!/usr/bin/env python3
# Inline three.js r149 into techkit/scenes/test-3d-quality.html -> out/3dtest/scene.html (one self-contained file), like techkit/make.py does.
import os
os.makedirs('out/3dtest', exist_ok=True)
html = open('techkit/scenes/test-3d-quality.html').read()
lib = open('techkit/vendor/three-0.149.0.min.js').read()
open('out/3dtest/scene.html', 'w').write(html.replace('<!--THREE-->', '<script>' + lib + '</script>', 1))
print('out/3dtest/scene.html')
