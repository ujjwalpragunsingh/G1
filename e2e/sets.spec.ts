import type { Page } from "@playwright/test";
import { SETS } from "../src/data/sets";
import { FULL_DAY_HOURS, HALF_DAY_HOURS, MIN_CUSTOM_HOURS, STUDIO_CONTACT } from "../src/data/studio";
import { escapeRegExp, expect, expectImageLoaded, test } from "./fixtures";

const pad = (value: number) => String(value).padStart(2, "0");

function mainImage(page: Page, setName: string) {
  return page.getByRole("img", { name: new RegExp(`^${escapeRegExp(setName)} at Girgit Studios`) });
}

for (const set of SETS) {
  test.describe(`${set.name} (/sets/${set.slug})`, () => {
    test("shows details, booking hours and its cover photo, with no prices", async ({ page }) => {
      const response = await page.goto(`/sets/${set.slug}`);
      expect(response?.status()).toBe(200);

      await expect(page.getByRole("heading", { level: 1 })).toHaveText(set.name);

      const image = mainImage(page, set.name);
      await expectImageLoaded(image);
      const source = await image.evaluate((el: HTMLImageElement) => decodeURIComponent(el.currentSrc));
      expect(source).toContain(set.gallery[0]);

      const booking = page.locator("#booking");
      await expect(booking).toContainText(`${HALF_DAY_HOURS} hours`);
      await expect(booking).toContainText(`${FULL_DAY_HOURS} hours`);
      await expect(booking).toContainText(`${MIN_CUSTOM_HOURS}+ hours`);
      expect(await page.locator("body").textContent()).not.toContain("₹");
    });

    test("has its own title, description and share image", async ({ page }) => {
      await page.goto(`/sets/${set.slug}`);

      await expect(page).toHaveTitle(`${set.name} · Girgit Studios`);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        new RegExp(escapeRegExp(set.category))
      );
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        "content",
        new RegExp(`/images/share/${set.slug}\\.jpg$`)
      );
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        new RegExp(`/sets/${set.slug}$`)
      );
    });

    test("gallery thumbnails load and switch the main photo", async ({ page }) => {
      await page.goto(`/sets/${set.slug}`);
      const thumbnails = page.getByRole("button", { name: /^Show photo \d+ of \d+$/ });

      if (set.gallery.length === 1) {
        await expect(thumbnails).toHaveCount(0);
        return;
      }

      await expect(thumbnails).toHaveCount(set.gallery.length);
      for (const thumbnail of await thumbnails.all()) {
        await thumbnail.scrollIntoViewIfNeeded();
        await expectImageLoaded(thumbnail.locator("img"));
      }

      const last = set.gallery.length;
      await thumbnails.nth(last - 1).click();
      await expect(thumbnails.nth(last - 1)).toHaveAttribute("aria-pressed", "true");
      await expect(thumbnails.first()).toHaveAttribute("aria-pressed", "false");
      await expect(page.getByText(`${pad(last)} / ${pad(last)}`, { exact: true })).toBeVisible();

      const image = mainImage(page, set.name);
      await expect
        .poll(() => image.evaluate((el: HTMLImageElement) => decodeURIComponent(el.currentSrc)))
        .toContain(set.gallery[last - 1]);
      await expectImageLoaded(image);
    });

    test("booking links open WhatsApp with the set name", async ({ page }) => {
      await page.goto(`/sets/${set.slug}`);

      const links = [
        page.getByRole("link", { name: /Check availability/ }),
        page.locator("header").getByRole("link", { name: "Book now" }),
      ];
      for (const link of links) {
        await expect(link).toHaveAttribute("target", "_blank");
        const href = (await link.getAttribute("href")) ?? "";
        expect(href.startsWith(`https://wa.me/${STUDIO_CONTACT.whatsappNumber}?text=`)).toBe(true);
        expect(new URL(href).searchParams.get("text")).toContain(set.name);
      }
    });
  });
}

test("an unknown set returns a friendly 404", async ({ page, browserErrors }) => {
  browserErrors.allow(/status of 404|404 \(Not Found\)/);

  const response = await page.goto("/sets/no-such-set");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This frame doesn't exist.");
  await page.getByRole("link", { name: "Browse the sets" }).click();
  await expect(page.getByRole("heading", { name: "Find your frame." })).toBeInViewport();
});

test("the back link returns to the showcase", async ({ page }) => {
  await page.goto("/sets/ivory-dusk");

  await page.getByRole("link", { name: "All studio sets", exact: true }).click();
  await expect(page).toHaveURL(/\/#showcase$/);
  await expect(page.getByRole("heading", { name: "Find your frame." })).toBeInViewport();
});
