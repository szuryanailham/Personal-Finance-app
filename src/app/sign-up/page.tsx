import Image from "next/image";
import Link from "next/link";
import { SignUpForm } from "@/components/auth/sign-up-form";
import artokuLogo from "@/components/images/icons/new-logo.svg";

export default function SignUpPage() {
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
      <section className="relative mt-16 flex w-full max-w-lg flex-col gap-8 rounded-2xl border border-[#14864A]/10 bg-white p-8 shadow-[0_24px_80px_rgba(20,134,74,0.12)] sm:mt-0">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Daftar</h1>
          <p className="text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-medium text-[#14864A] underline-offset-4 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
        <SignUpForm />
      </section>
    </main>
  );
}
