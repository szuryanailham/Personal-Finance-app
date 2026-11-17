import type { Metadata } from "next";
import Link from "next/link";
import { AdminBlogCategories } from "@/components/admin/blogs/admin-blog-categories";

export const metadata: Metadata = { title: "Kategori Blog Admin | Artoku" };

export default function AdminBlogCategoriesPage() {
  return (
    <main aria-label="Kategori blog admin">
      <Link href="/admin/blogs" className="text-sm text-[#2271b1] hover:underline">← Kembali ke Blogs</Link>
      <h1 className="mt-4 text-2xl font-normal">Kategori Blog</h1>
      <p className="mt-2 mb-6 text-sm text-[#646970]">Kelola kategori artikel blog Artoku.</p>
      <AdminBlogCategories />
    </main>
  );
}
