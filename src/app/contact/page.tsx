import { createPageMetadata } from "@/lib/page-metadata";
import type { Metadata } from "next";
import Image from "next/image";
import { cookies } from "next/headers";
import { ContactForm } from "@/components/contact/contact-form";
import { HomeNavbar } from "@/components/home/home-navbar";
import { HomeFooter } from "@/components/home/home-footer";
import contactIllustration from "@/components/images/illustrations/contact-ilustration.gif";
import { AUTH_EXPIRED_AT_COOKIE, AUTH_TOKEN_COOKIE, isSessionValid } from "@/lib/auth";

export const metadata: Metadata = createPageMetadata({
  title: "Hubungi Kami | Artoku",
  description: "Punya pertanyaan, masukan, atau mengalami kendala saat menggunakan Artoku? Kami siap mendengarkan dan membantu kamu.",
  path: "/contact",
  image: contactIllustration.src,
});

export default async function ContactPage() {
  const cookieStore = await cookies();
  const isLoggedIn = isSessionValid(
    cookieStore.get(AUTH_TOKEN_COOKIE)?.value,
    cookieStore.get(AUTH_EXPIRED_AT_COOKIE)?.value,
  );

  return (
    <div className="min-h-screen bg-white">
      <HomeNavbar isLoggedIn={isLoggedIn} />
      <main id="main-content" tabIndex={-1} className="px-5 py-12 font-inter sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        <div className="mx-auto grid w-full max-w-[1600px] items-center gap-5 lg:grid-cols-2 lg:gap-0">
          <section aria-labelledby="contact-title" className="mx-auto w-full min-w-0 max-w-md">
            <h1 id="contact-title" className="text-3xl leading-tight font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Hubungi <span className="text-[#14864A]">Kami</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
              Punya pertanyaan, masukan, atau mengalami kendala saat menggunakan Artoku? Kami siap mendengarkan dan membantu kamu.
            </p>
            <ContactForm endpoint={process.env.CONTACT_API_PATH?.trim() || null} />
          </section>
          <Image
            src={contactIllustration}
            alt="Ilustrasi menghubungi tim Artoku"
            unoptimized
            sizes="(max-width: 1023px) 0px, (max-width: 1679px) calc((100vw - 80px) / 2), 800px"
            className="hidden h-auto w-full min-w-0 self-center justify-self-center object-contain lg:block"
          />
        </div>
      </main>
      <HomeFooter />
    </div>
  );
}
