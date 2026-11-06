import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function LandingCtaSection() {
  return (
    <section className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
      <div className="relative isolate mx-auto w-full max-w-7xl overflow-hidden rounded-3xl bg-[#14864A] px-8 py-20 shadow-xl shadow-[#14864A]/15 sm:rounded-[2rem] sm:px-16 sm:py-24 lg:px-24 lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -left-24 size-72 rounded-full bg-[#21B761]/35 sm:size-96"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 -bottom-48 size-[26rem] rounded-full border-[36px] border-[#DCF8E6]/10 sm:size-[34rem] sm:border-[48px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-[12%] hidden size-24 -translate-y-1/2 rounded-full border border-white/15 lg:block"
        />

        <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center text-center">
          <h2 className="font-inter text-3xl leading-tight font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
            Mulai Kenali Keuanganmu Hari Ini
          </h2>
          <div className="mt-5 w-full max-w-2xl space-y-3 font-inter text-sm leading-6 text-pretty text-[#DCF8E6] sm:space-y-0 sm:text-lg sm:leading-8">
            <p>
              Setiap catatan kecil adalah langkah menuju pemahaman keuangan yang lebih baik.
            </p>
            <p>
              Tidak perlu menunggu sampai keuangan terasa berantakan. Mulai catat pemasukan dan pengeluaranmu bersama MyArtoku.
            </p>
          </div>
          <Link
            href="/sign-up"
            className="mt-8 inline-flex min-h-12 max-w-full items-center justify-center gap-2 rounded-xl border border-white bg-transparent px-6 py-3 font-inter text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Mulai Catat Keuangan
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
