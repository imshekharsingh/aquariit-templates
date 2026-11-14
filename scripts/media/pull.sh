#!/usr/bin/env bash
# Pull a reel's real media from R2 (media/<name>/<file>, written by the Media workflow) next to its scene, at render time on GitHub.
# Usage: bash scripts/media/pull.sh <config.json>
#   Turns Out / showreel config -> scripts/channel3/media/<name>/ (the scene loads "media/<name>/<file>")
#   tech topic (techreel/topics/<slug>.json) -> techreel/media/<slug>/
# Needs CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID and `npm ci`. Nothing to do (exit 0) for a config without "media".
set -euo pipefail
CFG=$1
read -r NAME DEST FILES < <(python3 -I - "$CFG" <<'PY'
import json, os, sys
p = sys.argv[1]; c = json.load(open(p)); m = [e for e in c.get('media', []) if e.get('file')]
if 'slug' in c and 'name' not in c: n, d = 'showreel-tech-' + c['slug'], f"techreel/media/{c['slug']}"
else: n = c['name']; d = os.path.join(os.path.dirname(c.get('seek') or p), 'media', n)
fs = [f for e in m for f in (e['file'], e.get('fg')) if f]
print(n, d, ','.join(fs) or '-')
PY
)
[ "$FILES" = - ] && { echo "MEDIA PULL: none in $CFG"; exit 0; }
mkdir -p "$DEST"
IFS=, read -ra L <<<"$FILES"
for f in "${L[@]}"; do bash scripts/r2.sh get "media/$NAME/$f" "$DEST/$f" && [ -s "$DEST/$f" ] || { echo "::error::media/$NAME/$f not in R2 (run the Media workflow)"; exit 1; }; done
echo "MEDIA PULL: ${#L[@]} files -> $DEST"
