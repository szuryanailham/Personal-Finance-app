import type { Metadata } from "next";
import Link from "next/link";
import { AdminBlogTags } from "@/components/admin/blogs/admin-blog-tags";

export const metadata: Metadata = { title: "Tags Blog Admin | Artoku" };

export default function AdminBlogTagsPage() {
  return (
    <main aria-label="Tags blog admin">
      <Link href="/admin/blogs" className="text-sm text-[#2271b1] hover:underline">← Kembali ke Blogs</Link>
      <h1 className="mt-4 text-2xl font-normal">Tags Blog</h1>
      <p className="mt-2 mb-6 text-sm text-[#646970]">Kelola tag artikel blog Artoku.</p>
      <AdminBlogTags />
    </main>
  );
}
