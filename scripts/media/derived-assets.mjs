// Builds derived media: favicons for app/, the OG image, 540x960 poster frames
// for testimonials whose original poster is low-res, and the faculty cut-outs.
// Usage: node scripts/media/derived-assets.mjs   (FFMPEG_PATH overrides the ffmpeg binary)
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import sharp from "sharp";

const root = process.cwd();
const media = path.join(root, "public", "media");
const ffmpeg = process.env.FFMPEG_PATH || path.join(root, "node_modules", "ffmpeg-static", process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg");

// 1) Favicons → app/icon.png + app/apple-icon.png (Next.js file conventions)
fs.copyFileSync(path.join(media, "brand", "site-icon-512.png"), path.join(root, "app", "icon.png"));
fs.copyFileSync(path.join(media, "brand", "site-icon-180.png"), path.join(root, "app", "apple-icon.png"));
console.log("icons → app/icon.png, app/apple-icon.png");

// 2) OG image 1200x630: About photo + navy overlay + white logo
{
  const photo = await sharp(path.join(media, "about-academy-lounge.webp")).resize(1200, 630, { fit: "cover" }).toBuffer();
  const overlay = Buffer.from(
    `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#001F3F" stop-opacity="0.95"/><stop offset="0.65" stop-color="#001F3F" stop-opacity="0.7"/><stop offset="1" stop-color="#001F3F" stop-opacity="0.25"/></linearGradient></defs>
      <rect width="1200" height="630" fill="url(#g)"/>
      <rect x="80" y="400" width="96" height="3" fill="#F4B221"/>
    </svg>`,
  );
  const logo = await sharp(path.join(media, "brand", "logo-skypro-white.webp")).resize({ height: 168, kernel: "lanczos3" }).png().toBuffer();
  await sharp(photo)
    .composite([{ input: overlay }, { input: logo, top: 200, left: 72 }])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(media, "og-image.jpg"));
  console.log("og-image.jpg");
}

// 3) Poster frames for low-res testimonial posters
const lowRes = ["swarali-joshi", "harpreet-kaur", "naman-gupta", "puneet-kukkad"];
if (!fs.existsSync(ffmpeg)) {
  console.warn(`ffmpeg not found at ${ffmpeg} — skipping poster frames (set FFMPEG_PATH or run: npm approve-scripts ffmpeg-static && npm rebuild ffmpeg-static)`);
} else {
  for (const slug of lowRes) {
    const video = path.join(media, "video", "testimonials", `${slug}.mp4`);
    const tmp = path.join(media, "testimonials", `_${slug}.png`);
    execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", "-ss", "2.5", "-i", video, "-frames:v", "1", tmp]);
    await sharp(tmp).webp({ quality: 80 }).toFile(path.join(media, "testimonials", `${slug}-frame.webp`));
    fs.unlinkSync(tmp);
    console.log(`testimonials/${slug}-frame.webp`);
  }
}

// 4) Faculty cut-outs (studio backdrop keyed out)
await import("./faculty-cutouts.mjs");
