import Link from "next/link";
import { ArrowRight, Bike, Cookie, Utensils } from "lucide-react";

const steps = [
  {
    title: "Catat transaksi",
    description: "Masukkan nominal dan nama, misalnya makan siang Rp28.000.",
  },
  {
    title: "Cek kategori pengeluaran",
    description: "Lihat mana yang paling besar: makan, ongkos kerja, atau jajan.",
  },
  {
    title: "Lihat ringkasanmu",
    description: "Ringkasan mingguan membantumu tahu sisa uang sampai gajian.",
  },
];

const categories = [
  { label: "Makan", amount: "Rp164.000", bar: "w-[70%] bg-[#ff785f]", icon: Utensils },
  { label: "Ongkos kerja", amount: "Rp75.000", bar: "w-[32%] bg-[#14864a]", icon: Bike },
  { label: "Jajan", amount: "Rp38.000", bar: "w-[16%] bg-[#c8f169]", icon: Cookie },
];

export function HowItWorksSection({ transactionHref }: { transactionHref: string }) {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-title" className="bg-[#fbf7ef] font-(family-name:--font-landing-inter)">
      <div className="mx-auto grid max-w-[70rem] items-center gap-8 px-5 py-12 sm:px-8 md:grid-cols-2 lg:w-[80%] lg:gap-12 lg:px-0 lg:py-16">
        <div>
          <h2 id="how-it-works-title" className="max-w-[14em] font-(family-name:--font-landing-heading) text-3xl leading-none font-extrabold tracking-tight text-[#0d4f30] sm:text-4xl lg:text-[clamp(2rem,3.25vw,3rem)]">
            Setelah belajar, coba catat satu transaksi
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#334b4a] sm:text-base">
            Tidak perlu langsung sempurna. Mulai dari makan siang tadi, nanti kebiasaanmu terbentuk sendiri. Soal anggaran dan tabungan, kamu bisa pelajari pelan-pelan di topik <Link href="#features" className="font-semibold text-[#0d4f30] underline underline-offset-2">Belajar</Link>.
          </p>

          <ol className="mt-6 space-y-3">
            {steps.map(({ title, description }, index) => (
              <li key={title} className="flex items-start gap-3 rounded-2xl border border-[#0d4f30]/12 bg-white p-4 text-[#132b2b]">
                <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-[#c8f169] text-sm font-bold text-[#0d4f30]">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-sm font-bold">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#334b4a]">{description}</p>
                </div>
              </li>
            ))}
          </ol>

          <Link href={transactionHref} className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#0d4f30] px-5 text-sm font-bold text-white hover:bg-[#146440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d4f30]">
            Mulai Catat di Artoku
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <div className="rounded-3xl bg-[#ddf5e6] p-4 sm:p-6">
          <p className="mb-2 text-right">
            <span className="rounded-full bg-[#ffd9d1] px-3 py-1 text-xs font-bold text-[#8f3528]">Contoh data</span>
          </p>
          <div className="rounded-2xl bg-white p-4 text-[#132b2b] shadow-sm sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold">Ringkasan minggu ini</h3>
              <span className="rounded-full bg-[#c8f169] px-2.5 py-1 text-xs font-semibold text-[#0d4f30]">Senin – Minggu</span>
            </div>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-[#0d4f30]">Rp164.000</p>
            <p className="mt-1 text-xs text-[#334b4a]">Total pengeluaran makan siang</p>

            <ul className="mt-5 space-y-3">
              {categories.map(({ label, amount, bar, icon: Icon }) => (
                <li key={label}>
                  <div className="flex items-center justify-between gap-2 text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Icon aria-hidden="true" className="size-4 text-[#14864a]" />
                      {label}
                    </span>
                    <span>{amount}</span>
                  </div>
                  <div aria-hidden="true" className="mt-1.5 h-2 rounded-full bg-[#fbf7ef]">
                    <div className={`h-full rounded-full ${bar}`} />
                  </div>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-2 border-t border-[#0d4f30]/12 pt-3 text-xs">
              <div className="flex justify-between gap-2">
                <dt><span className="font-semibold">Makan siang</span> · Hari ini</dt>
                <dd className="font-semibold">−Rp28.000</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt><span className="font-semibold">Ongkos kerja</span> · Hari ini</dt>
                <dd className="font-semibold">−Rp15.000</dd>
              </div>
            </dl>
            <Link href={transactionHref} className="mt-4 flex min-h-11 items-center justify-center rounded-full bg-[#14864a] px-4 text-sm font-bold text-white hover:bg-[#10733e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d4f30]">
              Catat Transaksi
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
