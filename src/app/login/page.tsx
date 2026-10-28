import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import artokuLogo from "@/components/images/icons/new-logo.svg";
import loginIllustration from "@/components/images/illustrations/login-ilustration.svg";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-[#F7FBF8] lg:grid-cols-2">
      <section className="relative flex items-center justify-center overflow-hidden bg-white px-6 py-12 sm:px-10">
        <div aria-hidden="true" className="pointer-events-none absolute -left-28 -top-28 size-80 rounded-full bg-[#DCF8E6]/70 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-36 right-0 size-96 rounded-full bg-[#EAF7EE] blur-3xl" />
        <div className="relative flex w-full max-w-md flex-col gap-8 rounded-3xl border border-[#14864A]/10 bg-white p-7 shadow-[0_24px_80px_rgba(20,134,74,0.10)] sm:p-10">
          <Link
            href="/"
            aria-label="Artoku, kembali ke beranda"
            className="mb-1 inline-flex w-fit rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14864A]"
          >
            <Image src={artokuLogo} alt="Artoku" priority width={205} height={79} className="h-12 w-auto" />
          </Link>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-bold tracking-[0.28em] text-[#14864A]">SELAMAT DATANG KEMBALI</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">Login ke Artoku</h1>
            <p className="text-sm text-slate-600">
              Belum punya akun?{" "}
              <Link
                href="/sign-up"
                className="font-semibold text-[#14864A] underline-offset-4 hover:underline"
              >
                Daftar sekarang
              </Link>
            </p>
          </div>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </section>
      <section className="relative hidden min-h-screen items-center justify-center overflow-hidden bg-[#F7FBF8] px-10 py-14 lg:flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(#14864A_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
        />
        <div aria-hidden="true" className="pointer-events-none absolute -right-28 -top-28 size-[32rem] rounded-full border border-[#14864A]/10" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-36 size-[30rem] rounded-full border-[40px] border-[#DCF8E6]/60" />
        <div className="relative flex w-full max-w-2xl flex-col items-center gap-8">
          <Image
            src={loginIllustration}
            alt=""
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="h-[min(58vh,42rem)] w-auto max-w-full object-contain"
          />
          <div className="flex max-w-[520px] flex-col gap-3 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
              Kelola Keuangan Pribadi Lebih Cerdas
            </h2>
            <p className="text-base leading-7 text-slate-600">
              Kendalikan keuanganmu dengan pencatatan transaksi yang mudah, analisis yang
              informatif, dan gambaran kesehatan finansial yang lebih jelas, semuanya di satu tempat.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
