import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { AUTH_EXPIRED_AT_COOKIE, AUTH_TOKEN_COOKIE, isSessionValid } from "@/lib/auth";
import heroIllustration from "@/components/images/illustrations/demo-application.png";
import { HomeFooter } from "@/components/home/home-footer";
import { HomeNavbar } from "@/components/home/home-navbar";
import { FaqSection } from "@/components/home/faq-section";
import { GetStartedSection } from "@/components/home/get-started-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { LandingCtaSection } from "@/components/home/landing-cta-section";
import { ValuePropositionSection } from "@/components/home/value-proposition-section";
import { SecuritySection } from "@/components/home/security-section";

export const metadata: Metadata = {
  title: "Artoku – Aplikasi Pencatat Keuangan Pribadi",
  description: "Kelola keuangan lebih mudah dengan Artoku, aplikasi pencatat keuangan untuk mencatat pemasukan, pengeluaran, dan tabungan serta memahami kondisi keuangan pribadimu.",
};

export default async function Home() {
  const cookieStore = await cookies();
  const isLoggedIn = isSessionValid(
    cookieStore.get(AUTH_TOKEN_COOKIE)?.value,
    cookieStore.get(AUTH_EXPIRED_AT_COOKIE)?.value,
  );

  return (
    <div className="min-h-screen bg-white">
      <HomeNavbar isLoggedIn={isLoggedIn} />
      <main>
        <section className="bg-white px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-8 xl:gap-12">
            <div className="max-w-2xl">
              <p className="mb-5 font-inter text-xs font-bold tracking-[0.34em] text-[#14864A] sm:text-sm">
                PERSONAL FINANCE ASSISTANT
              </p>
              <h1 className="font-inter text-4xl leading-[1.12] font-semibold tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-6xl xl:text-[4.25rem]">
                Pahami <span className="text-[#14864A]">keuanganmu</span>, kendalikan masa depanmu.
              </h1>
              <p className="mt-6 max-w-xl font-inter text-base leading-8 text-pretty text-slate-600 sm:text-lg sm:leading-9">
                MyArtoku adalah aplikasi pencatat keuangan pribadi yang membantu kamu mencatat pemasukan dan pengeluaran dengan mudah.
                Setiap keputusan keuangan dimulai dari pemahaman yang lebih baik.
              </p>
              <div className="mt-10 flex flex-col gap-3 font-inter sm:mt-12 sm:flex-row sm:flex-wrap">
                <Link href="/sign-up" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#14864A] px-7 text-sm font-semibold text-white transition-colors hover:bg-[#10733e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14864A]">
                  Mulai Catat Keuangan
                </Link>
                <Link href="#features" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#14864A]/30 bg-white px-7 text-sm font-semibold text-[#14864A] transition-colors hover:bg-[#DCF8E6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14864A]">
                  Kenali Myartoku
                </Link>
              </div>
            </div>
            <div className="mx-auto w-full max-w-[40rem] lg:max-w-none">
              <Image
                src={heroIllustration}
                alt=""
                priority
                sizes="(max-width: 1023px) 100vw, 55vw"
                className="hero-illustration-bounce h-auto w-full"
              />
            </div>
          </div>
        </section>
        <ValuePropositionSection />
        <SecuritySection />
        <HowItWorksSection />
        <GetStartedSection />
        <LandingCtaSection />
        <FaqSection />
      </main>
      <HomeFooter />
    </div>
  );
}
