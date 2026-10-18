// Prints rendered section heights at phone/tablet/desktop widths — paste into lib/sectionSizes.ts
// after big content changes. Usage: node scripts/qa/section-heights.mjs [baseUrl=http://localhost:4173]
import { chromium } from "@playwright/test";

const base = process.argv[2] || "http://localhost:4173";
const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
const result = {};
for (const width of [390, 820, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
  await page.goto(base);
  // render every content-visibility section before measuring
  await page.addStyleTag({ content: ".cv-auto{content-visibility:visible!important}" });
  await page.waitForTimeout(600);
  const heights = await page.evaluate(() =>
    Object.fromEntries(
      [...document.querySelectorAll("main > section, body > footer")].map((s) => [s.id || "footer", Math.round(s.getBoundingClientRect().height)]),
    ),
  );
  for (const [id, h] of Object.entries(heights)) (result[id] ??= []).push(h);
  await page.close();
}
await browser.close();
for (const [id, hs] of Object.entries(result)) console.log(`  ${JSON.stringify(id)}: [${hs.join(", ")}],`);
