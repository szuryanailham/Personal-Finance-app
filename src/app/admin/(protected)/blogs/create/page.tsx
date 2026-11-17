import type { Metadata } from "next";
import { AdminBlogCreate } from "@/components/admin/blogs/admin-blog-create";
export const metadata: Metadata = { title: "Tambah Blog | Artoku" };
export default function Page() { return <AdminBlogCreate />; }
