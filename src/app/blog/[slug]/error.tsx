"use client";

import Link from "next/link";

export default function BlogDetailError({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto max-w-3xl px-5 py-20 text-center">
      <h1 className="text-2xl font-semibold">Artikel belum dapat dimuat</h1>
      <p className="mt-3 text-slate-600">Silakan coba lagi beberapa saat lagi.</p>
      <div className="mt-6 flex justify-center gap-5 text-[#14864A]">
        <button onClick={reset} className="underline">Coba lagi</button>
        <Link href="/blog" className="underline">Kembali ke blog</Link>
      </div>
    </main>
  );
}
