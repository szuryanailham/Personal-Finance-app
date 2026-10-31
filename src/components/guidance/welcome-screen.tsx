"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { ArrowRightIcon, ChartPieIcon, WalletIcon, TrendingUpIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import logo from "@/components/images/icons/new-logo.svg"
import illustration from "@/components/images/illustrations/login-ilustration.svg"

const benefits = [
  { icon: WalletIcon, title: "Keep your money organized", description: "Record income and expenses in one place." },
  { icon: ChartPieIcon, title: "Understand your spending", description: "See where your money goes with clear financial insights." },
  { icon: TrendingUpIcon, title: "Build better financial habits", description: "Track your progress and make more informed money decisions." },
]

export function WelcomeScreen({ onStart, onSkip }: { onStart: () => void; onSkip: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => { heading.current?.focus() }, [])

  return (
    <main lang="en" className="fixed inset-0 z-[10000] overflow-y-auto bg-[#F7FBF8] text-slate-950" aria-labelledby="welcome-title">
      <div className="mx-auto grid min-h-full max-w-6xl items-center gap-8 px-6 py-8 sm:px-10 lg:grid-cols-2 lg:gap-16 lg:py-14">
        <div className="flex flex-col items-center gap-5 lg:order-2">
          <Image src={illustration} alt="" preload sizes="(min-width: 1024px) 50vw, 100vw" className="h-auto max-h-[28vh] w-full max-w-md object-contain lg:max-h-[65vh] lg:max-w-full" />
        </div>
        <div className="flex flex-col gap-6 lg:order-1">
          <Image src={logo} alt="Artoku" className="h-10 w-auto self-start" />
          <div>
            <p className="mb-3 text-xs font-bold tracking-[0.2em] text-[#14864A]">YOUR FINANCIAL JOURNEY STARTS HERE</p>
            <h1 id="welcome-title" ref={heading} tabIndex={-1} className="text-3xl font-bold tracking-tight outline-none sm:text-4xl">Welcome to Artoku!</h1>
            <p className="mt-4 text-base leading-7 text-slate-600">Your personal finance assistant to help you understand your spending habits, manage your money, and build better financial habits.</p>
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
            <Button onClick={onStart} className="h-12 w-full bg-[#14864A] text-white hover:bg-[#10733e]">Start Tutorial <ArrowRightIcon aria-hidden /></Button>
            <Button onClick={onSkip} variant="ghost" className="h-11 w-full text-slate-600">Skip for Now</Button>
            <p className="text-center text-xs leading-5 text-slate-500">You can replay tutorials anytime from the Guidance Center (Pusat Panduan).</p>
          </div>
        </div>
      </div>
    </main>
  )
}
