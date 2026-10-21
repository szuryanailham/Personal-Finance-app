import Image from "next/image";

import featureIcon from "@/components/images/icons/icon-fiture-1.svg";
import featureIcon2 from "@/components/images/icons/icon-fiture-2.svg";
import featureIcon3 from "@/components/images/icons/icon-fiture-3.svg";

const PRODUCT_ITEMS = [
  {
    icon: featureIcon,
    title: "Pahami Pengeluaranmu",
    subtitle:
      "Lihat dengan jelas ke mana uangmu pergi lewat kategori, grafik, dan wawasan bulanan.",
  },
  {
    icon: featureIcon2,
    title: "Kelola Uang Tanpa Ribet",
    subtitle:
      "Catat, import, dan atur transaksi dalam hitungan detik agar keuanganmu selalu terbarui.",
  },
  {
    icon: featureIcon3,
    title: "Bangun Kebiasaan Finansial yang Lebih Baik",
    subtitle:
      "Kenali pola, kendalikan pengeluaran, dan ambil keputusan lebih cerdas demi masa depan finansial yang lebih sehat.",
  },
] as const;

export function ProductsSection() {
  return (
    <section
      id="products"
      className="flex flex-col items-center gap-4 px-4 py-20 text-center md:py-28"
    >
      <h2 className="max-w-3xl font-display text-4xl leading-tight font-normal tracking-wide text-slate-900 md:text-5xl">
        Produk yang Kami Kerjakan
      </h2>
      <p className="max-w-2xl font-manrope text-base leading-relaxed text-slate-600 md:text-lg">
        Artoku menghadirkan wawasan finansial yang jelas dan pengelolaan uang yang lebih cerdas.
      </p>
      <ol className="mt-12 grid w-full max-w-6xl divide-y divide-slate-200 text-center md:grid-cols-3 md:divide-x md:divide-y-0">
        {PRODUCT_ITEMS.map((item) => (
          <li
            key={item.title}
            className="flex flex-col items-center gap-3 px-8 py-8"
          >
            <Image src={item.icon} alt="" width={80} height={80} />
            <h3 className="max-w-60 font-display text-2xl leading-snug font-normal tracking-wide text-slate-900">
              {item.title}
            </h3>
            <p className="font-manrope text-base leading-relaxed text-slate-600">
              {item.subtitle}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
