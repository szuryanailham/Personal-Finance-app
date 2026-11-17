"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  titleHtml: string;
}

export function BlogTableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const content = document.getElementById("blog-content");
    if (!content) return;
    const headings = items.flatMap(item => {
      const element = document.getElementById(item.id);
      return element ? [{ id: item.id, element }] : [];
    });
    let frame = 0;
    function update() {
      frame = 0;
      // Match scroll-mt-24, with room for the heading at the reading line.
      const readingLine = 120;
      const bounds = content!.getBoundingClientRect();
      if (bounds.top > window.innerHeight || bounds.bottom < readingLine) {
        setActiveId(null);
        return;
      }
      let current: string | null = null;
      for (const heading of headings) {
        if (heading.element.getBoundingClientRect().top > readingLine) break;
        current = heading.id;
      }
      setActiveId(current);
    }
    function scheduleUpdate() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }
    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    // Images and fonts can move headings after the first render.
    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(content);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      observer.disconnect();
    };
  }, [items]);

  return <aside aria-labelledby="blog-toc-title" className="min-w-0 rounded-2xl border border-slate-200 p-4 lg:sticky lg:top-24">
    <h2 id="blog-toc-title" className="text-base font-semibold text-slate-950">Daftar Isi</h2>
    <nav aria-label="Daftar isi artikel" className="mt-3 max-h-[calc(100dvh-12rem)] overflow-y-auto">
      <ul className="border-l-2 border-[#14864A]/20">
        {items.map(item => {
          const active = activeId === item.id;
          return <li key={item.id}>
            <a href={`#${item.id}`} aria-current={active ? "location" : undefined}
              className={`-ml-0.5 block border-l-2 py-2 pr-2 pl-3 text-sm leading-6 break-words transition-colors hover:bg-[#14864A]/5 hover:text-[#14864A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14864A] ${active ? "border-[#14864A] bg-[#14864A]/10 font-semibold text-[#14864A]" : "border-transparent text-slate-600"}`}>
              <span dangerouslySetInnerHTML={{ __html: item.titleHtml }} />
            </a>
          </li>;
        })}
      </ul>
    </nav>
  </aside>;
}
