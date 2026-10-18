import { expect, test, type Page } from "@playwright/test";
import { openHome } from "./helpers";

async function gotoForm(page: Page) {
  await openHome(page);
  // header Enquire is hidden below 640px by design — use the first visible Enquire CTA
  await page.locator("a[href='#enquiry']:visible").first().click();
  await expect(page.locator("#enquiry-name")).toBeFocused({ timeout: 6000 });
}

async function fillValid(page: Page, mobile = "+91 98290 12345") {
  await page.fill("#enquiry-name", "Test Student");
  await page.fill("#enquiry-mobile", mobile);
  await page.fill("#enquiry-email", "test@example.com");
  await page.locator("#enquiry-qualification").click();
  await page.getByRole("option", { name: "12th Pass" }).click();
  await page.locator("#enquiry-state").click();
  await page.getByRole("option", { name: "Rajasthan" }).click();
  await page.fill("#enquiry-city", "Jaipur");
  await page.locator("label[for=enquiry-interest-0]").click();
  await page.locator("label[for=enquiry-start-1]").click();
  await page.locator("#enquiry-consent").click();
}

test.describe("enquiry form", () => {
  test("live field labels, options and placeholders", async ({ page }) => {
    await gotoForm(page);
    const form = page.locator("#enquiry form");
    for (const label of [
      "Full Name*",
      "Mobile No.*",
      "Email Address*",
      "Current Education Qualification*",
      "State*",
      "City*",
      "Which of these are you interested in?*",
      "How soon do you plan to start?*",
      "Any specific question you’d like us to assist with?",
    ]) {
      await expect(form.getByText(label, { exact: true })).toBeVisible();
    }
    for (const option of ["DGCA Ground Classes (CPL)", "Flying Training", "Conversion & Recency", "Career Counselling"]) {
      await expect(form.getByText(option, { exact: true })).toBeVisible();
    }
    for (const option of ["Immediately (0-3 months)", "Soon (3-6 months)", "Later (6-12 months)", "Just Exploring for Now"]) {
      await expect(form.getByText(option, { exact: true })).toBeVisible();
    }
    await page.locator("#enquiry-qualification").click();
    await expect(page.getByRole("option")).toHaveText(["10th", "12th Appearing", "12th Pass", "Graduation"]);
    await page.keyboard.press("Escape");
    await page.locator("#enquiry-state").click();
    await expect(page.getByRole("option")).toHaveCount(36);
    await page.keyboard.press("Escape");
    await expect(page.locator("#enquiry-name")).toHaveAttribute("placeholder", "Enter your full name");
    await expect(form.getByRole("button", { name: "Submit Enquiry" })).toBeVisible();
  });

  test("empty submit shows inline errors and focuses the first invalid field", async ({ page }) => {
    await gotoForm(page);
    await page.getByRole("button", { name: "Submit Enquiry" }).click();
    await expect(page.locator("#enquiry-summary")).toHaveText("Please fix 9 fields highlighted below.");
    await expect(page.locator("#enquiry-name")).toBeFocused();
    await expect(page.locator("#enquiry-name")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByText("Enter a valid 10-digit Indian mobile number.")).toBeVisible();
    await expect(page.getByText("Select at least one option.")).toBeVisible();
    await expect(page.getByText("Please agree so we can contact you.")).toBeVisible();
  });

  for (const bad of ["12345", "5123456789", "+44 7911 123456"]) {
    test(`rejects invalid mobile "${bad}"`, async ({ page }) => {
      await gotoForm(page);
      await fillValid(page, bad);
      await page.getByRole("button", { name: "Submit Enquiry" }).click();
      await expect(page.getByText("Enter a valid 10-digit Indian mobile number.")).toBeVisible();
      await expect(page.getByText(/Thank you/)).toHaveCount(0);
    });
  }

  test("valid submit (no endpoint configured) logs the payload and shows success", async ({ page }) => {
    const logs: string[] = [];
    page.on("console", (m) => logs.push(m.text()));
    await gotoForm(page);
    await page.waitForTimeout(3000); // the form ignores submits faster than 3 s (bot guard)
    await fillValid(page);
    await page.getByRole("button", { name: "Submit Enquiry" }).click();
    await expect(page.getByText("Thank you, Test!")).toBeVisible({ timeout: 6000 });
    await expect(page.getByText("We have received your enquiry. Our team will contact you shortly.")).toBeVisible();
    const payload = logs.find((l) => l.includes("[enquiry]")) ?? "";
    expect(payload).toContain('"mobile":"9829012345"');
    expect(payload).toContain('"interest":"DGCA Ground Classes (CPL)"');
    expect(payload).toContain('"source":"homepage"');
    await page.getByRole("button", { name: "Send another enquiry" }).click();
    await expect(page.locator("#enquiry-name")).toBeVisible();
  });

  test("honeypot: a filled hidden field never sends", async ({ page }) => {
    const logs: string[] = [];
    page.on("console", (m) => logs.push(m.text()));
    await gotoForm(page);
    await page.waitForTimeout(3000);
    await fillValid(page);
    await page.locator("#enquiry-company").fill("Spam Corp", { force: true });
    await page.getByRole("button", { name: "Submit Enquiry" }).click();
    await expect(page.getByText(/Thank you/)).toBeVisible();
    expect(logs.some((l) => l.includes("[enquiry]"))).toBe(false);
  });
});
