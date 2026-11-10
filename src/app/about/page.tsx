import { createPageMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import heroAbout from "@/components/images/illustrations/hero-about.svg";
import { cookies } from "next/headers";
import { HomeNavbar } from "@/components/home/home-navbar";
import { HomeFooter } from "@/components/home/home-footer";
import { AUTH_EXPIRED_AT_COOKIE, AUTH_TOKEN_COOKIE, isSessionValid } from "@/lib/auth";

export const metadata: Metadata = createPageMetadata({
  title: "Tentang Artoku | Aplikasi Pencatat Keuangan Pribadi",
  description: "Kenali Artoku, aplikasi pencatat keuangan pribadi untuk mencatat pemasukan dan pengeluaran, mengelola saldo, serta memantau kondisi keuangan Anda.",
  path: "/about",
});

const FINANCE_STEPS = [
  {
    number: "01",
    title: "Catat Pemasukan",
    description: "Catat setiap uang yang masuk agar sumber pemasukan lebih mudah dipantau.",
  },
  {
    number: "02",
    title: "Catat Pengeluaran",
    description: "Pantau pengeluaran harian untuk memahami bagaimana uang digunakan.",
  },
  {
    number: "03",
    title: "Pantau Kondisi Keuangan",
    description: "Lihat riwayat transaksi dan pantau aktivitas keuangan pribadi dalam satu tempat.",
  },
] as const;

export default async function AboutPage() {
  const cookieStore = await cookies();
  const isLoggedIn = isSessionValid(
    cookieStore.get(AUTH_TOKEN_COOKIE)?.value,
    cookieStore.get(AUTH_EXPIRED_AT_COOKIE)?.value,
  );

  return (
    <div className="min-h-screen bg-white">
      <HomeNavbar isLoggedIn={isLoggedIn} />
      <main id="main-content" tabIndex={-1}>
        <section aria-labelledby="about-hero-title" className="bg-[#42A86E]/10 px-5 pt-12 pb-10 font-inter sm:px-8 sm:pt-16 sm:pb-14 lg:px-10 lg:pt-20">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center text-center">
            <span className="inline-flex items-center justify-center rounded-full bg-[#21B761]/48 px-5 py-2 text-sm font-semibold text-[#14864A]">
              Tentang Artoku
            </span>
            <h1 id="about-hero-title" className="mt-6 max-w-4xl text-3xl leading-tight font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl lg:leading-[1.15]">
              Kenali <span className="text-[#14864A]">Artoku</span>, Pahami Kondisi Keuanganmu Lebih Baik.
            </h1>
            <div className="mt-8 w-full max-w-[43rem] sm:mt-10 lg:mt-12">
              <Image
                src={heroAbout}
                alt="Ilustrasi pengelolaan keuangan bersama Artoku"
                width={863}
                height={578}
                preload
                sizes="(max-width: 767px) calc(100vw - 40px), 688px"
                className="mx-auto h-auto w-full object-contain"
              />
            </div>
          </div>
        </section>
        <div className="bg-white px-5 py-14 font-inter sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="mx-auto w-full max-w-7xl">
            <section aria-labelledby="about-us-title" className="grid gap-6 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
              <div>
                <p className="text-sm font-semibold tracking-[0.3em] text-[#14864A] uppercase">
                  About Us
                </p>
                <h2 id="about-us-title" className="mt-3 text-3xl leading-tight font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Apa itu <span className="text-[#14864A]">Artoku</span>?
                </h2>
              </div>
              <div className="space-y-5 text-base leading-8 text-slate-600 sm:text-lg sm:leading-9">
                <p>
                  <strong className="font-semibold text-slate-950">Artoku (MyArtoku)</strong> adalah aplikasi pencatat keuangan pribadi yang membantu kamu mencatat dan mengelola pemasukan, pengeluaran, serta tabungan dalam satu tempat dengan mudah.
                </p>
                <p>
                  Melalui ringkasan dan visualisasi keuangan, Artoku membantu kamu memahami penggunaan uang dan membangun kebiasaan mengelola keuangan yang lebih baik tanpa perlu pencatatan manual.
                </p>
              </div>
            </section>
            <section aria-labelledby="our-story-title" className="mt-12 grid gap-6 border-t border-slate-200 pt-12 sm:mt-16 sm:pt-16 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
              <div>
                <p className="text-sm font-semibold tracking-[0.3em] text-[#14864A] uppercase">
                  Our Story
                </p>
                <h2 id="our-story-title" className="mt-3 text-3xl leading-tight font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Mengapa <span className="text-[#14864A]">Artoku</span> Dibuat?
                </h2>
              </div>
              <div className="space-y-5 text-base leading-8 text-slate-600 sm:text-lg sm:leading-9">
                <p>
                  Pernah merasa uang bulanan mulai berkurang tanpa mengetahui ke mana uang tersebut digunakan? Hal ini sering dialami mahasiswa dan pekerja muda yang mulai mengelola keuangannya sendiri, terutama ketika pencatatan transaksi belum menjadi kebiasaan.
                </p>
                <p>
                  Dari permasalahan tersebut, Artoku dikembangkan untuk membantu pengguna mencatat dan memahami arus keuangan dengan lebih mudah. Kami ingin menghadirkan solusi sederhana yang tidak hanya membantu mencatat transaksi, tetapi juga membangun kesadaran dalam mengelola keuangan dan mengambil keputusan finansial.
                </p>
              </div>
            </section>
          </div>
        </div>
        <section aria-labelledby="about-benefits-title" className="bg-[#F7FBF8] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="mx-auto w-full max-w-7xl">
            <header className="mx-auto max-w-3xl text-center font-inter">
              <p className="text-sm font-semibold tracking-[0.16em] text-[#14864A]">
                MANFAAT DAN KEMAMPUAN
              </p>
              <h2 id="about-benefits-title" className="mt-3 text-3xl leading-[1.15] font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl">
                Apa yang Bisa Kamu Lakukan dengan <span className="text-[#14864A]">Artoku</span>?
              </h2>
            </header>
            <ol className="mt-12 grid gap-6 md:grid-cols-3 lg:mt-16 lg:gap-8">
              {FINANCE_STEPS.map(({ number, title, description }) => (
                <li key={number} className="rounded-3xl bg-[#1F8C52] p-7 sm:p-8">
                  <span aria-hidden="true" className="block font-inter text-3xl font-semibold tracking-[-0.04em] text-white">
                    {number}
                  </span>
                  <h3 className="mt-7 font-inter text-xl leading-7 font-semibold text-white">
                    {title}
                  </h3>
                  <p className="mt-3 font-inter text-base leading-7 text-white">
                    {description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <section aria-labelledby="our-team-title" className="bg-white px-5 py-14 font-inter sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
            <div>
              <p className="text-sm font-semibold tracking-[0.3em] text-[#14864A] uppercase">
                Our Team
              </p>
              <h2 id="our-team-title" className="mt-3 text-3xl leading-tight font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Siapa di Balik <span className="text-[#14864A]">Artoku</span>?
              </h2>
            </div>
            <div className="space-y-5 text-base leading-8 text-slate-600 sm:text-lg sm:leading-9">
              <p>
                Artoku merupakan produk digital yang terus dikembangkan untuk membantu masyarakat membangun kebiasaan pencatatan keuangan pribadi.
              </p>
              <p>
                Saat ini, Artoku masih dalam tahap pengembangan dan penyempurnaan berdasarkan pengalaman serta masukan dari pengguna.
              </p>
              <p>
                Kami percaya bahwa produk yang bermanfaat dibangun dengan memahami kebutuhan nyata penggunanya.
              </p>
              <p>
                Punya pertanyaan atau masukan? Hubungi kami melalui halaman{" "}
                <Link href="/contact" className="font-medium text-[#14864A] underline underline-offset-4 hover:text-[#10733e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14864A]">
                  Kontak
                </Link>
                . Pelajari juga bagaimana data Anda dikelola melalui{" "}
                <Link href="/kebijakan-pivasi" className="font-medium text-[#14864A] underline underline-offset-4 hover:text-[#10733e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14864A]">
                  Kebijakan Privasi
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
}
