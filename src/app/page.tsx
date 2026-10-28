import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { AUTH_EXPIRED_AT_COOKIE, AUTH_TOKEN_COOKIE, isSessionValid } from "@/lib/auth";
import heroIllustration from "@/components/images/illustrations/ilustration-hero.svg";
import { HomeNavbar } from "@/components/home/home-navbar";
import { FeatureListSection } from "@/components/home/feature-list-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { LandingCtaSection } from "@/components/home/landing-cta-section";
import { ValuePropositionSection } from "@/components/home/value-proposition-section";

export default async function Home() {
  const cookieStore = await cookies();
  const isLoggedIn = isSessionValid(
    cookieStore.get(AUTH_TOKEN_COOKIE)?.value,
    cookieStore.get(AUTH_EXPIRED_AT_COOKIE)?.value,
  );

  return (
    <>
      <HomeNavbar isLoggedIn={isLoggedIn} />
      <main>
        <section className="bg-white px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-16 xl:gap-24">
            <div className="max-w-2xl">
              <p className="mb-5 font-inter text-xs font-bold tracking-[0.34em] text-[#14864A] sm:text-sm">
                PERSONAL FINANCE ASSISTANT
              </p>
              <h1 className="font-inter text-4xl leading-[1.12] font-semibold tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-6xl xl:text-[4.25rem]">
                Pahami <span className="text-[#14864A]">keuanganmu</span>, kendalikan masa depanmu.
              </h1>
              <p className="mt-6 max-w-xl font-inter text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                Kelola keuangan dengan lebih mudah. Pahami pengeluaranmu dan buat keputusan finansial dengan lebih percaya diri.
              </p>
              <div className="mt-8 flex flex-col gap-3 font-inter sm:flex-row sm:flex-wrap">
                <Link href="/sign-up" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#14864A] px-7 text-sm font-semibold text-white transition-colors hover:bg-[#10733e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14864A]">
                  Mulai Kelola
                </Link>
                <Link href="#features" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#14864A]/30 bg-white px-7 text-sm font-semibold text-[#14864A] transition-colors hover:bg-[#DCF8E6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14864A]">
                  Jelajahi Fitur
                </Link>
              </div>
            </div>
            <div className="mx-auto w-full max-w-[30rem] lg:max-w-none">
              <Image
                src={heroIllustration}
                alt=""
                priority
                sizes="(max-width: 1023px) 100vw, 45vw"
                className="h-auto w-full"
              />
            </div>
          </div>
        </section>
        <ValuePropositionSection />
        <FeatureListSection />
        <HowItWorksSection />
        <LandingCtaSection />
      </main>
    </>
  );
}
