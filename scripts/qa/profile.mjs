// CPU-profiles the first seconds of a page load (mobile, throttled) and prints the hottest
// functions by self time, with their script. Usage: node scripts/qa/profile.mjs [seconds=7] [throttle=4]
import { chromium } from "@playwright/test";

const seconds = Number(process.argv[2] || 7);
const throttle = Number(process.argv[3] || 4);
const noVideo = process.argv[4] === "novideo";
const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
const context = await browser.newContext({ viewport: { width: 412, height: 823 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1.75 });
const page = await context.newPage();
const cdp = await context.newCDPSession(page);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: throttle });
if (noVideo) await page.addInitScript(() => Object.defineProperty(navigator, "connection", { value: { saveData: true } }));
await cdp.send("Profiler.enable");
await cdp.send("Profiler.setSamplingInterval", { interval: 500 });
await cdp.send("Profiler.start");
await page.goto(`http://localhost:4173/${process.env.PROFILE_PAGE ?? ""}`);
await page.waitForTimeout(seconds * 1000);
const { profile } = await cdp.send("Profiler.stop");

const byId = new Map(profile.nodes.map((n) => [n.id, n]));
const self = new Map();
const dt = profile.timeDeltas;
profile.samples.forEach((id, i) => self.set(id, (self.get(id) ?? 0) + (dt[i] ?? 0)));
const agg = new Map();
for (const [id, us] of self) {
  const n = byId.get(id);
  const f = n.callFrame;
  const key = `${f.functionName || "(anon)"} @ ${(f.url || "").split("/").pop()}:${f.lineNumber}:${f.columnNumber}`;
  agg.set(key, (agg.get(key) ?? 0) + us);
}
const total = [...agg.values()].reduce((a, b) => a + b, 0);
console.log(`profiled ${(total / 1000).toFixed(0)} ms (throttle ${throttle}x)`);
[...agg.entries()]
  .filter(([k]) => !k.startsWith("(idle)") && !k.startsWith("(program)"))
  .sort((a, b) => b[1] - a[1])
  .slice(0, 25)
  .forEach(([k, us]) => console.log(`${(us / 1000).toFixed(0).padStart(6)} ms  ${k}`));
for (const k of ["(idle)", "(program)", "(garbage collector)"]) {
  const e = [...agg.entries()].find(([key]) => key.startsWith(k));
  if (e) console.log(`${(e[1] / 1000).toFixed(0).padStart(6)} ms  ${k}`);
}
await browser.close();
