import { GOOGLE_MAPS, MIN_CUSTOM_HOURS, STUDIO_CONTACT } from "../src/data/studio";
import { captureWindowOpen, expect, test, waitForHydration } from "./fixtures";

test("an empty inquiry is blocked by the required fields", async ({ page }) => {
  const openedUrls = await captureWindowOpen(page);
  await page.goto("/");

  await page.getByRole("button", { name: "Send inquiry on WhatsApp" }).click();
  expect(await openedUrls()).toEqual([]);
});

test("a filled inquiry opens WhatsApp with the details and saves the lead", async ({ page }) => {
  const openedUrls = await captureWindowOpen(page);
  await page.goto("/");
  await waitForHydration(page.locator("#contact form"));

  // Labels are linked to their fields, so they work for screen readers and taps
  await page.getByLabel("Name").fill("Test Client");
  await page.getByLabel("Email address").fill("client@example.com");
  await page.getByLabel("Shoot date").fill("2027-03-14");
  await page.getByLabel("Booking").selectOption({ label: "Full day (8 hours)" });
  await page.getByLabel("Set", { exact: true }).selectOption("Meherabi Gali");
  await page.getByLabel("Crew size").fill("6");
  await page.getByLabel("Shoot details").fill("Bridal lookbook, morning start");

  const leadRequest = page.waitForRequest((request) => request.url().endsWith("/api/inquiry"));
  await page.getByRole("button", { name: "Send inquiry on WhatsApp" }).click();

  const urls = await openedUrls();
  expect(urls).toHaveLength(1);
  expect(urls[0].startsWith(`https://wa.me/${STUDIO_CONTACT.whatsappNumber}?text=`)).toBe(true);
  const message = new URL(urls[0]).searchParams.get("text");
  expect(message).toContain("Test Client");
  expect(message).toContain("Email: client@example.com");
  expect(message).toMatch(/Shoot date: .*14.*Mar.*2027/);
  expect(message).toContain("Booking: Full day (8 hours)");
  expect(message).toContain("Set: Meherabi Gali");
  expect(message).toContain("Crew size: 6");
  expect(message).toContain("Bridal lookbook, morning start");

  const lead = (await leadRequest).postDataJSON();
  expect(lead).toMatchObject({ name: "Test Client", set: "Meherabi Gali", crew: "6" });
});

test("optional fields left blank stay out of the WhatsApp message", async ({ page }) => {
  const openedUrls = await captureWindowOpen(page);
  await page.goto("/");
  await waitForHydration(page.locator("#contact form"));

  await page.getByLabel("Name").fill("Test Client");
  await page.getByRole("button", { name: "Send inquiry on WhatsApp" }).click();

  const message = new URL((await openedUrls())[0]).searchParams.get("text");
  expect(message).toBe("Hi Girgit Studios! I'm Test Client.");
});

test("a custom booking asks for the hours, at least the minimum", async ({ page }) => {
  const openedUrls = await captureWindowOpen(page);
  await page.goto("/");
  await waitForHydration(page.locator("#contact form"));

  await page.getByLabel("Name").fill("Test Client");
  const hours = page.getByLabel("Number of hours");
  await expect(hours).toHaveCount(0);
  await page.getByLabel("Booking").selectOption({ label: `Custom (${MIN_CUSTOM_HOURS}+ hours)` });
  await expect(hours).toBeVisible();
  await expect(hours).toHaveAttribute("min", String(MIN_CUSTOM_HOURS));

  // Below the minimum, the browser blocks the form
  await hours.fill(String(MIN_CUSTOM_HOURS - 1));
  await page.getByRole("button", { name: "Send inquiry on WhatsApp" }).click();
  expect(await openedUrls()).toEqual([]);

  await hours.fill("3");
  await page.getByRole("button", { name: "Send inquiry on WhatsApp" }).click();
  const message = new URL((await openedUrls())[0]).searchParams.get("text");
  expect(message).toContain("Booking: Custom, 3 hours");
});

test("past dates can't be picked", async ({ page }) => {
  await page.goto("/");
  const today = await page.evaluate(() => new Date().toLocaleDateString("en-CA"));
  await expect(page.getByLabel("Shoot date")).toHaveAttribute("min", today);
});

test("the lead sheet endpoint is a no-op until a sheet is set up", async ({ request }) => {
  const response = await request.post("/api/inquiry", { data: { name: "Test Client" } });
  expect(response.status()).toBe(204);
});

test("before JavaScript loads, the form still goes to WhatsApp with the message", async ({ page }) => {
  await page.goto("/");
  const form = page.locator("#contact form");

  await expect(form).toHaveAttribute("action", `https://wa.me/${STUDIO_CONTACT.whatsappNumber}`);
  await expect(form).toHaveAttribute("method", "get");
  await expect(form).toHaveAttribute("target", "_blank");
  // WhatsApp reads the message from the "text" parameter
  await expect(page.getByLabel("Shoot details")).toHaveAttribute("name", "text");
});

test("form fields use 16px text so iPhones don't zoom in on tap", async ({ page }) => {
  await page.goto("/");

  for (const label of ["Name", "Email address", "Shoot date", "Booking", "Set", "Crew size", "Shoot details"]) {
    // "Set" alone would also match the navbar's "Back to all studio sets"
    const size = await page.getByLabel(label, { exact: label === "Set" }).evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(size, label).toBeGreaterThanOrEqual(16);
  }
});

test("email and phone links point to the studio", async ({ page }) => {
  await page.goto("/");
  const contact = page.locator("#contact");

  await expect(contact.getByRole("link", { name: STUDIO_CONTACT.email })).toHaveAttribute(
    "href",
    `mailto:${STUDIO_CONTACT.email}`
  );
  for (const phone of STUDIO_CONTACT.phones) {
    await expect(contact.getByRole("link", { name: phone })).toHaveAttribute(
      "href",
      `tel:${phone.replaceAll(" ", "")}`
    );
  }
});

test("directions, map and Instagram links point to the studio", async ({ page }) => {
  await page.goto("/");
  const contact = page.locator("#contact");
  const visit = page.locator("#visit");

  await expect(contact.getByRole("link", { name: "Get directions" })).toHaveAttribute("href", GOOGLE_MAPS.directions);
  await expect(visit.locator("iframe")).toHaveAttribute("src", GOOGLE_MAPS.embed);
  await expect(visit.getByRole("link", { name: "Directions" })).toHaveAttribute("href", GOOGLE_MAPS.directions);
  await expect(contact.getByRole("link", { name: "Instagram" })).toHaveAttribute(
    "href",
    "https://www.instagram.com/girgitstudios/"
  );
});
