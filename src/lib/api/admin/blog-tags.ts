import { apiRequest } from "@/lib/api/client";
import type { BlogTag, BlogTagInput } from "@/types/admin/blog-tag";

const PATH = "/api/blog/tags";
export const BLOG_TAG_PAGE_SIZE = 20;

export async function fetchBlogTags(accessToken: string, page: number, search: string, signal?: AbortSignal) {
  const params = new URLSearchParams({ page: String(page), size: String(BLOG_TAG_PAGE_SIZE), search });
  const response = await apiRequest<BlogTag[]>(PATH, "memuat tag blog", { accessToken, params, signal });
  if (!Array.isArray(response.data) || !response.paging) throw new Error("Respons tag blog tidak valid.");
  return { tags: response.data, paging: response.paging };
}

export async function saveBlogTag(accessToken: string, input: BlogTagInput, id?: string): Promise<BlogTag> {
  const { data } = await apiRequest<BlogTag>(id ? `${PATH}/${encodeURIComponent(id)}` : PATH, "menyimpan tag blog", {
    method: id ? "PUT" : "POST", body: { name: input.name, slug: input.slug }, accessToken,
  });
  if (!data?.id) throw new Error("Respons tag blog tidak valid.");
  return data;
}

export async function deleteBlogTag(accessToken: string, id: string): Promise<void> {
  await apiRequest<null>(`${PATH}/${encodeURIComponent(id)}`, "menghapus tag blog", { method: "DELETE", accessToken });
}

/** Cari seluruh halaman, terlepas dari filter/pagination tabel yang sedang dibuka. */
export async function fetchBlogTagSlugs(accessToken: string, base: string, excludeId?: string, signal?: AbortSignal): Promise<string[]> {
  const slugs: string[] = [];
  // Pencarian prefix pendek juga mencakup slug panjang yang dipotong untuk suffix angka.
  const search = base.slice(0, 100);
  for (let page = 0; ; page++) {
    const result = await fetchBlogTags(accessToken, page, search, signal);
    slugs.push(...result.tags.filter((tag) => tag.id !== excludeId).map((tag) => tag.slug));
    if (page + 1 >= result.paging.totalPage) return slugs;
  }
}
