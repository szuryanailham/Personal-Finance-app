"use client";

import type { BlogCategory } from "@/lib/dummy/blog-categories";

interface BlogCategoryFilterProps {
  categories: BlogCategory[];
  selectedSlugs: string[];
  query: string;
}

export function BlogCategoryFilter({ categories, selectedSlugs, query }: BlogCategoryFilterProps) {
  return (
    <form action="/blog" method="get" onChange={(event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement && target.value === "all") {
        event.currentTarget.querySelectorAll<HTMLInputElement>('input[name="category"]').forEach((input) => {
          input.checked = false;
        });
      }
      event.currentTarget.requestSubmit();
    }}>
      {query && <input type="hidden" name="q" value={query} />}
      <fieldset>
        <legend className="text-base font-semibold text-slate-950">Kategori</legend>
        <div tabIndex={0} role="region" aria-label="Daftar kategori blog" className="mt-2 max-h-48 overflow-y-auto pr-2 focus-visible:outline-2 focus-visible:outline-[#14864A]">
          <label className="flex min-h-11 cursor-pointer items-center gap-2 md:min-h-9 text-sm text-slate-600 hover:text-[#14864A]">
            <input
              type="checkbox"
              value="all"
              defaultChecked={selectedSlugs.length === 0}
              className="size-4 shrink-0 accent-[#14864A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14864A]"
            />
            All Category
          </label>
          {categories.map((item) => (
            <label key={item.id} className="flex min-h-11 cursor-pointer items-center gap-2 md:min-h-9 text-sm text-slate-600 hover:text-[#14864A]">
              <input
                type="checkbox"
                name="category"
                value={item.slug}
                defaultChecked={selectedSlugs.includes(item.slug)}
                className="size-4 shrink-0 accent-[#14864A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14864A]"
              />
              {item.name}
            </label>
          ))}
        </div>
      </fieldset>
    </form>
  );
}
