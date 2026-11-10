import { createPageMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";
import { BlogArticle } from "@/components/blog/blog-article";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { HomeNavbar } from "@/components/home/home-navbar";
import { HomeFooter } from "@/components/home/home-footer";
import { AUTH_EXPIRED_AT_COOKIE, AUTH_TOKEN_COOKIE, isSessionValid } from "@/lib/auth";
import { dummyBlogCategories } from "@/lib/dummy/blog-categories";
import { dummyBlogAuthors, dummyBlogPostCategories, dummyBlogPostsResponse } from "@/lib/dummy/blog-posts";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

function findPost(slug: string) {
  return dummyBlogPostsResponse.data.find((post) => post.slug === slug && post.status === "PUBLISHED");
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) notFound();
  return createPageMetadata({
    title: `${post.title} | MyArtoku Blog`,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.heroImage,
    type: "article",
  });
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) notFound();

  const toc = post.sections;
  const category = dummyBlogCategories.find((item) => item.slug === dummyBlogPostCategories[post.id]);
  const author = dummyBlogAuthors[post.authorId] ?? "Tim MyArtoku";
  const cookieStore = await cookies();
  const isLoggedIn = isSessionValid(
    cookieStore.get(AUTH_TOKEN_COOKIE)?.value,
    cookieStore.get(AUTH_EXPIRED_AT_COOKIE)?.value,
  );

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <HomeNavbar isLoggedIn={isLoggedIn} />
      <main id="main-content" tabIndex={-1} className="flex-1 px-5 pt-4 pb-10 font-inter sm:px-8 sm:pt-6 sm:pb-14 lg:px-10">
        <div className="mx-auto w-full max-w-7xl">
          <Link href="/blog" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#14864A] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14864A]">
            <ArrowLeftIcon aria-hidden="true" className="size-4" />
            Kembali ke blog
          </Link>
          <section aria-labelledby="blog-detail-title" className="mx-auto mt-2 mb-12 max-w-4xl sm:mb-16">
            <header className="text-center">
              <span className="inline-flex rounded-full bg-[#14864A]/10 px-4 py-1.5 text-sm font-semibold text-[#14864A]">
                {category?.name ?? "Keuangan Pribadi"}
              </span>
              <h1 id="blog-detail-title" className="scroll-mt-24 mt-4 text-3xl leading-tight font-semibold break-words tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-slate-500">
                {post.publishedAt && (
                  <>
                    <time dateTime={post.publishedAt}>
                      {new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" }).format(new Date(post.publishedAt))}
                    </time>
                    <span aria-hidden="true">·</span>
                  </>
                )}
                <span>Oleh <span className="font-medium text-slate-700">{author}</span></span>
              </div>
              <p className="mt-3 text-sm text-slate-500">{post.readingTimeMinutes} menit baca</p>
            </header>
            <div className="relative mt-8 aspect-[380/228] overflow-hidden rounded-2xl">
              <Image
                src={post.heroImage}
                alt={`Ilustrasi artikel ${post.title}`}
                fill
                sizes="(max-width: 959px) 100vw, 896px"
                className="object-cover"
              />
            </div>
          </section>
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[10rem_minmax(0,1fr)_13rem] xl:grid-cols-[12rem_minmax(0,1fr)_15rem] xl:gap-8">
            <aside aria-labelledby="blog-toc-title" className="min-w-0 rounded-2xl border border-slate-200 p-4 lg:sticky lg:top-24">
              <h2 id="blog-toc-title" className="text-base font-semibold text-slate-950">Daftar Isi</h2>
              <nav aria-label="Daftar isi artikel" className="mt-3">
                <ul className="border-l-2 border-[#14864A]/20">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`} className="block py-2 pl-3 text-sm leading-6 break-words text-[#14864A] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14864A]">
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
            <article className="min-w-0" aria-labelledby="blog-detail-title">
              <BlogArticle post={post} />
            </article>
            <aside aria-labelledby="blog-author-title" className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50/60 p-5 lg:sticky lg:top-24">
              <h2 id="blog-author-title" className="text-base font-semibold text-slate-950">Tentang Penulis</h2>
              <div aria-hidden="true" className="mt-5 flex size-14 items-center justify-center rounded-full bg-[#14864A]/10 text-lg font-semibold text-[#14864A]">
                {author.split(" ").slice(0, 2).map((word) => word[0]).join("")}
              </div>
              <p className="mt-3 font-semibold break-words text-slate-950">{author}</p>
              <p className="mt-1 text-xs font-medium text-[#14864A]">Penulis MyArtoku Blog</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Berbagi tips dan panduan untuk membantu kamu membangun kebiasaan keuangan yang lebih baik.
              </p>
            </aside>
          </div>
        </div>
      </main>
      <HomeFooter />
    </div>
  );
}
