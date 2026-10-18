import type { Page } from "@playwright/test";

/** Loads the page and waits until the preloader is gone and the motion runtime has had a chance to load. */
export async function openHome(page: Page, { settle = 1800 } = {}) {
  await page.goto("/", { waitUntil: "load" });
  await page.waitForTimeout(settle);
}

/** Scrolls through the whole page in steps (renders content-visibility sections, fires once-triggers). */
export async function scrollThrough(page: Page, step = 600) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += step) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(40);
  }
}

export const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1440) < 1024;
