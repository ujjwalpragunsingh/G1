import { SETS } from "../src/data/sets";
import { STUDIO_CONTACT } from "../src/data/studio";
import { expect, test } from "./fixtures";

// Server-side checks only need to run once, not per browser and screen size
const ONCE = "asset checks run once, on the desktop project";

test("hero video files are served and light", async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", ONCE);
  const limits: Record<string, number> = {
    "/videos/hero-1080.mp4": 5_000_000,
    "/videos/hero-portrait.mp4": 2_000_000,
    "/videos/hero-poster.webp": 200_000,
  };

  for (const [file, maxBytes] of Object.entries(limits)) {
    const response = await request.get(file);
    expect(response.status(), file).toBe(200);
    expect((await response.body()).length, `${file} size`).toBeLessThanOrEqual(maxBytes);
  }

  for (const removed of ["/loading-girgit.mp4", "/intro.mp4", "/videos/hero-720.mp4"]) {
    expect((await request.get(removed)).status(), removed).toBe(404);
  }
});

test("every gallery image is served as WebP", async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", ONCE);
  for (const set of SETS) {
    for (const source of set.gallery) {
      const response = await request.get(source);
      expect(response.status(), source).toBe(200);
      expect(response.headers()["content-type"], source).toBe("image/webp");
    }
  }
});

test("every page has a share image small enough for WhatsApp", async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", ONCE);
  for (const name of ["home", ...SETS.map((set) => set.slug)]) {
    const response = await request.get(`/images/share/${name}.jpg`);
    expect(response.status(), name).toBe(200);
    expect(response.headers()["content-type"], name).toBe("image/jpeg");
    expect((await response.body()).length, `${name} size`).toBeLessThanOrEqual(300_000);
  }
});

test("sitemap, robots and icons are served", async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", ONCE);

  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const set of SETS) expect(sitemap).toContain(`/sets/${set.slug}</loc>`);

  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toMatch(/Allow: \//);
  expect(robots).toMatch(/Sitemap: .*\/sitemap\.xml/);

  for (const icon of ["/favicon.ico", "/icon.png", "/apple-icon.png"]) {
    expect((await request.get(icon)).status(), icon).toBe(200);
  }
});

test("home page carries business details for Google", async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", ONCE);

  const html = await (await request.get("/")).text();
  const json = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1];
  expect(json, "JSON-LD script").toBeTruthy();

  const business = JSON.parse(json ?? "{}");
  expect(business["@type"]).toBe("LocalBusiness");
  expect(business.name).toBe("Girgit Studios");
  expect(business.address.addressLocality).toBe(STUDIO_CONTACT.locality);
  expect(business.address.postalCode).toBe(STUDIO_CONTACT.postalCode);
  expect(business.sameAs).toContain("https://www.instagram.com/girgitstudios/");
  expect(business.hasMap).toMatch(/^https:\/\/www\.google\.com\/maps\//);
  expect(business.telephone).toContain(STUDIO_CONTACT.phones[0].replaceAll(" ", ""));
  expect(business.priceRange, "no prices published").toBeUndefined();
  expect(html, "no prices in the page source").not.toContain("₹");

  expect(html).toMatch(/<link rel="icon"/);
  expect(html).toMatch(/<meta property="og:image" content="[^"]*\/images\/share\/home\.jpg"/);
});
