"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import artokuLogo from "@/components/images/icons/new-logo.svg";
import { DEFAULT_AUTHED_PATH, LOGIN_PATH } from "@/lib/auth";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Feature", href: "#features" },
  { label: "How it work", href: "#interface" },
  { label: "Blogs", href: "#products" },
] as const;

const loginButtonClass = cn(
  buttonVariants({ size: "lg" }),
  "bg-[#14864A] px-7 text-white hover:bg-[#10733e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14864A]",
);

interface HomeNavbarProps {
  isLoggedIn: boolean;
}

export function HomeNavbar({ isLoggedIn }: HomeNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // /dashboard sendiri memilih tampilan mobile atau desktop sesuai lebar layar
  const authAction = isLoggedIn
    ? { label: "Dashboard", href: DEFAULT_AUTHED_PATH }
    : { label: "Login", href: LOGIN_PATH };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white font-inter">
      <nav aria-label="Navigasi utama" className="mx-auto grid h-[4.5rem] max-w-7xl grid-cols-[1fr_auto] items-center px-5 sm:px-8 lg:grid-cols-[1fr_auto_1fr] lg:px-10">
        <Link href="/" aria-label="Beranda Artoku" className="justify-self-start">
          <Image src={artokuLogo} alt="Artoku" priority width={205} height={79} className="h-10 w-auto sm:h-12" />
        </Link>

        <ul className="hidden items-center gap-9 lg:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-[#14864A] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14864A]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-self-end gap-2">
          <Link href={authAction.href} className={cn(loginButtonClass, "hidden lg:inline-flex")}>
            {authAction.label}
          </Link>
          <button
            type="button"
            aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-controls="mobile-navigation"
            className="rounded-lg p-2 text-slate-700 hover:bg-[#DCF8E6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14864A] lg:hidden"
          >
            {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div id="mobile-navigation" className="border-t border-slate-100 bg-white px-5 pb-5 sm:px-8 lg:hidden">
          <ul className="flex flex-col py-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-[#DCF8E6] hover:text-[#14864A] focus-visible:outline-2 focus-visible:outline-[#14864A]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href={authAction.href} onClick={() => setIsMenuOpen(false)} className={cn(loginButtonClass, "w-full lg:hidden")}>
            {authAction.label}
          </Link>
        </div>
      )}
    </header>
  );
}
