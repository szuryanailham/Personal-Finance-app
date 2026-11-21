// Domain produksi utama mengikuti redirect hosting: HTTPS dengan www.
const siteUrl = new URL(process.env.SITE_URL?.trim() || "https://www.myartoku.com");
siteUrl.protocol = "https:";
if (siteUrl.hostname === "myartoku.com") {
  siteUrl.hostname = "www.myartoku.com";
}
export const SITE_URL = siteUrl.origin;

// Halaman publik tetap yang digunakan oleh robots.txt dan sitemap.xml.
export const CRAWLABLE_PATHS = [
  "/",
  "/about",
  "/fitur",
  "/contact",
  "/blog",
  "/kebijakan-pivasi",
  "/syarat-ketentuan",
];
