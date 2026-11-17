import type { Metadata } from "next";
import { AdminProfileForm } from "@/components/admin/profile/admin-profile-form";

export const metadata: Metadata = { title: "Edit Profile | Artoku Admin" };

export default function AdminProfilePage() {
  return <main className="max-w-2xl">
    <h1 className="text-2xl font-semibold">Edit profil</h1>
    <p className="mt-2 text-sm text-[#646970]">Perbarui informasi profil penulis artikel Anda.</p>
    <AdminProfileForm />
  </main>;
}
