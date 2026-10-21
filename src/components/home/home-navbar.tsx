"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import artokuLogo from "@/components/images/artoku-logo-color.png";

const NAV_ITEMS = [
  { label: "Beranda", href: "/" },
  { label: "Fitur", href: "#features" },
  { label: "Simulator", href: "#simulator" },
  { label: "Tentang", href: "#about" },
] as const;

const loginButtonClass = cn(
  buttonVariants({ size: "lg" }),
  "bg-[#6359E9] px-8 text-white hover:bg-[#6359E9]/90",
);

export function HomeNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#F3F3FC]/80 font-manrope backdrop-blur">
      <nav className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto] items-center px-4 md:grid-cols-[1fr_auto_1fr] md:px-8">
        <Link href="/" aria-label="Beranda Artoku" className="justify-self-start">
          <Image src={artokuLogo} alt="Artoku" priority className="h-9 w-auto" />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-[#6359E9]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-self-end gap-2">
          <Link href="/login" className={cn(loginButtonClass, "hidden md:inline-flex")}>
            Login
          </Link>
          <button
            type="button"
            aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          >
            {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="bg-[#F3F3FC] px-4 pb-4 md:hidden">
          <ul className="flex flex-col py-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-lg px-2 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#6359E9]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/login" className={cn(loginButtonClass, "w-full")}>
            Login
          </Link>
        </div>
      )}
    </header>
  );
}
