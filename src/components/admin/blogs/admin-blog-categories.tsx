"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CircleCheck, X } from "lucide-react";
import { BlogAuth } from "./blog-auth";
import { useBlogCategories } from "@/hooks/admin/use-blog-categories";
import { deleteBlogCategory, fetchBlogCategorySlugs, saveBlogCategory } from "@/lib/api/admin/blog-categories";
import { slugify, uniqueSlug } from "@/lib/blog-slug";
import { ApiError } from "@/lib/api/client";
import type { BlogCategory, BlogCategoryInput, BlogSession } from "@/types/admin/blog-category";

const control = "min-h-10 w-full rounded-[3px] border border-[#8c8f94] bg-white px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2271b1] disabled:opacity-50";
const buttonBase = "min-h-10 cursor-pointer rounded-[3px] border border-[#2271b1] px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2271b1] disabled:cursor-not-allowed disabled:opacity-50";
const button = `${buttonBase} text-[#2271b1] hover:bg-[#f0f6fc]`;
const primary = `${buttonBase} bg-[#2271b1] text-white hover:bg-[#135e96]`;
const emptyInput: BlogCategoryInput = { name: "", slug: "", description: "" };
const messageOf = (error: unknown) => error instanceof Error ? error.message : "Terjadi kesalahan. Silakan coba lagi.";

export function AdminBlogCategories() {
  return <BlogAuth>{(session, onExpired) => <CategoryManager session={session} onExpired={onExpired} />}</BlogAuth>;
}

function CategoryManager({ session, onExpired }: { session: BlogSession; onExpired: () => void }) {
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [input, setInput] = useState<BlogCategoryInput>(emptyInput);
  const [autoSlug, setAutoSlug] = useState(true);
  const [slugCheck, setSlugCheck] = useState<{ key: string; used: string[]; error: string | null }>({ key: "", used: [], error: null });
  const baseSlug = autoSlug ? slugify(input.name) : slugify(input.slug);
  const slugKey = JSON.stringify([baseSlug, editing, session.token]);
  const slug = uniqueSlug(baseSlug, slugCheck.key === slugKey ? slugCheck.used : []);
  const checkingSlug = !!baseSlug && slugCheck.key !== slugKey;
  const slugError = slugCheck.key === slugKey ? slugCheck.error : null;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const { categories, paging, isLoading, error: loadError, unauthorized, reload } = useBlogCategories(session.token, page, search);
  const canWrite = session.user.roles.some((role) => role === "ADMIN" || role === "EDITOR");

  useEffect(() => {
    if (!baseSlug) return;
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      fetchBlogCategorySlugs(session.token, baseSlug, editing ?? undefined, controller.signal)
        .then((used) => { if (!controller.signal.aborted) setSlugCheck({ key: slugKey, used, error: null }); })
        .catch((error) => {
          if (!controller.signal.aborted) setSlugCheck({ key: slugKey, used: [], error: messageOf(error) });
        });
    }, 300);
    return () => { clearTimeout(timeout); controller.abort(); };
  }, [baseSlug, editing, session.token, slugKey]);

  function resetForm() { setEditing(null); setInput(emptyInput); setAutoSlug(true); setError(null); }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !canWrite) return;
    const payload = { name: input.name.trim(), slug, description: input.description };
    if (!payload.name || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(payload.slug)) {
      setError("Nama wajib diisi. Slug hanya boleh huruf kecil, angka, dan tanda hubung di antara kata.");
      return;
    }
    setBusy(true); setError(null); setNotice(null);
    try {
      const used = await fetchBlogCategorySlugs(session.token, baseSlug, editing ?? undefined);
      payload.slug = uniqueSlug(baseSlug, used);
      await saveBlogCategory(session.token, payload, editing ?? undefined);
      setNotice(editing ? "Kategori berhasil diperbarui." : "Kategori berhasil ditambahkan.");
      resetForm(); setPage(0); setSearch(""); setQuery(""); reload();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) onExpired();
      else setError(messageOf(error));
    } finally { setBusy(false); }
  }

  function edit(category: BlogCategory) {
    setEditing(category.id);
    setAutoSlug(false);
    setInput({ name: category.name, slug: category.slug, description: category.description ?? "" });
    setError(null); setNotice(null);
    document.getElementById("blog-category-name")?.focus();
  }

  async function remove(category: BlogCategory) {
    if (busy || !canWrite || !window.confirm(`Hapus kategori “${category.name}”?`)) return;
    setBusy(true); setError(null); setNotice(null);
    try {
      await deleteBlogCategory(session.token, category.id);
      if (editing === category.id) resetForm();
      setNotice("Kategori berhasil dihapus.");
      if (categories.length === 1 && page > 0) setPage(page - 1);
      reload();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) onExpired();
      else setError(messageOf(error));
    } finally { setBusy(false); }
  }

  return (
    <div>
      {notice && (
        <div className="mb-4 flex items-start gap-3 rounded border border-green-300 border-l-4 border-l-green-600 bg-green-50 p-3 text-sm text-green-800">
          <CircleCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-green-600" />
          <p role="status" className="min-w-0 flex-1 py-0.5">{notice}</p>
          <button type="button" onClick={() => setNotice(null)} aria-label="Tutup notifikasi berhasil" title="Tutup notifikasi" className="-m-1 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded text-green-700 hover:bg-green-100 hover:text-green-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
      )}
      {error && <p role="alert" className="mb-4 border-l-4 border-red-600 bg-white p-3 text-sm text-red-700">{error}</p>}
      <div className={`grid items-start gap-6 ${canWrite ? "xl:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]" : ""}`}>
        {canWrite && <form onSubmit={handleSave} className="space-y-4 border border-[#c3c4c7] bg-white p-5">
          <h2 className="font-semibold">{editing ? "Edit kategori" : "Tambah kategori"}</h2>
          <fieldset disabled={busy || unauthorized} className="space-y-4">
            <div className="space-y-1"><label htmlFor="blog-category-name" className="text-sm">Nama</label><input id="blog-category-name" value={input.name} onChange={(event) => { setInput({ ...input, name: event.target.value }); setAutoSlug(true); }} maxLength={100} required className={control} /></div>
            <div className="space-y-1"><label htmlFor="blog-category-slug" className="text-sm">Slug</label><input id="blog-category-slug" value={slug} readOnly aria-busy={checkingSlug} pattern="[a-z0-9]+(-[a-z0-9]+)*" title="Huruf kecil, angka, dan tanda hubung di antara kata" maxLength={150} required aria-describedby="blog-category-slug-hint" className={control} /><p id="blog-category-slug-hint" className="text-xs text-[#646970]">{checkingSlug ? "Memeriksa ketersediaan slug..." : "Otomatis dari nama. Slug duplikat mendapat akhiran -2, -3, dan seterusnya."}</p>{slugError && <p role="alert" className="text-xs text-red-700">{slugError}</p>}</div>
            <div className="space-y-1"><label htmlFor="blog-category-description" className="text-sm">Deskripsi (opsional)</label><textarea id="blog-category-description" value={input.description} onChange={(event) => setInput({ ...input, description: event.target.value })} maxLength={10000} rows={4} className={`${control} py-2`} /></div>
            <div className="flex flex-wrap gap-2"><button type="submit" className={primary}>{busy ? "Menyimpan..." : editing ? "Simpan perubahan" : "Tambah kategori"}</button>{editing && <button type="button" onClick={resetForm} className={button}>Batal</button>}</div>
          </fieldset>
        </form>}
        <section aria-label="Daftar kategori blog" className="min-w-0">
          {!canWrite && <p className="mb-4 text-sm text-[#646970]">Akun ini dapat melihat kategori. Tambah, edit, dan hapus memerlukan peran ADMIN atau EDITOR.</p>}
          <form role="search" aria-label="Cari kategori blog" onSubmit={(event) => { event.preventDefault(); setPage(0); setSearch(query.trim()); }} className="mb-4 flex flex-wrap gap-2">
            <label htmlFor="blog-category-search" className="sr-only">Cari nama atau slug kategori</label>
            <input id="blog-category-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} maxLength={150} placeholder="Cari nama atau slug kategori..." className={`${control} min-w-0 flex-1 basis-48`} />
            <button disabled={busy || isLoading} className={button} type="submit">Cari kategori</button>
            {search && <button type="button" disabled={busy} className={button} onClick={() => { setPage(0); setSearch(""); setQuery(""); }}>Reset</button>}
          </form>
          {isLoading ? <p role="status" className="border border-[#c3c4c7] bg-white p-6 text-sm">Memuat kategori...</p> : loadError ? (
            <div role="alert" className="space-y-3 border border-red-300 bg-white p-4 text-sm"><p>{loadError}</p><button type="button" onClick={unauthorized ? onExpired : reload} className={button}>{unauthorized ? "Masuk kembali" : "Coba lagi"}</button></div>
          ) : <>
            <div className="overflow-x-auto border border-[#c3c4c7] bg-white">
              <table className="w-full min-w-[480px] text-left text-sm">
                <caption className="sr-only">Kategori blog dari API</caption>
                <thead className="border-b border-[#c3c4c7]"><tr>{["Nama", "Slug", "Deskripsi", ...(canWrite ? ["Aksi"] : [])].map((label) => <th key={label} scope="col" className="px-4 py-3 font-medium">{label}</th>)}</tr></thead>
                <tbody>{categories.map((category) => <tr key={category.id} className="border-b border-[#dcdcde] align-top last:border-0 odd:bg-[#f6f7f7]">
                  <td className="max-w-48 break-words px-4 py-3 font-semibold text-[#2271b1]">{category.name}</td>
                  <td className="max-w-48 break-words px-4 py-3">{category.slug}</td>
                  <td className="max-w-sm whitespace-pre-wrap break-words px-4 py-3 text-[#646970]">{category.description || "—"}</td>
                  {canWrite && <td className="px-4 py-3"><div className="flex gap-3"><button type="button" disabled={busy} onClick={() => edit(category)} aria-label={`Edit kategori ${category.name}`} className="cursor-pointer text-[#2271b1] hover:underline disabled:opacity-50">Edit</button><button type="button" disabled={busy} onClick={() => remove(category)} aria-label={`Hapus kategori ${category.name}`} className="cursor-pointer text-red-700 hover:underline disabled:opacity-50">Hapus</button></div></td>}
                </tr>)}{categories.length === 0 && <tr><td colSpan={canWrite ? 4 : 3} className="p-8 text-center text-[#646970]">{search ? "Tidak ada kategori yang cocok dengan pencarian." : "Belum ada kategori blog."}</td></tr>}</tbody>
              </table>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
              <p role="status">{paging?.totalItem ?? categories.length} kategori · Halaman {page + 1} dari {Math.max(1, paging?.totalPage ?? 1)}</p>
              <div className="flex gap-2"><button type="button" disabled={busy || page === 0} onClick={() => setPage(page - 1)} className={button}>Sebelumnya</button><button type="button" disabled={busy || page + 1 >= (paging?.totalPage ?? 1)} onClick={() => setPage(page + 1)} className={button}>Berikutnya</button></div>
            </div>
          </>}
        </section>
      </div>
    </div>
  );
}
