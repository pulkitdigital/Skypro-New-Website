// Startup main-thread cost under CPU throttling: long tasks (and their >50ms "blocking" part)
// from navigation until the page goes quiet. A quick proxy for Lighthouse TBT.
// Usage: node scripts/qa/startup.mjs [width=412] [cpuThrottle=4] [runs=3]
import { chromium } from "@playwright/test";

const width = Number(process.argv[2] || 412);
const throttle = Number(process.argv[3] || 4);
const runs = Number(process.argv[4] || 3);
const mobile = width < 768;

const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
const results = [];
for (let i = 0; i < runs; i++) {
  const context = await browser.newContext({ viewport: { width, height: mobile ? 823 : 900 }, isMobile: mobile, hasTouch: mobile });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: throttle });
  await page.addInitScript(() => {
    window.__lt = [];
    new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lt.push([Math.round(e.startTime), Math.round(e.duration)]))).observe({
      type: "longtask",
      buffered: true,
    });
    window.__lcp = 0;
    new PerformanceObserver((l) => l.getEntries().forEach((e) => (window.__lcp = Math.round(e.startTime)))).observe({
      type: "largest-contentful-paint",
      buffered: true,
    });
  });
  await page.goto("http://localhost:4173/", { waitUntil: "load" });
  await page.waitForTimeout(6000);
  const r = await page.evaluate(() => {
    const fcp = Math.round(performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? 0);
    const tasks = window.__lt.filter(([s]) => s >= fcp);
    return {
      fcp,
      lcp: window.__lcp,
      load: Math.round(performance.timing.loadEventEnd - performance.timing.navigationStart),
      longTasks: tasks.length,
      blockingMs: tasks.reduce((a, [, d]) => a + Math.max(0, d - 50), 0),
      biggest: tasks.sort((a, b) => b[1] - a[1]).slice(0, 4),
    };
  });
  results.push(r);
  await context.close();
}
const median = (k) => results.map((r) => r[k]).sort((a, b) => a - b)[Math.floor(results.length / 2)];
console.log(JSON.stringify({ width, throttle, fcp: median("fcp"), lcp: median("lcp"), load: median("load"), longTasks: median("longTasks"), blockingMs: median("blockingMs"), sample: results[0].biggest }));
await browser.close();
