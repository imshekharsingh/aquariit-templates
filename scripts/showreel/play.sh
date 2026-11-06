#!/usr/bin/env bash
# The light copy the app plays (owner, 6 Nov 2026: "videos are too slow to start in the app"): 720x1280, 30 fps, H.264 high ~3 Mbit/s,
# AAC 128k, moov atom first (+faststart) so a phone can start after the first bytes. The full-quality <name>.mp4 stays the one that is
# saved and posted. Used by the Showreel and Tech reel workflows and by `scripts/r2.sh faststart`.
# Usage: bash scripts/showreel/play.sh <full.mp4> <name-play.mp4>
set -euo pipefail
in=$1 out=$2
ffmpeg -y -loglevel error -i "$in" -vf "scale=720:1280:flags=lanczos,fps=30" -c:v libx264 -profile:v high -preset medium \
  -b:v 3M -maxrate 3500k -bufsize 6M -g 60 -pix_fmt yuv420p -c:a aac -b:a 128k -ar 48000 -movflags +faststart "$out"
node scripts/showreel/mp4boxes.mjs "$out" --need-moov-first
