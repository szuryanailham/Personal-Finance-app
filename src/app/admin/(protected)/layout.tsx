import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/layout/admin-sidebar";
import { AdminSessionProvider } from "@/components/admin/blogs/blog-auth";
import { getAdminSession } from "@/lib/admin-session";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return (
    <AdminSessionProvider session={session}>
      <div className="flex min-h-dvh bg-[#f0f0f1] text-[#1d2327]">
        <AdminSidebar />
        <div className="min-w-0 flex-1 p-5 sm:p-8">{children}</div>
      </div>
    </AdminSessionProvider>
  );
}
