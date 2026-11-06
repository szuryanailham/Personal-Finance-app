import Image from "next/image";
import Link from "next/link";

import artokuLogo from "@/components/images/icons/logo-dashboard.svg";

export function HomeFooter() {
  return (
    <footer className="bg-[#14864A] px-5 py-10 font-inter text-white sm:px-8 sm:py-12 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr] lg:gap-20">
          <div>
            <Link
              href="/"
              aria-label="Beranda Artoku"
              className="inline-flex rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <Image
                src={artokuLogo}
                alt="Artoku"
                width={208}
                height={62}
                className="h-12 w-auto brightness-0 invert sm:h-14"
              />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-pretty text-white/90 sm:text-base">
              Catat keuanganmu dengan mudah, pahami setiap pemasukan dan pengeluaran untuk keuangan yang lebih teratur.
            </p>
          </div>
          <nav aria-label="Navigasi footer">
            <ul className="space-y-4 text-sm sm:text-base">
              {[
                { label: "Beranda", href: "/" },
                { label: "Tentang Kami", href: "/#about" },
                { label: "Blog", href: "/#blog" },
                { label: "Daftar", href: "/sign-up" },
                { label: "Contact", href: "/#contact" },
                { label: "FAQ", href: "/#faq" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Akun dan kebijakan">
            <ul className="space-y-4 text-sm sm:text-base">
              {[
                { label: "Daftar", href: "/sign-up" },
                { label: "Login", href: "/login" },
                { label: "Kebijakan Privasi", href: "/kebijakan-privasi" },
                { label: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-8 border-t border-white/20 pt-6 text-sm leading-6 text-white/80">
          © {new Date().getFullYear()} MyArtoku. Seluruh hak cipta dilindungi.
        </p>
      </div>
    </footer>
  );
}
