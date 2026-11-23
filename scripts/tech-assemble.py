"""Assemble a kit scene for a local look without the voice: python3 scripts/tech-assemble.py <slug>
Needs out/techreel/<slug>/timeline.js (from python3 techkit/make.py <slug> --fake-vo --stills ...). Rewrites only scene.html."""
import json, os, sys
slug = sys.argv[1]; t = json.load(open(f'techreel/topics/{slug}.json')); html = open(t['scene']).read()
html = html.replace('<!--THREE-->', '<script>' + open('techkit/vendor/three-0.149.0.min.js').read() + '</script>', 1)
html = html.replace('<!--KIT3D-->', '<script>' + open('techkit/kit3d.js').read() + '</script>', 1)
open(f'out/techreel/{slug}/scene.html', 'w').write(html)
