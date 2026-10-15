"use client";

import Image, { type StaticImageData } from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "cn";

import analysisScreenshot from "@/components/images/screenshoot/anaylisis.png";
import dashboardScreenshot from "@/components/images/screenshoot/dashboard.png";
import exportScreenshot from "@/components/images/screenshoot/export.png";
import importScreenshot from "@/components/images/screenshoot/import.png";
import transactionScreenshot from "@/components/images/screenshoot/transaction.png";

interface InterfaceSlide {
  image: StaticImageData;
  imageAlt: string;
  label: string;
  title: string;
  description: string;
}

const INTERFACE_SLIDES: readonly InterfaceSlide[] = [
  {
    image: dashboardScreenshot,
    imageAlt:
      "Dashboard Artoku berisi total saldo, pemasukan, tabungan, pengeluaran, dan grafik mingguan",
    label: "Dashboard",
    title: "Ringkasan Keuangan dalam Satu Layar",
    description:
      "Lihat total saldo, pemasukan, tabungan, dan pengeluaran sekaligus, lengkap dengan grafik pemasukan vs pengeluaran harian, mingguan, atau bulanan.",
  },
  {
    image: transactionScreenshot,
    imageAlt: "Form tambah transaksi Artoku dengan judul, kategori, nominal, dan tanggal",
    label: "Transaksi",
    title: "Catat Transaksi dalam Hitungan Detik",
    description:
      "Isi judul, kategori, nominal, tanggal, dan catatan dalam satu form sederhana. Transaksimu langsung tercatat rapi.",
  },
  {
    image: importScreenshot,
    imageAlt: "Panel import transaksi Artoku dengan unggah file CSV atau XLSX",
    label: "Import",
    title: "Import Transaksi Tanpa Input Manual",
    description:
      "Unduh template, unggah file CSV atau XLSX, lalu tinjau datanya sebelum disimpan. Tak perlu ketik satu per satu.",
  },
  {
    image: exportScreenshot,
    imageAlt: "Panel export transaksi Artoku dengan pilihan format file dan rentang transaksi",
    label: "Export",
    title: "Export Data Kapan Pun Kamu Butuh",
    description:
      "Pilih format file dan rentang transaksi, lalu unduh laporan keuanganmu dalam sekali klik.",
  },
  {
    image: analysisScreenshot,
    imageAlt: "Halaman analisis Artoku dengan diagram pengeluaran per kategori",
    label: "Analisis",
    title: "Pahami ke Mana Uangmu Pergi",
    description:
      "Diagram pengeluaran per kategori dan tabel rinciannya membantumu menemukan pos pengeluaran terbesar setiap bulan.",
  },
];

const AUTOPLAY_INTERVAL_MS = 5000;
const SWIPE_THRESHOLD_PX = 50;

export function InterfaceSliderSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const slideCount = INTERFACE_SLIDES.length;

  const goTo = useCallback(
    (index: number) => setActiveIndex((index + slideCount) % slideCount),
    [slideCount],
  );
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (isPaused || prefersReducedMotion) return;

    const timer = window.setTimeout(goNext, AUTOPLAY_INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [activeIndex, isPaused, goNext]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") goNext();
    if (event.key === "ArrowLeft") goPrev();
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;
    if (deltaX < 0) goNext();
    else goPrev();
  };

  const activeSlide = INTERFACE_SLIDES[activeIndex];

  return (
    <section
      id="interface"
      className="flex flex-col items-center gap-4 px-4 py-20 text-center md:py-28"
    >
      <h2 className="max-w-3xl font-display text-4xl leading-tight font-normal tracking-wide text-slate-900 md:text-5xl">
        Jelajahi Fitur Artoku
      </h2>
      <p className="max-w-2xl font-manrope text-base leading-relaxed text-slate-600 md:text-lg">
        Jelajahi tampilan fitur-fitur utama yang membantumu mengelola keuangan.
      </p>

      <div
        role="tablist"
        aria-label="Pilih fitur"
        className="mt-8 flex max-w-full gap-2 overflow-x-auto rounded-full bg-[#6359E9]/5 p-1.5 font-manrope"
      >
        {INTERFACE_SLIDES.map((slide, index) => (
          <button
            key={slide.label}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-controls="interface-slide-panel"
            onClick={() => goTo(index)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              index === activeIndex
                ? "bg-[#6D33FA] text-white shadow-[0_4px_12px_rgba(109,51,250,0.3)]"
                : "text-slate-600 hover:text-[#6D33FA]",
            )}
          >
            {slide.label}
          </button>
        ))}
      </div>

      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Tampilan fitur Artoku"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative mt-6 w-full max-w-6xl rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-[#6D33FA]"
      >
        <div className="overflow-hidden rounded-3xl bg-[#6359E9]/5">
          <div
            className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {INTERFACE_SLIDES.map((slide, index) => (
              <div
                key={slide.label}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} dari ${slideCount}: ${slide.label}`}
                aria-hidden={index !== activeIndex}
                className="w-full shrink-0 p-3 sm:p-6 md:p-12"
              >
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  placeholder="blur"
                  sizes="(min-width: 1152px) 1056px, 100vw"
                  priority={index === 0}
                  className="h-auto w-full rounded-xl border border-slate-200 shadow-[0_16px_40px_rgba(99,89,233,0.18)] md:rounded-2xl"
                />
              </div>
            ))}
          </div>
        </div>

        <SliderArrow direction="prev" onClick={goPrev} />
        <SliderArrow direction="next" onClick={goNext} />
      </div>

      <div
        id="interface-slide-panel"
        role="tabpanel"
        aria-live={isPaused ? "polite" : "off"}
        className="mt-6 flex max-w-2xl flex-col gap-3"
      >
        <h3 className="font-display text-2xl leading-snug font-normal tracking-wide text-slate-900 md:text-3xl">
          {activeSlide.title}
        </h3>
        <p className="font-manrope text-base leading-relaxed text-slate-600 md:text-lg">
          {activeSlide.description}
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        {INTERFACE_SLIDES.map((slide, index) => (
          <button
            key={slide.label}
            type="button"
            aria-label={`Ke slide ${slide.label}`}
            aria-current={index === activeIndex}
            onClick={() => goTo(index)}
            className={cn(
              "h-2 rounded-full transition-all",
              index === activeIndex
                ? "w-8 bg-[#6D33FA]"
                : "w-2 bg-slate-300 hover:bg-slate-400",
            )}
          />
        ))}
      </div>
    </section>
  );
}

interface SliderArrowProps {
  direction: "prev" | "next";
  onClick: () => void;
}

function SliderArrow({ direction, onClick }: SliderArrowProps) {
  const isPrev = direction === "prev";
  const Icon = isPrev ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      aria-label={isPrev ? "Slide sebelumnya" : "Slide berikutnya"}
      onClick={onClick}
      className={cn(
        "absolute top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#6D33FA] shadow-[0_8px_24px_rgba(109,51,250,0.2)] transition-colors hover:bg-[#6D33FA] hover:text-white md:flex",
        isPrev ? "left-4" : "right-4",
      )}
    >
      <Icon className="size-5" />
    </button>
  );
}
