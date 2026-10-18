import { expect, test } from "@playwright/test";
import { isMobile, openHome, scrollThrough } from "./helpers";

const ALLOWED_HREFS = new Set(["#", "#enquiry", "#main", "tel:+918955804726", "mailto:info@skyproaviation.org", "https://wa.me/918955804726"]);

test.describe("links never redirect", () => {
  test("every anchor uses an allowed href; only WhatsApp links open a new tab", async ({ page }) => {
    await openHome(page);
    const anchors = await page.$$eval("a", (as) =>
      as.map((a) => ({ href: a.getAttribute("href"), target: a.getAttribute("target"), rel: a.getAttribute("rel"), text: a.textContent?.trim().slice(0, 40) })),
    );
    expect(anchors.length).toBeGreaterThan(40);
    const bad = anchors.filter((a) => !ALLOWED_HREFS.has(a.href ?? ""));
    expect(bad, `unexpected hrefs: ${JSON.stringify(bad)}`).toEqual([]);
    // the floating button + the WhatsApp links in the Enquiry contact column and the FAQ
    const blank = anchors.filter((a) => a.target === "_blank");
    expect(blank.length).toBeGreaterThanOrEqual(1);
    for (const a of blank) {
      expect(a.href).toBe("https://wa.me/918955804726");
      expect(a.rel).toContain("noopener");
    }
  });

  test("clicking nav, footer, course and blog links changes nothing", async ({ page }) => {
    await openHome(page);
    const startUrl = page.url();
    let navigations = 0;
    page.on("framenavigated", (f) => f === page.mainFrame() && navigations++);
    let popups = 0;
    page.on("popup", () => popups++);

    if (!isMobile(page)) {
      // Header links + both dropdowns (hover opens, items don't navigate)
      for (const label of ["Home", "About Us", "Contact Us", "Student Dashboard"]) {
        await page.locator("header nav[aria-label='Main'] a", { hasText: label }).first().click();
      }
      for (const [trigger, item] of [
        ["Courses", "CPL Flying Training Argentina"],
        ["Admission Forms", "Ground School Admission Form"],
      ] as const) {
        await page.locator("header nav button", { hasText: trigger }).hover();
        const link = page.locator("header nav a", { hasText: item });
        await expect(link).toBeVisible();
        await link.click();
      }
    } else {
      // Mobile menu: open sheet, click items, close
      await page.getByRole("button", { name: "Open menu" }).click();
      const sheet = page.getByRole("dialog");
      await expect(sheet).toBeVisible();
      await sheet.getByRole("button", { name: "Courses" }).click();
      await sheet.getByRole("link", { name: "DGCA Ground Classes" }).click();
      await sheet.getByRole("link", { name: "About Us" }).click();
      await page.keyboard.press("Escape");
      await expect(sheet).toBeHidden();
    }

    await scrollThrough(page);
    const scopes = ["#blogs a", "footer a[href='#']"];
    for (const selector of scopes) {
      const links = page.locator(selector);
      const n = await links.count();
      for (let i = 0; i < n; i++) await links.nth(i).click();
    }
    // course cards stack on top of each other (sticky), so earlier cards' links are covered by
    // design: fire the click on each link directly
    const courseLinks = page.locator("#courses a");
    expect(await courseLinks.count()).toBe(6);
    for (let i = 0; i < 6; i++) await courseLinks.nth(i).dispatchEvent("click");

    expect(page.url()).toBe(startUrl);
    expect(navigations).toBe(0);
    expect(popups).toBe(0);
  });
});

test.describe("in-page CTAs", () => {
  const ctas = [
    { name: "header Enquire", locator: "header a[href='#enquiry']", desktopOnly: false },
    { name: "hero Enquire pill", locator: "[data-hero-pill] a[href='#enquiry']", desktopOnly: false },
    { name: "intro Enquire Now", locator: "#about a[href='#enquiry']", desktopOnly: false },
    { name: "batch Enroll Now", locator: "#batches a[href='#enquiry']", desktopOnly: false },
    { name: "counselling Book Free Counselling", locator: "#counselling a[href='#enquiry']", desktopOnly: false },
  ];

  for (const cta of ctas) {
    test(`${cta.name} scrolls to the form and focuses Full Name (URL unchanged)`, async ({ page }) => {
      await openHome(page);
      const link = page.locator(cta.locator).first();
      const displayed = await link.evaluate((el) => (el as HTMLElement).offsetParent !== null || getComputedStyle(el).position === "fixed");
      test.skip(!displayed, "CTA hidden at this breakpoint by design");
      await link.scrollIntoViewIfNeeded();
      await link.click();
      await expect(page.locator("#enquiry-name")).toBeFocused({ timeout: 6000 });
      const top = await page.locator("#enquiry").evaluate((el) => el.getBoundingClientRect().top);
      expect(Math.abs(top)).toBeLessThan(140);
      expect(page.url()).not.toContain("#");
    });
  }

  test("mobile menu Enquire closes the sheet and scrolls to the form", async ({ page }) => {
    test.skip(!isMobile(page), "mobile only");
    await openHome(page);
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("dialog").getByRole("link", { name: /Enquire Now/ }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(page.locator("#enquiry-name")).toBeFocused({ timeout: 6000 });
  });
});

test.describe("WhatsApp button", () => {
  test("hidden on the hero, visible after it, opens wa.me in a new tab", async ({ page }) => {
    await openHome(page);
    const wa = page.locator("[data-whatsapp]");
    await expect(wa).toHaveAttribute("aria-hidden", "true");
    await expect(wa).toHaveAttribute("tabindex", "-1");
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.6));
    await expect(wa).toHaveAttribute("aria-hidden", "false");
    await expect(wa).toBeVisible();
    await expect(wa).toHaveAttribute("href", "https://wa.me/918955804726");
    await expect(wa).toHaveAttribute("target", "_blank");
  });
});

test.describe("dialogs", () => {
  test("Watch Demo Lectures opens an in-page dialog with click-to-load players", async ({ page }) => {
    await openHome(page);
    await page.locator("#about").getByRole("button", { name: /Watch Demo Lectures/ }).click();
    const dialog = page.getByRole("dialog", { name: "Watch Demo Lectures" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("tab")).toHaveCount(3);
    await expect(dialog.locator("iframe")).toHaveCount(0); // nothing loads from YouTube until a click
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("faculty: first instructor featured; a selector card swaps the featured profile; Watch Demo opens the demo dialog", async ({ page }) => {
    await openHome(page);
    const section = page.locator("#faculty");
    await section.scrollIntoViewIfNeeded();
    const featured = page.locator("#faculty-featured");
    await expect(featured.getByRole("heading", { name: "Gp Capt. Arvind Thapliyal" })).toBeVisible();
    await expect(featured).toContainText("with over four decades of experience in military and civil aviation");

    await section.getByRole("button", { name: /Sqn Ldr\. Nivedita Choudhary/ }).click();
    await expect(featured.getByRole("heading", { name: "Sqn Ldr. Nivedita Choudhary" })).toBeVisible();
    await expect(featured).toContainText("she became the first woman from Rajasthan to climb Mount Everest");
    await expect(section.getByRole("button", { name: /Gp Capt\. Arvind Thapliyal/ })).toBeVisible();

    await section.getByRole("button", { name: /Gp Capt\. Narender Kumar Dahiya/ }).click();
    await expect(featured.getByRole("heading", { name: "Gp Capt. Narender Kumar Dahiya" })).toBeVisible();
    await featured.getByRole("button", { name: /Watch Demo Lectures/ }).click();
    const demo = page.getByRole("dialog", { name: "Watch Demo Lectures" });
    await expect(demo).toBeVisible();
    await expect(demo.getByRole("tab", { name: "Gp Capt. Narender Kumar Dahiya" })).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("Escape");
    await expect(demo).toBeHidden();
  });

  test("academy life photos open a lightbox with arrows", async ({ page }) => {
    await openHome(page);
    const life = page.locator("#life");
    await life.scrollIntoViewIfNeeded();
    await life.locator("[data-life-photo]").first().click();
    const box = page.getByRole("dialog", { name: "Life at SkyPro Aviation Academy" });
    await expect(box).toBeVisible();
    await expect(box).toContainText("1 / 17");
    await box.getByRole("button", { name: "Next photo" }).click();
    await expect(box).toContainText("2 / 17");
    await page.keyboard.press("Escape");
    await expect(box).toBeHidden();
  });

  test("testimonial windows open a video modal", async ({ page }) => {
    await openHome(page);
    const section = page.locator("#testimonials");
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200); // windows slide in
    await section.getByRole("button", { name: /Play video testimonial: Janvi Jain/ }).click();
    const modal = page.getByRole("dialog", { name: "Janvi Jain" });
    await expect(modal).toBeVisible();
    await expect(modal.locator("video")).toHaveCount(1);
    await page.keyboard.press("Escape");
    await expect(modal).toBeHidden();
  });
});
