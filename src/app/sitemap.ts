import type { MetadataRoute } from "next";
import { CRAWLABLE_PATHS, SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return CRAWLABLE_PATHS.map((path) => ({
    url: new URL(path, SITE_URL).href,
  }));
}
