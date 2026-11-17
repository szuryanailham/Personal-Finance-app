import "server-only";
import { cookies } from "next/headers";
import type { BlogSession, BlogUser } from "@/types/admin/blog-category";

export const ADMIN_SESSION_COOKIE = "artoku_admin_session";
export const BLOG_BACKEND = process.env.API_PROXY_TARGET ?? "http://localhost:8080";

export async function getAdminSession(): Promise<BlogSession | null> {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  const response = await fetch(`${BLOG_BACKEND}/api/blog/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }, cache: "no-store",
  });
  if (response.status === 401 || response.status === 403) return null;
  if (!response.ok) throw new Error("Gagal memvalidasi sesi admin. Silakan coba lagi.");
  const { data: user } = await response.json() as { data: BlogUser | null };
  if (!user || !Array.isArray(user.roles)) return null;
  return { token, tokenType: "Bearer", expiresAt: "", user };
}
