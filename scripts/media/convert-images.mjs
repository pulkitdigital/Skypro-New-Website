// Converts downloaded homepage images to WebP (max 1920px wide) into public/media.
// Usage: node convert-images.mjs <manifest.json> <rawDir> <outDir>
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const [manifestPath, rawDir, outDir] = process.argv.slice(2);
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const report = [];

for (const [src, name, section] of manifest.items) {
  const ext = path.extname(src).toLowerCase();
  if (ext === ".mp4") continue;
  const raw = path.join(rawDir, name.replaceAll("/", "__") + ext);
  const dest = path.join(outDir, name + (ext === ".svg" ? ".svg" : ".webp"));
  fs.mkdirSync(path.dirname(dest), { recursive: true });

  if (ext === ".svg") {
    fs.copyFileSync(raw, dest);
    report.push({ src, file: path.relative(outDir, dest), section, width: null, height: null, bytes: fs.statSync(dest).size });
    continue;
  }

  const img = sharp(raw, { animated: false });
  const meta = await img.metadata();
  const isGraphic = name.startsWith("icons/") || name.startsWith("brand/") || meta.hasAlpha;
  const pipeline = img
    .rotate()
    .resize({ width: 1920, withoutEnlargement: true })
    .webp(isGraphic ? { quality: 90, alphaQuality: 100, effort: 6 } : { quality: 80, effort: 6, smartSubsample: true });
  const info = await pipeline.toFile(dest);
  report.push({ src, file: path.relative(outDir, dest).replaceAll("\\", "/"), section, width: info.width, height: info.height, bytes: info.size, hasAlpha: !!meta.hasAlpha });
}

// White logo variant for the transparent header over the hero video:
// navy/dark pixels become white, amber pixels are kept.
{
  const raw = path.join(rawDir, "brand__logo-skypro.png");
  const { data, info } = await sharp(raw).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    const isAmber = r > 150 && g > 100 && b < 120 && r - b > 80;
    if (!isAmber) { data[i] = 255; data[i + 1] = 255; data[i + 2] = 255; }
  }
  const dest = path.join(outDir, "brand/logo-skypro-white.webp");
  const out = await sharp(data, { raw: info }).webp({ quality: 95, alphaQuality: 100 }).toFile(dest);
  report.push({ src: "(derived from logo)", file: "brand/logo-skypro-white.webp", section: "header (over video)", width: out.width, height: out.height, bytes: out.size, hasAlpha: true });
}

// Favicon PNG copies (Next.js app/icon.png + apple-icon.png are created from these in Phase 2)
{
  const raw = path.join(rawDir, "brand__site-icon.png");
  for (const size of [512, 180, 32]) {
    const dest = path.join(outDir, `brand/site-icon-${size}.png`);
    const out = await sharp(raw).resize(size, size).png({ compressionLevel: 9 }).toFile(dest);
    report.push({ src: "(derived from site icon)", file: `brand/site-icon-${size}.png`, section: "favicon", width: out.width, height: out.height, bytes: out.size });
  }
}

fs.writeFileSync(path.join(rawDir, "..", "image-report.json"), JSON.stringify(report, null, 1));
let total = 0;
for (const r of report) { total += r.bytes; console.log(`${String(r.width).padStart(5)}x${String(r.height).padEnd(5)} ${String(Math.round(r.bytes / 1024)).padStart(5)} KB  ${r.file}`); }
console.log(`TOTAL ${report.length} files, ${(total / 1024 / 1024).toFixed(2)} MB`);
