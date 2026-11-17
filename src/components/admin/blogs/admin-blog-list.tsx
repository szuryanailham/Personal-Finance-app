"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { deleteBlogPost, fetchBlogPosts, BLOG_POST_PAGE_SIZE } from "@/lib/api/admin/blog-posts";
import { ApiError } from "@/lib/api/client";
import { BlogAuth } from "./blog-auth";

const control = "min-h-8 rounded-[3px] border border-[#8c8f94] bg-white px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2271b1]";
const dateFormatter = new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Jakarta" });

export function AdminBlogList() {
  return <BlogAuth>{(session, onExpired) => <BlogList token={session.token} onExpired={onExpired} />}</BlogAuth>;
}

function BlogList({ token, onExpired }: { token: string; onExpired: () => void }) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");
  async function remove(slug: string, title: string) {
    if (deleting || !window.confirm(`Hapus artikel "${title}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    setDeleting(slug); setActionError(""); setNotice("");
    try {
      await deleteBlogPost(token, slug);
      setNotice("Blog berhasil dihapus.");
      if (posts.length === 1 && skip > 0) setSkip(Math.max(0, skip - BLOG_POST_PAGE_SIZE));
      else setVersion(value => value + 1);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) onExpired();
      else setActionError(error instanceof Error ? error.message : "Gagal menghapus blog.");
    } finally { setDeleting(null); }
  }
  const [skip, setSkip] = useState(0);
  const [version, setVersion] = useState(0);
  const key = JSON.stringify([token, skip, version]);
  const [state, setState] = useState<{
    key: string; result: Awaited<ReturnType<typeof fetchBlogPosts>> | null;
    error: string | null; unauthorized: boolean;
  }>({ key: "", result: null, error: null, unauthorized: false });
  useEffect(() => {
    const controller = new AbortController();
    fetchBlogPosts(token, skip, controller.signal).then((result) => {
      if (!controller.signal.aborted) setState({ key, result, error: null, unauthorized: false });
    }).catch((error: unknown) => {
      if (!controller.signal.aborted) setState({ key, result: null,
        error: error instanceof Error ? error.message : "Gagal memuat blog.",
        unauthorized: error instanceof ApiError && error.status === 401 });
    });
    return () => controller.abort();
  }, [token, skip, key]);
  const loading = state.key !== key;
  const posts = loading ? [] : state.result?.posts ?? [];
  const [status, setStatus] = useState("ALL");
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [ascending, setAscending] = useState(false);
  const filtered = posts.filter((post) =>
    (status === "ALL" || post.status === status) &&
    `${post.title} ${post.author}`.toLocaleLowerCase("id-ID").includes(search.toLocaleLowerCase("id-ID")),
  ).sort((a, b) => ascending ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));

  return (
    <div className="mt-6">
      {actionError && <p role="alert" className="mb-4 bg-white p-4 text-sm text-red-700">{actionError}</p>}
      {notice && <p role="status" className="mb-4 bg-white p-4 text-sm text-green-700">{notice}</p>}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <nav aria-label="Status blog" className="flex gap-2 text-sm">
          {[
            { value: "ALL", label: "Semua", count: posts.length },
            { value: "PUBLISHED", label: "Terbit", count: posts.filter((p) => p.status === "PUBLISHED").length },
            { value: "DRAFT", label: "Draf", count: posts.filter((p) => p.status === "DRAFT").length },
          ].map((tab, index) => (
            <span key={tab.value} className="flex gap-2">
              {index > 0 && <span aria-hidden="true" className="text-[#c3c4c7]">|</span>}
              <button type="button" onClick={() => setStatus(tab.value)} aria-pressed={status === tab.value}
                className={`cursor-pointer hover:underline focus-visible:outline-2 focus-visible:outline-[#2271b1] ${status === tab.value ? "font-semibold text-[#1d2327]" : "text-[#2271b1]"}`}>
                {tab.label} <span className="font-normal text-[#646970]">({tab.count})</span>
              </button>
            </span>
          ))}
        </nav>
        <form className="flex w-full gap-2 sm:w-auto" role="search" aria-label="Cari blog" onSubmit={(event) => { event.preventDefault(); setSearch(query.trim()); }}>
          <label htmlFor="admin-blog-search" className="sr-only">Cari judul atau penulis</label>
          <input id="admin-blog-search" type="search" placeholder="Cari judul atau penulis…" value={query} onChange={(event) => { setQuery(event.target.value); if (!event.target.value) setSearch(""); }} className={`${control} min-w-0 flex-1 sm:w-60`} />
          <button type="submit" className={`${control} cursor-pointer border-[#2271b1] text-[#2271b1] hover:bg-[#f0f6fc]`}>Cari blog</button>
        </form>
      </div>
      <div className="my-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#646970]">Pencarian dan filter berlaku pada halaman ini.</span>
          {(search || status !== "ALL") && <button type="button" onClick={() => { setQuery(""); setSearch(""); setStatus("ALL"); }} className="cursor-pointer text-sm text-[#2271b1] hover:underline">Reset</button>}
        </div>
        <span role="status" className="text-xs text-[#646970]">{filtered.length} artikel</span>
      </div>
      {loading ? <p role="status" className="bg-white p-6 text-sm">Memuat blog...</p> : state.error ? (
        <div role="alert" className="space-y-3 border border-red-300 bg-white p-4 text-sm">
          <p>{state.error}</p>
          <button type="button" className={control} onClick={state.unauthorized ? onExpired : () => setVersion(value => value + 1)}>{state.unauthorized ? "Masuk kembali" : "Coba lagi"}</button>
        </div>
      ) : <>
      <div className="overflow-x-auto border border-[#c3c4c7] bg-white">
        <table className="w-full min-w-[700px] border-collapse text-left text-sm">
          <caption className="sr-only">Daftar blog beserta gambar hero, penulis, status, dan tanggal</caption>
          <thead className="border-b border-[#c3c4c7]">
            <tr>
              <th scope="col" className="w-32 px-4 py-3 font-normal">Gambar hero</th>
              <th scope="col" className="w-[38%] px-4 py-3 font-normal">Judul</th>
              <th scope="col" className="px-3 py-3 font-normal">Nama Penulis</th>
              <th scope="col" className="px-3 py-3 font-normal">Status</th>
              <th scope="col" aria-sort={ascending ? "ascending" : "descending"} className="px-3 py-3 font-normal">
                <button type="button" onClick={() => setAscending(!ascending)} className="cursor-pointer whitespace-nowrap text-[#2271b1] hover:underline">Tanggal <span aria-hidden="true">{ascending ? "↑" : "↓"}</span></button>
              </th>
              <th scope="col" className="px-3 py-3 font-normal">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((post) => (
              <tr key={post.id} className="align-top odd:bg-[#f6f7f7]">
                <td className="px-4 py-4">
                  {post.heroImage ? <Image
                    unoptimized
                    src={post.heroImage}
                    alt={`Gambar hero ${post.title}`}
                    width={112}
                    height={70}
                    sizes="112px"
                    className="h-[70px] w-28 max-w-none rounded-[3px] border border-[#dcdcde] object-cover"
                  /> : <span className="text-xs text-[#646970]">Tanpa gambar</span>}
                </td>
                <td className="px-4 py-4">
                  {post.status === "PUBLISHED" ? <Link href={`/blog/${post.slug}`} className="font-semibold text-[#2271b1] hover:text-[#135e96] hover:underline">{post.title}</Link> : <span className="font-semibold">{post.title}</span>}
                  <p className="mt-1 text-xs text-[#646970]">/{post.slug}</p>

                </td>
                <td className="px-3 py-4 text-[#50575e]">{post.author}</td>
                <td className="px-3 py-4"><span className={`inline-block whitespace-nowrap rounded-[3px] px-2 py-0.5 text-xs ${post.status === "PUBLISHED" ? "bg-[#edf7ed] text-[#2a612a]" : "bg-[#fcf0d3] text-[#755100]"}`}>{post.status === "PUBLISHED" ? "Terbit" : "Draf"}</span></td>
                <td className="whitespace-nowrap px-3 py-4 text-xs text-[#50575e]">
                  <p className="mb-1">{post.status === "PUBLISHED" ? "Diterbitkan" : "Terakhir diubah"}</p>
                  <time dateTime={post.date}>{Number.isFinite(Date.parse(post.date)) ? dateFormatter.format(new Date(post.date)) : "—"}</time>
                </td>
                <td className="px-3 py-4">
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <Link href={`/admin/blogs/${encodeURIComponent(post.slug)}/edit`} className="text-[#2271b1] hover:underline">Edit</Link>
                    <button type="button" disabled={deleting !== null} onClick={() => void remove(post.slug, post.title)} aria-label={`Hapus ${post.title}`} className="cursor-pointer text-red-700 hover:underline disabled:opacity-50">{deleting === post.slug ? "Menghapus…" : "Hapus"}</button>
                  {post.status === "PUBLISHED" && <Link href={`/blog/${post.slug}`} className="inline-block text-xs text-[#2271b1] hover:underline">Lihat artikel</Link>}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-[#646970]">Tidak ada blog yang sesuai dengan pencarian atau filter.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
        <p role="status">{state.result?.paging.totalItem ?? 0} artikel · Halaman {Math.floor(skip / BLOG_POST_PAGE_SIZE) + 1}</p>
        <div className="flex gap-2">
          <button type="button" disabled={skip === 0} onClick={() => setSkip(Math.max(0, skip - BLOG_POST_PAGE_SIZE))} className={`${control} disabled:opacity-50`}>Sebelumnya</button>
          <button type="button" disabled={!state.result?.paging.hasMore} onClick={() => setSkip(skip + BLOG_POST_PAGE_SIZE)} className={`${control} disabled:opacity-50`}>Berikutnya</button>
        </div>
      </div>
      </>}
    </div>
  );
}
