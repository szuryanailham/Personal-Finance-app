import { createPageMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import localFont from "next/font/local";
import { ArrowDown, Sprout } from "lucide-react";
import { cookies } from "next/headers";
import { AUTH_EXPIRED_AT_COOKIE, AUTH_TOKEN_COOKIE, DEFAULT_AUTHED_PATH, isSessionValid, SIGN_UP_PATH } from "@/lib/auth";
import heroIllustration from "@/components/images/illustrations/hero-image.png";
import { HomeFooter } from "@/components/home/home-footer";
import { HomeNavbar } from "@/components/home/home-navbar";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { ValuePropositionSection } from "@/components/home/value-proposition-section";
import { ShortLessonSection } from "@/components/home/short-lesson-section";

const landingInter = localFont({
  src: "./fonts/inter-latin.woff2",
  weight: "400 700",
  variable: "--font-landing-inter",
  display: "swap",
});

const landingHeading = localFont({
  src: "./fonts/bricolage-grotesque-96pt-800-latin.woff2",
  weight: "800",
  variable: "--font-landing-heading",
  display: "swap",
});

export const metadata: Metadata = createPageMetadata({
  title: "Artoku – Aplikasi Pencatat Keuangan Pribadi",
  description: "Kelola keuangan lebih mudah dengan Artoku, aplikasi pencatat keuangan untuk mencatat pemasukan, pengeluaran, dan tabungan serta memahami kondisi keuangan pribadimu.",
  path: "/",
  image: heroIllustration.src,
});

export default async function Home() {
  const cookieStore = await cookies();
  const isLoggedIn = isSessionValid(
    cookieStore.get(AUTH_TOKEN_COOKIE)?.value,
    cookieStore.get(AUTH_EXPIRED_AT_COOKIE)?.value,
  );

  return (
    <div className={`min-h-screen bg-white ${landingInter.variable} ${landingHeading.variable}`}>
      <HomeNavbar isLoggedIn={isLoggedIn} />
      <main id="main-content" tabIndex={-1}>
        <section aria-labelledby="home-hero-title" className="relative overflow-hidden bg-[#fbf7ef] font-(family-name:--font-landing-inter)">
          <div aria-hidden="true" className="pointer-events-none absolute -top-28 -right-32 size-64 rounded-full bg-[#ddf5e6] lg:-top-16 lg:size-80" />
          <div className="relative mx-auto grid max-w-[70rem] items-center gap-4 px-5 pt-12 pb-6 sm:px-8 sm:pt-16 lg:w-[80%] lg:grid-cols-2 lg:gap-8 lg:px-0 lg:py-[4.5rem]">
            <div className="relative z-10">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-[#c8f169] px-3 py-1 text-sm font-bold text-[#0d4f30]">
                <Sprout aria-hidden="true" className="size-4 shrink-0" />
                Applikasi Pencatatan keuangan
              </p>
              <h1 id="home-hero-title" className={`${landingHeading.className} mt-5 max-w-[9.5em] text-[clamp(2.5rem,11vw,3rem)] leading-[1.08] font-extrabold tracking-[-0.025em] text-[#0d4f30] sm:text-[clamp(2.25rem,4.7vw,4.25rem)] lg:max-w-[8em]`}>
                Gaji masuk.<br />Kamu tahu ke mana perginya?
              </h1>
              <p className="mt-5 max-w-[44ch] text-base leading-relaxed text-[#334b4a] lg:text-lg">
                Aplikasi pencatat keuangan pribadi yang membantu kamu mencatat pemasukan dan pengeluaran dengan mudah. Setiap keputusan keuangan dimulai dari pemahaman yang lebih baik.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <Link href="#features" className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-full bg-[#14864a] px-5 text-sm font-bold text-white hover:bg-[#10733e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14864a] sm:px-7">
                  Mulai Belajar <ArrowDown aria-hidden="true" className="size-4" />
                </Link>
                <Link href={isLoggedIn ? DEFAULT_AUTHED_PATH : SIGN_UP_PATH} className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-[#14864a] bg-white px-5 text-sm font-bold text-[#0d4f30] hover:bg-[#ddf5e6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14864a] sm:px-7">
                  {isLoggedIn ? "Buka Dashboard" : "Coba Artoku"}
                </Link>
              </div>
            </div>
            <div className="mx-auto grid w-full max-w-[36rem] justify-items-center lg:max-w-none">
              <Image
                src={heroIllustration}
                alt="Contoh tampilan Artoku yang menampilkan sisa anggaran dan transaksi terbaru"
                loading="eager"
                fetchPriority="high"
                sizes="(min-width: 1400px) 855px, (min-width: 1024px) 60vw, (min-width: 640px) 576px, 120vw"
                className="h-auto w-[120%] max-w-none drop-shadow-[0_16px_16px_rgba(13,79,48,0.12)] sm:w-full lg:w-[157%]"
              />
            </div>
          </div>
        </section>
        <ValuePropositionSection />
        <ShortLessonSection transactionHref={isLoggedIn ? "/transaction" : SIGN_UP_PATH} />
        <HowItWorksSection transactionHref={isLoggedIn ? "/transaction" : SIGN_UP_PATH} />
      </main>
      <HomeFooter isLoggedIn={isLoggedIn} />
    </div>
  );
}
