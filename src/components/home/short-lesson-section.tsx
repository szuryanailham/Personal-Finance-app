"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, LoaderCircle, Target, X } from "lucide-react";

import thinkingKoku from "@/components/images/illustrations/koku/hmm-transparent.png";
import cheeringKoku from "@/components/images/illustrations/koku/hore-transparent.png";
import calmKoku from "@/components/images/illustrations/koku/tenang-transparent.png";

const answers = [
  { id: "A", text: "Tunggu akhir bulan, lalu lihat saldo yang tersisa" },
  { id: "B", text: "Catat setiap pesanan makan, lalu jumlahkan di akhir minggu" },
  { id: "C", text: "Kira-kira saja, rata-rata sekitar Rp20.000 per hari" },
] as const;

type Answer = (typeof answers)[number];

export function ShortLessonSection({ transactionHref }: { transactionHref: string }) {
  const [selected, setSelected] = useState<Answer | null>(null);
  const [result, setResult] = useState<Answer | null>(null);
  const isCorrect = result?.id === "B";
  const ResultIcon = isCorrect ? Check : X;

  useEffect(() => {
    if (!selected) return;

    const timer = window.setTimeout(() => setResult(selected), 400);
    return () => window.clearTimeout(timer);
  }, [selected]);

  return (
    <section aria-labelledby="short-lesson-title" className="bg-[#0d4f30] font-(family-name:--font-landing-inter)">
      <div className="mx-auto max-w-[70rem] px-5 py-12 sm:px-8 lg:w-[80%] lg:px-0 lg:py-16">
        <p className="text-sm font-bold tracking-wider text-[#c8f169] uppercase">Coba Pelajaran Singkat</p>
        <h2 id="short-lesson-title" className="mt-2 font-(family-name:--font-landing-heading) text-3xl leading-none font-extrabold tracking-tight text-white sm:text-4xl lg:text-[clamp(2rem,3.25vw,3rem)]">
          Uji instingmu dalam 30 detik
        </h2>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-5 text-[#132b2b] sm:p-6">
            <div className="flex items-start gap-3 rounded-2xl bg-[#fbf7ef] p-3">
              <Image src={thinkingKoku} alt="" width={48} height={48} className="shrink-0" />
              <p className="text-sm leading-relaxed">
                Dinda kerja di Jakarta. Senin sampai Jumat dia pesan makan siang lewat aplikasi: Rp32.000, Rp27.000, Rp41.000, Rp29.000, dan Rp35.000. Hari Jumat dia kaget, saldo tinggal sedikit.
              </p>
            </div>

            <fieldset className="mt-5">
              <legend className="text-lg leading-tight font-bold">
                Kalau ingin tahu total pengeluaran makan minggu ini, apa langkah pertamamu?
              </legend>
              <div className="mt-4 space-y-2">
                {answers.map((answer) => (
                  <label key={answer.id} className="relative flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-[#0d4f30]/25 px-3 py-2 text-sm hover:bg-[#fbf7ef] has-checked:border-[#14864a] has-checked:bg-[#ddf5e6] has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-[#14864a]">
                    <input
                      type="radio"
                      name="short-lesson-answer"
                      value={answer.id}
                      checked={selected?.id === answer.id}
                      onChange={() => {
                        setResult(null);
                        setSelected(answer);
                      }}
                      className="sr-only"
                    />
                    <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#0d4f30] font-bold text-white">{answer.id}</span>
                    <span>{answer.text}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="rounded-3xl bg-[#c8f169] p-5 text-[#132b2b] sm:p-6">
            <div aria-live="polite" aria-atomic="true">
              {result ? (
                <>
                  <p className={`flex items-center gap-3 rounded-xl border-2 bg-white p-3 text-sm font-semibold ${isCorrect ? "border-[#14864a]" : "border-red-600"}`}>
                    <ResultIcon aria-hidden="true" className={`size-5 shrink-0 rounded-full p-0.5 text-white ${isCorrect ? "bg-[#14864a]" : "bg-red-600"}`} />
                    {result.text}
                  </p>
                  <div className="mt-4 flex items-start gap-3">
                    <Image src={isCorrect ? cheeringKoku : calmKoku} alt="" width={56} height={56} className="shrink-0" />
                    <div>
                      <h3 className="text-lg font-bold">{isCorrect ? "Tepat sekali!" : "Coba cek dari catatanmu"}</h3>
                      <p className="mt-1 text-sm leading-relaxed">
                        {isCorrect
                          ? "Pengeluaran kecil gampang terlupa. Kalau dicatat, totalnya langsung kelihatan:"
                          : "Supaya tahu angka pastinya, catat setiap pesanan makan, lalu jumlahkan di akhir minggu. Hasilnya:"}{" "}
                        <strong>Rp164.000</strong> untuk makan siang minggu ini.
                      </p>
                    </div>
                  </div>
                </>
              ) : selected ? (
                <p className="flex min-h-12 items-center gap-3 rounded-xl bg-white p-3 text-sm font-semibold">
                  <LoaderCircle aria-hidden="true" className="size-5 shrink-0 text-[#0d4f30] motion-safe:animate-spin" />
                  Memeriksa jawaban…
                </p>
              ) : (
                <p className="text-sm font-semibold">Pilih satu jawaban untuk melihat penjelasannya.</p>
              )}
            </div>
            {result && (
              <div className="mt-5">
                <div className="flex items-center gap-3 rounded-xl bg-white p-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#ff785f] text-white">
                    <Target aria-hidden="true" className="size-4" />
                  </span>
                  <div>
                    <p className="text-xs font-bold tracking-wide text-[#bb4937] uppercase">Langkah hari ini</p>
                    <p className="text-sm font-bold">Coba catat pengeluaran makan hari ini.</p>
                  </div>
                </div>
                <Link href={transactionHref} className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#0d4f30] px-5 text-sm font-bold text-white hover:bg-[#146440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d4f30]">
                  Catat sekarang
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
