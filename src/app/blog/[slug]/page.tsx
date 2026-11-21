import { createPageMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";
import { BlogShareActions } from "@/components/blog/blog-share-actions";
import { BlogTableOfContents } from "@/components/blog/blog-table-of-contents";
import { prepareBlogContent } from "@/lib/blog-content";
import fallbackImage from "@/components/images/blog/image-blog.png";
import { fetchPublishedBlogPost } from "@/lib/api/blog";
import { SITE_URL } from "@/lib/seo";
import { cache } from "react";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, Globe } from "lucide-react";
import { FaInstagram, FaTiktok, FaLinkedin } from "react-icons/fa";
import { HomeNavbar } from "@/components/home/home-navbar";
import { HomeFooter } from "@/components/home/home-footer";
import { AUTH_EXPIRED_AT_COOKIE, AUTH_TOKEN_COOKIE, isSessionValid } from "@/lib/auth";
interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

const findPost = cache(fetchPublishedBlogPost);

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await findPost(slug);
  if (!post) notFound();
  return createPageMetadata({
    title: `${post.title} | MyArtoku Blog`,
    description: post.excerpt ?? post.title,
    path: `/blog/${post.slug}`,
    image: post.heroImage || fallbackImage.src,
    type: "article",
  });
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await findPost(slug);
  if (!post) notFound();

  const excerpt = post.excerpt?.trim();
  const author = post.author;
  const authorName = author?.name?.trim();
  const socialLinks = Object.entries(author?.socialMedia ?? {}).flatMap(([label, value]) => {
    if (typeof value !== "string" || !value.trim()) return [];
    try {
      const url = new URL(value.trim());
      const platform = label.trim().toLowerCase().replace(/[\s_-]+/g, "");
      const Icon = platform === "instagram" ? FaInstagram : platform === "tiktok" ? FaTiktok : platform === "linkedin" ? FaLinkedin : Globe;
      const name = platform === "instagram" ? "Instagram" : platform === "tiktok" ? "TikTok" : platform === "linkedin" ? "LinkedIn" : label;
      return ["https:", "http:"].includes(url.protocol) ? [{ label: name, href: url.href, Icon }] : [];
    } catch {
      return [];
    }
  });
  const { html, toc } = prepareBlogContent(post.contentHtml);
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
                {post.categories.map(category => category.name).join(" · ") || "MyArtoku Blog"}
              </span>
              <h1 id="blog-detail-title" className="scroll-mt-24 mt-4 text-3xl leading-tight font-semibold break-words tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>
              {(post.publishedAt || authorName) && (
                <div className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-slate-500 sm:text-sm">
                  {post.publishedAt && (
                    <time dateTime={post.publishedAt}>
                      {new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" }).format(new Date(post.publishedAt))}
                    </time>
                  )}
                  {post.publishedAt && authorName && <span aria-hidden="true">·</span>}
                  {authorName && (
                    <span>Oleh <a href="#blog-author-title" className="font-medium text-[#14864A] hover:underline">{authorName}</a></span>
                  )}
                </div>
              )}
              {excerpt && (
                <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed wrap-anywhere text-neutral-500 sm:text-lg">
                  {excerpt}
                </p>
              )}
              <BlogShareActions title={post.title} url={new URL(`/blog/${post.slug}`, SITE_URL).href} />
            </header>
            <div className="relative mt-8 aspect-[380/228] overflow-hidden rounded-2xl">
              <Image
                src={post.heroImage || fallbackImage}
                unoptimized={!!post.heroImage}
                alt={`Ilustrasi artikel ${post.title}`}
                fill
                sizes="(max-width: 959px) 100vw, 896px"
                className="object-cover"
              />
            </div>
          </section>
          <div className={`grid grid-cols-1 items-start gap-6 lg:grid-cols-[16rem_minmax(0,1fr)] ${authorName ? "2xl:grid-cols-[18rem_minmax(0,1fr)_14rem]" : ""} xl:gap-8`}>
            {toc.length > 0 && <BlogTableOfContents items={toc} />}
            <article className={`min-w-0 ${toc.length === 0 ? "lg:col-span-2" : ""}`} aria-labelledby="blog-detail-title">
              <div id="blog-content" className="mx-auto max-w-[70ch] space-y-5 text-base leading-8 [overflow-wrap:anywhere] text-slate-600 [&_h1]:mt-8 [&_h1]:leading-snug [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:mt-8 [&_h2]:leading-snug [&_h2]:scroll-mt-24 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:leading-snug [&_h3]:scroll-mt-24 [&_h3]:text-lg [&_h3]:font-semibold [&_a]:text-[#14864A] [&_a]:underline [&_li]:mt-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_img]:max-w-full [&_table]:block [&_table]:overflow-x-auto [&_th]:border [&_th]:border-slate-300 [&_th]:p-2 [&_td]:border [&_td]:border-slate-300 [&_td]:p-2" dangerouslySetInnerHTML={{ __html: html }} />
              {post.tags.length > 0 && <ul aria-label="Tag artikel" className="mt-8 flex flex-wrap gap-2">{post.tags.map(tag => <li key={tag.id} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">#{tag.name}</li>)}</ul>}
            </article>
            {authorName && <aside aria-labelledby="blog-author-title" className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50/60 p-5 lg:col-start-2 2xl:col-start-auto 2xl:sticky 2xl:top-24">
              <h2 id="blog-author-title" className="scroll-mt-24 text-base font-semibold text-slate-950">Tentang Penulis</h2>
              {author?.photoProfile ? (
                <div className="relative mt-5 size-16 overflow-hidden rounded-full">
                  <Image src={author.photoProfile} alt={`Foto ${authorName}`} fill sizes="64px" unoptimized className="object-cover" />
                </div>
              ) : (
                <div aria-hidden="true" className="mt-5 flex size-16 items-center justify-center rounded-full bg-[#14864A]/10 text-lg font-semibold text-[#14864A]">
                  {authorName.split(/\s+/).slice(0, 2).map(word => word[0]).join("").toLocaleUpperCase("id-ID")}
                </div>
              )}
              <p className="mt-3 font-semibold break-words text-slate-950">{authorName}</p>
              {author?.description && <p className="mt-3 text-sm leading-6 whitespace-pre-line break-words text-slate-600">{author.description}</p>}
              {socialLinks.length > 0 && <ul aria-label="Media sosial penulis" className="mt-4 flex flex-wrap gap-3">
                {socialLinks.map(link => <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`${link.label} ${authorName} (tab baru)`} title={link.label} className="inline-flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-black transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
                    <link.Icon aria-hidden="true" className="size-5" />
                  </a>
                </li>)}
              </ul>}
            </aside>}

          </div>
        </div>
      </main>
      <HomeFooter />
    </div>
  );
}
