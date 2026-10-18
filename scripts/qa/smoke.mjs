// Smoke test against the static build served on :4173 (npm run start:static).
// Usage: node scripts/qa/smoke.mjs   (PW_CHROMIUM = optional path to an existing Chromium)
import { chromium } from "@playwright/test";
const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const logs = []; page.on("console", (m) => logs.push(m.text()));
let popups = 0; page.on("popup", () => popups++);
await page.goto("http://localhost:4173/", { waitUntil: "load" });
await page.waitForTimeout(1200);
const r = {};
// skip link offscreen
r.skipLinkTop = await page.evaluate(() => document.querySelector('a[href="#main"]').getBoundingClientRect().bottom);
// nav + footer links do not navigate
const before = page.url();
for (const label of ["About Us", "Contact Us", "Student Dashboard"]) await page.locator("header nav >> text=" + label).first().click();
await page.locator("header nav button", { hasText: "Courses" }).hover(); await page.waitForTimeout(500);
r.dropdownVisible = await page.locator("text=CPL Flying Training Argentina").first().isVisible();
await page.locator("text=CPL Flying Training Argentina").first().click();
await page.locator("footer >> text=Privacy Policy").click();
r.urlUnchanged = page.url() === before; r.popups = popups;
// Enquire CTA scrolls + focuses
await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(400);
await page.locator("header >> text=Enquire").first().click(); await page.waitForTimeout(1800);
r.focusedAfterEnquire = await page.evaluate(() => document.activeElement?.id);
r.urlAfterEnquire = page.url();
// form: empty submit → errors
await page.locator("button[type=submit]").click(); await page.waitForTimeout(400);
r.errorCount = await page.locator("#enquiry [id$=-error]").count();
r.summary = await page.locator("#enquiry-summary").textContent();
// valid fill → success (empty endpoint)
await page.fill("#enquiry-name", "Test Student");
await page.fill("#enquiry-mobile", "+91 98290 12345");
await page.fill("#enquiry-email", "test@example.com");
await page.locator("#enquiry-qualification").click(); await page.getByRole("option", { name: "12th Pass" }).click();
await page.locator("#enquiry-state").click(); await page.getByRole("option", { name: "Rajasthan" }).click();
await page.fill("#enquiry-city", "Jaipur");
await page.locator("label[for=enquiry-interest-0]").click();
await page.locator("label[for=enquiry-start-1]").click();
await page.locator("#enquiry-consent").click();
await page.locator("button[type=submit]").click();
await page.waitForTimeout(1500);
r.success = await page.locator("text=Thank you, Test!").isVisible();
r.payloadLogged = logs.find((l) => l.includes("[enquiry]"))?.slice(0, 160);
console.log(JSON.stringify(r, null, 1));
await browser.close();
