import Image from "next/image";
import Link from "next/link";
import { SignUpForm } from "@/components/auth/sign-up-form";
import artokuLogo from "@/components/images/sidebar/artoku-logo.png";

export default function SignUpPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#6359E9] px-4 py-12">
      <Image
        src={artokuLogo}
        alt="Artoku"
        priority
        className="absolute top-6 left-6 h-20 w-auto"
      />
      <section className="flex w-full max-w-lg flex-col gap-8 rounded-2xl bg-white p-8 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Daftar</h1>
          <p className="text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-medium text-[#6359E9] underline-offset-4 hover:underline"
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
