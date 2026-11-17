import type { Metadata } from "next";
import Link from "next/link";
import { AdminBlogList } from "@/components/admin/blogs/admin-blog-list";

export const metadata: Metadata = { title: "Blogs Admin | Artoku" };

export default function AdminBlogsPage() {
  return (
    <main aria-label="Blogs admin">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-normal">Blogs</h1>
        <div className="flex flex-wrap gap-2">
        <Link href="/admin/blogs/create" className="rounded-[3px] bg-[#2271b1] px-3 py-2 text-sm text-white hover:bg-[#135e96]">Tambah Blog</Link>
        <Link href="/admin/blogs/tags" className="rounded-[3px] border border-[#2271b1] px-3 py-2 text-sm text-[#2271b1] hover:bg-[#f0f6fc]">Tags</Link>
        <Link href="/admin/blogs/categories" className="rounded-[3px] border border-[#2271b1] px-3 py-2 text-sm text-[#2271b1] hover:bg-[#f0f6fc]">Kategori Blog</Link>
        </div>
      </div>
      <p className="mt-2 text-sm text-[#646970]">Daftar artikel blog MyArtoku.</p>
      <AdminBlogList />
    </main>
  );
}
