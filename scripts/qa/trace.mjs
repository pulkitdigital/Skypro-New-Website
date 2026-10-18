// Records a Chrome trace of the first seconds (mobile, throttled) and sums main-thread event
// durations by name — shows whether style, layout, paint or script dominates.
// Usage: node scripts/qa/trace.mjs [seconds=6] [throttle=4]   (PROFILE_PAGE=path to test another page)
import fs from "node:fs";
import { chromium } from "@playwright/test";

const seconds = Number(process.argv[2] || 6);
const throttle = Number(process.argv[3] || 4);
const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
const context = await browser.newContext({ viewport: { width: 412, height: 823 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1.75 });
const page = await context.newPage();
const cdp = await context.newCDPSession(page);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: throttle });
const file = "screenshots/trace.json";
await browser.startTracing(page, { path: file, categories: ["devtools.timeline", "disabled-by-default-devtools.timeline", "disabled-by-default-devtools.timeline.stack", "blink", "v8.execute"] });
await page.goto(`http://localhost:4173/${process.env.PROFILE_PAGE ?? ""}`);
await page.waitForTimeout(seconds * 1000);
await browser.stopTracing();
await browser.close();

const { traceEvents } = JSON.parse(fs.readFileSync(file, "utf8"));
const main = traceEvents.find((e) => e.name === "thread_name" && e.args?.name === "CrRendererMain");
const events = traceEvents.filter((e) => e.ph === "X" && e.pid === main.pid && e.tid === main.tid && e.dur);
const sum = new Map();
const count = new Map();
for (const e of events) {
  sum.set(e.name, (sum.get(e.name) ?? 0) + e.dur);
  count.set(e.name, (count.get(e.name) ?? 0) + 1);
}
const tasks = events.filter((e) => e.name === "RunTask");
const longMs = tasks.filter((e) => e.dur > 50000).reduce((a, e) => a + (e.dur - 50000), 0) / 1000;
console.log(`RunTask total ${(tasks.reduce((a, e) => a + e.dur, 0) / 1000).toFixed(0)} ms, blocking(>50ms) ${longMs.toFixed(0)} ms`);
[...sum.entries()]
  .filter(([n]) => n !== "RunTask" && n !== "ThreadControllerImpl::RunTask")
  .sort((a, b) => b[1] - a[1])
  .slice(0, 16)
  .forEach(([n, us]) => console.log(`${(us / 1000).toFixed(0).padStart(6)} ms  x${String(count.get(n)).padEnd(5)} ${n}`));

// Who forces layout? (top JS frames of Layout events)
const who = new Map();
for (const e of events.filter((x) => x.name === "Layout")) {
  const st = e.args?.beginData?.stackTrace;
  const top = st?.[0] ? `${st[0].functionName || "(anon)"} @ ${String(st[0].url).split("/").pop()}:${st[0].columnNumber}` : "(no JS stack)";
  who.set(top, (who.get(top) ?? 0) + e.dur);
}
console.log("--- layout by JS caller");
[...who.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([k, us]) => console.log(`${(us / 1000).toFixed(0).padStart(6)} ms  ${k}`));

// Largest tasks and what's inside them (direct children by name, plus top script)
const longest = tasks.filter((t) => t.dur > 50000).sort((a, b) => b.dur - a.dur).slice(0, 8);
console.log("--- long tasks");
const t0 = events.reduce((m, e) => Math.min(m, e.ts), Infinity);
for (const t of longest) {
  const inside = events.filter((e) => e !== t && e.ts >= t.ts && e.ts + e.dur <= t.ts + t.dur);
  const by = new Map();
  for (const e of inside) if (["Layout", "UpdateLayoutTree", "EvaluateScript", "FunctionCall", "ParseHTML", "v8.compile", "Paint", "PrePaint", "HitTest", "TimerFire", "FireAnimationFrame", "EventDispatch", "MajorGC", "MinorGC"].includes(e.name)) by.set(e.name, (by.get(e.name) ?? 0) + e.dur);
  const fc = inside.filter((e) => e.name === "FunctionCall" || e.name === "EvaluateScript").sort((a, b) => b.dur - a.dur)[0];
  const src = fc ? (fc.args?.data?.url || fc.args?.data?.functionName || "").split("/").pop() : "";
  console.log(
    `${((t.ts - t0) / 1000).toFixed(0).padStart(6)}ms dur ${(t.dur / 1000).toFixed(0).padStart(4)}ms :: ` +
      [...by.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([n, us]) => `${n} ${(us / 1000).toFixed(0)}`).join(", ") +
      (src ? `  [${src}]` : ""),
  );
}
