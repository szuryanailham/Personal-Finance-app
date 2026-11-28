import { ArrowRight, NotebookPen, PiggyBank, Wallet } from "lucide-react";
import { KokuExpressionCards } from "@/components/home/koku-expression-cards";
import styles from "./value-proposition-section.module.css";

const topics = [
  {
    title: "Kenapa uang cepat habis sebelum akhir bulan?",
    description: "Rasanya nggak belanja besar, tapi kok saldo sudah menipis?",
    guide: "Coba cek pengeluaranmu selama seminggu. Jumlahkan biaya makan, ongkir, dan jajan. Dari situ, pilih satu pengeluaran yang bisa kamu kurangi minggu depan.",
    icon: Wallet,
    color: "bg-[#d7f290] text-[#0d4f30]",
  },
  {
    title: "Kenapa kita suka malas catat pengeluaran?",
    description: "Baru mau mulai, sudah kebayang ribetnya nyatet semua belanjaan.",
    guide: "Mulai dari satu transaksi hari ini. Cukup tulis berapa uang yang keluar dan dipakai buat apa. Misalnya, Rp15.000 buat makan siang.",
    icon: NotebookPen,
    color: "bg-[#ffd9d1] text-[#bb4937]",
  },
  {
    title: "Mau mulai nabung, buat apa dulu?",
    description: "Mulai dari dana darurat buat biaya mendadak, misalnya kalau motor rusak.",
    guide: "Sisihkan sedikit uang tiap gajian dan simpan terpisah dari uang sehari-hari. Kalau dana darurat sudah sesuai target, kamu bisa mulai nabung buat tujuan lain, seperti beli laptop, atau mulai investasi.",
    icon: PiggyBank,
    color: "bg-[#ddf5e6] text-[#14864a]",
  },
];

export function ValuePropositionSection() {
  return (
    <section id="features" aria-labelledby="value-proposition-title" className="scroll-mt-16 bg-[#fbf7ef] font-(family-name:--font-landing-inter)">
      <div className="mx-auto max-w-[70rem] px-5 pt-10 pb-16 sm:px-8 lg:w-[80%] lg:px-0 lg:pt-12 lg:pb-20">
        <p className="text-sm font-bold tracking-wider text-[#117541] uppercase">Belajar</p>
        <h2 id="value-proposition-title" className="mt-2 max-w-[13em] font-(family-name:--font-landing-heading) text-3xl leading-none font-extrabold tracking-tight text-[#0d4f30] sm:text-4xl lg:text-[clamp(2rem,3.25vw,3rem)]">
          Mulai dari yang lagi kamu alami
        </h2>
        <ul className="mt-8 grid items-start gap-4 md:grid-cols-3">
          {topics.map(({ title, description, guide, icon: Icon, color }) => (
            <li key={title} className={`relative rounded-3xl p-5 hover:z-10 hover:shadow-lg focus-within:z-10 has-[details[open]]:shadow-md motion-safe:transition-[translate,scale,box-shadow] motion-safe:duration-200 motion-safe:hover:-translate-y-1 motion-safe:hover:scale-[1.025] motion-safe:active:scale-[0.98] ${color}`}>
              <details name="landing-learning-guides" className={`group ${styles.guide}`}>
                <summary className="flex min-h-64 cursor-pointer list-none flex-col rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0d4f30] [&::-webkit-details-marker]:hidden">
                  <span className="grid size-11 place-items-center rounded-xl bg-white motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:-rotate-6 motion-safe:group-hover:scale-110">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <span className="mt-3 text-lg leading-tight font-bold text-[#132b2b]">{title}</span>
                  <span className="mt-3 pb-4 text-sm leading-relaxed text-[#334b4a]">{description}</span>
                  <span className="mt-auto flex items-center justify-between gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#132b2b] group-open:hidden">Baca panduan</span>
                    <span className="hidden rounded-full bg-white px-3 py-1 text-xs font-bold text-[#132b2b] group-open:inline">Tutup panduan</span>
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#14864a] text-white group-hover:bg-[#10733e]">
                      <ArrowRight aria-hidden="true" className="size-4 transition-transform group-open:rotate-90 motion-reduce:transition-none" />
                    </span>
                  </span>
                </summary>
                <div className="pt-4">
                  <p className="border-t border-[#0d4f30]/20 pt-4 text-sm leading-relaxed text-[#132b2b]">{guide}</p>
                </div>
              </details>
            </li>
          ))}
        </ul>

        <div className="mt-10 rounded-3xl border border-[#0d4f30]/12 bg-white p-5 sm:p-8 lg:mt-16">
          <h3 className="font-(family-name:--font-landing-heading) text-2xl font-extrabold tracking-tight text-[#0d4f30] sm:text-3xl">Kenalan sama Koku</h3>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-[#334b4a]">
            Koku nemenin kamu belajar, dari bingung sampai bangga. Ekspresinya ikut berubah sesuai perjalananmu.
          </p>
          <KokuExpressionCards />
        </div>
      </div>
    </section>
  );
}
