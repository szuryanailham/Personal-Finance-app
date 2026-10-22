import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { cn } from "cn";
import { AUTH_EXPIRED_AT_COOKIE, AUTH_TOKEN_COOKIE, isSessionValid } from "@/lib/auth";
import { FeaturesSection } from "@/components/home/features-section";
import { HomeNavbar } from "@/components/home/home-navbar";
import { InterfaceSliderSection } from "@/components/home/interface-slider-section";
import { OrbitBackground } from "@/components/home/orbit-background";
import { ProductsSection } from "@/components/home/products-section";

const heroButtonClass =
  "inline-flex h-12 w-full items-center justify-center rounded-xl px-8 text-base font-semibold transition-colors sm:w-auto";

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
        <section className="relative -mt-16 flex min-h-screen flex-col items-center justify-center gap-4 overflow-hidden px-4 pt-32 pb-16 text-center md:pt-40">
          <OrbitBackground />
          <h1 className="relative max-w-4xl text-center font-display text-5xl leading-tight font-normal tracking-wide text-slate-900 md:text-7xl">
            Build Your Financial Future with{" "}
            <span className="text-[#6359E9]">Artoku</span>
          </h1>
          <p className="relative max-w-2xl text-center font-manrope text-base leading-relaxed text-slate-600 md:text-lg">
            Pahami ke mana uangmu pergi, kendalikan pengeluaran, dan bangun masa
            depan finansial yang lebih baik bersama Artoku.
          </p>
          <div className="relative mt-6 flex w-full flex-col items-center justify-center gap-4 font-manrope sm:gap-7 sm:w-auto sm:flex-row">
            <Link
              href="/sign-up"
              className={cn(
                heroButtonClass,
                "bg-[#6D33FA] text-white shadow-[0_8px_24px_rgba(109,51,250,0.3)] hover:bg-[#6D33FA]/90",
              )}
            >
              Mulai Kelola
            </Link>
            <Link
              href="#features"
              className={cn(
                heroButtonClass,
                "border-2 border-[#6D33FA] bg-white/60 text-[#6D33FA] backdrop-blur hover:bg-[#6D33FA]/10",
              )}
            >
              Jelajahi Fitur
            </Link>
          </div>
          <Image
            src="/hero.png"
            alt="Pratinjau aplikasi Artoku"
            width={824}
            height={735}
            priority
            className="relative mt-10 h-auto w-full max-w-2xl"
          />
        </section>
        <ProductsSection />
        <InterfaceSliderSection />
        <FeaturesSection />
      </main>
    </>
  );
}
