import Image from "next/image";

import firstFeatureIllustration from "@/components/images/illustrations/fiture-ilustration -1.svg";
import secondFeatureIllustration from "@/components/images/illustrations/fiture-ilustration -2.svg";
import thirdFeatureIllustration from "@/components/images/illustrations/fiture-ilustration -3.svg";

const STEPS = [
  {
    number: "01",
    image: firstFeatureIllustration,
    imageAlt: "Ilustrasi fitur pencatatan keuangan Artoku",
    title: "Catat Pemasukan dan Pengeluaran",
    description:
      "Simpan catatan uang masuk dan keluar dalam satu tempat agar transaksi sehari-hari tidak mudah terlupakan.",
  },
  {
    number: "02",
    image: secondFeatureIllustration,
    imageAlt: "Ilustrasi fitur memahami pola pengeluaran Artoku",
    title: "Bangun Kebiasaan Finansial yang Lebih Baik",
    description:
      "Mulai lebih sadar terhadap penggunaan uang dengan membiasakan diri mencatat aktivitas keuangan secara rutin.",
  },
  {
    number: "03",
    image: thirdFeatureIllustration,
    imageAlt: "Ilustrasi fitur memantau saldo dan tabungan Artoku",
    title: "Pahami Aktivitas Keuangan Pribadi",
    description:
      "Gunakan catatan keuanganmu untuk melihat kembali pemasukan dan pengeluaran, sehingga kamu dapat mengevaluasi kebiasaan menggunakan uang.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-title"
      className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl">
        <header className="mx-auto max-w-3xl text-center">
          <h2 id="how-it-works-title" className="font-inter text-3xl leading-[1.15] font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl">
            Kenapa Menggunakan<br />
            <span className="text-[#14864A]">MyArtoku?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl font-inter text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            MyArtoku membantu kamu mencatat transaksi dengan mudah, memantau kondisi keuangan, dan memahami kebiasaan pengeluaran agar lebih bijak mengelola uang.
          </p>
        </header>

        <ol className="mt-12 flex flex-col gap-14 sm:mt-16 sm:gap-16 lg:mt-20 lg:gap-24">
          {STEPS.map((step, index) => (
            <li
              key={step.number}
              className={`flex flex-col gap-7 md:items-center md:gap-10 lg:gap-16 ${index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"}`}
            >
              <div className="flex w-full flex-col justify-center md:min-w-0 md:flex-1">
                <span className="font-inter text-xl font-semibold tracking-[0.16em] text-[#14864A] sm:text-2xl">
                  {step.number}
                </span>
                <h3 className="mt-3 max-w-xl font-inter text-3xl leading-[1.15] font-bold tracking-[-0.03em] text-slate-950 sm:text-4xl lg:text-5xl">
                  {step.title}
                </h3>
                <p className="mt-4 max-w-xl font-inter text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                  {step.description}
                </p>
              </div>
              <div className="mx-auto flex aspect-square w-full max-w-96 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-[#F7FBF8] p-4 sm:max-w-md sm:p-6 md:mx-0 md:w-[45%] md:max-w-lg">
                {step.image ? (
                  <Image
                    src={step.image}
                    alt={step.imageAlt}
                    sizes="(max-width: 639px) min(352px, calc(100vw - 72px)), (max-width: 767px) 400px, (max-width: 1279px) 40vw, 464px"
                    className={`h-full w-full object-contain ${step.number === "02" || step.number === "03" ? "scale-125" : "scale-90 md:scale-100"}`}
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
