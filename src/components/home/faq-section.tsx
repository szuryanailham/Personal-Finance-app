"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "Apa itu MyArtoku?",
    answer:
      "MyArtoku adalah aplikasi pencatat keuangan pribadi yang membantu pengguna mencatat pemasukan dan pengeluaran, untuk memahami aktivitas keuangan sehari-hari.",
  },
  {
    question: "Apa manfaat menggunakan aplikasi pencatat keuangan?",
    answer:
      "MyArtoku adalah aplikasi pencatat keuangan pribadi yang membantu pengguna mencatat pemasukan dan pengeluaran, untuk memahami aktivitas keuangan sehari-hari.",
  },
  {
    question: "Siapa yang cocok menggunakan MyArtoku?",
    answer:
      "MyArtoku cocok untuk individu yang ingin mulai mencatat transaksi dan mengelola keuangan pribadi dengan lebih teratur.",
  },
  {
    question: "Bagaimana cara mulai menggunakan MyArtoku?",
    answer:
      "Kamu dapat membuat akun melalui halaman pendaftaran MyArtoku, kemudian mulai mencatat pemasukan dan pengeluaran.",
  },
] as const;

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24"
    >
      <div className="mx-auto w-full max-w-4xl">
        <h2
          id="faq-title"
          className="mx-auto max-w-3xl text-center font-inter text-3xl leading-[1.15] font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl"
        >
          Pertanyaan yang <span className="text-[#14864A]">Sering Diajukan</span>
        </h2>

        <div className="mt-10 divide-y divide-slate-200 border-y border-slate-200 sm:mt-12 lg:mt-16">
          {FAQ_ITEMS.map(({ question, answer }, index) => {
            const isOpen = openIndex === index;
            const questionId = `faq-question-${index}`;
            const answerId = `faq-answer-${index}`;

            return (
              <div key={question}>
                <h3>
                  <button
                    id={questionId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex min-h-20 w-full cursor-pointer items-center justify-between gap-5 py-6 text-left font-inter text-base leading-7 font-semibold text-slate-950 transition-colors hover:text-[#14864A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14864A] motion-reduce:transition-none sm:text-lg"
                  >
                    {question}
                    <Plus
                      aria-hidden="true"
                      className={`size-5 shrink-0 text-[#14864A] transition-transform duration-300 motion-reduce:transition-none ${isOpen ? "rotate-45" : "rotate-0"}`}
                    />
                  </button>
                </h3>
                <div
                  id={answerId}
                  role="region"
                  aria-labelledby={questionId}
                  aria-hidden={!isOpen}
                  inert={!isOpen}
                  className={`grid transition-[grid-template-rows,opacity,visibility] duration-300 ease-in-out motion-reduce:transition-none ${isOpen ? "visible grid-rows-[1fr] opacity-100" : "invisible grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="pb-6 pr-10 font-inter text-base leading-7 text-slate-600 sm:pb-8">
                      {answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
