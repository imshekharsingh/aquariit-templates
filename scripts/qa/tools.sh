#!/usr/bin/env bash
# Tools for scripts/qa/output-qa.py on a GitHub runner: ffmpeg (already there in the render jobs), tesseract (the numbers check),
# numpy + Pillow, and faster-whisper (the voice checks). A slow apt mirror only skips the numbers check (it says SKIP), never the run.
if ! command -v ffmpeg >/dev/null && ! timeout 180 sudo apt-get install -y --no-install-recommends ffmpeg; then
  python3 -m pip install --quiet --target "$RUNNER_TEMP/iff" imageio-ffmpeg==0.6.0
  f=$(find "$RUNNER_TEMP/iff" -type f -name "ffmpeg-*" | head -1); chmod +x "$f"; sudo ln -sf "$f" /usr/local/bin/ffmpeg
fi
command -v tesseract >/dev/null || timeout 180 sudo apt-get install -y --no-install-recommends tesseract-ocr || echo "::warning::tesseract unavailable: the NUMBERS check will SKIP"
python3 -m pip install --quiet numpy==2.1.3 Pillow==11.0.0 faster-whisper==1.1.1
