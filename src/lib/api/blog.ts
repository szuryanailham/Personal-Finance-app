export const PUBLISHED_BLOG_PAGE_SIZE = 20;

export interface PublishedBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  heroImage: string | null;
  publishedAt: string | null;
  readingTimeMinutes: number;
}

interface PublishedBlogResponse {
  data: PublishedBlogPost[];
  paging: { skip: number; limit: number; totalItem: number; hasMore: boolean };
}

export async function fetchPublishedBlogPosts(skip = 0): Promise<PublishedBlogResponse> {
  const base = process.env.API_PROXY_TARGET ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
  const url = new URL("/api/blog/published", base || "http://localhost:8080");
  url.search = new URLSearchParams({ skip: String(skip), limit: String(PUBLISHED_BLOG_PAGE_SIZE) }).toString();
  const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`Gagal memuat blog (HTTP ${response.status})`);
  const json = await response.json() as PublishedBlogResponse;
  if (!Array.isArray(json.data) || !json.paging ||
      !Number.isSafeInteger(json.paging.skip) || json.paging.skip < 0 ||
      !Number.isSafeInteger(json.paging.limit) || json.paging.limit <= 0 ||
      !Number.isSafeInteger(json.paging.totalItem) || json.paging.totalItem < 0 ||
      typeof json.paging.hasMore !== "boolean" ||
      !json.data.every(post => typeof post.id === "string" && typeof post.title === "string" &&
        typeof post.slug === "string" && (post.excerpt === null || typeof post.excerpt === "string") &&
        (post.heroImage === null || typeof post.heroImage === "string") &&
        (post.publishedAt === null || (typeof post.publishedAt === "string" && Number.isFinite(Date.parse(post.publishedAt)))))) {
    throw new Error("Respons daftar blog tidak valid.");
  }
  return json;
}

export interface PublishedBlogDetail extends PublishedBlogPost {
  author?: {
    name: string;
    photoProfile: string | null;
    description: string | null;
    socialMedia: Record<string, string | null>;
  } | null;
  contentHtml: string;
  categories: { id: string; name: string; slug: string }[];
  tags: { id: string; name: string; slug: string }[];
  updatedAt: string;
}

export async function fetchPublishedBlogPost(slug: string): Promise<PublishedBlogDetail | null> {
  const base = process.env.API_PROXY_TARGET ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
  const url = new URL(`/api/blog/published/${encodeURIComponent(slug)}`, base || "http://localhost:8080");
  const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(15000) });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Gagal memuat artikel (HTTP ${response.status})`);
  const json = await response.json() as { data?: PublishedBlogDetail };
  const post = json.data;
  if (!post || typeof post.title !== "string" || typeof post.slug !== "string" ||
      typeof post.contentHtml !== "string" ||
      !(post.excerpt === null || typeof post.excerpt === "string") ||
      !(post.heroImage === null || typeof post.heroImage === "string") ||
      !(post.publishedAt === null || (typeof post.publishedAt === "string" && Number.isFinite(Date.parse(post.publishedAt)))) ||
      !Number.isFinite(post.readingTimeMinutes) ||
      !Array.isArray(post.categories) || !Array.isArray(post.tags) ||
      ![...post.categories, ...post.tags].every(item => typeof item.id === "string" && typeof item.name === "string" && typeof item.slug === "string")) {
    throw new Error("Respons detail blog tidak valid.");
  }
  return post;
}
