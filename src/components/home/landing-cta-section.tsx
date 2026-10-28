import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function LandingCtaSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#14864A] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
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
          Love our application? Try now
        </h2>
        <p className="mt-5 max-w-2xl font-inter text-base leading-7 text-[#DCF8E6] sm:text-lg sm:leading-8">
          Mulai kelola keuanganmu dengan lebih mudah dan temukan cara yang lebih baik untuk memahami setiap keputusan finansialmu.
        </p>
        <Link
          href="#features"
          className="mt-8 inline-flex min-h-12 max-w-full items-center justify-center gap-2 rounded-xl bg-[#DCF8E6] px-6 py-3 font-inter text-sm font-semibold text-[#14864A] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          Jelajahi Fitur
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </section>
  );
}
