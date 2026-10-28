"use client";

import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  ArrowLeftRight,
  CalendarDays,
  ChartPie,
  Download,
  FileSpreadsheet,
  Landmark,
  Search,
  Smartphone,
  Tags,
  UserRound,
  Wallet,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const AUTOPLAY_DELAY_MS = 4500;

const FEATURES = [
  {
    icon: ArrowLeftRight,
    title: "Catat Transaksi",
    description:
      "Simpan pemasukan, pengeluaran, dan tabungan lengkap dengan nama, nominal, tanggal, jenis, serta kategori.",
  },
  {
    icon: Wallet,
    title: "Ringkasan Keuangan",
    description:
      "Pantau saldo serta perubahan pemasukan, pengeluaran, dan tabungan dalam satu tampilan.",
  },
  {
    icon: ChartPie,
    title: "Analisis per Kategori",
    description:
      "Pahami pengeluaran lewat grafik dan rincian statistik kategori dengan pilihan filter.",
  },
  {
    icon: Search,
    title: "Riwayat Transaksi",
    description:
      "Cari, saring, dan urutkan transaksi. Kamu juga bisa mengubah, menghapus, atau mengelola beberapa transaksi sekaligus.",
  },
  {
    icon: CalendarDays,
    title: "Kalender Transaksi",
    description:
      "Telusuri ringkasan pemasukan, pengeluaran, dan tabungan per hari dalam tampilan bulanan.",
  },
  {
    icon: Tags,
    title: "Kelola Kategori",
    description:
      "Tambah dan ubah kategori agar transaksi lebih mudah diatur.",
  },
  {
    icon: FileSpreadsheet,
    title: "Import dari File",
    description:
      "Gunakan template, unggah transaksi, lalu tinjau baris yang perlu diperbaiki sebelum diproses.",
  },
  {
    icon: Download,
    title: "Export ke Excel",
    description:
      "Unduh transaksi dalam format XLSX untuk rentang waktu yang tersedia atau tanggal pilihanmu.",
  },
  {
    icon: Landmark,
    title: "Setup Saldo Awal",
    description:
      "Masukkan saldo rekening utama dan tabungan saat mulai, atau lewati untuk mengaturnya nanti.",
  },
  {
    icon: UserRound,
    title: "Pengaturan Akun",
    description:
      "Perbarui informasi profil dan kata sandi akunmu.",
  },
  {
    icon: Smartphone,
    title: "Akses Mobile & Desktop",
    description:
      "Kelola keuangan dengan tampilan yang menyesuaikan perangkat mobile maupun desktop.",
  },
] as const;

export function FeatureListSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay] = useState(() =>
    Autoplay({
      delay: AUTOPLAY_DELAY_MS,
      stopOnInteraction: false,
      breakpoints: { "(prefers-reduced-motion: reduce)": { active: false } },
    })
  );

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setActiveIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section
      id="features"
      aria-labelledby="feature-list-title"
      className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl">
        <header className="mx-auto max-w-3xl text-center">
          <p className="font-inter text-xs font-bold tracking-[0.34em] text-[#14864A] sm:text-sm">
            FITUR ARTOKU
          </p>
          <h2
            id="feature-list-title"
            className="mt-4 font-inter text-3xl leading-[1.15] font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl"
          >
            Semua yang kamu butuhkan untuk mengelola keuangan
          </h2>
          <p className="mx-auto mt-5 max-w-2xl font-inter text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Catat transaksi, pahami kondisi keuangan, dan kelola data dalam satu tempat.
          </p>
        </header>

        <Carousel
          setApi={setApi}
          opts={{ align: "start", loop: true }}
          plugins={[autoplay]}
          aria-label="Fitur Artoku"
          className="mt-10 sm:mt-12"
        >
          <CarouselContent className="ml-0">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <CarouselItem key={title} className="basis-[88%] px-2 sm:basis-1/2 lg:basis-1/3">
                <article className="h-full rounded-2xl border border-[#14864A]/10 bg-[#F7FBF8] p-6 transition-colors hover:border-[#14864A]/30 sm:p-7">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-[#DCF8E6] text-[#14864A]">
                    <Icon aria-hidden="true" className="size-6" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-5 font-inter text-lg leading-6 font-semibold text-slate-900">
                    {title}
                  </h3>
                  <p className="mt-2 font-inter text-sm leading-6 text-slate-600">
                    {description}
                  </p>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="mt-6 flex items-center justify-center gap-4">
            <CarouselPrevious
              aria-label="Fitur sebelumnya"
              className="static inset-auto my-0 size-10 translate-y-0 border-[#14864A]/20 text-[#14864A] hover:bg-[#DCF8E6]"
            />
            <div className="flex max-w-[55vw] items-center justify-center gap-1.5 overflow-hidden sm:max-w-none">
              {FEATURES.map(({ title }, index) => (
                <button
                  key={title}
                  type="button"
                  aria-label={`Lihat fitur ${title}`}
                  aria-current={index === activeIndex}
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    index === activeIndex ? "w-5 bg-[#14864A]" : "w-2 bg-emerald-100"
                  )}
                />
              ))}
            </div>
            <CarouselNext
              aria-label="Fitur berikutnya"
              className="static inset-auto my-0 size-10 translate-y-0 border-[#14864A]/20 text-[#14864A] hover:bg-[#DCF8E6]"
            />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
