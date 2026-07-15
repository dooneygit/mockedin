import type { MetadataRoute } from "next";

const siteUrl = "https://mockedin.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    // Add new public routes here as they are created (e.g. /about, /pricing).
  ];
}
