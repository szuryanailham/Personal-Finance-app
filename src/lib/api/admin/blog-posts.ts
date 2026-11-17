import { apiRequest } from "@/lib/api/client";

export const BLOG_POST_PAGE_SIZE = 20;

interface BlogPostSummary {
  id: string;
  authorName: string;
  title: string;
  slug: string;
  heroImage: string | null;
  status: "DRAFT" | "PUBLISHED";
  publishedAt: string | null;
  updatedAt: string;
}

interface BlogOffsetPaging {
  skip: number;
  limit: number;
  totalItem: number;
  hasMore: boolean;
}

export async function fetchBlogPosts(accessToken: string, skip: number, signal?: AbortSignal) {
  const params = new URLSearchParams({ skip: String(skip), limit: String(BLOG_POST_PAGE_SIZE) });
  // Endpoint posting memakai offset paging, berbeda dari paging endpoint kategori/tag.
  const response = await apiRequest<BlogPostSummary[]>("/api/blog/posts", "memuat blog", { accessToken, params, signal });
  const paging = response.paging as unknown as BlogOffsetPaging | null;
  if (!Array.isArray(response.data) || !paging || !Number.isInteger(paging.skip) ||
      !Number.isInteger(paging.limit) || paging.limit <= 0 ||
      !Number.isInteger(paging.totalItem) || paging.totalItem < 0 || typeof paging.hasMore !== "boolean") {
    throw new Error("Respons daftar blog tidak valid.");
  }
  return {
    posts: response.data.map(post => ({
      id: post.id, title: post.title, slug: post.slug, heroImage: post.heroImage,
      author: post.authorName, status: post.status, date: post.publishedAt ?? post.updatedAt,
    })),
    paging,
  };
}

export interface BlogPostDetail {
  heroImage?: string | null;
  featuredMediaId?: string | null;
  title: string;
  slug: string;
  excerpt: string | null;
  contentHtml: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  categoryIds: string[];
  tagIds: string[];
}

export async function fetchBlogPost(accessToken: string, slug: string, signal?: AbortSignal) {
  const response = await apiRequest<BlogPostDetail>(`/api/blog/posts/${encodeURIComponent(slug)}`, "memuat artikel", { accessToken, signal });
  if (!response.data || typeof response.data.contentHtml !== "string" || !Array.isArray(response.data.categoryIds) || !Array.isArray(response.data.tagIds)) {
    throw new Error("Respons detail blog tidak valid.");
  }
  const post = response.data;
  // Detail API returns the media ID; the list API includes its display URL.
  if (post.heroImage === undefined && post.featuredMediaId) {
    let skip = 0;
    while (true) {
      const result = await fetchBlogPosts(accessToken, skip, signal);
      const summary = result.posts.find(item => item.slug === post.slug);
      if (summary) return { ...post, heroImage: summary.heroImage };
      if (!result.paging.hasMore) break;
      const nextSkip = result.paging.skip + result.paging.limit;
      if (nextSkip <= skip) throw new Error("Paging daftar blog tidak valid.");
      skip = nextSkip;
    }
  }
  return post;
}

export function deleteBlogPost(accessToken: string, slug: string) {
  return apiRequest<void>(`/api/blog/posts/${encodeURIComponent(slug)}`, "menghapus blog", { accessToken, method: "DELETE" });
}

export function updateBlogPost(accessToken: string, slug: string, post: BlogPostDetail & { featuredMediaId?: string | null }) {
  return apiRequest<BlogPostDetail>(`/api/blog/posts/${encodeURIComponent(slug)}`, "mengedit blog", {
    accessToken, method: "PATCH", body: post,
  });
}
