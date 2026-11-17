import { apiRequest } from "@/lib/api/client";
import type { AdminUser } from "@/types/admin/user";

export const ADMIN_USERS_PAGE_SIZE = 15;

export async function fetchAdminUsers(accessToken: string, page: number, size: number, signal?: AbortSignal) {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  const response = await apiRequest<AdminUser[]>("/api/admin/users", "memuat pengguna", { accessToken, params, signal });
  if (!Array.isArray(response.data) || !response.paging) throw new Error("Respons daftar pengguna tidak valid.");
  return { users: response.data, paging: response.paging };
}
