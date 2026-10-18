// Full-page screenshots of the static build, captured in clipped segments and stitched with
// sharp (a single Chrome capture is limited to ~16,384px; taller pages repeat from the top).
// Usage: node scripts/qa/screenshots.mjs [baseUrl] [widths...]
//   e.g. node scripts/qa/screenshots.mjs http://localhost:4173 1440 1280 768 375
// Motion is reduced for deterministic captures; the hero video stays on its poster.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { chromium } from "@playwright/test";

const [, , baseUrl = "http://localhost:4173", ...widthArgs] = process.argv;
const widths = widthArgs.length ? widthArgs.map(Number) : [1440, 1280, 768, 375];
const outDir = path.join(process.cwd(), "screenshots");
const SEGMENT = 6000;
fs.mkdirSync(outDir, { recursive: true });

// PW_CHROMIUM lets you reuse an already-installed Chromium instead of `npx playwright install chromium`.
const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
for (const width of widths) {
  const mobile = width < 768;
  const context = await browser.newContext({
    viewport: { width, height: mobile ? 812 : 900 },
    deviceScaleFactor: 1,
    isMobile: mobile,
    hasTouch: mobile,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  // "networkidle" never settles while the hero video streams.
  await page.goto(baseUrl, { waitUntil: "load" });
  await page.waitForTimeout(1500);
  // render deferred (content-visibility) sections, trigger lazy images, return to top
  // sticky/fixed elements can't be stitched across segments: render sticky ones in place and
  // hide the fixed header, WhatsApp button and the (focus-only) skip link
  await page.addStyleTag({
    content:
      '.cv-auto{content-visibility:visible!important} [class~=sticky],[class~="lg:sticky"],.course-stack__item,.course-stack__head,.sticky-tall{position:relative!important;top:auto!important} [data-header],[data-whatsapp],a[href="#main"]{display:none!important}',
  });
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 600) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(80);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

  const parts = [];
  for (let y = 0; y < total; y += SEGMENT) {
    const h = Math.min(SEGMENT, total - y);
    parts.push({ input: await page.screenshot({ fullPage: true, clip: { x: 0, y, width, height: h } }), top: y, left: 0 });
  }
  const file = path.join(outDir, `home-${width}.png`);
  await sharp({ create: { width, height: total, channels: 3, background: "#ffffff" } }).composite(parts).png().toFile(file);
  console.log(`${width}px → ${path.relative(process.cwd(), file)} (${total}px tall, horizontal overflow: ${overflow}px)`);
  await context.close();
}
await browser.close();
