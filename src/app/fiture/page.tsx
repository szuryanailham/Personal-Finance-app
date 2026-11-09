import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import heroFiture from "@/components/images/illustrations/hero-fiture.svg";
import { cookies } from "next/headers";
import { HomeNavbar } from "@/components/home/home-navbar";
import { MainFeaturesSection } from "@/components/features/main-features-section";
import { HomeFooter } from "@/components/home/home-footer";
import { AUTH_EXPIRED_AT_COOKIE, AUTH_TOKEN_COOKIE, isSessionValid } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Fitur Aplikasi Pencatat Keuangan | Artoku",
  description: "Jelajahi fitur Artoku untuk mencatat pemasukan dan pengeluaran, memantau saldo, melihat statistik keuangan, serta impor dan ekspor transaksi Excel.",
};

export default async function FiturPage() {
  const cookieStore = await cookies();
  const isLoggedIn = isSessionValid(
    cookieStore.get(AUTH_TOKEN_COOKIE)?.value,
    cookieStore.get(AUTH_EXPIRED_AT_COOKIE)?.value,
  );

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <HomeNavbar isLoggedIn={isLoggedIn} />
      <main className="flex-1">
        <section aria-labelledby="features-title" className="bg-[#F7FBF8] px-5 py-16 font-inter sm:px-8 sm:py-20 lg:px-10 lg:py-28">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex min-w-0 flex-col items-center text-center lg:items-start lg:text-left">
              <span className="rounded-full bg-[#DCF8E6] px-5 py-2 text-xs font-semibold tracking-[0.2em] text-[#14864A] uppercase sm:text-sm">
                FITURE ARTOKU
              </span>
              <h1 id="features-title" className="mt-6 text-3xl leading-tight font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl lg:leading-[1.15]">
                Fitur Aplikasi Pencatat Keuangan <span className="text-[#14864A]">Artoku</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">
                Catat pemasukan, pengeluaran, dan pantau aktivitas keuangan dengan mudah bersama Artoku agar keuanganmu lebih teratur.
              </p>
              <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:gap-4 lg:flex-wrap">
                <Link href="/sign-up" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#14864A] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#10733e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14864A]">
                  Coba Artoku Sekarang
                </Link>
                <Link href="#features" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#14864A] px-7 py-3 text-sm font-semibold text-[#14864A] transition-colors hover:bg-[#DCF8E6] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14864A]">
                  Jelajahi Fitur
                </Link>
              </div>
            </div>
            <div className="mx-auto w-full max-w-xl">
              <Image
                src={heroFiture}
                alt="Ilustrasi fitur pencatatan keuangan Artoku"
                width={575}
                height={372}
                preload
                sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 576px, (max-width: 1359px) calc((100vw - 144px) / 2), 608px"
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
        </section>
        <MainFeaturesSection />
      </main>
      <HomeFooter />
    </div>
  );
}
