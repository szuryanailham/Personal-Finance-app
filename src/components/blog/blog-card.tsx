import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/dummy/blog-posts";

interface BlogCardProps {
  post: BlogPost;
  category: string;
  author: string;
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

export function BlogCard({ post, category, author }: BlogCardProps) {
  return (
    <article className="w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Link href={`/blog/${post.slug}`} aria-label={`Baca ${post.title}`} className="block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14864A]">
        <div className="relative aspect-[380/228] w-full overflow-hidden">
          <Image
            src={post.heroImage}
            alt={`Ilustrasi artikel ${post.title}`}
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 767px) 50vw, (max-width: 1023px) 75vw, 33vw"
            className="object-cover"
          />
          <span className="absolute top-4 left-4 max-w-[calc(100%-2rem)] rounded-full bg-[#14864A] px-3 py-1.5 text-xs font-semibold break-words text-white shadow-sm">
            {category}
          </span>
        </div>
        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs leading-5 text-slate-500 sm:text-sm">
            {post.publishedAt && (
              <>
                <time dateTime={post.publishedAt}>{dateFormatter.format(new Date(post.publishedAt))}</time>
                <span aria-hidden="true">·</span>
              </>
            )}
            <span>Oleh <span className="font-medium text-slate-700">{author}</span></span>
          </div>
          <h3 className="mt-3 text-lg leading-snug font-semibold break-words text-slate-950 sm:text-xl">
            {post.title}
          </h3>
          <p className="mt-2 text-sm leading-6 break-words text-slate-600">
            {post.excerpt}
          </p>
        </div>
      </Link>
    </article>
  );
}
