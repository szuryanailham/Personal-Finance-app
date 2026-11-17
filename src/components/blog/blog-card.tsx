import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock3 } from "lucide-react";
import type { PublishedBlogPost } from "@/lib/api/blog";
import fallbackImage from "@/components/images/blog/image-blog.png";

interface BlogCardProps {
  post: PublishedBlogPost;
  category?: string;
  author?: string;
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

export function BlogCard({ post, category, author }: BlogCardProps) {
  const readingTime = Number.isFinite(post.readingTimeMinutes) && post.readingTimeMinutes > 0
    ? Math.ceil(post.readingTimeMinutes)
    : null;

  return (
    <article className="group h-full w-full min-w-0 rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-[border-color,box-shadow,transform] duration-300 hover:border-[#14864A]/30 hover:shadow-xl hover:shadow-[#14864A]/10 motion-safe:hover:-translate-y-1 motion-reduce:transition-none">
      <Link href={`/blog/${post.slug}`} aria-label={`Baca ${post.title}`} className="flex h-full flex-col rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14864A]">
        <div className="relative aspect-[380/228] w-full overflow-hidden rounded-t-[calc(1.5rem-1px)] bg-emerald-50">
          <Image
            src={post.heroImage || fallbackImage}
            unoptimized={!!post.heroImage}
            alt={`Ilustrasi artikel ${post.title}`}
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 767px) 50vw, (max-width: 1023px) 75vw, (max-width: 1279px) 40vw, 27vw"
            className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105 motion-reduce:transition-none"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-slate-950/35 via-transparent to-transparent" />
          <span className="absolute top-3 left-3 max-w-[calc(100%-1.5rem)] rounded-full border border-white/60 bg-white/95 px-3 py-1.5 text-xs font-semibold break-words text-[#10733e] shadow-sm">
            {category || "Keuangan Pribadi"}
          </span>
          {readingTime && (
            <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-slate-950/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              <Clock3 aria-hidden="true" className="size-3.5" />
              {readingTime} menit baca
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs leading-5 text-slate-500 sm:text-sm">
            {post.publishedAt && (
              <>
                <time dateTime={post.publishedAt} className="inline-flex items-center gap-1.5">
                  <CalendarDays aria-hidden="true" className="size-3.5 text-[#14864A]" />
                  {dateFormatter.format(new Date(post.publishedAt))}
                </time>
                {author && <span aria-hidden="true">·</span>}
              </>
            )}
            {author && <span>Oleh <span className="font-medium text-slate-700">{author}</span></span>}
          </div>
          <h3 className="mt-3 line-clamp-3 text-lg leading-snug font-semibold break-words text-slate-950 transition-colors group-hover:text-[#14864A] group-focus-visible:text-[#14864A] sm:text-xl">
            {post.title}
          </h3>
          <p className="mt-3 mb-5 line-clamp-3 text-sm leading-6 break-words text-slate-500">
            {post.excerpt}
          </p>
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <span className="text-sm font-semibold text-[#14864A]">Baca artikel</span>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[#14864A] transition-colors duration-300 group-hover:bg-[#14864A] group-hover:text-white group-focus-visible:bg-[#14864A] group-focus-visible:text-white">
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
