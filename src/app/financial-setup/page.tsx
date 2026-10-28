import type { Metadata } from "next";
import Image from "next/image";
import { FinancialSetupForm } from "@/components/auth/financial-setup-form";
import artokuLogo from "@/components/images/icons/new-logo.svg";

export const metadata: Metadata = {
  title: "Setup Awal",
};

export default function FinancialSetupPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden bg-[#F7FBF8] px-4 py-8 sm:py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-50 [background-image:radial-gradient(#14864A_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_75%)]"
      />
      <Image
        src={artokuLogo}
        alt="Artoku"
        priority
        width={205}
        height={79}
        className="relative h-12 w-auto sm:absolute sm:top-6 sm:left-6 sm:h-12"
      />
      <section className="relative flex w-full max-w-md flex-col gap-6 rounded-2xl border border-[#14864A]/10 bg-white p-5 shadow-[0_24px_80px_rgba(20,134,74,0.12)] sm:gap-8 sm:p-8">
        <div className="flex flex-col gap-1.5 sm:gap-2">
          <h1 className="text-xl font-bold tracking-tight sm:text-3xl">Setup Awal Keuangan</h1>
          <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Isi saldo yang kamu miliki saat ini sebagai titik awal pencatatan. Setup ini hanya
            dilakukan sekali.
          </p>
        </div>
        <FinancialSetupForm />
      </section>
    </main>
  );
}
