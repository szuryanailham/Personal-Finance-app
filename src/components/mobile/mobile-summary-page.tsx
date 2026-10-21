"use client"

import { TransactionChart } from "@/components/chart/transaction-chart";
import { useIsMobile } from "@/hooks/use-mobile";

export function MobileSummaryPage() {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col gap-4 px-4 pb-6">
      <h1 className="text-lg font-semibold text-slate-900">Ringkasan</h1>
      <section className="min-w-0 overflow-hidden rounded-2xl bg-white p-4">
        {isMobile && <TransactionChart />}
      </section>
    </div>
  );
}
