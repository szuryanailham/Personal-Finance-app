import type { Metadata } from "next";
import Image from "next/image";
import { FinancialSetupForm } from "@/components/auth/financial-setup-form";
import artokuLogo from "@/components/images/sidebar/artoku-logo.png";

export const metadata: Metadata = {
  title: "Setup Awal",
};

export default function FinancialSetupPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-6 bg-[#6359E9] px-4 py-8 sm:py-12">
      <Image
        src={artokuLogo}
        alt="Artoku"
        priority
        className="h-12 w-auto sm:absolute sm:top-6 sm:left-6 sm:h-20"
      />
      <section className="flex w-full max-w-md flex-col gap-6 rounded-2xl bg-white p-5 shadow-2xl shadow-black/20 sm:gap-8 sm:p-8">
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
