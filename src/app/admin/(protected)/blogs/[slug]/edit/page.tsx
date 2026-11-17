import type { Metadata } from "next";
import { AdminBlogCreate } from "@/components/admin/blogs/admin-blog-create";

export const metadata: Metadata = { title: "Edit Blog | Artoku" };

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <AdminBlogCreate editSlug={slug} />;
}
