import { SETS } from "../src/data/sets";
import { expect, isInert, isPhone, test } from "./fixtures";

const PATHS = ["/", "/our-story", ...SETS.map((set) => `/sets/${set.slug}`), "/no-such-page"];

for (const path of PATHS) {
  test(`page and navbar fit the screen: ${path}`, async ({ page, browserErrors }) => {
    browserErrors.allow(/status of 404|404 \(Not Found\)/);
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("button", { name: "Toggle theme" })).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth
    );
    expect(overflow, "horizontal overflow in px").toBeLessThanOrEqual(0);

    // Every visible navbar control must be on screen and not cut off by its container
    const problems = await page.evaluate(() => {
      const issues: string[] = [];
      const controls = Array.from(document.querySelectorAll<HTMLElement>("header a, header button"));

      for (const el of controls) {
        if (!el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;

        const name = el.getAttribute("aria-label") || el.textContent?.trim() || el.tagName;
        if (rect.left < 0 || rect.right > window.innerWidth + 0.5) issues.push(`${name}: off-screen`);

        for (let parent = el.parentElement; parent; parent = parent.parentElement) {
          if (getComputedStyle(parent).overflowX === "visible") continue;
          const box = parent.getBoundingClientRect();
          if (rect.left < box.left - 0.5 || rect.right > box.right + 0.5) {
            issues.push(`${name}: clipped by its container`);
            break;
          }
        }
      }

      return issues;
    });
    expect(problems).toEqual([]);
  });
}

test("home navbar shows the right controls for the screen size", async ({ page }) => {
  await page.goto("/");
  const header = page.locator("header");
  const sectionLinks = header.getByRole("link", { name: /^(Showcase|Services|Our Story|Contact)$/ });

  if (isPhone(page)) {
    await expect(header.getByRole("button", { name: "Open menu" })).toBeVisible();
    await expect(sectionLinks).toHaveCount(0);
  } else {
    await expect(header.getByRole("button", { name: "Open menu" })).toBeHidden();
    await expect(sectionLinks).toHaveText(["Showcase", "Services", "Our Story", "Contact"]);
  }
  await expect(header.getByRole("link", { name: "Girgit Studios home" })).toBeVisible();
  await expect(header.getByRole("button", { name: "Toggle theme" })).toBeVisible();
  // Set-page controls are hidden and out of the keyboard/screen-reader order here
  expect(await isInert(header.locator("a", { hasText: "Book now" }))).toBe(true);
  expect(await isInert(header.getByLabel("Back to all studio sets"))).toBe(true);
});

test("desktop nav links scroll to their sections", async ({ page }) => {
  test.skip(isPhone(page), "phones use the menu");
  await page.goto("/");

  await page.locator("header").getByRole("link", { name: "Services" }).click();
  await expect(page).toHaveURL(/\/#services$/);
  await expect(page.getByRole("heading", { name: "Everything behind the frame." })).toBeInViewport();
});

test.describe("mobile menu", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!isPhone(page), "the menu is only used on phones");
    await page.goto("/");
  });

  test("opens with every section, fits the screen and closes with Escape", async ({ page }) => {
    await page.getByRole("button", { name: "Open menu" }).click();

    const menu = page.getByRole("navigation", { name: "Main" });
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link")).toHaveText(["Showcase", "Services", "Our Story", "Contact"]);
    await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");

    const box = await menu.boundingBox();
    const viewport = page.viewportSize();
    expect(box && viewport && box.x >= 0 && box.x + box.width <= viewport.width).toBe(true);
    for (const link of await menu.getByRole("link").all()) {
      expect((await link.boundingBox())?.height ?? 0, "tap target height").toBeGreaterThanOrEqual(44);
    }

    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
  });

  test("tapping outside closes it", async ({ page }) => {
    await page.getByRole("button", { name: "Open menu" }).click();
    const menu = page.getByRole("navigation", { name: "Main" });
    await expect(menu).toBeVisible();

    const viewport = page.viewportSize();
    if (!viewport) throw new Error("no viewport");
    await page.mouse.click(viewport.width / 2, viewport.height - 20);
    await expect(menu).toBeHidden();
  });

  test("a menu link goes to its section and closes the menu", async ({ page }) => {
    await page.getByRole("button", { name: "Open menu" }).click();
    const menu = page.getByRole("navigation", { name: "Main" });

    await menu.getByRole("link", { name: "Contact" }).click();
    await expect(page).toHaveURL(/\/#contact$/);
    await expect(menu).toBeHidden();
    await expect(page.locator("#contact h2")).toBeInViewport();
  });
});

test("set page navbar keeps Book now reachable on every screen", async ({ page }) => {
  // Patthar Ki Deewar has the longest set name
  await page.goto("/sets/patthar-ki-deewar");
  const header = page.locator("header");
  const width = page.viewportSize()?.width ?? 0;

  await expect(header.getByRole("link", { name: "Back to all studio sets" })).toBeVisible();
  const book = header.getByRole("link", { name: "Book now" });
  await expect(book).toBeVisible();
  await expect(book).toHaveAttribute("href", /^https:\/\/wa\.me\/\d+\?text=.*Patthar%20Ki%20Deewar/);

  const setName = header.getByText("Patthar Ki Deewar");
  if (width >= 640) await expect(setName).toBeVisible();
  else await expect(setName).toBeHidden();

  const sectionLinks = header.getByRole("link", { name: /^(Overview|Tech Specs|Booking)$/ });
  if (width >= 1024) await expect(sectionLinks).toHaveText(["Overview", "Tech Specs", "Booking"]);
  else await expect(sectionLinks).toHaveCount(0);

  // The home-page links are hidden and out of the keyboard/screen-reader order here
  expect(await isInert(header.locator("a", { hasText: "Showcase" }))).toBe(true);
  expect(await isInert(header.getByRole("link", { name: "Book now" }))).toBe(false);
});

test("set page section links scroll on wide screens", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 1024, "section links show from 1024px");
  await page.goto("/sets/meherabi-gali");

  await page.locator("header").getByRole("link", { name: "Booking" }).click();
  await expect(page).toHaveURL(/#booking$/);
  await expect(page.locator("#booking")).toBeInViewport({ ratio: 1 });
});

test("previous and next set links move through the sets", async ({ page }) => {
  await page.goto(`/sets/${SETS[0].slug}`);
  const more = page.getByRole("navigation", { name: "More sets" });

  await expect(more.getByRole("link", { name: new RegExp(SETS[SETS.length - 1].name) })).toHaveAttribute(
    "href",
    `/sets/${SETS[SETS.length - 1].slug}`
  );
  await more.getByRole("link", { name: new RegExp(`Next set.*${SETS[1].name}`) }).click();
  await expect(page).toHaveURL(new RegExp(`/sets/${SETS[1].slug}$`));
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(SETS[1].name);
});
