import type { BlogPost } from "@/lib/dummy/blog-posts";

export function BlogArticle({ post }: { post: BlogPost }) {
  return (
    <div id="blog-content" className="space-y-8 text-base leading-8 break-words text-slate-600">
      <p>{post.introduction}</p>
      {post.sections.map((section) => (
        <section key={section.id} aria-labelledby={section.id} className="space-y-4">
          <h2 id={section.id} className="scroll-mt-24 text-xl font-semibold text-slate-950 sm:text-2xl">{section.title}</h2>
          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {section.points && (
            <ul className="list-disc space-y-2 pl-6">
              {section.points.map((point) => <li key={point}>{point}</li>)}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
