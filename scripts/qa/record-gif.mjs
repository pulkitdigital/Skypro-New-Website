// Records a short GIF of a section's real scroll animation (motion enabled) from the static build.
// Frames come from Chrome's screencast (CDP), so no extra Playwright download is needed; the GIF
// is assembled with the project's ffmpeg-static. The page jumps to just above the section, then
// scrolls it into view; optionally clicks something afterwards to show an interaction.
// Output: screenshots/redesign/<name>.gif
// Usage: node scripts/qa/record-gif.mjs <name> <selector> [--width=1440] [--hold=4] [--wheel=7] [--gap=70] [--hover=<selector>] [--click=<selector>] [--demo=enquiry] [--url=http://localhost:4173]
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { chromium } from "@playwright/test";

const [, , name = "section", selector = "main section", ...rest] = process.argv;
const opt = Object.fromEntries(rest.map((a) => a.replace(/^--/, "").split(/=(.*)/s).slice(0, 2)));
const width = Number(opt.width ?? 1440);
const mobile = width < 768;
const height = mobile ? 812 : 900;
const hold = Number(opt.hold ?? 4);
const wheel = Number(opt.wheel ?? (width < 768 ? 6 : 7)); // scroll steps
const gap = Number(opt.gap ?? (width < 768 ? 120 : 70)); // ms between steps
const url = opt.url ?? "http://localhost:4173/";
const fps = 12;
const ffmpeg = path.resolve("node_modules/ffmpeg-static/ffmpeg" + (process.platform === "win32" ? ".exe" : ""));

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "skypro-rec-"));
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || undefined });
const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
const page = await context.newPage();
await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(2600); // preloader + motion runtime (load + idle)

const target = page.locator(selector).first();
const top = await target.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
await page.evaluate((y) => window.scrollTo(0, Math.max(0, y)), top - height * 0.9);
await page.waitForTimeout(700);

// --- start the screencast
const cdp = await context.newCDPSession(page);
const frames = [];
cdp.on("Page.screencastFrame", async ({ data, metadata, sessionId }) => {
  frames.push({ data, t: metadata.timestamp });
  await cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
});
await cdp.send("Page.startScreencast", { format: "jpeg", quality: 85, maxWidth: width, maxHeight: height, everyNthFrame: 1 });

if (mobile) {
  for (let i = 0; i < wheel; i++) {
    await page.evaluate(() => window.scrollBy({ top: 130, behavior: "smooth" }));
    await page.waitForTimeout(gap);
  }
} else {
  for (let i = 0; i < wheel; i++) {
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(gap);
  }
}
await page.waitForTimeout(hold * 1000);
if (opt.hover) {
  await page.locator(opt.hover).first().hover();
  await page.waitForTimeout(2200);
}
if (opt.click) {
  await page.locator(opt.click).first().click();
  await page.waitForTimeout(1800);
}
if (opt.demo === "enquiry") {
  // Fill the form with test values, then submit (shows the success state).
  const type = async (selector, text) => {
    await page.locator(selector).click();
    await page.keyboard.type(text, { delay: 30 });
  };
  await type("#enquiry-name", "Test Pilot");
  await type("#enquiry-mobile", "9876543210");
  await type("#enquiry-email", "test@example.com");
  await page.waitForTimeout(900);
  await page.locator("#enquiry-qualification").click();
  await page.getByRole("option", { name: "12th Pass" }).click();
  await page.locator("#enquiry-state").click();
  await page.getByRole("option", { name: "Rajasthan" }).click();
  await type("#enquiry-city", "Jaipur");
  await page.waitForTimeout(900);
  await page.locator("label[for=enquiry-interest-0]").click();
  await page.waitForTimeout(900);
  await page.locator("label[for=enquiry-start-0]").click();
  await page.locator("#enquiry-consent").click();
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "Submit Enquiry" }).click();
  await page.waitForTimeout(3200);
}
await cdp.send("Page.stopScreencast");
await browser.close();
if (frames.length < 2) throw new Error("no frames captured");

// --- resample to a constant frame rate (screencast only sends frames when something changes)
const start = frames[0].t;
const end = frames.at(-1).t;
let f = 0;
let n = 0;
for (let t = start; t <= end; t += 1 / fps) {
  while (f + 1 < frames.length && frames[f + 1].t <= t) f++;
  fs.writeFileSync(path.join(tmp, `f${String(n++).padStart(5, "0")}.jpg`), Buffer.from(frames[f].data, "base64"));
}

const outDir = path.join("screenshots", "redesign");
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, `${name}.gif`);
const gifWidth = mobile ? 375 : 960;
execFileSync(ffmpeg, [
  "-y",
  "-framerate", String(fps),
  "-i", path.join(tmp, "f%05d.jpg"),
  "-vf", `scale=${gifWidth}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=3`,
  "-loop", "0",
  out,
], { stdio: "ignore" });
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`${out}  ${(fs.statSync(out).size / 1024 / 1024).toFixed(1)} MB, ${(end - start).toFixed(1)}s, ${n} frames`);
