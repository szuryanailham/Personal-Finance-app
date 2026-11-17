import type { Metadata } from "next";
import { AdminUserList } from "@/components/admin/users/admin-user-list";

export const metadata: Metadata = { title: "Users Admin | Artoku" };

export default function AdminUsersPage() {
  return (
    <main aria-label="Users admin">
      <h1 className="text-2xl font-semibold">Users</h1>
      <p className="mt-2 text-sm text-[#646970]">Daftar pengguna terdaftar aplikasi keuangan dan ringkasan transaksi.</p>
      <AdminUserList />
    </main>
  );
}
