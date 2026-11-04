import type { Metadata } from "next";

// The public address of the site, used for share previews, the sitemap and Google's
// business data. Set NEXT_PUBLIC_SITE_URL on the host (e.g. https://girgitstudios.com).
// On Vercel it falls back to the production domain automatically.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const SITE_NAME = "Girgit Studios";

/**
 * The photo shown when a page is shared on WhatsApp, Instagram, LinkedIn…
 * A 1200×630 JPEG at /public/images/share/{name}.jpg — kept small (under ~300 KB)
 * because WhatsApp skips larger preview images. Add one for every new set.
 */
export const shareImage = (name: string, alt: string) => ({
  url: `/images/share/${name}.jpg`,
  width: 1200,
  height: 630,
  alt,
});

// Pages that set their own `openGraph` replace the parent's, so they spread this in
export const OPEN_GRAPH_BASE = {
  type: "website",
  siteName: SITE_NAME,
  locale: "en_IN",
} satisfies Metadata["openGraph"];
