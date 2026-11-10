import { createPageMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";
import { BlogCard } from "@/components/blog/blog-card";
import { dummyBlogAuthors, dummyBlogPostCategories, dummyBlogPostsResponse } from "@/lib/dummy/blog-posts";
import { BlogCategoryFilter } from "@/components/blog/blog-category-filter";
import { cookies } from "next/headers";
import { dummyBlogCategories } from "@/lib/dummy/blog-categories";
import { HomeNavbar } from "@/components/home/home-navbar";
import { HomeFooter } from "@/components/home/home-footer";
import { AUTH_EXPIRED_AT_COOKIE, AUTH_TOKEN_COOKIE, isSessionValid } from "@/lib/auth";

export const metadata: Metadata = createPageMetadata({
  title: "Tips dan Panduan Keuangan Pribadi | Myartoku Blog",
  description: "Temukan tips keuangan pribadi dan panduan mengatur uang untuk membangun kebiasaan finansial yang lebih baik bersama MyArtoku.",
  path: "/blog",
});

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; category?: string | string[] }>;
}) {
  const { q, category } = await searchParams;
  const categorySlugs = Array.isArray(category) ? category : category ? [category] : [];
  const selectedSlugs = dummyBlogCategories
    .filter((item) => categorySlugs.includes(item.slug))
    .map((item) => item.slug);
  const query = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";
  const posts = dummyBlogPostsResponse.data.filter((post) => {
    const matchesQuery = `${post.title} ${post.excerpt}`.toLocaleLowerCase("id-ID").includes(query.toLocaleLowerCase("id-ID"));
    const matchesCategory = selectedSlugs.length === 0 || selectedSlugs.includes(dummyBlogPostCategories[post.id]);
    return post.status === "PUBLISHED" && matchesQuery && matchesCategory;
  });
  const cookieStore = await cookies();
  const isLoggedIn = isSessionValid(
    cookieStore.get(AUTH_TOKEN_COOKIE)?.value,
    cookieStore.get(AUTH_EXPIRED_AT_COOKIE)?.value,
  );

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <HomeNavbar isLoggedIn={isLoggedIn} />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <section aria-labelledby="blog-hero-title" className="px-5 pt-12 pb-10 font-inter sm:px-8 sm:pt-16 sm:pb-14 lg:px-10 lg:pt-20">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center text-center">
            <span className="inline-flex items-center justify-center rounded-full bg-[#21B761]/48 px-5 py-2 text-sm font-semibold text-[#14864A]">
              Myartoku Blog
            </span>
            <h1 id="blog-hero-title" className="mt-6 max-w-2xl text-3xl leading-tight font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl lg:leading-[1.15]">
              Tips dan Panduan <span className="text-[#14864A]">Keuangan Pribadi</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg sm:leading-9">
              Temukan tips keuangan pribadi dan panduan mengatur uang untuk membangun kebiasaan finansial yang lebih baik bersama MyArtoku.
            </p>
            <form action="/blog" method="get" role="search" className="mt-8 flex w-full max-w-2xl items-stretch gap-3">
              {selectedSlugs.map((slug) => <input key={slug} type="hidden" name="category" value={slug} />)}
              <label htmlFor="blog-search" className="sr-only">Cari tips dan panduan keuangan</label>
              <input
                id="blog-search"
                name="q"
                type="search"
                defaultValue={query}
                placeholder="Cari tips dan panduan keuangan..."
                className="min-h-12 min-w-0 flex-1 rounded-[0.3rem] border-0 bg-white px-4 py-3 text-base text-slate-950 shadow-md placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14864A]"
              />
              <button type="submit" className="min-h-12 shrink-0 rounded-xl border-0 bg-[#14864A] px-7 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#10733e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14864A]">
                Cari
              </button>
            </form>
          </div>
        </section>
        <section aria-label="Konten blog" className="px-5 pb-14 font-inter sm:px-8 sm:pb-20 lg:px-10">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-y-6 md:grid-cols-[11rem_minmax(0,1fr)] lg:grid-cols-[12rem_minmax(0,1fr)]">
            <aside aria-label="Filter artikel" className="min-w-0 border-b border-slate-200 pb-4 md:border-r md:border-b-0 md:pr-4 md:pb-0">
              <BlogCategoryFilter
                key={JSON.stringify([query, selectedSlugs])}
                categories={dummyBlogCategories}
                selectedSlugs={selectedSlugs}
                query={query}
              />
            </aside>
            <section aria-labelledby="blog-articles-title" className="min-w-0 md:pl-6">
              <h2 id="blog-articles-title" className="text-xl font-semibold text-slate-950">Artikel Blog</h2>
              {posts.length > 0 ? (
                <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                  {posts.map((post) => (
                    <BlogCard
                      key={post.id}
                      post={post}
                      category={dummyBlogCategories.find((item) => item.slug === dummyBlogPostCategories[post.id])?.name ?? "Keuangan Pribadi"}
                      author={dummyBlogAuthors[post.authorId] ?? "Tim MyArtoku"}
                    />
                  ))}
                </div>
              ) : (
                <p role="status" className="mt-4 text-sm leading-6 text-slate-600">
                  {query
                    ? `Belum ada artikel tersedia untuk pencarian “${query}”.`
                    : "Belum ada artikel tersedia untuk kategori yang dipilih."}
                </p>
              )}
            </section>
          </div>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
}
