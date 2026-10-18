import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { isMobile, openHome, scrollThrough } from "./helpers";

test.describe("accessibility", () => {
  test("axe: no serious or critical WCAG 2.x A/AA violations", async ({ page }) => {
    await openHome(page);
    await scrollThrough(page);
    await page.waitForTimeout(1500);
    // render every deferred section so axe sees real content
    await page.addStyleTag({ content: ".cv-auto{content-visibility:visible!important}" });
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const severe = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(severe.map((v) => `${v.id}: ${v.nodes.length} × ${v.nodes[0]?.target}`)).toEqual([]);
  });

  test("one H1, no skipped heading levels, every image has alt, no duplicate ids", async ({ page }) => {
    await openHome(page);
    const levels = await page.$$eval("h1,h2,h3,h4,h5,h6", (hs) => hs.map((h) => Number(h.tagName[1])));
    expect(levels.filter((l) => l === 1)).toHaveLength(1);
    for (let i = 1; i < levels.length; i++) expect(levels[i]! - levels[i - 1]!, `jump at heading #${i}`).toBeLessThanOrEqual(1);
    const noAlt = await page.$$eval("img", (imgs) => imgs.filter((i) => !i.hasAttribute("alt")).map((i) => i.getAttribute("src")));
    expect(noAlt).toEqual([]);
    const dupes = await page.$$eval("[id]", (els) => {
      const seen = new Map<string, number>();
      els.forEach((e) => seen.set(e.id, (seen.get(e.id) ?? 0) + 1));
      return [...seen].filter(([, n]) => n > 1).map(([id]) => id);
    });
    expect(dupes).toEqual([]);
  });

  test("skip link is the first tab stop and moves focus to main", async ({ page }) => {
    await openHome(page);
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main")).toBeFocused();
  });

  test("header dropdown works with the keyboard", async ({ page }) => {
    test.skip(isMobile(page), "desktop nav");
    await openHome(page);
    const trigger = page.locator("header nav button", { hasText: "Courses" });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("header nav a", { hasText: "DGCA Ground Classes" })).toBeVisible();
    await page.keyboard.press("ArrowDown");
    await expect(page.locator("header nav a", { hasText: "DGCA Ground Classes" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.locator("header nav a", { hasText: "DGCA Ground Classes" })).toBeHidden();
  });

  test("FAQ accordion: first open, others toggle via keyboard", async ({ page }) => {
    await openHome(page);
    const faq = page.locator("#faq");
    await faq.scrollIntoViewIfNeeded();
    const triggers = faq.locator("button[aria-expanded]");
    await expect(triggers).toHaveCount(6);
    await expect(triggers.nth(0)).toHaveAttribute("aria-expanded", "true");
    await triggers.nth(2).focus();
    await page.keyboard.press("Enter");
    await expect(triggers.nth(2)).toHaveAttribute("aria-expanded", "true");
    await expect(faq).toContainText("Review your pre-course materials and ensure your medical and documents are ready.");
  });

  test("hero sound toggle exposes its state", async ({ page }) => {
    await openHome(page);
    const toggle = page.getByRole("button", { name: "Turn sound on" });
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await toggle.click();
    await expect(page.getByRole("button", { name: "Turn sound off" })).toHaveAttribute("aria-pressed", "true");
  });
});

test.describe("robustness", () => {
  test("no horizontal overflow at 320 / 375 / 768 / 1280 / 1440", async ({ browser }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "creates its own viewports — run once");
    test.setTimeout(240_000);
    for (const width of [320, 375, 768, 1280, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await openHome(page, { settle: 1200 });
      await scrollThrough(page, 900);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `overflow at ${width}px`).toBeLessThanOrEqual(0);
      await page.close();
    }
  });

  test("no failed requests while scrolling the whole page", async ({ page }) => {
    const failed: string[] = [];
    // only the site's own requests (the embedded Google map makes its own third-party calls)
    const base = new URL(test.info().project.use.baseURL ?? "http://localhost:4173").origin;
    const own = (url: string) => new URL(url).origin === base;
    page.on("response", (r) => own(r.url()) && r.status() >= 400 && failed.push(`${r.status()} ${r.url()}`));
    page.on("requestfailed", (r) => {
      // aborted media range requests are normal when a video pauses/changes source
      if (own(r.url()) && !/\.(mp4|webm)/.test(r.url())) failed.push(`failed ${r.url()}`);
    });
    await openHome(page);
    await scrollThrough(page, 400);
    await page.waitForTimeout(1500);
    expect(failed).toEqual([]);
  });

  test("JSON-LD: EducationalOrganization + FAQPage that matches the visible FAQ", async ({ page }) => {
    await openHome(page);
    const json = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}");
    const org = json["@graph"].find((n: { "@type": string }) => n["@type"] === "EducationalOrganization");
    const faq = json["@graph"].find((n: { "@type": string }) => n["@type"] === "FAQPage");
    expect(org.telephone).toBe("+91-8955804726");
    expect(org.email).toBe("info@skyproaviation.org");
    expect(org.address.postalCode).toBe("302019");
    expect(faq.mainEntity).toHaveLength(6);
    for (const q of faq.mainEntity) await expect(page.locator("#faq")).toContainText(q.name);
  });
});

test.describe("reduced motion & no JS", () => {
  test("reduced motion: static, visible, no pins, no smooth scroll, no motion runtime", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    const gsapRequests: string[] = [];
    page.on("request", (r) => r.url().includes("/_next/static/chunks/") && gsapRequests.push(r.url()));
    await openHome(page, { settle: 2500 });
    await scrollThrough(page);
    expect(await page.locator(".pin-spacer").count()).toBe(0);
    expect(await page.evaluate(() => document.documentElement.classList.contains("lenis"))).toBe(false);
    expect(await page.locator(".preloader").evaluate((el) => getComputedStyle(el).display)).toBe("none");
    const hidden = await page.$$eval("main [data-reveal], main [data-split], main [data-clip-reveal]", (els) =>
      els.filter((e) => getComputedStyle(e).opacity === "0").length,
    );
    expect(hidden).toBe(0);
    const bodies = await Promise.all(gsapRequests.map((u) => fetch(u).then((r) => r.text()).catch(() => "")));
    // the ScrollTrigger plugin itself (gsap core, used by the enquiry form, only mentions its name)
    expect(bodies.some((b) => b.includes("scrollerProxy"))).toBe(false);
    await context.close();
  });

  test("without JavaScript every section and its content is visible", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    await page.goto("/", { waitUntil: "load" });
    await page.waitForTimeout(1600); // CSS-only preloader exits by itself
    expect(await page.locator(".preloader").evaluate((el) => getComputedStyle(el).visibility)).toBe("hidden");
    for (const text of [
      "Your One-Stop Aviation Academy for Pilot Training in India",
      "Our Courses",
      "Why Choose SkyPro Aviation?",
      "Our Flight Instructors & Faculty",
      "DGCA Requirements to Become a Commercial Pilot in India",
      "How to Become a Commercial Pilot in India",
      "Life at SkyPro Aviation Academy",
      "Take Off Your Career in Aviation",
      "Book Your 1-on-1 Pilot Career Counselling Session With SkyPro Aviation",
    ]) {
      await expect(page.locator("main").getByRole("heading", { name: text }).first()).toBeAttached();
    }
    // content must not be transparent; decorative layers (aria-hidden) and the hero <video>
    // (fades in once playing) are allowed to be
    const hidden = await page.$$eval("main *", (els) =>
      els
        .filter((e) => getComputedStyle(e).opacity === "0" && !e.closest("[aria-hidden='true']") && e.tagName !== "VIDEO")
        .map((e) => `${e.tagName}.${e.className}`),
    );
    expect(hidden).toEqual([]);
    await context.close();
  });
});
