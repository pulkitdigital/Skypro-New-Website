// Faculty cut-outs: the portraits sit on one flat studio-blue backdrop, baked into the photo.
// This keys that backdrop out (transparent WebP), so the cards and the profile dialog can show
// the people in natural colour on a light card background (CSS).
//   public/media/faculty-<slug>.webp → public/media/faculty-<slug>-cutout.webp
// Only backdrop pixels connected to the image border are keyed (blue logos on the uniforms stay),
// and edge pixels are un-mixed from the blue so no blue fringe is left.
// Usage: node scripts/media/faculty-cutouts.mjs   (also run by derived-assets.mjs)
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const media = path.join(process.cwd(), "public", "media");
/** Colour distance from the backdrop: ≤ SOLID is backdrop, ≥ EDGE is the person; soft in between. */
const SOLID = 24;
const EDGE = 70;

const sources = fs.readdirSync(media).filter((f) => /^faculty-[a-z-]+\.webp$/.test(f) && !f.endsWith("-cutout.webp"));

for (const file of sources) {
  const { data, info } = await sharp(path.join(media, file)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const n = w * h;

  // backdrop colour: median of the border pixels
  const border = [];
  for (let x = 0; x < w; x++) border.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) border.push(y * w, y * w + w - 1);
  const bg = [0, 1, 2].map((c) => {
    const v = border.map((i) => data[i * 3 + c]).sort((a, b) => a - b);
    return v[v.length >> 1];
  });

  const dist = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const dr = data[i * 3] - bg[0];
    const dg = data[i * 3 + 1] - bg[1];
    const db = data[i * 3 + 2] - bg[2];
    dist[i] = Math.sqrt(dr * dr + dg * dg + db * db);
  }

  // flood fill from the border through backdrop-like pixels
  const reached = new Uint8Array(n);
  const queue = [];
  for (const i of border) if (dist[i] < EDGE && !reached[i]) (reached[i] = 1), queue.push(i);
  while (queue.length) {
    const i = queue.pop();
    const x = i % w;
    for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i - w, i + w]) {
      if (j < 0 || j >= n || reached[j] || dist[j] >= EDGE) continue;
      reached[j] = 1;
      queue.push(j);
    }
  }

  const out = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    const a = reached[i] ? Math.min(1, Math.max(0, (dist[i] - SOLID) / (EDGE - SOLID))) : 1;
    for (let c = 0; c < 3; c++) {
      // un-mix the backdrop: observed = a·person + (1 − a)·backdrop
      const v = a > 0 ? (data[i * 3 + c] - (1 - a) * bg[c]) / a : 0;
      out[i * 4 + c] = Math.round(Math.min(255, Math.max(0, v)));
    }
    out[i * 4 + 3] = Math.round(a * 255);
  }

  const target = file.replace(/\.webp$/, "-cutout.webp");
  await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .webp({ quality: 85, alphaQuality: 90 })
    .toFile(path.join(media, target));
  console.log(`${target} (backdrop rgb ${bg.join(", ")})`);
}
