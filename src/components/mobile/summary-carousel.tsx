"use client"
import { useEffect, useMemo, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { MobileSummaryCard } from "@/components/mobile/mobile-summary-card";
import { SUMMARY_CONFIG } from "@/components/cards/summary-config";
import { toStatQuery, useTransactionFilter } from "@/components/header/transaction-filter-context";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useTransactionStat } from "@/hooks/use-transaction-stat";
import { useHiddenAmounts } from "@/hooks/use-hidden-amounts";
import type { TransactionStat } from "@/lib/api/transaction";
import { cn } from "@/lib/utils";
import BalanceMobileIcon from "@/components/images/icons/mobile-balance.svg";
import IncomeMobileIcon from "@/components/images/icons/Income-mobile.svg";
import SavingMobileIcon from "@/components/images/icons/saving-icon-mobile.svg";
import ExpenseMobileIcon from "@/components/images/icons/outcome-icon -mobile.svg";

// Icon khusus mobile (latar ungu menyatu dengan card), menggantikan icon desktop di SUMMARY_CONFIG
const MOBILE_ICONS: Record<keyof TransactionStat, typeof BalanceMobileIcon> = {
  totalBalance: BalanceMobileIcon,
  totalIncome: IncomeMobileIcon,
  totalSaving: SavingMobileIcon,
  totalExpense: ExpenseMobileIcon,
};

const AUTOPLAY_DELAY_MS = 4000;

// Carousel card ringkasan untuk mobile: geser manual atau otomatis tiap beberapa detik
export function SummaryCarousel() {
  const { filter } = useTransactionFilter();
  const statQuery = useMemo(() => toStatQuery(filter), [filter]);
  const { stat, isLoading, error } = useTransactionStat(statQuery);
  const { isHidden, toggleHidden } = useHiddenAmounts();
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  // Instance plugin dibuat sekali (lazy state) agar tidak dibuat ulang setiap render.
  // Autoplay tetap jalan setelah digeser manual, dan mati jika user memilih reduced motion.
  const [autoplay] = useState(() =>
    Autoplay({
      delay: AUTOPLAY_DELAY_MS,
      stopOnInteraction: false,
      breakpoints: { "(prefers-reduced-motion: reduce)": { active: false } },
    })
  );

  // Sinkronkan indikator titik dengan slide yang sedang tampil (mulai dari slide 0)
  useEffect(() => {
    if (!api) return;
    const onSelect = () => setActiveIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section aria-label="Ringkasan transaksi" className="flex flex-col gap-3">
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: true }}
        plugins={[autoplay]}
      >
        <CarouselContent className="-ml-3">
          {SUMMARY_CONFIG.map(({ title, key }) => (
            <CarouselItem key={key} className="basis-[85%] pl-3">
              <MobileSummaryCard
                title={title}
                icon={MOBILE_ICONS[key]}
                total={stat?.[key].amount ?? 0}
                percentage={stat?.[key].changePercentage ?? 0}
                isLoading={isLoading}
                isHidden={isHidden}
                onToggleHidden={toggleHidden}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="flex justify-center gap-1.5">
        {SUMMARY_CONFIG.map(({ key, title }, index) => (
          <button
            key={key}
            type="button"
            aria-label={`Lihat ${title}`}
            aria-current={index === activeIndex}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-2 rounded-full transition-all",
              index === activeIndex ? "w-5 bg-[#6359E9]" : "w-2 bg-violet-200"
            )}
          />
        ))}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </section>
  );
}
