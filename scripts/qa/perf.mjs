// Scroll-performance probe for the static build on :4173.
// Scrolls the whole page with the mouse wheel under CPU throttling and reports frame times + long tasks.
// Usage: node scripts/qa/perf.mjs [width=1440] [cpuThrottle=4]
import { chromium } from "@playwright/test";

const width = Number(process.argv[2] || 1440);
const throttle = Number(process.argv[3] || 4);
const mobile = width < 768;

const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
const context = await browser.newContext({ viewport: { width, height: mobile ? 812 : 900 }, isMobile: mobile, hasTouch: mobile });
const page = await context.newPage();
const cdp = await context.newCDPSession(page);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: throttle });

await page.goto("http://localhost:4173/", { waitUntil: "load" });
await page.waitForTimeout(2500);

await page.evaluate(() => {
  window.__frames = [];
  window.__long = [];
  let last = performance.now();
  const loop = (t) => {
    window.__frames.push(t - last);
    (window.__fy ??= []).push([t - last, window.scrollY]);
    last = t;
    if (!window.__stop) requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  new PerformanceObserver((list) => list.getEntries().forEach((e) => window.__long.push(e.duration))).observe({ type: "longtask", buffered: false });
});

const height = await page.evaluate(() => document.documentElement.scrollHeight);
const steps = Math.ceil(height / 160);
await page.mouse.move(width / 2, 450);
for (let i = 0; i < steps; i++) {
  if (mobile) await page.evaluate(() => window.scrollBy(0, 160));
  else await page.mouse.wheel(0, 160);
  await page.waitForTimeout(40);
}
await page.waitForTimeout(1500);

const r = await page.evaluate(() => {
  window.__stop = true;
  const f = window.__frames.slice(2).sort((a, b) => a - b);
  const avg = f.reduce((a, b) => a + b, 0) / f.length;
  const p = (q) => f[Math.min(f.length - 1, Math.floor(f.length * q))];
  return {
    frames: f.length,
    avgFps: +(1000 / avg).toFixed(1),
    p50ms: +p(0.5).toFixed(1),
    p95ms: +p(0.95).toFixed(1),
    over33ms: `${((f.filter((x) => x > 33.4).length / f.length) * 100).toFixed(1)}%`,
    longTasks: window.__long.length,
    longTaskMs: Math.round(window.__long.reduce((a, b) => a + b, 0)),
    reachedBottom: Math.round(window.scrollY + innerHeight) >= document.documentElement.scrollHeight - 4,
    bySection: (() => {
      const secs = Array.from(document.querySelectorAll("main > section, body footer")).map((el) => {
        const top = el.getBoundingClientRect().top + window.scrollY;
        return { id: el.id || el.tagName.toLowerCase(), top };
      });
      const agg = {};
      for (const [dt, y] of window.__fy.slice(2)) {
        const mid = y + innerHeight / 2;
        let id = secs[0].id;
        for (const s of secs) if (mid >= s.top) id = s.id;
        (agg[id] ??= []).push(dt);
      }
      return Object.fromEntries(
        Object.entries(agg).map(([k, v]) => [k, `${(1000 / (v.reduce((a, b) => a + b, 0) / v.length)).toFixed(0)}fps/${v.length}f`]),
      );
    })(),
  };
});
console.log(JSON.stringify({ width, cpuThrottle: throttle, ...r }));
await browser.close();
