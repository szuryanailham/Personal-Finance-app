"use client"
import Image from "next/image";
import Link from "next/link";
import { SearchIcon } from "lucide-react";
import artokuLogo from "@/components/images/artoku-logo-color.png";
import filterIcon from "@/components/images/icons/filter-horizontal.svg";
import { FilterDrawer } from "@/components/header/filter-drawer";
import { useTransactionFilter } from "@/components/header/transaction-filter-context";
import { Spinner } from "@/components/ui/spinner";

interface MobileHeaderProps {
  onSearchClick?: () => void;
}

const iconButtonClass =
  "flex size-10 items-center justify-center text-slate-700 transition-opacity active:opacity-60";

// Header versi mobile: logo di kiri, tombol search & filter di kanan
export function MobileHeader({ onSearchClick }: MobileHeaderProps) {
  const { filter, setFilter, isFilterLoading } = useTransactionFilter();

  return (
    <header className="sticky top-0 z-40 bg-[#F5F1FF]/80 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/dashboard" aria-label="Artoku home">
          <Image src={artokuLogo} alt="Artoku" priority className="h-8 w-auto" />
        </Link>

        <div className="flex items-center gap-2">
          <button type="button" aria-label="Search" onClick={onSearchClick} className={iconButtonClass}>
            <SearchIcon className="size-5" />
          </button>
          {/* Tombol filter membuka drawer Filter Summary & Transactions */}
          <FilterDrawer
            value={filter}
            onApply={setFilter}
            isLoading={isFilterLoading}
            variant="mobile"
            trigger={
              <button type="button" aria-label="Filter" aria-busy={isFilterLoading} className={iconButtonClass}>
                {isFilterLoading ? (
                  <Spinner className="size-5" />
                ) : (
                  <Image src={filterIcon} alt="" className="size-5" />
                )}
              </button>
            }
          />
        </div>
      </div>
    </header>
  );
}
