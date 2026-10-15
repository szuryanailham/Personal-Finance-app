import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { cn } from "cn";

import mobileAppIllustration from "@/components/images/illustrations/calling-mage.png";
import heroImage from "../../../public/hero.png";

interface FeatureShowcase {
  image: StaticImageData;
  imageAlt: string;
  eyebrow: string;
  title: string;
  description: string;
}

const FEATURE_SHOWCASES: readonly FeatureShowcase[] = [
  {
    image: mobileAppIllustration,
    imageAlt: "Tampilan saldo dan riwayat transaksi Artoku di ponsel",
    eyebrow: "Transaksi",
    title: "Pantau Setiap Transaksi di Mana Saja",
    description:
      "Catat dan telusuri riwayat transaksimu kapan pun, lengkap dengan ringkasan pengeluaran per kategori.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="flex flex-col items-center px-4 py-20 md:py-28">
      <div className="flex w-full max-w-6xl flex-col gap-20 md:gap-28">
        {FEATURE_SHOWCASES.map((feature, index) => (
          <article
            key={feature.title}
            className={cn(
              "flex flex-col items-center gap-10 md:flex-row md:gap-16",
              index % 2 === 1 && "md:flex-row-reverse",
            )}
          >
            <div className="w-full rounded-3xl bg-[#6359E9]/5 p-6 md:w-1/2 md:p-10">
              <Image
                src={feature.image}
                alt={feature.imageAlt}
                className="h-auto w-full"
              />
            </div>
            <div className="flex w-full flex-col gap-4 text-center md:w-1/2 md:text-left">
              <span className="font-manrope text-sm font-semibold tracking-widest text-[#6D33FA] uppercase">
                {feature.eyebrow}
              </span>
              <h3 className="font-display text-3xl leading-tight font-normal tracking-wide text-slate-900 md:text-4xl">
                {feature.title}
              </h3>
              <p className="font-manrope text-base leading-relaxed text-slate-600 md:text-lg">
                {feature.description}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-24 flex w-full max-w-6xl flex-col items-center gap-6 rounded-3xl bg-[#6D33FA] px-6 py-14 text-center shadow-[0_8px_24px_rgba(109,51,250,0.3)] md:mt-32 md:py-20">
        <h2 className="max-w-3xl font-display text-4xl leading-tight font-normal tracking-wide text-white md:text-5xl">
          Siap Mengendalikan Keuanganmu?
        </h2>
        <p className="max-w-2xl font-manrope text-base leading-relaxed text-white/80 md:text-lg">
          Gabung dengan Artoku sekarang dan mulai bangun kebiasaan finansial yang
          lebih sehat — gratis.
        </p>
        <Link
          href="/sign-up"
          className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-white px-8 font-manrope text-base font-semibold text-[#6D33FA] transition-colors hover:bg-white/90 sm:w-auto"
        >
          Mulai Sekarang
        </Link>
      </div>
    </section>
  );
}
