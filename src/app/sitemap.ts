import type { MetadataRoute } from "next";
import { SETS } from "@/data/sets";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/our-story`, changeFrequency: "monthly", priority: 0.7 },
    ...SETS.map((set) => ({
      url: `${SITE_URL}/sets/${set.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
