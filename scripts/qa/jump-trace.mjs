// CTA jump check (mobile emulation): clicks an Enquire CTA and samples scrollY / the form's
// position every frame, logging every programmatic scroll call. A ScrollTrigger refresh
// writes scrollTo(0,0) then restores the position; doing that mid-jump cuts the smooth
// scroll short, so the report flags any refresh that lands before the jump has settled.
// Usage: node scripts/qa/jump-trace.mjs [selector] [url] [--verbose]
import { chromium, devices } from "@playwright/test";

const args = process.argv.slice(2).filter((a) => a !== "--verbose");
const verbose = process.argv.includes("--verbose");
const sel = args[0] || "#about a[href='#enquiry']";
const url = args[1] || "http://localhost:4173/";

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || undefined });
const ctx = await browser.newContext({ ...devices["Pixel 7"] });
const page = await ctx.newPage();
await page.addInitScript(() => {
  const log = (window.__jumpLog = []);
  const wrap = (obj, name) => {
    const orig = obj[name];
    obj[name] = function (...a) {
      log.push([performance.now(), name, JSON.stringify(a).slice(0, 80)]);
      return orig.apply(this, a);
    };
  };
  wrap(window, "scrollTo");
  wrap(window, "scroll");
  wrap(Element.prototype, "scrollIntoView");
});

await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(1500); // motion runtime loads after load + idle
const link = page.locator(sel).first();
await link.scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await page.evaluate(() => {
  window.__jumpLog.length = 0;
  window.__t1 = performance.now();
  window.__samples = [];
  const sample = () => {
    const top = document.getElementById("enquiry").getBoundingClientRect().top;
    const cv = document.documentElement.classList.contains("cv-render");
    window.__samples.push([Math.round(performance.now() - window.__t1), Math.round(scrollY), Math.round(top), cv]);
    if (performance.now() - window.__t1 < 4000) requestAnimationFrame(sample);
  };
  requestAnimationFrame(sample);
});
await link.click();
await page.waitForTimeout(4200);

const { samples, calls, focused } = await page.evaluate(() => ({
  samples: window.__samples,
  calls: window.__jumpLog.map(([t, ...rest]) => [Math.round(t - window.__t1), ...rest]),
  focused: document.activeElement?.id,
}));

const final = samples.at(-1);
const landed = samples.find(([, , top]) => Math.abs(top - final[2]) <= 1);
const refreshes = calls.filter(([, name, a]) => name === "scrollTo" && a === "[0,0]").map(([t]) => t);
const early = refreshes.filter((t) => landed && t < landed[0]);

if (verbose) {
  let last = "";
  for (const [t, y, top, cv] of samples) {
    const key = `${y}|${top}|${cv}`;
    if (key !== last) console.log(t, "scrollY", y, "formTop", top, cv ? "cv-render" : "");
    last = key;
  }
  console.log("--- scroll calls");
  for (const c of calls) console.log(c.join("  "));
}
console.log(
  `${sel}: formTop=${final[2]}px landed@${landed?.[0]}ms focused=${focused} refreshes@[${refreshes.join(",")}]ms` +
    (early.length ? `  ✗ ${early.length} refresh(es) before landing` : "  ✓"),
);
await browser.close();
process.exit(early.length || Math.abs(final[2] - 84) > 4 || focused !== "enquiry-name" ? 1 : 0);
