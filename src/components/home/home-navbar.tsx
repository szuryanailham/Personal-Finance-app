"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import artokuLogo from "@/components/images/icons/logo-light.png";
import { DEFAULT_AUTHED_PATH, LOGIN_PATH, SIGN_UP_PATH } from "@/lib/auth";

const NAV_ITEMS = [
  { label: "Beranda", href: "/" },
  { label: "Fitur", href: "/fitur" },
  { label: "Tentang Kami", href: "/about" },
  { label: "Kontak", href: "/contact" },
  { label: "Blog", href: "/blog" },
] as const;

const landingButtonClass = "inline-flex min-h-10 items-center justify-center rounded-full bg-[#14864a] px-5 text-sm font-bold text-white hover:bg-[#10733e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14864a]";

const loginButtonClass = cn(
  buttonVariants({ size: "lg" }),
  "bg-[#14864A] px-7 text-white hover:bg-[#10733e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14864A]",
);

interface HomeNavbarProps {
  isLoggedIn: boolean;
}

export function HomeNavbar({ isLoggedIn }: HomeNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const isActive = (href: string) =>
    href !== "/" && (pathname === href || pathname.startsWith(`${href}/`));
  // /dashboard sendiri memilih tampilan mobile atau desktop sesuai lebar layar
  const authAction = isLoggedIn
    ? { label: "Dashboard", href: DEFAULT_AUTHED_PATH }
    : { label: "Masuk", href: LOGIN_PATH };

  return (
    <header className={cn(
      "sticky top-0 z-50 border-b",
      isLanding
        ? "border-[#0d4f30]/15 bg-[#fbf7ef] font-(family-name:--font-landing-inter)"
        : "border-slate-100 bg-inherit font-inter",
    )}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-lg focus:bg-[#14864A] focus:px-5 focus:py-3 focus:font-semibold focus:text-white focus:outline-2 focus:outline-offset-2 focus:outline-[#10733e]"
      >
        Lewati ke konten utama
      </a>
      <nav aria-label="Navigasi utama" className={cn(
        "mx-auto grid grid-cols-[1fr_auto] items-center px-5 sm:px-8",
        isLanding
          ? "h-16 max-w-[70rem] lg:w-[80%] lg:px-0"
          : "h-[4.5rem] max-w-7xl lg:grid-cols-[1fr_auto_1fr] lg:px-10",
      )}>
        <Link href="/" aria-label="Beranda Artoku" className="justify-self-start">
          <Image src={artokuLogo} alt="Artoku" loading="eager" className={cn("h-10 w-auto", !isLanding && "sm:h-12")} />
        </Link>

        <ul className={cn("hidden items-center gap-6", !isLanding && "lg:flex")}>
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[#14864A] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14864A]",
                  isActive(item.href)
                    ? "text-[#14864A] underline decoration-[#14864A] decoration-2 underline-offset-8"
                    : "text-slate-600",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-self-end gap-2">
          {isLanding ? (
            <Link href={isLoggedIn ? "/transaction" : SIGN_UP_PATH} className={landingButtonClass}>
              Mulai Catat
            </Link>
          ) : (
            <Link href={authAction.href} className={cn(loginButtonClass, "hidden lg:inline-flex")}>
              {authAction.label}
            </Link>
          )}
          <button
            type="button"
            aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-controls="mobile-navigation"
            className={cn("rounded-lg p-2 text-slate-700 hover:bg-[#DCF8E6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14864A] lg:hidden", isLanding && "hidden")}
          >
            {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {!isLanding && isMenuOpen && (
        <nav aria-label="Navigasi mobile" id="mobile-navigation" className="border-t border-slate-100 px-5 pb-5 sm:px-8 lg:hidden">
          <ul className="flex flex-col py-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "block rounded-lg px-3 py-3 text-sm font-medium hover:bg-[#DCF8E6] hover:text-[#14864A] focus-visible:outline-2 focus-visible:outline-[#14864A]",
                    isActive(item.href)
                      ? "text-[#14864A] underline decoration-[#14864A] decoration-2 underline-offset-8"
                      : "text-slate-700",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href={authAction.href} onClick={() => setIsMenuOpen(false)} className={cn(loginButtonClass, "w-full")}>
            {authAction.label}
          </Link>
        </nav>
      )}
    </header>
  );
}
