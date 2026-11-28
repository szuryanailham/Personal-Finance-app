"use client";

import { useState } from "react";
import Image from "next/image";
import halo from "@/components/images/illustrations/koku/halo.png";
import hmm from "@/components/images/illustrations/koku/hmm.png";
import wah from "@/components/images/illustrations/koku/wah.png";
import yah from "@/components/images/illustrations/koku/yah.png";
import tenang from "@/components/images/illustrations/koku/tenang.png";
import hore from "@/components/images/illustrations/koku/hore.png";

const kokuExpressions = [
  { label: "Halo!", description: "Sapaan awal", image: halo, color: "bg-[#ddf5e6]" },
  { label: "Hmm...", description: "Lagi mikir", image: hmm, color: "bg-[#def6a5]" },
  { label: "Wah!", description: "Baru tahu total", image: wah, color: "bg-[#fff1c9]" },
  { label: "Yah...", description: "Saldo menipis", image: yah, color: "bg-[#ffd9d1]" },
  { label: "Tenang", description: "Pelan-pelan saja", image: tenang, color: "bg-[#ddf5e6]" },
  { label: "Hore!", description: "Misi selesai", image: hore, color: "bg-[#def6a5]" },
];

export function KokuExpressionCards() {
  const [selectedExpression, setSelectedExpression] = useState<string | null>(null);

  return (
    <ul className="mt-6 grid grid-cols-2 gap-3 min-[400px]:grid-cols-3 md:grid-cols-6">
      {kokuExpressions.map(({ label, description, image, color }) => (
        <li key={label}>
          <button
            type="button"
            aria-pressed={selectedExpression === label}
            onClick={() => setSelectedExpression((current) => current === label ? null : label)}
            className={`group relative flex h-full w-full cursor-pointer flex-col items-center rounded-xl px-2 py-3 text-center hover:z-10 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d4f30] aria-pressed:ring-2 aria-pressed:ring-[#117541] motion-safe:transition-[translate,scale,box-shadow] motion-safe:duration-200 motion-safe:hover:-translate-y-1 motion-safe:hover:scale-105 motion-safe:active:scale-95 ${color}`}
          >
            <Image
              src={image}
              alt=""
              sizes="56px"
              className="h-auto w-14 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:-rotate-6 motion-safe:group-hover:scale-110 motion-safe:group-aria-pressed:animate-in motion-safe:zoom-in-75 motion-safe:slide-in-from-bottom-2"
            />
            <span className="mt-1 text-sm font-bold text-[#132b2b]">{label}</span>
            <span className="text-xs text-[#334b4a]">{description}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
