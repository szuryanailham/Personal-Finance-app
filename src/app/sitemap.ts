import type { MetadataRoute } from "next";
import { fetchPublishedBlogPosts } from "@/lib/api/blog";
import { CRAWLABLE_PATHS, SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = new Set(CRAWLABLE_PATHS);
  let skip = 0;
  let hasMore: boolean;

  do {
    const { data, paging } = await fetchPublishedBlogPosts(skip);
    for (const post of data) {
      paths.add(`/blog/${encodeURIComponent(post.slug)}`);
    }

    hasMore = paging.hasMore;
    skip += paging.limit;
  } while (hasMore);

  return Array.from(paths, (path) => ({
    url: new URL(path, SITE_URL).href,
  }));
}
