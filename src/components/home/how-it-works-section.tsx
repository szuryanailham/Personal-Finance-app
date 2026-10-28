import Image from "next/image";

import firstFeatureIllustration from "@/components/images/illustrations/fiture-ilustration -1.svg";
import secondFeatureIllustration from "@/components/images/illustrations/fiture-ilustration -2.svg";
import thirdFeatureIllustration from "@/components/images/illustrations/fiture-ilustration -3.svg";

const STEPS = [
  {
    number: "01",
    image: firstFeatureIllustration,
    imageAlt: "Ilustrasi fitur pencatatan keuangan Artoku",
    title: "Catat uang masuk dan keluar",
    description:
      "Catat gaji, pendapatan tambahan, serta pengeluaran untuk makan, transportasi, belanja, dan kebutuhan sehari-hari.",
  },
  {
    number: "02",
    image: secondFeatureIllustration,
    imageAlt: "Ilustrasi fitur memahami pola pengeluaran Artoku",
    title: "Pahami pola pengeluaran",
    description:
      "Ketahui kategori yang paling banyak menghabiskan uang dan temukan kebiasaan yang bisa kamu perbaiki.",
  },
  {
    number: "03",
    image: thirdFeatureIllustration,
    imageAlt: "Ilustrasi fitur memantau saldo dan tabungan Artoku",
    title: "Pantau saldo dan tabungan",
    description:
      "Bedakan saldo untuk kebutuhan sehari-hari dengan uang yang kamu sisihkan sebagai tabungan.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl">
        <header className="mx-auto max-w-3xl text-center">
          <h2 className="font-inter text-3xl leading-[1.15] font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl">
            Apa yang bisa kamu lakukan dengan <span className="text-[#14864A]">Artoku</span>?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl font-inter text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Kelola uang dengan lebih mudah, pahami kebiasaan finansialmu, dan tentukan langkah yang lebih baik untuk masa depan.
          </p>
        </header>

        <ol className="mt-12 flex flex-col gap-14 sm:mt-16 sm:gap-16 lg:mt-20 lg:gap-24">
          {STEPS.map((step, index) => (
            <li
              key={step.number}
              className={`flex flex-col gap-7 md:items-center md:gap-10 lg:gap-16 ${index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"}`}
            >
              <div className="flex w-full flex-col justify-center md:w-1/2">
                <span className="font-inter text-sm font-semibold tracking-[0.16em] text-[#14864A]">
                  {step.number}
                </span>
                <h3 className="mt-3 max-w-xl font-inter text-2xl leading-tight font-semibold tracking-[-0.03em] text-slate-950 sm:text-3xl lg:text-4xl">
                  {step.title}
                </h3>
                <p className="mt-4 max-w-xl font-inter text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                  {step.description}
                </p>
              </div>
              <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-3xl bg-[#F7FBF8] p-4 md:w-1/2 sm:p-6">
                {step.image ? (
                  <Image
                    src={step.image}
                    alt={step.imageAlt}
                    sizes="(max-width: 767px) 100vw, 50vw"
                    className={`h-full w-full object-contain ${index > 0 ? "scale-150" : ""}`}
                  />
                ) : (
                  <div aria-hidden="true" className="h-full w-full rounded-2xl bg-[#D9D9D9]" />
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
