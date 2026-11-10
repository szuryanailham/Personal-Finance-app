import type { MetadataRoute } from "next";
import { CRAWLABLE_PATHS, SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // Akhiran $ membatasi izin ke URL persis, bukan semua turunannya.
      allow: [
        ...CRAWLABLE_PATHS.map((path) => `${path}$`),
        "/_next/static/",
        "/_next/image?",
        "/favicon.ico$",
        "/hero.png$",
        "/sitemap.xml$",
      ],
      disallow: "/",
    },
    sitemap: new URL("/sitemap.xml", SITE_URL).href,
  };
}
