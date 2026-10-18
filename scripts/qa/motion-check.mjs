// Runtime check of the animated build on :4173 — console errors, preloader/intro, pins,
// reveals completing, and viewport snapshots mid-animation.
// Usage: node scripts/qa/motion-check.mjs [width=1440] [outDir=screenshots/motion] [reduce]
import fs from "node:fs";
import { chromium } from "@playwright/test";

const width = Number(process.argv[2] || 1440);
const outDir = process.argv[3] || "screenshots/motion";
const reduce = process.argv[4] === "reduce";
fs.mkdirSync(outDir, { recursive: true });
const mobile = width < 768;

const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
const context = await browser.newContext({
  viewport: { width, height: mobile ? 812 : 900 },
  isMobile: mobile,
  hasTouch: mobile,
  reducedMotion: reduce ? "reduce" : "no-preference",
});
const page = await context.newPage();
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto("http://localhost:4173/", { waitUntil: "load" });
await page.waitForTimeout(400);
const preloaderEarly = await page.evaluate(() => getComputedStyle(document.querySelector(".preloader")).visibility);
await page.waitForTimeout(1600);
const state = await page.evaluate(() => ({
  preloaderLate: getComputedStyle(document.querySelector(".preloader")).visibility,
  headerBarY: document.querySelector("[data-header-bar]")?.getBoundingClientRect().top,
  pinSpacers: document.querySelectorAll(".pin-spacer").length,
}));
await page.screenshot({ path: `${outDir}/${width}-00-hero.png` });

const snap = async (name, y) => {
  await page.evaluate((top) => window.scrollTo(0, top), y);
  await page.waitForTimeout(1300);
  await page.screenshot({ path: `${outDir}/${width}-${name}.png` });
};
const top = (sel) => page.evaluate((s) => {
  const el = document.querySelector(s);
  return el ? el.getBoundingClientRect().top + window.scrollY : 0;
}, sel);

const vh = mobile ? 812 : 900;
await snap("01-intro-transition", vh * 0.55);
await snap("02-intro", (await top("[data-intro]")) + 40);
await snap("03-courses", (await top("#courses")) + 120);
await snap("04-batch", (await top("#batches")) + 80);
const fac = await top("#faculty");
await snap("05-faculty-start", fac + 10);
await snap("06-faculty-mid", fac + 700);
await snap("07-requirements", (await top("#requirements")) + 260);
const path = await top("#pathway");
await snap("08-pathway-mid", path + 500);
await snap("09-pathway-late", path + 900);
await snap("10-life", (await top("#life")) + 300);
await snap("11-counselling", (await top("#counselling")) + 100);

// Scroll to the bottom slowly so every once-trigger fires, then check nothing is left hidden.
const h = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < h; y += 500) {
  await page.evaluate((t) => window.scrollTo(0, t), y);
  await page.waitForTimeout(60);
}
await page.waitForTimeout(1500);
const hidden = await page.evaluate(() =>
  Array.from(
    document.querySelectorAll(
      "main [data-block], main [data-stagger] > *, main [data-clip-reveal], main [data-split], main [data-step], main [data-route-plane]",
    ),
  )
    .filter((el) => el.offsetParent !== null)
    .filter((el) => {
      const s = getComputedStyle(el);
      return s.opacity === "0" || s.clipPath.includes("100%");
    })
    .map((el) => el.outerHTML.slice(0, 80)),
);

const pinsAfter = await page.evaluate(() => document.querySelectorAll(".pin-spacer").length);
console.log(JSON.stringify({ width, reduce, preloaderEarly, ...state, pinsAfter, stillHidden: hidden.length, hiddenSample: hidden.slice(0, 3), errors: errors.slice(0, 8) }, null, 1));
await browser.close();
