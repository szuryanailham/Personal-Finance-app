import Image from "next/image";
import Link from "next/link";
import { FileText, ShieldCheck } from "lucide-react";

import privacyIcon from "@/components/images/illustrations/security-icon-1.svg";
import securityIcon from "@/components/images/illustrations/security-icon-2.svg";
import transparencyIcon from "@/components/images/illustrations/security-icon-3.svg";

const SECURITY_ITEMS = [
  {
    icon: privacyIcon,
    title: "Privasi Data Pribadi",
    description:
      "Informasi keuanganmu dikelola dengan memperhatikan privasi dan kerahasiaan data pengguna.",
  },
  {
    icon: securityIcon,
    title: "Keamanan Data",
    description:
      "Kami berupaya menjaga keamanan informasi yang kamu catat melalui MyArtoku.",
  },
  {
    icon: transparencyIcon,
    title: "Transparansi Informasi",
    description:
      "Ketahui bagaimana data pribadimu dikumpulkan, digunakan, dan dikelola melalui kebijakan privasi kami.",
  },
] as const;

export function SecuritySection() {
  return (
    <section
      aria-labelledby="security-title"
      className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl">
        <h2
          id="security-title"
          className="mx-auto max-w-3xl text-center font-inter text-3xl leading-[1.15] font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl"
        >
          Data Keuanganmu <span className="text-[#14864A]">Aman Dan Private</span>
        </h2>

        <ul className="mt-10 grid grid-cols-1 gap-8 sm:mt-12 md:grid-cols-3 lg:mt-16 lg:gap-12">
          {SECURITY_ITEMS.map(({ icon, title, description }) => (
            <li key={title} className="flex flex-col items-center text-center">
              <Image
                src={icon}
                alt=""
                width={150}
                height={150}
                className="size-28 object-contain sm:size-36"
              />
              <h3 className="mt-6 font-inter text-xl leading-7 font-semibold text-slate-900">
                {title}
              </h3>
              <p className="mt-3 max-w-sm font-inter text-base leading-7 text-slate-600">
                {description}
              </p>
            </li>
          ))}
        </ul>

        <nav
          aria-label="Informasi privasi dan ketentuan"
          className="mt-10 flex flex-col items-stretch justify-center gap-3 border-t border-[#14864A]/10 pt-8 sm:mt-12 sm:flex-row sm:items-center sm:gap-4"
        >
          {[
            { href: "/kebijakan-privasi", label: "Kebijakan Privasi", icon: ShieldCheck },
            { href: "/syarat-ketentuan", label: "Syarat & Ketentuan", icon: FileText },
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex min-h-12 items-center justify-center gap-3 px-2 py-3 font-inter text-sm font-semibold text-[#14864A] transition-colors hover:text-[#10733e] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14864A]"
            >
              <Icon aria-hidden="true" className="size-5 shrink-0" strokeWidth={1.8} />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
