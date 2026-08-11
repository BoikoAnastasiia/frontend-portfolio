#!/usr/bin/env bash
# Sizes and converts the PNGs left by capture-screens.mjs, then removes them.
#
# The screens sit two to a row on desktop, so 1100px covers a 2x render of a
# half-width column; phones are narrower still.
set -euo pipefail
cd "$(dirname "$0")/.."

shopt -s nullglob
for f in public/media/*/*.png; do
  case "$f" in
    *mobile*) width=620 ;;
    *) width=1100 ;;
  esac
  ffmpeg -y -v error -i "$f" -vf "scale=$width:-2" -c:v mjpeg -q:v 4 "${f%.png}.jpg"
  rm -f "$f"
done

du -sh public/media
