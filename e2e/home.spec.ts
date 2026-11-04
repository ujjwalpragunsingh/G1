import type { Locator, Page } from "@playwright/test";
import { SETS } from "../src/data/sets";
import { MIN_CUSTOM_HOURS } from "../src/data/studio";
import { canPlayH264, expect, expectImageLoaded, test } from "./fixtures";

type Rgba = [number, number, number, number];

function heroStat(page: Page, label: string) {
  return page
    .locator("main section")
    .first()
    .locator("dt", { hasText: label })
    .locator("xpath=following-sibling::dd[1]");
}

function colorsOf(element: Locator) {
  return element.evaluate((el) => {
    // Paint each computed colour onto a canvas so any CSS colour syntax becomes RGBA
    const toRgba = (color: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("no canvas context");
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      return Array.from(context.getImageData(0, 0, 1, 1).data) as [number, number, number, number];
    };
    const style = getComputedStyle(el);
    return { background: toRgba(style.backgroundColor), text: toRgba(style.color) };
  });
}

function luminance([r, g, b]: Rgba) {
  const channel = (value: number) => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(a: Rgba, b: Rgba) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

const introAnimations = (page: Page) =>
  page.evaluate(() => document.getAnimations().filter((a) => a.id === "hero-intro").length);

test("server HTML has the real hero content", async ({ request }) => {
  const html = await (await request.get("/")).text();

  expect(html).toMatch(new RegExp(`<dt[^>]*>Studio sets</dt><dd[^>]*>${SETS.length}</dd>`));
  expect(html).toMatch(new RegExp(`<dt[^>]*>Custom hours</dt><dd[^>]*>${MIN_CUSTOM_HOURS}\\+</dd>`));
  // The crew limit is no longer published
  expect(html).not.toMatch(/max crew|maximum crew/i);
  expect(html).toContain("28.56° N · 77.37° E");
  expect(html).toContain("/videos/hero-1080.mp4");
  expect(html).toContain("/videos/hero-portrait.mp4");
  expect(html).not.toMatch(/loading-girgit|hero-720|19\.076/);
  // One main heading on the page
  expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
});

test("the hero works with JavaScript turned off", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect.poll(() => page.getByRole("heading", { level: 1 }).evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  await expect(page.getByRole("link", { name: "Explore sets" })).toHaveAttribute("href", "#showcase");
  await expect(heroStat(page, "Studio sets")).toHaveText(String(SETS.length));
  await expect(heroStat(page, "Custom hours")).toHaveText(`${MIN_CUSTOM_HOURS}+`);
  await context.close();
});

test("logo intro keeps its original timing and doesn't replay when coming back", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  // Time the intro from when it starts to when it ends (pause + fade + flight ≈ 2.6 s),
  // and check the navbar logo stays hidden until the large logo lands
  const intro = await page.evaluate(
    () =>
      new Promise<{ ms: number; navLogoHidden: boolean }>((resolve) => {
        const navLogo = document.getElementById("navbar-logo");
        const started = performance.now();
        let firstSeen = 0;
        let navLogoHidden = false;
        const tick = () => {
          const running = document.getAnimations().filter((a) => a.id === "hero-intro").length;
          if (running > 0 && !firstSeen) {
            firstSeen = performance.now();
            navLogoHidden = navLogo ? getComputedStyle(navLogo).opacity === "0" : false;
          }
          if (firstSeen && running === 0) resolve({ ms: performance.now() - firstSeen, navLogoHidden });
          else if (performance.now() - started > 10_000) resolve({ ms: -1, navLogoHidden });
          else requestAnimationFrame(tick);
        };
        tick();
      })
  );
  expect(intro.ms, "intro length in ms").toBeGreaterThan(2_000);
  expect(intro.ms, "intro length in ms").toBeLessThan(3_500);
  expect(intro.navLogoHidden, "navbar logo hidden while the large logo flies").toBe(true);
  await expect.poll(() => page.locator("#navbar-logo").evaluate((el) => getComputedStyle(el).opacity)).toBe("1");

  // Navigate away and back inside the app: no second intro
  await page.locator('#showcase a[href^="/sets/"]').first().click();
  await expect(page).toHaveURL(/\/sets\//);
  await page.getByRole("link", { name: "Girgit Studios home" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(await introAnimations(page)).toBe(0);
});

test("the reel plays the right cut for the screen and can be paused", async ({ page }) => {
  await page.goto("/");
  test.skip(!(await canPlayH264(page)), "this test browser build has no H.264 decoder");

  const video = page.locator("main section").first().locator("video");
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused && v.currentTime > 0.3), { timeout: 10_000 })
    .toBe(true);

  const portrait = await page.evaluate(() => matchMedia("(orientation: portrait)").matches);
  const source = await video.evaluate((v: HTMLVideoElement) => v.currentSrc);
  expect(source).toMatch(portrait ? /\/videos\/hero-portrait\.mp4$/ : /\/videos\/hero-1080\.mp4$/);

  await page.getByRole("button", { name: "Pause reel" }).click();
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  await expect(page.getByRole("button", { name: "Play reel" })).toBeVisible();
});

test("reduced motion: no intro, no autoplay, no scroll animations", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");

  await expect(page.getByRole("button", { name: "Play reel" })).toBeVisible();
  await page.waitForTimeout(1_500);
  expect(await page.locator("main section").first().locator("video").evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  expect(await introAnimations(page)).toBe(0);
  expect(await page.locator(".reveal").first().evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
  await context.close();
});

for (const theme of ["light", "dark"] as const) {
  test(`Explore sets is readable over the video (${theme} theme)`, async ({ page }) => {
    await page.addInitScript((value) => localStorage.setItem("theme", value), theme);
    await page.goto("/");

    const html = page.locator("html");
    if (theme === "dark") await expect(html).toHaveClass(/\bdark\b/);
    else await expect(html).not.toHaveClass(/\bdark\b/);

    const button = page.getByRole("link", { name: "Explore sets" });
    const idle = await colorsOf(button);
    expect(idle.background[3], "button background is opaque").toBe(255);
    expect(luminance(idle.background), "light button against the dark video").toBeGreaterThan(0.8);
    expect(contrast(idle.background, idle.text), "label contrast").toBeGreaterThanOrEqual(4.5);

    // Tailwind only applies hover styles on devices that can hover (not touch screens)
    if (await page.evaluate(() => matchMedia("(hover: hover)").matches)) {
      await button.hover();
      await expect.poll(async () => (await colorsOf(button)).background[3]).toBe(0);
      expect(luminance((await colorsOf(button)).text), "white label on hover").toBeGreaterThan(0.9);
    }
  });
}

test("mouse-wheel scrolling glides smoothly", async ({ page }) => {
  await page.goto("/");
  test.skip(!(await page.evaluate(() => matchMedia("(hover: hover)").matches)), "touch screens keep native scrolling");
  await expect(page.locator("html")).toHaveClass(/\blenis\b/);

  await page.mouse.move(400, 400);
  await page.mouse.wheel(0, 600);
  const rightAfter = await page.evaluate(() => scrollY);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(550);
  expect(rightAfter, "the page eases into place instead of jumping").toBeLessThan(550);
});

test("Explore sets scrolls to the showcase", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Explore sets" }).click();
  await expect(page.getByRole("heading", { name: "Find your frame." })).toBeInViewport();
});

test("showcase lists every set with its cover image", async ({ page }) => {
  await page.goto("/");

  const cards = page.locator('#showcase a[href^="/sets/"]');
  await expect(cards).toHaveCount(SETS.length);
  // No prices anywhere on the home page
  expect(await page.locator("body").textContent()).not.toContain("₹");

  for (const [index, set] of SETS.entries()) {
    const card = cards.nth(index);
    await expect(card).toHaveAttribute("href", `/sets/${set.slug}`);
    await card.scrollIntoViewIfNeeded();
    await expect(card.getByRole("heading", { name: set.name })).toBeVisible();

    const image = card.locator("img");
    await expectImageLoaded(image);
    const source = await image.evaluate((el: HTMLImageElement) => decodeURIComponent(el.currentSrc));
    expect(source).toContain(set.image);
  }
});

test("content stays visible as you scroll, in every browser", async ({ page }) => {
  await page.goto("/");

  for (const id of ["showcase", "studio-story", "services", "contact", "visit"]) {
    const heading = page.locator(`#${id} h2`).first();
    await heading.evaluate((el) => el.scrollIntoView({ block: "center" }));
    await expect.poll(() => heading.evaluate((el) => Number(getComputedStyle(el.closest(".reveal") ?? el).opacity)), {
      message: `#${id} heading should fade fully in`,
    }).toBeGreaterThan(0.95);
  }
});

test("clicking a set card opens its page", async ({ page }) => {
  await page.goto("/");

  await page.locator('#showcase a[href="/sets/clay-and-cane"]').click();
  await expect(page).toHaveURL(/\/sets\/clay-and-cane$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Clay & Cane");
});

test("theme toggle switches and remembers the theme", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  const toggle = page.getByRole("button", { name: "Toggle theme" });

  await expect(html).not.toHaveClass(/\bdark\b/);
  await toggle.click();
  await expect(html).toHaveClass(/\bdark\b/);

  await page.reload();
  await expect(html).toHaveClass(/\bdark\b/);
  await toggle.click();
  await expect(html).not.toHaveClass(/\bdark\b/);
});
