"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { BlogAuth } from "./blog-auth";
import { BlogRichEditor, type BlogEditorContent } from "./blog-rich-editor";
import { API_BASE_URL, ApiError, apiRequest } from "@/lib/api/client";
import { fetchBlogCategories } from "@/lib/api/admin/blog-categories";
import { fetchBlogTags } from "@/lib/api/admin/blog-tags";
import { slugify } from "@/lib/blog-slug";
import { fetchBlogPost, updateBlogPost, type BlogPostDetail } from "@/lib/api/admin/blog-posts";
import type { BlogSession } from "@/types/admin/blog-category";

const control = "w-full rounded border border-[#8c8f94] bg-white px-3 py-2 text-sm disabled:opacity-60";
type Term = { id: string; name: string };
export function AdminBlogCreate({ editSlug }: { editSlug?: string }) {
  return <BlogAuth>{(session, onExpired) => editSlug ? <EditLoader key={editSlug} slug={editSlug} session={session} onExpired={onExpired} /> : <CreateForm session={session} onExpired={onExpired} />}</BlogAuth>;
}
function EditLoader({ slug, session, onExpired }: { slug: string; session: BlogSession; onExpired: () => void }) {
  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    fetchBlogPost(session.token, slug, controller.signal).then(data => {
      if (!controller.signal.aborted) setPost(data);
    }).catch((err: unknown) => {
      if (controller.signal.aborted) return;
      if (err instanceof ApiError && err.status === 401) onExpired();
      else setError(err instanceof Error ? err.message : "Gagal memuat blog.");
    });
    return () => controller.abort();
  }, [session.token, slug, retry, onExpired]);
  if (post) return <CreateForm session={session} onExpired={onExpired} initialPost={post} editSlug={slug} />;
  return <div><Link href="/admin/blogs" className="text-[#2271b1] underline">Kembali ke Blogs</Link>{error ? <div role="alert" className="my-4"><p>{error}</p><button type="button" onClick={() => { setError(""); setRetry(value => value + 1); }}>Coba lagi</button></div> : <p role="status" className="my-4">Memuat artikel…</p>}</div>;
}
const EXCERPT_MAX_LENGTH = 160;

function CreateForm({ session, onExpired, initialPost, editSlug }: { session: BlogSession; onExpired: () => void; initialPost?: BlogPostDetail; editSlug?: string }) {
  const [content, setContent] = useState<BlogEditorContent>({ html: "", text: "" });
  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? "");
  const excerptTooLong = excerpt.length > EXCERPT_MAX_LENGTH;
  const [status, setStatus] = useState(initialPost?.status ?? "DRAFT");
  const [categories, setCategories] = useState<Term[]>([]);
  const [tags, setTags] = useState<Term[]>([]);
  const [categoryIds, setCategoryIds] = useState<string[]>(initialPost?.categoryIds ?? []);
  const [tagIds, setTagIds] = useState<string[]>(initialPost?.tagIds ?? []);
  const [media, setMedia] = useState<{ id: string; url: string } | null>(null);
  const [mediaChanged, setMediaChanged] = useState(false);
  const [preview, setPreview] = useState<{ url: string; name: string } | null>(null);
  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview.url); };
  }, [preview]);
  const [uploading, setUploading] = useState(false);
  const [editorBusy, setEditorBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [reload, setReload] = useState(0);
  const slug = initialPost?.slug ?? slugify(title);
  const canPublish = session.user.roles.some(role => ["ADMIN", "EDITOR"].includes(role));

  useEffect(() => {
    const abort = new AbortController();
    async function load() {
      setLoading(true);
      try {
        const allCategories: Term[] = [], allTags: Term[] = [];
        for (let page = 0; ; page++) {
          const result = await fetchBlogCategories(session.token, page, "", abort.signal);
          allCategories.push(...result.categories);
          if (page + 1 >= result.paging.totalPage) break;
        }
        for (let page = 0; ; page++) {
          const result = await fetchBlogTags(session.token, page, "", abort.signal);
          allTags.push(...result.tags);
          if (page + 1 >= result.paging.totalPage) break;
        }
        setCategories(allCategories); setTags(allTags);
      } catch (err) {
        if (!abort.signal.aborted) setError(err instanceof Error ? err.message : "Gagal memuat kategori dan tag.");
      } finally { if (!abort.signal.aborted) setLoading(false); }
    }
    void load();
    return () => abort.abort();
  }, [session.token, reload]);

  async function upload(file: File) {
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setError("Pilih gambar JPG, PNG, WebP, atau GIF maksimal 5 MB."); return;
    }
    setMediaChanged(true);
    setPreview({ url: URL.createObjectURL(file), name: file.name });
    setMedia(null);
    setUploading(true); setError("");
    try {
      const body = new FormData(); body.append("file", file); body.append("type", "HERO");
      const response = await fetch(`${API_BASE_URL}/api/blog/media`, { method: "POST", headers: { Authorization: `Bearer ${session.token}` }, body });
      const json = await response.json();
      if (response.status === 401) { onExpired(); return; }
      if (!response.ok || !json.data?.id || !json.data?.url) throw new Error(json.errors || "Gagal upload gambar ke ImageKit.");
      setMedia(json.data);
    } catch (err) { setError(err instanceof Error ? err.message : "Gagal upload gambar."); }
    finally { setUploading(false); }
  }

  async function uploadArticleImage(file: File): Promise<string> {
    const body = new FormData(); body.append("file", file); body.append("type", "CONTENT");
    const response = await fetch(`${API_BASE_URL}/api/blog/media`, { method: "POST", headers: { Authorization: `Bearer ${session.token}` }, body });
    const json = await response.json().catch(() => null);
    if (response.status === 401) { onExpired(); throw new Error("Sesi berakhir. Silakan login kembali."); }
    if (!response.ok || typeof json?.data?.url !== "string" || !json.data.url.startsWith("https://")) {
      throw new Error(json?.errors || "Gagal upload gambar ke ImageKit.");
    }
    return json.data.url;
  }

  async function submit(event: FormEvent) {
    event.preventDefault(); setError("");
    if (excerptTooLong) { setError(`Ringkasan maksimal ${EXCERPT_MAX_LENGTH} karakter.`); return; }
    if (editorBusy) { setError("Tunggu proses di editor selesai sebelum menyimpan."); return; }
    if (uploading || (preview && !media)) { setError("Tunggu upload gambar selesai, atau hapus gambar yang gagal diunggah sebelum menyimpan."); return; }
    const contentHtml = content.html;
    if (!slug || !content.text.trim() || !categoryIds.length) { setError("Isi judul, konten artikel, dan pilih minimal satu kategori."); return; }
    if (contentHtml.length > 1000000) { setError("Konten terlalu panjang (maksimal 1.000.000 karakter HTML)."); return; }
    setSaving(true);
    try {
      const post = { title: title.trim(), slug, excerpt: excerpt.trim(), contentHtml, status, categoryIds, tagIds };
      if (editSlug) {
        await updateBlogPost(session.token, editSlug, {
          ...post,
          ...(mediaChanged ? { featuredMediaId: media?.id ?? null } : {}),
        });
      } else {
        await apiRequest<{ id: string }>("/api/blog/posts", "membuat blog", {
          method: "POST", accessToken: session.token,
          body: { ...post, featuredMediaId: media?.id ?? null },
        });
      }
      setSaved(true);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) onExpired();
      else setError(err instanceof Error ? err.message : "Gagal menyimpan blog.");
    } finally { setSaving(false); }
  }
  function toggle(id: string, values: string[], update: (ids: string[]) => void) {
    update(values.includes(id) ? values.filter(value => value !== id) : [...values, id]);
  }
  if (saved) return <main><h1 className="text-2xl">Blog berhasil disimpan</h1><p role="status" className="my-4">Artikel {status === "PUBLISHED" ? "berhasil diterbitkan" : "tersimpan sebagai draf"}.</p><p className="mb-4 text-sm">Artikel sudah tersimpan dan dapat dilihat di daftar blog.</p><Link href="/admin/blogs" className="text-[#2271b1] underline">Kembali ke daftar blog</Link></main>;
  return <main>
    <Link href="/admin/blogs" className="text-sm text-[#2271b1] hover:underline">← Kembali ke Blogs</Link>
    <h1 className="my-4 text-2xl font-normal">{editSlug ? "Edit Blog" : "Tambah Blog"}</h1>
    {error && <div role="alert" className="mb-4 border-l-4 border-red-600 bg-white p-4 text-sm text-red-700">{error}</div>}
    <form onSubmit={submit}>
      <fieldset disabled={saving} className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-5">
          <div><label htmlFor="blog-title" className="mb-2 block font-medium">Judul *</label><input id="blog-title" required maxLength={250} value={title} onChange={e => setTitle(e.target.value)} placeholder="Masukkan judul artikel" className={`${control} text-lg`} /></div>
          <div><label htmlFor="blog-slug" className="mb-2 block text-sm font-medium">Slug otomatis</label><input id="blog-slug" readOnly value={slug} className={`${control} bg-gray-100`} /><p className="mt-1 break-all text-xs text-[#646970]">/blog/{slug || "judul-artikel"}</p></div>
          <div>
            <label htmlFor="blog-excerpt" className="mb-2 block text-sm font-medium">Ringkasan</label>
            <textarea
              id="blog-excerpt"
              value={excerpt}
              onChange={event => setExcerpt(event.target.value)}
              maxLength={EXCERPT_MAX_LENGTH}
              aria-describedby="blog-excerpt-count"
              aria-invalid={excerptTooLong}
              rows={3}
              className={control}
              placeholder="Ringkasan singkat artikel…"
            />
            <p id="blog-excerpt-count" className={`mt-1 text-right text-xs tabular-nums ${excerptTooLong ? "text-red-700" : "text-[#646970]"}`}>
              {excerptTooLong && "Ringkasan perlu dipersingkat. "}
              {excerpt.length}/{EXCERPT_MAX_LENGTH} karakter
            </p>
          </div>
          <div><span id="content-label" className="mb-2 block text-sm font-medium">Konten artikel *</span>
            <BlogRichEditor initialHtml={initialPost?.contentHtml} disabled={saving} onChange={setContent} onImageUpload={uploadArticleImage} onBusyChange={setEditorBusy} />
          </div>
        </div>
        <aside className="space-y-5">
          <section className="space-y-3 border border-[#c3c4c7] bg-white p-4"><h2 className="font-medium">Publikasi</h2><label htmlFor="blog-status" className="block text-sm">Status</label><select id="blog-status" value={status} onChange={e => setStatus(e.target.value as BlogPostDetail["status"])} className={control}><option value="DRAFT">Draf</option>{initialPost?.status === "ARCHIVED" && <option value="ARCHIVED">Arsip</option>}{canPublish && <option value="PUBLISHED">Terbit</option>}</select><p className="text-xs text-[#646970]">Penulis: {session.user.displayName}</p><button disabled={saving || uploading || editorBusy || loading || !categories.length || Boolean(preview && !media)} className="w-full rounded bg-[#2271b1] px-4 py-2 text-sm text-white disabled:opacity-50">{saving ? "Menyimpan…" : editSlug ? "Simpan perubahan" : status === "PUBLISHED" ? "Terbitkan blog" : "Simpan draf"}</button></section>
          <section className="space-y-3 border border-[#c3c4c7] bg-white p-4">
            <h2 className="font-medium">Gambar utama</h2>
            {!preview && !mediaChanged && initialPost?.heroImage && <figure className="space-y-2">
              <Image src={initialPost.heroImage} alt={`Gambar utama: ${title}`} width={600} height={400} unoptimized className="h-48 w-full rounded border border-[#dcdcde] object-contain" />
              <figcaption className="text-xs text-[#646970]">Gambar utama saat ini</figcaption>
              <button type="button" onClick={() => setMediaChanged(true)} className="text-sm text-red-700">Hapus gambar</button>
            </figure>}
            {preview && <figure className="space-y-2">
              <div className="relative overflow-hidden rounded border border-[#dcdcde] bg-[#f6f7f7]" aria-busy={uploading}>
                <Image src={preview.url} alt={`Pratinjau gambar utama: ${preview.name}`} width={600} height={400} unoptimized className="h-48 w-full object-contain" />
                {uploading && <div className="absolute inset-x-0 bottom-0 bg-black/70 px-3 py-2 text-center text-xs text-white">Mengunggah ke ImageKit…</div>}
              </div>
              <figcaption className="break-all text-xs text-[#646970]">{preview.name}</figcaption>
              <p role="status" className={`text-xs ${media ? "text-green-700" : "text-[#646970]"}`}>{uploading ? "Gambar sedang diunggah." : media ? "Gambar berhasil diunggah." : "Upload gagal. Pilih ulang gambar untuk mencoba lagi atau hapus gambar."}</p>
              <button type="button" disabled={uploading} onClick={() => { setMedia(null); setPreview(null); setMediaChanged(true); }} className="text-sm text-red-700 disabled:opacity-50">Hapus gambar</button>
            </figure>}
            <label className="block text-sm" htmlFor="blog-image">{preview || (!mediaChanged && initialPost?.heroImage) ? "Ganti gambar" : "Upload gambar ke ImageKit"}</label>
            <input id="blog-image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" disabled={uploading} onChange={e => { const file = e.target.files?.[0]; if (file) void upload(file); e.target.value = ""; }} className="w-full text-xs" />
            <p className="text-xs text-[#646970]">JPG, PNG, WebP, GIF. Maksimal 5 MB. Opsional.</p>
          </section>
          {[["Kategori *", categories, categoryIds, setCategoryIds], ["Tag", tags, tagIds, setTagIds]].map(([label, terms, values, update]) => <section key={label as string} className="space-y-3 border border-[#c3c4c7] bg-white p-4"><h2 className="font-medium">{label as string}</h2>{loading ? <p className="text-sm">Memuat…</p> : <div className="max-h-52 space-y-2 overflow-auto">{(terms as Term[]).map(term => <label key={term.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={(values as string[]).includes(term.id)} onChange={() => toggle(term.id, values as string[], update as (ids: string[]) => void)} />{term.name}</label>)}{!(terms as Term[]).length && <p className="text-sm text-[#646970]">Belum ada data. <Link className="text-[#2271b1] underline" href={label === "Tag" ? "/admin/blogs/tags" : "/admin/blogs/categories"}>Kelola {label === "Tag" ? "tag" : "kategori"}</Link></p>}</div>}<button type="button" onClick={() => { setError(""); setReload(value => value + 1); }} className="text-xs text-[#2271b1]">Muat ulang</button></section>)}
        </aside>
      </fieldset>
    </form>
  </main>;
}
