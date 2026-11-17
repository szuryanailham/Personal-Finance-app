"use client";

import { createContext, useContext, type ReactNode } from "react";
import { adminLogout } from "@/app/admin/actions";
import type { BlogSession } from "@/types/admin/blog-category";

const AdminSessionContext = createContext<BlogSession | null>(null);

export function AdminSessionProvider({ session, children }: { session: BlogSession; children: ReactNode }) {
  return <AdminSessionContext.Provider value={session}>{children}</AdminSessionContext.Provider>;
}

export function useAdminSession() {
  const session = useContext(AdminSessionContext);
  if (!session) throw new Error("Sesi admin diperlukan.");
  return session;
}

export function BlogAuth({ children }: { children: (session: BlogSession, onExpired: () => void) => ReactNode }) {
  const session = useContext(AdminSessionContext);
  if (!session) throw new Error("Sesi admin diperlukan.");
  async function expire() {
    await adminLogout();
    window.location.replace("/admin/login");
  }
  return <>{children(session, expire)}</>;
}
