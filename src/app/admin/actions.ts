"use server";

import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, BLOG_BACKEND } from "@/lib/admin-session";

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
