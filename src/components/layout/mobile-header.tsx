import { CalendarDaysIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import artokuLogo from "@/components/images/icons/logo-dashboard.svg"

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-40 bg-[#0d4e31]">
      <div className="flex h-16 items-center gap-2 px-4">
        <Link href="/dashboard" aria-label="Beranda Artoku" className="shrink-0">
          <Image src={artokuLogo} alt="Artoku" preload unoptimized width={208} height={62} className="h-auto w-[104px]" />
        </Link>

        <Link
          href="/calender"
          aria-label="Buka kalender"
          className="ml-auto inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <CalendarDaysIcon className="size-5" aria-hidden="true" />
        </Link>
      </div>
    </header>
  )
}
