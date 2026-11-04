import { FOUNDERS } from "../src/data/founders";
import { WORK_CATEGORIES, workEmbed } from "../src/data/work";
import { expect, isPhone, test, waitForHydration } from "./fixtures";

test("Our Story in the navbar opens its own page", async ({ page }) => {
  await page.goto("/");

  if (isPhone(page)) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Our Story" }).click();
  } else {
    await page.locator("header").getByRole("link", { name: "Our Story" }).click();
  }

  await expect(page).toHaveURL(/\/our-story$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("The people behind the frame.");
  await expect(page).toHaveTitle("Our story · Girgit Studios");
  if (!isPhone(page)) {
    await expect(page.locator("header").getByRole("link", { name: "Our Story" })).toHaveAttribute("aria-current", "page");
  }
});

test("Meet the founders on the home page opens the story page", async ({ page }) => {
  await page.goto("/");

  // Centred first: at the screen edge the button is still sliding in with the section's fade-in
  const link = page.locator("#studio-story").getByRole("link", { name: "Meet the founders" });
  await link.evaluate((el) => el.scrollIntoView({ block: "center" }));
  await link.click();
  await expect(page).toHaveURL(/\/our-story$/);
});

test("every founder has a name, role and bio, side by side on wider screens", async ({ page }) => {
  await page.goto("/our-story");

  for (const founder of FOUNDERS) {
    const profile = page.locator(`article#${founder.slug}`);
    await expect(profile.getByRole("heading", { level: 3 })).toHaveText(founder.name);
    await expect(profile.getByText(founder.role)).toBeVisible();
    for (const paragraph of founder.bio) await expect(profile.getByText(paragraph)).toBeAttached();
  }

  const [first, second] = await Promise.all(
    FOUNDERS.slice(0, 2).map((founder) => page.locator(`article#${founder.slug}`).boundingBox())
  );
  if (!first || !second) throw new Error("founder profiles not laid out");
  if ((page.viewportSize()?.width ?? 0) >= 640) {
    expect(Math.abs(first.y - second.y), "same row").toBeLessThan(2);
    expect(second.x).toBeGreaterThan(first.x + first.width - 1);
  } else {
    expect(second.y, "stacked on phones").toBeGreaterThan(first.y + first.height - 1);
  }
});

test("every selected-work link can be embedded", () => {
  for (const category of WORK_CATEGORIES) {
    expect(category.links.length, category.name).toBeGreaterThan(0);
    for (const link of category.links) expect(workEmbed(link), link).not.toBeNull();
  }
});

test("selected work shows one category at a time, as embeds", async ({ page }) => {
  await page.goto("/our-story");
  const section = page.locator("#work");
  await expect(section.getByRole("heading", { name: "Selected work." })).toBeAttached();

  const chips = section.getByRole("group", { name: "Work categories" }).getByRole("button");
  await expect(chips).toHaveCount(WORK_CATEGORIES.length);
  await waitForHydration(chips.first());

  for (const [index, category] of WORK_CATEGORIES.entries()) {
    await chips.nth(index).click();
    await expect(chips.nth(index)).toHaveAttribute("aria-pressed", "true");
    const frames = section.getByRole("list", { name: `Selected work: ${category.name}` }).locator("iframe");
    await expect(frames).toHaveCount(category.links.length);
    for (const [n, link] of category.links.entries()) {
      await expect(frames.nth(n)).toHaveAttribute("src", workEmbed(link)!.src);
    }
  }
  // The founder profiles carry no work rows of their own
  await expect(page.locator("article").getByRole("list")).toHaveCount(0);
});

test("the home page no longer has an Instagram reels section", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#instagram")).toHaveCount(0);
});

test("Meet the founders in the story hero scrolls to them", async ({ page }) => {
  await page.goto("/our-story");

  await page.locator("main section").first().getByRole("link", { name: "Meet the founders" }).click();
  await expect(page.getByRole("heading", { name: "Meet the makers." })).toBeInViewport();
});

test("the work row scrolls with the arrows on bigger screens, and by swiping on phones", async ({ page }) => {
  await page.goto("/our-story");
  const section = page.locator("#work");
  // The first category has the most work, so it is wider than the screen
  const row = section.getByRole("list", { name: `Selected work: ${WORK_CATEGORIES[0].name}` });
  await row.scrollIntoViewIfNeeded();
  const scrollLeft = () => row.evaluate((el) => el.scrollLeft);

  const back = section.getByRole("button", { name: "Scroll back" });
  const forward = section.getByRole("button", { name: "Scroll forward" });

  if (isPhone(page)) {
    await expect(forward).toBeHidden();
    // Cards are narrower than the screen, so the next one peeks in as a swipe hint
    const card = await row.getByRole("listitem").first().boundingBox();
    expect(card?.width ?? 0).toBeLessThan(page.viewportSize()?.width ?? 0);
    await row.evaluate((el) => el.scrollBy({ left: 300 }));
    await expect.poll(scrollLeft).toBeGreaterThan(0);
  } else {
    await waitForHydration(forward);
    await expect(back).toBeDisabled();
    await forward.click();
    await expect.poll(scrollLeft).toBeGreaterThan(100);
    await expect(back).toBeEnabled();
  }
});
