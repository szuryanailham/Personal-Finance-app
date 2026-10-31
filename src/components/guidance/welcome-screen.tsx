"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { ArrowRightIcon, ChartPieIcon, WalletIcon, TrendingUpIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import logo from "@/components/images/icons/new-logo.svg"
import illustration from "@/components/images/illustrations/login-ilustration.svg"

const benefits = [
  { icon: WalletIcon, title: "Kelola keuanganmu dengan mudah", description: "Catat pemasukan dan pengeluaran dalam satu tempat." },
  { icon: ChartPieIcon, title: "Pahami pengeluaranmu", description: "Ketahui ke mana uangmu digunakan melalui analisis keuangan yang jelas." },
  { icon: TrendingUpIcon, title: "Bangun kebiasaan keuangan yang lebih baik", description: "Pantau perkembangan keuanganmu dan buat keputusan yang lebih bijak." },
]

export function WelcomeScreen({ onStart, onSkip }: { onStart: () => void; onSkip: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => { heading.current?.focus() }, [])

  return (
    <main lang="id" className="fixed inset-0 z-[10000] overflow-y-auto bg-[#F7FBF8] text-slate-950" aria-labelledby="welcome-title">
      <div className="mx-auto grid min-h-full max-w-6xl items-center gap-8 px-6 py-8 sm:px-10 lg:grid-cols-2 lg:gap-16 lg:py-14">
        <div className="flex flex-col items-center gap-5 lg:order-2">
          <Image src={illustration} alt="" preload sizes="(min-width: 1024px) 50vw, 100vw" className="h-auto max-h-[28vh] w-full max-w-md object-contain lg:max-h-[65vh] lg:max-w-full" />
        </div>
        <div className="flex flex-col gap-6 lg:order-1">
          <Image src={logo} alt="Artoku" className="h-10 w-auto self-start" />
          <div>
            <p className="mb-3 text-xs font-bold tracking-[0.2em] text-[#14864A]">PERJALANAN KEUANGANMU DIMULAI DI SINI</p>
            <h1 id="welcome-title" ref={heading} tabIndex={-1} className="text-3xl font-bold tracking-tight outline-none sm:text-4xl">Selamat datang di Artoku!</h1>
            <p className="mt-4 text-base leading-7 text-slate-600">Asisten keuangan pribadimu untuk memahami pola pengeluaran, mengelola uang, dan membangun kebiasaan keuangan yang lebih baik.</p>
          </div>
          <ul className="space-y-4">
            {benefits.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#DCF8E6] text-[#14864A]"><Icon className="size-5" aria-hidden /></span>
                <div><h2 className="text-sm font-semibold">{title}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{description}</p></div>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3">
            <Button onClick={onStart} className="h-12 w-full bg-[#14864A] text-white hover:bg-[#10733e]">Mulai Tutorial <ArrowRightIcon aria-hidden /></Button>
            <Button onClick={onSkip} variant="ghost" className="h-11 w-full text-slate-600">Lewati untuk Sekarang</Button>
            <p className="text-center text-xs leading-5 text-slate-500">Kamu bisa mengulang tutorial kapan saja melalui Pusat Panduan.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
