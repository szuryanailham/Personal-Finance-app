import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { VerifyOtpForm } from "@/components/auth/verify-otp-form";
import artokuLogo from "@/components/images/icons/new-logo.svg";

export default function VerifyOtpPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F7FBF8] px-4 py-12">
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
        className="absolute top-6 left-6 h-12 w-auto"
      />
      <section className="relative flex w-full max-w-md flex-col gap-8 rounded-2xl border border-[#14864A]/10 bg-white p-8 shadow-[0_24px_80px_rgba(20,134,74,0.12)]">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Verifikasi Email</h1>
          <p className="text-sm text-muted-foreground">
            Salah email?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-[#14864A] underline-offset-4 hover:underline"
            >
              Kembali ke halaman daftar
            </Link>
          </p>
        </div>
        <Suspense>
          <VerifyOtpForm />
        </Suspense>
      </section>
    </main>
  );
}
