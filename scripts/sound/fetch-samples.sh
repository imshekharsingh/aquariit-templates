#!/usr/bin/env bash
# Recorded sound effects (owner, 12 Nov 2026: "sound elements feel cheap, as if from kids' toys"): Kenney's CC0 (public domain) audio packs,
# downloaded on the GitHub runner (cached by actions/cache) and converted to 48 kHz mono WAV for scripts/showreel/samples.py.
# Usage: bash scripts/sound/fetch-samples.sh <dir>. A pack is kept only when its own License.txt says CC0 / Creative Commons Zero.
# Never fails the run: when nothing could be fetched the engines fall back to the synthesized sounds and print "SOUND SOURCE: synthesized".
D="${1:?usage: fetch-samples.sh <dir>}"   # created only once a pack is in, so actions/cache never saves an empty folder
if [ -f "$D/SOURCE.txt" ] && ls "$D"/*/*.wav >/dev/null 2>&1; then echo "SAMPLES: cached"; cat "$D/SOURCE.txt"; exit 0; fi
T=$(mktemp -d)
for P in interface-sounds impact-sounds rpg-audio ui-audio; do
  page=$(curl -fsSL --retry 3 -m 60 "https://kenney.nl/assets/$P") || { echo "SAMPLES: $P page not reachable"; continue; }
  url=$(printf '%s' "$page" | grep -oE "(https://kenney\.nl)?/media/pages/assets/$P/[^\"' ]+\.zip" | head -1)
  [ -n "$url" ] || url=$(printf '%s' "$page" | grep -oE "[^\"' ]+kenney_[^\"' ]*\.zip" | head -1)
  [ -n "$url" ] || { echo "SAMPLES: $P no download link on its page"; continue; }
  case "$url" in /*) url="https://kenney.nl$url";; esac
  curl -fsSL --retry 3 -m 120 -o "$T/$P.zip" "$url" || { echo "SAMPLES: $P download failed"; continue; }
  mkdir -p "$T/$P" && unzip -q -o "$T/$P.zip" -d "$T/$P" || { echo "SAMPLES: $P unzip failed"; continue; }
  lic=$(find "$T/$P" -iname 'licen*' -type f | head -1)
  if [ -z "$lic" ] || ! grep -qiE 'CC0|creative commons zero|public domain' "$lic"; then echo "SAMPLES: $P skipped (no CC0 licence file)"; continue; fi
  mkdir -p "$D/$P"; n=0
  while IFS= read -r f; do
    b=$(basename "${f%.*}" | tr 'A-Z' 'a-z' | tr -c 'a-z0-9_\n' '_')
    ffmpeg -nostdin -loglevel error -y -i "$f" -ac 1 -ar 48000 -c:a pcm_s16le "$D/$P/$b.wav" && n=$((n + 1))
  done < <(find "$T/$P" -type f \( -iname '*.ogg' -o -iname '*.wav' \))
  cp "$lic" "$D/$P/LICENSE.txt"
  echo "$P: $n sounds, CC0 (licence: $(grep -m1 -oiE 'CC0[^.]*|creative commons zero[^.]*' "$lic")), from $url" | tee -a "$D/SOURCE.txt"
done
rm -rf "$T"
[ -f "$D/SOURCE.txt" ] || echo "SAMPLES: none fetched; the engines use the synthesized fallback"
exit 0
