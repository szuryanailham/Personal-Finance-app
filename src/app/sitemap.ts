import type { MetadataRoute } from "next";

// Tambahkan path halaman publik baru ke daftar ini saat sudah tersedia.
const PUBLIC_PATHS = ["/", "/sign-up", "/login"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.SITE_URL ?? "https://myartoku.com";

  return PUBLIC_PATHS.map((path) => ({
    url: new URL(path, siteUrl).href,
  }));
}
