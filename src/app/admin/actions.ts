"use server";

import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, BLOG_BACKEND } from "@/lib/admin-session";
import type { BlogSession } from "@/types/admin/blog-category";

export async function adminLogin(email: string, password: string): Promise<{ error?: string }> {
  try {
    const response = await fetch(`${BLOG_BACKEND}/api/blog/auth/login`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }), cache: "no-store",
    });
    const json = await response.json();
    if (!response.ok) return { error: typeof json.errors === "string" ? json.errors : "Email atau password tidak valid." };
    const session = json.data as BlogSession;
    if (!session?.token || !session.user || !Array.isArray(session.user.roles) || !Number.isFinite(Date.parse(session.expiresAt)) || Date.parse(session.expiresAt) <= Date.now()) {
      return { error: "Respons sesi admin tidak valid." };
    }
    (await cookies()).set(ADMIN_SESSION_COOKIE, session.token, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax",
      path: "/", expires: new Date(session.expiresAt),
    });
    return {};
  } catch {
    return { error: "Tidak dapat menghubungi layanan login. Silakan coba lagi." };
  }
}

export async function adminLogout(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(ADMIN_SESSION_COOKIE)?.value;
  jar.delete(ADMIN_SESSION_COOKIE);
  if (token) {
    try {
      await fetch(`${BLOG_BACKEND}/api/blog/auth/logout`, {
        method: "POST", headers: { Authorization: `Bearer ${token}` }, cache: "no-store",
      });
    } catch { /* Sesi lokal sudah dihapus meskipun backend tidak tersedia. */ }
  }
}
