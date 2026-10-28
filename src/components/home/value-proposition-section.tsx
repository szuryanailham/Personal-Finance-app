import Image from "next/image";

import analysisIcon from "@/components/images/icons/anylisis keuangan-icon.svg";
import transactionIcon from "@/components/images/icons/catatan-transaction-icon.svg";
import balanceIcon from "@/components/images/icons/saldo-keuangan-icon.svg";
import historyIcon from "@/components/images/icons/riwayat transaksi.svg";

const FEATURE_CARDS = [
  {
    icon: balanceIcon,
    title: "Saldo Keuangan",
    description: "Lihat saldo utama dan tabungan secara terpisah.",
  },
  {
    icon: transactionIcon,
    title: "Catatan Transaksi",
    description: "Catat setiap pemasukan dan pengeluaran.",
  },
  {
    icon: analysisIcon,
    title: "Analisis Keuangan",
    description: "Catat setiap pemasukan dan pengeluaran.",
  },
  {
    icon: historyIcon,
    title: "Riwayat Transaksi",
    description: "Telusuri aktivitas keuangan berdasarkan tanggal.",
  },
] as const;

export function ValuePropositionSection() {
  return (
    <section className="bg-[#F7FBF8] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-7 md:grid-cols-[1.05fr_0.95fr] md:gap-12 lg:gap-20">
        <div className="max-w-2xl">
          <p className="mb-4 font-inter text-xs font-bold tracking-[0.34em] text-[#14864A] sm:text-sm">
            Powerful Features
          </p>
          <h2 className="font-inter text-3xl leading-[1.15] font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl">
            Make <span className="text-[#14864A]">Money</span> Make Sense.
          </h2>
        </div>
        <p className="max-w-xl font-inter text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 md:justify-self-end">
          Pahami kondisi keuanganmu, kelola pengeluaran dengan lebih terarah, dan bangun kebiasaan finansial yang lebih baik untuk masa depan.
        </p>
      </div>

      <ul className="mx-auto mt-10 grid w-full max-w-7xl grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:mt-16 lg:grid-cols-4 lg:gap-6">
        {FEATURE_CARDS.map((feature) => (
          <li
            key={feature.title}
            className="h-full rounded-2xl border border-[#14864A]/10 bg-white p-6 transition-colors hover:border-[#14864A]/30 sm:p-7"
          >
            <Image
              src={feature.icon}
              alt=""
              width={80}
              height={80}
              className="size-16 object-contain sm:size-20"
            />
            <h3 className="mt-5 font-inter text-lg leading-6 font-semibold text-slate-900">
              {feature.title}
            </h3>
            <p className="mt-2 font-inter text-sm leading-6 text-slate-600">
              {feature.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
