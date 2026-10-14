import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import artokuLogo from "@/components/images/sidebar/artoku-logo.png";
import loginIllustration from "@/components/images/illustrations/login.svg";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Bagian 1: form login */}
      <section className="flex items-center justify-center bg-slate-50 px-6 py-12">
        <div className="flex w-full max-w-md flex-col gap-8 rounded-2xl border bg-white p-8 shadow-xl shadow-slate-200/70">
          <div className="flex flex-col gap-2">
             <h1 className="text-3xl font-bold tracking-tight">Sign In</h1>
            <p className="text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <Link
                href="/sign-up"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Create now
              </Link>
            </p>
          </div>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </section>
      <section className="hidden bg-[#6359E9] lg:flex lg:flex-col lg:items-center lg:gap-12 lg:pt-16">
        <Image src={artokuLogo} alt="Artoku" priority className="h-30 w-auto" />
        <Image src={loginIllustration} alt="" className="h-auto w-full max-w-md" />
        <div className="flex max-w-[480px] flex-col gap-3 text-center text-white">
          <h2 className="text-3xl font-semibold">Smarter Personal Finance Management</h2>
          <p className="text-base text-white/80">
            Take control of your finances with intuitive transaction tracking, insightful
            analytics, and a clearer view of your financial health—all in one place.
          </p>
        </div>
      </section>
    </main>
  );
}
