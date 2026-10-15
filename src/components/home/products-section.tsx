import Image from "next/image";

import featureIcon from "@/components/images/icons/icon-fiture-1.svg";
import featureIcon2 from "@/components/images/icons/icon-fiture-2.svg";
import featureIcon3 from "@/components/images/icons/icon-fiture-3.svg";

const PRODUCT_ITEMS = [
  {
    icon: featureIcon,
    title: "Understand Your Spending",
    subtitle:
      "See exactly where your money goes with clear categories, charts, and monthly insights.",
  },
  {
    icon: featureIcon2,
    title: "Manage Money Effortlessly",
    subtitle:
      "Record, import, and organize transactions in seconds so your finances stay up to date.",
  },
  {
    icon: featureIcon3,
    title: "Build Better Financial Habits",
    subtitle:
      "Spot patterns, control expenses, and make smarter decisions for a healthier financial future.",
  },
] as const;

export function ProductsSection() {
  return (
    <section
      id="products"
      className="flex flex-col items-center gap-4 px-4 py-20 text-center md:py-28"
    >
      <h2 className="max-w-3xl font-display text-4xl leading-tight font-normal tracking-wide text-slate-900 md:text-5xl">
        Product WE WORK WITH
      </h2>
      <p className="max-w-2xl font-manrope text-base leading-relaxed text-slate-600 md:text-lg">
        Artoku delivers clear financial insights and smarter money management.
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
