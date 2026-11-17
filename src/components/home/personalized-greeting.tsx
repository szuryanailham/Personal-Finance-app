"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { formatDate } from "@/components/cards/summary-period";
import { cn } from "@/lib/utils";

interface PersonalizedGreetingProps {
  className?: string;
  period?: { startDate?: string; endDate?: string; isLoading: boolean; error?: string | null };
}

export function PersonalizedGreeting({ className, period }: PersonalizedGreetingProps) {
  const { user } = useCurrentUser();
  const start = formatDate(period?.startDate);
  const end = formatDate(period?.endDate);
  const showRange = period && !period.isLoading && !period.error && start && end;
  const firstName = user?.firstName?.trim();

  return (
    <div className={cn("min-w-0", className)}>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 [overflow-wrap:anywhere] sm:text-3xl">
        {firstName ? `Halo, ${firstName}!` : "Halo!"}
      </h1>
      <p className="mt-2 text-sm text-slate-600 sm:text-base">
        {period ? (
          <>Ringkasan:  {showRange ? (
            <span className="font-medium text-slate-700"><span className="whitespace-nowrap">{start}</span> – <span className="whitespace-nowrap">{end}</span></span>
          ) : period.isLoading ? "Memuat…" : "–"}</>
        ) : "Yuk, lihat ringkasan keuanganmu hari ini."}
      </p>
    </div>
  );
}
