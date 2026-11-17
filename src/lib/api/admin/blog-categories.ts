import { apiRequest } from "@/lib/api/client";
import type { BlogCategory, BlogCategoryInput, BlogSession, BlogUser } from "@/types/admin/blog-category";

const PATH = "/api/blog/categories";
export const BLOG_CATEGORY_PAGE_SIZE = 20;

export async function loginBlog(email: string, password: string): Promise<BlogSession> {
  const { data } = await apiRequest<BlogSession>("/api/blog/auth/login", "login blog", {
    method: "POST", body: { email, password }, isPublic: true,
  });
  if (!data?.token || !data.user || !Number.isFinite(Date.parse(data.expiresAt)) || Date.parse(data.expiresAt) <= Date.now()) {
    throw new Error("Respons sesi blog tidak valid.");
  }
  return data;
}

export async function fetchBlogUser(accessToken: string, signal?: AbortSignal): Promise<BlogUser> {
  const { data } = await apiRequest<BlogUser>("/api/blog/auth/me", "memuat akun blog", { accessToken, signal });
  if (!data) throw new Error("Data akun blog kosong.");
  return data;
}

export async function logoutBlog(accessToken: string): Promise<void> {
  await apiRequest<null>("/api/blog/auth/logout", "keluar dari akun blog", { method: "POST", accessToken });
}

export async function fetchBlogCategories(accessToken: string, page: number, search: string, signal?: AbortSignal) {
  const params = new URLSearchParams({ page: String(page), size: String(BLOG_CATEGORY_PAGE_SIZE), search });
  const response = await apiRequest<BlogCategory[]>(PATH, "memuat kategori blog", { accessToken, params, signal });
  if (!Array.isArray(response.data) || !response.paging) throw new Error("Respons kategori blog tidak valid.");
  return { categories: response.data, paging: response.paging };
}

export async function saveBlogCategory(accessToken: string, input: BlogCategoryInput, id?: string): Promise<BlogCategory> {
  const { data } = await apiRequest<BlogCategory>(id ? `${PATH}/${encodeURIComponent(id)}` : PATH, "menyimpan kategori blog", {
    method: id ? "PUT" : "POST", body: input, accessToken,
  });
  if (!data?.id) throw new Error("Respons kategori blog tidak valid.");
  return data;
}

export async function deleteBlogCategory(accessToken: string, id: string): Promise<void> {
  await apiRequest<null>(`${PATH}/${encodeURIComponent(id)}`, "menghapus kategori blog", { method: "DELETE", accessToken });
}

/** Cari seluruh halaman, terlepas dari filter/pagination tabel yang sedang dibuka. */
export async function fetchBlogCategorySlugs(accessToken: string, base: string, excludeId?: string, signal?: AbortSignal): Promise<string[]> {
  const slugs: string[] = [];
  // Pencarian prefix pendek juga mencakup slug panjang yang dipotong untuk suffix angka.
  const search = base.slice(0, 100);
  for (let page = 0; ; page++) {
    const result = await fetchBlogCategories(accessToken, page, search, signal);
    slugs.push(...result.categories.filter((category) => category.id !== excludeId).map((category) => category.slug));
    if (page + 1 >= result.paging.totalPage) return slugs;
  }
}
