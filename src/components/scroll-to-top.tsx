"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setIsVisible(window.scrollY > 300);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      type="button"
      aria-label="Kembali ke atas"
      onClick={() => {
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });
      }}
      className="fixed right-5 bottom-[calc(6rem+env(safe-area-inset-bottom))] z-40 flex size-12 items-center justify-center rounded-full bg-[#14864A] text-white shadow-lg transition-colors hover:bg-[#10733e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14864A] md:hidden"
    >
      <ArrowUp className="size-6" aria-hidden="true" />
    </button>
  );
}
