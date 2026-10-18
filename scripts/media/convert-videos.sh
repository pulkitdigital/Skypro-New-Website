#!/usr/bin/env bash
# Compresses hero + testimonial videos into public/media/video.
# Usage: convert-videos.sh <ffmpeg> <rawDir> <outDir>
set -u
FF="$1"; RAW="$2"; OUT="$3"
mkdir -p "$OUT/video" "$OUT/video/testimonials"
Q=(-hide_banner -loglevel error -y)
X264=(-c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p -movflags +faststart)
AAC=(-c:a aac -b:a 96k -ac 2)

# Hero (desktop, 16:9). Audio kept: the source has speech + music and the hero has a sound toggle.
D="$RAW/video__hero-video-src-desktop.mp4"
"$FF" "${Q[@]}" -i "$D" -vf "scale=1920:1080,setsar=1" "${X264[@]}" -crf 26 -maxrate 1000k -bufsize 2000k "${AAC[@]}" "$OUT/video/hero-video-1080.mp4" && echo "done hero-1080"
"$FF" "${Q[@]}" -i "$D" -vf "scale=1280:720,setsar=1" "${X264[@]}" -crf 27 -maxrate 650k -bufsize 1300k "${AAC[@]}" "$OUT/video/hero-video-720.mp4" && echo "done hero-720"
"$FF" "${Q[@]}" -i "$D" -vf "scale=1920:1080,setsar=1" -c:v libvpx-vp9 -b:v 780k -maxrate 1100k -bufsize 2200k -deadline good -cpu-used 4 -row-mt 1 -c:a libopus -b:a 80k "$OUT/video/hero-video-1080.webm" && echo "done hero-webm"
"$FF" "${Q[@]}" -ss 2.0 -i "$D" -frames:v 1 -vf "scale=1920:1080" "$OUT/video/_hero-poster.png" && echo "done hero-poster"

# Hero (mobile, 9:16). Source is anamorphic 1080x1080 with SAR 9:16 -> force square pixels.
M="$RAW/video__hero-video-src-mobile.mp4"
"$FF" "${Q[@]}" -i "$M" -vf "scale=720:1280,setsar=1" "${X264[@]}" -crf 27 -maxrate 700k -bufsize 1400k "${AAC[@]}" "$OUT/video/hero-video-mobile-720.mp4" && echo "done mobile-720"
"$FF" "${Q[@]}" -i "$M" -vf "scale=720:1280,setsar=1" -c:v libvpx-vp9 -b:v 480k -maxrate 700k -bufsize 1400k -deadline good -cpu-used 4 -row-mt 1 -c:a libopus -b:a 80k "$OUT/video/hero-video-mobile-720.webm" && echo "done mobile-webm"
"$FF" "${Q[@]}" -ss 2.5 -i "$M" -frames:v 1 -vf "scale=720:1280,setsar=1" "$OUT/video/_hero-poster-mobile.png" && echo "done mobile-poster"

# Testimonials: 9:16 content pillarboxed in 1920x1080 -> centre-crop to 608x1080, scale to 540x960.
for f in "$RAW"/video__src-testimonial-*.mp4; do
  n=$(basename "$f" .mp4); n=${n#video__src-testimonial-}
  "$FF" "${Q[@]}" -i "$f" -vf "crop=608:1080:656:0,scale=540:960,setsar=1" "${X264[@]}" -crf 28 -maxrate 900k -bufsize 1800k "${AAC[@]}" "$OUT/video/testimonials/$n.mp4" && echo "done testimonial $n"
done
echo "ALL VIDEOS DONE"
