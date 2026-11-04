import { test as base, expect, type Locator, type Page } from "@playwright/test";

declare global {
  interface Window {
    __openedUrls: string[];
  }
}

type BrowserErrors = {
  /** Ignore browser errors matching this pattern for the current test. */
  allow: (pattern: RegExp) => void;
};

// Every test fails if the page logs a console error or throws.
export const test = base.extend<{ browserErrors: BrowserErrors; stubEmbeds: void }>({
  // Instagram and YouTube embeds get an empty page, so tests don't depend on (or wait for) those sites
  stubEmbeds: [
    async ({ page }, use) => {
      await page.route(/^https:\/\/(www\.instagram\.com|www\.youtube-nocookie\.com)\//, (route) =>
        route.fulfill({ contentType: "text/html", body: "<!doctype html><title>embed</title>" })
      );
      await use();
    },
    { auto: true },
  ],

  browserErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      const allowed: RegExp[] = [];

      page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(`console: ${message.text()}`);
      });

      await use({ allow: (pattern) => allowed.push(pattern) });

      const unexpected = errors.filter((error) => !allowed.some((pattern) => pattern.test(error)));
      expect(unexpected, "unexpected browser errors").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

export const isPhone = (page: Page) => (page.viewportSize()?.width ?? 0) < 768;

/** Replaces window.open so the WhatsApp inquiry can be checked without leaving the site. */
export async function captureWindowOpen(page: Page) {
  await page.addInitScript(() => {
    window.__openedUrls = [];
    window.open = (url?: string | URL) => {
      window.__openedUrls.push(String(url));
      return null;
    };
  });

  return () => page.evaluate(() => window.__openedUrls);
}

/** Waits until React has attached its event handlers to the element. */
export async function waitForHydration(element: Locator) {
  await expect
    .poll(() => element.evaluate((el) => Object.keys(el).some((key) => key.startsWith("__reactProps"))))
    .toBe(true);
}

/** True when the element sits inside an `inert` region, which browsers skip for focus and screen readers. */
export const isInert = (element: Locator) =>
  element.evaluate((el: HTMLElement) => {
    el.focus();
    return el.closest("[inert]") !== null && document.activeElement !== el;
  });

export async function expectImageLoaded(image: Locator) {
  await expect
    .poll(() => image.evaluate((el: HTMLImageElement) => (el.complete ? el.naturalWidth : 0)), {
      timeout: 15_000,
    })
    .toBeGreaterThan(0);
}

/** Playwright's own WebKit build on Windows ships without H.264; real Safari plays it. */
export const canPlayH264 = (page: Page) =>
  page.evaluate(() => document.createElement("video").canPlayType('video/mp4; codecs="avc1.64001f"') !== "");

export const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
