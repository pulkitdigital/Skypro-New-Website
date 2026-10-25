// Screenshots of selected sections at 1440 and 375, stacked into one PNG per width.
// Motion is reduced (static, deterministic); the fixed header, WhatsApp button and the dev
// overlay are hidden so they don't cover section tops.
// Usage: node scripts/qa/section-shots.mjs <name> <url> <selector> [selector…]
//   e.g. node scripts/qa/section-shots.mjs group-1 http://localhost:3000 "#about" "#courses"
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";
import sharp from "sharp";

const [, , name = "sections", url = "http://localhost:3000", ...selectors] = process.argv;
const outDir = path.join("screenshots", "redesign");
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || undefined });
for (const width of [1440, 375]) {
  const mobile = width < 768;
  const context = await browser.newContext({
    viewport: { width, height: mobile ? 812 : 900 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
    isMobile: mobile,
    hasTouch: mobile,
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "load" });
  await page.addStyleTag({
    content:
      ".cv-auto{content-visibility:visible!important} [class~=sticky],[class~=\"lg:sticky\"],.course-stack__item{position:relative!important;top:auto!important} [data-header],[data-whatsapp],nextjs-portal,a[href=\"#main\"]{display:none!important}",
  });
  await page.waitForTimeout(800);

  const shots = [];
  for (const selector of selectors) {
    const section = page.locator(selector).first();
    await section.scrollIntoViewIfNeeded();
    // walk through the section so lazy images start loading, then wait for them
    const { start, height } = await section.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { start: r.top + window.scrollY, height: r.height };
    });
    for (let y = 0; y < height; y += 600) {
      await page.evaluate((top) => window.scrollTo(0, top), start + y);
      await page.waitForTimeout(60);
    }
    await section.evaluate(async (el) => {
      const imgs = Array.from(el.querySelectorAll("img"));
      imgs.forEach((img) => (img.loading = "eager"));
      await Promise.all(imgs.map((img) => (img.complete ? null : new Promise((r) => ((img.onload = r), (img.onerror = r))))));
    });
    // back to the section top, so sticky elements sit where a visitor first sees them
    await page.evaluate((top) => window.scrollTo(0, top), start);
    await page.waitForTimeout(300);
    // clipped full-page capture (element screenshots of tall sections are unreliable in mobile emulation)
    const clip = await section.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { x: 0, y: Math.round(r.top + window.scrollY), width: document.documentElement.clientWidth, height: Math.round(r.height) };
    });
    shots.push(await page.screenshot({ fullPage: true, clip, animations: "disabled" }));
  }

  const metas = await Promise.all(shots.map((buf) => sharp(buf).metadata()));
  const height = metas.reduce((sum, m) => sum + (m.height ?? 0), 0);
  let top = 0;
  const composite = shots.map((input, i) => {
    const item = { input, top, left: 0 };
    top += metas[i]?.height ?? 0;
    return item;
  });
  const file = path.join(outDir, `${name}-${width}.png`);
  await sharp({ create: { width, height, channels: 3, background: "#ffffff" } })
    .composite(composite)
    .png()
    .toFile(file);
  console.log(`${file} (${width}×${height})`);
  await context.close();
}
await browser.close();
