// axe colour-contrast check at 1440 and 412 after scrolling the whole page; prints every failing node with its ratio.
// Usage: node scripts/qa/contrast.mjs (serves: http://localhost:4173)
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM });
for (const [w, h] of [[1440, 900], [412, 839]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  await page.goto("http://localhost:4173/", { waitUntil: "load" });
  await page.waitForTimeout(1800);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 600) { await page.evaluate((t) => window.scrollTo(0, t), y); await page.waitForTimeout(30); }
  await page.waitForTimeout(800);
  const r = await new AxeBuilder({ page }).withRules(["color-contrast"]).analyze();
  console.log(`== ${w}px`);
  for (const v of r.violations) for (const n of v.nodes) {
    const d = n.any[0]?.data ?? {};
    console.log(`  ${d.contrastRatio} (need ${d.expectedContrastRatio}) fg ${d.fgColor} bg ${d.bgColor} ${d.fontSize} | ${n.target.join(" ").slice(-90)} | "${(n.html.match(/>([^<]{1,40})/)?.[1] ?? "").trim()}"`);
  }
  await ctx.close();
}
await browser.close();
