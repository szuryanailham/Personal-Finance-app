import { dummyBlogPostsResponse } from "@/lib/dummy/blog-posts";

// Domain produksi utama mengikuti redirect hosting: HTTPS dengan www.
const siteUrl = new URL(process.env.SITE_URL?.trim() || "https://www.myartoku.com");
siteUrl.protocol = "https:";
if (siteUrl.hostname === "myartoku.com") {
  siteUrl.hostname = "www.myartoku.com";
}
export const SITE_URL = siteUrl.origin;

// Daftar ini digunakan bersama oleh robots.txt dan sitemap.xml.
// Tambahkan hanya halaman publik yang boleh dirayapi crawler.
export const CRAWLABLE_PATHS = [
  "/",
  "/about",
  "/fitur",
  "/contact",
  "/blog",
  "/kebijakan-pivasi",
  "/syarat-ketentuan",
  ...dummyBlogPostsResponse.data
    .filter((post) => post.status === "PUBLISHED")
    .map((post) => `/blog/${post.slug}`),
];
